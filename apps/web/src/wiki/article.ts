/**
 * The shape of a wiki article, as `i18n/messages/wiki*.ts` writes it. Text runs carry a tiny
 * markup: `**bold**` and `[label](topic/entry)`, a link inside the wiki.
 */
export type Block =
  /** A paragraph. */
  | string
  | { list: readonly string[] }
  /** Numbered steps, for a walkthrough. */
  | { steps: readonly string[] }
  /** Advice worth remembering, set apart. */
  | { tip: string }
  /** A trap to avoid. */
  | { warn: string }
  /** Where the page puts a table or a picture of its own (built from the game data). */
  | { slot: string };

export interface Section {
  /** Anchor of the section (`#crits`), English, stable. */
  id: string;
  title: string;
  blocks: readonly Block[];
}

export interface Article {
  /** One or two sentences under the title: what the page covers. */
  lead: string;
  sections: readonly Section[];
}
