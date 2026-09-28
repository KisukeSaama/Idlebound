"use client";

import {
  ALTARS,
  BIOMES,
  CARAVAN_WARES,
  NAMED_RELICS,
  HEROES,
  MARKET_OFFERS,
  RARITIES,
  RARITY_INFO,
  SKILLS,
  SLOTS,
  SLOT_BASE_COUNT,
  type ItemSlot,
  type MonsterState,
  type Rarity,
  type StrikeStyle
} from "@idlebound/game";
import { CREATURE_RECIPES, MATERIALS, ORVANE_64, RAMPS, SCENES, resolveCreature } from "@idlebound/game/art";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { CARAVAN_PICTO, OFFER_PICTO, Picto, SKILL_PICTO } from "@/game/icons";
import { ArenaRenderer } from "@/game/pixel/arena";
import { Art } from "@/game/pixel/Art";
import { renderCreature } from "@/game/pixel/creature";
import { AGE_COUNT, ERAS_PER_AGE } from "@/game/pixel/eras";
import { PixelSprite } from "@/game/pixel/PixelSprite";
import { PLACE_IDS, renderScene } from "@/game/pixel/scene";
import type { Depth } from "@/game/pixel/stage";
import { awakenedSeed, portraitSource } from "@/game/pixel/sources";
import { pageRect, spriteCache } from "@/game/pixel/surface";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const ERA_COUNT = AGE_COUNT * ERAS_PER_AGE;
const FAMILIES: StrikeStyle[] = ["arrow", "blade", "claw", "blunt", "magic"];
/** Colors of the companions that throw each family of shot, for the demo. */
const FAMILY_HERO: Record<StrikeStyle, string> = { arrow: "maelle", blade: "nyx", claw: "vorn", blunt: "brom", magic: "cendre" };
const CREATURES = Object.keys(CREATURE_RECIPES);
const FORGES = [0, 5, 10, 20];
/** Relics the forge rows show: one of each slot, each in another rarity. */
const FORGE_SAMPLES: [ItemSlot, number, Rarity][] = [
  ["weapon", 2, "rare"],
  ["armor", 0, "epic"],
  ["amulet", 3, "legendary"],
  ["ring", 0, "mythic"]
];
/** The wear of a building, stratum by stratum: the present, the Echo, the Ash, the Void, the Astral, the Elder World, the Hallowed. */
const WEAR_ERAS = [0, 1, 2, 3, 4, 7, 12];
/** A place through the strata: the five eras of the Kingdom, then the first era of every other Age. */
const STRATA = [0, 1, 2, 3, 4, ...Array.from({ length: AGE_COUNT - 1 }, (_, age) => (age + 1) * ERAS_PER_AGE)];
const DEPTHS: Depth[] = ["far", "middle", "near"];
/** Every Age's mark: the first era of each Age after the Kingdom, the Ink of the Blank, and the Dawn's line. */
const MARK_ERAS = [...Array.from({ length: AGE_COUNT - 1 }, (_, age) => (age + 1) * ERAS_PER_AGE), 49, 54, 59].sort((a, b) => a - b);
/** Columns a phone held upright shows of a scene, at the narrowest. */
const PHONE_COLUMNS = 200;

/** The buildings standing in a biome's scene, each once. */
function structuresOf(biomeId: string): string[] {
  return [...new Set((SCENES[biomeId]?.structures ?? []).map((placement) => placement.id))];
}

function kindOf(id: string): MonsterState["kind"] {
  const rank = resolveCreature(id).rank;
  return rank === "guardian" || rank === "king" ? "boss" : rank === "elite" ? "miniboss" : rank === "treasure" ? "treasure" : "normal";
}

function Section({ id, title, text, children }: { id: string; title: string; text?: string; children: ReactNode }) {
  return (
    <section id={id} className="workshop-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {text ? <p className="workshop-lead">{text}</p> : null}
      {children}
    </section>
  );
}

/** A piece of art and its caption (`code` for data identifiers). */
function Tile({ label, code = false, children }: { label: string; code?: boolean; children: ReactNode }) {
  return (
    <figure className="workshop-tile">
      <div className="workshop-tile-art">{children}</div>
      <figcaption>{code ? <code>{label}</code> : label}</figcaption>
    </figure>
  );
}

function ArenaDemo({ era, reduced }: { era: number; reduced: boolean }) {
  const { t, g } = useI18n();
  const w = t.workshop.arena;
  const box = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ArenaRenderer | null>(null);
  const counter = useRef(0);
  const [biome, setBiome] = useState(BIOMES[0].id);
  const [creature, setCreature] = useState("field-rat");
  const [lit, setLit] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const container = box.current;
    const ground = floor.current;
    if (!element || !container || !ground) return;
    const arena = new ArenaRenderer(element);
    renderer.current = arena;
    const fit = () => {
      const outer = pageRect(container);
      const inner = pageRect(ground);
      arena.resize({ x: 0, y: 0, width: outer.width, height: outer.height }, { x: inner.left - outer.left, y: inner.top - outer.top, width: inner.width, height: inner.height });
    };
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    fit();
    arena.start();
    return () => {
      observer.disconnect();
      arena.stop();
      renderer.current = null;
    };
  }, []);

  const summon = () => {
    counter.current += 1;
    renderer.current?.setMonster({ id: creature, kind: kindOf(creature) }, `${creature}:${counter.current}`, era);
  };

  useEffect(() => {
    const arena = renderer.current;
    if (!arena) return;
    arena.reducedMotion = reduced;
    arena.setScene(biome, era, false, dark);
    arena.setMilestone(lit);
    counter.current += 1;
    arena.setMonster({ id: creature, kind: kindOf(creature) }, `${creature}:${counter.current}`, era);
    arena.start();
  }, [biome, creature, era, lit, reduced, dark]);

  const shoot = (family: StrikeStyle) => {
    const outer = box.current ? pageRect(box.current) : undefined;
    if (!outer) return;
    const hero = HEROES.find((entry) => entry.id === FAMILY_HERO[family]);
    renderer.current?.shoot(family, hero?.color ?? "#f5c85b", { x: 28, y: outer.height * 0.78 });
  };

  const kill = () => {
    const outer = box.current ? pageRect(box.current) : undefined;
    renderer.current?.kill({ x: (outer?.width ?? 400) - 40, y: 10 });
    setTimeout(summon, 900);
  };

  return (
    <>
      <div className="workshop-controls">
        <label>
          {w.biome}
          <select className="input" value={biome} onChange={(event) => setBiome(event.target.value)}>
            {BIOMES.map((entry) => <option key={entry.id} value={entry.id}>{g.biomes[entry.id].name}</option>)}
            {PLACE_IDS.map((id) => <option key={id} value={id}>{t.workshop.places[id]}</option>)}
          </select>
        </label>
        <label>
          {w.creature}
          <select className="input" value={creature} onChange={(event) => setCreature(event.target.value)}>
            {CREATURES.map((id) => <option key={id} value={id}>{g.monsters[id] ?? id}</option>)}
          </select>
        </label>
        <label className="workshop-check">
          <input type="checkbox" checked={lit} onChange={(event) => setLit(event.target.checked)} />
          {w.milestone}
        </label>
        <label className="workshop-check">
          <input type="checkbox" checked={dark} onChange={(event) => setDark(event.target.checked)} />
          {t.workshop.marks.darkNight}
        </label>
      </div>
      <div ref={box} className="workshop-arena">
        <canvas ref={canvas} className="scene-canvas" aria-hidden="true" />
        <div ref={floor} className="workshop-floor" />
      </div>
      <div className="workshop-buttons">
        <button type="button" className="btn btn-sm" onClick={() => renderer.current?.hit(false)}>{w.hit}</button>
        <button type="button" className="btn btn-sm" onClick={() => renderer.current?.hit(true)}>{w.crit}</button>
        <button type="button" className="btn btn-sm" onClick={kill}>{w.kill}</button>
        <button type="button" className="btn btn-sm" onClick={summon}>{w.spawn}</button>
      </div>
      <div className="workshop-buttons" role="group" aria-label={w.shots}>
        <span className="workshop-buttons-label">{w.shots}</span>
        {FAMILIES.map((family) => (
          <button key={family} type="button" className="btn btn-ghost btn-sm" onClick={() => shoot(family)}>{w.families[family]}</button>
        ))}
      </div>
    </>
  );
}

export function Workshop() {
  const { t, g, locale } = useI18n();
  const w = t.workshop;
  const [scale, setScale] = useState(3);
  const [era, setEra] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [eraCreature, setEraCreature] = useState("shade-wolf");
  const [guardian, setGuardian] = useState(true);
  const [phone, setPhone] = useState(false);
  const [layerBiome, setLayerBiome] = useState(BIOMES[1].id);
  const [wearBiome, setWearBiome] = useState(BIOMES[0].id);
  const [markBiome, setMarkBiome] = useState(BIOMES[0].id);
  const [darkNight, setDarkNight] = useState(false);
  const [measure, setMeasure] = useState<{ count: number; average: number; worst: number } | null>(null);
  const [sceneMeasure, setSceneMeasure] = useState<{ count: number; average: number; worst: number } | null>(null);
  const [cache, setCache] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const had = root.classList.contains("reduced-motion");
    root.classList.toggle("reduced-motion", reduced || had);
    return () => {
      root.classList.toggle("reduced-motion", had);
    };
  }, [reduced]);

  const run = () => {
    const times: number[] = [];
    for (const id of CREATURES) {
      const start = performance.now();
      renderCreature(id, { era });
      times.push(performance.now() - start);
    }
    setMeasure({ count: times.length, average: times.reduce((a, b) => a + b, 0) / times.length, worst: Math.max(...times) });
    // Scenes are made once per biome and era, when the road enters them.
    const sceneTimes = [...BIOMES.map((biome) => biome.id), ...PLACE_IDS].map((id) => {
      const start = performance.now();
      renderScene(id, era);
      return performance.now() - start;
    });
    setSceneMeasure({ count: sceneTimes.length, average: sceneTimes.reduce((a, b) => a + b, 0) / sceneTimes.length, worst: Math.max(...sceneTimes) });
    setCache(spriteCache.size);
  };
  const eraLabel = (index: number) => w.controls.eraOption(g.eraName(index), g.strata.tags[index] || (index >= ERAS_PER_AGE ? w.eras.age(ROMAN[Math.floor(index / ERAS_PER_AGE)]) : ""));

  const sections: [string, string][] = [
    ["arena", w.arena.title],
    ["palette", w.palette.title],
    ["bestiary", w.bestiary.title],
    ["eras", w.eras.title],
    ["scenes", w.scenes.title],
    ["layers", w.layers.title],
    ["buildings", w.buildings.title],
    ["wear", w.wear.title],
    ["marks", w.marks.title],
    ["places", w.places.title],
    ["companions", w.companions.title],
    ["relics", w.relics.title],
    ["icons", w.icons.title],
    ["performance", w.performance.title]
  ];
  // Everything below redraws when these change.
  const view = `${scale}:${era}:${reduced}`;

  return (
    <div className="workshop" key={reduced ? "still" : "moving"}>
      <header className="workshop-head">
        <h1>{w.title}</h1>
        <p className="workshop-lead">{w.intro}</p>
        <nav className="workshop-nav" aria-label={w.nav}>
          {sections.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}
        </nav>
        <div className="workshop-controls" role="group" aria-label={w.controls.label}>
          <label>
            {w.controls.scale}
            <select className="input" value={scale} onChange={(event) => setScale(Number(event.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>×{value}</option>)}
            </select>
          </label>
          <label>
            {w.controls.era}
            <select className="input" value={era} onChange={(event) => setEra(Number(event.target.value))}>
              {Array.from({ length: ERA_COUNT }, (_, index) => (
                <option key={index} value={index}>{w.controls.eraOption(g.eraName(index), w.eras.age(ROMAN[Math.floor(index / ERAS_PER_AGE)]))}</option>
              ))}
            </select>
          </label>
          <label className="workshop-check">
            <input type="checkbox" checked={reduced} onChange={(event) => setReduced(event.target.checked)} />
            {w.controls.reducedMotion}
          </label>
        </div>
      </header>

      <Section id="arena" title={w.arena.title} text={w.arena.text}>
        <ArenaDemo era={era} reduced={reduced} />
      </Section>

      <Section id="palette" title={w.palette.title} text={w.palette.text}>
        <h3>{w.palette.colors}</h3>
        <ol className="workshop-swatches">
          {ORVANE_64.map((hex, index) => (
            <li key={hex} style={{ background: hex }} title={`${index} ${hex}`}><span>{index}</span></li>
          ))}
        </ol>
        <h3>{w.palette.materials}</h3>
        <ul className="workshop-ramps">
          {Object.entries(MATERIALS).map(([id, material]) => (
            <li key={id}>
              <span className="workshop-ramp">{material.ramp.map((pal, index) => <i key={index} style={{ background: ORVANE_64[pal] }} />)}</span>
              <code>{id}</code>
            </li>
          ))}
        </ul>
        <h3>{w.palette.ramps}</h3>
        <ul className="workshop-ramps">
          {Object.entries(RAMPS).map(([id, ramp]) => (
            <li key={id}>
              <span className="workshop-ramp">{ramp.map((pal, index) => <i key={index} style={{ background: ORVANE_64[pal] }} />)}</span>
              <code>{id}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="bestiary" title={w.bestiary.title} text={w.bestiary.text}>
        <div className="workshop-grid" key={view}>
          {CREATURES.map((id) => (
            <Tile key={id} label={g.monsters[id] ?? id}>
              <Art spec={{ kind: "creature", id, era }} scale={scale} />
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="eras" title={w.eras.title} text={w.eras.text}>
        <div className="workshop-controls">
          <label>
            {w.eras.creature}
            <select className="input" value={eraCreature} onChange={(event) => setEraCreature(event.target.value)}>
              {CREATURES.map((id) => <option key={id} value={id}>{g.monsters[id] ?? id}</option>)}
            </select>
          </label>
        </div>
        {Array.from({ length: AGE_COUNT }, (_, age) => (
          <div key={age} className="workshop-age">
            <h3>{w.eras.age(ROMAN[age])}</h3>
            <div className="workshop-row">
              {Array.from({ length: ERAS_PER_AGE }, (_, step) => {
                const index = age * ERAS_PER_AGE + step;
                return (
                  <Tile key={index} label={g.eraName(index)}>
                    <Art spec={{ kind: "creature", id: eraCreature, era: index }} scale={Math.max(1, scale - 1)} />
                  </Tile>
                );
              })}
            </div>
          </div>
        ))}
      </Section>

      <Section id="scenes" title={w.scenes.title} text={w.scenes.text}>
        <div className="workshop-controls">
          <label className="workshop-check">
            <input type="checkbox" checked={guardian} onChange={(event) => setGuardian(event.target.checked)} />
            {w.scenes.guardian}
          </label>
          <label className="workshop-check">
            <input type="checkbox" checked={phone} onChange={(event) => setPhone(event.target.checked)} />
            {w.scenes.phone}
          </label>
        </div>
        <div className="workshop-scenes" key={view}>
          {BIOMES.map((biome) => (
            <Tile key={biome.id} label={g.biomes[biome.id].name}>
              <Art spec={{ kind: "stage", biome: biome.id, era, guardian, width: phone ? PHONE_COLUMNS : undefined }} scale={Math.max(1, Math.min(2, scale - 1))} />
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="layers" title={w.layers.title} text={w.layers.text}>
        <div className="workshop-controls">
          <label>
            {w.layers.biome}
            <select className="input" value={layerBiome} onChange={(event) => setLayerBiome(event.target.value)}>
              {BIOMES.map((entry) => <option key={entry.id} value={entry.id}>{g.biomes[entry.id].name}</option>)}
            </select>
          </label>
        </div>
        <div className="workshop-scenes" key={view}>
          {DEPTHS.map((depth) => (
            <Tile key={depth} label={w.layers[depth]}>
              <Art spec={{ kind: "depth", biome: layerBiome, era, depth }} scale={Math.max(1, Math.min(2, scale - 1))} />
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="buildings" title={w.buildings.title} text={w.buildings.text}>
        {BIOMES.map((biome) => (
          <div key={biome.id} className="workshop-age">
            <h3>{g.biomes[biome.id].name}</h3>
            {structuresOf(biome.id).map((id) => (
              <div key={`${id}:${view}`} className="workshop-building">
                <code>{id}</code>
                <div className="workshop-row">
                  {WEAR_ERAS.map((index) => (
                    <Tile key={index} label={eraLabel(index)}>
                      <Art spec={{ kind: "structure", biome: biome.id, id, era: index }} scale={Math.max(1, scale - 1)} />
                    </Tile>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section id="wear" title={w.wear.title} text={w.wear.text}>
        <div className="workshop-controls">
          <label>
            {w.wear.biome}
            <select className="input" value={wearBiome} onChange={(event) => setWearBiome(event.target.value)}>
              {BIOMES.map((entry) => <option key={entry.id} value={entry.id}>{g.biomes[entry.id].name}</option>)}
            </select>
          </label>
        </div>
        <div className="workshop-scenes" key={view}>
          {STRATA.map((index) => (
            <Tile key={index} label={eraLabel(index)}>
              <Art spec={{ kind: "stage", biome: wearBiome, era: index, guardian: false }} scale={1} />
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="marks" title={w.marks.title} text={w.marks.text}>
        <div className="workshop-controls">
          <label>
            {w.marks.biome}
            <select className="input" value={markBiome} onChange={(event) => setMarkBiome(event.target.value)}>
              {BIOMES.map((entry) => <option key={entry.id} value={entry.id}>{g.biomes[entry.id].name}</option>)}
            </select>
          </label>
          <label className="workshop-check">
            <input type="checkbox" checked={guardian} onChange={(event) => setGuardian(event.target.checked)} />
            {w.scenes.guardian}
          </label>
          <label className="workshop-check">
            <input type="checkbox" checked={darkNight} onChange={(event) => setDarkNight(event.target.checked)} />
            {w.marks.darkNight}
          </label>
        </div>
        <div className="workshop-scenes" key={view}>
          {MARK_ERAS.map((index) => (
            <Tile key={index} label={eraLabel(index)}>
              <Art spec={{ kind: "stage", biome: markBiome, era: index, guardian, darkNight }} scale={Math.max(1, Math.min(2, scale - 1))} />
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="places" title={w.places.title} text={w.places.text}>
        <div className="workshop-places" key={view}>
          {PLACE_IDS.map((id) => (
            <Tile key={id} label={w.places[id]}>
              <div className="workshop-banner">
                <Art spec={{ kind: "place", id }} label={w.places[id]} />
              </div>
            </Tile>
          ))}
        </div>
      </Section>

      <Section id="companions" title={w.companions.title} text={w.companions.text}>
        <div className="workshop-grid" key={view}>
          {HEROES.map((hero) => (
            <Tile key={hero.id} label={g.heroes[hero.id].name}>
              <span className="workshop-pair">
                <Art spec={{ kind: "portrait", hero: hero.id }} scale={scale} />
                <Art spec={{ kind: "emblem", hero: hero.id }} scale={scale} />
              </span>
            </Tile>
          ))}
        </div>
        <h3>{w.companions.awakened}</h3>
        <div className="workshop-row">
          {(["letters", "scientific", "engineering"] as const).flatMap((notation) =>
            [true, false].map((sound) => (
              <PixelSprite key={`${notation}${sound}`} source={portraitSource("awakened", awakenedSeed(notation, sound, locale))} scale={scale} />
            ))
          )}
        </div>
      </Section>

      <Section id="relics" title={w.relics.title} text={w.relics.text}>
        <div className="workshop-relics" key={view}>
          <span />
          {RARITIES.map((rarity) => (
            <span key={rarity} className="workshop-relics-head" style={{ color: RARITY_INFO[rarity].color }}>{g.rarities[rarity]}</span>
          ))}
          {SLOTS.flatMap((slot) =>
            Array.from({ length: SLOT_BASE_COUNT[slot] }, (_, base) => [
              <span key={`${slot}${base}`} className="workshop-relics-noun">{g.itemBases[slot][base].noun}</span>,
              ...RARITIES.map((rarity) => (
                <span key={`${slot}${base}${rarity}`} className="workshop-relics-art">
                  <Art spec={{ kind: "relic", slot, base, rarity }} scale={scale} />
                </span>
              ))
            ])
          )}
        </div>
        <h3>{w.relics.named}</h3>
        <div className="workshop-grid">
          {NAMED_RELICS.map((relic) => (
            <Tile key={relic.id} label={`${g.relics[relic.id].name} · ${g.rarities[relic.rarity]}`}>
              <span className="workshop-pair">
                <Art spec={{ kind: "relic", slot: relic.slot, base: 0, rarity: relic.rarity, named: relic.id }} scale={1} />
                <Art spec={{ kind: "relic", slot: relic.slot, base: 0, rarity: relic.rarity, named: relic.id }} scale={3} />
              </span>
            </Tile>
          ))}
          <Tile label={g.crown.name}>
            <span className="workshop-pair">
              <Art spec={{ kind: "relic", slot: "ring", base: 0, rarity: "mythic", named: "crown" }} scale={1} />
              <Art spec={{ kind: "relic", slot: "ring", base: 0, rarity: "mythic", named: "crown" }} scale={3} />
            </span>
          </Tile>
        </div>
        <h3>{w.relics.forge}</h3>
        <div className="workshop-relics workshop-forge" key={`forge${view}`}>
          <span />
          {FORGES.map((forge) => (
            <span key={forge} className="workshop-relics-head">+{forge}</span>
          ))}
          {FORGE_SAMPLES.flatMap(([slot, base, rarity]) => [
            <span key={`${slot}${base}`} className="workshop-relics-noun">{g.itemBases[slot][base].noun} · {g.rarities[rarity]}</span>,
            ...FORGES.map((forge) => (
              <span key={`${slot}${base}${forge}`} className="workshop-relics-art">
                <Art spec={{ kind: "relic", slot, base, rarity, forge }} scale={scale} />
              </span>
            ))
          ])}
        </div>
      </Section>

      <Section id="icons" title={w.icons.title} text={w.icons.text}>
        <h3>{w.icons.altars}</h3>
        <div className="workshop-grid">
          {ALTARS.map((altar) => (
            <Tile key={altar.id} label={g.altars[altar.id].name}>
              <Art spec={{ kind: "altar", id: altar.id }} scale={scale} />
            </Tile>
          ))}
        </div>
        <h3>{w.icons.powers}</h3>
        <div className="workshop-grid">
          {SKILLS.map((skill) => (
            <Tile key={skill.id} label={g.skills[skill.id].name}>
              <span className="workshop-pair">
                <Art spec={{ kind: "power", id: skill.id }} scale={scale} />
                <Picto name={SKILL_PICTO[skill.id]} size={16 * scale} />
              </span>
            </Tile>
          ))}
        </div>
        <h3>{w.icons.market}</h3>
        <div className="workshop-grid">
          {MARKET_OFFERS.map((offer) => (
            <Tile key={offer.id} label={g.market[offer.id].name}>
              <span className="workshop-pair">
                <Art spec={{ kind: "market", id: offer.id }} scale={scale} />
                <Picto name={OFFER_PICTO[offer.id]} size={16 * scale} />
              </span>
            </Tile>
          ))}
          {CARAVAN_WARES.map((ware) => (
            <Tile key={ware.id} label={`${g.events.caravan.name} · ${g.caravan[ware.id].name}`}>
              <span className="workshop-pair">
                <Art spec={{ kind: "ware", id: ware.id }} scale={scale} />
                <Picto name={CARAVAN_PICTO[ware.id]} size={16 * scale} />
              </span>
            </Tile>
          ))}
        </div>
        <h3>{w.icons.crystal}</h3>
        <div className="workshop-row" key={view}>
          <Art spec={{ kind: "crystal" }} scale={scale} />
        </div>
      </Section>

      <Section id="performance" title={w.performance.title}>
        <button type="button" className="btn btn-gold btn-sm" onClick={run}>{w.performance.measure}</button>
        {measure ? (
          <p className="workshop-lead" role="status">
            {w.performance.result(measure.count, measure.average.toFixed(2), measure.worst.toFixed(2))} {w.performance.cache(cache)}
            {sceneMeasure ? ` ${w.performance.scenes(sceneMeasure.count, sceneMeasure.average.toFixed(1), sceneMeasure.worst.toFixed(1))}` : null}
          </p>
        ) : null}
      </Section>
    </div>
  );
}
