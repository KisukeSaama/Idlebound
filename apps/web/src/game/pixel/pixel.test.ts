import { ALTARS, BESTIARY, BIOMES, CARAVAN_WARES, HEROES, MARKET_OFFERS, NAMED_RELICS, RARITIES, SKILLS, SLOTS, SLOT_BASE_COUNT, TREASURE_MONSTER } from "@idlebound/game";
import { ALTAR_ICONS, C, CARAVAN_ICONS, DECOR, NAMED_RELIC_SHAPES, CREATURE_RECIPES, EMBLEMS, MARKET_ICONS, MATERIALS, ORVANE_64, PORTRAITS, palLuma, POWER_ICONS, RELIC_SHAPES, SCENES, STRUCTURES, resolveCreature } from "@idlebound/game/art";
import { describe, expect, it } from "vitest";
import { renderCreature } from "./creature";
import { AGE_COUNT, ERAS_PER_AGE, ageOf } from "./eras";
import { renderEmblem } from "./mask";
import { forgeRunes, RELIC_SIZE, renderCrystal, renderIcon, renderRelic } from "./objects";
import { EMPTY, MAX_COLORS, hashBitmap, toRgba, type Pixels } from "./pixels";
import { awakenedRecipe, renderPortrait } from "./portrait";
import { gradeForNight } from "./night";
import { structureView } from "./props";
import { compositeLayers, flattenScene, MAX_SCENE_COLORS, PLACE_IDS, renderScene, type Scene } from "./scene";
import { eclipsePixels, eclipseRing, GREY_TABLE, GREYS, greyPixels, greyScene, lanternPlaces, remembrancePixels, seamPixels, unfinishedOrder, unfinishedPixels, unfinishedShare } from "./events";
import { placeFrames } from "./stage";
import { flashPixels } from "./sprites";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));
/** Every Age's mark: the first era of each Age, the Ink of the Blank and the Dawn's line. */
const MARK_ERAS = [...Array.from({ length: AGE_COUNT }, (_, age) => age * ERAS_PER_AGE), 54, 59];

/** Colors of a scene, and its pixels that are not fully opaque. */
function flatness(scene: Scene) {
  const used = new Set<number>();
  let translucent = 0;
  for (const layer of scene.layers) {
    for (const frame of layer.frames) {
      for (let at = 0; at < frame.idx.length; at += 1) {
        if (frame.idx[at] === EMPTY) continue;
        used.add(frame.idx[at]);
        if (frame.alpha[at] !== 255) translucent += 1;
      }
    }
  }
  return { colors: used.size, translucent };
}
const colors = (pixels: Pixels) => new Set([...pixels.idx].filter((pal) => pal !== EMPTY)).size;
const ERA_SAMPLES = Array.from({ length: AGE_COUNT }, (_, age) => age * ERAS_PER_AGE).concat([1, 2, 3, 4, 57]);
/** The wear of a building: the five strata of the Kingdom, the Elder World, the Hallowed. */
const WEAR_ERAS = [0, 1, 2, 3, 4, 7, 12];
/** Every building standing in a scene, with the biome it stands in. */
const BUILDINGS = BIOMES.flatMap((biome) => [...new Set((SCENES[biome.id].structures ?? []).map((placement) => placement.id))].map((id) => [biome.id, id] as const));

describe("pixel art recipes", () => {
  it("has a recipe for every creature of the road, and Pip", () => {
    for (const biome of BIOMES) {
      for (const monster of [...biome.monsters, biome.miniBoss, biome.boss]) expect(CREATURE_RECIPES[monster.id], monster.id).toBeDefined();
    }
    expect(CREATURE_RECIPES[TREASURE_MONSTER.id]).toBeDefined();
    for (const entry of BESTIARY) expect(CREATURE_RECIPES[entry.id], entry.id).toBeDefined();
    for (const relic of NAMED_RELICS) expect(NAMED_RELIC_SHAPES[relic.id], relic.id).toBeDefined();
  });

  it("gives every slot of every creature's legend a known material", () => {
    for (const id of Object.keys(CREATURE_RECIPES)) {
      const recipe = resolveCreature(id);
      for (const material of Object.values(recipe.materials)) expect(MATERIALS[material], `${id} material ${material}`).toBeDefined();
      for (const ink of Object.values(recipe.grid.legend)) if ("m" in ink) expect(recipe.materials[ink.m], `${id} slot ${ink.m}`).toBeDefined();
    }
  });

  it("has a portrait and an emblem for every companion, a scene for every biome", () => {
    for (const hero of HEROES) {
      expect(PORTRAITS[hero.id], hero.id).toBeDefined();
      expect(EMBLEMS[hero.id], hero.id).toBeDefined();
    }
    for (const biome of BIOMES) {
      expect(SCENES[biome.id], biome.id).toBeDefined();
      for (const placement of SCENES[biome.id].structures ?? []) expect(STRUCTURES[placement.id], `${biome.id} ${placement.id}`).toBeDefined();
    }
    for (const [id, structure] of Object.entries(STRUCTURES)) {
      for (const piece of structure.pieces) if ("decor" in piece) expect(DECOR[piece.decor], `${id} decor ${piece.decor}`).toBeDefined();
    }
    for (const slot of SLOTS) expect(RELIC_SHAPES[slot]).toHaveLength(SLOT_BASE_COUNT[slot]);
    for (const altar of ALTARS) expect(ALTAR_ICONS[altar.id]).toBeDefined();
    for (const skill of SKILLS) expect(POWER_ICONS[skill.id]).toBeDefined();
    for (const offer of MARKET_OFFERS) expect(MARKET_ICONS[offer.id]).toBeDefined();
    for (const ware of CARAVAN_WARES) expect(CARAVAN_ICONS[ware.id]).toBeDefined();
  });

  it("gives every altar, power and stall ware a silhouette of its own, in solid pixels", () => {
    const families = {
      altars: Object.values(ALTAR_ICONS),
      powers: Object.values(POWER_ICONS),
      stall: [...Object.values(MARKET_ICONS), ...Object.values(CARAVAN_ICONS)]
    };
    for (const [family, recipes] of Object.entries(families)) {
      const masks = recipes.map((recipe) => {
        expect(recipe.rows).toHaveLength(16);
        for (const row of recipe.rows) expect(row).toHaveLength(16);
        const pixels = renderIcon(recipe);
        expect([...pixels.alpha].every((alpha, at) => pixels.idx[at] === EMPTY || alpha === 255)).toBe(true);
        expect(colors(pixels)).toBeGreaterThanOrEqual(4);
        expect(colors(pixels)).toBeLessThanOrEqual(MAX_COLORS);
        return [...pixels.idx].map((pal) => pal !== EMPTY);
      });
      // By outline alone: any two icons of a family differ by at least 12 opaque pixels.
      for (let a = 0; a < masks.length; a += 1) {
        for (let b = a + 1; b < masks.length; b += 1) {
          const differ = masks[a].filter((opaque, at) => opaque !== masks[b][at]).length;
          expect(differ, `${family} ${a} and ${b}`).toBeGreaterThanOrEqual(12);
        }
      }
    }
  });

  it("keeps the master palette at 64 colors, never pure black", () => {
    expect(ORVANE_64).toHaveLength(64);
    expect(new Set(ORVANE_64).size).toBe(64);
    expect(ORVANE_64).not.toContain("#000000");
    expect(ORVANE_64[0]).toBe("#0b0a14");
  });
});

describe("pixel generator", () => {
  it("draws the same pixels for the same recipe, era, frame and seed", () => {
    for (const id of ["field-rat", "ruined-king", "miner-shade"]) {
      for (const era of [0, 3, 27]) expect(hash(renderCreature(id, { era, frame: 2 }).pixels)).toBe(hash(renderCreature(id, { era, frame: 2 }).pixels));
    }
    expect(hash(flattenScene(renderScene("dark-forest", 12)))).toBe(hash(flattenScene(renderScene("dark-forest", 12))));
  });

  it("draws hand-made creatures as drawn: known keys, opaque pixels, eyes the brightest, a slow breath and a twitch", () => {
    for (const id of Object.keys(CREATURE_RECIPES)) {
      const { grid } = resolveCreature(id);
      for (const row of grid.rows) for (const key of row) if (key !== ".") expect(grid.legend[key], `${id} key ${key}`).toBeDefined();
      for (const patch of grid.idle.twitch?.patches ?? []) {
        for (const row of patch.rows) for (const key of row) if (key !== "." && key !== "_") expect(grid.legend[key], `${id} twitch ${key}`).toBeDefined();
      }
      const still = renderCreature(id).pixels;
      expect([...still.alpha].every((alpha, at) => still.idx[at] === EMPTY || alpha === 255), `${id} opaque`).toBe(true);
      const light = [...still.idx].filter((pal, at) => pal !== EMPTY && still.emit[at]).map(palLuma);
      const body = [...still.idx].filter((pal, at) => pal !== EMPTY && !still.emit[at]).map(palLuma);
      expect(light.length, `${id} eyes`).toBeGreaterThan(0);
      expect(Math.max(...light), `${id} eyes brightest`).toBeGreaterThan(Math.max(...body));
      const frames = grid.idle.breath.map((_, frame) => hash(renderCreature(id, { frame }).pixels));
      expect(frames.length, `${id} a slow breath`).toBeGreaterThan(4);
      expect(new Set(frames).size, `${id} breath and twitch`).toBeGreaterThanOrEqual(3);
      const blink = renderCreature(id, { blink: true }).pixels;
      expect([...blink.emit].some((emit) => emit === 1), `${id} blink`).toBe(false);
      // Never resized: the Age that swells built bodies leaves a drawing at its size.
      expect(renderCreature(id, { era: 5 }).pixels.w).toBe(still.w);
    }
  });

  it("closes only the eyes on a blink: flames, lanterns, windows and runes stay lit", () => {
    for (const id of Object.keys(CREATURE_RECIPES)) {
      const { grid } = resolveCreature(id);
      const still = renderCreature(id).pixels;
      const blink = renderCreature(id, { blink: true }).pixels;
      const at = [...still.emit.keys()];
      const lights = at.filter((pixel) => still.emit[pixel] === 2);
      const eyes = at.filter((pixel) => still.emit[pixel] === 1);
      const drawsLight = Object.values(grid.legend).some((ink) => "pal" in ink && ink.glow && ink.light);
      expect(lights.length > 0, `${id} lights drawn`).toBe(drawsLight);
      expect(lights.filter((pixel) => blink.emit[pixel] !== 2 || blink.idx[pixel] !== still.idx[pixel]).length, `${id} lights stay lit`).toBe(0);
      if (eyes.length) expect(eyes.some((pixel) => blink.emit[pixel] === 0), `${id} eyes close`).toBe(true);
    }
  });

  it("lights a hit inside the outline: the whole body in one color, eyes and outline untouched", () => {
    for (const id of Object.keys(CREATURE_RECIPES)) {
      const still = renderCreature(id).pixels;
      const edge = (at: number) => {
        const x = at % still.w;
        const y = Math.floor(at / still.w);
        return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([nx, ny]) => nx < 0 || ny < 0 || nx >= still.w || ny >= still.h || still.idx[ny * still.w + nx] === EMPTY);
      };
      const drawn = [...still.idx.keys()].filter((at) => still.idx[at] !== EMPTY);
      const kept = drawn.filter((at) => still.emit[at] || edge(at));
      const inside = drawn.filter((at) => !still.emit[at] && !edge(at));
      const lit = flashPixels(still, C.lilac);
      expect(kept.filter((at) => lit.idx[at] !== still.idx[at]).length, `${id} outline and eyes kept`).toBe(0);
      expect(inside.every((at) => lit.idx[at] === C.lilac), `${id} filled`).toBe(true);
    }
  });

  it("uses 4 to 12 colors per sprite, at every era", () => {
    for (const id of Object.keys(CREATURE_RECIPES)) {
      for (const era of [0, 2, 5, 10, 25, 40]) {
        const count = colors(renderCreature(id, { era }).pixels);
        expect(count, `${id} era ${era}`).toBeLessThanOrEqual(MAX_COLORS);
        expect(count, `${id} era ${era}`).toBeGreaterThanOrEqual(4);
      }
    }
    for (const hero of HEROES) expect(colors(renderPortrait(hero.id)), hero.id).toBeLessThanOrEqual(MAX_COLORS);
  });

  it("outlines with ink where a creature meets the ground", () => {
    const { pixels } = renderCreature("wild-boar");
    let bottom = 0;
    for (let at = 0; at < pixels.idx.length; at += 1) if (pixels.idx[at] !== EMPTY) bottom = Math.floor(at / pixels.w);
    const row = [...pixels.idx.slice(bottom * pixels.w, (bottom + 1) * pixels.w)].filter((pal) => pal !== EMPTY);
    expect(new Set(row)).toEqual(new Set([0]));
  });

  it("keeps eyes out of era palettes, and Pip the same in every stratum", () => {
    const eyes = (pixels: Pixels) => [...pixels.idx].filter((_, at) => pixels.emit[at] && pixels.idx[at] !== EMPTY);
    expect(eyes(renderCreature("shade-wolf", { era: 2 }).pixels)).toContain(eyes(renderCreature("shade-wolf").pixels)[0]);
    for (const era of [1, 7, 30, 59]) expect(hash(renderCreature("golden-rat", { era }).pixels)).toBe(hash(renderCreature("golden-rat").pixels));
  });

  it("maps 60 eras onto 12 Ages and gives the deepest strata fewer pixels", () => {
    expect(ageOf(0)).toBe(0);
    expect(ageOf(4)).toBe(0);
    expect(ageOf(5)).toBe(1);
    expect(ageOf(59)).toBe(11);
    expect(ageOf(120)).toBe(11);
    const drawn = (pixels: Pixels) => [...pixels.idx].filter((pal) => pal !== EMPTY).length;
    expect(drawn(renderCreature("ruined-king", { era: 58 }).pixels)).toBeLessThan(drawn(renderCreature("ruined-king", { era: 55 }).pixels));
  });

  it("keeps every scene flat: 20 colors at most, no translucent pixel, 24 with any creature of its biome", () => {
    for (const biome of BIOMES) {
      for (const fullMoon of [false, true]) {
        const scene = renderScene(biome.id, 0, { fullMoon });
        const used = new Set<number>();
        for (const layer of scene.layers) {
          for (const frame of layer.frames) {
            let translucent = 0;
            for (let at = 0; at < frame.idx.length; at += 1) {
              if (frame.idx[at] === EMPTY) continue;
              used.add(frame.idx[at]);
              if (frame.alpha[at] !== 255) translucent += 1;
            }
            expect(translucent, `${biome.id} translucent pixels`).toBe(0);
          }
        }
        expect(used.size, `${biome.id} colors`).toBeLessThanOrEqual(20);
        for (const monster of [...biome.monsters, biome.miniBoss, biome.boss]) {
          const withCreature = new Set(used);
          for (const pal of renderCreature(monster.id).pixels.idx) if (pal !== EMPTY) withCreature.add(pal);
          expect(withCreature.size, `${biome.id} + ${monster.id}`).toBeLessThanOrEqual(24);
        }
      }
    }
  });

  it("grades every biome's creatures for its night without widening the palette", () => {
    for (const biome of BIOMES) {
      const scene = renderScene(biome.id, 0);
      const night = scene.night!;
      expect(night, biome.id).toBeDefined();
      const sceneColors = new Set(night.colors);
      let shifted = 0;
      for (const monster of [...biome.monsters, biome.miniBoss, biome.boss]) {
        const raw = renderCreature(monster.id).pixels;
        const graded = gradeForNight(raw, night);
        const allowed = new Set([...sceneColors, ...raw.idx]);
        expect([...graded.idx].every((pal) => pal === EMPTY || allowed.has(pal)), monster.id).toBe(true);
        // A moonlit rim and the place's light on the other edge; its lights keep their colors,
        // its shadows and midtones lean toward the night and the scene's air.
        expect([...graded.idx].filter((pal) => pal === night.rim).length, `${monster.id} rim`).toBeGreaterThan(4);
        expect([...graded.idx].filter((pal) => pal === night.glow).length, `${monster.id} glow`).toBeGreaterThan(0);
        const changed = [...graded.idx].map((pal, at) => (pal !== raw.idx[at] && pal !== night.rim && pal !== night.glow ? raw.idx[at] : EMPTY)).filter((pal) => pal !== EMPTY);
        expect(changed.every((pal) => palLuma(pal) < 150), `${monster.id} lights kept`).toBe(true);
        shifted += changed.length;
      }
      expect(shifted, `${biome.id}: the creatures take the scene's colors`).toBeGreaterThan(0);
    }
    // Deeper Ages keep their creatures as drawn.
    expect(renderScene("green-plains", 5).night).toBeUndefined();
    expect(renderScene("dark-forest", 12).night).toBeUndefined();
  });

  it("builds every building within the sprite rules, in every stratum", () => {
    for (const [biome, id] of BUILDINGS) {
      for (const era of WEAR_ERAS) {
        const pixels = structureView(biome, id, era, 0)!;
        expect(pixels, `${id} ${era}`).not.toBeNull();
        expect(colors(pixels), `${id} ${era} colors`).toBeLessThanOrEqual(MAX_COLORS);
        expect([...pixels.alpha].every((alpha, at) => pixels.idx[at] === EMPTY || alpha === 255), `${id} ${era} opaque`).toBe(true);
        expect(hash(pixels)).toBe(hash(structureView(biome, id, era, 0)!));
      }
    }
  });

  it("wears a building down stratum after stratum", () => {
    const drawn = (pixels: Pixels) => [...pixels.idx].filter((pal) => pal !== EMPTY).length;
    const lit = (pixels: Pixels, pal: number) => [...pixels.idx].filter((value, at) => value === pal && pixels.emit[at] === 1).length;
    const glow = SCENES["dark-forest"].glow;
    const present = structureView("dark-forest", "grove-hut", 0, 0)!;
    // The present night: a window lit. The Echo: a ghost behind it, more of it drawn.
    expect(lit(present, glow)).toBeGreaterThan(0);
    expect(drawn(structureView("dark-forest", "grove-hut", 1, 0)!)).toBeGreaterThan(drawn(present));
    // The Ash: burned, its lights out, embers along its breaks.
    const ash = structureView("dark-forest", "grove-hut", 2, 0)!;
    expect(lit(ash, glow)).toBe(0);
    expect(lit(ash, C.ember)).toBeGreaterThan(0);
    // The Void: pieces missing. The Astral: shards of light grown through it.
    expect(drawn(structureView("dark-forest", "grove-hut", 3, 0)!)).toBeLessThan(drawn(present));
    expect(lit(structureView("dark-forest", "grove-hut", 4, 0)!, C.shard)).toBeGreaterThan(0);
    // The Elder World: only its lower walls stand.
    expect(drawn(structureView("dark-forest", "grove-hut", 7, 0)!)).toBeLessThan(drawn(present) * 0.75);
  });

  it("keeps the guardian's ground calm in every scene: no bright or light-giving clutter behind it", () => {
    for (const biome of BIOMES) {
      const flat = flattenScene(renderScene(biome.id, 0));
      let bright = 0;
      let lights = 0;
      let area = 0;
      // Where a guardian stands: the middle of the view, from its feet to above its head.
      for (let y = 48; y < 136; y += 1) {
        for (let x = 112; x < 208; x += 1) {
          area += 1;
          if (palLuma(flat.idx[y * flat.w + x]) > 140) bright += 1;
          if (flat.emit[y * flat.w + x]) lights += 1;
        }
      }
      expect(bright / area, `${biome.id} bright`).toBeLessThan(0.015);
      expect(lights / area, `${biome.id} lights`).toBeLessThan(0.015);
    }
  });

  it("keeps every stratum of the Kingdom flat, and every scene alive", () => {
    for (const biome of BIOMES) {
      for (let era = 0; era < ERAS_PER_AGE; era += 1) {
        const scene = renderScene(biome.id, era);
        for (const layer of scene.layers) {
          for (const frame of layer.frames) {
            expect([...frame.alpha].every((alpha, at) => frame.idx[at] === EMPTY || alpha === 255), `${biome.id} era ${era} translucent`).toBe(true);
          }
        }
      }
      // Something moves besides the frame at the edges: water, a flame, a lantern, a banner, drifting mist.
      const moving = renderScene(biome.id, 0).layers.filter((layer) => !layer.anchor && (layer.drift !== 0 || layer.frames.some((frame) => hash(frame) !== hash(layer.frames[0]))));
      expect(moving.length, biome.id).toBeGreaterThan(0);
    }
  }, 30_000);

  it("draws every Age's marks flat: solid pixels, 20 colors at most, in every biome", () => {
    for (const biome of BIOMES) {
      for (const era of MARK_ERAS) {
        const { colors: count, translucent } = flatness(renderScene(biome.id, era));
        expect(translucent, `${biome.id} era ${era} translucent`).toBe(0);
        expect(count, `${biome.id} era ${era} colors`).toBeLessThanOrEqual(MAX_SCENE_COLORS);
      }
    }
  }, 60_000);

  it("keeps the guardian's ground calm under every Age's marks: no bright mark, no light", () => {
    for (const biome of BIOMES) {
      // Up to the point of light of the First Mark: after it, the line of the Dawn is the guardian.
      for (const era of MARK_ERAS.filter((era) => era <= 55)) {
        const scene = renderScene(biome.id, era);
        const flat = flattenScene(scene);
        const marks = compositeLayers(scene.layers.filter((layer) => layer.mark), flat.w);
        let bright = 0;
        let lights = 0;
        let area = 0;
        for (let y = 48; y < 136; y += 1) {
          for (let x = 112; x < 208; x += 1) {
            area += 1;
            const at = y * flat.w + x;
            if (marks.idx[at] !== EMPTY && palLuma(marks.idx[at]) > 140) bright += 1;
            if (flat.emit[at]) lights += 1;
          }
        }
        expect(bright / area, `${biome.id} era ${era} bright marks`).toBeLessThan(0.015);
        expect(lights / area, `${biome.id} era ${era} lights`).toBeLessThan(0.015);
      }
    }
  }, 60_000);

  it("keeps the night dark on demand: the Kingdom's backgrounds in every stratum, the creatures their own Age", () => {
    for (const era of [7, 23, 41, 58]) {
      const dark = renderScene("dark-forest", era, { darkNight: true });
      expect(hash(flattenScene(dark)), `era ${era}`).toBe(hash(flattenScene(renderScene("dark-forest", era % ERAS_PER_AGE))));
      expect(dark.night, `era ${era}: creatures keep their Age`).toBeUndefined();
      expect(hash(flattenScene(dark))).not.toBe(hash(flattenScene(renderScene("dark-forest", era))));
    }
    // The Kingdom itself, and the places, are the same either way.
    expect(hash(flattenScene(renderScene("green-plains", 3, { darkNight: true })))).toBe(hash(flattenScene(renderScene("green-plains", 3))));
    expect(renderScene("green-plains", 3, { darkNight: true }).night).toBeDefined();
    expect(hash(flattenScene(renderScene("sanctum", 40, { darkNight: true })))).toBe(hash(flattenScene(renderScene("sanctum"))));
   }, 60_000);

  it("draws the places of the story like the biomes: flat, 20 colors at most, alive, deterministic", () => {
    for (const id of PLACE_IDS) {
      const scene = renderScene(id);
      const { colors: count, translucent } = flatness(scene);
      expect(translucent, `${id} translucent`).toBe(0);
      expect(count, `${id} colors`).toBeLessThanOrEqual(MAX_SCENE_COLORS);
      expect(hash(flattenScene(scene)), id).toBe(hash(flattenScene(renderScene(id))));
      expect(scene.layers.some((layer) => !layer.anchor && layer.frames.some((frame) => hash(frame) !== hash(layer.frames[0]))), `${id} moves`).toBe(true);
      // Its banner loops on whole frames, each as solid as the scene.
      const banner = placeFrames(id).frames();
      expect(banner.length).toBeGreaterThan(8);
      expect(new Set(banner.map(hash)).size, `${id} banner moves`).toBeGreaterThan(1);
      expect(banner.every((frame) => frame.alpha.every((alpha) => alpha === 255))).toBe(true);
    }
    // The Sanctum at dusk: the only sky not the night's deepest purple, gold low on it; its altars lit.
    const sanctum = flattenScene(renderScene("sanctum"));
    expect([...sanctum.idx.slice(90 * sanctum.w, 91 * sanctum.w)].some((pal) => pal === C.amber || pal === C.goldLight)).toBe(true);
    expect([...sanctum.emit].filter(Boolean).length).toBeGreaterThan(13);
    // The Dawn: one line of light all along the horizon, and the road ending before it.
    const dawn = renderScene("dawn");
    const flat = flattenScene(dawn);
    expect([...flat.emit.slice(100 * flat.w, 101 * flat.w)].every(Boolean)).toBe(true);
    expect(dawn.light).toBeNull();
  });

  it("draws each base as five different objects, one per rarity: a silhouette of its own each", () => {
    const silhouette = (pixels: Pixels) => [...pixels.idx].map((pal) => (pal === EMPTY ? "." : "#")).join("");
    for (const slot of SLOTS) {
      for (let base = 0; base < SLOT_BASE_COUNT[slot]; base += 1) {
        const shapes = RARITIES.map((rarity) => silhouette(renderRelic(slot, base, rarity)));
        expect(new Set(shapes).size, `${slot} ${base}`).toBe(RARITIES.length);
      }
    }
  });

  it("draws relics within the sprite rules: 4 to 12 colors, solid pixels, forged or not", () => {
    const check = (pixels: Pixels, label: string) => {
      expect(pixels.w, label).toBe(RELIC_SIZE);
      expect(colors(pixels), label).toBeLessThanOrEqual(MAX_COLORS);
      expect(colors(pixels), label).toBeGreaterThanOrEqual(4);
      expect([...pixels.idx].every((pal, at) => pal === EMPTY || pixels.alpha[at] === 255), `${label} solid`).toBe(true);
    };
    for (const slot of SLOTS) {
      for (let base = 0; base < SLOT_BASE_COUNT[slot]; base += 1) {
        for (const rarity of RARITIES) for (const forge of [0, 20]) check(renderRelic(slot, base, rarity, forge), `${slot} ${base} ${rarity} +${forge}`);
      }
    }
    for (const relic of NAMED_RELICS) check(renderRelic(relic.slot, 0, relic.rarity, 0, relic.id), relic.id);
    check(renderRelic("ring", 0, "mythic", 0, "crown"), "crown");
  });

  it("engraves one more rune of fire every five forge levels, the seam at the cap", () => {
    expect([0, 1, 4, 5, 9, 10, 15, 19, 20].map(forgeRunes)).toEqual([0, 1, 1, 2, 2, 3, 4, 4, 5]);
    const fire = (pixels: Pixels) => [...pixels.idx].filter((pal, at) => pixels.emit[at] && (pal === C.goldLight || pal === C.amber || pal === C.ember)).length;
    for (const slot of SLOTS) {
      for (let base = 0; base < SLOT_BASE_COUNT[slot]; base += 1) {
        for (const rarity of RARITIES) {
          const lit = [0, 5, 10, 15, 20].map((forge) => fire(renderRelic(slot, base, rarity, forge)));
          for (let step = 1; step < lit.length; step += 1) expect(lit[step], `${slot} ${base} ${rarity} forge step ${step}`).toBeGreaterThan(lit[step - 1]);
        }
      }
    }
  });

  it("keeps the Crown dim: no light in it, no halo around it", () => {
    const crown = renderRelic("ring", 0, "mythic", 0, "crown");
    expect([...crown.emit].some(Boolean)).toBe(false);
  });

  it("gives the Awakened a portrait that follows the walker's settings", () => {
    const seen = new Set([1, 2, 3, 4, 5, 6].map((seed) => hash(renderPortrait("awakened", awakenedRecipe(seed * 7919)))));
    expect(seen.size).toBeGreaterThan(1);
  });

  it("matches the recorded snapshots of every sprite (an accidental change shows here)", () => {
    const snapshot: Record<string, string> = {};
    for (const id of Object.keys(CREATURE_RECIPES)) snapshot[`creature ${id}`] = hash(renderCreature(id).pixels);
    for (const era of ERA_SAMPLES) snapshot[`king era ${era}`] = hash(renderCreature("ruined-king", { era }).pixels);
    for (const biome of BIOMES) snapshot[`scene ${biome.id}`] = hash(flattenScene(renderScene(biome.id)));
    for (let age = 1; age < AGE_COUNT; age += 1) snapshot[`plains age ${age}`] = hash(flattenScene(renderScene("green-plains", age * ERAS_PER_AGE)));
    for (const biome of BIOMES) snapshot[`strata ${biome.id}`] = [1, 2, 3, 4].map((era) => hash(flattenScene(renderScene(biome.id, era)))).join(" ");
    for (const [biome, id] of BUILDINGS) snapshot[`building ${id}`] = WEAR_ERAS.map((era) => hash(structureView(biome, id, era, 0)!)).join(" ");
    for (const hero of HEROES) snapshot[`hero ${hero.id}`] = `${hash(renderPortrait(hero.id))} ${hash(renderEmblem(hero.id))}`;
    for (const slot of SLOTS) {
      for (let base = 0; base < SLOT_BASE_COUNT[slot]; base += 1) snapshot[`relic ${slot} ${base}`] = RARITIES.map((rarity) => hash(renderRelic(slot, base, rarity, 12))).join(" ");
    }
    for (const relic of NAMED_RELICS) snapshot[`named ${relic.id}`] = hash(renderRelic(relic.slot, 0, relic.rarity, 0, relic.id));
    snapshot["plains full moon"] = hash(flattenScene(renderScene("green-plains", 0, { fullMoon: true })));
    for (const biome of BIOMES) snapshot[`marks ${biome.id}`] = MARK_ERAS.slice(1).map((era) => hash(flattenScene(renderScene(biome.id, era)))).join(" ");
    for (const id of PLACE_IDS) snapshot[`place ${id}`] = hash(flattenScene(renderScene(id)));
    for (const [id, icon] of Object.entries({ ...ALTAR_ICONS })) snapshot[`altar ${id}`] = hash(renderIcon(icon));
    for (const [id, icon] of Object.entries(POWER_ICONS)) snapshot[`power ${id}`] = hash(renderIcon(icon));
    for (const [id, icon] of Object.entries(MARKET_ICONS)) snapshot[`market ${id}`] = hash(renderIcon(icon));
    for (const [id, icon] of Object.entries(CARAVAN_ICONS)) snapshot[`ware ${id}`] = hash(renderIcon(icon));
    snapshot.crystal = [0, 1, 2].map((frame) => hash(renderCrystal(frame))).join(" ");
    expect(snapshot).toMatchSnapshot();
  }, 60_000);
});

describe("events of the Long Night in the arena", () => {
  const opaque = (pixels: Pixels) => [...pixels.idx].every((pal, at) => pal === EMPTY || pixels.alpha[at] === 255);

  it("maps every color to a grey, keeping the order of lightness", () => {
    for (let pal = 0; pal < ORVANE_64.length; pal += 1) expect(GREYS).toContain(GREY_TABLE[pal]);
    const byLuma = [...ORVANE_64.keys()].sort((a, b) => palLuma(a) - palLuma(b));
    for (let index = 1; index < byLuma.length; index += 1) expect(palLuma(GREY_TABLE[byLuma[index]])).toBeGreaterThanOrEqual(palLuma(GREY_TABLE[byLuma[index - 1]]));
    const scene = greyScene(renderScene("green-plains"));
    const used = new Set(scene.layers.flatMap((layer) => layer.frames.flatMap((frame) => [...frame.idx].filter((pal) => pal !== EMPTY))));
    for (const pal of used) expect(GREYS).toContain(pal);
    expect(GREYS).toContain(scene.skyTop);
    expect([...greyPixels(renderCreature("golden-rat").pixels).idx].every((pal) => pal === EMPTY || GREYS.includes(pal))).toBe(true);
  });

  it("draws more of the Unfinished as it is wounded, the same pixels every time", () => {
    expect(unfinishedShare(100, 100)).toBe(0.5);
    expect(unfinishedShare(50, 100)).toBe(0.75);
    expect(unfinishedShare(0, 100)).toBe(1);
    const sprite = renderCreature("field-rat", { era: 25 }).pixels;
    const order = unfinishedOrder(sprite, 1101);
    expect(order.length).toBeGreaterThan(20);
    const drawn = (share: number) => [...unfinishedPixels(sprite, order, share).idx].filter((pal) => pal !== EMPTY).length;
    const shares = [1, 0.75, 0.5, 0.2, 0].map((hp) => unfinishedShare(hp, 1));
    const counts = shares.map(drawn);
    for (let index = 1; index < counts.length; index += 1) expect(counts[index]).toBeGreaterThan(counts[index - 1]);
    const total = [...sprite.idx].filter((pal) => pal !== EMPTY).length;
    expect(counts[counts.length - 1]).toBe(total);
    expect(total - counts[0]).toBe(order.length - Math.round(order.length * 0.5));
    // A pixel drawn at one share stays drawn at every higher one.
    const half = unfinishedPixels(sprite, order, 0.6);
    const more = unfinishedPixels(sprite, order, 0.8);
    for (let at = 0; at < half.idx.length; at += 1) if (half.idx[at] !== EMPTY) expect(more.idx[at]).toBe(half.idx[at]);
    expect(hash(unfinishedPixels(sprite, unfinishedOrder(sprite, 1101), 0.7))).toBe(hash(unfinishedPixels(sprite, order, 0.7)));
  });

  it("shadows the eclipsed King to the darkest steps, his eyes still lit", () => {
    const king = renderCreature("ruined-king").pixels;
    const shadowed = eclipsePixels(king);
    for (let at = 0; at < king.idx.length; at += 1) {
      if (king.idx[at] === EMPTY) continue;
      if (king.emit[at]) expect(shadowed.idx[at]).toBe(king.idx[at]);
      else expect([C.ink, C.night1, C.night2, C.night3]).toContain(shadowed.idx[at]);
    }
  });

  it("draws the Seam, the Eclipse's ring and the lanterns in solid pixels, the same every time", () => {
    for (const frame of [0, 1]) {
      const seam = seamPixels(80, frame, 1);
      expect(opaque(seam)).toBe(true);
      expect(hash(seam)).toBe(hash(seamPixels(80, frame, 1)));
      expect(colors(seam)).toBeLessThanOrEqual(MAX_COLORS);
    }
    expect(hash(seamPixels(80, 0, 1))).not.toBe(hash(seamPixels(80, 1, 1)));
    // Closing, the crack shrinks toward its middle, then nothing is left.
    const lit = (open: number) => [...seamPixels(80, 0, open).idx].filter((pal) => pal !== EMPTY).length;
    expect(lit(1)).toBeGreaterThan(lit(0.5));
    expect(lit(0.5)).toBeGreaterThan(lit(1 / 6));
    expect(lit(0)).toBe(0);
    const ring = eclipseRing(30);
    expect(opaque(ring)).toBe(true);
    expect(hash(ring)).toBe(hash(eclipseRing(30)));
    for (const width of [240, 320, 640]) {
      const garland = remembrancePixels(width, 0);
      expect(opaque(garland)).toBe(true);
      expect(hash(garland)).toBe(hash(remembrancePixels(width, 0)));
      // Calm corners only: nothing hangs over the guardian's ground in the middle of the view.
      for (const place of lanternPlaces(width)) expect(place.x < width * 0.32 || place.x > width * 0.68).toBe(true);
      for (let y = 0; y < garland.h; y += 1) for (let x = Math.ceil(width * 0.35); x < Math.floor(width * 0.65); x += 1) expect(garland.idx[y * width + x]).toBe(EMPTY);
    }
  });
});
