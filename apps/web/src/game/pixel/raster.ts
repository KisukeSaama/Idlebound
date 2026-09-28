/**
 * Shapes to pixels. Each shape is tested at every pixel center of its bounding box, in the
 * 64-unit design space, and leaves behind the surface normal at that pixel: ellipses and
 * capsules are rounded volumes (analytic normals), polygons are flat plates with a bevel.
 * The topmost shape owns the pixel; cuts clear what was drawn before them.
 */
import type { Shape } from "@idlebound/game/art";

export const DESIGN = 64;

/** A shape resolved to absolute design units, with its drawing order and origin. */
export interface Placed {
  shape: Shape;
  /** Drawing layer: 0 behind the body, 1 the body, 2 in front. */
  layer: number;
}

export interface Raster {
  size: number;
  /** Index into the placed list, -1 when empty. */
  owner: Int16Array;
  /** Surface normal per pixel (x right, y down, z toward the viewer). */
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
}

const BEVEL = 2.4;

interface Hit {
  nx: number;
  ny: number;
  nz: number;
}

function hitEllipse(u: number, v: number, [cx, cy, rx, ry]: readonly number[]): Hit | null {
  const dx = (u - cx) / rx;
  const dy = (v - cy) / ry;
  const q = dx * dx + dy * dy;
  if (q > 1) return null;
  return { nx: dx, ny: dy, nz: Math.sqrt(1 - q) };
}

function hitCapsule(u: number, v: number, [x1, y1, x2, y2, r1, r2]: readonly number[]): Hit | null {
  const ex = x2 - x1;
  const ey = y2 - y1;
  const length = ex * ex + ey * ey;
  let t = length > 0 ? ((u - x1) * ex + (v - y1) * ey) / length : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const px = x1 + ex * t;
  const py = y1 + ey * t;
  const radius = r1 + (r2 - r1) * t;
  const ddx = u - px;
  const ddy = v - py;
  const distance = Math.sqrt(ddx * ddx + ddy * ddy);
  if (radius <= 0 || distance > radius) return null;
  const q = distance / radius;
  return { nx: ddx / radius, ny: ddy / radius, nz: Math.sqrt(1 - q * q) };
}

function hitPoly(u: number, v: number, points: readonly number[]): Hit | null {
  let inside = false;
  const count = points.length / 2;
  let area = 0;
  for (let i = 0, j = count - 1; i < count; j = i, i += 1) {
    const xi = points[i * 2];
    const yi = points[i * 2 + 1];
    const xj = points[j * 2];
    const yj = points[j * 2 + 1];
    area += (xj - xi) * (yj + yi);
    if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
  }
  if (!inside) return null;
  // Nearest edge: a bevel along it catches the light like a cut plate.
  let best = Infinity;
  let bx = 0;
  let by = 0;
  const clockwise = area > 0;
  for (let i = 0, j = count - 1; i < count; j = i, i += 1) {
    const ax = points[j * 2];
    const ay = points[j * 2 + 1];
    const ex = points[i * 2] - ax;
    const ey = points[i * 2 + 1] - ay;
    const length = ex * ex + ey * ey;
    if (length === 0) continue;
    let t = ((u - ax) * ex + (v - ay) * ey) / length;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ddx = u - (ax + ex * t);
    const ddy = v - (ay + ey * t);
    const distance = Math.sqrt(ddx * ddx + ddy * ddy);
    if (distance < best) {
      best = distance;
      const norm = Math.sqrt(length);
      // Outward normal of the edge, whatever the winding.
      bx = (clockwise ? -ey : ey) / norm;
      by = (clockwise ? ex : -ex) / norm;
    }
  }
  const edge = best < BEVEL ? 1 - best / BEVEL : 0;
  const tilt = 0.75 * edge;
  return { nx: bx * tilt, ny: by * tilt, nz: Math.sqrt(1 - tilt * tilt) };
}

function rectPoints([x, y, w, h]: readonly number[]): number[] {
  return [x, y, x + w, y, x + w, y + h, x, y + h];
}

/** The shape moved by (dx, dy) and, if asked, mirrored around the center line. */
export function moveShape(shape: Shape, dx: number, dy: number, mirror: boolean): Shape {
  const fx = (x: number) => (mirror ? DESIGN - (x + dx) : x + dx);
  if ("e" in shape) {
    const [cx, cy, rx, ry] = shape.e;
    return { ...shape, e: [fx(cx), cy + dy, rx, ry] };
  }
  if ("c" in shape) {
    const [x1, y1, x2, y2, r1, r2] = shape.c;
    return { ...shape, c: [fx(x1), y1 + dy, fx(x2), y2 + dy, r1, r2] };
  }
  const points = "p" in shape ? shape.p : rectPoints(shape.r);
  const moved: number[] = [];
  for (let i = 0; i < points.length; i += 2) moved.push(fx(points[i]), points[i + 1] + dy);
  const { r: _rect, p: _poly, ...flags } = shape as Shape & { r?: unknown; p?: unknown };
  return { ...flags, p: moved } as Shape;
}

/** Bounding box in design units. */
function box(shape: Shape): [number, number, number, number] {
  if ("e" in shape) {
    const [cx, cy, rx, ry] = shape.e;
    return [cx - rx, cy - ry, cx + rx, cy + ry];
  }
  if ("c" in shape) {
    const [x1, y1, x2, y2, r1, r2] = shape.c;
    const r = Math.max(r1, r2);
    return [Math.min(x1, x2) - r, Math.min(y1, y2) - r, Math.max(x1, x2) + r, Math.max(y1, y2) + r];
  }
  const points = "p" in shape ? shape.p : rectPoints(shape.r);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxY = Math.max(maxY, points[i + 1]);
  }
  return [minX, minY, maxX, maxY];
}

function hit(shape: Shape, u: number, v: number): Hit | null {
  if ("e" in shape) return hitEllipse(u, v, shape.e);
  if ("c" in shape) return hitCapsule(u, v, shape.c);
  return hitPoly(u, v, "p" in shape ? shape.p : rectPoints(shape.r));
}

/**
 * Rasterizes placed shapes (already moved) into a `size` × `size` grid. `stretch` scales
 * the whole drawing about the middle of the ground line.
 */
export function rasterize(placed: readonly Placed[], size: number, stretch: readonly [number, number] = [1, 1]): Raster {
  const cells = size * size;
  const raster: Raster = {
    size,
    owner: new Int16Array(cells).fill(-1),
    nx: new Float32Array(cells),
    ny: new Float32Array(cells),
    nz: new Float32Array(cells)
  };
  const scale = size / DESIGN;
  const [sx, sy] = stretch;
  const toU = (x: number) => DESIGN / 2 + ((x + 0.5) / scale - DESIGN / 2) / sx;
  const toV = (y: number) => 62 + ((y + 0.5) / scale - 62) / sy;
  const fromU = (u: number) => (DESIGN / 2 + (u - DESIGN / 2) * sx) * scale;
  const fromV = (v: number) => (62 + (v - 62) * sy) * scale;

  placed.forEach((item, index) => {
    const shape = item.shape;
    const [minU, minV, maxU, maxV] = box(shape);
    const x0 = Math.max(0, Math.floor(fromU(minU)) - 1);
    const x1 = Math.min(size - 1, Math.ceil(fromU(maxU)) + 1);
    const y0 = Math.max(0, Math.floor(fromV(minV)) - 1);
    const y1 = Math.min(size - 1, Math.ceil(fromV(maxV)) + 1);
    for (let y = y0; y <= y1; y += 1) {
      const v = toV(y);
      for (let x = x0; x <= x1; x += 1) {
        const found = hit(shape, toU(x), v);
        if (!found) continue;
        const at = y * size + x;
        if (shape.cut) {
          raster.owner[at] = -1;
          continue;
        }
        raster.owner[at] = index;
        raster.nx[at] = found.nx;
        raster.ny[at] = found.ny;
        raster.nz[at] = found.nz;
      }
    }
  });
  return raster;
}
