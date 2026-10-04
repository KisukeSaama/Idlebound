import { createInitialState } from "@idlebound/game";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { CloudSync } from "./cloud";
import { NewRelease, takeArrival, UPDATE_MS, type ReleaseUpdate } from "./newRelease";
import { GameStore } from "./store";

const USER = { id: "u1", username: "walker", email: "w@example.com", createdAt: "2026-01-01T00:00:00Z", emailVerified: true, verifyBy: null };

/** An answer from the server; `release` is the one it runs. */
function json(body: unknown, { status = 200, release }: { status?: number; release?: string } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (release) {
    headers["x-idlebound-release"] = release;
    headers["x-idlebound-version"] = `v-${release}`;
  }
  return new Response(JSON.stringify(body), { status, headers });
}

const saved = () => json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } });
/** The update screen of this page: from its own version to the server's. */
const UPDATE = { from: "v-old", to: "v-new" };
const kept = (release: string) => json({ revision: 5, updatedAt: "2026-01-01T00:00:00Z" }, { release });

describe("NewRelease", () => {
  let win: EventTarget;
  let visibility: DocumentVisibilityState;
  let stored: Map<string, string>;
  let fetchMock: ReturnType<typeof vi.fn>;
  let reloads: number;
  let shown: (ReleaseUpdate | null)[];
  let calm: boolean;
  let running: { store: GameStore; cloud: CloudSync; watch: NewRelease } | null;

  function events(target: EventTarget) {
    return {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      dispatchEvent: target.dispatchEvent.bind(target)
    };
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "setInterval", "Date"] });
    // This page was built from release "old".
    vi.stubEnv("IDLEBOUND_RELEASE", "old");
    vi.stubEnv("IDLEBOUND_VERSION", "v-old");
    win = new EventTarget();
    stored = new Map();
    const sessionStorage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
      removeItem: (key: string) => stored.delete(key)
    };
    vi.stubGlobal("window", { ...events(win), sessionStorage });
    vi.stubGlobal("sessionStorage", sessionStorage);
    visibility = "visible";
    vi.stubGlobal("document", {
      ...events(new EventTarget()),
      get visibilityState() {
        return visibility;
      }
    });
    vi.stubGlobal("requestAnimationFrame", (callback: () => void) => setTimeout(callback, 0));
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    reloads = 0;
    shown = [];
    calm = true;
    running = null;
  });

  afterEach(() => {
    if (running) {
      running.store.stop();
      running.cloud.dispose();
      running.watch.dispose();
    }
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  /** A signed-in game, or with `user` null a guest's: one the server keeps (`kept`), or not yet. */
  async function playing(user: typeof USER | null = USER, kept = false) {
    if (user) fetchMock.mockResolvedValueOnce(json({ user })).mockResolvedValueOnce(saved());
    else fetchMock.mockResolvedValueOnce(json({ user: null, guest: kept })).mockResolvedValueOnce(kept ? saved() : json({ save: null }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    store.start();
    const watch = new NewRelease(cloud, { calm: () => calm, show: (update) => shown.push(update), reload: () => (reloads += 1) });
    watch.start();
    running = { store, cloud, watch };
    return running;
  }

  const puts = () => fetchMock.mock.calls.filter(([, init]) => (init as RequestInit).method === "PUT").length;

  it("moves a hidden page to the newer release once its game is saved", async () => {
    const { cloud } = await playing();
    visibility = "hidden";
    // A save answered by the new release, then the hand-over's own save.
    fetchMock.mockResolvedValueOnce(kept("new")).mockResolvedValueOnce(kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    expect(reloads).toBe(1);
    expect(puts()).toBe(2);
    expect(shown).toEqual([]);
    expect(stored.get("idlebound:release:reloaded-for")).toBe("new");
  });

  it("shows a watched page the update at once, then moves it once its game is saved", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    expect(shown).toEqual([UPDATE]);
    expect(reloads).toBe(0);
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(reloads).toBe(1);
  });

  it("reloads as the same page: the game it holds is not found open elsewhere", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(reloads).toBe(1);
    // A watched page keeps its hold on the game; the reload carries the same id.
    expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(((init as RequestInit).body as string) ?? "{}")).at(-1)).toMatchObject({ holder: cloud.holder, release: false });
    expect(stored.get("idlebound.page")).toBe(cloud.holder);
  });

  it("holds input under the update screen: touching the game does not keep the old page", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    const touch = new Event("pointerdown", { cancelable: true });
    win.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(true);
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(shown).toEqual([UPDATE]);
    expect(reloads).toBe(1);
  });

  it("waits while a reload would take something from the screen", async () => {
    const { cloud, watch } = await playing();
    calm = false;
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(shown).toEqual([]);
    calm = true;
    void watch.attempt();
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(reloads).toBe(1);
  });

  it("stays when a scene opens under the update screen", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    const sent = puts();
    calm = false;
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(shown).toEqual([UPDATE, null]);
    expect(reloads).toBe(0);
    expect(puts()).toBe(sent);
  });

  it("keeps the page when its game could not be saved, and tries again later", async () => {
    const { cloud } = await playing();
    visibility = "hidden";
    fetchMock.mockResolvedValueOnce(kept("new")).mockResolvedValueOnce(json({ error: "down" }, { status: 502, release: "new" }));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    expect(reloads).toBe(0);
    expect(cloud.status).toBe("error");
    fetchMock.mockImplementation(async () => kept("new"));
    await vi.advanceTimersByTimeAsync(5_000);
    expect(reloads).toBe(1);
  });

  it("moves a guest's game the server keeps, like an account's", async () => {
    const { cloud } = await playing(null, true);
    visibility = "hidden";
    fetchMock.mockResolvedValueOnce(kept("new")).mockResolvedValueOnce(kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    expect(reloads).toBe(1);
    expect(puts()).toBe(2);
  });

  it("never reloads a guest's game the server does not keep yet", async () => {
    await playing(null);
    fetchMock.mockImplementation(async () => json({ board: "stage", rows: [], me: null }, { release: "new" }));
    await api.leaderboard("stage");
    // Watched and calm: not even a fade.
    await vi.advanceTimersByTimeAsync(60_000);
    expect(shown).toEqual([]);
    visibility = "hidden";
    await vi.advanceTimersByTimeAsync(60_000);
    expect(reloads).toBe(0);
    expect(puts()).toBe(0);
  });

  it("does not reload again for a release this tab already reloaded for", async () => {
    stored.set("idlebound:release:reloaded-for", "new");
    const { cloud } = await playing();
    visibility = "hidden";
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(reloads).toBe(0);
  });

  it("ignores answers from its own release", async () => {
    const { cloud } = await playing();
    visibility = "hidden";
    fetchMock.mockImplementation(async () => kept("old"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(reloads).toBe(0);
  });

  it("hands the new page the update it arrives from, once", async () => {
    const { cloud } = await playing();
    visibility = "hidden";
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(0);
    expect(reloads).toBe(1);
    // The reloaded page runs the new release.
    vi.stubEnv("IDLEBOUND_RELEASE", "new");
    vi.stubEnv("IDLEBOUND_VERSION", "v-new");
    expect(takeArrival()).toEqual(UPDATE);
    expect(takeArrival()).toBeNull();
  });

  it("names the same version on both sides when the release did not raise it", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => {
      const answer = kept("new");
      answer.headers.set("x-idlebound-version", "v-old");
      return answer;
    });
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(UPDATE_MS);
    expect(shown).toEqual([{ from: "v-old", to: "v-old" }]);
    expect(reloads).toBe(1);
    vi.stubEnv("IDLEBOUND_RELEASE", "new");
    expect(takeArrival()).toEqual({ from: "v-old", to: "v-old" });
  });

  it("does not claim an update a page still older did not reach, even with the same version", async () => {
    stored.set("idlebound:release:arrival", JSON.stringify({ ...UPDATE, release: "new" }));
    vi.stubEnv("IDLEBOUND_VERSION", "v-new");
    // Still the old release: a cache served the old page again.
    expect(takeArrival()).toBeNull();
    expect(stored.has("idlebound:release:arrival")).toBe(false);
  });
});
