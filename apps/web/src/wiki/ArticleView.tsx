import type { Locale } from "@idlebound/game";
import type { ReactNode } from "react";
import type { Article, Block } from "./article";
import { Rich } from "./Rich";

interface Props {
  article: Article;
  locale: Locale;
  /** What the page draws in place of each `{ slot }` block. */
  slots?: Record<string, ReactNode>;
  /** Labels of the asides. */
  labels: { tip: string; warn: string };
}

function BlockView({ block, locale, slots, labels }: { block: Block; locale: Locale; slots: Record<string, ReactNode>; labels: Props["labels"] }) {
  if (typeof block === "string") return <p><Rich text={block} locale={locale} /></p>;
  if ("list" in block) return <ul>{block.list.map((item) => <li key={item}><Rich text={item} locale={locale} /></li>)}</ul>;
  if ("steps" in block) return <ol className="wiki-steps">{block.steps.map((item) => <li key={item}><Rich text={item} locale={locale} /></li>)}</ol>;
  if ("tip" in block) return <aside className="wiki-aside wiki-tip"><strong>{labels.tip}</strong><p><Rich text={block.tip} locale={locale} /></p></aside>;
  if ("warn" in block) return <aside className="wiki-aside wiki-warn"><strong>{labels.warn}</strong><p><Rich text={block.warn} locale={locale} /></p></aside>;
  return <>{slots[block.slot] ?? null}</>;
}

/** An article's sections, each under its anchored heading. */
export function ArticleView({ article, locale, slots = {}, labels }: Props) {
  return (
    <>
      {article.sections.map((section) => {
        const body = section.blocks.map((block, index) => <BlockView key={index} block={block} locale={locale} slots={slots} labels={labels} />);
        return (
          <section key={section.id} id={section.id} className="wiki-section" aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {body}
          </section>
        );
      })}
    </>
  );
}
