import { defineMessages } from "../define";

/**
 * The Roll of the Bound: the public leaderboard page (/[locale]/leaderboard) and the boards'
 * names, shared with the Hall in the game. Each board has its name on the Roll and its plain
 * meaning, always shown together (BIBLE 6.8).
 */
export const leaderboard = defineMessages({
  fr: {
    metaTitle: "Classement du clicker fantasy",
    metaDescription:
      "Le classement public d'Idlebound : étape maximale, ascensions, essences récoltées, succès et descentes des meilleurs aventuriers. Chaque score est vérifié par le serveur.",
    title: "Le Registre des Liés",
    subtitle: "Classement",
    intro: "Le Grand Livre n'écrit que ce qui est vraiment arrivé : chaque score est vérifié par le serveur à chaque envoi. ",
    introCta: "Crée un compte en jeu",
    introEnd: " pour y inscrire ton nom.",
    tabsLabel: "Type de classement",
    boards: {
      stage: "Profondeur",
      ascensions: "Nuits",
      essences: "Lumière",
      achievements: "Hauts faits",
      descents: "Nuit"
    },
    meanings: {
      stage: "Étape maximale",
      ascensions: "Ascensions",
      essences: "Essences récoltées",
      achievements: "Succès",
      descents: "Descentes, puis étape maximale"
    },
    stageValue: (stage: string) => `Étape ${stage}`,
    descentsValue: (descents: string, stage: string) => `${descents} · étape ${stage}`,
    unavailable: "Le classement est momentanément indisponible. Réessaie dans un instant.",
    empty: "Aucun nom n'est encore inscrit. ",
    emptyCta: "Inscris le premier nom !",
    columns: { rank: "#", player: "Aventurier", stage: "Étape", ascensions: "Ascensions" }
  },
  en: {
    metaTitle: "Fantasy clicker leaderboard",
    metaDescription:
      "Idlebound's public leaderboard: highest stage, ascensions, essences collected, achievements and Descents of the best adventurers. Every score is verified by the server.",
    title: "The Roll of the Bound",
    subtitle: "Leaderboard",
    intro: "The Ledger only writes what truly happened: every score is verified by the server on every update. ",
    introCta: "Create an account in the game",
    introEnd: " to inscribe your name.",
    tabsLabel: "Leaderboard type",
    boards: {
      stage: "Depth",
      ascensions: "Nights",
      essences: "Light",
      achievements: "Deeds",
      descents: "Night"
    },
    meanings: {
      stage: "Highest stage",
      ascensions: "Ascensions",
      essences: "Essences collected",
      achievements: "Achievements",
      descents: "Descents, then highest stage"
    },
    stageValue: (stage: string) => `Stage ${stage}`,
    descentsValue: (descents: string, stage: string) => `${descents} · stage ${stage}`,
    unavailable: "The leaderboard is temporarily unavailable. Try again in a moment.",
    empty: "No name is inscribed yet. ",
    emptyCta: "Write the first one!",
    columns: { rank: "#", player: "Adventurer", stage: "Stage", ascensions: "Ascensions" }
  }
});
