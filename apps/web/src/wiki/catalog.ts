import { BESTIARY, HEROES, NAMED_RELICS } from "@idlebound/game";
import type { ArtSpec } from "@/game/pixel/Art";

/**
 * The wiki's map: every topic, in reading order, grouped as the sidebar shows them. Titles
 * and words live in `i18n/messages/wiki*.ts`; entries (companions, creatures, named relics)
 * come straight from the game data, so a new creature or relic has its page at once.
 */
export const TOPIC_GROUPS = ["start", "rules", "world", "beyond"] as const;
export type TopicGroup = (typeof TOPIC_GROUPS)[number];

export const TOPIC_IDS = [
  "getting-started",
  "faq",
  "calculator",
  "combat",
  "companions",
  "powers",
  "ascension",
  "promise",
  "relics",
  "idle",
  "bestiary",
  "biomes",
  "strata",
  "events",
  "chronicle",
  "deeds",
  "descent",
  "account"
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export interface TopicDef {
  id: TopicId;
  group: TopicGroup;
  /** Its picture in the page header, and on the index unless it has an icon. */
  art: ArtSpec;
  /** Its picture on the index when `art` is wider than a card's frame at its own size. */
  icon?: ArtSpec;
}

export const TOPICS: readonly TopicDef[] = [
  { id: "getting-started", group: "start", art: { kind: "portrait", hero: "aldric" } },
  { id: "faq", group: "start", art: { kind: "creature", id: "field-rat", animated: false }, icon: { kind: "portrait", hero: "brom" } },
  { id: "calculator", group: "start", art: { kind: "market", id: "hourglass" } },
  { id: "combat", group: "rules", art: { kind: "creature", id: "moss-alpha", animated: false }, icon: { kind: "altar", id: "blade" } },
  { id: "companions", group: "rules", art: { kind: "portrait", hero: "maelle" } },
  { id: "powers", group: "rules", art: { kind: "power", id: "frenzy" } },
  { id: "ascension", group: "rules", art: { kind: "altar", id: "might" } },
  { id: "promise", group: "rules", art: { kind: "emblem", hero: "kaelen" } },
  { id: "relics", group: "rules", art: { kind: "relic", slot: "weapon", base: 2, rarity: "legendary", forge: 6, named: "oathcutter" } },
  { id: "idle", group: "rules", art: { kind: "altar", id: "patience" } },
  { id: "bestiary", group: "world", art: { kind: "creature", id: "hollow-scarecrow", animated: false }, icon: { kind: "creature", id: "golden-rat", animated: false } },
  { id: "biomes", group: "world", art: { kind: "scene", biome: "dark-forest" }, icon: { kind: "ware", id: "moth-lantern" } },
  { id: "strata", group: "world", art: { kind: "creature", id: "ruined-king", animated: false }, icon: { kind: "altar", id: "time" } },
  { id: "events", group: "world", art: { kind: "crystal" } },
  { id: "chronicle", group: "beyond", art: { kind: "portrait", hero: "oriane" } },
  { id: "deeds", group: "beyond", art: { kind: "creature", id: "golden-rat", animated: false }, icon: { kind: "altar", id: "memory" } },
  { id: "descent", group: "beyond", art: { kind: "portrait", hero: "eldra" } },
  { id: "account", group: "beyond", art: { kind: "market", id: "chest" } }
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((topic) => [topic.id, topic])) as Record<TopicId, TopicDef>;

export function isTopic(value: string): value is TopicId {
  return (TOPIC_IDS as readonly string[]).includes(value);
}

/** Topics whose entries each have a page of their own, and the ids of those entries. */
export const ENTRY_TOPICS = {
  companions: HEROES.map((hero) => hero.id),
  bestiary: BESTIARY.map((entry) => entry.id),
  relics: NAMED_RELICS.map((relic) => relic.id)
} as const satisfies Partial<Record<TopicId, readonly string[]>>;

export type EntryTopic = keyof typeof ENTRY_TOPICS;

export function isEntryTopic(topic: string): topic is EntryTopic {
  return Object.hasOwn(ENTRY_TOPICS, topic);
}

export function hasEntry(topic: EntryTopic, entry: string): boolean {
  return (ENTRY_TOPICS[topic] as readonly string[]).includes(entry);
}
