# Idlebound

A free fantasy idle clicker that runs in the browser, in French and English. Click to
strike, hire companions who fight for you, beat timed bosses, collect relics and ascend to
come back stronger. Progress is saved **on the server only** (e-mail + username + password
account) and every save is checked by an anti-cheat that replays the game rules.

- Production: `https://idlebound.kisukesaama.com` (deployed on `v*` tags)
- Development: `https://idlebound-d.kisukesaama.com` (manual deploy from `develop`)

| Document | Content |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Vision, game rules and numbers, accounts, saves, anti-cheat |
| [DESIGN.md](DESIGN.md) | Visual identity, tokens, layout, components, motion, copy voice |
| [AGENTS.md](AGENTS.md) | How to work in this repo: rules, architecture, i18n, recipes, checks |

## Stack

| Layer | Technology |
|---|---|
| Front | Next.js 16 (App Router, `standalone` output), React 19, hand-written CSS |
| API | Hono on Node 24, bundled into a single file with esbuild |
| Database | PostgreSQL 17 through Drizzle ORM (versioned SQL migrations) |
| Engine | `@idlebound/game`: pure TypeScript shared by the front and the API |
| i18n | French and English: game content in `packages/game/src/content`, UI in `apps/web/src/i18n` |
| Tests | Vitest (engine, balance, anti-cheat, i18n, API against a real Postgres) |
| Infra | Docker Compose (dev and prod), GitLab CI, Traefik (platform `devops/docs`) |

```text
apps/
  web/            Next.js: /[locale] landing, /[locale]/play, /[locale]/leaderboard, /api/* proxy
  api/            Hono + Drizzle: accounts, sessions, verified saves, leaderboard
packages/
  game/           game engine: data, content (fr/en), formulas, simulation, anti-cheat
    scripts/      bot player + balance simulation (npm run balance)
assets-src/       original art (PNG) + script that generates the WebP served by the front
deploy/           platform compose.yml, paths.env, app.env (deployed by the CI)
compose.dev.yml   full development environment (hot reload, Postgres, Mailpit)
compose.prod.yml  production images run locally, to check a release
```

## URLs and languages

| Page | French | English |
|---|---|---|
| Landing | `/fr` | `/en` |
| Game | `/fr/play` | `/en/play` |
| Leaderboard | `/fr/leaderboard` | `/en/leaderboard` |
| Privacy | `/fr/privacy` | `/en/privacy` |
| Password reset | `/fr/reset-password` | `/en/reset-password` |

`/` and any unprefixed path redirect to the visitor's language: the `ib_lang` cookie (set
from the in-game Settings window) wins, otherwise `Accept-Language` decides (French when the
browser sends nothing, English for unsupported languages). The former French URLs
(`/jouer`, `/classement`, `/confidentialite`, `/reinitialiser`) redirect permanently to their
`/fr/...` equivalent. Pages declare `hreflang` alternates and the sitemap lists both
languages.

## Getting started

### With Docker (recommended)

```bash
docker compose -f compose.dev.yml up
```

| Service | Address |
|---|---|
| Game | http://localhost:3000 |
| API | http://localhost:3000/api/… (proxied by the web app, as in production) |
| Dev e-mails (Mailpit) | http://localhost:8025 (password-reset links land here) |
| Postgres | `localhost:5432`, user/password/database `idlebound` |

In development the game store is exposed in the console:
`window.__idlebound.act((engine, now) => …)`.

### Without Docker

```bash
npm install
cp .env.example .env        # DATABASE_URL pointing to a local Postgres
npm run dev                 # API (8000) + web (3000)
```

### Check the production images

```bash
docker compose -f compose.prod.yml up --build     # → http://localhost:3000
```

Containers run as in production: non-root user, read-only file system, `cap_drop: ALL`,
no published API port.

## Commands

| Command | Purpose |
|---|---|
| `npm test` | All tests (API tests run when `TEST_DATABASE_URL` is set) |
| `npm run lint` | Type-checks the monorepo |
| `npm run build` | API bundle + Next.js build |
| `npm run balance -- 24 5` | Simulates 24 h of play at 5 clicks/s and prints the progression curve |
| `npm run db:generate` | Generates a migration after editing `apps/api/src/db/schema.ts` |
| `npm run assets` | Regenerates the WebP files and the OpenGraph image from `assets-src/original` |

API tests locally:

```bash
TEST_DATABASE_URL=postgres://idlebound:idlebound@localhost:5432/idlebound_test npm test
```

## Security at a glance

- Passwords hashed with scrypt, common passwords refused, no account enumeration (same
  answers and timing whether an account exists or not).
- Sessions: 256-bit random token in an `httpOnly`, `Secure`, `SameSite=Lax` cookie, only its
  SHA-256 stored, 30 days sliding, all revoked on password change.
- CSRF: `X-Idlebound` header required on every write, origin checked in production.
- Rate limits per IP and per account, plus a Traefik limit on `/api/auth/`.
- Nonce-based Content Security Policy on every page, strict security headers.
- The API and Postgres sit on an internal network; only the web container is exposed.

Details on accounts, saves and the anti-cheat are in [PRODUCT.md](PRODUCT.md).

## Deployment

Deployment follows `devops/docs` (`webapp` templates):

| Stage | Trigger |
|---|---|
| `test`: `npm ci`, `npm audit`, types, tests (Postgres as a service) | `develop`, `v*` tags, merge requests |
| `build`: `api` and `web` images pushed to the GitLab registry | `develop`, `v*` tags |
| `deploy_dev` → `idlebound-d.kisukesaama.com` | manual, from `develop` |
| `deploy_prod` → `idlebound.kisukesaama.com` | automatic on `v*` tags |

CI/CD variables (scoped per environment, "Protected" in production):

| Variable | Required | Purpose |
|---|---|---|
| `IDLEBOUND_POSTGRES_PASSWORD` | yes | Postgres password (no `@ : / ? # %` or spaces) |
| `IDLEBOUND_SMTP_URL` | no | `smtps://user:pass@host:465` for e-mails. With it, new accounts must confirm their address (checked at API start-up, see the logs). Without it, e-mails are written to the API logs, sign-ups are not confirmed, and inactive accounts are never warned nor deleted |
| `IDLEBOUND_MAIL_FROM` | no | E-mail sender |

Only the `web` container is on the `traefik` network; the API and Postgres are on an internal
network, and the API also has an `egress` network to reach the SMTP server. Migrations run
when the API starts. Only production is indexable by search engines (`SITE_INDEXABLE`); the
dev environment answers `noindex`.

Release a version:

```bash
git switch main && git merge --ff-only develop && git push
git tag v1.0.0 && git push origin v1.0.0
```
