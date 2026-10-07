/**
 * Runs the independent games of a balance script, six at a time and at a low priority, so the
 * machine stays usable while they play (`BALANCE_WORKERS` sets another count). The script forks itself: in
 * a child (`IB_JOB` set), `workerJob` plays the one job it is given and sends the result back;
 * in the parent, `pool` hands out the jobs and returns the results in the jobs' order. Each
 * job is deterministic (its own seed), so the results do not depend on the number of cores.
 * With `SIM_RESULTS` set to a file, the jobs and their results are kept there too, for
 * `compare.ts` to set two versions of the game side by side, seed by seed. With `SIM_PLACES`
 * set to a folder, every script playing at once shares the same places (`suite.ts`).
 */
import { fork } from "node:child_process";
import { existsSync, openSync, closeSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { availableParallelism, constants, setPriority } from "node:os";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";

/**
 * Games played at once unless `BALANCE_WORKERS` says otherwise: on the 8 cores this is tuned
 * on, six play 27% more games than four, more than six barely add, and two cores stay free.
 */
const DEFAULT_WORKERS = 6;

/** Games played at once, by this script or by all those sharing `SIM_PLACES`. */
export function workers(): number {
  return Math.min(Number(process.env.BALANCE_WORKERS) || DEFAULT_WORKERS, availableParallelism());
}

/** In a child process: plays the job and exits. Returns true there, false in the parent. */
export function workerJob<J, R>(run: (job: J) => R): boolean {
  const raw = process.env.IB_JOB;
  if (raw === undefined) return false;
  const result = run(JSON.parse(raw) as J);
  process.send!(result, () => process.exit(0));
  return true;
}

/** One call of `pool`, as `SIM_RESULTS` keeps it (`script`: which one, in a suite). */
export interface PoolRun {
  script?: string;
  jobs: unknown[];
  results: unknown[];
}

/** Adds a finished call of `pool` to the `SIM_RESULTS` file, after those of this script before it. */
function keep(jobs: unknown[], results: unknown[]) {
  const path = process.env.SIM_RESULTS;
  if (!path) return;
  const runs = existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as PoolRun[]) : [];
  runs.push({ jobs, results });
  writeFileSync(path, JSON.stringify(runs));
}

/**
 * A place to play one game: free at once alone, or one of the `SIM_PLACES` files shared with
 * the other scripts of a suite (taken by creating it, given back by removing it).
 */
async function takePlace(): Promise<() => void> {
  const folder = process.env.SIM_PLACES;
  if (!folder) return () => {};
  for (;;) {
    for (let place = 0; place < workers(); place += 1) {
      const path = join(folder, `place-${place}`);
      try {
        closeSync(openSync(path, "wx"));
        return () => rmSync(path, { force: true });
      } catch {
        // Taken: try the next one.
      }
    }
    await wait(50);
  }
}

/** Plays one job in a fork of `script`, at a low priority; resolves with its result. */
function playJob<R>(script: string, job: unknown, index: number): Promise<R> {
  return new Promise((resolve, reject) => {
    const child = fork(script, process.argv.slice(2), { env: { ...process.env, IB_JOB: JSON.stringify(job) } });
    // Below normal: whatever else runs on the machine goes first.
    try {
      if (child.pid !== undefined) setPriority(child.pid, constants.priority.PRIORITY_BELOW_NORMAL);
    } catch {
      // Not allowed here: the game plays at the usual priority.
    }
    let result: R;
    child.once("message", (message) => {
      result = message as R;
    });
    child.once("error", reject);
    child.once("exit", (code) => (code === 0 ? resolve(result) : reject(new Error(`Job ${index} failed (exit ${code}).`))));
  });
}

/** Plays `jobs` in forks of `script` (the calling file), `workers()` at a time. */
export async function pool<J, R>(script: string, jobs: J[]): Promise<R[]> {
  const results: R[] = new Array(jobs.length);
  let next = 0;
  const lane = async () => {
    while (next < jobs.length) {
      const index = next;
      next += 1;
      const release = await takePlace();
      try {
        results[index] = await playJob<R>(script, jobs[index], index);
      } finally {
        release();
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(workers(), jobs.length) }, lane));
  keep(jobs, results);
  return results;
}
