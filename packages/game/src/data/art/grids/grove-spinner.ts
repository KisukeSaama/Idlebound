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
    "...........................kEd",
    "...........................kdEE",
    "............................dddE..............................dkkk",
    "........................gk...dddd.............................ddggWW",
    ".......................Wgk....kkE...............................ddggW",
    "......................WWd.....kkkd...............................dddehd",
    "......................Wgk......cjdd................................ddde",
    ".....................WWkk......cjjj................................dddee",
    ".....................ghd.......cccjj...................j...c........dddddc",
    ".....................ggd........bbii..............dbcEEEEEdccccc.....djdcc",
    ".....................kgd.......jiiii.............dEEEEEfddcdddccc.j..cciccj",
    "....................ckkkcc.....jaaaii..........dEEdddccccccdddiiiacc.iiicbjj",
    "...................gWgkkiccc...iaaiij.........EEEddddccddccaaaiiiiccckiaabjj",
    "................kkWWkkkiicac...iiaiij.....cddEEdddddicgddccaaacdcccccccaaabb",
    "................kkcccccabbacc..ibiiij.....cddddEddbddccddiiccccbcccccccbbbbii",
    "..................jjjciaaaaacc..bbiij.....ccciiibbdddckkiicddccbbfcciicbbacci",
    ".........ee..........biiiaaaic..iibii....dEEfEdcbbbkkkkkjcccddccccfciibcaaaci",
    "........eWk...............iiicc.ibbii..dEEEddffccdkkkkkkjjcccdddccbccibcaaaaii",
    "........Wek........j.......iiicciibii.dEdEdddccgddkiiiikkkkcccddddbciiiaaaaaii",
    ".......WWk........jddi.....iiicbiiaiicEddddcbbdccacccdcckkkcccdddddbbiaaaaaaii",
    ".......Wek.....dddjdiic.....iicbaaaaaEccddcccbkccccdddccckffcccddddcciaaaaabaib",
    "......eWkk...ddddccaaacc....iiaaaiaaccaiaacccccccdddddcddbiddccbdccdciiaaabbaic",
    "......WWkk.iEfdcccaaaaccc...iiaaaiaaaaaiaaaccccccdddbdddddjdkkaabccdcbbaaabiiijj",
    "......WWkkkiiccciaaaaacccc...iaaaEEEEEdcaackaddddcccddddcdiaccccbbccccacaaiiiiij",
    "......kekkkfdaaiiiiaiaaaacc..bEEEdddcccccaiaaaddddcdddcdcddiicccccccccaaaaaiabbb",
    "......kkkkccdWiii..iiiaaaaajEEgddddccccjciiaaaadddddddccdddcickccccccbaacaaaabbc",
    "......cckkccdkki.....iiaaaaEEdddddddcccjiiiiaaaacddbdddbdcdccckkccccbdcaaaaaaiic",
    ".......ckkiidWgii.....iiacEddcjjjccddccciibbbaaacddccdddccciddkkcccccdcaaaaaaiic",
    "......jiiaiigWWiicc...cccEfddcjjjccddcccbibbbaaaadddccddccciccckccccbcccacaaaiicj....jj",
    "......jiaaaikWWkiicc..Wcaddddcddjcjjccbbbbbbbaaaaaddccbccabbiiakkcbcbcccaiiaaaicj..jdddcc",
    "......ddaii.kWWkiiiciidcdddddccgWaaiiiibbbbbiiaaaaacccbccabdcccckkbibcccaaaaaaici.Eddccccii",
    ".....jddii..kWW..iiiiidEddddddcWWaaccciiiibbicbaaaaacciiccacccccckiiccciaaiaaaaciddddbbaccj",
    ".....ddcci...Wg....iiaccddeddddibbccccciiiiiacbaaaaaaiaaccabcccaikibcbciiaiaaaaijdddbiaaccjj",
    ".....cdci...kWk.....iaccbcdddddddccccddciiiaacaaaaaaaaiaccbbcccaiiibcbcaiaaaaaiiddcaiiaaacjjcb",
    "....ccddi...kek.....diWcbccjbcccaaaacddcbiiiacaacjcaaaiacccbcbbaikibbabaiaaaaaaddcciii.aaacccc",
    "....dcddc...kk....dcdiibbbbWgbbaaaacccbbbibbaaaficdcaaaaacEEEbbiikiiaabaiaaaaacdcciii...aaacccj",
    "...jddicci.kk...jdEWWjfddccccddccccccaaababbaakciadccaaaaiiijEjiikiaaaaaaaaaaccciiii.....iiiccjj",
    "...jddiiiikk....dgWekjbccddccdcccbaaaaaaaaaaaaccaacccaaciccbbbEiiiiaaaaaaaaaaccaiiii.....iiiicccc",
    "...dddii.......ddWekkiicccccceWkbbaaaaaaaaaaaccaaabfccaciccbbbEEiiaaaaaaaaaaccaaiiiE......bbiiccc",
    "..cddii.......dddgjk..iiiiccdWekaaaaaaaaaaaaaaaaaabbccaaiaccciiEEiaaaaaaaaaaccaiii.E.......biicccc",
    "..cddii......jjiifj....aaaaaWWkbbaaaaaaaacccaaaaaaabdcaaaaaciiacEcaaaaaaacdccgccci.........bbiiccc",
    "..cdbi.......ccaajj...djaaaWWkbbbaaaaaaadddaaaaaaaabdcaaaaaaaaaaEEaaaaacdddcijccccc.E.......bbiiab",
    ".ccdii.......caaaaj...cedcaekaaaaaaabbaddddaaaaaaiibddcaaaaaaaaaaEaaacddddddddcccccckE.......biiaa",
    "..cci.......cfiii......dciikiaaaaaaiibdddbbaaaaaaaabcdcaaaaaaaaaajEcccddddddcccaaccbbE........iaacb",
    ".ccbb.......ciii..........iiiiaaiaaccfdjbbaaaaaaaaaacddcaaaaaaaaacEcccdcccbiiiiaaabbbjE.......iibcc",
    ".ccb........iii.............iiiiiibaccdciiaaaaaaaaaabddcaaaaaaaccccEcbbccciiiiiaaaabbaE........bbicj",
    ".dcc.......ciii..............b...ibbfccciiiaaaaaaaaabbdcaaaaabccccckEbaaiicciidaiaaaaa..........bibj",
    ".dcc.......jii....................bdddiiiiiiiaaaaaaababbaaaaabbbaaaaEdiiiia..gaiiiaaaa...........bbi",
    "cdi.......cjii....................dddjiiiiiiaaaaaaaaaaccaaaaaabbaaiibEiii......iiiiaaa...........biii",
    "cdi.......cii....................ddddjii...baciaiiaaaiicaaaaaaaiibbibbE..........baaaib...........iiaj",
    "ccj.......iii....................dddccij.....ii.iicciaabaaiibbbiiii.c..E.........bbaabi...........iiij",
    "dcj......iii.E..................ccdcbb..............iaabaiiiib.........EE.........biibi............iij",
    "dcj......iiEE...................ccccbb...............jiii...............E.........ciiiii...........iii",
    "cc......dEE.....................ddbaa.............................................ciaiai............iii",
    "cc......Ed.....................jdcbaj.............................................iiaaai............bii",
    "cc.............................ddccj...............................................iiaiii............ii",
    ".jgE..........................ddccc.................................................iiibii",
    "..E...........................acci..................................................iiiaaiii",
    ".............................jccii...................................................iiaaaajj",
    ".............................dccc....................................................iiajaaii",
    ".............................dcc....................................................EEEEk",
    "............................ddbi........................................................EE",
    "............................dbb",
    "...........................ddb",
    "...........................cci",
    "..........................ccb",
    "..........................cc",
    ""
  ],
  legend: {
    E: { pal: C.mint, glow: true },
    W: { pal: C.wisp, glow: true },
    a: { m: "bark", step: 0 },
    b: { m: "bark", step: 1 },
    c: { m: "bark", step: 2 },
    d: { m: "bark", step: 3 },
    e: { m: "bark", step: 4 },
    f: { m: "fang", step: 1 },
    g: { m: "fang", step: 2 },
    h: { m: "fang", step: 3 },
    i: { m: "moss", step: 0 },
    j: { m: "moss", step: 1 },
    k: { m: "moss", step: 2 }
  },
  idle: {
    // The abdomen swells and settles: a spider at rest, which is worse.
    waist: 58,
    breath: [0, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the raised forelegs lift to strike.
    twitch: {
      frames: [6],
      patches: [
        { x: 0, y: -1, rows: ["...........................kEd", "............................dE", "..........................._.d", "........................gk.._", ".......................W....._", "......................W.d_", ".......................gk", ".....................W.k", ".....................ghd_", "......................g", ".....................k", "....................c.kkcc", "...................gWg..i.cc", "................kkWWkk.i..a", "..................cccccabb..c", "................__jjj.i.aa.a.c", ".........ee.......___b.ii...i", "........eWk.........._____ii", "........We.........j......_..i", ".......W.k_.......jddi", "........e......ddd..i.c...._", "......e.k....dd..ccaaa.c", "......W....iEf.cc.a.....c", "..........k.icc.ia.......c.._", "......ke...fdaai.ii.i.aaa.c..b", ".......k..cc.Wi..__i.i...aajEE", "......cc.....kk._..__.i....E.d", "......_...ii.Wg.i...._.i.cEddc", "......jiia..g.W..cc...cccEf", "........a.a.k..k.i.c..W.add", "......dd.ii_......i.iid.d", ".....j..i._....__..i...E.....d", ".....d.cc..._.g..__..acc..e", ".....c..i_..k.k...._....bcd", "....c..d.....e......diW...cjbc", "....d...c....k_...dc..ib.bbWgb", "...j.dic.i.k._..jdEWWjfddccccd", ".......ii.k._...dgWek.bccdd", "...d....____...d.Wek.ii..cc..e", "..c..i._......d..gj.__.iii..dW", ".._____.......______..________"] }
      ]
    }
  }
};
