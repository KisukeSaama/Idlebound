import type { GameState } from "../types";
import { DAWN_STAGE } from "./biomes";
import { recognitionTier } from "./lore";

/**
 * The Ledger's scenes (BIBLE 12.10): the moments of the Long Night told in pictures, staged
 * like a film on the world the pixel generator draws: a set, a camera that pans across it,
 * actors on its ground, and beats in time (a line, a sound, the music, the flash of a blow).
 * Rare on purpose. Whether a walker has lived one derives from the state, so every device
 * agrees and the Hall can show it again.
 */
/** The King's first Word of confession (BIBLE 12.4: nights 13 to 20). */
export const CONFESSION_NIGHT = 13;

export type CutsceneId =
  | "prologue"
  | "first-dusk"
  | "almost"
  | "empty-throne"
  | "rime-crown"
  | "rehearsal"
  | "loom"
  | "threshold"
  | "beneath";

/** Things of the world shown up close, alone in the dark. */
export type CutsceneObject = "rime-crown";

/**
 * What a shot is set in: the road as it is drawn at a stage (its biome, its era, the
 * guardian or King's form that holds it), a place of the story, a companion's face in the
 * dark, remembered, a thing of the world up close, or the night ink alone (a title, a breath
 * between shots).
 */
export type CutsceneSet =
  | { kind: "road"; stage: number }
  | { kind: "place"; id: "sanctum" | "loom" | "dawn" }
  | { kind: "memory"; hero: string }
  | { kind: "object"; id: CutsceneObject }
  | { kind: "ink" };

/** Someone standing on the set's ground, where creatures stand in the arena. */
export interface CutsceneActor {
  /** The guardian of the road's stage, or the walker (the only one who walks the places too). */
  who: "guardian" | "walker";
  /** Their middle, in pixels from the middle of the set. */
  x: number;
  /** Seconds into the shot when the walker strikes: a step forward and back. */
  lunge?: number;
  /** Seconds into the shot when they go up in violet lights, pixel by pixel. */
  fall?: number;
  /** They walk along with the camera: the road goes by behind them. */
  walks?: boolean;
}

/** A sound of the game, played on a beat. */
export type CutsceneSound = "kingWord" | "blow";

/** The scene's music: the Dusk theme begins, its slower reprise begins, or it cuts to silence. */
export type CutsceneMusic = "theme" | "reprise" | "hush";

/** Something that happens at a time of the shot, in seconds. */
export type CutsceneBeat =
  /** A line of the scene comes up (an index into its lines), said by a voice or by nobody (the Ledger). */
  | { at: number; line: number; voice?: "king" | string }
  | { at: number; sound: CutsceneSound }
  | { at: number; music: CutsceneMusic }
  /** The frame of a blow: the picture goes to two colors for an instant and the camera shakes. */
  | { at: number; flash: true }
  /** The scene's name over the ink. */
  | { at: number; title: true };

export interface CutsceneShot {
  set: CutsceneSet;
  /** How long the shot holds, in seconds. */
  seconds: number;
  /** It comes in at once, a cut, instead of by eighths of its pixels. */
  cut?: boolean;
  /** The camera's pan over the shot, eased: from and to, in pixels of the actors' ground. */
  pan?: readonly [from: number, to: number];
  /** The set comes up out of the dark over this many seconds (a waking). */
  wakes?: number;
  actors?: readonly CutsceneActor[];
  beats?: readonly CutsceneBeat[];
}

export interface CutsceneDef {
  id: CutsceneId;
  shots: readonly CutsceneShot[];
  /** The walker has lived this moment. */
  witnessed: (state: GameState) => boolean;
}

/** The first field, and the Keep of the first night. */
const FIELDS = { kind: "road", stage: 1 } as const;
const KEEP = { kind: "road", stage: 50 } as const;
const road = (stage: number) => ({ kind: "road", stage }) as const;
const ink = (seconds: number, beats?: readonly CutsceneBeat[]): CutsceneShot => ({ set: { kind: "ink" }, seconds, beats });
/** A line of the Ledger's own telling, a moment after its shot comes in. */
const told = (line: number, at = 0.7): CutsceneBeat => ({ at, line });
/** A line said by someone. */
const said = (line: number, voice: string, at = 0.7): CutsceneBeat => ({ at, line, voice });
const music = (cue: CutsceneMusic, at = 0): CutsceneBeat => ({ at, music: cue });
/** The scene opens: the theme, and its name over the ink. */
const OPENING: readonly CutsceneBeat[] = [music("theme"), { at: 0.3, title: true }];
/** The walker and the guardian face to face, as in the arena. */
const WALKER = { who: "walker", x: -96 } as const;
const GUARDIAN = { who: "guardian", x: 44 } as const;
const FACING = [WALKER, GUARDIAN] as const;
/** The camera on the guardian alone, drifting a little: a cut away from the walker. */
const ON_GUARDIAN = [40, 46] as const;
/** The walker's blow struck at `at`: the steel, the flash, the music cut. */
const blow = (at: number): CutsceneBeat[] => [{ at: at + 0.12, sound: "blow" }, { at: at + 0.12, flash: true }, music("hush", at + 0.12)];

export const CUTSCENES: readonly CutsceneDef[] = [
  {
    // The Long Night, at the very first moment of a walk: the fields, the King at the end of
    // the road, and the word "again" (BIBLE 16, stage 1). Every walker sees one scene at once.
    id: "prologue",
    shots: [
      ink(3, OPENING),
      { set: FIELDS, seconds: 7.5, pan: [-70, 20], actors: [{ who: "walker", x: -30 }], beats: [told(0, 1)] },
      { set: KEEP, seconds: 7, pan: [60, 0], actors: [{ who: "guardian", x: 0 }], beats: [told(1, 0.8)] },
      { set: FIELDS, seconds: 6.5, pan: [0, 70], actors: [{ who: "walker", x: -60, walks: true }], beats: [told(2, 0.8)] }
    ],
    witnessed: () => true
  },
  {
    // The first King falls, the first dusk comes: the King's Word of night one is spoken here.
    // The camera climbs the hall to the King; the two face each other; one blow; the King goes
    // up in lights; the walker wakes among the thirteen stones, and walks the first field again.
    id: "first-dusk",
    shots: [
      ink(3.2, OPENING),
      { set: KEEP, seconds: 8, pan: [-110, 0], actors: [{ who: "guardian", x: 40 }], beats: [told(0, 1.4)] },
      { set: KEEP, seconds: 6, cut: true, actors: FACING, beats: [{ at: 1, sound: "kingWord" }, said(1, "king", 1)] },
      { set: KEEP, seconds: 7, cut: true, actors: [{ ...WALKER, lunge: 0.5 }, { ...GUARDIAN, fall: 0.9 }], beats: [...blow(0.5), told(2, 2.1)] },
      ink(1.4),
      { set: { kind: "place", id: "sanctum" }, seconds: 7, pan: [0, 14], wakes: 3, beats: [music("reprise", 0.2), told(3, 1.6)] },
      { set: FIELDS, seconds: 7.5, pan: [0, 90], actors: [{ who: "walker", x: -70, walks: true }], beats: [told(4, 1)] }
    ],
    witnessed: (state) => state.lifetime.ascensions >= 1
  },
  {
    // The first companion met again who half remembers the walker: Maëlle, hired again after
    // a dusk that took her memory of them, almost all of it.
    id: "almost",
    shots: [
      { set: FIELDS, seconds: 6, pan: [-40, 30], actors: [{ who: "walker", x: -60, walks: true }], beats: [music("theme"), told(0, 0.8)] },
      { set: { kind: "memory", hero: "maelle" }, seconds: 6, beats: [said(1, "maelle", 0.8)] },
      { set: FIELDS, seconds: 6.5, pan: [30, 50], actors: [{ who: "walker", x: -60 }], beats: [told(2, 0.8)] }
    ],
    witnessed: (state) => recognitionTier(state, "maelle") >= 1 && ((state.heroLevels.maelle ?? 0) > 0 || state.lifetime.ascensions >= 2)
  },
  {
    // The night the King's Words turn to confession (BIBLE 12.4): his thirteenth Word.
    id: "empty-throne",
    shots: [
      { set: KEEP, seconds: 7, pan: [-90, 0], actors: FACING, beats: [music("theme"), told(0, 1.2)] },
      { set: KEEP, seconds: 6, cut: true, pan: ON_GUARDIAN, actors: [GUARDIAN], beats: [{ at: 0.3, sound: "kingWord" }, said(1, "king", 0.8)] },
      { set: KEEP, seconds: 7, pan: [0, -20], actors: [WALKER], beats: [music("reprise", 0.2), told(2, 1)] }
    ],
    witnessed: (state) => state.lifetime.ascensions >= CONFESSION_NIGHT
  },
  {
    // The Crown in the Ice (BIBLE 12.10): the Rime's King falls at stage 500, and a smaller
    // crown lies frozen in his floor. There were other kings.
    id: "rime-crown",
    shots: [
      { set: road(500), seconds: 7, pan: [-60, 10], actors: [WALKER], beats: [music("theme"), told(0, 1)] },
      { set: { kind: "object", id: "rime-crown" }, seconds: 6, beats: [told(1, 0.8)] },
      { set: { kind: "memory", hero: "kaelen" }, seconds: 6.5, beats: [said(2, "kaelen")] },
      { set: road(500), seconds: 6, pan: [10, 50], actors: [{ who: "walker", x: -60, walks: true }], beats: [told(3, 0.8)] }
    ],
    witnessed: (state) => state.maxStageEver > 500
  },
  {
    // The Rehearsal (BIBLE 12.10): at stage 1000 the aurora lights the Keep. Not the Dawn.
    id: "rehearsal",
    shots: [
      { set: road(1000), seconds: 7, pan: [-60, 0], beats: [music("theme"), told(0, 1)] },
      { set: road(1000), seconds: 6, pan: [0, 12], actors: [{ who: "walker", x: -40 }], beats: [told(1, 0.8)] },
      { set: { kind: "memory", hero: "ashka" }, seconds: 6.5, beats: [said(2, "ashka")] }
    ],
    witnessed: (state) => state.maxStageEver > 1000
  },
  {
    // The Loom (BIBLE 12.10): the first Descent, and Eldra at her loom, the night on its beam.
    id: "loom",
    shots: [
      ink(2.5, [music("theme")]),
      { set: { kind: "place", id: "loom" }, seconds: 7.5, pan: [-20, 20], wakes: 3, beats: [told(0, 1.5)] },
      { set: { kind: "memory", hero: "eldra" }, seconds: 6.5, beats: [told(1)] },
      { set: { kind: "place", id: "loom" }, seconds: 6, pan: [20, 30], actors: [{ who: "walker", x: -70 }], beats: [said(2, "eldra", 0.8)] }
    ],
    witnessed: (state) => state.descents >= 1
  },
  {
    // The Threshold (BIBLE 12.10): at stage 2000 the King sleeps on his throne, and Morgrath
    // says the word nobody says.
    id: "threshold",
    shots: [
      { set: road(2000), seconds: 7, pan: [-70, 0], actors: [{ who: "guardian", x: 20 }], beats: [music("theme"), told(0, 1)] },
      { set: road(2000), seconds: 6.5, cut: true, actors: [{ ...WALKER, lunge: 0.5 }, { ...GUARDIAN, fall: 0.9 }], beats: [...blow(0.5), told(1, 2)] },
      { set: { kind: "memory", hero: "morgrath" }, seconds: 7, beats: [music("reprise", 0.2), told(2, 1)] }
    ],
    witnessed: (state) => state.maxStageEver > 2000
  },
  {
    // Beneath the Light (BIBLE 12.10, 25): the Dawn at stage 3000 is a line of light, not a
    // wall. Beaten, it lets the walker through, and the night draws itself again below.
    id: "beneath",
    shots: [
      { set: road(DAWN_STAGE), seconds: 7, pan: [-50, 0], actors: [{ who: "guardian", x: 0 }], beats: [music("theme"), told(0, 1)] },
      { set: road(DAWN_STAGE), seconds: 6.5, cut: true, actors: [{ ...WALKER, lunge: 0.5 }, { who: "guardian", x: 30, fall: 0.9 }], beats: [...blow(0.5), told(1, 2)] },
      ink(1.2),
      { set: road(DAWN_STAGE + 1), seconds: 7, pan: [0, 80], actors: [{ who: "walker", x: -60, walks: true }], beats: [music("reprise", 0.2), told(2, 1)] }
    ],
    witnessed: (state) => state.maxStageEver > DAWN_STAGE
  }
];

export const CUTSCENE_BY_ID = Object.fromEntries(CUTSCENES.map((cutscene) => [cutscene.id, cutscene])) as Record<CutsceneId, CutsceneDef>;

/** The scenes the walker has lived, in the order of the story. */
export function witnessedCutscenes(state: GameState): CutsceneId[] {
  return CUTSCENES.filter((cutscene) => cutscene.witnessed(state)).map((cutscene) => cutscene.id);
}

/** A scene's length, in seconds. */
export function cutsceneSeconds(cutscene: CutsceneDef): number {
  return cutscene.shots.reduce((total, shot) => total + shot.seconds, 0);
}
