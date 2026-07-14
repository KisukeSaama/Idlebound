import { useRef, useState } from "react";
import { exportSave, importSave, resetSave, saveGameState } from "./saveService";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function SaveView() {
  const { state, dispatch } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  function downloadSave() {
    const blob = new Blob([exportSave(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `idlebound-save-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Sauvegarde exportée.");
  }

  async function importFile(file?: File) {
    if (!file) return;
    try {
      const imported = importSave(await file.text());
      dispatch({ type: "loadState", state: imported });
      setMessage("Sauvegarde importée.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import impossible.");
    }
  }

  return (
    <Panel title="Sauvegarde">
      {state.offlineSummary ? (
        <div className="mb-4 rounded-md border border-arcane/50 bg-arcane/10 p-3 text-sm">
          Progression hors ligne : {state.offlineSummary.estimatedVictories} victoire(s), {state.offlineSummary.rewards.gold} or, {state.offlineSummary.rewards.experience} XP.
          <button className="ml-3 underline" onClick={() => dispatch({ type: "clearOfflineSummary" })}>Masquer</button>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button className="rounded-md bg-arcane px-4 py-2 font-semibold text-slate-950" onClick={() => { saveGameState(state); setMessage("Sauvegarde manuelle effectuée."); }}>
          Sauvegarder
        </button>
        <button className="rounded-md border border-slate-700 px-4 py-2" onClick={downloadSave}>
          Exporter JSON
        </button>
        <button className="rounded-md border border-slate-700 px-4 py-2" onClick={() => inputRef.current?.click()}>
          Importer
        </button>
        <button className="rounded-md border border-red-800 px-4 py-2 text-red-200" onClick={() => { resetSave(); dispatch({ type: "reset" }); setMessage("Partie réinitialisée."); }}>
          Réinitialiser
        </button>
      </div>
      <input ref={inputRef} className="hidden" type="file" accept="application/json,.json,.txt" onChange={(event) => importFile(event.target.files?.[0])} />
      <div className="mt-4 text-sm text-slate-400">Dernière sauvegarde : {state.lastSavedAt ?? "pas encore"}</div>
      {message ? <div className="mt-3 text-sm text-arcane">{message}</div> : null}
    </Panel>
  );
}
