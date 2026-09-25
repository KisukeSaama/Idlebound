import { LOCALE_COOKIE, USERNAME_MAX, USERNAME_MIN, resolveLocale, type Locale, type UsernameIssue } from "@idlebound/game";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";

/**
 * Every player-facing API message, in both locales. The French object defines the shape;
 * the English one must match it.
 */
function define<T>(messages: { fr: T; en: NoInfer<T> }): Record<Locale, T> {
  return messages;
}

const MESSAGES = define({
  fr: {
    requestTooLarge: "Requête trop volumineuse.",
    requestRefused: "Requête refusée.",
    originRefused: "Origine refusée.",
    notFound: "Introuvable.",
    internalError: "Erreur interne. Réessaie dans un instant.",
    invalidRequest: "Requête invalide.",
    invalidEmail: "Adresse e-mail invalide.",
    tooManyAttempts: (seconds: number) => `Trop de tentatives. Réessaie dans ${seconds} s.`,
    loginRequired: "Connexion requise.",
    usernameTaken: "Ce pseudo est déjà pris.",
    emailTaken: "Un compte existe déjà avec cet e-mail.",
    usernameOrEmailTaken: "Ce pseudo ou cet e-mail est déjà utilisé.",
    wrongCredentials: "E-mail ou mot de passe incorrect.",
    forgotSent: "Si un compte existe pour cet e-mail, un lien vient d'être envoyé.",
    resetLinkInvalid: "Ce lien a expiré ou a déjà été utilisé.",
    accountNotFound: "Compte introuvable.",
    wrongCurrentPassword: "Mot de passe actuel incorrect.",
    wrongPassword: "Mot de passe incorrect.",
    unknownBoard: "Classement inconnu.",
    invalidSave: (detail: string) => `Sauvegarde invalide : ${detail}`,
    saveConflict: "La sauvegarde cloud a changé depuis un autre appareil.",
    tooManyReplacements: "Trop de remplacements de sauvegarde. Réessaie plus tard.",
    saveRejected: "Sauvegarde refusée par la vérification anti-triche.",
    lineageTooOld: "Cette partie est trop ancienne par rapport au compte.",
    username: {
      "too-short": `Le pseudo doit contenir au moins ${USERNAME_MIN} caractères.`,
      "too-long": `Le pseudo doit contenir au plus ${USERNAME_MAX} caractères.`,
      charset: "Lettres, chiffres, tiret et tiret bas uniquement.",
      "no-letter": "Le pseudo doit contenir au moins une lettre.",
      reserved: "Ce pseudo est réservé.",
      forbidden: "Ce pseudo n'est pas autorisé."
    } satisfies Record<UsernameIssue, string>,
    password: {
      tooShort: "Le mot de passe doit contenir au moins 8 caractères.",
      tooLong: "Le mot de passe est trop long (128 caractères maximum).",
      tooCommon: "Ce mot de passe est trop courant.",
      tooSimple: "Ce mot de passe est trop simple.",
      containsIdentity: "Le mot de passe ne doit pas contenir ton pseudo ou ton e-mail."
    },
    resetMail: {
      subject: "Réinitialisation de ton mot de passe Idlebound",
      greeting: (username: string) => `Bonjour ${username},`,
      intro: "Tu as demandé à réinitialiser ton mot de passe Idlebound.",
      linkText: (link: string) => `Ouvre ce lien dans l'heure pour en choisir un nouveau : ${link}`,
      htmlIntro: "Tu as demandé à réinitialiser ton mot de passe. Ce lien est valable une heure :",
      button: "Choisir un nouveau mot de passe",
      ignore: "Si ce n'était pas toi, ignore simplement ce message : ton mot de passe reste inchangé."
    },
    inactivityMail: {
      subject: "Ton compte Idlebound sera bientôt supprimé",
      greeting: (username: string) => `Bonjour ${username},`,
      notice: (date: string) =>
        `Tu n'as pas joué à Idlebound depuis près de 3 ans. Sans connexion de ta part d'ici le ${date}, ton compte sera supprimé avec ta sauvegarde et ta place au classement.`,
      keep: "Pour le garder, il suffit de te connecter :",
      button: "Me connecter",
      ignore: "Si tu ne souhaites plus jouer, tu n'as rien à faire : tes données seront effacées automatiquement."
    }
  },
  en: {
    requestTooLarge: "Request too large.",
    requestRefused: "Request refused.",
    originRefused: "Origin refused.",
    notFound: "Not found.",
    internalError: "Internal error. Try again in a moment.",
    invalidRequest: "Invalid request.",
    invalidEmail: "Invalid e-mail address.",
    tooManyAttempts: (seconds: number) => `Too many attempts. Try again in ${seconds} s.`,
    loginRequired: "You need to be signed in.",
    usernameTaken: "This username is already taken.",
    emailTaken: "An account already exists with this e-mail.",
    usernameOrEmailTaken: "This username or e-mail is already in use.",
    wrongCredentials: "Wrong e-mail or password.",
    forgotSent: "If an account exists for this e-mail, a link has just been sent.",
    resetLinkInvalid: "This link has expired or has already been used.",
    accountNotFound: "Account not found.",
    wrongCurrentPassword: "Current password is incorrect.",
    wrongPassword: "Incorrect password.",
    unknownBoard: "Unknown leaderboard.",
    invalidSave: (detail: string) => `Invalid save: ${detail}`,
    saveConflict: "The cloud save was changed from another device.",
    tooManyReplacements: "Too many save replacements. Try again later.",
    saveRejected: "Save rejected by the anti-cheat check.",
    lineageTooOld: "This game is too old compared to the account.",
    username: {
      "too-short": `Your username must be at least ${USERNAME_MIN} characters long.`,
      "too-long": `Your username must be at most ${USERNAME_MAX} characters long.`,
      charset: "Letters, digits, dashes and underscores only.",
      "no-letter": "Your username must contain at least one letter.",
      reserved: "This username is reserved.",
      forbidden: "This username is not allowed."
    },
    password: {
      tooShort: "Your password must be at least 8 characters long.",
      tooLong: "Your password is too long (128 characters max).",
      tooCommon: "This password is too common.",
      tooSimple: "This password is too simple.",
      containsIdentity: "Your password must not contain your username or e-mail."
    },
    resetMail: {
      subject: "Reset your Idlebound password",
      greeting: (username: string) => `Hi ${username},`,
      intro: "You asked to reset your Idlebound password.",
      linkText: (link: string) => `Open this link within the hour to choose a new one: ${link}`,
      htmlIntro: "You asked to reset your password. This link is valid for one hour:",
      button: "Choose a new password",
      ignore: "If this wasn't you, just ignore this message: your password stays unchanged."
    },
    inactivityMail: {
      subject: "Your Idlebound account will soon be deleted",
      greeting: (username: string) => `Hi ${username},`,
      notice: (date: string) =>
        `You haven't played Idlebound in almost 3 years. Unless you sign in by ${date}, your account will be deleted along with your save and your leaderboard entry.`,
      keep: "To keep it, just sign in:",
      button: "Sign in",
      ignore: "If you don't want to play anymore, there is nothing to do: your data will be erased automatically."
    }
  }
});

export type ApiMessages = (typeof MESSAGES)["fr"];
export type PasswordIssue = keyof ApiMessages["password"];

/** Locale of the request: explicit choice (cookie) first, then Accept-Language. */
export function localeOf(c: Context): Locale {
  return resolveLocale(getCookie(c, LOCALE_COOKIE), c.req.header("accept-language"));
}

export function messagesFor(locale: Locale): ApiMessages {
  return MESSAGES[locale];
}

/** Messages in the language of the request. */
export function t(c: Context): ApiMessages {
  return MESSAGES[localeOf(c)];
}
