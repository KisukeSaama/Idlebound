import { LOCALE_COOKIE, USERNAME_MAX, USERNAME_MIN, resolveLocale, type Locale, type UsernameIssue } from "@idlebound/game";
import type { Context } from "hono";
import { VERIFY_LINK_DAYS } from "./verification";
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
    emailUnverified: "Confirme ton adresse e-mail pour continuer à sauvegarder ta partie.",
    verifyLinkInvalid: "Ce lien de confirmation a expiré ou n'est plus valable. Demande un nouvel e-mail depuis le jeu.",
    alreadyVerified: "Ton adresse e-mail est déjà confirmée.",
    emailLocked: "Ton adresse e-mail est confirmée : elle ne peut plus être modifiée ici.",
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
    mail: {
      fallback: "Le bouton ne s'ouvre pas ? Copie ce lien dans ton navigateur :",
      footer: "Tu reçois cet e-mail car un compte Idlebound utilise cette adresse."
    },
    verifyMail: {
      subject: "Confirme ton adresse e-mail",
      preheader: "Un clic pour garder ta partie sauvegardée.",
      title: "Confirme ton e-mail",
      body: (username: string) => `Bienvenue, ${username} ! Confirme ton adresse pour garder ta partie sauvegardée et pouvoir récupérer ton compte.`,
      button: "Confirmer mon e-mail",
      note: `Lien valable ${VERIFY_LINK_DAYS} jours. Tu n'as pas créé de compte ? Ignore ce message.`
    },
    resetMail: {
      subject: "Ton lien pour changer de mot de passe",
      preheader: "Valable une heure.",
      title: "Nouveau mot de passe",
      body: (username: string) => `${username}, voici ton lien pour choisir un nouveau mot de passe.`,
      button: "Changer mon mot de passe",
      note: "Lien valable une heure. Ce n'était pas toi ? Ignore ce message, rien ne change."
    },
    inactivityMail: {
      subject: "Ton compte Idlebound va être supprimé",
      preheader: (date: string) => `Connecte-toi avant le ${date} pour le garder.`,
      title: "Ton aventure t'attend",
      body: (username: string, date: string) =>
        `${username}, tu n'as pas joué depuis près de 3 ans. Sans connexion avant le ${date}, ton compte, ta sauvegarde et ta place au classement seront supprimés.`,
      button: "Me connecter",
      note: "Tu ne veux plus jouer ? Tu n'as rien à faire, tout sera effacé automatiquement."
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
    emailUnverified: "Confirm your e-mail address to keep saving your game.",
    verifyLinkInvalid: "This confirmation link has expired or is no longer valid. Request a new e-mail from the game.",
    alreadyVerified: "Your e-mail address is already confirmed.",
    emailLocked: "Your e-mail address is confirmed: it can no longer be changed here.",
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
    mail: {
      fallback: "Button not working? Paste this link into your browser:",
      footer: "You are receiving this e-mail because an Idlebound account uses this address."
    },
    verifyMail: {
      subject: "Confirm your e-mail address",
      preheader: "One click to keep your game saved.",
      title: "Confirm your e-mail",
      body: (username: string) => `Welcome, ${username}! Confirm your address to keep your game saved and be able to recover your account.`,
      button: "Confirm my e-mail",
      note: `This link is valid for ${VERIFY_LINK_DAYS} days. Didn't create an account? Just ignore this message.`
    },
    resetMail: {
      subject: "Your link to change your password",
      preheader: "Valid for one hour.",
      title: "New password",
      body: (username: string) => `${username}, here is your link to choose a new password.`,
      button: "Change my password",
      note: "This link is valid for one hour. Wasn't you? Ignore this message, nothing changes."
    },
    inactivityMail: {
      subject: "Your Idlebound account is about to be deleted",
      preheader: (date: string) => `Sign in before ${date} to keep it.`,
      title: "Your adventure awaits",
      body: (username: string, date: string) =>
        `${username}, you haven't played in almost 3 years. Unless you sign in before ${date}, your account, your save and your leaderboard entry will be deleted.`,
      button: "Sign in",
      note: "Don't want to play anymore? Nothing to do, everything will be erased automatically."
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
