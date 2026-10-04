import { BESTIARY, CLICK_HERO_ID, HEROES, NAMED_RELICS, gameText, type Locale } from "@idlebound/game";
import { messages } from "@/i18n/messages";
import { wikiHref } from "@/i18n/routing";
import { TOPICS } from "./catalog";
import { FACTS } from "./facts";
import { creatureGate, companionGate } from "./entryGates";
import type { SearchItem } from "./WikiSearch";

const CACHE = new Map<Locale, SearchItem[]>();

/** Everything the wiki's search finds: topics, their sections, and every entry page. */
export function searchIndex(locale: Locale): SearchItem[] {
  const cached = CACHE.get(locale);
  if (cached) return cached;
  const t = messages(locale);
  const g = gameText(locale);
  const w = t.wiki;
  const items: SearchItem[] = [];
  for (const topic of TOPICS) {
    const title = w.topics[topic.id].title;
    items.push({ title, context: w.nav.home, href: wikiHref(locale, topic.id), keywords: w.topics[topic.id].short, kind: "topic" });
    for (const section of t.wikiArticles[topic.id](FACTS).sections) {
      items.push({ title: section.title, context: title, href: `${wikiHref(locale, topic.id)}#${section.id}`, kind: "section" });
    }
  }
  for (const hero of HEROES) {
    const text = g.heroes[hero.id];
    items.push({
      title: text.name,
      context: w.topics.companions.title,
      href: wikiHref(locale, "companions", hero.id),
      keywords: text.title,
      kind: "entry",
      gate: hero.id === CLICK_HERO_ID ? undefined : companionGate(hero.id)
    });
  }
  for (const entry of BESTIARY) {
    items.push({
      title: g.monsters[entry.id] ?? entry.id,
      context: w.topics.bestiary.title,
      href: wikiHref(locale, "bestiary", entry.id),
      keywords: g.bestiaryPages[entry.page],
      kind: "entry",
      gate: creatureGate(entry.id)
    });
  }
  for (const relic of NAMED_RELICS) {
    items.push({
      title: g.relics[relic.id].name,
      context: w.topics.relics.title,
      href: wikiHref(locale, "relics", relic.id),
      keywords: `${g.slots[relic.slot]} ${g.rarities[relic.rarity]}`,
      kind: "entry",
      gate: { kind: "named", id: relic.id }
    });
  }
  CACHE.set(locale, items);
  return items;
}
