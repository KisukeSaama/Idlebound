import { GUEST_SAVE_DAYS } from "@idlebound/game";
import { defineMessages } from "../define";

/**
 * Privacy page (/[locale]/privacy). Sections are rendered in order; `items` become a list
 * whose `label` is bold. `accountMenu`/`deleteAction`/`newGameAction` are emphasized in the
 * last section.
 */
export const privacy = defineMessages({
  fr: {
    metaTitle: "Confidentialité",
    metaDescription: "Quelles données Idlebound conserve, pourquoi, et comment les supprimer.",
    title: "Confidentialité",
    intro: "Idlebound collecte le strict minimum pour faire fonctionner le jeu. Aucune publicité, aucun traceur tiers, aucune revente de données.",
    guestTitle: "Sans compte",
    guestText:
      "Tu peux jouer sans compte. Ta partie est alors conservée sur nos serveurs, rattachée à un cookie anonyme de ton navigateur : ni e-mail, ni pseudo, rien qui dise qui tu es. Elle n'apparaît pas au classement. Si tu crées un compte ou te connectes, c'est toi qui choisis si elle devient la partie du compte.",
    accountTitle: "Avec un compte",
    accountItems: [
      { label: "Adresse e-mail", text: " : pour te connecter, confirmer ton compte et réinitialiser ton mot de passe. Jamais affichée ni partagée." },
      { label: "Pseudo", text: " : affiché publiquement dans le classement." },
      { label: "Mot de passe", text: " : stocké uniquement sous forme d'empreinte (scrypt). Personne ne peut le lire." },
      { label: "Progression de jeu", text: " : ta progression, pour la retrouver sur tous tes appareils." }
    ],
    cookiesTitle: "Cookies",
    cookiesText:
      `Trois cookies au plus, tous strictement nécessaires : le cookie de session qui te garde connecté (30 jours), le cookie anonyme qui retrouve ta partie quand tu joues sans compte (${GUEST_SAVE_DAYS} jours, renouvelé à chaque visite, retiré dès qu'un compte reprend la partie) et, seulement si tu choisis une langue dans les paramètres, le cookie qui la retient (1 an). Pas de cookie de mesure d'audience.`,
    securityTitle: "Sécurité",
    securityText:
      "Les échanges sont chiffrés (HTTPS), les tentatives de connexion sont limitées et changer de mot de passe révoque toutes les sessions. Les adresses IP ne servent qu'à limiter les abus et ne sont pas conservées.",
    retentionTitle: "Durée de conservation",
    retentionText:
      `Tes données sont conservées tant que tu utilises ton compte. Un compte sans aucune connexion ni partie pendant 3 ans est supprimé automatiquement, avec sa partie et sa place au classement. Un e-mail d'avertissement t'est envoyé 30 jours avant la suppression : il suffit de te reconnecter pour garder ton compte. Un compte dont l'adresse e-mail n'a jamais été confirmée est supprimé 30 jours après sa création. Une partie jouée sans compte est supprimée après ${GUEST_SAVE_DAYS} jours sans visite.`,
    rightsTitle: "Tes droits",
    rightsLead: "Tu peux supprimer définitivement ton compte et toutes ses données à tout moment depuis le jeu : menu ",
    accountMenu: "Compte & progression",
    rightsMiddle: ", puis ",
    deleteAction: "Supprimer mon compte",
    rightsEnd: ".",
    guestRightsLead: "Sans compte, le même menu propose ",
    newGameAction: "Nouvelle partie",
    guestRightsEnd: ` : la partie conservée est remplacée par une partie vierge. Effacer les cookies du site t'en sépare pour de bon, et elle est supprimée au bout de ${GUEST_SAVE_DAYS} jours.`
  },
  en: {
    metaTitle: "Privacy",
    metaDescription: "What data Idlebound keeps, why, and how to delete it.",
    title: "Privacy",
    intro: "Idlebound collects the bare minimum needed to run the game. No ads, no third-party trackers, no selling of data.",
    guestTitle: "Without an account",
    guestText:
      "You can play without an account. Your game is then kept on our servers, tied to an anonymous cookie in your browser: no email, no username, nothing that says who you are. It does not appear on the leaderboard. If you create an account or sign in, you choose whether it becomes the account's game.",
    accountTitle: "With an account",
    accountItems: [
      { label: "Email address", text: ": to sign in, confirm your account and reset your password. Never displayed or shared." },
      { label: "Username", text: ": shown publicly on the leaderboard." },
      { label: "Password", text: ": stored only as a hash (scrypt). Nobody can read it." },
      { label: "Game progress", text: ": your progress, so you can pick it up on all your devices." }
    ],
    cookiesTitle: "Cookies",
    cookiesText:
      `Three cookies at most, all strictly necessary: the session cookie that keeps you signed in (30 days), the anonymous cookie that finds your game when you play without an account (${GUEST_SAVE_DAYS} days, renewed on every visit, removed as soon as an account takes the game over) and, only if you pick a language in the settings, the cookie that remembers it (1 year). No analytics cookies.`,
    securityTitle: "Security",
    securityText:
      "Traffic is encrypted (HTTPS), sign-in attempts are rate limited and changing your password revokes every session. IP addresses are only used to limit abuse and are not stored.",
    retentionTitle: "Retention",
    retentionText:
      `Your data is kept as long as you use your account. An account with no sign-in and no play for 3 years is deleted automatically, along with its game and its leaderboard entry. A warning email is sent to you 30 days before the deletion: just sign in again to keep your account. An account whose email address was never confirmed is deleted 30 days after it was created. A game played without an account is deleted after ${GUEST_SAVE_DAYS} days without a visit.`,
    rightsTitle: "Your rights",
    rightsLead: "You can permanently delete your account and all its data at any time from the game: open ",
    accountMenu: "Account & progress",
    rightsMiddle: ", then ",
    deleteAction: "Delete my account",
    rightsEnd: ".",
    guestRightsLead: "Without an account, the same menu offers ",
    newGameAction: "New game",
    guestRightsEnd: `: the kept game is replaced by a blank one. Clearing the site's cookies parts you from it for good, and it is deleted after ${GUEST_SAVE_DAYS} days.`
  }
});
