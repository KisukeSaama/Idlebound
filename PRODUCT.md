# Idlebound: product

This document describes **what Idlebound is and why**, as built today. The code is the
source of truth for numbers; when you change a rule in `packages/game`, update this file in
the same change. Visual and UX rules live in [DESIGN.md](DESIGN.md); how to work in the
repository lives in [AGENTS.md](AGENTS.md).

## Vision

A free, browser-based fantasy idle clicker that can stand next to the best of the genre:
instant to start, satisfying to click, deep enough to come back to for weeks, and fair.

- **Free, no ads, no in-app purchases, no pay-to-win.** Everything is earned by playing.
- **Nothing to install.** Desktop and mobile browsers, French and English.
- **Try first, sign up later.** A guest can play immediately; creating an account keeps
  the run and puts the player on the leaderboard.
- **A leaderboard you can trust.** Every save is verified by the server with the same
  engine the client runs.

## Audience

Casual and incremental-game players who enjoy numbers going up, short active sessions
(boss fights, powers, crystals) and long passive ones (offline progress). The primary
market is French-speaking, with a full English version.

## Core loop

1. **Click** the monster to deal damage and earn gold. Critical hits deal ×10.
2. **Hire and level companions** with gold. They deal damage per second, even offline.
3. **Push stages.** Beat 10 monsters to unlock the next stage; beat the boss before its
   timer runs out.
4. **Ascend** once the Fallen King (stage 50) is beaten: restart from stage 1 in exchange
   for essences, which permanently boost damage and buy altars.
5. **Collect relics**, forge them, trade shards at the market, unlock achievements.

## World and progression

| Element | Rule |
|---|---|
| Stages | 10 monsters per stage. Technical cap at stage 3000 (floating-point precision). |
| Bosses | Every 5th stage: elite (mini-boss, ×6 HP). Every 10th stage: biome guardian (×10 HP). 30 s timer by default. Failing sends the player back one stage and pauses auto-advance ("farm" mode). |
| Biomes | 5 biomes of 10 stages: Verdant Plains, Dark Forest, Forgotten Caves, Corrupted Marsh, Fallen King's Ruins. |
| Eras | Each full loop of the 5 biomes (50 stages) starts a new era: tinted, prefixed and much tougher monsters (Echo, Ash, Void, Astral, Primordial…). |
| Golden rat | 1% base spawn chance on normal stages, ×10 gold. |
| Wandering crystal | Appears every 90 to 240 s while the tab is visible, stays 13 s. Gives gold (40%), overcharge DPS ×7 for 15 s (25%), sharpness click ×10 for 20 s (20%), 2 to 6 shards (12%) or essences (3%, only after a first ascension). |
| HP curve | Three segments (steep early, then ×1.15 then ×1.18 per stage) tuned so ascension income never outruns monster HP. |

### Companions

- **21 heroes.** Aldric is the click hero (the player): his levels raise click damage.
  The 20 others deal DPS, each unlocking after the previous one is hired.
- **Talents** at levels 10, 25, 50, 100 and 150 (Aldric: 10, 25, 50, 75, 100, 150, 200).
  Level-50 talents are unique effects (gold, crit chance, crit damage, boss timer, treasure
  chance, global DPS, click-as-DPS).
- **Automatic milestones:** ×3.5 hero DPS every 25 levels from level 200.
- **Bulk buying:** ×1, ×10, ×25, ×100 or Max. Cost grows ×1.07 per level (Aldric ×1.1).

### Powers (keys 1 to 6)

| Power | Unlock | Effect | Cooldown |
|---|---|---|---|
| Frenzy | Aldric 10 | 10 automatic clicks per second for 30 s | 10 min |
| Rallying Cry | Maëlle 25 | Companion DPS ×2 for 30 s | 10 min |
| Hawkeye | Ysolde 25 | +50% crit chance for 30 s | 20 min |
| Golden Rain | Brother Cinder 25 | Gold ×3 for 30 s | 30 min |
| Resonance Ritual | Nyx 25 | +5% DPS until next ascension, stacks | 60 min |
| Time Echo | Garrick 25 | Resets the last power's cooldown | 60 min |

### Ascension

- Available once stage 51 is reached (the Fallen King is beaten).
- Essences earned grow with the highest stage cleared, deliberately slower than monster HP.
- Each owned essence gives +10% DPS. Essences also buy **13 altars** (might, blade,
  fortune, patience, time, fate, precision, treasure, bargain, echoes, harvest, wanderer,
  memory): permanent bonuses, some capped, some unlimited.
- Ascension resets gold, hero levels, talents, stage, powers and run statistics. It keeps
  essences, altars, relics, shards, achievements and lifetime statistics.

### Relics and market

- **4 slots** (weapon, armor, amulet, ring), each with a fixed main stat (DPS, boss damage,
  click damage, gold).
- **5 rarities** (common, rare, epic, legendary, mythic) with 1 to 4 affixes; legendary and
  mythic add an ascension-essence affix. Power scales with the stage the item dropped at.
- Drops: biome guardians 40% (guaranteed on a first clear), elites 15%. Guardians also give
  shards.
- **Forge** (up to +20, +10% per level) costs shards; **salvaging** returns shards.
  Inventory holds 48 items (full inventory auto-salvages new drops).
- **Shard market:** relic chest, great chest (epic or better), rage potion (DPS ×2), fortune
  elixir (gold ×2), striking scroll (5 clicks/s), golden hourglass (1 h of gold now). Timed
  buffs last 10 min and stack up to 1 h.

### Achievements and statistics

- **75 achievements** in 18 series (stages, clicks, crits, kills, bosses, gold, golden rats,
  crystals, companion levels, hires, powers, ascensions, essences, legendaries, mythics, big
  hits, play time, boss failures). Each gives a permanent DPS bonus (+2% or +3%, the last two
  tiers of a series ×2.5); click damage gets half of it.
- Detailed run and lifetime statistics, ascension history.

### Offline progress

- Companions keep farming while the tab is closed: up to 8 h at 50% efficiency, improved by
  the Altar of the Wanderer (+1 h and +10% per level).
- A tab in the background for less than 15 min catches up at full efficiency.
- A summary modal greets the player after 60 s or more away.

### Balance targets

Validated by the bot simulation (`npm run balance`): stage 10 in about 2 min, stage 50 in
about 2 h, first ascension around 3 h, stage 100 in about 6 h, then steady progress carried
by ascensions. A test plays 6 h honestly with 24 saves to guarantee the anti-cheat never
rejects real play.

## Accounts

- Sign-up asks for **e-mail, username and password, nothing else**.
- Usernames: 3 to 16 characters (letters, digits, `-`, `_`), at least one letter, unique
  regardless of case and accents, reserved names blocked, strict FR/EN profanity filter that
  sees through leet-speak, accents, repeated letters and separators (usernames are public).
- Passwords: scrypt, common passwords refused, constant-time checks, no account enumeration.
- Sessions: 30 days sliding, httpOnly cookie; changing the password revokes every session.
- Forgotten password: single-use link valid 1 h, same answer whether the account exists.
- Self-service account deletion (GDPR) and a privacy page.
- Accounts inactive for 3 years are deleted, after a warning e-mail sent 30 days before
  (in the player's language). Without a configured SMTP server, nobody is warned, so
  nobody is deleted.

## Saves

- **Server-side only.** No local save, no import/export. A guest's run is not kept (the
  browser warns before leaving after 2 min of play).
- On sign-up or login, a fresh guest run adopts the account's save; a guest run that differs
  from the account's save triggers an explicit choice, never a silent overwrite.
- The client syncs every 30 s, when the tab is hidden and when the player logs out. Each save
  carries the revision it builds on; a newer save from another device triggers the choice.

## Anti-cheat

The game runs client-side, so the server cannot replay every click. It recomputes everything
deterministic with the shared engine (`packages/game/src/validation.ts`) and refuses a save
when a ledger does not hold: gold spent vs earned, essences spent vs collected, play time vs
real elapsed time, click and kill rates, gold per kill, boss beatable with the declared
power, item and achievement generation rules, no statistic going backwards, no backdated run.
Rejections are logged; only accepted saves feed the leaderboard, which keeps each player's
best verified values.

## Leaderboard

Public page with four boards: highest stage, ascensions, essences collected, achievements.
The landing page shows the top 10 by stage. Logged-in players see their own rank.

## Languages

French and English everywhere (site, game, API messages, e-mails). The language follows an
explicit choice made in the game's Settings window, otherwise the browser's languages. URLs
are English and prefixed by the locale (`/fr/play`, `/en/leaderboard`). French is the
default when the browser states no preference.

## Platform and SEO

- Landing page rendered on the server, full metadata, OpenGraph image, `VideoGame` and
  `FAQPage` JSON-LD, sitemap, robots, web manifest, `hreflang` alternates per language.
- Public, indexable leaderboard. Only production is indexable; the dev environment answers
  `noindex`.
- Hosted on the owner's platform (Traefik, GitLab CI). Production:
  `https://idlebound.kisukesaama.com`, development: `https://idlebound-d.kisukesaama.com`.

## Non-goals

- Monetization of any kind, ads or tracking.
- Local or exported saves.
- Real-time multiplayer, chat, guilds.
- Collecting any personal data beyond e-mail, username and password hash.
