import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Ashka, Ember Priestess (BIBLE 10.3): dark skin under the moon, the hair pulled back from a
 * parted crown into thick ember-red braids, white ash dragged by fingers across the eyes, eyes
 * like coals, a ring of sparks behind her head, and the high collar of a scarlet mantle under
 * a defiant chin.
 */
export const ASHKA: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.night2, C.flesh0, C.fur1, C.fur2], texture: "smooth" },
    hair: { ramp: [C.blood, C.red, C.ember], texture: "fur" },
    cloth: { ramp: [C.night1, C.flesh0, C.blood], texture: "cloth" }
  },
  grid: {
    rows: [
      "............................aaaaaaaaaee",
      "........................eaaaaeeeaaaaaaaaaee",
      "......................beeeeeeeeccbeeeeaaaeeedd......g",
      "....................ebbccceeeeeebcceeeeeeaaaadddf..g",
      "...................aeaaaeeeaebbeecbeeeceaaaaaaade.g",
      ".................eaaaaaaeaaaabaeeaabbceeaccaaaeeedde",
      "................eeaaabbaabcccbbceeebeeeecbccaaeeceee",
      "................eeaaaabaabccebcceecceaaeececbaeeeeeee...g",
      "...............eeaaaaccbaaeeebbccaaeeeeeeaaaeeeeeadddegg",
      "..............eeaaaabcccbcceeebbaaaeeeeeeeeeeeeeeaaaeee",
      "..............eaaaaaeeeebbbceaaaaaaaaeeffffffffeeeeeede",
      ".............daaeeaaaaeeeeebaaeeeeeffffffffffffffffffde",
      ".............eaaceccbbccaaebeeeeeefffffffffffffffffffgd",
      "............ddcaeebbbbbcaaebbbbeefffffffggggfffffffffgg",
      "...........addeaaaebbaaaaaaabbbeefffffffggggggffffffffggg",
      "..........baeeaaaaebbaaeeeeaaaeeefffffffggggggffffffffgg",
      ".........ebaeecbbaaaaaeeeeeeeaeeeeffffffggggggffffffffgg",
      ".........eeaeeccbcaaaaaeeeeeeeeeeefffffgggggggffffffffeg",
      ".........eeaaabbaaaaaaaaaeeeaadeeefffffgggggggffffffffege",
      ".........eebbaebaaabbeeaaaaaaadeeffffffgggggggffffffffegg",
      ".........eebcaeaaaaaebeeaaaaaeeefffffffgggggggfffffffffgg",
      ".........eabbaaaaaeeebbeeaaaeeffffffffffggggggfffffffffeg",
      ".........baaaaaabaeeebbbeaeeefffffffeeaafggggffffffffffedd",
      ".........caaaeeaaaeeeaabbbeeeffffffeaafgfdaaeeffffffffaadg",
      ".........caaabbaaaeebbbaaaefffffffeefffgffaaaaaaffffaaaadg",
      "........fceaeeeaaaeeebbeaaeefffffffeeeeeaaaaaaaafffaaaaadg",
      ".....ggg..ceeaaaaffffabeaaeeffffffeddaaaaaaaaaaeffeaaaaadff",
      "..ggggggg.eeaaaaeaaaffaeeeeeffffffeeaaegggeaaeeeffedafaaafd",
      "..g..g....ebaaaeeaffaffaaeeeffffffggfaegggeeagffggedggeee",
      "..........ebaaafedffeefeaaeeffffffggfedgggeefgfffgfeefeee",
      "........geeeaaafefffaaeeaaeeffffffgggggggggffgfffffeedggg",
      "......gggeeaaaaeeeeeaadfeaaeefffffggggggggggggggfffeffggg",
      ".....gg.ecbaaaaaeeeeeaffeaaaeeffffffggggggggggggfffeeffggg",
      "........ecbbcaaaeeeeeeafeeaadddfffbbgggggggggggfffffeffgge",
      "........eeebeeaaaeeeeeafeeaaaddefffbbggggggggffffffffffegd",
      ".........eeaaebaaeeeefdffedddadefeefbbbgggggfffffffffffeg",
      "........aaaaaeeaaaeeeffffeeeeaadeeeffbbggggfffefeeeeeefeg",
      "........aceecceaaaaeefffeeeeeeadeeeeebbbggffffeaaeeeaffgg",
      "........ecbbcbaaaaaaafffaeeeeeeeeeeeeffbggffgggfffaaaffgg",
      "........eebbbbaaaaaaaaaaaeeeeeeeeeeeeeffgggggggggffeeeffg",
      ".......eeaaeeeaaaaaaaaaaaaeeeeeeeeeeeefffggggggggfffeegfg",
      ".......eeaaeeaaaaaaaaaaddaeeeeeeeeeeeefffffggggeeeeeeeg.g",
      ".......eeecceaaaaaaaaaaeeaddeefffefffffffffffeeddeeddgg.g",
      "......eaeecbaaebaaddaaadeeaddeefffffffffffffaeefeeeeee..g",
      ".....eeaaaaaaaebaaddaaadeeadddeffffffffffffffffgeeeeee..g",
      ".....ecbaaeeaaeeaaaaaaddeeaadddeefffffffffffffeeeeeege..g",
      ".....eccecbeeaaaaaaaaagdeeeaadddeeeffffffffffeeeaaaeg",
      "......eecccceaaaaaaaaggddeeeaaaaddeeffffffffeeeeeaaff",
      ".....eabccceaaaaaaaaagdddeeeaaaaaaddeefffffffggfffffeee",
      "....eeabcceaaaaaaaaaaaaddeeeeaaaaaaaaafffffffggffffaaadddeee",
      "...bbaebbeeaabaaaaaaaddddeeeeeaaaaaaaaaeeffffffffffaaaaaaeee",
      "...ebaeeeeeeeeaaddaaddddddfeeeeaaaaaaaaaddeefffeefaaaaeeeeee",
      "..eeeaaaabbceeeeddaaaddddaffeeeaaaaaaaaaaadddddaaaaaeeeeeeee",
      ".eceaaaaabbbbeeeedaaaaddaaefeeeeaaaaaaaaaaaaaaaaaabbbeeeeeee",
      ".ecceaabaabbbeeeeeeaaaadaaeffeeeeaaaaaaaaaaaaaaabbbeebbbeee",
      ".ebbecccabbbbbbeeeeaaaaaaaaffeeeeeaaaaaaaaaaaabbeeeebbbbeee",
      ".ebacccebbbbbbbbeeeeaaaaaaaefeeeeeeaaaaaaaaabbbeeebbbbbbeee",
      ".eabcceabbbbbbbbeeeeeaaaaaaefeeeeeeeaaaaaabbeeeebbbbbeeeee",
      "eeacceeaabbbbbbbbeeeeaaaaaaeffeeeeeeaaaaacbeeeeebbbbddeeee",
      "eeabaaaaabbbbbbbbeeeeaaaddaeffeeeeeeeeaaceeeeeebbbbddbbedd",
      "cbaaaaaaaabbbbbbbeeeeaaaddaaffeeeeeeeeacbeeebbbbbbddbbdddee",
      "cbaaaaaaaaabbbbbbbeeeaaaddaaeffeeeeeeeecbbeebbbbbeebbeddeeee",
      "eeeaaaaaaaaabbbbbbbeaaaaadaaeffeeeeeeecbbbbbbbbbeebbeebbbeeee",
      "eeeeaaaaaaaaabbbbbbeaaaaadaaeffeeeeeecbbbbbbbbbeebbbeebbbeeeee"
    ],
    legend: {
      a: { m: "cloth", step: 0 },
      b: { m: "hair", step: 0 },
      c: { m: "hair", step: 1 },
      d: { m: "skin", step: 0 },
      e: { m: "skin", step: 1 },
      f: { m: "skin", step: 2 },
      g: { m: "skin", step: 3 }
    }
  }
};
