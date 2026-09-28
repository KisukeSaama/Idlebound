import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Will-o'-Wisp (BIBLE 8.4): a lantern with no one holding it, looking for someone to
 * follow it. A rusted iron lantern hanging from nothing, the last link of its chain broken
 * open; inside, a cold flame of mire light with a face in it, hollow eyes and a long open
 * mouth, turned to the company. Its light trails behind it in wisps, the way it came.
 */
export const WILL_O_WISP: CreatureGrid = {
  rows: [
    "..............R",
    ".............1",
    "............11",
    "............00",
    "",
    "........20......11",
    "........2........1",
    "........1........2",
    "........1........2",
    "........1........2",
    "............222.12",
    "..........22222222",
    "........2222RR22222",
    ".......2222RRRrr1222",
    ".....2222RRRRRrrr2211",
    "....2222RRRRrrrrr22211",
    "...22222rrrrrr111122111",
    "..222222211rAA1111122111",
    ".22211222111AA11111221111.................A",
    ".211112221111111111111111",
    ".1111111111112222222222222.................p",
    ".22222222222n1AA00000011........AAA",
    "..11p00000AAnEEAA00000p1......AA...AAA",
    "..11p00000AAnEEAA00000p1....AA........A",
    "..11p0000AAEnEEEAA0000p1..AA....ppp....A",
    "..11p0p0AAAEnEEEAA0000p1.A...ppp........A",
    "..11p00pAAEEnEEEEAA000p1A..pp...........A",
    "..11p00pAAEEnEEEEAA000p1.pp..............A",
    "..11p00ApEEEnEEEEEA000p1.................A",
    "..11p00pAEEEnEEEEEAA00p1.................A",
    "..11p0ApAEEEnEEEEEAA00p1................A",
    "..11p0AAAEEEnEEEEEAAA0p1...............A",
    "..11p0AA000EnE000EA111p1",
    "..11p1AA000EnE000E1111p1.............p......A",
    "..11p1AAA00EnE00EEAAA0p1",
    "..11pAAAAEEEnEEEEEAAA00p",
    "..11pAAAAEEEnEEEEEAAA00p..................p",
    "..10pAAAAEEEnEEEEEAAA00p",
    "..10pAAAAEEnnnEEEEAAA00p....AAAA",
    "..10p0AAAAE0n0EEEAAAA00p.AAA....AA",
    "..10p0AAAAE0n0EEEAAA001p..pppppp..AA",
    "..10p00AAAA0n0EEAAAp001p............A",
    ".110p00AAAAEnEEEAAAp000p1............A",
    ".110p00AAAAAnEEAAAp0000p1............A",
    ".110p000AAAAn1AAAAp0000p1.............A",
    ".110p0000AAAn1AAA000000p1.............A",
    ".110p000000An1AA0000000p1.............A",
    ".110p0000000n1A00000000p1..............A",
    ".110p0000022n2222222222p222............A",
    "22222222222221122111221111.............A",
    "21111111111211122111221111",
    "22111RRRRRr11111111111100",
    ".2111RRRRRr11111111111p0x...............p.....A",
    ".1110rrrrrr111111111110px",
    ".11000000000000000000000p",
    "..0xxxxx00...............p",
    "........11112222x.........p",
    ".........1111111x.........p",
    "..........111111...........p",
    "...........0000............p",
    "............................p",
    "............................p",
    "",
    "",
    ".............................p",
    "",
    "",
    "",
    "",
    ".................................A",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  legend: {
    "0": { m: "iron", step: 0 },
    "1": { m: "iron", step: 2 },
    "2": { m: "iron", step: 3 },
    A: { m: "flame", step: 4 },
    E: { pal: C.mireLight, glow: true, light: true },
    R: { m: "rust", step: 2 },
    n: { m: "flame", step: 1 },
    p: { m: "flame", step: 3 },
    r: { m: "rust", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // No breath: the lantern bobs on the air, up and down.
    waist: 40,
    breath: [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
    // Once in a cycle, the flame leaps.
    twitch: {
      frames: [7],
      patches: [
        { x: 9, y: 21, rows: [".....E", "", "..E...E", "", ".E.....E", "", "E.......E"] }
      ]
    }
  }
};
