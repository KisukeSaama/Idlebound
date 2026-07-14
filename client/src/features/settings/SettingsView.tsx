import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function SettingsView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title="Paramètres">
      <label className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3">
        <input type="checkbox" checked={state.settings.autoContinue} onChange={() => dispatch({ type: "toggleSetting", key: "autoContinue" })} />
        Combat automatique continu
      </label>
      <label className="mt-3 flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3">
        <input type="checkbox" checked={state.settings.reducedMotion} onChange={() => dispatch({ type: "toggleSetting", key: "reducedMotion" })} />
        Reduire les animations
      </label>
    </Panel>
  );
}
