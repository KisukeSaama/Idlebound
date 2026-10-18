import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Brother Cinder, Ember Monk (BIBLE 10.3): serene, eyes closed, a faint smile; his shaved
 * head carries three embers of his order, and the small flame he keeps alive in his cupped
 * hands lights his face from below, the last memory of the sun, in the dark of his robe.
 */
export const CENDRE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
    robe: { ramp: [C.night1, C.blood, C.red], texture: "cloth" },
    rope: { ramp: [C.flesh0, C.fur2], texture: "cloth" }
  },
  grid: {
    rows: [
      "",
      ".....................................b",
      "....................................bb",
      ".................................b.bbb",
      ".................................bbffb",
      "................................bfbffb",
      ".................bb...........ddfffggb......b",
      "..................bbb.....dddddefggggf......b",
      "..................bfgff.ddddddeefggggfd....bfb",
      "..................bfggfedddddeeefggggfgg.fffgf",
      "...................gggcfdddddeeeegffgefggegggf",
      "...................fgffeddddddeeddfeeeefgggggf",
      "...................fceeaaadddddeeefeeeefgggggf",
      "...................aeaaaaaadddddeeeeeefgggggf",
      "...................aaaaaaaaddddddeeeeefgggggg",
      "...................aaaaaaaadddddddeeeeeeffggg",
      "..................aaaaaaaaadddddddeeeeeeeeefge",
      "..................aaaaaaaaadddddddeeeeeeeeeegg",
      "..................aaaaaaaddddddddddeeeeeeeeeee",
      "..................aaaaaaaddddddddddeeeeeeeeggg",
      "..................aaaaaaadddddddddeeeeeeeefggg",
      "..................aaaaaadddddddddeeeeeeeeeeffg",
      "..................aaaaadddddddddddddeeeeeeeeedd",
      "..................ddaadddddddaaadddddeeeeedaadd",
      ".................ddddaddddddaaefffeeeeeeeeaaddd",
      ".................ddddedaaddddeffeedeeeeeeddedd",
      ".................dddddeaaddddeeededdeedeeddddd",
      ".................ddddddaadddddddddddddddeddddd",
      ".................dddaaaddddddddeeeeeddddeedddg",
      "..................ddaaddddddddeeeeeeedddeeedefe",
      "..................ddaaddddddeeeeeeeeeddddeeeeed",
      "...................ddddeddddeeeeeeeeeedddeeeee",
      "...................dddeeddddeeffeeeffddddeeeed",
      "....................dddeddddeffffffffeeeeeeeed",
      ".....................deddddeeffffffffeeeffeee",
      "......................addddeefeefffeeeeeedeed",
      "......................addddeefeeecceeeeeeeeee",
      "...................aaaaddaeeffeeeeeeeeeeeeeee",
      "..............aaaaaaaaaddaeeffeeeeeeefeeeeee",
      ".............aaaaaaaaaadeeeefffefffffffeeeedd",
      ".............aaaaaaaaaadeeeeeffefffffffeeeeaaa",
      "............aaaaaaaaaaadeeeeeeeeefffffeeeeddaadd",
      "...........aaaaaaaaaaaadeeeeeeeeeeeeeeeeeeaddaad",
      "...........aaaaaaaaaaaaaeeeeeefeeeeeeefeeeaaddaad",
      "..........aaaaaaaaaaaaaadeeffffffeeeeffffaaaddaadd",
      ".........aaaaaaaaaaaaaaadeeffeefffeeeeeeaaaaddaadddd",
      "........aaaaaaaaaaaaaaaadeeffeefffeeeeedaaaaddaaddddd",
      ".......aaaaaaaaaaaaaddaaaeeffffffffeeeedaaadddaaddddd",
      "......aaaaaaaaaaaaaadddaaeeeffffffffeeedaaadddadddddad",
      ".....aaaaaaaaaaaddaaddddaeeeffffffffffeaaadddddddddaaddd",
      "....aaaaaaaaaaadddddddddddeeefffffffffaaaaddddddddaadddddd",
      "....aaaaaaaaaadddddddddddddeeffffffffeddadddddddddaaddddddd",
      "..aaaaaaaaaaaaadddddddddddddeffffffffddddddedddddaadddddddddd",
      "aaaaaaaaaaaaaaaaaddddddddddedefffffffdddddeeddddaadddddddddddd",
      "aaaaaaaaaaaaaaaaaaddeedddddeedefffffddddddefeeddddddddddddddddd",
      "aaaaaaaaaaaadddaaaaadeeeeeddeedeeffedddddddffeddddddddddddddddd",
      "aaaaaaaaadddddddaaddaadeeeedeeeeeeeddddddddffedddddddddddddddddd",
      "aaaaaaadddddddddaaddddddeeeeeeeeeeedddddeebffedddddddddddddddddd",
      "aaaaaaaddddddddddaaddddddeeeeeeeeddddddeeffffddddddddddddddddddd",
      "aaaaaaaaaddddddddddddddddddeeeeeeeeedddbfgffeedddddddddddaaaaddd",
      "aaaaaaaaaaddddddddddddddddddeeeeeeeeedefgggfeeeedddddddddaaaaaad",
      "aaaaaddaaaddddddddddddddddeddeeeeeeeeeefgggfeeeedddddddddaaaaaaa",
      "aaaaaddaaadddddddddddddffeeeeeeeeeeeeeecggggfeeeedcedddddaaaaaaa",
      "aaaaadddaaadddddddddeedeffeeeeeeeeeeeeeffggggfeeefgfdddddaaaaaaa"
    ],
    legend: {
      a: { m: "robe", step: 0 },
      b: { m: "robe", step: 2 },
      c: { m: "rope", step: 1 },
      d: { m: "skin", step: 0 },
      e: { m: "skin", step: 1 },
      f: { m: "skin", step: 2 },
      g: { m: "skin", step: 3 }
    }
  }
};
