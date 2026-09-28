import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Mire of Osric (BIBLE 7.4): the Baron's fenland, drained for peat and rice, flooded on
 * the night of the Binding. What stands still stands in the water: a peat-cutter's hut on
 * its stilts, leaning, a line of Mirelle's bottles black against its lit window; the sluice
 * of the drainage works, its gate stuck half raised; a jetty going nowhere, a boat sunk at
 * its end; lantern posts along the drowned road, still lit for no one.
 */
export const MIRE_STRUCTURES: Record<string, StructureRecipe> = {
  // Mirelle's house on its stilts, the one place of the Mire still lived in: leaning walls
  // of planks on a timber frame, a thatch sagging and patched, a crooked stovepipe, the
  // window lit behind her bottles and the herbs drying above it, a cauldron on the porch,
  // nets on a pole, a boat moored at the ladder's foot.
  "mire-alchemist": {
    w: 84,
    h: 122,
    fragile: 44,
    growth: 0.55,
    seed: 4105,
    pieces: [
      // Stilts, leaning, braced.
      { beam: [10, 76, 7, 122], width: 4, m: "wood", finish: "bark" },
      { beam: [26, 77, 25, 122], width: 4, m: "wood", finish: "bark", lift: -0.3 },
      { beam: [44, 77, 46, 122], width: 4, m: "wood", finish: "bark" },
      { beam: [62, 76, 66, 121], width: 4, m: "wood", finish: "bark", lift: -0.3 },
      { beam: [78, 75, 81, 120], width: 3, m: "wood", finish: "bark" },
      { beam: [9, 84, 27, 108], width: 2, m: "wood", lift: -0.4 },
      { beam: [45, 84, 64, 106], width: 2, m: "wood", lift: -0.4 },
      { beam: [64, 84, 46, 110], width: 2, m: "wood", lift: -0.6 },
      // The platform and its porch.
      { poly: [2, 74, 84, 71, 84, 78, 2, 81], m: "wood", finish: "boards" },
      { poly: [2, 80, 84, 77, 84, 79, 2, 82], m: "wood", lift: -0.6 },
      // The walls, leaning to the left a little: the front, and the side turned away.
      { poly: [8, 36, 54, 32, 56, 74, 10, 76], m: "wood", finish: "planks" },
      { poly: [54, 32, 70, 36, 70, 72, 56, 74], m: "wood", finish: "planks", side: "right" },
      // The timber frame over the planks.
      { beam: [9, 38, 10, 75], width: 3, m: "wood", lift: 0.3 },
      { beam: [54, 33, 55, 74], width: 3, m: "wood", lift: 0.3 },
      { beam: [9, 56, 55, 53], width: 2, m: "wood", lift: 0.2 },
      { beam: [69, 37, 70, 72], width: 2, m: "wood" },
      // The damp climbing the planks from the water.
      { poly: [10, 64, 55, 61, 56, 74, 10, 76], m: "wood", finish: "planks", lift: -0.45 },
      { poly: [56, 62, 70, 64, 70, 72, 56, 74], m: "wood", finish: "planks", side: "right", lift: -0.45 },
      // The thatch, sagging in the middle, two patches of boards nailed over holes.
      { roof: [-1, 6, 78, 32], m: "roof", style: "gable", finish: "thatch" },
      { beam: [4, 37, 37, 7], width: 2, m: "roof", lift: 0.5 },
      { cut: [30, 6, 38, 11, 46, 6, 40, 3, 36, 3] },
      { poly: [14, 28, 25, 26, 26, 32, 15, 34], m: "wood", finish: "boards", lift: -0.2 },
      { poly: [50, 20, 58, 22, 57, 27, 49, 26], m: "wood", finish: "boards", lift: -0.3 },
      // The crooked stovepipe, and its cap.
      { beam: [60, 24, 61, 8], width: 3, m: "metal" },
      { beam: [61, 8, 65, 2], width: 3, m: "metal" },
      { block: [63, 0, 5, 2], m: "metal", lift: 0.4 },
      // The door, the window and its shutters, one hanging from a hinge.
      { gap: [16, 55, 11, 20], style: "door", frame: "wood" },
      { gap: [32, 42, 12, 10], style: "window", lit: true, frame: "wood" },
      { block: [27, 41, 5, 12], m: "wood", finish: "planks", lift: 0.2 },
      { poly: [45, 43, 50, 45, 49, 56, 44, 53], m: "wood", finish: "planks", lift: -0.1 },
      { gap: [60, 46, 3, 7], style: "slit" },
      { decor: "mire-herbs", at: [31, 41] },
      { decor: "mire-crow", at: [35, 5] },
      { decor: "mire-bottles-row", at: [32, 53] },
      // The porch: a rail, a lantern, the cauldron, the nets on their pole.
      { beam: [70, 72, 70, 60], width: 2, m: "wood" },
      { beam: [70, 61, 84, 60], width: 2, m: "wood" },
      { beam: [83, 71, 83, 60], width: 2, m: "wood" },
      { decor: "lantern", at: [75, 70], keep: true },
      { decor: "mire-cauldron", at: [58, 72] },
      { beam: [3, 76, 1, 40], width: 2, m: "wood" },
      { decor: "mire-net", at: [0, 66] },
      // Down to the water: the ladder, the boat moored at its foot, reeds.
      { decor: "mire-ladder", at: [30, 101] },
      { decor: "mire-skiff", at: [22, 121], keep: true },
      { decor: "mire-reeds", at: [66, 121] },
      { decor: "mire-reeds", at: [0, 121], flip: true }
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
  // Herbs hung to dry over the window: bundles, heads down.
  "mire-herbs": {
    rows: ["#############", ".h..g..h..g..", ".h..g..h..g..", "hgh.ggghgh.gg", "ggg.hgh.gg.hg", ".g..hg..g..g.", ".g...g..h....", "......g......"],
    legend: { "#": ["wood", 1], h: ["wood", 3], g: ["cloth", 2] }
  },
  // A row of bottles on the sill, black against the light, one glowing.
  "mire-bottles-row": {
    rows: [".#...#..*...#.", ".#..###.*..###", "###.#b#*c*.#b#", "#b#.#b#***.#b#", "##############"],
    legend: { "#": "outline", b: ["metal", 1], "*": "glow", c: "core" }
  },
  // The cauldron on the porch, still simmering.
  "mire-cauldron": {
    rows: ["...*.*..", "..*.c.*.", "#******#", "#mmmmmm#", ".#mMMm#.", ".#mmmm#.", "..#..#.."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 2], "*": "glow", c: "core" },
    frames: [[], [{ x: 2, y: 0, rows: ["*...*", ".c.*."] }], [{ x: 3, y: 0, rows: ["*..", "..c"] }], [{ x: 2, y: 0, rows: [".*.*.", "*.c.."] }]]
  },
  // Nets hung on a pole to dry, their floats.
  "mire-net": {
    rows: ["#k#k#k#", "k.k.k.k", "#k#k#k#", "k.k.k.k", "#k#k#k#", "k.k.k.k", "#k#k#k#", ".k.k.k.", "..f.f..", ".k...k.", "k.....k"],
    legend: { "#": ["cloth", 0], k: ["cloth", 2], f: ["wood", 3] }
  },
  // The ladder from the porch down into the water.
  "mire-ladder": {
    rows: ["w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "w..w", "w..w"],
    legend: { w: ["wood", 1], W: ["wood", 2] }
  },
  // Her skiff, tied to the ladder, an oar across it.
  "mire-skiff": {
    rows: ["#..................##", "#w#..............#ww#", ".#wwwww.....wwwwwwW#.", "..#wwWWWWWWWWWWWWww#.", "...#WWWWWWWWWWWWWW#..", "....###############..", "..oooooooooooo......."],
    legend: { "#": "outline", w: ["wood", 3], W: ["wood", 1], o: ["wood", 2] }
  },
  // A crow on the ridge, watching the road, one eye catching the light.
  "mire-crow": {
    rows: ["...##..", "..#e##.", ".####..", "#####..", ".###...", "..#.#.."],
    legend: { "#": "outline", e: "glow" }
  },
  // Reeds at the foot of the stilts.
  "mire-reeds": {
    rows: [".c.....c..", ".c.r...c..", "r..r.r.r.r", "r.r..r.r.r", ".rr.r..rr.", "..r.rr.r..", "..rrr.rr.."],
    legend: { r: ["cloth", 1], c: ["wood", 1] }
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
