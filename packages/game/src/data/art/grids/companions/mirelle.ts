import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Mirelle, Marsh Alchemist (BIBLE 10.3): a dark messy bun pierced by a glass rod, brass
 * goggles pushed up on her hair, one brow raised over a half smile. She holds up a vial
 * glowing lime in her ringed hand, over a stained leather apron: the next cure, for him.
 */
export const MIRELLE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.night2, C.night3, C.dusk], texture: "fur" },
    cloth: { ramp: [C.night2, C.night3, C.dusk], texture: "cloth" },
    apron: { ramp: [C.night2, C.flesh0, C.fur1], texture: "cloth" },
    brass: { ramp: [C.flesh0, C.goldDark, C.paper], texture: "metal" },
    glass: { ramp: [C.night3, C.dusk, C.paper], texture: "crystal" }
  },
  grid: {
    rows: [
      "...............gh",
      "................h......ch",
      ".................i...cccccccc",
      "..................igccccccccceih",
      "..................ggccccccccceei",
      "................hifgccccccccceee",
      "...............gigccccccccccceeeegccccgiiie",
      "...............gfccccccccccccccccccccccceihe",
      "...............gcccccccccccccccccffcccccfeeeefccce",
      "...............gccccccccccccccccffccccccfffcffeeeee",
      "...............ccccccccccccccccfccccccccfccccfgeeeeef",
      "...............ccccccccccccccccffcccccccfcccccgheeeii",
      "...............cccccccccccccccffffffccfffccccccaaffiie",
      "..............gcccccccccccccccffffghffffcccccccccfffei",
      "..............ficccccccccccccfffffhhffccccccccccccccci",
      "...............igcccccccccccfffcffaafcccccccccccccccee",
      "...............hiccccccccccfffccccccccccccaggccccccee",
      ".................gccccccccfffcccccfffcccfghhhhggccccee",
      "................ccccccccccffccccccffffffgghhhhgggccccei",
      "...............ff.cccccccffccccccccffffgghhhhhggggfccei",
      "...............f.cccccccfffcccccccccccfghhhhhhhgggfcccii",
      "..............g..cccccccffccccccccccccghihhhhhhggggcccei",
      "..............g..ccccccccccccccccccccghiihhhhhhhgggeccei",
      ".................hcccccccccccccccccfghhiihhhhhhhhggeccci",
      ".................hcccccccccccccccccggffffghhhhhhhgfeccci",
      "..................cgfcccgccccccccahgghhffccfghhhgcceegce",
      ".................f..fccgggcccccaghhhggffffffghggccceiice",
      ".................f...ccggggcccahhhhgfccffffgghgcccceihc",
      ".................f...cfgghffccghhhhhffiigfgghhfccccchic",
      ".....................cfggfffccghhhhhhggggfhhhhffffeiiic",
      "......gi.............ccggfaaacghhhhhhhhggghhhhfgffeiiid",
      "....gige..............cffggaacggghhhhhhhhhhhhhggggeiig",
      "...ffghei.............ccfggaafggghhhhhhhhhhhhhgggggii",
      "...fffgei.............cccgghgggggghhhhhhhhhhhhgggggi",
      "...gfffii.............hgccgggfgggghhhhhhhhhhhhhgggei",
      ".gghgiiii..............icccfffgggghhhhhhhhgggggffgei",
      "gghhiiiiii.............iicccffgghhhhhhhhhhhggffffei",
      "ghhhiiiiiii.............iifccffghhhhhhhhhhhhggfffe",
      "hhiiiiiiiii..............iigfffgghhhhhhhhhhhggffee",
      "hiiiiihiiiii..............f.ffffgghhhhhhhggffffee",
      "iiiiiggbiiii................fffffgghhhhhhhggffee",
      "hggggggggiiii...............ffffffgghhhhhhggffee",
      "fhgggggggbiii...............fefffffgghhhhhgggfe",
      "fgggghgggggghi...............efffffffghhhhhgge",
      "fggaaaaaaggggi...............efffffffffghhhgge",
      "aghhgfhiibhhghi..............effffffffffggggg",
      "aghgfffhiiiiggh..............eeffffffffffffee",
      "agaffgghhaaaaaaa............eeefffffffffffeeee",
      "gaafggggaaaaabba...........cceefffaafffffffeeee",
      "ggggggaaahbiiib...........cccddffaaaffffffffceeee",
      "ggggggaaahiii...........cccccfffaaaaaaffffffcccece",
      "gggggaaaaag.......eeeccccccccfffaaaaaggfffffccccceee",
      "gggggaaaaai.....ccccccccccccffffgaaagggggfffcccccffeee",
      "fggggaaaaaa....ccccccccccffcffffggaggggggggfcccccfffeee",
      "fffggaaaaf....cccccccccccfffffffggggggggggggafffffffffeeeee",
      "ffffaaaahf...cccccccccccffffffffggggggggggggaaffffffffffffeee",
      ".ffffaaaae..cccccccccccfffffffffagggggggggggaafffffffffffffeeee",
      ".ffffaafae..ccccccccfccffffffgggagggggggghhhaafffffffffffffffeee",
      "..ffffffff..cccccfffffffffffffggggggghhhhhhffafffffffffffffffffe",
      "..cffffffcceecccffffffffffffffghggggghhhhgfffffffffffffffffffffe",
      ".fccfffffceeecccffffffffffffffffggggggggffffffffffffffffffffffff",
      ".fccfffffceeeccffffffffffffffffffffffffffffffaffffffffffffffffff",
      ".ffccfffcceecccffcfffffffffffffffffffffffffffaaaafffffffffffffff",
      "..fccfffccccccccccfffffffffffffffffffffffffffaaaafffffffffffffff"
    ],
    legend: {
      a: { m: "apron", step: 2 },
      b: { m: "brass", step: 1 },
      c: { m: "hair", step: 0 },
      d: { m: "hair", step: 1 },
      e: { m: "hair", step: 2 },
      f: { m: "skin", step: 0 },
      g: { m: "skin", step: 1 },
      h: { m: "skin", step: 2 },
      i: { m: "skin", step: 3 }
    }
  }
};
