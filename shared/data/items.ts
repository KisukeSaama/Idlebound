import type { EquipmentItem } from "../types/game";

export const ITEM_CATALOG: EquipmentItem[] = [
  { id: "rusty-sword", name: "Lame de recrue", slot: "weapon", rarity: "common", level: 1, attackBonus: 5, defenseBonus: 0, hpBonus: 0, price: 35, upgradeLevel: 0, upgradeValue: 2, source: "shop" },
  { id: "padded-vest", name: "Gilet matelasse", slot: "armor", rarity: "common", level: 1, attackBonus: 0, defenseBonus: 3, hpBonus: 20, price: 35, upgradeLevel: 0, upgradeValue: 2, source: "shop" },
  { id: "copper-ring", name: "Anneau de cuivre", slot: "accessory", rarity: "common", level: 1, attackBonus: 1, defenseBonus: 1, hpBonus: 12, price: 30, upgradeLevel: 0, upgradeValue: 1, source: "shop" },
  { id: "thorn-axe", name: "Hache d'epines", slot: "weapon", rarity: "uncommon", level: 3, attackBonus: 12, defenseBonus: 0, hpBonus: 0, price: 120, upgradeLevel: 0, upgradeValue: 3, source: "shop" },
  { id: "shade-cloak", name: "Cape d'ombre", slot: "armor", rarity: "uncommon", level: 4, attackBonus: 0, defenseBonus: 8, hpBonus: 42, price: 150, upgradeLevel: 0, upgradeValue: 3, source: "shop" },
  { id: "cavern-charm", name: "Charme des cavernes", slot: "accessory", rarity: "uncommon", level: 5, attackBonus: 5, defenseBonus: 3, hpBonus: 25, price: 180, upgradeLevel: 0, upgradeValue: 2, source: "shop" },
  { id: "marsh-cleaver", name: "Tranchoir du marais", slot: "weapon", rarity: "rare", level: 7, attackBonus: 27, defenseBonus: 0, hpBonus: 0, price: 420, upgradeLevel: 0, upgradeValue: 5, source: "shop" },
  { id: "kingguard-plate", name: "Cuirasse du roi dechu", slot: "armor", rarity: "rare", level: 9, attackBonus: 0, defenseBonus: 24, hpBonus: 120, price: 640, upgradeLevel: 0, upgradeValue: 6, source: "shop" },
  { id: "ember-signet", name: "Sceau de braise", slot: "accessory", rarity: "epic", level: 10, attackBonus: 18, defenseBonus: 12, hpBonus: 90, price: 1100, upgradeLevel: 0, upgradeValue: 7, source: "drop" }
];

export const STARTER_ITEMS: EquipmentItem[] = [
  { id: "training-blade", name: "Epee d'entrainement", slot: "weapon", rarity: "common", level: 1, attackBonus: 2, defenseBonus: 0, hpBonus: 0, price: 0, upgradeLevel: 0, upgradeValue: 1, source: "starter" },
  { id: "worn-mail", name: "Maille usee", slot: "armor", rarity: "common", level: 1, attackBonus: 0, defenseBonus: 1, hpBonus: 10, price: 0, upgradeLevel: 0, upgradeValue: 1, source: "starter" }
];
