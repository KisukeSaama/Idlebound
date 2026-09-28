import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Shade Wolf (BIBLE 8.2): a wolf made of the dark between two trees.
 * Low on its forelegs and about to spring, head thrust at the company, the jaw open on
 * pale fangs; the fur is smoke, black and violet, fraying into wisps along the back and
 * the tail. One eye burns violet out of the shadow of the brow.
 */
export const SHADE_WOLF: CreatureGrid = {
  rows: [
    "......................................................................vv",
    "......................................................................dd",
    ".......................................................................dv",
    ".......................................................................dd",
    "......................................................................vd",
    ".................................................................vvvvvdd",
    "................................................................vddddd",
    "...............................................................vddddd",
    "...............................................................ddccd",
    "................................................................dcccv..vv",
    "...............................................vv................dcccvvd",
    ".............................................vvccv...............dcccdd",
    ".............................................ccbcc...............dcacddv",
    "....................................v........cbbc.....vv........vccacddd",
    "..................................vvb.vvv....cb......vdc...vvvvvbbaacddd",
    ".................................vcbbvccbvvvvcc......dccv.vbbcbbxxccddd",
    "..............................vvvbbbbbbbbcccccc.vv....ccdvcbbcbbccccdd",
    "............................vvcbbbbaaabbbcccccdvdd...vccddcbbbbccc.......vvvvv......vv",
    "..........................vvccbaabxxaaaaccaabbbcc...vdccddcbbxxcd........ddddd.....vdd",
    ".........................vbbbcbbccaaaaaacxxxaabccvvvccccdccxxxxcd......vvdd........dd",
    ".......................vvcbbbaabcaacaaaacxxaaabbcdbccccccxxxxxccdv.....ddd.........dd",
    "......................vbbbaaaabbaaccaaaaccbbbaxxxbbbcxxxxxxxbcccdd......dcv.........d",
    "....................vvcbbbaaaabbbacbbbbccbbbaaaaxxxxxxxxaaabbbbbbdvvv...dccv.......vdv",
    ".............vv.....cbbbabcaaaaaaabbbbbcaaaaaabaaaxxxxxxxabbbcbbbbbddvvvbbcd......vddd",
    ".............ccv....cbbbaccbbaaaaaabbbbbaaaaaabbbabxxxxxxbbccccbbbaabccaaacd..vvvvddd",
    ".............cccv.vvbbbbbcabcaaaaaabbbccaaaaaaabbbbbbxxxbbbbcccccbaabbbacdccvvdddddd",
    ".............ccccvbbabbbbbabccaaaaabbccxaaaaaaabbbbbbbbbbcccbbccccccbbaacddccccccd",
    ".............cccccaaabbbbbaccxxaaaacccxxaaaaaadcbbbbbbbbcccccbbbccccccaaaaabbcccdd",
    ".............cccccbbabbbaacccxxxaabbbaaaaaaddddcbbbbcccccccbbbbbccccccbaxxbbcccdd",
    ".............ccccbbbccbbaccccxxbaabbaaccxxcdbbbaabbcccccccbbbbbbaccccbbaxxxb",
    ".............cccbbbccccbbbccxxxbxxabccaxxxcdbbbbabbccccccbbbbbbbaccccbbaxxxccv",
    "..............ccbbbccccbbbbcxxaabxabcaaaxxcbbbbaabbcccccabbaaabbbccccbbbbxxxcbv",
    ".............bbbbbcccccccbbcxxabbxaabaaaaccbbbbbabccbbbbaaaaaabbbccccbbbbcxxxbcv",
    ".............bbbbcccccccccbbaaabbxxabccaadcddcbbabbbbbbbaaabaaabbcccccbbbccxxaacv",
    "..............bbcccccccccccccbaabxaacccbddddccbbabbbbbbaaabbaxxbbccccbbbbccxxxaac.............vv",
    ".............bbbcccccccccccccbbaaaaaababdddbbccbaabbbaaabbbaaxxbbcccbbbbbccxxxaacvv..........vcc",
    ".............bbbcccccccccccccbbbaxxaababddbbcccbaaaaaaabbbbaaxxxbccccbbbcccxxxaabccv......vvvcc",
    "............bbbccccccccdddccbbcccxxaaaabcbbccccbxxaaaabbbbbaxxxxcccbccbbcbbxxxaabccd......ccccc",
    "............bbbddcbbcdddddcccbbcccxaaaabcbbcccbbxxxxabbbbbbxxxxabccbccbbccbaaxxaadd......vccc",
    "............ccdddcbccaaEdadccbbcccxxaabbbbccccbbxxxaabbbbxxxxxxabccbccbbcbcaaxxxaadv.....ccb",
    "............cbdddbaacdEMEvddcbbccddxaabbbbccccbxxxaaabbbbaaxxxxxbcccccbbbbccbbxxabbc.....ccbv",
    "............cbbddbbaaadEvadaaaaccbxxxabbbcccccbaxxxaabbbaaaaaaaabbccccbbcbbcbaxxxaccv....ccbbv",
    "............cbbbbbccccddcdbaaabccbxxabbbbcccbbaaaxxabbbbaaaaaa.bbbccccbbcbbcbacxxaacd.....cbbbvvv",
    ".............bbbcccccccccbbaabbcccxxabbbbccccbabbxxabbabbbbbb...bbccccbbcbcccccxxaacd......bbbcccv",
    ".............bbbcccccccccbaabbbbxxxaabbbbccccbbbbxabbbabbbbb....bbccccabccc.ccxxxxaaav......cbbccc",
    "...............bbbcccccaaaaabbbbxxxaaxxbbbccbbbbxxabbbbbbbb.....bbbcccabbbb..cbxxxaaaavv...vccbccc",
    "...............bbbbccaaaaaaabxxxxxxxaxxbbbbcbcbbbxabbbbbbc.......bbcccbbbbc..cbbxxaaaaad...ccccccc",
    ".............vvvbaaccaaaaaxxxxxxxxaxxxxbbbbbbcbbbxabbbcccc.......bbbcccbbbcdddccbxxaaaacvvvccccbbc",
    "...............ataataataatxxxxxxxaaxxxxxbbbbbbbbbbbbcccccc........bbcccbbbcc..ccbxxxaaabccccccbbbc",
    "...............xxxxtxxxxxxxxaaaxaaaxaaxxxbbbbbcbbbccccccccc.......bbbcbbbbbbbvccbaaxaaabbccbcaaacc",
    "................xxtxxtxxtxxxaabbaaaaabbaxaaacccbbbccccccccc........bbbbbabbbbbbcccaxxaabbbbbbaaacc",
    ".................aaaxaxxxxxxxaaccbccbb.aabbcccbbbccc.ccccccccc......bbbaabbbbbbbccccxxabbbbbbbaacc",
    ".................aaaaaaaaxxxxa.ccbccc...bbccccbbccc...cccccccc.......bbbbbbbbbbbccdcxxxxbbbbbabcc",
    ".................baaaabaaaxxaa..........bccccbbbcccc...ccccccc..........bbbbbbbbcdddbaaxxxabaabb",
    "................bbbbbbbaaaaaab.........ccccccbbbbccc....cccccc.............bbbbbb..dcbbcxaababbcv",
    "..............ccbbbbbaabaabbbb.........cccccbbbbbb......cccccc..............bbbbbvvdccccccabacccc",
    ".............ccccbbbbbbbbbb............ccccbbbabbb.....cccccc...............bbbbbbd.ddccccccc",
    "............ccccbbbbbbbb..............cccccbbbabb......ccccc.................bbbbb.....cccd",
    "...........ccccbbbbbb.................cccccbbbbcc.....ccccc..................bbccc.......dd",
    "...........bcccbbbb..................cccccbbbbb......ccccc...................bbcccv",
    ".........bbbcccbbb...................dddcbbbbb.......ccccc....................bcccc",
    ".........bbccbbbab............dd....cccccbbbb...ccccccccccc...................bbcccv",
    "........cccccccaab............dd...cccccbbbbb..ccccccccccc..................bvbbbccc",
    "....cccbbbccbcca...............dd.ccccccbbb...cccccccccccc..................cbbbbbbcvv",
    "...bbbcbcccbbccc...............ddccccccbbb....cccccccccc....................cbbbbcbcccv",
    "..cbbbbbccbaaacc...............dcbcccccbb......cccccccc....................cabbabcbcccd",
    ".ccccbbccbbaaacc..............ddcbcccccb...................................caaaabcbbcc",
    "cccccaacbbb...cc................cccccccbc..................................cxxxaxxbbxx",
    "..ccaaccbbb....................ccccccbccc.......................................xx",
    "..cc.cc....................dd.cccccccbcc",
    ".....cc.....................d.cccccccbc",
    "...........................cccccccccbb",
    "..........................ccccccccbcbb",
    ".........................cccccbbcbbcb",
    "........................ccbccbbccbccc",
    ".......................ccbbccbccbbccc",
    ".......................ccaccaaccbaccc",
    ".......................ccaccaaccbaccb",
    ".......................c.ccaaccbbaccb",
    ".........................ccxxccbb.xxx",
    ".........................cc..cc"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    M: { pal: C.moon, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 3 },
    d: { m: "fur", step: 4 },
    t: { m: "fang", step: 2 },
    v: { m: "wisp", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // A low, slow breath: a wolf waiting to spring.
    waist: 45,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the smoke of its back tears loose and drifts.
    twitch: {
      frames: [5],
      patches: [
        { x: 56, y: 0, rows: [".............._.v", ".............._.d", "..............._dv", "..............._.d", ".............._vd", "........._....v.d", "........_v....d", "......._v....d", "......._.d._d", "........_d.._v._.v", "........._d.._.vd", "........._d.._.d", "........._d.._.dv", "........_v..._..d", "..._....v...._..d", "_v_v........_..d", "_dv........._.d", "_.d.............._....v....._.v", "_.d....._d......._....d...._v.d", "_d......_d....._.v.d......._.d"] }
      ]
    }
  }
};
