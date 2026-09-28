import type { BiomeDef, MonsterDef } from "../types";

export const STAGES_PER_BIOME = 10;

/**
 * Names and descriptions live in `content/` (one table per locale); scenes and creatures are
 * drawn by the pixel generator from the art recipes of `data/art/`, keyed by these ids.
 */
export const BIOMES: BiomeDef[] = [
  {
    id: "green-plains",
    index: 0,
    accent: "#8bd46a",
    monsters: [
      { id: "field-rat" },
      { id: "wild-boar" },
      { id: "carrion-crow" },
      { id: "hollow-scarecrow" },
      { id: "lantern-moth" },
      { id: "dusk-hare" }
    ],
    miniBoss: { id: "last-reaper" },
    boss: { id: "moss-alpha" }
  },
  {
    id: "dark-forest",
    index: 1,
    accent: "#4fd1a5",
    monsters: [
      { id: "shade-wolf" },
      { id: "briar-witch" },
      { id: "grove-spinner" },
      { id: "mourning-owl" },
      { id: "toadstool-choir" },
      { id: "whisper-bramble" }
    ],
    miniBoss: { id: "root-knight" },
    boss: { id: "old-grove" }
  },
  {
    id: "forgotten-caves",
    index: 2,
    accent: "#8f9cff",
    monsters: [
      { id: "blind-crawler" },
      { id: "echo-bat" },
      { id: "crystal-mite" },
      { id: "drip-leech" },
      { id: "rune-cart" },
      { id: "hollow-canary" }
    ],
    miniBoss: { id: "miner-shade" },
    boss: { id: "stone-devourer" }
  },
  {
    id: "corrupted-marsh",
    index: 3,
    accent: "#b6d94c",
    monsters: [
      { id: "bog-remnant" },
      { id: "rot-toad" },
      { id: "will-o-wisp" },
      { id: "drowned-courtier" },
      { id: "peat-cutter" },
      { id: "mire-heron" }
    ],
    miniBoss: { id: "bog-colossus" },
    boss: { id: "rot-baron" }
  },
  {
    id: "fallen-king-ruins",
    index: 4,
    accent: "#c58cff",
    monsters: [
      { id: "hour-gargoyle" },
      { id: "banner-wraith" },
      { id: "fallen-sentinel" },
      { id: "hollow-page" },
      { id: "last-hound" },
      { id: "candle-maid" }
    ],
    miniBoss: { id: "stone-warden" },
    boss: { id: "ruined-king" }
  }
];

export function biomeForStage(stage: number): BiomeDef {
  const index = Math.floor((Math.max(1, stage) - 1) / STAGES_PER_BIOME) % BIOMES.length;
  return BIOMES[index];
}

/** One era = one full loop through the 5 biomes (50 stages). */
export function eraForStage(stage: number): number {
  return Math.floor((Math.max(1, stage) - 1) / (STAGES_PER_BIOME * BIOMES.length));
}

export function isBossStage(stage: number): boolean {
  return stage % 5 === 0;
}

export function isBiomeBossStage(stage: number): boolean {
  return stage % STAGES_PER_BIOME === 0;
}

export const TREASURE_MONSTER: MonsterDef = { id: "golden-rat" };

/**
 * The twelve forms of the King (BIBLE 8.7): the guardian of every stage that ends a stratum
 * wears the form of its Age. Same strength in every form; only the look, the name and the
 * words change. Form I is the Fallen King of the Keep.
 */
export const KING_FORMS: readonly string[] = [
  "ruined-king",
  "titan-king",
  "hallowed-king",
  "star-crowned",
  "woven-king",
  "sketched-king",
  "king-name",
  "sleeping-king",
  "window-king",
  "hollow-crown",
  "blank-king",
  "aldemar"
];

/** At the stage cap, the Dawn stands where the King should be. */
export const THE_DAWN = "the-dawn";
export const DAWN_STAGE = 3000;

/** Stages that end a stratum: the King's (every 50th). */
export function isKingStage(stage: number): boolean {
  return stage % (STAGES_PER_BIOME * BIOMES.length) === 0;
}

/** The guardian of a biome-boss stage: its biome's guardian, the King's form of the Age, or the Dawn. */
export function guardianForStage(stage: number): MonsterDef {
  if (stage >= DAWN_STAGE) return { id: THE_DAWN };
  if (isKingStage(stage)) {
    const age = Math.min(KING_FORMS.length - 1, Math.floor(eraForStage(stage) / 5));
    return { id: KING_FORMS[age] };
  }
  return biomeForStage(stage).boss;
}

/** Every creature that can hold a guardian's stage (biome guardians, the King's forms, the Dawn). */
export const GUARDIAN_IDS: readonly string[] = [...BIOMES.map((biome) => biome.boss.id), ...KING_FORMS.slice(1), THE_DAWN];
