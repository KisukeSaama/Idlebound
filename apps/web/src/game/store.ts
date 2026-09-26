"use client";

import { GameEngine, createInitialState, type GameEvent, type GameState, type OfflineSummary } from "@idlebound/game";

type Listener = () => void;
export type FxListener = (event: GameEvent) => void;
export interface ActOptions {
  /** False for routine, high-frequency actions (attack clicks) that need no early save. */
  save?: boolean;
}

const TICK_MS = 50;
const RENDER_MS = 100;

/**
 * Bridge between the engine (mutable, outside React) and the UI.
 * - the simulation advances every 50 ms;
 * - React is notified at most every 100 ms (or on the next frame after an action);
 * - events (damage, loot…) go to visual and sound effects without re-rendering.
 */
export class GameStore {
  engine: GameEngine;
  offlineSummary: OfflineSummary | null = null;
  private listeners = new Set<Listener>();
  private fxListeners = new Set<FxListener>();
  private actionListeners = new Set<Listener>();
  private version = 0;
  private frameRequested = false;
  private lastRender = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private dirty = false;

  constructor(state: GameState = createInitialState()) {
    this.engine = new GameEngine(state);
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
    if (summary && summary.seconds >= 60) this.offlineSummary = summary;
    this.flushEvents();
    this.notify(summary !== null);
  }

  /** Runs a player action on the engine. */
  act<T>(action: (engine: GameEngine, now: number) => T, options: ActOptions = {}): T {
    const result = action(this.engine, Date.now());
    this.flushEvents();
    this.notify(true);
    if (options.save !== false) for (const listener of this.actionListeners) listener();
    return result;
  }

  /** Replaces the whole game (server save, new game, logout). */
  replaceState(state: GameState) {
    this.engine = new GameEngine(state);
    this.offlineSummary = null;
    this.step();
    this.publish();
  }

  dismissOffline() {
    this.offlineSummary = null;
    this.publish();
  }

  setVisible(visible: boolean) {
    this.engine.visible = visible;
  }
}
