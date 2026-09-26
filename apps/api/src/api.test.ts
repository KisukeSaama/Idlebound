/**
 * API integration tests against a real Postgres.
 * They run when TEST_DATABASE_URL is set (CI job, or locally with compose.dev.yml):
 *   TEST_DATABASE_URL=postgres://idlebound:idlebound@localhost:5432/idlebound_test npm test
 */
import { GameEngine, createInitialState, seededRng, type GameState } from "@idlebound/game";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";

const url = process.env.TEST_DATABASE_URL;
const suite = url ? describe : describe.skip;

type App = { request: (path: string, init?: RequestInit) => Response | Promise<Response> };

let app: App;
let closeDb: () => Promise<void>;

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
  cookie = "";
  constructor(private ip: string) {}

  async call(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
    const response = await app.request(path, {
      method,
      headers: {
        "content-type": "application/json",
        "x-idlebound": "1",
        "cf-connecting-ip": this.ip,
        // Network peer = a Cloudflare node, so the API trusts cf-connecting-ip.
        "x-forwarded-for": "173.245.48.10",
        ...(this.cookie ? { cookie: this.cookie } : {}),
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) this.cookie = setCookie.split(";")[0];
    const json = await response.json().catch(() => ({}));
    return { status: response.status, json: json as Record<string, any> };
  }
}

const unique = Date.now().toString(36);

function playedState(minutes: number): GameState {
  const start = Date.now() - minutes * 60_000 - 5_000;
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

suite("API (real Postgres)", () => {
  beforeAll(async () => {
    await ensureDatabase(url!);
    process.env.DATABASE_URL = url;
    process.env.NODE_ENV = "test";
    const { runMigrations } = await import("./migrate");
    await runMigrations(3);
    const { createApp } = await import("./app");
    const { sql } = await import("./db/client");
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
    const weak = await client.call("POST", "/auth/register", { email: `a${unique}@test.fr`, username: `Hero${unique.slice(-5)}`, password: "password" });
    expect(weak.status).toBe(400);
    expect(weak.json.field).toBe("password");
  });

  it("handles a full journey: sign-up, save, cheat, leaderboard, deletion", async () => {
    const client = new Client("10.0.0.2");
    const username = `Hero${unique.slice(-6)}`;
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

    const board = await client.call("GET", "/leaderboard?board=stage");
    expect(board.status).toBe(200);
    expect(board.json.me.rank).toBeGreaterThanOrEqual(1);

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

  it("rate-limits login attempts", async () => {
    const client = new Client("10.0.0.9");
    let last = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      last = (await client.call("POST", "/auth/login", { email: `bruteforce-${unique}@test.fr`, password: `essai-${attempt}` })).status;
    }
    expect(last).toBe(429);
  }, 60_000);

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
    expect((await dormant.call("POST", "/auth/register", { email: dormantEmail, username: `Dor${unique.slice(-6)}`, password })).status).toBe(201);
    expect((await active.call("POST", "/auth/register", { email: activeEmail, username: `Act${unique.slice(-6)}`, password })).status).toBe(201);
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

  it("does not reveal whether an e-mail exists when resetting", async () => {
    const client = new Client("10.0.0.10");
    const response = await client.call("POST", "/auth/forgot", { email: `unknown-${unique}@test.fr` });
    expect(response.status).toBe(200);
    expect(response.json.ok).toBe(true);
  });

  it("answers in the language of the request", async () => {
    const english = await new Client("10.0.0.13").call("POST", "/auth/login", { email: `nobody-${unique}@test.fr`, password: "wrong-password" }, { "accept-language": "en-US,en;q=0.9" });
    expect(english.status).toBe(401);
    expect(english.json.error).toBe("Wrong e-mail or password.");
    // The explicit choice (cookie) wins over the browser languages.
    const french = await new Client("10.0.0.14").call("POST", "/auth/login", { email: `nobody-${unique}@test.fr`, password: "wrong-password" }, { "accept-language": "en-US", cookie: "ib_lang=fr" });
    expect(french.json.error).toBe("E-mail ou mot de passe incorrect.");
    const username = await new Client("10.0.0.15").call("POST", "/auth/register", { email: `short-${unique}@test.fr`, username: "ab", password: "unBonMotDePasse!" }, { "accept-language": "en" });
    expect(username.json.error).toBe("Your username must be at least 3 characters long.");
  });
});
