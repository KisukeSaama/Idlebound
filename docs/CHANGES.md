# Changes

The notes of every version since the last patch note, gathered as the work lands, so the
patch note of the next major version (1.0 is the launch) writes itself. Rules in [AGENTS.md](../AGENTS.md#versions-and-patch-notes).

- The game only: one line per change a walker can see or feel on the road, in plain words,
  starting with the thing it touches, with the numbers they will notice (before and after).
  No file, function or commit names, and no results of our tests or simulations. The site around the game (landing page, wiki, news,
  menus) has no line here: a site change worth telling gets an announcement.
- Sorted under **New**, **Balance**, **Fixes**. Empty headings are left out.
- Every merge into main ships the version of the root package.json. The heading "Next
  version" names it; once main carries it, the section is renamed to the version and a fresh
  "Next version" opens on top. Only a major version gets an article: it gathers every section
  since the previous one (here, everything after v0.4).
- Up to v0.5.3, releases were git tags; they are no longer used.

## Next version: v1.2.1

### Fixes

- Talents on a phone: a single tap buys a talent within reach. Before, on some phones the
  first tap only opened its card and the second one bought it. A talent out of reach or
  already learned still opens its card when touched.
- Confirmations opened from a window: Escape closes the confirmation alone and leaves the
  window open. Before, it closed both at once.
- Leaving the game for another page of the site (the home page, the wiki) keeps what was
  played and lets the game go: coming back plays on at once. Before, up to 30 s of play
  were lost and the game said it was played on another page.
- A new version arriving while another page had taken the game: this page stands aside.
  Before, it played on behind the notice, and nothing it played was kept.
- The Ledger out of reach at load: the page waits and tries again at its own pace, and
  loads the game once. Before, it also asked every 5 s and could load the game twice.
- A save conflict that could not be read (network lost at that moment) is shown as a
  trouble, and leaving the page warns that play would be lost. Before, it looked saved.
- Powers on a French keyboard: the keys 1 to 7 of the number row (and the keypad) use the
  powers without Shift. Holding a key no longer repeats the refusal sound.
- The purse past stage 3500: gold still flying to the counter no longer makes it show 0
  for a moment when the numbers change unit.
- Pip's Wager past stage 3500 pays what the road would have paid, as above it. Before, it
  always paid its minimum (30 times the stage's gold).
- The Unfinished waits to be beaten. Before, it vanished a tenth of a second after it
  appeared, and its echo of the Draft was almost never heard.
- A promise standing through more than 100 Kings in one night no longer stops the game
  from saving.
- A long absence with no companion who can fight leaves the walker before the guardian
  that beat them, auto-advance off. Before, they came back facing it again.
- Numbers that round up to a thousand go on to the next unit: "1M", not "1000K"
  (and "1.00e7", not "10.00e6").
- A save after a word given at dusk itself, kept once the night ended, is no longer
  refused ("Last night's word was rewritten").
- Keeping this page's game after another page played on (a long absence sent in several
  parts): the later parts are no longer refused.
- Two pages of a new guest saving their first save at once: one keeps the game, the other
  is asked which to keep. Before, the second could start another game under a new key.
- French: the Caravan is the Roulotte everywhere, the Deeds are "hauts faits" everywhere,
  "Il te faut une place libre" for a single space, and a few lines of lore read right.
- Age VIII: half-closed eyes lose only their top row. Before, tall eyes closed to a line.

## v1.2.0

## v1.1.0

### New

- The road waits for the Ledger: when the Ledger stays out of reach long enough (about twenty
  minutes of the busiest play), the game stops where it stands, the header says "The road
  waits for the Ledger", and it goes on as soon as the Ledger answers; the time waited comes
  back as time away. Before, the game played on without it for as long as the page stayed
  open.
- A new game begins with the Ledger: one per account, and one per browser for a walker
  without an account, the same until it is played.

### Fair play

- Every save carries what the walker did since the last one, and the Ledger walks the road
  again from it with the shared engine, from the save it builds on; for now it compares and
  notes what differs (shadow mode), and keeps its own game once enforced.
- Fates are split by use (strikes, spawns, spoils, crystals appearing and caught, chests,
  the road's events), the n-th of each always the same; their seeds stay with the Ledger,
  which hands out a window of them at a time. The odds are those of before.
- The game advances in steps of 100 ms whatever the page does, and its maths are written so
  every browser lands on the same numbers.
- The Ledger keeps, per account and per day, what it sees of the walker's presence outside
  their strikes (crystals and how fast, powers relaunched, ascensions, the longest stretch
  without a pause), for a person to review the leaderboard. Nothing is decided by it alone.
- Keeping one device's game over the other's, when that device is further along, is
  accepted: its road is walked again from where the other device took the game.

## v1.0.0

### New

- The road: it no longer stops at stage 3000. The Dawn still stands there, and once beaten
  lets you through; below it the night draws itself again from its first stratum (Era LXI,
  the Kingdom II, the Fallen King at 3050…), as deep as you walk. Depth stays open on the
  Roll. HP, gold and damage read in your notation at any depth (the letters go on after zz
  with aaa), and depths read whole in the Hall and the epilogue (10432, not 10.4K).
- The Dawn's keystone and Aldemar's words before it, the Dawn's Bestiary page and its place
  now open onto the road below instead of closing it.
- Below the Dawn the Remnants grow stronger a little more slowly with each stage, from
  ×1.18 toward ×1.152, so the road neither runs away nor freezes.

- The Ledger's scenes play like films, under their own theme, a melody that comes back in
  every scene: the camera moves over the world, the walker and the King face each other on
  its ground, a blow strikes in a frame of two colors and a shake, lines come up under the
  picture a word at a time in a cinema frame of night ink, the night quiet beneath. A press
  shows a line whole, then the next; Skip still ends it. Reduced motion keeps still pictures.
  The First Dusk, Almost and the Empty Throne are staged again, and six scenes are new: the
  Long Night opens every new walk, and five more wait at the great turns of the road (deep
  stages and the first Descent). Scenes you lived but never saw are
  told once, and wait in the Chronicle.
  The walker appears in them in their own drawing, as Aldric: on guard, striding, lunging.
- The world's air: the lights of every place (windows, lanterns, braziers, crystals, the moon)
  glow softly and flicker when they are fire, the Mire's pools reflect the creature and the
  lights above them, and the edges of the view sink into the night, in the Ledger's scenes
  too. Reduced motion keeps it still.
- Accounts: you can change your username from the account window, once every 90 days
  (password required). The leaderboard shows the new name at once, and the old one becomes
  free for other walkers.

### Fixes

- Saving: three honest walks could see their save refused, and no longer do: a game left
  open a long time between two saves (a dropped connection, a long wait at a guardian), for
  the powers used in the meantime; a night begun with the Ring of the Second Morning worn,
  once the ring is taken off; and a crystal's essences caught by a walker whose essences
  gathered have grown past a hundred quadrillion.
- Saving: deep in the night, the first save after a Descent could be refused (the gold you
  earned with the Altar of Fortune high was weighed against the Sanctum just unwoven). It no
  longer is.
- Accounts: when your session ended without the page reloading (your password changed on
  another device), creating or joining another account from that page carried the old
  account's game over to it. A game now belongs to one account only: the new one starts
  its own walk, and the Ledger never keeps the same game under two names.
- Accounts: when your session ends while you play, logging back in now keeps everything you
  played since, instead of going back to your last save.
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
