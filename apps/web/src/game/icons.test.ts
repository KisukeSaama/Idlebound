import { CARAVAN_WARES, MARKET_OFFERS, SKILLS } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { CARAVAN_PICTO, OFFER_PICTO, SKILL_PICTO } from "./icons";

describe("pictos of the interface", () => {
  it("gives every power, stall offer and Caravan ware a picto of its own", () => {
    const names = [
      ...SKILLS.map((skill) => SKILL_PICTO[skill.id]),
      ...MARKET_OFFERS.map((offer) => OFFER_PICTO[offer.id]),
      ...CARAVAN_WARES.map((ware) => CARAVAN_PICTO[ware.id])
    ];
    for (const name of names) expect(name).toBeTruthy();
    expect(new Set(names).size).toBe(names.length);
  });
});
