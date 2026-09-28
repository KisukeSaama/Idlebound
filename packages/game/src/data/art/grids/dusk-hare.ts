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
    "..............................iii",
    ".............................iigg",
    "............................iigggh",
    "............................igggfh",
    "..........................igggfgf",
    ".........................iiggfgf",
    ".........................iigfgff",
    "........................iigfgg0.........ii",
    ".......................iigfggg.......iihhf",
    "......................iigfgggg...iiiiii000",
    ".....................iigfgg00.iiiiiifff00",
    "....................iigfggg0.iiifffff00",
    "....................iggfggf0iiffffff00",
    "...................iigfggffggfffff00",
    "..................iiggffffggffff00",
    ".................iiggfgfffffffff",
    ".................iiggfggfffffff",
    "................iiggfgffffff00",
    "...............iigggfffffff00",
    "...............igggffffff000",
    "............iiihgggffffffx",
    "..........iiiihhhhgffffff",
    "........iiihhhhhhhhfff00",
    ".......iihxxxxhhhhggf00",
    ".......ix0000000xggggf",
    "......iihhffAEAffggfgf",
    "......ihhhffAAffgfffff",
    "......igggffffffgfffff",
    ".....iiggggffffgggffff",
    "...iiiggggggggggggfffffff",
    "..00ggggggggggggggfffffiih",
    "..iiggggggfggggffggf000hhhiii",
    "..iggggggffffgggfgff0000ghhgiii",
    "...xgxggff0fffg000fffggggggggggg",
    "...ixxgxx00000000000fggggggggggggg",
    "....xxxff.0000000000fggggggggggggfiiii",
    "....vv........0ffff0fffggggggghhgffggiii",
    "....vv.........hfffffffggggggggggggggggii",
    "...............hffghhfggggggggggggggggggii",
    "...............hggggggggggxgggggggggggggggg",
    "...............igghhhgggfffxxggggggggggggggg",
    "...............iigghhhhhffgggxxgggggggggggggii",
    "...........hff.iihhhhhhhhg0ggggxxhhgggggggggggg",
    "........iiiiiiiiihhhgghhhgx0gghggxhhgggggghffggg",
    "........iffffffiiihggggghggxxgggggxhgggghhhhgggggg...........h",
    "........hf00ffgggggghhgggggggxxgggxhiggghhhhggggggg.......i.ix",
    "............igggggggghhhggfgffgxxg0xiihghhhhhhgggggg......jjihh",
    "..........iiigggggggghhgghxfgggggx0ffhhghhhhhhhhghggg....iiiihhhg",
    "......iiiiigggggffff..iffh0xxxggggxffhhhhhhhhhhhhhgggh...iihhhggg",
    ".v.iiigghggggggfff.....ffgg0fxxhgfxffhhhhhhhhhhgggggghh..ihhhhhgg",
    "v.iigggghggggggf........ggggfggxxf0xfhhhhhhhhhhfggggg00..ihhhhhgg",
    "v.ihffffff000............ggg00ghhx0fhhhhhhhhhgffffgggg0...hghggg",
    ".v.hff....................ggfggfffxfhhhhhghhhghhfghggg00...ghgg",
    "v..........................gfggfff0xhhhhhghhhghhgghhgff0",
    "............................iggfffgfhhhhfhhhhhhhgghh00f0",
    "..............................g00fgfhhh0fhhhhhhhggg00000",
    "...............................00000h000ghhhhhhhfff00000",
    "................................0000h000gfhhhhhggg00h000",
    "................................0000000f0fhhhgffg000h000",
    "..................................00000f000hhgggg00g00xg",
    "...................................00000000hgggggf0g0xx",
    "....................................f000000hgggggff00x",
    "....................................ff00000ggghhh00f0",
    ".....................................g00xx000ghh000fgg",
    "......................................0xx0000hhh0ggggg",
    "...................................0000000000hh0ggggggg",
    "...........................gggggg000000000000000000gggg",
    "......................iiiggfff00000xx00000000000000ggggg",
    ".....................vxifffffff00000000000000000000fffff",
    "......................xvhvff0000000000000xxx000000gfff"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    A: { pal: C.amber, glow: true },
    E: { pal: C.goldLight, glow: true },
    f: { m: "fur", step: 0 },
    g: { m: "fur", step: 1 },
    h: { m: "fur", step: 2 },
    i: { m: "fur", step: 3 },
    j: { m: "fur", step: 4 },
    v: { m: "tooth", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // Fast, shallow breaths, twice a beat: a hunted thing about to bolt.
    waist: 52,
    breath: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    // Once in a cycle, the torn ear flicks.
    twitch: {
      frames: [5],
      patches: [
        { x: 22, y: 0, rows: [".......i.._", "......i.g._", ".....i.g..h_", ".....ig..fh_", "...ig..fgf_", "..i.g.fgf_", "..i.gfgf._", ".i.gfg.0_........i._", "i.gfg.._......i.h.f_"] }
      ]
    }
  }
};
