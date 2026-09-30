import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Hearthfields (BIBLE 7.1): the mill, the farmhouse and the scarecrow are drawn by hand
 * in the generator; here stands Brom's forge at the crossroads, far up the road and small
 * with the distance, its fire banked but alive, a hammer left on the anvil, unfinished;
 * and behind it, in the mist, the barn and the chapel of the fields.
 */
export const HEARTHFIELDS_STRUCTURES: Record<string, StructureRecipe> = {
  "brom-forge": {
    w: 50,
    h: 47,
    fragile: 20,
    growth: 0.3,
    seed: 1101,
    pieces: [
      // The lean-to over the anvil, on two posts.
      { beam: [3, 47, 3, 25], width: 2, m: "wood" },
      { beam: [15, 47, 15, 23], width: 2, m: "wood" },
      { poly: [0, 25, 18, 19, 19, 22, 1, 28], m: "roof", finish: "thatch", lift: 0.3 },
      // The smithy: rubble walls, the side turned away in shade, a thatched gable.
      { block: [16, 23, 25, 24], m: "stone", finish: "rubble" },
      { block: [41, 25, 7, 22], m: "stone", finish: "rubble", side: "right" },
      { roof: [12, 8, 38, 16], m: "roof", style: "gable", finish: "thatch" },
      // The chimney, its cap a course wider, embers above it.
      { block: [33, 1, 6, 17], m: "stone", finish: "ashlar" },
      { block: [32, 1, 8, 2], m: "stone", lift: 0.4 },
      { decor: "chimney-embers", at: [34, 1] },
      // The mouth of the forge: a wide arch, the hearth burning deep inside; one window lit.
      { gap: [19, 30, 14, 17], style: "arch", frame: "stone" },
      { decor: "forge-fire", at: [22, 46] },
      { gap: [35, 31, 4, 5], style: "window", lit: true, frame: "wood" },
      { decor: "anvil", at: [5, 46], keep: true }
    ]
  },
  // In the mist behind the road: a barn, its hay door lit, and the chapel of the fields.
  "hearth-barn": {
    w: 46,
    h: 34,
    fragile: 14,
    growth: 0.3,
    seed: 1102,
    pieces: [
      { block: [4, 14, 38, 20], m: "wood", finish: "planks" },
      { roof: [0, 0, 46, 16], m: "roof", style: "gable", finish: "thatch" },
      { gap: [18, 22, 10, 12], style: "door", frame: "wood" },
      { gap: [20, 8, 6, 5], style: "window", lit: true },
      { decor: "haystack", at: [38, 33] }
    ]
  },
  "hearth-chapel": {
    w: 30,
    h: 44,
    fragile: 18,
    growth: 0.4,
    seed: 1103,
    pieces: [
      { block: [4, 24, 22, 20], m: "stone", finish: "ashlar" },
      { roof: [2, 14, 26, 12], m: "roof", style: "gable", finish: "shingle" },
      { block: [11, 4, 8, 12], m: "stone", finish: "ashlar" },
      { roof: [10, 0, 10, 6], m: "roof", style: "spire" },
      { gap: [13, 7, 4, 5], style: "arch" },
      { gap: [12, 32, 6, 12], style: "door" },
      { gap: [6, 28, 3, 5], style: "slit" }
    ]
  }
};

export const HEARTHFIELDS_DECOR: Record<string, DecorGrid> = {
  // The forge's hearth: flames standing out of the coals under a hood of stone, breathing.
  "forge-fire": {
    rows: ["..*..*..", ".*c**c*.", "*cccccc*"],
    legend: { "*": "glow", c: "core" },
    frames: [[], [{ x: 0, y: 0, rows: [".*....*.", "..c**c.."] }], [], [{ x: 0, y: 0, rows: ["...**..."] }]]
  },
  // The anvil by the door, the hammer on it: Brom never finished what he was making.
  anvil: {
    rows: ["....mM...", "...#hh#..", "mmmmmmmmm", "#MMmmmMM#", "...Mmm...", "..MMMMM.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 1], h: ["wood", 2] }
  },
  // Sparks over the chimney.
  "chimney-embers": {
    rows: [".*...", "...*.", "..*..", "....."],
    legend: { "*": "glow" },
    frames: [[], [{ x: 0, y: 0, rows: ["...*.", ".*...", "....*"] }], [{ x: 0, y: 0, rows: ["..*..", "....*", ".*..."] }], [{ x: 0, y: 0, rows: ["*....", "..*..", "...*."] }]]
  },
  // A haystack by the barn, never brought in.
  haystack: {
    rows: ["...hhh...", "..hHhhh..", ".hhHhhHh.", "hHhhhHhhh", "hhhHhhhHh"],
    legend: { h: ["roof", 2], H: ["roof", 1] }
  }
};
