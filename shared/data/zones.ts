import type { Zone } from "../types/game";

export const ZONES: Zone[] = [
  { id: "green-plains", name: "Plaines verdoyantes", description: "Des collines calmes où les menaces restent modestes.", backgroundImage: "/assets/zones/green-plains.png", recommendedLevel: 1, enemiesToBoss: 8, enemyIds: ["field-rat", "wild-boar"], bossId: "moss-alpha" },
  { id: "dark-forest", name: "Forêt sombre", description: "Un bois dense traversé par des ombres affamées.", backgroundImage: "/assets/zones/dark-forest.png", recommendedLevel: 4, enemiesToBoss: 12, enemyIds: ["shade-wolf", "briar-witch"], bossId: "old-grove" },
  { id: "forgotten-caves", name: "Cavernes oubliées", description: "Des galeries froides où chaque écho semble vivant.", backgroundImage: "/assets/zones/forgotten-caves.png", recommendedLevel: 6, enemiesToBoss: 16, enemyIds: ["blind-crawler", "echo-bat"], bossId: "stone-devourer" },
  { id: "corrupted-marsh", name: "Marais corrompu", description: "Une fange toxique avale les routes et les imprudents.", backgroundImage: "/assets/zones/corrupted-marsh.png", recommendedLevel: 8, enemiesToBoss: 20, enemyIds: ["bog-remnant", "plague-stag"], bossId: "rot-baron" },
  { id: "fallen-king-ruins", name: "Ruines du roi déchu", description: "Les derniers murs d'un royaume condamné vibrent encore de magie.", backgroundImage: "/assets/zones/fallen-king-ruins.png", recommendedLevel: 10, enemiesToBoss: 24, enemyIds: ["fallen-sentinel", "crown-wraith"], bossId: "ruined-king" }
];
