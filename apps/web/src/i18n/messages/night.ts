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
      map: "La carte est ouverte : reviens sur une étape déjà franchie pour gagner de l'or sans risque.",
      gear: "Ta première relique : équipe-la pour ajouter ses bonus à ta compagnie.",
      market: "Tu as assez d'éclats pour le marché : coffres de reliques, potions et sablier s'y achètent en éclats.",
      ascension: "Le Sanctuaire du Crépuscule s'ouvre : l'ascension te fait recommencer la route contre des essences, que les autels changent en bonus permanents.",
      hall: "Le Grand Livre t'ouvre une page : hauts faits (ils augmentent tes dégâts), Bestiaire et Chronique.",
      loom: "La Descente s'ouvre au Sanctuaire, au Métier d'Eldra : elle efface tes essences et tes autels, et te donne des fils qui achètent des bonus que rien n'efface.",
      caravan: "La Roulotte du Comptoir est au marché : une marchandise rare à payer en éclats, qui change chaque semaine.",
      promise: "Au Sanctuaire, un compagnon te demande ta parole : une règle à tenir toute la nuit. Tenue, elle double ses dégâts pour toujours.",
      altars2: "Trois nouveaux autels au Sanctuaire : le Temps, le Marchandage et le Trésor.",
      altars3: "Les six derniers autels du Sanctuaire s'éveillent : treize en tout, à présent."
    },
    /** How a timed event ends, won or not. */
    results: {
      seam: { won: "Brèche refermée : son or, un fragment, parfois un éclat ou une relique.", escaped: "La Brèche se referme sans toi. Tu ne perds rien." },
      quiet: { won: "Le Silence se défait : son or et un fragment.", escaped: "Le Silence passe son chemin. Tu ne perds rien." },
      stray: { won: "L'armure tombe, vide : son or, et une relique nommée la première fois.", escaped: "L'armure s'éloigne. Tu ne perds rien." },
      wager: { won: "Pip perd son pari et paie une bourse d'or.", escaped: "Pip détale en riant avec son or. Tu ne perds rien." }
    },
    walkerNamed: (name: string, seconds: Count) => `L'écho de ${name} se bat à tes côtés : DPS ×1,25 pendant ${seconds} s.`,
    wager: {
      label: "Pari de Pip",
      strikes: (count: Count, total: Count) => `${count} / ${total} coups`
    },
    eventTimer: (name: string, seconds: string) => `${name} · ${seconds} s`,
    descendedTitle: "La Descente",
    descendedText: (threads: string) => `+${threads} fils à dépenser au Sanctuaire, dans la Descente. Essences et autels sont effacés, la route reprend à l'étape 1.`,
    cutscene: {
      skip: "Passer",
      next: "Continuer",
      keptTitle: "Les scènes du Grand Livre",
      kept: (count: number) => (count === 1 ? "Une scène de ta marche t'attend dans la Chronique, au Hall. Tu peux la revoir quand tu veux." : `${count} scènes de ta marche t'attendent dans la Chronique, au Hall. Tu peux les revoir quand tu veux.`)
    },
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
      talent: (hero: string) => `Talent acheté · ${hero}`,
      passed: (stage: Count) => `Étape ${stage} · la compagnie est passée`,
      wall: (stage: Count) => `Étape ${stage} · a d'abord repoussé la compagnie, puis est tombé`,
      blocked: (stage: Count) => `Étape ${stage} · bloque encore la compagnie : renforce-la pour passer`,
      moreGuardians: (count: number) => (count === 1 ? "Un autre gardien franchi" : `${count} autres gardiens franchis`),
      moreTalents: (count: number) => (count === 1 ? "Un autre talent acheté" : `${count} autres talents achetés`),
      still: "La compagnie a gardé la route. Rien n'a bougé.",
      fragment: "Fragment trouvé",
      moreFragments: (count: number) => (count === 1 ? "Un autre fragment t'attend dans la Chronique" : `${count} autres fragments t'attendent dans la Chronique`),
      resume: "Reprendre la route"
    },
    buffs: {
      walker: "Écho d'un marcheur : DPS ×1,25",
      cheese: "Fromage de Pip : rats dorés ×2",
      lantern: "Lanterne aux phalènes : cristaux plus fréquents",
      reunion: "Retrouvailles : dégâts des compagnons ×3"
    },
    darkNight: "Garder le ciel du Royaume",
    darkNightHint: "Plus tu descends, plus le ciel du décor pâlit. Active cette option pour garder le ciel sombre du premier Âge. Rien ne change au jeu.",
    map: {
      stratum: "Strate",
      stratumOption: (label: string, start: Count, end: Count) => `${label} (étapes ${start} à ${end})`
    }
  },
  en: {
    reveal: {
      map: "The map is open: go back to a stage you already cleared to earn gold safely.",
      gear: "Your first relic: equip it to add its bonuses to your company.",
      market: "You have enough shards for the market: relic chests, potions and the hourglass are bought there with shards.",
      ascension: "The Sanctum of Dusk opens: ascending starts the road over for essences, which the altars turn into permanent bonuses.",
      hall: "The Ledger opens a page for you: deeds (they raise your damage), Bestiary and Chronicle.",
      loom: "The Descent opens in the Sanctum, at Eldra's Loom: it wipes your essences and altars, and gives you threads that buy bonuses nothing can take away.",
      caravan: "The Stallkeeper's Caravan is at the market: one rare ware, paid in shards, that changes every week.",
      promise: "In the Sanctum, a companion asks for your word: one rule to keep all night. Kept, it doubles their damage for good.",
      altars2: "Three new altars in the Sanctum: Time, Bargain and Treasure.",
      altars3: "The last six altars of the Sanctum wake: thirteen in all, now."
    },
    results: {
      seam: { won: "Seam closed: its gold, a fragment, sometimes a shard or a relic.", escaped: "The Seam closes without you. You lose nothing." },
      quiet: { won: "The Quiet comes apart: its gold and a fragment.", escaped: "The Quiet moves on. You lose nothing." },
      stray: { won: "The armor falls, empty: its gold, and a named relic the first time.", escaped: "The armor walks away. You lose nothing." },
      wager: { won: "Pip loses his bet and pays a purse of gold.", escaped: "Pip runs off laughing with his gold. You lose nothing." }
    },
    walkerNamed: (name: string, seconds: Count) => `The echo of ${name} fights beside you: DPS ×1.25 for ${seconds}s.`,
    wager: {
      label: "Pip's Wager",
      strikes: (count: Count, total: Count) => `${count} / ${total} strikes`
    },
    eventTimer: (name: string, seconds: string) => `${name} · ${seconds}s`,
    descendedTitle: "The Descent",
    descendedText: (threads: string) => `+${threads} threads to spend in the Sanctum, under Descent. Essences and altars are wiped, the road starts again at stage 1.`,
    cutscene: {
      skip: "Skip",
      next: "Continue",
      keptTitle: "The Ledger's scenes",
      kept: (count: number) => (count === 1 ? "A scene of your walk waits in the Chronicle, in the Hall. Watch it whenever you like." : `${count} scenes of your walk wait in the Chronicle, in the Hall. Watch them whenever you like.`)
    },
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
      talent: (hero: string) => `Talent bought · ${hero}`,
      passed: (stage: Count) => `Stage ${stage} · the company went through`,
      wall: (stage: Count) => `Stage ${stage} · pushed the company back first, then fell`,
      blocked: (stage: Count) => `Stage ${stage} · still stops the company: strengthen it to get through`,
      moreGuardians: (count: number) => (count === 1 ? "One more guardian passed" : `${count} more guardians passed`),
      moreTalents: (count: number) => (count === 1 ? "One more talent bought" : `${count} more talents bought`),
      still: "The company held the road. Nothing moved.",
      fragment: "Fragment found",
      moreFragments: (count: number) => (count === 1 ? "One more fragment waits in the Chronicle" : `${count} more fragments wait in the Chronicle`),
      resume: "Back on the road"
    },
    buffs: {
      walker: "Echo of a Walker: DPS ×1.25",
      cheese: "Pip's Cheese: golden rats ×2",
      lantern: "Moth Lantern: crystals come sooner",
      reunion: "Reunion: companion damage ×3"
    },
    darkNight: "Keep the Kingdom's sky",
    darkNightHint: "The deeper you go, the paler the sky behind the fight. Turn this on to keep the dark sky of the first Age. Nothing else in the game changes.",
    map: {
      stratum: "Stratum",
      stratumOption: (label: string, start: Count, end: Count) => `${label} (stages ${start} to ${end})`
    }
  }
});
