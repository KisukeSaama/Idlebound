import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Lantern Moth (BIBLE 8.1): drawn to the walker's light, like everything in the night.
 * Hanging in the air with its wings thrown wide in threat, four false eyes staring at the
 * company from dusty lilac wings veined in black; a thick ruff of fur, feathered antennae,
 * two burning points for eyes. Its abdomen is a lantern of segments lit from inside.
 */
export const LANTERN_MOTH: CreatureGrid = {
  rows: [
    ".........kk",
    "......LLLkkkKK",
    "....LLLKKkkkkkKK........................................................................kkk",
    ".LLLLKKKKKkkkkkKKKk.........b........................b....b.........................KKKkkkkk",
    "LLLLKKKKKKKkkkKKKkkkKK..b...b........................b..bb......................KKKKKKKkkkkkk",
    "LLkkkKKKKKKKkkkKKKkkkKKK.bbb...b......................bb....................KKKKKKKKKKkkkkkkkKK",
    ".LkkkkkKKkkK0kkKkkkkkkkkkkbb...b......................bb.................kkKKkkk1kkKkk0kkkk111KK",
    ".LL111kkkkkKK0Kkkkkkkkkkbbk.bbb....................b..b.bb..............kkkKkkk11kkkk0kkkk11111KK",
    ".LL11111kkkKKk0kkkkkkkkkkk0k.bb....................b.b.................KkkkKKKk1kk100kkkkk111111KK",
    ".LL11111kkkkkkk00xxxkkkkkkkbb..b..b.................bb................kKKkkkkkkkk10kkk1kk1111101KK",
    "..LL11kkkkkkkkxxx0xxxxxkkkk0k1.b..b.................bb...............k0KKKkkkkkkk0kkk1111111100KK",
    "..LL1111kkkkkxxSSS0SSxxkkkkk011.bb...............b..b.bb...........kk0kKKkkkk1kk0kxxxx111111110KK",
    "...L11kkk11kxxSS0000SSxxkkkkk011bb...............b.b..............kkk0kkkkkk11k0kxxSSxxx1111110KK",
    ".....11kkk11xSS000000SSxkkkkk0bb1.b..b............bb.............kkk0kkkkk11100kxxSSSSxxk111100KK",
    ".....L1kkkkxxS00LL0000Sxkkkk110111b..b............bb............kkk0kkkkkk1101kkxS0L00Sxk111100K",
    ".....LLkkkkxxS000000000xxkkkk11011kbb.............b.bb.........kkk0kkkkkkkk01kkkxS0000Sx111100KK",
    "......LkkkkxxS00000000S00kkkkk110kkbb............b............Kkkk0k1kkk1101kk11xS0000Sx111100K",
    ".....KKkkkkxxS00000000Sxx0kkkk110bbkb............b...........KKkk0k11k11101kkkk1xS0000Sx111kk",
    "....LKKKKkkkxSS000000SSx110kkk1110kkkb..........b...........kKkk0kk1111001111kkkxxSSSSxx11kkk",
    "....LKKKKKKkxxSS0000SSxxkkk0Kkkkk10kkb1.........b...........kkk0k1k1110111111kkkkxxSSxxk11kk",
    "...LLKKK00kk1xxSSSSSSxxkkkkk0kkkk10111b........b...........kkkk01111101111111kkkk1xxxxkk1kkk",
    "..LLkkkKKk0011xxxxxxxxkkkkkkk0kkk11011bk.......b...........kkk0kk111011111111111111kkkkkkkk0",
    "..LLLkkKKkkk0001xxxxkkkkkk11kk0kk11001kbk.....b...........kkk0kk1100111111111111111kkkkkkk000",
    "...LLkkkKKkk11K000kkkkkkkkkkkkk00k1001kbk.....b..........kkk01kkk01111111k11111kk1kkkkkkk1000",
    "....LLkkKKKKKKKKKK001k11kkkkkkkkk01110kkbkkk.b...........kkk011k01111111kk1111kkkkkkkkkkk0000",
    ".....LLLKKKKKKKkKK110001kkkkkkkkk10kkk0kkkkkk...........Kkk0111011111111kkkkkkkk1kkkk00000xxx",
    "......LLKKKKkkkkkKK11kk00kkkkk1kkkk0kAAkkkkkkx.........KKK0k110111111111kkkkkkk110000kk110xxx",
    ".......LL111kkkkkKKKkkkkk000kk11k1kkAkkAkkAAkxxx.......kk0kk00k11kkk11kkkkkkk0000000000000x",
    ".........1111kkkkkKKKkkkkkkk00kkk1kkkEEE0kEEkxxxKKKK..KKk0k0kkkkkkkkkkkkk0000k11111100000",
    "...........1kkk111kKKkkkkkkKKk0001kkkEEkk0x11xxxKKKKKKkk0k0kkkkkkkkkkk000kkkkk111111000",
    "...........kkk111kkKKKKKKKKKKKkkk000xxxx001x0xxxLKKKKKK0101kkk1kkk0000kkkkkkk111111100",
    "..........kkk11111kkKKKKKKKkKKkkkxxk00bkk0000xxxKLKkLK010001110000kkkkkkkkkkkk1111000",
    "..........kk11111kk11KKKkkkkkKKkkkxxxb0000b0LxxKKLkkKL000000001kkkkk11kkk11kk11100000",
    "..........0111111kk1kk11kkkk1KKKk0xxxb1000b0xLKKKKKKKL00000001kkkkk11111111k111000000",
    "...........0011100000000000000000000b0000b000LKKKKKK000000000kkkkk111111111110000000",
    ".............111kkkkk1kkkkkk111KK0000bxxxb0xKKKKKKKKKkkL0000000000000011000000110000",
    "...............kkkkk1111kk111111Kk000b000KKKKKKLKKKKKKkkL000kk01kk1111000000000000",
    ".................100111111111111kkk0000LLKKkkkKKLKKKkkkkL00kkk00110000000000000",
    "...................00011111111110k000xxKKKKKKKKKLKKkkkk000000000100000000000",
    ".....................000001111110000xx..KKKKKKKkkKKkk110..0xxxx0000000000",
    "..........................000000000xx...0KkKKKKkkKKk11L0",
    ".................................000....0kkKKkkkkkKkk1xL",
    "...........................KKKKKKkkkk1kk01kkxkkkkkk11100111100011kkkkk1",
    ".........................KKKKKKKKkkk1111kkk01111k1000x0011111011kkk111111",
    "......................KKKKKKKKkKKKKk111100x000x111xxG0x0111000011kkk11k1111",
    "....................KKKKKKKKKkkkKK0011110x00GHxHHHG0GGx11111111111k111kkk1111",
    "..................KKKKKK11kKKk01kk111110x0000xHHHHH0000x0000000000000000000001k",
    "...............KKKKkkKKK1kkkk101kkk0000x0000Gxsssss0sss0x101111kk11111kkkk1111k11",
    "..............KKKKKKKKKKKKkk00000001kkx0000.xaaHHHHHGG000x111111111111kkkkkxxkk100",
    ".............KKKKKkKKk00000011kkk11kkx0100.bxGHHHHHGGG.b0x0001kkk11k1kkkkkxxxxkkk00",
    "............KKKKKK0000xx11k111kkkkk00x100bb.xGHHHHHGGG..bbx1100kkk1kkkkkkxxSSxx1100",
    "...........KKKKKKKkxxSSxxkk111kkk00kx10000.x.GHsssssssss11x011100k11kkkkkxSSSSx11100",
    "...........KkkkKKkxxSSSSxxk11kk00kk1x0100..x.GaaHHHSSS...kx10110k000kkkk1xSSSSx11101",
    "..........KkkkKKkkxSSK0SSxkk000kkk11011x...xbGGHHHHHGS.b.kx11010k11100kk1xxSSxx011111",
    ".........KKkkkkkkkxSS00SSx00kkkk011010x...bbx.GHHHHGGG..bbx111001kkkkk001kxxxx0000011",
    ".........kk111111kxxSSSS001kkkk00101x0......x.GGssssssss..00k11101kkkkk1000xx000xxx00",
    "..........0KKK1kkkkxxS00x11kk1101011x.......x..aaHHHGG.....0k11110000k1k11100110xxxx",
    ".............K111kkk00xxx1kkk1000111.........b.GGHHHGG.......111k100001kk100000xx",
    "...............11k00kkkkkk111100011........bb...GHHSSG........11kk110001kk110xx00",
    "................00kkkkkkkk10000000..............Gssssssss.......1110110111100",
    "..............00.kk111kkk0000xxxx...............aaHGGG............1000111000",
    "...............kkk11111000000x...................GGHGG.............110001000x",
    "..............Kkk11100000000......................GGGG.................00000xx",
    "..............Kkk111KKKK0.........................GGGG......................xx",
    "..............KKKKKKK",
    "..............KK",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    "1": { m: "shadow", step: 1 },
    A: { pal: C.amber, glow: true },
    E: { pal: C.goldLight, glow: true },
    G: { pal: C.amber, glow: true, light: true },
    H: { pal: C.goldLight, glow: true, light: true },
    K: { m: "wing", step: 2 },
    L: { m: "wing", step: 3 },
    S: { m: "spot", step: 1 },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    k: { m: "wing", step: 1 },
    s: { m: "spot", step: 0 },
    x: { pal: C.ink }
  },
  idle: {
    // Hovering: the whole body rises and sinks on its wingbeat (the waist two rows short of the
    // last, so the highest beat lifts nothing from under the grid).
    waist: 72,
    breath: [0, 1, 1, 2, 2, 1, 1, 0, 0, 0],
    // Once in a cycle, the wingtips dip.
    twitch: {
      frames: [4],
      patches: [
        { x: 0, y: 0, rows: [".........__", "......___..___", "....__.LL...KK__", ".___.LL..k....K.___", "_...L.....k...k..K.__......................................................................._", "..LLK......k..K..k..K........................................................................__", "L....KK..KK.k...KK..........................................................................kK._", "..kkkk.KK...0kkK..............................................................................K._", "......kk.....0K................................................................................K._", "...........KK.0kkkkk..........................................................................1", ".L.1..11......k00x..k........................................................................1.1.K", "......kk.....k.xx0xxx........................................................................0", "..L...11.kk.k.x.SS.S", "...L1.k..1.k.x.S....S........................................................................1", ".....1....11..S.00..............................................................................K", "......1.........LL..........................................................................1.0", ".....L.........................................................................................K", "....._L.....................................................................................00K", "...._..kk..x..0", ".........kk..S.0....0.......................................................................k", "..._....KKK.x.S.0000", ".._.LKK.00kk.x.SSSSSS", "....k.....0011xx....x......................................................................._", "..L....K.k..0001xxxx", "...L.k....kk11.000kkk", "....L.kk.......K..001.......................................................................0", ".....L......KKK.K.1.0", "......L.KKKK.......11", ".......LL...k....K..k", ".........11.1..kkkK"] }
      ]
    }
  }
};
