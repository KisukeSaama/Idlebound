import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hollow Canary (BIBLE 8.3): the miners' canary; it stopped singing the day the air
 * went bad, and it sings now for nobody. A big gaunt canary, hunched, wings mantled in
 * threat, its dull yellow feathers falling out; the dented brass cage has grown into its
 * body, a ring round the shoulders and one round the belly, the bars bowed over the bare
 * dark chest like ribs and sunk into the flesh. A plucked neck craning forward, the beak
 * gaping, and under the hard brow an empty socket with a cold point of light in it.
 */
export const HOLLOW_CANARY: CreatureGrid = {
  rows: [
    ".............................................fff",
    "............................................fffff",
    "...........................................fffffff",
    "...........................................fffff00",
    "..........................................gffffx0",
    ".........................................fgffffx0...............tt",
    ".........................................ffffffxxggg.....ttttttt0",
    "........................................gffffffffff00..tttttttf0",
    "........................................ggffffffff00.tttttttggff",
    ".......................................ggffffffffxxttttttthhhghtttt",
    ".......................................gfffffffffttttttthhh....httttt",
    "......................................ggfffffffftttttthhhhhhg.xxxxxx",
    "......................................gfffffffftttthhhhhhhhhgxxx",
    ".....................................ggffffffttttthhhhfhggxxxggh",
    ".............ttt.....................gffffffftttthhhhhhhxxxggghhhh",
    "............hht..ttf.................ffffffffttthhhhhhhxxggfffffhhg",
    "...........hhhttghg.................ffffftttttthhhhhhxxxgggfxxxxxxx",
    "..........hhhhggtttttthh............ffffftttthhhhhhxxhhhhhfxx",
    "........ttttttttthhhhhff............ffftttttthhhhhxhhhhxxxxhhh",
    "......tttgggggggghgf...............fffttttthhhhxxxhhhxxxfgghhg",
    "......gggghhgxxggfff...............ttttttthhhhhxhhhhxxgffffffgg",
    ".....Pggtxxxxxxghhgfbbb........tfhhtttttthhhhhhhhxxxxggfxxxxxxx",
    "...PPPPtxxxxExxhhggfbbbbbhhhhhttffhtttthhhhhhhxxxggggghgx",
    ".PPPPttttxxxxxhhhffaaabbhhhhhgttfftttthhhhghhxhhgggggxxxh",
    "PPPttttttbbbbhhgfffaaaaaffhhhgftttttggfhhhhhhghgxxxxxffghh",
    "PPtgggxxxxghhhhggffaaaagffgggfgttttggghhhhhhhxxxgxxx0xxx00",
    "...xxxxxxggghhgff000aaagfggfffgttthhghhhhhhxxhhhggg",
    "....xxxxxxgggggfxx...aaaggggfxxbfhhhhhhhhhhgggghggg",
    "...xPPtttgggfffxx.....aaxfgfff0ghhhhhhhhhhgggfxxxxx",
    "...tttttggfffxxx......taafxaaa0ggghhhhhhhgffffxxfff",
    ".....................GGGaaaaa00ggggffgghgffxxxxxxxx",
    "....................GGGGGa000aaagggffffggfxxfffxx",
    "....................ggbGGaaGaaaafffgggggfxxgfffff",
    "....................ggbGgaaGaaaaGxxfffffxxhhfffgf",
    "....................GbbGaaaGaaaGGaxffffxxfGGgffff",
    "....................GbGGaaaGaaaGGaxggffggggGgfffx",
    "...................GfbGgaaGGaaaGaaa0gGggggbGfffxx",
    "...................GgbGbaaGGaaaGaaafgGffgbbGfffxx",
    "...................GhbGbaaGaaaaGaaafhGfxgaaGafffx",
    "...................hhbGbaaGaaaaGaa00hGfxgaaGafff0",
    "...................GggGbaaaaaaaGaa0xgGfxvvvvaffx0",
    "....................GfGhaaaaaaaGGa00gGffvvvaxxxxx",
    "....................GfGhaaaaaaaGGa0ggGfgfff0xx0xx",
    ".....................GGGaavbaaaGGa0ggGggfxfxx00x",
    ".....................GfGGvvbaaaah00fabffxxfxx00Gg",
    ".....................GGGGaabaaaaG0xx0bafxxGhxxGGggg",
    "......................GGGaaGGaaaG00xfbxxxxGhGGGfgggg",
    ".......................GGGaaGaa0G00xfhxx0xxGGGffgggggg",
    "........................GGGGGaa0GhxxxG00xxGGGffgffggggg",
    ".........................GGGGG00GhxxxG0GGGGGfxggggffggggg",
    "..........................GGGGGGGG0xGGGGGGfffx.ggggffffgggg",
    "............................hhGGGGGGGGGffgfffx..gggggggffgg",
    ".............................ggxxfGGxxxggggffx...gggggggffgg",
    ".............................hgggfx....ggggffx....ggggggggggg",
    "............................hhgggfx.....gggffx....ggggggggggg",
    "............................hgggfx......ggggfx.....ggggfggg.gg",
    "............................ggggf.......ggggfx......gggfggf..gg",
    "............................bbbfx.......ggbbfx.......ggfgggf..gg",
    "............................bbaxx........bbaa........ggf.ggf...g",
    "............................bb0x.........bb00........ggf..ggg",
    "...........................00a0.........00a...........gf...gg",
    "...........................b00..........b00...........gf...gg",
    "...........................bb0..........bb0............gf...gg",
    "..........................bb0..........bba.............gf....g",
    "..........................baa..........b0a.............gg....gg",
    "..........................ba...........b0...............g.....f",
    ".........................bb0..........aa0...............gx",
    "........................bbb..........bbb................gf",
    "......................bbbabax......bbbbaax",
    "....................xxxaa...xx...xaxaa...xx"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    E: { pal: C.shardLight, glow: true },
    G: { m: "feather", step: 3 },
    P: { m: "bone", step: 3 },
    a: { m: "skin", step: 0 },
    b: { m: "skin", step: 1 },
    f: { m: "feather", step: 0 },
    g: { m: "feather", step: 1 },
    h: { m: "feather", step: 2 },
    t: { m: "beak", step: 3 },
    v: { m: "shadow", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // A shallow, laboured breath: the chest heaves against the bars.
    waist: 48,
    breath: [0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    // Once in a cycle, the beak snaps, as if to sing.
    twitch: {
      frames: [7],
      patches: [
        { x: 3, y: 27, rows: [".PPtt", "ttt", "..gg_"] }
      ]
    }
  }
};
