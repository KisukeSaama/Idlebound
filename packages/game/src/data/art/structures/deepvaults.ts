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
    w: 35,
    h: 50,
    fragile: 28,
    growth: 0.12,
    seed: 3101,
    pieces: [
      // The back legs, in shade, then the front legs of the frame, meeting under the head.
      { beam: [9, 50, 15, 6], width: 2, m: "wood", finish: "planks", lift: -0.6 },
      { beam: [23, 50, 17, 6], width: 2, m: "wood", finish: "planks", lift: -0.6 },
      { beam: [4, 50, 14, 3], width: 2, m: "wood", finish: "planks" },
      { beam: [28, 50, 18, 3], width: 2, m: "wood", finish: "planks" },
      { beam: [7, 34, 25, 34], width: 2, m: "wood" },
      { beam: [10, 21, 21, 21], width: 1, m: "wood" },
      { beam: [8, 33, 20, 22], width: 1, m: "wood", lift: -0.3 },
      { block: [10, 1, 12, 3], m: "wood", finish: "boards" },
      { decor: "vault-pulley", at: [13, 9] },
      // The rope down the shaft, a bucket at its end.
      { beam: [16, 9, 16, 40], width: 1, m: "cloth" },
      { poly: [14, 40, 19, 40, 19, 44, 14, 44], m: "wood", finish: "planks" },
      // The scaffold beside it, and the winch at its foot.
      { block: [0, 41, 12, 1], m: "wood", finish: "boards" },
      { beam: [1, 42, 1, 50], width: 1, m: "wood" },
      { beam: [11, 42, 11, 50], width: 1, m: "wood" },
      { beam: [24, 46, 32, 46], width: 4, m: "wood", finish: "boards" },
      { decor: "vault-lantern", at: [4, 40], keep: true }
    ]
  },
  // The Runeguild's winding house over the great shaft, across the vault: a head-frame of
  // heavy timbers, braced, its sheave wheel at the top, the cable down the shaft, the winch
  // hut beside it with a lit window, a scaffold; the miner's lantern still lit.
  "vault-winding-house": {
    w: 44,
    h: 60,
    fragile: 30,
    growth: 0.34,
    seed: 3107,
    pieces: [
      // The back legs, in shade, then the front legs, meeting under the sheave.
      { beam: [7, 57, 15, 7], width: 2, m: "wood", finish: "planks", lift: -0.7 },
      { beam: [26, 57, 18, 7], width: 2, m: "wood", finish: "planks", lift: -0.7 },
      { beam: [2, 57, 14, 5], width: 3, taper: 2, m: "wood", finish: "planks" },
      { beam: [31, 57, 19, 5], width: 3, taper: 2, m: "wood", finish: "planks" },
      // Cross braces.
      { beam: [4, 46, 29, 46], width: 2, m: "wood", finish: "boards" },
      { beam: [8, 30, 25, 30], width: 2, m: "wood", finish: "boards" },
      { beam: [11, 18, 22, 18], width: 1, m: "wood" },
      { beam: [5, 45, 24, 31], width: 1, m: "wood" },
      { beam: [28, 45, 9, 31], width: 1, m: "wood" },
      // The head: a platform of boards, the sheave wheel on it.
      { block: [9, 8, 16, 3], m: "wood", finish: "boards", lift: 0.2 },
      { decor: "vault-pulley", at: [13, 8] },
      // The cable down the shaft, and across to the winch.
      { beam: [17, 8, 17, 44], width: 1, m: "metal" },
      { beam: [20, 5, 35, 33], width: 1, m: "metal", lift: -0.3 },
      // The winch hut, planked, its roof shingled, a lit window, the door ajar.
      { block: [29, 37, 14, 20], m: "wood", finish: "planks" },
      { block: [42, 38, 2, 19], m: "wood", finish: "planks", side: "right" },
      { roof: [27, 30, 17, 8], m: "roof", style: "gable", finish: "shingle" },
      { gap: [36, 42, 4, 5], style: "window", lit: true, frame: "wood" },
      { gap: [31, 46, 4, 11], style: "door", frame: "wood" },
      // The collar of the shaft, dressed stone.
      { block: [0, 56, 30, 4], m: "stone", finish: "ashlar" },
      // A scaffold on the left, the lantern hung from it.
      { block: [0, 36, 9, 2], m: "wood", finish: "boards" },
      { beam: [1, 38, 1, 56], width: 1, m: "wood" },
      { beam: [8, 38, 8, 56], width: 1, m: "wood" },
      { decor: "vault-lantern", at: [2, 46], keep: true }
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
  // A ladder of rough rungs.
  "vault-ladder": {
    rows: Array.from({ length: 38 }, (_, row) => (row % 3 === 0 ? "WwwwW" : "W...W")),
    legend: { W: ["wood", 1], w: ["wood", 2] }
  },
  "vault-glint": {
    rows: ["*", "*"],
    legend: { "*": "glow" }
  }
};
