import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Grove Spinner (BIBLE 8.2): the forest remembers every walker who crossed it and grows
 * thorns where they bled; this is what spins them. A spider as big as a cart, the head
 * reared up and the front legs raised to strike, claws of bone at their tips; eight eyes of
 * cold light over curled fangs. Its abdomen is a bark-plated sac, a chevron down its back,
 * moss and thorns along the ridge, and pale threads trail from it to the ground.
 */
export const GROVE_SPINNER: CreatureGrid = {
  rows: [
    "..........................bb",
    ".......................bbbbbb",
    "..................bbbbbbbbbbb",
    "..............bbbbbbbbbbaxxbb",
    ".............abbbbcdaaaaabbbbb",
    "............xabcddcdc.....bbbb",
    "..........xdddcccdccc.....bbbb....................................................bb",
    "......cccccaaccbbbbbbb....bbbbb..................................................bbbb",
    "......cccccaaaabbccbbb.....bbbbccc..............................................bbbbb",
    ".....haaaxa.......ccccc....bbbbcccb............................................bbbbbaa",
    ".....cb.xx.........cccc....bbbbbbbb.......................bb..................bbbbbbaa",
    "....dcttx..........ccccc....bbbbxxx......................bbbb................bbbbbbbbbb",
    "....dttt............cccc....bbbbbxxa.....................bbbb...............bbbbbb.bbbb",
    "...ddttt............ccccc...bbbbbbba....................bbbxaa.............bbbbaa..bbbba",
    "..cc.tt.............ddcccc..bbbbbbbb....................bbbxba............bbbbaa....bbca",
    "..cc...............ddccccc...bbbbbbba...................bbbbbb...........bbbbabb.....bcbb",
    ".da................cccccccc..bbbbbbba..................bbbbbbbb.........bbbbbab......bcbb",
    "tt.................xxbxcccc..bbbabbbb..................bbbbbbbb........bbbbbaac......cbbbb",
    "tt................cccbxccccc.bbbabbbba................bbbccbbbba......bbbbbba.cx.....cbbbb....c",
    "tt................ccccccccccbbbbbbbbba................bbccc.bbba.....bbbbbbb.ccb..gggcGGbbb...bb",
    "t................dcccccccccccbbabbbbba...............bbcccc.bbbb....bbbbGGGg.cbbGGgggGGGbbb..cbb",
    ".................dccb.cccccccbbabbbbbbb..............bbbxxb..bbba...bbbgggggGGGbddddddddddddddbb.GG",
    ".................ccbb..cccccccbbbbbbbbb..............bccbbb..bbba..bbbddcgggGdGddGggggggGGGGggddGGG",
    "................cccb...ccccccbbbddddddddddd.........bbccccb...bbbbbbbGdcc..ddddggGgGggGGgggggbbGdddd",
    "................cccb....cccccbddddddcdddccddd.......bcccccb...bbbbbbGGgccddddggggggGGggggggggGGGggGddcb",
    "................ccb......cccccddxccccccccccccdd....bbcccccb....bbbbbcggcdddggggggggggggggggGGGGGGgGggbb",
    "...............cccb......ccccdddExxxcccccccccccdd..bbcccccc....bbbbbcccddccgggggaagggggggggGGGGGGgggbbb",
    "...............ccca.......ccEddcxEEExEcccccccccccddbccccccc...bbbbbcccddcccggggaaacccccccggGGgggggggbbbb",
    "...............ccb........ccEEEccWWWxcccccccccccccdddcccccc..bbbbccccccccccggcccGGgcccccccgggggggggcbaabb",
    "..............xacb........bdWWWccEEExxcccccccccccccddccccccbbbbbccccdcggccccccccgggcccccccgggcgggcccbaabbb",
    "..............caa.........bcEEEcccxxxccccccacccccccdcccbccbbbbbbccccdccgcccccccccccccccbbbccccccccbbbbaaab",
    "..............ccb.........bEccccccxxEccccaaabcccccdcccbbcccbbbccccccccccccccbccbbccccbbbbcccccbbbbbbbbbbabb",
    ".............cccx........bbcccccEaaccccccccbbcccccdcccc.cccbbbccccccccccccccbcccbcbbcbbbbcbcccbbabbbbbbbbbb",
    ".............ccb.........bbddcccccacccccccccbcccbbdcccc.bcabbccccccdccccaacbbccbbbbbccbbbbbbccbbaabbbbbbbbaa",
    ".............cbb.........bbddbbcccaccccccbbbbcbbbbccccbbbaabccccccddcccaaaaaabbbbbbbbcbbbbbbbccbbabbbbbbbbaa",
    "............ddb..........ba.dcccccccccbcbbbbbcbbbbcccbbcccccccccc.dccccaaaaaabbbbbbbbbccbbbbbbcbbbbbbbbbbaaa",
    "............dbb.........bba.dcccccccccbbbbbbbbbbcccccbbacccccccaa.dbbbaaaaaacccbbbbbbbccbbbbbbbcbbbbbbbbbaaa",
    "...........ddb..........bba.dddccccccccbbaaabbbbcccccbbacccccccaa.dbbbabaaabcaccbbbbbccbbbbbbbbccbbbbbaaaaaa",
    "...........dbb..........bb...dcccbacccccbbbbbbbbccccbaaadcccccaaa.dbbbabbccbbaaabbbbbcbbbbbbbbbbcbbbbaaaacccc",
    "...........cbb..........aa..ddccbbacccccbbbbbbbbccccbxxxdccccaaaa.ddbbbbbcbbbbccbbbbccbbbbbbbbbccbbaaaaaccccbb",
    "..........dcb..........bba..dddcbbaccccccbaaabbdccccxxxxccccaaaa...dbbbbbbbbbbccbbbccbbbbbbbbbbcbbaaaaaaccbbbb",
    "..........dcb..........bba..cccbbbbbcccccbaaaaadcccca.cccccbaaa....dbbbbbbbbbbbcccbccbbbbbbbbbcbaaaaaaaabbbbsb",
    "..........cc...........ba..ccccbbbbbbcccaaaaaacccccb.ccccccbaa......cbbbbbbaaaaccabcbbbbbbbbbccbaaaaaaaaaxaaass",
    "..........aa...........ba..cccbb.bbbbbbbxxaxaxcccccbccccccbb........cbbbbbbaaaaaaaaabaabbbaaccaaaaaaaaaxxx....sss",
    ".........ccb...........ba..cccb..bbbbbxxxxxxxxcccccbcccccbbc.........caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaxxx.....s..ss",
    ".........cb...........bba.cccca..bbbbb.........cccc.ccccbbcc..........aaaaaaaaaaaabbaaaaaaaaaaaaaaaxxxxx.......s...ss",
    ".........cb...........bb..cccc...bbbb................bbbb.cc...........aaaaaaaaaaaccaaaaaaaaaaaaaaxxxxx........s.....ss",
    ".........cb...........ba..cccc...bbbb.....................aa............aaaaaaaaaaccaaaaaaaaaaaxxxxxxx..........s......s",
    "........cbb...........ba...ccc...bbbb....................ccb............xxaaaxaaaacccaaaaaaxxxxxxxxxxx..........s......s",
    "........cb............ba...cccb...bbb....................ccx............xxccaxxxxxxcccxxxxxxxxxxxxx.xa...........s.....s",
    "........cb............b.....cct...bbbb...................cb.............xx...xxxxxxxccxxxxxgxxxxx....a...........s.....s",
    "........cb...........ba......tt....bbt...................cb..............b......xxxxaaagggggxx.......ba...........c.....s",
    "........b............ba......tt.....bt...................cb..............ba.....G...hcc..gGGg...GG...ba...........s.....s",
    ".......db............ba.............xt...................cb..............ba..........cc...xg....gg...ba............s....s",
    ".......db............b..................................cc...............ba..........ccc..............a............s....s",
    ".......db............b..................................cb................b...........cc..............b............s....s",
    ".......d............bb..................................cb................b...........cc..............bx...........s....s",
    "......db............bb..................................cb................bb...........cc.............ba............s...s",
    "......db............b...................................c.................ba...........cc..............a............s....s",
    "......d.............b...................................b..................a...........cc..............b............s....s",
    "......b.............a..................................cb..................b............cc.............b............s....s",
    "......c............ba..................................cb..................b............cc.............bb...........s....s",
    ".....cc............b...................................c...................bb............c..............b...........s",
    ".....c.............b...................................c....................b............cc.............b...........s",
    ".....c.............b...................................b....................b.............c.............b............s",
    ".....................................................................................................................s",
    ".....................................................................................................................s",
    ".....................................................................................................................s"
  ],
  legend: {
    E: { pal: C.mint, glow: true },
    G: { m: "moss", step: 2 },
    W: { pal: C.wisp, glow: true },
    a: { m: "bark", step: 0 },
    b: { m: "bark", step: 1 },
    c: { m: "bark", step: 2 },
    d: { m: "bark", step: 3 },
    g: { m: "moss", step: 1 },
    h: { m: "fang", step: 1 },
    s: { pal: C.pale },
    t: { m: "fang", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // The abdomen swells and settles: a spider at rest, which is worse.
    waist: 58,
    breath: [0, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the raised forelegs dip, tasting the air.
    twitch: {
      frames: [2],
      patches: [
        { x: 0, y: 2, rows: ["..................____", "..............____", "............._....bbbb", "............_..bbb..aa", "..........__xab.d..d", "......____xddd.ccdccc_", ".............cc..bb", "....._cccccaaaabbc.bbb", ".....haaa.a.......c", "...._.b_.x", ".....c..x..........c", "..._", ".._dd..t............cc", ".....tt............_.d", "._cc...............dd", "_da................ccc", ".................._xx", ".....................b", ".t..............._", "t...................cc", ".................d.c", "................_...b", "", "..................cb", "..............._", "..................b", ".................ca", ".............._c", "..............x.cb", "...............aa", "............._..b", "...............cx"] }
      ]
    }
  }
};
