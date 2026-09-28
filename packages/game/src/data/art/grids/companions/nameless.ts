import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * The Nameless, Errant Knight (BIBLE 10.3): a battered great helm turned toward the
 * monsters, dented steel caught by the moon along its ridge, and behind the visor only a
 * void. A drooping red plume, heavy lamed pauldrons, a torn cloak. He remembers one word.
 */
export const NAMELESS: PortraitRecipe = {
  materials: {
    steel: { ramp: [C.night1, C.night2, C.night3, C.dusk, C.haze, C.lilac], texture: "metal" },
    plume: { ramp: [C.night1, C.blood, C.red], texture: "fur" },
    cloth: { ramp: [C.ink, C.night1, C.night2], texture: "cloth" }
  },
  grid: {
    rows: [
      "",
      "",
      "...........................mmmm",
      ".........................lmmmmm",
      ".......................mmlmmmmm",
      "......................mmmmxxxxxxxxww",
      ".....................mmmxxxxxxxxxwwwuuu",
      "....................mmxxxxxxxxxxwwxxxuutt",
      "...................llxxxxxxxxxxxxxwwxuuttt",
      "..................llxxxxxxxxxxxxxxwwxuutttt",
      ".................mllxxxxxxxxxxxxxxwwxuutttts",
      ".................llxxxxxxxxxxxxxxxwwxttttttt",
      "................mlxxxxxxxxxxxxxxxwwwxutttttst",
      "...............lmlxxxxxxxxxxxxxwwwwwxuuttttwss",
      "..............lmllttttttttttttttttttttttttttss",
      "..............lmllxxxxxxxxxxxxxxwwwxxttvtttvss",
      ".............lllllxsxxxsxxxsxxwswwwsxttsttssss",
      "............llllllxxxxxxxxxxxwwwwwwwxtttttssss",
      "............lllllxxxxxxxxxxxxwwwwwwwxtttttssss",
      "...........llllllxxxxxxxxxxwwwwwwwwwxttttsssss",
      "..........lllllllxxxxxxxxwwwwwwwwwwwxttttssssss",
      "..........lllllllxxxxxxxssssssssssssxttttssssss",
      ".........lkllllkkxxxxxwxEEEEEEEEEEEEsssssssssss",
      ".........kklllkklxxxxxwxEEEEEEEEEEEEEEEEEEEEEEE",
      "........lllllkkllwwwwxwwwwwwwwwwwwwwEEEEEEEEEEE",
      "........lllllkll.wxwwxxwwwwwwvvwvvvvvvvvvvvvvvv",
      ".......llkllkkll.xxwwstwwwwwwwvvvvvvxtsssssssss",
      ".......lkklkkkl..wwwwwwwwwwwwvvvvvvvxssssssssss",
      "......kklkkkkll..wwwwwwwwwwvvvvvvvvvxssssssssss",
      "......kklkkkkll..wwwwwwwwwvvvvvvvvvvxssssssssss",
      ".....kklkkkkkk...wwwwwwwwwvvvvvvvuvvwssssssssss",
      ".....kklkklkkk...wwwwvwvvvvvvvvvvuuvwsEssEssEss",
      "....kkllkklkk....wwvvvvvvstvvvvvvuuuwssssssssss",
      "....klllkkkkk.....vvvvvvvwvvvvvvuuuuwsssssssss",
      "...kkllkkkkk......vvvvvvvvvvvvvuuuuuwsEssEssEs",
      "...kk.lkk.kk......vvvvvvvvvvvuuuuuuuwsssssssss",
      "..kkk.kkkkkk......vvvvvvvvuuuuuuuuuuwsssssssss",
      "..kk.kkk.kk.......vvvuuuvuuuuuuuuuuuwsEssEssEs",
      ".kkk.kkl.kk.......uuuuuuvuuuuustuuuuwsssssssss",
      ".kk.kkk.kk........uuuuuuuuuuuuwuuuuuwssssssss",
      ".kk.kkk.kk........uuuuuuuuuuuuuuuuutwsEssEssE",
      "kk..kk..kk.........uuuuuuuttuuuuuuutwsssssss",
      "kk.kkk.kk...........uuuuuuuuuttututtwssssss",
      "k..kk..kk............uuuuuutuututuuuwsssss",
      "k..kk..kkpppppppppppppuuuuutuuuuuuttwsssssssopppooooooo",
      "k.kkk.xxwwwwwppppppppwwwwwwwvvvvuuuutttsssssspppooooovvvvuu",
      "..kkxxxxwwwwvvvvvuuttvvvvvvvvuuuuuttttssssssswwwwwwvvvvvvuuuu",
      ".xxxxwwwwwwwvvvvuuuttvvvvuuuuuuttttsssssssssswwwwwwvvvvvvuuuttt",
      "xxwwwwwwwwvvvvuuuutttttuuutttttssssssssssssssswvvvvvvvvuuuutttts",
      "wwwwwwwvvvvvvuuuutttssssssssssssssssssssssssssvvvvvvuuuuutttttss",
      "wwwvvvwwwwwvvvuutttsssssssssssssssssssssssssssvvvvvvuuuuuuttssss",
      "vvvwwwwwwwwwssssssssssssssssssssssssssssssuussssssssssvvuuuttsss",
      "ssssssssssssvvvuuutttsssppppppppppppppppppuuuwwwvvvvvvssssssssss",
      "wwwwwwwwwvvvvvvuutttssssppppppppppppppppppvvvvvvvvvvvuuuuuttttss",
      "wwwwwvvvvvvvuuuutttsssssppppppppppppppppppvvvvvvvuuuuuutttttssss",
      "vvvvvvvwwwvvuuutttssssssppppppppppppppppppuvvuuuuuvvuuuuuutsssss",
      "vvvvwwwwwvvsssssssssssssppppppppppppppppppuussssssssssuuuuttssss",
      "sssssssssssvvvuuutttssssppppppppppppppppopttvvvvvvvvvvssssssssss",
      "wwwwwwwwvvvvvvvuttttssssppppppppppppppppopttvvvvvvvuuuuutttttsss",
      "wwvwvvvvvvuuuutttttsssssppppppppppppppppopvvvvvvuuuuuutttttsssss",
      "vvvvvvvwvvvvuuttttssssssppppppppppppppppopuuuuuuuuuuuuuuuttsssss",
      "vuuvwwwwvvvvssssssssssssppppppppppppppppppuussssssssssuuutttssss",
      "ssssssssssssuuuutttsssssppppppppppppppppppttuvvvvvuuuussssssssss",
      "wwwwwvvvvvvvvvvttttssssspppppppoppppppppposuvvvvvuuuuutttttsssss"
    ],
    legend: {
      E: { pal: C.ink },
      k: { m: "plume", step: 0 },
      l: { m: "plume", step: 1 },
      m: { m: "plume", step: 2 },
      o: { m: "cloth", step: 0 },
      p: { m: "cloth", step: 1 },
      s: { m: "steel", step: 0 },
      t: { m: "steel", step: 1 },
      u: { m: "steel", step: 2 },
      v: { m: "steel", step: 3 },
      w: { m: "steel", step: 4 },
      x: { m: "steel", step: 5 }
    }
  }
};
