import type { RelicGrid } from "../../relics";

/** A dark reliquary on a chain; behind its glass, what he keeps of his life. Painted, then traced. */
export const PHYLACTERY: RelicGrid = {
  rows: [
    "........afcc",
    "........fccc",
    ".......fg..ee",
    "......fd....ee",
    ".....ffee...eed",
    ".ffffffffffffffffff",
    "ffffffffffffffffeefc",
    "ffedeeeeeeeeeddeefcc",
    "edddbbegghggedbbebbc",
    ".ddebccbbeggccccebb",
    ".fffeehbbehcggddebb",
    ".ffebeeggghgggddedb",
    ".ffecchggghhhgdeedb",
    ".ffecchhghhhhhggedb",
    ".ffeheghhhhhhhggfdb",
    ".fffhghhiiiihgghfdb",
    ".ffehghhiiiihhghfcb",
    ".ffehgghiijihgghfcb",
    ".ffehghhiiihhhghfcb",
    ".ffegghhhhhhhhghfdb",
    ".ffehgihhhhhhhggfdb",
    ".feeggighhhhhieefdb",
    ".ffeeiieghhheiieedb",
    ".ffebeehhhhhheeefdb",
    "fffeeeeehhhheeeeeedb",
    "ffdeeeeeeeeeeeeedddc",
    "ccbbbbbbbbbbbbbbbbcc",
    ".cbbbbbbbbccccccbbb"
  ],
  legend: {
    a: { m: "bone", step: 2 },
    b: { m: "dark", step: 0 },
    c: { m: "dark", step: 1 },
    d: { m: "dark", step: 2 },
    e: { m: "dark", step: 3 },
    f: { m: "dark", step: 4 },
    g: { m: "soul", step: 0 },
    h: { m: "soul", step: 1 },
    i: { m: "soul", step: 2 },
    j: { m: "soul", step: 3 }
  }
};
