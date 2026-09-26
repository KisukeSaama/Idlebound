import type { Locale } from "@idlebound/game";
import { account } from "./account";
import { common } from "./common";
import { hud } from "./hud";
import { landing } from "./landing";
import { leaderboard } from "./leaderboard";
import { privacy } from "./privacy";
import { reset } from "./reset";
import { site } from "./site";
import { windows } from "./windows";

const NAMESPACES = { common, site, landing, leaderboard, privacy, reset, hud, windows, account };

type Namespaces = typeof NAMESPACES;
export type Messages = { [K in keyof Namespaces]: Namespaces[K]["fr"] };

function build(locale: Locale): Messages {
  return Object.fromEntries(Object.entries(NAMESPACES).map(([key, value]) => [key, value[locale]])) as Messages;
}

const MESSAGES: Record<Locale, Messages> = { fr: build("fr"), en: build("en") };

/** Every UI string of the web app for a locale, grouped by namespace. */
export function messages(locale: Locale): Messages {
  return MESSAGES[locale];
}
