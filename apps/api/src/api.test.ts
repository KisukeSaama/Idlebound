/**
 * API integration tests against a real Postgres.
 * They run when TEST_DATABASE_URL is set (CI job, or locally with compose.dev.yml):
 *   TEST_DATABASE_URL=postgres://idlebound:idlebound@localhost:5432/idlebound_test npm test
 */
import { GameEngine, JournalWriter, SAVE_VERSION, createInitialState, migrateState, seededRng, validateUsername, windowFates, type FateWindow, type GameState, type Journal, type JournalBase } from "@idlebound/game";
import type { Pace } from "@idlebound/game/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";

const url = process.env.TEST_DATABASE_URL;
const suite = url ? describe : describe.skip;

type App = { request: (path: string, init?: RequestInit) => Response | Promise<Response> };

let app: App;
let closeDb: () => Promise<void>;
let sql: typeof import("./db/client").sql;

async function ensureDatabase(target: string) {
  const parsed = new URL(target);
  const name = parsed.pathname.slice(1);
  parsed.pathname = "/postgres";
  const admin = postgres(parsed.toString(), { max: 1, onnotice: () => {} });
  try {
    const rows = await admin`select 1 from pg_database where datname = ${name}`;
    if (rows.length === 0) await admin.unsafe(`create database "${name}"`);
  } finally {
    await admin.end();
  }
}

class Client {
  /** Cookies the API set, by name: a session and a guest's game can ride together. */
  private jar = new Map<string, string>();
  /** The `Set-Cookie` headers of the last answer, attributes included. */
  lastSetCookies: string[] = [];
  constructor(private ip: string) {}

  get cookie() {
    return [...this.jar].map(([name, value]) => `${name}=${value}`).join("; ");
  }

  has(name: string) {
    return this.jar.has(name);
  }

  value(name: string) {
    return this.jar.get(name);
  }

  async call(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
    const response = await app.request(path, {
      method,
      headers: {
        "content-type": "application/json",
        "x-idlebound": "1",
        "cf-connecting-ip": this.ip,
        // Network peer = a Cloudflare node, so the API trusts cf-connecting-ip.
        "x-forwarded-for": "173.245.48.10",
        ...(this.jar.size > 0 ? { cookie: this.cookie } : {}),
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    this.lastSetCookies = response.headers.getSetCookie();
    for (const line of this.lastSetCookies) {
      const pair = line.split(";")[0];
      const name = pair.slice(0, pair.indexOf("="));
      const value = pair.slice(pair.indexOf("=") + 1);
      // A deleted cookie comes back empty.
      if (value) this.jar.set(name, value);
      else this.jar.delete(name);
    }
    const json = await response.json().catch(() => ({}));
    return { status: response.status, json: json as Record<string, any>, retryAfter: response.headers.get("retry-after") };
  }
}

const unique = Date.now().toString(36);

/** A unique username the moderation accepts: a random suffix can spell a reserved word ("Hero0t" holds "root"). */
function freshName(prefix: string, length = 6): string {
  for (let seed = Date.now(); ; seed += 1) {
    const name = `${prefix}${seed.toString(36).slice(-length)}`;
    if (validateUsername(name).ok) return name;
  }
}

function playedState(minutes: number, before = 0): GameState {
  const start = Date.now() - before - minutes * 60_000 - 5_000;
  const engine = new GameEngine(createInitialState(start), seededRng(9), start);
  let now = start;
  for (let step = 0; step < minutes * 600; step += 1) {
    now += 100;
    if (step % 2 === 0) engine.click(now);
    engine.tick(now);
    if (step % 10 === 0) {
      engine.buyAllUpgrades(now);
      engine.buyHero("maelle", 1, now);
      engine.buyHero("aldric", 1, now);
    }
  }
  return structuredClone(engine.state);
}


/**
 * A page playing a game the server began or keeps: commands at the last step, a journal, a mark
 * at each save (as the game's store does).
 */
class PlayingPage {
  engine: GameEngine;
  private writer: JournalWriter;
  private head: Omit<Journal, "entries" | "end">;
  private sent = 0;

  constructor(state: GameState, base: JournalBase, fates: FateWindow, now: number) {
    state.lastTickAt = Math.max(state.lastTickAt, now);
    this.engine = new GameEngine(state, windowFates(fates), now);
    this.engine.afkAfterMs = null;
    this.engine.markInput(now);
    this.writer = new JournalWriter(state.lastTickAt);
    this.writer.attach(this.engine);
    this.head = { base, open: { at: now, skipTo: now, afkAfterMs: null, locale: "fr", visible: true }, start: state.lastTickAt };
  }

  /** Plays `seconds` from the last step: ticks of 100 ms, a click every other one, crystals caught. */
  play(seconds: number) {
    let now = this.engine.state.lastTickAt;
    for (let step = 0; step < seconds * 10; step += 1) {
      now += 100;
      this.engine.tick(now);
      const at = this.engine.state.lastTickAt;
      if (step % 2 === 0) this.engine.perform({ type: "click", count: 1 }, at);
      if (this.engine.state.crystal) this.engine.perform({ type: "crystal" }, at);
      if (step % 10 === 0) this.engine.perform({ type: "hero", id: "aldric", mode: 1 }, at);
    }
  }

  /** What the next save sends. */
  outgoing(): { state: GameState; journal: Journal } {
    const at = this.engine.state.lastTickAt;
    this.writer.mark(at);
    this.engine.refresh(at);
    this.sent = this.writer.entries.length;
    return { state: structuredClone(this.engine.state), journal: { ...this.head, entries: [...this.writer.entries], end: at } };
  }

  /** The server kept the save as `revision`: the journal goes on from there. */
  kept(revision: number, fates: FateWindow) {
    const end = this.engine.state.lastTickAt;
    this.writer.drop(this.sent, end);
    this.head = { base: { revision, createdAt: this.engine.state.createdAt, ...(this.head.base.guest ? { guest: true } : {}) }, start: end };
    this.engine.fates = windowFates(fates);
  }
}

suite("API (real Postgres)", () => {
  beforeAll(async () => {
    await ensureDatabase(url!);
    process.env.DATABASE_URL = url;
    process.env.NODE_ENV = "test";
    const { runMigrations } = await import("./migrate");
    await runMigrations(3);
    const { createApp } = await import("./app");
    ({ sql } = await import("./db/client"));
    app = createApp();
    closeDb = () => sql.end();
  }, 60_000);

  afterAll(async () => {
    await closeDb?.();
  });

  it("answers the healthcheck", async () => {
    const response = await app.request("/health");
    expect(response.status).toBe(200);
  });

  it("refuses a request without the anti-CSRF header", async () => {
    const response = await app.request("/auth/login", { method: "POST", body: "{}", headers: { "content-type": "application/json" } });
    expect(response.status).toBe(403);
  });

  it("refuses offensive usernames and weak passwords", async () => {
    const client = new Client("10.0.0.1");
    const offensive = await client.call("POST", "/auth/register", { email: `a${unique}@test.fr`, username: "C0nn4rd", password: "unBonMotDePasse!" });
    expect(offensive.status).toBe(400);
    expect(offensive.json.field).toBe("username");
    const weak = await client.call("POST", "/auth/register", { email: `a${unique}@test.fr`, username: freshName("Hero", 5), password: "password" });
    expect(weak.status).toBe(400);
    expect(weak.json.field).toBe("password");
  });

  it("handles a full journey: sign-up, save, cheat, leaderboard, deletion", async () => {
    const client = new Client("10.0.0.2");
    const username = freshName("Hero");
    const email = `${unique}@idlebound.test`;

    const register = await client.call("POST", "/auth/register", { email, username, password: "Un-Mot-De-Passe-Solide" });
    expect(register.status).toBe(201);
    expect(client.cookie).toMatch(/^ib_session=/);

    const duplicate = await new Client("10.0.0.3").call("POST", "/auth/register", { email: `x${email}`, username: username.toUpperCase(), password: "Un-Mot-De-Passe-Solide" });
    expect(duplicate.status).toBe(409);

    const me = await client.call("GET", "/auth/me");
    expect(me.json.user.username).toBe(username);

    // First honest save.
    const state = playedState(3);
    const first = await client.call("PUT", "/save", { state, baseRevision: null });
    expect(first.status, JSON.stringify(first.json)).toBe(200);
    expect(first.json.revision).toBe(1);

    // Wrong revision: conflict.
    const conflict = await client.call("PUT", "/save", { state, baseRevision: 42 });
    expect(conflict.status).toBe(409);

    // Cheat: gold out of nowhere.
    const cheated = structuredClone(state);
    cheated.gold = 1e30;
    const rejected = await client.call("PUT", "/save", { state: cheated, baseRevision: 1 });
    expect(rejected.status).toBe(422);
    expect(rejected.json.violations.length).toBeGreaterThan(0);

    // New game on the same revision: never a silent overwrite.
    const otherGame = await client.call("PUT", "/save", { state: createInitialState(), baseRevision: 1 });
    expect(otherGame.status).toBe(409);

    const cloud = await client.call("GET", "/save");
    expect(cloud.json.save.revision).toBe(1);
    expect(cloud.json.save.state.gold).toBe(state.gold);

    const board = await client.call("GET", "/leaderboard");
    expect(board.status).toBe(200);
    expect(board.json.me).toEqual({ rank: expect.any(Number), username: board.json.me.username, value: state.maxStageEver, maxStage: state.maxStageEver, reachedAt: expect.any(String) });
    expect(board.json.me.rank).toBeGreaterThanOrEqual(1);
    expect(board.json.around).toContainEqual(board.json.me);
    // A tally the walker has none of yet: no place on it.
    const weavings = await client.call("GET", "/leaderboard?board=weavings");
    expect(weavings.status).toBe(200);
    expect(weavings.json.me).toBeNull();

    // Log out, then log in.
    await client.call("POST", "/auth/logout");
    expect((await client.call("GET", "/auth/me")).json.user).toBeNull();
    const wrong = await client.call("POST", "/auth/login", { email, password: "mauvais-mot-de-passe" });
    expect(wrong.status).toBe(401);
    const login = await client.call("POST", "/auth/login", { email: email.toUpperCase(), password: "Un-Mot-De-Passe-Solide" });
    expect(login.status).toBe(200);

    // Account deletion: password required.
    expect((await client.call("DELETE", "/auth/account", { password: "faux" })).status).toBe(401);
    expect((await client.call("DELETE", "/auth/account", { password: "Un-Mot-De-Passe-Solide" })).status).toBe(200);
    expect((await client.call("GET", "/auth/me")).json.user).toBeNull();
  }, 60_000);

  it("refunds the altars of a version 3 save once, and never for a save relabelled older", async () => {
    const client = new Client("10.0.0.9");
    const register = await client.call("POST", "/auth/register", { email: `fate${unique}@idlebound.test`, username: freshName("Fate"), password: "Un-Mot-De-Passe-Solide" });
    expect(register.status).toBe(201);

    // A save from before the altar rework (version 3): 4 levels of the Altar of Fate bought
    // at the old linear price (2 + 4 + 6 + 8 = 20 essences), paid by thirty crystals.
    const legacy: Record<string, any> = playedState(3);
    legacy.version = 3;
    legacy.lifetime.crystals = 30;
    legacy.lifetime.essencesEarned = 30;
    delete legacy.lifetime.ascensionEssences;
    legacy.altars.fate = 4;
    legacy.essences = 30 - 20;

    const first = await client.call("PUT", "/save", { state: legacy, baseRevision: null });
    expect(first.status, JSON.stringify(first.json)).toBe(200);
    const cloud = await client.call("GET", "/save");
    expect(cloud.json.save.state.version).toBe(SAVE_VERSION);
    expect(cloud.json.save.state.altars).toEqual({});
    expect(cloud.json.save.state.essences).toBe(30);

    // The same game relabelled older, altars bought again: the refund must not run twice.
    const relabelled = { ...cloud.json.save.state, version: 3, altars: { fate: 2 }, essences: 30 - 6 };
    const again = await client.call("PUT", "/save", { state: relabelled, baseRevision: first.json.revision });
    expect(again.status, JSON.stringify(again.json)).toBe(422);
    expect(again.json.violations.map((violation: { code: string }) => violation.code)).toContain("version");
    const after = await client.call("GET", "/save");
    expect(after.json.save.revision).toBe(first.json.revision);
    expect(after.json.save.state.essences).toBe(30);
  }, 60_000);

  it("bounds a game replacing the account's by the time the account really lived", async () => {
    const client = new Client("10.0.0.30");
    expect((await client.call("POST", "/auth/register", { email: `lineage-${unique}@idlebound.test`, username: freshName("Lin"), password: "Un-Mot-De-Passe-Solide" })).status).toBe(201);
    const first = await client.call("PUT", "/save", { state: playedState(2), baseRevision: null });
    expect(first.status, JSON.stringify(first.json)).toBe(200);

    // Another game, dated three weeks back, claims twenty days away: the account lived minutes.
    const forged = createInitialState(Date.now() - 21 * 86_400_000);
    forged.lifetime.offlineSeconds = 20 * 86_400;
    const replaced = await client.call("PUT", "/save", { state: forged, baseRevision: first.json.revision, replace: true });
    expect(replaced.status, JSON.stringify(replaced.json)).toBe(422);
    expect(replaced.json.violations.map((violation: { code: string }) => violation.code)).toContain("lineage-time");

    // A game no older than the account's own is welcome.
    const honest = await client.call("PUT", "/save", { state: playedState(1), baseRevision: first.json.revision, replace: true });
    expect(honest.status, JSON.stringify(honest.json)).toBe(200);
  }, 60_000);

  it("credits a closed game the time the server saw pass since its save, never more", async () => {
    const client = new Client("10.0.0.32");
    const username = freshName("Clo");
    expect((await client.call("POST", "/auth/register", { email: `closed-${unique}@idlebound.test`, username, password: "Un-Mot-De-Passe-Solide" })).status).toBe(201);
    // Two minutes played, eight hours ago; the game was closed since.
    const first = await client.call("PUT", "/save", { state: playedState(2, 8 * 3_600_000), baseRevision: null });
    expect(first.status, JSON.stringify(first.json)).toBe(200);
    await sql`update saves set updated_at = updated_at - interval '8 hours' where user_id = (select id from users where username = ${username})`;

    // Opened again: the server tells how long it saw pass, the game catches it up and saves.
    const cloud = await client.call("GET", "/save");
    expect(cloud.json.save.elapsedMs).toBeGreaterThanOrEqual(8 * 3_600_000);
    const engine = new GameEngine(migrateState(cloud.json.save.state) as GameState, seededRng(4));
    const now = Date.now();
    engine.state.lastTickAt = Math.max(engine.state.lastTickAt, now - cloud.json.save.elapsedMs);
    expect(engine.tick(now)?.seconds).toBe(8 * 3600);
    const honest = await client.call("PUT", "/save", { state: engine.state, baseRevision: first.json.revision });
    expect(honest.status, JSON.stringify(honest.json)).toBe(200);

    // Right after, the same game claims another hour away: the server saw seconds pass.
    const greedy = structuredClone(engine.state);
    greedy.lifetime.offlineSeconds += 3600;
    const refused = await client.call("PUT", "/save", { state: greedy, baseRevision: honest.json.revision });
    expect(refused.status, JSON.stringify(refused.json)).toBe(422);
    expect(refused.json.violations.map((violation: { code: string }) => violation.code)).toContain("time");
  }, 60_000);

  it("keeps the first of two first saves sent at once, the other a conflict", async () => {
    const client = new Client("10.0.0.31");
    expect((await client.call("POST", "/auth/register", { email: `race-${unique}@idlebound.test`, username: freshName("Rac"), password: "Un-Mot-De-Passe-Solide" })).status).toBe(201);
    const [a, b] = await Promise.all([
      client.call("PUT", "/save", { state: playedState(1), baseRevision: null }),
      client.call("PUT", "/save", { state: playedState(2), baseRevision: null })
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
    const cloud = await client.call("GET", "/save");
    expect(cloud.json.save.revision).toBe(1);
  }, 60_000);

  it("lets one page at a time play a game, and another take it over when asked", async () => {
    const email = `hold-${unique}@idlebound.test`;
    const password = "Un-Mot-De-Passe-Solide";
    const desk = new Client("10.0.0.41");
    expect((await desk.call("POST", "/auth/register", { email, username: freshName("Hol"), password })).status).toBe(201);
    const phone = new Client("10.0.0.42");
    expect((await phone.call("POST", "/auth/login", { email, password })).status).toBe(200);
    const deskPage = "desk-page-00000000001";
    const phonePage = "phone-page-0000000001";
    const state = playedState(2);

    // Nothing kept yet: nothing to open. The desk's first save holds the game.
    expect((await desk.call("POST", "/save/open", { holder: deskPage })).json).toEqual({ save: null, elsewhere: false });
    expect((await desk.call("PUT", "/save", { state, baseRevision: null, holder: deskPage })).status).toBe(200);

    // The phone opens it while the desk plays: it is asked, and nothing changes.
    const asked = await phone.call("POST", "/save/open", { holder: phonePage });
    expect(asked.json).toMatchObject({ elsewhere: true, save: { revision: 1 } });
    expect((await desk.call("PUT", "/save", { state, baseRevision: 1, holder: deskPage })).status).toBe(200);

    // Played here: the phone takes the game as the server keeps it, the desk stops at its next save.
    expect((await phone.call("POST", "/save/open", { holder: phonePage, force: true })).json).toMatchObject({ elsewhere: false, save: { revision: 2 } });
    const stopped = await desk.call("PUT", "/save", { state, baseRevision: 2, holder: deskPage });
    expect(stopped.status).toBe(409);
    expect(stopped.json.error).toBe("game_elsewhere");
    expect((await phone.call("PUT", "/save", { state, baseRevision: 2, holder: phonePage })).json.revision).toBe(3);

    // Out of sight, the phone keeps the game and lets it go: the desk opens it without a question.
    expect((await phone.call("PUT", "/save", { state, baseRevision: 3, holder: phonePage, release: true })).status).toBe(200);
    expect((await desk.call("POST", "/save/open", { holder: deskPage })).json).toMatchObject({ elsewhere: false, save: { revision: 4 } });
    // A page silent past the hold (closed, asleep) holds nothing either.
    await sql`update saves set held_at = now() - interval '3 minutes' where holder = ${deskPage}`;
    expect((await phone.call("POST", "/save/open", { holder: phonePage })).json.elsewhere).toBe(false);
    // An id the server cannot trust to be a page's is refused.
    expect((await phone.call("POST", "/save/open", { holder: "x" })).status).toBe(400);
  }, 60_000);

  it("asks a guest's second page too, and finds nothing without a guest's game", async () => {
    const guest = new Client("10.0.1.40");
    const state = playedState(2);
    expect((await guest.call("POST", "/save/guest/open", { holder: "guest-page-0000000001" })).json).toEqual({ save: null, elsewhere: false });
    expect((await guest.call("PUT", "/save/guest", { state, baseRevision: null, holder: "guest-page-0000000001" })).status).toBe(200);
    expect((await guest.call("POST", "/save/guest/open", { holder: "guest-page-0000000002" })).json).toMatchObject({ elsewhere: true, save: { revision: 1 } });
    expect((await guest.call("POST", "/save/guest/open", { holder: "guest-page-0000000002", force: true })).json.elsewhere).toBe(false);
    expect((await guest.call("PUT", "/save/guest", { state, baseRevision: 1, holder: "guest-page-0000000001" })).json.error).toBe("game_elsewhere");
  }, 60_000);

  describe("guest games", () => {
    const password = "Un-Mot-De-Passe-Solide";
    const codes = (answer: { json: Record<string, any> }) => answer.json.violations.map((violation: { code: string }) => violation.code);
    /** The row of the guest game a client carries. */
    async function guestRow(client: Client) {
      const { hashToken } = await import("./lib/session");
      const [row] = await sql`select id, revision, last_seen_at, pace from guest_saves where id = ${hashToken(client.value("ib_guest") ?? "")}`;
      return row as { id: string; revision: number; last_seen_at: string; pace: Pace | null } | undefined;
    }

    it("keeps a guest's game under an httpOnly cookie and gives it back on reload, off the leaderboard", async () => {
      const guest = new Client("10.0.1.1");
      // Nothing kept yet: no cookie, no game.
      expect((await guest.call("GET", "/save/guest")).json.save).toBeNull();
      expect(guest.has("ib_guest")).toBe(false);
      expect((await guest.call("GET", "/auth/me")).json).toEqual({ user: null, guest: false });

      const [{ ranked: before }] = await sql`select count(*)::int as ranked from leaderboard`;
      const state = playedState(2);
      const first = await guest.call("PUT", "/save/guest", { state, baseRevision: null });
      expect(first.status, JSON.stringify(first.json)).toBe(200);
      expect(first.json.revision).toBe(1);
      expect(guest.lastSetCookies.join()).toMatch(/^ib_guest=[^;]+;.*HttpOnly/i);

      // The page reloads: the same browser finds its game again, and saves on top of it.
      const reloaded = await guest.call("GET", "/save/guest");
      expect(reloaded.json.save.revision).toBe(1);
      expect(reloaded.json.save.state.gold).toBe(state.gold);
      expect(reloaded.json.save.elapsedMs).toBeGreaterThanOrEqual(0);
      expect((await guest.call("GET", "/auth/me")).json).toEqual({ user: null, guest: true });
      expect((await guest.call("PUT", "/save/guest", { state, baseRevision: 1 })).json.revision).toBe(2);

      // No account: no rank, and the account's routes stay closed.
      const [{ ranked: after }] = await sql`select count(*)::int as ranked from leaderboard`;
      expect(after).toBe(before);
      expect((await guest.call("GET", "/leaderboard")).json.me).toBeNull();
      expect((await guest.call("GET", "/save")).status).toBe(401);
      expect((await guest.call("PUT", "/save", { state, baseRevision: null })).status).toBe(401);

      // Another browser sees nothing of it, and a forged cookie opens nothing.
      expect((await new Client("10.0.1.1").call("GET", "/save/guest")).json.save).toBeNull();
      const forged = await new Client("10.0.1.1").call("GET", "/save/guest", undefined, { cookie: "ib_guest=not-a-real-token-not-a-real-token" });
      expect(forged.json.save).toBeNull();
    }, 60_000);

    it("never overwrites a guest's game silently: another page or a new game is a choice", async () => {
      const guest = new Client("10.0.1.2");
      const state = playedState(2);
      expect((await guest.call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
      // A page that did not see the last save.
      const stale = await guest.call("PUT", "/save/guest", { state, baseRevision: 7 });
      expect(stale.status).toBe(409);
      expect(stale.json.conflict.revision).toBe(1);
      // A new game over the kept one: refused unless the guest asked for it.
      const fresh = createInitialState();
      expect((await guest.call("PUT", "/save/guest", { state: fresh, baseRevision: 1 })).status).toBe(409);
      const replaced = await guest.call("PUT", "/save/guest", { state: fresh, baseRevision: 1, replace: true });
      expect(replaced.status, JSON.stringify(replaced.json)).toBe(200);
      expect((await guest.call("GET", "/save/guest")).json.save.state.createdAt).toBe(fresh.createdAt);
    }, 60_000);

    it("holds a guest's game to the same anti-cheat, and logs what it refuses", async () => {
      const guest = new Client("10.0.1.3");
      // A first save dated before the server could have seen it: refused, and nothing is kept.
      const ancient = await guest.call("PUT", "/save/guest", { state: createInitialState(Date.now() - 40 * 86_400_000), baseRevision: null });
      expect(ancient.status).toBe(422);
      expect(codes(ancient)).toContain("lineage-age");
      expect(guest.has("ib_guest")).toBe(false);

      const state = playedState(3);
      expect((await guest.call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
      // Gold out of nowhere.
      const cheated = structuredClone(state);
      cheated.gold = 1e30;
      const rejected = await guest.call("PUT", "/save/guest", { state: cheated, baseRevision: 1 });
      expect(rejected.status).toBe(422);
      expect(rejected.json.violations.length).toBeGreaterThan(0);
      // An hour away the server never saw pass.
      const greedy = structuredClone(state);
      greedy.lifetime.offlineSeconds += 3600;
      const refused = await guest.call("PUT", "/save/guest", { state: greedy, baseRevision: 1 });
      expect(refused.status).toBe(422);
      expect(codes(refused)).toContain("time");

      // The last accepted game is what a reload reads.
      const kept = await guest.call("GET", "/save/guest");
      expect(kept.json.save.revision).toBe(1);
      expect(kept.json.save.state.gold).toBe(state.gold);
      const row = await guestRow(guest);
      const logged = await sql`select codes from save_rejections where guest_id = ${row!.id}`;
      expect(logged).toHaveLength(2);
    }, 60_000);

    it("brings a guest's game to a new account, checked against the save the server kept", async () => {
      const client = new Client("10.0.1.4");
      const state = playedState(3);
      expect((await client.call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
      expect((await client.call("POST", "/auth/register", { email: `adopt-${unique}@idlebound.test`, username: freshName("Ado"), password })).status).toBe(201);
      expect((await client.call("GET", "/auth/me")).json.guest).toBe(true);
      expect((await client.call("GET", "/save")).json.save).toBeNull();

      // The same game with an hour nobody saw: the guest save is the witness, as between two saves.
      const greedy = structuredClone(state);
      greedy.lifetime.offlineSeconds += 3600;
      const refused = await client.call("PUT", "/save", { state: greedy, baseRevision: null });
      expect(refused.status).toBe(422);
      expect(codes(refused)).toContain("time");
      expect((await client.call("GET", "/save/guest")).json.save.revision).toBe(1);

      // The honest game becomes the account's: one game, one keeper, and a rank at last.
      const adopted = await client.call("PUT", "/save", { state, baseRevision: null });
      expect(adopted.status, JSON.stringify(adopted.json)).toBe(200);
      expect(client.has("ib_guest")).toBe(false);
      expect(client.has("ib_session")).toBe(true);
      expect((await client.call("GET", "/save/guest")).json.save).toBeNull();
      expect((await client.call("GET", "/auth/me")).json.guest).toBe(false);
      expect((await client.call("GET", "/save")).json.save.state.gold).toBe(state.gold);
      expect((await client.call("GET", "/leaderboard")).json.me.rank).toBeGreaterThanOrEqual(1);
    }, 60_000);

    it("asks before a guest's game replaces an account's, and lets go of the one not chosen", async () => {
      const email = `choice-${unique}@idlebound.test`;
      const owner = new Client("10.0.1.5");
      expect((await owner.call("POST", "/auth/register", { email, username: freshName("Cho"), password })).status).toBe(201);
      const accountGame = playedState(1);
      expect((await owner.call("PUT", "/save", { state: accountGame, baseRevision: null })).status).toBe(200);

      // Elsewhere, ten minutes played without a name, then the walker signs in.
      const browser = new Client("10.0.1.6");
      const guestGame = playedState(10);
      expect((await browser.call("PUT", "/save/guest", { state: guestGame, baseRevision: null })).status).toBe(200);
      expect((await browser.call("POST", "/auth/login", { email, password })).status).toBe(200);

      // Never a silent overwrite: both games stay where they are until the walker chooses.
      const silent = await browser.call("PUT", "/save", { state: guestGame, baseRevision: null });
      expect(silent.status).toBe(409);
      expect((await browser.call("GET", "/save")).json.save.state.createdAt).toBe(accountGame.createdAt);
      expect((await browser.call("GET", "/save/guest")).json.save.state.createdAt).toBe(guestGame.createdAt);

      // Without the guest save behind it, the same game claims more time than the account lived.
      const stranger = await owner.call("PUT", "/save", { state: guestGame, baseRevision: 1, replace: true });
      expect(stranger.status).toBe(422);
      expect(codes(stranger)).toContain("lineage-time");

      // The guest's game is chosen: the server kept it, so it replaces the account's and moves in.
      const chosen = await browser.call("PUT", "/save", { state: guestGame, baseRevision: 1, replace: true });
      expect(chosen.status, JSON.stringify(chosen.json)).toBe(200);
      expect(browser.has("ib_guest")).toBe(false);
      expect((await browser.call("GET", "/save")).json.save.state.createdAt).toBe(guestGame.createdAt);
      expect((await browser.call("GET", "/save/guest")).json.save).toBeNull();

      // The other choice: the account's game is taken, the guest's is let go.
      const other = new Client("10.0.1.7");
      expect((await other.call("PUT", "/save/guest", { state: playedState(2), baseRevision: null })).status).toBe(200);
      expect((await other.call("POST", "/auth/login", { email, password })).status).toBe(200);
      const row = await guestRow(other);
      expect((await other.call("DELETE", "/save/guest")).status).toBe(200);
      expect(other.has("ib_guest")).toBe(false);
      expect(await sql`select 1 from guest_saves where id = ${row!.id}`).toHaveLength(0);
      expect((await other.call("GET", "/save")).json.save.state.createdAt).toBe(guestGame.createdAt);
    }, 60_000);

    it("never makes a second copy of a guest's game that another page brought to an account", async () => {
      const guest = new Client("10.0.1.41");
      const state = playedState(2);
      expect((await guest.call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
      // Another page signed in and took the game: its row is gone, this page still builds on it.
      await sql`delete from guest_saves where id = ${(await guestRow(guest))!.id}`;
      const copy = await guest.call("PUT", "/save/guest", { state, baseRevision: 1 });
      expect(copy.status).toBe(409);
      expect(copy.json.error).toBe("guest_save_conflict");
    }, 60_000);

    it("never lets a second account, nor a guest, keep a copy of an account's game", async () => {
      const owner = new Client("10.0.1.43");
      expect((await owner.call("POST", "/auth/register", { email: `owner-${unique}@idlebound.test`, username: freshName("Own"), password })).status).toBe(201);
      const state = playedState(3);
      expect((await owner.call("PUT", "/save", { state, baseRevision: null })).status).toBe(200);

      // The same game sent again from a new account: refused, and never ranked twice.
      const thief = new Client("10.0.1.44");
      expect((await thief.call("POST", "/auth/register", { email: `copy-${unique}@idlebound.test`, username: freshName("Cop"), password })).status).toBe(201);
      const copy = await thief.call("PUT", "/save", { state, baseRevision: null });
      expect(copy.status).toBe(422);
      expect(codes(copy)).toContain("lineage-taken");
      expect((await thief.call("GET", "/save")).json.save).toBeNull();
      expect((await thief.call("GET", "/leaderboard")).json.me).toBeNull();

      // Over a game of its own, by explicit choice: refused the same.
      expect((await thief.call("PUT", "/save", { state: playedState(1), baseRevision: null })).status).toBe(200);
      const replaced = await thief.call("PUT", "/save", { state, baseRevision: 1, replace: true });
      expect(replaced.status).toBe(422);
      expect(codes(replaced)).toContain("lineage-taken");

      // Nor kept as a guest's, to be brought to an account later.
      const guest = new Client("10.0.1.45");
      const parked = await guest.call("PUT", "/save/guest", { state, baseRevision: null });
      expect(parked.status).toBe(422);
      expect(codes(parked)).toContain("lineage-taken");

      // The owner plays on.
      const next = structuredClone(state);
      next.lastTickAt += 1000;
      expect((await owner.call("PUT", "/save", { state: next, baseRevision: 1 })).status).toBe(200);
    }, 60_000);

    it("keeps its own ledger of a game: a record set outside any night it saw is refused", async () => {
      const guest = new Client("10.0.1.42");
      const state = playedState(3);
      expect((await guest.call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
      expect((await guestRow(guest))!.pace).toMatchObject({ proven: state.maxStage });
      // A dusk claimed with a record five hundred stages past anything the server saw.
      const forged = structuredClone(state);
      forged.lifetime.ascensions += 1;
      forged.maxStage = forged.stage = forged.runStartStage = 1;
      forged.maxStageEver = state.maxStageEver + 500;
      const refused = await guest.call("PUT", "/save/guest", { state: forged, baseRevision: 1 });
      expect(refused.status).toBe(422);
      expect(codes(refused)).toContain("record");
    }, 60_000);

    it("purges a guest's game nobody came back to for 30 days, and a visit keeps it", async () => {
      const { purgeExpired } = await import("./lib/session");
      const gone = new Client("10.0.1.8");
      const back = new Client("10.0.1.9");
      for (const client of [gone, back]) expect((await client.call("PUT", "/save/guest", { state: createInitialState(), baseRevision: null })).status).toBe(200);
      const goneRow = await guestRow(gone);
      const backRow = await guestRow(back);
      await sql`update guest_saves set last_seen_at = now() - interval '31 days' where id = ${goneRow!.id}`;
      await sql`update guest_saves set last_seen_at = now() - interval '29 days' where id = ${backRow!.id}`;

      // A visit is a reload: it counts, and the cookie slides with it.
      expect((await back.call("GET", "/save/guest")).json.save.revision).toBe(1);
      expect(back.lastSetCookies.join()).toMatch(/^ib_guest=/);
      expect(Date.now() - new Date((await guestRow(back))!.last_seen_at).getTime()).toBeLessThan(60_000);

      await purgeExpired();
      expect(await sql`select 1 from guest_saves where id = ${goneRow!.id}`).toHaveLength(0);
      expect(await sql`select 1 from guest_saves where id = ${backRow!.id}`).toHaveLength(1);
      // The purged game's cookie leads nowhere: it is dropped, and the guest starts anew.
      expect((await gone.call("GET", "/save/guest")).json.save).toBeNull();
      expect(gone.has("ib_guest")).toBe(false);
    }, 60_000);

    it("rate-limits a guest's saves per game and per address", async () => {
      // One game: six saves a minute.
      const guest = new Client("10.0.1.10");
      const state = createInitialState();
      const statuses: number[] = [];
      for (let attempt = 0; attempt < 7; attempt += 1) {
        statuses.push((await guest.call("PUT", "/save/guest", { state, baseRevision: attempt === 0 ? null : attempt })).status);
      }
      expect(statuses).toEqual([200, 200, 200, 200, 200, 200, 429]);

      // One address: twenty new guest games an hour.
      const created: number[] = [];
      let last = { status: 0, json: {} as Record<string, any>, retryAfter: null as string | null };
      for (let attempt = 0; attempt < 21; attempt += 1) {
        last = await new Client("10.0.1.11").call("PUT", "/save/guest", { state: createInitialState(), baseRevision: null });
        created.push(last.status);
      }
      expect(created.slice(0, 20).every((status) => status === 200)).toBe(true);
      expect(last.status).toBe(429);
      expect(Number(last.retryAfter)).toBeGreaterThan(0);
      expect(last.json).toEqual({ error: "too_many_attempts", retryAfter: Number(last.retryAfter) });

      // One address: sixty guest saves a minute, all its games together.
      const crowd = Array.from({ length: 10 }, () => new Client("10.0.1.12"));
      const kept: number[] = [];
      for (let round = 0; round < 6; round += 1) {
        for (const client of crowd) kept.push((await client.call("PUT", "/save/guest", { state, baseRevision: round === 0 ? null : round })).status);
      }
      expect(kept.every((status) => status === 200)).toBe(true);
      const over = await new Client("10.0.1.12").call("PUT", "/save/guest", { state, baseRevision: null });
      expect(over.status).toBe(429);
      // Another address is not held back by it.
      expect((await new Client("10.0.1.13").call("PUT", "/save/guest", { state, baseRevision: null })).status).toBe(200);
    }, 60_000);
  });

  it("rate-limits login attempts", async () => {
    const client = new Client("10.0.0.9");
    let last = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      last = (await client.call("POST", "/auth/login", { email: `bruteforce-${unique}@test.fr`, password: `essai-${attempt}` })).status;
    }
    expect(last).toBe(429);
  }, 60_000);

  it("never lets a stranger's guesses lock the player out of their account", async () => {
    const email = `lockout-${unique}@idlebound.test`;
    const password = "Un-Mot-De-Passe-Solide";
    const owner = new Client("10.0.0.40");
    expect((await owner.call("POST", "/auth/register", { email, username: freshName("Own"), password })).status).toBe(201);
    await owner.call("POST", "/auth/logout");

    const stranger = new Client("10.0.0.41");
    let last = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) last = (await stranger.call("POST", "/auth/login", { email, password: `essai-${attempt}` })).status;
    expect(last).toBe(429);
    // The player, from their own address, still gets in.
    expect((await owner.call("POST", "/auth/login", { email, password })).status).toBe(200);
  }, 60_000);

  it("never lets a botnet spending the account's ceiling lock the player out, nor guess on", async () => {
    const email = `botnet-${unique}@idlebound.test`;
    const password = "Un-Mot-De-Passe-Solide";
    expect((await new Client("10.0.2.1").call("POST", "/auth/register", { email, username: freshName("Bot"), password })).status).toBe(201);

    // 8 addresses, 8 guesses each: past the 60 guesses an account allows in 15 minutes.
    const bots = Array.from({ length: 8 }, (_, index) => new Client(`10.0.2.${10 + index}`));
    for (const bot of bots) {
      for (let attempt = 0; attempt < 8; attempt += 1) await bot.call("POST", "/auth/login", { email, password: `essai-${attempt}` });
    }
    // An address that already guessed wrong is refused, even with the right password.
    const refused = await bots[0].call("POST", "/auth/login", { email, password });
    expect(refused.status).toBe(429);
    expect(Number(refused.retryAfter)).toBeGreaterThan(0);
    // The player, from an address that never failed, still gets in.
    expect((await new Client("10.0.2.2").call("POST", "/auth/login", { email, password })).status).toBe(200);
    // A fresh address gets one guess, then waits like the others.
    const fresh = new Client("10.0.2.3");
    expect((await fresh.call("POST", "/auth/login", { email, password: "encore-un-essai" })).status).toBe(401);
    expect((await fresh.call("POST", "/auth/login", { email, password })).status).toBe(429);
  }, 120_000);

  describe("the Roll's ties and the walkers around", () => {
    const password = "Un-Mot-De-Passe-Solide";
    /** A unique height on the boards, far above any honest test game. */
    const height = 1_000_000 + (Date.now() % 1_000_000);

    async function walker(ip: string, prefix: string) {
      const client = new Client(ip);
      const username = freshName(prefix);
      expect((await client.call("POST", "/auth/register", { email: `${prefix.toLowerCase()}-${unique}@idlebound.test`, username, password })).status).toBe(201);
      const state = playedState(1);
      const first = await client.call("PUT", "/save", { state, baseRevision: null });
      expect(first.status, JSON.stringify(first.json)).toBe(200);
      const [{ id }] = await sql`select id from users where username = ${username}`;
      return { client, username, id: id as string, state, revision: first.json.revision as number };
    }

    /** A board read past the 30 s cache: every limit is its own cache entry. */
    let limit = 100;
    const read = async (client: Client, board = "stage") => (await client.call("GET", `/leaderboard?board=${board}&limit=${limit--}`)).json;

    it("breaks Depth ties by who reached the stage first, a date the server sets only with the record", async () => {
      const early = await walker("10.0.0.50", "Ear");
      const late = await walker("10.0.0.51", "Lat");

      // The first save dates the record with the server's acceptance time.
      const [fresh] = await sql`select stage_reached_at, updated_at from leaderboard where user_id = ${early.id}`;
      expect(new Date(fresh.stage_reached_at).getTime()).toBe(new Date(fresh.updated_at).getTime());

      // A save that does not raise the record keeps its date.
      await sql`update leaderboard set stage_reached_at = now() - interval '3 hours' where user_id = ${early.id}`;
      const same = await early.client.call("PUT", "/save", { state: early.state, baseRevision: early.revision });
      expect(same.status, JSON.stringify(same.json)).toBe(200);
      const [kept] = await sql`select stage_reached_at from leaderboard where user_id = ${early.id}`;
      expect(Date.now() - new Date(kept.stage_reached_at).getTime()).toBeGreaterThan(2 * 3_600_000);
      // A save that raises it dates it again.
      await sql`update leaderboard set max_stage = max_stage - 1 where user_id = ${early.id}`;
      const raised = await early.client.call("PUT", "/save", { state: early.state, baseRevision: same.json.revision });
      expect(raised.status, JSON.stringify(raised.json)).toBe(200);
      const [moved] = await sql`select stage_reached_at, max_stage from leaderboard where user_id = ${early.id}`;
      expect(Date.now() - new Date(moved.stage_reached_at).getTime()).toBeLessThan(60_000);
      expect(moved.max_stage).toBe(early.state.maxStageEver);

      // Same stage: whoever got there first ranks higher, in the rows and in their own rank.
      await sql`update leaderboard set max_stage = ${height}, stage_reached_at = now() - interval '2 hours' where user_id = ${early.id}`;
      await sql`update leaderboard set max_stage = ${height}, stage_reached_at = now() - interval '1 hour' where user_id = ${late.id}`;
      const board = await read(early.client);
      const names = board.rows.map((row: { username: string }) => row.username);
      expect(names.indexOf(early.username)).toBeGreaterThanOrEqual(0);
      expect(names.indexOf(late.username)).toBe(names.indexOf(early.username) + 1);
      const lateRank = (await read(late.client)).me.rank;
      expect(lateRank).toBe(board.me.rank + 1);

      // A hidden row leaves the Roll: the walker behind it moves up.
      await sql`update leaderboard set hidden = true where user_id = ${early.id}`;
      const after = await read(late.client);
      expect(after.rows.some((row: { username: string }) => row.username === early.username)).toBe(false);
      expect(after.me.rank).toBe(lateRank - 1);
    }, 60_000);

    it("shows the walkers just ahead and just behind, with their ranks", async () => {
      const walkers = await Promise.all(["10.0.0.52", "10.0.0.53", "10.0.0.54", "10.0.0.55", "10.0.0.56"].map((ip, index) => walker(ip, `Ar${index}`)));
      // A unique height, above the earlier test's: five walkers in a row, the first one deepest.
      for (const [index, account] of walkers.entries()) {
        await sql`update leaderboard set max_stage = ${height + 10 - index} where user_id = ${account.id}`;
      }
      const middle = await read(walkers[2].client);
      expect(middle.around.map((row: { username: string }) => row.username)).toEqual(walkers.map((account) => account.username));
      expect(middle.around.map((row: { rank: number }) => row.rank)).toEqual([0, 1, 2, 3, 4].map((offset) => middle.me.rank - 2 + offset));
      expect(middle.around[2]).toEqual(middle.me);
      // Each rank around agrees with that walker's own.
      expect((await read(walkers[1].client)).me.rank).toBe(middle.me.rank - 1);
      expect((await read(walkers[4].client)).me.rank).toBe(middle.me.rank + 2);

      // A hidden walker leaves everyone else's surroundings, and sees nobody around.
      await sql`update leaderboard set hidden = true where user_id = ${walkers[1].id}`;
      const shifted = await read(walkers[2].client);
      expect(shifted.around.map((row: { username: string }) => row.username)).not.toContain(walkers[1].username);
      expect(shifted.me.rank).toBe(middle.me.rank - 1);
      expect((await read(walkers[1].client)).around).toEqual([]);
    }, 60_000);

    it("ranks the tallies from the first one, the highest stage breaking ties", async () => {
      const deep = await walker("10.0.0.57", "Tdp");
      const shallow = await walker("10.0.0.58", "Tsh");
      const none = await walker("10.0.0.59", "Tno");
      // A unique count, far above any honest test game; the same for both walkers.
      const tally = height;
      for (const [account, stage] of [[deep, 20], [shallow, 10]] as const) {
        await sql`update leaderboard set weavings = ${tally}, promises = ${tally}, crystals = ${tally}, max_stage = ${stage} where user_id = ${account.id}`;
      }
      await sql`update leaderboard set weavings = 0, promises = 0, crystals = 0 where user_id = ${none.id}`;
      for (const board of ["weavings", "promises", "crystals"]) {
        const seen = await read(deep.client, board);
        const names = seen.rows.map((row: { username: string }) => row.username);
        expect(names.indexOf(shallow.username)).toBe(names.indexOf(deep.username) + 1);
        expect(names).not.toContain(none.username);
        expect(seen.me).toMatchObject({ value: tally, maxStage: 20 });
        expect((await read(shallow.client, board)).me.rank).toBe(seen.me.rank + 1);
        expect((await read(none.client, board)).me).toBeNull();
      }
      // A save writes the tallies it carries, and never lowers a better one already kept.
      await sql`update leaderboard set weavings = ${tally} where user_id = ${none.id}`;
      const saved = await none.client.call("PUT", "/save", { state: none.state, baseRevision: none.revision });
      expect(saved.status, JSON.stringify(saved.json)).toBe(200);
      const [kept] = await sql`select weavings, crystals from leaderboard where user_id = ${none.id}`;
      expect(kept).toEqual({ weavings: tally, crystals: none.state.lifetime.crystals });
    }, 60_000);
  });

  it("reads a fractional leaderboard size as a whole number of rows", async () => {
    const response = await new Client("10.0.2.30").call("GET", "/leaderboard?limit=1.5");
    expect(response.status).toBe(200);
    expect(response.json.rows.length).toBeLessThanOrEqual(1);
  });

  it("refuses leaderboards inherited from the prototype", async () => {
    const response = await new Client("10.0.0.11").call("GET", "/leaderboard?board=constructor");
    expect(response.status).toBe(400);
  });

  it("warns accounts inactive for 3 years, then deletes only those warned 30 days ago", async () => {
    const { sql } = await import("./db/client");
    const { purgeExpired } = await import("./lib/session");
    const password = "unBonMotDePasse!";
    const dormant = new Client("10.0.0.11");
    const active = new Client("10.0.0.12");
    const dormantEmail = `dormant-${unique}@test.fr`;
    const activeEmail = `actif-${unique}@test.fr`;
    expect((await dormant.call("POST", "/auth/register", { email: dormantEmail, username: freshName("Dor"), password })).status).toBe(201);
    expect((await active.call("POST", "/auth/register", { email: activeEmail, username: freshName("Act"), password })).status).toBe(201);
    await sql`update users set last_seen_at = now() - interval '1096 days' where email = ${dormantEmail}`;
    await sql`update users set last_seen_at = now() - interval '1094 days' where email = ${activeEmail}`;

    // An authenticated request refreshes activity, moving the "active" account away from the threshold.
    expect((await active.call("GET", "/auth/me")).status).toBe(200);
    const [seen] = await sql`select last_seen_at from users where email = ${activeEmail}`;
    expect(Date.now() - new Date(seen.last_seen_at).getTime()).toBeLessThan(60_000);

    // First run: the dormant account is only warned, never deleted without a warning.
    await purgeExpired();
    const [warned] = await sql`select inactivity_notice_at from users where email = ${dormantEmail}`;
    expect(warned.inactivity_notice_at).not.toBeNull();
    // 30 days after the warning, still inactive: deleted.
    await sql`update users set inactivity_notice_at = now() - interval '31 days' where email = ${dormantEmail}`;
    await purgeExpired();
    expect(await sql`select 1 from users where email = ${dormantEmail}`).toHaveLength(0);
    expect(await sql`select 1 from users where email = ${activeEmail}`).toHaveLength(1);
  });

  it("requires a confirmed e-mail once SMTP is configured, after a grace period", async () => {
    const { sql } = await import("./db/client");
    const { env } = await import("./env");
    const { hashToken, purgeExpired } = await import("./lib/session");
    const previousSmtp = env.SMTP_URL;
    // Unreachable relay: sends fail in the background (and are only logged), the flow is what is tested.
    env.SMTP_URL = "smtp://127.0.0.1:9";
    try {
      const password = "unBonMotDePasse!";
      const client = new Client("10.0.0.20");
      const email = `verif-${unique}@test.fr`;
      const register = await client.call("POST", "/auth/register", { email, username: freshName("Ver"), password });
      expect(register.status).toBe(201);
      expect(register.json.user.emailVerified).toBe(false);
      expect(register.json.user.verifyBy).toBeTruthy();

      // Within the grace period, saving works.
      const state = playedState(1);
      expect((await client.call("PUT", "/save", { state, baseRevision: null })).status).toBe(200);

      // Past it, saves are refused until the address is confirmed; loading still works.
      await sql`update users set created_at = now() - interval '4 days' where email = ${email}`;
      const blocked = await client.call("PUT", "/save", { state, baseRevision: 1 });
      expect(blocked.status).toBe(403);
      expect(blocked.json.error).toBe("email_unverified");
      expect((await client.call("GET", "/save")).status).toBe(200);

      // A mistyped address can be fixed, with the password.
      const fixed = `verif-fixed-${unique}@test.fr`;
      expect((await client.call("POST", "/auth/email", { email: fixed, password: "wrong" })).status).toBe(401);
      const changed = await client.call("POST", "/auth/email", { email: fixed, password });
      expect(changed.status).toBe(200);
      expect(changed.json.user.email).toBe(fixed);
      expect(changed.json.user.emailVerified).toBe(false);

      // A link sent to the previous address confirms nothing.
      const [row] = await sql`select id from users where email = ${fixed}`;
      const staleToken = `stale-token-${unique}-padding-padding`;
      await sql`insert into email_verifications (id, user_id, email, expires_at) values (${hashToken(staleToken)}, ${row.id}, ${email}, now() + interval '1 day')`;
      expect((await new Client("10.0.0.21").call("POST", "/auth/verify", { token: staleToken })).status).toBe(400);

      // The right link works from any browser, once.
      const token = `fresh-token-${unique}-padding-padding`;
      await sql`insert into email_verifications (id, user_id, email, expires_at) values (${hashToken(token)}, ${row.id}, ${fixed}, now() + interval '1 day')`;
      const verified = await new Client("10.0.0.21").call("POST", "/auth/verify", { token });
      expect(verified.status).toBe(200);
      expect((await new Client("10.0.0.21").call("POST", "/auth/verify", { token })).status).toBe(400);
      expect((await client.call("GET", "/auth/me")).json.user.emailVerified).toBe(true);
      expect((await client.call("PUT", "/save", { state, baseRevision: 1 })).status).toBe(200);
      expect((await client.call("POST", "/auth/verify/resend")).status).toBe(400);
      expect((await client.call("POST", "/auth/email", { email, password })).status).toBe(403);

      // An account never confirmed is deleted after 30 days.
      const ghost = `ghost-${unique}@test.fr`;
      expect((await new Client("10.0.0.22").call("POST", "/auth/register", { email: ghost, username: freshName("Gho"), password })).status).toBe(201);
      await sql`update users set created_at = now() - interval '31 days' where email = ${ghost}`;
      await purgeExpired();
      expect(await sql`select 1 from users where email = ${ghost}`).toHaveLength(0);
      expect(await sql`select 1 from users where email = ${fixed}`).toHaveLength(1);
    } finally {
      env.SMTP_URL = previousSmtp;
    }
  }, 60_000);

  it("voids a reset link sent before the address changed: it never confirms the new one", async () => {
    const { sql } = await import("./db/client");
    const { env } = await import("./env");
    const { hashToken } = await import("./lib/session");
    const previousSmtp = env.SMTP_URL;
    env.SMTP_URL = "smtp://127.0.0.1:9";
    try {
      const password = "unBonMotDePasse!";
      const client = new Client("10.0.2.40");
      const email = `reset-move-${unique}@test.fr`;
      expect((await client.call("POST", "/auth/register", { email, username: freshName("Mov"), password })).status).toBe(201);
      // A reset link mailed to the first address.
      const [row] = await sql`select id from users where email = ${email}`;
      const token = `reset-before-move-${unique}-padding`;
      await sql`insert into password_resets (id, user_id, expires_at) values (${hashToken(token)}, ${row.id}, now() + interval '1 hour')`;

      const moved = `reset-moved-${unique}@test.fr`;
      expect((await client.call("POST", "/auth/email", { email: moved, password })).status).toBe(200);
      expect(await sql`select 1 from password_resets where user_id = ${row.id}`).toHaveLength(0);

      const reset = await new Client("10.0.2.41").call("POST", "/auth/reset", { token, password: "unAutreMotDePasse!" });
      expect(reset.status).toBe(400);
      expect(reset.json.error).toBe("reset_link_invalid");
      const [after] = await sql`select email, email_verified_at from users where id = ${row.id}`;
      expect(after.email).toBe(moved);
      expect(after.email_verified_at).toBeNull();
      // The password did not change either.
      expect((await new Client("10.0.2.42").call("POST", "/auth/login", { email: moved, password })).status).toBe(200);
    } finally {
      env.SMTP_URL = previousSmtp;
    }
  }, 60_000);

  it("counts every confirmation mail of an address fix against the resend budget", async () => {
    const { env } = await import("./env");
    const previousSmtp = env.SMTP_URL;
    env.SMTP_URL = "smtp://127.0.0.1:9";
    try {
      const password = "unBonMotDePasse!";
      const client = new Client("10.0.2.50");
      const email = `resend-budget-${unique}@test.fr`;
      expect((await client.call("POST", "/auth/register", { email, username: freshName("Bud"), password })).status).toBe(201);
      // Same address each time: a mail per call, 3 per hour.
      for (let call = 0; call < 3; call += 1) expect((await client.call("POST", "/auth/email", { email, password })).status).toBe(200);
      const spent = await client.call("POST", "/auth/email", { email, password });
      expect(spent.status).toBe(429);
      expect(spent.json.error).toBe("too_many_attempts");
      expect(spent.json.retryAfter).toBeGreaterThan(0);
      // The resend button shares the same budget.
      expect((await client.call("POST", "/auth/verify/resend")).status).toBe(429);
      // A new address is refused too, and left untouched.
      expect((await client.call("POST", "/auth/email", { email: `resend-other-${unique}@test.fr`, password })).status).toBe(429);
      expect((await client.call("GET", "/auth/me")).json.user.email).toBe(email);
    } finally {
      env.SMTP_URL = previousSmtp;
    }
  }, 60_000);

  it("lets a walker take a new username once every 90 days, the old one freed", async () => {
    const client = new Client("10.0.0.30");
    const password = "Un-Mot-De-Passe-Solide";
    const first = freshName("Ren");
    const second = freshName("Nam");
    const register = await client.call("POST", "/auth/register", { email: `rename-${unique}@idlebound.test`, username: first, password });
    expect(register.status).toBe(201);
    expect(register.json.user.renameAt).toBeNull();
    const rival = freshName("Riv");
    expect((await new Client("10.0.0.31").call("POST", "/auth/register", { email: `rival-${unique}@idlebound.test`, username: rival, password })).status).toBe(201);

    expect((await client.call("POST", "/auth/username", { username: second, password: "pas-le-bon" })).json).toEqual({ error: "wrong_password", field: "password" });
    expect((await client.call("POST", "/auth/username", { username: rival.toLowerCase(), password })).json).toEqual({ error: "username_taken", field: "username" });
    expect((await client.call("POST", "/auth/username", { username: "C0nn4rd", password })).json.error).toBe("invalid_username");
    expect((await client.call("POST", "/auth/username", { username: first, password })).json.error).toBe("username_unchanged");

    const renamed = await client.call("POST", "/auth/username", { username: second, password });
    expect(renamed.status).toBe(200);
    expect(renamed.json.user.username).toBe(second);
    const renameAt = Date.parse(renamed.json.user.renameAt);
    expect(renameAt - Date.now()).toBeGreaterThan(89 * 86_400_000);
    expect((await client.call("GET", "/auth/me")).json.user.username).toBe(second);

    // Even a change of case waits for the next window.
    const again = await client.call("POST", "/auth/username", { username: second.toUpperCase(), password });
    expect(again.status).toBe(403);
    expect(again.json).toEqual({ error: "rename_too_soon", renameAt: renamed.json.user.renameAt });

    // The old name is free for anyone.
    expect((await new Client("10.0.0.32").call("POST", "/auth/register", { email: `taker-${unique}@idlebound.test`, username: first, password })).status).toBe(201);

    // 90 days later, the window opens again.
    await sql`update users set username_changed_at = now() - interval '90 days 1 minute' where username = ${second}`;
    expect((await client.call("GET", "/auth/me")).json.user.renameAt).toBeNull();
    const third = await client.call("POST", "/auth/username", { username: second.toUpperCase(), password });
    expect(third.status).toBe(200);
    expect(third.json.user.username).toBe(second.toUpperCase());
  });

  it("does not reveal whether an e-mail exists when resetting", async () => {
    const client = new Client("10.0.0.10");
    const response = await client.call("POST", "/auth/forgot", { email: `unknown-${unique}@test.fr` });
    expect(response.status).toBe(200);
    expect(response.json.ok).toBe(true);
  });

  it("answers errors as codes, the same in every language", async () => {
    const login = { email: `nobody-${unique}@test.fr`, password: "wrong_password" };
    const english = await new Client("10.0.0.13").call("POST", "/auth/login", login, { "accept-language": "en-US,en;q=0.9" });
    const french = await new Client("10.0.0.14").call("POST", "/auth/login", login, { "accept-language": "en-US", cookie: "ib_lang=fr" });
    expect(english.status).toBe(401);
    expect(english.json).toEqual({ error: "wrong_credentials" });
    expect(french.json).toEqual(english.json);
    const username = await new Client("10.0.0.15").call("POST", "/auth/register", { email: `short-${unique}@test.fr`, username: "ab", password: "unBonMotDePasse!" });
    expect(username.json).toEqual({ error: "invalid_username", reason: "too-short", field: "username" });
    const password = await new Client("10.0.0.16").call("POST", "/auth/register", { email: `weak-${unique}@test.fr`, username: `weak${unique}`.slice(0, 16), password: "motdepasse" });
    expect(password.json).toEqual({ error: "weak_password", reason: "too-common", field: "password" });
  });
  describe("journals replayed and fates kept by the server", () => {
    const codes = (answer: { json: Record<string, any> }) => answer.json.violations.map((violation: { code: string }) => violation.code);
    async function signedUp(ip: string, prefix: string) {
      const client = new Client(ip);
      const username = freshName(prefix);
      expect((await client.call("POST", "/auth/register", { email: `${prefix.toLowerCase()}-${unique}@idlebound.test`, username, password: "Un-Mot-De-Passe-Solide" })).status).toBe(201);
      const [user] = await sql`select id from users where username = ${username}`;
      return { client, username, userId: user.id as string };
    }

    async function begun(client: Client, guest = false) {
      const fresh = await client.call("POST", guest ? "/save/guest/new" : "/save/new");
      expect(fresh.status).toBe(200);
      const page = new PlayingPage(createInitialState(fresh.json.createdAt), { revision: null, createdAt: fresh.json.createdAt }, fresh.json.fates, Date.now() - 4 * 60_000);
      return { page, fresh };
    }

    it("begins one game per account, whatever is asked, and replays its journal", async () => {
      const { client, userId } = await signedUp("10.0.2.1", "Jou");
      const { page, fresh } = await begun(client);
      // Asked again before it began: the same seed, the same birth date.
      const again = await client.call("POST", "/save/new");
      expect(again.json).toEqual(fresh.json);
      page.play(60);
      const first = page.outgoing();
      const saved = await client.call("PUT", "/save", { state: first.state, baseRevision: null, journal: first.journal });
      expect(saved.status, JSON.stringify(saved.json)).toBe(200);
      expect(saved.json.fates.strike.seeds).toHaveLength(16);
      page.kept(saved.json.revision, saved.json.fates);
      // The seed is the game's now: a new game is another one.
      const [pending] = await sql`select count(*)::int as count from pending_seeds where owner = ${`u:${userId}`}`;
      expect(pending.count).toBe(0);
      // It carries on, gzipped as a page sends it.
      page.play(60);
      const second = page.outgoing();
      const packed = (await import("node:zlib")).gzipSync(JSON.stringify(second.journal)).toString("base64");
      const next = await client.call("PUT", "/save", { state: second.state, baseRevision: saved.json.revision, journal: packed });
      expect(next.status, JSON.stringify(next.json)).toBe(200);
      const [row] = await sql`select seed is not null as seed, runtime is not null as runtime, parent->>'revision' as parent from saves where user_id = ${userId}`;
      expect(row).toEqual({ seed: true, runtime: true, parent: String(saved.json.revision) });
      const reports = await sql`select outcome from replay_reports where user_id = ${userId}`;
      expect(reports).toEqual([]);
      // What the replay saw of the walker's presence is kept, outside the save.
      const [presence] = await sql`select acts, crystals_seen from presence_days where user_id = ${userId}`;
      expect(presence).toBeDefined();
      expect(JSON.stringify(next.json)).not.toContain(row.seed);
    }, 60_000);

    it("reports a forged save in shadow mode, and keeps the replayed game once enforced", async () => {
      const { env } = await import("./env");
      const { client, userId } = await signedUp("10.0.2.2", "For");
      const { page } = await begun(client);
      page.play(60);
      const first = page.outgoing();
      const saved = await client.call("PUT", "/save", { state: first.state, baseRevision: null, journal: first.journal });
      expect(saved.status).toBe(200);
      page.kept(saved.json.revision, saved.json.fates);

      page.play(30);
      const shadow = page.outgoing();
      const forged = structuredClone(shadow.state);
      forged.gold += 25;
      forged.lifetime.goldEarned += 25;
      forged.run.goldEarned += 25;
      const kept = await client.call("PUT", "/save", { state: forged, baseRevision: saved.json.revision, journal: shadow.journal });
      expect(kept.status).toBe(200);
      expect(kept.json.replay).toBeUndefined();
      const [report] = await sql`select outcome, detail from replay_reports where user_id = ${userId}`;
      expect(report.outcome).toBe("diverged");
      expect(report.detail.diff).toContain("gold");

      env.REPLAY_MODE = "enforce";
      try {
        // The stored game is the forged one now: the page carries on from it.
        page.kept(kept.json.revision, kept.json.fates);
        page.engine.state.gold = forged.gold;
        page.engine.state.lifetime.goldEarned = forged.lifetime.goldEarned;
        page.engine.state.run.goldEarned = forged.run.goldEarned;
        page.play(30);
        const sent = page.outgoing();
        const more = structuredClone(sent.state);
        more.gold += 40;
        more.lifetime.goldEarned += 40;
        more.run.goldEarned += 40;
        const enforced = await client.call("PUT", "/save", { state: more, baseRevision: kept.json.revision, journal: sent.journal });
        expect(enforced.status, JSON.stringify(enforced.json)).toBe(200);
        expect(enforced.json.replay.state.gold).toBe(sent.state.gold);
        const [row] = await sql`select (state->>'gold')::float as gold from saves where user_id = ${userId}`;
        expect(row.gold).toBe(sent.state.gold);
        // Without a journal: refused.
        const bare = await client.call("PUT", "/save", { state: sent.state, baseRevision: enforced.json.revision });
        expect(bare.status).toBe(422);
        expect(codes(bare)).toContain("journal");
      } finally {
        env.REPLAY_MODE = "shadow";
      }
    }, 60_000);

    it("gives a guest one seed per cookie, and keeps the game under that cookie", async () => {
      const guest = new Client("10.0.2.3");
      const { page, fresh } = await begun(guest, true);
      expect(guest.has("ib_guest")).toBe(true);
      const cookie = guest.value("ib_guest");
      const again = await guest.call("POST", "/save/guest/new");
      expect(again.json).toEqual(fresh.json);
      expect(guest.value("ib_guest")).toBe(cookie);
      page.play(30);
      const first = page.outgoing();
      const saved = await guest.call("PUT", "/save/guest", { state: first.state, baseRevision: null, journal: first.journal });
      expect(saved.status, JSON.stringify(saved.json)).toBe(200);
      expect(guest.value("ib_guest")).toBe(cookie);
      const [row] = await sql`select seed is not null as seed, runtime is not null as runtime from guest_saves where game_created_at = ${fresh.json.createdAt}`;
      expect(row).toEqual({ seed: true, runtime: true });
      const reports = await sql`select outcome from replay_reports where guest_id is not null and detail->>'base' is null and outcome <> 'no-journal'`;
      expect(reports.filter((report) => report.outcome !== "match")).toEqual([]);
      // Another browser, without the cookie, gets another game: never this one's seed.
      const other = await new Client("10.0.2.4").call("POST", "/save/guest/new");
      expect(other.json.createdAt).not.toBe(fresh.json.createdAt);
      expect(other.json.fates).not.toEqual(fresh.json.fates);
    }, 60_000);

    it("keeps the first of a guest's two first saves sent at once under its cookie, the other a conflict", async () => {
      const guest = new Client("10.0.2.5");
      const { page } = await begun(guest, true);
      const cookie = guest.value("ib_guest");
      page.play(30);
      const first = page.outgoing();
      const [a, b] = await Promise.all([
        guest.call("PUT", "/save/guest", { state: first.state, baseRevision: null, journal: first.journal }),
        guest.call("PUT", "/save/guest", { state: first.state, baseRevision: null, journal: first.journal })
      ]);
      expect([a.status, b.status].sort()).toEqual([200, 409]);
      expect(guest.value("ib_guest")).toBe(cookie);
      const rows = await sql`select id from guest_saves where game_created_at = ${first.state.createdAt}`;
      expect(rows).toHaveLength(1);
    }, 60_000);

    it("refuses a save whose creation date is not a whole number, without failing", async () => {
      const guest = new Client("10.0.2.6");
      const { page } = await begun(guest, true);
      page.play(30);
      const first = page.outgoing();
      const answer = await guest.call("PUT", "/save/guest", { state: { ...first.state, createdAt: first.state.createdAt + 0.5 }, baseRevision: null, journal: first.journal });
      expect(answer.status).toBe(400);
      expect(answer.json.error).toBe("invalid_save");
    }, 60_000);

    it("hands out the window of a game as it opens, and gives a game kept before the seeds its own", async () => {
      const { client, userId } = await signedUp("10.0.2.5", "Old");
      // A game saved by a page of the previous version: no journal, no seed yet.
      const legacy = playedState(2) as unknown as Record<string, unknown>;
      expect((await client.call("PUT", "/save", { state: legacy, baseRevision: null })).status).toBe(200);
      await sql`update saves set seed = null where user_id = ${userId}`;
      const opened = await client.call("POST", "/save/open", { holder: "page-of-the-new-version" });
      expect(opened.json.save.fates.loot.seeds).toHaveLength(16);
      const [row] = await sql`select seed is not null as seed from saves where user_id = ${userId}`;
      expect(row.seed).toBe(true);
    }, 60_000);
  });
});
