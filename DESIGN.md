# Idlebound: design

Visual identity, layout, components and interaction rules, as implemented today. The CSS
is the source of truth for exact values (`apps/web/src/app/globals.css` for tokens and
shared components, `apps/web/src/game/game.css` for the game, `landing.css` and the
leaderboard stylesheet for public pages). Change this file with the code. Product rules
live in [PRODUCT.md](PRODUCT.md).

## Direction

**The Armory: 2008 in the objects, today in the craft.** The interface borrows the page
genres every player of the late 2000s knows by heart (the item card, the action bar, the
guild roster, the ruled section heading, the underlined link) and renders them with
today's craft: readable sizes, air, one accent, fast and quiet motion, whole-pixel art at
large scale. Nostalgia comes from what things are, never from effects.

**Dark fantasy, gold on the night.** The page is the night of the world (`--bg` is the
pixel palette's darkest step, so scenes melt into the page), gold is for anything valuable
or actionable, violet only for magic (essences, ascension, rare events). The combat scene
is the hero of the screen. Everything else is quiet, framed and legible.

**The world is pixel art; the interface is not.** Monsters, scenes, companions, relics,
the crystal and the effects are drawn in pixels by a generator (see Imagery). Header,
panels, windows, numbers and buttons keep Cinzel, Alegreya Sans, the tokens and SVG icons:
the night is pixels, the Ledger that records it is ink.

- Dark theme only (`color-scheme: dark`, `theme-color #0b0a14`). There is no light theme.
- No decorative gradients, halos, glows, blur or glass. Depth is a 1 px bevel (a line of
  light on the top edge, `--bevel`) and black lines; a pressed control sinks (inset shadow).
- Nothing is sold as free: copy makes people want to start (the King, the road, the
  companions), it never promises a business model.
- Numbers are the reward: they are large, tabular, and animate when they change.

## Color tokens

Defined once on `:root` in `globals.css`. Never hardcode a color that has a token.

| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-2` | `#0b0a14` / `#111018` | The night (page, arena, sunk fields) / alternate rows, bars |
| `--panel` | `rgba(22,20,30,.96)` | Framed panels over the background |
| `--panel-solid`, `--panel-2`, `--panel-3` | `#16141e`, `#1d1a27`, `#28253a` | Windows / raised keys and inputs / hover |
| `--border` / `--border-strong` | `#2c2938` / `#3e3a50` | Hairlines / emphasized frames |
| `--text` / `--muted` / `--faint` | `#ece8f3` / `#a8a2b8` / `#8c86a0` | Body text / secondary / hints |
| `--gold`, `--gold-2`, `--gold-deep` | `#e8b949`, `#f7d98b`, `#8f6a20` | Gold currency, primary actions, focus ring, links / bevel light / frame thread |
| `--violet`, `--violet-2` | `#9b6bff`, `#c9a6ff` | Magic only: essences, ascension, talents to buy |
| `--essence` | `#c38bff` | Essences and ascension |
| `--shard` | `#7fd8ff` | Shards and the market |
| `--danger` / `--success` | `#e8566f` / `#5fcf80` | HP, errors, boss timer urgency / confirmations |
| `--danger-soft` / `--success-soft` | `#ff9db0` / `#c4f5d2` | Losses and warnings in small print / cleared stages, Auto |
| `--companion` | `#8ff0c4` | Companion (passive) damage numbers and their label |
| `--tip-bg` / `--tip-border` | `#090b19` / `#8b93b5` | Item cards (tooltips of powers, talents, relics) |
| `--bevel` | `inset 0 1px 0 rgba(255,255,255,.08)` | The one bevel of raised things |

Content colors live with the game data, not in CSS:

- **Rarity** (`RARITY_INFO` in `packages/game/src/data/items.ts`): common `#b8c0cc`, rare
  `#5aa9ff`, epic `#b86bff`, legendary `#ffb347`, mythic `#ff5c7a`. Item cards take a
  thread of `--rarity` around a black line; legendary and mythic wear a second thread.
  `rarityColor(rarity, colorblind)` gives the color to show; with colorblind colors it is
  common `#e6ecef`, rare `#96b5ec`, epic `#8e69fb`, legendary `#fcb902`, mythic `#ff2259`.
- **Biome accent** (`BIOMES[].accent`): passed as `--accent` to the scene and biome cards.
- **Hero color** (`HEROES[].color`): the thread of each companion's portrait frame, an
  accent of their pixel portrait (its `hero` slot, used sparingly under the moonlight) and
  the ramp of their emblem.

## Typography

- **Display: Cinzel** (600, 700, 800) self-hosted via `next/font/local` (`src/fonts`, OFL), variable
  `--font-display`. Headings, the gold counter, big numbers, window titles. Serif, engraved, fantasy.
- **Body: Alegreya Sans** (400, 500, 700, 800, italic) self-hosted via `next/font/local`, variable
  `--font-body`. Everything else: a humanist sans with calligraphic roots, very readable.
  Base 16px, line-height 1.5. Labels are sentence case, never tracked capitals (Cinzel is
  the only face in capitals, by design).
  The two variables are set by `next/font` on `<html>` only: `globals.css` never redefines
  them (a family name written there would not exist, and every page fell back to the
  system's faces). Both faces are wider than those fallbacks: an effect chip stays on one
  line and cuts the end of its name (the tooltip keeps it whole, the timer always shows), a
  place's name wraps between its words and its column never gets narrower than its longest
  word, and the companions' buy modes go under the panel's title when the panel is narrow.
- Numbers that change use `font-variant-numeric: tabular-nums` so they do not jitter.
- Big numbers are formatted by `formatNumber` (K, M, B, T, Qa… then aa, ab… zz, then aaa),
  with an in-game choice of letters, scientific or engineering notation. The same notation is
  used in both languages. Past stage 3500 the engine writes HP, gold and damage in a larger
  unit (`scale.ts`): `useMagnitude` (the night's numbers) and `useLifeMagnitude` (totals over
  every night) read them back, so a walker sees the plain number at any depth.

## Shape, depth, spacing

- Radii: `--radius` 4px (panels, cards, windows), `--radius-sm` and `--radius-pill` 3px
  (keys, inputs, chips, tabs). No pills; circles only for status dots.
- One shadow token, `--shadow` (`0 16px 40px rgba(0,0,0,.55)`), for floating layers
  (windows, toasts, tooltips). Everything else is flat, with `--bevel`.
- **World objects** (`.pixel-frame`): portraits, relics, feature art, biome and place
  paintings sit in one frame: the night, a black line, a thread of `--gold-deep` (or the
  hero's or the rarity's color).
- Spacing is tight in the game (8 to 12px gaps: it is a dense dashboard) and generous on
  public pages.

## Components

- **Buttons** (`.btn`): default (a raised key: `--panel-3`, bevel), `.btn-gold` (primary:
  flat gold, a line of `--gold-2` light on top, dark text), `.btn-violet` (magic actions:
  ascension), `.btn-ghost` (secondary), `.btn-danger`; sizes `.btn-sm` and `.btn-lg`.
  Minimum height 40px. Hover brightens, press sinks 1px and loses its bevel; under a finger
  (`pointer: coarse`) the game's keys (buttons, buy keys, powers, talents, rail, buy modes,
  the essence and shard counters) also give a little (scale 0.95, 90 ms). One gold
  button per view at most. Secondary actions on public pages are underlined links.
- **Counters** in the game header: fields sunk into the bar (black line, inset shadow): gold
  (largest, Cinzel, a gold thread), DPS, click damage, essences (only once the player has
  essences or has ascended), shards, then the account chip. Gold, DPS and click keep a fixed
  minimum width so the header does not jump as numbers grow.
- **Cards** (`.card`): panel background, border, 4px radius, bevel. Item cards, altar
  cards, market offers, achievement tiles.
- **Item cards** (`.item-tip`, `.skill-tip`, `.talent-tip`): the tooltip of old games, ink
  `--tip-bg`, a 2px `--tip-border` rim and a black line, names in their rarity color.
  Hover opens them only where a real pointer hovers (`hover: hover`): on touch, a card a tap
  reveals would swallow that tap (iOS turns it into a hover). Powers show no card on touch;
  a talent shows its card on touch only when it cannot be bought (reachable or owned).
- **Section headings**: Cinzel, left aligned, followed by the ruled line of old portal
  headers (a lit line over a black one), on public pages and in windows (`.section-heading`).
- **Modals** (`Modal.tsx`): the only secondary surface in the game. A window: black line,
  a frame of `--border-strong`, bevel; titled in Cinzel, optional icon, a square close key;
  tabs are folder tabs on a darker strip, the open one joining the page under it. Focus
  trapped, Escape and backdrop click close, focus returns to the opener. It opens in 140 ms
  (a short rise, no bounce).
  A tabbed modal always takes its maximum height, so switching tabs never resizes it.
  A window that spends a currency repeats its header counter beside the title, since the veil
  dims the header: the equipment and inventory window shows the shards (once revealed) on
  both tabs; the number swells 1.25x for 420 ms each time it moves (still with reduced
  motion). The market keeps its larger balance line in the body.
  Sizes `sm` (settings, confirmations), `md` (account, market, cloud save choice, Reunion), `lg`
  (map, equipment and inventory, ascension, achievements).
  On a portrait phone a window is a **sheet**: full width, rising from the bottom edge in
  200 ms (no bounce), a grip on its head, its foot above the home indicator. A finger pulling
  the head down drags the sheet; past 96 px, or on a quick flick, it lets go and closes,
  otherwise it settles back. The close key stays. A window is never wider than the screen:
  a row of tabs too long for it scrolls sideways.
- **The Hall**: achievements, then Chronicle and Bestiary once they have a first entry,
  statistics, leaderboard. The Chronicle opens on the Night list (one line per night, the
  King's Word in italics), then one section per source with its count and an "N new" pill,
  newest first, eight entries shown and "Show more" by fifty. Keystones carry their stratum
  and Age. The leaderboard shows the board's rule in one plain sentence under its tabs
  (Depth, marked "Official", then each tally once the walker has one: Kingslayer, Word Kept,
  The Watch; no tabs while Depth is alone), the walker's rank, "Around you" (two walkers
  ahead, two behind) when the walker is not among the top rows, then the top. Ranks are square labels with a black line (gold, silver, bronze for the first
  three, as on the public Roll); the walker's own line is marked in gold. Statistics set their
  records beside the table as rows of the same height, level with its body.
- **The Sanctum and the Loom** (ascension window): a pixel banner of the place with its name
  and description over it (`PlaceHeading`), anchored on its ground and 208 px tall so the
  stones or the Loom's frame show whole above the words; on phones (520 px and
  less) the banner is a 132 px strip showing the stones and the name and description sit
  under it, then the ascension and the altars; from level 5
  an altar card carries an "Altar legend" disclosure (tooltip on hover, open on touch).
  The Descent tab (Eldra's Loom) shows the threads, what a Descent takes and keeps, the threads it would weave,
  the stage of the next thread, a danger-confirmed Descend button and the eight Weaves as cards.
- **The Promise** (a folder tab of the ascension window, from the second night): one line on
  the rule, then "Tonight": the word of the night as a framed block (portrait in its frame,
  name, the knot and its state, the companion's request in italics, the rule in plain words,
  a ghost "Break my word" key, danger-confirmed); a gold thread, brighter once the word would
  hold at dusk, grey once broken, when the request gives way to what the companion said. Then
  "Whom to give your word": the companions met as a roster (rows alternating like the
  companions' list): portrait, name and title, words kept out of five with the damage they
  give ("2 / 5 words kept · damage ×4"), the request in italics, the rule, what the word gives
  in bold `--gold` (`.promise-reward`: "Kept: their damage doubles for good (×8 in all)"),
  a line in `--gold-2` when their next memory waits for a word, and one raised key ("Give my
  word", or "At the next dusk" once the night is under way, or for the companion who had
  last night's word; disabled for tonight's, with "Nobody asks two nights running"). A
  companion whose request the walker's best stage cannot meet yet is not listed. The one chosen for the next
  dusk shows a knot and "Take back". On phones the key goes under the text, full width.
  Companions who have had their five words leave the roster and are named under it, with
  their ×32 (`.promise-fulfilled`). Tonight's word shows its reward line too.
  Inside a window the toasts wait, so what the word forbids there is said in place
  (`.promise-notice`: the knot, "Your word holds you" and the rule, over the altars, the
  stall, the forge) and the keys it forbids are disabled.
- **The knot** (`knot`, `frayed` pictos): the mark of a word given, an SVG in the
  interface's ink, never pixels. On the medallion of the companion who holds the walker's
  word, a small square label with a black line at the top left corner (the level sits
  bottom right): gold thread when given, `--gold-2` once kept so far, grey and undone when
  broken. That companion's row stays in the companions' list all night, hired or not (the
  portrait dimmed when not), with one line under the name in `--gold-2`: the state and the
  rule. In the scene, their medallion stands first in the party (at the bottom, so a phone's
  three medallions keep it), with the same knot: the promise stays in sight with the panel
  folded.
- **The stall** (market): the Stallkeeper's saying of the visit as a quote at the top;
  prices through the Token's discount (old price struck out); the Caravan's ware of the week
  as a gold-edged card.
- **The Crown** (equipment, after the tenth Descent): a fifth, dim slot spanning both
  columns, which can never be filled; hovering, pressing or focusing it shows its line. Chronicle fragments are italic quotes with their voice under
  them, a violet edge and a "New" pill until read. Bestiary entries show the creature's
  pixel sprite in a portrait band above the text, at its own size and never shrunk (a
  pale silhouette when never met), its count and its unlocked lines in
  italics; a page heading carries its gold bonus. Secret deeds read "???" with their
  riddle until found. Named relics show their unique effect in gold and their legend in
  italics. Recognition draws one to five thin gold rings around a companion's portrait
  frame, brighter with each tier.
- **Toasts**: on the right of the scene, next to the companions panel, under the scene's top
  bar (placement details under Motion), at most 4 at once (2 on phones), auto-dismiss 3.8 s
  (4.5 s for danger). The others wait in line and none is dropped; while more than a
  screenful waits, each goes after 2.6 s. Tones: gold (achievement, ascension), violet (biome, power, crystal), loot (title
  in the item's rarity color), success, info, danger.
  A promise speaks through them in the companion's voice, as a quote (8 s): the request when
  the word is given (info, with the rule), "Your word holds" once it would hold at dusk
  (gold), what they say when it is kept (gold) or broken (info, the undone knot). When the
  walker tries what the word forbids, one info toast says so (the rule, and where to break
  it), at most once every 12 s.
- **Forms**: `.field` + `.input` (a field sunk into the page), gold focus border,
  `aria-invalid` turns the border red,
  `.field-hint` and `.field-error` under the input.
- **Segmented controls** for exclusive settings (notation, language), switches for booleans.
  A switch is a slot sunk into the panel with a square key: off, the key is muted; on, the
  slot turns gold (a line of `--gold-2` light) and the key goes dark. A setting's words keep
  at least 10rem; a choice too wide for the row goes under them. Shortcuts list their keys
  in one column, so every action lines up.
  A small switch (`.switch-sm`) sits in context when a setting belongs to a panel: "Spend
  while away" at the top of the companions panel.
- **Tutorial hints**: one bubble at a time, pointing at what to do next (right, bottom or
  centered); a centered one-time notice presented the altar rework to players who had
  already ascended. In the stacked layout (900 px wide or less, or 560 px high or less) the
  arena is all monster, so the hint leaves it and stands in the scene's flow under the
  powers, still and full width; the arena shrinks a little while it shows and the monster is
  never covered. A hint leaves by itself as soon as it stops making sense, for good: the
  walker did what it says (hired, beat the boss, used the power, took the road again after
  a closed seam), opened the place it points to (the Sanctum), or has had it on screen for
  30 s in a watched tab. It goes without a transition. The two notices wait for their "OK".
- **Companions** (the roster): one line per companion, rows alternating like an old guild
  list, the portrait in its frame (thread in the companion's color, the bust at the whole
  scale nearest the frame, so a phone's smaller frame still shows the face), name, title, DPS and
  talents (small square keys: gold when owned, violet to buy), the buy key at the end: flat
  gold when affordable, sunk back with its price still readable when not. "Buy N talents"
  floats over the foot of the list, full width under the thumb, only while one is
  affordable; the list keeps room for it at its end, so no row moves when it comes or goes.
  A buy key held down repeats: the first repeat after 380 ms, then each sooner than the last
  (160 ms down to 55 ms) until the gold runs out or the finger lifts; a tap still buys once.
- **Powers**: an action bar of square keys, the hotkey in the top corner, the cooldown
  sweeping over, a gold rim while active, an item card as tooltip whose recharge is the
  walker's own, after the Altar of Echoes and Eldra's Locket. A power that comes back
  during play says so once: a gold ring closes on its key in 900 ms, the icon lit (a still
  gold outline with reduced motion), and the phone buzzes; a key already ready at load
  stays quiet.
- **Navigation rail**: raised keys with bevel; the key of the open window is pressed in
  (sunk, gold label).
- **Badges** on the navigation rail: `!` urgent (hops a pixel), `+` something to spend, a
  count; small square labels with a black line.

### Progressive interface

Minute one shows the monster, the attack, the gold, Aldric's row ("Train" / « S'entraîner »,
he is the walker), the Account button and chip (a walker coming back logged out finds their
game at once) and the Settings button; everything else appears the moment it can first be
used (`reveals(state)` in `apps/web/src/game/shell.ts`), from records that only
grow, so nothing the walker used disappears after an ascension or a Descent:

| Element | Appears |
|---|---|
| Map | stage 2 reached once |
| Equipment, pack | the first relic |
| Market | 20 shards earned in all (the stall's cheapest ware) |
| Ascension | stage 51 reached once, essences, an ascension or a Descent |
| Hall | the first guardian down (stage 11 reached once); deeds and fragments found before wait there |
| Account (rail and header chip) | always |
| Settings | always |
| Header counters | DPS with the first companion, click damage with Aldric's first level, shards once earned, essences as before |
| Stage bar | stage 2; the Auto/Farm switch after a failed boss or a rebirth |
| Companions | Aldric, the companions hired, and only the next one, once affordable this night or hired on a past night; talents only reachable or owned; buy modes from 10 levels; "spend while away" with the first companion |
| Powers | only the unlocked ones; Unweave on key 7 once woven |
| Descent tab, Caravan | when a Descent is possible (best stage 2000) or has happened; from the third ascension |
| Promise tab | once a companion half remembers the walker (Recognition 2) |
| Altars | the four open-ended ones at once, three more from the third night, the last six from the fifth; one already raised always |
| "Keep the Kingdom's sky" | from Age II |

Each first appearance during play is announced once: a toast for the rail's windows, the
Loom, the Caravan, the Promise and the two wakings of the Sanctum's altars (marked `ui:<id>` in `tutorial.done`, so it happens once
on every device), a 4 s glow for the other elements (an outline with reduced motion). A game
loaded past a threshold shows those elements at once, without a flood of announcements;
only what arrived after walkers were already past its threshold is told once at load
(`ANNOUNCED_AT_LOAD`: the Promise).

## Large screens

Screens run from phones to 4K, so nothing is laid out for one resolution. Past a laptop's
size the whole interface grows (`--ui-zoom` on the root, `globals.css`): the page is laid out
as on a smaller screen and magnified by the CSS `zoom`, game and public pages alike, windows
included. The steps are gentle: each keeps at least 1920 x 960 CSS pixels once zoomed (a
full HD screen): ×1.125 from 2160 x 1080, ×1.25 from 2560 x 1280, ×1.5 from 3200 x 1600,
×1.75 from 3840 x 1920.

- The pixel art keeps whole pixels: every scale is counted in device pixels per page pixel
  (`pixelRatio()` = device ratio × zoom, `pixel/surface.ts`), for sprites, the arena and the
  landing's Keep.
- Viewport measures (`getBoundingClientRect`, pointer coordinates) are in screen pixels and
  styles in page pixels: code that positions from a measure goes through `pageRect()` or
  divides by `uiZoom()` (damage numbers, shots, toasts, the landing's blows).
- A zoom scales `vw` and `dvh` too: stylesheets use `var(--vw)` and `var(--dvh)`, which undo it.

## Game layout

Full-viewport app, no page scroll (`position: fixed; inset: 0`).

```text
┌──────────────────────── header 60px: logo · resources · account ───────────────────────┐
│ rail │                       combat scene                         │   companion panel   │
│ 84px │  zone + era · stage bar · buffs                            │   410px (360px      │
│      │  arena: monster, damage numbers, crystal, tutorial hint    │   under 1280px)     │
│ menus│  monster name, HP bar, boss timer or kill progress         │   buy mode, spend   │
│      │  power bar (keys 1 to 6)                                   │   switch, heroes,   │
│      │                                                            │   talents           │
└──────┴────────────────────────────────────────────────────────────┴─────────────────────┘
```

- **Navigation rail**: map, equipment, inventory, market, ascension, achievements, account,
  settings. SVG icons in the style of the `Picto` set (`WindowIcon`: map, helmet, backpack,
  stall, gem, trophy, cloud, cog), the same in each window's title, plus a short label; each
  opens a modal.
- **≤ 1080px**: resource labels hidden, smaller logo, scene header centered.
- **Desktop under 820px tall**: smaller rail icons so all eight buttons stay visible.
- **Compact combat HUD** (≤ 900px wide or ≤ 560px tall): era and biome on one line, smaller
  stage pips, powers and HP bar, so the monster keeps most of the scene. Portrait phones
  keep the stage keys at a thumb's size (36 px pips, 36 px tall arrows and Auto switch; 33 px
  pips at 360 px and less); only the short landscape shrinks them.
- **Portrait mobile** (≤ 900px wide and taller than 560px, or any width under 600px):
  single column. Scene on top (at least 290px), companions below, their panel as tall as
  its rows up to 42% of the room, so a small company leaves the monster the rest. The panel
  carries a grip: a tap or a swipe down folds it to its heading ("Full combat view", the
  scene takes the room), a tap or a swipe up opens it again. Folded, its heading counts the
  purchases within reach (companions at the chosen mode and talents) on a square gold
  label, and the grip turns gold. Open, the scene is short: the effect chips keep their
  icon and their timer (or their value for Ritual and Patience), the name only in the
  title. The rail becomes a fixed bottom
  bar that respects the safe-area insets. The header is the purse alone: gold, DPS,
  essences and shards across the width (the strike is read on Aldric's row, the account in
  the bottom bar); the account chip comes back only to show the Ledger's trouble. Logo
  hidden, toasts across the scene, windows open as sheets.
- **Touch**: the game is not a page. No double-tap zoom, no long-press menu on the art, no
  text selection anywhere (windows and the loading screen included, only form fields take
  one), no pull to refresh, lists that scroll keep their scroll to themselves. Tooltips of powers
  are off and the keyboard shortcuts are not listed on touch screens. Where the browser can
  vibrate (Android), short pulses mark a critical blow of the walker's own hand, a purchase,
  a power, a loot, a guardian or elite down, a failed boss and an ascension or Descent; a
  "Vibration" switch in Settings (shown only there) keeps the choice on the device, not in
  the save.
  Damage numbers of a burst of taps on one spot (within 40 px and 400 ms of each other)
  climb one line per blow and zigzag aside for five blows, so each stays readable.
- **Home screen**: added to a home screen, the game opens as an app (standalone, the status
  bar translucent over the night); the game and the public pages keep clear of it with the
  top safe-area inset. The manifest carries 192 and 512 px icons, so Chromium browsers
  offer the install. On a touch device, after three minutes on the page and fifteen of play
  in all, one card above the bottom bar invites the walker to install ("Keep the road within
  reach"), never over a window; either answer is kept on the device and it never comes
  back. Safari offers no install event: nothing is shown there.
- **Short landscape** (≤ 560px tall, at least 600px wide, i.e. phones held sideways): the
  three desktop columns, tightened: 46px header, icon-only rail, narrower companions panel
  whose title is visually hidden to leave room for the buy modes.
- **≤ 520px**: denser grids, hero rows and window padding; market in two columns.
- **≤ 480px**: the bottom bar shows icons only (eight labels do not fit; each button keeps
  its `aria-label` and `title`).
- The whole scene area is the click target (pointer down, not click, for responsiveness);
  Enter or Space attacks when the arena has focus.

## Public pages

Landing (`/[locale]`), news, wiki, leaderboard, privacy, password reset, e-mail confirmation, 404. Shared chrome:
`SiteNav` (logo back to the landing, leaderboard, wiki, news, gold "Play" button) and `SiteFooter` (links and a
link to the same page in the other language), both on the same 1180 px measure so the logo
and the copyright share one edge; on a short page the footer stays at the bottom of the screen.
The nav is fixed at the top of the window and compact (56 px, logo 32 px; 52 px and 28 px on
phones), solid with a hairline below; on the landing it stays clear over the Keep until the
page scrolls or its menu opens. On phones (640 px and under) leaderboard, wiki and news fold
behind a 40 px square menu button beside "Play" (three bars, a cross once open, gold rim
when open); `SiteMenu` drops them under the nav as full-width 48 px panel rows. Escape, a tap
outside or following a link folds the panel away. Public pages scroll smoothly to their anchors, which stop clear of the nav
(instant under reduced motion), and past 600 px a 44 px square "Back to top" button (gold
chevron, panel bevel) fades into the bottom right corner.
The first Tab stop of every public page is "Skip to content", a gold-ruled panel label in the
top left corner, off screen until focused. The landing page (`LandingHero` then the
server page):

- **Hero**: the Keep at night fills the width, drawn in its three planes (`depth` art:
  sky and far ranges, ruins and ground, the foreground frame) at one whole scale chosen from
  the height the screen gives it (the hero is exactly as tall as the scene; the view widens
  around the scene as the arena does). With a mouse, the planes shift with the pointer by
  whole art pixels (2, 6 and 12 at the edges). The Fallen King stands on the road at the
  scene's scale and takes the visitor's blows: each strike (pointer or Enter) throws the
  arena's own damage number (`damage.css`, fanned out the same way on a burst), every fifth is a critical hit (ten times), his health bar drops on his
  plate (`gardien`, the stage-50 guardian's real health) and a line answers ("Encore.",
  the critical, then "Il tombe. La nuit prochaine, il se relève." before he rises again).
  The copy sits on the left over a shade that only covers its side: title, lead (the
  surface of the story), the gold call to action, an underlined link to the leaderboard,
  and "Déjà en route ? Reprends ta partie" for walkers coming back. On phones the Keep sits
  under the nav, the words under it, the button full width under the thumb.
- **The loop**: Strike, Hire, Again in three ruled columns (no numbers, no cards).
- **What the road holds**: three features as a list, each with its art in a pixel frame
  (Maëlle, the Oathcutter, the crystal). The page is silent on purpose (BIBLE 20): no count
  of stages, strata, companions or altars, no Descent, nothing of what the walk tells.
- **Five places**: each scene in a pixel frame with its guardian and one Remnant; the frame
  takes the biome's accent on hover.
- **Leaderboard and FAQ** side by side: the top 10 as a table (alternating rows, rank
  labels gold, silver, bronze), how to carve your name there, then the questions as
  `<details>` opened by a turning chevron.
- **Latest news**: the three latest articles as cards side by side (one column on phones),
  each with its pixel cover, then an underlined link to every article.
- **Last call**: a ruled line, the King has risen, the gold button.

The few figures it still shows (the stages of each biome) come from the game data. World art on server pages goes through the
client `Art` component, which takes plain data. The 404 page shows the Field Rat. The
leaderboard page uses square tabs (the open one in gold, Depth marked "Official"), the board's
rule in one plain sentence (the tie rule beneath it, smaller, on the tallies), "Around you" for
a logged-in walker past the rows shown (their line in gold), and a table with alternating rows
whose last column is the date reached on Depth and the highest stage on the tallies.

Every article has a pixel cover: a biome of the road cropped from the ground up, one of the
creatures the landing already shows standing on it, at whole scales in a pixel frame. The news
page (1040 px wide) opens on its Cinzel title, a rule, the italic subtitle and a muted "RSS feed"
link with its icon, then the newest
article as a wide card, the cover beside the words (stacked on phones), then "Earlier on the
road" as a grid of cards, cover on top. A card opens as a whole (its title is the link a
keyboard reaches; the border turns gold-deep, the chevron of "Read the article" steps right):
a square label for the kind (gold for patch notes, violet for announcements), the version, the
date, the title in pale gold and the muted summary. An article reads on the 820 px measure:
the way back with a chevron, the cover as a wide banner, the labels, the title, the summary
as a muted lead, a rule, the body on a 68ch measure (gold headings, square gold bullets), and
a ruled foot with the team's signature in Cinzel gold and, when the article points to a page,
a gold button. A patch note's body is made of cards, one per thing a change touches: a
panel with a 3 px left border in the tag's color (violet new, green buffed, red nerfed, gold
adjusted, grey fixed), the name in Cinzel beside a small outlined uppercase tag, an italic
muted line saying why, then its changes as bullets, each a bold label and either plain words
or the old value muted, an arrow in the tag's color and the new value in bold pale gold.

The wiki (`/[locale]/wiki`, styles in `src/wiki/wiki.css`) reads like an old fan encyclopedia
built with the site's tokens. On wide screens a sticky contents column (the search, then the
topics in four groups under small uppercase labels, not headings, the open one ruled in gold) sits beside the article: the search stays at
its top and only the topics scroll, without a visible bar, so the column never changes width.
The search's results float over the topics (never pushing them): eight at most, best first
(a title beginning with the query, pages before sections), the highlighted one ruled in gold,
driven by the arrows, Enter and Escape; under 960 px the
column folds into a "Wiki contents" `<details>` above it. An article opens on its breadcrumb,
its world art in a pixel frame, a Cinzel title in pale gold and a muted lead, then the
reading-mode bar (three square buttons, the chosen one gold, what each does in its tooltip,
and a faint line saying how far the walker's game goes), then "On this page" in two columns. Sections carry the
ruled heading of the landing (plain text, not a link: "On this page" holds the anchors); tables have alternating rows and gold tabular figures;
companions, altars and powers show their emblem or icon in a 36 px frame; on the index every
topic card shows its picture in a 64 px frame, an icon when its header art (a large creature,
a biome) is wider than the frame at its own size, since sprites are never shrunk; creatures and
relics are tiles (art in a pixel frame, name, rank) in a responsive grid. A tip is a gold
rule on the left, a trap a red one. Lines of the story are italic quotes on a gold-deep rule,
the speaker in gold under them.

A revelation waits behind a veil: a dashed frame on a diagonal hatch of the night, a crossed
eye in pale violet, "Spoiler" (or "Not on your road yet" in the "as far as my game" mode) and
what would reveal it in play, with a small "Reveal" button. In a table the veil spans the row;
in a sentence it is a short bar of dots; in a grid a dashed tile with a question mark.
Revealing one piece reveals every piece behind the same gate on the page. The server renders
every veil closed, so nothing shows before the browser knows the walker's choice.

There is **no language switcher in the header**. The language is chosen automatically, or
in the game's Settings window; on public pages the only switch is a globe at the end of the
footer links. It opens a small window ("Language"): one row per language, written in itself,
the current one in gold with a check, each a plain link to the same page in that language
that also records the choice. Escape, the cross or a click beside it closes it.

## E-mails

Every e-mail uses one template (`render` in `apps/api/src/lib/mail.ts`) carrying the site's
identity: night background, a panel framed by a thread of old gold, painted logo
(`/assets/brand/idlebound-logo-mail.png`, PNG because several clients do not show WebP),
Cinzel gold title, Alegreya Sans text, one flat gold button with a line of light, a muted
note, then the raw link as a fallback. Tables and inline styles only, 520px max, declared
dark (`color-scheme`) so clients do not invert it; the button is a block that keeps its label
on one piece at 320px. Copy is short: a title, one or two sentences, the button, one note
(validity and "wasn't you?"). Every e-mail has a plain-text version.

## Imagery

### Pixel art generated by code (the world)

No image file draws the world: recipes are data in `packages/game/src/data/art/`
(`@idlebound/game/art`), the generator lives in `apps/web/src/game/pixel/` (canvas 2D, no
dependency). Same recipe, era and seed give the same pixels everywhere; snapshot hashes in
`pixel.test.ts` catch any accidental change.

- **Palette**: the Orvane 64 (`palette.ts`), built on the tokens; every pixel of the world
  is one of its entries (treatments remap to it, they never compute colors). 24 material
  ramps (4 or 5 steps, hue-shifted: shadows cooler and more violet, highlights warmer) and
  16 light ramps. The darkest color is the night ink `#0b0a14`, never pure black. A sprite
  uses 4 to 12 colors: a last pass merges the rarest colors into their nearest neighbor,
  one table per creature and era, shared by all its frames. Light (eyes, flames) is never
  merged. Rarity colors stay those of `RARITY_INFO`: relics take their highlight ramp from
  them. A companion's color picks the nearest ramp (`rampFor`).
- **Creatures** (`grids/`, `creatures.ts`, `creature.ts`): every creature is drawn by
  hand, pixel by pixel, one character per pixel, with its own anatomy: no shared body, no
  palette swap of another creature, never resized. A recipe is its grid, the material of
  each slot of its legend and its rank. The legend maps each character to a step of a
  material ramp (so era treatments still swap stone for fur) or to a fixed light (eyes,
  flames, glowing runes: the brightest pixels of the sprite, closed by a blink). The
  generator adds the ink outline; `over` pixels are laid after it and take none. Each grid
  sets its own idle cycle (8 to 12 frames): a breath that lifts the rows above its waist,
  and once a cycle a twitch drawn as patches over the rows (a tail flick, a crow starting
  off the bar, a flame leaping). Fliers keep empty rows under them and hang over their
  shadow. The look is the painted originals' brought to pixels: dark masses in clusters of
  hue-shifted color, texture (fur, feathers, grain, cloth), a moonlit rim on the edges
  facing the light, glowing eyes in shadow, violet corruption where the Remnant is
  wearing through. Creatures that had a painted portrait keep its design and mood (the
  Field Rat, the Jumpy Boar, the Moss Alpha, the Shade Wolf, the Briar Witch, the Heart of
  the Old Grove, the Blind Crawler, the Echo Bat, the Stone Devourer, the Bog Remnant, the
  Baron of Rot, the Fallen King); the others were drawn for the story. Sizes follow
  rank (`CREATURE_HEIGHTS`): the creature is what the walker strikes, so it stays the
  subject of the arena, measured against the 140 rows of a scene above its ground line
  (`ARENA_ROWS`). A normal creature's body stands at least 63 rows tall (45%), an elite 84
  (60%), a guardian 105 (75%), the King's forms about 125 (90%); each rank stops where the
  next begins, so in every biome the creatures stand under their elite (about 92 rows),
  the elite under its guardian (106 to 111) and the guardian under the King. Inside a rank
  the order is the world's: Pip (36 × 39) under the Field Rat (91 × 63), the rat under the
  Jumpy Boar (92 × 75), a bird under anything the size of a person (about 80). A body
  lying low is measured along its length instead, at least 88 (the Rot Toad 92 × 51, the
  Last Hound, the Whisper Bramble). A test keeps every grid at its rank's share. A creature
  that changes size is drawn again on a grid of the new size, never scaled: every pixel of
  a creature is the size of a pixel of its scene. Each keeps to 12 colors, 24 with its
  scene.
- **Eras and Ages** (`eras.ts`): five eras make an Age (twelve Ages, eras 0 to 59). Age I:
  none, then Echo (a ghost copy one pixel up and right, a checker of cold dusk where it
  shows), Ash (warm ramps, embers every fifth pixel of the upper edges), Void (missing
  pieces), Astral (stars in the body); the places wear with them (see Wear of the world).
  Then one treatment per Age, a little stronger from one era to the next: heavier stone,
  bone and ice bodies; gilded highlights, a halo and a dithered column of light behind the
  great ones; bodies of night glass (two deep blues in a checker) full of stars with a pale
  blue outline; vertical threads at a steady spacing, some hanging loose, and a flicker;
  paper and charcoal hatching with thumb smudges; bodies written in runes; soft 2-step
  ramps (a body of one material keeps its ramp), half closed eyes, slower breathing; warm
  lamp light from one side; colors draining to grey; outline only (lighter along the top,
  deeper underneath); fewer and fewer pixels at the same size (thin parts fall away era by
  era, the masses merge into two or three flat tones in a fresh outline, the eyes stay; a
  drawing already down to lines, like the Dawn, keeps them). Every treatment is solid
  pixels: stars sit on a hand-laid tile of sky, smudges and threads on regular grids, never
  scattered noise or a translucent pixel. Pip never changes.
- **Scenes** (`scenes.ts`, `scene.ts`, `backdrop.ts`, `ground.ts`, `props.ts`,
  `foreground.ts`): pixel art in the manner of a calm night scene, built by the method of
  the creatures (volumes lit from the moon's side, material ramps laid in clusters, an ink
  outline, a broken moonlit rim, lights that glow), with wide quiet areas. Every color is
  named by the recipe, 20 at most per scene (24 with any creature of its biome, checked by
  a test), and no pixel is translucent. Dithering only joins bands and thins lights out,
  in regular patterns: the sky's rows, the moon's halo (a checker hugging the disc, then
  dotted true pixel circles, each dot one band lighter), the halos of lanterns and
  braziers (a checker, then dotted circles farther and farther apart), mist, shafts of
  moonlight, the glade, three rows between two bands of ground, the window's glow on the
  grass. Each scene is built in three depths, each plane darker and duller with distance.
  The view holds still: only clouds and mist drift sideways.
  - **Far**: the sky in bands with its stars (a few in crosses, some twinkling) and a flat
    moon (two craters, a shaded rim; the Hearthfields' moon a crescent until the Night Owl
    secret makes it full), or a rock ceiling in the Deepvaults; lit clouds (puffs over a
    flat underside, their top and moon side lighter) drifting; ranges on the horizon
    (mountains and hills whose faces turned to the moon are a step lighter down from the
    ridge, a tree line of firs, crowns and poplars, a canopy of round crowns with leaves lit
    in clusters, cliffs, dead trees, reeds, walls and towers); shafts of moonlight through
    the Wychwood's leaves; the landmark where the road leads, one window or flame lit (the
    Keep seen from the fields, the great tree, a gate of light, Osric's leaning manor, the
    throne tower); far buildings in silhouette, their windows still lit.
  - **Middle**: trunks and pillars left apart around a clearing where the guardian stands;
    the ground in bands (the far ground catching the light, the middle ground, the darker
    ground where the creature stands) with a road winding from the walker's feet to the
    landmark, cart ruts where it widens, rails and sleepers in the Deepvaults, flagstones
    laid in perspective at the Keep; a glade, the ground one tone lighter where the moon
    falls around the guardian; details sown tuft by tuft, small far off and full in front,
    gathered in clusters with bare patches, never on the road unless they belong there
    (grass, flowers and stones placed by hand in the Hearthfields; ferns, leaf litter,
    roots and glowing caps in the Wychwood; slabs and crystals in the Deepvaults; reeds and
    lily pads in the Mire; rubble and moss in the Keep's joints); in the Mire, a flooded
    land whose water mirrors what stands above the horizon, laid on the water's own ramp by
    lightness (the moon and the lights become glints), ripples sliding frame to frame, the
    moon's broken path, and the reflection of every building standing in it; mist drifting
    over the horizon; behind the guardian, buildings of the middle distance drawn in full
    but laid on the three tones of the scene's air (a barn and a chapel in the fields' mist,
    a watch hut and standing stones, scaffolds, drowned cottages, the great hall's wall),
    lower in contrast than the guardian and anything near, their lights lit; the props and
    the buildings.
  - **Near**: dark masses pinned to the edges in three well-separated tones (the body near
    black, a middle tone, a light on what faces the scene), each with its matter and its
    relief: a mound at the foot (roots, stones, mud streaked by water, fallen blocks, its
    crest lit in runs); trunks and columns round, their outer half in shade and a band of
    light down the side turned to the scene, cut by plates of bark or flutes; boulders
    built of facets, each turned its own way, a crease under each; leaves veined and lit
    on top; ferns whose near tips catch the light; tall grass with a lighter rib and lit
    points in the Hearthfields; reeds and cattails lit at the top. Their tall parts stay at
    the very edge; only their low parts reach in, below the guardian's feet.

  **Buildings** (`architecture.ts`, `structures/`): composed of pieces, like the creatures
  of materials. A piece is a volume (a wall facing the walker, lit flat; a wall turned to
  the side, lit or in shade by the moon; a round tower or trunk, shaded across its width;
  a gable or a spire roof, its slope away from the moon in shade and its eaves casting a
  shadow on the wall below; a beam, post, root or bough, curved and tapering), a finish
  laid in clusters (ashlar courses, fieldstones, boards, planks, thatch in combed strokes,
  shingles, plates of bark, rock in facets), openings (windows lit or dark with their
  frame and mullions, arches, doors, slits), cuts, and small details drawn by hand with
  their own frames (lanterns, flames, an owl that blinks, colorless banners in the wind,
  the Grove's rune, a torn cloak, a mine cart heaped with shards, a winch, bottles on a
  sill, a hammer left on an anvil). The builder shades each volume, lays the finish, rims
  the lit tops and sides in moonlight (in runs, never a drawn line), grows moss on what
  faces the sky and ivy down the walls, outlines the whole in ink, and keeps it to 12
  colors (one reduction for all its frames). Every building tells something: the hut
  hollowed in a giant of the Wychwood, the druids' dolmen and its candles, the wayside
  shrine and the cloak caught on it, the Runeguild's head-frame and its one warm lantern,
  the rune-cut pillars and gallery mouths, the peat-cutters' huts on stilts, the sluice
  and the jetty with its half-sunk boat, the Keep's broken colonnade, headless stone
  wardens, braziers of violet fire and fallen drums, Brom's forge at the crossroads. The
  places stand back: no building is drawn at the size of the creatures in front of it.
  Each biome's own building is small, high in the picture (its foot nearer the horizon
  than the walker) and laid on the scene's air like the rest of the middle distance, under
  the smallest creature of its biome: Brom's forge (50 × 47: the hearth burning deep in
  the arch, the lean-to with the anvil and the unfinished hammer, one window lit), the
  tree-house of the Grove (its balcony, a lit window, the owl on its bough), the
  Runeguild's winding house (the sheave on its head, the winch hut, one warm lantern),
  Mirelle's house on stilts (its sagging thatch, a lit window, the porch lantern) and the
  Keep's gatehouse (a pointed arch without its keystone, the portcullis stuck half raised,
  a violet window, the gargoyle of the Last Second); the gallery mouths and the cart of
  the Deepvaults stand in the same air. What stays in full color near the walker has no
  door to measure a creature against: standing stones, a wayside shrine, pillars,
  crystals, a sluice, braziers, statues, a ruined arch. A test keeps each of the five in
  the haze, in the upper half of the ground, and no taller than its biome's creatures.
  Buildings stand at the sides: what matters lies between columns 50 and 270, so a narrow
  view still shows it, and the guardian's ground stays calm (a test keeps bright and
  light-giving pixels under 1.5% of the space where it stands).

  **Motion**: the camera holds still; clouds and mist drift; lanterns, flames and lit
  windows flicker, banners and leaves move, the owl blinks, water ripples (four frames);
  props sway on two frames, lights blink on and off over the scene (fireflies, wisps,
  runes, embers). With reduced motion, everything holds its first frame.

  **The Hearthfields** keep their hand-drawn detail: the scarecrow drawn pixel by pixel as
  a character mask (a letter per material, lit or in shade, its lights), its head
  turning; the farm's graves, stooks and fence painted in their own colors, each material
  a lit color and a shade, the moon rimming their tops and lit side in pale lilac; grass
  tuft by tuft (three hand-drawn variants per size, mirrored at random); the horizon high
  (row 74) under a thin mist; night grading the ground dark and dull, on the plains' own
  moss greens (`#2e3a24`, tufts in `#4a5a2a` tipped `#5f8a3a`), never the Wychwood's teal.

  **A night of its own for each biome**: violet sky over moss fields (Hearthfields), teal
  (Wychwood), deep blue (Deepvaults), olive (Mire), violet stone (Keep). A test measures
  it: the mean color (CIELAB, by area) of any two biomes' skies or grounds stands 8 apart
  at least, and two scenes never share 40% of their pixels by color. The vault ramp's dark
  steps are true blue (`#12202f`, `#1e324c`, `#334d73`), warming to the periwinkle accent:
  they were the night ramp's near twins, and the Deepvaults read as the Keep.

  **Night**: at the first Age, the arena sets each creature into its scene, keeping it the
  most readable thing in it (`night.ts`): its lights keep their own colors; its darkest
  shadows lean toward the night's blue and its midtones toward the scene's air (the
  plains' violet, the forest's teal, the mire's green), each color replaced by the nearest
  one already in the scene or the creature, never lighter and never much darker; its ink
  outline stays; a thin rim in the moon's color runs along the side facing the moon and
  the top of that half, and the place's own light (a lantern, a brazier, the forge, the
  crystals) catches its other edge low down, every other row. Its shadow is its own
  silhouette laid on the ground from its feet, leaning away from the moon and toward the
  walker, deepest in a solid oval where it stands and thinning to a checker as it reaches
  away. The Hearthfields' milestone stone lights its rune once the stage is cleared.

  **Wear of the world** (`wear.ts`): the deeper the stratum, the older the place. At the
  present night the buildings stand, a window still lit. Each stratum of the Kingdom reads
  at a glance, even in a thumbnail: the Echo fades the whole place pale and cold, lifted
  toward the lilac of memory, doubles its far planes a step up and draws each building's
  ghost behind it; the Ash greys the land under a sky of smoke that burns red along the
  horizon, the moon an ember, the buildings charred (roofs fallen, lights out, embers
  along the breaks), embers rising; the Void presses three round seals into the place,
  pieces of the world cut clean through every plane, the dark beneath it showing with a
  few stars, a pale ring along each cut and dotted rings around it, and the same clean
  discs through the creatures; the Astral steeps the land in the blue of the shards under
  a sky thick with stars and a river of light, shards growing through the buildings and
  out of the ground. In the Elder
  World only their lower walls stand, heavily overgrown, the lights long out, rime on
  every top in its last stratum; deeper, ruins under the Age's own marks. The sky
  brightens Age after Age toward a pale lilac, and each Age leaves its mark (giant bones,
  temples and shafts of light, the sky pouring, warp threads, line art on paper, walls of
  runes, mist and a low moon, a lamp and a window, grey, the world in outline, then a
  single point of light and a line). Below the Dawn the night is drawn again from the
  present night's look (`drawnEra`: era mod 60), the sky dark once more: the scenes, the
  creatures and the map show the stratum drawn, the numbers stay those of the true depth.
- **Companions** (`grids/companions/`): 64 × 64 busts made like the creatures: painted at a
  higher resolution (volumes lit by the moon from the top left, strands of hair, folds of
  cloth, grain of leather), traced into pixel clusters, then the eyes, mouths and small
  details placed by hand. Every human face stands on the same construction (eye line, nose
  base, mouth and chin on fixed lines, both eyes the same size) so no face turns into a
  caricature; age, jaw, gaze and expression make the person. Three-quarters toward the
  monsters, desaturated and moonlit, deep shadows, 12 colors, the night ink outline. Each
  carries a signature of its dossier (Maëlle's copper braid and bow, Nyx's hood holding only
  sky and stars, the Nameless's helm with a void for a visor, Biscuit's pale eyes over Vorn's
  shoulder, Eldra's threads of light, Aurelion's dragon head, the Awakened's halo). The face
  stays in the middle: the companions panel holds the whole bust (64 px inside its frame),
  the scene medallions and the reunion list crop the edges around it, each at the whole
  scale nearest its frame. The Awakened's skin and hair are seeded by the walker's notation,
  sound and language. 12 × 12 emblems (hand-authored masks) replace the old Unicode glyphs,
  before each name in the companions panel.
- **Relics** (`relics.ts`, `objects.ts`): 32 × 32 icons. Each of the 20 base shapes of
  `SLOT_BASE_COUNT` is one object drawn five times, its parts gated by rarity, so rarity
  reads from silhouette, matter and light before color: common is short, plain and worn
  (dull iron, old leather and wood, a chip, a spot of rust); rare gains fittings (a brass
  guard, straps, a set stone); epic is blued steel, engraved, silver-rimmed and gem-set;
  legendary is larger and heroic, gold filigree, with a faint dithered ring of amber light;
  mythic is Sky-Glass with a living light in it, shards flying off past its edge, inside
  three regular dithered rings of light. `RARITY_INFO` colors are the accents (gems,
  cloth, light). The renderer adds a moonlit rim on the top-left edges, sinks the far
  edges, faceted gems (a spark on top left, a darker rim) and white-hot living light;
  every part covers at least one pixel, every pixel is solid, 4 to 12 colors. The forge
  engraves a rune of fire every five levels along each relic's rune line (1 to 4 runes,
  and at +20 a seam of fire joining five), and the interface writes the exact level as a
  Cinzel "+7" badge on the icon's corner (gold-filled at +20); relic icons in item cards
  are shown at twice their pixels. Named relics have their own recipe
  (`NAMED_RELIC_SHAPES`) with the same light; the Crown is dull gold, its sockets empty,
  no light and no halo. A relic from below the present night lists its **Density**
  ("Density: damage ×1.35", pale violet `--violet-2`, after the affixes; its tooltip names
  the stratum it was remembered in), and the equipment totals add a Density row once one
  is worn; a relic of the present night shows neither.
- **In-world icons**: 16 × 16 pixel icons for the 13 altars, the 7 powers, the 6 stall
  offers and the 8 Caravan wares, for places of the world (the landing page uses some),
  drawn by hand one character per pixel (`ICON_INK`), outlined by the generator. Each tells
  its thing: the altars after their legend (the Anvil's fist on its block, the Sword-Mother's
  blade in a rock, a coin with a bite out of it, an hourglass-shaped cairn, a sundial, a
  menhir with five glowing notches, an arrowhead set in stone, a rat-sized chest on a slab
  scratched FOR PIP, the Stallkeeper's scale, a stone ringing with echoes, a sheaf over its
  seeds, a boot on a road stone, a purse half buried); the powers after their companion (a
  bolt, the tusk horn, an eye between leaves, falling coins, a heart bound by a thread, a
  pick striking an echo vein, Eldra's spindle); the wares after what they are. Within each
  family (altars, powers, stall and Caravan together) no two share a silhouette: a test
  keeps any two outlines at least 12 pixels apart. The interface keeps its SVG `Picto`s,
  one of its own for each power, offer and ware (a test keeps the names distinct); the
  workshop shows each pixel icon beside its picto.
- **Crystal**: a 16 × 24 faceted gem whose three facets catch the light in turn.

**Rendering.** Buffers are palette indices; they become canvases once and stay in small LRU
caches kept apart (32 creature sheets, 24 arena effects, 112 interface sprites, 64 interface
creatures, 6 scenes); the arena warms the next biome's scene and creatures while the browser
idles, and under an open window keeps its idle cadence (12 frames a second) without the
full-rate effect frames. `PixelSprite` shows one sprite in the page at a whole number
of device pixels (`image-rendering: pixelated`), animated on one shared clock; generation
waits for an idle moment. The combat scene is one canvas (`ArenaRenderer`) on a single
logical grid 180 rows high, the scene's own, scaled by the largest whole factor that fits
the box's height (`image-rendering: pixelated`); its width follows the screen (the
Hearthfields keep what matters between columns 50 and 270, so a narrow view still shows
it). The scene's floor sits just above the monster's panel; a taller box gets more sky
above, and the ground's last row (bare of tufts) runs on to the bottom. The creature, the shots and the particles are drawn on
that grid too, with solid pixels only (motes blink out instead of fading), so every pixel
of the world is the same size; the next stretch's creatures are
generated while the browser idles. A creature takes about 1 ms to generate (the whole
bestiary of 31 in about 35 ms), a building about 1 ms, a whole scene with its frames about
20 ms (once per biome and era, when the road enters it).

**Static exports.** `npm run art` renders the OpenGraph image (`public/og.png`: the Keep,
the King, a shade wolf and the logo) with the same generator in Node.

**The workshop.** `/fr/workshop` and `/en/workshop` show everything the engine draws: a
live arena (every biome and creature, strikes, crits, the five shot families, death,
spawn, the milestone), the palette and ramps, the bestiary, one
creature through the 60 eras, the five scenes in motion with their guardian in front (or
without, and in a phone's 200 columns), one scene split into its far, middle and near planes, every building through
the strata (present, Echo, Ash, Void, Astral, Elder World, Hallowed), one place through
the five eras of the Kingdom and the first era of every other Age, portraits and emblems,
relics by rarity and forge, the in-world icons, the crystal, and a timing of the
generator (creatures and scenes). It shows the deepest strata, so it is served in development only, or in
production with `PIXEL_WORKSHOP=1`, and never indexed.

- **The King's forms**: the guardian of every 50th stage wears the form of its Age, each
  a creature of its own at about 125 × 124 (the Titan King of stone, the veiled Hallowed
  King, the Star-Crowned whose crown is seven cold stars, the Woven King whose threads leave
  the top of the frame, the Sketched King in charcoal on nothing, the King's Name written in
  glowing 3 × 5 runes, the Sleeping King, the King at the Window seen from behind, the
  Hollow Crown floating over a dotted outline, the Blank King drawn by his edges, Aldemar
  in plain clothes, his skin an ashen moonlit ramp rather than warm flesh); each reads under its own Age's treatment. The map shows each stratum's
  form. At stage 3000 the Dawn, a line of light, stands in the King's place; below it the
  forms come round again with the Ages.
- **Places** (`pixel/places.ts`, `structures/sanctum.ts`): the Sanctum of Dusk (a
  violet-to-gold dusk, a stone circle, thirteen altars with their sigils, essences rising),
  Eldra's Loom (a huge frame, the woven night on its beam, a hum running up the warp) and
  the Dawn (a pale sky, one line of light across the road). Pass a place id wherever a biome
  id goes (`renderScene`, the arena, `SceneCanvas`, which switches to the Dawn at stage 3000
  only); in a window, `<Art spec={{ kind: "place", id }} />` fills its parent at a whole scale.
- **Age marks** (`pixel/marks.ts`): solid pixels and regular dithering only (giant bones and
  a frozen sea; a colonnade and shafts of light; the sky pouring; warp threads; paper; walls
  of runes; a low moon and mist; a lamp, a hearth and a window; grey; outline; a point then a
  line), 20 colors per scene at most, the guardian's ground kept calm.
- **"Keep the Kingdom's sky"**: a scene of any era keeps the sky, wear and marks of `era % 5`
  (the Kingdom's five strata); creatures keep their own Age.

### Brand and interface

- The brand logo, the favicon set and the e-mail logo stay painted, generated from
  `assets-src/original/brand` and `assets-src/favicon.png` by `npm run assets` (WebP for
  the logo, PNG for the favicons and the e-mail logo).
- Hand-drawn SVG icons (`apps/web/src/game/icons.tsx`: trophy, gold, essence, shard,
  sword (DPS), click, equipment slots, window icons and the `Picto` set for powers, market
  offers, buffs, toasts and modals) follow the gold and amethyst style, with dark outlines.
  **No emoji anywhere in the app.**

## Motion

- Monsters (pixel arena): they gather from the dark into their silhouette in a quarter
  second, breathe (the upper body rises a pixel or two over the creature's own slow cycle),
  blink every few seconds,
  once a cycle make their gesture (the twitch); a hit is one frame of soft light inside the
  outline (lilac, paler on a critical, never white; outline and light pixels keep their
  color) and a 2 px knockback away from the blow. The monster flashes at most three times a
  second, companions' shots included (the photosensitivity threshold): faster blows keep
  only their knockback. On death they hold whole for 0.16 s (a pale light, then thrown back
  2 px), so a monster struck down while it gathers is still seen, then come apart
  into their own pixels, which drift up and turn into gold motes flying to the gold counter
  (guardians shed violet ones too). The counter takes the kill's gold when the first motes
  land, 1.06 s after the kill (0.4 s, the fade, with reduced motion), never before. Elites and guardians pulse a 1 px outline in the biome's
  accent, Pip in gold only while he dares the walker (a golden rat that just runs has none,
  so the ring alone asks for strikes): it thins to a dotted line and fills again in whole
  dither steps.
  Nothing in motion is ever translucent: what comes, goes or wavers (the Lantern Queen,
  the Echo of a Walker, the Loom's flicker) drops or regains its pixels by eighths through
  an ordered 4 x 4 mask, each step cached. Only reduced motion fades, on a single frame.
- **The air** (`pixel/atmosphere.ts`, `.scene-air`): one canvas at the screen's own
  resolution laid exactly over the arena's, the only smooth and translucent drawing of the
  world (AGENTS.md allows it there alone). It reads the scene canvas and what the scene says
  of itself, and adds light: every cluster of three or more light-giving pixels of the scene
  (windows, lanterns, braziers, crystals, the moon) blooms in a soft radial halo of its own
  average color, added over the picture; fire (warm or violet) trembles quickly, cold light
  breathes slowly. In still water in front of the ground line (the Mire's pools), the picture
  standing on the ground is reflected upside down at 46 %, every row wavering sideways by whole
  device pixels, and each light above stretches down into the water as a dashed streak. The
  edges of the view sink into the night ink (a radial vignette to 62 %). It runs at 24 frames a
  second, pauses while a window covers the arena, and holds a still picture with reduced
  motion. The Ledger's scenes wear the same air (`.cutscene-air`): there the halos come from
  the lights of the very picture drawn (they follow the camera, the actors, a King's flame)
  and the water moves with the set's ground.
- **The Lantern Queen** crosses the sky from left to right during a Crystal Storm, just
  under the scene's top bar, over 15 s, coming and going pixel by pixel; with reduced
  motion she holds still and only fades. Storm crystals glow gold instead of violet.
- **Events of the Long Night in the arena** (`pixel/events.ts`, solid pixels, cached): the
  Seam is a zigzag crack of pale light behind its Warden (white heart, pale sides, rings of
  lilac and haze dithered sparser outward, flickering on 2 frames), opening in 0.4 s and
  shrinking to its middle in 0.5 s when the Warden goes. While the Quiet stands, the whole
  arena (scene, sky, lights, creatures, lanterns) maps to the nearest of the night's greys
  by lightness. The Unfinished holds its first frame with only its outline, its eyes and
  half its inside drawn (patches in a fixed order), filling in pixel by pixel as it is hurt
  (share drawn = 0.5 + 0.5 x damage taken, in 48 steps). An eclipsed King is drawn in the
  four darkest night steps, eyes still lit, over a still dark ring with a dotted dusk rim.
  While the `walker` buff lasts, the Echo of a Walker stands just right of the party,
  facing the monster, bobbing a pixel as it fights; it comes and goes pixel by pixel over 0.6 s. On a
  Remembrance Night, strings sag from both upper corners to the outer thirds with four
  lit lanterns in dotted gold halos, never over the middle. Pip holds still (no breath, no
  blink) while he dares the walker. With reduced motion each holds a single frame, and the
  Seam fades instead of shrinking.
- **The Ledger's scenes** (`components/Cutscene.tsx`, `pixel/cutscene.ts`, shots in
  `data/cutscenes.ts`): a fixed layer over everything on the night ink (`--bg`), the
  picture on the scene's own 320 x 180 grid at the largest whole scale of device pixels that
  fits, framed by 12 rows of ink at its top and bottom drawn in its own pixels (they come in
  a row every 45 ms at the start and leave the same way). The scene's name shows over the
  ink of a titled shot in Cinzel `--gold-2`, wide-spaced, fading in and out over 2.8 s.
  Lines sit under the picture in Cinzel `--gold-2` (a speaker's under a small muted
  uppercase name), coming up a word every 70 ms. "Continue" and "Skip" are small ghost
  buttons in the top right corner at 55 % opacity, full on hover or focus. A shot is a set
  (a road or a place drawn with its planes, a remembered face or a thing of the world (the
  crown in the ice, 63 x 48, painted and traced, drawn up close) in its dithered halo, or the ink) seen through a camera that pans, eased, in pixels of the ground: each plane moves by
  its depth over the ground's (0.7), so the sky stays and the near planes run, and the
  frame at the edges parts while the camera moves and closes in where it rests. Actors
  stand on the ground with their shadow and breathe at the arena's pace (a frame every
  0.55 s): the biome's
  guardian, and the walker: Aldric in their own drawing (`grids/walker.ts`), painted at four
  times the size and traced like the creatures, seen three quarters toward the King, the
  moon on their face; standing on guard (breathing), a stride of four drawings (0.22 s each)
  when the road goes by, a lunge with the blade level while they strike. Every pose keeps
  one 96 x 85 frame and one ground row. The walker's blow is a 28 px step in 0.12 s, then one frame of
  0.1 s where the night is ink and whoever stands in it bone white, then a shake of up to
  2 px settling over 0.35 s. A falling guardian loses its pixels by eighths while forty
  violet lights leave its body and climb, wavering, dimming, then blink out. A waking set
  comes up out of the ink in six palette steps, its own lights lit first. A walker on the
  road stays put and strides while the road goes by. Shots give
  way through the ordered 4 x 4 mask, an eighth every 80 ms, unless they cut. Sound: the
  night's own sounds duck and the Dusk theme plays (`music.ts`): a melody in D minor at 84
  bpm on a soft square lead through a 2200 Hz low-pass (a slow vibrato on long notes), a
  triangle bass on every bar and the chord broken in sine eighths under it. Its hook climbs
  A, D, E, F. Beats of a scene start it, cut it to silence in 0.06 s (the blow), or start
  its reprise: the last four bars at 72 bpm on a music box an octave up, chords held. It
  fades in 1.2 s when the scene ends. The blow is a swish, a low impact and the ring of steel. With reduced motion every shot is one still picture (where the pan
  lands, the guardian already gone, no flash or shake), shots fade in over 0.4 s and lines
  come up whole. Keys go to the scene first: Enter or Space moves on, Escape ends, Tab moves
  between the two buttons.
- **A chest opened at the stall** (`components/ChestOpening.tsx`, `pixel/chest.ts`, art in
  `CHESTS`): buying a relic chest or a great chest opens it over everything, on the night
  ink, on its own 80 x 100 grid at the largest whole scale its box holds (a fixed box, so the
  chest never changes size when the card comes in): on a wide display (1000 px and wider,
  landscape) the chest takes the whole height in the middle and the card comes in on its
  right; elsewhere the chest fills the width and what height the card leaves under it. The chest (30 pixels wide, four hand-drawn
  parts: lid, lid tipped back, mouth, body) drops in with a puff of dust, then knocks once for
  each rarity it climbs, from the lowest it can hold (common, or epic for the great chest) up
  to the relic's: each knock shakes it, lights the seam under its lid in that rarity's ramp
  and sends a ring out, the knock a little higher in pitch each time. Then the lid bursts up and
  tips back, a column of light (white heart, the rarity's ramp, a dithered edge) rises and
  narrows, two rings and 28 sparks fly, and a vertical reel of relics climbs out of the mouth
  (one every 40 pixels, thinning out at the top),
  fast then slower over 3 s between two gold arrowheads, a click at each relic that passes
  them. It stops a little off the middle of the chest's relic and slides back onto it; the
  relics of the reel are drawn at the chest's own odds (every slot alike, rarities by their
  weight, none below the chest's lowest), seeded by the relic's id, never weighted toward a
  near miss. Then rings and sparks burst from it, a chord rises (longer for rarer), the other
  relics go by eighths, and it hangs in two dithered rings of its light, motes climbing from
  the chest under it. Its item card follows,
  with "Worn at once" when its slot was empty, and "Take it". The loot toast is not shown for
  it. A press, Enter, Space or "Open it now" jumps to the relic; Escape closes. With reduced
  motion the risen relic is shown at once, still, and fades in.
- **Lines over the scene** (the opening line, what stays after an absence): one line in a
  band at the top of the arena, right under the scene's top bar, in the sky above the
  creature's head, never over it: small Cinzel (0.82 to 1 rem), centered, on a strip of night
  ink that fades out downward. It follows the bar as the bar grows (the arena's grid row), a
  tutorial hint stands under it and the toasts start under it. A new run opens on "Dusk
  again." in gold, fading in and out over 7 s (a plain hold then fade with reduced motion,
  from the setting or the system).
- Damage numbers float up from the pointer; crits are bigger and gold; gold gains rise.
  A Rout (a whole stage falling at once) raises its gold and, above it, "Rout · stage N" in
  Cinzel `--gold-2` (`.fx-rout`); the first one is explained by a toast.
  Companion damage shows once per second beside the monster's body, in `--companion` mint under a
  small "COMPANIONS" label (same pattern as the "CRITICAL" label), as large as a click
  number but with a calmer rise, so passive damage reads as clearly as clicks.
- Companions visibly strike about three times per second, as **shots**. Each strike picks a
  companion (weighted by its share of DPS): its medallion in the party lunges and flashes,
  and a pixel shot in its ramp flies from the medallion to the monster's body (a head with a
  3-step trail, snapped to the grid), then bursts (a 5 px cross flare, a ring of 8 pixels,
  sparks thrown back the way it came) while the monster flashes in that color. Each
  companion has a strike family (`HeroDef.strike`) that sets the flight: arrows fly fast and
  flat, blades and claws quick, heavy blows lob high and hit with a wider ring, spells
  wobble and leave sparkles. A player's hit keeps its own light. Shots and lunges are
  skipped with reduced motion.
- **Party**: the strongest hired companions (5 on desktop, 3 on phones) stand as pixel
  portrait medallions at the bottom left of the arena, strongest at the bottom, in the same medallion style as
  the companions panel. Decorative (`aria-hidden`, no pointer events): the panel carries the
  information and clicks go through to the arena.
- **Reunion**: back from 30 min or more away, the company's account opens as a `md` modal
  (`ReunionModal.tsx`) with the campfire picto and the title "Retrouvailles" / "Reunion": the
  welcome line in the Ledger's gold Cinzel, a grid of fact tiles (time away, road from stage
  to stage, gold earned, gold spent when there was at least one piece; values in Cinzel at 1.2rem,
  the gold earned in gold), then "On the road" (*Sur la route*):
  one row per moment on the panel-2 background, a picto or a pixel portrait medallion, the
  name in gold Cinzel and a muted caption. Walls that gave way come first (swords, crown for
  a King), then the last three guardians passed, the companions who joined (their portrait),
  the first four talents learned (scroll), and last the boss that still bars the road, its
  border tinted with the danger color. What is left out is counted in one muted line. Then
  "The company": a wrap of chips, portrait, name and levels "from → to". Last, when a
  fragment of the Chronicle is still unread, "Kept for you" (*Gardé pour toi*): that one
  fragment as the Chronicle writes it (italic line, violet edge, its voice and its source
  beneath), and a text link counting the others that opens the Chronicle (only once the
  Hall is open to the walker). One gold button,
  "Back on the road" (*Reprendre la route*). Toasts wait while it is open. Without an account
  to tell, a gold toast with the campfire picto says the welcome instead. A campfire chip keeps the countdown while companion damage
  is ×3.
- The Patience chip shows the idle bonus the company deals. While the walker's strikes
  stand in for part of it, the chip shows the company's share and fills with violet from
  left to right (`--fill`, a registered custom property, the share of the last second), its
  tooltip telling the full value and how much the strikes took; it is a plain chip again
  within seconds of the last strike.
- Toasts never cover the stages or the effect chips: they sit right under the scene's top
  bar, whose bottom edge is measured (it grows with the chips and moves when the page
  scrolls), or under the band of a line being told. On a computer they never cover the monster, its HP bar, the powers or a
  tutorial hint either (the stack starts under a hint it would cross):
  they dock beside the monster when a side has room (250 px at least, 360 px wide at most),
  else in the sky band above its drawn box, and a toast that does not fit is hidden, newest
  first; the dock follows the monster every 250 ms but keeps its spot (left, right or above)
  while toasts are shown and it still has room, so the stack never hops sides. While a window or a confirmation is
  open, new toasts wait and the shown ones are hidden; the waiting ones come when it closes.
  On portrait phones two compact toasts at most are shown (the rest wait their turn), docked
  across the scene between its top bar and the monster's HP bar, in both tabs: never over
  the companions' list and its buy buttons.
- Repeated toasts stack: buying the same Market offer again while its toast still waits or
  shows adds to a pill beside the title (x1, x2, x3; the count pops once per buy, not
  under reduced motion) and restarts that toast's time on screen, instead of one toast per buy.
- Capped equipment totals carry a small gold "MAX" pill whose tooltip explains that relic
  bonuses above the cap do not count.
- HP bar has a trailing "ghost" bar; the boss timer turns red under 30%. The panel keeps the
  monster just slain (its name, `0 / max`, an empty bar) until the next arrives, and each
  monster's ghost bar starts full, so one struck down in a single blow still reads and drains.
- Crystals float, turn their facets to the light and blink before expiring; affordable talents pulse; the urgent
  badge pops.
- Durations are short (120 ms for UI feedback, under 1 s for effects). Motion never blocks
  input.
- **Reduced motion**: honoured from `prefers-reduced-motion` and from the in-game
  "Reduced animations" setting (`.reduced-motion` on `<html>`), which stops the looping
  animations. The pixel world then holds a single frame: no drift, no breathing;
  monsters fade in and out instead of gathering and scattering. Damage numbers hold still,
  then go. They can be turned off separately.

- **Events of the Long Night**: a violet toast when one begins and a toast for its
  outcome. Timed event creatures (the Seam Warden, the Quiet, the Stray Armor) use the boss
  timer bar, violet and labelled with the event; Pip's Wager replaces the HP bar with 13
  notches and its 5 s timer. The King's Word rides in the gold ascension toast as a quote,
  signed by the King, for 8 s. What stays after an absence is one line in the scene's top
  band for 6 s, like the opening line, in italic violet.

## Sound

Synthesized in the browser (`apps/web/src/game/audio.ts`), no audio files: hit, crit, coin,
kill, boss, fail, buy, skill, crystal, loot, achievement, ascend, error, fragment (two soft
bell notes), recognition (a rising third), seam (a tearing noise, then a closing chord),
descent (a long falling glissando), the King's Word (one low note), what stays after an
absence (a slow chord without attack), the Quiet (every other sound ducks for 2 s) and Pip
(a squeak and a coin). Unlocked on the first
pointer or key press.

No ambient layer: between two events, the game is silent. In Age X every sound arrives
late (220 ms) and muffled (a 520 Hz low-pass), and again in every Age X the night draws
  below the Dawn. At the Dawn (stage 3000) every sound falls silent. The
context sleeps while sound is off or the page hidden.

Settings: a sound switch (everything) and an **Effects** slider (`settings.volume`,
default 0.6), saved with the other settings. The slider runs from 0 to 100 % in steps
of 1, shown beside it, and sets a cube-law gain (`(step / 100)³`) so the quiet end gets most
of the course.

## Voice and copy

- **French**: warm, epic, playful, always *tutoiement* ("Recrute Maëlle : elle attaque même quand ta lame se repose.").
- **English**: the same energy, direct second person ("Hire Maëlle: she attacks even while your blade rests."), idiomatic
  rather than literal.
- Short sentences, verbs first on buttons ("Prendre la route" / "Take the road").
- Sell the wish to start, never a price: no "free", "no ads", "no purchase", "no sign-up"
  as a pitch (a factual FAQ answer may stay factual).
- **Never use an em dash (—)** in any user-facing string, in either language. Use " : " (FR)
  or ": " (EN), " · " or a comma.
- Game terms are consistent: gold, essences, shards, companions, powers, altars, relics,
  ascension, stage, era, elite, guardian. The game says guardian (FR *gardien*), never boss;
  deeds (FR *hauts faits*), never achievements; a run is a night, never a life; the walker
  who stays on a cleared stage **stays** (FR *Rester*), never farms. Public pages may say boss
  and achievements where a search looks for them.
- Every user-facing string exists in both languages (see AGENTS.md for where they live).
- **The Ledger's voice** (account window, save errors, the Roll): a diegetic line in Cinzel
  gold (`.ledger-voice`), its plain meaning always next to it (`.ledger-plain`, or the
  existing explanation): "Seal your name (confirm your e-mail within 3 days)". Guests are
  the "Unnamed walker": their game is kept like an account's, so their chip and their
  account window show the same Ledger states (dot, last save, trouble), never a "not kept"
  call to action; the Roll's boards carry their name in the fiction, the plain
  meaning beneath (`.board-meaning`).
- **The account's e-mail** shows masked under the username, with a small gold underlined
  Show / Hide text button beside it (`.profile-email-toggle`); nothing is remembered.

## Accessibility

- Visible focus ring everywhere (`2px solid var(--gold)`, offset 2px).
- Modals are real dialogs (`role="dialog"`, `aria-modal`, labelled title, trapped focus).
  Window tabs are a `tablist`: roving tabindex, arrow keys, Home and End, each tab
  `aria-controls` the body (`role="tabpanel"`). The close button is the `close` picto with
  its `aria-label`. The phone's companions / combat switch uses `aria-pressed`.
- Icon-only buttons carry `aria-label`; decorative images use `alt=""`. No glyph stands in
  for an icon (no "✓", no "✕"): the `check`, `close` and `warning` pictos do.
- Keyboard: 1 to 6 for powers, Enter or Space to attack the focused arena, Escape to close.
- Screen readers hear the fight through a polite live region in the scene, at most one line
  every 1.5 s: a new stage, and guardians, elites, treasures and wanderers as they appear
  (with their health) and as they fall. Never every hit.
- The Ledger's state is never colour alone: when it fails (server away, refused, address
  to confirm) the account chip replaces its dot with a bordered badge, the `warning` picto
  and the status word (the word visually hidden under 900 px, still in the button's name),
  and a polite live region reads it once. When the road waits for the Ledger (out of fates,
  see PRODUCT.md, Anti-cheat), the badge says so before any other state, in gold
  (`.sync-badge-waiting`, as for an address to confirm: nothing is lost, the game waits),
  and the chip's title says why and what comes next.
- **Colorblind colors** (setting, `.colorblind` on `<html>`): `--success` turns `#5aa9ff`,
  `--success-soft` `#cfe2ff`, `--danger-soft` `#ff8a4c`, and the rarities take their colorblind
  set. Chosen by simulating protanopia, deuteranopia and tritanopia (Machado 2009) and
  measuring OKLab distance: the closest two rarities go from 5.1 to 19.1 for deuteranopes,
  success and gold from 5.7 to 26.7 for protanopes (`colorblind.test.ts` holds the rarities
  above 15 for every eye). Tritanopes already read the usual colors apart. The pixel world
  keeps its palette: hits differ by lightness and length, relics by silhouette.
- Meaning never rests on hue alone: a rarity is named on its card, a gain or loss carries
  ▲ or ▼, the stage still to clear wears a dashed ring, the Ledger's dot is full once
  written and a ring while waiting, and market warnings carry the `warning` picto.
- Text keeps the `--text` / `--muted` contrast on panel backgrounds. `--faint` (#8c86a0)
  holds 4.5:1 on every background it sits on: 5.65 on `--bg`, 5.23 on `--panel-solid`,
  4.91 on `--panel-2`, 5.29 on the bestiary and fragment cards (#151126), 5.80 on the
  talent chips (#07060c). It stays for secondary labels.
- **Ledger out of reach**: when the server does not answer at load, the game does not
  start blank. The loading screen becomes the gate: logo, a Cinzel title ("The Ledger does
  not answer"), the Ledger's voice in gold, the plain line with the next attempt's
  countdown (or "offline" while the device has no network), and a gold "Try now" button.
  The countdown is not read aloud; the state is.
- **Newer release**: before a watched page reloads onto a newer release, an update screen
  fades in over everything (0.3 s) on the loading screen's ground while every sound fades
  out: the logo, then an old patcher's window (`--panel-solid`, black line, `--border-strong`
  thread, bevel) with a Cinzel gold title, the two versions in Cinzel (the old one small in
  `--faint`, a gold-deep arrow, the new one large, or that one alone when the release kept its version), a bar of 20 cells in a sunk well lit in
  `--gold` one by one (with two short stalls, never random), and a status line with its
  percentage. The old page fills it to 80% ("Putting your progress somewhere safe"); the new
  page shows it at once over its loading screen, fills the rest ("Installing", then "v0.6.0
  is ready"), and fades it out in 0.4 s. Input is held under it; only a scene the game opens
  meanwhile cancels it. Under reduced motion (the setting or the system) the bar jumps to
  its value and only the fades remain.
- `<html lang>` follows the current locale.
