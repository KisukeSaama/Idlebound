import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Whispering Bramble: it whispers the names of the walkers who bled on it; yours is
 * new. Briars knotted into a low crawling beast, green canes and old brown ones twisted over
 * a hollow of dark, clawing forward on bundled cane legs, a trail of runners dragging
 * behind. Every thorn is tipped dark red. Scraps of walkers' cloaks hang caught on its back;
 * two pale berries glow deep in the knot of its head, over a maw of thorns.
 */
export const WHISPER_BRAMBLE: CreatureGrid = {
  rows: [
    "....................................iihhhhhhh",
    "...................................ihhhhhcchihhh",
    ".................................iibbbbbhihhhhhhhhhhhh",
    "................................ihbbbbbbbbhihhhchhcchhhhh",
    ".............................iiihbbbddbbbaabihhhcihhhhhhhh",
    ".....................ll....ihccchhihhhbhbbbbehhhhhihhhhhhhh",
    "..................hhch....hchccbbbbbchhhchbbbfhhhbhihhhhhhhh",
    "...............bhhccchhh.hhhhbhhbaabbabchhbbhcaabbbiihhhhhhihh",
    ".............hbbbjhiiihchbhbhdhbgghkbabjhhhhcccaaabciihihihhihc",
    "...........hhbbhhbbbddihbbhhcdbhhhhbbhhkcaacccccaaaahiiihiiiiihhl",
    ".........ckhjcfhhfhbdddbbbbhhbghghhchhhaaacjcccchhhbbiiihhiiihhbl",
    ".........cccchhiidddbbaakbbbbhhcddddckbbbaajbbdccaaaahiihhiihhhbb",
    "........bhccchhhddbbadaabkbabchdcccckbbhbbhbbbddaaaaahiihhhihhchbhb",
    "......cbbkabbbcddeghhdaahbkcjciaaaackbhhbhhddbbdccbjjchiihhihhchahh",
    "......bhhkabggcdbddiidhbkakkjacchhbhbbhjhhddaaaddcbbachhichhhhchgbhb",
    "......bbchhkbkdafedddhhekaakkbbhhhchbbhccddaaaaadaabachhichhhhhhhbbh",
    ".....caaaabhkkjhEhgbdchcdhgakbbhhbhbbbccccbbaaaadcchbhhhhhchchhchbbbhc",
    "...bbbcgbbccbkkhiihdggccdhhcahccgbhcbbcddaccbbbjjcchahhhhhchchichabhb",
    "...bbcghbcccaajkhddagggbdddbbbcggbccbbddaadcchcacccaahhhihchchihhchac",
    "...bkkgbbccdgcajjddccdddcbgbkbcgabcdddddcadhcbaaacbaahhhihbhchihhbaacc",
    "..bbbjjbccadbhhccajkkjeacbgkkbbbabbaabbbcddbbbaajbaaahhhhhbchhiihcbbbbb",
    "...biacccaabdbhbchhbbkhccakkabbbabaaadbcadbbbbaajdaaahhhhhbchhihhhbbbbbb",
    "..bbhacccghfdbbciiiiaaahkkkjcdbbahaaddahkcbbccakdbbaahhhhhbchhihhhcbbbh",
    "...bbhhcciEhdbbgiEiigaaabjjjccbabbbbddahkaaackkkbababhhihhbchhihhhhbbbh",
    "...bbhicchihbdbghiiiggahbaaacalabbbcdbhhadcakkkbbaaabhhihhbchhihhhhhbbh",
    "....bhhcchhhbdcbbhhggahhbbacaababbacdhhabddkkbahbaabbhhihhbhhhiihhhbbahh",
    "....bbhcffggecccceegakhbbbbbaababaachbagbhkkbbaahaahbhhhhichhhiihhhcbaac",
    "....bbabbfgacccacccaddeaahbblllbbccbbbbhhbkbbdaaahhaabbahhcchbchhhhhcbaac",
    ".....baabbbcagbbbaacdfeabbbaaababaabbbhggbhbbddabbbaaaaabhccaaabhhhhcbacc",
    "......bbbbbbgabbbdaccbaabacaaababaacaahhakbabdbhbhaaaaaabhccaaabhchhccadj",
    ".....bbbbbbbggacdajcbbccbaagaaaabaabaaahkcbabbbbhhjaaaaaaabbaaaacchgejdd",
    ".......bbacbggacabjjaaaaalaaaaabbaabaaaabcbhbbhbibjcbbaaaabaaaaaacaaejcbb",
    "........baabbgcaabbbaalaaaaaaaabaaabbaaababbhhhchbjcbbaaaaaaaaaaaaaaaccbbd",
    "........bbbbbbeeabbbihaaaaaaaaaaaaabbaaacacbbhbhbbhcdaaaaaaaaaaaaaaaccbbbjd",
    "..........bbbbaabb.hhcaaaaaaaaaaaaaabaaaaaaaaachccchdbaaaaaaaaaabbbbaabccjc",
    "...........bbbbbb..hbaaaaaaaaaaaaaaaaaaaaaaaabccihcccbaaaaaabcaaaabbaaaahjcc",
    "...........bb.bb..bbbaaaaaaaaaabaabbaaaaaaaaabbhdddcdbbaaaabbiaaaffccccahccc",
    "............l..a..baaaaaaaaaaabbbaabaaaaaaaaaabdddbddbb.bbaabhifbffgcccccccc",
    "..................baaaaaaaaaaabbbbaaaaaaaaaaaadddcddbb..bbbabbbfbbaggaabcccbbc",
    "..................haaaaaaaaaa...bbbbbaaaaaaaacdddcbbb....bbabbbbbbaaaabbbbjbbccc......b.l",
    "..................haaaaaaaaa.....b....abbaabccddcffbaa..bbbbaabbbbbbbbabbbjkbbcccccc.bbll",
    ".................ibaaaaaaaaa............babbbcccccfaaabbb..baabbbbbbbaaaahjhbbbccbbbhbbb",
    ".................bbaaaaaaa................bbbchcaccaabbbb..baabbbbbbbbaaakbcbbbabbbbbcbbcb",
    "................bgaaaaaaa.................bbbihccccaebb...gaabbb...bbaaacahccbaaabbbbbbbcbll",
    "...............caaaaaaaaa.................bhhhdddbbbee....aaabb.......bbcbhccbbaaaaabbbbhcb",
    "..............baaaaaaaaa.................bcchdddabbl........g.........bcabbhcj....aabbbbhcb",
    "..........bbbbbaaaaaaaaaaa...............bccddbba..l..................aaacabcj........bdbcb",
    ".....bbbbbaaaaaaaaaaaaaaaaa.............bbbddbbcc...................baaabbabbbb.....hjjjbbb",
    "...ebbaabbbaaaaaaaaaaaa................bbbdddkbc...................bbaaabbaabbee..llhhbbb",
    ".lleaaeabbbbaebbbbaaaa.................bbbacccbb...................bbbbblaaalbeb.lllbbbb",
    ".lleeeeabaaaaeebbba..................cccbbhaccbbb......................bla.all.llllbbb",
    "....elebbb.bbeeb..................bccccccjhcaaaa................................l",
    "...........bb...............bchccdbbbbddchjhaaab",
    ".........................lbhbcccccbbbdhbchccbabbb",
    "........................llbbbbhhhcbbbhhbbbbbbb",
    ".......................bbbbbllbccbblbbbbbelb",
    ".......................b...llbbbbbllbbbbbela",
    "...........................lbbb...lle....al",
    "...........................l......l",
    ""
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "cane", step: 0 },
    b: { m: "cane", step: 1 },
    c: { m: "cane", step: 2 },
    d: { m: "cane", step: 3 },
    e: { m: "cloth", step: 0 },
    f: { m: "cloth", step: 1 },
    g: { m: "cloth", step: 2 },
    h: { m: "cloth", step: 3 },
    i: { m: "cloth", step: 4 },
    j: { m: "green", step: 0 },
    k: { m: "green", step: 2 },
    l: { m: "thorn", step: 1 }
  },
  idle: {
    // A creeping breath: the knot of the back swells and settles like something listening.
    waist: 50,
    breath: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    // Once in a cycle, the trailing runners drag a little further.
    twitch: {
      frames: [6],
      patches: [
        { x: 60, y: 20, rows: ["_.h.ihc....b", "_.hi..h.....b", "_.hi..hc..bh", "_.hi...h..bh", "_.hi....h.bh", "_.h.i..h.ba.h", "_.h.i..hcb.ac", "_hbc....hcb.ac", "_..ab...hcba.c", "_..abhc.h.cadj", "_...a.chgej.d", "_....ac.aejc.b", "_........a.c.bd", "_.......a.c..bjd", "_...a...b.ab.cjc", "_bc...a.b...ahj.c", "_bi..a.f...cah..c", "_bhifb.fg.......c", "_..bf.ba.g.ab..c.bc", "_.....b...a...bj.b..c....._b_l", "_.a.......ba..bjk.b.....c_.b.l", "_.a......b...ahjh..b.c..bh..b", "_.a.......b..akbc..ba....bc.bcb", "_a..b.._.b..acah.cb..a......bcb.l", "_a.b......_.bcbh.c.b....a...bhcb", "_g........_bca.bhcj..._.a...bhcb", ".........._..acabcj......._bdbcb", "........_b..a.ba...b...._h..j..b", "......._.b..a.b.a.b.e._.l.h..b", "......._....bl..albeb_..l...b", "..........._bla_a.l_...l..b", "...................._l"] }
      ]
    }
  }
};
