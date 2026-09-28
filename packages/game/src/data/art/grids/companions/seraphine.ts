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
      "..........p.......pp.........pp..pppppp........po",
      "..........ppp.....p..........oppppp............p",
      "........o...pppp..p............ppp.............ppooooop",
      "..............ppppp...........o.pp..........o.ooooooooo",
      "............o..ppp.R............pp...........pooo...oo",
      "..............ppppp..........gfpppfff.o.....pooo.....oo",
      ".............ppp.ppp......hqqqqpppppggggffppoo........o",
      "................o.ppp..qqqpppppppppppppppoooo",
      "...................pppppppoooooooooopopppppo",
      "..................qpppooooogghhhhhhgfooopppppp",
      "..............hqqppoooogggffffffggghhhhgfoopppppo",
      "............hhhppooooghhhhhhhhhhfffffffffggooppoo",
      "...........hhhgooooggffffffggggffffffffffffffoooo",
      "..........hhhhgggghhgggggggff.......h.....ffffff",
      "..........hhhgggggggggggff...........h......ffff",
      ".........hhhggggggggfffcccccccc.......h...h..fff",
      ".........ggggggfggggggchcccccccccccccc.h..h....ff",
      "..........ggggffggggggchccccbbcbccccccbb...h....f",
      "..........ggffffgggggchccccccccccccccbbbb..h",
      "...........fffffgggggchccccbbcbbcccccbbbbb..h",
      "............ffffggfffhhccccccfccccccfbbbbba.h",
      "..............ffgggffhccffffgcccccccfffgbbaa",
      "................gffffhcccbbbbbccccccbbbbbbaa",
      "................gggfhccbcEEEEEbccccbEEEEbbaa",
      "................gfffhcbccbEEEbbccccbbEEbbbaa",
      ".................fggcccbcccHKcccccbbbHKbbbaaa",
      "...................gccccccccccccccbbbbbbbaaaa",
      "....................ccccccccccccdcbbbbbbaaaaa",
      "....................ccccccccccccccbbbbbaaaaaa",
      "....................cccccccccccccbbbbbaaaaaaa",
      ".....................cccbcccccccbcbbbbaaaaaaa",
      "......................cccbccccbbbabbbbaaaaaaa",
      "......................cccbcccbabbbbbbbaaaaaa",
      ".......................ccbbccbcbbbbbbbaaaaa",
      ".......................ccbcccacccbbbbbaaaaa",
      "........................ccccbcaaaaaaaaaaaa",
      ".........................bcccacccccbaaaaa",
      "..........................bbbbbbbbbaabaaa",
      "...........................bbbbbbbaaaaaa",
      "............................aabbaaaaaaa",
      "............................aaaaaaaaaa",
      "............................aaaaaaaakkk",
      ".........................lklaaaaaaaalkkkk",
      "........................llklbbaaaaaalkkkkkk",
      "....................mmlllkklbbbaaaaakkkkkkkk",
      ".................mmmmllkkkklbbbaaaaakkkkkkkkkll",
      "..............mmmmmmllkklkkkkkkkkkkkkkkkkkkkkkkkkk",
      "...........mlmmmmmlmmkkkllllllllllllllllkkkkkkpklokkk",
      ".........mmmllmmmllmlkkmmlmmlllllllllllllkkkkppopokkkkk",
      ".......mmmmmlmmmmlmmllommmmmllllllllmmllpoooppplkkkkkkkkk",
      "......mmmmmmmmmmmlmmopoopoppolllllllloooooolklllkkkkkkkkkk",
      "....mmmmmmmmmllmmmoopmmmmmopooooooooooollllkkkllkkkklkkkkkkk",
      "..mlllllmmmmlmmmpoommllmmmmlllRRooollllllllkllklkllklkkkkkkkkk",
      ".mlmmllmmllmlmooolmmmmlmlmmmllmmllllllllllllllkkkkkkkkkkkkkkkkk",
      "mmlmmmmmmmmmpppomlmllmlmllmmlllmlllllllllllllllllkkkkkkkkkkkkkkk",
      "mmmmmmmmmmmpppmmllmllmmllllmllllmllllllllllllllllkkkkkkkkkkkkkkk",
      "mmmmmmmmmopommmllmmlmmmlllllllllmmmlllllllllllllllkkkkkkkkkkkkkk",
      "llmmllmpoommmmlllmmmmmllmmlllllllllllllkkkllllklkkkkllkkkkkkkkkk",
      "lmmllooplmmmmmmmlllllllllllllllllllllkklllllkkkkkkkkkkkkkkkkkkkk",
      "llmmooommmmlmmmmlllllllllllllllllllllllllllllllkkkkkkkkkkkkkkkkk",
      "lllmpmmmmmlllmmlllllllllllllllllllllklkllllllllkkkkkkkkkkkkkkkkk",
      "llllmmmmllllllmmllllllllllllllllllllklkllllllllkkkkkkkkkkkkkkkkk",
      "mllmmmmllmmmlllllmlllllllllllkkkllllllkllllkkkkkkkkkkkkkkkkkkkkk",
      "lmlmmmllmmmllmllmmllllllllllkkllllllllllllkkkkkkkkkkkkkkkkkkkkkk"
    ],
    legend: {
      a: { m: "skin", step: 0 },
      b: { m: "skin", step: 1 },
      c: { m: "skin", step: 2 },
      d: { m: "skin", step: 3 },
      E: { pal: C.ink },
      f: { m: "hair", step: 0 },
      g: { m: "hair", step: 1 },
      h: { m: "hair", step: 2 },
      H: { pal: C.mire3 },
      k: { m: "cloth", step: 0 },
      K: { pal: C.ink },
      l: { m: "cloth", step: 1 },
      m: { m: "cloth", step: 2 },
      o: { m: "bark", step: 0 },
      p: { m: "bark", step: 1 },
      q: { m: "bark", step: 2 },
      R: { pal: C.flesh1 }
    }
  }
};
