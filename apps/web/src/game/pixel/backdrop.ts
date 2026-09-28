/**
 * The back of a scene (BIBLE 18.7): the sky in dithered bands with its moon, halo and
 * stars, the clouds, the far ranges each darker and duller with distance, and the landmark
 * where the road leads.
 */
import { SCENE_HEIGHT, SCENE_WIDTH, type LandmarkKind, type Pal, type SceneRange, type SceneRecipe, type Shape } from "@idlebound/game/art";
import { dottedCircle, fillShapes, moonlit, towardMoon } from "./draw";
import { bayer, createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";

const H = SCENE_HEIGHT;
const WIDE = SCENE_WIDTH * 2;
/** The moon's halo: the checker's reach beyond the disc, then the gap between its dotted circles. */
const HALO_INNER = 3;
const HALO_STEP = 2;

// ------------------------------------------------------------------ sky

export function paintSky(recipe: SceneRecipe, width: number, full: boolean): { pixels: Pixels; twinkles: { x: number; y: number }[] } {
  const out = createPixels(width, H);
  const horizon = recipe.horizon;
  const bands = recipe.sky.length;
  // Solid bands, and between two of them four regular rows of ordered dithering.
  const band = (y: number) => Math.min(bands - 1, Math.floor((y / horizon) * bands));
  for (let y = 0; y < H; y += 1) {
    const here = band(y);
    const next = Math.min(bands - 1, here + 1);
    const edge = Math.floor(((here + 1) * horizon) / bands);
    const toEdge = edge - y;
    for (let x = 0; x < width; x += 1) {
      const blend = here < bands - 1 && toEdge <= 4 ? (5 - toEdge) / 5 : 0;
      setPixel(out, x, y, blend > 0 && bayer(x, y) < blend ? recipe.sky[next] : recipe.sky[here]);
    }
  }
  if (recipe.ceiling !== undefined) {
    // Rock overhead: a flat ceiling with a slow, smooth underside.
    for (let x = 0; x < width; x += 1) {
      const depth = 20 + Math.round(valueNoise(x, 0, 40, recipe.seed, width / 40) * 18);
      for (let y = 0; y < depth; y += 1) setPixel(out, x, y, recipe.ceiling);
    }
  }
  // The moon's halo, where the sky turns one band lighter: a dense checker hugging the
  // disc, then dotted circles traced pixel by pixel (every other pixel of a true pixel
  // circle), so its outer edge is a perfect circle with no straight run or corner.
  const rings = recipe.moon?.halo ?? 0;
  const reach = recipe.moon ? recipe.moon.r + HALO_INNER + rings * HALO_STEP : 0;
  if (recipe.moon && rings > 0) {
    const { x: mx, y: my, r } = recipe.moon;
    // One step lighter than the lightest band of its row (the rows where two bands are
    // dithered together count as the lighter one), so every dot shows on its whole round.
    const lighten = (x: number, y: number) => {
      if (y < 0 || y >= horizon) return;
      const lit = band(Math.min(horizon - 1, y + 4)) + 1;
      if (lit < bands) setPixel(out, ((x % width) + width) % width, y, recipe.sky[lit]);
    };
    const inner = (r + HALO_INNER) ** 2;
    for (let y = my - r - HALO_INNER; y <= my + r + HALO_INNER; y += 1) {
      for (let x = mx - r - HALO_INNER; x <= mx + r + HALO_INNER; x += 1) {
        const d = (x - mx) ** 2 + (y - my) ** 2;
        if (d > r * r && d <= inner && (x + y) % 2 === 0) lighten(x, y);
      }
    }
    for (let ring = 1; ring <= rings; ring += 1) for (const [x, y] of dottedCircle(r + HALO_INNER + ring * HALO_STEP)) lighten(mx + x, my + y);
  }
  const twinkles: { x: number; y: number }[] = [];
  for (let star = 0; star < recipe.stars; star += 1) {
    const x = Math.floor(hash2(star, 1, recipe.seed) * width);
    const y = 4 + Math.floor(hash2(star, 2, recipe.seed) * (horizon * 0.62));
    if (recipe.moon && Math.abs(x - recipe.moon.x) < Math.max(recipe.moon.r + 6, reach + 2) && Math.abs(y - recipe.moon.y) < Math.max(recipe.moon.r + 6, reach + 2)) continue;
    setPixel(out, x, y, recipe.starColor);
    // A few bigger stars: a small cross.
    if (hash2(star, 3, recipe.seed) > 0.88) {
      setPixel(out, x - 1, y, recipe.starColor);
      setPixel(out, x + 1, y, recipe.starColor);
      setPixel(out, x, y - 1, recipe.starColor);
      setPixel(out, x, y + 1, recipe.starColor);
    } else if (hash2(star, 4, recipe.seed) > 0.6) {
      twinkles.push({ x, y });
    }
  }
  if (recipe.moon) {
    const { x: mx, y: my, r, color, shade } = recipe.moon;
    const crescent = recipe.moon.crescent && !full;
    for (let y = -r; y <= r; y += 1) {
      for (let x = -r; x <= r; x += 1) {
        if (x * x + y * y > r * r) continue;
        // A crescent: the shadow of a second disc, offset to the right, hides most of the moon.
        if (crescent && (x - r * 0.55) ** 2 + (y + r * 0.2) ** 2 <= r * r * 0.9) continue;
        // Two flat craters and a shaded rim on the lower right: a moon, not a coin.
        const crater = (x + 3) ** 2 + (y + 2) ** 2 <= 4 || (x - 2) ** 2 + (y - 4) ** 2 <= 2;
        const rim = (x - 1) * (x - 1) + (y - 1) * (y - 1) > (r - 1.5) * (r - 1.5) && x + y > 0;
        setPixel(out, mx + x, my + y, crater || rim ? shade : color, 255, 1);
      }
    }
  }
  return { pixels: out, twinkles };
}

/**
 * Clouds in two tones: an irregular outline of rounded puffs of different sizes over a
 * flat underside, the body in one color, the edges turned toward the moon (its top, its
 * lit side) in a lighter one.
 */
export function paintClouds(recipe: SceneRecipe): Pixels | null {
  const clouds = recipe.clouds;
  if (!clouds) return null;
  const out = createPixels(WIDE, H);
  const seed = recipe.seed;
  for (let cloud = 0; cloud < clouds.count; cloud += 1) {
    const cx = Math.floor(((cloud + 0.3 + hash2(cloud, 0, seed) * 0.4) / clouds.count) * WIDE);
    const floor = clouds.top + 6 + Math.floor(hash2(cloud, 1, seed) * (clouds.bottom - clouds.top - 6));
    const long = 30 + Math.floor(hash2(cloud, 2, seed) * 34);
    const puffs = 4 + Math.floor(hash2(cloud, 3, seed) * 3);
    for (let puff = 0; puff < puffs; puff += 1) {
      const k = (puff + 0.5) / puffs;
      // Taller in the middle, each puff its own size.
      const r = 2 + (1 - Math.abs(k - 0.5) * 1.6) * 4 + hash2(cloud, puff + 10, seed) * 2.5;
      const px = cx + Math.round((k - 0.5) * long + (hash2(cloud, puff + 20, seed) - 0.5) * 4);
      const py = floor - Math.round(r * 0.4);
      for (let y = Math.floor(py - r); y <= floor; y += 1) {
        for (let x = Math.floor(px - r); x <= Math.ceil(px + r); x += 1) {
          // Puffs a little wider than tall.
          if ((x - px) ** 2 + ((y - py) / 0.7) ** 2 <= r * r) setPixel(out, ((x % WIDE) + WIDE) % WIDE, y, clouds.color);
        }
      }
    }
    // The flat underside, from the first puff to the last.
    for (let x = cx - Math.round(long / 2); x <= cx + Math.round(long / 2); x += 1) setPixel(out, ((x % WIDE) + WIDE) % WIDE, floor, clouds.color);
  }
  moonlit(out, clouds.lit, recipe.source.x < SCENE_WIDTH / 2 ? -1 : 1);
  return out;
}

// ------------------------------------------------------------------ ranges

/** A range: one smooth silhouette, one flat color. */
export function paintRange(recipe: SceneRecipe, range: SceneRange, index: number): Pixels {
  const width = SCENE_WIDTH;
  const out = createPixels(width, H);
  const { kind, color, base, height } = range;
  const seed = recipe.seed + 10 + index * 7;
  const column = (x: number, top: number) => {
    for (let y = Math.max(0, top); y < H; y += 1) setPixel(out, ((x % width) + width) % width, y, color);
  };
  if (kind === "mountains") {
    for (let x = 0; x < width; x += 1) {
      const ridge = valueNoise(x, 0, 64, seed, width / 64) * 0.7 + valueNoise(x, 1, 24, seed + 1, width / 24) * 0.3;
      column(x, Math.round(base - ridge * height));
    }
  } else if (kind === "hills") {
    for (let x = 0; x < width; x += 1) column(x, Math.round(base - valueNoise(x, 0, 80, seed, width / 80) * height));
  } else if (kind === "treeline") {
    // A line of trees, none like its neighbor: pointed firs, round crowns on short trunks,
    // tall narrow poplars and low bushes, at uneven spacing and heights.
    for (let x = 0; x < width; x += 1) column(x, base - 1);
    const plant = (x: number, y: number) => setPixel(out, ((x % width) + width) % width, y, color);
    for (let x = 0, tree = 0; x < width; tree += 1) {
      const pick = hash2(tree, 3, seed);
      const tall = Math.max(2, Math.round(height * (0.35 + 0.65 * hash2(tree, 1, seed))));
      if (pick < 0.4) {
        // A fir: a steep triangle.
        const half = Math.max(1, Math.round(tall * 0.35));
        for (let y = 0; y < tall; y += 1) {
          const spread = Math.round(((y + 1) / tall) * half);
          for (let dx = -spread; dx <= spread; dx += 1) plant(x + dx, base - tall + y);
        }
      } else if (pick < 0.7) {
        // A round crown on a short trunk.
        const r = Math.max(2, tall * 0.42);
        const cy = base - tall + r;
        for (let y = Math.floor(cy - r); y < base; y += 1) {
          for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx += 1) {
            if (dx * dx + (y - cy) ** 2 <= r * r || (Math.abs(dx) < 1 && y > cy)) plant(x + dx, y);
          }
        }
      } else if (pick < 0.85) {
        // A poplar: tall and narrow.
        const rx = Math.max(1, tall * 0.18);
        const ry = tall / 2;
        for (let y = base - tall; y < base; y += 1) {
          for (let dx = -Math.ceil(rx); dx <= Math.ceil(rx); dx += 1) if ((dx / rx) ** 2 + ((y - (base - ry)) / ry) ** 2 <= 1) plant(x + dx, y);
        }
      } else {
        // A low bush.
        const r = Math.max(1.5, tall * 0.3);
        for (let y = Math.floor(base - r); y < base; y += 1) for (let dx = -Math.ceil(r * 1.4); dx <= Math.ceil(r * 1.4); dx += 1) if ((dx / (r * 1.4)) ** 2 + ((y - base) / r) ** 2 <= 1) plant(x + dx, y);
      }
      x += 2 + Math.floor(hash2(tree, 2, seed) * 6);
    }
  } else if (kind === "reeds") {
    for (let x = 0; x < width; x += 1) column(x, base - 2);
    for (let x = 0; x < width; x += 3) {
      const tall = Math.round(height * (0.4 + 0.6 * hash2(x, 1, seed)));
      for (let y = 0; y < tall; y += 1) setPixel(out, x, base - 2 - y, color);
    }
  } else if (kind === "canopy") {
    // A roof of round crowns, overlapping, of every size: each lit on its moon side in a
    // crescent, so the far forest reads as a mass of trees and not a wall.
    for (let x = 0; x < width; x += 1) column(x, base - Math.round(height * 0.3));
    const side = towardMoon(recipe, SCENE_WIDTH / 2);
    const crowns: [number, number, number][] = [];
    for (let x = 0, crown = 0; x < width + 12; crown += 1) {
      const r = 4 + hash2(crown, 1, seed) * (height * 0.28);
      const top = base - Math.round(height * (0.45 + 0.55 * hash2(crown, 2, seed)));
      crowns.push([x, top + r, r]);
      x += Math.max(4, Math.round(r * (0.9 + hash2(crown, 3, seed) * 0.6)));
    }
    for (const [cx, cy, r] of crowns) {
      for (let y = Math.floor(cy - r); y < base; y += 1) {
        for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx += 1) {
          const dy = y + 0.5 - cy;
          const inCrown = dx * dx + dy * dy <= r * r;
          if (!inCrown && !(y > cy && Math.abs(dx) < r * 0.8)) continue;
          // Leaves lit on the side toward the moon and up: small clusters, never a band.
          const facing = inCrown && (dx * side - dy) / r > 0.45 && hash2((cx + dx) >> 1, y, seed + 5) < 0.3 && (dx + y) % 2 === 0;
          setPixel(out, (((cx + dx) % width) + width) % width, y, facing && range.lit !== undefined ? range.lit : color);
        }
      }
    }
  } else if (kind === "trunks") {
    // Trunks rising out of view, some straight, some leaning, a branch stub here and there;
    // their bark catches the moon on one edge.
    const side = towardMoon(recipe, SCENE_WIDTH / 2);
    for (let x = 0; x < width; x += 1) column(x, base - 2);
    for (let x = 4, trunk = 0; x < width; trunk += 1) {
      if (range.clearing !== undefined && Math.abs(x - SCENE_WIDTH / 2) < range.clearing) {
        x += 5;
        continue;
      }
      const thick = 3 + Math.floor(hash2(trunk, 1, seed) * (height * 0.12));
      const lean = (hash2(trunk, 2, seed) - 0.5) * 0.12;
      const flare = 2 + Math.floor(thick / 3);
      for (let y = 0; y < base; y += 1) {
        const k = (base - y) / base;
        const cx = x + Math.round(lean * (base - y));
        const half = thick / 2 + (base - y < 6 ? (flare * (6 - (base - y))) / 6 : 0);
        for (let dx = -Math.ceil(half); dx <= Math.ceil(half); dx += 1) {
          if (Math.abs(dx) > half) continue;
          const edge = dx * side >= Math.ceil(half) - 1;
          setPixel(out, (((cx + dx) % width) + width) % width, y, edge && range.lit !== undefined && k < 0.95 ? range.lit : color);
        }
        // A broken branch, pointing up and out.
        if (hash2(trunk, y >> 3, seed + 9) < 0.06 && y % 8 === 0 && y < base - 20) {
          const dir = hash2(trunk, y, seed) < 0.5 ? -1 : 1;
          for (let b = 1; b < 4 + thick; b += 1) setPixel(out, (((cx + dir * (Math.floor(half) + b)) % width) + width) % width, y - (b >> 1), color);
        }
      }
      x += thick + 6 + Math.floor(hash2(trunk, 3, seed) * 18);
    }
  } else if (kind === "boughs") {
    // Leaves hanging from above the view: masses of clumps along the top edge, deeper in
    // places, a few leaves on their rims catching the moon.
    for (let x = 0; x < width; x += 1) {
      const hang = Math.round(height * (0.25 + 0.75 * valueNoise(x, 0, 18, seed, width / 18) ** 1.6));
      for (let y = 0; y < hang; y += 1) setPixel(out, x, y, color);
    }
    for (let leaf = 0; leaf < width / 2; leaf += 1) {
      const x = Math.floor(hash2(leaf, 1, seed) * width);
      let bottom = 0;
      while (bottom < H && out.idx[bottom * width + x] !== EMPTY) bottom += 1;
      const cy = bottom + Math.floor(hash2(leaf, 2, seed) * 3) - 1;
      const lit = range.lit !== undefined && hash2(leaf, 3, seed) < 0.3;
      for (let y = -1; y <= 1; y += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          if ((dx / 2.4) ** 2 + (y / 1.3) ** 2 > 1) continue;
          setPixel(out, (((x + dx) % width) + width) % width, cy + y, lit && y === -1 && dx <= 0 ? range.lit! : color);
        }
      }
    }
  } else if (kind === "cliffs") {
    // Walls of rock: a jagged skyline of blocks, split by dark clefts, a ledge now and then.
    for (let x = 0; x < width; x += 1) {
      const block = Math.floor(x / 9);
      const top = base - Math.round(height * (0.45 + 0.55 * valueNoise(block, 0, 1.6, seed)));
      const cleft = x % 9 === 0 && hash2(block, 1, seed) < 0.5;
      column(x, top + (cleft ? 3 : 0));
    }
  } else if (kind === "deadwood") {
    // Dead trees standing in the water, bare, their branches forking up.
    for (let x = 0; x < width; x += 1) column(x, base - 1);
    const branch = (x0: number, y0: number, dx: number, long: number, depth: number, id: number) => {
      let x = x0;
      let y = y0;
      for (let step = 0; step < long; step += 1) {
        setPixel(out, ((Math.round(x) % width) + width) % width, Math.round(y), color);
        x += dx;
        y -= 1;
        if (depth > 0 && step === Math.floor(long / 2)) branch(x, y, -dx * 1.3, Math.floor(long * 0.6), depth - 1, id * 3 + 1);
      }
    };
    for (let tree = 0; tree < 7; tree += 1) {
      const cx = Math.floor(((tree + hash2(tree, 0, seed) * 0.8) / 7) * width);
      if (range.clearing !== undefined && Math.abs(cx - SCENE_WIDTH / 2) < range.clearing) continue;
      const tall = Math.round(height * (0.5 + 0.5 * hash2(tree, 1, seed)));
      for (let y = 0; y < tall; y += 1) {
        const w = y < 2 ? 2 : 1;
        for (let dx = 0; dx < w; dx += 1) setPixel(out, (cx + dx) % width, base - 1 - y, color);
      }
      branch(cx, base - Math.round(tall * 0.6), 0.6, Math.round(tall * 0.5), 1, tree);
      branch(cx, base - Math.round(tall * 0.8), -0.5, Math.round(tall * 0.35), 1, tree + 11);
    }
  } else {
    // Towers: a wall with crenels, square towers with pointed roofs.
    for (let x = 0; x < width; x += 1) column(x, base - 8 - (x % 8 < 4 ? 2 : 0));
    for (let tower = 0; tower < 5; tower += 1) {
      const cx = Math.floor(((tower + 0.5) / 5) * width);
      const tall = Math.round(height * (0.55 + 0.45 * hash2(tower, 1, seed)));
      for (let dx = -3; dx <= 3; dx += 1) column(cx + dx, base - tall);
      for (let y = 0; y < 6; y += 1) for (let dx = -Math.floor(y * 0.7); dx <= Math.floor(y * 0.7); dx += 1) setPixel(out, (cx + dx + width) % width, base - tall - 6 + y, color);
    }
  }
  if (range.lit !== undefined && (kind === "mountains" || kind === "hills" || kind === "cliffs")) litFaces(out, range.lit, towardMoon(recipe, SCENE_WIDTH / 2), seed);
  if (range.rim !== undefined) moonlit(out, range.rim, 0);
  return out;
}

/**
 * The faces of a range turned to the moon: below every stretch of ridge that climbs away
 * from the moon, a band a step lighter, deeper where the slope is steep, its lower edge
 * broken into gullies that run down the slope.
 */
function litFaces(out: Pixels, lit: Pal, side: number, seed: number) {
  const { w, h } = out;
  const ridge = new Int16Array(w);
  for (let x = 0; x < w; x += 1) {
    let y = 0;
    while (y < h && out.idx[y * w + x] === EMPTY) y += 1;
    ridge[x] = y;
  }
  for (let x = 0; x < w; x += 1) {
    if (ridge[x] >= h) continue;
    const slope = ridge[(x + 2) % w] - ridge[(x - 2 + w) % w];
    // Rows rise as the ridge climbs: a face turned to a moon on the left climbs to the right.
    const facing = -slope * side;
    if (facing <= 0) continue;
    const gully = hash2(x >> 1, 0, seed) < 0.3 ? 2 : 0;
    const depth = Math.min(14, 2 + facing * 2) - gully;
    for (let dy = 1; dy <= depth; dy += 1) {
      const y = ridge[x] + dy;
      if (y >= h) break;
      // The last rows thin out in a checker, a transition and not an edge.
      if (dy > depth - 2 && (x + y) % 2 === 0) continue;
      out.idx[y * w + x] = lit;
    }
  }
}

/// ------------------------------------------------------------------ shafts

/**
 * Shafts of moonlight falling slantwise through a roof of leaves or rock: columns of
 * regular dithering, densest where they enter and thinning out to nothing at the ground,
 * in steps of a quarter so the pattern stays regular.
 */
export function paintShafts(recipe: SceneRecipe): Pixels | null {
  const shafts = recipe.shafts;
  if (!shafts) return null;
  const out = createPixels(SCENE_WIDTH, H);
  const top = recipe.ceiling !== undefined ? 30 : 0;
  const bottom = recipe.horizon + 18;
  for (let shaft = 0; shaft < shafts.count; shaft += 1) {
    const x0 = Math.floor(((shaft + 0.2 + hash2(shaft, 0, recipe.seed + 61) * 0.6) / shafts.count) * SCENE_WIDTH);
    const wide = 5 + Math.floor(hash2(shaft, 1, recipe.seed + 61) * 9);
    for (let y = top; y < bottom; y += 1) {
      const k = (y - top) / (bottom - top);
      const cover = Math.floor((1 - k) * 0.36 * 8) / 8;
      if (cover <= 0) break;
      const left = x0 + Math.round((y - top) * shafts.slant);
      for (let x = left; x < left + wide; x += 1) {
        // The edges of a shaft are sparser than its heart.
        const edge = x === left || x === left + wide - 1 ? 0.5 : 1;
        if (bayer(x, y) < cover * edge) setPixel(out, ((x % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH, y, shafts.color);
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------ the landmark

/** Where the road leads: a far place, small and flat, with a light of its own. */
function landmarkShapes(kind: LandmarkKind): Shape[] {
  switch (kind) {
    case "keep":
      // Orvane Keep on its hill, seen from the fields: towers, a keep, one window lit.
      return [
        { e: [32, 64, 30, 10], m: "body" },
        { r: [18, 38, 28, 22], m: "body" },
        { r: [14, 28, 7, 30], m: "body" },
        { r: [43, 24, 7, 34], m: "body" },
        { r: [27, 18, 10, 40], m: "body" },
        { p: [13, 28, 17.5, 20, 22, 28], m: "body" },
        { p: [42, 24, 46.5, 15, 51, 24], m: "body" },
        { p: [26, 18, 32, 6, 38, 18], m: "body" },
        { r: [31, 26, 2, 3], m: "light", glow: true }
      ];
    case "great-tree":
      return [
        { c: [32, 64, 32, 30, 6, 4], m: "body" },
        { e: [32, 22, 26, 16], m: "body" },
        { e: [32, 44, 2, 3], m: "light", glow: true }
      ];
    case "crystal-gate":
      return [
        { p: [6, 64, 12, 24, 32, 8, 52, 24, 58, 64], m: "body" },
        { p: [22, 64, 24, 36, 32, 28, 40, 36, 42, 64], m: "light", glow: true }
      ];
    case "manor":
      // Osric's manor, sinking a little more every night: it leans.
      return [
        { p: [10, 64, 12, 30, 54, 26, 56, 64], m: "body" },
        { p: [8, 32, 30, 12, 58, 28], m: "body" },
        { r: [44, 12, 5, 12], m: "body" },
        { r: [18, 38, 4, 5], m: "light", glow: true },
        { r: [40, 36, 4, 5], m: "light", glow: true }
      ];
    case "throne-tower":
      return [
        { e: [32, 64, 24, 8], m: "body" },
        { r: [25, 18, 14, 46], m: "body" },
        { r: [23, 14, 18, 6], m: "body" },
        { p: [27, 14, 32, 4, 37, 14], m: "light", glow: true }
      ];
  }
}

export function paintLandmark(recipe: SceneRecipe): Pixels {
  const out = createPixels(SCENE_WIDTH, H);
  const mark = recipe.landmark;
  if (!mark) return out;
  const size = 36;
  fillShapes(out, landmarkShapes(mark.kind), mark.x - size / 2, mark.base - size + 1, size / 64, mark.color, recipe.glow);
  if (mark.rim !== undefined) moonlit(out, mark.rim, towardMoon(recipe, mark.x));
  return out;
}
