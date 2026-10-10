"use client";

import { createInitialState, migrateState, type GameState } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";
import { api, isUnreachable, packJournal, type AccountUser, type CloudSave } from "@/lib/api";
import type { GameStore } from "./store";
import { gameNow } from "@/lib/clock";

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

/** Where this page's id waits while the page reloads (see `pageId`). */
const PAGE_KEY = "idlebound.page";

/**
 * This page's id, by which the server knows which page plays the game. A reload of the same
 * tab keeps it (the server still sees the same page), a duplicated tab never shares it: the
 * key only exists while the page is away, so a copy made while it runs has none.
 */
function pageId(): string {
  try {
    const kept = sessionStorage.getItem(PAGE_KEY);
    sessionStorage.removeItem(PAGE_KEY);
    if (kept) return kept;
  } catch {
    // Storage blocked: a new id each load, the server only asks one question more.
  }
  return crypto.randomUUID();
}

/** The page goes: its id waits for the reload of the same tab (see `pageId`). */
function keepPageId(holder: string) {
  try {
    sessionStorage.setItem(PAGE_KEY, holder);
  } catch {
    // Storage blocked: the reload gets a new id.
  }
}

/**
 * Another page plays this game: "open" when this page found it so at load, "taken" when the
 * walker took it over from another page while this one played.
 */
export type Elsewhere = "open" | "taken";

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
  /** The game is played on another page: this one stands still until the walker takes it back. */
  elsewhere: Elsewhere | null = null;
  /** This page, for the server: one page at a time plays a game. */
  readonly holder = pageId();
  /** The stored game (the account's, or the guest's) was never read: nothing is uploaded over it. */
  private unread = false;
  /** The stored game is being read: no upload leaves before the comparison is made. */
  private reading = false;
  /** init() is still trying to load the game: it owns those attempts, the periodic sync waits. */
  private loading = false;
  /**
   * The session ended while an account's game was running: the id of that account. The game
   * is no guest's to keep, and no other account's to take.
   */
  private adrift: string | null = null;
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

  private set(patch: Partial<Pick<CloudSync, "status" | "message" | "user" | "lastSyncAt" | "revision" | "pendingChoice" | "reaching" | "elsewhere">>) {
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
        this.watchNetwork(),
        this.watchPage()
      ];
    }
    this.timer ??= setInterval(() => {
      if (Date.now() - this.lastUploadAt >= SYNC_INTERVAL_MS) void this.sync();
    }, SYNC_CHECK_MS);
    this.loading = true;
    try {
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
    } finally {
      if (run === this.generation) this.loading = false;
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
    const result = await api.openSave(this.holder, false, true);
    this.reading = false;
    if (!result.ok) {
      this.unread = true;
      this.set({ status: "error", message: result.error });
      return !isUnreachable(result);
    }
    this.unread = false;
    this.adrift = null;
    const kept = result.data.save;
    this.guestKept = kept !== null;
    if (!kept) {
      // Nothing kept yet: the first save follows the first blows.
      await this.restamp(true);
      this.set({ status: "idle" });
      return true;
    }
    const local = this.store.state;
    if (isFresh(local) || local.createdAt === kept.state.createdAt) this.take(kept, result.data.elsewhere, true);
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
    if (kept) this.place(kept, true);
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

  /** The page goes (a reload, a closed tab): its id waits for a reload of the same tab. */
  private watchPage() {
    const onHide = () => keepPageId(this.holder);
    // Back from the browser's page cache: the page runs on, its id is in hand again.
    const onShow = () => {
      try {
        sessionStorage.removeItem(PAGE_KEY);
      } catch {
        // Nothing was kept.
      }
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
    };
  }

  /**
   * After login, sign-up, or on start. False when the server did not answer: the account's
   * game is then still unread, and later syncs read it before writing anything.
   */
  async connect(user: AccountUser): Promise<boolean> {
    // A guest's save still on its way would be taken for the account's: let it land first.
    if (this.flight) await this.flight;
    // The game in hand is another account's, whose session ended here: it stays with that
    // account, and this one starts from a new game (or finds its own).
    if (this.adrift !== null && this.adrift !== user.id) await this.freshGame(false);
    // The same account signs in again: what was played since its session ended carries on
    // from the save it built on, if nothing else was saved meanwhile.
    const resumed = this.adrift === user.id ? this.revision : null;
    this.adrift = null;
    this.startOver = false;
    this.reading = true;
    this.set({ user, status: "syncing", message: null, revision: null });
    const result = await api.openSave(this.holder);
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
      await this.restamp(false);
      await this.upload(null, false);
      return true;
    }
    if (resumed === cloud.revision && local.createdAt === cloud.state.createdAt && !result.data.elsewhere) {
      this.set({ revision: cloud.revision });
      await this.upload(cloud.revision, false);
      return true;
    }
    if (isFresh(local) || local.createdAt === cloud.state.createdAt) {
      this.take(cloud, result.data.elsewhere, false);
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

  /** The stored game is this page's game: it runs here, or waits while another page plays it. */
  private take(cloud: CloudSave, elsewhere: boolean, guest: boolean) {
    if (!elsewhere) {
      this.adopt(cloud, guest);
      return;
    }
    // Shown as the server keeps it, standing still, under the question.
    this.place(cloud, guest);
    this.standAside("open", cloud.revision);
  }

  /** Another page plays the game: this one stops, and saves nothing until it is taken back. */
  private standAside(elsewhere: Elsewhere, revision = this.revision) {
    this.store.stop();
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    this.set({ elsewhere, status: "idle", message: null, revision });
  }

  /**
   * The walker plays here: the game is taken from the other page as the server last kept it,
   * and the other page stops at its next save. What it played since then is not kept.
   */
  async takeOver() {
    const guest = this.user === null;
    const result = await api.openSave(this.holder, true, guest);
    if (!result.ok) {
      this.set({ message: result.error });
      return;
    }
    const cloud = result.data.save;
    if (cloud) this.adopt(cloud, guest);
    // The game is gone from the server meanwhile: the one in hand is kept from scratch.
    else this.set({ pendingChoice: null, revision: null, status: "idle", message: null });
    const stood = this.elsewhere !== null;
    this.set({ elsewhere: null });
    if (stood) this.store.start();
    if (!cloud) void this.sync();
  }

  adopt(cloud: CloudSave, guest = this.user === null) {
    const awayMs = this.place(cloud, guest);
    this.store.apply({ type: "welcome", ms: Math.max(0, Math.round(awayMs)) });
    this.lastUploadAt = Date.now();
    this.set({ pendingChoice: null, status: this.saveBlocked() ? "unverified" : "synced", revision: cloud.revision, lastSyncAt: Date.now(), message: null });
    // The account's game was taken: the guest's game this browser carried is let go.
    if (this.user) this.releaseGuest();
  }

  /**
   * A game nobody has touched yet is born again as the server begins it: on the server's
   * clock (born on a device's clock running ahead, it would claim more time than it lived),
   * with the fates the server keeps for it.
   */
  private async restamp(guest: boolean) {
    const state = this.store.state;
    if (isUntouched(state) && state.maxStageEver === 1) await this.freshGame(guest);
  }

  /**
   * A new game, as the server begins it (the account's, or with `guest` this browser's). The
   * server unreachable, the game waits for its fates; the next sync asks again. False then.
   */
  private async freshGame(guest: boolean): Promise<boolean> {
    const result = await api.newGame(guest);
    const createdAt = result.ok ? result.data.createdAt : gameNow();
    this.store.replaceState(createInitialState(createdAt), { base: { revision: null, createdAt }, fates: result.ok ? result.data.fates : null });
    return result.ok;
  }

  /** Runs a stored game in this page (`guest`: the one kept for this browser). Returns how long the walker was gone (Welcome Back). */
  private place(cloud: CloudSave, guest: boolean): number {
    // A save written by an older version gets the same migration as on the server
    // (new fields, refunded altar levels) before it runs.
    const state = migrateState(cloud.state) as GameState;
    // Read before the load moves the clock.
    const awayMs = gameNow() - state.lastTickAt;
    // The company walked on while the game was closed: the first tick catches that time up,
    // never more than the server saw pass since the save (a device clock can be wrong).
    this.store.replaceState(state, {
      awayMs: Math.min(awayMs, cloud.elapsedMs),
      base: { revision: cloud.revision, createdAt: state.createdAt, ...(guest ? { guest: true } : {}) },
      fates: cloud.fates
    });
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
      // Taken as the server keeps it now, even from a page that plays it.
      await this.takeOver();
      return;
    }
    this.set({ pendingChoice: null, revision: cloud.revision });
    await this.upload(cloud.revision, true);
  }

  /**
   * One upload at a time: a call while one is under way waits for it and sends nothing.
   * Resolves true when the server kept the game.
   */
  private upload(baseRevision: number | null, replace: boolean, keepalive = false, leaving = false): Promise<boolean> {
    if (this.flight) return this.flight;
    if (this.adrift !== null) return Promise.resolve(false);
    this.flight = this.send(baseRevision, replace, keepalive, leaving).finally(() => {
      this.flight = null;
    });
    return this.flight;
  }

  private async send(baseRevision: number | null, replace: boolean, keepalive: boolean, leaving: boolean): Promise<boolean> {
    // Whose game this is when the request leaves; signing in meanwhile does not change it.
    const guest = this.user === null;
    this.lastUploadAt = Date.now();
    if (!keepalive) this.set({ status: "syncing" });
    // The server counts the time of the next save from the moment this one arrives: a game
    // sent before it caught up (the page just woke) would have that catch-up refused later.
    // The save leaves with the journal since the last one kept (see `GameStore.outgoing`).
    const outgoing = this.store.outgoing();
    const { state } = outgoing.checkpoint;
    // A keepalive request is capped at 64 KB by browsers: a larger save goes as a plain one.
    // It leaves at once (the page is going), so its journal is not compressed.
    const lasting = keepalive && new TextEncoder().encode(JSON.stringify({ state, journal: outgoing.journal })).length <= KEEPALIVE_MAX_BYTES;
    const journal = lasting ? outgoing.journal : await packJournal(outgoing.journal);
    // Out of sight or leaving, the page lets the game go once it is kept: another page opens it at once.
    const release = leaving || document.visibilityState === "hidden";
    const result = await api.putSave(state, baseRevision, { replace, keepalive: lasting, guest, holder: this.holder, release, journal, more: outgoing.more });
    if (result.ok) {
      this.store.kept(outgoing.checkpoint, result.data.revision, guest, result.data.fates);
      // The server kept the game it replayed: the page plays on from it.
      if (result.data.replay) this.store.correct(result.data.replay.state, result.data.replay.runtime);
      // A long journal goes in several saves: the next part follows soon.
      if (outgoing.more) this.requestSave();
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
        this.adrift = this.user?.id ?? null;
        this.set({ user: null, status: "offline", message: currentMessages().hud.errors.sessionExpired });
        break;
      case 409: {
        if (result.code === "game_elsewhere") {
          this.standAside("taken");
          break;
        }
        const cloud = await api.getSave(guest);
        if (cloud.ok && cloud.data.save) this.set({ pendingChoice: cloud.data.save, status: "idle", message: result.error });
        // The conflict could not be read: nothing was kept, and leaving now would lose it.
        else this.set({ status: "error", message: cloud.ok ? result.error : cloud.error });
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

  /**
   * The page comes back in sight: it saves soon, which holds the game again, or learns at once
   * that another page took it meanwhile.
   */
  resume() {
    if (Date.now() - this.lastUploadAt >= MIN_UPLOAD_GAP_MS) void this.sync();
    else this.requestSave();
  }

  /** Schedules an early save after a player action or a milestone. */
  requestSave() {
    if (this.adrift !== null || this.elsewhere || this.pendingChoice || this.status === "rejected" || this.status === "unverified" || this.saveTimer) return;
    const delay = Math.max(SAVE_DEBOUNCE_MS, this.lastUploadAt + MIN_UPLOAD_GAP_MS - Date.now());
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      if (this.flight) this.requestSave();
      else void this.sync();
    }, delay);
  }

  /** Periodic sync, after a player action, on page hide, or on logout. */
  async sync(options: { force?: boolean; keepalive?: boolean } = {}) {
    if (this.adrift !== null || this.elsewhere || this.pendingChoice || this.reading || this.loading) return;
    // The stored game was never read (server away at sign-in, or at load): read it first,
    // never write over it blind. A page-hide save has no time for that.
    if (this.unread) {
      if (!options.keepalive && !this.flight) await (this.user ? this.connect(this.user) : this.load());
      return;
    }
    const guest = this.user === null;
    // A new game whose fates never came (the server was away when it began): asked again.
    if (this.revision === null && isUntouched(this.store.state) && this.store.waiting) {
      await this.freshGame(guest);
      return;
    }
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
      // The reload is the same page: it keeps the game it holds. Kept now, as disposing
      // stops watching the page go.
      keepPageId(this.holder);
      this.dispose();
      return true;
    }
    // Another page took the game meanwhile: this one stands aside, it does not play on.
    if (!this.elsewhere) this.store.start();
    return false;
  }

  /**
   * The walker leaves the game for another page of the site (the page itself stays): what was
   * played is kept and the game let go, and coming back in this tab is the same page.
   */
  depart() {
    this.store.stop();
    const holds = this.keepsGame();
    this.dispose();
    if (!holds) return;
    keepPageId(this.holder);
    void (async () => {
      if (this.flight) await this.flight;
      if (this.keepsGame()) await this.upload(this.revision, false, true, true);
    })();
  }

  /** The stored game (an account's or a guest's) is loaded, and the server takes its saves: it can be handed over. */
  keepsGame() {
    return this.adrift === null && !this.elsewhere && this.revision !== null && !this.unread && !this.pendingChoice && this.status !== "rejected" && this.status !== "unverified";
  }

  /** Leaving the page now would lose what was played: the last saves failed, or the session ended. */
  wouldLose() {
    return this.status === "error" || this.adrift !== null;
  }

  /**
   * Starts a new guest game; the one the server keeps for this browser is replaced by the
   * next save. An account's game is never erased: signed in, nothing happens.
   */
  async newGame() {
    if (this.user) return;
    await this.freshGame(true);
    if (this.adrift !== null) {
      // The account's game stays on the account; from here on, a guest walks.
      this.adrift = null;
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
    this.adrift = null;
    this.startOver = false;
    const stood = this.elsewhere !== null;
    this.set({ user: null, status: "idle", revision: null, lastSyncAt: null, message: null, pendingChoice: null, elsewhere: null });
    await this.freshGame(true);
    if (stood) this.store.start();
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
