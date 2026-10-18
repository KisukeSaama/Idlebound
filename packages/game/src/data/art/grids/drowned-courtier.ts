import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Drowned Courtier (BIBLE 8.4): still bowing to the Baron, still wet. A courtier of the
 * drowned estate caught in the deepest of court bows, in three-quarter view: the near leg
 * slid forward on a pointed, buckled shoe, the far knee bent under him, silk stockings gone
 * grey and muddy with the water. His back is bowed long and low under a short velvet cape
 * so heavy with water that it hangs in thick folds, the moon wet along their ridges, beads
 * of it under the tongues of the hem; weeds trail from his shoulders. The far hand is
 * flung up behind in the flourish, fingers spread; the near hand holds his plumed hat out
 * to the company, the ostrich plume drowned and hanging to the mud. Over a sodden, sagging
 * lace ruff the bloated green face is lifted to the company: swollen lids, a bulb of a
 * nose, the mouth hanging open on a few teeth, two pale eyes staring.
 */
export const DROWNED_COURTIER: CreatureGrid = {
  rows: [
    "",
    "..............................................................hg",
    ".............................................................hg",
    ".............................................................hg..h",
    ".............................................................hg.hh",
    "..........................................................hh.hghg",
    "..........................................................ghghghg",
    "................ljjj...cc..................................ghhhg",
    "..............lljjjjjjbccccc.b..............................chhgg......bbb",
    ".............bbjjjgggjjbcccccbbjh......................bbbb.chhhgggg.bbcbb",
    ".............bjjhhhhgjjjcccccbjggggl..................bcbbj..hhhgggggbljbc",
    "............bbghhhhhgbjjlcdcccfggfjjjjb.............jbbbblljbbghhgggggjjljlbb",
    "............chhhhhhhgjjiiccddcfggfjjjjjjj.b.....bbbblkjjaajkbbhhhghggbgggljjllb",
    "............chhhhhhhggjhgbcddcbggjjjjjbbbbbbb.lbbaiilkkjjjjkkbhhjggjjjljlhgjlbbb",
    "...........cghhhhghhhhgghbcccdcfljjkkjiijjjbbijjjbbiijjjjjjikjcjjjjjjjjjjjgggbb.b",
    "...........bhhhhghgghhgghbcddcbllelljjkljjeeiiijjjjjijijjjjiikjbj.bb.lljjjjggjb.bb",
    "...........bjggggEEhhhhgglccbcbljlllllkkiiiiiiiiijjjjiijjijjekjjl...l.bbjjjjgjjl",
    "...........bcghggghhhhghgjcddddljllllkkiikkkjjiiiiijjiijiijjekjjj......bbjbjbjlj",
    "............bhhhhhhhhghggbccdddjljllkkkiljkkjjjjiiiijiijiiijeejjj.......bbjljgjjl",
    "...........cchhhhhhhhhhggcccccjjjjllkjjjllklljjjjbiiiijiiiejeeljjj........b.jgjjj",
    "...........bbhghhhhhhhhggcccccbijjjjjjjljlkjljjjjjliiijiiiejjeejjj........bb.bjjl",
    "............bbhhhgeghhhglcdddciiijeejjjjjljjjljkjjjkjjeeiiijjeekjjj..........bjjlb",
    "............cbggcjjghhggcccddbeeejjiikkjkjjjjljkkjjkjjjjjjjjjeekkjjj.........bjjjb",
    ".............cjjghhhhjjbcdcbcbjjejjjikkiiikiiljjljjkljjjkkjjjeijkjaa.........bj.lb",
    ".............bjghhhhjjjbdddccjjjjljjikjjeekiiijjjjjlljjjikkkjeijkjjaa........bl.jb",
    ".............cbgghhgjjbccdccjjjjjjjlijjjeeekiiljjjlljjjjkllkkkiikjjaa........bl..b",
    ".............cbhhhhbjjcdbccbjjjhgjjljjjjeeejjiljjllijjjijlllkkkikkjaa",
    ".............bbbggbbbbcdcbcbeeeegjkkjikjeeeejiijjjiijjjijjlllkkjjjjiaa",
    ".............ccbbccbbbbcclejeegijjlkjikjjeeeeiiljjiijjjjjjjlkkkjjjjiaa",
    ".............cb.cccbbbjcbjiijegiijljjilejeiieeekjiijiljjaajjjkkkkjbcaaa",
    "..............c.bbcllbjbljiijjfgjjljjilekeiieeeeljjjiljeaajjjkkklljcjaa",
    "..................bjiiijjjiiajfiijljjilekeeiiieeikkjikkeeeaaaiijllcggaa",
    "..................bbjiijjjaiajjiijljiiliiiiieeieekkjjkleeeeiiiijllchhgjj",
    "...................bjiijjlajjjjjijljiilijiiijjieeikkjjleeeeeeiiijcghhhhj",
    "...................llajjejjaajijekljiiljjkiiiiiiiiikjjljeeeeiiiijbghhhhhg",
    "...................bbaajeeeaajijekljiikjjkiijjjiiiijjjljeeieiiijjbhhhhhhhg",
    "...................ljbajeeeeeiiaikljiikjilijiiiiiiiijjlkeiieiiijbbhhhhhhhggb",
    "..................bljiibieeeeiiaikljiikkikijjjjiiiiiijlkeieeiiiejjghhhhhghhj",
    "..................bjiiiiileeeeaiilkjjikkiiijjjjjjjjjjjlkiieeiieeijffhhghghgjj",
    "..................bliiiiieeieeaiklkjjikkeiijjjjjljjjjjjkieeeieiiijjeghehghgea",
    ".................bbjjjiiiieieeaaklkjjijleijjjjjbbjlljjjjjeeiieiiijjeegeehggia",
    ".................bbjjjjjiiiieeajklkjjijliijjjjbcccllljjjjeieeiieijjeeeeigfiiii",
    "................bbjjjkjjjiiieeajklkjjijljjiijbccdcdcbjjjieieeiieeeeejjiigfiiii",
    "...............lljjjjkkiiiieeibjklkjjijljjjjjbccccccbjjjieieeijeejejjljiggliij",
    "...............jjjjjjjijiiiieibjkljjiijljljjlbbccdcbbbjjjeieeijeejjjlllggggljj",
    "..............bccbjjjjijaiiiijjjlljjiijljbjljbcchdcbjbjjjeiieijijjejjllggggljj",
    "............hcccghbjjjiiaiiiibjjllkjijjljljbjbbdhdcbjjjjjeieeijiijeijjggghgjjb",
    ".......bbbllhhhghhhbjjiiaiiiibjklkkjijjjjjjjjbchhccbjjjjeeiiiijiiieiiiggggljjj",
    ".....bbbjbljjegghhicijiiiiiiljjklkjjijjiiiiijbchdccjjjeeeiaiiikieeeiiijgggjjjj",
    "....bjjkbjieegehgfiiiijiiiiibjjklkjjiiiiiiiijbcddcblijeeiiaaiijieieeijjgggjjjb",
    "...bkjlkkieeehghgfjbiejiiiiibjjklkjjjiaiaiiijbcdccbjijiiiiaaaijieiieeilgjjjjjb",
    "..jkkklkiiieegfggjjbiejiiiiajjjkljjjjiaiaiiajbcdcbbjiiiiiiaaaijjiiiiiilljjjjb",
    "..jkllleeeeieeffjjbjjejiiiiajjklljjjjijaaaiajbcdcbcjiiiiaiaaaijjiiiiijljjjj.b",
    ".bjkkleeeeeiieeiilijjiiiiiibjjkljjjljijaaaiajbcdbbbbiiiiaaaaaijjiiiiijjjjjj",
    ".jjkkjjeeeeeieeiiiiijiiiiiibjjjjjjjjaalaiaiailbbbjbbbliiaaaaaijliiaiijjjjlb",
    "jjjjkjgeeeeeiieiiiil.iiaaaajjjjbjljiiaaaiaiaiiljljlbcbliaaaaaijliiaijjjjj",
    "jjjjjfgeeieeiieiiii...ilaaaajjbbhbjiaaiaiaiaiajjjjlbcbbjaaaaaaakiiaiaajjj",
    "jjjjjffeeieeiieiij....l.aaajjbbdhjjaaaiaiaiaaaajbblbbbbjaaaaaaakiiaaaa.ll",
    "jjijjffeiiiiiieiij......l.bbbbhccbjaaaiaiaaaaaaaabbbbbjljaaaaaakjiaalj..l",
    "jaijjjfeiiiiiieiij........bbbghccbjaaaaaaaaaaaiaaabbbllljaaaaabkjia.bj",
    "baijjjfeiiiiieiiij........bbbgcccllaaaaaaaaaaaiaaaabbbjlljaaalbkjii",
    ".aajjjjeeeeiiejij.......b.bbcgccbl.baaaaaaaaaaaaaaaabblljjjb..jkjjb",
    ".aaajjjeeeiiejjij.......bbbcbbbbb....laaaabaaaaaaaaaabbljjljj.jljlb",
    "..jajjjejjieejjjj........bbccbbb.......aaabaaaaal.bal.bbjbjjijjlj",
    "..jjajjjjjjejjjjl........bcbbbbj........l.caaal.......bblljjijijj",
    "...jaaiijjjjjjj.........bbccbbb........................bjjjjjjibj",
    "....aaaiijjjjj..........cccbbb..........................ljjjjjjj",
    "......jjijlj...........bccbbb...........................bbbljijj",
    "........b.b...........bcccbb............................bbbjji",
    ".....................bbcbbjl............................bbjjj",
    ".....................bbbbcll............................ljjjjj",
    "....................bbccbbj.............................lljjjj",
    "...................bbccblji............................jljjjj",
    "..................jbcccbjji............................ljjjji",
    ".................jjgccbbbji...........................bjjjji",
    "................ljjggbbbjjj............................jj",
    "..............bbjjgggbjiiij",
    "............lggggggffjjiiij",
    "...........jjggggjjjjj",
    "...........jjjeeeejjj"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "ruff", step: 0 },
    b: { m: "ruff", step: 1 },
    c: { m: "ruff", step: 2 },
    d: { m: "ruff", step: 3 },
    e: { m: "skin", step: 0 },
    f: { m: "skin", step: 1 },
    g: { m: "skin", step: 2 },
    h: { m: "skin", step: 3 },
    i: { m: "velvet", step: 0 },
    j: { m: "velvet", step: 1 },
    k: { m: "velvet", step: 2 },
    l: { m: "velvet", step: 3 }
  },
  idle: {
    // A drowned breath: water rattles in, the bowed back lifts, and slowly settles.
    waist: 46,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the bow deepens, the face still lifted to the company.
    twitch: {
      frames: [7],
      patches: [
        { x: 8, y: 5, rows: ["", "", "........____...__", "......__l...___..___._", "....._ll..jjj.bc...._.__", "......b.jjgg...b......bj", "...._.jj.....j..c.c..bj", "....bbg......b.jl.dcc", ".............j.iic....f", "..._c....h..ggjhg..ddcbg", "...cg...hghh.......ccdcf", "....hhhh.hgg..g.hb.dd", "....j.g..EE...hg.l.cbcb", "...bcg.ggg...hgh.j.d...l", "..._b........g...b..ddd", "...cc.h...............jj", "...b.hg..hhh....g.ccc.b", "....b.hhhge...h.l.d..cii", "....cbggcjjg.hgg.c.dd.ee", ".....c.jg...h...c.cb.b", ".....bj.h..h..jbd.d.c", ".......gg..g..bccd.c...j", ".....c.hhhh.jj..bc..jjjh", ".....bb.ggb...cd.bcb..ee", "......cbb.....b.cleje", ".....cb.cc.bb..cb....egi", "......c.bbcllbjbl...j..g", "...........ji.....i...f", "..........b......j.ia..i", "...........bjii.jlajj.j", "...........ll.j..jj"] }
      ]
    }
  }
};
