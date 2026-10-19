import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { applyCommand } from "./commands";
import { GameEngine } from "./engine";
import { seededRng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState } from "./state";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 2, 1);

describe("save version 18", () => {
  it("gives a version 17 save the music's own volume and the Chronicle's toasts, then verifies and plays", () => {
    const engine = new GameEngine(createInitialState(T0), seededRng(18), T0);
    const now = playBot(engine, T0, 20 * 60, { clicksPerSecond: 5 });
    const legacy = structuredClone(engine.state) as unknown as Record<string, unknown>;
    legacy.version = 17;
    delete (legacy.settings as Record<string, unknown>).musicVolume;
    delete (legacy.settings as Record<string, unknown>).loreToasts;
    const text = JSON.stringify(legacy);
    const migrated = parseState(JSON.parse(text));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.settings.musicVolume).toBe(0.6);
    expect(migrated.settings.loreToasts).toBe(true);
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(parseState(JSON.parse(text)), migrated, 1000)).toEqual([]);
    const resumed = new GameEngine(migrated, seededRng(19), now);
    const later = playBot(resumed, now, 5 * 60, { clicksPerSecond: 5 });
    expect(verifyState(resumed.state, later)).toEqual([]);
  }, 60_000);

  it("lets the page change both settings, and refuses a volume out of bounds", () => {
    const engine = new GameEngine(createInitialState(T0), seededRng(3), T0);
    applyCommand(engine, { type: "settings", patch: { musicVolume: 0.2, loreToasts: false } }, T0);
    expect(engine.state.settings.musicVolume).toBe(0.2);
    expect(engine.state.settings.loreToasts).toBe(false);
    const loud = { ...engine.state, settings: { ...engine.state.settings, musicVolume: 2 } };
    expect(() => parseState(JSON.parse(JSON.stringify(loud)))).toThrow();
  });
});
