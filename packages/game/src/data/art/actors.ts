import { C } from "./palette";
import { WALKER_STAND, WALKER_STRIKE, WALKER_WALK } from "./grids/walker";
import type { CreatureGrid, ResolvedRecipe } from "./types";

/** What the walker is doing in a shot: standing on guard, walking, or striking. */
export type WalkerPose = "stand" | "walk" | "strike";

const walkerRecipe = (pose: string, grid: CreatureGrid): ResolvedRecipe => ({ id: `walker-${pose}`, rank: "normal", materials: {}, grid, seed: 8211 });

/**
 * The walker as the Ledger's scenes show them (BIBLE 12.10): Aldric in their own drawing
 * (`grids/walker.ts`), each pose a recipe, the stride four of them. Their colors are their
 * own, never an era's: the walker is the one thing in the night the night did not make.
 */
export const WALKER_POSES: Readonly<Record<WalkerPose, readonly ResolvedRecipe[]>> = {
  stand: [walkerRecipe("stand", WALKER_STAND)],
  walk: WALKER_WALK.map((grid, frame) => walkerRecipe(`walk-${frame}`, grid)),
  strike: [walkerRecipe("strike", WALKER_STRIKE)]
};

/**
 * The crown in the ice (BIBLE 12.10, the Crown in the Ice): a broken block of rime seen three
 * quarters, lit by the moon from the upper right, its edges catching the light and cracks
 * running across it; frozen inside, a small gold crown of five points, older than the King's,
 * rubies and a pale stone at its band, its lower half dimmed by the ice. Painted at four times
 * the size and traced into clusters, like the creatures. Drawn up close, alone in the dark.
 */
export const RIME_CROWN: ResolvedRecipe = {
  id: "rime-crown",
  rank: "normal",
  materials: {},
  grid: {
    rows: [
      "....................................aabbbbbbaaaaaaaa",
      ".......................bbbabbbbaaaaaaabbbbbbaaaaaaaaaaaaac",
      "................bbabbabbbbbaaaababaaaaaaaaaaaaaaaaaaaaaacdd",
      ".............bbbbbabbbaabbbbaaabbbaaaaaaaaaaaaaaaaaaaaacaddd",
      "..........bbbbbbbbbbbbbabbbbaaaaabaaaaabaaaaaaaaaaaaaaaaddddd",
      ".........bbbbbbbbbbbbbbaabbaaaaaabbbabbbaabaaaaaaaaaaacdeddddd",
      "........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaabbbbbaaaaaaacdeeddddd",
      ".......bbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaabbbbbbabaaaaacdededddde",
      "......bbbbbbbbbbbbbbbbbbbbbbbbbbbaaaabbaabbabbbaaaaceeededddde",
      ".....bbbbbaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaeeededddde",
      "....bbaaccaaaaacccccaaaaaaaaaccccccaaaaaacccaaaaacaeeeeeeddddd",
      "...cccabbdddddbbddbabbaaaaabbaabddbbbbbbbbbaaacccceeeeeededddd",
      "...bbbbdddddddbdddbbddddddbbbbabdbbbbbbbbbbabbbaaefeeeeeddddddd",
      "...ddddbbdddddbbdbdbbddddbbbbbbbdbbbdbbbbbaaabbbbffeeeeeddddddd",
      "...ddddbcddddddddbddddbbgbdbbbbbdbbbdbbbbabbabbbbefeeeeeddddddd",
      "...eeddddcdddddddbdddbbdgbddbbbbbdbbbbbbbabbbbaabefeeeeeeddeedd",
      "...eedabdbcbddddbddddddddbbdbbbbbbbbbbbbabbbbbaaaefeefeeedeeedd",
      "...ddedabedcbdddddddddddgbddbbghddbbbbbbabbbbbbaadfeefefedeeede",
      "...ddeeebbeddddddiidddddgddddddddddbbdbaabbbbbbbbdfeefefedeeede",
      "...eeeeeebadddedeeidddddghdddddhdddddggabbbbbbbbbdeeefefedeeede",
      "....eeeeeedabeedeeidddddihdddddhdddddgaadbbbbbbbbdeeefefedeeede",
      "....eeeeeeejabeddeidedddigbbddegdddddgcddbdbbbbbbbeeefefeeeeede",
      "....eeeeddeedaaddeideddeiggbdegggdbddgcddbddbbbbbdeeefffeeeeeee",
      "....eeeeeeeeidbaeiiieeegiigddegggbbddgcddbbddbbbbdeeeffffeeeeee",
      "....eeeeeeeiieebaiiieeeigigddeggggdddggddbbbbbbbbdfeeffffeeeeee",
      "....eeeeeeeiieeddciiideiggiddeggggddgggdbdbbbbbbbbfeeffffeeeeee",
      "....eeeeeeeiiieeejciidejigiieeigggddggggbbbbbbbbbbffeffffeeeee",
      "....eeeeeejjiieeejicieejjiiieiiiiigdgghggbdbbbbbddffeffffffeee",
      "....eeeeeejjiiiegjjiceeiiggghhhhhhhhhhhddddbbddbbdffeffefffeee",
      "...eeeeeeejjjiiggggggghhggggghgghhghhghddddbbdddbeffeffeffeeee",
      "...eeffeefjjjiijiijiijiiiigiigiigggkgigdddddbaddbefffffeffeeee",
      "...eeeeeffffljjjjijjijjimmniiokiigokkiiddddddabdbeffffeeffeeee",
      "...efeeeffeflljokijjokkjmmnijokkjiooggidddddddbbdefffffeffeeee",
      "...efeefeeeflllokkjlooklmmmjjlojjjijjiidddddddbbdefffffeffeee",
      "...effffffeflllooljlljlljjljjljjjjijjiiddddddddddeffffffffeee",
      "...effffffeffllllllllljlljlljjlfeeeeeeeddddddddddeffffffffeee",
      "..ffeffeefefflllllffffeffeeeeeffeeeeeeddddddddddeeffffffefeee",
      "..ffffffffffffffffffffeeeeeeeeeeeddddeedddddddddfeffffffefee",
      "..ffffffffeeeffffeeeeeeeeeeeeeeeddedeedddeddddddffffffffefe",
      "..ffffffffeeeeeffeeeeeeeeeeeeddeddedeedddedddddeffffffffeff",
      "..fffffffffffeefffeefeeeeeeeeeebeeeeeeeededddddeffffffffff",
      "...ffffffffffeaeffeeffeeeeffeeebaeeeeeeeeeeeeddefffffffff",
      "...fffffffffffeaefffefeeeeffeeeeeaeeeeeeeeeeeddeefffffff",
      "....fffffffffffeaefffffeeeffeeeeeeabeeeeeeeeeedeefffff",
      "....ffffffffffffeeffffffeeffefeeeeebeeeeeeeeeedeeffff",
      ".....pffffffffffffffffffeffeefeeefeeeeeeeeeeeeeeeef",
      ".....pfffffffffffffffffffffeeeeffffeeeeeeeeeeee",
      "......ffffffff............ffffeffffeeeee"
    ],
    legend: { a: { pal: C.pale }, b: { pal: C.lilac }, c: { pal: C.shardLight }, d: { pal: C.haze }, e: { pal: C.vault2 }, f: { pal: C.vault1 }, g: { pal: C.gold }, h: { pal: C.goldLight }, i: { pal: C.goldDark }, j: { pal: C.goldDeep }, k: { pal: C.red }, l: { pal: C.goldInk }, m: { pal: C.essence }, n: { pal: C.essenceLight }, o: { pal: C.blood }, p: { pal: C.night2 } },
    idle: { waist: 0, breath: [0] }
  },
  seed: 8221
};
