import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Mire of Osric (BIBLE 7.4): the Baron's fenland, drained for peat and rice, flooded on
 * the night of the Binding. What stands still stands in the water: a peat-cutter's hut on
 * its stilts, leaning, a line of Mirelle's bottles black against its lit window; the sluice
 * of the drainage works, its gate stuck half raised; a jetty going nowhere, a boat sunk at
 * its end; lantern posts along the drowned road, still lit for no one.
 */
export const MIRE_STRUCTURES: Record<string, StructureRecipe> = {
  // Mirelle's house on its stilts, the one place of the Mire still lived in, seen across
  // the water: leaning walls of planks on a timber frame, a thatch sagging and patched, a
  // crooked stovepipe, her window lit, a lantern on the porch.
  "mire-alchemist": {
    w: 42,
    h: 61,
    fragile: 22,
    growth: 0.55,
    seed: 4105,
    pieces: [
      { decor: "mire-alchemist-painted", at: [0, 60] },
      { decor: "lantern", at: [37, 38], keep: true }
    ]
  },
  // Middle distance: a cottage drowned to its eaves, its chimney still standing.
  "mire-drowned-cottage": {
    w: 40,
    h: 24,
    fragile: 8,
    growth: 0.5,
    seed: 4106,
    pieces: [
      { decor: "mire-drowned-cottage-painted", at: [0, 23] }
    ]
  },
  // Middle distance: the roof of a great barn, the water up to its ridge.
  "mire-sunk-barn": {
    w: 60,
    h: 20,
    fragile: 6,
    growth: 0.4,
    seed: 4107,
    pieces: [
      { decor: "mire-sunk-barn-painted", at: [0, 19] }
    ]
  },
  // Middle distance: the drowned road's posts, walking off into the fog.
  "mire-posts": {
    w: 70,
    h: 22,
    fragile: 4,
    growth: 0.3,
    seed: 4108,
    pieces: [
      { decor: "mire-posts-painted", at: [0, 21] }
    ]
  },
  "mire-stilt-hut": {
    w: 48,
    h: 58,
    fragile: 20,
    growth: 0.4,
    seed: 4101,
    pieces: [
      { decor: "mire-stilt-hut-painted", at: [0, 57] }
    ]
  },
  "mire-sluice": {
    w: 42,
    h: 40,
    fragile: 12,
    growth: 0.55,
    seed: 4102,
    pieces: [
      { decor: "mire-sluice-painted", at: [0, 39] }
    ]
  },
  "mire-jetty": {
    w: 64,
    h: 18,
    fragile: 4,
    growth: 0.3,
    seed: 4103,
    pieces: [
      { decor: "mire-jetty-painted", at: [0, 17] }
    ]
  },
  "mire-lantern-post": {
    w: 18,
    h: 42,
    fragile: 14,
    growth: 0.3,
    seed: 4104,
    pieces: [
      { decor: "mire-lantern-post-painted", at: [1, 41] },
      { decor: "lantern", at: [11, 13], keep: true }
    ]
  }
};

export const MIRE_DECOR: Record<string, DecorGrid> = {
  // mire-jetty, painted then traced.
  "mire-jetty-painted": {
    rows: [
      "",
      "...............................................cb",
      "..............................................ccbb",
      ".................................aaaaaccaccc..ddabb",
      "...bb......bbbbbbabbbbbbbaaaaacccccccbaaacccd.ddacc",
      "bbbbbbbbbbbbabbbbabbbbbbaaaaabbbcdbbbbaccdccd.aaccc",
      "bbbbbbbbaaaaabbbbbbbbbbbaccadbbbbdbbbbccddddd.ddccc",
      "bbbbbbbbbaaacbbbbbbbbbbbccdadddbbbbbbccdd*d*o.*oco*",
      "bbbbbbbbaaaacbbbbbbbbbbbaddcdddbbbbbbccd****..o****",
      "bbbbabbbaaaaaaaaabbbbbbaaddccddbb.bdddc.......bb***",
      "bbbbaabbbaa......bbbaab...........cdddc.......dddddd",
      ".bbbccb..........aaaaab...........ccddc........ddcdd",
      ".bbbbbb..........aaaabb...........cccaa...dd...ddccc",
      ".bbbbbb..........aaabbb...........ccccc..cccd..ddddd..aa",
      ".bbbbbb..........bbacca...........ccccc..dddddccaaaaabbbb",
      ".bbbbbb..........bbbbba...........aaaaa...cccaaaabbaabbbbb",
      ".bbaaab..........bbbbbb...........abbbb....caaaaaaaaaaaaaa",
      "..bbdd............aaaa.............aaa.......aaaaaaaaaaa"
    ],
    legend: { a: ["wood", 1], b: ["wood", 0], c: ["wood", 2], d: ["wood", 3], "*": "glow", o: "core" }
  },
  // mire-stilt-hut, painted then traced.
  "mire-stilt-hut-painted": {
    rows: [
      ".....................eeff",
      "....................effgg",
      ".................eeeeeffgffg.........gge",
      "................ffffeffffffgf.......egggg",
      "..............eeffeeeffffffffff.....effhhh",
      "............eeefffeeefffffffffffe...ffffhhh",
      "...........eggffeeeefgffffffffffgg..fffffgh",
      ".........eeffeeeeeeefggfffffffffggfffffffghh",
      ".......eeeeeeeeeeeeefggffffffffffghheeefffhhh",
      "......eeeeeeeeeeeeeeffgffffgffgggffgggeeefffhhh",
      "....eeeeeeeeeeeeeeeefffffgfgggggggffffgggffhhhhh",
      "...feeefffffeefegeeffgggggggghhggggfffffgbbgggh",
      ".ffeeeffgggfggfgggchhhhhhhhhhhhhhhhfffggggggghh",
      "eeeeaaaabbbabbbbbbchddddddddddddddccbbbbbbbbgh",
      ".eeaaaaaaabaaaabbaabcbbddccccccccddbaaabbbbcch",
      "..caaaaababaaaabbbbbcccdddddddddccdbbbbbbbbcbb",
      "..caaaaabababbbbbbcbcdcd*d*ddddddcdbbbbbbbbcb",
      "..c.aaaabbbbbbbbbbcbcddd**o***dddcdbcbbbbbbcc",
      "....aaaabbbbaaaabbcccddd**odd*dddddccbbbbbbcc",
      "....aaaabbbaaaaabccccdd***oddo*ddddcdcbbcbbcc",
      "....aababbaaaaaaacccddd***odoo***ddddccbcbbcd",
      "....aabbbcaaaaaaabccddd***o*oo***ddddccbccccdd",
      "....aabbbcaaaaaaabccddd*dd****dddddddccbcbccdd",
      "....aabbbcaaaaaaabccddddddddddddcddcdccbcbccdd",
      "....aabbbcaaaaaaabcccdddddddcccccddcdccbccccd",
      "....abbbbcaaaaaaabcccdddcddccccccccbbcbbbbccd",
      "...eebhhggaaaaaaabbdcccccddccccccccbbcbbbbccdc",
      "...eeehhggaaaaaaabbdcccccccccccccbdbbbbbbbccdc",
      "...eeeehgbaaaaaaabbccccbcccccccbcbdbbbbbbbccccc",
      "...eeeeeebaaaaaaaabddcbbbcbbbbbbbcdccccccbbbccdd",
      ".aaffeaaabaaaaaaabbdddccccccbcccccccddddccccbbcd",
      "aaaccbbbbbbbbbbccbbccddddddddddddddcccbbbbbbbbcd",
      "aaabbbbbbbbbbbbcbbcccddddddccbbbbbbbcbbbbbbbbbbd",
      "aaaabbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbcd",
      "aabbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaabaaabaabcbc",
      "aaabbbbbbbaaaabbaaaaabbaaaa.b.aaabaacaaaaaabc",
      ".aaaaaaaaa.....b.aaaaab........abbaacaaaaabbd",
      "..c..aaaaa.......aaaaab........abbbb.aaabbbbd",
      "..c..aaaaa.......aabbab........abbbb.aaaaabbd",
      ".....aaaba.......aabbaa........abbba.aabaabbd",
      ".....aabba.......aabbbb........abbba.aabbbbbdd",
      ".....aabba.......aaabbb........abbbb.babaabbbd",
      ".....aaaba.......aaabbb........abbbb.babaabbbd",
      ".....aaabb.......aaabbb........bbbbb.aabbbbbbd",
      ".....aabbb.......aaabcb........bbbcb.aabaabbbd",
      "....bbaabb.......aabbcb.........bccc..abaabbcd",
      "....bbaab........aabbbb.........bccbb.ababbbcd",
      "....ababb........aaabbb.........bcbbb.abaabbbcc",
      "....aaaab........aaabbb.........bbbbb.abaababbdd",
      "....aaaab........aaabbb.........bbbbb.abaababbcd",
      "....aaaab........aaabbb.........abbbb.abaababbcd",
      "....aaabb........aaabbb.........abbbb.abaababbcd",
      "....aabba........aabbbb.........abbbb.ababaabbcd",
      "....abbba........aabbbb.........abbbb.abbbaabbbd",
      "....abbba........aaabbb.........abbbb.ababaabbbd",
      "....aabba........aaabbb.........abbbb.aaaaaaabbd",
      "....aabb.........aaabbb.........aabbb.aaaaaaabbb",
      ".....abb..........aabbb..........abb"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 2], d: ["wood", 3], e: ["rock", 0], f: ["rock", 1], g: ["rock", 2], h: ["rock", 3], "*": "glow", o: "core" }
  },
  // mire-sluice, painted then traced.
  "mire-sluice-painted": {
    rows: [
      "....................ii",
      "..................iiiiii",
      ".................iiiiiiii",
      ".................ii.iiiii",
      ".................efiiee.ee",
      ".................effieeee",
      ".................eeeieeee.....g",
      "...eeeeeeeeeeeeeggeeiiifgggggggeeffggge",
      "...bbbbbbbbbeeeeggggiiifgggeeggaabaabbbe",
      "...bbbbbbbbbaeeggggkiiiggggeeaaaabbabbbd",
      "...bbbbbbbbaaaggggkkjikllfggcaaaaababbbd",
      "....bbbbbbbbaaaggkkkjkkllfggcabbbbccbbc",
      "....bbbbaaaaaag.eek.*ol..ggg.ddccbbccc",
      ".....bbbbbaaagg.eee.hhl..ff..ddaaabccc",
      ".....abaaaddfff.ee.......ff..hdddacaac",
      ".....abaacddfhfeeeeffhhfhfggehdddccaac",
      ".....abaacddfheeeeeffhhfhfggehddcccdaa",
      ".....bbbbaadffeeggfhfhhhhhgggddccaadac",
      ".....baaaaddfhfeggfhhhhhhhggghdddcddac",
      ".....aaaadddfhfeggfhhhhhhhggghdddccdaa",
      ".....aaaacddfhfegghhfhhfhhggghdddccdac.a",
      ".....bbaacccggeegghhfhhfhfgfggdaaaadac.c",
      ".....aacccddghfefgfhfhffhfgfghddddddbcca",
      ".....abbccddghfgfgffgffgffgfghdddddbbbb",
      ".....bbbccddggggfgffgffgffegggdaaaabbbb.c",
      ".....aaaccddfffegggfggfgfgegggdddcccaca.c",
      "..b..aaaccddfffeggggegggggeggfdddccaacacc",
      "..bb.aaaaccdfffegeggegggggeeefdddcaaacbcc",
      "..bb.baaaaaafggegeggeggeggeeeedbbaabbbba",
      ".b.b.baaaaccgggegegeeggegeeeeedccccaabba",
      "..bbbbaaccccgggeeeeeeeeeeeeeegdccccaaabb",
      "..bbbbabaaaaaeeeeeeeeeeeeeeeegcaaaabaacc.a",
      "...bbbabbacccceeeeeeeeeeeeeeedcccabbddbcc",
      "...bbbaabaacccceeeeeeeeeeeeebdcccabadabaa",
      "..bbbbbabbaaccabeeeeeeeeeeebbdccccaaaabaa",
      ".bbbbbbabbbbaaabbeeeeeeeeebbbbaaccaababbba",
      ".bbbbbccbbbbacaabbeeeeeeeeaaaabbcccbbabbbc",
      "..bbbbbaabaaccccdddgg..eccaaaaccaaabbbbb",
      ".......a...aa.cdddd..........a....a"
    ],
    legend: { a: ["stone", 1], b: ["stone", 0], c: ["stone", 2], d: ["stone", 3], e: ["wood", 0], f: ["wood", 2], g: ["wood", 1], h: ["wood", 3], i: ["metal", 0], j: ["metal", 1], k: ["metal", 2], l: ["metal", 3], "*": "glow", o: "core" }
  },
  // mire-lantern-post, painted then traced.
  "mire-lantern-post-painted": {
    rows: [
      "...bb",
      "..abbb",
      ".aabaaab",
      ".aabaabbbbbbbbb",
      ".aabbaaabbbbbbba",
      ".aabaaaaabaabbaa",
      ".aabaabbbbaabbb",
      ".babbbb.babbaa",
      "bbbbbc.bbaccbbb",
      "bbbbcc.bbdd*bcc",
      "bbbbcc.bc*oo*dc",
      "bbbbcd.cc*ooodd",
      ".aabcd..ddd*ddd",
      ".aaccd..ddcccc",
      ".aaccd....ccc",
      "baacdd",
      "baacdd",
      ".aaad*",
      ".aacd*",
      ".abcd*",
      ".abcdd",
      "aaacdd",
      "aaacddd",
      "aaabdd",
      ".aabcd",
      ".aabcdd",
      ".aabbb",
      ".aabbb",
      ".abbbb",
      ".abbbb",
      ".abbbbb",
      ".aabbb",
      "aaabab",
      "aaabab",
      "aaaaaa",
      "aaaaaa",
      "aaaaaa",
      "aaaaaaa",
      "aaaaaaa",
      "aaaaaaa",
      "aaaaaaa",
      "aaaaaaa"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 2], d: ["wood", 3], "*": "glow", o: "core" }
  },
  // mire-alchemist, painted then traced.
  "mire-alchemist-painted": {
    rows: [
      "..............................iij",
      ".............................iijjj",
      ".............................iiiii",
      "......................e......iiii",
      ".....................fff.....iiii",
      "..................ffffffg....iijj",
      "..............f.ffffffgeff...ijj",
      ".............ffffffeeggeffg.fijj",
      "............fffeeeeeeggefffffijj",
      "...........afeeeeeeeggeffffffijj",
      "..........aaaeeeeeeghgefffffffgg",
      ".........aaaaeeeeeeghgeeefffefgg",
      "........aaaaaffeffeghfggggffeeegh",
      ".......faaffeeeeeehggffhhhhgggeghh",
      "......fffeeeeeeeehhgffffhhhhgggghhh",
      ".....affeeeeeeeehhhgeeffhhhhhghhhhhh",
      "....aaaaaaaaabbbbbbbbbbaahdddcccccbhh",
      "...aaabbaabbaabbbbbcbbbaaaccccccccbbhh",
      "..aaaaaaaaaaaaaaaabccbbbaaaaaaabbbabbh",
      "..aaaaaaaaaaaaaaabbccbbbbaaaaaaaaaab.h",
      ".....aaaaaaaaaaaabbccbbbbbbbbaaaaaa",
      ".....aaaaaaaaaaaabcccbbbbbbbbbbbbaa",
      ".....aaaaaaaaaaaabcccbbccdbbbbbbbac",
      "......aaaaaaaaaaabcccbbdddbccbbbbbc",
      "......aaaaaaabaaabcccbbdddbccbbbcbc",
      "......aaaaaaabaaabccccb*dddcccbbcbc",
      "......aaaaaaaaaaabccccbddddcddccccc",
      "......aaaaaaaaaaabcdcbbddcccddcddccccccc",
      "......aaaaaaaaaaabdddcbcdddddddddccccbbb",
      "......aaaaaaaaaaabddccccccdcccdd*dd...bb",
      "......aaaaaaaaaaaaddccdddddddddd***.kkll",
      "......aaaaaaaaaaaad*cc*ddddddddd***.oo*l",
      "......aaaaaaaaaaaad**o*dddddcccddd*.*l*k",
      "....aaaaaaaaaaaaaacc*dddcccccccccd*ddllk",
      "....aaaaaaaaaaaaaaccddccccccccccccddccbb",
      "....aaaaaaaaaaaaaaaabbaaaaababbaaaaaaaa",
      "....aaaaa..aaaa.aaaaaaaaa..babb...aaaaa",
      "a....aaaa..aaa..baaaaaaaa...abb..aaaabb",
      "aa....aaaa.aaa..baba.aaaa...abb.abb.abb.c",
      "bb....aaaa..aaa..abb.aaaa...abbcbb..abb.c",
      ".bb...aaaaaaaaadaacc.aaaa.d.bbcbbdd.bbcccc",
      "bbbd.aaadaaaaaadcacddaaaadddbbcbcdddcbbdcc",
      "bacddaaadcaaaacdcacddaaabdddbbbccdddcabdcc",
      "bacccaaadccaaacdcacddaaabddbbabccccccabccc",
      "babbcaaadccaaaadbacddaaabdbbaacccccccabccc",
      "babbcaaadddcaaadbaccdaaaabbccabccccccaabbc",
      "aabbaaaabcdcaaaaaacccaaaabcddabcdccccaaabb",
      "aabbbaaabccaaaaaaacccaaaabcddabbdddccaaabb",
      "aabbbaaacccaaabbaacccaaaaddddaabddddaaaabb",
      "aaabaaaacccaaabdaaaccaaaaaddaaaaddddbaaaab",
      "bcabaaaaacdaaabdaaaacaaaabbbaaabbdddbabbaa",
      "bcabcaaaaddbaaabaaaabbbbbccddccbddddaabaaa",
      "bbaacbbacddbbbbbabbccbccbbcddcbbbdddaaabaa",
      "bbaaabbacddbccbbccccdbbbcdccdbcaaddddaabac",
      "aabaaaabbaaacccccccddbbbcddbbbccaaaddaaaac",
      "aabaaaabbaabbbddcccddbbbcdddbabccaabbaaaaa",
      "aaaaaaabaabbaaddcbdddbbbbbbbaabcccaaaaaaaa",
      "aaaaaaaaaaaaaccccbdddbbccccccccccbbaaaaaaa"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 2], d: ["wood", 3], e: ["roof", 1], f: ["roof", 0], g: ["roof", 2], h: ["roof", 3], i: ["metal", 0], j: ["metal", 1], k: ["metal", 2], l: ["metal", 3], "*": "glow", o: "core" }
  },
  // mire-drowned-cottage, painted then traced.
  "mire-drowned-cottage-painted": {
    rows: [
      "...........................aaaaaaa",
      "...........................aaaaaba",
      "...........................aaaabba",
      "..................ee.......abbbbba",
      ".................eeeee.....abaaaba",
      "................eeeeeee....aababba",
      ".................ffggeee...aabaabb",
      "..................fhhffggg.acbbbbb",
      "...........hh.....hhhhhhgggacbbbba",
      ".........gghhh.eeeehhhhhhffgcbbbba",
      "........ggghheeegggehhfffffghaaaa",
      ".......eehhheeeegggeeffffffhhha",
      ".....eeffhhhhhhhhhhhhfefffhhhhhee",
      "....egfffeeehhhhheehhfeefffffhhhee",
      "...eegfffeeeeeffhheeehheeffffffffff",
      ".eeffffhhehhheeffhhhheeeeeefhhhhfffgg",
      "eeffffeehhhhhhhfeffhhheeheeeffffffffff",
      "effffaehhffffffdeefgghhhheeeeffffffffff",
      "ffffaaabhfffffddddddddbbaaaaaaabbbhhhf",
      "...aaabbbgggddccddccddbaaaaaaaaaaaa",
      "...aaabbbggddddcbbbcdddbaaaaaaaaaaa",
      "...cbbbbd**ccccc*o**d*dbaaaaaaaaaaa",
      "...cbbbddcccc**cccc*c**daaaaabbbaaa",
      "....bddddc*ccccccccccc*daaaaabbbbb"
    ],
    legend: { a: ["stone", 0], b: ["stone", 1], c: ["stone", 3], d: ["stone", 2], e: ["roof", 0], f: ["roof", 2], g: ["roof", 3], h: ["roof", 1], "*": "glow", o: "core" }
  },
  // mire-posts, painted then traced.
  "mire-posts-painted": {
    rows: [
      "....aa",
      "...aaaa",
      "..aaaaa",
      "..aaaaa",
      "..aaaaa..............aa",
      "..aaaaa..aabba......ccaa",
      "..aaaaaaaaabbaaooc.cccaaa",
      "..aaaaaaaaaaboooocccoooaa.............*o",
      "..aaaaaaa.....ooocooooodaaabdaaa.....*oo*",
      "..ccdaa...........occoodaaabdoaoaaa..*oo*",
      "..cddda............oooocaaabbaaoaoaaa***c.........ca",
      "..cdbdc............ooooca.......oaoooc**c........ccaa",
      "..ccbdc............ccccoa..........oocccc........cccc",
      "..cdbdc............ccccca...........ocdcd........cccc..........bd",
      "..ddbdc............ccccca............cddd........cccc.........bbdd",
      "..ababb............ccccca............cdd.........ccdc.........bbdb",
      "..ababb............ccccda...........ccdd.........cddd.........bbdb",
      "..aaabb............ddddda...........cddd..........dddd........bbbb",
      "..aaabb............ddddaa...........ddcc..........dddd........bbba",
      "..aaabb............ddddaa...........dddd..........dddb........bbba",
      "..aaaaa............dddaaa...........****..........dbbb........bbaa",
      "...aaa..............aaaa.............**............aa..........aa"
    ],
    legend: { a: ["wood", 0], b: ["wood", 1], c: ["wood", 3], d: ["wood", 2], "*": "glow", o: "core" }
  },
  // mire-sunk-barn, painted then traced.
  "mire-sunk-barn-painted": {
    rows: [
      "............................eeee",
      "..........................fgggeeee",
      ".........................ffggggeeee",
      ".........................bdddffaaa",
      ".......................bbbcddggaaaa.a",
      "......................bbccccffgdda.aaa",
      "....................bbcccaccbfgaaa..aaaa",
      "..................ccbccaaaacbbaaa....aaaaa",
      ".................bbbbcacccbccbccad....aaaaa",
      "...............ccbbccaabbbbaaccccdd.....aaaaa",
      ".............aaccbcccaabbbbaacacccddd....aaaaaa",
      "............aaabbcccaaabbbbaaaaacbbddd....aaaaaa",
      "..........daaaccbccaaacccaaadadaccbcdda..ddaaaaaaa",
      "........bbaaabbbccaaaaaaaddadddaacbccdadddddaaaaaaaa",
      ".......bddaabbbccaaacaaadddadddaaacacccddaaaaaaaaaaaa",
      ".....bbaaabbbbccaaaacaadddddddddddcaaaccdddddddaaaaaaaa",
      "...bbbbaccbbbccaaaaacaadaddddddddaaddcccdddddddaaaaaaaaaaa",
      "..bbbbbabbbccccccccacccaaadddddddddddcccadcddbbcccbbccccccc",
      "bbbbbbbdaabbccaaaaccccbbbbbbbbbddddddaaaddcbabbcbbbbcbbbcccc",
      "bbbbbbbddabbcccccaaddbbbbbbbbbbddd**ddd*ddbbabbcbbbbbccccccc"
    ],
    legend: { a: ["roof", 2], b: ["roof", 0], c: ["roof", 1], d: ["roof", 3], e: ["wood", 0], f: ["wood", 2], g: ["wood", 3], h: ["wood", 1], "*": "glow" }
  },
  // The ladder from the porch down into the water.
  "mire-ladder": {
    rows: ["w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "wWWw", "w..w", "w..w", "w..w", "w..w"],
    legend: { w: ["wood", 1], W: ["wood", 2] }
  },
  // Mirelle's bottles on the sill, black against the window, one still glowing.
  "mire-bottles": {
    rows: [".#....*..", ".#..#.*.#", "###.#*c*#", "###.#***#"],
    legend: { "#": "outline", "*": "glow", c: "core" }
  },
  // The sluice's winch wheel, rusted still.
  "mire-wheel": {
    rows: ["..###..", ".#m#m#.", "#m.m.m#", "##mMm##", "#m.m.m#", ".#m#m#.", "..###.."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 3] }
  },
  // A rowboat, its stern sunk, its bow up out of the water.
  "mire-boat": {
    rows: ["##..............", "#w#.........##..", ".#ww#....###ww#.", "..#wwwwwwwwwWW#.", "...#WWWWWWWWW#.."],
    legend: { "#": "outline", w: ["wood", 2], W: ["wood", 1] }
  }
};
