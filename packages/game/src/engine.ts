import { ACHIEVEMENTS } from "./data/achievements";
import { ALTAR_BY_ID, altarCost } from "./data/altars";
import { TREASURE_MONSTER, biomeForStage, eraVariant, isBiomeBossStage, isBossStage } from "./data/biomes";
import { CLICK_HERO_ID, HEROES, HERO_BY_ID, UPGRADE_BY_ID } from "./data/heroes";
import { FORGE_MAX, INVENTORY_LIMIT, RARITY_INFO, forgeCost } from "./data/items";
import { BUFF_DURATION_SECONDS, BUFF_MAX_SECONDS, MARKET_BY_ID, type MarketOfferId } from "./data/market";
import { SKILLS, SKILL_BY_ID } from "./data/skills";
import {
  ASCENSION_MIN_STAGE,
  BOSS_RESPAWN_SECONDS,
  MAX_STAGE,
  MONSTERS_PER_STAGE,
  RESPAWN_SECONDS,
  altarLevel,
  ascensionPreview,
  wandererSkip,
  bossHp,
  bossHpMultiplier,
  derive,
  heroCost,
  heroCostMultiplier,
  maxAffordableLevels,
  memoryStartGold,
  OFFLINE_CAP_SECONDS,
  skillCooldownMultiplier,
  stageGold,
  stageHp,
  upgradeCost
} from "./formulas";
import { generateItem } from "./loot";
import { pick, randomInt, uid, type Rng } from "./rng";
import { emptyStats } from "./state";
import type { AltarId, BuffId, BuyMode, Derived, GameEvent, GameState, Item, ItemSlot, OfflineSummary, Rarity, SkillId } from "./types";

/** Past this gap between two ticks, gains are computed in one catch-up instead of simulated. */
const CATCH_UP_THRESHOLD_MS = 5_000;
/** Offline progress is simulated in slices of this many (effective) seconds, spending in between. */
const OFFLINE_SLICE_SECONDS = 60;
/** Most purchase batches per offline slice. */
const OFFLINE_SPEND_ROUNDS = 200;
/** While the player is away from an open tab, the autopilot acts this often (like an offline slice). */
const AUTOPILOT_INTERVAL_SECONDS = OFFLINE_SLICE_SECONDS;
const MAX_ASCENSION_HISTORY = 100;

export function isSkillUnlocked(state: GameState, id: SkillId): boolean {
  const skill = SKILL_BY_ID[id];
  return (state.heroLevels[skill.unlock.heroId] ?? 0) >= skill.unlock.level;
}

export function offlineGains(state: GameState, seconds: number, now: number): { kills: number; gold: number } {
  const derived = derive(state, now, { ignoreTimed: true, forceIdle: true });
  if (derived.dps <= 0 || seconds <= 0) return { kills: 0, gold: 0 };
  const farmStage = isBossStage(state.stage) ? Math.max(1, state.stage - 1) : state.stage;
  const timePerKill = stageHp(farmStage) / derived.dps + RESPAWN_SECONDS;
  const kills = Math.floor(seconds / timePerKill);
  const gold = kills * stageGold(farmStage) * derived.goldMultiplier * (1 + derived.treasureChance * 9);
  return { kills, gold: Math.floor(gold) };
}

function levelSum(state: GameState): number {
  return Object.values(state.heroLevels).reduce((total, level) => total + level, 0);
}

export class GameEngine {
  state: GameState;
  derived: Derived;
  rng: Rng;
  /** Set by the UI: no crystal spawns while the tab is hidden. */
  visible = true;
  /**
   * Set by the UI: without player input for this long, the autopilot takes over (buying,
   * retrying bosses). Null (simulations, tests): never.
   */
  afkAfterMs: number | null = null;
  private lastInputAt = 0;
  private autopilotTimer = 0;
  private events: GameEvent[] = [];
  private autoClickAccumulator = 0;
  private achievementTimer = 0;
  /** Companion damage dealt since the last "dps" event (one per second, for the UI). */
  private companionDamage = 0;
  private companionTimer = 0;
  private unlockedAchievements: Set<string>;

  constructor(state: GameState, rng: Rng = Math.random, now = Date.now()) {
    this.state = state;
    this.rng = rng;
    this.unlockedAchievements = new Set(state.achievements);
    this.derived = derive(state, now);
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
    const until = Math.min(start + seconds * 1000, now + BUFF_MAX_SECONDS * 1000);
    if (existing) existing.until = until;
    else s.buffs.push({ id, until });
  }

  // ---------------------------------------------------------------- loop

  /**
   * Advances the simulation to `now`. Returns the summary of a catch-up when one happened,
   * however short: a throttled background tab catches up in many small steps.
   */
  tick(now: number): OfflineSummary | null {
    const s = this.state;
    const gapMs = now - s.lastTickAt;
    if (gapMs <= 0) return null;

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
    s.buffs = s.buffs.filter((buff) => buff.until > now);
    this.updateCrystal(now);
    this.refresh(now);
    const d = this.derived;

    if (!s.monster) {
      s.respawnIn -= dt;
      if (s.respawnIn <= 0) this.spawn();
    } else {
      if (d.autoClicksPerSecond > 0) {
        this.autoClickAccumulator += d.autoClicksPerSecond * dt;
        while (this.autoClickAccumulator >= 1 && s.monster) {
          this.autoClickAccumulator -= 1;
          this.strike(now, "auto");
        }
      }
      if (s.monster && d.dps > 0) {
        const bossFactor = s.monster.kind === "boss" || s.monster.kind === "miniboss" ? d.bossDamage : 1;
        const amount = d.dps * dt * bossFactor;
        this.companionDamage += amount;
        this.damage(amount, now);
      }
      if (s.monster && (s.monster.kind === "boss" || s.monster.kind === "miniboss")) {
        s.bossTimeLeft -= dt;
        if (s.bossTimeLeft <= 0) this.failBoss();
      }
    }

    this.companionTimer += dt;
    if (this.companionTimer >= 1) {
      if (this.companionDamage > 0) this.emit({ type: "dps", damage: this.companionDamage });
      this.companionTimer = 0;
      this.companionDamage = 0;
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

  /** The player is here (any action or input on the page). */
  markInput(now: number) {
    this.lastInputAt = now;
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
    const d = derive(s, now, { ignoreTimed: true, forceIdle: true });
    return d.dps > 0 && bossHp(s.maxStage) <= d.dps * d.bossDamage * d.bossTimer;
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
    const capped = Math.min(seconds, OFFLINE_CAP_SECONDS);
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
    let shards = 0;
    let spent = 0;
    let blockedAt: number | null = null;
    s.stage = s.maxStage;

    while (remaining > 0) {
      if (spending) spent += this.autoSpend(now);
      const d = derive(s, now, { ignoreTimed: true, forceIdle: true });
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
          const fight = bossHp(stage) / (d.dps * d.bossDamage);
          if (fight > d.bossTimer) { blockedAt = stage; break; }
          if (fight + BOSS_RESPAWN_SECONDS > time) break;
          time -= fight + BOSS_RESPAWN_SECONDS;
          kills += 1;
          bosses += 1;
          sliceGold += stageGold(stage) * bossHpMultiplier(stage) * d.goldMultiplier;
          if (isBiomeBossStage(stage)) shards += 1 + Math.floor(stage / 25);
        } else {
          const perKill = stageHp(stage) / d.dps + RESPAWN_SECONDS;
          const needed = MONSTERS_PER_STAGE - s.kills;
          const done = Math.min(needed, Math.floor(time / perKill));
          time -= done * perKill;
          kills += done;
          sliceGold += done * stageGold(stage) * d.goldMultiplier * (1 + d.treasureChance * 9);
          s.kills += done;
          if (done < needed) break;
        }
        s.maxStage += 1;
        s.kills = 0;
        if (s.maxStage > s.maxStageEver) s.maxStageEver = s.maxStage;
        s.stage = s.maxStage;
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
    this.earnShards(shards);
    s.lifetime.offlineSeconds += capped;
    s.buffs = s.buffs.filter((buff) => buff.until > now);
    if (s.crystal && s.crystal.expiresAt < now) s.crystal = null;
    // Purchases made while away are summed up in the summary, not replayed as effects.
    this.events = [...this.events.slice(0, eventMark), ...this.events.slice(eventMark).filter((event) => event.type === "skillUnlocked")];
    if (s.stage !== startStage) {
      s.monster = null;
      s.respawnIn = 0.25;
      s.bossTimeLeft = 0;
      this.emit({ type: "stage", stage: s.stage, biomeChanged: biomeForStage(s.stage).id !== biomeForStage(startStage).id });
    }
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
   * Spending while away: every affordable talent, then companion levels by best DPS gained
   * per gold, a batch at a time (up to the next 25-level milestone). Returns the gold spent.
   */
  private autoSpend(now: number): number {
    const s = this.state;
    const goldBefore = s.gold;
    const multiplier = heroCostMultiplier(s);
    for (let round = 0; round < OFFLINE_SPEND_ROUNDS; round += 1) {
      this.buyAllUpgrades(now);
      const base = derive(s, now, { ignoreTimed: true, forceIdle: true }).dps;
      let best: { id: string; count: number; ratio: number } | null = null;
      for (const hero of HEROES) {
        if (hero.id === CLICK_HERO_ID) continue;
        const level = s.heroLevels[hero.id] ?? 0;
        // Companions are hired in order, as in the shop.
        if (level === 0 && hero.index > 1 && (s.heroLevels[HEROES[hero.index - 1].id] ?? 0) === 0) continue;
        const count = Math.min(25 - (level % 25), maxAffordableLevels(hero, level, s.gold, multiplier));
        if (count <= 0) continue;
        s.heroLevels[hero.id] = level + count;
        const gain = derive(s, now, { ignoreTimed: true, forceIdle: true }).dps - base;
        s.heroLevels[hero.id] = level;
        const ratio = gain / heroCost(hero, level, count, multiplier);
        if (ratio > 0 && (!best || ratio > best.ratio)) best = { id: hero.id, count, ratio };
      }
      if (!best || !this.buyHero(best.id, best.count, now)) break;
    }
    return goldBefore - s.gold;
  }

  // ---------------------------------------------------------------- combat

  private spawn() {
    const s = this.state;
    const d = this.derived;
    const stage = s.stage;
    const biome = biomeForStage(stage);
    let kind: "normal" | "treasure" | "miniboss" | "boss" = "normal";
    let def = pick(this.rng, biome.monsters);
    let hp = stageHp(stage);
    let gold = stageGold(stage);

    if (isBossStage(stage)) {
      kind = isBiomeBossStage(stage) ? "boss" : "miniboss";
      def = kind === "boss" ? biome.boss : biome.miniBoss;
      hp = bossHp(stage);
      gold = stageGold(stage) * bossHpMultiplier(stage);
      s.bossTimeLeft = d.bossTimer;
    } else if (this.rng() < d.treasureChance) {
      kind = "treasure";
      def = TREASURE_MONSTER;
      gold = stageGold(stage) * 10;
    }

    const variant = kind === "treasure" ? def : eraVariant(def, stage);
    s.monster = {
      id: variant.id,
      image: variant.image,
      filter: variant.filter,
      scale: variant.scale ?? 1,
      hp,
      maxHp: hp,
      kind,
      gold
    };
    this.emit({ type: "spawn", monster: s.monster });
  }

  click(now: number) {
    const s = this.state;
    const hadIdleBonus = this.derived.idleRatio > 0;
    s.lastClickAt = now;
    if (hadIdleBonus) this.refresh(now);
    if (!s.monster) return;
    this.strike(now, "click");
  }

  private strike(now: number, source: "click" | "auto") {
    const s = this.state;
    const d = this.derived;
    if (!s.monster) return;
    const crit = this.rng() < d.critChance;
    const bossFactor = s.monster.kind === "boss" || s.monster.kind === "miniboss" ? d.bossDamage : 1;
    const damage = d.click * (crit ? d.critMultiplier : 1) * bossFactor;
    if (source === "click") {
      s.run.clicks += 1;
      s.lifetime.clicks += 1;
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
    if (!monster) return;
    monster.hp -= amount;
    if (monster.hp <= 0) this.kill(now);
  }

  private kill(now: number) {
    const s = this.state;
    const monster = s.monster;
    if (!monster) return;
    const isBoss = monster.kind === "boss" || monster.kind === "miniboss";
    const gold = monster.gold * this.derived.goldMultiplier;
    this.earnGold(gold);
    s.run.kills += 1;
    s.lifetime.kills += 1;
    if (monster.kind === "treasure") {
      s.run.treasures += 1;
      s.lifetime.treasures += 1;
    }

    let shards = 0;
    if (isBoss) {
      s.run.bosses += 1;
      s.lifetime.bosses += 1;
      // Shards and items only drop from the boss that blocks progression: a boss already
      // beaten in this run and replayed from the stage selector pays gold only.
      if (s.stage === s.maxStage) {
        shards = monster.kind === "boss" ? 1 + Math.floor(s.stage / 25) : this.rng() < 0.35 ? 1 : 0;
        this.earnShards(shards);
        const firstClear = s.stage >= s.maxStageEver;
        const chance = monster.kind === "boss" ? 0.4 : 0.15;
        if ((monster.kind === "boss" && firstClear) || this.rng() < chance) {
          this.addItem(generateItem(this.rng, s.stage, { luck: monster.kind === "boss" ? 2 : 1 }));
        }
      }
    }

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
    void now;
  }

  private advance() {
    const s = this.state;
    if (s.maxStage >= MAX_STAGE) return;
    s.maxStage += 1;
    s.kills = 0;
    if (s.maxStage > s.maxStageEver) s.maxStageEver = s.maxStage;
    if (s.autoAdvance) this.setStage(s.maxStage);
  }

  private failBoss() {
    const s = this.state;
    s.lifetime.bossFails += 1;
    this.emit({ type: "bossFailed", stage: s.stage });
    s.monster = null;
    s.respawnIn = 0.6;
    s.bossTimeLeft = 0;
    if (s.stage === s.maxStage && s.stage > 1) {
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
      if (skill.unlock.heroId === heroId && before < skill.unlock.level && before + count >= skill.unlock.level) {
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
    if (id === "ritual") s.ritualStacks += 1;

    s.skills[id] = {
      activeUntil: now + def.duration * 1000,
      readyAt: now + def.cooldown * skillCooldownMultiplier(s) * 1000
    };
    if (id !== "echo") s.lastSkill = id;
    s.run.skillsUsed += 1;
    s.lifetime.skillsUsed += 1;
    this.emit({ type: "skill", skillId: id });
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- wandering crystals

  private updateCrystal(now: number) {
    const s = this.state;
    if (s.crystal && s.crystal.expiresAt < now) s.crystal = null;
    if (!s.crystal && this.visible && now >= s.nextCrystalAt) {
      s.crystal = {
        id: uid(this.rng),
        expiresAt: now + 13_000,
        x: 12 + this.rng() * 70,
        y: 16 + this.rng() * 48
      };
      s.nextCrystalAt = now + (90 + this.rng() * 150) * 1000;
      this.emit({ type: "crystalSpawned" });
    }
  }

  clickCrystal(now: number): boolean {
    const s = this.state;
    if (!s.crystal || s.crystal.expiresAt < now) return false;
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
      const shards = randomInt(this.rng, 2, 6);
      this.earnShards(shards);
      this.emit({ type: "crystal", reward: "shards", amount: shards });
    } else {
      const essences = crystalEssenceReward(s.maxStageEver);
      s.essences += essences;
      s.lifetime.essencesEarned += essences;
      this.emit({ type: "crystal", reward: "essence", amount: essences });
    }
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
    const gain = ascensionPreview(s, now);
    const skip = wandererSkip(s);
    s.essences += gain;
    s.lifetime.essencesEarned += gain;
    s.lifetime.ascensions += 1;
    s.ascensions.push({ at: now, maxStage: s.maxStage, essences: gain });
    if (s.ascensions.length > MAX_ASCENSION_HISTORY) s.ascensions.splice(0, s.ascensions.length - MAX_ASCENSION_HISTORY);

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
    s.runStartStage = 1;
    this.refresh(now);
    if (skip > 0) this.skipStages(skip);
    this.emit({ type: "ascended", essences: gain });
    this.refresh(now);
    this.checkAchievements();
    return gain;
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
    for (let stage = 1; stage <= count; stage += 1) {
      if (isBossStage(stage)) {
        kills += 1;
        bosses += 1;
        gold += stageGold(stage) * bossHpMultiplier(stage) * d.goldMultiplier;
      } else {
        kills += MONSTERS_PER_STAGE;
        gold += MONSTERS_PER_STAGE * stageGold(stage) * d.goldMultiplier * (1 + d.treasureChance * 9);
      }
    }
    this.earnGold(gold);
    s.run.kills += kills;
    s.lifetime.kills += kills;
    s.run.bosses += bosses;
    s.lifetime.bosses += bosses;
    s.maxStage = count + 1;
    s.stage = count + 1;
    s.runStartStage = count + 1;
    this.emit({ type: "stage", stage: s.stage, biomeChanged: true });
  }

  buyAltar(id: AltarId, now: number): boolean {
    const s = this.state;
    if (!ALTAR_BY_ID[id]) return false;
    const level = altarLevel(s, id);
    const cost = altarCost(id, level);
    if (!Number.isFinite(cost) || cost > s.essences) return false;
    s.essences -= cost;
    s.altars[id] = level + 1;
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- equipment

  private addItem(item: Item) {
    const s = this.state;
    s.lifetime.itemsFound += 1;
    if (item.rarity === "legendary") s.lifetime.legendaries += 1;
    if (item.rarity === "mythic") s.lifetime.mythics += 1;
    if (!s.equipment[item.slot]) {
      s.equipment[item.slot] = item;
    } else if (s.inventory.length >= INVENTORY_LIMIT) {
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
    const cost = forgeCost(item.rarity, item.forge);
    if (cost > s.shards) return false;
    s.shards -= cost;
    item.forge += 1;
    this.refresh(now);
    return true;
  }

  // ---------------------------------------------------------------- market

  buyOffer(id: MarketOfferId, now: number): boolean {
    const s = this.state;
    const offer = MARKET_BY_ID[id];
    if (!offer || offer.cost > s.shards) return false;
    const level = Math.max(1, s.maxStageEver - 1);
    switch (id) {
      case "chest":
      case "great-chest": {
        if (s.inventory.length >= INVENTORY_LIMIT) return false;
        s.shards -= offer.cost;
        const item = id === "chest"
          ? generateItem(this.rng, level)
          : generateItem(this.rng, level, { minimum: "epic", luck: 3 });
        this.addItem(item);
        break;
      }
      case "rage":
        s.shards -= offer.cost;
        this.addBuff("rage", BUFF_DURATION_SECONDS, now);
        break;
      case "fortune":
        s.shards -= offer.cost;
        this.addBuff("fortune", BUFF_DURATION_SECONDS, now);
        break;
      case "autoclick":
        s.shards -= offer.cost;
        this.addBuff("autoclick", BUFF_DURATION_SECONDS, now);
        break;
      case "hourglass": {
        const { gold, kills } = offlineGains(s, 3600, now);
        if (gold <= 0) return false;
        s.shards -= offer.cost;
        this.earnGold(gold);
        s.run.kills += kills;
        s.lifetime.kills += kills;
        s.lifetime.hourglasses += 1;
        this.emit({ type: "hourglass", kills });
        break;
      }
    }
    this.refresh(now);
    return true;
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

export function crystalEssenceReward(maxStageEver: number): number {
  return 1 + Math.floor(maxStageEver / 100);
}
