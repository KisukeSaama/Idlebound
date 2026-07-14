import { COMBAT_TICK_MS, INVENTORY_LIMIT, RECOVERY_SECONDS } from "../../../shared/constants/balance";
import { ENEMIES } from "../../../shared/data/enemies";
import { ZONES } from "../../../shared/data/zones";
import type { CombatLogEntry, CombatantState, Enemy, GameState, RewardBundle } from "../../../shared/types/game";
import { calculateDamage, calculateStats } from "../../../shared/game/formulas";
import { applyExperience } from "../../../shared/game/progression";
import { generateRewards } from "../../../shared/game/rewards";
import { autoAttackDamage, autoAttackInterval, critChance, manualClickDamage } from "../../../shared/game/clicker";

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function log(message: string, tone: CombatLogEntry["tone"] = "neutral"): CombatLogEntry {
  return { id: id("log"), message, tone, createdAt: Date.now() };
}

export function getSelectedZone(state: GameState) {
  return ZONES.find((zone) => zone.id === state.zoneProgress.selectedZoneId) ?? ZONES[0];
}

export function getNextEnemy(state: GameState): Enemy {
  const zone = getSelectedZone(state);
  if (state.zoneProgress.fightingBoss || state.zoneProgress.bossReady[zone.id]) {
    return ENEMIES.find((enemy) => enemy.id === zone.bossId)!;
  }
  const index = (state.zoneProgress.killsByZone[zone.id] ?? 0) % zone.enemyIds.length;
  return ENEMIES.find((enemy) => enemy.id === zone.enemyIds[index])!;
}

export function createEnemyCombatant(enemy: Enemy): CombatantState {
  return {
    id: enemy.id,
    name: enemy.name,
    maxHp: enemy.maxHp,
    currentHp: enemy.maxHp,
    attack: enemy.attack,
    defense: enemy.defense,
    attackSpeed: enemy.attackSpeed,
    isBoss: enemy.isBoss
  };
}

export function ensureCombat(state: GameState): GameState {
  if (state.combat.enemy && state.combat.status === "fighting") return state;
  const enemy = getNextEnemy(state);
  return {
    ...state,
    combat: {
      ...state.combat,
      enemy: createEnemyCombatant(enemy),
      status: "fighting",
      playerAttackTimer: 0,
      enemyAttackTimer: 0,
      floatingTexts: [],
      log: [log(`${enemy.name} approche.`, enemy.isBoss ? "bad" : "neutral"), ...state.combat.log].slice(0, 24)
    }
  };
}

function rollOutgoingDamage(baseDamage: number, state: GameState, random = Math.random): { damage: number; critical: boolean } {
  const critical = random() < critChance(state.clicker);
  return {
    damage: critical ? Math.floor(baseDamage * 2) : baseDamage,
    critical
  };
}

function applyRewards(state: GameState, rewards: RewardBundle, enemy: Enemy): GameState {
  const xpResult = applyExperience(state.player, rewards.experience);
  const inventorySpace = Math.max(0, INVENTORY_LIMIT - state.inventory.length);
  const acceptedItems = rewards.items.slice(0, inventorySpace);
  const zone = getSelectedZone(state);
  const previousKills = state.zoneProgress.killsByZone[zone.id] ?? 0;
  const nextKills = enemy.isBoss ? previousKills : previousKills + 1;
  const bossReady = nextKills >= zone.enemiesToBoss && !state.zoneProgress.bossDefeated[zone.id];
  const zoneIndex = ZONES.findIndex((entry) => entry.id === zone.id);
  const nextZone = ZONES[zoneIndex + 1];
  const unlockedZoneIds =
    enemy.isBoss && nextZone && !state.zoneProgress.unlockedZoneIds.includes(nextZone.id)
      ? [...state.zoneProgress.unlockedZoneIds, nextZone.id]
      : state.zoneProgress.unlockedZoneIds;

  const messages = [
    log(`Victoire contre ${enemy.name}.`, "good"),
    log(`+${rewards.experience} XP, +${rewards.gold} or${rewards.essences ? `, +${rewards.essences} essence(s)` : ""}.`, "loot"),
    ...acceptedItems.map((item) => log(`Butin obtenu : ${item.name}.`, "loot")),
    ...(xpResult.levelsGained > 0 ? [log(`Niveau ${xpResult.player.level} atteint.`, "good")] : []),
    ...(bossReady && !enemy.isBoss ? [log("Le boss de la zone est pret.", "bad")] : []),
    ...(enemy.isBoss && nextZone ? [log(`${nextZone.name} debloquee.`, "good")] : [])
  ];

  const healedPlayer = {
    ...xpResult.player,
    gold: xpResult.player.gold + rewards.gold,
    essences: xpResult.player.essences + rewards.essences
  };

  return {
    ...state,
    player: healedPlayer,
    inventory: [...state.inventory, ...acceptedItems],
    zoneProgress: {
      ...state.zoneProgress,
      unlockedZoneIds,
      killsByZone: { ...state.zoneProgress.killsByZone, [zone.id]: enemy.isBoss ? 0 : nextKills },
      bossReady: { ...state.zoneProgress.bossReady, [zone.id]: enemy.isBoss ? false : bossReady },
      bossDefeated: { ...state.zoneProgress.bossDefeated, [zone.id]: enemy.isBoss ? true : Boolean(state.zoneProgress.bossDefeated[zone.id]) },
      fightingBoss: false
    },
    combat: {
      ...state.combat,
      enemy: undefined,
      status: "victory",
      lastRewards: rewards,
      playerAttackTimer: 0,
      enemyAttackTimer: 0,
      floatingTexts: [],
      log: [...messages, ...state.combat.log].slice(0, 24)
    },
    notifications: [...messages.map((entry) => entry.message), ...state.notifications].slice(0, 8)
  };
}

export function tickCombat(inputState: GameState, deltaSeconds = COMBAT_TICK_MS / 1000): GameState {
  let state = ensureCombat(inputState);
  if (!state.combat.enemy) return state;
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const interval = autoAttackInterval(state.clicker);
  let playerAttackTimer = state.combat.playerAttackTimer + deltaSeconds;
  const messages: CombatLogEntry[] = [];

  if (Number.isFinite(interval) && playerAttackTimer >= interval) {
    playerAttackTimer = 0;
    const damage = calculateDamage(autoAttackDamage(stats, state.clicker), state.combat.enemy.defense * 0.25);
    messages.push(log(`Auto-attaque : ${damage} dégâts.`, "good"));
    return damageEnemy(state, damage, messages);
  }

  return {
    ...state,
    combat: {
      ...state.combat,
      status: "fighting",
      playerAttackTimer,
      log: [...messages, ...state.combat.log].slice(0, 24)
    }
  };
}

export function damageEnemy(state: GameState, damage: number, messages: CombatLogEntry[] = []): GameState {
  const fightingState = ensureCombat(state);
  if (!fightingState.combat.enemy) return fightingState;
  const enemyDefinition = ENEMIES.find((enemy) => enemy.id === fightingState.combat.enemy?.id)!;
  const enemyHp = fightingState.combat.enemy.currentHp - damage;
  const floatingTexts = [{
    id: id("float"),
    target: "enemy" as const,
    label: `${damage}`,
    tone: "damage" as const
  }];

  if (enemyHp <= 0) {
    const rewards = generateRewards(enemyDefinition, fightingState.essenceUpgrades);
    return applyRewards(
      {
        ...fightingState,
        combat: {
          ...fightingState.combat,
          enemy: { ...fightingState.combat.enemy, currentHp: 0 },
          floatingTexts
        }
      },
      rewards,
      enemyDefinition
    );
  }

  return {
    ...fightingState,
    combat: {
      ...fightingState.combat,
      enemy: { ...fightingState.combat.enemy, currentHp: enemyHp },
      status: "fighting",
      floatingTexts,
      log: [...messages, ...fightingState.combat.log].slice(0, 24)
    }
  };
}

export function manualAttack(state: GameState): GameState {
  const fightingState = ensureCombat(state);
  if (!fightingState.combat.enemy) return fightingState;
  const stats = calculateStats(fightingState.player, fightingState.equipment, fightingState.essenceUpgrades);
  const rolled = rollOutgoingDamage(manualClickDamage(stats, fightingState.clicker), fightingState);
  return damageEnemy(fightingState, rolled.damage, [
    log(`${rolled.critical ? "Coup critique ! " : ""}Clic : ${rolled.damage} dégâts.`, "good")
  ]);
}
