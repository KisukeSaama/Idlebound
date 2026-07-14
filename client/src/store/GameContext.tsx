import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { COMBAT_TICK_MS } from "../../../shared/constants/balance";
import type { GameState } from "../../../shared/types/game";
import { estimateOfflineProgress } from "../../../shared/game/offline";
import { gameReducer, type GameAction } from "./gameReducer";
import { createInitialState } from "./initialState";
import { loadGameState, saveGameState } from "../features/save/saveService";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGameState() ?? createInitialState());

  useEffect(() => {
    const summary = estimateOfflineProgress(state);
    if (summary && summary.estimatedVictories > 0) {
      dispatch({ type: "applyOffline", summary });
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch({ type: "tick", deltaSeconds: COMBAT_TICK_MS / 1000 });
    }, COMBAT_TICK_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      saveGameState(state);
      dispatch({ type: "markSaved" });
    }, 5000);

    const persist = () => saveGameState(state);
    window.addEventListener("beforeunload", persist);
    document.addEventListener("visibilitychange", persist);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", persist);
      document.removeEventListener("visibilitychange", persist);
    };
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
