import { REACTION_BUCKETS } from "@idlebound/game";

/**
 * The presence score of an account (0 to 100), read from its days of presence (see
 * `presenceDays`): how much of what the game keeps for someone present it does like a machine
 * would. Never the cadence or the regularity of clicks, never how long the game ran: an
 * autoclicker on the monster scores nothing here. It ranks rows for a person to review; it
 * never hides, refuses or bans anything by itself.
 */
export interface PresenceDay {
  crystalsSeen: number;
  crystalsCaught: number;
  reactions: number[];
  powers: number;
  promptPowers: number;
  ascensions: number;
  acts: number;
  longestSpanMs: number;
}

export interface PresenceScore {
  score: number;
  /** The longest stretch of acts without a 20-minute pause, in hours. */
  spanHours: number;
  /** Share of the crystals that appeared that were caught (null under 30 seen). */
  catchShare: number | null;
  /** Share of the catches under the first reaction bucket (300 ms). */
  fastShare: number | null;
  /** Share of the powers used within a second of coming back (null under 20 used). */
  promptShare: number | null;
  ascensions: number;
}

/** Below these, a share says nothing yet. */
const MIN_CRYSTALS = 30;
const MIN_POWERS = 20;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function presenceScore(days: readonly PresenceDay[]): PresenceScore {
  let seen = 0;
  let caught = 0;
  let fast = 0;
  let powers = 0;
  let prompt = 0;
  let ascensions = 0;
  let longest = 0;
  for (const day of days) {
    seen += day.crystalsSeen;
    caught += day.crystalsCaught;
    fast += day.reactions[0] ?? 0;
    powers += day.powers;
    prompt += day.promptPowers;
    ascensions += day.ascensions;
    longest = Math.max(longest, day.longestSpanMs);
  }
  const spanHours = longest / 3_600_000;
  const catchShare = seen >= MIN_CRYSTALS ? caught / seen : null;
  const fastShare = caught >= MIN_CRYSTALS ? fast / caught : null;
  const promptShare = powers >= MIN_POWERS ? prompt / powers : null;
  // A person sleeps: present without a 20-minute pause past ten hours weighs, past a day it is full.
  const span = clamp((spanHours - 10) / 14);
  // A person misses some crystals: past nine in ten caught weighs, every one caught is full.
  const catching = catchShare === null ? 0 : clamp((catchShare - 0.9) / 0.09);
  // A person takes a few tenths of a second: most catches under 300 ms is a machine's hand.
  const reflex = fastShare === null ? 0 : clamp((fastShare - 0.2) / 0.6);
  // Every power relaunched the moment it comes back, all day long.
  const prompting = promptShare === null ? 0 : clamp((promptShare - 0.5) / 0.45);
  const score = Math.round(100 * (0.4 * span + 0.25 * catching + 0.2 * reflex + 0.15 * prompting));
  return { score, spanHours, catchShare, fastShare, promptShare, ascensions };
}

/** The reaction buckets, for a reader: "<300 ms", …, "≥4000 ms". */
export const REACTION_LABELS = [...REACTION_BUCKETS.map((limit) => `<${limit} ms`), `>=${REACTION_BUCKETS[REACTION_BUCKETS.length - 1]} ms`];
