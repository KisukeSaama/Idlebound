import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env";
import * as schema from "./schema";

// No transaction waits on a replay any more (see routes/save.ts): twenty connections serve the
// saves, the logins and the boards of a busy evening, within Postgres's default hundred.
export const sql = postgres(env.DATABASE_URL, {
  max: 20,
  idle_timeout: 30,
  onnotice: () => {}
});

export const db = drizzle(sql, { schema });
export type Database = typeof db;
