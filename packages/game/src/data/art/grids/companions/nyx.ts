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
      "",
      "",
      "............................nn",
      "..........................onoomm",
      ".........................nnoonmmn",
      ".......................onoononmlnmm",
      "......................noonlnnnmlnmll",
      ".....................oooonlonnlmmnmlm",
      "....................ooooonlonnlmmnmlml",
      "...................ooonoolnnnnlmmmmllmm",
      "..................ononnoolnnnlmmlmmllmmk",
      ".................ooonnooolnnnlmmllmllmmk",
      "................oooonnnnlonmlmmmmlmlllllk",
      "...............ooooonnonlonmlmmmmllllkllkk",
      "...............oooonnnonlnnmlmmmlllkkkkkkkk",
      "...............ooooonnonlnnlmmmlllnnnkkkkkk",
      "...uuts.......oooononnnnlnnlmmlllnABBBBBkkkk",
      "...utts.......nooononnnlmmnmmlllnAABBBBBBkkk",
      "...ttss.......noonnomnmlmmnmlllnAAABBTBBAAkk",
      "..............noonnnmnnlmmnmllnAAAAABBBAAAAkk",
      ".....uu.......noonnlnmlnmmmlllAABBAABBAAAAAAk",
      ".....uut....tmnooonlnmlnmmmllnAUCCBBAAAAAAAAk",
      ".....uut..tttmnononlnmlnnmmllnCBCCCBAAAAUAAAkk",
      "......tttttt.nnonnnlnnlnnmlllCCBBCUBAAAASAAAAk",
      ".....ttttt...nmonnlnnnlmnmlknCCAAASAAAAAABAAAk",
      "...tttttt...mnmomnlnnlnmmmkknCCAAAAAABBAABBAAkk",
      "..ttt..tt...mnommnlnmlnnmmkknCCAAAAAAABBBBBAAkk",
      "..t....tts..mmommmlmmlmnmmkkmCCAAAAAAAUBBBAAAkk",
      ".......tss..mlommmlmlmmmmmkkmCCABBAAAAAABBAAAkk",
      "........ss..mlmmmmlmlmlmlmlkmCCCBBBAAAAAAATAAkk",
      "........ss..mmmmmmlllmlmlmlkmCCCBBBAAAAAAAAAAkk",
      "........sss.mmmmmlmllmlllllkkmCCBTABBAAAAAAAkkkk",
      "........sss.mmmmmlmllllllllkkmCCBBBBCCAAArrrrkkk",
      ".........ss..mlmmlllllllkklkkmCCBBrrrrrrqpppppkk",
      ".........sss.mllllllllllkklkkkmrrrqqqqqqqpppppkk",
      ".........sss.lllllkllllllklkqqrrqqqqqqppppppppkk",
      "..........ss.lllklkkllllkkkqrrqqqqqqqqqppppppppk",
      "..........ssslklklkkkkklkkkqqqqqqqqqpppppppppppk",
      "..........ssskklklklkkklkkkkqqqqqqqqpppppppppppk",
      "...........sskkkllklkkkkkkkkqqqqqqppppppppppppkk",
      ".............lkkklklkkkkkkkkppqqppppppppppppplk",
      ".............lkkklkkkkkkkkkkppppppppppppppppkll",
      "..............kkkkkkklkkkkkkkppppppppppppppppll",
      "..............kkkkkkklkkkkkkkppppppppppppppppkk",
      "..............kkklkkkkokkkkkkkkkkkkkkkkkpppppkk",
      "..............kkklkkkklkkkkkkkkkkkkkkkkkkpppppllll",
      "...........nmmnooonnnnnmmmnmmmmmmmmmmmmmlppppplllllll",
      ".........nnnooonnnnnmnnmmmnmmmmmmmmmmmmmlppppplllllllll",
      ".......nnnoommnnnnnnmnnmmmnmmmmmmmmmmmmmmpppppllllllllllk",
      "......nnoonnmmnnnnnnmnnmmmnmmmmmmmmmmmmmmppppplllllllllllk",
      "....nnnonnmnmmnnnnnnmnnmmmmmmmmmmmmmmmmmmmpppplllllllllllkkk",
      "..nnnnonnnmnnmmnnnnnmnnmmmmmmmmmmmmmmmmmmmppppplllllllllllkkkk",
      ".nnnoonnnnmnnmmnnnmmmmnmmmmmmmmmmmmmmmmmmmppppplllllllllllkkkkk",
      "mnnonnnnnnmnnmmnnmmmmmmmmmmmmmmmmmmmmmmmmmppppplllllllllllkkkkkk",
      "moonnnnmnnmnnmmmmmmmmmmmnnmmmmmmmmmmmmmmmmmpppplllllllllllkkkkkk",
      "onnnnnnmmnmnnmmmmmmmmmmmnnmmmmmmmmmmmmmmmllppplllllllllllkkkkkkk",
      "mnnnnnnmmnmnnmmmmmmmmmmmmnmmmmmmmmlmmmmmmllppllllllllllllkkkkkkk",
      "mnnnnnnmmnmmnmmmmmmmmmmmmmmmmmmmmmlmmmmmmllllllllllllklllkkkkkkk",
      "mnnnnnnmmmmmnmmmmmmmmmmmmmmmmmmmmmllmmmmmllllllllllllkkllkkkkkkk",
      "mmnnnnnmmmmmmmmmmmmmmmmmmmmmmmmmmlllmmmmlllllllllllllkkllkkkkkkk",
      "mmnmnnnmmmmmmmmmmmmmmmmmmmmmmmmmmlllmmmmlllllllllllllkkllkkkkkkk",
      "mmnmmnmmmmmmmmmmmmmmmmmmmmmmmmmmmlllmmmmlllllllllllllkkkkkkkkkkk",
      "mmmmmnmmmmmmmmmmmmmmmmmmmmmmmmmlmmlllmmmlllllllllllllkkkkkkkkkkk",
      "mmmmmnmmmmmmmmmmmmmmmmmmmmmmmlmlmmlllllllllllllllllllkkkkkkkkkkk"
    ],
    legend: {
      A: { m: "sky", step: 0 },
      B: { m: "sky", step: 1 },
      C: { m: "sky", step: 2 },
      k: { m: "cloth", step: 0 },
      l: { m: "cloth", step: 1 },
      m: { m: "cloth", step: 2 },
      n: { m: "cloth", step: 3 },
      o: { m: "cloth", step: 4 },
      p: { m: "scarf", step: 0 },
      q: { m: "scarf", step: 1 },
      r: { m: "scarf", step: 2 },
      S: { pal: C.moon, glow: true },
      s: { m: "steel", step: 0 },
      T: { pal: C.essenceLight, glow: true },
      t: { m: "steel", step: 1 },
      U: { pal: C.essenceBright, glow: true },
      u: { m: "steel", step: 2 }
    }
  }
};
