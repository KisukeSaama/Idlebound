import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Mire of Osric (BIBLE 7.4): the Baron's fenland, drained for peat and rice, flooded on
 * the night of the Binding. What stands still stands in the water: a peat-cutter's hut on
 * its stilts, leaning, a line of Mirelle's bottles black against its lit window; the sluice
 * of the drainage works, its gate stuck half raised; a jetty going nowhere, a boat sunk at
 * its end; lantern posts along the drowned road, still lit for no one.
 */
export const MIRE_STRUCTURES: Record<string, StructureRecipe> = {
  // Mirelle's house on its stilts, the one place of the Mire still lived in, seen across
  // the water: leaning walls of planks on a timber frame, a thatch sagging and patched, a
  // crooked stovepipe, her window lit, a lantern on the porch.
  "mire-alchemist": {
    w: 42,
    h: 61,
    fragile: 22,
    growth: 0.55,
    seed: 4105,
    pieces: [
      // Stilts, leaning, braced.
      { beam: [5, 38, 4, 61], width: 2, m: "wood", finish: "bark" },
      { beam: [13, 39, 13, 61], width: 2, m: "wood", finish: "bark", lift: -0.3 },
      { beam: [22, 39, 23, 61], width: 2, m: "wood", finish: "bark" },
      { beam: [31, 38, 33, 61], width: 2, m: "wood", finish: "bark", lift: -0.3 },
      { beam: [39, 38, 41, 60], width: 2, m: "wood", finish: "bark" },
      { beam: [5, 42, 14, 54], width: 1, m: "wood", lift: -0.4 },
      { beam: [32, 42, 23, 55], width: 1, m: "wood", lift: -0.6 },
      // The platform and its porch.
      { poly: [1, 37, 42, 36, 42, 39, 1, 41], m: "wood", finish: "boards" },
      // The walls, leaning to the left a little: the front, and the side turned away.
      { poly: [4, 18, 27, 16, 28, 37, 5, 38], m: "wood", finish: "planks" },
      { poly: [27, 16, 35, 18, 35, 36, 28, 37], m: "wood", finish: "planks", side: "right" },
      { beam: [5, 19, 5, 38], width: 1, m: "wood", lift: 0.3 },
      { beam: [27, 17, 28, 37], width: 1, m: "wood", lift: 0.3 },
      // The damp climbing the planks from the water.
      { poly: [5, 32, 28, 31, 28, 37, 5, 38], m: "wood", finish: "planks", lift: -0.45 },
      // The thatch, sagging in the middle, a patch of boards nailed over a hole.
      { roof: [0, 3, 39, 16], m: "roof", style: "gable", finish: "thatch" },
      { cut: [15, 3, 19, 6, 23, 3, 20, 2, 18, 2] },
      { poly: [7, 14, 13, 13, 13, 16, 8, 17], m: "wood", finish: "boards", lift: -0.2 },
      // The crooked stovepipe.
      { beam: [30, 12, 31, 4], width: 2, m: "metal" },
      { beam: [31, 4, 33, 1], width: 2, m: "metal" },
      // The door, the window and its shutter.
      { gap: [8, 28, 6, 10], style: "door", frame: "wood" },
      { gap: [16, 21, 6, 5], style: "window", lit: true, frame: "wood" },
      { block: [14, 21, 2, 6], m: "wood", finish: "planks", lift: 0.2 },
      // The porch: a rail, and the lantern.
      { beam: [35, 31, 42, 30], width: 1, m: "wood" },
      { beam: [42, 36, 42, 30], width: 1, m: "wood" },
      { decor: "lantern", at: [37, 38], keep: true }
    ]
  },
  // Middle distance: a cottage drowned to its eaves, its chimney still standing.
  "mire-drowned-cottage": {
    w: 40,
    h: 24,
    fragile: 8,
    growth: 0.5,
    seed: 4106,
    pieces: [
      { block: [4, 16, 30, 8], m: "stone", finish: "rubble" },
      { roof: [0, 4, 38, 14], m: "roof", style: "gable", finish: "thatch" },
      { cut: [10, 6, 16, 4, 20, 9, 14, 11] },
      { block: [28, 0, 5, 10], m: "stone", finish: "ashlar" },
      { gap: [8, 18, 5, 4], style: "window", lit: true }
    ]
  },
  // Middle distance: the roof of a great barn, the water up to its ridge.
  "mire-sunk-barn": {
    w: 60,
    h: 20,
    fragile: 6,
    growth: 0.4,
    seed: 4107,
    pieces: [
      { roof: [0, 2, 60, 18], m: "roof", style: "gable", finish: "shingle" },
      { cut: [34, 4, 44, 12, 40, 14, 32, 8] },
      { beam: [30, 1, 30, 6], width: 2, m: "wood" },
      { beam: [26, 3, 34, 2], width: 1, m: "wood" }
    ]
  },
  // Middle distance: the drowned road's posts, walking off into the fog.
  "mire-posts": {
    w: 70,
    h: 22,
    fragile: 4,
    growth: 0.3,
    seed: 4108,
    pieces: [
      { beam: [4, 22, 5, 2], width: 3, m: "wood" },
      { beam: [22, 22, 22, 6], width: 3, m: "wood" },
      { beam: [38, 22, 39, 9], width: 2, m: "wood" },
      { beam: [52, 22, 51, 12], width: 2, m: "wood" },
      { beam: [64, 22, 64, 15], width: 2, m: "wood" },
      { beam: [5, 8, 22, 10], width: 1, m: "wood", sag: -2 },
      { beam: [22, 10, 38, 13], width: 1, m: "wood", sag: -2 }
    ]
  },
  "mire-stilt-hut": {
    w: 48,
    h: 58,
    fragile: 20,
    growth: 0.4,
    seed: 4101,
    pieces: [
      { beam: [8, 34, 6, 58], width: 3, m: "wood" },
      { beam: [20, 34, 20, 58], width: 3, m: "wood", lift: -0.3 },
      { beam: [32, 33, 34, 58], width: 3, m: "wood" },
      { beam: [42, 33, 45, 56], width: 3, m: "wood", lift: -0.3 },
      { poly: [4, 11, 36, 8, 38, 30, 6, 32], m: "wood", finish: "planks" },
      { poly: [36, 8, 43, 11, 44, 29, 38, 30], m: "wood", finish: "planks", side: "right" },
      { roof: [1, 0, 42, 13], m: "roof", style: "gable", finish: "thatch" },
      { poly: [38, 1, 46, 10, 44, 12, 36, 6], m: "roof", finish: "thatch", side: "right" },
      { poly: [1, 31, 46, 29, 46, 34, 1, 37], m: "wood", finish: "boards" },
      { gap: [10, 18, 7, 13], style: "door", frame: "wood" },
      { gap: [23, 15, 8, 7], style: "window", lit: true, frame: "wood" },
      { decor: "mire-bottles", at: [23, 21] },
      { decor: "mire-ladder", at: [38, 56] },
      { block: [4, 26, 5, 4], m: "rock", finish: "rubble" }
    ]
  },
  "mire-sluice": {
    w: 42,
    h: 40,
    fragile: 12,
    growth: 0.55,
    seed: 4102,
    pieces: [
      { block: [2, 8, 10, 32], m: "stone", finish: "ashlar" },
      { block: [30, 8, 10, 32], m: "stone", finish: "ashlar", side: "right" },
      { block: [0, 5, 42, 4], m: "wood", finish: "boards" },
      { block: [12, 14, 18, 18], m: "wood", finish: "planks", lift: -0.2 },
      { gap: [12, 32, 18, 5], style: "slit" },
      { beam: [21, 6, 21, 14], width: 1, m: "metal" },
      { decor: "mire-wheel", at: [17, 5] }
    ]
  },
  "mire-jetty": {
    w: 64,
    h: 18,
    fragile: 4,
    growth: 0.3,
    seed: 4103,
    pieces: [
      { beam: [4, 6, 4, 18], width: 3, m: "wood" },
      { beam: [20, 6, 20, 18], width: 3, m: "wood", lift: -0.3 },
      { beam: [36, 5, 37, 18], width: 3, m: "wood" },
      { poly: [0, 6, 44, 4, 44, 8, 0, 10], m: "wood", finish: "boards" },
      { beam: [48, 3, 50, 18], width: 3, m: "wood", lift: -0.4 },
      { decor: "mire-boat", at: [42, 17] }
    ]
  },
  "mire-lantern-post": {
    w: 18,
    h: 42,
    fragile: 14,
    growth: 0.3,
    seed: 4104,
    pieces: [
      { beam: [6, 42, 7, 3], width: 3, m: "wood" },
      { beam: [6, 5, 16, 6], width: 2, m: "wood" },
      { decor: "lantern", at: [11, 13], keep: true }
    ]
  }
};

export const MIRE_DECOR: Record<string, DecorGrid> = {
  // The ladder from the porch down into the water.
  "mire-ladder": {
    rows: ["w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "w..w", "w..w"],
    legend: { w: ["wood", 1], W: ["wood", 2] }
  },
  // Mirelle's bottles on the sill, black against the window, one still glowing.
  "mire-bottles": {
    rows: [".#....*..", ".#..#.*.#", "###.#*c*#", "###.#***#"],
    legend: { "#": "outline", "*": "glow", c: "core" }
  },
  // The sluice's winch wheel, rusted still.
  "mire-wheel": {
    rows: ["..###..", ".#m#m#.", "#m.m.m#", "##mMm##", "#m.m.m#", ".#m#m#.", "..###.."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 3] }
  },
  // A rowboat, its stern sunk, its bow up out of the water.
  "mire-boat": {
    rows: ["##..............", "#w#.........##..", ".#ww#....###ww#.", "..#wwwwwwwwwWW#.", "...#WWWWWWWWW#.."],
    legend: { "#": "outline", w: ["wood", 2], W: ["wood", 1] }
  }
};
