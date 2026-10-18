import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Brom, Wandering Smith (BIBLE 10.3): a big bald man with dark skin and soot on the brow,
 * kind eyes under a heavy ridge, a black beard falling on his chest in two braids ringed
 * with iron; a leather apron over bare shoulders, the far edge lit by the embers of his forge.
 */
export const BROM: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.night2, C.flesh0, C.fur1, C.fur3], texture: "smooth" },
    beard: { ramp: [C.ink, C.night1, C.night3, C.haze], texture: "fur" },
    leather: { ramp: [C.night1, C.goldInk, C.goldDeep], texture: "cloth" },
    iron: { ramp: [C.night3, C.haze], texture: "metal" }
  },
  grid: {
    rows: [
      "......................cdccdddd",
      "....................cccggghhhdddd",
      "..................ccggggggggggghddd",
      "................ccggggggggggggghhhddd",
      "...............ggggggggggggccghhhhhhdd",
      "..............ggggggggggggbbchhhhhhhhdd",
      ".............gggggggggggggggghhhhhhhhhdd",
      "............ggggggggggggggggghebhhhhhhhdd",
      "...........hggggggggggggggggghgchhhhhhhhdd",
      "...........gggggggggggggggggghhhhhhhfghhdd",
      "..........cggggggggggggggggggehhhhhhhhhhhdd",
      "..........cggggggggggggggggggchhhhhhhhhhhdd",
      "..........cggggggggggggggggggcghhhhhhhhhhddd",
      ".........ccgggggggggggggggggggghhhhhhhhhhhdd",
      ".........dcggggggggggggggggggghhhhhhhhhhhhdd",
      ".........cccgggggggggggggggggghhhhhhhhhhhhhdd",
      ".........cccggggggggggggefggbbghhhhhhhhhhhhddd",
      ".........cccggggggggggggffbbbbbbcghhhhhhhhgccd",
      ".........dccggggggggggggffbbbbbbbabbbhgghbbbbcc",
      ".........dccggggggggggggbbbgggbaaaaagggggaabgdc",
      ".........cccffgggggggggebbgggggbbeeeggggeaabbd",
      ".........fggfffggggggggfffgebccbbefefgggbccccc",
      "........ffeehffgggggggggggffhhccgffffhhgghdccc",
      "........feeeehgffeggggggggffhhccgghffghhghhcdd",
      "........feeeeggfbbggggghhggfgggggggggghhhgggdd",
      ".......gfeggeeffbbggggghhhggggggggggggghdgggdd",
      ".......gffggbeffbbfggggghhhhhhhgghhhggghhdhghdd",
      "........fggbbbffbbfggggggghhhhhhhhhggggghddhghd",
      "........gggeccggbbbggggggggghhhhhhhggggghdddhgd",
      "........gfgebbggbbbggggggggghhhhhhgghggghhddddd",
      ".........fffeeegbbbbgggggggghhhhhggggggghhdhddd",
      ".........fffggffbbbbgggggggghhhhggegggggghhghdd",
      "..........fffggfbbbbbggggggghhhhghffbbbggggghd",
      "...........fgggfabbbbgggggggghhhhhhbbbeebbgghd",
      "...........cgggaabbbbbggggggghhghgbbbbbbbbbccd",
      "...........ceeeebbbbbbgggggghhggbbbbbccbbbccccc",
      "...........cfeeabbbbbbbggggghgbbcccbcccbbbbcccc",
      "..........ccfffbbbbbbbbbgggggcccccbbbbbfheebbcdh",
      ".........cccfffbbbbbbbbbbgggbccbbbaabeefeeeaabcd",
      ".......aacccffebbbbbbbbbbbgbbcbbbbbgghgghhhaabcd",
      ".......aabbcffebbbbbbbbbbbbbbbabggggghhhhgggbbcd",
      "......aaaaafffeabbbbbbbbbbbbbbaggggggbbbbbggfaad",
      "......baaaaffffabbbbbbbbbbbbbbbggggggbbbbbggfaacc",
      ".....bbaaaaffffbbbbbbbbbbbbbbbbggggggbbbbbggbbbbc",
      ".....bbaaaaeeffbaaaabbbbbbbbbbbbgggggbccccccbbbcdd",
      "..cddcbbaaaeeffbaaaabbbbbbbbbbbbbggcccccccccccbcc",
      ".cccccabbbaaefffaaaaaabbbbbbbbbbbbbbccccccccccccc",
      "ccbbbaaabbaaafffaaaaaaaaabbbbccbbbbccccccccccccccc",
      "cbbbbaaaaaaaafffeaaaaaaabbbbbbccbbcccccccccccccccd",
      "egbbffaaaabbbaffeeaaaaaaabbbbbccbbccccccccccccccc",
      "ccfffffaabbbbaffffaaaaaabbbbbbbcbbbccccccccccccccc",
      "cccffffbaabbaaafffeaaaabbbbbbbbbbbbcbbcbbcccccccccd",
      "cccbfffbaaaaaaaaffeeaabbbbbbbbbbbbbbbbbbbccbbbccccdd",
      "ffcbbffbaaaaaaaabfeeaabbaabbbbbbbbbbbbbbaccbbbcccccdd",
      "ffffeefbaaaaabbbbffeeeaaaaabbbbbbbbbbbbbabccbbccccccdd",
      "ffffffffbaabbbbbbffffeaaaaaabbbabbbbbbbbabcbbccccccccddd",
      "ffffffffbaabbbbbafffffeeaaaaabbaabbbbbbaaccbcccccccccddddd",
      "bfffffffeaaabbbaafffffeeeaaaabbbabbbbbbaacccccbccbdccchhdddd",
      "aeefffffeaaaabbabbfefffbebbaabbbaaabbbbaacbbccbbbbcccchhhhdddd",
      "ggeeggggfeaabaabbbbeeefbbbbbbbbbbaabbbbabcbbccaabbccccchhhhdddd",
      "gggeegggfeaabbbbcceeeeaabaabbbbbbbaabbbabeeeccabbbcccfchhhhddddd",
      "hggeeggggeaabbbbbcegfffbbaabbbbaabaaabbaeeeeeaabbccccffhhhhddddd",
      "hhhgbeggggaabbbbbcchhggfffbbbeeeebbbbebbeeeeeaabbcccccgghhhhdddd",
      "hhhggbggggaabbbcccchhhhfffffeeeeebbbeebbfgeggaaabbbdcccghhhhdddd"
    ],
    legend: {
      a: { m: "beard", step: 0 },
      b: { m: "beard", step: 1 },
      c: { m: "beard", step: 2 },
      d: { m: "beard", step: 3 },
      e: { m: "skin", step: 0 },
      f: { m: "skin", step: 1 },
      g: { m: "skin", step: 2 },
      h: { m: "skin", step: 3 }
    }
  }
};
