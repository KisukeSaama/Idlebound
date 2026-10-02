import { describe, expect, it } from "vitest";
import { playBot, promisesAvoided, reasonablePromise } from "../scripts/bot";
import { chronicleEntries } from "./chronicle";
import { chronicleText, gameText, promiseText } from "./content";
import { DASH, EMOJI, FORBIDDEN_WORDS } from "./content/writing";
import { HERO_BY_ID } from "./data/heroes";
import { RECOGNITION_HEROES, RECOGNITION_TIERS, promisesAwaited, recognitionNeeds, recognitionRuns, recognitionTier } from "./data/lore";
import { PROMISES, PROMISE_BY_HERO, PROMISE_DOUBLINGS, hireBarred, promiseDepth, promiseHolds, promisesKept, promisesOpen, standingPromise } from "./data/promises";
import { GameEngine, canDescend, nextRecruit } from "./engine";
import { BASE_BOSS_TIMER, derive, promiseAskable, promiseWhen } from "./formulas";
import { LOCALES } from "./i18n";
import { generateItem } from "./loot";
import { seededRng, type Rng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState } from "./state";
import type { GameEvent, GameState } from "./types";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 2, 1);
/** Where the walker of these tests stands: many nights in. */
const NOW = T0 + 900 * 3600_000;

const codes = (state: GameState, now = NOW) => verifyState(state, now).map((violation) => violation.code);

/**
 * A walker of forty nights at the end of one, the King beaten: everyone met, essences in
 * hand, a purse waiting at the next dusk (the Altar of Memory), a weapon worn.
 */
function walker(): GameState {
  const state = createInitialState(T0);
  state.lastTickAt = NOW;
  state.lastClickAt = NOW;
  state.lifetime.playTime = 800 * 3600;
  state.lifetime.offlineSeconds = 50 * 3600;
  state.lifetime.kills = 5_000_000;
  state.lifetime.bosses = 200_000;
  state.lifetime.kings = 5_000;
  state.lifetime.ascensions = 40;
  state.lifetime.crystals = 2_000;
  state.lifetime.bestHired = 21;
  state.lifetime.bestLevelSum = 10_000;
  state.lifetime.itemsFound = 10;
  state.lifetime.ascensionEssences = 1e9;
  state.lifetime.essencesEarned = 1e9;
  state.essences = 1e9 - 10;
  state.altars = { memory: 1 };
  state.maxStageEver = 1_200;
  state.maxStage = 60;
  state.stage = 60;
  state.ascensions = [{ at: T0 + 3600_000, maxStage: 60, essences: 100 }];
  state.equipment.weapon = generateItem(seededRng(7), 300, { slot: "weapon", rarity: "epic" });
  // Everyone half remembers this walker: each may ask for their word.
  state.recognition = everyone(HALF);
  return state;
}

/** Runs of Recognition the walker of these tests has with everyone: half remembered. */
const HALF = RECOGNITION_TIERS[1];

/** Every companion at so many runs of Recognition. */
function everyone(runs: number): Record<string, number> {
  return Object.fromEntries(RECOGNITION_HEROES.map((hero) => [hero, runs]));
}

function engineWith(state: GameState, rng: Rng = seededRng(1), now = NOW) {
  return new GameEngine(state, rng, now);
}

/** The same walker at the dusk of a night, nothing walked yet. */
function rested(): GameState {
  const state = walker();
  state.maxStage = 1;
  state.stage = 1;
  return state;
}

/** The dusk of a new night, the walker's word given to `hero`. */
function duskWith(hero: string, state = walker()) {
  const engine = engineWith(state);
  expect(engine.pledge(hero, NOW), hero).toBe(true);
  engine.ascend(NOW);
  engine.drainEvents();
  return engine;
}

function events(engine: GameEngine, type: GameEvent["type"]) {
  return engine.drainEvents().filter((event) => event.type === type);
}

/** Ticks an engine ten times a second for `seconds`. */
function run(engine: GameEngine, from: number, seconds: number): number {
  let now = from;
  for (let step = 0; step < seconds * 10; step += 1) {
    now += 100;
    engine.tick(now);
  }
  return now;
}

/** A company strong enough to hold the first roads, hired by hand. */
function hire(engine: GameEngine, levels: Record<string, number>) {
  const s = engine.state;
  s.gold = 1e60;
  s.run.goldEarned = 1e60;
  s.lifetime.goldEarned = 1e60;
  for (const [hero, level] of Object.entries(levels)) expect(engine.buyHero(hero, level, NOW), hero).toBe(true);
}

describe("the Promise: what each companion asks", () => {
  it("gives every companion one request, in both languages, in their voice and within the writing rules", () => {
    expect(PROMISES.map((promise) => promise.hero)).toEqual([...RECOGNITION_HEROES]);
    for (const locale of LOCALES) {
      const text = gameText(locale);
      expect(Object.keys(text.promises).sort()).toEqual([...RECOGNITION_HEROES].sort());
      for (const hero of RECOGNITION_HEROES) {
        const lines = promiseText(hero, locale)!;
        for (const [part, line] of Object.entries(lines)) {
          const where = `${locale} ${hero} ${part}`;
          expect(line.length, where).toBeGreaterThan(2);
          expect(line.length, `${where}: ${line}`).toBeLessThanOrEqual(180);
          expect(line, where).not.toMatch(DASH);
          expect(line, where).not.toMatch(EMOJI);
          expect(line, where).not.toMatch(FORBIDDEN_WORDS);
        }
        expect(new Set(Object.values(lines)).size, `${locale} ${hero}`).toBe(3);
      }
    }
    // The Nameless and the Awakened do not speak yet: theirs are gestures.
    for (const hero of ["nameless", "awakened"]) {
      for (const locale of LOCALES) for (const line of Object.values(promiseText(hero, locale)!)) expect(line).not.toMatch(/["«»]/);
    }
    expect(promiseText("aldric", "en")).toBeNull();
  });

  it("leaves behind only a companion the walker has met, and asks for a weapon only of one who wears it", () => {
    for (const promise of PROMISES) {
      if (promise.kind === "without") expect(HERO_BY_ID[promise.other], promise.hero).toBeDefined();
    }
    const state = walker();
    for (const hero of RECOGNITION_HEROES) expect(promiseAskable(state, hero), hero).toBe(true);
    delete state.equipment.weapon;
    expect(promiseAskable(state, "brom")).toBe(false);
    // Brother Cinder asks to walk without Ashka: not before she has been met.
    state.lifetime.bestHired = 8;
    state.recognition = { maelle: HALF, cendre: HALF };
    expect(promiseAskable(state, "cendre")).toBe(false);
    expect(promiseAskable(state, "maelle")).toBe(true);
    expect(promiseAskable(state, "eldra")).toBe(false);
  });
});

describe("the Promise: a word given at dusk", () => {
  it("opens once a companion half remembers the walker, and is given at once only while the night is still at its dusk", () => {
    const fresh = engineWith(createInitialState(T0), seededRng(1), T0);
    expect(promisesOpen(fresh.state)).toBe(false);
    expect(fresh.pledge("maelle", T0)).toBe(false);
    // Nights walked are not enough: only who half remembers the walker asks for their word.
    const stranger = walker();
    stranger.recognition = { maelle: HALF - 1, brom: HALF };
    expect(promisesOpen(stranger)).toBe(true);
    expect(promiseAskable(stranger, "maelle")).toBe(false);
    expect(promiseAskable(stranger, "brom")).toBe(true);
    expect(engineWith(stranger).pledge("maelle", NOW)).toBe(false);
    stranger.recognition = { maelle: HALF - 1 };
    expect(promisesOpen(stranger)).toBe(false);
    // And the Ledger refuses a word given to someone who does not remember them.
    const forged = walker();
    forged.recognition.maelle = HALF - 1;
    forged.maxStage = forged.stage = 1;
    forged.trail.promise = { hero: "maelle", kings: 0 };
    expect(codes(forged)).toContain("promise");

    // A night under way: the word waits for the next dusk.
    const engine = engineWith(walker());
    expect(engine.pledge("maelle", NOW)).toBe(true);
    expect(engine.state.pledge).toBe("maelle");
    expect(engine.state.trail.promise).toBeUndefined();
    expect(engine.pledge(null, NOW)).toBe(true);
    expect(engine.state.pledge).toBeUndefined();
    engine.pledge("maelle", NOW);
    engine.ascend(NOW);
    expect(engine.state.pledge).toBeUndefined();
    expect(engine.state.trail.promise).toEqual({ hero: "maelle", kings: 0 });
    expect(events(engine, "promise")).toContainEqual({ type: "promise", heroId: "maelle", outcome: "given" });
    // One word a night: another waits for the next dusk.
    engine.pledge("brom", NOW);
    expect(engine.state.trail.promise!.hero).toBe("maelle");
    expect(engine.state.pledge).toBe("brom");

    // At dusk itself, nobody hired yet: given at once.
    const dusk = engineWith(walker());
    dusk.ascend(NOW);
    expect(promiseWhen(dusk.state, "kaelen")).toBe("tonight");
    dusk.pledge("kaelen", NOW);
    expect(dusk.state.trail.promise?.hero).toBe("kaelen");
    expect(verifyState(dusk.state, NOW)).toEqual([]);

    // Once someone has joined, or what the word forbids was done, it is for the next dusk.
    const late = engineWith(walker());
    late.ascend(NOW);
    late.state.run.skillsUsed = 1;
    late.state.lifetime.skillsUsed = 1;
    expect(promiseWhen(late.state, "nyx")).toBe("next");
    expect(promiseWhen(late.state, "maelle")).toBe("tonight");
    late.buyHero("maelle", 1, NOW);
    expect(promiseWhen(late.state, "maelle")).toBe("next");
  });

  it("is kept at dusk only when the King fell that night, and the night then counts twice", () => {
    const engine = duskWith("ysolde");
    const s = engine.state;
    hire(engine, { maelle: 120, brom: 100, ysolde: 100 });
    // No King yet: the word does not hold, and a dusk now would break it.
    expect(promiseHolds(s)).toBe(false);
    s.maxStage = 50;
    s.stage = 50;
    let now = run(engine, NOW, 20);
    expect(s.maxStage).toBeGreaterThan(50);
    expect(s.trail.promise).toMatchObject({ hero: "ysolde", kings: 1 });
    expect(promiseHolds(s)).toBe(true);
    expect(events(engine, "promise")).toContainEqual({ type: "promise", heroId: "ysolde", outcome: "ready" });
    expect(verifyState(s, now)).toEqual([]);

    const before = structuredClone(s);
    now += 60_000;
    engine.tick(now);
    engine.ascend(now);
    expect(promisesKept(s, "ysolde")).toBe(1);
    // Twice for the one whose word was kept, who reached level 100 too; once for the others who did.
    expect(recognitionRuns(s, "ysolde")).toBe(HALF + 2);
    expect(s.lastPromise).toBe("ysolde");
    expect(recognitionRuns(s, "maelle")).toBe(HALF + 1);
    expect(recognitionRuns(s, "brom")).toBe(HALF + 1);
    const told = engine.drainEvents();
    expect(told).toContainEqual({ type: "promise", heroId: "ysolde", outcome: "kept" });
    expect(told).toContainEqual({ type: "fragment", entry: { source: "promise", hero: "ysolde" } });
    expect(s.trail.promise).toBeUndefined();
    expect(verifyState(s, now)).toEqual([]);
    expect(verifyTransition(before, s, 120_000)).toEqual([]);
    // Her words stay in the Chronicle.
    const entry = chronicleEntries(s).find((item) => item.source === "promise")!;
    expect(entry).toEqual({ source: "promise", hero: "ysolde" });
    expect(chronicleText(entry, "en")).toEqual({ by: "Ysolde", text: promiseText("ysolde", "en")!.kept });
    expect(chronicleText(entry, "fr").text).toBe(promiseText("ysolde", "fr")!.kept);
  });

  it("counts a word kept once only for a companion who stayed below level 100, and nobody asks two nights running", () => {
    const engine = duskWith("ysolde");
    const s = engine.state;
    hire(engine, { maelle: 120, ysolde: 60 });
    // Nobody levels up behind the walker's back in this night.
    s.settings.offlineSpending = false;
    s.maxStage = 50;
    s.stage = 50;
    let now = run(engine, NOW, 20);
    expect(promiseHolds(s)).toBe(true);
    // Ysolde again at the next dusk: refused. Another companion: taken.
    expect(promiseWhen(s, "ysolde")).toBeNull();
    expect(engine.pledge("ysolde", now)).toBe(false);
    expect(promiseWhen(s, "brom")).toBe("next");
    now += 60_000;
    engine.tick(now);
    engine.ascend(now);
    expect(promisesKept(s, "ysolde")).toBe(1);
    expect(recognitionRuns(s, "ysolde")).toBe(HALF + 1);
    expect(recognitionRuns(s, "maelle")).toBe(HALF + 1);
    // The dusk after her night: she does not ask for tonight (at the next dusk she may), the others do.
    expect(s.lastPromise).toBe("ysolde");
    expect(promiseWhen(s, "ysolde")).toBe("next");
    expect(engine.pledge("ysolde", now)).toBe(true);
    expect(s.trail.promise).toBeUndefined();
    expect(s.pledge).toBe("ysolde");
    expect(promiseWhen(s, "brom")).toBe("tonight");
    expect(engine.pledge("brom", now)).toBe(true);
    expect(s.trail.promise?.hero).toBe("brom");
    expect(verifyState(s, now)).toEqual([]);
    // A night later she asks again: for the night after Brom's.
    expect(promiseWhen(s, "ysolde")).toBe("next");
    hire(engine, { maelle: 120 });
    s.maxStage = 60;
    s.stage = 60;
    engine.pledge("ysolde", now);
    engine.ascend(now + 60_000);
    expect(s.lastPromise).toBe("brom");
    expect(s.trail.promise?.hero).toBe("ysolde");
    // A night without a word: nobody is resting at the next dusk.
    engine.breakPromise(now + 60_000);
    hire(engine, { maelle: 120 });
    s.maxStage = 60;
    s.stage = 60;
    engine.ascend(now + 120_000);
    expect(s.lastPromise).toBe("ysolde");
    hire(engine, { maelle: 120 });
    s.maxStage = 60;
    s.stage = 60;
    engine.ascend(now + 180_000);
    expect(s.lastPromise).toBeUndefined();
  });

  it("counts a night twice only for the two words a companion's memories wait for", () => {
    const state = walker();
    state.promises = { maelle: 2 };
    state.recognition = { maelle: 20 };
    expect(promisesAwaited(state, "maelle")).toBe(0);
    expect(promisesAwaited(state, "brom")).toBe(2);
    const engine = duskWith("maelle", state);
    const s = engine.state;
    hire(engine, { maelle: 200 });
    s.settings.offlineSpending = false;
    s.maxStage = 50;
    s.stage = 50;
    const now = run(engine, NOW, 20);
    expect(promiseHolds(s)).toBe(true);
    engine.ascend(now + 60_000);
    // A third word kept: it is kept, and the night counts like any night she reached level 100.
    expect(promisesKept(s, "maelle")).toBe(3);
    expect(recognitionRuns(s, "maelle")).toBe(21);
    expect(verifyState(s, now + 60_000)).toEqual([]);
    // The Ledger counts no more than two doubled nights a companion.
    s.recognition.maelle = s.lifetime.ascensions + 3;
    expect(codes(s, now + 60_000)).toContain("recognition");
  });

  it("is not asked for a night the walker's best stage makes impossible", () => {
    // Lysandre wants two Kings: not of a walker who has never been past the second.
    const state = walker();
    state.maxStageEver = 100;
    expect(promiseDepth(PROMISE_BY_HERO.lysandre, 1)).toBe(100);
    expect(promiseAskable(state, "lysandre")).toBe(false);
    expect(promiseAskable(state, "maelle")).toBe(true);
    state.maxStageEver = 101;
    expect(promiseAskable(state, "lysandre")).toBe(true);
    // A guardian to wait at must be one already beaten, counted from where the night starts.
    expect(promiseDepth(PROMISE_BY_HERO.mirelle, 1)).toBe(50);
    expect(promiseDepth(PROMISE_BY_HERO.seraphine, 31)).toBe(70);
    expect(promiseDepth(PROMISE_BY_HERO.aurelion, 51)).toBe(100);
    const young = walker();
    young.maxStageEver = 62;
    young.altars = { memory: 1, wanderer: 3 };
    // The night starts on stage 31: the next Heart of the Old Grove stands at stage 70.
    expect(promiseAskable(young, "seraphine")).toBe(false);
    expect(promiseAskable(young, "mirelle")).toBe(true);
    const engine = engineWith(young);
    expect(engine.pledge("seraphine", NOW)).toBe(false);
    expect(engine.pledge("lysandre", NOW)).toBe(false);
    // The Ledger refuses a word the road could not have offered.
    const forged = duskWith("maelle").state;
    forged.trail.promise = { hero: "lysandre", kings: 0 };
    forged.maxStageEver = 90;
    expect(codes(forged)).toContain("promise");
  });

  it("costs no power when broken: one line, no fragment, and nothing counts twice", () => {
    const engine = duskWith("cendre");
    const s = engine.state;
    hire(engine, { maelle: 120 });
    const power = derive(s, NOW).dps;
    expect(engine.breakPromise(NOW)).toBe(true);
    expect(s.trail.promise).toMatchObject({ hero: "cendre", broken: true });
    expect(events(engine, "promise")).toEqual([{ type: "promise", heroId: "cendre", outcome: "broken" }]);
    expect(derive(s, NOW).dps).toBe(power);
    expect(engine.breakPromise(NOW)).toBe(false);
    // The word is gone: Ashka may join again.
    expect(hireBarred(s, "ashka")).toBe(false);
    s.maxStage = 60;
    s.stage = 60;
    engine.ascend(NOW + 60_000);
    const told = engine.drainEvents();
    expect(told.filter((event) => event.type === "promise")).toEqual([]);
    expect(told.some((event) => event.type === "fragment" && event.entry.source === "promise")).toBe(false);
    expect(promisesKept(s, "cendre")).toBe(0);
    expect(recognitionRuns(s, "cendre")).toBe(HALF);
    expect(recognitionRuns(s, "maelle")).toBe(HALF + 1);

    // A dusk called before the King fell breaks the word, there and then.
    const early = duskWith("nyx");
    hire(early, { maelle: 120 });
    early.state.maxStage = 60;
    early.state.stage = 60;
    early.state.runStartStage = 51;
    early.ascend(NOW + 60_000);
    expect(events(early, "promise")).toEqual([{ type: "promise", heroId: "nyx", outcome: "broken" }]);
    expect(promisesKept(early.state, "nyx")).toBe(0);
  });

  it("asks the last two memories for a word kept, once each, and tells what a companion still needs", () => {
    const state = rested();
    state.recognition = { eldra: RECOGNITION_TIERS[3] };
    expect(recognitionTier(state, "eldra")).toBe(3);
    expect(recognitionNeeds(state, "eldra")).toEqual({ runs: 0, promises: 1 });
    state.promises = { eldra: 1 };
    expect(recognitionTier(state, "eldra")).toBe(4);
    expect(recognitionNeeds(state, "eldra")).toEqual({ runs: RECOGNITION_TIERS[4] - RECOGNITION_TIERS[3], promises: 1 });
    state.recognition = { eldra: RECOGNITION_TIERS[4] };
    expect(recognitionTier(state, "eldra")).toBe(4);
    expect(canDescend(state)).toBe(false);
    state.promises = { eldra: 2 };
    expect(recognitionTier(state, "eldra")).toBe(5);
    expect(canDescend(state)).toBe(true);
    expect(recognitionNeeds(state, "eldra")).toBeNull();
    expect(codes(state)).toEqual([]);
  });
});

describe("the Promise: the night it shapes", () => {
  it("leaves a companion behind, and passes them over in the order of the road", () => {
    const engine = duskWith("cendre");
    const s = engine.state;
    hire(engine, { maelle: 1, brom: 1, ysolde: 1, cendre: 1, nyx: 1, garrick: 1, seraphine: 1, thorvald: 1, mirelle: 1, kaelen: 1, oriane: 1, vorn: 1, lysandre: 1 });
    expect(hireBarred(s, "ashka")).toBe(true);
    expect(nextRecruit(s)?.id).toBe("nameless");
    engine.drainEvents();
    expect(engine.buyHero("ashka", 1, NOW)).toBe(false);
    expect(events(engine, "promiseHeld")).toEqual([{ type: "promiseHeld", heroId: "cendre" }]);
    expect(engine.buyHero("nameless", 1, NOW)).toBe(true);
    expect(s.heroLevels.ashka).toBeUndefined();
    // The Awakened asks the walker to go on without them.
    const alone = duskWith("awakened");
    expect(hireBarred(alone.state, "awakened")).toBe(true);
    expect(hireBarred(alone.state, "aurelion")).toBe(false);
  });

  it("keeps the company behind its head until the first guardian falls, or the King", () => {
    const engine = duskWith("maelle");
    const s = engine.state;
    hire(engine, { maelle: 200 });
    expect(nextRecruit(s)).toBeUndefined();
    expect(engine.buyHero("brom", 1, NOW)).toBe(false);
    s.maxStage = 10;
    s.stage = 10;
    const now = run(engine, NOW, 10);
    expect(s.maxStage).toBeGreaterThan(10);
    expect(s.trail.promise?.released).toBe(true);
    expect(nextRecruit(s)?.id).toBe("brom");
    expect(engine.buyHero("brom", 1, now)).toBe(true);
    // Released, but the night still has to reach its King.
    expect(promiseHolds(s)).toBe(false);

    const knight = duskWith("kaelen");
    hire(knight, { maelle: 200, brom: 1, ysolde: 1, cendre: 1, nyx: 1, garrick: 1, seraphine: 1, thorvald: 1, mirelle: 1, kaelen: 1 });
    expect(knight.buyHero("oriane", 1, NOW)).toBe(false);
    knight.state.maxStage = 10;
    knight.state.stage = 10;
    run(knight, NOW, 10);
    // A guardian is not the King: nobody past Kaelen yet.
    expect(knight.state.trail.promise?.released).toBeUndefined();
    knight.state.maxStage = 50;
    knight.state.stage = 50;
    run(knight, NOW + 10_000, 20);
    expect(knight.state.trail.promise).toMatchObject({ released: true, kings: 1 });
    expect(promiseHolds(knight.state)).toBe(true);
    expect(knight.buyHero("oriane", 1, NOW + 40_000)).toBe(true);
  });

  it("holds every blow for a moment at the guardian a companion asks to wait for", () => {
    const engine = duskWith("mirelle");
    const s = engine.state;
    hire(engine, { maelle: 60 });
    s.maxStage = 40;
    s.stage = 40;
    let now = NOW;
    while (!s.monster) {
      now += 100;
      engine.tick(now);
    }
    expect(s.monster!.id).toBe("rot-baron");
    const hp = s.monster!.hp;
    now = run(engine, now, 10);
    // Ten seconds in: nobody has struck, and the walker's own strike is held too.
    expect(s.monster!.hp).toBe(hp);
    engine.drainEvents();
    engine.click(now);
    expect(s.monster!.hp).toBe(hp);
    expect(s.run.clicks).toBe(0);
    expect(events(engine, "promiseHeld")).toHaveLength(1);
    now = run(engine, now, 6);
    expect(s.monster === null || s.monster.hp < hp).toBe(true);
    now = run(engine, now, 20);
    expect(s.maxStage).toBeGreaterThan(40);
    expect(s.trail.promise?.waited).toBe(true);
    // Other guardians are fought at once.
    s.maxStage = 30;
    s.stage = 30;
    now = run(engine, now, 3);
    expect(s.maxStage).toBeGreaterThan(30);

    // Aurelion asks the same courtesy for the King.
    const dragon = duskWith("aurelion");
    hire(dragon, { maelle: 120 });
    dragon.state.maxStage = 50;
    dragon.state.stage = 50;
    run(dragon, NOW, 9);
    expect(dragon.state.maxStage).toBe(50);
    run(dragon, NOW + 9_000, 10);
    expect(dragon.state.trail.promise).toMatchObject({ waited: true, kings: 1 });
  });

  it("refuses what the walker promised to leave alone, and says so", () => {
    const refuses = (hero: string, attempt: (engine: GameEngine) => unknown, prepare?: (engine: GameEngine) => void) => {
      const engine = duskWith(hero);
      hire(engine, { aldric: 30, maelle: 60, ysolde: 25 });
      prepare?.(engine);
      engine.drainEvents();
      const snapshot = JSON.stringify({ ...engine.state, lastClickAt: 0 });
      expect(attempt(engine) || false, hero).toBe(false);
      expect(JSON.stringify({ ...engine.state, lastClickAt: 0 }), hero).toBe(snapshot);
      expect(events(engine, "promiseHeld"), hero).toEqual([{ type: "promiseHeld", heroId: hero }]);
      // The word taken back, the walker is free again.
      engine.breakPromise(NOW);
      attempt(engine);
      expect(JSON.stringify({ ...engine.state, lastClickAt: 0 }), hero).not.toBe(snapshot);
    };
    const monster = (engine: GameEngine) => {
      engine.state.monster = { id: "field-rat", hp: 1e30, maxHp: 1e30, kind: "normal", gold: 1 };
    };
    // Ysolde: the sword stays where it is.
    refuses("ysolde", (engine) => engine.click(NOW), monster);
    // Nyx: no power.
    refuses("nyx", (engine) => engine.useSkill("frenzy", NOW));
    // Célestine: the crystals are left to fall.
    refuses("celestine", (engine) => engine.clickCrystal(NOW), (engine) => {
      engine.state.crystal = { id: "c", expiresAt: NOW + 10_000, x: 10, y: 10 };
    });
    // Garrick: not a shard spent, at the stall or the forge.
    const shards = (engine: GameEngine) => {
      engine.state.shards = 500;
      engine.state.lifetime.shardsEarned = 500;
    };
    refuses("garrick", (engine) => engine.buyOffer("rage", NOW), shards);
    refuses("garrick", (engine) => engine.forge("weapon", NOW), shards);
    // The Nameless: nothing offered to the stones.
    refuses("nameless", (engine) => engine.buyAltar("might", NOW));
    // Brom: the weapon stays on his anvil.
    refuses("brom", (engine) => engine.equip(engine.state.inventory[0].uid, NOW), (engine) => {
      engine.state.inventory.push(generateItem(seededRng(9), 300, { slot: "weapon", rarity: "rare" }));
    });
    refuses("brom", (engine) => engine.unequip("weapon", NOW));
  });

  it("counts the weapon for nothing while it stays on Brom's anvil, and halves every seam on Thorvald's bet", () => {
    const armed = engineWith(walker());
    armed.ascend(NOW);
    hire(armed, { maelle: 60 });
    const engine = duskWith("brom");
    hire(engine, { maelle: 60 });
    const bare = structuredClone(engine.state);
    delete bare.equipment.weapon;
    delete bare.trail.promise;
    expect(derive(engine.state, NOW).dps).toBe(derive(bare, NOW).dps);
    expect(derive(engine.state, NOW).dps).toBeLessThan(derive(armed.state, NOW).dps);
    engine.breakPromise(NOW);
    expect(derive(engine.state, NOW).dps).toBe(derive(armed.state, NOW).dps);

    const bet = duskWith("thorvald");
    expect(derive(bet.state, NOW).bossTimer).toBe(BASE_BOSS_TIMER / 2);
    bet.breakPromise(NOW);
    expect(derive(bet.state, NOW).bossTimer).toBe(BASE_BOSS_TIMER);
  });

  it("never walks into a seam it cannot hold the night Eldra asked, and breaks her word if one closes", () => {
    const engine = duskWith("eldra");
    const s = engine.state;
    hire(engine, { maelle: 1 });
    // Far too weak for the Keep's gate: the company stops before it, without a fight.
    s.gold = 0;
    s.essences = 0;
    delete s.equipment.weapon;
    s.maxStage = 44;
    s.stage = 44;
    s.kills = 9;
    let now = NOW;
    while (!s.monster) {
      now += 100;
      engine.tick(now);
    }
    s.monster!.hp = 1;
    now = run(engine, now, 30);
    expect(s.maxStage).toBe(45);
    expect(s.stage).toBe(44);
    expect(s.autoAdvance).toBe(false);
    expect(s.lifetime.bossFails).toBe(0);
    expect(standingPromise(s)).toBeDefined();
    // A night caught up does not try either.
    now += 3600_000;
    engine.tick(now);
    expect(s.maxStage).toBe(45);
    expect(s.lifetime.bossFails).toBe(0);
    expect(standingPromise(s)).toBeDefined();
    // The walker leads the company in anyway: the seam closes, and the word is broken.
    engine.drainEvents();
    engine.travel(45);
    now = run(engine, now, 35);
    expect(s.lifetime.bossFails).toBe(1);
    expect(s.trail.promise?.broken).toBe(true);
    expect(events(engine, "promise")).toContainEqual({ type: "promise", heroId: "eldra", outcome: "broken" });
  });

  it("asks Oriane's night to go deeper than the last, and Lysandre's to see two Kings fall", () => {
    const state = walker();
    state.ascensions = [{ at: T0 + 3600_000, maxStage: 80, essences: 100 }];
    state.maxStage = 70;
    state.stage = 70;
    const engine = duskWith("oriane", state);
    const s = engine.state;
    // The night that just ended reached stage 70: tonight must pass it.
    expect(s.trail.promise).toEqual({ hero: "oriane", kings: 0, goal: 70 });
    hire(engine, { maelle: 300 });
    s.maxStage = 50;
    s.stage = 50;
    let now = run(engine, NOW, 15);
    expect(s.trail.promise!.kings).toBe(1);
    expect(promiseHolds(s)).toBe(false);
    s.maxStage = 70;
    s.stage = 70;
    s.kills = 0;
    engine.drainEvents();
    now = run(engine, now, 20);
    expect(s.maxStage).toBeGreaterThan(70);
    expect(promiseHolds(s)).toBe(true);
    expect(events(engine, "promise")).toContainEqual({ type: "promise", heroId: "oriane", outcome: "ready" });

    const mage = duskWith("lysandre");
    hire(mage, { maelle: 600 });
    mage.state.maxStage = 50;
    mage.state.stage = 50;
    run(mage, NOW, 15);
    expect(mage.state.trail.promise!.kings).toBe(1);
    expect(promiseHolds(mage.state)).toBe(false);
    mage.state.maxStage = 100;
    mage.state.stage = 100;
    run(mage, NOW + 15_000, 15);
    expect(mage.state.trail.promise!.kings).toBe(2);
    expect(promiseHolds(mage.state)).toBe(true);
  });
});

describe("the Promise: without the walker", () => {
  it("lets the company keep every promise alone through a night caught up, the word respected all along", () => {
    for (const promise of PROMISES) {
      const hero = promise.hero;
      const engine = duskWith(hero);
      const s = engine.state;
      expect(s.trail.promise?.hero, hero).toBe(hero);
      // A closed game, opened again eight hours later: the company walked on its own.
      const now = NOW + 8 * 3600_000;
      const summary = engine.tick(now)!;
      expect(summary.stages, hero).toBeGreaterThan(50);
      expect(standingPromise(s), hero).toBeDefined();
      expect(promiseHolds(s), hero).toBe(true);
      expect(verifyState(s, now), hero).toEqual([]);
      if (promise.kind === "without") expect(s.heroLevels[promise.other] ?? 0, hero).toBe(0);
      if (promise.kind === "unfailing") expect(s.lifetime.bossFails, hero).toBe(0);
      if (promise.kind === "abstain") {
        expect(s.run.clicks + s.run.skillsUsed + s.run.crystals + s.trail.offered, hero).toBe(0);
      }
      expect(Object.keys(s.heroLevels).length, hero).toBeGreaterThan(10);
      const reached = (s.heroLevels[hero] ?? 0) >= 100;
      engine.ascend(now);
      expect(promisesKept(s, hero), hero).toBe(1);
      expect(recognitionRuns(s, hero), hero).toBe(HALF + (reached ? 2 : 1));
      expect(verifyState(s, now), hero).toEqual([]);
    }
  }, 120_000);

  it("keeps the company small while away until the guardian falls: the autopilot and the catch-up hire nobody past the head", () => {
    // Ten seconds away (the Rout fells a stage in a quarter of a second), a purse that could
    // pay for everyone: nobody past Kaelen joins before the King.
    const engine = duskWith("kaelen");
    const s = engine.state;
    s.gold = 1e40;
    s.run.goldEarned = 1e40;
    s.lifetime.goldEarned = 1e40;
    let now = NOW + 10_000;
    engine.tick(now);
    expect(s.maxStage).toBeLessThan(50);
    expect(Object.keys(s.heroLevels).filter((id) => id !== "aldric")).toEqual(["maelle", "brom", "ysolde", "cendre", "nyx", "garrick", "seraphine", "thorvald", "mirelle", "kaelen"]);
    expect(s.trail.promise?.released).toBeUndefined();
    expect(verifyState(s, now)).toEqual([]);
    // The King falls while they are still away: the others join after him.
    now += 1800_000;
    engine.tick(now);
    expect(s.trail.promise?.released).toBe(true);
    expect(s.heroLevels.awakened).toBeGreaterThan(0);
    expect(verifyState(s, now)).toEqual([]);

    // An open game left alone: the autopilot respects the word too.
    const open = duskWith("cendre");
    open.afkAfterMs = 60_000;
    open.state.gold = 1e40;
    open.state.run.goldEarned = 1e40;
    open.state.lifetime.goldEarned = 1e40;
    run(open, NOW, 300);
    expect(open.state.heroLevels.ashka ?? 0).toBe(0);
    expect(open.state.heroLevels.nameless).toBeGreaterThan(0);
    expect(standingPromise(open.state)).toBeDefined();
  });

  it("gives the word again after a Descent begun at the same dusk", () => {
    const state = walker();
    state.recognition.eldra = RECOGNITION_TIERS[4];
    state.promises = { eldra: 2 };
    state.lifetime.ascensionEssences = 1e9;
    const engine = duskWith("mirelle", state);
    expect(engine.descend(NOW)).toBeGreaterThan(0);
    expect(engine.state.trail.promise).toEqual({ hero: "mirelle", kings: 0 });
    expect(verifyState(engine.state, NOW)).toEqual([]);
  });
});

describe("the Promise: what a word kept gives", () => {
  it("doubles the companion's damage for good with each word kept, five times at most, then they ask no more", () => {
    const state = walker();
    state.heroLevels = { maelle: 50 };
    state.recognition = { maelle: HALF };
    const base = derive(state, NOW).heroDps.maelle;
    for (let kept = 1; kept <= PROMISE_DOUBLINGS + 1; kept += 1) {
      state.promises = { maelle: kept };
      expect(derive(state, NOW).heroDps.maelle, `${kept}`).toBeCloseTo(base * 2 ** Math.min(kept, PROMISE_DOUBLINGS));
    }
    state.promises = { maelle: PROMISE_DOUBLINGS - 1 };
    expect(promiseAskable(state, "maelle")).toBe(true);
    state.promises = { maelle: PROMISE_DOUBLINGS };
    expect(promiseAskable(state, "maelle")).toBe(false);
    expect(new GameEngine(state, seededRng(1), NOW).pledge("maelle", NOW)).toBe(false);
  });
});

describe("the Promise: the bot's policies", () => {
  it("gives its word to the strongest companion who can ask tonight", () => {
    const state = engineWith(walker()).state;
    // The bot gives its word at dusk, for the night that begins.
    new GameEngine(state, seededRng(1), NOW).ascend(NOW);
    expect(reasonablePromise(state)).toBe("awakened");
    // The Awakened had last night's word: tonight's goes to the next strongest.
    state.lastPromise = "awakened";
    expect(reasonablePromise(state)).toBe("aurelion");
    // Aurelion has had his five words: he asks no more.
    state.promises = { aurelion: PROMISE_DOUBLINGS };
    expect(reasonablePromise(state)).toBe("celestine");
    expect(reasonablePromise(createInitialState(T0))).toBeNull();
  });

  it("keeps a walker who strikes from promising the sword or the powers away", () => {
    const state = walker();
    new GameEngine(state, seededRng(1), NOW).ascend(NOW);
    // Only the first three companions still have a word to ask.
    state.promises = Object.fromEntries(RECOGNITION_HEROES.filter((hero) => !["maelle", "brom", "ysolde"].includes(hero)).map((hero) => [hero, PROMISE_DOUBLINGS]));
    expect(promisesAvoided({ clicksPerSecond: 5 })).toEqual(["strikes", "powers"]);
    expect(promisesAvoided({ clicksPerSecond: 5, burst: { everySeconds: 120, seconds: 10 } })).toEqual(["strikes", "powers"]);
    expect(promisesAvoided({ clicksPerSecond: 5, idleFromStage: 20 })).toEqual([]);
    // Ysolde asks a walker who lets the company walk, not one who strikes.
    expect(reasonablePromise(state, [])).toBe("ysolde");
    expect(reasonablePromise(state, ["strikes", "powers"])).toBe("brom");
  });

  it("plays honest nights with promises, saved regularly, and the Ledger accepts them", () => {
    // A few essences only: the nights are short, and several dusks fit in the test.
    const start = walker();
    start.essences = 300;
    delete start.equipment.weapon;
    const engine = engineWith(start, seededRng(11));
    let now = NOW;
    let previous = structuredClone(engine.state);
    let previousAt = now;
    const given = new Set<string>();
    for (let save = 0; save < 12; save += 1) {
      now = playBot(engine, now, 10 * 60, { clicksPerSecond: 5, stagnationMs: 90_000 });
      if (engine.state.trail.promise) given.add(engine.state.trail.promise.hero);
      const snapshot = structuredClone(engine.state);
      expect(verifyState(snapshot, now)).toEqual([]);
      expect(verifyTransition(previous, snapshot, now - previousAt)).toEqual([]);
      previous = snapshot;
      previousAt = now;
    }
    // Each in turn: Maëlle, Brom, Ysolde...
    expect(given.size).toBeGreaterThan(1);
    expect(Object.values(engine.state.promises).reduce((total, count) => total + count, 0)).toBeGreaterThan(1);
  }, 120_000);
});

describe("the Promise: what the Ledger refuses", () => {
  it("refuses promises the nights cannot hold", () => {
    const many = walker();
    many.promises = { maelle: 30, brom: 11 };
    expect(codes(many)).toContain("promise");
    const unknown = walker();
    unknown.promises = { aldric: 1 };
    expect(codes(unknown)).toContain("promise");
    const pledge = walker();
    pledge.pledge = "constructor";
    expect(codes(pledge)).toContain("promise");
    // A fresh walker has met nobody and walked no dusk.
    const early = createInitialState(T0);
    early.trail.promise = { hero: "maelle", kings: 0 };
    expect(codes(early, T0 + 3600_000)).toContain("promise");
    // Kings the night never saw fall.
    const kings = duskWith("nyx").state;
    kings.trail.promise!.kings = 1;
    expect(codes(kings)).toContain("promise");
    const stranger = duskWith("nyx").state;
    stranger.trail.promise!.hero = "pip";
    expect(codes(stranger)).toContain("promise");
  });

  it("refuses a word that stands while what it forbids was done", () => {
    const left = duskWith("cendre");
    hire(left, { maelle: 1 });
    left.state.heroLevels.ashka = 1;
    left.state.lifetime.bestLevelSum = 10_000;
    expect(codes(left.state)).toContain("promise");
    left.state.trail.promise!.broken = true;
    expect(codes(left.state)).not.toContain("promise");

    const silent = duskWith("nyx").state;
    silent.run.skillsUsed = 1;
    silent.lifetime.skillsUsed = 1;
    expect(codes(silent)).toContain("promise");
    const sheathed = duskWith("ysolde").state;
    sheathed.run.clicks = 5;
    sheathed.lifetime.clicks = 5;
    expect(codes(sheathed)).toContain("promise");
    const crowded = duskWith("maelle");
    hire(crowded, { maelle: 1 });
    crowded.state.heroLevels.brom = 1;
    expect(codes(crowded.state)).toContain("promise");
    const waited = duskWith("maelle").state;
    waited.trail.promise!.waited = true;
    expect(codes(waited)).toContain("promise");
  });

  it("refuses a word swapped or mended during the night, and promises kept faster than the nights", () => {
    const engine = duskWith("cendre");
    const previous = structuredClone(engine.state);
    const swapped = structuredClone(previous);
    swapped.trail.promise = { hero: "eldra", kings: 0 };
    expect(verifyTransition(previous, swapped, 60_000).map((violation) => violation.code)).toContain("promise");
    const dropped = structuredClone(previous);
    delete dropped.trail.promise;
    expect(verifyTransition(previous, dropped, 60_000).map((violation) => violation.code)).toContain("promise");
    const broken = structuredClone(previous);
    broken.trail.promise!.broken = true;
    expect(verifyTransition(previous, broken, 60_000)).toEqual([]);
    expect(verifyTransition(broken, previous, 60_000).map((violation) => violation.code)).toContain("promise");

    const kept = structuredClone(previous);
    kept.promises = { cendre: 1 };
    expect(verifyTransition(previous, kept, 60_000).map((violation) => violation.code)).toContain("promise");
    const remembered = structuredClone(previous);
    remembered.recognition.cendre = HALF + 2;
    expect(verifyTransition(previous, remembered, 60_000).map((violation) => violation.code)).toContain("recognition");
    const forgotten = structuredClone(previous);
    forgotten.promises = { cendre: 1 };
    expect(verifyTransition(forgotten, previous, 60_000).map((violation) => violation.code)).toContain("rollback");

    // The same companion two nights running, or last night's word rewritten at dusk.
    const twice = structuredClone(previous);
    twice.lastPromise = "cendre";
    expect(codes(twice)).toContain("promise");
    const after = structuredClone(previous);
    delete after.trail.promise;
    after.lifetime.ascensions += 1;
    after.lastPromise = "cendre";
    expect(verifyTransition(previous, after, 60_000).map((violation) => violation.code)).not.toContain("promise");
    after.lastPromise = "maelle";
    expect(verifyTransition(previous, after, 60_000).map((violation) => violation.code)).toContain("promise");
  });
});

describe("save version 10", () => {
  it("loads a version 9 save, verifies it and plays on", () => {
    const engine = new GameEngine(createInitialState(T0), seededRng(10), T0);
    const now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5, promises: false });
    const legacy = JSON.parse(JSON.stringify(engine.state)) as Record<string, unknown>;
    legacy.version = 9;
    delete legacy.promises;
    delete legacy.remembered;
    const migrated = parseState(legacy);
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.promises).toEqual({});
    expect(migrated.remembered).toEqual({});
    expect(verifyState(migrated, now)).toEqual([]);
    const next = new GameEngine(migrated, undefined, now);
    const later = playBot(next, now, 5 * 60, { clicksPerSecond: 5 });
    expect(verifyState(next.state, later)).toEqual([]);
    expect(verifyTransition(parseState(legacy), next.state, later - now)).toEqual([]);
  }, 60_000);

  it("keeps what companions already remembered: their fourth and fifth memories ask nothing again", () => {
    const old = rested();
    old.recognition = { eldra: 30, maelle: 20, brom: 14, kaelen: 29 };
    old.descents = 1;
    old.lore.readings = [0];
    const legacy = JSON.parse(JSON.stringify(old)) as Record<string, unknown>;
    legacy.version = 9;
    delete legacy.promises;
    delete legacy.remembered;
    const migrated = parseState(legacy);
    expect(migrated.remembered).toEqual({ eldra: 5, maelle: 4, kaelen: 4 });
    expect(recognitionTier(migrated, "eldra")).toBe(5);
    expect(recognitionTier(migrated, "maelle")).toBe(4);
    expect(recognitionTier(migrated, "brom")).toBe(3);
    expect(canDescend(migrated)).toBe(true);
    expect(verifyState(migrated, NOW)).toEqual([]);
    // Maëlle held her fourth memory: the fifth asks one word kept, not two.
    expect(recognitionNeeds(migrated, "maelle")).toEqual({ runs: RECOGNITION_TIERS[4] - 20, promises: 1 });
    migrated.recognition.maelle = RECOGNITION_TIERS[4];
    expect(recognitionTier(migrated, "maelle")).toBe(4);
    migrated.promises = { maelle: 1 };
    expect(recognitionTier(migrated, "maelle")).toBe(5);
    // Brom, one run short of his fourth, needs his word like anyone.
    migrated.recognition.brom = 15;
    expect(recognitionTier(migrated, "brom")).toBe(3);
    // Eldra's fifth memory came at thirty runs then: it stays, though it asks thirty-two now.
    expect(RECOGNITION_TIERS[4]).toBeGreaterThan(30);
    // With the Kinship weave, the memories came a run sooner.
    const kin = JSON.parse(JSON.stringify(old)) as Record<string, unknown>;
    kin.version = 9;
    kin.weaves = { kinship: 1 };
    (kin.recognition as Record<string, number>).brom = 14;
    expect(parseState(kin).remembered).toMatchObject({ brom: 4, kaelen: 5 });
  });

  it("refuses memories older than promises that the runs never earned, or that change afterwards", () => {
    const forged = rested();
    forged.recognition = { eldra: 10 };
    forged.remembered = { eldra: 5 };
    expect(codes(forged)).toContain("recognition");
    const previous = rested();
    previous.recognition = { eldra: 30 };
    const next = structuredClone(previous);
    next.remembered = { eldra: 5 };
    expect(codes(next)).toEqual([]);
    expect(verifyTransition(previous, next, 60_000).map((violation) => violation.code)).toContain("recognition");
  });
});
