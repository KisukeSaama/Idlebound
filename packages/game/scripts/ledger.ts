/**
 * A page and a Ledger, in memory, for the tests of the replay: the page plays as the game's
 * store does (commands at the last step, a journal with a mark at each save, checkpoints cut
 * to what the server takes at once, the fates window it was handed), and the Ledger keeps a
 * game as the API does (the save it builds on, the revision before, the game where another
 * page took it, the page's rhythms, a secret seed), replays each journal, compares and checks.
 */
import { GameEngine, STEP_MS } from "../src/engine";
import { buildWindow, localFates, STREAMS, windowFates, type FateWindow, type Fates } from "../src/fates";
import { parseJournal } from "../src/journal";
import { JOURNAL_MAX_ENTRIES, JOURNAL_MAX_STEPS, JournalWriter, diffStates, replay, type Journal, type JournalBase, type ReplayResult } from "../src/replay";
import { parseState } from "../src/save";
import { createInitialState } from "../src/state";
import type { EngineRuntime } from "../src/engine";
import type { GameState } from "../src/types";
import { verifyFirstSight, verifyPace, verifyState, verifyTransition, type Pace, type Violation } from "../src/validation";
import type { Command } from "../src/commands";

const wire = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

interface Kept {
  revision: number;
  state: GameState;
  runtime: EngineRuntime | null;
  pace?: Pace;
  at?: number;
}

export interface SaveAnswer {
  status: 200 | 409 | 422;
  code?: "elsewhere" | "conflict";
  revision?: number;
  fates?: FateWindow;
  replay?: { state: GameState; runtime: EngineRuntime };
  violations?: Violation[];
  outcome?: "match" | "diverged" | "failed" | "no-base" | "no-journal";
  diff?: string[];
  ignored?: number;
}

/** The server's side: one game, kept as the API keeps it. */
export class Ledger {
  stored: (Kept & { updatedAt: number }) | null = null;
  parent: Kept | null = null;
  branch: Kept | null = null;
  holder: string | null = null;
  pace: Pace | undefined;
  /** Where the chain of saves under way began (see `Chain` in the API's schema). */
  chain: { state: GameState; pace: Pace | undefined; at: number } | null = null;
  /** What each save's replay found. */
  outcomes: string[] = [];
  readonly fates: Fates;

  constructor(readonly secret: number, readonly mode: "shadow" | "enforce" = "enforce", public clock = () => Date.now()) {
    this.fates = localFates(secret);
  }

  window(state: GameState): FateWindow {
    return buildWindow(state.fates, (stream, index) => this.fates.slice(stream, index)!);
  }

  /** A new game: its birth date and its window (the same until a save begins it). */
  newGame(createdAt: number) {
    return { createdAt, fates: buildWindow(createInitialState(createdAt).fates, (stream, index) => this.fates.slice(stream, index)!) };
  }

  /** A page opens the game: it holds it, and where another page left it is kept. */
  open(holder: string) {
    if (!this.stored) return null;
    if (this.holder !== null && this.holder !== holder) this.branch = { revision: this.stored.revision, state: structuredClone(this.stored.state), runtime: this.stored.runtime, pace: this.pace, at: this.stored.updatedAt };
    this.holder = holder;
    return { state: wire(this.stored.state), revision: this.stored.revision, fates: this.window(this.stored.state), elapsedMs: this.clock() - this.stored.updatedAt };
  }

  private base(journal: Journal): { state: GameState; runtime: EngineRuntime | null; earlier?: Kept } | null {
    if (journal.base.revision === null) return journal.open ? { state: createInitialState(journal.base.createdAt), runtime: null } : null;
    if (this.stored && this.stored.revision === journal.base.revision) return { state: structuredClone(this.stored.state), runtime: this.stored.runtime };
    for (const kept of [this.branch, this.parent]) {
      if (kept && kept.revision === journal.base.revision) return { state: structuredClone(kept.state), runtime: kept.runtime, earlier: kept };
    }
    return null;
  }

  save(body: { state: unknown; baseRevision: number | null; journal?: unknown; replace?: boolean; holder: string; more?: boolean }): SaveAnswer {
    const now = this.clock();
    const declared = parseState(wire(body.state));
    if (this.stored && this.holder !== null && this.holder !== body.holder && !body.replace) return { status: 409, code: "elsewhere" };
    if (this.stored && body.baseRevision !== this.stored.revision && !body.replace) return { status: 409, code: "conflict" };
    const parsed = body.journal === undefined ? null : parseJournal(wire(body.journal));
    let outcome: SaveAnswer["outcome"] = "no-journal";
    let verdict: ReplayResult | null = null;
    let diff: string[] = [];
    let earlier: Kept | undefined;
    if (parsed) {
      const base = this.base(parsed.journal);
      if (!base) outcome = "no-base";
      else {
        earlier = base.earlier;
        const result = replay(base.state, base.runtime, parsed.journal, this.fates);
        if ("error" in result) outcome = "failed";
        else {
          verdict = result;
          diff = diffStates(parseState(wire(result.state)), declared);
          outcome = diff.length === 0 ? "match" : "diverged";
        }
      }
    }
    this.outcomes.push(outcome);
    const ignored = (verdict?.ignored ?? 0) + (parsed?.dropped ?? 0);
    let next = declared;
    const violations: Violation[] = [];
    if (this.mode === "enforce") {
      if (!verdict) violations.push({ code: "journal", message: outcome });
      else next = parseState(wire(verdict.state));
    }
    violations.push(...verifyState(next, now));
    // Measured from where the journal began when it began earlier, else from the chain or the last save.
    const from = earlier ? { state: earlier.state, pace: earlier.pace, at: earlier.at! } : this.chain ?? (this.stored ? { state: this.stored.state, pace: this.pace, at: this.stored.updatedAt } : null);
    const previous = from?.state;
    const elapsed = from ? now - from.at : 0;
    if (previous) violations.push(...verifyTransition(previous, next, elapsed));
    else violations.push(...verifyFirstSight(next));
    const paced = verifyPace(previous, next, from?.pace, now, elapsed);
    violations.push(...paced.violations);
    if (violations.length > 0) return { status: 422, violations, outcome, diff, ignored };
    this.chain = body.more && this.stored ? this.chain ?? { state: this.stored.state, pace: this.pace, at: this.stored.updatedAt } : null;
    this.pace = paced.pace;
    if (this.stored) this.parent = { revision: this.stored.revision, state: this.stored.state, runtime: this.stored.runtime, pace: this.pace, at: this.stored.updatedAt };
    const revision = (this.stored?.revision ?? 0) + 1;
    this.stored = { revision, state: next, runtime: verdict?.runtime ?? null, updatedAt: now };
    this.holder = body.holder;
    const corrected = this.mode === "enforce" && outcome === "diverged" && verdict ? { replay: wire({ state: next, runtime: verdict.runtime }) } : {};
    return { status: 200, revision, fates: this.window(next), outcome, diff, ignored, ...corrected };
  }
}

interface Checkpoint {
  count: number;
  state: GameState;
  end: number;
  steps: number;
}

/** A page of the game, as the store runs it. */
export class Page {
  engine!: GameEngine;
  revision: number | null = null;
  private window!: FateWindow;
  private writer!: JournalWriter;
  private head!: { base: JournalBase; open?: Journal["open"]; start: number; steps: number };
  private checkpoints: Checkpoint[] = [];

  constructor(readonly ledger: Ledger, readonly holder: string, readonly afkAfterMs: number | null = 60_000) {}

  /** Plays a stored game, or a new one, as `replaceState` does. */
  load(now: number, cloud: { state: GameState; revision: number | null; fates: FateWindow; elapsedMs?: number }) {
    const state = structuredClone(cloud.state);
    const skipTo = now - Math.min(Math.max(0, now - state.lastTickAt), cloud.elapsedMs ?? 0);
    state.lastTickAt = Math.max(state.lastTickAt, skipTo);
    this.window = cloud.fates;
    const engine = new GameEngine(state, windowFates(cloud.fates), now);
    engine.afkAfterMs = this.afkAfterMs;
    engine.locale = "fr";
    engine.visible = true;
    engine.markInput(now);
    this.writer = new JournalWriter(state.lastTickAt);
    this.writer.attach(engine);
    this.head = { base: { revision: cloud.revision, createdAt: state.createdAt }, open: { at: now, skipTo, afkAfterMs: this.afkAfterMs, locale: "fr", visible: true }, start: state.lastTickAt, steps: 0 };
    this.checkpoints = [];
    this.revision = cloud.revision;
    this.engine = engine;
    engine.perform({ type: "zone", minutes: 60 }, state.lastTickAt);
    engine.tick(now);
  }

  /** A walker's command now, as `GameStore.act` runs it. */
  act(command: Command, now: number): unknown {
    this.engine.tick(now);
    if (this.engine.starved()) return undefined;
    const at = this.engine.state.lastTickAt;
    this.engine.perform({ type: "input" }, at);
    return this.engine.perform(command, at);
  }

  setVisible(visible: boolean, now: number) {
    this.engine.tick(now);
    this.engine.perform({ type: "visible", on: visible }, this.engine.state.lastTickAt);
  }

  /** What a save sends now (see `GameStore.outgoing`). */
  outgoing(now: number) {
    this.engine.tick(now);
    const at = this.engine.state.lastTickAt;
    this.writer.mark(at);
    this.engine.refresh(at);
    this.checkpoints.push({ count: this.writer.entries.length, state: structuredClone(this.engine.state), end: at, steps: this.engine.steps });
    let index = 0;
    for (let next = 1; next < this.checkpoints.length; next += 1) {
      const checkpoint = this.checkpoints[next];
      if (checkpoint.steps - this.head.steps > JOURNAL_MAX_STEPS - 600 || checkpoint.count > JOURNAL_MAX_ENTRIES - 2_000) break;
      index = next;
    }
    this.checkpoints = this.checkpoints.filter((_, position) => position >= index);
    const checkpoint = this.checkpoints[0];
    const { base, open, start } = this.head;
    const journal: Journal = { base, ...(open ? { open } : {}), start, entries: this.writer.entries.slice(0, checkpoint.count), end: checkpoint.end };
    return { checkpoint, journal, more: this.checkpoints.length > 1 };
  }

  /**
   * One save: `lost` drops the request on its way ("request") or the answer on its way back
   * ("answer", the Ledger kept it). Returns the Ledger's answer as the page saw it, or null.
   */
  save(now: number, options: { lost?: "request" | "answer"; replace?: boolean } = {}): (SaveAnswer & { more?: boolean }) | null {
    const outgoing = this.outgoing(now);
    if (options.lost === "request") return null;
    const answer = this.ledger.save({ state: outgoing.checkpoint.state, baseRevision: this.revision, journal: outgoing.journal, replace: options.replace, holder: this.holder, more: outgoing.more });
    if (options.lost === "answer") return null;
    if (answer.status === 200) this.kept(outgoing.checkpoint, answer);
    return { ...answer, more: outgoing.more };
  }

  private kept(checkpoint: Checkpoint, answer: SaveAnswer) {
    const index = this.checkpoints.indexOf(checkpoint);
    this.writer.drop(checkpoint.count, checkpoint.end);
    for (const later of this.checkpoints.slice(index + 1)) later.count -= checkpoint.count;
    this.checkpoints = this.checkpoints.slice(index + 1);
    this.head = { base: { revision: answer.revision!, createdAt: checkpoint.state.createdAt }, start: checkpoint.end, steps: checkpoint.steps };
    this.revision = answer.revision!;
    if (answer.fates) this.takeFates(answer.fates);
    if (answer.replay) {
      this.checkpoints = [];
      const journal: Journal = { base: this.head.base, start: this.writer.start, entries: this.writer.entries, end: this.engine.state.lastTickAt };
      const result = replay(answer.replay.state, answer.replay.runtime, journal, windowFates(this.window));
      if (!("error" in result)) {
        result.engine.steps = this.engine.steps;
        this.writer.attach(result.engine);
        this.engine = result.engine;
      }
    }
  }

  private takeFates(fates: FateWindow) {
    const merged = {} as FateWindow;
    for (const stream of STREAMS) {
      const known = this.window[stream];
      const fresh = fates[stream];
      merged[stream] = known.seeds.length === 0 || fresh.from > known.from + known.seeds.length || fresh.from < known.from
        ? fresh
        : { from: known.from, seeds: known.seeds.slice(0, fresh.from - known.from).concat(fresh.seeds) };
    }
    this.window = merged;
    this.engine.fates = windowFates(merged);
  }
}

/** Plays `ms` at ticks of one step (`every` stretches them, as a throttled tab does). */
export function run(page: Page, from: number, ms: number, every = STEP_MS): number {
  let now = from;
  const end = from + ms;
  while (now < end) {
    now = Math.min(end, now + every);
    page.engine.tick(now);
  }
  return now;
}
