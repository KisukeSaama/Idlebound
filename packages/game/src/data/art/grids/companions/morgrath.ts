import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Morgrath, Lich Lord (BIBLE 10.3): a grinning skull turned toward the monsters, moonlit
 * bone with cracks and hollow temples, a tarnished crown worn askew with one point broken
 * and its settings empty. Mint soul-fire burns in the sockets and a wisp of it rises from
 * the far one. A high dark collar trimmed with bone.
 */
export const MORGRATH: PortraitRecipe = {
  materials: {
    robe: { ramp: [C.ink, C.night2, C.dusk], texture: "cloth" },
    bone: { ramp: [C.night2, C.dusk, C.haze, C.lilac, C.paper], texture: "bone" },
    gold: { ramp: [C.goldInk, C.goldDeep, C.goldDark], texture: "metal" }
  },
  grid: {
    rows: [
      "....................................da",
      "....................................fab",
      ".....................................fab............a",
      ".....................................faab..........fa",
      ".....................................faaaa........ffb",
      ".....................................faaab.......afhb",
      ".....................................daaaba......gabb",
      "...........................ha........daaabb......fabb",
      "...........................fababbbba.ffaaabb....ffabb",
      ".......................dhaafddaabbbbbbdaaaab...fffbbb",
      ".....................haaabbfdddaaaaaadaaaaaaba.ffabbb",
      "...................haaaabbbfddddaaaafddaaaaaaaahaabbb",
      ".................haaaaaabbbffdddaaaaaaaaaaaaaaaaabbbb",
      ".............f..hahaaaaaaaaffdddaddddaaaafbaaaaaabbbb",
      ".............fahhhaaaaaaagfffdddgaddddbaafddaaaaabbdb",
      "..fdd........ffahhaaaaaaaffffffaghddddaaadddaaaaaaafh",
      "...ffdda....ffffhaaaddddfffffffafhhhaaaaadddaaaaaaahb",
      "....ffdda...fggfffdddddffffffffffhhaaaaaaaaadhaaabaab",
      "....fffdabffggffffffffffffffddddddfaaadffffffggfffhbba",
      ".....fffaffffffffffffffffffffddddddffffaabbbbcbbbbagaa",
      ".....ffffffffffffffffffffffffffffffhaabccccccccbbbccaa",
      "......fffffffffffffffffffffffffffhaabbccccccccccbbbccg",
      "..ddh.fffffffffffggfffffffffffhaaababbbccccccccccbbbcb",
      "..ddhhhhfffffffffggfffffffffgaaaaabbbbbbcccccccccbbbcca",
      "...fffffhffffffffgffffffffffgaaabbbbbabccccccccccbbbccb",
      ".....fffhfffffffffffffffhahfffaabbbbbaaabcccccccccbbbbc",
      "......ffggfggfffffffffhhhahhffhabbbbbbabacccccccccbbbbca",
      ".......ffggggfffffffhhhhhaaffffgbbabbbbbbccccbbcccbbbbbb",
      "........fhgggfffffhhhhhhhhffhgffabaabbcccccccbbbccbccbbbb",
      "........fhggfffffhhhhhahhhhgggffhbaabcccbbcccbbbbbbccbbbcb",
      ".........fhffffghhhhhaaahhhggfffhaabbcbbaaaabbbbbabcbaaaab",
      ".........fhfffggghahhaaaahhhgfffaaaabaaffaadabbbaaaaaffffaf",
      "..........ffhggggffhhaaaaahhffffaabafffffffedaaaahhafffffhf",
      "...........hhhggghhhhhaaaahffffhabfffffffffdddahffhfddffff",
      "...........ahhfgghhhhhhhggfhgfffhfffffedffffdffabaffedddda",
      "...........hahhghhhhhhhhggfhgffhafffdeedffffdfaabbfecdddaa",
      "...........haahhhhhahhhhggffgfhaafffdccefffddhaaabbcceddaa",
      "............aahgghaaahhhggffffaabffdccccffffdaaaaabccdddaa",
      "............haahghaaahhhhgffffhacffdccccffffaabaaaaddddffa",
      "............gaahhhahhhhggfffffhabafdeccdddfaabaaaafffffffba",
      ".............aahhhhhfggffffffhhaabddddddddabbbfhaffffbbabcb",
      ".............gahhhhffhhaaaaaaahaaabbadddbccbbahaffffaaaaabb",
      "..............fahhffggffhhaaahhaaaabccbaaadabaaaffffaaaaaba",
      "...............fhhhhhfffffhhhhaabbbbaaaaaadabaafffffbaaaaaa",
      "................ggghhffffffhhhaabbbbaaaaaabbbaafffffaaaaaa",
      "...........hhaaaagfggffffffffhhaadbbafffhabbbbbdhfffaahffh",
      ".........gfhaaahggfffffggggfffhaaaaffffffhabbbbbdaaaaa",
      "......fhhhffffhggggffffggggfffffffffffhahhabbbbbbbaaab",
      "....ffhhghhffffggggfffffhgggffffffffffhhhaabbbbbbbabba",
      "...ffffggggffffggggfffffhgggffffffffffhhhaaabbbaccacbba",
      "..ffffffgggfffffggfffffffhgghfffafffffhhhaaabbbabbbbaaaba",
      "..hffffffffffffffffffffffhghhhfhaffffffffffgfahfadadabfaba",
      "aggffffffffffffffffffffffhhhhhagaafffhgghfaahbadbacabbffhaa",
      "ggghfffffffffffffffffffffghhhaaghaffffffhfaaaababbbabhfffhaaa",
      "fhhhhffffffffffffffffffffghhaaahaaaffffffffffaadaaadaffffffaba",
      "fhhggghffffffffffffffffffgahhahhaaaaffffffaafdddfaaabfffffffaba",
      "fffffggghfffffffffffffffffahhaahaaaaaaffffhfgaaddaaabfffffffbbba",
      "hffffffffhfffffffffffffhfffhhaaaaaaaaahhahaaaaaaaaaaaffffffbbaaa",
      "gf.ffffffffaaddfffffffhgfffffhaaaaaaaahhaaaaaaaaaaaabfffffbbahf",
      "gg.ffffffffabbaaffffffagfffffffhaaaaaaaaaaaaaaaaaabbbfffabbbhf",
      "....ffffffffbbbaafffffagfffffffffhaaaaaaaaaaaaabbbbbcfffaaabf",
      "....fffffffhaaaaaaaffhhgfffffffffffhaaaaaaaaabbbbbbbcaffffgag",
      ".....fffffhaaffffhaaahffffhfffffffffffaaaaaaabbbbbbbbcffffhf",
      ".....fffffffffffffgghaafaahffffffffffffgaaaabbbbbbbbbaffhff"
    ],
    legend: {
      a: { m: "bone", step: 2 },
      b: { m: "bone", step: 3 },
      c: { m: "bone", step: 4 },
      d: { m: "gold", step: 0 },
      e: { m: "gold", step: 1 },
      f: { m: "robe", step: 0 },
      g: { m: "robe", step: 1 },
      h: { m: "robe", step: 2 }
    }
  }
};
