import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Nyx, Shadow Blade (BIBLE 10.3): a deep hood in her violet, its folds caught by the
 * moon, a dark scarf across it, a dagger's hilt at the shoulder. Under the hood there is no
 * face: only night sky, a veil of dark nebula and a few stars, two of them where eyes
 * would be.
 */
export const NYX: PortraitRecipe = {
  materials: {
    cloth: { ramp: [C.ink, C.night2, C.plum, C.keepStone, C.royal], texture: "cloth" },
    sky: { ramp: [C.ink, C.night1, C.night2], texture: "smooth" },
    scarf: { ramp: [C.ink, C.night1, C.night2], texture: "cloth" },
    steel: { ramp: [C.night2, C.haze, C.lilac], texture: "metal" }
  },
  grid: {
    rows: [
      "...........................dddddd",
      "..........................bbbbbbbbd",
      "........................bbbbbbbbbbbbd",
      ".......................bbbbbbbbbbbbbbe",
      "......................bbbbbbbbbbbbbbbbd",
      ".....................bbbbbbbbbbbbbbbbbbd",
      "....................bbbbbbbbbbbbbbbbbbbee",
      "...................bbbbbbbbbbbbbbbbbbbbeee",
      "..................bbbbbbbbbbbbbbbbbbbbbbeee",
      ".................bbbbbbbbbbbbbbbbbbbbbbbeee",
      "................bbbbbbbbbbbbbbbbbbbbbbbbeeee",
      "................bbbbbbbbbbbbbbbbbbbbbbbeeeeed",
      "...............bbbbbbbbbbbbbbbbbbbbbbbcccceee",
      "....ddfg.......bbbbbbbbbbbbbbbbbbbbbccccccceed",
      "...dhhffc......bbbbbbbbbbbbbbbbbbbbcccccccccee",
      "...ghhffg......ebbbbbbbbbbbbbbbbbbccccccccccce",
      "...dehdgg......ebbbbbbbbbbbbbbbbbcccccccccccced",
      "....gegd.......ebbbbbbbbbbbbbbbbcccccccccccccdd",
      ".....chfc......ebbbbbbbbbbbbbbbccccccccccccccced",
      ".....efhfd.ccedbbbbbbbbbbbbbbbbgghggggcccccccced",
      "......ehfddeeebbbbbbbbbbbbbbbbggghggggggccccccdd",
      "......chheeeeedbbbbbbbbbbbbbbeedddddggggccccccce",
      "....cfhhheeehhhebbbbbbbbbbbbbebbdddddgggcccccccee",
      "...dhfffheehiiiebbbbbbbbbbbbbbbbbbddddgggcccccced",
      "..ghffccheeciiibbbbedbbbbbbbeebbbbbeebgggggccccdd",
      "..ghcc.cfhdcciibbbbedbbbbbbbdebbbbbbbbbfggggcccce",
      "...c...gfddcciibbbbegbbbbbbdddbbbaaaabbbggggcccceg",
      "........ceegchhbbbbbgdbbbbbcgddbbbaaaabbbdggccccdg",
      "........cdfgccbbbbbbgdbbbbccgggbbbaaSSaabdgcccccdg",
      "........cdfgccbbbbbbgdbbbbcccggdebbaaaaabbddccccdd",
      "........ccggccbbbbbbggbbbbcccggdeebbbaaaabbggccccd",
      ".........cdddbbbbbbbggebbbcccgggeeebbbaaabbdgcccce",
      ".........cdfdbbbbbbbegebbbccccgggddbbbbbbbbddccccee",
      "..........cfdbbbbbbbegdbbbcccccgggggbbdddbdddccdgee",
      "..........cddbbbbbbbbgdebbbcccccgggggddddddddccdggg",
      "..........ccdbbbbbbbbbdebbbcccccggggggggggggcccddeg",
      "...........cfbbbbbbbbbdcbbbbccccccccgggggcccccgddee",
      "...........cfddbbbbbbbbddbbbbcccccccccgcccccccggee",
      "...........ccddbbbbbbbbgggbbbbccccccccccccccccggee",
      "............cccggbbbbbbbgggbbbbccccccccccccccggge",
      "............cccggccbbbbbbggdeebbcccccccccccccggbe",
      "............ccgggccgbbbbbbgdeeebbccccccccccccbbbc",
      "............eeeccgggggbbbbbbegeebbcccccccccccbbccc",
      "..........ddeeecccggggdcbbbbeggebbbbcccccccbbbccccc",
      ".........cddeeeedcggddddddbeeegggeebbbccccbbbccccgc",
      "........cceeeeeedddgddeeddccccddggddbbbbebbbcccccggccc",
      "........ccceeeeeeeddcdceeeddccccccccggeeegcccccccggcggg",
      "......cddeccceeeeeeedccccddeeeecccccgdeeggccggcccggcgggc",
      ".....ccdeeeccceeedeegdccccdddeeeddcccddccccgggcccggccggc",
      "...geeeddeeeecdeedddgedcgdccgddeeeedddccccddgccccggcccgcc",
      "..cggebbddeeeeccceddedddgdddgdddddeeeeeeeeddcccccdgccgggdd",
      ".cbbbddbbddeeeecceddeedeeggddeccggddddddddggcccccddccgggdee",
      "bbbbbbbbbbdeeeedggdddecceedddeecccgggggggggccggccddccggggeee",
      "bbbbbbbbbbddeeedggdddeeccdcggeeecccccgggggcccdgcdddccggggeee",
      "bbbbbbbbbbddddddddddddeeccdcggeeeeccccccccccddgcedgccggggdeee",
      "bbbbbbbbbbdddddddedddddeddccgggddeeecccccccddggcedgccgggddeed",
      "bbbbbbbbbbddgddddeeddddeeccccggggdddeeedddddddceedgccgggddded",
      "bbbbbbbbbbbggdddddedddddddcccggcccddddeedddddcceedgccggdddddec",
      "bbbbbbbbbbbggdddddeedddddddccggcccggdddddddgdcceddccggggdddgec",
      "bbbbbbeebbbggdddddebdddgdddddggddcccggddddgggceedgccggggdddgeg",
      "ggbbbbedbbeeggdggdebbgdggddddggdddcccggggggggeeddgcgggggddcgeg",
      "eebbbbedebdeggdggdebbgddgeeddcccddddccggggccddddgccgdgggddcgddd",
      "eeegbbbdebdegcdggddbbbddggedddcccddddccccccdddddgccdddgggdcgddd",
      "eeeggbbddeeegcdggddbbbeddgddddcccddddeedddddddddgccddggggdggdddd"
    ],
    legend: {
      S: { pal: C.moon, glow: true },
      a: { pal: C.essence },
      b: { pal: C.essenceDeep },
      c: { m: "cloth", step: 0 },
      d: { m: "cloth", step: 1 },
      e: { m: "cloth", step: 2 },
      f: { m: "cloth", step: 3 },
      g: { m: "sky", step: 1 },
      h: { m: "steel", step: 1 },
      i: { m: "steel", step: 2 }
    }
  }
};
