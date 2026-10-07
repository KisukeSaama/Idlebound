import type { Command } from "./commands";
import { GameEngine, STEP_MS, type EngineRuntime, type JournalEvent } from "./engine";
import type { Fates } from "./fates";
import type { Locale } from "./i18n";
import { createInitialState } from "./state";
import type { GameEvent, GameState, SkillId } from "./types";

/**
 * The journal: what the walker did between two saves, in order, and what the clock did. The
 * page writes it as it plays (the engine tells it, see `GameEngine.journal`); the server
 * replays it with the same engine from the save it built on, and lands on the same game.
 *
 * On the wire an entry is `[dt, type, payload?]`: `dt` the milliseconds since the previous
 * entry (or since `start`), `type` a command's type, or one of the clock's: "@catchUp" (a gap
 * lived in one catch-up, its length in ms as payload: the steps before it run first), "@rewind"
 * (the clock stood behind the last step), "@mark" (the page sent a save from here: its engine
 * refreshed what it derives).
 */
export type JournalEntry = [number, string] | [number, string, unknown];

/** Where a journal begins. */
export interface JournalBase {
  /** The stored revision it builds on; null for a new game, born at `createdAt`. */
  revision: number | null;
  createdAt: number;
  /** The revision is a guest's game (the one an account adopts). */
  guest?: boolean;
}

/** The page made its engine from the base (a load, a new game): how, so the server makes the same. */
export interface JournalOpen {
  /** The page's clock when it made the engine. */
  at: number;
  /** The base's last step was moved here first: time away the walker is not credited. */
  skipTo: number;
  afkAfterMs: number | null;
  locale: Locale;
  visible: boolean;
}

export interface Journal {
  base: JournalBase;
  /** Absent: the engine carried on from the end of the journal the server last accepted. */
  open?: JournalOpen;
  /** The time the first entry's `dt` counts from. */
  start: number;
  entries: JournalEntry[];
  /** The save's last step: the replay runs to it. */
  end: number;
}

/** Live play a single journal may hold, in steps: ten minutes (catch-ups count for nothing). */
export const JOURNAL_MAX_STEPS = (10 * 60_000) / STEP_MS;
/** Entries a single journal may hold. */
export const JOURNAL_MAX_ENTRIES = 60_000;

/** What the replay saw of the walker's presence (never of their clicks): see `presence` on the server. */
export interface PresenceTally {
  /** Crystals that appeared, and those caught. */
  crystalsSeen: number;
  crystalsCaught: number;
  /** Time from a crystal's appearance to its catch, in buckets of `REACTION_BUCKETS` (ms). */
  reactions: number[];
  /** Powers used, and those used within a second of coming back. */
  powers: number;
  promptPowers: number;
  /** Ascensions, and those taken within a minute of the previous one being possible again. */
  ascensions: number;
  /** When each act of presence happened (a crystal caught, a power, an ascension), in order. */
  acts: number[];
}

/** Upper bounds of the reaction buckets, in ms; the last bucket holds everything slower. */
export const REACTION_BUCKETS = [300, 500, 800, 1200, 2000, 4000] as const;
/** Acts kept per replay: enough to follow a long span, never a flood. */
const MAX_ACTS = 2_000;

export function emptyTally(): PresenceTally {
  return { crystalsSeen: 0, crystalsCaught: 0, reactions: REACTION_BUCKETS.map(() => 0).concat(0), powers: 0, promptPowers: 0, ascensions: 0, acts: [] };
}

export interface ReplayResult {
  /** The engine at the end of the replay: the page carries on with it after a correction. */
  engine: GameEngine;
  state: GameState;
  runtime: EngineRuntime;
  /** Commands that could not be run (malformed, or refused by the engine by throwing). */
  ignored: number;
  /** Clock entries that did not hold (a catch-up after a short gap, a rewind forward). */
  stray: number;
  steps: number;
  presence: PresenceTally;
}

export type ReplayFailure = { error: "too-long" | "no-runtime" | "bad-end" };

/** Writes what the engine tells it, as entries on the wire. */
export class JournalWriter {
  entries: JournalEntry[] = [];
  private last: number;
  /** When the walker's presence was last written, if nothing but commands came since. */
  private inputAt: number | null = null;

  constructor(public start: number) {
    this.last = start;
  }

  /** Listens to `engine` from now on. */
  attach(engine: GameEngine) {
    engine.journal = (event) => this.write(event);
  }

  write(event: JournalEvent) {
    if (event.kind === "command" && event.command.type === "input") {
      // The walker's presence, told twice in the same step, changes nothing the second time.
      if (event.at === this.inputAt) return;
      this.inputAt = event.at;
    } else if (event.kind !== "command") {
      this.inputAt = null;
    }
    const dt = event.at - this.last;
    this.last = event.at;
    if (event.kind === "catchUp") {
      this.entries.push([dt, "@catchUp", event.gap]);
      return;
    }
    if (event.kind !== "command") {
      this.entries.push([dt, `@${event.kind}`]);
      return;
    }
    const { type, ...payload } = event.command;
    const previous = this.entries[this.entries.length - 1];
    // Clicks in the same step are one entry (the walker's presence between them changes nothing).
    if (type === "click" && dt === 0 && previous && previous[1] === "click") {
      previous[2] = (previous[2] as number) + (event.command as { count: number }).count;
      return;
    }
    const keys = Object.keys(payload);
    if (keys.length === 0) this.entries.push([dt, type]);
    else if (keys.length === 1) this.entries.push([dt, type, (payload as Record<string, unknown>)[keys[0]]]);
    else this.entries.push([dt, type, payload]);
  }

  /** The page sends a save from here (see "@mark"). */
  mark(at: number) {
    this.write({ kind: "mark", at });
  }

  /**
   * Forgets the first `count` entries (the server kept them), whose last one was written at
   * `start`: the first entry left counts from there.
   */
  drop(count: number, start: number) {
    this.entries = this.entries.slice(count);
    this.start = start;
  }
}

/** The single payload field of each command type, when it has exactly one (see `JournalWriter.write`). */
const SINGLE_FIELD: Partial<Record<Command["type"], string>> = {
  click: "count",
  skill: "id",
  talent: "id",
  travel: "stage",
  pledge: "hero",
  ascend: "spare",
  altar: "id",
  weave: "id",
  equip: "uid",
  unequip: "slot",
  salvage: "uid",
  salvageUpTo: "rarity",
  lock: "uid",
  forge: "slot",
  offer: "id",
  tutorial: "step",
  portrait: "hero",
  crown: "ms",
  welcome: "ms",
  settings: "patch",
  visible: "on",
  locale: "locale",
  zone: "minutes"
};

/** An entry back to its command (the reverse of `JournalWriter.write`); null for a clock entry. */
export function entryCommand(entry: JournalEntry): Command | null {
  const [, type, payload] = entry;
  if (type.startsWith("@")) return null;
  const field = SINGLE_FIELD[type as Command["type"]];
  if (field) return { type, [field]: payload } as unknown as Command;
  if (payload && typeof payload === "object") return { type, ...(payload as object) } as Command;
  return { type } as Command;
}

/** The base's game as the replay starts it: a stored save, or a new game born at `createdAt`. */
export function journalBase(journal: Journal, stored: GameState | null): GameState | null {
  if (journal.base.revision === null) return createInitialState(journal.base.createdAt);
  return stored ? structuredClone(stored) : null;
}

/**
 * Replays `journal` from `base` (the stored game it builds on, as the server kept it) with
 * `fates`, and `runtime` (the page's rhythms where the last replay left them, needed when the
 * journal carries on rather than opens). Commands the engine cannot run are skipped, never a
 * reason to fail: the game the replay lands on is what the walker could really have done.
 */
export function replay(base: GameState, runtime: EngineRuntime | null, journal: Journal, fates: Fates): ReplayResult | ReplayFailure {
  const state = structuredClone(base);
  let engine: GameEngine;
  if (journal.open) {
    const open = journal.open;
    state.lastTickAt = Math.max(state.lastTickAt, open.skipTo);
    engine = new GameEngine(state, fates, open.at);
    engine.afkAfterMs = open.afkAfterMs;
    engine.locale = open.locale;
    engine.visible = open.visible;
    engine.markInput(open.at);
  } else {
    if (!runtime) return { error: "no-runtime" };
    engine = new GameEngine(state, fates, state.lastTickAt);
    engine.restore(runtime);
  }
  if (journal.end < state.lastTickAt && journal.entries.every((entry) => entry[1] !== "@rewind")) return { error: "bad-end" };

  const presence = emptyTally();
  let crystalAt: number | null = null;
  let steps = 0;
  let ignored = 0;
  let stray = 0;

  const listen = (now: number) => {
    for (const event of engine.drainEvents()) {
      crystalAt = notice(presence, event, now, crystalAt);
    }
  };
  /** Runs whole steps up to `at`, as the page's ticks did. */
  const stepTo = (at: number): boolean => {
    const s = engine.state;
    while (s.lastTickAt + STEP_MS <= at) {
      steps += 1;
      if (steps > JOURNAL_MAX_STEPS) return false;
      engine.tick(s.lastTickAt + STEP_MS);
      listen(s.lastTickAt);
    }
    return true;
  };

  let at = journal.start;
  for (const entry of journal.entries) {
    at += entry[0];
    const type = entry[1];
    if (type === "@catchUp") {
      // The steps the page ran before the gap opened, then the gap in one catch-up.
      const gap = typeof entry[2] === "number" ? entry[2] : 0;
      if (!stepTo(at - gap)) return { error: "too-long" };
      if (gap > 5_000 && at - engine.state.lastTickAt === gap) {
        engine.tick(at);
        listen(at);
      } else {
        stray += 1;
        if (!stepTo(at)) return { error: "too-long" };
      }
      continue;
    }
    if (type === "@rewind") {
      if (at < engine.state.lastTickAt) engine.tick(at);
      else stray += 1;
      continue;
    }
    if (!stepTo(at)) return { error: "too-long" };
    if (type === "@mark") {
      engine.refresh(engine.state.lastTickAt);
      continue;
    }
    const command = entryCommand(entry);
    if (!command) {
      ignored += 1;
      continue;
    }
    const now = engine.state.lastTickAt;
    const before = command.type === "skill" ? engine.state.skills[command.id as SkillId]?.readyAt : undefined;
    try {
      const done = engine.perform(command, now);
      if (command.type === "skill" && done === true) {
        presence.powers += 1;
        if (before !== undefined && now - before <= 1_000) presence.promptPowers += 1;
        act(presence, now);
      }
    } catch {
      ignored += 1;
    }
    listen(now);
  }
  if (!stepTo(journal.end)) return { error: "too-long" };
  return { engine, state: engine.state, runtime: engine.runtime(), ignored, stray, steps, presence };
}

function act(presence: PresenceTally, now: number) {
  if (presence.acts.length < MAX_ACTS) presence.acts.push(now);
}

/** What an event tells of presence; returns when the crystal in sight appeared. */
function notice(presence: PresenceTally, event: GameEvent, now: number, crystalAt: number | null): number | null {
  switch (event.type) {
    case "crystalSpawned":
      presence.crystalsSeen += 1;
      return now;
    case "crystal": {
      presence.crystalsCaught += 1;
      if (crystalAt !== null) {
        const reaction = now - crystalAt;
        const bucket = REACTION_BUCKETS.findIndex((limit) => reaction < limit);
        presence.reactions[bucket === -1 ? REACTION_BUCKETS.length : bucket] += 1;
      }
      act(presence, now);
      return null;
    }
    case "ascended":
      presence.ascensions += 1;
      act(presence, now);
      return crystalAt;
    default:
      return crystalAt;
  }
}

/**
 * The differences between two saves, as paths (at most `limit`): numbers must match to the
 * last bit, the engine being deterministic (see `dmath.ts`).
 */
export function diffStates(a: unknown, b: unknown, limit = 20): string[] {
  const out: string[] = [];
  const walk = (x: unknown, y: unknown, path: string) => {
    if (out.length >= limit) return;
    if (Object.is(x, y)) return;
    if (typeof x === "number" && typeof y === "number" && x === y) return;
    if (x === null || y === null || typeof x !== "object" || typeof y !== "object") {
      out.push(path || "$");
      return;
    }
    if (Array.isArray(x) !== Array.isArray(y)) {
      out.push(path || "$");
      return;
    }
    const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
    for (const key of keys) {
      const left = (x as Record<string, unknown>)[key];
      const right = (y as Record<string, unknown>)[key];
      if (left === undefined && right === undefined) continue;
      walk(left, right, path ? `${path}.${key}` : key);
    }
  };
  walk(a, b, "");
  return out;
}
