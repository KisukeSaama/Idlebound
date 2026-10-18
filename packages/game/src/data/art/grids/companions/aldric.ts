import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Aldric, the Adventurer (BIBLE 10.2): the walker, young and worn by the road; messy brown
 * hair fallen on the brow, a pale scar down the near cheek, a quilted gambeson in his gold
 * under a leather baldric, and the sword he carries over the shoulder, lit by the moon.
 */
export const ALDRIC: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.night1, C.flesh0, C.fur1, C.fur2], texture: "fur" },
    cloth: { ramp: [C.night1, C.goldInk, C.goldDeep, C.goldDark], texture: "cloth" },
    leather: { ramp: [C.night1, C.flesh0, C.fur1], texture: "cloth" },
    steel: { ramp: [C.night1, C.haze, C.paper], texture: "metal" }
  },
  grid: {
    rows: [
      "...................................eee",
      "...............................eeeeeii.i",
      "............................bbbbbeebbii.i",
      ".........................bbbbbbbbbbbbeeeei",
      ".......................bbbbbbbbbbbbbbebbbieeii",
      "......................bbbbbeebbbbeebbbbbbeeeiii",
      ".....................bbbbeeeeccbaaabbbbbbeeeeeii",
      "....................bbbbeaaccccceeaeeebbbeeeeeiii",
      "...................bbbbeeeccccccceaaaabbbbeeeeeiii",
      "...................bbbeeeecccccccccccebbbbeeeeeeiii",
      "..................bbbbeeeeecccccccccceeabeeecceeei",
      ".................bbbbbbeeeeccccccccceeeaeeeeecceeii",
      "................bbbbbbbbeeeeccccddcceceaeeeeeecceeih",
      ".................bbbbbbbeeeeeccccdccccccbccceebceeiih",
      ".................bbbbbbbeeeeeeecccccccccbcccbebbeeehh",
      "................bbbbbbbbeeeeeeeecceeccceecccbeebeeeihh",
      "................bbbbbbbeebbbbeeeccbeeceeccaeeeebbebihh",
      "...............bbbbbbbbbbbbbbeeeeebaeeefdeaefeebbbbiih",
      "..............bbbbbbbbbbbbbbbeeeebbaeeegdeeegeebbbbiih",
      "..............e.bbbbbbbbbbbbbeeebeeeeeggdeedgeeebbbiii",
      "b...............bbbbbbbbbbbbbeeebfeeegggeefggdeebbbihhh",
      "bb.............bbbbbbbbbbbbbbbeecdbcggggccgggdeebbeihhh",
      "eb.............bbbbbbbbbbbbbbbbeccbccdgccggggfccibeihh",
      "eeb............bbbbbffcbbbbbbbbeeccccbbbcddggccbbbeihi",
      "bebb...........cbbbceeccbbeccebeddfccbbbbbdddbbbbbiihi",
      "beeb...........bbbbfeeedbbeccebefeeecbbeeegdbbbbbbihh",
      "bbeeb..........bbbbffddeebecdccfgffggeeefdgdeebbbiihi",
      "bbeebb.........bbbbfffeeebbcdcffggggfffgddggeeeiiiih",
      "bbbeebb........ebbbfffeefbbcdfdfgggggfdgggggeeeiiii",
      "bbbbebb........e.bbefffedbbeffdgggggggggggggiffiii",
      ".bbbeebb.........bbbfffecbbefffgggggggggggggiffiii",
      ".bbbbebb.........bbbbffdccbeffffggggggggggggfecii",
      "..bbbbebb........bbbbbfdgfeeffffdggggggggggggiii",
      "..bbbbeebb.......bbbbbbffeeffddfdggggggggggggiii",
      "...bbbbebbb.....ebbbbbbbbbedfddddggggggggeeeeei",
      "....bbbbbbb.....e.bbbbbbbbedffddgggggggggfeeeei",
      "....bbbbbbbb......bbbbbbeeeffddddgggggggggeeeii",
      ".....bbbbbbbb.....ebbbbbeebfdddddgggggggggdfii",
      "......bbbbbbb.....e.bbbbeebbddddddggdddffeeeei",
      "......bbbbbbbb......bbbbeeeeedddddggdddffffiei",
      ".......bbbbbbbe.....bgbbeeeeeeddddddddddfffii",
      ".......bbbbbbbe.....egbbeeeeeeeffdddddddeeeii",
      "........bbbbddee.eeiiiieeeeeeebbeddddddggdii",
      ".........bbeedecccciiiieeceeeebbbbddddgggdii",
      ".........bbeecccccceeiiiecceeeebbbbdddggddii",
      "..........beccccccceeiibecceeeebbbbbbcffcfee",
      "..........caacccccceebbbeeceeeeebbbbbbbbbbii",
      "........cccaaccccbbbbbbbbeeeeeeeebbbbbbbbbeiibbb",
      ".......eaaaaeeccbbbbbbbbbedeeeeeebbbbbbbbbeeiibiii",
      "......eaaaaaeebbbbbbbbbbbedceeeeebbbbbbbbbbeebbbiii",
      ".....eebaaaeebbbbbbbbbbbbedceeeeeeeeebbbbbbbbbbbeiiie",
      "....bbbbeeebbbbbbbbbbbbbbefdeeeeeeeeeebbbbbbbbbeiiiiiie",
      "...bbbbbeeebbbbbbbbbbbbbbefdeeeeeeeeeeeeebbbeeeeeieiiiii",
      "..ebbbbbeebbbbbbbbbbbbbbbbfdeeeeeedeeeeebbbbccccccccciiiiib",
      ".eebbbbbbbbbbbbbbbbbbbbbebcdeeefedddeeebbbbcccddddcccceeebbb",
      ".eebbbebbbbbbbbbbbbbbbbbeecdceeecdddceeebbccccddddcccccebbeie",
      "..ebeeebbbbbbbbbbbbbbbbbeeccceeecceecceebccddddddddcccceeeeeiie",
      "......bbbbbbbbbbbbbbbbbbbbccceeeeeeccceedddddddddddccceeeeeeeiii",
      ".....bbbbbbbbbbbbbbbbbbbbbcdceeeeeccccccdddddddddddcceeeeeeeeeii",
      "....bbbbbbbbeebbbbbbbbbbbbcdeeeeeecccccdddddddddddccbeeeeeeeeeei",
      "...bbbbbbbbeeebbbbbbbbbbeeccbbeeeeeeeeddddddddddddcbbeeeeeeeeeee",
      "...bbbbbbbbeeebbbbbbbbbbbccddddcccdddddddddddddddddeeeeeeeeeeeee",
      "...bbbbbbbbbecbbbbbbbbbeeccccdcccccddddddddddddddddeeccccceeeeee",
      "..bbbbbbbbbbcceebbbbbbbeecccddddddddddddgdddddgdddcccccccccceeee"
    ],
    legend: {
      a: { m: "cloth", step: 1 },
      b: { m: "hair", step: 0 },
      c: { m: "hair", step: 2 },
      d: { m: "hair", step: 3 },
      e: { m: "skin", step: 0 },
      f: { m: "skin", step: 1 },
      g: { m: "skin", step: 2 },
      h: { m: "skin", step: 3 },
      i: { m: "steel", step: 1 }
    }
  }
};
