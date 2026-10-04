import type { TopicId } from "../catalog";
import type { WikiContext } from "../format";
import { ascensionSlots, calculatorSlots, combatSlots, companionSlots, powerSlots, promiseSlots, relicSlots, type Slots } from "./rules";
import { accountSlots, bestiarySlots, biomeSlots, chronicleSlots, deedSlots, descentSlots, eventSlots, strataSlots } from "./world";

/** What a topic's article draws in place of its slots. */
export function topicSlots(topic: TopicId, ctx: WikiContext): Slots {
  switch (topic) {
    case "calculator": return calculatorSlots();
    case "combat": return combatSlots(ctx);
    case "companions": return companionSlots(ctx);
    case "powers": return powerSlots(ctx);
    case "ascension": return ascensionSlots(ctx);
    case "promise": return promiseSlots(ctx);
    case "relics": return relicSlots(ctx);
    case "bestiary": return bestiarySlots(ctx);
    case "biomes": return biomeSlots(ctx);
    case "strata": return strataSlots(ctx);
    case "events": return eventSlots(ctx);
    case "chronicle": return chronicleSlots(ctx);
    case "deeds": return deedSlots(ctx);
    case "descent": return descentSlots(ctx);
    case "account": return accountSlots(ctx);
    case "getting-started":
    case "faq":
    case "idle":
      return {};
  }
}
