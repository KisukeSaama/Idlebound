"use client";

import { useEffect, useRef, useState } from "react";
import { onNewerRelease } from "@/lib/release";
import { audio } from "./audio";
import type { CloudSync } from "./cloud";

/** A watched page waits this long without input before it moves on. */
const QUIET_MS = 30_000;
const CHECK_MS = 5_000;
/** The scene fades out this long before the page goes (kept in step with game.css). */
export const FADE_MS = 700;
/**
 * The release this tab already reloaded for. A page still older after that (a cache in the
 * way) does not reload again. A convenience of this tab, never game state.
 */
const RELOADED_KEY = "idlebound:release:reloaded-for";

function reloadedFor(): string | null {
  try {
    return window.sessionStorage.getItem(RELOADED_KEY);
  } catch {
    return null;
  }
}

function rememberReload(release: string) {
  try {
    window.sessionStorage.setItem(RELOADED_KEY, release);
  } catch {
    // Without storage, a page that stays older may reload once per newer answer: still safe.
  }
}

/** From the last save to the reload, no input reaches the game: nothing played is left behind. */
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
  /** The scene fades out before the page goes, or back in when it stays. */
  fade(fading: boolean): void;
  reload(): void;
}

/**
 * A newer release was deployed while the game was open: once everything played is on the
 * server, the page reloads onto it. A hidden page goes at once, and the walker comes back to
 * the new one. A watched page waits for a calm moment (no input for a while, nothing open),
 * then fades out; any input during the fade keeps it. A guest's game, or one the server does
 * not keep, never reloads (see CloudSync.handOver).
 */
export class NewRelease {
  private target: string | null = null;
  private lastInput = Date.now();
  private busy = false;
  private disposed = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private cleanups: (() => void)[] = [];

  constructor(
    private cloud: CloudSync,
    private host: NewReleaseHost
  ) {}

  start() {
    const onInput = () => {
      this.lastInput = Date.now();
    };
    const onVisibility = () => void this.attempt();
    window.addEventListener("pointerdown", onInput);
    window.addEventListener("keydown", onInput);
    document.addEventListener("visibilitychange", onVisibility);
    this.cleanups = [
      onNewerRelease((release) => this.found(release)),
      () => {
        window.removeEventListener("pointerdown", onInput);
        window.removeEventListener("keydown", onInput);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    ];
  }

  private found(release: string) {
    if (this.target === release || reloadedFor() === release) return;
    this.target = release;
    this.timer ??= setInterval(() => void this.attempt(), CHECK_MS);
    void this.attempt();
  }

  /** Moves to the newer release if the moment is right. True when the page is going. */
  async attempt(): Promise<boolean> {
    const target = this.target;
    if (!target || this.busy || this.disposed || !this.cloud.keepsGame()) return false;
    const hidden = document.visibilityState === "hidden";
    if (!hidden && (!this.host.calm() || Date.now() - this.lastInput < QUIET_MS)) return false;
    this.busy = true;
    if (!hidden) {
      const fadeAt = Date.now();
      this.host.fade(true);
      audio.hush(true);
      await new Promise((resolve) => setTimeout(resolve, FADE_MS));
      if (this.disposed || this.lastInput >= fadeAt || !this.host.calm()) return this.stay();
    }
    const release = holdInput();
    if (await this.cloud.handOver()) {
      rememberReload(target);
      this.host.reload();
      return true;
    }
    release();
    return this.stay();
  }

  private stay(): false {
    this.host.fade(false);
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

/** Watches for a newer release while the game runs; true while the scene fades out. */
export function useNewRelease(cloud: CloudSync, calm: boolean): boolean {
  const [fading, setFading] = useState(false);
  const calmRef = useRef(calm);
  useEffect(() => {
    calmRef.current = calm;
  }, [calm]);
  useEffect(() => {
    const watch = new NewRelease(cloud, {
      calm: () => calmRef.current,
      fade: setFading,
      reload: () => window.location.reload()
    });
    watch.start();
    return () => watch.dispose();
  }, [cloud]);
  return fading;
}
