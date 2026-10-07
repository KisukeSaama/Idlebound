import { diffStates, replay, type EngineRuntime, type GameState, type Journal, type PresenceTally } from "@idlebound/game";
import { parseState } from "@idlebound/game/server";
import { secretFates } from "../lib/fates";

/** What the replay is asked: the stored game a journal builds on, and what the page declares. */
export interface ReplayJob {
  base: GameState;
  runtime: EngineRuntime | null;
  journal: Journal;
  secret: string;
  declared: GameState;
}

export interface ReplayVerdict {
  /** "match": the replay lands on the declared game; "diverged": elsewhere; "failed": it could not run. */
  outcome: "match" | "diverged" | "failed";
  error?: string;
  /** Where the declared game differs from the replayed one (paths, at most 20). */
  diff: string[];
  /** The replayed game, as the schema reads it, and the page's rhythms after it. */
  state?: GameState;
  runtime?: EngineRuntime;
  presence?: PresenceTally;
  ignored: number;
  stray: number;
  steps: number;
  /** CPU time of the replay, in ms. */
  ms: number;
}

/** Replays a journal and compares its end with the declared game. Pure CPU: runs in a worker. */
export function checkJournal(job: ReplayJob): ReplayVerdict {
  const started = performance.now();
  const empty = { diff: [], ignored: 0, stray: 0, steps: 0 };
  try {
    const result = replay(job.base, job.runtime, job.journal, secretFates(job.secret));
    if ("error" in result) return { outcome: "failed", error: result.error, ...empty, ms: performance.now() - started };
    // Both sides as the schema reads them: what a save keeps, in the same shape.
    const state = parseState(JSON.parse(JSON.stringify(result.state)));
    const diff = diffStates(state, job.declared);
    return {
      outcome: diff.length === 0 ? "match" : "diverged",
      diff,
      state,
      runtime: result.runtime,
      presence: result.presence,
      ignored: result.ignored,
      stray: result.stray,
      steps: result.steps,
      ms: performance.now() - started
    };
  } catch (error) {
    return { outcome: "failed", error: error instanceof Error ? error.message.slice(0, 200) : "replay", ...empty, ms: performance.now() - started };
  }
}
