/**
 * The Orvane 64: the only colors the world is drawn with (BIBLE 18.3). Every sprite,
 * scene, portrait and effect picks from this table by index. Ramps run dark to light and
 * are hue-shifted: shadows cooler and more violet, highlights warmer. Nothing is pure
 * black; the darkest color is the night ink `#0b0a14` (index 0).
 */
export const ORVANE_64 = [
  // 0-9 night, from ink to the pale lilac of the Ledger's text
  "#0b0a14", "#140f24", "#1a1633", "#221a3d", "#2a2347", "#372c58", "#54438a", "#6f6794", "#a69ec8", "#efe9ff",
  // 10-12 pale lilac, warm paper, rare blue
  "#cfc6ea", "#e8dcc0", "#5aa9ff",
  // 13-17 gold
  "#3b2608", "#8a5d14", "#b8862b", "#f5c85b", "#ffe29a",
  // 18-21 essence violet
  "#3f1a7a", "#7a3fd6", "#b57bff", "#e6d0ff",
  // 22-26 royal violets of the Keep and the plains sky
  "#2b2450", "#3f3566", "#7a5bb8", "#c58cff", "#c9a6ff",
  // 27-33 deep blues, stone of the vaults (true blue in the dark, away from the night's
  // violet, warming to periwinkle in the light), shard light
  "#12202f", "#1e324c", "#334d73", "#5470b8", "#8f9cff", "#7fd8ff", "#dff6ff",
  // 34-40 forest teals and companion mint
  "#0e1420", "#172a2c", "#1d2a22", "#2c3f30", "#2f6b58", "#4fd1a5", "#c9ffe8",
  // 41-44 plains greens
  "#2e3a24", "#4a5a2a", "#5f8a3a", "#8bd46a",
  // 45-51 mire
  "#121410", "#1f2616", "#2f3318", "#4d5222", "#7d8f2f", "#b6d94c", "#e8ff9a",
  // 52-55 flesh
  "#4a2530", "#8a4a45", "#c98a6a", "#f0c4a0",
  // 56-58 fur and wood
  "#5a3a2a", "#8a5f3f", "#c29265",
  // 59-63 blood, fire and the warm rarities
  "#6b1a2e", "#b8323f", "#ff5c7a", "#ff8a4c", "#ffb347"
] as const;

/** Index of a color in the Orvane 64. */
export type Pal = number;

/** Named entries used across recipes, so data reads as words instead of numbers. */
export const C = {
  ink: 0, night1: 1, night2: 2, night3: 3, night4: 4, dusk: 5, amethyst: 6, haze: 7, lilac: 8, moon: 9,
  pale: 10, paper: 11, rareBlue: 12,
  goldInk: 13, goldDeep: 14, goldDark: 15, gold: 16, goldLight: 17,
  essenceDeep: 18, essence: 19, essenceBright: 20, essenceLight: 21,
  plum: 22, keepStone: 23, royal: 24, keepAccent: 25, violetFire: 26,
  vaultNight: 27, vault1: 28, vault2: 29, vault3: 30, vaultAccent: 31, shard: 32, shardLight: 33,
  woodNight: 34, woodNight2: 35, woodFloor: 36, woodFloor2: 37, woodLeaf: 38, mint: 39, wisp: 40,
  field1: 41, field2: 42, field3: 43, plainsAccent: 44,
  mire0: 45, mire1: 46, mire2: 47, mire3: 48, mire4: 49, mireAccent: 50, mireLight: 51,
  flesh0: 52, flesh1: 53, flesh2: 54, flesh3: 55,
  fur1: 56, fur2: 57, fur3: 58,
  blood: 59, red: 60, danger: 61, ember: 62, amber: 63
} as const satisfies Record<string, Pal>;

/** Kinds of surface detail a material adds on top of its shading. */
export type Texture = "smooth" | "fur" | "stone" | "bark" | "scales" | "cloth" | "metal" | "slime" | "bone" | "feather" | "ghost" | "crystal" | "leaf";

export interface Material {
  /** Palette indices, darkest first (4 or 5 steps). */
  ramp: readonly Pal[];
  texture: Texture;
}

/** The material ramps of the world (BIBLE 22.8). */
export const MATERIALS = {
  "fur-grey": { ramp: [C.night3, C.dusk, C.haze, C.lilac, C.pale], texture: "fur" },
  "fur-brown": { ramp: [C.flesh0, C.fur1, C.fur2, C.fur3, C.flesh3], texture: "fur" },
  "fur-shadow": { ramp: [C.night1, C.night3, C.night4, C.dusk, C.amethyst], texture: "fur" },
  "fur-gold": { ramp: [C.goldDeep, C.goldDark, C.gold, C.goldLight], texture: "fur" },
  /** Dark red-brown, so bare pink skin stands out against it (the Field Rat). */
  "fur-rust": { ramp: [C.night1, C.flesh0, C.blood, C.flesh1], texture: "fur" },
  hide: { ramp: [C.flesh0, C.flesh1, C.fur2, C.fur3], texture: "smooth" },
  flesh: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
  /** Old skin by moonlight: warm in the shadows, cold where the light falls (Aldemar). */
  ashen: { ramp: [C.flesh0, C.haze, C.flesh3, C.paper], texture: "smooth" },
  moss: { ramp: [C.woodFloor, C.field1, C.field2, C.field3, C.plainsAccent], texture: "leaf" },
  leaf: { ramp: [C.woodNight2, C.woodFloor2, C.woodLeaf, C.mint, C.wisp], texture: "leaf" },
  bark: { ramp: [C.night1, C.flesh0, C.fur1, C.fur2, C.fur3], texture: "bark" },
  stone: { ramp: [C.night3, C.night4, C.keepStone, C.haze, C.lilac], texture: "stone" },
  "cave-stone": { ramp: [C.vaultNight, C.vault1, C.vault2, C.vault3, C.vaultAccent], texture: "stone" },
  crystal: { ramp: [C.vault1, C.rareBlue, C.shard, C.shardLight], texture: "crystal" },
  slime: { ramp: [C.mire0, C.mire2, C.mire3, C.mire4, C.mireAccent], texture: "slime" },
  mud: { ramp: [C.mire0, C.mire1, C.mire2, C.mire3, C.fur1], texture: "smooth" },
  bone: { ramp: [C.night4, C.haze, C.lilac, C.paper, C.moon], texture: "bone" },
  metal: { ramp: [C.vault1, C.vault2, C.haze, C.lilac, C.moon], texture: "metal" },
  gold: { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold, C.goldLight], texture: "metal" },
  royal: { ramp: [C.night3, C.keepStone, C.royal, C.keepAccent, C.violetFire], texture: "cloth" },
  essence: { ramp: [C.essenceDeep, C.essence, C.essenceBright, C.essenceLight], texture: "ghost" },
  "cloth-red": { ramp: [C.night1, C.blood, C.red, C.danger], texture: "cloth" },
  ember: { ramp: [C.blood, C.red, C.ember, C.amber, C.goldLight], texture: "smooth" },
  "dark-metal": { ramp: [C.ink, C.night2, C.night4, C.dusk, C.haze], texture: "scales" },
  feather: { ramp: [C.ink, C.night2, C.dusk, C.haze], texture: "feather" },
  wisp: { ramp: [C.woodLeaf, C.mint, C.wisp, C.moon], texture: "ghost" }
} as const satisfies Record<string, Material>;

export type MaterialId = keyof typeof MATERIALS;

/** Hue-shifted color ramps for light, fire and companions, darkest first. */
export const RAMPS = {
  night: [C.ink, C.night1, C.night3, C.dusk, C.amethyst],
  pale: [C.haze, C.lilac, C.pale, C.moon],
  paper: [C.lilac, C.paper, C.moon],
  gold: [C.goldInk, C.goldDeep, C.goldDark, C.gold, C.goldLight],
  essence: [C.essenceDeep, C.essence, C.essenceBright, C.essenceLight],
  royal: [C.keepStone, C.royal, C.keepAccent, C.violetFire],
  shard: [C.vault1, C.rareBlue, C.shard, C.shardLight],
  vault: [C.vault1, C.vault2, C.vault3, C.vaultAccent],
  mint: [C.woodNight2, C.woodLeaf, C.mint, C.wisp],
  green: [C.field1, C.field2, C.field3, C.plainsAccent],
  mire: [C.mire2, C.mire4, C.mireAccent, C.mireLight],
  ember: [C.blood, C.red, C.ember, C.amber, C.goldLight],
  red: [C.blood, C.red, C.danger, C.flesh3],
  flesh: [C.flesh0, C.flesh1, C.flesh2, C.flesh3],
  wood: [C.flesh0, C.fur1, C.fur2, C.fur3],
  stone: [C.night4, C.keepStone, C.haze, C.lilac]
} as const satisfies Record<string, readonly Pal[]>;

export type RampId = keyof typeof RAMPS;

/** Parses `#rrggbb` into 0-255 channels. */
export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1, 7), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const RGB = ORVANE_64.map(hexToRgb);

/** Channels of a palette entry. */
export function palRgb(index: Pal): readonly [number, number, number] {
  return RGB[index];
}

/**
 * A palette entry in CIELAB (D65): distances there are the ones the eye sees, which is how
 * two scenes are told apart (pixel.test.ts).
 */
export function palLab(index: Pal): [number, number, number] {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = RGB[index].map(linear);
  const curve = (value: number) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);
  const x = curve((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const y = curve(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = curve((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** Perceived lightness of a palette entry, 0 to 255. */
export function palLuma(index: Pal): number {
  const [r, g, b] = RGB[index];
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** The ramp whose brightest steps best match a color: a companion's color becomes a ramp. */
export function rampFor(hex: string): RampId {
  let best: RampId = "gold";
  let bestDistance = Infinity;
  const [r, g, b] = hexToRgb(hex);
  for (const [id, ramp] of Object.entries(RAMPS) as [RampId, readonly Pal[]][]) {
    for (const index of ramp.slice(-2)) {
      const [pr, pg, pb] = RGB[index];
      const distance = 2 * (pr - r) ** 2 + 4 * (pg - g) ** 2 + 3 * (pb - b) ** 2;
      if (distance < bestDistance) {
        best = id;
        bestDistance = distance;
      }
    }
  }
  return best;
}
