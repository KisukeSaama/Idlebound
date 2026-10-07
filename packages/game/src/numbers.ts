import type { Locale } from "./i18n";

export type Notation = "letters" | "scientific" | "engineering";

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc"];

function letterSuffix(group: number): string {
  if (group < SUFFIXES.length) return SUFFIXES[group];
  // Past the named suffixes: aa, ab, ac… like most idle games, then aaa after zz, so a
  // deeper number never reads like a shallower one.
  let index = group - SUFFIXES.length;
  let length = 2;
  let span = 26 * 26;
  while (index >= span) {
    index -= span;
    length += 1;
    span *= 26;
  }
  let out = "";
  for (let place = 0; place < length; place += 1) {
    out = String.fromCharCode(97 + (index % 26)) + out;
    index = Math.floor(index / 26);
  }
  return out;
}

/** Rounds, then drops useless trailing decimal zeros (never those of the integer part). */
export function trimmed(value: number, digits: number): string {
  const text = value.toFixed(digits);
  return text.includes(".") ? text.replace(/\.?0+$/, "") : text;
}

const LOG10_2 = Math.log10(2);

/**
 * Formats a big number for display (1.23M, 4.5e21…). The output is the same in every
 * locale on purpose: idle-game notation is universal and stays compact. `bits`: the unit the
 * value is written in (HP, gold and damage past stage 3500, see `scale.ts`).
 */
export function formatNumber(value: number, notation: Notation = "letters", bits = 0): string {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  if (bits !== 0 && value !== 0) return formatLog(value < 0 ? "-" : "", Math.log10(Math.abs(value)) + bits * LOG10_2, notation);
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs < 1000) {
    if (abs < 10 && abs % 1 !== 0) return sign + trimmed(abs, 1);
    return sign + Math.floor(abs).toString();
  }
  const exponent = Math.floor(Math.log10(abs));
  if (notation === "scientific") {
    const mantissa = abs / Math.pow(10, exponent);
    return `${sign}${mantissa.toFixed(2)}e${exponent}`;
  }
  const group = Math.floor(exponent / 3);
  const scaled = abs / Math.pow(10, group * 3);
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  if (notation === "engineering") return `${sign}${trimmed(scaled, digits)}e${group * 3}`;
  return `${sign}${trimmed(scaled, digits)}${letterSuffix(group)}`;
}

/** A number known by its base-10 logarithm, as `formatNumber` writes it (for values past a double). */
function formatLog(sign: string, log: number, notation: Notation): string {
  if (log < 3) return formatNumber(Number(sign + Math.pow(10, log)), notation);
  const exponent = Math.floor(log);
  if (notation === "scientific") return `${sign}${Math.pow(10, log - exponent).toFixed(2)}e${exponent}`;
  const group = Math.floor(exponent / 3);
  const scaled = Math.pow(10, log - group * 3);
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  if (notation === "engineering") return `${sign}${trimmed(scaled, digits)}e${group * 3}`;
  return `${sign}${trimmed(scaled, digits)}${letterSuffix(group)}`;
}

const DURATION_UNITS: Record<Locale, { d: string; h: string; min: string; s: string }> = {
  fr: { d: " j", h: " h", min: " min", s: " s" },
  en: { d: "d", h: "h", min: "m", s: "s" }
};

export function formatDuration(seconds: number, locale: Locale = "en"): string {
  const unit = DURATION_UNITS[locale];
  const s = Math.max(0, Math.floor(seconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  if (days > 0) return `${days}${unit.d} ${hours}${unit.h}`;
  if (hours > 0) return `${hours}${unit.h} ${pad(minutes)}${unit.min}`;
  if (minutes > 0) return `${minutes}${unit.min} ${pad(secs)}${unit.s}`;
  return `${secs}${unit.s}`;
}

/** French puts a space before "%", English does not. */
export function formatPercent(ratio: number, notation: Notation = "letters", locale: Locale = "en"): string {
  const pct = ratio * 100;
  const sign = locale === "fr" ? " %" : "%";
  if (pct < 1000) return `${trimmed(pct, pct < 10 ? 1 : 0)}${sign}`;
  return `${formatNumber(pct, notation)}${sign}`;
}
