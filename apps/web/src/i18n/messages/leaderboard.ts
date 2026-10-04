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
      "Le classement officiel d'Idlebound, l'étape la plus haute atteinte, et trois autres : promesses tenues, cristaux attrapés, nuits retissées. Chaque score est vérifié par le serveur.",
    title: "Le Registre des Liés",
    subtitle: "Classement",
    intro: "Le Grand Livre n'écrit que ce qui est vraiment arrivé : chaque score est vérifié par le serveur à chaque envoi. ",
    introCta: "Crée un compte en jeu",
    introEnd: " pour y inscrire ton nom.",
    tabsLabel: "Classement affiché",
    official: "Officiel",
    boards: { stage: "Profondeur", promises: "Parole tenue", crystals: "La Veille", weavings: "Nuits retissées" },
    rules: {
      stage: "Le classement officiel : l'étape la plus haute jamais atteinte. Une ascension ou une descente ne la fait pas perdre, elle t'aide à la dépasser. À étape égale, celui qui l'a atteinte en premier passe devant.",
      promises: "Les promesses tenues aux compagnons depuis le début de la partie. Une parole par nuit au plus, tenue seulement si le Roi tombe.",
      crystals: "Les cristaux attrapés depuis le début de la partie. Ils ne tombent que pour qui veille, et s'éteignent en quelques secondes.",
      weavings: "Les Descentes qui ont tissé au moins un fil. Eldra ne tisse que ce que ta nuit a gagné en profondeur depuis la dernière : descendre souvent rapporte peu de fil à chaque fois, descendre rarement en rapporte beaucoup. À toi de choisir ton rythme."
    },
    ties: "À égalité, l'étape la plus haute passe devant, puis le premier à l'avoir atteinte.",
    values: {
      stage: (stage: string) => `Étape ${stage}`,
      promises: (count: number, value: string) => `${value} ${count > 1 ? "promesses" : "promesse"}`,
      crystals: (count: number, value: string) => `${value} ${count > 1 ? "cristaux" : "cristal"}`,
      weavings: (count: number, value: string) => `${value} ${count > 1 ? "nuits" : "nuit"}`
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
      "Idlebound's official leaderboard, the highest stage reached, and three more: promises kept, crystals caught, nights rewoven. Every score is verified by the server.",
    title: "The Roll of the Bound",
    subtitle: "Leaderboard",
    intro: "The Ledger only writes what truly happened: every score is verified by the server on every update. ",
    introCta: "Create an account in the game",
    introEnd: " to inscribe your name.",
    tabsLabel: "Leaderboard shown",
    official: "Official",
    boards: { stage: "Depth", promises: "Word Kept", crystals: "The Watch", weavings: "Rewoven Nights" },
    rules: {
      stage: "The official leaderboard: the highest stage ever reached. An ascension or a Descent never takes it away, it helps you go past it. On the same stage, whoever reached it first comes first.",
      promises: "Promises kept to companions since the game began. One word a night at most, kept only if the King falls.",
      crystals: "Crystals caught since the game began. They only fall for those who keep watch, and fade within seconds.",
      weavings: "Descents that wove at least one thread. Eldra only weaves what your night has gained in depth since the last one: descend often and each weaving brings little thread, descend rarely and it brings a lot. The pace is yours to choose."
    },
    ties: "On a tie, the highest stage comes first, then whoever reached it first.",
    values: {
      stage: (stage: string) => `Stage ${stage}`,
      promises: (count: number, value: string) => `${value} ${count === 1 ? "promise" : "promises"}`,
      crystals: (count: number, value: string) => `${value} ${count === 1 ? "crystal" : "crystals"}`,
      weavings: (count: number, value: string) => `${value} ${count === 1 ? "night" : "nights"}`
    },
    unavailable: "The leaderboard is temporarily unavailable. Try again in a moment.",
    empty: "No name is inscribed yet. ",
    emptyCta: "Write the first one!",
    around: "Around you",
    top: "At the top",
    columns: { rank: "#", player: "Walker", stage: "Highest stage", reached: "Reached on" }
  }
});
