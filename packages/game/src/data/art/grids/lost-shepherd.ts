import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Lost Shepherd (BIBLE 8.1): he has no sheep; he counts the walkers who pass. Long and
 * stooped under a heap of matted fleece, a battered hat sagging over a face that is only
 * shadow and two pale points, a beard hanging in locks past the belt; a patched robe
 * dragging in the wheat and torn into rags, a crook planted ahead of him, a bell hanging
 * from its hook.
 */
export const LOST_SHEPHERD: CreatureGrid = {
  rows: [
    "...................eebe",
    "................bbekkiib",
    "..............beakkkffieb",
    "..............ckkkjjjjaggg",
    ".............cekkkjjjjggffeb",
    ".............bgkkkkkjiggfffcccbb",
    ".............cikklkkiigffffgggeebc",
    ".............bjkkkkjiiiifffggeeebcbcc",
    ".............bgkkiijjiffiiggjjjebbccbbcb",
    "............beiijkkkiiiiiiijkkeebccccccb",
    "............ciiijjjjkkkjjjbjkeeebclcbcccb",
    "...........cbiikkkkkkkiijjjjjeebbclccllccb",
    ".........ccbbkkkkkkkfffiiiiffeebbclllllcccbbb",
    "........bbbbjkkkkkffffffifffffbbbcllllllcccbb",
    "........bbbjjkjjfffEEfffgddffgbbcllllllcccbbb",
    "........bff...jlffffiiifgafffbbccllllllbccbbbbb",
    "..............bfffffiiffeafffbbclllllllccccbbbb",
    "..............bfeiiikiifbeffgbllllllllllcccbbbb",
    "..............bfbkkkkkigbbffbbcllllllllllcbcbbbb",
    "..............bfckfkllbbbbfgbccllllllllllccbbbbb",
    "..............beedibjbcbbbfbbllllllllllllcbcbbbbb",
    "..............cbbdabjilbbbabclllllllllljlcbbbbbbbb",
    "...jbbb.......bbbbbllblbebebllllllllbfjbicfbbbbbbb",
    "..jjjjib......cbcbbllcbbabeclllllllljffdfcfebbebbb",
    ".jjjijiff.....cbcbbcccbbfbbcllllllllcddegfffbbbbbb",
    ".kk....ffi.....bcbbcbcbbfbbllbllcfllbdhhhhfffebbbbb",
    "kkj.....fi.....bcbbbbbbbabbciillcfjlfdhhhhggffebbbb",
    "kj......ii.....bbcebbbbgbbejiillbffbfhhhhhggddfbbbb",
    "kj......ii.....bbbbgbebdbgffiilbjffddhhhhhggggdbebb",
    "jj......ji.....b.bbabebfjffkihlidjiffhhhhhhgeddebbb",
    "jjj.jj.bji.......bbababfifffhhlddiiffhhhhhhgeggdbbbb",
    ".ii.ijjjii.......cefcgafiffhhhhdhhdfffhhhhhhggddbebb",
    ".iiiijfjf........cefbggiiffhhhhhhhefffhhhhhhhgdddbbb",
    "...iijiif........bedbgaiifjhhhhhheeddfhhgghhhegdgbbb",
    "....kccjj........hedbeiiijjkhhhhheeddfedeeddeeggggbb",
    "....ijcjj........hhdfbeaddjkkhhhhhhddffddeeeeegggebb",
    "....kljfj........hhffbaeedekkkahhhhhdffhhhhhgggggebb",
    "....lljfki......chffffeeehhekkkahhhhfddhhhhhhgdggbbe",
    "...bllkfji......hhdfffeeehhhejjjfffffffhhhhhhgdggbbb",
    "...jkkkiji......hddfffffffhheiiffffffffhhhhhhgdgeebb",
    ".....k.ijj.....bhdddfffffjjkffiiiiffffbhhhhhgdddeebeg",
    "........jj....ccbeddffffjfjklkkkkjiffkllbbbegdddeebeg",
    "........iki...ccbbbdffffjikjljjkkjiijlllllleddgdeebbe",
    "........iki...ccbcbbffffjijjlikkkjfflllllllcddgeebbb",
    "........iki..ccccbbbaffdfjjjlijjkkkilllllllcedaeebbb",
    ".........jj..cbccbbbbffdfffddhjjkjkkllllllcbbbfeebbb",
    ".........ij..eabcbbbefddddhhhhjiijjkcblllccbbbeeebbb",
    ".........ijjbbdffbbbedddddhhhhjjjfjgeekllcbbbbeeebbb",
    ".........ijfaiifffbbddgggdhhhikjjdhggfikccbbbbffebbbb",
    ".........iifikifffeeddggheghhikkfhhhakkikfbbbgffebbbb",
    ".........iifiifffgeeddhhhgghhkkifhhhkklkkffabffffbbb",
    "........biiibfffbbbaahhhghggjkkjhhhhkllkkifffffffebb",
    ".........iiffff..b.gghhhghggkkjjhhhjjklkkifffffffbbb",
    ".........iifff.....hhhhhghhgkkjihhhjilkkiiffffdffebb",
    ".........aaff.....hhhhhhghhjlkkihhhjikikiiffffdffeb",
    "..........fff.....hhhhhhehhjklkdhhhjikiiifffffdffgb",
    "..........iif.....hhhhhheeekkkkhhhhhkkiiiffdfdddfgb",
    "...........jf....bhhhhhhhekkkjjehhhhjjjifffdffdddf",
    "...........ji....bhhhhhhehkkjjjehhhhhfffffffffddda",
    "...........ji....bghhhehehhkkjighhhhhfffffddfdddda",
    "...........ji....bghhhehehhjkjighhhhheddddddddddda",
    "..........aji....hghhhehehhjjjfghhhhhhggdddddddddd",
    "..........aji....hghhhggehhgjjffehhhfhghdddddddddda",
    "..........aii....hghhhfeehhgjjffehhffhhhhdddddddddaa",
    "..........aii...hhghhhfdehhgijffhehffhhhhdddddddddaaa",
    "..........eiii..bgghhhfdehhgiiffhehfffhhhdddddddddg.g",
    "..........eiii..beehhhffdhhejkffhehfffhhhhddddgdddgg",
    "...........iii...eaffeffffeejkffhghfffhehhddddgffddg",
    "...........iif...eafffffffffjkffhghhffhehhdddddgfddgd",
    "............if......jffffffffkffhdhhfffffhdddddgdddddddga",
    "............if...bbbhdfffffffjffggaffffffggdddddgddddffdd",
    "............iiihhaaadddfdffffj..ggeaffffffffddddggddddddda",
    "............iiiddaaiaddfdddf......e....ffffffddddgeeddddd",
    "............iifddbiiaff..d............iddfffddddgghhhheb",
    "............aff.fiii.................iijjjfffgghhhhhhhee",
    "....................................jjjjkjjffghhhhc.ee",
    "...................................ijiiiiiif...bb",
    "...................................iifiifiii",
    "...................................iifiifiid",
    "......................................i..i"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "fleece", step: 0 },
    b: { m: "fleece", step: 1 },
    c: { m: "fleece", step: 2 },
    d: { m: "robe", step: 0 },
    e: { m: "robe", step: 1 },
    f: { m: "shadow", step: 0 },
    g: { m: "shadow", step: 3 },
    h: { m: "shadow", step: 4 },
    i: { m: "wood", step: 0 },
    j: { m: "wood", step: 1 },
    k: { m: "wood", step: 2 },
    l: { m: "wood", step: 4 }
  },
  idle: {
    // An old man's breath: long, shallow, the fleece rising with it.
    waist: 52,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the hat dips: one more walker counted.
    twitch: {
      frames: [8],
      patches: [
        { x: 12, y: 0, rows: [".......____", "....___eebe_", "..__bbe.ki.b_", "..bea.kkffieb_", "._c.......a.gg__", ".ce...jj.j....eb____", ".bg..k..j..g...cccbb__", ".ci..l.k..gf.....g....___", "..j..kk.i.iifff.gee..cb.c___", "_bgkkiijj.ff..ggjjj..b..bb", "be...kkkiiiiiii..k....c.c..b_", "c..ijjjj..kj..b.k..e....bcc.b_", ".ii.....kki.jjjjj......cc....b", "b.....kk...i.ii..ee........c", "..kkkk.ff...iff..f..bc.....l", "jk.j...EEff..dd..g.b.......c", "..jl......i.g.......c......b", "....ffffi.f.ea..f.bc.......c", "....eiii.i.f.e..g.l.........c", "....b.k.kkig...f.b", "...fckfkllb....g.cc", "..bee.i..bc...f.b..........l", "..c..dabji..b.a.c.......llljl", "..b.b....bl.e..b........b.jbi", ".......ll...a.e.........jffdfc"] }
      ]
    }
  }
};
