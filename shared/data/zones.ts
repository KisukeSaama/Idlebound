import type { Zone } from "../types/game";

export const ZONES: Zone[] = [
  { id: "green-plains", name: "Plaines verdoyantes", description: "Des collines calmes ou les menaces restent modestes.", recommendedLevel: 1, enemiesToBoss: 8, enemyIds: ["field-rat", "wild-boar"], bossId: "moss-alpha" },
  { id: "dark-forest", name: "Foret sombre", description: "Un bois dense traverse par des ombres affamees.", recommendedLevel: 4, enemiesToBoss: 12, enemyIds: ["shade-wolf", "briar-witch"], bossId: "old-grove" },
  { id: "forgotten-caves", name: "Cavernes oubliees", description: "Des galeries froides ou chaque echo semble vivant.", recommendedLevel: 6, enemiesToBoss: 16, enemyIds: ["blind-crawler", "echo-bat"], bossId: "stone-devourer" },
  { id: "corrupted-marsh", name: "Marais corrompu", description: "Une fange toxique avale les routes et les imprudents.", recommendedLevel: 8, enemiesToBoss: 20, enemyIds: ["bog-remnant", "plague-stag"], bossId: "rot-baron" },
  { id: "fallen-king-ruins", name: "Ruines du roi dechu", description: "Les derniers murs d'un royaume condamne vibrent encore de magie.", recommendedLevel: 10, enemiesToBoss: 24, enemyIds: ["fallen-sentinel", "crown-wraith"], bossId: "ruined-king" }
];
