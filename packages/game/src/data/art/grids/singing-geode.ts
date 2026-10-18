import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Singing Geode (BIBLE 8.3): a stone that hums Célestine's name before she is hired.
 * A great egg of rough, pitted violet-grey rock split open like a jaw, the upper shell
 * thrown back on its hinge; both lips are banded with agate and lined with crystal teeth,
 * and the violet light it sings with burns in the dark between them. Two cold points watch
 * from under a jut of the lifted shell; crystal has grown out through its back, light leaks
 * along its cracks, and it stands on three short stumps of rock.
 */
export const SINGING_GEODE: CreatureGrid = {
  rows: [
    "......................jkkkkkjg",
    "...................jkllkkkkkkkjii",
    ".................klllkkkkkkkkkjiije",
    "................kllllkkkkkkkjkkjjjjj",
    "..............klllllkllkkkhkkkkkjkkjjj",
    ".............kkkkllllllkkkgjkkjjkklkjgg",
    "...........kkllkkkllkkkkkhjkkkkkjkkjeegg",
    "..........illllllllkklkkkkjkkkkkkjheeeggg",
    ".........kllllklkkllllkkkkjkkkkkkkkjgggggg",
    "........klijjiiiijjiilkkkkkekkkkkkkkjffgggg",
    "......kkkiiiiiihhjjiiijkkkjekkhjkkkjjjfggggh",
    ".....jkiiiiiiikkaakifjjiiiijkkkkjkkkjjhegfhh",
    ".....iiiddijEaaabbkkjkkiiiiikkkkjkkkkjhegffgg",
    "....iiiiiEikaabbbaakhbaiiiiiikkjjkkkjjjeeeejgg",
    "....iiiiiailabbbbaaiiblfkikkiiiijkkjjjhekkjegg",
    "....iiiiiaddbbbbbbkcckfffflbiiiiikjjjjhekkkefgg.........bba",
    "....iiaaicddbbiibkcccfcffflkfdiiiiihhhhhkkjffee.......bbbaa",
    "....fiilccddldddlcccffcffffefeejjiihhhhhfffffeee.....bbbaaa",
    "....iiiidddddddddcccfcccfcfeffeaaiiihhggfefffjej.....bbbaa",
    ".....iiiddcddcdddccfcccffceeefkbakiiihggfehffjejj...bbbaaa",
    ".....iiiddccdddddccfcccfccfeffkblkaiiiggfehffjegj..bbbbaaa",
    "......aaacccdddddcccccccccfeffkkclliiiiggffffjegjj.bbbbba",
    "......iakddcccddddcccccccceefffcccccciifgfffffeejjkabbbba",
    ".......iiddccccccddcccccccefffccccccdccigggffeeeejjabbba..aa",
    ".......iiiddcccccdddccccccfffffcfcccdcciiffffeeeejjaaaba.aaa",
    "........iicddccccdddddccccfffffffccdcdciiifffeefeejiaaaaaaaa",
    "........iiccdccccccdddccccfffccfcfcdddcddiifeeeffeehaaaaaaa",
    "........ieeecccdccccddccccffchfccfccdddddijeeefffhhhaaaaaaa",
    ".......kjeeeeeeccffccccfcccfchfcccececcffeeeeeffffhijaaaaa",
    "......kljjjeeeeffffccccfcdcfcccccceeeeffggeeeejhhffijaaaaa",
    ".....klkjjiieecccccccfffidcccccccceeeffflkjejjjjhffjjaaaa",
    ".....kliiiiiiiccccccccccidcccccccffccckkjjkjjjjhfffhikaaa",
    ".....liiiiiiiidccccccccccccdcccdffcccklkkgjkjkjhfgghijaa",
    "....kkkiiiddiidccccccccccdddcccdfccccllkkkekkjjhffffija",
    "....kkkidddccdddccccccciiddccccdccccllkkkkjeejjhfffffjk.....aaaa",
    "...glkkdddccdddddcccciiidddccccdccckllkkkkjjjeeefffffjj...aabbba",
    ".lliiddddccdddddddcccddiddddccddccckkkkkkjjjjgeeeefffjj..bbbbaa",
    ".lbbidddfcddddddcdiiiiddddddddddccklkkiikjjjjgfeeeeehhhkabbbaa",
    ".lbbkddfcdddddddddccidddddddddddcklkkkkkkjkjjffeeeeehhhkabbbba",
    ".labbcfcddddddddddddddddddLddddcilkkkkkkkkkjjffffffeehiiaabb",
    ".laadddddddddddddddddddddLLLdddlljkkkkkkkkkkjfffeffghhjkaabb",
    "gkallbddlblddddddddddddddldLdddlkkkkkkkkjgkkefffeffghhekaa",
    "kkjllbbdbbbddddddbbdddddlllddllkkkkkkkkkkjjjeeffeekhhhjkb",
    "kkkllbbdabbldddddbblddddlldkekkkkkkkkjkkkkkjffgeeiahhhjj",
    "kkkkkbaaaaaaddddaabaddddddllhgjkkkkkkjkkkkkfffggggkehhjj",
    "iikkjaaaaaaallddaaaaddddllkkkjegkkkkkkkkkjffffegggeefhjj",
    "iiikjjkjkaaaklldaaakkkllkkkkkkkhgkkkkkjjjffffeegfggeehjj",
    ".iiikkkjjaaaialjjikkllkkjkkkkkkkefkkkjhhheefeejffffeehig",
    ".iiigkkkkjjkjkkkjllkkkkjkkkkkkkjjeejjehheeeeeejfggggehig",
    ".iiiihhkkkkkkklkekkkkkkkkkkkkkkkkeeeeeeeeeeeejhfgffhhhie",
    "..iijhhehkkkkkkeejkkkkkkkkkjklkkkkeeeeehhgggejhefffhhhi",
    "..iijjjeegggjjeekkkkjgkkkkkklkkkjjjggekjjggfeehefffjjfi",
    "..iiijjeeegeeeejkkkjkkjkkkkkkkkjjjjffejhhggfeeeefffjfig",
    "...iijjgeeeeeejjjkkkkkjjjjkkkjkffjfffjjhgfffeeehfffefig",
    "...iiihhggeeehjjjjkkkkjekkkkkgeejfffekjggghfeeehefeejf",
    "...iiihgfgheghjjjjjkkjjjjkkkkkjjjffeejhhgghfeeeeeeeeeh",
    "....fiigfhheggejjjjjjjjjjjjkkjjjffeejjggggffegeeffehh",
    ".....iiihhhffhggjjjhhjhjejjjjhhffeeejggffgffegefgfjhh",
    ".....iiihhggehggjjjhhjhgeggggggeeehhfffffgfffeefggii",
    "......iiihggeegghhhhhjjgeeegfffeeehffffffffffeejjiii",
    ".......iiifffeeggghhhkageeeeffeeeffffgffffffeegjjhh",
    ".......iiiiffeeeggffeikggjeeeeeeeffffgeeeggfeeggji",
    "........iiiiffeeeeefeeeggfffffeeeeffeeeeggeefeggh",
    ".........iiiieeeeeeeegfffffffffeefffeeeggeefffjfe",
    "...........iiieeeeeejgffffffeefeeeffffggeeffffeee",
    "............iiieiigfffgffgfffffeeeeeeeeefgghieeeef",
    ".............iiieihhffggfggffffeeeeeeeeefjhheeeeff",
    "..............ieeiccchhhhhhhjffeeeeeeeeejjeeeeeffg",
    "..............ieeeeccchhhhjjjjeeeegggeeeeeeeeeeeeg",
    "..............ieeeeeeehjjjiiiieeeghhgee..ejeeffeeh",
    "..............iieeeeeeeeeeeeeeeffgjjkeee..hgeeeeehh",
    "..............iieeeeeee........gffkjjiee...jeeeeefh",
    "..............kjeeeeeeee.......gfjkkhfee...jifeeefh",
    ".............jjjjeeeeeef.......jjjkkhfg....iifeeeeff",
    "...........iiiheffeeeeef.......jjkjjjfg....fifeeeeff",
    ".........jijihhhgfeeeeeeh......jjkjjjfg...jffeeeeeeee",
    "........gjjejjhggfeeeeeee.....gjjjjjjgg...jeeeeeeeeeee",
    ".......jkeeejggggfeeeeeee....ggggjjjfgg...eeeeeeeeeeee",
    ".......geeekeggggeeeee.......gggfejhhgg.....eeeeeeeef",
    "..........ggeeee...........gkhhhffjjggg",
    "...........................ghkffeejjeeg",
    "..........................gghkefeejkeee",
    "...........................gkeeeeejke",
    "..................................gg"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    L: { pal: C.essenceBright, glow: true, light: true },
    a: { m: "glass", step: 1 },
    b: { m: "glass", step: 2 },
    c: { m: "light", step: 0 },
    d: { m: "light", step: 1 },
    e: { m: "rock", step: 0 },
    f: { m: "rock", step: 1 },
    g: { m: "rock", step: 2 },
    h: { m: "rock", step: 3 },
    i: { m: "rock", step: 4 },
    j: { m: "stone", step: 2 },
    k: { m: "stone", step: 3 },
    l: { m: "stone", step: 4 }
  },
  idle: {
    // The egg rises on its stumps and settles, humming.
    waist: 67,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the upper shell lifts on its hinge, mid-song.
    twitch: {
      frames: [6],
      patches: [
        { x: 0, y: -1, rows: ["......................jkkkkkjg", "...................jkll.....kkjii", ".................klllkk..........je", "................kl..........j.kjj.jj", "..............kll...kll...h.k..k.kk.jj", ".............k.kk...l.....gj..jjk.lk.gg", "...........kkll..k..kkk..hjk..kkj.kjee.g", "..........ill..lll.k.l...k......kjhe....g", ".........kl...k.kk.ll............kkjgg...g", "........klijjiiiijjii.....ke.......kjff...g", "......kk.i.ii..hh....ij...j...hj...j.j.....h", ".....j.ii.....kkaak.fj.iiiij..kkj..k..he.fh", ".....ii.dd.jEaaabb.kjkk....i........k.....fgg", "....i...iE.ka.bb.aa.hba.....i..j....j.j.eeej.g", ".........a.l.b.....ii.lfk.kk.iii...j..h.kkje", "..........ddb....bkcckf.fflb....i.j.......k.f.g.........bba", "......aa.c....ii.kc..fc....kfd...iihhh.h..jf.ee.......bb.a", "....f.ilc...ldddlc..f.....fe.eejj.......fff....e.....b..a", "....i..idd..d...d....c.c.c...f.aa..i..gg.e...j.j.........._", "...._.....c..c.....fc..f..e.e.kb.k..i.....h.....j...b..a", "...........c.d..........c.f.f...l.a..i.........g...b", "....._aaac.........c...c.......kcll...i.gff......j.....b._", "......i.kdd.cc...d........e...fc.cccc..f.....f.e..ka", "......_ii.....ccc.d........f..c.....dcci.gg..e..e.j....a_.aa", ".........i.d.......d......f...f.f.......iff.........aa...a", "......._..c.d.......dd.........f...dcd...i.....f.e.i..a.a", "...........c.....cc..........cc.cf..d..dd.i.e...f.eh......._", ".........eeec..d...c........chfc...c..d...je..f..hh", ".......kj...eeec.ff.cc.f..c......ce.eccffee......f.ij....._", "......kl.jj....ff........d...cc....e.ef.gg....jhh.f", "......____________________________________________________"] }
      ]
    }
  }
};
