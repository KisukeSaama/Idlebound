/**
 * The dark shapes in front of everything, framing the view at its edges: tall grass,
 * branches, rocks, reeds, fallen masonry.
 */
import { SCENE_HEIGHT, type ForegroundKind, type Pal, type SceneRecipe } from "@idlebound/game/art";
import { sine } from "./draw";
import { createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";

const H = SCENE_HEIGHT;

// ------------------------------------------------------------------ foreground

/** Width of the tall grass framing each side. */
const GRASS_FRAME = 104;
/** Clumps of tall grass, from the edge inward: foot, height, spread (behind, then in front). */
const BACK_CLUMPS: readonly (readonly [number, number, number])[] = [[4, 70, 9], [22, 58, 8], [42, 40, 7], [62, 26, 6], [80, 14, 4]];
const FRONT_CLUMPS: readonly (readonly [number, number, number])[] = [[-2, 58, 9], [14, 46, 8], [32, 32, 7], [50, 20, 5], [66, 11, 4]];

/**
 * Tall dark grass in front of everything, framing the view: blades drawn one by one,
 * tallest at the edge, bending toward the middle, shorter and sparser inward so the road
 * runs out of the view between them. The back blades are a shade lighter than the front.
 */
function paintTallGrass(recipe: SceneRecipe, side: "left" | "right", frame: number): Pixels {
  const out = createPixels(GRASS_FRAME, H);
  const front = recipe.foreground.color;
  const back = recipe.foreground.back ?? front;
  const seed = recipe.seed + (side === "left" ? 0 : 50);
  const rim = recipe.foreground.rim;
  const bend = frame === 0 ? 0 : 0.07;
  // A blade: a long leaf, broad at the foot and tapering to a point, bending as it rises. A
  // near blade has a rib a tone lighter along its inner edge and its point lit.
  const blade = (x0: number, tall: number, lean: number, broad: number, color: Pal, near: boolean, id: number) => {
    const lit = near && rim !== undefined && hash2(id, tall, seed) < 0.6;
    // From the second row up: the last row holds only the solid mass, which runs on below.
    for (let s = 1; s < tall; s += 1) {
      const k = s / tall;
      const x = Math.round(x0 + lean * tall * k * k);
      const width = Math.max(1, Math.round(broad * (1 - k)));
      for (let dx = 0; dx < width; dx += 1) {
        const px = side === "left" ? x + dx : GRASS_FRAME - 1 - x - dx;
        if (px < 0 || px >= GRASS_FRAME) continue;
        const rib = near && width >= 3 && dx === width - 2 && k > 0.2 && k < 0.8;
        const point = lit && s >= tall - 3;
        setPixel(out, px, H - 1 - s, point ? rim! : rib ? back : color);
      }
    }
  };
  for (const [layer, color] of [[0, back], [1, front]] as const) {
    // A solid mass at the foot, highest at the edge, from which the clumps rise.
    const mass = (x: number) => Math.round((layer === 0 ? 30 : 22) * Math.max(0, 1 - x / (GRASS_FRAME * (layer === 0 ? 0.7 : 0.55))) ** 1.4);
    for (let x = 0; x < GRASS_FRAME; x += 1) {
      const px = side === "left" ? x : GRASS_FRAME - 1 - x;
      for (let s = 0; s < mass(x); s += 1) setPixel(out, px, H - 1 - s, color);
    }
    // Clumps, tallest at the edge: each a tight fan of broad leaves that overlap into one
    // dark mass, only their points standing free against the scene.
    const clumps = layer === 0 ? BACK_CLUMPS : FRONT_CLUMPS;
    clumps.forEach(([cx, tall, spread], clump) => {
      const leaves = Math.max(4, Math.round(spread * 1.6));
      for (let leaf = 0; leaf < leaves; leaf += 1) {
        const k = leaves === 1 ? 0.5 : leaf / (leaves - 1);
        const height = Math.round(tall * (0.55 + 0.45 * (1 - Math.abs(k - 0.5) * 1.6) * (0.8 + 0.2 * hash2(clump, leaf, seed))));
        const lean = (k - 0.5) * 0.9 + 0.12 + bend;
        blade(cx + Math.round((k - 0.5) * spread), height, lean, Math.max(3, Math.round(spread * 0.7)), color, layer === 1, clump * 16 + leaf);
      }
    });
  }
  return out;
}

// ------------------------------------------------------------------ framing shapes

/** Width of the framing shapes at each edge; only their low parts reach far in. */
const FRAME_WIDTH = 96;

/**
 * A little painter for the framing shapes, drawn for the left edge (the right edge is the
 * same drawing mirrored, from another seed). Three tones: the body, near black; a lighter
 * tone behind it; and a thin light on the edges turned toward the scene.
 */
interface Frame {
  out: Pixels;
  body: Pal;
  back: Pal;
  rim: Pal;
  glow: Pal;
  seed: number;
  /** 0 or 1: the shapes sway a pixel on the second frame. */
  sway: number;
}

const put = (f: Frame, x: number, y: number, color: Pal, emit = 0) => {
  if (x >= 0 && x < FRAME_WIDTH) setPixel(f.out, Math.round(x), Math.round(y), color, 255, emit);
};

/** The frame's three tones, darkest first. */
const tones = (f: Frame): readonly Pal[] => [f.body, f.back, f.rim];

/**
 * A trunk or a column rising from `bottom` to `top`: its half width and its axis may change
 * with the row. Round: its outer half in the deepest tone, a band of light down the side
 * turned to the scene and a broken edge of light on it; its grain (plates of bark, flutes,
 * facets of rock) cut into that volume a tone darker.
 */
function column(f: Frame, axis: (y: number) => number, half: (y: number) => number, top: number, bottom: number, grain: "bark" | "flutes" | "rock") {
  const ramp = tones(f);
  for (let y = top; y < bottom; y += 1) {
    const cx = axis(y);
    const r = half(y);
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x += 1) {
      const across = (x - cx) / Math.max(1, r);
      if (Math.abs(across) > 1) continue;
      let level = across > 0.78 ? 2 : across > 0.15 ? 1 : 0;
      if (grain === "bark") {
        // Plates of bark between wandering cracks; some plates sunk in shade.
        const px = x + Math.round(sine(y / 17 + hash2(Math.floor(x / 4), 0, f.seed)) * 1.2);
        const plate = Math.floor(px / 4);
        const row = Math.floor((y + hash2(plate, 1, f.seed) * 10) / 10);
        if (px % 4 === 0 || hash2(plate, row, f.seed) < 0.3) level -= 1;
      } else if (grain === "flutes") {
        // Flutes: a groove every third column, its lip catching the light.
        const flute = Math.round((across + 1) * r) % 3;
        if (flute === 0) level -= 1;
        else if (flute === 1 && level === 1) level = 2;
      } else {
        const cell = Math.floor(x / 5) * 31 + Math.floor((y + (Math.floor(x / 5) % 2) * 3) / 6);
        if (hash2(cell, 0, f.seed) < 0.35) level -= 1;
        if ((y + (Math.floor(x / 5) % 2) * 3) % 6 === 0) level = 0;
      }
      // The lit edge breaks into runs.
      if (level === 2 && hash2(x, y >> 2, f.seed) > 0.75) level = 1;
      put(f, x, y, ramp[Math.max(0, level)]);
    }
  }
}

/** A stem along a curve from (x0, y0) to (x1, y1), sagging by `sag`, `width` thick at its foot; thorns on demand. */
function stem(f: Frame, x0: number, y0: number, x1: number, y1: number, sag: number, width: number, color: Pal, thorns = false) {
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5);
  for (let step = 0; step <= steps; step += 1) {
    const k = step / steps;
    const x = x0 + (x1 - x0) * k;
    const y = y0 + (y1 - y0) * k + sag * 4 * k * (1 - k);
    const r = Math.max(0.5, (width / 2) * (1 - k * 0.7));
    for (let dy = -Math.floor(r); dy <= Math.floor(r); dy += 1) for (let dx = -Math.floor(r); dx <= Math.floor(r); dx += 1) put(f, x + dx, y + dy, color);
    if (thorns && step % 5 === 2) put(f, x + (step % 10 < 5 ? 1 : -1), y - 1 - Math.floor(r), color);
  }
}

/** A clump of leaves: small overlapping ovals, the far ones in the lighter tone, the near ones veined and lit on top. */
function clump(f: Frame, cx: number, cy: number, r: number, count: number) {
  for (let leaf = 0; leaf < count; leaf += 1) {
    const a = hash2(leaf, 1, f.seed + cx);
    const d = hash2(leaf, 2, f.seed + cy) * r;
    const lx = Math.round(cx + (a - 0.5) * 2 * d + f.sway);
    const ly = Math.round(cy + (hash2(leaf, 3, f.seed) - 0.5) * r * 1.2);
    const far = leaf % 3 === 0;
    for (let y = -1; y <= 1; y += 1) for (let x = -2; x <= 2; x += 1) if ((x / 2.4) ** 2 + (y / 1.3) ** 2 <= 1) put(f, lx + x, ly + y, far ? f.back : f.body);
    if (far) continue;
    // A vein down the middle, the upper edge toward the scene lit.
    put(f, lx, ly, f.back);
    put(f, lx + 1, ly - 1, f.rim);
    if (hash2(leaf, 4, f.seed) < 0.5) put(f, lx, ly - 1, f.rim);
  }
}

/** A fern: fronds arching out of one foot, leaflets along them, the back fronds lighter, the near tips lit. */
function fern(f: Frame, x0: number, y0: number, size: number) {
  for (let frond = 0; frond < 7; frond += 1) {
    const k = frond / 6;
    const reach = size * (0.55 + 0.45 * (1 - Math.abs(k - 0.55) * 1.6));
    const angle = -0.15 + k * 1.3;
    const back = frond % 2 === 0;
    for (let s = 0; s < reach; s += 1) {
      const t = s / reach;
      const x = x0 + (angle - 0.5) * 2 * reach * t + f.sway * t;
      const y = y0 - reach * 0.9 * t + reach * 0.8 * t * t;
      const color = back ? f.back : t > 0.72 ? f.rim : f.body;
      put(f, x, y, color);
      if (s % 2 === 0 && t < 0.9) {
        put(f, x - 1, y - 1, color);
        put(f, x + 1, y - 1, back ? f.back : t > 0.4 ? f.rim : f.body);
      }
    }
  }
}

/**
 * A boulder: a lumpy oval built of flat facets, each turned its own way; lit from above and
 * from the scene's side, a crease along the lower edge of every facet, a broken bright rim
 * along its top.
 */
function boulder(f: Frame, cx: number, cy: number, rx: number, ry: number) {
  const ramp = tones(f);
  const facet = (x: number, y: number) => Math.floor((x + Math.floor(y / 4) * 2) / 5) * 17 + Math.floor(y / 4);
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      const lump = 1 + 0.14 * sine((x - cx) / rx + hash2(cx, cy, f.seed));
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = nx * nx + ny * ny;
      if (d > lump) continue;
      const light = nx * 0.5 - ny * 0.85 + (hash2(facet(x, y), 1, f.seed) - 0.5) * 0.7;
      let level = light > 0.55 ? 2 : light > -0.1 ? 1 : 0;
      if (facet(x, y + 1) !== facet(x, y)) level = 0;
      const top = ((x - cx) / rx) ** 2 + ((y - 1 - cy) / ry) ** 2 > lump && y < cy;
      if (top && hash2(x >> 1, y, f.seed) < 0.8) level = 2;
      put(f, x, y, ramp[level]);
    }
  }
}

/** A few glints of light in the dark shapes (crystals, embers): steady pixels of the scene's light. */
function glints(f: Frame, points: readonly (readonly [number, number])[]) {
  for (const [x, y] of points) {
    put(f, x, y, f.glow, 1);
    put(f, x, y - 1, f.glow, 1);
    put(f, x + 1, y, f.back);
  }
}

/**
 * A mound at the foot of the frame, highest at the edge and sinking toward the middle,
 * filled with its matter: roots crossing it, stones, mud streaked by water, or fallen
 * blocks; its crest catches the light in runs.
 */
function mound(f: Frame, width: number, height: number, matter: "roots" | "stones" | "mud" | "rubble") {
  const crest = (x: number) => Math.round(height * Math.max(0, 1 - x / width) ** 1.3 + (x < width ? sine(x / 23 + hash2(width, height, f.seed)) * 2 : 0));
  for (let x = 0; x < width; x += 1) {
    const top = H - crest(x);
    for (let y = top; y < H; y += 1) {
      let color = f.body;
      if (y === top && hash2(x >> 1, 0, f.seed) < 0.7) color = f.rim;
      else if (matter === "mud" && (y + (x >> 3)) % 5 === 0 && hash2(x >> 2, y, f.seed) < 0.6) color = f.back;
      else if (y <= top + 2) color = f.back;
      put(f, x, y, color);
    }
  }
  if (matter === "roots") {
    for (let root = 0; root < 4; root += 1) {
      const y0 = H - Math.round(height * (0.3 + 0.6 * hash2(root, 1, f.seed)));
      stem(f, 0, y0, width * (0.5 + 0.4 * hash2(root, 2, f.seed)), H - 1, -3 - root, 4 - root * 0.6, f.back);
    }
  } else if (matter === "stones") {
    for (let stone = 0; stone < 6; stone += 1) {
      const x = Math.round(width * (stone + 0.5) / 6 * 0.9);
      const r = Math.max(3, Math.round(crest(x) * 0.45));
      if (crest(x) > 3) boulder(f, x, H - crest(x) + r * 0.6, r * 1.3, r * 0.8);
    }
  } else if (matter === "rubble") {
    for (let block = 0; block < 9; block += 1) {
      const x = Math.floor(hash2(block, 1, f.seed) * width * 0.85);
      const y = H - Math.floor(hash2(block, 2, f.seed) * crest(x));
      const bw = 5 + Math.floor(hash2(block, 3, f.seed) * 6);
      for (let dy = 0; dy < 4; dy += 1) for (let dx = 0; dx < bw; dx += 1) put(f, x + dx, y - dy, dy === 3 ? f.rim : dx === 0 || dy === 0 ? f.body : f.back);
    }
  }
}

/** The framing shapes of each kind: the left edge's drawing (A) and the right edge's (B). */
function frame(f: Frame, kind: Exclude<ForegroundKind, "grass">, variant: "A" | "B") {
  const s = f.sway;
  switch (kind) {
    case "branches":
      if (variant === "A") {
        // An old trunk at the edge, round and deep in shade, its roots crawling in over a
        // mound of earth; a bough reaching over the top of the view, leaves hanging from it.
        mound(f, 70, 22, "roots");
        column(f, (y) => 9 + (180 - y) * 0.02, (y) => 12 + Math.max(0, (y - 146) * 0.35), 0, 180, "bark");
        stem(f, 16, 26, 72 + s, 14, -6, 6, f.body);
        stem(f, 34, 20, 54 + s, 38, 4, 3, f.body);
        clump(f, 62, 18, 10, 18);
        clump(f, 76, 11, 7, 12);
        clump(f, 52, 38, 7, 10);
        clump(f, 32, 6, 11, 14);
        fern(f, 30, 176, 24);
        fern(f, 54, 179, 16);
      } else {
        // A younger trunk, brambles arching out of a thicket, thorned; a vine from above.
        mound(f, 64, 18, "roots");
        column(f, () => 4, (y) => 7 + Math.max(0, (y - 156) * 0.3), 0, 180, "bark");
        stem(f, 6, 176, 54, 148, -18, 3, f.back, true);
        stem(f, 4, 174, 42, 138 + s, -22, 3, f.body, true);
        stem(f, 8, 178, 66, 164, -10, 2, f.rim, true);
        stem(f, 10, 0, 20 + s, 66, 6, 2, f.body);
        clump(f, 18, 60, 6, 9);
        clump(f, 14, 32, 7, 10);
        clump(f, 16, 150, 11, 18);
        fern(f, 34, 178, 20);
        glints(f, [[40, 172], [48, 175]]);
      }
      return;
    case "rocks":
      if (variant === "A") {
        // A rock mass hanging at the top corner, faceted, its teeth pointing down; a
        // stalagmite and a heap of stones at the foot, a vein of crystal catching the light.
        boulder(f, 6, -4, 34, 22);
        for (let x = 0; x < 44; x += 7) column(f, () => x + 3, (y) => Math.max(0.6, 3 - (y - 16) * 0.12), 12, 18 + Math.round(10 * hash2(x, 0, f.seed)), "rock");
        column(f, () => 7, (y) => Math.max(1, (y - 90) * 0.14), 90, 180, "rock");
        mound(f, 72, 26, "stones");
        glints(f, [[10, 150], [13, 156], [9, 163], [30, 12], [44, 170]]);
      } else {
        boulder(f, 0, -6, 24, 16);
        column(f, () => 6, (y) => Math.max(1, (y - 120) * 0.16), 120, 180, "rock");
        mound(f, 66, 22, "stones");
        glints(f, [[16, 152], [21, 160], [40, 174]]);
      }
      return;
    case "reeds":
      mound(f, variant === "A" ? 70 : 60, variant === "A" ? 16 : 12, "mud");
      if (variant === "B") {
        // A drowned post, leaning, a rope still round it.
        column(f, (y) => 16 + (180 - y) * 0.08, () => 3, 116, 180, "bark");
        stem(f, 12, 132, 24, 137, 2, 1, f.rim);
      } else {
        // The stump of a drowned tree, its broken top pale.
        column(f, () => 10, (y) => 6 + Math.max(0, (y - 160) * 0.3), 132, 180, "bark");
        for (let x = 4; x <= 16; x += 1) put(f, x, 132 - (x % 3 === 0 ? 2 : 0), f.rim);
      }
      for (let reed = 0; reed < (variant === "A" ? 26 : 20); reed += 1) {
        // Reeds tallest at the edge, leaning in; cattails on the tallest, their tops lit.
        const foot = Math.floor(hash2(reed, 1, f.seed) * 50);
        const tall = Math.round((116 - foot * 1.9) * (0.6 + 0.4 * hash2(reed, 2, f.seed)));
        if (tall < 8) continue;
        const lean = 0.08 + hash2(reed, 3, f.seed) * 0.12;
        const color = reed % 3 === 0 ? f.back : f.body;
        for (let y = 0; y < tall; y += 1) {
          const k = y / tall;
          const x = foot + lean * tall * k * k + s * k;
          put(f, x, 179 - y, k > 0.85 && reed % 3 !== 0 ? f.rim : color);
          if (y < tall * 0.35) put(f, x + 1, 179 - y, f.back);
        }
        if (hash2(reed, 4, f.seed) < 0.45) {
          const x = foot + lean * tall + s;
          for (let y = 0; y < 6; y += 1) {
            put(f, x, 179 - tall - y, f.body);
            put(f, x + 1, 179 - tall - y, y > 3 ? f.rim : f.back);
          }
          put(f, x, 179 - tall - 7, f.body);
        }
      }
      return;
    case "ruins":
      if (variant === "A") {
        // A column broken halfway, fluted, its drum fallen at its foot among the rubble; ivy climbing it.
        mound(f, 74, 20, "rubble");
        column(f, () => 13, () => 11, 58, 180, "flutes");
        for (let x = 2; x <= 24; x += 1) {
          const top = 58 - Math.round(sine(x / 7) * 3 + (x % 4 === 0 ? 2 : 0));
          put(f, x, top, f.rim);
          put(f, x, top + 1, f.back);
        }
        boulder(f, 44, 170, 15, 8);
        for (let y = 86; y < 176; y += 3) clump(f, 22 + Math.round(sine(y / 40) * 2), y, 3, 3);
        fern(f, 62, 180, 14);
      } else {
        // The corner of a fallen wall, block by block, stepping down; each block lit on
        // top, its joints dark, grass and ivy in them.
        mound(f, 70, 16, "rubble");
        for (let course = 0; course < 12; course += 1) {
          const y = 180 - (course + 1) * 8;
          const long = Math.round(42 - course * 3.2 + hash2(course, 0, f.seed) * 6);
          for (let dy = 0; dy < 8; dy += 1) {
            for (let x = 0; x < long; x += 1) {
              const joint = dy === 7 || (x + course * 5) % 13 === 0;
              const face = x > long - 4 ? f.back : dy < 2 ? f.back : f.body;
              put(f, x, y + dy, joint ? f.body : dy === 0 && hash2(x >> 1, course, f.seed) < 0.75 ? f.rim : face);
            }
          }
        }
        fern(f, 46, 180, 14);
        clump(f, 30, 98, 6, 8);
        clump(f, 12, 60, 5, 6);
      }
      return;
  }
}

export function paintForeground(recipe: SceneRecipe, side: "left" | "right", frame_: number): Pixels {
  const kind = recipe.foreground.kind;
  if (kind === "grass") return paintTallGrass(recipe, side, frame_);
  const drawn = createPixels(FRAME_WIDTH, H);
  const { color, back, rim } = recipe.foreground;
  const f: Frame = { out: drawn, body: color, back: back ?? color, rim: rim ?? back ?? color, glow: recipe.glow, seed: recipe.seed + (side === "left" ? 0 : 37), sway: frame_ === 0 ? 0 : 1 };
  frame(f, kind, side === "left" ? "A" : "B");
  if (side === "left") return drawn;
  const mirrored = createPixels(FRAME_WIDTH, H);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < FRAME_WIDTH; x += 1) {
      const from = y * FRAME_WIDTH + x;
      if (drawn.idx[from] !== EMPTY) setPixel(mirrored, FRAME_WIDTH - 1 - x, y, drawn.idx[from], 255, drawn.emit[from]);
    }
  }
  return mirrored;
}
