import { useState } from "react";

const PREFIX = "idlebound:view:";

/**
 * A way of looking the walker picked (a sort, a board), kept when its window closes and
 * across reloads. A view convenience only: kept in this browser, never game state
 * (AGENTS.md). Storage may be missing or refuse (private window, blocked site data): the
 * choice then lasts until the page closes, and a value no longer offered falls back.
 */
const kept = new Map<string, string>();

function read(key: string): string | null {
  if (kept.has(key)) return kept.get(key) ?? null;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  kept.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // The choice stays in `kept` for this page.
  }
}

export function useRemembered<T extends string>(key: string, allowed: readonly T[], fallback: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = read(key);
    return allowed.includes(stored as T) ? (stored as T) : fallback;
  });
  const remember = (next: T) => {
    write(key, next);
    setValue(next);
  };
  return [value, remember];
}
