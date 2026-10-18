import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Carrion Crow (BIBLE 8.1): the crows of the Hearthfields, grown fat on a harvest no one
 * brought in. Mantled over a sheaf it has dragged down, the head low on a shaggy neck and
 * the long hooked beak open at the company; both wings raised and spread over its back like
 * a cloak, the primaries splayed into ragged fingers. A gold eye under a hard brow, talons
 * hooked into the wheat.
 */
export const CARRION_CROW: CreatureGrid = {
  rows: [
    "",
    "......................................................................................hhh",
    ".......cd...........................................................................dahh",
    ".......hhddd.....................................................................dddaac",
    "...c.....haddd.................................................................dccaaa........da",
    "...chhd...caacddd............................................................dchhaaa.....ccccaa",
    ".....hhhcc..hahhcdcd...................................................d..ddhcaaah...cchhhhaaa",
    "...hh.dhaahhhddhaaaaddd..............................................ccccdhhhaaadhhhhhhhaaaaa",
    "...haaahhaaaaahdaaaaadddd..........................................ddhhahhaaaaaaahhhhhhaaaa",
    "....aaaaaaaahhhhaaaaaacddddd....................................ddddhhaaaaaaaaahhhaaaaaaa",
    "......haaahaaahhaahhaaaadddddd...............................ddddddghaaahhhhaaahhhaaacac.cccccaa",
    "...hahhhcahhhhaaahhhhhaaacdddcdd............................ddddcchaaaaaahhhaaaaaaaaaahhhhhhaaaa",
    "...ahhhhhaaaahhaaaaaaaaaaaadddcdd...........................dddhhhhaaaaaacaaahhhchhhhhahaaaaaaa",
    ".....hhhhahhaaaaaahhhhaaaaaadcccdd.........................ddhhhhcaaahhhaaahhhhccahhaaaaaaaa",
    ".......hhaaaaaaaahhhaahaaaaaadcchdd.......................ddchcchccaaahhaaaaaaaaaaaaaaaaa",
    ".....dchaaahhhhhhaaaahhaaaaaaacdhhdd.....................dchchcaaaaaaaaaaahcaaaahhaaaaaaahhca",
    "....aaaaaahhahaaahhaaaaaaaaaaacdhhhccd......d...........dchhchaaaaahhaaaahhhhaahhhhhahhaaaaaaaa",
    ".....aaaaaaaaahhhhhhaaaaaaaaaaccchhhdc.ddd.dddcdddd....dccccdgaahhaahhaaaaahhaaahhahhaaaaaaaaaa",
    "........daaaahhhaahhhhhaaaaaaadccdcdhhddchddddchbagg.ddhhdcaagaahcaaaaahhaaaaaaaaaaaaaaaaaa",
    "........caaahhhaahhhhaahaaaacgdcddddcddccdddddhhhcccddchhhaaaaaaaaaaaaahhhhaaaaaaaaaaaaaa",
    "..........daaaaaahhhhahhaaacdddddcdddddddcddchddhhhddccccggaacgaaahhaahaahhaaaahhhaaaaaaahh",
    ".........aaaccaaahhhahaaaacddddddcdddcddcdddcddhhhdcccccaggaaagaaaaaaahaaahaaaahhhhaaaaaaaaah",
    ".........acd.aaaaaaaahaaacdcddddddddccdddddccdahhhhcccaaaaaaaaaaaaaaaahaahaaahaaaahhaaahhaaaa",
    "............aaaaahaaaaacdddchhddddddcccdcdddccahhccaaaaaaahhaaaggaaaaaahahhaahhaaahaaaah",
    "............aaaachaaaaddddccchhcdddcdcccdddccaahhccaacachaghaaaaaaaahahhhahchhhhaaaaaaaah",
    "............aahh..aacdddddcddhaaddddcccddccdcaadcaddaacahagaaaaaaaaahhaahaachhhhaaaaaaaahh",
    "..............h...acddddddcdhhaacddddddddddicaccccaaaaaaaaaaaaaaaaaaahaaaaahhhhhaahha.hhhh",
    ".................hhddcddddcchhaaddddddddcaaaaacdaccaaaaaaaaaaaaaaaaaahhaaaaahhhaaa.haa",
    ".................cchhccdddaaaccahdddccccicccaaaacaacaaaaaaaaaaaaaacaaahhaaaaahhaggh..c",
    ".................dchhcdddaaaaddhhddddcccicdccaaaaaaaaaaaaaaaaaaaaahhaahhhaaaahaaahh",
    ".................cdhhccdjEaacdddacdddddcccccchdchhhahaaaaaaaaaaaaaahaaahhaaaacaaahh",
    ".................dedaccdjEacddcdccdddcccaddaahccdhhhhaaaaaaaaaaaaaahhaahgaaaa..aaa",
    "................deeddacgahdddddhaccdddccdccaahddcccchhhaaaaaaaaaaaahhaahgaaaa...aa",
    "...............deedgdddddhhddchhgcccddcaaddaaacddccccaaaaaaaaaadaaaahhahha......ca",
    "..............deeeddedddcacccadhgcddgcdcaajcaaaccdchaaaaaaaaaaahhaa.hhhhhd.......d",
    ".............deeeeeddddaacdcccccacddicciaaadhaacddchdchaaaaaaaaah....h...d",
    "............deeeeddddhhaadccccccccddihaacaadhaaachchddhaaaaaaaaaaa",
    "............deeedddddhhcddaaaachcccdchaaaaadhhaaahhhhhhaaaaaaaaaaaa",
    "...........deeedddd..hhddcaaaaaccchcahhaaaaajhaaaaahhhhhaaaaaahhhaa",
    "...........eeeeddd..dgcddccaaahccchcaacaaaaajaaaaaaaachhaaahhhahhhhc.j",
    "..........deeddd....dhddd.ddhchacdccaacaaaacjaaaaaaaaaaaaaaaaaahhhhhjj",
    "..........deedd.....ccdd...ddchacdaccaahaaagjhhaaaaaaaaaaaaaaaaahhhhhhkk",
    "..........eedd......cdd......cdchdaccahhhggggghhaaaaaaaaaaaaaaaaaaaahhh",
    "..........edd.......cd.........jjd.dcacaagaaggaaaaaaaaaaaaaaaaaaaaaaagga",
    ".........ded........dd..........jj..d..aaaaacaaaaaaaahccccchaaaaaaaaggaaj",
    "..........d.........d............j.....aaaaaaaaaaaaaahccchhhhaaaaaaaachha",
    "...................j.............jj.....aaaaaaaaaaaaaccdcdhhhaaaaaaaaaaccah",
    "..................................jj...haaaaaaaadaaaaaaaachhaaahhaaaaaaaaaaacc",
    ".............................kk.kkk.j.hhhhgaaaaa..daaaaaachhaaaahhhhaaaaaaaaaccd",
    ".......................kk..jjjjjjkkjjjhhhhgaadajjjcdcaaaahhaaaaahhhaaaaaaaaaaaaaccc",
    "........................kkjjjjjjjjhhhjjjjhjjjjjjjddcdajjaaaaaaaahhaaaaaaaaahhaaaaacccc",
    ".....................f.kkkjjjchcchjhjjjjjjjjjjjhddhajjjjjaaaaaajhhggaaaaaaaaachaaaaacc",
    "...................kkkkkkkkjjahjjjjjjjjjjjjjjjhddcjjjjjjjjjadajffhggaaaaaahhaahhaahh",
    "..................kkkkkjjjjjjjkkkjjjjjjhjjjjhhddccchajajajjhdcjkkfecaaahaaahhaaahhaaa",
    ".................klkjjkjjjkkkkkkjjjjjkkkkjjdchddccdcjjajjjjhdhjjjjjjjaahhcaaacaaaaaaaa",
    "................kkkkkkjjjkklkkkjjkkkjjjjddcdadcccjjjjjjjjjjhdhj..jj.jj...d...ccaaaahhh",
    "................klkjjjjjjkkjjjjkkkkkkjjjcccaccjcdjjjjajjjjddd..................cddahhh",
    "................jjjjjjjjjakkkjjkkkkkkjjhajjadcjhdjjjjjjjjeddc......................hh",
    "..............kkjjjjjjjjjkkjkjkkjjkkkjjjjkjjdjjjhjjjjjjj.dcdd",
    "............kkkjjjjjjjjkkkkjkkkjjlkkkjjjjkkjckkkhjjjj..j.ccdd",
    ".........kjkkkkkjjjkkkkkkkkkkkkjkkkkkjjkkkjjjkkkjjjdchdccdhdcd",
    "......kkkkkkkkkjjkkkkkkkkkkkkkjjklkjjjkklkjjjkkkj..dhhhcchhhhdccc",
    "....kkkkkjkklkjjjjklkkkjjkkkkjjjkjjjjjkkkjjjjjkkk.dhhdcccadcccccc",
    "...kkkjjjjkkkjjjjkkkkjjjkkkjjjjjjjjjjkkljjjjejklk.d.dcc..hcc...cd",
    ".........kkk...jkkkkjjjklkjjjjjjjjjjjlljjj....kkkk.......hd",
    "..............kkkkkkj.kkk.jjkkk.j..jjljjjj...............dd",
    "..............kkk.........kk......kkjjj",
    ".....................................j"
  ],
  legend: {
    E: { pal: C.goldLight, glow: true },
    a: { m: "feather", step: 0 },
    b: { m: "feather", step: 1 },
    c: { m: "feather", step: 2 },
    d: { m: "feather", step: 3 },
    e: { m: "horn", step: 2 },
    f: { m: "horn", step: 3 },
    g: { m: "shadow", step: 0 },
    h: { m: "shadow", step: 2 },
    i: { m: "shadow", step: 4 },
    j: { m: "straw", step: 0 },
    k: { m: "straw", step: 1 },
    l: { m: "straw", step: 2 }
  },
  idle: {
    // The hunch rising and falling: a bird breathing hard over its find.
    waist: 42,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the raised wing shivers.
    twitch: {
      frames: [7],
      patches: [
        { x: 60, y: -1, rows: ["", "...........................hhh", ".........................da", "......................dd..ac", "....................dcca.._.......da", "..................dchh........cccc.a", "............d..ddh.aa.h_..cchhhha", "..........cccc.h.h...dhhhhh..aa", "........ddhhah.aa...aa.........._", ".....dd.....aa......h..aaaa..._", "..dd....g....hhhh..a..h...c.c.cccccaa", ".....ccha...aa..h..aaa...a.hhhhhha..a", "_...hh.h.....aca..hhhchhhh.a.aaa", "_.h...c...hhha..h....ca..a.a.....__", "_c.cchcc.aa.h..aaaaaa.aa......__", "_ch.aaa...aa...hc....hh......ahhca", "_ch.....hh.....hhh....hhh.hh.aaa.aaa", "_dg..hhaahh..aaa.h.aa..ah.a........a", "_ag.a.c.aa..hh.aa...aa.aa.......___", "_a..aa.....a.hhh.............._", "_.cg...hh...aa.h....hhh......ahh", "_aag..aa..ah.aah...a..hh.....aaaah", "_.a.......ah......haaaahh...hh..aa", "_...gg....a.hahh.ahh..a....a.____", "_..aa....h..h.ahc..hh.a....aah", "_.......ah.aahaac...h.......ahh", "_.......aah.a..a....h..hh._h..h", "_........ahh...aa.....a_haa___", "_......c.aahh...aa.h.gg.__c", "_.....ahh.a.hh...a..aa.h._", "_______________________"] }
      ]
    }
  }
};
