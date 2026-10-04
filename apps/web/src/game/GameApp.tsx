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
  regaliaWord,
  skillText,
  wearsRegalia,
  witnessedCutscenes,
  type AbsenceAccount,
  type ChronicleEntry,
  type CutsceneId,
  type GameEvent,
  type Item
} from "@idlebound/game";
import { currentLocale, currentMessages, useI18n } from "@/i18n/client";
import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { audio } from "./audio";
import { haptics } from "./haptics";
import { CloudSync } from "./cloud";
import { GameContext, revealsOf, type GameUi, type ToastInput, type WindowId } from "./context";
import { hintsAnsweredBy } from "./hints";
import { SKILL_PICTO, type PictoName } from "./icons";
import { ANNOUNCED, ANNOUNCED_AT_LOAD, OWN_TOAST, revealMark, stratumLabel, type RevealId } from "./shell";
import { describePromise } from "./text";
import { useNewRelease } from "./newRelease";
import { GameStore } from "./store";
import { CloudChoiceModal } from "./components/CloudChoiceModal";
import { ElsewhereModal } from "./components/ElsewhereModal";
import { ConfirmDialog, type ConfirmRequest } from "./components/ConfirmDialog";
import { ChestOpening, type ChestOpeningRequest } from "./components/ChestOpening";
import { Cutscene } from "./components/Cutscene";
import { ReunionModal } from "./components/ReunionModal";
import { GameHeader } from "./components/GameHeader";
import { HeroPanel } from "./components/HeroPanel";
import { InstallInvite } from "./components/InstallInvite";
import { LedgerAway } from "./components/LedgerAway";
import { NavRail } from "./components/NavRail";
import { Scene } from "./components/Scene";
import { PHONE_QUERY, Toasts, type Toast } from "./components/Toasts";
import { WindowHost } from "./windows/WindowHost";
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
  altars3: "gem"
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
    const schedule = (entry: Toast) => {
      clearTimeout(timers.get(entry.id));
      const duration = entry.quote ? 8000 : entry.tone === "danger" ? 4500 : 3800;
      timers.set(entry.id, setTimeout(() => {
        timers.delete(entry.id);
        onScreen = onScreen.filter((item) => item.id !== entry.id);
        setToasts(onScreen);
        next();
      }, line.length > roomOnScreen() ? Math.min(duration, RUSHED_TOAST_MS) : duration));
    };
    const next = () => {
      if (holding.current) return;
      const room = roomOnScreen();
      let changed = false;
      while (onScreen.length < room && line.length > 0) {
        const entry = line.shift() as Toast;
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
      const counted = { ...entry, id: same.id, count: (same.count ?? 1) + 1 };
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
    return { add, next, forget };
  }, []);
  const toast = useCallback((input: ToastInput) => {
    toastId.current += 1;
    pump.add({ ...input, id: toastId.current });
  }, [pump]);

  const covered = openWindow !== null || confirmRequest !== null || reunion !== null || cutscene !== null || chest !== null;
  // A newer release waits only while a reload would take something from the screen: a
  // scene, a chest, a question, a toast still to be read. An open window comes back closed.
  const fading = useNewRelease(cloud, confirmRequest === null && reunion === null && cutscene === null && chest === null && toasts.length === 0);
  useEffect(() => {
    holding.current = covered;
    if (!covered) pump.next();
  }, [covered, pump]);

  // The loading screen follows the server's answer (or its silence).
  useSyncExternalStore(cloud.subscribe, cloud.getVersion, () => 0);

  const ui = useMemo<GameUi>(() => ({
    openWindow: (id, tab) => {
      // A hint that pointed to this place is answered by the walker opening it.
      for (const hint of hintsAnsweredBy(store.state, id)) store.apply((engine) => engine.completeTutorial(hint));
      setOpenWindow({ id, tab });
    },
    closeWindow: () => setOpenWindow(null),
    toast,
    playCutscene: setCutscene,
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
    confirm: (options) => new Promise<boolean>((resolve) => setConfirmRequest({ ...options, resolve }))
  }), [toast, store]);

  // Load the game from the server, then start the loop. No local save: progress only
  // exists on the server, under an account or, for a guest, under this browser's cookie.
  useEffect(() => {
    // Dev tool: window.__idlebound.act((engine) => …) from the console.
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
    const announce = (id: RevealId) => {
      const m = currentMessages();
      const g = gameText(currentLocale());
      const place = id as keyof typeof m.night.reveal;
      const title = place === "loom" ? g.places.loom.name : place === "caravan" ? g.events.caravan.name : place === "promise" ? m.sanctum.promise.title : place === "altars2" || place === "altars3" ? g.places.sanctum.name : m.hud.windowTitles[place].label;
      toast({ tone: "info", icon: REVEAL_PICTO[id], title, text: m.night.reveal[place] });
      store.apply((current) => current.completeTutorial(revealMark(id)));
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

  // The Ledger's scenes: one plays when the walker lives its moment during play. A load (a
  // new engine) only takes note of the moments already lived; several lived at once (a long
  // road walked alone) play only the last, the others wait in the Chronicle.
  useEffect(() => {
    if (!ready) return;
    let engine = store.engine;
    let known = new Set(witnessedCutscenes(store.state));
    const check = () => {
      const lived = witnessedCutscenes(store.state);
      if (store.engine !== engine) {
        engine = store.engine;
        known = new Set(lived);
        return;
      }
      const fresh = lived.filter((id) => !known.has(id));
      if (fresh.length === 0) return;
      known = new Set(lived);
      const id = fresh[fresh.length - 1];
      pump.forget(new Set(gameText(currentLocale()).cutscenes[id].lines));
      setCutscene(id);
    };
    return store.subscribe(check);
  }, [ready, store, pump]);

  // Audio settings, and the place that colours every sound.
  useEffect(() => {
    const sync = () => {
      audio.setEnabled(store.state.settings.sound);
      audio.setVolume(store.state.settings.volume);
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
            store.apply((current) => current.completeTutorial(ROUT_TOLD));
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
          toast({
            tone: "loot",
            icon: "chest",
            title: legend ? m.namedTitle(itemName(event.item, locale)) : itemName(event.item, locale),
            text: legend ?? m.loot(g.rarities[event.item.rarity], event.item.level),
            color: rarityColor(event.item.rarity, store.state.settings.colorblind)
          });
          break;
        }
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
          toast({ tone: "violet", icon: "gem", title: m.crystalTitle, text: event.reward === "gold" ? m.crystal.gold(fmt(event.amount)) : m.crystal[event.reward](event.amount) });
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
          if (line) toast({ tone: "violet", icon: "scroll", title: m.bestiary(g.monsters[event.id] ?? event.id), text: line });
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
              toast({ tone: "gold", icon: "sparkle", title: words.recognition(text.heroes[one.heroId].name, one.tier), text: chronicleText({ source: "memory", hero: one.heroId, tier: one.tier }, currentLocale()).text });
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
    if (cloud.reaching) return <LedgerAway reaching={cloud.reaching} onRetry={cloud.retryNow} />;
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
          <HeroPanel folded={mobileTab === "scene"} onFold={(folded) => setMobileTab(folded ? "scene" : "heroes")} />
        </div>
        {openWindow ? <WindowHost id={openWindow.id} tab={openWindow.tab} onClose={() => setOpenWindow(null)} /> : null}
        <CloudChoiceModal />
        <ElsewhereModal />
        {confirmRequest ? <ConfirmDialog request={confirmRequest} onDone={() => setConfirmRequest(null)} /> : null}
        {chest ? <ChestOpening request={chest} onDone={() => setChest(null)} /> : null}
        {cutscene ? <Cutscene id={cutscene} onDone={() => setCutscene(null)} /> : null}
        {reunion ? <ReunionModal account={reunion.account} seconds={reunion.seconds} onClose={() => setReunion(null)} /> : null}
        <Toasts toasts={toasts} held={covered} />
        <InstallInvite covered={covered} />
        {fading ? <div className="release-fade" aria-hidden="true" /> : null}
      </div>
    </GameContext.Provider>
  );
}
