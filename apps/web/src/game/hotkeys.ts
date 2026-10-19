import type { BuyMode } from "@idlebound/game";
import type { WindowId } from "./context";
import type { RevealId } from "./shell";

/**
 * Letters that open a window, read by the letter typed (not the key's place), so M is M on
 * every keyboard. A window answers its key once it is in the rail; its key again closes it.
 */
export const WINDOW_KEYS: readonly { key: string; window: WindowId; reveal: RevealId }[] = [
  { key: "m", window: "map", reveal: "map" },
  { key: "e", window: "gear", reveal: "gear" },
  { key: "a", window: "ascension", reveal: "ascension" },
  { key: "h", window: "hall", reveal: "hall" }
];

/** B cycles the buy amounts in the order of their keys. */
export const BUY_MODES: readonly BuyMode[] = [1, 10, 25, 100, "max"];

export function nextBuyMode(mode: BuyMode): BuyMode {
  return BUY_MODES[(BUY_MODES.indexOf(mode) + 1) % BUY_MODES.length];
}
