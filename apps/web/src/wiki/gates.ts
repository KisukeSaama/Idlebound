import {
  HERO_BY_ID,
  STAGES_PER_ERA,
  bestiaryKills,
  echoesFound,
  eventSeen,
  milestoneReached,
  recognitionTier,
  witnessedCutscenes,
  type CutsceneId,
  type GameState,
  type MilestoneId
} from "@idlebound/game";

/**
 * What a walker must have lived for a piece of the wiki to be no secret to them. A gate is
 * plain data, so server pages can hand it to the client `Spoiler`, which reads it against
 * the walker's kept game ("as far as my game" mode). Every gate derives from `GameState`
 * only, like the game's own progressive interface.
 */
export type Gate =
  /** The deepest stage ever reached. */
  | { kind: "stage"; stage: number }
  | { kind: "ascensions"; count: number }
  | { kind: "descents"; count: number }
  /** Kills (or sightings) of a creature the Bestiary counts. */
  | { kind: "kills"; id: string; count: number }
  /** A companion hired at least once. */
  | { kind: "hired"; hero: string }
  /** A companion's Recognition tier. */
  | { kind: "tier"; hero: string; tier: number }
  /** A promise kept to a companion. */
  | { kind: "kept"; hero: string }
  | { kind: "named"; id: string }
  | { kind: "secret"; id: string }
  | { kind: "event"; id: string }
  /** The n-th echo of a biome brought back (1-based). */
  | { kind: "echo"; biome: string; index: number }
  | { kind: "milestone"; id: MilestoneId }
  /** One of Aldric's Lessons (a talent of his bought once). */
  | { kind: "lesson"; id: string }
  /** An altar's legend, read once it reached level 5. */
  | { kind: "altar"; id: string }
  /** One of the Ledger's scenes, lived. */
  | { kind: "cutscene"; id: CutsceneId };

/** Whether the walker of `state` has lived what the gate asks. */
export function gateMet(state: GameState, gate: Gate): boolean {
  switch (gate.kind) {
    case "stage":
      return state.maxStageEver >= gate.stage;
    case "ascensions":
      return state.lifetime.ascensions >= gate.count;
    case "descents":
      return state.descents >= gate.count;
    case "kills":
      return bestiaryKills(state, gate.id) >= gate.count;
    case "hired": {
      // Companions join in order: the best company ever counts Aldric, so index + 1 heroes.
      const hero = HERO_BY_ID[gate.hero];
      return hero !== undefined && state.lifetime.bestHired > hero.index;
    }
    case "tier":
      return recognitionTier(state, gate.hero) >= gate.tier;
    case "kept":
      return Object.hasOwn(state.promises, gate.hero) && state.promises[gate.hero] > 0;
    case "named":
      return state.named.includes(gate.id);
    case "secret":
      return state.secrets.includes(gate.id);
    case "event":
      return eventSeen(state, gate.id);
    case "echo":
      return echoesFound(state, gate.biome) >= gate.index;
    case "milestone":
      return milestoneReached(state, gate.id);
    case "lesson":
      return state.lore.lessons.includes(gate.id);
    case "altar":
      return state.lore.altars.includes(gate.id);
    case "cutscene":
      return witnessedCutscenes(state).includes(gate.id);
  }
}

/** Where the walker stands against a counted gate, to say how far they still are. */
export function gateProgress(state: GameState, gate: Gate): number | null {
  switch (gate.kind) {
    case "stage":
      return state.maxStageEver;
    case "ascensions":
      return state.lifetime.ascensions;
    case "descents":
      return state.descents;
    case "kills":
      return bestiaryKills(state, gate.id);
    case "tier":
      return recognitionTier(state, gate.hero);
    default:
      return null;
  }
}

/** First stage of a stratum (era 0 starts at stage 1). */
export function eraStart(era: number): number {
  return era * STAGES_PER_ERA + 1;
}
