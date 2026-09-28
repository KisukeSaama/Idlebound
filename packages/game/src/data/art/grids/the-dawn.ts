import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Dawn (BIBLE 3.9, 8.8): the guardian of stage 3000, the edge of the night. It does not
 * attack; it only grows. A thin horizontal line of pale light hanging at the height of a
 * man, white and three rows thick in its middle, thinning to one row of pale, lilac and
 * haze toward its ends; above and below it, its glow in rings of regular dither that reach
 * furthest over its middle. It has no eyes: the whole line is the light.
 */
export const THE_DAWN: CreatureGrid = {
  rows: [
    ".........................................d.d.d.d.d.d.d.d.d.d.d.d.d.d.d.d.d",
    "",
    "...........................d.d.d.d.d.d.d.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.d.d.d.d.d.d",
    "....................................n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n",
    "...........d.d.d.d.d.d.d.d.n.n.n.n.n.n.n.m.o.o.o.o.o.o.o.o.o.o.o.o.o.o.m.m.n.n.n.n.n.n.d.d.d.d.d.d.d.d",
    "............n.n.n.n.n.n.n.n.n.n.n.n.m.m.m.m.o.o.o.o.o.o.o.o.o.o.o.o.o.o.m.m.m.m.n.n.n.n.n.n.n.n.n.n.n.n",
    "...d.n.n.n.n.n.n.n.m.m.m.m.m.m.m.m.mmmmmmoooooooooooooooooooooooooooooooommmmmmm.m.m.m.m.m.m.m.m.n.n.n.n.n.n.d.d",
    "..mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "dnhhhhhhlllllllllPPPPPPPPPPPPPPPPPPEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEPPPPPPPPPPPPPPPPPPlllllllllhhhhhhnd",
    "..mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "...d.n.n.n.n.n.n.n.m.m.m.m.m.m.m.m.mmmmmmoooooooooooooooooooooooooooooooommmmmmm.m.m.m.m.m.m.m.m.n.n.n.n.n.n.d.d",
    "............n.n.n.n.n.n.n.n.n.n.n.n.m.m.m.m.o.o.o.o.o.o.o.o.o.o.o.o.o.o.m.m.m.m.n.n.n.n.n.n.n.n.n.n.n.n",
    "...........d.d.d.d.d.d.d.d.n.n.n.n.n.n.n.m.o.o.o.o.o.o.o.o.o.o.o.o.o.o.m.m.n.n.n.n.n.n.d.d.d.d.d.d.d.d",
    "....................................n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n",
    "...........................d.d.d.d.d.d.d.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.n.d.d.d.d.d.d",
    "",
    ".........................................d.d.d.d.d.d.d.d.d.d.d.d.d.d.d.d.d",
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
    E: { pal: C.moon, glow: true, light: true },
    P: { m: "light", step: 4 },
    d: { m: "light", step: 1, over: true },
    h: { m: "light", step: 2 },
    l: { m: "light", step: 3 },
    m: { m: "light", step: 3, over: true },
    n: { m: "light", step: 2, over: true },
    o: { m: "light", step: 4, over: true }
  },
  idle: {
    // It does not breathe. Its glow swells upward and settles.
    waist: 8,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, it grows a pixel longer at each end, then settles.
    twitch: {
      frames: [9],
      patches: [
        { x: -1, y: 8, rows: ["dnh..............................................................................................................hnd"] }
      ]
    }
  }
};
