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
      inventory: { label: "Sac", shortLabel: "Sac" },
      market: { label: "Marché d'éclats", shortLabel: "Marché" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall des héros", shortLabel: "Hall" },
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
      essencesTitle: "Essences : chacune ajoute +10 % de DPS tant que tu la gardes. Gagnées à l'ascension, dépensées aux autels du Sanctuaire",
      shardsTitle: "Éclats : gagnés sur les gardiens, les cristaux et en recyclant ton butin. À dépenser au marché et à la forge"
    },
    nav: {
      label: "Menus du jeu",
      hallTitle: (label: string, ratio: string) => `${label} (${ratio})`,
      unread: (count: number) => `${count} ${count > 1 ? "fragments non lus" : "fragment non lu"}`,
      badgeAscend: "le Roi est tombé, le crépuscule t'attend",
      badgeEssences: "de nouvelles essences à offrir",
      badgePackFull: "sac presque plein",
      badgeRelics: (count: number) => (count > 1 ? `${count} nouvelles reliques` : "une nouvelle relique"),
      badgeWare: "une nouvelle marchandise à ta portée",
      badgeAddress: "adresse à confirmer"
    },
    install: {
      title: "Garde la route à portée de main",
      text: "Installe Idlebound sur cet appareil : le jeu s'ouvrira d'une seule touche, comme une application.",
      install: "Installer",
      decline: "Non merci"
    },
    mobileTabs: {
      heroes: "Compagnons",
      scene: "Combat en grand"
    },
    scene: {
      label: (biome: string, stage: Count) => `Combat : ${biome}, étape ${stage}`,
      attack: "Frapper le monstre",
      appears: (name: string, hp: string) => `${name} surgit, ${hp} points de vie.`,
      falls: (name: string) => `${name} tombe.`,
      kinds: { boss: "Gardien", miniboss: "Élite", treasure: "Trésor", rare: "Errant", normal: "" },
      killProgressTitle: "Monstres à vaincre pour débloquer l'étape suivante",
      killProgress: (kills: Count, total: Count) => `${kills} / ${total} monstres`,
      bossBeaten: "Gardien vaincu : tu peux le combattre à nouveau",
      farming: "Étape déjà franchie : tu restes pour l'or",
      seconds: (value: string) => `${value} s`
    },
    stageBar: {
      previous: "Étape précédente",
      next: "Étape suivante",
      stage: (stage: Count, boss: boolean) => `Étape ${stage}${boss ? " (élite ou gardien)" : ""}`,
      autoOn: "Auto : tu passes à l'étape suivante dès que celle-ci est franchie. Appuie pour rester ici et gagner de l'or sans avancer.",
      autoOff: "Rester : tu combats sur cette étape sans avancer, pour l'or. Appuie pour repasser en Auto et reprendre la route.",
      auto: "Auto",
      farm: "Rester"
    },
    buffs: {
      label: "Effets actifs",
      seconds: (value: Count) => `${value} s`,
      rage: "Rage : DPS ×2",
      fortune: "Fortune : or ×2",
      autoclick: "Frappe automatique : 5 coups/s",
      overcharge: "Surcharge : DPS ×7",
      sharpness: "Affûtage : frappe ×10",
      ritual: (pct: Count) => `Rituel : +${pct} % DPS jusqu'à ta prochaine ascension`,
      ritualShort: (pct: Count) => `+${pct} %`,
      patience: (pct: Count) => `Patience : DPS +${pct} %`,
      patienceShort: (pct: Count) => `+${pct} %`
    },
    skills: {
      label: "Pouvoirs",
      tapAgain: "Touche encore pour le lancer",
      ready: (name: string, key: string, description: string) => `${name} (touche ${key}) : ${description}`,
      cooldown: (time: string) => ` Recharge : ${time}.`,
      minutes: (value: Count) => `${value} min`,
      seconds: (value: Count) => `${value} s`,
      activeSeconds: (value: Count) => `${value} s`
    },
    crystal: {
      catch: "Attraper le cristal errant : or, éclats, essence ou bonus temporaire"
    },
    heroes: {
      title: "Compagnons",
      buyAmount: "Quantité achetée",
      autoSpend: "Achats en ton absence",
      autoSpendHint: "Tes compagnons dépensent l'or gagné en niveaux et talents pour continuer à progresser. Désactive-le pour garder ton or.",
      max: "Max",
      buyAllTalents: (count: number) => `Acheter ${count} talent${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}`,
      ready: (count: number) => `${count} achat${count > 1 ? "s" : ""} à ta portée`,
      click: "Frappe : ",
      dps: "DPS : ",
      dpsPerLevel: (value: string) => `${value} DPS par niveau`,
      share: (pct: Count) => ` · ${pct} %`,
      milestoneTitle: (current: string) => `Paliers : dégâts de ce compagnon ×3,5 au niveau 200, puis tous les 25 niveaux. Actuel : ×${current}`,
      milestone: (level: Count) => ` · palier niv. ${level}`,
      talentsOf: (hero: string) => `Talents de ${hero}`,
      talentTapAgain: "Touche encore pour l'apprendre",
      talentOwned: "Acquis",
      talentCost: (cost: string) => `${cost} or`,
      talentLabel: (name: string, text: string, status: string) => `${name} : ${text}. ${status}.`,
      hire: "Recruter",
      train: "S'entraîner",
      buyLabel: (hired: boolean, hero: string, count: number, cost: string) =>
        `${hired ? "Monter" : "Recruter"} ${hero} de ${count} niveau${count > 1 ? "x" : ""} pour ${cost} or`
    },
    effects: {
      heroDps: (hero: string, mult: Count) => `DPS de ${hero} ×${mult}`,
      globalDps: (pct: Count) => `DPS de tous les compagnons +${pct} %`,
      click: (mult: Count) => `Dégâts de frappe ×${mult}`,
      clickDps: (pct: Count) => `Chaque frappe inflige aussi ${pct} % de tes DPS`,
      idleDps: (pct: Count) => `Bonus de Patience : tes compagnons frappent +${pct} % plus fort`,
      critChance: (pct: Count) => `+${pct} % de chances de critique`,
      critDamage: (add: Count) => `Multiplicateur des critiques +${add} (×10 de base)`,
      gold: (pct: Count) => `Or gagné +${pct} %`,
      bossTimer: (seconds: Count) => `+${seconds} s au chrono des élites et gardiens`,
      treasure: (pct: Count) => `+${pct} % de chances de rat doré`
    },
    altarValue: {
      pct: (value: string) => `+${value} %`,
      seconds: (value: Count) => `+${value} s`,
      stages: (value: Count) => `${value} étapes`,
      none: "aucune",
      stage: (stage: Count) => `étape ${stage}`
    },
    affix: (value: string, label: string) => `+${value} % ${inSentence(label)}`,
    tutorial: {
      ok: "OK",
      okLabel: "Compris",
      hire: "Tu as assez d'or : monte Aldric de niveau pour frapper plus fort.",
      companion: (hero: string) => `Recrute ${hero} : elle inflige des dégâts chaque seconde, même quand tu ne frappes pas.`,
      boss: "Élites et gardiens doivent tomber avant la fin du chrono. Sinon, tu recules d'une étape et tu y restes pour gagner de l'or.",
      skill: (key: string) => `Nouveau pouvoir débloqué : appuie sur ${key} ou sur son bouton en bas.`,
      farm: "Tu restes sur l'étape précédente. Renforce-toi, puis reprends la route (bouton Rester → Auto).",
      ascend: "Le Roi déchu est tombé ! Ouvre « Ascension » dans le menu : tu peux recommencer la route en échange d'essences, qui renforcent toutes tes nuits suivantes.",
      altarRework: "Les pierres du Sanctuaire ont changé : chaque niveau d'un autel sans plafond multiplie désormais son effet, et l'Autel du voyageur te fait passer les premières étapes. Tout ce que tu leur avais offert t'est rendu en essences : choisis de nouveau tes autels, dans la fenêtre d'ascension.",
      harvestCap: "L'Autel de la récolte s'est fait plus exigeant : il s'arrête au niveau 5 et demande plus d'essences. Tout ce que tu lui avais offert t'est rendu en essences."
    },
    fx: {
      crit: "CRITIQUE",
      companions: "COMPAGNONS",
      shards: (count: number) => `+${count} éclat${count > 1 ? "s" : ""}`,
      rout: (stage: Count) => `Débandade · étape ${stage}`
    },
    toasts: {
      routTitle: "Débandade",
      routText: "Tu as déjà parcouru cette étape une nuit passée, et ta compagnie écrase ses Vestiges : ils se défont tous d'un coup. L'étape entière tombe avec son or, et la route file ainsi jusqu'au premier monstre qui résiste.",
      count: (count: number) => `×${count}`,
      chronicle: "Lire dans la Chronique",
      bossFailedTitle: "La nuit te repousse",
      bossFailedText: "Tu recules d'une étape. Renforce tes compagnons, puis repasse en Auto (bouton Rester) pour le retenter.",
      bossFailedWounded: (pct: number) => `Il garde ses blessures : il reviendra avec ${pct} % de vie en moins. Repasse en Auto (bouton Rester) pour le retenter.`,
      biome: (era: string, stage: Count) => `${era} · étape ${stage}`,
      achievement: (name: string) => `Haut fait : ${name}`,
      achievementText: (description: string, pct: Count) => `${description} +${pct} % DPS`,
      loot: (rarity: string, level: Count) => `${rarity} · niveau ${level}`,
      lootTraits: (base: string, traits: string) => `${base} · ${traits}`,
      awakened: (name: string, stage: string) => `${name} réveillée à l'étape ${stage}`,
      awakenedText: "Elle garde ce dont elle se souvient, et sa Densité et ses bonus grandissent à cette profondeur.",
      skillUnlocked: (name: string) => `Nouveau pouvoir : ${name}`,
      skillUnlockedText: (key: string, description: string) => `Touche ${key} : ${description}`,
      crystalTitle: "Cristal errant !",
      crystal: {
        gold: (amount: string) => `+${amount} pièces d'or`,
        overcharge: (seconds: Count) => `DPS ×7 pendant ${seconds} s`,
        sharpness: (seconds: Count) => `Frappe ×10 pendant ${seconds} s`,
        shards: (amount: number) => `+${amount} éclat${amount > 1 ? "s" : ""}`,
        essence: (amount: number) => `+${amount} essence${amount > 1 ? "s" : ""}`
      },
      ascendedTitle: "Ascension accomplie",
      ascendedText: (essences: string) => `+${essences} essences : chacune ajoute 10 % de DPS tant que tu la gardes. La route recommence.`,
      inventoryFull: (item: string, shards: number) => `Sac plein : ${item} part au recyclage (+${shards} éclats).`,
      hourglass: (kills: string) => `Le sablier s'écoule : ${kills} monstres vaincus en un instant.`,
      fragmentTitle: "Un fragment refait surface",
      fragmentMore: "Il t'attend dans la Chronique du Hall.",
      bestiary: (name: string) => `Bestiaire : ${name}`,
      recognition: (name: string, tier: number) =>
        tier === 1 ? `${name} te reconnaît à peine (souvenir 1 sur 5)` : tier === 5 ? `${name} se souvient de toi : +10 % de dégâts` : `${name} se souvient un peu plus de toi (souvenir ${tier} sur 5)`,
      recognitionManyTitle: "Des visages familiers",
      recognitionMany: (names: string, first: boolean) => `${names} ${first ? "te reconnaissent à peine" : "se souviennent un peu plus de toi"}. Au cinquième souvenir, un compagnon inflige +10 % de dégâts. Leurs souvenirs t'attendent dans la Chronique.`,
      and: " et ",
      secretTitle: "Secret découvert",
      namedTitle: (name: string) => `Relique nommée : ${name}`,
      wandererTitle: (name: string) => `${name} croise ta route`
    },
    cloudChoice: {
      title: "Deux parties trouvées",
      text: "Ton compte contient déjà une partie différente de celle que tu viens de jouer. Laquelle veux-tu garder ? L'autre sera définitivement perdue.",
      best: "Plus avancée",
      bestStage: "Meilleure étape",
      ascensions: "Ascensions",
      playTime: "Temps de jeu",
      lastActivity: "Dernière activité",
      current: "Partie en cours",
      account: "Partie du compte",
      keepCurrent: "Garder la partie en cours",
      takeAccount: "Reprendre la partie du compte",
      weakerTitle: "Effacer la partie du compte ?",
      weakerText: (stage: Count, ascensions: number, time: string) =>
        `La partie du compte va plus loin : étape ${stage}, ${ascensions} ascension${ascensions > 1 ? "s" : ""}, ${time} de jeu. Garder la partie en cours l'efface pour toujours.`,
      /** A guest's game, carried on from another page of the same browser. */
      guest: {
        text: "Une autre page a continué ta partie pendant que tu jouais ici. Laquelle veux-tu garder ? L'autre sera définitivement perdue.",
        kept: "Partie gardée",
        takeKept: "Reprendre la partie gardée",
        weakerTitle: "Effacer la partie gardée ?",
        weakerText: (stage: Count, ascensions: number, time: string) =>
          `La partie gardée va plus loin : étape ${stage}, ${ascensions} ascension${ascensions > 1 ? "s" : ""}, ${time} de jeu. Garder la partie en cours l'efface pour toujours.`
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
        text: "Tu as repris ta partie sur un autre appareil ou dans une autre page, alors elle s'est arrêtée ici. Tu peux la reprendre ici à tout moment : elle s'arrêtera là-bas."
      }
    },
    ledgerAway: {
      title: "Le Grand Livre ne répond pas",
      voice: "Ta route y est toujours écrite. On frappe encore à sa porte.",
      text: (seconds: Count) => `Serveur de jeu injoignable. Ta progression t'y attend : nouvel essai dans ${seconds} s.`,
      trying: "Nouvel essai…",
      offline: "Cet appareil est hors ligne : on réessaie dès le retour du réseau.",
      retry: "Réessayer maintenant"
    },
    modal: {
      close: "Fermer"
    },
    errors: {
      network: "Connexion au serveur impossible. Vérifie ta connexion internet.",
      status: (status: Count) => `Le serveur a répondu par une erreur (${status}). Réessaie dans un instant.`,
      sessionExpired: "Session expirée : reconnecte-toi pour garder ta progression.",
      contextMissing: "Le jeu n'a pas pu démarrer. Recharge la page."
    },
    /**
     * Anti-cheat rejections (HTTP 422), by violation code: only what the walker can act on is
     * told apart (a device clock, another device, a reload); every other code says the same
     * plain line, never what the server checks (AGENTS.md, fair play).
     */
    violations: {
      generic: "Ta dernière progression n'a pas été gardée. Recharge la page pour reprendre ta partie là où le serveur l'a gardée.",
      "created-at": "L'horloge de ton appareil semble déréglée. Remets-la à l'heure, puis recharge la page.",
      time: "L'horloge de ton appareil semble déréglée. Remets-la à l'heure, puis recharge la page.",
      identity: "Cette partie n'est pas la suite de celle de ton compte. Recharge la page pour choisir laquelle garder.",
      rollback: "Cette progression est en retard sur celle déjà gardée, peut-être jouée sur un autre appareil. Recharge la page pour reprendre la plus récente.",
      "lineage-age": "Cette partie est plus ancienne que celle de ton compte. Recharge la page pour reprendre celle du compte.",
      "lineage-taken": "Cette partie appartient déjà à un autre compte. Recharge la page pour commencer celle de ce compte.",
      version: "Cette progression vient d'une version du jeu plus ancienne que celle déjà gardée. Recharge la page."
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
      inventory: { label: "Bag", shortLabel: "Bag" },
      market: { label: "Shard market", shortLabel: "Market" },
      ascension: { label: "Ascension", shortLabel: "Ascension" },
      hall: { label: "Hall of Heroes", shortLabel: "Hall" },
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
      unread: (count: number) => `${count} unread ${count > 1 ? "fragments" : "fragment"}`,
      badgeAscend: "the King has fallen, dusk awaits you",
      badgeEssences: "new essences to offer",
      badgePackFull: "pack almost full",
      badgeRelics: (count: number) => (count > 1 ? `${count} new relics` : "a new relic"),
      badgeWare: "a new ware within reach",
      badgeAddress: "address to confirm"
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
      seconds: (value: Count) => `${value}s`,
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
      tapAgain: "Tap again to use it",
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
      talentTapAgain: "Tap again to learn it",
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
      altarRework: "The stones of the Sanctum have changed: each level of an altar without a cap now multiplies its effect, and the Altar of the Wanderer carries you past the first stages. Everything you offered them came back to you as essences: choose your altars again, in the ascension window.",
      harvestCap: "The Altar of Harvest has grown more demanding: it stops at level 5 and asks for more essences. Everything you offered it came back to you as essences."
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
      count: (count: number) => `×${count}`,
      chronicle: "Read in the Chronicle",
      bossFailedTitle: "The night pushes you back",
      bossFailedText: "You drop back one stage. Strengthen your companions, then switch back to Auto (the Stay button) to try again.",
      bossFailedWounded: (pct: number) => `It keeps its wounds: it will come back with ${pct}% less health. Switch back to Auto (the Stay button) to try again.`,
      biome: (era: string, stage: Count) => `${era} · stage ${stage}`,
      achievement: (name: string) => `Deed: ${name}`,
      achievementText: (description: string, pct: Count) => `${description} +${pct}% DPS`,
      loot: (rarity: string, level: Count) => `${rarity} · level ${level}`,
      lootTraits: (base: string, traits: string) => `${base} · ${traits}`,
      awakened: (name: string, stage: string) => `${name} awakened at stage ${stage}`,
      awakenedText: "It keeps what it remembers, and its Density and bonuses grow to that depth.",
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
      inventoryFull: (item: string, shards: number) => `Bag full: ${item} salvaged (+${shards} shards).`,
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
      text: (seconds: Count) => `Can't reach the game server. Your progress is waiting there: trying again in ${seconds} s.`,
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
      generic: "Your last progress was not kept. Reload the page to pick up your game where the server kept it.",
      "created-at": "Your device's clock seems to be wrong. Set it right, then reload the page.",
      time: "Your device's clock seems to be wrong. Set it right, then reload the page.",
      identity: "This game does not follow on from your account's game. Reload the page to choose which one to keep.",
      rollback: "This progress is behind the one already kept, perhaps played on another device. Reload the page to pick up the latest.",
      "lineage-age": "This game is older than your account's. Reload the page to pick up the account's game.",
      "lineage-taken": "This game already belongs to another account. Reload the page to start this account's own.",
      version: "This progress comes from an older version of the game than the one already kept. Reload the page."
    } as Record<string, string>
  }
});
