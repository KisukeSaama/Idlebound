import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hollow Scarecrow (BIBLE 8.1): stuffed with the last harvest, it guards fields no one
 * will reap. A sack head stuffed too full and lolling toward the company, eyes cut on a
 * slant and lit from inside, a grin cut ear to ear and sewn shut; a long violet coat torn
 * into points over the straw, a rusted sickle held out. A crow keeps watch on the far arm.
 */
export const HOLLOW_SCARECROW: CreatureGrid = {
  rows: [
    "......................................KKK",
    "....................................KKKKKKKKKKkk",
    "..................................KKKKKKKKKKKkkkkk",
    "..................................KKKKKKkKkKkkkkkk",
    "..................................KKKKKKKkkKKkkkk",
    "..................................KKKKkKKkkkKkk0",
    ".................................KkkKkkkKkkkKk00",
    ".................................Kkkkkkkkkkkkk0",
    ".................................bbbbbbbbbbbbbb",
    ".................................bbb0bb.KKKKKKKK",
    "................................KKKKKKKKKKKKkkKKKKK",
    ".............................KKKKKKkKKKKKKKKkKKkkKKK",
    "..........................KKkkKkkkKKKKKKkkkkkkkkkkkk",
    "........................KKKKkkkkkkKkkkkkkk000xxkkkkk",
    "........................kkKkkkkkkkkkk00bbbbbbbcbb",
    "..........................kk0kkbbbbbxbbcccccccccb",
    "..............................bbbbbbbbccccccccccbb",
    "..............................bb0ccbbccccccc0cbbbb................00",
    "..............................c00000ccccc0000ccbbb.....K.........000",
    "..............................c00EE00ccb00E00bbbbb....EEkk......0000",
    "..............................cc0EEE0ccb0EEE0cbbbb...SEEEk.....00000",
    "..............................cccEEE0ccc00EE0cbbbb..SSkkkkKKKK000000",
    "..............................xcccc0cccccccccccbbb....kkk0KKkkk0000",
    "..............................ccbccbbcbbccccbcbbbb......KKKkkkkk00",
    "..............................cbbcccbcccbbbcbbbbx.......KKkkkkkkkk",
    "..............................x0dcdc0ccdbdbdbbdxx.......KKkkkkkkkk",
    "..............................c0d0dxx00dbdxd00d0.........kkkkkkkkk",
    "...............................bd0d00dxd0d0d00d........KKKkk0000xxxx",
    "................................bb0T000000S000bKKTKKKKKKKKKx00xbbxxxx",
    ".................................bbbTTbxx0SxbbbTTKKKKKKxKKKKKKkk",
    "..............................KKKKbxxxTxxxSbbTTKKKKKKkKxKKKKKKkk",
    "............................kKKKKKKkkkbbbbbbbbxKKKKkkkK0KKKKKkkk",
    "..........................K00KKKKKKKKkkkKbbbKKxKKKkkkkKKKKxkkkkk",
    "........................MMK00KKKKKKKKKKKKKKKKKxKKKx0kkkKKkxkkkkk",
    "...................cccKKKKKK000KKKKKKKKKKKKKK0xKKKx0KxKKKk0kKKkk",
    ".................ccKKKxKKK00KKKkkkkxKKKKKKKKK0xKKKx0KkKKkk0KKkkk",
    ".................KKKKKKK000Kx00kkkKxKKK0KKKKK0KKKKx0KkkkKKKKKkkx",
    "...........TT....KKK000000KKKkkkxxKKKK00KKKKK0KKKKk00xkkKKxKKKkx",
    ".M...........Tx...KK00KKKKkkkk0xxxKKKK00KKKKK00cccccbxKKKKxkkKkk",
    "MM...........ccT..KKKKKKKKkx00xxxx0KKKK0KKKKK00cccccbxKKKkkkkkkk",
    "MK...........cbST.KKKkK000x0KKKxxx0KKK00KKKKK00cccccb0KKkkkkxkkx",
    "MK.........SSSbSSTKKkkk0...KKKKxx0KKKK00KKKKK00ccccbb0KKk..kx0k0",
    "MK..........cbbSTSK000.....KKKKxx0KKKK00KKKKK00cccccbkkKK..kxTS0",
    ".M.........cbbTTSS00.......KKKKxxKKKKK00KKKKK00ccbbcbbKKk...xTSS",
    ".M.........bbT..S..........KKKKxx0KKKK00KKKKK00cbbbbbKKKk...STSS",
    ".MM........bT...S..........KKKxxx0KKKK00KKTKKK0KKKxk00KKk...TSSS",
    ".MMM......cb...S...........KKKx000KKKTS0SKTKKK0KKKxK00KKx...TS..S",
    ".bbbMMM..cbb...............K0KxK00KKKTKSSTSSTK0KKKKK00bbb...T",
    ".MMbbMMbbcb................bbbbbb0KKKKT0STTTKK0KKKbbbbbbb",
    "..MMMbbMMb.................KbbbbbbbKKKbTbTbKKKbbbbbbbbKKxx",
    "...........................xxKKxxbKbbbbbbbbbbb0bKKKK0kkKxx",
    "...........................KxKKxx0KbbK00KKKKKK0KKKKK0kkkxx",
    "...........................xxKKK00xbKK00KKKKKK0KKKKKK0kkxx",
    "...........................KKx0K00bbKKK0KKKKKK0KKKKK0kkkxx",
    "...........................KKx0K00bbxK00KKKKKK0KKKKKK0Kkxx",
    "...........................kKxxK00b0xKK0KKKKkk0KKKKkk0KKxx",
    "...........................kKxxk00xxxK00KKKKkk0xKKKkk0KK0x",
    "...........................KKxxk00KxxKK0KKKKKkkxKkkkk0kk000",
    "...........................K0xxk0xKxxK00KKkkkkkxKkkkk0k0k00",
    "...........................kxxxk00x0KK00kkkkkkk0Kkkkk0k0kk0",
    "...........................xxxT000x0KK00kkkk00kkKK00k0k0Tk0",
    "...........................x.xTx00x0KK00kKKk000kkK0xkkk0.T0",
    "...........................xcTxx0Sx0Kk00kKKk000kkK0bKSk0bT0",
    "...........................ScTxx0Sckk0T0KKKk0x0TkxxcxSk0cSTS",
    "...........................ST.xxxSSkk0T0cKKk0xSTkxxc.S0b.SxT",
    "...........................STSSxxSx.kkTcKKK00SS0TxxcSS0b.SxT",
    "...........................STSSxxS..xxxT.kKkxSS0T0xcSkS.SScS",
    "...........................TSSS..S.bkxST.kkkxSSkTx.cSkS.SS",
    "..........................STSS...S.SxxSTSkxxxS.kkT.SS.xSS",
    "..........................S.ScS..S..xxSTSxx0xS.kkT.....SS",
    "............................Sc.......xS.T.xxS...kT......S",
    ".....................................SS.T.xxS....TT.....S",
    ".....................................SS...xxb....TT",
    "..........................................bbb",
    "..........................................bbb",
    "..........................................bbb",
    "..........................................bbb",
    "..........................................bSb",
    "..........................................SSS",
    "........................................SSSSSS",
    ".......................................SSSSSSS",
    ".......................................SSSSbbS",
    "......................................TTT.SbbTTT",
    ".....................................T....Sbb...TT"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    E: { pal: C.goldLight, glow: true },
    K: { m: "coat", step: 1 },
    M: { m: "blade", step: 3 },
    S: { m: "straw", step: 1 },
    T: { m: "straw", step: 2 },
    b: { m: "sack", step: 1 },
    c: { m: "sack", step: 2 },
    d: { m: "sack", step: 3 },
    k: { m: "coat", step: 0 },
    x: { pal: C.ink }
  },
  idle: {
    // No breath: the wind, leaning the sack and the coat, then letting go.
    waist: 52,
    breath: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the crow starts up off the bar.
    twitch: {
      frames: [7],
      patches: [
        { x: 54, y: 16, rows: ["............00", "...........0", "EE........0", "..E......0", "k_k.0..K0", "...0........._", "..._....._.._", "..........__"] }
      ]
    }
  }
};
