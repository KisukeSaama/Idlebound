import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Blind Crawler (BIBLE 8.3): nothing down here was ever meant to be seen, so it has no
 * eyes. A pale, hairless lizard the size of a pony, crouched low on splayed clawed limbs,
 * a ridge of bone spurs along the back and the tail; the domed, eyeless head split by a
 * gaping maw of needle fangs on raw gums, a cold light burning far down its throat.
 */
export const BLIND_CRAWLER: CreatureGrid = {
  rows: [
    ".....................................................ddc",
    "....................................................ddd",
    "....................................................dc..........cc",
    "...................................................ddc..bbbb...ddc",
    ".................................................3cccbbbccccbbdddc",
    "...........................................cc.bbbbddcbbbccccbbdcbbbcccc",
    "..........................................ccabcccbcccccccccccccccbbccccbb.ccb",
    "..........................................caabccccdddccddcccddcccccccddbbbcbb",
    "........................................bbccccbbbccddddmmccccdmmddcccddddbbb",
    "..................................dc..bbccddddddddcccddmmmdddddmmmddcdddddbbb",
    ".................................cdb.abbccdddddddmddcddmmmmmddmmmmmmddmmmddccc",
    ".................................bbbbcccccccddddmmmdddmmmmmmmmmmmmmmmddmmmdddcc",
    "................................abbbccddddddccddmmmmmmmmmmmmmmmmmmmmcddddmdddddccc",
    "..............................cccddddcddddddddddmmmmmmmmmmmmmmddddddcddbddddcddcaa",
    ".............................ccdddmmmmmdddddmmmdmmmmmmmdddmmmddcccdddcbbcccccccdaa",
    "...........................cdddddmmmmmmmdddddmmmmmmmmmmdcddmdddccccccccbcccccccddbb",
    "..........................ccddddmmmmmmmmmddddmmmmdmmmccdcbdddcddcccaaa00ccccbbccccbb",
    ".........................bdddddmmmmmmmddmmmmddmmmdmdddddcbdddcdcaaaaaa3a3a000bcccbbbbb",
    "........................ccddmdmmmmmmmmddmmmmddmmmddddddddbdddbbc3ccbbbabbaa300bbbbccaa",
    ".......................ccddmmmmmmmmmmmmmmmddddddddccdddddaabcaa3accbbbaa3a34403bbabcc",
    "......................ddddmmmmmmmmmmmmmmmmccdddddccdddcca34bcbbbadcccaa3344cc43a0abbb",
    "......................dddmmmmmmmmmmmmmmmddddddcccccdddcaabbbcdccadccba3344bcc44300bbb3",
    ".....................ddddmmmmmmmmmmmmddmdddddcc4cccdccaaaddbcdcccdbbba444bcccc4400bbb3",
    ".....................dddmmmmmmmmmmmmmmdddddddddbbccaabccddddccccccbbb3444bccccc4000abbb",
    ".....................cddmmmmmmmmmmmmmdddcdccdddbb34bbbcdddddbbcccabba343acddcccc000aabbb",
    ".....................cddmmmmmmmmmmmdddddcccddddbbabbccddmmddb3aaaabb0330bcdddcccc000abbb",
    "....................cdddmmmmmmmmmmmdddccccddd00bbabbcdddmmmmmaaaaaaa0300bddmdcccc40aabb",
    "....................cddmmmmmmmmmmmdddddddddd000babbccddmmmmmmd0aaaa00000bdmmccdc4400abb",
    "....................ccddmmmmmmmmmddddddddddd000aabbbccddmmmmmd00aa000000bdmddcdc4400aab3",
    "...................4bdddmmmmddmmdddddddddaabcccaabbb3bdddmmmdd0000000000cdddddcc4403aab3",
    "..................b4ccddmmmmmmmdddddddaaa34bb00aaaa33bdddddddd0000000000ccdmdddc43330aaba",
    "................434bacdddmmmdmdddddccaa344bbb000a33bbbbddmmdddd000000000ccdmddcc30030aaba",
    "...............443bccccccccccddddcccca334cbbb000333a3abbdddddddd00000000cddmddcc30000aabb",
    "...............44ccrrrrrrrrrrrrddcca33a34ccac0033300000bbcccddddd0330000bddmddcc000000aabb",
    "...............444rdcrdcrdcrdcrrrrr3a0344ccca003333300000ccccddddcc3....bdddddc4004400aabb",
    "..............cccb0d00d00d00c00dcrdcrrrrbccc0a003333000000cccdddddc.....bdddddcbdc44400abbbb",
    ".............cbcca0d00c00d00000d00crrrdcrrrr0a0003300000000cddddddc.....bcdddddbdc43300aabbb",
    ".............c4ccb0d00000c00000c000000c0rrrrr0a03a000000000bdddddcdc....accddddcbb334003aabbb",
    ".............4cccb0c0000000000000000000VV000r.aaa00aaa333303abbddcdccc..abcddbccb43344033aabbbbb",
    "............c4ccba00000000000000000000VGGV00r.a.aaa3aa333303a3bdddddccc..bbddbbbbb0ab40033aaabbb",
    "............ccdcba000000000000000000000VVrrrraaaaaaaaaa333aa3dddmddcccc3.accccbaa30ac400333aaabbbba",
    "............ccdcb3000000000000000000000rrrrr.aaa3aaa3a333a.adddmmdccc44a.aabbbba00abc4400033aaaabba",
    "...........ccddbba300000000000000c00crrrr...baaaa33aa30000.dddmmddcc333...aaaaaa00abcc40.0000aaaababb",
    "...........cdddc333.0000000000000d0rdcr.....aabbb000a00...ddddddddb4344.........03bbcc44....000000aaaa",
    "..........ccdddcb0...000000c00c00dcrr.........aa..aa......ddmmdddccc33a.........3abbccc4...........000",
    "..........ccdcccb0....00000d00dcrrrbb....................ddddddcccc33...........3aabbcb4",
    ".....bccccddddbbb3...c.0c00drrrrrbcb....................ddmddddbcc333........b4bbbbcbbbcc",
    ".....acddcbdccca33...d..d0rdcr4bbccb..................ddddmddccbb33.........bbabb3acbcccccd",
    "...cddccb4bdccdb03...d..dcrrbabbbcc..................dddmmddcc4b4a..........bba300bcbcccccb3",
    "..bcdda3bddcccdb03...dc..bbbbabbbbb.................ddmmmdccaa333..........cbb0000d000ac34bc",
    ".dbcc03adddbbbdd0........bbbbbbbbcd................4ddmmmdccaa.............cb....ad000ada3acc",
    ".dcc003adda33adccc......c...bbbb.cd................bbddmddcb3....................ac...adc..cc",
    "ddcc33ddd003000ccc......c...cccb.c................cccddddcc43....................bc....c",
    "ccc..adcc00...03cd......c...ccc..................cccddddbbbb4",
    "cc...adc.......3add.....c.....................dcccbcdddddbbb3",
    ".....ac..........cc..........................bddcbbddcdddda3a",
    ".....ac.....................................bccbbbddccdccddb",
    "..........................................bbbcaabbddccdccddb",
    "..........................................dbbbaacccccadbbbdd",
    ".........................................ddb4baacaa00addbbddcc",
    "........................................cccbb4dcc3300cdd00addcb",
    "........................................ccc..ddcc..00cdd003aacbd",
    "........................................cb...ddcc....bdc...3acdd",
    "........................................bb...ddcc....bdc....acdd",
    ".............................................dcc.....bdc......cc",
    ".............................................cc......bd.......cc",
    ".............................................cc......cc",
    ".............................................cc......cc",
    ".............................................ba"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    "3": { m: "shadow", step: 3 },
    "4": { m: "shadow", step: 4 },
    G: { pal: C.shardLight, glow: true, light: true },
    V: { pal: C.essenceBright, glow: true, light: true },
    a: { m: "skin", step: 0 },
    b: { m: "skin", step: 1 },
    c: { m: "skin", step: 2 },
    d: { m: "skin", step: 3 },
    m: { m: "skin", step: 4 },
    r: { m: "maw", step: 1 }
  },
  idle: {
    // A slow, wet breath through the open jaws.
    waist: 47,
    breath: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the light in the throat flares and the drool runs longer.
    twitch: {
      frames: [7],
      patches: [
        { x: 24, y: 37, rows: ["..............V..V", "...............GG", ".............V....V", "...............GG", "..............V..V", "", "", "", "", "", "", "", "", "", "", "", "", "", "c", "c"] }
      ]
    }
  }
};
