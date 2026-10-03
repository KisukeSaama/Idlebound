import type { ApiError, PasswordIssue } from "@idlebound/game";
import { defineMessages } from "../define";

/** Errors whose words need the answer's details; every other code is a plain string. */
interface Worded {
  "too_many_attempts": (seconds: number) => string;
  "invalid_save": (detail: string) => string;
}

type ApiTexts = { [K in ApiError]: K extends keyof Worded ? Worded[K] : string } & {
  /** Reasons of a weak-password error. Username reasons live in account.usernameIssues. */
  passwordIssues: Record<PasswordIssue, string>;
};

/** What the API's error codes say to the walker (see API_ERRORS in @idlebound/game). */
export const api = defineMessages<ApiTexts>({
  fr: {
    "request_too_large": "Envoi trop volumineux pour le serveur. Recharge la page, puis réessaie.",
    "request_refused": "Requête refusée.",
    "origin_refused": "Origine refusée.",
    "not_found": "Introuvable.",
    "internal_error": "Erreur interne. Réessaie dans un instant.",
    unreachable: "Serveur de jeu injoignable. Réessaie dans un instant.",
    "invalid_request": "Requête invalide.",
    "invalid_email": "Adresse e-mail invalide.",
    "too_many_attempts": (seconds) => `Trop de tentatives. Réessaie dans ${seconds} s.`,
    "login_required": "Connexion requise.",
    "invalid_username": "Ce pseudo n'est pas valable.",
    "weak_password": "Ce mot de passe est trop faible.",
    "username_taken": "Ce pseudo est déjà pris.",
    "email_taken": "Un compte existe déjà avec cet e-mail.",
    "username_or_email_taken": "Ce pseudo ou cet e-mail est déjà utilisé.",
    "wrong_credentials": "E-mail ou mot de passe incorrect.",
    "wrong_password": "Mot de passe incorrect.",
    "wrong_current_password": "Mot de passe actuel incorrect.",
    "account_not_found": "Compte introuvable.",
    "reset_link_invalid": "Ce lien a expiré ou a déjà été utilisé.",
    "verify_link_invalid": "Ce lien de confirmation a expiré ou n'est plus valable. Demande un nouvel e-mail depuis le jeu.",
    "already_verified": "Ton adresse e-mail est déjà confirmée.",
    "email_locked": "Ton adresse e-mail est confirmée : elle ne peut plus être modifiée ici.",
    "email_unverified": "Confirme ton adresse e-mail pour que le Grand Livre continue de garder ta partie.",
    "unknown_board": "Classement inconnu.",
    "invalid_save": (detail) => `Partie illisible : ${detail}`,
    "save_conflict": "Deux fils portent ton nom (ta partie a changé depuis un autre appareil).",
    "guest_save_conflict": "Deux fils pour un seul marcheur (ta partie a changé depuis une autre page).",
    "too_many_replacements": "Trop de parties remplacées. Réessaie plus tard.",
    "game_elsewhere": "Ta partie a été reprise sur un autre appareil ou dans une autre page.",
    "save_rejected": "Le Grand Livre ne peut pas écrire ce qui n'est pas arrivé (partie refusée par la vérification anti-triche).",
    passwordIssues: {
      "too-short": "Le mot de passe doit contenir au moins 8 caractères.",
      "too-long": "Le mot de passe est trop long (128 caractères maximum).",
      "too-common": "Ce mot de passe est trop courant.",
      "too-simple": "Ce mot de passe est trop simple.",
      "contains-identity": "Le mot de passe ne doit pas contenir ton pseudo ou ton e-mail."
    }
  },
  en: {
    "request_too_large": "Too much data for the server at once. Reload the page, then try again.",
    "request_refused": "Request refused.",
    "origin_refused": "Origin refused.",
    "not_found": "Not found.",
    "internal_error": "Internal error. Try again in a moment.",
    unreachable: "Game server unreachable. Try again in a moment.",
    "invalid_request": "Invalid request.",
    "invalid_email": "Invalid e-mail address.",
    "too_many_attempts": (seconds) => `Too many attempts. Try again in ${seconds} s.`,
    "login_required": "You need to be signed in.",
    "invalid_username": "This username is not valid.",
    "weak_password": "This password is too weak.",
    "username_taken": "This username is already taken.",
    "email_taken": "An account already exists with this e-mail.",
    "username_or_email_taken": "This username or e-mail is already in use.",
    "wrong_credentials": "Wrong e-mail or password.",
    "wrong_password": "Incorrect password.",
    "wrong_current_password": "Current password is incorrect.",
    "account_not_found": "Account not found.",
    "reset_link_invalid": "This link has expired or has already been used.",
    "verify_link_invalid": "This confirmation link has expired or is no longer valid. Request a new e-mail from the game.",
    "already_verified": "Your e-mail address is already confirmed.",
    "email_locked": "Your e-mail address is confirmed: it can no longer be changed here.",
    "email_unverified": "Confirm your e-mail address so the Ledger keeps holding your game.",
    "unknown_board": "Unknown leaderboard.",
    "invalid_save": (detail) => `Unreadable game: ${detail}`,
    "save_conflict": "Two threads carry your name (your game was changed from another device).",
    "guest_save_conflict": "Two threads for a single walker (your game was changed from another page).",
    "too_many_replacements": "Too many games replaced. Try again later.",
    "game_elsewhere": "Your game was picked up on another device or in another page.",
    "save_rejected": "The Ledger cannot write what did not happen (game rejected by the anti-cheat check).",
    passwordIssues: {
      "too-short": "Your password must be at least 8 characters long.",
      "too-long": "Your password is too long (128 characters max).",
      "too-common": "This password is too common.",
      "too-simple": "This password is too simple.",
      "contains-identity": "Your password must not contain your username or e-mail."
    }
  }
});
