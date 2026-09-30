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
    /** The Promise (BIBLE 12.11): the word given to one companion at dusk. */
    promise: {
      title: "La Promesse",
      hint: "Au crépuscule, tu donnes ta parole à un seul compagnon, jamais le même deux soirs de suite. Elle vaut toute la nuit : ce qu'elle interdit t'est refusé tant qu'elle tient. Tenue, le Roi tombé, elle reste dans son souvenir. Les deux que ses derniers souvenirs attendent comptent la nuit double, s'il a atteint le niveau 100.",
      tonight: "Cette nuit",
      none: "Tu n'as donné ta parole à personne cette nuit.",
      choose: "À qui donner ta parole",
      give: "Donner ma parole",
      giveNext: "Au prochain crépuscule",
      chosen: "Choisi pour le prochain crépuscule",
      takeBack: "Reprendre",
      giveLabel: (name: string, tonight: boolean) => `${name} : ${tonight ? "donner ma parole pour cette nuit" : "donner ma parole au prochain crépuscule"}`,
      noWeapon: "Il te faut une arme à lui laisser.",
      rested: "Ta parole de cette nuit. Personne ne demande deux soirs de suite.",
      breakWord: "Rompre ma parole",
      breakTitle: "Rompre ta parole ?",
      breakText: "Ce qui t'a été demandé ne te retient plus, et tu ne perds aucune force. Mais cette nuit ne comptera pas double, et tu ne pourras plus donner ta parole avant le prochain crépuscule.",
      breakLabel: "Rompre",
      status: {
        given: "Parole donnée",
        ready: "Tenue jusqu'ici",
        broken: "Parole rompue"
      },
      statusHint: {
        given: "Elle tiendra au crépuscule si ce qu'elle demande est fait.",
        ready: "Elle tiendra au crépuscule, si rien ne la rompt d'ici là.",
        broken: "Rien ne te retient plus. La nuit compte comme les autres."
      },
      kept: (count: number) => (count === 0 ? "Aucune parole tenue" : count === 1 ? "1 parole tenue" : `${count} paroles tenues`),
      needs: (promises: number) => (promises === 1 ? "Son prochain souvenir attend une parole tenue." : `Son prochain souvenir attend ${promises} paroles tenues.`),
      /** What each kind of promise asks, in plain words. */
      rules: {
        without: (name: string) => `Ne pas recruter ${name} de la nuit.`,
        withoutSelf: "Marcher sans lui : ne pas le recruter de la nuit.",
        headGuardian: (name: string) => `Personne après ${name} ne rejoint la compagnie avant la chute du premier gardien.`,
        headKing: (name: string) => `Personne après ${name} ne rejoint la compagnie avant la chute du Roi.`,
        wait: (guardian: string, seconds: number) => `Face à ce gardien (${guardian}), aucun coup pendant ${seconds} s, à chaque combat. Il doit tomber cette nuit.`,
        waitKing: (seconds: number) => `Face au Roi, aucun coup pendant ${seconds} s, à chaque combat.`,
        strikes: "Aucune frappe de ta main de la nuit.",
        powers: "Aucun pouvoir de la nuit.",
        shards: "Aucun éclat dépensé de la nuit, au marché comme à la forge.",
        crystals: "Aucun cristal attrapé de la nuit.",
        essences: "Aucune essence offerte aux autels de la nuit.",
        unfailing: "Aucune couture ne doit se refermer sur toi. La compagnie n'entre seule que dans celles qu'elle peut tenir.",
        seam: (pct: number) => `Élites et gardiens : ${pct} % du temps seulement, toute la nuit.`,
        anvil: "Ton arme ne compte pas de la nuit, et tu n'y touches pas.",
        further: (stage: number) => `Dépasser l'étape ${stage}, où la dernière nuit s'est arrêtée.`,
        furtherNext: "Aller plus loin que la nuit qui s'achève.",
        strata: (kings: number) => `${kings} Rois doivent tomber cette nuit.`,
        king: "Le Roi doit tomber cette nuit."
      },
      toasts: {
        given: (name: string) => `Parole donnée · ${name}`,
        ready: "Ta parole tient",
        readyText: "Ce qui t'était demandé est fait. Elle tiendra au crépuscule, si rien ne la rompt.",
        kept: (name: string) => `Parole tenue · ${name}`,
        broken: (name: string) => `Parole rompue · ${name}`,
        held: (name: string) => `Ta parole te retient · ${name}`,
        heldText: (rule: string) => `${rule} Tu peux la rompre au Sanctuaire.`
      }
    },
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
    promise: {
      title: "The Promise",
      hint: "At dusk you give your word to one companion, never the same two nights running. It holds all night: what it forbids is refused while it stands. Kept, with the King fallen, it stays in their memory. The two words their last memories wait for count the night twice, if they reached level 100.",
      tonight: "Tonight",
      none: "You gave your word to no one tonight.",
      choose: "Whom to give your word",
      give: "Give my word",
      giveNext: "At the next dusk",
      chosen: "Chosen for the next dusk",
      takeBack: "Take back",
      giveLabel: (name: string, tonight: boolean) => `${name}: ${tonight ? "give my word for tonight" : "give my word at the next dusk"}`,
      noWeapon: "You need a weapon to leave with him.",
      rested: "Tonight's word. Nobody asks two nights running.",
      breakWord: "Break my word",
      breakTitle: "Break your word?",
      breakText: "What was asked of you no longer binds you, and you lose no strength. But this night will not count twice, and you cannot give your word again before the next dusk.",
      breakLabel: "Break it",
      status: {
        given: "Word given",
        ready: "Kept so far",
        broken: "Word broken"
      },
      statusHint: {
        given: "It will hold at dusk if what it asks is done.",
        ready: "It will hold at dusk, if nothing breaks it before then.",
        broken: "Nothing binds you any more. The night counts like any other."
      },
      kept: (count: number) => (count === 0 ? "No word kept" : count === 1 ? "1 word kept" : `${count} words kept`),
      needs: (promises: number) => (promises === 1 ? "Their next memory waits for a word kept." : `Their next memory waits for ${promises} words kept.`),
      rules: {
        without: (name: string) => `Do not hire ${name} all night.`,
        withoutSelf: "Walk without them: do not hire them all night.",
        headGuardian: (name: string) => `Nobody past ${name} joins the company until the first guardian falls.`,
        headKing: (name: string) => `Nobody past ${name} joins the company until the King falls.`,
        wait: (guardian: string, seconds: number) => `Facing this guardian (${guardian}), no blow for ${seconds}s, in every fight. It must fall this night.`,
        waitKing: (seconds: number) => `Facing the King, no blow for ${seconds}s, in every fight.`,
        strikes: "No strike of your own all night.",
        powers: "No power all night.",
        shards: "No shard spent all night, at the market or the forge.",
        crystals: "No crystal caught all night.",
        essences: "No essence offered to the altars all night.",
        unfailing: "No seam may close on you. Alone, the company only walks into those it can hold.",
        seam: (pct: number) => `Elites and guardians: only ${pct}% of the time, all night.`,
        anvil: "Your weapon counts for nothing all night, and you leave it be.",
        further: (stage: number) => `Go past stage ${stage}, where the last night stopped.`,
        furtherNext: "Go deeper than the night now ending.",
        strata: (kings: number) => `${kings} Kings must fall this night.`,
        king: "The King must fall this night."
      },
      toasts: {
        given: (name: string) => `Word given · ${name}`,
        ready: "Your word holds",
        readyText: "What was asked of you is done. It will hold at dusk, if nothing breaks it.",
        kept: (name: string) => `Word kept · ${name}`,
        broken: (name: string) => `Word broken · ${name}`,
        held: (name: string) => `Your word holds you · ${name}`,
        heldText: (rule: string) => `${rule} You can break it in the Sanctum.`
      }
    },
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
