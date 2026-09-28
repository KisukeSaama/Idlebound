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
      "",
      "",
      ".........................m......................M",
      "........................mm.....lm..............M",
      "........................mm.....ll..............M",
      "...................m....mm....lll.............M",
      "..................mm...mmmm...llll....kk......MM",
      "..................mmm..mmmlwwlllll...kkk......MN",
      "..................mmm..mmmllwlllllkkkkkk......MM",
      "..................mmmmlllllllllllkkkkkkkk.....MM",
      ".................mlllllllllllllkkkkkkkkkk.....M",
      ".................llllllllllllkkkkkkkkkkkk....NM",
      ".................llllllllElkkkkkkEkkkkkkkk..M.M",
      ".................lllllllkkkkkkkkkkkkkkkkkkk.MM",
      "..................kkkkkkkkkkkkkkkkkkkkEkkkk.MM",
      "..................kkkkkkkkkkkkkkkkkkkkkkkkk.NM",
      ".................wwwkkkkkkkkkkkkkkkkkkkkkkk.MM",
      ".................wwwwwwwwwvkkkkkkkkkkkkkkkt.MM",
      ".................wwwwwwwvvvsvvuuuutkkkkkkttNM",
      ".................wwwwwvvwvsvvvvvvvuuuuuuuutMM",
      ".................vvvvwwwwwswwwwwwwvvvvvuuuMtM",
      ".................vvvvwwwwwswwwwwwvvvvvuuEtMMt",
      ".................vvvtttwwwwwEEEEEvvvvuEEEEEtt",
      ".................uuuttttwwwEEEEEEEvvvuEEEEEttt.....o",
      "..................uuttttwwwEEENMEEvuuuEENMEttt.....v",
      "............v.....utttttuwwEEMNNEEvuuuEENMEttt....ovo",
      "...........ppv.....tttttuwvEEEEEEEuuuuEEEEEsstt...voo",
      "...........ppv.....tttttuvvvEEEEEuuuuttEEEsssst..ovoo",
      "...........pppv.....ttttvvvvvvuuuuuuEEEtttsssst..vooo",
      "...........pppv......tttvvvvuuuuuuttEEEtttsssss.ovooo",
      "...........ppppv.....vvwvuuuuuuuuttttEttttsssss.voooo",
      "..........qpppppv....uuwwwuuuutttttttEttttssss.ovoooo",
      "..........pqppppv.....uuwwuuutttttttttttttssss.voooooo",
      "..........pqpppppv.....utttttttttttttttttttss.ovoooooo",
      "..........pppppppv.....wttttttttttttttttttttt.vooooooo",
      "..........pppppqppv....wwttttttttttttttttttttvoooooooo",
      ".........qpppppqqppv...wwwtttEwEwEwEwEvEvEvttvoooooooo",
      ".........qpppppqqppv....wwwttEvEvEvEvEvEvE.ttooooooooo",
      ".........pqppppqqpppv...vvvv..v.v.v.v.v.v.tttooooooooo",
      ".........pqpppppqpppp...vwwwwwvvvvtttttttttttooooooooo",
      ".........pqppppppppppv..vvvvvvvuuutttttttttttoooooooooo",
      "........ppppppppppppppv..uuuuuttttttttttttttpoooooooooo",
      "........ppppppppppppppp...tttttttttttttttttopoooooooooo",
      "........pppppppppppppppv...ttttttttttttttvooooooooooooo",
      ".......pppppppppppppppppvpppttttttttttttvooooooooooooooo",
      "......pppppppppppppppppppppppppppppppppoooooooooooooooooo",
      ".....ppppppppppppppppppppppppppppopppppoooooooooooooooooooo",
      "...ppppppppppppppppppppppppppppppooppppooooooooooooooooooooo",
      "..pppppppppppppppppppppppppppppppooppppooooooooooooooooooooooo",
      ".ppppppppppppppppppppppppppppppppooppppoooooooooooooooooooooooo",
      "pppppppppppppppppppppppppppppppppooopooooooooooooooooooooooooooo",
      "pppppppppppppppppppppppppppppppppooooooooooooooooooooooooooooooo",
      "pppppppppppppppppppppppppppppppppooooooooooooooooooooooooooooooo",
      "ppppppppppppppppppppppppppppppoopooooooooooooooooooooooooooooooo",
      "ppppppppppppppppppppppppppppppoopooooooooooooooooooooooooooooooo",
      "pppppppppppppppppppppppppppoppoopooooooooooooooooooooooooooooooo",
      "pppppppppppppppppppppppppppoppoooooooooooooooooooooooooooooooooo",
      "ppppppppppppppppppppoppppppoopoooooooooooooooooooooooooooooooooo",
      "oppoppppppppppppopppopppppooopoooooooooooooooooooooooooooooooooo",
      "oopoopppppopppppopppopooppoooooooooooooooooooooooooooooooooooooo",
      "oopoopppppopppppoopppoooopoooooooooooooooooooooooooooooooooooooo",
      "ooooooppppooppoooopppoooopoooooooooooooooooooooooooooooooooooooo",
      "oooooopoppooppoooopppoooopoooooooooooooooooooooooooooooooooooooo",
      "oooooopoooooopooooppppoooooooooooooooooooooooooooooooooooooooooo"
    ],
    legend: {
      E: { pal: C.ink },
      k: { m: "gold", step: 0 },
      l: { m: "gold", step: 1 },
      M: { pal: C.mint, glow: true },
      m: { m: "gold", step: 2 },
      N: { pal: C.wisp, glow: true },
      o: { m: "robe", step: 0 },
      p: { m: "robe", step: 1 },
      q: { m: "robe", step: 2 },
      s: { m: "bone", step: 0 },
      t: { m: "bone", step: 1 },
      u: { m: "bone", step: 2 },
      v: { m: "bone", step: 3 },
      w: { m: "bone", step: 4 }
    }
  }
};
