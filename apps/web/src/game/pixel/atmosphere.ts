/**
 * The air over the pixel world (DESIGN, "The atmosphere"): one canvas at the screen's own
 * resolution laid exactly over the scene's, the only place where the world is drawn smooth.
 * The pixels stay whole and crisp beneath; over them, light the way a lens sees it: the
 * scene's lights bloom in soft halos that breathe and flicker, still water reflects the whole
 * picture (the creature too) wavering line by line with the lights stretched into streaks,
 * and the edges of the view sink into the night ink.
 *
 * Nothing here decides anything: it reads the scene canvas and what the scene says of itself
 * (where its water is, where its lights are), and paints over it.
 */
import { SCENE_HEIGHT, SCENE_WIDTH, palRgb } from "@idlebound/game/art";
import { EMPTY, type Pixels } from "./pixels";
import type { Scene } from "./scene";
import { compositeLayers } from "./scene";

/** A light of the scene: where it stands on the scene's grid, how far it reaches, its color. */
export interface Glow {
  x: number;
  y: number;
  /** Reach, in pixels of the grid. */
  r: number;
  rgb: readonly [number, number, number];
  /** Fire flickers; a window, a crystal or the moon only breathes. */
  fire: boolean;
  /** How strong the halo is, 0 to 1. */
  strength: number;
  phase: number;
}

/** What the air needs to know of a scene, worked out once per scene. */
export interface AirScene {
  glows: Glow[];
  /** Still water, a mask of the scene's 320 x 180 grid (1 where water lies), and the row it starts under. */
  water: Uint8Array | null;
  horizon: number;
  ground: number;
}

/** Lights smaller than this many pixels are stars or sparks: they keep their own glint. */
const MIN_LIGHT = 3;
const VIGNETTE = 0.62;
const REFLECTION = 0.46;

const airs = new WeakMap<Scene, AirScene>();

/** What the air needs of a scene: its lights (every cluster of light-giving pixels), its water. */
export function airOf(scene: Scene): AirScene {
  let air = airs.get(scene);
  if (!air) {
    const flat = compositeLayers(scene.layers.map((layer) => ({ ...layer, frames: [layer.frames[0]] })), SCENE_WIDTH);
    air = { glows: glowsOf(flat), water: scene.water, horizon: scene.horizon, ground: scene.ground };
    airs.set(scene, air);
  }
  return air;
}

/** The lights of a picture: every cluster of light-giving pixels, its middle, size and color. */
export function glowsOf(pixels: Pixels): Glow[] {
  const { w, h } = pixels;
  const seen = new Uint8Array(w * h);
  const out: Glow[] = [];
  for (let start = 0; start < w * h; start += 1) {
    if (seen[start] || !pixels.emit[start] || pixels.idx[start] === EMPTY) continue;
    const stack = [start];
    seen[start] = 1;
    let count = 0;
    let sx = 0;
    let sy = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    while (stack.length) {
      const at = stack.pop()!;
      const x = at % w;
      const y = (at - x) / w;
      count += 1;
      sx += x;
      sy += y;
      const [cr, cg, cb] = palRgb(pixels.idx[at]);
      r += cr;
      g += cg;
      b += cb;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const next = ny * w + nx;
        if (seen[next] || !pixels.emit[next] || pixels.idx[next] === EMPTY) continue;
        seen[next] = 1;
        stack.push(next);
      }
    }
    if (count < MIN_LIGHT) continue;
    const rgb = [Math.round(r / count), Math.round(g / count), Math.round(b / count)] as const;
    // Warm or violet fire flickers; cold light (a window's moonlight, crystals, the moon) breathes.
    const fire = rgb[0] > rgb[2] * 1.15 || (rgb[2] > rgb[1] * 1.3 && rgb[0] > rgb[1] * 1.1);
    const big = count > 60;
    out.push({
      x: sx / count,
      y: sy / count,
      r: Math.min(big ? 46 : 30, 6 + Math.sqrt(count) * 3.2),
      rgb,
      fire: fire && !big,
      strength: big ? 0.22 : Math.min(0.55, 0.22 + count / 90),
      phase: (sx * 13 + sy * 7) % 100
    });
  }
  return out;
}

/** Where the air is drawn: the scene canvas's grid and how it sits in it. */
export interface AirFrame {
  /** Device pixels per pixel of the grid. */
  scale: number;
  /** The grid's size (the scene canvas, in pixels of the grid). */
  width: number;
  height: number;
  /** Row of the canvas where the scene's first row sits, and column of its first column (it tiles). */
  top: number;
  origin: number;
}

/**
 * The atmosphere over a scene canvas: it reads `source` (the pixel canvas) every frame and
 * paints the halos, the reflections and the vignette over it, on `canvas`.
 */
export class Atmosphere {
  private ctx: CanvasRenderingContext2D;
  private air: AirScene | null = null;
  private frame: AirFrame | null = null;
  /** The water's mask at the screen's resolution, and the buffer the reflection is built in. */
  private mask: HTMLCanvasElement | null = null;
  private buffer: HTMLCanvasElement | null = null;
  private maskKey = "";
  private raf = 0;
  private last = 0;
  still = false;
  /** Frames per second of the air's own motion. */
  private static FPS = 24;

  constructor(private canvas: HTMLCanvasElement, private source: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
  }

  setScene(air: AirScene | null) {
    this.air = air;
    this.maskKey = "";
    this.draw(performance.now() / 1000);
  }

  /** Where the scene sits in the canvas now (a camera moving across it, in the Ledger's scenes). */
  setView(top: number, origin: number) {
    const frame = this.frame;
    if (!frame || (frame.top === top && frame.origin === origin)) return;
    this.frame = { ...frame, top, origin };
  }

  setFrame(frame: AirFrame, cssWidth: string, cssHeight: string) {
    this.frame = frame;
    const w = frame.width * frame.scale;
    const h = frame.height * frame.scale;
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
    this.canvas.style.width = cssWidth;
    this.canvas.style.height = cssHeight;
    this.maskKey = "";
    this.draw(performance.now() / 1000);
  }

  start() {
    if (this.raf || this.still) return;
    const loop = (ms: number) => {
      this.raf = requestAnimationFrame(loop);
      const t = ms / 1000;
      if (t - this.last < 1 / Atmosphere.FPS) return;
      this.last = t;
      this.draw(t);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** The air at time `t` (seconds): reflections, then halos, then the vignette. */
  draw(t: number) {
    const ctx = this.ctx;
    const frame = this.frame;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!frame || !this.air) return;
    const time = this.still ? 0 : t;
    if (this.air.water) this.reflect(frame, this.air, time);
    this.halos(frame, this.air, time);
    this.vignette();
  }

  /** Every place a column of the scene shows on the canvas: the scene tiles sideways. */
  private columns(frame: AirFrame, x: number): number[] {
    const out: number[] = [];
    const first = (((frame.origin % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH) - SCENE_WIDTH;
    for (let left = first; left < frame.width; left += SCENE_WIDTH) out.push(left + x);
    return out;
  }

  private halos(frame: AirFrame, air: AirScene, t: number) {
    const ctx = this.ctx;
    const s = frame.scale;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const glow of air.glows) {
      // A fire's halo trembles a little and quickly; every light breathes slowly.
      const breath = 0.88 + 0.12 * Math.sin(t * 0.9 + glow.phase);
      const flicker = glow.fire ? 0.82 + 0.1 * Math.sin(t * 9.1 + glow.phase) + 0.08 * Math.sin(t * 23.7 + glow.phase * 2) : 1;
      const k = breath * flicker;
      const r = glow.r * s * (glow.fire ? 0.94 + 0.06 * flicker : 1);
      const [cr, cg, cb] = glow.rgb;
      for (const x of this.columns(frame, glow.x)) {
        const cx = (x + 0.5) * s;
        const cy = (frame.top + glow.y + 0.5) * s;
        if (cx < -r || cx > this.canvas.width + r) continue;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${0.5 * glow.strength * k})`);
        gradient.addColorStop(0.35, `rgba(${cr},${cg},${cb},${0.18 * glow.strength * k})`);
        gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }
    ctx.restore();
  }

  /** The water's mask on the canvas, at the screen's resolution (made again when the size changes). */
  private waterMask(frame: AirFrame, air: AirScene): HTMLCanvasElement {
    const key = `${frame.width}x${frame.height}@${frame.scale}:${frame.top}:${frame.origin}`;
    if (this.mask && this.maskKey === key) return this.mask;
    const mask = this.mask ?? document.createElement("canvas");
    mask.width = this.canvas.width;
    mask.height = this.canvas.height;
    const m = mask.getContext("2d")!;
    m.clearRect(0, 0, mask.width, mask.height);
    m.fillStyle = "#fff";
    const water = air.water!;
    const s = frame.scale;
    for (let y = 0; y < SCENE_HEIGHT; y += 1) {
      for (let x = 0; x < SCENE_WIDTH; x += 1) {
        if (!water[y * SCENE_WIDTH + x]) continue;
        for (const cx of this.columns(frame, x)) if (cx >= 0 && cx < frame.width) m.fillRect(cx * s, (frame.top + y) * s, s, s);
      }
    }
    this.mask = mask;
    this.maskKey = key;
    return mask;
  }

  /**
   * Still water: the picture above, upside down, laid in the water and wavering line by line;
   * under the ground line it mirrors what stands on the ground (the creature too), above it the
   * far land and the sky (painted by the scene itself). The lights stretch down into it as streaks.
   */
  private reflect(frame: AirFrame, air: AirScene, t: number) {
    const s = frame.scale;
    const mask = this.waterMask(frame, air);
    const buffer = this.buffer ?? (this.buffer = document.createElement("canvas"));
    if (buffer.width !== this.canvas.width) buffer.width = this.canvas.width;
    if (buffer.height !== this.canvas.height) buffer.height = this.canvas.height;
    const b = buffer.getContext("2d")!;
    b.clearRect(0, 0, buffer.width, buffer.height);
    b.imageSmoothingEnabled = false;
    const horizon = frame.top + air.horizon;
    const ground = frame.top + air.ground;
    // Behind the ground line the pixels already mirror the sky; in front of it, the water
    // takes the whole picture standing on the ground, the creature too.
    for (let y = ground + 1; y < frame.height; y += 1) {
      const from = 2 * ground - y;
      if (from < 0) continue;
      const depth = (y - horizon) / Math.max(1, frame.height - horizon);
      // Rows waver sideways, farther in the front; whole device pixels, never smeared.
      const sway = Math.round(Math.sin(y * 0.9 + t * 2.3) * (0.6 + depth * 2.4) * Math.max(1, s / 2));
      b.drawImage(this.source, 0, from, frame.width, 1, sway, y * s, frame.width * s, s);
    }
    // The lights stretched down into the water below them.
    b.globalCompositeOperation = "lighter";
    for (const glow of air.glows) {
      if (glow.y > air.ground) continue;
      const length = (frame.height - ground) * s;
      const [cr, cg, cb] = glow.rgb;
      for (const x of this.columns(frame, glow.x)) {
        const cx = (x + 0.5) * s;
        const top = Math.max(2 * ground - (frame.top + glow.y), ground + 1) * s;
        const width = Math.max(2, glow.r * 0.28) * s;
        const gradient = b.createLinearGradient(0, top, 0, top + length);
        const k = glow.fire ? 0.8 + 0.2 * Math.sin(t * 7.3 + glow.phase) : 1;
        gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${0.55 * glow.strength * k})`);
        gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        b.fillStyle = gradient;
        // Broken into dashes, the way light lies on moving water.
        for (let y = top; y < top + length; y += s * 2) {
          const wobble = Math.round(Math.sin(y * 0.05 + t * 3 + glow.phase) * width * 0.6);
          b.fillRect(cx - width / 2 + wobble, y, width, s);
        }
      }
    }
    b.globalCompositeOperation = "destination-in";
    b.drawImage(mask, 0, 0);
    b.globalCompositeOperation = "source-over";
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = REFLECTION;
    ctx.drawImage(buffer, 0, 0);
    ctx.restore();
  }

  /** The edges of the view sink into the night ink. */
  private vignette() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    const cx = width / 2;
    const cy = height * 0.55;
    const r = Math.hypot(width, height) * 0.62;
    const gradient = ctx.createRadialGradient(cx, cy, r * 0.42, cx, cy, r);
    gradient.addColorStop(0, "rgba(11,10,20,0)");
    gradient.addColorStop(1, `rgba(11,10,20,${VIGNETTE})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}
