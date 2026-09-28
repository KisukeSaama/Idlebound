/**
 * How a creature is set into the scene it stands in (BIBLE 18.7): its darkest shadows lean
 * toward the night's blue, its midtones take a little of the scene's air (the plains'
 * violet, the forest's teal, the mire's green), the moon draws a thin rim on the side
 * facing it, and the place's own light (a lantern, a brazier, crystals) catches its other
 * edge low down. Its lights keep their colors: the creature stays the most readable thing
 * in the scene. Only colors already in the scene or in the creature are used: grading
 * never widens the palette. Its shadow is its own silhouette laid on the ground, away
 * from the moon.
 */
import { C, palLuma, palRgb, type Pal } from "@idlebound/game/art";
import { clonePixels, createPixels, EMPTY, setPixel, type Pixels } from "./pixels";

export interface NightGrade {
  /** Colors of the scene: what the creature's colors may lean toward. */
  colors: readonly Pal[];
  /** The moon's rim, and the side the moon is on (-1 left, 1 right). */
  rim: Pal;
  side: number;
  /** The scene's air, which the midtones lean toward. */
  ambient: Pal;
  /** The place's own light, on the edge away from the moon. */
  glow: Pal;
}

/** The blue the shadows lean toward, and how far. */
const NIGHT_BLUE = [34, 44, 96] as const;
const SHADOW_LEAN = 0.35;
/** How far midtones lean toward the scene's air. */
const AIR_LEAN = 0.28;
/** Shadows: colors this dark at most, and within a step of the creature's darkest. */
const SHADOW_LUMA = 60;
const SHADOW_STEP = 12;
/** Lights: colors this light or more keep their own. */
const LIGHT_LUMA = 150;

/** Each color of a creature mapped to its graded counterpart. */
function gradeMap(used: ReadonlySet<Pal>, grade: NightGrade): Map<Pal, Pal> {
  const candidates = [...new Set([...grade.colors, ...used])].filter((pal) => pal !== C.ink);
  const map = new Map<Pal, Pal>();
  const darkest = Math.min(...[...used].filter((pal) => pal !== C.ink).map(palLuma));
  const air = palRgb(grade.ambient);
  for (const pal of used) {
    const luma = palLuma(pal);
    if (pal === C.ink || luma >= LIGHT_LUMA) continue;
    const shadow = luma < SHADOW_LUMA && luma <= darkest + SHADOW_STEP;
    const [toward, lean] = shadow ? [NIGHT_BLUE, SHADOW_LEAN] : [air, AIR_LEAN];
    const [r, g, b] = palRgb(pal);
    const target = [r + (toward[0] - r) * lean, g + (toward[1] - g) * lean, b + (toward[2] - b) * lean];
    let best = pal;
    let bestDistance = distance(palRgb(pal), target);
    for (const candidate of candidates) {
      // Never lighter, never much darker: a color keeps its place in the creature's ramp.
      const other = palLuma(candidate);
      if (other > luma + 6 || other < luma - 22) continue;
      const d = distance(palRgb(candidate), target);
      if (d < bestDistance) {
        best = candidate;
        bestDistance = d;
      }
    }
    map.set(pal, best);
  }
  return map;
}

function distance([r, g, b]: readonly number[], target: readonly number[]): number {
  return (r - target[0]) ** 2 + (g - target[1]) ** 2 + (b - target[2]) ** 2;
}

/** A creature's pixels graded for the scene: shadows, air, the moon's rim, the place's light. Pure. */
export function gradeForNight(source: Pixels, grade: NightGrade): Pixels {
  const out = clonePixels(source);
  const { w, h } = source;
  const used = new Set<Pal>();
  let top = h;
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    top = Math.min(top, Math.floor(at / w));
    if (!source.emit[at]) used.add(source.idx[at]);
  }
  const colors = gradeMap(used, grade);
  const pal = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? EMPTY : source.idx[y * w + x]);
  // Outside the silhouette: empty, or the ink outline with nothing beyond it.
  const outside = (x: number, y: number, dx: number, dy: number) => {
    const next = pal(x + dx, y + dy);
    return next === EMPTY || (next === C.ink && pal(x + 2 * dx, y + 2 * dy) === EMPTY);
  };
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      const here = source.idx[at];
      if (here === EMPTY || source.emit[at] || here === C.ink) continue;
      // The lit side, and the top only on the moon's half: a thin rim, not a cap.
      const moonHalf = grade.side > 0 ? x >= w * 0.4 : x < w * 0.6;
      // The place's light from the other side, on the lower half, every other row: a glint.
      const low = y > top + (h - top) * 0.5;
      if (outside(x, y, grade.side, 0) || (moonHalf && outside(x, y, 0, -1))) out.idx[at] = grade.rim;
      else if (low && y % 2 === 0 && outside(x, y, -grade.side, 0) && palLuma(here) < LIGHT_LUMA) out.idx[at] = grade.glow;
      else out.idx[at] = colors.get(here) ?? here;
    }
  }
  return out;
}

/** A shadow laid on the ground, and where its top left sits relative to the sprite's. */
export interface CastShadow {
  pixels: Pixels;
  dx: number;
  dy: number;
}

/**
 * A creature's shadow: its own silhouette laid flat on the ground from its feet, leaning
 * away from the moon (`side`, -1 left or 1 right) and toward the walker, solid near the
 * feet and thinning to a regular checker as it reaches away. Pure.
 */
export function castShadow(source: Pixels, feet: number, side: number, color: Pal): CastShadow {
  const { w, h } = source;
  const reachX = Math.ceil(h * 0.6);
  const reachY = Math.ceil(h * 0.08) + 4;
  const out = createPixels(w + reachX * 2, reachY + 3);
  const left = reachX;
  let top = feet;
  for (let at = 0; at < source.idx.length; at += 1) if (source.idx[at] !== EMPTY) top = Math.min(top, Math.floor(at / w));
  const tall = Math.max(1, feet - top);
  // The silhouette laid down: each row slides away from the moon as it rises, and toward the walker a little.
  for (let y = top; y <= feet; y += 1) {
    const height = feet - y;
    const far = height / tall;
    for (let x = 0; x < w; x += 1) {
      if (source.idx[y * w + x] === EMPTY) continue;
      const sx = Math.round(x + left - side * height * 0.42);
      const sy = Math.round(2 + height * 0.07);
      // The far reach of the shadow is a checker: it thins out, it does not end on an edge.
      if (far > 0.35 && (sx + sy) % 2 !== 0) continue;
      setPixel(out, sx, sy, color);
    }
  }
  // Where it stands, the ground is darkest: a solid oval under the width of its lowest quarter.
  let minX = w;
  let maxX = -1;
  for (let y = feet - Math.ceil(tall / 4); y <= feet; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (y < 0 || source.idx[y * w + x] === EMPTY) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
  }
  if (maxX >= 0) {
    const cx = (minX + maxX) / 2 + left - side * 2;
    const rx = (maxX - minX) / 2 + 3;
    for (let y = 0; y <= 4; y += 1) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) if (((x + 0.5 - cx) / rx) ** 2 + ((y - 2) / 2.5) ** 2 <= 1) setPixel(out, x, y, color);
    }
  }
  return { pixels: out, dx: -left, dy: feet - 2 };
}
