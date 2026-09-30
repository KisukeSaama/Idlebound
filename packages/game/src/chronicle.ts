import { ALTARS } from "./data/altars";
import { ECLIPSE_EVERY, EVENTS } from "./data/events";
import {
  BESTIARY,
  RECOGNITION_HEROES,
  SAYINGS,
  WANDERERS,
  ageEchoesFound,
  bestiaryKills,
  echoesFound,
  recognitionTier,
  rememberedCompanions
} from "./data/lore";
import { BIOMES } from "./data/biomes";
import { promisesKept } from "./data/promises";
import { AGE_COUNT, MILESTONES, keystonesFound, type MilestoneId } from "./data/strata";
import type { ChronicleEntry, GameState } from "./types";

/** The Chronicle's sources, in the order the book shows them. */
export type ChronicleSource = ChronicleEntry["source"];
export const CHRONICLE_SOURCES: readonly ChronicleSource[] = [
  "keystone", "milestone", "king", "echo", "age", "wanderer", "event", "memory", "promise", "lesson", "song", "dream", "saying", "relic", "altar", "secret", "crown"
];

/** Whether a walker has lived one of the milestones of their own story. */
export function milestoneReached(state: GameState, id: MilestoneId): boolean {
  const tiers = () => RECOGNITION_HEROES.map((hero) => recognitionTier(state, hero));
  switch (id) {
    case "ascend-1": return state.lifetime.ascensions >= 1;
    case "ascend-5": return state.lifetime.ascensions >= 5;
    case "ascend-10": return state.lifetime.ascensions >= 10;
    case "ascend-25": return state.lifetime.ascensions >= 25;
    case "ascend-50": return state.lifetime.ascensions >= 50;
    case "ascend-100": return state.lifetime.ascensions >= 100;
    case "descent-1": return state.descents >= 1;
    case "descent-3": return state.descents >= 3;
    case "descent-5": return state.descents >= 5;
    case "descent-10": return state.descents >= 10;
    case "remember-first": return tiers().some((tier) => tier >= 1);
    case "remember-third": return tiers().some((tier) => tier >= 3);
    case "remember-whole": return tiers().some((tier) => tier >= 5);
    case "remember-five": return rememberedCompanions(state) >= 5;
    case "remember-ten": return rememberedCompanions(state) >= 10;
    case "remember-all": return rememberedCompanions(state) >= RECOGNITION_HEROES.length;
    case "kaelen-ran": return recognitionTier(state, "kaelen") >= 4;
    case "nameless-speaks": return recognitionTier(state, "nameless") >= 3;
    case "eldra-loom": return recognitionTier(state, "eldra") >= 5;
    case "awakened-hello": return recognitionTier(state, "awakened") >= 5;
  }
}

/** Whether an event has been met once (its fragment). */
export function eventSeen(state: GameState, id: string): boolean {
  if (id === "storm") return bestiaryKills(state, "lantern-queen") > 0;
  return state.lore.events.includes(id);
}

/** Entries of one source, in the order they were found (as far as the counters tell). */
export function sourceEntries(state: GameState, source: ChronicleSource): ChronicleEntry[] {
  const entries: ChronicleEntry[] = [];
  switch (source) {
    case "keystone": {
      const found = keystonesFound(state.maxStageEver);
      for (let era = 0; era < found; era += 1) entries.push({ source, era });
      state.lore.readings.forEach((strata, index) => {
        for (let era = 0; era < strata; era += 1) entries.push({ source, era, reading: index + 1 });
      });
      break;
    }
    case "milestone":
      for (const id of MILESTONES) if (milestoneReached(state, id)) entries.push({ source, id });
      break;
    case "king":
      for (let night = 1; night <= state.lifetime.ascensions; night += 1) {
        entries.push({ source, night });
        // The Eclipse armed at this dusk fell before the next one could come.
        if (night % ECLIPSE_EVERY === 0 && night < state.lifetime.ascensions) entries.push({ source, night, eclipse: true });
      }
      break;
    case "echo":
      for (const biome of BIOMES) {
        const found = echoesFound(state, biome.id);
        for (let index = 0; index < found; index += 1) entries.push({ source, biome: biome.id, index });
      }
      break;
    case "age":
      for (let age = 0; age < AGE_COUNT; age += 1) {
        const found = ageEchoesFound(state, age);
        for (let index = 0; index < found; index += 1) entries.push({ source, age, index });
      }
      break;
    case "wanderer":
      for (const wanderer of WANDERERS) if (bestiaryKills(state, wanderer.id) > 0) entries.push({ source, id: wanderer.id });
      break;
    case "event":
      for (const id of EVENTS) if (eventSeen(state, id)) entries.push({ source, id });
      break;
    case "memory":
      // Lower tiers are reached first: tier by tier, then companion by companion.
      for (let tier = 1; tier <= 5; tier += 1) {
        for (const hero of RECOGNITION_HEROES) if (recognitionTier(state, hero) >= tier) entries.push({ source, hero, tier });
      }
      break;
    case "promise":
      // What each companion said the first time the walker kept their word.
      for (const hero of RECOGNITION_HEROES) if (promisesKept(state, hero) > 0) entries.push({ source, hero });
      break;
    case "lesson":
      for (const id of state.lore.lessons) entries.push({ source, id });
      break;
    case "song":
      for (let index = 0; index < state.lore.songs; index += 1) entries.push({ source, index });
      break;
    case "dream":
      for (let index = 0; index < state.lore.dreams; index += 1) entries.push({ source, index });
      break;
    case "saying":
      for (let index = 0; index < Math.min(SAYINGS, state.lore.sayings); index += 1) entries.push({ source, index });
      break;
    case "relic":
      for (const id of state.named) entries.push({ source, id });
      break;
    case "altar":
      for (const altar of ALTARS) if (state.lore.altars.includes(altar.id)) entries.push({ source, id: altar.id });
      break;
    case "secret":
      for (const id of state.secrets) entries.push({ source, id });
      break;
    case "crown":
      if (state.secrets.includes("it-wears-you")) entries.push({ source });
      break;
  }
  return entries;
}

/** Eclipses of the King fallen so far: each armed at a seventh dusk falls during the next night. */
export function eclipsesFallen(state: GameState): number {
  return Math.max(0, Math.floor((state.lifetime.ascensions - 1) / ECLIPSE_EVERY));
}

/** How many entries a source holds, without building them. */
export function sourceCount(state: GameState, source: ChronicleSource): number {
  switch (source) {
    case "keystone": return keystonesFound(state.maxStageEver) + state.lore.readings.reduce((total, strata) => total + strata, 0);
    case "king": return state.lifetime.ascensions + eclipsesFallen(state);
    case "echo": return BIOMES.reduce((total, biome) => total + echoesFound(state, biome.id), 0);
    case "age": {
      let total = 0;
      for (let age = 0; age < AGE_COUNT; age += 1) total += ageEchoesFound(state, age);
      return total;
    }
    case "song": return state.lore.songs;
    case "dream": return state.lore.dreams;
    case "saying": return Math.min(SAYINGS, state.lore.sayings);
    default: return sourceEntries(state, source).length;
  }
}

/** Every Chronicle entry the walker has found, source by source. */
export function chronicleEntries(state: GameState): ChronicleEntry[] {
  return CHRONICLE_SOURCES.flatMap((source) => sourceEntries(state, source));
}

/** Fragments found in all (the Deeds of the fragments series count them). */
export function chronicleCount(state: GameState): number {
  return CHRONICLE_SOURCES.reduce((total, source) => total + sourceCount(state, source), 0);
}

export function seenOf(state: GameState, source: ChronicleSource): number {
  return Object.hasOwn(state.lore.seen, source) ? state.lore.seen[source] : 0;
}

/** Entries of a source not read yet: the last ones found. */
export function unreadOf(state: GameState, source: ChronicleSource): number {
  return Math.max(0, sourceCount(state, source) - seenOf(state, source));
}

/** Chronicle entries not read yet. */
export function unreadChronicle(state: GameState): number {
  return CHRONICLE_SOURCES.reduce((total, source) => total + unreadOf(state, source), 0);
}

/** Bestiary lines unlocked so far, over every creature. */
export function bestiaryLines(state: GameState): number {
  let lines = 0;
  for (const entry of BESTIARY) lines += entry.tiers.filter((threshold) => bestiaryKills(state, entry.id) >= threshold).length;
  return lines;
}
