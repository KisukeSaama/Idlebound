"use client";

import { migrateState, type GameState } from "@idlebound/game";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { gateMet, type Gate } from "./gates";

/**
 * How the wiki treats what a walker has not lived yet:
 * - `veil`: every revelation waits behind a warning, opened one by one;
 * - `mine`: what the walker's kept game has lived is open, the rest stays veiled;
 * - `all`: everything is open.
 */
export type SpoilerMode = "veil" | "mine" | "all";

/** Where the walker's game stands: not asked yet, being read, kept, or none to read. */
export type GameStatus = "pending" | "loading" | "ready" | "none";

interface SpoilerValue {
  mode: SpoilerMode;
  setMode: (mode: SpoilerMode) => void;
  status: GameStatus;
  /** The walker's kept game, once read. */
  game: GameState | null;
  /** Whether a gated piece shows open under the current mode, or was revealed by hand. */
  open: (gate: Gate | undefined) => boolean;
  /** Reveals by hand every piece behind this gate, until the walker leaves the wiki. */
  reveal: (gate: Gate) => void;
}

/** Two gates that ask the same thing reveal together: a creature's name, picture and title at once. */
const gateKey = (gate: Gate) => JSON.stringify(gate);

/** The chosen mode is a reading convenience of this browser, never game state. */
const STORAGE_KEY = "ib_wiki_spoilers";
const MODES: readonly SpoilerMode[] = ["veil", "mine", "all"];

function storedMode(): SpoilerMode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return MODES.find((mode) => mode === value) ?? null;
  } catch {
    return null;
  }
}

function storeMode(mode: SpoilerMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Private browsing or blocked storage: the choice lasts the page.
  }
}

/** The account's game, or else the one this browser keeps as a guest's; null when there is none. */
async function readGame(): Promise<GameState | null> {
  const me = await api.me();
  if (!me.ok) return null;
  const guest = me.data.user === null;
  if (guest && !me.data.guest) return null;
  const save = await api.getSave(guest);
  if (!save.ok || !save.data.save) return null;
  try {
    return migrateState(save.data.save.state) as GameState;
  } catch {
    return null;
  }
}

const SpoilerContext = createContext<SpoilerValue | null>(null);

/**
 * Holds the reading mode for every wiki page. The server renders every gated piece veiled,
 * so nothing is revealed before the browser knows the walker's choice and game.
 */
export function SpoilerProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SpoilerMode>("veil");
  const [status, setStatus] = useState<GameStatus>("pending");
  const [game, setGame] = useState<GameState | null>(null);
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    let alive = true;
    const chosen = storedMode();
    if (chosen) setModeState(chosen);
    setStatus("loading");
    void readGame().then((kept) => {
      if (!alive) return;
      setGame(kept);
      setStatus(kept ? "ready" : "none");
      // A walker who never chose reads the wiki as far as their own game; without one, veiled.
      if (!chosen) setModeState(kept ? "mine" : "veil");
      else if (chosen === "mine" && !kept) setModeState("veil");
    });
    return () => {
      alive = false;
    };
  }, []);

  const setMode = useCallback((next: SpoilerMode) => {
    setModeState(next);
    storeMode(next);
  }, []);

  const open = useCallback(
    (gate: Gate | undefined) => {
      if (!gate || mode === "all" || revealed.has(gateKey(gate))) return true;
      if (mode === "mine") return game !== null && gateMet(game, gate);
      return false;
    },
    [mode, game, revealed]
  );

  const reveal = useCallback((gate: Gate) => setRevealed((before) => new Set(before).add(gateKey(gate))), []);

  const value = useMemo(() => ({ mode, setMode, status, game, open, reveal }), [mode, setMode, status, game, open, reveal]);
  return <SpoilerContext.Provider value={value}>{children}</SpoilerContext.Provider>;
}

export function useSpoilers(): SpoilerValue {
  const value = useContext(SpoilerContext);
  if (!value) throw new Error("useSpoilers outside SpoilerProvider");
  return value;
}
