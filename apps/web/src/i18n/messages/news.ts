import { defineMessages } from "../define";

/** News pages (/[locale]/news) and the latest news on the landing page. */
export const news = defineMessages({
  fr: {
    metaTitle: "Actualités",
    metaDescription: "Les nouvelles de la route : notes de mise à jour, nouveautés et annonces de l'équipe d'Idlebound.",
    title: "Actualités",
    subtitle: "Ce qui change sur la route, version après version.",
    kinds: { patch: "Notes de mise à jour", announcement: "Annonce" },
    version: (version: string) => `Version ${version}`,
    read: "Lire l'article",
    all: "Toutes les actualités",
    back: "Retour aux actualités",
    signature: "L'équipe d'Idlebound",
    landingTitle: "Dernières nouvelles de la route",
    older: "Plus tôt sur la route",
    feed: "Flux RSS"
  },
  en: {
    metaTitle: "News",
    metaDescription: "News from the road: patch notes, new features and announcements from the Idlebound team.",
    title: "News",
    subtitle: "What changes on the road, version after version.",
    kinds: { patch: "Patch notes", announcement: "Announcement" },
    version: (version: string) => `Version ${version}`,
    read: "Read the article",
    all: "All news",
    back: "Back to the news",
    signature: "The Idlebound team",
    landingTitle: "Latest news from the road",
    older: "Earlier on the road",
    feed: "RSS feed"
  }
});
