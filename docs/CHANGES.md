# Changes

The notes of the version in progress, gathered as the work lands, so the patch note of the
next release writes itself. Rules in [AGENTS.md](../AGENTS.md#news-and-patch-notes).

- One line per change a walker can see or feel, in plain words: what changes for them, with
  the numbers they will notice (before and after). No file, function or commit names.
- Sorted under **New**, **Balance**, **Fixes**, **Site**. Empty headings are left out.
- When the release is tagged, its section is renamed to the tag and points to its article;
  a fresh "Next version" opens on top.

Tags up to v0.4.2 came before the news pages and have no article.

## Next version (after v0.5.1)

### New

- Leaderboard: the Kingslayer board gives way to **Rewoven Nights**, the Descents that wove
  at least one thread. Kingslayer ranked walkers almost exactly like Depth; this one rewards
  your pace at Eldra's Loom. Your past Descents already count.

### Fixes

- Accounts: someone guessing your password from many places at once can no longer keep you
  out of your own account; their guesses stop, yours still go through.
- Accounts: fixing a mistyped address cancels every password reset link sent to the old one,
  and each fix counts toward the 3 confirmation e-mails allowed per hour.
- Names: reserved names and banned words are also caught when written with look-alike
  letters (a lowercase l for an i, "rn" for an m, ø, æ, ß and their kin).
- Saving: a device whose clock runs a few minutes fast no longer has its new game refused
  forever. The game now keeps the server's time, not the device's.
- Fair play: the Roll of the Deep is better protected. A record claimed outside any night
  the server saw, powers made ready again by reopening the game, a Caravan bought twice by
  turning the clock back, extra play time claimed at every save, or a copy of a guest's game
  taken into a second account are now refused. Honest play is not affected.
- Unweave: crossing a stage with Unweave right after another no longer risks a refused
  progress.

## v0.5.1 (`patch-notes-0-5-1`)

### Fixes

- Wiki: creatures are drawn at their true size, every pixel whole, sharp at any display
  density, in the bestiary, the biome pages and the "through the Ages" section of each
  creature; their grid makes room for them instead of squeezing them into a fixed frame.

## v0.5.0 (`patch-notes-0-5-0`)

### Site

- News pages: patch notes and announcements, with the three latest on the landing page.
  Every article has its pixel art cover; the newest one opens the page in large.
  First article: the wiki announcement (`the-wiki-opens`).
- The wiki: a guide for the first nights, FAQ, calculator, a page per companion, creature and
  named relic, every system of the game; spoilers hidden ("No spoilers" mode), opened by the
  walker's own game or by choice. In progress.
- The site menu sits the same on every page, logo on the left and links on the right, as on
  the landing page. Its "The game" link is gone: the logo leads back to the landing page.
- News: every article now has its own picture when it is shared (its cover), and the news
  can be followed by RSS, in French or in English.
- Wiki and news read better with a screen reader or a keyboard: a "Skip to content" link
  opens every page, the calculator reads its result in one short sentence, the reading modes
  say what they do. A page about something you have not met yet no longer gives its name away
  in your browser's tab.
- The site menu is now slimmer and stays at the top of the screen while you read, pages glide
  to the part you pick, and a button in the corner brings you back to the top of long pages.
- The language is chosen from a globe at the bottom of every page, which opens a small
  window listing the languages; the choice is remembered, as in the game's Settings.
- On the landing page, striking the Fallen King now shows the same damage numbers as the
  game: the same writing, the "Critical" mark over a critical hit, and quick blows fanning
  out so each one stays readable.
