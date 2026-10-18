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
    "............................................ggggg",
    ".....................................ii....iiddggj",
    "....................................igggjjjifddgfjjj",
    "....................................jbbbbjjhfbbbbejjjj",
    "....................................jhbkkkkkbbbbijjjjkj",
    "...................................iijkkkgjkkkkkkkkjjjjj",
    ".................................jjjjkkkifbklkkkkkjkjjhjj",
    "..............................ajjjjjjkkkkkklljjikkjhfffjjjiijj",
    ".............................aakjjkkjkbkkkkkkkjjkkjfcccajjjkkj",
    "............................ihhajkkajkbkkkjklkkkkkkfccdfjjjkbj",
    "...........................jibjkkkkhajjklkklkbffjkkkiddfjjjaaii",
    "......................iifajjjkkkkkkkkkllkklljfccceikkkffjjjjiiiiiggj",
    "....................jiiijjajjjkjkklkkllkbjllkcdcddblkkjjjkjjiiijiifi",
    ".............jjkkjjiikkjjkkkkkjjkbkllkklkklllbcdddckkkkkkkjjajjjkbfa",
    ".............jkllkkiikjjkkllkkkkjkkkkjkkklkklkkgddcjkkkkkjfjjjjjjiaa",
    "............ijkllkjjjjjkkjhhhhhiijkkkkkjlkbbkllkkdbkkklkbkjjkjbjiijj",
    "............iiklkjkkjjjjhbbbbbhhhhjkklkkkbbbjkkkkkjkkkkaiikjkjbhiijk.ji",
    "...........jjhkjjkkjjjabbbbkbbhhhhhhhbjkkieejkkljkkbjkjjiikjjjhhhhhjjkii",
    "...........jjhjjjkkjjhhbbbbhhhbhhhhhhhhbkjahjjkjajkkjjahhijjjjhhhhhaahii",
    "............jfjkklkkjhhhbbkbbbbhhkijkbhhjkkjkjjhhjkkjacccajjhjhccchahhai",
    "............jjkklljjjhhbbbbkbbbiikikkkbeakkkkjahhjkkiacccejjjjicddaahha",
    "...........jjkkllkijkjjjbbjkbjkiiiijkljgejkkkkkjfjjkafccdcjjjjicddchiaj",
    "..........jjkkllkkkkkkjjEEEEkjhhkkijjkkjehkkjgbkjjjjhfcdddfjjbbbddcciaij",
    ".........jkklkjklllllkkihiiaahhkkkjjjkjjjhhkjfhjkjjjaccdddfkjbbifdchhiij",
    "........jkklkhjlllkllllkkiijjjkllllkkkkkkhhhkjjkkkkjjcddddjklkiiahhhhiijj",
    ".......jjkklkllllllllllllllllkkkkkllllkkkbhhjjjjjjjkjedddcjkkjijahhhhhhhj",
    ".......jjkklllllllllllllllkkjjiaaaiikklkjkhhjjjjjjfkjjfdccaahhhiahhhhhhhii",
    ".......jjkkkllllllkkkjjjjjjjjkkkkkiiikkkjjjiijjjjaajjkjfddhhhhaiahhhhhjjji",
    ".......jjjjjjjjbbhhaaahhhhhhhhhhjklkhikkjjjiiaahaaajjiihfdhhhhaaahhhhjkkjjj",
    ".........jijhhhhhhchheeeeehhhhhhajkkkkkjjakihhhhhhhhiiiiffbhhjaahhhhjkkkjij",
    ".........iahheeehhcebbbbbbjkkkkllkkkkkjhijkhhhjjjjhhhiiiiibjjiiaahhjjkkkkijj",
    ".........aaeffffbbcbbjkllkkkkkkkkkkkjahhjjjhhjkkjjjhhhiiiibjjiaahhhjklkkjijj",
    "........jaaefccbjkgkkkkkjjjkkkkkjjiaaaaajjhhhkkkkkjjhhiiiibiaaaahhhkkkkkjjijj",
    "........jjjkkgblkkbjjjjiiihhhhhaaaahhaajjjhhjkkklkkjjjiiihiiaaahhhikkkkkjjiaja",
    ".........jjjggbjjjiiahaaaiiaaaaaaaaajaajjhhjkjkkllkjjkjhhhiaaahhhhiklkjjjjjjjj",
    "...........aaghhhiiijjjjjjjjjjjjjjiiiijjjhjjkjkjkllkjjkjhhaaahhhhhjkklkjjajjaj",
    ".............iijjjjjjjjkkkkkkjjjjjiiiijjhhjjjjkkjkkkkkkkjhhaheehhhjjklkkkajjiji",
    ".............iijkkkkkllklklkkjkjjiiijjhhhjkiijjjkjkkkkkjjhhhhhhhhhjjklkkkiiiiji",
    "................jjllllLLllllkkjjiikkjhhikjkiiijjjkkkkkkkjjhhehhhhejjklkjkiiiaii",
    ".................jhkllllLlllkkjjikkjaahkkjkhhhijjjkkkkkkkjjhehhhhejjkkkkkjiaaij",
    "................jjhhhklllllkjikllljjjjjkkkjjhhijjjjjkkkkkkjjhhhhhehjjkkkjaahhij",
    "................jahhhhhhaiijklllkjkkkjjkkkaiihhhjjjjjkkkkkjjhhhhhehjijjjjahhhii",
    "...............ajahhhhhhaijjjkkkllllkkjjjjjhhhhhhjjjjjiajkkakhhhhhahijjjjahhhii",
    "...............jjahahhhhhijkklllllkkkkkjjjjihhhhhhhjhhhklkkajhhhhhahhiiiiahhhi",
    "...............jjaaahhhhaaijjjkkllkkkkjjjiiiihhhhhhhhhkllkjhihhhhhahhhhjhhhhii",
    "...............jaaaaahhha..jjjjkkkkjjjkjjiiiihhhhhhhhkklkkjhihhhh.aahhhhhhhhii",
    "...............iaaaahhhh....iijjjjjjiiiijiiaahhahhhhjkllkkjhhh.a...aaahhhhhhh",
    "...............iaaiahhhh....aahhiijiiiiiiiiaaiiaaaahkkllkkjha.......aaheeehhh",
    "...............iaaiihhh.iiiiiahhhhhiiiiiiaaahhhaahhikklkkjjha.......ahhhhhhhj",
    "...............iaaiiahhiiiihhaahhhhhhhhhhaaahhhha.bjkkkkjjaaa.......ahhhhhhhi",
    "..............aaaaiiahhhhhhaahhhhhhhhh....aa.......jkkljajaa.......hahhhhhhhii",
    "..............aaaiiihhhhhhhhhhhhhhhhhh.............jkkkkjaaa..hhhhhhahhhhhhhhi",
    "..........hhhhhjjjjjhhjdhhhhhh...hhhh.............hkklkkjaa..hhhhhhhhhhhhahhhijj",
    "...biijjjjjihhikjkjkjhhbhh........................jklkkjjaa..hhhhhhhhjhhhaihhhjjjjaaii",
    "..abbijjiaaijjiikkkkkijhh.........................jjjjkjaa..hhhhhhhhjjhhaaiihhhhaaaaiii",
    ".aaahiiiiijjjiiikkjjijjjj........................hikkkjjah..hhhhhhhahhhhaaiibiiiaahh",
    "....bjjiiiiiaaiaaihiijjkkj...................ii.jkkkjkjjah.......ijahhhhiihhaaii",
    "....bbaaaihaa.......aaajkkl...............i.jikkkjkjkkjjjh.......ihhh...jj.haaaii",
    "....b..aa................................iijjkkjjkjikkjikkj......i...........j",
    ".......................................jiikjjjijkjaijjkijkkkjjjjj",
    ".......................................kjhiiaiikjhhjjjkkajjjjjbb",
    "......................................jjhhh.ajjihhhhaaajjhhajhbb",
    "......................................ja....jjjhhh...aaajh...hhb",
    "............................................jjhh......aabi.....j",
    "...........................................bbhj........bbi",
    "...........................................bb...........b"
  ],
  legend: {
    E: { pal: C.mireLight, glow: true },
    L: { pal: C.mireLight, glow: true, light: true },
    a: { m: "mud", step: 1 },
    b: { m: "mud", step: 4 },
    c: { m: "rot", step: 0 },
    d: { m: "rot", step: 1 },
    e: { m: "shadow", step: 0 },
    f: { m: "shadow", step: 1 },
    g: { m: "shadow", step: 4 },
    h: { m: "skin", step: 0 },
    i: { m: "skin", step: 1 },
    j: { m: "skin", step: 2 },
    k: { m: "skin", step: 3 },
    l: { m: "skin", step: 4 }
  },
  idle: {
    // A toad's breath: long still beats, then the back swells.
    waist: 48,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the throat sac swells with the Baron's croak.
    twitch: {
      frames: [6],
      patches: [
        { x: 0, y: 30, rows: [".........____________________________________", ".........i.hheeehh.e.bbbbbj....ll...kkj.i.k", "........_....fffbbcbbj.llkk.....kkkkj.hh..j", ".........aaefccbj.gkkkkkjjjkkkkkjjiaa..a....h", "........j..kk..lkkbjjjjii.hhhhh....hh....j.hj", ".........jjjg.bjjj..ahaaaiiaaaaaaaaajaa...h", "...........aaghhhiii...jjjjjj...........j...k", "................jjjjjjj.k.k...j..j..iijj.hjjj", ".............iijkkkkk.lk.k.k.jk.j.ii.j.hh", "................j.ll..LLl........i.kjh.i...ii", "................_..kll..L..lkkjjikk.aah..jkh", ".................j...klllllkjik.lljjj.....jjh", "..............._..........i.klllkjkk.j.kkkaii", "...............a...h....a..jjkkk..ll..j....h", "..................h.....hijkklll......k..jj.h", "................j...h....ai...k.ll.kkkj", "...............j....a...a..jjj.kkkk.jjkj...ii", "..................a.........iijjjj.j....j", "...................a...h____a...iij......ii.a", "....................h.._...ii.h....iiiiii", "...............i.......iiiihhaa.......hhha..h"] }
      ]
    }
  }
};
