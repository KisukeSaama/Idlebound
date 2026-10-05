# Changes

The notes of every version since the last patch note, gathered as the work lands, so the
patch note of the next major version (1.0 is the launch) writes itself. Rules in [AGENTS.md](../AGENTS.md#versions-and-patch-notes).

- The game only: one line per change a walker can see or feel on the road, in plain words,
  starting with the thing it touches, with the numbers they will notice (before and after).
  No file, function or commit names. The site around the game (landing page, wiki, news,
  menus) has no line here: a site change worth telling gets an announcement.
- Sorted under **New**, **Balance**, **Fixes**. Empty headings are left out.
- Every merge into main ships the version of the root package.json. The heading "Next
  version" names it; once main carries it, the section is renamed to the version and a fresh
  "Next version" opens on top. Only a major version gets an article: it gathers every section
  since the previous one (here, everything after v0.4).
- Up to v0.5.3, releases were git tags; they are no longer used.

## Next version: v0.7.0

### New

- Accounts: you can change your username from the account window, once every 90 days
  (password required). The leaderboard shows the new name at once, and the old one becomes
  free for other walkers.

### Fixes

- Saving: three honest walks could see their save refused, and no longer do: a game left
  open a long time between two saves (a dropped connection, a long wait at a guardian), for
  the powers used in the meantime; a night begun with the Ring of the Second Morning worn,
  once the ring is taken off; and a crystal's essences caught by a walker whose essences
  gathered have grown past a hundred quadrillion.
- Fair play: the Ledger now checks your relics, forge levels, shards, golden rats, Seams and
  the gold of each save much more closely, so the leaderboard ranks only walks that really
  happened. An honest walk sees no difference.

## v0.6.1

### Fixes

- Updates: a new version that keeps the same number (a small fix) shows that number once on
  the update screen, instead of "v0.6.0 to v0.6.0".

## v0.6.0

### New

- Leaderboard: the Kingslayer board gives way to **Rewoven Nights**, the Descents that wove
  at least one thread. Kingslayer ranked walkers almost exactly like Depth; this one rewards
  your pace at Eldra's Loom. Your past Descents already count.
- Updates: when a new version arrives while you play, the screen no longer just goes dark.
  An update screen names it (v0.5.3 to v0.6.0, for example) and fills its bar while your
  progress is put somewhere safe, then the game comes back on the new version.

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
- Settings: the version at the bottom of the window is the one you really play (v0.6.0, for
  example). It always read v1.0.
- Updates: a game moved to a new version while you watched it no longer comes back saying
  it is open elsewhere for two minutes.

## v0.5.0

### New

- Powers: each one states its true recharge, after the Altar of Echoes and the relics that
  shorten it (Frenzy with Echoes level 4: 8 min instead of 10 min). It used to show the base.
- Hall of heroes: a deed's bar starts from the tier before it, not from zero; for gold and
  the mightiest hit it moves by orders of magnitude (2e201 gold toward 1e205: three quarters).
- Hall of heroes: gold and damage thresholds are written in the walker's notation.

### Fixes

- Patience bonus and Sanctum altar values follow the chosen notation past 1000% (10300% and
  letters-only before; now 10.3K%, 1.03e4% or 10.3e3%).

## Before v0.5.0

These releases came before this file. Their patch notes were written afterwards from the
code, and the articles hold their lines:

- 0.4 (`patch-notes-0-4`, covers v0.3.1 to v0.4.0)
- 0.3 (`patch-notes-0-3`, covers v0.2.2 to v0.3.0)
- 0.2 (`patch-notes-0-2`, covers v0.1.1 to v0.2.1; v0.2.0 was never tagged, so v0.2.1
  opens the 0.2 line)
- 0.1 (`patch-notes-0-1`, the opening)

These four articles are the last before 1.0: they are named after their line (0.1 to 0.4).
