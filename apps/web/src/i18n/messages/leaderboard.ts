import { defineMessages } from "../define";

/** Public leaderboard page (/[locale]/leaderboard). */
export const leaderboard = defineMessages({
  fr: {
    metaTitle: "Classement des joueurs",
    metaDescription:
      "Le classement public d'Idlebound : étape maximale, ascensions, essences récoltées et succès des meilleurs aventuriers. Chaque score est vérifié par le serveur.",
    title: "Classement",
    intro: "Les scores sont vérifiés par le serveur à chaque sauvegarde : seules les progressions possibles avec les règles du jeu y figurent. ",
    introCta: "Crée un compte en jeu",
    introEnd: " pour y apparaître.",
    tabsLabel: "Type de classement",
    boards: {
      stage: "Étape maximale",
      ascensions: "Ascensions",
      essences: "Essences",
      achievements: "Succès"
    },
    stageValue: (stage: string) => `Étape ${stage}`,
    unavailable: "Le classement est momentanément indisponible. Réessaie dans un instant.",
    empty: "Personne n'est encore classé. ",
    emptyCta: "Prends la première place !",
    columns: { rank: "#", player: "Aventurier", stage: "Étape", ascensions: "Ascensions" }
  },
  en: {
    metaTitle: "Player leaderboard",
    metaDescription:
      "Idlebound's public leaderboard: highest stage, ascensions, essences harvested and achievements of the best adventurers. Every score is verified by the server.",
    title: "Leaderboard",
    intro: "Scores are verified by the server on every save: only progress that is possible under the game's rules makes it here. ",
    introCta: "Create an account in the game",
    introEnd: " to show up.",
    tabsLabel: "Leaderboard type",
    boards: {
      stage: "Highest stage",
      ascensions: "Ascensions",
      essences: "Essences",
      achievements: "Achievements"
    },
    stageValue: (stage: string) => `Stage ${stage}`,
    unavailable: "The leaderboard is temporarily unavailable. Try again in a moment.",
    empty: "Nobody is ranked yet. ",
    emptyCta: "Take first place!",
    columns: { rank: "#", player: "Adventurer", stage: "Stage", ascensions: "Ascensions" }
  }
});
