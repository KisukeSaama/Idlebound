import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Séraphine, Bramble Druid (BIBLE 10.3): severe, maternal, grieving. An older woman, grey
 * hair pulled back into a bun, a crown of brambles branching like antlers, the lines of age
 * and heavy lids, hollow cheeks and temples, deep folds to a thin mouth set hard, loose
 * strands of grey, a mantle of bog moss crossed by a thorny stem.
 */
export const SERAPHINE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.night4, C.haze, C.lilac], texture: "fur" },
    cloth: { ramp: [C.mire1, C.mire2, C.mire3], texture: "leaf" },
    bark: { ramp: [C.night4, C.flesh0, C.fur1], texture: "bark" }
  },
  grid: {
    rows: [
      "",
      "........................................b",
      ".......................................b",
      ".....................................bbb",
      "................................d...bb...........d",
      ".............b............eeeeeeeddddee..........d",
      "..............bb........ddddddddddddeeeeee.......de",
      "..............bd......dddddddddddddeeeeeeeee.dddddeeee",
      ".............bide....ddddddeeeeeddeeeeeeeeeddddddeeeee",
      "............djdeeee.ddddddeeeeeebbdeeedbbeddddeedffeee",
      "..........ddddddeeedddddeeeeeeebbbbbbccbbddddeeeeeffeee",
      "...........dddddddddddeeeeeeeebbbbbaabbddddddeeeeeffeef",
      ".........dddddddddddddeeeeeedabbbbbdddddeeeeeeeeeefeeee",
      ".........dddeeddddddddddeddbbaabbbddddddeeeeeeeeeeeeee",
      "........dddeeddddddddddddbbaaaabdddeeddddeeeeeeeeeeeee",
      "....cc..dddeeedddddddbbbbbaabbabdddeedddddeeeeeeeeeeee",
      ".....cb.ddddedddddddbbbaaaaadddddddeebbdhededdddddeeee",
      "......bbdddddddddddbbbaaaabdddddddeeeiijjjjjiiiiddeeee",
      ".......bbdddddddddaabaaddabdeeedddeeiijjeejjjjjjideeeee",
      ".......baddddabbbaaabadddddeeeebheeiiijeeeejjjjjjidef",
      ".......badddaabbbaaabddddddeeeehheeiiijeeeejjjjjjidef",
      ".......aadddaaabbaaddddeedeeeeehheeijjjjeeejjjjjjieef",
      "...bbbaaaadaaaaaaadddddeeedeeedhheejjjjjeejjjjjiiieee",
      "..bb...aaaaaaaaaadddddeeeeddeedhdehijjjjjejjjjjiiieeef",
      "........aaaaaaaaddddddddddddeebbdhgiijjjjejjjjiiiieeef",
      "........aaaaaaaddddddddddddeebbbehhiijjijiijjiiiiieeef",
      "........aaaaaaadddddddddddddgghbehhijjeeiihjjiijiiieef",
      ".......bbaaaaaddddddddddddddgghdehhhhddeeeehhiiijiieef",
      ".......bddaaaadddddddddddddghgbdhbghihbbddabhiigbbddeff",
      ".......b.ddaaadddddddddddddhhhbcbbhiiibbaaabhhiaaaaeeef",
      "......b..dddddddbhdddddddehhhhbcbbbhbbaaaabbhihaaaabeef",
      "..........dddddbbbbbdddddehhhhhbbbbbbddaabbbijgbbaaaeef",
      "...........ddddbbbbbbbdddehhhhihhbbbeeedgibghjihhddeeef",
      "...........edddbbbbbbbdddehhhhiiihihhhhhhjhhhjihhbeeeef",
      "...........edddbbhbbbbbdddhhhhiijjiiijiihiiihijhieeeeef",
      "...........edddbbbabbbbdddbgghhiijjiijihiiiiiiiihieeeef",
      "...........fdddabbabbbbddbbbbghiijjjjihijjiiiiiiiiieeef",
      "...........fdddabbbbbbbddbbbbbhhiiijjijjjjiihiiiiiieeef",
      "...........fedddabbbbbbddbbbbbbhhhiiiijjjjhhghiiiiieeef",
      "............fdddabbbbbbbbbbbbbdhhhhiiijjjhhihghiiiieeef",
      ".............eddddbbbbbbbbbbbbdhggghiiijihggbbgghieeeef",
      "..............ddddaabbbcbbbbbbdhhgghiiiiiiggbbbghieeeef",
      "..............eeddaaaaacbbbbbbbdhhggiiiijjihbbbihieeeef",
      ".............efeddaaaaacbbbbghhdggghiiiijjjjjhiiieefeef",
      ".............fefddddaabcbbbbghhighhhiiiiiijjjijiieffeef",
      "............efffeddddabcbbbbhhhighhhiiiiiiiihhhheeffeef",
      "....b.......effffeeddddcbbbbbhhihhhiiiihhhgggggbdeffef",
      "....be......effffffffdddbbbbbbhhhhhiiigghhiiccieeeffee",
      ".....de.....fffffffffeddbbabbbbhhghiiiiiiihhbbgeeeffee",
      ".....bee.e..effeeeeeeebbbbaaabbbbbbhiiiiihhgbbbeefffee",
      ".....bbe.cc..eeeeeeeeebbbbaabbbbbbbbhhhihhhijiieefffee",
      "......bdecceeeeeedeeebbbbbaabbbbbbbbhhiiiijjjijeffffee",
      ".......dabcccccccbdebbbbbbbbbbbbbbbbbbhiiijjiiieffffee",
      "........abccccbcbbddbbbacbbbbbbbbbaaaaahiiiihiieeffeee",
      "....e..eabbcbbbbabbbabbacbbbbbbbbbbaaaaaghhhghdeeeeeee",
      "....cc.bbbbbbbbaaaaaaababbbbbbbbbbbbaaaaddbaaaeeeeeeee.ee.e",
      "..c.bbbbbbbbbaaaaaaaabbaabbbbbbbbbbbaaaabeaaaabcceeeeeeeeee",
      "..ccbbbbabbaaaaaaaaaaabbabbbbbbbbbbbaabbbbaaaabbbceeeeeecee",
      "c..bbbaaabaaaaaaaaaaabbaabbbbbbbbbbbbbbbbbaaaaabbccccccccceee",
      "cccaaaaaaaaaaaaaaaaaaabaabbbbbbbbbbbbbbbbbaaaabbbbbccccccceee",
      "bbbaaaaaaaaaaaaaaaaaabbaaabbbbbbbbbbbbbggbbaaabbbbbcccccccceee",
      "bbbabbaaaaaaaaaaaaaaabbaaabbbbbbbbbbbbhhgbbaabbcbbbbccccccccee",
      "aaaabbbbaaaaaaaaaaaaabbbbbbbbbbbbbbbbhhhbbbbbbccbbbbbbcccccccce",
      "aaaaabbbaaaaaaaaaaaaabbbbbbbbbbbbbbbbhhhbbbbbbcccbbbbbbbcbbbdd"
    ],
    legend: {
      a: { m: "cloth", step: 0 },
      b: { m: "cloth", step: 1 },
      c: { m: "cloth", step: 2 },
      d: { m: "hair", step: 0 },
      e: { m: "hair", step: 1 },
      f: { m: "hair", step: 2 },
      g: { m: "skin", step: 0 },
      h: { m: "skin", step: 1 },
      i: { m: "skin", step: 2 },
      j: { m: "skin", step: 3 }
    }
  }
};
