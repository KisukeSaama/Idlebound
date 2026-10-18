import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Célestine, Voice of the Crystals (BIBLE 10.3): dreamy, joyful, eerie, childlike. A girl
 * with big eyes turned up toward the light and a small round mouth humming, her lavender
 * hair drifting back as if under water, glowing crystal shards caught in it.
 */
export const CELESTINE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.night3, C.keepStone, C.royal, C.keepAccent], texture: "fur" },
    dress: { ramp: [C.night2, C.plum], texture: "cloth" }
  },
  grid: {
    rows: [
      "..........................eeeeeeeff",
      "......................dddeeeeeeeeefff..eefjfj",
      "...................ddddddddddddeeeeefeeeeeeeffj",
      ".................dddddddddddddeeeeeeeeedeeeeefff",
      "................addddddddddeeeeeeeeeeeedddddddeef",
      "..............aaaddddddddddeeeeeeeeeeeeedddddeeeef",
      ".............cccccccdddddeeeeeeeedeeeeeeeeddeeeeeff",
      "............ccccccccdddddeeeeeeeddeeeeeeeeeddeeeeeff",
      "...........cccccccccddddddeddeeeeeeeeeeedddddddeeeefj",
      "..........cccccccccddddddddddddeeeeeeeedgddddddddefffj",
      ".........ccccccccccdadddddddddeeeeeeeedgggddddccaaejffj",
      "........cccccccccccaaddddddddeeeeeeeeeghhhhgggggaaaefffj",
      "........cccaaaccccaaddddddddddeeeeeeehhhhhhhhggggaaaeeff",
      ".......cccaaaaccccaaedddddddddeeeeeeeghhhhhhhhggggaadeefj",
      ".......bccaaaccccaadejdddddddeeeeeeeghhhhhhiihgggggacdeefj",
      "......bbcaaaacccaaadeedddcccdeeeeeedhhhhhiiiihhhggggcdeefj",
      "..ejj.bbcaaacddcaaacjeddaacceeeeeeeghhhhhijjjhihgggggddeejj",
      "..ejjjdccbbccdddaaaccdbbaaceeeeedddhhhhhhijjjjiihggggddeefj",
      "..jejjjddccccdddaaaccdbbacdeeeedddhhhhhhijjjjjjihhgggaddefjf",
      "..jedjeeaaccddddccbbccbaacdeeeeddddhhhhiijihjjjjihgggacdeejf",
      "..jjdddbeadeddaacdddccbacceeeeggddddddddddhjjjjjjihggacddefff",
      "...jddededeedaaadddaabaacdeeedggdddddddddddjjjjjjjhgggaddefff",
      "...deefeeeaedccdddaacbaacddeegggghhihhgggghiijjjjhddggaddefjfj",
      "...djjejejdddddddcaaccaaceeedggghhhhhhgggghhiijjjdddgaacdeejjf",
      "...dajjjjjedddddccaacaaadeeeggggggggggggggghhiiiihhhggacdeefjf",
      "eejjadejeeddddddaaaccaaddeeeggggggaaaaggggghhhiihhhhgggcdeefjjf",
      "eedddacceddddbbaaaacaaadddeeggggaaaaaaaggggghhiihggggggbdeefjjf",
      "jeedaaaaddddbbaaaaacaaddddedgggaaaddaaaagggghhihhgaaaaabdeefjjf",
      ".jjjdaaaddddaaaaaaccaaddeeedgggaadddgggahggghijhgaaaaaabdeefjjf",
      "..dddaadddaaagggaaaaaaddeeedgggggdddddddhhgghhjhddggaaaadeefjjf",
      "..aaaadddaaagggggaaaaadddeeggggggggdeddhhjgghhheddgggaabdeejjjf",
      ".caaaaaaaaagggggggaaaddddeegggggggggghhhhhhhhhhejjjddaabdeejjf",
      "ccbbaaaaaaaggggggggaaddddeggggggggghhhhhhhhhhhhhhhhddabbeeejjf",
      "ddcaaaaaaaagggggggggddddeegggggghhhhhhhhhhhhhgghhhhhddbdeeeff",
      "ddcaaaaaaaagggggggggdccdedgggggghhhhhhhhhhhhhggghhhhhdbdddee",
      "ccaaaaaaaaagggggggggdaceedggggggghhhhhhhhhhhggggghhhhedddeef",
      "ccaaccaaaaaagggggggdaadeedgggggggghhhhhhhiihgggggghhhedddeefj",
      "caaaaaaaaaaaggggggadaadeedgggggggghhhhhhhiiigggggghhheeddeeef",
      "aaaaaaaaaaaaagggggaaadddddggggggggghhhhhhiiiihhhhhjiheddddeeff",
      "aacaaaaaaaaaaagggggggdddddgggggggggghhhhhiiiihhhhjjjieeddeeeff",
      "accaaaaaaaaaaaagggggggddddggggggggggghhhhhhiihhiijjjijddddeeefj",
      "cccaaaaaaabaaaaaagggggddddgggggggggggghhhhhhhhhghhjjijbdddeeeefj",
      "ccaaaaaabbbaaaaaaaagggdddddgggggggggggghhhhhggggggiiiiccdddeefef",
      "ccaaaaabbbaaaaaaaaaagggddddggggggggggggghhhhgggggghijdccaddeeeff",
      "ccaaaabbbbaaaaaaaaaaaggdddddggggggggggggghhhhggghhiieddcaddddeef",
      "baaaaadbdcaaaaaaaaaaaaggddddggggggggggggghhhhhgghhiiddddadddeeee",
      "baaaaddddcaaaaaaaaaaaaggdedgggggggggggggggghhhhghhhddddddjddeeee",
      "aaaaaddddcaaaaabaaaaaagggdegggggggggggggggghhhiihhhdddddeeeddeed",
      "aaaaaddddaaaaaabaaaaaagggdegggggggggggggggghhhjiihhdddddejeddeee",
      "aaaabbdddaaaaabcaaaaaaagggdegggggggggggggggghhiiiiaacddddjddddee",
      "aaaabbdddaaaaabcaaaaaaagggdeggggggggggggggggghhhhaaaccddddddddee",
      "aaabbbdddadedacccaaaaaggggggeggggggggggggggggghhhaaaacddddddddde",
      "aaabbbdddddddaaacaaaaaggggggegggggggggggggggggggaaaaaccddddeedde",
      "aaabbbdeaadedaaaccaaaaggggggddgggggggggggggggggaaaaaaaccdddeeedd",
      "aaabbbdeaaeaccaacccaaagggggggeggggggggggaaaaaaaaaaaaddccdddeeedd",
      "caabcbddaaaaccaaaccaaagggggggddgggggggggaaaaabcaaaccdeddddddeeed",
      "caaccbdddaaacccaacccaagggggggddggggggggaaaaaabcaaacdddjdddddeeed",
      "caacbbdddaaaacbaaaccaaaaggggggdggggggggaaaaaaddaaacdddejddddeeed",
      "baacbbbddaaaacbaaaccaaaaaagggggggggggggaaaaaaddaaaadeeejddddeeed",
      "bccbbbbdddaaaabbaaacaaaaaaagggggggggghgaaaaaaddaaacdee.eiaddeeed",
      "bbcbbdddddaaaabbaaaaaaaaaaaaggggggghhhaaaaaadd.aaacdee.eiaddeeed",
      "bbbbbddddddaaabaaaaaaaaaaaaaagdgggghhgaaaaaaddcaaaceee..iaddeeee",
      "bdbbaadddddaaaaaaaaaaaaaaaaaaadgghhhhgaaaaadd.ccaccee...eaddeeee",
      "bd.baaddddddaaaaaaaaaaaaaaaaaadghhhhhaaaaaadddccaccee...eaddee"
    ],
    legend: {
      a: { m: "dress", step: 0 },
      b: { m: "dress", step: 1 },
      c: { m: "hair", step: 0 },
      d: { m: "hair", step: 1 },
      e: { m: "hair", step: 2 },
      f: { m: "hair", step: 3 },
      g: { m: "skin", step: 0 },
      h: { m: "skin", step: 1 },
      i: { m: "skin", step: 2 },
      j: { m: "skin", step: 3 }
    }
  }
};
