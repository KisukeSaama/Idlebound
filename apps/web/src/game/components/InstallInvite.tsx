"use client";

import { useEffect, useId, useState } from "react";
import { useI18n } from "@/i18n/client";
import { useStoreRef } from "../context";

/** The browser's offer to install the game (Chromium browsers only; iOS has none). */
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/** The invitation waits for a real session: this long on the page, this much play in all. */
const AFTER_SESSION_MS = 3 * 60_000;
const AFTER_PLAY_SECONDS = 15 * 60;
const CHECK_EVERY_MS = 20_000;
/** Asked once per device, whatever the answer: kept in the browser, not in the game. */
const STORAGE_KEY = "idlebound:install";

/**
 * The browser offers the install once per page, possibly while the game is still loading:
 * the offer is caught as soon as this module loads, and kept for the invitation.
 */
let caught: InstallPrompt | null = null;
const listeners = new Set<(offer: InstallPrompt | null) => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // The browser's own banner would come at its own time: the invitation is ours.
    event.preventDefault();
    caught = event as InstallPrompt;
    for (const listener of listeners) listener(caught);
  });
  window.addEventListener("appinstalled", () => {
    remember("accepted");
    caught = null;
    for (const listener of listeners) listener(null);
  });
}

function answered(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function remember(answer: "accepted" | "dismissed") {
  try {
    localStorage.setItem(STORAGE_KEY, answer);
  } catch {
    // Storage refused: the invitation may come back on another visit.
  }
}

/**
 * Once a walker has really played on a touch device, one invitation to keep the game on the
 * home screen, where it opens as an app. Shown only when the browser offers the install, never
 * over a window, and never again once answered.
 */
export function InstallInvite({ covered }: { covered: boolean }) {
  const store = useStoreRef();
  const { t } = useI18n();
  const m = t.hud.install;
  const titleId = useId();
  const [offer, setOffer] = useState<InstallPrompt | null>(null);
  const [due, setDue] = useState(false);

  useEffect(() => {
    if (answered() || window.matchMedia("(display-mode: standalone)").matches || !window.matchMedia("(pointer: coarse)").matches) return;
    setOffer(caught);
    listeners.add(setOffer);
    const since = performance.now();
    const check = setInterval(() => {
      if (performance.now() - since < AFTER_SESSION_MS || store.state.lifetime.playTime < AFTER_PLAY_SECONDS) return;
      setDue(true);
      clearInterval(check);
    }, CHECK_EVERY_MS);
    return () => {
      clearInterval(check);
      listeners.delete(setOffer);
    };
  }, [store]);

  if (!offer || !due || covered) return null;

  const install = async () => {
    caught = null;
    setOffer(null);
    await offer.prompt();
    remember((await offer.userChoice).outcome);
  };
  const decline = () => {
    remember("dismissed");
    caught = null;
    setOffer(null);
  };

  return (
    <aside className="install-invite" aria-labelledby={titleId}>
      <img src="/icon-192.png" alt="" width={48} height={48} />
      <div className="install-copy">
        <strong id={titleId}>{m.title}</strong>
        <p>{m.text}</p>
      </div>
      <div className="install-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={decline}>{m.decline}</button>
        <button type="button" className="btn btn-gold btn-sm" onClick={() => void install()}>{m.install}</button>
      </div>
    </aside>
  );
}
