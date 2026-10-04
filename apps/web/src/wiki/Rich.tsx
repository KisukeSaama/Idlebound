import type { Locale } from "@idlebound/game";
import Link from "next/link";
import type { ReactNode } from "react";
import { wikiHref } from "@/i18n/routing";

/** `**bold**` or `[label](topic/entry#anchor)`. */
const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\(([a-z0-9/#-]*)\)/g;

/** Where a wiki link points: `topic`, `topic/entry`, `topic#anchor` or `#anchor` on the same page. */
export function wikiLink(locale: Locale, target: string): string {
  const [path, anchor] = target.split("#");
  const [topic, entry] = path.split("/");
  const base = topic ? wikiHref(locale, topic, entry) : "";
  return anchor ? `${base}#${anchor}` : base;
}

/** A run of article text with its markup rendered: bold words and links inside the wiki. */
export function Rich({ text, locale }: { text: string; locale: Locale }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    if (match[1] !== undefined) parts.push(<strong key={index}>{match[1]}</strong>);
    else parts.push(<Link key={index} href={wikiLink(locale, match[3])}>{match[2]}</Link>);
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
