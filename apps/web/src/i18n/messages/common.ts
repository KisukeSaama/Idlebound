import { defineMessages } from "../define";

/** Strings shared by several areas. Keep it small: prefer the area's own namespace. */
export const common = defineMessages({
  fr: {
    close: "Fermer",
    cancel: "Annuler",
    confirm: "Confirmer",
    gold: "Or",
    essences: "Essences",
    shards: "Éclats",
    stage: (stage: string | number) => `Étape ${stage}`,
    level: (level: string | number) => `Niv. ${level}`,
    languageNames: { fr: "Français", en: "English" }
  },
  en: {
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    gold: "Gold",
    essences: "Essences",
    shards: "Shards",
    stage: (stage: string | number) => `Stage ${stage}`,
    level: (level: string | number) => `Lv. ${level}`,
    languageNames: { fr: "Français", en: "English" }
  }
});
