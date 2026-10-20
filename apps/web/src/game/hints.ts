import { ALTAR_REWORK_NOTICE, CLICK_HERO_ID, HARVEST_NOTICE, HARVEST_NOTICE_TOLD, HERO_BY_ID, SKILLS, heroCost, isBossStage, isSkillUnlocked, runBits, type GameState, type SkillDef } from "@idlebound/game";
import type { WindowId } from "./context";

/**
 * The tutorial hints of the first night, and the two one-time notices. A hint is shown while
 * its moment lasts, and goes for good as soon as it stops making sense: the walker did what
 * it says (`hintLearned`), opened the place it points to (`hintsAnsweredBy`), or has had it
 * on screen long enough to have read it (`HINT_READ_MS`). The notices tell of something given
 * back: they wait for the walker's "OK".
 */
export type HintId = "strike" | "hire" | "companion" | "boss" | "skill" | "farm" | "ascend" | typeof ALTAR_REWORK_NOTICE | typeof HARVEST_NOTICE_TOLD;

export interface Hint {
  id: HintId;
  position: "center" | "right" | "bottom";
  /** A notice: it stays until acknowledged. */
  notice?: boolean;
  /** The power the hint points at. */
  skill?: SkillDef;
}

/** From this level of Aldric's, the walker is told to keep their gold for the first companion. */
const SAVE_FOR_COMPANION_FROM = 2;

/** What Maëlle asks to join, the first companion of every night. */
export function maelleCost(state: GameState): number {
  return heroCost(HERO_BY_ID.maelle, 0, 1, 1, runBits(state));
}

/** A hint shown this long under the walker's eyes has been read: it goes. */
export const HINT_READ_MS = 30_000;

/** The hints of the first night, in the order they are weighed. */
const LESSONS = ["strike", "hire", "companion", "boss", "skill", "farm", "ascend"] as const;
type Lesson = (typeof LESSONS)[number];

const POSITION: Record<Lesson, Hint["position"]> = { strike: "center", hire: "right", companion: "right", boss: "bottom", skill: "bottom", farm: "center", ascend: "center" };

/** Whether the first night's hints are over: they teach a walker who has never seen a dusk. */
function taught(state: GameState): boolean {
  return state.lifetime.ascensions > 0 || state.tutorial.done.includes("all");
}

/** A walk where nothing has happened yet: not a strike, not a Remnant down, not a coin. */
function untouched(state: GameState): boolean {
  const life = state.lifetime;
  return life.clicks === 0 && life.kills === 0 && life.bosses === 0 && state.maxStageEver <= 1 && state.maxStage <= 1 && state.gold === 0 && Object.values(state.heroLevels).every((level) => !level);
}

/** Whether a companion has joined the walker this night or any other. */
function companyJoined(state: GameState): boolean {
  return state.lifetime.bestHired >= 2 || Object.entries(state.heroLevels).some(([id, level]) => id !== CLICK_HERO_ID && level > 0);
}

/** Whether the moment a hint speaks of is there. */
function applies(state: GameState, id: Lesson): boolean {
  switch (id) {
    // The very first second of a walk: nothing has been struck yet.
    case "strike": return untouched(state);
    // Only before the company: once someone has joined, the walker's own blade is a choice.
    case "hire": return (state.heroLevels[CLICK_HERO_ID] ?? 0) === 0 && !companyJoined(state) && state.gold >= heroCost(HERO_BY_ID[CLICK_HERO_ID], 0, 1, 1, runBits(state));
    // As soon as she is in reach, or once Aldric has trained a little: every coin spent on
    // the walker's own blade would keep her from the road a while longer.
    case "companion": return (state.heroLevels.maelle ?? 0) === 0 && (state.gold >= maelleCost(state) || (state.heroLevels[CLICK_HERO_ID] ?? 0) >= SAVE_FOR_COMPANION_FROM);
    case "boss": return isBossStage(state.stage) && state.monster !== null && state.monster.kind !== "normal" && state.lifetime.bosses === 0;
    case "skill": return state.lifetime.skillsUsed === 0 && SKILLS.some((skill) => isSkillUnlocked(state, skill.id));
    case "farm": return !state.autoAdvance && state.lifetime.bossFails > 0;
    case "ascend": return state.maxStage >= 51;
  }
}

/** Whether the walker has done what a hint says: it has nothing left to teach. */
function learned(state: GameState, id: Lesson): boolean {
  switch (id) {
    case "strike": return state.lifetime.clicks > 0 || state.lifetime.kills > 0;
    case "hire": return (state.heroLevels[CLICK_HERO_ID] ?? 0) > 0 || companyJoined(state);
    case "companion": return (state.heroLevels.maelle ?? 0) > 0;
    case "boss": return state.lifetime.bosses > 0;
    case "skill": return state.lifetime.skillsUsed > 0;
    // Pushed back once, and on the road again: the next seam that closes needs no telling.
    case "farm": return state.autoAdvance && state.lifetime.bossFails > 0;
    case "ascend": return state.lifetime.ascensions > 0;
  }
}

/** The hint to show now, if any: one at a time. */
export function currentHint(state: GameState): Hint | null {
  const done = state.tutorial.done;
  if (!done.includes(ALTAR_REWORK_NOTICE) && state.lifetime.ascensions > 0) return { id: ALTAR_REWORK_NOTICE, position: "center", notice: true };
  // The Harvest's cap (save version 11) gave levels back to this walker: said once.
  if (done.includes(HARVEST_NOTICE) && !done.includes(HARVEST_NOTICE_TOLD)) return { id: HARVEST_NOTICE_TOLD, position: "center", notice: true };
  if (taught(state)) return null;
  for (const id of LESSONS) {
    if (done.includes(id) || learned(state, id) || !applies(state, id)) continue;
    return { id, position: POSITION[id], skill: id === "skill" ? SKILLS.find((skill) => isSkillUnlocked(state, skill.id)) : undefined };
  }
  return null;
}

/**
 * Whether a hint that was on screen has been answered by what the walker did since: it is
 * then marked, and never comes back (a second seam closing needs no second telling).
 */
export function hintLearned(state: GameState, id: HintId): boolean {
  return (LESSONS as readonly string[]).includes(id) && learned(state, id as Lesson);
}

/** Hints a window answers by being opened: the walker found the place they point to. */
export function hintsAnsweredBy(state: GameState, window: WindowId): HintId[] {
  if (window !== "ascension" || taught(state) || state.tutorial.done.includes("ascend") || !applies(state, "ascend")) return [];
  return ["ascend"];
}
