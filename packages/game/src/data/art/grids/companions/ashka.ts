import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Ashka, Ember Priestess (BIBLE 10.3): dark skin under the moon, the hair pulled back from a
 * parted crown into thick ember-red braids, white ash dragged by fingers across the eyes, eyes
 * like coals, a ring of sparks behind her head, and the high collar of a scarlet mantle under
 * a defiant chin.
 */
export const ASHKA: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.night2, C.flesh0, C.fur1, C.fur2], texture: "smooth" },
    hair: { ramp: [C.blood, C.red, C.ember], texture: "fur" },
    cloth: { ramp: [C.night1, C.flesh0, C.blood], texture: "cloth" }
  },
  grid: {
    rows: [
      "................................Y",
      "...........................A.........A",
      "......................Y...................Y",
      "",
      "..............................gghgg",
      "..................A.......ggghhhhggggggg......A",
      ".......................hhggggghggggggggggg",
      ".....................hhhhhhhggggggggggggggg",
      "..............Y.....hhhhhhhggggggggggggggggg......Y",
      "...................hhhhhhhhhhgggggggggggffgff",
      "..................hghhhhhhhhhhgggggggggggfffff",
      "..................gghhhhhhhhhggggggggggggggffff",
      ".................ggggghhgggghhhgggffffffffffffff",
      "...........A....hggggghhhhggggggggggffffffffffff.....A",
      "...............hgggggggggggggggggggggggfgfffffff",
      "...............hgggggggggggddggggggggggggfffffff",
      "...............gggggggggdddddddddddccgggggffffff",
      "..........Y....ggghhgggddddddddddddccccggfffffff......Y",
      "...............gggggggddddddddddddwwcccccfgffffff",
      "...............gggggghdaadwdddddddccwcwcccgffffff",
      "...............ggggggdddaaadddddddccccaaacbffffff",
      "...............ggggggdddddaaadddddccaaccccbbfffff",
      ".........A....ghhggggddddddwwadddccaacccccbbfffff......A",
      "..............hhgggggddddEEEEEddccccEEEEccbbfffff",
      "..............gggggggddddabAYadcccccbAYaccbbfgfff",
      "..............gggggggdddddddwddccccccccccbbbbgfff",
      "..............gggggggdddddddwwccccacccccbbbbbfff",
      "..........Y...ggggggdddddddddwwcccacccccbbbbbfff......Y",
      "............ggggggggddddddddcWccccaccccbbbbbbff",
      "...........ggggggfggYddddcccccccccaccccbbbbbbff",
      "...........ffffggfg.Acccccccccwcccbacccbbbbbb",
      "...........Aggffffg...ccccccccwbabaaccbbbbbba........A",
      "............ggffffff..cccccccccccccccbbbbbba",
      "...........hgggfffhg..cccccccccwccccbbbbbbb",
      "..........gggggghhhgg.ccccccccccccccbbbbbba",
      "..........fffgffgggggg.cccccccaaaaaabbbbbba",
      "...........ggggggghhhgg.cccccbcccbbbbbbbbaa",
      "...........ggffgggghggf.lccccccbbbbbbbbbaa",
      "..........hgggggfhhhgfmmmmccaaaadddaabbbaam",
      ".........gggggggfhgggfllll..aaaaadaaaaaaamlmmm",
      "..........ffgffgfgghhhglll..aaaaaaaaaaaamllllllm",
      "...........ggggggfghhggfllm.aaaaaaaaa..llllllllk",
      "...........gffggffghhgflllkaaaaaaaaaaamllllllllk",
      ".........hggggggffhhggllllkaaaaaaaaaaallllllllkkk",
      ".........ggffggff.ggghglllkaaaaaaaaaaallllllllkkk",
      "..........gggffggllghhggklkbbbbbbbbbbbllllllllklk",
      "..........ggggmmmllhhgffkllbbbbbbbbbbbllllllllkllk",
      "..........lllmmmmlhhhgflkllbbbbbbbbbbbllllkllkkklklkkk",
      ".......lllllllmlllggggglklkllllllllllllllkkllkkkkllkkkkkk",
      "......lllllllllllkkfhhhgklklllllllllllllkkkllkkkkllkklkkkk",
      ".....mllllllllllllkkhgggflklllllllllllkkklkklkkkkllkklkkkkk",
      "...lmmmllllllllllllhhhgfllklllllllllllkkklkklkkklklkkkkkkkkkk",
      "..lllmmllllllllllllhhggfllkllllllllllllllkkllklklklkkkkkkkkkkk",
      ".lllllmllllllllllllgghhhglkllllllllllllllklllklklklkkkkkkkkkkkk",
      "llllllllllllllllllllghhggfllllllllllkllllllllkllkkkkkkkkkkkkkkkk",
      "llllllllllllllllllllhhggflllllllllllkllllllllkklkkkkkkkkkkkkkkkk",
      "lllllllllllllllllllhhhgglllllllllllllllllllllkkkkkkkkkkkkkkkkkkk",
      "lllllllllllllllllllggggggllllllllllllllllllllkkkkkkkkkkkkkkkkkkk",
      "lllllllllllllllllllllhhhggllllllllllllllkklllkkkkkkkkkkkkkkkkkkk",
      "lllllllllllllllllllllhhggfllllllllllllllkkllkkkkkkkkkkkkkkkkkkkk",
      "llllllllllllllllllllhhhgfllllllllllllllkkllkkkkkkkkkkkkkkkkkkkkk",
      "llllllllllllllllllllhgggflllllllklkkkklkkllkkkkkkkkkkkkkkkkkkkkk",
      "llllllllllllllllllllgffflkllllllkkkkkkkkkllkkkkkkkkkkkkkkkkkkkkk",
      "lllllllllllllllllllllllllkllllllkkkkkkkkklkkkkkkkkkkkkkkkkkkkkkk"
    ],
    legend: {
      A: { pal: C.ember, glow: true },
      a: { m: "skin", step: 0 },
      b: { m: "skin", step: 1 },
      c: { m: "skin", step: 2 },
      d: { m: "skin", step: 3 },
      E: { pal: C.ink },
      f: { m: "hair", step: 0 },
      g: { m: "hair", step: 1 },
      h: { m: "hair", step: 2 },
      k: { m: "cloth", step: 0 },
      l: { m: "cloth", step: 1 },
      m: { m: "cloth", step: 2 },
      W: { pal: C.paper },
      w: { pal: C.haze },
      Y: { pal: C.amber, glow: true }
    }
  }
};
