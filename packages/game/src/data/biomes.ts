import type { BiomeDef, MonsterDef } from "../types";

const enemy = (name: string) => `/assets/enemies/${name}.webp`;
const zone = (name: string) => `/assets/zones/${name}.webp`;

export const STAGES_PER_BIOME = 10;

/** Names and descriptions live in `content/` (one table per locale). */
export const BIOMES: BiomeDef[] = [
  {
    id: "green-plains",
    index: 0,
    background: zone("green-plains"),
    accent: "#8bd46a",
    monsters: [
      { id: "field-rat", image: enemy("field-rat") },
      { id: "wild-boar", image: enemy("wild-boar") },
      { id: "rabid-rat", image: enemy("field-rat"), filter: "hue-rotate(-25deg) saturate(1.6) brightness(0.9)" }
    ],
    miniBoss: { id: "tusk-king", image: enemy("wild-boar"), filter: "saturate(1.4) contrast(1.15)", scale: 1.12 },
    boss: { id: "moss-alpha", image: enemy("moss-alpha"), scale: 1.08 }
  },
  {
    id: "dark-forest",
    index: 1,
    background: zone("dark-forest"),
    accent: "#4fd1a5",
    monsters: [
      { id: "shade-wolf", image: enemy("shade-wolf") },
      { id: "briar-witch", image: enemy("briar-witch") },
      { id: "blight-boar", image: enemy("wild-boar"), filter: "hue-rotate(200deg) saturate(0.8) brightness(0.8)" }
    ],
    miniBoss: { id: "briar-matron", image: enemy("briar-witch"), filter: "hue-rotate(60deg) saturate(1.5)", scale: 1.1 },
    boss: { id: "old-grove", image: enemy("old-grove"), scale: 1.1 }
  },
  {
    id: "forgotten-caves",
    index: 2,
    background: zone("forgotten-caves"),
    accent: "#8f9cff",
    monsters: [
      { id: "blind-crawler", image: enemy("blind-crawler") },
      { id: "echo-bat", image: enemy("echo-bat") },
      { id: "deep-wolf", image: enemy("shade-wolf"), filter: "hue-rotate(-50deg) brightness(1.15) saturate(1.3)" }
    ],
    miniBoss: { id: "howling-swarm", image: enemy("echo-bat"), filter: "hue-rotate(90deg) saturate(1.6)", scale: 1.15 },
    boss: { id: "stone-devourer", image: enemy("stone-devourer"), scale: 1.08 }
  },
  {
    id: "corrupted-marsh",
    index: 3,
    background: zone("corrupted-marsh"),
    accent: "#b6d94c",
    monsters: [
      { id: "bog-remnant", image: enemy("bog-remnant") },
      { id: "putrid-crawler", image: enemy("blind-crawler"), filter: "sepia(0.6) hue-rotate(40deg) saturate(1.8) brightness(0.85)" },
      { id: "marsh-hag", image: enemy("briar-witch"), filter: "hue-rotate(-40deg) saturate(1.2) brightness(0.9)" }
    ],
    miniBoss: { id: "bog-colossus", image: enemy("bog-remnant"), filter: "contrast(1.2) saturate(1.4)", scale: 1.14 },
    boss: { id: "rot-baron", image: enemy("rot-baron"), scale: 1.1 }
  },
  {
    id: "fallen-king-ruins",
    index: 4,
    background: zone("fallen-king-ruins"),
    accent: "#c58cff",
    monsters: [
      { id: "royal-hound", image: enemy("shade-wolf"), filter: "grayscale(0.6) brightness(1.2) hue-rotate(20deg)" },
      { id: "crown-bat", image: enemy("echo-bat"), filter: "hue-rotate(-30deg) saturate(1.4)" },
      { id: "fallen-sentinel", image: enemy("bog-remnant"), filter: "grayscale(0.7) brightness(1.1) contrast(1.2)" }
    ],
    miniBoss: { id: "stone-warden", image: enemy("stone-devourer"), filter: "grayscale(0.5) hue-rotate(40deg) brightness(1.1)", scale: 1.1 },
    boss: { id: "ruined-king", image: enemy("ruined-king"), scale: 1.12 }
  }
];

/** Colour shift applied to every monster of an era (index 1..5, cycling after that). */
const ERA_FILTERS = [
  "",
  "hue-rotate(160deg) saturate(1.2)",
  "sepia(0.5) hue-rotate(-30deg) saturate(2) brightness(0.95)",
  "invert(0.08) hue-rotate(250deg) saturate(1.5) brightness(0.85)",
  "hue-rotate(90deg) saturate(1.8) brightness(1.1)",
  "grayscale(0.4) contrast(1.4) brightness(1.15)"
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

/** Applies the era variant (tint) to a monster. The name prefix is added at display time. */
export function eraVariant(monster: MonsterDef, stage: number): MonsterDef {
  const era = eraForStage(stage);
  if (era === 0) return monster;
  const variant = era % ERA_FILTERS.length || 1;
  const filter = [monster.filter, ERA_FILTERS[variant]].filter(Boolean).join(" ");
  return { ...monster, filter };
}

export const TREASURE_MONSTER: MonsterDef = {
  id: "golden-rat",
  image: enemy("field-rat"),
  filter: "sepia(1) saturate(4) hue-rotate(-12deg) brightness(1.25)",
  scale: 0.85
};
