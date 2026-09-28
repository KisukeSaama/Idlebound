import { createInitialState, type GameState } from "@idlebound/game";
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
});
