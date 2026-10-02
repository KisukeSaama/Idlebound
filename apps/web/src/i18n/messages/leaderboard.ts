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
      "Le classement public d'Idlebound : étape maximale, étapes gagnées sur 7 jours, ascensions, essences récoltées, succès et descentes des meilleurs aventuriers. Chaque score est vérifié par le serveur.",
    title: "Le Registre des Liés",
    subtitle: "Classement",
    intro: "Le Grand Livre n'écrit que ce qui est vraiment arrivé : chaque score est vérifié par le serveur à chaque envoi. ",
    introCta: "Crée un compte en jeu",
    introEnd: " pour y inscrire ton nom.",
    tabsLabel: "Type de classement",
    boards: {
      stage: "Profondeur",
      week: "Foulée",
      ascensions: "Nuits",
      essences: "Lumière",
      achievements: "Hauts faits",
      descents: "Nuit"
    },
    meanings: {
      stage: "Étape maximale",
      week: "Étapes gagnées en 7 jours",
      ascensions: "Ascensions",
      essences: "Essences récoltées",
      achievements: "Succès",
      descents: "Descentes, puis étape maximale"
    },
    stageValue: (stage: string) => `Étape ${stage}`,
    descentsValue: (descents: string, stage: string) => `${descents} · étape ${stage}`,
    strideValue: (stages: string) => `+${stages}`,
    unavailable: "Le classement est momentanément indisponible. Réessaie dans un instant.",
    empty: "Aucun nom n'est encore inscrit. ",
    emptyCta: "Inscris le premier nom !",
    strideEmpty: "Personne n'est encore descendu plus loin au cours des 7 derniers jours. ",
    strideEmptyCta: "Ouvre la marche !",
    columns: { rank: "#", player: "Marcheur", stage: "Étape", ascensions: "Ascensions" }
  },
  en: {
    metaTitle: "Fantasy clicker leaderboard",
    metaDescription:
      "Idlebound's public leaderboard: highest stage, stages gained over 7 days, ascensions, essences collected, achievements and Descents of the best adventurers. Every score is verified by the server.",
    title: "The Roll of the Bound",
    subtitle: "Leaderboard",
    intro: "The Ledger only writes what truly happened: every score is verified by the server on every update. ",
    introCta: "Create an account in the game",
    introEnd: " to inscribe your name.",
    tabsLabel: "Leaderboard type",
    boards: {
      stage: "Depth",
      week: "Stride",
      ascensions: "Nights",
      essences: "Light",
      achievements: "Deeds",
      descents: "Night"
    },
    meanings: {
      stage: "Highest stage",
      week: "Stages gained in 7 days",
      ascensions: "Ascensions",
      essences: "Essences collected",
      achievements: "Achievements",
      descents: "Descents, then highest stage"
    },
    stageValue: (stage: string) => `Stage ${stage}`,
    descentsValue: (descents: string, stage: string) => `${descents} · stage ${stage}`,
    strideValue: (stages: string) => `+${stages}`,
    unavailable: "The leaderboard is temporarily unavailable. Try again in a moment.",
    empty: "No name is inscribed yet. ",
    emptyCta: "Write the first one!",
    strideEmpty: "Nobody has gone deeper in the last 7 days yet. ",
    strideEmptyCta: "Lead the way!",
    columns: { rank: "#", player: "Walker", stage: "Stage", ascensions: "Ascensions" }
  }
});
