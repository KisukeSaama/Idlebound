import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Wychwood (BIBLE 7.2): the Grove's forest, where Séraphine was trained. Its people
 * built little and built into the trees: a house hollowed in the foot of a giant, seen
 * from the path and small with the distance, its door under a thatched porch, a balcony
 * ringed round the trunk under a hat of thatch, a window still lit, an owl keeping
 * watch; a dolmen where the druids laid offerings; a wayside shrine by the path,
 * a green cloak torn on it, where the forest grew thorns. Deeper in, half lost in the air,
 * a watch-hut up a trunk, standing stones and a rope bridge.
 */

/** A balcony rail as long as `long`: a lit top bar, posts every fourth column, a lower bar. */
function rail(long: number): string[] {
  const post = (x: number) => x % 4 === 0 || x === long - 1;
  return [
    "W".repeat(long),
    Array.from({ length: long }, (_, x) => (post(x) ? "w" : ".")).join(""),
    Array.from({ length: long }, (_, x) => (post(x) ? "w" : x % 4 === 2 ? "d" : ".")).join(""),
    "w".repeat(long),
    Array.from({ length: long }, (_, x) => (post(x) ? "d" : ".")).join("")
  ];
}

/** A ladder `tall` rows high: a rail in shade, a rail in light, a rung every fourth row. */
function ladder(tall: number): string[] {
  return Array.from({ length: tall }, (_, y) => (y % 4 === 1 ? "dWWWW" : "d...W"));
}

export const WYCHWOOD_STRUCTURES: Record<string, StructureRecipe> = {
  "grove-hut": {
    w: 46,
    h: 67,
    fragile: 32,
    growth: 0.5,
    seed: 2101,
    pieces: [
      { decor: "grove-hut-painted", at: [0, 66] },
      { decor: "owl", at: [37, 13] }
    ]
  },
  "grove-dolmen": {
    w: 44,
    h: 32,
    fragile: 12,
    growth: 0.6,
    seed: 2102,
    pieces: [
      { decor: "grove-dolmen-painted", at: [0, 31] },
      { decor: "candle", at: [19, 31], keep: true },
      { decor: "candle", at: [24, 31], keep: true }
    ]
  },
  "wayshrine": {
    w: 20,
    h: 42,
    fragile: 16,
    growth: 0.35,
    seed: 2103,
    pieces: [
      { decor: "wayshrine-painted", at: [0, 41] }
    ]
  },
  // Deeper in the wood: a watch-hut up a trunk, its one window awake.
  "grove-watch": {
    w: 40,
    h: 70,
    fragile: 30,
    growth: 0.4,
    seed: 2104,
    pieces: [
      { decor: "grove-watch-painted", at: [0, 69] }
    ]
  },
  // Standing stones in a ring, older than the Grove.
  "grove-stones": {
    w: 46,
    h: 26,
    fragile: 8,
    growth: 0.6,
    seed: 2105,
    pieces: [
      { decor: "grove-stones-painted", at: [3, 25] }
    ]
  },
  // A rope bridge slung between two trunks, sagging.
  "grove-bridge": {
    w: 64,
    h: 48,
    fragile: 10,
    growth: 0.3,
    seed: 2106,
    pieces: [
      { decor: "grove-bridge-painted", at: [0, 47] }
    ]
  }
};

export const WYCHWOOD_DECOR: Record<string, DecorGrid> = {
  // grove-stones, painted then traced.
  "grove-stones-painted": {
    rows: [
      "...............bb",
      ".............accbb",
      "............aaaddb",
      "............aaaccbb",
      "......bb....aaaaacb",
      ".....aab....aaacccb.......cc",
      "....aacdd...aaacccb......cccc",
      "....aacdd...aaacccb.....dccccd",
      "....aaddd...aaacccb.....dccccd",
      "....aaddd...aaacccb.....dcccad...bd",
      "....aadddd..aaacdcb.....dcccad...bdd",
      "...aaaddabb.aaacdcb.c...dccccd..bbcc",
      "....aaddaab.aaacccbccd..cccccd..bdac",
      "....aadaaadbaaacccbccc..cbbddc..ddac",
      "...aaacaaadbaaacbbddccddccccdcdddcac",
      "..aaaacaaacbaaaacbbccddddcacccdddcac",
      "..aaaacaaacbaaacccbccccaccacccacdcacc",
      ".aaaaaaaaacbaaaacccccccaccccacaccaaaac",
      ".aaaaaaaaaabbcaacacbbdddacaaaccccaaaac",
      "aaaaaaaaaaabbcaaaacbbbbbacaaaccccccddc",
      ".aaaaaaaaddbaaaaaaabbbbaaaaaaaaccccaac",
      "..aaaaaddaaaaaaaaacbbbbaaaaaaaaddcaaaa",
      "...aaaaaaaaccccacccddcccaacccaaaaaaa",
      "......aaaaaaacaaacdddcccccaacaaaaa",
      "......aaaaaaaaaaaaaaaaaaaaaaaaa",
      "...............aaaaaaaaaa"
    ],
    legend: { a: ["rock", 0], b: ["rock", 3], c: ["rock", 1], d: ["rock", 2] }
  },
  // grove-bridge, painted then traced.
  "grove-bridge-painted": {
    rows: [
      "..aaaaaaabb..........................................babbbbabbc",
      ".aaaabbbbddd........................................bbabbcbabacd",
      ".aaaabbbbddd............eefffffffffffffg............ccbbccbabacd",
      ".aaaabbbccdd.........eeffggffgggggfggggeehh.........ccbbccbabacc",
      ".aaaabcbccdd.......eefefeeeeeeeeeeeeeeeeehhhh.......ccbbccbbbbcd",
      ".aaaabcbcdddd...eefggfeee...............effhffff....bcbcccbbbbcd",
      ".aaaabcccdddde.ffefee......................hffffgg..bbaccccbbbcd",
      ".aaaabcccddffffffee........................hhffggffeaaaabbcbbbdd",
      ".aaaabcbbbcfffff................................gffeeeabcdcbbbdd",
      ".aaaabcbbbbafff...........eeeggggggghhh..........hfeeaabcdcbbbcd",
      ".aaaabcbcddbb.........eegggggggghhhgghhhggg......h.eaaabcdcbcccd",
      ".aaaabcbcddbb......fhhhgggfffeeeffefffggggggg......aaabbcdcbcbdd",
      ".aaabbcbcddcbb..fhhgfhheeeeeeeeeeeeeeeeeeeggghhf..ebbbbbcccbbbdd",
      ".aaabbcccdccceeeehheeffeeee...........eeeeeffhhffeebbbbbccdbbbdd",
      ".aaaabcccdcceeeeeheeeef..................eeeeeefggeffbbbcddbbbdd",
      ".aaaabccccfeegggeeee.........................eeeeggfeebbcdcbbbdd",
      ".aaaabcccgfeffeeeg............................eeeeggfgbbcccbbbdd",
      ".aaaabcccgeeeeeeeggh.........................feeeeeefggbbccbbbdd",
      ".aaaabbccbbeeeeeegghh.....................gfffeeeeeefaadbccbbbdd",
      ".aaaabcccbba..eeegghhhh..................hffffeeee..baadcccbbbdd",
      ".aaaabccccba...eeeghhhhh...............cggffffeee...baabbccbbbdd",
      ".aaaabccbcbc...eeeeeffcddddd.........dcccggffeee....aaabbccbbbdd",
      ".aaaabccbbbc.....eeeeccccbdddd....ddddabcccfee......baaabccbbbdd",
      ".aaaabcccbcc......eaaaccbbcdccdddddcccabbbbaa.......bababccbbbdd",
      ".aaaabcccccc.......aaaaaabcbbcccccccbbbaaaaa........bbbabccbbbcd",
      ".aaaabbbcccd.........aaaaabbbbccccbbbbbaaa..........bbbaaccbbbcd",
      ".aacabbbbccd...........aaaaaabbbbcbaaaaaa...........bbbbbbcbbbcd",
      "aaacbbbbbcdd............abbaaaaaaaaaaa..a...........bbabbbbbbacd",
      ".aaabbabbcdd..................aaaa..................bbabbbbbbacd",
      ".aaaaaabccdd........................................bbabbbbbbbcd",
      ".aaaaaabbcdd........................................bbabbbbbbbcd",
      ".aaaabbbbcdd........................................bbaabbbbbbcd",
      ".aaaabbbbbdd........................................bbabbbbbbbcd",
      ".aaaabbbbbdd........................................bbaabbbbbabd",
      ".aaaabbbbbdd........................................bbbabbbbbabd",
      ".aaaabbbbbbd........................................cbbabbabaabd",
      ".aaaabbabccd........................................cbbabbaaaacd",
      ".aaaabbabccd........................................bbbabbaabacd",
      ".aaaaaaabccd........................................bbabbbbababd",
      ".aaaaaaabccd........................................baabbbaababc",
      ".aaaaaaabccd........................................baabbbaaaabc",
      ".aaaabbabccd........................................bbababaaaabc",
      ".aaaaaabbbcc........................................bbabaaaaaacc",
      ".aaaaaabbbcc........................................bbaaaaaaaabb",
      ".aaaaaaabbbc........................................bbaaaaaaaabb",
      ".aaaaaaaabbc........................................bbaaaaaaaabb",
      ".aaaaaaaabbb........................................bbaaaaaaaaa"
    ],
    legend: { a: ["bark", 0], b: ["bark", 1], c: ["bark", 2], d: ["bark", 3], e: ["wood", 0], f: ["wood", 1], g: ["wood", 2], h: ["wood", 3] }
  },
  // wayshrine, painted then traced.
  "wayshrine-painted": {
    rows: [
      ".........ff",
      "........eeff",
      ".......feeeff",
      "......ffeeeefg",
      ".....ffeeeeeegg",
      "....eeeeeeeeefgg",
      "...ffeeeeeeffffgg",
      "..ffeeeeeeeffhfggh",
      ".feeeaeeeefffhhgghh",
      "ffeeaaabbbbbbbbgghhh",
      ".eebbabbbbbbbbabbhh",
      "...bbabbbbbbbbabb",
      "...bbabbaababbabb",
      "...ababbdaaabaacd",
      "...aaaaadcaabaccd",
      "...aaaaaccaaaccdd",
      "...caaabaaaabdddd",
      "...caaabaabbbcddd",
      "...caabbccbbbccdd",
      "....aabbbbbbbbcc",
      ".......bbbbbb",
      ".......bbbbbb",
      ".......bbbbbc",
      ".......abbaac",
      ".......abaacd",
      ".......abaccdd",
      ".......aaacccad",
      "......aaaaaabaddd",
      ".......aaaaabaadd",
      ".......abaaaaaaad",
      ".......abaabaabbbc",
      ".......aaabbbabbba",
      ".......cbabbbabbcc",
      ".......cbbbbbbb.c",
      ".......abbbbbb",
      ".......abbbbb",
      ".......abbbba",
      ".......bbbbba",
      ".......bbabba",
      ".......baabbb",
      ".......baabbb"
    ],
    legend: { a: ["wood", 1], b: ["wood", 0], c: ["wood", 2], d: ["wood", 3], e: ["roof", 0], f: ["roof", 1], g: ["roof", 2], h: ["roof", 3] }
  },
  // grove-dolmen, painted then traced.
  "grove-dolmen-painted": {
    rows: [
      "...............................bbbbc",
      ".....................dbbbddddaabbbbcc",
      ".............ddddddddaabbbbbaaaabbaccc",
      "........ddddddbbaaabdaabbbaabbdabbaccccc",
      ".......bddbbbbbbbbbbbaaaaadddddabbaaacccc",
      "......bbddbbbddddbddbabbdddbbddbbdabbaacc*",
      ".....bbbddbbddddbddbaabddddbbbddddbbbaaaac*",
      "....ddddddddddbdbdbbabbddaabbbddbbbbdaabbccc",
      "...dddddddbddbbbddddbbbbaabbbdddddbbdabbbcc",
      "..ddddddddbdbbbbdddddbbaaaabbbbbbbbbdbbbccc",
      ".dddddddddbdbbbddddddbaaaabbbddddddddddbaa",
      "dddddddddddddbbdbbbbdddddbbbbdddddbbddbbc",
      ".dddddddddddbbbdbbbbbbdddbaabddddddbddbbc",
      "..ddddddddddbbddddbbaacccbaddddddddbbbaa",
      "...dddddddddddddddbcccc...bddddbbbdbbacc",
      "....dddddddbbdddbbc........bbbbbbbbbbacc",
      "....dddddddbddddaac........baabbbbbbbac*",
      "....dddddddbdbdbc...........caabbaabbbbc",
      "....dddddbdbdbbbc...........ccabbbabaaac",
      "....dddddbdbdbbcc...........ccbbbbbbaacc",
      "....dddddddddbbcc..........cccbbdddbbacc",
      "....ddddbbdddbbac..........ccbbdbbbbbaac",
      "....dddbdddddbbac..........ccbbdbbbbbaccc",
      "....dddbdddddbbac..........cbbbbdbbbbbbbc",
      "....dddbddddbbbac..........cbbbbdbdbbbbbc",
      "....ddddddddbbbac..........cbbbbdddbbdbba",
      "...ddbbddddddbbbc..........bbbbbddddddaaa",
      "...ddddddddddaabc...bb..ccbbbbddbddddbaaa",
      "...ddddddddddbccc..bbbd.cddbbbbdbdbdbbbba",
      "...ddddddddbbbaac..dbbddbdddbbbddbbbdbbbb",
      "....dddddddbbbbbc.dddd..bdddbddddddbddbbb"
    ],
    legend: { a: ["rock", 2], b: ["rock", 1], c: ["rock", 3], d: ["rock", 0], "*": "glow" }
  },
  // grove-hut, painted then traced.
  "grove-hut-painted": {
    rows: [
      ".............aaaaaaaaaaaaaaaaaaaaa",
      "............aabdddaaaaaaaaaaaaaaac",
      "............aabbdddddaaaaaaaabaacc",
      "............aabbbdbbdbbbabbabbbbcc",
      "............adbaddbbdbdbabbadbbbcc",
      ".....a......adaadaaadbddabaadbdbcc..b.....d",
      "....aaaa....adaaaaaabdddaaaadddbcc.bba...adc",
      ".....aaaaa..addddbbbbddbbabbbbbccc.baaacaabc",
      "......aabbaaabdbdbbbbiiibddbbcddcc.baacccabbb",
      ".......abbcccbbbbbbbjjiijdddacdccc.baacccaabc",
      "........aaabbbbbbbbbjjjjjdddabdccc.baabaddacc",
      "..........aaaaaaabbbijjjjdddabcccc..aabbdbbbc",
      "...........bbaaaaddiijjjjdddabcccc..aaabbbbb",
      "............aaaadddddjjjbdddabccccaaaaabbbb",
      "............adaddddddbbbbddddbcccaabbddcdb",
      "............adbdbdddddbbdddbddbaabbdccccd",
      "............adbbbdddddbddddbddbabbbdccc",
      "............addbbdbbdddddddbcddbbbcd",
      "............adcbaaabdeeeeedbcccbbc",
      "............accaabbffeeeeeffbbbbcc",
      "............accaaffffffeeeeeeeeccc",
      "............acfeeefffffeeeeeeeegcc",
      "............affeeffffffeeefeeeeghh",
      "..........afffffffffffffffffffggghhh",
      "........ieiiieeeffffffffeegggggghhhhhh",
      ".......fjjjiiiiiiiiiiiiiiiiiiiikkkllllik",
      "......ffjjjjjjjjjjjiiiiiiiiiiiiiiiiiiiiii",
      ".......jjjjjjaaabbbbiiikkiddaddbbbiiiiii",
      ".........jjjaaaaaaaajjikkkdaaaaaabiiii",
      "............aaaaaaaaj*ol*okaaaaaab",
      "............abaaaaabi*ollokddaaaac",
      "............abaaaabbillllllddaaaicd",
      ".....jjiijjjajiiiiiikllllllkkkiiiidkkkkkkk",
      "....jjjjijjiijiiiiiik*oloolkkkiiiiikkkkkiii",
      "....jjjjjjjjaabbbiiidllllldbbbbbbbjjiiijjji",
      ".....jjjjjjjaaaaaaaakccckccibaaaaaajjjjjjj",
      ".....jjjjjjjajjiiiikkkkkkciiiiiiiiiiiiiiii",
      "....jjjiijjjjiiiiiiiiikkkiiiiiiiiiiiiiiiiii",
      "....jjjjjjjjjaaaaabbbbbbbbbbbbbbbbjjiijjji",
      ".....jjjjjjjaaaaaaaaaaaaaaaaaaaaaaaiijjjj",
      "..........jjjaaaaaaaaaaaaaaaaaaaaadii",
      "...........jjjaaaaaaaaabbbaaaaaajjdi",
      "............jjjjaaabbbbbbbbbddbjjjj",
      "............jajjaabbbbddddbbaabiij",
      "............aaaaaabbbbddddbbddddcc",
      "............aaaaabbbbdddddbbddddcc",
      "............aaaaaaaaadddbbddbdddcc",
      "............abaaaaaabddbbbbdbdddcc",
      "............abaaaaaabdddabbdbbddcc",
      "............abbaaaaabdddabbbbbddcc",
      "............abbaaabbbbbdabbbbabbdc",
      "............abbbaabbbbfeebbbbabbdc",
      "............abbbaaaafffeeeebbabddc",
      "............abbbaafffffeeeeeebbbdc",
      "............abbbfffffffeeeeeeebbdc",
      "............abaaaaaaaajjjaaabbabdc",
      "............abaaaaaaaajjjjaaaaaabc",
      "............aaaaaaaaajjjjjjabdbbbcdaac",
      "........aaaaaaaaaaajjjjjjjjibdbdbdddccc",
      ".....aaabbbaaaaaaaajjjjjjjjiadbdbbbaacccc",
      "....addbbbbaaaaaaaajjjjjjjjiadbbaadaaacccc",
      "...aaaaabaaaaaaaaaajjjjjjjjiaaaaaadaaaaaccc",
      "..aaaaaaaaaaaaaaaaajjjjmjjjiabbaaaabaaaaaddc",
      ".aaaaaaaaaaaaaaaaaajjjmmmjjjabaaaacbbbbaaaadd",
      ".aaaaaaaaaaaaaaaaaajjmmmmmjjaaaccccaaaaaaaadd",
      "aaaaaaabbbaaaaaaaaannnmmqqqqmaabbbbaaaaaaaaadd",
      ".aaaaaaaaaaaaaaaaaammmmnqqnnmaabbbbaaaaacaaaab"
    ],
    legend: { a: ["bark", 0], b: ["bark", 1], c: ["bark", 3], d: ["bark", 2], e: ["roof", 1], f: ["roof", 0], g: ["roof", 2], h: ["roof", 3], i: ["wood", 1], j: ["wood", 0], k: ["wood", 2], l: ["wood", 3], m: ["stone", 0], n: ["stone", 2], p: ["stone", 1], q: ["stone", 3], "*": "glow", o: "core" }
  },
  // grove-watch, painted then traced.
  "grove-watch-painted": {
    rows: [
      "..............aaaaaaaaaaaaa",
      ".............abaaaaaacbbbdda",
      ".............abaaaaaacabddda",
      ".............abaaaaaccadddda",
      ".............abaaaaacccdddda",
      ".............ccaaaacbbcbddda",
      ".............dcaaaacbbcbddda",
      ".............dcaaaabbbbbbbda",
      ".............ccaaaaabbbbbbda",
      ".............accaccaabdbddda",
      ".............accacccccdbddda",
      ".............accacccccddddda",
      ".............acbacijjjddddda",
      ".............acbaiijjjjdddda",
      ".............aaiiiijjjjkkdda",
      ".............ajiiiijjjjjjjda",
      "...........iiiiiiiijjjjkklll",
      "..........kkkiiiiiiiiiiijjlll",
      "........iikkiiiiiiiiiijiijjkkii",
      ".......jjjiiiiiijiiiiijjkjkkklll",
      ".....iijjjiiijjjjijjjjjkkkkkklllll",
      "....jijjjiiiijjjjjjjlljjjklllllllll",
      "..jijjjjiiiijjjjjjjkkkjjjjlllllllllll",
      ".jjjjjjfffeefgeeeeggeeeeeeeggfffggllli",
      "..jjjefffffffgggeeggeeeeeffeefffffffi",
      "...jeefffffffeeeeeeeeeeefffefffffff",
      "...eeeffffffffeegggeeeeeefeeffeefee",
      "....eeefffeeefee*hh*hegeefeeeeeeege",
      "....fefeeeeeeee*ohhohggegeeeeeeeege",
      "....fefeeeeeeehhhhhhhhgggegeeeegggg",
      "....fefeeeeeeeghhhhhhhhhggggeeeggge",
      "....fefeeeeeeeghohho*hhhhgggeegggge",
      "....fefeeeeeeeghhhhhhhhhhgggggggege",
      "....fefefeeeeeeeegggeehgggggegegege",
      "....fefefeeeeeeggeggefggggeeeeeeege",
      "....fefeffefeeegeegggfggeeeeeeeeege",
      ".ffffefffffffeeeeegggeeeeeeffeeegggfff",
      "fefeeffeeeeeeegggghhhhgggghheeegggggfff",
      "fefffffeeeeeeeegggggggddcddeeeeeeggggee",
      ".fffffffffffffcccccccccccccaffffffffff",
      ".............aaaaaaaaaaaaaaaafffffff",
      ".............aaaaaaaaaaaaaaa.fffffee",
      ".............aaaaaaaaaaaaaaa.fffffge",
      ".............aaaaaaaacccacca.feeefgg",
      ".............aaaaaaaacccacca.feeefgg",
      ".............acaaaaabbccacda.fefffgg",
      ".............acaaaaabbcbacda.feeffgg",
      ".............abacaaabbcbccda.fefffgg",
      ".............abacaaaabccccba.eeeefeg",
      ".............abacaaaccbbccba.eeeefeg",
      ".............abacaaaccaaaaba.feeffeg",
      ".............aaacaaaccdddcba.fefffee",
      ".............abacaaaccdddcba.feeefee",
      ".............abacaaaacbddcda.fefffee",
      ".............adaaaaaaabbdbda.fefffge",
      ".............adaaaaaaccbdbda.fefffge",
      ".............adaaaaabccbbbda.eeeefge",
      ".............abaaaaabccbbbda.eefhfge",
      ".............abaaaaabbbccbda.eefhfge",
      ".............abaaaaacbccccda.eefffge",
      ".............aaaaaaacbbcccda.fffffee",
      ".............bbccaaaaabcccddffffhfee",
      "............bbcccaaaaaaaaccdffffhfef",
      "...........ddbccaaaaaaccaaabbfffffef",
      "..........cddbbaaaaaaacccaaabfffffef",
      ".........bbccaaaaaaaaaaabaaaaaffffef",
      "........bbbccaaaaaaaaaaabcaaaaffffef",
      ".......cbbaaaaaaaaaaaaacbcaaaaffffff",
      "......bbcaaa.aaaaaaccaacaaca.ffffaff",
      ".....cbbca....aaaaccccccacc..fffaaff"
    ],
    legend: { a: ["bark", 0], b: ["bark", 2], c: ["bark", 1], d: ["bark", 3], e: ["wood", 1], f: ["wood", 0], g: ["wood", 2], h: ["wood", 3], i: ["roof", 0], j: ["roof", 1], k: ["roof", 2], l: ["roof", 3], "*": "glow", o: "core" }
  },
  // A lantern on its chain, the flame breathing.
  lantern: {
    rows: ["..#..", "..#..", ".#m#.", "#mMm#", "#*c*#", "#***#", "#*c*#", ".#m#."],
    legend: { "#": "outline", m: ["metal", 1], M: ["metal", 3], "*": "glow", c: "core" },
    frames: [[], [{ x: 1, y: 4, rows: ["*c*", "*c*", "***"] }], [], [{ x: 1, y: 4, rows: ["***", "*c*", "*c*"] }]]
  },
  // An owl on the bough, its eyes in the dark; it blinks now and then.
  owl: {
    rows: ["#.....#", "##...##", "#bbbbb#", "#e#b#e#", "#bbvbb#", ".#bBb#.", ".#BbB#.", "..#B#..", "..#.#.."],
    legend: { "#": "outline", b: ["bark", 2], B: ["bark", 1], v: ["bone", 3], e: "glow" },
    frames: [[], [], [], [{ x: 1, y: 3, rows: ["#"] }, { x: 5, y: 3, rows: ["#"] }]]
  },
  // The Grove's rune, a tree with its arms raised, cut into wood or stone, still glowing.
  "rune-grove": {
    rows: ["*.*.*", ".***.", "..*..", "..*..", "..*.."],
    legend: { "*": "glow" }
  },
  // A candle stub left at the foot of the stones.
  candle: {
    rows: [".*.", ".c.", "#b#", "#b#"],
    legend: { "*": "glow", c: "core", "#": "outline", b: ["bone", 3] },
    frames: [[], [{ x: 1, y: 0, rows: ["c", "*"] }]]
  },
  // A green cloak caught on the shrine's post, torn.
  cloak: {
    rows: ["#......", ".#kk...", "..kKk..", ".kKKk..", ".kKKKk.", "kKK.Kk.", "k.K..k.", "..K...."],
    legend: { "#": "outline", k: ["cloth", 2], K: ["cloth", 1] }
  },
  "ladder-short": {
    rows: ladder(32),
    legend: { d: ["wood", 0], W: ["wood", 2] }
  }
};
