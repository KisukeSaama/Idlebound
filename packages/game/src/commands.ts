import { markRead, seenOf, sourceCount, CHRONICLE_SOURCES, type ChronicleSource } from "./chronicle";
import type { MarketOfferId } from "./data/market";
import type { GameEngine } from "./engine";
import type { AltarId, BuyMode, ItemSlot, Rarity, Settings, SkillId } from "./types";
import type { WeaveId } from "./data/descent";
import type { Locale } from "./i18n";

/**
 * Everything the walker does to the game, by name. The page runs each one on its engine and
 * writes it in the journal; the server replays the journal with the same engine (see
 * `replay.ts`) and lands on the same game.
 */
export type Command =
  | { type: "click"; count: number }
  | { type: "crystal" }
  | { type: "skill"; id: SkillId }
  | { type: "hero"; id: string; mode: BuyMode | number }
  | { type: "talent"; id: string }
  | { type: "talents" }
  | { type: "travel"; stage: number }
  | { type: "auto" }
  | { type: "pledge"; hero: string | null }
  | { type: "break" }
  | { type: "ascend" }
  | { type: "altar"; id: AltarId }
  | { type: "descend" }
  | { type: "weave"; id: WeaveId }
  | { type: "equip"; uid: string }
  | { type: "unequip"; slot: ItemSlot }
  | { type: "salvage"; uid: string }
  | { type: "salvageUpTo"; rarity: Rarity }
  | { type: "lock"; uid: string }
  | { type: "forge"; slot: ItemSlot }
  | { type: "market" }
  | { type: "offer"; id: MarketOfferId }
  | { type: "caravan" }
  | { type: "remember" }
  | { type: "tutorial"; step: string }
  | { type: "portrait"; hero: string }
  | { type: "crown"; ms: number }
  | { type: "welcome"; ms: number }
  | { type: "read"; source: ChronicleSource; count: number }
  | { type: "readAll" }
  | { type: "settings"; patch: Partial<Settings> }
  /** The walker is here (any input on the page): the autopilot waits, the Reunion may come. */
  | { type: "input" }
  /** The page is watched, or not: crystals and the road's events only come in sight. */
  | { type: "visible"; on: boolean }
  | { type: "locale"; locale: Locale }
  | { type: "zone"; minutes: number };

export type CommandType = Command["type"];

/** The settings a walker changes from the page: what the server lets a command touch. */
const SETTING_KEYS: readonly (keyof Settings)[] = [
  "notation", "sound", "volume", "damageNumbers", "reducedMotion", "confirmAscension", "buyMode", "offlineSpending", "darkNight", "colorblind"
];

/** Runs `command` on `engine` at `now` (the time of the last step). Returns what the action returns. */
export function applyCommand(engine: GameEngine, command: Command, now: number): unknown {
  switch (command.type) {
    case "click": {
      for (let index = 0; index < command.count; index += 1) engine.click(now);
      return undefined;
    }
    case "crystal": return engine.clickCrystal(now);
    case "skill": return engine.useSkill(command.id, now);
    case "hero": return engine.buyHero(command.id, command.mode, now);
    case "talent": return engine.buyUpgrade(command.id, now);
    case "talents": return engine.buyAllUpgrades(now);
    case "travel": return engine.travel(command.stage);
    case "auto": return engine.toggleAutoAdvance();
    case "pledge": return engine.pledge(command.hero, now);
    case "break": return engine.breakPromise(now);
    case "ascend": return engine.ascend(now);
    case "altar": return engine.buyAltar(command.id, now);
    case "descend": return engine.descend(now);
    case "weave": return engine.buyWeave(command.id, now);
    case "equip": return engine.equip(command.uid, now);
    case "unequip": return engine.unequip(command.slot, now);
    case "salvage": return engine.salvage(command.uid);
    case "salvageUpTo": return engine.salvageUpTo(command.rarity);
    case "lock": return engine.toggleLock(command.uid);
    case "forge": return engine.forge(command.slot, now);
    case "market": return engine.visitMarket();
    case "offer": return engine.buyOffer(command.id, now);
    case "caravan": return engine.buyCaravan(now);
    case "remember": return engine.remember(now);
    case "tutorial": return engine.completeTutorial(command.step);
    case "portrait": return engine.touchPortrait(command.hero, now);
    case "crown": return engine.holdCrown(command.ms);
    case "welcome": return engine.welcomeBack(command.ms);
    case "read": return markRead(engine.state, command.source, command.count);
    case "readAll": {
      for (const source of CHRONICLE_SOURCES) {
        const count = sourceCount(engine.state, source);
        if (seenOf(engine.state, source) < count) engine.state.lore.seen[source] = count;
      }
      return undefined;
    }
    case "settings": {
      const settings = engine.state.settings as unknown as Record<string, unknown>;
      for (const key of SETTING_KEYS) if (key in command.patch) settings[key] = command.patch[key];
      return undefined;
    }
    case "input": return engine.markInput(now);
    case "visible": return engine.setVisible(command.on, now);
    case "locale": {
      engine.locale = command.locale;
      return undefined;
    }
    case "zone": {
      engine.state.zone = command.minutes;
      return undefined;
    }
  }
}
