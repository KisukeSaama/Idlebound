import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Deepvaults (BIBLE 7.3): the Runeguild's mines, where the star-shards were dug. A
 * head-frame still stands over its shaft, the rope down, a lantern lit on it: someone
 * still works here. Galleries open in the rock, framed in timber, icicles on their lintels;
 * pillars carved with runes that still glow hold the vault up; a cart heaped with shards
 * waits on the rails; crystals grow out of the floor.
 */
export const DEEPVAULTS_STRUCTURES: Record<string, StructureRecipe> = {
  "vault-headframe": {
    w: 64,
    h: 90,
    fragile: 50,
    growth: 0.12,
    seed: 3101,
    pieces: [
      // The back legs, in shade, then the front legs of the frame, meeting under the head.
      { beam: [16, 90, 27, 10], width: 3, m: "wood", finish: "planks", lift: -0.6 },
      { beam: [42, 90, 30, 10], width: 3, m: "wood", finish: "planks", lift: -0.6 },
      { beam: [8, 90, 25, 6], width: 4, m: "wood", finish: "planks" },
      { beam: [50, 90, 32, 6], width: 4, m: "wood", finish: "planks" },
      { beam: [13, 62, 45, 62], width: 3, m: "wood" },
      { beam: [19, 38, 38, 38], width: 3, m: "wood" },
      { beam: [15, 60, 36, 40], width: 2, m: "wood", lift: -0.3 },
      { block: [18, 1, 22, 7], m: "wood", finish: "boards" },
      { decor: "vault-pulley", at: [25, 12] },
      // The rope down the shaft, a bucket at its end.
      { beam: [30, 12, 30, 72], width: 1, m: "cloth" },
      { poly: [25, 72, 35, 72, 34, 80, 26, 80], m: "wood", finish: "planks" },
      { beam: [25, 75, 35, 75], width: 1, m: "metal" },
      // The scaffold beside it, and the winch at its foot.
      { block: [0, 74, 22, 3], m: "wood", finish: "boards" },
      { beam: [2, 77, 2, 90], width: 2, m: "wood" },
      { beam: [20, 77, 20, 90], width: 2, m: "wood" },
      { beam: [46, 90, 46, 84], width: 2, m: "wood" },
      { beam: [44, 83, 58, 83], width: 7, m: "wood", finish: "boards" },
      { beam: [59, 83, 62, 77], width: 1, m: "metal" },
      { decor: "vault-lantern", at: [8, 72], keep: true }
    ]
  },
  // The Runeguild's winding house over the great shaft: a head-frame of heavy timbers,
  // braced and bolted, its sheave wheel at the top, the cage hanging on the cable down the
  // shaft, the winch hut beside it with a lit window, a scaffold with a ladder, crates, a
  // barrel and a coil of rope at its foot, the guild's sign; the miner's lantern still lit.
  "vault-winding-house": {
    w: 88,
    h: 120,
    fragile: 60,
    growth: 0.34,
    seed: 3107,
    pieces: [
      // The back legs, in shade, then the front legs, meeting under the sheave.
      { beam: [14, 114, 30, 14], width: 4, taper: 3, m: "wood", finish: "planks", lift: -0.7 },
      { beam: [52, 114, 36, 14], width: 4, taper: 3, m: "wood", finish: "planks", lift: -0.7 },
      // Cross braces, back then front.
      { beam: [17, 96, 49, 96], width: 3, m: "wood", finish: "boards", lift: -0.5 },
      { beam: [22, 64, 44, 64], width: 3, m: "wood", finish: "boards", lift: -0.5 },
      { beam: [18, 94, 45, 66], width: 2, m: "wood", lift: -0.6 },
      { beam: [48, 94, 21, 66], width: 2, m: "wood", lift: -0.6 },
      { beam: [4, 114, 28, 10], width: 6, taper: 4, m: "wood", finish: "planks" },
      { beam: [62, 114, 38, 10], width: 6, taper: 4, m: "wood", finish: "planks" },
      { beam: [8, 92, 58, 92], width: 4, m: "wood", finish: "boards" },
      { beam: [16, 60, 50, 60], width: 4, m: "wood", finish: "boards" },
      { beam: [22, 36, 44, 36], width: 3, m: "wood", finish: "boards" },
      { beam: [10, 90, 48, 62], width: 3, m: "wood", finish: "planks" },
      { beam: [56, 90, 18, 62], width: 3, m: "wood", finish: "planks" },
      { beam: [18, 58, 42, 38], width: 2, m: "wood" },
      // Iron bolts at the joints.
      { decor: "vault-bolt", at: [8, 93] },
      { decor: "vault-bolt", at: [57, 93] },
      { decor: "vault-bolt", at: [16, 61] },
      { decor: "vault-bolt", at: [49, 61] },
      // The head: a platform of boards, its rail, the sheave wheel on it.
      { block: [18, 16, 32, 5], m: "wood", finish: "boards", lift: 0.2 },
      { beam: [18, 16, 18, 10], width: 1, m: "wood" },
      { beam: [50, 16, 50, 10], width: 1, m: "wood" },
      { beam: [18, 11, 50, 11], width: 1, m: "wood" },
      { decor: "vault-sheave", at: [26, 16] },
      { decor: "vault-icicles", at: [21, 24] },
      // The cable down the shaft to the cage, and across to the winch.
      { beam: [33, 16, 33, 78], width: 1, m: "metal" },
      { beam: [40, 10, 70, 70], width: 1, m: "metal", lift: -0.3 },
      { decor: "vault-cage", at: [29, 90] },
      // The winch hut, planked, its roof shingled, a lit window, the door ajar.
      { block: [58, 74, 28, 40], m: "wood", finish: "planks" },
      { block: [84, 76, 4, 38], m: "wood", finish: "planks", side: "right" },
      { roof: [54, 60, 34, 15], m: "roof", style: "gable", finish: "shingle" },
      { decor: "vault-icicles", at: [60, 77] },
      { gap: [72, 84, 8, 9], style: "window", lit: true, frame: "wood" },
      { gap: [61, 92, 9, 22], style: "door", frame: "wood" },
      { gap: [68, 70, 4, 3], style: "slit" },
      { decor: "vault-sign", at: [72, 106] },
      // The collar of the shaft, dressed stone, runes cut in it.
      { block: [0, 112, 60, 8], m: "stone", finish: "ashlar" },
      { decor: "vault-runes", at: [6, 118] },
      { decor: "vault-runes", at: [50, 118] },
      // A scaffold on the left, its ladder, the lantern hung from it.
      { block: [0, 72, 18, 3], m: "wood", finish: "boards" },
      { beam: [1, 75, 1, 112], width: 2, m: "wood" },
      { beam: [16, 75, 16, 112], width: 2, m: "wood" },
      { decor: "vault-ladder", at: [7, 111] },
      { decor: "vault-lantern", at: [3, 84], keep: true },
      // Crates, a barrel, a coil of rope.
      { block: [22, 102, 12, 10], m: "wood", finish: "planks" },
      { beam: [22, 102, 34, 112], width: 1, m: "wood", lift: 0.4 },
      { block: [34, 106, 9, 6], m: "wood", finish: "boards", lift: -0.2 },
      { decor: "vault-barrel", at: [44, 111] },
      { decor: "vault-coil", at: [13, 111] }
    ]
  },
  // A scaffold tower seen across the vault, platforms and a ladder.
  "vault-scaffold": {
    w: 30,
    h: 64,
    fragile: 30,
    growth: 0.1,
    seed: 3108,
    pieces: [
      { beam: [3, 64, 5, 2], width: 2, m: "wood" },
      { beam: [26, 64, 24, 2], width: 2, m: "wood" },
      { block: [1, 2, 28, 3], m: "wood", finish: "boards" },
      { block: [2, 24, 26, 3], m: "wood", finish: "boards" },
      { block: [3, 46, 24, 3], m: "wood", finish: "boards" },
      { beam: [4, 26, 25, 46], width: 1, m: "wood" },
      { beam: [25, 5, 4, 24], width: 1, m: "wood" },
      { decor: "vault-ladder", at: [13, 63] },
      { decor: "vault-glint", at: [20, 22] }
    ]
  },
  // An old head-frame that fell into its shaft, leaning, broken at the head.
  "vault-fallen-frame": {
    w: 44,
    h: 54,
    fragile: 20,
    growth: 0.15,
    seed: 3109,
    pieces: [
      { beam: [4, 54, 26, 6], width: 3, m: "wood", finish: "planks" },
      { beam: [30, 54, 30, 12], width: 3, m: "wood", finish: "planks", lift: -0.4 },
      { beam: [8, 38, 32, 34], width: 2, m: "wood" },
      { beam: [22, 6, 42, 16], width: 2, m: "wood" },
      { beam: [26, 8, 26, 30], width: 1, m: "metal" },
      { block: [0, 48, 44, 6], m: "rock", finish: "rock" },
      { decor: "vault-glint", at: [36, 47] }
    ]
  },
  "vault-gallery": {
    w: 56,
    h: 60,
    fragile: 30,
    growth: 0.2,
    seed: 3102,
    pieces: [
      { poly: [0, 60, 2, 30, 10, 14, 24, 4, 40, 6, 50, 18, 56, 36, 56, 60], m: "rock", finish: "rock" },
      { gap: [17, 27, 22, 33], style: "arch" },
      { beam: [16, 60, 16, 24], width: 3, m: "wood", finish: "planks" },
      { beam: [40, 60, 40, 24], width: 3, m: "wood", finish: "planks" },
      { beam: [12, 23, 44, 23], width: 4, m: "wood", finish: "boards" },
      { decor: "vault-icicles", at: [14, 29] },
      { decor: "vault-runes", at: [5, 52] },
      { decor: "vault-runes", at: [48, 50] }
    ]
  },
  "vault-pillar": {
    w: 22,
    h: 78,
    fragile: 30,
    growth: 0.15,
    seed: 3103,
    pieces: [
      { cyl: [4, 6, 14, 66], m: "stone", finish: "ashlar" },
      { block: [1, 0, 20, 7], m: "stone", finish: "ashlar", lift: 0.3 },
      { block: [1, 72, 20, 6], m: "stone", finish: "ashlar" },
      { decor: "vault-runes", at: [9, 60] },
      { decor: "vault-runes", at: [9, 40] },
      { decor: "vault-crystal", at: [0, 77] },
      { decor: "vault-crystal", at: [16, 77], flip: true }
    ]
  },
  "vault-cart": {
    w: 26,
    h: 18,
    fragile: 6,
    growth: 0,
    seed: 3104,
    pieces: [
      // A heap of shards over the rim.
      { poly: [3, 9, 7, 3, 11, 5, 15, 0, 20, 5, 23, 9], m: "crystal", lift: 0.2 },
      { poly: [2, 8, 24, 8, 22, 15, 4, 15], m: "wood", finish: "boards" },
      { beam: [2, 8, 24, 8], width: 1, m: "metal" },
      { beam: [6, 9, 6, 15], width: 1, m: "metal" },
      { beam: [20, 9, 20, 15], width: 1, m: "metal" },
      { decor: "vault-shards", at: [6, 5] },
      { decor: "vault-wheel", at: [4, 17] },
      { decor: "vault-wheel", at: [17, 17] }
    ]
  },
  "vault-crystals": {
    w: 32,
    h: 36,
    fragile: 16,
    growth: 0,
    seed: 3105,
    pieces: [
      // Each prism in two facets, the one toward the light a step lighter.
      { poly: [15, 36, 16, 16, 21, 8, 21, 36], m: "crystal", lift: -0.2 },
      { poly: [21, 36, 21, 8, 25, 18, 23, 36], m: "crystal", lift: -0.6 },
      { poly: [6, 36, 6, 12, 10, 1, 10, 36], m: "crystal", lift: 0.25 },
      { poly: [10, 36, 10, 1, 14, 12, 15, 36], m: "crystal", lift: -0.3 },
      { poly: [0, 36, 1, 25, 5, 20, 5, 36], m: "crystal", lift: 0.1 },
      { poly: [5, 36, 5, 20, 8, 27, 8, 36], m: "crystal", lift: -0.4 },
      { poly: [22, 36, 25, 27, 29, 24, 28, 36], m: "crystal", lift: 0 },
      { poly: [28, 36, 29, 24, 31, 26, 30, 36], m: "crystal", lift: -0.5 },
      { decor: "vault-glint", at: [9, 4] },
      { decor: "vault-glint", at: [20, 11] },
      { decor: "vault-glint", at: [3, 23] }
    ]
  },
  // A gallery far across the vault: a mouth in the rock, runes lit beside it.
  "vault-far-gallery": {
    w: 20,
    h: 16,
    fragile: 6,
    growth: 0,
    seed: 3106,
    pieces: [
      { poly: [0, 16, 2, 6, 8, 1, 14, 2, 20, 8, 20, 16], m: "rock" },
      { decor: "vault-glint", at: [4, 12] },
      { decor: "vault-glint", at: [16, 13] },
      { decor: "vault-glint", at: [16, 9] }
    ]
  }
};

export const DEEPVAULTS_DECOR: Record<string, DecorGrid> = {
  // The head-frame's pulley.
  "vault-pulley": {
    rows: ["..###..", ".#mmm#.", "#m#M#m#", "#mM#Mm#", "#m#M#m#", ".#mmm#.", "..###.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 1] }
  },
  // A miner's lantern, open-framed, its flame warm and breathing.
  "vault-lantern": {
    rows: ["..#..", "..#..", ".#m#.", "#mMm#", "#.c.#", "#ccc#", "#.c.#", ".#m#."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 3], c: "core" },
    frames: [[], [{ x: 1, y: 4, rows: [".c.", "cc.", ".c."] }], [], [{ x: 1, y: 4, rows: ["c..", "ccc", ".c."] }]]
  },
  // Runes cut down a stone, still lit.
  "vault-runes": {
    rows: [".*.", "**.", ".*.", "...", "*..", ".**", "..*", "...", "**.", ".*.", ".**"],
    legend: { "*": "glow" }
  },
  // Icicles along a lintel.
  "vault-icicles": {
    rows: ["iIiIiIiIiIiIiIiIiIiIiIiIi", "i.I.i.I..i.I.i..I.i.i.I.i", "i...I....I...I...I...I..i", "....I........I.......I..."],
    legend: { i: ["crystal", 3], I: ["crystal", 2] }
  },
  // A small cluster of crystal at the foot of a stone.
  "vault-crystal": {
    rows: ["..*...", ".*S.*.", ".SSs*.", "sSSsS.", "#sSs##"],
    legend: { "*": "glow", s: ["crystal", 3], S: ["crystal", 2], "#": "outline" }
  },
  // Shards on the heap, the brightest alight.
  "vault-shards": {
    rows: ["..*....*..", ".*s.s.*s..", "s*.s*s.*s."],
    legend: { "*": "glow", s: ["crystal", 3] }
  },
  "vault-wheel": {
    rows: [".###.", "#mMm#", ".###."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 3] }
  },
  // The sheave wheel at the top of the head-frame: rim, eight spokes, the hub.
  "vault-sheave": {
    rows: [
      ".....#####.....",
      "...##MmmmM##...",
      "..#Mm..m..mM#..",
      ".#M.m..m..m.M#.",
      ".#m..m.m.m..m#.",
      "#M....mmm....M#",
      "#m....mhm....m#",
      "#mmmmmhHhmmmmm#",
      "#m....mhm....m#",
      "#M....mmm....M#",
      ".#m..m.m.m..m#.",
      ".#M.m..m..m.M#.",
      "..#Mm..m..mM#..",
      "...##MmmmM##...",
      ".....#####....."
    ],
    legend: { "#": "outline", M: ["metal", 1], m: ["metal", 2], h: ["metal", 3], H: ["metal", 0] }
  },
  // An iron bolt plate at a joint of the timbers.
  "vault-bolt": {
    rows: ["#m#", "mhm", "#m#"],
    legend: { "#": "outline", m: ["metal", 1], h: ["metal", 3] }
  },
  // The cage on its cable, iron bars, a floor of boards.
  "vault-cage": {
    rows: ["....#....", "..#####..", ".#mhmhm#.", ".#m.m.m#.", ".#m.m.m#.", ".#m.m.m#.", ".#m.m.m#.", ".#mmmmm#.", ".#wWwWw#.", "..#####.."],
    legend: { "#": "outline", m: ["metal", 1], h: ["metal", 3], w: ["wood", 2], W: ["wood", 1] }
  },
  // A ladder of rough rungs.
  "vault-ladder": {
    rows: Array.from({ length: 38 }, (_, row) => (row % 3 === 0 ? "WwwwW" : "W...W")),
    legend: { W: ["wood", 1], w: ["wood", 2] }
  },
  // A barrel hooped in iron.
  "vault-barrel": {
    rows: ["..###..", ".#mhm#.", "#wWwWw#", "#mmhmm#", "#wWwWw#", "#WwWwW#", "#mmhmm#", "#wWwWw#", ".#####."],
    legend: { "#": "outline", m: ["metal", 1], h: ["metal", 3], w: ["wood", 2], W: ["wood", 1] }
  },
  // A coil of rope on the ground.
  "vault-coil": {
    rows: [".#ccc#.", "#cCcCc#", "#CcCcC#", ".#####."],
    legend: { "#": "outline", c: ["cloth", 2], C: ["cloth", 1] }
  },
  // The Runeguild's sign on its chains, the guild's rune still lit.
  "vault-sign": {
    rows: ["m.......m", "m.......m", "#########", "#wWwWwWw#", "#W*w*w*W#", "#wW*W*Ww#", "#########"],
    legend: { "#": "outline", m: ["metal", 2], w: ["wood", 2], W: ["wood", 1], "*": "glow" }
  },
  "vault-glint": {
    rows: ["*", "*"],
    legend: { "*": "glow" }
  }
};
