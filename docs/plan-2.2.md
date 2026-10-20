# Plan 2.2: the market, the shards, the Descent's weight

Working plan, written 2026-10-20 after 2.1 shipped. Delete this file in the change that
finishes it. AGENTS.md rules apply throughout (Done means, balance targets, writing,
progressive interface, save versions, validation, patch note).

## Why

Player feedback on Discord after 2.1, from a deep walker (6 Descents, 228 ascensions, 675K
shards), judged legitimate:

1. **The Descent no longer feels like a sacrifice.** It keeps a tenth of the essences
   (`DESCENT_KEEP`). The four open altars cost ×1.6 a level (Patience ×1.7), so the last levels
   are almost the whole spend: a tenth buys back every altar but about 5 levels, on top of the
   Memory Stones' 25% of levels kept. The walker "could get his altars back". A reset whose cost
   is not felt is no longer a decision.
2. **Shards have nothing worth buying.** The market sells the same six offers at fixed prices
   (chest 30, great chest 160, rage 20, fortune 20, autoclick 25, golden hourglass 60), without
   limit, always there. No rarity, nothing to miss, no reason to open the window. The Caravan,
   once a week, is the only scarcity.
3. **Market boons stack without end** (`MARKET_BUFFS` skip `BUFF_MAX_SECONDS`): 20 shards per
   10 min, so 675K shards bought about 10,000 h each of ×2 damage, ×2 gold and auto-strikes. Not
   a cheat (bounded by shards earned), but for a deep walker the boons are permanent and the
   shards meaningless.

Context: the game is about to become a Discord Activity with a few paid elements. The economy
must be sound before anything is sold: a nerf after a purchase is a breach of trust. Paid
elements stay outside the shard economy and outside ranked power (cosmetic, comfort, content
on the side). Players know they take part in an experiment: bold changes are fine, taking back
what they own is not.

## What to do

### 1. The Descent's weight

- Make the Descent cost felt again, and measure before choosing. Lead option: keep a hundredth
  of the essences instead of a tenth (about 10 altar levels lost instead of 5). Alternative:
  keep the tenth and make the climb back visibly faster (threads and Weaves that speed the first
  stages). Prefer the first unless the sims say otherwise.
- Targets: the record still regained within a few hours for the first Descents (2.1 measured
  5 to 6 h for Descents 1 to 4, 9 to 15 h after), the descender still ahead of the walker who
  never descends from day 2 or 3, no runaway below the Dawn (the Warp of Plenty at ×1.25 a level
  is a knife edge: rerun the long run), the deep road at least 5 stages a day at 10,000.
- Tools: `packages/game/scripts/descent.ts` (the Descent against the walker who never
  descends), `npm run sims -- 9 deep`.
- Texts: the Descent window ("Elle laisse : un dixième de tes essences"), the wiki, PRODUCT.

### 2. Market boons capped

- Cap the stacked time of market boons (start from 24 h; `BUFF_MAX_SECONDS` stays for the
  others). New purchases only.
- Existing saves: time already bought beyond the cap is refunded in shards at the price paid,
  in `migrateState`, announced once to the walker. Never take it away silently.
- Validation: bounds and a rejection test for a boon past the cap.

### 3. The market rework: rarity and a reason to come back

- **A stall that changes at every dusk** (or at a fixed hour, with a countdown): the
  Stallkeeper lays out 4 to 6 wares, each with a rarity, in limited quantity. A ware bought is
  gone until the next stall. Drawn from the engine RNG so every device shows the same stall,
  and the server can verify it.
- **A rare place**: now and then an exceptional ware: a relic of a chosen place and slot (to
  finish a set), a named relic, a relic with a guaranteed trait. The "I must have it" moment.
- **A sink that never runs dry**: shards spent at Brom's forge to raise or reroll a relic's
  trait, priced by depth, so a deep stock of shards has value without making anyone permanent.
- **The Caravan** keeps its weekly visit, more marked: an offer the stall never makes.
- The boons and chests may stay in the stall's rotation rather than always on sale; decide with
  the sims (shard income by depth).
- A reason in the world (BIBLE 6): the Stallkeeper sells what the road brings, which is why the
  stall changes. Glossary: the market kept by the Stallkeeper (marché, le Comptoir), never
  échoppe or étal in game text.
- Progressive interface: the market's new parts appear when usable; saves past the threshold
  see them at once.
- Everything earned or spent covered by `validation.ts`, with rejection tests; the honest-play
  test green; save version bumped with a migration test.
- The interface: the stall's wares, rarity, stock and countdown readable at a glance, desktop
  and phone, reduced motion; the rare place should feel like an event (light, sound) without
  breaking the Armurerie direction (DESIGN.md).

### Still open after 2.2 (2026-10-20)

Everything above shipped on develop, except the long run below: with the 2.2 rules (the
Descent leaving a hundredth), seeds 1 to 3 were played from stage 3000 to day 16-17 (4938,
5199, 4892) before the run was stopped for lack of memory; near stage 5000 one simulated day
takes about 14 minutes a seed, so stage 10,000 (day 180 or so) asks about two days of
machine time. Run it on its own: `BALANCE_WORKERS=3 DEEP_FAST=1 npx tsx
packages/game/scripts/deep.ts deep active 3000 3 400 10000`, then delete this file.

### 4. Left from 2.1

- See Eldra's Hourglass and Woven Habits working in the running app (a game past a Descent is
  needed: build one with the sims' states or a dev save).
- Measure the realistic walker past stage 1500 (not measured for 2.1).
- The long run to 10,000: only seed 3 reached it in 2.1 (day 176); seeds 1 and 2 stopped at
  8618 and 9690. Run it to the end.

## Release

- Version 2.2.0 (`npm version 2.2.0 --no-git-tag-version`, checked against `origin/main`).
- CHANGES.md lines under "Next version".
- The 2.2 patch note in `posts.ts`: say plainly and warmly why the market and the Descent
  change ("we are still finding the game's balance, here is why"), the refund of capped boons,
  figures for the new stall; the Descent in a spoiler block. No sim results.
- `npm run lint`, `npm test`, `npm run sims -- 9 deep`, browser check. Numbers reported.
- Commit on develop. Production only on the user's word.
