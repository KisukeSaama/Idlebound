import { sql } from "drizzle-orm";
import { bigint, boolean, doublePrecision, index, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  /** Normalized username (case, accents): guarantees visual uniqueness. */
  usernameKey: text("username_key").notNull().unique(),
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

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
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [index("guest_saves_last_seen_idx").on(table.lastSeenAt)]);

export const leaderboard = pgTable("leaderboard", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  maxStage: integer("max_stage").notNull().default(1),
  ascensions: integer("ascensions").notNull().default(0),
  essences: doublePrecision("essences").notNull().default(0),
  achievements: integer("achievements").notNull().default(0),
  /** Descents (BIBLE 12.7): the Night board, Depth breaking ties. */
  descents: integer("descents").notNull().default(0),
  playTime: integer("play_time").notNull().default(0),
  hidden: boolean("hidden").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("leaderboard_stage_idx").on(sql`${table.maxStage} desc`, table.updatedAt),
  index("leaderboard_ascensions_idx").on(sql`${table.ascensions} desc`),
  index("leaderboard_essences_idx").on(sql`${table.essences} desc`),
  index("leaderboard_achievements_idx").on(sql`${table.achievements} desc`),
  index("leaderboard_descents_idx").on(sql`${table.descents} desc`, sql`${table.maxStage} desc`)
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
