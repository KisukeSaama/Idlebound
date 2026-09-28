import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Whispering Bramble: it whispers the names of the walkers who bled on it; yours is
 * new. Briars knotted into a low crawling beast, green canes and old brown ones twisted over
 * a hollow of dark, clawing forward on bundled cane legs, a trail of runners dragging
 * behind. Every thorn is tipped dark red. Scraps of walkers' cloaks hang caught on its back;
 * two pale berries glow deep in the knot of its head, over a maw of thorns.
 */
export const WHISPER_BRAMBLE: CreatureGrid = {
  rows: [
    "..............................................................R",
    ".........................................................R...r",
    "....................................................R....rbbbr.....rR",
    "....................................................r.bbrbbbbbbbbxxr",
    ".................................................bbbrbRbbbRbbbbbRbbbbxx",
    ".............................................RhbbbbbbbrbbaraaaaarbbbbbRx",
    "............................................hrhRhhhhhrbaaarxxxxxrxxbbrxx",
    "............................................hrhrhhhhhhhhhhhhgffgxxxxxxxx...R",
    ".........................................R.bhhhrhRhhhhRhhhhhRkfgfffffxxxx.r",
    ".........................................rbRhhhhrkkkkkrkkhhrkkffffffffffgxxx....R",
    "........................................brbrhhhhrkkkkrkhkkhrkkkxxxxfffffgggffx.r",
    ".....................................RRbbrbrhhhhhhhkhkhhkkhhkkkxx00xRxffffffggff",
    ".....................................rrbbrbbhhhhkhhkhRhkkkhkkkkkxxrr0xxxfffffgfff.rR",
    "...................R..R..R...R......brrbbaahhhhhRkhxrxxxxkkRkkkkbbbxx000xRxffffffr",
    "...................r.r..r...r.....RbbrbbbaxhhhhhrxxxrbbxxxrrhhkRkbbbbxxrr0xxxffffff",
    "................R..rxrxxrxxxrxx..aRbbbbbxxxxRxxxrxbbbbbbbbxxxxrkkbRbbbbxx00000ffxfff",
    ".................rbbbbbbbbbbbbRxrrbrbbbxxxxxrxbbbbbbaaaabbbbbrxxxrbbbbbbbxxx00xxxxfff.rR",
    "..............R.brbbRaaaRabaaaRrxxbrRxxxxxxrbbbbbbxxxxxxxxxbbbbbxrxbbbbbbbbxxxxxxxffffr",
    "..............rbbbbxrxxxrxxrRxrrbbrxxxxxxbbbbbbxxxxxkkkxxxxxxxbbbbbxaabbbbbbxxxxxxffffx",
    "............bbrbRxxxrbbrxxxrxxxrRbbxxxxxxbbbxxxxxkhhkkhkkkhhxxxxxbxxxaaaabbxxaax0xRfffxx",
    "...........bRbbbrxxbbbbbbbbRxxxrxxbbxxxxxxxxxxxhhkkhkkhkkkkhhxxxxxxx0xxxaaxxxaxxrr0ffffxx.rR",
    "..........bbrbxxrxbbbbbbbbbrbbbxxxxxxx00xxxxhhhhkkkhkkhhkkkhhhhkk000000xxxxxxxxbxxxxffffxr",
    ".........Rxbrxxxbbbbbaaaabbbrbbbbbxxx0000fffhhhkkkkhkkhhhhkhhkkkkx000000xxxxxxbbbxxxxxfffx",
    ".........rxxxxbbbbaaxxxxxaaaaabbbbxx00000xffhhkkkkhhhkkhhhkhhhkkkxx00000xxaxxbbbbbxxxxxRfxx",
    "........brbxxbbbaaxxxx00RxxxxxxbbbbxrrR00xffhhkkkkhhhhkhkkkkkkkkkxxxxxxxxxaxxxbbbbbbxrrxxxhhhhhhh",
    ".....Rbbbbbbbbb00xx0xxxxx0000xxxbbbbx0000xffhhkkkkhkkhkhhhkkkkkkkaaaaaaaxxxxxxxbbbbbb000..0kkkhhkhhhhhh",
    ".....rbbbbxxxxxxx0000PP00r00000xxbbbxxxxxxffhkkkhhhkkkkkkkkk0kkkxxxxxxxaaxaaaxxxxbbbbb00...kkkkkkRkkhRk",
    "..R.bbrbbbbPPxx00000PEEP00000000xbbbbxrrRxffh00xxhhkkkkkkkkk00kkkxxx0xxxxxxxxxxxxxbbbbbb...kkRkkxrxxkrk0.R",
    "..rbbbbbbaPEEP00xxx0PEPP0000000000bbbbxffxxfh0xxxhhkkk00kkkk000kkbax00000xxxxxx0000bbbbbxrrRxrxxRrxxrxxx.r",
    ".brbbbbbbxPEPPxxxxxxxPPxxxxx000000xbbbbxffxfxxfffhhkkkffkkkk0xxkxbax00000xxax000000xbbbbxxRxxrgfrfffffxxrxrR",
    "bbbbbbbxxxxPPgggffggfgggggff000000xxbbbxffxffxffffhk00ffkkk0ffffxbax000000xaax00000xxbbbxgrgffffrxxxfffffrxx",
    "bbbbxxxxggggggfffffffffffffff000000xbbxxxxxffxxxxxkk0xfffkk0fffxbbaxxxx000xaax000000xbbbxfrfffxxxxxxxxxxxxxxx...R",
    "bbxxggggggffffffffffffffffffffxx000xxxxxxxffxxxxxxkk0xxxxxk0fffxbbxxffxxxxxbax0000000xbbxxxxxxxkkk00kkkxxxxxaxrr",
    "bbxgggfffffffxxxxxxxxxxxxxxffffxx00xxxxxxffxx00000000000xxk0fffxbaxxfffffxxbax00000xxxxbbxxxrrRkkk0kkkk000xaaaaxx..R",
    "xxxgfffffxxxxxxxxx00000000xxfffffxx000xxffxxx000000000000000xxxxbaxxfffffxbaxxxxxxxggfxbbbbxkkkkkk00kk0000.xxaaaarr",
    "..xffffxxxxxxxxxxxxxxxx00fRrrxffffxxxxxffxxxxxxxxx000000000000xxbaxxffffxbbaxfffggggfffxbbbbkkkkkkk0kk0.xx...xxaaaa",
    "...xxxxRxxxRxxxRxxxRxxxRffbbbxxffffxxxffxxxbbbbbbxxxxxx00000000xbaxxxxxxxbaxxffxxxffffxxxbbbkkkkkkk0kkk........xxaaxx..R",
    ".....xxxxxxxxxxxxxxxxxxxxxbbbbxxfffxxfffxxaaabbbbbbbbbbxxxx0000xbxx000xxxaaxxfxxxxxxxxxxxbbbkkkkk0kkk00.........xxaaarr",
    "......xxxxxxxxxxxxxxxaxxxxbbxxxxxxxxxffxxaaaaaaaababbbbbbbbxxxxbbxx000xxxxxxxxffffxxxxbbxxbbbRkkk0kkk00...........aaaaa",
    ".......xxxaaxxxxxxxxaaRrxxxxxbbbxxxxxffxx00000aaaaaaaaaabbbbbxxbax000xbbbbx00xfffffxxbRxxxbaarkk00.kk00............xxaaxx",
    ".......xxxxaaaaaaaaaaxxrxxbbbbxxxxxxxfxxxxxxxxxxxxx000aaaaaaaxxbaxxxxxbbbbax0xxffffxxraxxxxar0k00xxxk0.R.............aaaxx",
    ".....bbbxxxxxxaaaxxxxxbbbbaaxxxxffxxxxx000000000xxxxxxxxaaaaaaxbxxbbxxbbbbarrRxxffffxrxxxxfxxx00xfffkkrx..............xxxx",
    ".....bbbbrbbxrxxxrbbbrbbb0axxxgfffxxxx00000000000000000xxxx000xxxxabxxbbbbbxxbbxfffffxxaaxffff00xxfffkffff.............xx",
    ".....xbabbbbbbbbbbbkkhh000hhxggffxxx0000000000000000000000xxxxx00aaaxxbbbbbxxaaaxffffxxaaxxxxxxxxxxffxfffffxx",
    ".....xaaaaaaaaaaaa00k0k000kk0gffxx..x0xx0000000000000000000000xxxx00xxxbbbbbxx00xxffffxaaxx........xxxxffffffff",
    "......xxxxxxxxxRxxx000kk00kk0fffx...xaaxxx........0000000000000000xxxxxxbbbbaxxxxxxffffxaax...........xxxxxffffxx...R",
    "...............xrxbb00k000000ffxx..aaaa0xx..................00000000000xbbbbaxrrRxxxfffxxa0x.............xxxffffff.r",
    "..............bbbbbb00000k000fxx...aaaa0x...............................xbbbbaxaaaaxfffxxa0x................xxffffrf",
    ".............bbbbbb000k00k000fx...aaaa0x................................xbbbbaxxaaaaxfffxaa0x.................ffffffxx",
    "............bbbbbaa000k000000xx...aaa00x.................................xbbbaxxxxxxxfffxaa0xxaa...............xxffffxx",
    ".......R..bbbbbbaaxx.000xgf00x...aaa0xx..................................xbbbaarrR.xxfffxaaa0xaaaaa..............xxfffff...R",
    "........rrbbbbaaxxx...00xgfxx...aaaa0x....................................xbbaax.....fffxxaa0xaaaaaaxx.............xxfffxrr",
    "........bbbbbaaxx.....00fffxx..aaaa00x....................................xbbbax.....xffxxaaaxxxxaaaaaaxx............ffffff",
    ".......bbbbbxxxx......ffffxx..aaaa000.....................................xbbbax.....xfffxxaaxx.xxxxxaaaaaaa..........xxffff",
    "...Rrrbbbbaaxx.......ffffxx.bbaaa000.......................................aabax.....xfffxaaaxx....xxxxaaaaaaaa........xxfffxx",
    "....aabbbxxxx.......aafffx.aaaa00xx........................................xaaaa......ffaa.xaa0x......xxxxxaaaaaaa.......ffffxxr",
    "....aaabbxx.........aaafx.aaa00xx..........................................xaaaaxrr...xfaa.xaa0x.........xxxxaaaaa0x......xxfffx",
    "....aaaxxx..........aaxxx.xa00xx...........................................aaaaax..R..xfaaaxxa0x.............xxxx00x........fffx",
    "....aaxxx...........xxxx..xxxx..............................................aaxx......xxxx..xxxx.................xx..........xx",
    ".....xx......................................................................xx"
  ],
  legend: {
    "0": { m: "cane", step: 0 },
    E: { pal: C.moon, glow: true },
    P: { pal: C.pale, glow: true },
    R: { m: "thorn", step: 2 },
    a: { m: "cane", step: 1 },
    b: { m: "cane", step: 2 },
    f: { m: "green", step: 1 },
    g: { m: "green", step: 2 },
    h: { m: "cloth", step: 3 },
    k: { m: "cloth", step: 2 },
    r: { m: "thorn", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // A creeping breath: the knot of the back swells and settles like something listening.
    waist: 50,
    breath: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    // Once in a cycle, the head darts forward: a whisper, a name.
    twitch: {
      frames: [9],
      patches: [
        { x: -1, y: 13, rows: ["...................R_.R_.R_", "...................r_r_.r_..r", "................R_.rxrx.rx..r", ".................rb", "..............R_brb.Ra..Raba", "..............rb...xrx..rx.rR", "............b.rbRx..rb.rx..rx", "...........bRb..rx.b.......Rx", "..........b.rbx.rxb........rb", ".........Rxbrx..b....a...b..r", ".........rx...b...a.x....a", "........brbx.b..a.x...0.Rx", ".....Rb........0.x.0x....0", ".....rb...x......0...P.0.r0", "..R_b.rb...P.x.0....PE.P0", "..rb.....aPE.P0.x..0PEP.0", ".brb.....xPEP.x......P.x....0", "b......x...P.g..f.g.fg....f.0", "b...x...g.....f", "b.x.g.....f", "b.xg..f......x.............f", "x..gf....x........0.......x.f", "..xf...x...............0.fRr", "...x...Rx..Rx..Rx..Rx..Rf.b", ".....x....................b", "......x..............ax...b.x", ".......x..a.x.......a.Rrx", ".......x...a.........x.rx.b", ".....b..x.....a..x....b...a.x", ".....b...rb.xrx..rb..rb..0ax", ".....xbab..........k.h.0..h.x", ".....xa...........0.k0k0..k.0", "......x........Rx..0..k.0.k.0", "...............xrxb.0.k0", "..............b.....0....k0", ".............b.....0..k0.k0", "............b....a.0..k0", ".......R_.b.....a.x._0..xgf0"] }
      ]
    }
  }
};
