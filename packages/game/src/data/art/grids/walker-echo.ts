import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Echo of a Walker (BIBLE 8, events): another walker's shadow, from another night. A
 * swordsman in a hooded cloak like Aldric's, drawn in the cold blues and lilacs of
 * something remembered: a mail shirt under the cloak, the hood drawn low over a face that
 * is only shadow and two cold points, the long blade raised in both hands before the
 * stroke, the cloak streaming back into torn rags. It fights beside the company, so it
 * faces right, toward the Remnants.
 */
export const WALKER_ECHO: CreatureGrid = {
  rows: [
    "...........lll",
    "...........LLPll",
    "............LLPPP",
    "..............LLKPP",
    "...............LLLLPl",
    ".................LLPPll",
    "..................LLLPKPl",
    ".....................LLLPll",
    "......................LLLPPl",
    "........................LLLPPl..LL",
    ".........................LLLLPlllLL",
    "...........................LLLPPlLL",
    ".............................LLLPPLL",
    "..............................LLLLP11",
    "................................LL00KKK",
    ".................................000KKkKK",
    "................................0PPlkkkKKk",
    "..............................00lllhhkkkkkk",
    "............................00Plllh0000kkkk",
    "..........................00Pllllh000ll.kkkk",
    "........................00PPlllh0000lllhkkkk",
    ".......................0PPlllllk00hhllhhkkkkk",
    "......................00llllhh000hhxxxxx.kkkk",
    "......................0llllh00llkhhxxxxxE.kkkk",
    "......................0llllh0lllkhhxxExx..Kkkk",
    ".......................0llll00llhhhxxxxx..Kkk1",
    ".......................0llllh0lhhhhxxx1xxKKkk1",
    ".......................00lllhh0hhhhx1111KKkk1",
    "........................0lllll0hhhhh111KKKkk1",
    "........................0lllllh0khkkkkkKkkk1",
    ".........................0lllll00kkkkl.Kkk11",
    ".....................llxx0lllllh0hllllKkkk1",
    "....................llLxx00lllll00lllKKkk11",
    "...................LLLLxxNN0lllh0llllKkkk1",
    "..................lLLxKxNNN0llhh0lllllkk11",
    ".................lxLxxKKNll000000llhhll111h",
    "................LxxL0K0Kklllll00hhkkkhllhhh",
    "...............LLxxK000Kkkllllhhhkkkkhhhhh",
    "..............NLL0K1K00Kkklhlhlkkkkkkkhkk0",
    ".............NNLL0KKK0xxxxhhhlkkkkkkkkkk100",
    "............lNLN00xKK1xxxxkkkkkkkkkkk111100",
    "...........lLLNN00kKkxxKxkkkkkkkkkkkkkkk100",
    "..........lLNNNk00xxK0Kxxkkkkkkkkkkkk11110",
    ".........LLLNNNkxxxxK0Kxxkkkkkkkkkkkkkk110",
    "........LLLNNNKK0KxKKKKxkkkkkkkkkkkkkkkk10",
    ".......LLLNNLLKK0KxKKKKxkkkkkkkkkkkkk11100",
    "......lLLLNLLKKKKKxKxxxxkkkkkkkkkkkkkkkkk0",
    "......lLLNNKKKKkKxKkxxxkkkkk111kkkkkk11100",
    ".....lLL0NKKKKKKKxKkxNxkkkkkk11kkkkkk0k000",
    ".....lLK0KKKKKKKKxKxxkkkkkkkkk00000P000000",
    ".....KLK0KKKKKKKxxKxKkkkk10Kk000000P00000",
    "....hNK00KKKKKKKxKKxK1kkk10Kkkk11111kkkk0",
    "....0KK1xKKKKKKKxKKxK1kkkKKk1k11110000000",
    "...L0KNxxKKxKKKKNNKxkkkkKKK111000000x0xxx",
    "..lL0NNKKKKxKKKkNKKxkkkKKKkk1xx0xxxxxkx",
    "..LLNNN00KxxKKK1NKxxkkkKKkk11xx.xkkKKkkk",
    "..LLNNNxKKxKKkkkKK1xkkkKkkk11....kkKKKkk",
    "..LKNNNxKxxKkkkkkk1xkkkKkkk1......kkKKKkk",
    ".lKNkNNxxxxKKkkKkk1xkkKkkk11.......kkKKkkk",
    ".lKKKKKxxxxKKKKKKkxkkKKkkk1.........kkKKkkk",
    ".KNK0KxxxxxKKKKKkkkkkKkkkk1..........kkKKkkk",
    ".LLKKKxxxxxkKKKKkkkkkkkkk1...........kkkKkkk",
    ".LKKxKxxxxxkkKKkkkkkkKkk11............kkkkkkk",
    "xLKKxkNxxxNkkkKkkk11KKkk1..............kkkkkk",
    "lLK11kxkxkkkkkkkk111Kkk11...............kkkkk",
    "lK11kkx0xkkkkkkkk11KKkk1................hKkk1",
    "lK00kk00x1kNkk1k111Kkkk1................hKkk1",
    "l000Kk00111kk111111Kkkkx................hKkk1",
    "l0.xKKkxx1kkk111111Kkk1x................KKkk1",
    "l...kN1xxxxk11001k1Kkk1.................kkkk1",
    "....kk10..kk1000kkKKk11.................kkkk1",
    "....kk0...NNk00.kkKkk1..................KKkk1",
    "....kk0...hkk00.kkKkk1..................KKKKKx",
    "....kk0...hk00...KKk11..................KKkkk1",
    "...........k00...Kkk1...................kkkkk1",
    "...........k0..KKKKKk...................kkkkk1",
    "...........h0..KKKKKk...................kkkkkkK",
    "..............KKKKKKk...................kkkkkkKKKK",
    "..............KKkkkkkx..................kkkkkkkkkk1",
    "..............11111111..................00000000001"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    "1": { m: "dark", step: 1 },
    E: { pal: C.shardLight, glow: true },
    K: { m: "cloak", step: 3 },
    L: { m: "cloak", step: 4 },
    N: { pal: C.shardLight, glow: true, light: true },
    P: { m: "steel", step: 4 },
    h: { m: "steel", step: 2 },
    k: { m: "cloak", step: 2 },
    l: { m: "steel", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // A fighter's breath before the stroke: the shoulders and the raised blade lift and settle.
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the rags of the cloak stir in a wind that is not here.
    twitch: {
      frames: [8],
      patches: [
        { x: 0, y: 62, rows: ["LK.xK.....k.K", "LK.xkNx..Nk..Kk", "LK1.k.kxk", "K1.....xk", "K0.k...x1.Nk.1", "0..Kk..1..k.1", "0_.K.kx.1...1", "0..kN1x...k1.0", "...k.10_.k.10", "...k.0...k.k0._", "...k.0_.....0._", ".....0_....0._", "..........k0._", "..........k0_", "...........0_"] }
      ]
    }
  }
};
