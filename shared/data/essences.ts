import type { EssenceUpgradeDefinition } from "../types/game";

export const ESSENCE_UPGRADES: EssenceUpgradeDefinition[] = [
  { id: "force", name: "Force infusee", description: "Augmente l'attaque permanente.", stat: "attack", baseCost: 4, costMultiplier: 1.55, valuePerRank: 3, maxRank: 20 },
  { id: "guard", name: "Garde runique", description: "Augmente la defense permanente.", stat: "defense", baseCost: 4, costMultiplier: 1.55, valuePerRank: 2, maxRank: 20 },
  { id: "vitality", name: "Vitalite ancienne", description: "Augmente les points de vie maximum.", stat: "maxHp", baseCost: 5, costMultiplier: 1.6, valuePerRank: 18, maxRank: 20 },
  { id: "wisdom", name: "Memoire du combat", description: "Augmente les gains d'experience.", stat: "experienceGain", baseCost: 6, costMultiplier: 1.65, valuePerRank: 0.04, maxRank: 15 },
  { id: "fortune", name: "Fortune liee", description: "Augmente les gains d'or.", stat: "goldGain", baseCost: 6, costMultiplier: 1.65, valuePerRank: 0.04, maxRank: 15 },
  { id: "hunger", name: "Instinct de trouvaille", description: "Augmente legerement les chances de butin.", stat: "dropRate", baseCost: 8, costMultiplier: 1.7, valuePerRank: 0.015, maxRank: 10 }
];
