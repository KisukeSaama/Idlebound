"use client";

import { useLayoutEffect } from "react";
import type { Gate } from "./gates";
import { useSpoilers } from "./SpoilerMode";

/**
 * The browser title of a page that is itself a revelation. The server names it plainly
 * (veiled), so the tab never spoils it before the reading mode is known; once its gate opens,
 * the tab shows its name, and goes back to plain if the walker veils it again. Head updates
 * stream in after the page, so the title is held until the page is left.
 */
export function GatedTitle({ gate, veiled, named }: { gate: Gate; veiled: string; named: string }) {
  const { open } = useSpoilers();
  const title = open(gate) ? named : veiled;

  // A layout effect: its cleanup runs within the commit that leaves the page, before the next
  // page's title lands, so the observer never writes over it.
  useLayoutEffect(() => {
    const hold = () => {
      if (document.title !== title) document.title = title;
    };
    hold();
    const observer = new MutationObserver(hold);
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);

  return null;
}
