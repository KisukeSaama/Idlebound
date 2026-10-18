import type { DecorGrid, StructurePiece, StructureRecipe } from "../architecture";

/**
 * The places of the story (BIBLE 3.4, 12.7): the Sanctum of Dusk, a circle of standing
 * stones on a hill that does not exist during the night, and the thirteen altars raised
 * among them, each by a walker, from their own memories, so no two alike: a plinth, a
 * stele, a cairn, a table, a basin, a sigil of violet light cut into each face. Then
 * Eldra's Loom: its great frame, its beams, and the little bench she sits on.
 */

/** The body of an altar: how the walker who raised it built it. */
type AltarBody = "plinth" | "stele" | "cairn" | "table" | "basin" | "chest";

/** An altar: its body in stone, its sigil lit on the face. */
function altar(body: AltarBody, sigil: string, seed: number): StructureRecipe {
  const shapes: Record<AltarBody, { w: number; h: number; pieces: StructurePiece[]; at: [number, number] }> = {
    plinth: {
      w: 14,
      h: 13,
      pieces: [
        { block: [2, 4, 10, 9], m: "stone", finish: "ashlar" },
        { block: [0, 1, 14, 3], m: "stone", finish: "ashlar", lift: 0.4 }
      ],
      at: [5, 10]
    },
    stele: {
      w: 12,
      h: 18,
      pieces: [{ poly: [1, 18, 1, 4, 4, 0, 8, 0, 11, 4, 11, 18], m: "stone", finish: "rock" }],
      at: [4, 10]
    },
    cairn: {
      w: 14,
      h: 13,
      pieces: [
        { poly: [0, 13, 1, 9, 4, 7, 10, 7, 13, 9, 14, 13], m: "rock", finish: "rock" },
        { poly: [2, 8, 3, 4, 7, 2, 11, 4, 12, 8], m: "rock", finish: "rock", lift: 0.3 },
        { poly: [5, 3, 6, 0, 9, 0, 10, 3], m: "rock", finish: "rock", lift: 0.5 }
      ],
      at: [5, 11]
    },
    table: {
      w: 18,
      h: 11,
      pieces: [
        { block: [2, 4, 4, 7], m: "stone", finish: "rock" },
        { block: [12, 4, 4, 7], m: "stone", finish: "rock" },
        { block: [0, 0, 18, 4], m: "stone", finish: "ashlar", lift: 0.4 }
      ],
      at: [7, 10]
    },
    basin: {
      w: 16,
      h: 12,
      pieces: [
        { block: [5, 5, 6, 7], m: "stone", finish: "ashlar" },
        { poly: [0, 0, 16, 0, 13, 5, 3, 5], m: "stone", finish: "rock", lift: 0.4 }
      ],
      at: [6, 11]
    },
    chest: {
      w: 16,
      h: 11,
      pieces: [
        { block: [1, 3, 14, 8], m: "stone", finish: "ashlar" },
        { poly: [1, 3, 3, 0, 13, 0, 15, 3], m: "stone", finish: "rock", lift: 0.4 }
      ],
      at: [6, 9]
    }
  };
  const { w, h, pieces, at } = shapes[body];
  return { w, h, fragile: 0, growth: 0.3, seed, pieces: [...pieces, { decor: sigil, at, keep: true }] };
}

/** A standing stone: a slab of raw rock, taller than a man, weathered at the top. */
function menhir(w: number, h: number, lean: number, seed: number): StructureRecipe {
  const top = Math.round(w * 0.55) + lean;
  return {
    w,
    h,
    fragile: 0,
    growth: 0.5,
    seed,
    pieces: [{ poly: [1, h, 1 + Math.max(0, lean), Math.round(h * 0.22), top - 3, 0, top + 1, 1, w - 1 + Math.min(0, lean), Math.round(h * 0.18), w - 1, h], m: "rock", finish: "rock" }]
  };
}

export const SANCTUM_STRUCTURES: Record<string, StructureRecipe> = {
  "sanctum-menhir": {
    w: 14,
    h: 40,
    fragile: 0,
    growth: 0.5,
    seed: 3101,
    pieces: [
      { decor: "sanctum-menhir-painted", at: [0, 39] }
    ]
  },
  "sanctum-menhir-tall": {
    w: 18,
    h: 58,
    fragile: 0,
    growth: 0.5,
    seed: 3102,
    pieces: [
      { decor: "sanctum-menhir-tall-painted", at: [0, 57] }
    ]
  },
  "sanctum-menhir-great": {
    w: 24,
    h: 84,
    fragile: 0,
    growth: 0.5,
    seed: 3103,
    pieces: [
      { decor: "sanctum-menhir-great-painted", at: [0, 83] }
    ]
  },
  "sanctum-menhir-low": menhir(12, 24, 0, 3104),
  // The far side of the ring, small with distance.
  "sanctum-far-menhir": {
    w: 7,
    h: 17,
    fragile: 0,
    growth: 0.5,
    seed: 3107,
    pieces: [
      { decor: "sanctum-far-menhir-painted", at: [0, 16] }
    ]
  },
  "sanctum-far-low": {
    w: 6,
    h: 11,
    fragile: 0,
    growth: 0.5,
    seed: 3108,
    pieces: [
      { decor: "sanctum-far-low-painted", at: [0, 10] }
    ]
  },
  "sanctum-far-trilithon": {
    w: 19,
    h: 17,
    fragile: 0,
    growth: 0.2,
    seed: 3109,
    pieces: [
      { decor: "sanctum-far-trilithon-painted", at: [0, 16] }
    ]
  },
  // Two uprights and the lintel laid across them.
  "sanctum-trilithon": {
    w: 36,
    h: 40,
    fragile: 0,
    growth: 0.5,
    seed: 3105,
    pieces: [
      { poly: [2, 40, 3, 9, 11, 8, 12, 40], m: "rock", finish: "rock" },
      { poly: [24, 40, 25, 8, 33, 9, 34, 40], m: "rock", finish: "rock", side: "right" },
      { poly: [0, 3, 2, 0, 34, 1, 36, 4, 35, 9, 1, 9], m: "rock", finish: "rock", lift: 0.35 }
    ]
  },
  // A standing stone broken off, its top lying at its foot.
  "sanctum-broken": {
    w: 26,
    h: 26,
    fragile: 0,
    growth: 0.7,
    seed: 3106,
    pieces: [
      { decor: "sanctum-broken-painted", at: [0, 25] }
    ]
  },
  // The thirteen altars (BIBLE 6.4), in the order of the Ledger.
  "altar-might": {
    w: 14,
    h: 13,
    fragile: 0,
    growth: 0.3,
    seed: 3111,
    pieces: [
      { decor: "altar-might-painted", at: [0, 12] },
      { decor: "sigil-might", at: [5, 10], keep: true }
    ]
  },
  "altar-blade": {
    w: 12,
    h: 18,
    fragile: 0,
    growth: 0.3,
    seed: 3112,
    pieces: [
      { decor: "altar-blade-painted", at: [0, 17] },
      { decor: "sigil-blade", at: [4, 10], keep: true }
    ]
  },
  "altar-fortune": {
    w: 14,
    h: 13,
    fragile: 0,
    growth: 0.3,
    seed: 3113,
    pieces: [
      { decor: "altar-fortune-painted", at: [0, 12] },
      { decor: "sigil-fortune", at: [5, 11], keep: true }
    ]
  },
  "altar-patience": {
    w: 12,
    h: 18,
    fragile: 0,
    growth: 0.3,
    seed: 3114,
    pieces: [
      { decor: "altar-patience-painted", at: [0, 17] },
      { decor: "sigil-patience", at: [4, 10], keep: true }
    ]
  },
  "altar-time": {
    w: 16,
    h: 12,
    fragile: 0,
    growth: 0.3,
    seed: 3115,
    pieces: [
      { decor: "altar-time-painted", at: [0, 11] },
      { decor: "sigil-time", at: [6, 11], keep: true }
    ]
  },
  "altar-fate": {
    w: 18,
    h: 11,
    fragile: 0,
    growth: 0.3,
    seed: 3116,
    pieces: [
      { decor: "altar-fate-painted", at: [0, 10] },
      { decor: "sigil-fate", at: [7, 10], keep: true }
    ]
  },
  "altar-precision": {
    w: 12,
    h: 18,
    fragile: 0,
    growth: 0.3,
    seed: 3117,
    pieces: [
      { decor: "altar-precision-painted", at: [0, 17] },
      { decor: "sigil-precision", at: [4, 10], keep: true }
    ]
  },
  "altar-treasure": {
    w: 16,
    h: 11,
    fragile: 0,
    growth: 0.3,
    seed: 3118,
    pieces: [
      { decor: "altar-treasure-painted", at: [0, 10] },
      { decor: "sigil-treasure", at: [6, 9], keep: true }
    ]
  },
  "altar-bargain": {
    w: 18,
    h: 11,
    fragile: 0,
    growth: 0.3,
    seed: 3119,
    pieces: [
      { decor: "altar-bargain-painted", at: [0, 10] },
      { decor: "sigil-bargain", at: [7, 10], keep: true }
    ]
  },
  "altar-echoes": {
    w: 16,
    h: 12,
    fragile: 0,
    growth: 0.3,
    seed: 3120,
    pieces: [
      { decor: "altar-echoes-painted", at: [0, 11] },
      { decor: "sigil-echoes", at: [6, 11], keep: true }
    ]
  },
  "altar-harvest": {
    w: 14,
    h: 13,
    fragile: 0,
    growth: 0.3,
    seed: 3121,
    pieces: [
      { decor: "altar-harvest-painted", at: [0, 12] },
      { decor: "sigil-harvest", at: [5, 10], keep: true }
    ]
  },
  "altar-wanderer": {
    w: 14,
    h: 13,
    fragile: 0,
    growth: 0.3,
    seed: 3122,
    pieces: [
      { decor: "altar-wanderer-painted", at: [1, 12] },
      { decor: "sigil-wanderer", at: [5, 11], keep: true }
    ]
  },
  "altar-memory": {
    w: 16,
    h: 11,
    fragile: 0,
    growth: 0.3,
    seed: 3123,
    pieces: [
      { decor: "altar-memory-painted", at: [0, 10] },
      { decor: "sigil-memory", at: [6, 9], keep: true }
    ]
  },
  // Eldra's Loom: two uprights out of sight, the cloth beam at the top, the warp beam at the foot.
  "loom-frame": {
    w: 300,
    h: 176,
    fragile: 0,
    growth: 0.15,
    seed: 3131,
    pieces: [
      { decor: "loom-frame-painted", at: [0, 175] }
    ]
  },
  // Her bench, a ball of thread and the shuttle left on it.
  "loom-bench": {
    w: 34,
    h: 16,
    fragile: 0,
    growth: 0,
    seed: 3132,
    pieces: [
      { decor: "loom-bench-painted", at: [0, 15] },
      { decor: "thread-ball", at: [5, 3] },
      { decor: "shuttle", at: [18, 3] }
    ]
  }
};

const SIGIL = { "*": "glow", c: "core" } as const;

export const SANCTUM_DECOR: Record<string, DecorGrid> = {
  // loom-bench, painted then traced.
  "loom-bench-painted": {
    rows: [
      ".....bbbbb",
      "....ababbbb.......bbbbbbbbb",
      "....ababaab......aabbbbbbbbb",
      "aaaaaaabbbaaabbbaaabbbaaabbccaaaaa",
      "aaaaaabbbbaadcbbaaadccbbabdccaaaaa",
      "aaaaaabbbbaddccbaaadccbdbbdccaaaaa",
      "aaaaaabbababdccbaaadccbdbbdccaaaaa",
      "aaaaaaaaabbbbccbaaadccbbbbbc*aaaaa",
      ".aaaaa......................*aaaa",
      ".aaabb......................b**ca",
      ".aadbbbbbbbbbbbbbbaaabbbbbbbbddca",
      "aaadaaaaaaaaaaaaaaaaaabbbabaaacaaa",
      "aaaabbaaaaaaaaaaaaaaabbbbaaaaaccaa",
      "aaabb.aaaaaaaaaaaaaaaaaaaaaa.bccca",
      "adbbb........................bddcc",
      ".ddd..........................daa"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 3], d: ["wood", 2], "*": "glow" }
  },
  // loom-frame, painted then traced.
  "loom-frame-painted": {
    rows: [
      ".......cbbbbbbbbbbbbbaa..............................................................................................................................................................................................................................................................cccbbbbbbbbaaddd",
      "......ccccbcaaaaaaaaaaadb...........................................................................................................................................................................................................................................................ccccbaabaabbadd**d",
      ".....ccbccccbbbbcbbbabdddd.........................................................................................................................................................................................................................................................cccccbabbbabbbbad**d",
      ".....ccbccbcbbbbcbbaabdddc..................................................................................................................................................................................................................................................a.....ccccccbabbabbbbaad*dd",
      "..cccccbbbbbbbbbcbbabbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaaacccccccccccccccccccbbccacccccccccdddaaaaaaaaaaaaadaaaaaaaaabaabbaaddddddd",
      "ccaaaaaaaaaabaaaabaaaaaaaaddabbdddddddaaadddddbbbbcbbaaaaaaccdddaaddddddccddddddddddbbacccaddddddddddddcaaaadaaadddccddddddddddbbbdddccccccdddddddddddddccccbbbbccaaddddddaaddddddddddddddabbddddddddbbaaaaddddddddddddddccaaaddaabadddddddddddddaaaaaaaaaaaaacccdddddddddddddddddadaaaaaaaabbbbbbaaadddd*dd",
      "ccaabbaabbaababbbbbaaaaaabaaaaaaaaaaaaaaaaaaaaaabbbaabbbaabbbbbbbbabbbbbccaaaaaaaaabbbabbcaaaaaaaaaaaaaabbaadaaaaaaccbbbbbdbbbbbbbbbbcccaabbbbbbbbbbbaadccccbbbbbbbbbbbbbbbbbbbbbbadabbbbbabaaaaaaaaaaaaaaaaaaaaaaaaaababbcbbbaabbbaaaaaaaaddaadaaadddddaaaabbcccbaaaabaaaaddaaaaaaaaabbbaabbbbbbbbbbbbbbd*d",
      "ccaaaabbbbbabaaaaaaaaaaaabaaaabaaaaaaaaaaaaaaaaaaaaaaaabbaaaabbbadaaaaaaaaaaaaaaaaaabbbbbcbaaaaabaaaaaaaaaaaaaaaaaaaaaaaaabbbaaaaaabaaaaaaaaaabbbbbaaaaaaaaaaaaaaabbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaababaaaaaaaaaaaaaabaaabbbbabbbbbbbbbbbbbbbbbbbbbaaaaaabbaabbbbbbaabbbbbaaaaaabaaabbbbabbbbbbbbaaaaaabd*d",
      "ccaabbbbbcbbbbbbbbbbbbabbbbbbbbaaabbbaaaaaaabbbbaaaaaaaaaaaaaaaaaddaaaaaaaaaaaaaaabbbbbbacbaaaabbbbaabaaaaaababbbaaaaaabbbbbbbbbbbbbabaababbbbbbbaabbbaabbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaabbaaabaaabbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbaaaaabbbbbbbbbbbbbbbbbcaaaaaabbabbbbbbbbbbbbbbbbbbbbbd*d",
      "ccccccccccccccccccccccccccccccccccccbbaabbbbbbccccccbcccccccccccccbcccccccccccccccccccccaccccbbccbbbabbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbabbbbbbbbccbbbbbbabbbbbbbbbbbbbbbbbcccccccccccccccabbbccccccccccccccccccbabccccccccccccccccccccccccbbbd*d",
      "ccccccccccccbbbbbaaaaaaabbbcbbbbbbbbbbcbbbbbbccccccbabbbbcccccccccbbccccccccccccccccccccbbcccccbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccccccccccccccccccccccccccccccbbbbbccccccccccccccccbbbbbbcccccccccccccccccbbbccbbbbadd",
      "ccccccccbbbbbbbbbaaaaaaabcccccbbbbbccccbbbbbbbbbbbbbaaccccccbbbbccccbbbbbbcccccbbbbbbbbccbcccccbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbcccccaabbbcccccbbbbbbbbbbbbbbbbbaabbbbbbbbbbbbbbbbbbaaabbbccccccbbccccccccccabbbbbbbbbbbbbbbbbbbbbbbbbbccbbccccbbbbba*d",
      "ccccccccbbbbbbbbbbbbbbbbcccccccbbbcccccbbbbbbbbbbbbbbaccccccbbbccccccbbbbcccccccbbbbbbcccbcccccbbbccccccccbcccbbbbbbbbbbbbbbbbbbbbccccccccbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbbbbcccccbbbbbccccccbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbabbbbccccccbbbccccccccccaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdod",
      "bcbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaabaaabbbbbbbbbbbbbbbbbaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbccccccccbbbbbbbbbbcccccbbbbbbbbbbbbbaaabbbbbbbbbbbbbbbbbbccbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdod",
      "bcbbcbbcbccbbbbbbbbbbbbbccccccbcbbcbbcbbbbbbbbbbbbbbbbbcbccbbbcbbbcccccbbbbbbbbbbbbbbbbbccccbbbcbbbbbbbbbbbbbbbbbbbbbbbcbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbaabbbbcbbbcccccbcbbbccccccccbccbbccccccccccccccbbcbbbccccbbcccccccccccccccbbbcccccccccccccccbccccccccccccccccccccccccccbbbbbbbbbdod",
      "bcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbccccccccccccccccccccccccccccccccccccccccccccccccbbaad*d",
      ".ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccbaad*d",
      "..bbccccccccbbcccccccccccccccccccccccccccbbbbbbbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbccccccccccccccccccccccbbcccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccbbbbddddd*",
      "....ccccccccbbbccccccccccccccccccccccccccbbbbbbbbcccccccccccccccccccccccccccccccccccbbccccbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccbbbcccbbbccbbbbbbbbbbbbbbcccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbcbbccccccccccccccccccccccccccccbbbbbaabbaaaaaabbbbbbbbccccccccccccccccccccccccbbbbddddd",
      "......ccccccbbbbcccbccccccccccbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbaaccccccccccccccccbbbbbbbbcbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbccbccbaaaaaabbbbbbbbbbaaaaaaaaaaaaaaaaabaaabaaaaaaaaaabbbbbcccccccccccccbbcccbbbbbbbbbbbbaaaaaaaddaaaaaaaabbbcbbbbbbbbccccccccbbbcbbbbbbaddd",
      "......ccccccbbbbbbcbccccccccc.............................................................................................................................................................................................................................ddd....................ccccccccbbbcbbbbbbaddd",
      "......cbbcccbbbbcbcbccccccccc....................................................................................................................................................................................................................................................dcccccccbabcbbbbbba*dd",
      "......cbbbccbbbbcbcbbccccccbc....................................................................................................................................................................................................................................................dcccccccbabbbbbbbba*dd",
      "......cbbbccbbbbcbcbbbcccccbc.....................................................................................................................................................................................................................................................cccccccbabbbbbbdba*dd",
      "......cbbbccaabbcbbbbbcccccbc.....................................................................................................................................................................................................................................................cbcccccbabbbbbbdba**d",
      "......cbbbccabbbcbbbabcccccbc.....................................................................................................................................................................................................................................................cbcccccbabbbbbbdba**d",
      "......cbcbccabbbcbbbaccbcccbc.....................................................................................................................................................................................................................................................cbccbccbabbabbbdba**d",
      "......cbccccbbbbcbbbabbbbccbc.....................................................................................................................................................................................................................................................cbccbccbbbbabbbdba**d",
      "......cbccccbbbbcbbbaabbbcbbc.....................................................................................................................................................................................................................................................cbccbccbbbbabbadaa**d",
      "......cbccccbbbbcbbbaabbccbbc....................................................................................................................................................................................................................................................ccbccbccbbbbbbbadaa**d",
      "......cbccccbbbbcbbbaabbccbbc.....................................................................................................................................................................................................................................................cbccbccbdbbbbbadbaddd",
      "......cbcbccbbbababbabbbbcbdc.....................................................................................................................................................................................................................................................cbccbccadbbbbbadbaddd",
      "......cbbbccbbbababbbbaabbddc.....................................................................................................................................................................................................................................................cbccbccaabbbbbadbaddd",
      "......cbbbccbbbababbbbadbaddc.....................................................................................................................................................................................................................................................cbccbcbbbbbbbbadaa**d",
      "......cbbbccbbbababbbbadbaddc.....................................................................................................................................................................................................................................................cbccbcbbbbbbbbadaa**d",
      "......cbbbccbbbababbbaddbaddc....................................................................................................................................................................................................................................................dbbcbbcbbbbbbbbadaaddd",
      "......cbbbccbbbababbaaddddddc....................................................................................................................................................................................................................................................dbbcbbcbbbbbbbbbdaaddd",
      "......cbbbbcbbbababbaaddddddb....................................................................................................................................................................................................................................................dcbcbbcbbbbbbbbbdda**d",
      "......ccbbccbbbababbaaddddddb....................................................................................................................................................................................................................................................dcbcbbcbbbbbbbbbdaa**d",
      "......ccbbccbbbababbaaadddddb....................................................................................................................................................................................................................................................dcbcbbcbbbbcbbbbbaa**d",
      "......ccbbccbbbababbaaddddddb....................................................................................................................................................................................................................................................acbcbbcbbbacbbbbaad**d",
      "......ccbbccbbbababbaadddaddd....................................................................................................................................................................................................................................................acbcbbcbaaacbbbbaadddd",
      "......cccbccbbbababbaadddaddd.....................................................................................................................................................................................................................................................cbcabcbadacbbbbaad**d",
      "......ccccccbbbaaabbaadddaddd....................................................................................................................................................................................................................................................ccbcabcbddbbbbbbbbd**d",
      "......cccbccabbaaabbaaddddddb.....................................................................................................................................................................................................................................................cbcabcbaabbbbaaabd**d",
      "......cccbccabbabbbbaaddddddb.....................................................................................................................................................................................................................................................cbcbbcbbabbbbbbabd**d",
      "......ccccccabbabbbbabddddddb.....................................................................................................................................................................................................................................................cbcbbcbbabbbbababa**d",
      "......cccbccabbabbbbabddddddb.....................................................................................................................................................................................................................................................cbcbbcbbbbbbbabdbaddd",
      "......cccbccabbabbcbbbddddddb.....................................................................................................................................................................................................................................................cbcabcbdabbbbbbdbaadd",
      "......cccbccabbabbcbbbadddddb....................................................................................................................................................................................................................................................ccbcabcbdabbbbbbdbaddd",
      "......cccbccabbababbbbadddddb.....................................................................................................................................................................................................................................................cbcabcbdabbbbbbdbad*d",
      "......cbcbcccbbbbabbbbadddddd....................................................................................................................................................................................................................................................ccbcabcbbabbbbbbabad*d",
      "......cbcbccbbbbbabbbbadddaaab...................................................................................................................................................................................................................................................ccbcabcbbabbbbbbabad*d",
      "......cbcbccbbbbbbbbbbaddbaaab...................................................................................................................................................................................................................................................ccccabcbaabbbbbbabad*d",
      "......cbcbccbbbbbbbbbbadbbaadbb.................................................................................................................................................................................................................................................cbbccbbccaababbbbabad*d",
      "......cbcbccaabbbbbbbbaaaaaaddb................................................................................................................................................................................................................................................acbbbbccccabbabbbbabaddd",
      "......cbcbccabbbbbbbbbbaaaaaddb................................................................................................................................................................................................................................................acbaabbcccabbabbbbabaddd",
      "......cbbbccabbbbbbbbbbaadadddb................................................................................................................................................................................................................................................ccbaabbcccbaaabbbbdaad*d",
      "......cbbbccabbabbbbbcaaddaddd..................................................................................................................................................................................................................................................bbaabbbccbababbbbdaaddd",
      "......cbcbcbabbabbbbccaaddaddd...................................................................................................................................................................................................................................................bbbaabccbbbbbbbbdbad*d",
      "......cbcbcbabbbbbbbcaadddaddb...................................................................................................................................................................................................................................................bbbaabccbbbbbbbbdbaddd",
      "......cbbbccaababcbccaaddddbb....................................................................................................................................................................................................................................................dcbbaabcbbbbbbbbdbad*d",
      "......cbbbccaaaabcbcaaddddaab....................................................................................................................................................................................................................................................dcbbaabcbbcbbbbbdbaddd",
      "......cbbbbcabaabccaaaadddddc.....................................................................................................................................................................................................................................................cbbbabbcccbbbbbdbaddd",
      "......cbbbbcabbabccaaaaddbddc....................................................................................................................................................................................................................................................dccbbbabbccbbbbbbbaddd",
      "......cbbbbcabbbbcbaaaadddddc....................................................................................................................................................................................................................................................dcccbbabbccbbbbbbbaddd",
      "......cbbbbcabbbbbbaaaaaadddc....................................................................................................................................................................................................................................................dcccbbbabbcbbbbbbbaddd",
      "......cbbbbcbbbbbcaaaaaaadddc.....................................................................................................................................................................................................................................................ccccbbaabcbbbbbbba*dd",
      "......cbbcccbbbbccaaadbdddddc.....................................................................................................................................................................................................................................................ccccbbbabbcbbbbdbaddd",
      "......cbbbccbbbbcbbaadbdadddc.....................................................................................................................................................................................................................................................cbcccbbaaacbbbbdba*dd",
      "......cbbcccbbbbcbbaaaadaaddc.....................................................................................................................................................................................................................................................cbccccbddacbbbadba*dd",
      "......cbbbccbbbbbbbaaaadaaddc.....................................................................................................................................................................................................................................................cbccccbaaaacbbadba*dd",
      "......cbbbccbbbbbbbaaaadaaddc.....................................................................................................................................................................................................................................................cbccccbbbaacbbadaa*dd",
      "......cbbbccbbbbbbbaabadaaddc.....................................................................................................................................................................................................................................................cbccccbbbdaabbadaa*dd",
      "......cbbbccbbbbbbbbabadaaddc.....................................................................................................................................................................................................................................................cbcccccbbdaaacadaa*dd",
      "......cbbbccbbbbbbbbbbaddaddb.....................................................................................................................................................................................................................................................cbcbcccbbaaaacadda*dd",
      "......cbbbccbbbbbbbbbbadddddb.....................................................................................................................................................................................................................................................cbcbccccbbaaaabdda*dd",
      "......cbbbccbbbbbbbbbbaddaddc....................................................................................................................................................................................................................................................dcbcbccccccbaaabdaa*dd",
      "......ccccccbbbbbbbbbbaddaddc....................................................................................................................................................................................................................................................dcbcccccccbbbaaadaa*dd",
      "......cbbccccabbbbcbbbaddaddc.....................................................................................................................................................................................................................................................cbcbbccbccbbaaadaa**d",
      "......cbbcccaabbbbcbbbaddaddc.....................................................................................................................................................................................................................................................cbcbbccbbccbbaadaa**d",
      "......cbbbccbbbbbbcbbbaddaddc.....................................................................................................................................................................................................................................................cbcbbccbbcccbaa*aa**d",
      "......cbbccbbbbbbbcbbbaddaddc.....................................................................................................................................................................................................................................................cbcbbccbbbccbbadddd*d",
      "......cbbcbaababbbcbbbaddaddc.....................................................................................................................................................................................................................................................cbcbcccbbbcccccaddddd",
      "......cbbcbabbacbbbbbbaddaddc.....................................................................................................................................................................................................................................................cbbccccbbbcccccad*ddd",
      "......cbccabbbbccbccbbaddaddb.....................................................................................................................................................................................................................................................cbbbcccbbbccccccddddd",
      "......cccaaabbbccbbcbbaddaddb.....................................................................................................................................................................................................................................................cbbbcccbbccccccbba**d",
      "......ccbbbaccbccbccbbaddaddb.....................................................................................................................................................................................................................................................cabbcccbbbbbccbbbad*d",
      "......cbbbbbccbbcbbcbbaddaddd.....................................................................................................................................................................................................................................................cabbcccabbbbccccbad*d",
      "......cbabbbcbbbbbbcbbbddaddb.....................................................................................................................................................................................................................................................cabbbccaabbbbcccbad*d",
      "......cbabbccbbbbbbbbbbddaddb.....................................................................................................................................................................................................................................................cbbbbccaabbbbbccbad*d",
      ".....cbbaabcbbbbbabbbaaddaddb.....................................................................................................................................................................................................................................................cbbbbccaabbbbbccccdddd",
      "....ccbbaaccbbbbbabbbaaddaddb.....................................................................................................................................................................................................................................................cbbbbccaabbbbbccccbd*dd",
      "....cbbbaaccbbbbbbbbbaadddddb.....................................................................................................................................................................................................................................................cbbbbccaabbbbbccccbbd*d",
      "....cbbbacccbbbbbabbbbdddaddb.....................................................................................................................................................................................................................................................cbbbbccaabbbbbcbccbbd*d",
      "....cbbcccccbbbbbabbbbaddaddd.....................................................................................................................................................................................................................................................cbbbbccaabbbbbcbcccbd*d",
      ".....cccccccbbbababbbbaddaddb.....................................................................................................................................................................................................................................................cabbbccbbbbbbbcbbccbdd",
      "......ccccccbbbababbbbaddaddb....................................................................................................................................................................................................................................................ccabbbccbbbbbbbcbbccdd",
      "......ccccccbbbabbbbbbaddaddb.....................................................................................................................................................................................................................................................cabbbccbbbbbbbcbbcdda",
      "......cccbccbbbabbbbbbdddaddb....................................................................................................................................................................................................................................................acabbbccbbcbbbbcbbbdda",
      "......cbcbccbbbabbcbbbdddaddb....................................................................................................................................................................................................................................................acabbbccbccbbbbbbbbdda",
      "......cbcbccbbbbcbcbbbdddaddb.....................................................................................................................................................................................................................................................cbbbbccbccbbbbbbaadda",
      "......cbcbccbbbbcbcbbbaddaddb.....................................................................................................................................................................................................................................................cabbbccbcbcbbbbbaadda",
      "......cbcbccbbbbcbcbbbadddddb.....................................................................................................................................................................................................................................................cabbbccbcbcbbbbbaadda",
      "......cbcbccbbbbcbcbbbadddddb....................................................................................................................................................................................................................................................dcbbbbcbbcbcbbbbbaadda",
      "......cbcbccbbbbcbbbbbadddddc....................................................................................................................................................................................................................................................dcbbaaccbcccbbabbaadda",
      "......cbcbccbbbbbbbbbbadddddc....................................................................................................................................................................................................................................................dcbbbbccbccbbbabbaadda",
      "......cbcbccbbbbbbbbbaadddddc.....................................................................................................................................................................................................................................................cbbbbbcbcccbbabbaadda",
      "......cbcbccbbbbbbbbaaaddaadc....................................................................................................................................................................................................................................................ccbbbbbcbccbbbabbaaada",
      "......cbbbccbbbbbbbbddbdaaadc.....................................................................................................................................................................................................................................................cbbbbccbccbbbbbbdadda",
      "......cbbbccbbbbabbbaabaaaadc.....................................................................................................................................................................................................................................................cbbbbbcbccbbbbbbdadda",
      "......ccbbccbbbbaababbbaabaac.....................................................................................................................................................................................................................................................cbbbbbcbccbbbbbbdbdda",
      "......bbccccbbbbaabaabbaabaac.....................................................................................................................................................................................................................................................cbcbbccbccbbbbbbdbdda",
      "......cbccccbbbbbacaabbaabbac.....................................................................................................................................................................................................................................................cbcbbbcbccbbbbbbdbdda",
      "......cbccccbbbbaacbabbaabbac.....................................................................................................................................................................................................................................................cbcbbccbccbbbbbbdbdda",
      "......cbccccbbbbaabbbbbabbbac.....................................................................................................................................................................................................................................................cbcbbccbccbbbbbbdbdda",
      "......cbccccbbbbbabbbbbabbbac.....................................................................................................................................................................................................................................................cbcbbccbccbbbcbbdbdda",
      "......cbccccbbbbbabbbbbabbbac.....................................................................................................................................................................................................................................................bbccbccbccbbbcbbabdda",
      "......cbccccbbbcbbbbbbcbbbbac.....................................................................................................................................................................................................................................................cbbcbccbccbcbcbbabdda",
      "......cbcbccbbbcbbbbbbcbbbbac.....................................................................................................................................................................................................................................................cbcbbccbbbbcbcbbabdda",
      "......cbcbccbbbcbbbbbbcbbbbacc....................................................................................................................................................................................................................................................cbcbbccbbbbcbbbbbbdda",
      "......cbcbccbbbccbbbbbcbbcccccbbbccccaaaaaaabbbcccbccccccccccccccccccccccdaaaccbaaaaaaddaadddddbbbccbaaaaaaaaaaaaaacccccccccaaaaaaaaabbccccaaaaaaaaaaaaaaaccaaccccccccccccccccccaaadcccccccccbccccccccccccccccccccccccccccccccaaaaaabbbbbbccccaaa.dddddddddaaaaaaaaaaaaaaaaaaabcccccccccbbccbcccbbabdda",
      "......cbcbccccbaaaaabbcccbbbaaaaaaaaaaaadddaaaddaabaaaaaaaaabbaaaaaaaaaaaddaadbbbbaddddddddddddddddbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddaabaaabbbbbdddddddddddddabdddddabbaabbbaabbbaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbddddddddddd*dd*ddddddddddddaaaaaaaaaaaabbbbbbbbbbbbbbaaabbbabdda",
      "......cbccaaaabaaaaabbaaaaaaaaaaaaaaddaaaddddddaaaaaabbaaaabbbaaaaaaaaaaaaaaadabbbbadaaddddddaaaadababaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbaaaaaaaaaaaabbaabbbbbbaaaaaaaaaaaabbaaaaaabbbbbbbbbbbbbbbbbbbaaabbaaaaabbbbbbbbbbbbbdaaaddddddddddddddddddddddaabaaaaaddddaaaaabbbbbaaaabbbaaaaa*dddaadda",
      "......cccaaaaaaaaaaaaaaaaaaaaaaddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbaaaaaadaaaaaaabbabadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaabbbaaaaaaaaaaaaaaaaaaaaaaaaabbcbbaaadddaaaaaaaaaaaaaaaaaaabdd**dddddddaabaaaaaaaaaaaaaaaadddaaabbbbaaaaddaaaaaaaaaaddaaabbaaaaaadda*dadda",
      "......ccaaaaaaaaaccaaaaaaaaaabaaaaaadaaabbbaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaacaabaaaaaadbaaaaaaaaabadcddddddadddddddddaaaaaddddddaaddddaaaaaaaaaaddaaaaaaaabbbbbdddaaaaaaaaaaaaaaaaaaaaaaaabbcaaaaddaaaaaaaacaaaaaaaaaaabddddddaaababbaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaabbaaaaaddabbbaabaaabaaa*ddda",
      "......cbbbbbbbbbbcbbbbbbbbbbbbcbaabaabbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbaaadabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbcbbbbbbbbbbbbbaabbaabbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbabbaabbbbbbbbbbbbbbbbbbbbbbbbad**da",
      "......cbbbbbccccccbbbccccccccccbbbbbbbccbccccbbbbaaaaabbbbbbbbbbbbbbbbbccccbcccbccbbbbbbbbbbccbbccccccccccccbbbbabbbaaabbbbbbbbbbbbbbbbbbbbbbcccbbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbabbbbbbaabbbcbbbbbbbbbbbbbaabbaabccbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbabbcccccbbbbbbcccbbbbbbaaaaddda",
      "......cbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbccbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbcbbbbbaabbbbbbbbbbbbbbbbbbbbbbbbcaabbabbbbbccbbbbbbbbbbbbbbbbbcbbbbbbbbcccccccbbcccbbbbbbbbbbbbbcbbbbaaaaadda",
      "......cccccccccccccccccccccccccccbcbbcccbacccccccccccccccccccbbbcccbcccbbbccccccccbbbcccccccccccccccccccccccccbbaabcccccccccccccccccccccccccccccbcccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbbccccccccccccccccccccbbccbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcccaadda",
      "......cbbbbbcccccccccccccccccccccbcbbccccacccccccccccccccccccccccccccbbbbbcccccccccccccccccccbcbbbbbbbbbccccccbbbbbbccccccbcccbbbbbbbbbcccccccccbcbbbbbbbccbbbbbbbbbbbbbbbbbcbbbbbbccccccccccccbbcbbbbbccccccbcbbbbccccccccbbcccbcccbbbbbbbbbbcbbbbbbbbbbbbbbbcccbcccccccccccbbbbccccbcccccccbbbbaabdda",
      "......ccccccccccbccccccccccccccccccbccbccabbccbbbccbbbbbbbbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbcccccbbcccbbbbbbbbbbbbbbbbbbcbbbcccccbbbbbbbbbbcbbbbbbbbbbbbbbbbcbbccccccbbbbbbbbcccbccbbbcbccbbbbbbbbbbbbccbbbcbcbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbbbbbbbbbbbbbbbbbccaacbbbbbbbbdda",
      "......cccbbbbbbbbbcbbbbbbbbbbbbbcccccbbbcaccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaabbbbbbccbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbcccccccccccccbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbcccccccccbbccbcbcccccbbbbbbbbbbbbbbbccbbccbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbdda",
      "......ccccbbbbbbbbccbbbbbbbbbbbbbbcccbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaabbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccbbbdda",
      "......cccccccbbbbbbcccccccccccccbbccccbbbccbbbbbbcccccbbbbbbbbbbbbbbbcccccbbbbbbcccccbbbbbabbbbbbbbbbccccccbbbbccccbbbbbcccccbbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbccccccbbbbccccccbbbbbbbbbbbbbcccccccbbbbbbbbbbbccccccbbbbccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbabdda",
      "......cbccccbbbcbbccccccccccccccccccccccccccccccccccccccccccccccacccccccccccccccccccccccccaccccccccccccccccccccccccccccccccccbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcbbbbbabdda",
      "......cbccccbbbcbcccccccccccccc.ccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.bbaaaaaaaaaaaaaaaaaaaaaaaaa.....bb...c.aaaaaaaaa....bbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.cbbbbbaaaaaabbbbbbbbb.......cdddaaaaaaaaaa.caaac.aaaaaaaaaa.aaaaaaaaaaaaaac..ccbb...ccccccccbbbcbcbbbabdda",
      "......cbccccbbbccbccccccccccc.....................................................................................................................................................................................................................................................cccccccbbbcbcbbbabdda",
      "......cbccccbbbccbbbccccccccc.....................................................................................................................................................................................................................................................cccccccbbbcbcbbbabddb",
      "......cbccccbbbcbbbbbccccccbc.....................................................................................................................................................................................................................................................cccccccbbbcacbbbbbddb",
      "......cbccccbbbcbbbbbbcccccbc.....................................................................................................................................................................................................................................................cccccccbbbcaccbbabddb",
      "......cbcbccbbbcbbbbbbcccccbc.....................................................................................................................................................................................................................................................cccccccbbbcbccbbaaddb",
      "......cbcbccbbbcbbbbbbcccccbc.....................................................................................................................................................................................................................................................cccccccbbbcbccbbbaddb",
      "......cbcbccbbbcbbbbbbcccccbc.....................................................................................................................................................................................................................................................cccccccbbbcbccbbbdddb",
      "......cbcbccbbacbbbbabccccbbc.....................................................................................................................................................................................................................................................cbcccccabbbbccbbaaddb",
      "......cbcbccbbabbbbbabbcccbbc.....................................................................................................................................................................................................................................................cbcccccabbbbcbbbbaddb",
      "......cbcbccbbbbbbbabbbcccbbc....................................................................................................................................................................................................................................................acbcccccaabbbbbbbaaddb",
      "......cbcbccbbbbbbbabbccccbbc....................................................................................................................................................................................................................................................acbcccccbabbbbbbbbbddb",
      "......cbcbccbbbcbbbabbccccbbc.....................................................................................................................................................................................................................................................cbcccccbbbbbbcbbbaddb",
      "......cbbbccbbbccbbabbcbccbac.....................................................................................................................................................................................................................................................cbcccccbbbbbbcbbbaddb",
      "......cbbbccbbbccabbbccbccbac.....................................................................................................................................................................................................................................................cbbccccbbbbbbcbbbaddb",
      "......cbbbccbbbccabaaabbcbbac.....................................................................................................................................................................................................................................................cbbccccbbbbbbcbbbaddb",
      "......cbcbccbbbccabaabbbcbbac.....................................................................................................................................................................................................................................................cbbccccbbbbbbcbbbaddb",
      "......cbcbccbbbbcabaaabbbbbac.....................................................................................................................................................................................................................................................cbcccccbbbbbccbbbaaab",
      "......cbccccbbbbcabaaabbbbbac.....................................................................................................................................................................................................................................................cbcccccbbbcbcbbbbaaab",
      "......ccccccbbbbcabaabbbbbbac.....................................................................................................................................................................................................................................................cbcbbccbbbcbcbbbbaddb",
      "......ccccccbbbbcababbbbbbbac.....................................................................................................................................................................................................................................................cbcbbccbbbcbcbbbbaddb",
      "......ccccccbbbbcabbbbbbbeffg.....................................................................................................................................................................................................................................................cbcbbccbbbcbcbbbbbddb",
      "......cbccccbbbbcabbbbbbeeffgg....................................................................................................................................................................................................................................................gbcbbccbbbcbcbbbbbddb",
      "......cbccccbbbbccbbbbbeeeeegg...................................................................................................................................................................................................................................................gggcbbccbbbcbcbbbbbddb",
      ".....ccbccccbbbbccbbbbeeeggggadaa..............................................................................................................................................................................................................................................ggggggbbccbbbcbcbbbbbddbd",
      "..ccccccccccbbbbcccbbgggggeefadddd............................................................................................................................................................................................................................................ggeeegggcccbbbcbcbbbbbdddddd",
      ".gaaaabbcccccccbbcccggggfffeffdddc............................................................................................................................................................................................................................................ceggeeeeccccccccccccbbdd****h",
      "ggaaaaaaeaaaaaaaacchhhhhhheffadddc...........................................................................................................................................................................................................................................bceggggeeecddddddddcddddddd**oh",
      "fggeeeeeeeeeffeeeeeeehhehheffadddc...........................................................................................................................................................................................................................................bceggeggefffdhhffeeeeeeeeedhhoh",
      "fgeeeeeeeeeefeeeeeeeehfehhhhfadddc...........................................................................................................................................................................................................................................bceggeggeeffffheeeeeeeeeeeehh*h",
      "fgfeeeeeeeeeeeeeeeeeeefehhhhfadddc...........................................................................................................................................................................................................................................bceegggeeeehffeeeeeeefeeeeehh*h",
      "fgfeeeeeeeeffeeeeeeeeehfhhhhfadddd...........................................................................................................................................................................................................................................bceeegggeeehffeeeeeefffeeeehh*h",
      "fgeeeeeeeeeffeeeeeeeeehfhhhhfaddda...........................................................................................................................................................................................................................................bceeeeegeehhhfeeeeeeefeeeeefhhh",
      "fgeeeeeeegeefeeegeeeefffhhfffbddda...........................................................................................................................................................................................................................................bcggegggeehhheeeeeeeeeeeeeefh*h",
      "fgeeeeeffgeeeeeegeeeeffffhhhhbddda............................................................................................................................................................................................................................................cggggggeehheeeeeeeeeeeeeeffhhh",
      ".gggggggggggeggggggggggghhhhhbdddb...........................................................................................................................................................................................................................................cceggggggggggggggggggggggggghhh",
      "ggefffgffeegeeffggghhhhhhhhhhbdddb...........................................................................................................................................................................................................................................bceeeeggeeeffeehhhffhhhehhhhh*h",
      "ggeeeeeeeeeggeefegeffhhehhhhfadddb...........................................................................................................................................................................................................................................bcggeeggeehhheeeeeeehfeeeeefh*h",
      "ggeeeeeeeeeegeeeegeeehhehhhhfabb...............................................................................................................................................................................................................................................ggegggeehheeeeeeeeefeeeeefh*h",
      ".geeeeeeeeeeeeeeeeeeehhehhhhhbb.................................................................................................................................................................................................................................................eegggeeeheeeeeeeeefeeeeefh*h"
    ],
    legend: { a: ["wood", 2], b: ["wood", 1], c: ["wood", 0], d: ["wood", 3], e: ["stone", 1], f: ["stone", 2], g: ["stone", 0], h: ["stone", 3], "*": "glow", o: "core" }
  },
  // altar-memory, painted then traced.
  "altar-memory-painted": {
    rows: [
      ".....caaaccc",
      "....ccaaeccc",
      "....caeeeecca",
      "...ccaeeeebca",
      "...baae..ebbb",
      "...caae..ebbb",
      "...eaae..eebb",
      "...eeeeddedddb",
      "..ddeeecccccbb",
      ".eeeeddcccddccb"
    ],
    legend: { a: ["stone", 4], b: ["stone", 3], c: ["stone", 2], d: ["stone", 1], e: ["stone", 0] }
  },
  // altar-wanderer, painted then traced.
  "altar-wanderer-painted": {
    rows: [
      ".....aa",
      "....aaab",
      "....aaab",
      "...abeadd",
      "...abeacd",
      "...aeeccb",
      "..aabecabb",
      "..dbbbcaeb",
      "..bbddcaeb",
      "..bbbddeeee",
      ".edaadbbeee",
      "eecbddcceeee",
      "...dbbbbbe"
    ],
    legend: { a: ["rock", 4], b: ["rock", 1], c: ["rock", 3], d: ["rock", 2], e: ["rock", 0] }
  },
  // altar-harvest, painted then traced.
  "altar-harvest-painted": {
    rows: [
      "...abbccbccd",
      "..aabaccbbcdd",
      "..aaaaccbccdd",
      "...eeeeeeeed",
      "....eebbceea",
      "....eeeccecd",
      "....aebccecd",
      "....aebbcacd",
      "....eeabcacd",
      "....eeabbaad",
      "..aaeeeeaaaad",
      "..eeeeaaaaaa"
    ],
    legend: { a: ["stone", 1], b: ["stone", 2], c: ["stone", 3], d: ["stone", 4], e: ["stone", 0] }
  },
  // altar-echoes, painted then traced.
  "altar-echoes-painted": {
    rows: [
      ".aabbccccddbbbb",
      "aaaabcccddcbbbbb",
      ".eeabbcdddcbeeb",
      ".eeeaacdddccce",
      "..eeabbbdbbccc",
      "...eebbbeeeee",
      "....eebbbeee",
      ".....ebbccc",
      ".....eebccc",
      ".....eaaaaa",
      ".....eaaaaa"
    ],
    legend: { a: ["stone", 1], b: ["stone", 2], c: ["stone", 3], d: ["stone", 4], e: ["stone", 0] }
  },
  // altar-bargain, painted then traced.
  "altar-bargain-painted": {
    rows: [
      ".aaaaaacbbbbaaac",
      "aaaacccccbcbcabcc",
      "aaadcccccccbcbbbc",
      "ddedddddeeaaddddd",
      ".eeedeeeeeeedddd",
      "..eeceeeeeeebbb",
      "..abcee...eebbb",
      "..abcde...ebbbb",
      "..ddddeeaaebbbb",
      "..ddddeeaadbbbb",
      ".dddddeeeedddddd"
    ],
    legend: { a: ["stone", 2], b: ["stone", 3], c: ["stone", 4], d: ["stone", 1], e: ["stone", 0] }
  },
  // altar-treasure, painted then traced.
  "altar-treasure-painted": {
    rows: [
      ".....bbbdccc",
      "....abbddddcc",
      "...eaccddddccc",
      "...ebbcddbddcc",
      "...ebbdddbddcc",
      "...ebbbccccbbc",
      "...ebbeeeccbcc",
      "...ebbeeeecccc",
      "...ebbaeebccbb",
      "..eebbaabbaaabb"
    ],
    legend: { a: ["stone", 1], b: ["stone", 2], c: ["stone", 3], d: ["stone", 4], e: ["stone", 0] }
  },
  // altar-precision, painted then traced.
  "altar-precision-painted": {
    rows: [
      "....dce",
      "...ddcee",
      "..dddceee",
      "..dddceeee",
      ".dddeeccdde",
      ".dddeaaaade",
      ".bddeaaaade",
      ".bbbeaaadde",
      ".bdbeeaccde",
      ".dddbccbcde",
      ".dbbdccbaae",
      ".dbddccbdde",
      ".ddddbcbdae",
      ".dddabcddae",
      ".aaaaddaaaa",
      "aadddbbbddbb",
      "aaaaaddbaadc"
    ],
    legend: { a: ["stone", 0], b: ["stone", 2], c: ["stone", 3], d: ["stone", 1], e: ["stone", 4] }
  },
  // altar-fate, painted then traced.
  "altar-fate-painted": {
    rows: [
      ".aaaaaaaaaaaaccb",
      "aaaadddddddaaaabb",
      "aaadddcddddacbbab",
      "aaadddcddddaccaab",
      "eeedddeccccaaaccb",
      ".eeddeeeeeeddacc",
      "..abbbe...edbbb",
      "..abbbe...ebbbb",
      "..ccbbe..ccbbba",
      "..ccceeeeeebaaa",
      ".ccccceeaacccccc"
    ],
    legend: { a: ["stone", 2], b: ["stone", 3], c: ["stone", 1], d: ["stone", 4], e: ["stone", 0] }
  },
  // altar-time, painted then traced.
  "altar-time-painted": {
    rows: [
      ".aaabbccddddddd",
      "eeeebbbbddccccdb",
      ".eeaaeebdddcccc",
      ".eeebbcddddcdd",
      "..eeebcdddccdd",
      "...eeeeeaaaab",
      "....eeeaaeea",
      ".....eecddd",
      ".....eecddc",
      ".....eebbbb",
      ".....eeebbb"
    ],
    legend: { a: ["stone", 1], b: ["stone", 2], c: ["stone", 3], d: ["stone", 4], e: ["stone", 0] }
  },
  // altar-patience, painted then traced.
  "altar-patience-painted": {
    rows: [
      "....aaaa",
      "....baaa",
      "...ebccee",
      "..eeaaeeee",
      ".eebaaceaad",
      ".ebbeecaaad",
      ".aaeeccccad",
      ".aaeeccaaad",
      ".aaeeddaeed",
      ".eeeddeeeed",
      ".eeaadccaed",
      ".beaaacaaed",
      ".beeaaceeed",
      ".eebbaaabbe",
      ".bbbbbeebbb",
      "beebbbeebbbb",
      "bbbbbbebbbbb"
    ],
    legend: { a: ["stone", 2], b: ["stone", 0], c: ["stone", 3], d: ["stone", 4], e: ["stone", 1] }
  },
  // altar-fortune, painted then traced.
  "altar-fortune-painted": {
    rows: [
      ".......bb",
      "......bbbb",
      ".....ccbbb",
      ".....cebbbb",
      "....cdedbbb",
      "....cdcdaaa",
      "...ccdceaaeb",
      "...ccddeeaeb",
      "...ccddeaaeb",
      "..ccceeeeeeea",
      "..ccccdeeddaa",
      "..ccccddddda"
    ],
    legend: { a: ["rock", 3], b: ["rock", 4], c: ["rock", 0], d: ["rock", 1], e: ["rock", 2] }
  },
  // sanctum-menhir-tall, painted then traced.
  "sanctum-menhir-tall-painted": {
    rows: [
      "........aa",
      ".......caad",
      ".......cccd",
      ".......cccd",
      ".......aacee",
      "......accccd",
      "......accccd",
      "......acccadd",
      "......ccccade",
      "......ccccade",
      "......cccaaee",
      ".....cccaaabe",
      ".....aabcaabe",
      ".....cabccaaeb",
      ".....cbbccaabb",
      ".....cacacaabb",
      ".....cacacaeea",
      ".....cacccceee",
      ".....aaccccbee",
      ".....aaccccbbb",
      ".....aaccccabb",
      ".....ccccccabb",
      ".....ccccccbbb",
      ".....ccacccbeb",
      ".....ccaccceea",
      ".....ccaccaaea",
      ".....aacccaaee",
      ".....abcccaaee",
      ".....bbcccaade",
      ".....ebcccaadb",
      ".....ebcccaaab",
      ".....abcccacdb",
      ".....aacccacdb",
      ".....aacccacdb",
      ".....accccacdb",
      ".....cccccbbdb",
      ".....ccaaabbdb",
      ".....aaaaaaddb",
      ".....aaaaaaade",
      ".....aaabbaade",
      ".....bbbbbbadd",
      ".....bbbbbbade",
      ".....ebbbebaee",
      ".....ebbbeaaeeb",
      ".....beeedaaddb",
      ".....bdeedbaddb",
      ".....edeeebbdde",
      "....eeddeeebdde",
      "....deddddebdde",
      "...eddddddedddd",
      "...edddddddddddd",
      "..aaeeddddddddddb",
      "..addddddddddddbb",
      ".eedddddeeedddddde",
      "eeeddeeddbbeddddde",
      "..eeebbeebbeeddddd",
      "...eeebeeddeeddd",
      ".........dddddd"
    ],
    legend: { a: ["rock", 3], b: ["rock", 2], c: ["rock", 4], d: ["rock", 0], e: ["rock", 1] }
  },
  // sanctum-far-low, painted then traced.
  "sanctum-far-low-painted": {
    rows: [
      ".a",
      "aaaa",
      ".aaaa",
      ".bbaa",
      ".bbaa",
      ".abaa",
      ".aabd",
      ".aabd",
      ".ccdd",
      ".ccce",
      "ccccce"
    ],
    legend: { a: ["rock", 2], b: ["rock", 4], c: ["rock", 0], d: ["rock", 1], e: ["rock", 3] }
  },
  // sanctum-far-trilithon, painted then traced.
  "sanctum-far-trilithon-painted": {
    rows: [
      "...aaabbcccabbbb",
      "..daabbbcccaeaaac",
      "..ddbbbeecceeebbcc",
      "..ddbbeeeeeeeeebc",
      "...dbbdddeeddaec",
      "...dbbdd....aacc",
      "...daabb....aacc",
      "...aaabb....aacc",
      "...daaaa....aabb",
      "...debca....bbaa",
      "...debcb....ebbc",
      "...debbb....ebbcc",
      "...debbb....eeecc",
      "...ddaaa....deeec",
      "..dedaaad..dddbbc",
      ".ddeddaedddddebbba",
      ".dddddeed..ddeaaaa"
    ],
    legend: { a: ["rock", 2], b: ["rock", 3], c: ["rock", 4], d: ["rock", 0], e: ["rock", 1] }
  },
  // sanctum-far-menhir, painted then traced.
  "sanctum-far-menhir-painted": {
    rows: [
      "...a",
      "..bae",
      "..bbb",
      "..bbb",
      "..aab",
      "..aab",
      "..aac",
      "..aac",
      "..bac",
      "..bccb",
      "..bbbb",
      ".acbbc",
      ".addcc",
      ".adddc",
      ".ddddc",
      "ccddddd",
      "...ecd"
    ],
    legend: { a: ["rock", 4], b: ["rock", 3], c: ["rock", 2], d: ["rock", 0], e: ["rock", 1] }
  },
  // altar-blade, painted then traced.
  "altar-blade-painted": {
    rows: [
      "....aac",
      "...daceee",
      "...ddceee",
      "..daaeeeee",
      ".dddbbeeeec",
      ".dddcdddaae",
      ".dddcddddae",
      ".ddaccdddbe",
      ".ddaaeadbbe",
      ".ddaeeaabbe",
      ".ddaecaabbe",
      ".ddaccbabbe",
      ".dddcbbaaac",
      ".dddbbbbaac",
      ".dddaaaaaac",
      "ddddaabbbacc",
      ".ddddaaaddd"
    ],
    legend: { a: ["stone", 1], b: ["stone", 2], c: ["stone", 3], d: ["stone", 0], e: ["stone", 4] }
  },
  // altar-might, painted then traced.
  "altar-might-painted": {
    rows: [
      ".aaaabbccccbc",
      ".aaaaccabbccca",
      ".aaaaccabbccca",
      "..aeeeeeeeeec",
      "...eeeeddeee",
      "...bbbedbccb",
      "...abbbbbbbb",
      "...abbbbbbcb",
      "...aabbeeccb",
      "..accbbeeedb",
      ".aacccceeeddbb",
      "...cccccccdd"
    ],
    legend: { a: ["stone", 4], b: ["stone", 3], c: ["stone", 2], d: ["stone", 1], e: ["stone", 0] }
  },
  // sanctum-menhir-great, painted then traced.
  "sanctum-menhir-great-painted": {
    rows: [
      "............b",
      "...........bcd",
      "...........bdd",
      "...........aee",
      "..........aabbb",
      "..........aabbc",
      "..........abdee",
      "..........bbdee",
      ".........bbddeee",
      ".........bbddeed",
      ".........bdddeed",
      "........abdddded",
      "........abbddcccd",
      "........abceeeebb",
      "........aaceeeeeb",
      "........abbbeeeeb",
      ".......aabeeeeeee",
      ".......aabeeeeeee",
      ".......aabeeeaaee",
      ".......aabeeededd",
      ".......aaddeddedd",
      ".......acddddbbbd",
      ".......acbbdeebbe",
      ".......aacceeeeee",
      ".......aacddeeeee",
      ".......aadddeeede",
      ".......aaddddeede",
      ".......aabdcccdde",
      ".......aaaddcaeed",
      ".......aaadddaeed",
      ".......aabddddeed",
      ".......aabddeeeede",
      ".......aaddceeeeee",
      ".......aaddceebeee",
      ".......aadbeeebeee",
      ".......aadbdeedbee",
      ".......cabbdeedbee",
      ".......cacbdebbbee",
      ".......caceeebbbee",
      ".......ccceeeeebbe",
      ".......ccceeeedbbe",
      ".......ccbeededbee",
      ".......ccbeddebdee",
      ".......ccbddedbdee",
      ".......ccbbeedbdee",
      ".......ccbbeedbdee",
      ".......ccbeeeeddee",
      ".......ccbeeeddbee",
      ".......ccbeeebdbee",
      ".......ccbeeebdbee",
      ".......ccbdeebdbbe",
      "......cccddeeddbbe",
      "......cccdbeedddbe",
      "......cccdbedddbee",
      "......cccdbddbdbee",
      "......cccbbddbdbee",
      "......cccdbbdbdbee",
      "......cccdbbdbdbee",
      "......cccbbbdbdbde",
      "......cccbbbdbbbde",
      "......cccebbdbbbbee",
      "......cccebbdcbdbee",
      "......cccddcbcbdbee",
      "......ccccdcbcbbbde",
      "......caccccbcbbbde",
      "......aaccccbacbbbe",
      "......aacccccacbbbe",
      "......aaaccccacbbbe",
      ".....aaaaacccacccdd",
      "....aaaaaacccacccbbe",
      "...caaaaaaaaaaaceeee",
      "...cacccbbbbbbddeeeee",
      "..caaaccbbbbcccdeedde",
      "..caaaaaaccbeeeecccde",
      "..caccaaaaceeeeaaccdde",
      ".cccccaaaaceeeddaacbbe",
      ".caaaaaaaaceeebbaacbbe",
      ".aaaaaaaaaaeeccccaccdd",
      "aaaaacaaaaaddcacaaacbbc",
      ".aaaacaaaacdccacaaaccccc",
      "..aaaaaaaacbccacaaaaa",
      "....aaaaaaabccaaaaaa",
      "......aaaaabcaaaa",
      "..........aaaa"
    ],
    legend: { a: ["rock", 0], b: ["rock", 2], c: ["rock", 1], d: ["rock", 3], e: ["rock", 4] }
  },
  // sanctum-menhir, painted then traced.
  "sanctum-menhir-painted": {
    rows: [
      "......aa",
      "......bbc",
      ".....abbc",
      ".....acccc",
      "....accebb",
      "....aceeeb",
      "....aaeeee",
      "....adeeeeb",
      "....adaabbb",
      "...aaeeeddd",
      "...aaeeeecc",
      "...aaeeeecc",
      "...aaaaeecc",
      "...aaaeddcc",
      "...aaeeeedd",
      "...aaeeeecc",
      "...aaeeeecc",
      "...aabeecec",
      "...aabeecec",
      "...aaaccbbb",
      "...aaeeebbb",
      "...aaeeeccc",
      "...aaeeeccc",
      "...aaeecccc",
      "...aaeecccc",
      "...aaeeccec",
      "...daeeccec",
      "...dacbcccc",
      "...dacbeccc",
      "...daebecbc",
      "...daecccbc",
      "...ddeccbbc",
      "...dacccddc",
      "...dabbbbbbc",
      "..ddabbddddbb",
      ".daaabdddddbb",
      ".aaaadddddddb",
      "aadddccccccbbb",
      ".aadaabbbcaaab",
      "..aaaaa"
    ],
    legend: { a: ["rock", 0], b: ["rock", 2], c: ["rock", 3], d: ["rock", 1], e: ["rock", 4] }
  },
  // sanctum-broken, painted then traced.
  "sanctum-broken-painted": {
    rows: [
      "...........abb",
      "...........abb",
      "......dccaaabb",
      "......daaaabbb",
      "......dddabebb",
      "......dddabebeb",
      "......ddddeebeb",
      "......ddddebeeb",
      "......dddeebebb",
      "......ddccebbeb",
      "......ddccebbeb",
      "......ddceeeeeb..e",
      "......ddceeccccbbbb",
      "......ddcccaaaaebbbb",
      "......ddaccaddeebbbbb",
      "......ddacddddeeebebbb",
      "......ddaadddddeeeebbb",
      ".....dddddddddddecceeee",
      "....dddddddddddddccaeec",
      ".ddddddddddddddddccaaacbb",
      ".......aaaacccaaacccc"
    ],
    legend: { a: ["rock", 1], b: ["rock", 4], c: ["rock", 2], d: ["rock", 0], e: ["rock", 3] }
  },
  "sigil-might": { rows: [".*.", ".*.", "*c*", ".*."], legend: SIGIL },
  "sigil-blade": { rows: ["..*", ".c.", "**.", "*.."], legend: SIGIL },
  "sigil-fortune": { rows: [".*.", "*c*", ".*."], legend: SIGIL },
  "sigil-patience": { rows: ["***", ".c.", ".c.", "***"], legend: SIGIL },
  "sigil-time": { rows: ["***", "..*", "*c*", "***"], legend: SIGIL },
  "sigil-fate": { rows: ["*.*.*", "*.*.*"], legend: SIGIL },
  "sigil-precision": { rows: [".c.", "***", "*.*"], legend: SIGIL },
  "sigil-treasure": { rows: ["***", "*c*", "***"], legend: SIGIL },
  "sigil-bargain": { rows: ["*****", "*.*.*", "..c.."], legend: SIGIL },
  "sigil-echoes": { rows: ["*...*", ".*.*.", "..c.."], legend: SIGIL },
  "sigil-harvest": { rows: ["*.*", ".c.", ".*."], legend: SIGIL },
  "sigil-wanderer": { rows: ["*..", ".*.", "..*", ".c."], legend: SIGIL },
  "sigil-memory": { rows: [".***.", "*.c.*", ".***."], legend: SIGIL },
  // A ball of the thread of the night, and the shuttle, its point lit.
  "thread-ball": { rows: [".###.", "#tTt#", "#TtT#", ".###."], legend: { "#": "outline", t: ["cloth", 2], T: ["cloth", 1] } },
  shuttle: { rows: ["#wwwwwww*", ".#WWWWW#."], legend: { "#": "outline", w: ["wood", 3], W: ["wood", 1], "*": "glow" } }
};
