/**
 * What the walker last saw in a window, so the rail lights a badge for something new only
 * (relics that came into the pack, essences gathered, a ware the shards newly reach). A view
 * convenience kept in this browser, never game state (AGENTS.md): a missing or refused storage
 * only means the marks last until the page closes. Marks are kept per game (its creation
 * date), and a game with no mark yet counts what it holds as seen, so an update lights nothing.
 */
const PREFIX = "idlebound:seen:";
const KEPT_RELICS = 200;

export interface SeenMarks {
  /** Relics of the pack already looked at. */
  relics: string[];
  /** Essences held the last time the Sanctum was opened. */
  essences: number;
  /** Shards held the last time the stall was opened. */
  shards: number;
  /** The stall's six hours (`stallWindow`) the last time it was opened. */
  stall?: number;
  /** The Caravan's week (`isoWeek`) the last time the stall was opened. */
  caravan?: string;
}

const kept = new Map<string, SeenMarks>();

function key(game: number): string {
  return PREFIX + game;
}

export function readSeen(game: number, fallback: () => SeenMarks): SeenMarks {
  const cached = kept.get(key(game));
  if (cached) return cached;
  let marks: SeenMarks | null = null;
  try {
    const stored = window.localStorage.getItem(key(game));
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SeenMarks>;
      if (Array.isArray(parsed.relics) && typeof parsed.essences === "number" && typeof parsed.shards === "number") {
        marks = { relics: parsed.relics.filter((uid) => typeof uid === "string"), essences: parsed.essences, shards: parsed.shards, stall: typeof parsed.stall === "number" ? parsed.stall : undefined, caravan: typeof parsed.caravan === "string" ? parsed.caravan : undefined };
      }
    }
  } catch {
    // No storage: the marks start from what the game holds now.
  }
  if (!marks) {
    marks = fallback();
    writeSeen(game, marks);
  }
  kept.set(key(game), marks);
  return marks;
}

export function writeSeen(game: number, marks: SeenMarks) {
  const trimmed = { ...marks, relics: marks.relics.slice(-KEPT_RELICS) };
  kept.set(key(game), trimmed);
  try {
    window.localStorage.setItem(key(game), JSON.stringify(trimmed));
  } catch {
    // The marks stay in `kept` for this page.
  }
}
