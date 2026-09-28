import type { BuffId, CaravanWareId, MarketOfferId, SkillId } from "@idlebound/game";
import type { ReactNode } from "react";
import type { WindowId } from "./context";

/** Trophy drawn in the style of the game icons (gold and amethyst). */
export function TrophyIcon({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="trophy-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.55" stopColor="#e8b04a" />
          <stop offset="1" stopColor="#9a6a1f" />
        </linearGradient>
        <linearGradient id="trophy-gem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2c6ff" />
          <stop offset="1" stopColor="#7a3fd6" />
        </linearGradient>
      </defs>
      <path d="M14 10h36v6c0 9-5 17-12 20v6h6v6H20v-6h6v-6c-7-3-12-11-12-20z" fill="url(#trophy-gold)" stroke="#3b2608" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M14 14H6c0 8 4 13 10 14M50 14h8c0 8-4 13-10 14" fill="none" stroke="#d9a13d" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M16 48h32l3 8H13z" fill="#4a3322" stroke="#2a1a0c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 17l5 6-5 7-5-7z" fill="url(#trophy-gem)" stroke="#2a1150" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22 52h20" stroke="#e8b04a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GoldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="res-icon">
      <circle cx="10" cy="10" r="8.2" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="5.2" fill="none" stroke="#b8862b" strokeWidth="1.2" />
      <path d="M7.6 7.2c.7-.8 3.9-.9 4.5.4.6 1.4-4.4 1.6-4.4 3.3 0 1.6 3.8 1.5 4.6.5" fill="none" stroke="#8a5d14" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function EssenceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="res-icon">
      <path d="M10 1.5l5 6.2-5 10.8L5 7.7z" fill="#b57bff" stroke="#3f1a7a" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 7.7h10M10 1.5v17" stroke="#e6d0ff" strokeWidth="0.9" opacity="0.8" />
    </svg>
  );
}

export function ShardIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="res-icon">
      <path d="M4 8l6-6 6 6-6 10z" fill="#7fd8ff" stroke="#124a66" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 8h12M10 2l-2 6 2 10 2-10z" fill="none" stroke="#dff6ff" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

export function SwordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="res-icon">
      <path d="M15.5 2.5l2 2-9 9-2-2z" fill="#dfe6f2" stroke="#4b5566" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5 12.5l2.5 2.5M3.5 14l2.5 2.5M4.8 15.2l-2 2" stroke="#c9953a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ClickIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="res-icon">
      <path d="M7 3.5v9l2.3-2 1.8 4.2 1.9-.8-1.8-4.1 3.1-.2z" fill="#fff4d6" stroke="#5a4a2a" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M4 3l1.2 1.2M3 6.5h1.6M7.5 1v1.6" stroke="#f5c85b" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const SLOT_PATHS: Record<string, string> = {
  weapon: "M16 3l2 2-8.5 8.5-2-2zM6 12l3 3M4.5 13.5l3 3M5.5 15.5l-2.5 2",
  armor: "M5 4l3-1.5h4L15 4l2 3-2 1.5V17H5V8.5L3 7zM8 2.5c.5 1.5 3.5 1.5 4 0",
  amulet: "M5 2.5c0 5 3 7 5 7s5-2 5-7M10 9.5l3.5 3.5L10 18l-3.5-5z",
  ring: "M10 7a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM7.5 4.5L10 2l2.5 2.5L10 7z"
};

export function SlotIcon({ slot, size = 22, color = "currentColor" }: { slot: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d={SLOT_PATHS[slot]} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Variation selector that keeps symbols such as ☠ or ⚔ as tinted text instead of emoji. */
export const TEXT_PRESENTATION = "\uFE0E";

const INK = "#2a1a0c";

/** Pictograms drawn in the style of the game icons; the game never shows emoji. */
const PICTOS = {
  bolt: <path d="M11.8 1.5L4 11.2h5.2l-1.6 7.3 8.4-10.2h-5.3z" fill="#ffd45c" stroke="#7a4d0c" strokeWidth="1.3" strokeLinejoin="round" />,
  horn: (
    <>
      <path d="M2 8.2c3.5 0 7.5-1.6 11.5-5.2h1.2v14h-1.2C9.5 13.4 5.5 11.8 2 11.8z" fill="#e8b04a" stroke="#5a3a10" strokeWidth="1.3" strokeLinejoin="round" />
      <ellipse cx="15.3" cy="10" rx="2.4" ry="7" fill="#ffe9a8" stroke="#5a3a10" strokeWidth="1.3" />
      <path d="M8 6.5v7" stroke="#9a6a1f" strokeWidth="1.1" />
    </>
  ),
  /** Ysolde's Hawkeye: an eye between two leaves, on its twig. */
  eye: (
    <>
      <path d="M3.2 12.4L1.2 16.8" stroke="#3f6b2a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1.8 10C4.4 5.6 7.2 4 10 4s5.6 1.6 8.2 6c-2.6 4.4-5.4 6-8.2 6s-5.6-1.6-8.2-6z" fill="#6fae4a" stroke="#1f3a14" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4.6 10c1.7-2.4 3.5-3.6 5.4-3.6s3.7 1.2 5.4 3.6c-1.7 2.4-3.5 3.6-5.4 3.6S6.3 12.4 4.6 10z" fill="#f3ede0" />
      <circle cx="10" cy="10" r="2.7" fill="#7fd8ff" stroke="#124a66" strokeWidth="1" />
      <circle cx="10" cy="10" r="1.1" fill="#1a1530" />
      <path d="M8.9 8.9l.6-.6" stroke="#dff6ff" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  coins: (
    <>
      <circle cx="12.5" cy="7" r="5" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.4" />
      <circle cx="12.5" cy="7" r="3" fill="none" stroke="#b8862b" strokeWidth="1" />
      <circle cx="7" cy="12.8" r="5.5" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.4" />
      <circle cx="7" cy="12.8" r="3.3" fill="none" stroke="#b8862b" strokeWidth="1" />
      <path d="M16 13.5v2M17.5 17v1" stroke="#f5c85b" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  /** Nyx's Resonance Ritual: the walker's heart, bound to the night by a thread. */
  heart: (
    <>
      <path d="M10 17.6C4.6 13.6 2.2 10.6 2.2 7.3 2.2 4.9 4 3.1 6.2 3.1c1.6 0 2.9.9 3.8 2.3.9-1.4 2.2-2.3 3.8-2.3 2.2 0 4 1.8 4 4.2 0 3.3-2.4 6.3-7.8 10.3z" fill="#d65a5a" stroke="#5a1a1a" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5 6.2c.3-.8 1-1.3 1.8-1.4" fill="none" stroke="#ffb0a0" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1.5 15.5c3.5-1.2 5.5-3.2 8.5-6.2s5.5-5 8.5-6.3" fill="none" stroke="#c9a8ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.6 12.8c2.2.5 4.4.1 6.4-1.2" fill="none" stroke="#c9a8ff" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  /** Garrick's Time Echo: a pick striking an echo vein. */
  pickaxe: (
    <>
      <path d="M2 18.2l9.6-9.6" stroke="#6b4b22" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M2 18.2l9.6-9.6" stroke="#a86f35" strokeWidth="1" strokeLinecap="round" />
      <path d="M4.2 4.4C8.4 1.6 13.6 2.6 16.4 7c.8 1.3 1.1 2.7 1 4-1.8-3.4-4.3-5.6-7.3-6.4-2-.5-4-.5-5.9-.2z" fill="#b8c0cc" stroke="#3a3f70" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M13.4 18.6l1.4-4.2 1.6-1.6 1.8 2.2.3 3.6z" fill="#7fd8ff" stroke="#124a66" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M15.6 13.8l-.4 3.6" stroke="#dff6ff" strokeWidth="0.8" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 2.8c0 4 3 5.2 3 7.2s-3 3.2-3 7.2h8c0-4-3-5.2-3-7.2s3-3.2 3-7.2z" fill="#dff6ff" fillOpacity="0.35" stroke="#4b5566" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.3 5.2h5.4C12.2 6.8 10 7.8 10 9 10 7.8 7.8 6.8 7.3 5.2zM7.2 16.6c.3-1.9 2.8-2.8 2.8-4 0 1.2 2.5 2.1 2.8 4z" fill="#f5c85b" />
      <path d="M4.5 2.5h11M4.5 17.5h11" stroke="#8a5d14" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  chest: (
    <>
      <path d="M2.5 9.5C2.5 5.8 4.8 4 10 4s7.5 1.8 7.5 5.5z" fill="#a86f35" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.5 9.5h15V17h-15z" fill="#8a5a2b" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.5 9.5h15M6 4.6V17M14 4.6V17" stroke="#e8b04a" strokeWidth="1.2" />
      <path d="M8.7 8.2h2.6v3.6H8.7z" fill="#f5c85b" stroke={INK} strokeWidth="1" />
    </>
  ),
  /** The great chest: a gilded reliquary, a gem on its roof. */
  greatChest: (
    <>
      <path d="M2.5 17.2v1.6M17.5 17.2v1.6" stroke="#8a5d14" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1.8 10.4h16.4v6.8H1.8z" fill="#6b3fb0" stroke="#2a1150" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.6 10.4L6.2 5.2h7.6l3.6 5.2z" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M1.8 17.2h16.4M1.8 10.4h16.4" stroke="#e8b04a" strokeWidth="1.3" />
      <path d="M8.6 12h2.8v3.4H8.6z" fill="#f5c85b" stroke="#5a3a10" strokeWidth="1" />
      <path d="M10 1.2l1.6 2.1L10 5.4 8.4 3.3z" fill="#c9a8ff" stroke="#2a1150" strokeWidth="1.1" strokeLinejoin="round" />
    </>
  ),
  /** Three crates found along the road, stacked. */
  crates: (
    <>
      <path d="M1.6 11.2h7.8v7H1.6zM10.6 11.2h7.8v7h-7.8zM6.1 3.8h7.8v7H6.1z" fill="#a86f35" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2.4 12l6.2 5.4M11.4 12l6.2 5.4M6.9 4.6l6.2 5.4" stroke="#6b4b22" strokeWidth="1.1" />
      <path d="M1.6 11.2h7.8M10.6 11.2h7.8M6.1 3.8h7.8" stroke="#e8b04a" strokeWidth="1" />
    </>
  ),
  /** A sealed coffer, its seal hanging from a red ribbon. */
  coffer: (
    <>
      <path d="M3.5 4h10v10h-10z" fill="#5a5f86" stroke="#1f2238" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3.5 7h10" stroke="#e8b04a" strokeWidth="1.4" />
      <path d="M8.5 4v10.5c0 1.2.8 1.8 2.2 2" fill="none" stroke="#d65a5a" strokeWidth="1.6" />
      <circle cx="13.6" cy="15.8" r="2.8" fill="#b83a3a" stroke="#5a1a1a" strokeWidth="1.2" />
      <circle cx="13.6" cy="15.8" r="1.1" fill="#ff8a7a" />
    </>
  ),
  /** The Stallkeeper's Token: brass, a hole in it, on a cord. */
  token: (
    <>
      <path d="M7.4 7.4C6.4 5.8 7 2.2 10 2.2s3.6 3.6 2.6 5.2" fill="none" stroke="#8a5a2b" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 5.8a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zM8.3 10.3v3.4h3.4v-3.4z" fill="#d9a13d" fillRule="evenodd" stroke="#5a3a10" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.8 9.4a4.6 4.6 0 0 1 3-2" fill="none" stroke="#ffe9a8" strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  /** Bottled Night: two hours of night in a bottle, lying on its side. */
  bottle: (
    <>
      <path d="M2.2 10c0-3.7 2.5-5.6 6.4-5.6 2.4 0 3.9.8 4.9 2.3h2.3v6.6h-2.3c-1 1.5-2.5 2.3-4.9 2.3-3.9 0-6.4-1.9-6.4-5.6z" fill="#241d4a" stroke="#124a66" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M15.8 7.6h2.4v4.8h-2.4z" fill="#a86f35" stroke={INK} strokeWidth="1.1" />
      <path d="M8.4 6.8a3.2 3.2 0 1 0 2 5.6 2.6 2.6 0 0 1-2-5.6z" fill="#ffe9a8" />
      <circle cx="5" cy="8.6" r="0.7" fill="#f5c85b" />
      <circle cx="12.6" cy="9" r="0.6" fill="#f5c85b" />
      <circle cx="5.8" cy="12.4" r="0.6" fill="#dff6ff" />
      <path d="M4 7.2c.8-1 1.8-1.5 3-1.7" fill="none" stroke="#7fd8ff" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  /** The Ember Draught: rage and fortune in one tankard, still burning. */
  tankard: (
    <>
      <path d="M12.6 8.4h2.2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2.2" fill="none" stroke={INK} strokeWidth="3.2" />
      <path d="M12.6 8.4h2.2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2.2" fill="none" stroke="#a86f35" strokeWidth="1.4" />
      <path d="M3 6.4h9.6v11.4H3z" fill="#a86f35" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 9.4h9.6M3 14.8h9.6" stroke="#e8b04a" strokeWidth="1.2" />
      <path d="M4.4 6.4c-.6-1.8.5-2.9 1.3-4.2.6 1.2 1.9 2.2 1.5 4.2M8.2 6.4c-.4-1.6.6-2.8 1.5-3.8.7 1.2 1.6 2.2 1.3 3.8" fill="#ff8a3d" stroke="#7a2a0c" strokeWidth="1" strokeLinejoin="round" />
    </>
  ),
  /** Eldra's Thread: a spool on its side, a strand loose. */
  spool: (
    <>
      <path d="M5 6.4h10v7H5z" fill="#9b7bff" stroke="#2a1150" strokeWidth="1.2" />
      <path d="M5 8.2h10M5 10h10M5 11.8h10" stroke="#e6d0ff" strokeWidth="0.8" opacity="0.8" />
      <path d="M11.5 13.4c0 2.2 1.6 2.6 3.2 3.2 1.4.6.8 2-.8 2" fill="none" stroke="#c9a8ff" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="1.8" y="3.8" width="3.4" height="12.4" rx="1.3" fill="#a86f35" stroke={INK} strokeWidth="1.2" />
      <rect x="14.8" y="3.8" width="3.4" height="12.4" rx="1.3" fill="#a86f35" stroke={INK} strokeWidth="1.2" />
    </>
  ),
  crown: (
    <>
      <path d="M2.5 14.5L1.8 5.8l4.4 3.6L10 3l3.8 6.4 4.4-3.6-.7 8.7z" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.5 14.5h15v3h-15z" fill="#e8b04a" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="16" r="1" fill="#b57bff" />
      <circle cx="6" cy="16" r="0.8" fill="#d65a5a" />
      <circle cx="14" cy="16" r="0.8" fill="#d65a5a" />
    </>
  ),
  flask: (
    <>
      <path d="M8 2.2h4v5l4.6 8.3c.7 1.3-.2 2.7-1.7 2.7H5.1c-1.5 0-2.4-1.4-1.7-2.7L8 7.2z" fill="#dff6ff" fillOpacity="0.25" />
      <path d="M5.9 11.8h8.2l2.5 3.7c.7 1.3-.2 2.7-1.7 2.7H5.1c-1.5 0-2.4-1.4-1.7-2.7z" fill="#ff6b3d" />
      <path d="M8 2.2h4v5l4.6 8.3c.7 1.3-.2 2.7-1.7 2.7H5.1c-1.5 0-2.4-1.4-1.7-2.7L8 7.2z" fill="none" stroke="#4b5566" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7 2.2h6" stroke="#4b5566" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  urn: (
    <>
      <path d="M7.5 3c0 2-3.5 3.3-3.5 7.6 0 4 2.6 7 6 7s6-3 6-7C16 6.3 12.5 5 12.5 3z" fill="#c9953a" stroke="#5a3a10" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4.4 9h11.2M5 13h10" stroke="#ffe9a8" strokeWidth="1" />
      <path d="M6.5 2.5h7" stroke="#5a3a10" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.3 7.2C2.5 7 2 9 3.8 10.4M15.7 7.2c1.8-.2 2.3 1.8.5 3.2" fill="none" stroke="#5a3a10" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  scroll: (
    <>
      <path d="M5 4h10v12H5z" fill="#f3e3bf" stroke="#6b4b22" strokeWidth="1.2" />
      <rect x="3.5" y="2" width="13" height="3" rx="1.5" fill="#c9953a" stroke="#5a3a10" strokeWidth="1.2" />
      <rect x="3.5" y="15" width="13" height="3" rx="1.5" fill="#c9953a" stroke="#5a3a10" strokeWidth="1.2" />
      <path d="M7.3 8h5.4M7.3 10.3h5.4M7.3 12.6h3.4" stroke="#8a6a3a" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  gem: (
    <>
      <path d="M3 7.5L6.5 3h7L17 7.5 10 18z" fill="#b57bff" stroke="#3f1a7a" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 7.5h14M6.5 3L8 7.5 10 18l2-10.5L13.5 3" fill="none" stroke="#e6d0ff" strokeWidth="0.9" opacity="0.85" />
    </>
  ),
  blade: (
    <>
      <path d="M15.5 2.5l2 2-9 9-2-2z" fill="#dfe6f2" stroke="#4b5566" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5 12.5l2.5 2.5M3.5 14l2.5 2.5M4.8 15.2l-2 2" stroke="#c9953a" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 1.5l.6 1.4M18.5 7l-1.4-.6" stroke="#fff4d6" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  lotus: (
    <>
      <path d="M10 13.5c-1.2-3.3-3.8-5.4-7.5-5.4 0 3.7 3.2 5.6 7.5 5.4zM10 13.5c1.2-3.3 3.8-5.4 7.5-5.4 0 3.7-3.2 5.6-7.5 5.4z" fill="#9b7bff" stroke="#2a1150" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M10 3.5c2.2 2.7 2.2 6.5 0 10-2.2-3.5-2.2-7.3 0-10z" fill="#c9a8ff" stroke="#2a1150" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M4 16.5h12" stroke="#7fd8ff" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  map: (
    <>
      <path d="M2.5 4.5l5-2 5 2 5-2v13l-5 2-5-2-5 2z" fill="#e8d6a8" stroke="#6b4b22" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.5 2.5v13M12.5 4.5v13" stroke="#6b4b22" strokeWidth="0.9" opacity="0.6" />
      <path d="M4.5 13c2-1 2.5-4.5 5-4.5s2.5 2.5 4.5.5" fill="none" stroke="#d65a5a" strokeWidth="1.2" strokeDasharray="1.6 1.4" strokeLinecap="round" />
      <path d="M13.8 6.2l1.8 1.8M15.6 6.2l-1.8 1.8" stroke="#d65a5a" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  trophy: (
    <>
      <path d="M5 3h10v2c0 3-1.6 5.4-3.8 6.3V14h2v2.5H6.8V14h2v-2.7C6.6 10.4 5 8 5 5z" fill="#e8b04a" stroke="#3b2608" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 4.5H2.5c0 2.6 1.3 4.2 3.2 4.5M15 4.5h2.5c0 2.6-1.3 4.2-3.2 4.5" fill="none" stroke="#d9a13d" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 5l1.5 1.8L10 9 8.5 6.8z" fill="#b57bff" />
      <path d="M5 16.5h10v2H5z" fill="#4a3322" stroke={INK} strokeWidth="1" />
    </>
  ),
  lock: (
    <>
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" fill="none" stroke="#a0a8b8" strokeWidth="2" />
      <rect x="4.5" y="9" width="11" height="8.5" rx="1.5" fill="#c9953a" stroke="#5a3a10" strokeWidth="1.3" />
      <path d="M10 12v2.5" stroke="#3b2608" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <>
      <path d="M9 2l1.8 5.7L16.5 9.5l-5.7 1.8L9 17l-1.8-5.7L1.5 9.5l5.7-1.8z" fill="#ffe9a8" stroke="#8a5d14" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M15.5 1.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#b57bff" />
    </>
  ),
  cloud: (
    <>
      <path d="M5.5 15.5a3.5 3.5 0 0 1-.3-7A5 5 0 0 1 14.6 7a4.2 4.2 0 0 1 .6 8.5z" fill="#dfe6f2" stroke="#4b5566" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 12.2l1.6 1.6 3.2-3.4" fill="none" stroke="#3aa876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  swords: (
    <>
      <path d="M15.5 2.5l2 2-9 9-2-2z" fill="#dfe6f2" stroke="#4b5566" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5 12.5l2.5 2.5M3.5 14l2.5 2.5M4.8 15.2l-2 2" stroke="#c9953a" strokeWidth="2" strokeLinecap="round" />
      <g transform="matrix(-1 0 0 1 20 0)">
        <path d="M15.5 2.5l2 2-9 9-2-2z" fill="#dfe6f2" stroke="#4b5566" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M5 12.5l2.5 2.5M3.5 14l2.5 2.5M4.8 15.2l-2 2" stroke="#c9953a" strokeWidth="2" strokeLinecap="round" />
      </g>
    </>
  ),
  moon: (
    <>
      <path d="M12.5 2.5a7.5 7.5 0 1 0 5 12.3A6.2 6.2 0 0 1 12.5 2.5z" fill="#ffe9a8" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M16 3.5l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" fill="#b57bff" />
    </>
  ),
  shard: (
    <>
      <path d="M4 8l6-6 6 6-6 10z" fill="#7fd8ff" stroke="#124a66" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 8h12M10 2l-2 6 2 10 2-10z" fill="none" stroke="#dff6ff" strokeWidth="0.8" opacity="0.8" />
    </>
  ),
  helmet: (
    <>
      <path d="M3 12.5C3 6.5 6.2 2.5 10 2.5s7 4 7 10v4.5h-5v-4.5H8V17H3z" fill="#b8c0cc" stroke="#3a3f70" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 9.5h9" stroke="#3a3f70" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 2.5v7" stroke="#efe9ff" strokeWidth="1.1" opacity="0.8" />
      <path d="M13 1.5c2 .5 3.5 2 4 4" fill="none" stroke="#d65a5a" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  backpack: (
    <>
      <path d="M7 4.5V3a3 3 0 0 1 6 0v1.5" fill="none" stroke="#5a3a10" strokeWidth="1.4" />
      <rect x="3.5" y="4.5" width="13" height="13" rx="3" fill="#a86f35" stroke={INK} strokeWidth="1.3" />
      <path d="M3.5 9.5h13" stroke={INK} strokeWidth="1.2" />
      <rect x="7" y="11" width="6" height="4" rx="1" fill="#8a5a2b" stroke={INK} strokeWidth="1" />
      <path d="M9 9.5v1.5" stroke="#e8b04a" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  stall: (
    <>
      <path d="M2 7.5L4 3h12l2 4.5z" fill="#d65a5a" stroke="#5a1a1a" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 3l-1 4.5M10 3v4.5M14 3l1 4.5" stroke="#f3ede0" strokeWidth="1.4" />
      <path d="M2 7.5c0 1.4 1 2 2 2s2-.6 2-2c0 1.4 1 2 2 2s2-.6 2-2c0 1.4 1 2 2 2s2-.6 2-2c0 1.4 1 2 2 2s2-.6 2-2" fill="#d65a5a" stroke="#5a1a1a" strokeWidth="1.1" />
      <path d="M4 9.5V17M16 9.5V17M3 17h14" stroke="#6b4b22" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 13.5h7v3.5h-7z" fill="#8a5a2b" stroke={INK} strokeWidth="1" />
      <circle cx="8.5" cy="12.8" r="1.1" fill="#f5c85b" />
      <circle cx="11.5" cy="12.8" r="1.1" fill="#7fd8ff" />
    </>
  ),
  cog: (
    <>
      <path d="M8.6 1.5h2.8l.5 2.3 1.6.7 2-1.3 2 2-1.3 2 .7 1.6 2.3.5v2.8l-2.3.5-.7 1.6 1.3 2-2 2-2-1.3-1.6.7-.5 2.3H8.6l-.5-2.3-1.6-.7-2 1.3-2-2 1.3-2-.7-1.6-2.3-.5V8.6l2.3-.5.7-1.6-1.3-2 2-2 2 1.3 1.6-.7z" fill="#b8c0cc" stroke="#3a3f70" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="3" fill="#2a2347" stroke="#3a3f70" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="1.2" fill="#f5c85b" />
    </>
  ),
  unweave: (
    <>
      <path d="M4 3h8v2.2H4zM4 12.8h8V15H4z" fill="#8a5a2b" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5.2 5.2h5.6v7.6H5.2z" fill="#9b7bff" stroke="#2a1150" strokeWidth="1.1" />
      <path d="M5.2 7.2h5.6M5.2 9h5.6M5.2 10.8h5.6" stroke="#e6d0ff" strokeWidth="0.8" opacity="0.8" />
      <path d="M10.8 8c2.2 0 2 2.5 3.6 2.5s1.4 2.8 3.1 3.4c.6.2.6 1.6-.4 2.4" fill="none" stroke="#c9a8ff" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2.4 1.3" />
    </>
  ),
  walker: (
    <>
      <path d="M10 2.2c2.3 0 3.6 1.9 3.6 4 0 1.3-.5 2.3-1.2 3l3 8.6H4.6l3-8.6c-.7-.7-1.2-1.7-1.2-3 0-2.1 1.3-4 3.6-4z" fill="#c9d8ff" fillOpacity="0.55" stroke="#3a3f70" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8.6" cy="6.4" r="0.9" fill="#f3ede0" />
      <circle cx="11.4" cy="6.4" r="0.9" fill="#f3ede0" />
      <path d="M7 13.5h6M7.8 16h4.4" stroke="#efe9ff" strokeWidth="0.9" strokeDasharray="1.2 1.2" opacity="0.8" />
    </>
  ),
  cheese: (
    <>
      <path d="M2.5 14.5L14 4.5l3.5 3.2v6.8z" fill="#f5c85b" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.5 14.5h15v2.5h-15z" fill="#e8b04a" stroke="#8a5d14" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="1.3" fill="#c9953a" />
      <circle cx="15" cy="12.5" r="0.9" fill="#c9953a" />
      <circle cx="8" cy="12.8" r="0.8" fill="#c9953a" />
    </>
  ),
  campfire: (
    <>
      <path d="M3 17.5l14-3.5M3 14l14 3.5" stroke="#6b4420" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 2.5c3.2 3 4.6 5.6 3.6 8.6-.6 1.8-2 2.9-3.6 2.9s-3-1.1-3.6-2.9c-.6-1.9.2-3.6 1.4-4.9.2 1.4.8 2.2 1.6 2.6-.4-2 .1-4.2.6-6.3z" fill="#f59a3a" stroke="#8a3d10" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 8.5c1.3 1.2 1.7 2.4 1.2 3.4-.3.6-.7.9-1.2.9s-.9-.3-1.2-.9c-.5-1 0-2.2 1.2-3.4z" fill="#ffe9a8" />
    </>
  ),
  lantern: (
    <>
      <path d="M8 1.8h4M10 1.8v1.7" stroke="#5a3a10" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.5 3.5h7l1 2v9.5l-1 2h-7l-1-2V5.5z" fill="#ffe9a8" fillOpacity="0.5" stroke="#5a3a10" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 5.5h9M5.5 15h9" stroke="#8a5d14" strokeWidth="1.2" />
      <path d="M10 7.5c1.3 1.4 1.3 3.8 0 5.3-1.3-1.5-1.3-3.9 0-5.3z" fill="#f5c85b" />
      <path d="M15.5 8.5l1.8-1.3.2 2.2zM15.5 8.5l1.5 1.8-2 .4z" fill="#c9d8ff" stroke="#3a3f70" strokeWidth="0.6" strokeLinejoin="round" />
    </>
  ),
  fastForward: <path d="M2.5 4.5l7 5.5-7 5.5zM10.5 4.5l7 5.5-7 5.5z" fill="currentColor" />,
  pause: <path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z" fill="currentColor" />,
  close: <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  check: <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  warning: (
    <>
      <path d="M10 2.5l8 14.5H2z" fill="currentColor" stroke="#0b0a14" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M10 7.5v4.5" stroke="#0b0a14" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.6" r="1.1" fill="#0b0a14" />
    </>
  )
} satisfies Record<string, ReactNode>;

export type PictoName = keyof typeof PICTOS;

/** Icon of each window, in the rail and in the window's title. */
const WINDOW_PICTO: Record<Exclude<WindowId, "hall">, PictoName> = {
  map: "map",
  gear: "helmet",
  inventory: "backpack",
  market: "stall",
  ascension: "gem",
  account: "cloud",
  settings: "cog"
};

export function WindowIcon({ id, size = 34 }: { id: WindowId; size?: number }) {
  return id === "hall" ? <TrophyIcon size={size} /> : <Picto name={WINDOW_PICTO[id]} size={size} className="window-icon" />;
}

export function Picto({ name, size = 20, className }: { name: PictoName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className={className ? `picto ${className}` : "picto"}>
      {PICTOS[name]}
    </svg>
  );
}

/** Powers, stall offers and Caravan wares each have a picto of their own (a test holds it). */
export const SKILL_PICTO: Record<SkillId, PictoName> = {
  frenzy: "bolt",
  rally: "horn",
  hawkeye: "eye",
  goldrain: "coins",
  ritual: "heart",
  echo: "pickaxe",
  unweave: "unweave"
};

export const OFFER_PICTO: Record<MarketOfferId, PictoName> = {
  chest: "chest",
  "great-chest": "greatChest",
  rage: "flask",
  fortune: "urn",
  autoclick: "scroll",
  hourglass: "hourglass"
};

export const CARAVAN_PICTO: Record<CaravanWareId, PictoName> = {
  token: "token",
  "sealed-coffer": "coffer",
  "bottled-night": "bottle",
  "pips-cheese": "cheese",
  "moth-lantern": "lantern",
  "ember-draught": "tankard",
  "eldra-thread": "spool",
  "three-chests": "crates"
};

export const BUFF_PICTO: Record<BuffId, PictoName> = {
  rage: "flask",
  fortune: "urn",
  autoclick: "scroll",
  overcharge: "gem",
  sharpness: "blade",
  walker: "walker",
  cheese: "cheese",
  lantern: "lantern",
  reunion: "campfire"
};
