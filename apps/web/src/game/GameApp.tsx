"use client";

import { ACHIEVEMENT_BY_ID, RARITY_INFO, SKILLS, SKILL_BY_ID, achievementText, biomeName, createInitialState, eraLabel, formatNumber, gameText, isSkillUnlocked, itemName, type GameEvent } from "@idlebound/game";
import { currentLocale, currentMessages, useI18n } from "@/i18n/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audio } from "./audio";
import { CloudSync } from "./cloud";
import { GameContext, type GameUi, type ToastInput, type WindowId } from "./context";
import { SKILL_PICTO } from "./icons";
import { GameStore } from "./store";
import { CloudChoiceModal } from "./components/CloudChoiceModal";
import { ConfirmDialog, type ConfirmRequest } from "./components/ConfirmDialog";
import { GameHeader } from "./components/GameHeader";
import { HeroPanel } from "./components/HeroPanel";
import { NavRail } from "./components/NavRail";
import { OfflineModal } from "./components/OfflineModal";
import { Scene } from "./components/Scene";
import { Toasts, type Toast } from "./components/Toasts";
import { WindowHost } from "./windows/WindowHost";
import "./game.css";

/** A guest who really played is warned before losing their game by leaving. */
const GUEST_WARNING_SECONDS = 120;

export default function GameApp() {
  const store = useMemo(() => new GameStore(createInitialState()), []);
  const cloud = useMemo(() => new CloudSync(store), [store]);
  const [openWindow, setOpenWindow] = useState<{ id: WindowId; tab?: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [mobileTab, setMobileTab] = useState<"heroes" | "scene">("heroes");
  const [ready, setReady] = useState(false);
  const toastId = useRef(0);
  const { t } = useI18n();

  const toast = useCallback((input: ToastInput) => {
    toastId.current += 1;
    const entry: Toast = { ...input, id: toastId.current };
    setToasts((current) => [...current.slice(-4), entry]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== entry.id)), input.tone === "danger" ? 4500 : 3800);
  }, []);

  const ui = useMemo<GameUi>(() => ({
    openWindow: (id, tab) => setOpenWindow({ id, tab }),
    closeWindow: () => setOpenWindow(null),
    toast,
    confirm: (options) => new Promise<boolean>((resolve) => setConfirmRequest({ ...options, resolve }))
  }), [toast]);

  // Load the game from the server, then start the loop. No local save: progress only
  // exists on the server (and only with an account).
  useEffect(() => {
    // Dev tool: window.__idlebound.act((engine) => …) from the console.
    if (process.env.NODE_ENV !== "production") (window as unknown as { __idlebound?: GameStore }).__idlebound = store;
    let cancelled = false;
    void cloud.init().finally(() => {
      if (cancelled) return;
      store.start();
      setReady(true);
    });
    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      store.setVisible(visible);
      if (!visible) void cloud.sync({ keepalive: true });
    };
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!cloud.user && store.state.lifetime.playTime > GUEST_WARNING_SECONDS) event.preventDefault();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      cancelled = true;
      store.stop();
      cloud.dispose();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [store, cloud]);

  // Audio settings.
  useEffect(() => {
    const sync = () => {
      audio.enabled = store.state.settings.sound;
      audio.setVolume(store.state.settings.volume);
      document.documentElement.classList.toggle("reduced-motion", store.state.settings.reducedMotion);
    };
    sync();
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    const unsubscribe = store.subscribe(sync);
    return () => {
      unsubscribe();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [store]);

  // Engine events → sounds and toasts. The locale is read at event time (it can change
  // while the game runs), hence currentLocale() rather than a captured value.
  useEffect(() => {
    return store.onFx((event: GameEvent) => {
      const locale = currentLocale();
      const m = currentMessages().hud.toasts;
      const g = gameText(locale);
      const fmt = (value: number) => formatNumber(value, store.state.settings.notation);
      switch (event.type) {
        case "hit":
          audio.play(event.crit ? "crit" : "hit");
          break;
        case "kill":
          audio.play(event.monster.kind === "boss" || event.monster.kind === "miniboss" ? "kill" : "coin");
          break;
        case "spawn":
          if (event.monster.kind === "boss") audio.play("boss");
          break;
        case "bossFailed":
          audio.play("fail");
          toast({ tone: "danger", icon: "hourglass", title: m.bossFailedTitle, text: m.bossFailedText });
          break;
        case "stage":
          if (event.biomeChanged) {
            toast({ tone: "violet", icon: "map", title: biomeName(event.stage, locale), text: m.biome(eraLabel(event.stage, locale), event.stage) });
          }
          break;
        case "achievement": {
          const achievement = ACHIEVEMENT_BY_ID[event.id];
          const text = achievementText(event.id, locale);
          audio.play("achievement");
          toast({ tone: "gold", icon: "trophy", title: m.achievement(text.name), text: m.achievementText(text.description, Math.round((achievement?.bonus ?? 0) * 100)) });
          break;
        }
        case "loot":
          audio.play("loot");
          toast({ tone: "loot", icon: "chest", title: itemName(event.item, locale), text: m.loot(g.rarities[event.item.rarity], event.item.level), color: RARITY_INFO[event.item.rarity].color });
          break;
        case "skillUnlocked": {
          const skill = SKILL_BY_ID[event.skillId];
          const text = g.skills[event.skillId];
          toast({ tone: "violet", icon: SKILL_PICTO[skill.id], title: m.skillUnlocked(text.name), text: m.skillUnlockedText(skill.hotkey, text.description) });
          break;
        }
        case "skill":
          audio.play("skill");
          break;
        case "heroBought":
          audio.play("buy");
          break;
        case "upgradeBought":
          audio.play("buy");
          break;
        case "crystal":
          audio.play("crystal");
          toast({ tone: "violet", icon: "gem", title: m.crystalTitle, text: event.reward === "gold" ? m.crystal.gold(fmt(event.amount)) : m.crystal[event.reward](event.amount) });
          break;
        case "ascended":
          audio.play("ascend");
          toast({ tone: "gold", icon: "sparkle", title: m.ascendedTitle, text: m.ascendedText(fmt(event.essences)) });
          break;
        case "inventoryFull":
          toast({ tone: "info", title: m.inventoryFull(itemName(event.item, locale), event.shards) });
          break;
        case "hourglass":
          toast({ tone: "success", title: m.hourglass(fmt(event.kills)) });
          break;
      }
    });
  }, [store, toast]);

  // Keyboard shortcuts: 1-6 for powers, Escape to close.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
      if (event.key === "Escape") {
        setOpenWindow(null);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const skill = SKILLS.find((entry) => entry.hotkey === event.key);
      if (skill && isSkillUnlocked(store.state, skill.id)) {
        const used = store.act((engine, now) => engine.useSkill(skill.id, now));
        if (!used) audio.play("error");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  const context = useMemo(() => ({ store, cloud, ui }), [store, cloud, ui]);

  if (!ready) {
    return (
      <div className="game-loading" role="status">
        <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
        <div className="game-loading-bar" aria-hidden="true"><span /></div>
        <p>{t.hud.loadingSave}</p>
      </div>
    );
  }

  return (
    <GameContext.Provider value={context}>
      <div className="game-root">
        <GameHeader />
        <div className="game-body" data-mobile-tab={mobileTab}>
          <NavRail active={openWindow?.id ?? null} />
          <main className="game-main">
            <Scene />
          </main>
          <HeroPanel />
        </div>
        <nav className="mobile-tabs" aria-label={t.hud.mobileTabs.label}>
          <button type="button" className={mobileTab === "heroes" ? "active" : ""} onClick={() => setMobileTab("heroes")}>{t.hud.mobileTabs.heroes}</button>
          <button type="button" className={mobileTab === "scene" ? "active" : ""} onClick={() => setMobileTab("scene")}>{t.hud.mobileTabs.scene}</button>
        </nav>
        {openWindow ? <WindowHost id={openWindow.id} tab={openWindow.tab} onClose={() => setOpenWindow(null)} /> : null}
        <OfflineModal />
        <CloudChoiceModal />
        {confirmRequest ? <ConfirmDialog request={confirmRequest} onDone={() => setConfirmRequest(null)} /> : null}
        <Toasts toasts={toasts} />
      </div>
    </GameContext.Provider>
  );
}
