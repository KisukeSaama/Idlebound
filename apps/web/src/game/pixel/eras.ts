/**
 * Era and Age treatments (BIBLE 18.6): how each stratum transforms a base recipe. The
 * deeper the night, the less finished the world looks. Every treatment stays inside the
 * Orvane 64 (colors are remapped to palette entries, never computed), and emissive pixels
 * (eyes, flames) are never touched: a Remnant's eyes are always its own.
 */
import { C, palLuma, type CreatureRank, type MaterialId, type Pal, type ResolvedRecipe } from "@idlebound/game/art";
import { bayer, clonePixels, createPixels, EMPTY, hash2, valueNoise, type Pixels } from "./pixels";
import { GILDED_TABLE, GREY_TABLE, WARM_TABLE } from "./tables";

export const AGE_COUNT = 12;
export const ERAS_PER_AGE = 5;

/** Age of an era: I (0) to XII (11). */
export function ageOf(era: number): number {
  return Math.min(AGE_COUNT - 1, Math.floor(Math.max(0, era) / ERAS_PER_AGE));
}

export interface TreatContext {
  seed: number;
  /** Era within its Age, 0 to 4: each stratum goes a little further than the one above. */
  step: number;
  rank: CreatureRank;
}

export interface Treatment {
  age: number;
  era: number;
  bias?: number;
  steps?: number;
  swap?: (id: MaterialId, slot: string) => MaterialId;
  /** Color of the whole outline. */
  line?: Pal;
  halfClosed?: boolean;
  /** World pixels per sprite pixel (Age XII: fewer and fewer pixels). */
  unit?: number;
  /** Animation speed factor (Age VIII: slower). */
  speed: number;
  /** Embers rise from the sprite (Ash). */
  embers?: boolean;
  /** The sprite flickers as if woven (Loom). */
  flicker?: boolean;
  post?: (pixels: Pixels, context: TreatContext) => Pixels;
}

const WARM = WARM_TABLE;
const GREY = GREY_TABLE;
const GILDED = GILDED_TABLE;

function remap(source: Pixels, table: readonly Pal[], when: (x: number, y: number, pal: Pal) => boolean = () => true): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at] || !when(x, y, pal)) continue;
      out.idx[at] = table[pal];
    }
  }
  return out;
}

/** Pixels that belong to the body (not its outline): at least 3 drawn neighbors. */
function interior(source: Pixels, x: number, y: number): boolean {
  const { w, h, idx } = source;
  let count = 0;
  for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]] as const) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < w && ny < h && idx[ny * w + nx] !== EMPTY) count += 1;
  }
  return count === 4;
}

/** Echo: a ghost copy, one pixel behind, at 30%. */
function echo(source: Pixels): Pixels {
  const out = createPixels(source.w, source.h);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const from = y * source.w + x;
      if (source.idx[from] === EMPTY) continue;
      const tx = x + 1;
      const ty = y - 1;
      if (tx >= source.w || ty < 0) continue;
      const to = ty * source.w + tx;
      out.idx[to] = source.idx[from];
      out.alpha[to] = 77;
    }
  }
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    out.idx[at] = source.idx[at];
    out.alpha[at] = source.alpha[at];
    out.emit[at] = source.emit[at];
  }
  return out;
}

/** Ash: warm ramps and a few embers caught on the upper edges. */
function ash(source: Pixels, { seed }: TreatContext): Pixels {
  const out = remap(source, WARM);
  for (let y = 1; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.idx[at - source.w] !== EMPTY) continue;
      if (hash2(x, y, seed + 11) < 0.12) {
        out.idx[at] = hash2(x, y, seed) < 0.5 ? C.ember : C.amber;
        out.emit[at] = 1;
      }
    }
  }
  return out;
}

/**
 * Void: round pieces of the body taken away, cut clean: discs of the dark beneath the
 * world, a star in them, a pale ring along each cut. Placed where they fit whole inside
 * the body, clear of the eyes.
 */
function voidHoles(source: Pixels, { seed }: TreatContext): Pixels {
  const out = clonePixels(source);
  const { w, h } = source;
  const r = Math.max(2, Math.round(Math.min(w, h) * 0.07));
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && source.idx[y * w + x] !== EMPTY && !source.emit[y * w + x];
  const fits = (cx: number, cy: number) => {
    for (let y = -r - 2; y <= r + 2; y += 1) for (let x = -r - 2; x <= r + 2; x += 1) if (x * x + y * y <= (r + 2) ** 2 && !solid(cx + x, cy + y)) return false;
    return true;
  };
  const placed: [number, number][] = [];
  for (let attempt = 0; attempt < 400 && placed.length < 2; attempt += 1) {
    const cx = Math.floor(hash2(attempt, 1, seed + 5) * w);
    const cy = Math.floor(hash2(attempt, 2, seed + 5) * h);
    if (!fits(cx, cy) || placed.some(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 < (r * 3) ** 2)) continue;
    placed.push([cx, cy]);
  }
  for (const [cx, cy] of placed) {
    for (let y = -r - 1; y <= r + 1; y += 1) {
      for (let x = -r - 1; x <= r + 1; x += 1) {
        const d = Math.sqrt(x * x + y * y);
        if (d > r + 0.9) continue;
        const at = (cy + y) * w + cx + x;
        out.idx[at] = d > r - 0.1 ? C.pale : x === -1 && y === -1 ? C.lilac : C.ink;
      }
    }
  }
  return out;
}

/** Astral: star specks inside the body. */
function astral(source: Pixels, { seed }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const n = hash2(x, y, seed + 21);
      if (n < 0.035) {
        out.idx[at] = n < 0.012 ? C.moon : C.shardLight;
        out.emit[at] = 1;
      }
    }
  }
  return out;
}

/** Hallowed: gilded highlights, a halo, a column of light behind the great ones. */
function hallowed(source: Pixels, { rank, step }: TreatContext): Pixels {
  const gilded = remap(source, GILDED, (_x, _y, pal) => palLuma(pal) > 120);
  const out = createPixels(source.w, source.h);
  let top = source.h;
  let left = source.w;
  let right = 0;
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    const x = at % source.w;
    top = Math.min(top, Math.floor(at / source.w));
    left = Math.min(left, x);
    right = Math.max(right, x);
  }
  const center = Math.round((left + right) / 2);
  if (rank === "guardian" || rank === "king" || rank === "elite") {
    const half = Math.max(2, Math.round((right - left) * (0.14 + step * 0.03)));
    for (let y = 0; y < source.h; y += 1) {
      for (let x = center - half; x <= center + half; x += 1) {
        if (x < 0 || x >= source.w || bayer(x, y) > 0.35 - (y / source.h) * 0.2) continue;
        const at = y * source.w + x;
        out.idx[at] = C.goldLight;
        out.alpha[at] = 70;
      }
    }
  }
  for (let at = 0; at < gilded.idx.length; at += 1) {
    if (gilded.idx[at] === EMPTY) continue;
    out.idx[at] = gilded.idx[at];
    out.alpha[at] = gilded.alpha[at];
    out.emit[at] = gilded.emit[at];
  }
  // The halo: a thin ring floating above the head.
  const radius = Math.max(3, Math.round(source.w / (13 - step)));
  const cy = top - 3;
  for (let dx = -radius; dx <= radius; dx += 1) {
    const edge = Math.round(Math.sqrt(Math.max(0, radius * radius - dx * dx)) / 3);
    for (const dy of [-edge, edge]) {
      const x = center + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= source.w || y >= source.h) continue;
      const at = y * source.w + x;
      out.idx[at] = C.goldLight;
      out.alpha[at] = 255;
      out.emit[at] = 1;
    }
  }
  return out;
}

/** Stars: the body turns half transparent and fills with a star field. */
function starry(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const n = hash2(x, y, seed + 31);
      if (n < 0.03 + step * 0.012) {
        out.idx[at] = n < 0.015 ? C.moon : C.shardLight;
        out.alpha[at] = 255;
        out.emit[at] = 1;
      } else {
        out.idx[at] = palLuma(source.idx[at]) > 90 ? C.vault3 : C.vault1;
        out.alpha[at] = 140;
      }
    }
  }
  return out;
}

/** Loom: vertical threads through everything, some hanging loose. */
function woven(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  let top = source.h;
  let bottom = 0;
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    const y = Math.floor(at / source.w);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  for (let x = 0; x < source.w; x += 1) {
    if (hash2(x, 0, seed + 41) > 0.12 + step * 0.05) continue;
    const loose = hash2(x, 1, seed + 41) < 0.4 ? 2 + Math.floor(hash2(x, 2, seed) * 5) : 0;
    let touched = false;
    for (let y = 0; y < source.h; y += 1) {
      const at = y * source.w + x;
      if (source.idx[at] !== EMPTY) {
        touched = true;
        if (!source.emit[at]) out.idx[at] = (y & 1) === 0 ? C.pale : C.lilac;
      }
    }
    if (!touched || loose === 0) continue;
    for (let y = bottom + 1; y <= Math.min(source.h - 1, bottom + loose); y += 1) {
      const at = y * source.w + x;
      out.idx[at] = C.lilac;
      out.alpha[at] = 160;
    }
    for (let y = Math.max(0, top - loose); y < top; y += 1) {
      const at = y * source.w + x;
      out.idx[at] = C.lilac;
      out.alpha[at] = 120;
    }
  }
  return out;
}

/** Draft: paper and charcoal, cross-hatching where the shading was. */
function sketched(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at]) continue;
      if (!interior(source, x, y)) {
        out.idx[at] = C.night3;
        continue;
      }
      const luma = palLuma(pal);
      let color: Pal = C.paper;
      if (luma < 110 && (x + y) % 3 === 0) color = C.haze;
      if (luma < 60 && (x - y + 300) % 3 === 0) color = C.haze;
      if (valueNoise(x, y, 4, seed + 51) > 0.86 - step * 0.04) color = C.lilac;
      out.idx[at] = color;
    }
  }
  return out;
}

/** 3 × 5 runes of no known alphabet: the Words fill every silhouette with writing. */
export const RUNES: readonly (readonly number[])[] = [
  [0b010, 0b111, 0b010, 0b010, 0b010],
  [0b110, 0b101, 0b110, 0b100, 0b100],
  [0b111, 0b001, 0b010, 0b100, 0b111],
  [0b101, 0b101, 0b111, 0b001, 0b001],
  [0b011, 0b100, 0b010, 0b001, 0b110],
  [0b111, 0b101, 0b101, 0b101, 0b111],
  [0b100, 0b110, 0b101, 0b110, 0b100],
  [0b010, 0b101, 0b010, 0b101, 0b010]
];

const RUNE_INK = [C.goldLight, C.pale, C.shardLight, C.essenceLight, C.amber];

function worded(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const cellX = Math.floor(x / 4);
      const cellY = Math.floor(y / 6);
      const rune = RUNES[Math.floor(hash2(cellX, cellY, seed + 61) * RUNES.length)];
      const gx = x % 4;
      const gy = y % 6;
      const ink = gx < 3 && gy < 5 && ((rune[gy] >> (2 - gx)) & 1) === 1;
      out.idx[at] = ink ? RUNE_INK[step] : palLuma(pal) > 80 ? C.dusk : C.night2;
    }
  }
  return out;
}

/** The Room: the side facing the lamp turns warm. */
function lamplit(source: Pixels, { step }: TreatContext): Pixels {
  return remap(source, WARM, (_x, _y, pal) => palLuma(pal) > 90 - step * 12);
}

/** Unmaking: colors drain toward grey, more with every era; the outline stays. */
function drained(amount: number) {
  return (source: Pixels): Pixels => remap(source, GREY, (x, y) => bayer(x, y) < amount);
}

/** Blank: only the outline is left, pale on a pale sky. */
function blank(source: Pixels): Pixels {
  const out = createPixels(source.w, source.h);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY) continue;
      if (source.emit[at]) {
        out.idx[at] = source.idx[at];
        out.alpha[at] = 255;
        out.emit[at] = 1;
      } else if (!interior(source, x, y)) {
        out.idx[at] = C.haze;
        out.alpha[at] = 255;
      }
    }
  }
  return out;
}

/** First Mark: fewer and fewer pixels, each one standing for a block of the old ones. */
function fewer(unit: number) {
  return (source: Pixels): Pixels => {
    const w = Math.ceil(source.w / unit);
    const h = Math.ceil(source.h / unit);
    const out = createPixels(w, h);
    for (let by = 0; by < h; by += 1) {
      for (let bx = 0; bx < w; bx += 1) {
        const counts = new Map<number, number>();
        let drawn = 0;
        let emissive: number = EMPTY;
        for (let y = by * unit; y < Math.min(source.h, (by + 1) * unit); y += 1) {
          for (let x = bx * unit; x < Math.min(source.w, (bx + 1) * unit); x += 1) {
            const at = y * source.w + x;
            const pal = source.idx[at];
            if (pal === EMPTY) continue;
            drawn += 1;
            if (source.emit[at]) emissive = pal;
            counts.set(pal, (counts.get(pal) ?? 0) + 1);
          }
        }
        if (drawn * 2 < unit * unit) continue;
        let best: number = EMPTY;
        let most = 0;
        for (const [pal, count] of counts) {
          if (count > most || (count === most && pal < best)) {
            best = pal;
            most = count;
          }
        }
        const at = by * w + bx;
        out.idx[at] = emissive !== EMPTY ? emissive : best;
        out.alpha[at] = 255;
        out.emit[at] = emissive !== EMPTY ? 1 : 0;
      }
    }
    return out;
  };
}

const SOFT_MATERIALS = new Set<MaterialId>(["fur-grey", "fur-brown", "fur-rust", "fur-shadow", "hide", "flesh", "moss", "leaf", "bark", "mud", "slime", "feather"]);

/** How an era transforms a recipe. Pip is the same in every stratum. */
export function treatment(era: number, recipe: Pick<ResolvedRecipe, "rank">): Treatment {
  const age = ageOf(era);
  const step = Math.max(0, era) % ERAS_PER_AGE;
  const base: Treatment = { age, era, speed: 1 };
  if (recipe.rank === "treasure" || era <= 0) return base;
  switch (age) {
    case 0:
      if (step === 1) return { ...base, post: echo };
      if (step === 2) return { ...base, post: ash, embers: true };
      if (step === 3) return { ...base, post: voidHoles };
      return { ...base, post: astral };
    case 1: {
      const matter: MaterialId = step <= 1 ? "stone" : step === 2 ? "bone" : step === 3 ? "cave-stone" : "crystal";
      return { ...base, bias: -0.5, swap: (id) => (SOFT_MATERIALS.has(id) ? matter : id) };
    }
    case 2:
      return { ...base, post: hallowed };
    case 3:
      return { ...base, line: C.shard, post: starry };
    case 4:
      return { ...base, post: woven, flicker: true };
    case 5:
      return { ...base, steps: 2, post: sketched };
    case 6:
      return { ...base, post: worded };
    case 7:
      return { ...base, steps: 2, halfClosed: true, speed: 0.6 - step * 0.04, bias: -step * 0.15 };
    case 8:
      return { ...base, post: lamplit };
    case 9:
      return { ...base, post: drained(0.25 + step * 0.18) };
    case 10:
      return { ...base, post: blank };
    default: {
      const unit = 2 + step;
      return { ...base, unit, post: fewer(unit) };
    }
  }
}
