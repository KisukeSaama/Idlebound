"use client";

import { GameEngine, createInitialState, type GameEvent, type GameState, type Locale } from "@idlebound/game";

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


/**
 * Bridge between the engine (mutable, outside React) and the UI.
 * - the simulation advances every 50 ms;
 * - React is notified at most every 100 ms (or on the next frame after an action other
 *   than an attack);
 * - events (damage, loot…) go to visual and sound effects without re-rendering.
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

  constructor(state: GameState = createInitialState()) {
    this.engine = this.createEngine(state);
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

  private step() {
    const summary = this.engine.tick(Date.now());
    this.flushEvents();
    this.notify(summary !== null);
  }

  /** Runs a player action on the engine. */
  act<T>(action: (engine: GameEngine, now: number) => T, options: ActOptions = {}): T {
    const now = Date.now();
    this.engine.markInput(now);
    const result = action(this.engine, now);
    this.flushEvents();
    // Routine actions (attack taps) keep the throttled cadence: the canvas already answers
    // the tap at once, and tapping fast would otherwise re-render the page every frame.
    const routine = options.save === false;
    this.notify(!routine);
    if (!routine) for (const listener of this.actionListeners) listener();
    return result;
  }

  /**
   * Runs something on the engine that is not a player action (a date check, a notice):
   * no input is marked (the autopilot keeps its own clock) and no early save is asked.
   */
  apply<T>(action: (engine: GameEngine, now: number) => T): T {
    const result = action(this.engine, Date.now());
    this.flushEvents();
    this.notify(true);
    return result;
  }

  /**
   * Replaces the whole game (server save, new game, logout). `awayMs` of the time since the
   * save was written are caught up at once (the company walked on while the game was
   * closed, within the catch-up cap); the rest is skipped.
   */
  replaceState(state: GameState, { awayMs = 0 }: { awayMs?: number } = {}) {
    state.lastTickAt = Math.max(state.lastTickAt, Date.now() - Math.max(0, awayMs));
    const visible = this.engine.visible;
    this.engine = this.createEngine(state);
    this.engine.visible = visible;
    this.step();
    this.publish();
  }

  /** Any input on the page (a click, a key, opening a window) means the player is here. */
  markInput() {
    this.engine.markInput(Date.now());
  }

  private createEngine(state: GameState) {
    const engine = new GameEngine(state);
    engine.afkAfterMs = AFK_AFTER_MS;
    engine.locale = this.locale;
    engine.markInput(Date.now());
    return engine;
  }

  /** The tab is watched again (or not): coming back after a long absence leaves one line. */
  setVisible(visible: boolean) {
    this.engine.setVisible(visible, Date.now());
    this.flushEvents();
    this.notify(true);
  }

  setLocale(locale: Locale) {
    this.locale = locale;
    this.engine.locale = locale;
  }
}
