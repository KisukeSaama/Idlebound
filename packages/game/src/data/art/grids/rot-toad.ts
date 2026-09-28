import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Rot Toad (BIBLE 8.4): it croaks in the Baron's voice, and Mirelle hates it most.
 * A toad the size of a cart, squat in the mud on splayed webbed hands, the back a bloated
 * dome of warts, a few burst and lit violet. The mouth is a long cut from the snout to
 * under the eye; heavy lids half close over slits of sick light, and the swollen sac
 * under its jaw glows the green of the mire.
 */
export const ROT_TOAD: CreatureGrid = {
  rows: [
    ".........................................oooo",
    ".....................................ooppooooooooooooo",
    ".................................ppppoooooooooooooooooooooooo",
    ".............................ooppoooooooooooooooooooooooooooon00",
    "..........................ooooppoooo00oonmppooooooooooooooo00nn0mo",
    "........................poooooppoo0000oonm0ppoooooooooooooo00nnnnnnoo",
    "..................AAAAAppoooooo000xxxx000m0ppAAAAoooo00oooooonnnnnnnoooo",
    "...............AAAppppppooooooooxxxxxxxnmm0npppppppooo0oooooooonnnnnnnnnoo",
    "..............AAApppppppooooooooxxEEEExnm0ooooommmnoooooooooooooonnnnnnnnnnn",
    "..............Apppppppooooooo00onAAAAAAmm0noooommmnnoooooooooopVVnnnnnnnnnnnn",
    ".............Appp000000ooooop00onnnnnmmmmnnnnoooonnnoooooooooopVVnnnnnooonnnnn",
    ".............A000xxxxxx0000opVsoonnmmm00nnnnnnooonnnoooooooooo0000nnnnooonnnnnnn",
    ".............ppxxxxxxxx0000nnVVoonnmmnnnnnnnnnoonnnnoooonnnnoo0000nnnn00nnnnnnnnn",
    ".............ooxxEEEEExnnnnnnoooonnnnnnnnnnnnnnnnoooopnnnnnnoon000nnnnnnnnnnnnnnnn",
    ".............oooAAAAAAAnnmmooooonnnnnnnnnnnnnnnnnoononnnnnnnoonnnnnnnnnnnppnnnnnnnn",
    "............poooxxxxnnnnnmoooooonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnonnnnnpppnnnnnnnnx",
    "...........ppoooooonnnnnnAAonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnooomnnnnnnnxx",
    "...........oooooooomnnnnnnAAnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn00mmnnnnnnnnnn",
    "..........oooooooooonnoonn00nnnnnnnnmmmnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn00mmnnnnnnnnnnn",
    "..........oooooooooooooooo00nnnnnnnnmmmVVnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnoomnnnnnnnnnnnx",
    ".........ooooooooooooooooonnnnnnnnnnnooVV0nnnnnnnnnnnnnnnnnnnnnnnnnnmnnnoooonnnnnnnmmmmm",
    "........poooooooooonnoooopnnnnnnmmnnnno00000nnnmmnnnnnnnnnnnnnnnnnoomAAAoooonnnnnnnmmmmm",
    "........oooooooooonnnnnnnnnnnnnnmmnnnnnnmmmmmmmmppVVnnnmmnnnnnoooooooopAoooonnnnnnnmmm00",
    "........o0oooo000nnnmmnnnnnnnnnnnnnnnnnnnnnnmmnppVVVnnnm00nnnnoooooooopAAooonnnnnnnmmm000",
    "......0ooonnoonnnnnnmmmmnnnnmmmnnnnnnnnnnnnnnnnnnvVvnnnnnnnnnnoooooooopAAoonn0oooon0mm000",
    ".......ooo000nnnnnnnnmmmnnnnm00nnnnnnnnnnnnnnnnmmvvvnnnnnnnnnoooooooooooooonnoooonm000000",
    ".......ooooo0nnno000000mnnnno00mnnnnnnnmmmmmnnnmmnnnnn00mmnnooooooooooooooonnnoonnm000000",
    ".....pppoooooonnoon00000mmmnn00mnnnnnnnmmmmmnpmmmnnnnnmm000noooooooooVVn00nnnnoonn0000000",
    ".....xxxppppommmnnnnnnmm0mmnnnnnnnnnnnnmmmmpp0mmmnnnnnmmm00noooooooooVVmnnnnnooonn0000000",
    ".....xxxxxxmpppppnnnnnmmmmmnnnnnnnnnnnnmmppnnm0mmnnnnnnnnnnnooooooo00mmmnnnnnnooonomm0000",
    "......xxxxAxxxxAxpppAppmmmnnnnnnmmnnnnnppxxnnn0mmnn000nnnmpppoooooonnmmnnnnnnnnnnoommm0000",
    ".......xxxAxxxxAxxxxAxmpppApppppApppppAxxxnnnnn0nnn0mmnnnmpppoooooonnnnnnnnnnnnnnnmmmm0000",
    "........0xxxxxxxxxxxxxxxxxAsssxxAxxxxxAx00mmmmm0nnn0nnnnnnoonnoooopnnnnnnnnnnoonnnmmm00000",
    ".........mmAAAxxxxxxxxxxxxxxxxxxxxxxxxxmmmm0mmm00nn00nmmmnoonnnnnnnnnnnnnnnnnVVnnnmmm00000",
    ".........mmAAAAAAApAxxxxxxxxxxxmmxxmmmmmmmmmmmmmmnnmmmmmmmmmnnnnnnnnnnnnnnn00nVmnnmmm00xxx",
    "..........AAAAppooopooppAAAAppmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnnnnnn00nmmnnmmm00xx",
    "..........AAAApoooopoopLpAnppppmmmmmmmmmmmmmmmm0mmmmmmmmmmmmmnnnnnnnnnnnnnnnnnmmnnmmm0xxx",
    ".........AAApppoooonpmpppAnpppppppmmmmmmmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnnnnnnnnn0mnnmmm0xx",
    ".........AAAApooooonmppppAApppppppppm00mmmmmm0mmmmmmmmmmmmmm00nnnnnnnmmnnnnnnn0mmmm000x",
    ".........pAAppppoopppAAppppppppppppppppmmmmm0mmmmmmmmmmmmmm0000nnnnnmmmmmnnnnmmm00000xx",
    ".........pppppooppnmmppppppppppppppppppppmmm0000mmmm00000000000nnnmmmmmmmmmmmmm00000xx",
    "..........ppppoooonmmppppppppppppppppppppppm0000000000000000000mmmmmmmmmmmmmm000000xxx",
    "..........ppppoooonmmppAApppppppppppppppppppp0000000000000000000000ppo00000000000xxxx",
    "..........pppooonn0mpppAAAppppppppooopppppppppp0000000000000000opppppon00000000xxxxxx",
    "......Appppooooon00oooonnnnopppppoooonnoooopppppp00000000000oooooooooonn000000xxxxxxnnnnn",
    ".....oooooooooooooooooonnnnoooonmmnnnnnnnnnn000ppppxxxxxxx0oooooooooomnnnmxxxxxnmmmnnnnnnn",
    "...moonmnnnmnnnmoo.........ooonnnnnnnnnnnmmxx00xxxnxxxxxxm0onnmmmmmmmmmmmmm0mmmmmmmmmmmmmm00",
    ".mmooommnnnmmmmmm............nnnxx........nxxxxxxxnxxxxmm000mmmmmmmmm00mmmm0mmmmm00000000000",
    "m..o00mmmmmm0000.m............n...........n.......n...m..0000mxx....m......mm000000xx0",
    "..........................................n",
    "..........................................n"
  ],
  legend: {
    "0": { m: "skin", step: 0 },
    A: { m: "skin", step: 4 },
    E: { pal: C.mireLight, glow: true },
    L: { pal: C.mireLight, glow: true, light: true },
    V: { m: "rot", step: 2 },
    m: { m: "mud", step: 1 },
    n: { m: "skin", step: 1 },
    o: { m: "skin", step: 2 },
    p: { m: "skin", step: 3 },
    s: { m: "shadow", step: 0 },
    v: { m: "rot", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // A toad's breath: long still beats, then the back swells.
    waist: 48,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, it croaks: the sac under its jaw swells with light.
    twitch: {
      frames: [10],
      patches: [
        { x: 9, y: 30, rows: [".L....L...AL", ".L....L....L....AL....AL", ".................L.....L", "..LLL", "..LLLLLLLAL", ".LLLL.........ALLLL", ".LLLL..........AL", "LLL............AL", "LLLL...........ALL", "ALL........ALL.AAAAAAAAAA", "AAAAA..........AAAAAAAAAA", ".AAAA..........AAAAAAAAAA", ".AAAA........ALLAAAAAAAAA", ".AAA.........ALLLAAAAAAAA", ".A.................AAAAA"] }
      ]
    }
  }
};
