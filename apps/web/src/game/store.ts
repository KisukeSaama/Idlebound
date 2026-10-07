"use client";

import {
  GameEngine,
  JOURNAL_MAX_ENTRIES,
  JOURNAL_MAX_STEPS,
  JournalWriter,
  STREAMS,
  createInitialState,
  replay,
  windowFates,
  type Command,
  type EngineRuntime,
  type FateWindow,
  type GameEvent,
  type GameState,
  type Journal,
  type JournalBase,
  type JournalOpen,
  type Locale
} from "@idlebound/game";
import { gameNow } from "@/lib/clock";

type Listener = () => void;
export type FxListener = (event: GameEvent) => void;
export interface ActOptions {
  /** False for routine, high-frequency actions (attack clicks): no early save, no immediate render. */
  save?: boolean;
}

const TICK_MS = 50;
const RENDER_MS = 100;
/** Without any action or input for this long, the player is away and the autopilot plays. */
const AFK_AFTER_MS = 60_000;
/** A journal the page sends stays under these, with room: the server refuses longer ones. */
const SEGMENT_STEPS = JOURNAL_MAX_STEPS - 600;
const SEGMENT_ENTRIES = JOURNAL_MAX_ENTRIES - 2_000;

/** A save the page tried to send: the game as it stood, and how much of the journal led there. */
export interface Checkpoint {
  /** Entries of the journal up to here (the last one is its "@mark"). */
  count: number;
  state: GameState;
  /** Its last step. */
  end: number;
  /** The engine's step count there. */
  steps: number;
}

/** What leaves for the server: a save, and the journal from the last kept save to it. */
export interface Outgoing {
  checkpoint: Checkpoint;
  journal: Journal;
  /** More of the journal waits after this one (it was too long for one save). */
  more: boolean;
}

/** An empty window: nothing can be drawn, the game waits until the Ledger hands out its fates. */
function noWindow(): FateWindow {
  return Object.fromEntries(STREAMS.map((stream) => [stream, { from: 0, seeds: [] }])) as unknown as FateWindow;
}

/** The walker's time zone, in minutes ahead of UTC. */
function localZone(): number {
  // Never -0 (UTC): the journal and the save write it as 0.
  return -new Date().getTimezoneOffset() || 0;
}

/**
 * Bridge between the engine (mutable, outside React) and the UI.
 * - the page ticks every 50 ms, the simulation advances in steps of 100 ms (`STEP_MS`);
 * - React is notified at most every 100 ms (or on the next frame after an action other
 *   than an attack);
 * - events (damage, loot…) go to visual and sound effects without re-rendering;
 * - everything the walker does goes through a named command, written in the journal the
 *   next save carries (see `replay.ts` in the game): the server replays it.
 */
export class GameStore {
  engine: GameEngine;
  private listeners = new Set<Listener>();
  private fxListeners = new Set<FxListener>();
  private actionListeners = new Set<Listener>();
  private version = 0;
  private frameRequested = false;
  private lastRender = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private dirty = false;
  /** The language the walker reads in, carried over to every new engine (Two Tongues). */
  private locale: Locale = "fr";
  /** The fates the server handed out for this game (see `fates.ts` in the game). */
  private window: FateWindow = noWindow();
  /** The journal since the last save the server kept, and where it begins. */
  private writer = new JournalWriter(0);
  private head: { base: JournalBase; open?: JournalOpen; start: number; steps: number } = { base: { revision: null, createdAt: 0 }, start: 0, steps: 0 };
  /** Saves sent since the last one kept, oldest first. */
  private checkpoints: Checkpoint[] = [];

  constructor(state: GameState = createInitialState(gameNow())) {
    this.engine = this.open(state, { revision: null, createdAt: state.createdAt }, noWindow(), 0);
  }

  get state() {
    return this.engine.state;
  }

  get derived() {
    return this.engine.derived;
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = () => this.version;

  onFx(listener: FxListener): () => void {
    this.fxListeners.add(listener);
    return () => {
      this.fxListeners.delete(listener);
    };
  }

  /** Called after each player action that changed something worth saving. */
  onAction(listener: Listener): () => void {
    this.actionListeners.add(listener);
    return () => {
      this.actionListeners.delete(listener);
    };
  }

  private publish() {
    this.version += 1;
    this.lastRender = performance.now();
    this.dirty = false;
    for (const listener of this.listeners) listener();
  }

  /** Notifies React: immediately (player action) or throttled (tick). */
  notify(urgent = false) {
    this.dirty = true;
    if (!urgent && performance.now() - this.lastRender < RENDER_MS) return;
    if (this.frameRequested) return;
    this.frameRequested = true;
    requestAnimationFrame(() => {
      this.frameRequested = false;
      if (this.dirty) this.publish();
    });
  }

  private flushEvents() {
    const events = this.engine.drainEvents();
    for (const event of events) for (const listener of this.fxListeners) listener(event);
  }

  start() {
    if (this.timer) return;
    this.step();
    this.timer = setInterval(() => this.step(), TICK_MS);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private step(now = gameNow()) {
    const summary = this.engine.tick(now);
    this.flushEvents();
    this.notify(summary !== null);
  }

  /**
   * Brings the game up to the clock, outside the loop. A page waking from a freeze (a sleeping
   * device, a suspended tab) may run other timers before the loop's: what leaves for the
   * server is caught up first.
   */
  advance() {
    this.step();
  }

  /** Out of fates: the road waits for the Ledger's next window (nothing is lived meanwhile). */
  get waiting(): boolean {
    return this.engine.starved();
  }

  /**
   * Runs a walker's command at the time of the last step, after the steps up to now. Nothing
   * runs while the road waits for the Ledger.
   */
  private perform(command: Command, input: boolean): unknown {
    this.engine.tick(gameNow());
    if (this.engine.starved()) return undefined;
    const at = this.engine.state.lastTickAt;
    if (input) this.engine.perform({ type: "input" }, at);
    return this.engine.perform(command, at);
  }

  /** Runs a player action on the engine. */
  act<T = unknown>(command: Command, options: ActOptions = {}): T {
    const result = this.perform(command, true);
    this.flushEvents();
    // Routine actions (attack taps) keep the throttled cadence: the canvas already answers
    // the tap at once, and tapping fast would otherwise re-render the page every frame.
    const routine = options.save === false;
    this.notify(!routine);
    if (!routine) for (const listener of this.actionListeners) listener();
    return result as T;
  }

  /**
   * Runs a command that is not a player action (a date check, a notice): no input is marked
   * (the autopilot keeps its own clock) and no early save is asked.
   */
  apply<T = unknown>(command: Command): T {
    const result = this.perform(command, false);
    this.flushEvents();
    this.notify(true);
    return result as T;
  }

  /**
   * Replaces the whole game (server save, new game, logout). `awayMs` of the time since the
   * save was written are caught up at once (the company walked on while the game was
   * closed, within the catch-up cap); the rest is skipped. `base` is the stored game it is
   * (a revision), or a new game; `fates` the window the server handed out with it.
   */
  replaceState(state: GameState, { awayMs = 0, base, fates }: { awayMs?: number; base: JournalBase; fates: FateWindow | null }) {
    // One clock read: a millisecond between two reads would be caught up past `awayMs`.
    const now = gameNow();
    this.engine = this.open(state, base, fates ?? noWindow(), now - Math.max(0, awayMs), now);
    this.step(now);
    this.publish();
  }

  /** A new engine on `state`, made as the server will make it again from the journal's opening. */
  private open(state: GameState, base: JournalBase, fates: FateWindow, skipTo: number, now = gameNow()): GameEngine {
    // The constructor opens the first engine: none stands before it.
    const visible = (this.engine as GameEngine | undefined)?.visible ?? true;
    state.lastTickAt = Math.max(state.lastTickAt, skipTo);
    this.window = fates;
    const engine = new GameEngine(state, windowFates(fates), now);
    engine.afkAfterMs = AFK_AFTER_MS;
    engine.locale = this.locale;
    engine.visible = visible;
    engine.markInput(now);
    this.writer = new JournalWriter(state.lastTickAt);
    this.writer.attach(engine);
    this.head = { base, open: { at: now, skipTo, afkAfterMs: AFK_AFTER_MS, locale: this.locale, visible }, start: state.lastTickAt, steps: 0 };
    this.checkpoints = [];
    // The walker's calendar, for the dead of night and the Remembrance Nights.
    const zone = localZone();
    if (state.zone !== zone) engine.perform({ type: "zone", minutes: zone }, state.lastTickAt);
    return engine;
  }

  /** Any input on the page (a click, a key, opening a window) means the player is here. */
  markInput() {
    this.perform({ type: "input" }, false);
  }

  /** The tab is watched again (or not): coming back after a long absence leaves one line. */
  setVisible(visible: boolean) {
    this.engine.tick(gameNow());
    this.engine.perform({ type: "visible", on: visible }, this.engine.state.lastTickAt);
    this.flushEvents();
    this.notify(true);
  }

  setLocale(locale: Locale) {
    this.locale = locale;
    if (this.engine.locale !== locale) this.engine.perform({ type: "locale", locale }, this.engine.state.lastTickAt);
  }

  /**
   * A save leaves from here: the game caught up, a mark in the journal, and what to send,
   * which is the journal since the last save the server kept, cut to the longest stretch the
   * server takes at once (the rest goes with the next saves).
   */
  outgoing(): Outgoing {
    this.step();
    const at = this.engine.state.lastTickAt;
    this.writer.mark(at);
    this.engine.refresh(at);
    this.checkpoints.push({ count: this.writer.entries.length, state: structuredClone(this.engine.state), end: at, steps: this.engine.steps });
    // The longest stretch that fits, and never more than one save per stretch of the journal.
    let index = 0;
    for (let next = 1; next < this.checkpoints.length; next += 1) {
      const checkpoint = this.checkpoints[next];
      if (checkpoint.steps - this.head.steps > SEGMENT_STEPS || checkpoint.count > SEGMENT_ENTRIES) break;
      index = next;
    }
    // Checkpoints between two kept ones are not needed once a later one fits.
    this.checkpoints = this.checkpoints.filter((_, position) => position >= index);
    const checkpoint = this.checkpoints[0];
    const { base, open, start } = this.head;
    const journal: Journal = { base, ...(open ? { open } : {}), start, entries: this.writer.entries.slice(0, checkpoint.count), end: checkpoint.end };
    return { checkpoint, journal, more: this.checkpoints.length > 1 };
  }

  /**
   * The server kept the save at `checkpoint` as `revision`: the journal goes on from there,
   * with the fates it handed out for what follows.
   */
  kept(checkpoint: Checkpoint, revision: number, guest: boolean, fates: FateWindow | null) {
    const index = this.checkpoints.indexOf(checkpoint);
    if (index === -1) return;
    this.writer.drop(checkpoint.count, checkpoint.end);
    for (const later of this.checkpoints.slice(index + 1)) later.count -= checkpoint.count;
    this.checkpoints = this.checkpoints.slice(index + 1);
    this.head = { base: { revision, createdAt: checkpoint.state.createdAt, ...(guest ? { guest: true } : {}) }, start: checkpoint.end, steps: checkpoint.steps };
    if (fates) this.takeFates(fates);
  }

  /** More fates from the Ledger: the window grows, what the page already knew stays. */
  takeFates(fates: FateWindow) {
    const merged = {} as FateWindow;
    for (const stream of STREAMS) {
      const known = this.window[stream];
      const fresh = fates[stream];
      if (!known || known.seeds.length === 0 || fresh.from > known.from + known.seeds.length || fresh.from < known.from) {
        merged[stream] = fresh;
        continue;
      }
      const seeds = known.seeds.slice(0, fresh.from - known.from).concat(fresh.seeds);
      merged[stream] = { from: known.from, seeds };
    }
    this.window = merged;
    this.engine.fates = windowFates(merged);
  }

  /**
   * The server kept the game it replayed rather than the one sent (a difference it found):
   * the game goes on from there, with what the walker did since replayed on top of it.
   */
  correct(state: GameState, runtime: EngineRuntime) {
    // Saves sent since were built on the other game: the next one carries the whole journal.
    this.checkpoints = [];
    const journal: Journal = { base: this.head.base, start: this.writer.start, entries: this.writer.entries, end: this.engine.state.lastTickAt };
    const result = replay(state, runtime, journal, windowFates(this.window));
    if ("error" in result) return;
    const engine = result.engine;
    engine.steps = this.engine.steps;
    this.writer.attach(engine);
    this.engine = engine;
    this.publish();
  }
}
