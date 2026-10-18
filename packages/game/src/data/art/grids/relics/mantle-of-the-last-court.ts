import type { RelicGrid } from "../../relics";

/** A royal mantle with an ermine collar, its purple gone the grey of old ash. Painted, then traced. */
export const MANTLE_OF_THE_LAST_COURT: RelicGrid = {
  rows: [
    "..........dddddd",
    "........dddddddddec",
    "......dddddddccdceedc",
    ".....ddcdccffiiicddddc",
    "....cddggciiiiiiicdgccc",
    "....cdddgeiiiiiiidgdecc",
    "...cccddeeeiiiiidggdeccc",
    "...fcddgeeediiieecddcccc",
    "....fcceeececideeedddcc",
    "....iidccddcbcbeeeddcfi",
    "....iiicddfhhghicdcdiif",
    "...fiiiicabhhhhiffciibf",
    "...ficiiaccbihajfaiibbfc",
    "...ffciicccjjhjjcciibbbb",
    "..fffciicccjjjjjcciibbbb",
    "..ficcibcccjjjjjccfibdbbc",
    "..ficbibcccjjjjjccbiicbbb",
    "..ficfibcjcbjjjjccciiccfb",
    ".iifciibjjcbjjjjccciiccffc",
    ".iicciibjccbjjjjcccaijjffb",
    ".iicbiajjcjbjjjjcccaijjjbb",
    "iiijbiabjjjbbjjjcccfiijjaac",
    "aajjiiabjjjbajajcccbiijjaaa",
    ".ajjiiabjjjbaaajcccbiijjaa",
    "..jjiiajjjjbaaajjccbiiaja",
    "...j.aajjjbbaaajjccji.aa",
    "......ajjbbbaaajbbbjj",
    "........cbcb...bbb"
  ],
  legend: {
    a: { m: "court", step: 0 },
    b: { m: "court", step: 1 },
    c: { m: "court", step: 2 },
    d: { m: "court", step: 3 },
    e: { m: "court", step: 4 },
    f: { m: "ermine", step: 0 },
    g: { m: "ermine", step: 4 },
    h: { m: "gold", step: 1 },
    i: { m: "spot", step: 0 },
    j: { m: "spot", step: 4 }
  }
};
