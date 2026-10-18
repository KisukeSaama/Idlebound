import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Toadstool Choir (BIBLE 8.2): seven mushrooms, one song, entirely out of tune. Toadstools
 * of every height grow from one knot of roots, their caps warted and rust-red,
 * their pale stems bowed toward the company. Under each cap the gills glow like a throat;
 * under the gills, two small bright eyes and a mouth gaping on a note. The tallest one's
 * cap is torn.
 */
export const TOADSTOOL_CHOIR: CreatureGrid = {
  rows: [
    "........................................abbbbba",
    ".....................................kkabbbcccca",
    "....................................llabbbbccccb..b",
    "..................................aaaaabbccccccbbbcba",
    "................................aaaaabbbbbcccccccccccb",
    "...............................abaaabbbbcbbcccccccabbcba",
    "..............................abbabbbbbbcccccccccbbccbcba",
    ".............................aallaaabbbbcccccccccccbbbbcbbb",
    "............................llllldaabbbbcccbccbccccccbccbcbb",
    "..........................abaklabbdabbbbbbbbbbabccccccccccbcb",
    ".........................abaakaabbbaaaaaaaaaaaaaabbbbbbbbcbbcbb",
    "........................adaaaaaabbljjaakkkaaaakaacbbbaaabbbbbbbb",
    ".......................abaaaaaaahllllljkkkkkkkkkhccccclllliabbbb",
    ".......................bjaaaakkllldbcbjjllkkEkkkEcccccddlllllaab",
    "......................bbbjjllllllldbcckllllahbchbccccbdllllllkab",
    "......................bkkkllllllddbccckllllhhhhhbcccbbdllllllkaa",
    "......................bkkklllllldcbbcbbkkllhhhhhbbcccbbdllkkllaa....hhaaaaabagg",
    "......................kkkkkllllbcbbbcbblllhhhhahbbccbdldllllaaa..aaabbbbbbbccbbb",
    ".......................akkllllbbbbbbcabbllahhhaabbbbddlllllaaaabbbbbbbbbbccccccbba",
    "........................kkkkllbbbbbbcabalbhhhaaaabbddlllabbbbbbbbbbcbbabcabcccccbba",
    ".............aaa.l........kkkkkbbbbbbabbdbhaaaaaacaaa.abbbbbbbbcbbccccbccbbccccccbba",
    "..........aallllllkkkkaaa......aaaaaibbddbbbcbcbhba..aabaaaabbbbabbbccccccbccccccbha",
    "........abaaabbbaaaiiiiiaaa..........bbedlbbcbccbbb..kaaaaiijhjaaabbbbcccccccccccbbaa",
    ".......adaabbbbbbabaaaaiiiaaa.......abbeelbbbbbbbbb..killllllllllaaaabbbcccccccccbbaba",
    "......adaaabbbbbbbbbbbbbbaaahh......bbdeeekkddbbbee..aiklllllllllbbbbaaaabbcccccccbabba",
    "......daabaabbbbbbbbbbcccbbbaahh....bbdeeedddddeeeeg.aaklddbbblllbbbbbacabaabbbbccbbbbbb",
    ".....bbabacabbbbbbbccccbbbaaabhhaa.abhhaeeaakddkhddh..aklllbbblllllbikkkbbakaaaEbbbbabbb",
    "....adaaabEEbbbbbccbbakkblllilhhaaaaahhaaakkkkkkhhh....alllbbbbbdddjjkklkkkkkabbaabbabbba",
    "....ddabbjbbbbbbbbajjlkllllllllllaaa..aaaakkklkkh.......llllbbdbbbbjkklllkkkkaabcbaabbbbba",
    "...addabbbbbbbbaijjlkllllllllkklllaa..baabddddllh........aallddbbbbakkllllgcaaagcccbbaabab",
    "...ddaabbbbbaakkkiklkkllllllldllllkaa.babbdddeeea..........allddbbaaddddlhccaaaccccbdllabba",
    "..ddaaaabbaiiakkkkkkkklhklllldddllka..bbbddefffeg...........aakkdabbddddhhhEahbcccccdlllibb",
    ".bbaaaaaahikklkkllllkllhklllllllllkk..bbbdeffffed.........aaaaaaaabbdddhhhhhahbccccbdlllkaa",
    ".bbaaaaaahikacblllllllllkkkllllllkk...bbdeefffffd......jjaaabbbcbaadedehaahaaaacbcbbblllkaa",
    "abiaallbbahhacchllllddllkkkllllllk....bbdeefffffd...kkkaabbbcccccbhdeeehaahaabbbbbddddlaaa",
    "bbiilllbbahhhbhhhdddeeedddjjlllll.....bbdeefffffd.aakkabbbbcbcccbbbdeeehaaaaabbbblllbaaa",
    "bkkllldddkkhhhhhhheeeeeeeeddhhk.......bbdeeeffffkjjjklaabbbbcccccccbdeebdaaaabkkaaaaaa",
    "kkklllldlkkhhhhhahdeeeeeeedkh.........dbdeeeffedkhjjllabaaaabbccccbcbddbbaaaab",
    ".kkkllllllkkaahaahddeeeejkddda........dbdeeeffeiilldddbcccbbaaabccccbaebbbcaaba",
    ".kkkklllllkkaaaadaddeeeddeeeeda.......bbdeeefflihlddddccccaaabcbbabccbaabbbbabb",
    "...kkkjjjjkkbbbbbbededikeeffffda......bbddeeellkkhddbbcccabllbbcccaaabbbaabbbbb",
    "...........kbcbbbedeaaadeefffffda.....bbbddeellkkhaabbbbablllbbccbabbaabababaa",
    "...........bbbcbcdejjaaddeeffffebaa...baadkelllkkh.aallhhalllbbblllllabaaabaaaa",
    "...........bhabbdejjkaaadeeeeffedaaa..baakddlkkkkh....hhaaiilaaallllllhbcbaabba",
    "...........kkkkbedaakkabbddeeeeeeaaa..bajkddlkjkkh.....aalkkhhhkkkkllkhbccbdaaba",
    "...........aabkaa..bakkabbddeeeeedaaa.bajkldlkjikh....bbdllkhhhhiijjkkkbbbbdlkaa",
    ".............aa....adkkkabbddedeedaaaaaahkldlliikh...bddddlkfdallliiikhllddllkaa",
    "....................bbkkkbbaddedddaaaaaahjllllliihh.bbdeddkfeadllllkihhhaaaaaa",
    ".....................bbllkdbadddlllaahahajjllkliihhabddedddedddeddlkk",
    "......................bbkkkdakkdllkkhhhhaaaalkkiiihakdddlaabddeffedkk",
    "......................bbkkkbbaaallkkhhhhahaalkhhihhaklddhaabdeeffedj",
    "......................abkkkabaaallkihhhhahaaaaahhhhhkllhhhadeedeeedh",
    ".......................bbkkhaaaaahiihhhhahaahhaahhhhkkkhhklddeeeedk",
    "........................bahhhaaahhhhhhhhhhaaahhahhhhhhhahklldeeddd",
    "........................abhhhahhhhhhhaahhhhaghhhghhhhhhahkllddllll",
    "........................baahhhhhhhhhgaahhhhggghgbhhhhhhhhallllllh",
    ".......................dhhaahhhhhhhgghhhhhgggghgghhaahghhakkkkkhhhh",
    "......................aaaaahhhhhhgghhhhhhagggggghhhaaagghhkkkkhhhaagg",
    ".....................aahhahhhhhgghhhhhhhaagggbbhhaaaaaggghhhhhhhhhhhgh",
    "...................aaahhhhhhhhhbhhhhhhhhaaghhbbhhggghhhhgghhhhhhhgghhh",
    ".................abahhhhhhhhahhbhhhhahhaabghhbbhhggaahhhhggbghhhhdfdhha",
    ".................aaaddaahhhhaagghhhgahhhgbhhhhbghggaagghhhhgghhhhhgehhh",
    ".................aheeaahhhhhgghhhhaghhhgghhhhhggghgggggghhhhgghhhhhhdhhh",
    "..............aaaahaaahhaaaghhhhhhaghhhgghhhhhhggghghggghhhhhbhhggghhhhhhha",
    "............aahhaaaahhhhaaahhahahhhhhhhghhhhhhhhbbhhggghghhhhbhhhhhggghhhhhaa",
    "...........aaa.aaaahhhhaahhhhaaahhhhhhgghhhhhhhhhbghhaahhghhhhghhhhhhggh...aa",
    "...............aaahh..hahhhhhaahhhhhgbhhhhhhhhhhhaghhaahhhahhhaah.hhhhhgga",
    ".............haaaa....hah..hhhhhhhhaghhhhhhhhhhhhhahhhahhhahhhagg....hhhaaa",
    ".............haa......aaa....g....aaghhhhhhhhhhhhhabaaa...g....aaa......aaa",
    "......................aa..........aagg..........hhhaba...........aa",
    ".................................aaaag............haagg",
    "....................................ag..............hgg",
    ".....................................................gg"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "cap", step: 0 },
    b: { m: "cap", step: 1 },
    c: { m: "cap", step: 2 },
    d: { m: "pale", step: 2 },
    e: { m: "pale", step: 3 },
    f: { m: "pale", step: 4 },
    g: { m: "root", step: 2 },
    h: { m: "stem", step: 0 },
    i: { m: "stem", step: 1 },
    j: { m: "stem", step: 2 },
    k: { m: "stem", step: 3 },
    l: { m: "stem", step: 4 }
  },
  idle: {
    // They draw breath together, the caps lifting on the note.
    waist: 58,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the tallest one stretches for its high note.
    twitch: {
      frames: [6],
      patches: [
        { x: 20, y: -1, rows: ["....................abbbbba", ".................kkab..cccca", "................llab.......b..b", "..............aaaa...cc.....bbcba", "............aa...bb..b.....ccc.ccb", "...........ab...b...c.b.......abbcba", "..........ab..bb.....cc......bbccbcba", ".........a.ll.aa.............ccbb.bcbbb", "........lll..d.........b..b....cc.c..c.b", "......abak.abbd.....bbb.bbab.....c..c..cb", ".....aba..a...b.aaaaaaaaaa.aabbbbbbbb..bcbb", "....ada..a....ljj..kkk....k..c...aaa.b..b..b", "...aba......hl.lllj...kkkk.kh.ccccllllia", "...bj....kkll.dbcb.jll..E...E.....dd..lllaa", "..b.bjjllll......ckl..lahbchb....b.l.....k", "...kkkl.....ddbc.......h.hh.....b..........a", ".............c.b.bbkk........b..c.bd..kk.l", "..k...k....bcb.....ll.h...a.....bdl...llaa._", ".._a..l...b.b....a.b..a....a..bbd..l...a...bb", "..._..kk...........a.bh..a..a..d.l..abbbbbb", "....__..kkk.....b..bd..aa....caaa_abb......c", "kkaaa._____aaaaaib.d..bbcbcbhb.__a..aaaa...ba", "iiii.aa....______..e.l.....cb.b..k.a..iijhja", "aaa.ii.aa.......a...e...b.bb......illllllllll", "bbbbba..hh......b.d..ekkdd...ee..a.k", "..cccbbbaahh..........dd..dee..g..a..ddbbb", "cc.bb.aa.b..aa.a.hha..aak..khddh._...ll", "bakk.lllil....a.a...aakk.kk..hh_.._a......bbd", "jl.ll...l.lll...__a......l...__...._...l..d.b", "k.l......kk..l....b..bddddll........_aa.ld", "________________..___________........________"] }
      ]
    }
  }
};
