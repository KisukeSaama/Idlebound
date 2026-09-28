import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Lost Shepherd (BIBLE 8.1): he has no sheep; he counts the walkers who pass. Long and
 * stooped under a heap of matted fleece, a battered hat sagging over a face that is only
 * shadow and two pale points, a beard hanging in locks past the belt; a patched robe
 * dragging in the wheat and torn into rags, a crook planted ahead of him, a bell hanging
 * from its hook.
 */
export const LOST_SHEPHERD: CreatureGrid = {
  rows: [
    "...bbbb................ccbb",
    "..bbbbbbcb..........cccccbbcccc",
    "..bb..bbbcc........cccccbbbbbbbba",
    ".bb......bbc......ccccbbbbbbbbbba",
    "cbb......bb......ccccbbbbbbbxxbbaa",
    "cb........bb.....cbbbbbbbbbbxxbbaa",
    "bb........bb.....bbbbbbbbbbbbbbbba",
    ".b.........bb....bbbbbbbbbbbbbbbbaa",
    ".bb........cb....bbbbbbbbbbbbbbbbaa",
    ".bb........cb...cbbbbbbbbbbb0000000",
    "...........ca...x000000000000000000c",
    "...........ca...b0000000bbbbbbbbbbbbbbcc",
    "...........ccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".gg........ccbbbbbbbbbbbbbbbbbbbbbbbbbbbb..bb",
    ".gg.......bbbbbbbbbabbbbaaaaaaaaaaaaaaaa....aa",
    "gggx....ccbbbbbbbaaaaaxxxxxx................aa",
    "gccx...bbbbbbbbaa.xxxxxxxxxxxx.................xllahhhh",
    ".......bbbbbbaa...xxxxxxxxxxxx................hhllahhhPPP",
    ".......bbbbaa....xxxxxxxxxxxxxx........lallhhhPPhllllhhhh",
    "........aaabb....xxxExxxxxExxxx......lllalllPPhhllhhhhhhhh",
    "...........bb.c..xxxxxxxxxxxxxx.....llllhhhlllkllhhhhhhh0x",
    "...........bb.c..xxxxxxxxxxxxx......hlllhhhhhhkhhhhhhhKh0K",
    "...........bb.c..lxxxxxxxxxxxxx....hhllhhhhhkhhhhhhKhKKKllll",
    "...........bbbc..llllxxxxxxllhK...KhhkhhhhhkkhhKh00KKKllllllhh",
    "...........bbxc..llPhhhhhhhlhhK..KKKhkhhKhhKKKKKk000Klllllllhhh",
    "............bxc..hlPhlhhhhhhhhKKKKKKKKKKKK0kKK0kkk00kllhhhhlhhh",
    "............bxc..hhPhlhhhhhhhhKKKKKKKKk0000kkk0llll0hllllhhhhhKK",
    "............bxc..llhPlhhhhhhhhKKKKKKKKkk000khhlllllhhhhllhhhhhKK",
    "............bxc..llhPlhhhhhhhhKKK000KKkkkkkklllllkkhhhhlhhhhKKKK",
    "............bxc..xhhPhlhhhhhhKKKKKKKKKkKKkklllhhhkkhhhhhhh000KKK",
    "............bbc..xhhPhlhhhhKKKKKKKKKKKkkxxkKhhhhhkhhkkkhh0000kk",
    "............bac..hhhhhlhhhKKKKKKK00KK0kxxxkKhhhhKK0kkkKKK00k000",
    "............bac..hhhhhlhhKKKKKKKKKK000kxxxx0KKKKKK00kkKK00kk000",
    "............bac..hhhhhlKKKKKKKKKKKkk0kkxxxx000xx00000kkk00kkhhk",
    "............bac...hhhKlKKKKKKKKKkk00kkKKxxxKkkkk00xxkkkk00lllhk0",
    "............bbc...hKKKKlKKKKKKkkk00KKKKKxxxKkKKkKkkxKKKkklllhhhhh",
    "............bbc..KKKKKKlKKKKkkk000KKKKKKxKxKKKKKKKKKKKKKKllhhhhhh",
    "............cbcKKKK00KKlKKKkk000xKKKKKKKxKxKKKKKKKkKKKKKKllkhhhhh",
    "...........ccccbKkkKKKKlkkk00k00xKKKKKKKxxxKKKKKKKkKKKKKKhlkhhhhk",
    "...........ccccbKKKKKkkk0000kkk0xKKKKKKKKKxKKKKKKKkKKKKKKhhhhhhxk",
    "...........ccccbKKkkh000KKKKK000kKKKKKKKkxxKKKKKKKkKKKKKkhhhhkkxk",
    "...........bbbcbxxx0h0hhhhhKK00KkKKKxxKKkkxKKKKKKKKKKKKkkxKK0000",
    "............bacaxx.hhhhhhhhKK00KkKKKxxKKkkKKKKKKKKKKKKKkk00kkklh",
    "............bbc....hhhhhhhhKKxxKkKKKxxKKKkkKKKKKKKKKKKKKKkkklllhh",
    "............bbc.....hhhhhhlKKxxKKKKKKxKKKkkKKKKKKKKKKKKKKkkxlllhhh",
    "............bbc....hhhhhhhlKKxxKKKKKKxKKKKkKKKKKKKKKKKKKKkkxhlhhhh",
    "............bbc....hhhhhhhlKKxKKKKKKxxKKKKkKKKKKKKKKKKKKKkxxhhhhKK",
    "............bxc....hhhhhhKlKKKKKKKKKKxKKKKKKKKKKKKKKKKKKKkxkhhKKKK",
    "............bxc....hhhhhhhlKKKKKKKKKKxKKKKKKKKKKKKKKKKKKKkkk00KKK",
    "............bbc....h...hhlKKKKKKKKKKKxKKKKKKKKKKxKKKKKKKKkkk00kk",
    "............bkc....h....hlKKKKKKKKxKKxKKKKKKKKKKxKKKKKKKkkkk000x",
    "............bkc.........hlKKKKKKKKxKKxKKKKKKKKKKxKKKKKKkkkkkk00x",
    "............bkc.........hlKKKKKKKKxKKkKKKKKKKKKKxKKKKxkkkkkkkk00",
    "............bkc.........xl.KKKKKKKxKKkKKKKKKKKKKxxKKKxkkkkkkkk00",
    "............bbc..........lKKKKKKKKxKKkKKKKKKKKKKxxKKKxkkkkkkkk00",
    "............bbc...........KKKKKKKKxKKkKKKKKKKKKKxxKKccakkkkkkk00",
    "............bbc...........KKKKKKKKKKKkKKKKKKKKKKcccccbakkkkkkkk0",
    "............bxc...........KKKKKKKKxKKKKKKKKKKKKKbbbbbbakkkkkkkkk",
    "...........bbxc...........KKKKKKKxxKKKKKKKKKKKKKKbbbbbakkkkkkkkk",
    "...........bbxc...........KKKKKKKxxKKKKxKKKKKKKKKbbbbaakkKkkkkkkk",
    "...........bbxc...........KKKKKKKxxKKKKxKKKKKKKKKbbbbbaaKKkkkkkkk",
    "...........bbx............KKKKKKKxxKKKKxKKKKKKKKKbbbbaaaKKkkkkkkk",
    "...........bbb............KKKKKKKKxKKKKxKKKKKKKKKbaaaaaaKKkkkkkk0",
    "...........bbb............KKKKKKKxxKKKKxKKKKKKKKKaaxaKKKKKkkkkkk00",
    "...........bbx...........KKKKKKKKxKKKKKxxKKKKKKKKK0xkKKKKkkkkkkkk0",
    "...........bbx...........KKKKKKKKKKKKKKxKKkkKKKKKK0xkKKKKkkkkkkk00",
    "...........bbx...........KKKKKhhhhhKKkKxKKkkkkkkKKkxkKKKKKkkkkkkk0",
    "...........bbx...........KKKKKhhhhhKkkkxkkkkkkkkKKkxkkKKKkkkkkkkk00",
    "...........bbx...........KKKKKhhhhKKKkkkkkkkkkkkKKKxkkkkkkkkkkkkkk0",
    "...........cbk...........KKKKKhhKKKKKkkkkkkkkkkkKKKxkkkkkkkkKkkkkk0",
    "...........cb............KKKKKhKKKKKkkkkkkkkkkkkkKkxkkkkkkkkKkkkkk0",
    "...........cb............KKKKKKKKKkKkkkkkkkkkkkkkkkxkkkkkkkkKkkkkkk0",
    "...........cb............kKKKKKKKkkkkkkk0kkkkkkkkkkkkkkkkkkkkkkkk000",
    "...........cb............kKKKKKKK0kkkxkk0kkkkkkkkkk0kkkkkkkkkkkkk0kx",
    "...........ca............KKKKKKK000kkxkk0kkkk00kkkk00kk000kkkkkkkkkxx",
    "...........ca............KKKKKK00xx00x00kkkk000000kk00k000kkkxkkkkkxx",
    "...........cb............KKKKKK000000x00kk000000000kk000000kkxk00k0x0",
    "...........cb............KKKKK0000000x0kkk00000000kkk00000000xk0000x00",
    "...........cb............KKKKK0000x00xkkk0000xx00kkk0000xx00kxk0000x00",
    "...........bb...........KKKKKK00xxxx0xkkk00xxxxxxkkk00xxxx0kkxk0xxxxk0",
    "...........bb...........KKKKK00xxxxxxxkkk00xxxxxxkkk0xxxxxkkkxk0xxxxk0",
    "...........bb...........KKKKK00xxxx..kkkk00xxx..kkkkxxxxx..kkxk0xx..k00",
    "...........bb...........KKKK00xxxx...kkkk0xxx...kkkkxxxx...kkxk0xx...00",
    "...........ba...........KKK000xxx.....kkkxxxx....kkk0xxx....kxkxxx...00",
    "...........ba...........KKb00xxx.......kkxxx.....kkk0xx.....k0kxx.....0",
    "...........ba...........bbbbbbx........kkxx.......kkxx.......0kxx",
    "...........bb...........aaaabaa.........0x.........kxx.......00x",
    ".........................xxxx......................Kx.........0x",
    "..............................................................Kx"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    E: { pal: C.moon, glow: true },
    K: { m: "robe", step: 1 },
    P: { m: "fleece", step: 3 },
    a: { m: "wood", step: 0 },
    b: { m: "wood", step: 1 },
    c: { m: "wood", step: 2 },
    g: { m: "bell", step: 3 },
    h: { m: "fleece", step: 1 },
    k: { m: "robe", step: 0 },
    l: { m: "fleece", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // An old man's breath: long, shallow, the fleece rising with it.
    waist: 58,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the bell swings on its cord.
    twitch: {
      frames: [10],
      patches: [
        { x: 0, y: 13, rows: ["._.g", "._.g", "_..gx", "_g.cx"] }
      ]
    }
  }
};
