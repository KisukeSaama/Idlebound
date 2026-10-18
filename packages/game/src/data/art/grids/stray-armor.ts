import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Stray Armor (BIBLE 8, events): an empty suit of plate walking the road in the wrong
 * direction. A full harness mid-stride, facing right, away from the company: a bascinet
 * with its visor swung up on nothing but dark, gaps of dark at the neck, the elbows and the
 * knees where a man should be; a torn red surcoat over the plate, its hem in rags and a
 * rag of a crest trailing from the helm; the near hand dragging a sword by the hilt, its
 * point scoring the road behind. Two small violet embers far back inside the helm.
 */
export const STRAY_ARMOR: CreatureGrid = {
  rows: [
    "....................................fffff",
    "..................................ffhkhffff",
    ".................................ffhhagelffff",
    "................................ffhheeeelllfffh",
    "...............................ffhgllfffllllfffh",
    "...............................fhgdlfffffllehfff",
    "............glfhbbl...........ffhdllfffffflehhff",
    "...........bgglfffbbl.........flaaellfffffldhhhf",
    ".............kbbbbbbbb.......fhhaadellffffllkhhf",
    "..............lbbbccbbb.....hhghaadeeflfffllkkhf",
    ".............kgjaaiibbckkkhhggglaadeelllliiikjhf",
    ".............kllaajaaaaabbbaggfhaadeelffliEiEghf",
    "..............l..ejjjjaaabbbhffhaadeelfflliiijhf",
    "...............llkk..jjjakk..flddllellfflliiiah",
    "................lk...........hhidlllllffllliiah",
    ".............................fkiieeelllflllejaf",
    ".........................hhjjiiiiiiilffllleeehl",
    "......................hhhbjjelddjiiiilfllleeehl",
    ".....................hhhbbbjldeejidiiiieeeeekh",
    "...................hhhbbccccdllfeedaiiiieeeekf",
    ".................lhjidbccccccdfffedaaaaiidkkhh",
    ".................ijaadddcccccblffeddaiaiikkkh",
    ".................jjiidlffcccccblleddaiiiikkhh",
    ".................ijiidfflcbbccbddddddiiiikkkhh",
    "................hhiidddfeddacbcddjjbbaaiiikkhh",
    "...............hhiiddddieeddbbcbdjjbbbbbiikjjhh",
    "..............lhjeddajjiieeebbcbdggdbbbiigkjjhh",
    ".............llddedleeeiiieibbcbbggddeekkgkkjh",
    "............hldddellllliiiiiibbbfdddleeekgkkih",
    ".........lhehddddellleeiiiiiibblldaalllekkkggh",
    ".........hdaaelldellleiiiiiiibbllleelelekkhgj",
    ".........hdaaelldddddjiiiiiibblllllllelekehaa",
    ".........hdaaeldiijjjhgiiiaaggaelllleelfgehjk",
    ".......lkdddffleiii..hgiiiiajddelllleelleejjk",
    ".......lkadlfffee....hhiiiiajdddlllleeedeejjkk",
    ".......lhaelffled.....hjjaaaddllddeleeeglejjkiil",
    ".......lheelffldd.....hhabbbddlleeeeddeeljjjiiah",
    ".......lhjelffedd.....hhaabcbbdddddddddlliiiiiih",
    "........ljeffleee.....hhbbbbcbbddddeedeliiiiiigh",
    "........haefflge......lhiggbbbbjdeeegdeeiiiiiiahl",
    "........hieffegg......lkiiiibibjjjjjggeddiiiaaaal",
    "........lieffdd.......kiiiiiedijaaalggjjekiaajjah",
    "........laefldd......hhiiiiieddjjjaeaaajlhaaajjah",
    "........laefld......hhgiiiiiedijjjdaaaaj..hggjjaah",
    "........laefld......hgggbbbbiiiijiaaaagg...egjgggl",
    "llfk....ljefll......hgggcbbbbbbjjiajjaag....kggggah",
    "eeekkkaieialdd.....hhgbbbbbbbbbbbaadddagg....gggejheee",
    "eeeiiiaiiidddddlllhhggbbbbbbcbbbaabdddgii....kkaeddgel",
    ".....iiiggeelddhhhhhaggbbbbcbbbbbbbbabgikk....aaddde",
    ".......eggeeldjjhghgagbbbbcbcccbbbbccbbikk...aiiiddg",
    ".......eddddedjjllhjjbbbbcbgccabbbbbcbbakkh.eaiiiddj",
    ".......jddleeddjfljjjabbbbbcciicbbbbbbggcbhh.aaiiijjg",
    "........djiiiidlfhggaabbcbccjeibcbbbbbabcbbbe.aaiiijj",
    ".........eiiiielfhgiabbccccdflebcbbabbabccbje.eaaaiaa",
    "............ddddlljibbbcbagfffedccbgggacccbee..aaaaah",
    "...............hdllbbbcaaaefffeebcbbaagccbcgeeejjjaagl",
    "..............hhddllbbbijdkfffddacbbbabccaageege.jdegll",
    ".............hhbbbdlkbiijdefffkaacbbbbbccdedkk....eeejl",
    "............hhhggbbdeiiaadelffbddcbbbbbcbeeeddk....eeegl",
    "............hhaajjggeeaaaaelffeddbbbcbbbbdeedddl....eeekl",
    "..........lbkjaajjgggeaaaadlffeddbbbccbbbddedljh.....eeelh",
    ".........llkbjjjjjggggeaaadelfeddbccbccbbdddlflhh.....eegl",
    "..........bb.jjee.glggjaaadelleddbclbbbbbaaalffdh......eegl",
    "..................llg..aaiiddeeddbbb.bibbaaddlldh......eeekl",
    "........................iidddeaadbll...iiadddddah.......eellh",
    ".....................iiiiddlffeddbb....iiiieeeegl........lldl",
    "....................iiiidddlfflgd......iiiieellll.........llgl",
    "...................liiiidddlfflgg.....kiiiiieeel...........eekl",
    "...................laaddeeeeffege.....kiiidejejl............lll",
    "..................lldddddddeeegee.....kiilledjgl............llll",
    "..................ldddeedddeelee......iiilledal..............lll",
    ".................hkddeeleddeele.......kadlledjl...............lll",
    "..............hhhhdeeeeleedd..........kaddeedjl................ll",
    ".............hhhjjdeeeeee.............ejddeeejl",
    "............ekiijddeeee................ejeeeejl",
    "............diiddddeee.................eeeeeeell",
    "............daaddeeee...................eeeeeehl",
    ".............aajjeeje....................ddeeehl",
    ".............aajjdiii....................edellll",
    ".............dadddai.....................eddllll",
    ".............daddaaad.....................ddelfhh",
    ".............djddaaad.....................ddeeflhe",
    ".............djjiiaajj...................ldddeffiie",
    ".............djjjiijad...................jddeeliiige",
    "..............jjjjjjaa...................egdddjjeeggjj",
    "................i.j......................egaiijjeeejjjjj",
    "..........................................aaiiaajjjeejjj",
    "..........................................ddiiiijjddjjjjd",
    ".................................................dddjjjellll",
    ".......................................................eeeell",
    ".......................................................eell",
    ".........................................................lf"
  ],
  legend: {
    E: { pal: C.violetFire, glow: true },
    a: { m: "cloth", step: 0 },
    b: { m: "cloth", step: 1 },
    c: { m: "cloth", step: 2 },
    d: { m: "plate", step: 0 },
    e: { m: "plate", step: 1 },
    f: { m: "plate", step: 3 },
    g: { m: "shadow", step: 1 },
    h: { m: "shadow", step: 4 },
    i: { m: "steel", step: 0 },
    j: { m: "steel", step: 1 },
    k: { m: "steel", step: 3 },
    l: { m: "steel", step: 4 }
  },
  idle: {
    // Nothing breathes in it, but the plates rise and settle on the stride.
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the rag of a crest streams back.
    twitch: {
      frames: [7],
      patches: [
        { x: -1, y: 0, rows: ["", "", "", "", "", "", "............glfhb.l_", "...........bg.lf..b.l_", ".............kb......._......f_", "..............lb..c.b.._....h._", ".............kgja.i.b.ck..h.g._", ".............kl.a.ja....b..ag._", "..............l_.ej...a..b..hf_", "...............l.k._.j..ak._.f_", "................lk_..........h_", ".............................f_", ".........................h.j.i_", "......................h..bj.el_", ".....................h..b..jld_", "...................h..b.c...dl_", ".................lhjidbc.....d_", ".................ija.d..c....b_"] }
      ]
    }
  }
};
