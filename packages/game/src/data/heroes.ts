import type { HeroDef, HeroEffect, HeroUpgradeDef } from "../types";
import { lookup } from "./lookup";

export const HERO_COST_GROWTH = 1.07;

/** Names, titles, lore and talent names live in `content/`. */
interface HeroSeed {
  id: string;
  baseCost: number;
  baseDps: number;
  color: string;
  glyph: string;
  /** Special talent unlocked at level 50. */
  special: HeroEffect;
}

const SEEDS: HeroSeed[] = [
  { id: "maelle", glyph: "➶", color: "#8bd46a", baseCost: 50, baseDps: 5, special: { kind: "gold", pct: 0.1 } },
  { id: "brom", glyph: "⚒", color: "#e0a45a", baseCost: 250, baseDps: 22, special: { kind: "click", mult: 1.5 } },
  { id: "ysolde", glyph: "❦", color: "#4fd1a5", baseCost: 1_000, baseDps: 74, special: { kind: "critChance", pct: 0.03 } },
  { id: "cendre", glyph: "☀", color: "#ff8a4c", baseCost: 4_000, baseDps: 245, special: { kind: "globalDps", pct: 0.1 } },
  { id: "nyx", glyph: "✦", color: "#9b7bff", baseCost: 20_000, baseDps: 976, special: { kind: "critDamage", add: 3 } },
  { id: "garrick", glyph: "⛏", color: "#8f9cff", baseCost: 100_000, baseDps: 3_725, special: { kind: "treasure", pct: 0.01 } },
  { id: "seraphine", glyph: "❀", color: "#6fdc8c", baseCost: 400_000, baseDps: 10_859, special: { kind: "globalDps", pct: 0.15 } },
  { id: "thorvald", glyph: "⛰", color: "#c9b28f", baseCost: 2_500_000, baseDps: 47_143, special: { kind: "bossTimer", seconds: 3 } },
  { id: "mirelle", glyph: "⚗", color: "#b6d94c", baseCost: 15_000_000, baseDps: 186_000, special: { kind: "gold", pct: 0.2 } },
  { id: "kaelen", glyph: "⚔", color: "#d65a5a", baseCost: 100_000_000, baseDps: 782_000, special: { kind: "clickDps", pct: 0.01 } },
  { id: "oriane", glyph: "◉", color: "#7fd8ff", baseCost: 800_000_000, baseDps: 3_721_000, special: { kind: "critChance", pct: 0.05 } },
  { id: "vorn", glyph: "♞", color: "#c58a5a", baseCost: 6_500_000_000, baseDps: 17_010_000, special: { kind: "globalDps", pct: 0.2 } },
  { id: "lysandre", glyph: "✧", color: "#b98cff", baseCost: 50_000_000_000, baseDps: 69_480_000, special: { kind: "critDamage", add: 5 } },
  { id: "ashka", glyph: "♨", color: "#ff6b3d", baseCost: 450_000_000_000, baseDps: 460_000_000, special: { kind: "gold", pct: 0.25 } },
  { id: "nameless", glyph: "♜", color: "#a0a8b8", baseCost: 4_000_000_000_000, baseDps: 3_017_000_000, special: { kind: "bossTimer", seconds: 5 } },
  { id: "eldra", glyph: "⌛", color: "#ffd479", baseCost: 36_000_000_000_000, baseDps: 20_009_000_000, special: { kind: "globalDps", pct: 0.25 } },
  { id: "morgrath", glyph: "☠", color: "#8fffcf", baseCost: 320_000_000_000_000, baseDps: 131_000_000_000, special: { kind: "clickDps", pct: 0.02 } },
  { id: "celestine", glyph: "◆", color: "#c77dff", baseCost: 2.7e15, baseDps: 814_000_000_000, special: { kind: "globalDps", pct: 0.3 } },
  { id: "aurelion", glyph: "♛", color: "#ffb347", baseCost: 2.4e16, baseDps: 5_335_000_000_000, special: { kind: "gold", pct: 0.5 } },
  { id: "awakened", glyph: "✺", color: "#fff1a8", baseCost: 3e17, baseDps: 49_143_000_000_000, special: { kind: "globalDps", pct: 0.5 } }
];

/** Talent cost = hero base cost × multiplier. */
const TALENT_COST = { 10: 20, 25: 100, 50: 800, 100: 25_000, 150: 2_500_000 } as const;

function heroUpgrades(seed: HeroSeed): HeroUpgradeDef[] {
  return [
    { id: `${seed.id}-10`, level: 10, costMult: TALENT_COST[10], effect: { kind: "heroDps", mult: 2 } },
    { id: `${seed.id}-25`, level: 25, costMult: TALENT_COST[25], effect: { kind: "heroDps", mult: 2 } },
    { id: `${seed.id}-50`, level: 50, costMult: TALENT_COST[50], effect: seed.special },
    { id: `${seed.id}-100`, level: 100, costMult: TALENT_COST[100], effect: { kind: "heroDps", mult: 4 } },
    { id: `${seed.id}-150`, level: 150, costMult: TALENT_COST[150], effect: { kind: "heroDps", mult: 4 } }
  ];
}

export const CLICK_HERO_ID = "aldric";

/** The click hero: the player. Levels raise click damage instead of DPS. */
const ALDRIC: HeroDef = {
  id: CLICK_HERO_ID,
  index: 0,
  baseCost: 5,
  costGrowth: 1.1,
  baseDps: 0,
  baseClick: 1,
  color: "#f5c85b",
  glyph: "⚔",
  upgrades: [
    { id: "aldric-10", level: 10, costMult: 20, effect: { kind: "click", mult: 2 } },
    { id: "aldric-25", level: 25, costMult: 60, effect: { kind: "clickDps", pct: 0.01 } },
    { id: "aldric-50", level: 50, costMult: 500, effect: { kind: "critChance", pct: 0.05 } },
    { id: "aldric-75", level: 75, costMult: 5_000, effect: { kind: "click", mult: 3 } },
    { id: "aldric-100", level: 100, costMult: 80_000, effect: { kind: "clickDps", pct: 0.02 } },
    { id: "aldric-150", level: 150, costMult: 5_000_000, effect: { kind: "click", mult: 5 } },
    { id: "aldric-200", level: 200, costMult: 1e9, effect: { kind: "clickDps", pct: 0.03 } }
  ]
};

export const HEROES: HeroDef[] = [
  ALDRIC,
  ...SEEDS.map((seed, index) => ({
    id: seed.id,
    index: index + 1,
    baseCost: seed.baseCost,
    costGrowth: HERO_COST_GROWTH,
    baseDps: seed.baseDps,
    baseClick: 0,
    color: seed.color,
    glyph: seed.glyph,
    upgrades: heroUpgrades(seed)
  }))
];

export const HERO_BY_ID: Record<string, HeroDef> = lookup(HEROES.map((hero) => [hero.id, hero]));

export const UPGRADE_BY_ID: Record<string, { hero: HeroDef; upgrade: HeroUpgradeDef }> = lookup(
  HEROES.flatMap((hero) => hero.upgrades.map((upgrade) => [upgrade.id, { hero, upgrade }] as const))
);
