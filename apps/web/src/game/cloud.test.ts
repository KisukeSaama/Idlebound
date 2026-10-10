import { buildWindow, createInitialState, emptyFates, localFates, type GameState } from "@idlebound/game";
import { gunzipSync } from "node:zlib";
import { parseJournal, verifyTransition } from "@idlebound/game/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { packJournal } from "@/lib/api";
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

const USER = { id: "u1", username: "walker", email: "w@example.com", createdAt: "2026-01-01T00:00:00Z", emailVerified: true, verifyBy: null, renameAt: null };

/** The fates a server hands out with a game: every slice of one seed. */
const FATES = buildWindow(emptyFates(), (stream, index) => localFates(1).slice(stream, index)!);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/**
 * The fetch the page sees: a new game's seed is answered at once (as the server would, the
 * same each time), everything else goes to `mock`, whose calls the tests read.
 */
function routed(mock: ReturnType<typeof vi.fn>) {
  const call = mock as unknown as (url: string, init: RequestInit) => Promise<Response>;
  return (url: string, init: RequestInit) => (String(url).endsWith("/new") ? Promise.resolve(json({ createdAt: Date.now(), fates: FATES })) : call(url, init));
}

describe("the journal on its way", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("leaves gzipped, and reads back as the journal the page wrote", async () => {
    stubBrowser();
    const store = new GameStore(createInitialState());
    store.replaceState(createInitialState(), { base: { revision: null, createdAt: store.state.createdAt }, fates: FATES });
    for (let index = 0; index < 12; index += 1) store.act({ type: "click", count: 1 });
    const { journal } = store.outgoing();
    const packed = await packJournal(journal);
    expect(typeof packed).toBe("string");
    const read = JSON.parse(gunzipSync(Buffer.from(packed as string, "base64")).toString("utf8"));
    expect(read).toEqual(journal);
    expect(parseJournal(read)?.dropped).toBe(0);
    expect((packed as string).length).toBeLessThan(JSON.stringify(journal).length);
  });
});

describe("CloudSync at load", () => {
  let browser: EventTarget;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    browser = stubBrowser();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", routed(fetchMock));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("waits for the server instead of starting a blank game when it cannot be reached", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("offline"));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    let done = false;
    const init = cloud.init().then(() => {
      done = true;
    });
    await vi.waitFor(() => expect(cloud.reaching).not.toBeNull());
    expect(done).toBe(false);
    expect(cloud.reaching?.attempts).toBe(1);

    // The network comes back: the next attempt goes at once, and a "no session, no guest
    // game" answer lets a new guest in.
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: false })).mockResolvedValueOnce(json({ save: null }));
    browser.dispatchEvent(new Event("online"));
    await init;
    expect(cloud.reaching).toBeNull();
    expect(cloud.status).toBe("idle");
    expect(cloud.revision).toBeNull();
    cloud.dispose();
  });

  it("waits for the server when the guest's game cannot be read, rather than starting over it", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: true })).mockResolvedValueOnce(json({ error: "unreachable" }, 502));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    const init = cloud.init();
    await vi.waitFor(() => expect(cloud.reaching).not.toBeNull());
    const saved: GameState = { ...createInitialState(), maxStageEver: 42 };
    fetchMock
      .mockResolvedValueOnce(json({ user: null, guest: true }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 3, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
    cloud.retryNow();
    await init;
    expect(store.state.maxStageEver).toBe(42);
    expect(cloud.revision).toBe(3);
    cloud.dispose();
  });

  it("retries a proxy error and then loads the account's game", async () => {
    const saved: GameState = { ...createInitialState(), maxStageEver: 42 };
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ error: "unreachable" }, 502))
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 7, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
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
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 3, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 3_600_000, fates: FATES } }));
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
      .mockResolvedValueOnce(json({ save: { state: createInitialState(start), revision: 3, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
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
    expect(calls.slice(2)).toEqual(["POST /api/save/open", "PUT /api/save"]);
    cloud.dispose();
  });

  it("never erases a signed-in player's game, but lets a guest start over", async () => {
    const saved: GameState = { ...createInitialState(), maxStageEver: 42 };
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: saved, revision: 7, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    await cloud.newGame();
    expect(store.state.maxStageEver).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    cloud.forget();
    store.replaceState(saved, { base: { revision: null, createdAt: saved.createdAt }, fates: FATES });
    await cloud.newGame();
    expect(store.state.maxStageEver).toBe(1);
    cloud.dispose();
  });
});

describe("CloudSync hand-over to a newer release", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stubBrowser();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", routed(fetchMock));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function signedIn() {
    fetchMock
      .mockResolvedValueOnce(json({ user: USER }))
      .mockResolvedValueOnce(json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    return { store, cloud };
  }

  const puts = () => fetchMock.mock.calls.filter(([, init]) => (init as RequestInit).method === "PUT");

  it("hands over once the server kept the last save, and syncs no more", async () => {
    const { store, cloud } = await signedIn();
    store.state.gold = 1234;
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

  it("stands aside rather than playing on when the last save finds the game taken elsewhere", async () => {
    const { store, cloud } = await signedIn();
    fetchMock.mockResolvedValueOnce(json({ error: "game_elsewhere" }, 409));
    expect(await cloud.handOver()).toBe(false);
    expect(cloud.elsewhere).toBe("taken");
    const before = store.state.lastTickAt;
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(store.state.lastTickAt).toBe(before);
    cloud.dispose();
  });

  it("warns before leaving when a conflict could not be read", async () => {
    const { store, cloud } = await signedIn();
    fetchMock.mockResolvedValueOnce(json({ error: "save_conflict" }, 409)).mockRejectedValueOnce(new TypeError("offline"));
    await cloud.sync({ force: true });
    expect(cloud.status).toBe("error");
    expect(cloud.wouldLose()).toBe(true);
    store.stop();
    cloud.dispose();
  });

  it("waits for an upload under way, then sends the latest game", async () => {
    const { store, cloud } = await signedIn();
    let answer: (response: Response) => void = () => {};
    fetchMock.mockReturnValueOnce(new Promise<Response>((resolve) => (answer = resolve)));
    const sync = cloud.sync();
    store.state.gold = 777;
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
    answer(json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
    await init;
    expect(puts()).toHaveLength(0);
    cloud.dispose();
  });

  it("never hands over a guest's game the server does not keep yet", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: false })).mockResolvedValueOnce(json({ save: null }));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    await cloud.init();
    expect(await cloud.handOver()).toBe(false);
    expect(puts()).toHaveLength(0);
    cloud.dispose();
  });

  it("hands over a guest's game the server keeps", async () => {
    fetchMock
      .mockResolvedValueOnce(json({ user: null, guest: true }))
      .mockResolvedValueOnce(json({ save: { state: createInitialState(), revision: 4, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } }));
    const cloud = new CloudSync(new GameStore(createInitialState()));
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ revision: 5, updatedAt: "2026-01-01T00:00:00Z" }));
    expect(await cloud.handOver()).toBe(true);
    const [url, init] = puts()[0];
    expect(String(url)).toBe("/api/save/guest");
    expect((init as RequestInit).keepalive).toBe(true);
  });
});

describe("CloudSync for a guest", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stubBrowser();
    // Anything not answered by hand (letting go of the guest's game) is accepted.
    fetchMock = vi.fn(async () => json({ ok: true }));
    vi.stubGlobal("fetch", routed(fetchMock));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const calls = () => fetchMock.mock.calls.map(([url, init]) => `${(init as RequestInit).method} ${String(url)}`);
  const bodyOf = (index: number) => JSON.parse(String((fetchMock.mock.calls[index][1] as RequestInit).body));
  const kept = (revision: number) => json({ revision, updatedAt: "2026-01-01T00:00:00Z" });
  const save = (state: GameState, revision: number) => json({ save: { state, revision, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES } });
  /** A game played far enough that it never gives way without a choice. */
  const played = (createdAt: number, maxStageEver = 42): GameState => ({ ...createInitialState(createdAt), maxStageEver });

  /** A guest whose game the server keeps, loaded as a reload would. */
  async function guestReloaded(state = played(Date.now() - 3_600_000)) {
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: true })).mockResolvedValueOnce(save(state, 3));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    return { store, cloud };
  }

  it("finds the guest's game again after a reload, and saves on top of it", async () => {
    const { store, cloud } = await guestReloaded();
    expect(calls()).toEqual(["GET /api/auth/me", "POST /api/save/guest/open"]);
    expect(cloud.user).toBeNull();
    expect(store.state.maxStageEver).toBe(42);
    expect(cloud.revision).toBe(3);
    expect(cloud.status).toBe("synced");
    expect(cloud.wouldLose()).toBe(false);

    fetchMock.mockResolvedValueOnce(kept(4));
    await cloud.sync();
    expect(calls()[2]).toBe("PUT /api/save/guest");
    expect(bodyOf(2)).toMatchObject({ baseRevision: 3, replace: false, state: { maxStageEver: 42 } });
    expect(cloud.revision).toBe(4);
    cloud.dispose();
  });

  it("keeps nothing of a page merely opened, and the game from its first blow", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: false })).mockResolvedValueOnce(json({ save: null }));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    await cloud.sync();
    await cloud.sync({ keepalive: true });
    expect(calls()).toHaveLength(2);

    store.state.lifetime.clicks += 1;
    fetchMock.mockResolvedValueOnce(kept(1));
    await cloud.sync();
    expect(calls()[2]).toBe("PUT /api/save/guest");
    expect(bodyOf(2).baseRevision).toBeNull();
    expect(cloud.status).toBe("synced");
    expect(cloud.revision).toBe(1);
    cloud.dispose();
  });

  it("brings the guest's game to a new account as its first save", async () => {
    const { store, cloud } = await guestReloaded();
    const lineage = store.state.createdAt;
    fetchMock.mockResolvedValueOnce(json({ save: null })).mockResolvedValueOnce(kept(1));
    await cloud.connect(USER);
    expect(calls().slice(2, 4)).toEqual(["POST /api/save/open", "PUT /api/save"]);
    expect(bodyOf(3)).toMatchObject({ baseRevision: null, state: { createdAt: lineage, maxStageEver: 42 } });
    expect(cloud.pendingChoice).toBeNull();
    expect(cloud.revision).toBe(1);
    cloud.dispose();
  });

  it("asks before the guest's game and an account's replace one another, then lets go of the other", async () => {
    // Kept as the guest's: the account's game is replaced only after the choice.
    const first = await guestReloaded();
    const account = played(Date.now() - 7_200_000, 12);
    fetchMock.mockResolvedValueOnce(save(account, 9));
    await first.cloud.connect(USER);
    expect(first.cloud.pendingChoice?.revision).toBe(9);
    expect(first.store.state.maxStageEver).toBe(42);
    expect(calls().slice(2)).toEqual(["POST /api/save/open"]);
    await first.cloud.sync();
    expect(calls()).toHaveLength(3);
    fetchMock.mockResolvedValueOnce(kept(10));
    await first.cloud.resolveChoice("local");
    expect(calls().slice(3)).toEqual(["PUT /api/save", "DELETE /api/save/guest"]);
    expect(bodyOf(3)).toMatchObject({ baseRevision: 9, replace: true, state: { maxStageEver: 42 } });
    first.cloud.dispose();

    // The account's game is taken: the guest's is let go, and nothing is written over either.
    fetchMock.mockClear();
    const second = await guestReloaded();
    fetchMock.mockResolvedValueOnce(save(account, 9));
    await second.cloud.connect(USER);
    fetchMock.mockResolvedValueOnce(save(account, 9));
    await second.cloud.resolveChoice("cloud");
    expect(second.store.state.maxStageEver).toBe(12);
    expect(second.cloud.revision).toBe(9);
    // Taken as the server keeps it, even from a page that plays it right now.
    expect(calls().slice(2)).toEqual(["POST /api/save/open", "POST /api/save/open", "DELETE /api/save/guest"]);
    expect(bodyOf(3)).toMatchObject({ holder: second.cloud.holder, force: true });
    second.cloud.dispose();
  });

  it("offers the choice again when a signed-in page still carries a guest's game", async () => {
    const guestGame = played(Date.now() - 3_600_000);
    const account = played(Date.now() - 7_200_000, 12);
    fetchMock
      .mockResolvedValueOnce(json({ user: USER, guest: true }))
      .mockResolvedValueOnce(save(guestGame, 3))
      .mockResolvedValueOnce(save(account, 9));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    expect(calls()).toEqual(["GET /api/auth/me", "GET /api/save/guest", "POST /api/save/open"]);
    expect(store.state.maxStageEver).toBe(42);
    expect(cloud.pendingChoice?.revision).toBe(9);
    cloud.dispose();
  });

  it("replaces the kept game when the guest starts over, and only then", async () => {
    const { store, cloud } = await guestReloaded();
    fetchMock.mockResolvedValueOnce(kept(4));
    void cloud.newGame();
    await vi.waitFor(() => expect(cloud.revision).toBe(4));
    expect(calls()[2]).toBe("PUT /api/save/guest");
    expect(bodyOf(2)).toMatchObject({ baseRevision: 3, replace: true, state: { maxStageEver: 1 } });
    expect(store.state.maxStageEver).toBe(1);
    // The next save carries the new game on, without replacing anything.
    store.state.lifetime.clicks += 1;
    fetchMock.mockResolvedValueOnce(kept(5));
    await cloud.sync();
    expect(bodyOf(3)).toMatchObject({ baseRevision: 4, replace: false });
    cloud.dispose();
  });

  it("never keeps an account's game as a guest's once the session ended", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: USER, guest: false })).mockResolvedValueOnce(save(played(Date.now() - 3_600_000), 7));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ error: "login required" }, 401));
    await cloud.sync();
    expect(cloud.user).toBeNull();
    expect(cloud.status).toBe("offline");
    expect(cloud.wouldLose()).toBe(true);
    // Nothing more is sent, least of all to the guest's ledger.
    await cloud.sync();
    await cloud.sync({ keepalive: true });
    cloud.requestSave();
    expect(calls()).toEqual(["GET /api/auth/me", "POST /api/save/open", "PUT /api/save"]);
    cloud.dispose();
  });

  it("never gives an account's game to another account signed in after its session ended", async () => {
    const accountGame = played(Date.now() - 3_600_000, 2859);
    fetchMock.mockResolvedValueOnce(json({ user: USER, guest: false })).mockResolvedValueOnce(save(accountGame, 7));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ error: "login required" }, 401));
    await cloud.sync();
    // A new account, signed up without reloading: it starts from a new game of its own.
    fetchMock.mockResolvedValueOnce(json({ save: null, elsewhere: false })).mockResolvedValueOnce(kept(1));
    await cloud.connect({ ...USER, id: "u2", username: "other" });
    expect(store.state.maxStageEver).toBe(1);
    expect(bodyOf(4).state.createdAt).not.toBe(accountGame.createdAt);
    expect(bodyOf(4).state.maxStageEver).toBe(1);
    cloud.dispose();
  });

  it("keeps what was played after the session ended when the same account signs in again", async () => {
    const accountGame = played(Date.now() - 3_600_000, 2859);
    fetchMock.mockResolvedValueOnce(json({ user: USER, guest: false })).mockResolvedValueOnce(save(accountGame, 7));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ error: "login required" }, 401));
    await cloud.sync();
    store.state.gold = 12345;
    // Nothing was saved meanwhile: the game in hand carries on from revision 7.
    fetchMock.mockResolvedValueOnce(json({ save: { state: accountGame, revision: 7, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES }, elsewhere: false })).mockResolvedValueOnce(kept(8));
    await cloud.connect(USER);
    expect(calls().slice(3)).toEqual(["POST /api/save/open", "PUT /api/save"]);
    expect(bodyOf(4)).toMatchObject({ baseRevision: 7, replace: false });
    expect(store.state.gold).toBe(12345);
    expect(cloud.revision).toBe(8);
    expect(cloud.status).toBe("synced");
    cloud.dispose();
  });

  it("takes the account's newer save when it moved on while this page's session was over", async () => {
    const accountGame = played(Date.now() - 3_600_000, 2859);
    fetchMock.mockResolvedValueOnce(json({ user: USER, guest: false })).mockResolvedValueOnce(save(accountGame, 7));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ error: "login required" }, 401));
    await cloud.sync();
    // Played on another device meanwhile: its save is the one kept.
    fetchMock.mockResolvedValueOnce(save({ ...accountGame, maxStageEver: 2900 }, 9));
    await cloud.connect(USER);
    expect(store.state.maxStageEver).toBe(2900);
    expect(cloud.revision).toBe(9);
    expect(calls().slice(3)).toEqual(["POST /api/save/open"]);
    cloud.dispose();
  });

  it("gives a guest who signed out the game this browser still carried", async () => {
    // Signed in with a choice left open: the guest's game is still on the server.
    const guestGame = played(Date.now() - 3_600_000);
    fetchMock
      .mockResolvedValueOnce(json({ user: USER, guest: true }))
      .mockResolvedValueOnce(save(guestGame, 3))
      .mockResolvedValueOnce(save(played(Date.now() - 7_200_000, 12), 9));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    fetchMock.mockResolvedValueOnce(json({ ok: true })).mockResolvedValueOnce(save(guestGame, 3));
    await cloud.logout();
    expect(calls().slice(3)).toEqual(["POST /api/auth/logout", "POST /api/save/guest/open"]);
    expect(cloud.user).toBeNull();
    expect(cloud.pendingChoice).toBeNull();
    expect(store.state.maxStageEver).toBe(42);
    expect(cloud.revision).toBe(3);
    cloud.dispose();
  });
});

describe("CloudSync with the game open on another page", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stubBrowser();
    fetchMock = vi.fn(async () => json({ ok: true }));
    vi.stubGlobal("fetch", routed(fetchMock));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const calls = () => fetchMock.mock.calls.map(([url, init]) => `${(init as RequestInit).method} ${String(url)}`);
  const bodyOf = (index: number) => JSON.parse(String((fetchMock.mock.calls[index][1] as RequestInit).body));
  const kept = (revision: number) => json({ revision, updatedAt: "2026-01-01T00:00:00Z" });
  const opened = (state: GameState, revision: number, elsewhere = false) =>
    json({ save: { state, revision, updatedAt: "2026-01-01T00:00:00Z", elapsedMs: 0, fates: FATES }, elsewhere });
  const played = (maxStageEver: number): GameState => ({ ...createInitialState(Date.now() - 3_600_000), maxStageEver });

  async function signedIn(state: GameState, revision: number, elsewhere = false) {
    fetchMock.mockResolvedValueOnce(json({ user: USER })).mockResolvedValueOnce(opened(state, revision, elsewhere));
    const store = new GameStore(createInitialState());
    const cloud = new CloudSync(store);
    await cloud.init();
    return { store, cloud };
  }

  it("shows the game standing still when another page plays it, and takes it over only when asked", async () => {
    const { store, cloud } = await signedIn(played(42), 5, true);
    expect(calls()).toEqual(["GET /api/auth/me", "POST /api/save/open"]);
    expect(bodyOf(1)).toEqual({ holder: cloud.holder, force: false });
    expect(cloud.elsewhere).toBe("open");
    expect(store.state.maxStageEver).toBe(42);
    // Nothing leaves while the other page plays: it would be refused, and is not this page's to send.
    await cloud.sync({ force: true });
    await cloud.sync({ keepalive: true });
    cloud.requestSave();
    expect(cloud.keepsGame()).toBe(false);
    expect(calls()).toHaveLength(2);

    // The other page saved meanwhile: the walker plays here from that save on.
    fetchMock.mockResolvedValueOnce(opened(played(44), 6));
    await cloud.takeOver();
    store.stop();
    expect(bodyOf(2)).toEqual({ holder: cloud.holder, force: true });
    expect(cloud.elsewhere).toBeNull();
    expect(store.state.maxStageEver).toBe(44);
    expect(cloud.revision).toBe(6);
    fetchMock.mockResolvedValueOnce(kept(7));
    await cloud.sync();
    expect(calls()[3]).toBe("PUT /api/save");
    expect(bodyOf(3)).toMatchObject({ baseRevision: 6, holder: cloud.holder, release: false });
    cloud.dispose();
  });

  it("stops at once when another page took the game over, and sends nothing more", async () => {
    const { store, cloud } = await signedIn(played(42), 5);
    store.start();
    fetchMock.mockResolvedValueOnce(json({ error: "game_elsewhere" }, 409));
    await cloud.sync();
    expect(cloud.elsewhere).toBe("taken");
    expect(cloud.wouldLose()).toBe(false);
    // The loop stopped: the game no longer moves here.
    const tick = store.state.lastTickAt;
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(store.state.lastTickAt).toBe(tick);
    await cloud.sync({ force: true });
    cloud.resume();
    expect(calls()).toEqual(["GET /api/auth/me", "POST /api/save/open", "PUT /api/save"]);
    cloud.dispose();
  });

  it("keeps the game and lets it go when the walker leaves for another page of the site", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key)
    });
    const { store, cloud } = await signedIn(played(42), 5);
    store.start();
    fetchMock.mockResolvedValueOnce(kept(6));
    cloud.depart();
    await vi.waitFor(() => expect(calls()).toHaveLength(3));
    expect(bodyOf(2)).toMatchObject({ holder: cloud.holder, release: true });
    // Coming back in this tab is the same page.
    expect(new CloudSync(new GameStore(createInitialState())).holder).toBe(cloud.holder);
  });

  it("lets the game go when the page is out of sight, so another page opens it without asking", async () => {
    const { cloud } = await signedIn(played(42), 5);
    (document as { visibilityState: string }).visibilityState = "hidden";
    fetchMock.mockResolvedValueOnce(kept(6));
    await cloud.sync({ keepalive: true });
    expect(bodyOf(2)).toMatchObject({ holder: cloud.holder, release: true });
    cloud.dispose();
  });

  it("gives each page its own id, and a reloaded page its previous one", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key)
    });
    const first = new CloudSync(new GameStore(createInitialState()));
    const second = new CloudSync(new GameStore(createInitialState()));
    expect(first.holder).not.toBe(second.holder);
    expect(first.holder.length).toBeGreaterThanOrEqual(16);
    // The page reloads: its id waits in this tab's storage for the next load, and only for it.
    fetchMock.mockResolvedValueOnce(json({ user: null, guest: false })).mockResolvedValueOnce(json({ save: null, elsewhere: false }));
    await first.init();
    window.dispatchEvent(new Event("pagehide"));
    first.dispose();
    const reloaded = new CloudSync(new GameStore(createInitialState()));
    expect(reloaded.holder).toBe(first.holder);
    expect(new CloudSync(new GameStore(createInitialState())).holder).not.toBe(first.holder);
  });
});
