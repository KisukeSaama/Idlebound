import { LOCALE_COOKIE, resolveLocale, type Locale } from "@idlebound/game";
import type { Context } from "hono";
import { VERIFY_LINK_DAYS } from "./verification";
import { getCookie } from "hono/cookie";

/**
 * The e-mails the API sends, in both locales: the only text it writes. Errors are codes
 * (`ApiError`), worded by the web client. The French object defines the shape; the English
 * one must match it.
 */
function define<T>(messages: { fr: T; en: NoInfer<T> }): Record<Locale, T> {
  return messages;
}

const MESSAGES = define({
  fr: {
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

export type MailMessages = (typeof MESSAGES)["fr"];

/** Locale of the request: explicit choice (cookie) first, then Accept-Language. */
export function localeOf(c: Context): Locale {
  return resolveLocale(getCookie(c, LOCALE_COOKIE), c.req.header("accept-language"));
}

export function messagesFor(locale: Locale): MailMessages {
  return MESSAGES[locale];
}
