import { availableParallelism } from "node:os";
import { Worker } from "node:worker_threads";
import { env } from "../env";
import { checkJournal, type ReplayJob, type ReplayVerdict } from "./check";

/**
 * Replays run off the request loop, in a few worker threads: a long journal never holds the
 * API. A replay that runs past `REPLAY_TIMEOUT_MS` is stopped (its worker replaced) and counts
 * as failed. Run from the sources (development, tests), replays run inline.
 */
const REPLAY_TIMEOUT_MS = 5_000;

interface Pending {
  id: number;
  job: ReplayJob;
  resolve: (verdict: ReplayVerdict) => void;
}

interface Slot {
  worker: Worker;
  busy: Pending | null;
  timer: ReturnType<typeof setTimeout> | null;
}

const inline = import.meta.url.endsWith(".ts") || env.REPLAY_WORKERS === 0;
const size = env.REPLAY_WORKERS ?? Math.max(1, Math.min(4, availableParallelism() - 1));
const slots: Slot[] = [];
const queue: Pending[] = [];
let nextId = 1;

function spawn(): Slot {
  const worker = new Worker(new URL("./replay-worker.js", import.meta.url));
  worker.unref();
  const slot: Slot = { worker, busy: null, timer: null };
  worker.on("message", (message: { id: number; verdict: ReplayVerdict }) => {
    if (!slot.busy || slot.busy.id !== message.id) return;
    finish(slot, message.verdict);
  });
  worker.on("error", (error) => {
    console.error("[api] replay worker", error);
    replace(slot, "worker");
  });
  return slot;
}

function finish(slot: Slot, verdict: ReplayVerdict) {
  if (slot.timer) clearTimeout(slot.timer);
  slot.timer = null;
  const done = slot.busy;
  slot.busy = null;
  done?.resolve(verdict);
  pump();
}

function replace(slot: Slot, error: string) {
  const done = slot.busy;
  if (slot.timer) clearTimeout(slot.timer);
  void slot.worker.terminate();
  const index = slots.indexOf(slot);
  if (index !== -1) slots[index] = spawn();
  done?.resolve({ outcome: "failed", error, diff: [], ignored: 0, stray: 0, steps: 0, ms: REPLAY_TIMEOUT_MS });
  pump();
}

function pump() {
  for (const slot of slots) {
    if (slot.busy) continue;
    const next = queue.shift();
    if (!next) return;
    slot.busy = next;
    slot.timer = setTimeout(() => replace(slot, "timeout"), REPLAY_TIMEOUT_MS);
    slot.worker.postMessage({ id: next.id, job: next.job });
  }
}

/** Replays `job` and compares it with the declared game. */
export function runReplay(job: ReplayJob): Promise<ReplayVerdict> {
  if (inline) return Promise.resolve(checkJournal(job));
  if (slots.length === 0) for (let index = 0; index < size; index += 1) slots.push(spawn());
  return new Promise((resolve) => {
    queue.push({ id: nextId++, job, resolve });
    pump();
  });
}
