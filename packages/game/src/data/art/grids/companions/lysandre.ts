import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Lysandre, Archmage (BIBLE 10.3): long pale hair parted like curtains, a lean face with the
 * chin raised and a smug half-lidded look, a gold monocle on its chain, a tall violet collar
 * stitched with gold. Beside him an open grimoire floats, burning violet: he reads it
 * backwards.
 */
export const LYSANDRE: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.dusk, C.lilac, C.paper], texture: "fur" },
    collar: { ramp: [C.night2, C.keepStone, C.royal], texture: "cloth" },
    gold: { ramp: [C.goldDark], texture: "metal" },
    page: { ramp: [C.lilac, C.paper], texture: "smooth" }
  },
  grid: {
    rows: [
      "..........................eeeeeeefe",
      ".......................iiijjiiiieeffffe",
      ".....................iiiiiiiiiiiiiiijefeff",
      "....................iiiiiiiiiiiiiiijiieeeff",
      "...................ijiiiiiiiijjiiijjjjjeeeff",
      "..................ijiiiiiiiiijjiijjjjjeeiiiffe",
      ".................ijiiiiiiiiijiiiijjjjeeeiiiieeff",
      "................iiiiiiiiiiiijjiijjjjeeeeeiiiieff",
      "................iiiiiiiiiiijjjiijjjjehheeiiijfeff",
      "...............iiiiiiiiiiiijjjijjjjehhhheeieeeeff",
      "...............iiiiiiiiiiiiiiiijjjjehiiiiddeeedef",
      "..............iiiiiiiiijjiiiiiijjjjehjjjjddeededff",
      "..............iiiiihhijjjiiiiijjjjehijjjjdeeedddef",
      "..............iiiihhiijjjiiiiijjjjehijjjjeeeedddef",
      ".............hiiihhiiijjiiiiiijjjjjijjjjjedeeeddbf",
      ".............iiiiiiiiiiiiiiiijjjjjhijjjjjjiiieedbf",
      ".............iiiiiiiiiiiiiiiijjjjehjjjjjjjiijeedbf",
      ".............iiiiiiihhhhiiihjjjjjjijiiijiiiijeedbf",
      "...........iiiiiiihhhhhiiihhijjjjiiiiiijeiiijjedbf",
      "..........iiiihhhhhhhhhiihhhiijjjhghhijeeeiijjedbff",
      "...........iihhhhhhhihhhihhiiijjedeehddeeeiijjfebff",
      "............iiihhhhhhihhhhiiiiijeeebedddeeejjefeeff",
      "...........iiihhhhhhhhihiiiijjjjedhhdddddeedjfeedfe",
      "...........iihhhhhhihgiihiiijjjeegggdddhhdeeeeeedf",
      "............hhiihhihgghihhiijjjeehhdedhhhieeddeeef",
      "............iiiiihhghhiihhiijjeeeeeeeeiihijeddeabf",
      "...........iiiiiihhhhgiihhhijeeeejjeediiihiebaaabf",
      "...........iiiiiihhhhghihhhijeeeejjeeiiiiiiebbabcf",
      "...........iiiiiihhhiiiihhiijebceeeeejiiiiiebbbbcf",
      "..........iiiiiiihhhiiiiiiiiiebceeeeejjiiiijecbbef............c",
      "..........iiiiiiiihiiiiihiiiiibeeeeeeeeiiiiiefbbfe...........cc",
      ".........iiiiiiiiihiihgghiiiiieeeeeeeeeihhiiefbbf............cc",
      ".........iiiiiiiihhiihggiiiiiieeeeeeeeedeeeeebbbf............cc",
      "........iiiiiiiijhhjihhgiiiiiieeeeeeeeedddbbbbbcf............ccb",
      "........iiiiiiiiihhjihhgiiiiiieeeeeejiieebbbbbbfe............c",
      ".......iiiiiiijjhhhjjhhghiiiiieeeeeejjjebcffbbbf.............b.b",
      ".......iiiiiiijjhhhjjghhhiiiiieeeeehhiibbbeebbcc............bcbb",
      "......iiiiiiijjihhhjighhghiiiieebbejjibbbbebbbc............bbbbb",
      ".....jiiiiiiijjhhhhjighhhhhiiieebbeejjbcccbbbbc...........dbbbbb",
      "....iiiiiiiijjihhhhjihhhhhhhhieeeeeeebbbcfbbbcc...........eebbbb",
      "...iiiiiiiiijjihhhhjihhiihhhgieeeeeeeebbecbbbc...........eeebbbb",
      "...iiiiiiiijjjhhhghiihhiihhhgieejjieeeeeebbbbc...........deeebbb",
      "..iiiiiiiiijjihhgghjihhiihhhhiieiiiieeeeeabbbc...........eeeebbb",
      ".iiiihiiiijjjhhigghjighiiihhhhjeghiieeceeabbbc..........deebbbbb",
      "iiiihhiiijjjihhhggheihghiihhhhjehhhiebbeeabbcc..........eebbbbbb",
      "iiiihiiiijjihgigggheigghhhhhhhjehhhddebbeabbcc.........eebbbbbbb",
      "iiihhiiiijihghggggiedgggdhhhhheedhedddaeebbbcc.........debbbbbbc",
      "iiihiiiiiihghhggggieeggdddddgheeeeddddaefbbbcc.........ebbcbbbbb",
      "iihhiiihihggggggggiedggdddddddeeeeddddbejebbcc........ebbccccbbb",
      "ihhiiihhhhggggggggiedgggddddddeeeddddbbjjebbcc........bbbcccccbe",
      "ihhiiihhhgggggggggieegggddddddeeeddddbejjebbcc...be...bbbcccccbe",
      "hhhiihhgggggggggggieeggggddaadeaadggabejjjbbcc..bbbbebbbbccbbcbe",
      "hhhihgggggggggggggieeggggddaadeaabgaaejjjjbbcc..ebbbbebbccbbbcbb",
      "hhhhggggggggddggggieeggggdddddeaabbaajjjjjbbcf..bbbbedbbccbbccbb",
      "hhhgggggghhgddddggieegggddddddeiijjeghjjjjebbffbbbeeddbbccbbccbb",
      "hggggggggghhgdddddijedggdddddddhijjegghhjjebbfebbeeddbbcccbbccbc",
      "ggddddgggggghhddddhjedddddddddddhiddgghhhjebbcbbbeeiiebccccbbbcc",
      "ddddddddddddghhdddhjeddddddddddaaaddddghbbabbbbbeeiiiebccccbbbcb",
      "dddddddddddddghhgggjeeddddddgggddaadddddibabbbbediiiiibbbbbbeeej",
      "gggggdddddddddghhggieedddddddgiddaaahddddeabbbeeiiiiiijbbeediijj",
      "gggggggddddddddghhghjedddddaddhdddaahbdddddbbeeiiiiiiiiiiiijjihg",
      "ddddggggddaaaaaaghhgjeeaaaaaaahidaaaabbddddbdeiiiiiiiiiiiiihhggh",
      "ddddddgggggaaaaaaghgijeaaaaaaaahiaaaaabbadddiiiiiiiiiiiihgghhhhh",
      "ddddddggggggaaaaaaghhjeaaaaaaaahiaaaahebadddjiiiiiiiihghhhhhhghh"
    ],
    legend: {
      a: { m: "collar", step: 0 },
      b: { m: "collar", step: 1 },
      c: { m: "collar", step: 2 },
      d: { m: "hair", step: 0 },
      e: { m: "hair", step: 1 },
      f: { m: "hair", step: 2 },
      g: { m: "skin", step: 0 },
      h: { m: "skin", step: 1 },
      i: { m: "skin", step: 2 },
      j: { m: "skin", step: 3 }
    }
  }
};
