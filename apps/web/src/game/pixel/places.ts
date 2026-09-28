/**
 * What the places of the story add to the pipeline that draws them (scene.ts, PLACES):
 * the essences rising from the Sanctum's altars, the woven night and the humming warp of
 * Eldra's Loom, the one line of light at the Dawn. Solid pixels only, their motion in
 * frames; the middle of each view stays calm.
 */
import { C, PLACES, SCENE_HEIGHT, SCENE_WIDTH, STRUCTURES, type Pal } from "@idlebound/game/art";
import { sine } from "./draw";
import type { Mark } from "./marks";
import { createPixels, hash2, setPixel, type Pixels } from "./pixels";

const H = SCENE_HEIGHT;
const W = SCENE_WIDTH;

// ------------------------------------------------------------------ the Sanctum of Dusk

/** Frames of the essences' rise. */
const RISE_FRAMES = 16;

/**
 * Essences drifting up as violet points: from each altar two at a time, wavering as they
 * rise, a pixel of their own color trailing under them, going out one pixel at a time
 * high over the stones; from the heart of the ring, one now and then, higher still.
 */
function essences(frame: number): Pixels {
  const out = createPixels(W, H);
  const recipe = PLACES.sanctum;
  const point = (x: number, y: number, head: Pal, tail: Pal | null) => {
    setPixel(out, x, y, head, 255, 1);
    if (tail !== null) setPixel(out, x, y + 1, tail, 255, 1);
  };
  const sources = recipe.structures.filter((placement) => placement.id.startsWith("altar-")).map((placement) => [placement.x, placement.base - (STRUCTURES[placement.id]?.h ?? 12) + 2] as const);
  // From the heart of the ring, where the essences are counted, higher still.
  sources.push([150, 122], [160, 124], [170, 122]);
  sources.forEach(([x0, y0], index) => {
    for (let one = 0; one < 2; one += 1) {
      const phase = Math.floor(hash2(index, one, recipe.seed + 7) * RISE_FRAMES);
      const k = ((frame + phase) % RISE_FRAMES) / RISE_FRAMES;
      const climb = index >= sources.length - 3 ? 76 : 34 + Math.floor(hash2(index, 2, recipe.seed) * 16);
      const x = x0 + Math.round(sine(k * 1.5 + hash2(index, one + 3, recipe.seed)) * 2);
      const y = y0 - Math.round(k * climb);
      // Bright as it leaves the stone, dimmer, then a single pixel before it goes out.
      if (k < 0.5) point(x, y, C.essenceLight, C.essenceBright);
      else if (k < 0.8) point(x, y, C.essenceBright, C.essence);
      else if ((frame + index) % 2 === 0) point(x, y, C.essence, null);
    }
  });
  return out;
}

// ------------------------------------------------------------------ Eldra's Loom

/** Rows of the loom in the scene: the woven night down to its edge, the warp down to its beam. */
const FELL = 58;
const WARP_FOOT = 125;
const WARP_LEFT = 32;
const WARP_RIGHT = 288;
const LOOM_FRAMES = 8;

/**
 * The woven night hanging from the cloth beam: its weave in two tones, cell by cell, the
 * stars and a moon woven into it, its lower edge (the fell) where the last thread went in.
 */
function wovenNight(): Pixels {
  const out = createPixels(W, H);
  const seed = PLACES.loom.seed;
  for (let y = 10; y <= FELL; y += 1) {
    for (let x = 22; x < W - 22; x += 1) {
      let color: Pal = (((x >> 1) + (y >> 1)) & 1) === 0 ? C.night2 : C.night1;
      if ((x - WARP_LEFT) % 4 === 0 && y % 2 === 0) color = C.plum;
      // The moon, woven in: its disc in two pale tones, the weave showing through.
      const d = (x - 226) ** 2 + (y - 30) ** 2;
      if (d <= 81) color = d > 56 || (((x >> 1) + (y >> 1)) & 1) === 1 ? C.lilac : C.pale;
      else if (hash2(x, y, seed) < 0.018) color = hash2(x, y, seed + 1) < 0.3 ? C.pale : C.lilac;
      if (y === FELL) color = C.dusk;
      else if (y === FELL - 1 && (x & 1) === 0) color = C.haze;
      setPixel(out, x, y, color);
    }
  }
  // A long fold where the cloth hangs over the beam, darker, and a frayed edge at each side.
  for (let y = 10; y < 14; y += 1) for (let x = 22; x < W - 22; x += 1) if ((x + y) % 2 === 0) setPixel(out, x, y, C.ink);
  for (const edge of [22, W - 23]) for (let y = 14; y <= FELL; y += 3) setPixel(out, edge, y, C.plum);
  return out;
}

/**
 * The warp: a thread every four pixels from the fell down to the warp beam, taut, and the
 * hum running up them, a bead of light climbing every other thread, sparser in the middle.
 */
function warp(frame: number): Pixels {
  const out = createPixels(W, H);
  for (let x = WARP_LEFT; x <= WARP_RIGHT; x += 4) {
    const thread = (x - WARP_LEFT) / 4;
    const middle = Math.abs(x - W / 2) < 48;
    const humming = thread % 2 === 0 && (!middle || thread % 4 === 0);
    const phase = Math.floor(hash2(thread, 0, PLACES.loom.seed) * 32);
    for (let y = FELL + 1; y <= WARP_FOOT; y += 1) {
      const bead = humming && ((WARP_FOOT - y + phase + frame * 4) % 32) < 2;
      setPixel(out, x, y, bead ? C.essenceLight : C.haze, 255, bead ? 1 : 0);
    }
  }
  return out;
}

// ------------------------------------------------------------------ the Dawn

/**
 * The edge of the night: a single line of pale light along the horizon, and around it rows
 * of regular dithering in the Morning's warm white, reaching out and back, breathing.
 */
function lineOfLight(frame: number): Pixels {
  const out = createPixels(W, H);
  const horizon = PLACES.dawn.horizon;
  const breath = frame % 4 === 3 ? 1 : frame % 2;
  for (let x = 0; x < W; x += 1) {
    setPixel(out, x, horizon, C.moon, 255, 1);
    if ((x + breath) % 2 === 0) {
      setPixel(out, x, horizon - 1, C.moon, 255, 1);
      setPixel(out, x, horizon + 1, C.paper);
    }
    if ((x + breath * 2) % 4 === 0) setPixel(out, x, horizon - 2, C.moon, 255, 1);
  }
  return out;
}

/** The layers a place adds to its scene. */
export function placeMarksOf(id: string): Mark[] {
  switch (id) {
    case "sanctum":
      return [{ plane: "front", frames: Array.from({ length: RISE_FRAMES }, (_, frame) => essences(frame)), period: 0.22 }];
    case "loom":
      return [
        { plane: "ground", frames: [wovenNight()], depth: 0.7 },
        { plane: "ground", frames: Array.from({ length: LOOM_FRAMES }, (_, frame) => warp(frame)), depth: 0.7, period: 0.16 }
      ];
    case "dawn":
      return [{ plane: "front", frames: [0, 1, 2, 3].map(lineOfLight), period: 0.9 }];
    default:
      return [];
  }
}

