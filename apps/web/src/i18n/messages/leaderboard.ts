import { defineMessages } from "../define";

/**
 * The Roll of the Bound: the public leaderboard page (/[locale]/leaderboard) and its boards,
 * shared with the Hall in the game. Each board says plainly what it ranks (BIBLE 6.8); Depth
 * is the official one.
 */
export const leaderboard = defineMessages({
  fr: {
    metaTitle: "Classement du clicker fantasy",
    metaDescription:
      "Le classement officiel d'Idlebound, l'étape la plus haute atteinte, et trois autres : Rois abattus, promesses tenues, cristaux attrapés. Chaque score est vérifié par le serveur.",
    title: "Le Registre des Liés",
    subtitle: "Classement",
    intro: "Le Grand Livre n'écrit que ce qui est vraiment arrivé : chaque score est vérifié par le serveur à chaque envoi. ",
    introCta: "Crée un compte en jeu",
    introEnd: " pour y inscrire ton nom.",
    tabsLabel: "Classement affiché",
    official: "Officiel",
    boards: { stage: "Profondeur", kings: "Régicide", promises: "Parole tenue", crystals: "La Veille" },
    rules: {
      stage: "Le classement officiel : l'étape la plus haute jamais atteinte. Une ascension ou une descente ne la fait pas perdre, elle t'aide à la dépasser. À étape égale, celui qui l'a atteinte en premier passe devant.",
      kings: "Les Rois abattus depuis le début de la partie. Un Roi garde chaque 50e étape et se relève à chaque nuit : le compte ne s'arrête jamais.",
      promises: "Les promesses tenues aux compagnons depuis le début de la partie. Une parole par nuit au plus, tenue seulement si le Roi tombe.",
      crystals: "Les cristaux attrapés depuis le début de la partie. Ils ne tombent que pour qui veille, et s'éteignent en quelques secondes."
    },
    ties: "À égalité, l'étape la plus haute passe devant, puis le premier à l'avoir atteinte.",
    values: {
      stage: (stage: string) => `Étape ${stage}`,
      kings: (count: number, value: string) => `${value} ${count > 1 ? "Rois" : "Roi"}`,
      promises: (count: number, value: string) => `${value} ${count > 1 ? "promesses" : "promesse"}`,
      crystals: (count: number, value: string) => `${value} ${count > 1 ? "cristaux" : "cristal"}`
    },
    unavailable: "Le classement est momentanément indisponible. Réessaie dans un instant.",
    empty: "Aucun nom n'est encore inscrit. ",
    emptyCta: "Inscris le premier nom !",
    around: "Autour de toi",
    top: "En tête",
    columns: { rank: "#", player: "Marcheur", stage: "Étape la plus haute", reached: "Atteinte le" }
  },
  en: {
    metaTitle: "Fantasy clicker leaderboard",
    metaDescription:
      "Idlebound's official leaderboard, the highest stage reached, and three more: Kings felled, promises kept, crystals caught. Every score is verified by the server.",
    title: "The Roll of the Bound",
    subtitle: "Leaderboard",
    intro: "The Ledger only writes what truly happened: every score is verified by the server on every update. ",
    introCta: "Create an account in the game",
    introEnd: " to inscribe your name.",
    tabsLabel: "Leaderboard shown",
    official: "Official",
    boards: { stage: "Depth", kings: "Kingslayer", promises: "Word Kept", crystals: "The Watch" },
    rules: {
      stage: "The official leaderboard: the highest stage ever reached. An ascension or a Descent never takes it away, it helps you go past it. On the same stage, whoever reached it first comes first.",
      kings: "Kings felled since the game began. A King guards every 50th stage and rises again each night: the count never ends.",
      promises: "Promises kept to companions since the game began. One word a night at most, kept only if the King falls.",
      crystals: "Crystals caught since the game began. They only fall for those who keep watch, and fade within seconds."
    },
    ties: "On a tie, the highest stage comes first, then whoever reached it first.",
    values: {
      stage: (stage: string) => `Stage ${stage}`,
      kings: (count: number, value: string) => `${value} ${count === 1 ? "King" : "Kings"}`,
      promises: (count: number, value: string) => `${value} ${count === 1 ? "promise" : "promises"}`,
      crystals: (count: number, value: string) => `${value} ${count === 1 ? "crystal" : "crystals"}`
    },
    unavailable: "The leaderboard is temporarily unavailable. Try again in a moment.",
    empty: "No name is inscribed yet. ",
    emptyCta: "Write the first one!",
    around: "Around you",
    top: "At the top",
    columns: { rank: "#", player: "Walker", stage: "Highest stage", reached: "Reached on" }
  }
});
