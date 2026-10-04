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
