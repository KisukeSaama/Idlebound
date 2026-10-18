import type { DecorGrid, StructureRecipe } from "../architecture";

/**
 * The Hearthfields (BIBLE 7.1): the mill, the farmhouse and the scarecrow are drawn by hand
 * in the generator; here stands Brom's forge at the crossroads, far up the road and small
 * with the distance, its fire banked but alive, a hammer left on the anvil, unfinished;
 * and behind it, in the mist, the barn and the chapel of the fields.
 */
export const HEARTHFIELDS_STRUCTURES: Record<string, StructureRecipe> = {
  "brom-forge": {
    w: 50,
    h: 47,
    fragile: 20,
    growth: 0.3,
    seed: 1101,
    pieces: [
      { decor: "brom-forge-painted", at: [0, 46] },
      { decor: "chimney-embers", at: [34, 1] },
      { decor: "forge-fire", at: [22, 46] },
      { decor: "anvil", at: [5, 46], keep: true }
    ]
  },
  // In the mist behind the road: a barn, its hay door lit, and the chapel of the fields.
  "hearth-barn": {
    w: 46,
    h: 34,
    fragile: 14,
    growth: 0.3,
    seed: 1102,
    pieces: [
      { decor: "hearth-barn-painted", at: [0, 33] }
    ]
  },
  "hearth-chapel": {
    w: 30,
    h: 44,
    fragile: 18,
    growth: 0.4,
    seed: 1103,
    pieces: [
      { decor: "hearth-chapel-painted", at: [0, 43] }
    ]
  }
};

export const HEARTHFIELDS_DECOR: Record<string, DecorGrid> = {
  // hearth-chapel, painted then traced.
  "hearth-chapel-painted": {
    rows: [
      ".............ee",
      "............eeff",
      "............eeff",
      "..........aeeeffff",
      ".........aaaeeefffee",
      "........aaaaaeefffee",
      "........aaddddddddcc",
      ".........addddddcdcb",
      ".........aaddddcccbb",
      ".........aaaddddccbb",
      ".........aaaddddbcbb",
      ".........aaadddcbcbb",
      ".........aaaccccbcbb",
      ".........abaaaaabcbb",
      ".........abbbbbbbcca",
      ".........abbaaabbcba",
      "..........bfffffffb",
      ".........aafffffffff",
      ".......ggafffffffffffe",
      "......ggggeeeefffffffee",
      ".....gg*gffgeffffffffeee",
      "....ggggffgggfffeefffffee",
      "...eggefffgeeeefffffffffee",
      "..ggeeeegggeeeffeffffeefeee",
      ".gggggeegggfefefeefffeeeeeeg",
      "eggggeeedfffffeffffffeeffeegg",
      ".gffddddddddddddddddddddddffg",
      "..fdddcccddddddddddddddddddf",
      "..cccddddccccbbccccccdddddc",
      "..bbbdddcbbaaaaccbbbccccdcc",
      "..aaadddcbbaaaaacbbccbbbdcb",
      "..aaadddcaaabbbbcbbbbbbbbbb",
      "..baadddccccdddddcccccccbbb",
      "..ccbbaabbbddddddccccccccbb",
      "..cbaaaaacbddddddbbbbbcccab",
      "..cbaaabbcbddddddbccccddcab",
      "..ccbaabbcbddddddbbbbccccbb",
      "..bbbbbbbbbddddddcbbbccccbb",
      "..bbbccddbbddddddccccccccbb",
      "..bbbaacbbbddddddbbccccccbb",
      "..bbbbbcbbbddddddccccccccbb",
      "..cccccdcbbddddddccccccdcbb",
      "..cdddddcccdddddddcddccddcb",
      "...ccddccccddddddccccddddc"
    ],
    legend: { a: ["stone", 3], b: ["stone", 2], c: ["stone", 1], d: ["stone", 0], e: ["roof", 1], f: ["roof", 0], g: ["roof", 2], "*": "glow" }
  },
  // hearth-barn, painted then traced.
  "hearth-barn-painted": {
    rows: [
      "",
      "......................de",
      "....................dddeed",
      "...................dddddddd.........ee",
      ".................dddddddddddd.......ee",
      "................dddddddddddddd......eee",
      "..............ddddddddddddddddde....eee",
      ".............ddddddeeddddddddddee..feee",
      "...........dddddddeedddddddddddeeeefeeef",
      "..........dddddddeeeddddeeddddddeeefffff",
      ".........ddddddeeeeedeeeeedddddddeefffff",
      ".......dddddddddddddddeeeeeeedddddeeffff",
      "......dddddddddddddeeefffeeeeeddddddeffffff",
      "....ddddddddddddddeeff**ffeeeeddddddeeeffff",
      "...dddddddeeeeeedeeef****feefeeededdddeeeeff",
      ".ddddddeeeeeeffeeeeefffffffefffeeeedeeeeeeff",
      "ddddbbcccccebaaccaaaa****ffaaaaaaaacccccccdde",
      "dddbbbbbbbbbbbbbbbccaaaaacccaacccbbbbbbbbbcdee",
      "...bbbbbbbbbbbbbcbbbcccccbbbbcbbbbbbbbbbbbcc",
      "....bbbbbbbbbbbbccaaaaaaaaccccbbbbbbbbbbbbc",
      "....bbbbbccbccaaaaaaaaaaaaaaaacccbbbbbbbba",
      "....bbbcbccccccaaaaaaaaaaaaaaaaccccbbbbbba",
      "....bbbccccaacaaaaaaaaaaaacccaaacccccbccbb",
      "....bccbbbbbbccbaccccccccccccacbcbbbbbbbba",
      "....bccbbbbbbccbaaabbbbbbbbccacbcbbbbbbbca",
      "....bccbbccbcccbaaabbbbbbbbccacbcbbbcbbbca",
      "....bccbbccbcccbaabbbbbbbbbbcacbccbbccbbca",
      "....bccbbbcbcccbaabbbbbbbbbccacbccbbcbbbca",
      "....bccbbbcbbccbaacbbbbccccccccbccbbcbbbcca",
      "....bbcbbbbbbccbaacbbbcccccccccbcbbbcbbbceaa",
      "...cbbbbbbbbbccbcabbbcccccbccccbbbbbbbbeeedde",
      "...cbbbbbbbbbbcbcabbbbcccbbcccbbbbbbbbbeedddff",
      "...cbbbbbcbbbbccccbbbbbbbbbcccccbbbbbbdeeddddf",
      "....bbbbbccbbbbbcccbcccccccbbbcbbbbbbbddddddd"
    ],
    legend: { a: ["wood", 2], b: ["wood", 0], c: ["wood", 1], d: ["roof", 0], e: ["roof", 1], f: ["roof", 2], "*": "glow" }
  },
  // brom-forge, painted then traced.
  "brom-forge-painted": {
    rows: [
      "...................................hh",
      ".................................iihhhh",
      "................................jihhhhhg",
      "................................jjjjjjjg",
      "................................jggjjjj",
      "................................hhhjggg",
      "................................ghhgggi",
      "................................ghhgggi",
      "..............................deeiigihi",
      ".............................ddeeihhihi",
      "............................ddeeehhhhii",
      "..........................dddeeeehhghhi",
      ".........................dddeeeeehhgiii",
      "........................ddeeeddeehhgiii",
      ".......................dddeeeeeeeiihhhhh",
      ".....................ddddddeddddeehhgghee",
      "....................ddddddddddddeehhhhheed",
      "...................ffffdddddddddddedeeeeedd",
      ".................ffddddeefdfddffeeedeeeddeed",
      "...............dfffffffffffffffffddddddeeeedd",
      "............ffddfffffffffffffdffffdddffedddddd",
      ".........dffdddffffffffffffffdffffdddfffdfddddd",
      ".....fffddffffddffddddfffffdddddddddddffdfddddee",
      "...fffffffddfaaajjjjjjjjjjjjjjjjjgjjjjjjjeeeeeeee",
      ".ffffffffeeeeaaajjjjjjjjjjjjjjjjjgjjjjjjjjjjjjj",
      "eefffdddeeee...ajjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
      "eeaaeeeee......ajjjjjjjjjjjjjjgjjjjjgjgggggjjji",
      ".ebaae.........ajjjgggggihhhhhgggghggjjgghhhgii",
      "..bcaa.........aajjghhggiihihhhiighiicggghhhggi",
      "..ccaa.........aajghhhiiiihiihiihhgccccggihhggi",
      "...aaa.........ahgghhhiijjjjjjiihhcccccciiihhhi",
      "...aaa.........ahggghhhjjjjjjjjihicbbbbbiigggii",
      "...aaa.........ahggghhjjjjjjjjjjiicccccbhggggii",
      "...aaa.........ahghihjjjjjjjjjjjgibb*bbbhhhihii",
      "...cca.........ahghiijjjjjjjjjjjgibb*bbbihiihhi",
      "...ccc.........ahhhhhjjjjjjjgjjjjiibbbbiihhiggh",
      "...ccc.........chhhhigjjjjgigjjjhighhhggjiihghh",
      "...ccc.........chghhigjjjjgiiijjhigjjjjjjhhhhgi",
      "...cac....aa...hhgghhgjgggiiiigjhigjghhhhhghggi",
      "...cac....aa...chhhiihjgggi*iiggiihhgiiihgggggh",
      "...cac...aaaa.achhghihgggiio*hhgiihgghhhgghhggh",
      "...caa.ccaaaaaaaggghihggii*i**hgiihgghhgggghggg",
      "...caaaaaaaaaaaaggghiigjhhhiiiigiihgghhgjgggjgh",
      "...aaaaaaaaaaaaaggjgiijjjhhhjjjjiiggghjjjgjjjjh",
      "...aaa..aaaaa..ajgjgggjjjjjjjjjjgggjjjjjggjjjjhh",
      "...aaa..aaaaaa.ajjjjjihhhhjjjhhhgjjjjjjjjgggggghh"
    ],
    legend: { a: ["wood", 0], b: ["wood", 2], c: ["wood", 1], d: ["roof", 1], e: ["roof", 0], f: ["roof", 2], g: ["stone", 1], h: ["stone", 2], i: ["stone", 3], j: ["stone", 0], "*": "glow", o: "core" }
  },
  // The forge's hearth: flames standing out of the coals under a hood of stone, breathing.
  "forge-fire": {
    rows: ["..*..*..", ".*c**c*.", "*cccccc*"],
    legend: { "*": "glow", c: "core" },
    frames: [[], [{ x: 0, y: 0, rows: [".*....*.", "..c**c.."] }], [], [{ x: 0, y: 0, rows: ["...**..."] }]]
  },
  // The anvil by the door, the hammer on it: Brom never finished what he was making.
  anvil: {
    rows: ["....mM...", "...#hh#..", "mmmmmmmmm", "#MMmmmMM#", "...Mmm...", "..MMMMM.."],
    legend: { "#": "outline", m: ["metal", 2], M: ["metal", 1], h: ["wood", 2] }
  },
  // Sparks over the chimney.
  "chimney-embers": {
    rows: [".*...", "...*.", "..*..", "....."],
    legend: { "*": "glow" },
    frames: [[], [{ x: 0, y: 0, rows: ["...*.", ".*...", "....*"] }], [{ x: 0, y: 0, rows: ["..*..", "....*", ".*..."] }], [{ x: 0, y: 0, rows: ["*....", "..*..", "...*."] }]]
  },
  // A haystack by the barn, never brought in.
  haystack: {
    rows: ["...hhh...", "..hHhhh..", ".hhHhhHh.", "hHhhhHhhh", "hhhHhhhHh"],
    legend: { h: ["roof", 2], H: ["roof", 1] }
  }
};
