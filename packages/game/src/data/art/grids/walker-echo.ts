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
    "",
    ".cc",
    "..ccc",
    "...ccc",
    "....ccc",
    ".....ccc",
    "......ccc",
    ".......ccc",
    "........ccc......................cccccl",
    ".........ccl....................ccccccccl",
    "..........ccl...................chcccccccl",
    "...........ccl.................chhcccccccc",
    "............ccl...............lchcccccccccb",
    ".............ccll...........ccccchhccccccdb",
    "..............ccll......chlchhjcchcccccidddd",
    "...............ccll...cchhccjhcchhccccEdEddd",
    "................ccclcchhccccciccjccchdddddd",
    "..................cccejhccccccihhcccddddddd",
    "..................ccccccjhhhccihhccdddddddi",
    ".............lclkkbfccccchhhchhfjcdddddddd",
    "............ccjcllkkkcccbhehjhhfjjdddddddb",
    "............bjhcclllkkbbbbbjjhhheeddddddd",
    "............bjhcchkkklbbbbbhiihhejiddddd",
    "...........abjccchkkkbffebhhbdhhhiiiiiic",
    "...........bjjjjhjjjjeffffhhbbbhjjijiffc",
    "............ffejhjjeeddgffjaablccjjjjijj",
    ".............eejjjjddddgddjaacclccjjjjhhc",
    "..............bbjjddddddddjkkkcclchhjjefc",
    "..............lbjdddgdddddjjkccccchhjddgg",
    "..............cjjdddgddddeehhhhhccccjdjbb",
    "..............cjjdddddddddehhjjjfccccdjbbb",
    ".............chhdddddgdddjjjjjhhhgccccjbeb",
    ".............chhdddddggddejjhhhhhjaacccfefkk",
    "............chhdddddddedjffjhhhhjjdddcccjkkkc",
    "...........cchhdddddddeggjjhhhhhjjddddccccccc",
    "...........chhjddddddddggjjhhhjjfjdddddjbbccc",
    "..........cchhddddddddddjjjjjjjjfddddddjjjjcak",
    ".........cchcjdddeddddddjjjfjkjjfddddddjjjjhbjj",
    ".......cccchcddddeediiiggjfffggggdddddddjjfhhhjj",
    "......cccccccddddeeiijjhhffddfggggeddgddddddhhhba",
    "....ccccccccddddeeejhhhhcccjffddeeeddggdddddhhhbb",
    "...cccchhcccddgggggjhhejccjjjjjjfjjjgggddddddddgbb",
    "..hhccchhccdddgeegjjhgjcjjjhffhffdjhhddddddddddgebb",
    "...hhchccccddeeeeejjjjcchhhhjjhjjjjhhhdddddddddcaabbb",
    "..hhhhhhccdddeeeejjjjhcchhhhjjjjjjchhhjddddddddjcaabbb",
    "..hhhhhcchddiieeejdjjhcccchhjhijjjjcffcddddgddddch.abkk",
    ".hhhhh.cchdiiiegddjjjccccccfhhhjjhjbbbahddggeddddh..jjkk",
    ".hhhh..hcddiiiggddjjcccccccdhhhjjhhbbbbbjdigeeggehh.jjjb",
    "..hh..hhcddeegeeddjjcccccccdbhcjhhhabbbbagiieieeegh..jjj",
    ".hh...hhhdgeegegdjjhccccccggdcchhhhabbbbbggieijeegk...jj",
    ".hh..bbhhdgegggggjjhccccccggddhcjhggaabbcggeejjifelb...jj",
    ".hb...hhhdgiggeegjhccccccegdddhcjddbbbklcceejjjffffb...jj",
    "hbb...hhhgeiigeedjhccccceeedddjhdddebkkcccjejjjfhfffh",
    "h.....hcfgeiiieejjhcchcceeddddgggeeajkhcccjgjhffhfffhh",
    ".....hhcfeiieieehhhfghcffdddddddddeajhhjjjjgghhffb..hh",
    ".....hhheeiieiieeeehkkfffgdddddddddddjjfff.ajjhhbb...hh",
    "....hhcjaaiiefigehhhcljffggieddeedddfjjffg..jjbhb....bb",
    "....hhcj..iaaffggfhhccjjgffeeaidggihkkjifg...bbhhb",
    "....hhjk..a..hhhjfjjjjjjiife.affgghhkjjffg...b.hhb",
    "....hh.......jhhjjjjjjeeiifa..afffhhhhff.......hh",
    "...bhh......bjkkhhffggiffffa..afffhhhhjj.......hh",
    "...bh.......bhhhhfffggif.af....affjjjjjj",
    "....b.......bhhhhjff.aii.ba.....affhjjj",
    "............hhhhjjjj.aa.........jjjhfj",
    "............hhhjjjj..............jjjfj",
    "...........bjhhjjj..............bbjjfb",
    "...........bjjhjj...............bjjhhb",
    "...........jjjjj................fjjkkb",
    "..........jjjjfj................fjjkkkb",
    "..........hhhkf................cfjjjlljc",
    ".........gfffjj................cfjjjjkccl",
    ".........ggfkff................cjjjjjjcccbl",
    ".........jjfhhf.................ajdddjjcjbfb",
    ".........hjjhhj....................ddjfjhhjjk",
    "........hhfffjj......................ffjjjjjj",
    "........jffhfjj..........................jbb",
    "........jjfhfff",
    "........jjjhdffa",
    "........jjjjdfab",
    "..........bb.ba"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    a: { m: "cloak", step: 1 },
    b: { m: "cloak", step: 2 },
    c: { m: "cloak", step: 3 },
    d: { m: "dark", step: 0 },
    e: { m: "dark", step: 1 },
    f: { m: "dark", step: 2 },
    g: { m: "shadow", step: 0 },
    h: { m: "shadow", step: 4 },
    i: { m: "steel", step: 0 },
    j: { m: "steel", step: 1 },
    k: { m: "steel", step: 2 },
    l: { m: "steel", step: 3 }
  },
  idle: {
    // A fighter's breath before the stroke: the shoulders and the raised blade lift and settle.
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the blade is drawn back a little further before the stroke.
    twitch: {
      frames: [6],
      patches: [
        { x: 0, y: -1, rows: ["", ".cc", "._.cc", ".._..c", "..._..c", "...._..c", "....._..c", "......_..c", "......._..c......................cccccl", "........_..l....................c.....ccl", "........._.cl....................h......cl", ".........._.cl.................ch........c", "..........._.cl...............l..c........b", "............_.cll...........ccc.chh......d", "............._.c.l......chlchhj...c....id.dd", ".............._.c.l...cch.c.j.c.h.....EdE", "..............._.cclcchhcc..ci..jc..hdd.d.._", "................__.c.ej......cihh...d", ".....................cccjhhh.......d......i", ".............lclkkbf....c....hhfj.d......._", "............ccjcllkkk...b.e.j....j.......b", "............bjh.c.ll.kbb.bbj...hee......._", ".................hkk.l.....hii...ji....._", "...........a..c......bffe.h.bd..hi.iiiic", "...........bj.jjhjjjje..ff...bb.jj.j.ff", "..........._ffe....eeddg..jaa.lcc.j.jijj", "............_e..j..dd...dd...ccl.c...jhhc", "............._bb..d....d...kkk.cl.hh..ef", "..............l..d..g......j.c..c....ddgg", "..............cj.........eehhhhh..cc..jbb", "..............___________________________"] }
      ]
    }
  }
};
