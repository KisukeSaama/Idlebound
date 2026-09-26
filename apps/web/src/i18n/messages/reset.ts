import { defineMessages } from "../define";

/** Password reset page (/[locale]/reset-password), reached from the e-mail link. */
export const reset = defineMessages({
  fr: {
    metaTitle: "Nouveau mot de passe",
    title: "Nouveau mot de passe",
    invalidLink: "Lien invalide. Redemande un e-mail depuis l'écran de connexion du jeu.",
    success: "Mot de passe mis à jour. Tu es connecté.",
    resume: "Reprendre l'aventure",
    mismatch: "Les deux mots de passe ne correspondent pas.",
    newPassword: "Nouveau mot de passe",
    hint: "8 caractères minimum.",
    confirm: "Confirmation",
    saving: "Enregistrement…",
    save: "Enregistrer"
  },
  en: {
    metaTitle: "New password",
    title: "New password",
    invalidLink: "Invalid link. Request a new email from the game's sign-in screen.",
    success: "Password updated. You are signed in.",
    resume: "Resume your adventure",
    mismatch: "The two passwords don't match.",
    newPassword: "New password",
    hint: "At least 8 characters.",
    confirm: "Confirm password",
    saving: "Saving…",
    save: "Save"
  }
});
