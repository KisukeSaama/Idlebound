"use client";

import {
  ACHIEVEMENT_BY_ID,
  BESTIARY_BY_ID,
  BIOMES,
  RARITY_INFO,
  SKILLS,
  SKILL_BY_ID,
  WALKER_MIN_ASCENSIONS,
  WALKER_SECONDS,
  WANDERER_BY_ID,
  achievementText,
  bestiaryKills,
  biomeName,
  chronicleText,
  createInitialState,
  formatDuration,
  formatNumber,
  gameText,
  hireLine,
  isSkillUnlocked,
  itemName,
  kingWord,
  recognitionTier,
  regaliaWord,
  wearsRegalia,
  type ChronicleEntry,
  type GameEvent
} from "@idlebound/game";
import { currentLocale, currentMessages, useI18n } from "@/i18n/client";
import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audio } from "./audio";
import { CloudSync } from "./cloud";
import { GameContext, revealsOf, type GameUi, type ToastInput, type WindowId } from "./context";
import { SKILL_PICTO, type PictoName } from "./icons";
import { ANNOUNCED, revealMark, stratumLabel, type RevealId } from "./shell";
import { GameStore } from "./store";
import { CloudChoiceModal } from "./components/CloudChoiceModal";
import { ConfirmDialog, type ConfirmRequest } from "./components/ConfirmDialog";
import { GameHeader } from "./components/GameHeader";
import { HeroPanel } from "./components/HeroPanel";
import { NavRail } from "./components/NavRail";
import { Scene } from "./components/Scene";
import { Toasts, type Toast } from "./components/Toasts";
import { WindowHost } from "./windows/WindowHost";
import "./game.css";

/** A guest who really played is warned before losing their game by leaving. */
const GUEST_WARNING_SECONDS = 120;
/** Never more than one fragment toast a minute (BIBLE 17.4): the others wait in the Chronicle. */
const FRAGMENT_TOAST_GAP_MS = 60_000;
/**
 * Chronicle sources that already have their own toast (memories, relic legends, secrets,
 * the King's Word, what stays after an absence, the sayings read at the stall).
 */
const OWN_TOAST: ReadonlySet<ChronicleEntry["source"]> = new Set(["memory", "relic", "secret", "crown", "king", "dream", "saying"]);
/** Events told by their own window rather than a toast (the Caravan is bought at the stall). */
const QUIET_EVENTS: ReadonlySet<string> = new Set(["caravan"]);
/** How long a newly earned element of the shell glows. */
const FRESH_MS = 4_000;
/** Remembrance Nights are checked against the walker's own calendar this often. */
const REMEMBER_EVERY_MS = 60_000;
/** Icon of each announced element's first-appearance toast. */
const REVEAL_PICTO: Partial<Record<RevealId, PictoName>> = {
  map: "map",
  gear: "helmet",
  market: "stall",
  ascension: "gem",
  hall: "trophy",
  loom: "unweave",
  caravan: "stall"
};
/** Creatures whose new Bestiary lines are worth a toast: the great ones and the wanderers. */
const HERALDED = new Set([...BIOMES.flatMap((biome) => [biome.boss.id, biome.miniBoss.id]), ...Object.keys(WANDERER_BY_ID)]);

export default function GameApp() {
  const store = useMemo(() => new GameStore(createInitialState()), []);
  const cloud = useMemo(() => new CloudSync(store), [store]);
  const [openWindow, setOpenWindow] = useState<{ id: WindowId; tab?: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [mobileTab, setMobileTab] = useState<"heroes" | "scene">("heroes");
  const [ready, setReady] = useState(false);
  const toastId = useRef(0);
  const fresh = useMemo(() => new Set<RevealId>(), []);
  /** Names of the Roll, fetched once, for the Echo of a Walker. */
  const roll = useRef<Promise<string[]> | null>(null);
  const { t, locale } = useI18n();

  /** While a window or a dialog is open, toasts wait (they would cover it) and come after. */
  const holding = useRef(false);
  const waiting = useRef<Toast[]>([]);
  const show = useCallback((entry: Toast) => {
    setToasts((current) => [...current.slice(-4), entry]);
    const duration = entry.quote ? 8000 : entry.tone === "danger" ? 4500 : 3800;
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== entry.id)), duration);
  }, []);
  const toast = useCallback((input: ToastInput) => {
    toastId.current += 1;
    const entry: Toast = { ...input, id: toastId.current };
    if (holding.current) waiting.current = [...waiting.current.slice(-4), entry];
    else show(entry);
  }, [show]);

  const covered = openWindow !== null || confirmRequest !== null;
  useEffect(() => {
    holding.current = covered;
    if (covered) return;
    const queued = waiting.current;
    waiting.current = [];
    for (const entry of queued) show(entry);
  }, [covered, show]);

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
      audio.setHidden(!visible);
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

  // The engine reads in the walker's language (Two Tongues).
  useEffect(() => store.setLocale(locale), [store, locale]);

  const loadRoll = useCallback(() => {
    roll.current ??= api.leaderboard("stage").then((result) => (result.ok ? result.data.rows.map((row) => row.username) : []), () => []);
    return roll.current;
  }, []);

  // Once the game runs: Remembrance Nights by the walker's own calendar, and the Roll
  // fetched ahead for the walkers who may meet an echo.
  useEffect(() => {
    if (!ready) return;
    const remember = () => store.apply((engine, now) => engine.remember(now));
    remember();
    const timer = setInterval(remember, REMEMBER_EVERY_MS);
    if (store.state.lifetime.ascensions >= WALKER_MIN_ASCENSIONS) void loadRoll();
    return () => clearInterval(timer);
  }, [ready, store, loadRoll]);

  // The progressive interface: an element that appears during play glows for a moment, and
  // the menus get a toast, once for every device (the mark lives in the save). A load (a
  // new engine) only takes note of what is already there.
  useEffect(() => {
    if (!ready) return;
    let engine = store.engine;
    let known = revealsOf(store);
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const check = () => {
      const shown = revealsOf(store);
      if (store.engine !== engine) {
        engine = store.engine;
        known = shown;
        return;
      }
      for (const id of Object.keys(shown) as RevealId[]) {
        if (!shown[id] || known[id]) continue;
        fresh.add(id);
        const timer = setTimeout(() => {
          timers.delete(timer);
          fresh.delete(id);
        }, FRESH_MS);
        timers.add(timer);
        const mark = revealMark(id);
        if (!ANNOUNCED.includes(id) || store.state.tutorial.done.includes(mark)) continue;
        const m = currentMessages();
        const g = gameText(currentLocale());
        const place = id as keyof typeof m.night.reveal;
        const title = place === "loom" ? g.places.loom.name : place === "caravan" ? g.events.caravan.name : m.hud.windowTitles[place].label;
        toast({ tone: "info", icon: REVEAL_PICTO[id], title, text: m.night.reveal[place] });
        store.apply((current) => current.completeTutorial(mark));
      }
      known = shown;
    };
    const unsubscribe = store.subscribe(check);
    return () => {
      unsubscribe();
      for (const timer of timers) clearTimeout(timer);
    };
  }, [ready, store, toast, fresh]);

  // Audio settings.
  useEffect(() => {
    const sync = () => {
      audio.setEnabled(store.state.settings.sound);
      audio.setVolume(store.state.settings.volume);
      document.documentElement.classList.toggle("reduced-motion", store.state.settings.reducedMotion);
    };
    sync();
    // Any input also tells the engine the player is here (the autopilot waits for them to leave),
    // and wakes the sound when it is on.
    const onInput = () => {
      audio.unlock();
      store.markInput();
    };
    window.addEventListener("pointerdown", onInput);
    window.addEventListener("keydown", onInput);
    const unsubscribe = store.subscribe(sync);
    return () => {
      unsubscribe();
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, [store]);

  // Engine events → sounds and toasts. The locale is read at event time (it can change
  // while the game runs), hence currentLocale() rather than a captured value.
  useEffect(() => {
    let lastFragmentAt = -Infinity;
    /** The King's Word of the dusk being walked, carried by the ascension's toast. */
    let pendingWord: number | null = null;
    /** Remembrance Night is told once a day, however often the calendar is read. */
    let rememberedOn = "";
    return store.onFx((event: GameEvent) => {
      const locale = currentLocale();
      const m = currentMessages().hud.toasts;
      const n = currentMessages().night;
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
          // The Quiet: every other sound drops for a while.
          if (event.monster.event === "quiet") audio.play("quiet");
          if (event.monster.kind === "rare") toast({ tone: "violet", icon: "sparkle", title: m.wandererTitle(g.monsters[event.monster.id] ?? event.monster.id) });
          break;
        case "bossFailed":
          audio.play("fail");
          {
            // A guardian of the present night keeps its wounds: say how far down it stays.
            const wound = store.state.trail.wound;
            const text = wound && wound.stage === event.stage && wound.share > 0 ? m.bossFailedWounded(Math.round(wound.share * 100)) : m.bossFailedText;
            toast({ tone: "danger", icon: "hourglass", title: m.bossFailedTitle, text });
          }
          break;
        case "stage":
          if (event.biomeChanged) {
            toast({ tone: "violet", icon: "map", title: biomeName(event.stage, locale), text: m.biome(stratumLabel(event.stage, locale), event.stage) });
          }
          break;
        case "achievement": {
          const achievement = ACHIEVEMENT_BY_ID[event.id];
          const text = achievementText(event.id, locale);
          audio.play("achievement");
          const bonus = Math.round((achievement?.bonus ?? 0) * 100);
          toast({ tone: "gold", icon: "trophy", title: m.achievement(text.name), text: bonus > 0 ? m.achievementText(text.description, bonus) : text.description });
          break;
        }
        case "loot": {
          audio.play("loot");
          const legend = event.item.named ? g.relics[event.item.named]?.legend : undefined;
          toast({
            tone: "loot",
            icon: "chest",
            title: legend ? m.namedTitle(itemName(event.item, locale)) : itemName(event.item, locale),
            text: legend ?? m.loot(g.rarities[event.item.rarity], event.item.level),
            color: RARITY_INFO[event.item.rarity].color
          });
          break;
        }
        case "skillUnlocked": {
          const skill = SKILL_BY_ID[event.skillId];
          const text = g.skills[event.skillId];
          toast({ tone: "violet", icon: SKILL_PICTO[skill.id], title: m.skillUnlocked(text.name), text: m.skillUnlockedText(skill.hotkey, text.description) });
          break;
        }
        case "skill":
          audio.play("skill");
          break;
        case "heroBought": {
          audio.play("buy");
          // A companion met again this night says so, by how well they remember the walker.
          const line = event.firstTime ? hireLine(event.heroId, recognitionTier(store.state, event.heroId), locale) : null;
          if (line) toast({ tone: "info", title: g.heroes[event.heroId].name, text: line });
          break;
        }
        case "upgradeBought":
          audio.play("buy");
          break;
        case "crystal":
          audio.play("crystal");
          toast({ tone: "violet", icon: "gem", title: m.crystalTitle, text: event.reward === "gold" ? m.crystal.gold(fmt(event.amount)) : m.crystal[event.reward](event.amount) });
          break;
        case "kingWord":
          audio.play("kingWord");
          pendingWord = event.night;
          break;
        case "ascended": {
          audio.play("ascend");
          // The confirmation carries the King's Word; in his Regalia, he knows the walker.
          const night = pendingWord;
          pendingWord = null;
          const word = night === null ? "" : wearsRegalia(store.state) ? regaliaWord(store.state.lore.regalia, locale) : kingWord(night, locale);
          toast({ tone: "gold", icon: "crown", title: m.ascendedTitle, text: m.ascendedText(fmt(event.essences)), quote: word ? { by: g.speakers.king, text: word } : undefined });
          break;
        }
        case "descended":
          audio.play("descent");
          toast({ tone: "violet", icon: "sparkle", title: n.descendedTitle, text: n.descendedText(fmt(event.threads)) });
          break;
        case "reunion":
          toast({ tone: "gold", icon: "campfire", title: n.reunionTitle, text: n.reunionText(formatDuration(event.seconds, locale)) });
          break;
        case "dream":
          // The line itself is shown over the scene (Scene), with no numbers.
          audio.play("dream");
          break;
        case "event": {
          if (QUIET_EVENTS.has(event.id)) break;
          const text = g.events[event.id];
          if (event.won !== undefined) {
            const result = (n.results as Partial<Record<string, { won: string; escaped: string }>>)[event.id];
            if (result) toast({ tone: event.won ? "success" : "info", icon: "hourglass", title: text.name, text: event.won ? result.won : result.escaped });
            break;
          }
          if (event.id === "remembrance") {
            const today = new Date().toDateString();
            if (rememberedOn === today) break;
            rememberedOn = today;
          }
          if (event.id === "seam") audio.play("seam");
          if (event.id === "wager") audio.play("pip");
          if (event.id === "walker") {
            // Another walker's echo, bearing a name from the Roll (never the walker's own).
            const count = bestiaryKills(store.state, "walker-echo");
            const own = cloud.user?.username;
            void loadRoll().then((names) => {
              const others = names.filter((name) => name !== own);
              const name = others.length > 0 ? others[Math.max(0, count - 1) % others.length] : null;
              toast({ tone: "violet", icon: "walker", title: text.name, text: name ? currentMessages().night.walkerNamed(name, WALKER_SECONDS) : text.text });
            });
            break;
          }
          toast({ tone: "violet", icon: "sparkle", title: text.name, text: text.text });
          break;
        }
        case "inventoryFull":
          toast({ tone: "info", title: m.inventoryFull(itemName(event.item, locale), event.shards) });
          break;
        case "hourglass":
          toast({ tone: "success", title: m.hourglass(fmt(event.kills)) });
          break;
        case "bestiary": {
          if (!HERALDED.has(event.id) || !BESTIARY_BY_ID[event.id]) break;
          const line = g.bestiary[event.id]?.[event.tier - 1];
          if (line) toast({ tone: "violet", icon: "scroll", title: m.bestiary(g.monsters[event.id] ?? event.id), text: line });
          break;
        }
        case "recognition":
          audio.play("recognition");
          toast({ tone: "gold", icon: "sparkle", title: m.recognition(g.heroes[event.heroId].name, event.tier), text: chronicleText({ source: "memory", hero: event.heroId, tier: event.tier }, locale).text });
          break;
        case "secret":
          audio.play("fragment");
          toast({ tone: "violet", icon: "sparkle", title: m.secretTitle, text: chronicleText({ source: "secret", id: event.id }, locale).text });
          break;
        case "storm":
          audio.play("crystal");
          toast({ tone: "violet", icon: "gem", title: g.events.storm.name, text: g.events.storm.text });
          break;
        case "fragment": {
          if (OWN_TOAST.has(event.entry.source)) break;
          const now = performance.now();
          if (now - lastFragmentAt < FRAGMENT_TOAST_GAP_MS) break;
          lastFragmentAt = now;
          audio.play("fragment");
          const line = chronicleText(event.entry, locale);
          toast({ tone: "violet", icon: "scroll", title: m.fragmentTitle, text: line.by ? `${line.by}${locale === "fr" ? " : " : ": "}${line.text}` : line.text });
          break;
        }
      }
    });
  }, [store, cloud, toast, loadRoll]);

  // Keyboard shortcuts: 1-7 for powers, Escape to close.
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

  const context = useMemo(() => ({ store, cloud, ui, fresh }), [store, cloud, ui, fresh]);

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
        <CloudChoiceModal />
        {confirmRequest ? <ConfirmDialog request={confirmRequest} onDone={() => setConfirmRequest(null)} /> : null}
        <Toasts toasts={toasts} held={covered} />
      </div>
    </GameContext.Provider>
  );
}
