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
      "......................stut",
      "........................stu",
      ".......tuutttuu..........tsuu",
      "......uttttttuutu.........ssut",
      "....ut....stttttutu.......tssuu....t",
      ".............tttttutt......ssttt...tt",
      "...............tssttttt.....sstt....tu",
      "................ssssttttt...ssttt...su",
      "..................sssssttu..sssttu..su",
      "...................sssstttt..sstuu..su",
      "....................sssstttuusstu..ssuu",
      ".....................sssstuu.ssi...ssuu",
      "...............t......sssstjjjjiiiiii",
      "...........uuuuuututt..ssjjjjiiiiiijjii.....................t",
      "........utttssstttutuu.jjjjjjjjjiijjjjjjj..................t",
      ".......ttsstssssssssttjjjjjjjiiijijjiiiiii.................t",
      ".....qutqqqqqoo..sssssjjjjjjiiiijiiiiijjiiij................t",
      "....otsooooooooo....sjjjjjjjjiijjiiiijjiijjjjj..............t",
      "....pppppppppooo....jjjjjjjiiiiiiiffffffjjjjjjii...........t",
      "...ppppppppppoopo...jjjiiijjjiiiifgYYYYgfjjjjjjjiih.......t",
      "..ppppppppppppppo..iiijjjjjiiiiiifYAAKAYfjjjjjjjjjjii.....t",
      "..pppppppppppppooo.jjjjjiiiiiiiiiYAAAKAAYfiijjjjjjjjjii..t",
      ".ppppppppopppppooojiiiiiiiiiiihhifYAAKAYfjjjiiiiiiiiijjjj",
      ".ppppppppopppoooooiiiiiiiiiiiiiihgfffffffjiiiiiiiihhhhEEg",
      ".ppppppppoqqqoooooiiiiiiiiiiihhhhhhiiiiiijjjiiiihhhhhhfggg",
      ".pppqqqqqooooooooohhiiiihhhhhhhhhhhhhiijjiiiiiiiihhhhgggggg",
      ".qqqooooooppoooooohhhhhhhhhhhhhhhhhhiiiihhiiiihhhhhhhhggfff",
      "poooppppoopooooooohhhtuuhhhhhhhhhhhhhhiiiiihhhhhhhhggggggg",
      "pppppppppppooouuuuttttuuhhhhhhhggghhhhhhhhhhhhhhhgggggggf",
      "ppppppppppotutttsssssssshhgggggEhggggghhhhhhggggggggff",
      "pppppppppoooooooooosssssggggggggEgggggghggghhhhEEEEEEEEE",
      "popppppopoooooooooogggghhgggghhhhEEEEEEEEEEEEEEhhhugggg",
      "ooppopoopooooooooooo.hgghhhiiihhhhhhhhhhhhuhhhhhggtgggg",
      "oopoooopoooooooooooo..hhhhhhhhhhhhhhhhhhhhhhgggggggggg",
      "oooooooqoooooooooooo..tuuhhhhhhhhhhhhhhhhgghggggggggg",
      "oooooooooooooooooooouuttshhhhhhhhhhhhhhhhgggggggggg",
      "oooooooooooooooooootttsssggggghhhhhhggggggggggggg",
      "oooooooooooooooootttsssggggggggggggggggggggggg",
      "oooooooooooooootttssggggggggggggggggggggggg",
      "ooooooooooooooutsggggggggggggggggggggggg",
      "ooooooooooooutggggggggggggggggggggggffffff",
      "oooooooooooooghghhghghggggggggfffffffffhihhf",
      "oooooooooooohhhhhhhhhhhhffffffggggggggghiiihg",
      "ooooooooooohhhhihhhhhhhhhhhhhhggggggggghiiihhg",
      "oooooooooooihihihhhhhhhhhhhhhhhgggggggghiiiiiig",
      "oooooooooohihihhhhhhhhhhhhhhhhhgggggggghiiiiiiig",
      "oooooooooohihihhhhhhhhhhhhhhhhhggggggggghhhhhhhhf",
      "oooooooooihhhhhhhhhhhhhhhhhhhghggggggggghhhhhhhhff",
      ".oooooooohhhhhhhhhhhhhhhhhhggggggggggggfhjjiiiiiig",
      ".oooooooohhhhhhhhhhhhhhhhghggggggggggfgfhhhhhhhhggf",
      ".ooooooohhhhhhhhhhhhhhhghgghgggggggggfffghhhhhhgggf",
      "..oooooohhhhhhhhhhhhhhhgghghgggggggfffffgiiiiihhhhgf",
      "..oooooohhhhhhhhhhhhhhghghgggggggggffffffhhhhhhhgggf",
      "...ooooohhhhhhhhhhhhghghggggggggggfgfffffghhhgggggff",
      "....oooohhhhhhhhhhhhggggggggggggggfgfffffghhhhhhhggff",
      ".......hhhhghhhhhhghggggggggggggfgfffffffghhhhhhgggff",
      ".......ghghghhhhggggggggggggggfgffffffffffgggggggffff",
      "........hgggghghggggggggggggfgffffffffffffhhhhggggggff",
      "........ggggggggggggggggggfgffffffffffffffhhhhggggggff",
      ".........gggggggggggggggggffffffffffffffffggggffffffff",
      "..........ggggggggggggggfffffffffffffffffffgggggggggff",
      "............gggggggggggffffffffffffffffffffgggggggggf",
      "...............gggggffgffffffffffffffffffffffffffff",
      "....................gfgfffffffffffffffffffff.fffff"
    ],
    legend: {
      A: { pal: C.amber, glow: true },
      E: { pal: C.ink },
      f: { m: "gold", step: 0 },
      g: { m: "gold", step: 1 },
      h: { m: "gold", step: 2 },
      i: { m: "gold", step: 3 },
      j: { m: "gold", step: 4 },
      K: { pal: C.ink },
      o: { m: "frill", step: 0 },
      p: { m: "frill", step: 1 },
      q: { m: "frill", step: 2 },
      s: { m: "horn", step: 0 },
      t: { m: "horn", step: 1 },
      u: { m: "horn", step: 2 },
      Y: { pal: C.goldLight, glow: true }
    }
  }
};
