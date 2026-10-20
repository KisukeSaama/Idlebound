import { AFFIX_BASE, AFFIX_CAP, RARITIES, RARITY_INFO, SLOTS, SLOT_BASE_COUNT, SLOT_MAIN_STAT, levelScale } from "./data/items";
import { TRAIT_COUNT, memoryPool, remembersBearer, slotTraits, type TraitId } from "./data/traits";
import { pick, uid, type Rng } from "./rng";
import type { Affix, AffixStat, Item, ItemSlot, Rarity } from "./types";

const SECONDARY: AffixStat[] = ["dps", "click", "gold", "critChance", "critDamage", "bossDamage"];

/** Highest roll of an affix relative to its nominal value. */
export const AFFIX_ROLL_MAX = 1.2;

export function rollRarity(rng: Rng, luck = 1, minimum: Rarity = "common"): Rarity {
  const minIndex = RARITIES.indexOf(minimum);
  const pool = RARITIES.slice(minIndex);
  const weights = pool.map((rarity, index) => RARITY_INFO[rarity].weight * (index >= 2 ? luck : 1));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = rng() * total;
  for (let index = 0; index < pool.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) return pool[index];
  }
  return pool[pool.length - 1];
}

export function maxAffixValue(stat: AffixStat, rarity: Rarity, level: number): number {
  const raw = AFFIX_BASE[stat] * RARITY_INFO[rarity].power * levelScale(level) * AFFIX_ROLL_MAX;
  const cap = AFFIX_CAP[stat];
  return cap === undefined ? raw : Math.min(raw, cap);
}

function rollAffix(rng: Rng, stat: AffixStat, rarity: Rarity, level: number): Affix {
  const roll = 0.8 + rng() * (AFFIX_ROLL_MAX - 0.8);
  const raw = AFFIX_BASE[stat] * RARITY_INFO[rarity].power * levelScale(level) * roll;
  const cap = AFFIX_CAP[stat];
  const value = cap === undefined ? raw : Math.min(raw, cap);
  return { stat, value: Math.floor(value * 10_000) / 10_000 };
}

/**
 * What a relic remembers beyond its weight (`data/traits.ts`): its traits, and who carried it
 * among the companions the walker ever had (`bestHired`). Drawn after everything else, so the
 * draws of a relic's slot, rarity and affixes stay what they always were.
 */
export function rememberRelic(item: Item, rng: Rng, bestHired: number): Item {
  const pool = slotTraits(item.slot).map((trait) => trait.id);
  const traits: string[] = [];
  while (traits.length < TRAIT_COUNT[item.rarity] && pool.length > 0) {
    const [id] = pool.splice(Math.floor(rng() * pool.length), 1);
    traits.push(id);
  }
  if (traits.length > 0) item.traits = traits;
  if (remembersBearer(item.rarity)) item.memory = pick(rng, memoryPool(bestHired));
  return item;
}

/**
 * A relic made to remember `trait` (the stall's rare place, legendary or better): it takes the
 * place of the first trait drawn, unless the relic already holds it.
 */
export function rememberTrait(item: Item, trait: TraitId): Item {
  const traits = item.traits ?? [];
  if (!traits.includes(trait)) item.traits = [trait, ...traits.slice(1)];
  return item;
}

/** Brom rekindles a relic: `trait` goes, another of its slot it does not hold comes. */
export function rekindleTrait(item: Item, trait: string, rng: Rng): string | null {
  const traits = item.traits ?? [];
  const index = traits.indexOf(trait);
  if (index < 0) return null;
  const pool = slotTraits(item.slot).map((entry) => entry.id as string).filter((id) => !traits.includes(id));
  if (pool.length === 0) return null;
  const next = pick(rng, pool);
  item.traits = traits.map((id, at) => (at === index ? next : id));
  item.rekindled = (item.rekindled ?? 0) + 1;
  return next;
}

export function generateItem(rng: Rng, level: number, options: { slot?: ItemSlot; rarity?: Rarity; luck?: number; minimum?: Rarity; bestHired?: number } = {}): Item {
  const slot = options.slot ?? pick(rng, SLOTS);
  const rarity = options.rarity ?? rollRarity(rng, options.luck ?? 1, options.minimum);
  const info = RARITY_INFO[rarity];
  const main = SLOT_MAIN_STAT[slot];
  const affixes: Affix[] = [rollAffix(rng, main, rarity, level)];
  const pool = SECONDARY.filter((stat) => stat !== main);
  while (affixes.length < info.affixes && pool.length > 0) {
    const index = Math.floor(rng() * pool.length);
    const [stat] = pool.splice(index, 1);
    affixes.push(rollAffix(rng, stat, rarity, level));
  }
  if (rarity === "legendary" || rarity === "mythic") affixes.push(rollAffix(rng, "essence", rarity, level));
  const base = Math.floor(rng() * SLOT_BASE_COUNT[slot]);

  const item: Item = { uid: uid(rng), slot, rarity, level: Math.max(1, Math.floor(level)), base, affixes, forge: 0 };
  return rememberRelic(item, rng, options.bestHired ?? 0);
}
