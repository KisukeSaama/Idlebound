import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Wychwood (BIBLE 7.2): the Grove's forest, where Séraphine was trained. Its people
 * built little and built into the trees: a house hollowed in the foot of a giant, its
 * carved door under a thatched porch, a balcony ringed round the trunk under a hat of
 * thatch, a ladder, herbs drying, a lantern hung for whoever walks at night, an owl
 * keeping watch; a dolmen where the druids laid offerings; a wayside shrine by the path,
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
    w: 92,
    h: 133,
    fragile: 64,
    growth: 0.5,
    seed: 2101,
    pieces: [
      // The giant: a trunk too wide to hold in two arms, its foot flaring into roots.
      { cyl: [26, 0, 42, 133], m: "bark", finish: "bark" },
      { poly: [26, 92, 26, 114, 16, 126, 8, 133, 42, 133, 34, 104], m: "bark", finish: "bark", side: "left" },
      { poly: [68, 90, 68, 112, 78, 124, 88, 133, 54, 133, 62, 102], m: "bark", finish: "bark", side: "right" },
      { beam: [20, 122, 0, 133], width: 7, taper: 2, sag: 3, m: "bark", finish: "bark" },
      { beam: [74, 120, 92, 133], width: 7, taper: 2, sag: -3, m: "bark", finish: "bark" },
      { beam: [30, 128, 22, 133], width: 4, taper: 2, m: "bark", finish: "bark", lift: -0.3 },
      // A bough high up, the owl on it; a broken one on the other side.
      { beam: [64, 30, 92, 16], width: 6, taper: 2, sag: 3, m: "bark", finish: "bark" },
      { beam: [28, 20, 8, 10], width: 5, taper: 2, sag: -2, m: "bark", finish: "bark" },
      // The upper room: a window under the eaves, a hat of thatch ringed round the trunk.
      { gap: [41, 18, 6, 8], style: "window", frame: "wood" },
      { roof: [12, 36, 70, 16], m: "roof", style: "gable", finish: "thatch" },
      { beam: [16, 52, 78, 52], width: 2, m: "wood" },
      // The balcony on its braces, its rail, herbs drying under it.
      { beam: [30, 86, 14, 72], width: 3, taper: 2, m: "wood" },
      { beam: [64, 86, 80, 72], width: 3, taper: 2, m: "wood" },
      { block: [8, 71, 78, 4], m: "wood", finish: "boards" },
      { decor: "grove-window", at: [40, 65] },
      { decor: "grove-rail", at: [8, 70] },
      { decor: "herbs", at: [10, 82] },
      { decor: "herbs", at: [74, 82], flip: true },
      // The door under its porch, steps of stone, the Grove's rune over it.
      { roof: [32, 101, 30, 9], m: "roof", style: "gable", finish: "thatch" },
      { beam: [34, 110, 34, 133], width: 2, m: "wood" },
      { beam: [60, 110, 60, 133], width: 2, m: "wood" },
      { decor: "grove-door", at: [40, 131] },
      { block: [36, 130, 22, 3], m: "stone", finish: "ashlar" },
      { block: [39, 128, 16, 2], m: "stone", finish: "ashlar", lift: 0.3 },
      { decor: "rune-grove", at: [45, 99] },
      // The ladder up to the balcony, shelf fungi on the bark, the lantern, the owl.
      { decor: "ladder", at: [14, 130] },
      { decor: "shelf-fungus", at: [27, 96] },
      { decor: "shelf-fungus", at: [58, 32], flip: true },
      { decor: "fungus", at: [30, 120] },
      { decor: "owl", at: [74, 26] },
      { decor: "grove-lantern", at: [82, 88], keep: true }
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
  // The house's lantern: a caged flame under a little roof, hung from a bracket.
  "grove-lantern": {
    rows: ["...#...", "...#...", "..#m#..", ".#MMM#.", "#mmmmm#", "#m*c*m#", "#*ccc*#", "#m*c*m#", "#m***m#", "#mmmmm#", ".#mMm#.", "..#m#.."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 2], "*": "glow", c: "core" },
    frames: [[], [{ x: 2, y: 5, rows: ["c*c", "*c*", "c*c"] }], [], [{ x: 2, y: 5, rows: ["***", "*c*", "*c*"] }]]
  },
  // An owl on the bough, its eyes in the dark; it blinks now and then.
  owl: {
    rows: ["#.....#", "##...##", "#bbbbb#", "#e#b#e#", "#bbvbb#", ".#bBb#.", ".#BbB#.", "..#B#..", "..#.#.."],
    legend: { "#": "outline", b: ["bark", 2], B: ["bark", 1], v: ["bone", 3], e: "glow" },
    frames: [[], [], [], [{ x: 1, y: 3, rows: ["#"] }, { x: 5, y: 3, rows: ["#"] }]]
  },
  // Bracket fungi on the bark, their rims faintly alight.
  fungus: {
    rows: [".**..", "*bbb*", ".bB.."],
    legend: { "*": "glow", b: ["bone", 2], B: ["bone", 1] }
  },
  // A shelf of fungi stacked on the bark, the upper ones broader, their rims alight.
  "shelf-fungus": {
    rows: ["..****...", ".*bbbb*..", "*bbBBbbb#", ".#BBBB##.", "...***...", "..*bbb*..", ".*bBBbb#.", "..#BB##.."],
    legend: { "*": "glow", b: ["bone", 2], B: ["bone", 1], "#": "outline" }
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
  // The round-headed door of the house: planks each lit on one edge, iron straps, a ring.
  "grove-door": {
    rows: [
      "....######....",
      "..##dwWdwW##..",
      ".#WdwWdwWdwW#.",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#mMMmMMmMMmMM#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdoM#",
      "#dwWdwWdwWdMo#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#mMMmMMmMMmMM#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#dwWdwWdwWdwW#",
      "#ddddddddddd##"
    ],
    legend: { "#": "outline", d: ["wood", 0], w: ["wood", 1], W: ["wood", 2], m: ["metal", 1], M: ["metal", 2], o: ["metal", 3] }
  },
  // The upper window, its shutters open, lit, a pot of herbs on the sill.
  "grove-window": {
    rows: [
      "###.######.###",
      "#wW#WWWWWW#Ww#",
      "#dW#**d***#Wd#",
      "#wW#*cd*c*#Ww#",
      "#dW#**d***#Wd#",
      "#wW#dddddd#Ww#",
      "#dW#**d***#Wd#",
      "#wW#*cd*g*#Ww#",
      "#dW#*gdgGg#Wd#",
      "#wW#WWWWWW#Ww#",
      "###.#dppd#.###"
    ],
    legend: { "#": "outline", d: ["wood", 0], w: ["wood", 1], W: ["wood", 2], p: ["wood", 1], g: ["cloth", 2], G: ["cloth", 1], "*": "glow", c: "core" },
    frames: [[], [{ x: 4, y: 3, rows: ["c*", "**"] }], [], [{ x: 8, y: 6, rows: ["c"] }]]
  },
  // The balcony's rail, round the trunk.
  "grove-rail": {
    rows: rail(78),
    legend: { d: ["wood", 0], w: ["wood", 1], W: ["wood", 2] }
  },
  // Bundles of herbs hung to dry from a stick.
  herbs: {
    rows: ["wwwwwww", ".#.#.#.", ".g.G.g.", "gGgGgGg", "GgGgGgG", ".G.g.G.", ".g...g."],
    legend: { "#": "outline", w: ["wood", 2], g: ["cloth", 2], G: ["cloth", 1] },
    frames: [[], [], [{ x: 0, y: 5, rows: ["..G.g.G", "..g...g"] }], []]
  },
  // The ladder up to the balcony.
  ladder: {
    rows: ladder(58),
    legend: { d: ["wood", 0], W: ["wood", 2] }
  },
  "ladder-short": {
    rows: ladder(32),
    legend: { d: ["wood", 0], W: ["wood", 2] }
  }
};
