import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Ferryman (BIBLE 8.4): he asks for a coin to cross. There is nothing to cross; pay
 * him anyway. A tall hooded figure standing in the bow of a half-sunk punt, the stern going
 * under the black water, a long pole planted behind him and a will-o'-wisp caught in an
 * iron lantern on the bow post. His robe falls to a ragged, dripping hem; one bony hand
 * reaches out to the company, palm up, for the fare. The hood is empty: no face, only two
 * coins where the eyes should be.
 */
export const FERRYMAN: CreatureGrid = {
  rows: [
    "",
    ".........................................kk",
    ".......................................kkkekk",
    "...................kk.................kkeeeaaa",
    "..................kkk.................keeeaaaaa..........................b",
    "..................jkl................kkeeaaaaaaa........................bb",
    "..................jjl................kkeeaaaaaeaa.......................bb",
    "...................glk...............kkeeaaaeffca......................bbb",
    "...................glk...............adeaeadffffa......................bbb",
    "...................jjl...............ddeaafffffffa.....................bbb",
    "...................jjl..............kddeeffffffffa......................bbb",
    "....................jll.............keeaeffffffffa.......................bbb",
    "....................jll............kkeeeffEfffEffka......................bbb",
    "....................jll...........kkeeefffffffffffa......................bbbb",
    "....................jkl...........kfeeffffffffffffa......................bbb",
    "....................jkl...........kfddffjfffffffffja....................bbbb",
    ".....................jl............ffdffjkffffffffga...................bbb",
    ".....................gl...........fffdffkkkfffffffa..............l.....bb",
    ".....................jll........kkdffcccckllfffffkka............bl...l.bb",
    ".....................fll.......kkedffccddeellfeefceea..........ll..llbbbb",
    "......................ll.......keeaedcccdeeedaeffjcaaa.......lllbbllll",
    "......................kl.......keeeaecccddaaaeffjjjaaa.......lbllblll",
    "......................kkk.....lkeeeaaeeedajdeeejjjajaaa......llllbllll",
    "......................kkk.....leeeeeaaaeeeadeekkjaadjaaa....llbbbblll",
    "......................kkk.....keeaedeaaaefffaakdaaacjjaaa..jllbbll",
    "......................kkk....kkeeaeddaaaaeeffjfaaaadaaajaaalblkk",
    ".......................kl....kdeeeeedeaaaeeeedeaaajddaeaeakbbll",
    ".......................fl...dddeaeddfeaaaaeeaeeaaaefddeejalbll",
    ".......................flk..ddeeeadfffeeaaeeeeeaeaeffedeaalllge........ak",
    ".......................kkk.jddeeeadfffeeeeeedaeeeeeffedeealllfe.......k.kk",
    ".......................kkk.feeeeeeffffeeeeeddeeeeeeffeeeeellfff..........k",
    "........................kkkkeaaeeecfffdeeeeeddeeeeefffeeeelfffa",
    "........................jggfjeaeddckfffeeedeaecceeffffdddeffffa.......kkk.k",
    "........................jffllleaeddkffffeedddeccfffkfddddefffc......kkkkkfa",
    "........................jfkbbbeeedj.kfffffffccffffk..dddddfffc......kkkllgl",
    "........................jjlbbleeedj.kffffkkkkkgfffa..dffddff.c......lllLlll",
    ".........................flbllfddd..jffffkkkkkgfffk...kfddfk........lllLLlll",
    ".........................lbblfffdd..jfffffffffffffj....kddca........aalblbll",
    "...........kka..........lbbllfffdd.kfffeedkfeeefffjj....kk..........aallllllk",
    "...........ckka.........llbl.fffd..kfddaedkeeeeefjfa....aj...........jlllkllkg",
    "...........ckka.........lbbb..ffk..kcddaejkjeaeejjfa................ffjlkkllkg",
    "..........kckka........llbbbb...k.kkcdeeejkjeadeckfa.................fggfkllkk",
    "..........cckka........lbbbib.....kfddeeajkjeedeckca.....................kllkk",
    "..........jdkkk........llblfb.....kfddeaajkjeedackcka....................klljg",
    "..........jdkkkk......lllbffb.....kfddeaaddeeedafkcka...................kkkljg",
    "..........jdkkka......lllbffl.....kfddeaadffeeeafkfja...................kkklkg",
    "..........ddkkkka......lllggk....kkdddeaadjeedeefkjja..................llkklkj",
    "..........dckkffka......lllgk....kfdddeaaejeedaefkkja..................llgllkj",
    "..........dcfkfffk........gkk....kfdddeaaeeeddaefkkka.................llfgllkj",
    "..........ddfkffffk.......jkk....kfdddeaaeeedeaefkkka................llkkhlljj",
    "..........ddfkkffffk.......kk....kfdddeaaeeddeaeflkjaa...............lkklhlljj",
    "..........ddfckffffffj.....fk....kdddeeaaeeddeaeflkjka..............llkklkkljj",
    "...........djcckffffffj....fkk..kjdddeeeaeddeeadfkkjka.............llkkkkklljf",
    "...........cjcckffffffffj..jkk..kjddddeaaeddeaeddkkjfa............llkkkkkhlljf",
    "...........cjcccjfffffffffjjjk..kfddddeeaeeeeaedfkkjfk..........lllkkkkkkhlljf",
    "...........ddfcccjfkffccffffjk..fffdccjeeeddeaedfkkjfk.........lllkkkkkkfklgfj",
    "...........dcffcjjjjcccccfffckkkfffcckjeeeeeeeedfkkkff........lllkkkkfkfkklfff",
    "............ccffjjjlcccccfffckfffffdcljeeddeeeecfkkkfaf.....lllkkkkkkkfkgllff",
    "............ccfccjjjkkffccdccjfffffddleeefdeeeecfkcffkk...lllkkkkkfkkfkkglljf",
    "............ccfccccjgkkkccdcfjfffffddleeefcjefecccfffkffllllkkkkkfkkfkkkkljdd",
    ".............cccccccggkkkjccfffffffdhleedfcjdffcccfffkkllkkkkkkfkkcckkkflldd",
    ".............ccfcccjfffjjkkllkfffffdllcedfcjdfccfffkllkkkkkkfffkkfckkkkflldj",
    "..............dffddjjjffjjkkkklllkkfklcdcffffgkkllllkkkkkffffkkkfckkkkkflcdj",
    "..............dfffdjjjjjfffkkkkkkkkkkllllllllllkkkkkkkkkfffkkkkfjjkkjjfkkcc",
    "..............dcffccccjjjjccffggkkkkkkkkkkkkkkkkkkkkffffkkkkkkfkkkkjjjfkccc",
    "...............ccffccccjkkkkjjccfffggkkkkkkkkkfffffcffkkkkkkfjkkkkcccckkcc",
    "................cffccccckkkkkkkkjjccfccffffcccccckkkkkkkkkffjjkkjjcccckccc",
    "................cfffddcccjjkkkkkkkkkkkjjkkjjkkkkkkkkkkkkffjjjjjcffccckkcc",
    ".................ffffddcccccjjkkkkkkkkkkkllkkkkklllkggkkkfffjjjcccccckcc",
    "..................ffffffcccccccjjjkkkkkkkkkkkkkjjjkkkkkkjccjjcccccddkccc",
    ".............iiiiiffffffcfcccfccccjjjkkkkkkkkkkkjjkkkkjjjcccccccddddccciiiiiiii",
    "........iiiiiiiiaaajffffffffffcccccccffjjjjccjccjjjjjjcccccccccddddfffiiiiiiiiiiiill",
    "...lliiiiiaaaaaaakkjffffffffffffcccccccccjjjjjjjjjccccccccccccfcccfffiiiiiliiiiiiiiil",
    "..iiiiiiaaaaiiiihkfffffffffffffffccffccccccccccccccccccffffffcffccfffiiiillllliiiiii",
    "..iiaaaaaiiiiiaakgffffffffggfggfffffffffcccccccfffcccfffffcffffccfffiiliiiiillliiiiiiii",
    "....aaaaiiiiiifffgifffffffffffffffgggggfffffffffffffccffffcfffffffggiiliiiiiiillliiiiiii",
    "..aaaaaaiiiiiigfffffffffffffffffffffffffhhgggghhhhhffffgggggffffggfffiiiiiiiilllliiiiiiii",
    "iiaaaaaaaiiiiiiifffffgggfffffffffffffffffffffghggggffffffffffffffffffgiiiilllllliiiiiiii",
    "iiiiiiiiaaaaiiiiiiiiihhhhhhhhhhhgggffffffffffffffffffffffffffffffffffgiiillllliiiiiiii",
    "..iiiiiiiiiiiiiihhhhhhhhhhhhhhhhhhhhhhhhhhhhhggfffffffggghhhhhhhhhhhhhiiiiiiiiiiiiiiiii",
    ".....iiiiiiiiiill.bla..iiiiiiiiiihhihhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhiiiiiiiiiiii",
    "........iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.........hhhhhhhhiiiiii",
    ".....................iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.......hhhhhhhhii",
    "......................................iiiiiiiiiiiiiii"
  ],
  legend: {
    E: { pal: C.goldLight, glow: true },
    L: { pal: C.mireLight, glow: true, light: true },
    a: { m: "bone", step: 1 },
    b: { m: "bone", step: 3 },
    c: { m: "robe", step: 0 },
    d: { m: "robe", step: 2 },
    e: { m: "robe", step: 3 },
    f: { m: "water", step: 0 },
    g: { m: "water", step: 1 },
    h: { m: "water", step: 2 },
    i: { m: "water", step: 3 },
    j: { m: "wood", step: 1 },
    k: { m: "wood", step: 2 },
    l: { m: "wood", step: 3 }
  },
  idle: {
    // He does not breathe; the hood lifts and settles, slow as the water.
    waist: 53,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the open hand lifts for the fare.
    twitch: {
      frames: [7],
      patches: [
        { x: 55, y: 14, rows: [".................b", "................b.._", "..........l......._", ".........b....l", "........ll_.llbb", "......ll.bbl..l___", ".......b.l...._", ".......l......l", "a....l.bbb...._", ".a..j....ll___", "j.aalb.kk__", "ae.kb..l_", "ej.l.l._", ".a..l.ge........ak", ".e....f........k_.k", "________......._.__"] }
      ]
    }
  }
};
