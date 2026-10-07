import { parentPort } from "node:worker_threads";
import { checkJournal, type ReplayJob } from "./check";

/** A replay worker: one job at a time, answered by its id. */
parentPort?.on("message", (message: { id: number; job: ReplayJob }) => {
  parentPort?.postMessage({ id: message.id, verdict: checkJournal(message.job) });
});
