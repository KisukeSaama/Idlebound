"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * A finger never buys blind. On a touch screen a talent or a power has no hover to show its
 * card, so the first tap opens the card and arms it, and a second tap on the same key does
 * what it says. A mouse, a pen or a keyboard keep their single press.
 */

/** An armed key waits this long for its second tap. */
export const ARM_MS = 4000;

let touchedLast = false;
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", (event) => (touchedLast = event.pointerType === "touch"), { capture: true, passive: true });
  window.addEventListener("keydown", () => (touchedLast = false), { capture: true, passive: true });
}

/** Whether the press being answered came from a finger. */
export const pressedByTouch = () => touchedLast;

/**
 * `gate(id, run)` runs at once for a mouse or a key; under a finger, it arms `id` first and
 * runs on the next tap of the same key. A tap anywhere else, or the wait running out,
 * disarms it. The armed element carries `data-arm={id}`.
 */
export function useTouchArm() {
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (armed === null) return;
    const timer = window.setTimeout(() => setArmed(null), ARM_MS);
    const away = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.(`[data-arm="${CSS.escape(armed)}"]`)) return;
      setArmed(null);
    };
    window.addEventListener("pointerdown", away, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", away, true);
    };
  }, [armed]);
  const gate = useCallback(
    (id: string, run: () => void) => {
      if (!pressedByTouch()) return run();
      if (armed === id) {
        setArmed(null);
        run();
      } else {
        setArmed(id);
      }
    },
    [armed]
  );
  return { armed, gate };
}
