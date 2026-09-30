import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Wychwood (BIBLE 7.2): the Grove's forest, where Séraphine was trained. Its people
 * built little and built into the trees: a house hollowed in the foot of a giant, seen
 * from the path and small with the distance, its door under a thatched porch, a balcony
 * ringed round the trunk under a hat of thatch, a window still lit, an owl keeping
 * watch; a dolmen where the druids laid offerings; a wayside shrine by the path,
 * a green cloak torn on it, where the forest grew thorns. Deeper in, half lost in the air,
 * a watch-hut up a trunk, standing stones and a rope bridge.
 */

/** A balcony rail as long as `long`: a lit top bar, posts every fourth column, a lower bar. */
function rail(long: number): string[] {
  const post = (x: number) => x % 4 === 0 || x === long - 1;
  return [
    "W".repeat(long),
    Array.from({ length: long }, (_, x) => (post(x) ? "w" : ".")).join(""),
    Array.from({ length: long }, (_, x) => (post(x) ? "w" : x % 4 === 2 ? "d" : ".")).join(""),
    "w".repeat(long),
    Array.from({ length: long }, (_, x) => (post(x) ? "d" : ".")).join("")
  ];
}

/** A ladder `tall` rows high: a rail in shade, a rail in light, a rung every fourth row. */
function ladder(tall: number): string[] {
  return Array.from({ length: tall }, (_, y) => (y % 4 === 1 ? "dWWWW" : "d...W"));
}

export const WYCHWOOD_STRUCTURES: Record<string, StructureRecipe> = {
  "grove-hut": {
    w: 46,
    h: 67,
    fragile: 32,
    growth: 0.5,
    seed: 2101,
    pieces: [
      // The giant: a trunk too wide to hold in two arms, its foot flaring into roots.
      { cyl: [13, 0, 21, 67], m: "bark", finish: "bark" },
      { poly: [13, 46, 13, 57, 8, 63, 4, 67, 21, 67, 17, 52], m: "bark", finish: "bark", side: "left" },
      { poly: [34, 45, 34, 56, 39, 62, 44, 67, 27, 67, 31, 51], m: "bark", finish: "bark", side: "right" },
      { beam: [10, 61, 0, 67], width: 4, taper: 1, sag: 2, m: "bark", finish: "bark" },
      { beam: [37, 60, 46, 67], width: 4, taper: 1, sag: -1, m: "bark", finish: "bark" },
      // A bough high up, the owl on it; a broken one on the other side.
      { beam: [32, 15, 46, 8], width: 3, taper: 1, sag: 2, m: "bark", finish: "bark" },
      { beam: [14, 10, 4, 5], width: 3, taper: 1, sag: -1, m: "bark", finish: "bark" },
      // The upper room: a window under the eaves, a hat of thatch ringed round the trunk.
      { gap: [21, 9, 3, 4], style: "window", frame: "wood" },
      { roof: [6, 18, 35, 8], m: "roof", style: "gable", finish: "thatch" },
      { beam: [8, 26, 39, 26], width: 1, m: "wood" },
      // The balcony on its braces, its rail, the window behind it still lit.
      { beam: [15, 43, 7, 36], width: 2, taper: 1, m: "wood" },
      { beam: [32, 43, 40, 36], width: 2, taper: 1, m: "wood" },
      { block: [4, 36, 39, 2], m: "wood", finish: "boards" },
      { beam: [4, 33, 43, 33], width: 1, m: "wood" },
      { gap: [21, 28, 5, 6], style: "window", lit: true, frame: "wood" },
      // The door under its porch, a step of stone.
      { roof: [16, 51, 15, 4], m: "roof", style: "gable", finish: "thatch" },
      { gap: [20, 56, 7, 9], style: "door", frame: "wood" },
      { block: [18, 65, 11, 2], m: "stone", finish: "ashlar" },
      { decor: "owl", at: [37, 13] }
    ]
  },
  "grove-dolmen": {
    w: 44,
    h: 32,
    fragile: 12,
    growth: 0.6,
    seed: 2102,
    pieces: [
      { poly: [3, 32, 5, 10, 11, 6, 16, 11, 16, 32], m: "rock", finish: "rock" },
      { poly: [28, 32, 29, 11, 34, 7, 40, 12, 41, 32], m: "rock", finish: "rock", side: "right" },
      { poly: [0, 11, 7, 3, 36, 0, 44, 6, 40, 13, 4, 14], m: "rock", finish: "rock", lift: 0.35 },
      { decor: "rune-grove", at: [19, 11] },
      { decor: "candle", at: [19, 31], keep: true },
      { decor: "candle", at: [24, 31], keep: true }
    ]
  },
  "wayshrine": {
    w: 20,
    h: 42,
    fragile: 16,
    growth: 0.35,
    seed: 2103,
    pieces: [
      { beam: [10, 42, 10, 16], width: 3, m: "wood" },
      { block: [4, 9, 12, 10], m: "wood", finish: "planks" },
      { gap: [7, 11, 6, 7], style: "arch", lit: true },
      { roof: [1, 1, 18, 9], m: "roof", style: "gable", finish: "shingle" },
      { decor: "cloak", at: [11, 33] }
    ]
  },
  // Deeper in the wood: a watch-hut up a trunk, its one window awake.
  "grove-watch": {
    w: 40,
    h: 70,
    fragile: 30,
    growth: 0.4,
    seed: 2104,
    pieces: [
      { cyl: [15, 0, 12, 70], m: "bark", finish: "bark" },
      { beam: [16, 62, 6, 70], width: 4, taper: 1, m: "bark" },
      { beam: [26, 62, 36, 70], width: 4, taper: 1, m: "bark" },
      { block: [6, 22, 28, 14], m: "wood", finish: "planks" },
      { gap: [16, 26, 5, 5], style: "window", lit: true, frame: "wood" },
      { roof: [3, 12, 34, 11], m: "roof", style: "gable", finish: "thatch" },
      { block: [2, 36, 36, 2], m: "wood", finish: "boards" },
      { decor: "ladder-short", at: [30, 69] }
    ]
  },
  // Standing stones in a ring, older than the Grove.
  "grove-stones": {
    w: 46,
    h: 26,
    fragile: 8,
    growth: 0.6,
    seed: 2105,
    pieces: [
      { poly: [2, 26, 3, 8, 7, 4, 10, 9, 10, 26], m: "rock", finish: "rock" },
      { poly: [14, 26, 15, 2, 20, 0, 23, 5, 23, 26], m: "rock", finish: "rock" },
      { poly: [28, 26, 29, 10, 33, 6, 36, 10, 36, 26], m: "rock", finish: "rock", side: "right" },
      { poly: [39, 26, 40, 14, 43, 12, 46, 16, 46, 26], m: "rock", finish: "rock", side: "right" }
    ]
  },
  // A rope bridge slung between two trunks, sagging.
  "grove-bridge": {
    w: 64,
    h: 48,
    fragile: 10,
    growth: 0.3,
    seed: 2106,
    pieces: [
      { cyl: [2, 0, 9, 48], m: "bark", finish: "bark" },
      { cyl: [53, 0, 9, 48], m: "bark", finish: "bark" },
      { beam: [10, 18, 54, 18], width: 2, sag: -8, m: "wood" },
      { beam: [10, 10, 54, 10], width: 1, sag: -8, m: "wood" }
    ]
  }
};

export const WYCHWOOD_DECOR: Record<string, DecorGrid> = {
  // A lantern on its chain, the flame breathing.
  lantern: {
    rows: ["..#..", "..#..", ".#m#.", "#mMm#", "#*c*#", "#***#", "#*c*#", ".#m#."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 3], "*": "glow", c: "core" },
    frames: [[], [{ x: 1, y: 4, rows: ["*c*", "*c*", "***"] }], [], [{ x: 1, y: 4, rows: ["***", "*c*", "*c*"] }]]
  },
  // An owl on the bough, its eyes in the dark; it blinks now and then.
  owl: {
    rows: ["#.....#", "##...##", "#bbbbb#", "#e#b#e#", "#bbvbb#", ".#bBb#.", ".#BbB#.", "..#B#..", "..#.#.."],
    legend: { "#": "outline", b: ["bark", 2], B: ["bark", 1], v: ["bone", 3], e: "glow" },
    frames: [[], [], [], [{ x: 1, y: 3, rows: ["#"] }, { x: 5, y: 3, rows: ["#"] }]]
  },
  // The Grove's rune, a tree with its arms raised, cut into wood or stone, still glowing.
  "rune-grove": {
    rows: ["*.*.*", ".***.", "..*..", "..*..", "..*.."],
    legend: { "*": "glow" }
  },
  // A candle stub left at the foot of the stones.
  candle: {
    rows: [".*.", ".c.", "#b#", "#b#"],
    legend: { "*": "glow", c: "core", "#": "outline", b: ["bone", 3] },
    frames: [[], [{ x: 1, y: 0, rows: ["c", "*"] }]]
  },
  // A green cloak caught on the shrine's post, torn.
  cloak: {
    rows: ["#......", ".#kk...", "..kKk..", ".kKKk..", ".kKKKk.", "kKK.Kk.", "k.K..k.", "..K...."],
    legend: { "#": "outline", k: ["cloth", 2], K: ["cloth", 1] }
  },
  "ladder-short": {
    rows: ladder(32),
    legend: { d: ["wood", 0], W: ["wood", 2] }
  }
};
