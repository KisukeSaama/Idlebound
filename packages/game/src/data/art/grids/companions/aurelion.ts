import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Aurelion, Dragon King (BIBLE 10.3): the last dragon turned toward the monsters, a heavy
 * skull and a wedge of snout under small overlapping scales, the old gold dulled by the moon
 * and lit only on the brow and the ridge of the snout, a crown of four ringed ivory horns,
 * cheek spikes, a crimson frill, smoke curling from a nostril, an amber slit eye in a lit
 * ring, and the line of the jaw curling up at its end, as if all of this amused him.
 */
export const AURELION: PortraitRecipe = {
  materials: {
    gold: { ramp: [C.night2, C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "scales" },
    horn: { ramp: [C.goldDeep, C.paper, C.moon], texture: "bone" },
    frill: { ramp: [C.blood, C.red, C.flesh1], texture: "smooth" }
  },
  grid: {
    rows: [
      "....g...............................g",
      "....ghh.............................ggg",
      "....gghhh...........................gggg",
      ".....fhhhh...........................ggghg",
      ".....ffhhhhh.........................gggghg",
      "......ffhhhhhh.......fff..............ffgghh",
      "......fffhhhhhhh.....effgffgg..f......ffggggh",
      ".......fffhhhhhhhhggeeeeeefgggefgg.g...ffggghh",
      ".......ffffhhhhhhhhhgfefeeffggffffefg..fggggghh",
      "........ffffhhhhhhhhhgffgfffffgfffefggfgffggghh",
      ".........ffffhhhhhhhhhfehgfffggffhfffffggffggghg",
      "..........ffffghhhhhhhhggggfggggffhfffffgggffghh",
      "..........ffffffhhhhhhhgggggggggfghhggffgggfffhh",
      "...........ffffffggggghggggggehhggggggggggfffffh",
      ".........ffeeffffffggggfggghgefggggggggggffffff",
      "......ffeeeeeefffffffgfffffffeghgggggggggfffggff",
      "....feeeeeeeeddeeefefeefffffheeffhhhggggggggggffggg",
      "hhgffffffffeddddeeeeeeeeeeffffeeefhhhhgggggggffffgg",
      "hhhhhffffffedddddddddeeeeeefffeeeeffhhggggggggfgfggg",
      "hhhhhhgggfffddddddddddeeeeeefeeeeddeffhgggfggggggggg",
      "gghhhgffgggggfffffdffeeeeeeeeedeeeeeeffgffffgggggggg",
      "ggggggfffeefggghgggefgggeeeeeeddeffceeeeefeggggggggg",
      "gggfffffffeeeeeeggggeefffffeeeeefhhggeeeeeeghghggggg",
      "...ffffeeeeeeeeddeefeeefffffeffefhhhheeeeegfffghhgggg",
      "....eeddeeeeeeeddddeeeeeeefgggffefhhfeeeeeffhhgghggggg.......hh",
      "...eeeeeeeeeeeeeedddeeeedddgggffffffeefffeeeeggggghhgggg......hh",
      ".eeeeeeeeeeefccccddffeeeeddefghffffffffggfffeeggggfgggggg.....hg",
      "eeeeaadddddddffffggffeeeeeeefgghhhffggggghgggefgfffggggggg....hh",
      "eeeeaaaaeeddddddffddddeeeffeefgfggffgggggggggffffffegggggggg..g",
      "eeeaaaaaeeddddddddddddeeefffeeeeeeffhggggggghgefffffgggggggggg",
      "....aaaeeddddddddddddeffeffffefeeeffggggggggggffgffeefhgggggff",
      ".....eeedddddddddddddefffffffffffeeedeggghgggfffggggdddgggffff",
      ".....eeeedddddeeddddddfefffffffffgggggeeeffggfffggeffdddegfffff",
      "....feeeeddeeeeedddeedeeefffffffgggggghggfefffffffgffgggegfffff",
      "....eeeeddeeeeeddeeeedeffffffffffffffffffggfefffffggggggggfffff",
      "...eaaedeeeeeeedeeeefddfffeffffffffffffffffffdeffffgggggggfffff",
      "..eccaddeeeeeeadeeefffddeeeeefffffffffffffefffeeeffgggggggfffff",
      "cccccadeeeeeeaadeeeeffdddeeeeeeefffeeeeeeeeeeeeeeeeeeffffffeeff",
      "ccccceeeeeccabadeffefffddddeeeeeeeeeeeeeeeeeeeeeeeeffffeeeddee",
      "cccceeeeeecfagdeeffefffeddddddddddddddddddddeeeeeeffffeeeeeef",
      "cccdeeeeeeeeafdefdeeefeeeddddddddddddddddddddeeeeefffffeeeeff",
      "ccddaaeefbceegdefffeefgeedddddddddddddddee.ff....eeeeeeeeeff",
      "ccaaaaeefbcaacdeffffeeffdddddddddddddddde...ff......eeeeef",
      "caaaaaeeccbaccdeffffeeffeeedddddddddddeef....f",
      "aaaaaaacccbaccddeffeeeeffeedddeeddddddfefe",
      "aaaaaacccccabddeffffeeeeffddddeeeedddefdef",
      "aaaaaacccccabeeefffffeefffedeeeeeeddeefdeff",
      "aaaaaacccccabddddffffeeffffeeeeeeeeeeefddfef",
      "aaaaaaccccaccdeeddefffeefffeeeeeeeeeeffddfee",
      "aaaaaaaaaaacceefeeffffedefffddeeeeeeefeddeeef",
      "aaaaddddeddfeeeffffffffdeffffdeeeeeeeffddefeggg",
      "aaaedddeeddeeeeffffefffeddfffeeeeeeeefedddfeefgggff",
      "..eeeeeefdeeefeeffffeffeddefeeedeeeeeeedddefeeffggg",
      ".eeeeeeeeeeefffdffffffeeedeeeeedeeeeeeedddeffffefggg",
      ".gfeeeeeeeeeefffdefffeeeeddeeeeeeeeeefedddefffefefggf",
      "..ffffeeeffefffffeeeeffeeddeeeeeeeeeefddddeffeeefffgf",
      "....ffffffffffffffeeffffeedeeeeeeeeeeeddddeefffefffgf",
      ".....ffffffffffffffffffffeeddeeeeeeeeeddddeeeffffffgg",
      "......ffffffeeeeeeeeffggggffdeeeeeeeeeddddeeeeeffff",
      ".......ggggggffeeeeddddgggggffeddeeeeeedddeeeeeffff",
      "..........gggggfffeeeddddddffffeddeeeeeeedeeeeefff",
      "..........ggggffffffeeedddddeefffeeeeeeeeeeeeeeff",
      "...........ggfffffffffffeeedddeeefeeeeeeedeeeeee",
      ".............ffffffffffffffeeeddeefeeeeeedfeeee"
    ],
    legend: {
      a: { m: "frill", step: 0 },
      b: { m: "frill", step: 1 },
      c: { m: "frill", step: 2 },
      d: { m: "gold", step: 0 },
      e: { m: "gold", step: 1 },
      f: { m: "gold", step: 2 },
      g: { m: "gold", step: 3 },
      h: { m: "gold", step: 4 }
    }
  }
};
