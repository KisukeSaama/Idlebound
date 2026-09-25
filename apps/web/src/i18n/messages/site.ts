import { defineMessages } from "../define";

/** Site chrome (nav, footer), global metadata, 404 and the play page shell. */
export const site = defineMessages({
  fr: {
    meta: {
      tagline: "Le clicker fantasy gratuit dans ton navigateur",
      description:
        "Idlebound est un idle clicker fantasy gratuit : terrasse des monstres, recrute 21 compagnons, affronte des boss, fais ton ascension et grimpe au classement. Sans téléchargement.",
      keywords: ["idle game", "clicker", "jeu incrémental", "jeu navigateur gratuit", "idle clicker", "fantasy", "clicker heroes", "jeu idle français", "jeu gratuit sans téléchargement"],
      ogImageAlt: "Idlebound, clicker fantasy"
    },
    nav: {
      home: "Idlebound, accueil",
      main: "Navigation principale",
      leaderboard: "Classement",
      game: "Le jeu",
      play: "Jouer"
    },
    footer: {
      copyright: (year: number) => `© ${year} Idlebound · Clicker fantasy gratuit`,
      links: "Liens de pied de page",
      play: "Jouer",
      leaderboard: "Classement",
      privacy: "Confidentialité",
      otherLanguage: "Version anglaise"
    },
    notFound: {
      title: "Page introuvable",
      text: "Ce rat des champs a dévoré la page que tu cherchais.",
      back: "Retour à l'accueil"
    },
    play: {
      title: "Jouer à Idlebound, clicker fantasy gratuit",
      description:
        "Lance Idlebound dans ton navigateur : clique, recrute des compagnons, affronte les boss et fais ton ascension. Gratuit, sans téléchargement, sauvegarde automatique.",
      noscript: "Idlebound a besoin de JavaScript pour fonctionner.",
      loading: "Réveil des compagnons…"
    }
  },
  en: {
    meta: {
      tagline: "The free fantasy clicker in your browser",
      description:
        "Idlebound is a free fantasy idle clicker: slay monsters, hire 21 companions, battle bosses, ascend and climb the leaderboard. No download needed.",
      keywords: ["idle game", "clicker", "incremental game", "free browser game", "idle clicker", "fantasy", "clicker heroes", "fantasy idle game", "free game no download"],
      ogImageAlt: "Idlebound, fantasy clicker"
    },
    nav: {
      home: "Idlebound, home",
      main: "Main navigation",
      leaderboard: "Leaderboard",
      game: "The game",
      play: "Play"
    },
    footer: {
      copyright: (year: number) => `© ${year} Idlebound · Free fantasy clicker`,
      links: "Footer links",
      play: "Play",
      leaderboard: "Leaderboard",
      privacy: "Privacy",
      otherLanguage: "French version"
    },
    notFound: {
      title: "Page not found",
      text: "This field rat ate the page you were looking for.",
      back: "Back to home"
    },
    play: {
      title: "Play Idlebound, the free fantasy clicker",
      description:
        "Launch Idlebound in your browser: click, hire companions, battle bosses and ascend. Free, no download, automatic saving.",
      noscript: "Idlebound needs JavaScript to run.",
      loading: "Waking the companions…"
    }
  }
});
