import { defineMessages } from "../define";

type Count = number | string;

/**
 * The shell as the night unfolds: first appearances of the interface, events of the Long
 * Night as toasts and timers, the Descent, the new powers' effects, the dark night setting
 * and the strata in the map.
 */
export const night = defineMessages({
  fr: {
    /** Toast text of an element's first appearance (its title is the window's name). */
    reveal: {
      map: "La route garde les étapes franchies. Tu peux y revenir.",
      gear: "Une relique. Tu peux la porter.",
      market: "Tes premiers éclats. Le Comptoir les échange au marché.",
      ascension: "Le Sanctuaire du Crépuscule s'ouvre : l'ascension et les autels t'y attendent.",
      hall: "Le Grand Livre t'ouvre une page : hauts faits, Bestiaire, Chronique.",
      loom: "Eldra t'attend au Sanctuaire. Son Métier défait la nuit, un fil plus bas.",
      caravan: "La Roulotte du Comptoir passe entre les nuits. Une marchandise par semaine, au marché.",
      promise: "Au crépuscule, un compagnon peut recevoir ta parole pour la nuit. Un seul. Au Sanctuaire."
    },
    /** How a timed event ends, won or not. */
    results: {
      seam: { won: "La Brèche est refermée.", escaped: "La Brèche se referme sans toi." },
      quiet: { won: "Le Silence se défait.", escaped: "Le Silence passe son chemin." },
      stray: { won: "L'armure tombe, vide.", escaped: "L'armure s'éloigne, hors de vue." },
      wager: { won: "Pip paie, et perd le compte.", escaped: "Pip détale en riant." }
    },
    walkerNamed: (name: string, seconds: Count) => `L'écho de ${name} se bat à tes côtés pendant ${seconds} s.`,
    wager: {
      label: "Pari de Pip",
      strikes: (count: Count, total: Count) => `${count} / ${total} coups`
    },
    eventTimer: (name: string, seconds: string) => `${name} · ${seconds} s`,
    descendedTitle: "La Descente",
    descendedText: (threads: string) => `+${threads} fils. La nuit reprend, un fil plus bas.`,
    cutscene: { skip: "Passer", next: "Continuer" },
    reunionTitle: "Retrouvailles",
    reunionText: (duration: string) => `La compagnie a tenu la route sans toi. Elle frappe trois fois plus fort pendant ${duration}.`,
    /** What the company tells the walker back at the Reunion. */
    account: {
      away: "Absence",
      road: "Route",
      roadValue: (from: Count, to: Count) => (from === to ? `Étape ${to}` : `Étape ${from} → ${to}`),
      earned: "Or gagné",
      spent: "Or dépensé",
      moments: "Sur la route",
      companions: "La compagnie",
      hired: "A rejoint la compagnie",
      talent: (hero: string) => `Technique retrouvée · ${hero}`,
      passed: (stage: Count) => `Étape ${stage} · la compagnie est passée`,
      wall: (stage: Count) => `Étape ${stage} · a tenu une fois, puis a cédé`,
      blocked: (stage: Count) => `Étape ${stage} · barre encore la route`,
      moreGuardians: (count: number) => (count === 1 ? "Un autre gardien franchi" : `${count} autres gardiens franchis`),
      moreTalents: (count: number) => (count === 1 ? "Une autre technique retrouvée" : `${count} autres techniques retrouvées`),
      still: "La compagnie a gardé la route. Rien n'a bougé.",
      resume: "Reprendre la route"
    },
    buffs: {
      walker: "Écho d'un marcheur : DPS ×1,25",
      cheese: "Fromage de Pip : rats dorés ×2",
      lantern: "Lanterne aux phalènes : cristaux plus fréquents",
      reunion: "Retrouvailles : dégâts des compagnons ×3"
    },
    darkNight: "Garder le ciel du Royaume",
    darkNightHint: "En descendant, le ciel pâlit : c'est la route. Coche pour garder la nuit du premier Âge.",
    map: {
      stratum: "Strate",
      stratumOption: (label: string, start: Count, end: Count) => `${label} (étapes ${start} à ${end})`
    }
  },
  en: {
    reveal: {
      map: "The road keeps the stages behind you. You can walk back.",
      gear: "A relic. You can wear it.",
      market: "Your first shards. The Stallkeeper trades for them at the market.",
      ascension: "The Sanctum of Dusk opens: ascension and the altars wait for you there.",
      hall: "The Ledger opens a page for you: deeds, Bestiary, Chronicle.",
      loom: "Eldra waits in the Sanctum. Her Loom unweaves the night, one thread deeper.",
      caravan: "The Stallkeeper's Caravan travels between nights. One ware a week, at the market.",
      promise: "At dusk, one companion can be given your word for the night. Only one. In the Sanctum."
    },
    results: {
      seam: { won: "The Seam holds shut.", escaped: "The Seam closes without you." },
      quiet: { won: "The Quiet comes apart.", escaped: "The Quiet moves on." },
      stray: { won: "The armor falls, empty.", escaped: "The armor walks out of sight." },
      wager: { won: "Pip pays up, and loses count.", escaped: "Pip runs off, laughing." }
    },
    walkerNamed: (name: string, seconds: Count) => `The echo of ${name} fights beside you for ${seconds}s.`,
    wager: {
      label: "Pip's Wager",
      strikes: (count: Count, total: Count) => `${count} / ${total} strikes`
    },
    eventTimer: (name: string, seconds: string) => `${name} · ${seconds}s`,
    descendedTitle: "The Descent",
    descendedText: (threads: string) => `+${threads} threads. The night begins again, one thread lower.`,
    cutscene: { skip: "Skip", next: "Continue" },
    reunionTitle: "Reunion",
    reunionText: (duration: string) => `The company held the road without you. It strikes three times harder for ${duration}.`,
    account: {
      away: "Away",
      road: "Road",
      roadValue: (from: Count, to: Count) => (from === to ? `Stage ${to}` : `Stage ${from} → ${to}`),
      earned: "Gold earned",
      spent: "Gold spent",
      moments: "On the road",
      companions: "The company",
      hired: "Joined the company",
      talent: (hero: string) => `Technique remembered · ${hero}`,
      passed: (stage: Count) => `Stage ${stage} · the company went through`,
      wall: (stage: Count) => `Stage ${stage} · held once, then gave way`,
      blocked: (stage: Count) => `Stage ${stage} · still bars the road`,
      moreGuardians: (count: number) => (count === 1 ? "One more guardian passed" : `${count} more guardians passed`),
      moreTalents: (count: number) => (count === 1 ? "One more technique remembered" : `${count} more techniques remembered`),
      still: "The company held the road. Nothing moved.",
      resume: "Back on the road"
    },
    buffs: {
      walker: "Echo of a Walker: DPS ×1.25",
      cheese: "Pip's Cheese: golden rats ×2",
      lantern: "Moth Lantern: crystals come sooner",
      reunion: "Reunion: companion damage ×3"
    },
    darkNight: "Keep the Kingdom's sky",
    darkNightHint: "The sky pales as you descend, as the road intends. Check to keep the night of the first Age.",
    map: {
      stratum: "Stratum",
      stratumOption: (label: string, start: Count, end: Count) => `${label} (stages ${start} to ${end})`
    }
  }
});
