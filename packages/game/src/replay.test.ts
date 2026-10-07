import { describe, expect, it } from "vitest";
import { Ledger, Page, run, type SaveAnswer } from "../scripts/ledger";
import { playBot } from "../scripts/bot";
import { exp, log, log10, log1p, log2, pow } from "./dmath";
import { GameEngine, STEP_MS } from "./engine";
import { buildWindow, localFates, occasion, SLICE_SIZE, STREAMS, WINDOW_SLICES, windowFates, type FateWindow } from "./fates";
import { parseJournal } from "./journal";
import { JOURNAL_MAX_STEPS, JournalWriter, diffStates, replay, type Journal, type JournalEntry } from "./replay";
import { parseState } from "./save";
import { createInitialState, SAVE_VERSION } from "./state";
import type { GameState } from "./types";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 9, 6, 8);
const wire = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe("deterministic maths", () => {
  it("stays within a few ulps of the engine's own, and exact where it must be", () => {
    let seed = 7;
    const next = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const near = (a: number, b: number, tolerance: number) => a === b || Math.abs(a - b) / Math.abs(b) < tolerance;
    for (let index = 0; index < 20_000; index += 1) {
      const x = Math.exp((next() - 0.5) * 1400);
      expect(near(log(x), Math.log(x), 1e-15)).toBe(true);
      const y = (next() - 0.5) * 1400;
      expect(near(exp(y), Math.exp(y), 1e-15)).toBe(true);
      const base = 1 + next() * 3;
      const power = next() * 400;
      expect(near(pow(base, power), Math.pow(base, power), 1e-13)).toBe(true);
      const small = (next() - 0.5) * 1e-3;
      expect(near(log1p(small), Math.log1p(small), 1e-15)).toBe(true);
    }
    for (let n = 0; n <= 22; n += 1) expect(log10(pow(10, n))).toBe(n);
    for (let n = -1074; n <= 1023; n += 97) expect(log2(pow(2, n))).toBe(n);
    expect(pow(2, 0.5) * pow(2, 0.5)).toBeCloseTo(2, 15);
    expect([log(0), log(-1), exp(1000), exp(-1000), pow(0, 2), pow(4, 0.5)]).toEqual([-Infinity, NaN, Infinity, 0, 0, 2]);
  });
});

describe("fates", () => {
  it("draw the n-th occasion of a stream the same, whatever happened in the others", () => {
    const fates = localFates(42);
    const draws = (count: number) => [0, 1, 2].map(() => occasion(fates, "chest", count)!());
    const engine = new GameEngine(createInitialState(T0), fates, T0);
    // A thousand strikes and kills in between change nothing for the third chest.
    const before = occasion(fates, "chest", 2)!();
    engine.state.fates.strike = 1000;
    engine.state.fates.loot = 500;
    expect(occasion(fates, "chest", 2)!()).toBe(before);
    expect(draws(5)).toEqual(draws(5));
    expect(draws(5)).not.toEqual(draws(6));
  });

  it("are known only inside the window the server handed out", () => {
    const secret = localFates(9);
    const window = buildWindow({ ...createInitialState(T0).fates, catch: 40 }, (stream, index) => secret.slice(stream, index)!);
    const page = windowFates(window);
    const first = Math.floor(40 / SLICE_SIZE.catch);
    expect(page.slice("catch", first)).toBe(secret.slice("catch", first));
    expect(page.slice("catch", first + WINDOW_SLICES - 1)).toBe(secret.slice("catch", first + WINDOW_SLICES - 1));
    // The slice after the window, and the slices before it, are nowhere in the page.
    expect(page.slice("catch", first + WINDOW_SLICES)).toBeNull();
    expect(page.slice("catch", first - 1)).toBeNull();
    for (const stream of STREAMS) expect(window[stream].seeds).toHaveLength(WINDOW_SLICES);
  });

  it("stop the road when they run out, and the time waited comes back as an absence", () => {
    const state = createInitialState(T0);
    const engine = new GameEngine(state, windowFates({} as FateWindow), T0);
    expect(engine.starved()).toBe(true);
    engine.tick(T0 + 60_000);
    expect(state.lastTickAt).toBe(T0);
    expect(state.lifetime.playTime).toBe(0);
    engine.fates = localFates(1);
    engine.tick(T0 + 60_000);
    expect(state.lifetime.offlineSeconds).toBeGreaterThan(0);
  });
});

describe("the step", () => {
  it("lives the same game whatever the cadence of the ticks under the catch-up threshold", () => {
    /** Ticks at `gaps` (in turn); every whole second, the walker strikes twice and takes the crystal. */
    const play = (gaps: number[]) => {
      const engine = new GameEngine(createInitialState(T0), localFates(3), T0);
      let now = T0;
      let second = T0;
      for (let index = 0; now < T0 + 20 * 60_000; index += 1) {
        now = Math.min(T0 + 20 * 60_000, now + gaps[index % gaps.length]);
        engine.tick(now);
        if (now - second >= 1000 && engine.state.lastTickAt % 1000 === T0 % 1000) {
          second = engine.state.lastTickAt;
          engine.perform({ type: "click", count: 2 }, second);
          if (engine.state.crystal) engine.perform({ type: "crystal" }, second);
        }
      }
      return engine.state;
    };
    // A frame, a throttled background tab, ragged timers: whole steps all the same.
    const frames = play([STEP_MS]);
    expect(play([1000])).toEqual(frames);
    expect(play([500, 250, 250])).toEqual(frames);
    expect(frames.lastTickAt).toBe(T0 + 20 * 60_000);
    expect(frames.lifetime.clicks).toBeGreaterThan(2000);
  });
});

/** The answers of a save the Ledger kept, as the honest page expects them. */
function keptOk(answer: SaveAnswer | null, where: string) {
  if (!answer) return;
  expect({ where, status: answer.status, violations: answer.violations ?? [], outcome: answer.outcome, diff: answer.diff }).toEqual({ where, status: 200, violations: [], outcome: "match", diff: [] });
}

describe("the replay", () => {
  it("replays a real six-hour game, through a shaky network, a background tab, two devices and a closed tab", () => {
    let now = T0;
    const ledger = new Ledger(77, "enforce", () => now);
    const fresh = ledger.newGame(T0);
    let page = new Page(ledger, "page-a");
    page.load(now, { state: createInitialState(fresh.createdAt), revision: null, fates: fresh.fates });
    let saves = 0;
    let nextSaveAt = now + 30_000;
    /** The page's sync every 30 s, through a network that loses some requests and some answers. */
    const sync = (at: number, outage = false) => {
      saves += 1;
      const lost = outage || saves % 7 === 0 ? "request" : saves % 11 === 0 ? "answer" : undefined;
      let answer = page.save(at, { lost });
      if (answer?.status === 409 && answer.code === "conflict") {
        // The answer of the last save was lost: the walker keeps the game in hand.
        answer = page.save(at, { replace: true });
      }
      keptOk(answer, `save ${saves}`);
      // Back from an outage, the rest of the journal follows at once (15 s apart on the page).
      while (answer?.more) {
        answer = page.save(at);
        keptOk(answer, `save ${saves}, a later part`);
      }
    };
    const bot = (minutes: number, outage?: { from: number; to: number }) => {
      now = playBot(page.engine, now, minutes * 60, {
        clicksPerSecond: 6,
        stagnationMs: 10 * 60_000,
        onTick: (_, at) => {
          now = at;
          if (at < nextSaveAt) return;
          nextSaveAt = at + 30_000;
          sync(at, outage !== undefined && at >= outage.from && at < outage.to);
        }
      });
    };

    for (let chunk = 0; chunk < 24; chunk += 1) {
      // Ninety minutes in, the network goes away for twelve minutes.
      bot(15, chunk === 6 ? { from: now + 60_000, to: now + 13 * 60_000 } : undefined);
      if (chunk === 8) {
        // Two hours in, the tab goes out of sight for twenty minutes: throttled timers, and
        // now and then a gap long enough for a catch-up. Saves still leave.
        page.setVisible(false, now);
        for (let minute = 0; minute < 20; minute += 1) {
          now = run(page, now, 50_000, 1000);
          now += 10_000;
          page.engine.tick(now);
          if (minute % 2 === 1) sync(now);
        }
        page.setVisible(true, now);
        nextSaveAt = now;
      }
      if (chunk === 12) {
        // Three hours in, a second device opens the game for a moment (it barely plays) while
        // the first plays on: the walker keeps the first device's game, further along, and
        // its journal is replayed from where the second device took the game.
        const other = new Page(ledger, "page-b");
        other.load(now, ledger.open("page-b")!);
        const took = now;
        now = playBot(page.engine, now, 5 * 60, { clicksPerSecond: 6 });
        keptOk(other.save(took + 20_000), "the second device's moment");
        expect(page.save(now)?.code).toBe("elsewhere");
        keptOk(page.save(now, { replace: true }), "keep the first device's game");
        expect(other.save(now + 1000)?.code).toBe("elsewhere");
        // Then the second device takes it for good and plays ten minutes; the first one finds
        // it elsewhere at its next save, and takes it back as the Ledger keeps it.
        other.load(now, ledger.open("page-b")!);
        const first = page;
        page = other;
        bot(10);
        keptOk(page.save(now), "the second device's ten minutes");
        expect(first.save(now)?.code).toBe("elsewhere");
        page = new Page(ledger, "page-a");
        page.load(now, ledger.open("page-a")!);
        nextSaveAt = now;
      }
      if (chunk === 16) {
        // Four hours in, the tab is closed for two hours, then opened again.
        sync(now);
        now += 2 * 3_600_000;
        page = new Page(ledger, "page-c");
        page.load(now, ledger.open("page-c")!);
        nextSaveAt = now;
      }
    }
    sync(now);
    expect(ledger.outcomes.filter((outcome) => outcome !== "match")).toEqual([]);
    expect(ledger.stored!.state.lifetime.ascensions).toBeGreaterThan(0);
    expect(ledger.stored!.state.lifetime.playTime).toBeGreaterThan(5 * 3600);
    expect(saves).toBeGreaterThan(600);
  }, 600_000);

  it("replays a page left alone long enough for the autopilot, and its Reunion when the walker comes back", () => {
    let now = T0;
    const ledger = new Ledger(5, "enforce", () => now);
    const fresh = ledger.newGame(T0);
    const page = new Page(ledger, "page");
    page.load(now, { state: createInitialState(fresh.createdAt), revision: null, fates: fresh.fates });
    now = playBot(page.engine, now, 10 * 60, { clicksPerSecond: 6 });
    page.act({ type: "settings", patch: { offlineSpending: true } }, now);
    keptOk(page.save(now), "before");
    now = run(page, now, 8 * 60_000);
    page.act({ type: "click", count: 1 }, now);
    keptOk(page.save(now), "after the autopilot");
    expect(page.engine.state.settings.offlineSpending).toBe(true);
  }, 120_000);
});

describe("the attacker", () => {
  /** An honest game the Ledger keeps, and a page ready to save again. */
  function honest(mode: "shadow" | "enforce" = "enforce") {
    let now = T0;
    const ledger = new Ledger(31, mode, () => now);
    const fresh = ledger.newGame(T0);
    const page = new Page(ledger, "page");
    page.load(now, { state: createInitialState(fresh.createdAt), revision: null, fates: fresh.fates });
    now = playBot(page.engine, now, 8 * 60, { clicksPerSecond: 6 });
    keptOk(page.save(now), "honest");
    now = playBot(page.engine, now, 60, { clicksPerSecond: 6 });
    const tick = (ms: number) => (now += ms);
    return { ledger, page, now: () => now, tick };
  }

  /** What the page would send now, for the attacker to tamper with. */
  function outgoing(page: Page, now: number) {
    const { checkpoint, journal } = page.outgoing(now);
    return { state: wire(checkpoint.state), journal: wire(journal) };
  }

  it("cannot keep a save forged within the bounds: the replayed game is kept", () => {
    const { ledger, page, now } = honest();
    const previous = structuredClone(ledger.stored!.state);
    const sent = outgoing(page, now());
    // Gold and kills a little past what was played, still under every bound.
    const forged = structuredClone(sent.state);
    forged.lifetime.kills += 3;
    forged.run.kills += 3;
    forged.gold += 50;
    forged.lifetime.goldEarned += 50;
    forged.run.goldEarned += 50;
    expect(verifyState(forged, now())).toEqual([]);
    expect(verifyTransition(previous, forged, now() - T0)).toEqual([]);
    const answer = ledger.save({ state: forged, baseRevision: page.revision, journal: sent.journal, holder: "page" });
    expect(answer.status).toBe(200);
    expect(answer.outcome).toBe("diverged");
    expect(answer.diff).toEqual(expect.arrayContaining(["gold", "lifetime.kills"]));
    expect(ledger.stored!.state.gold).toBe(sent.state.gold);
    expect(ledger.stored!.state.lifetime.kills).toBe(sent.state.lifetime.kills);
    // The page that forged it is told the game the Ledger kept.
    expect(answer.replay?.state.gold).toBe(sent.state.gold);
  }, 120_000);

  it("is seen in shadow mode: the difference is reported", () => {
    const { ledger, page, now } = honest("shadow");
    const sent = outgoing(page, now());
    sent.state.shards += 40;
    sent.state.lifetime.shardsEarned += 40;
    const answer = ledger.save({ state: sent.state, baseRevision: page.revision, journal: sent.journal, holder: "page" });
    expect(answer.outcome).toBe("diverged");
    expect(answer.diff).toContain("shards");
  }, 120_000);

  it("cannot draw the fates ahead: no window holds them, and fates drawn from another seed are not kept", () => {
    const { ledger, page, now } = honest();
    const window = ledger.window(ledger.stored!.state);
    for (const stream of STREAMS) {
      const known = windowFates(window);
      const last = window[stream].from + WINDOW_SLICES;
      expect(known.slice(stream, last)).toBeNull();
    }
    // The attacker plays the next minutes with fates it chose (its own seed, the luckiest it
    // found offline), and sends the game that gave.
    const state = structuredClone(ledger.stored!.state);
    const forger = new GameEngine(state, localFates(123_456), state.lastTickAt);
    const writer = new JournalWriter(state.lastTickAt);
    writer.attach(forger);
    const start = state.lastTickAt;
    const runtime = ledger.stored!.runtime!;
    forger.restore(runtime);
    const end = playBot(forger, start, 60, { clicksPerSecond: 6 });
    writer.mark(forger.state.lastTickAt);
    const journal: Journal = { base: { revision: ledger.stored!.revision, createdAt: state.createdAt }, start, entries: writer.entries, end: forger.state.lastTickAt };
    const answer = ledger.save({ state: wire(forger.state), baseRevision: ledger.stored!.revision, journal: wire(journal), holder: "page" });
    expect(answer.outcome).toBe("diverged");
    // The Ledger kept the fates of its own secret: the crits and drops it drew are not the forger's.
    const honestReplay = replay(structuredClone(state), runtime, journal, ledger.fates);
    expect("error" in honestReplay).toBe(false);
    expect(ledger.stored!.state.lifetime.crits).toBe((honestReplay as { state: GameState }).state.lifetime.crits);
    void page;
    void end;
  }, 120_000);

  it("cannot draw a fate twice by setting its counter back", () => {
    const { ledger, page, now } = honest("shadow");
    const sent = outgoing(page, now());
    sent.state.fates.catch = 0;
    sent.state.fates.loot = Math.max(0, ledger.stored!.state.fates.loot - 5);
    const answer = ledger.save({ state: sent.state, baseRevision: page.revision, journal: sent.journal, holder: "page" });
    expect(answer.status).toBe(422);
    expect(answer.violations!.map((violation) => violation.code)).toContain("fates");
  }, 120_000);

  it("gains nothing from a modified journal: impossible commands are ignored, moved ones change the game", () => {
    const { ledger, page, now } = honest();
    const sent = outgoing(page, now());
    const entries = sent.journal.entries;
    // A crystal caught where none stood, an ascension before its time, a stage never reached,
    // a relic equipped that was never found, a command that does not exist.
    const extra: JournalEntry[] = [[0, "crystal"], [0, "ascend", []], [0, "travel", 999], [0, "equip", "never-found"], [0, "gold", 1e9], [0, "click", 1e6]];
    const tampered: Journal = { ...sent.journal, entries: [...entries.slice(0, 5), ...extra, ...entries.slice(5)] };
    const parsed = parseJournal(tampered)!;
    expect(parsed.dropped).toBe(2); // the unknown command and the impossible click count
    // A flood of strikes past 400 a second of the journal's span is dropped before the replay.
    const flood: Journal = { ...sent.journal, entries: [...entries, ...Array.from({ length: 50_000 }, (): JournalEntry => [0, "click", 200])] };
    const flooded = parseJournal(flood)!;
    const strikes = flooded.journal.entries.filter((entry) => entry[1] === "click").reduce((total, entry) => total + (entry[2] as number), 0);
    expect(strikes).toBeLessThanOrEqual(((sent.journal.end - sent.journal.start) / STEP_MS + 1) * 20);
    const answer = ledger.save({ state: sent.state, baseRevision: page.revision, journal: tampered, holder: "page" });
    expect(answer.status).toBe(200);
    // What the honest journal gives, nothing more.
    const kept = ledger.stored!.state;
    expect(kept.lifetime.crystals).toBe(sent.state.lifetime.crystals);
    expect(kept.lifetime.ascensions).toBe(sent.state.lifetime.ascensions);
    expect(kept.maxStage).toBe(sent.state.maxStage);
    expect(kept.gold).toBeLessThanOrEqual(sent.state.gold);
  }, 120_000);

  it("cannot move its clicks to the fight it wants, nor claim a catch-up it never lived", () => {
    const { ledger, page, now } = honest();
    const sent = outgoing(page, now());
    // Every click of the journal moved to its very start.
    const clicks = sent.journal.entries.filter((entry) => entry[1] === "click").reduce((total, entry) => total + (entry[2] as number), 0);
    const moved: Journal = {
      ...sent.journal,
      entries: [[0, "click", Math.min(200, clicks)], ...sent.journal.entries.map((entry): JournalEntry => (entry[1] === "click" ? [entry[0], "input"] : entry)), [0, "@catchUp"]]
    };
    const answer = ledger.save({ state: sent.state, baseRevision: page.revision, journal: moved, holder: "page" });
    expect(answer.outcome).toBe("diverged");
    expect(ledger.stored!.state.lifetime.clicks).toBeLessThan(sent.state.lifetime.clicks);
  }, 120_000);

  it("cannot replay an old journal, nor a journal longer than the server takes", () => {
    const { ledger, page, now, tick } = honest();
    const first = outgoing(page, now());
    keptOk(ledger.save({ state: first.state, baseRevision: page.revision, journal: first.journal, holder: "page" }), "first");
    const revision = ledger.stored!.revision;
    // The same journal sent again on the new revision: its base is gone (two saves back).
    keptOk(ledger.save({ state: first.state, baseRevision: revision, journal: { ...first.journal }, holder: "page" }), "same again");
    tick(1000);
    const again = ledger.save({ state: first.state, baseRevision: revision + 1, journal: first.journal, holder: "page" });
    expect(again.status).toBe(422);
    expect(again.outcome).toBe("no-base");
    // Hours of steps in one journal: refused, never replayed past the cap.
    const start = ledger.stored!.state.lastTickAt;
    const long: Journal = { base: { revision: ledger.stored!.revision, createdAt: first.state.createdAt }, start, entries: [], end: start + (JOURNAL_MAX_STEPS + 10) * STEP_MS };
    const answer = ledger.save({ state: ledger.stored!.state, baseRevision: ledger.stored!.revision, journal: long, holder: "page" });
    expect(answer.status).toBe(422);
    expect(answer.outcome).toBe("failed");
  }, 120_000);

  it("cannot keep a save without a journal once the replay is enforced", () => {
    const { ledger, page, now } = honest();
    const sent = outgoing(page, now());
    const answer = ledger.save({ state: sent.state, baseRevision: page.revision, holder: "page" });
    expect(answer.status).toBe(422);
    expect(answer.violations!.map((violation) => violation.code)).toContain("journal");
  }, 120_000);

  it("finds the differences anywhere in the save", () => {
    const state = createInitialState(T0);
    const other = structuredClone(state);
    other.inventory.push({ uid: "x", slot: "ring", rarity: "mythic", level: 1, base: 1, affixes: [], forge: 0 });
    other.heroLevels.aldric = 2;
    expect(diffStates(state, other)).toEqual(expect.arrayContaining(["inventory.0", "heroLevels.aldric"]));
  });
});

describe("save version 15", () => {
  it("loads a version 14 save (its generator in the save), verifies it, plays on and is replayed", () => {
    const engine = new GameEngine(createInitialState(T0), localFates(8), T0);
    const now = playBot(engine, T0, 20 * 60, { clicksPerSecond: 5 });
    const legacy = wire(engine.state) as unknown as Record<string, unknown>;
    legacy.version = 14;
    delete legacy.fates;
    legacy.rngState = 123_456_789;
    const migrated = parseState(legacy);
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.fates).toEqual(createInitialState(T0).fates);
    expect("rngState" in migrated).toBe(false);
    expect(verifyState(migrated, now)).toEqual([]);
    // The server keeps it as it opens; the page plays on from it, and the replay agrees.
    const ledger = new Ledger(4, "enforce", () => later);
    let later = now;
    ledger.stored = { revision: 3, state: migrated, runtime: null, updatedAt: now };
    const page = new Page(ledger, "page");
    page.load(now, ledger.open("page")!);
    later = playBot(page.engine, now, 5 * 60, { clicksPerSecond: 5 });
    keptOk(page.save(later), "after the migration");
    expect(verifyTransition(parseState(legacy), ledger.stored.state, later - now)).toEqual([]);
  }, 120_000);
});
