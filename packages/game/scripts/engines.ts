/**
 * The replay lands on the same game in every browser engine (npm run engines).
 *
 * A walker plays nine minutes from deep fixtures (stage 1000, 2800 and 9950: every curve, the
 * larger unit of the deep road) with the journal written as on the page. The replay is then
 * bundled for the browser and run in Chromium (V8), Firefox (SpiderMonkey) and WebKit
 * (JavaScriptCore): each must land on the game Node replayed, to the last bit. The maths the
 * engine uses are written with the basic operations alone (see `dmath.ts`), so they must.
 *
 * Needs Playwright's browsers (the official Playwright image has all three). An engine whose
 * browser is not installed fails the run: `--only=chromium,firefox` narrows it on purpose.
 */
import { readFileSync } from "node:fs";
import { build } from "esbuild";
import { chromium, firefox, webkit, type BrowserType } from "playwright-core";
import { GameEngine } from "../src/engine";
import { localFates } from "../src/fates";
import { migrateState } from "../src/migrate";
import { JournalWriter, replay, type Journal } from "../src/replay";
import type { GameState } from "../src/types";
import { playBot } from "./bot";

const FIXTURES = ["walker-1000", "walker-2800", "walker-9950"];
const SEED = 20_261_006;

/** FNV-1a over the game's JSON: the same text gives the same number in every engine. */
function fingerprint(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${hash.toString(16)}:${text.length}`;
}

interface Case {
  name: string;
  base: GameState;
  journal: Journal;
  expected: string;
}

function makeCase(name: string): Case {
  const kept = JSON.parse(readFileSync(new URL(`../src/fixtures/${name}.json`, import.meta.url), "utf8")) as { state: unknown; now: number };
  const base = migrateState(kept.state) as GameState;
  const state = structuredClone(base);
  const engine = new GameEngine(state, localFates(SEED), state.lastTickAt);
  const writer = new JournalWriter(state.lastTickAt);
  writer.attach(engine);
  const start = state.lastTickAt;
  playBot(engine, start, 8 * 60, { clicksPerSecond: 8 });
  // A background tab: a gap past the catch-up threshold, lived in one catch-up.
  engine.tick(engine.state.lastTickAt + 90_000);
  playBot(engine, engine.state.lastTickAt, 60, { clicksPerSecond: 8 });
  writer.mark(engine.state.lastTickAt);
  const journal: Journal = {
    base: { revision: 1, createdAt: base.createdAt },
    open: { at: start, skipTo: start, afkAfterMs: null, locale: "fr", visible: true },
    start,
    entries: writer.entries,
    end: engine.state.lastTickAt
  };
  const replayed = replay(base, null, journal, localFates(SEED));
  if ("error" in replayed) throw new Error(`${name}: ${replayed.error}`);
  const played = fingerprint(JSON.stringify(engine.state));
  const expected = fingerprint(JSON.stringify(replayed.state));
  if (played !== expected) throw new Error(`${name}: Node's replay differs from the game it played.`);
  return { name, base, journal, expected };
}

async function bundle(): Promise<string> {
  const result = await build({
    stdin: {
      contents: `
        import { replay } from "./src/replay";
        import { localFates } from "./src/fates";
        ${fingerprint.toString()}
        globalThis.replayCase = (input) => {
          const result = replay(input.base, null, input.journal, localFates(${SEED}));
          return "error" in result ? "error:" + result.error : fingerprint(JSON.stringify(result.state));
        };
      `,
      resolveDir: new URL("..", import.meta.url).pathname,
      loader: "ts"
    },
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2022",
    write: false
  });
  return result.outputFiles[0].text;
}

const ENGINES: Record<string, BrowserType> = { chromium, firefox, webkit };
const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice("--only=".length).split(",");
const names = Object.keys(ENGINES).filter((name) => !only || only.includes(name));

const cases = FIXTURES.map(makeCase);
const code = await bundle();
let failed = false;
for (const name of names) {
  let browser;
  try {
    browser = await ENGINES[name].launch();
  } catch (error) {
    console.error(`${name}: not installed (${error instanceof Error ? error.message.split("\n")[0] : error})`);
    failed = true;
    continue;
  }
  const page = await browser.newPage();
  await page.addScriptTag({ content: code });
  for (const item of cases) {
    const got = await page.evaluate((input) => (globalThis as unknown as { replayCase: (value: unknown) => string }).replayCase(input), { base: item.base, journal: item.journal });
    const same = got === item.expected;
    if (!same) failed = true;
    console.log(`${name.padEnd(9)} ${item.name.padEnd(12)} ${same ? "same game" : `DIFFERS (${got} instead of ${item.expected})`}`);
  }
  await browser.close();
}
process.exitCode = failed ? 1 : 0;
