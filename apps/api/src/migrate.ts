import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db/client";

/** Migrations folder: next to the bundle in production, apps/api/drizzle in dev. */
function migrationsFolder(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [join(here, "drizzle"), join(here, "..", "drizzle")];
  const found = candidates.find((path) => existsSync(join(path, "meta", "_journal.json")));
  if (!found) throw new Error(`Migrations not found (looked in ${candidates.join(", ")}).`);
  return found;
}

export async function runMigrations(attempts = 30): Promise<void> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await migrate(db, { migrationsFolder: migrationsFolder() });
      return;
    } catch (error) {
      const code = (error as { code?: string }).code;
      const retryable = code === "ECONNREFUSED" || code === "57P03" || code === "ENOTFOUND";
      if (!retryable || attempt >= attempts) throw error;
      console.warn(`Database unavailable (${code}), retry ${attempt}/${attempts}…`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
