import { defineMessages } from "../define";

/**
 * The places past the King: the Sanctum of Dusk (altar legends, the King's shadow on the
 * confirm), Eldra's Loom (the Descent, the Weaves), the Stallkeeper's stall and the
 * Caravan, and the armory's Regalia and Crown.
 */
export const sanctum = defineMessages({
  fr: {
    sanctumTab: "Sanctuaire",
    loomTab: "Descente",
    kingWaits: "Le Roi attend au bout de la route.",
    legendSummary: "Légende de l'autel",
    /** The Promise (BIBLE 12.11): the word given to one companion at dusk. */
    promise: {
      title: "La Promesse",
      hint: (pct: number, max: number) => `Au crépuscule, donne ta parole à un compagnon : toute la nuit suivante, tu ne peux pas faire ce que sa règle interdit. Elle est tenue si tu respectes sa règle jusqu'à ton crépuscule et qu'un Roi tombe cette nuit. Chaque parole tenue double les dégâts de ce compagnon pour toujours, ${max} fois au plus (×${2 ** max}). Ses deux derniers souvenirs en demandent aussi une chacun, et le dernier lui donne encore +${pct} % de dégâts.`,
      tonight: "Cette nuit",
      none: "Aucune parole cette nuit : aucune règle ne te limite.",
      choose: "Choisir un compagnon pour la prochaine nuit",
      give: "Donner ma parole",
      giveNext: "Choisir pour la prochaine nuit",
      chosen: "Choisi pour la prochaine nuit",
      takeBack: "Annuler",
      giveLabel: (name: string, tonight: boolean) => `${name} : ${tonight ? "donner ma parole pour cette nuit" : "donner ma parole au prochain crépuscule"}`,
      bound: (name: string) => `Ta parole à ${name} :`,
      noWeapon: "Équipe d'abord une arme : c'est elle qu'il te demande de laisser.",
      rested: "Déjà ta parole cette nuit. Un même compagnon ne peut pas l'avoir deux nuits de suite.",
      restedLast: "Déjà ta parole la nuit dernière. Un même compagnon ne peut pas l'avoir deux nuits de suite.",
      doubles: "Tenue, cette nuit compte aussi double pour sa Reconnaissance, si son niveau atteint 100.",
      reward: (total: number) => `Tenue : ses dégâts doublent pour toujours (×${total} en tout).`,
      fulfilled: (names: string, total: number) => `Toutes leurs paroles sont tenues, leurs dégâts ×${total} pour toujours : ${names}.`,
      breakWord: "Rompre ma parole",
      breakTitle: "Rompre ta parole ?",
      breakText: "Sa règle ne s'applique plus et tu ne perds aucune force. Mais cette parole ne doublera pas ses dégâts, ne comptera pas pour sa Reconnaissance, et tu ne pourras pas en donner une autre avant le prochain crépuscule.",
      breakLabel: "Rompre",
      status: {
        given: "Parole donnée",
        ready: "Condition remplie",
        broken: "Parole rompue"
      },
      statusHint: {
        given: "Pas encore tenue : fais ce qu'elle demande avant ton crépuscule.",
        ready: "Respecte encore sa règle jusqu'à ton crépuscule, et elle sera tenue.",
        broken: "Sa règle ne s'applique plus. Cette nuit compte comme une nuit ordinaire."
      },
      kept: (count: number, max: number, total: number) => `${count} / ${max} parole${count > 1 ? "s" : ""} tenue${count > 1 ? "s" : ""} · dégâts ×${total}`,
      needs: (promises: number) => (promises === 1 ? "Son prochain souvenir demande encore 1 parole tenue." : `Son prochain souvenir demande encore ${promises} paroles tenues.`),
      /** What each kind of promise asks, in plain words. */
      rules: {
        without: (name: string) => `Ne pas recruter ${name} de la nuit.`,
        withoutSelf: "Marcher sans lui : ne pas le recruter de la nuit.",
        headGuardian: (name: string) => `Ne recruter aucun compagnon venu après ${name} avant d'avoir vaincu le premier gardien.`,
        headKing: (name: string) => `Ne recruter aucun compagnon venu après ${name} avant d'avoir vaincu le Roi.`,
        wait: (guardian: string, seconds: number) => `Contre ${guardian}, personne ne frappe pendant les ${seconds} premières secondes de chaque combat. Il doit tomber cette nuit.`,
        waitKing: (seconds: number) => `Contre le Roi, personne ne frappe pendant les ${seconds} premières secondes de chaque combat.`,
        strikes: "Ne pas frapper toi-même de la nuit : seuls tes compagnons attaquent.",
        powers: "N'utiliser aucun pouvoir de la nuit.",
        shards: "Ne dépenser aucun éclat de la nuit, ni au marché ni à la forge.",
        crystals: "Ne toucher aucun cristal errant de la nuit.",
        essences: "Ne dépenser aucune essence aux autels de la nuit.",
        unfailing: "Ne perdre aucun combat contre une élite ou un gardien à la fin du chrono. La progression s'arrête d'elle-même devant ceux que la compagnie ne peut pas battre.",
        seam: (pct: number) => `Toute la nuit, le chrono des élites et gardiens ne dure que ${pct} % de son temps.`,
        anvil: "Ton arme ne donne aucun bonus de la nuit, et tu ne peux ni la changer ni la forger.",
        further: (stage: number) => `Dépasser l'étape ${stage}, où la dernière nuit s'est arrêtée.`,
        furtherNext: "Dépasser l'étape où s'arrête la nuit en cours.",
        strata: (kings: number) => `${kings} Rois doivent tomber cette nuit.`,
        king: "Le Roi doit tomber cette nuit."
      },
      toasts: {
        given: (name: string) => `Parole donnée · ${name}`,
        ready: "Parole remplie",
        readyText: "Ce qui t'était demandé est fait. Respecte encore sa règle jusqu'à ton crépuscule, et elle sera tenue.",
        kept: (name: string) => `Parole tenue · ${name}`,
        keptText: (total: number) => `Ses dégâts doublent pour toujours : ×${total} en tout. Elle compte aussi pour sa Reconnaissance.`,
        broken: (name: string) => `Parole rompue · ${name}`,
        brokenText: "Sa règle ne s'applique plus, mais cette parole ne double pas ses dégâts et ne compte pas pour sa Reconnaissance.",
        held: (name: string) => `Refusé : tu as donné ta parole à ${name}`,
        heldText: (rule: string) => `${rule} Pour le faire quand même, romps ta parole (Ascension, La Promesse).`
      }
    },
    loom: {
      descents: "Descentes",
      threads: "Fils",
      threadsTotal: (total: string) => `Total tissé : ${total}`,
      takesTitle: "La Descente prend",
      takes: ["Tes essences", "Les niveaux de tous tes autels", "Tout ce que prend une ascension : or, compagnons et talents, étape"],
      keepsTitle: "Elle laisse",
      keeps: ["Ton équipement, tes reliques et tes éclats", "Tes hauts faits, la Chronique et le Bestiaire", "La Reconnaissance de tes compagnons", "Ta meilleure étape, tes fils et tes Tissages"],
      stonesKept: (pct: number) => `Pierres mémoires : tu gardes ${pct} % des niveaux de chaque autel.`,
      preview: "Descendre maintenant te donnerait",
      threadsCount: (count: string) => `${count} fils`,
      nextThread: (stage: number) => `Prochain fil à l'étape ${stage}. Seule une étape plus profonde que ton record donne de nouveaux fils.`,
      descend: "Descendre",
      confirmTitle: "Descendre ?",
      confirmText: (threads: string, none: boolean) =>
        `${none ? "Tu ne gagneras aucun fil : va d'abord plus loin que ton record d'étape." : `Tu gagnes ${threads} fils, à dépenser en Tissages permanents.`} Tu perds tes essences et les niveaux de tous tes autels, et comme à l'ascension ton or, tes compagnons et ton étape. Tu gardes ton équipement, tes éclats, tes hauts faits, la Chronique et la Reconnaissance.`,
      confirmLabel: "Descendre",
      weaves: "Tissages",
      weavesHint: "Dépense tes fils ici. Ces améliorations sont permanentes : aucune Descente ne les retire.",
      weaveLabel: (name: string, cost: string) => `Tisser ${name} : ${cost} fils`,
      weaveLevel: (level: number, max: number): string => (max ? `niv. ${level} / ${max}` : `niv. ${level}`),
      woven: "Au maximum",
      power: "Nouveau pouvoir"
    },
    stall: {
      discount: (pct: number) => `Jeton : -${pct} % sur tous les prix ici`,
      oldPrice: (price: string) => `Prix sans le Jeton : ${price}`
    },
    caravan: {
      ware: "Offre de la semaine, un seul achat",
      buy: "Acheter",
      bought: "Achat fait. La Roulotte repart et revient la semaine prochaine avec une autre offre.",
      left: "La Roulotte est repartie. Elle revient la semaine prochaine avec une nouvelle offre.",
      tokenOwned: "Tu as déjà le Jeton. On ne peut en avoir qu'un.",
      packFull: (room: number) => (room > 1 ? `Il te faut ${room} places libres dans ton sac.` : "Il te faut une place libre dans ton sac.")
    },
    armory: {
      regalia: "Regalia d'Orvane",
      regaliaWorn: (pct: number) => `Les trois pièces portées ensemble : +${pct} % de dégâts contre le Roi.`,
      crownSlot: "Cinquième emplacement"
    }
  },
  en: {
    sanctumTab: "Sanctum",
    loomTab: "Descent",
    kingWaits: "The King waits at the end of the road.",
    legendSummary: "Altar legend",
    promise: {
      title: "The Promise",
      hint: (pct: number, max: number) => `At dusk, give your word to one companion: for the whole next night, you cannot do what their rule forbids. It is kept if you hold to their rule until your dusk and a King falls that night. Every word kept doubles that companion's damage for good, ${max} times at most (×${2 ** max}). Their last two memories also ask for one each, and the last one gives them another +${pct}% damage.`,
      tonight: "Tonight",
      none: "No word given tonight: no rule limits you.",
      choose: "Choose a companion for the next night",
      give: "Give my word",
      giveNext: "Choose for next night",
      chosen: "Chosen for next night",
      takeBack: "Cancel",
      giveLabel: (name: string, tonight: boolean) => `${name}: ${tonight ? "give my word for tonight" : "give my word at the next dusk"}`,
      bound: (name: string) => `Your word to ${name}:`,
      noWeapon: "Equip a weapon first: that is what he asks you to leave behind.",
      rested: "They already have your word tonight. A companion cannot have it two nights running.",
      restedLast: "They had your word last night. A companion cannot have it two nights running.",
      doubles: "Kept, this night also counts twice toward their Recognition, if they reach level 100.",
      reward: (total: number) => `Kept: their damage doubles for good (×${total} in all).`,
      fulfilled: (names: string, total: number) => `Every word kept, their damage ×${total} for good: ${names}.`,
      breakWord: "Break my word",
      breakTitle: "Break your word?",
      breakText: "Their rule no longer applies and you lose no strength. But this word will not double their damage nor count toward their Recognition, and you cannot give another before the next dusk.",
      breakLabel: "Break it",
      status: {
        given: "Word given",
        ready: "Condition met",
        broken: "Word broken"
      },
      statusHint: {
        given: "Not kept yet: do what it asks before your dusk.",
        ready: "Keep to its rule until your dusk, and it is kept.",
        broken: "Their rule no longer applies. This night counts as an ordinary one."
      },
      kept: (count: number, max: number, total: number) => `${count} / ${max} word${count === 1 ? "" : "s"} kept · damage ×${total}`,
      needs: (promises: number) => (promises === 1 ? "Their next memory still needs 1 word kept." : `Their next memory still needs ${promises} words kept.`),
      rules: {
        without: (name: string) => `Do not hire ${name} all night.`,
        withoutSelf: "Walk without them: do not hire them all night.",
        headGuardian: (name: string) => `Hire no companion who comes after ${name} until you beat the first guardian.`,
        headKing: (name: string) => `Hire no companion who comes after ${name} until you beat the King.`,
        wait: (guardian: string, seconds: number) => `Against ${guardian}, nobody strikes for the first ${seconds}s of every fight. It must fall this night.`,
        waitKing: (seconds: number) => `Against the King, nobody strikes for the first ${seconds}s of every fight.`,
        strikes: "Do not strike yourself all night: only your companions attack.",
        powers: "Use no power all night.",
        shards: "Spend no shard all night, at the market or the forge.",
        crystals: "Touch no wandering crystal all night.",
        essences: "Spend no essence at the altars all night.",
        unfailing: "Lose no fight to an elite or guardian when the timer runs out. Progression stops on its own before those the company cannot beat.",
        seam: (pct: number) => `All night, the timer of elites and guardians runs only ${pct}% of its time.`,
        anvil: "Your weapon gives no bonus all night, and you cannot swap or forge it.",
        further: (stage: number) => `Go past stage ${stage}, where the last night stopped.`,
        furtherNext: "Go past the stage where the current night stops.",
        strata: (kings: number) => `${kings} Kings must fall this night.`,
        king: "The King must fall this night."
      },
      toasts: {
        given: (name: string) => `Word given · ${name}`,
        ready: "Word fulfilled",
        readyText: "What was asked of you is done. Keep to its rule until your dusk, and it is kept.",
        kept: (name: string) => `Word kept · ${name}`,
        keptText: (total: number) => `Their damage doubles for good: ×${total} in all. It also counts toward their Recognition.`,
        broken: (name: string) => `Word broken · ${name}`,
        brokenText: "Their rule no longer applies, but this word does not double their damage nor count toward their Recognition.",
        held: (name: string) => `Refused: you gave your word to ${name}`,
        heldText: (rule: string) => `${rule} To do it anyway, break your word (Ascension, The Promise).`
      }
    },
    loom: {
      descents: "Descents",
      threads: "Threads",
      threadsTotal: (total: string) => `Total woven: ${total}`,
      takesTitle: "A Descent takes",
      takes: ["Your essences", "The levels of every altar", "Everything an ascension takes: gold, companions and talents, stage"],
      keepsTitle: "It leaves",
      keeps: ["Your gear, relics and shards", "Your deeds, the Chronicle and the Bestiary", "Your companions' Recognition", "Your best stage, your threads and your Weaves"],
      stonesKept: (pct: number) => `Remembered Stones: you keep ${pct}% of each altar's levels.`,
      preview: "Descending now would give",
      threadsCount: (count: string) => `${count} ${count === "1" ? "thread" : "threads"}`,
      nextThread: (stage: number) => `Next thread at stage ${stage}. Only a stage deeper than your record gives new threads.`,
      descend: "Descend",
      confirmTitle: "Descend?",
      confirmText: (threads: string, none: boolean) =>
        `${none ? "You will gain no thread: first go deeper than your stage record." : `You gain ${threads} ${threads === "1" ? "thread" : "threads"}, to spend on permanent Weaves.`} You lose your essences and every altar's levels, and, as with an ascension, your gold, companions and stage. You keep your gear, shards, deeds, the Chronicle and Recognition.`,
      confirmLabel: "Descend",
      weaves: "Weaves",
      weavesHint: "Spend your threads here. These upgrades are permanent: no Descent takes them away.",
      weaveLabel: (name: string, cost: string) => `Weave ${name}: ${cost} ${cost === "1" ? "thread" : "threads"}`,
      weaveLevel: (level: number, max: number) => (max ? `lv. ${level} / ${max}` : `lv. ${level}`),
      woven: "Maxed",
      power: "New power"
    },
    stall: {
      discount: (pct: number) => `Token: -${pct}% on every price here`,
      oldPrice: (price: string) => `Price without the Token: ${price}`
    },
    caravan: {
      ware: "This week's offer, one purchase only",
      buy: "Buy",
      bought: "Bought. The Caravan moves on and comes back next week with another offer.",
      left: "The Caravan left. It comes back next week with a new offer.",
      tokenOwned: "You already have the Token. You can only own one.",
      packFull: (room: number) => `You need ${room} free ${room > 1 ? "spaces" : "space"} in your pack.`
    },
    armory: {
      regalia: "Regalia of Orvane",
      regaliaWorn: (pct: number) => `All three pieces worn together: +${pct}% damage against the King.`,
      crownSlot: "Fifth slot"
    }
  }
});
