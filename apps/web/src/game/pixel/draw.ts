/**
 * Drawing helpers shared by the scene's layers: flat shapes, true pixel circles, the moon's
 * rim light, and hand-drawn stamps. Plain arithmetic only: the same pixels on every engine.
 */
import type { Pal, SceneRecipe, Shape } from "@idlebound/game/art";
import { EMPTY, setPixel, type Pixels } from "./pixels";

/**
 * Every other pixel of a true pixel circle of radius `r` around (0, 0), traced by the
 * midpoint algorithm in whole numbers: the same pixels on every engine, symmetric in all
 * eight octants.
 */
export function dottedCircle(r: number): [number, number][] {
  const points: [number, number][] = [];
  for (let x = r, y = 0, err = 1 - r, step = 0; x >= y; y += 1, step += 1) {
    if (step % 2 === 0) {
      for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) points.push([a, b]);
    }
    if (err < 0) err += 2 * y + 3;
    else {
      err += 2 * (y - x) + 5;
      x -= 1;
    }
  }
  return points;
}

/** A sine from turns, by parabolas: plain arithmetic, the same on every engine. */
export function sine(turns: number): number {
  const f = turns - Math.floor(turns);
  return f < 0.5 ? 16 * f * (0.5 - f) : -16 * (f - 0.5) * (1 - f);
}

// ------------------------------------------------------------------ shapes, filled flat

/** Whether a pixel center lies inside a shape (in the shape's own units). */
export function inside(shape: Shape, x: number, y: number): boolean {
  if ("e" in shape) {
    const [cx, cy, rx, ry] = shape.e;
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  }
  if ("r" in shape) {
    const [rx, ry, w, h] = shape.r;
    return x >= rx && x < rx + w && y >= ry && y < ry + h;
  }
  if ("c" in shape) {
    const [x1, y1, x2, y2, r1, r2] = shape.c;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const k = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
    const ex = x - (x1 + dx * k);
    const ey = y - (y1 + dy * k);
    const r = r1 + (r2 - r1) * k;
    return ex * ex + ey * ey <= r * r;
  }
  const points = shape.p;
  let hit = false;
  for (let i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
    const xi = points[i];
    const yi = points[i + 1];
    const xj = points[j];
    const yj = points[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/**
 * Shapes drawn flat at (left, top), `scale` pixels per unit: carved shapes cut, light shapes
 * take the glow color, everything else the body color. No shading, no texture.
 */
export function fillShapes(target: Pixels, shapes: readonly Shape[], left: number, top: number, scale: number, body: Pal, glow: Pal) {
  for (let y = 0; y < Math.ceil(64 * scale); y += 1) {
    for (let x = 0; x < Math.ceil(64 * scale); x += 1) {
      const u = (x + 0.5) / scale;
      const v = (y + 0.5) / scale;
      let color: Pal | null = null;
      let emit = 0;
      for (const shape of shapes) {
        if (!inside(shape, u, v) && !(shape.mirror && inside(shape, 64 - u, v))) continue;
        if (shape.cut) {
          color = null;
          continue;
        }
        color = shape.glow ? glow : body;
        emit = shape.glow ? 1 : 0;
      }
      if (color !== null) setPixel(target, left + x, top + y, color, 255, emit);
    }
  }
}

/**
 * Moonlight on the top of a shape: the first drawn pixel of every column takes the rim
 * color, and with a side (`dx`, -1 or 1) the edges turned toward the moon do too.
 */
export function moonlit(target: Pixels, rim: Pal, dx: number, lit: (at: number) => boolean = () => true) {
  const drawn = (x: number, y: number) => x >= 0 && y >= 0 && x < target.w && y < target.h && target.idx[y * target.w + x] !== EMPTY;
  const marks: number[] = [];
  for (let y = 0; y < target.h; y += 1) {
    for (let x = 0; x < target.w; x += 1) {
      const at = y * target.w + x;
      if (!drawn(x, y) || target.emit[at] || !lit(at)) continue;
      // A top edge, except the steps of a slope turned away from the moon.
      const top = !drawn(x, y - 1) && (dx === 0 || drawn(x - dx, y));
      // A side edge, only where the shape is at least two pixels thick (thin lines stay dark).
      const side = dx !== 0 && !drawn(x + dx, y) && drawn(x - dx, y);
      if (top || side) marks.push(at);
    }
  }
  for (const at of marks) target.idx[at] = rim;
}

/** Side the moon lights a thing at `x` from: -1 (left) or 1 (right). */
export function towardMoon(recipe: SceneRecipe, x: number): number {
  return recipe.source.x < x ? -1 : 1;
}

/** A stamp with its bottom middle on (x, y); mirrored on demand. */
export function stamp(target: Pixels, rows: readonly string[], x: number, y: number, a: Pal, b: Pal, extra: Partial<Record<"c" | "s" | "d", Pal>> = {}, mirror = false) {
  const w = rows[0].length;
  const left = x - Math.floor(w / 2);
  const top = y - rows.length + 1;
  rows.forEach((row, dy) => {
    for (let dx = 0; dx < w; dx += 1) {
      const key = row[mirror ? w - 1 - dx : dx];
      const color = key === "a" ? a : key === "b" ? b : key === "c" || key === "s" || key === "d" ? extra[key] : undefined;
      if (color === undefined) continue;
      const px = ((left + dx) % target.w + target.w) % target.w;
      setPixel(target, px, top + dy, color);
    }
  });
}
