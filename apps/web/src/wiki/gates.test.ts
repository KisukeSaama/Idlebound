import { BESTIARY, HEROES, NAMED_RELICS, createInitialState, gameText } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { messages } from "@/i18n/messages";
import { ENTRY_TOPICS, TOPIC_IDS } from "./catalog";
import { companionGate, creatureGate } from "./entryGates";
import { FACTS } from "./facts";
import { gateMet, gateProgress, type Gate } from "./gates";

describe("the wiki's reveal gates", () => {
  it("keeps every revelation closed to a game that has just begun", () => {
    const state = createInitialState();
    const gates: Gate[] = [
      { kind: "stage", stage: 51 },
      { kind: "ascensions", count: 1 },
      { kind: "descents", count: 1 },
      { kind: "kills", id: "lost-shepherd", count: 1 },
      { kind: "hired", hero: "maelle" },
      { kind: "tier", hero: "maelle", tier: 1 },
      { kind: "kept", hero: "maelle" },
      { kind: "named", id: "oathcutter" },
      { kind: "secret", id: "faceless" },
      { kind: "event", id: "seam" },
      { kind: "echo", biome: "green-plains", index: 1 },
      { kind: "milestone", id: "ascend-1" },
      { kind: "lesson", id: "aldric-10" },
      { kind: "altar", id: "might" },
      { kind: "cutscene", id: "first-dusk" }
    ];
    for (const gate of gates) expect(gateMet(state, gate), gate.kind).toBe(false);
  });

  it("opens what the game has lived, and only that", () => {
    const state = createInitialState();
    state.maxStageEver = 812;
    state.lifetime.ascensions = 3;
    state.lifetime.bestHired = 3;
    state.bestiary["lost-shepherd"] = 4;
    state.named.push("oathcutter");
    state.secrets.push("faceless");
    state.lore.echoes["green-plains"] = 2;
    state.lore.lessons.push("aldric-10");

    expect(gateMet(state, { kind: "stage", stage: 812 })).toBe(true);
    expect(gateMet(state, { kind: "stage", stage: 813 })).toBe(false);
    expect(gateMet(state, { kind: "ascensions", count: 3 })).toBe(true);
    expect(gateMet(state, { kind: "ascensions", count: 4 })).toBe(false);
    expect(gateMet(state, { kind: "kills", id: "lost-shepherd", count: 1 })).toBe(true);
    expect(gateMet(state, { kind: "kills", id: "lost-shepherd", count: 5 })).toBe(false);
    // Aldric, Maëlle and Brom have joined, Ysolde not yet.
    expect(gateMet(state, { kind: "hired", hero: "brom" })).toBe(true);
    expect(gateMet(state, { kind: "hired", hero: "ysolde" })).toBe(false);
    expect(gateMet(state, { kind: "named", id: "oathcutter" })).toBe(true);
    expect(gateMet(state, { kind: "named", id: "quietus" })).toBe(false);
    expect(gateMet(state, { kind: "secret", id: "faceless" })).toBe(true);
    expect(gateMet(state, { kind: "echo", biome: "green-plains", index: 2 })).toBe(true);
    expect(gateMet(state, { kind: "echo", biome: "green-plains", index: 3 })).toBe(false);
    expect(gateMet(state, { kind: "lesson", id: "aldric-10" })).toBe(true);
    expect(gateMet(state, { kind: "milestone", id: "ascend-1" })).toBe(true);
    expect(gateMet(state, { kind: "cutscene", id: "first-dusk" })).toBe(true);
    expect(gateProgress(state, { kind: "stage", stage: 2000 })).toBe(812);
    expect(gateProgress(state, { kind: "named", id: "quietus" })).toBeNull();
  });

  it("leaves the road of the first night open and veils what only later nights meet", () => {
    expect(creatureGate("field-rat")).toBeUndefined();
    expect(creatureGate("ruined-king")).toBeUndefined();
    expect(creatureGate("golden-rat")).toBeUndefined();
    expect(creatureGate("lost-shepherd")).toEqual({ kind: "kills", id: "lost-shepherd", count: 1 });
    expect(creatureGate("aldemar")).toEqual({ kind: "kills", id: "aldemar", count: 1 });
    expect(creatureGate("the-dawn")).toEqual({ kind: "kills", id: "the-dawn", count: 1 });
    expect(companionGate("aldric")).toBeUndefined();
    expect(companionGate("maelle")).toBeUndefined();
    expect(companionGate("awakened")).toEqual({ kind: "hired", hero: "aurelion" });
  });
});

describe("the wiki's contents", () => {
  it("has an entry page for every companion, creature and named relic of the game", () => {
    expect(ENTRY_TOPICS.companions).toEqual(HEROES.map((hero) => hero.id));
    expect(ENTRY_TOPICS.bestiary).toEqual(BESTIARY.map((entry) => entry.id));
    expect(ENTRY_TOPICS.relics).toEqual(NAMED_RELICS.map((relic) => relic.id));
  });

  it("writes every topic in both languages, with the same sections and slots", () => {
    for (const topic of TOPIC_IDS) {
      const fr = messages("fr").wikiArticles[topic](FACTS);
      const en = messages("en").wikiArticles[topic](FACTS);
      expect(fr.sections.map((section) => section.id), topic).toEqual(en.sections.map((section) => section.id));
      const slots = (article: typeof fr) => article.sections.flatMap((section) => section.blocks.flatMap((block) => (typeof block === "object" && "slot" in block ? [block.slot] : [])));
      expect(slots(fr), topic).toEqual(slots(en));
    }
  });

  it("only links to topics that exist", () => {
    const link = /\]\(([a-z-]*)/g;
    for (const locale of ["fr", "en"] as const) {
      for (const topic of TOPIC_IDS) {
        const text = JSON.stringify(messages(locale).wikiArticles[topic](FACTS));
        for (const match of text.matchAll(link)) {
          if (match[1]) expect(TOPIC_IDS as readonly string[], `${locale} ${topic}`).toContain(match[1]);
        }
      }
    }
  });

  it("gives every companion a plain promise rule in both languages", () => {
    for (const hero of HEROES.filter((entry) => entry.id !== "aldric")) {
      expect(messages("fr").wiki.promiseRules[hero.id], hero.id).toBeTruthy();
      expect(messages("en").wiki.promiseRules[hero.id], hero.id).toBeTruthy();
      expect(gameText("fr").promises[hero.id], hero.id).toBeTruthy();
    }
  });
});
