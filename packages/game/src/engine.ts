import { ACHIEVEMENTS } from "./data/achievements";
import { ALTARS, ALTAR_BY_ID } from "./data/altars";
import { TREASURE_MONSTER, BIOMES, biomeForStage, bossForStage, eraForStage, guardianForStage, isBiomeBossStage, isBossStage, isKingStage, THE_DAWN } from "./data/biomes";
import { CARAVAN_BUFF_SECONDS, caravanWare, isoWeek } from "./data/caravan";
import { DESCENT_HERO, DESCENT_MIN_STAGE, WEAVE_BY_ID, threadsFor, weaveCost, type WeaveId } from "./data/descent";
import {
  CARAVAN_MIN_ASCENSIONS,
  ECLIPSE_EVERY,
  ECLIPSE_HP,
  MIGRATION_MIN_ERA,
  MIGRATION_ODDS,
  QUIET_MIN_ERA,
  QUIET_ODDS,
  QUIET_SECONDS,
  SEAM_MIN_STAGE,
  SEAM_ODDS,
  SEAM_SECONDS,
  STORM_CRYSTALS,
  STORM_CRYSTAL_SECONDS,
  STORM_ODDS,
  STRAY_HERO,
  STRAY_ODDS,
  TIDE_CRYSTAL_SECONDS,
  TIDE_MIN_SECONDS,
  UNFINISHED_MIN_AGE,
  UNFINISHED_ODDS,
  WAGER_CLICKS,
  WAGER_ODDS,
  WAGER_REST_SECONDS,
  WAGER_SECONDS,
  WALKER_CHANCE,
  WALKER_MIN_ASCENSIONS,
  WALKER_SECONDS,
  remembranceNight,
  type EventId
} from "./data/events";
import { CLICK_HERO_ID, HEROES, HERO_BY_ID, UPGRADE_BY_ID } from "./data/heroes";
import { FORGE_MAX, INVENTORY_LIMIT, RARITY_INFO } from "./data/items";
import {
  BESTIARY_BY_ID,
  DREAM_MIN_SECONDS,
  EVEN_RATS,
  EVEN_THORVALD_LEVEL,
  FACELESS_TOUCHES,
  FACELESS_WINDOW_MS,
  GLASS_AGE,
  GOOD_BOY_LEVEL,
  GOOD_BOY_RUNS,
  KEEP_SOME_ESSENCES,
  givingAllAway,
  LAST_SECOND_LEFT,
  LAST_SECOND_TIMES,
  LESSONS,
  LISTEN_SECONDS,
  NIGHT_HOURS,
  NIGHT_OWL_SECONDS,
  NOTCH_KILLS,
  NOTCH_LAST_STAGE,
  RECOGNITION_LEVEL,
  REST_FAILS,
  REST_STAGE,
  SAME_ROAD_NIGHTS,
  SONG_CHANCE,
  TONGUE_SECONDS,
  CROWN_DESCENTS,
  CROWN_HOLD_MS,
  WANDERER_BY_BIOME,
  WELCOME_BACK_MS,
  ageEchoesFound,
  bestiaryKills,
  bestiaryTier,
  echoChance,
  echoesFound,
  recognitionRuns,
  recognitionTier,
  type SecretId
} from "./data/lore";
import { NAMED_BY_ID, NAMED_RELICS, namedEffect, namedSourceReached, wearing, wearsRegalia, type NamedRelicDef } from "./data/relics";
import { BUFF_DURATION_SECONDS, BUFF_MAX_SECONDS, isMarketBuff, MARKET_BY_ID, type MarketOfferId } from "./data/market";
import { SKILLS, SKILL_BY_ID } from "./data/skills";
import { ageForEra, ageForStage, MILESTONES } from "./data/strata";
import { milestoneReached } from "./chronicle";
import {
  ASCENSION_MIN_STAGE,
  BOSS_RESPAWN_SECONDS,
  WOUND_CAP,
  WOUND_KEEP,
  WOUND_LAST_STAGE,
  MAX_STAGE,
  MONSTERS_PER_STAGE,
  RESPAWN_SECONDS,
  altarLevel,
  altarPrice,
  ascensionPreview,
  wandererSkip,
  bossHp,
  bossHpMultiplier,
  crystalEssenceReward,
  derive,
  forgePrice,
  heroCost,
  heroCostMultiplier,
  maxAffordableLevels,
  memoryStartGold,
  nextBreakpoint,
  offlineCapSeconds,
  REUNION_MIN_AWAY_SECONDS,
  REUNION_SHARE,
  STRIKE_FILL_SECONDS,
  strikeFillShare,
  shardPrice,
  skillCooldownMultiplier,
  skillDuration,
  stageGold,
  stageHp,
  upgradeCost,
  wagerGold,
  weaveLevel,
  weaveValue
} from "./formulas";
import { generateItem } from "./loot";
import { pick, randomInt, storedRng, uid, type Rng } from "./rng";
import { emptyStats, emptyTrail } from "./state";
import type { AbsenceAccount, AltarId, BuffId, BuyMode, ChronicleEntry, Derived, GameEvent, GameState, Item, ItemSlot, MonsterDef, MonsterKind, MonsterState, OfflineSummary, Rarity, SkillId } from "./types";

/** Past this gap between two ticks, gains are computed in one catch-up instead of simulated. */
const CATCH_UP_THRESHOLD_MS = 5_000;
/** Offline progress is simulated in slices of this many (effective) seconds, spending in between. */
const OFFLINE_SLICE_SECONDS = 60;
/** Most purchase batches per offline slice. */
const OFFLINE_SPEND_ROUNDS = 200;
/** Companions keep their gold for a better purchase they can afford within this many seconds. */
const SAVING_SECONDS = 300;
/** A talent that adds no damage (gold, crits, time) is learned once it costs this share of the gold at most. */
const CHEAP_TALENT_SHARE = 0.1;
/** While the player is away from an open tab, the autopilot acts this often (like an offline slice). */
const AUTOPILOT_INTERVAL_SECONDS = OFFLINE_SLICE_SECONDS;
const MAX_ASCENSION_HISTORY = 100;
/** Most shards a wandering crystal can hold. */
export const CRYSTAL_SHARDS_MAX = 6;
/** Seconds the Stray Armor takes to walk across the road and out of sight. */
const STRAY_SECONDS = 30;

export function isSkillUnlocked(state: GameState, id: SkillId): boolean {
  const unlock = SKILL_BY_ID[id].unlock;
  if ("weave" in unlock) return weaveLevel(state, unlock.weave) > 0;
  return (state.heroLevels[unlock.heroId] ?? 0) >= unlock.level;
}

export function offlineGains(state: GameState, seconds: number, now: number): { kills: number; gold: number } {
  const derived = derive(state, now, { ignoreTimed: true });
  if (derived.dps <= 0 || seconds <= 0) return { kills: 0, gold: 0 };
  const farmStage = isBossStage(state.stage) ? Math.max(1, state.stage - 1) : state.stage;
  const timePerKill = stageHp(farmStage) / derived.dps + RESPAWN_SECONDS;
  const kills = Math.floor(seconds / timePerKill);
  const gold = kills * stageGold(farmStage) * derived.goldMultiplier * (1 + derived.treasureChance * 9);
  return { kills, gold: Math.floor(gold) };
}

/** Whether the walker may begin a Descent (BIBLE 12.7): deep enough, and Eldra remembers them. */
export function canDescend(state: GameState): boolean {
  return state.maxStageEver >= DESCENT_MIN_STAGE && recognitionTier(state, DESCENT_HERO) >= 5;
}

/** Stages of the guardians the company passed while away, in order. */
export function guardiansPassed(account: AbsenceAccount): number[] {
  const stages: number[] = [];
  for (let stage = account.fromStage; stage < account.toStage; stage += 1) if (isBiomeBossStage(stage)) stages.push(stage);
  return stages;
}

/** Threads a Descent would weave now. */
export function descentPreview(state: GameState): number {
  return threadsFor(state.lifetime.essencesEarned - state.descentMark);
}

function levelSum(state: GameState): number {
  return Object.values(state.heroLevels).reduce((total, level) => total + level, 0);
}

/** The companion (not Aldric) who deals the most damage right now, if any. */
function strongestCompanion(derived: Derived): string | null {
  let best: string | null = null;
  let value = 0;
  for (const [id, dps] of Object.entries(derived.heroDps)) {
    if (id !== CLICK_HERO_ID && dps > value) {
      best = id;
      value = dps;
    }
  }
  return best;
}

/** How things stood when the company went on alone, for the Reunion's account. */
interface AbsenceMark {
  maxStage: number;
  heroLevels: Record<string, number>;
  talents: number;
  goldEarned: number;
  gold: number;
  /** Boss stages that stopped the company since. */
  walls: number[];
}

/** A purchase the company weighs while away: levels up to a breakpoint, the talents it unlocks. */
interface Purchase {
  heroId: string;
  levels: number;
  talents: string[];
  cost: number;
  /** Companion damage it adds. */
  gain: number;
}

/** The companion who joins next, hired in order as in the shop, if any is left. */
function nextRecruit(state: GameState) {
  return HEROES.find((hero) => hero.id !== CLICK_HERO_ID && !(state.heroLevels[hero.id] > 0) && (hero.index <= 1 || state.heroLevels[HEROES[hero.index - 1].id] > 0));
}

function bestValue(options: Purchase[]): Purchase | undefined {
  let best: Purchase | undefined;
  for (const option of options) if (!best || option.gain / option.cost > best.gain / best.cost) best = option;
  return best;
}

export class GameEngine {
  state: GameState;
  derived: Derived;
  rng: Rng;
  /** Set by the UI: no crystal spawns and no events while the tab is hidden. */
  visible = true;
  /** Set by the UI: the language the walker reads in (the Two Tongues secret). */
  locale: "fr" | "en" = "fr";
  /**
   * Set by the UI: without player input for this long, the autopilot takes over (buying,
   * retrying bosses). Null (simulations, tests): never.
   */
  afkAfterMs: number | null = null;
  private lastInputAt = 0;
  /** Pip rests after a wager: until then his rats just run. */
  private wagerRestUntil = 0;
  private autopilotTimer = 0;
  private events: GameEvent[] = [];
  private autoClickAccumulator = 0;
  private achievementTimer = 0;
  /** Companion damage dealt since the last "dps" event (one per second, for the UI). */
  private companionDamage = 0;
  private companionTimer = 0;
  /** Strike damage waiting to take the Patience bonus's place (at most a few seconds of it). */
  private strikeFill = 0;
  /** Patience bonus due and taken by strikes since the last "dps" event. */
  private patienceDue = 0;
  private patienceTaken = 0;
  /** Share of the Patience bonus the company dealt over the last second (the rest, the walker's strikes did). */
  patienceShare = 1;
  private unlockedAchievements: Set<string>;
  /** Whether the local clock reads the dead of night, rechecked once a minute (Night Owl). */
  private night = false;
  private nightCheckAt = 0;
  /** Seconds lived in catch-ups since someone last looked (what stays after an absence). */
  private awaySeconds = 0;
  /** Seconds caught up since the player's last input (a reloaded tab gets its time back). */
  private aloneSeconds = 0;
  /** How things stood after the player's last input, told and cleared when they are back. */
  private absence: AbsenceMark | null = null;
  /** An attack click landed during the current boss fight (Let Him Rest). */
  private clickedThisFight = false;
  /** When Nyx's portrait was touched lately (Faceless). */
  private touches: number[] = [];

  /**
   * Without `rng` (the game itself), fates are drawn from the generator the save carries:
   * reloading a save cannot draw a crystal or a relic again. Tests and simulations pass one.
   */
  constructor(state: GameState, rng?: Rng, now = Date.now()) {
    this.state = state;
    this.rng = rng ?? storedRng(() => this.state.rngState, (next) => { this.state.rngState = next; });
    this.unlockedAchievements = new Set(state.achievements);
    this.derived = derive(state, now);
    this.lastInputAt = now;
  }

  // ---------------------------------------------------------------- helpers

  private emit(event: GameEvent) {
    this.events.push(event);
    if (this.events.length > 400) this.events.splice(0, this.events.length - 400);
  }

  drainEvents(): GameEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  refresh(now: number) {
    this.derived = derive(this.state, now);
  }

  private earnGold(amount: number) {
    if (!(amount > 0)) return;
    const s = this.state;
    s.gold += amount;
    s.run.goldEarned += amount;
    s.lifetime.goldEarned += amount;
  }

  private earnShards(amount: number) {
    if (amount <= 0) return;
    this.state.shards += amount;
    this.state.lifetime.shardsEarned += amount;
  }

  private addBuff(id: BuffId, seconds: number, now: number) {
    const s = this.state;
    const existing = s.buffs.find((buff) => buff.id === id);
    const start = existing && existing.until > now ? existing.until : now;
    const until = isMarketBuff(id) ? start + seconds * 1000 : Math.min(start + seconds * 1000, now + BUFF_MAX_SECONDS * 1000);
    if (existing) existing.until = until;
    else s.buffs.push({ id, until });
  }

  private fragment(entry: ChronicleEntry) {
    this.emit({ type: "fragment", entry });
  }

  // ---------------------------------------------------------------- the Chronicle

  /** Counts kills of a creature the Bestiary keeps, announcing each line it unlocks. */
  private recordKills(id: string, count: number) {
    const entry = BESTIARY_BY_ID[id];
    if (!entry || count <= 0) return;
    const s = this.state;
    const before = bestiaryKills(s, id);
    s.bestiary[id] = before + count;
    const tier = bestiaryTier(entry, before + count);
    for (let line = bestiaryTier(entry, before) + 1; line <= tier; line += 1) this.emit({ type: "bestiary", id, tier: line });
  }

  /** Kills made in bulk (catch-up, the Altar of the Wanderer), spread over the stage's creatures. */
  private recordStageKills(stage: number, count: number) {
    if (count <= 0) return;
    const biome = biomeForStage(stage);
    if (isBossStage(stage)) {
      this.recordKills(bossForStage(stage).id, count);
      return;
    }
    const kinds = biome.monsters.length;
    const share = Math.floor(count / kinds);
    const rest = count - share * kinds;
    // The remainder turns with the stage, so no creature is favored over a long catch-up.
    biome.monsters.forEach((monster, index) => this.recordKills(monster.id, share + ((index - (stage % kinds) + kinds) % kinds < rest ? 1 : 0)));
  }

  /** A secret found: a line in the Chronicle and a deed with no power. */
  discover(id: SecretId) {
    const s = this.state;
    if (s.secrets.includes(id)) return;
    s.secrets.push(id);
    this.emit({ type: "secret", id });
    this.fragment({ source: "secret", id });
    if (id === "it-wears-you") this.fragment({ source: "crown" });
    this.checkAchievements();
  }

  /** An event met for the first time leaves its fragment. */
  private meetEvent(id: EventId) {
    const s = this.state;
    this.emit({ type: "event", id });
    if (id === "storm" || s.lore.events.includes(id)) return;
    s.lore.events.push(id);
    this.fragment({ source: "event", id });
  }

  /** A guardian's first clear may bring back the next echo of its biome. */
  private rollEcho(biomeId: string, era: number, now: number) {
    const s = this.state;
    const found = echoesFound(s, biomeId);
    const chance = echoChance(era, found) * (found === 0 ? 1 : derive(s, now).fragmentChance * (1 + namedEffect(s, "fragments")));
    if (this.rng() >= chance) return;
    s.lore.echoes[biomeId] = found + 1;
    this.fragment({ source: "echo", biome: biomeId, index: found });
  }

  /** The next Age echo of an Age (the King's first clear there, a Seam closed there). */
  private ageEcho(age: number) {
    const s = this.state;
    const found = ageEchoesFound(s, age);
    s.lore.ages[String(age)] = found + 1;
    this.fragment({ source: "age", age, index: found });
  }

  /** Milestones of the walker's own story reached since the last look. */
  private checkMilestones(before: Set<string>) {
    for (const id of MILESTONES) {
      if (!before.has(id) && milestoneReached(this.state, id)) this.fragment({ source: "milestone", id });
    }
  }

  private milestonesNow(): Set<string> {
    return new Set(MILESTONES.filter((id) => milestoneReached(this.state, id)));
  }

  /**
   * A named relic joins the walker, locked so it is never salvaged by mistake: in its slot
   * when that slot is empty, otherwise in the pack, even a full one (a legend finds room).
   */
  private grantNamed(id: string) {
    const s = this.state;
    const def = NAMED_BY_ID[id];
    if (!def || s.named.includes(id)) return;
    const item = generateItem(this.rng, Math.max(1, s.maxStageEver - 1), { slot: def.slot, rarity: def.rarity });
    item.named = id;
    item.locked = true;
    s.named.push(id);
    this.addItem(item, true);
    this.fragment({ source: "relic", id });
  }

  /** Named relics given by a kill count or a Recognition gift, once their source is reached. */
  private checkNamedSources(monsterId?: string) {
    const s = this.state;
    for (const def of NAMED_RELICS) {
      const source = def.source;
      if ((source.kind !== "kills" && source.kind !== "gift") || s.named.includes(def.id)) continue;
      if (monsterId !== undefined && (source.kind !== "kills" || source.monster !== monsterId)) continue;
      if (namedSourceReached(s, def)) this.grantNamed(def.id);
    }
  }

  /** Named relics that come by chance with a kill; `frontier`: the boss that blocks the run. */
  private rollNamed(monster: MonsterState, frontier: boolean) {
    const s = this.state;
    const era = eraForStage(s.stage);
    const guardian = monster.kind === "boss";
    const king = guardian && isKingStage(s.stage);
    const roll = (def: NamedRelicDef, chance: number) => {
      if (!s.named.includes(def.id) && this.rng() < chance) this.grantNamed(def.id);
    };
    for (const def of NAMED_RELICS) {
      const source = def.source;
      switch (source.kind) {
        case "boss":
          if (frontier && source.monster === monster.id && era >= source.era) roll(def, source.chance);
          break;
        case "stratum":
          if (frontier && guardian && era === source.era) roll(def, source.chance);
          break;
        case "king":
          if (frontier && king && ageForEra(era) >= source.age) roll(def, source.chance);
          break;
        case "creature":
          if (source.monster === monster.id) roll(def, source.chance);
          break;
        case "hired":
          if (guardian && (s.heroLevels[source.hero] ?? 0) >= source.level) roll(def, source.chance);
          break;
        case "event":
          if (source.event === "stray" && monster.id === "stray-armor") this.grantNamed(def.id);
          break;
        case "dawn":
          if (monster.id === THE_DAWN && s.descents >= source.descents) this.grantNamed(def.id);
          break;
        default:
          break;
      }
    }
  }

  /** Night Owl: play time between midnight and four in the morning, by the walker's own clock. */
  private watchNight(now: number, dt: number) {
    const s = this.state;
    if (s.secrets.includes("night-owl")) return;
    if (now >= this.nightCheckAt) {
      const hour = new Date(now).getHours();
      this.night = hour >= NIGHT_HOURS[0] && hour < NIGHT_HOURS[1];
      this.nightCheckAt = now + 60_000;
    }
    if (!this.night) return;
    s.lore.nightSeconds = Math.min(s.lifetime.playTime, s.lore.nightSeconds + dt);
    if (s.lore.nightSeconds >= NIGHT_OWL_SECONDS) this.discover("night-owl");
  }

  /** Two Tongues and Listening: time spent in a language, and in the Deepvaults, untouched. */
  private watchTime(now: number, dt: number) {
    const s = this.state;
    const tongues = s.lore.tongues;
    if (!s.secrets.includes("two-tongues")) {
      tongues[this.locale] = Math.min(s.lifetime.playTime, tongues[this.locale] + dt);
      if (tongues.fr >= TONGUE_SECONDS && tongues.en >= TONGUE_SECONDS) this.discover("two-tongues");
    }
    if (!s.secrets.includes("listening")) {
      const listening = this.visible && biomeForStage(s.stage).id === "forgotten-caves" && now - s.lastClickAt >= 1000;
      s.trail.listen = listening ? Math.min(s.run.playTime, s.trail.listen + dt) : 0;
      if (s.trail.listen >= LISTEN_SECONDS) this.discover("listening");
    }
  }

  // ---------------------------------------------------------------- loop

  /**
   * Advances the simulation to `now`. Returns the summary of a catch-up when one happened,
   * however short: a throttled background tab catches up in many small steps.
   */
  tick(now: number): OfflineSummary | null {
    const s = this.state;
    const gapMs = now - s.lastTickAt;
    if (gapMs < 0) {
      this.rewind(-gapMs, now);
      return null;
    }
    if (gapMs === 0) return null;
    this.leave();

    if (gapMs > CATCH_UP_THRESHOLD_MS) {
      const summary = this.catchUp(gapMs / 1000, now);
      s.lastTickAt = now;
      this.refresh(now);
      return summary;
    }

    const dt = gapMs / 1000;
    s.lastTickAt = now;
    s.run.playTime += dt;
    s.lifetime.playTime += dt;
    this.watchNight(now, dt);
    this.watchTime(now, dt);
    s.buffs = s.buffs.filter((buff) => buff.until > now);
    this.updateCrystal(now);
    this.refresh(now);
    const d = this.derived;

    if (!s.monster) {
      s.respawnIn -= dt;
      if (s.respawnIn <= 0) this.spawn(now);
    } else {
      const monster = s.monster;
      if (monster.wager) {
        // Pip stopped to dare the walker; out of time, he runs off laughing.
        if (now > monster.wager.until) this.pipLeaves();
      } else {
        if (d.autoClicksPerSecond > 0) {
          this.autoClickAccumulator += d.autoClicksPerSecond * dt;
          while (this.autoClickAccumulator >= 1 && s.monster) {
            this.autoClickAccumulator -= 1;
            this.strike(now, "auto");
          }
        }
        if (s.monster && d.dps > 0) {
          const factor = this.targetFactor(s.monster);
          // The walker's strikes took the place of this much of the Patience bonus.
          const bonus = d.patienceDps * dt * factor;
          const taken = Math.min(this.strikeFill, bonus);
          this.strikeFill -= taken;
          this.patienceDue += bonus;
          this.patienceTaken += taken;
          const amount = d.dps * dt * factor - taken;
          this.companionDamage += amount;
          this.damage(amount, now);
        }
        if (s.monster && (s.monster.kind === "boss" || s.monster.kind === "miniboss" || s.monster.event)) {
          s.bossTimeLeft -= dt;
          if (s.bossTimeLeft <= 0) {
            if (s.monster.event) this.eventEscapes();
            else this.failBoss();
          }
        }
      }
    }

    this.companionTimer += dt;
    if (this.companionTimer >= 1) {
      if (this.companionDamage > 0) this.emit({ type: "dps", damage: this.companionDamage });
      if (this.patienceDue > 0) this.patienceShare = 1 - this.patienceTaken / this.patienceDue;
      this.companionTimer = 0;
      this.companionDamage = 0;
      this.patienceDue = 0;
      this.patienceTaken = 0;
    }

    if (this.afkAfterMs !== null && now - this.lastInputAt >= this.afkAfterMs) {
      this.autopilotTimer += dt;
      if (this.autopilotTimer >= AUTOPILOT_INTERVAL_SECONDS) {
        this.autopilotTimer = 0;
        this.autopilot(now);
      }
    } else {
      this.autopilotTimer = 0;
    }

    this.achievementTimer += dt;
    if (this.achievementTimer >= 1) {
      this.achievementTimer = 0;
      this.checkAchievements();
    }
    return null;
  }

  /**
   * The player is here (any action or input on the page). Back from a long enough absence
   * (no input, or time caught up), the company welcomes them with the Reunion.
   */
  markInput(now: number) {
    const away = Math.max((now - this.lastInputAt) / 1000, this.aloneSeconds);
    const account = this.absence && away >= REUNION_MIN_AWAY_SECONDS ? this.account(away) : undefined;
    this.absence = null;
    this.lastInputAt = now;
    this.aloneSeconds = 0;
    if (away >= REUNION_MIN_AWAY_SECONDS) this.reunion(now, away, account);
  }

  /**
   * The clock stands behind the last tick (a save written by a device running ahead, a clock
   * set back): every deadline moves back with it. Waiting for the clock to catch up would
   * freeze the game while the walker's strikes still count, and the server would refuse them.
   */
  private rewind(ms: number, now: number) {
    const s = this.state;
    s.lastTickAt = now;
    s.lastClickAt = Math.min(s.lastClickAt, now);
    s.nextCrystalAt -= ms;
    for (const buff of s.buffs) buff.until -= ms;
    for (const skill of Object.values(s.skills)) {
      if (!skill) continue;
      skill.activeUntil -= ms;
      skill.readyAt -= ms;
    }
    if (s.crystal) s.crystal.expiresAt -= ms;
    if (s.monster?.wager) s.monster.wager.until -= ms;
    this.wagerRestUntil -= ms;
    this.refresh(now);
  }

  /** After the player's last input: how things stand, to tell them later what changed. */
  private leave() {
    if (this.absence) return;
    const s = this.state;
    const blocked = this.blockedAt();
    this.absence = {
      maxStage: s.maxStage,
      heroLevels: { ...s.heroLevels },
      talents: s.heroUpgrades.length,
      goldEarned: s.lifetime.goldEarned,
      gold: s.gold,
      walls: blocked === null ? [] : [blocked]
    };
  }

  /** A boss stopped the company where it stands, which trains before it. */
  private blockedAt(): number | null {
    const s = this.state;
    return !s.autoAdvance && isBossStage(s.maxStage) ? s.maxStage : null;
  }

  private stoppedBy(stage: number) {
    if (this.absence && !this.absence.walls.includes(stage)) this.absence.walls.push(stage);
  }

  /** What the company tells the walker back from `seconds` away. */
  private account(seconds: number): AbsenceAccount {
    const s = this.state;
    const mark = this.absence!;
    const levels = HEROES.filter((hero) => (s.heroLevels[hero.id] ?? 0) > (mark.heroLevels[hero.id] ?? 0))
      .map((hero) => ({ heroId: hero.id, from: mark.heroLevels[hero.id] ?? 0, to: s.heroLevels[hero.id] }));
    const gold = s.lifetime.goldEarned - mark.goldEarned;
    return {
      seconds,
      fromStage: mark.maxStage,
      toStage: s.maxStage,
      gold,
      spent: Math.max(0, gold - (s.gold - mark.gold)),
      hired: levels.filter((entry) => entry.from === 0).map((entry) => entry.heroId),
      levels,
      talents: s.heroUpgrades.slice(mark.talents),
      walls: mark.walls.filter((stage) => stage < s.maxStage),
      blockedAt: this.blockedAt()
    };
  }

  /**
   * The tab is watched again (or not). Coming back after a long absence leaves one line,
   * and after a very long one the next crystal comes soon (the Slow Tide).
   */
  setVisible(visible: boolean, now: number) {
    const was = this.visible;
    this.visible = visible;
    if (visible && !was) this.wake(now);
  }

  private wake(now: number) {
    const s = this.state;
    const away = this.awaySeconds;
    this.awaySeconds = 0;
    if (away < DREAM_MIN_SECONDS) return;
    const index = s.lore.dreams;
    s.lore.dreams = index + 1;
    this.emit({ type: "dream", index });
    this.fragment({ source: "dream", index });
    if (away >= TIDE_MIN_SECONDS) {
      s.nextCrystalAt = Math.min(s.nextCrystalAt, now + TIDE_CRYSTAL_SECONDS * 1000);
      this.meetEvent("tide");
    }
  }

  /**
   * Welcome Back: the game was opened again after a long time away (the UI tells, from the
   * time of the last save).
   */
  welcomeBack(awayMs: number) {
    if (awayMs >= WELCOME_BACK_MS) this.discover("welcome-back");
  }

  /**
   * What companions do on their own while the player is away from an open tab: spend the
   * gold (offline spending setting), and go back to the boss that stopped them once they
   * can beat it. Powers, crystals, ascension and gear stay with the player.
   */
  private autopilot(now: number) {
    const s = this.state;
    const eventMark = this.events.length;
    if (s.settings.offlineSpending) this.autoSpend(now);
    this.events = [...this.events.slice(0, eventMark), ...this.events.slice(eventMark).filter((event) => event.type === "skillUnlocked")];
    if (!s.autoAdvance && this.canBeatNextBoss(now)) {
      s.autoAdvance = true;
      if (s.stage < s.maxStage && !s.monster) this.setStage(s.maxStage);
    }
  }

  /** Whether companions alone beat the boss ahead in time (true when no boss blocks the way). */
  private canBeatNextBoss(now: number): boolean {
    const s = this.state;
    if (!isBossStage(s.maxStage)) return true;
    const d = derive(s, now, { ignoreTimed: true });
    return d.dps > 0 && this.bossLeft(s.maxStage) <= d.dps * this.stageFactor(s.maxStage, d) * d.bossTimer;
  }

  /** HP a boss stage's boss comes back with: its wounds taken off, the Eclipse added. */
  private bossLeft(stage: number): number {
    return bossHp(stage) * (this.eclipsed(stage) ? ECLIPSE_HP : 1) * (1 - this.woundKept(stage));
  }

  /** Share of its HP a boss stage's boss still lacks from the fights it won. */
  private woundKept(stage: number): number {
    return this.state.trail.wound?.stage === stage ? this.state.trail.wound.share : 0;
  }

  /** A guardian or an elite of the present night keeps the wounds of a fight it won (`dealt`: share of its HP). */
  private keepWound(stage: number, dealt: number) {
    if (isKingStage(stage) || stage > WOUND_LAST_STAGE) return;
    this.state.trail.wound = { stage, share: Math.min(WOUND_CAP, this.woundKept(stage) + dealt * WOUND_KEEP) };
  }

  /** Damage factor against a boss stage's guardian, for the catch-up and the autopilot. */
  private stageFactor(stage: number, d: Derived): number {
    if (!isBossStage(stage)) return 1;
    const id = bossForStage(stage).id;
    return d.bossDamage * (isKingStage(stage) ? d.kingDamage : 1) * (id === "rot-baron" ? d.baronDamage : 1);
  }

  /** Reunion: the company that walked on alone fights harder for a share of the time away. */
  private reunion(now: number, awaySeconds: number, account?: AbsenceAccount) {
    const seconds = Math.min(BUFF_MAX_SECONDS, awaySeconds * REUNION_SHARE);
    this.addBuff("reunion", seconds, now);
    this.emit(account ? { type: "reunion", seconds, account } : { type: "reunion", seconds });
  }

  /**
   * Offline / background-tab progress, simulated in slices. Companions fight alone (idle
   * bonus, no timed bonus) at full speed, exactly as in an open tab left alone: closing the
   * tab costs nothing but what a present player adds. They push stages from the furthest one
   * reached and train on the stage before a boss they cannot beat in time; with offline
   * spending on, they level themselves up with the gold they earn between slices and try again.
   */
  catchUp(seconds: number, now: number): OfflineSummary {
    const s = this.state;
    const capped = Math.min(seconds, offlineCapSeconds(s));
    const startStage = s.stage;
    const startMaxStage = s.maxStage;
    const startLevels = levelSum(s);
    const startUpgrades = s.heroUpgrades.length;
    const eventMark = this.events.length;
    const spending = s.settings.offlineSpending;
    let remaining = capped;
    let carry = 0;
    let kills = 0;
    let gold = 0;
    let bosses = 0;
    let kings = 0;
    let shards = 0;
    let spent = 0;
    let blockedAt: number | null = null;
    // The boss the company last lost to: the autopilot only goes back once it can win.
    let failedAt: number | null = s.autoAdvance ? null : s.maxStage;
    s.stage = s.maxStage;
    // Whatever stood in the road (an event, Pip's dare) is gone when the walker comes back.
    s.monster = null;

    while (remaining > 0) {
      if (spending) spent += this.autoSpend(now);
      const d = derive(s, now, { ignoreTimed: true });
      if (d.dps <= 0) break;
      // Without spending the power never changes: one slice is enough.
      const slice = spending ? Math.min(remaining, OFFLINE_SLICE_SECONDS) : remaining;
      remaining -= slice;
      let time = slice + carry;
      let sliceGold = 0;
      blockedAt = null;

      while (s.maxStage < MAX_STAGE) {
        const stage = s.maxStage;
        if (isBossStage(stage)) {
          const fight = this.bossLeft(stage) / (d.dps * this.stageFactor(stage, d));
          if (fight > d.bossTimer) {
            // Reaching a boss too strong, the company fights it once anyway, as in an open
            // tab, and the wounds it leaves stay (up to stage 44). Then it trains and waits.
            if (stage === failedAt) { blockedAt = stage; break; }
            if (d.bossTimer > time) break;
            time -= d.bossTimer;
            failedAt = stage;
            this.stoppedBy(stage);
            s.lifetime.bossFails += 1;
            this.keepWound(stage, (d.dps * this.stageFactor(stage, d) * d.bossTimer) / (bossHp(stage) * (this.eclipsed(stage) ? ECLIPSE_HP : 1)));
            continue;
          }
          if (fight + BOSS_RESPAWN_SECONDS > time) break;
          time -= fight + BOSS_RESPAWN_SECONDS;
          kills += 1;
          bosses += 1;
          sliceGold += stageGold(stage) * bossHpMultiplier(stage) * d.goldMultiplier * (isBiomeBossStage(stage) ? d.guardianGold : 1);
          this.recordStageKills(stage, 1);
          if (s.trail.wound?.stage === stage) delete s.trail.wound;
          if (isBiomeBossStage(stage)) shards += 1 + Math.floor(stage / 25) + namedEffect(s, "guardianShards");
          if (isKingStage(stage)) {
            kings += 1;
            s.trail.eclipse = false;
          }
        } else {
          const perKill = stageHp(stage) / d.dps + RESPAWN_SECONDS;
          const needed = MONSTERS_PER_STAGE - s.kills;
          const done = Math.min(needed, Math.floor(time / perKill));
          time -= done * perKill;
          kills += done;
          sliceGold += done * stageGold(stage) * d.goldMultiplier * (1 + d.treasureChance * 9);
          this.recordStageKills(stage, done);
          s.kills += done;
          if (done < needed) break;
        }
        s.maxStage += 1;
        s.kills = 0;
        if (s.maxStage > s.maxStageEver) s.maxStageEver = s.maxStage;
        s.stage = s.maxStage;
        this.noteStratum(s.maxStage);
      }

      // Blocked by a boss (or at the last stage): farm the stage before it.
      if (blockedAt !== null || s.maxStage >= MAX_STAGE) {
        const base = blockedAt ?? s.stage;
        const farmStage = isBossStage(base) ? Math.max(1, base - 1) : base;
        const perKill = stageHp(farmStage) / d.dps + RESPAWN_SECONDS;
        const done = Math.floor(time / perKill);
        time -= done * perKill;
        kills += done;
        sliceGold += done * stageGold(farmStage) * d.goldMultiplier * (1 + d.treasureChance * 9);
        this.recordStageKills(farmStage, done);
      }
      carry = time;
      gold += sliceGold;
      this.earnGold(sliceGold);
    }

    // Blocked: train on the stage before the boss, as after a failed boss online; the next
    // catch-up or the autopilot tries again once companions are strong enough.
    s.autoAdvance = blockedAt === null;
    if (blockedAt !== null) s.stage = Math.max(1, blockedAt - 1);
    s.run.kills += kills;
    s.lifetime.kills += kills;
    s.run.bosses += bosses;
    s.lifetime.bosses += bosses;
    s.lifetime.kings += kings;
    this.earnShards(shards);
    this.checkNamedSources();
    s.lifetime.offlineSeconds += capped;
    s.buffs = s.buffs.filter((buff) => buff.until > now);
    if (s.crystal && s.crystal.expiresAt < now) s.crystal = null;
    // Purchases made while away are summed up in the summary, not replayed as effects.
    this.events = [...this.events.slice(0, eventMark), ...this.events.slice(eventMark).filter((event) => event.type === "skillUnlocked" || event.type === "fragment")];
    s.monster = null;
    s.respawnIn = 0.25;
    s.bossTimeLeft = 0;
    if (s.stage !== startStage) {
      this.emit({ type: "stage", stage: s.stage, biomeChanged: biomeForStage(s.stage).id !== biomeForStage(startStage).id });
    }
    this.awaySeconds += capped;
    this.aloneSeconds += capped;
    if (this.visible) this.wake(now);
    this.checkAchievements();
    return {
      seconds: capped,
      kills,
      gold,
      stages: s.maxStage - startMaxStage,
      shards,
      blockedAt,
      levels: levelSum(s) - startLevels,
      upgrades: s.heroUpgrades.length - startUpgrades,
      spent
    };
  }

  /**
   * Spending while away. The next companion joins as soon as the company can pay for them;
   * then each purchase takes a companion to their next breakpoint (a talent level, then every
   * milestone), with or without the talents it unlocks, or learns a talent left behind. The best damage
   * per gold wins; when it is out of reach but close, companions save for it. Returns the gold
   * spent.
   */
  private autoSpend(now: number): number {
    const s = this.state;
    const goldBefore = s.gold;
    for (let round = 0; round < OFFLINE_SPEND_ROUNDS; round += 1) {
      const recruit = nextRecruit(s);
      if (recruit && this.buyHero(recruit.id, 1, now)) continue;
      const options = this.purchaseOptions(now);
      const cheap = options.find((option) => option.gain <= 0 && option.levels === 0 && option.cost <= s.gold * CHEAP_TALENT_SHARE);
      if (cheap) {
        this.buyPurchase(cheap, now);
        continue;
      }
      const valued = options.filter((option) => option.gain > 0);
      const best = bestValue(valued);
      if (!best) break;
      if (best.cost > s.gold) {
        const d = derive(s, now, { ignoreTimed: true });
        if (best.cost - s.gold <= this.goldRate(d) * SAVING_SECONDS) break;
      }
      const choice = best.cost <= s.gold ? best : bestValue(valued.filter((option) => option.cost <= s.gold));
      if (!choice) break;
      this.buyPurchase(choice, now);
    }
    return goldBefore - s.gold;
  }

  /** What the company could buy next: each companion up to their next breakpoint, each talent left behind. */
  private purchaseOptions(now: number): Purchase[] {
    const s = this.state;
    const multiplier = heroCostMultiplier(s);
    const base = derive(s, now, { ignoreTimed: true }).dps;
    const gain = (heroId: string, level: number, talents: string[]) => {
      const before = s.heroLevels[heroId] ?? 0;
      s.heroLevels[heroId] = level;
      s.heroUpgrades.push(...talents);
      const dps = derive(s, now, { ignoreTimed: true }).dps;
      s.heroLevels[heroId] = before;
      s.heroUpgrades.length -= talents.length;
      return dps - base;
    };
    const options: Purchase[] = [];
    for (const hero of HEROES) {
      const level = s.heroLevels[hero.id] ?? 0;
      if (level === 0) continue;
      const missing = (upTo: number) => hero.upgrades.filter((upgrade) => upgrade.level <= upTo && !s.heroUpgrades.includes(upgrade.id)).map((upgrade) => upgrade.id);
      for (const id of missing(level)) {
        options.push({ heroId: hero.id, levels: 0, talents: [id], cost: upgradeCost(id), gain: gain(hero.id, level, [id]) });
      }
      // Aldric's levels raise the click, which the company never uses.
      if (hero.id === CLICK_HERO_ID) continue;
      // Up to the breakpoint, with or without its talents: a talent can wait for the gold.
      const target = nextBreakpoint(hero, level);
      const levelsCost = heroCost(hero, level, target - level, multiplier);
      options.push({ heroId: hero.id, levels: target - level, talents: [], cost: levelsCost, gain: gain(hero.id, target, []) });
      const talents = missing(target);
      if (talents.length > 0) {
        const cost = levelsCost + talents.reduce((total, id) => total + upgradeCost(id), 0);
        options.push({ heroId: hero.id, levels: target - level, talents, cost, gain: gain(hero.id, target, talents) });
      }
    }
    return options;
  }

  private buyPurchase(purchase: Purchase, now: number) {
    if (purchase.levels > 0) this.buyHero(purchase.heroId, purchase.levels, now);
    for (const id of purchase.talents) this.buyUpgrade(id, now);
  }

  /** Gold a second the company earns alone on the stage it holds. */
  private goldRate(d: Derived): number {
    if (d.dps <= 0) return 0;
    const stage = isBossStage(this.state.maxStage) ? Math.max(1, this.state.maxStage - 1) : this.state.maxStage;
    return (stageGold(stage) * d.goldMultiplier * (1 + d.treasureChance * 9)) / (stageHp(stage) / d.dps + RESPAWN_SECONDS);
  }

  // ---------------------------------------------------------------- combat

  /** Whether the King of this stage is shadowed by his Eclipse. */
  private eclipsed(stage: number): boolean {
    return Boolean(this.state.trail.eclipse) && isKingStage(stage);
  }

  /** Damage multiplier against a monster: boss damage, the King's and the Baron's own weaknesses. */
  private targetFactor(monster: MonsterState): number {
    const d = this.derived;
    if (monster.kind !== "boss" && monster.kind !== "miniboss") return 1;
    const king = monster.kind === "boss" && isKingStage(this.state.stage);
    return d.bossDamage * (king ? d.kingDamage : 1) * (monster.id === "rot-baron" ? d.baronDamage : 1);
  }

  private spawn(now: number) {
    const s = this.state;
    const d = this.derived;
    const stage = s.stage;
    const biome = biomeForStage(stage);
    const era = eraForStage(stage);
    let kind: MonsterKind = "normal";
    // The Migration: another biome's Remnants cross this stretch of road.
    const crossing = s.trail.migration?.stage === stage ? BIOMES.find((entry) => entry.id === s.trail.migration!.biome) : undefined;
    let def: MonsterDef = pick(this.rng, (crossing ?? biome).monsters);
    let hp = stageHp(stage);
    let gold = stageGold(stage);
    let event: MonsterState["event"];
    let eclipse = false;
    this.clickedThisFight = false;

    if (isBossStage(stage)) {
      kind = isBiomeBossStage(stage) ? "boss" : "miniboss";
      def = kind === "boss" ? guardianForStage(stage) : biome.miniBoss;
      hp = bossHp(stage);
      gold = stageGold(stage) * bossHpMultiplier(stage);
      if (kind === "boss" && this.eclipsed(stage)) {
        hp *= ECLIPSE_HP;
        eclipse = true;
      }
      s.bossTimeLeft = d.bossTimer;
    } else if (this.rng() < d.treasureChance) {
      kind = "treasure";
      def = TREASURE_MONSTER;
      gold = stageGold(stage) * 10;
    } else {
      const wanderer = WANDERER_BY_BIOME[biome.id];
      if (wanderer && !s.trail.wanderers.includes(wanderer.id) && this.rng() < wanderer.chance) {
        // The biome's rare wanderer: once a run at most.
        kind = "rare";
        def = { id: wanderer.id };
        gold = stageGold(stage) * wanderer.gold;
        s.trail.wanderers.push(wanderer.id);
      } else if (this.visible) {
        // Events of the road, only while someone watches.
        const roll = this.rng();
        if (stage >= SEAM_MIN_STAGE && roll < 1 / SEAM_ODDS) {
          event = "seam";
          def = { id: "seam-warden" };
          hp = stageHp(stage) * 6;
          gold = stageGold(stage) * 6;
          s.bossTimeLeft = SEAM_SECONDS;
        } else if (era >= QUIET_MIN_ERA && roll < 1 / SEAM_ODDS + 1 / QUIET_ODDS) {
          event = "quiet";
          def = { id: "the-quiet" };
          hp = stageHp(stage) * 3;
          gold = stageGold(stage) * 3;
          s.bossTimeLeft = QUIET_SECONDS;
        } else if ((s.heroLevels[STRAY_HERO] ?? 0) > 0 && roll < 1 / SEAM_ODDS + 1 / QUIET_ODDS + 1 / STRAY_ODDS) {
          event = "stray";
          def = { id: "stray-armor" };
          hp = stageHp(stage) * 6;
          gold = stageGold(stage) * 6;
          s.bossTimeLeft = STRAY_SECONDS;
        } else if (ageForEra(era) >= UNFINISHED_MIN_AGE && this.rng() < 1 / UNFINISHED_ODDS) {
          event = "unfinished";
        }
      }
    }

    const monster: MonsterState = { id: def.id, hp, maxHp: hp, kind, gold };
    // The wounds it kept from the fights it won against the walker.
    if (s.trail.wound?.stage === stage && (kind === "boss" || kind === "miniboss")) monster.hp = hp * (1 - s.trail.wound.share);
    if (event) monster.event = event;
    if (eclipse) monster.eclipse = true;
    // Pip's Wager: one golden rat in ten stops and dares the walker, then rests a while.
    if (kind === "treasure" && this.visible && now >= this.wagerRestUntil && this.rng() < 1 / WAGER_ODDS) {
      monster.wager = { clicks: 0, until: now + WAGER_SECONDS * 1000 };
      this.wagerRestUntil = now + WAGER_REST_SECONDS * 1000;
    }
    s.monster = monster;
    this.emit({ type: "spawn", monster });
    if (event && event !== "unfinished") this.meetEvent(event);
    if (monster.wager) this.meetEvent("wager");
    if (eclipse) this.meetEvent("eclipse");
  }

  click(now: number) {
    const s = this.state;
    s.lastClickAt = now;
    s.trail.listen = 0;
    const monster = s.monster;
    if (!monster) return;
    this.clickedThisFight = true;
    if (monster.wager) {
      s.run.clicks += 1;
      s.lifetime.clicks += 1;
      monster.wager.clicks += 1;
      if (monster.wager.clicks >= WAGER_CLICKS) {
        // Pip loses his bet, and pays what the road would have in the meantime, and more.
        delete monster.wager;
        monster.gold = stageGold(s.stage) * wagerGold(s.stage, this.derived.dps, this.derived.treasureChance);
        this.emit({ type: "event", id: "wager", won: true });
        monster.hp = 0;
        this.kill(now);
      }
      return;
    }
    this.strike(now, "click");
  }

  private strike(now: number, source: "click" | "auto") {
    const s = this.state;
    const d = this.derived;
    if (!s.monster || s.monster.wager) return;
    const crit = this.rng() < d.critChance;
    const factor = this.targetFactor(s.monster);
    const damage = d.click * (crit ? d.critMultiplier : 1) * factor;
    if (source === "click") {
      s.run.clicks += 1;
      s.lifetime.clicks += 1;
      // The walker's own blow takes the place of as much of the company's Patience bonus.
      this.strikeFill = Math.min(this.strikeFill + damage * strikeFillShare(s), d.patienceDps * factor * STRIKE_FILL_SECONDS);
    }
    if (crit) {
      s.run.crits += 1;
      s.lifetime.crits += 1;
    }
    if (damage > s.run.maxHit) s.run.maxHit = damage;
    if (damage > s.lifetime.maxHit) s.lifetime.maxHit = damage;
    this.emit({ type: "hit", damage, crit, source });
    this.damage(damage, now);
  }

  private damage(amount: number, now: number) {
    const monster = this.state.monster;
    if (!monster || monster.wager) return;
    monster.hp -= amount;
    if (monster.hp <= 0) this.kill(now);
  }

  /** Pip wins his own bet: he runs off with his gold. */
  private pipLeaves() {
    const s = this.state;
    s.monster = null;
    s.respawnIn = RESPAWN_SECONDS;
    this.emit({ type: "event", id: "wager", won: false });
  }

  /** An event creature's time ran out: it goes, and the road goes on (nothing is lost). */
  private eventEscapes() {
    const s = this.state;
    const id = s.monster?.event;
    s.monster = null;
    s.respawnIn = RESPAWN_SECONDS;
    s.bossTimeLeft = 0;
    if (id === "seam" || id === "quiet" || id === "stray") this.emit({ type: "event", id, won: false });
  }

  private kill(now: number) {
    const s = this.state;
    const monster = s.monster;
    if (!monster) return;
    const d = this.derived;
    const isBoss = monster.kind === "boss" || monster.kind === "miniboss";
    const king = monster.kind === "boss" && isKingStage(s.stage);
    if (isBoss && s.trail.wound?.stage === s.stage) delete s.trail.wound;
    const gold = monster.gold * d.goldMultiplier * (monster.kind === "boss" ? d.guardianGold : 1);
    this.earnGold(gold);
    s.run.kills += 1;
    s.lifetime.kills += 1;
    if (monster.kind === "treasure") {
      s.run.treasures += 1;
      s.lifetime.treasures += 1;
      // Even: Thorvald watches every rat caught.
      if ((s.heroLevels.thorvald ?? 0) >= EVEN_THORVALD_LEVEL) {
        s.trail.evenRats += 1;
        if (s.trail.evenRats >= EVEN_RATS) this.discover("even");
      }
    }
    this.recordKills(monster.id, 1);
    if (monster.kind === "rare" && bestiaryKills(s, monster.id) === 1) this.fragment({ source: "wanderer", id: monster.id });
    if (s.stage <= NOTCH_LAST_STAGE) {
      s.trail.fieldKills += 1;
      if (s.trail.fieldKills >= NOTCH_KILLS) this.discover("thousandth-notch");
    }

    let shards = 0;
    const frontier = s.stage === s.maxStage;
    const firstClear = frontier && s.stage >= s.maxStageEver;
    if (isBoss) {
      s.run.bosses += 1;
      s.lifetime.bosses += 1;
      if (king) {
        s.lifetime.kings += 1;
        s.trail.eclipse = false;
      }
      this.bossSecrets(monster, king);
      // Shards and items only drop from the boss that blocks progression: a boss already
      // beaten in this run and replayed from the stage selector pays gold only.
      if (frontier) {
        shards = monster.kind === "boss" ? 1 + Math.floor(s.stage / 25) + namedEffect(s, "guardianShards") : this.rng() < 0.35 ? 1 : 0;
        this.earnShards(shards);
        const chance = monster.kind === "boss" ? 0.4 : 0.15;
        // The Eclipse's King always leaves something behind.
        if ((monster.kind === "boss" && firstClear) || monster.eclipse || this.rng() < chance) {
          this.addItem(generateItem(this.rng, s.stage, { luck: monster.kind === "boss" ? 2 : 1 }));
        }
        const era = eraForStage(s.stage);
        if (monster.kind === "boss" && firstClear) {
          this.rollEcho(biomeForStage(s.stage).id, era, now);
          if (king) this.kingCleared(era);
          // Echo of a Walker: another walker's shadow comes to fight beside the company.
          if (this.visible && s.lifetime.ascensions >= WALKER_MIN_ASCENSIONS && this.rng() < WALKER_CHANCE) {
            this.recordKills("walker-echo", 1);
            this.addBuff("walker", WALKER_SECONDS, now);
            this.meetEvent("walker");
          }
        }
        this.rollNamed(monster, true);
      }
    } else {
      this.rollNamed(monster, false);
    }
    if (monster.event) this.eventWon(monster, now);
    this.checkNamedSources(monster.id);

    this.emit({ type: "kill", monster, gold, shards });
    s.monster = null;
    s.respawnIn = isBoss ? BOSS_RESPAWN_SECONDS : RESPAWN_SECONDS;
    s.bossTimeLeft = 0;

    if (s.stage === s.maxStage) {
      if (isBossStage(s.stage)) this.advance();
      else {
        s.kills += 1;
        if (s.kills >= MONSTERS_PER_STAGE) this.advance();
      }
    } else if (s.autoAdvance) {
      this.setStage(s.maxStage);
    }
  }

  /** The King's first fall in a stratum: the keystone (and its reading), and an Age echo. */
  private kingCleared(era: number) {
    const s = this.state;
    if (s.maxStageEver > s.stage) return;
    this.fragment({ source: "keystone", era });
    if (s.descents > 0) {
      const index = s.descents - 1;
      while (s.lore.readings.length <= index) s.lore.readings.push(0);
      if (s.lore.readings[index] <= era) {
        s.lore.readings[index] = era + 1;
        this.fragment({ source: "keystone", era, reading: s.descents });
      }
    }
    this.ageEcho(ageForEra(era));
  }

  /** Readings of a Descent's strata, for strata crossed in a catch-up too. */
  private noteStratum(maxStage: number) {
    const s = this.state;
    if (s.descents === 0 || !isKingStage(maxStage - 1)) return;
    const era = eraForStage(maxStage - 1);
    const index = s.descents - 1;
    while (s.lore.readings.length <= index) s.lore.readings.push(0);
    if (s.lore.readings[index] <= era) s.lore.readings[index] = era + 1;
  }

  /** Secrets that are found as a boss falls. */
  private bossSecrets(monster: MonsterState, king: boolean) {
    const s = this.state;
    const d = this.derived;
    if (king) s.trail.rest = 0;
    if (monster.kind === "boss" && s.bossTimeLeft <= LAST_SECOND_LEFT) {
      s.lore.lastSeconds += 1;
      if (s.lore.lastSeconds >= LAST_SECOND_TIMES) this.discover("last-second");
    }
    if (king && s.stage === REST_STAGE && Object.keys(s.equipment).every((slot) => !s.equipment[slot as ItemSlot])) this.discover("empty-hands");
    if (monster.id === "rot-baron" && wearing(s, "mirelle-ring")) this.discover("till-death");
    if (king && recognitionTier(s, "kaelen") >= 5 && strongestCompanion(d) === "kaelen") this.discover("last-blow");
  }

  /** An event creature beaten in time. */
  private eventWon(monster: MonsterState, now: number) {
    const s = this.state;
    const age = ageForStage(s.stage);
    switch (monster.event) {
      case "seam":
        // The walker holds the crack shut: an elite's drop, and an echo of the Age.
        s.lifetime.seams += 1;
        if (this.rng() < 0.35) this.earnShards(1);
        if (this.rng() < 0.15) this.addItem(generateItem(this.rng, s.stage));
        this.ageEcho(age);
        this.emit({ type: "event", id: "seam", won: true });
        break;
      case "quiet":
        this.ageEcho(age);
        this.emit({ type: "event", id: "quiet", won: true });
        break;
      case "stray":
        this.emit({ type: "event", id: "stray", won: true });
        break;
      case "unfinished":
        // The world, caught being drawn: a line of the Draft.
        if (!s.lore.events.includes("unfinished")) this.meetEvent("unfinished");
        this.ageEcho(Math.max(UNFINISHED_MIN_AGE, age));
        break;
    }
    void now;
  }

  private advance() {
    const s = this.state;
    if (s.maxStage >= MAX_STAGE) return;
    s.maxStage += 1;
    s.kills = 0;
    if (s.maxStage > s.maxStageEver) s.maxStageEver = s.maxStage;
    // Pacifist: the Fallen King reached with Brother Cinder leading the company.
    if (s.maxStage === REST_STAGE && strongestCompanion(this.derived) === "cendre") this.discover("pacifist");
    // The Migration: now and then, another biome's Remnants cross the next stretch.
    if (this.visible && eraForStage(s.maxStage) >= MIGRATION_MIN_ERA && !isBossStage(s.maxStage) && this.rng() < 1 / MIGRATION_ODDS) {
      const others = BIOMES.filter((biome) => biome.id !== biomeForStage(s.maxStage).id);
      s.trail.migration = { stage: s.maxStage, biome: pick(this.rng, others).id };
      this.meetEvent("migration");
    }
    if (s.autoAdvance) this.setStage(s.maxStage);
  }

  private failBoss() {
    const s = this.state;
    s.lifetime.bossFails += 1;
    // Let Him Rest: the King at stage 50, left alone until his seam closes, three times.
    if (s.stage === REST_STAGE && isKingStage(s.stage)) {
      s.trail.rest = this.clickedThisFight ? 0 : s.trail.rest + 1;
      if (s.trail.rest >= REST_FAILS) this.discover("let-him-rest");
    }
    // A guardian or an elite of the present night keeps its wounds for the next fight.
    const monster = s.monster;
    if (monster) {
      const kept = this.woundKept(s.stage);
      this.keepWound(s.stage, Math.max(0, (monster.maxHp * (1 - kept) - Math.max(0, monster.hp)) / monster.maxHp));
    }
    this.emit({ type: "bossFailed", stage: s.stage });
    s.monster = null;
    s.respawnIn = 0.6;
    s.bossTimeLeft = 0;
    if (s.stage === s.maxStage && s.stage > 1) {
      this.stoppedBy(s.stage);
      s.autoAdvance = false;
      this.setStage(s.stage - 1);
    }
  }

  setStage(stage: number) {
    const s = this.state;
    const target = Math.max(1, Math.min(s.maxStage, Math.floor(stage)));
    if (target === s.stage) return;
    const biomeChanged = biomeForStage(target).id !== biomeForStage(s.stage).id;
    s.stage = target;
    s.monster = null;
    s.respawnIn = 0.25;
    s.bossTimeLeft = 0;
    this.emit({ type: "stage", stage: target, biomeChanged });
  }

  /** Travel chosen by the player: going back pauses auto-advance. */
  travel(stage: number) {
    const s = this.state;
    if (stage < s.maxStage) s.autoAdvance = false;
    else s.autoAdvance = true;
    this.setStage(stage);
  }

  toggleAutoAdvance() {
    const s = this.state;
    s.autoAdvance = !s.autoAdvance;
    if (s.autoAdvance && s.stage < s.maxStage && !s.monster) this.setStage(s.maxStage);
  }

  // ---------------------------------------------------------------- companions

  heroPurchase(heroId: string, mode: BuyMode | number): { count: number; cost: number } {
    const s = this.state;
    const hero = HERO_BY_ID[heroId];
    if (!hero) return { count: 0, cost: Number.POSITIVE_INFINITY };
    const level = s.heroLevels[heroId] ?? 0;
    const multiplier = heroCostMultiplier(s);
    if (mode === "max") {
      const count = Math.max(1, maxAffordableLevels(hero, level, s.gold, multiplier));
      return { count, cost: heroCost(hero, level, count, multiplier) };
    }
    return { count: mode, cost: heroCost(hero, level, mode, multiplier) };
  }

  buyHero(heroId: string, mode: BuyMode | number, now: number): boolean {
    const s = this.state;
    const hero = HERO_BY_ID[heroId];
    if (!hero) return false;
    const { count, cost } = this.heroPurchase(heroId, mode);
    if (count <= 0 || cost > s.gold) return false;
    const before = s.heroLevels[heroId] ?? 0;
    s.gold -= cost;
    s.heroLevels[heroId] = before + count;
    this.emit({ type: "heroBought", heroId, levels: count, firstTime: before === 0 });
    const levels = Object.values(s.heroLevels);
    s.lifetime.bestLevelSum = Math.max(s.lifetime.bestLevelSum, levels.reduce((total, value) => total + value, 0));
    s.lifetime.bestHired = Math.max(s.lifetime.bestHired, levels.filter((value) => value > 0).length);
    for (const skill of SKILLS) {
      const unlock = skill.unlock;
      if ("heroId" in unlock && unlock.heroId === heroId && before < unlock.level && before + count >= unlock.level) {
        this.emit({ type: "skillUnlocked", skillId: skill.id });
      }
    }
    this.refresh(now);
    return true;
  }

  buyUpgrade(upgradeId: string, now: number): boolean {
    const s = this.state;
    const entry = UPGRADE_BY_ID[upgradeId];
    if (!entry || s.heroUpgrades.includes(upgradeId)) return false;
    if ((s.heroLevels[entry.hero.id] ?? 0) < entry.upgrade.level) return false;
    const cost = upgradeCost(upgradeId);
    if (cost > s.gold) return false;
    s.gold -= cost;
    s.heroUpgrades.push(upgradeId);
    this.emit({ type: "upgradeBought", upgradeId });
    // Aldric's talents, the first time ever: a Lesson from someone who taught a walker before.
    if (LESSONS.includes(upgradeId) && !s.lore.lessons.includes(upgradeId)) {
      s.lore.lessons.push(upgradeId);
      this.fragment({ source: "lesson", id: upgradeId });
    }
    this.refresh(now);
    return true;
  }

  /** Buys every affordable talent, cheapest first. */
  buyAllUpgrades(now: number): number {
    const s = this.state;
    const available = Object.keys(UPGRADE_BY_ID)
      .filter((id) => !s.heroUpgrades.includes(id) && (s.heroLevels[UPGRADE_BY_ID[id].hero.id] ?? 0) >= UPGRADE_BY_ID[id].upgrade.level)
      .sort((a, b) => upgradeCost(a) - upgradeCost(b));
    let bought = 0;
    for (const id of available) {
      if (upgradeCost(id) > s.gold) break;
      if (this.buyUpgrade(id, now)) bought += 1;
    }
    return bought;
  }

  /** Faceless: Nyx's portrait, touched seven times in three seconds. */
  touchPortrait(heroId: string, now: number) {
    const s = this.state;
    if (heroId !== "nyx" || (s.heroLevels.nyx ?? 0) === 0 || s.secrets.includes("faceless")) return;
    this.touches = [...this.touches.filter((at) => now - at < FACELESS_WINDOW_MS), now];
    if (this.touches.length >= FACELESS_TOUCHES) this.discover("faceless");
  }

  /** It Wears You: the fifth slot, held long enough, after the tenth Descent. */
  holdCrown(heldMs: number) {
    if (this.state.descents >= CROWN_DESCENTS && heldMs >= CROWN_HOLD_MS) this.discover("it-wears-you");
  }

  /** Behind the Glass: the window of the Keep, looked through in the Age of the room with the lamp. */
  lookThroughWindow() {
    const s = this.state;
    if (ageForStage(s.stage) === GLASS_AGE && biomeForStage(s.stage).id === "fallen-king-ruins") this.discover("behind-the-glass");
  }

  // ---------------------------------------------------------------- powers

  useSkill(id: SkillId, now: number): boolean {
    const s = this.state;
    const def = SKILL_BY_ID[id];
    if (!def || !isSkillUnlocked(s, id)) return false;
    const current = s.skills[id];
    if (current && current.readyAt > now) return false;

    if (id === "echo") {
      const target = s.lastSkill;
      const targetState = target ? s.skills[target] : undefined;
      if (!target || !targetState || targetState.readyAt <= now) return false;
      targetState.readyAt = now;
    }
    if (id === "unweave" && !this.unweave()) return false;
    if (id === "ritual") s.ritualStacks += 1;

    s.skills[id] = {
      activeUntil: now + skillDuration(s, id, def.duration) * 1000,
      readyAt: now + def.cooldown * skillCooldownMultiplier(s) * 1000
    };
    if (id !== "echo") s.lastSkill = id;
    s.run.skillsUsed += 1;
    s.lifetime.skillsUsed += 1;
    this.emit({ type: "skill", skillId: id });
    this.refresh(now);
    return true;
  }

  /** Unweave: the current stretch of road (never a boss's) is unmade, and the walker goes on. */
  private unweave(): boolean {
    const s = this.state;
    if (s.stage !== s.maxStage || isBossStage(s.stage) || s.maxStage >= MAX_STAGE) return false;
    s.monster = null;
    this.advance();
    return true;
  }

  // ---------------------------------------------------------------- wandering crystals

  private updateCrystal(now: number) {
    const s = this.state;
    const d = this.derived;
    if (s.crystal && s.crystal.expiresAt < now) {
      const storm = s.crystal.storm ?? 0;
      s.crystal = null;
      // A storm goes on even when a crystal slips away, as long as someone is watching.
      if (storm > 0 && this.visible) this.placeCrystal(now, storm - 1);
    }
    if (!s.crystal && this.visible && now >= s.nextCrystalAt) {
      s.nextCrystalAt = now + (90 + this.rng() * 150) * d.crystalWait * 1000;
      if (this.rng() < 1 / STORM_ODDS) {
        // Crystal Storm: the Lantern Queen crosses the sky, and five crystals fall in turn.
        this.recordKills("lantern-queen", 1);
        if (bestiaryKills(s, "lantern-queen") === 1) this.fragment({ source: "event", id: "storm" });
        this.emit({ type: "storm" });
        this.placeCrystal(now, STORM_CRYSTALS - 1);
      } else {
        this.placeCrystal(now);
      }
    }
  }

  /** A crystal at a random spot; `storm` counts the crystals of a storm still to come. */
  private placeCrystal(now: number, storm?: number) {
    this.state.crystal = {
      id: uid(this.rng),
      expiresAt: now + (storm === undefined ? this.derived.crystalStay : STORM_CRYSTAL_SECONDS) * 1000,
      x: 12 + this.rng() * 70,
      y: 16 + this.rng() * 48,
      ...(storm === undefined ? {} : { storm })
    };
    this.emit({ type: "crystalSpawned" });
  }

  clickCrystal(now: number): boolean {
    const s = this.state;
    if (!s.crystal || s.crystal.expiresAt < now) return false;
    const storm = s.crystal.storm ?? 0;
    s.crystal = null;
    s.run.crystals += 1;
    s.lifetime.crystals += 1;
    const roll = this.rng();
    if (roll < 0.4) {
      const gold = 15 * stageGold(Math.max(1, s.stage)) * this.derived.goldMultiplier;
      this.earnGold(gold);
      this.emit({ type: "crystal", reward: "gold", amount: Math.floor(gold) });
    } else if (roll < 0.65) {
      this.addBuff("overcharge", 15, now);
      this.emit({ type: "crystal", reward: "overcharge", amount: 15 });
    } else if (roll < 0.85) {
      this.addBuff("sharpness", 20, now);
      this.emit({ type: "crystal", reward: "sharpness", amount: 20 });
    } else if (roll < 0.97 || s.lifetime.ascensions === 0) {
      const shards = randomInt(this.rng, 2, CRYSTAL_SHARDS_MAX);
      this.earnShards(shards);
      this.emit({ type: "crystal", reward: "shards", amount: shards });
    } else {
      const essences = crystalEssenceReward(s.maxStageEver);
      s.essences += essences;
      s.lifetime.essencesEarned += essences;
      this.emit({ type: "crystal", reward: "essence", amount: essences });
    }
    // Célestine hears some of them, and sings back.
    if ((s.heroLevels.celestine ?? 0) > 0 || s.lore.songs > 0 || recognitionRuns(s, "celestine") > 0) {
      if (this.rng() < SONG_CHANCE * this.derived.fragmentChance) {
        const index = s.lore.songs;
        s.lore.songs = index + 1;
        this.fragment({ source: "song", index });
      }
    }
    if (storm > 0 && this.visible) this.placeCrystal(now, storm - 1);
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- ascension

  canAscend(): boolean {
    const s = this.state;
    return s.maxStage >= ASCENSION_MIN_STAGE && s.maxStage > s.runStartStage;
  }

  ascend(now: number): number {
    const s = this.state;
    if (!this.canAscend()) return 0;
    const milestones = this.milestonesNow();
    const gain = ascensionPreview(s, now);
    const skip = wandererSkip(s);
    const heldBefore = s.essences;
    const offered = s.trail.offered;
    s.essences += gain;
    s.lifetime.essencesEarned += gain;
    s.lifetime.ascensionEssences += gain;
    s.lifetime.ascensions += 1;
    s.ascensions.push({ at: now, maxStage: s.maxStage, essences: gain });
    if (s.ascensions.length > MAX_ASCENSION_HISTORY) s.ascensions.splice(0, s.ascensions.length - MAX_ASCENSION_HISTORY);
    // Recognition: companions who reached level 100 this night remember the walker a little.
    for (const hero of HEROES) {
      if (hero.id === CLICK_HERO_ID || (s.heroLevels[hero.id] ?? 0) < RECOGNITION_LEVEL) continue;
      const before = recognitionTier(s, hero.id);
      s.recognition[hero.id] = recognitionRuns(s, hero.id) + 1;
      const tier = recognitionTier(s, hero.id);
      if (tier > before) {
        this.emit({ type: "recognition", heroId: hero.id, tier });
        this.fragment({ source: "memory", hero: hero.id, tier });
      }
    }
    // Good Boy: Biscuit remembers the nights Vorn stood tall.
    if ((s.heroLevels.vorn ?? 0) >= GOOD_BOY_LEVEL) {
      s.lore.biscuit += 1;
      if (s.lore.biscuit >= GOOD_BOY_RUNS) this.discover("good-boy");
    }
    // The King's Word of this night; in his Regalia, he knows the walker.
    if (wearsRegalia(s)) s.lore.regalia += 1;
    this.emit({ type: "kingWord", night: s.lifetime.ascensions });
    this.fragment({ source: "king", night: s.lifetime.ascensions });
    // Same Road, Keep Some.
    const last = s.ascensions.slice(-SAME_ROAD_NIGHTS);
    if (last.length === SAME_ROAD_NIGHTS && last.every((record) => record.maxStage === last[0].maxStage)) this.discover("same-road");
    if (heldBefore >= KEEP_SOME_ESSENCES && offered === 0) this.discover("keep-some");

    this.resetRun(now);
    // Every seventh dusk, the next King is shadowed by his Eclipse.
    if (s.lifetime.ascensions % ECLIPSE_EVERY === 0) s.trail.eclipse = true;
    this.refresh(now);
    if (skip > 0) this.skipStages(skip);
    this.emit({ type: "ascended", essences: gain });
    this.checkNamedSources();
    this.checkMilestones(milestones);
    this.refresh(now);
    this.checkAchievements();
    return gain;
  }

  /** What every dusk takes back: gold, companions, stages, powers, the run's trail. */
  private resetRun(now: number) {
    const s = this.state;
    s.gold = memoryStartGold(altarLevel(s, "memory"));
    s.heroLevels = {};
    s.heroUpgrades = [];
    s.stage = 1;
    s.maxStage = 1;
    s.kills = 0;
    s.autoAdvance = true;
    s.monster = null;
    s.respawnIn = 0.8;
    s.bossTimeLeft = 0;
    s.skills = {};
    s.lastSkill = undefined;
    s.ritualStacks = 0;
    s.run = emptyStats();
    s.trail = emptyTrail();
    s.runStartStage = 1;
    this.refresh(now);
  }

  /**
   * Altar of the Wanderer: companions clear the first `count` stages of a new run at once,
   * with the kills and gold they would have earned there. The run starts right after them.
   */
  private skipStages(count: number) {
    const s = this.state;
    const d = this.derived;
    let gold = 0;
    let kills = 0;
    let bosses = 0;
    let kings = 0;
    for (let stage = 1; stage <= count; stage += 1) {
      if (isBossStage(stage)) {
        kills += 1;
        bosses += 1;
        if (isKingStage(stage)) kings += 1;
        gold += stageGold(stage) * bossHpMultiplier(stage) * d.goldMultiplier * (isBiomeBossStage(stage) ? d.guardianGold : 1);
        this.recordStageKills(stage, 1);
      } else {
        kills += MONSTERS_PER_STAGE;
        gold += MONSTERS_PER_STAGE * stageGold(stage) * d.goldMultiplier * (1 + d.treasureChance * 9);
        this.recordStageKills(stage, MONSTERS_PER_STAGE);
      }
    }
    this.earnGold(gold);
    s.run.kills += kills;
    s.lifetime.kills += kills;
    s.run.bosses += bosses;
    s.lifetime.bosses += bosses;
    s.lifetime.kings += kings;
    // The Eclipse waits for a King the walker fights.
    s.maxStage = count + 1;
    s.stage = count + 1;
    s.runStartStage = count + 1;
    this.emit({ type: "stage", stage: s.stage, biomeChanged: true });
  }

  buyAltar(id: AltarId, now: number): boolean {
    const s = this.state;
    if (!ALTAR_BY_ID[id]) return false;
    const level = altarLevel(s, id);
    const cost = altarPrice(s, id);
    if (!Number.isFinite(cost) || cost > s.essences) return false;
    s.essences -= cost;
    s.altars[id] = level + 1;
    s.trail.offered += cost;
    // At level five, the stone tells who raised it.
    if (level + 1 >= 5 && !s.lore.altars.includes(id)) {
      s.lore.altars.push(id);
      this.fragment({ source: "altar", id });
    }
    // That's How It Starts: everything given away in one visit to the Sanctum.
    if (givingAllAway(s)) this.discover("how-it-starts");
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- the Descent

  /**
   * The Descent (BIBLE 12.7): Eldra unweaves the Sanctum and weaves the Long Night again, one
   * thread deeper. The run, the essences and the stones go; threads are woven from the
   * essences gathered since the last Descent; relics, shards, deeds, the Chronicle and
   * Recognition stay. A few stones survive with the Remembered Stones.
   */
  descend(now: number): number {
    const s = this.state;
    if (!canDescend(s)) return 0;
    const milestones = this.milestonesNow();
    const threads = descentPreview(s);
    const keep = weaveValue(s, "remembered-stones");
    s.descents += 1;
    s.threads += threads;
    s.lifetime.threads += threads;
    s.descentMark = s.lifetime.essencesEarned;
    s.essences = 0;
    const altars: GameState["altars"] = {};
    for (const altar of ALTARS) {
      const kept = Math.floor(altarLevel(s, altar.id) * keep);
      if (kept > 0) altars[altar.id] = kept;
    }
    s.altars = altars;
    s.lore.readings.push(0);
    this.resetRun(now);
    this.emit({ type: "descended", threads });
    this.checkMilestones(milestones);
    this.refresh(now);
    this.checkAchievements();
    return threads;
  }

  buyWeave(id: WeaveId, now: number): boolean {
    const s = this.state;
    if (!WEAVE_BY_ID[id]) return false;
    const level = weaveLevel(s, id);
    const cost = weaveCost(id, level);
    if (!Number.isFinite(cost) || cost > s.threads) return false;
    s.threads -= cost;
    s.weaves[id] = level + 1;
    for (const skill of SKILLS) {
      if ("weave" in skill.unlock && skill.unlock.weave === id && level === 0) this.emit({ type: "skillUnlocked", skillId: skill.id });
    }
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- equipment

  /** A new item: in its slot when empty, else in the pack; a full pack salvages it (unless `force`). */
  private addItem(item: Item, force = false) {
    const s = this.state;
    s.lifetime.itemsFound += 1;
    if (item.rarity === "legendary") s.lifetime.legendaries += 1;
    if (item.rarity === "mythic") s.lifetime.mythics += 1;
    if (!s.equipment[item.slot]) {
      s.equipment[item.slot] = item;
    } else if (s.inventory.length >= INVENTORY_LIMIT && !force) {
      const shards = RARITY_INFO[item.rarity].shards;
      this.earnShards(shards);
      this.emit({ type: "inventoryFull", item, shards });
      return;
    } else {
      s.inventory.push(item);
    }
    this.emit({ type: "loot", item });
  }

  equip(itemUid: string, now: number): boolean {
    const s = this.state;
    const index = s.inventory.findIndex((item) => item.uid === itemUid);
    if (index < 0) return false;
    const [item] = s.inventory.splice(index, 1);
    const previous = s.equipment[item.slot];
    s.equipment[item.slot] = item;
    if (previous) s.inventory.splice(index, 0, previous);
    this.refresh(now);
    return true;
  }

  unequip(slot: ItemSlot, now: number): boolean {
    const s = this.state;
    const item = s.equipment[slot];
    if (!item || s.inventory.length >= INVENTORY_LIMIT) return false;
    delete s.equipment[slot];
    s.inventory.push(item);
    this.refresh(now);
    return true;
  }

  salvage(itemUid: string): number {
    const s = this.state;
    const index = s.inventory.findIndex((item) => item.uid === itemUid);
    if (index < 0 || s.inventory[index].locked) return 0;
    const [item] = s.inventory.splice(index, 1);
    const shards = salvageValue(item);
    this.earnShards(shards);
    // Small Change: a star broken for coins.
    if (item.rarity === "mythic") this.discover("small-change");
    return shards;
  }

  salvageUpTo(maxRarity: Rarity): number {
    const order: Rarity[] = ["common", "rare", "epic", "legendary", "mythic"];
    const limit = order.indexOf(maxRarity);
    let total = 0;
    for (const item of [...this.state.inventory]) {
      if (!item.locked && order.indexOf(item.rarity) <= limit) total += this.salvage(item.uid);
    }
    return total;
  }

  toggleLock(itemUid: string) {
    const item = this.state.inventory.find((entry) => entry.uid === itemUid);
    if (item) item.locked = !item.locked;
  }

  forge(slot: ItemSlot, now: number): boolean {
    const s = this.state;
    const item = s.equipment[slot];
    if (!item || item.forge >= FORGE_MAX) return false;
    const cost = forgePrice(s, item);
    if (cost > s.shards) return false;
    s.shards -= cost;
    item.forge += 1;
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- market

  /** The walker stops at the stall: the Stallkeeper says one thing, in turn. */
  visitMarket() {
    const s = this.state;
    const index = s.lore.sayings;
    s.lore.sayings = index + 1;
    if (index < 12) this.fragment({ source: "saying", index });
  }

  buyOffer(id: MarketOfferId, now: number): boolean {
    const s = this.state;
    const offer = MARKET_BY_ID[id];
    if (!offer) return false;
    const cost = shardPrice(s, offer.cost);
    if (cost > s.shards) return false;
    const level = Math.max(1, s.maxStageEver - 1);
    switch (id) {
      case "chest":
      case "great-chest": {
        if (s.inventory.length >= INVENTORY_LIMIT) return false;
        s.shards -= cost;
        const item = id === "chest"
          ? generateItem(this.rng, level)
          : generateItem(this.rng, level, { minimum: "epic", luck: 3 });
        this.addItem(item);
        break;
      }
      case "rage":
        s.shards -= cost;
        this.addBuff("rage", BUFF_DURATION_SECONDS, now);
        break;
      case "fortune":
        s.shards -= cost;
        this.addBuff("fortune", BUFF_DURATION_SECONDS, now);
        break;
      case "autoclick":
        s.shards -= cost;
        this.addBuff("autoclick", BUFF_DURATION_SECONDS, now);
        break;
      case "hourglass": {
        if (!this.pourHours(1, now)) return false;
        s.shards -= cost;
        break;
      }
    }
    this.refresh(now);
    return true;
  }

  /** Bottled time: hours of gold at the current rate, now. False when it would pay nothing. */
  private pourHours(hours: number, now: number): boolean {
    const s = this.state;
    const { gold, kills } = offlineGains(s, 3600 * hours, now);
    if (gold <= 0) return false;
    this.earnGold(gold);
    s.run.kills += kills;
    s.lifetime.kills += kills;
    s.lifetime.hourglasses += hours;
    this.emit({ type: "hourglass", kills });
    return true;
  }

  /** Whether the Caravan stands at the roadside this week, and what it brings. */
  caravanOpen(now: number): boolean {
    const s = this.state;
    return s.lifetime.ascensions >= CARAVAN_MIN_ASCENSIONS && s.caravanWeek !== isoWeek(now);
  }

  buyCaravan(now: number): boolean {
    const s = this.state;
    if (!this.caravanOpen(now)) return false;
    const ware = caravanWare(isoWeek(now));
    const cost = shardPrice(s, ware.cost);
    if (cost > s.shards) return false;
    const level = Math.max(1, s.maxStageEver - 1);
    switch (ware.id) {
      case "token":
        if (s.named.includes("stallkeeper-band")) return false;
        s.shards -= cost;
        this.grantNamed("stallkeeper-band");
        break;
      case "sealed-coffer":
        if (s.inventory.length >= INVENTORY_LIMIT) return false;
        s.shards -= cost;
        this.addItem(generateItem(this.rng, level, { minimum: "legendary", luck: 3 }));
        break;
      case "three-chests":
        if (s.inventory.length > INVENTORY_LIMIT - 3) return false;
        s.shards -= cost;
        for (let index = 0; index < 3; index += 1) this.addItem(generateItem(this.rng, level));
        break;
      case "bottled-night":
        if (!this.pourHours(2, now)) return false;
        s.shards -= cost;
        break;
      case "pips-cheese":
        s.shards -= cost;
        this.addBuff("cheese", CARAVAN_BUFF_SECONDS, now);
        break;
      case "moth-lantern":
        s.shards -= cost;
        this.addBuff("lantern", CARAVAN_BUFF_SECONDS, now);
        s.nextCrystalAt = Math.min(s.nextCrystalAt, now + 45_000);
        break;
      case "ember-draught":
        s.shards -= cost;
        this.addBuff("rage", BUFF_DURATION_SECONDS, now);
        this.addBuff("fortune", BUFF_DURATION_SECONDS, now);
        break;
      case "eldra-thread":
        s.shards -= cost;
        for (const state of Object.values(s.skills)) if (state) state.readyAt = Math.min(state.readyAt, now);
        break;
    }
    s.caravanWeek = isoWeek(now);
    this.meetEvent("caravan");
    this.refresh(now);
    return true;
  }

  /** A Remembrance Night, seen: lanterns in every biome and its line in the Chronicle. */
  remember(now: number) {
    if (remembranceNight(new Date(now))) this.meetEvent("remembrance");
  }

  // ---------------------------------------------------------------- achievements & tutorial

  checkAchievements() {
    const s = this.state;
    let changed = false;
    for (const achievement of ACHIEVEMENTS) {
      if (this.unlockedAchievements.has(achievement.id)) continue;
      if (achievement.metric(s) >= achievement.threshold) {
        this.unlockedAchievements.add(achievement.id);
        s.achievements.push(achievement.id);
        this.emit({ type: "achievement", id: achievement.id });
        changed = true;
      }
    }
    if (changed) this.refresh(s.lastTickAt);
  }

  completeTutorial(step: string) {
    if (!this.state.tutorial.done.includes(step)) this.state.tutorial.done.push(step);
  }
}

export function salvageValue(item: Item): number {
  return RARITY_INFO[item.rarity].shards + Math.floor(item.forge * RARITY_INFO[item.rarity].shards * 0.5);
}
