import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Court Jester: laughs every time you arrive, as if he knew you would. He did. A lean
 * jester lunging on bandy legs, his motley of diamonds faded to greys, a dagged ruff and a
 * hood of three limp points, every tip hung with a gold bell; a pale lacquer mask grinning
 * ear to ear, violet fire deep in its eye holes. He thrusts a bauble sceptre at the
 * company, a tiny grinning head in a tiny crown on top; the other hand flung up behind.
 */
export const COURT_JESTER: CreatureGrid = {
  rows: [
    "..b",
    ".aadb",
    ".iacb",
    ".iikkki",
    ".jjkkkji............................ai",
    "kijkkkjj............................ic",
    "jiiijjjj...........................iea",
    "kijjjkkji........................iihb",
    "kiijjkkj...bb...................iji.b",
    ".jiijjjii..hh.................iijih",
    ".ajiiih.a...ihh..............iijih..a",
    ".b.ifia.b....iii...........iiijjih..cb",
    "....bcca.....iiiih.......ijiijjii",
    "...kabca.....hihiih..ihhhiijjjiii",
    "....iaaa......iiiihiiiiiiijjjihi",
    "....iaaa.....aiighiiiiijiiiiihig",
    ".....aaa.....a.jgiiijjjjjihhhhia............i....hi",
    ".....iaa.......iiiiiijjjjjigfi.a...........hi...hhh",
    "......gb.......iiefhjjjijjiiff.a...........he..ihe",
    "......bb.......ifikigijiijihhh.bb..........hegihe",
    ".......aa.....ffikkkjfhjijihhh....gg.....iihgggihihh",
    ".......ib.....ffkkjkihehiiihhh...iggg..jiihigeehhhfi",
    ".......ib.....eehkjiihhhiiiihgghieegg.jjiiifeeeghe.ii",
    ".......ib.....eeeEEgEikjhihihhiiieegfijjiiieeffghh",
    "........aa....eeegkkkkkjfihihgihijjgiijjjgheeffhehh",
    "........ab....eejjkkjjhiiihhhiiijjiiiiiiihgeff....i",
    "........aa.....eeijjkjikihhhhiiijefiiiihhghee",
    ".........aa.....eeiikjkkigggijhijgiiigihgghh",
    ".........aahi..iiefijjkkeegijjhiggihhfffgii",
    "........ihggi.ihhgfiikkeegiijehiggffhfffgi",
    ".......ifeeee..igigijkagiijjieehggffhh",
    ".......iggghej.hgihheegjijijeeeefeehh",
    ".......ggffeeiiifhhhhgijjjieheeffeee",
    "........ifffegieffeiiiheiehhjieeeee",
    "........geefehifffeeiieeegijjigeeee",
    ".........eeeeihfffeeffffgijjjiggeeh",
    ".........eeeaeifffeegiiiiijjihhggeh",
    ".........gggaeefff..ghihiiiiihihghi",
    "..........igaahh.....hhggiiiijihhii",
    "............aah......ihghhiijihhhi",
    ".............a........igiijjihihii",
    ".............aa.......iighiihiihih",
    ".............hba......iihiiiiigihh",
    ".............hba......hgghiihhighhh",
    "..............h.......iighhiiihghhi",
    "....................iiggghihiihihhhi",
    "...................iihgghiiiihjiihhhh",
    "...................ifhhhhhhiiiijiheee",
    ".................jjighiiehiiiijieehhi",
    "...............ijiiiififeeiiiiffiihhh",
    "..............jjiiiiihffffiihegiiiihi",
    ".............jiijiiiiifgggeehhhijjiiii",
    "...........jjijiiiiihgfffggggiiiijjiiih",
    "..........jjjjjjjiiiiiffeeeghhiiiijiiii",
    "..........jijiihgfffeegeeeeefffhiijjiiii",
    "..........iiijjiiiffggggg....ffgijijiihi",
    "..........ighhhgihefggg.......giihijjiii",
    "..........ifgggeeeh............fiiiijiige",
    "..........iffffgghe............hghijjjjiih",
    "..........jgggggghee............iihijjihgehi",
    "...........gggigeeeehi...........hhhiigggfiii",
    "................eeeeeff............hhffggiiii",
    ".................eeeefg............hhfffgijii",
    "................iheffgg.............hfffhiiie",
    "................igefihee............hhgiiigff",
    ".................ifeieee.............ihigeeff",
    "................hifeeee..................eeegg",
    "...............hfffe......................eegg",
    "..............ihhfee.......................geefhh",
    "..............ffeee........................geeggg",
    "...............f...........................igggghi",
    "...........................................hgggghi",
    "...........................................iiggeee",
    "...........................................iifhhgg",
    ".............................................hihgf",
    ".............................................hhhfff",
    ".............................................figgge",
    ".............................................hhiggf",
    ".............................................fegge",
    "...............................................ee"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    a: { m: "bells", step: 0 },
    b: { m: "bells", step: 1 },
    c: { m: "bells", step: 2 },
    d: { m: "bells", step: 3 },
    e: { m: "dark", step: 0 },
    f: { m: "dark", step: 1 },
    g: { m: "dark", step: 2 },
    h: { m: "motley", step: 1 },
    i: { m: "motley", step: 2 },
    j: { m: "motley", step: 3 },
    k: { m: "motley", step: 4 }
  },
  idle: {
    // A silent laugh: the shoulders shake up and down, the bells with them.
    waist: 49,
    breath: [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
    // Once in a cycle, the bauble sceptre jerks up, its tiny head grinning.
    twitch: {
      frames: [5],
      patches: [
        { x: 0, y: -1, rows: ["..b", ".aadb", ".i.c", "..ikkki", ".jj...ji", "ki.....j", "j.iijj", "k.jj.kk.i", "..i....._..bb", "_j.i.jjii..hh", ".aj.iih_a.._ihh", ".b_.f.a.b..._iii", "._._bcca_", "...kab.......h.h", "..._iaa......_.i", ".............a", "...._........._j", ".....i......._.i", "....._gb", "......b", "......_aa.....ff", ".......ib", "..............ee", "", "......._aa", ".........b", ".........a...._", "........_.a...._", "...........hi..i", "........ihgg..ih", ".......ifeeee._i", "........gggh.j.h", ".......g.ffe.iii", "......._i..f.g.e", "........gee..h.f", "........_..e.ih", "............aei", ".........ggg..e", "........._i..ahh", "..........__..._", "............_._", "..............a", ".............hba", "", "............._h_", ".............._"] }
      ]
    }
  }
};
