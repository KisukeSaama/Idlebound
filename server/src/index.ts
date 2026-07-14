import cors from "cors";
import express from "express";
import { ITEM_CATALOG } from "../../shared/data/items";
import { ZONES } from "../../shared/data/zones";
import { ENEMIES } from "../../shared/data/enemies";
import { ESSENCE_UPGRADES } from "../../shared/data/essences";
import { OFFLINE_MAX_SECONDS, SAVE_VERSION } from "../../shared/constants/balance";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "idlebound-server" });
});

app.get("/api/game/config", (_request, response) => {
  response.json({
    saveVersion: SAVE_VERSION,
    offlineMaxSeconds: OFFLINE_MAX_SECONDS,
    combatAuthority: "client",
    note: "Le combat est calcule cote client pour le MVP Solo sans economie competitive."
  });
});

app.get("/api/zones", (_request, response) => {
  response.json({ zones: ZONES, enemies: ENEMIES });
});

app.get("/api/items", (_request, response) => {
  response.json({ items: ITEM_CATALOG, essenceUpgrades: ESSENCE_UPGRADES });
});

app.listen(port, () => {
  console.log(`Idlebound server listening on http://localhost:${port}`);
});
