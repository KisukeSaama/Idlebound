# Idlebound: design

Visual identity, layout, components and interaction rules, as implemented today. The CSS
is the source of truth for exact values (`apps/web/src/app/globals.css` for tokens and
shared components, `apps/web/src/game/game.css` for the game, `landing.css` and the
leaderboard stylesheet for public pages). Change this file with the code. Product rules
live in [PRODUCT.md](PRODUCT.md).

## Direction

**Dark fantasy, gold and amethyst.** A night-sky purple background, gold for anything
valuable or actionable, violet for magic (essences, ascension, rare events). The combat
scene is the hero of the screen: painted biome backgrounds, large monster portraits, big
readable numbers. Everything else is quiet, framed and legible.

- Dark theme only (`color-scheme: dark`, `theme-color #0b0a14`). There is no light theme.
- Rich but not noisy: gradients and glows are reserved for gold, essence and boss moments.
- Numbers are the reward: they are large, tabular, and animate when they change.

## Color tokens

Defined once on `:root` in `globals.css`. Never hardcode a color that has a token.

| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-2` | `#0b0a14` / `#120f20` | Page background, deep surfaces |
| `--panel` | `rgba(22,19,38,.92)` | Framed panels over the background |
| `--panel-solid`, `--panel-2`, `--panel-3` | `#171428`, `#1f1a35`, `#2a2347` | Raised surfaces, inputs, default buttons |
| `--border` / `--border-strong` | `#372c58` / `#54438a` | Hairlines / emphasized frames |
| `--text` / `--muted` / `--faint` | `#efe9ff` / `#a69ec8` / `#6f6794` | Body text / secondary / labels and hints |
| `--gold`, `--gold-2`, `--gold-deep` | `#f5c85b`, `#ffe29a`, `#b8862b` | Gold currency, primary actions, focus ring, links |
| `--violet`, `--violet-2` | `#9b6bff`, `#c9a6ff` | Magic, secondary emphasis, input focus |
| `--essence` | `#c38bff` | Essences and ascension |
| `--shard` | `#7fd8ff` | Shards and the market |
| `--danger` / `--success` | `#ff5c7a` / `#6fdc8c` | Errors, boss timer urgency / confirmations |

Content colors live with the game data, not in CSS:

- **Rarity** (`RARITY_INFO` in `packages/game/src/data/items.ts`): common `#b8c0cc`, rare
  `#5aa9ff`, epic `#b86bff`, legendary `#ffb347`, mythic `#ff5c7a`. Item cards tint their
  border and background from `--rarity` with `color-mix`; legendary and mythic get a glow.
- **Biome accent** (`BIOMES[].accent`): passed as `--accent` to the scene and biome cards.
- **Hero color** (`HEROES[].color`): tints each companion's glyph and card.

## Typography

- **Display: Cinzel** (600, 700, 800) via `next/font`, variable `--font-display`. Headings,
  the gold counter, big numbers, window titles. Serif, engraved, fantasy.
- **Body: Inter**, variable `--font-body`. Everything else. Base 15px, line-height 1.5.
- Numbers that change use `font-variant-numeric: tabular-nums` so they do not jitter.
- Big numbers are formatted by `formatNumber` (K, M, B, T, Qa… then aa, ab…), with an
  in-game choice of letters, scientific or engineering notation. The same notation is used
  in both languages.

## Shape, depth, spacing

- Radii: `--radius` 10px (panels, cards, large buttons), `--radius-sm` 7px (buttons,
  inputs); pills (`999px`) for resource counters, chips and tabs.
- One shadow token, `--shadow` (`0 18px 48px rgba(0,0,0,.45)`), for floating layers.
- Spacing is tight in the game (8 to 12px gaps: it is a dense dashboard) and generous on
  public pages.

## Components

- **Buttons** (`.btn`): default (panel), `.btn-gold` (primary: gold gradient, dark text),
  `.btn-violet` (magic actions: ascension), `.btn-ghost` (secondary), `.btn-danger`; sizes
  `.btn-sm` and `.btn-lg`. Minimum height 40px. Hover brightens, press nudges down 1px.
  One gold button per view at most.
- **Resource pills** in the game header: gold (largest, Cinzel, gold gradient), essences,
  shards, then the account chip.
- **Cards** (`.card`): panel background, border, radius. Item cards, altar cards, market
  offers, achievement tiles, biome cards on the landing page.
- **Modals** (`Modal.tsx`): the only secondary surface in the game. Titled, optional icon
  and tabs, focus trapped, Escape and backdrop click close, focus returns to the opener.
  Sizes `sm` (settings), `md` (account, market), `lg` (map, ascension, achievements).
- **Toasts**: top right (top center on mobile), at most 5, auto-dismiss 3.8 s (4.5 s for
  danger). Tones: gold (achievement, ascension), violet (biome, power, crystal), loot (title
  in the item's rarity color), success, info, danger.
- **Forms**: `.field` + `.input`, violet focus border, `aria-invalid` turns the border red,
  `.field-hint` and `.field-error` under the input.
- **Segmented controls** for exclusive settings (notation, language), switches for booleans.
- **Badges** on the navigation rail: `!` urgent (pulses), `+` something to spend, a count.

## Game layout

Full-viewport app, no page scroll (`position: fixed; inset: 0`).

```text
┌──────────────────────── header 60px: logo · resources · account ───────────────────────┐
│ rail │                       combat scene                         │   companion panel   │
│ 84px │  zone + era · stage bar · buffs                            │   410px (360px      │
│      │  arena: monster, damage numbers, crystal, tutorial hint    │   under 1280px)     │
│ menus│  monster name, HP bar, boss timer or kill progress         │   heroes, talents,  │
│      │  power bar (keys 1 to 6)                                   │   buy mode          │
└──────┴────────────────────────────────────────────────────────────┴─────────────────────┘
```

- **Navigation rail**: map, equipment, inventory, market, ascension, achievements, account,
  settings. Painted icons (`public/assets/icons/sidebar-*.webp`) plus a short label; each
  opens a modal.
- **≤ 1080px**: resource labels hidden, smaller logo, scene header centered.
- **Desktop under 820px tall**: smaller rail icons so all eight buttons stay visible.
- **Compact combat HUD** (≤ 900px wide or ≤ 560px tall): era and biome on one line, smaller
  stage pips, powers and HP bar, so the monster keeps most of the scene.
- **Portrait mobile** (≤ 900px wide and taller than 560px, or any width under 600px):
  single column. Scene on top (at least 290px, 58%), companions below; a floating pill
  toggles "Companions" / "Full-screen combat" (in full-screen the scene stops above it).
  The rail becomes a fixed bottom bar that respects the safe-area insets. Logo hidden,
  toasts centered, windows open as bottom sheets.
- **Short landscape** (≤ 560px tall, at least 600px wide, i.e. phones held sideways): the
  three desktop columns, tightened: 46px header, icon-only rail, narrower companions panel
  whose title is visually hidden to leave room for the buy modes.
- **≤ 520px**: denser grids, hero rows and window padding; market in two columns.
- **≤ 480px**: the bottom bar shows icons only (eight labels do not fit; each button keeps
  its `aria-label` and `title`).
- The whole scene area is the click target (pointer down, not click, for responsiveness);
  Enter attacks when the arena has focus.

## Public pages

Landing (`/[locale]`), leaderboard, privacy, password reset, 404. Shared chrome:
`SiteNav` (logo, leaderboard, the game, gold "Play" button) and `SiteFooter` (links and a
link to the same page in the other language). The landing page: hero with the Fallen King
portrait and floating damage numbers, three steps, feature grid with the painted icons,
five biome cards, top-10 leaderboard, FAQ (`<details>`), final call to action.

There is **no language switcher in the header**. The language is chosen automatically, or
in the game's Settings window; the footer link is the only switch on public pages.

## E-mails

Every e-mail uses one template (`render` in `apps/api/src/lib/mail.ts`) carrying the site's
identity: night background, framed panel, painted logo (`/assets/brand/idlebound-logo-mail.png`,
PNG because several clients do not show WebP), Cinzel gold title, one gold button, a muted
note, then the raw link as a fallback. Tables and inline styles only, 520px max, declared
dark (`color-scheme`) so clients do not invert it; the button is a block that keeps its label
on one piece at 320px. Copy is short: a title, one or two sentences, the button, one note
(validity and "wasn't you?"). Every e-mail has a plain-text version.

## Imagery

- Painted WebP assets under `apps/web/public/assets/` (brand logo, 12 enemy portraits, 5
  zone backgrounds, 7 sidebar icons), generated from `assets-src/original` by
  `npm run assets`. Never commit unoptimized PNGs to `public/`.
- Monster variants (elites, eras, golden rat) reuse portraits with CSS `filter` tints and a
  `scale`, defined in `packages/game/src/data/biomes.ts`.
- Hand-drawn SVG icons (`apps/web/src/game/icons.tsx`: trophy, gold, essence, shard and
  the `Picto` set for powers, market offers, buffs, toasts and modals) follow the same gold
  and amethyst style, with dark outlines. **No emoji anywhere in the app.**
- Hero glyphs are Unicode symbols tinted with the hero's color, forced to text
  presentation (`TEXT_PRESENTATION`, `font-variant-emoji: text`) so they never turn into emoji.

## Motion

- Monsters: entrance, idle breathing, death; bosses and golden rats get a pulsing glow.
- Damage numbers float up from the pointer; crits are bigger and gold; gold gains rise.
- HP bar has a trailing "ghost" bar; the boss timer turns red under 30%.
- Crystals float, shine and blink before expiring; affordable talents pulse; the urgent
  badge pops.
- Durations are short (120 ms for UI feedback, under 1 s for effects). Motion never blocks
  input.
- **Reduced motion**: honoured from `prefers-reduced-motion` and from the in-game
  "Reduced animations" setting (`.reduced-motion` on `<html>`), which stops the looping
  animations. Damage numbers can be turned off separately.

## Sound

Synthesized in the browser (`apps/web/src/game/audio.ts`), no audio files: hit, crit, coin,
kill, boss, fail, buy, skill, crystal, loot, achievement, ascend, error. Unlocked on the first
pointer or key press, with an on/off switch and a volume slider in Settings.

## Voice and copy

- **French**: warm, epic, playful, always *tutoiement* ("Clique sur le monstre…").
- **English**: the same energy, direct second person ("Click the monster…"), idiomatic
  rather than literal.
- Short sentences, verbs first on buttons ("Jouer gratuitement" / "Play for free").
- **Never use an em dash (—)** in any user-facing string, in either language. Use " : " (FR)
  or ": " (EN), " · " or a comma.
- Game terms are consistent: gold, essences, shards, companions, powers, altars, relics,
  ascension, stage, era, elite, guardian.
- Every user-facing string exists in both languages (see AGENTS.md for where they live).

## Accessibility

- Visible focus ring everywhere (`2px solid var(--gold)`, offset 2px).
- Modals are real dialogs (`role="dialog"`, `aria-modal`, labelled title, trapped focus).
- Icon-only buttons carry `aria-label`; decorative images use `alt=""`.
- Keyboard: 1 to 6 for powers, Enter to attack the focused arena, Escape to close.
- Text keeps the `--text` / `--muted` contrast on panel backgrounds; `--faint` is only for
  non-essential labels.
- `<html lang>` follows the current locale.
