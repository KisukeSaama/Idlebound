/** A "reasonable" automatic player, shared by the balance simulation and the tests. */
import { CLICKER_ALTARS as CLICKER_MILESTONES, IDLE_ALTARS as IDLE_MILESTONES, damageRate, distributeEssences, strikesLead } from "../src/altarPlan";
import { WEAVES, weaveCost, type WeaveId } from "../src/data/descent";
import { CLICK_HERO_ID, HERO_BY_ID, HEROES } from "../src/data/heroes";
import { awakenDepth, relicDepth } from "../src/data/traits";
import { RECOGNITION_HEROES } from "../src/data/lore";
import { PROMISE_BY_HERO, promiseHolds, promiseOf, standingPromise, type PromiseAbstains } from "../src/data/promises";
import { SKILLS } from "../src/data/skills";
import { GameEngine, canDescend, descentPreview, isSkillUnlocked, nextRecruit } from "../src/engine";
import { awakenPrice, damageAt, relicCompanyGain, derive, deriveAt, deriveBase, heroCost, heroCostMultiplier, milestoneMultiplier, promiseWhen, type DeriveBase } from "../src/formulas";
import { runBits } from "../src/scale";
import type { AltarId, GameState, Item } from "../src/types";

export interface BotOptions {
  clicksPerSecond: number;
  /** Stop attack clicks from this stage of each run on (idle player); powers and crystals stay. */
  idleFromStage?: number;
  /** Occasional player: clicks only `seconds` out of every `everySeconds`. */
  burst?: { everySeconds: number; seconds: number };
  /**
   * Ascend after this long without a new stage, or once the road only creeps: the last
   * `CREEP_STAGES` new stages took more than `CREEP_SPANS` times as long.
   */
  stagnationMs?: number;
  onMilestone?: (engine: GameEngine, now: number) => void;
  onAscend?: (engine: GameEngine, now: number, gain: number, from: number) => void;
  /** Altar plan after each ascension (default: by play style, see `buyAltars`). */
  altars?: AltarPlan;
  /** Descend right after an ascension when this plan allows it (never without one). */
  descent?: DescentPlan;
  onDescend?: (engine: GameEngine, now: number, threads: number) => void;
  /** After each of the bot's ticks (the tests save from here, as the page does every 30 s). */
  onTick?: (engine: GameEngine, now: number) => void;
  /**
   * Who gets the walker's word at each dusk (default: `reasonablePromise`, among the promises
   * the play style can keep, see `promisesAvoided`); `false`: nobody, ever.
   */
  promises?: PromisePolicy | false;
  /**
   * Weighs the companions' next levels from one look at the company instead of one per
   * companion: the same choice (a companion's damage grows with its level and milestones
   * alone), several times faster. For the long runs of the deep road (`deep.ts`).
   */
  fastPurchases?: boolean;
}

/**
 * Which companion the bot gives its word to at dusk (`null`: nobody tonight). `avoid`: what
 * this play style would not promise away.
 */
export type PromisePolicy = (state: GameState, avoid?: readonly PromiseAbstains[]) => string | null;

/**
 * What a play style does not give its word about. A walker who strikes does not promise to
 * sheathe the sword, nor to go without powers: Ysolde and Nyx ask that of those who let the
 * company walk.
 */
export function promisesAvoided(options: BotOptions): readonly PromiseAbstains[] {
  return averageClicks(options) > 0 ? ["strikes", "powers"] : [];
}

/** Companions the walker can give their word to at this dusk, nothing their play style would break. */
function askable(state: GameState, avoid: readonly PromiseAbstains[]): string[] {
  return RECOGNITION_HEROES.filter((hero) => {
    const def = PROMISE_BY_HERO[hero];
    if (def.kind === "abstain" && avoid.includes(def.from)) return false;
    return promiseWhen(state, hero) === "tonight";
  });
}

/**
 * A reasonable walker's promises: a word kept doubles a companion's damage for good, so it
 * goes to the strongest companion who can ask tonight, the one who joins the company last.
 * Nobody two nights running, nothing the walker's own style would break.
 */
export const reasonablePromise: PromisePolicy = (state, avoid = []) => {
  const open = askable(state, avoid);
  return open.length > 0 ? open.reduce((best, hero) => (HERO_BY_ID[hero].index > HERO_BY_ID[best].index ? hero : best)) : null;
};

/** At dusk, before anything else: the bot chooses who gets its word for the night. */
export function pledgeAtDusk(engine: GameEngine, now: number, options: BotOptions) {
  if (options.promises === false) return;
  engine.perform({ type: "pledge", hero: (options.promises ?? reasonablePromise)(engine.state, promisesAvoided(options)) }, now);
}

/**
 * When the bot descends: once the Descent would weave at least `minThreads`, and at least
 * `growth` times the threads woven so far. The thread doubles with every Age, so `growth: 1`
 * is a Descent an Age, `0.5` one every 146 stages of new depth.
 */
export interface DescentPlan {
  minThreads: number;
  growth: number;
}

export interface AltarPlan {
  /** Capped altars bought whenever cheap. */
  milestones: readonly AltarId[];
}

export const CLICKER_ALTARS: AltarPlan = { milestones: CLICKER_MILESTONES };
export const IDLE_ALTARS: AltarPlan = { milestones: IDLE_MILESTONES };

export { damageRate, strikesLead };

/** Average strikes a second of a play style over a whole run. */
export function averageClicks(options: BotOptions): number {
  if (options.idleFromStage !== undefined) return 0;
  return options.burst ? (options.clicksPerSecond * options.burst.seconds) / options.burst.everySeconds : options.clicksPerSecond;
}

/**
 * Seconds between two ticks of the bot. The screen ticks every 50 ms; 100 ms plays the same
 * game twice as fast (`BOT_DT=0.05` to check it against the screen's pace).
 */
const DT = Number(process.env.BOT_DT) || 0.1;
/** The bot looks at the road and decides every half second, whatever the tick. */
const DECIDE_STEPS = Math.round(0.5 / DT);
/**
 * A walker whose strikes come in bursts wins a stage now and then that the company alone could
 * not: the road creeps, never stalls, and the dusk would never come. From the second night,
 * three new stages in more than twice the stagnation time is a road that has stopped paying.
 */
const CREEP_STAGES = 3;
const CREEP_SPANS = 2;

/** Seconds of play between two full weighings of the relics held (the company changes slowly). */
const RELIC_WEIGH_SECONDS = 120;

/**
 * The bot's relics: what each is worth to the company (`relicCompanyGain`), weighed again as
 * the company grows; it wears the best of each slot.
 */
function relicKeeper() {
  const worth = new Map<string, number>();
  let weighedAt = -Infinity;
  const weighWith = (engine: GameEngine, now: number) => {
    const s = engine.state;
    if (now - weighedAt > RELIC_WEIGH_SECONDS * 1000) {
      worth.clear();
      weighedAt = now;
    }
    const weigh = (item: Item) => {
      let value = worth.get(item.uid);
      if (value === undefined) {
        value = relicCompanyGain(s, item, now);
        worth.set(item.uid, value);
      }
      return value;
    };
    return weigh;
  };
  return Object.assign(weighWith, { forget: () => worth.clear() });
}

function bestHeroPurchase(engine: GameEngine, company: DeriveBase, clicksPerSecond: number, fast = false) {
  const s = engine.state;
  const multiplier = heroCostMultiplier(s);
  // Prices in the night's unit, as its gold (see `scale.ts`).
  const bits = runBits(s);
  let best: { id: string; ratio: number } | null = null;
  const d = deriveAt(company, s.heroLevels);
  const base = damageRate(d, clicksPerSecond);
  // Companions join in order (a promise may leave one behind, or keep the company small).
  const recruit = nextRecruit(s)?.id;
  const weigh = (heroId: string, level: number, cost: number) => {
    // Weighed on a copy: the game itself is only ever changed by commands (see `replay.ts`).
    const after = damageRate(damageAt(company, { ...s.heroLevels, [heroId]: level + 1 }), clicksPerSecond);
    const ratio = (after - base) / cost;
    if (!best || ratio > best.ratio) best = { id: heroId, ratio };
  };
  // Fast: among companions already hired, a level adds to their own damage only, by its
  // level and milestones, and so to the strikes in the same share: the best of them by that
  // ratio is the best by the full one, which is then weighed like the walker's own and the recruit.
  let lead: { id: string; level: number; cost: number; ratio: number } | null = null;
  for (const hero of HEROES) {
    const level = s.heroLevels[hero.id] ?? 0;
    if (level === 0 && hero.id !== CLICK_HERO_ID && hero.id !== recruit) continue;
    const cost = heroCost(hero, level, 1, multiplier, bits);
    if (cost > s.gold) continue;
    if (fast && level > 0 && hero.id !== CLICK_HERO_ID) {
      const grows = ((level + 1) * milestoneMultiplier(level + 1)) / (level * milestoneMultiplier(level)) - 1;
      const ratio = ((d.heroDps[hero.id] ?? 0) * grows) / cost;
      if (!lead || ratio > lead.ratio) lead = { id: hero.id, level, cost, ratio };
      continue;
    }
    weigh(hero.id, level, cost);
  }
  if (lead) weigh(lead.id, lead.level, lead.cost);
  return best as { id: string; ratio: number } | null;
}

/** Plays `seconds` seconds from `start`; returns the new time. */
export function playBot(engine: GameEngine, start: number, seconds: number, options: BotOptions): number {
  const s = engine.state;
  const stagnation = options.stagnationMs ?? 15 * 60_000;
  let now = start;
  let lastProgressAt = now;
  let lastMaxStage = s.maxStage;
  /** When the last new stages of this run were reached, oldest first. */
  let recent: number[] = [];
  let clickDebt = 0;
  let step = 0;
  const endAt = start + seconds * 1000;
  const relics = relicKeeper();
  let wornBefore = "";

  while (now < endAt) {
    now += DT * 1000;
    step += 1;
    const inBurst = !options.burst || ((now - start) / 1000) % options.burst.everySeconds < options.burst.seconds;
    const clicking = inBurst && (options.idleFromStage === undefined || s.maxStage < options.idleFromStage);
    const clicksPerSecond = clicking ? options.clicksPerSecond : 0;
    // As on the page: the steps first, then what the walker does, at the last step's time.
    engine.tick(now);
    clickDebt += clicksPerSecond * DT;
    const clicks = Math.floor(clickDebt);
    if (clicks > 0) {
      clickDebt -= clicks;
      engine.perform({ type: "click", count: clicks }, now);
    }
    if (s.crystal) engine.perform({ type: "crystal" }, now);
    options.onTick?.(engine, now);

    if (step % DECIDE_STEPS === 0) {
      engine.perform({ type: "talents" }, now);
      // Only the levels and the gold change from one purchase to the next: the rest of the
      // company's numbers is worked out once, and the engine's once they are all bought.
      const company = deriveBase(s, now, { ignoreTimed: true });
      engine.batch(() => {
        for (let guard = 0; guard < 50; guard += 1) {
          const best = bestHeroPurchase(engine, company, clicksPerSecond, options.fastPurchases);
          if (!best) break;
          engine.perform({ type: "hero", id: best.id, mode: 1 }, now);
        }
      });
      for (const skill of SKILLS) if (isSkillUnlocked(s, skill.id) && skill.id !== "echo") engine.perform({ type: "skill", id: skill.id }, now);
      // Having promised never to be pushed back, the bot only leads the company into a seam it holds.
      if (!s.autoAdvance && (now - lastProgressAt) % 120_000 < DT * 1000 * DECIDE_STEPS && (!promiseOf(s, "unfailing") || engine.canBeatNextBoss(now))) engine.perform({ type: "auto" }, now);
      // The satchel the company kept while the walker was away: opened at once.
      if (s.satchel.length > 0) engine.perform({ type: "openSatchel" }, now);
      // What a relic is worth changes with the others worn (places, the Host) and with awakenings.
      const worn = () => Object.values(s.equipment).map((item) => `${item?.uid}:${item?.depth ?? ""}`).join();
      if (worn() !== wornBefore) relics.forget();
      const weigh = relics(engine, now);
      for (const item of [...s.inventory]) {
        const equipped = s.equipment[item.slot];
        // Morgrath's Phylactery halves the click: only a walker who lets go of the sword wears it.
        if (item.named === "phylactery" && clicksPerSecond > 0 && options.idleFromStage === undefined) continue;
        if (equipped?.named === "phylactery" && clicksPerSecond > 0 && options.idleFromStage === undefined) { engine.perform({ type: "equip", uid: item.uid }, now); continue; }
        if (!equipped || weigh(item) > weigh(equipped)) engine.perform({ type: "equip", uid: item.uid }, now);
      }
      // Brom brings the worn relics down to the deepest night, the cheapest first, with half the shards held at most.
      const sleepers = Object.values(s.equipment).filter((item) => item !== undefined && awakenDepth(item, s.maxStageEver) > relicDepth(item));
      for (const item of sleepers.sort((a, b) => awakenPrice(s, a) - awakenPrice(s, b))) {
        if (awakenPrice(s, item) <= s.shards / 2) engine.perform({ type: "awaken", uid: item.uid }, now);
      }
      if (s.shards >= 30 && s.inventory.length < 40) engine.perform({ type: "offer", id: "chest" }, now);
      engine.perform({ type: "salvageUpTo", rarity: "rare" }, now);
      wornBefore = worn();
    }

    if (s.maxStage > lastMaxStage) {
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
      recent = [...recent, now].slice(-CREEP_STAGES);
      options.onMilestone?.(engine, now);
    }

    // The first night ends on a real stall: the King is new, every stage past him is learned.
    const creeping = s.lifetime.ascensions > 0 && recent.length === CREEP_STAGES && now - recent[0] > CREEP_SPANS * stagnation;
    const stalled = now - lastProgressAt > stagnation || creeping;
    if (stalled && standingPromise(s) && !promiseHolds(s)) {
      // A word that would not be kept at this dusk holds the night back: the bot takes it
      // back and walks on a while, freed, before it calls the dusk.
      engine.perform({ type: "break" }, now);
      lastProgressAt = now;
      recent = [];
    } else if (engine.canAscend() && stalled) {
      const from = s.maxStage;
      const leading = strikesLead(derive(s, now, { ignoreTimed: true }), averageClicks(options));
      const gain = engine.perform({ type: "ascend" }, now) as number;
      options.onAscend?.(engine, now, gain, from);
      if (options.descent && wantsDescent(s, options.descent)) {
        const threads = engine.perform({ type: "descend" }, now) as number;
        buyWeaves(engine, now);
        options.onDescend?.(engine, now, threads);
      }
      pledgeAtDusk(engine, now, options);
      // Only a walker whose strikes lead the company invests in critical hits.
      buyAltars(engine, now, options.altars ?? (leading ? CLICKER_ALTARS : IDLE_ALTARS), leading);
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
      recent = [];
    }
  }
  return now;
}

function wantsDescent(state: GameState, { minThreads, growth }: DescentPlan): boolean {
  return canDescend(state) && descentPreview(state) >= Math.max(minThreads, growth * state.lifetime.threads);
}

/** The one weave that compounds: the rest of the threads go to it. */
const OPEN_WEAVE: WeaveId = "plenty";
/** Capped weaves bought as soon as they cost little next to the threads held. */
const WEAVE_SHARE = 0.1;

/**
 * Threads spent as a reasonable walker would: the capped weaves when cheap (not the Long
 * Thread, which only matters to a closed game), then every Warp of Plenty the rest affords.
 */
export function buyWeaves(engine: GameEngine, now: number) {
  const s = engine.state;
  const price = (id: WeaveId) => weaveCost(id, s.weaves[id] ?? 0);
  for (let guard = 0; guard < 500; guard += 1) {
    const cheap = WEAVES.find((weave) => weave.id !== OPEN_WEAVE && weave.id !== "long-thread" && price(weave.id) <= s.threads * WEAVE_SHARE);
    if (!engine.perform({ type: "weave", id: cheap?.id ?? OPEN_WEAVE }, now)) return;
  }
}

/**
 * Essence spending after an ascension, as the Sanctum's "Distribute" button does
 * (`distributeEssences`): capped altars when cheap, then the open-ended level that adds the
 * most per essence (the Blade if the strikes led the last run, Patience if the company did),
 * as long as it beats keeping the essences.
 */
export function buyAltars(engine: GameEngine, now: number, { milestones }: AltarPlan, strikesLed: boolean) {
  for (const id of distributeEssences(engine.state, strikesLed, milestones)) engine.perform({ type: "altar", id }, now);
}
