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
    "...bbb...............cbb",
    "..bbbbbcb.........ccccbbcccc",
    "..b...bbcc.......ccccbbbbbbbba",
    "cbb.....bbc.....cccbbbbbbbxbba",
    "cb......bb.....ccbbbbbbbbxxbbaa",
    "bb.......bb....bbbbbbbbbbbbbbaa",
    ".b........bb...bbbbbbbbbbbbbbba",
    ".bb.......cb...bbbbbbbbbbbbbbbaa",
    ".bb.......cb..cbbbbbbbbbb0000000",
    "..........ca..x0000000000000000c",
    "..........ca..b000000bbbbbbbbbbbbbcc",
    "..........cccbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".gg......bcbbbbbbbbbbbbbbbbbbbbbbbbbb..ba",
    "ggg.....cbbbbbbbbaabxxxxxaaaaaaaaaaa....a",
    "gccx...bbbbbbbaaxxxxxxxxxxx...............xllahhh",
    "......bbbbbbaa..xxxxxxxxxxx..............hhllahhhPP",
    "......bbbbaa...xxxxxxxxxxxxx.......lallhhPPhllllhhh",
    ".......aaabb...xxxExxxxExxxx.....lllalllPhhllhhhhhhh",
    "..........bbcc.xxxxxxxxxxxxx....llllhhhllkllhhhhhh0x",
    "..........bbcc.xxxxxxxxxxxx.....hlllhhhhhkhhhhhhKK0K",
    "..........bbcc.lxxxxxxxxxxxx...hhllhhhhkhhhhhhKKKKllll",
    "..........bbcc.llllxxxxxllhK..KKhkhhhhhkKhKh00KKllllllhh",
    "..........bbxc.hlPhhhhhhhhhKKKKKKKhhKh0KKKKkk00kllhhhlhhh",
    "...........bxc.hhPhlhhhhhhhKKKKKKKk0000kk0llll0hlllhhhhhK",
    "...........bxc.llhPlhhhhhhhKKKKKKKkk000khlllllhhhllhhhhhKK",
    "...........bxc.llhPlhhhhhhhKKK00KKkkkkklllllkkhhhllhhhKKKK",
    "...........bxc.xhhPhlhhhhhKKKKKKKKkKKkkllhhhkkhhhhhh000KKK",
    "...........bcc.xhhPhlhhhKKKKKKKKKKkkxxkKhhhhkhhkkkh0000kk",
    "...........bac.hhhhhlhhKKKKKKK0KK0kxxxkKhhhKK0kkkKK00k000",
    "...........bac.hhhhhlhKKKKKKKKK000kxxxx0KKKKK00kkK00kk000",
    "...........bac..hhhhlKKKKKKKKKkk0kkKxxx00kx0000kkk00llhhk",
    "...........bcc..hhKKlKKKKKKkkk00KKKKxxxKkKkKkxxKKkklllhhhh",
    "...........bbc.KKKKKKlKKKkkk000KKKKKxKxKKKKKKKKKKKKllhhhhh",
    "...........bbcKKK00KKlKKkk000xKKKKKKxKxKKKKKKkKKKKKllkhhhh",
    "..........ccccKkkKKKKlkk00k00xKKKKKKxxxKKKKKKkKKKKKhlkhhhh",
    "..........ccccKKKKKkkk000kkk0xKKKKKKKKxKKKKKKkKKKKKhhhhhhx",
    "..........ccccKKkkh000KKKK000kKKKKKKkxxKKKKKKkKKKKkhhhhkkx",
    "..........bbbcxxx0h0hhhhKK00KkKKxxKKkkxKKKKKKKKKKkkxKK0000",
    "...........bccxx.hhhhhhhKK00KkKKxxKKkkKKKKKKKKKKKKk00kkllh",
    "...........bcc...hhhhhhhKKxxKKKKKxKKKkkKKKKKKKKKKKKkkklllhh",
    "...........bbc...hhhhhhlKKxxKKKKKxKKKkkKKKKKKKKKKKKkkxllhhh",
    "...........bcc...hhhhhhlKKxKKKKKxxKKKKkKKKKKKKKKKKKkxxhhhhK",
    "...........bxc...hhhhhhlKKKKKKKKKxKKKKKKKKKKKKKKKKKkxkhhKKK",
    "...........bxc...hhhhhhlKKKKKKKKKxKKKKKKKKKKKKKKKKKkkk00KKK",
    "...........bcc...h...hlKKKKKKKKKKxKKKKKKKKKxKKKKKKKkkk00kk",
    "...........bkc...h....lKKKKKKKxxKxKKKKKKKKKxKKKKKKkkkk000x",
    "...........bkc........lKKKKKKKxxKxKKKKKKKKKxKKKKKkkkkkk00x",
    "...........bkc........llKKKKKKxxKkKKKKKKKKKxKKKKxkkkkkkk00",
    "...........bcc........llKKKKKKxxKkKKKKKKKKKxxKKKxkkkkkkk00",
    "...........bcc.........KKKKKKKxxKkKKKKKKKKKxxKKcckkkkkkk00",
    "...........bcc.........KKKKKKKKKKkKKKKKKKKKcccccbkkkkkkk00",
    "...........bxc.........KKKKKKKKKKKKKKKKKKKKbbbbbbkkkkkkkkk",
    "..........bbxc.........KKKKKKKxxKKKKKKKKKKKKbbbbbkkkkkkkkk",
    "..........bbxc.........KKKKKKKxKKKKxKKKKKKKKbbbbakkKkkkkkk",
    "..........bbx..........KKKKKKKxKKKKxKKKKKKKKbbbbbaKKkkkkkk",
    "..........bbx..........KKKKKKKxKKKKxKKKKKKKKbbbaaaKKkkkkkk",
    "..........bbb..........KKKKKKKxxKKKxKKKKKKKKbaaaaaKKkkkkkk0",
    "..........bbx..........KKKKKKKxKKKKxxKKKKKKKa0xKKKKKkkkkkk0",
    "..........bbx.........KKKKKKKKKKKKKxKKkKKKKKK0xkKKKkkkkkkk0",
    "..........bbx.........KKKKKhhhhKKkKxKKkkkkkKKkxkKKKKkkkkkk0",
    "..........bbx.........KKKKKhhhhhkkkxkkkkkkkKKkxkKKKkkkkkkk00",
    "..........bbx.........KKKKKhhhhKKkkkkkkkkkkKKKxkkkkkkkkkkkk0",
    "..........cbk.........KKKKKhhKKKKkkkkkkkkkkKKKxkkkkkkkKkkkk0",
    "..........cb..........KKKKKhKKKKkkkkkkkkkkkkKkxkkkkkkkKkkkk0",
    "..........cb..........KKKKKKKKkkkkkkkkkkkkkkkkxkkkkkkkKkkkkk0",
    "..........cb..........kKKKKKKKkkkkkk0kkkkkkkkkkkkkkkkkkkkk000",
    "..........cb..........kKKKKKK00kkxkk0kkkkkkkkk0kkkkkkkkkkkkkxx",
    "..........ca..........KKKKKK00x00x00kkkk00000k00k000kkkxkkkkxx",
    "..........cb..........KKKKKK00000x00kk00000000k000000kkxk0kkx0",
    "..........cb..........KKKKK000000x0kkk0000000kkk0000000xk000x00",
    "..........cb..........KKKKK000000xkkk0000x00kkk000xx00kxk000x00",
    "..........bb..........KKKKK00xxx0xkkk00xxxxxkkk0xxxx0kkxk0xxxk0",
    "..........bb..........KKKK00xxxxxxkkk00xxxxxkkk0xxxxkkkxk0xxxk0",
    "..........bb..........KKKK00xxx..kkkk0xxx..kkkkxxxx..kkxk0x..k00",
    "..........bb..........KKK00xxx....kkkxxx...kkkkxxx...kkxkxx...00",
    "..........ba..........KK000xx......kkxxx....kkk0xx....kxkxx...00",
    "..........ba..........bbbbbx.......kkxx......kkxx.....k0kx",
    "..........bb..........aaabaa........0x........kxx......00x",
    "......................xxxx....................Kx........0x",
    "........................................................Kx"
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
    waist: 52,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the bell swings on its cord.
    twitch: {
      frames: [10],
      patches: [
        { x: 0, y: 12, rows: ["._.g", "_..g", "_g..x"] }
      ]
    }
  }
};
