/**
 * Two versions of the game side by side, seed by seed: a balance script played now, against
 * the same script with the same arguments kept before a change. The same seeds play both
 * sides, so what moves is the change and not the luck of a seed: three seeds tell what moved
 * long before nine medians would (the nine stay the final word, see AGENTS.md).
 *
 *   npm run compare -- save <script> [args...]   keeps the reference
 *   npm run compare -- <script> [args...]        plays and compares
 *
 * `<script>` is a balance script of this folder that plays through `pool` (`milestones`,
 * `simulate`, `walls`, `deep`, `longrun`), or `suite` for all of AGENTS.md's at
 * once (`suite 3`), its arguments as it takes them. The
 * reference goes to `SIM_DIR` (the system's temporary folder by default), one per script and
 * arguments. Prints the script's own output, then every number of the results that moved: the
 * median before and after, the median of each seed's own change, and how many seeds went up
 * and down (`SIM_ROWS` rows at most, the largest changes first).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { PoolRun } from "./pool";

const DIR = process.env.SIM_DIR ?? join(tmpdir(), "idlebound-sim");
const ROWS = Number(process.env.SIM_ROWS) || 40;
const here = dirname(fileURLToPath(import.meta.url));
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

type Leaf = number | string;

/** Every value of a result by its path ("stages.12", "last.essences"). */
function leaves(value: unknown, path = "", out = new Map<string, Leaf>()): Map<string, Leaf> {
  if (typeof value === "number" || typeof value === "string") out.set(path || "result", value);
  else if (typeof value === "boolean") out.set(path || "result", String(value));
  else if (Array.isArray(value)) value.forEach((item, index) => leaves(item, path ? `${path}.${index}` : String(index), out));
  else if (value !== null && typeof value === "object") for (const [key, item] of Object.entries(value)) leaves(item, path ? `${path}.${key}` : key, out);
  return out;
}

/** A job without its seed, and without what every job shares: the line of play it belongs to. */
function lineOf(job: unknown, shared: Set<string>): string {
  if (job === null || typeof job !== "object") return "";
  return Object.entries(job)
    .filter(([key]) => key !== "seed" && !shared.has(key))
    .map(([, value]) => String(value))
    .join(" ");
}

/** The keys every job of a run holds with the same value. */
function sharedKeys(jobs: unknown[]): Set<string> {
  const shared = new Set<string>();
  const first = jobs[0];
  if (first === null || typeof first !== "object") return shared;
  for (const [key, value] of Object.entries(first)) {
    if (jobs.every((job) => job !== null && typeof job === "object" && JSON.stringify((job as Record<string, unknown>)[key]) === JSON.stringify(value))) shared.add(key);
  }
  return shared;
}

const format = (value: number) => {
  if (!Number.isFinite(value)) return String(value);
  const size = Math.abs(value);
  return size !== 0 && (size >= 1e6 || size < 1e-3) ? value.toExponential(3) : String(Number(value.toPrecision(4)));
};
const signed = (value: number) => (value > 0 ? `+${format(value)}` : format(value));

interface Row {
  label: string;
  weight: number;
  text: string;
}

/** What moved between `before` and `after`, seed by seed. */
function compare(before: PoolRun[], after: PoolRun[]): { rows: Row[]; compared: number; seeds: number } {
  const rows: Row[] = [];
  let compared = 0;
  let seeds = 0;
  after.forEach((run, index) => {
    const reference = before[index];
    if (!reference) return;
    const kept = new Map(reference.jobs.map((job, at) => [JSON.stringify(job), reference.results[at]]));
    const shared = sharedKeys(run.jobs);
    const lines = new Map<string, { before: Map<string, Leaf>; after: Map<string, Leaf> }[]>();
    run.jobs.forEach((job, at) => {
      const key = JSON.stringify(job);
      if (!kept.has(key)) return;
      const line = lineOf(job, shared);
      if (!lines.has(line)) lines.set(line, []);
      lines.get(line)!.push({ before: leaves(kept.get(key)), after: leaves(run.results[at]) });
    });
    for (const [line, pairs] of lines) {
      seeds = Math.max(seeds, pairs.length);
      const paths = new Set(pairs.flatMap((pair) => [...pair.before.keys(), ...pair.after.keys()]));
      for (const path of paths) {
        compared += 1;
        const label = `${run.script ? `${run.script} | ` : after.length > 1 ? `[${index + 1}] ` : ""}${line ? `${line} | ` : ""}${path}`;
        const values = pairs.map((pair) => [pair.before.get(path), pair.after.get(path)] as const);
        if (values.every(([from, to]) => from === to)) continue;
        const numbers = values.filter((pair): pair is readonly [number, number] => typeof pair[0] === "number" && typeof pair[1] === "number");
        if (numbers.length === values.length) {
          const changes = numbers.map(([from, to]) => to - from);
          const from = median(numbers.map(([value]) => value));
          const to = median(numbers.map(([, value]) => value));
          const change = median(changes);
          const relative = from !== 0 ? change / Math.abs(from) : change === 0 ? 0 : Infinity;
          const up = changes.filter((value) => value > 0).length;
          const down = changes.filter((value) => value < 0).length;
          rows.push({
            label,
            weight: Math.abs(relative),
            text: `${format(from)} -> ${format(to)}   seed by seed ${signed(change)}${Number.isFinite(relative) ? ` (${signed(relative * 100)}%)` : ""}   up ${up}, down ${down}, same ${changes.length - up - down}`
          });
        } else {
          // Reached on one side only, or a text that changed (what stopped a game).
          const reached = (side: 0 | 1) => values.filter((pair) => pair[side] !== undefined).length;
          const moved = values.filter(([from, to]) => from !== to).length;
          rows.push({ label, weight: Infinity, text: `${moved} of ${values.length} seeds changed   (present ${reached(0)} -> ${reached(1)})` });
        }
      }
    }
  });
  rows.sort((a, b) => b.weight - a.weight);
  return { rows, compared, seeds };
}

const argv = process.argv.slice(2);
const saving = argv[0] === "save";
const [script, ...args] = saving ? argv.slice(1) : argv;
if (!script || script === "compare" || script === "pool" || !existsSync(join(here, `${script}.ts`))) {
  console.error("usage: npm run compare -- [save] <suite|milestones|simulate|walls|deep|longrun> [args...]");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });
const reference = join(DIR, `${[script, ...args].join(" ").replace(/[^\w.-]+/g, "_")}.json`);
if (!saving && !existsSync(reference)) {
  console.error(`No reference for "${[script, ...args].join(" ")}": keep one first with \`npm run compare -- save ${[script, ...args].join(" ")}\`.`);
  process.exit(1);
}
const fresh = join(DIR, `run-${process.pid}.json`);
rmSync(fresh, { force: true });
const played = spawnSync(process.execPath, [...process.execArgv, join(here, `${script}.ts`), ...args], { stdio: "inherit", env: { ...process.env, SIM_RESULTS: fresh } });
if (played.status !== 0 || !existsSync(fresh)) {
  console.error(played.status !== 0 ? `${script} failed.` : `${script} played nothing through pool: nothing to compare.`);
  process.exit(1);
}
const runs = JSON.parse(readFileSync(fresh, "utf8")) as PoolRun[];
rmSync(fresh);

if (saving) {
  writeFileSync(reference, JSON.stringify({ at: new Date().toISOString(), runs }));
  console.log(`\nReference kept: ${reference}`);
} else {
  const kept = JSON.parse(readFileSync(reference, "utf8")) as { at: string; runs: PoolRun[] };
  const { rows, compared, seeds } = compare(kept.runs, runs);
  console.log(`\nAgainst the reference of ${kept.at}, ${seeds} seeds paired:`);
  if (rows.length === 0) console.log(`identical on every seed (${compared} numbers).`);
  else {
    const width = Math.max(...rows.slice(0, ROWS).map((row) => row.label.length));
    for (const row of rows.slice(0, ROWS)) console.log(`${row.label.padEnd(width)}   ${row.text}`);
    console.log(`${rows.length} of ${compared} numbers moved${rows.length > ROWS ? ` (the ${ROWS} largest shown, SIM_ROWS for more)` : ""}.`);
  }
}
