import type { RouteId } from "../routing";

/** One block of an article: a paragraph, a heading or a bulleted list. */
export type NewsBlock = { kind: "p"; text: string } | { kind: "h2"; text: string } | { kind: "list"; items: string[] };

/** The words of an article in one language. `link` closes it with a call to a page of the site. */
export type NewsText = { title: string; summary: string; body: NewsBlock[]; link?: { route: RouteId; label: string } };

/** The picture of an article: a biome of the road, and a creature standing in it. */
export type NewsCover = { biome: string; creature?: string };

/**
 * A news article. A patch note names the release tag it covers (`v0.4.3`); an announcement
 * has none. `date` is the day it goes out (YYYY-MM-DD). Its cover shows only what the landing
 * page already shows: the first creatures and the five biomes.
 */
export type NewsPost = { slug: string; date: string; kind: "patch" | "announcement"; version?: string; cover: NewsCover; fr: NewsText; en: NewsText };

/**
 * Every article of the news pages, newest first. Written for the public: what changes for the
 * walker, never how it is built. Read on the server only, so the game never carries them.
 */
export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "patch-notes-0-5-0",
    date: "2026-10-04",
    kind: "patch",
    version: "v0.5.0",
    cover: { biome: "fallen-king-ruins", creature: "ruined-king" },
    fr: {
      title: "Notes de mise à jour 0.5.0",
      summary: "Des chiffres plus justes et plus lisibles : la vraie recharge de tes pouvoirs, des hauts faits qui avancent enfin, et tes bonus écrits comme tu l'as choisi.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Plus la route est longue, plus les chiffres deviennent immenses, et certains finissaient par mentir ou par ne plus rien dire. Cette version remet de l'ordre dans ce que le jeu t'affiche, pour que tu saches toujours où tu en es." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "Pouvoirs : chaque pouvoir t'annonce maintenant sa vraie recharge, une fois comptés l'Autel des échos et les reliques qui la raccourcissent. Avant, il affichait toujours sa recharge de base. Exemple : Frénésie, avec 4 niveaux à l'Autel des échos, affiche « Recharge : 8 min » au lieu de « 10 min ».",
            "Hall des héros : la jauge d'un haut fait part du palier d'avant, et non plus de zéro. Pour l'or gagné et le plus gros coup, elle avance d'ordre de grandeur en ordre de grandeur : avec 2e201 pièces d'or, le palier de 1e205 est rempli aux trois quarts, alors qu'il semblait encore vide.",
            "Hall des héros : les seuils d'or et de dégâts s'écrivent dans la notation que tu as choisie dans les Réglages (lettres, scientifique ou ingénieur)."
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Ton bonus de Patience et les valeurs des autels du Sanctuaire suivent eux aussi ta notation. Passé 1 000 %, le bonus de Patience s'affichait en chiffres bruts (10300 %) et les autels en lettres quelle que soit ta notation ; tu lis maintenant 10.3K % ou 1.03e4 %, selon ton choix."
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. On se retrouve à la prochaine version, et d'ici là, bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.5.0",
      summary: "Fairer, clearer numbers: the true recharge of your powers, deeds that finally move, and your bonuses written the way you chose.",
      body: [
        { kind: "p", text: "Good evening, walker. The longer the road, the bigger the numbers, and some of them ended up lying or saying nothing at all. This version tidies up what the game shows you, so you always know where you stand." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "Powers: every power now tells you its true recharge, once the Altar of Echoes and the relics that shorten it are counted. Before, it always showed its base recharge. For example, Frenzy with 4 levels in the Altar of Echoes reads \"Recharge: 8 min\" instead of \"10 min\".",
            "Hall of heroes: a deed's bar starts from the tier before it, no longer from zero. For gold earned and the mightiest hit, it moves one order of magnitude at a time: with 2e201 gold, the 1e205 tier is three quarters full, where it used to look empty.",
            "Hall of heroes: the gold and damage thresholds are written in the notation you picked in Settings (letters, scientific or engineering)."
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "Your Patience bonus and the values of the Sanctum's altars follow your notation too. Past 1,000%, the Patience bonus showed raw digits (10300%) and the altars used letters whatever your notation; you now read 10.3K% or 1.03e4%, as you chose."
          ]
        },
        { kind: "p", text: "Thank you for walking with us. See you at the next version, and until then, safe travels." }
      ]
    }
  },
  {
    slug: "the-wiki-opens",
    date: "2026-10-04",
    kind: "announcement",
    cover: { biome: "dark-forest", creature: "mourning-owl" },
    fr: {
      title: "Le wiki d'Idlebound ouvre ses pages",
      summary: "Compagnons, créatures, reliques, autels, secrets : tout le savoir de la route réuni au même endroit, sans gâcher ce que tu n'as pas encore vécu.",
      body: [
        { kind: "p", text: "Bonsoir à toi qui marches vers le trône. Le site gagne aujourd'hui une nouvelle page : les Actualités. C'est ici qu'on te racontera ce qui change sur la route, mise à jour après mise à jour. Et pour ouvrir le bal, une belle nouvelle : Idlebound a maintenant son wiki." },
        { kind: "h2", text: "Tout le savoir de la route, au même endroit" },
        { kind: "p", text: "Le wiki rassemble ce que la nuit t'apprend à force de la traverser. Il est tiré directement du jeu : quand un chiffre change sur la route, il change aussi dans le wiki. Tu y trouveras :" },
        {
          kind: "list",
          items: [
            "Un guide pas à pas pour tes premières nuits, et une foire aux questions pleine d'astuces.",
            "Une fiche pour chacun des 20 compagnons et pour Aldric : talents, pouvoir, promesse, et les souvenirs qui leur reviennent.",
            "Le bestiaire complet : 63 créatures, leurs lignes du Grand Livre et leur visage à travers les Âges.",
            "Les 24 reliques nommées et leurs légendes, la forge, le marché et la Caravane.",
            "Le combat, l'ascension et les autels, la Promesse, les biomes, les strates, les événements, la Chronique, la Descente et ses Tissages.",
            "Les hauts faits et les secrets, solutions comprises, pour celles et ceux qui donnent leur langue au chat.",
            "Un calculateur : la vie d'un monstre, l'or et les essences qui t'attendent à l'étape de ton choix."
          ]
        },
        { kind: "h2", text: "Rien ne te sera gâché" },
        { kind: "p", text: "Idlebound se découvre en marchant, et on tient à ce que ça reste vrai. Le wiki ne te gâche rien : chaque révélation reste cachée, et c'est toi qui choisis ce que tu ouvres. Si tu as une partie en cours, le wiki suit ta progression et n'ouvre que ce que tu as déjà vécu : les créatures croisées, les reliques trouvées, les secrets percés. Tu peux aussi lire sans aucun spoil, ou tout dévoiler si tu aimes connaître la fin avant le début." },
        { kind: "h2", text: "Et ensuite ?" },
        { kind: "p", text: "Ces Actualités deviennent notre carnet de route commun. À chaque nouvelle version, tu trouveras ici ce qui a changé : les nouveautés, les équilibrages, les corrections. Le wiki, lui, grandira avec le jeu. Bonne route, et à la prochaine nuit." }
      ],
      link: { route: "wiki", label: "Ouvrir le wiki" }
    },
    en: {
      title: "The Idlebound wiki opens its pages",
      summary: "Companions, creatures, relics, altars, secrets: everything the road teaches, gathered in one place, without spoiling what you have not lived yet.",
      body: [
        { kind: "p", text: "Good evening, walker. The site has a new page today: the News. This is where we will tell you what changes on the road, update after update. And to open it, good tidings: Idlebound now has its own wiki." },
        { kind: "h2", text: "Everything the road teaches, in one place" },
        { kind: "p", text: "The wiki gathers what the night teaches you as you cross it, again and again. It is drawn straight from the game: when a number changes on the road, it changes in the wiki too. Inside, you will find:" },
        {
          kind: "list",
          items: [
            "A step by step guide for your first nights, and a FAQ full of tips.",
            "A page for each of the 20 companions and for Aldric: talents, power, promise, and the memories that come back to them.",
            "The full bestiary: 63 creatures, their lines from the Ledger and how they look through the Ages.",
            "The 24 named relics and their legends, the forge, the market and the Caravan.",
            "Combat, ascension and the altars, the Promise, the biomes, the strata, the events, the Chronicle, the Descent and its Weaves.",
            "The deeds and the secrets, answers included, for when you would rather know than guess.",
            "A calculator: a monster's health, and the gold and essences waiting for you at any stage."
          ]
        },
        { kind: "h2", text: "Nothing gets spoiled" },
        { kind: "p", text: "Idlebound is discovered by walking it, and we mean to keep it that way. The wiki spoils nothing: every revelation stays hidden, and you choose which ones to open. If you have a game going, the wiki follows your progress and only opens what you have already lived: the creatures you met, the relics you found, the secrets you uncovered. You can also read with no spoilers at all, or reveal it all if you like to know the ending first." },
        { kind: "h2", text: "What comes next" },
        { kind: "p", text: "This News page becomes our shared road journal. With every new version, you will find here what changed: new features, balance, fixes. The wiki will grow with the game. Safe travels, and see you next night." }
      ],
      link: { route: "wiki", label: "Open the wiki" }
    }
  },
  {
    slug: "patch-notes-0-4-0",
    date: "2026-10-03",
    kind: "patch",
    version: "v0.4.0",
    cover: { biome: "corrupted-marsh", creature: "rot-baron" },
    fr: {
      title: "Notes de mise à jour 0.4.0",
      summary: "La Débandade balaie les étapes déjà conquises, chaque parole tenue double les dégâts d'un compagnon, les coffres s'ouvrent sous tes yeux et le classement change de visage.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Refaire une route déjà connue ne devrait pas te coûter des heures, et une promesse tenue devrait se sentir dans chaque coup. Cette version s'occupe des deux, et rend plus clair tout ce que le jeu te dit." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "Débandade : quand tu repasses par une étape plus basse que ton record et que ta compagnie tuerait un de ses monstres en un dixième de seconde ou moins, toute l'étape tombe d'un coup. Tu touches l'or de tous ses monstres et ils comptent au Bestiaire, puis la route avance, d'une étape au plus tous les quarts de seconde. Les élites et les gardiens se combattent toujours. Ça marche aussi pendant ton absence.",
            "Promesses : chaque parole tenue double pour toujours les dégâts du compagnon à qui tu l'as donnée, jusqu'à 5 paroles (x32). Avant, elle ne donnait aucun dégât. Les paroles déjà tenues comptent tout de suite, et un compagnon dont tu as tenu les 5 paroles cesse de t'en demander.",
            "Marché d'éclats : le Coffre de reliques et le Grand coffre s'ouvrent maintenant sous tes yeux. Le coffre frappe une fois par rareté qu'il gagne, éclate, et une roue de reliques ralentit sur celle qui t'attend. Tu peux l'ouvrir tout de suite, et en mouvements réduits la relique apparaît directement.",
            "Une partie, une seule page : si ta partie tourne déjà ailleurs, sur un autre appareil ou dans une autre fenêtre, cette page se met en pause et te propose « Jouer ici ». La reprendre arrête l'autre.",
            "Registre des Liés : Profondeur devient le classement officiel. Trois nouveaux tableaux comptent ce que tu as accompli depuis toujours : Régicide (les Rois abattus), Parole tenue (les promesses tenues) et La Veille (les cristaux attrapés). À étape égale, le premier arrivé passe devant. La section « Autour de toi » montre les marcheurs juste au-dessus et juste en dessous de toi, au classement comme dans le Hall des héros.",
            "Ascension : la fenêtre de confirmation et le Sanctuaire t'annoncent l'étape où commencera ta prochaine nuit.",
            "Les messages qui se répètent s'empilent (x2, x3) au lieu de s'entasser, et ton or monte quand les pièces atteignent le compteur, plus au moment du coup.",
            "Réglages : le volume va de 0 à 100 % et affiche sa valeur. Les sons doux sont enfin réglables (avant, le curseur avançait par pas de 5 %).",
            "Compte : ton adresse e-mail est masquée dans la fenêtre du compte, avec un bouton pour l'afficher."
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "list",
          items: [
            "Reliques : leurs bonus de dégâts contre les élites et les gardiens sont plafonnés à +300 % en tout. Sans plafond, des reliques très forgées faisaient tomber les gardiens plus vite que les monstres ordinaires de leur propre étape.",
            "La Descente s'ouvre désormais à l'étape 2000, sans condition de Reconnaissance (avant : étape 1000 et Eldra à sa cinquième Reconnaissance). Si elle t'était déjà ouverte, elle le reste.",
            "Avec la Débandade et les paroles tenues, chaque façon de jouer va plus loin. En une journée de jeu, la route menait de l'étape 836 à l'étape 950 selon ton style ; elle mène maintenant de 961 à 1186. La première heure après 8 h d'absence rapporte 13 à 20 étapes, contre 5 à 16 avant.",
            "Les premières heures ne bougent presque pas : l'étape 100 arrive vers 4 h 27 au lieu de 4 h 38, la première ascension vers 2 h 53."
          ]
        },
        { kind: "h2", text: "Clarté" },
        {
          kind: "list",
          items: [
            "Chaque pouvoir, chaque autel, chaque objet du marché dit maintenant ce qu'il fait, chiffres compris. Les pouvoirs donnent leur recharge, et chaque compagnon nomme le bonus de son talent de niveau 50.",
            "Les histoires des compagnons, des créatures et des lieux ont été réécrites pour se comprendre dès la première lecture.",
            "Quand ta progression est refusée ou que le serveur ne répond pas, le message dit simplement ce qui se passe et quoi faire (par exemple : l'horloge de ton appareil est peut-être fausse)."
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Quand une nouvelle version arrive, la page la charge dès que rien d'important n'est affiché, au lieu d'attendre 30 s sans que tu touches à rien.",
            "La confirmation de « Mot de passe oublié » s'affiche dans ta langue."
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. Bonne route, et à la prochaine nuit." }
      ]
    },
    en: {
      title: "Patch notes 0.4.0",
      summary: "The Rout sweeps the stages you already conquered, every kept word doubles a companion's damage, chests open before your eyes and the leaderboard gets a new look.",
      body: [
        { kind: "p", text: "Good evening, walker. Walking a road you already know should not cost you hours, and a kept promise should be felt in every blow. This version takes care of both, and makes everything the game tells you clearer." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "Rout: when you walk back through a stage below your record and your company would kill one of its monsters in a tenth of a second or less, the whole stage falls at once. You collect the gold of all its monsters and they count in the Bestiary, then the road moves on, one stage every quarter second at most. Elites and guardians are still fought. It works while you are away too.",
            "Promises: every kept word doubles, for good, the damage of the companion you gave it to, up to 5 words (x32). Before, it gave no damage at all. Words you already kept count at once, and a companion whose 5 words you kept stops asking.",
            "Shard market: the Relic Chest and the Great Chest now open before your eyes. The chest knocks once for every rarity it climbs, bursts, and a reel of relics slows down onto the one waiting for you. You can open it at once, and with reduced motion the relic shows straight away.",
            "One game, one page: if your game is already running elsewhere, on another device or in another window, this page pauses and offers \"Play here\". Taking it over stops the other one.",
            "Roll of the Bound: Depth becomes the official board. Three new boards count what you have done over all time: Kingslayer (Kings felled), Word Kept (promises kept) and The Watch (crystals caught). On equal stages, whoever got there first ranks higher. The \"Around you\" section shows the walkers just above and below you, on the leaderboard and in the Hall of heroes.",
            "Ascension: the confirmation and the Sanctum tell you the stage your next night will start at.",
            "Repeated messages stack (x2, x3) instead of piling up, and your gold rises when the coins reach the counter, no longer at the moment of the blow.",
            "Settings: volume goes from 0 to 100% and shows its value. Quiet sounds can finally be set (the slider used to move in 5% steps).",
            "Account: your e-mail address is masked in the account window, with a button to show it."
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "list",
          items: [
            "Relics: their bonus damage against elites and guardians is capped at +300% in total. Without a cap, heavily forged relics made guardians fall faster than the ordinary monsters of their own stage.",
            "The Descent now opens at stage 2000, with no Recognition needed (before: stage 1000 and Eldra at her fifth Recognition). If it was already open for you, it stays open.",
            "With the Rout and kept words, every way of playing goes further. In one day of play, the road led from stage 836 to stage 950 depending on your style; it now leads from 961 to 1186. The first hour after 8 h away brings 13 to 20 stages, up from 5 to 16.",
            "The first hours barely move: stage 100 comes around 4 h 27 instead of 4 h 38, the first ascension around 2 h 53."
          ]
        },
        { kind: "h2", text: "Clarity" },
        {
          kind: "list",
          items: [
            "Every power, altar and market item now says what it does, numbers included. Powers give their recharge, and every companion names the bonus of their level 50 talent.",
            "The stories of the companions, creatures and places were rewritten to be understood on first reading.",
            "When your progress is refused or the server does not answer, the message says plainly what is happening and what to do (for example: your device's clock may be wrong)."
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "When a new version arrives, the page loads it as soon as nothing important is showing, instead of waiting for 30 s without you touching anything.",
            "The \"Forgot password\" confirmation shows in your language."
          ]
        },
        { kind: "p", text: "Thank you for walking with us. Safe travels, and see you next night." }
      ]
    }
  },
  {
    slug: "patch-notes-0-3-0",
    date: "2026-09-30",
    kind: "patch",
    version: "v0.3.0",
    cover: { biome: "forgotten-caves", creature: "stone-devourer" },
    fr: {
      title: "Notes de mise à jour 0.3.0",
      summary: "La Promesse arrive au Sanctuaire, le Grand Livre te montre ce qu'il a vu, le Sanctuaire s'éveille par étapes et le Pari de Pip paie à la hauteur de ta route.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Tes compagnons commencent à se souvenir de toi. Cette version leur donne quelque chose à te demander : ta parole. Elle t'apprend aussi le Sanctuaire pas à pas, au lieu de tout t'ouvrir d'un coup." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "La Promesse, nouvelle section du Sanctuaire : au crépuscule, tu donnes ta parole à un compagnon qui se souvient à moitié de toi (vers ta quatrième nuit). Ce qu'il demande change toute la nuit : ne pas frapper, ne pas utiliser de pouvoir, n'engager personne après lui avant le premier gardien, et d'autres encore. Ta parole est tenue si un Roi tombe cette nuit-là. Tu peux la rompre si tu le choisis, et le même compagnon ne te le demande jamais deux nuits de suite.",
            "Scènes du Grand Livre : de courtes scènes en pixel art, une phrase par plan, aux grands moments de ta route. La première t'attend à ta première ascension. Tu peux les passer, et les revoir dans la Chronique.",
            "Le Sanctuaire s'éveille en trois temps : Puissance, Lame, Fortune et Patience dès la première nuit, Temps, Marchandage et Trésor à la troisième, les six autres à la cinquième. Les autels que tu as déjà montés restent ouverts, et ceux arrivés au maximum se rangent sur une seule ligne.",
            "Partie d'invité : jouer sans compte ne perd plus ta progression quand tu recharges la page. Elle est gardée 30 jours dans ce navigateur, sans entrer au classement.",
            "Retrouvailles : le récit de ton retour se termine sur un fragment de la Chronique que tu n'as pas encore lu.",
            "Reliques : chaque relique dit de combien elle multiplie les dégâts de ta compagnie, comparée à celle que tu portes. Le sac se trie par date, par rareté ou par emplacement.",
            "Réglages : couleurs pour daltoniens, et vibrations sur téléphone.",
            "Un repère t'indique combien d'achats sont à ta portée, et les compagnons qui se souviennent de toi au même crépuscule partagent un seul message.",
            "Une vingtaine de créatures et les cinq décors de biome sont redessinés, et les monstres vaincus ont de nouveaux effets.",
            "Les mots du jeu changent : les boss deviennent Gardiens et Élites, « Farm » devient « Rester », les succès deviennent les Hauts faits, et « Cette vie » devient « Cette nuit »."
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "list",
          items: [
            "Bonus de Patience : tes frappes s'ajoutent maintenant à lui. Avant, elles le remplaçaient coup pour coup et ne comptaient qu'au-delà.",
            "Autel de la récolte : son prix triple à chaque niveau (il montait de 30 %), et il s'arrête à 5 niveaux, soit +50 % d'essences au plus. Les niveaux au-delà te sont rendus en essences, avec un message.",
            "Marché d'éclats : la Potion de rage, l'Élixir de fortune et le Parchemin de frappe se cumulent sans limite (avant : 1 h au plus).",
            "Le Pari de Pip : il payait toujours 30 fois l'or de l'étape. Il paie maintenant 45 s de l'or de ta route au rythme de ta compagnie, au moins 30 fois l'étape et jusqu'à environ 418 fois. Il laisse 3 minutes entre deux paris.",
            "Reconnaissance : le cinquième palier demande 32 nuits au lieu de 30, et les paliers 4 et 5 demandent chacun une parole tenue envers ce compagnon. Une parole tenue compte comme 2 nuits.",
            "La Descente : ses fils dépendent maintenant de ta plus grande profondeur et non plus de tes essences. Les fils déjà tissés te restent, et la Chaîne d'abondance coûte moins cher à ses hauts niveaux (la différence t'est rendue en fils).",
            "Sur une journée de jeu, chaque style va plus loin : de l'étape 724 à 836 pour qui laisse jouer sa compagnie, de 860 à 950 pour qui frappe sans relâche."
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Chaque biome retrouve ses propres couleurs de nuit.",
            "La phrase d'ouverture de la nuit et celle de ton retour s'affichent en haut de la scène, plus par-dessus le monstre, et restent lisibles en mouvements réduits.",
            "Les conseils des premières minutes disparaissent une fois suivis, une fois leur endroit ouvert ou au bout de 30 s, et ne se répètent plus à chaque gardien manqué.",
            "Le jeu se resynchronise quand la page se réveille et supporte une horloge d'appareil déréglée. Les messages ne sautent plus.",
            "Les polices du jeu s'affichent enfin comme prévu."
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. Tiens parole, et bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.3.0",
      summary: "The Promise arrives at the Sanctum, the Ledger shows you what it saw, the Sanctum wakes step by step and Pip's Wager pays up to the size of your road.",
      body: [
        { kind: "p", text: "Good evening, walker. Your companions are starting to remember you. This version gives them something to ask of you: your word. It also teaches you the Sanctum step by step, instead of opening it all at once." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "The Promise, a new section of the Sanctum: at dusk, you give your word to a companion who half remembers you (around your fourth night). What they ask shapes the whole night: no strikes, no powers, nobody hired after them before the first guardian, and more. Your word is kept if a King falls that night. You can break it if you choose, and the same companion never asks two nights in a row.",
            "Ledger scenes: short pixel art scenes, one line per shot, at the great moments of your road. The first one waits for you at your first ascension. You can skip them, and watch them again in the Chronicle.",
            "The Sanctum wakes in three steps: Might, Blade, Fortune and Patience from the first night, Time, Bargains and Treasure on the third, the other six on the fifth. Altars you already raised stay open, and maxed ones fold into a single line.",
            "Guest game: playing without an account no longer loses your progress when you reload the page. It is kept for 30 days in this browser, without entering the leaderboard.",
            "Reunion: the story of your return ends on a fragment of the Chronicle you have not read yet.",
            "Relics: every relic tells how much it multiplies your company's damage, compared with the one you wear. The bag sorts by date, rarity or slot.",
            "Settings: colorblind colors, and vibration on phones.",
            "A marker tells you how many purchases are within reach, and companions who remember you at the same dusk share a single message.",
            "About twenty creatures and the five biome backdrops are redrawn, and slain monsters have new effects.",
            "The game's words change: bosses become Guardians and Elites, \"Farm\" becomes \"Stay\", achievements become Deeds, and \"This life\" becomes \"This night\"."
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "list",
          items: [
            "Patience bonus: your strikes now add on top of it. Before, they replaced it blow for blow and only counted past it.",
            "Altar of Harvest: its price triples at every level (it rose by 30%), and it stops at 5 levels, +50% essences at most. Levels past that are refunded in essences, with a message.",
            "Shard market: the Rage Potion, Fortune Elixir and Striking Scroll stack without limit (before: 1 h at most).",
            "Pip's Wager: it always paid 30 times the stage's gold. It now pays 45 s of your road's gold at your company's pace, at least 30 times the stage and up to about 418 times. He leaves 3 minutes between two wagers.",
            "Recognition: the fifth tier asks for 32 nights instead of 30, and tiers 4 and 5 each ask for a word kept to that companion. A kept word counts as 2 nights.",
            "The Descent: its threads now depend on your greatest depth instead of your essences. Threads already woven stay yours, and the Warp of Plenty costs less at its high levels (the difference comes back as threads).",
            "Over one day of play, every style goes further: from stage 724 to 836 if you let your company play, from 860 to 950 if you strike without rest."
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "Every biome has its own night colors again.",
            "The night's opening line and the line of your return show at the top of the scene, no longer over the monster, and stay readable with reduced motion.",
            "The hints of the first minutes go away once followed, once their place is opened or after 30 s, and no longer repeat at every missed guardian.",
            "The game syncs again when the page wakes up and copes with a device clock that is off. Messages no longer jump.",
            "The game's fonts finally show as intended."
          ]
        },
        { kind: "p", text: "Thank you for walking with us. Keep your word, and safe travels." }
      ]
    }
  },
  {
    slug: "patch-notes-0-2-1",
    date: "2026-09-28",
    kind: "patch",
    version: "v0.2.1",
    cover: { biome: "dark-forest", creature: "old-grove" },
    fr: {
      title: "Notes de mise à jour 0.2.1",
      summary: "Le monde redessiné en pixel art, deux fois plus de créatures, une compagnie qui combat sous tes yeux, les Retrouvailles, et des autels repensés.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Deux jours après l'ouverture, la route change de visage. Le monde est redessiné, il se peuple, ta compagnie se bat enfin à tes côtés, et ton absence ne te coûte plus rien." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "Pixel art : les monstres, les décors et les portraits de ta compagnie sont redessinés en pixel art.",
            "Bestiaire : chaque biome compte maintenant 6 créatures en plus de son élite et de son gardien (3 avant). Quinze créatures arrivent, comme l'Épouvantail creux, la Chouette endeuillée ou le Courtisan noyé, et dix autres en remplacent d'anciennes au même endroit de la route. Tes victoires passent à la nouvelle venue.",
            "Voyageurs rares : un par biome, comme le Berger égaré. Ils apparaissent une fois sur 200, une fois par nuit au plus, et paient 5 fois l'or.",
            "Ta compagnie sur la scène : les tirs partent de tes compagnons vers le monstre (flèche, lame, griffe, sort), et leurs dégâts s'affichent chaque seconde. Les 5 plus forts se tiennent à tes côtés (3 sur téléphone).",
            "Achats en ton absence, activé par défaut : deux minutes après ta dernière action, tes compagnons s'engagent, montent de niveau, prennent leurs talents et retentent le gardien qui les arrêtait. Jeu fermé, ce temps est rejoué à ton retour, jusqu'à 8 h.",
            "Retrouvailles : de retour après 30 minutes ou plus, tes compagnons infligent le triple de dégâts pendant un sixième de ton absence (1 h au plus). Un récit te dit ce qui s'est passé : la route parcourue, l'or gagné et dépensé, les gardiens passés, qui t'a rejoint et ce qui bloque encore.",
            "Blessures : jusqu'à l'étape 44, une élite ou un gardien qui t'a repoussé garde ses blessures, jusqu'aux trois quarts de sa vie.",
            "Hall des héros : le Bestiaire, avec des lignes du Grand Livre à 1, 100 et 1 000 victoires sur chaque créature et +1 % d'or par biome complété, et la Chronique.",
            "Reconnaissance : tes compagnons se souviennent de toi d'une nuit à l'autre.",
            "Hauts faits : de 75 à 154, avec de nouvelles séries.",
            "Événements : l'Averse de cristaux (un cristal sur 20 en devient 5) et le Pari de Pip (frappe 13 fois en 5 s, il paie 30 fois l'or au lieu de 10).",
            "Reliques : une relique trouvée va directement dans un emplacement vide.",
            "Le jeu se dévoile au fil de la route : chaque fenêtre apparaît quand tu peux t'en servir, annoncée une fois.",
            "Si le serveur ne répond pas quand le jeu se charge, il réessaie au lieu de te faire commencer une partie vierge."
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "list",
          items: [
            "Or : chaque monstre rapporte deux fois moins, et à l'étape 1 l'or tombe au tiers de ce qu'il était. En échange, les essences rapportent bien plus (voir plus bas).",
            "Essences : environ 4 fois plus à chaque ascension. 20 au minimum au lieu de 5, et 65 à l'étape 60 au lieu de 18.",
            "Autels : Puissance, Lame, Fortune et Patience multiplient maintenant leur effet à chaque niveau (x1,10 de dégâts par niveau de Puissance, x1,12 d'or par niveau de Fortune) et leur prix monte plus vite. L'Autel du voyageur te fait commencer chaque nuit 10 étapes plus loin par niveau (jamais plus de la moitié de ton record), jusqu'à 10 niveaux. L'Autel du destin s'arrête à 5 niveaux. Tous tes anciens niveaux t'ont été rendus en essences.",
            "Bonus de Patience : toujours actif, plus besoin d'attendre 60 s sans frapper. Tes frappes le remplacent coup pour coup, donc frapper ne te coûte jamais de dégâts.",
            "Kaelen et Morgrath : leurs talents de niveau 50 renforcent maintenant le bonus de Patience (+50 % et +100 %).",
            "Reliques : chance de coup critique plafonnée à 16 % (32 % avant), dégâts critiques à +50 % (sans plafond avant).",
            "Absence : au lieu de rester sur la même étape à 50 % d'efficacité, ta compagnie avance et dépense son or à pleine efficacité, jusqu'à 8 h.",
            "Gardiens rejoués depuis la carte : ils ne paient plus que de l'or. Reliques et éclats viennent du gardien de ta plus lointaine étape.",
            "Hauts faits : le gros bonus revient aux deux plus hauts paliers de chaque série allongée. Quelques hauts faits déjà obtenus valent moins, comme les étapes 300 et 500 (3 % au lieu de 7,5 %)."
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Le haut fait « Engager N compagnons » demandait un compagnon de trop.",
            "Des noms comme « Brotherhood » ou « Carrot » ne sont plus refusés à tort.",
            "Les compteurs d'or et d'éclats ne font plus bouger l'en-tête quand ils changent.",
            "Recharger la page fait retomber les mêmes cristaux et les mêmes reliques qu'avant."
          ]
        },
        { kind: "p", text: "Merci d'être là dès les premières nuits. Bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.2.1",
      summary: "The world redrawn in pixel art, twice as many creatures, a company that fights before your eyes, the Reunion, and reworked altars.",
      body: [
        { kind: "p", text: "Good evening, walker. Two days after opening, the road changes its face. The world is redrawn, it fills up, your company finally fights at your side, and being away no longer costs you anything." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "Pixel art: the monsters, backdrops and portraits of your company are redrawn in pixel art.",
            "Bestiary: every biome now holds 6 creatures besides its elite and guardian (3 before). Fifteen creatures arrive, like the Hollow Scarecrow, the Mourning Owl or the Drowned Courtier, and ten more replace old ones at the same place on the road. Your kills carry over to the newcomer.",
            "Rare wanderers: one per biome, like the Lost Shepherd. They appear once in 200, at most once a night, and pay 5 times the gold.",
            "Your company on the scene: shots fly from your companions to the monster (arrow, blade, claw, spell), and their damage shows every second. The 5 strongest stand by your side (3 on phones).",
            "Spend while away, on by default: two minutes after your last action, your companions join, level up, take their talents and try again the guardian that stopped them. With the game closed, that time is played back when you return, up to 8 h.",
            "Reunion: back after 30 minutes or more, your companions deal triple damage for a sixth of your absence (1 h at most). A story tells you what happened: the road walked, gold earned and spent, guardians passed, who joined you and what still blocks the way.",
            "Wounds: up to stage 44, an elite or guardian that pushed you back keeps its wounds, up to three quarters of its health.",
            "Hall of heroes: the Bestiary, with lines from the Ledger at 1, 100 and 1,000 kills of each creature and +1% gold per biome completed, and the Chronicle.",
            "Recognition: your companions remember you from one night to the next.",
            "Deeds: from 75 to 154, with new series.",
            "Events: the Crystal Storm (one crystal in 20 becomes 5) and Pip's Wager (strike 13 times in 5 s and he pays 30 times the gold instead of 10).",
            "Relics: a relic you find goes straight into an empty slot.",
            "The game reveals itself along the road: each window appears when you can use it, announced once.",
            "If the server does not answer as the game loads, it tries again instead of starting you on a blank game."
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "list",
          items: [
            "Gold: every monster pays half as much, and at stage 1 gold drops to a third of what it was. In return, essences pay far more (see below).",
            "Essences: about 4 times more at every ascension. 20 at the least instead of 5, and 65 at stage 60 instead of 18.",
            "Altars: Might, Blade, Fortune and Patience now multiply their effect at every level (x1.10 damage per level of Might, x1.12 gold per level of Fortune) and their price rises faster. The Altar of the Wanderer starts every night 10 stages further per level (never more than half your record), up to 10 levels. The Altar of Fate stops at 5 levels. All your old levels were refunded in essences.",
            "Patience bonus: always on, no more waiting 60 s without striking. Your strikes replace it blow for blow, so striking never costs you damage.",
            "Kaelen and Morgrath: their level 50 talents now strengthen the Patience bonus (+50% and +100%).",
            "Relics: critical chance capped at 16% (32% before), critical damage at +50% (no cap before).",
            "Time away: instead of staying on the same stage at 50% efficiency, your company moves on and spends its gold at full efficiency, up to 8 h.",
            "Guardians replayed from the map pay only gold now. Relics and shards come from the guardian of your furthest stage.",
            "Deeds: the big bonus goes to the two highest tiers of every lengthened series. A few deeds you may hold are worth less, like stages 300 and 500 (3% instead of 7.5%)."
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "The \"Hire N companions\" deed asked for one companion too many.",
            "Names like \"Brotherhood\" or \"Carrot\" are no longer wrongly refused.",
            "The gold and shard counters no longer shake the header as they change.",
            "Reloading the page brings back the same crystals and relics as before."
          ]
        },
        { kind: "p", text: "Thank you for being here from the very first nights. Safe travels." }
      ]
    }
  },
  {
    slug: "patch-notes-0-1-0",
    date: "2026-09-26",
    kind: "patch",
    version: "v0.1.0",
    cover: { biome: "green-plains", creature: "moss-alpha" },
    fr: {
      title: "Notes de mise à jour 0.1.0",
      summary: "La route s'ouvre : cinq biomes jusqu'au Roi déchu, 21 compagnons, six pouvoirs, l'ascension et ses 13 autels, les reliques et le Hall des héros.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. La route vers le trône est ouverte. Voici ce qui t'attend dans la toute première version d'Idlebound." },
        { kind: "h2", text: "La route" },
        {
          kind: "list",
          items: [
            "Frappe le monstre pour l'abattre et ramasser son or. 10 monstres par étape, une élite toutes les 5 étapes, un gardien toutes les 10, et 30 s pour vaincre chacun d'eux.",
            "Cinq biomes, des Plaines verdoyantes aux Ruines du roi déchu, et le Roi déchu qui t'attend à l'étape 50. Au-delà, la route recommence, plus dangereuse à chaque ère.",
            "Le Rat doré (une chance sur 100, 10 fois l'or) et le Cristal errant, qui passe de temps en temps : de l'or, des dégâts multipliés ou des éclats si tu l'attrapes à temps."
          ]
        },
        { kind: "h2", text: "Ta compagnie" },
        {
          kind: "list",
          items: [
            "Aldric, l'Aventurier, c'est toi : ses niveaux renforcent tes frappes. Vingt compagnons combattent avec lui, une archère, un moine, une liche et bien d'autres.",
            "Des talents à certains niveaux, et des achats par 1, 10, 25, 100 ou au maximum.",
            "Six pouvoirs, touches 1 à 6 : Frénésie, Cri de ralliement, Œil de faucon, Pluie d'or, Rituel de résonance et Écho temporel."
          ]
        },
        { kind: "h2", text: "Ce que tu gardes" },
        {
          kind: "list",
          items: [
            "L'ascension, une fois le Roi déchu tombé : tu recommences la route contre des essences, +10 % de dégâts chacune, à dépenser dans 13 autels aux bonus permanents.",
            "Les reliques : arme, armure, amulette et anneau, de commun à mythique, à forger jusqu'à +20 avec des éclats.",
            "Le marché d'éclats : coffres de reliques, potions, parchemins et sabliers.",
            "Le Hall des héros : 75 hauts faits, chacun un bonus de dégâts permanent, et tes statistiques.",
            "Ta compagnie se bat même quand tu n'es pas là, jusqu'à 8 h."
          ]
        },
        { kind: "h2", text: "Ton compte" },
        {
          kind: "list",
          items: [
            "Tu commences aussitôt, sans compte. Crée-en un pour retrouver ta partie sur tous tes appareils.",
            "Le classement range les marcheurs selon leur étape, leurs ascensions, leurs essences et leurs hauts faits.",
            "Dans les Réglages : la langue, le son, l'écriture des grands nombres, les chiffres de dégâts et les mouvements réduits."
          ]
        },
        { kind: "p", text: "Merci d'être parmi les premiers à marcher. Le Roi t'attend. Bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.1.0",
      summary: "The road opens: five biomes up to the Fallen King, 21 companions, six powers, ascension and its 13 altars, relics and the Hall of heroes.",
      body: [
        { kind: "p", text: "Good evening, walker. The road to the throne is open. Here is what waits for you in the very first version of Idlebound." },
        { kind: "h2", text: "The road" },
        {
          kind: "list",
          items: [
            "Strike the monster to bring it down and pick up its gold. 10 monsters a stage, an elite every 5 stages, a guardian every 10, and 30 s to beat each of them.",
            "Five biomes, from the Verdant Plains to the Fallen King's Ruins, and the Fallen King waiting at stage 50. Past him, the road starts again, more dangerous with every era.",
            "The Golden Rat (one chance in 100, 10 times the gold) and the Wandering Crystal, which passes by now and then: gold, multiplied damage or shards if you catch it in time."
          ]
        },
        { kind: "h2", text: "Your company" },
        {
          kind: "list",
          items: [
            "Aldric, the Adventurer, is you: his levels strengthen your strikes. Twenty companions fight with him, an archer, a monk, a lich and many more.",
            "Talents at certain levels, and purchases by 1, 10, 25, 100 or as many as you can.",
            "Six powers, keys 1 to 6: Frenzy, Rallying Cry, Hawkeye, Golden Rain, Resonance Ritual and Time Echo."
          ]
        },
        { kind: "h2", text: "What you keep" },
        {
          kind: "list",
          items: [
            "Ascension, once the Fallen King has fallen: you start the road again for essences, +10% damage each, to spend at 13 altars with lasting bonuses.",
            "Relics: weapon, armor, amulet and ring, from common to mythic, forged up to +20 with shards.",
            "The shard market: relic chests, potions, scrolls and hourglasses.",
            "The Hall of heroes: 75 deeds, each a lasting damage bonus, and your statistics.",
            "Your company fights even while you are away, up to 8 h."
          ]
        },
        { kind: "h2", text: "Your account" },
        {
          kind: "list",
          items: [
            "You start at once, with no account. Make one to find your game on all your devices.",
            "The leaderboard ranks walkers by stage, ascensions, essences and deeds.",
            "In Settings: language, sound, how big numbers are written, damage numbers and reduced motion."
          ]
        },
        { kind: "p", text: "Thank you for being among the first to walk. The King is waiting. Safe travels." }
      ]
    }
  }
];

/** The article of that slug, if any. */
export function newsPost(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((post) => post.slug === slug);
}
