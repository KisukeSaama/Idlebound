"use client";

/**
 * A tap on a button answers the first time, on iPhone too.
 *
 * Safari on iOS sends the click of a tap only once it is sure the tap was not a hover, and
 * a game that redraws twenty times a second keeps it unsure: the first tap on a power or a
 * key often went nowhere and only the second one worked. So a finger lifted on the button it
 * pressed, without sliding, presses that button at once; the late click Safari may still
 * send for the same tap is dropped, so nothing ever fires twice. Mouse and pen keep their
 * native clicks.
 */

/** A finger that slides farther than this was scrolling, not tapping. */
const SLOP_PX = 10;
/** The native click of a tap comes right after the lift; later than this, it is not ours. */
const LATE_CLICK_MS = 800;

type Press = { id: number; button: HTMLButtonElement; x: number; y: number };

export function installFastTap(target: Window): () => void {
  let press: Press | null = null;
  // A tap already answered: the native click Safari may send for it is dropped until the next
  // finger comes down, whatever it lands on (the button may have given way to another).
  let answeredAt = -Infinity;

  const down = (event: PointerEvent) => {
    answeredAt = -Infinity;
    press = null;
    if (event.pointerType !== "touch" || !event.isPrimary || event.button !== 0) return;
    const button = (event.target as Element | null)?.closest?.("button");
    if (!button || button.disabled) return;
    press = { id: event.pointerId, button, x: event.clientX, y: event.clientY };
  };
  const move = (event: PointerEvent) => {
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > SLOP_PX) press = null;
  };
  const cancel = (event: PointerEvent) => {
    if (press && event.pointerId === press.id) press = null;
  };
  const up = (event: PointerEvent) => {
    const pressed = press;
    press = null;
    if (!pressed || event.pointerId !== pressed.id) return;
    if (Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) > SLOP_PX) return;
    if (!pressed.button.isConnected || pressed.button.disabled) return;
    answeredAt = event.timeStamp;
    pressed.button.click();
  };
  const click = (event: MouseEvent) => {
    if (!event.isTrusted || event.timeStamp - answeredAt > LATE_CLICK_MS) return;
    answeredAt = -Infinity;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  // Capture on the window: no handler below can stop a finger from being followed.
  const options = { capture: true, passive: true } as const;
  target.addEventListener("pointerdown", down, options);
  target.addEventListener("pointermove", move, options);
  target.addEventListener("pointercancel", cancel, options);
  target.addEventListener("pointerup", up, options);
  target.addEventListener("click", click, { capture: true });
  return () => {
    target.removeEventListener("pointerdown", down, options);
    target.removeEventListener("pointermove", move, options);
    target.removeEventListener("pointercancel", cancel, options);
    target.removeEventListener("pointerup", up, options);
    target.removeEventListener("click", click, { capture: true });
  };
}
