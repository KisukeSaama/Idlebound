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
  "sanctum-menhir": menhir(14, 40, 1, 3101),
  "sanctum-menhir-tall": menhir(18, 58, -1, 3102),
  "sanctum-menhir-great": menhir(24, 84, 2, 3103),
  "sanctum-menhir-low": menhir(12, 24, 0, 3104),
  // The far side of the ring, small with distance.
  "sanctum-far-menhir": menhir(7, 17, 1, 3107),
  "sanctum-far-low": menhir(6, 11, 0, 3108),
  "sanctum-far-trilithon": {
    w: 19,
    h: 17,
    fragile: 0,
    growth: 0.2,
    seed: 3109,
    pieces: [
      { poly: [1, 17, 2, 4, 6, 4, 6, 17], m: "rock", finish: "rock" },
      { poly: [13, 17, 13, 4, 17, 4, 18, 17], m: "rock", finish: "rock", side: "right" },
      { poly: [0, 1, 1, 0, 18, 0, 19, 2, 18, 4, 0, 4], m: "rock", finish: "rock", lift: 0.35 }
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
      { poly: [1, 26, 2, 6, 6, 2, 9, 5, 12, 0, 14, 26], m: "rock", finish: "rock" },
      { poly: [12, 26, 13, 20, 24, 19, 26, 22, 25, 26], m: "rock", finish: "rock", lift: 0.2 }
    ]
  },
  // The thirteen altars (BIBLE 6.4), in the order of the Ledger.
  "altar-might": altar("plinth", "sigil-might", 3111),
  "altar-blade": altar("stele", "sigil-blade", 3112),
  "altar-fortune": altar("cairn", "sigil-fortune", 3113),
  "altar-patience": altar("stele", "sigil-patience", 3114),
  "altar-time": altar("basin", "sigil-time", 3115),
  "altar-fate": altar("table", "sigil-fate", 3116),
  "altar-precision": altar("stele", "sigil-precision", 3117),
  "altar-treasure": altar("chest", "sigil-treasure", 3118),
  "altar-bargain": altar("table", "sigil-bargain", 3119),
  "altar-echoes": altar("basin", "sigil-echoes", 3120),
  "altar-harvest": altar("plinth", "sigil-harvest", 3121),
  "altar-wanderer": altar("cairn", "sigil-wanderer", 3122),
  "altar-memory": altar("chest", "sigil-memory", 3123),
  // Eldra's Loom: two uprights out of sight, the cloth beam at the top, the warp beam at the foot.
  "loom-frame": {
    w: 300,
    h: 176,
    fragile: 0,
    growth: 0.15,
    seed: 3131,
    pieces: [
      { cyl: [4, 0, 14, 176], m: "wood", finish: "planks" },
      { cyl: [282, 0, 14, 176], m: "wood", finish: "planks" },
      { beam: [0, 9, 300, 9], width: 11, m: "wood", finish: "boards" },
      { beam: [10, 130, 290, 130], width: 13, m: "wood", finish: "boards" },
      { block: [0, 164, 22, 12], m: "stone", finish: "ashlar" },
      { block: [278, 164, 22, 12], m: "stone", finish: "ashlar" },
      { beam: [18, 60, 4, 96], width: 4, m: "wood" },
      { beam: [282, 60, 296, 96], width: 4, m: "wood" }
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
      { block: [0, 4, 34, 3], m: "wood", finish: "boards", lift: 0.3 },
      { beam: [4, 7, 2, 16], width: 3, m: "wood" },
      { beam: [30, 7, 32, 16], width: 3, m: "wood" },
      { beam: [6, 12, 28, 12], width: 1, m: "wood", lift: -0.3 },
      { decor: "thread-ball", at: [5, 3] },
      { decor: "shuttle", at: [18, 3] }
    ]
  }
};

const SIGIL = { "*": "glow", c: "core" } as const;

export const SANCTUM_DECOR: Record<string, DecorGrid> = {
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
