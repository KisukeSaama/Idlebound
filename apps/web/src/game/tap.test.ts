import { describe, expect, it } from "vitest";
import { installFastTap } from "./tap";

/** Just enough of a button and a window to follow one finger. */
class FakeButton {
  disabled = false;
  isConnected = true;
  clicks = 0;
  closest(selector: string) {
    return selector === "button" ? this : null;
  }
  click() {
    this.clicks += 1;
  }
}

function setup() {
  const target = new EventTarget();
  installFastTap(target as unknown as Window);
  const button = new FakeButton();
  const pointer = (type: string, init: { x?: number; y?: number; t?: number; kind?: string; on?: unknown } = {}) => {
    const event = new Event(type);
    const fields = {
      pointerType: init.kind ?? "touch",
      isPrimary: true,
      button: 0,
      pointerId: 1,
      clientX: init.x ?? 0,
      clientY: init.y ?? 0,
      target: init.on ?? button,
      timeStamp: init.t ?? 0
    };
    for (const [key, value] of Object.entries(fields)) Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
  };
  const nativeClick = (t: number) => {
    const event = new Event("click", { cancelable: true });
    Object.defineProperty(event, "isTrusted", { value: true });
    Object.defineProperty(event, "timeStamp", { value: t });
    let reached = false;
    target.addEventListener("click", () => (reached = true), { once: true });
    target.dispatchEvent(event);
    return reached;
  };
  return { button, pointer, nativeClick };
}

describe("fast tap", () => {
  it("presses a button when the finger lifts, and drops the late native click", () => {
    const { button, pointer, nativeClick } = setup();
    pointer("pointerdown", { t: 0 });
    pointer("pointerup", { t: 80 });
    expect(button.clicks).toBe(1);
    expect(nativeClick(120)).toBe(false);
    // The next native click is someone else's.
    expect(nativeClick(150)).toBe(true);
  });

  it("leaves a finger that scrolls alone", () => {
    const { button, pointer } = setup();
    pointer("pointerdown", { y: 0 });
    pointer("pointermove", { y: 30 });
    pointer("pointerup", { y: 30 });
    expect(button.clicks).toBe(0);
    pointer("pointerdown");
    pointer("pointercancel");
    pointer("pointerup");
    expect(button.clicks).toBe(0);
  });

  it("keeps native clicks for mouse, disabled buttons and anything else", () => {
    const { button, pointer, nativeClick } = setup();
    pointer("pointerdown", { kind: "mouse" });
    pointer("pointerup", { kind: "mouse" });
    expect(button.clicks).toBe(0);
    expect(nativeClick(10)).toBe(true);
    button.disabled = true;
    pointer("pointerdown");
    pointer("pointerup");
    expect(button.clicks).toBe(0);
    pointer("pointerdown", { on: { closest: () => null } });
    pointer("pointerup");
    expect(button.clicks).toBe(0);
    expect(nativeClick(20)).toBe(true);
  });

  it("forgets an answered tap once the next finger comes down", () => {
    const { button, pointer, nativeClick } = setup();
    pointer("pointerdown", { t: 0 });
    pointer("pointerup", { t: 50 });
    pointer("pointerdown", { t: 100, on: { closest: () => null } });
    expect(nativeClick(140)).toBe(true);
    expect(button.clicks).toBe(1);
  });
});
