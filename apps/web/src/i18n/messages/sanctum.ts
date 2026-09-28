import { defineMessages } from "../define";

/**
 * The places past the King: the Sanctum of Dusk (altar legends, the King's shadow on the
 * confirm), Eldra's Loom (the Descent, the Weaves), the Stallkeeper's stall and the
 * Caravan, and the armory's Regalia and Crown.
 */
export const sanctum = defineMessages({
  fr: {
    sanctumTab: "Sanctuaire",
    loomTab: "Métier",
    kingWaits: "Le Roi attend au bout de la route.",
    legendSummary: "Qui l'a levé",
    loom: {
      descents: "Descentes",
      threads: "Fils",
      threadsTotal: (total: string) => `Total tissé : ${total}`,
      takesTitle: "La Descente prend",
      takes: ["Tes essences", "Les niveaux de tous tes autels", "Tout ce que prend une ascension : or, compagnons, étape"],
      keepsTitle: "Elle laisse",
      keeps: ["Tes reliques et tes éclats", "Tes succès, la Chronique et le Bestiaire", "La Reconnaissance de tes compagnons", "Ta meilleure étape, tes fils et tes Tissages"],
      stonesKept: (pct: number) => `Pierres mémoires : ${pct} % de chaque niveau d'autel reste.`,
      preview: "Une Descente tisserait maintenant",
      threadsCount: (count: string) => `${count} fils`,
      nextThread: (essences: string) => `Fil suivant à ${essences} essences récoltées depuis la dernière Descente.`,
      descend: "Descendre",
      confirmTitle: "Descendre ?",
      confirmText: (threads: string, none: boolean) =>
        `${none ? "Tu ne tisseras aucun fil." : `Tu tisseras ${threads} fils.`} Tu perds tes essences et les niveaux de tous tes autels, en plus de ce que prend une ascension. Tu gardes tes reliques, tes éclats, tes succès, la Chronique et la Reconnaissance.`,
      confirmLabel: "Descendre",
      weaves: "Tissages",
      weavesHint: "Permanents. Aucune Descente ne les défait.",
      weaveLevel: (level: number, max: number): string => (max ? `niv. ${level} / ${max}` : `niv. ${level}`),
      woven: "Achevé",
      power: "Pouvoir"
    },
    stall: {
      discount: (pct: number) => `-${pct} % avec le Jeton`,
      oldPrice: (price: string) => `Prix sans le Jeton : ${price}`
    },
    caravan: {
      ware: "La marchandise de la semaine",
      buy: "Acheter",
      bought: "Marché conclu. La Roulotte repart.",
      left: "La Roulotte est repartie. Elle revient la semaine prochaine.",
      tokenOwned: "Le Jeton est déjà à ton doigt. Il n'y en a qu'un.",
      packFull: (room: number) => `Il te faut ${room} places libres dans ton sac.`
    },
    armory: {
      regalia: "Regalia d'Orvane",
      regaliaWorn: (pct: number) => `Les trois sont portées. +${pct} % de dégâts contre le Roi.`,
      crownSlot: "Cinquième emplacement"
    }
  },
  en: {
    sanctumTab: "Sanctum",
    loomTab: "Loom",
    kingWaits: "The King waits at the end of the road.",
    legendSummary: "Who raised it",
    loom: {
      descents: "Descents",
      threads: "Threads",
      threadsTotal: (total: string) => `Total woven: ${total}`,
      takesTitle: "A Descent takes",
      takes: ["Your essences", "The levels of every altar", "Everything an ascension takes: gold, companions, stage"],
      keepsTitle: "It leaves",
      keeps: ["Your relics and shards", "Your deeds, the Chronicle and the Bestiary", "Your companions' Recognition", "Your best stage, your threads and your Weaves"],
      stonesKept: (pct: number) => `Remembered Stones: ${pct}% of each altar level stays.`,
      preview: "A Descent would weave now",
      threadsCount: (count: string) => `${count} ${count === "1" ? "thread" : "threads"}`,
      nextThread: (essences: string) => `Next thread at ${essences} essences gathered since the last Descent.`,
      descend: "Descend",
      confirmTitle: "Descend?",
      confirmText: (threads: string, none: boolean) =>
        `${none ? "You will weave no thread." : `You will weave ${threads} ${threads === "1" ? "thread" : "threads"}.`} You lose your essences and the levels of every altar, on top of what an ascension takes. You keep your relics, shards, deeds, the Chronicle and Recognition.`,
      confirmLabel: "Descend",
      weaves: "Weaves",
      weavesHint: "Permanent. No Descent unweaves them.",
      weaveLevel: (level: number, max: number) => (max ? `lv. ${level} / ${max}` : `lv. ${level}`),
      woven: "Complete",
      power: "Power"
    },
    stall: {
      discount: (pct: number) => `-${pct}% with the Token`,
      oldPrice: (price: string) => `Price without the Token: ${price}`
    },
    caravan: {
      ware: "This week's ware",
      buy: "Buy",
      bought: "A deal. The Caravan moves on.",
      left: "The Caravan left. It comes back next week.",
      tokenOwned: "The Token is already on your hand. There is only one.",
      packFull: (room: number) => `You need ${room} free ${room > 1 ? "spaces" : "space"} in your pack.`
    },
    armory: {
      regalia: "Regalia of Orvane",
      regaliaWorn: (pct: number) => `All three are worn. +${pct}% damage against the King.`,
      crownSlot: "Fifth slot"
    }
  }
});
