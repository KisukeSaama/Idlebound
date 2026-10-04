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
    slug: "patch-notes-0-5-2",
    date: "2026-10-05",
    kind: "patch",
    version: "v0.5.2",
    cover: { biome: "dark-forest", creature: "shade-wolf" },
    fr: {
      title: "Notes de mise à jour 0.5.2",
      summary: "Un nouveau classement pour les Descentes, des comptes mieux gardés, et une partie qui ne se perd plus à cause d'une horloge pressée.",
      body: [
        { kind: "p", text: "Cette version regarde surtout vers ceux qui marchent loin : un classement qui récompense enfin ton rythme au Métier d'Eldra. Et derrière, beaucoup de petites serrures resserrées, pour que la route reste à toi et que chaque record reste honnête." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "Classement : « Régicide » laisse sa place à « Nuits retissées », qui range les Descentes ayant tissé au moins un fil. L'ancien tableau classait presque exactement comme la Profondeur ; celui-ci récompense ta cadence au Métier d'Eldra. Tes Descentes passées comptent déjà."
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Comptes : quelqu'un qui tente de deviner ton mot de passe depuis plusieurs endroits à la fois ne peut plus t'empêcher d'entrer chez toi. Ses essais sont stoppés, les tiens passent toujours.",
            "Comptes : corriger une adresse mal tapée annule tous les liens de réinitialisation envoyés à l'ancienne, et chaque correction compte dans les 3 e-mails de confirmation permis par heure.",
            "Noms : les noms réservés et les mots interdits sont aussi repérés quand ils sont écrits avec des lettres qui leur ressemblent (un l minuscule pour un i, « rn » pour un m, ø, æ, ß et leurs cousins).",
            "Progression : un appareil dont l'horloge avance de quelques minutes ne voit plus sa nouvelle partie refusée pour toujours. Le jeu se règle maintenant sur sa propre heure, plus sur celle de ton appareil.",
            "Jeu loyal : les records du classement sont mieux protégés. Plusieurs façons de gonfler un score ou de toucher deux fois la même récompense sont désormais refusées. Si tu joues honnêtement, rien ne change pour toi.",
            "Détisser : franchir une étape avec Détisser juste après une autre ne risque plus de faire refuser ta progression."
          ]
        },
        { kind: "p", text: "Merci de nous signaler ce qui accroche, c'est comme ça que la route s'améliore. Bonne route, et bonne Descente." }
      ],
      link: { route: "leaderboard", label: "Voir le classement" }
    },
    en: {
      title: "Patch notes 0.5.2",
      summary: "A new leaderboard for Descents, better guarded accounts, and a game that no longer gets lost to a hasty clock.",
      body: [
        { kind: "p", text: "This version looks mostly toward those who walk far: a leaderboard that finally rewards your pace at Eldra's Loom. Behind it, many small locks tightened, so the road stays yours and every record stays honest." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "Leaderboard: \"Kingslayer\" gives way to \"Rewoven Nights\", which ranks the Descents that wove at least one thread. The old board ranked walkers almost exactly like Depth; this one rewards your pace at Eldra's Loom. Your past Descents already count."
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "Accounts: someone guessing your password from many places at once can no longer lock you out of your own account. Their guesses are stopped, yours still go through.",
            "Accounts: fixing a mistyped address cancels every password reset link sent to the old one, and each fix counts toward the 3 confirmation e-mails allowed per hour.",
            "Names: reserved names and banned words are also caught when written with look-alike letters (a lowercase l for an i, \"rn\" for an m, ø, æ, ß and their kin).",
            "Progress: a device whose clock runs a few minutes fast no longer has its new game refused for good. The game now keeps its own time, not your device's.",
            "Fair play: leaderboard records are better protected. Several ways to inflate a score or collect the same reward twice are now refused. If you play honestly, nothing changes for you.",
            "Unweave: crossing a stage with Unweave right after another no longer risks having your progress refused."
          ]
        },
        { kind: "p", text: "Thank you for telling us what snags, that is how the road gets better. Safe travels, and a good Descent." }
      ],
      link: { route: "leaderboard", label: "See the leaderboard" }
    }
  },
  {
    slug: "patch-notes-0-5-1",
    date: "2026-10-04",
    kind: "patch",
    version: "v0.5.1",
    cover: { biome: "green-plains", creature: "hollow-scarecrow" },
    fr: {
      title: "Notes de mise à jour 0.5.1",
      summary: "Une petite retouche le jour même : les créatures du wiki retrouvent tous leurs pixels, nettes sur chaque appareil.",
      body: [
        { kind: "p", text: "Le wiki vient à peine d'ouvrir, et tu nous as déjà montré une chose à reprendre. La voici réglée, le jour même. Merci de lire de si près." },
        { kind: "h2", text: "Corrections" },
        {
          kind: "list",
          items: [
            "Les créatures du wiki s'affichaient trop petites : réduites dans un cadre de taille fixe, elles perdaient des pixels et devenaient floues. Elles gardent maintenant chaque pixel entier, à leur vraie taille, et restent nettes sur un téléphone comme sur un grand moniteur.",
            "Ça vaut partout où elles apparaissent : le bestiaire, la page de chaque biome, et le visage de chaque créature à travers les Âges. Leur grille s'adapte à la place disponible au lieu de les tasser."
          ]
        },
        { kind: "p", text: "Bonne lecture, et bonne route." }
      ],
      link: { route: "wiki", label: "Ouvrir le bestiaire du wiki" }
    },
    en: {
      title: "Patch notes 0.5.1",
      summary: "A small same-day touch-up: the creatures of the wiki get every pixel back, crisp on every device.",
      body: [
        { kind: "p", text: "The wiki had barely opened when you showed us something to fix. Here it is, sorted the same day. Thank you for reading so closely." },
        { kind: "h2", text: "Fixes" },
        {
          kind: "list",
          items: [
            "Creatures in the wiki were drawn too small: squeezed into a fixed frame, they lost pixels and turned blurry. They now keep every pixel whole, at their true size, and stay sharp on a phone as on a large monitor.",
            "This holds everywhere they appear: the bestiary, each biome's page, and every creature's look through the Ages. Their grid now makes room for them instead of cramming them in."
          ]
        },
        { kind: "p", text: "Happy reading, and safe travels." }
      ],
      link: { route: "wiki", label: "Open the wiki's bestiary" }
    }
  },
  {
    slug: "patch-notes-0-5-0",
    date: "2026-10-04",
    kind: "patch",
    version: "v0.5.0",
    cover: { biome: "fallen-king-ruins", creature: "ruined-king" },
    fr: {
      title: "Notes de mise à jour 0.5.0",
      summary: "Le wiki ouvre, les Actualités arrivent, et tout le site se lit mieux : nouveau menu, choix de la langue, flux RSS, coups qui pleuvent sur le Roi.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Cette version ne touche pas à la route elle-même : elle s'occupe de tout ce qui l'entoure. Un wiki pour tout savoir, des Actualités pour suivre ce qui change, et un site plus simple à parcourir, au clavier comme à la souris." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "list",
          items: [
            "Le wiki : un guide pour tes premières nuits, une foire aux questions, un calculateur, une fiche pour chaque compagnon, chaque créature et chaque relique nommée, et tous les systèmes du jeu. Il ne gâche rien : il suit ta partie et n'ouvre que ce que tu as déjà vécu, ou bien tu choisis toi-même ce que tu dévoiles. Et il continue de grandir.",
            "Les Actualités : les notes de mise à jour et les annonces de l'équipe, comme celle que tu lis. Les trois dernières s'affichent sur la page d'accueil, et la plus récente ouvre la page en grand.",
            "Chaque article a sa propre image en pixel art, qui l'accompagne aussi quand tu le partages.",
            "Tu peux suivre les Actualités par flux RSS, en français ou en anglais.",
            "Sur la page d'accueil, frapper le Roi déchu affiche maintenant les mêmes dégâts que dans le jeu : la même écriture, la marque « Critique » au-dessus d'un coup critique, et les coups rapides qui s'écartent en éventail pour rester lisibles."
          ]
        },
        { kind: "h2", text: "Le site" },
        {
          kind: "list",
          items: [
            "Le menu est le même sur toutes les pages : le logo à gauche, qui te ramène à l'accueil, les liens à droite. Avant, chaque page avait le sien, avec un lien « Le jeu » en plus. Il est aussi plus fin, et il reste en haut pendant que tu lis.",
            "Les pages glissent jusqu'à la partie que tu choisis, et un bouton dans le coin te ramène en haut des pages longues.",
            "La langue se choisit depuis un globe en bas de chaque page, qui ouvre une petite fenêtre avec les langues. Ton choix est retenu, comme dans les Réglages du jeu.",
            "Le wiki et les Actualités se lisent mieux avec la synthèse vocale ou au clavier : un lien « Aller au contenu » ouvre chaque page, le calculateur donne son résultat en une phrase courte, et les modes de lecture disent ce qu'ils font.",
            "Une page sur quelque chose que tu n'as pas encore croisé ne trahit plus son nom dans le titre affiché par ton navigateur."
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. On se retrouve à la prochaine version, et d'ici là, bonne route." }
      ],
      link: { route: "wiki", label: "Ouvrir le wiki" }
    },
    en: {
      title: "Patch notes 0.5.0",
      summary: "The wiki opens, the News arrive, and the whole site reads better: a new menu, a language picker, an RSS feed, blows raining on the King.",
      body: [
        { kind: "p", text: "Good evening, walker. This version leaves the road itself alone and takes care of everything around it. A wiki to learn it all, News to follow what changes, and a site that is easier to get around, by keyboard or by mouse." },
        { kind: "h2", text: "New" },
        {
          kind: "list",
          items: [
            "The wiki: a guide for your first nights, a FAQ, a calculator, a page for every companion, creature and named relic, and every system of the game. It spoils nothing: it follows your game and only opens what you have already lived, or you pick what to reveal yourself. And it keeps growing.",
            "The News: patch notes and announcements from the team, like the one you are reading. The three latest show on the landing page, and the newest one opens the page in large.",
            "Every article has its own pixel art picture, which also comes along when you share it.",
            "You can follow the News by RSS, in French or in English.",
            "On the landing page, striking the Fallen King now shows the same damage numbers as the game: the same lettering, the \"Critical\" mark over a critical hit, and quick blows fanning out so each one stays readable."
          ]
        },
        { kind: "h2", text: "The site" },
        {
          kind: "list",
          items: [
            "The menu sits the same on every page: the logo on the left, which takes you back to the landing page, the links on the right. Each page used to have its own, with an extra \"The game\" link. It is also slimmer, and it stays at the top while you read.",
            "Pages glide to the part you pick, and a button in the corner brings you back to the top of long pages.",
            "The language is chosen from a globe at the bottom of every page, which opens a small window listing the languages. Your choice is remembered, as in the game's Settings.",
            "The wiki and the News read better with text to speech or a keyboard: a \"Skip to content\" link opens every page, the calculator gives its result in one short sentence, and the reading modes say what they do.",
            "A page about something you have not met yet no longer gives its name away in the title your browser shows."
          ]
        },
        { kind: "p", text: "Thank you for walking with us. See you at the next version, and until then, safe travels." }
      ],
      link: { route: "wiki", label: "Open the wiki" }
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
  }
];

/** The article of that slug, if any. */
export function newsPost(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((post) => post.slug === slug);
}
