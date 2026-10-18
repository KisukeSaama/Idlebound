import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Eldra, Timeweaver (BIBLE 10.3): an old woman with ashen skin and heavy lids under a deep
 * grey cowl, white hair at her temples. Her raised hands hold threads of golden light strung
 * like a loom's warp; one thread rises into the dark, toward what she will not say.
 */
export const ELDRA: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.haze, C.paper], texture: "smooth" },
    hair: { ramp: [C.lilac, C.paper], texture: "fur" },
    cowl: { ramp: [C.night2, C.night3, C.dusk, C.haze], texture: "cloth" }
  },
  grid: {
    rows: [
      "...........................ffffffff",
      "........................ffffddddfffffcc",
      "......................ffdddddddddfffffffff",
      ".....................ffddddddddddffffffaaaff",
      "....................fddddddddddddffddfffdaaaf",
      "...................faaddddddddddddddeffffffaaf",
      "..................faadddddddddddddfecgcfffffaaf",
      ".................faaaddddddddddddfgggfdffffcfaa",
      ".................aaaadddddddddddfggggddfffffcfa",
      "................aaaaaddddddddddfcgggeeeeffdffcaf",
      "................aaaaadddddddddffgggeeffffffffcaf",
      "................aaaaadaaddddddfccgeeccfffffffcdf",
      "................aaaaaaadaddddffccgegggfffffffcff",
      "...............aaaaaaaddaadddfccgefcggfffffcccff",
      "...............aaaaaaadddddddfccegggcccffffccfcb",
      "...............aaaaaadddddddffceeeeeegccfffccfcb",
      "...............aaaaaadddddddffeeeeedddefffffffcb",
      "..............daaaaaddddddddddeeeedddddffdadffcd",
      "..............dddaaadddddddddddddddddddfdaaaffcf",
      "..............dddaaaddddddddeeeddfddddecdaaabbff",
      "..............adddaaddddddddeegeeeeddeegfddfbfff",
      "..eeeeeee....aaaaddddddddddefecgeeeeeeeffddffbffg",
      ".ddeeeeeeff..aaaaaaddddddddffeegceeeceeecfffcafcg",
      ".ddddeeeeff..aaaaaadddddddddfdeeeecggeeeecffcbfggg",
      ".ddddeecccf.daaaaaadddddddddddddeeggeeeeeecfcffgggg",
      ".ddddeddddfcdaaaaaadddddddddddddeeeeeeddeefcfbfgggg",
      ".dddddfcdddfaaaaaaddddddddddddddeeeegeddddfcadfggggg",
      "ddddddceedfgdaaaaaddddddddddddddeeecccfdffffadcgggggg",
      "ddddddeeeffcdeaaaddddddddddddddeeeffffffcffaadggggggg",
      "ddddddeeedffaaeaaddaaddddfdddddeeedddddddffaafgggggggg.ec",
      "deeeddeedddfaaaeaaaaadddaffdddeeeeeeeedefffaafgggggggggfffffc",
      "deedeeeddddccaaaeaaaaaadaffddddeeeeeedddcffaafgggggggggeeeedf",
      "adddeeeedfgggfaaaeaaaaaddffdddddeeefffefcfaaacgggggggceeeeeff",
      "addddeeedfggcgaaaaeaaaaadffddddddeefggeccaaaacggggggcfeeeeeefc",
      "ddaaddeedffaaaaaaaaedaaaddcdddaaaddeeeeffaaafgggggggcdeeeddddff",
      "daaaddeedffaaaaaaaaadeaaadffdddaaaaddddfaaaafgggggggeeddfdeeffff",
      ".adddddeeefaaaaaaaaaaaeedddffddaaaaaaaaaaaadcgggggggggfdfeeddfff",
      ".ddddddecfcaaaaaaaaaaaaadeeeeddddaaaaaaaaaadcgggggggggfefeeeddee",
      ".ddddddecfcaaaaaaaaaaaaaaaddeedddddaaaaaaaafgggggggggfddddddddee",
      "..dddddeecfaaaaaaaaaaaaaaaaadddddddddaaaaeegccggggggggfaaaaddeee",
      "..aaddddefddddddddaddaaaaaaaadddddaaddddeeefffcgggggggcddaaadeee",
      "..aaadddefddddddddddddddaaaaaaaddddaddddeedffffcggggggcddaaadddd",
      ".aaaadddefdddddddddddddffddaaaaaddddddeeddafffffcggggggfddaadddd",
      "aaaaddddefdddddddddddaaadfffaaaaaddddeeddaaffffffggggggfddaadddf",
      "aaaaddddefddddddaaddddaaaddffdddaadeeddaaaaffadffcggggggddaddddf",
      "aaaaddddfddddddddaaddddaaaddddddddeeddaaaadffadfffggggggcddddddf",
      "aaadddddfdddddddddaaddfdaaaaadddddedaaaaaaffbaadffcgggggcadddddf",
      "aaaadddddedddddddddaaadfddaaaadddedaaaaaadffaaaafffcggggfaaddddd",
      "aaaaaaaabfddddddddddaaaddddaaaddeddaaaaaddffaaaaffffggggfaaaddda",
      "aaaaaaaabdddddddddddaaaaaddddddedddddddddddaaaaaffffcgggfaaaadda",
      "aaaaaaaaaddddddddddddadaaaadfeeddddddddddaaaaaaabffffcggfaaaaaaa",
      "aaaaaaaaaddddddddddddddddaaadeddddddddaaaaaaadaaafffffccaaaaaaaa",
      "aaaaaaaabddddddddaadddddddddddaddddaaaaaaaaafddaafbaffffaaaaaaaa",
      "aaaaaaaabddddddddaadddddddddddaaaaddaaaaaaaafddaaabaffffaaaaaaaa",
      "aaaaaaaaadeddddddaaaddddddddddaaaaadddaaaaaaffddaaaafffaaaaaaaaa",
      "aaaaaaaaaaeddddddaaadddddddddddaaaaaaddaaaaadffddaaaaaaaaaaaaaaa",
      "aaaaaaaaaaddddddddaaddddddddddddaaaaaaddaaaadfffdaaaaaaaaaaaaaaa",
      "aaaaaaaaaaddddddddaaaddddddddddddaaaaafadaaaddfffaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaedddddddaaddddddddddddaaaaddaddaadddffaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaffddddddaadddddddddddddaaaadaaddaddaafaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaffdffdddaaddddddddddddddaaaaaaddaadaaaaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaffadfdddaaaaddddddddddddaaaaadaaaaaaaaaaaaaaaaaaaaaaa",
      "aaaaaaaaaadffaadfdaaaaadddddddddddddaaaaddaaaaaaaaaaaaaaaaaaaaaa",
      "aaaaaaaaaadfffaaddaaaaaadddddddddddddaaaadaaaaaaaaaaaaaaaaaaaaaa"
    ],
    legend: {
      a: { m: "cowl", step: 0 },
      b: { m: "cowl", step: 2 },
      c: { m: "hair", step: 0 },
      d: { m: "skin", step: 0 },
      e: { m: "skin", step: 1 },
      f: { m: "skin", step: 2 },
      g: { m: "skin", step: 3 }
    }
  }
};
