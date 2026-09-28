import { defineMessages } from "../define";

/** The Hall's books: the Chronicle and its Night list, the Bestiary's extras, the Ledger's own pages. */
export const chronicle = defineMessages({
  fr: {
    /** One heading per Chronicle source, in the book's order. */
    sources: {
      keystone: "Clés de voûte des strates",
      milestone: "Jalons",
      king: "Paroles du roi",
      echo: "Échos de la route",
      age: "Échos des Âges",
      wanderer: "Errants",
      event: "Événements",
      memory: "Souvenirs",
      lesson: "Leçons",
      song: "Chants de Célestine",
      dream: "Retours",
      saying: "Dits du Comptoir",
      relic: "Légendes des reliques",
      altar: "Légendes des autels",
      secret: "Secrets",
      crown: "La Couronne"
    },
    newCount: (count: number) => `${count} ${count === 1 ? "nouveau" : "nouveaux"}`,
    showMore: (count: number) => `Afficher la suite (${count})`,
    showLess: "Réduire",
    presentNight: "La nuit présente",
    reading: (descent: number) => `Relue à la Descente ${descent}`,
    nights: "Les Nuits",
    nightsHint: "Les cent dernières, de la plus récente à la plus ancienne.",
    nightLine: (night: string, stage: string, light: string) => `Nuit ${night}. Étape ${stage} atteinte. Lumière rapportée : ${light}.`,
    kingSaid: (word: string) => `Le Roi a dit : « ${word} »`,
    descentLine: (descent: string, stage: string, threads: string) => `Descente ${descent}. Étape ${stage} atteinte. ${threads} fils tissés.`,
    pawPrint: "Une page blanche, une empreinte de patte",
    stats: {
      kings: "Rois vaincus",
      seams: "Brèches refermées",
      descents: "Descentes",
      threads: "Fils tissés",
      fragments: "Fragments trouvés",
      bestiary: "Bestiaire (rencontrés / total)"
    }
  },
  en: {
    sources: {
      keystone: "Keystones of the strata",
      milestone: "Milestones",
      king: "The King's Words",
      echo: "Echoes of the road",
      age: "Echoes of the Ages",
      wanderer: "Wanderers",
      event: "Events",
      memory: "Memories",
      lesson: "Lessons",
      song: "Célestine's songs",
      dream: "Returns",
      saying: "The Stallkeeper's sayings",
      relic: "Relic legends",
      altar: "Altar legends",
      secret: "Secrets",
      crown: "The Crown"
    },
    newCount: (count: number) => `${count} new`,
    showMore: (count: number) => `Show more (${count})`,
    showLess: "Show fewer",
    presentNight: "The present night",
    reading: (descent: number) => `Read again in Descent ${descent}`,
    nights: "The Nights",
    nightsHint: "The last hundred, newest first.",
    nightLine: (night: string, stage: string, light: string) => `Night ${night}. Reached stage ${stage}. Brought back ${light} light.`,
    kingSaid: (word: string) => `The King said: “${word}”`,
    descentLine: (descent: string, stage: string, threads: string) => `Descent ${descent}. Reached stage ${stage}. Wove ${threads} threads.`,
    pawPrint: "A blank page, a paw print",
    stats: {
      kings: "Kings beaten",
      seams: "Seams closed",
      descents: "Descents",
      threads: "Threads woven",
      fragments: "Fragments found",
      bestiary: "Bestiary (met / total)"
    }
  }
});
