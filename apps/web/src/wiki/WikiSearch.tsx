"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "@/i18n/client";
import type { Gate } from "./gates";
import { rank, type Rankable } from "./searchRank";
import { useSpoilers } from "./SpoilerMode";

export interface SearchItem extends Rankable {
  /** Where it lives: the topic's name. */
  context: string;
  href: string;
  /** An item that is itself a revelation is listed only when the mode shows it. */
  gate?: Gate;
}

const LIMIT = 8;

/**
 * Searches every page and entry of the wiki, as far as the reading mode reveals them. The
 * results float over the contents below (they never push them), and the arrows, Enter and
 * Escape drive them as a combobox.
 */
export function WikiSearch({ items }: { items: readonly SearchItem[] }) {
  const { t } = useI18n();
  const { open } = useSpoilers();
  const router = useRouter();
  const w = t.wiki.search;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const listId = `${id}-results`;

  const matches = query.trim() ? rank(items, query) : [];
  const shown = matches.filter((item) => open(item.gate));
  const hidden = matches.length - shown.length;
  const visible = shown.slice(0, LIMIT);
  const showing = expanded && query.trim().length > 0;

  // A click anywhere else folds the results away.
  useEffect(() => {
    if (!showing) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [showing]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (showing) setExpanded(false);
      else setQuery("");
      return;
    }
    if (!showing || visible.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + visible.length) % visible.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      setExpanded(false);
      router.push(visible[Math.min(active, visible.length - 1)].href);
    }
  };

  return (
    <div className="wiki-search" role="search" ref={root}>
      <label htmlFor={id} className="visually-hidden">{w.label}</label>
      <input
        id={id}
        type="search"
        className="input"
        placeholder={w.placeholder}
        value={query}
        autoComplete="off"
        role="combobox"
        aria-expanded={showing}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showing && visible.length > 0 ? `${listId}-${Math.min(active, visible.length - 1)}` : undefined}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setExpanded(true);
        }}
        onFocus={() => setExpanded(true)}
        onKeyDown={onKeyDown}
      />
      {/* Always mounted, so a screen reader hears the count each time it changes. */}
      <p className="visually-hidden" aria-live="polite">{showing ? (shown.length > 0 ? w.results(shown.length) : w.none) : ""}</p>
      {showing ? (
        <div className="wiki-search-results">
          {visible.length > 0 ? (
            <ul id={listId} role="listbox" aria-label={w.label}>
              {visible.map((item, index) => (
                <li key={item.href} id={`${listId}-${index}`} role="option" aria-selected={index === active}>
                  <Link href={item.href} tabIndex={-1} className={index === active ? "active" : ""} onMouseEnter={() => setActive(index)} onClick={() => setExpanded(false)}>
                    <strong>{item.title}</strong>
                    <span>{item.context}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId}>{w.none}</p>
          )}
          {shown.length > LIMIT || hidden > 0 ? (
            <p className="wiki-search-more">
              {shown.length > LIMIT ? w.more(shown.length - LIMIT) : null}
              {shown.length > LIMIT && hidden > 0 ? " " : null}
              {hidden > 0 ? w.hidden(hidden) : null}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
