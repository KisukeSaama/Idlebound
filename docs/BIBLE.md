# Idlebound: the Bible

The world, story, content and art direction of the finished game. This is a **proposal
and a reference**, not a description of what ships today: [PRODUCT.md](../PRODUCT.md) says
what the game does now, [DESIGN.md](../DESIGN.md) how it looks now. When a piece of this
document is built, move its rules into those files and mark it here as shipped.

Everything below was written from the code as it stands (save version 4): 21 heroes,
5 biomes, 5 era tags, 13 altars, 6 powers, 6 market offers, 75 achievements, 4 relic
slots, 4 leaderboards, stage cap 3000. Every existing number, name and rule keeps working;
the story is laid **over** the mechanics, never against them.

---

## 0. How to use this document

**Three levels of canon.**

| Level | Who sees it | Rule |
|---|---|---|
| **Surface** | Every player | What the game says plainly: names, descriptions, toasts, tutorial. Always true, never the whole truth. |
| **Hint** | Players who read, collect, return | Fragments, companion memories, bestiary lines, relic legends, the King's Words. Each hint is true from its speaker's point of view; speakers can be wrong. |
| **Truth** | Writers only | Section 4. **Never displayed as such**, in any language, anywhere. The game circles it; it never says it. |

**Rules for anyone who writes content:**

1. The loop is the story. There is no final victory screen, no credits, no "you won".
   Every piece of text must make the next night feel worth walking.
2. Never explain. Show one object, one gesture, one sentence someone said, and stop.
   If a line answers a question from section 4, cut it or turn it into a new question.
3. Every Truth layer gets **at least three independent hints** from three different
   voices before the calendar lets a player be sure of it (section 16).
4. Every mechanic has a reason inside the world (section 6). A new mechanic without one
   is not finished.
5. Product rules still apply: every string in French and English, no em dash, no emoji,
   French in *tutoiement*, text in `packages/game/src/content/` or the web dictionaries.

---

## 1. The pitch

> Every night, the Fallen King rises. Every night, you cut your way to his throne through
> the fields, the woods, the caves and the mire of a kingdom that no longer exists. And
> every night, when he falls, the dark rolls back to dusk and the road begins again.
>
> Your companions forget you. The monsters do not. And each time you come back, the night
> goes a little deeper, into older and older memories, toward something the kingdom's
> wisest people swore did not exist: the bottom of the night, where the morning waits.

**Idlebound** is the story of a world that survives only because someone keeps walking
through it. The player is that someone. The ascension is not a reset button: it is the
act that holds the world together. Stopping is the only way to lose, and even stopping
has a face in this world (it wears a crown).

**Tone:** warm dark fantasy. Melancholy under the jokes, jokes under the melancholy. A
tired king, a lich with a grudge, a rat that is suspiciously lucky, a knight whose armor
may be empty, a beastmaster whose worst beast is called Biscuit. The French copy stays
epic and playful in *tutoiement*; the English copy has the same energy.

---

## 2. Themes and the promise

- **No end, but a meaning.** The night must not end. The meaning is not "win", it is
  "keep it alive". Every ascension is a small, necessary rebirth; the Chronicle (section
  12.1) records each one as a chapter. The deepest truth the game will ever hint at is
  that the world lasts as long as someone is there to look at it.
- **Memory is power.** Essences are distilled memories. Holding them makes you strong
  (+10% DPS each); giving them to the altars builds something permanent but leaves you
  lighter. Give everything away and you forget who you are: that is what happened to the
  Nameless. The core economic decision of the game is the core moral question of its
  world.
- **Being forgotten by those you love.** Companions reset each ascension. They meet you
  again, every night, as strangers. Recognition (section 12.2) lets them slowly, painfully
  remember.
- **Presence.** The world only moves while it is watched. Crystals only appear when the
  tab is visible. A closed game runs on for one night at most, carried by the company, then
  holds its breath. The player's attention, even distracted, is literally what keeps the
  night going. The game never says so. It simply behaves that way.
- **Fairness.** The Ledger records only what truly happened. That is why the Roll (the
  leaderboard) can be trusted, and why no one can buy their way into it.

---

## 3. Cosmology

### 3.1 Orvane

**Orvane** (FR: *Orvane*) was a small, old kingdom of fields, woods, mines and marshes,
ruled from a keep of pale stone. Its people were farmers, miners, monks and hedge-mages.
Its sky was, as far as anyone knew, a sky. Its last king was **Aldemar** (FR: *Aldemar*),
called the Kind, later the Last, now the Fallen.

The five biomes are what is left of Orvane, laid out along a single road the Bound walk
every night: the **Hearthfields** (Verdant Plains), the **Wychwood** (Dark Forest), the
**Deepvaults** (Forgotten Caves), the **Mire of Osric** (Corrupted Marsh) and **Orvane
Keep** (Fallen King's Ruins).

### 3.2 The Long Night

Orvane is trapped in a single night that repeats: **the Long Night** (FR: *la Longue
Nuit*). It is always dusk when a run begins and always the dead of night when the King
falls. The interface's night-sky purple is not a style choice inside the fiction: it is
the sky of Orvane, and it has not changed in longer than anyone can count.

Why the night repeats is the central mystery (section 4). What people inside the world
know:

- the night was **woven** on purpose, a very long time ago, by someone who could weave time;
- the King asked for it;
- something called **the Morning** (FR: *le Matin*) must never come. Old texts call it
  the Pale Light, the Unmaking, the Quiet. Nobody who uses those words agrees on what they
  mean.

### 3.3 The Bound and the name Aldric

The ones who walk the Long Night are **the Bound** (FR: *les Liés*). The game's title is
their name: bound to the night, bound to walk it, bound to those who watch them. Every
walker carries the same name, **Aldric**, which in the old tongue of Orvane means roughly
"the one who goes on". The player never learns whether Aldric is one person, a title, or
a long line of people. (Hints: the Nameless remembers only that name; the Fallen King's
crown bears a worn initial, "A".)

### 3.4 The Sanctum of Dusk

Between the King's fall and the next dusk, the walker stands in the **Sanctum of Dusk**
(FR: *le Sanctuaire du Crépuscule*): a circle of standing stones on a hill that does not
exist during the night. This is where the ascension happens, where essences are counted,
and where the thirteen **altars** stand. Each altar was built by a walker, from their own
memories. Nobody knows how many walkers built them.

### 3.5 Essences: distilled memory

When the King falls, everything the walker lived that night condenses into **essences**
(FR: *essences*): small violet lights that hum. The deeper the night went, the more
memory it leaves. Holding essences makes the walker stronger because a walker who
remembers more fights better. Offering them to an altar turns a memory into a permanent
stone: the altar remembers it for you, forever, and you no longer do.

### 3.6 The Sky-Glass: shards

The sky of Orvane is a dome of dark glass, the **Sky-Glass** (FR: *la Voûte de verre*).
It is cracked. Its pieces fall as **shards** (FR: *éclats*), which is why guardians carry
them, why Garrick digs for "fallen stars", and why they are the currency of the
**Stallkeeper**, who buys them back to patch the sky. What leaks through the cracks, if
the glass ever breaks, is the Morning.

### 3.7 The Remnants

The monsters are **Remnants** (FR: *Vestiges*): memories of Orvane that have soured from
being relived too many times. A field rat is the memory of every rat that ever lived in
the Hearthfields; a guardian is a memory so heavy it has grown a will. Remnants do not
bleed: in the pixel art (section 18) they come apart into points of light. They come back
every night, because the night remembers them. They are not evil. They are worn out.

### 3.8 The Strata

Each full loop of the five biomes (50 stages) takes the walker one layer deeper into the
night's memory: an **era**, called a **stratum** (FR: *strate*) by scholars. The deeper the
stratum, the older the memory, the heavier the Remnants (this is why era monsters are so
much tougher). The code already names the first five: **Echo, Ash, Void, Astral,
Primordial**. The archmage Lysandre named them, and he was certain Primordial was the
bottom of the world. It is not. There are **60 strata**, grouped in **12 Ages** (section 9),
and the last one is called **Dawn**.

### 3.9 The Dawn

The technical cap of the game, stage 3000, is the edge of the night. Past it lies the
Morning. The final guardian at stage 3000 is not a king but a thin line of pale light
(section 8.8). The walker can reach it, can even beat it, and still cannot cross it:
crossing would end everything. The game's last keystone fragment says only: **"Not yet."**
(FR: *« Pas encore. »*)

### 3.10 The Roll and the Ledger

Other walkers exist. Each walks their own Long Night, on their own strand of the weave.
They never meet. The only place their strands touch is **the Roll of the Bound** (FR: *le
Registre des Liés*), the public leaderboard, which lists the names of every walker who
inscribed theirs. The Roll is kept by **the Ledger** (FR: *le Grand Livre*), which records
only what truly happened: a false memory cannot be written into it. That is the anti-cheat,
in the world's own words.

---

## 4. The Truth (writers only, never displayed)

The mystery is built in six layers. Each layer recontextualizes the previous one. The
game reveals them in order through hints (section 16), and never states the last one.

**Layer 1: the curse.** *(What the landing page says.)* A cursed kingdom, a Fallen King,
an adventurer who slays him. Surface level, true enough.

**Layer 2: the loop.** The night repeats. The walker is reborn at dusk. The King rises
again. Essences are memories. Companions forget; monsters do not.

**Layer 3: the Binding.** The loop was made on purpose. Faced with the coming of the
Morning, King Aldemar asked Eldra, a weaver of time, to bind Orvane into its last night.
The price: someone must walk the night, every night, to clear the Remnants before they
pile up and tear the weave. Aldemar's sworn knight, **Kaelen**, was meant to walk first.
On the night of the Binding he ran. The King walked in his place.

**Layer 4: the crown.** The Fallen King is not the enemy. He is the **first walker**, who
walked so many nights that he stopped, sat on his throne and let the crown hold him. The
crown makes whoever stops into the guardian of the seam between nights; defeating the
guardian opens the seam and rolls the night back to dusk. Every walker who stops for good
becomes a King. Every walker who gives away all their memories becomes a Nameless. Both
fates wait for the player; neither is ever forced.

**Layer 5: the dream.** The strata are not only older memories of Orvane. Below the
Primordial lie the making of the stars, the loom that wove them, the first drafts of the
world, the words that named it, and finally the edge of a **dream**. Orvane is being
dreamed. The Morning is the dreamer waking. The Long Night is the dreamer, somehow, not
waking. Aurelion's line ("this is not the first world to be dreamed") hints that other
dreams ended before.

**Layer 6: the watcher (never confirmed).** The dreamer sits behind the Glass. When the
dreamer's eyes are on the world, even half-closed, the night goes on (tab open, idle).
When the dreamer sleeps (the game closed), the dream runs on for one night, no longer, and
then the world holds its breath. The
crystals come only when someone is watching (they only spawn in a visible tab). The
Awakened is "you, perhaps, in another life". Aldric is "you". **The player is the
dreamer.** This is never written anywhere. Age IX strata (Lantern, Hearth, Lullaby,
Window, Glass) and the last keystone make it feel true; the player decides.

**Questions the game never answers**, on purpose, forever:

- Who dreams the dreamer?
- Was Aldemar right to stop the Morning?
- Is Aldric one person?
- What happened to the walkers who reached Dawn and did not come back to the Roll?
- What is Pip?

---

## 5. Chronology (in-world)

Given as the scholars of Orvane would tell it, then as the Truth corrects it.

| Period | Scholars' version | What actually happened |
|---|---|---|
| The Primordial | The beginning of the world. Nothing lies below. | One stratum among sixty. The sages simply could not dig further. |
| The Astral Age | Stars fell and cooled into the mountains; star-shards lie in the caves. | Pieces of the Sky-Glass, which is younger than they think. |
| The Void | A great emptiness swallowed a third of the land. | The first time the Morning came close. Something was forgotten, whole. |
| The Ash Age | The Pyre cult burned the old forests to "call back the sun". | Ashka's order still believes the Morning is a sun to be welcomed. |
| The Echo Age | Orvane's kingdom rose; the caves began to repeat voices. | The weave was already thin; echoes are the first leaks between nights. |
| The Reign of Aldemar | A kind, stubborn king, forty years of peace. | |
| The Pale Year | Colors faded at the edges of the realm; the sky cracked. | The Morning, arriving. |
| The Binding | The King and a weaver vanished into the keep. The night fell and did not lift. | Eldra wove the Long Night. Kaelen fled. Aldemar walked. |
| The Long Night | Countless nights. Nobody counts them any more. | The Bound walk. The Roll fills with names. The player arrives. |

---

## 6. Every mechanic, justified

Every existing system, what it is in the world, and the word the UI can lean on.

### 6.1 Combat and progression

| Mechanic (code) | In the world |
|---|---|
| Click damage (Aldric) | The walker's own sword. The only blow in the night struck by someone the night did not make. |
| Critical hit ×10 | A **true strike**: the blade finds the seam in a Remnant's memory and it comes apart. |
| Gold | The coin of Orvane, still in the Remnants' pockets. Gold is always "old coin": minted before the Binding. |
| Stage, 10 kills to advance | A stretch of the road. Ten Remnants cleared and the next milestone stone lights up. |
| Elite every 5 stages (×6 HP) | A **Warden**: a Remnant heavy enough to hold a stretch of road on its own. |
| Guardian every 10 stages (×10 HP) | A **Guardian**: the memory that holds a whole biome together. |
| Boss timer (30 s) | The **seam** of the hour: a guardian can only be beaten while the seam it holds is open. When it closes, the night pushes the walker back. |
| Failing a boss, one stage back, farm mode | "The night pushes back." The walker trains on the previous stretch until strong enough. |
| A guardian of the present night keeps its wounds (shipped) | A Remnant remembers the blows of the night too: the walker who comes back finds it still bleeding light. Deeper memories are too dense to keep a wound, and the King's seam closes whole. |
| Auto-advance | The walker's will to go on. Turning it off is choosing to stay a while. |
| HP curve (steeper by segment) | Older memories are denser. The Remnants of deeper strata are heavier to unmake. |
| Eras (every 50 stages) | Strata of the night's memory (section 9). |
| Biome cycle | The same road, each night deeper: the Hearthfields of the Void stratum are the Hearthfields as they were remembered in the Void. |
| Stage cap 3000 | The Dawn (section 3.9). |
| Golden rat (1% base, ×10 gold) | **Pip** (FR: *Messire Pip*), a golden rat who is the same in every stratum. In the code it is the only monster that never gets an era variant; in the world it is the only creature that is not part of the night. Nobody knows why it lets itself be caught. |
| Treasure chance cap 25% | Pip does not like to be taken for granted. |

### 6.2 Companions

| Mechanic | In the world |
|---|---|
| 20 companions, hired in order | The people the walker meets along the road, always in the same order, because the night is always the same night. |
| Companions reset on ascension | At dusk, everyone forgets. Only the walker (and Pip) remember. |
| The Promise (shipped): at dusk, the walker's word to one companion shapes the night; kept until the next dusk with the King fallen, the night counts twice in their memory for the two words their last memories wait for (if they reached level 100), once otherwise; never the same companion two nights running (section 12.11) | At dusk everyone forgets, except a word given. A companion cannot remember the walker, but can ask them for something, and a walker who keeps asking to be remembered can at least be someone who keeps their word. |
| What the word forbids is refused, and only the walker breaks it, on purpose (shipped) | A word given is not broken by a slip of the hand: the night itself holds the walker to it. Taking it back is a choice, and the companion sees it made. |
| The company alone respects the word (shipped): the autopilot and the catch-ups never hire the one left behind, never walk into a seam they cannot hold | They heard the walker promise. They would not make a liar of them while they are away. |
| Companion DPS continues when you do not click | They are real fighters, not summons. They do not need you to hold their hand. |
| Levels, cost ×1.07 | Trust, bought with coin and time: each level is a night's worth of friendship compressed into an evening. |
| Talents at 10/25/50/100/150 | Techniques they remember from their own past. Level 50 talents are their signature: who they really are. |
| Milestones ×3.5 every 25 levels from 200 | **Legend tiers**: a companion pushed this far starts to become a legend of the night itself. |
| Hero glyph and color | Their sigil, painted on their medallion. |
| Party medallions, shots to the monster | Companions visibly fighting. Each strike family (arrow, blade, claw, blunt, spell) is their fighting style. |
| Patience bonus (the altar, Kaelen 50, Morgrath 50): companions hit that much harder, always | The companions find their rhythm, and keep it. Kaelen's **Sentinel's Vigil** and Morgrath's **Silent Legion** are disciplines of the long watch: they hold whatever the walker does. In the Truth: when the dreamer's eyes half-close, the dream deepens. |
| The walker's strikes add to the Patience bonus (shipped; they stood in for it, blow for blow, until one sentence had to say it) | The Vigil and the Legion keep a rhythm. The walker's blade does not break it, and does not take its place: it strikes between the beats. |
| Autopilot after 60 s away | Left alone, the company spends its coin and goes back to the boss that stopped it. They have done this before. |
| Spending while away | The company levels itself up: they know what they need. |

### 6.3 Powers

| Power | Who | In the world |
|---|---|---|
| Frenzy | Aldric | The walker's own fury: the sword moves faster than thought. |
| Rallying Cry | Maëlle | Her hunting horn, carved from the Moss Alpha's tusk. Everyone who hears it fights twice as hard. |
| Hawkeye | Ysolde | The trees lend her their eyes, and she lends them to everyone. |
| Golden Rain | Brother Cinder | The Ember Monks' prayer to Pip, whom they call the Small Saint of Fortune. It works. Nobody knows why. |
| Resonance Ritual | Nyx | Nyx ties the walker's heartbeat to the rhythm of the Long Night. Each ritual binds tighter (+5% DPS, stacking) until dusk unties everything. |
| Time Echo | Garrick | He strikes an echo vein and a moment rings twice. |

### 6.4 Ascension and altars

| Mechanic | In the world |
|---|---|
| Ascension after stage 51 | The King's fall opens the seam; the walker steps into the Sanctum of Dusk and chooses to begin again. |
| Essence formula (grows with depth) | Deeper nights leave more memory. |
| +10% DPS per held essence | Memories kept are strength kept. |
| Spending essences on altars | Offering a memory to a stone. The stone keeps it forever; you do not. |
| Best split keeps half in hand | The oldest rule of the Bound: **"Never spend all of yourself."** |
| Ascension keeps essences, altars, relics, shards, achievements | What survives the dusk: memory, stone, steel, sky and deeds. |
| Ascension resets gold, companions, stage, powers, run stats | What the night takes back. |
| Ascension history (100 entries) | The **Chronicle**: one line per night (section 12.1). |
| Save version 4 altar refund | In-world event: **the Reckoning of the Stones**. The Sanctum was rebuilt; every walker got back what they had offered and chose again. Fragment-worthy. |

**The Sanctum wakes in three times** (shipped): a stone only answers a walker it has seen
come back. Might, the Blade, Fortune and Patience answer from the first night; Time,
Treasure and Bargain from the third; the six others from the fifth. A stone already raised
never goes back to sleep. The Harvest stops at five levels (shipped): a husk only holds so
many seeds.

**The thirteen altars and who raised them** (altar legends, one per altar, shown in the
altar card tooltip once the altar reaches level 5):

| Altar | EN / FR name kept | Raised by | Legend (EN) |
|---|---|---|---|
| Might | Altar of Might | A walker called the Anvil | "Built by a walker who forgot every face they loved and kept only the weight of their fists." |
| Blade | Altar of the Blade | Kaelen's teacher, the Sword-Mother | "Her last lesson: a blade is a question you ask the world, very fast." |
| Fortune | Altar of Fortune | Unknown; Pip was seen near it | "The stone is warm. There are tiny teeth marks on the base." |
| Patience | Altar of Patience | The Silent Legion | "Carved without a single tool. The dead are patient, and they had time." |
| Time | Altar of Time | Eldra | "She says she did not build it. She says it built itself, later." |
| Fate | Altar of Fate | Oriane's mother, a blind seer | "Five notches, no more. Fate allows itself to be pushed only so far." |
| Precision | Altar of Precision | Ysolde's grandfather | "An arrowhead set into the stone, pointing at nothing you can see." |
| Treasure | Altar of Treasure | Thorvald, to pay a debt | "Inscription: FOR PIP. WE ARE EVEN NOW. Someone has scratched out EVEN." |
| Bargain | Altar of Bargain | The Stallkeeper | "Companions charge less to walkers they almost remember." |
| Echoes | Altar of Echoes | Oriane | "Speak near it and it answers a moment early." |
| Harvest | Altar of Harvest | The first Ember Monk | "Every essence has a husk. This altar keeps the husks and gives you the seeds." |
| Wanderer | Altar of the Wanderer | The Nameless, before he was nameless | "Companions walk the first road without you. Their feet remember what their heads do not." |
| Memory | Altar of Memory | Unknown | "Buried at its foot, a purse of coin, every night. You do not remember burying it. You always do." |

The Wanderer's cap ("never more than half the record") becomes: *the feet remember the
road only as far as the heart has already been, and never the whole way.*

### 6.5 Relics, forge, shards, market

| Mechanic | In the world |
|---|---|
| Relics drop from bosses | Guardians hold the memories of objects. Unmade, they leave the object behind. |
| Relics survive ascension | Objects do not forget. |
| 4 slots (weapon DPS, armor boss damage, amulet click, ring gold) | Weapon: strength of the company. Armor: standing against guardians. Amulet: the walker's own hand. Ring: coin sticks to it. |
| 5 rarities | How clearly the object is remembered: common (a blur), rare, epic, legendary (a story), mythic (a myth, more real than the night itself). |
| Legendary and mythic essence affix | Objects remembered this well carry memory in them. |
| Density (shipped): a worn relic multiplies companion damage per stratum below the present night it came from | Older memories are denser (6.1), and so are the objects they held: a blade remembered in the Void weighs more than one from the Hearthfields. |
| Forge up to +20 (Brom) | Brom re-forges a relic with sky-shards; each fold of the metal adds a remembered detail. |
| Salvage for shards | Unmaking an object gives back the sky-glass that held it together. |
| Inventory 48, full salvages | The walker's pack. Brom's rule: "If you can't carry it, it was never yours." |
| Shards | Pieces of the Sky-Glass. |
| **Shard market** | **The Stallkeeper's stall** (section 10.4). Everything sold there is paid in sky. |
| Relic chest / great chest | Crates the Stallkeeper found "along the road, somewhere, some night". |
| Rage potion, fortune elixir | Mirelle's brews, sold on consignment. |
| Striking scroll | A page from Lysandre's grimoires; the sword reads it and strikes on its own. |
| Golden hourglass (1 h of gold now) | Bottled time from Eldra's loom: an hour lived elsewhere, poured into this one. |
| Timed buffs stack to 1 h | No bottle holds more than an hour of night. |

### 6.6 Crystals

**Wandering crystals** (FR: *cristaux errants*) are drops of attention: bright points where
the night was, for a moment, looked at very closely. Célestine hears them sing. They only
appear when the tab is visible (engine rule), which is the most important unspoken clue of
the game. Their five rewards: gold (the moment turns to coin), **overcharge** (the company
feels watched and fights ×7), **sharpness** (the walker's own sword, seen, cuts ×10),
shards (a crystal is a piece of sky that fell slowly), essences (a crystal that remembered
something; only after a first ascension, because only a walker who has been reborn can hold
one).

### 6.7 Presence, absence, saves

| Mechanic | In the world |
|---|---|
| Open tab, player away, full progress | The dreamer dozes; the dream holds. The company walks on. |
| Hidden tab or closed game catch-up, capped at 8 h | One night's sleep. The dream cannot run longer than a night without being looked at again. |
| Reunion (shipped): back from 30 min or more away, companion damage ×3 for a sixth of the absence (capped at an hour: a night gives the full hour), counted from the walker's return, never during it | The company held the road without the walker. When the walker comes back, they fight with a lighter heart. The UI says **Reunion** (FR: *Retrouvailles*). |
| The company's account (shipped): at the Reunion, what changed while away (road, gold, walls, guardians, who joined, techniques remembered, levels) | Around the fire, the company tells the walker the road it held: who joined, who remembered what, which guardian stood in the way and gave. They walked it; the walker did not. It is their story, plainly told, not a dream's. Shipped too: they end on one fragment of the Chronicle the walker had not read, kept for them by the fire. |
| Spending while away by breakpoints (shipped): the next companion first, then levels up to a talent or a milestone, saving for one within reach | Companions spend as soldiers do: a friend met on the road is welcomed first, then the coin goes to what makes them stronger at once, never a coin at a time. For a technique almost within reach, they wait a little. |
| Closed game (shipped): the time since the last save is caught up when it opens again, like a hidden tab (8 h at most, the Long Thread's hours included), never more than the server saw pass | The company does not wait for the walker. They keep the road for a night and tell it at the Reunion. Past a night, the world holds its breath and waits, perfectly still. |
| The dream leaves no inventory | Dreams leave only a feeling that you were somewhere: one line (**Dreams on return**, section 12.8). The inventory is the company's to tell, at the Reunion. |
| Guest play (shipped), kept for the browser that played it, forgotten after 30 days without a visit, never ranked | An **unnamed walker**. The Ledger holds a thread without a name for thirty nights after it was last walked; the Roll only takes names. |
| Account creation | **Inscribing your name on the Roll.** |
| E-mail confirmation within 3 days | **Sealing the name.** An unsealed name fades from the Ledger after three nights. |
| Save conflict (409), choosing a run | "Two threads carry your name. The Ledger asks which one is you." |
| Anti-cheat rejection (422) | "The Ledger cannot write what did not happen." |
| Inactivity purge after 3 years, warning 30 days before | Names not spoken for three years fade from the Roll. The warning e-mail: "A lantern still burns for you." |
| Leaderboard row hidden by moderation | Struck from the Roll. |

### 6.8 Achievements, statistics, the Roll

> **Shipped**: the five boards (Night included) on the public page and in the Hall.

- **Achievements** are **Deeds** (FR: *Hauts faits*) written in the Ledger. Their permanent
  DPS bonus is the weight of a deed: the night itself respects what you have done.
- **Statistics** are the Ledger's own pages. The Hall window is the Ledger's reading room.
- **The four boards of the Roll**, renamed in the fiction (UI keeps the plain labels as
  subtitles for clarity):

  | Board (code) | Name on the Roll | Meaning |
  |---|---|---|
  | `stage` | **Depth** (FR: *Profondeur*) | How far into the night the walker has gone. |
  | `ascensions` | **Nights** (FR: *Nuits*) | How many dusks they have walked through. |
  | `essences` | **Light** (FR: *Lumière*) | How much memory they have gathered. |
  | `achievements` | **Deeds** (FR: *Hauts faits*) | What the Ledger has recorded of them. |

  With the Descent (section 12.7), a fifth board: **Night** (FR: *Nuit*), the number of
  Descents, then Depth as a tiebreak.

---

## 7. Places: the five biomes

Each biome is a place of Orvane, seen at night. The road always crosses them in the same
order. In deeper strata the same places come back, remembered differently (section 9).

### 7.1 Verdant Plains: the Hearthfields

> **Shipped** (the whole biome): six Remnants, the Lost Shepherd, the Bestiary page and its
> gold bonus, the 12 echoes, the scene (wheat, stooks, Brom's forge, a barn and a chapel in the mist, the scarecrow that
> turns its head, the milestone stone, the low moon), Maëlle's and Brom's Recognition and
> hire lines, the Thousandth Arrow, Mosshide, the Unfinished Hammer, the Night Owl and
> Thousandth Notch secrets, the Crystal Storm and its Lantern Queen, the opening line.
> The rules now live in PRODUCT.md (The Chronicle) and DESIGN.md. Choices made while
> building it: the Moss Alpha stays a boar (it has tusks, and Maëlle's horn is carved from
> one); the Hearthfields' moon is a crescent that the Night Owl turns full.

- **Stages** 1 to 10 of every era. **Accent** `#8bd46a`.
- **What it was:** Orvane's farmland: wheat, hedgerows, stone walls, windmills. The last
  harvest was never brought in; the sheaves still stand.
- **At night:** fireflies, a low moon, scarecrows that turn their heads, a milestone stone
  at the roadside that lights up each time a stage is cleared.
- **Its memory:** the ordinary life Aldemar wanted to save.
- **Guardian:** the **Moss Alpha**, the oldest boar of the fields, so old that moss grows
  on it. Maëlle has hunted it since she was a girl. She has never won; she has killed it
  thousands of times.
- **Companion ties:** Maëlle (native), Brom (his forge stands at the crossroads).

### 7.2 Dark Forest: the Wychwood

- **Stages** 11 to 20. **Accent** `#4fd1a5`.
- **What it was:** a druidic forest, sacred to the Grove, where Séraphine was trained and
  Ysolde was born.
- **At night:** hanging roots, owls, brambles that whisper names. The forest remembers
  every walker who crossed it and grows thorns where they bled.
- **Guardian:** the **Heart of the Old Grove**, the mother-tree that taught Séraphine.
  Corrupted by being remembered too long, it still loves her.
- **Companion ties:** Ysolde, Séraphine, Nyx (she is first seen at its edge).

### 7.3 Forgotten Caves: the Deepvaults

- **Stages** 21 to 30. **Accent** `#8f9cff`.
- **What it was:** the mines of the Runeguild, where star-shards (sky-glass) were dug up.
- **At night:** frozen galleries, rune-lit rails, echo bats. Voices from other nights echo
  here before they happen. Oriane lives in the deepest vault.
- **Guardian:** the **Stone Devourer**, a worm that ate its way through the mountain to
  reach the fallen sky and now can only eat stone.
- **Companion ties:** Garrick, Thorvald, Oriane.

### 7.4 Corrupted Marsh: the Mire of Osric

- **Stages** 31 to 40. **Accent** `#b6d94c`.
- **What it was:** the fenland estate of Baron Osric, drained for peat and rice, flooded
  on the night of the Binding.
- **At night:** will-o'-wisps, drowned roads, a manor sinking by an inch per night.
- **Guardian:** the **Baron of Rot**, Osric himself, Mirelle's husband. She married him for
  the estate. She has been trying to cure him for longer than the marriage lasted.
- **Companion ties:** Mirelle, Vorn (he found Biscuit here).

### 7.5 Fallen King's Ruins: Orvane Keep

- **Stages** 41 to 50. **Accent** `#c58cff`.
- **What it was:** the royal keep. Its great hall is where the Binding was woven.
- **At night:** banners with no colors left, spectral hounds, stone wardens, a throne room
  lit by violet fire. The throne faces the window, not the door.
- **Guardian:** the **Fallen King**, every 50 stages, in one of twelve forms (section 8.7).
- **Companion ties:** Kaelen (he served here), the Nameless, Morgrath (he waits outside and
  never enters).

---

## 8. Bestiary

Each biome keeps its **3 existing monsters, elite and guardian**, and gains **3 new
monsters** and **1 rare wanderer** (a biome-specific rare spawn like Pip: 0.5% on normal
stages of that biome, ×5 gold, guaranteed fragment on first kill, one per run at most).
Bestiary lines (section 12.3) unlock at 1, 100 and 1,000 kills of each creature: the
table gives the first-tier line; tiers 2 and 3 go deeper.

Legend: **E** existing (id in code), **N** new. Names are EN / FR.

> **Shipped** (the art of every existing creature): each is drawn by hand, pixel by pixel,
> with its own anatomy (DESIGN.md, Imagery). The creatures that were palette swaps of
> another became creatures of their own in the same place of the road: the Carrion Crow
> (was the Rabid Rat), the Last Reaper (Greattusk), the Grove Spinner (the Blighted Boar),
> the Root Knight (the Briar Matron), the Crystal Mite (the Deep Wolf), the Miner's Shade
> (the Howling Swarm), the Rot Toad (the Putrid Crawler), the Will-o'-Wisp (the Marsh Hag),
> the Gargoyle of the Hours (the Spectral Hound) and the Banner Wraith (the Crown Bat).
> Their kills carry over (save version 7). The Moss Alpha is missing its left tusk; the
> Baron of Rot wears his ring.

### 8.1 Hearthfields

> **Shipped**, with three lines per creature. Rare creatures (the Lost Shepherd, and the
> Lantern Queen, counted per storm) unlock their lines at 1, 5 and 25 instead of 1, 100 and
> 1,000, since a wanderer is met once a run at most.

| | Id | Name | Rank | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `field-rat` | Field Rat / Rat des champs | Normal | "Every rat that ever stole grain from Orvane, remembered as one very determined rat." |
| E | `wild-boar` | Jumpy Boar / Sanglier nerveux | Normal | "Nervous because it has been killed before. It remembers, a little." |
| E | `carrion-crow` | Carrion Crow / Corbeau charognard | Normal | "It gleans what the harvest left. The harvest left everything." |
| N | `hollow-scarecrow` | Hollow Scarecrow / Épouvantail creux | Normal | "Stuffed with the last harvest. It guards fields no one will reap." |
| N | `lantern-moth` | Lantern Moth / Phalène-lanterne | Normal | "Drawn to the walker's light. Everything in the night is." |
| N | `dusk-hare` | Dusk Hare / Lièvre du crépuscule | Normal | "It is always running toward dusk. It never arrives." |
| E | `last-reaper` | Last Reaper / Dernier Faucheur | Elite | "It came to bring in the last harvest. It is waiting for first light to begin." |
| E | `moss-alpha` | Moss Alpha / Alpha moussu | Guardian | "Maëlle's oldest enemy. It lets her win. It always has." |
| N | `lost-shepherd` | The Lost Shepherd / Le Berger égaré | Rare | "Counts his sheep every night. The number goes up." |

### 8.2 Wychwood

| | Id | Name | Rank | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `shade-wolf` | Shade Wolf / Loup de l'ombre | Normal | "A wolf made of the dark between two trees." |
| E | `briar-witch` | Briar Witch / Sorcière des ronces | Normal | "A druid who stayed in the forest too long and became part of its hedge." |
| E | `grove-spinner` | Grove Spinner / Fileuse du bosquet | Normal | "It spins the thorns where walkers bled. It has never run out of thread." |
| N | `mourning-owl` | Mourning Owl / Chouette endeuillée | Normal | "It asks one question, over and over. The answer is always a name." |
| N | `toadstool-choir` | Toadstool Choir / Chœur des champignons | Normal | "Seven mushrooms, one song, entirely out of tune." |
| E | `root-knight` | Root Knight / Chevalier-racine | Elite | "A soldier buried under an oak. The oak got up." |
| E | `old-grove` | Heart of the Old Grove / Cœur du vieux bosquet | Guardian | "The mother-tree. When she falls, the whole forest exhales." |
| N | `weeping-stag` | The Weeping Stag / Le Cerf qui pleure | Rare | "Its tears are sap. Its antlers hold a nest of stars." |

### 8.3 Deepvaults

| | Id | Name | Rank | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `blind-crawler` | Blind Crawler / Rampeur aveugle | Normal | "It has no eyes because nothing down here was ever meant to be seen." |
| E | `echo-bat` | Echo Bat / Chauve-souris d'écho | Normal | "It screeches a moment before you swing." |
| E | `crystal-mite` | Crystal Mite / Acarien de cristal | Normal | "Eats sky-glass. Excretes smaller sky-glass." |
| N | `drip-leech` | Drip Leech / Sangsue des gouttes | Normal | "Hangs from the ceiling and drinks whatever falls. Mostly time." |
| E | `miner-shade` | Miner's Shade / Ombre de mineur | Elite | "Still swinging a pick. Still on shift." |
| E | `stone-devourer` | Stone Devourer / Dévorateur de pierre | Guardian | "It dug for the fallen sky and found it. It could not digest it." |
| N | `singing-geode` | The Singing Geode / La Géode chantante | Rare | "A stone that hums Célestine's name before she is hired." |

### 8.4 Mire of Osric

| | Id | Name | Rank | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `bog-remnant` | Bog Remnant / Vestige fangeux | Normal | "The marsh remembering a person. It got most of the parts." |
| E | `rot-toad` | Rot Toad / Crapaud putride | Normal | "It croaks in the Baron's voice. Mirelle hates it most." |
| E | `will-o-wisp` | Will-o'-Wisp / Feu follet | Normal | "A lantern with no one holding it, looking for someone to follow it." |
| N | `drowned-courtier` | Drowned Courtier / Courtisan noyé | Normal | "Still bowing to the Baron. Still wet." |
| E | `bog-colossus` | Mire Colossus / Colosse de la fange | Elite | "The whole east field, standing up." |
| E | `rot-baron` | Baron of Rot / Baron de la pourriture | Guardian | "Osric. Wears a wedding ring that is not rotting." |
| N | `ferryman` | The Ferryman / Le Passeur | Rare | "Asks for a coin to cross. There is nothing to cross. Pay him anyway." |

### 8.5 Orvane Keep

| | Id | Name | Rank | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `hour-gargoyle` | Gargoyle of the Hours / Gargouille des heures | Normal | "It counts the nights on its own claws. It ran out of claws." |
| E | `banner-wraith` | Banner Wraith / Spectre-bannière | Normal | "A royal banner that forgot its colors and is looking for them." |
| E | `fallen-sentinel` | Fallen Sentinel / Sentinelle déchue | Normal | "Kaelen's brothers-in-arms. They salute him before they attack." |
| N | `hollow-page` | Hollow Page / Page creux | Normal | "A page boy's livery with no page boy. Still carrying a message." |
| E | `stone-warden` | Stone Warden / Gardien de pierre | Elite | "Guards the great hall's door. Nobody has used the door in a very long time." |
| E | `ruined-king` | Fallen King / Roi déchu | Guardian | See 8.7. |
| N | `court-jester` | The Court Jester / Le Bouffon de la cour | Rare | "Laughs every time you arrive, as if he knew you would. He did." |

### 8.6 Specials

| | Id | Name | Where | Bestiary line (tier 1) |
|---|---|---|---|---|
| E | `golden-rat` | Golden Rat, Pip / Rat doré, Messire Pip | Any stage | "The same in every stratum. The only one." |
| N | `seam-warden` | Seam Warden / Gardien de la brèche | Event: the Seam | "Holds a crack in the night shut with both hands. Beat it and the crack closes." |
| N | `walker-echo` | Echo of a Walker / Écho d'un marcheur | Event | "Another walker's shadow, from another night. Shown with a name from the Roll." |
| N | `the-quiet` | The Quiet / Le Silence | Event, strata ≥ Void | "Colorless. Soundless. It is not a Remnant. It is where one used to be." |
| N | `stray-armor` | Stray Armor / L'Armure errante | Event | "An empty suit of plate walking the road in the wrong direction." |
| N | `lantern-queen` | Lantern Queen / Reine-lanterne | Event: Crystal Storm | "Queen of the moths. She follows the light to wherever someone is looking." |
| N | `the-dawn` | The Dawn / L'Aube | Stage 3000 only | "A line of pale light. It does not attack. It only grows." |

### 8.7 The twelve forms of the King

The guardian of every stage multiple of 50 is the Fallen King (existing `ruined-king`). The
**Age** of the stratum (section 9) chooses his form. Same stats as today; only his look,
name and his Words change. Form I is the existing art.

| Age | Stages | Form (EN / FR) | Look |
|---|---|---|---|
| I | 50 to 250 | The Fallen King / Le Roi déchu | Cracked crown, violet fire, torn mantle. |
| II | 300 to 500 | The Titan King / Le Roi-Titan | Huge, stone-skinned, crown grown into his skull. |
| III | 550 to 750 | The Hallowed King / Le Roi consacré | Haloed, veiled, hands folded as if in prayer. |
| IV | 800 to 1000 | The Star-Crowned / Le Couronné d'étoiles | His crown is a ring of small, cold stars. |
| V | 1050 to 1250 | The Woven King / Le Roi tissé | Made of thread; loose ends trail to the ceiling. |
| VI | 1300 to 1500 | The Sketched King / Le Roi esquissé | Drawn in charcoal lines, unshaded, half-erased. |
| VII | 1550 to 1750 | The King's Name / Le Nom du roi | Letters of a name, arranged in the shape of a man. |
| VIII | 1800 to 2000 | The Sleeping King / Le Roi endormi | Asleep on the throne. He still fights, eyes closed. |
| IX | 2050 to 2250 | The King at the Window / Le Roi à la fenêtre | Turned away from you, looking out of a bright window. |
| X | 2300 to 2500 | The Hollow Crown / La Couronne creuse | Only the crown, floating, holding the shape of a head. |
| XI | 2550 to 2750 | The Blank King / Le Roi blanc | Almost the color of the background. Hard to see. |
| XII | 2800 to 2950 | Aldemar / Aldemar | A tired man in plain clothes, no crown, sword lowered. |
| | 3000 | The Dawn / L'Aube | Replaces the King (section 8.6). |

---

## 9. The strata: 60 eras in 12 Ages

Today the code cycles five tags (Echo, Ash, Void, Astral, Primordial) after era 0. The
finished game names **every era up to the cap** (era 0 to 59, stages 1 to 3000), so the
descent never repeats itself. Era 0 has no tag (the present night). Tags keep the current
display `Tag · Monster`. Each Age also sets a visual treatment (section 18.6) and a pool of
Age echoes (section 17).

Each row carries the **keystone** of that stratum: the fragment unlocked on the first
clear of its last stage (the King or, at 3000, the Dawn). It is the backbone of the
revelation calendar.

### Age I: The Kingdom (eras 0 to 4, stages 1 to 250)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 0 | 1-50 | (none) | "He looked at you as if you were late." |
| 1 | 51-100 | Echo / Écho | "The bats screamed before you swung. They had heard it before." |
| 2 | 101-150 | Ash / Cendre | "Under the ash, the fields are the same fields. Someone burned them to call the sun." |
| 3 | 151-200 | Void / Néant | "A third of the map is missing. Not burned, not flooded. Missing." |
| 4 | 201-250 | Astral / Astral | "Garrick held a star-shard up to the sky. It fit." |

### Age II: The Elder World (eras 5 to 9, stages 251 to 500)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 5 | 251-300 | Primordial / Primordial | "Lysandre's map ends here, with one word: BOTTOM." |
| 6 | 301-350 | Titan / Titan | "The ground kept going. Lysandre has not spoken since." |
| 7 | 351-400 | Wyrm / Guivre | "Aurelion bowed to a bone the size of a valley." |
| 8 | 401-450 | Tide / Marée | "There was a sea here, before there was a here." |
| 9 | 451-500 | Rime / Givre | "Frozen in the ice: a crown, smaller than his." |

### Age III: The Hallowed (eras 10 to 14, stages 501 to 750)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 10 | 501-550 | Hallowed / Sacré | "Temples to a god with no name, facing the sky." |
| 11 | 551-600 | Oracle / Oracle | "Oriane went quiet. The oracles of this stratum were saying her words first." |
| 12 | 601-650 | Seraph / Séraphin | "Six wings, all folded over its eyes, as if something was too bright to look at." |
| 13 | 651-700 | Hymn / Hymne | "Célestine knew the hymn. She says she never learned it." |
| 14 | 701-750 | Eclipse / Éclipse | "The priests of the Eclipse prayed for a night that would never end. Someone answered." |

### Age IV: The Making of the Stars (eras 15 to 19, stages 751 to 1000)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 15 | 751-800 | Nebula / Nébuleuse | "The sky here is not glass yet. It is still being poured." |
| 16 | 801-850 | Comet / Comète | "A star fell and did not break. It rolled to your feet and waited." |
| 17 | 851-900 | Zenith / Zénith | "Everything is at its highest point here, and knows it cannot stay." |
| 18 | 901-950 | Nadir / Nadir | "The lowest point of the sky. Someone is standing on it, weaving." |
| 19 | 951-1000 | Aurora / Aurore | "Not the Dawn. Its rehearsal." |

### Age V: The Loom (eras 20 to 24, stages 1001 to 1250)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 20 | 1001-1050 | Warp / Chaîne | "Threads run from the ground to the sky, taut, humming." |
| 21 | 1051-1100 | Weft / Trame | "Eldra's handwriting is on the threads. Very small. Very tired." |
| 22 | 1101-1150 | Shuttle / Navette | "Something passes between the threads, back and forth, every night. It looks like you." |
| 23 | 1151-1200 | Knot / Nœud | "A knot the size of a keep. The King's name is tied into it." |
| 24 | 1201-1250 | Frayed / Effiloché | "Here the weave is thin enough to see light through." |

### Age VI: The Draft (eras 25 to 29, stages 1251 to 1500)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 25 | 1251-1300 | Sketch / Esquisse | "The trees are outlines. Someone meant to color them in later." |
| 26 | 1301-1350 | Charcoal / Fusain | "Your hands leave smudges on everything you touch." |
| 27 | 1351-1400 | Outline / Contour | "A second Orvane, drawn beside the first, never finished." |
| 28 | 1401-1450 | Erased / Gommé | "Something was drawn here and taken back. The shape remains." |
| 29 | 1451-1500 | Palimpsest / Palimpseste | "Under this world, the lines of another one." |

### Age VII: The Words (eras 30 to 34, stages 1501 to 1750)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 30 | 1501-1550 | Rune / Rune | "Every stone is a letter. The road is a sentence." |
| 31 | 1551-1600 | Glyph / Glyphe | "The glyph for 'king' and the glyph for 'tired' are the same." |
| 32 | 1601-1650 | Verse / Vers | "The Remnants here speak in rhyme. They are trying to be remembered." |
| 33 | 1651-1700 | Name / Nom | "The Nameless stopped. He heard a word here. He will not say it." |
| 34 | 1701-1750 | Whisper / Murmure | "Something is telling this world to itself, very quietly, so it will not stop." |

### Age VIII: The Edge of Sleep (eras 35 to 39, stages 1751 to 2000)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 35 | 1751-1800 | Lull / Accalmie | "The Remnants move slower. So do you. It is not tiredness." |
| 36 | 1801-1850 | Reverie / Rêverie | "The road loops back on itself, and nobody minds." |
| 37 | 1851-1900 | Slumber / Sommeil | "Eldra, very softly: do not wake anyone." |
| 38 | 1901-1950 | Drowse / Somnolence | "Half the stars are closed." |
| 39 | 1951-2000 | Threshold / Seuil | "The first time anyone in Orvane has used the word 'dream'. It was Morgrath, and he spat." |

### Age IX: The Dreamer's Room (eras 40 to 44, stages 2001 to 2250)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 40 | 2001-2050 | Lantern / Lanterne | "A lamp, far above the sky, left on." |
| 41 | 2051-2100 | Hearth / Âtre | "Warmth from somewhere without a direction." |
| 42 | 2101-2150 | Lullaby / Berceuse | "Célestine stops singing to listen. The tune is hers, slower." |
| 43 | 2151-2200 | Window / Fenêtre | "The King stands at a window you have never seen from outside." |
| 44 | 2201-2250 | Glass / Vitre | "On the other side of the sky, something is reflected. It blinks when you do." |

### Age X: The Unmaking (eras 45 to 49, stages 2251 to 2500)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 45 | 2251-2300 | Hollow / Creux | "Things here are shaped like other things that left." |
| 46 | 2301-2350 | Muffled / Sourdine | "The sounds of the fight arrive late, and quieter." |
| 47 | 2351-2400 | Hush / Chut | "Someone has put a finger to their lips. The whole stratum obeys." |
| 48 | 2401-2450 | Oblivion / Oubli | "You forget a companion's name for a second. It comes back. Not all of it." |
| 49 | 2451-2500 | Absence / Absence | "Where the King should be, a chair, still warm." |

### Age XI: The Blank (eras 50 to 54, stages 2501 to 2750)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 50 | 2501-2550 | Pale / Pâle | "The night is thinning. You can see the color of the sky behind it." |
| 51 | 2551-2600 | Faint / Ténu | "The Remnants are almost not there. They fight anyway." |
| 52 | 2601-2650 | Margin / Marge | "You have walked off the edge of the drawing." |
| 53 | 2651-2700 | Blank / Vierge | "Nothing has been written here yet. Your footprints are the first thing." |
| 54 | 2701-2750 | Ink / Encre | "A single drop, about to fall." |

### Age XII: The First Mark (eras 55 to 59, stages 2751 to 3000)

| Era | Stages | Tag EN / FR | Keystone (EN) |
|---|---|---|---|
| 55 | 2751-2800 | Point / Point | "Everything began as one point of light, and someone looking at it." |
| 56 | 2801-2850 | Spark / Étincelle | "The point is warm." |
| 57 | 2851-2900 | Breath / Souffle | "Something breathes in, and holds it." |
| 58 | 2901-2950 | Gaze / Regard | "Aldemar, without his crown: you came all this way. Thank you. Go back." |
| 59 | 2951-3000 | Dawn / Aube | "Not yet." |

---

## 10. Characters

### 10.1 The Fallen King (Aldemar)

- **Surface:** the boss of stage 50, the reason to ascend.
- **Personality:** kind, stubborn, exhausted, dryly funny. Speaks rarely and briefly. Never
  gloats, never begs.
- **History:** reigned forty years; saw the Pale Year coming; asked Eldra for the Binding;
  walked the first nights himself when Kaelen fled; walked more nights than any walker
  since; one night sat down on his throne "for a moment".
- **What he wants:** for the night to hold. For someone else to carry it. For you not to
  end up like him, and also, secretly, for you to never stop.
- **Voice:** "You're early." / "Again, then." / "Mind the third step. It was loose in my
  father's time." / "Don't stop. I did."
- **His Words** (section 12.4) are the thread of the story that every player sees, one line
  per ascension.

### 10.2 Aldric (the player)

- **Surface:** "That's you." The click hero; his levels raise click damage.
- **Truth:** a walker, a title, the dreamer's hand inside the dream. Aldric has no lines of
  his own and never speaks. Others speak to him.
- **Lessons:** each of Aldric's seven talents, bought for the first time ever, unlocks a
  **Lesson** (FR: *Leçon*), a short line in the Chronicle from someone who taught a walker
  before: "Firm Grip: *Hold the sword like a bird: tight enough that it cannot fly, loose
  enough that it can breathe.* (the Sword-Mother)".

### 10.3 The twenty companions

Each dossier: **personality**, **story**, **secret** (a Truth-level fact, revealed only by
Recognition 5 or never), **Recognition arc** (the five memories unlocked across
ascensions, section 12.2), **voice** (one sample line, EN). Existing titles, lore lines and
talent names are kept; the dossier reads them as history.

#### Maëlle, Plains Huntress (Chasseuse des plaines)
- **Personality:** cheerful, blunt, restless, the heart of the company.
- **Story:** grew up in the Hearthfields; has hunted the Moss Alpha since childhood. Always
  the first companion, in every night, for every walker.
- **Secret:** she carves a notch on a fence post every night. The post is covered. There
  are notches in her own handwriting she does not remember making.
- **Recognition arc:** 1 "Have we met?" · 2 she already knows your name · 3 the notches ·
  4 she saves you a seat by the fire before you arrive · 5 "Don't tell me. I'd rather
  meet you again. I like that part."
- **Voice:** "You look like someone who needs a bow and a friend. I'm both."

#### Brom, Wandering Smith (Forgeron itinérant)
- **Personality:** gruff, patient, soft-hearted, proud of his work.
- **Story:** his forge stands at the crossroads of the Hearthfields. He forges relics and
  re-forges them with sky-shards (the Forge).
- **Secret:** every night he forges the same hammer and never finishes it. It is for the
  King, who asked for it the night before the Binding.
- **Recognition arc:** 1 he recognizes his own work on your relics · 2 "who taught you to
  hold a hammer like that?" · 3 the unfinished hammer · 4 he adds your mark to his anvil ·
  5 he finishes the hammer and gives it to you (named relic, section 11).
- **Voice:** "Bring it back in one piece. Or in several. I'm not fussy."

#### Ysolde, Sylvan Archer (Archère sylvestre)
- **Personality:** quiet, precise, dryly funny, fiercely loyal to the forest.
- **Story:** born in the Wychwood; the trees lend her their eyes (Hawkeye). Séraphine
  raised her after her parents were lost to the Void.
- **Secret:** the trees also show her previous nights. She has seen you die, many times,
  in nights you do not remember either.
- **Recognition arc:** 1 she aims at something behind you, then lowers her bow · 2 the
  trees know your name · 3 "you always step on that root" · 4 she shows you where you
  fell, long ago · 5 "The forest says you never give up. I told it I already knew."
- **Voice:** "Stand still. There. Now you're not dead."

#### Brother Cinder, Ember Monk (Frère Cendre)
- **Personality:** serene, gentle, stubborn as stone, fond of bad jokes.
- **Story:** an Ember Monk sworn never to carry a weapon. His order keeps a single flame
  alive, "the last memory of the sun". Prays to Pip (Golden Rain).
- **Secret:** Ashka is his younger sister. She left the order to join the Pyre, which wants
  to burn the night down and let the sun in.
- **Recognition arc:** 1 he offers you tea · 2 he remembers how you take it · 3 he speaks
  of a sister · 4 he asks you to keep them apart if they are both hired · 5 "Tell her the
  flame is still lit. She'll know what it means."
- **Voice:** "Violence is never the answer. It is, however, frequently the question."

#### Nyx, Shadow Blade (Lame d'ombre)
- **Personality:** silent, precise, unsettling, unexpectedly tender.
- **Story:** appears at the edge of the Wychwood. No one has seen her face. Her Resonance
  Ritual ties the walker to the rhythm of the night.
- **Secret:** Nyx has no face because she is the Long Night's own shadow, woven with it.
  Under the hood there is only sky, and a few stars.
- **Recognition arc:** 1 she watches you sleep in the Sanctum · 2 she says your name
  like a question · 3 she flinches when the Dawn is mentioned · 4 she lowers her hood,
  offscreen (the medallion shows a starfield for one second) · 5 "I am not with you. I
  am around you."
- **Voice:** "..."

#### Garrick, Rune Miner (Mineur runique)
- **Personality:** cheerful, greedy, superstitious, the company's gossip.
- **Story:** mines the Deepvaults for "fallen stars". Taps echo veins (Time Echo).
- **Secret:** he found a shard in which a face, not from Orvane, was reflected. It blinked.
  He buried it again.
- **Recognition arc:** 1 "you've got the look of a shard-finder" · 2 he tells you where he
  hides his best finds · 3 the sky fits the shards · 4 the reflected face · 5 he gives you
  the shard he buried (named relic).
- **Voice:** "Rich! We'll be rich! Well, I will. You'll be employed."

#### Séraphine, Bramble Druid (Druidesse des ronces)
- **Personality:** severe, maternal, wise, grieving.
- **Story:** trained under the Heart of the Old Grove; raised Ysolde.
- **Secret:** she knows the Heart of the Old Grove is the tree that taught her, and she
  helps you kill it every night because it asked her to.
- **Recognition arc:** 1 she speaks to a root and it points at you · 2 the Grove's heart
  "is expecting you" · 3 she stays behind when you fight it · 4 she tells you what it
  said · 5 "She says thank you. Every time."
- **Voice:** "The roots obey me because I asked nicely. Once."

#### Thorvald, Stonebreaker (Briseur de pierre)
- **Personality:** loud, generous, boastful, a terrible gambler.
- **Story:** felled a mountain on a bet, lost the bet.
- **Secret:** the bet was with Pip. The mountain is still owed. The Altar of Treasure is
  his down payment.
- **Recognition arc:** 1 he challenges you to arm-wrestle · 2 he remembers losing · 3 he
  flinches at golden rats · 4 the bet · 5 "If you see the rat, tell him we're even." (He
  is not.)
- **Voice:** "Double or nothing!"

#### Mirelle, Marsh Alchemist (Alchimiste des marais)
- **Personality:** sardonic, brilliant, reckless, secretly devoted.
- **Story:** brews potions (the Stallkeeper sells them). Married Baron Osric.
- **Secret:** the Baron of Rot is her husband. Every night she tries a new cure on him
  before you kill him. None has worked. She keeps notes.
- **Recognition arc:** 1 she tests a potion on you · 2 she keeps a notebook with your name
  in it · 3 the notebook is about her husband · 4 she asks you to wait before the killing
  blow · 5 she gives you her wedding ring (named relic): "He'd want someone useful to
  wear it."
- **Voice:** "Drink this. No, don't smell it first."

#### Kaelen, Fallen Knight (Chevalier déchu)
- **Personality:** grave, dutiful, guilt-ridden, protective.
- **Story:** once the King's guard; seeks redemption at the tip of his blade. His Sentinel's
  Vigil (idle bonus) is a guard's discipline: stand still, strike true.
- **Secret:** he was meant to be the first walker and ran on the night of the Binding. The
  King walked in his place.
- **Recognition arc:** 1 he salutes the Fallen Sentinels before fighting them · 2 he will
  not look at the throne · 3 "I knew him. He was kind." · 4 the night he ran · 5 he asks
  you to let him strike the King's last blow, once. (A secret, section 15.)
- **Voice:** "Stand behind me. No, further."

#### Oriane, Echo Oracle (Oracle d'écho)
- **Personality:** calm, cryptic, precise, a little lonely.
- **Story:** lives in the deepest vault; hears what the caves said a thousand years ago,
  and what they will say tomorrow.
- **Secret:** she hears previous nights. She is the first to tell the walker, after the
  first ascension: "You've done this before."
- **Recognition arc:** 1 she finishes your sentences · 2 she finishes them wrong, on
  purpose · 3 she counts nights out loud · 4 she lost count · 5 "I stopped listening to
  the old nights. I listen to this one now."
- **Voice:** "You're about to ask me something. The answer is yes."

#### Vorn, Beastmaster (Dompteur de bêtes)
- **Personality:** warm, gruff, talks to animals more than people.
- **Story:** his pack: three wolves, a boar and something unspeakable, which he calls
  **Biscuit**.
- **Secret:** Biscuit is a piece of the Quiet: the only Remnant of the Morning that ever
  became tame.
- **Recognition arc:** 1 Biscuit growls at you · 2 Biscuit ignores you · 3 Biscuit sits
  at your feet · 4 Vorn tells you where Biscuit was found (the Void) · 5 Biscuit's true
  name is not a word (the fragment is blank, save for the attribution).
- **Voice:** "He doesn't bite. He unmakes. Different thing."

#### Lysandre, Archmage (Archimage)
- **Personality:** brilliant, arrogant, funny, deeply curious.
- **Story:** read every grimoire twice, backwards. Named the strata (Echo, Ash, Void,
  Astral, Primordial). His notes are the most common fragment voice of Age I and II.
- **Secret:** he is reading the spell of the Binding backwards, trying to undo it. He is
  also wrong about the bottom of the world, and learns so at stage 301.
- **Recognition arc:** 1 he corrects your grammar · 2 he shows you his map · 3 the map
  ends at BOTTOM · 4 he tears the map · 5 "I was wrong. It is the best thing that has
  happened to me in a thousand nights."
- **Voice:** "Fascinating. Stand still while I set it on fire."

#### Ashka, Ember Priestess (Prêtresse de braise)
- **Personality:** fierce, devout, charismatic, dangerous.
- **Story:** priestess of the Pyre, the cult that burned the old forests in the Ash Age to
  call the sun back.
- **Secret:** she wants the Morning. She believes the Dawn is a sun, not an ending. She
  fights beside the walker because the King stands between her and the Dawn.
- **Recognition arc:** 1 she asks what you are fighting for · 2 she mocks the answer · 3
  she speaks of the sun · 4 she speaks of her brother · 5 "If you ever reach the Dawn,
  open the window for me."
- **Voice:** "Everything burns eventually. I'm just punctual."

#### The Nameless, Errant Knight (Le Sans-Nom)
- **Personality:** silent, gentle, slow, eerily kind.
- **Story:** his armor is empty, or so they say. His Iron Will (boss timer +5 s) comes from
  having stood before more guardians than anyone.
- **Secret:** he was a walker who spent every memory on the altars (he raised the Altar of
  the Wanderer). What is left walks. He remembers one word: **Aldric**.
- **Recognition arc:** 1 he bows · 2 he walks beside you, not behind · 3 he asks how many
  essences you hold · 4 he tells you never to spend them all · 5 inside the helmet, a
  single word scratched into the steel: your name.
- **Voice:** (He does not speak until Recognition 3.) "Keep some."

#### Eldra, Timeweaver (Tisseuse du temps)
- **Personality:** tired, precise, kind, burdened.
- **Story:** "She has seen how this adventure ends. She refuses to talk about it."
- **Secret:** she wove the Long Night. She knows what the Dawn is. She is the only one who
  could unweave it, and she will not.
- **Recognition arc:** 1 she knows your thread · 2 she mends a tear in your cloak with a
  thread of light · 3 she speaks of the King as "him" · 4 "I made this. I am sorry. I
  am not sorry." · 5 she shows you her loom (unlocks the Descent's lore, section 12.7).
- **Voice:** "Hush. You'll wake it."

#### Morgrath, Lich Lord (Seigneur liche)
- **Personality:** sardonic, theatrical, honest to a fault, bitter.
- **Story:** "An unlikely ally, he hates the Fallen King more than life itself." His Silent
  Legion (idle bonus) is an army of the dead that fights best when unwatched.
- **Secret:** he is the steward of death, and the Long Night has cheated death of every
  dawn. He fights the King because the King stole the Morning. He is the only companion
  who wants the night to end, and says so.
- **Recognition arc:** 1 he insults you · 2 he insults you by name · 3 he explains why he
  hates the King · 4 he admits the night is beautiful · 5 "When it ends, and it will, I
  will be there to see you out. Politely."
- **Voice:** "Life is overrated. I should know. I've tried both."

#### Célestine, Voice of the Crystals (Voix des cristaux)
- **Personality:** dreamy, joyful, eerie, childlike.
- **Story:** essences sing for her, and she sings back.
- **Secret:** she hears the crystals, and the crystals are attention: she can hear when
  someone is watching the world. She is the first to say it: "They only come when someone
  is looking."
- **Recognition arc:** 1 she hums your name · 2 she hums it before she learns it · 3 the
  crystals' song changes when you are here · 4 "someone is watching us, and it is nice"
  · 5 she sings a lullaby that belongs to Age IX.
- **Voice:** "Shh. Listen. The light is humming."

#### Aurelion, Dragon King (Roi-dragon)
- **Personality:** proud, ancient, courteous, amused by everything.
- **Story:** the last dragon, who chose your side.
- **Secret:** dragons are from the Wyrm stratum, before Orvane. Aurelion remembers a Dawn
  that already came once, for another world. In play he says it without the forbidden word
  (his R3): "Yours is not the first world someone has left a lamp burning for." The
  "dreamed" of section 4 is for writers only.
- **Recognition arc:** 1 he calls you "small one" · 2 he calls you by name · 3 he speaks
  of other worlds · 4 of the Dawn he saw · 5 "I chose your side because you keep coming
  back. The last world did not have anyone who did."
- **Voice:** "Kneel. No, not to me. To the view."

#### The Awakened, Hero of the Prophecy (L'Éveillé)
- **Personality:** unknowable, luminous, familiar.
- **Story:** "You, perhaps. In another life." Last companion, the strongest.
- **Secret:** the Awakened is the dreamer's reflection inside the dream: what Aldric would
  be if he knew. Never stated.
- **Recognition arc:** 1 the Awakened copies your stance · 2 your gestures · 3 the
  Awakened says your lines before you would · 4 the Awakened stops copying · 5 the
  fragment reads only: "Hello." (FR: *« Bonjour. »*)
- **Voice:** (Speaks only at Recognition 5.)

### 10.4 Other figures

- **The Stallkeeper** (FR: *Comptoir*, used as a name): a figure
  wrapped in a patched cloak, face hidden, behind a stall that appears in every night.
  Uses they/them. Buys sky-shards to mend the Sky-Glass; sells chests, brews and bottled
  time. Dry, polite, never surprised. "Everything is for sale. Nothing is for keeps."
  Speaks through the market window (12 **Stallkeeper sayings**, rotated on each visit).
- **Pip** (golden rat): never speaks. Appears in fragments as a presence: teeth marks, a
  gold hair, a debt. Pip is the joke of the game and its oldest mystery, both at once.
- **The Sword-Mother:** Kaelen's teacher, raiser of the Altar of the Blade, voice of
  Aldric's Lessons. Long dead, not a Remnant: her memory is too clean to sour.
- **Baron Osric:** the Baron of Rot. Speaks only in the Mirelle secret (section 15).
- **The Ledger:** not a person. Its voice (dry, exact, faintly kind) is the voice of the
  Roll, the account window and the error messages of the save system.

---

## 11. Relics

Random relics stay as they are (noun + rarity adjective + biome suffix, e.g. *Fine Blade of
the Grove*). On top of them, **24 named relics** with a legend, a fixed source and one
**unique effect**, plus the **Crown**, which cannot be worn.

**Rules for named relics:**

- A named relic is always legendary or mythic (its rarity is fixed), rolled at the level
  of the stage where it dropped, with the normal affixes of its slot, plus its unique
  effect as an extra line.
- Each can be found **once per save** (a second copy salvages into shards on arrival).
- Unique effects are bounded by the same caps as today (crit chance, crit damage, essence)
  or by their own cap below, so validation can check them from the relic id.
- Sources are deterministic: a fixed boss, stratum or Recognition gift, plus a chance
  (except gifts). The anti-cheat checks that the source was reachable.

### 11.1 Weapons (main stat DPS)

| Id | Name EN / FR | Rarity | Source | Unique effect | Legend |
|---|---|---|---|---|---|
| `oathcutter` | Oathcutter / Tranche-Serment | Legendary | Fallen King, any form, 2% per first clear | +100% damage to the King (stages multiple of 50) | "Kaelen broke it on the throne steps the night he ran. It has been trying to get back up the stairs ever since." |
| `thousandth-arrow` (**shipped**) | The Thousandth Arrow / La Millième Flèche | Legendary | Moss Alpha, on its 1,000th lifetime kill | +3% crit chance (counts toward the cap) | "Maëlle fletched it the night she lost count of the nights. It has never missed, which bothers her." |
| `quietus` | Quietus / Quiétus | Mythic | Morgrath's Recognition 5 gift | Patience bonus ×1.5 (shipped) | "A scythe that has never been swung. Morgrath says it will be, once." |
| `unfinished-hammer` (**shipped**) | The Unfinished Hammer / Le Marteau inachevé | Legendary | Brom's Recognition 5 gift | -15% forge cost | "Forged every night for a king who stopped needing it. Finished, at last, for you." |
| `splinter-of-sky` | Splinter of the Sky / Éclat de voûte | Mythic | Astral stratum (era 4) guardians, 1% | +1 shard on every guardian kill | "A blade cut from the Sky-Glass. Look along its edge and you see a room with a lamp in it." |
| `dawnbreak` | Dawnbreak / Point-du-jour | Mythic | Descent 5 or deeper, the Dawn at stage 3000 | +25% DPS during the Seam event | "It is warm to the touch, like a window in the morning." |

### 11.2 Armor (main stat boss damage)

| Id | Name EN / FR | Rarity | Source | Unique effect | Legend |
|---|---|---|---|---|---|
| `hollow-plate` | The Hollow Plate / Le Harnois creux | Mythic | Stray Armor event, first kill | +2 s boss timer | "It walked here on its own. It will leave the same way, once you are done with it." |
| `mosshide` (**shipped**) | Mosshide / Peau-de-mousse | Legendary | Moss Alpha in Echo stratum or deeper, 3% | +10% gold from guardians | "The Alpha's winter coat. Still warm. Still growing moss." |
| `briar-mantle` | Briar Mantle / Manteau de ronces | Legendary | Heart of the Old Grove, 3% | +10% idle bonus | "Woven by the mother-tree for Séraphine's first winter. It remembers being a gift." |
| `aurelion-scales` | Scales of Aurelion / Écailles d'Aurelion | Mythic | Aurelion's Recognition 5 gift | +20% damage to elites and guardians | "Shed in the Wyrm stratum, a thousand worlds ago. He would like them back eventually." |
| `ash-vestment` | Vestment of Cinders / Robe des cendres | Legendary | Ash stratum guardians, 2% | Golden Rain lasts 45 s | "Worn by the first Ember Monk, who walked into the Pyre's fire to carry out one flame." |
| `mantle-of-the-last-court` | Mantle of the Last Court / Manteau de la dernière cour | Mythic | Fallen King, Age III or deeper, 1% | Part of the Regalia (below) | "Purple once. The color went somewhere. So did the court." |

### 11.3 Amulets (main stat click)

| Id | Name EN / FR | Rarity | Source | Unique effect | Legend |
|---|---|---|---|---|---|
| `eldra-locket` | Eldra's Locket / Médaillon d'Eldra | Mythic | Eldra's Recognition 5 gift | -10% power cooldowns (counts with Echoes, total capped at -60%) | "An hourglass the size of a tear. The sand falls up." |
| `singing-stone` | The Singing Stone / La Pierre qui chante | Legendary | Singing Geode (rare wanderer), 5% | Crystals stay 18 s instead of 13 s | "It hums whenever someone looks at it. It hums a lot around you." |
| `oriane-ear` | Oriane's Ear / L'Oreille d'Oriane | Legendary | Oriane's Recognition 5 gift | +25% fragment chance from guardians | "A shell of pale stone. Hold it to your ear and hear tomorrow, faintly." |
| `grove-seed` | Seed of the Old Grove / Graine du vieux bosquet | Legendary | Séraphine's Recognition 5 gift | +10% click damage per companion with Recognition 5 (max +100%) | "The mother-tree's last seed. It will not grow in the night. It is waiting." |
| `phylactery` | Morgrath's Phylactery / Phylactère de Morgrath | Mythic | Morgrath hired at level 150, 1% per guardian | +50% idle bonus, -50% click damage | "He keeps his life in it. He says it's the safest place, because nobody wants it." |
| `last-decree` | The Last Decree / Le Dernier Décret | Mythic | Fallen King, Age V or deeper, 1% | Part of the Regalia (below) | "A sealed scroll. The seal is intact. The King asked that it never be read." |

### 11.4 Rings (main stat gold)

| Id | Name EN / FR | Rarity | Source | Unique effect | Legend |
|---|---|---|---|---|---|
| `signet-of-orvane` | Signet of Orvane / Sceau d'Orvane | Mythic | Fallen King, Age II or deeper, 1% | Part of the Regalia (below) | "The King's seal. It stamps a crown, and under it a letter so worn you can only guess it is an A." |
| `rat-ring` | The Rat's Ring / L'Anneau du rat | Legendary | Pip, 0.5% per catch | +2% golden rat chance (counts toward the 25% cap) | "Gold, tiny, bitten. Pip dropped it on purpose. Pip does everything on purpose." |
| `lodestone-band` | Garrick's Lodestone / Aimantite de Garrick | Legendary | Garrick's Recognition 5 gift | Wandering crystals come 15% sooner | "The shard he buried, set in a ring. The reflection in it has closed its eyes." |
| `mirelle-ring` | Mirelle's Wedding Ring / L'Alliance de Mirelle | Legendary | Mirelle's Recognition 5 gift | +25% gold, +50% damage to the Baron of Rot | "Engraved inside: O. and M., and a date that has happened ten thousand times." |
| `stallkeeper-band` | The Stallkeeper's Token / Jeton du Comptoir | Legendary | The Caravan event (section 13) | -10% market prices | "A brass token with a hole in it. The Stallkeeper said: you'll know when to give it back." |
| `second-morning` | Ring of the Second Morning / Anneau du second matin | Mythic | Aurora stratum (era 19) guardians, 1% | Altar of the Wanderer counts 5 more stages (within its caps) | "Two suns engraved on the band. One of them has been scratched out." |

### 11.5 The Regalia and the Crown

The **Regalia of Orvane** (FR: *les Regalia d'Orvane*): the Signet, the Mantle of the Last
Court and the Last Decree. Wearing all three gives a set effect: **the King recognizes
you** (his Words change to a special set of 12 lines, and the King's forms bow before the
fight; +10% DPS against him). No other gameplay effect, on purpose: the Regalia are a
story reward.

The **Crown of Orvane** (FR: *la Couronne d'Orvane*) never drops. After Descent 10, a fifth
slot silhouette appears in the equipment window. It cannot be filled. Hovering it shows:
"It cannot be worn. It wears you." (FR: *« Elle ne se porte pas. C'est elle qui te
porte. »*). Its legend in the Chronicle is written by the Nameless.

---

## 12. New mechanics that serve the story

Eight systems, then the Promise (12.11), the game's own mechanic. None of them adds a new
way to get stronger faster than the current balance allows, except the Descent, which is
the second prestige layer PRODUCT.md already asks for. Their cost for the anti-cheat is listed in section 21.

### 12.1 The Chronicle (codex)

> **Shipped**: every source in the book's order, newest first, and the Night list.

A new tab in the Hall window: **Chronicle** (FR: *Chronique*). It holds every fragment the
player has found, sorted by source, with unread markers and a counter per source. It also
shows the **Night list**: the existing ascension history (100 entries), each night written
as one line: *"Night 37. Reached stage 412. Brought back 1.2M light. The King said: 'Again,
then.'"*. The Chronicle is the book the whole story is written in, and the player writes
half of it by playing.

### 12.2 Recognition (companions remember)

> **Shipped**: runs are counted for every companion; memories, hire lines and the +10% are
> live for Maëlle and Brom, the others join with their arcs.

Each companion has a **Recognition** level from 0 to 5, raised by runs: a night
(ascension) in which that companion reached level 100 counts once, twice when it kept one
of the two promises their memories wait for (section 12.11); a promise kept to a companion
who stayed under level 100 counts the night once. Tiers at 1, 3, 7, 15 and 32 runs, and the last
two memories each ask one promise kept: nobody is fully remembered by only walking past.
(Before promises, save version 9 and older, the tiers were 1, 3, 7, 15 and 30 runs alone:
what a companion remembered then, they keep.) Each tier unlocks one memory in the Chronicle (section 10.3), a short toast
when first reached ("Maëlle looks at you strangely."), and a visual change on the
medallion (a thin gold ring per tier). At tier 5, a **gift** for eight companions (named
relics) and a permanent **+10% DPS for that companion**.

Why this rule: it rewards playing many nights with the same friends, it cannot be rushed
in one run, and it is cheap to verify (bounded by the number of ascensions).

### 12.3 The Bestiary

> **Shipped**: the seven pages, and Biscuit's blank page once the Good Boy secret is found.

A tab in the Hall: every Remnant seen, with its sprite, name and up to three lines
unlocked at 1, 100 and 1,000 kills of that creature (all strata together). Silhouettes for
creatures not yet met. Completing a biome's page gives +1% gold (5 biomes, +5% total).
Needs a per-monster kill counter (section 21).

### 12.4 The King's Words

Each ascension, the confirmation toast carries one line from the King, in order (the first
and the thirteenth are spoken in the Ledger's scenes, section 12.10): the
King's Words (FR: *les Paroles du roi*). 50 are written by hand (the arc below), then they
come from the fragment grammar (section 17), in the King's voice. They are the one thread
every player follows.

> **Shipped**: every night keeps its written Word. The seven Eclipse words (section 13) are
> spoken when the eclipsed King falls, and join the Chronicle from the next dusk on.

**The arc of the first 50 Words:**

| Nights | Movement | Sample (EN) | Sample (FR) |
|---|---|---|---|
| 1 | Surprise | "You're early." | « Tu es en avance. » |
| 2 to 5 | Recognition | "Again, then." · "You hold the sword better tonight." | « Encore, donc. » · « Tu tiens mieux ton épée, ce soir. » |
| 6 to 12 | Conversation | "Mind the third step. It was loose in my father's time." | « Attention à la troisième marche. Elle branlait déjà du temps de mon père. » |
| 13 to 20 | Confession | "I sat down for a moment. Only a moment." | « Je me suis assis un instant. Rien qu'un instant. » |
| 21 to 30 | Warning | "Don't give them everything. The stones never give it back." | « Ne leur donne pas tout. Les pierres ne rendent jamais rien. » |
| 31 to 40 | Pity and pride | "You look tired. Good. It means you are still walking." | « Tu as l'air fatigué. Tant mieux. Ça veut dire que tu marches encore. » |
| 41 to 49 | Gratitude | "Thank you for coming back. Nobody else does, you know." | « Merci de revenir. Personne d'autre ne le fait, tu sais. » |
| 50 | The request | "Don't stop. I did." | « Ne t'arrête pas. Moi, je l'ai fait. » |

### 12.5 Events

A small event system (section 13): twelve events, each with a trigger, a duration, a
bounded reward and a fragment. Events only fire in a **visible tab** (like crystals),
never during a catch-up, and are driven by the engine RNG so they stay reproducible.

### 12.6 Named relics

Section 11. A new optional field on `Item` (`named?: string`), a table of 24 definitions
in `data/`, legends in `content/`, and a per-save list of named relics already found.

### 12.7 The Descent (second prestige layer)

PRODUCT.md notes the known limit: progress flattens after two weeks, and keeping players
apart needs a second prestige layer. The Descent is that layer, told as the story's
deepest act.

- **Unlock:** best stage ever 1000 and Eldra's Recognition 5 (she shows you her loom).
- **In the world:** Eldra unweaves the whole Sanctum and weaves the Long Night again, one
  thread deeper. The walker loses the stones (altars) and the memories (essences) and
  keeps what cannot be unwoven: relics, shards, deeds, the Chronicle, Recognition.
- **Resets:** everything an ascension resets, plus essences and altar levels.
- **Keeps:** relics, shards, achievements, fragments, bestiary, Recognition, lifetime
  statistics, best stage ever.
- **Gives:** **Threads** (FR: *Fils*). Shipped: the thread is as long as the night has gone
  deep, `floor(2^((deepest stage − 750) / 250))` woven in all (2 at stage 1000, twice as many
  with every Age, 32 at stage 2000, 512 at the Dawn), and a Descent weaves only what the
  walker's deepest stage adds to it. In the world: every thread is one night, and Eldra has
  no new thread for a night that went no deeper than the last. (The first shape, threads
  from the essences of each Descent, paid the same for a shallow night as for a deep one:
  descending often and shallow was the best way down.)
- **Spends at Eldra's Loom** on eight **Weaves** (FR: *Tissages*), permanent:

  | Weave EN / FR | Effect per level | Cap |
  |---|---|---|
  | Warp of Plenty / Chaîne d'abondance | Essences ×1.25 (multiplies) | none |
  | Knot of Dusk / Nœud du crépuscule | Altar of the Wanderer +10 levels of cap | 5 |
  | The Long Thread / Le Long Fil | Catch-up cap +1 h (background tab or closed game) | 4 |
  | Humming Loom / Métier bourdonnant | Crystals come 10% sooner | 5 |
  | Kinship / Parenté | Recognition tier thresholds -1 run | 3 |
  | Remembered Stones / Pierres mémoires | Keep 5% of each altar level through a Descent | 5 |
  | Frayed Edge / Lisière effilochée | Fragment chance +20% | 5 |
  | The Seventh Night / La Septième Nuit | Unlocks a 7th power: **Unweave** (skip the current stage, cooldown 60 min) | 1 |

- **Display:** the Descent count shows as the night's number in the scene header
  ("Night II", FR "Nuit II"), and tints the scene's sky one step paler per Descent.
- **Leaderboard:** a fifth board, **Night** (Descents, then Depth).
- **Why it keeps the story endless:** each Descent reopens the strata keystones in a
  second voice (the "second reading" of every stratum, generated by the grammar with the
  Descent number as a seed), so the lore never runs out even at the stage cap.

### 12.8 Dreams on return

The dream itself gives no summary: the company tells what happened (the Reunion's account,
section 6.7). After a catch-up of 1 h or more, the scene shows **one line**, no numbers, for 6 seconds: a
**Dream** (FR: *Rêve*), drawn from a pool of 24 and later from the grammar. "You dreamed of
a field where the wheat was cut." It goes to the Chronicle too.

### 12.9 The Ledger's voice

> **Shipped** in the account window, the save conflict, the save refusal and the Roll.

The account window, save errors and the leaderboard get light diegetic copy, always with
the plain meaning next to it (the product must stay clear): "Your name is not yet sealed
(confirm your e-mail within 3 days)", "The Ledger could not write this night (save
refused)". Guests see "Unnamed walker" instead of "Guest".

### 12.10 The Ledger's scenes

> **Shipped**: the First Dusk, Almost, the Empty Throne (`data/cutscenes.ts`,
> `content/story/cutscenes.ts`).

A few times in the whole game, never more, the Ledger tells a moment in pictures: a scene
of three to six shots of the world, one image and one line each, 20 to 40 seconds, the
night going on beneath. Every scene can be skipped and seen again in the Chronicle. The
same rules as every line: reveal, never explain; the Truth is never stated.

| Scene | When | What it shows |
|---|---|---|
| **The First Dusk** (shipped) | Ascension 1 | The Keep and its King; "Night one."; "You're early."; the King going up in violet lights; the Sanctum's thirteen stones; "Dusk again." |
| **Almost** (shipped) | Maëlle hired again after she first half remembers (~3 h) | The road at dusk; Maëlle's face in the dark: "You again? No. I'd remember. Wouldn't I?"; she keeps looking back. |
| **The Empty Throne** (shipped) | Ascension 13 | The King speaks before the sword is raised: "I sat down for a moment."; the throne, its arms worn like a step. |
| The Crown in the Ice | Stage 500 | A smaller crown under the rime. There were other kings. |
| The Rehearsal | Stage 1,000 | The aurora: not the Dawn, its rehearsal. |
| The Loom | Descent 1 | Eldra at her loom, the woven night on its beam. |
| The Threshold | Stage 2,000 | Morgrath says the word nobody says. |
| Not Yet | Stage 3,000 | The line of light, and the road ending. |

### 12.11 The Promise

> **Shipped** (save version 10): the twenty requests, the word held by the engine, the knot
> on the medallion, the Promise tab of the Sanctum (`data/promises.ts`,
> `content/story/promises.ts`).

The game's own mechanic, born of its fiction: **at dusk everyone forgets, except a word
given.** Before the company gathers, one companion may ask the walker for something, and the
walker may give their word. One word a night, to one companion. The night is then walked
differently: what the word forbids is refused by the night itself (a walker who gave their
word does not break it by accident), the company left alone respects it too, and only the
walker can take it back, on purpose.

- **Opens** (shipped) once a companion half remembers the walker (Recognition 2, three nights walked together): nobody asks a stranger for their word. Each companion asks from their own second memory on. **Nobody
  asks two nights running**: the companion who had last night's word waits a dusk. And
  nobody asks for a night the walker has never walked: a request is only made once every
  stage it needs cleared (its King or Kings, the guardian it waits at) lies under the
  walker's best stage, counted from where the night will start.
- **Given** in the Sanctum: at once while the night is still at its dusk (nobody hired, no
  stretch of road cleared, nothing the word forbids already done), otherwise for the next
  dusk. A word given at a dusk where a Descent begins is given again below.
- **Kept** at dusk when the night met what it asked **and its King fell** (a King beaten at
  the head of the run since the word was given: the night has to be walked). The night then
  counts **twice** in that companion's Recognition (12.2) if they also reached level 100
  that night and their memories were still waiting for a word (two per companion, the ones
  their last two memories ask); once otherwise (a word kept to someone who stayed behind, or
  a third word, is remembered, not doubled). The companion says one line, kept in the
  Chronicle the first time ("Words kept").
- **Broken** by the walker's choice (the Sanctum, confirmed), by a dusk called too early, or,
  for Eldra's, by a seam that closes on the company. Breaking costs no power: what the word
  forbade is allowed again, the night counts like any other, the companion says one line
  (a toast, and a knot undone on the medallion until dusk), and nothing goes to the Chronicle.
- **Why the rule:** every night asks a new question (whose word, and is it worth the depth
  it costs tonight?), the wall offers a second one (keep it and turn back, or break it and
  go on), and the last two memories of a companion cannot be had by only walking past them.

**The twenty requests** (one each, always the same; the rule in plain words is shown with it):

| Companion | What they ask | In the world |
|---|---|---|
| Maëlle | Nobody past her joins until the night's first guardian falls | "Just you and me, like the first night." |
| Brom | The weapon counts for nothing all night, and is left alone | He keeps it on his anvil: it has a fold he does not like. |
| Ysolde | No strike of the walker's own all night | "Stand still. Let me do the shooting." She has seen where you fall. |
| Brother Cinder | Ashka is not hired all night | Keep the fire between her and him. |
| Nyx | No power all night | Not tonight: the heart beats alone. |
| Garrick | No shard spent all night (stall, forge, Caravan) | He wants to count them all at dusk. |
| Séraphine | No blow for 10 s before the Heart of the Old Grove, which must fall | Her teacher has something to say to her first. |
| Thorvald | Elites and guardians for half their time, all night | Double or nothing. |
| Mirelle | No blow for 15 s before the Baron of Rot, who must fall | One more cure to try, and he has to be standing. |
| Kaelen | Nobody past him joins until the King falls | A knight's place is at the head. |
| Oriane | The night goes past the stage the last one reached | She has already heard it. Do not make her wrong. |
| Vorn | No blow for 10 s before the Stone Devourer, which must fall | Biscuit wants a sniff. They are the same sort of hungry. |
| Lysandre | Two Kings fall this night | One king proves nothing. He needs the second for a footnote. |
| Ashka | Brother Cinder is not hired all night | His little flame makes hers look patient. |
| The Nameless | No essence offered to the altars all night | His gauntlet on the walker's essences. (He does not speak yet.) |
| Eldra | No seam closes on the walker all night; alone, the company only walks into seams it can hold | Every seam that closes, she mends before dusk. |
| Morgrath | Kaelen is not hired all night | He will not walk beside the King's knight. |
| Célestine | No crystal caught all night | They sing differently when nobody reaches. |
| Aurelion | No blow for 10 s before the King | One does not strike a crown unannounced. |
| The Awakened | The Awakened is not hired all night | They sit down by the road, one open hand toward the dark: go on. |

Each request is written three times in the companion's voice (section 20): the asking, the
word kept, the word broken. The Nameless and the Awakened do not speak before their last
memories: theirs are gestures. No request gives away a secret of section 10.3 before its
Recognition tier (Kaelen asks for "a knight's place", never says whose place it was).

---

## 13. Events

All events: visible tab only, engine RNG, no catch-up, one at a time, a violet toast,
a new sound cue, a fragment on first occurrence.

| # | Event EN / FR | Trigger | What happens | Reward (bounded) | Story |
|---|---|---|---|---|---|
| 1 | **The Seam** / La Brèche | Normal stage ≥ 60, 1 in 400 spawns | A Seam Warden replaces the monster: elite HP, 20 s timer. Failing costs nothing. | Elite drop rules, 1 Age echo fragment | A crack in the night; the walker holds it shut. |
| 2 | **Crystal Storm** / Averse de cristaux (**shipped**) | 1 in 20 crystal spawns | 5 crystals over 15 s, the Lantern Queen flies across the sky. | 5 normal crystal rolls | Something looks at the world very hard for a moment. |
| 3 | **Pip's Wager** / Le Pari de Pip (**shipped**) | 1 in 10 golden rats, then 3 min of rest | Pip stops; 13 clicks in 5 s and he pays 45 s of the road's gold (×30 at least). Miss and Pip leaves, laughing. | Gold of 45 s once (bounded per golden rat caught) | Thorvald's debt, paid back one rat at a time. Pip does not like to be taken for granted: he dares, then lets his rats run a while. |
| 4 | **Echo of a Walker** / Écho d'un marcheur | From 5 ascensions, 1% per first clear of a guardian | A pixel ghost bearing a name from the top 100 of the Roll fights 30 s beside the company. | DPS ×1.25 for 30 s (below existing timed bounds) | The only moment two walkers' strands touch. |
| 5 | **The Caravan** / La Roulotte | Once per calendar week, from 3 ascensions | The Stallkeeper's special offer, the same for everyone that week (seeded by ISO week): one of 8 rotating wares, including the Stallkeeper's Token. | Priced in shards | The Stallkeeper travels between nights. |
| 6 | **The Quiet** / Le Silence | Void stratum or deeper, 1 in 1,000 spawns | A colorless monster; sounds drop; kill it within 10 s. | 1 Void fragment, a Deed | A piece of the Morning, leaking in. |
| 7 | **Stray Armor** / L'Armure errante | The Nameless hired, 1 in 2,000 spawns | An empty armor walks across the arena; defeat it. | The Hollow Plate (first time) | The Nameless's old armor, or one like it. |
| 8 | **The King's Eclipse** / L'Éclipse du roi | Every 7th ascension, next King fight | The King's form is shadowed; +50% HP, same timer. | A guaranteed relic roll, and as he falls one of seven Eclipse words (**shipped**) | The King, briefly, remembers being a walker. |
| 9 | **Dream-tide** / Marée des rêves | After a catch-up ≥ 4 h | The Dream line (12.8); the next crystal comes after 20 s. | One crystal, sooner | The dreamer, waking slowly. |
| 10 | **Remembrance Night** / Nuit du souvenir | Real dates: launch anniversary and the winter solstice (longest night of the year) | 24 h: lanterns in every biome, fragment chance ×2, a special keystone. No power bonus. | Fragments only (keeps the Roll fair) | The Long Night celebrates itself. |
| 11 | **The Migration** / La Migration | Era ≥ 1, 1 in 50 stages | For one stage, Remnants of another biome cross this one. | Bestiary progress for both | Memories wander when the weave is thin. |
| 12 | **The Unfinished** / L'Inachevé | Age VI (Draft) or deeper, 1 in 200 spawns | A monster spawns half-drawn and fills in pixel by pixel as it takes damage. | 1 Draft fragment | The world, caught being drawn. |

---

## 14. New achievements (Deeds)

Today: 75 achievements in 18 series. Proposed: **61 new**, for **136 in 27 series**. New
series keep the existing bonus rule (+2% DPS per tier, the last two ×2.5, click gets half).
Secret deeds give **no DPS bonus** (so forging one gains nothing and the anti-cheat only
checks that the id exists).

### 14.1 Extensions of existing series (+7)

| Series | New thresholds | Names EN / FR |
|---|---|---|
| stage | 1,000 · 2,000 · 3,000 | A Thousand Stones / Mille bornes · Below the Words / Sous les mots · Not Yet / Pas encore |
| stage (shipped, the end of every Age, tiers 13 to 19) | 750 · 1,250 · 1,500 · 1,750 · 2,250 · 2,500 · 2,750 | Past the Last Chapel / Après la dernière chapelle · Loose Threads / Fils défaits · Erased Twice / Deux fois effacé · Unspoken / Ce qui ne se dit pas · A Lamp Left On / Une lampe restée allumée · What Was Undone / Ce qui fut défait · White on White / Blanc sur blanc |
| gold (shipped, about the gold of each Age, tiers 8 to 18) | 1e45 · 1e65 · 1e80 · 1e100 · 1e115 · 1e135 · 1e155 · 1e170 · 1e190 · 1e205 · 1e225 | Coin of the Elder Kings / La monnaie des anciens rois · Tithes of the Hallowed / La dîme des consacrés · Gold That Fell from the Sky / L'or tombé du ciel · Spun Gold / L'or filé · Sketched Coin / Pièces esquissées · A Word for Gold / Un mot pour dire l'or · Heavy Eyes, Heavy Purse / Paupières lourdes, bourse lourde · Coins Under the Pillow / Des pièces sous l'oreiller · Unminted / Jamais frappé · A Blank Coin / Un flan vierge · Pip Stops Counting / Pip ne compte plus |
| ascend | 100 · 250 | Night After Night / Nuit après nuit · Keeper of the Long Night / Gardien de la longue nuit |
| essences | 1e10 · 1e15 | Constellation / Constellation · Galaxy of Memory / Galaxie de souvenirs |

(Extending a series moves its ×2.5 tiers to the two highest thresholds; ids never change,
so a tier added between two others takes the next id and its place by threshold; rerun
`npm run balance`.)

### 14.2 New series (+34)

| Series (category) | Thresholds | Names EN / FR |
|---|---|---|
| `bestiary` (secrets) | 10 · 25 · 45 · 63 creatures | Naturalist / Naturaliste · Field Notes / Carnet de terrain · Book of Remnants / Livre des vestiges · Every Nightmare Named / Tous les cauchemars nommés |
| `fragments` (secrets) | 10 · 50 · 150 · 500 · 2,000 | Whisper / Murmure · Listener / À l'écoute · Archivist / Archiviste · Keeper of the Chronicle / Gardien de la chronique · The Night Remembers / La nuit se souvient |
| `recognition` (companions) | 1 · 5 · 10 · 20 companions at tier 5 | Familiar Face / Visage familier · Old Friends / Vieux amis · Company of Memories / Compagnie des souvenirs · They All Remember / Tous se souviennent |
| `strata` (progression) | strata 10 · 20 · 30 · 40 · 50 · 60 reached | Hallowed Ground / Terre consacrée · Among the Threads / Parmi les fils · Speaker of Names / Diseur de noms · Behind the Glass / Derrière la vitre · The Blank Page / La page blanche · Almost Morning / Presque le matin |
| `descents` (ascension) | 1 · 3 · 10 · 25 | Rewoven / Retissé · Deeper Night / Nuit profonde · Loom-Bound / Lié au métier · Night Without Floor / Nuit sans fond |
| `named` (secrets) | 1 · 6 · 12 · 24 named relics | A Name in Steel / Un nom dans l'acier · Collector of Legends / Collectionneur de légendes · Hall of Relics / Salle des reliques · Every Legend Kept / Toutes les légendes |
| `seams` (combat) | 1 · 25 · 100 Seams closed | First Stitch / Premier point · Seamwarden / Gardien des brèches · The Night Holds / La nuit tient |
| `kings` (combat) | 1 · 10 · 100 · 1,000 Kings defeated | Long Live the King / Vive le roi · Kingbreaker / Briseur de rois · A Hundred Coronations / Cent couronnements · The Crown Is Heavy / La couronne est lourde |

### 14.3 Secret deeds (+20)

Hidden in the Hall until earned (name shown as "???", description as a riddle). One per
secret of section 15, same order.

| # | Name EN / FR | Riddle shown before (EN) |
|---|---|---|
| 1 | Let Him Rest / Laisse-le dormir | "Sometimes the kindest blow is none." |
| 2 | Even / Quittes | "A debt, a rat, a mountain." |
| 3 | Faceless / Sans visage | "Knock on the shadow's door." |
| 4 | Small Change / Petite monnaie | "Break a star for coins." |
| 5 | Night Owl / Oiseau de nuit (**shipped**) | "Walk when the real night is darkest." |
| 6 | The Thousandth Notch / La millième encoche (**shipped**) | "Count with the huntress." |
| 7 | Same Road / Même route | "Walk the same night three times." |
| 8 | Keep Some / Garde-en | "Arrive at dusk with your pockets full." |
| 9 | That's How It Starts / C'est comme ça que ça commence | "Arrive at dusk with nothing." |
| 10 | Empty Hands / Mains nues | "Meet the King with nothing but the sword." |
| 11 | Pacifist / Pacifiste | "Let the one who swore off weapons lead." |
| 12 | The Last Second / La dernière seconde | "Seven times, just in time." |
| 13 | Listening / À l'écoute des échos | "Be still where the echoes live." |
| 14 | Good Boy / Brave bête | "Earn the trust of the unspeakable." |
| 15 | Till Death / Jusqu'à la mort | "Bring the ring to the mire." |
| 16 | The Last Blow / Le dernier coup | "Let the knight finish what he ran from." |
| 17 | It Wears You / C'est elle qui te porte | "Reach for the fifth slot." |
| 18 | Behind the Glass / De l'autre côté | "In the Dreamer's Room, look out the window." |
| 19 | Two Tongues / Deux langues | "Hear the night in both its voices." |
| 20 | Welcome Back / Bon retour | "Be gone a long while. Come back." |

---

## 15. Secrets

Twenty things to find. Each has a trigger the engine can see, a reward (a fragment, a
secret deed, sometimes a cosmetic), and **no power**: secrets are for curiosity, not for
the Roll. They live in a `secrets` list in the save (bounded ids).

| # | Secret | Trigger | Reward |
|---|---|---|---|
| 1 | Let him rest | At stage 50, let the King's timer run out 3 times in a row without a single attack click | King's line: "You could stay. I did." |
| 2 | Even (**shipped**) | 100 golden rats caught with Thorvald hired at level 50 or more in the same run | Thorvald: "Tell him we're even." (A tiny gold rat appears on his medallion.) |
| 3 | Faceless | Click Nyx's portrait in the companions panel 7 times in 3 s | Her portrait shows a starfield for a second. Nyx memory bonus line. |
| 4 | Small change | Salvage a mythic relic | Lysandre: "You broke a star to make change." |
| 5 | Night owl (**shipped**) | Play 1 h in total between 00:00 and 04:00 local time | The Hearthfields' crescent moon is full from then on. |
| 6 | The thousandth notch (**shipped**) | 1,000 kills on stages 1 to 10 in a single run | Maëlle's fence post, in the Chronicle. |
| 7 | Same road | Ascend 3 times in a row from the same best stage | Oriane: "Even the echo is bored." |
| 8 | Keep some | Ascend holding ≥ 1,000 essences, having bought no altar level since the last ascension | The Nameless: "Good. Keep it." |
| 9 | That's how it starts | Spend essences on altars down to 0 held, with ≥ 1,000 spent in one visit to the Sanctum | The Nameless: "That's how it starts." |
| 10 | Empty hands | Beat the King at stage 50 with no relic equipped | Kaelen: "He'd have liked that." |
| 11 | Pacifist | Reach stage 50 with Brother Cinder as the highest-DPS companion | Cinder: "I didn't hit anyone. I just stood very firmly in their way." |
| 12 | The last second (**shipped**) | Beat a guardian with ≤ 0.5 s left on the timer, 7 times | The Gargoyle of the Hours loses a claw on the Keep background. |
| 13 | Listening | Stay 1 h in a visible tab, idle (no attack click), in the Deepvaults | The echo bats fall silent; Oriane speaks. |
| 14 | Good boy | Vorn at level 150 in 10 different runs | Biscuit's page in the bestiary (a blank page with a paw print). |
| 15 | Till death | Beat the Baron of Rot wearing Mirelle's Wedding Ring | The Baron speaks, once: "M.?" |
| 16 | The last blow | Kaelen at Recognition 5, beat the King with Kaelen as the highest-DPS companion | Kaelen's final memory. |
| 17 | It wears you | After Descent 10, hover the fifth equipment slot for 5 s | The Crown's legend. |
| 18 | Behind the glass | In Age IX strata, click the window in the Keep background | A fragment, and the reflection in the window blinks. |
| 19 | Two tongues | Play at least 1 h in each language | Lysandre, in both languages at once, one word each. |
| 20 | Welcome back | Come back after 30 days or more (server time between two saves) | The Stallkeeper: "We kept your lantern lit." |

---

## 16. Revelation calendar

When each hint lands, mapped to the play times PRODUCT.md measures (stage 50 in about 1.5
to 2 h, first ascension around 3 h, stage 100 in 4 to 6 h, an engaged player near stage
1,280 on day 3, everyone near 1,500 to 1,700 after two weeks). The **Layer** column says
which Truth layer (section 4) the milestone moves forward. Beyond stage 1,700 the Descent
is what carries players, so the late Ages are paced by Descents.

| Milestone | When | Vector | What the player learns (Surface / Hint) | Layer |
|---|---|---|---|---|
| Stage 1 | 0 min | Opening line in the scene | "Dusk again." / « Le crépuscule, encore. » The word "again" on minute one. | 2 |
| Stage 10 | ~2 min | Moss Alpha bestiary | "It lets her win. It always has." | 2 |
| Maëlle hired | ~3 min | Hire line | "You look like someone who needs a bow and a friend." | 1 |
| Stage 21 to 30 | ~10 to 40 min | Deepvaults, Echo Bat bestiary (a toast, shipped) | Bats screech before you swing. | 2 |
| Stage 40 | ~1 h | Baron of Rot bestiary | His ring is not rotting. | 1 |
| Stage 50 | the King's first fall, ~2.4 h | Stratum 0 keystone (always toasted, shipped) | "He looked at you as if you were late." | 2 |
| Ascension 1 | ~3 h | The First Dusk (scene, shipped): King's Word 1; Oriane fragment | "You're early." / Oriane: "You've done this before." | 2 |
| Ascension 1, altar level 5 | ~3 to 5 h | Sanctum of Dusk opens; each altar's legend at its level 5 | The altars have legends; someone built them from memories. | 2 |
| Stage 100 | 4 to 6 h | Echo keystone | Echoes, remembered kills. | 2 |
| Ascension 1, then Maëlle hired again | ~3 h | First Recognition (R1, one run at level 100), then Almost (scene, shipped) | "Have we met?" / « On se connaît ? »; "You again? No. I'd remember. Wouldn't I?" | 2 |
| Stage 150 to 200 | day 1 to 2 | Ash and Void keystones | Someone burned the fields to call the sun. A third of the map is missing. | 3 |
| Ascension 5, then rare | day 2 onward (1% per guardian's first clear) | Echo of a Walker unlocks | Other walkers exist. The Roll is their only meeting place. | 2 |
| Stage 250 | day 2 | Astral keystone | The sky is glass. Shards fit it. | 3 |
| Ascension 13 | day 3 to 4 | King's Words turn to confession: The Empty Throne (scene, shipped) | "I sat down for a moment." / « Je me suis assis un instant. » | 3 |
| Stage 300 | day 2 to 3 | Primordial keystone | Lysandre's map ends at BOTTOM. | 3 |
| Stage 350 | day 2 to 3 | Titan keystone (the stratum's last stage) | The ground kept going. The sages were wrong. | 5 |
| Stage 500 | day 3 to 4 | Rime keystone | A crown in the ice, smaller than his. There were other kings. | 4 |
| Kaelen R4 | ~week 1 | Recognition | The night he ran. The Binding had a price. | 3 |
| Ascension 25 | ~week 1 | King's Words: warning (the Nameless asks "How many?" at R3, ~ascension 7; "Keep some." at R4) | "Never spend all of yourself." | 4 |
| Stage 750 | ~week 1 | Eclipse keystone | Priests prayed for a night that would never end. Someone answered. | 3 |
| Stage 1,000 | ~day 3 (engaged) to week 2 | Aurora keystone; Descent possible | "Not the Dawn. Its rehearsal." The word Dawn appears. | 5 |
| Eldra R4, then R5 / Descent 1 | week 2 | Recognition, then the Loom | She wove the Long Night. "I am sorry. I am not sorry." (R4) | 3 |
| Stage 1,250 | week 2 | Frayed keystone | The weave is thin enough to see light through. | 5 |
| Stage 1,300 to 1,500 | weeks 2 to 3 | Age VI, the Draft | The world as a drawing; art turns to charcoal. | 5 |
| The Nameless R5 | weeks 2 to 4 | Recognition | His helmet bears your name. | 4 |
| Stage 1,500 to 1,750 | Descents 1 to 3 | Age VII, the Words | The world is being told to itself so it will not stop. | 5 |
| Ascension 50 | month 1 | King's Word 50 | "Don't stop. I did." / « Ne t'arrête pas. Moi, je l'ai fait. » | 4 |
| Stage 2,000 | week 1 or later, often before the first Descent | Threshold keystone | The word "dream" is spoken for the first time (by Morgrath). | 5 |
| Aurelion R3 to R5 | Descents 3 to 5 | Recognition | "Yours is not the first world someone has left a lamp burning for." (R3) | 5 |
| Stage 2,001 to 2,250 | Descents 5+ | Age IX, the Dreamer's Room | Lantern, hearth, lullaby, window, glass. Something blinks when you do. | 6 |
| Célestine R4 | Descents 5+ | Recognition | "someone is watching us. isn't it nice?" | 6 |
| Stage 2,250 to 2,750 | Descents 7+ | Ages X and XI | The Unmaking, then the Blank page. | 5 |
| Stage 2,950 | Descents 10+ | Gaze keystone | Aldemar without his crown: "Thank you. Go back." | 4 |
| Stage 3,000 | the far end | Dawn keystone | "Not yet." / « Pas encore. » | 6 |
| The Awakened R5 | any time after | Recognition | "Hello." / « Bonjour. » | 6 |
| Descent 10 | the far end | The Crown | "It wears you." | 4 |
| After everything | forever | Fragment grammar, second readings, King's Words, Dreams | The night keeps talking. | all |

---

## 17. Fragments: lore without end

Fragments are the unit of story: one short line, one voice, one image. The system has to
**never run dry**, stay **verifiable**, and never crowd the screen.

### 17.1 Sources

| Source | Voice | Authored pool | Beyond the pool | When |
|---|---|---|---|---|
| Strata keystones | varies | 60 (section 9) | Second readings per Descent (grammar, seeded by Descent and era) | First clear of each stratum's last stage |
| Milestone keystones | varies | 20 | none | Ascensions 1, 5, 10, 25, 50, 100; Descents 1, 3, 5, 10; key Recognitions |
| King's Words | the King | 50 (section 12.4) | Grammar, King's lexicon | Every ascension |
| Biome echoes | Remnants, companions | 60 (12 per biome) | Grammar, biome lexicon | Guardian first clears, 15% (deeper strata raise it) |
| Age echoes | Lysandre's notes, unknown | 96 (8 per Age) | Grammar, Age lexicon | Guardians and Seams inside that Age |
| Crystal songs | Célestine | 30 | Grammar | 5% of crystals |
| Dreams | nobody | 24 | Grammar | Catch-ups ≥ 1 h |
| Stallkeeper sayings | the Stallkeeper | 12 | none (they rotate) | Opening the market |
| Recognition memories | companions | 107 (100 + 7 Lessons) | none | Section 12.2 |
| Bestiary lines | the Ledger | 3 per creature | none | Kill counts |
| Relic and altar legends | varies | 25 + 13 | none | Named relic found, altar level 5 |

### 17.2 Determinism and verification

The save never stores fragment text or ids. It stores **counters per source** (e.g.
`lore.kingWords = 37`, `lore.biome["dark-forest"] = 9`, `lore.age[3] = 4`). The n-th
fragment of a source is always the same: authored entry n, or, past the pool, the grammar
output for `(source, n)` with a fixed seed. The server bounds each counter by statistics
it already verifies (King's Words ≤ ascensions, keystones ≤ strata reached, echoes ≤
bosses, crystal songs ≤ crystals, dreams ≤ catch-ups counted in `offlineSeconds`). No
fragment gives power except through achievements, so a forged counter gains little.

### 17.3 The grammar (procedural fragments)

A fragment past an authored pool is built from:

- **24 templates**, each a sentence shape with slots and a voice: "{Speaker} found {object}
  in {place}. It was {state}." / "Night {n}. {Remnant} {verb} before you did." /
  "{Companion} says {object} reminds them of {memory}."
- **60 stratum lexicons** (one per era), 16 words each per language: objects, places,
  verbs, states and one color. Age IX lexicons carry the domestic words (lamp, blanket,
  cup, curtain); Age XI the white ones (margin, chalk, snow, page).
- **Companion and King lexicons** so voices stay recognizable.
- **French agreement:** each lexicon entry carries gender and number, like `itemBases`
  today; templates are written per language, not translated at runtime.

Rules: at most 140 characters; never generate a Truth-level noun (dream, dreamer, player,
screen, tab) outside Age VIII and deeper; never repeat the same template twice in a row;
seed = hash(source, n, descent). The grammar is a writer's tool: authored pools are always
used first, and every Remembrance Night adds authored lines.

### 17.4 Pacing

About one fragment per 20 to 40 minutes of play in the first week (keystones, King,
echoes, crystals), slowing to one per hour later, plus the King's Word at each ascension.
A toast "A fragment surfaces" (FR: « Un fragment refait surface ») with the violet tone;
the Hall button gets a count badge. Never more than one fragment toast per minute; extras
wait in the Chronicle.

---

## 18. Art direction: pixel art generated by code

> **Shipped** (the engine, Age I to XII): palette, material and biome ramps, the 26
> existing creatures as recipes on 16 body plans, idle, hit, death, spawn and boss
> programs, the twelve Age treatments with a step per era, the five biome scenes and their
> Age marks, companion portraits and emblems, relic icons, the 25 in-world icons, the
> crystal, pixel shots and particles, the one-canvas arena, the OpenGraph export and a
> workshop page. The rules now live in DESIGN.md (Imagery, Motion). Choices made while
> building it: body plans and parts are shapes (ellipses, capsules, polygons) in a 64-unit
> space rather than character masks, so one recipe draws at every size (the 12 × 12
> emblems and the crystal are character masks); the landing art is drawn in the browser
> by the same generator rather than exported at build time; the favicon stays the brand's.
> The combat scene was then redrawn as clean, flat pixel art, which overrides 18.4 to 18.7
> where they differ: one grid 180 rows high for the whole scene; solid shapes, each plane
> one color and each plane darker and duller with distance; dithering only between the
> sky's bands; 16 colors per scene; no translucent pixel; creatures shaded in flat bands,
> with no material texture, and outlined in ink all around; a far landmark at the end of a
> winding road, dark shapes at the edges, a slow camera sway for parallax. The Hearthfields
> then gained drawn detail within the same rules: grass tuft by tuft, flowers and stones
> placed by hand, props in their own shaded colors with a moonlit rim, the moon's halo, the
> farmhouse window's pool of light, tall dark grass framing the view (20 colors per scene
> at most, 24 with a creature). The Hearthfields'
> creatures (8.1) and the named relics of the Hearthfields have shipped too. Every creature
> of the road was then redrawn by hand in the look of the painted originals: dark masses
> in clusters, texture, a moonlit rim, glowing eyes (section 8).
> Then shipped too: the King's twelve forms (8.7) and every other creature of section 8,
> the Sanctum, Loom and Dawn scenes, the "Keep the Kingdom's sky" setting, the masks of all
> the named relics and the Crown, and the Age marks of Ages II to XII, redrawn with solid
> pixels and regular dithering only.

### 18.1 The rule

**The world is pixel art; the interface is not.** The night of Orvane (monsters,
backgrounds, companions, relics, effects) is drawn in pixels, generated by code,
deterministic, palette-driven. The interface (header, panels, windows, numbers, buttons)
stays the Ledger: Cinzel and Alegreya Sans, the gold-on-night tokens of `globals.css`, crisp
vector icons. The contrast is the story: the dream is pixels, the record of it is ink.

This replaces the painted WebP portraits and zones of DESIGN.md once shipped. The brand
logo and the e-mail template stay as they are.

### 18.2 Grid and scale

> **Shipped** (the creature and the places): the creature is what the walker strikes, so
> it stays the subject of the arena. Measured against the 140 rows of a scene above its
> ground line, a normal creature stands at least 45% of the height (63 rows), an elite 60%
> (84), a guardian 75% (105), the King's forms about 90% (125); in every biome the
> creatures stand under their elite, the elite under its guardian. The scale is set by the
> places, not by shrinking the creatures: each biome's building (Brom's forge, the
> tree-house, the winding house, the house on stilts, the gatehouse) was drawn again small,
> high in the picture and in the scene's air, so nothing with a door stands at the size of
> what fights in front of it. The table below is the first plan, kept as the record.

| Asset | Logical size | Notes |
|---|---|---|
| Normal monster | 48 × 48 | Silhouette fills about 70% |
| Elite | 64 × 64 | |
| Guardian | 96 × 96 | |
| King forms, the Dawn | 128 × 128 | |
| Golden rat, rare wanderers | 32 × 32 to 48 × 48 | |
| Companion portrait (medallion) | 32 × 32 | Head and shoulders |
| Companion emblem (replaces the Unicode glyph) | 12 × 12 | |
| Relic icon | 24 × 24 | 20 base shapes + 24 named |
| Background | 320 × 180 per layer | Wider layers for parallax, tiled horizontally |
| Pixel icons (altars, powers, market, buffs) | 16 × 16 | UI keeps SVG; these are for in-world spots (the Sanctum, the stall) |

**Integer scaling only.** The arena picks the largest whole factor that fits (×2 on
phones, ×3 or ×4 on desktop) and centers the rest; `image-rendering: pixelated`; canvases
sized in device pixels. No sub-pixel positions: shots and damage motes snap to the grid of
the current scale.

### 18.3 Palettes

One **master palette of 64 colors** (the "Orvane 64"), built around the tokens: night
purples (`#0b0a14` to `#54438a`), gold (`#b8862b` to `#ffe29a`), essence violet, shard
blue, companion mint, and four material ramps (flesh, fur, stone, foliage). Every sprite
uses 4 to 12 colors from it. **Ramps** are 4 or 5 steps, hue-shifted (shadows cooler
and more violet, highlights warmer), never pure black: the darkest outline is `#0b0a14`.

**Biome ramps** (from each biome's existing accent):

| Biome | Sky | Ground | Foliage / feature | Light | Accent |
|---|---|---|---|---|---|
| Hearthfields | `#1a1633` `#2b2450` | `#2e3a24` `#4a5a2a` | `#5f8a3a` `#8bd46a` | `#ffe29a` (lanterns, fireflies) | `#8bd46a` |
| Wychwood | `#0e1420` `#172a2c` | `#1d2a22` `#2c3f30` | `#2f6b58` `#4fd1a5` | `#c9ffe8` (wisps) | `#4fd1a5` |
| Deepvaults | `#0b0a14` `#16182e` | `#23264a` `#3a3f70` | `#5a64b8` `#8f9cff` | `#7fd8ff` (runes, shards) | `#8f9cff` |
| Mire of Osric | `#121410` `#1f2616` | `#2f3318` `#4d5222` | `#7d8f2f` `#b6d94c` | `#e8ff9a` (will-o'-wisps) | `#b6d94c` |
| Orvane Keep | `#140f24` `#221a3d` | `#2a2347` `#3f3566` | `#7a5bb8` `#c58cff` | `#c9a6ff` (violet fire) | `#c58cff` |

Rarity colors stay those of `RARITY_INFO`; relic icons take their highlight from them.

### 18.4 The monster generator

> **Superseded** (shipped): every creature is now drawn by hand, pixel by pixel, each with
> its own anatomy (AGENTS.md, creature rules; section 8). Body plans, parts, mutation and
> palette-swap variants are gone; DESIGN.md describes the grids that replaced them. The
> pipeline below is kept as the record of the first engine.

Monsters are **recipes**, not images. A recipe is data:

```ts
{
  id: "hollow-scarecrow",
  size: 48,
  body: "biped-thin",          // one of ~14 hand-authored silhouette masks
  parts: { head: "sack", arms: "stick", extra: "crow" },
  materials: { body: "straw", head: "burlap", extra: "feather" },
  eyes: { kind: "button", glow: "#ffe29a" },
  seed: 1207
}
```

**Pipeline**, pure and deterministic (same recipe + era + seed = same pixels everywhere):

1. **Silhouette:** a hand-authored mask (strings of characters in code, like ASCII art)
   for the body plan: quadruped small/large, biped thin/heavy, serpent, flier, swarm,
   blob, tree, construct, humanoid robed, humanoid armored, crawler, head-only, abstract.
2. **Parts:** heads, horns, tails, wings, weapons, crowns snap to anchor points of the
   mask; mirrored left-right for symmetric bodies, with 1 or 2 asymmetric details so
   nothing looks stamped.
3. **Mutation:** the seed nudges proportions by one or two pixels and flips a few edge
   pixels (cellular smoothing pass), so variants look related but alive.
4. **Material shading:** each region gets its material ramp; light from the top left;
   one shading pass by distance to the edge, one by a simple normal from the mask.
5. **Outline:** a 1 px selective outline (darker version of the neighbor color, pure
   `#0b0a14` only on the outside bottom edge), which keeps sprites readable on any
   background.
6. **Eyes and glow pixels** are drawn last and marked as emissive: era palette swaps never
   touch them (a Remnant's eyes are always its own).
7. **Era treatment** (18.6) and cache.

**Existing monsters become recipes** (25 + Pip). Variants that today are CSS filters
(Rabid Rat, Deep Wolf, the elites, era tints) become **palette swaps and part swaps** of
the same recipe: the Rabid Rat is the Field Rat with a red ramp, bared teeth and a torn ear.

### 18.5 Animation

> **Shipped.** A hand-drawn creature sets its own, slower idle cycle: a heavy breath and an
> occasional twitch drawn as patches over its rows (the Field Rat: 12 frames).

Generated from the base frame, no hand-drawn frames:

- **Idle:** 4 frames, a 1 px breathing shift of the upper rows (sine), a blink every few
  seconds, parts that sway (tails, banners, flames) on their own phase.
- **Hit:** 1 frame of soft light inside the outline (lilac, paler on a critical, never
  white; outline and emissive pixels stay), at most three flashes a second, 2 px knockback
  away from the source; companion shots tint the flash with the companion's color
  (**shipped**).
- **Death:** the sprite **comes apart into its own pixels**, which drift up and fade into
  gold motes toward the gold counter: a Remnant is a memory, and memories come apart into
  light. Guardians shed a few violet pixels too.
- **Spawn:** the reverse: pixels gather from the dark into the silhouette (a quarter
  second).
- **Bosses:** a 1 px pulsing outline in the biome accent (replaces the CSS glow).
- **Reduced motion:** a single frame, fades instead of scatter.

### 18.6 Era and Age treatments

Each Age defines how its strata transform the base recipe. The treatment is the visual
half of the story: **the deeper, the less finished the world looks**, until Dawn.

| Age | Treatment | Background |
|---|---|---|
| I Kingdom | Echo: a 1 px ghost offset copy in a dusk checker. Ash: ember pixels rising, warm ramps. Void: round missing pieces (holes show the dark beneath). Astral: stars inside the body, on a regular field. | Full painterly pixel scenes |
| II Elder World | Larger, heavier ramps; stone and ice materials; scale ×1.1. | Giant bones, frozen seas on the horizon |
| III Hallowed | Gold highlights, halos, veils (a light column above guardians). | Temples, light shafts |
| IV Stars | Bodies of night glass (a checker of deep blues), filled with star fields; outline in pale blue. | The sky pours, liquid glass |
| V Loom | Threads: vertical 1 px lines through everything, some loose; sprites flicker as if woven. | Warp threads from ground to sky |
| VI Draft | Unshaded: 2 colors plus outline, cross-hatching instead of ramps, charcoal smudges. | Line art on warm paper tones |
| VII Words | Silhouettes filled with tiny glyph patterns (3 × 5 px letters). | Walls of runes |
| VIII Sleep | Slower animations (×0.6), soft 2-step ramps, eyes half closed. | Mist, the moon low |
| IX Dreamer's Room | Warm lamp light from one side (orange ramp), domestic props in the backgrounds: a lamp, a hearth, a window. The window shows a pale rectangle. | Enormous, blurred, familiar shapes |
| X Unmaking | Colors drain toward grey; the outline stays. | Sounds muffle too (section 19) |
| XI Blank | Pale on pale: sprites are drawn in outline only on a sky that has turned off-white lilac. | The night is almost gone |
| XII First Mark | Fewer and fewer pixels, at the same size (never a coarser pixel): thin parts fall away era by era, the masses merge into flat tones; the Dawn is a single horizontal line that widens. | A single point of light, then a line |

The scene's **sky brightens by Age**, from the night purple of Age I to the pale lilac of
Age XI. The HUD never changes: tokens and contrast stay the same everywhere. A setting
("Keep the Kingdom's sky") keeps Age I backgrounds for players who prefer them.

### 18.7 Backgrounds

> **Shipped** (the five biomes): every scene rebuilt in three depths by the method of the
> creatures, its buildings and ruins composed of pieces (`structures/`), each biome's own
> light (the Wychwood's shafts and teal lanterns, the Deepvaults' crystals and one warm
> lantern, the Mire's water mirroring the moon, the Keep's violet fire), the places worn
> era by era (Echo, Ash, Void, Astral, the Elder World's ruins, rime), water, flames,
> banners, leaves and mist in motion, the guardian's ground kept calm. The rules now live
> in DESIGN.md (Imagery). Choices made while building it: buildings are pieces shaded by a
> builder rather than hand-drawn grids, so one recipe wears down through every era; the
> Hearthfields keep their hand-drawn props (the mill and the farmhouse later left out) and gain Brom's forge at the crossroads, later set far up the road (18.2); still
> water floods the Mire only (pools in the Deepvaults read as stripes and were left out).
> The Sanctum, Loom and Dawn scenes and the Age marks of Ages II to XII shipped next (see 18).

Each biome background is a **scene generator** of 4 parallax layers at 320 × 180: sky
(banded gradient in 4 to 6 steps with ordered dithering between bands, stars, moon),
far silhouettes (noise-shaped hills, tree lines, stalactites, reeds, towers), mid props
(a shape grammar: windmill, fence, scarecrow; hanging roots; rails and lanterns; drowned
posts; banners and arches), ground plane with the road. Layers drift slowly (1 px every
few seconds) and sway (grass, reeds, banners). The milestone stone of the Hearthfields
lights up when a stage is cleared. The Sanctum of Dusk, Eldra's Loom and the Dawn get
their own scenes.

### 18.8 Companions, relics, effects

- **Portraits** (**shipped**): 64 × 64 busts from each dossier (section 10.3), painted at
  a higher resolution and traced into clusters like the creatures, moonlit, three-quarters
  toward the monsters, one signature each; human faces share one construction so none
  becomes a caricature; the hero's `color` is an accent. Nyx's hood holds only sky and stars. The
  Nameless's visor is a void. The Awakened's skin and hair use the player's current
  settings as a seed (notation, sound, language), so it is slightly different for everyone.
- **Emblems:** 12 × 12 pixel sigils replace the Unicode glyphs (no more emoji risk).
- **Relic icons** (**shipped**): 20 base shapes (7 weapons, 5 armors, 4 amulets, 4 rings,
  matching `SLOT_BASE_COUNT`), each redrawn per rarity (plain and worn, fitted, engraved
  and gem-set, gold and heroic, Sky-Glass and living light), with forge runes of fire that
  add up every five levels and the exact level written by the Ledger. Named relics get
  their own recipe.
- **Shots:** the current strike families stay; the comets become pixel-snapped heads with
  3-step trails in the companion's ramp; impacts become pixel bursts (cross flare of 5 px,
  ring of 8 pixels, sparks thrown back).
- **Damage numbers** stay in the interface layer (Cinzel, tokens): they are the Ledger
  writing.
- **Crystals:** 16 × 24 faceted gems, 3 facets animated, a halo of dithered light.

### 18.9 Technology

- Recipes live next to the mechanics data (`packages/game/src/data/art/`, no text), the
  generator in `apps/web/src/game/pixel/` (canvas 2D, no dependency).
- **Rendering:** sprites are generated once per (recipe, era, variant) into an
  `OffscreenCanvas` / `ImageBitmap` cache; the arena draws them on one canvas with the
  shots (the existing `strikeFx` canvas becomes the whole arena). Generation happens in
  `requestIdleCallback` for the next stage's monsters.
- **Budget:** a sprite under 2 ms to generate on a mid phone; the cache holds at most 64
  sprites (least recently used out).
- **Seeded RNG:** the engine's `rng.ts` generator, seeded from the recipe, never
  `Math.random`.
- **Static outputs:** the same generator runs in Node at build time for the landing page
  (a pixel King and five biome cards), the OpenGraph image and the favicon set, so the
  site and the game share one look.
- **Tests:** snapshot hashes of generated sprites so an accidental change is caught.

---

## 19. Sound

> **Shipped**: the eight cues, late and muffled sound in Age X, silence at the Dawn. The
> rules now live in DESIGN.md (Sound). Choice made after building it: the ambient drone
> was removed; between two events the game is silent.

Still synthesized in `audio.ts`, no files. The pixel direction pulls it toward square and
triangle waves, short envelopes, a little noise. New cues: **fragment** (two soft bell
notes), **recognition** (a rising third), **seam** (a tearing noise, closing chord),
**descent** (a long falling glissando), **King's Word** (one low note), **dream** (a slow
chord, no attack), **quiet** (everything else ducks for 2 s), **pip** (a squeak, a coin).
In Age X sounds arrive late and muffled; at the Dawn nothing sounds.

---

## 20. Writing guide

> **Shipped**: `packages/game/src/content/writing.test.ts` holds every string of the game
> content and of the UI messages to the forbidden words, the dash and emoji rules; the few
> lines of Age VIII and deeper are listed there by hand. The UI says **strike** (FR:
> *frappe*) for the walker's own blow, and the **Ledger** keeps the walker's road.

- **Length:** fragments 140 characters at most, bestiary lines 120, recognition memories
  and promise lines (asked, kept, broken) 180, relic and altar legends 200. One image per
  line.
- **Voices:** the King (short, plain, tired, kind), Lysandre (confident, footnoted,
  wrong), Oriane (present tense, certainties), Morgrath (theatrical, honest), Célestine
  (sound words, lowercase feeling), the Stallkeeper (commerce as philosophy), the Ledger
  (exact, third person, faintly kind), the Nameless (two words at most).
- **Forbidden words before Age VIII:** dream, dreamer, player, screen, tab, click (as a
  word), save. After Age VIII, only as images (a lamp, a window, a glass), never as
  explanation.
- **French:** *tutoiement* everywhere the walker is addressed; the King says *tu* too.
  Adapt, do not translate: the English and French lines may use different images for the
  same beat. Genders of lexicon entries are data.
- **Humor** lives in the companions and the bestiary; the King and the keystones are
  never jokes (the Jester is allowed one per Age).
- **No em dash, no emoji**, in either language, as for all product copy.

---

## 21. Implementation notes

What the systems above need in the code, following the recipes of AGENTS.md.

**New `GameState` fields** (all optional or defaulted through `migrateState`, save
version 5):

| Field | For | Validation |
|---|---|---|
| `lore: { counts by source }` | Fragments | Each count ≤ its bounding statistic (17.2) |
| `recognition: Record<heroId, number>` (runs with the hero at 100+) | Recognition | Each ≤ lifetime ascensions + 1 |
| `bestiary: Record<monsterId, number>` (kills) | Bestiary | Sum ≤ lifetime kills; ids from the table |
| `named: string[]` | Named relics found | Ids from the table, source reachable (stratum, Recognition, event) |
| `secrets: string[]` | Secrets | Ids from the table; no bonus |
| `descents: number`, `threads: number`, `weaves: Record<id, number>` | Descent | Threads ledger (earned from essences collected ≥ spent + held), caps |
| `lifetime.kings`, `lifetime.seams`, `lifetime.catchUps` | Deeds, fragments | Kings ≤ bosses on stages multiple of 50 reachable; seams ≤ kills / 400 with margin |
| `promises: Record<heroId, number>`, `pledge?`, `lastPromise?`, `trail.promise?`, `remembered` (save version 10, shipped) | The Promise (12.11) | Promises kept ≤ ascensions, one more at most per night ended; Recognition ≤ ascensions + promises kept (two at most); never the companion of last night (`lastPromise`), never a stage past the walker's best; the word of a night never swapped nor mended before its dusk, and what it forbids not done while it stands; `remembered` (tiers 4 and 5 held before version 10) bounded by the runs of the old rule and never changed |

**Validation constants that move:** `WAGER_MAX_GOLD` (Pip's Wager, once per golden rat caught), `MAX_TIMED_DPS`
(Echo of a Walker ×1.25), the offline cap (The Long Thread), crystal timing (Humming Loom,
Garrick's Lodestone), the essence multiplier (Warp of Plenty). Each change keeps the
"accepts a real multi-hour game saved regularly" test green, and the Descent needs a new
honest-play test over several Descents.

**Content files:** strata tags, keystones, lexicons, bestiary lines, relic and altar
legends, recognition memories, King's Words, dreams, crystal songs and Stallkeeper sayings
go into `packages/game/src/content/fr.ts` and `en.ts` (the `GameText` type grows; the i18n
test keeps both locales equal). UI strings (Chronicle, Bestiary, Descent, events) go into
`apps/web/src/i18n/messages/`.

**Leaderboard:** a `descents` column, the fifth board, and the localized board names
(Depth, Nights, Light, Deeds, Night) with the plain meaning as subtitle.

**Docs:** each shipped system moves its rules to PRODUCT.md (mechanics) and DESIGN.md
(visuals), and this file marks it shipped.

---

## 22. Content inventory

> **Shipped** (save version 8): the whole inventory below. Choices made while building it:
> seven normal creatures the tables did not name were added so that every biome fields six
> (the Whispering Bramble, the Haunted Cart, the Hollow Canary, the Peat Cutter, the Mire
> Heron, the Hound of the Last Hunt, the Candle Maid); Dream-tide is called the Slow Tide
> (its name may be read long before Age VIII) and its riddle and the Behind the Glass riddle
> avoid the word; the grammar has 41 templates per language rather than 24, so songs and
> what stays after an absence repeat less; its names are fixed lists, so a new creature never
> changes a line already found; the Chronicle marks what is new per source; the Crown's
> legend is the Nameless's two words; the Remembrance Night of the launch falls on
> October 1st; for the balance targets, Morgrath's Phylactery gives ×1.25 idle bonus for
> ×0.75 click damage (not ±50%), the Briar Mantle drops from the Echo era on like
> Mosshide, and the relics of a boss source roll on the boss at the head of a run. The rules live in PRODUCT.md (The Chronicle, Events of the Long Night, The
> Descent) and DESIGN.md.

Everything the finished game needs, counted. "Texts" are counted once; each exists in
**French and English**, so the number of strings to write is double.

### 22.1 World

| Item | Existing | New | Total |
|---|---|---|---|
| Biomes (place, history, guardian story) | 5 | 0 (rewritten) | 5 |
| Era tags | 5 | 54 | 59 (eras 1 to 59; era 0 has none) |
| Age names | 0 | 12 | 12 |
| Strata keystones | 0 | 60 | 60 |
| Altar legends | 0 | 13 | 13 |
| Named places and scenes (Sanctum, Loom, Dawn) | 0 | 3 | 3 |

### 22.2 Creatures

| Item | Existing | New | Total |
|---|---|---|---|
| Biome normals | 15 | 15 | 30 |
| Biome elites | 5 | 0 | 5 |
| Biome guardians | 5 | 0 | 5 |
| Rare wanderers | 0 | 5 | 5 |
| Specials (Pip, event creatures, the Dawn) | 1 | 6 | 7 |
| King forms | 1 | 11 | 12 |
| **Bestiary entries** (one per distinct creature; form I is the existing Fallen King) | 26 | 37 | **63** |
| Bestiary lines (3 tiers) | 0 | 189 | 189 |
| Monster recipes (pixel) | 0 | 63 | 63 (one per distinct creature) |

### 22.3 Characters

| Item | Count |
|---|---|
| Hero dossiers (personality, story, secret, voice) | 21 |
| Recognition memories (20 × 5) | 100 |
| Aldric's Lessons | 7 |
| Hire lines (20 companions × 3: stranger, familiar, remembered) | 60 |
| Companion portrait recipes | 21 |
| Companion emblems | 21 |
| Other figures (King, Stallkeeper, Pip, Sword-Mother, Osric, Ledger) | 6 |

### 22.4 Relics

| Item | Count |
|---|---|
| Named relics (6 per slot) with legend and unique effect | 24 |
| The Crown (legend only) | 1 |
| Regalia set effect and its 12 special King's Words | 1 set, 12 lines |
| Relic base icons (7 + 5 + 4 + 4) | 20 |
| Named relic icons | 25 |

### 22.5 Fragments

| Source | Authored | Procedural material |
|---|---|---|
| Strata keystones | 60 (counted in 22.1) | Second readings via grammar |
| Milestone keystones | 20 | |
| King's Words | 50 + 12 Regalia | King's lexicon (40 words) |
| Biome echoes | 60 | 5 biome lexicons (16 words) |
| Age echoes | 96 | |
| Crystal songs | 30 | |
| Dreams | 24 | |
| Stallkeeper sayings | 12 | |
| Grammar templates | | 24 |
| Stratum lexicons | | 60 × 16 = 960 entries |
| **Authored fragments, all sources** (excluding strata keystones, recognition and bestiary) | **304** | |

### 22.6 Systems and events

| Item | Count |
|---|---|
| New mechanics (Chronicle, Recognition, Bestiary, King's Words, Events, Named relics, Descent, Dreams) | 8 |
| Weaves of the Loom | 8 |
| New power (Unweave) | 1 |
| Events | 12 |
| Caravan rotating wares | 8 |
| Secrets | 20 |
| New leaderboard board | 1 (5 in total) |
| New `GameState` fields (groups) | 7 |

### 22.7 Achievements

| Item | Count |
|---|---|
| Existing | 75 in 18 series |
| Extensions of existing series | 7 |
| New series tiers | 34 in 8 series |
| Secret deeds | 20 |
| **Total after** | **136 in 27 series** (the secret deeds form one series) |

### 22.8 Art and sound

| Item | Count |
|---|---|
| Silhouette masks (body plans) | 14 |
| Part library (heads, horns, tails, wings, weapons, crowns, props) | about 80 |
| Material ramps | 24 |
| Master palette | 64 colors |
| Biome scene generators × 4 layers | 5 × 4 = 20 |
| Special scenes (Sanctum, Loom, Dawn) | 3 |
| Age treatments | 12 |
| Era palettes (derived from Age treatment + era) | 59 |
| Animation programs (idle, hit, death, spawn, boss pulse) | 5 |
| Pixel icons for in-world spots (13 altars, 6 powers + Unweave, 6 market) | 26 |
| Crystal sprite | 1 (3-frame facets) |
| New sound cues | 8 |
| Static exports (landing King, 5 biome cards, OG image, favicons) | 4 sets |

### 22.9 Text volume, in strings to write (FR + EN)

| Block | Texts | Strings (×2) |
|---|---|---|
| Era tags and Age names | 66 | 132 |
| Keystones (strata and milestones) | 80 | 160 |
| Other authored fragments (King 62, biome 60, Age 96, crystal 30, dreams 24, Stallkeeper 12) | 284 | 568 |
| Bestiary names (new) and lines | 37 + 189 | 452 |
| Recognition memories, Lessons, hire lines | 167 | 334 |
| Relic names and legends, altar legends | 25 × 2 + 13 | 126 |
| Achievement names and descriptions (new) | 61 × 2 | 244 |
| Secret riddles and secret lines | 40 | 80 |
| Events (names, toasts, descriptions) | 12 × 3 | 72 |
| Weaves and Descent UI | 8 × 2 + about 20 | 72 |
| Chronicle, Bestiary, Ledger UI | about 60 | 120 |
| Grammar lexicons (words) and templates | 960 + 40 + 80 + 24 | 2,208 |
| **Total** | **about 2,280 texts** | **about 4,570 strings** |

---

## 23. Production order

1. **The frame** (small, all story): the Chronicle tab, fragment counters, the 60 strata
   tags and keystones, the King's Words 1 to 50, altar legends. The story exists from the
   first minute of play.
2. **The company:** Recognition, 107 memories, hire lines. The heart of the game.
3. **Pixel pipeline:** generator, palettes, the 26 existing creatures as recipes, the 5
   biome scenes, companion portraits and emblems. Ship Age I in pixels.
4. **The Bestiary and the new creatures:** 37 new recipes, 192 lines, rare wanderers.
5. **Events and secrets:** the event system, twelve events, twenty secrets, secret deeds.
6. **Named relics and the Regalia.**
7. **The Descent:** Threads, the Loom, Weaves, the fifth board, second readings, Age
   treatments II to XII, the Dawn. Balance with the bot before anything else.
8. **Endless lore:** the grammar, 960 lexicon words, Dreams, Remembrance Nights.

Each step is a shippable game on its own, and each one makes the next night worth
walking.
