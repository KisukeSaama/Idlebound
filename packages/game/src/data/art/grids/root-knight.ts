import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Root Knight (BIBLE 8.2): a soldier buried under an oak. The oak got up.
 * Dark plate, dented, braced on wide legs; the breastplate split down the middle where the
 * trunk burst out of it, bark grown over the far half, roots coiled round the shins. Moss
 * hangs from the pauldrons, antlers of root grow out through the great helm, and cold light
 * shows in its visor slit. The sword is held low, a root grown through it; a cloak of roots
 * drags on the ground behind.
 */
export const ROOT_KNIGHT: CreatureGrid = {
  rows: [
    "",
    "..............................................ff",
    "..............................................dd..kc..c.kf",
    "................................kb...........kdd..kk..cckf",
    "................................cf............cd..kc.ddbf",
    ".............................k..kb............cd..bf.ddb",
    "............................ck.kk......bbb....cc..keddbb",
    "............................ccbkk....kkcccbbkbccckkbde...ee",
    "............................kcbbkb..lkkkkccbbdbckkkkae..dee",
    ".............................bbbbe.lkkkkkkbbdaallkkbbccdde",
    ".........................kc...kkkbkkkkkkkkedbaacddbbbbbbb",
    ".........................kk...bbkkkkkllkkkccebccbbb",
    "..........................kk....bkkklllkkkbeebaab",
    "..........................ckbbkkbkkklllkkkbbaaackb",
    "...........................bbckbekbklkkkkbbbbaabbb..c",
    "........................kc.kkbbbbkblkkkkkkbbbcaaabkkf",
    "........................ckkcbb...kbkkkkklbccbaaaabbb..bbk",
    ".........................bbc.....kkkkkklkaaaaaaabbbbaabbb.lllk",
    ".................................bkkkkkllbbbaaccbbbbaaabbkkkkkk",
    "..................................lkkkblkkkbbbccdabbkaaabbbkbbbb",
    "..................................kklacddbckcbbcddbkbaakbbbbbbbkk",
    ".................................kkkiddddeckcbbcabbkcakkcbkkcccclll",
    ".................................lakkdddkbkaacbbbbkccclkkklkkkccklhkc",
    "................................kkabWWdbckaaadbbbakccllkllllkkkkckhkk",
    "...............................llbaakdkkkaaaadbabkcbkllllllllkkkcckkkb",
    "..............................llkbaakkkkbaaaaddakkbblkklllllllkkkcbbbk",
    "..............................lcbbaakkkaaaaaacdhkckkkkkllllllkkkkkbbakk",
    ".............................llbbbaaaaaaaabaachhhkkkkkkklllllkkkkccbabk",
    ".............................lcbbbaacaaaaabbckcggkkkkkkkkkllkkkkkkcbbbb",
    "............................llbbbcaabkaaaabkkkkkkkkkkakkkkkkkkkkkcbbbbkk",
    "............................lbbbbaabbbkaakckkkkkllbkbckkkkkkkkkkkkbbkbbk",
    "...........................llbbbbabbcbkaakkkklklllbbbkkkkkkkkkkkkhhkkbbk",
    "...........................kkbbbaabcckaaakkkllllllkaaakkccckkkkkcggkkbbck",
    "...........................kcbbbaackkkaaakkkllllllkcaaacccbkkhkccbkbbbbckk",
    "............................kbbbakkkkkaafhkklllklkkbbaaaccbbkhkkkbbbbbaaak",
    "............................kbbaalkkkgcabkkkkkkkkkbbbbaaacbbbbbkkkkbaaaak",
    "............................kbbaalkkkggabcckkkkkkbbbbbaaaacbbbkkkbaaaaakl",
    "............................lcaaaklbbbbaabbbbccbbbbbbbaaaaakkkccaaaaaebkl",
    "............................baaaiikbbbbbbbbbbbbbbbbbbbbaaaaakkaaaaacaebcl",
    ".............................kbddickbbbbbkcbbbbbbbbbbbbbaaaiiaacaddbgabc",
    "............................kckddiikkbbbbkkkbbbbbbbbbkbbaaaibkdddbdggabbb",
    "...........................kbbjkiiiakbbbbckklkbbbbbbbbbaaaaabkkddafgjkbbk",
    "........................klbkbaabbiibacbbckkkkkkccbbbbbbaaaakaaiiaakkkkbbbk",
    "........................llkkbaaaiibbbcbbkcckkkkkckkbbbaaaaalaaaaagfkkkiiikb",
    "........................kcbkkaaaaaaa.kbbccccckbbkkbbbbaaac.laaaakekllkiiiib",
    "........................kbkkkkcaaaaa..kbbcccbbbbcccbbaaaaa..aaafeikllkibib",
    ".......................klckkkedbaaacb.ckbcbbbbbbbbbbaaaaac..aaaebkkkkjcbbb",
    ".......................kkcllkkfbaaake.cbccbbbbbbbbbbbaaaaa..aaaebbkkkkcekk",
    ".......................kkklkfffaaaaa..kkbbebbbbghgbbbbaaaab.aaacckkkhkkkkk",
    ".......................lckbdcffbaaa..kbbbkkkbbbbbbbbaaaaaabbaaaacckkcbkkkk",
    ".......................kbbcccbbbaaa..kbbabkjabbbbbbbkkkaaaabaaaaakklccakcb",
    "......................kkbdccaababb..kbbbaeaaaabaackklkkcbbaaaaaaabkkccbbb",
    ".................bkc..lbbbcaaaaabb.kkbbbbeaaccccjalkllkkbbaaaaaaabcdccabb",
    "................bkccccbbcbaaaaab..kkbbbbbbbkkkbcjaallllkkbaaaaaaabcdccab",
    ".................baaabkdcciaaabb..kbbbaabbbkkkbbjaakkllkkcbaaaaabbddccbbb",
    ".................bbaabbbkiiaabkk.kbbbbabbbbbkbbciiaakklkkkbaaaacdddddcbbk",
    "..................baaakbbbaak.kk.bbaabkbbbbbbbbciicablkkkkcbaacdddddcbbkk",
    "...................acabbbbbb...kbkaakggbbbbckbbckbcgbbkkkkcbbkddddddcbbbb",
    "..................dddaaabbbb...kbbfkggbbbbbckbckkbggggckkkbbbkkbdddddbbbb",
    "..................ddbeeaaakb...eajffggbbbbbckccckbgkckikkkbbkkaadddbcbbbb",
    ".................dddbbeeaabkb..kkfckkgbibbbkkckkkbbkkkkbkkbabbaakddbciibk",
    "................dddkbdeecabbbbkkkbkkkbbibcbkkkkkkbcckklkbbaaaaaablkbdibbkc",
    "...............kdddbecaaaaaaaabkbkkkcbbibcckkkkckjcckkklkkbaaaaabkkbkaabkk",
    "..............llddbbecaafacaaacbckkkbbaabbkkbkccjajcjkkllkkcaaaakbaiaaabbk",
    "..............lkdbbbecalf.l.bbkkckjkbbbabbbbbbcckajibckkkkcbaaajkbaiaaabbk",
    ".............llkdbbbecbke....kbkkbjbbiaaibbbbcccjaiibbckkkkbaaajjaaaaabbbkk",
    "............kkkkdbbeedb.b....kbccbabbiaaibbbbccbjaibbbbkbbaaaaaaaaaaaabbbkk",
    "...........klkkkcbbbbb.......kbbbbaaaaaaabbbbbbbjaibibaabkkbbaaaaaaaaabbbkkb",
    "...........llkkfcbbkbf........kbbbaaaaaaabbbbbbbjaajiaaakkkddaaaaaaaaabbakck",
    "..........lllkbfgbck.f........kbbaaaaaaaakbbbbbjjaaaaakdbdddbaaaaaaaaabbacbkb",
    ".........llllbbgbcc............bbaabbaaaakjjiijjjaaaaabbbbbbbbbaaaaaaabjabbkk",
    "........klklkbbgcbb.............keeaaaaaajkjjjbbjaaaaabbbbbbbbbaaaaaaaajbbbbkc",
    "........llkkbbgbkkc.............bbaaaaaaaabbbbbaaaaaaaabbbbbbbfaaaaaaaakbabbbkc",
    ".......llllchkbbb.k.............kbbaaaaaaaaabbaaaaaaaabbbbbbbdbaaaaaaaaccaabbckc",
    "......klkkghkcbc.................bbaaaaaaaaaabbaaaaaaabbbbaaccbaaaaaaaaacaabbbkkcbkk",
    "......lkkkgcbkcc.................bbbaaaaaaaabbbaaaaaaaabeebbccaaaaaaaaaakcaabbbbkkkkkkk",
    ".....llkkhckkccd................kkbbbbaaaaaaabbbbbbaaaabeaadcaaaaaaaaaaajcaaabbbbbbbkkk",
    "....lllkkbkkk..de.............klkebbbbbbaaaaabbbbbbaaaabcadcaacbbaaaaaaaakkaaabbbaabbkkc",
    "...klkkkbkkk...d.............kkbbbkccbbbaaaaabbbbbbaaaabbccacbbbbbaaaaaaaakcaaaaaaabbbbkbb",
    "...llkkkkkkc..............kckkbbkckccbbaabaaie..bbaaaaaabcacbkkaabaaaaaaaacccaaaabkbbbckkbb",
    "...llkkkkk.k............kcibbbbbddbcffbaabbbie.........abaabdkhkaaaaaaaaaaacccbbbbckbbkkkbb",
    "..kllkkkk..............kkiibbbkbbbbbbbeaabiii.........jbbacbbdggbaaaaaaaaaaaacckbkkbbbckb",
    "..llkkkkc..............baiibbkkbibbbbeeeeaa...........bbbdccbbbbbaaacaaaabaaaaabbbbbbbbb",
    ".klkkkkc....................bbiiibba................ckbbadccdbbccaaaabgaabbbbbbbbb",
    ".kkkkkk...........................................bccbabkcccdbbccaaf.bbcbbbbccbbeebbb",
    ".kkkk............................................bbciaabkikbdbbabdaa...bbbeeeccceeeee",
    ".kkk............................................kkbiiaakbiibbbaabbke",
    "bcb.............................................eaaaaabbbaiikbaaiikkb",
    ".....................................................bbkaaaiiba..iikb",
    ".....................................................bkbb..ikcc...iak",
    ".....................................................bkb...icc",
    "......................................................b.....ck"
  ],
  legend: {
    W: { pal: C.wisp, glow: true },
    a: { m: "bark", step: 0 },
    b: { m: "bark", step: 1 },
    c: { m: "bark", step: 2 },
    d: { m: "bark", step: 3 },
    e: { m: "moss", step: 0 },
    f: { m: "moss", step: 1 },
    g: { m: "moss", step: 2 },
    h: { m: "moss", step: 3 },
    i: { m: "plate", step: 1 },
    j: { m: "plate", step: 2 },
    k: { m: "plate", step: 3 },
    l: { m: "plate", step: 4 }
  },
  idle: {
    // A slow breath that creaks: bark and plate.
    waist: 52,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the rooted sword lifts an inch from the ground.
    twitch: {
      frames: [8],
      patches: [
        { x: 0, y: 54, rows: ["..................b...bbki...b", "................._...ak.bba.k_", ".................._.c.b...bb_", "..................ddd.aa", "....................bee.aak", ".................d...b.e..bkb", "................d..k.d..c..b.b", "...............k...becaaa.aaaa", "..............ll..b.....f.c", "...............k.b.....l._l_bb", ".............l........bke._._k", "............kkk....e.d._b", "...........kl...c..bbb_._", "...........l...f...k.f......._", "..........l...b.g.c._", ".........l...b.gbc._._", "........k.k.k...cbb", "........l..kb.gbkkc", ".......l..lchkb.b_k", "......k.kkghkc.c_._", "......lk...cbkc", ".....l...hckkc.d", "....l....bk..__.e", "...k.kk.bk.._..._............k", "...l....k..c..._..........kck", ".........._k............kcibbb", "..k......_._...........k.i", "..l.k...c..............ba....k", ".k.k...c_.............._____.b", "..k...._....................__", ".....__", "...._", "bcb_", "___"] }
      ]
    }
  }
};
