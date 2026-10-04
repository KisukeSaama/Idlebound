import { BESTIARY_BY_ID, HEROES, HERO_BY_ID, WANDERER_BY_ID } from "@idlebound/game";
import type { Gate } from "./gates";

/** Bestiary pages the road shows from the first night: the five biomes and their guardians. */
const OPEN_PAGES = new Set(["green-plains", "dark-forest", "forgotten-caves", "corrupted-marsh", "fallen-king-ruins"]);

/**
 * When a creature stops being a secret: the Remnants of the five biomes and Pip are the road
 * itself (the landing page shows them); rare wanderers, the creatures of events, the Dawn and
 * the King's later forms are revealed by meeting them, as the game's Bestiary does.
 */
export function creatureGate(id: string): Gate | undefined {
  const entry = BESTIARY_BY_ID[id];
  if (!entry || id === "golden-rat") return undefined;
  if (OPEN_PAGES.has(entry.page) && !Object.hasOwn(WANDERER_BY_ID, id)) return undefined;
  return { kind: "kills", id, count: 1 };
}

/**
 * When a companion stops being a secret: the shop shows each one once the one before joined,
 * so Aldric and Maëlle are known from the first minute.
 */
export function companionGate(id: string): Gate | undefined {
  const hero = HERO_BY_ID[id];
  if (!hero || hero.index <= 1) return undefined;
  return { kind: "hired", hero: HEROES[hero.index - 1].id };
}
