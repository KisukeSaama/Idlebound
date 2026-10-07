import { sql } from "drizzle-orm";
import type { EngineRuntime, GameState } from "@idlebound/game";
import type { Pace } from "@idlebound/game/server";
import { bigint, boolean, date, index, integer, jsonb, pgTable, primaryKey, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** A game as it stood at a revision, with the page's rhythms there: a journal may build on it. */
export interface Branch {
  revision: number;
  state: GameState;
  runtime: EngineRuntime | null;
  /** The server's own ledger at that revision, and when it kept it (ms). */
  pace: Pace | null;
  at: number;
}

/**
 * Where a chain of saves began: a page back from a long outage sends its journal in several
 * saves in a row, and each is held to the time since the chain began, as one save would be.
 */
export interface Chain {
  state: GameState;
  pace: Pace | null;
  /** When the server kept the save the chain began after (ms). */
  at: number;
}

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  /** Normalized username (case, accents): guarantees visual uniqueness. */
  usernameKey: text("username_key").notNull().unique(),
  /** Last time the player took a new username; null until the first change. */
  usernameChangedAt: timestamp("username_changed_at", { withTimezone: true }),
  passwordHash: text("password_hash").notNull(),
  /** When the player proved they own the address; null until then (see lib/verification.ts). */
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  /** Last authenticated request (day precision), used to purge inactive accounts. */
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  /** Language of the player's last visit, for e-mails sent outside of any request. */
  locale: text("locale").notNull().default("fr"),
  /** When the "account about to be deleted" warning was sent; cleared by any new activity. */
  inactivityNoticeAt: timestamp("inactivity_notice_at", { withTimezone: true })
}, (table) => [index("users_last_seen_idx").on(table.lastSeenAt)]);

export const sessions = pgTable("sessions", {
  /** SHA-256 of the token: a database leak yields no usable session. */
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
}, (table) => [index("sessions_user_idx").on(table.userId)]);

export const passwordResets = pgTable("password_resets", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true })
}, (table) => [index("password_resets_user_idx").on(table.userId)]);

/** E-mail confirmation links. A link only confirms the address it was sent to. */
export const emailVerifications = pgTable("email_verifications", {
  /** SHA-256 of the token. */
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
}, (table) => [index("email_verifications_user_idx").on(table.userId)]);

export const saves = pgTable("saves", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  state: jsonb("state").notNull(),
  revision: integer("revision").notNull().default(1),
  /** Lineage id: the game's creation date on the client. */
  gameCreatedAt: bigint("game_created_at", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  /**
   * The page playing this game right now (a random id per browser tab), and when it last
   * said so. Another page opens it only by taking it over; null once the page let it go.
   */
  holder: text("holder"),
  heldAt: timestamp("held_at", { withTimezone: true }),
  /**
   * What the server measured itself across this game's saves (see `Pace` in the game's
   * validation): the deepest night it saw, time claimed ahead of its clock, powers left, the
   * night's start. Null for a game last saved before it was kept.
   */
  pace: jsonb("pace").$type<Pace>(),
  /**
   * The secret the seeds of this game's fates are drawn from (see lib/fates.ts): never sent
   * to a page, never in the save. Null for a game last saved before it was kept.
   */
  seed: text("seed"),
  /** The page's rhythms where the server's last replay of this game left them (see replay.ts). */
  runtime: jsonb("runtime").$type<EngineRuntime>(),
  /**
   * The game as it stood when another page took it: the page it was taken from builds on it,
   * and its journal is replayed from here if the walker keeps that page's game.
   */
  branch: jsonb("branch").$type<Branch>(),
  /**
   * The game at the revision before this one: a page whose last save landed but whose answer
   * was lost builds on it, and its journal is replayed from here.
   */
  parent: jsonb("parent").$type<Branch>(),
  chain: jsonb("chain").$type<Chain>()
}, (table) => [index("saves_game_created_at_idx").on(table.gameCreatedAt)]);

/**
 * A guest's game: no account, no e-mail. The browser holds an httpOnly cookie, the row is
 * found by its hash. Never ranked; purged once unvisited for too long (see lib/guest.ts).
 */
export const guestSaves = pgTable("guest_saves", {
  /** SHA-256 of the cookie's token: a database leak yields no usable game. */
  id: text("id").primaryKey(),
  state: jsonb("state").notNull(),
  revision: integer("revision").notNull().default(1),
  /** Lineage id: the game's creation date on the client. */
  gameCreatedAt: bigint("game_created_at", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  /** Last visit (day precision on reads), used to purge games nobody comes back to. */
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  /** The page playing this game right now, and when it last said so (see `saves`). */
  holder: text("holder"),
  heldAt: timestamp("held_at", { withTimezone: true }),
  /** What the server measured itself across this game's saves (see `saves`). */
  pace: jsonb("pace").$type<Pace>(),
  /** The secret of this game's fates, the page's rhythms, the game where another page took it, the revision before (see `saves`). */
  seed: text("seed"),
  runtime: jsonb("runtime").$type<EngineRuntime>(),
  branch: jsonb("branch").$type<Branch>(),
  parent: jsonb("parent").$type<Branch>(),
  chain: jsonb("chain").$type<Chain>()
}, (table) => [index("guest_saves_last_seen_idx").on(table.lastSeenAt)]);

export const leaderboard = pgTable("leaderboard", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  maxStage: integer("max_stage").notNull().default(1),
  /** The three other boards: nights rewoven, promises kept, crystals caught (all time). */
  weavings: integer("weavings").notNull().default(0),
  promises: integer("promises").notNull().default(0),
  crystals: integer("crystals").notNull().default(0),
  hidden: boolean("hidden").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  /**
   * When the server accepted the save that raised `maxStage` to its current value: among
   * equal stages, whoever got there first ranks higher. Never a client-provided time.
   */
  stageReachedAt: timestamp("stage_reached_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("leaderboard_stage_idx").on(sql`${table.maxStage} desc`, table.stageReachedAt),
  index("leaderboard_weavings_idx").on(sql`${table.weavings} desc`),
  index("leaderboard_promises_idx").on(sql`${table.promises} desc`),
  index("leaderboard_crystals_idx").on(sql`${table.crystals} desc`)
]);

/** Log of saves rejected by the anti-cheat (audit): an account's, or a guest's. */
export const saveRejections = pgTable("save_rejections", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  /** A guest's game (guest_saves.id). No foreign key: the entry outlives an adopted or purged game. */
  guestId: text("guest_id"),
  codes: jsonb("codes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [index("save_rejections_user_idx").on(table.userId)]);

/**
 * The seed of a game not begun yet: one per account, one per guest's cookie, handed out again
 * and again until a save begins that game. Asking for a new game twice gives the same seed and
 * the same birth date, so nobody draws several and keeps the luckiest.
 */
export const pendingSeeds = pgTable("pending_seeds", {
  /** "u:" and the account's id, or "g:" and the hash of the guest's cookie. */
  owner: text("owner").primaryKey(),
  secret: text("secret").notNull(),
  /** The new game's creation date (its lineage), chosen by the server, unique. */
  gameCreatedAt: bigint("game_created_at", { mode: "number" }).notNull().unique(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [index("pending_seeds_issued_idx").on(table.issuedAt)]);

/**
 * What the replay of a journal found when it did not land on the declared game, or could not
 * run (kept 90 days, 30 per game and hour at most): the review of shadow mode reads it.
 */
export const replayReports = pgTable("replay_reports", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  guestId: text("guest_id"),
  outcome: text("outcome").notNull(),
  detail: jsonb("detail").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [index("replay_reports_user_idx").on(table.userId), index("replay_reports_created_idx").on(table.createdAt)]);

/**
 * What the replays saw of an account's presence, a row per day (kept 90 days), outside its
 * clicks: crystals that appeared and were caught and how fast, powers used as they came back,
 * ascensions, and the longest stretch of such acts without a 20-minute pause. Never in the
 * save, never used on its own: it helps a person review the boards (see review-cli.ts).
 */
export const presenceDays = pgTable("presence_days", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  day: date("day", { mode: "string" }).notNull(),
  crystalsSeen: integer("crystals_seen").notNull().default(0),
  crystalsCaught: integer("crystals_caught").notNull().default(0),
  /** Catches by reaction time, in the buckets of `REACTION_BUCKETS`. */
  reactions: jsonb("reactions").$type<number[]>().notNull(),
  powers: integer("powers").notNull().default(0),
  promptPowers: integer("prompt_powers").notNull().default(0),
  ascensions: integer("ascensions").notNull().default(0),
  acts: integer("acts").notNull().default(0),
  /** The longest stretch of acts without a long pause that ended this day, in ms. */
  longestSpanMs: bigint("longest_span_ms", { mode: "number" }).notNull().default(0)
}, (table) => [primaryKey({ columns: [table.userId, table.day] })]);

/** The stretch of presence under way for an account: when it began, and its last act. */
export const presenceSpans = pgTable("presence_spans", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  startedAt: bigint("started_at", { mode: "number" }).notNull(),
  lastAt: bigint("last_at", { mode: "number" }).notNull()
});
