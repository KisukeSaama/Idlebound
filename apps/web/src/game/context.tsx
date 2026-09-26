"use client";

import { formatNumber } from "@idlebound/game";
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { currentMessages } from "@/i18n/client";
import type { CloudSync } from "./cloud";
import type { PictoName } from "./icons";
import type { GameStore } from "./store";

export type WindowId = "map" | "gear" | "inventory" | "market" | "ascension" | "hall" | "account" | "settings";

export interface ToastInput {
  tone: "gold" | "violet" | "loot" | "danger" | "info" | "success";
  title: string;
  text?: string;
  icon?: PictoName;
  color?: string;
}

export interface GameUi {
  openWindow: (id: WindowId, tab?: string) => void;
  closeWindow: () => void;
  toast: (toast: ToastInput) => void;
  confirm: (options: { title: string; text: string; confirmLabel: string; danger?: boolean }) => Promise<boolean>;
}

interface GameContextValue {
  store: GameStore;
  cloud: CloudSync;
  ui: GameUi;
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
