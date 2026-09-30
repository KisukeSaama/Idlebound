import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Mire Colossus (BIBLE 8.4): the whole east field, standing up. A hunched mountain of
 * peat and mud on arms like felled trunks, knuckles in the mire; reeds and roots bristle
 * from its shoulders, the fence posts of the field push out of its chest like ribs, still
 * strung with wire, and a rusted plough blade is driven into its side. Its head is a lump
 * sunk between the shoulders, a mouth of stones, and deep in the peat two points of sick
 * light.
 */
export const BOG_COLOSSUS: CreatureGrid = {
  rows: [
    "..............................................................A",
    "............................................A.................p",
    "............................................p............A....p",
    "............................................p...........pp....p",
    "............................................p...........p.....p.....b",
    "...................................A.......pp.b.........p.....p....pb",
    "....................................p......p..bp........p.....p....p",
    "....................................p......p..bp.......p...pp.p....p",
    "....................................p....bbp....p......p...pp.n....p.......A",
    "............................b........p...b.p....p......n....p.n...p........p",
    "............................b........p.....p.....p.....n....p.n...p........p",
    "............................b.........p....np....o.....n....o.n...n........p",
    ".............................p........p....n.p...o....n.....on.n..n.......p",
    ".............................p........o....n.oo.0ooooonpoooonnnn.n........p.......A",
    ".............................p........o..oonoooooonoonnp0onnnnnnnn.......o.......pA",
    ".............................pp.......o.ooonnooooon0nnop00nnnnnnnnnn.....o......p",
    "..............................p.......ooooonnnnnonp0oooo00nnnnnnnnnnnn..o.......p",
    "..............................n......pooooo0nnnoopp0oooo0nnnnnnnnnnnnnoo.......p",
    "..............................pnpoo.mpoooop0nnnooo00000000nnnnnnnnnnnnnonn....p",
    "............................pppnoooooooooop00nnoo00nn00o00nnnnnnnnnnnnonnnnn.nn",
    "..........................pppponooo00nnpooo00nnn00nnn00000nnnnnnnnnnnnnnnnnnnmn",
    ".........................opppoonnnn0nnnmmoo00nnn00nnn0000nnnnnnnnnnnnnnnnnnmmnm",
    "........................ooopp0onnn00nn0mmo000nnnnnnnnnn00nnnppnnnnnnnnnnnnpmmmm",
    "........................ooooo00nnn000nnmmmn00nnnnnnnnnnnnnnnppnnnnnnnnnnnnpmmmm",
    ".......................oooonnnnnn0000nnmmmnnnnnnnnnn0nnnnnnnppnnnnnnnnnn00pmmmmm",
    ".......................ooonnmmnbn00mnnnnmmnnnn00nnnnnnnnnnnnp0nnnnnnnnnn0oonmmmm....bb",
    "......................ooonnnbbbbboomnnnn0mnnnn00nn00nnnnnnnnp0nnnnnnnnnm0oonmmmmm...bb",
    "......................onnccbbbbbbnooo0nnmmmmmm00nn00nnmmnnnnp0nnpppn00nmmmmmmmmmm..cc",
    "......................onnccbbbbb00coo0nnmmmmmmm0nnnnnnmmnnnnp0nnpppnnnnmmmmmmmmmm0cc",
    ".....................onn00cbbboo0cco00nnmmmmmmn0mm0mn0mmnnnmmmnnpppmnnnmmmmmmmmm00b",
    ".....................pob00boooooocco0nnnm00000n0mmm000nnnnnmmmnnpp0mmmmmmmmmmmmm00m",
    "....................ppob0nnoooooooc00nnn00000000mm0000nnnnnmmmnnpommmmmmommmmmm00mm",
    "....................pppbbnnoooooo0000nnnm0nnn0ncc000000mnnnnmnnnoommmmmoommmnmb00mmm",
    "...................pppp0b00000oo0EE000nnnnnnnnccc000000mnnmmmnnnnnnmmmoonm2222b0mmmmm",
    "...................popp0o0EE00op000000nnnnnnpcccc000000mnnmmmnnnnnnmmm2222222b20mmmm00",
    "..................pooopnn00000ooooo00onnmnnnpccccn00000mnnmmmnnnnnnmm222222bbb22mmm000",
    "..................poonnnn0oooooooo00nnnn0nnccccppnmmm00mnnnnnn00mmmm1222222bb111220000",
    ".................ppoonn000oooooooo0nn0000ncccbbppmmmm00mmm00000mm112212222222211112000",
    ".................ppooo0000oooooooooo00000ccbbbmmmmmmm00mmm0000012221111111112222211200",
    "................pppoooo000oooooooooo00000ccmmmmmmmmmmmmmm0000022122111111111201221100",
    "................ppoopoo000000001001100000ccmmmo00mmmmmmmm0mm00n1111111101111111222100",
    "................poonppp001011010011110mm0bnnmnn000ncccmmmmmmm000011221002201c12222100",
    "...............oooooppp000000010000000mb00mnnnnn00ccccnmmmmmn0000nm22222bc00cb2221100",
    "...............00oobbbpp00110110101100bb0mm0nnnnnccc0000nnmnn000nom222222bbbc02211nnmm",
    "..............00000bbopp000mmmm0000000bm00m0000cccbb0000nnmm000nnomm22210bccc022100omm",
    "..............00000oooop00mmmmmm00000nnm0n0000ccc0bm0000nnmmmmnnmmmmmn110pbc0022oo0cmm",
    ".............mpp000oo00000mmmmoccc000nnm0n0000ccc0bp000mmmmmmmmmmmmmmmmm2pcb00poooopmm",
    ".............mpp0000000000mmnnoccbmmmmmmmmm0ccbb0000000mmmmmmnommm0mmmmm22bb02poooopmmm",
    ".............0pp00000000000nnnob2mmmmmmmmmm0bbbb0000000mmmm0nnomm00mmm0022b02211nnoommm",
    "............00ppn0000000000nmmnnmmmmmmmm0cc0bbbm0000000mmmmmmno000mmmm002220211000mo0mm",
    "............0opnnn000mm000nnmmnnm2mmmmmm0cc0mbmmm0n0mmcc00mmmmm00mmm01111210110000000mm",
    "............mmonnnn00moo0mmmnnnnm2mmmmmcccc0mmmmm0n00ccbb0mmmmm000mm1002210000000000mmmm",
    "............0nnnnnn0omoommmm0nnnmm2mmmcccbmmmmmmmmn00bbb00mmmm0nn0oo100110000000m000mmmm",
    "............0nnnnnn0omoo0mmmmmmmmm2mmcccbmmmmmmmmmcbbbbm000mmmnnn0o111111000000co000mmmm",
    "...........pppn0n000omoo0mm0mmmmmm2mcccmmmmnpmmmmccbbbmm0000mmnn002211110000000cp00mmm0m",
    "...........pppnn0000om0.0mmmmmmmmm2ccccmmmnnppnn00bb0000000mmmmo0m21122100000000000mmm00",
    "...........pppnnnnn0om0..mmmmmmmmmc2cccmmmnnppnc00bmm0mm0m0mmmmo0mm112200000000000mmm000",
    "...........poonnnnm0on...0nmmmmmmmc2mm000mmm0ccc00mmmmm00000mmmmmmmm2220000000000mmmmmm0",
    "..........ppooonnnmmo0...0nmmmmmmmbb2m0000nm0cc00mmmmmmnnm00000mmmmmm200000000000mmmmmm0",
    "..........ppbpponnmm0.....n000mmmm0020000on00000mmmmmmmmmmm0000000mmm00000000000mmmmmmm0",
    "..........ooppopmm000.....o000mmmm00no200on00nnmmmmmmm00mm00m0000000000000000000nnnnmmm0",
    "..........oommmmmm000.......0000000nno2nnnn00nnmmmmmmm00mm000000000000000000000nnnn0mmo0",
    ".........0oommmmnn000.........00000npon2nn000000ommm00000000000000000000000000mnnno0nmo0",
    ".........0oonmmnn000...........0000npon2nn000000ommm00000000000000000000000000nnnno0nmo0",
    ".........0oonnnnnmm0............00nnnpmm2nn00000mm000000000000000000000000000.nnnnooooo0",
    ".........ooonnnnmmm0.............nnnnpm0nnnnmm0mmm000000000000000000000000000.0nnnooooo0",
    ".........ooop0nnmm0..............nnnnp0000mmm00mm000000000000000000000000000...nnnoonnm0",
    "........oooopnnnmo0..............oonnp000pmmn00m000000000000000000000000000....nnnnnnmm0",
    "........ooonnnnnmo0..............oon0p000ommmn0000000000000000000000000000.....nnnmmmmm0",
    "........ooobnnn00p...............o000p00nnnnom0000000000000000011000000........nnnmmmm00",
    "........oppboo000p...............oonnp00nnnnom00000000000000000110000..........nnmmmmm000",
    ".......oopnnoo000o...............oonnp0pnnnnomm00000000000000000nmm00..........00mnoom000",
    ".......oonnmm00000...............onnnpppnnnnoom000000000000000mmnmmo0..........00nnpomm00",
    ".......onnnmm0000................onnpppoooonoom0....0000000000oonm0000.........0nnnpmmpp0",
    ".......onnnm00000................onnpppoooonnm0........0000mm0oonm0000..........nnnnnmpp0",
    ".......onmm000000...............0onnppoonnnmmm0........000mmm0nn0mo000..........nnnnnmpp0",
    ".......ooo00mm00................0onnnnnnnmmmmm0..........0mmmmmm0oo000..........nnnnnmmm0",
    ".....oooooooo000................0onnnmmnnmmmmm0..........0mmmmmmoo0000..........nnnnnmmm0",
    "....ooooooooo000................oonnnnnnnmmmm0...........0mmmmmmoo0000..........nnnnnnnm0",
    "...oooooooonn000m...............oonnnnmmnmmm00............mmmmmmmmmmm0..........nnnnnnnn0m",
    "..oonnnononnn00mmm..............pnnnn00mmmmm0.............mmmmm00mmmm0..........onnnnnnn0mm",
    "..o0nnoooonnn00mmm..............pnnmm00mmmmm0.............mmmmm000mo00.........oonnpppn0mmm0",
    "b.m0nnooo0nnn00nm0..............ppmmmmmnnmm00..............mmmmm000000.........o0nnppom0mmm0",
    "b.00nnooo000000000..............nmm00mmnn0m0...............mmmmm00mn00........oo0nnnpom0mmm00",
    "...00nnno0000n000...............nm000mmn0000...............mmmmmmmmn00........nn0nnnnnm0nmm00.b",
    "...0mmmnn0mm0n000..............mmm000nnn0000...............mmmmmmmm000o........m0onnnnm0nmm00b",
    "b...mmmm00m00n00.............ppp0000nnnn0000...............mmnn0mmm00mmo0......m0onnnn000000b",
    ".b...mm00000000.............opmn0000mn0nnnm................mm000mm0mmm000.......00000000000b",
    "............................nmm00000mm00m00.................m000000mm0000.........00000000",
    ".............................m0000000000000..................00000000000",
    "..................................00000000....................000000",
    "....................................0000"
  ],
  legend: {
    "0": { m: "peat", step: 0 },
    "1": { m: "iron", step: 2 },
    "2": { m: "iron", step: 3 },
    A: { m: "reed", step: 4 },
    E: { pal: C.mireLight, glow: true },
    b: { m: "peat", step: 4 },
    c: { m: "wood", step: 3 },
    m: { m: "peat", step: 1 },
    n: { m: "peat", step: 2 },
    o: { m: "peat", step: 3 },
    p: { m: "reed", step: 3 }
  },
  idle: {
    // A breath like a field settling: slow, heavy, a long rest between.
    waist: 56,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    // Once in a cycle, the reeds on its back lean in a wind.
    twitch: {
      frames: [6],
      patches: [
        { x: 28, y: 0, rows: [".................................._A", "................_A................_p", "................_p..........._A..._p", "................_p.........._....._p", "........A......._p.........._p...._p.....b", "......._A......_.p_b........_p...._p..._.b", "........_p....._p._bp......._p...._p..._p", "........_p....b_p._bp......_p.._.._p..._p", "........_p..._..p..._p....._p.._.._n..._p......_A", "_b......._p.._b_p..._p....._n..._p_n.._p......._p", "_b......._p...._p.....p...._n..._p_n.._p......._p"] }
      ]
    }
  }
};
