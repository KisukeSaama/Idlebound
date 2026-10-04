# Changes

The notes of the version in progress, gathered as the work lands, so the patch note of the
next release writes itself. Rules in [AGENTS.md](../AGENTS.md#versions-and-patch-notes).

- The game only: one line per change a walker can see or feel on the road, in plain words,
  starting with the thing it touches, with the numbers they will notice (before and after).
  No file, function or commit names. The site around the game (landing page, wiki, news,
  menus) has no line here: a site change worth telling gets an announcement.
- Sorted under **New**, **Balance**, **Fixes**. Empty headings are left out.
- Every merge into main ships the version of the root package.json. While that version is a
  minor or major, the heading names it and its article; once main carries it, the section is
  renamed to the version and a fresh "Next version" opens on top. A patch version (`v0.5.2`)
  has no article: its lines stay here and go out with the next minor or major.
- Up to v0.5.3, releases were git tags; they are no longer used.

## Next version: v0.6.0 (`patch-notes-0-6-0`, covers v0.5.1 to v0.6.0)

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

## v0.5.0 (`patch-notes-0-5-0`, covers v0.4.1 to v0.5.0)

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

- v0.4.0 (`patch-notes-0-4-0`, covers v0.3.1 to v0.4.0)
- v0.3.0 (`patch-notes-0-3-0`, covers v0.2.2 to v0.3.0)
- v0.2.1 (`patch-notes-0-2-1`, covers v0.1.1 to v0.2.1; v0.2.0 was never tagged, so v0.2.1
  opens the 0.2 line)
- v0.1.0 (`patch-notes-0-1-0`, the opening)
