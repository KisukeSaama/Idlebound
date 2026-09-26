"use client";

import { createInitialState, type GameState } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";
import { api, type AccountUser, type CloudSave } from "@/lib/api";
import type { GameStore } from "./store";

export type CloudStatus = "offline" | "idle" | "syncing" | "synced" | "error" | "rejected";

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
const RETRY_AFTER_REJECT_MS = 10 * 60_000;

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
  private listeners = new Set<() => void>();
  private version = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private inFlight = false;
  private rejectedAt = 0;

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

  private set(patch: Partial<Pick<CloudSync, "status" | "message" | "user" | "lastSyncAt" | "revision" | "pendingChoice">>) {
    Object.assign(this, patch);
    this.emit();
  }

  /** On start: existing session → load the server game. */
  async init() {
    const result = await api.me();
    if (result.ok && result.data.user) await this.connect(result.data.user);
    else this.set({ status: result.ok ? "offline" : "error", message: result.ok ? null : result.error });
    this.timer ??= setInterval(() => void this.sync(), SYNC_INTERVAL_MS);
  }

  /** After login, sign-up, or on start. */
  async connect(user: AccountUser) {
    this.set({ user, status: "syncing", message: null, revision: null });
    const result = await api.getSave();
    if (!result.ok) {
      this.set({ status: "error", message: result.error });
      return;
    }
    const cloud = result.data.save;
    const local = this.store.state;
    if (!cloud) {
      // First save of the account: the game played as a guest becomes the account's game.
      await this.upload(null, false);
      return;
    }
    const guestIsFresh = local.lifetime.playTime < 90 && local.lifetime.ascensions === 0 && local.maxStageEver <= 3;
    if (guestIsFresh || local.createdAt === cloud.state.createdAt) {
      this.adopt(cloud);
      return;
    }
    // The guest game differs from the account's game: the player chooses.
    this.set({ pendingChoice: cloud, status: "idle" });
  }

  adopt(cloud: CloudSave) {
    this.store.replaceState(cloud.state);
    this.set({ pendingChoice: null, status: "synced", revision: cloud.revision, lastSyncAt: Date.now(), message: null });
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

  private async upload(baseRevision: number | null, replace: boolean, keepalive = false) {
    if (!this.user || this.inFlight) return;
    this.inFlight = true;
    if (!keepalive) this.set({ status: "syncing" });
    const result = await api.putSave(structuredClone(this.store.state), baseRevision, replace, keepalive);
    this.inFlight = false;
    if (result.ok) {
      this.set({ status: "synced", revision: result.data.revision, lastSyncAt: Date.now(), message: null });
      return;
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
      case 422: {
        this.rejectedAt = Date.now();
        const violations = (result.body?.violations as { code?: string }[] | undefined) ?? [];
        const texts = currentMessages().hud.violations;
        const code = violations[0]?.code;
        this.set({ status: "rejected", message: (code && Object.hasOwn(texts, code) ? texts[code] : undefined) ?? texts.generic });
        break;
      }
      case 429:
        this.set({ status: "idle", message: null });
        break;
      default:
        this.set({ status: "error", message: result.error });
    }
  }

  /** Periodic sync, on page hide, or manual. */
  async sync(options: { force?: boolean; keepalive?: boolean } = {}) {
    if (!this.user || this.pendingChoice) return;
    if (this.status === "rejected" && !options.force && Date.now() - this.rejectedAt < RETRY_AFTER_REJECT_MS) return;
    await this.upload(this.revision, false, options.keepalive);
  }

  /** Starts a new game and explicitly replaces the server one. */
  async newGame() {
    this.store.replaceState(createInitialState());
    if (this.user) await this.upload(this.revision, true);
  }

  async logout() {
    await this.sync({ force: true });
    await api.logout();
    this.set({ user: null, status: "offline", revision: null, lastSyncAt: null, message: null, pendingChoice: null });
    // The game belongs to the account: the next guest starts from scratch.
    this.store.replaceState(createInitialState());
  }

  /** After the account was deleted. */
  forget() {
    this.set({ user: null, status: "offline", revision: null, lastSyncAt: null, message: null, pendingChoice: null });
    this.store.replaceState(createInitialState());
  }

  dispose() {
    if (this.timer) clearInterval(this.timer);
  }
}
