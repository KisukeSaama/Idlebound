/**
 * Pixel effects, snapped to the world grid (BIBLE 18.5 and 18.8): particles (a monster
 * coming apart into gold motes, gathering from the dark, embers, the scene's fireflies) and
 * companion shots (a pixel head with a 3-step trail in the companion's ramp, then a burst:
 * a 5 px cross flare, a ring of 8 pixels, sparks thrown back). Everything draws with
 * integer `fillRect` on the logical canvas; seeded, never Math.random.
 */
import type { StrikeStyle } from "@idlebound/game";
import { seededRng, type Rng } from "@idlebound/game";
import { C, RAMPS, rampFor, type Pal } from "@idlebound/game/art";
import { EMPTY, type Pixels } from "./pixels";
import { css } from "./sprites";

type Ctx = CanvasRenderingContext2D;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Gravity or lift, pixels per second squared. */
  ay: number;
  color: string;
  born: number;
  life: number;
  /** After this many seconds the particle turns into `late` and flies to the target. */
  turn?: number;
  late?: string;
  tx?: number;
  ty?: number;
  /** Fades out over its life (spawn particles do not). */
  fade: boolean;
  /** The gathering it belongs to, so a monster struck down while gathering can end it. */
  group?: number;
}

export class Particles {
  private list: Particle[] = [];
  private rng: Rng;

  constructor(seed = 1) {
    this.rng = seededRng(seed);
  }

  get active(): boolean {
    return this.list.length > 0;
  }

  random(): number {
    return this.rng();
  }

  add(particle: Particle) {
    if (this.list.length < 1400) this.list.push(particle);
  }

  clear() {
    this.list = [];
  }

  /** Ends a gathering at once: its pixels are already where they were heading. */
  dismiss(group: number) {
    this.list = this.list.filter((particle) => particle.group !== group);
  }

  /**
   * A sprite comes apart into its own pixels, which drift up, then turn into gold motes that
   * fly to the gold counter. Guardians shed some violet pixels too.
   */
  scatter(pixels: Pixels, left: number, top: number, now: number, target: { x: number; y: number }, violet: boolean) {
    const step = pixels.w * pixels.h > 5000 ? 2 : 1;
    for (let y = 0; y < pixels.h; y += step) {
      for (let x = 0; x < pixels.w; x += step) {
        const at = y * pixels.w + x;
        if (pixels.idx[at] === EMPTY || pixels.alpha[at] < 100) continue;
        const r = this.rng();
        this.add({
          x: left + x,
          y: top + y,
          vx: (this.rng() - 0.5) * 30,
          vy: -12 - this.rng() * 36,
          ay: -10,
          color: css(pixels.idx[at]),
          born: now,
          life: 0.9 + this.rng() * 0.5,
          turn: 0.28 + this.rng() * 0.25,
          late: violet && r < 0.18 ? css(C.essenceBright) : css(r < 0.5 ? C.gold : C.goldLight),
          tx: target.x + (this.rng() - 0.5) * 6,
          ty: target.y,
          fade: true
        });
      }
    }
  }

  /** The reverse: pixels gather from the dark into the silhouette, under `group`. */
  gather(pixels: Pixels, left: number, top: number, now: number, duration: number, group: number) {
    const step = pixels.w * pixels.h > 5000 ? 2 : 1;
    for (let y = 0; y < pixels.h; y += step) {
      for (let x = 0; x < pixels.w; x += step) {
        const at = y * pixels.w + x;
        if (pixels.idx[at] === EMPTY || pixels.alpha[at] < 100) continue;
        const angle = this.rng() * 6.283;
        const distance = 10 + this.rng() * 26;
        const fx = left + x + Math.cos(angle) * distance;
        const fy = top + y + Math.sin(angle) * distance;
        this.add({
          x: fx,
          y: fy,
          vx: (left + x - fx) / duration,
          vy: (top + y - fy) / duration,
          ay: 0,
          color: css(pixels.idx[at]),
          born: now,
          life: duration,
          fade: false,
          group
        });
      }
    }
  }

  /** Embers rising from a sprite's upper edge (the Ash stratum). */
  ember(x: number, y: number, now: number) {
    this.add({ x, y, vx: (this.rng() - 0.5) * 6, vy: -14 - this.rng() * 10, ay: 0, color: css(this.rng() < 0.5 ? C.ember : C.amber), born: now, life: 1.2, fade: true });
  }

  /** Sparks of an impact, thrown back the way the shot came. */
  sparks(x: number, y: number, angle: number, spread: number, count: number, color: string, now: number) {
    for (let index = 0; index < count; index += 1) {
      const a = angle + (this.rng() - 0.5) * spread;
      const speed = 40 + this.rng() * 70;
      this.add({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, ay: 160, color: index % 3 === 0 ? css(C.moon) : color, born: now, life: 0.2 + this.rng() * 0.2, fade: true });
    }
  }

  draw(ctx: Ctx, now: number) {
    let write = 0;
    for (const p of this.list) {
      const age = now - p.born;
      if (age >= p.life) continue;
      this.list[write++] = p;
      let x: number;
      let y: number;
      let color = p.color;
      if (p.turn !== undefined && age > p.turn && p.tx !== undefined && p.ty !== undefined) {
        // Second phase: a gold mote easing toward the counter.
        const sx = p.x + p.vx * p.turn;
        const sy = p.y + p.vy * p.turn + 0.5 * p.ay * p.turn * p.turn;
        const k = Math.min(1, (age - p.turn) / (p.life - p.turn));
        const e = k * k;
        x = sx + (p.tx - sx) * e;
        y = sy + (p.ty - sy) * e;
        color = p.late ?? color;
      } else {
        x = p.x + p.vx * age;
        y = p.y + p.vy * age + 0.5 * p.ay * age * age;
      }
      // No fading: a mote is fully there, then gone (its last moments blink out).
      if (p.fade && age / p.life > 0.75 && Math.floor(age * 30) % 2 === 0) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
    this.list.length = write;
  }
}

// ---------------------------------------------------------------- ambient lights

export interface Mote {
  x: number;
  y: number;
  phase: number;
  speed: number;
}

/** Fireflies, wisps, runes and embers wandering over the scene. */
export function drawMotes(ctx: Ctx, motes: Mote[], kind: string, color: Pal, t: number, width: number, reduced: boolean) {
  const main = css(color);
  for (const mote of motes) {
    const time = reduced ? 0 : t;
    const x = Math.round((((mote.x + Math.sin(time * mote.speed + mote.phase) * 8 + time * (kind === "wisp" ? 2 : 0)) % width) + width) % width);
    const y = Math.round(mote.y + Math.cos(time * mote.speed * 1.3 + mote.phase) * (kind === "ember" ? 0 : 4) - (kind === "ember" ? (time * 6 + mote.phase * 10) % 40 : 0));
    // Lights blink on and off: whole pixels, never half-transparent.
    const on = kind === "rune" ? Math.sin(time * 2 + mote.phase) > -0.4 : kind === "firefly" ? Math.sin(time * 3 + mote.phase * 5) > -0.3 : true;
    if (!on) continue;
    ctx.fillStyle = main;
    ctx.fillRect(x, y, 1, 1);
  }
}

// ---------------------------------------------------------------- shots

interface Flight {
  flight: number;
  impact: number;
  arc: number;
  head: number;
  wobble: number;
}

/** One look per family of companion: arrows fast and flat, heavy blows lobbed, spells wobbling. */
const FLIGHTS: Record<StrikeStyle, Flight> = {
  arrow: { flight: 0.17, impact: 0.26, arc: 0.06, head: 1, wobble: 0 },
  blade: { flight: 0.22, impact: 0.28, arc: 0.16, head: 2, wobble: 0 },
  claw: { flight: 0.22, impact: 0.28, arc: 0.12, head: 2, wobble: 0 },
  blunt: { flight: 0.3, impact: 0.34, arc: 0.34, head: 3, wobble: 0 },
  magic: { flight: 0.3, impact: 0.34, arc: 0.22, head: 2, wobble: 4 }
};

export interface Shot {
  style: StrikeStyle;
  /** Companion ramp, darkest first, as CSS colors. */
  ramp: string[];
  /** Palette color the monster flashes when the shot lands. */
  tint: Pal;
  start: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  landed: boolean;
}

export const shotDuration = (style: StrikeStyle) => FLIGHTS[style].flight + FLIGHTS[style].impact;

export function companionRamp(color: string): string[] {
  return RAMPS[rampFor(color)].map((pal) => css(pal));
}

function pathPoint(shot: Shot, p: number) {
  const flight = FLIGHTS[shot.style];
  const dx = shot.toX - shot.fromX;
  const dy = shot.toY - shot.fromY;
  const distance = Math.hypot(dx, dy) || 1;
  const cx = shot.fromX + dx / 2;
  const cy = shot.fromY + dy / 2 - distance * flight.arc * 2;
  const q = 1 - p;
  let x = q * q * shot.fromX + 2 * q * p * cx + p * p * shot.toX;
  let y = q * q * shot.fromY + 2 * q * p * cy + p * p * shot.toY;
  if (flight.wobble) {
    const side = Math.sin(p * Math.PI * 3) * flight.wobble * Math.sin(Math.PI * p);
    x += (-dy / distance) * side;
    y += (dx / distance) * side;
  }
  return { x: Math.round(x), y: Math.round(y) };
}

function square(ctx: Ctx, x: number, y: number, size: number, color: string) {
  const half = size >> 1;
  ctx.fillStyle = color;
  ctx.fillRect(x - half, y - half, size, size);
}

/** Draws a shot `t` seconds after launch; returns true on the frame it lands. */
export function drawShot(ctx: Ctx, shot: Shot, t: number): boolean {
  const flight = FLIGHTS[shot.style];
  const ramp = shot.ramp;
  const light = ramp[ramp.length - 1];
  if (t < flight.flight) {
    const p = t / flight.flight;
    // Trail: three earlier positions, each a step darker along the ramp.
    for (let step = 3; step >= 1; step -= 1) {
      const back = pathPoint(shot, Math.max(0, p - step * 0.07));
      square(ctx, back.x, back.y, Math.max(1, flight.head - (step > 1 ? 1 : 0)), ramp[Math.max(0, ramp.length - 1 - step)]);
    }
    const head = pathPoint(shot, p);
    square(ctx, head.x, head.y, flight.head + (shot.style === "blunt" ? 0 : 1), light);
    square(ctx, head.x, head.y, 1, css(C.moon));
    if (shot.style === "magic" && Math.floor(t * 30) % 2 === 0) {
      const back = pathPoint(shot, Math.max(0, p - 0.18));
      ctx.fillStyle = light;
      ctx.fillRect(back.x - 2, back.y, 5, 1);
      ctx.fillRect(back.x, back.y - 2, 1, 5);
    }
    return false;
  }
  const since = t - flight.flight;
  const k = Math.min(1, since / flight.impact);
  const x = Math.round(shot.toX);
  const y = Math.round(shot.toY);
  if (since < 0.1) {
    // Cross flare: 5 px arms (7 for heavy blows), white at the heart.
    const arm = shot.style === "blunt" ? 3 : 2;
    ctx.fillStyle = light;
    ctx.fillRect(x - arm, y, arm * 2 + 1, 1);
    ctx.fillRect(x, y - arm, 1, arm * 2 + 1);
    square(ctx, x, y, 1, css(C.moon));
  }
  // Ring of eight pixels, widening and cooling.
  const radius = Math.round(2 + k * (shot.style === "blunt" ? 8 : 5));
  const color = ramp[Math.max(0, Math.round((1 - k) * (ramp.length - 1)))];
  ctx.fillStyle = color;
  const diagonal = Math.round(radius * 0.7);
  for (const [dx, dy] of [[radius, 0], [-radius, 0], [0, radius], [0, -radius], [diagonal, diagonal], [-diagonal, diagonal], [diagonal, -diagonal], [-diagonal, -diagonal]] as const) {
    ctx.fillRect(x + dx, y + dy, 1, 1);
  }
  if (!shot.landed) {
    shot.landed = true;
    return true;
  }
  return false;
}

/** Direction the sparks of a landed shot fly: back toward where it came from. */
export function shotBackAngle(shot: Shot): number {
  const end = pathPoint(shot, 1);
  const before = pathPoint(shot, 0.9);
  return Math.atan2(before.y - end.y, before.x - end.x);
}
