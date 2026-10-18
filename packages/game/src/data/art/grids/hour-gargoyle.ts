import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Gargoyle of the Hours (BIBLE 8.5): it counts the nights on its own claws, and it ran
 * out of claws. Crouched on a broken cornice of the Keep to spring, head thrust down at the
 * company with the jaw dropped on its fangs, eyes lit under a hard brow, horns swept back;
 * one bat wing half open and torn, the tail hung over the back of the ledge. Its hands grip
 * the edge: some claws whole, some snapped to stumps, and the tally scratched into the stone.
 */
export const HOUR_GARGOYLE: CreatureGrid = {
  rows: [
    "..................................................................jjjj",
    "..............................................................hgggggjj",
    "...........................................................jjjjeeeeg",
    ".......................................................jjjjjjeeeeeh",
    ".....................................................jhhjjeddeeiij",
    "..................................................hhhhjdeeeiiieiij",
    "................................................jjhhjdddeeeiiiiiaj",
    "..............................................hhhhjddddeeeiiiifjabb",
    "..........................................j..hhhjddddeeiifiiiifjabb",
    ".....................................hj..hhjjhhjdddeeiiifffffiifgabah",
    ".....................................hhjggjjjjjddddeeiiiffffffffijjjj",
    "......................................hhgijjhgggdddfffijjggfffffiijjjj",
    ".......................................hjiggggggdgdieeejjjjjjjfffiiijj",
    "..........................................ggffgidddieeeejjjjjjjgffiii...hh",
    "...........................................hffiiiddeeeeeiijjjgjggfggffjjhhj",
    "...........................................hfiiddiiieeeeiigfgggggggggabbbjjj",
    "............................................hgiddiieeeiieeifgggggggggbbbb",
    "............................................hggddidddeeggeeeegggggggaabb",
    "............................................hjggdddddeeeejjeeegggfgggaaa",
    "............................................hgjjdddideeeejjjjiigffgggaah",
    "................................jj..........heejjddieeeeejjjjjjeffigggg",
    ".............................hhhjh..........heejjdeeeeeeeejjjjjeeeiiigg",
    "............................hhhgihhi.......kheeejeeeeeeeeeijjjjgeeeieejj",
    ".......kh................hhhhhgjjiiibba...kkeeedhfdeeeeeeeegjjjggfieeejj",
    ".......kh..............hhjhhkjgjjjiieaaajhkhefedjfdeeeeefeeegjjjjiiieejj",
    "........hj............khfjhkhjjhgfjjeeejhhjdeffijeeeeeeeffgiijjjjiieeeij",
    "........kj.........h.khjghkkjjjhhhhjiiiiiiijjjhhheeiieeeeggiiijjjjjfeeijj",
    "........kjj.......kjhhjjhkkhjjjhhhjiiiiiiijhhjjgdeefieefegggiffjjjjiiieej",
    "........kjj.......kihjjhkkkhjjhhhhjjiijgijhhjjdddeeffgefeejjjeffjjjjiieif",
    "........khj......khjjjhkkkhffjhhhhhdjjjgghhjeddddefjjjeeejjjjiifjjjjjiiiij",
    "........khjh...kkhjjjhkkkhgiijjjhhggjjjjjjjeddddeifjjjjefejjjiiijjjjjiiiijj",
    "........khha...khjhjhhhkhjdddjjjjjihhjjjjjieddddeifjjjjffejbbiiiijjjjeeiijj",
    "........khhjj.hhhhhhhhhhjiddghjjjjjhjjhhjjiedddddeejjjaaieabbbgiijjjjjeiiij",
    "........khhhjajhjhhhhhhhiiidghjjjjjjjjhhjjeeeddddeejjjbbiiabbbbffjjjjjiiiih",
    "........khhhheijhhhhhhhiidddghjjiiifjhhhhjgeeidddddjjbbbgaabbbbafijjjjjeeeh",
    ".........kjhhifhhhhhhjiiiddddheeeiiihjhhhjgeejjdddddabbbaaabbbbbfijjjjjeee",
    ".........khjjfjhhhhhgffiedddjjeeeeiifhkhhjgeehjjedddbbhhbaaccbbbaijjjjjeee",
    "..........kjjjhhhhhhhffiiiigjddeddefjjhhhjjedjjjgiidi...haaccbbbaiijjjjjeeg",
    "..........hjhjhhhhhhhjeeiiiedddiddefjhhhhjjddjjjgiiiab...abccbbbbgabjjjjeee",
    "...........kkhhhhhhhhjeegieeeedidddejhhhjjgedgjjggiiab....b.cbbbbbbchjjjeee",
    "...........kkhhhhhhhieehheeeeeddddeejhhhhggeddjjjggiaab.....ccbbbbakkjjjgee",
    "..........khhhhhhhhEEffhheeggggddddijhhhhggeddffjggiaab.....cccbbbakhjjjgeej",
    "..........kkhhjhhhjdfjhhjiijjjgddddijjhhjgfeddfffgjiiaab...cccccccbcg.jjjeej",
    "...........hjjjjiddjjjjjfiggjjdddddifjjjjffdddeggijfiiabb..cccccccb....jjeej",
    "............jkhhgggjjgddjgggjjdddediffjjjiidgeeegiffiiaabcccccccccb....jjfej",
    "............kkhhhjhjfdddgggffjdddeeeefiiffijjeeeefffiiaabbcccc.ccc.....hjfee",
    "............khhhhhhjfdddgggfiidddeeeeeeeiiihhjeeefeeiieaabbccc.ccc.....jjfef",
    "............khhhhhjjhdddggeiiidddiiiddeeiighhjidddeedieiiabcc..ccc.....aj.ef",
    "............kjjjhjjdddddgeeiieeedijeedjhhjhjhgiddddeddeeiebbc..ccc....ha..gg",
    "............hhjjghhdddffeejjieeejjjhgdjhhhhjjgiddddffdeeeaaa..ccc..........gg",
    ".............hghkgeggfffehjjjeeejjhhjjjhhhhhffgddjhhjjggaaaab.cc...........jj",
    "..............hhkggghfffkhkhjjjjjjhjjffhhhjjjggddhhhjggggabaacc............jj",
    "................hggahjjjkkkhhhjjjjjjjffjhhjghgigghhhggggggaba...............j",
    "................hhaahjjhkkhhjhhjeeiiiifijjjghhiighhjgggggffaa",
    "...............kkhjggffhhhjdeeddjhiiggfieiijhhigggjjjddggffaaa",
    "...............kghjgffgjeeddddddddjjjjjiedihhjgggejjjdddefiiaa",
    "..............khiggifhheeeddddddddddjjjifdjkhjigeejjiidddiiiaai",
    ".............kkhgiiikkjeeeeeeddddddddjjefjhhhjiiddjjeedddiieiiig",
    ".............kkhjeiikhgeeeeeeeeeeddddddejjhhhjiiddiieejddeeeieeg",
    ".............khhjeeehhgieeeeiiieeeedddddhhhhjjiiddeeiijgddeeieeej",
    ".............khhjejijjgieeddddiiiiieedddhhhhhjiiiddeggggideeideijj",
    ".............khhjjjiijffeeiiiddeeiieeeddhhhhhiiieeeeggggiddeiddijjj",
    ".............khhggiffhfeeeiiieedddiieeddhhhhgiideeeeegeiiddddddeejj",
    ".............hhhiiif..heeeeiiiedddeeeeejhhhjiidddeeeeeeeedeegdeeeejj",
    ".............khhffgg...hiieeeedddheeeeehhhjjiiddddeeeeeeeee..ieeeegg",
    ".............khhigg......ieeeeeddd..eefhhhjjiddddddeeeeeee....ieeeegg",
    ".............khhig.........eeeeeedee..hhhjjidddddddeeddeeh.....eeeeggj",
    "............kkhhgg...........eeeddea.hhhhjhi.d.ffdeeedddee......eeeegj",
    "............khhjij...........heeedeajhhhhjji.......fddddddi.....eeeeef",
    "...........jhhhjij.........hheeeeeeehhhhjjj........feeeedd.......eeeegg",
    ".......hhhhjhhggjj...hjahhjhieeeeeehhhhhjjf.......eeeeeiii........eeegg",
    "......hhjhjjhjiigjjjheejjjiiieeeeejhhjhjjfi......iieeeeiii........jiegg",
    "......hjfffjjieedjjjeeegjeiiiddeegghgjjhjf....egggieeeeii.........jieigg",
    "kkkkkkhjjfjhgedddeiieeigeeeedddhhfjjffjjff...hdggfeeefeiif.........eiigg",
    "kkkkkhhjjjjhgghhkkkkhhhhhhhhhjjhhhhiihjifejjggddhddddffiee.........iiigg",
    "hkkkkhhfejjjgghhkkkkkkkhhhkkkkhhjhjiiggieeijgdddhddddeeedeeiiiiggjjjiigj",
    ".jhhhhhfejjhgjhhhhjhhkkkhkkkkhhjjhjdjhgdhkkkhhhjdidjggggjggffiiggjjjheijh",
    "..jhhhhfijjgghhhhhhhjhhhhhhkkkhjjjjdjjeehhkkkkhgghhhhhjjjjjjjjjhgggfjeigg",
    "...jjhhhijjhhhhhhhhkhghhhhhkkkhjjjjijjeehhkkkkjehhhjjggggggggjffgggfjiigg",
    "....hhhhhjhhhhhhhhjhhjjhhhjkhhhjjjeejjjghhkkkhhhhhhgggggggggggffggggjiigg",
    ".....hhhhjjhhhhhhhhhhkjhhkhhhhhgjeeejjjjhhkkkhhhhkggggiggggffffggggggfffg",
    ".....hhjjjjgjjhhhhhhkkhhhkhhhhhhjjeeedjhhhhkkhhhhhggggiggggfffgggggjfffjj",
    "..........gggiiideiijghhhhhhhhhhhhgehgjhhhhkkhhkhhjgggiggggggfffffgjfffjj",
    "...........gjiiigiijjggfiieeefjjjjgghjhhhhhhhhhkjjjffiggggggggffffiiffgg",
    "............jjjjjiiiigiiiieeefgggiifdffggjjhghhhjdjfiiiddddddddddf.iiggg"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    a: { m: "fire", step: 0 },
    b: { m: "fire", step: 1 },
    c: { m: "fire", step: 2 },
    d: { m: "hide", step: 0 },
    e: { m: "hide", step: 1 },
    f: { m: "hide", step: 2 },
    g: { m: "hide", step: 3 },
    h: { m: "hide", step: 4 },
    i: { m: "stone", step: 0 },
    j: { m: "stone", step: 2 },
    k: { m: "stone", step: 4 }
  },
  idle: {
    // A slow breath of stone, the wing lifting with it.
    waist: 59,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the torn wing half opens.
    twitch: {
      frames: [7],
      patches: [
        { x: 35, y: -1, rows: ["................................jjjj", "............................hggggg.j", ".........................jjjjeeeeg_", ".....................jjj...e....h", "...................jhh..edd..iij", "................hhh.jde.eiiie.ij", "..............jj..jd.d..e..i..aj", "............hhh.jd..........fjabb", "........j.....jd...e.iif...ifja.b", "...hj..hhjj......e.i...ffffiifgabah", ".._hhjgg..jj....d.e..i....ff.fijjjj", "..__hh.i..hggg..dfff.jjgg....fii..jj", "...__hjigg...g.gdieee.jjjjjj.ffiii.j", "....____..ff.id.di..ee.....jjgff.ii...hh", ".......__h.f.ii.d....eii...gjggfggffjj.hj", "........_h...d.iii...e.igf.g..g..ggabbb.jj", "........__hgi.d.....i.eeif........g...b__", "........._hgg.d.dddeeggeeee.......aa", "........._hjggd...d.ee.jj.ee...f.ggaaa", "........._h.jj...id...e.jjjii..f..g..h", "........._heejj.di....e...jjje.fi.ggg", "........._h.e.j.e.....ee....jeeeiii.g", ".i.......kh.eej........ei...jg.ee.eejj", "_ibba....k...dhfd......eeg..jggf...e.j", "_ie.aajh.h.fedjfd.....f.eeg.jjj.ii.e.j", "_jeee..hjdeffije.....effgii...j....eij", "_jiiiiiiijjjhhh..ii..ee.g.ii..jjjf.eijj", "_........hhjjgd.efi..fe.gg.ff...jii.eej", "_j..jg......d.d.effgefeejjjeff..jj.i.if", "_dj.jgg...e...d..jjje.....jiif...jji.iij", "_g..jjjj.......if..jj.fe..j.ii....j...ijj", "_hh.....ie...deif...j.fe.bb..ii...jee.i.j", "_...hh.jie...ddee...aaiea.bbg.i...jje.iij", "_..j.h.j.ee...d.e..jbbiia..bbff....j...ih", "_f...hhjg.ei..ddd....bg.a...bafi...jjeeeh", "_i.j..hjg.ejj...dda..b..a...bbfi....j..e", "_if.k.hjg.ehjje..d..hhb.acc..bai....j..e", "_.jj..hjj.d..jgiidi___h.a.c..baii...jj.eg", "_f....h.j.d..jg.i.ab.__.b.c..bbgab...j.ee", "_ej.....gedg.jgg.iab..__b_c...bb.ch..j..e", "_ej..hh.gedd.jjggiaab.._._cc....akk..jg.e", "_ij...h.ge.dffj.gi.ab...._.cc..ba.h..jg.ej", "_ijj..j.fe.d.ff.jiiaab......ccccbcg_.jj.ej", "_ifjj.j.f..deg.ijfiiabb._......cb_.__.j.ej", "_iff..jii.g.eegi.f.iaabc.......cb..._.jfej", "_eefiiffijj..ee..f.i.abb...._..c...._hjfee", "_.eeeei.ihhj..e.ee.ieaabb..c_..c...._.jf.f", "_idd.e..g.hjiddd.edieiiab..._..c...._aj_ef", "_eedjhhj.jhgi..ddeddeeiebbc._..c....ha._gg", "_hgdj.h.hjjgi...dffd.e.aaa.........__..__gg", "_________________________..___..........__"] }
      ]
    }
  }
};
