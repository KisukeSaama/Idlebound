import { defineMessages } from "../define";

/** Site chrome (nav, footer), global metadata, 404 and the play page shell. */
export const site = defineMessages({
  fr: {
    meta: {
      tagline: "Le clicker fantasy dans ton navigateur",
      description:
        "Idlebound est un idle clicker fantasy : terrasse des monstres, recrute des compagnons, affronte le Roi déchu, nuit après nuit. Sans téléchargement.",
      keywords: ["idle game", "clicker", "jeu incrémental", "jeu navigateur", "idle clicker", "fantasy", "clicker heroes", "jeu idle français", "jeu sans téléchargement"],
      ogImageAlt: "Idlebound, clicker fantasy"
    },
    nav: {
      home: "Idlebound, accueil",
      main: "Navigation principale",
      skip: "Aller au contenu",
      news: "Actualités",
      wiki: "Wiki",
      leaderboard: "Classement",
      play: "Jouer",
      top: "Revenir en haut",
      menuOpen: "Ouvrir le menu",
      menuClose: "Fermer le menu"
    },
    footer: {
      copyright: (year: number) => `© ${year} Idlebound · Clicker fantasy`,
      links: "Liens de pied de page",
      play: "Jouer",
      news: "Actualités",
      wiki: "Wiki",
      leaderboard: "Classement",
      privacy: "Confidentialité",
      language: "Changer de langue",
      languageTitle: "Langue"
    },
    notFound: {
      title: "Page introuvable",
      text: "Ce rat des champs a dévoré la page que tu cherchais.",
      back: "Retour à l'accueil"
    },
    play: {
      title: "Jouer au clicker fantasy",
      description:
        "Lance Idlebound dans ton navigateur : frappe, recrute des compagnons, affronte les boss et fais ton ascension. Sans téléchargement, ta partie te suit partout.",
      noscript: "Idlebound a besoin de JavaScript pour fonctionner.",
      loading: "Réveil des compagnons…"
    }
  },
  en: {
    meta: {
      tagline: "The fantasy clicker in your browser",
      description:
        "Idlebound is a fantasy idle clicker: slay monsters, hire companions, face the Fallen King, night after night. No download needed.",
      keywords: ["idle game", "clicker", "incremental game", "browser game", "idle clicker", "fantasy", "clicker heroes", "fantasy idle game", "no download game"],
      ogImageAlt: "Idlebound, fantasy clicker"
    },
    nav: {
      home: "Idlebound, home",
      main: "Main navigation",
      skip: "Skip to content",
      news: "News",
      wiki: "Wiki",
      leaderboard: "Leaderboard",
      play: "Play",
      top: "Back to top",
      menuOpen: "Open the menu",
      menuClose: "Close the menu"
    },
    footer: {
      copyright: (year: number) => `© ${year} Idlebound · Fantasy clicker`,
      links: "Footer links",
      play: "Play",
      news: "News",
      wiki: "Wiki",
      leaderboard: "Leaderboard",
      privacy: "Privacy",
      language: "Change language",
      languageTitle: "Language"
    },
    notFound: {
      title: "Page not found",
      text: "This field rat ate the page you were looking for.",
      back: "Back to home"
    },
    play: {
      title: "Play the fantasy clicker",
      description:
        "Launch Idlebound in your browser: strike, hire companions, battle bosses and ascend. No download, and your game follows you everywhere.",
      noscript: "Idlebound needs JavaScript to run.",
      loading: "Waking the companions…"
    }
  }
});
