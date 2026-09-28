import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * Orvane Keep (BIBLE 7.5): the royal keep, whose great hall is where the Binding was woven.
 * Its courtyard is broken: a colonnade with half its columns standing, a banner with no
 * colors left hanging between two of them; the stone wardens on their plinths, their heads
 * long gone; braziers of violet fire that nobody feeds and that never go out; an arch over
 * the stair to the hall; far off, towers with a window or two still lit.
 */
export const KEEP_STRUCTURES: Record<string, StructureRecipe> = {
  // The gatehouse of the great hall: two towers and a pointed arch whose keystone fell,
  // the portcullis stuck half raised, a banner with no colors left, violet light far inside.
  "keep-gatehouse": {
    w: 86,
    h: 128,
    fragile: 44,
    growth: 0.55,
    seed: 5111,
    pieces: [
      { block: [20, 30, 46, 85], m: "stone", finish: "ashlar", lift: 0.1 },
      // The right tower, taller, its top broken.
      { block: [66, 14, 20, 101], m: "stone", finish: "ashlar", side: "right" },
      { block: [65, 11, 22, 3], m: "stone", lift: 0.4 },
      { block: [66, 5, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { block: [74, 5, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { cut: [79, 0, 87, 0, 87, 26, 83, 19, 81, 12] },
      // The left tower.
      { block: [0, 26, 20, 89], m: "stone", finish: "ashlar", side: "left" },
      { block: [0, 23, 21, 3], m: "stone", lift: 0.4 },
      { block: [0, 17, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { block: [8, 17, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { block: [15, 17, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      // The parapet over the gate, broken in its middle.
      { block: [20, 26, 46, 4], m: "stone", lift: 0.35 },
      { block: [21, 20, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { block: [58, 20, 5, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { cut: [30, 18, 55, 18, 52, 31, 47, 27, 42, 33, 37, 28, 33, 30] },
      // The hall beyond the gate: dark, its floor rising in steps, a far window of violet fire.
      { gap: [29, 44, 28, 71], style: "arch" },
      { block: [30, 108, 26, 7], m: "stone", finish: "ashlar", lift: -0.9 },
      { block: [33, 102, 20, 6], m: "stone", finish: "ashlar", lift: -1.2 },
      { block: [36, 97, 14, 5], m: "stone", finish: "ashlar", lift: -1.5 },
      { gap: [41, 76, 4, 9], style: "arch", lit: true },
      { decor: "keep-portcullis", at: [29, 88] },
      // The ring of voussoirs, the keystone gone.
      {
        poly: [24, 115, 24, 70, 25, 60, 29, 51, 35, 44, 43, 39, 51, 44, 57, 51, 61, 60, 62, 70, 62, 115, 57, 115, 57, 70, 56, 62, 53, 55, 49, 50, 43, 46, 37, 50, 33, 55, 30, 62, 29, 70, 29, 115],
        m: "rock",
        finish: "rubble",
        lift: 0.2
      },
      // The hood over the arch, a drip of lighter stone.
      { poly: [22, 72, 22, 68, 23, 59, 27, 49, 34, 41, 43, 36, 52, 41, 59, 49, 63, 59, 64, 68, 64, 72, 62, 72, 62, 70, 61, 60, 57, 51, 51, 44, 43, 39, 35, 44, 29, 51, 25, 60, 24, 70, 24, 72], m: "rock", lift: 0.5 },
      { cut: [40, 36, 46, 36, 45, 45, 41, 45] },
      { decor: "keep-capital", at: [21, 72] },
      { decor: "keep-capital", at: [56, 72], flip: true },
      // Cracks run down from the fallen keystone and across the towers.
      { poly: [36, 33, 38, 33, 35, 42, 33, 42], m: "stone", lift: -1.6 },
      { poly: [58, 36, 60, 36, 63, 47, 61, 48], m: "stone", lift: -1.6 },
      { poly: [4, 60, 6, 60, 9, 71, 7, 72, 5, 66], m: "stone", lift: -1.6 },
      { poly: [72, 88, 74, 88, 71, 99, 69, 99], m: "stone", lift: -1.6 },
      // Arrow slits, and one window still lit high in the right tower.
      { gap: [9, 46, 2, 8], style: "slit" },
      { gap: [9, 80, 2, 8], style: "slit" },
      { gap: [75, 72, 2, 8], style: "slit" },
      { gap: [74, 24, 4, 7], style: "arch", lit: true, frame: "stone" },
      { decor: "keep-gargoyle", at: [16, 34] },
      { decor: "keep-banner", at: [70, 64] },
      // The stair up to the gate, and the stones that fell from it.
      { block: [4, 115, 78, 6], m: "stone", finish: "ashlar", lift: 0.1 },
      { block: [0, 121, 86, 7], m: "stone", finish: "ashlar", lift: 0.35 },
      { beam: [62, 125, 76, 126], width: 5, m: "stone", finish: "ashlar", lift: -0.1 },
      { poly: [76, 128, 78, 121, 85, 120, 86, 128], m: "stone", finish: "rubble", lift: 0.2 },
      { poly: [0, 128, 2, 122, 9, 123, 10, 128], m: "stone", finish: "rubble" }
    ]
  },
  // The side wall of the great hall, in the middle distance: buttresses, tall windows, its top gone.
  "keep-hall-wall": {
    w: 124,
    h: 66,
    fragile: 24,
    growth: 0.3,
    seed: 5112,
    pieces: [
      { block: [0, 14, 124, 52], m: "stone", finish: "ashlar" },
      { gap: [14, 22, 14, 34], style: "arch" },
      { gap: [54, 24, 14, 32], style: "arch" },
      { gap: [94, 22, 14, 34], style: "arch" },
      { block: [0, 6, 8, 60], m: "stone", finish: "ashlar", lift: 0.35 },
      { block: [40, 4, 8, 62], m: "stone", finish: "ashlar", lift: 0.35 },
      { block: [80, 8, 8, 58], m: "stone", finish: "ashlar", lift: 0.35 },
      { block: [116, 10, 8, 56], m: "stone", finish: "ashlar", lift: 0.35 },
      { block: [0, 60, 124, 6], m: "stone", finish: "ashlar", lift: -0.3 },
      { cut: [10, 0, 38, 0, 36, 16, 30, 12, 24, 20, 16, 13, 10, 16] },
      { cut: [50, 0, 76, 0, 74, 12, 68, 22, 62, 16, 56, 20, 50, 12] },
      { cut: [90, 0, 124, 0, 124, 10, 114, 18, 106, 12, 98, 21, 90, 14] }
    ]
  },
  // A row of the pillars of the hall, still standing to different heights.
  "keep-pillars": {
    w: 60,
    h: 60,
    fragile: 20,
    growth: 0.35,
    seed: 5113,
    pieces: [
      { block: [0, 54, 60, 6], m: "stone", finish: "ashlar", lift: 0.2 },
      { cyl: [3, 10, 9, 44], m: "stone", finish: "planks" },
      { block: [1, 6, 13, 4], m: "stone", lift: 0.35 },
      { cyl: [19, 20, 9, 34], m: "stone", finish: "planks" },
      { cut: [18, 18, 29, 18, 29, 24, 25, 22, 22, 25, 18, 22] },
      { cyl: [35, 4, 9, 50], m: "stone", finish: "planks" },
      { block: [33, 0, 13, 4], m: "stone", lift: 0.35 },
      { cyl: [51, 32, 9, 22], m: "stone", finish: "planks" },
      { cut: [50, 30, 61, 30, 61, 36, 57, 33, 54, 37, 50, 34] },
      { block: [0, 1, 46, 5], m: "stone", finish: "ashlar", lift: 0.15 },
      { cut: [14, 0, 33, 0, 33, 6, 28, 3, 22, 7, 16, 4] }
    ]
  },
  "keep-colonnade": {
    w: 78,
    h: 92,
    fragile: 34,
    growth: 0.35,
    seed: 5101,
    pieces: [
      { block: [0, 86, 78, 6], m: "stone", finish: "ashlar", lift: 0.3 },
      { block: [4, 81, 70, 5], m: "stone", finish: "ashlar" },
      { cyl: [6, 22, 11, 59], m: "stone", finish: "planks" },
      { block: [3, 16, 17, 6], m: "stone", finish: "ashlar", lift: 0.25 },
      { cyl: [34, 22, 11, 59], m: "stone", finish: "planks" },
      { block: [31, 16, 17, 6], m: "stone", finish: "ashlar", lift: 0.25 },
      { block: [0, 7, 52, 9], m: "stone", finish: "ashlar", lift: 0.1 },
      { block: [0, 5, 52, 2], m: "stone", lift: 0.5 },
      { cut: [40, 4, 53, 4, 53, 16, 47, 16, 49, 11, 44, 9] },
      // The third column broke where it stood; one of its drums lies at its foot.
      { cyl: [60, 46, 11, 35], m: "stone", finish: "planks" },
      { cut: [59, 44, 72, 44, 72, 52, 68, 49, 65, 54, 62, 50, 59, 53] },
      { beam: [49, 77, 70, 79], width: 8, m: "stone", finish: "ashlar" },
      { decor: "keep-banner", at: [20, 46] }
    ]
  },
  "keep-arch": {
    w: 48,
    h: 78,
    fragile: 28,
    growth: 0.5,
    seed: 5102,
    pieces: [
      { block: [2, 24, 9, 46], m: "stone", finish: "ashlar" },
      { block: [36, 24, 9, 46], m: "stone", finish: "ashlar", side: "right" },
      {
        poly: [2.0, 24.0, 2.7, 18.6, 4.8, 13.5, 8.2, 9.2, 12.5, 5.8, 17.6, 3.7, 23.0, 3.0, 28.4, 3.7, 33.5, 5.8, 37.8, 9.2, 41.2, 13.5, 43.3, 18.6, 44.0, 24.0, 36.0, 24.0, 35.6, 20.6, 34.3, 17.5, 32.2, 14.8, 29.5, 12.7, 26.4, 11.4, 23.0, 11.0, 19.6, 11.4, 16.5, 12.7, 13.8, 14.8, 11.7, 17.5, 10.4, 20.6, 10.0, 24.0],
        m: "stone",
        finish: "ashlar",
        lift: 0.15
      },
      // The keystone, and a crack where a voussoir fell.
      { block: [21, 1, 5, 10], m: "stone", lift: 0.35 },
      { cut: [33, 5, 40, 3, 44, 12, 38, 12] },
      // The stair up to the hall, worn in the middle.
      { block: [0, 70, 48, 8], m: "stone", finish: "ashlar", lift: 0.2 },
      { block: [4, 64, 40, 6], m: "stone", finish: "ashlar", lift: 0.05 },
      { block: [8, 58, 32, 6], m: "stone", finish: "ashlar", lift: -0.1 },
      { decor: "keep-sword", at: [30, 69] }
    ]
  },
  "keep-warden": {
    w: 21,
    h: 44,
    fragile: 6,
    growth: 0.4,
    seed: 5103,
    pieces: [
      { block: [1, 26, 19, 18], m: "stone", finish: "ashlar" },
      { block: [0, 23, 21, 3], m: "stone", lift: 0.4 },
      { block: [0, 40, 21, 4], m: "stone", finish: "ashlar", lift: -0.2 },
      { decor: "keep-statue", at: [3, 22] }
    ]
  },
  "keep-brazier": {
    w: 22,
    h: 48,
    fragile: 0,
    growth: 0.2,
    seed: 5104,
    pieces: [
      { block: [4, 43, 14, 5], m: "stone", finish: "ashlar", lift: 0.2 },
      { cyl: [7, 26, 8, 17], m: "stone", finish: "planks" },
      { block: [5, 24, 12, 3], m: "stone", lift: 0.3 },
      { poly: [0, 16, 22, 16, 17, 24, 5, 24], m: "metal" },
      { block: [0, 15, 22, 2], m: "metal", lift: 0.5 },
      { decor: "keep-flame", at: [6, 15], keep: true }
    ]
  },
  // Drums of a fallen column where they rolled, and its capital upside down.
  "keep-fallen": {
    w: 34,
    h: 12,
    fragile: 0,
    growth: 0.45,
    seed: 5107,
    pieces: [
      { beam: [3, 8, 13, 8], width: 7, m: "stone", finish: "ashlar" },
      { poly: [1, 5, 4, 5, 4, 12, 1, 12], m: "stone", lift: 0.35 },
      { beam: [16, 9, 24, 10], width: 6, m: "stone", finish: "ashlar", lift: -0.1 },
      { poly: [24, 12, 26, 5, 33, 5, 34, 12], m: "stone", finish: "ashlar", lift: 0.2 }
    ]
  },
  "keep-far-tower": {
    w: 22,
    h: 62,
    fragile: 20,
    growth: 0,
    seed: 5105,
    pieces: [
      { block: [3, 22, 16, 40], m: "stone" },
      { block: [1, 18, 20, 4], m: "stone" },
      { roof: [2, 0, 18, 18], m: "roof", style: "spire" },
      { gap: [9, 28, 3, 5], style: "arch", lit: true },
      { gap: [6, 44, 2, 3], style: "window", lit: true }
    ]
  },
  "keep-far-hall": {
    w: 46,
    h: 34,
    fragile: 12,
    growth: 0,
    seed: 5106,
    pieces: [
      { block: [0, 12, 46, 22], m: "stone" },
      { roof: [0, 0, 30, 12], m: "roof", style: "gable" },
      { block: [34, 2, 8, 10], m: "stone" },
      { gap: [6, 18, 3, 6], style: "arch", lit: true },
      { gap: [14, 18, 3, 6], style: "arch" },
      { gap: [22, 18, 3, 6], style: "arch", lit: true }
    ]
  }
};

export const KEEP_DECOR: Record<string, DecorGrid> = {
  // The portcullis, stuck half raised: iron bars, crossbars, the spikes of its foot.
  "keep-portcullis": {
    rows: [
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mMMMMMMMMMMMMMMMMMMMMMMMm",
      ".#M..mM..mM..Mm..mM..mM.#.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mMMMMMMMMMMMMMMMMMMMMMMMm",
      ".#M..mM..mM..Mm..mM..mM.#.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mMMMMMMMMMMMMMMMMMMMMMMMm",
      ".#M..mM..mM..Mm..mM..mM.#.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mMMMMMMMMMMMMMMMMMMMMMMMm",
      ".mM..mM..mM..Mm..mM..mM.m.",
      ".mM..mM..mM..Mm..mM..mM.m.",
      "..M...M...M...m...M...M...",
      "..M...M...M...m...M...M...",
      "..#...#...#...#...#...#..."
    ],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 2] }
  },
  // A carved capital where the arch springs: acanthus leaves worn smooth.
  "keep-capital": {
    rows: ["abbbbbbc", ".abbbbc.", "a.bcb.c.", ".abbcc..", "..abc..."],
    legend: { a: ["stone", 4], b: ["stone", 3], c: ["stone", 1] }
  },
  // A gargoyle leaning out of the tower, its mouth open on nothing.
  "keep-gargoyle": {
    rows: ["..##....", ".#ab#...", "#abbb##.", "#abbbbb#", ".#bcc#c#", "..#c#.#.", "...#...."],
    legend: { "#": "outline", a: ["stone", 4], b: ["stone", 3], c: ["stone", 1] }
  },
  // A banner with no colors left: grey cloth in tatters, stirring.
  "keep-banner": {
    rows: [
      "#mmmmmmmmmm#",
      ".kkkkkkkkkk.",
      ".kKkkkkkkKk.",
      ".kKkkKKkkKk.",
      ".kkkKkkKkkk.",
      ".kKkKkkKkKk.",
      ".kKkkKKkkKk.",
      ".kkkkkkkkkk.",
      ".kKkkkkkkKk.",
      ".kkKkkkkKkk.",
      ".kkkKkkKkkk.",
      ".kKkkKKkkKk.",
      ".kkkkkkkkkk.",
      ".kKk.kkKkKk.",
      ".kkk..kKkkk.",
      ".kK...kkkk..",
      ".kk....kkK..",
      "..K....kk...",
      "..k.....K...",
      "........k..."
    ],
    legend: { "#": "outline", m: ["metal", 2], k: ["cloth", 2], K: ["cloth", 1] },
    frames: [
      [],
      [{ x: 1, y: 13, rows: ["kKkk.kKkKk", "kkkk..kKkk", ".kK...kkkk", ".kk....kK.", "..K...kk..", "..k....K..", ".......k.."] }],
      [],
      [{ x: 1, y: 13, rows: ["kKk.kkKkKk", "kk..kkKkk.", "kK..kkkk..", "kk...kkK..", ".K...kk...", ".k....K...", "......k..."] }]
    ]
  },
  // Violet fire in a brazier: a flame that nobody feeds and that never goes out.
  "keep-flame": {
    rows: ["....*....", "...**....", "...*.*...", "..**.**..", "..*c**.*.", ".**cc**..", ".*ccc*.*.", "**cccc**.", "*cccccc**", ".*cccc**."],
    legend: { "*": "glow", c: "core" },
    frames: [
      [],
      [{ x: 0, y: 0, rows: [".....*...", "....**...", "...*.**..", "..**..*..", ".**c**...", "..*cc**.."] }],
      [{ x: 0, y: 0, rows: ["...*.....", "..**.....", "..*.*.*..", ".**.**...", "..*c***..", ".**cc**.."] }],
      [{ x: 0, y: 0, rows: [".........", "....*....", "...**.*..", "..*.**...", "..*c**...", ".**cc**.."] }]
    ]
  },
  // A stone warden on guard, both hands on the crossguard of his sword; his head is gone.
  "keep-statue": {
    rows: [
      "......ddd......",
      "...aabbbbbccd..",
      "..aabbbbbbbccd.",
      ".aab.abbbbc.ccd",
      ".ab..abbbbc..cd",
      ".ab..abbbbc..cd",
      ".ab..abbbbc..cd",
      "..b..aMMMMc..d.",
      "..aa.bbmbbc.cd.",
      ".....abmbbc....",
      "....aabmbbcc...",
      "....abbmbbbc...",
      "...aabbmbbbcc..",
      "...abbbmbbbbc..",
      "...abbbmbbbbc..",
      "...abb.m.bbbc..",
      "...abb.m..bbc..",
      "...abb.m..bbc..",
      "..aabb.m..bbcc.",
      "..abbb.M..bbbc."
    ],
    legend: { a: ["rock", 3], b: ["rock", 2], c: ["rock", 1], d: ["rock", 0], m: ["metal", 2], M: ["metal", 3] }
  },
  // A sword driven into the stair, its blade to the hilt in the stone.
  "keep-sword": {
    rows: ["..m..", "#mMm#", "..m..", "..M..", "..m..", "..M..", "..m.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 3] }
  }
};
