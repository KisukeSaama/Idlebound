import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Hearthfields (BIBLE 7.1): the mill, the farmhouse and the scarecrow are drawn by hand
 * in the generator; here stands Brom's forge at the crossroads, its fire banked but alive,
 * a hammer left on the anvil, unfinished; and far behind, in the mist, the barn and the
 * chapel of the fields.
 */
export const HEARTHFIELDS_STRUCTURES: Record<string, StructureRecipe> = {
  "brom-forge": {
    w: 100,
    h: 94,
    fragile: 40,
    growth: 0.3,
    seed: 1101,
    pieces: [
      // The lean-to over the anvil, on two posts.
      { beam: [6, 94, 6, 50], width: 3, m: "wood" },
      { beam: [30, 94, 30, 46], width: 3, m: "wood" },
      { beam: [2, 50, 36, 43], width: 3, m: "wood" },
      { poly: [0, 50, 36, 38, 38, 44, 2, 55], m: "roof", finish: "thatch", lift: 0.3 },
      // The smithy: rubble walls, the side turned away in shade, a thatched gable.
      { block: [32, 46, 50, 48], m: "stone", finish: "rubble" },
      { block: [82, 50, 14, 44], m: "stone", finish: "rubble", side: "right" },
      { block: [32, 88, 64, 6], m: "stone", finish: "ashlar", lift: -0.4 },
      { roof: [24, 16, 76, 32], m: "roof", style: "gable", finish: "thatch" },
      { beam: [24, 48, 100, 48], width: 2, m: "wood", lift: -0.3 },
      // The chimney, dressed stone, its cap a course wider, embers above it.
      { block: [66, 2, 11, 34], m: "stone", finish: "ashlar" },
      { block: [64, 2, 15, 3], m: "stone", lift: 0.4 },
      { decor: "chimney-embers", at: [68, 1] },
      // The forge's mouth: a wide arch, the hearth burning deep inside, tools on the wall.
      { gap: [38, 60, 28, 34], style: "arch", frame: "stone" },
      { decor: "hearth-light", at: [39, 93] },
      { decor: "forge-fire", at: [41, 92] },
      { decor: "bellows", at: [58, 92] },
      { decor: "tools", at: [44, 74] },
      { gap: [70, 62, 8, 9], style: "window", lit: true, frame: "wood" },
      // The sign of the forge on its bracket, and the crossroads' post.
      { beam: [32, 54, 20, 54], width: 2, m: "metal" },
      { decor: "forge-sign", at: [17, 66] },
      { decor: "anvil", at: [9, 93], keep: true },
      { decor: "barrel", at: [22, 93], keep: true },
      { decor: "grindstone", at: [12, 84] },
      { decor: "logs", at: [83, 93] },
      { beam: [97, 94, 97, 58], width: 2, m: "wood" },
      { decor: "signboards", at: [89, 66] }
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
    rows: [
      "..#ssssssssss#..",
      "..#s..*...*.s#..",
      "..#s.**..**.s#..",
      "..#s.*c*.*c*s#..",
      "..#s**cc**cc*s#.",
      "#ssss*cccccc*ssss#",
      "#s***cccccccc***s#",
      "#s**************s#",
      "#ssssssssssssssss#"
    ],
    legend: { "*": "glow", c: "core", "#": "outline", s: ["stone", 1] },
    frames: [
      [],
      [{ x: 5, y: 1, rows: [".*...*..", "**..***."] }],
      [{ x: 5, y: 2, rows: ["*c*.*c*", "cc**cc*"] }],
      [{ x: 5, y: 1, rows: ["*....*.", ".**.**."] }]
    ]
  },
  // The fire's light on the floor of the smithy, thinning out in a regular checker.
  "hearth-light": {
    rows: ["*.*.*.*.*.*.*.*.*.*.*.*.", ".*.*.*.*.*.*.*.*.*.*.*.*", "*...*...*...*...*...*..."],
    legend: { "*": "glow" }
  },
  // A grindstone under the lean-to, on its frame.
  grindstone: {
    rows: ["..sss..", ".sSsSs.", "sSs#sSs", ".sSsSs.", "..sss..", ".w...w.", "ww...ww"],
    legend: { s: ["stone", 3], S: ["stone", 2], "#": "outline", w: ["wood", 1] }
  },
  // The bellows beside the hearth, leather between two boards.
  bellows: {
    rows: ["..www..", ".wkkkw.", "wkKkKkw", ".wkkkw.", "..w.w.."],
    legend: { w: ["wood", 1], k: ["roof", 1], K: ["roof", 0] }
  },
  // Tongs and hammers hung on a rail, the last one missing.
  tools: {
    rows: ["wwwwwwwwwwww", ".m..m...mm..", ".m..m...m...", "m.m.mm..m...", "m.m.mm..m...", "..........."],
    legend: { w: ["wood", 1], m: ["metal", 2] }
  },
  // The anvil by the door, the hammer on it: Brom never finished what he was making.
  anvil: {
    rows: ["....mM...", "...#hh#..", "mmmmmmmmm", "#MMmmmMM#", "...Mmm...", "..MMMMM.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 1], h: ["wood", 2] }
  },
  // The quenching barrel, hooped, full to the brim.
  barrel: {
    rows: [".mmmmm.", "#lllll#", "wWwWwWw", "mmmmmmm", "wWwWwWw", "wWwWwWw", "mmmmmmm", ".wWwWw."],
    legend: { "#": "outline", m: ["metal", 1], l: ["metal", 3], w: ["wood", 2], W: ["wood", 1] }
  },
  // Firewood stacked against the wall, the cut ends showing their rings.
  logs: {
    rows: ["..OoO.OoO..", ".OwwO.OwwO.", "OoO.OoO.OoO", "OwwOOwwOOwwO", "OoO.OoO.OoO"],
    legend: { O: ["wood", 1], o: ["wood", 2], w: ["roof", 2] }
  },
  // The forge's sign: a hammer on a board, hanging from two chains.
  "forge-sign": {
    rows: ["#.....#", "#.....#", "wwwwwww", "wmmmmmw", "wwwmwww", "wwwmwww", "wwwmwww", "wwwwwww"],
    legend: { "#": "outline", w: ["wood", 2], m: ["metal", 3] },
    frames: [[], [], [{ x: 0, y: 0, rows: [".#.....#"] }], []]
  },
  // The crossroads' post: three boards pointing three ways.
  signboards: {
    rows: ["wwwwwww..", "wwwwwwwW.", "..wwwwwww", ".Wwwwwwww", "wwwwww...", "wwwwwwW.."],
    legend: { w: ["wood", 2], W: ["wood", 1] }
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
