# AGENTS.md

Guide for anyone (human or AI agent) changing this repository. Read it before writing code.

- [PRODUCT.md](PRODUCT.md): what the game is, its rules and numbers.
- [DESIGN.md](DESIGN.md): visual identity, layout, components, copy voice.
- [README.md](README.md): setup, commands, deployment.

The code is the source of truth. When you change behaviour described in one of these
documents, update the document in the same change.

## Non-negotiable rules

1. **Saves live on the server only.** No `localStorage`/IndexedDB save, no export/import.
   Browser storage may only hold small UI conveniences, never game state.
2. **Every save is verified.** Any change to `GameState`, to a formula, or to anything the
   player can earn or spend must keep `packages/game/src/validation.ts` correct, and the
   test "accepts a real multi-hour game saved regularly" must keep passing (no false
   positives on honest play).
3. **English codebase.** Identifiers, comments, log messages, test names, commit messages
   and docs are in English.
4. **Bilingual product.** Every user-facing string exists in French and English. Never
   hardcode a visible string in a component, the engine or the API.
5. **No em dash (—) in user-facing strings**, in either language, and **no emoji** anywhere
   in the UI: use the SVG icons of `apps/web/src/game/icons.tsx`.
6. **English, locale-prefixed URLs**: `/fr/...` and `/en/...`. The language is changed in
   the in-game Settings window, never with a header switcher.
7. **Use the design tokens** from `globals.css`; do not hardcode colors that have a token.
8. **Next.js 16 has breaking changes.** Before using a Next API, read the matching guide in
   `node_modules/next/dist/docs/` (for example: `middleware` is now `src/proxy.ts`, route
   `params` are Promises).
9. **Security defaults stay on**: nonce CSP (`apps/web/src/proxy.ts`), `X-Idlebound`
   header required on API writes, the API reachable only through the web container, rate
   limits, no account enumeration. Do not weaken them to make something work.

## Repository map

```text
packages/game/            @idlebound/game: pure TypeScript, shared by web and API
  src/data/               mechanics only: ids, numbers, colors, images (no player-facing text)
  src/content/            player-facing game text: fr.ts, en.ts (+ accessors in index.ts)
  src/i18n.ts             Locale type, negotiation (cookie > Accept-Language), cookie name
  src/engine.ts           GameEngine: mutable simulation, player actions, events
  src/formulas.ts         HP, gold, costs, derived stats (derive), offline gains
  src/save.ts             zod schema of GameState, migrateState, parseState
  src/validation.ts       anti-cheat: verifyState, verifyTransition, leaderboardSummary
  src/moderation.ts       username rules and profanity filter (returns reason codes)
  src/numbers.ts          number, duration and percent formatting
  scripts/                bot player + balance simulation (npm run balance)
apps/web/                 Next.js App Router, standalone output
  src/app/[locale]/       pages: landing, play, leaderboard, privacy, reset-password, 404
  src/app/api/[...path]/  proxy from the browser to the API (the API is not public)
  src/app/{robots,sitemap,manifest}.ts
  src/proxy.ts            nonce CSP + locale redirects (Next 16 "proxy", ex-middleware)
  src/i18n/               UI dictionaries (messages/<namespace>.ts), provider, routing
  src/game/               the game client: store, cloud sync, audio, components, windows
  src/components/         site chrome (nav, footer)
  src/lib/                API clients (browser and server), site config
apps/api/                 Hono on Node, bundled with esbuild
  src/routes/             auth, save, leaderboard
  src/lib/                sessions, passwords, rate limits, mail, i18n
  src/db/ + drizzle/      Drizzle schema and versioned SQL migrations
assets-src/               original art + optimize.py (WebP generation)
deploy/                   production compose, paths.env, app.env template
```

## Architecture in one page

- **Engine.** `GameEngine` owns a mutable `GameState` and a cached `Derived` (computed
  stats). The web `GameStore` ticks it every 50 ms and notifies React at most every 100 ms
  (immediately after a player action). The engine emits `GameEvent`s (hits, kills, loot,
  achievements, crystal rewards…) that drive sounds, toasts and effects without re-rendering.
- **Data vs content.** `data/` describes mechanics by id. `content/<locale>.ts` holds every
  name, description and lore line for that id. Components read text through
  `useI18n().g` or the helpers `monsterName`, `itemName`, `achievementText`, `talentName`,
  `biomeName`, `eraLabel`. Items store the index of their base noun (`base`) so their name
  follows the language; legacy items keep their stored French `name`.
- **Saves.** `CloudSync` (`apps/web/src/game/cloud.ts`) sends the whole state every 30 s,
  a few seconds after a player action (`store.act`, except attack clicks), when the tab is
  hidden and on logout, with the revision it builds on. The API
  (`routes/save.ts`) parses it with the shared zod schema, runs `verifyState` and, for the
  same lineage (`createdAt`), `verifyTransition` against the previous save and the elapsed
  server time. 409 = another device or run (the player chooses), 422 = anti-cheat rejection
  (logged in `save_rejections`), 200 = accepted and the leaderboard row keeps the best
  verified values.
- **Request path.** Browser → web container (Traefik) → `/api/*` route handler → API on the
  internal network → Postgres. Server components call the API directly
  (`lib/server-api.ts`, `INTERNAL_API_BASE_URL`).
- **Locale.** Explicit choice in cookie `ib_lang` (set from Settings), otherwise
  `Accept-Language`; no header means French, an unsupported language means English. The web
  proxy redirects unprefixed paths to `/<locale>/...` and legacy French paths (`/jouer`,
  `/classement`, `/confidentialite`, `/reinitialiser`) with a 308. The API reads the same
  cookie/header to localize its messages and e-mails.

## Working on text (i18n)

- **Game content** (names, descriptions, lore): add the entry to both
  `packages/game/src/content/fr.ts` and `en.ts`. The `GameText` type and the i18n test fail
  if one locale misses an entry.
- **UI strings**: add them to the right namespace in `apps/web/src/i18n/messages/`, in both
  `fr` and `en` (`defineMessages` makes the English object match the French shape).
  Strings with parameters are functions. Read them with `const { t } = useI18n()` in client
  components, `await getI18n(params)` in server components, `currentMessages()` outside
  React.
- **API messages and e-mails**: `apps/api/src/lib/i18n.ts`, locale from the request.
- **Anti-cheat and username errors** are codes (`Violation.code`, `UsernameIssue`); the
  message shown to the player is chosen by the client or the API from the code.
- **Numbers**: `formatNumber` is locale-independent; pass the locale to `formatDuration`
  and `formatPercent`.
- French copy uses *tutoiement*. English copy is idiomatic, not literal. See DESIGN.md.

## Recipes

- **New hero, monster, altar, power, market offer or achievement series**: add the
  mechanics in `packages/game/src/data/`, the text in both `content/` files, then check
  `validation.ts` (can the new thing be earned or spent? is it bounded?) and run
  `npm run balance` for anything that changes progression speed. Update PRODUCT.md.
- **New field in `GameState`**: add it to `types.ts`, `createInitialState`, the zod schema
  in `save.ts` (optional or defaulted through `migrateState` so old saves still parse), the
  relevant checks in `validation.ts`, and a test.
- **Id-indexed tables fed by save data** use `lookup()` (null prototype) and own-property
  reads, so an id like `constructor` cannot reach `Object.prototype`.
- **New page**: `apps/web/src/app/[locale]/<english-slug>/page.tsx`, add it to `ROUTES` in
  `src/i18n/routing.ts`, to `sitemap.ts`, give it localized metadata with canonical and
  `hreflang` alternates, and link to it with `href(locale, route)`.
- **New API route**: validate input with zod, rate-limit it, return `{ error, field? }` with
  a localized message, require the session with `currentUser` where needed, add a test in
  `apps/api/src/api.test.ts`.
- **Database change**: edit `apps/api/src/db/schema.ts`, run `npm run db:generate`, commit
  the generated SQL and snapshot. Migrations run when the API starts.
- **Art**: drop originals in `assets-src/original/`, run `npm run assets`, reference the
  WebP under `/assets/...`.

## Commands

| Command | What it does |
|---|---|
| `docker compose -f compose.dev.yml up` | Full dev stack: web :3000, API, Postgres, Mailpit :8025 |
| `npm run dev` | API (8080) + web (3000) without Docker (needs a Postgres in `.env`) |
| `npm run lint` | Type-checks the game package, the API and the web app |
| `npm test` | Vitest: engine, balance, anti-cheat, i18n; API tests when `TEST_DATABASE_URL` is set |
| `npm run build` | API bundle + Next.js build |
| `npm run balance -- 24 5` | Simulates 24 h of play at 5 clicks/s |
| `npm run db:generate` | New migration after a schema change |
| `npm run assets` | Regenerates WebP and the OpenGraph image |

In development the game store is exposed as `window.__idlebound` (e.g.
`__idlebound.act((engine, now) => engine.state.gold = 1e12)`).

## Before you hand work back

1. `npm run lint` is clean.
2. `npm test` passes (and API tests against a real Postgres when the API changed:
   `TEST_DATABASE_URL=postgres://idlebound:idlebound@localhost:5432/idlebound_test npm test`).
3. `npm run build` passes when you touched `apps/web` or `apps/api`.
4. For UI changes, check the page in both languages and at mobile width (≤ 900px).
5. No new French in code, no hardcoded visible string, no em dash or emoji in copy.
6. PRODUCT.md, DESIGN.md or README.md updated if behaviour, visuals or setup changed.

## Environment notes

- Line endings are LF in the repository (`.gitattributes`); `deploy/paths.env` and shell
  scripts break on the runner with CRLF.
- `next dev` writes `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` (Next's own agent notes);
  they are generated, keep them as they are.
- Deployment follows the platform docs of the `devops/docs` repository (Traefik, GitLab CI,
  `webapp` template). See README.md for the pipeline and CI variables.
