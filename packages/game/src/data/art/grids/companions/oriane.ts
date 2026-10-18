import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Oriane, Echo Oracle (BIBLE 10.3): calm, cryptic, a little lonely. Dark skin under the
 * moon, long white hair parted in the middle, a band of matte linen over her eyes knotted
 * behind (she hears, she does not look), crystal drops that glow at her ears and collar.
 */
export const ORIANE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.night2, C.flesh0, C.fur1, C.fur2], texture: "smooth" },
    hair: { ramp: [C.night4, C.haze, C.lilac, C.paper], texture: "fur" },
    robe: { ramp: [C.night2, C.vault1], texture: "cloth" },
    band: { ramp: [C.fur2, C.fur3, C.paper], texture: "cloth" }
  },
  grid: {
    rows: [
      "............................bbbbbbbbbbbbbcccc",
      "........................bbbbbbbbbbbbbbbbbeebbbcc",
      ".....................bbbbbbbbbbbccbbbbbbbeeehbbcccc",
      "...................bbbbbbbbbbcccccbbbbbbbbcbeebbbbccc",
      ".................bbbbbbbbbbbcccccccbbbbbbbbccbehbbbccc",
      "................bbbbbbbbbbcccccccccccbbbbbbbbbbehccccccc",
      "...............bbbbbbbbbbccccccccccccccbbbbbbbbbehccccccc",
      "..............bbbbbbbbbbccccccccccccccccccccbhebbgbccccccc",
      ".............bbbbbbbbbbcccccccccccccccccccchffgggggfffbcccc",
      "............bbbbbbbbbbccccccccccccccccccccggggggggggffffbccc",
      "...........ebbbbbbbbbccccccccccccccccccccgggggggggggggfffbcc",
      "...........bbbbbbbbbbcbccbbcccccccccccccggggggggggggggggffbcc",
      "..........bbbbbbbbbbbbbbbbbcccccccccccbggggghhgggggggggggffbcc",
      "..........bbbbbbbbbbbbbbbbcccccccccccbggggghhhhhhggggggggeehcc",
      ".........bbbbbbbbbbbbbbbbcccccccccccggggggghhhhhhhhggggggebfbc",
      ".........bbbbbbbbbbbbbbbcccccccccccggggggggghhhhhhhgggggggbbbcc",
      ".........bbbbbbbbbbbbbbcccccccccccggggggggggghhhhhgggghgggbbecc",
      "........bbbbbbbbbbbbbbccccccccbccggggggggggghhhhhhggghhhggbbabc",
      "........bbbbeebbbbbbbccbbccccbcbggggggggghhhhhhhhhhhhhhhhhhbbec",
      "........bbbeeebbbbbbbcbbcccbbcbggggggggggeeeeggghhhhhhhhhhhfbbc",
      "........bbbeebbbehbbbbbccbbbcbggggggfffffeeeeeeehhhhhhhhhffffbb",
      ".......ebbbeebbeebbbbbbbbbbcbgggggfffhhhiihhhhhhhbbbcbbbbbbbbbb",
      ".......bbbeebbeebbbbbbbbbbbhgggghhbbbbhhhhgggfffffhbbbbbbbbbeebc",
      ".......bbbeeeeebbbbbbbbbbbbeghhbbbbbbhhggggggfffffhhbbbbbbbfffeb",
      ".......bbbeeeeebbbbbbeebbbbbbbbbbbhhfggfffffffffffhhhbbbbbffffbb",
      ".......ebbeeeebbbbbbeebbbbbbbbbhhhhhfffffeefffffggebbcccceefffb",
      ".......ebbeeebbbbbeebbbbbbbhhbhhhhhhhhfbbbbhbhbbccccccccccbcbae",
      ".......ebeeeebbeeeeebbbbbbehbbbbbbbbbccccccccbbbbbccbccccccbbbb",
      ".......bbeeeebfffgeeeeeebebbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbcbbcc",
      "........beeeeefffggeeeeeeebbbbbbbehhhhhbbbbbbbbbbbhbbbbbbbbbccc",
      "........beeeeefffffhgeeeeeeeebbbbbcccbbbbbbbbbbbbcccccccbbbbccc",
      "........beeeeegfffffgffeeeeeebbbbbbbbbcccbbbbbbccbbhggggffhbbbcc",
      "........eeeeefgfghfffffffeeehbbbbbbbccccbbbcbbhhffffgggggfffhbbc",
      "........eeeeefggghfffffffbbfffffffhhhhhheegfffffggggggggggffffbc",
      "........eeeeeegfgffffffffbbfffffffgggghhhhggggghhhgggggggggggfeb",
      ".........beeeeffgffffffffbbffffffggggghhhhhhhhhhhhfgggggggeeggb",
      ".........beeeefggffffffffbbfffffffggggghhhhhhhhhhffgggggggbeggb",
      ".........eeeeeeffffffffffbbffffffffgggggghhhhhhhhfffffffffeegeb",
      ".........eeeeeeefffffffffbbfffffffffggggghhhhhhhhgffffffffgggeb",
      ".........beeeeeeffffgggffbbffffffffffggggghhhhhhhggggggggggggbb",
      ".........beeeebbfffffgggfbbfffffffffffgggggghhhhhhhggggggggggbb",
      "........beeeeebbbfffbbggfbhffffffffffffggggghhhhhhhhggggggggeb",
      ".......bbeeeeebbbbffebfffbhfffffffffffffgggggggghhgggggggggbbb",
      ".......beeeeeecbccbeeefffbhfffffffffffffggggggggggggfffffffbbb",
      "......bbeeeeeeccccceeeeffbefffffffffffffgggggggggffffffffffbb",
      "......beeeeeeeccccceeceffbeefffffffffffffgggggggfffgggggggfeb",
      "......beeeeeeecccccebcbffbefffffffffffffffgggggggggggggggggbb",
      ".....bbeeeeeebccccbbbcbefcefffffffffffffffggggggggggggggggbbbc",
      ".....bbeeeeeebbcccbbbccefcefffffffffffffffgggggggggffffffebbbb",
      ".....beeeeeeebbccbbbbbcefcefffffffffffffffgggggggggffffffebbbbc",
      "....bbeeeeeeebbbbbbbbbcbfceffffffffffffffffgggggggghhggggbbbbcc",
      "....bbeeeeeeebbbcbbbccccfcefffffffffffffffffggggggghhhgggbbbbcc",
      "....bbeeeeeeebbccbccddcccceffffffffffffffffffggggggghhgggbbcccc",
      "...bbeebeeeeebbcccccddcccceffffffffffffffffffffggggggggggbbcccc",
      "...bbebbeeeeebbccbccccccfceffffffffffffffffffffffggggffgebbcccc",
      "...bbbbeeeeeecbccbbccccbfcefffffffffffffffffffffffffffffebbbbcc",
      "...cbbbeeeeeecccccbbcccbfbeffffffffffffffffffffffffffeeebbbbbc",
      "..bcbbbeeeeebccccccbbbcbbbgfffffffffffffffffffffeeeeeeeebbbb",
      "..bcebeeeeeebbcccccbbbcbfbggggffffffffffffffffffeeeeeeeecccb",
      "..ccbeeeeeeebbbcccccccccfbgggggfffffffffffffffffeeeeeeeecccc",
      ".bccbeeeeeeebbbcccccccccfbggggggfffffffffffffffffeeeeehbcccc",
      ".bdbbeeeeeeebbbcccccccccfbgggggggfffffffffffffffffeeeehbcccc",
      ".bbbbeeeeeeebbbbccccccccfbgfggggggfffffffffffffffffeeehbcccc",
      "..bbbeeeeeeebbbbccccccccfbfffgggggfffffffffffffffffeeehbccccc"
    ],
    legend: {
      a: { m: "hair", step: 0 },
      b: { m: "hair", step: 1 },
      c: { m: "hair", step: 2 },
      d: { m: "hair", step: 3 },
      e: { m: "robe", step: 1 },
      f: { m: "skin", step: 0 },
      g: { m: "skin", step: 1 },
      h: { m: "skin", step: 2 },
      i: { m: "skin", step: 3 }
    }
  }
};
