import { C } from "../../palette";
import type { PortraitRecipe } from "../../types";

/**
 * Thorvald, Stonebreaker (BIBLE 10.3): a mountain of a man laughing at his own bet under
 * the moon, the nose broken more than once, a wild blond mane and a beard parting into two
 * iron-ringed braids, a bear pelt over shoulders too wide for the frame, and the head of his
 * great maul resting behind the far one.
 */
export const THORVALD: PortraitRecipe = {
  materials: {
    skin: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
    hair: { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "fur" },
    fur: { ramp: [C.goldInk, C.flesh0, C.fur1], texture: "fur" },
    iron: { ramp: [C.night3, C.haze], texture: "metal" }
  },
  grid: {
    rows: [
      "...................................eeef.eee",
      "................................ecdddeeeeffff",
      "............................cccdddddccddcceffff",
      "..........................ddccbbbbccccccddcfffff",
      "........................jedcccccccccddddddddfffff",
      ".......................jjjccccccdddddddddddcffffff",
      "......................ccbaacccccbbccddcbddcccffffff",
      "....................bbbbbbbccdddddcbbbcbbdbbcdfefff",
      "...................j.bbbbcccccbbccddbbbccbbabcdcffff",
      "....................ibbbccchgaaaahhhbbadabbaabdcddff",
      ".........ef........jjbbbaaahhbbbihghhihdiiibabcbbbfff",
      ".......eehffff....jjbbbaaaabbbbaghiijihjjejjibciiabbf",
      ".....ieeeihfff....jbbbbabbbccbaahiijjjiceeeeejjejibbef",
      "...iieeeeehefff..iibbbbbbbbbaabbbiiijjicefffefffeeeeef",
      "hiiiieeeeeeeefffdfebbbbbbbaaabccbiiiijiijeffeffffeefeff",
      "iiiieeeeeeeehfffffibbbbbbaabbcccbjiiijjijjeeeefffffffff",
      "hiiieeeeeeeeheeffebbbbbbaabbbcccbiiiiijijieeeeeeeeeffff",
      "eiieeeeeeeejhhefeibbbbaabbbbbcccbbiiiiiiieeeeffeeeeffff",
      "eeeeeeeeeeeihgieeiaaaiccbbccccccbbiiiijijeeeeefeeeffffff",
      "heeeeeeeeeehhhgjehaghhabbbcbccbbbiiiiibbbbcjeeeeeeefffff",
      "geeeeeeeeeihhhgieahhhhabbbbbbbbbiiiihhhhihabbjjjeefffffe",
      "gheeeeeeehhhhhhieihhbbbbbbbbbbbiiiiihhijjjhghhiijibbeff",
      "ggeeeeeihhhhhhhhehhhbabbaabbbbbiiiiiiiijihgghhhjjhhheff",
      "ggheeehhhhhhhhhhhhhgghhhabbaabbiiiiiiiihiihghhhjeghgeff",
      "gggieihhhhhhgghhhhhhgighhhaaabbiiiiiiiiiijjhihijefjeffe",
      "ggghihhhhhhhghhhhhhhhihigghhabbiiiiijjiiiihhiiijjfeeff",
      "gggghihhhhhhhggghhhhhiiiihhhhbbiiiiiijjjejjjjjjjjeeeff",
      "gggggihhhhgggggghhhaaihighhhhbbiiiiijjjeffejjiijjjfff",
      "ggggghhhhhggggghhhabbhhhhhhhhbahhiiiijjjffejhijijjfff",
      "gggggghgggggggghhbabbgihhhhhhbhhhhiiijjjjjjihjjjijffff",
      "gggggghggggggggiebbabghhihghhhhhhhiiiijjjjjjihhiiiefef",
      "gggggghhgggggheeibaabggihiiihbhhhhhiiiijjijjiihhghiji",
      "ggggggghgggghehhbbaaabggiiiihbaahhiiiiiibbccbbhghhigi",
      "ggggggggggggihibbbaaabhggiiigbaabhiiiiihbbcbbbbhgiehf",
      "gggggggggggheejbbabbaahgggggghbabbiiiihbbhhhibihhiief",
      "ggggggggghebeebbaacbbaigghhhghiabbbiiihhhhheeehefehee",
      "gggggggghhhbibbbaccbbahgghhhgahababiiihghhhhhhieehieeffff",
      "gggggggghhhhggbaacbbhhhggghhhhhhhabbijiigghggggggheheefffff",
      "gggggggghhhggbaaccbahhhggghhhhhhhabbhjijihhhghgggieicfeefff",
      "hggggghhhhhgghhacbahhhgggghhehhhhabbhijjjijiiiiiheehhdfeefeff",
      "hgggghhhhhhgghhacbghahggghhhhghhhbaihiijjjjjjjeiffehhheeeeefffff",
      ".gghhhhggggggghgbbggaaggghhhhgghbaaihhbjjjjjjjeefffhbbieeeeeeeff",
      "hghhhhhhggggggghgchaaahgghhbbgghbbahhhbijjjjiiiiifeibceiijeeeefe",
      "hhhggggghhgggggghhiacaagghhcbgghbbahhhcijjjjiibiieeebceeiiieeeef",
      "gggggghgghhhgggggghbbabhgcccbgggabbaaccbjjjiibccieefecceeiiheeee",
      "ggggghhhgghhhhggggghabbbacccbggghbbbbccbbjjjjbccceeffccceiiijeee",
      "ggghihhhhhhghhhgggggabbbaccchhgghhbbbcccccjjjccddefffeiceehiiiee",
      "ggghhhhhhhghghhhgggggbbbbbbhhhhgggbbbccccccjiccddffffeibbfeiiiih",
      "hgghhhghhiihhhhhhgggggbbabagghhhggbbbcccccccccddddffffhbbefiiiii",
      "ggghhhiihiiihhgghhgggggaacbgghhhgghabbcbccccccdddddeffiabdfhhiii",
      "gghhhiiiiiiiihhgghhggghaacbghhhhhgghbacbbcccccccdcddfehbbcdhhiii",
      "hhhhhhhiiihiihhggghhgghhabahhhhhhgghhacbbcccccccdccdefhbbcdghhih",
      "iihhhhhhhhghhhhgggghgghcbaahhhhhhhgghhbbbbccccccdbcdeegbacbghhhh",
      "iiiiihhhhgggghhghgghgghccbabhhhhhhhgghhbaacbbcccdbbcfighahhgghhh",
      "gghhiiiiiiihggghhhhggggacbbbghhhhhhgggghhabbbcccbbbcehgghheehhhh",
      "ghhggggghhhghgggghhggggaabbbhghhhhhhgggghggbabbcbbbdeiggghgeeihh",
      "hhhhggggghhhggggghhhhgghbabbhgghhhhhhggggggaabcccbbeiggghhaheiih",
      "iihhiiiihhhhgggghhhhhgggaahcggggghhhhgggggghaaccccceehhgibbchiih",
      "iihhhhhhhiiiiighhhhgggggghehgggggghhhhggggghghhacccehgihbbbdghij",
      "hgggggghiiiiihhhgggggggghhiehggggghhhhhggghhggghccbihggghbbcghhi",
      "ggggggghhiihhhhhggggggggghgheghggghhhhhhgghhgghgacbbggggghhiehhh",
      "gghhhhhhihhghhhhhhhgghgggiaahhhhhgghhhhhhhhhhhhhhcbhggggggieehhi",
      "ghhhhhhhhgggihhhhhhghhhggbacighhhhhhhhhhihhhhhhhhiiiihggghhhjhhh",
      "hhhhhhhhggghihiihhhgihhgbcaddhghiihhhgghiihhhhiiiiiijiggggaheeii"
    ],
    legend: {
      a: { m: "hair", step: 0 },
      b: { m: "hair", step: 1 },
      c: { m: "hair", step: 2 },
      d: { m: "hair", step: 3 },
      e: { m: "iron", step: 0 },
      f: { m: "iron", step: 1 },
      g: { m: "skin", step: 0 },
      h: { m: "skin", step: 1 },
      i: { m: "skin", step: 2 },
      j: { m: "skin", step: 3 }
    }
  }
};
