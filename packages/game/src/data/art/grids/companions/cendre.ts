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
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "............................ccbbbbb",
      ".........................ccccbbbbbbbbb",
      "........................cccccbbXbbbbbbb",
      ".......................ccccccbbYbbbXbbba",
      "......................cccccXbbbbbbbYbbbaa",
      ".....................ccccccYbbbbbbbbbbbaaa",
      "....................ccccccbbbbbbbbbbbbbaaaa",
      "....................bccccbbbbbbbbbbbbbaaaaa",
      "...................bbbbbbbbbbbbbbbbbbbaaaaaa",
      "...................bbbbbbaaabbbbbbbbbaaaaaaa",
      "...................bbbbbbaaabbbbbbbbaabaaaaa",
      "...................bbbbbbcccccbbbbbbbbbbbaaa",
      "...................bbbbbbbbbbbbbbbbbbbbbbaaa",
      "...................bbbbbbbEEEbbbbbbbEEEbaaaa",
      "...................bbbbbbbbbbbbbbbbbbbbbaaaaa",
      "..................bbbbbbbbbbbbbbbbbbbbbbaaaaa",
      "..................bbbbbbbbbbbbbbbbbbbbbbbaaaa",
      "...................bbbbbbbbbbbbbbbbbbbbbbbaaa",
      "...................bbbbbbbbbbbbbbbbbbbbbbbbba",
      "....................bbbbbbbbbbbbbcbbbbbbbbbbb",
      ".....................bbbbbbbbbbbbabbbbbbbbbbb",
      ".....................bbbbbbbbbbcccbbbbbbbbbb",
      "......................bbbbbcccccccccccbbbbbb",
      "......................bbbccccbcbbbbcbcccbbbb",
      ".......................bccccccaaaaaacccccbb",
      ".......................cccccccccccccccccccb",
      "........................ccccccccbbbccccccc",
      ".........................ccccccccddcccccc",
      "...........................ccccdddcccccc",
      "...........................cccccccccccc",
      ".........................llcccYcccccccl",
      ".....................llllllcccccdccccclllll",
      "..................lllllllmmccddddYdcccmmmlllll",
      "...............kkklllllmmmmcddddddddccmmmmllllkkk",
      "............kkkkkllllllmmmmcddddddddccmmmmmllllkkkkk",
      ".........kllkkkklllllmmmmmmmmmmmYmmmmmmmmmllllllkkkkkkk",
      "........kkllkkkkllllllllkkkkkkkYXYkkkkkkklllllllkkkkkkkk",
      "......kkkklllkklllllkkkddddkkkkXZXkkkddddkkkloollkkkkkkkkk",
      ".....kkkkklllkkkklkkkkccddddddYXZXYdddddcckkkkookkkkkkkkkkk",
      "....lkkkkklllkkkklkkkccccaddadYXZXYdadcaccckkkookkkkkkkkkkkk",
      "..kklkkkkkllkkkkkkkkbccccaccaccYXYccaccacccbkkookkkkkkkkkkkkkk",
      ".kkklkkkkklkkkkkkkkkbbaccaccacckYcccaccacbabkkkookkkkkkkkkkkkkk",
      "kkkklkkkkklkkkkkkkkkababbaccacckkcccacbabbaakkkookkkkkkkkkkkkkkk",
      "klkklkklkklkkkkkkkkkaaaaabbbabbkkbbbabbbaaaaakkoookkkkkkkkkkkkkk",
      "klkklkklkklkkkkkkkkaaaaaaaaaabbkkbbbaaaaaaaaakkkookkkkkkkkkkkkkk",
      "klkklkkkkkkkkkkkkkkaaaaaaaaaaaakkaaaaaaaaaaaakkkpokkkkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkkkkkaaaaaaaaaaaklkkaaaaaaaaaaakkkkpokkkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkklkklaaaaaaaaaklllllaaaaaaaaakkkkkppkkkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkklkklkkaaaalllllllllllkaaaallkkkkkppkkkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkkkkkkkkkklllllllllllllkklllllkkkkkkpokkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkkkkkkkkkkllllllllllllllklllllkkkkkkpokkkkkkkkkkkk",
      "kkkkkkkkkkkkkkkkkkkkkkkklllllllllllllllllllllkkkkkoookkkkkkkkkkk",
      "kkkkkkkkkkkkkkkkkkkkkkkklllllllllllllllllllllkkkkkkookkkkkkkkkkk"
    ],
    legend: {
      a: { m: "skin", step: 0 },
      b: { m: "skin", step: 1 },
      c: { m: "skin", step: 2 },
      d: { m: "skin", step: 3 },
      E: { pal: C.flesh0 },
      k: { m: "robe", step: 0 },
      l: { m: "robe", step: 1 },
      m: { m: "robe", step: 2 },
      o: { m: "rope", step: 0 },
      p: { m: "rope", step: 1 },
      X: { pal: C.ember, glow: true, light: true },
      Y: { pal: C.amber, glow: true, light: true },
      Z: { pal: C.goldLight, glow: true, light: true }
    }
  }
};
