import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hollow Page (BIBLE 8.5): a page boy's livery with no page boy, still carrying a
 * message. A crimson tabard gone thin, gold border and a crowned badge, slashed sleeves
 * and empty hose striding forward on pointed shoes; a velvet cap with a raked plume sits
 * on violet fire where the face should be, a shadowed hollow in it with two white points
 * and a grin. Its pale gloves thrust a letter sealed in red wax at the company like a blade.
 */
export const HOLLOW_PAGE: CreatureGrid = {
  rows: [
    ".................gh",
    "................ghhhh....hh",
    "...............gghhhhhi..hh",
    "...............ghhggggiihhhhh",
    "...............gggeeeghhhhiih.h",
    "...............gh..eelbbbbbhhhih",
    "...............hh.ffbbcccccbhhii",
    "................ihffbcccccccbbhh..h",
    ".................ggbccccccccbbbbbbgg",
    ".................hibchjccbbbbbbbbagg",
    ".................hhbbhhcbbbbbbbbbggg",
    ".................ggbbhhhbbbbbdff..h",
    ".................hdkkllllkkddda",
    "................hdddkllkkkdddh",
    "...............hdkkhhhkkkkddhk",
    "..............hddkklllkkkhghkhd",
    ".................hEddddEdihhhhdg",
    "..................kddddhdihhidddgg",
    "..................hddddddhihkkkkfffkhd",
    "..................hkdddddijikkkbblllkdd",
    ".................fkkdddddjihhlbccllkaffb",
    "................haakddddiihillcclllbbbbbb",
    "................haaahdhijkhhlcccllbcccbbkk",
    "...............kkdddhijjhhhllccllkbccclldd",
    "..jj...........gkkddddhddhllcccllbcccllddd",
    ".i.ic..........gkkddddddfllccccllbcbcldddkk",
    ".iiccc.........gdffeadddllccccclkbbkldkkkkkk",
    "..hbbbb........hfffeeablbcccccclkebkddhkhldd",
    "...acbb........kkdgebblbccclccclkelddhhhhkkd",
    "...abcbb......hkddggadllkbllcccbkkddkkhhkhhh",
    "....bbbb.ij...hdddgedddlklbbccbbkddddklkhijhh",
    ".....bhiiijh.hddkddeffkklklblcbbkddddkkijijjih",
    ".....hiihghhkkddkddedddlkkbbbcbbaadddkhiihhjigk",
    ".....hkiihhhdddddddeaadkllbbbccbbaddddkkkdijlkkk",
    ".....hhhjjhkhhhkdddaaadklkklbbcbeaadd..dddljhkdk",
    ".....hhhiihkkddkkddaaddkkklbcbbbeaada..ddkliikdk",
    "......hhiihkkdddkdkaaedkkkbccbbbeaaaa...dkghihkdh",
    ".......hhffkddddkkkaaebkbbbccbbbeeaa....dddhiikdh",
    "........aadddddddk..ebbllbbbcceebbaaa...kkddhihdk",
    "........bcddddkkk...ebbkkcbbccbebaaaa...kkkdgihdk",
    ".........c..ddk.....ebekkbcbbccbeaaaa....khdkhlkkk",
    "...................eebeklbbcbbcbedaaa.....kkkkdddk",
    "...................eaabklcbbcbbbbbbadd.....kkijidkd",
    "...................edbbkklcbccbbbbbadd.....ijjjiig",
    "...................ebbkddlbccccbbbbadaf...ijjjjiih",
    "..................gbbkkddlbcccccbbbaaaf...ijhijjjih",
    "..................gbblddddlccccccbbeeaaf..jidhjhjhh",
    ".................hbbldddddlccccccbbffaaf..ii.hjhihh",
    ".................bbldkkkddklccccccbbfeaaf.ii.hjhihh",
    ".................bhkdhhhkdklbcccccbbfeaaa.h..hhhhhh",
    "................hfkkghhhkddllccccccbbeeaee...hhhkk",
    "................gfffhhhkkddllclccccbbeeaeh...hkh",
    "...............ggdfhiihhkdddllllbccbbbeaa",
    "...............gkdhhjjihkdddlllbbbcbbkkk",
    "...............hk.hijjjigdddkllbllllkkk",
    "..................hijjihddddkllllddddd",
    ".................hijjiihkdkkhkfddddddd",
    ".................hjjjihih......ddkkkdddd",
    ".................hiiihii........kkhkkdddk",
    ".................khhhkih........hkhhkkkdk",
    ".................kkhkhh..........hhhkdddd",
    ".................kkkhhhf..........kkkdddk",
    "................hkkghhhf..........kkddkkk",
    "................hkhllllk............kkkkkk",
    "................hkhklfkk.............kkkkkk",
    ".................kkkkfkf..............kkkkkk",
    ".................kkkhkff..............hkddkk",
    ".................kkkkkk................kkkkk",
    ".................kdkkkk................hkkk",
    ".................kdkkk.................hkkk",
    "................hkkkk..................kkkk",
    "................kkkkk..................hkkk",
    "...............ghhkk...................hkk",
    "...............ddhkk..................kkk",
    "..............kkhkkdh..................k",
    "..............khhkkk",
    ".............khhkhkkd",
    "............hkhfkkkd",
    "...........hdhhddddd",
    "..........kkhhddd",
    ".........khhkkdd",
    ".........kkkk"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "cloth", step: 0 },
    b: { m: "cloth", step: 1 },
    c: { m: "cloth", step: 2 },
    d: { m: "dark", step: 0 },
    e: { m: "dark", step: 1 },
    f: { m: "dark", step: 2 },
    g: { m: "dark", step: 3 },
    h: { m: "dark", step: 4 },
    i: { m: "pale", step: 2 },
    j: { m: "pale", step: 3 },
    k: { m: "trim", step: 0 },
    l: { m: "trim", step: 1 }
  },
  idle: {
    // The empty livery rises and settles as the fire in it draws breath.
    waist: 56,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the sealed letter is thrust out like a blade.
    twitch: {
      frames: [6],
      patches: [
        { x: -1, y: 22, rows: ["................ha.._", "...............k.d.._", "..j._..........gk.d._", ".i_ic_.........gk.d._", ".i.c.._........gdf.e_", "..hb..._.......hf..e_", "...acb._.......k.dge_", "...abcb._.....hkd.g._", "....b..._ij_..hd..ge_", ".....bhi..jh_hd.kd.e_", ".....hi.hgh.k.d.kd.e_", ".....hki.h..d......e_", ".....h..j.hkh..kd..a_", ".....h..i.hk.d.k.d.a_", "......h.i.hk.d..kdka_", ".......h.f.kd...k..a_", "........a.d......k_", "........bcd...k.._", ".........c_.d.k_", "...................e_", "...................e_", "...................e_", "...................e_"] }
      ]
    }
  }
};
