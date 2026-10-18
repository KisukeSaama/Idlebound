import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Deepvaults (BIBLE 7.3): the Runeguild's mines, where the star-shards were dug. A
 * head-frame still stands over its shaft, the rope down, a lantern lit on it: someone
 * still works here. Galleries open in the rock, framed in timber, icicles on their lintels;
 * pillars carved with runes that still glow hold the vault up; a cart heaped with shards
 * waits on the rails; crystals grow out of the floor.
 */
export const DEEPVAULTS_STRUCTURES: Record<string, StructureRecipe> = {
  "vault-headframe": {
    w: 35,
    h: 50,
    fragile: 28,
    growth: 0.12,
    seed: 3101,
    pieces: [
      { decor: "vault-headframe-painted", at: [0, 49] },
      { decor: "vault-lantern", at: [4, 40], keep: true }
    ]
  },
  // The Runeguild's winding house over the great shaft, across the vault: a head-frame of
  // heavy timbers, braced, its sheave wheel at the top, the cable down the shaft, the winch
  // hut beside it with a lit window, a scaffold; the miner's lantern still lit.
  "vault-winding-house": {
    w: 44,
    h: 60,
    fragile: 30,
    growth: 0.34,
    seed: 3107,
    pieces: [
      { decor: "vault-winding-house-painted", at: [0, 59] },
      { decor: "vault-lantern", at: [2, 46], keep: true }
    ]
  },
  // A scaffold tower seen across the vault, platforms and a ladder.
  "vault-scaffold": {
    w: 30,
    h: 64,
    fragile: 30,
    growth: 0.1,
    seed: 3108,
    pieces: [
      { decor: "vault-scaffold-painted", at: [0, 63] }
    ]
  },
  // An old head-frame that fell into its shaft, leaning, broken at the head.
  "vault-fallen-frame": {
    w: 44,
    h: 54,
    fragile: 20,
    growth: 0.15,
    seed: 3109,
    pieces: [
      { decor: "vault-fallen-frame-painted", at: [0, 53] }
    ]
  },
  "vault-gallery": {
    w: 56,
    h: 60,
    fragile: 30,
    growth: 0.2,
    seed: 3102,
    pieces: [
      { decor: "vault-gallery-painted", at: [0, 59] }
    ]
  },
  "vault-pillar": {
    w: 22,
    h: 78,
    fragile: 30,
    growth: 0.15,
    seed: 3103,
    pieces: [
      { decor: "vault-pillar-painted", at: [0, 77] }
    ]
  },
  "vault-cart": {
    w: 26,
    h: 18,
    fragile: 6,
    growth: 0,
    seed: 3104,
    pieces: [
      { decor: "vault-cart-painted", at: [1, 17] }
    ]
  },
  "vault-crystals": {
    w: 32,
    h: 36,
    fragile: 16,
    growth: 0,
    seed: 3105,
    pieces: [
      { decor: "vault-crystals-painted", at: [0, 35] }
    ]
  },
  // A gallery far across the vault: a mouth in the rock, runes lit beside it.
  "vault-far-gallery": {
    w: 20,
    h: 16,
    fragile: 6,
    growth: 0,
    seed: 3106,
    pieces: [
      { poly: [0, 16, 2, 6, 8, 1, 14, 2, 20, 8, 20, 16], m: "rock" },
      { decor: "vault-glint", at: [4, 12] },
      { decor: "vault-glint", at: [16, 13] },
      { decor: "vault-glint", at: [16, 9] }
    ]
  }
};

export const DEEPVAULTS_DECOR: Record<string, DecorGrid> = {
  // vault-crystals, painted then traced.
  "vault-crystals-painted": {
    rows: [
      "..........b",
      "..........bb",
      ".........cbbb",
      ".........cbbb",
      ".........cbob",
      "........ccbbbd",
      "........ccabbd",
      "........ccabbb.......b",
      ".......dccabbbc.....bbb",
      ".......dccaabbc....bbbb",
      ".......dcaaabbc...bbbba",
      "......ccdcaabbbb..bbbba",
      "......ccdcabbbbb.bbbbaac",
      "......ccdcabbbbb.bbbbaacc",
      "......caacabbbbaabbbbccca",
      "......caacabbbbaabbbbccca",
      "......caaabbbbbaabbbbccbaa",
      "......ccabbbbbbaabbbbbbbaa",
      "......cccbbbbbbaabbbbbbbaa",
      ".....ccccbbbobbbabbbbbaaac",
      "...aaacdcboobbbbbobbbbaaac",
      "...aaacdccobbbbcbbbabbbaaa",
      "..ccaccdccbbbbacbbbaaaaaaa..a",
      ".cccacdddccbboaabbbbaaaacc.bba",
      ".cccccdddddccaaobbbbddccdcbbbac",
      "..ccdddddddcdcbbobadddddddbbbccc",
      "..dddddddddcdccbaaacddddcccbddcc",
      ".dddddddddddcddddddccddddcdddddc",
      ".ddddddddddccdddddddcddddccccddc",
      "ddddddddddcccccccdddccccdcdddddd",
      "ddddddddddcdcccaaaaddcddddddddd",
      "ddddddddddddcccdddddddddddddddd",
      "ddddddddddddddddddddddddddddddd",
      "dddddddddddddddddddddddddddddcd",
      ".ddddddddddddddddddddddddddddc"
    ],
    legend: { a: ["crystal", 2], b: ["crystal", 3], c: ["crystal", 1], d: ["crystal", 0], "*": "glow", o: "core" }
  },
  // vault-headframe, painted then traced.
  "vault-headframe-painted": {
    rows: [
      "...........ccaaaaaaaaa",
      "..........cccddbddbdddd",
      ".........acbbbbbbbbbbbd",
      ".........addccccbaabbbb",
      "..........aadcccdaaaaaa",
      "...........dcc*cdbbaaa",
      "...........cccocdbbaad",
      "...........ccc*ccbbbad",
      "...........ccccceeabbd",
      "...........cccceeeabbd",
      "..........ccccceebabbd",
      "..........cccdceebaabda",
      "..........ccddceebabbda",
      "..........cccbceebabbda",
      "..........dddbcfebabada",
      ".........dccbbdfebabadc",
      ".........ccddbdfebababc",
      ".........bcdbbbgefaabbd",
      ".........bcddbbgefabbbdd",
      ".........ccbbbbgffaaaabcd",
      ".........cddcccffbbdddbcd",
      ".........cbddddgfbbbbbbdd",
      ".........dbbabbgffbbbbddd",
      "........ddbbabbgffd*bbcdd",
      ".......bcdbabbggffcccccdcc",
      ".......bcdbabbggffbccddbcc",
      ".......bdbbabbbgffbbcbbbcd",
      ".......bdbbabbbgffbabbabdd",
      ".......bbbbabbagffaabbaabd",
      ".......bbbaabbagffaabbaabc",
      ".......dbbaaabggffaaabaabc",
      ".......dbbbaaaggffaaaaaabc",
      "......bbbbbaaaggffbbbdbbbcc",
      "......babbbbbbffffddbddbbbbd",
      ".....daabbbbbbbgffbbaaaabbdd",
      ".....bbdaaaaaaagfgaaaaaaabdb",
      "....bbb*aaabaa.gfgg.aaaaabdb",
      "....baccaaabba.gfgg.bbaaabdd",
      "....baacaaabba.gffg.bbadaaddb",
      "....aaaaaabba..gffbccaddaabbb",
      ".ddaaaabaabba.abbbbbaabbaabba",
      "adddddbbaadddaabbbbbaabbaabba",
      "aaaaaaaaaaabdaabbbbbaabbaabbbd",
      "aaaaaaaa.aabbaabbbbbaabbaaabbdcccd",
      "aabaabaa.aabba.aaaaa.abbbbbbbbbbcdb",
      "aabaabba.aabba.......abbbbbbbbaaabb",
      "aabaabbaababba........abaaaaaaaaaaa",
      "aabaaabaababba.......aaaaaaaaaaaaa",
      "aaaaabb.aaaaba........aaaaaaaaaaa",
      ".aa.ab...aaaa.........aaa..aaa"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 3], d: ["wood", 2], e: ["cloth", 2], f: ["cloth", 1], g: ["cloth", 0], "*": "glow", o: "core" }
  },
  // vault-cart, painted then traced.
  "vault-cart-painted": {
    rows: [
      ".............aa",
      "............aacc",
      "......ca...aacccc",
      ".....aacddcaaccccb",
      "....aad*ddbbccccabb",
      "...aaa*o*bbccaaaaadd",
      ".iiaaadddbaaaaaaaaadjkk",
      "iiiiilljjjjllllllllljkkk",
      "iiiiiilljjjllllllllillkk",
      "ieeeiieefffffeefeeiieegk",
      ".eeeilfffffffefffelieeg",
      ".eeeilggfffggffgffllegh",
      ".eeeilghffggggfggfllggh",
      "..eeiigh*gggggfhhflkhh",
      "..eeiiihegggfffffelkhh",
      "...eeiieeffffffeeelkj",
      "..iiiiiee......eiiijjj",
      "....iii..........iij"
    ],
    legend: { a: ["crystal", 0], b: ["crystal", 2], c: ["crystal", 1], d: ["crystal", 3], e: ["wood", 0], f: ["wood", 1], g: ["wood", 2], h: ["wood", 3], i: ["metal", 0], j: ["metal", 2], k: ["metal", 3], l: ["metal", 1], "*": "glow", o: "core" }
  },
  // vault-gallery, painted then traced.
  "vault-gallery-painted": {
    rows: [
      ".......................bbbbb",
      "......................bbbbbbbbbbbbac",
      "....................bbbbbaabbabaaaaccccc",
      "...................bbbbaaabbaaacaaaaaaaac",
      "..................bbbbaaabbbccccaaaaaaaacc",
      "................bbaabbaabbbbcdcccaaaaaaaadd",
      "...............bbbaacbabbbbdddccccaaaaaaaadd",
      ".............bbaabaacbbbbddddcccaaaabaaaaaadd",
      "............bbbaaaaabbbbcddddddddcccbaaaaaaad",
      "...........bbbbbaaabbbbccddddddddcccbbbaaaaadd",
      "..........bbbbbbaabbbbdccdddddddddccaaaaaaaaadd",
      ".........bbbbbbbbbbbacddaddddcdccaaabbabbbbbbadd",
      ".........bbbbaaabbbbacddaddddcdddddcaaccaaabaaadd",
      "........bbbbbaaabbbbaccaddddddadccccaaccaaaaaaaddd",
      "........bbbbbbaaaabbaaaaccdddcadccccaaccaaaabbaadd",
      ".......bbbbaabbaaabbaaaacccccccccaaaaaaaaaaaaaaadd",
      ".......bbbbeeeefffeeeeeeffffffgfffffffaaffeeaaaaadd",
      "......bbbbeeeeeffffgggghhhhhghggghhggffggffffaaaadd",
      "......bbbbeeeeeeeeeggghhhhhhghhggghfefffgeeefbbaaad",
      ".....bbbbbbeeeeeefeffghhhhhhhhgggggfefeeeeeefbbbaadd",
      ".....bbbbbbbbbeeefaaaccccdddddcccccabbeeeebbbbbaaacd",
      "....bbbbbbbbbbbeeeaaaacddddddddddcaabbbeeebbbbbaaacd",
      "....bbbbbbbbbbbeeeeabbcddddddddddaabbbeeeebbbbbabacdd",
      "...bbbbbbbbbbbbeeeeaadd*ddd*dd*d*cdbbbbeeebbbaaabbaad",
      "...bbbbbbbbbbbeeeeaadddacccoaaaddcdbbbbeeebbbbbbbaaad",
      "..bbbbbbbbbbbbefghaddcaaaacoaaaccaccbbhffebbbbbbaaaddd",
      "..bbbbbaabaaabefghaddbbaaaaaaaaaaaadddhffebbbbbaaaaaad",
      "..bbbbbbbccaabefghhddbbbabbbbbabbabaddhffebaabaaaaabad",
      "..bbbadabaaccbefghhhaaaaabbbbbbbbbbaahhggebaaacaaaabadc",
      "..bbbadaaaaccbefghhfeaabbbbbbbbbbbbbfhhggebcaacaaaabadc",
      "..bbbbaaaaaaabeghhhfefbbbbbbbbbbbbbefhhggebccccaaaaaacc",
      "..bbbbaaaacddaeghhheefebbbbbbbbbbbeeehhggebcccaaaaaaaacc",
      "..bbbbbabcccdaefhhheeeeebbbbbbbbbfffeghggbbcacaaaaaaaaac",
      ".bbbbbbbbcccdbefhhhffeeeebbbbbbbeeefeghggebaaacccaaaaaac",
      ".bbbbbbbbcccdbefhhhfeeeeebbbbbbeeeeffghggeaccaacdacaaaac",
      ".bbbbbbbbaaabbeffhhfeeeeebbbbbbeeeeefghgfeaaaaccddcaaaac",
      ".bbbbbbbbbbbbbfffhhfeeeeebbbbbbeeeeefghffeaacccc*dcaaaac",
      ".bbbbbbbaabccbeffhhffeeeebbbbbbeeeeeffhffeacccc**dcaaaac",
      ".bbbcbd*caaccbeffhhfeeeeebbbbbbeeeeeffhfeeacaccdddcaaaac",
      ".bbbcbd*caacabeffghfeeeeebbaabbeeeeeffhheebcaccdddcaaaaa",
      ".bbbaaaaaaaaabeffghffeeeebbaabbeeeeeffhheebcaaaddddaaacc",
      ".bbbaadaaaaabbeeehgfeefeebbbbbbeefeeffhfeebbaaaad*daaaac",
      ".bbbabdddabbbbeeehgfeefeebbbbbbeeffeffhfeebbbaaaa*daaaaa",
      ".bbbabbddaaaabeeeggeeefeebbbbbbeeeffffhfeebbaaaddddbbbaa",
      ".bbbbbaaaaababeeegfeeefeebbbbbbeeefeefhfeeaaaaad*dcaaaba",
      ".bbbbaddaaabbbeeegfeeeffebbbbbbeeeeeegffeebaaaaad*caabba",
      ".bbbbaddabaaabeeefgeeefffbbbbbbeeeeeggffeebaabaaaccabbba",
      "bbbbbbbddbbabbeeefgfeefffbbbbbbeeeeeeeeeeebabbbabbbbbbbb",
      "bbbbbbbcabbbbbeeefffhhfffbaaaabeeeeeeeeeeebabbbabbbbbbbb",
      "bbbbaaacabbbbbeeefffffhhhbbaaaaeeeeeeefeeebbbbbbbbaaaaab",
      "bbbbaaccabbbbbeeeffffffeebbaaaaffeeeeffeeebbbbbbaaaaaaaa",
      "bbbbaaabbbbbbbeeeeeegeeeeabaaaafeeeffefeeebbbbbaaaaabbba",
      "bbbbbabbbbbbbbeeeeeegffffcbbbaaffffeeeeeeebbbbaaabbbbbba",
      "bbbbbbbbbbbbbbeeeeeeefeffccbbbbfffeeeeeeeebbbbbbbbbbbbba",
      ".bbbbbbbbbbbbbeeeeeeeeeeeaabbbbeeeeeeeeeeebbbbbbbbbbbbb"
    ],
    legend: { a: ["rock", 1], b: ["rock", 0], c: ["rock", 2], d: ["rock", 3], e: ["wood", 0], f: ["wood", 1], g: ["wood", 2], h: ["wood", 3], "*": "glow", o: "core" }
  },
  // vault-winding-house, painted then traced.
  "vault-winding-house-painted": {
    rows: [
      ".................fee",
      "................ffeee",
      "...............efeeeeg",
      "..............eeeeeeegg",
      "..............eefeehhgg",
      "..............eefeeeeeg",
      "............bbeeeeeeeeeggg",
      "..........aabbfffebbbfeegbc",
      "..........aaaaafhhbbbffebbc",
      "..........adddddhhbadddaabb",
      "............dddahhbadddaab",
      "............ddaahhbadaaeebb",
      "............ddabehbbdabggee",
      "............ddabehbbddbffeeg",
      "............aaabhhbbddbfffeg",
      "............aaaahhbbddbaf.eeg",
      "............aaaafhfbbbbaf..eg",
      "............aaaffhfbbbbba..eeg",
      "...........aaddhhhhbddbbbg..eg",
      "...........aaadhhhfbddaabg..efg",
      "...........aabbfhhfbddaabg...fg",
      "...........aabafhhfbddaabg...ffg",
      "...........abaaahhfbddbabb....fg",
      "..........abbdafhhfbddbabbb...ffg",
      "..........abbdafhhfbddbabbc....fg",
      "..........abbaahhhfbddbbbbc....ffg",
      "..........dbbaahhhfbddabbbc.....fg",
      "..........dbbbaahhfbddaaaaac....ffg",
      ".........aaabbbbfhbbbccccbbc.....fggi",
      ".........daaabbbfhacccccbbbbb....ffjii",
      ".........dddddddhhacaaacbbbb....eekjjji",
      "........aaaaddddhhfcddccbccc...eekkkkkji",
      "........aaabdddhhhfccccccccb.klkkkkkkkjii",
      "........aaabdddhhhfcccccc*cbblllkkkjjjjjii",
      "......baaaabdddhhhbcbbc*o**bblllkjjjjjjjjii",
      "..daaabbbbccaddhhhbccbccc**bblllllkkkkkjkkik",
      ".dddaabbbbbbaddhhhfcccccccccjkkllllllllllll",
      "..ddddddddabdddhhhfbaaccccccjkkllllllllllll",
      "..dddaaabaacdddhhhhbaadccbcbbcbdaaabbbbaaac",
      "..ddabbbbbacddhhhhebddddabbabcbdaabcc**cbbc",
      "..hhaaabcaacadhhhheeddddabbabbbdaabccoocbbc",
      "...hhbbccabbaaffffffcccccccaabbdaabccoocbcc",
      "...hebbc*abbbbffgggfbbbaaadddabdaabcc**cbbc",
      "...hebcccabbbbffffhhaaaddddddaaddabcccbbbbcc",
      "...habcccaabaadhhhhhdddddddddaddddaccbbaabcc",
      "...habdabaabdddddddddddddddddaddddacccbbaacc",
      "b.ahhbdabaabdddddddddddddddddaddddabbbbbaaaa",
      "bbaddbadbaabdddddddddddddddddaddddababbaaaaa",
      "bcdddbadbaabddddddddddddddaddaddddabaaaaaaaa",
      "bcaddbadddabddddddddddddddaddaddddaaaaadaaaa",
      "daaddbaddddaddddddddddddddddddddddaaaaadddca",
      "daaadaaaaadaadddddddddddadadddddddaadadddbbc",
      "dddaaaaaaddaaammmmmmddddadaddddddddadddddbbd",
      "dddabddddddaaammmmmpdddaadadddddddddddddbaad",
      "aadabdddddddppmmmmpppdadadadddddddddddddbadd",
      "aaddaadddaaqpnppnnnpnnaddddddddddddddddaaddd",
      "aaqaaammnnqqnnppppppnnppdppddmddddddddadadaa",
      "mmqpqqppnqqnnnpmpppmpqqnpppppmdddddddaaddaad",
      "mmqpmmnqqqqnnppmpppmpqnnpppppmmddddddaaddddd",
      "mmmmmmqnqqqnnppmppmmpnnnppppmmmmddddaaaabddd"
    ],
    legend: { a: ["wood", 1], b: ["wood", 2], c: ["wood", 3], d: ["wood", 0], e: ["metal", 1], f: ["metal", 2], g: ["metal", 3], h: ["metal", 0], i: ["roof", 3], j: ["roof", 2], k: ["roof", 1], l: ["roof", 0], m: ["stone", 0], n: ["stone", 2], p: ["stone", 1], q: ["stone", 3], "*": "glow", o: "core" }
  },
  // vault-pillar, painted then traced.
  "vault-pillar-painted": {
    rows: [
      ".aaaaaaaaaaaaaaaaaaa",
      ".aaabbacacacaccccaaa",
      ".aaaccacacacaccccaaad",
      ".aaaaaaaaccaaccaaaaadd",
      ".aaacccccccccccaaaaadd",
      ".aaacccccccccccaaaaadd",
      ".aaacccbbccccccaaaaddd",
      "..aaaaaaacccaaaaaaddd",
      "..aaaacaaccaaaaaabdd",
      "..aaaccccccccaccabd",
      "..aaccaccccccaccabd",
      "..aaccaccccccaccacd",
      "..aaccccacbbbbacacd",
      "..aabaccacbbbbaaacd",
      "..aabaccccccccacacd",
      "..bbbcccccbbbbccacd",
      "..cbbcccccbbbbccccd",
      "..ccbcccccbbbbccccd",
      "..ccbccccbcbbbccccd",
      "..ccbcccbbcbbbbcccdd",
      "..ccbcccbbbbbbbcccdd",
      ".ccbdcccbbbbbbbbbcdd",
      ".ccbdcccccbccccbbcdd",
      ".ccbdbbcbbbbbcccccdd",
      ".ccbbcbcbdbbbcccccdd",
      ".ccbbcccbdbbcbccccdd",
      ".aacbccbbbbbcbbbccdd",
      ".aacbcccbbbbcbbcacdd",
      ".aaccccccc*cccccacdd",
      "..acbccbbddcccbcccdd",
      "..ccbacbcddbcbbcccdd",
      "..cabaccccdbcbbcccdd",
      "..cacacacccbccbcacdd",
      "..cacacaccccccbbaadd",
      "..aacacaccccccbcccdd",
      "..aacaaaaaacccccacdd",
      "..aacaccacccccbbacdd",
      "..aacaccabccccbbccdd",
      "..aacaaaabbccccaacdd",
      "..aacacccddbbbcaacdd",
      "..aacaaccccccccaacdd",
      "..aacaaacbaaaaaaacdd",
      "..aaaaaccbcbbbbbacdd",
      "..aacaacccccbcccacdd",
      "..aacaaacccaaccaacdd",
      "..aacaacccccacccacdd",
      "..aacaaaccccacccacdd",
      "..aacaaaaaaacaaaacdd",
      "..aacaaaaaaaccccacdd",
      "..aaaaaaaaaacccaacdd",
      "..aaaaaaaaaacaaaacdd",
      ".caaaaaaaaacccaaacdd",
      ".caaaaaaaaaacaaaacdd",
      ".aaaaaaaaaaaaaaaaacd",
      ".aaccbbbbaaccaccbbca",
      ".aaccccccaaaaaacaaaa",
      ".aaacaaacaaaaaccaaaaa",
      "aaaacaaacaaaaaaaaaaaa",
      "aaaaaaaaaaaaaaaaaaaaa"
    ],
    legend: { a: ["stone", 0], b: ["stone", 2], c: ["stone", 1], d: ["stone", 3], "*": "glow" }
  },
  // vault-fallen-frame, painted then traced.
  "vault-fallen-frame-painted": {
    rows: [
      ".....................b...bb",
      "....................bbbbbbbc",
      "....................baccbbfc",
      ".....................accagfcc",
      "......................baagffccc",
      "......................bbagffcccc",
      ".....................bbabfffccccbb..b",
      ".....................baabfffccccccbb",
      "....................abaabfffccccccccbb",
      "....................abacffffcccccccccbbc",
      "....................aabcffffcbccddcbbccccb",
      "...................aaabcffffcbcccd...cccccb",
      "...................aabbcffffbbbcc.....ccccbb",
      "..................aaabb.ggffbbccc...bbccccc",
      ".................aadabb.geffbacccbbbbbbcbb",
      ".................odddb..eegfbacccbaabb",
      "................**dddd..hhgfaaccbaa",
      "................ddddd...hhggdacbb",
      "................adddd...hhggddbbd",
      "...............aaddd....hhgfddcbd",
      "...............baaad....hhgfddcbd",
      "..............bbaad.....hhgfadbdd",
      "..............baaad.....hhgfadbdd",
      ".............bbabad.....hhgfaabaa",
      ".............bbabd......hhffbacbd",
      ".............babdd.......ffbbacbd",
      "............bbabb..........bbacbd",
      "...........bbabbb.........ccbabaa",
      "...........cbabb.....dd*cccccbbaa",
      "..........ccabcccdd*ddbbcccccccbb",
      "........caacabcbbbbbcbbbcccccccbd",
      ".......ccacccccbccbbcccb...ccccbd",
      ".......cccccccccbbb........ccbcbd",
      "........cccccc............bccbcbd",
      "........ccccc....aa.......bcccccd",
      "........ccccc.....bb......bccbccd.b",
      ".......ccbcc......bbbj.aabbccbcca.bb",
      "......bcbbc.......jjjjjbbbbbbbccacd*",
      ".....bbcbccbaabbjjjjjjjjbbbbcbccccddk*",
      ".....ccbbccbbbjjjjiiiiijjbcccbbcccckkk",
      ".jjccccbcccccllljjkkijjjjkcccbbcccjiiijjki",
      "jjjjcccccccclllllljkkjj*kkkbbbbciijjjjkkkiii",
      "jlljjcjjjjjiiiiklljjjkiikkkkkiiiiiiiiijjjlli",
      "jlllllljjiiikkkkjkkkkkkkkkkiiiijjllljjllllll",
      "llllllljjjljjllljjjjjklllllljjjllllllllllllj",
      "lllllllljlljjllljjjjjjlllllljjlllllllllllllj",
      "lllllllllllllllllljjjlllllllljllllllllllllll",
      ".llllllllllllllllljjjlllllllllllllllllllllll"
    ],
    legend: { a: ["wood", 2], b: ["wood", 1], c: ["wood", 0], d: ["wood", 3], e: ["metal", 2], f: ["metal", 0], g: ["metal", 1], h: ["metal", 3], i: ["rock", 2], j: ["rock", 1], k: ["rock", 3], l: ["rock", 0], "*": "glow", o: "core" }
  },
  // vault-scaffold, painted then traced.
  "vault-scaffold-painted": {
    rows: [
      "....aab...............aaa",
      ".aabaabaaabbaaaabbaaabaaaaac",
      ".aababbabbbbabbbbbbbbbbbbbacc",
      ".aabbbbbbbbbbbbbbbbbbbbbaaaccc",
      ".ddddddbbbbbaaaabbbbdddbaccccc",
      ".ddddddddbbbaabbbbbdddbbbccccc",
      "..dbbbdddddddddddddddaabbcccc",
      "..cbbbddddddddddddddbbbbcccc",
      "..c.aaddddddddddddbbdbbaccc",
      "..c.aaddbbdddddddbbddbbaccc",
      "....aaddbdddddddbbddddbacc",
      "....aadbbddddddbbddddbbacc",
      "....aadbddddddbbdddddbbacc",
      "....aaadddddddbdddddbbbacc",
      "....aaabdbddbbdddddddbbacc",
      "....aacbdbdddddddddddbbacc",
      "....aacbbdddddddddddddbacc",
      "...aaaadbbbdddddddddddaacc",
      "..baabadbbbdddddddddddaaccc",
      "..baabddbbddddddddddddaacccc",
      "..bbbbddbdddddddddd*bdaacccc",
      "..bbbbbddddddddddda*bdbaaccc",
      "..bbbbddbddddddddda*adbbaccc",
      ".bbbbaaabaaabbaadaaaabbaaccc",
      ".bbbbbaabaaabbbbbbbbbbbbaaccc",
      ".bbbbbbabbbbbbbbbdbbbbbbbaccc",
      ".bddddddddddbdddbddbddddbaccc",
      ".bddddddddddbdddbddddddbbaccc",
      ".bddbdddddbbbbbbddbabdbbacccc",
      ".bbbbddddbbbbbbbbdbabbbbacccc",
      ".dddbbddbbbbbbbbbdbbabbbacccc",
      ".abbbbdbbbbbbbaaadaaaabacccc",
      ".abbbbdbbbbbbbddbdbababacccc",
      ".abbbbbbbddbbbdbbdbabaaacccc",
      "..bbbbbbbdddbbbbbdbaabbacccc",
      "..bbbbbdddddbbbbbdbaadbbcccc",
      "..abbbbdddddbbbbbdbbbdbbcccc",
      "..abbbbdddddbbbbdddbbdbbaccc",
      "..abbbbdddddbbddbdbdbdbbaccc",
      ".bbbbbddddddbdddbdbdbdbbaccc",
      ".abbcbddddddbbddbdddddbbaaac",
      ".bbbcbddddddabbbbdddddbaaaac",
      ".bbbcbddddddabddbdddbbbaaaac",
      ".bbbcbddddddbddbbddddbbbaaac",
      ".bbbabdbbbddbddbbdddddbbaaaa",
      ".bbaabaabaaaadaabdbaabaabbcc",
      ".abbbbbbbbbbbdbbbdbbbbbbbbcac",
      "aabbbdbbddbbbdbbbdddddbbbbcac",
      "abbdddddddddddddbdddddddddaac",
      "abbbddddddddddddbdddddddbbaaa",
      "abbbbdddddddbddbbdddddddbbaba",
      "bbbbbdddddddbdddbdddddddbbaba",
      "bbbbbdddddddbdddbdddddddbbbba",
      "ddbbbdddddddbdbbbdddddddbaaba",
      "abbbbdddddddbdddbdddddddbbbba",
      "abbbbdddddddbdddbdddddddbbbba",
      ".bbbbddddddddddbbddddddbbbbbb",
      "bbbbbdddddddbdddbddddddbbbabb",
      "bbbbbdddddddbddddddddddbbbabb",
      "bbbbbdddddddbdddbdddddddbbabb",
      "bdbbbdddddddbdddbdddddddbbadb",
      "ddddbdddddddbdddddddddddbbbdbb",
      "bbddddddddddbddbbdddddddbbbddb",
      "dddddddddddddddddddddddddbbddb"
    ],
    legend: { a: ["wood", 2], b: ["wood", 1], c: ["wood", 3], d: ["wood", 0], "*": "glow" }
  },
  // The head-frame's pulley.
  "vault-pulley": {
    rows: ["..###..", ".#mmm#.", "#m#M#m#", "#mM#Mm#", "#m#M#m#", ".#mmm#.", "..###.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 1] }
  },
  // A miner's lantern, open-framed, its flame warm and breathing.
  "vault-lantern": {
    rows: ["..#..", "..#..", ".#m#.", "#mMm#", "#.c.#", "#ccc#", "#.c.#", ".#m#."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 3], c: "core" },
    frames: [[], [{ x: 1, y: 4, rows: [".c.", "cc.", ".c."] }], [], [{ x: 1, y: 4, rows: ["c..", "ccc", ".c."] }]]
  },
  // Runes cut down a stone, still lit.
  "vault-runes": {
    rows: [".*.", "**.", ".*.", "...", "*..", ".**", "..*", "...", "**.", ".*.", ".**"],
    legend: { "*": "glow" }
  },
  // Icicles along a lintel.
  "vault-icicles": {
    rows: ["iIiIiIiIiIiIiIiIiIiIiIiIi", "i.I.i.I..i.I.i..I.i.i.I.i", "i...I....I...I...I...I..i", "....I........I.......I..."],
    legend: { i: ["crystal", 3], I: ["crystal", 2] }
  },
  // A small cluster of crystal at the foot of a stone.
  "vault-crystal": {
    rows: ["..*...", ".*S.*.", ".SSs*.", "sSSsS.", "#sSs##"],
    legend: { "*": "glow", s: ["crystal", 3], S: ["crystal", 2], "#": "outline" }
  },
  // Shards on the heap, the brightest alight.
  "vault-shards": {
    rows: ["..*....*..", ".*s.s.*s..", "s*.s*s.*s."],
    legend: { "*": "glow", s: ["crystal", 3] }
  },
  "vault-wheel": {
    rows: [".###.", "#mMm#", ".###."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 3] }
  },
  // A ladder of rough rungs.
  "vault-ladder": {
    rows: Array.from({ length: 38 }, (_, row) => (row % 3 === 0 ? "WwwwW" : "W...W")),
    legend: { W: ["wood", 1], w: ["wood", 2] }
  },
  "vault-glint": {
    rows: ["*", "*"],
    legend: { "*": "glow" }
  }
};
