import { AGE_ECHOES_TEXT } from "./story/ages";
import { BESTIARY_TEXT } from "./story/bestiary";
import { BESTIARY_KEEP_TEXT } from "./story/bestiary-keep";
import { COMPANY_TEXT } from "./story/company";
import { CUTSCENES_TEXT } from "./story/cutscenes";
import { COMPANY_LATE_TEXT } from "./story/company-late";
import { PROMISES_TEXT } from "./story/promises";
import { PLACES_TEXT } from "./story/places";
import { STRATA_TEXT } from "./story/strata";
import { SYSTEMS_TEXT } from "./story/systems";
import { VOICES_TEXT } from "./story/voices";
import { roman } from "./roman";
import type { GameText } from "./types";

const n = (value: number) => value.toLocaleString("en-US");
const exp = (value: number) => value.toExponential(0).replace("e+", "e");
const s = (count: number, word: string, plural = `${word}s`) => (count > 1 ? plural : word);

const RARITY_ADJECTIVE = { common: "", rare: "Fine", epic: "Enchanted", legendary: "Legendary", mythic: "Mythic" } as const;

const BIOME_SUFFIX = ["of the Plains", "of the Grove", "of the Depths", "of the Mire", "of the Crown"] as const;

export const en: GameText = {
  biomes: PLACES_TEXT.en.biomes,
  monsters: {
    "field-rat": "Field Rat",
    "wild-boar": "Jumpy Boar",
    "carrion-crow": "Carrion Crow",
    "last-reaper": "Last Reaper",
    "moss-alpha": "Moss Alpha",
    "shade-wolf": "Shade Wolf",
    "briar-witch": "Briar Witch",
    "grove-spinner": "Grove Spinner",
    "root-knight": "Root Knight",
    "old-grove": "Heart of the Old Grove",
    "blind-crawler": "Blind Crawler",
    "echo-bat": "Echo Bat",
    "crystal-mite": "Crystal Mite",
    "miner-shade": "Miner's Shade",
    "stone-devourer": "Stone Devourer",
    "bog-remnant": "Bog Remnant",
    "rot-toad": "Rot Toad",
    "will-o-wisp": "Will-o'-Wisp",
    "bog-colossus": "Mire Colossus",
    "rot-baron": "Baron of Rot",
    "hour-gargoyle": "Gargoyle of the Hours",
    "banner-wraith": "Banner Wraith",
    "fallen-sentinel": "Fallen Sentinel",
    "stone-warden": "Stone Warden",
    "ruined-king": "Fallen King",
    "golden-rat": "Golden Rat",
    "hollow-scarecrow": "Hollow Scarecrow",
    "lantern-moth": "Lantern Moth",
    "dusk-hare": "Dusk Hare",
    "lost-shepherd": "The Lost Shepherd",
    "lantern-queen": "Lantern Queen",
    ...BESTIARY_TEXT.en.monsters,
    ...BESTIARY_KEEP_TEXT.en.monsters
  },
  eraName: (era) => `Era ${roman(era + 1)}`,
  heroes: {
    aldric: { name: "Aldric", title: "The Adventurer", lore: "That's you. Every blow is your own. Every level, a lesson learned." },
    maelle: { name: "Maëlle", title: "Plains Huntress", lore: "She has tracked game across the plains since childhood and never misses twice." },
    brom: { name: "Brom", title: "Wandering Smith", lore: "His hammer mends blades in the morning and breaks skulls at night." },
    ysolde: { name: "Ysolde", title: "Sylvan Archer", lore: "The trees of the dark forest lend her their eyes." },
    cendre: { name: "Brother Cinder", title: "Ember Monk", lore: "He swore never to carry a weapon. His fists are enough." },
    nyx: { name: "Nyx", title: "Shadow Blade", lore: "No one has seen her face. Many have seen her daggers." },
    garrick: { name: "Garrick", title: "Rune Miner", lore: "He digs through the forgotten caves looking for shards of fallen stars." },
    seraphine: { name: "Séraphine", title: "Bramble Druid", lore: "She speaks to the roots, and the roots obey." },
    thorvald: { name: "Thorvald", title: "Stonebreaker", lore: "He felled a mountain on a bet. He lost the bet." },
    mirelle: { name: "Mirelle", title: "Marsh Alchemist", lore: "Her flasks bubble with things reason would rather not know." },
    kaelen: { name: "Kaelen", title: "Fallen Knight", lore: "Once the king's guard, he seeks redemption at the tip of his blade." },
    oriane: { name: "Oriane", title: "Echo Oracle", lore: "She hears what the caves said a thousand years ago." },
    vorn: { name: "Vorn", title: "Beastmaster", lore: "His pack counts three wolves, a boar and something unspeakable." },
    lysandre: { name: "Lysandre", title: "Archmage", lore: "He has read every grimoire. Twice. Backwards." },
    ashka: { name: "Ashka", title: "Ember Priestess", lore: "Wherever she prays, the ground smokes for days." },
    nameless: { name: "The Nameless", title: "Errant Knight", lore: "His armor is empty. Or so they say." },
    eldra: { name: "Eldra", title: "Timeweaver", lore: "She has seen how this adventure ends. She refuses to talk about it." },
    morgrath: { name: "Morgrath", title: "Lich Lord", lore: "An unlikely ally, he hates the Fallen King more than life itself." },
    celestine: { name: "Célestine", title: "Voice of the Crystals", lore: "The essences sing for her, and she sings back." },
    aurelion: { name: "Aurelion", title: "Dragon King", lore: "The last dragon has chosen a side. Yours." },
    awakened: { name: "The Awakened", title: "Hero of the Prophecy", lore: "You, perhaps. In another life." }
  },
  talents: {
    "aldric-10": "Firm Grip", "aldric-25": "Resonant Blade", "aldric-50": "Precise Strike", "aldric-75": "Heroic Blow",
    "aldric-100": "Echo of the Blade", "aldric-150": "Weapon Master", "aldric-200": "Living Legend",
    "maelle-10": "Barbed Arrows", "maelle-25": "Arcing Shot", "maelle-50": "Fresh Trail", "maelle-100": "Arrow Rain", "maelle-150": "Eye of the Plains",
    "brom-10": "Portable Anvil", "brom-25": "Oil Quench", "brom-50": "Whetstone", "brom-100": "Runic Steel", "brom-150": "Blazing Forge",
    "ysolde-10": "Shadowsilk String", "ysolde-25": "Double Nock", "ysolde-50": "Weak Spot", "ysolde-100": "Song of the Branches", "ysolde-150": "Dawn Arrow",
    "cendre-10": "Fire Palm", "cendre-25": "Hundred Fists", "cendre-50": "Meditation", "cendre-100": "Inner Breath", "cendre-150": "Burning Nirvana",
    "nyx-10": "Twin Daggers", "nyx-25": "Shadow Step", "nyx-50": "Assassination", "nyx-100": "Slow Poison", "nyx-150": "Eternal Night",
    "garrick-10": "Runic Pick", "garrick-25": "Blasting Charge", "garrick-50": "Golden Vein", "garrick-100": "Echo Lode", "garrick-150": "Heart of the Mountain",
    "seraphine-10": "Thorns", "seraphine-25": "Strangling Ivy", "seraphine-50": "Ancient Sap", "seraphine-100": "Bear Form", "seraphine-150": "Wrath of the Forest",
    "thorvald-10": "War Hammer", "thorvald-25": "Earthquake", "thorvald-50": "Giant's Stride", "thorvald-100": "Granite Skin", "thorvald-150": "Telluric Wrath",
    "mirelle-10": "Acid Flask", "mirelle-25": "Toxic Mist", "mirelle-50": "Transmutation", "mirelle-100": "Unstable Elixir", "mirelle-150": "Philosopher's Stone",
    "kaelen-10": "Royal Blade", "kaelen-25": "Heroic Charge", "kaelen-50": "Sentinel's Vigil", "kaelen-100": "Aura of Defiance", "kaelen-150": "Redemption",
    "oriane-10": "Vision", "oriane-25": "Echo of the Past", "oriane-50": "Foresight", "oriane-100": "Woven Fate", "oriane-150": "Voice of the Abyss",
    "vorn-10": "Bite", "vorn-25": "Howl", "vorn-50": "Pack Instinct", "vorn-100": "Wild Stampede", "vorn-150": "King of Beasts",
    "lysandre-10": "Arcane Missile", "lysandre-25": "Fireball", "lysandre-50": "Arcane Overload", "lysandre-100": "Mana Storm", "lysandre-150": "Singularity",
    "ashka-10": "Sacred Flame", "ashka-25": "Pyre", "ashka-50": "Offering", "ashka-100": "Phoenix", "ashka-150": "Inner Sun",
    "nameless-10": "Perfect Guard", "nameless-25": "Counterattack", "nameless-50": "Iron Will", "nameless-100": "Living Armor", "nameless-150": "Forgotten Legend",
    "eldra-10": "Slow", "eldra-25": "Haste", "eldra-50": "Time Loop", "eldra-100": "Paradox", "eldra-150": "End of Time",
    "morgrath-10": "Chilling Touch", "morgrath-25": "Army of the Dead", "morgrath-50": "Silent Legion", "morgrath-100": "Phylactery", "morgrath-150": "Endless Night",
    "celestine-10": "Prismatic Shard", "celestine-25": "Crystal Choir", "celestine-50": "Crystal Resonance", "celestine-100": "Harmony", "celestine-150": "Astral Symphony",
    "aurelion-10": "Burning Breath", "aurelion-25": "Golden Scales", "aurelion-50": "Dragon's Hoard", "aurelion-100": "Royal Flight", "aurelion-150": "Apocalypse",
    "awakened-10": "First Step", "awakened-25": "Destiny", "awakened-50": "Awakening", "awakened-100": "Transcendence", "awakened-150": "Infinity"
  },
  skills: {
    frenzy: { name: "Frenzy", description: "Aldric strikes on his own 10 times per second for 30 s." },
    rally: { name: "Rallying Cry", description: "Doubles the DPS of all companions for 30 s." },
    hawkeye: { name: "Hawkeye", description: "+50% critical hit chance for 30 s." },
    goldrain: { name: "Golden Rain", description: "Triples gold earned for 30 s." },
    ritual: { name: "Resonance Ritual", description: "+5% DPS until your next ascension. Stacks." },
    echo: { name: "Time Echo", description: "Resets the cooldown of the last power you used." },
    unweave: SYSTEMS_TEXT.en.unweave
  },
  altars: {
    might: { name: "Altar of Might", description: "Each level multiplies your DPS by 1.10." },
    blade: { name: "Altar of the Blade", description: "Each level multiplies your whole strike by 1.1, its share of your DPS included." },
    fortune: { name: "Altar of Fortune", description: "Each level multiplies your gold by 1.12." },
    patience: { name: "Altar of Patience", description: "Each level multiplies your companions' Patience bonus by 1.14. Your strikes stand in for it, blow for blow." },
    time: { name: "Altar of Time", description: "+1 s on the timer of elites and guardians per level." },
    fate: { name: "Altar of Fate", description: "+20% critical damage per level." },
    precision: { name: "Altar of Precision", description: "+1% critical hit chance per level." },
    treasure: { name: "Altar of Treasure", description: "+0.5% golden rat spawn chance per level." },
    bargain: { name: "Altar of Bargains", description: "-2% companion cost per level." },
    echoes: { name: "Altar of Echoes", description: "-5% power cooldowns per level." },
    harvest: { name: "Altar of Harvest", description: "+10% essences on ascension per level." },
    wanderer: { name: "Altar of the Wanderer", description: "At the start of each run, your companions clear 10 stages per level at once and bring back their gold, never more than half your record. These stages do not count toward ascension essences." },
    memory: { name: "Altar of Memory", description: "Start each ascension with the gold of 100 monsters from stage 5 × level." }
  },
  market: {
    chest: { name: "Relic Chest", description: "A random item at the level of your best stage." },
    "great-chest": { name: "Great Chest", description: "An epic item or better, with a higher chance of legendary." },
    rage: { name: "Rage Potion", description: "DPS ×2 for 10 min. Duration stacks." },
    fortune: { name: "Fortune Elixir", description: "Gold ×2 for 10 min. Duration stacks." },
    autoclick: { name: "Striking Scroll", description: "Your blade strikes on its own 5 times per second for 10 min." },
    hourglass: { name: "Golden Hourglass", description: "Instantly earn 1 h of gold at your current rate." }
  },
  achievementNames: {
    clicks: ["Steel in Hand", "Sore Wrist", "Ten Thousand Cuts", "Brom Sharpens It Again", "A Blade the Night Did Not Forge"],
    crits: ["True Strike", "Trained Eye", "Finding the Seam", "It Comes Apart"],
    kills: ["Clearing the Road", "A Thousand Unmade", "Scourge of Remnants", "They Come Back Anyway", "The Night Knows Your Step"],
    bosses: ["Giant Slayer", "Guardians Know Your Name", "Bane of Guardians", "They Wait for You"],
    gold: ["Small Purse", "Full Chest", "The Stallkeeper Nods", "Royal Treasury", "Old Coin, Older Debts", "More Than the Kingdom Minted", "Coin Weighs Nothing Now", "Coin of the Elder Kings", "Tithes of the Hallowed", "Gold That Fell from the Sky", "Spun Gold", "Sketched Coin", "A Word for Gold", "Heavy Eyes, Heavy Purse", "Coins Under the Pillow", "Unminted", "A Blank Coin", "Pip Stops Counting"],
    treasure: ["Hello, Pip", "Pip's Regular", "Pip Keeps Count"],
    crystal: ["A Falling Light", "Célestine Hums Along", "Glimmer Hunter", "The Sky Sings Back"],
    levels: ["Around the Fire", "Captain", "Sworn Company", "Friends of a Thousand Nights", "Legends of the Night"],
    hired: ["Small Band", "The Company", "A Long Table", "Every Seat Taken"],
    skills: ["Horn and Prayer", "Adept", "Lysandre Takes Notes"],
    legend: ["A Remembered Thing", "Brom Is Jealous"],
    mythic: ["More Real Than the Night"],
    hit: ["Solid Blow", "Titanic Blow", "The Stars Flinch", "A Blow Older Than the World"],
    time: ["An Hour Already", "The Lantern Stays Lit", "The Road Knows You"],
    fails: ["The Night Pushes Back", "Stubborn as a King"],
    ...SYSTEMS_TEXT.en.achievementNames
  },
  achievementCategories: {
    progression: "Progression",
    combat: "Combat",
    wealth: "Wealth",
    companions: "Companions",
    ascension: "Ascension",
    secrets: "Secrets"
  },
  achievementDescriptions: {
    stage: (t) => `Reach stage ${t}.`,
    clicks: (t) => `Strike ${n(t)} times.`,
    crits: (t) => `Land ${n(t)} critical hits.`,
    kills: (t) => `Defeat ${n(t)} monsters.`,
    bosses: (t) => `Defeat ${n(t)} ${s(t, "elite or guardian", "elites and guardians")}.`,
    gold: (t) => `Earn ${exp(t)} gold in total.`,
    treasure: (t) => `Defeat ${n(t)} golden ${s(t, "rat")}.`,
    crystal: (t) => `Catch ${n(t)} wandering ${s(t, "crystal")}.`,
    levels: (t) => `Reach ${n(t)} total companion levels.`,
    // The threshold counts Aldric (the walker), who is not a companion.
    hired: (t) => `Hire ${t - 1} different companions.`,
    skills: (t) => `Use ${n(t)} powers.`,
    ascend: (t) => `Ascend ${t} ${s(t, "time")}.`,
    essences: (t) => `Collect ${n(t)} essences in total.`,
    legend: (t) => `Find ${t} legendary ${s(t, "item")}.`,
    mythic: (t) => `Find ${t} mythic ${s(t, "item")}.`,
    hit: (t) => `Deal a single hit of ${exp(t)} damage.`,
    time: (t) => `Walk the night for ${Math.round(t / 3600)} h in total.`,
    fails: (t) => `Be pushed back by an elite or a guardian ${t} ${s(t, "time")}.`,
    ...SYSTEMS_TEXT.en.achievementDescriptions
  },
  slots: { weapon: "Weapon", armor: "Armor", amulet: "Amulet", ring: "Ring" },
  rarities: { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary", mythic: "Mythic" },
  affixes: {
    dps: "DPS",
    click: "Strike damage",
    gold: "Gold",
    critChance: "Critical chance",
    critDamage: "Critical damage",
    bossDamage: "Damage to elites and guardians",
    essence: "Ascension essences"
  },
  itemBases: {
    weapon: [
      { noun: "Blade", gender: "m" }, { noun: "Axe", gender: "m" }, { noun: "Sword", gender: "m" }, { noun: "Hammer", gender: "m" },
      { noun: "Bow", gender: "m" }, { noun: "Spear", gender: "m" }, { noun: "Scythe", gender: "m" }
    ],
    armor: [
      { noun: "Cuirass", gender: "m" }, { noun: "Hauberk", gender: "m" }, { noun: "Cloak", gender: "m" }, { noun: "Plate", gender: "m" },
      { noun: "Brigandine", gender: "m" }
    ],
    amulet: [{ noun: "Amulet", gender: "m" }, { noun: "Talisman", gender: "m" }, { noun: "Pendant", gender: "m" }, { noun: "Medallion", gender: "m" }],
    ring: [{ noun: "Ring", gender: "m" }, { noun: "Seal", gender: "m" }, { noun: "Signet", gender: "m" }, { noun: "Band", gender: "m" }]
  },
  itemName: ({ noun, rarity, biome }) => [RARITY_ADJECTIVE[rarity], noun, BIOME_SUFFIX[biome]].filter(Boolean).join(" "),

  openingLine: "Dusk again.",
  bestiary: {
    "field-rat": [
      "Every rat that ever stole grain from Orvane, remembered as one very determined rat.",
      "It always flees to the left. The Ledger has checked: the granary stood on the left.",
      "Unmade a thousand times. It still stops to sniff the spot where the grain cart tipped over."
    ],
    "wild-boar": [
      "Nervous because it has been killed before. It remembers, a little.",
      "It flinches before the blow lands now. Once, it flinched at exactly the right moment.",
      "It has stopped charging. It stands in the road and waits for you, like a chore."
    ],
    "carrion-crow": [
      "It gleans what the harvest left. The harvest left everything.",
      "It keeps the scarecrow company. They have agreed never to discuss the scarecrow's job.",
      "Its nest, in the windmill, is lined with buttons. Every one is from the same coat."
    ],
    "hollow-scarecrow": [
      "Stuffed with the last harvest. It guards fields no one will reap.",
      "Its head turns to follow the walker. It turned the same way for the one before.",
      "Under the straw, a child's ribbon, knotted twice. This field belonged to someone."
    ],
    "lantern-moth": [
      "Drawn to the walker's light. Everything in the night is.",
      "It dies facing the brightest thing in sight. Lately, that has been you.",
      "The moths have a queen. On storm nights, she comes down to count them."
    ],
    "dusk-hare": [
      "It is always running toward dusk. It never arrives.",
      "Once a night it stops, ears up, and listens to the east. Then it runs again.",
      "Maëlle has never shot one. She says a hare that fast deserves to get somewhere."
    ],
    "last-reaper": [
      "It came to bring in the last harvest. It is waiting for first light to begin.",
      "It whets its scythe every night. The edge is thinner than a shadow now.",
      "Once it asked Maëlle the hour. She did not know. Nobody has known for a very long time."
    ],
    "moss-alpha": [
      "Maëlle's oldest enemy. It lets her win. It always has.",
      "Moss grows on it because it has not moved in a very long time, except to die.",
      "Its left tusk is missing. Maëlle's horn is carved from a tusk. Neither will say more."
    ],
    "lost-shepherd": [
      "Counts his sheep every night. The number goes up.",
      "He has no sheep. He counts the walkers who pass, and gives them the names of lambs.",
      "He once asked the Ledger for his own number. The Ledger did not answer. It was too large."
    ],
    "golden-rat": [
      "The same in every stratum. The only one.",
      "It is never where the others were. It is always where you are looking.",
      "The Ledger keeps a single entry for Pip. It is in Pip's handwriting."
    ],
    "lantern-queen": [
      "Queen of the moths. Where she passes, the crystals fall faster, as if shaken from a branch.",
      "She never lands. The Ledger has never recorded where she rests, or whether.",
      "Her wings are made of every lamp that was ever left burning for someone."
    ],
    ...BESTIARY_TEXT.en.lines,
    ...BESTIARY_KEEP_TEXT.en.lines
  },
  bestiaryPages: BESTIARY_TEXT.en.pages,
  echoes: {
    "green-plains": [
      { by: "Maëlle", text: "The wheat is still standing. Nobody has come to cut it for longer than I have been alive. Or I have been alive a long time." },
      { by: "Brom", text: "My forge stands at the crossroads. Every night, the fire is already lit when I get there." },
      { by: "The Ledger", text: "The windmill turns with no wind. It is grinding the same sack of flour it started on." },
      { by: "A scarecrow", text: "You walk too loud. The last one walked softer. The one before, softer still." },
      { by: "Maëlle", text: "I cut a notch in the fence post every night. The post is full. Someone has started on a second one." },
      { by: "The Ledger", text: "In the farmhouse by the road, the table is laid for four. The soup is warm. The chairs are dusty." },
      { by: "A field rat", text: "Grain. Grain. Grain. Then the walker. Then grain." },
      { by: "Brom", text: "The King ordered a hammer from me, once. I am still working on it. Kings can wait." },
      { by: "The Ledger", text: "The King's surveyors set the milestone stones. Each one lights when the road is cleared. None has ever stayed lit." },
      { by: "The Ledger", text: "Before you came, the old boar lay down in the wheat and waited, the way a dog waits by a door." },
      { by: "Maëlle", text: "The harvest festival was the next day. I had a ribbon. I think I had a ribbon." },
      { by: "The Ledger", text: "In the Hearthfields, dusk lasts a little longer than anywhere else. As if the fields were asking for one more hour." }
    ],
    ...PLACES_TEXT.en.echoes
  },
  wanderers: {
    "lost-shepherd": { by: "The Lost Shepherd", text: "Ninety-eight. Ninety-nine. A hundred. You. I counted you last night too." },
    ...PLACES_TEXT.en.wanderers
  },
  memories: {
    maelle: [
      { by: "Maëlle", text: "Maëlle squints at you over her bow. \"Have we met? You have a face I keep almost remembering.\"" },
      { by: "Maëlle", text: "She calls you by your name before you give it. Then she frowns, as if the word had walked in on its own." },
      { by: "Maëlle", text: "She shows you the fence post by the road, covered in notches. \"Some of these are in my hand. I don't remember making them.\"" },
      { by: "Maëlle", text: "When you reach the fire, a place is already kept for you, and a bowl, still warm. She does not look up." },
      { by: "Maëlle", text: "\"Don't tell me. I'd rather meet you again. I like that part.\"" }
    ],
    brom: [
      { by: "Brom", text: "He turns your relic over in his hands. \"This is my work. I'd know my own folds anywhere. When did I make this?\"" },
      { by: "Brom", text: "\"Who taught you to hold a hammer like that? That's my grip. Nobody has my grip.\"" },
      { by: "Brom", text: "At the back of the forge, a hammer with no handle, its head still glowing. \"For the King. He asked. I'll finish it.\"" },
      { by: "Brom", text: "He strikes a new mark into his anvil, beside his own: yours. \"So the metal knows you, next time.\"" },
      { by: "Brom", text: "He sets the hammer in your hands, finished at last. \"He stopped needing it. You still walk. It's yours.\"" }
    ],
    ...COMPANY_TEXT.en.memories,
    ...COMPANY_LATE_TEXT.en.memories
  },
  hireLines: {
    maelle: [
      "You look like someone who needs a bow and a friend. I'm both.",
      "You again? No. I'd remember. Wouldn't I?",
      "There you are. I kept your seat."
    ],
    brom: [
      "Bring it back in one piece. Or in several. I'm not fussy.",
      "Your edge is dull in the same place as last time. What last time?",
      "The fire's lit. Put your blade on the anvil."
    ],
    ...COMPANY_TEXT.en.hireLines,
    ...COMPANY_LATE_TEXT.en.hireLines
  },
  promises: PROMISES_TEXT.en,
  relics: SYSTEMS_TEXT.en.relics,
  namedEffects: SYSTEMS_TEXT.en.namedEffects,
  secrets: SYSTEMS_TEXT.en.secrets,
  events: SYSTEMS_TEXT.en.events,

  strata: STRATA_TEXT.en,
  voices: VOICES_TEXT.en,
  ageEchoes: AGE_ECHOES_TEXT.en,
  places: PLACES_TEXT.en.places,
  lessons: COMPANY_LATE_TEXT.en.lessons,
  altarLegends: SYSTEMS_TEXT.en.altarLegends,
  weaves: SYSTEMS_TEXT.en.weaves,
  caravan: SYSTEMS_TEXT.en.caravan,
  crown: SYSTEMS_TEXT.en.crown,
  cutscenes: CUTSCENES_TEXT.en,
  speakers: { king: "The King", stallkeeper: "The Stallkeeper", ledger: "The Ledger" }
};
