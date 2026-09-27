import { defineMessages } from "../define";

/** E-mail confirmation page (/[locale]/verify-email), reached from the e-mail link. */
export const verify = defineMessages({
  fr: {
    metaTitle: "Confirmation de l'e-mail",
    title: "Confirmation",
    pending: "Confirmation en cours…",
    success: (username: string) => `C'est fait, ${username} : ton adresse est confirmée.`,
    invalidLink: "Lien invalide. Demande un nouvel e-mail depuis la fenêtre Compte du jeu.",
    play: "Retour au jeu"
  },
  en: {
    metaTitle: "E-mail confirmation",
    title: "Confirmation",
    pending: "Confirming…",
    success: (username: string) => `All set, ${username}: your address is confirmed.`,
    invalidLink: "Invalid link. Request a new e-mail from the game's Account window.",
    play: "Back to the game"
  }
});
