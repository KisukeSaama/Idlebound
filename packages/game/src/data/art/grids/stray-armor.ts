import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Stray Armor (BIBLE 8, events): an empty suit of plate walking the road in the wrong
 * direction. A full harness mid-stride, facing right, away from the company: a bascinet
 * with its visor swung up on nothing but dark, gaps of dark at the neck, the elbows and the
 * knees where a man should be; a torn red surcoat over the plate, its hem in rags and a
 * rag of a crest trailing from the helm; the near hand dragging a sword by the hilt, its
 * point scoring the road behind. Two small violet embers far back inside the helm.
 */
export const STRAY_ARMOR: CreatureGrid = {
  rows: [
    "......................................ll...ll",
    "....................................llxxllllhhll",
    "...................................llllllhhhhhhhll",
    "..........................rrrrr....lll22lhxxhx00llh2",
    "........................rrrrrrrrrlllllh2222222222222",
    "......................rrrrrrrrrbblllllhhhhhhhhhhhkkk",
    "......................bbbrrrrrrbbllhhhhhkkkkxkkkk22",
    "........................rrrrrrrbbLllhhhhhxxxxxxxx",
    ".......................rrrbbbbbbbLllhhhhhxxxxxxxx",
    ".....................rrbbbbbbbbb222222222xxxxxxxx",
    ".....................rbb........222222222xxxxExxE",
    "................................222222222xxxxxxxx",
    "................................hhhhhhhhhxxxxxxxxx",
    "................................hhhhhkkhkxxxxxxxx",
    ".................................hhkkkkkkkkxxxxx",
    ".................................hhkkkkkkkkkk22",
    ".................................2222222222222",
    "................................hhk2222222222..h",
    "................................hhkkkkkkkkkk2",
    "...............................h2111h11111110",
    "............................llllhhkkkkkkkkkk22",
    "............................llllh1122221221222hh",
    "...........................llhhhl1111111111hhkhhhhh",
    "..........................lllhhhlhhhhkhhhhhhhkkkkkk",
    ".........................lllhhhlhhhhhkkhhhhhhkkkkkkk",
    ".........................ll112hlkhhkkkrrrbbhhh111100",
    ".........................22222l2222110rrbbbhhh111100",
    ".........................2222222222110rrxbbhhh1kkkk0",
    "..........................122222222100rrbbbhhkkk2222",
    "..........................hhhlhkkkkk2rbrbbbbhkkk111",
    "...........................hhlkkkkkk2rbbxbbbhkkkkkkk",
    "...........................hhlk22222xbbbbbbbbhkkkkkk",
    "...........................h2l2222bbxbbxxrbbbhhkkkkkk",
    "...........................hlkkk2rrrbbxxrrbbbhhkkkkkk",
    "...........................hlhh22rrrbbxxrbbbbb10kkhhkk",
    "..........................lhlhk2rrrrbhhhbbbbbb100hhhkk",
    "..........................lhlhkrrrrrhhhhhbbbbb110hhxxx1",
    "..........................lhhk2rrrrrbhhhkxbbbb1100xxxx1",
    ".........................llhhk2rrrrrbhhhkxbbbb1100xxx110",
    ".........................llhhkrrrrrrbhhkkxbbbb1100.11110",
    "........................2lxxxkrrrrrrbkkkbbbbbbb222.111110",
    "........................22xxx2rrrrbbbbkbbrrbbbx222..kkkkk",
    ".......................222xxxhrrrrrbbrrbbbbbbbx22....kkk22",
    "......................222220rrrrrrbbbrrbbbbbbbx0.....kkkkk",
    "......................222211bbbr0000000hhh000000......hhhh",
    ".....................222220bbb000000000hhh00000.......hkkkk",
    "....................h22222rrbbh0rrrr0bbbhbbbbb0.......hkkkk",
    "....................hhhh22rbbbhrrrrbbbbbbbbxbbb.......x1111",
    "...................lhhh22rrbbbhrbrrbbbbbbbbxbbbb.......k121",
    "...................lhhk2rrbbbbhrbbrbbbbbbxbbbbbb.......k12",
    "..................llhkk2rrbbbb1bbrrbbbbbbxbbbbbb",
    "................hhhhhxrrrbbbbbbbbrrbbbbbbbbbbbbb",
    "...............lhhhkkxrrrbbbbbbbbbrbbbbbbbbbbbbb",
    "...........hh..lhhhhkxrrbbbbxbbbbrrbbbbbbbbbbbbb",
    "...........hhhhlhhhhxrrbbbbbxbbbbrrbbblbbbbbbbbb",
    ".............hh222200rbbbbbbbbbb0brbbblbbbbbbbbbb",
    "..............k2l2220rbbbbbbbbbb00bbblbbbxbbbbbbb",
    "...............ll2kbbbbbbbbbbbbb0kbbblbbbxbbbbbbbk",
    "..............hlk1.bbbbbbbbbbbb00k2blbbbbbbbb0bbbk",
    ".............hlkk..bbbbbbbbbbbb0022blbxbbbbb00bbbh",
    ".............hlkk..bbbbbbbxbbb00k22lbbx000bb00hbbhh",
    "............hlkk...bbbbbbxxbbx00k2.lbbx000bb00h2bh1",
    "............hlkk...b0bbbbxxbbx000xl.bbx0.bbb0222221",
    "...........hlkk.....0bbbb01100000...bbx...bb02222221",
    "...........hlkk.......bb00111000..........bb022222211",
    "...........hlk.........b00kkkk21...........bhhhhhhhkk",
    "...........lkk.........x0kkkkk21.............hhhhhklll",
    "..........hlk..........x0hhkk21..............hhhkkllllh",
    "..........llk..........hhhkkk21...............hkkxllhhhx",
    ".........hlk.........hhhhkkx22................k22x222222",
    ".........hlk.........hhl111xx....................xxkkk22",
    "........hlkk........hhlk222xk...................lllhhkkk",
    "........llk.........hlkk22kkk...................hlhhhhkk",
    ".......hlkk.........hkkkkkkk2...................hlhhhhhkk",
    ".......hlk.........hhkkkkkk22...................hlhhhh222",
    "......hlkk.........hkkkkkkk2.....................khhhhhkk",
    "......hlk..........hkkkkkk2......................llhhhhhk",
    ".....hlkk.........00111100x......................llhhhhhk",
    ".....hlk..........20011000.......................22222221x",
    "....hlkk.........22111000........................222202210",
    "....hlk..........hkkkk20.........................222222211",
    "...hlkk.......k.hhkkkk21..........................hhhhhhkk",
    "...klk.......hkkkkkkk22...........................hhhhhhkk",
    "...llk......hhkkkk2k21............................hhhhhhkk",
    "...lk.......hkkkkkk221............................hhhkkkkk",
    "..hlk......hhkkkkkkkk.............................hhhllllllh",
    ".hlk.......hhkkkkkkkk............................lllllhlhhhhh",
    ".hlk......22111111100............................lllhhhhhhhhhhh",
    "hlkk......hk10000000x............................2ll222222222222",
    "hlk.......hkkkkkkkk2x............................2222222222222222",
    "kkk......hh222222222.............................hhkkkkkkkkkkkkkk2",
    ".........21111111111.............................22222222k22222222"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    "1": { m: "steel", step: 1 },
    "2": { m: "steel", step: 2 },
    E: { pal: C.violetFire, glow: true },
    L: { pal: C.violetFire, glow: true, light: true },
    b: { m: "cloth", step: 1 },
    h: { m: "plate", step: 2 },
    k: { m: "plate", step: 1 },
    l: { m: "plate", step: 3 },
    r: { m: "cloth", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // Nothing breathes in it, but the plates rise and settle on the stride.
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the rag of the crest flicks in a wind from the road.
    twitch: {
      frames: [8],
      patches: [
        { x: 20, y: 4, rows: ["...r_", ".r.._", ".b.._", "...r_", "..r._", "r.b._", ".b._"] }
      ]
    }
  }
};
