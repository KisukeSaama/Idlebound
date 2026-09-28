import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Crystal Mite (BIBLE 8.3): it eats sky-glass and excretes smaller sky-glass. A mite
 * the size of a hound, low on eight jointed, spiked legs under a wide dome of dark blue
 * plates; prisms of blue and violet sky-glass have grown through the shell and lean back
 * from its crown. The head is low under a lip of shell, a pair of hooked mandibles open,
 * a cluster of four cold eyes; its leavings glitter on the ground behind it.
 */
export const CRYSTAL_MITE: CreatureGrid = {
  rows: [
    "...................................................................hh",
    "..................................................................hhcc",
    "..................................................................hhcc",
    ".................................................................cchLgg",
    "................................................................hchhhgg",
    "................................................................hhhhhgh",
    "................................................................hhhhhhh",
    "...............................................................chhhhhhh",
    "...............................................................chhhhhh",
    "..............................................................chhhhhhh..........VVv",
    "......................................................ch......chhhhhhh.........VVvv",
    ".....................................................cch......hhhhahhb.........VvvF",
    ".....................................................chLx....hhhhaahbb........VVbbV",
    "....................................................cahhx....hhhhahhb........VVvbVV",
    "....................................................cahxx....hhhaahbb.......VVVvvvV",
    "....................................................cahxx...hhhhahhba.......VVvvvv",
    "....................................................ahaaa...hhhhhhhaa......VVvvvvv",
    "...................................................cahaaa..hhhhhhhaaa.....VVVVVvv",
    "............................................VV.....cahaaa..hhhhhhaah.....vvVVVvvv",
    "...........................................bVV.....chhaaa..hhhhhhahh.....vvVVvvv",
    "...........................................bVVV....hahaaa.hhhhhhhggghh..vvVVvvv........hc",
    "...........................................bVVb...hhaaaac.hhhhhhhggahh.vvVVvvVv.......hhcc",
    "...........................................VVVb...hhhaaachhhhhhhhgaahb.VVVvvvV.......hhhhc",
    "...........................................VVvv...hhhhhgchhhhhchhgahhbVVVVvvva......hhhhhc",
    "..........................................VVVvv.eehhhhhgghhhhhchhhahhVVVVvvvv.......hhhhh",
    "..........................................VvVVvvehhhhhhgghhhhhhhhhahhVVVvvvvv......hhhhx",
    "........................................eevvvvvvdhhhhhhgghhhhhhhhchcgVVVvvvv......hhhhxx",
    ".................................cch..eeedvvvvvvdgggggggghgggggggchcgVVvvvvv.....hhhhhc",
    ".................................cch.dddddvvvvvvdddddddddddddddcchcggVvvvvv.....hhhhhh",
    ".................................chhhdccddvvvvvvddddddddadddddddhhcggcvvvvvd...hhhhhhh",
    ".................................cchhdddddvvvvvvddddddddadddddddddeeecccccccc..hhhhhh",
    "..................................chhddcccddddddddddddccadddeeedccceedddccccchhhhhhh",
    ".................................dhhaaddcadddddddddddddaadddeeeedcccccccccccchhhhhhh",
    "................................eehhaaddcacdddddcceedddadddhhccbddddcccacccchhhhhhh",
    "..............................eeedhhaagaaaccddddddcceeeaddddcccbbddeeeaaccchhhhhhhh.bb",
    ".............................eeddddggggaaxxddcdddddddddaddddccccbddcceeaddchdhgghhbbbba.....Vv",
    ".............................edddddeeddadxxxccddddddddaadddaaddddddccccaddcdddcccbbbbba....Vav",
    "..................dd........eedddddddddaddddccddddddddaddddddddddddccccaddcddddcbbbbbba.ddVVav",
    ".................ddcc.......ddcccdddddadddddddggeeccccacdcddddddbdcccccaadcccceebbbbbbdddddaa",
    ".................deccc..deedddddddedccabbddddeeggeccccacccdcccddecccdddaaddddccccbbbbbddecca",
    "................eeeccccdddedddddddeccccccccddddddggbbaaccddccdddecccccdadddccccbbbbbbedcecc",
    "................dececccdedcccdddddceccbdccdddddddddcbacccddccddccebbbccaaddcbbbbbbbbdecccecb",
    "...............ddbbccccceeccccddddccccbdcddccbbccddccacccccccddcccbbbbbaabdccccaaabddccccbbb",
    "..........ccc.dddbbcccccccddddcddcccccccdddbbbbbbcddcacccccddddccccbbbbbabdccccbbbdddcccccbc",
    "........cccccccddcccccccccdccccddccccccccddcbbddbccccacccbbbddccccbbccccacccaaccbdddccccccccc",
    "........cc..cccddbbbcccEccdccbbddcccccccccccaccdddccaaccccbbdddccbbbccccaaaaaaaadeecccaaccccc",
    ".............ccddbabccccccccccddcccddccccccdaaaaabbaaacccbbddcdccbbbaaaaaaxxcccdddeccaaaccccc",
    ".............ddddbEEbcccccgccccdcccdddcccccdddbbabaaaaaaabbdccbbcccbaxxxaabbbddeecccaaaaacccc",
    "e...........eeddbbEEbbccccccccbdccbbcccccccbbcccaabbaaaabbddccbbbcccaaaxbaabbdddcccaaaxxaacccc",
    "ee..........deddcbbccbcccdccccbdccbaccbccccbaaaabbaaaabbbbddccccccccaaabbaaadddccccaaxxxaacccc",
    "eeee........ddddcbbbbbEccdcccccddcbaacbcccccaaaabbbbbabxxdddcccbbbcbaaaaaaadddccccaaxxxbbacccc",
    ".eeeeee....eeeddcbbbbcbbcccccccdcbaaacccccccaabbbbbbbaaaxddcccbbbccbaaxxaadddccccaaaxxxbbacccc",
    ".edddeeeeeeeeeddcbbccccccccccccdcbaaaccccccccbbbbcccaaabbddcccbaaccbbaaaadddbbccbaaxxx..baccccc",
    ".ddddddeeddddddaabbcccccccccccddcbbaaacccccccbbbaaaaaaaaddccccaaaccbbbaaddccbbcbbxxxx...bb.cccc",
    "..dddddddddddddcbccccccccccbccddcbaaaaacccccccaaaabbbaaaddccccaaaccdbxabddccbbcbxxxxx...bb.cccc",
    "...ddddddddccddcbccccbbccccbccddcbaaaaacccccccaaaaaaaaaadccbcbbaadcdbxxbdcccccxxxxxx.....ba.ccc",
    ".....dddccccdddccaaccbbbbbbcccddbaaaaxaccccccaaaaaxxaaaacccbbcaaadccbxxxcccccxxxxxxx.....ba.ccca",
    "......dd....ddcccaaccbbbbbbbccdcbaaaaxaaccbbbaaaaaxxxaaaccccbcaaadccbxxxcccccxxxxxx......ba..cca",
    "............ddbbccccbbbaaaaaacdcbaxxaxxxacbbaaaaxxxxxxaxxbbbaaaxxxbbbaaxxbbbcxxxx........bb..ccc",
    ".............dbbcbbccbbxxxxa..dcaaxxaxxxaxxxxxxxxxxxxxaxxxxxxxxxxxbbbxxxxxaaxx............ba.ccc",
    "............ddbbbbbbbaaxxx...ddba...xxxxxxxxxxxxxxxxxxaxxxxxxxxxxxdbbxxxxx................ba..bcb",
    "...........ddbbb....aa.ba....ddb........xxxxxxxxxxxxxxaxxxxxxxxxxxdbbxx...................ba..bbb",
    "........dddddbb........ba....ddb.........ba..xxxxxxxxxxxxxxxxxxxxxcbb......................b..xcc",
    "..eeeeeedddddbb........ba....dcb.........b........................cbb......................b...cc",
    "...dddddddddda.........ba....dca.........b.........................db......................bx..dcb",
    "....ddcccccddx.........b.....db..........a.........................dbx.....................ba..dda",
    ".....ccc...dbx.........a.....da.........ba.........................dcx......................a...dc",
    "...........db................da.........ba.........................dcx..........................ccb",
    "...........cb...............dba....................................dcx..........................ccb",
    "...........cx...............db.....................................dcx...........................cc",
    "..........dc................db......................................cb...........................ccg..gg",
    "..........db................db......................................cb............................cggggg",
    "..........da................cb......................................ca............................da"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    F: { pal: C.essenceBright, glow: true, light: true },
    L: { pal: C.shardLight, glow: true, light: true },
    V: { m: "violet", step: 1 },
    a: { m: "shell", step: 0 },
    b: { m: "shell", step: 1 },
    c: { m: "shell", step: 2 },
    d: { m: "shell", step: 3 },
    e: { m: "shell", step: 4 },
    g: { m: "glass", step: 1 },
    h: { m: "glass", step: 2 },
    v: { m: "violet", step: 0 },
    x: { pal: C.ink }
  },
  idle: {
    // The shell lifts and settles on its legs.
    waist: 67,
    breath: [0, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the mandibles work.
    twitch: {
      frames: [5],
      patches: [
        { x: 10, y: 66, rows: ["..d", "._c", "._c", ".dc", "_db", "_da", "__"] }
      ]
    }
  }
};
