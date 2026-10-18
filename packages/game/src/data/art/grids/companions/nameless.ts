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
      "..........................fffcf",
      "........................eeefffef",
      "......................fffffffffefj",
      "...................cfeeffffffffflkjl",
      "..................fcbefffffeeffklkjjkkk",
      ".................f.eeefffeefeejjjkjjjjjjjjj",
      "................f.ffeeedaaaaejjjkkjjjjjjjjjjj",
      "...............ffeeeeeedbbeeajjjjjjjjjjjjjjjkkl",
      "...............ffeefeeadddddakjjjjjjjjjjjjjjjkkk",
      "..............ffeeffeaadddaaajjjjjjjkkkkkjjjjjkkkl",
      "...............eeffeaaedaaaajjjjjkkkkkkkkjkjjjjkkkl",
      "..............feffeaaaaaaaajjjkkkkkkkkkkkkkkjjkkkjkl",
      "..............eeffaaaaaaaajjjjkkkkkkkkkkkkkkjjjkkkjjl",
      ".............eefffaaaaaaaajjjjkkkkklllkkkkkkjjjjkkjjkl",
      ".............efffeaadaaaajkjjjkkkllllllkkkkkjjjjkkkjjk",
      ".............ffffaaddaaaajkjjjkkklllllllkkkkkjjjikkjjjl",
      "............ffffeaaeddaajkjjjjjkklllllllkkkkkjjjjkkjjjk",
      "............ffffeadeddaajkjhhjjjkklllllllkkkkjjjjjkjjjhl",
      "...........fffefadedeaaikkhhhijjkkkllllllkkkkjjjjjjjjjkk",
      "...........efeefadeddaaikkhhhiiijkkkllllkkkkkkjjjjjjjjjjk",
      "...........efdeeaeeeaaaikkjiiihhjkkkkkklkkkkkkjjjjjjjjjjjl",
      "..........feedfeeeeeaaajkkjiiihhhjkkkkklllkkkkjjjjjjjjjjkk",
      "..........eeedfedddaaaajkkjiiiihhhjjkkklllkkkkkjjjjjjjjjjl",
      "..........eeeefedddaaaajkkkjiiihiijjkkkllllkkkkjjjjjjjjjjl",
      "..........fbeeeedddaaaajkkkjjiiigjjjikkllllkkkkjjjjjjjjjjl",
      "..........f.eeeeddaaaaaakkkjiiiigbjjkkkkllllkkkkkjjjjjjjkkl",
      "..........e.eefedaaaaaaajkjjiiiihbbbjkkkkkaaaaaaaaaaaajjjjk",
      "..........f.eeffaaaaaaaajkjjjiiihbbbbkgaaaaaaaaaaaaaaaaaajk",
      "..........f.eeffaaaaaaaajkiiiikhhhbbbcaaaaaaaaaaaaaaaaaaa",
      "..........f.eeefaaaaaaaajkjjajjjhhggikjaaaaaaaaaaaaaaaaaa",
      "..........f.feefeaaaaaabjkjjccajhhhgiikabbaaaaaaaaaaaaaab",
      "..........f..eeeeaaaabbbjkjjcccbhhhgiikbccccbbbaaaabbbabb",
      ".............eeeeaaaacbbjjabcccbiiiiiikbcccccbbbbbbcccjjb",
      ".............eeefdaaacbbjjbbbccbiiiiiikbccccccccccccccjjb",
      "..............eeedaaacejjbbbbkcbjjjijjjjbccccccccccccccbb",
      "..............eeeebbaaajjbbbaikjjjijjjjjbccccccccccccccaa",
      "..............eabbbbaaaaabbbajjjjiijjjjkabbccccccccbbcbaa",
      "..............bbbbbbbaaaabbbbajjjiijjjjkabbccccccccbbbbaa",
      "..............bbbbbbbbbbaabbbajjjjiijhhkbbcccccccccbbbbaa",
      ".............bbbbbbbbbbbbabbbbbkjjjjiijjjbccccccccbbbbaaa",
      ".............bbbbbbbbbbbbbbbbbbkjjjjjjjjkbcccccbbccbbbaaa",
      "..........bbaaabbbbbbbbbbbbbbbbjjjjjjjjjkbccccbbbbaabbaag",
      "......bbbbbbaaaabaabbbbbbbbbbbbbjjjjjjjjkibccbbcccbbbbaag",
      "......bbbbbbbbbbbbaaabbbbbbbbbbbbjjjjjjjjkbccbccccbbbbaaa",
      "......bbbbbbbbbbbbbbaabbbbbbbbbbbbjjjjjjjkjbbbcccbbbbbaag",
      ".....bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbjjjjjjjkbbbcccbbbbaaag",
      "....bbbbbbaaaaaaaabbbbbbbbbbbbbbbbaajjjjjjjkbccccccbbaaag",
      "..bbbbaaaaaaaaaabaabbbbbbbbbbbbbbbbaajjjjjjjkccccccbbaaag",
      "..bbaaaabbbbabbbbbbbbbbbbbbbbbbbbbbbaajjjjjggkccccbbbaaaai",
      ".bbaaabbbbbaaabaaaabbbbbbbbbbbbbbbbbbaaajjigggjjbbbbbaaajj",
      "bbaaabbbbaaaiijjjkkkjjaaabbbbbbbbbbbbbaaaaabbaajjbbbaaaabii",
      "bbbbbbbaajjjiihhhhjjjjkjaaabbbbbbaabbbbaaaaaaaaaabbaaaaabaa",
      "bbbbbbbajjjjiiiijjjjjjjjkkbaabbbbbaabbbbaaaaaaaaaabaaaaaaabb",
      "hhbaaagjjjjjjjjjjjjjjjjjjjkkbbbbbbbaabbbbaaaaaaaaaaaaaaaaabbb",
      "hhaaijijjjjjkkkkjjjjkkjjjjjjkbaabbbbaabbbbaaaaaaaaaaaaaaaaaaa",
      "aajjijiijjkkkkkkkkkkkkjjjjjjjbbaaabbaaabbbbaaaaaaaaaaaaaaaaaaj",
      "ajkjiiiijkkkkkkkkkkkkjjjjjjjjjjbbaabbaaabbbbaaaaaaaaaaaaaaaaajk",
      "jkjjjgbbiikkkkkkkkkkkjjjjjjjjjjjjaaabbaaabbbbaaaaaaaaaaaaaaaaakk",
      "kjjjjgbjkikkkkkkkkkkjjjjjjjjjjjijjaaabbaaabbbbaaaaaaaaaaaaaaaaik",
      "kjjjjjjjjjkkkkkkkkkjjjjjjjjjjiiijjjaaabbaaabbbbaaaaaaaaaaaaaaaab",
      "jjjiijkkjjkkllkkkkkjjjjjjjjjiiigggjjaaabaaaabbbbaaaaaaaaaaaaaaaa",
      "jjjjjjkkkkkllllkkkkjjjjjjjiiiihgggghbbaaaaaaabbbbaaaaaaaaabbaaaa",
      "ijjjjjkkkkllllkkkkjjjjjjjiihghhgggggbbaaaaaaaabbbbaaaaaaaabbaaaa",
      "ijjjjkkkklllllkkkkjjjjjjjhhhgggggggggaaaaaaaaaabbbbaaaaaabbbaaaa"
    ],
    legend: {
      a: { m: "cloth", step: 0 },
      b: { m: "cloth", step: 1 },
      c: { m: "cloth", step: 2 },
      d: { m: "plume", step: 0 },
      e: { m: "plume", step: 1 },
      f: { m: "plume", step: 2 },
      g: { m: "steel", step: 0 },
      h: { m: "steel", step: 1 },
      i: { m: "steel", step: 2 },
      j: { m: "steel", step: 3 },
      k: { m: "steel", step: 4 },
      l: { m: "steel", step: 5 }
    }
  }
};
