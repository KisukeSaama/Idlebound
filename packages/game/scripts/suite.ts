/**
 * Every balance check of AGENTS.md in one go: the scripts play at once and share the same
 * places (`BALANCE_WORKERS`, six by default), so no core waits for the last seeds of one
 * script while another has games to play.
 *
 *   npm run sims -- [seeds=9] [deep]
 *
 * Plays `milestones`, `simulate 24 compare` and `walls` with `seeds` seeds (3 while
 * iterating, 9 for the final word), and with `deep` the deep road too (`deep deep active 3000
 * <seeds> 20`, from the states `deep.ts reach` keeps). Prints each script's output in that
 * order, with the time it took. Under `compare.ts` (`npm run compare -- suite 3`), every
 * script's results are kept and set against the reference seed by seed.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { workers, type PoolRun } from "./pool";

const here = dirname(fileURLToPath(import.meta.url));
const seeds = process.argv[2] && /^\d+$/.test(process.argv[2]) ? process.argv[2] : "9";
const deep = process.argv.includes("deep");

const SCRIPTS: { name: string; args: string[] }[] = [
  { name: "milestones", args: [seeds] },
  { name: "simulate", args: ["24", "compare", seeds] },
  { name: "walls", args: [seeds] },
  ...(deep ? [{ name: "deep", args: ["deep", "active", "3000", seeds, "20"] }] : [])
];

const places = mkdtempSync(join(tmpdir(), "idlebound-places-"));
const began = performance.now();
const seconds = (from: number) => `${Math.round((performance.now() - from) / 1000)} s`;

/** Plays one script with the shared places; resolves with what it printed. */
function play(name: string, args: string[], results: string | undefined) {
  return new Promise<{ out: string; err: string; code: number | null; time: string }>((resolve) => {
    const from = performance.now();
    const child = spawn(process.execPath, [...process.execArgv, join(here, `${name}.ts`), ...args], {
      env: { ...process.env, SIM_PLACES: places, ...(results ? { SIM_RESULTS: results } : {}) }
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => (out += chunk));
    child.stderr.on("data", (chunk) => (err += chunk));
    child.on("close", (code) => resolve({ out, err, code, time: seconds(from) }));
  });
}

console.log(`${SCRIPTS.map((script) => [script.name, ...script.args].join(" ")).join(", ")}: ${workers()} games at once.`);
const kept = process.env.SIM_RESULTS;
const files = SCRIPTS.map((_, index) => (kept ? join(places, `results-${index}.json`) : undefined));
const played = await Promise.all(SCRIPTS.map((script, index) => play(script.name, script.args, files[index])));
let failed = false;
SCRIPTS.forEach((script, index) => {
  const { out, err, code, time } = played[index];
  console.log(`\n== ${[script.name, ...script.args].join(" ")} (${time})\n${out.trimEnd()}`);
  if (code !== 0) {
    failed = true;
    console.log(`${script.name} failed (exit ${code}):\n${err.trimEnd()}`);
  }
});
console.log(`\nAll played in ${seconds(began)}.`);

if (kept) {
  const runs: PoolRun[] = [];
  files.forEach((file, index) => {
    if (!file || !existsSync(file)) return;
    for (const run of JSON.parse(readFileSync(file, "utf8")) as PoolRun[]) runs.push({ ...run, script: SCRIPTS[index].name });
  });
  writeFileSync(kept, JSON.stringify(runs));
}
rmSync(places, { recursive: true, force: true });
if (failed) process.exit(1);
