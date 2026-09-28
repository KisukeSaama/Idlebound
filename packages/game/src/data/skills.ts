import type { SkillDef, SkillId } from "../types";
import { lookup } from "./lookup";

/** Active powers (keys 1 to 7). Names and descriptions live in `content/`. */
export const SKILLS: SkillDef[] = [
  {
    id: "frenzy",
    hotkey: "1",
    duration: 30,
    cooldown: 600,
    unlock: { heroId: "aldric", level: 10 }
  },
  {
    id: "rally",
    hotkey: "2",
    duration: 30,
    cooldown: 600,
    unlock: { heroId: "maelle", level: 25 }
  },
  {
    id: "hawkeye",
    hotkey: "3",
    duration: 30,
    cooldown: 1_200,
    unlock: { heroId: "ysolde", level: 25 }
  },
  {
    id: "goldrain",
    hotkey: "4",
    duration: 30,
    cooldown: 1_800,
    unlock: { heroId: "cendre", level: 25 }
  },
  {
    id: "ritual",
    hotkey: "5",
    duration: 0,
    cooldown: 3_600,
    unlock: { heroId: "nyx", level: 25 }
  },
  {
    id: "echo",
    hotkey: "6",
    duration: 0,
    cooldown: 3_600,
    unlock: { heroId: "garrick", level: 25 }
  },
  {
    // The seventh power, woven at Eldra's Loom: the current stretch of road is unmade.
    id: "unweave",
    hotkey: "7",
    duration: 0,
    cooldown: 3_600,
    unlock: { weave: "seventh-night" }
  }
];

export const SKILL_BY_ID = lookup(SKILLS.map((skill) => [skill.id, skill])) as Record<SkillId, SkillDef>;
