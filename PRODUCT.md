# Idlebound: product

This document describes **what Idlebound is and why**, as built today. The code is the
source of truth for numbers; when you change a rule in `packages/game`, update this file in
the same change. Visual and UX rules live in [DESIGN.md](DESIGN.md); how to work in the
repository lives in [AGENTS.md](AGENTS.md).

## Vision

A free, browser-based fantasy idle clicker that can stand next to the best of the genre:
instant to start, satisfying to click, deep enough to come back to for weeks, and fair.

**The two core pleasures of the genre**, used to settle design choices:

1. **Producing by simply letting the game run in the background.** With the tab open, the
   player can work, study or play something else: companions keep buying, pushing stages
   and retraining on their own, at full speed. Presence adds what only a player can do
   (crystals, powers, ascensions, gear), never a ratio taken from the away player. A closed tab stops the game.
2. **Turning a big number into an even bigger one.** Damage, gold and stages grow by
   visible leaps (milestones, talents, ascensions), and every screen shows them.

- **Free, no ads, no in-app purchases, no pay-to-win.** Everything is earned by playing.
- **Nothing to install.** Desktop and mobile browsers, French and English.
- **Try first, sign up later.** A guest can play immediately; creating an account keeps
  the run and puts the player on the leaderboard.
- **A leaderboard you can trust.** Every save is verified by the server with the same
  engine the client runs.

## Audience

Casual and incremental-game players who enjoy numbers going up, short active sessions
(boss fights, powers, crystals) and long passive ones (the tab left open while doing something else). The primary
market is French-speaking, with a full English version.

## Core loop

1. **Click** the monster to deal damage and earn gold. Critical hits deal ×10 (Nyx and
   Lysandre's level-50 talents add +3 and +5 to that multiplier).
2. **Hire and level companions** with gold. They deal damage per second, even while the
   player is away from an open tab,
   and take over from clicks as the run goes on (see "Idle and active play").
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
| Golden rat | 1% base spawn chance on normal stages, ×10 gold. Chance capped at 25%. |
| Wandering crystal | Appears every 90 to 240 s while the tab is visible, stays 13 s. Gives gold (40%), overcharge DPS ×7 for 15 s (25%), sharpness click ×10 (DPS share included) for 20 s (20%), 2 to 6 shards (12%) or essences (3%, only after a first ascension). Gold = 15 monsters of the current stage; essences = 1 + 1 per 100 stages of the best stage ever. The first crystal of a new game comes after 75 s. |
| HP curve | Three segments (steep early, then ×1.15 then ×1.18 per stage) tuned so ascension income never outruns monster HP. |

### Companions

- **21 heroes.** Aldric is the click hero (the player): his levels raise click damage.
  The 20 others deal DPS, each unlocking after the previous one is hired.
- **Talents** at levels 10, 25, 50, 100 and 150 (Aldric: 10, 25, 50, 75, 100, 150, 200).
  A companion's talents give ×2 DPS at 10 and 25, ×4 at 100 and 150, and a unique effect
  at 50 (gold, click damage, crit chance, crit damage, boss timer, treasure chance, global
  DPS, idle DPS); they cost the companion's base cost ×20, ×100, ×800, ×25,000 and
  ×2,500,000. Aldric's talents give click ×2 at 10, +5% crit chance at 50, click ×3 at 75
  and ×5 at 150; those at 25, 100 and 200 each add 1% of companion DPS to every click.
- **Automatic milestones:** ×3.5 hero DPS every 25 levels from level 200.
- **Bulk buying:** ×1, ×10, ×25, ×100 or Max. Cost grows ×1.07 per level (Aldric ×1.1).

### Idle and active play

Like the best of the genre, clicks carry the start of each run and companions carry the
late game; mashing the mouse is never required.

- **Click damage** = Aldric's own damage (levels, click talents, Altar of the Blade, click
  relics, half the achievement bonus) + a **share of companion DPS**: 1% per Aldric talent
  at levels 25, 100 and 200 (3%), raised by the Altar of the Blade (+5% of that share per
  level, up to +50%, so 4.5% at most). Aldric's own damage fades out after the first
  stages, so late clicks are worth that share of DPS, multiplied by crits. Critical hits
  only apply to clicks.
- **Idle bonus**: companions deal more while the player does not attack the monster:
  Sentinel's Vigil (Kaelen 50, +50%), Silent Legion (Morgrath 50, +100%) and the Altar of
  Patience (×1.15 per level, compounding: `1.15^level - 1`) add up. An attack click resets it; it starts growing again
  3 s later and is back in full 30 s after the click, so an occasional click costs little.
  Clicks never include it. Automatic clicks (Frenzy, striking scroll), powers, crystals
  and purchases do not reset it. Background catch-ups always count as fully idle. A chip shows
  the bonus with its current value and a fill gauge; its tooltip gives the seconds left
  while it builds up.
- **Active bonus**: powers, crystals and crit investments reward being there, within
  bounds: Altar of Fate capped at 5 levels (+100% crit damage), relic totals capped at +50%
  crit damage and +16% crit chance, Blade share capped at +50%.
- **Feedback**: companion damage is continuous, but the scene shows it: every second, three
  shots in a companion's color fly from the party medallions to the monster (arrow, blade,
  claw, heavy blow or spell), which lights up on impact, and their damage floats once per
  second next to it, so passive damage is visible. The party shows the 5 strongest
  companions (3 on phones). Reduced motion removes the shots.
- **Targets** (checked by tests and `npm run balance -- 24 compare 5`, median of 5 seeds):
  with every talent and no altar, 5 clicks/s add about half of companion DPS; a click build
  with every crit investment maxed stays under 6× at 5 clicks/s. Clicking leads the first
  hours (stage 105 at 3 h at 10 clicks/s vs 55 idle); by 24 h every style stands within a
  quarter of the others: occasional bursts (784), sustained clicking at 10/s (761), idle
  (683), 5/s (683) and 2/s (636). 8 h in a background tab after 24 h of play adds 1 to 30
  stages (median per profile): less than an evening of play, since powers, crystals and
  ascensions are what push the walls. The 72 h bot reaches stage 1066 after 12 ascensions,
  slowing down smoothly (no runaway).
- **Real schedules** (hybrid simulation: active sessions played by the bot, the tab left
  open in between with the autopilot, closed at night): a newcomer (a first hour, then four
  15 min sessions a day) reaches stage 94 on day 1 and 379 on day 2; an engaged player
  (eight 20 min sessions a day) leads early (about 300 on day 1, 1280 on day 3), an
  occasional one catches up (within about 10% after two weeks, around 1550 against 1700).
- **Known limit**: progress flattens over weeks (everyone converges toward stage 1500 to
  1700 after two weeks). Late essence growth sits on a knife edge: 1.02 per stage
  converges, 1.025 already runs away to stage 3000 within a week. Keeping players apart in
  the long run needs a second prestige layer; until then the essence leaderboard (orders of
  magnitude apart) is the long-run ranking.
- The simulations above that go beyond `npm run balance -- <hours> <cps>` and `compare`
  (real schedules, ascension timing, altar leave-out runs, the 72 h bot) were run with the
  options of `packages/game/scripts/bot.ts` (`stagnationMs`, `altars`); they have no CLI
  mode yet.

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
- Essences earned grow with the highest stage cleared in the run (`20 × 1.075^(h - 50)` up
  to stage 140, then +2% per stage, plus 3 per stage past 50; a first ascension pays 65 when stage 60 is
  reached, 71 once it is cleared), deliberately slower than monster HP: pushing a few more stages
  pays, farming a wall for hours does not. The fastest progress comes from ascending soon
  after progress stalls (AFK simulation, 72 h: stage 1776 when ascending 5 min after the
  last new stage, 1684 after 20 min, 1323 after 1 h, 810 after 3 h).
- Each owned essence gives +10% DPS. Essences also buy **13 altars**, permanent bonuses
  kept across ascensions. Every level costs `base × growth^level` (bases: 1 for Might, Blade,
  Fortune and Patience, 2 for Time, 3 for Fate, Precision and Treasure, 4 for Bargain, 5 for
  Echoes and Harvest, 10 for Wanderer and Memory):

  | Altar | Effect per level | Price growth | Cap |
  |---|---|---|---|
  | Might | DPS ×1.10 | ×1.6 | none |
  | Blade | click damage ×1.15, +5% of the click's DPS share (up to +50%) | ×1.6 | none |
  | Fortune | gold ×1.12 | ×1.6 | none |
  | Patience | idle bonus ×1.15 (added to the idle talents) | ×1.7 | none |
  | Time | +1 s boss timer | ×1.35 | 30 |
  | Fate | +20% critical damage | ×2 | 5 |
  | Precision | +1% crit chance | ×1.3 | 25 |
  | Treasure | +0.5% golden rat chance | ×1.35 | 20 |
  | Bargain | -2% companion cost (never below half price) | ×1.4 | 25 |
  | Echoes | -5% power cooldowns | ×1.6 | 10 |
  | Harvest | +10% essences | ×1.3 | none |
  | Wanderer | 10 stages cleared at the start of each run | ×1.8 | 10 |
  | Memory | starting gold of 100 monsters of stage 5 × level | ×1.5 | 20 |

- **Spending versus holding** is the core decision: the open-ended altars multiply at each
  level against an exponential price, so the best split keeps about half the essences in
  hand at every stage of the game, and which altars to feed depends on the play style
  (idle: patience, clicks: blade, both: might and fortune). In the AFK simulation over
  72 h, a sound choice reaches stage 1684, leaving out might 1139, leaving out patience
  1042, holding everything 468.
- **Wanderer**: companions clear the first stages of a new run at once, with their kills
  and gold, never more than half the stage record (a multiple of 5, so a run never starts
  on a boss). Those stages do not pay essences again at the next ascension, give no shards
  or items, and a run must clear at least one stage by itself before ascending.
- Ascension resets gold, hero levels, talents, stage, powers and run statistics. It keeps
  essences, altars, relics, shards, achievements, lifetime statistics and running timed
  buffs (potions, overcharge). The ascension history keeps the last 100 entries.
- **Save version 4** reworked the altars: every level of an older save is refunded in
  essences at the old prices (on the server and in the client) and a one-time notice
  invites the player to choose again. The same version made the essence formula about four
  times more generous (20 instead of 5 as its base, 3 instead of 1 per stage past 50); since
  it only grew, older ascension records and the essence leaderboard stay valid.

### Relics and market

- **4 slots** (weapon, armor, amulet, ring), each with a fixed main stat (DPS, boss damage,
  click damage, gold). Boss damage applies to clicks and to companion DPS against bosses.
  Totals are capped for crit chance (+16%), essences (+100%) and
  critical damage (+50%).
- **5 rarities** (common, rare, epic, legendary, mythic) with 1 to 4 affixes; legendary and
  mythic add an ascension-essence affix. Power scales with the stage the item dropped at.
- Drops: biome guardians 40% (guaranteed on a first clear), elites 15%. Guardians give
  `1 + stage/25` shards, elites 1 shard 35% of the time. A drop goes straight to an empty
  equipment slot. Only the boss at the furthest stage of the run drops relics and shards: a boss
  replayed from the stage selector pays gold only.
- **Forge** (up to +20, +10% per level) costs `ceil(rarity shards × 2 × 1.35^forge)`;
  **salvaging** returns the rarity's shards (1, 3, 8… from common up) plus 50% per forge
  level. Items can be locked, salvaged in bulk up to a rarity, and unequipped. Inventory
  holds 48 items (full inventory auto-salvages new drops).
- **Shard market:** relic chest (30), great chest (160, epic or better), rage potion (20,
  DPS ×2), fortune elixir (20, gold ×2), striking scroll (25, 5 clicks/s), golden hourglass
  (60, 1 h of gold now). Timed buffs last 10 min and stack up to 1 h. Chests are refused
  when the inventory is full, the hourglass when it would pay nothing.

### Achievements and statistics

- **75 achievements** in 18 series (stages, clicks, crits, kills, bosses, gold, golden rats,
  crystals, companion levels, hires, powers, ascensions, essences, legendaries, mythics, big
  hits, play time, boss failures). Each gives a permanent DPS bonus (+2%; +3% for ascensions
  and essences, +5% for the mythic one; the last two tiers of a series ×2.5); click damage gets half of it.
- Detailed run and lifetime statistics, ascension history.

### Playing in the background (AFK)

The game progresses while its tab is open, whether the player watches it or works, studies
or plays something else. It does not progress while it is closed.

- **Open tab, player away**: after 60 s without any action or input on the page, the
  **autopilot** takes over once a minute (its first action about 2 min after the last input): companions spend the gold (below) and, once they
  can beat the boss that stopped them, turn auto-advance back on and try again. Until then
  they train on the stage before it.
- **Hidden or throttled tab, computer asleep**: when the tab wakes up after a gap of more
  than 5 s, the time elapsed is simulated in one go (up to 8 h per gap), exactly as the
  autopilot would have played it: one-minute slices, spending between slices (a single
  slice when spending while away is off), stages pushed from the furthest one reached (bosses included, shards of
  biome bosses too, no item drops) until a boss companions cannot beat in time, then
  training on the stage before it and trying again after each purchase. Companions fight
  alone: idle bonus in full, no clicks, powers, crystals or potions.
- **Closed tab**: nothing. A freshly opened page skips the time since the last save; only
  a tab that was already running the game gets it back: one the browser discarded to save
  memory (`document.wasDiscarded` in Chromium) or that was reloaded, told apart by a
  per-tab `sessionStorage` flag (`ib_tab`, Firefox and Safari included). A live tab saves
  every 30 s, so reloading it loses nothing.
- **Spending while away** (switch at the top of the companions panel, on by default): every affordable talent, then
  companion levels by best DPS gained per gold, by batches up to the next 25-level
  milestone. Aldric is never levelled. Turned off, the gold is kept.
- **What presence adds**, with no ratio applied to the away player: wandering crystals,
  powers, faster purchases, ascensions, altars, the shard market, gear and the forge.
- No summary when the player comes back: comparing with what they remember is part of
  the game.

### Balance targets

Validated by the bot simulation (`npm run balance`): stage 10 in about 2 min, stage 50 in
about 1.5 to 2 h, first ascension around 3 h, stage 100 in about 4 to 6 h, then steady
progress carried by ascensions. `npm run balance -- 24 compare` plays the same game idle, in occasional
bursts and at 2, 5 and 10 clicks/s to check the idle/active gap, and the stages 8 h in a background tab add. A test plays 6 h honestly with 24 saves to guarantee the anti-cheat never
rejects real play.

## Game screen

- A navigation rail opens the windows: map (stage selector and auto-advance), equipment and
  inventory, altars and ascension, market, Hall (achievements, statistics, leaderboard),
  account and settings. Badges (`!`, `+` or a count) flag an available ascension or altar,
  a nearly full inventory, enough shards for the market and an unconfirmed e-mail.
- Settings: language, number notation (letters, scientific, engineering), sound and volume,
  damage numbers, reduced motion, ascension confirmation.
- One-time tutorial hints guide the first minutes; saves that had ascended before version 4
  get a one-time notice about the altar rework.

## Accounts

- Sign-up asks for **e-mail, username and password (typed twice), nothing else**.
- **E-mail confirmation**, only when an SMTP server is configured (otherwise the address is
  accepted as is). The player plays and saves right away; the account window shows the
  deadline, a "resend" button and a way to fix a mistyped address (password required).
  After **3 days** without confirmation, saves are refused until the link is clicked (the
  game stays playable, the account icon shows `!`). Links are valid 7 days, a new one
  voids the previous one. A password reset through the e-mail link also confirms the
  address. Fixing the address does not extend the deadline. An account never confirmed is deleted 30 days after sign-up. Accounts created
  before this rule are considered confirmed.
- Usernames: 3 to 16 characters (letters, digits, `-`, `_`), at least one letter, unique
  regardless of case and accents, reserved names blocked, strict FR/EN profanity filter that
  sees through leet-speak, accents, repeated letters and separators (usernames are public).
- Passwords: 8 to 128 characters, not a common password, not a single repeated character,
  not containing the username nor equal to the e-mail; scrypt, constant-time checks, no
  account enumeration.
- Sessions: 30 days sliding, httpOnly cookie; changing the password revokes every session
  and every pending reset link.
- Rate limits per IP and per account on sign-up, login, forgotten password, e-mail
  confirmation and sensitive account changes (`apps/api/src/routes/auth.ts`).
- Forgotten password: single-use link valid 1 h, same answer whether the account exists.
- Self-service account deletion (GDPR) and a privacy page.
- E-mails (confirmation, password reset, inactivity warning) share one template in
  `apps/api/src/lib/mail.ts`: see DESIGN.md.
- Accounts inactive for 3 years are deleted, after a warning e-mail sent 30 days before
  (in the player's language). Without a configured SMTP server, nobody is warned, so
  nobody is deleted.

## Saves

- **Server-side only.** No local save, no import/export. A guest's run is not kept (the
  browser warns before leaving after 2 min of play).
- On sign-up or login, a fresh guest run (under 90 s of play, no ascension, best stage 3 or
  less) or the same run adopts the account's save; a guest run that differs from it triggers
  an explicit choice, never a silent overwrite. Replacing the cloud save with another run is
  limited to 3 times per hour, and a guest run may predate sign-up by at most 30 days.
- Logging out leaves a fresh guest game in the browser; the account window also offers a
  new game, which replaces the server save.
- The client syncs every 30 s, when the tab is hidden and when the player logs out. A player
  action (purchase, gear, ascension, settings…; not attack clicks), an achievement, a loot
  drop or a new biome also triggers a save 3 s later, with at least 15 s between uploads to
  stay under the API limit of 6 saves per minute. Each save
  carries the revision it builds on; a newer save from another device triggers the choice.
  A save refused by the anti-cheat is retried after 10 min; once the e-mail confirmation is
  overdue, saves are refused (403) until the address is confirmed.

## Anti-cheat

The game runs client-side, so the server cannot replay every click. It recomputes everything
deterministic with the shared engine (`packages/game/src/validation.ts`) and refuses a save
when a ledger does not hold: gold spent vs earned, essences spent vs collected, play time vs
real elapsed time, click and kill rates, gold per kill, boss beatable with the declared
power, item and achievement generation rules, no statistic going backwards, no backdated run.
Rejections are logged (kept 90 days); only accepted saves feed the leaderboard, which keeps each player's
best verified values.

## Leaderboard

Public page with four boards: highest stage, ascensions, essences collected, achievements.
The landing page shows the top 10 by stage and the number of ranked players. Logged-in
players see their own rank, also in the Hall of the game. A row can be hidden by hand in the
database (`hidden` flag), for moderation.

## Languages

French and English everywhere (site, game, API messages, e-mails). The language follows an
explicit choice made in the game's Settings window, otherwise the browser's languages. URLs
are English and prefixed by the locale (`/fr/play`, `/en/leaderboard`). French is the
default when the browser states no preference, English when it prefers an unsupported
language.

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
