import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MARKET_BUFF_MAX_SECONDS, RARE_WARES, STALL_MS, STALL_WARE_BY_ID, placeLevel, stallAt, stallWindow, wareCost, type StallWareId } from "./data/market";
import { REKINDLE_SHARDS, relicPlace, shardScale, slotTraits } from "./data/traits";
import { GameEngine } from "./engine";
import { rekindlePrice } from "./formulas";
import { generateItem } from "./loot";
import { seededRng } from "./rng";
import { migrateState, parseState } from "./save";
import { BOON_REFUND_NOTICE, SAVE_VERSION } from "./state";
import type { GameState } from "./types";
import { verifyPace, verifyState, verifyTransition } from "./validation";

const codes = (violations: { code: string }[]) => violations.map((violation) => violation.code);

/**
 * A game near stage 1200, past seven dusks, with 7430 shards (`fixtures/walker-1000.json`),
 * its pack emptied to make room. `rich`: a million shards more.
 */
function walker(rich = false): { engine: GameEngine; now: number } {
  const kept = JSON.parse(readFileSync(new URL("./fixtures/walker-1000.json", import.meta.url), "utf8")) as { state: GameState; now: number };
  const state = migrateState(kept.state) as GameState;
  state.inventory = state.inventory.slice(0, 20);
  // Shards out of nowhere, for the purchases no save check follows.
  if (rich) state.shards += 1_000_000;
  return { engine: new GameEngine(state, seededRng(5), kept.now), now: kept.now };
}

/** The first moment from `from` whose stall holds `ware`, and its place. */
function stallWith(ware: StallWareId, from: number): { at: number; index: number } {
  for (let window = stallWindow(from); ; window += 1) {
    const index = stallAt(window).findIndex((place) => place.ware === ware);
    if (index >= 0) return { at: Math.max(from, window * STALL_MS), index };
  }
}

describe("the stall", () => {
  it("lays out the same wares for everyone for six hours, chests first", () => {
    const window = stallWindow(Date.UTC(2026, 9, 20, 7));
    expect(stallAt(window)).toEqual(stallAt(window));
    expect(stallWindow(Date.UTC(2026, 9, 20, 6))).toBe(window);
    expect(stallWindow(Date.UTC(2026, 9, 20, 12))).toBe(window + 1);
    for (let at = window; at < window + 200; at += 1) {
      const places = stallAt(at);
      expect(places[0].ware).toBe("chest");
      expect(places.length).toBeGreaterThanOrEqual(4);
      expect(places.length).toBeLessThanOrEqual(5);
      expect(new Set(places.map((place) => place.ware)).size).toBe(places.length);
    }
    // The rare place opens about one stall in four.
    const rare = Array.from({ length: 4000 }, (_, index) => stallAt(index).some((place) => RARE_WARES.includes(place.ware))).filter(Boolean).length;
    expect(rare / 4000).toBeGreaterThan(0.2);
    expect(rare / 4000).toBeLessThan(0.3);
  });

  it("sells each place within its stock, at the price of the walker's depth", () => {
    const { engine, now } = walker();
    const s = engine.state;
    expect(wareCost("chest", s.maxStageEver)).toBe(30 * shardScale(s.maxStageEver));
    expect(shardScale(446)).toBe(1);
    expect(shardScale(1000)).toBe(10);
    expect(shardScale(5000)).toBe(250);
    const shards = s.shards;
    const items = s.inventory.length + Object.keys(s.equipment).length;
    for (let chest = 0; chest < STALL_WARE_BY_ID.chest.stock; chest += 1) expect(engine.buyStall(0, now)).toBe(true);
    expect(engine.buyStall(0, now)).toBe(false);
    expect(s.inventory.length + Object.keys(s.equipment).length).toBe(items + 3);
    expect(shards - s.shards).toBe(3 * wareCost("chest", s.maxStageEver));
    expect(s.stall).toEqual({ window: stallWindow(now), bought: [3] });
    expect(verifyState(s, now)).toEqual([]);
    // The next stall has chests again.
    expect(engine.buyStall(0, (stallWindow(now) + 1) * STALL_MS)).toBe(true);
  });

  it("keeps the rare place for the walker past the first dusk", () => {
    const { engine, now } = walker(true);
    const { at, index } = stallWith("set-piece", now);
    const place = stallAt(stallWindow(at))[index];
    const fresh = structuredClone(engine.state);
    fresh.lifetime.ascensions = 0;
    expect(new GameEngine(fresh, seededRng(1), at).buyStall(index, at)).toBe(false);
    expect(engine.buyStall(index, at)).toBe(true);
    const item = engine.state.inventory.at(-1)!;
    expect(["legendary", "mythic"]).toContain(item.rarity);
    expect(item.slot).toBe(place.slot);
    expect(relicPlace(item)).toBe(place.place);
    expect(item.level).toBe(placeLevel(place.place!, engine.state.maxStageEver));
    expect(engine.buyStall(index, at)).toBe(false);
  });

  it("sells a relic that remembers the trait it shows", () => {
    const { engine, now } = walker(true);
    const { at, index } = stallWith("trait-piece", now);
    const place = stallAt(stallWindow(at))[index];
    expect(engine.buyStall(index, at)).toBe(true);
    const item = engine.state.inventory.at(-1)!;
    expect(item.slot).toBe(place.slot);
    expect(item.traits).toContain(place.trait);
  });

  it("refuses a stall emptied past its stock, from hours to come, or put back", () => {
    const { engine, now } = walker();
    engine.buyStall(0, now);
    const previous = structuredClone(engine.state);
    const tooMany = structuredClone(engine.state);
    tooMany.stall!.bought[0] = 9;
    expect(codes(verifyState(tooMany, now))).toContain("stall");
    const ahead = structuredClone(engine.state);
    ahead.stall!.window += 10;
    expect(codes(verifyState(ahead, now))).toContain("stall");
    expect(codes(verifyPace(previous, ahead, null, now, 60_000).violations)).toContain("stall");
    engine.buyStall(0, now);
    const putBack = structuredClone(engine.state);
    putBack.stall!.bought[0] = 0;
    expect(codes(verifyTransition(engine.state, putBack, 1_000))).toContain("stall");
    const older = structuredClone(engine.state);
    older.stall!.window -= 1;
    expect(codes(verifyTransition(engine.state, older, 1_000))).toContain("stall");
    expect(verifyTransition(previous, engine.state, 1_000)).toEqual([]);
  });
});

describe("the stall's boons", () => {
  it("pays back in shards what an older save bought past a day, and says so once", () => {
    const { engine } = walker();
    const old = structuredClone(engine.state) as GameState & Record<string, unknown>;
    old.version = 19;
    delete old.stall;
    // Thirty hours of rage: the six past the day were paid 720 shards.
    old.shards -= 720;
    old.buffs = [
      { id: "rage", until: old.lastTickAt + 30 * 3_600_000 },
      { id: "autoclick", until: old.lastTickAt + 2 * 3_600_000 },
      { id: "overcharge", until: old.lastTickAt + 10_000 }
    ];
    const shards = old.shards;
    const parsed = parseState(JSON.parse(JSON.stringify(old)));
    expect(parsed.version).toBe(SAVE_VERSION);
    expect(parsed.buffs.find((buff) => buff.id === "rage")!.until).toBe(old.lastTickAt + MARKET_BUFF_MAX_SECONDS * 1000);
    expect(parsed.buffs.find((buff) => buff.id === "autoclick")!.until).toBe(old.lastTickAt + 2 * 3_600_000);
    // Six hours past the day: 36 potions at 20 shards.
    expect(parsed.shards - shards).toBe(720);
    expect(parsed.boonRefund).toBe(720);
    expect(parsed.tutorial.done).toContain(BOON_REFUND_NOTICE);
    expect(verifyState(parsed, parsed.lastTickAt)).toEqual([]);
    // Read again, nothing more comes back.
    expect(parseState(JSON.parse(JSON.stringify(parsed))).shards).toBe(parsed.shards);
  });

  it("leaves a save without boons past a day as it was", () => {
    const { engine } = walker();
    const old = structuredClone(engine.state) as GameState & Record<string, unknown>;
    old.version = 19;
    const parsed = parseState(JSON.parse(JSON.stringify(old)));
    expect(parsed.shards).toBe(old.shards);
    expect(parsed.boonRefund).toBeUndefined();
    expect(parsed.tutorial.done).not.toContain(BOON_REFUND_NOTICE);
  });
});

describe("Brom's rekindling", () => {
  function withRelic(rarity: "epic" | "mythic") {
    const { engine, now } = walker();
    const item = generateItem(seededRng(3), 150, { rarity, slot: "amulet" });
    engine.state.equipment.amulet = item;
    engine.state.lifetime.itemsFound += 1;
    engine.state.lifetime.mythics += rarity === "mythic" ? 1 : 0;
    return { engine, now, item: engine.state.equipment.amulet! };
  }

  it("lets one trait go for another of the slot, at the price of the relic's depth", () => {
    const { engine, now, item } = withRelic("mythic");
    const [gone, kept] = item.traits!;
    const price = rekindlePrice(engine.state, item);
    expect(price).toBe(REKINDLE_SHARDS.mythic * shardScale(150));
    const previous = structuredClone(engine.state);
    const shards = engine.state.shards;
    expect(engine.rekindle(item.uid, gone, now)).toBe(true);
    expect(engine.state.shards).toBe(shards - price);
    expect(item.traits).toHaveLength(2);
    expect(item.traits![1]).toBe(kept);
    expect(item.traits).not.toContain(gone);
    expect(slotTraits("amulet").map((trait) => trait.id)).toContain(item.traits![0]);
    expect(item.rekindled).toBe(1);
    expect(engine.rekindle(item.uid, "vanguard", now)).toBe(false);
    // A named relic keeps what its legend tells.
    const named = Object.values(engine.state.equipment).find((worn) => worn?.named && worn.traits?.length);
    if (named) expect(engine.rekindle(named.uid, named.traits![0], now)).toBe(false);
    expect(verifyTransition(previous, engine.state, 1_000)).toEqual([]);
  });

  it("refuses traits that changed without Brom, or rekindlings no shard paid", () => {
    const { engine, now, item } = withRelic("epic");
    const previous = structuredClone(engine.state);
    const remade = structuredClone(engine.state);
    remade.equipment.amulet!.traits = [slotTraits("amulet").map((trait) => trait.id).find((id) => id !== item.traits![0])!];
    expect(codes(verifyTransition(previous, remade, 1_000))).toContain("item");
    expect(engine.rekindle(item.uid, item.traits![0], now)).toBe(true);
    const unpaid = structuredClone(engine.state);
    unpaid.equipment.amulet!.rekindled = 1_000_000;
    expect(codes(verifyState(unpaid, now))).toContain("forge");
  });
});
