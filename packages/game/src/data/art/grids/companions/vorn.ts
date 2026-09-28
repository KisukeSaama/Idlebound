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
      "...................ss",
      "...................ssss",
      "....................sssss",
      "..........ss.........rrrrrrttttttt",
      "...........ssss.......rrrrrrtttttttttts",
      "............ssssss...ttttrrrttttttttttttt",
      ".............sssssssstttuuttttttttttttttuuutttt",
      "..............rrrrrrrstttttttttttttssstttttuuuuuuttt",
      "...............rrrrrrstttttttttttttsrrrrtttttttttuuuuuut",
      ".................srrrstttttttttttssssEMEtttttttttttttttuuut",
      ".................sssrssttttssstttssssssssssssssssttttttttttEs",
      "................ssssssttttttssssssssrrsssssssssssssssssssssEEE",
      "................ssssssstttsttttssssrrrssssssssssssssssssssssEEE",
      "...............rrssssssssssssssssssrrrssssssssssssssssssssssss",
      "...............rrrrrrsssssssssssrrrrrrssssssssssssssssssssssss",
      "..............ssrrrrrrrrssssssrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      ".............ttrrrrrrrssrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      ".............strrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrxxxxxxr",
      "............sstrrrrrrrrrrrrrrrbbbbbbbbrrrrxxxxxxxxxxxxrrurrr",
      "............ssssrrrrrrrrrrrrrrbbbbbbbbbbbrrurrurrrrurrrrtr",
      "............ssssrrrrrrccccccccrrrrrrrrrrbbatrrurrrru",
      "...y.......yssssrrrrrcccxxxxxcbbbbbbxxxxbaaarrtrrrrt",
      "...yy......yssssrrrsscccccccccbbbbbbbbbbbaaarrrrrrr",
      "...yyy.....ysstsrrrssccccEEEEEbbbbbbEEEEbaaarrrrrrr",
      "...yyyy.yyyysstsrrsssccccbEEEbbbbbbbbEEbbaaarrrrrrr",
      "...yyyyyyyyysstssrsssccccccqKcbbbbabbqKbaaaaarrrrrrr",
      "...yyyyyyyyysstsssssscccccccccccccacccbbbbbaarrrrrrr",
      "...yyyyyyyyysstsssssscccccccccccccaccbbbbbbaarrrrrrr",
      "...yyyyyyyyyssssssssscccccccccccccaccbbbbbaaarrrrrrr",
      "...yyyyyyMyysssssssqccccccccccccccacbbbbbbaaarrrrrrr",
      "..yyyyyyyyyxsMssrssqqcccccccccccccbabbbbbbaaorrrrrrr",
      "..yyyMyyyxxxssssrsspqqccccccpppbabaapppbbaaoorrrrrrr",
      "..yyyyyyxxxxssssrsssqqqcccppppppppppppppppooorrrrrrr",
      ".yyxyyxxxxxMssssssssqqqqcccppppppppppppppoooorrrrrrr",
      ".xxxxxxMxxxxrsrsssssqqqqqcccccccbbbbbbbbooooorrrrrrr",
      ".xxxxxxxxxxxrsrsssrsqqqqqqccccooEEEobbboooooorrrrrrr",
      ".xxxxxxxxxxxrrrssrrrpqqppqppccbbbbbbbboooooorrrrrrrr",
      ".xxxxxxxxxxxrrrssrrrppqppqpppppbbbbpoooooooorrrrrrrr",
      ".xxxxxxxxxxxrrrssrrrsppoppppppoppopooooooooorrrrrrrr",
      ".xxxxxxxxxtxrrrssrrrsppooppppooppopooooooooorrrrrrrr....tt",
      ".xxxxxxxxxttsrttsrrrssppoppopooppopooooooooosrrrrrrr...ttss.ttt",
      "tttsxxxxxttssstssrsstsppoppooopoooooooooooossrrttrrr...ttsssttss",
      "ttssxxxxssssrsssrrsttsppoppooppoooooooooooosrrttsssst.ssssrstssr",
      "sssrsttsssrrrssrrrsttssoopoooooooooooooooorsrstssrsttsrrrrrsssrr",
      "rrrrsttsrsssttsssttttsssooooooooooooooooossssssrrrstssrrrrr..rr",
      "xrrxsssrrsstttttttttssssrooooooooopooooorssssssrrrsssrrrrrrr",
      "xxxssrrrrsstttttttsssrrtsstooooooppoooorrsssssssrssrrrrrrrrrr",
      "xxssttsssttttttsttssrrrtttttoooooooooossssssssssrsrrrrrrrrrrrr",
      "xstttttssttttsssttttsstsppppppqqppppppppssssssssssssrrrrrrrrrrr",
      "tsttttsssttttssstttttttsppppppqppoppppppsssssssssssssrrrrrrrrrrr",
      "tttttssssttttssstttttttssttsssppoosttssssssssssssssssrrrrrrrrrrr",
      "ttsttsssttsttssttttssttsttttstsssssssssssssssssssssssrrrrrrrrrrr",
      "ttstssssttsttssttttssttsttttstsssssssssstssssssssssssrrrsrrrrrrr",
      "ssstsstttstttttttttstttsttttstsssssssssstssssssssssssrrrsrrrrrrr",
      "ssssssttssttttttttttttstttsssstttsssssssssssssssssrssrrrsrrrrrrr",
      "stttsttttsttstttttttttstttssssttsstsstssssssssssssrssrrssssrrrrr",
      "stttttttttssstttttttttttttssssttsstsstssssssssssssrssrrssssrrrrr",
      "stttttttttsssttttttttsttttsssstsssssssssssssssssssssrrrsrrrrrrrr",
      "sttsttttttsssttttttttsttttsssstsssssssssssssrsrssrssrrrrrrrrrrrr",
      "sststttsttsttssttttttstttssssstssrssssssssssrsrsrrssrrrrrrrrrrrr",
      "ssssttssttsttssttttttstttssssssssrssssssssssrrrsrrrrrrrrrrrrrrrr",
      "sstsstssttttsssstttttstttssssssssrsssssssssrrrrrrrrrrrrrrrrrrrrr",
      "sstsststtttssssssttttssttssssssssrssssssssrrrrrrrrrrrrrrrrrrrrrr",
      "ssssststtttssssssttttssttsssssssrrsrssssssrrrrrrrrrrsrrrrrrrrrrr"
    ],
    legend: {
      a: { m: "skin", step: 0 },
      b: { m: "skin", step: 1 },
      c: { m: "skin", step: 2 },
      E: { pal: C.ink },
      K: { pal: C.night1 },
      M: { pal: C.moon, glow: true },
      o: { m: "beard", step: 0 },
      p: { m: "beard", step: 1 },
      q: { m: "beard", step: 2 },
      r: { m: "pelt", step: 0 },
      s: { m: "pelt", step: 1 },
      t: { m: "pelt", step: 2 },
      u: { m: "pelt", step: 3 },
      x: { m: "void", step: 0 },
      y: { m: "void", step: 1 }
    }
  }
};
