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
    ".......................b",
    "...................blbbbbb",
    ".................bcbbbggbbaaa.........aaa",
    "...............bbcccggggggbbbba....bbcaaaall",
    "..............bccggggghhggbggbaadaabbldaiilll...gaa",
    ".............ccggghhghhhhgggbbaaaabbleccladaagggcball",
    "............chgghhhhhhhhhhggbbbbaibiaaallfdchgcccbbbaa",
    "...........chgghhhhhhhghgggbbbbbaaiiaaiiibfhhhggbbbaaaa",
    "..........ccgghhhcceeeggggbbbbbbbaaiiiblibahhhhgggbbbaa",
    "........dccchhhhhcceeebbaabbgbbbbaiiiiilbiighhhhhggbbbaaa",
    "........ccchhhhcccdiiikkdgggggbbbaaalibbiiiachhhhgggbbbaaa",
    "........cbghhcccccaEEkkdcgggbggbbbaaabiiiiallghhggggbbbbbba",
    "........aghhcceccaaccadececgbbcbbbiaibbjjiallbhhggggbbaabaaa",
    ".......aaagceeeedjaccadececgaabbbfibilcjkkklibchhhhggbbabaaa",
    ".......aabbbccbjjjiaaddccchgbbbbbbbbjjcadedaaibchhhhggggaaaaa",
    "......bbcbblkljkddddddcccchgabbballbjkaadeekiiichgbcgbggbaaaaa",
    ".....bbccbbbbbbbbddddccchhhcabbbalbbjklcbecclllbghbbbbggbbbaaaa",
    "....bcccbccccbblllkdccchhhgaabblljbbkdbcacccdjlbbhhhcbbgabbbaaaa",
    "...bccccccbiiiiiaaechhhhhggbbaaakjckkdcacbdcdjlibhhgggaaabbbaaiaa",
    "..bbcbbbliiiiiiicaehhghggggbbijjklclkcblclkkkjiiicchgggaabbballaa",
    "..bbbljjjjiiiijbbleccccbbbgbcbjdkjcldcddcljjkkiiicchhggggbbbbaaa",
    "..blii...jiiibbbblbeedddbblbbllkdlciedddabjiiiiiiahghbhgggbbbaaa",
    "..........iilbbllffaabbadabfikkdklbjdkdkbbiiiiiifigchghgggbagaaaa",
    "..........libbliiffkkjffaabfkkddkbbjdkklibiiiiiifichcgghggbaaaaaa",
    ".........lllbbiffiijjjkkafffkddddacjdkddbbiiiiiiaiahhcaggggbaaaaaa",
    ".........bllbaiiffffjkkkjffikkdddbbjjdcdbbiiiiiiiiichhgbgggbaaaaaa",
    ".........blblcafiffaffkdjjaikccdebbijccbaaaiaaiiiiiahghbbggbbbaaaaa",
    ".........baalcafiffaffjkkjbkkbceefbjccbbiabiiaiiifiihhggaacbbbaaaaa",
    ".........ba.acafiffiiijkkjbibbcekjclcbciiibiibiiifiicggggaaagbbaaaaa",
    "............bcaiifiiijjjkjbjkbckkbblbcaidfbikbiiifiiahggggabgbbaaiia",
    "...........bcbiiidiaiikjkjbjkbbklbbbbiiidbblbaiiifiiighgggbbgbbaaiiaa",
    "...........bcafiicfiiikkjiblbbccccbiiikkkiblbiiiifiiibhggggagbbbaaiaa",
    "...........ccafiiiffafaabbcccbaaaiiiikeddebbiiiaiiiiiahhgcggaiaaaaaiaa",
    "...........cbfiiiiiiffffaiiiiiiiaaibieeecbbbikaajiaiiichgcggbaiaaaaaiaa",
    "..........ccbfffiififiaajjiikkdedaickeeediibjkbijiaiiichhchgbaabbaaaall",
    "..........ccffffiifffiijjjbadddkkedcaedkkkibjbbijifiiiahgbggbbabbaaaaa",
    ".........bhbiffiiiffflljkkbadjkkkdabffkkkkibbbijkjfiiiahgbbbbgbbbaaaaa",
    "........bccaiafiiiiiflldddbbbdkdddkbakddddbbljjjkjiiiiigggbbbgbbcaalaaa",
    "........bcciialiiiiffaaaikbbbdeeeddaakeeeefbljjkkjiiiiigggbbfgbagballaa",
    "........bcbiialiiiiffaiiddlbbdkdeeeabdeedjjlljjkiiiiiiiggggcigcagbaalaaa",
    "........cciifaiiiiiffaidellclddkkjllbffjfjjaaaalbiiiiiiagggcabgabbabaaaa",
    ".......bcaiifiiiiiiifaaakkkcldcdedjibijjkbkiaablliiiiiiaggggaaaabbabaa",
    ".......gbiiiiiiiiiiiiilikkkbldecdcdjbadbbbbbaaiiiikiii..cgbgaaiabgaaba",
    "......cciifffiffifiaiilikkkbadaccbclaacccbbiiiidddkkiii.cgbgaaabbgaaba",
    ".....bcbiiffffffififfflllllaaaabbbcccaaliiiiiideeedffff.chbbbaaaggblbba",
    ".....gbififfafffaffffffaabbbbbbaaaliiiijjjjiajeeeedffff.bhggbbbiacblaba",
    "....bbaiffffafffafffffiiiififiiiiijjiijkkkkibdeeeedfffi.ahbbbabaabbiaba",
    "....cbfffffaafaf.fafkkiijjjifiiikddklbjdkkkiadeeeedfffiaahcbbabbibbiaba",
    "...bcffffafaafaa.aa.kdkaijjjaajkkkdkjbjkkkkiadeeeekfffiifhgbbabbaabaaba",
    "..bcfffafafaffaa.....kkiiiijaajjkkkkjbjkkkkllkdeedkffffifhgababbaibiaaa",
    "..bbfffaffaaaaa.......kffiiiaajjkkkkiajkkkilijjdddkjfffffcgabbbbblffaal",
    ".bbfffaaaaaaa..........fffiiiffiiijiiffjjiiaijjkkkjjjjfffcgaababbbffaaa",
    ".baaffaaaaaa............fffiiffiiiiifffiiiiiiifkkjjjjjfaaccaababbbaiaa",
    "abaaaff.aaa..............fffiiffiiiiaafiiifiiifffjkkiifaaccaabababalla",
    "aaaa.....a................ffffiffiiiiiffiffiia.ffkkkifaaaccaababaaaala",
    "aaa.........................aiiiifffffffff......ffiiifaaabbaabbaaaaa",
    "aa..........................affiiii..............fiiff.a.bcaabbaalaa",
    "..........................baaaffiif..............fjjff...acafbbaalaa",
    ".........................bbaaaffifff.............ffakf...abafabaaaaa",
    ".......................abbadkjkjjjkkf............kaakf...abalabaa",
    "................kkkffkddkkdkkjkjjjfff...........kdeddf....allabaa",
    "...............ffkdddkkkddkkkjff...............kkddkdf....aa.abaa",
    "..............faffkkkkkkkkkk..................kdkekkdf.......aba",
    "..............aaffkjjjaffkk..................kkkkdjkek........aa",
    "...............a......aff.................kkkkkkaajkddf",
    "..........................................kkkjkkdjjkkddf",
    ".........................................adfkjkkdjjkkdkk",
    ".........................................fff...aaj...fff",
    ".........................................af....aaf....ff",
    ""
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    a: { m: "beak", step: 1 },
    b: { m: "beak", step: 2 },
    c: { m: "beak", step: 3 },
    d: { m: "bone", step: 1 },
    e: { m: "bone", step: 2 },
    f: { m: "feather", step: 0 },
    g: { m: "feather", step: 2 },
    h: { m: "feather", step: 3 },
    i: { m: "shadow", step: 0 },
    j: { m: "shadow", step: 1 },
    k: { m: "shadow", step: 3 },
    l: { m: "skin", step: 0 }
  },
  idle: {
    // A shallow, laboured breath: the chest heaves against the bars.
    waist: 48,
    breath: [0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    // Once in a cycle, the plucked neck cranes further forward.
    twitch: {
      frames: [6],
      patches: [
        { x: -1, y: 0, rows: ["........................_", "....................___.___", ".................._bl..bb.____", "................_..bbb..bbaaa___", "................b.cc...gg.b.bba____", "..............b.c..gg...ggb...a.d._", "..............c..g..g....gg.b.aaa._", ".......................h.h......ai_", "............h.....hhhhgh........aa_", "........._..gg...c.e..ggggb..b...a_", "........d.......h..eeebbaabb.bb..a_", "........c.ch..h...diii...g...gbb.a_", "........cb.....c...EEkk.cgggbggb.._", ".........ghh.c.ccaac.adececgbbc..._", ".......a..gceeeed.acc..e.e.gaa...f_", ".......aab..ccb.jjiaa.....hgbb...b_", ".........b.lkljkdd.......c.gab..al_", "......b...bbbb..bddd.......c.b..a._", "........b..ccbblllkd.cc....aa.bllj_", "....c.ccccb.....aaec..h.h..b.aaakj_", "..b.c.bblii....icaehhghggggb.ij.kl_", "..b.bljjjji...j..leccccbb.gbc.jd.j_", "..blii...ji..b..b.beedddbbl.bll..l_", "..........iil...lf.aabbad.bfi...kl_", "...........ib.l.i.fkk.ffa.b.k...kb_", ".........ll.b.iffiijj...af..kdd..a_", ".........bl..aii.f..jkk.jffik.dd.b_", ".........blblcafif.af.kdjjai.ccd.b_", ".........ba.lcafif.affjk.jbkk.ce.f"] }
      ]
    }
  }
};
