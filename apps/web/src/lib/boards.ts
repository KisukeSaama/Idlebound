import { formatNumber } from "@idlebound/game";
import type { Messages } from "@/i18n/messages";

/** The four boards of the Roll, in the order they are shown: Depth, the official one, first. */
export const BOARD_IDS = ["stage", "promises", "crystals", "weavings"] as const;

export type BoardId = (typeof BOARD_IDS)[number];

/** A walker on a board: their place, the board's value, their highest stage and when they reached it (ISO). */
export interface RollRow {
  rank: number;
  username: string;
  value: number;
  maxStage: number;
  reachedAt: string;
}

/**
 * A depth, whole: two walkers a few stages apart never read the same (the road has no
 * bottom, and 10,432 must not read 10.4K).
 */
export function stageText(stage: number): string {
  return String(Math.floor(stage));
}

/** A board's value in words ("Stage 315", "12 promises"), numbers written by `format` (a depth, whole). */
export function boardValue(roll: Messages["leaderboard"], board: BoardId, value: number, format: (value: number) => string = formatNumber): string {
  return board === "stage" ? roll.values.stage(stageText(value)) : roll.values[board](value, format(value));
}
