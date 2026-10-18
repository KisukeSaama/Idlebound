import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Mourning Owl (BIBLE 8.2): it asks one question, over and over; the answer is always
 * a name. A great horned owl of the Wychwood, its feathers ragged and barred, the wings
 * mantled high in threat, talons clamped on a root. A veil of grey moss has fallen over its
 * head like a widow's veil and hangs in strands to the breast; under it, two huge pale
 * eyes.
 */
export const MOURNING_OWL: CreatureGrid = {
  rows: [
    "..........................................................bb",
    "........................................................ffbb",
    ".bb...................................................ffffbb",
    ".bbbc...............................................cccafbb",
    ".beefb.............................bb..............gcccaaaabb",
    "..eeecc...........................aab.............ggcccaabbbbb",
    "..eeeccgg........................faac............gfbbccaabbbbb",
    "aaaaaccggg.............kc......fdaaa............ggfbbbaaabbbb",
    "bbaaaaccgg..aab....kkklkkkkc.fddaaaa...........edccbbbbaaaaab",
    ".bbaaaacddd.aabb.kkkkllkkkkkfddaahh............fdccaabbbbhhhbb",
    "..baaaaaddddaaackkkkllllllkadeeaahh............cdcbaaabbbbbbbbbb",
    "..baaaaaadddgaakkkkkllllllcaaaaahh.............cddbcaabbbbbbbbbfb",
    ".baaaaaaaaddcackkkkkllllllaaaaaah..............ddcccaabbbbbbbcee",
    ".aaaaaaaaaaccckkkkkkllllkkaaaaaakc.............cdcbbaabbbbbbbcee",
    ".baaaaaaaaaccaclkkkklllklbbdddakkkc............cdbbehhacdbbbaaabc",
    "..aaaaaaahhaaaakkkkkkkklbbbkdddakkk............ddbeehaaccbbbhabbcc",
    "..aaaaaaahhaaaaakkkkkklbbklbkddbkkkc...........dcbbaaaacbccbhhbbccb",
    ".beeaaaaaaaaaaieekkkkkbkcWWkkddcckkk..........fdcaaaaaaabcdbhhhbbbbf",
    ".bbeaaaaaaaaaaiibcckkkkklWlkkddcbkkkc.........gdcaaaaaaabddcbbbbb.bf",
    ".baaaaaaaaaaaabbkcckkkkelldddddcbkkkk.........gdbaaaaaaaaddchbcbb",
    "...aaaaaaaaacabbbeeddllkdddddddcckkkkc.......gccbbcaaaaaaacahhcbbb",
    "...aaaaaaaaaaabkiedddllllddddddakkkkkk.......gccbbbaahhaaacchhccee",
    "...aaaaaaaaaaabkibdddkklkldddddbkkkkkcc.....ccccbbcaaaahaacbbhcceh",
    "...aaaaaaaaaaabbbbddcckkkkkdddakkkkkkkkkc.dddccbbaaaaahhhaaccahcch",
    "...baaaaaaaacaabbbdcklkkkkkkkakkkkkkkkkkccdddcaaaaaaahhhccccdahccc",
    "..bbaaaaaaaaccaccbeblcdbckkkkllkklkkkkkbbccddaaaaahbahiiccccdeecc",
    "...bbaabaaaacbcccaekbcbbkakkkklkllkkklkabdbbaaaaaahbbbjibccceeebc",
    "....bbabbaaabbkckaabbbbbkakklkkllllllcaabbaaaaaaaabbbbjjbccccc.bb",
    "....bbabbaaabckblaaabbbbkaalllkkllllbbbaaaaaaaaaabbaakjjadcccc",
    "....bbabbaaacckelbbbbbkakbbklllkkkkeebbeaaaaaaaaaabajkkaadcccce",
    "....baaebaaakccakbbkbblkkdbcklllkaedebeeaaaaaaaaaaajjkkhhccacce",
    "......aebahakbcakckkcddkkddbkklllceceeeaaaaaaaaaaiijjjjhheeabce",
    "......eecahbbbcbkkklccdkkccekalllcccadeaaaaaaaaaaiiijjjcccaabce",
    "......ehcaaabccbkklldadklcddkakllccbbceaaaaaaaaaaiijjjjcccaabcc",
    ".......hkaaabkcakellladklcadkacklccbbcccaaaaaaaaaiijjjccccabbc",
    ".......ccaaaakcckallledclddakaaklbbbeccccaaaaaaaaiijjjcccbbbbc",
    "........caaabbbblblfdfcclddekcaklcbaeccacaaaaaaaijjjiacccebbbc",
    "........kahabbbakcldddckkeddldcclccaabcccedaaaaiiijiibbbcebbbb",
    "........k.habbaakdddddddladdddcckaahhhbcceecaaaiijjiibebbbb.f",
    "..........hhbbaakkcldddgldeckddkkaaahhbaceheebaiiijjbbebbbb",
    "...........hcbabkkklflkklddckddckaaaabbaaaheebaiiibbbbecbcb",
    "............ccabkkkkkckllfdckackgaaaaaaaaaacaaaaii.bbbbccc",
    "............kkabkkkkkkkkkdddddakgaaaaaaeeeaaabaa...bbbbbcc",
    ".............kaakakkkkkkkkddddccgdaaaaaaebbaabbb...bbbbcc",
    ".............kcacaaikkkkkkdadddckddaaaaaaaacaacbb..bbbcc",
    ".............kcbbaakakkkkkddfddggaddaaaaaaaacaaaa....bcc",
    ".............kkbaabakkkkkckkkacggeedccaaaaaacaaaa....bb",
    ".............kkbbbbaakkkkkkkkbbgddadddaaaaabbaaaaa",
    ".............kkcckbaaikkkkakkkbfdddacddaaaaaaaaaaa",
    ".............kkk.k.bbbkkikiikbkkkdddacccbaaaaaaaaa",
    "..............kk...bbbciiiiiikikkacddaccbaaaaaaaaaa",
    "..............kk....bbciiiiiiiikkkcdddaccbaaaaaaaaa",
    "..............kk....abcaaiihhiickkkdddbccbaaaaaaaaaa",
    "..............ck.....bbaaaahiiihcklldddbcbabbbaaaaaa",
    "..............kk.....bbaaaaaaahhckkdddddbbabbbbaaaaaa",
    "..............kk.....bbbbbbaaaaaaibdddddbbbbiiiaaaaaa",
    "..............kkk....bbbbbaahaaaaikkddkbbbbbbibbaaaaaa",
    "...............k........bbaahaaagiibkbkbbbbbbbbihhaaaab",
    "..........................haaaaa.ibabbbbbbbbbbbiihhaaabb",
    "..........................eeeebb...aabbbbkkbbbbbihhhhaaa",
    ".........................eeeee.....fdcbbf...bbbbbhhhhaaaa",
    "........................eeeee......ddcc.....bbbbbeahhhaaaa",
    "........................ecce......cddc.......bbbbaaahhiiaii",
    "....................b..bccce......dddc.......bbbiaaahiiiiik",
    "................ckcbbbbccccaaa...cdddc........bkiiahhikikkk",
    "................ccccbbcccccaaeecccddde..cccc...ikiiibbikkk",
    ".............eeeabgaacccaaaaaeeccdddddaacccff...iiikbbikbk",
    "............eeeaabbaaacaaaaaaeeedddggggaaaaff......kikibf",
    "..............eaeeeaaaaaeeaaaaeeddbggggeaa.bfff",
    ".............caaaaaaaaaaeecaacekkdaaffeeae...f",
    "...........cccaaaaaaaaaaccccccekbcaacceccee",
    "........cccceee.ffaaaacdcaaeeeaaaaaaccaaccce",
    ".......eeeeeee...f.facaaaaaaeaaaaaaaacaaaccee",
    ".......b.e........fcbbbeeecee..aaf..acc.aeecccb",
    ".................cccbb..ccc....f.....cc...ecccbbc",
    "...............ecccaa...c..................eceeecc",
    "..............feee............................eeee",
    "..............ee"
  ],
  legend: {
    W: { pal: C.moon, glow: true },
    a: { m: "feather", step: 0 },
    b: { m: "feather", step: 1 },
    c: { m: "feather", step: 2 },
    d: { m: "feather", step: 3 },
    e: { m: "moss", step: 0 },
    f: { m: "moss", step: 1 },
    g: { m: "moss", step: 2 },
    h: { m: "shade", step: 2 },
    i: { m: "shade", step: 3 },
    j: { m: "shade", step: 4 },
    k: { m: "veil", step: 2 },
    l: { m: "veil", step: 3 }
  },
  idle: {
    // A slow, puffed breath: the breast swells and the veil lifts with it.
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, the head turns under the veil, asking its question.
    twitch: {
      frames: [7],
      patches: [
        { x: 15, y: 8, rows: ["...._..kl...kc_f.d...a", "_b_...k.l....kf.d.a.h", "_c...k.....lkad.e.a.h", "_....k.....lc....a.h", "_....k.....l.....ah", "_....k...l.k.....akc", "_l...k..lkl.b..da..kc", "_.......kl..bk..da..k", "_a.....kl.bklbk.db..kc", "_.e....kbkc.W.k.d.c..k", "_ib.c....klWl.k.dcb..kc", "_bk.c...ke.l....dcb...k", "_.b.e.d.lk......d.c...kc", "_kie..d...l.....da.....k", "_kib..d.klkl....db....k.c", "_..b.d.c....k..da........k", "_..bdckl......ka.........k", "_.cbeblcdbc...k.l.kl....k", "_.caekbc.bka...klk.l..klka", "_ck.a....bka.kl.k.....lc.a", "_bl..a...bk.a..l.k...l..b", "_el....bkak.bk..l...k.e.be"] }
      ]
    }
  }
};
