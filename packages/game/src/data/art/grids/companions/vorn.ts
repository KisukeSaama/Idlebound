import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Vorn, Beastmaster (BIBLE 10.3): a wolf's head worn as a hood, its snout and fangs over his
 * brow, warm eyes in the shadow of its jaw, a wild brown beard, grey fur on his shoulders and
 * the wolf's paws knotted on his chest. Over the near shoulder, Biscuit: a piece of the dark
 * with too many small pale eyes, watching you like a pet.
 */
export const VORN: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2], texture: "smooth" },
    beard: { ramp: [C.flesh0, C.fur1, C.fur2], texture: "fur" },
    pelt: { ramp: [C.night2, C.night4, C.haze, C.lilac], texture: "fur" },
    void: { ramp: [C.ink, C.night1, C.night2], texture: "ghost" }
  },
  grid: {
    rows: [
      "..............ge",
      ".............ggge",
      ".............gkkgee...........deeeee...............ge",
      ".............gkkkgeee.....dddeegggeeeee...........dde",
      ".............gggkkgeeeeggddddgggggggeeeee.......gddef",
      ".............jgggkkggeeggkkkkddggggggeeeee....ggggefe",
      ".............jgggkkgggggggddkkeedgggggeeefff.gggggffe",
      ".............ggggkkgggggggggkkgedgggggeeeeffeggggeff",
      "..............gggkkgggggggggkkgggggggeefeeefffegefff",
      "..............gggkkkgggggggkkkggggggggggeeeffffeefff",
      "..............ggggkkkggggggkgggggggggggggeeeeffffff",
      "...............ggggkggggggkkgggggggggeefeeeeeefffff",
      "...............ggggkjjjjkkkggggggggggeeeffeeeefffff",
      "...............ggggkjkkjjjggggggggggggggeffeeeeefff",
      "..............ddjjggjkkkjggggggccgggggibgeiegeeefff",
      "..............ddjggggkkggggggggeegeeegiiggggggeeeff",
      ".............gddjggggkggggggggeeeeeeeeaagggcdgeeeff",
      ".............gdjjgggkkgggkkggeeeeeeeeeeggddcdggeeffff",
      ".............ddjjjjkkkkkkkdgggeeeeeeeeeeegggggggeeffff",
      ".............dcjjjjkkkkkkkdgggeeeeegggeeeeeeeeegggefff",
      "............gdcjjjjkkkgkkgggggggggggggggeeeeeeeegjkeee",
      "............gdjjjjgggggggggggggggggggggggeeeeeeejjkeeff",
      "............gdjjjjgggggggkkgggggggggbhggggeeeeeejjjjeef",
      "............gdjjjgggggggggkggggggggjjahhgggeeeeegjjjjjdf",
      "............djjjgggggggggggggggghggjjjjgggggggggggjjjjdf",
      "...........gdjjjkggggggggggggggkkbbhjjjggggggggggjgjjjjj",
      "...........gdjkckkgggggggggggggggbibjhggggggaaggjbiejjje",
      "...........dkjkcggggggggggggghhhhhhggbhgggggbakjjbidjbf",
      "...........dkkcgggggggkkggggghhbhhhgghgggggehgkjjiijjif",
      "...........dkjccggggggkkkggghhibbbhhhhhhhgheeggjjjjjji",
      "..........gdjjjcgggggggggjkghhhhiihhhhhhhhhhegejjjjjje",
      "..........gjjjjggggggggggjkgghhhhibbbhhhhhhhfefejjjjje",
      "..........kjjjkkggggggggjjkggghhhbbbbbhgghhhhffjjjjjje",
      ".........kkjjjkggggkkkgjjjjgggghhbbbbbggghhhhffjjjjjje",
      "........dkjjjjjggkkkkggjjjjgggghhhbbbbgghgghhejjjjjjje",
      "........djjjjjjjjkkkkgjjjjggahgghhbbbbhgjjjggejjjjjjje",
      ".......gdjjjjjjjjkkkgjjjjjggaahghhbhhhhagggggfjjjjjjje",
      ".......gdjjjjjjjjkkggjjjjjgggaaghhaaaaaaggjjahjjjjjjje",
      "..ggjj.gjjjjjjjjkkggjjjjjjjggggghaaaaaaaaaaaahhjjjjjjee",
      "jjjkkkjjjjjgjjjjkkggjjjjjjjjgggggaaaaaggggggaahgjjjjjee",
      "jjjggkkkjjggjjjjkkgjjjjjjjjjjggggggjggghhghgjjagjjjjjee",
      "jggggggkjjjjjjjjkkgjjjjjjjjjgggjjaghhhhhhgheejajjjjjjee",
      "gggggggjjjjjjjjjkkgjjjjjjjjjgggggaghhhhhgggeeaajjjjjjee",
      "gggggggggggjjjjkkkgjjjjjjjjggggggggghhhhgggfgaagjjjjjee",
      "ggggggggjihjjjjkkjgjjjjjjjjggggjjggghhhaagaggaagjjjjgeeff",
      "gggihhggjihhjjjkkjjjjkkgjjjgggjjjaagjgggaaaaaaagjjjjeeeff",
      "ihgihigggghjjjjkkjjjjkkggjgggjjjaaaaagggaaaaaaajjjjeeeeff",
      "ibggigggggggjjjjggggjjkgggjjjjjgaaaaagaaaaaaahggjjgeeefffffff",
      "hgggggggggggjjjjjgggjjgggcjjjjjgggagggaaaaaaahgjjjeeedeffffff",
      "gggggggggggjjjjjjjggjjjggckjjjjgggggggaaaaaaaagjjgeekgeeffffffff",
      "gggggggggggjjkjjjjjggjjggkkjjjjgggggggaaaaaaaagjjeekggeeeeefffff",
      "kggggggggjjjkkkjjjjjkkjjggkkjjjggggggggaggaaaaggddkkgeeeeeefffff",
      "kkkgggjjjjjjjgdddjjjjkjjgggkkjjgggggggggajgagaggddkggggeeeefffff",
      "jjjjjjjjjjjjjggdggjjjjjjggggkkjjjgggggggajgggaajjjgggggeeeeeeeff",
      "jjjjjjjjjjjjjgggggggjjjjgggggkjjjjjgggggggggjaajjgggggeeeeeeeeff",
      "jkkkjjgggjjjgggggggggjjjjggggjjjjjjjgjjgggggjaajggggggeeeeeeeeee",
      "dddgggggeeeeeeegggggggjjjjgggjjjjjjjggjggaajjajggeggggeeeeeeeeee",
      "ddgggggggeeeeeeegggggggjjjjgggjjjjjjjjjjgaajggjgggegeeeeeeeeeeee",
      "dddggggggggeeeeeeegggeggjjjjjgkjjjjjjjjjjaggggcggggeeeeeeeeeeeeg",
      "dddggggggggeeeeeeegggeeggjjjjjkkjjjjjjjjjgggjjcggggeeeeeeeeeeeee",
      "dcddgggggggeeeeeeeggggeeggkjjjjjjjjjjjjjjjajjgkkgggggeeeeeeeeeee",
      "ccgggggggeeeeeeeeeeeeeeeegkjjjjjjjjjjjjjjjjjjaggggggggeeeeeeeeeg",
      "jkgggggggegeeeeeeeeeeeeeeegjgjjjjjjjjjjjjjjjaaaaggeggggeeeeeeeeg",
      "jkkkgggggggeeeegeeeeeeeeeghgggjjjjjjjjjjjjjgggaaggheegggeeeeeeee"
    ],
    legend: {
      a: { m: "beard", step: 1 },
      b: { m: "beard", step: 2 },
      c: { m: "pelt", step: 0 },
      d: { m: "pelt", step: 1 },
      e: { m: "pelt", step: 2 },
      f: { m: "pelt", step: 3 },
      g: { m: "skin", step: 0 },
      h: { m: "skin", step: 1 },
      i: { m: "skin", step: 2 },
      j: { m: "void", step: 0 },
      k: { m: "void", step: 1 }
    }
  }
};
