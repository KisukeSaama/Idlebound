"use client";

import { createInitialState, migrateState, type GameState } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";
import { api, isUnreachable, type AccountUser, type CloudSave } from "@/lib/api";
import type { GameStore } from "./store";

export type CloudStatus = "offline" | "idle" | "syncing" | "synced" | "error" | "rejected" | "unverified";

export interface SaveSummary {
  maxStage: number;
  ascensions: number;
  playTime: number;
  savedAt: number;
}

export function summarize(state: GameState): SaveSummary {
  return {
    maxStage: state.maxStageEver,
    ascensions: state.lifetime.ascensions,
    playTime: state.lifetime.playTime + state.lifetime.offlineSeconds,
    savedAt: state.lastTickAt
  };
}

/** The save only lives on the server: sync often so nothing is lost. */
const SYNC_INTERVAL_MS = 30_000;
const SYNC_CHECK_MS = 5_000;
/** A player action or a milestone saves soon after, grouping bursts of actions. */
const SAVE_DEBOUNCE_MS = 3_000;
/** Keeps uploads under the API limit (6 per minute), with room for page-hide saves. */
const MIN_UPLOAD_GAP_MS = 15_000;
const RETRY_AFTER_REJECT_MS = 10 * 60_000;
/** Under the browsers' 64 KB keepalive limit, with room for the request's other fields. */
const KEEPALIVE_MAX_BYTES = 60_000;
/** Reaching the server at load: first retry after this long, doubling up to the cap. */
const REACH_FIRST_MS = 2_000;
const REACH_MAX_MS = 60_000;

/** The server did not answer at load: the game waits for it rather than starting blank. */
export interface Reaching {
  attempts: number;
  /** When the next attempt starts (ms since epoch). */
  nextAt: number;
}

/** A guest game short enough to give way to the account's without asking. */
function isFresh(state: GameState): boolean {
  return state.lifetime.playTime < 90 && state.lifetime.ascensions === 0 && state.maxStageEver <= 3;
}

/** Nothing played yet: a page merely opened leaves no game on the server. */
function isUntouched(state: GameState): boolean {
  return state.lifetime.clicks === 0 && state.lifetime.kills === 0;
}

/**
 * Server save, the game's only persistence. Each upload carries the revision it builds on;
 * a conflict (another device, another game) triggers an explicit choice. Signed in, the game
 * is the account's. Without an account it is kept all the same, as a guest's: the server
 * finds it by an httpOnly cookie of this browser, and an account adopts it later.
 */
export class CloudSync {
  user: AccountUser | null = null;
  /** "offline" only when the session ended under an account's game: nothing is kept until sign-in. */
  status: CloudStatus = "idle";
  message: string | null = null;
  lastSyncAt: number | null = null;
  revision: number | null = null;
  pendingChoice: CloudSave | null = null;
  /** Set while the server cannot be reached at load; null once it answered. */
  reaching: Reaching | null = null;
  /** The stored game (the account's, or the guest's) was never read: nothing is uploaded over it. */
  private unread = false;
  /** The stored game is being read: no upload leaves before the comparison is made. */
  private reading = false;
  /** The session ended while an account's game was running: it is no guest's game to keep. */
  private adrift = false;
  /** The server holds a guest's game for this browser. */
  private guestKept = false;
  /** The guest asked for a new game: the next save replaces the one the server keeps. */
  private startOver = false;
  /** Each init() and dispose() starts a new generation: an older retry loop stops. */
  private generation = 0;
  private wake: (() => void) | null = null;
  private listeners = new Set<() => void>();
  private version = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  /** The upload under way, if any. */
  private flight: Promise<boolean> | null = null;
  private rejectedAt = 0;
  private lastUploadAt = 0;
  private unsubscribes: (() => void)[] = [];

  constructor(private store: GameStore) {}

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = () => this.version;

  private emit() {
    this.version += 1;
    for (const listener of this.listeners) listener();
  }

  private set(patch: Partial<Pick<CloudSync, "status" | "message" | "user" | "lastSyncAt" | "revision" | "pendingChoice" | "reaching">>) {
    Object.assign(this, patch);
    this.emit();
  }

  /**
   * On start: load the game the server keeps, the account's or the guest's. Resolves once the
   * server answered: a network failure never starts a blank game over a kept one, it waits
   * and tries again (doubling delays, at once when the network comes back or on request).
   */
  async init() {
    const run = ++this.generation;
    if (this.unsubscribes.length === 0) {
      this.unsubscribes = [
        this.store.onAction(() => this.requestSave()),
        this.store.onFx((event) => {
          if (event.type === "achievement" || event.type === "loot" || (event.type === "stage" && event.biomeChanged)) this.requestSave();
        }),
        this.watchReturn(),
        this.watchNetwork()
      ];
    }
    this.timer ??= setInterval(() => {
      if (Date.now() - this.lastUploadAt >= SYNC_INTERVAL_MS) void this.sync();
    }, SYNC_CHECK_MS);
    for (let attempt = 0; ; attempt += 1) {
      const answered = await this.load();
      if (run !== this.generation) return;
      if (answered) {
        if (this.reaching) this.set({ reaching: null });
        return;
      }
      const delay = Math.min(REACH_MAX_MS, REACH_FIRST_MS * 2 ** attempt);
      this.set({ reaching: { attempts: attempt + 1, nextAt: Date.now() + delay } });
      await this.pause(delay);
      if (run !== this.generation) return;
    }
  }

  /** One attempt to read the session and its game; false when the server did not answer. */
  private async load(): Promise<boolean> {
    const result = await api.me();
    if (!result.ok) {
      if (isUnreachable(result)) return false;
      // The server answered but refused: the game runs, the reason shown, and nothing is
      // sent until the stored game could be read.
      this.unread = true;
      this.set({ status: "error", message: result.error });
      return true;
    }
    this.guestKept = result.data.guest === true;
    if (!result.data.user) return this.enter();
    // Signed in, and this browser still carries a guest's game (the choice was left open):
    // it is the game at hand, so the account is asked about it again.
    if (this.guestKept && !(await this.recall())) return false;
    return this.connect(result.data.user);
  }

  /**
   * No session: the game this browser played as a guest, if the server still keeps one.
   * False when the server did not answer.
   */
  private async enter(): Promise<boolean> {
    this.reading = true;
    this.set({ user: null, status: "syncing", message: null, revision: null });
    const result = await api.getSave(true);
    this.reading = false;
    if (!result.ok) {
      this.unread = true;
      this.set({ status: "error", message: result.error });
      return !isUnreachable(result);
    }
    this.unread = false;
    this.adrift = false;
    const kept = result.data.save;
    this.guestKept = kept !== null;
    if (!kept) {
      // Nothing kept yet: the first save follows the first blows.
      this.set({ status: "idle" });
      return true;
    }
    const local = this.store.state;
    if (isFresh(local) || local.createdAt === kept.state.createdAt) this.adopt(kept);
    // Played on while the kept game could not be read: the walker chooses.
    else this.set({ pendingChoice: kept, status: "idle" });
    return true;
  }

  /** Puts the guest's game the server kept back in hand, before the account is asked. False when the server did not answer. */
  private async recall(): Promise<boolean> {
    const result = await api.getSave(true);
    if (!result.ok) {
      if (isUnreachable(result)) return false;
      // Unread, so never let go of: it waits on the server for another load.
      this.guestKept = false;
      return true;
    }
    const kept = result.data.save;
    this.guestKept = kept !== null;
    if (kept) this.place(kept);
    return true;
  }

  /** Waits `ms`, or less if `retryNow()` is called. */
  private pause(ms: number) {
    return new Promise<void>((resolve) => {
      const done = () => {
        clearTimeout(timer);
        if (this.wake === done) this.wake = null;
        resolve();
      };
      const timer = setTimeout(done, ms);
      this.wake = done;
    });
  }

  /** Tries the server again at once: at load, or when uploads were failing. */
  retryNow = () => {
    if (this.wake) {
      this.wake();
      return;
    }
    if (this.status === "error") void this.sync();
  };

  /** The network came back: whatever waited on it goes now. */
  private watchNetwork() {
    const onOnline = () => this.retryNow();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }

  /**
   * After login, sign-up, or on start. False when the server did not answer: the account's
   * game is then still unread, and later syncs read it before writing anything.
   */
  async connect(user: AccountUser): Promise<boolean> {
    // A guest's save still on its way would be taken for the account's: let it land first.
    if (this.flight) await this.flight;
    this.adrift = false;
    this.startOver = false;
    this.reading = true;
    this.set({ user, status: "syncing", message: null, revision: null });
    const result = await api.getSave();
    this.reading = false;
    if (!result.ok) {
      this.unread = true;
      this.set({ status: "error", message: result.error });
      return !isUnreachable(result);
    }
    this.unread = false;
    const cloud = result.data.save;
    const local = this.store.state;
    if (!cloud) {
      // First save of the account: the game played as a guest becomes the account's game.
      await this.upload(null, false);
      return true;
    }
    if (isFresh(local) || local.createdAt === cloud.state.createdAt) {
      this.adopt(cloud);
      return true;
    }
    // The guest game differs from the account's game: the player chooses.
    this.set({ pendingChoice: cloud, status: "idle" });
    return true;
  }

  /** Back on the tab after clicking the confirmation link elsewhere: pick up the new account state. */
  private watchReturn() {
    const onReturn = () => {
      if (document.visibilityState === "visible" && this.user && !this.user.emailVerified) void this.refreshUser();
    };
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => {
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }

  async refreshUser() {
    const result = await api.me();
    if (!result.ok || !result.data.user || !this.user) return;
    this.setUser(result.data.user);
  }

  /** New account data (address confirmed or changed); saving resumes once confirmed. */
  setUser(user: AccountUser) {
    const unblocked = this.status === "unverified" && user.emailVerified;
    this.set({ user, ...(unblocked ? { status: "idle" as const, message: null } : {}) });
    if (unblocked) void this.sync();
  }

  adopt(cloud: CloudSave) {
    const awayMs = this.place(cloud);
    this.store.apply((engine) => engine.welcomeBack(awayMs));
    this.lastUploadAt = Date.now();
    this.set({ pendingChoice: null, status: this.saveBlocked() ? "unverified" : "synced", revision: cloud.revision, lastSyncAt: Date.now(), message: null });
    // The account's game was taken: the guest's game this browser carried is let go.
    if (this.user) this.releaseGuest();
  }

  /** Runs a stored game in this page. Returns how long the walker was gone (Welcome Back). */
  private place(cloud: CloudSave): number {
    // A save written by an older version gets the same migration as on the server
    // (new fields, refunded altar levels) before it runs.
    const state = migrateState(cloud.state) as GameState;
    // Read before the load moves the clock.
    const awayMs = Date.now() - state.lastTickAt;
    // The company walked on while the game was closed: the first tick catches that time up,
    // never more than the server saw pass since the save (a device clock can be wrong).
    this.store.replaceState(state, { awayMs: Math.min(awayMs, cloud.elapsedMs) });
    return awayMs;
  }

  /** Signed in and the account's game settled: one game, one keeper. */
  private releaseGuest() {
    if (!this.guestKept) return;
    this.guestKept = false;
    void api.dropGuestSave();
  }

  /** Past the deadline to confirm the address: the server refuses saves. */
  private saveBlocked() {
    const verifyBy = this.user?.emailVerified === false ? this.user.verifyBy : null;
    return verifyBy !== null && verifyBy !== undefined && Date.parse(verifyBy) <= Date.now();
  }

  async resolveChoice(choice: "local" | "cloud") {
    const cloud = this.pendingChoice;
    if (!cloud) return;
    if (choice === "cloud") {
      this.adopt(cloud);
      return;
    }
    this.set({ pendingChoice: null, revision: cloud.revision });
    await this.upload(cloud.revision, true);
  }

  /**
   * One upload at a time: a call while one is under way waits for it and sends nothing.
   * Resolves true when the server kept the game.
   */
  private upload(baseRevision: number | null, replace: boolean, keepalive = false): Promise<boolean> {
    if (this.flight) return this.flight;
    if (this.adrift) return Promise.resolve(false);
    this.flight = this.send(baseRevision, replace, keepalive).finally(() => {
      this.flight = null;
    });
    return this.flight;
  }

  private async send(baseRevision: number | null, replace: boolean, keepalive: boolean): Promise<boolean> {
    // Whose game this is when the request leaves; signing in meanwhile does not change it.
    const guest = this.user === null;
    this.lastUploadAt = Date.now();
    if (!keepalive) this.set({ status: "syncing" });
    // The server counts the time of the next save from the moment this one arrives: a game
    // sent before it caught up (the page just woke) would have that catch-up refused later.
    this.store.advance();
    // The state is serialized as the request leaves, before any await: no copy is needed.
    // A keepalive request is capped at 64 KB by browsers: a larger save goes as a plain one.
    const lasting = keepalive && new TextEncoder().encode(JSON.stringify(this.store.state)).length <= KEEPALIVE_MAX_BYTES;
    const result = await api.putSave(this.store.state, baseRevision, replace, lasting, guest);
    if (result.ok) {
      if (guest) {
        this.guestKept = true;
        if (replace) this.startOver = false;
      }
      this.set({ status: "synced", revision: result.data.revision, lastSyncAt: Date.now(), message: null });
      // The guest's game is the account's now (the server moved it; a stray one is let go).
      if (!guest) this.releaseGuest();
      return true;
    }
    switch (result.status) {
      case 401:
        // The account's game is not a guest's to keep: nothing is sent until the walker signs in.
        this.adrift = true;
        this.set({ user: null, status: "offline", message: currentMessages().hud.errors.sessionExpired });
        break;
      case 409: {
        const cloud = await api.getSave(guest);
        if (cloud.ok && cloud.data.save) this.set({ pendingChoice: cloud.data.save, status: "idle", message: result.error });
        break;
      }
      case 403:
        if (result.code === "email_unverified") {
          this.set({ status: "unverified", message: result.error });
          break;
        }
        this.set({ status: "error", message: result.error });
        break;
      case 422: {
        this.rejectedAt = Date.now();
        const violations = (result.body?.violations as { code?: string }[] | undefined) ?? [];
        const messages = currentMessages();
        const texts = messages.hud.violations;
        const code = violations[0]?.code;
        const reason = (code && Object.hasOwn(texts, code) ? texts[code] : undefined) ?? texts.generic;
        // The Ledger's voice first, the plain reason next to it.
        this.set({ status: "rejected", message: `${messages.account.ledger.refused}. ${reason}` });
        break;
      }
      case 429:
        this.set({ status: "idle", message: null });
        break;
      default:
        this.set({ status: "error", message: result.error });
    }
    return false;
  }

  /** Schedules an early save after a player action or a milestone. */
  requestSave() {
    if (this.adrift || this.pendingChoice || this.status === "rejected" || this.status === "unverified" || this.saveTimer) return;
    const delay = Math.max(SAVE_DEBOUNCE_MS, this.lastUploadAt + MIN_UPLOAD_GAP_MS - Date.now());
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      if (this.flight) this.requestSave();
      else void this.sync();
    }, delay);
  }

  /** Periodic sync, after a player action, on page hide, or on logout. */
  async sync(options: { force?: boolean; keepalive?: boolean } = {}) {
    if (this.adrift || this.pendingChoice || this.reading) return;
    // The stored game was never read (server away at sign-in, or at load): read it first,
    // never write over it blind. A page-hide save has no time for that.
    if (this.unread) {
      if (!options.keepalive && !this.flight) await (this.user ? this.connect(this.user) : this.load());
      return;
    }
    const guest = this.user === null;
    // A guest who has not struck a blow has nothing to keep: a page merely opened leaves no
    // game on the server.
    if (guest && this.revision === null && isUntouched(this.store.state)) return;
    if (this.status === "rejected" && !options.force && Date.now() - this.rejectedAt < RETRY_AFTER_REJECT_MS) return;
    // Refused until the address is confirmed: setUser() resumes saving.
    if (this.status === "unverified" && !options.force) return;
    await this.upload(this.revision, guest && this.startOver, options.keepalive);
  }

  /**
   * The last save before the page moves to a newer release: the game stops, and everything
   * played is on the server before the page goes. True once the server confirmed it (nothing
   * syncs any more); false when it could not, and the game runs on. A game the server refuses
   * would lose what it played: never handed over. Nor before the stored game is loaded or a
   * guest's first save is kept (no revision yet): the server holds nothing of this page.
   */
  async handOver(): Promise<boolean> {
    if (!this.keepsGame()) return false;
    this.store.stop();
    // An upload under way carries an older state: wait for it (its answer may change the
    // check above), then send the last one. Keepalive: it lands even if the page closes.
    if (this.flight) await this.flight;
    if (this.keepsGame() && (await this.upload(this.revision, false, true))) {
      this.dispose();
      return true;
    }
    this.store.start();
    return false;
  }

  /** The stored game (an account's or a guest's) is loaded, and the server takes its saves: it can be handed over. */
  keepsGame() {
    return !this.adrift && this.revision !== null && !this.unread && !this.pendingChoice && this.status !== "rejected" && this.status !== "unverified";
  }

  /** Leaving the page now would lose what was played: the last saves failed, or the session ended. */
  wouldLose() {
    return this.status === "error" || this.adrift;
  }

  /**
   * Starts a new guest game; the one the server keeps for this browser is replaced by the
   * next save. An account's game is never erased: signed in, nothing happens.
   */
  newGame() {
    if (this.user) return;
    this.store.replaceState(createInitialState());
    if (this.adrift) {
      // The account's game stays on the account; from here on, a guest walks.
      this.adrift = false;
      this.set({ status: "idle", revision: null, lastSyncAt: null, message: null });
    }
    this.startOver = this.revision !== null;
    if (this.startOver) void this.sync({ force: true });
  }

  async logout() {
    await this.sync({ force: true });
    await api.logout();
    await this.leave();
  }

  /** After the account was deleted. */
  forget() {
    void this.leave();
  }

  /**
   * The account is gone from this page, and its game with it: a guest walks on, from scratch
   * or from the guest's game this browser still carries (a choice left open).
   */
  private async leave() {
    this.unread = false;
    this.adrift = false;
    this.startOver = false;
    this.set({ user: null, status: "idle", revision: null, lastSyncAt: null, message: null, pendingChoice: null });
    this.store.replaceState(createInitialState());
    if (this.guestKept) await this.enter();
  }

  dispose() {
    // An init() still trying to reach the server stops there.
    this.generation += 1;
    this.wake?.();
    if (this.timer) clearInterval(this.timer);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.timer = null;
    this.saveTimer = null;
    for (const unsubscribe of this.unsubscribes) unsubscribe();
    this.unsubscribes = [];
  }
}
