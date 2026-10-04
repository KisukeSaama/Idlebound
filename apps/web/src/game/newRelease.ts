"use client";

import { useEffect, useRef, useState } from "react";
import { onNewerRelease, ownRelease, ownVersion, type ServerRelease } from "@/lib/release";
import { audio } from "./audio";
import type { CloudSync } from "./cloud";

const CHECK_MS = 5_000;
/** The update screen runs this long before the page goes (kept in step with game.css). */
export const UPDATE_MS = 1_600;
/** On the new page, the update screen finishes and stays this long once the game is ready. */
export const ARRIVAL_MS = 1_400;
/**
 * The release this tab already reloaded for. A page still older after that (a cache in the
 * way) does not reload again. A convenience of this tab, never game state.
 */
const RELOADED_KEY = "idlebound:release:reloaded-for";
/** The versions of the update under way, for the new page to finish its screen. */
const ARRIVAL_KEY = "idlebound:release:arrival";

/**
 * The version a page leaves and the one it moves to; either is empty when unknown. Both are
 * the same when the release changed but the version was not raised (a fix too small for it).
 */
export interface ReleaseUpdate {
  from: string;
  to: string;
}

function reloadedFor(): string | null {
  try {
    return window.sessionStorage.getItem(RELOADED_KEY);
  } catch {
    return null;
  }
}

function rememberReload(release: string, update: ReleaseUpdate) {
  try {
    window.sessionStorage.setItem(RELOADED_KEY, release);
    window.sessionStorage.setItem(ARRIVAL_KEY, JSON.stringify({ ...update, release }));
  } catch {
    // Without storage, a page that stays older may reload once per newer answer: still safe.
  }
}

/**
 * The update this page arrives from, read once: only when the page runs the release the
 * update moved to (a page still older, a cache in the way, does not claim it). The release,
 * not the version: several releases can carry the same version.
 */
export function takeArrival(): ReleaseUpdate | null {
  try {
    const stored = window.sessionStorage.getItem(ARRIVAL_KEY);
    window.sessionStorage.removeItem(ARRIVAL_KEY);
    if (!stored) return null;
    const update = JSON.parse(stored) as Partial<ReleaseUpdate> & { release?: string };
    const own = ownRelease();
    if (!own || update.release !== own) return null;
    return { from: typeof update.from === "string" ? update.from : "", to: ownVersion() };
  } catch {
    return null;
  }
}

/** From the fade to the reload, no input reaches the game: nothing played is left behind. */
function holdInput(): () => void {
  const swallow = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const types = ["pointerdown", "click", "keydown"] as const;
  for (const type of types) window.addEventListener(type, swallow, true);
  return () => {
    for (const type of types) window.removeEventListener(type, swallow, true);
  };
}

export interface NewReleaseHost {
  /** Nothing is open or waiting on screen that a reload would take away. */
  calm(): boolean;
  /** The update screen covers the scene before the page goes, or leaves it when it stays (null). */
  show(update: ReleaseUpdate | null): void;
  reload(): void;
}

/**
 * A newer release was deployed while the game was open: as soon as everything played is on
 * the server, the page reloads onto it. A hidden page goes at once. A watched page goes as
 * soon as nothing a reload would take away is on screen (a scene, a chest, a toast), held
 * from input while the update screen names the version on its way. A game the server does
 * not keep never reloads (see CloudSync.handOver).
 */
export class NewRelease {
  private target: ServerRelease | null = null;
  private busy = false;
  private disposed = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private cleanups: (() => void)[] = [];

  constructor(
    private cloud: CloudSync,
    private host: NewReleaseHost
  ) {}

  start() {
    const onVisibility = () => void this.attempt();
    document.addEventListener("visibilitychange", onVisibility);
    this.cleanups = [
      onNewerRelease((server) => this.found(server)),
      () => document.removeEventListener("visibilitychange", onVisibility)
    ];
  }

  private found(server: ServerRelease) {
    if (this.target?.release === server.release || reloadedFor() === server.release) return;
    this.target = server;
    this.timer ??= setInterval(() => void this.attempt(), CHECK_MS);
    void this.attempt();
  }

  /** Moves to the newer release if the moment is right. True when the page is going. */
  async attempt(): Promise<boolean> {
    const target = this.target;
    if (!target || this.busy || this.disposed || !this.cloud.keepsGame()) return false;
    const hidden = document.visibilityState === "hidden";
    if (!hidden && !this.host.calm()) return false;
    this.busy = true;
    const release = holdInput();
    const update = { from: ownVersion(), to: target.version };
    if (!hidden) {
      this.host.show(update);
      audio.hush(true);
      await new Promise((resolve) => setTimeout(resolve, UPDATE_MS));
      // The game ran on under the screen: a scene it opened stays on screen.
      if (this.disposed || !this.host.calm()) {
        release();
        return this.stay();
      }
    }
    if (await this.cloud.handOver()) {
      rememberReload(target.release, update);
      this.host.reload();
      return true;
    }
    release();
    return this.stay();
  }

  private stay(): false {
    this.host.show(null);
    audio.hush(false);
    this.busy = false;
    return false;
  }

  dispose() {
    this.disposed = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups = [];
  }
}

/** Watches for a newer release while the game runs; the update on screen before the page goes. */
export function useNewRelease(cloud: CloudSync, calm: boolean): ReleaseUpdate | null {
  const [leaving, setLeaving] = useState<ReleaseUpdate | null>(null);
  const calmRef = useRef(calm);
  const watchRef = useRef<NewRelease | null>(null);
  useEffect(() => {
    calmRef.current = calm;
    // The screen just cleared: a waiting release goes now, not at the next check.
    if (calm) void watchRef.current?.attempt();
  }, [calm]);
  useEffect(() => {
    const watch = new NewRelease(cloud, {
      calm: () => calmRef.current,
      show: setLeaving,
      reload: () => window.location.reload()
    });
    watch.start();
    watchRef.current = watch;
    return () => {
      watchRef.current = null;
      watch.dispose();
    };
  }, [cloud]);
  return leaving;
}

/** The update screen of the new page fades away this long (kept in step with game.css). */
export const ARRIVAL_FADE_MS = 400;

/**
 * The update this page arrived from: its screen finishes over the loading screen, then
 * fades away once the game is ready and watched. Null when the page did not come from one.
 */
export function useArrival(ready: boolean): { update: ReleaseUpdate; leaving: boolean } | null {
  const [update, setUpdate] = useState<ReleaseUpdate | null>(null);
  const [leaving, setLeaving] = useState(false);
  // Read after mount: storage does not exist while the page renders on the server.
  useEffect(() => setUpdate(takeArrival()), []);
  useEffect(() => {
    if (!update || !ready) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const leave = () => {
      if (timers.length > 0 || document.visibilityState !== "visible") return;
      timers.push(setTimeout(() => setLeaving(true), ARRIVAL_MS));
      timers.push(setTimeout(() => setUpdate(null), ARRIVAL_MS + ARRIVAL_FADE_MS));
    };
    leave();
    document.addEventListener("visibilitychange", leave);
    return () => {
      document.removeEventListener("visibilitychange", leave);
      for (const timer of timers) clearTimeout(timer);
    };
  }, [update, ready]);
  return update ? { update, leaving } : null;
}
