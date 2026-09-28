import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Thorvald, Stonebreaker (BIBLE 10.3): a mountain of a man laughing at his own bet under
 * the moon, the nose broken more than once, a wild blond mane and a beard parting into two
 * iron-ringed braids, a bear pelt over shoulders too wide for the frame, and the head of his
 * great maul resting behind the far one.
 */
export const THORVALD: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
    hair: { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "fur" },
    fur: { ramp: [C.goldInk, C.flesh0, C.fur1], texture: "fur" },
    iron: { ramp: [C.night3, C.haze], texture: "metal" }
  },
  grid: {
    rows: [
      "",
      "......................................................ttts",
      "..............................iiihhg..........ttttttttttttt",
      "..........................hhhhiiihhggffffg.tttttttttttttts",
      ".......................ihhiiiiiiiihgghhgghhffttttttttttsssss",
      "...................ihiiiihiiiiiiiihgghhhhhhgfftttttttttsssss",
      ".................hiihiiiiiiiiiiiiihhgghggggggffttttttsssssss",
      "................ghihiiiiiiiiiiiiihhhhhhhgggfffffttttssssssss",
      "...............ghhihhhhiiiiiihhihhgghhhhhggfggfffsstssssssss",
      "...............ghhhiiihhiiiiiihhhhhhhhhhhhgggggfffssssssssss",
      "..............hhhhiiiiiiiiiihhiiihhhhhhhhhhghhggfffsssssssss",
      ".............hhhhhiiiiiiiiiiihhiiihhhhhgghhgghgfffffssssssss",
      ".............hhgihhiiiiiihhiiihhihhhhhgggggggggfffffssssssss",
      "............hhhgiiiiiiiiiihhhhghhhhhhhhhgggggggfffffssssssss",
      "............hgggiiiiiiiiiihgggghggghgghhggggggggggffssssssss",
      "...........hhgggiiiiiiihhddddgghgggggghhggggfgggggffsssss..s",
      "..........hhggggiiiiiiiidddddddccccccfhgggfgfffgffffp",
      "..........ggggggiiiiiiiddddddddccccccccggffggfgggfffp",
      "..........gfgghhhiiiiidddddddddcccccccccbffggfffgfgff",
      "..........gfgghhhhhiiidddffddddccccccccbbbggffffffgff",
      "..........ffgghhhiihhiddgffffgccccccgfffgbbffffffffff",
      "..........fffggghhihhdddddddddcccccccccbbbbbgfffffffg",
      "..........fffggghhhhhdddddddcccccccccccbbbbbgffffffgg",
      "..........fffgfgghhhhdddddEEEccccccccEEbbbbbfffffffgg",
      "..........ggggfggghhhddddEddcEccdcccEccEbbbaffffgffgg",
      "..........gggfffghgggddddcccbbccdcccccbbbbbaafffgffgg",
      "..........gggfffghhggddddcccccccdbccccbbbbbaafffgffgg",
      "..........gggfffghhhgcccccccccccccbccbbbbbbaafffgfffg",
      ".........gfgffffffghhcccccccccccccbccbbbbbaaffffggffg",
      ".........gfgffffffghhhcccccccccccccbbbbbbbaaffffgffff",
      ".........ggfffffffgghhiccccccccccdcbbbbbbbaffffffffff",
      ".........ggffffffffghhicccccchhhbcabaggbbafffffffffff",
      ".........gfffffggffghhiiccchhhhggggggggggaffffffffff",
      ".........gfffffggffghhiiicccgggggggggggggfffffffffff",
      ".........ffffffggffghhhiicccccccbbbbbbbbffffffffgfff",
      ".........fgffgffgff.hghhhhcccaaaaaaaabbffffffffggfff",
      ".........fgfggfffff.ggghhggccaddddddabfffffffffggfff",
      ".........fffggfffff..ggghggggbEEEEEEbffffffffffggfff",
      ".........fffggfffff..ggghgggggabbbbagffffffffffggggf",
      ".........fffggfffqqq.ggggggggfggggffgffffffffffgfggqqq",
      ".........fffgfffqqqqp.ggggfggffggffffffffffffffffqqqqpp",
      "..qqqq...ffqqqqqqqqppoggggfggffggffffgffffffoopppqqqpppqqqp",
      ".qqqqpp..ffqqqpppppppqqfggfggffffffffgffffffoqqqppppppqqqqpp",
      ".qqqpppqqqpqqppooooopqqffgfgfffffffgggffffffqqqqppooooqqppppqqq",
      ".pppppqqqqppppooppppqqqqfffgfffffffgggfgfffpqqqppooooopppppqqqqp",
      "..ooppqqqpppppppppqqpppppfffffffffffgffgffppppppoooooooooopqqqpp",
      "...qqpppppppppppppqqqpppppggfffffffffgggfppooooopoooooooooopppoo",
      "..pqqpppppppppppppqqqpppphhhffffffffhhhgppoooppopooopoooooooooo",
      ".ppqqppppppppppppqqqqppppgggfpppppppgggggppooppppooopoooooooooo",
      "pqqqqqpqpppqppppqqqpppqppphhhgpppppppphhhgppppppppoooooooooooooo",
      "pqqqqqpqpppqppppqqqpppqppohggffpppppppgggfppppppppoooooooooooooo",
      "ppqppqpppppppppppppppppppihgffpppppppphhgfppppoopooppooooooooooo",
      "ppqppppppppppppppppppppphhhffpppppppphhggppppooooooppooooooooooo",
      "qpppppqqppqpppqppqqpppppttsssppppppppggttsssopooooopoooooooooooo",
      "ppppppqqppqqppqppqqpppppphhhgfppppppppphhffpoppoooopoopooooooooo",
      "pppppppppppqppppppppppqpphgfffppppppppphhffpopppoooooopooopooooo",
      "pppppppppppqqqppppppppqphhgfpppppppppphhhfppopppoooooooooopooooo",
      "pppppppppqqqpppqqppppppgggffppppppppppgggfppooooooopoooooooooooo",
      "ppqqppppqqqppppqqpppppppghhfpppppppppppfhhhgooooooopoooooooooooo",
      "ppqpppppqqppppqqqppppppphttsssppppppppoottsssooooooooooooooooooo",
      "pppppppppppppppppppppppphgffqpppppppppohhgffoooooooooooooooooooo",
      "pppppqppppppppppppppppphhgfpppppppppppohhgfpopoooooooooooooooooo",
      "pppppqpppppppppppppopppggggppppppppppppggggpppoooooooooooooooooo",
      "pppppppppppppppppppopppphhgfpopppppoopppghhgfpppoooooooooooooooo"
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
      i: { m: "hair", step: 3 },
      o: { m: "fur", step: 0 },
      p: { m: "fur", step: 1 },
      q: { m: "fur", step: 2 },
      s: { m: "iron", step: 0 },
      t: { m: "iron", step: 1 }
    }
  }
};
