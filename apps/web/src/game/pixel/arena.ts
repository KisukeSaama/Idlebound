/**
 * The arena renderer: one canvas for the whole combat scene (BIBLE 18.9). It draws the
 * biome's layers, its lights, the monster (idle, blink, hit flash, knockback,
 * boss outline, spawn and death), companion shots and particles, on a logical grid scaled
 * by a whole factor, so every pixel of the world is the same size and snapped to the grid.
 *
 * React drives it with plain method calls; it never re-renders React.
 */
import type { MonsterState, StrikeStyle } from "@idlebound/game";
import { C, RAMPS, rampFor, resolveCreature, SCENE_HEIGHT, type Pal } from "@idlebound/game/art";
import { eclipseRing, greyPixels, remembrancePixels, SEAM_MARGIN, seamPixels, seamSpan, unfinishedOrder, unfinishedPixels, unfinishedShare, UNFINISHED_STEPS } from "./events";
import { companionRamp, drawMotes, drawShot, Particles, shotBackAngle, shotDuration, type Mote, type Shot } from "./fx";
import type { NightGrade } from "./night";
import { hash2 } from "./pixels";
import { sceneRecipe, type SceneOptions } from "./scene";
import { creatureSheet, css, flashPixels, sceneSheet, type CreatureSheet, type SceneSheet, type Tone } from "./sprites";
import { effectCache, pixelRatio, toSurface, whenIdle, type Surface } from "./surface";

export interface CssRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MonsterView {
  id: string;
  kind: MonsterState["kind"];
  key: string;
  sheet: CreatureSheet;
  spawnedAt: number;
  event?: MonsterState["event"];
  eclipse: boolean;
  /** Pip's Wager: he stands still and dares the walker. */
  still: boolean;
  /** The Unfinished: share of its body drawn, and the drawing at that share. */
  share: number;
  drawn?: { order: Int32Array; step: number; surface: Surface | null; flashes: Map<Pal, Surface> };
}

/** What `setMonster` needs to know of the monster in the state. */
export type ArenaMonster = Pick<MonsterState, "id" | "kind" | "event" | "eclipse"> & Partial<Pick<MonsterState, "hp" | "maxHp">> & { wager?: unknown };

/**
 * The whole scene lives on one grid: SCENE_HEIGHT rows scaled up by the largest whole factor
 * that fits the box's height; the width, and a few extra ground rows, follow the screen.
 */
const IDLE_FRAME_SECONDS = 0.55;
const SPAWN_SECONDS = 0.25;
/** The monster flashes at most three times a second, however fast the blows land: never a strobe. */
const FLASH_GAP_SECONDS = 1 / 3;
/** The Lantern Queen's flight across the sky during a Crystal Storm. */
const QUEEN_SECONDS = 15;
/** The Seam opens this fast behind its Warden, and closes this fast when it falls. */
const SEAM_OPEN_SECONDS = 0.4;
const SEAM_CLOSE_SECONDS = 0.5;
/** Steps the Seam opens and closes in: a handful of cached sizes, not a new one per frame. */
const SEAM_STEPS = 6;
/** Seconds per frame of the two-frame flickers (the Seam; the lanterns go three times slower). */
const FLICKER_SECONDS = 0.18;
/** The Echo of a Walker comes and goes in this, and bobs on this beat while it fights. */
const WALKER_FADE_SECONDS = 0.6;
const WALKER_BOB = [0, 1, 1, 0];
const WALKER_BOB_SECONDS = 0.3;
/** Under a window the scene barely shows through its veil: one frame a second is enough. */
const COVERED_FRAME_SECONDS = 1;

/** A stretch of road to warm ahead: its scene as `setScene` will ask for it, and its creatures. */
export interface Stretch {
  sceneId: string;
  era: number;
  fullMoon: boolean;
  darkNight: boolean;
  creatures: string[];
}

/** Names a scene in the sprite cache: its creatures are graded for its night under this key. */
function sceneKeyOf(sceneId: string, era: number, fullMoon: boolean, darkNight: boolean) {
  return `${sceneId}:${era}:${fullMoon}:${darkNight}`;
}

export class ArenaRenderer {
  private ctx: CanvasRenderingContext2D;
  private scale = 1;
  private ratio = 1;
  private width = 1;
  private height = 1;
  private arena: CssRect = { x: 0, y: 0, width: 1, height: 1 };
  private sceneKey = "";
  private scene: SceneSheet | null = null;
  private accent: Pal = C.keepAccent;
  private milestoneLit = false;
  private monster: MonsterView | null = null;
  /** The monster that just left the state: a kill reported after it still comes apart. */
  private leaving: { view: MonsterView; at: number } | null = null;
  private dying: { sheet: CreatureSheet; x: number; y: number; at: number } | null = null;
  private particles = new Particles(7);
  private shots: Shot[] = [];
  private motes: Mote[] = [];
  private flash: { at: number; until: number; color: Pal } | null = null;
  private queen: { sheet: CreatureSheet; at: number } | null = null;
  private knock: { until: number; dx: number } | null = null;
  private sceneArgs: { id: string; era: number; options: SceneOptions } | null = null;
  /** The Quiet stands: the whole arena is drawn in greys. */
  private quiet = false;
  /** The Seam behind its Warden: where it stands, when it opened, when it began to close. */
  private seam: { x: number; y: number; length: number; at: number; closing: number | null } | null = null;
  /** The Echo of a Walker beside the company: its era, since when, and since when it leaves. */
  private walker: { era: number; at: number; leaving: number | null } | null = null;
  private remembrance = false;
  private frame = 0;
  private lastDraw = 0;
  private lastEmber = 0;
  private cancelIdle: (() => void) | null = null;
  /** A window or a dialog is open over the scene. */
  private covered = false;
  private narrowQuery: MediaQueryList | null = null;
  reducedMotion = false;
  /** Called when a companion shot lands (the monster flinches in its color). */
  onLand: ((color: string) => void) | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
  }

  private now() {
    return performance.now() / 1000;
  }

  /** Recomputes the whole-number scale and the canvas size from the element's CSS box. */
  resize(sceneBox: CssRect, arena: CssRect) {
    this.ratio = pixelRatio();
    this.arena = arena;
    const deviceHeight = sceneBox.height * this.ratio;
    this.scale = Math.max(1, Math.floor(deviceHeight / SCENE_HEIGHT));
    this.width = Math.max(1, Math.ceil((sceneBox.width * this.ratio) / this.scale));
    // At least the scene's rows; a taller box gets more sky above, and ground below.
    this.height = Math.max(SCENE_HEIGHT, Math.ceil(deviceHeight / this.scale));
    if (this.canvas.width !== this.width) this.canvas.width = this.width;
    if (this.canvas.height !== this.height) this.canvas.height = this.height;
    const cssScale = this.scale / this.ratio;
    this.canvas.style.width = `${this.width * cssScale}px`;
    this.canvas.style.height = `${this.height * cssScale}px`;
    this.ctx.imageSmoothingEnabled = false;
    this.draw(true);
  }

  /** CSS pixels to the logical grid. */
  toGrid(x: number, y: number) {
    const k = this.ratio / this.scale;
    return { x: Math.round(x * k), y: Math.round(y * k) };
  }

  /** The logical grid back to CSS pixels. */
  toCss(x: number, y: number) {
    const k = this.scale / this.ratio;
    return { x: x * k, y: y * k };
  }

  /** The night grading of the current scene, keyed for the sprite cache. */
  private night() {
    const grade = this.scene?.scene.night;
    return grade && this.sceneKey ? { key: this.sceneKey, grade } : undefined;
  }

  /**
   * The scene behind the fight: a biome in the colors of `era`, or a place by its id (`dawn`
   * behind the last stage; `sanctum` and `loom` too). `darkNight` keeps the backgrounds of the
   * Kingdom in every stratum ("Keep the night dark"); the creatures keep their own Age.
   */
  setScene(sceneId: string, era: number, fullMoon = false, darkNight = false) {
    const key = sceneKeyOf(sceneId, era, fullMoon, darkNight);
    if (key === this.sceneKey) return;
    this.sceneKey = key;
    this.sceneArgs = { id: sceneId, era, options: { fullMoon, darkNight } };
    this.scene = sceneSheet(sceneId, era, { fullMoon, darkNight }, this.quiet);
    this.accent = sceneRecipe(sceneId).accent;
    const light = this.scene.scene.light;
    this.motes = [];
    if (light) {
      for (let index = 0; index < light.count; index += 1) {
        this.motes.push({
          x: hash2(index, 1, era) * 320,
          y: light.top + hash2(index, 2, era) * (light.bottom - light.top),
          phase: hash2(index, 3, era) * 6.28,
          speed: 0.4 + hash2(index, 4, era) * 0.8
        });
      }
    }
    this.draw(true);
  }

  /** While the Quiet stands, the scene and every creature lose their colors; they come back after. */
  private setQuiet(quiet: boolean) {
    if (quiet === this.quiet) return;
    this.quiet = quiet;
    const args = this.sceneArgs;
    if (args) this.scene = sceneSheet(args.id, args.era, args.options, quiet);
  }

  /** The tone the creatures are drawn in right now. */
  private tone(): Tone | undefined {
    return this.quiet ? "grey" : undefined;
  }

  /** The Echo of a Walker fights beside the company while its buff lasts, then fades. */
  setWalker(active: boolean, era: number) {
    const walker = this.walker;
    if (active) {
      if (!walker) this.walker = { era, at: this.now(), leaving: null };
      else {
        walker.era = era;
        walker.leaving = null;
      }
    } else if (walker && walker.leaving === null) {
      walker.leaving = this.now();
    }
    this.kick();
  }

  /** On a Remembrance Night, lanterns hang in the upper corners of the scene. */
  setRemembrance(on: boolean) {
    if (on === this.remembrance) return;
    this.remembrance = on;
    this.draw(true);
  }

  setMilestone(lit: boolean) {
    if (lit === this.milestoneLit) return;
    this.milestoneLit = lit;
    this.draw(true);
  }

  /** A Crystal Storm begins: the Lantern Queen crosses the sky, above the fight. */
  storm(era: number) {
    this.queen = { sheet: creatureSheet("lantern-queen", era), at: this.now() };
    this.kick();
  }

  /** The Queen flies from left to right, a little up and down; with reduced motion she only fades. */
  private drawQueen(now: number) {
    const queen = this.queen;
    if (!queen) return;
    const k = (now - queen.at) / QUEEN_SECONDS;
    if (k >= 1) {
      this.queen = null;
      return;
    }
    const sheet = queen.sheet;
    const w = sheet.pixels.w * sheet.unit;
    const h = sheet.pixels.h * sheet.unit;
    const fade = Math.min(1, k * 8, (1 - k) * 8);
    const still = this.reducedMotion;
    const x = still ? Math.floor(this.width * 0.7 - w / 2) : Math.floor(-w + (this.width + w) * k);
    // Just under the scene's top bar (stages, chips), above the fight.
    const y = this.toGrid(0, this.arena.y).y + 2 + (still ? 0 : Math.round(Math.sin(now * 1.6) * 4));
    const frame = still ? 0 : Math.floor(now / IDLE_FRAME_SECONDS) % sheet.frames.length;
    this.ctx.globalAlpha = fade;
    this.ctx.drawImage(sheet.frames[frame], x, y, w, h);
    this.ctx.globalAlpha = 1;
  }

  /**
   * The monster to show. A new key means a new monster: it gathers from the dark. The same
   * monster only updates what an event shows of it (Pip holding still, the Unfinished
   * filling in).
   */
  setMonster(monster: ArenaMonster | null, key: string, era: number) {
    if (!monster) {
      if (this.monster) this.leaving = { view: this.monster, at: this.now() };
      this.monster = null;
      this.closeSeam();
      this.setQuiet(false);
      this.draw(true);
      return;
    }
    const share = monster.event === "unfinished" ? Math.round(unfinishedShare(monster.hp ?? 1, monster.maxHp ?? 1) * UNFINISHED_STEPS) / UNFINISHED_STEPS : 1;
    const still = Boolean(monster.wager);
    if (this.monster?.key === key) {
      if (still !== this.monster.still || share !== this.monster.share) {
        this.monster.still = still;
        this.monster.share = share;
        this.draw(true);
      }
      return;
    }
    this.closeSeam();
    this.setQuiet(monster.event === "quiet");
    const eclipse = Boolean(monster.eclipse);
    const sheet = creatureSheet(monster.id, monster.kind === "treasure" ? 0 : era, this.night(), eclipse ? "eclipse" : this.tone());
    const now = this.now();
    this.monster = { id: monster.id, kind: monster.kind, key, sheet, spawnedAt: now, event: monster.event, eclipse, still, share };
    if (monster.event === "seam") {
      // The crack stands behind the Warden, from the ground to well above its head.
      const place = this.placement(sheet);
      const span = seamSpan(sheet.feet * sheet.unit);
      this.seam = { x: place.x + Math.round((sheet.pixels.w * sheet.unit) / 2), y: place.y + span.middle, length: span.length, at: now, closing: null };
    }
    if (!this.reducedMotion) {
      const place = this.placement(sheet);
      this.particles.gather(sheet.pixels, place.x, place.y, sheet.unit, now, SPAWN_SECONDS);
    }
    this.kick();
  }

  /**
   * Warms the cache while the browser idles, one piece per idle moment: each stretch's scene,
   * then its creatures graded for that scene's night, under the keys `setScene` and
   * `setMonster` will ask for, so entering the next biome generates nothing.
   */
  prepare(stretches: Stretch[]) {
    this.cancelIdle?.();
    const queue: (() => void)[] = [];
    for (const stretch of stretches) {
      let night: { key: string; grade: NightGrade } | undefined;
      queue.push(() => {
        const grade = sceneSheet(stretch.sceneId, stretch.era, { fullMoon: stretch.fullMoon, darkNight: stretch.darkNight }).scene.night;
        night = grade ? { key: sceneKeyOf(stretch.sceneId, stretch.era, stretch.fullMoon, stretch.darkNight), grade } : undefined;
      });
      for (const id of stretch.creatures) queue.push(() => creatureSheet(id, stretch.era, night));
    }
    const next = () => {
      const task = queue.shift();
      if (!task) return;
      task();
      this.cancelIdle = whenIdle(next);
    };
    this.cancelIdle = whenIdle(next);
  }

  /** A window opens over the scene, or closes: under it the scene slows to a frame a second. */
  setCovered(covered: boolean) {
    if (covered === this.covered) return;
    this.covered = covered;
    if (!covered) this.draw(true);
    this.kick();
  }

  /** The arena's box inside the canvas, in CSS pixels. */
  arenaBox(): CssRect {
    return this.arena;
  }

  /** Top left of the sprite on the grid: centered, feet on the scene's floor. */
  private placement(sheet: CreatureSheet) {
    const floor = this.sceneTop() + (this.scene?.scene.ground ?? SCENE_HEIGHT - 40);
    const w = sheet.pixels.w * sheet.unit;
    return { x: Math.floor(this.width / 2) - Math.round(w / 2), y: floor - sheet.feet * sheet.unit };
  }

  /** The whole box the monster's sprite may draw in, in CSS pixels relative to the canvas. */
  spriteBox(): CssRect | null {
    const monster = this.monster;
    if (!monster) return null;
    const place = this.placement(monster.sheet);
    const topLeft = this.toCss(place.x, place.y);
    const size = this.toCss(monster.sheet.pixels.w * monster.sheet.unit, monster.sheet.feet * monster.sheet.unit);
    return { x: topLeft.x, y: topLeft.y, width: size.x, height: size.y };
  }

  /** Box of the monster's drawn pixels, in CSS pixels relative to the canvas. */
  monsterBox(): CssRect | null {
    const monster = this.monster;
    if (!monster) return null;
    const place = this.placement(monster.sheet);
    const topLeft = this.toCss(place.x, place.y);
    const size = this.toCss(monster.sheet.pixels.w * monster.sheet.unit, monster.sheet.feet * monster.sheet.unit);
    // Sprites fill about 70% of their box: aim inside it.
    return { x: topLeft.x + size.x * 0.15, y: topLeft.y + size.y * 0.3, width: size.x * 0.7, height: size.y * 0.7 };
  }

  hit(crit: boolean, fromX?: number) {
    const monster = this.monster;
    if (!monster) return;
    const now = this.now();
    // A soft light, a paler one on a critical blow; blows landing faster keep only their knockback.
    if (this.canFlash(now)) this.flash = { at: now, until: now + (crit ? 0.09 : 0.06), color: crit ? C.pale : C.lilac };
    if (!this.reducedMotion) {
      const center = this.arena.x + this.arena.width / 2;
      const dir = fromX === undefined || fromX <= center ? 1 : -1;
      this.knock = { until: now + 0.1, dx: dir * (crit ? 3 : 2) };
    }
    this.kick();
  }

  /** A companion's shot from a point of the scene (CSS pixels) to the monster's body. */
  shoot(style: StrikeStyle, color: string, from: { x: number; y: number }) {
    const box = this.monsterBox();
    if (!box || this.reducedMotion) return;
    const start = this.toGrid(from.x, from.y);
    const seed = this.particles.random();
    const target = this.toGrid(box.x + box.width * (0.25 + seed * 0.5), box.y + box.height * (0.2 + this.particles.random() * 0.4));
    const ramp = RAMPS[rampFor(color)];
    this.shots.push({ style, ramp: companionRamp(color), tint: ramp[ramp.length - 1], start: this.now(), fromX: start.x, fromY: start.y, toX: target.x, toY: target.y, landed: false });
    this.kick();
  }

  /** The monster comes apart into its pixels, which become gold motes flying to `goldAt`. */
  kill(goldAt: { x: number; y: number } | null) {
    const now = this.now();
    const monster = this.monster ?? (this.leaving && now - this.leaving.at < 0.5 ? this.leaving.view : null);
    this.leaving = null;
    if (!monster) return;
    const place = this.placement(monster.sheet);
    if (this.reducedMotion) {
      this.dying = { sheet: monster.sheet, x: place.x, y: place.y, at: now };
    } else {
      const target = goldAt ? this.toGrid(goldAt.x, goldAt.y) : { x: place.x, y: 0 };
      const guardian = monster.kind === "boss" || monster.kind === "miniboss";
      this.particles.scatter(monster.sheet.pixels, place.x, place.y, monster.sheet.unit, now, target, guardian);
    }
    this.monster = null;
    this.flash = null;
    this.knock = null;
    this.closeSeam();
    this.setQuiet(false);
    this.kick();
  }

  /** The Seam's Warden is gone: the crack closes. */
  private closeSeam() {
    if (this.seam && this.seam.closing === null) this.seam.closing = this.now();
  }

  /** How open the Seam is at `now`, from 0 to 1, in a few whole steps (0 once it has closed). */
  private seamOpen(now: number): number {
    const seam = this.seam;
    if (!seam) return 0;
    if (seam.closing !== null) {
      const k = (now - seam.closing) / SEAM_CLOSE_SECONDS;
      if (k >= 1) {
        this.seam = null;
        return 0;
      }
      return this.reducedMotion ? 1 : Math.ceil((1 - k) * SEAM_STEPS) / SEAM_STEPS;
    }
    return this.reducedMotion ? 1 : Math.ceil(Math.min(1, (now - seam.at) / SEAM_OPEN_SECONDS) * SEAM_STEPS) / SEAM_STEPS;
  }

  /** The crack of pale light behind the Seam's Warden; with reduced motion it stays still and fades out. */
  private drawSeam(now: number) {
    const seam = this.seam;
    const open = this.seamOpen(now);
    if (!seam || open <= 0) return;
    const frame = this.reducedMotion ? 0 : Math.floor(now / FLICKER_SECONDS) % 2;
    const surface = effectCache.get(`seam:${seam.length}:${frame}:${open}`, () => toSurface(seamPixels(seam.length, frame, open)));
    const fade = this.reducedMotion && seam.closing !== null ? 1 - (now - seam.closing) / SEAM_CLOSE_SECONDS : 1;
    this.ctx.globalAlpha = Math.max(0, fade);
    this.ctx.drawImage(surface, seam.x - Math.floor(surface.width / 2), seam.y - Math.floor(seam.length / 2) - SEAM_MARGIN);
    this.ctx.globalAlpha = 1;
  }

  /** The Echo of a Walker: at the left of the arena, beside the company, bobbing as it fights. */
  private drawWalker(now: number) {
    const walker = this.walker;
    if (!walker) return;
    const fadeIn = Math.min(1, (now - walker.at) / WALKER_FADE_SECONDS);
    const fadeOut = walker.leaving === null ? 1 : 1 - (now - walker.leaving) / WALKER_FADE_SECONDS;
    if (fadeOut <= 0) {
      this.walker = null;
      return;
    }
    const sheet = creatureSheet("walker-echo", walker.era, this.night(), this.tone());
    const unit = sheet.unit;
    const floor = this.sceneTop() + (this.scene?.scene.ground ?? SCENE_HEIGHT - 40);
    // Just right of the company's column of portraits (narrower on small screens).
    const narrow = (this.narrowQuery ??= window.matchMedia("(max-width: 900px), (max-height: 560px)")).matches;
    const x = this.toGrid(this.arena.x + (narrow ? 46 : 64), 0).x;
    const still = this.reducedMotion;
    const bob = still ? 0 : WALKER_BOB[Math.floor(now / WALKER_BOB_SECONDS) % WALKER_BOB.length];
    const top = floor - sheet.feet * unit;
    const source = this.scene?.scene.source ?? null;
    const shadow = sheet.shadow(source ? Math.sign(source.x - 160) || 1 : 1, this.scene?.scene.shadow ?? C.ink);
    const frame = still ? 0 : Math.floor(now / IDLE_FRAME_SECONDS) % sheet.frames.length;
    this.ctx.globalAlpha = Math.max(0, Math.min(fadeIn, fadeOut));
    this.ctx.drawImage(shadow.surface, x + shadow.dx * unit, top + shadow.dy * unit, shadow.surface.width * unit, shadow.surface.height * unit);
    this.ctx.drawImage(sheet.frames[frame], x, top - bob, sheet.pixels.w * unit, sheet.pixels.h * unit);
    this.ctx.globalAlpha = 1;
  }

  /** The lanterns of a Remembrance Night, strung across the upper corners, their flames flickering. */
  private drawLanterns(now: number) {
    if (!this.remembrance) return;
    const frame = this.reducedMotion ? 0 : Math.floor(now / (FLICKER_SECONDS * 3)) % 2;
    const width = this.width;
    const grey = this.quiet;
    const surface = effectCache.get(`garland:${width}:${frame}:${grey}`, () => {
      const pixels = remembrancePixels(width, frame);
      return toSurface(grey ? greyPixels(pixels) : pixels);
    });
    this.ctx.drawImage(surface, 0, Math.max(0, this.toGrid(0, this.arena.y).y - 2));
  }

  private canFlash(now: number) {
    return this.flash === null || now - this.flash.at >= FLASH_GAP_SECONDS;
  }

  /** The Unfinished at its share, on its first frame only (a drawing does not breathe); `flash` is a hit's color. */
  private unfinishedSurface(monster: MonsterView, flash: Pal | null): Surface {
    const sheet = monster.sheet;
    const drawn = (monster.drawn ??= { order: unfinishedOrder(sheet.pixels, resolveCreature(monster.id).seed), step: -1, surface: null, flashes: new Map() });
    if (drawn.step !== monster.share || !drawn.surface) {
      drawn.step = monster.share;
      drawn.surface = toSurface(unfinishedPixels(sheet.pixels, drawn.order, monster.share));
      drawn.flashes.clear();
    }
    if (flash === null) return drawn.surface;
    let surface = drawn.flashes.get(flash);
    if (!surface) drawn.flashes.set(flash, (surface = toSurface(flashPixels(unfinishedPixels(sheet.pixels, drawn.order, monster.share), flash))));
    return surface;
  }

  private busy(now: number) {
    return (
      this.queen !== null ||
      this.particles.active ||
      this.shots.length > 0 ||
      (this.flash !== null && now < this.flash.until) ||
      (this.knock !== null && now < this.knock.until) ||
      (this.dying !== null && now - this.dying.at < 0.4) ||
      (this.monster !== null && now - this.monster.spawnedAt < SPAWN_SECONDS) ||
      (this.seam !== null && this.seam.closing !== null) ||
      (this.walker !== null && (this.walker.leaving !== null || now - this.walker.at < WALKER_FADE_SECONDS))
    );
  }

  private kick() {
    if (!this.frame) this.frame = requestAnimationFrame(this.loop);
  }

  start() {
    this.kick();
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.cancelIdle?.();
  }

  private loop = () => {
    this.frame = 0;
    const now = this.now();
    // Idle scenes redraw a few times a second, effects every frame; under a window, once a second.
    const gap = this.covered ? COVERED_FRAME_SECONDS : this.busy(now) ? 0 : 1 / 12;
    if (now - this.lastDraw > gap) this.draw(false);
    if (!this.reducedMotion || this.busy(now)) this.frame = requestAnimationFrame(this.loop);
  };

  private drawScene(t: number) {
    const ctx = this.ctx;
    const scene = this.scene;
    ctx.fillStyle = css(scene ? scene.scene.skyTop : C.night1);
    ctx.fillRect(0, 0, this.width, this.height);
    if (!scene) return;
    const top = this.sceneTop();
    const still = this.reducedMotion;
    const ground = scene.layers.findIndex((layer) => layer.ground);
    scene.layers.forEach((layer, index) => {
      if (layer.anchor) return;
      const surface = layer.frames[still ? 0 : Math.floor(t / layer.period) % layer.frames.length];
      // Layers are centered on the canvas and tile sideways; clouds drift on their own.
      const origin = Math.floor(this.width / 2) - 160 - (still ? 0 : Math.floor(t * layer.drift));
      let first = origin % layer.width;
      if (first > 0) first -= layer.width;
      for (let x = first; x < this.width; x += layer.width) ctx.drawImage(surface, x, top);
      if (index === 0) this.drawTwinkles(scene, top, first, layer.width, t);
      if (index === ground) this.extend(surface, first, layer.width, top);
    });
    if (scene.milestone) {
      const stone = this.milestoneLit ? scene.milestone.on : scene.milestone.off;
      ctx.drawImage(stone, Math.floor(this.width / 2) + (scene.milestone.x - 160), top + scene.milestone.y);
    }
    const light = scene.scene.light;
    if (light) {
      ctx.save();
      ctx.translate(Math.floor(this.width / 2) - 160, top);
      drawMotes(ctx, this.motes, light.kind, light.color, t, Math.max(320, this.width), still);
      ctx.restore();
    }
    this.drawQueen(t);
  }

  /**
   * Row of the canvas where the scene's top row sits: its floor just above the monster's
   * panel, and never above the canvas's bottom, so the ground always reaches the edge.
   */
  private sceneTop(): number {
    const floor = this.toGrid(0, this.arena.y + this.arena.height).y - 3;
    return Math.min(this.height - SCENE_HEIGHT, floor - (this.scene?.scene.ground ?? SCENE_HEIGHT - 40));
  }

  /**
   * Below the scene, on a box taller than it: a layer's last row runs on to the bottom,
   * across the view for a tiling layer, in place for one pinned to an edge.
   */
  private extend(surface: Surface, x: number, width: number, top: number, tiled = true) {
    const bottom = top + SCENE_HEIGHT;
    if (bottom >= this.height) return;
    for (let left = x; left < (tiled ? this.width : x + 1); left += width) this.ctx.drawImage(surface, 0, SCENE_HEIGHT - 1, width, 1, left, bottom, width, this.height - bottom);
  }

  /** Bright stars breathe in and out, each on its own beat. */
  private drawTwinkles(scene: SceneSheet, top: number, first: number, width: number, t: number) {
    if (this.reducedMotion) return;
    const ctx = this.ctx;
    scene.scene.twinkles.forEach((star, index) => {
      const k = Math.sin(t * (0.7 + (index % 5) * 0.23) + index * 1.7);
      if (k > -0.35) return;
      ctx.fillStyle = css(scene.scene.twinkleDim);
      for (let x = first; x < this.width; x += width) ctx.fillRect(x + star.x, top + star.y, 1, 1);
    });
  }

  /** The dark shapes pinned to the edges, in front of the creature. */
  private drawFrame(t: number) {
    const scene = this.scene;
    if (!scene) return;
    const ctx = this.ctx;
    const top = this.sceneTop();
    for (const layer of scene.layers) {
      if (!layer.anchor) continue;
      const surface = layer.frames[this.reducedMotion ? 0 : Math.floor(t / layer.period) % layer.frames.length];
      const x = layer.anchor === "left" ? 0 : this.width - layer.width;
      ctx.drawImage(surface, x, top);
      this.extend(surface, x, layer.width, top, false);
    }
  }

  private drawMonster(now: number) {
    const ctx = this.ctx;
    const monster = this.monster;
    if (this.dying) {
      const k = (now - this.dying.at) / 0.4;
      if (k >= 1) this.dying = null;
      else {
        ctx.globalAlpha = 1 - k;
        ctx.drawImage(this.dying.sheet.frames[0], this.dying.x, this.dying.y, this.dying.sheet.pixels.w * this.dying.sheet.unit, this.dying.sheet.pixels.h * this.dying.sheet.unit);
        ctx.globalAlpha = 1;
      }
    }
    if (!monster) return;
    const sheet = monster.sheet;
    const age = now - monster.spawnedAt;
    const place = this.placement(sheet);
    const unit = sheet.unit;
    const w = sheet.pixels.w * unit;
    const h = sheet.pixels.h * unit;
    // Its shadow: its own silhouette laid on the ground, away from the moon.
    const source = this.scene?.scene.source ?? null;
    const shadow = sheet.shadow(source ? Math.sign(source.x - 160) || 1 : 1, this.scene?.scene.shadow ?? C.ink);
    ctx.drawImage(shadow.surface, place.x + shadow.dx * unit, place.y + shadow.dy * unit, shadow.surface.width * unit, shadow.surface.height * unit);
    if (age < SPAWN_SECONDS && !this.reducedMotion) return;
    const alpha = this.reducedMotion ? Math.min(1, age / SPAWN_SECONDS) : 1;
    const flicker = sheet.treatment.flicker && hash2(Math.floor(now * 10), 0, 3) < 0.15 ? 0.7 : 1;
    ctx.globalAlpha = alpha * flicker;
    let x = place.x;
    if (this.knock && now < this.knock.until) x += this.knock.dx;
    if (monster.eclipse) {
      // The King's Eclipse: a dark ring behind him, still.
      const radius = Math.round(Math.min(w, sheet.feet * unit) * 0.42);
      const halo = effectCache.get(`eclipse-ring:${radius}`, () => toSurface(eclipseRing(radius)));
      ctx.drawImage(halo, x + Math.round(w / 2) - Math.floor(halo.width / 2), place.y + Math.round(sheet.feet * unit * 0.45) - Math.floor(halo.height / 2));
    }
    const ring = monster.kind === "boss" || monster.kind === "miniboss" ? this.accent : monster.kind === "treasure" ? C.gold : null;
    if (ring !== null) {
      const pulse = this.reducedMotion ? 0.6 : 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(now * 4));
      ctx.globalAlpha = alpha * pulse;
      ctx.drawImage(sheet.ring(ring), x - unit, place.y - unit, w + 2 * unit, h + 2 * unit);
      ctx.globalAlpha = alpha * flicker;
    }
    const speed = sheet.treatment.speed;
    // Pip holding still for his dare, and the Unfinished, keep their first frame.
    const still = this.reducedMotion || monster.still || monster.event === "unfinished";
    const idle = still ? 0 : Math.floor((now * speed) / IDLE_FRAME_SECONDS) % sheet.frames.length;
    const blinkPhase = (now * speed + hash2(monster.key.length, 0, 1) * 4) % 4.2;
    let surface = blinkPhase < 0.14 && !still ? sheet.blink : sheet.frames[idle];
    const flashing = this.flash !== null && now < this.flash.until;
    if (monster.event === "unfinished") surface = this.unfinishedSurface(monster, flashing ? this.flash!.color : null);
    else if (flashing) surface = sheet.flash(this.flash!.color);
    ctx.drawImage(surface, x, place.y, w, h);
    ctx.globalAlpha = 1;
    if (sheet.treatment.embers && !this.reducedMotion && now - this.lastEmber > 0.12) {
      this.lastEmber = now;
      this.particles.ember(x + Math.round(this.particles.random() * w), place.y + Math.round(h * 0.3), now);
    }
  }

  draw(force: boolean) {
    const now = this.now();
    if (!force && now - this.lastDraw < 1 / 90) return;
    this.lastDraw = now;
    this.drawScene(now);
    this.drawSeam(now);
    this.drawWalker(now);
    this.drawMonster(now);
    this.drawFrame(now);
    this.drawLanterns(now);
    for (let index = this.shots.length - 1; index >= 0; index -= 1) {
      const shot = this.shots[index];
      const t = now - shot.start;
      if (t >= shotDuration(shot.style)) {
        this.shots.splice(index, 1);
        continue;
      }
      if (drawShot(this.ctx, shot, t)) {
        this.particles.sparks(shot.toX, shot.toY, shotBackAngle(shot), shot.style === "blunt" ? 3.2 : 2.2, shot.style === "blunt" ? 10 : 7, shot.ramp[shot.ramp.length - 1], now);
        // The monster lights up in the companion's color (a player's hit keeps its own light).
        if (this.monster && this.canFlash(now)) this.flash = { at: now, until: now + 0.06, color: shot.tint };
        this.onLand?.(shot.ramp[shot.ramp.length - 1]);
      }
    }
    this.particles.draw(this.ctx, now);
    if (this.reducedMotion && this.busy(now)) this.kick();
  }
}
