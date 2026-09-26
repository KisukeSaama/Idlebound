// npm run db:migrate: applies the migrations, then closes the connection.
import { sql } from "./db/client";
import { runMigrations } from "./migrate";

runMigrations()
  .then(() => console.log("Migrations applied."))
  .finally(() => sql.end());
