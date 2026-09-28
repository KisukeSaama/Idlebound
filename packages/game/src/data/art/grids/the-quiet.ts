import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Quiet (BIBLE 8, events, the Void strata): colorless, soundless; it is not a Remnant,
 * it is where one used to be. The outline of a long-limbed stalker, hunched to spring with
 * its jaws open, filled with a pale grey and nothing else: no fur, no face, only the few
 * lines where its limbs cross it and two faint white points in shallow sockets. Pieces of it are missing as
 * if cut out with a ruler: a hind leg that ends in the air, the tail broken off square, and its hindquarters thinning into bare rows.
 */
export const THE_QUIET: CreatureGrid = {
  rows: [
    ".......................................................PPP",
    "..............................................PP.......PPP",
    "..............................................PP......PPPP.......PP",
    "..............................................PPP.....PPPP.....PPPP",
    ".............................................PPPP....PPPPP....PPPPP",
    ".............................................PPPPP...PPPPPP..PPPPP",
    ".............................................PPPPP..PPPPPPPPPPPPPP",
    ".............................................PPPPP..PPPPPPPPPPPPPP",
    "............................................PPPPPPPPPPPPPPPPPPPPPP",
    "............................................PPPPPPPPPPPPPPPPPPPPPP......PP",
    "......................................PPP...PPPPPPPPPPPPPPPPPPPPPP..PPPPPP",
    ".....................................PPPPP.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".....................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "....................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "....................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "...................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP........................................PP",
    "..................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "..................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP..............................PPPPPPP",
    ".................................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "............................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP............PPPP..........P",
    "......................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP........PPPPPPPPP",
    "...................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.....PPPPPPPPPPPPP....PPPPPP",
    ".................PPPPPPPPPllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "...............PPPPPPPlllllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.PPPP",
    ".............PPPPPPlllllllllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "...........PPPPPllllllllllllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".........PPPPPPllllllllllhEEhhllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "........PPPPPPPPllllllllllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.PPP",
    ".......PPPPPPPPPllhEEhhllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "......PPPPPPPPPPPllllllllllPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "....PPPPPPPPPPPPPlPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "...PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "..PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.....PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPPPPPPPPPP.....PP.....PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPPP.....PP.............PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    ".PPPPPPPPPPPPP.....PP.....PP.............PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "..PPPPPP....PP.....PP.................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP......PPPPPPPlPPPPPPPPPPPP",
    "......PP....PP.....................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP...........lPPlPPPPPPPP",
    "......PP....PP..............PP..PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.......llllllllllPPPPPPPPPPPP",
    "......PP.............PP.....PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.........llllllllllPPPPPPPP",
    ".....................PP...PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP...........lllllllllPPPPPPPPPPPPP",
    ".....................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP............lllllllllPPPPPPPPP",
    ".....................PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP..............lllllllllPPPPPPPPPPPPP",
    "..............PP...PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP................lllllllllPPPPPPPPP",
    "..............PP.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP...................lllllllllPPPPPPPPPPPPP",
    "..............PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPll....................llllllllPPPPPPPPPP",
    "........PP...PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPlllll....................llllllllPPPPPPPPPPPPP",
    "........PP.PPPPPPPPPPPPPPPPPPPP..lPPPPPPPPPPP..PPllllllll....................llllllllPPPPPPPPPP",
    "........PPPPPPPPPPPPPPPPPPPP.....lPPPPPPPPPP....lllllllll....................lllllllPPPPPPPPPPPPP",
    ".........PPPPPPPPPPPPPPPP........PPPPPPPPPPP....lllllllll...................llllllllPPPPPPPPPPP",
    ".......PPPPPPPPPPPPPPPP.........PPPPPPPPPPP.....lllllllll..................lllllllllPPPPPPPPPPP",
    "......PPPPPPPPPPPPPPP...........PPPPPPPPPPP......llllllll..................llllllll.PPPPPPPPPP",
    ".....PPPPPPPPPPPPPP............PPPPPPPPPPP.......llllllll.................llllllll..PPPPPPPPP",
    ".....PPPPPPPPPPPP.............PPPPPPPPPPP........llllllll.................lllllll...PPPPPPPPP",
    ".......PPPPPPPP..............PPPPPPPPPPP.........llllllll................lllllll...PPPPPPPPP",
    "............................PPPPPPPPPPP.........llllllll................lllllll....PPPPPPPP",
    "............................PPPPPPPPPP..........llllllll................llllll.....PPPPPPPP",
    "...........................PPPPPPPPPP...........lllllll................llllll.......PPPPPPP",
    "..........................PPPPPPPPPP...........llllllll................llllll.......PPPPPPPP",
    ".........................PPPPPPPPPP............llllllll.................lllll.......PPPPPPPP",
    ".........................PPPPPPPPPP...........llllllll...............................PPPPPPP",
    ".........................PPPPPPPPP............llllllll...............................PPPPPPPP",
    ".........................PPPPPPPPP............lllllll................................PPPPPPPP",
    ".........................PPPPPPPP............llllllll................................PPPPPPPP",
    ".........................PPPPPPPP............llllllll.................................PPPPPPP",
    ".........................PPPPPPPP............lllllll..................................PPPPPPPP",
    ".........................PPPPPPP.............lllllll..................................PPPPPPPP",
    ".........................PPPPPPP.............lllllll...................................PPPPPPP",
    ".........................PPPPPP..............lllllll...................................PPPPPPPP",
    ".........................PPPPPP..............lllllll...................................PPPPPPPP",
    "........................PPPPPPPP.............llllll....................................PPPPPPPP",
    ".......................PPPPPPPPPP............llllll.....................................PPPPPPP",
    "......................PPPPPPPPPPPP...........llllll.....................................PPPPPPPP",
    ".....................PPPPPPPPPPPPP...........llllll.....................................PPPPPPP",
    ".....................PPPPPPPP................lllllll....................................PPPPPPPP",
    "....................PPPPP.PP.................llllllll....................................PPPPPP",
    "....................PPPP.....................llllllll....................................PPPPPPP"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    P: { m: "hollow", step: 4 },
    h: { m: "hollow", step: 2 },
    l: { m: "hollow", step: 3 }
  },
  idle: {
    // It does not breathe. Something in it rises and falls anyway.
    waist: 55,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, a band of it slips two pixels sideways, then back.
    twitch: {
      frames: [7],
      patches: [
        { x: 4, y: 29, rows: ["....__......PP............ll....................................................................P._.PP", "...__.......PPllhEEhh....ll................................................................PP", "..__.........PP........ll.......................................................................PP", "__...........P.l...........................................................................PP"] }
      ]
    }
  }
};
