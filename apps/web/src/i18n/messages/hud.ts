import { defineMessages } from "../define";

type Count = number | string;

/** A stat name set inside a line: lowercased, except an acronym ("DPS") that stays as it is. */
const inSentence = (label: string) => (label === label.toUpperCase() ? label : label.toLowerCase());

/** In-game shell: header, scene, companions panel, powers, toasts, modals, cloud sync. */
export const hud = defineMessages({
  fr: {
    loadingSave: "Chargement de ta partie…",
    loadingWake: "Réveil des compagnons…",
    windowTitles: {
      map: { label: "Carte du monde", shortLabel: "Carte" },
      gear: { label: "Équipement", shortLabel: "Équipement" },
      inventory: { label: "Inventaire", shortLabel: "Sac" },
      market: { label: "Marché d'éclats", shortLabel: "Marché" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall des héros", shortLabel: "Succès" },
      account: { label: "Compte & progression", shortLabel: "Compte" },
      settings: { label: "Paramètres", shortLabel: "Options" }
    },
    header: {
      home: "Accueil Idlebound",
      gold: "Or",
      dpsTitle: "Dégâts par seconde de tes compagnons",
      dpsLabel: "DPS",
      clickTitle: "Dégâts par frappe",
      clickLabel: "Frappe",
      essencesTitle: "Essences : +10 % de DPS chacune tant qu'elles ne sont pas dépensées",
      shardsTitle: "Éclats : à dépenser au marché",
      notSaved: "Non conservé"
    },
    nav: {
      label: "Menus du jeu",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} ${count > 1 ? "fragments non lus" : "fragment non lu"}`
    },
    mobileTabs: {
      label: "Affichage mobile",
      heroes: "Compagnons",
      scene: "Combat en grand"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat : ${biome}, étape ${stage}`,
      attack: "Attaquer le monstre",
      appears: (name: string, hp: string) => `${name} surgit, ${hp} points de vie.`,
      falls: (name: string) => `${name} tombe.`,
      kinds: { boss: "Boss", miniboss: "Élite", treasure: "Trésor", rare: "Errant", normal: "" },
      killProgressTitle: "Monstres à vaincre pour débloquer l'étape suivante",
      killProgress: (kills: Count, total: Count) => `${kills} / ${total} monstres`,
      bossBeaten: "Boss vaincu : tu peux le combattre à nouveau",
      farming: "Étape déjà franchie : farm en cours",
      seconds: (value: string) => `${value} s`
    },
    stageBar: {
      previous: "Étape précédente",
      next: "Étape suivante",
      stage: (stage: Count, boss: boolean) => `Étape ${stage}${boss ? " (boss)" : ""}`,
      autoOn: "Progression automatique activée",
      autoOff: "Progression automatique désactivée : tu restes sur cette étape pour farmer",
      auto: "Auto",
      farm: "Farm"
    },
    buffs: {
      label: "Effets actifs",
      rage: "Rage : DPS ×2",
      fortune: "Fortune : or ×2",
      autoclick: "Frappe : 5 coups/s",
      overcharge: "Surcharge : DPS ×7",
      sharpness: "Affûtage : frappe ×10",
      ritual: (pct: Count) => `Rituel : +${pct} % DPS`,
      patience: (pct: Count) => `Patience : DPS +${pct} %`,
      patienceTaken: (full: Count, taken: Count) => `Tes frappes remplacent ${taken} % du bonus de Patience (DPS +${full} %)`
    },
    skills: {
      label: "Pouvoirs",
      ready: (name: string, key: string, description: string) => `${name} (touche ${key}) : ${description}`,
      cooldown: (time: string) => ` Recharge : ${time}.`,
      minutes: (value: Count) => `${value} min`,
      seconds: (value: Count) => `${value} s`,
      activeSeconds: (value: Count) => `${value}s`
    },
    crystal: {
      catch: "Attraper le cristal errant"
    },
    heroes: {
      title: "Compagnons",
      buyAmount: "Quantité achetée",
      autoSpend: "Achats en ton absence",
      autoSpendHint: "Tes compagnons dépensent l'or gagné en niveaux et talents pour continuer à progresser. Désactive-le pour garder ton or.",
      max: "Max",
      buyAllTalents: (count: number) => `Acheter ${count} talent${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}`,
      click: "Frappe : ",
      dps: "DPS : ",
      dpsPerLevel: (value: string) => `${value} DPS par niveau`,
      share: (pct: Count) => ` · ${pct} %`,
      milestoneTitle: (current: string) => `Palier actuel ×${current}. Le prochain multiplie encore par 3,5`,
      milestone: (level: Count) => ` · palier niv. ${level}`,
      talentsOf: (hero: string) => `Talents de ${hero}`,
      talentOwned: "Acquis",
      talentCost: (cost: string) => `${cost} or`,
      talentLabel: (name: string, text: string, status: string) => `${name} : ${text}. ${status}.`,
      hire: "Recruter",
      train: "S'entraîner",
      buyLabel: (hired: boolean, hero: string, count: number, cost: string) =>
        `${hired ? "Monter" : "Recruter"} ${hero} de ${count} niveau${count > 1 ? "x" : ""} pour ${cost} or`
    },
    effects: {
      heroDps: (hero: string, mult: Count) => `DPS de ${hero} ×${mult}`,
      globalDps: (pct: Count) => `DPS de tous les compagnons +${pct} %`,
      click: (mult: Count) => `Dégâts de frappe ×${mult}`,
      clickDps: (pct: Count) => `Chaque frappe inflige aussi ${pct} % de tes DPS`,
      idleDps: (pct: Count) => `Bonus de Patience : DPS +${pct} % (tes frappes le remplacent, coup pour coup)`,
      critChance: (pct: Count) => `+${pct} % de chances de critique`,
      critDamage: (add: Count) => `Multiplicateur des critiques +${add} (×10 de base)`,
      gold: (pct: Count) => `Or gagné +${pct} %`,
      bossTimer: (seconds: Count) => `+${seconds} s au chrono des boss`,
      treasure: (pct: Count) => `+${pct} % de chances de rat doré`
    },
    altarValue: {
      pct: (value: string) => `+${value} %`,
      seconds: (value: Count) => `+${value} s`,
      stages: (value: Count) => `${value} étapes`,
      none: "aucune",
      stage: (stage: Count) => `étape ${stage}`
    },
    affix: (value: string, label: string) => `+${value} % ${inSentence(label)}`,
    tutorial: {
      ok: "OK",
      okLabel: "Compris",
      hire: "Tu as assez d'or : monte Aldric de niveau pour frapper plus fort.",
      companion: (hero: string) => `Recrute ${hero} : elle attaque même quand ta lame se repose.`,
      boss: "Un boss ! Terrasse-le avant la fin du chrono, sinon tu recules d'une étape.",
      skill: (key: string) => `Nouveau pouvoir débloqué : appuie sur ${key} ou sur son bouton en bas.`,
      farm: "Tu farmes l'étape précédente. Renforce-toi, puis réactive la progression (bouton Farm → Auto).",
      ascend: "Le Roi déchu est tombé ! Ouvre « Ascension » dans le menu pour rejoindre le Sanctuaire du Crépuscule.",
      altarRework: "Les autels ont été refondus : chaque niveau des autels illimités multiplie désormais son effet, et le voyageur fait sauter les premières étapes. Tous tes niveaux t'ont été rendus en essences : choisis de nouveau tes autels dans la fenêtre d'ascension."
    },
    fx: {
      crit: "CRITIQUE",
      companions: "COMPAGNONS",
      shards: (count: number) => `+${count} éclat${count > 1 ? "s" : ""}`
    },
    toasts: {
      bossFailedTitle: "Le boss a résisté",
      bossFailedText: "Renforce tes compagnons puis relance la progression.",
      bossFailedWounded: (pct: number) => `Il garde ses blessures : il reviendra entamé de ${pct} %. Relance la progression, il cédera.`,
      biome: (era: string, stage: Count) => `${era} · étape ${stage}`,
      achievement: (name: string) => `Succès : ${name}`,
      achievementText: (description: string, pct: Count) => `${description} +${pct} % DPS`,
      loot: (rarity: string, level: Count) => `${rarity} · niveau ${level}`,
      skillUnlocked: (name: string) => `Nouveau pouvoir : ${name}`,
      skillUnlockedText: (key: string, description: string) => `Touche ${key} : ${description}`,
      crystalTitle: "Cristal errant !",
      crystal: {
        gold: (amount: string) => `+${amount} pièces d'or`,
        overcharge: (seconds: Count) => `DPS ×7 pendant ${seconds} s`,
        sharpness: (seconds: Count) => `Frappe ×10 pendant ${seconds} s`,
        shards: (amount: number) => `+${amount} éclat${amount > 1 ? "s" : ""}`,
        essence: (amount: number) => `+${amount} essence${amount > 1 ? "s" : ""}`
      },
      ascendedTitle: "Ascension accomplie",
      ascendedText: (essences: string) => `+${essences} essences. Une nouvelle vie commence.`,
      inventoryFull: (item: string, shards: number) => `Inventaire plein : ${item} recyclé (+${shards} éclats).`,
      hourglass: (kills: string) => `Le sablier s'écoule : ${kills} monstres vaincus en un instant.`,
      fragmentTitle: "Un fragment refait surface",
      fragmentMore: "Il t'attend dans la Chronique du Hall.",
      bestiary: (name: string) => `Bestiaire : ${name}`,
      recognition: (name: string, tier: number) =>
        tier === 1 ? `${name} te regarde d'un drôle d'air.` : tier === 5 ? `${name} se souvient de toi.` : `${name} se souvient un peu plus de toi.`,
      secretTitle: "Secret découvert",
      namedTitle: (name: string) => `Relique nommée : ${name}`,
      wandererTitle: (name: string) => `${name} croise ta route`
    },
    cloudChoice: {
      title: "Deux parties trouvées",
      text: "Ton compte contient déjà une partie différente de celle que tu viens de jouer. Laquelle veux-tu garder ? L'autre sera définitivement perdue.",
      best: "Plus avancée",
      bestStage: "Meilleure étape",
      ascensions: "Ascensions",
      playTime: "Temps de jeu",
      lastActivity: "Dernière activité",
      current: "Partie en cours",
      account: "Partie du compte",
      keepCurrent: "Garder la partie en cours",
      takeAccount: "Reprendre la partie du compte",
      weakerTitle: "Effacer la partie du compte ?",
      weakerText: (stage: Count, ascensions: number, time: string) =>
        `La partie du compte va plus loin : étape ${stage}, ${ascensions} ascension${ascensions > 1 ? "s" : ""}, ${time} de jeu. Garder la partie en cours l'efface pour toujours.`
    },
    ledgerAway: {
      title: "Le Grand Livre ne répond pas",
      voice: "Ta route y est toujours écrite. On frappe encore à sa porte.",
      text: (seconds: Count) => `Serveur de jeu injoignable. Ta progression t'y attend : nouvel essai dans ${seconds} s.`,
      trying: "Nouvel essai…",
      offline: "Cet appareil est hors ligne : on réessaie dès le retour du réseau.",
      retry: "Réessayer maintenant"
    },
    modal: {
      close: "Fermer"
    },
    errors: {
      network: "Connexion au serveur impossible. Vérifie ta connexion internet.",
      status: (status: Count) => `Erreur ${status}.`,
      sessionExpired: "Session expirée : reconnecte-toi pour garder ta progression.",
      contextMissing: "Contexte de jeu manquant.",
      tooLarge: "Requête trop volumineuse.",
      unreachable: "Serveur de jeu injoignable. Réessaie dans un instant."
    },
    /** Anti-cheat rejections (HTTP 422), by violation code. */
    violations: {
      generic: "Le Grand Livre refuse : la progression envoyée ne respecte pas les règles du jeu.",
      "stage-order": "Le Grand Livre refuse : l'ordre des étapes est incohérent.",
      "created-at": "Le Grand Livre refuse : la date de création de la partie est impossible.",
      time: "Le Grand Livre refuse : plus de temps de jeu que de temps écoulé.",
      kills: "Le Grand Livre refuse : trop de victoires pour le temps de jeu.",
      clicks: "Le Grand Livre refuse : cadence de frappe impossible.",
      gold: "Le Grand Livre refuse : or gagné trop rapidement.",
      "run-lifetime": "Le Grand Livre refuse : statistiques incohérentes.",
      crits: "Le Grand Livre refuse : trop de coups critiques.",
      hero: "Le Grand Livre refuse : compagnons incohérents.",
      upgrade: "Le Grand Livre refuse : talents incohérents.",
      "gold-ledger": "Le Grand Livre refuse : plus d'or dépensé que gagné.",
      altar: "Le Grand Livre refuse : autels incohérents.",
      "essence-ledger": "Le Grand Livre refuse : plus d'essences dépensées que récoltées.",
      ascension: "Le Grand Livre refuse : historique d'ascensions incohérent.",
      "essence-source": "Le Grand Livre refuse : essences d'origine inconnue.",
      shards: "Le Grand Livre refuse : plus d'éclats possédés que gagnés.",
      inventory: "Le Grand Livre refuse : inventaire trop grand.",
      item: "Le Grand Livre refuse : objet invalide.",
      achievement: "Le Grand Livre refuse : succès non mérité.",
      power: "Le Grand Livre refuse : boss impossible à vaincre avec cette puissance.",
      identity: "Le Grand Livre refuse : cette partie ne prolonge pas celle du compte.",
      rollback: "Le Grand Livre refuse : la progression a reculé.",
      stage: "Le Grand Livre refuse : étapes franchies sans combattre.",
      "lineage-age": "Le Grand Livre refuse : cette partie est trop ancienne par rapport au compte.",
      skills: "Le Grand Livre refuse : pouvoirs incohérents.",
      descent: "Le Grand Livre refuse : Descentes incohérentes.",
      crystals: "Le Grand Livre refuse : plus de cristaux que le temps n'en laisse tomber.",
      hourglasses: "Le Grand Livre refuse : plus de sabliers que tes éclats n'en paient.",
      "shards-earned": "Le Grand Livre refuse : plus d'éclats que tes combats n'en rapportent.",
      version: "Le Grand Livre refuse : cette progression est plus ancienne que celle qu'il garde.",
      "lineage-time": "Le Grand Livre refuse : cette partie compte plus de temps que le compte n'en a vécu."
    } as Record<string, string>
  },
  en: {
    loadingSave: "Loading your game…",
    loadingWake: "Waking up your companions…",
    windowTitles: {
      map: { label: "World map", shortLabel: "Map" },
      gear: { label: "Equipment", shortLabel: "Gear" },
      inventory: { label: "Inventory", shortLabel: "Bag" },
      market: { label: "Shard market", shortLabel: "Market" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall of heroes", shortLabel: "Feats" },
      account: { label: "Account & progress", shortLabel: "Account" },
      settings: { label: "Settings", shortLabel: "Settings" }
    },
    header: {
      home: "Idlebound home",
      gold: "Gold",
      dpsTitle: "Damage per second of your companions",
      dpsLabel: "DPS",
      clickTitle: "Damage per strike",
      clickLabel: "Strike",
      essencesTitle: "Essences: +10% DPS each as long as they are not spent",
      shardsTitle: "Shards: spend them at the market",
      notSaved: "Not kept"
    },
    nav: {
      label: "Game menus",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} unread ${count > 1 ? "fragments" : "fragment"}`
    },
    mobileTabs: {
      label: "Mobile view",
      heroes: "Companions",
      scene: "Full combat view"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat: ${biome}, stage ${stage}`,
      attack: "Attack the monster",
      appears: (name: string, hp: string) => `${name} appears, ${hp} health.`,
      falls: (name: string) => `${name} falls.`,
      kinds: { boss: "Boss", miniboss: "Elite", treasure: "Treasure", rare: "Wanderer", normal: "" },
      killProgressTitle: "Monsters to defeat to unlock the next stage",
      killProgress: (kills: Count, total: Count) => `${kills} / ${total} monsters`,
      bossBeaten: "Boss defeated: you can fight it again",
      farming: "Stage already cleared: farming",
      seconds: (value: string) => `${value}s`
    },
    stageBar: {
      previous: "Previous stage",
      next: "Next stage",
      stage: (stage: Count, boss: boolean) => `Stage ${stage}${boss ? " (boss)" : ""}`,
      autoOn: "Auto-advance on",
      autoOff: "Auto-advance off: you stay on this stage to farm",
      auto: "Auto",
      farm: "Farm"
    },
    buffs: {
      label: "Active effects",
      rage: "Rage: DPS ×2",
      fortune: "Fortune: gold ×2",
      autoclick: "Striking: 5 blows/s",
      overcharge: "Overcharge: DPS ×7",
      sharpness: "Sharpness: strike ×10",
      ritual: (pct: Count) => `Ritual: +${pct}% DPS`,
      patience: (pct: Count) => `Patience: DPS +${pct}%`,
      patienceTaken: (full: Count, taken: Count) => `Your strikes stand in for ${taken}% of the Patience bonus (DPS +${full}%)`
    },
    skills: {
      label: "Powers",
      ready: (name: string, key: string, description: string) => `${name} (key ${key}): ${description}`,
      cooldown: (time: string) => ` Cooldown: ${time}.`,
      minutes: (value: Count) => `${value}m`,
      seconds: (value: Count) => `${value}s`,
      activeSeconds: (value: Count) => `${value}s`
    },
    crystal: {
      catch: "Catch the wandering crystal"
    },
    heroes: {
      title: "Companions",
      buyAmount: "Amount to buy",
      autoSpend: "Spend while away",
      autoSpendHint: "Your companions spend the gold they earn on levels and talents to keep progressing. Turn it off to keep your gold.",
      max: "Max",
      buyAllTalents: (count: number) => `Buy ${count} available talent${count > 1 ? "s" : ""}`,
      click: "Strike: ",
      dps: "DPS: ",
      dpsPerLevel: (value: string) => `${value} DPS per level`,
      share: (pct: Count) => ` · ${pct}%`,
      milestoneTitle: (current: string) => `Current milestone ×${current}. The next one multiplies by 3.5 again`,
      milestone: (level: Count) => ` · milestone lv. ${level}`,
      talentsOf: (hero: string) => `${hero}'s talents`,
      talentOwned: "Owned",
      talentCost: (cost: string) => `${cost} gold`,
      talentLabel: (name: string, text: string, status: string) => `${name}: ${text}. ${status}.`,
      hire: "Hire",
      train: "Train",
      buyLabel: (hired: boolean, hero: string, count: number, cost: string) =>
        `${hired ? "Level up" : "Hire"} ${hero} by ${count} level${count > 1 ? "s" : ""} for ${cost} gold`
    },
    effects: {
      heroDps: (hero: string, mult: Count) => `${hero}'s DPS ×${mult}`,
      globalDps: (pct: Count) => `All companions' DPS +${pct}%`,
      click: (mult: Count) => `Strike damage ×${mult}`,
      clickDps: (pct: Count) => `Each strike also deals ${pct}% of your DPS`,
      idleDps: (pct: Count) => `Patience bonus: DPS +${pct}% (your strikes stand in for it, blow for blow)`,
      critChance: (pct: Count) => `+${pct}% critical hit chance`,
      critDamage: (add: Count) => `Critical multiplier +${add} (×10 base)`,
      gold: (pct: Count) => `Gold earned +${pct}%`,
      bossTimer: (seconds: Count) => `+${seconds}s on the boss timer`,
      treasure: (pct: Count) => `+${pct}% golden rat chance`
    },
    altarValue: {
      pct: (value: string) => `+${value}%`,
      seconds: (value: Count) => `+${value}s`,
      stages: (value: Count) => `${value} stages`,
      none: "none",
      stage: (stage: Count) => `stage ${stage}`
    },
    affix: (value: string, label: string) => `+${value}% ${inSentence(label)}`,
    tutorial: {
      ok: "OK",
      okLabel: "Got it",
      hire: "You have enough gold: level up Aldric to hit harder.",
      companion: (hero: string) => `Hire ${hero}: she attacks even while your blade rests.`,
      boss: "A boss! Defeat it before the timer runs out, or you'll fall back one stage.",
      skill: (key: string) => `New power unlocked: press ${key} or use its button at the bottom.`,
      farm: "You're farming the previous stage. Get stronger, then turn progression back on (Farm → Auto button).",
      ascend: "The Fallen King has fallen! Open “Ascension” in the menu to reach the Sanctum of Dusk.",
      altarRework: "The altars have been reworked: each level of an open-ended altar now multiplies its effect, and the Wanderer skips the first stages. All your levels were refunded in essences: pick your altars again in the ascension window."
    },
    fx: {
      crit: "CRITICAL",
      companions: "COMPANIONS",
      shards: (count: number) => `+${count} shard${count > 1 ? "s" : ""}`
    },
    toasts: {
      bossFailedTitle: "The boss held on",
      bossFailedText: "Strengthen your companions, then resume progression.",
      bossFailedWounded: (pct: number) => `It keeps its wounds: it will come back ${pct}% down. Resume progression, it will give way.`,
      biome: (era: string, stage: Count) => `${era} · stage ${stage}`,
      achievement: (name: string) => `Achievement: ${name}`,
      achievementText: (description: string, pct: Count) => `${description} +${pct}% DPS`,
      loot: (rarity: string, level: Count) => `${rarity} · level ${level}`,
      skillUnlocked: (name: string) => `New power: ${name}`,
      skillUnlockedText: (key: string, description: string) => `Key ${key}: ${description}`,
      crystalTitle: "Wandering crystal!",
      crystal: {
        gold: (amount: string) => `+${amount} gold`,
        overcharge: (seconds: Count) => `DPS ×7 for ${seconds}s`,
        sharpness: (seconds: Count) => `Strike ×10 for ${seconds}s`,
        shards: (amount: number) => `+${amount} shard${amount > 1 ? "s" : ""}`,
        essence: (amount: number) => `+${amount} essence${amount > 1 ? "s" : ""}`
      },
      ascendedTitle: "Ascension complete",
      ascendedText: (essences: string) => `+${essences} essences. A new life begins.`,
      inventoryFull: (item: string, shards: number) => `Inventory full: ${item} salvaged (+${shards} shards).`,
      hourglass: (kills: string) => `The hourglass runs out: ${kills} monsters defeated in an instant.`,
      fragmentTitle: "A fragment surfaces",
      fragmentMore: "It waits in the Chronicle, in the Hall.",
      bestiary: (name: string) => `Bestiary: ${name}`,
      recognition: (name: string, tier: number) =>
        tier === 1 ? `${name} looks at you strangely.` : tier === 5 ? `${name} remembers you.` : `${name} remembers you a little more.`,
      secretTitle: "Secret found",
      namedTitle: (name: string) => `Named relic: ${name}`,
      wandererTitle: (name: string) => `${name} crosses your path`
    },
    cloudChoice: {
      title: "Two games found",
      text: "Your account already holds a different game from the one you just played. Which one do you want to keep? The other will be lost for good.",
      best: "Further along",
      bestStage: "Best stage",
      ascensions: "Ascensions",
      playTime: "Play time",
      lastActivity: "Last activity",
      current: "Current game",
      account: "Account game",
      keepCurrent: "Keep the current game",
      takeAccount: "Resume the account game",
      weakerTitle: "Erase the account game?",
      weakerText: (stage: Count, ascensions: number, time: string) =>
        `The account game goes further: stage ${stage}, ${ascensions} ascension${ascensions === 1 ? "" : "s"}, ${time} of play. Keeping the current game erases it for good.`
    },
    ledgerAway: {
      title: "The Ledger does not answer",
      voice: "Your road is still written there. Someone keeps knocking at its door.",
      text: (seconds: Count) => `Can't reach the game server. Your progress is waiting there: trying again in ${seconds} s.`,
      trying: "Trying again…",
      offline: "This device is offline: we try again as soon as the network is back.",
      retry: "Try now"
    },
    modal: {
      close: "Close"
    },
    errors: {
      network: "Can't reach the server. Check your internet connection.",
      status: (status: Count) => `Error ${status}.`,
      sessionExpired: "Session expired: log in again to keep your progress.",
      contextMissing: "Game context is missing.",
      tooLarge: "Request too large.",
      unreachable: "Game server unreachable. Try again in a moment."
    },
    violations: {
      generic: "The Ledger refuses: the progress sent does not follow the game rules.",
      "stage-order": "The Ledger refuses: the stage order is inconsistent.",
      "created-at": "The Ledger refuses: the game's creation date is impossible.",
      time: "The Ledger refuses: more play time than elapsed time.",
      kills: "The Ledger refuses: too many kills for the play time.",
      clicks: "The Ledger refuses: impossible strike rate.",
      gold: "The Ledger refuses: gold earned too fast.",
      "run-lifetime": "The Ledger refuses: inconsistent statistics.",
      crits: "The Ledger refuses: too many critical hits.",
      hero: "The Ledger refuses: inconsistent companions.",
      upgrade: "The Ledger refuses: inconsistent talents.",
      "gold-ledger": "The Ledger refuses: more gold spent than earned.",
      altar: "The Ledger refuses: inconsistent altars.",
      "essence-ledger": "The Ledger refuses: more essences spent than collected.",
      ascension: "The Ledger refuses: inconsistent ascension history.",
      "essence-source": "The Ledger refuses: essences of unknown origin.",
      shards: "The Ledger refuses: more shards owned than earned.",
      inventory: "The Ledger refuses: inventory too large.",
      item: "The Ledger refuses: invalid item.",
      achievement: "The Ledger refuses: unearned achievement.",
      power: "The Ledger refuses: boss impossible to beat with this power.",
      identity: "The Ledger refuses: this game does not continue the account's game.",
      rollback: "The Ledger refuses: progress went backwards.",
      stage: "The Ledger refuses: stages cleared without fighting.",
      "lineage-age": "The Ledger refuses: this game is too old compared to the account.",
      skills: "The Ledger refuses: inconsistent powers.",
      descent: "The Ledger refuses: inconsistent Descents.",
      crystals: "The Ledger refuses: more crystals than time lets fall.",
      hourglasses: "The Ledger refuses: more hourglasses than your shards could buy.",
      "shards-earned": "The Ledger refuses: more shards than your fights could yield.",
      version: "The Ledger refuses: this progress is older than the one it keeps.",
      "lineage-time": "The Ledger refuses: this game claims more time than the account has lived."
    } as Record<string, string>
  }
});
