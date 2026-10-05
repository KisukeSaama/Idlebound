import { defineMessages } from "../define";

type Count = number | string;

/** A stat name set inside a line: lowercased, except an acronym ("DPS") that stays as it is. */
const inSentence = (label: string) => (label === label.toUpperCase() ? label : label.toLowerCase());

/** In-game shell: header, scene, companions panel, powers, toasts, modals, cloud sync. */
export const hud = defineMessages({
  fr: {
    loadingSave: "Chargement de ta partie…",
    loadingWake: "Réveil des compagnons…",
    releaseUpdate: {
      title: "Mise à jour d'Idlebound",
      keeping: "Ta progression est mise à l'abri…",
      installing: "Installation de la nouvelle version…",
      ready: (version: string) => (version ? `La ${version} est prête. Bonne route.` : "La nouvelle version est prête. Bonne route."),
      percent: (value: number) => `${value} %`
    },
    windowTitles: {
      map: { label: "Carte du monde", shortLabel: "Carte" },
      gear: { label: "Équipement", shortLabel: "Équipement" },
      inventory: { label: "Inventaire", shortLabel: "Sac" },
      market: { label: "Marché d'éclats", shortLabel: "Marché" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall des héros", shortLabel: "Hauts faits" },
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
      essencesTitle: "Essences : chacune ajoute +10 % de DPS tant que tu la gardes. Gagnées à l'ascension, dépensées aux autels du Sanctuaire",
      shardsTitle: "Éclats : gagnés sur les gardiens, les cristaux et en recyclant ton butin. À dépenser au marché et à la forge"
    },
    nav: {
      label: "Menus du jeu",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} ${count > 1 ? "fragments non lus" : "fragment non lu"}`
    },
    install: {
      title: "Garde la route à portée de main",
      text: "Installe Idlebound sur cet appareil : le jeu s'ouvrira d'une seule touche, comme une application.",
      install: "Installer",
      decline: "Non merci"
    },
    mobileTabs: {
      heroes: "Compagnons",
      scene: "Combat en grand"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat : ${biome}, étape ${stage}`,
      attack: "Frapper le monstre",
      appears: (name: string, hp: string) => `${name} surgit, ${hp} points de vie.`,
      falls: (name: string) => `${name} tombe.`,
      kinds: { boss: "Gardien", miniboss: "Élite", treasure: "Trésor", rare: "Errant", normal: "" },
      killProgressTitle: "Monstres à vaincre pour débloquer l'étape suivante",
      killProgress: (kills: Count, total: Count) => `${kills} / ${total} monstres`,
      bossBeaten: "Gardien vaincu : tu peux le combattre à nouveau",
      farming: "Étape déjà franchie : tu restes pour l'or",
      seconds: (value: string) => `${value} s`
    },
    stageBar: {
      previous: "Étape précédente",
      next: "Étape suivante",
      stage: (stage: Count, boss: boolean) => `Étape ${stage}${boss ? " (élite ou gardien)" : ""}`,
      autoOn: "Auto : tu passes à l'étape suivante dès que celle-ci est franchie. Appuie pour rester ici et gagner de l'or sans avancer.",
      autoOff: "Rester : tu combats sur cette étape sans avancer, pour l'or. Appuie pour repasser en Auto et reprendre la route.",
      auto: "Auto",
      farm: "Rester"
    },
    buffs: {
      label: "Effets actifs",
      rage: "Rage : DPS ×2",
      fortune: "Fortune : or ×2",
      autoclick: "Frappe automatique : 5 coups/s",
      overcharge: "Surcharge : DPS ×7",
      sharpness: "Affûtage : frappe ×10",
      ritual: (pct: Count) => `Rituel : +${pct} % DPS jusqu'à ta prochaine ascension`,
      ritualShort: (pct: Count) => `+${pct} %`,
      patience: (pct: Count) => `Patience : DPS +${pct} %`,
      patienceShort: (pct: Count) => `+${pct} %`
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
      catch: "Attraper le cristal errant : or, éclats, essence ou bonus temporaire"
    },
    heroes: {
      title: "Compagnons",
      buyAmount: "Quantité achetée",
      autoSpend: "Achats en ton absence",
      autoSpendHint: "Tes compagnons dépensent l'or gagné en niveaux et talents pour continuer à progresser. Désactive-le pour garder ton or.",
      max: "Max",
      buyAllTalents: (count: number) => `Acheter ${count} talent${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}`,
      ready: (count: number) => `${count} achat${count > 1 ? "s" : ""} à ta portée`,
      click: "Frappe : ",
      dps: "DPS : ",
      dpsPerLevel: (value: string) => `${value} DPS par niveau`,
      share: (pct: Count) => ` · ${pct} %`,
      milestoneTitle: (current: string) => `Paliers : dégâts de ce compagnon ×3,5 au niveau 200, puis tous les 25 niveaux. Actuel : ×${current}`,
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
      idleDps: (pct: Count) => `Bonus de Patience : tes compagnons frappent +${pct} % plus fort`,
      critChance: (pct: Count) => `+${pct} % de chances de critique`,
      critDamage: (add: Count) => `Multiplicateur des critiques +${add} (×10 de base)`,
      gold: (pct: Count) => `Or gagné +${pct} %`,
      bossTimer: (seconds: Count) => `+${seconds} s au chrono des élites et gardiens`,
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
      companion: (hero: string) => `Recrute ${hero} : elle inflige des dégâts chaque seconde, même quand tu ne frappes pas.`,
      boss: "Élites et gardiens doivent tomber avant la fin du chrono. Sinon, tu recules d'une étape et tu y restes pour gagner de l'or.",
      skill: (key: string) => `Nouveau pouvoir débloqué : appuie sur ${key} ou sur son bouton en bas.`,
      farm: "Tu restes sur l'étape précédente. Renforce-toi, puis reprends la route (bouton Rester → Auto).",
      ascend: "Le Roi déchu est tombé ! Ouvre « Ascension » dans le menu : tu peux recommencer la route contre des essences, qui renforcent toutes tes nuits suivantes.",
      altarRework: "Les autels ont été refondus : chaque niveau des autels illimités multiplie désormais son effet, et le voyageur fait sauter les premières étapes. Tous tes niveaux t'ont été rendus en essences : choisis de nouveau tes autels dans la fenêtre d'ascension.",
      harvestCap: "L'autel de la récolte a changé : il s'arrête au niveau 5 et demande davantage. Tous ses niveaux t'ont été rendus en essences."
    },
    fx: {
      crit: "CRITIQUE",
      companions: "COMPAGNONS",
      shards: (count: number) => `+${count} éclat${count > 1 ? "s" : ""}`,
      rout: (stage: Count) => `Débandade · étape ${stage}`
    },
    toasts: {
      routTitle: "Débandade",
      routText: "Tu as déjà parcouru cette étape une nuit passée, et ta compagnie écrase ses Vestiges : ils se défont tous d'un coup. L'étape entière tombe avec son or, et la route file ainsi jusqu'au premier monstre qui résiste.",
      count: (count: number) => `x${count}`,
      bossFailedTitle: "La nuit te repousse",
      bossFailedText: "Tu recules d'une étape. Renforce tes compagnons, puis repasse en Auto (bouton Rester) pour le retenter.",
      bossFailedWounded: (pct: number) => `Il garde ses blessures : il reviendra avec ${pct} % de vie en moins. Repasse en Auto (bouton Rester) pour le retenter.`,
      biome: (era: string, stage: Count) => `${era} · étape ${stage}`,
      achievement: (name: string) => `Haut fait : ${name}`,
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
      ascendedText: (essences: string) => `+${essences} essences : chacune ajoute 10 % de DPS tant que tu la gardes. La route recommence.`,
      inventoryFull: (item: string, shards: number) => `Inventaire plein : ${item} recyclé (+${shards} éclats).`,
      hourglass: (kills: string) => `Le sablier s'écoule : ${kills} monstres vaincus en un instant.`,
      fragmentTitle: "Un fragment refait surface",
      fragmentMore: "Il t'attend dans la Chronique du Hall.",
      bestiary: (name: string) => `Bestiaire : ${name}`,
      recognition: (name: string, tier: number) =>
        tier === 1 ? `${name} te reconnaît à peine (souvenir 1 sur 5)` : tier === 5 ? `${name} se souvient de toi : +10 % de dégâts` : `${name} se souvient un peu plus de toi (souvenir ${tier} sur 5)`,
      recognitionManyTitle: "Des visages familiers",
      recognitionMany: (names: string, first: boolean) => `${names} ${first ? "te reconnaissent à peine" : "se souviennent un peu plus de toi"}. Au cinquième souvenir, un compagnon inflige +10 % de dégâts. Leurs souvenirs t'attendent dans la Chronique.`,
      and: " et ",
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
        `La partie du compte va plus loin : étape ${stage}, ${ascensions} ascension${ascensions > 1 ? "s" : ""}, ${time} de jeu. Garder la partie en cours l'efface pour toujours.`,
      /** A guest's game, carried on from another page of the same browser. */
      guest: {
        text: "Une autre page a continué ta partie pendant que tu jouais ici. Laquelle veux-tu garder ? L'autre sera définitivement perdue.",
        kept: "Partie gardée",
        takeKept: "Reprendre la partie gardée",
        weakerTitle: "Effacer la partie gardée ?",
        weakerText: (stage: Count, ascensions: number, time: string) =>
          `La partie gardée va plus loin : étape ${stage}, ${ascensions} ascension${ascensions > 1 ? "s" : ""}, ${time} de jeu. Garder la partie en cours l'efface pour toujours.`
      }
    },
    elsewhere: {
      playHere: "Jouer ici",
      open: {
        title: "Ta partie est ouverte ailleurs",
        voice: "Un seul marcheur, une seule route. Le Grand Livre te voit déjà marcher ailleurs.",
        text: "Ta partie tourne en ce moment sur un autre appareil ou dans une autre page. La reprendre ici l'arrête là-bas, et elle continue d'ici telle que le serveur l'a gardée."
      },
      taken: {
        title: "Ta partie continue ailleurs",
        voice: "Ta route s'écrit ailleurs à présent. Le Grand Livre t'attend là où tu marches.",
        text: "Tu as repris ta partie sur un autre appareil ou dans une autre page, alors elle s'est arrêtée ici. Tu peux la reprendre ici à tout moment : elle s'arrêtera là-bas."
      }
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
      status: (status: Count) => `Le serveur a répondu par une erreur (${status}). Réessaie dans un instant.`,
      sessionExpired: "Session expirée : reconnecte-toi pour garder ta progression.",
      contextMissing: "Le jeu n'a pas pu démarrer. Recharge la page."
    },
    /** Anti-cheat rejections (HTTP 422), by violation code. */
    violations: {
      generic: "Cette progression ne respecte pas les règles du jeu.",
      "stage-order": "Les étapes franchies ne se suivent pas dans l'ordre.",
      "created-at": "La date de début de cette partie est impossible. L'horloge de ton appareil est peut-être déréglée.",
      time: "Cette partie compte plus de temps de jeu qu'il ne s'en est écoulé. L'horloge de ton appareil est peut-être déréglée.",
      kills: "Plus de monstres vaincus que le temps de jeu ne le permet.",
      clicks: "Plus de frappes par seconde qu'une main ne peut en donner.",
      gold: "Or gagné plus vite que le jeu ne le permet.",
      "run-lifetime": "Les statistiques de cette nuit dépassent celles de toute la partie.",
      crits: "Plus de coups critiques que de coups portés.",
      hero: "Les niveaux ou les recrues des compagnons sont impossibles.",
      upgrade: "Un talent est inconnu, acheté deux fois ou acheté trop tôt.",
      "gold-ledger": "Plus d'or dépensé que gagné.",
      altar: "Un autel est inconnu, au-delà de son niveau maximal ou élevé trop tôt.",
      "essence-ledger": "Plus d'essences dépensées que récoltées.",
      ascension: "L'historique des ascensions est impossible.",
      "essence-source": "Plus d'essences que tes ascensions et tes cristaux n'en ont donné.",
      shards: "Plus d'éclats possédés que gagnés.",
      inventory: "Plus d'objets dans le sac qu'il ne peut en contenir.",
      item: "Un objet est impossible : trop fort, en double, venu d'une étape jamais atteinte, changé depuis qu'il est tombé, ou plus nombreux que ce que tes gardiens, tes Brèches et tes coffres ont donné.",
      achievement: "Un haut fait est inscrit sans avoir été accompli.",
      power: "Une élite ou un gardien a été vaincu avec moins de dégâts qu'il n'en faut.",
      identity: "Cette partie n'est pas la suite de celle de ton compte. Recharge la page pour choisir laquelle garder.",
      rollback: "Cette progression est en retard sur celle déjà gardée, peut-être jouée sur un autre appareil. Recharge la page pour reprendre la plus récente.",
      stage: "Des étapes ont été franchies sans combattre.",
      "lineage-age": "Cette partie est plus ancienne que celle de ton compte. Recharge la page pour reprendre celle du compte.",
      skills: "Les pouvoirs utilisés ne correspondent pas à leurs effets.",
      descent: "Les Descentes ou les fils de cette partie sont impossibles : trop de fils, trop de Descentes ou une Descente avant que le Métier d'Eldra soit ouvert.",
      crystals: "Plus de cristaux attrapés qu'il n'en est apparu dans ce temps.",
      hourglasses: "Plus de sabliers achetés que tes éclats ne pouvaient en payer.",
      forge: "Plus de niveaux de forge que tes éclats ne pouvaient en payer.",
      "shards-earned": "Plus d'éclats gagnés que tes combats et ton recyclage n'en rapportent.",
      version: "Cette progression vient d'une version du jeu plus ancienne que celle déjà gardée. Recharge la page.",
      "lineage-time": "Cette partie compte plus de temps de jeu qu'il ne s'en est écoulé depuis la dernière partie du compte.",
      record: "Ton record dépasse de loin la plus profonde nuit que le Grand Livre t'a vu marcher. Recharge la page pour reprendre la partie gardée.",
      powers: "Plus de pouvoirs utilisés que leur temps de recharge ne le permet.",
      caravan: "La Caravane est venue une semaine qui n'est pas celle-ci."
    } as Record<string, string>
  },
  en: {
    loadingSave: "Loading your game…",
    loadingWake: "Waking up your companions…",
    releaseUpdate: {
      title: "Idlebound update",
      keeping: "Putting your progress somewhere safe…",
      installing: "Installing the new version…",
      ready: (version: string) => (version ? `${version} is ready. Walk on.` : "The new version is ready. Walk on."),
      percent: (value: number) => `${value}%`
    },
    windowTitles: {
      map: { label: "World map", shortLabel: "Map" },
      gear: { label: "Equipment", shortLabel: "Gear" },
      inventory: { label: "Inventory", shortLabel: "Bag" },
      market: { label: "Shard market", shortLabel: "Market" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall of heroes", shortLabel: "Deeds" },
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
      essencesTitle: "Essences: each adds +10% DPS while you keep it. Earned by ascending, spent at the altars of the Sanctum",
      shardsTitle: "Shards: earned from guardians, crystals and salvaging your loot. Spend them at the market and the forge"
    },
    nav: {
      label: "Game menus",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} unread ${count > 1 ? "fragments" : "fragment"}`
    },
    install: {
      title: "Keep the road within reach",
      text: "Install Idlebound on this device: the game will open in a single tap, like an app.",
      install: "Install",
      decline: "No thanks"
    },
    mobileTabs: {
      heroes: "Companions",
      scene: "Full combat view"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat: ${biome}, stage ${stage}`,
      attack: "Strike the monster",
      appears: (name: string, hp: string) => `${name} appears, ${hp} health.`,
      falls: (name: string) => `${name} falls.`,
      kinds: { boss: "Guardian", miniboss: "Elite", treasure: "Treasure", rare: "Wanderer", normal: "" },
      killProgressTitle: "Monsters to defeat to unlock the next stage",
      killProgress: (kills: Count, total: Count) => `${kills} / ${total} monsters`,
      bossBeaten: "Guardian defeated: you can fight it again",
      farming: "Stage already cleared: staying for gold",
      seconds: (value: string) => `${value}s`
    },
    stageBar: {
      previous: "Previous stage",
      next: "Next stage",
      stage: (stage: Count, boss: boolean) => `Stage ${stage}${boss ? " (elite or guardian)" : ""}`,
      autoOn: "Auto: you move on to the next stage as soon as this one is cleared. Press to stay here and earn gold without advancing.",
      autoOff: "Stay: you fight on this stage without advancing, for gold. Press to switch back to Auto and take the road again.",
      auto: "Auto",
      farm: "Stay"
    },
    buffs: {
      label: "Active effects",
      rage: "Rage: DPS ×2",
      fortune: "Fortune: gold ×2",
      autoclick: "Auto-strike: 5 blows/s",
      overcharge: "Overcharge: DPS ×7",
      sharpness: "Sharpness: strike ×10",
      ritual: (pct: Count) => `Ritual: +${pct}% DPS until your next ascension`,
      ritualShort: (pct: Count) => `+${pct}%`,
      patience: (pct: Count) => `Patience: DPS +${pct}%`,
      patienceShort: (pct: Count) => `+${pct}%`
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
      catch: "Catch the wandering crystal: gold, shards, an essence or a short boost"
    },
    heroes: {
      title: "Companions",
      buyAmount: "Amount to buy",
      autoSpend: "Spend while away",
      autoSpendHint: "Your companions spend the gold they earn on levels and talents to keep progressing. Turn it off to keep your gold.",
      max: "Max",
      buyAllTalents: (count: number) => `Buy ${count} available talent${count > 1 ? "s" : ""}`,
      ready: (count: number) => `${count} ${count > 1 ? "purchases" : "purchase"} within reach`,
      click: "Strike: ",
      dps: "DPS: ",
      dpsPerLevel: (value: string) => `${value} DPS per level`,
      share: (pct: Count) => ` · ${pct}%`,
      milestoneTitle: (current: string) => `Milestones: this companion's damage ×3.5 at level 200, then every 25 levels. Now: ×${current}`,
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
      idleDps: (pct: Count) => `Patience bonus: your companions hit +${pct}% harder`,
      critChance: (pct: Count) => `+${pct}% critical hit chance`,
      critDamage: (add: Count) => `Critical multiplier +${add} (×10 base)`,
      gold: (pct: Count) => `Gold earned +${pct}%`,
      bossTimer: (seconds: Count) => `+${seconds}s on the timer of elites and guardians`,
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
      companion: (hero: string) => `Hire ${hero}: she deals damage every second, even when you do not strike.`,
      boss: "Elites and guardians must fall before the timer runs out. If not, you drop back one stage and stay there to earn gold.",
      skill: (key: string) => `New power unlocked: press ${key} or use its button at the bottom.`,
      farm: "You're staying on the previous stage. Get stronger, then take the road again (Stay → Auto button).",
      ascend: "The Fallen King has fallen! Open “Ascension” in the menu: you can start the road over for essences, which strengthen every night after this one.",
      altarRework: "The altars have been reworked: each level of an open-ended altar now multiplies its effect, and the Wanderer skips the first stages. All your levels were refunded in essences: pick your altars again in the ascension window.",
      harvestCap: "The Altar of Harvest has changed: it stops at level 5 and asks for more. All its levels came back to you as essences."
    },
    fx: {
      crit: "CRITICAL",
      companions: "COMPANIONS",
      shards: (count: number) => `+${count} shard${count > 1 ? "s" : ""}`,
      rout: (stage: Count) => `Rout · stage ${stage}`
    },
    toasts: {
      routTitle: "Rout",
      routText: "You walked this stage on an earlier night, and your company overwhelms its Remnants: they all come apart at once. The whole stage falls, gold included, and the road runs on like this until a monster holds.",
      count: (count: number) => `x${count}`,
      bossFailedTitle: "The night pushes you back",
      bossFailedText: "You drop back one stage. Strengthen your companions, then switch back to Auto (the Stay button) to try again.",
      bossFailedWounded: (pct: number) => `It keeps its wounds: it will come back with ${pct}% less health. Switch back to Auto (the Stay button) to try again.`,
      biome: (era: string, stage: Count) => `${era} · stage ${stage}`,
      achievement: (name: string) => `Deed: ${name}`,
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
      ascendedText: (essences: string) => `+${essences} essences: each adds 10% DPS while you keep it. The road starts over.`,
      inventoryFull: (item: string, shards: number) => `Inventory full: ${item} salvaged (+${shards} shards).`,
      hourglass: (kills: string) => `The hourglass runs out: ${kills} monsters defeated in an instant.`,
      fragmentTitle: "A fragment surfaces",
      fragmentMore: "It waits in the Chronicle, in the Hall.",
      bestiary: (name: string) => `Bestiary: ${name}`,
      recognition: (name: string, tier: number) =>
        tier === 1 ? `${name} barely knows you (memory 1 of 5)` : tier === 5 ? `${name} remembers you: +10% damage` : `${name} remembers you a little more (memory ${tier} of 5)`,
      recognitionManyTitle: "Familiar faces",
      recognitionMany: (names: string, first: boolean) => `${names} ${first ? "barely know you" : "remember you a little more"}. At the fifth memory, a companion deals +10% damage. Their memories wait in the Chronicle.`,
      and: " and ",
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
        `The account game goes further: stage ${stage}, ${ascensions} ascension${ascensions === 1 ? "" : "s"}, ${time} of play. Keeping the current game erases it for good.`,
      guest: {
        text: "Another page carried your game on while you played here. Which one do you want to keep? The other will be lost for good.",
        kept: "Kept game",
        takeKept: "Resume the kept game",
        weakerTitle: "Erase the kept game?",
        weakerText: (stage: Count, ascensions: number, time: string) =>
          `The kept game goes further: stage ${stage}, ${ascensions} ascension${ascensions === 1 ? "" : "s"}, ${time} of play. Keeping the current game erases it for good.`
      }
    },
    elsewhere: {
      playHere: "Play here",
      open: {
        title: "Your game is open elsewhere",
        voice: "One walker, one road. The Ledger already sees you walking elsewhere.",
        text: "Your game is running right now on another device or in another page. Taking it here stops it there, and it carries on from here as the server kept it."
      },
      taken: {
        title: "Your game goes on elsewhere",
        voice: "Your road is written elsewhere now. The Ledger waits for you where you walk.",
        text: "You picked your game up on another device or in another page, so it stopped here. You can take it back here at any time: it will stop there."
      }
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
      status: (status: Count) => `The server answered with an error (${status}). Try again in a moment.`,
      sessionExpired: "Session expired: log in again to keep your progress.",
      contextMissing: "The game could not start. Reload the page."
    },
    violations: {
      generic: "This progress does not follow the rules of the game.",
      "stage-order": "The stages cleared are out of order.",
      "created-at": "This game's start date is impossible. Your device's clock may be wrong.",
      time: "This game counts more play time than has passed. Your device's clock may be wrong.",
      kills: "More monsters defeated than the play time allows.",
      clicks: "More strikes per second than a hand can give.",
      gold: "Gold earned faster than the game allows.",
      "run-lifetime": "This night's statistics exceed those of the whole game.",
      crits: "More critical hits than blows dealt.",
      hero: "The companions' levels or hires are impossible.",
      upgrade: "A talent is unknown, bought twice or bought too early.",
      "gold-ledger": "More gold spent than earned.",
      altar: "An altar is unknown, above its highest level or raised too early.",
      "essence-ledger": "More essences spent than collected.",
      ascension: "The ascension history is impossible.",
      "essence-source": "More essences than your ascensions and crystals gave.",
      shards: "More shards owned than earned.",
      inventory: "More items in the bag than it can hold.",
      item: "An item is impossible: too strong, duplicated, from a stage never reached, changed since it dropped, or more of them than your guardians, Seams and chests gave.",
      achievement: "A deed is listed without having been done.",
      power: "An elite or a guardian was beaten with less damage than it takes.",
      identity: "This game does not follow on from your account's game. Reload the page to choose which one to keep.",
      rollback: "This progress is behind the one already kept, perhaps played on another device. Reload the page to pick up the latest.",
      stage: "Stages were cleared without fighting.",
      "lineage-age": "This game is older than your account's. Reload the page to pick up the account's game.",
      skills: "The powers used do not match their effects.",
      descent: "This game's Descents or threads are impossible: too many threads, too many Descents or a Descent before Eldra's Loom was open.",
      crystals: "More crystals caught than appeared in that time.",
      hourglasses: "More hourglasses bought than your shards could pay for.",
      forge: "More forge levels than your shards could pay for.",
      "shards-earned": "More shards earned than your fights and salvaging could yield.",
      version: "This progress comes from an older version of the game than the one already kept. Reload the page.",
      "lineage-time": "This game counts more play time than has passed since the account's last game.",
      record: "Your record lies far past the deepest night the Ledger saw you walk. Reload the page to pick up the kept game.",
      powers: "More powers used than their cooldowns allow.",
      caravan: "The Caravan came in a week that is not this one."
    } as Record<string, string>
  }
});
