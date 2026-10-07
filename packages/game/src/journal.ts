import { z } from "zod";
import { CHRONICLE_SOURCES } from "./chronicle";
import { ALTARS } from "./data/altars";
import { WEAVES } from "./data/descent";
import { MARKET_OFFERS } from "./data/market";
import { SKILLS } from "./data/skills";
import { LOCALES } from "./i18n";
import { STEP_MS } from "./engine";
import { JOURNAL_MAX_ENTRIES, JOURNAL_MAX_STEPS, entryCommand, type Journal, type JournalEntry } from "./replay";

/**
 * Strikes a journal may hold per step of its span: 400 a second, far past any hand or
 * autoclicker the bounds accept. More would only make the replay spin: they are dropped.
 */
const CLICKS_PER_STEP = 20;

/**
 * The journal as it comes from a page, checked before the server replays it: its shape, its
 * size, and each command's fields. A command that fails its check is dropped (counted as
 * ignored by the replay); a journal that fails its own shape is no journal at all.
 */

const time = z.number().int().min(0).max(8.64e15);
const id = z.string().min(1).max(60);
const slot = z.enum(["weapon", "armor", "amulet", "ring"]);

const COMMANDS: Record<string, z.ZodType> = {
  click: z.object({ type: z.literal("click"), count: z.number().int().min(1).max(200) }),
  crystal: z.object({ type: z.literal("crystal") }),
  skill: z.object({ type: z.literal("skill"), id: z.enum(SKILLS.map((skill) => skill.id) as [string, ...string[]]) }),
  hero: z.object({ type: z.literal("hero"), id, mode: z.union([z.literal("max"), z.number().int().min(1).max(100_000)]) }),
  talent: z.object({ type: z.literal("talent"), id }),
  talents: z.object({ type: z.literal("talents") }),
  travel: z.object({ type: z.literal("travel"), stage: z.number().int().min(1).max(10_000_000) }),
  auto: z.object({ type: z.literal("auto") }),
  pledge: z.object({ type: z.literal("pledge"), hero: id.nullable() }),
  break: z.object({ type: z.literal("break") }),
  ascend: z.object({ type: z.literal("ascend") }),
  altar: z.object({ type: z.literal("altar"), id: z.enum(ALTARS.map((altar) => altar.id) as [string, ...string[]]) }),
  descend: z.object({ type: z.literal("descend") }),
  weave: z.object({ type: z.literal("weave"), id: z.enum(WEAVES.map((weave) => weave.id) as [string, ...string[]]) }),
  equip: z.object({ type: z.literal("equip"), uid: id }),
  unequip: z.object({ type: z.literal("unequip"), slot }),
  salvage: z.object({ type: z.literal("salvage"), uid: id }),
  salvageUpTo: z.object({ type: z.literal("salvageUpTo"), rarity: z.enum(["common", "rare", "epic", "legendary", "mythic"]) }),
  lock: z.object({ type: z.literal("lock"), uid: id }),
  forge: z.object({ type: z.literal("forge"), slot }),
  market: z.object({ type: z.literal("market") }),
  offer: z.object({ type: z.literal("offer"), id: z.enum(MARKET_OFFERS.map((offer) => offer.id) as [string, ...string[]]) }),
  caravan: z.object({ type: z.literal("caravan") }),
  remember: z.object({ type: z.literal("remember") }),
  tutorial: z.object({ type: z.literal("tutorial"), step: z.string().min(1).max(40) }),
  portrait: z.object({ type: z.literal("portrait"), hero: id }),
  crown: z.object({ type: z.literal("crown"), ms: z.number().int().min(0).max(86_400_000) }),
  welcome: z.object({ type: z.literal("welcome"), ms: z.number().int().min(0).max(8.64e12) }),
  read: z.object({ type: z.literal("read"), source: z.enum(CHRONICLE_SOURCES as unknown as [string, ...string[]]), count: z.number().int().min(0).max(1_000_000) }),
  readAll: z.object({ type: z.literal("readAll") }),
  settings: z.object({
    type: z.literal("settings"),
    patch: z.object({
      notation: z.enum(["letters", "scientific", "engineering"]),
      sound: z.boolean(),
      volume: z.number().min(0).max(1),
      damageNumbers: z.boolean(),
      reducedMotion: z.boolean(),
      confirmAscension: z.boolean(),
      buyMode: z.union([z.literal(1), z.literal(10), z.literal(25), z.literal(100), z.literal("max")]),
      offlineSpending: z.boolean(),
      darkNight: z.boolean(),
      colorblind: z.boolean()
    }).partial().strict()
  }),
  input: z.object({ type: z.literal("input") }),
  visible: z.object({ type: z.literal("visible"), on: z.boolean() }),
  locale: z.object({ type: z.literal("locale"), locale: z.enum(LOCALES as unknown as [string, ...string[]]) }),
  zone: z.object({ type: z.literal("zone"), minutes: z.number().int().min(-14 * 60).max(14 * 60) })
};

const CLOCK = new Set(["@catchUp", "@rewind", "@mark"]);

const entry = z.union([
  z.tuple([z.number().int().min(-8.64e12).max(8.64e12), z.string().max(20)]),
  z.tuple([z.number().int().min(-8.64e12).max(8.64e12), z.string().max(20), z.unknown()])
]);

const journalSchema = z.object({
  base: z.object({ revision: z.number().int().min(1).nullable(), createdAt: time, guest: z.boolean().optional() }).strict(),
  open: z.object({
    at: time,
    skipTo: time,
    afkAfterMs: z.number().int().min(0).max(86_400_000).nullable(),
    locale: z.enum(LOCALES as unknown as [string, ...string[]]),
    visible: z.boolean()
  }).strict().optional(),
  start: time,
  entries: z.array(entry).max(JOURNAL_MAX_ENTRIES),
  end: time
}).strict();

export interface ParsedJournal {
  journal: Journal;
  /** Entries dropped for a malformed command. */
  dropped: number;
}

/** Checks a journal from a page; null when its shape is wrong. Malformed commands are dropped. */
export function parseJournal(raw: unknown): ParsedJournal | null {
  const parsed = journalSchema.safeParse(raw);
  if (!parsed.success) return null;
  const journal = parsed.data as Journal;
  const entries: JournalEntry[] = [];
  let dropped = 0;
  let carried = 0;
  const span = Math.min(JOURNAL_MAX_STEPS, Math.max(0, journal.end - journal.start) / STEP_MS) + 1;
  let clicks = span * CLICKS_PER_STEP;
  for (const item of journal.entries) {
    const [dt, type] = item;
    if (CLOCK.has(type)) {
      // A catch-up says how long its gap was; the other clock entries carry nothing.
      const gap = item[2];
      if (type === "@catchUp" && typeof gap === "number" && Number.isInteger(gap) && gap > 0 && gap <= 8.64e12) entries.push([dt + carried, type, gap]);
      else entries.push([dt + carried, type]);
      carried = 0;
      continue;
    }
    const schema = Object.hasOwn(COMMANDS, type) ? COMMANDS[type] : undefined;
    const command = schema ? entryCommand(item) : null;
    const count = type === "click" && typeof item[2] === "number" ? item[2] : 0;
    if (!schema || !command || !schema.safeParse(command).success || count > clicks) {
      // Its time still passed: the next entry keeps its place on the clock.
      carried += dt;
      dropped += 1;
      continue;
    }
    clicks -= count;
    entries.push([dt + carried, ...item.slice(1)] as JournalEntry);
    carried = 0;
  }
  return { journal: { ...journal, entries }, dropped };
}
