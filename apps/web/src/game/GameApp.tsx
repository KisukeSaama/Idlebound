"use client";

import {
  ACHIEVEMENT_BY_ID,
  BESTIARY_BY_ID,
  BIOMES,
  PROMISE_BY_HERO,
  promiseDoublings,
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
  eclipseWord,
  isKingStage,
  kingWord,
  promiseText,
  rarityColor,
  recognitionTier,
  runBits,
  regaliaWord,
  skillText,
  wearsRegalia,
  witnessedCutscenes,
  type AbsenceAccount,
  type ChronicleEntry,
  type CutsceneId,
  type GameEvent,
  type Item,
  type TraitId
} from "@idlebound/game";
import { currentLocale, currentMessages, useI18n } from "@/i18n/client";
import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { audio } from "./audio";
import { haptics } from "./haptics";
import { CloudSync } from "./cloud";
import { GameContext, revealsOf, type GameUi, type ToastInput, type WindowId } from "./context";
import { hintsAnsweredBy } from "./hints";
import { WINDOW_KEYS, nextBuyMode } from "./hotkeys";
import { SKILL_PICTO, type PictoName } from "./icons";
import { ANNOUNCED, ANNOUNCED_AT_LOAD, OWN_TOAST, reveals, revealMark, sceneMark, stratumLabel, type RevealId } from "./shell";
import { describePromise } from "./text";
import { useArrival, useNewRelease } from "./newRelease";
import { GameStore } from "./store";
import { installFastTap } from "./tap";
import { CloudChoiceModal } from "./components/CloudChoiceModal";
import { ElsewhereModal } from "./components/ElsewhereModal";
import { ConfirmDialog, type ConfirmRequest } from "./components/ConfirmDialog";
import { ChestOpening, type ChestOpeningRequest } from "./components/ChestOpening";
import { SatchelOpening, type SatchelOpeningRequest } from "./components/SatchelOpening";
import { Cutscene } from "./components/Cutscene";
import { ReunionModal } from "./components/ReunionModal";
import { GameHeader } from "./components/GameHeader";
import { HeroPanel } from "./components/HeroPanel";
import { InstallInvite } from "./components/InstallInvite";
import { LedgerAway } from "./components/LedgerAway";
import { ReleaseScreen } from "./components/ReleaseScreen";
import { NavRail } from "./components/NavRail";
import { Scene } from "./components/Scene";
import { PHONE_QUERY, Toasts, type Toast } from "./components/Toasts";
import { WindowHost } from "./windows/WindowHost";
import { WindowBoundary } from "./windows/WindowBoundary";
import "./damage.css";
import "./game.css";

/** Never more than one fragment toast a minute (BIBLE 17.4): the others wait in the Chronicle. */
const FRAGMENT_TOAST_GAP_MS = 60_000;
/** The walker is told at most this often that their word holds them back (every strike would say it). */
const HELD_TOAST_GAP_MS = 12_000;
/** The night whose dusk is told in a scene: the first. */
const FIRST_DUSK_NIGHT = 1;
/** Chronicle sources rare and weighty enough to always be told, whatever came just before. */
const ALWAYS_TOLD: ReadonlySet<ChronicleEntry["source"]> = new Set(["keystone", "milestone"]);
/** Events told by their own window rather than a toast (the Caravan is bought at the stall). */
const QUIET_EVENTS: ReadonlySet<string> = new Set(["caravan"]);
/** Tutorial id kept once the first Rout was told. */
const ROUT_TOLD = "rout";
/** How long a newly earned element of the shell glows. */
const FRESH_MS = 4_000;
/**
 * Toasts on screen at once: on a phone's layout two (the same test as the CSS), elsewhere
 * four. The others wait their turn in line, none dropped; a long line moves faster.
 */
const TOASTS_ON_PHONE = 2;
const TOASTS_ON_DESKTOP = 4;
const RUSHED_TOAST_MS = 2_600;
/** Reading time per word of a toast, and the longest a toast stays. */
const MS_PER_WORD = 260;
const MAX_TOAST_MS = 14_000;
/** A toast let go after a pause keeps at least this long, to finish its line. */
const RESUMED_TOAST_MS = 1_500;
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
  caravan: "stall",
  promise: "knot",
  altars2: "gem",
  altars3: "gem",
  traits: "sparkle",
  awaken: "sparkle"
};
/** Creatures whose new Bestiary lines are worth a toast: the great ones and the wanderers. */
const HERALDED = new Set([...BIOMES.flatMap((biome) => [biome.boss.id, biome.miniBoss.id]), ...Object.keys(WANDERER_BY_ID), "echo-bat"]);

export default function GameApp() {
  const store = useMemo(() => new GameStore(createInitialState()), []);
  const cloud = useMemo(() => new CloudSync(store), [store]);
  const [openWindow, setOpenWindow] = useState<{ id: WindowId; tab?: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [reunion, setReunion] = useState<{ account: AbsenceAccount; seconds: number } | null>(null);
  const [cutscene, setCutscene] = useState<CutsceneId | null>(null);
  const [chest, setChest] = useState<ChestOpeningRequest | null>(null);
  const [satchel, setSatchel] = useState<SatchelOpeningRequest | null>(null);
  /** While a chest is being bought, the relics it gives, kept for its opening instead of a toast. */
  const chestLoot = useRef<Item[] | null>(null);
  const [mobileTab, setMobileTab] = useState<"heroes" | "scene">("heroes");
  const [ready, setReady] = useState(false);
  const toastId = useRef(0);
  const fresh = useMemo(() => new Set<RevealId>(), []);
  /** Names of the Roll, fetched once, for the Echo of a Walker. */
  const roll = useRef<Promise<string[]> | null>(null);
  const { t, locale } = useI18n();

  /**
   * Toasts wait in line: while a window or a dialog is open (they would cover it), and while
   * the room on screen is full. Each one is shown, and so read aloud, in its turn.
   */
  const holding = useRef(false);
  const pump = useMemo(() => {
    const line: Toast[] = [];
    let onScreen: Toast[] = [];
    /** The leaving timer of each toast on screen, restarted when a stacked toast counts one more. */
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    const roomOnScreen = () => (window.matchMedia(PHONE_QUERY).matches ? TOASTS_ON_PHONE : TOASTS_ON_DESKTOP);
    /** When each toast on screen leaves, and what was left of its time while the stack is paused. */
    const due = new Map<number, number>();
    const left = new Map<number, number>();
    let paused = false;
    const leaveAfter = (id: number, ms: number) => {
      clearTimeout(timers.get(id));
      due.set(id, performance.now() + ms);
      timers.set(id, setTimeout(() => {
        timers.delete(id);
        due.delete(id);
        onScreen = onScreen.filter((item) => item.id !== id);
        setToasts(onScreen);
        next();
      }, ms));
    };
    const schedule = (entry: Toast) => {
      // Long enough to be read: a quarter second a word past the first glance, more for a quote.
      const words = [entry.title, entry.text, entry.quote?.text].join(" ").split(/\s+/).filter(Boolean).length;
      const duration = Math.min(MAX_TOAST_MS, Math.max(entry.quote ? 8000 : entry.tone === "danger" ? 4500 : 3800, 1500 + words * MS_PER_WORD));
      // A long line moves faster, never faster than a hurried read.
      const ms = line.length > roomOnScreen() ? Math.max(RUSHED_TOAST_MS, duration * 0.6) : duration;
      if (paused) {
        clearTimeout(timers.get(entry.id));
        timers.delete(entry.id);
        left.set(entry.id, ms);
        return;
      }
      leaveAfter(entry.id, ms);
    };
    /** A pointer on the stack, or a key inside it, holds every toast shown until it leaves. */
    const pause = (on: boolean) => {
      if (on === paused) return;
      paused = on;
      const now = performance.now();
      if (on) {
        for (const [id, at] of due) {
          clearTimeout(timers.get(id));
          timers.delete(id);
          left.set(id, Math.max(0, at - now));
        }
        due.clear();
        return;
      }
      for (const [id, ms] of left) if (onScreen.some((entry) => entry.id === id)) leaveAfter(id, Math.max(ms, RESUMED_TOAST_MS));
      left.clear();
    };
    const next = () => {
      if (holding.current) return;
      const room = roomOnScreen();
      let changed = false;
      while (onScreen.length < room && line.length > 0) {
        const entry = { ...(line.shift() as Toast), shownAt: performance.now() };
        onScreen = [...onScreen, entry];
        changed = true;
        schedule(entry);
      }
      if (changed) setToasts(onScreen);
    };
    /**
     * A toast with a `stack` key that is already waiting or shown is not told again: the one
     * there counts one more, and on screen it stays its full time from now.
     */
    const add = (entry: Toast) => {
      const same = entry.stack === undefined ? undefined : [...onScreen, ...line].find((item) => item.stack === entry.stack);
      if (!same) {
        line.push({ ...entry, count: entry.stack === undefined ? undefined : 1 });
        next();
        return;
      }
      const counted = { ...entry, id: same.id, shownAt: same.shownAt, count: (same.count ?? 1) + 1 };
      const waiting = line.indexOf(same);
      if (waiting >= 0) {
        line[waiting] = counted;
        return;
      }
      onScreen = onScreen.map((item) => (item === same ? counted : item));
      schedule(counted);
      setToasts(onScreen);
    };
    /**
     * What a scene says is not told twice: a toast, waiting or shown, whose text is one of
     * `lines` goes; one that only quotes one of them keeps its text and loses the quote.
     */
    const forget = (lines: ReadonlySet<string>) => {
      const keep = (entries: Toast[]) =>
        entries.filter((entry) => entry.text === undefined || !lines.has(entry.text)).map((entry) => (entry.quote && lines.has(entry.quote.text) ? { ...entry, quote: undefined } : entry));
      line.splice(0, line.length, ...keep(line));
      onScreen = keep(onScreen);
      setToasts(onScreen);
      next();
    };
    /** A toast tapped away leaves at once, and the next one in line takes its place. */
    const dismiss = (id: number) => {
      if (!onScreen.some((entry) => entry.id === id)) return;
      clearTimeout(timers.get(id));
      timers.delete(id);
      due.delete(id);
      left.delete(id);
      onScreen = onScreen.filter((entry) => entry.id !== id);
      setToasts(onScreen);
      next();
    };
    return { add, next, forget, dismiss, pause };
  }, []);
  const toast = useCallback((input: ToastInput) => {
    // The Chronicle's lines wait there in silence when the walker asked so.
    if (input.lore && !store.state.settings.loreToasts) return;
    toastId.current += 1;
    pump.add({ ...input, id: toastId.current });
  }, [pump, store]);

  const covered = openWindow !== null || confirmRequest !== null || reunion !== null || cutscene !== null || chest !== null || satchel !== null;
  // A newer release waits only while a reload would take something from the screen: a
  // scene, a chest or the satchel, a question, a toast still to be read. An open window comes back closed.
  const leaving = useNewRelease(cloud, confirmRequest === null && reunion === null && cutscene === null && chest === null && satchel === null && toasts.length === 0);
  useEffect(() => {
    holding.current = covered;
    if (!covered) pump.next();
  }, [covered, pump]);

  // Arrived from an update: its screen finishes over the loading screen.
  const arrival = useArrival(ready);
  const arrivalScreen = arrival ? <ReleaseScreen update={arrival.update} arrived leaving={arrival.leaving} /> : null;

  // The loading screen follows the server's answer (or its silence).
  useSyncExternalStore(cloud.subscribe, cloud.getVersion, () => 0);

  // A scene played, by its moment or from the Chronicle, is marked in the save: it is no
  // longer waiting to be told.
  const playScene = useCallback(
    (id: CutsceneId) => {
      store.apply({ type: "tutorial", step: sceneMark(id) });
      setCutscene(id);
    },
    [store]
  );

  const ui = useMemo<GameUi>(() => ({
    openWindow: (id, tab) => {
      // A hint that pointed to this place is answered by the walker opening it.
      for (const hint of hintsAnsweredBy(store.state, id)) store.apply({ type: "tutorial", step: hint });
      setOpenWindow({ id, tab });
    },
    closeWindow: () => setOpenWindow(null),
    toast,
    playCutscene: playScene,
    openChest: (id, buy) => {
      const caught: Item[] = [];
      chestLoot.current = caught;
      let bought = false;
      try {
        bought = buy();
      } finally {
        chestLoot.current = null;
      }
      if (bought && caught[0]) setChest({ chest: id, item: caught[0] });
      return bought;
    },
    openSatchel: () => {
      const items = store.act<Item[]>({ type: "openSatchel" }) ?? [];
      if (items.length > 0) setSatchel({ items, kept: store.state.satchel.length });
      else toast({ tone: "info", icon: "chest", title: currentMessages().windows.gear.satchelFull });
    },
    confirm: (options) => new Promise<boolean>((resolve) => setConfirmRequest({ ...options, resolve }))
  }), [toast, store]);

  // Load the game from the server, then start the loop. No local save: progress only
  // exists on the server, under an account or, for a guest, under this browser's cookie.
  useEffect(() => {
    // Dev tool: window.__idlebound.act({ type: "…" }) from the console (a command, see commands.ts).
    if (process.env.NODE_ENV !== "production") (window as unknown as { __idlebound?: GameStore }).__idlebound = store;
    let cancelled = false;
    const see = () => {
      const visible = document.visibilityState === "visible";
      store.setVisible(visible);
      audio.setHidden(!visible);
      haptics.setHidden(!visible);
      return visible;
    };
    // A page opened out of sight (a background tab, a reload onto a newer release while the
    // walker was away) starts out of sight: what only happens under their eyes waits for them.
    see();
    void cloud.init().finally(() => {
      if (cancelled) return;
      // Played on another page: the game stands still until the walker takes it back.
      if (!cloud.elsewhere) store.start();
      setReady(true);
    });
    const onVisibility = () => {
      if (!see()) void cloud.sync({ keepalive: true });
      else cloud.resume();
    };
    const onLeave = (event: BeforeUnloadEvent) => {
      // The last uploads failed (server away) or the session ended: what was played since is only here.
      if (cloud.wouldLose()) event.preventDefault();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      cancelled = true;
      cloud.depart();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [store, cloud]);

  // The engine reads in the walker's language (Two Tongues).
  useEffect(() => store.setLocale(locale), [store, locale]);

  // A tap on a key answers the first time, on iPhone too.
  useEffect(() => installFastTap(window), []);

  const loadRoll = useCallback(() => {
    roll.current ??= api.leaderboard("stage").then((result) => (result.ok ? result.data.rows.map((row) => row.username) : []), () => []);
    return roll.current;
  }, []);

  // Once the game runs: Remembrance Nights by the walker's own calendar, and the Roll
  // fetched ahead for the walkers who may meet an echo.
  useEffect(() => {
    if (!ready) return;
    const remember = () => store.apply({ type: "remember" });
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
    const announce = (id: RevealId) => {
      const m = currentMessages();
      const g = gameText(currentLocale());
      const place = id as keyof typeof m.night.reveal;
      const title = place === "loom" ? g.places.loom.name : place === "caravan" ? g.events.caravan.name : place === "promise" ? m.sanctum.promise.title : place === "altars2" || place === "altars3" ? g.places.sanctum.name : place === "traits" || place === "awaken" ? m.hud.windowTitles.gear.label : m.hud.windowTitles[place].label;
      toast({ tone: "info", icon: REVEAL_PICTO[id], title, text: m.night.reveal[place] });
      store.apply({ type: "tutorial", step: revealMark(id) });
    };
    // What arrived after this walker was already past its threshold is told once, at load.
    const late = () => {
      const shown = revealsOf(store);
      for (const id of ANNOUNCED_AT_LOAD) if (shown[id] && !store.state.tutorial.done.includes(revealMark(id))) announce(id);
    };
    late();
    const check = () => {
      const shown = revealsOf(store);
      if (store.engine !== engine) {
        engine = store.engine;
        known = shown;
        late();
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
        if (!ANNOUNCED.includes(id) || store.state.tutorial.done.includes(revealMark(id))) continue;
        announce(id);
      }
      known = shown;
    };
    const unsubscribe = store.subscribe(check);
    return () => {
      unsubscribe();
      for (const timer of timers) clearTimeout(timer);
    };
  }, [ready, store, toast, fresh]);

  // The Ledger's scenes: one plays when the walker lives its moment during play, and a new
  // walk opens on the Long Night. A load (a new engine) only takes note of the moments already
  // lived; several lived at once (a long road walked alone) play only the last. The scenes
  // lived and never played are told once, in a toast, when the Hall that keeps them is open.
  useEffect(() => {
    if (!ready) return;
    let engine = store.engine;
    let known = new Set(witnessedCutscenes(store.state));
    const play = (id: CutsceneId) => {
      pump.forget(new Set(gameText(currentLocale()).cutscenes[id].lines));
      playScene(id);
    };
    const load = () => {
      const state = store.state;
      const untouched = state.lifetime.clicks === 0 && state.lifetime.kills === 0 && state.maxStageEver <= 1;
      if (untouched && !state.tutorial.done.includes(sceneMark("prologue"))) play("prologue");
      else tellKept();
    };
    const tellKept = () => {
      const state = store.state;
      if (!reveals(state).hall) return;
      const kept = witnessedCutscenes(state).filter((id) => !state.tutorial.done.includes(sceneMark(id)));
      if (kept.length === 0) return;
      const m = currentMessages().night.cutscene;
      toast({ tone: "violet", icon: "moon", title: m.keptTitle, text: m.kept(kept.length) });
      for (const id of kept) store.apply({ type: "tutorial", step: sceneMark(id) });
    };
    load();
    const check = () => {
      const lived = witnessedCutscenes(store.state);
      if (store.engine !== engine) {
        engine = store.engine;
        known = new Set(lived);
        load();
        return;
      }
      const fresh = lived.filter((id) => !known.has(id));
      known = new Set(lived);
      if (fresh.length > 0) play(fresh[fresh.length - 1]);
      else tellKept();
    };
    return store.subscribe(check);
  }, [ready, store, pump, playScene, toast]);

  // Audio settings, and the place that colours every sound.
  useEffect(() => {
    const sync = () => {
      audio.setEnabled(store.state.settings.sound);
      audio.setVolume(store.state.settings.volume);
      audio.setMusicVolume(store.state.settings.musicVolume);
      audio.setStage(store.state.stage);
      document.documentElement.classList.toggle("reduced-motion", store.state.settings.reducedMotion);
      document.documentElement.classList.toggle("colorblind", store.state.settings.colorblind);
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
    /** Companions who remembered at the same dusk, told together. */
    let remembered: { heroId: string; tier: number }[] = [];
    /** The King's seam closing on a walker who never passed him is told once a session. */
    let repelled = false;
    let lastHeldAt = -Infinity;
    return store.onFx((event: GameEvent) => {
      const locale = currentLocale();
      const m = currentMessages().hud.toasts;
      const n = currentMessages().night;
      const g = gameText(locale);
      const fmt = (value: number) => formatNumber(value, store.state.settings.notation);
      switch (event.type) {
        case "hit":
          audio.play(event.crit ? "crit" : "hit");
          // Only the walker's own blows buzz: Frenzy's would never stop.
          if (event.crit && event.source === "click") haptics.pulse("crit");
          break;
        case "kill":
          audio.play(event.monster.kind === "boss" || event.monster.kind === "miniboss" ? "kill" : "coin");
          // The Eclipse falls: shadowed, the King says what he remembers.
          if (event.monster.eclipse) toast({ tone: "violet", icon: "crown", title: g.events.eclipse.name, quote: { by: g.speakers.king, text: eclipseWord(store.state.lifetime.ascensions, locale) } });
          if (event.monster.kind === "boss" || event.monster.kind === "miniboss") haptics.pulse("kill");
          break;
        case "rout":
          audio.play("coin");
          // The first Rout says what happened, once.
          if (!store.state.tutorial.done.includes(ROUT_TOLD)) {
            toast({ tone: "info", icon: "sparkle", title: m.routTitle, text: m.routText });
            store.apply({ type: "tutorial", step: ROUT_TOLD });
          }
          break;
        case "spawn":
          if (event.monster.kind === "boss") audio.play("boss");
          // The Quiet: every other sound drops for a while.
          if (event.monster.event === "quiet") audio.play("quiet");
          if (event.monster.kind === "rare") toast({ tone: "violet", icon: "sparkle", title: m.wandererTitle(g.monsters[event.monster.id] ?? event.monster.id) });
          break;
        case "bossFailed":
          audio.play("fail");
          haptics.pulse("fail");
          {
            // A guardian of the present night keeps its wounds: say how far down it stays.
            const wound = store.state.trail.wound;
            const text = wound && wound.stage === event.stage && wound.share > 0 ? m.bossFailedWounded(Math.round(wound.share * 100)) : m.bossFailedText;
            // The King, to a walker who never passed him: once a session.
            const first = isKingStage(event.stage) && store.state.lifetime.ascensions === 0 && !repelled;
            if (first) repelled = true;
            toast({ tone: "danger", icon: "hourglass", title: m.bossFailedTitle, text, quote: first ? { by: g.speakers.king, text: g.voices.kingRepels[0] } : undefined });
          }
          break;
        case "stage":
          if (event.biomeChanged) {
            toast({ tone: "violet", icon: "map", title: biomeName(event.stage, locale), text: m.biome(stratumLabel(event.stage, locale), event.stage) });
          }
          break;
        case "achievement": {
          const achievement = ACHIEVEMENT_BY_ID[event.id];
          const text = achievementText(event.id, locale, fmt);
          audio.play("achievement");
          const bonus = Math.round((achievement?.bonus ?? 0) * 100);
          toast({ tone: "gold", icon: "trophy", title: m.achievement(text.name), text: bonus > 0 ? m.achievementText(text.description, bonus) : text.description });
          break;
        }
        case "loot": {
          // A chest opened before the walker's eyes tells its relic itself.
          if (chestLoot.current) {
            chestLoot.current.push(event.item);
            break;
          }
          audio.play("loot");
          haptics.pulse("loot");
          const legend = event.item.named ? g.relics[event.item.named]?.legend : undefined;
          // What it remembers doing, by name: the reason to look at it.
          const traits = (event.item.traits ?? []).map((id) => g.relicTraits[id as TraitId]?.name).filter(Boolean);
          const base = m.loot(g.rarities[event.item.rarity], event.item.level);
          toast({
            tone: "loot",
            icon: "chest",
            title: legend ? m.namedTitle(itemName(event.item, locale)) : itemName(event.item, locale),
            text: legend ?? (traits.length > 0 ? m.lootTraits(base, new Intl.ListFormat(locale, { type: "conjunction" }).format(traits)) : base),
            color: rarityColor(event.item.rarity, store.state.settings.colorblind)
          });
          break;
        }
        case "awakened":
          toast({ tone: "gold", icon: "sparkle", title: m.awakened(itemName(event.item, locale), fmt(event.item.depth ?? event.item.level)), text: m.awakenedText, color: rarityColor(event.item.rarity, store.state.settings.colorblind) });
          break;
        case "skillUnlocked": {
          const skill = SKILL_BY_ID[event.skillId];
          const text = skillText(event.skillId, locale, store.state);
          toast({ tone: "violet", icon: SKILL_PICTO[skill.id], title: m.skillUnlocked(text.name), text: m.skillUnlockedText(skill.hotkey, text.description) });
          break;
        }
        case "skill":
          audio.play("skill");
          haptics.pulse("power");
          break;
        case "heroBought": {
          audio.play("buy");
          haptics.pulse("buy");
          // A companion met again this night says so, by how well they remember the walker.
          const line = event.firstTime ? hireLine(event.heroId, recognitionTier(store.state, event.heroId), locale) : null;
          if (line) toast({ tone: "info", title: g.heroes[event.heroId].name, text: line });
          break;
        }
        case "upgradeBought":
          audio.play("buy");
          haptics.pulse("buy");
          break;
        case "crystal":
          audio.play("crystal");
          toast({ tone: "violet", icon: "gem", title: m.crystalTitle, text: event.reward === "gold" ? m.crystal.gold(formatNumber(event.amount, store.state.settings.notation, runBits(store.state))) : m.crystal[event.reward](event.amount) });
          break;
        case "kingWord":
          // The first Word is spoken in the scene of the first dusk, with its own sound.
          if (event.night !== FIRST_DUSK_NIGHT) audio.play("kingWord");
          pendingWord = event.night;
          break;
        case "ascended": {
          haptics.pulse("ascend");
          const night = pendingWord;
          pendingWord = null;
          // The first dusk is told in a scene (BIBLE 12.10), which plays its own sounds.
          if (night !== FIRST_DUSK_NIGHT) audio.play("ascend");
          // The confirmation carries the King's Word; in his Regalia, he knows the walker. A
          // scene that speaks the Word takes the quote back (see `forget`).
          const word = night === null ? "" : wearsRegalia(store.state) ? regaliaWord(store.state.lore.regalia, locale) : kingWord(night, locale);
          toast({ tone: "gold", icon: "crown", title: m.ascendedTitle, text: m.ascendedText(fmt(event.essences)), quote: word ? { by: g.speakers.king, text: word } : undefined });
          break;
        }
        case "descended":
          audio.play("descent");
          haptics.pulse("ascend");
          toast({ tone: "violet", icon: "sparkle", title: n.descendedTitle, text: n.descendedText(fmt(event.threads)) });
          break;
        case "reunion":
          // The company tells the road it held alone; with nothing to tell, a welcome.
          if (event.account) setReunion({ account: event.account, seconds: event.seconds });
          else toast({ tone: "gold", icon: "campfire", title: n.reunionTitle, text: n.reunionText(formatDuration(event.seconds, locale)) });
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
          if (line) toast({ tone: "violet", icon: "scroll", title: m.bestiary(g.monsters[event.id] ?? event.id), text: line, lore: true });
          break;
        }
        case "recognition":
          // Everyone who remembers at the same dusk is told in one toast; one alone, with their memory.
          remembered.push({ heroId: event.heroId, tier: event.tier });
          if (remembered.length > 1) break;
          setTimeout(() => {
            const all = remembered;
            remembered = [];
            const words = currentMessages().hud.toasts;
            const text = gameText(currentLocale());
            audio.play("recognition");
            if (all.length === 1) {
              const [one] = all;
              toast({ tone: "gold", icon: "sparkle", title: words.recognition(text.heroes[one.heroId].name, one.tier), text: chronicleText({ source: "memory", hero: one.heroId, tier: one.tier }, currentLocale()).text, lore: true });
              return;
            }
            const names = all.map((entry) => text.heroes[entry.heroId].name);
            const list = `${names.slice(0, -1).join(", ")}${words.and}${names[names.length - 1]}`;
            toast({ tone: "gold", icon: "sparkle", title: words.recognitionManyTitle, text: words.recognitionMany(list, all.every((entry) => entry.tier === 1)) });
          }, 0);
          break;
        case "promise": {
          // A word through the night, in the companion's own voice: asked, then kept or broken.
          const words = currentMessages().sanctum.promise.toasts;
          const name = g.heroes[event.heroId].name;
          const lines = promiseText(event.heroId, locale);
          if (event.outcome === "given") {
            audio.play("fragment");
            toast({ tone: "info", icon: "knot", title: words.given(name), text: describePromise(PROMISE_BY_HERO[event.heroId], locale, store.state.trail.promise?.goal), quote: lines ? { by: name, text: lines.ask } : undefined });
          } else if (event.outcome === "ready") {
            toast({ tone: "gold", icon: "knot", title: words.ready, text: words.readyText });
          } else if (event.outcome === "kept") {
            audio.play("recognition");
            toast({ tone: "gold", icon: "knot", title: words.kept(name), text: words.keptText(2 ** promiseDoublings(store.state, event.heroId)), quote: lines ? { by: name, text: lines.kept } : undefined });
          } else {
            audio.play("error");
            toast({ tone: "info", icon: "frayed", title: words.broken(name), text: words.brokenText, quote: lines ? { by: name, text: lines.broken } : undefined });
          }
          break;
        }
        case "promiseHeld": {
          const at = performance.now();
          if (at - lastHeldAt < HELD_TOAST_GAP_MS) break;
          lastHeldAt = at;
          audio.play("error");
          const words = currentMessages().sanctum.promise.toasts;
          toast({ tone: "info", icon: "knot", title: words.held(g.heroes[event.heroId].name), text: words.heldText(describePromise(PROMISE_BY_HERO[event.heroId], locale, store.state.trail.promise?.goal)) });
          break;
        }
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
          if (!ALWAYS_TOLD.has(event.entry.source) && now - lastFragmentAt < FRAGMENT_TOAST_GAP_MS) break;
          lastFragmentAt = now;
          audio.play("fragment");
          const line = chronicleText(event.entry, locale);
          toast({ tone: "violet", icon: "scroll", title: m.fragmentTitle, text: line.by ? `${line.by}${locale === "fr" ? " : " : ": "}${line.text}` : line.text, lore: true });
          break;
        }
      }
    });
  }, [store, cloud, toast, loadRoll]);

  // Keyboard shortcuts: 1-7 for powers, M E A H for the windows, B for the buy amount, F to
  // advance or stay, Escape to close. Never while a field has the keys, nor under a scene,
  // a question, a chest or a Reunion, which take them.
  const keysTaken = useRef(false);
  keysTaken.current = confirmRequest !== null || reunion !== null || cutscene !== null || chest !== null || satchel !== null;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
      if (event.key === "Escape") {
        setOpenWindow(null);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || keysTaken.current) return;
      const letter = event.key.length === 1 ? event.key.toLowerCase() : "";
      const shown = reveals(store.state);
      const place = WINDOW_KEYS.find((entry) => entry.key === letter);
      if (place) {
        if (!shown[place.reveal]) return;
        setOpenWindow((open) => (open && (open.id === place.window || (place.window === "gear" && open.id === "inventory")) ? null : { id: place.window }));
        for (const hint of hintsAnsweredBy(store.state, place.window)) store.apply({ type: "tutorial", step: hint });
        return;
      }
      if (letter === "b" && shown.buyModes) {
        store.act({ type: "settings", patch: { buyMode: nextBuyMode(store.state.settings.buyMode) } });
        return;
      }
      if (letter === "f" && shown.autoToggle) {
        store.act({ type: "auto" });
        return;
      }
      // Read by the key's place, not its letter: on a French keyboard, the number row without
      // Shift types "&", "é"...
      const digit = /^(?:Digit|Numpad)(\d)$/.exec(event.code)?.[1];
      const skill = SKILLS.find((entry) => entry.hotkey === digit);
      if (skill && isSkillUnlocked(store.state, skill.id)) {
        const used = store.act<boolean>({ type: "skill", id: skill.id });
        if (!used) audio.play("error");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  const context = useMemo(() => ({ store, cloud, ui, fresh }), [store, cloud, ui, fresh]);

  if (!ready) {
    if (cloud.reaching) return <LedgerAway reaching={cloud.reaching} onRetry={cloud.retryNow} />;
    return (
      <>
        <div className="game-loading" role="status">
          <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
          <div className="game-loading-bar" aria-hidden="true"><span /></div>
          <p>{t.hud.loadingSave}</p>
        </div>
        {arrivalScreen}
      </>
    );
  }

  // Same place as under the loading screen: the arrival's bar carries on when the game is ready.
  return (
    <>
      <GameContext.Provider value={context}>
        <div className="game-root">
          <GameHeader />
          <div className="game-body" data-mobile-tab={mobileTab}>
            <NavRail active={openWindow?.id ?? null} />
            <main className="game-main">
              <Scene />
            </main>
            <HeroPanel folded={mobileTab === "scene"} onFold={(folded) => setMobileTab(folded ? "scene" : "heroes")} />
          </div>
          {openWindow ? (
            <WindowBoundary key={openWindow.id} onClose={() => setOpenWindow(null)}>
              <WindowHost id={openWindow.id} tab={openWindow.tab} onClose={() => setOpenWindow(null)} />
            </WindowBoundary>
          ) : null}
          <CloudChoiceModal />
          <ElsewhereModal />
          {confirmRequest ? <ConfirmDialog request={confirmRequest} onDone={() => setConfirmRequest(null)} /> : null}
          {chest ? <WindowBoundary onClose={() => setChest(null)}><ChestOpening request={chest} onDone={() => setChest(null)} /></WindowBoundary> : null}
          {satchel ? <WindowBoundary onClose={() => setSatchel(null)}><SatchelOpening request={satchel} onDone={() => setSatchel(null)} /></WindowBoundary> : null}
          {cutscene ? <WindowBoundary onClose={() => setCutscene(null)}><Cutscene id={cutscene} onDone={() => setCutscene(null)} /></WindowBoundary> : null}
          {reunion ? <WindowBoundary onClose={() => setReunion(null)}><ReunionModal account={reunion.account} seconds={reunion.seconds} onClose={() => setReunion(null)} /></WindowBoundary> : null}
          <Toasts
            toasts={toasts}
            held={covered}
            onDismiss={pump.dismiss}
            onPause={pump.pause}
            onChronicle={(id) => {
              pump.dismiss(id);
              pump.pause(false);
              ui.openWindow("hall", "chronicle");
            }}
          />
          <InstallInvite covered={covered} />
        </div>
      </GameContext.Provider>
      {leaving ? <ReleaseScreen update={leaving} /> : arrivalScreen}
    </>
  );
}
