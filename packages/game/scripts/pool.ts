/**
 * Runs the independent games of a balance script, four at a time and at a low priority, so the
 * machine stays usable while they play (`BALANCE_WORKERS` sets another count). The script forks itself: in
 * a child (`IB_JOB` set), `workerJob` plays the one job it is given and sends the result back;
 * in the parent, `pool` hands out the jobs and returns the results in the jobs' order. Each
 * job is deterministic (its own seed), so the results do not depend on the number of cores.
 */
import { fork } from "node:child_process";
import { availableParallelism, constants, setPriority } from "node:os";

/** Games played at once unless `BALANCE_WORKERS` says otherwise. */
const DEFAULT_WORKERS = 4;

/** In a child process: plays the job and exits. Returns true there, false in the parent. */
export function workerJob<J, R>(run: (job: J) => R): boolean {
  const raw = process.env.IB_JOB;
  if (raw === undefined) return false;
  const result = run(JSON.parse(raw) as J);
  process.send!(result, () => process.exit(0));
  return true;
}

/** Plays `jobs` in forks of `script` (the calling file), at most one per core. */
export function pool<J, R>(script: string, jobs: J[]): Promise<R[]> {
  const results: R[] = new Array(jobs.length);
  let next = 0;
  let done = 0;
  return new Promise((resolve, reject) => {
    if (jobs.length === 0) return resolve(results);
    const launch = () => {
      const index = next;
      next += 1;
      const child = fork(script, process.argv.slice(2), { env: { ...process.env, IB_JOB: JSON.stringify(jobs[index]) } });
      // Below normal: whatever else runs on the machine goes first.
      try {
        if (child.pid !== undefined) setPriority(child.pid, constants.priority.PRIORITY_BELOW_NORMAL);
      } catch {
        // Not allowed here: the game plays at the usual priority.
      }
      child.once("message", (message) => {
        results[index] = message as R;
      });
      child.once("error", reject);
      child.once("exit", (code) => {
        if (code !== 0) return reject(new Error(`Job ${index} failed (exit ${code}).`));
        done += 1;
        if (done === jobs.length) resolve(results);
        else if (next < jobs.length) launch();
      });
    };
    const workers = Math.min(Number(process.env.BALANCE_WORKERS) || DEFAULT_WORKERS, availableParallelism());
    for (let slot = 0; slot < Math.min(workers, jobs.length); slot += 1) launch();
  });
}
