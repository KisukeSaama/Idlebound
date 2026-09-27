import type { GameText } from "./types";

const n = (value: number) => value.toLocaleString("en-US");
const exp = (value: number) => value.toExponential(0).replace("e+", "e");
const s = (count: number, word: string, plural = `${word}s`) => (count > 1 ? plural : word);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const RARITY_ADJECTIVE = { common: "", rare: "Fine", epic: "Enchanted", legendary: "Legendary", mythic: "Mythic" } as const;

const BIOME_SUFFIX = ["of the Plains", "of the Grove", "of the Depths", "of the Mire", "of the Crown"] as const;

export const en: GameText = {
  biomes: {
    "green-plains": { name: "Verdant Plains", description: "Peaceful hills where every adventurer earns their first stripes." },
    "dark-forest": { name: "Dark Forest", description: "A dense wood where the shadows are hungry and the brambles whisper." },
    "forgotten-caves": { name: "Forgotten Caves", description: "Frozen tunnels where every echo seems alive." },
    "corrupted-marsh": { name: "Corrupted Marsh", description: "A toxic mire that swallows roads and the reckless alike." },
    "fallen-king-ruins": { name: "Fallen King's Ruins", description: "The last walls of a cursed kingdom still hum with magic." }
  },
  monsters: {
    "field-rat": "Field Rat",
    "wild-boar": "Jumpy Boar",
    "rabid-rat": "Rabid Rat",
    "tusk-king": "Greattusk",
    "moss-alpha": "Moss Alpha",
    "shade-wolf": "Shade Wolf",
    "briar-witch": "Briar Witch",
    "blight-boar": "Blighted Boar",
    "briar-matron": "Briar Matron",
    "old-grove": "Heart of the Old Grove",
    "blind-crawler": "Blind Crawler",
    "echo-bat": "Echo Bat",
    "deep-wolf": "Deep Wolf",
    "howling-swarm": "Howling Swarm",
    "stone-devourer": "Stone Devourer",
    "bog-remnant": "Bog Remnant",
    "putrid-crawler": "Putrid Crawler",
    "marsh-hag": "Marsh Hag",
    "bog-colossus": "Mire Colossus",
    "rot-baron": "Baron of Rot",
    "royal-hound": "Spectral Hound",
    "crown-bat": "Crown Bat",
    "fallen-sentinel": "Fallen Sentinel",
    "stone-warden": "Stone Warden",
    "ruined-king": "Fallen King",
    "golden-rat": "Golden Rat"
  },
  eraTags: ["", "Echo", "Ash", "Void", "Astral", "Primordial"],
  eraName: (era) => `Era ${ROMAN[era] ?? era + 1}`,
  heroes: {
    aldric: { name: "Aldric", title: "The Adventurer", lore: "That's you. Every click is a sword stroke. Every level, a lesson learned." },
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
    echo: { name: "Time Echo", description: "Resets the cooldown of the last power you used." }
  },
  altars: {
    might: { name: "Altar of Might", description: "+25% DPS per level." },
    blade: { name: "Altar of the Blade", description: "+25% click damage per level, and +5% on the DPS share of your clicks (up to +50%)." },
    fortune: { name: "Altar of Fortune", description: "+15% gold per level." },
    patience: { name: "Altar of Patience", description: "+40% DPS per level while you don't click. The bonus comes back within 30s of a click." },
    time: { name: "Altar of Time", description: "+1 s on the boss timer per level." },
    fate: { name: "Altar of Fate", description: "+20% critical damage per level." },
    precision: { name: "Altar of Precision", description: "+1% critical hit chance per level." },
    treasure: { name: "Altar of Treasure", description: "+0.5% golden rat spawn chance per level." },
    bargain: { name: "Altar of Bargains", description: "-2% companion cost per level." },
    echoes: { name: "Altar of Echoes", description: "-5% power cooldowns per level." },
    harvest: { name: "Altar of Harvest", description: "+10% essences on ascension per level." },
    wanderer: { name: "Altar of the Wanderer", description: "+10% offline efficiency and +1 h offline cap per level." },
    memory: { name: "Altar of Memory", description: "Start each ascension with the gold of 100 monsters from stage 5 × level." }
  },
  market: {
    chest: { name: "Relic Chest", description: "A random item at the level of your best stage." },
    "great-chest": { name: "Great Chest", description: "An epic item or better, with a higher chance of legendary." },
    rage: { name: "Rage Potion", description: "DPS ×2 for 10 min. Duration stacks." },
    fortune: { name: "Fortune Elixir", description: "Gold ×2 for 10 min. Duration stacks." },
    autoclick: { name: "Striking Scroll", description: "5 automatic clicks per second for 10 min." },
    hourglass: { name: "Golden Hourglass", description: "Instantly earn 1 h of gold at your current rate." }
  },
  achievementNames: {
    stage: ["First Steps", "Scout", "Regicide", "Beyond the Ruins", "Centurion", "Era Walker", "Legend", "Myth", "Deity"],
    clicks: ["Nimble Finger", "Budding Tendinitis", "Machine Gun", "Click Maniac", "God of Clicks"],
    crits: ["Lucky Strike", "Trained Eye", "Vital Point", "Executioner"],
    kills: ["Hunter", "Slayer", "Scourge", "Extinction", "Walking Apocalypse"],
    bosses: ["Giant Slayer", "Crown Breaker", "Bane of Lords", "You Are the Boss"],
    gold: ["Small Purse", "Full Chest", "Prosperous Merchant", "Royal Treasury", "Banker of the Gods", "Infinite Gold", "Beyond Wealth"],
    treasure: ["Shiny!", "Treasure Hunter", "Rat King"],
    crystal: ["Crystal Caught", "Collector", "Glimmer Hunter", "Crystal Master"],
    levels: ["Recruiter", "Captain", "General", "Marshal", "Emperor"],
    hired: ["Small Band", "Company", "Legion", "All for One"],
    skills: ["Apprentice", "Adept", "Archmage"],
    ascend: ["Rebirth", "Cycle", "Eternal Return", "Samsara", "Beyond the Cycle"],
    essences: ["First Glimmer", "Reservoir", "Wellspring", "Ocean of Essence", "Primordial Crystal"],
    legend: ["Relic", "Legendary Armory"],
    mythic: ["Impossible!"],
    hit: ["Solid Hit", "Titanic Hit", "Cosmic Hit", "Big Bang"],
    time: ["An Hour Already", "Devoted", "Veteran"],
    fails: ["Back to Square One", "Persistent"]
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
    clicks: (t) => `Click ${n(t)} times.`,
    crits: (t) => `Land ${n(t)} critical hits.`,
    kills: (t) => `Defeat ${n(t)} monsters.`,
    bosses: (t) => `Defeat ${n(t)} ${s(t, "boss", "bosses")}.`,
    gold: (t) => `Earn ${exp(t)} gold in total.`,
    treasure: (t) => `Defeat ${n(t)} golden ${s(t, "rat")}.`,
    crystal: (t) => `Catch ${n(t)} wandering ${s(t, "crystal")}.`,
    levels: (t) => `Reach ${n(t)} total companion levels.`,
    hired: (t) => `Hire ${t} different companions.`,
    skills: (t) => `Use ${n(t)} powers.`,
    ascend: (t) => `Ascend ${t} ${s(t, "time")}.`,
    essences: (t) => `Collect ${n(t)} essences in total.`,
    legend: (t) => `Find ${t} legendary ${s(t, "item")}.`,
    mythic: (t) => `Find ${t} mythic ${s(t, "item")}.`,
    hit: (t) => `Deal a single hit of ${exp(t)} damage.`,
    time: (t) => `Play ${Math.round(t / 3600)} h in total.`,
    fails: (t) => `Fail against a boss ${t} ${s(t, "time")}.`
  },
  slots: { weapon: "Weapon", armor: "Armor", amulet: "Amulet", ring: "Ring" },
  rarities: { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary", mythic: "Mythic" },
  affixes: {
    dps: "DPS",
    click: "Click damage",
    gold: "Gold",
    critChance: "Critical chance",
    critDamage: "Critical damage",
    bossDamage: "Boss damage",
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
  itemName: ({ noun, rarity, biome }) => [RARITY_ADJECTIVE[rarity], noun, BIOME_SUFFIX[biome]].filter(Boolean).join(" ")
};
