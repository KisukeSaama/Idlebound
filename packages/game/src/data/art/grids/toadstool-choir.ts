import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Toadstool Choir (BIBLE 8.2): seven mushrooms, one song, entirely out of tune. Seven
 * toadstools of every height grow from one knot of roots, their caps warted and rust-red,
 * their pale stems bowed toward the company. Under each cap the gills glow like a throat;
 * under the gills, two small bright eyes and a mouth gaping on a note. The tallest one's
 * cap is torn.
 */
export const TOADSTOOL_CHOIR: CreatureGrid = {
  rows: [
    "...........................................ddcc",
    "........................................ddhhccc",
    ".....................................dddddhhhccc",
    "....................................ddddbdhhhccc",
    "...................................ddddbbchhhccc......bc",
    "..................................cddbbbcchccccc.....hhcc",
    ".................................cclbbbbclcccccc.ll..hhccc",
    "................................ddhhbbcccllxhhcclll..hhcccc",
    "................................cdhhccccccaacccclll..hhcccc",
    "...............................ccchhcccaacaaaacccll.hhcxxccc",
    "...............................cbcccccaaaaaaaaccllllhhaacccc",
    "...............................cbcxaccaaaaaaaccaalllhhaaccca",
    "...............................caaxaaaaaaaaaaaaaaallhaaaaccaa",
    "...............................aaaaaxaaaaaaaaaaxaaaaxaaaaccca",
    "...............................aaaaxxxaaaaxxaaaxxxxxxxxxLcccx",
    "...............................xxxxgLg.gLgxxxxLxLgLgL.LgL.cc............dx",
    ".................................xxxxg.gLgLgLgLgLgLgL.Lg..cc.........ddddlccbbb",
    ".....................................xxxxgLgLgLgLgLxxxx...cc......lldccbblccbbcc",
    ".........................................xxxLgxhhx................dddddbcccccbbbc",
    "...................xc.....................xxllxxha...............bbcdbbcccccccbbca",
    "................cdddccccbb................xEllhEha..............cbcccbccccccccbllaa",
    "..............ddbddcccllbba...............llxxhhha.............ccbcxbccccccccccccaaa",
    ".............ddbbcccccllbahhx.............hxxxhh0a.............ccxxxbcccccccccccccca",
    "............cdbbbccclcllbahhb.............hxxxxh0a.............cxxxcccccccccccccacca",
    "...........ccbbllbcclcclxxallcc...........xxxxxhha............xxxxacaaaxaccaaaaaaaaaa",
    "..........bbbbbccbbbccccxxaaccc...........xxxxxhha............bbxxaaaaxxaaaaaaaxaaaaa",
    "..........ccbbcccbbccccccccaccc...........xxxxxhha............axxaaaaxxxxaxxxxxxxxxgx",
    "..........ccbbccbbbcccccccaaacca..........xxaxxhhh.............xxxLgLgLxLgxgL...LgLgx",
    "..........bbbaacaaaccccccaaaaaaa.........llaaaahhhh..............xxgLgLgLgLgL...xxx",
    ".........aaaaaaaaaaaaaaaaaxxaaax.........hhaaahhhhh...................LgLgLgL",
    ".........aaxxaaaaaaxxaxxxxxxxxLx.........hhhaahhhaa...................xlllxhh",
    "..........xxxg..xgLgLgLgLgLg.gLx..........lhahhhhaa...................xEllEha",
    "............xx...gLgLgLgLgLg..............llhlhhhax...................llllhha",
    ".................gLgLgLgL.................llhlahhax...................lxxxhha",
    "..................xhhhhhh.................llllahhha...................lxxxhha",
    "..................xEGxEhh.................Llllhhhha...................xxxxhha",
    "..................hhhhhhh.................llllhhh0a..................lxxxxxha",
    "..................hxxhhhh.................hlllhhh0a................lllxxxxxhhh",
    "..................xxxxhhh.................hlllhhh0a................hhhhaaaahhh",
    "..................xxxxhhh.................llllhhhha..................hhaaaaha",
    "..................xxxxxlllll..............llllhhhhh..................lllhhhha........bddddddb",
    "..................xxxxxhhhha..............lllhhhhhh..................lllhhhha......dbbddddddbb",
    "...ddddddcc.......xaaxhhhh................lllhhhhha..................lllhhhha.....cccccddccllbb",
    ".dddddcddccc......laaahhha................lllhhhhha..................lllhhhha....xcccccllcchccbx",
    ".dbbdcccccaaa.....laaahhha................lllhhhhha..................lhhhhhaa....dcccbbcccabccba",
    "dcbbcccccccaaa....lglahhha................lllhhhhhhx.....bddx........lllhg0ax....dcaabbccaabbaaa",
    "dcbbbaccccccca....lllahhha................lllhhhhhha..xhcccdhbh.....lllhhh0ax....bcaaaaacaabaaaaa",
    "ccaaaaccaccacxx...lllahhhh................lhlhhhhhha.dbhcchhhbhb....lllhhaha.....aaaaxxxxxxxxxxgx",
    "cxaaaacaaaaaaxx...lllhhhhaa....ddddcc.....lhlhhhhhhxddbbchhcccbba...lllhhaha.....xx.LgLg.xLgLg.g",
    "xxxxxxxaaxxxxgx....lhlhhhhh.dbcccddccc....lhlhhhhhhxbbbbcccccccbaa.hhllhhhaa........LgLg.gLgL",
    "xx.gLgLg.gL.Lgx....hhlhhhhhhdbddcdccccc...lhlhhhhhhxbbbcccccccccbb.hhllhhhaa..........hhLx0",
    "...gLgLg.gL........hhlhhhh0bbbaacccaacbb..lhlhhhhhhbbbxaaccxxaaaaa.hhlhhh0aa.........xxhxxh",
    ".....gLg00.........lhlhhhh0ccbaacccaaaaa..lhhhhhhhhxxxxaaaaxxxaxxghhhhhhh0aa.........lElxEh",
    ".....xxxx0.........lllhhhhhccaaaccaaxaxaa.lhhhhhhhhxxxLgLxx..gLgLghhlhhhh0a........lllllllh",
    ".....ExxEllll.......hlhhhhhaaaxxaaxxxxxgx.lhhhhhhhhxa.LgLgL..gxx..lhlhhhh0a........hhhxxxhh",
    ".....xxxhhhhh.......hlhhhhhh...gLg.gLgLg..lhhhhhhhhxa...xxhghh....lllhhhhaa..........hxxxh",
    ".....xxxhhh.........lhhhhhhh...gLg.gLxxbbbllhhhhhhhaa...xxhxxl...llhhhhhhaa.........phxxxh",
    ".....xxxhhh.........lhhhhhhhhh.xxhhhhbbbbblhhhhhhhhaabblhEhhEllh.llhhhhhhaa.........paaaxh",
    ".....xxxhhhh.........hhhhhhhhhaxxxxxllbbbblhhhhhhhh0abbahhxhhhaalhlhhhhhaaa........llaaaaa",
    ".....xaahhhhh........hhhhhhhhh0hEhaEhhaaallhhhhhhh00aaaapxxxhhaalhlhhhhhaa.........llhhhaa",
    "......aahhhhhh.......hhhhhhhhh0ahxahaaaaaalhhhhhhhhxaaaapxxxhaaahhlhhhhhaaa.......hhhhhhx",
    ".......hhlhhhh....bbbhhhhh0hhh0axxxhhaaaaalhhhhhhhhxaaaapxxxhhaahhhhahhhaaaaaa...lllhhhax",
    ".......hhlhhhhh.bbbbbbhhhh0hhhhaxxxh0haaaalhhhhhhhhxaaaalaahhhahhhhhahhhaaaaaaaa.lhlaaha",
    "........hllhhhhbbbbbbahhhhhhhhhaxaxh0haaaalhhhhhhhhaaaaalhhhhh0hhhhhhhhhaaaaaaaahlhha0aa",
    "........hlhhhhhhbbaaaahhhhhhhh0hhaaaaahaaalhhhh0hhhhaaaalhhhhh0hhhhhhhhhaaaaaaalhlhh00aa",
    "........hhhaahhhhaaaaalhhhhhhh0hhhhhahhaaalhhhh0hhhhaaaalhhhhh0hhhhhhhhaaaaaxaalllhh00a",
    ".........hhhxhhhhaaaaalhhhhhhh0aahhhaahaaahhhhh0hhhhaaaalhhhhhxxhhhhhhhaaxxxxallhhhhhxa",
    "........bbhhxhhhhaaaaaahhhhhhhaaallhaahhxxhhhhhhhhhaa00allhhhhhxhhhhhhha00xxxal0hhhhhxaaa",
    "......bbbbhhhhhhhaa0000hhhhhhaaa0llhahhha0hhhhhhhhaaa00allhhhhhxhhhhhaaa000000l0hhhhaxaaaaa",
    "....bbbb00hhhhhh000xxxxxhaaaaaa00llhhhhha00hhhhaaaaaaxx0llhhhhhaaaaaaaaa00xxxxh0hhhha0000aaaa",
    "...bb0xxxxxhhhhh0........aaaa00..lhhhhhh....aaaaaaaa....hhhhhhha.aaaa00........hhaaaa..00000aaa",
    "...a000.....aaaa..................hhhaaa.....aaaa00......hhhaaa.................aaaa.......0000",
    "....................................xx....................aaaa"
  ],
  legend: {
    "0": { m: "root", step: 0 },
    E: { pal: C.moon, glow: true },
    G: { pal: C.mint, glow: true },
    L: { pal: C.mint, glow: true, light: true },
    a: { m: "cap", step: 0 },
    b: { m: "root", step: 2 },
    c: { m: "cap", step: 1 },
    d: { m: "cap", step: 2 },
    g: { m: "stem", step: 0 },
    h: { m: "pale", step: 2 },
    l: { m: "pale", step: 3 },
    p: { m: "pale", step: 4 },
    x: { pal: C.ink }
  },
  idle: {
    // They draw breath together, the caps lifting on the note.
    waist: 58,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle they hit the note together: every gill blazes and the eyes go wide.
    twitch: {
      frames: [5],
      patches: [
        { x: 3, y: 15, rows: ["................................L.L.L.L.......L.L...L", "..................................L.L.L.L.L.L.L.L...L", "......................................L.L.L.L.L", "..........................................L", "", "", "........................................E...E", "", "", "", "", "................................................................................L", "................................................................L.L...L.L.....L.L", "................................................................L.L.L.L.L", "....................................................................L.L.L", "", "..........L...L.L.L.L.L.L.L", "..............L.L.L.L.L.L...........................................E..E", "..............L.L.L.L", "", "", "................E..E", "", "", "", "", "", "", "", "", "................L.....................................................L", "", "............................................................................................L", "..................................................................................L.L...L.L.L", "..........L.......................................................................L.L.L.L", "L.L.L.L...L", "L.L.L.L", "..L.L.........................................................L", "....................................................L.....L.L.L....................E..E", "....................................L...............L.L...L", "..E..E......................L.L.L.L.L...................L", "............................L.L.L", "", "......................................................E..E", "", ".............................E..E"] }
      ]
    }
  }
};
