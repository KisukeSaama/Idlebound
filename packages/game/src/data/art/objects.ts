import type { AltarId, SkillId } from "../../types";
import type { CaravanWareId } from "../caravan";
import type { MarketOfferId } from "../market";
import { C } from "./palette";
import type { PixelMask } from "./types";

/** Relic icons live in `relics.ts`. */
export * from "./relics";

/**
 * Pixel icons of in-world spots (the Sanctum's altars, the powers, the Stallkeeper's wares),
 * 16 × 16, drawn by hand one character per pixel through `ICON_INK`; `.` is empty and the
 * generator adds the ink outline. Within each family (altars, powers, stall wares) no two
 * share a silhouette: a test compares their outlines.
 */
export interface IconRecipe {
  rows: readonly string[];
  /** Characters that are light (flames, glints, runes): no outline around them. */
  glow?: string;
}

/** One character per Orvane 64 entry, shared by every icon. */
export const ICON_INK: PixelMask["legend"] = {
  "1": { pal: C.night1 }, "2": { pal: C.night2 }, "3": { pal: C.night3 }, "4": { pal: C.night4 },
  "5": { pal: C.dusk },
  h: { pal: C.haze }, l: { pal: C.lilac }, W: { pal: C.moon }, i: { pal: C.pale }, c: { pal: C.paper },
  q: { pal: C.goldInk }, o: { pal: C.goldDeep }, g: { pal: C.goldDark }, G: { pal: C.gold }, Y: { pal: C.goldLight },
  p: { pal: C.essence }, P: { pal: C.essenceBright }, L: { pal: C.essenceLight },
  S: { pal: C.keepStone }, y: { pal: C.royal }, a: { pal: C.keepAccent }, V: { pal: C.violetFire },
  v: { pal: C.vault1 }, m: { pal: C.vault2 }, u: { pal: C.rareBlue }, U: { pal: C.shard }, z: { pal: C.shardLight },
  w: { pal: C.flesh0 }, b: { pal: C.fur1 }, B: { pal: C.fur2 }, n: { pal: C.fur3 },
  k: { pal: C.flesh1 }, K: { pal: C.flesh2 }, N: { pal: C.flesh3 },
  j: { pal: C.blood }, r: { pal: C.red }, R: { pal: C.danger }, e: { pal: C.ember }, E: { pal: C.amber },
  t: { pal: C.field1 }, x: { pal: C.field2 }, X: { pal: C.field3 }
};

export const ALTAR_ICONS: Record<AltarId, IconRecipe> = {
  // A fist of the Anvil, clenched on its block.
  might: {
    rows: [
      "................",
      "................",
      "....NNKNNKNNK...",
      "...NKKkKKkKKkk..",
      "...KKkkKkkKkkk..",
      "...kkwkkwkkwkk..",
      "..NNNNNKkkkkkk..",
      "..KKKKKKkkkkkw..",
      "...kkkkkkkkkw...",
      ".....kkkkkkw....",
      "..lllhhhhhhhhh..",
      "..lhhSSSSSSSS4..",
      "..hSSSSSSSSS43..",
      "..SSS4SSSS4S43..",
      "..444444444443..",
      "................"
    ]
  },
  // The Sword-Mother's blade, driven into a rock.
  blade: {
    rows: [
      "................",
      ".......YG.......",
      "......YGGg......",
      ".......nb.......",
      ".......nb.......",
      "...gGGGGGGGGg...",
      ".......Wh.......",
      ".......Wh.......",
      ".......Wh.......",
      ".......lh.......",
      "......4lhS......",
      ".....hlShS4.....",
      "....hlSSSS443...",
      "...hSSSSS4S443..",
      "..444444444443..",
      "................"
    ]
  },
  // A warm coin with a bite out of its rim.
  fortune: {
    rows: [
      "................",
      "......GYYG......",
      "....GYYYGG......",
      "...GYGgggG......",
      "...YGgGGGGG.....",
      "...YGgGYGGgGg...",
      "...GGgGGGGgGo...",
      "...GGgGGGGgGo...",
      "...GGGggggGgo...",
      "....oGGGGGgo....",
      "......oggo......",
      "....hllhhhS4....",
      "...hlSSSSSS43...",
      "...SSSSSS4S43...",
      "...4444444433...",
      "................"
    ]
  },
  // The Silent Legion's cairn, narrow in the middle like an hourglass.
  patience: {
    rows: [
      "................",
      "......hll.......",
      ".....hlhS4......",
      "...hlllhhhhS4...",
      "..hlhhhhSSSS43..",
      "...4SSSSSS4433..",
      ".....44S443.....",
      "......hS43......",
      ".....hlS443.....",
      "...hllhhSSS43...",
      "..hlhhhSSSSS43..",
      ".hlhhSSSSSSS443.",
      ".hhSSSSS4SSS443.",
      ".4SSSS4SSSS4443.",
      "..444444444433..",
      "................"
    ]
  },
  // Eldra's sundial, the gnomon's shadow on its face.
  time: {
    rows: [
      "................",
      ".......Y........",
      ".......YG.......",
      ".......YGg......",
      ".......GGgg.....",
      "...lllllGgghh...",
      ".hlccWcooocch4..",
      ".lcccccccccch4..",
      "..4hhhhSSSSS43..",
      "....4hSS443.....",
      "......hS43......",
      "......hS43......",
      "......hS43......",
      "....hlhSS443....",
      "...4444444443...",
      "................"
    ]
  },
  // A blind seer's standing stone: five notches, no more.
  fate: {
    rows: [
      "................",
      "......hll.......",
      ".....hlllh4.....",
      ".....hlhhS4.....",
      ".....hPPPS4.....",
      ".....hhhSS4.....",
      ".....lPPPS4.....",
      ".....hhSSS4.....",
      ".....lPPPS4.....",
      ".....hhSSS4.....",
      ".....hPPPS4.....",
      ".....hSSSS4.....",
      ".....hPPPS4.....",
      "....hhSSS443....",
      "...44444444433..",
      "................"
    ],
    glow: "P"
  },
  // An arrowhead set into the stone, pointing at nothing you can see.
  precision: {
    rows: [
      "................",
      ".......lW.......",
      "......lWWh......",
      "......lWhm......",
      ".....lWWhmm.....",
      ".....lWhhmm.....",
      "....lWWhhmmv....",
      "....lWhhhmmv....",
      "...lWWhhhmmmv...",
      "...lv..hm..mv...",
      "..hllhhhhhhSS4..",
      "..hSSSSSSSSS43..",
      "..hSSS4SSSSS43..",
      "..SSSSSSS4SS43..",
      "..444444444443..",
      "................"
    ]
  },
  // A chest the size of a rat on Thorvald's slab: FOR PIP.
  treasure: {
    rows: [
      "................",
      "................",
      "................",
      ".....bnnnnb.....",
      "....bnBBBBnb....",
      "....oGGYGGGo....",
      "....bBBGYBBb....",
      "....bBBBBBBb....",
      "....wbbbbbbw....",
      ".hllllhhhhhhS4..",
      ".hSSSSSSSSSS43..",
      ".lScScSSccSS43..",
      ".hSSSSSSSSSS43..",
      ".SSS4SSSSSSS43..",
      ".4444444444433..",
      "................"
    ]
  },
  // The Stallkeeper's scale.
  bargain: {
    rows: [
      "................",
      ".......YG.......",
      "..GYYYYYGGGGGg..",
      "...g...Gg...g...",
      "...g...Gg...g...",
      "...g...Gg...g...",
      ".YGGgo.Gg.YGGgo.",
      "..ogo..Gg..ogo..",
      ".......Gg.......",
      ".......Gg.......",
      ".......Gg.......",
      ".......Gg.......",
      "......nGGb......",
      ".....bnnBBw.....",
      "....wbbbbbbw....",
      "................"
    ]
  },
  // Oriane's stone, answering a moment early.
  echoes: {
    rows: [
      "................",
      "................",
      "................",
      "................",
      "......hllh......",
      "..P..hlhhhS..P..",
      ".P..hlPPPPS4..P.",
      ".P..hPhhhhP4..P.",
      ".P..lPhPPhP4..P.",
      "..P.hPhhhhP4.P..",
      "....hhPPPPS4....",
      "...hhSSSSSS43...",
      "..hSSSSSSSS443..",
      "..SSS4SSSS4443..",
      "..444444444433..",
      "................"
    ],
    glow: "P"
  },
  // A sheaf bound over its seeds.
  harvest: {
    rows: [
      "................",
      "....G..Y..G.....",
      "...GY.GYG.YG....",
      "...YGgYGgGYg....",
      "....gGYGgGg.....",
      ".....gGgGg......",
      ".....nBBBb......",
      "......XxXt......",
      ".....XxtXxt.....",
      "....Xx.t.Xxt....",
      "...Xt..x...xt...",
      "..nYGYGGYGYGn...",
      "..bnnnnnBBBbw...",
      "...bBBBBBbbw....",
      "....wwwwwww.....",
      "................"
    ]
  },
  // A boot that walked the first road without its walker.
  wanderer: {
    rows: [
      "................",
      "......nBBBBn....",
      "......bnnnnb....",
      ".......bBBBw....",
      ".......bBBBw....",
      ".......bBBBw....",
      ".......bBBBw....",
      "......bBBBBw....",
      "....bbBBBBBw....",
      "..bnBBBBBBBw....",
      ".bnBBBBBBBBw....",
      ".wwwwwwwwwww....",
      ".hlllhhhhhhhS4..",
      ".hSSSSSSSSSS44..",
      "..4444444444433.",
      "................"
    ]
  },
  // A purse at the stone's foot, buried again every night.
  memory: {
    rows: [
      "................",
      "................",
      ".....a.aa.a.....",
      "......yaay......",
      "......oGYo......",
      ".....yaaaay.....",
      "....yaaVaaay....",
      "....yaVaaaay....",
      "..tXyaaaaaayXt..",
      ".tXxxSyyyySxxXt.",
      ".XxxbbbGYbbbxxt.",
      ".xbbBBbbbbBBbbx.",
      ".bbBbbwbbbbbBbw.",
      "..wbbbbbwbbbbw..",
      "...wwwwwwwwww...",
      "................"
    ]
  }
};

export const POWER_ICONS: Record<SkillId, IconRecipe> = {
  // The walker's own fury.
  frenzy: {
    rows: [
      "................",
      "........GYYo....",
      ".......GYYo.....",
      "......GYYo......",
      ".....GYYo.......",
      "....GYYo........",
      "...GYYYYYYYo....",
      "...ooooGYYo.....",
      "......GYYo......",
      ".....GYYo.......",
      "....GYYo........",
      "...GYYo.........",
      "..GYo...........",
      "..Yo............",
      "................",
      "................"
    ]
  },
  // Maëlle's horn, carved from the Moss Alpha's tusk.
  rally: {
    rows: [
      "................",
      "................",
      "................",
      "...........hlW..",
      "..........hcccW.",
      "..........lcccc.",
      ".W.......lcccch.",
      ".lc.....GYcccch.",
      "..lc...lgGccch4.",
      "..lcc.lccgcch4..",
      "...lcccccgch4...",
      "....4hhhhh44....",
      "......4444......",
      "................",
      "................",
      "................"
    ]
  },
  // The trees lend Ysolde their eyes.
  hawkeye: {
    rows: [
      "................",
      "................",
      "................",
      "....xXXXXXXx....",
      "...xXWllllWXx...",
      "..xWlluUUullWx..",
      ".xWluUz11UuulWx.",
      ".xWluU111UuulWx.",
      "..xWluUUUUulWx..",
      "...xXWllllWXx...",
      "..t.xXXXXXXx....",
      ".t..............",
      "t...............",
      "................",
      "................",
      "................"
    ]
  },
  // Coins falling like rain: Pip's answer to a prayer.
  goldrain: {
    rows: [
      "................",
      "..........i.....",
      "...i.......gYg..",
      "..........YGGGo.",
      "..........YGGGo.",
      "..........YGGGo.",
      "..gYg...i..ooq..",
      ".YGGGo..........",
      ".YGGGo..........",
      ".YGGGo..........",
      "..ooq...gYg.....",
      ".......YGGGo....",
      ".......YGGGo....",
      ".......YGGGo....",
      "........ooq.....",
      "................"
    ],
    glow: "i"
  },
  // Nyx ties the walker's heartbeat to the night.
  ritual: {
    rows: [
      "..............P.",
      ".............P..",
      "...rRRr..rRRP...",
      "..rRWRrrrRRPrj..",
      "..rRRRrrrPPrrj..",
      "..rRRrrrPrrrrj..",
      "...rrrrPrrrrj...",
      "....rrPrrrrj....",
      ".....PrrrrPj....",
      "....P.rrjP......",
      "...P...jP.......",
      "..P....P........",
      ".P..............",
      "................",
      "................",
      "................"
    ],
    glow: "P"
  },
  // Garrick's pick strikes an echo vein, and the moment rings twice.
  echo: {
    rows: [
      "................",
      "....mhhhl.......",
      "...m...vmhl.....",
      "........vbml....",
      "........bBvhl...",
      ".......bBv.ml...",
      "......bBw...ml..",
      ".....bBw....ml..",
      "....bBw......l..",
      "...bBw......i...",
      "..bBw......zU...",
      ".bBw......zUUu..",
      ".bw......zUUUuu.",
      ".........vuuuvv.",
      "................",
      "................"
    ],
    glow: "i"
  },
  // A spindle from Eldra's Loom, its thread coming loose.
  unweave: {
    rows: [
      "....b...........",
      "....n.......c...",
      "....n......c.c..",
      "...ayy....c...c.",
      "..ayyay..c......",
      "..yayya.c.......",
      "..ayyyyc........",
      "..yayay.........",
      "..ayyay.........",
      "...yay..........",
      "....n...........",
      "..oGGYGg........",
      "....n...........",
      "....b...........",
      "................",
      "................"
    ]
  }
};

export const MARKET_ICONS: Record<MarketOfferId, IconRecipe> = {
  // A relic chest from the road.
  chest: {
    rows: [
      "................",
      "................",
      "................",
      "....bnnnnnnb....",
      "...bnBBBBBBnb...",
      "..bBBBBBBBBBBb..",
      "..oGGGGYYGGGGo..",
      "..bBBBgYYgBBBb..",
      "..bBBBgGGgBBBb..",
      "..bBBBBooBBBBb..",
      "..bBBBBBBBBBBb..",
      "..wbbbbbbbbbbw..",
      "..oggooooooggo..",
      "................",
      "................",
      "................"
    ]
  },
  // The great chest: a gilded reliquary with a gem on its roof.
  "great-chest": {
    rows: [
      "................",
      ".......PL.......",
      ".......pP.......",
      "......oGGo......",
      ".....oGYYGo.....",
      "....oGYGGGGo....",
      "...oGYGGGGGGo...",
      "..gGGGGGGGGGGg..",
      ".oggggggggggggo.",
      ".yaaaaGYYGaaaay.",
      ".yaVaaGYYGaaVay.",
      ".yaaaagGGgaaaay.",
      ".yaaaaaggaaaaay.",
      ".oGGGGGGGGGGGGo.",
      ".o.o........o.o.",
      "................"
    ]
  },
  // Mirelle's rage potion.
  rage: {
    rows: [
      "......nBBn......",
      "......wbbw......",
      "......uzUu......",
      "......uzUu......",
      "....uzUUUUUu....",
      "...uzUUUUUUUu...",
      "..uzUUUUUUUUUu..",
      "..uRRRRRRRRRRu..",
      "..uRWRrrrrrrru..",
      "..urRrrrrrrrju..",
      "..urrrrrrrrrju..",
      "...urrrrrrrju...",
      "....ujjjjjju....",
      "................",
      "................",
      "................"
    ]
  },
  // Mirelle's fortune elixir, in an urn with two handles.
  fortune: {
    rows: [
      "................",
      ".....oGGGGo.....",
      "......gGGg......",
      "...gg.gYGg.gg...",
      "..g..gYYGGg..g..",
      "..g.gYYGGGGg.g..",
      "...gGYGGGGGGgg..",
      "....yaaaaaay....",
      "....GYGGGGGg....",
      "....gYGGGGGg....",
      ".....gGGGGg.....",
      "......oggo......",
      ".....oGGGGo.....",
      "....oggggggo....",
      "................",
      "................"
    ]
  },
  // A page from Lysandre's grimoires: the sword reads it and strikes.
  autoclick: {
    rows: [
      "................",
      ".oGGGGGGGGGGGGo.",
      ".gYnnnnnnnnnnGg.",
      "..ccWWWWWWWWc...",
      "..cW4444W44Wc...",
      "..cWWWWWWWWWc...",
      "..cW444W444Wc...",
      "..cWWWWWWWWWc...",
      "..cW44444WWWc...",
      "..cWWWWWWWWWc...",
      "..cW4444W4WWc...",
      "..cWWWWWWWWWc...",
      "..cWcWWWcWWc....",
      "..c..cWc..c.....",
      "................",
      "................"
    ]
  },
  // Bottled time from Eldra's loom.
  hourglass: {
    rows: [
      "................",
      "..oGGGGGGGGGGo..",
      "..gYYGGGGGGGGg..",
      "...uzUUUUUUUu...",
      "....uYYYYYYu....",
      ".....uGGGGu.....",
      "......uGGu......",
      ".......uu.......",
      "......uzUu......",
      ".....uzUGUu.....",
      "....uzUGGGUu....",
      "...uzGGGGGGGu...",
      "..oGGGGGGGGGGo..",
      "..gooooooooooq..",
      "................",
      "................"
    ]
  }
};

export const CARAVAN_ICONS: Record<CaravanWareId, IconRecipe> = {
  // The Stallkeeper's Token: brass, with a hole, on a cord.
  token: {
    rows: [
      "................",
      "......bnnb......",
      ".....b....b.....",
      ".....b....b.....",
      "......b..b......",
      ".....oGYYGo.....",
      "...oGYYYGGGGo...",
      "...GYGGGGGGgo...",
      "...YGG....Ggo...",
      "...YGG....Ggo...",
      "...GGG....ggo...",
      "...GGG....ggo...",
      "...gGGGGGggoq...",
      ".....oggggoq....",
      "................",
      "................"
    ]
  },
  // A sealed coffer; the seal is not the Stallkeeper's.
  "sealed-coffer": {
    rows: [
      "................",
      "................",
      "....45555554....",
      "...4hlhhhhhh5...",
      "...5hhhhhhhh4...",
      "...oGGGGGGGGo...",
      "...5hhhrrhhh4...",
      "...5hhhrrhhh4...",
      "...5hhhrrhhh4...",
      "...5hhhrrhhh4...",
      "...oGGGrrGGGo...",
      ".......rr.......",
      "......RrrrR.....",
      "......rRWrj.....",
      ".......jjj......",
      "................"
    ]
  },
  // Two hours of night in a bottle, lying on its side.
  "bottled-night": {
    rows: [
      "................",
      "................",
      "................",
      "...uzzUUUu......",
      "..uz22222Uu.....",
      ".uz2222W22Uu....",
      ".u2W22222Y2Uuuu.",
      ".u22222Y222UzUbn",
      ".u2222222W2Uuuu.",
      ".uz222W2222Uu...",
      "..uU222222Uu....",
      "...uuUUUUuu.....",
      "................",
      "................",
      "................",
      "................"
    ]
  },
  // A wedge of Pip's cheese, already nibbled.
  "pips-cheese": {
    rows: [
      "................",
      "................",
      "................",
      "..........YY....",
      "........YYGG.Y..",
      "......YYGGGGYG..",
      "....YYGGGGGGGG..",
      "..YYGGGGGGGGGg..",
      "..GGGGGGGGGGGg..",
      "..GoGGGGGoGGGg..",
      "..GGGGoGGGGGgg..",
      "..gGGGGGGoGGgg..",
      "..ooooooooooog..",
      "................",
      "................",
      "................"
    ]
  },
  // A lantern that draws the crystals, a moth at its glass.
  "moth-lantern": {
    rows: [
      ".....bnnb.......",
      "....b....b......",
      ".....bnnb.......",
      "....oGGGGo......",
      "...oGYYGGGo.....",
      "...g4EEEE4g.W..W",
      "...g4EYYE4g.cWWc",
      "...g4eYYe4g..cc.",
      "...g44ee44g.....",
      "...oGGGGGGo.....",
      "....oggggo......",
      "................",
      "................",
      "................",
      "................",
      "................"
    ],
    glow: "EYe"
  },
  // Rage and fortune in one tankard, still burning.
  "ember-draught": {
    rows: [
      "................",
      "....e...e.......",
      "...eEe.eEe......",
      "..eEYEEYEe......",
      "..wnnnnnnw......",
      "..bBGBBGBbbbbb..",
      "..bBGBBGBb...b..",
      "..bBGBBGBb...b..",
      "..bBGBBGBb...b..",
      "..bBGBBGBb...b..",
      "..bBGBBGBbbbbb..",
      "..bBGBBGBb......",
      "..wbbbbbbw......",
      "................",
      "................",
      "................"
    ],
    glow: "eEY"
  },
  // A spool of Eldra's thread, lying on its side, a strand loose.
  "eldra-thread": {
    rows: [
      "................",
      "................",
      "..nb........nb..",
      ".nBBb......nBBb.",
      ".nBBbPPPPPPnBBb.",
      ".nBBbpPPpPPnBBb.",
      ".nBBbPpPPpPnBBb.",
      ".nBBbpPPpPPnBBb.",
      ".nBBbPPpPPpnBBb.",
      ".nBBbpppppPnBBb.",
      ".nBBb....P.nBBb.",
      "..bw......P.bw..",
      "..........P.....",
      "...........PP...",
      "................",
      "................"
    ]
  },
  // Three crates from the road.
  "three-chests": {
    rows: [
      "................",
      "................",
      "................",
      ".....nBBBBn.....",
      ".....BbbbbB.....",
      ".....BnBBnB.....",
      ".....BbbbbB.....",
      ".....wbbbbw.....",
      ".nBBBBnnBBBBBn..",
      ".BbbbbBBbbbbbB..",
      ".BnBBnBBnBBBnB..",
      ".BbbbbBBbbbbbB..",
      ".BnBBnBBnBBBnB..",
      ".wbbbbwwbbbbbw..",
      "................",
      "................"
    ]
  }
};

/**
 * The wandering crystal (16 × 24): three facets that catch the light in turn. `0` to `3`
 * are steps of the essence ramp, `f` marks the facets that light up frame by frame.
 */
export const CRYSTAL_MASK: PixelMask = {
  rows: [
    "................",
    ".......2........",
    "......233.......",
    ".....2a331......",
    ".....2a331......",
    "....22a3311.....",
    "....2aa3311.....",
    "...22aa33311....",
    "...2aab33b11....",
    "..22abbb3bb11...",
    "..2aabbbbbb11...",
    "..2aabbbbbc11...",
    "..2aabbbbcc11...",
    "..22abbbccc11...",
    "...2abbcccc1....",
    "...22bbccc11....",
    "....2bccc11.....",
    "....22ccc1......",
    ".....2cc11......",
    ".....22c1.......",
    "......221.......",
    ".......2........",
    "................",
    "................"
  ],
  legend: { "1": 0, "2": 1, "3": 3, a: 2, b: 2, c: 1 }
};

/** Facet keys of the crystal, lit one per frame. */
export const CRYSTAL_FACETS = ["a", "b", "c"] as const;
