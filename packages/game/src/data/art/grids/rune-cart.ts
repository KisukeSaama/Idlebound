import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Haunted Cart (BIBLE 8.3): it still runs the line to the surface, and the line ends
 * in rock now. A miner's cart of rotten planks and iron bands, heaped with shards, pitched
 * forward on a buckled wheel over a stub of broken rail. Runes glow along its planks; the
 * front plank has split into a maw lined with crystal teeth, two rune eyes burning above.
 */
export const RUNE_CART: CreatureGrid = {
  rows: [
    ".................................................ff",
    ".................................................baf.ff.fffffaa",
    "................................................eafffbaffeffabff......fbe",
    "................................................eeeebbfaeeefffdf....ebbbf",
    "...........................................aaeffbeebbbfffddfaedffbfefbbbf",
    "......................................f...feeabbfeddffeffeddaaeefbbefffae",
    ".....................................fbbaffeceddfecedeeeeeeeeeeebbeeeeffe",
    ".....................................ffffbbbaedceeeedceeebaaeedeffeeeaeeee.ffaaa",
    ".....................................fffbbbaeececffbbaeeeeaaecdeeeedfbfecebffafa",
    "................................fbfeeeebbbeeeeebeefebaaeceeeeceeefddeefecebdeefff",
    "...............................ebbbeecjjjeeeeeeebbbeeaffceeeccebafeeeeeeeeeedefff",
    "...............................ebbffedijeeeeeedbbbbeceehcdghhhcffeeeeehheeeeddfffeea",
    ".....................daba...ebdcceeeffceeeedbfdiiefecchhiiiihdceeeeehhhbeeddcdeedeeee",
    "..................fffdddidcdeedcccddidcccccddfjjjbbaeiiiihhhhdceeeeeiiheeehhcceedeeeeedcffe",
    ".................ddddcdiiiihiiiiiiiiiijjjjjjhiijjeeeehhheehhddceeeeehhhcchhhcdeedeceeecceee",
    ".................deddccddddhhhhhhiiiiiiiiiiihiiieeeeedhheehhhhceddeeijhddehhcdeddedeeecceee",
    "..................ehhccccdhhhhhhhhiiiiiiiiiihiiieeeeedhhhhhhhhceeeeeijihhehhcdeedddddeccdee",
    "..................echcccgghhhhhhiiiiiijjiiiigihheeeeediihhhhhhcefeeeijihhhhecdeedehhdccddd",
    "...................eeccddhhgghhhiiiijjjiiiiiihiieeeefhhhhhhhhdcefaeejNjhhhhecdeedehhhdcdee",
    "...................eehcccccgccchhhhhiiihiijiihjiifecfdhhihhhhdcdfaediNhccccccdeeddijhdceee",
    "...................eehccchhgghhhhhhiiihhhihiihjiifeeedeeiihhcccdffedijiihhhhcdeeddiihcceee",
    "...................eehccgghgggiiiiiijihhgghhihiiieefaeeecchhhhccffediiihhhhcceeeddjjhdceee",
    "....................ehicdgciiggiiiiiihjjhcccihiiidfffechhiihhhccfefdhhihhiicceeedijNhdcee",
    "....................dhigdhhijigiiiiiijjicccciiijidfffddhhjjhhhccfefdhhhhhheeceeedhjjhccee",
    "....................dhiihhhhjjhhhiiiijiicccciihjigffafchhjjiihccfefchhhhhhhcceeedhiihccee",
    ".....................hiichhjEEhhhhiijiEEiggciihjiiefafchijNihhccfffcehhhddccceeecchccccee",
    ".....................hiigiiijjggiiijijkjihgcjjijjiefaeddijjNhhcceefccchhhhhhceeedhhhccce",
    ".....................cihgiiiigggiiijiijiihggiiiijieffeddiiiihccceefceehhiihhceeediijccde",
    "......................hhhgiiiggiiiijjiiihhhijjiiiidfeedddcccgidceefdeeehjjhhceeedijjdcdd",
    "......................dhhcghiiiiiiiijjihhhijjjihiiifeeechhiiiidceefdhhhhjjhhceeedhjhdcdd",
    "......................dhhcghiiiigcghhhhijjjijiihiihfeeechhjijhgceeedhhhhjNhhceeecgjgccdd",
    "......................dhhcghijjjiiiihiiiiihhgccchhheeeecehjjjhgcfeedhhhhihccceeedhjhccedf",
    ".....................eehhcchhjijiiiiijiijjjjijiihhieeeedeijjiiccfeeccchhijheceeedijjccedf",
    ".....................eddhccghjjkiiiiijjjjjjjjiiihiideeeddijjihccfeecehhhijheceeddijcccecf",
    ".....................dddhccciijjiiiiiiiijjjjjiiigiideeeddhijihccfeechhhhhhhdceedddeccddce",
    "......................dddcccccggghhiiiiiijkkjjiigiidejbdhhijiiccfeeceehhhhhdceeddeeccdccc",
    ".......................ddcccccghhhhggcgiiijjNiiiiiigeebbdhjjjihceeecddhhhdddceeceedccdd",
    ".......................giiiiiiiiiihhhiiiiiiiihhhhihgecdfdhhjjhhceeechheeeeedcecdeddccde",
    ".....................ijjiiijjjjjiiiihhiiiijjjjjihhhhecddchhiihhceeedeeeeeeddceeddggccee",
    "....................ddcciiiijjjjijjiihhhiiiiiiiihhiheccdchhhhhhceeededddddddceeddggccdd",
    "....................ddccccgggcijjjiiihchhhiiiiijbhiheecedhhhhhcceeecdddddddcceedccc",
    ".....................deeiggggccchhhhhccchiijjiieeciieeeedcchhhcceeecdddddddcccccccdeeee",
    "......................bbbagffcccccgggddcciijjiiihciidecedchhhhcceeecddccccccccccdddeccd",
    "......................bbbabbbfbbecgggggcciijjiiiihhidfdeddhhhhcceecccccccccccccddccddcd",
    "......................bbbebbbcbbedabgggcchhiiiiigghidfdeddhhggccccccccccccccccdcccccdd",
    "......................fffbfbbebbedbbfcgccchhhiiiighidfeedcccccccccccccccccicccdccecccd",
    ".......................bbfcbbbbdbbabcccccccccgigcchideccccccccccccccdccccccccdcccccccd",
    ".......................ebbccbbbgfbageeeccciiiccccccccccccccccccccccedccccccccdcccdddcd",
    "....................fbbeefccebbggafgeeegciiiiccccccccddddcccccdceccddcccccccceccccddcd",
    "....................bbbaggcccggggggbbehggiiigcccccccedcdeeccccddcccdd.....cccecccccccd",
    "....................bbbagcccggggggebbfhciiiicccccccddcccceecccdccccc......cccecccccccd..........eeeed",
    ".....................ffeeccgggggggebbfcciihdcccciiedccccccecccccc.........cccecccccccdd......eeeeeccd",
    "......................eiiiihhhhhiieaaecciihdjiciiieccccceccccccc..........cccccccccccdddceeffeddccccd",
    "......................giijiiiihbiieecccciicciccihieccccccccdccccccddd......cccdccccdcdddffedcccddccc",
    ".......................gijjiiiibiiicccciiiccccchhecccddecccdcccccccccdddddecccddccddceeccccdccddd",
    ".......................ciiiihhiiiigghcchhcccccdddecccceeeccdcccccccccccccccccccddcccccccddddcccdd",
    "...................effeeihiiiiiihgighcccccccccdddecdcceddccdcccccccccccccccccccccccccccccd",
    "..............iiieeeecccihiiiccghhicccdddcccccccdeddccccccccccccccddcefccceeeccccdddcccdd",
    ".........iiiiiiiidcccccccccccccghiiccccddddcccccdedccccccceccccccccccceeeeccccddddd..cdd",
    "....eeiijjiiiiidddcccccccccccccchicccccccccccccccecccccccddcccccccceeeedccccccdd",
    "ddiijbjjiidddddddccccccccccccccccicccccccccccccccecccccccecceecceeeccccddecccddd",
    "ddiiiiggdddddddddcccciiiiddccccccccccccccccccccccddccccceccceeeedccccceddd.ddd",
    "dcggdddgcccdddccccccciiiiiigccccccccccccccccccccccddccdddcceedccdcccdcc",
    "ddggdddgcghhhcccciiiigcghiiihhgicccccccccccccccccccdddddcccccddccccddd",
    "..gccddccgccccccccgiiiiihhhiiiiiiihccccccceccccccccccccccccceddcccdd",
    ".........ccc......ddhhhiiihhciiihhhihhhhhhheeciieeccccccdddd",
    "....................hhhhhihighiiiiiiiiiiiihbbaccccccccccdd",
    ".......................ccchijjiiiiiiijiiiicddcccdddccccddd",
    ".....................hiiciiiiiiiijkjiicccdccddedcc.ccccd",
    "....................dhhhchggiiijjidddccccdccdddd",
    "....................dcccchggggidddddcccccdhhc",
    "........................cgggggdeddddcccccddhc",
    "..........................ccgddeccd....ccd",
    ".............................ddd"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    N: { pal: C.shard, glow: true, light: true },
    a: { m: "glass", step: 1 },
    b: { m: "glass", step: 2 },
    c: { m: "iron", step: 0 },
    d: { m: "iron", step: 1 },
    e: { m: "iron", step: 2 },
    f: { m: "iron", step: 3 },
    g: { m: "wood", step: 0 },
    h: { m: "wood", step: 1 },
    i: { m: "wood", step: 2 },
    j: { m: "wood", step: 3 },
    k: { m: "wood", step: 4 }
  },
  idle: {
    // The cart rocks on its buckled wheel, the whole box rising and settling.
    waist: 59,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the split plank snaps its crystal teeth.
    twitch: {
      frames: [5],
      patches: [
        { x: 18, y: 30, rows: ["....__________________", "...........iiigcgh.hh", "..._d...g.i.j.....hi", "....eh...h..ij......ii", "...e.....ghj.k.....jjj", "...d..h...iijjiii", "....d........gg..iiii", ".....ddcccccghhh.ggcg", "...__g...iiiii..hh.i", ".._ijj...j.....ii.h.ii", "......iiiijjj.i.j...h", "..d.cccc....ijjjiiih.h", "...deeig.gg...hhhhhcc", "........gffcccc....dd", ".......a...f...cgg", "....bbbeb..c....a.gg", "....fffbf..e.bedb.f.g", ".....b.f.b...db..bccc", "..___.bb..b...fba....c", "..f..eef..ebb..afge.e", ".......g..c.....g..e.g", "..bbbag..c..........h", "...ffeeccggggggg.bbf"] }
      ]
    }
  }
};
