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
   (crystals, powers, ascensions, gear), never a ratio taken from the away player. A closed
   game catches up the time it was closed when it opens again (a night at most).
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
| Bosses | Every 5th stage: elite (mini-boss, ×6 HP). Every 10th stage: biome guardian (×10 HP). 30 s timer by default. Failing sends the player back one stage and pauses auto-advance ("farm" mode). Up to stage 44, a guardian or an elite keeps its wounds: after a failed fight, the damage it took stays on it (up to 75% of its HP) until it falls, so a walker who keeps trying gets through; the Keep's gate (stage 45), the King and the strata below heal whole. |
| Biomes | 5 biomes of 10 stages, six normal creatures, an elite and a guardian each: the Verdant Plains (Field Rat, Jumpy Boar, Carrion Crow, Hollow Scarecrow, Lantern Moth, Dusk Hare; Last Reaper; Moss Alpha), the Dark Forest (Shade Wolf, Briar Witch, Grove Spinner, Mourning Owl, Toadstool Choir, Whispering Bramble; Root Knight; Heart of the Old Grove), the Forgotten Caves (Blind Crawler, Echo Bat, Crystal Mite, Drip Leech, Haunted Cart, Hollow Canary; Miner's Shade; Stone Devourer), the Corrupted Marsh (Bog Remnant, Rot Toad, Will-o'-Wisp, Drowned Courtier, Peat Cutter, Mire Heron; Mire Colossus; Baron of Rot) and the Fallen King's Ruins (Gargoyle of the Hours, Banner Wraith, Fallen Sentinel, Hollow Page, Hound of the Last Hunt, Candle Maid; Stone Warden; the King). |
| The King | The guardian of every 50th stage is the King, in the form of the stratum's Age: the Fallen King, the Titan King, the Hallowed King, the Star-Crowned, the Woven King, the Sketched King, the King's Name, the Sleeping King, the King at the Window, the Hollow Crown, the Blank King, then Aldemar. Same strength in every form. At stage 3000, the last one, the Dawn stands in his place. |
| Rare wanderers | One per biome (the Lost Shepherd, the Weeping Stag, the Singing Geode, the Ferryman, the Court Jester): 0.5% of the biome's normal spawns that are not a golden rat or an event, once a run at most, ×5 gold, a Chronicle fragment on the first defeat. |
| Eras | Each full loop of the 5 biomes (50 stages) starts a new era, a **stratum** with its own name (60 in all, from the present night to Dawn, in 12 Ages of five: the Kingdom, the Elder World, the Hallowed, the Making of the Stars, the Loom, the Draft, the Words, the Edge of Sleep, the Dreamer's Room, the Unmaking, the Blank, the First Mark): prefixed and much tougher monsters (Echo, Ash, Void, Astral, Primordial, Titan…), drawn with that era's treatment (each Age transforms creatures and scenes, and every era wears the places down; see DESIGN.md). |
| Golden rat | 1% base spawn chance on normal stages, ×10 gold. Chance capped at 25%. |
| Wandering crystal | Appears every 90 to 240 s while the tab is visible (sooner with Garrick's Lodestone, the Humming Loom or the Moth Lantern), stays 13 s (18 s with the Singing Stone). Gives gold (40%), overcharge DPS ×7 for 15 s (25%), sharpness click ×10 (DPS share included) for 20 s (20%), 2 to 6 shards (12%) or essences (3%, only after a first ascension). Gold = 15 monsters of the current stage; essences = 1 + 1 per 100 stages of the best stage ever. The first crystal of a new game comes after 75 s. One crystal in 20 is a **Crystal Storm**: the Lantern Queen crosses the sky and five crystals fall in turn, 3 s each, a normal reward roll each (only while the tab is visible). |
| HP curve | Three segments (steep early, then ×1.15 then ×1.18 per stage) tuned so ascension income never outruns monster HP. |

### Companions

- **21 heroes.** Aldric is the click hero (the player): his levels raise click damage.
  The 20 others deal DPS, each unlocking after the previous one is hired.
- **Talents** at levels 10, 25, 50, 100 and 150 (Aldric: 10, 25, 50, 75, 100, 150, 200).
  A companion's talents give ×2 DPS at 10 and 25, ×4 at 100 and 150, and a unique effect
  at 50 (gold, click damage, crit chance, crit damage, boss timer, treasure chance, global
  DPS, idle DPS); they cost the companion's base cost ×20, ×100, ×800, ×25,000 and
  ×2,500,000. Aldric's talents give click ×2 at 10, +5% crit chance at 50, click ×3 at 75
  and ×5 at 150; those at 25, 100 and 200 add 1%, 1% and 0.4% of companion DPS to every
  click.
- **Automatic milestones:** ×3.5 hero DPS every 25 levels from level 200.
- **Bulk buying:** ×1, ×10, ×25, ×100 or Max. Cost grows ×1.07 per level (Aldric ×1.1).

### Idle and active play

Like the best of the genre, clicks carry the start of each run and companions carry the
late game; mashing the mouse is never required.

- **Click damage** = (Aldric's own damage (levels, click talents, click relics, half the
  achievement bonus) + a **share of companion DPS**: 1%, 1% and 0.4% for Aldric's talents
  at levels 25, 100 and 200, 2.4% in all) × the Altar of the Blade (×1.10 per level on the
  whole strike). Aldric's own damage fades out after the first stages, so late clicks are
  worth that share of DPS, multiplied by crits and the Blade. Critical hits only apply to
  clicks.
- **Patience bonus** (idle bonus): companions keep a rhythm of their own: Sentinel's
  Vigil (Kaelen 50, +50%), Silent Legion (Morgrath 50, +100%) and the Altar of Patience
  (×1.14 per level, compounding: `1.14^level - 1`) add up. The walker's attack clicks
  **stand in for it, blow for blow**: each click's damage is taken off the bonus the
  companions deal next (an unused click waits 3 s of the bonus at most,
  `STRIKE_FILL_SECONDS`), and only clicks beyond it add. So clicking never costs anything:
  a light hand deals what the bonus would have, a heavy one more (`max(bonus, clicks)`).
  Quietus halves what clicks take. Automatic clicks (Frenzy, striking scroll) take
  nothing. Background and closed-game catch-ups count the whole bonus. A chip shows the
  bonus; while clicks stand in for part of it, it shows the company's share with a fill
  gauge, and its tooltip the share the clicks took.
- **Active bonus**: powers, crystals, crit investments and the Blade reward being there,
  within bounds: Altar of Fate capped at 5 levels (+100% crit damage), relic totals capped
  at +50% crit damage and +16% crit chance.
- **Feedback**: companion damage is continuous, but the scene shows it: every second, three
  shots in a companion's color fly from the party medallions to the monster (arrow, blade,
  claw, heavy blow or spell), which lights up on impact, and their damage floats once per
  second next to it, so passive damage is visible. The party shows the 5 strongest
  companions (3 on phones). Reduced motion removes the shots.
- **Targets** (checked by tests and `npm run balance -- 24 compare 5`, median of 5 seeds):
  with every talent and no altar, 5 clicks/s add about half of companion DPS; a click build
  with every crit investment maxed (no Blade) stays under 6× at 5 clicks/s. At 24 h (median
  of 9 seeds) every style stands within a quarter of the others and every clicking style
  at or above idle: the occasional player leads (back every hour for 10 minutes, the tab
  left open to the autopilot, ascending when a boss blocks the company: 890, 4 h of real
  play), then 10 clicks/s (860, +19% over idle), continuous bursts (813), 5/s (808), 2/s
  (768) and idle (724). The bot buys the Blade when its clicks lead the company (they deal
  more than the Patience bonus), Patience otherwise. 8 h in a background tab after 24 h of
  play adds 1 to 29 stages (median per profile), and the Reunion doubles the first hour
  back (+11 to +19 stages instead of +5 to +10). The 72 h bot (5 clicks/s, seed 42)
  reaches stage 1663 after 12 ascensions (500 at 15 h, 1000 at 26 h), and in a week 2028
  after 25, each ascension adding fewer stages past 1000 (+166, +128, +117, +107, +76,
  then about +30 in the last days): no runaway.
- **Real schedules** (hybrid simulation: active sessions played by the bot, the tab left
  open in between with the autopilot, closed at night): a newcomer (a first hour, then four
  15 min sessions a day) reaches stage 94 on day 1 and 379 on day 2; an engaged player
  (eight 20 min sessions a day) leads early (about 300 on day 1, 1280 on day 3), an
  occasional one catches up (within about 10% after two weeks, around 1550 against 1700).
  These figures predate the closed-game catch-up, the Patience rework and Density (no CLI
  mode to rerun them): nights now count up to 8 h, so every schedule is further along.
- **Known limit**: progress flattens over weeks (before the changes above, everyone
  converged toward stage 1500 to 1700 after two weeks; the one-week bot now stands at 2028,
  gaining about 30 stages an ascension). Late essence growth sits on a knife edge: 1.02 per stage
  converges, 1.025 already runs away to stage 3000 within a week.
- **The long game** (`npx tsx packages/game/scripts/longrun.ts [weeks] [seeds] [clicks/s]`,
  bot at 5 clicks/s around the clock, median of 5 seeds over 8 weeks): stage 1987 at day 7,
  2323 at day 14, 2530 at day 28, 2687 at day 56 without a Descent. The first Descent opens
  at day 8.7 (Eldra's Recognition 5 asks for 30 runs, the stage 1000 comes on day 2). It sets
  the walker back for about two weeks (2083 at day 14), then pulls ahead: descending once the
  threads reach 8 and the threads woven so far, 2 Descents and 2768 at day 56; at 4 threads
  and half the threads woven so far, 4 Descents and 2816. No seed reaches the Dawn in 8 weeks.
- The simulations above that go beyond `npm run balance -- <hours> <cps>` and `compare`
  (real schedules, ascension timing, altar leave-out runs, the 72 h bot) were run with the
  options of `packages/game/scripts/bot.ts` (`stagnationMs`, `altars`); they have no CLI
  mode yet.

### Powers (keys 1 to 7)

| Power | Unlock | Effect | Cooldown |
|---|---|---|---|
| Frenzy | Aldric 10 | 10 automatic clicks per second for 30 s | 10 min |
| Rallying Cry | Maëlle 25 | Companion DPS ×2 for 30 s | 10 min |
| Hawkeye | Ysolde 25 | +50% crit chance for 30 s | 20 min |
| Golden Rain | Brother Cinder 25 | Gold ×3 for 30 s | 30 min |
| Resonance Ritual | Nyx 25 | +5% DPS until next ascension, stacks | 60 min |
| Time Echo | Garrick 25 | Resets the last power's cooldown | 60 min |
| Unweave | The Seventh Night (a Weave of the Loom) | Skips the current stage (never a boss's) | 60 min |

The Altar of Echoes and Eldra's Locket lower the cooldowns together, never below 40% of
their base. The Vestment of Cinders makes Golden Rain last 45 s.

### Ascension

- Available once stage 51 is reached (the Fallen King is beaten). The ascension window is the
  Sanctum of Dusk; from level 5, an altar tells who raised it.
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
  | Blade | the whole strike ×1.10 (its DPS share included) | ×1.6 | none |
  | Fortune | gold ×1.12 | ×1.6 | none |
  | Patience | Patience bonus ×1.14 (added to the idle talents) | ×1.7 | none |
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
  (the company leads: patience; the clicks lead: blade; both: might and fortune). Per
  essence, Patience (×1.14 at ×1.7) is worth about a fifth more than Might (×1.10 at ×1.6)
  to a walker the company carries, the Blade as much as Might to one whose clicks lead,
  each on its own price ladder, so both are bought. (Before the rework of Patience and the
  Blade, the AFK simulation over 72 h reached stage 1684 with a sound choice, 1139 leaving
  out might, 1042 leaving out patience, 468 holding everything.)
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

### The Descent

The second layer of rebirth, for the long run (it keeps players apart after weeks of play).

- **Unlock**: a best stage of 1000 ever and Eldra's Recognition 5 (she shows her Loom).
- **A Descent** resets everything an ascension resets, plus the essences and the altars;
  it keeps relics, shards, deeds, the Chronicle, the Bestiary, Recognition, lifetime
  statistics and the best stage ever. It weaves **threads** from the essences gathered
  since the last Descent: `floor(2 × (log10(E) − 5))`, 0 under a million, 8 at 1e9, 20 at
  1e15.
- **Weaves** at Eldra's Loom, permanent, bought with threads (price `ceil(base × growth^level)`):

  | Weave | Effect per level | Cap |
  |---|---|---|
  | Warp of Plenty | Essences ×1.25 (multiplies) | none |
  | Knot of Dusk | Altar of the Wanderer +10 levels of cap | 5 |
  | The Long Thread | Catch-up cap +1 h (background tab or closed game) | 4 |
  | Humming Loom | Crystals come 10% sooner | 5 |
  | Kinship | Recognition tiers ask one run less | 3 |
  | Remembered Stones | 5% of each altar level survives a Descent | 5 |
  | Frayed Edge | Fragment chance +20% | 5 |
  | The Seventh Night | The seventh power, Unweave | 1 |

- Each Descent reopens the strata's keystones in a second reading. The Roll has a fifth
  board, Night (Descents, then the best stage).

### Relics and market

- **4 slots** (weapon, armor, amulet, ring), each with a fixed main stat (DPS, boss damage,
  click damage, gold). Boss damage applies to clicks and to companion DPS against bosses.
  Totals are capped for crit chance (+16%), essences (+100%) and
  critical damage (+50%).
- **5 rarities** (common, rare, epic, legendary, mythic) with 1 to 4 affixes; legendary and
  mythic add an ascension-essence affix. Power scales with the stage the item dropped at.
- **Density**: a worn relic multiplies companion damage (and the clicks' share of it) by
  ×1.03 per stratum below the present night it dropped in (`DENSITY_PER_STRATUM`, read
  from its level: no field of its own, so older items have it too). Four relics from the
  last stratum give about ×1,000, from stratum 21 (stage 1000) about ×11. The Ledger
  bounds it with the item level (never deeper than the best stage).
- Drops: biome guardians 40% (guaranteed on a first clear), elites 15%. Guardians give
  `1 + stage/25` shards, elites 1 shard 35% of the time. A drop goes straight to an empty
  equipment slot. Only the boss at the furthest stage of the run drops relics and shards: a boss
  replayed from the stage selector pays gold only.
- **Forge** (up to +20, +10% per level) costs `ceil(rarity shards × 2 × 1.35^forge)`;
  **salvaging** returns the rarity's shards (1, 3, 8… from common up) plus 50% per forge
  level. Items can be locked, salvaged in bulk up to a rarity, and unequipped. Inventory
  holds 48 items (full inventory auto-salvages new drops). The equipment window shows the
  shard balance beside its title on both tabs, once shards are revealed.
- **Shard market** (the Stallkeeper's stall; one of their twelve sayings at each visit):
  relic chest (30), great chest (160, epic or better), rage potion (20, DPS ×2), fortune
  elixir (20, gold ×2), striking scroll (25, 5 clicks/s), golden hourglass (60, 1 h of gold
  now). Timed buffs last 10 min and stack up to 1 h. Chests are refused when the inventory
  is full, the hourglass when it would pay nothing. The Stallkeeper's Token takes 10% off
  every price. From the third ascension, the Caravan (see Events) brings one more ware a
  week.

### The Chronicle

The story of the game is laid over its mechanics (docs/BIBLE.md). The save never stores a
line of text: it stores counters, and the n-th fragment of a source is always the same
(written by hand, then built by the fragment grammar in the voice of its source).

- **Bestiary** (Hall tab, from the first creature met): 63 Remnants on seven pages (the
  five biomes, Beyond the Road, the Twelve Kings), three lines each unlocked at 1, 100 and
  1,000 kills (1, 5 and 25 for rare wanderers and event creatures, 1, 10 and 100 for the
  King's forms), silhouettes for the ones not met yet. Meeting every creature of a biome's
  page gives **+1% gold** (five pages, +5%). Kills made in bulk (background catch-up, Altar
  of the Wanderer) are spread over the stage's creatures. Vorn's Biscuit gets a page of
  its own once the Good Boy secret is found.
- **Chronicle** (Hall tab, from the first fragment): every fragment found, by source, newest
  first (eight shown per source, more on demand), new ones marked until read (per source); the Hall button shows the unread count. Sources:
  - the **keystones** of the 60 strata (the first fall of each stratum's King) and, from
    the first Descent, each stratum's second reading, one per Descent;
  - 20 **milestones** of the walker's own story (ascensions 1, 5, 10, 25, 50, 100;
    Descents 1, 3, 5, 10; the first companions who remember, and whole companies);
  - the **King's Words**, one per ascension: 50 written, then his voice through the
    grammar (every night keeps its own); the seven words of his Eclipse, as it falls; in his Regalia, 12 words of their
    own (as a toast);
  - the **echoes** of the road: 12 per biome, then the grammar (a guardian's first clear
    brings the next back: always the first, then 15% + 5% per era);
  - the **Age echoes**: 8 per Age, then the grammar, brought back by the King's first fall
    in an Age, by every Seam closed and by the Quiet;
  - rare wanderers, events (their first time), Recognition memories (100), **Aldric's
    Lessons** (the first purchase of each of his seven talents), **Célestine's songs** (5%
    of the crystals caught once she has been met), **what stays after an absence** (a
    return after an hour or more in a hidden tab or a sleeping computer: one line over the
    scene for 6 s, no numbers), the Stallkeeper's twelve sayings (one per visit to the
    stall), named relic legends, altar legends (level 5), secrets and the Crown.
  - A fragment toast at most once a minute (keystones and milestones are always told); the
    others wait in the Chronicle. The
    Frayed Edge, Oriane's Ear (guardians) and Remembrance Nights make fragments more
    frequent.
- **The King's first refusals**: until the first ascension, the first time a session's King
  fight is lost, the failure toast carries his line "Come back when your hands stop shaking."
- **The Night list**: the ascension history written as one line per night, with the King's
  Word of that night.
- **The Ledger's scenes** (BIBLE 12.10): at a few key moments, a short scene of pixel shots
  with one line each plays over everything while the game runs on beneath (toasts wait for
  it). A press moves to the next shot, Escape or "Skip" ends it. One ships: **the First
  Dusk**, at the first ascension ever (the Keep and its King, "Night one", the King's first
  Word, the King going up in violet lights, the Sanctum's thirteen stones, the fields at
  dusk: about 25 s); its ascension toast then carries no quote. Whether a scene was lived
  derives from the state (the first dusk: one ascension or more), so the Chronicle's "What
  the Ledger saw" lists it on every device, to be watched again; saves already past it see
  it there at once.
- **Recognition**: a companion who reached level 100 in a run remembers the walker a
  little; tiers at 1, 3, 7, 15 and 30 such runs (one run less per level of Kinship), each a
  memory and a gold ring on the medallion, the fifth +10% DPS for that companion. Every
  companion greets the walker when hired, as a stranger, half remembered (tier 1 or 2) or
  remembered (tier 3 or more). Eight give a named relic at tier 5. Companions who remember
  at the same dusk share one toast; the one alone shows their memory.
- **Named relics** (24, legendary or mythic, found once per save, locked on arrival, room
  made for them even in a full pack, rolled at the level of the best stage), each with a
  fixed source and one unique effect:

  | Relic | Source | Effect |
  |---|---|---|
  | Oathcutter (weapon) | The King, 2% per fall at the head of a run | Damage to the King ×2 |
  | The Thousandth Arrow (weapon) | The Moss Alpha's 1,000th kill | +3% crit chance (within the cap) |
  | Quietus (weapon) | Morgrath's gift | Attack clicks take half as much of the Patience bonus's place |
  | The Unfinished Hammer (weapon) | Brom's gift | Forging costs 15% fewer shards |
  | Splinter of the Sky (weapon) | Guardians of the Astral stratum (era 4), 1% | +1 shard per guardian |
  | Dawnbreak (weapon) | The Dawn beaten after 5 Descents | +25% DPS during a Seam |
  | The Hollow Plate (armor) | The Stray Armor's first defeat | +2 s boss timer |
  | Mosshide (armor) | Moss Alpha from the Echo era on, 3% | +10% guardian gold |
  | Briar Mantle (armor) | Heart of the Old Grove from the Echo era on, 3% | Idle bonus ×1.1 |
  | Scales of Aurelion (armor) | Aurelion's gift | Damage to elites and guardians ×1.2 |
  | Vestment of Cinders (armor) | Guardians of the Ash stratum (era 2), 2% | Golden Rain lasts 45 s |
  | Mantle of the Last Court (armor) | The King from Age III, 1% | One of the Regalia |
  | Eldra's Locket (amulet) | Eldra's gift | -10% power cooldowns |
  | The Singing Stone (amulet) | The Singing Geode, 5% | Crystals stay 18 s |
  | Oriane's Ear (amulet) | Oriane's gift | +25% fragment chance from guardians |
  | Seed of the Old Grove (amulet) | Séraphine's gift | +10% click damage per companion who fully remembers (at most +100%) |
  | Morgrath's Phylactery (amulet) | A guardian while Morgrath stands at level 150, 1% | Idle bonus ×1.25, click damage ×0.75 |
  | The Last Decree (amulet) | The King from Age V, 1% | One of the Regalia |
  | Signet of Orvane (ring) | The King from Age II, 1% | One of the Regalia |
  | The Rat's Ring (ring) | Pip, 0.5% per catch | +2% golden rat chance (within the cap) |
  | Garrick's Lodestone (ring) | Garrick's gift | Crystals come 15% sooner |
  | Mirelle's Wedding Ring (ring) | Mirelle's gift | +25% gold, damage to the Baron of Rot ×1.5 |
  | The Stallkeeper's Token (ring) | The Caravan | -10% shard prices |
  | Ring of the Second Morning (ring) | Guardians of the Aurora stratum (era 19), 1% | The Altar of the Wanderer clears 5 more stages (within its caps) |

  The **Regalia of Orvane** (the Signet, the Mantle, the Decree) worn together: the King
  knows the walker (his words change) and takes 10% more damage. The **Crown of Orvane**
  never drops: from the tenth Descent a fifth slot appears in the equipment window, which
  cannot be filled.
- **Secrets** (20, no power): each a secret deed, hidden as "???" with its riddle until
  found, worth no bonus: Let Him Rest (the King's timer run out three times in a row at
  stage 50 without an attack), Even (100 golden rats in a run with Thorvald at level 50: a tiny gold rat sits on his medallion),
  Faceless (Nyx's portrait touched seven times in three seconds), Small Change (a mythic
  salvaged), Night Owl (an hour between midnight and 4 a.m.: the Hearthfields' moon turns
  full), the Thousandth Notch (1,000 kills on stages 1 to 10 in a run), Same Road (three
  ascensions in a row from the same stage), Keep Some (ascending with 1,000 essences and no
  altar bought since the last dusk), That's How It Starts (1,000 essences offered and none
  left; while none is held again, Aldric's face and name go grey in the companions panel), Empty Hands (the King at stage 50 beaten with no relic), Pacifist (stage 50 reached
  with Brother Cinder the strongest), the Last Second (a guardian beaten with half a second
  left, seven times: the Keep's gargoyle loses a claw), Listening (an hour in the Forgotten Caves, watched and untouched), Good
  Boy (Vorn at level 150 in ten runs), Till Death (the Baron beaten wearing Mirelle's ring),
  the Last Blow (the King beaten with Kaelen, who fully remembers, the strongest), It Wears
  You (the fifth slot held five seconds after the tenth Descent), Behind the Glass (the
  Keep's window, in the Dreamer's Room), Two Tongues (an hour in each language), Welcome
  Back (the game opened again after thirty days).
- Each run opens on stage 1 with one line in the scene: "Dusk again."

### Events of the Long Night

Only in a watched tab, never during a catch-up, drawn from the engine's RNG; a toast when
they begin and a fragment the first time.

| Event | Trigger | What happens |
|---|---|---|
| Crystal Storm | 1 crystal in 20 | The Lantern Queen crosses the sky; five crystals fall in turn, 3 s each. |
| The Seam | Normal stage 60+, 1 spawn in 400 | A Seam Warden (elite HP, 20 s). Beaten: an elite's drop, an Age echo. Escaped: nothing lost. |
| Pip's Wager | 1 golden rat in 10 | Pip stops: 13 strikes in 5 s and he pays ×30 instead of ×10; missed, he runs off. |
| Echo of a Walker | From 5 ascensions, 1% per guardian's first clear | Another walker's shadow (a name from the Roll) fights beside the company: DPS ×1.25 for 30 s. |
| The Caravan | From 3 ascensions, once a calendar week | The week's ware (the same for everyone, by ISO week): the Stallkeeper's Token (300), a Sealed Coffer (a legendary or better, 400), Bottled Night (2 h of gold, 100), Pip's Cheese (golden rats twice as often for 30 min, 45), a Moth Lantern (crystals every 45 to 90 s for 30 min, 60), an Ember Draught (rage and fortune, 35), Eldra's Thread (every power ready, 80), Three Crates (three relic chests, 75). |
| The Quiet | Void stratum and deeper, 1 spawn in 1,000 | A colorless creature, 10 s; sounds drop. Beaten: an Age echo. |
| Stray Armor | Once the Nameless is hired, 1 spawn in 2,000 | An empty armor walks across the road (30 s). The first defeat gives the Hollow Plate. |
| The King's Eclipse | Every 7th ascension, the next King | Shadowed, +50% HP, same timer; he always leaves a relic, and as he falls a word of his own (seven, in turn). |
| The Slow Tide | A return after 4 h or more | The next crystal comes within 20 s. |
| Remembrance Night | October 1st and December 21st | Fragments twice as often. No power. |
| The Migration | Era 1+, 1 new stage in 50 | For that stage, another biome's Remnants cross it. |
| The Unfinished | Age VI and deeper, 1 spawn in 200 | A Remnant half drawn; beaten, an echo of the Draft. |

### Achievements and statistics

- **154 achievements**: 134 in 26 series (stages, strata, clicks, crits, kills, bosses,
  Kings, Seams, gold, golden rats, crystals, companion levels, hires, powers, Recognition,
  ascensions, essences, Descents, legendaries, mythics, big hits, play time, boss failures,
  Bestiary, fragments, named relics), each a permanent DPS bonus (+2%; +3% for stages,
  ascensions and essences, +5% for the mythic one; the two highest tiers of a series ×2.5;
  click damage gets half of it), and 20 secret deeds with no bonus. Stages have a deed at
  the end of every Age from the third (750 to 2750, added later with ids 13 to 19, shown in
  order), gold one about every Age up to 1e225. Ids never change.
- Detailed run and lifetime statistics, ascension history.

### Playing in the background (AFK)

The game progresses while its tab is open, whether the player watches it or works, studies
or plays something else. Closed, the company walks on: the time is caught up when the game
opens again, within the same cap as a hidden tab.

- **Open tab, player away**: after 60 s without any action or input on the page, the
  **autopilot** takes over once a minute (its first action about 2 min after the last input): companions spend the gold (below) and, once they
  can beat the boss that stopped them, turn auto-advance back on and try again. Until then
  they train on the stage before it.
- **Hidden or throttled tab, computer asleep**: when the tab wakes up after a gap of more
  than 5 s, the time elapsed is simulated in one go (up to 8 h per gap), exactly as the
  autopilot would have played it: one-minute slices, spending between slices (a single
  slice when spending while away is off), stages pushed from the furthest one reached (bosses included, shards of
  biome bosses too, no item drops) until a boss companions cannot beat in time. They fight
  that boss once anyway, as an open tab would (a lost fight, its wounds kept up to stage
  44), then train on the stage before it and try again after each purchase. Companions fight
  alone: idle bonus in full, no clicks, powers, crystals or potions.
- **Closed game** (signed in): when the account's game loads, the time since its save is
  caught up by the same catch-up as a hidden tab (8 h at most, +1 h per level of the Long
  Thread), never more than the server saw pass since that save (`GET /save` returns
  `elapsedMs`: a device clock can be wrong). From 30 min away, the first input brings the
  Reunion and the company's account (road, gold earned and spent, walls, who joined,
  levels). An 8 h catch-up takes 0.1 to 0.2 s on a desktop (measured at stages 32, 97 and
  379). A live tab saves every 30 s, so reloading it loses nothing. A guest's game is not
  kept (see Saves): a guest reload starts over, as before.
- **Spending while away** (switch at the top of the companions panel, on by default): the
  next companion is hired (level 1) as soon as the gold allows, in shop order. Then each
  purchase is weighed by companion DPS gained per gold: a companion's levels up to their next
  breakpoint (the next talent level, 10, 25, 50, 100, 150, then every milestone: 200, 225,
  250...), with or without the talents it unlocks, or a talent already reached and left
  unbought. Levels never land between two breakpoints. The best purchase is bought; when it
  is out of reach but affordable within 5 minutes of the company's gold rate, companions save
  for it, otherwise they buy the best they can afford. A talent that adds no companion damage
  (gold, crits, boss time, treasure) is learned once it costs 10% of the gold at most.
  Aldric is never levelled. Turned off, the gold is kept.
- **What presence adds**, with no ratio applied to the away player: wandering crystals,
  powers, faster purchases, ascensions, altars, the shard market, gear and the forge.
- **Reunion** (*Retrouvailles*): back from 30 min or more away (no input on the page, or
  time a background tab or a closed game caught up), the player's first input brings a gold toast
  and companion damage ×3 for a sixth of the absence, counted from that moment and capped
  at an hour (a night gives the full hour). It never applies during the absence, catch-ups
  ignore it, and like every boon it cannot last more than an hour past the last tick
  (anti-cheat, where the damage bound counts it).
- **The company's account**: with the Reunion, the player sees what changed since their
  last input: time away, road from the furthest stage then to the furthest stage now, gold
  earned and spent, bosses that stopped the company then gave way, the last guardians
  passed, companions who joined, talents learned, levels gained per companion, and the boss
  that still bars the road. It covers everything the autopilot and the catch-ups did, and
  none of the player's own purchases (the account starts at the first tick after their last
  input). Kept in memory only, never in the save: a page loaded after the absence tells what
  its own catch-up did (the time the game was closed, within the cap). Shown once, at the Reunion's threshold (30 min); a shorter
  absence tells nothing and starts over.

### Balance targets

Validated by the bot simulation, median of 9 seeds at 5 clicks/s
(`npx tsx packages/game/scripts/milestones.ts 9`): stage 10 in 1 min 48, stage 50 in
1 h 41, first ascension at 2 h 53, stage 100 at 4 h 36, then steady progress carried by
ascensions. A naive walker (it buys the newest companion it can afford, never the best
value) loses 2 min 30 at the stage 30 guardian and 3 min at the stage 40 guardian (median of
9 seeds, `npx tsx packages/game/scripts/walls.ts 9`). The pace of a run is set by the gold a
monster carries: 1/30 of its HP (`GOLD_PER_HP`), ×2 at stage 1 tapering off to stage 10.
`npm run balance -- 24 compare 9` plays the same game as an occasional player, idle, in
bursts and at 2, 5 and 10 clicks/s to check the idle/active gap, the stages 8 h in a
background tab add and the first hour back with and without the Reunion. The balance
scripts play each seed (and each profile) in its own process, one per core: the 24 h
comparison takes about 4 minutes. Over 120 seeds the first ascension comes at 2 h 48
(median), 80% of walkers between 2 h 01 and 3 h 43. A test plays 6 h honestly with 24 saves to guarantee the anti-cheat never
rejects real play.

## Game screen

- A navigation rail opens the windows: map (stage selector and auto-advance), equipment and
  inventory, altars and ascension, market, Hall (achievements, statistics, leaderboard),
  account and settings. Badges (`!`, `+` or a count) flag an available ascension or altar,
  a nearly full inventory, enough shards for the market, an unconfirmed e-mail and the
  number of unread Chronicle fragments.
- The inventory sort and the board picked on the in-game Roll are remembered in this browser
  (closing the window or reloading keeps them); they are view conveniences, never game state.
- Settings: language, number notation (letters, scientific, engineering), sound and its volume,
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
  confirmation and sensitive account changes (`apps/api/src/routes/auth.ts`). Login counts
  guesses per address and account (8 per 15 min), so a stranger hammering someone's e-mail
  locks out only their own address; a looser ceiling (60 per 15 min) holds per account
  whatever the address.
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
  limited to 3 times per hour, and a guest run may predate sign-up by at most 30 days. A
  run replacing the account's game may claim no more time (play and time away) than the
  stored game had been credited, plus the time the server saw pass since that save. Two
  first saves sent at once keep the first written; the other gets the conflict. A save
  never goes back to an older version than the stored one.
- Logging out leaves a fresh guest game in the browser. A guest can start a new game from
  the account window; a signed-in player cannot erase the account's game (a save refused by
  the anti-cheat is left behind by reloading, which reads the last accepted one).
- The client syncs every 30 s, when the tab is hidden and when the player logs out. A player
  action (purchase, gear, ascension, settings…; not attack clicks), an achievement, a loot
  drop or a new biome also triggers a save 3 s later, with at least 15 s between uploads to
  stay under the API limit of 6 saves per minute. Each save
  carries the revision it builds on; a newer save from another device triggers the choice.
  A save refused by the anti-cheat is retried after 10 min; once the e-mail confirmation is
  overdue, saves are refused (403) until the address is confirmed.
- Every request gives up after 20 s. When the server cannot be reached at load (no network,
  timeout, or a 429 / 5xx from the proxy), the game never starts a blank guest game: it
  waits on a "Ledger out of reach" screen and tries again after 2 s, doubling up to 60 s,
  at once when the browser comes back online or on "Try now". Only a real "no session"
  answer lets a guest in. Signed in but unable to read the account's game, the client never
  uploads over it: the next sync reads it first. If the server goes away mid-session, the
  game keeps playing, the header shows "Server unreachable", syncs retry every 30 s and at
  once when the network returns, and leaving the page asks for confirmation.
- **A newer release moves open games onto it.** The CI builds the web image with the commit
  as its release; the `/api` proxy stamps every answer with it
  (`X-Idlebound-Release`). A page that sees another release than its own reloads onto it,
  but only a signed-in game the server keeps (never a guest's, never a game refused or
  waiting on its address, never while the account's game loads or a choice is open), and
  only once a last save is confirmed: the game loop stops, the save goes as keepalive, and
  input is held until the reload. A hidden tab goes at once. A watched one waits for 30 s
  without input with nothing open (window, dialog, Reunion) and no toast on screen, then
  fades out in 0.7 s; any input during the fade keeps the page, and a failed save leaves it
  playing (checked again every 5 s). A tab reloads at most once per release (session
  storage), so a stale cache cannot loop it. The reloaded page catches up the seconds the
  hand-over took, like any reload, and a page opened out of sight starts out of sight.
- In the choice between two games, keeping the current one when the account's game is
  further along (best stage, then play time) asks for confirmation, naming what will be
  erased (stage, ascensions, play time).
- **Save version 9** keeps two more things. The essences of every ascension in one ledger
  (the history holds only the last hundred): an older save gets the most its data proves,
  its history's sum or what its crystals cannot explain. And the engine's random generator:
  its state travels in the save, so a reload draws the same crystals, loot and events
  again (an older save is seeded from its creation date).
- **Save version 8** tells the whole story: the Kings beaten, Seams closed and threads woven,
  the Descent (Descents, threads, Weaves, the essences mark), the Caravan's week, the
  Chronicle's new counters (Age echoes, songs, returns, sayings, Lessons, events, altar
  legends, readings, what was read per source), the run's trail for the secrets, event
  creatures on the road and the "Keep the Kingdom's sky" setting. An older save starts them
  from their defaults; its Kings beaten are the Fallen King's falls the Bestiary counted,
  one per stratum crossed at least. Proved on the running server: a save written by the
  last release (version 4, stage 78, one ascension) is accepted, loads as version 8,
  verifies, plays on and saves again.
- **Save version 7** follows the redrawn bestiary: ten creatures became others in the same
  place of the road (the Rabid Rat the Carrion Crow, Greattusk the Last Reaper, the Blighted
  Boar the Grove Spinner, the Briar Matron the Root Knight, the Deep Wolf the Crystal Mite,
  the Howling Swarm the Miner's Shade, the Putrid Crawler the Rot Toad, the Marsh Hag the
  Will-o'-Wisp, the Spectral Hound the Gargoyle of the Hours, the Crown Bat the Banner
  Wraith). Their Bestiary kills carry over to their successor (a completed page stays
  complete) and a monster on the road becomes its successor.
- **Save version 6** adds the Chronicle (Bestiary kills, echoes, Recognition, named relics,
  secrets and the run's trail); an older save starts it empty and fills it by playing.
- **Save version 5** stores a monster by its id only: its look comes from the art recipe of
  that id. The painted image path, CSS filter and scale of older saves are dropped when they
  load; nothing else changes.

## Anti-cheat

The game runs client-side, so the server cannot replay every click. It recomputes everything
deterministic with the shared engine (`packages/game/src/validation.ts`) and refuses a save
when a ledger does not hold: gold spent vs earned, essences spent vs collected, play time vs
real elapsed time, click and kill rates, gold per kill, boss beatable with the declared
power, item and achievement generation rules (each deed once), no statistic going backwards,
no backdated run. Even a first save or a replacement, with no previous save to compare to, has
its ascensions and Descents bounded by the time the game ran (30 s each at least), its guardians by
its kills, its deepest stage by its kills and powers, its Ritual stacks by the powers used
this run, and its last tick by the server clock (10 min of slack for a device running ahead,
which also bounds the boons measured from it).
Every essence comes from an ascension or a crystal: the ledger of all ascensions holds at
least the history's sum and at most what the deepest stage pays per ascension (the Altar of
the Harvest taken at the most every essence gathered could buy), and between two saves the
essences gathered fit the ascensions and crystals between them. Crystals fall no faster
than the Lantern, the Lodestone and a full Humming Loom allow, five per call for a Storm.
Shards earned fit the guardians, Seams, crystals and salvaged items (forge refunds give back
at most 0.5 / 1.7 of what the forge took). Hourglasses are bought with shards (45 a bottled
hour at the cheapest), and each counts an hour of kills in the kill bound.
The schema bounds what the checks walk: stages up to 3000, weave levels up to 200, and every
record keyed by game ids to a size well above the game's data, so no save can make the
server spin. The schema and the checks live in `@idlebound/game/server` and never ship to
the browser.
The Chronicle is bounded the same way: Bestiary kills by lifetime kills (guardians by
bosses, the King's forms by Kings beaten, wanderers by runs, storms by play time, a walker's
echo by guardians), echoes by the strata reached, Age echoes by keystones, Seams and the
Quiet, songs by crystals, returns by time away, sayings by play time, Recognition by
ascensions, Lessons, events and altar legends by their tables, named relics by a source
the save reached (and their slot and rarity), secrets by their conditions. The Descent is
bounded by its unlock (stage 1000, Eldra's Recognition), threads by the essences gathered,
Weaves by their caps and the threads woven; Kings, Seams, threads, Descents, secrets and
the Chronicle's counters never go back.
Rejections are logged (kept 90 days, 30 per player and hour at most, one entry per code); a
refused save returns its first 20 violations. Only accepted saves feed the leaderboard, which
keeps each player's best verified values. Checks that need no stored save run before the
save's row is locked.

## Leaderboard

The **Roll of the Bound** (FR: *le Registre des Liés*): a public page with five boards, each
named in the fiction with its plain meaning beneath: **Depth** (highest stage), **Nights**
(ascensions), **Light** (essences collected), **Deeds** (achievements) and **Night**
(Descents, highest stage breaking ties). The landing page shows the top 10 by stage and the
number of ranked players. Logged-in players see their own rank, also in the Hall of the
game, where the Night board appears once the Descent is open to the walker. A row can be hidden by hand in the
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
- Every public page carries its own Open Graph and Twitter card (URL, title, description),
  so a shared link previews that page. The game page (`/play`) renders in the browser only:
  it answers `noindex, follow` and stays out of the sitemap, the landing carries searches.
  The sitemap states no `lastmod`.
- Public, indexable leaderboard. Only production is indexable; the dev environment answers
  `noindex`.
- Hosted on the owner's platform (Traefik, GitLab CI). Production:
  `https://idlebound.kisukesaama.com`, development: `https://idlebound-d.kisukesaama.com`.

## Non-goals

- Monetization of any kind, ads or tracking.
- Local or exported saves.
- Real-time multiplayer, chat, guilds.
- Collecting any personal data beyond e-mail, username and password hash.
