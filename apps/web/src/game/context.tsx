"use client";

import { formatNumber, type CutsceneId } from "@idlebound/game";
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { currentMessages } from "@/i18n/client";
import type { CloudSync } from "./cloud";
import type { PictoName } from "./icons";
import { reveals, type RevealId, type Reveals } from "./shell";
import type { GameStore } from "./store";

export type WindowId = "map" | "gear" | "inventory" | "market" | "ascension" | "hall" | "account" | "settings";

export interface ToastInput {
  tone: "gold" | "violet" | "loot" | "danger" | "info" | "success";
  title: string;
  text?: string;
  /** A line spoken by someone, set apart under the text (the King's Word). */
  quote?: { by: string; text: string };
  icon?: PictoName;
  color?: string;
}

export interface GameUi {
  openWindow: (id: WindowId, tab?: string) => void;
  closeWindow: () => void;
  toast: (toast: ToastInput) => void;
  /** Plays one of the Ledger's scenes over everything. */
  playCutscene: (id: CutsceneId) => void;
  confirm: (options: { title: string; text: string; confirmLabel: string; danger?: boolean }) => Promise<boolean>;
}

interface GameContextValue {
  store: GameStore;
  cloud: CloudSync;
  ui: GameUi;
  /** Elements of the shell that appeared during this session's play (they glow a moment). */
  fresh: ReadonlySet<RevealId>;
}

export const GameContext = createContext<GameContextValue | null>(null);

function useGameContext() {
  const context = useContext(GameContext);
  if (!context) throw new Error(currentMessages().hud.errors.contextMissing);
  return context;
}

/** Game state; the component re-renders on every store publish (≤ 10 times/s). */
export function useGame() {
  const { store } = useGameContext();
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);
  return { store, state: store.state, derived: store.derived };
}

export function useCloud() {
  const { cloud } = useGameContext();
  useSyncExternalStore(cloud.subscribe, cloud.getVersion, cloud.getVersion);
  return cloud;
}

/**
 * Which elements of the shell the walker has earned (the progressive interface), and which
 * of them just appeared.
 */
export function useReveals() {
  const { store, fresh } = useGameContext();
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);
  const shown = revealsOf(store);
  return { shown, freshClass: (id: RevealId) => (fresh.has(id) ? " is-fresh" : "") };
}

/** What the shell shows, computed once per store publish. */
export function revealsOf(store: GameStore): Reveals {
  return perPublish(store, "reveals", () => reveals(store.state));
}

const published = new WeakMap<GameStore, { version: number; values: Map<string, unknown> }>();

/**
 * A value read from the state, computed once per store publish however many components
 * (and listeners) ask for it: `key` names it among the others.
 */
export function perPublish<T>(store: GameStore, key: string, compute: () => T): T {
  const version = store.getVersion();
  let entry = published.get(store);
  if (!entry || entry.version !== version) published.set(store, (entry = { version, values: new Map() }));
  if (entry.values.has(key)) return entry.values.get(key) as T;
  const value = compute();
  entry.values.set(key, value);
  return value;
}

export function useUi() {
  return useGameContext().ui;
}

export function useStoreRef() {
  return useGameContext().store;
}

export function useFormat() {
  const { store } = useGameContext();
  const notation = store.state.settings.notation;
  return useCallback((value: number) => formatNumber(value, notation), [notation]);
}
