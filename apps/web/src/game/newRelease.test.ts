import { createInitialState } from "@idlebound/game";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { CloudSync } from "./cloud";
import { FADE_MS, NewRelease } from "./newRelease";
import { GameStore } from "./store";

const USER = { id: "u1", username: "walker", email: "w@example.com", createdAt: "2026-01-01T00:00:00Z", emailVerified: true, verifyBy: null };

/** An answer from the server; `release` is the one it runs. */
function json(body: unknown, { status = 200, release }: { status?: number; release?: string } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (release) headers["x-idlebound-release"] = release;
  return new Response(JSON.stringify(body), { status, headers });
}

const saved = () => json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } });
const kept = (release: string) => json({ revision: 5, updatedAt: "2026-01-01T00:00:00Z" }, { release });

describe("NewRelease", () => {
  let win: EventTarget;
  let visibility: DocumentVisibilityState;
  let stored: Map<string, string>;
  let fetchMock: ReturnType<typeof vi.fn>;
  let reloads: number;
  let fades: boolean[];
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
    win = new EventTarget();
    stored = new Map();
    vi.stubGlobal("window", {
      ...events(win),
      sessionStorage: { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value) }
    });
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
    fades = [];
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
    const watch = new NewRelease(cloud, { calm: () => true, fade: (fading) => fades.push(fading), reload: () => (reloads += 1) });
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
    expect(fades).toEqual([]);
    expect(stored.get("idlebound:release:reloaded-for")).toBe("new");
  });

  it("lets a watched page play on, then fades out after a quiet while", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(25_000);
    expect(fades).toEqual([]);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(fades).toEqual([true]);
    expect(reloads).toBe(0);
    await vi.advanceTimersByTimeAsync(FADE_MS);
    expect(reloads).toBe(1);
  });

  it("stays when the walker touches the game during the fade", async () => {
    const { cloud } = await playing();
    fetchMock.mockImplementation(async () => kept("new"));
    await cloud.sync();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fades).toEqual([true]);
    const sent = puts();
    win.dispatchEvent(new Event("pointerdown"));
    await vi.advanceTimersByTimeAsync(FADE_MS);
    expect(fades).toEqual([true, false]);
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
    // Watched and quiet: not even a fade.
    await vi.advanceTimersByTimeAsync(60_000);
    expect(fades).toEqual([]);
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
});
