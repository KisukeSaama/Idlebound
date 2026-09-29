import type { GameState } from "../types";
import { recognitionTier } from "./lore";

/**
 * The Ledger's scenes (BIBLE 12.10): a handful of moments of the Long Night told in pictures,
 * a few shots of the world drawn by the pixel generator, one line each. Rare on purpose.
 * Whether a walker has lived one derives from the state, so every device agrees and the
 * Hall can show it again.
 */
/** The King's first Word of confession (BIBLE 12.4: nights 13 to 20). */
export const CONFESSION_NIGHT = 13;

export type CutsceneId = "first-dusk" | "almost" | "empty-throne";

/**
 * What a shot shows: a stretch of road with its guardian standing, falling or gone, a place
 * of the story, or a companion's face in the dark, remembered.
 */
export type CutsceneView =
  | { kind: "road"; biome: string; era: number; guardian: "stand" | "fall" | "none" }
  | { kind: "place"; id: "sanctum" | "loom" | "dawn" }
  | { kind: "memory"; hero: string };

export interface CutsceneShot {
  view: CutsceneView;
  /** How long the shot holds before the next one, in seconds. */
  seconds: number;
  /** Who says the shot's line: the King, a companion (by id), or nobody (the Ledger's own telling). */
  voice: "king" | string | null;
  /** A sound of the game played as the shot opens. */
  sound?: "kingWord" | "ascend";
}

export interface CutsceneDef {
  id: CutsceneId;
  shots: readonly CutsceneShot[];
  /** The walker has lived this moment. */
  witnessed: (state: GameState) => boolean;
}

export const CUTSCENES: readonly CutsceneDef[] = [
  {
    // The first King falls, the first dusk comes: the King's Word of night one is spoken here.
    id: "first-dusk",
    shots: [
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "stand" }, seconds: 5, voice: null },
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "stand" }, seconds: 4.5, voice: "king", sound: "kingWord" },
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "fall" }, seconds: 5.5, voice: null, sound: "ascend" },
      { view: { kind: "place", id: "sanctum" }, seconds: 5.5, voice: null },
      { view: { kind: "road", biome: "green-plains", era: 0, guardian: "none" }, seconds: 4.5, voice: null }
    ],
    witnessed: (state) => state.lifetime.ascensions >= 1
  },
  {
    // The first companion met again who half remembers the walker: Maëlle, hired again after
    // a dusk that took her memory of them, almost all of it.
    id: "almost",
    shots: [
      { view: { kind: "road", biome: "green-plains", era: 0, guardian: "none" }, seconds: 5, voice: null },
      { view: { kind: "memory", hero: "maelle" }, seconds: 5.5, voice: "maelle" },
      { view: { kind: "road", biome: "green-plains", era: 0, guardian: "none" }, seconds: 5, voice: null }
    ],
    witnessed: (state) => recognitionTier(state, "maelle") >= 1 && ((state.heroLevels.maelle ?? 0) > 0 || state.lifetime.ascensions >= 2)
  },
  {
    // The night the King's Words turn to confession (BIBLE 12.4): his thirteenth Word.
    id: "empty-throne",
    shots: [
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "stand" }, seconds: 5, voice: null },
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "stand" }, seconds: 5, voice: "king" },
      { view: { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "none" }, seconds: 6, voice: null }
    ],
    witnessed: (state) => state.lifetime.ascensions >= CONFESSION_NIGHT
  }
];

export const CUTSCENE_BY_ID = Object.fromEntries(CUTSCENES.map((cutscene) => [cutscene.id, cutscene])) as Record<CutsceneId, CutsceneDef>;

/** The scenes the walker has lived, in the order of the story. */
export function witnessedCutscenes(state: GameState): CutsceneId[] {
  return CUTSCENES.filter((cutscene) => cutscene.witnessed(state)).map((cutscene) => cutscene.id);
}
