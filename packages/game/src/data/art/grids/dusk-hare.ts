import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Dusk Hare (BIBLE 8.1): always running toward dusk, never arriving. Gaunt and coiled to
 * bolt, the head thrust low at the company with the lip split over long teeth; ears laid
 * flat along the back, the near one torn at the tip. Ribs through a lilac-grey flank, a
 * bristling spine, a great thigh over a long foot. A bulging amber eye.
 */
export const DUSK_HARE: CreatureGrid = {
  rows: [
    "...................................bb",
    ".................................hcab",
    ".bb.............................hhaahb",
    "hbbb...........................hhaabhb",
    "hbbbb.........................chaabbcb",
    "hbbbbb.......................ccaaabhc",
    "hbbhbb......................ccaaaahhc",
    "hhbhhh......................cfaaacchc",
    "hchhhhhhh..................cffaabcchc.......b",
    ".chhhhhchb................cbaaabbcchh..hhhhcbbb",
    ".chhhhhcccb..............ccaaaabccchh.ccchhhhhbbb..........hddcc",
    ".cchhhhhcchh.............dhfaabbcchccccchhcchhhhhhbb......ceedddcc",
    "..chhhhhddch............cdbffabccchccccccccccccchhhb......eedddddcb",
    "..chhhcbddccc...........ddafabbccchccccccccchhchcchhbb...eeedddddch",
    "..chhhcchddccb.........cddafabbcchhhccccccccchhhhhhhhhh..edddddddchh",
    "...dhhhchcddch.........dcdafabbcchchcccchhcccchbbhhhhhhbdedddddddchh",
    "...cchhhhccdchb........dccffabbchhchcccddchhccchbbbhhhhbbddddddddcchh",
    "....chhhhbcdchb.......cdcchfaabbhhhhcddccddhhhhhhbbbhhhhbbcccdddddchh",
    ".....dhhhbbcccba......dchchfffbbhchcccddccdchchhhhbbhhhhbbbccccddcchh",
    ".....cdhbbbcccba......hhhcbfffabhchcddhddccdccchhhbbbhhhhbbbhhcdccchh",
    "......ccgafhhchb......hhhcbfffabchddccdccdccdccchhhbbbbhhbbbhhccdchhh",
    ".......ccafhhhhba.....chhcafffbchchhdccccddhcdcchhhbbbbhhbbbahhhcchh",
    "........ccaahhhbaa...cchhhafffcchcchhcccchddccdhhhhhabhhbbbbaahhhhhh",
    ".........chahhhbbahhhcchhhaffhhhcchhhcchdchdhhcchhhhabbbchhbaabhhhhh",
    "..........hhhhhaabbbhchhhhaaahbhhhhhhhchccdhdhhchhhhbaaccchbaabbbbhb",
    "...........chhhhhhbbbhhhhhaahhbhhhhhhhhhccchcdhhchhbbaacchhbaaaabhhb",
    "...........chhdhhhhhhhhhhhhhcbbbhhhhhhhhcdchcchhchhbaahcchhbaaaabhh",
    "...........hhcchhcccchchhhhhbaabhhhhhhhhhcchhcchhcbbaahccchbaaaabb",
    "...........cchchccccccchhhbbabbabhhhchhhhcccbcchhcbbaacccchbaaaab",
    "..........cdhhhccchhhhhhhhbaaaaabhccchhhbhhchhchbhbbaccccchbbaa",
    ".........cdccccccccchhhhhbaaabbabhccchhhbhhhcbhhbhbaaccccchbbaa",
    "........cdccccccccdccbbhhbaabbbbbhcchhhhhbhhcbhhbbbaaccdcchbbab",
    ".......ddcccccccddbbhabhbbaaahbabhhcchbhhbbhhhhhbbbahcddccbbaab",
    "......cdccccccccdgffaabbbhaabhhaahcdchbbbbbhhhahbbaahcddccbhaaa",
    "......ccccccccchhfcaabbhhhhabbbabhcdcchabbahbhahbbaacdddccahaaa",
    "......bhhcccccbhfcgibbchhchaabbabccddchaaaahbhabbbaacdddcaaaaaa",
    "......hhhcchhbbhfcAchbcchchhaggabccddchabaabbhabbaahcdddhabaaa",
    ".......hccccbbchfhbchcdhhhhhaaaahccccchabaabbbbbaaahcdddhabbba",
    "......ccccchhhchhhhhhddhhhhhaaaabhccccaahhaaabbbaaahcddcaabbba",
    "......cccchhhhhhhhhcddchhhbbaaabbhhccchahhaaabbaaaahcccchabbba",
    ".....ccccchhhhccccdddcchhhbbaaaabhhhhcaahhhaabaaaaabbccchabhbb",
    ".....dccchhhccccccccccchhhbbaaaabbhhbbabhhhhaaaaaa.bbhhhbbhhba",
    "....cccchhcchhbaabbhhchhhbaaaaaaabbbbaabhhhbaaaaaa.bbhhhabhhba",
    "....dccchhcddccbbbbbbhhhbbaaaaaabbbhhhhbhhbbaaaa....bbbbabhbaa",
    "...ccccchhddcdhhbbbbbbbbbaaaaaaaabbbbhhhbbbbbaa.....bbaaabbbaa",
    "...hhhhhfcddddhhbabhhhbaagggabaaabbhhhhhhbbbbaa......bbbbbbbaa",
    "...hhhhfhddddhhaaabhhhhhaaaaabbaaahhhhhhbbhhbba.......bbbbbaaaa",
    "....hhhhddcchhaaaabbbdicbaaaaaaabaahhhhaacccbbb........bbbbaaaaa",
    "....hhahhhhhhbffbbbb...cbaaaaaa.b.bbaaaahcchbbb..........aaaaabb",
    ".....aafaahfcfffbbb....hbaaaaa.......aaccdchbba..........aaaaab",
    ".....cccccEcddffbb.....hbaaaaa.......bccccchaa...........aaabaa",
    "......c.c.hcfcfbbb....hhbaaaa.......bhcccchaa............aabbbb",
    "..........hffabbb.....hhbaaaa......bbhccchhaa...........hbbhba",
    "..........bfbbbb......chbaaa......bbbccchhaa............hbhhba",
    "........dbbbbchb......chbbaa..haaaaacccchbb............hhhhhba",
    "........ccbbdbhb.....cchbba..aaaaaaaccchaa.............hhhchb",
    ".........gffhbb......chbbba.aaaaaaacccchaa............hchhcbb",
    ".........chhhbb.....cchhbbbbaaaaaahccccaa............bhhbbcbb",
    "...........aa.......chhhbb...aaaaaccccca...........bbbbbbhhaa",
    "..................chhhhhbb.......cccchba..........hhhbhbahhaa",
    "...............hhhhbhhhahb......bdcchhb...........hggbhbachba",
    "..............hahbbbhhbaa.......cccchaa..........hggabbbabbba",
    ".............haabbhhhbba.......cccccbah............aabaaabbb",
    "............haabbbahbbba.....hhhhcccba...............bb...b",
    "...............bbaaaaa......hhhhhabhbb",
    "...........................hhbhhabchbb",
    "..........................bbbbhhabbhbb",
    "..........................bbaabbahaaa",
    "...........................aabbbahaa",
    ".................................a"
  ],
  legend: {
    A: { pal: C.amber, glow: true },
    E: { pal: C.goldLight, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    e: { m: "fur", step: 4 },
    f: { m: "shadow", step: 0 },
    g: { m: "shadow", step: 2 },
    h: { m: "shadow", step: 4 },
    i: { m: "tooth", step: 3 }
  },
  idle: {
    // Fast, shallow breaths, twice a beat: a hunted thing about to bolt.
    waist: 52,
    breath: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    // Once in a cycle, the ears flick back.
    twitch: {
      frames: [7],
      patches: [
        { x: 0, y: 0, rows: ["", "", "._.b", "_h..b", "_h...b", "_h....b", "_h.bh.b", "_.hb..h", "_hc......h", "._c....hchb", "._c....h..cb", "._.c....h.c.h", ".._c....h.dch", ".._c..hcb.d..c", ".._c..h.ch.d.cb........_c", "..._d..hchc.dch........_d", "..._.c...h.cdchb......._d", "...._c...hbcdchb......_cd", "....._d..h.b..cba....._dc", "....._cdh..b..cba....._"] }
      ]
    }
  }
};
