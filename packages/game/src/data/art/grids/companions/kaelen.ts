import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Kaelen, Fallen Knight (BIBLE 10.3): a gaunt, grave face with hollow cheeks, one clean
 * scar and a shadow of stubble, dark hair cut short, eyes lowered under heavy lids; he will
 * not look at the throne. The moonlit plate of the King's guard, dented, and a torn tabard
 * in his red with its crest split.
 */
export const KAELEN: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.paper], texture: "smooth" },
    hair: { ramp: [C.ink, C.night1, C.night3, C.dusk], texture: "fur" },
    steel: { ramp: [C.night1, C.night3, C.dusk, C.haze, C.lilac], texture: "metal" },
    cloth: { ramp: [C.night1, C.blood, C.red], texture: "cloth" }
  },
  grid: {
    rows: [
      "...........................eeeeeeeh",
      "........................hbccccdddeeehh",
      ".......................bbbbbbbbbbbbcddeeh",
      ".....................bbbbbbbbbbbbbbcccccdh",
      "....................bbbbbbbbbbbbbbbccccceehh",
      "...................bbbbbbbbbbbbbbbccccccceehh",
      "..................bbbbbbcbbbbbbbbbcccccccbeehh",
      ".................bbbbbbcccbccbbbbbbccccceeeeehh",
      ".................bbbbbbccccccccccbcccccccedccehi",
      "................bbbbbbbbbccccccccbbbbcbbbbdcchhii",
      "................bbbbbbbbbccccffbbbcbbbbbbbccchehi",
      "................bbbbbbbbbbccccbbbfcffffbbbbcccceh",
      "...............bbbbbbbbbbbbbccbbffcfhhhhhbbbccddh",
      "...............bbbbbbbbbbbbbbbbfffchiiihhhfcfhhddi",
      "...............bbbbbbbbbbbbbbbbfffchiiiihhhhhhhdhh",
      "...............bbbbbbbbbbbbbbbbffffhiiiihhhhhhieeh",
      "...............bbbbbbbbbbbbbbbbfffhhhiihhhhhhhiihe",
      "...............bbbbbbbbbbbbbbbbfffhhhhhihhhhhhhi.h",
      "...............bbbbbbbbbbbbbbbbfffhhhhiihhhhhhhi",
      "...............fbbbbbbbbbbbbbfffffhhhhhiihhhhhhi",
      "...............fbbbbbbbbbbbbffffffhhhhhhihhhhhhi",
      "................bbffhbbbbbbfffffffffhiihhhhhhhhii",
      "................bbfffhfbbbbfffffffffccbhhhhhhhhhh",
      "................bfffffffbbbffffffffffcbbbcffhhhde",
      "................bffffffffbbffghhffffffccddfffccd",
      ".................ffffffffbbffhhhhffffcccffhhdcc",
      ".................bfffffffbbfghhhihfffffhffhhhdh",
      ".................bfffffffbfffhhhhhhhhffhhhhhhei",
      "..................bfffffffffffhhhhhhhhhihhhhihi",
      "..................bbffhffffffffhhhhhhhiihhhhhii",
      "..................bbffhhffffffffffhhhiiihhhhhih",
      "..................bbbfhhffffffffffhhhhihhhhhhi",
      "..................hbcddccfffffffffghhhhhhhhhhi",
      "...................fcfffcdfffffffffhhhhhhhhhii",
      "...................fcfffcdffffffffhhhhhhhccfhh",
      "....................cfffccffffffffhhhhhhhfceh",
      "....................ffffccffffffffhhhhhhfffeh",
      "...............hhhhhfffffccfffffffhhfhhhhhdee",
      "..............feeeeefffffcccffffffhhffhhhddeh",
      ".............ffddbbffffffccccfffffhhhhhhhhhi",
      ".............fbbbbbfffffffccccfffffhhggfcceh",
      ".............bbbbbbfffffffccbbfffffffffffeh",
      ".............bbbbbcfffffffddcbbbfcfffhihhhih....hhhh",
      "............bbbbbccfffffffddcbbbbcfffhhhffhehebcccchi",
      ".....ff..ffbbbbbbbcffffffffdffbbbbbfffffffebehbbbbciii",
      "....ccccccbbbbbbbccfffffffffffcccbbbccfccccbbeebbbhhhi",
      "...fcccccccbbbbbbcccfffffhfffffcccccdeebbbbbbbccbbheehh",
      "..ffccccccccbbbbbcccccfffhhfffffcccddccbbbbbbbbbbhffehhehi",
      ".ffffbccccccccbbbbcccccfffhffffffcccbbbbbbbbbbbbeefffhhheii",
      "fffffbbbbccfcffbbbbcccbbfffffffffccbbbbbbbbbbbbeeefffehheiiii",
      "ffffffffbffffffffbbccccbbccffffffcbbbbbbbbbbbbbeeffafhheehhiiii",
      "ffffffffffffffffffbbcccbbbbccfffdcfbbbbbbbbbbbfeffaahhhfheehhiii",
      "fffffffaaafffffffffbbbccbbbbcfffdcfbbbbbbbbbbfffffafhhffeeeeehhi",
      "fffaaaaaaaaaffffffhfbbbccbbbcffffcfbbbbbbbbbbffffaahhhffffffffhh",
      "ffffaaaaaaaaafffffhhhbbccccbbffffccbbbbbbbbbffffaaeeeeffffffffff",
      "ffffaaaaaaaaaaffhhhhhhccccccbfcccccbbbbbbbbffffaaaaeeffhhhffffff",
      "affffaaaaaaaaaaafhhhhhhffccccccccfccbccbbbbhfffaaaaaafhihhhfffff",
      "affffaaacfffaaaaafhhhhhhffffccfbbffccccbbbhfffaaaaaaafiiiihhhfff",
      "ffffccfafffffaaaaafhhhhhhfffhhfffffccccbbhfffaaaaaaafiiiiiihhhff",
      "fafbcffffffffaaaaaafhhhhhhfffffffffccccbfheffaaaaaaafhhhhiihhhhf",
      "aabbcffffffffaaaaaaafhhicehffffffffcccccheefaaaaaaaffhhhhiiiihhh",
      "aacccffffffffaaaaaaaafhhdheheccffccccbbhfffaaaaaaaafhhhhhhiiiihh",
      "aaaccffffffffaaaaaaaaafhhehhhhffffcccbbhfffaaaaaaaafhhfhhhhhehhh",
      "ffaffffffffaaaaaffaaaaafhiihhiffffcccchfffaaaaaaaaafhhehhhhhdehh"
    ],
    legend: {
      a: { m: "cloth", step: 1 },
      b: { m: "hair", step: 0 },
      c: { m: "hair", step: 1 },
      d: { m: "hair", step: 2 },
      e: { m: "hair", step: 3 },
      f: { m: "skin", step: 0 },
      g: { m: "skin", step: 1 },
      h: { m: "steel", step: 3 },
      i: { m: "steel", step: 4 }
    }
  }
};
