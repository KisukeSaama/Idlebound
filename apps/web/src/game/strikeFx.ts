/**
 * Companion hits as shots: a glowing comet in the companion's color leaves its medallion in
 * the scene's party, arcs to the monster and bursts on impact. One look per family of
 * companion (arrow, blade, claw, heavy blow, spell) through its speed, arc and impact.
 *
 * Everything is drawn on one canvas over the arena with additive blending ("lighter"), so
 * shots read as light over the painted scene. `drawShot` is a pure function of time.
 */
import type { StrikeStyle } from "@idlebound/game";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Flight {
  /** Seconds from the medallion to the monster. */
  flight: number;
  /** Seconds the impact lasts after arrival. */
  impact: number;
  /** Height of the arc, as a share of the distance. */
  arc: number;
  /** Radius of the comet's head, in CSS pixels. */
  head: number;
  /** Length of the tail, as a share of the path. */
  tail: number;
  /** Sideways wobble of the path (spells), in CSS pixels. */
  wobble: number;
}

const FLIGHTS: Record<StrikeStyle, Flight> = {
  arrow: { flight: 0.17, impact: 0.28, arc: 0.06, head: 6, tail: 0.6, wobble: 0 },
  blade: { flight: 0.22, impact: 0.3, arc: 0.16, head: 9, tail: 0.45, wobble: 0 },
  claw: { flight: 0.22, impact: 0.3, arc: 0.12, head: 9, tail: 0.45, wobble: 0 },
  blunt: { flight: 0.3, impact: 0.36, arc: 0.34, head: 12, tail: 0.35, wobble: 0 },
  magic: { flight: 0.3, impact: 0.36, arc: 0.22, head: 11, tail: 0.5, wobble: 12 }
};

export interface Shot {
  style: StrikeStyle;
  color: string;
  seed: number;
  /** Launch time, performance.now() milliseconds. */
  start: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  /** Size factor of the effect, from the arena's size (1 on a desktop scene). */
  scale: number;
}

/** Seconds from launch to impact. */
export const shotFlight = (style: StrikeStyle) => FLIGHTS[style].flight;
/** Seconds from launch to the end of the impact. */
export const shotDuration = (style: StrikeStyle) => FLIGHTS[style].flight + FLIGHTS[style].impact;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);
const easeInOutSine = (value: number) => -(Math.cos(Math.PI * clamp01(value)) - 1) / 2;
const WHITE: Rgb = { r: 255, g: 255, b: 255 };

export function parseColor(hex: string): Rgb {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw.slice(0, 6);
  const value = Number.parseInt(full, 16);
  if (!Number.isFinite(value)) return WHITE;
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

const tint = (color: Rgb, white: number): Rgb => ({
  r: Math.round(color.r + (255 - color.r) * white),
  g: Math.round(color.g + (255 - color.g) * white),
  b: Math.round(color.b + (255 - color.b) * white)
});
const rgba = (color: Rgb, alpha: number) => `rgba(${color.r},${color.g},${color.b},${clamp01(alpha).toFixed(3)})`;

/** Deterministic random numbers (mulberry32), so a shot looks the same at every frame. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft round glow: white core, companion color, transparent edge. */
function glow(ctx: CanvasRenderingContext2D, color: Rgb, x: number, y: number, radius: number, alpha: number) {
  if (alpha <= 0 || radius <= 0) return;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, rgba(WHITE, alpha));
  gradient.addColorStop(0.22, rgba(tint(color, 0.55), alpha * 0.95));
  gradient.addColorStop(0.55, rgba(color, alpha * 0.4));
  gradient.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Four-point sparkle. */
function sparkle(ctx: CanvasRenderingContext2D, color: Rgb, x: number, y: number, size: number, alpha: number) {
  if (alpha <= 0 || size <= 0) return;
  const waist = size * 0.16;
  ctx.fillStyle = rgba(tint(color, 0.75), alpha);
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + waist, y - waist, x + size, y);
  ctx.quadraticCurveTo(x + waist, y + waist, x, y + size);
  ctx.quadraticCurveTo(x - waist, y + waist, x - size, y);
  ctx.quadraticCurveTo(x - waist, y - waist, x, y - size);
  ctx.fill();
}

/**
 * A tapered band along `point(u)` (u from 0 at the tail to 1 at the head): nothing at the
 * tail, `width` at the head, colored from transparent to the companion color to white.
 */
function comet(ctx: CanvasRenderingContext2D, color: Rgb, point: (u: number) => { x: number; y: number }, width: number, alpha: number) {
  const samples = 20;
  const left: { x: number; y: number }[] = [];
  const right: { x: number; y: number }[] = [];
  for (let index = 0; index <= samples; index += 1) {
    const u = index / samples;
    const p = point(u);
    const a = point(Math.max(0, u - 0.02));
    const b = point(Math.min(1, u + 0.02));
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / length;
    const ny = (b.x - a.x) / length;
    const w = (width / 2) * Math.pow(u, 1.3);
    left.push({ x: p.x + nx * w, y: p.y + ny * w });
    right.push({ x: p.x - nx * w, y: p.y - ny * w });
  }
  const tail = point(0);
  const head = point(1);
  const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
  gradient.addColorStop(0, rgba(color, 0));
  gradient.addColorStop(0.55, rgba(color, alpha * 0.7));
  gradient.addColorStop(0.9, rgba(tint(color, 0.6), alpha));
  gradient.addColorStop(1, rgba(WHITE, alpha));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (const p of left) ctx.lineTo(p.x, p.y);
  for (let index = right.length - 1; index >= 0; index -= 1) ctx.lineTo(right[index].x, right[index].y);
  ctx.closePath();
  ctx.fill();
}

/** Point of the flight path at progress p (quadratic arc, plus a wobble for spells). */
function pathPoint(shot: Shot, flight: Flight, p: number, wobblePhase: number) {
  const dx = shot.toX - shot.fromX;
  const dy = shot.toY - shot.fromY;
  const distance = Math.hypot(dx, dy) || 1;
  // Control point above the middle of the segment: the shot arcs up, then falls on the target.
  const cx = shot.fromX + dx / 2;
  const cy = shot.fromY + dy / 2 - distance * flight.arc * 2;
  const q = 1 - p;
  let x = q * q * shot.fromX + 2 * q * p * cx + p * p * shot.toX;
  let y = q * q * shot.fromY + 2 * q * p * cy + p * p * shot.toY;
  if (flight.wobble > 0) {
    const side = Math.sin(p * Math.PI * 3 + wobblePhase) * flight.wobble * Math.sin(Math.PI * p);
    x += (-dy / distance) * side;
    y += (dx / distance) * side;
  }
  return { x, y };
}

/** Draws a shot `t` seconds after its launch, in CSS pixel coordinates. */
export function drawShot(ctx: CanvasRenderingContext2D, shot: Shot, t: number) {
  const flight = FLIGHTS[shot.style];
  const color = parseColor(shot.color);
  const rand = random(shot.seed);
  const wobblePhase = rand() * Math.PI * 2;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  // ---- launch: a short flash on the medallion
  glow(ctx, color, shot.fromX, shot.fromY, 34 * shot.scale, 0.8 * (1 - clamp01(t / 0.12)));

  // ---- flight: a comet, one continuous tapered tail with a bloom, and a bright head
  if (t < flight.flight) {
    const p = easeInOutSine(t / flight.flight);
    const tailStart = Math.max(0, p - flight.tail);
    const head = pathPoint(shot, flight, p, wobblePhase);
    const width = flight.head * shot.scale;
    const along = (u: number) => pathPoint(shot, flight, tailStart + (p - tailStart) * u, wobblePhase);
    comet(ctx, color, along, width * 2.6, 0.22);
    comet(ctx, color, along, width, 1);
    glow(ctx, color, head.x, head.y, width * 3.2, 1);
    glow(ctx, WHITE, head.x, head.y, width * 0.9, 1);
    if (shot.style === "magic") {
      for (let index = 0; index < 3; index += 1) {
        const back = pathPoint(shot, flight, Math.max(0, p - 0.12 - index * 0.1), wobblePhase);
        const jitter = 14 * shot.scale;
        sparkle(ctx, color, back.x + (rand() - 0.5) * jitter, back.y + (rand() - 0.5) * jitter, (7 - index * 1.5) * shot.scale, 0.9 - index * 0.2);
      }
    }
    ctx.restore();
    return;
  }

  // ---- impact
  const since = t - flight.flight;
  const k = clamp01(since / flight.impact);
  const x = shot.toX;
  const y = shot.toY;
  const heavy = shot.style === "blunt";
  const scale = shot.scale;
  glow(ctx, color, x, y, ((heavy ? 64 : 48) + 22 * easeOutCubic(k * 3)) * scale, 1 - easeOutCubic(k * 1.4));
  // Cross flare: the punch of the hit, over in a tenth of a second.
  const flare = 1 - clamp01(since / 0.11);
  if (flare > 0) {
    const reach = (heavy ? 70 : 52) * scale * (0.6 + 0.4 * easeOutCubic(since / 0.05));
    for (const [dx, dy, length] of [[1, 0, reach], [0, 1, reach * 0.6]] as const) {
      const gradient = ctx.createLinearGradient(x - dx * length, y - dy * length, x + dx * length, y + dy * length);
      gradient.addColorStop(0, rgba(color, 0));
      gradient.addColorStop(0.5, rgba(WHITE, flare));
      gradient.addColorStop(1, rgba(color, 0));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.moveTo(x - dx * length, y - dy * length);
      ctx.lineTo(x + dx * length, y + dy * length);
      ctx.stroke();
    }
  }
  // Ring of the impact.
  const ring = easeOutCubic(k * 1.2);
  ctx.strokeStyle = rgba(tint(color, 0.35), (1 - ring) * (heavy ? 1 : 0.8));
  ctx.lineWidth = ((heavy ? 7 : 4) * (1 - ring) + 0.5) * scale;
  const ringRadius = (8 + (heavy ? 84 : 52) * ring) * scale;
  ctx.beginPath();
  ctx.ellipse(x, y, ringRadius, ringRadius * 0.7, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Sparks thrown back the way the shot came, cooling from white to the color.
  const end = pathPoint(shot, flight, 1, wobblePhase);
  const before = pathPoint(shot, flight, 0.93, wobblePhase);
  const back = Math.atan2(before.y - end.y, before.x - end.x);
  const count = heavy ? 12 : 9;
  for (let index = 0; index < count; index += 1) {
    const angle = back + (rand() - 0.5) * (heavy ? 3.4 : 2.2);
    const speed = (200 + rand() * 320) * scale;
    const life = 0.16 + rand() * 0.16;
    const age = since - rand() * 0.02;
    if (age <= 0 || age >= life) continue;
    const s = age / life;
    const at = (time: number) => ({
      x: x + Math.cos(angle) * speed * time,
      y: y + Math.sin(angle) * speed * time + 0.5 * 620 * scale * time * time
    });
    const headPoint = at(age);
    const tailPoint = at(Math.max(0, age - 0.03));
    ctx.strokeStyle = rgba(s < 0.35 ? WHITE : tint(color, 0.4 * (1 - s)), 1 - s * s);
    ctx.lineWidth = 2.8 * scale * (1 - s * 0.6);
    ctx.beginPath();
    ctx.moveTo(tailPoint.x, tailPoint.y);
    ctx.lineTo(headPoint.x, headPoint.y);
    ctx.stroke();
  }
  if (shot.style === "magic") {
    for (let index = 0; index < 4; index += 1) {
      const angle = rand() * Math.PI * 2;
      const distance = (22 + rand() * 36) * scale;
      const born = index * 0.05;
      const s = (since - born) / 0.14;
      if (s <= 0 || s >= 1) continue;
      sparkle(ctx, color, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 11 * scale * Math.sin(Math.PI * s), 1);
    }
  }
  ctx.restore();
}
