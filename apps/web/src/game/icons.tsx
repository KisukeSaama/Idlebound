import type { WindowId } from "./context";

/** Window icons; their labels live in the hud namespace (`windowTitles`). */
export const WINDOW_META: Record<WindowId, { icon: string | null }> = {
  map: { icon: "/assets/icons/sidebar-zones-map.webp" },
  gear: { icon: "/assets/icons/sidebar-equipment-helmet.webp" },
  inventory: { icon: "/assets/icons/sidebar-inventory-backpack.webp" },
  market: { icon: "/assets/icons/sidebar-shop-stall.webp" },
  ascension: { icon: "/assets/icons/sidebar-essences-crystals.webp" },
  hall: { icon: null },
  account: { icon: "/assets/icons/sidebar-save-disk.webp" },
  settings: { icon: "/assets/icons/sidebar-settings-gear.webp" }
};

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
