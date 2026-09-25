import type { Locale } from "./i18n";

export type Notation = "letters" | "scientific" | "engineering";

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc"];

function letterSuffix(group: number): string {
  if (group < SUFFIXES.length) return SUFFIXES[group];
  // Past the named suffixes: aa, ab, ac… like most idle games.
  const index = group - SUFFIXES.length;
  const first = String.fromCharCode(97 + Math.floor(index / 26) % 26);
  const second = String.fromCharCode(97 + (index % 26));
  return first + second;
}

/** Rounds, then drops useless trailing decimal zeros (never those of the integer part). */
export function trimmed(value: number, digits: number): string {
  const text = value.toFixed(digits);
  return text.includes(".") ? text.replace(/\.?0+$/, "") : text;
}

/**
 * Formats a big number for display (1.23M, 4.5e21…). The output is the same in every
 * locale on purpose: idle-game notation is universal and stays compact.
 */
export function formatNumber(value: number, notation: Notation = "letters"): string {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
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
