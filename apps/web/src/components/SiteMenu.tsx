"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export interface SiteMenuLink {
  href: string;
  label: string;
}

/**
 * The public pages' links on a phone, where the nav has no room for them: a square button
 * beside "Play" drops them in a panel under the nav. Escape, a tap outside or following a
 * link folds it away.
 */
export function SiteMenu({ links, labels }: { links: SiteMenuLink[]; labels: { open: string; close: string } }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const label = open ? labels.close : labels.open;
  return (
    <div ref={root} className="site-menu" data-open={open || undefined}>
      <button ref={button} type="button" className="site-menu-toggle" aria-expanded={open} aria-controls={panelId} aria-label={label} title={label} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d={open ? "M3 3l10 10M13 3L3 13" : "M2 4h12M2 8h12M2 12h12"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </button>
      <ul id={panelId} className="site-menu-panel" hidden={!open}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
