"use client";

/**
 * Short vibrations on phones that allow them (Android browsers; iOS exposes no API).
 * A preference of the device, not of the game: a walker on two devices may want the phone
 * to buzz and the tablet to stay still, so it is kept in the browser, off the save.
 */

export type Pulse = "crit" | "buy" | "power" | "ready" | "loot" | "kill" | "fail" | "ascend";

const PATTERNS: Record<Pulse, number | number[]> = {
  crit: 8,
  buy: 10,
  power: 18,
  ready: [12, 60, 12],
  loot: 14,
  kill: 28,
  fail: [22, 50, 22],
  ascend: [30, 60, 30, 60, 70]
};
/** Two pulses of the same kind closer than this blur into one buzz: the second is dropped. */
const MIN_GAP_MS: Partial<Record<Pulse, number>> = { crit: 140, buy: 60 };
const STORAGE_KEY = "idlebound:haptics";

class Haptics {
  private last = new Map<Pulse, number>();
  private enabled = true;
  private hidden = false;

  constructor() {
    try {
      this.enabled = localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      this.enabled = true;
    }
  }

  /** The device can vibrate: only then is the setting offered. */
  get supported(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  }

  get on(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch {
      // Storage refused (private mode): the choice lasts until the page closes.
    }
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
  }

  pulse(kind: Pulse) {
    if (!this.enabled || this.hidden || !this.supported) return;
    const now = performance.now();
    if (now - (this.last.get(kind) ?? -Infinity) < (MIN_GAP_MS[kind] ?? 0)) return;
    this.last.set(kind, now);
    try {
      navigator.vibrate(PATTERNS[kind]);
    } catch {
      // A browser that blocks vibration before the first gesture: nothing to do.
    }
  }
}

export const haptics = new Haptics();
