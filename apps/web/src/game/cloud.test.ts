import { createInitialState, type GameState } from "@idlebound/game";
import { verifyTransition } from "@idlebound/game/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CloudSync } from "./cloud";
import { GameStore } from "./store";

/** Minimal browser for CloudSync in node: events and visibility. */
function stubBrowser() {
  const target = new EventTarget();
  const events = {
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target)
  };
  vi.stubGlobal("window", events);
  vi.stubGlobal("document", { ...events, visibilityState: "visible" });
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => setTimeout(callback, 0));
  return target;
}

const USER = { id: "u1", username: "walker", email: "w@example.com", createdAt: "2026-01-01T00:00:00Z", emailVerified: true, verifyBy: null };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("CloudSync at load", () => {
  let browser: EventTarget;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    browser = stubBrowser();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("waits for the server instead of starting a guest game when it cannot be reached", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("offline"));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    let done = false;
    const init = cloud.init().then(() => {
      done = true;
    });
    await vi.waitFor(() => expect(cloud.reaching).not.toBeNull());
    expect(done).toBe(false);
    expect(cloud.reaching?.attempts).toBe(1);

    // The network comes back: the next attempt goes at once and a "no session" answer lets a guest in.
    fetchMock.mockResolvedValueOnce(json({ user: null }));
    browser.dispatchEvent(new Event("online"));
    await init;
    expect(cloud.reaching).toBeNull();
    expect(cloud.status).toBe("offline");
    cloud.dispose();
  });

  it("retries a proxy error and then loads the account's game", async () => {
    const saved: GameState = { ...createInitialState(), maxStageEver: 42 };
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ error: "unreachable" }, 502))
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 7, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    const init = cloud.init();
    await vi.waitFor(() => expect(cloud.reaching).not.toBeNull());
    cloud.retryNow();
    await init;
    expect(cloud.reaching).toBeNull();
    expect(cloud.revision).toBe(7);
    expect(store.state.maxStageEver).toBe(42);
    cloud.dispose();
  });

  it("catches up the time a closed game was away, never more than the server saw pass", async () => {
    // The device clock says two hours; the server saw one.
    const saved = createInitialState(Date.now() - 3 * 3_600_000);
    saved.lastTickAt = Date.now() - 2 * 3_600_000;
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 3, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 3_600_000 } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    expect(store.state.lifetime.offlineSeconds).toBeGreaterThan(3_590);
    expect(store.state.lifetime.offlineSeconds).toBeLessThanOrEqual(3_600);
    cloud.dispose();
  });

  it("sends a game caught up to the clock when the page wakes from a freeze", async () => {
    const start = Date.now();
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: createInitialState(start), revision: 3, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    const before = structuredClone(store.state);

    // The device slept fourteen minutes; the sync timer runs before the loop's.
    const clock = vi.spyOn(Date, "now").mockReturnValue(start + 14 * 60_000);
    fetchMock.mockResolvedValueOnce(json({ revision: 4, updatedAt: "2026-01-01T00:00:00Z" }));
    await cloud.sync();
    const [, init] = fetchMock.mock.calls.at(-1)!;
    const sent = JSON.parse(String((init as RequestInit).body)).state as GameState;
    expect(sent.lastTickAt).toBe(start + 14 * 60_000);
    expect(sent.lifetime.offlineSeconds).toBeGreaterThan(830);

    // The server keeps it, and the save after it too: the catch-up was counted in the first.
    expect(verifyTransition(before, sent, 14 * 60_000)).toEqual([]);
    clock.mockReturnValue(start + 14 * 60_000 + 15_000);
    store.advance();
    expect(verifyTransition(sent, store.state, 15_000)).toEqual([]);
    cloud.dispose();
  });

  it("never writes over an account game it could not read", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: USER })).mockResolvedValueOnce(json({ error: "forbidden" }, 403));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    await cloud.init();
    expect(cloud.status).toBe("error");
    // The next sync reads the account's game again rather than uploading this one.
    fetchMock.mockResolvedValueOnce(json({ save: null })).mockResolvedValueOnce(json({ revision: 1, updatedAt: "2026-01-01T00:00:00Z" }));
    await cloud.sync();
    const calls = fetchMock.mock.calls.map(([url, init]) => `${(init as RequestInit).method} ${String(url)}`);
    expect(calls.slice(2)).toEqual(["GET /api/save", "PUT /api/save"]);
    cloud.dispose();
  });

  it("never erases a signed-in player's game, but lets a guest start over", async () => {
    const saved: GameState = { ...createInitialState(), maxStageEver: 42 };
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 7, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    cloud.newGame();
    expect(store.state.maxStageEver).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    cloud.forget();
    store.replaceState(saved);
    cloud.newGame();
    expect(store.state.maxStageEver).toBe(1);
    cloud.dispose();
  });
});

describe("CloudSync hand-over to a newer release", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stubBrowser();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function signedIn() {
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    return { store, cloud };
  }

  const puts = () => fetchMock.mock.calls.filter(([, init]) => (init as RequestInit).method === "PUT");

  it("hands over once the server kept the last save, and syncs no more", async () => {
    const { store, cloud } = await signedIn();
    store.apply((engine) => {
      engine.state.gold = 1234;
    });
    fetchMock.mockResolvedValueOnce(json({ revision: 5, updatedAt: "2026-01-01T00:00:00Z" }));
    expect(await cloud.handOver()).toBe(true);
    const [, init] = puts()[0];
    expect((init as RequestInit).keepalive).toBe(true);
    expect(JSON.parse(String((init as RequestInit).body)).state.gold).toBe(1234);
    // Disposed: a later sync request sends nothing.
    cloud.requestSave();
    expect(puts()).toHaveLength(1);
  });

  it("keeps the game running when the last save does not land", async () => {
    const { store, cloud } = await signedIn();
    fetchMock.mockResolvedValueOnce(json({ error: "unreachable" }, 502));
    expect(await cloud.handOver()).toBe(false);
    expect(cloud.status).toBe("error");
    // The loop runs again: time passes in the game.
    const before = store.state.lastTickAt;
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(store.state.lastTickAt).toBeGreaterThan(before);
    store.stop();
    cloud.dispose();
  });

  it("waits for an upload under way, then sends the latest game", async () => {
    const { store, cloud } = await signedIn();
    let answer: (response: Response) => void = () => {};
    fetchMock.mockReturnValueOnce(new Promise<Response>((resolve) => (answer = resolve)));
    const sync = cloud.sync();
    store.apply((engine) => {
      engine.state.gold = 777;
    });
    fetchMock.mockResolvedValueOnce(json({ revision: 6, updatedAt: "2026-01-01T00:00:00Z" }));
    const handOver = cloud.handOver();
    answer(json({ revision: 5, updatedAt: "2026-01-01T00:00:00Z" }));
    await sync;
    expect(await handOver).toBe(true);
    expect(puts()).toHaveLength(2);
    const [, last] = puts()[1];
    expect(JSON.parse(String((last as RequestInit).body))).toMatchObject({ baseRevision: 5, state: { gold: 777 } });
  });

  it("never hands over while the account's game is still loading", async () => {
    let answer: (response: Response) => void = () => {};
    fetchMock.mockResolvedValueOnce(json({ user: USER })).mockReturnValueOnce(new Promise<Response>((resolve) => (answer = resolve)));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    const init = cloud.init();
    await vi.waitFor(() => expect(cloud.user).not.toBeNull());
    expect(await cloud.handOver()).toBe(false);
    answer(json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0 } }));
    await init;
    expect(puts()).toHaveLength(0);
    cloud.dispose();
  });

  it("never hands over a guest game, which only lives in the page", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: null }));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    await cloud.init();
    expect(await cloud.handOver()).toBe(false);
    expect(puts()).toHaveLength(0);
    cloud.dispose();
  });
});
