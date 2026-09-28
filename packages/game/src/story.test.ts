import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { chronicleCount, chronicleEntries, milestoneReached, sourceCount, unreadChronicle } from "./chronicle";
import { chronicleText, gameText, kingWord, monsterName, regaliaWord } from "./content";
import { KING_FORMS, guardianForStage } from "./data/biomes";
import { CARAVAN_WARES, caravanWare, isoWeek } from "./data/caravan";
import { WEAVES, threadsFor, weaveCost } from "./data/descent";
import { ECLIPSE_EVERY, ECLIPSE_HP, EVENTS, SEAM_SECONDS, WAGER_CLICKS } from "./data/events";
import {
  AGE_ECHOES,
  BESTIARY,
  BESTIARY_PAGES,
  DREAM_MIN_SECONDS,
  RECOGNITION_HEROES,
  RECOGNITION_TIERS,
  SECRETS,
  WANDERERS,
  recognitionTier
} from "./data/lore";
import { NAMED_RELICS } from "./data/relics";
import { ERA_COUNT, MILESTONES, keystonesFound } from "./data/strata";
import { GameEngine, canDescend, descentPreview } from "./engine";
import { bossHp, derive, skillCooldownMultiplier, stageHp, wandererSkip } from "./formulas";
import { LOCALES } from "./i18n";
import { generateItem } from "./loot";
import { seededRng, type Rng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState, emptyTrail } from "./state";
import type { GameEvent, GameState } from "./types";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 2, 1);
const LATER = T0 + 900 * 3600_000;

function scripted(rolls: number[], rest = 0.5): Rng {
  const queue = [...rolls];
  return () => (queue.length > 0 ? queue.shift()! : rest);
}

function engineWith(state: GameState, rng: Rng = seededRng(1), now = T0) {
  return new GameEngine(state, rng, now);
}

function slay(engine: GameEngine, now: number) {
  engine.state.monster!.hp = 1e-9;
  engine.click(now);
}

function respawn(engine: GameEngine, now: number): number {
  let at = now;
  while (!engine.state.monster) {
    at += 100;
    engine.tick(at);
  }
  return at;
}

function drained(engine: GameEngine, type: GameEvent["type"]) {
  return engine.drainEvents().filter((event) => event.type === type);
}

const codes = (state: GameState, now = LATER) => verifyState(state, now).map((violation) => violation.code);

/** A long-lived save whose ledgers hold the counters set by hand. */
function veteran(): GameState {
  const state = createInitialState(T0);
  state.lifetime.playTime = 800 * 3600;
  state.lifetime.kills = 5_000_000;
  state.lifetime.bosses = 200_000;
  state.lifetime.kings = 5_000;
  state.lifetime.ascensions = 80;
  state.lifetime.crystals = 2_000;
  state.lifetime.offlineSeconds = 50 * 3600;
  state.lifetime.bestHired = 21;
  state.maxStageEver = 1_200;
  return state;
}

describe("the strata and the King's forms", () => {
  it("names all sixty strata, and the King changes form with each Age", () => {
    for (const locale of LOCALES) {
      const text = gameText(locale);
      expect(text.strata.tags).toHaveLength(ERA_COUNT);
      expect(text.strata.tags[0]).toBe("");
      expect(text.strata.ages).toHaveLength(12);
      expect(text.strata.keystones).toHaveLength(ERA_COUNT);
      for (const id of MILESTONES) expect(text.strata.milestones[id]?.text, `${locale} ${id}`).toBeTruthy();
    }
    expect(monsterName({ id: "field-rat", kind: "normal" }, 51, "fr")).toBe("Écho · Rat des champs");
    expect(monsterName({ id: "field-rat", kind: "normal" }, 301, "en")).toMatch(/^Titan · /);
    expect(guardianForStage(50).id).toBe("ruined-king");
    expect(guardianForStage(300).id).toBe("titan-king");
    expect(guardianForStage(2950).id).toBe("aldemar");
    expect(guardianForStage(3000).id).toBe("the-dawn");
    expect(guardianForStage(40).id).toBe("rot-baron");
    expect(new Set(KING_FORMS).size).toBe(12);
  });

  it("finds a stratum's keystone and an Age echo on the King's first fall, and counts the Kings", () => {
    const state = createInitialState(T0);
    state.stage = 50;
    state.maxStage = 50;
    state.maxStageEver = 50;
    const engine = engineWith(state);
    const now = respawn(engine, T0);
    expect(engine.state.monster!.id).toBe("ruined-king");
    slay(engine, now);
    const fragments = drained(engine, "fragment").map((event) => (event as { entry: unknown }).entry);
    expect(fragments).toContainEqual({ source: "keystone", era: 0 });
    expect(fragments).toContainEqual({ source: "age", age: 0, index: 0 });
    expect(engine.state.lifetime.kings).toBe(1);
    expect(keystonesFound(engine.state.maxStageEver)).toBe(1);
    expect(chronicleText({ source: "keystone", era: 0 }, "en").text).toBe("He looked at you as if you were late.");
  });
});

describe("the King's Words", () => {
  it("gives one Word a night, in order, then the grammar, and every seventh night a word of his Eclipse", () => {
    for (const locale of LOCALES) {
      const words = gameText(locale).voices.kingWords;
      expect(words).toHaveLength(50);
      expect(kingWord(1, locale)).toBe(words[0]);
      expect(kingWord(50, locale)).toBe(words[49]);
      expect(kingWord(7, locale)).toBe(gameText(locale).voices.eclipseWords[0]);
      expect(kingWord(51, locale).length).toBeGreaterThan(3);
      expect(kingWord(52, locale)).not.toBe(kingWord(53, locale));
      expect(regaliaWord(13, locale)).toBe(gameText(locale).voices.regaliaWords[0]);
    }
    const state = createInitialState(T0);
    state.maxStage = 60;
    state.maxStageEver = 60;
    const engine = engineWith(state);
    engine.ascend(T0);
    const events = engine.drainEvents();
    expect(events).toContainEqual({ type: "kingWord", night: 1 });
    expect(events).toContainEqual({ type: "fragment", entry: { source: "king", night: 1 } });
    expect(events).toContainEqual({ type: "fragment", entry: { source: "milestone", id: "ascend-1" } });
  });

  it("shadows the King after every seventh dusk: heavier, and he always leaves a relic", () => {
    const state = veteran();
    state.lifetime.ascensions = ECLIPSE_EVERY - 1;
    state.maxStage = 60;
    const engine = engineWith(state);
    engine.ascend(T0);
    expect(engine.state.trail.eclipse).toBe(true);
    engine.state.stage = 50;
    engine.state.maxStage = 50;
    const now = respawn(engine, T0);
    const king = engine.state.monster!;
    expect(king.eclipse).toBe(true);
    expect(king.maxHp).toBeCloseTo(bossHp(50) * ECLIPSE_HP);
    const items = engine.state.lifetime.itemsFound;
    slay(engine, now);
    expect(engine.state.lifetime.itemsFound).toBe(items + 1);
    expect(engine.state.trail.eclipse).toBe(false);
  });
});

describe("the Chronicle", () => {
  it("has every written line in both languages, short, without em dash, emoji or a forbidden word before the Edge of Sleep", () => {
    const FORBIDDEN = /\b(dream|dreamer|dreamed|player|screen|tab|click|save|rêve|rêveur|rêvé|joueur|écran|onglet|clic|sauvegarde)\b/i;
    for (const locale of LOCALES) {
      const text = gameText(locale);
      const check = (line: string, max: number, where: string, deep = false) => {
        expect(line.length, `${locale} ${where}`).toBeGreaterThan(2);
        expect(line.length, `${locale} ${where}: ${line}`).toBeLessThanOrEqual(max);
        expect(line, `${locale} ${where}`).not.toMatch(/[—–]/);
        expect(line, `${locale} ${where}`).not.toMatch(/\p{Extended_Pictographic}/u);
        if (!deep) expect(line, `${locale} ${where}`).not.toMatch(FORBIDDEN);
      };
      text.strata.keystones.forEach((line, era) => check(line.text, 140, `keystone ${era}`, era >= 35));
      for (const id of MILESTONES) check(text.strata.milestones[id].text, 140, `milestone ${id}`);
      for (const [name, pool] of Object.entries(text.voices)) (pool as readonly string[]).forEach((line, index) => check(line, 140, `${name} ${index}`));
      text.ageEchoes.forEach((pool, age) => {
        expect(pool, `${locale} age ${age}`).toHaveLength(AGE_ECHOES);
        pool.forEach((line, index) => check(line.text, 140, `age ${age} ${index}`, age >= 7));
      });
      for (const [biome, pool] of Object.entries(text.echoes)) {
        expect(pool, `${locale} echoes ${biome}`).toHaveLength(12);
        pool.forEach((line, index) => check(line.text, 140, `echo ${biome} ${index}`));
      }
      const deepKings = new Set(KING_FORMS.slice(7));
      for (const entry of BESTIARY) {
        expect(text.bestiary[entry.id], `${locale} bestiary ${entry.id}`).toHaveLength(3);
        expect(text.monsters[entry.id], `${locale} name ${entry.id}`).toBeTruthy();
        text.bestiary[entry.id].forEach((line, tier) => check(line, 120, `bestiary ${entry.id} ${tier}`, deepKings.has(entry.id)));
      }
      for (const page of BESTIARY_PAGES) expect(text.bestiaryPages[page]).toBeTruthy();
      for (const wanderer of WANDERERS) check(text.wanderers[wanderer.id].text, 140, `wanderer ${wanderer.id}`);
      for (const hero of RECOGNITION_HEROES) {
        expect(text.memories[hero], `${locale} memories ${hero}`).toHaveLength(5);
        expect(text.hireLines[hero], `${locale} hire ${hero}`).toHaveLength(3);
        text.memories[hero].forEach((line, tier) => check(line.text, 180, `memory ${hero} ${tier}`));
        text.hireLines[hero].forEach((line, tier) => check(line, 140, `hire ${hero} ${tier}`));
      }
      for (const [id, lesson] of Object.entries(text.lessons)) check(lesson.text, 180, `lesson ${id}`);
      for (const relic of NAMED_RELICS) {
        expect(text.relics[relic.id]?.name, `${locale} relic ${relic.id}`).toBeTruthy();
        check(text.relics[relic.id].legend, 200, `relic ${relic.id}`);
        expect(text.namedEffects[relic.effect.kind](relic.effect.pct).length).toBeGreaterThan(3);
      }
      for (const [id, legend] of Object.entries(text.altarLegends)) check(legend.text, 200, `altar ${id}`);
      for (const secret of SECRETS) {
        check(text.secrets[secret.id].line.text, 140, `secret ${secret.id}`);
        check(text.secrets[secret.id].riddle, 140, `riddle ${secret.id}`);
      }
      for (const id of EVENTS) {
        check(text.events[id].text, 90, `event ${id}`);
        check(text.events[id].line.text, 140, `event line ${id}`);
      }
      for (const weave of WEAVES) expect(text.weaves[weave.id]?.name).toBeTruthy();
      for (const ware of CARAVAN_WARES) expect(text.caravan[ware.id]?.name).toBeTruthy();
      check(text.crown.legend.text, 140, "crown");
      check(text.openingLine, 140, "opening");
    }
  });

  it("derives every entry from counters, reads per source, and counts fragments for the deeds", () => {
    const state = veteran();
    state.maxStageEver = 260;
    state.lore.echoes["green-plains"] = 14;
    state.lore.ages["0"] = 9;
    state.lore.songs = 31;
    state.lore.dreams = 25;
    state.lore.sayings = 20;
    state.lore.lessons = ["aldric-10"];
    state.lore.altars = ["might"];
    state.lore.events = ["seam"];
    const entries = chronicleEntries(state);
    expect(entries.length).toBe(chronicleCount(state));
    expect(sourceCount(state, "keystone")).toBe(5);
    expect(sourceCount(state, "king")).toBe(80);
    expect(sourceCount(state, "saying")).toBe(12);
    // Past the written pools, the grammar speaks.
    for (const locale of LOCALES) {
      for (const entry of entries) {
        const line = chronicleText(entry, locale);
        expect(line.text.length, `${locale} ${JSON.stringify(entry)}`).toBeGreaterThan(2);
      }
    }
    expect(unreadChronicle(state)).toBe(entries.length);
    state.lore.seen.king = 80;
    expect(unreadChronicle(state)).toBe(entries.length - 80);
  });

  it("brings what stays after an absence of an hour, and a crystal soon after a very long one", () => {
    const engine = engineWith(createInitialState(T0));
    engine.setVisible(false, T0);
    const summary = engine.tick(T0 + 5 * 3600_000);
    expect(summary).not.toBeNull();
    expect(engine.state.lore.dreams).toBe(0);
    engine.setVisible(true, T0 + 5 * 3600_000);
    expect(engine.state.lore.dreams).toBe(1);
    expect(engine.state.lore.events).toContain("tide");
    expect(engine.state.nextCrystalAt).toBeLessThanOrEqual(T0 + 5 * 3600_000 + 20_000);
    const short = engineWith(createInitialState(T0));
    short.tick(T0 + (DREAM_MIN_SECONDS - 60) * 1000);
    expect(short.state.lore.dreams).toBe(0);
  });

  it("records a Lesson the first time each of Aldric's talents is bought, and an altar's legend at level 5", () => {
    const state = createInitialState(T0);
    state.gold = 1e9;
    state.heroLevels = { aldric: 10 };
    state.lifetime.bestLevelSum = 10;
    state.lifetime.bestHired = 1;
    state.run.goldEarned = 1e9;
    state.lifetime.goldEarned = 1e9;
    state.essences = 1_000;
    state.lifetime.essencesEarned = 1_000;
    const engine = engineWith(state);
    engine.buyUpgrade("aldric-10", T0);
    expect(engine.state.lore.lessons).toEqual(["aldric-10"]);
    for (let level = 0; level < 5; level += 1) engine.buyAltar("might", T0);
    expect(engine.state.lore.altars).toEqual(["might"]);
    expect(chronicleText({ source: "altar", id: "might" }, "en").text).toMatch(/fists/);
  });
});

describe("a guardian's wounds", () => {
  it("keeps the wounds of a failed fight at stage 30, up to three quarters, and never at the Keep's gate or on the King", () => {
    const state = veteran();
    state.stage = 30;
    state.maxStage = 30;
    state.lifetime.bossFails = 5;
    const engine = engineWith(state);
    let now = respawn(engine, T0);
    const guardian = engine.state.monster!;
    guardian.hp = guardian.maxHp * 0.6;
    while (engine.state.monster) {
      now += 500;
      engine.state.monster.hp = Math.min(engine.state.monster.hp, guardian.maxHp * 0.6);
      engine.tick(now);
    }
    expect(engine.state.trail.wound).toEqual({ stage: 30, share: expect.closeTo(0.4, 5) });
    expect(verifyState(engine.state, LATER)).toEqual([]);
    engine.state.stage = 30;
    engine.state.monster = null;
    now = respawn(engine, now);
    expect(engine.state.monster!.hp).toBeCloseTo(engine.state.monster!.maxHp * 0.6);
    slay(engine, now);
    expect(engine.state.trail.wound).toBeUndefined();
    const forged = veteran();
    forged.maxStage = 45;
    forged.stage = 44;
    forged.lifetime.bossFails = 3;
    forged.trail.wound = { stage: 45, share: 0.5 };
    expect(codes(forged)).toContain("trail");
    const greedy = veteran();
    greedy.maxStage = 30;
    greedy.stage = 29;
    greedy.lifetime.bossFails = 3;
    greedy.trail.wound = { stage: 30, share: 0.9 };
    expect(codes(greedy)).toContain("trail");
  });
});

describe("events of the Long Night", () => {
  it("opens a Seam on a normal stage: its Warden, twenty seconds, an Age echo when closed", () => {
    const state = veteran();
    state.stage = 61;
    state.maxStage = 61;
    // Normal spawn: the creature, the treasure roll, the wanderer roll, then the event roll.
    const engine = engineWith(state, scripted([0, 0.9, 0.9, 0.0001]));
    const now = respawn(engine, T0);
    const warden = engine.state.monster!;
    expect(warden).toMatchObject({ id: "seam-warden", event: "seam" });
    expect(engine.state.bossTimeLeft).toBe(SEAM_SECONDS);
    expect(warden.maxHp).toBeCloseTo(stageHp(61) * 6);
    slay(engine, now);
    expect(engine.state.lifetime.seams).toBe(1);
    expect(engine.state.lore.ages["0"]).toBe(1);
    expect(engine.state.lore.events).toContain("seam");
  });

  it("lets a Seam slip away without a cost when its time runs out", () => {
    const state = veteran();
    state.stage = 61;
    state.maxStage = 61;
    const engine = engineWith(state, scripted([0, 0.9, 0.9, 0.0001]));
    let now = respawn(engine, T0);
    const fails = engine.state.lifetime.bossFails;
    for (let step = 0; step < 220 && engine.state.monster?.event; step += 1) {
      now += 100;
      engine.state.monster.hp = engine.state.monster.maxHp;
      engine.tick(now);
    }
    expect(engine.state.monster?.event).toBeUndefined();
    expect(engine.state.stage).toBe(61);
    expect(engine.state.lifetime.bossFails).toBe(fails);
  });

  it("lets Pip dare the walker: thirteen strikes in five seconds pay thirty times, a miss and he runs", () => {
    const state = createInitialState(T0);
    state.stage = 5;
    state.maxStage = 6;
    state.stage = 6;
    // Normal spawn: the creature, then the treasure roll (yes), then the wager roll (yes).
    const engine = engineWith(state, scripted([0, 0, 0]));
    let now = respawn(engine, T0);
    expect(engine.state.monster).toMatchObject({ kind: "treasure" });
    expect(engine.state.monster!.wager).toBeDefined();
    const carried = engine.state.monster!.gold;
    const gold = engine.state.gold;
    for (let strike = 0; strike < WAGER_CLICKS; strike += 1) {
      now += 50;
      engine.click(now);
    }
    expect(engine.state.monster).toBeNull();
    expect(engine.state.gold - gold).toBeCloseTo(carried * 3 * engine.derived.goldMultiplier);
    expect(engine.state.lifetime.treasures).toBe(1);
    const missed = engineWith(createInitialState(T0), scripted([0, 0, 0]));
    missed.state.stage = 6;
    missed.state.maxStage = 6;
    let at = respawn(missed, T0);
    at += 6_000;
    missed.tick(at);
    expect(missed.state.lifetime.treasures).toBe(0);
  });

  it("brings the Caravan once a week, the same ware for everyone, and the Token only once", () => {
    expect(isoWeek(Date.UTC(2026, 0, 1))).toBe("2026-W01");
    expect(isoWeek(Date.UTC(2026, 8, 28))).toBe("2026-W40");
    expect(caravanWare("2026-W40")).toEqual(caravanWare("2026-W40"));
    const tokenWeek = Array.from({ length: 200 }, (_, index) => T0 + index * 7 * 86_400_000).find((time) => caravanWare(isoWeek(time)).id === "token")!;
    const state = veteran();
    state.shards = 10_000;
    state.lifetime.shardsEarned = 10_000;
    const engine = engineWith(state, seededRng(2), tokenWeek);
    expect(engine.caravanOpen(tokenWeek)).toBe(true);
    expect(engine.buyCaravan(tokenWeek)).toBe(true);
    expect(engine.state.named).toContain("stallkeeper-band");
    expect(engine.caravanOpen(tokenWeek)).toBe(false);
    expect(engine.buyCaravan(tokenWeek + 60_000)).toBe(false);
    expect(verifyState(engine.state, LATER)).toEqual([]);
  });

  it("walks the Stray Armor across the road once the Nameless is hired, and leaves the Hollow Plate", () => {
    const state = veteran();
    state.stage = 61;
    state.maxStage = 61;
    state.heroLevels = { nameless: 1 };
    state.lifetime.bestLevelSum = 1;
    state.run.goldEarned = 1e13;
    state.lifetime.goldEarned = 1e13;
    const engine = engineWith(state, scripted([0, 0.9, 0.9, 1 / 400 + 1 / 1_000 + 0.0001]));
    const now = respawn(engine, T0);
    expect(engine.state.monster).toMatchObject({ id: "stray-armor", event: "stray" });
    slay(engine, now);
    expect(engine.state.named).toContain("hollow-plate");
    expect(verifyState(engine.state, LATER)).toEqual([]);
  });
});

describe("secrets", () => {
  it("finds twenty secrets, each a deed with no bonus, each refused without its conditions", () => {
    expect(SECRETS).toHaveLength(20);
    for (const secret of SECRETS) {
      const state = createInitialState(T0);
      state.secrets = [secret.id];
      expect(codes(state, T0 + 3600_000), secret.id).toContain("secret");
    }
  });

  it("lets the King rest: his timer run out three times at stage 50, untouched", () => {
    const state = veteran();
    state.stage = 50;
    state.maxStage = 50;
    state.lifetime.bossFails = 10;
    const engine = engineWith(state);
    let now = T0;
    for (let night = 0; night < 3; night += 1) {
      engine.state.stage = 50;
      engine.state.monster = null;
      now = respawn(engine, now);
      while (engine.state.monster) {
        now += 500;
        engine.tick(now);
      }
    }
    expect(engine.state.secrets).toContain("let-him-rest");
  });

  it("breaks a star for coins, and finds the Faceless with seven touches", () => {
    const state = veteran();
    const mythic = generateItem(seededRng(1), 100, { rarity: "mythic" });
    state.inventory = [mythic];
    state.lifetime.itemsFound = 1;
    state.lifetime.mythics = 1;
    state.heroLevels = { nyx: 1 };
    const engine = engineWith(state);
    engine.salvage(mythic.uid);
    expect(engine.state.secrets).toContain("small-change");
    for (let touch = 0; touch < 7; touch += 1) engine.touchPortrait("nyx", T0 + touch * 300);
    expect(engine.state.secrets).toContain("faceless");
  });
});

describe("the Descent", () => {
  /** A walker Eldra fully remembers, deep enough, with essences to weave. */
  function atTheLoom(): GameState {
    const state = veteran();
    state.recognition = { eldra: RECOGNITION_TIERS[4] };
    state.maxStage = 1_200;
    state.stage = 1_200;
    state.lifetime.essencesEarned = 1e9;
    state.essences = 5e8;
    state.altars = { might: 20, wanderer: 4 };
    return state;
  }

  it("opens only at stage 1000 with Eldra remembering, and weaves threads from the essences gathered", () => {
    expect(threadsFor(1e5)).toBe(0);
    expect(threadsFor(1e9)).toBe(8);
    expect(threadsFor(1e15)).toBe(20);
    const shallow = atTheLoom();
    shallow.maxStageEver = 900;
    expect(canDescend(shallow)).toBe(false);
    const stranger = atTheLoom();
    stranger.recognition = {};
    expect(canDescend(stranger)).toBe(false);
    const state = atTheLoom();
    expect(recognitionTier(state, "eldra")).toBe(5);
    expect(descentPreview(state)).toBe(8);
    const engine = engineWith(state);
    expect(engine.descend(T0)).toBe(8);
    const s = engine.state;
    expect(s.descents).toBe(1);
    expect(s.threads).toBe(8);
    expect(s.essences).toBe(0);
    expect(s.altars).toEqual({});
    expect(s.maxStage).toBe(1);
    expect(s.maxStageEver).toBe(1_200);
    expect(s.descentMark).toBe(1e9);
    expect(descentPreview(s)).toBe(0);
    expect(milestoneReached(s, "descent-1")).toBe(true);
    expect(verifyState(s, LATER)).toEqual([]);
  });

  it("buys Weaves: the Warp of Plenty, the Knot of Dusk, the Seventh Night and its Unweave", () => {
    const engine = engineWith(atTheLoom());
    engine.descend(T0);
    const s = engine.state;
    s.threads = 60;
    s.lifetime.threads = 68;
    s.lifetime.essencesEarned = 1e40;
    const before = derive(s, T0).essenceMultiplier;
    expect(engine.buyWeave("plenty", T0)).toBe(true);
    expect(derive(s, T0).essenceMultiplier).toBeCloseTo(before * 1.25);
    expect(engine.buyWeave("seventh-night", T0)).toBe(true);
    expect(engine.buyWeave("seventh-night", T0)).toBe(false);
    s.stage = 3;
    s.maxStage = 3;
    expect(engine.useSkill("unweave", T0)).toBe(true);
    expect(s.maxStage).toBe(4);
    expect(weaveCost("kinship", 3)).toBe(Number.POSITIVE_INFINITY);
    expect(verifyState(s, LATER)).toEqual([]);
  });

  it("accepts several Descents played honestly and saved regularly", () => {
    const start = atTheLoom();
    start.lifetime.goldEarned = 1e30;
    start.run.goldEarned = 0;
    let now = T0 + 900 * 3600_000;
    start.lastTickAt = now;
    const engine = engineWith(start, seededRng(21), now);
    let previous = structuredClone(engine.state);
    let previousAt = now;
    const save = () => {
      const snapshot = structuredClone(engine.state);
      expect(verifyState(snapshot, now)).toEqual([]);
      expect(verifyTransition(previous, snapshot, now - previousAt)).toEqual([]);
      previous = snapshot;
      previousAt = now;
    };
    for (let night = 0; night < 3; night += 1) {
      now = playBot(engine, now, 20 * 60, { clicksPerSecond: 5 });
      save();
      engine.descend(now);
      for (const weave of WEAVES) while (engine.buyWeave(weave.id, now));
      now += 60_000;
      save();
    }
    expect(engine.state.descents).toBe(3);
    expect(engine.state.lore.readings).toHaveLength(3);
  }, 120_000);

  it("refuses threads, Weaves and Descents the walker never earned", () => {
    const forged = atTheLoom();
    forged.descents = 1;
    forged.threads = 500;
    forged.lifetime.threads = 500;
    expect(codes(forged)).toContain("descent");
    const unknown = atTheLoom();
    unknown.weaves = { excalibur: 1 } as GameState["weaves"];
    expect(codes(unknown)).toContain("descent");
    const early = veteran();
    early.maxStageEver = 400;
    early.descents = 1;
    expect(codes(early)).toContain("descent");
  });
});

describe("named relics", () => {
  it("names all twenty-four, each with a source the anti-cheat can check", () => {
    expect(NAMED_RELICS).toHaveLength(24);
    const state = veteran();
    state.named = ["oathcutter"];
    state.maxStageEver = 40;
    expect(codes(state)).toContain("named");
  });

  it("lets their unique effects work within the caps", () => {
    const state = veteran();
    state.named = ["eldra-locket", "second-morning", "oathcutter"];
    state.recognition = { eldra: 30 };
    state.altars = { echoes: 10, wanderer: 10 };
    const locket = { ...generateItem(seededRng(2), 100, { slot: "amulet", rarity: "mythic" }), named: "eldra-locket" };
    const ring = { ...generateItem(seededRng(3), 100, { slot: "ring", rarity: "mythic" }), named: "second-morning" };
    const blade = { ...generateItem(seededRng(4), 100, { slot: "weapon", rarity: "legendary" }), named: "oathcutter" };
    state.equipment = { amulet: locket, ring, weapon: blade };
    expect(skillCooldownMultiplier(state)).toBeCloseTo(0.4);
    expect(wandererSkip(state)).toBe(105);
    expect(derive(state, T0).kingDamage).toBeCloseTo(2);
  });
});

describe("save version 8", () => {
  it("loads a version 7 save, verifies it, keeps its Kings and plays on", () => {
    const engine = engineWith(createInitialState(T0), seededRng(8));
    let now = playBot(engine, T0, 2.2 * 3600, { clicksPerSecond: 5 });
    const legacy = structuredClone(engine.state) as unknown as Record<string, unknown>;
    // The same save as version 7 wrote it: none of the story's new counters.
    legacy.version = 7;
    const lifetime = legacy.lifetime as Record<string, unknown>;
    delete lifetime.kings;
    delete lifetime.seams;
    delete lifetime.threads;
    delete legacy.descents;
    delete legacy.threads;
    delete legacy.weaves;
    delete legacy.descentMark;
    delete legacy.caravanWeek;
    const lore = legacy.lore as { echoes: object; nightSeconds: number };
    legacy.lore = { echoes: lore.echoes, nightSeconds: lore.nightSeconds, read: 3 };
    legacy.trail = { wanderers: [], fieldKills: 0 };
    delete (legacy.settings as Record<string, unknown>).darkNight;
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.trail).toEqual(emptyTrail());
    expect(migrated.descents).toBe(0);
    // The Kings of an older save: every fall the Bestiary counted, one per stratum at least.
    expect(migrated.lifetime.kings).toBe(Math.max(migrated.bestiary["ruined-king"] ?? 0, Math.floor((migrated.maxStageEver - 1) / 50)));
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(parseState(JSON.parse(JSON.stringify(legacy))), migrated, 1000)).toEqual([]);
    const resumed = engineWith(migrated, seededRng(9), now);
    const kills = resumed.state.lifetime.kills;
    now = playBot(resumed, now, 10 * 60, { clicksPerSecond: 5 });
    expect(resumed.state.lifetime.kills).toBeGreaterThan(kills);
    expect(verifyState(resumed.state, now)).toEqual([]);
  }, 60_000);

  it("refuses forged story counters", () => {
    const songs = createInitialState(T0);
    songs.lore.songs = 3;
    expect(codes(songs, T0 + 3600_000)).toContain("lore");
    const ages = createInitialState(T0);
    ages.lore.ages["0"] = 40;
    expect(codes(ages, T0 + 3600_000)).toContain("lore");
    const kings = createInitialState(T0);
    kings.lifetime.kings = 5;
    expect(codes(kings, T0 + 3600_000)).toContain("bestiary");
    const lessons = createInitialState(T0);
    lessons.lore.lessons = ["maelle-10"];
    expect(codes(lessons, T0 + 3600_000)).toContain("lore");
    const previous = veteran();
    previous.lore.songs = 10;
    const next = structuredClone(previous);
    next.lore.songs = 2;
    expect(verifyTransition(previous, next, 60_000).map((violation) => violation.code)).toContain("rollback");
  });

  it("remembers every companion now, tier after tier", () => {
    const state = createInitialState(T0);
    state.maxStage = 60;
    state.maxStageEver = 60;
    state.heroLevels = Object.fromEntries(RECOGNITION_HEROES.map((hero) => [hero, 100]));
    state.lifetime.bestLevelSum = 2_000;
    state.lifetime.bestHired = 20;
    const engine = engineWith(state);
    engine.ascend(T0);
    for (const hero of RECOGNITION_HEROES) expect(recognitionTier(engine.state, hero), hero).toBe(1);
    expect(milestoneReached(engine.state, "remember-first")).toBe(true);
  });
});
