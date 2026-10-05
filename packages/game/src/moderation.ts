/**
 * Username validation, shared by the client (instant feedback) and the server (the rule
 * that counts). The lists are deliberately strict: usernames are shown on the public
 * leaderboard. The word lists are data (French and English slurs), not UI text.
 */

/** A guest's game (no account) nobody came back to for this long is deleted by the server. */
export const GUEST_SAVE_DAYS = 30;

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 16;
/** An account may take a new username once in this many days (the first change waits for nothing). */
export const USERNAME_RENAME_DAYS = 90;
const USERNAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]+$/;

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "6": "g", "7": "t", "8": "b", "9": "g",
  "@": "a", "$": "s", "!": "i", "|": "i", "€": "e", "£": "l"
};

/** Letters that are not accented Latin letters, spelled out (NFD leaves them whole). */
const LIGATURES: Record<string, string> = { "æ": "ae", "œ": "oe", "ð": "d", "þ": "th", "ß": "ss" };

/**
 * Look-alikes a word of the lists may hide behind, by letter: a lowercase l passes for an i
 * ("ADMlN"), "rn" for an m, an ø for an o or an e. They only widen the lists' patterns, the
 * username itself is never rewritten ("Tilt" must not turn into "tit").
 */
const CONFUSABLES: Record<string, string> = { i: "[il]", o: "[oø]", e: "[eø]", m: "(?:m|rn)" };

/** Lowercase, accents stripped, leet-speak decoded, repeated letters merged, separators removed. */
export function normalizeForModeration(value: string): string {
  return decodeForModeration(value).replace(/(.)\1+/g, "$1");
}

/** Lowercase, accents stripped, ligatures spelled out, leet-speak decoded, separators removed (ø kept, see CONFUSABLES). */
function decodeForModeration(value: string): string {
  const lowered = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  let decoded = "";
  for (const char of lowered) decoded += LEET[char] ?? LIGATURES[char] ?? char;
  return decoded.replace(/[^a-zø]/g, "");
}

/** Regex source of a list word, each letter also matching its look-alikes; `run` sets the quantifier of a run of one letter. */
function confusablePattern(word: string, run: (length: number) => string): string {
  return word.replace(/(.)\1*/g, (letters, letter: string) => `${CONFUSABLES[letter] ?? letter}${run(letters.length)}`);
}

/**
 * Terms banned anywhere in the username (long and specific enough not to cause false
 * positives).
 */
const BANNED_SUBSTRINGS = [
  // Insults (FR)
  "connard", "conasse", "connasse", "salope", "salaud", "enculer", "encule", "enfoire", "batard", "putain",
  "tapette", "tafiole", "gouine", "fdp", "ntm", "niktamer", "tamere", "filsdepute", "trouduc", "pouffiasse",
  "poufiasse", "grognasse", "abruti", "debile", "attarde", "trisomique", "cassos", "sousmerde", "merdeux",
  // Sexual (FR/EN)
  "couille", "branlet", "branleu", "sodomi", "suceuse", "ejacul", "sperm", "porno", "penis", "vagin",
  "clitor", "orgasm", "masturb", "pussy", "cunt", "blowjob", "slut", "whore", "horny", "milf", "hentai",
  "fuck", "fuk", "fck", "shit", "bitch", "bastard", "asshole", "motherf", "wank", "twat", "dildo",
  "pedophil", "zoophil", "pedobear",
  // Hate, discrimination
  "nazi", "hitler", "sieg", "fuhrer", "negre", "negro", "nigga", "nigger", "bamboula", "bougnoul", "bicot",
  "youpin", "youtre", "chinetoq", "niakoue", "salearabe", "salejuif", "salenoir", "faggot", "tranny",
  "shoah", "genocid", "terroris", "jihad", "djihad", "daesh", "alqaida", "binladen", "breivik",
  // Misc
  "cocaine", "suicid", "killyourself"
];

/**
 * Terms banned only when they are the whole username or a whole segment (split on a dash,
 * an underscore or a capital letter): they appear inside too many innocent words.
 */
const BANNED_WORDS = [
  "con", "cul", "pd", "pute", "nique", "chatte", "bite", "pipe", "pedale", "gogol", "mongol", "triso",
  "sex", "sexe", "sexy", "xxx", "porn", "anal", "viol", "cum", "boob", "boobs", "tits", "dick", "cock",
  "rape", "nude", "fag", "fagot", "nig", "kkk", "ss88", "heil", "reich", "isis", "raton", "retard",
  "tg", "vtff", "ass", "tit", "jap", "crack", "meth", "kys", "pedo", "zizi", "penis"
];

const RESERVED = [
  "admin", "administrateur", "administrator", "moderateur", "moderator", "modo", "support", "staff",
  "idlebound", "system", "systeme", "root", "null", "undefined", "anonymous", "anonyme", "official", "officiel"
];
/** Reserved words keep their double letters ("root" is not "rot", or Brother would be refused); a stretched letter still matches. */
const RESERVED_PATTERNS = RESERVED.map((word) => new RegExp(confusablePattern(word, (length) => `{${length},}`)));
/** Banned terms, merged like the username they are matched against ("SSaalllooppee"). */
const SUBSTRING_PATTERNS = BANNED_SUBSTRINGS.map((word) => new RegExp(confusablePattern(normalizeForModeration(word), () => "")));
const WORD_PATTERNS = [...new Set([...BANNED_WORDS.map(normalizeForModeration), ...BANNED_WORDS])]
  .map((word) => new RegExp(`^${confusablePattern(word, (length) => (length > 1 ? `{${length}}` : ""))}$`));

/** Why a username was refused; the UI and the API turn it into a sentence. */
export type UsernameIssue = "too-short" | "too-long" | "charset" | "no-letter" | "reserved" | "forbidden";

export type UsernameCheck = { ok: true; value: string } | { ok: false; reason: UsernameIssue };

export function validateUsername(input: string): UsernameCheck {
  const value = input.trim();
  if (value.length < USERNAME_MIN) return { ok: false, reason: "too-short" };
  if (value.length > USERNAME_MAX) return { ok: false, reason: "too-long" };
  if (!USERNAME_PATTERN.test(value)) return { ok: false, reason: "charset" };
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value)) return { ok: false, reason: "no-letter" };

  const normalized = normalizeForModeration(value);
  const decoded = decodeForModeration(value);
  if (RESERVED_PATTERNS.some((pattern) => pattern.test(decoded))) {
    return { ok: false, reason: "reserved" };
  }
  if (SUBSTRING_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return { ok: false, reason: "forbidden" };
  }
  const segments = value
    .split(/[_\-\s]+|(?<=[a-z])(?=[A-Z])/)
    .map(normalizeForModeration)
    .filter(Boolean);
  if ([normalized, ...segments].some((text) => WORD_PATTERNS.some((pattern) => pattern.test(text)))) {
    return { ok: false, reason: "forbidden" };
  }
  return { ok: true, value };
}

/** Uniqueness key: two usernames that differ only by case or accents are the same. */
export function usernameKey(value: string): string {
  return value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
