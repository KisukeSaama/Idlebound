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

## Next version

## v2.0.1

### Fixes

- Wandering crystal: it now shows the moment it falls. Before, on a busy night, only its
  violet glow could appear for a second and more, and a crystal of the Lantern Queen's storm
  could fade before it was seen.
- Relic cards: every card of the bag and of the worn slots now has one height, whatever the
  relic says. The relic's color lights its top, and a long relic scrolls its own lines. In
  the bag, Equip and Lock sit side by side with Salvage across under them, on every card:
  salvaging relic after relic keeps the next one's button under the pointer. Before, the
  cards changed height as relics left the bag.
- Header: the counters stay centered and still as the road goes on. Essences and shards keep
  their width like gold, and the account's warning no longer pushes the counters aside.

## v2.0.0

### New

- The bestiary redrawn: every creature of the road that had no painted portrait (the Carrion
  Crow, the Hollow Scarecrow, the Lantern Moth, the Dusk Hare, the Last Reaper, the Lost
  Shepherd, Pip, and every creature of the Wychwood, the Deepvaults, the Mire and the Keep
  drawn since), the event creatures (the Lantern Queen, the Seam Warden, the Echo of a
  Walker, the Stray Armor) and the King's later forms are painted again in the hand of the
  first creatures, then traced into the world's pixels: the same fur, feathers, stone and
  cloth as the Field Rat, the same moonlit rim and glowing eyes. Each keeps its place, its
  rank, its size class and its story.
- The rest of the world repainted the same way: every companion portrait and Aldric in every
  pose (on guard, the stride, the lunge); every building, ruin and far silhouette of the five
  biomes and the Sanctum's standing stones and altars, still crumbling and overgrown Age after
  Age; every relic, base and named, rarity by rarity; the in-world icons of the altars, powers,
  stall and Caravan (now 32 pixels, twice as fine); the chests and the satchel; the scarecrow
  of the fields and the giant's skull of the Elder World.

## v1.3.0

### New

- Relics remember. From epic up, a relic keeps a trait of its slot, one effect while worn
  (two for a mythic): 19 in all. The weapon: Vanguard (companion damage), the Host (more for
  every companion in the company), Rout (a stage already walked falls at once sooner), Steady
  Rhythm (Patience bonus). The armor: Bulwark (seconds to beat elites and guardians), Old
  Scars (wounds kept at any depth, never the King), Spoils (more relics from guardians),
  Skyglass (more shards), Regicide (damage to the King). The amulet: Attention (crystals
  sooner), Second Breath (powers recharge faster), Keen Edge (strike damage), Pip's Friend
  (golden rats), Storm Caller (more Crystal Storms). The ring: Fortune (gold), Homecoming (a
  stronger Reunion), Lucky Star (legendaries and mythics more likely on the road), Deep
  Satchel, Vigil (a longer absence lived).
- A legendary or a mythic remembers the companion who carried it: that companion deals ×1.5
  (legendary) or ×2 (mythic) damage while it is worn.
- Sets: every relic comes from the place it dropped in (its name says it). Two relics of one
  place worn together wake a set, four a stronger one: the Plains (gold), the Grove
  (Patience bonus), the Depths (shards, and relics at four), the Mire (seconds against
  elites and guardians), the Crown (damage to the King).
- Awakening, at the forge: Brom brings a relic down to your deepest night, in the same
  place. It keeps everything it remembers and takes the density of that depth, for shards
  per stratum. A relic you love is never too old.
- The company's satchel: while you are away, the guardians and elites the company passes
  leave their relics as when you are there. The company keeps up to 6 in its satchel and
  hands it to you at the Reunion. Open it: the relics come out one by one, hidden until you
  touch them, the rarest last, its light already leaking under the flap.
- Relics fall on the road: a relic found on a guardian, an elite or a Seam is thrown out of
  it, falls in front of you, shines for its rarity (rings from epic up, a column of light
  for a legend) and flies to your pack.
- The first fall of the King in your walk leaves an epic relic or better.
- The road owes you a story: after 12 relics of the road without an epic or better, the
  next one is.
- Salvage on arrival, in the pack: commons, or commons and rares, turn into shards as they
  arrive (never a named relic, never into an empty slot).

### Balance

- Density depends on rarity: per stratum below the present night, ×1.02 for a common,
  ×1.024 rare, ×1.027 epic, ×1.03 legendary, ×1.032 mythic. Before: ×1.03 for every relic.
- Rare relics have no trait: from epic up, they do.
- Below the Dawn, a relic's density stops at the sixtieth stratum: an object remembered
  deeper weighs what one of the First Mark weighs. Before, it kept growing ×1.03 a stratum.

### Fixes

- A guardian replayed below the furthest stage no longer keeps wounds from a failed fight,
  and wounds left behind on the road heal once the company passes them.

## v1.2.3

### Fixes

- The Blank (stages 2501 to 2750): creatures are drawn in ink on the page, a dark line
  around a white body with hatched shadows, and lose their color stratum by stratum.
  Their shadows are a pale wash. Before, only a faint outline was left and the scenery
  showed through the body, under a black shadow.

## v1.2.2

### Fixes

- Bag: every relic card is as tall as the tallest one, and Salvage sits at the right edge.
  Salvaging relic after relic keeps the next one's button under the pointer. Before, the
  cards moved up and down as they changed places.
- Buttons on iPhone: powers, companions and every key of the game answer the first tap.
  Before, on iPhone a tap often went nowhere and the key needed a second one.
- Notifications: a tap clears one at once, and the same tap reaches what lies under it, so
  a crystal behind a notification is caught and the creature is struck. Before, a
  notification could not be cleared and hid the crystals until it left on its own.

## v1.2.1

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
