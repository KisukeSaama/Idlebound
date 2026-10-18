import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";
import { SKINS } from "./skins";

/**
 * The Awakened, Hero of the Prophecy (BIBLE 10.3): a calm young face with eyes of pale
 * light, the moon full on its near side, under concentric rings of a dithered golden halo;
 * a pale gold mantle. Its skin and hair (steps 0 to 3) follow the walker's own settings.
 */
export const AWAKENED: PortraitRecipe = {
  materials: {
    skin: SKINS.light,
    hair: "fur-gold",
    mantle: { ramp: [C.night2, C.goldInk, C.goldDeep, C.goldDark], texture: "cloth" }
  },
  grid: {
    rows: [
      ".............................hbhhhhhhh",
      "........................bb...............bb",
      ".....................ccc...................cch",
      "...................cc.........................h",
      "..................c...........fffeeeee.........hh",
      "................cc........ggfffffeeeeeeeee.......hh",
      "...............c.......ggggg............eeeee......h",
      ".............cc......gggg..................eee......h",
      "............cc......hgg......................eef.....h",
      "...........cc.....hhh..........................ff.....h",
      "...........c.....hh........ffffffffghhhh........ff.....h",
      "..........c.....ch.......fffffffffffffffghh.......ff....h",
      ".........c.....cc......fffffffffffgffffffffhhh.....ef....h",
      "........c.....cc.....fffffffffggggggffffffeeehh.....ef...h",
      "........c....cc.....efffffffgggggggggggfeedddeehh....f....h",
      ".......b....hh.....ffffffffgggggggggggedddddddddgh...ff....h",
      ".......b....hh.....fffffffgggggggggggedddddddddddfh...ff...h",
      "......h....gg.....efefffffggggggggggedddddddddddddg....f....h",
      "......h...gg.....eeeeffffgggggffgggeddddddeedddddddh...fg...h",
      ".....a....gg.....eeeeeeeeggggffgggedddddddeeeedddddeh...g....h",
      ".....h....f.....eeeeeeeefgggfffggeddddddeeeeeeeddddeg...gg...h",
      ".....b...ee.....eeeeeeeegggfffggfddddddeeeffeeeddddde....g...h",
      "....h....ee.....eeeeeeeegggffggfdddddddeeefffeeeddddeg...gg...b",
      "....b....e......eeeeeeeeggffffgddddfddefefffffeedddddf...gg...b",
      "....b...ee.....eeeeeeeefggfffgddddffdeefffffffeeeddddeh...g...h",
      "....b...ee.....eeeefeeegggffffdddeedddeeffffffeeeddddeh...g...h",
      "...bb...e......eeeffeeeggfffgdddeeddedddddeffeeddddddeg...gg...b",
      "...b....e......eeeffeefgffffeddeeeeeeeddeeefeedddddddef...gg...b",
      "...b....e......eeeffeeffffffdddeeeeeeeddeeffeddddddddee...gg...b",
      "...b....e.....eeefffeegffffddeeeeeeehhfeeeffeegheddddee...gg...b",
      "...b....e.....eeeffeefgfffeddeefffeeffeefffffefgeddddee...gg...b",
      "...b....e.....eeeeeeeffgffeddeffffffffeffffffeeeeddddde...gg...b",
      "...b....e.....eeeeeeffffgedddeffffffffffffffffeeeedddde...gg...b",
      "...bb...ee....eeeeeefffffddddeefffffffffffffffeeeedddde...g...bb",
      "....b...ee....eeeeeefffgdddddeeeffffffffffeefffeeedddee...f...h",
      "....b...ee...eeeeeefffgeddddeeeeeffffffffeeeeffeeeddeee..ff...h",
      "....b....e...eeeeeefffgeeeeeeeeeeefffffffeeeeeeeedddeeeh.ff...h",
      "....b....ee..eeeeeffffedeeeeeeeeeeffffffffeeeeeeedddeeeh.f....h",
      ".....b....e.eeeeefffffddddddeeeeeeffffffffffeefeeddeeeehff...h",
      ".....b....eeeeeeeefffeddddddeeeeeeffffffffffefffddeeeeegf....h",
      ".....b....eeeeeeeefffdddddddeeeeeefffffffeeeeeffdeeeeeegf....b",
      "......b....eeeeeeeffeddddddddeeeeeefffffeeeeeeeeeeeeeeef....c",
      "......b....eeeeeefffddddddeedeeeeeeefffeeeeeeeeeeeeeeeeg....b",
      ".......b..eeeeeeeefedddddddeeeeeeeeeeeeeeeeeeeeeeeddeeeg...c",
      ".......bb.eeeeeeeefddddddddeeeeeeeeeeeeeeeeeeeeeedddeeeg...c",
      "........heeeeeeeeefddddddddeeeeeeeeeeeeeffffefeeedddeeeg..b",
      "........eeeeeeeeeefddddddddeeeeeeeeeeeeefffeeeddddddeeeg.b",
      "........eeeeeeeeeeeedddddddeeeeeeeeeddeeeeeeeddddddeeeefgb",
      ".......eeeeefeeeeeeeeddddddeffeeeeeeddddddddddeddddeeeeeh",
      ".......eeeeeffeeeeeefeddddeefffeeeeeeddddddddeeeddeeeeeeh",
      ".......eeeeeeffeeedeeeedddeefffeeeeeeedddddddeeeddeeeeeeh",
      ".......eeeeeeeffedddeeeedddeffffeeeeeeeddddddeeeeeeeeeeeg",
      "........eeeeeeeffedddeeeedddefffeeeeeeedddddddeeeeeeeeeeg",
      "........eeeeeeeeeffdddeeefddddffeeeeeeeddddddddeeeeeeeeeg",
      ".......eeeeefeeeeeggeeeeeefddddeeeeeeeddddddddddeeeddeefg",
      "......eeeeeeffeeeeeggfeeeeefedddeeeeeeddddddddddeedddeef",
      "......eeeeeeeeeeeeefggfeeeeeffdddeeeeeeeddddddddeddddeeg",
      ".....eeeeeeeeeeeeefffggfeeeeeffddddeeeeeddddddddeeddeeeg",
      "...eeeeeeeeefffeeeeeeeffgfeeeeffedddeeeeddddddddeeddeefhhh",
      ".eeeeeeeeefffffgfeeeeeeeefgfeeeeffdddeeeddddddddeeeeeefghhh",
      "eeeefffeffffffffggfeeeeeeeffffeeffgdddeeddddddddeeeeefffghhhh",
      "eeeffffggfggggfffgggfeeeeeeeefgffffgdddeeedddddeeeeeffeegghhhh",
      "eeefffggggggggggffggggeeeeeeeeeffffffeddeedddddeeeefeeeeefghhhh",
      "efefffgggggggggggffgggfeeeeeeeeeeffeefdddeddddeeeeffeeeeeeeghhhh"
    ],
    legend: {
      a: { m: "hair", step: 1 },
      b: { m: "hair", step: 2 },
      c: { m: "hair", step: 3 },
      d: { m: "mantle", step: 0 },
      e: { m: "skin", step: 0 },
      f: { m: "skin", step: 1 },
      g: { m: "skin", step: 2 },
      h: { m: "skin", step: 3 }
    }
  }
};
