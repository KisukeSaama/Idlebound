/**
 * The marks the deeper Ages leave on a place (BIBLE 18.6), drawn like the rest of the scene:
 * flat shapes in solid pixels, a lit rim on what faces the light, and regular dithering
 * only where one tone gives way to another (a shaft of light thinning out, mist, the blurred
 * edge of what is too near to see). Every mark keeps off the guardian's ground: what stands
 * tall stands at the sides, and the middle of the view stays calm.
 *
 * - II, the Elder World: a giant's skull and a ribcage on the horizon, a frozen sea at their feet.
 * - III, the Hallowed: roofless temples facing the sky, shafts of light falling on them.
 * - IV, the Making of the Stars: the sky still being poured, glass running down from the top.
 * - V, the Loom: warp threads from the ground to the sky, humming, a few hanging loose.
 * - VI, the Draft: line art on warm paper (scene.ts).
 * - VII, the Words: walls of runes along the horizon.
 * - VIII, the Edge of Sleep: the moon low and large, mist lying on the ground.
 * - IX, the Dreamer's Room: a lamp, a hearth, a window with its pale rectangle, huge and blurred.
 * - X, the Unmaking: grey, from the horizon inward (scene.ts).
 * - XI, the Blank: the world in outline on an off-white lilac (scene.ts).
 * - XII, the First Mark: a single point of light, then a line.
 */
import { C, SCENE_HEIGHT, SCENE_WIDTH, type Pal, type SceneRecipe } from "@idlebound/game/art";
import { dottedCircle, sine, towardMoon } from "./draw";
import { RUNES } from "./eras";
import { bayer, createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";

const H = SCENE_HEIGHT;
const W = SCENE_WIDTH;

/** Where a mark goes: just over the sky, among the far planes, lying on the ground, or in front of all but the frame. */
export type MarkPlane = "sky" | "far" | "ground" | "front";

export interface Mark {
  plane: MarkPlane;
  frames: Pixels[];
  period?: number;
  drift?: number;
  /** How much the camera's sway moves it, when not its plane's own. */
  depth?: number;
}

const wrap = (x: number) => ((x % W) + W) % W;

function put(out: Pixels, x: number, y: number, pal: Pal, emit = 0) {
  setPixel(out, wrap(Math.round(x)), Math.round(y), pal, 255, emit);
}

/** A polygon filled flat. */
function fillPoly(out: Pixels, points: readonly number[], pal: Pal) {
  let top = Infinity;
  let bottom = -Infinity;
  for (let i = 1; i < points.length; i += 2) {
    top = Math.min(top, points[i]);
    bottom = Math.max(bottom, points[i]);
  }
  for (let y = Math.floor(top); y <= Math.ceil(bottom); y += 1) {
    const cy = y + 0.5;
    const cuts: number[] = [];
    for (let i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
      const [xi, yi, xj, yj] = [points[i], points[i + 1], points[j], points[j + 1]];
      if (yi > cy !== yj > cy) cuts.push(((xj - xi) * (cy - yi)) / (yj - yi) + xi);
    }
    cuts.sort((a, b) => a - b);
    for (let k = 0; k + 1 < cuts.length; k += 2) for (let x = Math.round(cuts[k]); x < Math.round(cuts[k + 1]); x += 1) put(out, x, y, pal);
  }
}

function fillEllipse(out: Pixels, cx: number, cy: number, rx: number, ry: number, pal: Pal, keep: (x: number, y: number) => boolean = () => true) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1 && keep(x, y)) put(out, x, y, pal);
    }
  }
}

const drawn = (out: Pixels, x: number, y: number) => y >= 0 && y < out.h && out.idx[y * out.w + wrap(x)] !== EMPTY;

/** The top edge of a mark and its side toward the light, in `rim`. */
function rim(out: Pixels, pal: Pal, side: number, only?: Pal) {
  const marks: [number, number][] = [];
  for (let y = 0; y < out.h; y += 1) {
    for (let x = 0; x < out.w; x += 1) {
      if (!drawn(out, x, y) || out.emit[y * out.w + x]) continue;
      if (only !== undefined && out.idx[y * out.w + x] !== only) continue;
      if (!drawn(out, x, y - 1) || (!drawn(out, x + side, y) && drawn(out, x - side, y))) marks.push([x, y]);
    }
  }
  for (const [x, y] of marks) out.idx[y * out.w + x] = pal;
}

/**
 * A soft edge: the ring of pixels around what is drawn, every other one in the edge's own
 * color, twice, farther and sparser (a checker, then a quarter). The shape reads as out of
 * focus without a single translucent pixel.
 */
function blur(out: Pixels, rings = 2) {
  for (let ring = 1; ring <= rings; ring += 1) {
    const add: [number, number, Pal][] = [];
    for (let y = 0; y < out.h; y += 1) {
      for (let x = 0; x < out.w; x += 1) {
        if (drawn(out, x, y)) continue;
        let near: Pal | null = null;
        for (const [dx, dy] of [[0, -ring], [-ring, 0], [ring, 0], [0, ring]] as const) {
          if (drawn(out, x + dx, y + dy) && !out.emit[(y + dy) * out.w + wrap(x + dx)]) near = out.idx[(y + dy) * out.w + wrap(x + dx)];
        }
        if (near === null) continue;
        const keep = ring === 1 ? (x + y) % 2 === 0 : x % 2 === 0 && y % 2 === 0;
        if (keep) add.push([x, y, near]);
      }
    }
    for (const [x, y, pal] of add) if (!drawn(out, x, y)) put(out, x, y, pal);
  }
}

// ------------------------------------------------------------------ II: the Elder World

/**
 * The skull of something that lived before there was a here, lying on its jaw, drawn by
 * hand: `a` bone in the moonlight, `b` bone, `c` bone in shade, `d` its hollows.
 */
const SKULL: readonly string[] = [
  "aa",
  ".ab",
  ".abb",
  "..abb",
  "...abb",
  "...abbb.......aaaaaaa",
  "....abbb...aaabbbbbbbaa",
  "....cbbbbaabbbbbbbbbbbbaa",
  ".....cbbbbbbbbbbbbbbbbbbbaaa",
  "......cbbbbbbbbbbbbbbbddddbbaaaaa",
  ".......bbbbbbbbbbbbbbddddddbbbbbbaaaaaaa",
  ".......bbbbbbbbbbbbbbddddddbbbbbbbbbbbbbaaaaaaa",
  "......bbbbbbbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbaaaa",
  "......bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbaa",
  "......cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba",
  "......cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "......ccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccc",
  ".......ccbbbbbbbbbbbbbbbbbbbca..a..a..a..a..a..a..a.a",
  ".......cccbbbbbbbbbbbbbbbbbb..a..a..a..a..a..a..a",
  "........cccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  ".........ccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc",
  "..........cccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbcccc",
  "...........ccccccccccccccccccccccccccccccccccc"
];

/**
 * A giant's skull half sunk in the frozen sea on one side, a ribcage arching out of it on
 * the other: bone lit on its top and its side toward the moon, its hollows dark.
 */
function elderBones(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const [shade, body, lit] = [C.dusk, C.haze, C.lilac];
  const side = towardMoon(recipe, W / 2);
  const sea = hz - 3;
  // The ribcage: a spine arching over, its vertebrae pointing up, ribs curving down into the ice.
  const x0 = 214;
  const x1 = 318;
  const tall = Math.min(40, hz - 18);
  const spine = (x: number) => sea - Math.round(tall * (0.45 + 0.55 * sine(((x - x0) / (x1 - x0)) * 0.5)));
  for (let rib = 0; rib < 12; rib += 1) {
    const xs = x0 + 4 + rib * 8;
    const ys = spine(xs) + 3;
    // Some ribs broke long ago and end in the air.
    const broken = hash2(rib, 1, recipe.seed + 71) < 0.3 ? 0.55 + hash2(rib, 2, recipe.seed) * 0.3 : 1;
    const bow = 7 + (rib % 3) * 2;
    for (let t = 0; t <= broken; t += 1 / Math.max(1, sea - ys) / 1.5) {
      const x = xs - 5 * t + bow * sine(t / 2) * 0.8;
      const y = ys + (sea - ys) * t;
      put(out, x, y, side < 0 ? lit : body);
      put(out, x + 1, y, side < 0 ? body : lit);
      put(out, x + 2, y, shade);
    }
  }
  for (let x = x0; x <= x1; x += 1) {
    const y = spine(x);
    for (let dy = 0; dy < 4; dy += 1) put(out, x, y + dy, dy === 0 ? lit : dy === 3 ? shade : body);
    if ((x - x0) % 8 === 3) fillPoly(out, [x - 2, y + 1, x + 2, y + 1, x + side, y - 5], body);
  }
  // The skull, drawn by hand, its jaw in the ice.
  const top = sea - SKULL.length + 3;
  SKULL.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const key = row[x];
      if (key === ".") continue;
      put(out, 18 + x, top + y, key === "a" ? lit : key === "b" ? body : key === "c" ? shade : C.night2);
    }
  });
  rim(out, lit, side, body);
  return out;
}

/**
 * The frozen sea at the foot of the bones, all along the horizon: a band of ice lit along
 * its far edge, cracked in a regular pattern, floes pushed up into ridges here and there.
 */
function frozenSea(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const sea = hz - 4;
  for (let x = 0; x < W; x += 1) {
    for (let y = sea; y < hz; y += 1) {
      const crack = (x + (y - sea) * 3) % 11 === 0 && hash2(Math.floor(x / 11), 0, recipe.seed + 72) < 0.6;
      put(out, x, y, y === sea ? C.lilac : crack ? C.dusk : C.haze);
    }
    // Pressure ridges: floes pushed up, lit on the face toward the moon.
    if (hash2(x, 3, recipe.seed + 74) < 0.05) {
      const tall = 2 + Math.floor(hash2(x, 4, recipe.seed) * 4);
      fillPoly(out, [x - tall, sea + 1, x + tall, sea + 1, x, sea - tall], C.haze);
      for (let dy = 0; dy <= tall; dy += 1) put(out, x - (towardMoon(recipe, x) < 0 ? dy : -dy) / 2, sea - tall + dy, C.lilac);
    }
  }
  return out;
}

// ------------------------------------------------------------------ III: the Hallowed

/**
 * Temples to a god with no name, facing the sky: a roofless colonnade on one side, a round
 * temple under its dome on the other, each on its steps, lit gold from above by a shaft of
 * light falling slantwise out of the sky in regular dithering.
 */
function hallowedTemples(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const tall = Math.min(30, hz - 30);
  const [shade, body, lit, gold] = [C.night4, C.dusk, C.haze, C.goldDark];
  const steps = (left: number, right: number) => {
    for (let step = 0; step < 3; step += 1) for (let x = left + step * 2; x <= right - step * 2; x += 1) put(out, x, hz - step, step === 2 ? lit : body);
  };
  const column = (x: number, top: number, bottom: number) => {
    for (let y = top; y <= bottom; y += 1) {
      put(out, x, y, lit);
      put(out, x + 1, y, (y & 3) === 0 ? lit : body);
      put(out, x + 2, y, body);
      put(out, x + 3, y, shade);
    }
    // The capital and the base, wider than the shaft.
    for (let dx = -1; dx <= 4; dx += 1) {
      put(out, x + dx, top, lit);
      put(out, x + dx, top + 1, body);
      put(out, x + dx, bottom, body);
    }
  };
  // The colonnade: six columns under a broken architrave, open to the sky.
  const colonnade = [14, 96];
  steps(colonnade[0], colonnade[1]);
  for (let index = 0; index < 6; index += 1) {
    const x = colonnade[0] + 5 + index * 14;
    const broken = index === 4 ? Math.round(tall * 0.4) : 0;
    column(x, hz - 3 - tall + broken, hz - 3);
  }
  for (let x = colonnade[0] + 2; x <= colonnade[1] - 2; x += 1) {
    if (x > colonnade[0] + 58 && x < colonnade[0] + 76) continue;
    for (let dy = 0; dy < 4; dy += 1) put(out, x, hz - 4 - tall - dy, dy === 3 ? gold : dy === 0 ? shade : body);
  }
  // The round temple: columns closer toward its edges, a dome, a gold point on top.
  const cx = 262;
  const half = 30;
  steps(cx - half - 6, cx + half + 6);
  const ring = Math.round(tall * 0.8);
  for (const k of [-0.95, -0.65, -0.25, 0.25, 0.65, 0.95]) column(Math.round(cx + k * half) - 1, hz - 3 - ring, hz - 3);
  for (let x = cx - half - 3; x <= cx + half + 3; x += 1) for (let dy = 0; dy < 3; dy += 1) put(out, x, hz - 4 - ring - dy, dy === 2 ? lit : body);
  fillEllipse(out, cx, hz - 6 - ring, half + 1, Math.round(tall * 0.5), body, (_x, y) => y < hz - 6 - ring);
  for (let y = 0; y < out.h; y += 1) for (let x = cx - half - 2; x <= cx + half + 2; x += 1) if (drawn(out, x, y) && !drawn(out, x, y - 1) && y < hz - 6 - ring) put(out, x, y, gold);
  const domeTop = hz - 6 - ring - Math.round(tall * 0.5);
  for (let dy = 1; dy <= 3; dy += 1) put(out, cx, domeTop - dy, gold);
  // The shafts of light: falling from the top, thinning to nothing on the temples.
  for (const [target, wide] of [[55, 22], [262, 18]] as const) {
    const bottom = hz - 6;
    for (let y = 0; y < bottom; y += 1) {
      const k = y / bottom;
      const cover = Math.floor((0.36 - k * 0.3) * 8) / 8;
      const center = target + Math.round((bottom - y) * 0.28);
      for (let x = center - (wide >> 1); x <= center + (wide >> 1); x += 1) {
        const edge = Math.abs(x - center) > (wide >> 1) - 3 ? 0.5 : 1;
        if (!drawn(out, x, y) && bayer(x, y) < cover * edge) put(out, x, y, C.goldLight);
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------ IV: the Making of the Stars

/**
 * The sky is not glass yet: along its top a band of it is still molten, its lower lip
 * sagging into beads, and in a few places it pours: thick streams that narrow as they fall,
 * lit down one side, swelling into a drop at the end, the longest reaching the land at the
 * sides and spreading there into a pool. The middle only drips.
 */
function pouringSky(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const [deep, body, lit, glint] = [C.vault2, C.vault3, C.shard, C.shardLight];
  const lip = (x: number) => 8 + Math.round(5 * valueNoise(x, 0, 24, recipe.seed + 81, W / 24) + 2 * sine(x / 13));
  for (let x = 0; x < W; x += 1) {
    const edge = lip(x);
    for (let y = 0; y <= edge; y += 1) put(out, x, y, y >= edge - 1 ? deep : body);
    // The molten band's surface: long lit crests, glints where they catch the light.
    for (let y = 2; y < edge - 2; y += 3) if (sine((x + y * 7) / 34) > 0.6) put(out, x, y, sine((x + y * 7) / 34) > 0.93 ? glint : lit);
  }
  // Beads sagging from the lip all along it.
  for (let x = 4; x < W; x += 9 + Math.floor(hash2(x, 0, recipe.seed + 83) * 7)) {
    const edge = lip(x);
    fillEllipse(out, x + 0.5, edge + 1.5, 1.6, 1.8 + hash2(x, 1, recipe.seed) * 1.5, deep);
    put(out, x, edge + 1, lit);
  }
  // The streams: at the sides, pouring down to the land; where the guardian stands, never.
  const streams: readonly (readonly [number, number])[] = [[14, 1], [38, 0.55], [66, 0.9], [92, 0.35], [234, 0.4], [258, 1], [286, 0.7], [306, 0.95]];
  for (const [sx, reach] of streams) {
    const top = lip(sx);
    const end = Math.round(top + (hz - 2 - top) * reach);
    for (let y = top; y <= end; y += 1) {
      const k = (y - top) / Math.max(1, end - top);
      // Thick where it leaves the band, a neck, then swelling again toward the drop.
      const half = Math.max(1, Math.round(2.6 - 1.8 * sine(k / 2) + (k > 0.85 ? 1 : 0)));
      const wobble = Math.round(sine(y / 70 + sx / 50) * 1.4);
      for (let dx = -half; dx <= half; dx += 1) {
        const x = sx + wobble + dx;
        put(out, x, y, dx === -half ? lit : dx === half ? deep : body);
      }
      if (y % 9 === (sx % 9) && half > 1) put(out, sx + wobble - half + 1, y, glint);
    }
    if (reach >= 0.9) {
      // A pool of glass on the land, lit along its far edge.
      for (let dx = -8; dx <= 8; dx += 1) {
        const x = sx + dx;
        put(out, x, hz - 1, Math.abs(dx) < 6 ? lit : body);
        if (Math.abs(dx) < 7) put(out, x, hz, Math.abs(dx) < 2 ? glint : body);
      }
    } else {
      fillEllipse(out, sx + 0.5, end + 2, 2.2, 2.6, body);
      put(out, sx - 1, end + 1, glint);
    }
  }
  return out;
}

// ------------------------------------------------------------------ V: the Loom

/**
 * Warp threads from the ground to the sky, taut and evenly spaced, a bead of light running
 * up each one (the hum); across the top, the cloth they are woven into; over the guardian's
 * ground, only a few threads, hanging loose and ending in the air.
 */
function warpThreads(recipe: SceneRecipe, frame: number): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const cloth = 6;
  for (let y = 0; y < cloth; y += 1) {
    for (let x = 0; x < W; x += 1) put(out, x, y, y === cloth - 1 ? C.haze : (((x >> 1) + (y >> 1)) & 1) === 0 ? C.dusk : C.night4);
  }
  // Threads in pairs, as they go through the reed of a loom.
  for (let x = 3; x < W; x += (x % 10 === 3 ? 2 : 8)) {
    const middle = Math.abs(x - W / 2) < 50;
    const loose = middle || hash2(x, 1, recipe.seed + 91) < 0.12;
    const end = loose ? cloth + 8 + Math.floor(hash2(x, 2, recipe.seed + 91) * (middle ? 30 : hz - 30)) : hz;
    if (middle && hash2(x, 3, recipe.seed + 91) < 0.4) continue;
    for (let y = cloth; y <= end; y += 1) {
      const hum = (y + frame * 2 + (x >> 1)) % 12 < 1;
      put(out, x, y, hum && !loose ? C.pale : C.lilac);
    }
    // A loose thread curls where it ends.
    if (loose) {
      put(out, x + 1, end + 1, C.lilac);
      put(out, x + 2, end, C.lilac);
    }
  }
  return out;
}

// ------------------------------------------------------------------ VII: the Words

/**
 * Walls of runes along the horizon: one long wall of great courses of stone, broken along
 * its top, highest at the sides, its whole face written in lines of letters of no known
 * alphabet, cut into the stone; here and there a word still glows.
 */
function runeWalls(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const side = towardMoon(recipe, W / 2);
  const tallest = Math.min(44, hz - 16);
  const top = (x: number) => {
    const block = Math.floor(x / 6);
    const middle = Math.abs(x - W / 2) / (W / 2);
    const broken = valueNoise(block, 0, 3, recipe.seed + 101) * 0.5 + hash2(block, 1, recipe.seed + 101) * 0.15;
    return hz - Math.round(tallest * (0.22 + 0.78 * middle ** 1.3) * (0.55 + broken));
  };
  for (let x = 0; x < W; x += 1) {
    const y0 = top(x);
    for (let y = y0; y <= hz; y += 1) {
      // A step in the broken top is lit on its face toward the moon.
      const stepLit = y < y0 + 3 && top(x + side) > y;
      put(out, x, y, y === y0 || stepLit ? C.haze : C.dusk);
    }
  }
  // The writing: lines of 3 x 5 letters from edge to edge, words apart, cut dark; a few words lit.
  for (let line = 0; line < 7; line += 1) {
    const row = hz - 7 - line * 7;
    for (let cell = 1; cell < W - 3; cell += 4) {
      const word = Math.floor(cell / 22) + line * 31;
      if ((cell % 22) < 2) continue;
      const glowing = hash2(word, 2, recipe.seed + 102) < 0.14 && Math.abs(cell - W / 2) > 56;
      const rune = RUNES[Math.floor(hash2(cell, line, recipe.seed + 103) * RUNES.length) % RUNES.length];
      for (let gy = 0; gy < 5; gy += 1) {
        for (let gx = 0; gx < 3; gx += 1) {
          const x = cell + gx;
          const y = row + gy;
          if (!((rune[gy] >> (2 - gx)) & 1) || y <= top(x) + 1) continue;
          put(out, x, y, glowing ? C.goldDark : C.night3, glowing ? 1 : 0);
        }
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------ VIII: the Edge of Sleep

/** Mist lying on the ground, in regular dithering, thinner over the guardian's ground; it drifts. */
function sleepMist(recipe: SceneRecipe): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  for (let y = hz - 4; y < Math.min(H - 20, hz + 48); y += 1) {
    const k = y < hz ? 1 - (hz - y) / 5 : 1 - (y - hz) / 48;
    for (let x = 0; x < W; x += 1) {
      const bank = valueNoise(x, y * 4, 36, recipe.seed + 111, W / 36);
      const cover = Math.floor(Math.max(0, k * (bank - 0.2) * 0.9) * 8) / 8;
      if (bayer(x, y) < cover) put(out, x, y, (y - hz) % 7 === 0 ? C.lilac : C.haze);
    }
  }
  return out;
}

// ------------------------------------------------------------------ IX: the Dreamer's Room

/**
 * Enormous, blurred, familiar shapes behind the sky: a window high on one side, its pale
 * rectangle; a lamp on the other, its shade glowing, a ring of light under it; a hearth low
 * on the horizon, its fire warm. Too near to be in focus: their edges dither away.
 */
function dreamerRoom(recipe: SceneRecipe, frame: number): Pixels {
  const out = createPixels(W, H);
  const hz = recipe.horizon;
  const frameColor = C.flesh0;
  // The window: a heavy frame, a cross of mullions, the pale rectangle of the glass.
  const wx = 222;
  const wy = 4;
  const ww = 78;
  const wh = Math.min(62, hz - 14);
  for (let y = wy; y < wy + wh; y += 1) {
    for (let x = wx; x < wx + ww; x += 1) {
      const onFrame = x - wx < 4 || wx + ww - x <= 4 || y - wy < 4 || wy + wh - y <= 4 || Math.abs(x - wx - ww / 2) < 2 || Math.abs(y - wy - wh * 0.45) < 2;
      put(out, x, y, onFrame ? frameColor : C.pale);
    }
  }
  // The lamp: a shade, a stand going down behind the land.
  const lx = 44;
  const top = 6;
  const shadeH = Math.min(22, Math.round(hz * 0.3));
  fillPoly(out, [lx - 12, top, lx + 12, top, lx + 22, top + shadeH, lx - 22, top + shadeH], C.amber);
  for (let x = lx - 22; x <= lx + 22; x += 1) put(out, x, top + shadeH, C.ember);
  for (let y = top + shadeH + 1; y < hz; y += 1) for (let dx = -2; dx <= 2; dx += 1) put(out, lx + dx, y, frameColor);
  // The hearth: a mantel and an arch, the fire deep inside it.
  const hx = 84;
  const hw = 58;
  const hh = Math.min(30, hz - 20);
  for (let y = hz - hh; y <= hz; y += 1) for (let x = hx - hw / 2; x <= hx + hw / 2; x += 1) put(out, x, y, frameColor);
  for (let x = hx - hw / 2 - 5; x <= hx + hw / 2 + 5; x += 1) for (let dy = 0; dy < 4; dy += 1) put(out, x, hz - hh - dy, frameColor);
  fillEllipse(out, hx, hz - hh * 0.35, hw * 0.3, hh * 0.55, C.ink, (_x, y) => y <= hz);
  blur(out);
  // Light over the blurred shapes: the lamp's glow under the shade, the fire, both breathing.
  for (let y = top + shadeH + 1; y < top + shadeH + 7; y += 1) {
    for (let x = lx - 20; x <= lx + 20; x += 1) if (!drawn(out, x, y) && (x + y) % 2 === 0 && Math.abs(x - lx) < 20 - (y - top - shadeH) * 2) put(out, x, y, C.amber);
  }
  for (const [x, y] of dottedCircle(28 + (frame % 2))) if (y > 0 && !drawn(out, lx + x, top + shadeH + y)) put(out, lx + x, top + shadeH + y, C.amber);
  const fire = hz - 2;
  for (let dx = -8; dx <= 8; dx += 1) {
    const flame = 3 + Math.round(3 * sine((dx + frame * 3) / 9)) - Math.abs(dx) / 3;
    for (let dy = 0; dy < flame; dy += 1) put(out, hx + dx, fire - dy, dy < flame / 2 ? C.ember : C.amber, 1);
  }
  return out;
}

// ------------------------------------------------------------------ XII: the First Mark

/**
 * The first light: a single point on the horizon (55), warm (56), breathing a halo of
 * dotted rings (57), then a line (58) that widens (59), light rows of regular dithering
 * above and below it.
 */
function firstLight(era: number, horizon: number, frame: number): Pixels {
  const out = createPixels(W, H);
  const step = Math.max(0, Math.min(4, era - 55));
  const cx = W / 2;
  const half = step < 3 ? 0 : step === 3 ? 6 : 48;
  const heart = step === 0 ? C.moon : C.goldLight;
  for (let x = cx - half; x <= cx + half; x += 1) put(out, x, horizon, heart, 1);
  if (half > 0) {
    for (let x = cx - half - 12; x <= cx + half + 12; x += 1) {
      const off = Math.max(0, Math.abs(x - cx) - half);
      if (off === 0 || (off < 12 && x % 2 === 0)) {
        put(out, x, horizon - 1, off === 0 ? C.moon : heart, 1);
        put(out, x, horizon + 1, off === 0 ? C.moon : heart, 1);
      }
      if (off < 6 && (x + horizon) % 2 === 0) {
        put(out, x, horizon - 2, C.moon, 1);
        put(out, x, horizon + 2, C.moon, 1);
      }
    }
  } else {
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) put(out, cx + dx, horizon + dy, step === 0 ? C.pale : C.gold, 1);
  }
  // Rings of light around the point, breathing from frame to frame; the line has none.
  const rings = half > 0 ? 0 : step + 1;
  for (let ring = 1; ring <= rings; ring += 1) {
    const r = 3 + ring * 3 + ((frame >> 1) % 2);
    for (const [x, y] of dottedCircle(r)) if (!drawn(out, cx + x, horizon + y)) put(out, cx + x, horizon + y, C.moon);
  }
  return out;
}

/** The marks of an Age on a scene, and the plane each stands in. */
export function ageMarks(age: number, era: number, recipe: SceneRecipe): Mark[] {
  switch (age) {
    case 1:
      return [
        { plane: "far", frames: [frozenSea(recipe)] },
        { plane: "far", frames: [elderBones(recipe)] }
      ];
    case 2:
      return [{ plane: "far", frames: [hallowedTemples(recipe)] }];
    case 3:
      return [{ plane: "far", frames: [pouringSky(recipe)] }];
    case 4:
      return [{ plane: "far", frames: [0, 1, 2, 3, 4, 5].map((frame) => warpThreads(recipe, frame)), period: 0.18 }];
    case 6:
      return [{ plane: "far", frames: [runeWalls(recipe)] }];
    case 7:
      return [{ plane: "ground", frames: [sleepMist(recipe)], drift: 2 }];
    case 8:
      return [{ plane: "far", frames: [0, 1, 2, 3].map((frame) => dreamerRoom(recipe, frame)), period: 0.5 }];
    case 11:
      return [{ plane: "sky", frames: [0, 1, 2, 3].map((frame) => firstLight(era, recipe.horizon, frame)), period: 0.6 }];
    default:
      return [];
  }
}
