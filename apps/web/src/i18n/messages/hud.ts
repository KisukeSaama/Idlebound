import { defineMessages } from "../define";

type Count = number | string;

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
      account: { label: "Sauvegarde & compte", shortLabel: "Compte" },
      settings: { label: "Paramètres", shortLabel: "Options" }
    },
    header: {
      home: "Accueil Idlebound",
      gold: "Or",
      dpsTitle: "Dégâts par seconde de tes compagnons",
      clickTitle: "Dégâts par clic",
      clickLabel: "Clic",
      essencesTitle: "Essences : +10 % de DPS chacune tant qu'elles ne sont pas dépensées",
      shardsTitle: "Éclats : à dépenser au marché",
      notSaved: "Non sauvegardé"
    },
    nav: {
      label: "Menus du jeu",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} ${count > 1 ? "fragments non lus" : "fragment non lu"}`
    },
    mobileTabs: {
      label: "Affichage mobile",
      heroes: "Compagnons",
      scene: "Combat plein écran"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat : ${biome}, étape ${stage}`,
      attack: "Attaquer le monstre",
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
      autoclick: "Frappe : 5 clics/s",
      overcharge: "Surcharge : DPS ×7",
      sharpness: "Affûtage : clic ×10",
      ritual: (pct: Count) => `Rituel : +${pct} % DPS`,
      patience: (pct: Count) => `Patience : DPS +${pct} %`,
      patiencePending: (full: Count, seconds: Count) => `La Patience remonte : DPS +${full} % dans ${seconds} s si tu ne cliques pas`
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
      click: "Clic : ",
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
      click: (mult: Count) => `Dégâts de clic ×${mult}`,
      clickDps: (pct: Count) => `Chaque clic inflige aussi ${pct} % de tes DPS`,
      idleDps: (pct: Count) => `DPS +${pct} % quand tu ne cliques pas (plein effet en 30 s)`,
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
    affix: (value: string, label: string) => `+${value} % ${label.toLowerCase()}`,
    tutorial: {
      ok: "OK",
      okLabel: "Compris",
      hire: "Tu as assez d'or : monte Aldric de niveau pour frapper plus fort.",
      companion: (hero: string) => `Recrute ${hero} : elle attaque même quand tu ne cliques pas.`,
      boss: "Un boss ! Terrasse-le avant la fin du chrono, sinon tu recules d'une étape.",
      skill: (key: string) => `Nouveau pouvoir débloqué : appuie sur ${key} ou clique dessus en bas.`,
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
        sharpness: (seconds: Count) => `Clic ×10 pendant ${seconds} s`,
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
      takeAccount: "Reprendre la partie du compte"
    },
    modal: {
      close: "Fermer"
    },
    errors: {
      network: "Connexion au serveur impossible. Vérifie ta connexion internet.",
      status: (status: Count) => `Erreur ${status}.`,
      sessionExpired: "Session expirée : reconnecte-toi pour sauvegarder ta progression.",
      contextMissing: "Contexte de jeu manquant."
    },
    /** Anti-cheat rejections (HTTP 422), by violation code. */
    violations: {
      generic: "Sauvegarde refusée : la progression envoyée ne respecte pas les règles du jeu.",
      "stage-order": "Sauvegarde refusée : l'ordre des étapes est incohérent.",
      "created-at": "Sauvegarde refusée : la date de création de la partie est impossible.",
      time: "Sauvegarde refusée : plus de temps de jeu que de temps écoulé.",
      kills: "Sauvegarde refusée : trop de victoires pour le temps de jeu.",
      clicks: "Sauvegarde refusée : cadence de clics impossible.",
      gold: "Sauvegarde refusée : or gagné trop rapidement.",
      "run-lifetime": "Sauvegarde refusée : statistiques incohérentes.",
      crits: "Sauvegarde refusée : trop de coups critiques.",
      hero: "Sauvegarde refusée : compagnons incohérents.",
      upgrade: "Sauvegarde refusée : talents incohérents.",
      "gold-ledger": "Sauvegarde refusée : plus d'or dépensé que gagné.",
      altar: "Sauvegarde refusée : autels incohérents.",
      "essence-ledger": "Sauvegarde refusée : plus d'essences dépensées que récoltées.",
      ascension: "Sauvegarde refusée : historique d'ascensions incohérent.",
      "essence-source": "Sauvegarde refusée : essences d'origine inconnue.",
      shards: "Sauvegarde refusée : plus d'éclats possédés que gagnés.",
      inventory: "Sauvegarde refusée : inventaire trop grand.",
      item: "Sauvegarde refusée : objet invalide.",
      achievement: "Sauvegarde refusée : succès non mérité.",
      power: "Sauvegarde refusée : boss impossible à vaincre avec cette puissance.",
      identity: "Sauvegarde refusée : cette partie ne prolonge pas celle du compte.",
      rollback: "Sauvegarde refusée : la progression a reculé.",
      stage: "Sauvegarde refusée : étapes franchies sans combattre.",
      "lineage-age": "Sauvegarde refusée : cette partie est trop ancienne par rapport au compte."
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
      account: { label: "Save & account", shortLabel: "Account" },
      settings: { label: "Settings", shortLabel: "Settings" }
    },
    header: {
      home: "Idlebound home",
      gold: "Gold",
      dpsTitle: "Damage per second of your companions",
      clickTitle: "Damage per click",
      clickLabel: "Click",
      essencesTitle: "Essences: +10% DPS each as long as they are not spent",
      shardsTitle: "Shards: spend them at the market",
      notSaved: "Not saved"
    },
    nav: {
      label: "Game menus",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} unread ${count > 1 ? "fragments" : "fragment"}`
    },
    mobileTabs: {
      label: "Mobile view",
      heroes: "Companions",
      scene: "Full-screen combat"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat: ${biome}, stage ${stage}`,
      attack: "Attack the monster",
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
      autoclick: "Striking: 5 clicks/s",
      overcharge: "Overcharge: DPS ×7",
      sharpness: "Sharpness: click ×10",
      ritual: (pct: Count) => `Ritual: +${pct}% DPS`,
      patience: (pct: Count) => `Patience: DPS +${pct}%`,
      patiencePending: (full: Count, seconds: Count) => `Patience is building up: DPS +${full}% in ${seconds}s if you don't click`
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
      autoSpendHint: "Your companions spend the gold they earn on levels and talents to keep progressing. Turn it off to save your gold.",
      max: "Max",
      buyAllTalents: (count: number) => `Buy ${count} available talent${count > 1 ? "s" : ""}`,
      click: "Click: ",
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
      click: (mult: Count) => `Click damage ×${mult}`,
      clickDps: (pct: Count) => `Each click also deals ${pct}% of your DPS`,
      idleDps: (pct: Count) => `DPS +${pct}% while you don't click (full effect within 30s)`,
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
    affix: (value: string, label: string) => `+${value}% ${label.toLowerCase()}`,
    tutorial: {
      ok: "OK",
      okLabel: "Got it",
      hire: "You have enough gold: level up Aldric to hit harder.",
      companion: (hero: string) => `Hire ${hero}: she attacks even when you don't click.`,
      boss: "A boss! Defeat it before the timer runs out, or you'll fall back one stage.",
      skill: (key: string) => `New power unlocked: press ${key} or click it at the bottom.`,
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
        sharpness: (seconds: Count) => `Click ×10 for ${seconds}s`,
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
      takeAccount: "Resume the account game"
    },
    modal: {
      close: "Close"
    },
    errors: {
      network: "Can't reach the server. Check your internet connection.",
      status: (status: Count) => `Error ${status}.`,
      sessionExpired: "Session expired: log in again to save your progress.",
      contextMissing: "Game context is missing."
    },
    violations: {
      generic: "Save rejected: the progress sent does not follow the game rules.",
      "stage-order": "Save rejected: the stage order is inconsistent.",
      "created-at": "Save rejected: the game's creation date is impossible.",
      time: "Save rejected: more play time than elapsed time.",
      kills: "Save rejected: too many kills for the play time.",
      clicks: "Save rejected: impossible click rate.",
      gold: "Save rejected: gold earned too fast.",
      "run-lifetime": "Save rejected: inconsistent statistics.",
      crits: "Save rejected: too many critical hits.",
      hero: "Save rejected: inconsistent companions.",
      upgrade: "Save rejected: inconsistent talents.",
      "gold-ledger": "Save rejected: more gold spent than earned.",
      altar: "Save rejected: inconsistent altars.",
      "essence-ledger": "Save rejected: more essences spent than collected.",
      ascension: "Save rejected: inconsistent ascension history.",
      "essence-source": "Save rejected: essences of unknown origin.",
      shards: "Save rejected: more shards owned than earned.",
      inventory: "Save rejected: inventory too large.",
      item: "Save rejected: invalid item.",
      achievement: "Save rejected: unearned achievement.",
      power: "Save rejected: boss impossible to beat with this power.",
      identity: "Save rejected: this game does not continue the account's game.",
      rollback: "Save rejected: progress went backwards.",
      stage: "Save rejected: stages cleared without fighting.",
      "lineage-age": "Save rejected: this game is too old compared to the account."
    } as Record<string, string>
  }
});
