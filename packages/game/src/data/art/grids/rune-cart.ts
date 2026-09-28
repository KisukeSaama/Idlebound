import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Haunted Cart (BIBLE 8.3): it still runs the line to the surface, and the line ends
 * in rock now. A miner's cart of rotten planks and iron bands, heaped with shards, pitched
 * forward on a buckled wheel over a stub of broken rail. Runes glow along its planks; the
 * front plank has split into a maw lined with crystal teeth, two rune eyes burning above.
 */
export const RUNE_CART: CreatureGrid = {
  rows: [
    "................................................hL....................hL",
    "...............................................hhL...................hLgj...................LL",
    "...............................................hhLj.................hhLgj.................hhhkj",
    "..............................................hhLgj.................hhhgj.................hhhkj",
    "..............................................hhLggj...............hhhLgj................hhhggi",
    "..............................................hhhggj...............hhhhgj....hhx.........hhhgii",
    ".............................................hhhhgji...hhk.........hhhhkj...hhhjjjjiijj.hhhhgi..hh",
    ".............................................hhhhgji..hhhg........hhhhgkiiihhhLjiiiiiiihhhhhki.hhLx",
    ".....................hL......................hhhhgji..hhhgg....jjjhhhhgkiiihhhhkiixxxxihhhhgji.hLgx",
    ".....................hhg....................hhhhgggi..hhhggjjjiiihhhhhgjiiihhhhkixxxxxhhhhhgjihhhgj",
    ".....................hhgg...................hhhhhggjjjhhhhgjhhiiihhhhhgjixxhhhhgjxxxxxhhhhggihhhhjj",
    ".....................hhgg............hhh...jhhhhhgjiiihhhhgghLgnhhhhhhgjxxhhhhggjxxxxhhhgggjikggkkkkk",
    ".....................hhhgj..........hhhhjjijhhhhhgjiiihhhhgghhgghhhhhggjxxhhgggghxxxxkkkkkkjkkkkkkkkkj",
    ".....................hhhgj...jjjjjjjhhhLjiihhhhhhgjixxhhhhhLhhgghhhhhggjxxjjgjjjhhKKkkkkkkkkkjjjjjkjjj",
    "..........hhg........hhhggjjijiiiiiihhhgjjnhhhhhhgjixxhhhhgLhhgghgggggkjxxkkkkkkjjkkkkjjjjjjjjjjjjkjjj",
    "..........hhgg..jjjjjhhhhgjiiiiihiihhhhggxxhhhhhhgjixxhgggghhhgkkkgkkkkkkkkkkkkkjjjjjjjjjjiiiixnnajji",
    ".........jhhhgjjiiiiihhhhgggixxhhLkhhhhggxxhhhhgggjixxhhggkkkkkkkkkkkkkkkjjjjjjjjjjiiiiiannbbbbbaajji",
    "...jjjjjiihhhggiiiiiihhhhhggxxxhhhkhhhhgkihhggggggjixxkhhkkkkkkkkkjjjjjjjjjjjjiinxxiibbbbbbbbbbaaajji",
    "...kkiiiiihhhgggxxxxxhhhhhggxxxhhhkhhhggkijjkkgjjjjjkkkjjkkkkkjjjjjjjjjiiiinnbbbbbbbbbbbbbcccbaaaajji",
    "...jkkkkkkhhhgggxxxxxhhhhhggkxxhhkkjjkkjjjkkkkkkkkkkkkjjjjjkkjijjiiiiiiibbbbbbbbbbbccccccccccaaaaajji",
    "...jkkkkkkkkkkkkxxxxxhhgggggkjjkkkkjkkkkkkkkkkkjjjjjjjjjjjjkjjixnnnaaaaabbbccccccccccccccccbbbaaakjji",
    "...jjjjjjjkkkkkkkkxhxxjjggjjkkkkkkkkkkkkjjjjjjjjjjjijiiinnniiiibbbbaaaabbbcccccccccccccccccbbaaaakjj",
    "....aiijjjjjjjjkkkkhgkkKKkkkkkkkjjjjjjjjjjjjjiiiiiiibbbbbbbbjiibbbcaaaacccccccccccccccccccbbbbbbbkji",
    "....bbbbbjjjjjjjjjkKgkkkkkkjjjjjjjjjjjjjiiixxxbbbbbbbbbbccccjjncccccccccccccccccccccccccbbbbxxx..kji",
    "....cbbbbbbbiiijjjjjkkkjjjjjjjjjjiiiiiinnxxxbbbbbbccccbcccccjjncccccccccccccccccccccccccxxxxx....jji",
    "....cccbbbbbbbbnnjjjjjjjjjjiiiixxbbaaaaaabbbbcccccccccccccccjjncccccccccccccccccxxxxxxxxxbbba....jji",
    ".....cccccbbbbbbbbbbjjjjnnbbbbbbbbbbaaaaabcbccccccccccccccccjjncccccccbbccxxxxxxxxxccbbbbbba....kjji",
    ".....ccccxxccccbbbbbbiiiibbbbbbbbcccbbbbbcccccccccccccccccccjjnccccccxxxxxxxxccccccNbbbbbbba....kkj",
    ".....ccccccxxxccccbbxxiiibbcccccccccccbcccccccccccccccccccccjjjxxxxxxxxxccccccccccNcNbbbbbb.....kki",
    ".....cccccRRRccccxxxbjjjjbcccccbccccccccccccccccccccccccxxxxjjixxcccccccccccccccccbNbbbbbbb.....kji",
    "......cccxRERxccccRRRbjjjcccccbbcccccccccccccccccxxxxxxxxxccjjiccccccccccNccccccccNbNbbbbb......jji",
    "......cccxRERxcccxRERxjjjcccccccccccccccccxxxxxxxxxxcNbNbccckjicccccccccNNNcnnnccbbbbbbbbbb.....jji",
    "......ccccxxxccccxRERxjjjicccccccccxxxxxxxxxxccccccccNcNcccckjicccccccccNcNcnnbbbbbbbbbbbbbba..kjji",
    "......cchhccccccccxxxcjjjiccxxxxxxxxxxccccccccccccccccNccccckkiccccccbbbbNccccbbbbbbbbbbbccaaxxkjj",
    "......hhhhxxhhhcccccccjjjjxxxxxxcccccccbbcccccccccccccNccccckkiccccccccccNccccbbbbbbbbbxxxxxxxxkji",
    "...hhxxhhhxxhhhxxhhhccjjjjcccccccNcccccccNNcccccccccccNccccckjicccccccccccccccbbbxxxxxxxxxaaaaakji",
    "..xhhxxhhhxxxhxxxhhhxxjLjjcccccccNNccccccNcNccccccccccccccccjjiccccccccccbbxxxxxxxxxbbbaaaaaaaajji",
    "..xhhxxxhxxxxhxxxhhhxxhhhjcccccccNcNcccccNNcccccccccccccccccjjicccccbbxxxxxxxxbbbbbbaNNaaaaaaaajji",
    "...xhxxxhxxxxhxxxxhxxxxhxxxccccccNccxxcccNcNcccccccccccccccckjixxxxxxxxxbbbbbbbbbbbaaNaNaaaaaakkki",
    "...xxxxxhxxxxxxxxxhxxxxhxxxhhccccNxxxxxxxcccccxccbccccccxxxxkjixxbbbbbbbbbbbbbbbbbbaaNNaaaaaaakkk",
    "...xxxxxxxxxxxxxxxhxxxxhxxxhhxxxxxccccccxxxxxxxbbbbxxxxxxxxbkjibbbbbbbbbbbbNbbbbbbbbaNaNaaaaaakji",
    "...xxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccxxxxxxxxxxxbbbbbbbkjibbbbbbbbbbbbNNbbbbbbbbbaaaaaaaakji",
    "...xxxxxxxnnnnnnnnnnnnxxxxxxxxxccccccxxxxxxxxxxbbbbbbbbbbbbbkjibbbbbbbbbbbbNbNabbbbbbaaaaaaaaakji",
    "....xxxxxxxnnnnnnnnnnnnxxxxxxxxxxxxxxxxxccccbbbbbbbbbbbbbbbbkkibxbbbbbaaaaaNabaaaaaaaaaaaaaaakjji",
    "....xxxxxxxnnnnnnnnnnnnxxxxxxxxxxbbccbbbcccbbbbbbbbbbbbbbbbbkkibxbbaaaaaaaaNaaaaaaaabbaaaaxxxkjji",
    "....xxxxxxxnnnnnnnnnnnnxxxxxxxxccccbbbbbNcNbbbbnnbbbbbbbbabbkjiaxxbaaaaaaaabbbbaaaxxxxxxxxxxakjj",
    "....xxxxxxxnnnnnnnnnnnnnxxxxxxxccccbbbbbNNNbbbnnnbbbaaaaaaaakjiaxxaaaaaaaaaaaxxxxxxxxxxaaaaaakji",
    ".....xxxxxxnnnnnnnnnnnnnxxhxxxxccccbbbbcNbNbaaaaaaaaaaaaaaaakjiaxxaaaaaaxxxxxxxxxaaaaaaaaaaaakji",
    ".....xhxxxxnnnnnnnnnxhxxxxhxxxxxxxcbbbccNaNaaaaaaaaaaaaaaabbjjixxxxxxxxxxaaaaaaaaaaaaaaaaaaaakji",
    "......hxxxxhnnxxxxxxxhxxxxhgxbbbbxxxbcccaaaaaaaaaaaaaaaaaaaajjjxxxxxaaaaaaaaaaaaaaaaaaaaaaaaakki",
    "......hxxxhhxxxxxxxxxhxxxxggjbbbbbbbbbcbaaaaccaaaaaaaxxxxxxxjjinxxaaaaaaaaaaaaaaaaaaaaaaaaaakjji",
    ".........xLhxxxxhxxxhhhxxxjjjbbcccbbbccbbaaaxxxxxxxxxxxaaaaajjinxxaaaaaaaaaaaaaaaxxaaaxxxxxakjj",
    "..........Lhxxxxhxxxhhhxxxjjjibccccbbbxxxxxxxxxxaaaaaaaaaaaajjiixaaaaaxxaaaaxaaxxxxxxxxjjjjjkji",
    "..........Lgxxxhhxxxccbbbbjjjibxxxxxxxxxxaaaaaaaaaaaaaaaaaaxjjiixnxxxxxxxxxxxxxxjjjjjjjjjjjjjii",
    "..........cccccccbcccccbbbbjjjxxxxxbaaaaaaaaaaaaaaaaxaxaaaxxjjiinnxxxxxxxxjjjjjjjjjjjiiiiiiii",
    "...........cccbbbbbbcbccbbbjjjbbbbbbaaaaaaaaaaaaaaaaxxxxxxxxjjiinnxjjjjjjjjjjjjiiiiiii",
    "...........jjbbbbbbbbbbcbbbjjjbbbbbaaaaaaaaaaxxxxxxxxxxxxxxxjjiijjjjjjjjiiiiixxxjxijjj",
    "...........jjjjjjbbbbbbbbbbjjjibbbbxaaaxaaaxxxxxxxxxxxxjjjjjjjiijjiiiiiiiikkjxxxjxxjjjj..................kk",
    "............iiijjjjjbbbbbbbjjjibbbxxxxxxxxxxxxxxjjjjjjjjjjjjjiiinnx.......kjjxxxjxxxjji..................kj",
    "...............iiijjjjjbbbbjkkibbxxxxxxxxxjjjjjjjjjjjiiiiixxx............kkjjxxxjxxxjji.................jjj",
    "..................iiiijjjjjjjjjbbxxxjjjjjjjjjjjiiiiiiii..................kkjxjjkkxxjjji................kjj",
    ".....................iiiijjjjjjjjjjjjjjjiiiiinnx.........................kjjxxxkkjjxjji................kjj",
    "........................iiijjjjijjjiiiiiiiii.............................kjjxxxkkjxxxji...............kjj",
    "...........................jjjiiiiiiiixxjjji.............................xjjxxxxiixxxji..............kkjj",
    "............................kjjjxxxkkixxjjii..............................jjxxjxxxxxjji..............kjj",
    "............................kjjjxxxjiixxjjii..............................jjjxjxxxxxjii............kkjjj",
    "............................jjjjxxxjxxjxjji...............................jjjjxxxxjjjii..........kkjjjj",
    "............................jjjjjxxxxxjjjnn................................jjjjxxxjjii........kkjjjjjjj",
    ".............................jjjjxjxxxxjnnn...............kkkkkkkkkkkkkkkkkjjjjjjjjjiikkkkkkkkjjjjjjj",
    "kkkkkkkkkkkkKjjjjjjjjjjjjjjjjjjjjjjxxxxiijjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjijjjjiiijjjjjjjjjjjii",
    "kiiiiinnnnnnnnnnnnniiijjiiiiijjjjjjjjiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijjnnnnniiiinnniiiiiiiiiiiic...bbbb",
    ".....innnnnxxnxxnnn............iiiiiinnniiibbbbbiiii................cicccbbbbbbbb.............cccbbbbbbb",
    "......cbbbbbbbbbbbb..................ccbbbbbbbbbbbbb................cbbbbbbbbbbbb.............cbbbbbbbbb",
    "......aaaaaaaaaaaaa..................baaaaaaaaaaaaaa................aaaaaaaaaaaaa.............aaaaaaaaaa"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    K: { m: "iron", step: 4 },
    L: { pal: C.shardLight, glow: true, light: true },
    N: { pal: C.shard, glow: true, light: true },
    R: { pal: C.shard, glow: true },
    a: { m: "wood", step: 0 },
    b: { m: "wood", step: 1 },
    c: { m: "wood", step: 2 },
    g: { m: "glass", step: 1 },
    h: { m: "glass", step: 2 },
    i: { m: "iron", step: 1 },
    j: { m: "iron", step: 2 },
    k: { m: "iron", step: 3 },
    n: { m: "iron", step: 0 },
    x: { pal: C.ink }
  },
  idle: {
    // The cart rocks on its buckled wheel, the whole box rising and settling.
    waist: 59,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the lower jaw of crystal teeth bites up.
    twitch: {
      frames: [5],
      patches: [
        { x: 6, y: 46, rows: ["....................h", "h..............h", ".....h...............g", "....h...............g", "x...L.....h...h.h...xx", "", "....xx....x...xxx"] }
      ]
    }
  }
};
