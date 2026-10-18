import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Garrick, Rune Miner (BIBLE 10.3): a dented miner's helmet with a candle burning on its
 * front, soot on the face, a bushy mustache over a wide grin with one gold tooth; a coat in
 * his blue, a sky-shard glinting on a cord at his neck, his pick over the shoulder.
 */
export const GARRICK: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    iron: { ramp: [C.night2, C.vault1, C.vault2], texture: "metal" },
    coat: { ramp: [C.night1, C.night2, C.vault1], texture: "cloth" },
    hair: { ramp: [C.night1, C.flesh0, C.fur1], texture: "fur" },
    wood: { ramp: [C.flesh0, C.fur1], texture: "bark" }
  },
  grid: {
    rows: [
      "..............................ddddee",
      "............................ddddccceee",
      "...........................ddddaacccaee",
      "..........................dddddddaaaafee",
      "........................fddddddffffaffbhe",
      "......................ffffaaaadfbbbbfbbhee",
      ".....................fffffaaaaafbbbbbbbhheee",
      "...................ffffffffaaaabbbgbbbbhhhhee",
      "..................dddaffffffffbbbggbbbhhiihgee",
      ".................dddaaafffffffbbgggghhhhiihheie",
      ".................ddaaaaaffffbbbbggghhhhhhiiheii",
      "................ddaaaaaaffffbbbbgbbghhhhhiiheeie",
      "................ddaaaaaaaffffbbbbbbbhhhhhhiheeii",
      "...............ddaaaaaaaaffffbbbbbffghhgbhiieeei",
      "...............dcaaaaaaaaafffbbbbbffghhgfhiieeeee",
      "...............ecaaaaaaaaaffffffeeeehgggffeeeeeee",
      "..............deddaaaaaaaaafffffeeeeehgfaaeeeeeeee",
      "..............dddddaaaaaaaafffbbbeeeeggbffeeeeeeee",
      "..............ddddddaaaaaaafffffffbbbbbbbfeeeeeeeee",
      "..............ddddddaaaaaaaffffbbbbbbbbbhhggeeeeeeeee",
      "..............ddddddaaaaaafffffbbbbbbbfaaaaaaaaaaaddeee",
      "..............dddddaaaaaafffffffaaaaaafffffaaaaaaaaaacee",
      "..............ddddaaaaaaaffaaaaaaaaafffffffaaaaaaaaaaaad",
      "..............ddddaaaaaaaaaaaaaaaaaaafffffffaaaaaaaaaaad",
      "..............ddddaaaaaaaaaffaaaaaaaaafgggggaaaaaaaaaaad",
      "..............ddccaaaaaaaaaffaaffffaaaabbggaaaaeaaaaaaa",
      ".............dddaaaaaaaaaafffffbfffaafffghfaaadeaaaaa",
      "............ddaaaaaaaaaaaaffffbbffhaafffhhfgidddaaa",
      "...........ddaaaaaaaaaaaaafffbbfgggggggfgggggeedd",
      "...........daaaaaaafffaaaffffgggggggggggggggggee",
      "ee.........daaaaaaaffffaaffffggggggggggggghgggee",
      "eee........daaaaafffaafaaffffggghhhggggggggheeii",
      "eeeee.......aaaaafffaafaaaffffgghhhhhhggggggeiii",
      "eeeiie.........ddafffaffaaffffgghhhhhgggggghieii",
      "aeeiiie..........affffffaaffffggghhhggggggghgege",
      "aaeiiii.........aaafffffaaaffgggggggggffaaffffge",
      "aaaeeeee.......baaafffffaaaffggggggggaaaaaaaaeee",
      "aaaeeeed........aaaaffffaaafbbbggffaaaaaaaaadeee",
      "aaffdeed.......faaaaafffaaaabbbaaaffaaaaaaaaddeed",
      ".affdee..........faaaaffaaafbbbaaaaaaaaaaabaaaad",
      "faafaee..........ffaaaffaaffbbbgfffafbbhhhigaaddee",
      "faaaaaee..........faaaafadffbbbgggggfbbhhhheeeeaaeee",
      "aaaaaaeee..........aaaafaddffbbbgggggggggggeeeeaaaee",
      "aaaaaafee...........aaaffaddfbbffgggggggggggeeaaaaaee",
      "aaaaaaffee.........aaaaffadddffaaghgggggbffeeeaaaaaee",
      "aaa.daafee........aaaaafffadddfaabbhggggbffeeeaaaaeee",
      "a...ddaaeee......aaaaaaeffaaaddafbbggggggggeeeaaaaeeee",
      ".....daaaeee....aaaaaaaeffaaaaddfffgggghhhheeaaaaeeeee",
      "......aaafee...aaaaaaaadfffaaaaaaaaabfghhhggeaaaeeeeee",
      "......daaffee.aaaaaaaaaddffaaaaaaaaabfggggggeaaeeeeeee",
      "......dafffeedaaaaaaaaaaeffaaaaaaaaaafbbbbbaaaaeeeeeeee",
      ".......fffaaedaaaaaaaaaaefffeaaaaaaaaaaaaaaaaaeeeeeeeee",
      "........dfaaaaaaaaaaaaaaddffeffaaaaaaaaaaaaaaeeeeeeeeeee",
      "........dffaaaaaaaaaaaaaddffffffffaaaaaaaaaaaeeeeeeeeeeee",
      ".........ffaacaaaaaaaaaaaeffffffffaaaaaffaaaeeeeeeeeeeeeee",
      "..........cccccaaaaaaaaaaeffffffffaaaaaffaaeeeeeeeeeeeeeeee",
      "..........dcccccaaaaaaaaaddffffffaaaafffaaeeeeeeeeeeeeeeeeeee",
      ".........ddcccccaaaaaaaaaddffffffaaaaffaaaeeeeeeeeeeeeeeeeeeee",
      "........ddddddccaaaaaaaaaadffffffffffffaaeeeeeeeeeeeeeeeeeeeeeee",
      "........dcdddeccaaaaaaaaaadffffffffffffadeeeeeeeeeeeeeeeeeeeeeee",
      ".......ddccdeeecaaaaaaaaaddfffffffffffaddddeeeeeeeeeeeeeeeeeeeee",
      "......ddcddeeeeccaaaaaaaaddfffffffffffaddddeeeeeeeeeeeeeeeeeeeee",
      ".....ddccaddeeedcaaaaaaaaddfffffffffffddddddeeeeeeeeeeeeeeeeeeee",
      "....ddcccadeeeedddaaaaaaaddbbffffffffddddddddeeeeeeaeeeeeeeeeeee"
    ],
    legend: {
      a: { m: "hair", step: 0 },
      b: { m: "hair", step: 2 },
      c: { m: "iron", step: 0 },
      d: { m: "iron", step: 1 },
      e: { m: "iron", step: 2 },
      f: { m: "skin", step: 0 },
      g: { m: "skin", step: 1 },
      h: { m: "skin", step: 2 },
      i: { m: "skin", step: 3 }
    }
  }
};
