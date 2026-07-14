import { LEVEL_UP_GAINS } from "../constants/balance";
import type { Player } from "../types/game";
import { experienceToNextLevel } from "./formulas";

export function applyExperience(player: Player, gainedExperience: number): { player: Player; levelsGained: number } {
  let nextPlayer = { ...player, experience: player.experience + gainedExperience };
  let levelsGained = 0;

  while (nextPlayer.experience >= nextPlayer.experienceToNext) {
    nextPlayer = {
      ...nextPlayer,
      level: nextPlayer.level + 1,
      experience: nextPlayer.experience - nextPlayer.experienceToNext,
      baseStats: {
        maxHp: nextPlayer.baseStats.maxHp + LEVEL_UP_GAINS.maxHp,
        attack: nextPlayer.baseStats.attack + LEVEL_UP_GAINS.attack,
        defense: nextPlayer.baseStats.defense + LEVEL_UP_GAINS.defense,
        attackSpeed: nextPlayer.baseStats.attackSpeed
      },
      experienceToNext: experienceToNextLevel(nextPlayer.level + 1)
    };
    nextPlayer.currentHp = nextPlayer.baseStats.maxHp;
    levelsGained += 1;
  }

  return { player: nextPlayer, levelsGained };
}
