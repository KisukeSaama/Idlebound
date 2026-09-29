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

/**
 * Server save, the game's only persistence. Each upload carries the revision it builds on;
 * a conflict (another device, another game) triggers an explicit choice. Without an
 * account, the game is not kept.
 */
export class CloudSync {
  user: AccountUser | null = null;
  status: CloudStatus = "offline";
  message: string | null = null;
  lastSyncAt: number | null = null;
  revision: number | null = null;
  pendingChoice: CloudSave | null = null;
  /** Set while the server cannot be reached at load; null once it answered. */
  reaching: Reaching | null = null;
  /** Signed in, but the account's game was never read: nothing is uploaded over it. */
  private unread = false;
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
   * On start: existing session → load the server game. Resolves once the server answered:
   * a network failure never starts a blank guest game over an account's, it waits and tries
   * again (doubling delays, at once when the network comes back or on request).
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
      // The server answered but refused: the game runs unsigned, the reason shown.
      this.set({ status: "error", message: result.error });
      return true;
    }
    if (!result.data.user) {
      this.set({ status: "offline", message: null });
      return true;
    }
    return this.connect(result.data.user);
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
    if (this.user && this.status === "error") void this.sync();
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
    this.set({ user, status: "syncing", message: null, revision: null });
    const result = await api.getSave();
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
    const guestIsFresh = local.lifetime.playTime < 90 && local.lifetime.ascensions === 0 && local.maxStageEver <= 3;
    if (guestIsFresh || local.createdAt === cloud.state.createdAt) {
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
    // A save written by an older version gets the same migration as on the server
    // (new fields, refunded altar levels) before it runs.
    const state = migrateState(cloud.state) as GameState;
    // How long the walker was gone, read before the load moves the clock (Welcome Back).
    const awayMs = Date.now() - state.lastTickAt;
    // The company walked on while the game was closed: the first tick catches that time up,
    // never more than the server saw pass since the save (a device clock can be wrong).
    this.store.replaceState(state, { awayMs: Math.min(awayMs, cloud.elapsedMs) });
    this.store.apply((engine) => engine.welcomeBack(awayMs));
    this.lastUploadAt = Date.now();
    this.set({ pendingChoice: null, status: this.saveBlocked() ? "unverified" : "synced", revision: cloud.revision, lastSyncAt: Date.now(), message: null });
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
    if (!this.user) return Promise.resolve(false);
    this.flight = this.send(baseRevision, replace, keepalive).finally(() => {
      this.flight = null;
    });
    return this.flight;
  }

  private async send(baseRevision: number | null, replace: boolean, keepalive: boolean): Promise<boolean> {
    this.lastUploadAt = Date.now();
    if (!keepalive) this.set({ status: "syncing" });
    // The state is serialized as the request leaves, before any await: no copy is needed.
    // A keepalive request is capped at 64 KB by browsers: a larger save goes as a plain one.
    const lasting = keepalive && new TextEncoder().encode(JSON.stringify(this.store.state)).length <= KEEPALIVE_MAX_BYTES;
    const result = await api.putSave(this.store.state, baseRevision, replace, lasting);
    if (result.ok) {
      this.set({ status: "synced", revision: result.data.revision, lastSyncAt: Date.now(), message: null });
      return true;
    }
    switch (result.status) {
      case 401:
        this.set({ user: null, status: "offline", message: currentMessages().hud.errors.sessionExpired });
        break;
      case 409: {
        const cloud = await api.getSave();
        if (cloud.ok && cloud.data.save) this.set({ pendingChoice: cloud.data.save, status: "idle", message: result.error });
        break;
      }
      case 403:
        if (result.body?.code === "email-unverified") {
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
    if (!this.user || this.pendingChoice || this.status === "rejected" || this.status === "unverified" || this.saveTimer) return;
    const delay = Math.max(SAVE_DEBOUNCE_MS, this.lastUploadAt + MIN_UPLOAD_GAP_MS - Date.now());
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      if (this.flight) this.requestSave();
      else void this.sync();
    }, delay);
  }

  /** Periodic sync, after a player action, on page hide, or on logout. */
  async sync(options: { force?: boolean; keepalive?: boolean } = {}) {
    if (!this.user || this.pendingChoice) return;
    // The account's game was never read (server away at sign-in): read it first, never
    // write over it blind. A page-hide save has no time for that.
    if (this.unread) {
      if (!options.keepalive && !this.flight) await this.connect(this.user);
      return;
    }
    if (this.status === "rejected" && !options.force && Date.now() - this.rejectedAt < RETRY_AFTER_REJECT_MS) return;
    // Refused until the address is confirmed: setUser() resumes saving.
    if (this.status === "unverified" && !options.force) return;
    await this.upload(this.revision, false, options.keepalive);
  }

  /**
   * The last save before the page moves to a newer release: the game stops, and everything
   * played is on the server before the page goes. True once the server confirmed it (nothing
   * syncs any more); false when it could not, and the game runs on. A guest's game only lives
   * in this page, and a game the server refuses would lose what it played: never handed over.
   * Nor before the account's game is loaded (no revision yet): the page holds nothing of it.
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

  /** The account's game is loaded, and the server takes its saves: it can be handed over. */
  keepsGame() {
    return this.user !== null && this.revision !== null && !this.unread && !this.pendingChoice && this.status !== "rejected" && this.status !== "unverified";
  }

  /** Starts a new guest game. An account's game is never erased: signed in, nothing happens. */
  newGame() {
    if (this.user) return;
    this.store.replaceState(createInitialState());
  }

  async logout() {
    await this.sync({ force: true });
    await api.logout();
    this.unread = false;
    this.set({ user: null, status: "offline", revision: null, lastSyncAt: null, message: null, pendingChoice: null });
    // The game belongs to the account: the next guest starts from scratch.
    this.store.replaceState(createInitialState());
  }

  /** After the account was deleted. */
  forget() {
    this.unread = false;
    this.set({ user: null, status: "offline", revision: null, lastSyncAt: null, message: null, pendingChoice: null });
    this.store.replaceState(createInitialState());
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
