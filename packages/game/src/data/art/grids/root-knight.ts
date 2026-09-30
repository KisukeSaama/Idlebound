import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Root Knight (BIBLE 8.2): a soldier buried under an oak. The oak got up.
 * Dark plate, dented, braced on wide legs; the breastplate split down the middle where the
 * trunk burst out of it, bark grown over the far half, roots coiled round the shins. Moss
 * hangs from the pauldrons, antlers of root grow out through the great helm, and cold light
 * shows in its visor slit. The sword is held low, a root grown through it; a cloak of roots
 * drags on the ground behind.
 */
export const ROOT_KNIGHT: CreatureGrid = {
  rows: [
    "...........................................b",
    "...........................................b.....bb.cbbG",
    "...........................................b....bbbbcbbbG",
    "...........................................b...bbbb",
    "...........................b...bb..........b..ccb",
    ".......................cGbbbbb.cc..........cbcc",
    ".......................Gc...bbbcc..........cbb",
    "..............................bbb..........bb",
    "................................bb.........bb",
    ".................................bb.......cb",
    ".................................bb.......Gb",
    "..................................cb....Gggg",
    "..................................cb..GGGGggg",
    "..................................QQQQgGggggg",
    ".................................QQQQQQggggqq",
    "...............................QQQqqQQqqqqqqqq",
    ".............................QQQQQqqqqqaPPPPPp",
    "............................QQQQqqqqqqPaPPPPpp",
    "............................QQaxxxxxxxxxxxPppp",
    "............................xxaxxxxEEWWEEEPPPpp",
    "............................xEEEWEExxxxxxxPPppp",
    ".............................xxxxPPPPxPPPPPPppp",
    "..............................qPPPPPPPPPPPPPPpp",
    "...............................PPPPPPPaaPPPPppp",
    "...............................qPPPxPPaPPPPpppp",
    "........................GG...GGGGPPxPPPPPPpppax",
    ".....................GGGgGGGGGggGGgxppxxppppaa.....gGGgggg",
    ".....................ggggGggggGGgggppppapppaacbccgggggggggg",
    ".....................ggggGggggGGgggppppappxxabbbbbGGGgggggg",
    ".....................ggggggggggggggpbqqaapxxQQQqQQgggggggqqq",
    "....................QQQqgggggggggPPpqqqqbbqqQQQqqQQggqqggqpp",
    "...................qQQqqqqPggPqqPPPppqqqbbqQQQccccggbqpggppxx",
    "...................qqgqPPPPPPqPPgpppaQQcbbcbQqccccgcbqpgqppp",
    "...................qgqPPgPPPgqPPqppqaccxcccbbqccccgcbqpgqpxx",
    "....................gqPPqqPPgqPPqpxqPbbxcccbbqccccgcbqpgqxxx",
    "....................gqPPqqqxgqqgqxxxPqxxbccbbqqccccbbqagqaaa",
    "....................gqppqpqpgqqgqaxxPqxxbccbbbqcccbbbqagqaapp",
    "......................qpqpppgqqgqaPPqqxxccccbbqccccbbbapppppp",
    "......................qqqqppaaaaqqPPqPxxccccbbbccccbbbccqpppp",
    "......................QqgqpppaaqqqqqPPccccccbbbccccbbbbcqpppp",
    ".....................QqqqqPPpaqqqqqqPPcccqqccbqccccbbbqqqpppp",
    ".....................QqaPPPppqqqqqqqPPccqqxxcbqccccbbqqppppppc",
    "....................QQqaPPpppqqbbqqPPPcbqxLxcbqccccbbbpppppppcc",
    "....................QqqPPPqq.qqqcqqccbbbqxLxcbqccccbbbpppppppcx",
    "...................QQqPPPppq.qqqcbbbbbcccxLxbbqccccbbbcpppppppxx",
    "...................QqPPPPpp..qqbbbbqqPPccxLcbqqccccbbqcqppppppxc",
    "..................QqqPPPppp...qcqqqPPPPcccccbbccccbbbaccppppppccc",
    ".................QQqPPPPpp....cbqqPPPPPccccbbbcccccbbcccqppppppccc",
    ".................QqqPPPpp.....cbqPPPPPPccccbbbccccbbqqccqppppppccc",
    "................QQPPPPppp....cbqPPPPPPPcccbbbbccccbbqqbcbppppppcccc",
    "................QqPPPppp.....cbqPPPPPPPccccbbcccccxbqbbcbqpppppcccc",
    "...............qqqPPppp........qqPPPPPPcccbbbcccbbxxqbbcbqqqpppacccc",
    "..............QqqqPppp.........qappPPPpccbbbqppbbbbaqbbccqqppqpacccc",
    "..........qqppQPPPppp...........qpPPPPpbbxxappppxxbqcbbbcbqpqqpacccc",
    "...........ppppPPPpp............qpPPPPpqbxbqppppqbbqxxbbcbqppppaacccc",
    ".............ppppcq...........cccpppppbqccbqaaaaaqbqxxbbccqppppaacccc",
    "..............ppccqP..........ccbbccbbqaacqxxaaaaqqqxbbbbcqppppaaacccc",
    ".............QQccpppPP..........bbbcbqqxxqqxxxxxxxxbbbbbbccppppaaacccc",
    ".............QqQq..pppp........qqqqqcqqqqqqqqqqqqqPbbbbbbccqpppaaacc.cc",
    "............ccQpp...ppp........qqPqxcqqqqqqqaaaaaappbbbbbccqpbbcbaac.cc",
    "............cQqp...............qqxxxcqxxxxxaaxxxxxxpbbbbbcccbbbcbaacc.cc",
    "...........ccQq................qPPPPPqPPPPPPppPPPPppcbbbbbcbbbbccbacc..cc",
    "...........qQcc................qqPPPPqPPPPPPPPPPPPppcbbbbbcbbbbbcaaac..cc",
    "..........QqQqc...............QqqPPPxxaPPPxPPPxPPPppcbbbbbccbbbbcaaqcc..cx",
    "..........QQqqc...............Qxxxxxxxxxxxxxxxxxxxxxpbbbbbccbbbbccbqqc..xx",
    ".........QQQcc................qqpppppppppppppppppppppbbbbbbbbbbbccbaqcc..xx",
    ".........QQcc................qqapppaapppppppappppppppbbaabbbbbbbbcbaqccc.cc",
    "........QQQc.................qqaaPPpapppacbaappppppaabbbbbbcbbbxxcbbaaac..c",
    "........QcQc................QqqqPPPppa...cbbbpppppppabbbbaaccbbxxccbaqacc.cc",
    ".......QQQq.................QqqqqPPppa...bbbbqpaapppabbabaabcbbbbccaaqaacccc",
    ".......QqQc.................QqqcqPppp.....bbbqpppppppbaabbabcbbaaacaaaaacc.cc",
    "......QqQq..................QqqqPPppp.....bbbbpppppqpbbaabbbbcbbaaccaaqaacccc",
    "......QqQq.................Qqqcqqppa......bbabqpppbqaabbbbbbbcabbxxcaaqaacc.cc",
    ".....QqQq..................QQccqqppa.......babppppbbqabxbbbbbcabbxbccaaaaacccc",
    ".....QQQc..................cQqqqqpa........bbbqppppbbbxxbbbbbccbbbbccaaaaacc.cc",
    "....QqQcc.................QcqqPqppa........bbbqppppbbbxxbbabbbcbabbbccbaaaccc..c",
    "....qQqc..................Qcqqpppp..........baqppppppcxaababbbccabbaccbaaaacc...c",
    "...QqQc...................QqqPPaaa..........bbbppppppcaaaaaabbccbbbaxccaaaaccc...c",
    "...QQc....................qqqqPPa............aaqpppppcaaaaaaaaacbbaaxccaaaaacc....c",
    "..QQQc...................Qqqqqqqa............abqppppqqaaaaaaaaaccaaaaaccaaaaacc...cc",
    ".QQqqc...................QqqPqqqb............abqppppqqaaaaaaaaaccaaaaaacaaaaaccc...ccc",
    ".QqQq....................QqPPPPbb.............bqpppqqaaaaaaaaqqacaaaaaaccaaaaacc.....cc",
    "QQqQ.....................QqPPPPcb.............aaqqqqpaaaaaqaaaaaccaaaaaacaaaaaacc.....cc",
    "QqQp....................QQqPPPcc..............aaqqqppaaaqqaaaaaaacaaaaaaccaaaaaacq.....cc",
    "Qqq.....................qqqPPccc..............aqPPbpaaaaaaaaaaaaaccqaaaqqccaaapqcq......cc",
    "Qpp..................QQQQqqqcccc...............qPPbppppppaaaxaaaaccqaaaaaccaaapqqcc......cc",
    ".....................Qqqqqqcccpp................Pppbqppppaaxxxaaaacaaaaaaacaaaaqqccq......ccc",
    "....................QqPPPPqPPPPp................pppbqpppaaxxx..aaaccaaaaacccxaaaqccq.......cc",
    "....................QPPPPcPPPPPp...............qpppbbpqqpax.....aacqaaaxxxccxxxxxxccq",
    "...................QQPPPPqPPPPPp...............qppppbbppppx.......ccaaxxx..cc......qxx",
    "...................qpppcqqpppppp...............ppaaaabppppa........cqxx....cc",
    "......................cc...............................baa"
  ],
  legend: {
    E: { pal: C.mint, glow: true },
    G: { m: "moss", step: 2 },
    L: { pal: C.mint, glow: true, light: true },
    P: { m: "plate", step: 2 },
    Q: { m: "plate", step: 4 },
    W: { pal: C.wisp, glow: true },
    a: { m: "bark", step: 0 },
    b: { m: "bark", step: 1 },
    c: { m: "bark", step: 2 },
    g: { m: "moss", step: 1 },
    p: { m: "plate", step: 0 },
    q: { m: "plate", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // A slow breath that creaks: bark and plate.
    waist: 52,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the light in the visor flares along the whole slit.
    twitch: {
      frames: [6],
      patches: [
        { x: 29, y: 19, rows: ["......WW..WWW", "WWW.WW"] }
      ]
    }
  }
};
