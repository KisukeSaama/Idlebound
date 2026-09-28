import type { Locale } from "../../i18n";
import { CARAVAN_BUFF_SECONDS } from "../../data/caravan";
import { QUIET_SECONDS, SEAM_SECONDS, WAGER_CLICKS, WAGER_SECONDS, WALKER_SECONDS } from "../../data/events";
import { COOLDOWN_FLOOR, GROVE_SEED_MAX, MIRELLE_BARON_DAMAGE } from "../../data/relics";
import type { SystemsText } from "../types";

/** A fraction as a whole percentage (0.25 → 25). */
const p = (value: number) => Math.round(value * 100);
const nEn = (value: number) => value.toLocaleString("en-US");
const nFr = (value: number) => value.toLocaleString("fr-FR");
const sEn = (count: number, word: string, plural = `${word}s`) => (count > 1 ? plural : word);
const sFr = (count: number, word: string) => (count > 1 ? `${word}s` : word);
const BUFF_MINUTES = CARAVAN_BUFF_SECONDS / 60;
const COOLDOWN_CAP = p(1 - COOLDOWN_FLOOR);

const en: SystemsText = {
  relics: {
    oathcutter: { name: "Oathcutter", legend: "Kaelen broke it on the throne steps the night he ran. It has been trying to get back up the stairs ever since." },
    "thousandth-arrow": { name: "The Thousandth Arrow", legend: "Maëlle fletched it the night she lost count of the nights. It has never missed, which bothers her." },
    quietus: { name: "Quietus", legend: "A scythe that has never been swung. Morgrath says it will be, once." },
    "unfinished-hammer": { name: "The Unfinished Hammer", legend: "Forged every night for a king who stopped needing it. Finished, at last, for you." },
    "splinter-of-sky": { name: "Splinter of the Sky", legend: "A blade cut from the Sky-Glass. Look along its edge and you see a room with a lamp in it." },
    dawnbreak: { name: "Dawnbreak", legend: "It is warm to the touch, like a window in the morning." },
    "hollow-plate": { name: "The Hollow Plate", legend: "It walked here on its own. It will leave the same way, once you are done with it." },
    mosshide: { name: "Mosshide", legend: "The Alpha's winter coat. Still warm. Still growing moss." },
    "briar-mantle": { name: "Briar Mantle", legend: "Woven by the mother-tree for Séraphine's first winter. It remembers being a gift." },
    "aurelion-scales": { name: "Scales of Aurelion", legend: "Shed in the Wyrm stratum, a thousand worlds ago. He would like them back eventually." },
    "ash-vestment": { name: "Vestment of Cinders", legend: "Worn by the first Ember Monk, who walked into the Pyre's fire to carry out one flame." },
    "mantle-of-the-last-court": { name: "Mantle of the Last Court", legend: "Purple once. The color went somewhere. So did the court." },
    "eldra-locket": { name: "Eldra's Locket", legend: "An hourglass the size of a tear. The sand falls up." },
    "singing-stone": { name: "The Singing Stone", legend: "It hums whenever someone looks at it. It hums a lot around you." },
    "oriane-ear": { name: "Oriane's Ear", legend: "A shell of pale stone. Hold it to your ear and hear tomorrow, faintly." },
    "grove-seed": { name: "Seed of the Old Grove", legend: "The mother-tree's last seed. It will not grow in the night. It is waiting." },
    phylactery: { name: "Morgrath's Phylactery", legend: "He keeps his life in it. He says it's the safest place, because nobody wants it." },
    "last-decree": { name: "The Last Decree", legend: "A sealed scroll. The seal is intact. The King asked that it never be read." },
    "signet-of-orvane": { name: "Signet of Orvane", legend: "The King's seal. It stamps a crown, and under it a letter so worn you can only guess it is an A." },
    "rat-ring": { name: "The Rat's Ring", legend: "Gold, tiny, bitten. Pip dropped it on purpose. Pip does everything on purpose." },
    "lodestone-band": { name: "Garrick's Lodestone", legend: "The shard he buried, set in a ring. The reflection in it has closed its eyes." },
    "mirelle-ring": { name: "Mirelle's Wedding Ring", legend: "Engraved inside: O. and M., and a date that has happened ten thousand times." },
    "stallkeeper-band": { name: "The Stallkeeper's Token", legend: "A brass token with a hole in it. The Stallkeeper said: you'll know when to give it back." },
    "second-morning": { name: "Ring of the Second Morning", legend: "Two suns engraved on the band. One of them has been scratched out." }
  },
  namedEffects: {
    critChance: (pct) => `+${Math.round(pct * 100)}% critical chance (within the relics' cap)`,
    guardianGold: (pct) => `+${Math.round(pct * 100)}% gold from biome guardians`,
    forgeDiscount: (pct) => `Forging costs ${Math.round(pct * 100)}% fewer shards`,
    kingDamage: (pct) => `+${p(pct)}% damage to the King`,
    idleRamp: (pct) => `Patience bonus full ${pct} s after an attack instead of 30 s`,
    guardianShards: (pct) => `+${pct} ${sEn(pct, "shard")} on every guardian kill`,
    seamDps: (pct) => `+${p(pct)}% DPS while a Seam is open`,
    bossTimer: (pct) => `+${pct} s on the boss timer`,
    idleBonus: (pct) => `+${p(pct)}% Patience bonus`,
    bossDamage: (pct) => `+${p(pct)}% damage to elites and guardians`,
    rainSeconds: (pct) => `Golden Rain lasts ${pct} s`,
    cooldown: (pct) => `-${p(pct)}% power cooldowns (with the Altar of Echoes, at most -${COOLDOWN_CAP}%)`,
    crystalStay: (pct) => `Wandering crystals stay ${pct} s instead of 13 s`,
    fragments: (pct) => `+${p(pct)}% fragment chance from guardians`,
    clickPerRemembered: (pct) => `+${p(pct)}% click damage per companion who fully remembers you (at most +${p(GROVE_SEED_MAX)}%)`,
    phylactery: (pct) => `+${p(pct)}% Patience bonus, -${p(pct)}% click damage`,
    treasure: (pct) => `+${p(pct)}% golden rat chance (within its cap)`,
    crystalSooner: (pct) => `Wandering crystals come ${p(pct)}% sooner`,
    mirelle: (pct) => `+${p(pct)}% gold, +${p(MIRELLE_BARON_DAMAGE)}% damage to the Baron of Rot`,
    marketDiscount: (pct) => `-${p(pct)}% shard prices at the stall and the Caravan`,
    wandererStages: (pct) => `The Altar of the Wanderer clears ${pct} more stages (within its caps)`,
    regalia: () => "Regalia of Orvane: wear all three"
  },
  altarLegends: {
    might: { by: "The Anvil", text: "Built by a walker who forgot every face they loved and kept only the weight of their fists." },
    blade: { by: "The Sword-Mother", text: "Her last lesson: a blade is a question you ask the world, very fast." },
    fortune: { by: "Unknown", text: "The stone is warm. There are tiny teeth marks on the base." },
    patience: { by: "The Silent Legion", text: "Carved without a single tool. The dead are patient, and they had time." },
    time: { by: "Eldra", text: "She says she did not build it. She says it built itself, later." },
    fate: { by: "Oriane's mother", text: "Five notches, no more. Fate allows itself to be pushed only so far." },
    precision: { by: "Ysolde's grandfather", text: "An arrowhead set into the stone, pointing at nothing you can see." },
    treasure: { by: "Thorvald", text: "Inscription: FOR PIP. WE ARE EVEN NOW. Someone has scratched out EVEN." },
    bargain: { by: "The Stallkeeper", text: "Companions charge less to walkers they almost remember." },
    echoes: { by: "Oriane", text: "Speak near it and it answers a moment early." },
    harvest: { by: "The first Ember Monk", text: "Every essence has a husk. This altar keeps the husks and gives you the seeds." },
    wanderer: { by: "The Nameless, before", text: "Companions walk the first road without you. Their feet remember what their heads do not." },
    memory: { by: "Unknown", text: "Buried at its foot, a purse of coin, every night. You do not remember burying it. You always do." }
  },
  secrets: {
    "let-him-rest": {
      name: "Let Him Rest",
      riddle: "Sometimes the kindest blow is none.",
      line: { by: "The King", text: "You could stay. I did." }
    },
    even: {
      name: "Even",
      riddle: "A debt, a rat, a mountain.",
      line: { by: "Thorvald", text: "Tell him we're even." }
    },
    faceless: {
      name: "Faceless",
      riddle: "Knock on the shadow's door.",
      line: { by: "The Ledger", text: "For a moment, Nyx's portrait was full of stars. Then the hood again, and nothing under it." }
    },
    "small-change": {
      name: "Small Change",
      riddle: "Break a star for coins.",
      line: { by: "Lysandre", text: "You broke a star to make change." }
    },
    "night-owl": {
      name: "Night Owl",
      riddle: "Walk when the real night is darkest.",
      line: { by: "The Ledger", text: "Someone crossed the Hearthfields at the darkest hour. The moon came out to see who." }
    },
    "thousandth-notch": {
      name: "The Thousandth Notch",
      riddle: "Count with the huntress.",
      line: { by: "The Ledger", text: "Maëlle's fence post: a thousand notches, in her hand and another's. The last one is fresh. The knife is yours." }
    },
    "same-road": {
      name: "Same Road",
      riddle: "Walk the same night three times.",
      line: { by: "Oriane", text: "Even the echo is bored." }
    },
    "keep-some": {
      name: "Keep Some",
      riddle: "Arrive at dusk with your pockets full.",
      line: { by: "The Nameless", text: "Good. Keep it." }
    },
    "how-it-starts": {
      name: "That's How It Starts",
      riddle: "Arrive at dusk with nothing.",
      line: { by: "The Nameless", text: "That's how it starts." }
    },
    "empty-hands": {
      name: "Empty Hands",
      riddle: "Meet the King with nothing but the sword.",
      line: { by: "Kaelen", text: "He'd have liked that." }
    },
    pacifist: {
      name: "Pacifist",
      riddle: "Let the one who swore off weapons lead.",
      line: { by: "Brother Cinder", text: "I didn't hit anyone. I just stood very firmly in their way." }
    },
    "last-second": {
      name: "The Last Second",
      riddle: "Seven times, just in time.",
      line: { by: "The Ledger", text: "A claw of the Gargoyle of the Hours lies on the Keep steps. The clock it kept runs half a second late now." }
    },
    listening: {
      name: "Listening",
      riddle: "Be still where the echoes live.",
      line: { by: "Oriane", text: "The bats stop. Now you hear it too: the night, saying itself again, very softly." }
    },
    "good-boy": {
      name: "Good Boy",
      riddle: "Earn the trust of the unspeakable.",
      line: { by: "The Ledger", text: "The Ledger keeps a page for Biscuit. It is blank but for one paw print. Nothing else will stay on it." }
    },
    "till-death": {
      name: "Till Death",
      riddle: "Bring the ring to the mire.",
      line: { by: "The Baron of Rot", text: "M.?" }
    },
    "last-blow": {
      name: "The Last Blow",
      riddle: "Let the knight finish what he ran from.",
      line: { by: "Kaelen", text: "I climbed the stairs at last. He looked up and said: you're late. He was smiling." }
    },
    "it-wears-you": {
      name: "It Wears You",
      riddle: "Reach for the fifth slot.",
      line: { by: "The Ledger", text: "The Crown's legend is two words long. The Nameless wrote them in the dust, slowly, like someone learning letters again." }
    },
    "behind-the-glass": {
      name: "Behind the Glass",
      riddle: "In the room with the lamp, look out the window.",
      line: { by: "The Ledger", text: "The window in the Keep holds a reflection. You blinked. So did it, a little after." }
    },
    "two-tongues": {
      name: "Two Tongues",
      riddle: "Hear the night in both its voices.",
      line: { by: "Lysandre", text: "Obviously. Évidemment." }
    },
    "welcome-back": {
      name: "Welcome Back",
      riddle: "Be gone a long while. Come back.",
      line: { by: "The Stallkeeper", text: "We kept your lantern lit." }
    }
  },
  events: {
    storm: {
      name: "Crystal Storm",
      text: "The Lantern Queen crosses the sky. Catch the light!",
      line: { by: "The Ledger", text: "Something looked at the world very hard. The moths rose to meet it, and their queen with them." }
    },
    seam: {
      name: "The Seam",
      text: `A Seam opens. Beat its Warden in ${SEAM_SECONDS} s.`,
      line: { by: "The Ledger", text: "A crack in the night, thin as a hair, and something pale behind it. The walker leaned on it until it closed." }
    },
    wager: {
      name: "Pip's Wager",
      text: `Pip stops and stares. Strike ${WAGER_CLICKS} times in ${WAGER_SECONDS} s!`,
      line: { by: "Thorvald", text: "He bet me a mountain once. I'm paying it back one rat at a time. Don't tell him I said rat." }
    },
    walker: {
      name: "Echo of a Walker",
      text: `Another walker's echo fights beside you for ${WALKER_SECONDS} s.`,
      line: { by: "The Ledger", text: "Two strands touched. For thirty seconds the Ledger had to write two names on one line." }
    },
    caravan: {
      name: "The Caravan",
      text: "The Caravan is in. The Stallkeeper has one ware this week.",
      line: { by: "The Stallkeeper", text: "There is a road between nights too. Nobody walks it but me, so the prices are fair." }
    },
    quiet: {
      name: "The Quiet",
      text: `Everything goes quiet. Beat it in ${QUIET_SECONDS} s.`,
      line: { by: "The Ledger", text: "No color, no sound, no weight. When it came apart, the grass where it stood had turned white." }
    },
    stray: {
      name: "Stray Armor",
      text: "An empty armor walks the road. Bring it down.",
      line: { by: "The Nameless", text: "Mine. Maybe." }
    },
    eclipse: {
      name: "The King's Eclipse",
      text: "The King rises in shadow, heavier. Same time to beat him.",
      line: { by: "The King", text: "I had a sword like yours. I walked this road once, the other way." }
    },
    tide: {
      name: "The Slow Tide",
      text: "The night comes back to you slowly. A crystal is on its way.",
      line: { by: "The Ledger", text: "The walker came back from far away. For a while the light was slow, like water finding its level." }
    },
    remembrance: {
      name: "Remembrance Night",
      text: "Lanterns all along the road tonight. Fragments surface twice as often.",
      line: { by: "The Ledger", text: "Lanterns on every milestone, lit by nobody. The night keeps a feast for itself, and sets a place for you." }
    },
    migration: {
      name: "The Migration",
      text: "Remnants from another land cross this stretch of road.",
      line: { by: "The Ledger", text: "A Rot Toad in the wheat, looking for water it remembers. It found none. It is still looking." }
    },
    unfinished: {
      name: "The Unfinished",
      text: "A Remnant comes half drawn. Strike it and it fills in.",
      line: { by: "The Ledger", text: "It came in outline only, one eye missing. Each blow filled in a little more, as if someone were checking." }
    }
  },
  achievementNames: {
    stage: ["First Steps", "Scout", "Regicide", "Beyond the Ruins", "Centurion", "Era Walker", "Legend", "Myth", "Deity", "Thousand Nights", "Deep Dreamer", "Not Yet"],
    ascend: ["Rebirth", "Cycle", "Eternal Return", "Samsara", "Beyond the Cycle", "Night After Night", "Keeper of the Long Night"],
    essences: ["First Glimmer", "Reservoir", "Wellspring", "Ocean of Essence", "Primordial Crystal", "Constellation", "Galaxy of Memory"],
    strata: ["Hallowed Ground", "Among the Threads", "Speaker of Names", "Behind the Glass", "The Blank Page", "Almost Morning"],
    kings: ["Long Live the King", "Kingbreaker", "A Hundred Coronations", "The Crown Is Heavy"],
    seams: ["First Stitch", "Seamwarden", "The Night Holds"],
    recognition: ["Familiar Face", "Old Friends", "Company of Memories", "They All Remember"],
    descents: ["Rewoven", "Deeper Night", "Loom-Bound", "Night Without Floor"],
    bestiary: ["Naturalist", "Field Notes", "Book of Remnants", "Every Nightmare Named"],
    fragments: ["Whisper", "Listener", "Archivist", "Keeper of the Chronicle", "The Night Remembers"],
    named: ["A Name in Steel", "Collector of Legends", "Hall of Relics", "Every Legend Kept"]
  },
  achievementDescriptions: {
    strata: (t) => `Reach stratum ${t}.`,
    kings: (t) => (t === 1 ? "Defeat the King." : `Defeat the King ${nEn(t)} times.`),
    seams: (t) => (t === 1 ? "Close a Seam." : `Close ${nEn(t)} Seams.`),
    recognition: (t) => `Be fully remembered by ${t} ${sEn(t, "companion")}.`,
    descents: (t) => (t === 1 ? "Descend once." : `Descend ${t} times.`),
    bestiary: (t) => `Meet ${nEn(t)} creatures.`,
    fragments: (t) => `Find ${nEn(t)} fragments.`,
    named: (t) => (t === 1 ? "Find a named relic." : `Find ${t} named relics.`)
  },
  weaves: {
    plenty: { name: "Warp of Plenty", description: "Essences ×1.25 per level (multiplies)." },
    "dusk-knot": { name: "Knot of Dusk", description: "The Altar of the Wanderer's cap rises by 10 levels per level. Up to 5." },
    "long-thread": { name: "The Long Thread", description: "Background progress is capped 1 h higher per level. Up to 4." },
    "humming-loom": { name: "Humming Loom", description: "Wandering crystals come 10% sooner per level. Up to 5." },
    kinship: { name: "Kinship", description: "Every tier of Recognition asks one run less per level. Up to 3." },
    "remembered-stones": { name: "Remembered Stones", description: "5% of each altar level survives a Descent, per level. Up to 5." },
    "frayed-edge": { name: "Frayed Edge", description: "Fragments come 20% more often per level. Up to 5." },
    "seventh-night": { name: "The Seventh Night", description: "Unlocks the seventh power: Unweave." }
  },
  caravan: {
    token: { name: "The Stallkeeper's Token", description: "A named ring: -10% shard prices at the stall and the Caravan. Sold once, ever." },
    "sealed-coffer": { name: "Sealed Coffer", description: "A relic, legendary or better. The seal is not the Stallkeeper's." },
    "bottled-night": { name: "Bottled Night", description: "Instantly earn 2 h of gold at your current rate." },
    "pips-cheese": { name: "Pip's Cheese", description: `Golden rats come twice as often for ${BUFF_MINUTES} min (within their cap).` },
    "moth-lantern": { name: "Moth Lantern", description: `A wandering crystal every 45 to 90 s for ${BUFF_MINUTES} min.` },
    "ember-draught": { name: "Ember Draught", description: "Rage potion and fortune elixir at once, 10 min each." },
    "eldra-thread": { name: "Eldra's Thread", description: "Every power ready again." },
    "three-chests": { name: "Three Crates from the Road", description: "Three relic chests, found along the road, somewhere, some night." }
  },
  unweave: { name: "Unweave", description: "Skip the current stage. Cooldown 60 min." },
  crown: {
    name: "The Crown of Orvane",
    hover: "It cannot be worn. It wears you.",
    legend: { by: "The Nameless", text: "Keep walking." }
  }
};

const fr: SystemsText = {
  relics: {
    oathcutter: { name: "Tranche-Serment", legend: "Kaelen l'a brisée sur les marches du trône, la nuit où il a fui. Depuis, elle essaie de remonter l'escalier." },
    "thousandth-arrow": { name: "La Millième Flèche", legend: "Maëlle l'a empennée le soir où elle a perdu le compte des soirs. Elle n'a jamais manqué sa cible, et ça l'agace." },
    quietus: { name: "Quiétus", legend: "Une faux qui n'a jamais fauché. Morgrath dit qu'elle servira, une fois." },
    "unfinished-hammer": { name: "Le Marteau inachevé", legend: "Forgé chaque nuit pour un roi qui n'en a plus eu besoin. Enfin achevé, pour toi." },
    "splinter-of-sky": { name: "Éclat de voûte", legend: "Une lame taillée dans la Voûte de verre. Regarde le long du fil : tu verras une chambre, et une lampe allumée." },
    dawnbreak: { name: "Point-du-jour", legend: "Tiède au toucher, comme une fenêtre au matin." },
    "hollow-plate": { name: "Le Harnois creux", legend: "Il est venu ici tout seul. Il repartira de même, quand tu en auras fini avec lui." },
    mosshide: { name: "Peau-de-mousse", legend: "Le manteau d'hiver de l'Alpha. Encore chaud. La mousse y pousse toujours." },
    "briar-mantle": { name: "Manteau de ronces", legend: "Tissé par l'arbre-mère pour le premier hiver de Séraphine. Il se souvient d'avoir été un cadeau." },
    "aurelion-scales": { name: "Écailles d'Aurelion", legend: "Muées dans la strate du Wyrm, il y a mille mondes. Il aimerait bien les récupérer, un jour." },
    "ash-vestment": { name: "Robe des cendres", legend: "Portée par le premier Moine des braises, entré dans le feu du Bûcher pour en ressortir avec une seule flamme." },
    "mantle-of-the-last-court": { name: "Manteau de la dernière cour", legend: "Pourpre, jadis. La couleur est partie quelque part. La cour aussi." },
    "eldra-locket": { name: "Médaillon d'Eldra", legend: "Un sablier gros comme une larme. Le sable tombe vers le haut." },
    "singing-stone": { name: "La Pierre qui chante", legend: "Elle fredonne dès qu'on la regarde. Près de toi, elle ne s'arrête plus." },
    "oriane-ear": { name: "L'Oreille d'Oriane", legend: "Un coquillage de pierre pâle. Colle-le à ton oreille : demain, tout bas." },
    "grove-seed": { name: "Graine du vieux bosquet", legend: "La dernière graine de l'arbre-mère. Elle ne germera pas dans la nuit. Elle attend." },
    phylactery: { name: "Phylactère de Morgrath", legend: "Il y garde sa vie. Il dit que c'est l'endroit le plus sûr, puisque personne n'en veut." },
    "last-decree": { name: "Le Dernier Décret", legend: "Un rouleau scellé. Le sceau est intact. Le roi a demandé qu'on ne le lise jamais." },
    "signet-of-orvane": { name: "Sceau d'Orvane", legend: "Le sceau du roi. Il imprime une couronne et, dessous, une lettre si usée qu'on devine à peine un A." },
    "rat-ring": { name: "L'Anneau du rat", legend: "De l'or, minuscule, mordillé. Pip l'a laissé tomber exprès. Pip fait tout exprès." },
    "lodestone-band": { name: "Aimantite de Garrick", legend: "L'éclat qu'il avait enterré, serti dans un anneau. Le reflet, dedans, a fermé les yeux." },
    "mirelle-ring": { name: "L'Alliance de Mirelle", legend: "Gravé à l'intérieur : O. et M., et une date qui a eu lieu dix mille fois." },
    "stallkeeper-band": { name: "Jeton du Comptoir", legend: "Un jeton de laiton percé d'un trou. Le Comptoir a dit : tu sauras quand le rendre." },
    "second-morning": { name: "Anneau du second matin", legend: "Deux soleils gravés sur l'anneau. L'un des deux a été rayé." }
  },
  namedEffects: {
    critChance: (pct) => `+${Math.round(pct * 100)} % de chances de critique (dans le plafond des reliques)`,
    guardianGold: (pct) => `+${Math.round(pct * 100)} % d'or sur les gardiens de biome`,
    forgeDiscount: (pct) => `La forge coûte ${Math.round(pct * 100)} % d'éclats en moins`,
    kingDamage: (pct) => `+${p(pct)} % de dégâts contre le roi`,
    idleRamp: (pct) => `Bonus de Patience complet ${pct} s après une attaque au lieu de 30 s`,
    guardianShards: (pct) => `+${pct} ${sFr(pct, "éclat")} à chaque gardien vaincu`,
    seamDps: (pct) => `+${p(pct)} % de DPS tant qu'une Brèche est ouverte`,
    bossTimer: (pct) => `+${pct} s au chrono des boss`,
    idleBonus: (pct) => `+${p(pct)} % au bonus de Patience`,
    bossDamage: (pct) => `+${p(pct)} % de dégâts contre les élites et les gardiens`,
    rainSeconds: (pct) => `La Pluie d'or dure ${pct} s`,
    cooldown: (pct) => `-${p(pct)} % de temps de recharge des pouvoirs (avec l'Autel des échos, -${COOLDOWN_CAP} % au plus)`,
    crystalStay: (pct) => `Les cristaux errants restent ${pct} s au lieu de 13 s`,
    fragments: (pct) => `+${p(pct)} % de chances de fragment sur les gardiens`,
    clickPerRemembered: (pct) => `+${p(pct)} % de dégâts de clic par compagnon qui se souvient pleinement de toi (+${p(GROVE_SEED_MAX)} % au plus)`,
    phylactery: (pct) => `+${p(pct)} % au bonus de Patience, -${p(pct)} % de dégâts de clic`,
    treasure: (pct) => `+${p(pct)} % d'apparition de rats dorés (dans leur plafond)`,
    crystalSooner: (pct) => `Les cristaux errants viennent ${p(pct)} % plus tôt`,
    mirelle: (pct) => `+${p(pct)} % d'or, +${p(MIRELLE_BARON_DAMAGE)} % de dégâts contre le Baron de la pourriture`,
    marketDiscount: (pct) => `-${p(pct)} % sur les prix en éclats de l'échoppe et de la Roulotte`,
    wandererStages: (pct) => `L'Autel du voyageur franchit ${pct} étapes de plus (dans ses plafonds)`,
    regalia: () => "Regalia d'Orvane : porte les trois"
  },
  altarLegends: {
    might: { by: "L'Enclume", text: "Élevé par un marcheur qui a oublié chaque visage aimé et n'a gardé que le poids de ses poings." },
    blade: { by: "La Mère-des-Épées", text: "Sa dernière leçon : une lame est une question qu'on pose au monde, très vite." },
    fortune: { by: "Inconnu", text: "La pierre est tiède. Il y a de toutes petites traces de dents à la base." },
    patience: { by: "La Légion silencieuse", text: "Taillé sans un seul outil. Les morts sont patients, et ils avaient le temps." },
    time: { by: "Eldra", text: "Elle dit qu'elle ne l'a pas bâti. Elle dit qu'il s'est bâti tout seul, plus tard." },
    fate: { by: "La mère d'Oriane", text: "Cinq encoches, pas une de plus. Le destin se laisse pousser, mais jamais bien loin." },
    precision: { by: "Le grand-père d'Ysolde", text: "Une pointe de flèche sertie dans la pierre, qui vise quelque chose que tu ne vois pas." },
    treasure: { by: "Thorvald", text: "Inscription : POUR PIP. NOUS SOMMES QUITTES. Quelqu'un a rayé QUITTES." },
    bargain: { by: "Le Comptoir", text: "Les compagnons font payer moins cher les marcheurs dont ils se souviennent presque." },
    echoes: { by: "Oriane", text: "Parle près de lui et il répond un instant trop tôt." },
    harvest: { by: "Le premier Moine des braises", text: "Chaque essence a sa balle, comme le grain. Cet autel garde la balle et te rend la graine." },
    wanderer: { by: "Le Sans-Nom, avant", text: "Les compagnons parcourent la première route sans toi. Leurs pieds se souviennent de ce que leur tête a oublié." },
    memory: { by: "Inconnu", text: "Enfouie à son pied, une bourse d'or, chaque nuit. Tu ne te souviens pas de l'avoir enterrée. Tu le fais toujours." }
  },
  secrets: {
    "let-him-rest": {
      name: "Laisse-le dormir",
      riddle: "Parfois, le plus doux des coups est celui qu'on ne porte pas.",
      line: { by: "Le Roi", text: "Tu pourrais rester. Moi, je suis resté." }
    },
    even: {
      name: "Quittes",
      riddle: "Une dette, un rat, une montagne.",
      line: { by: "Thorvald", text: "Dis-lui qu'on est quittes." }
    },
    faceless: {
      name: "Sans visage",
      riddle: "Frappe à la porte de l'ombre.",
      line: { by: "Le Grand Livre", text: "Un instant, le portrait de Nyx était plein d'étoiles. Puis la capuche, de nouveau, et rien dessous." }
    },
    "small-change": {
      name: "Petite monnaie",
      riddle: "Casse une étoile pour faire de la monnaie.",
      line: { by: "Lysandre", text: "Tu as cassé une étoile pour faire de la monnaie." }
    },
    "night-owl": {
      name: "Oiseau de nuit",
      riddle: "Marche quand la vraie nuit est la plus noire.",
      line: { by: "Le Grand Livre", text: "Quelqu'un a traversé les Plaines à l'heure la plus noire. La lune est sortie voir qui c'était." }
    },
    "thousandth-notch": {
      name: "La millième encoche",
      riddle: "Compte avec la chasseresse.",
      line: { by: "Le Grand Livre", text: "Le poteau de Maëlle : mille encoches, de sa main et d'une autre. La dernière est fraîche. Le couteau est le tien." }
    },
    "same-road": {
      name: "Même route",
      riddle: "Marche trois fois la même nuit.",
      line: { by: "Oriane", text: "Même l'écho s'ennuie." }
    },
    "keep-some": {
      name: "Garde-en",
      riddle: "Arrive au crépuscule les poches pleines.",
      line: { by: "Le Sans-Nom", text: "Bien. Garde." }
    },
    "how-it-starts": {
      name: "C'est comme ça que ça commence",
      riddle: "Arrive au crépuscule sans rien.",
      line: { by: "Le Sans-Nom", text: "Ça commence comme ça." }
    },
    "empty-hands": {
      name: "Mains nues",
      riddle: "Affronte le roi avec ton épée, et rien d'autre.",
      line: { by: "Kaelen", text: "Ça lui aurait plu." }
    },
    pacifist: {
      name: "Pacifiste",
      riddle: "Laisse mener celui qui a renoncé aux armes.",
      line: { by: "Frère Cendre", text: "Je n'ai frappé personne. Je me suis seulement tenu très fermement sur leur chemin." }
    },
    "last-second": {
      name: "La dernière seconde",
      riddle: "Sept fois, juste à temps.",
      line: { by: "Le Grand Livre", text: "Une griffe de la Gargouille des heures gît sur les marches du donjon. L'horloge qu'elle tenait retarde d'une demi-seconde." }
    },
    listening: {
      name: "À l'écoute des échos",
      riddle: "Tiens-toi immobile là où vivent les échos.",
      line: { by: "Oriane", text: "Les chauves-souris se taisent. Maintenant tu l'entends aussi : la nuit qui se redit, tout bas." }
    },
    "good-boy": {
      name: "Brave bête",
      riddle: "Gagne la confiance de l'innommable.",
      line: { by: "Le Grand Livre", text: "Le Grand Livre garde une page pour Biscuit. Elle est blanche, à part une empreinte de patte. Rien d'autre n'y tient." }
    },
    "till-death": {
      name: "Jusqu'à la mort",
      riddle: "Porte l'anneau jusqu'au marais.",
      line: { by: "Le Baron de la pourriture", text: "M. ?" }
    },
    "last-blow": {
      name: "Le dernier coup",
      riddle: "Laisse le chevalier finir ce qu'il a fui.",
      line: { by: "Kaelen", text: "J'ai enfin monté l'escalier. Il a levé les yeux et m'a dit : tu es en retard. Il souriait." }
    },
    "it-wears-you": {
      name: "C'est elle qui te porte",
      riddle: "Tends la main vers le cinquième emplacement.",
      line: { by: "Le Grand Livre", text: "La légende de la Couronne tient en deux mots. Le Sans-Nom les a tracés dans la poussière, lentement, comme on réapprend ses lettres." }
    },
    "behind-the-glass": {
      name: "De l'autre côté",
      riddle: "Dans la chambre à la lampe, regarde par la fenêtre.",
      line: { by: "Le Grand Livre", text: "La fenêtre du donjon a un reflet. Tu as cligné des yeux. Lui aussi, un peu après." }
    },
    "two-tongues": {
      name: "Deux langues",
      riddle: "Écoute la nuit dans ses deux voix.",
      line: { by: "Lysandre", text: "Obviously. Évidemment." }
    },
    "welcome-back": {
      name: "Bon retour",
      riddle: "Pars longtemps. Reviens.",
      line: { by: "Le Comptoir", text: "On a gardé ta lanterne allumée." }
    }
  },
  events: {
    storm: {
      name: "Averse de cristaux",
      text: "La Reine-lanterne traverse le ciel. Attrape la lumière !",
      line: { by: "Le Grand Livre", text: "Quelque chose a regardé le monde très fort. Les phalènes se sont levées à sa rencontre, et leur reine avec elles." }
    },
    seam: {
      name: "La Brèche",
      text: `Une Brèche s'ouvre. Abats son Gardien en ${SEAM_SECONDS} s.`,
      line: { by: "Le Grand Livre", text: "Une fissure dans la nuit, fine comme un cheveu, et du pâle derrière. Le marcheur a pesé dessus jusqu'à ce qu'elle se referme." }
    },
    wager: {
      name: "Le Pari de Pip",
      text: `Messire Pip s'arrête et te fixe. Frappe ${WAGER_CLICKS} fois en ${WAGER_SECONDS} s !`,
      line: { by: "Thorvald", text: "Il m'a parié une montagne, un jour. Je la rembourse un rat à la fois. Ne lui répète pas le mot rat." }
    },
    walker: {
      name: "Écho d'un marcheur",
      text: `L'écho d'un autre marcheur se bat à tes côtés pendant ${WALKER_SECONDS} s.`,
      line: { by: "Le Grand Livre", text: "Deux fils se sont touchés. Trente secondes durant, le Grand Livre a dû écrire deux noms sur une même ligne." }
    },
    caravan: {
      name: "La Roulotte",
      text: "La Roulotte est là. Le Comptoir a une marchandise pour la semaine.",
      line: { by: "Le Comptoir", text: "Entre deux nuits, il y a une route aussi. Personne n'y passe à part moi : les prix sont donc honnêtes." }
    },
    quiet: {
      name: "Le Silence",
      text: `Tout se tait. Abats-le en ${QUIET_SECONDS} s.`,
      line: { by: "Le Grand Livre", text: "Ni couleur, ni bruit, ni poids. Quand il s'est défait, l'herbe à sa place était devenue blanche." }
    },
    stray: {
      name: "L'Armure errante",
      text: "Une armure vide marche sur la route. Abats-la.",
      line: { by: "Le Sans-Nom", text: "À moi. Peut-être." }
    },
    eclipse: {
      name: "L'Éclipse du roi",
      text: "Le roi se lève dans l'ombre, plus lourd. Même temps pour l'abattre.",
      line: { by: "Le Roi", text: "J'avais une épée comme la tienne. J'ai marché sur cette route, une fois, dans l'autre sens." }
    },
    tide: {
      name: "La Marée lente",
      text: "La nuit te revient lentement. Un cristal arrive.",
      line: { by: "Le Grand Livre", text: "Le marcheur est revenu de loin. Un moment, la lumière est restée lente, comme l'eau qui cherche son niveau." }
    },
    remembrance: {
      name: "Nuit du souvenir",
      text: "Des lanternes tout le long de la route ce soir. Deux fois plus de fragments.",
      line: { by: "Le Grand Livre", text: "Des lanternes sur chaque borne, allumées par personne. La nuit se fait une fête, et te garde une place." }
    },
    migration: {
      name: "La Migration",
      text: "Des Vestiges d'une autre terre traversent ce bout de route.",
      line: { by: "Le Grand Livre", text: "Un Crapaud putride dans les blés, qui cherche une eau dont il se souvient. Il n'en trouve pas. Il cherche encore." }
    },
    unfinished: {
      name: "L'Inachevé",
      text: "Un Vestige arrive à moitié dessiné. Frappe-le, il se complète.",
      line: { by: "Le Grand Livre", text: "Il est arrivé en simple contour, un œil manquant. Chaque coup le complétait un peu, comme si quelqu'un vérifiait." }
    }
  },
  achievementNames: {
    stage: ["Premiers pas", "Éclaireur", "Régicide", "Au-delà des ruines", "Centurion", "Marcheur des ères", "Légende", "Mythe", "Divinité", "Mille nuits", "Rêveur profond", "Pas encore"],
    ascend: ["Renaissance", "Cycle", "Éternel retour", "Samsara", "Au-delà du cycle", "Nuit après nuit", "Gardien de la longue nuit"],
    essences: ["Première lueur", "Réservoir", "Source", "Océan d'essence", "Cristal primordial", "Constellation", "Galaxie de souvenirs"],
    strata: ["Terre consacrée", "Parmi les fils", "Diseur de noms", "Derrière la vitre", "La page blanche", "Presque le matin"],
    kings: ["Vive le roi", "Briseur de rois", "Cent couronnements", "La couronne est lourde"],
    seams: ["Premier point", "Gardien des brèches", "La nuit tient"],
    recognition: ["Visage familier", "Vieux amis", "Compagnie des souvenirs", "Tous se souviennent"],
    descents: ["Retissé", "Nuit profonde", "Lié au métier", "Nuit sans fond"],
    bestiary: ["Naturaliste", "Carnet de terrain", "Livre des vestiges", "Tous les cauchemars nommés"],
    fragments: ["Murmure", "À l'écoute", "Archiviste", "Gardien de la chronique", "La nuit se souvient"],
    named: ["Un nom dans l'acier", "Collectionneur de légendes", "Salle des reliques", "Toutes les légendes"]
  },
  achievementDescriptions: {
    strata: (t) => `Atteins la strate ${t}.`,
    kings: (t) => (t === 1 ? "Vaincs le roi." : `Vaincs le roi ${nFr(t)} fois.`),
    seams: (t) => (t === 1 ? "Referme une Brèche." : `Referme ${nFr(t)} Brèches.`),
    recognition: (t) => (t === 1 ? "Qu'un compagnon se souvienne pleinement de toi." : `Que ${t} compagnons se souviennent pleinement de toi.`),
    descents: (t) => (t === 1 ? "Descends une fois." : `Descends ${t} fois.`),
    bestiary: (t) => `Rencontre ${nFr(t)} créatures.`,
    fragments: (t) => `Trouve ${nFr(t)} fragments.`,
    named: (t) => (t === 1 ? "Trouve une relique nommée." : `Trouve ${t} reliques nommées.`)
  },
  weaves: {
    plenty: { name: "Chaîne d'abondance", description: "Essences ×1,25 par niveau (se multiplie)." },
    "dusk-knot": { name: "Nœud du crépuscule", description: "Le plafond de l'Autel du voyageur monte de 10 niveaux par niveau. 5 niveaux au plus." },
    "long-thread": { name: "Le Long Fil", description: "Le temps en arrière-plan compte 1 h de plus par niveau. 4 niveaux au plus." },
    "humming-loom": { name: "Métier bourdonnant", description: "Les cristaux errants viennent 10 % plus tôt par niveau. 5 niveaux au plus." },
    kinship: { name: "Parenté", description: "Chaque palier de Reconnaissance demande une nuit de moins par niveau. 3 niveaux au plus." },
    "remembered-stones": { name: "Pierres mémoires", description: "5 % de chaque niveau d'autel survit à la Descente, par niveau. 5 niveaux au plus." },
    "frayed-edge": { name: "Lisière effilochée", description: "Les fragments viennent 20 % plus souvent par niveau. 5 niveaux au plus." },
    "seventh-night": { name: "La Septième Nuit", description: "Débloque le septième pouvoir : Détisser." }
  },
  caravan: {
    token: { name: "Jeton du Comptoir", description: "Un anneau nommé : -10 % sur les prix en éclats de l'échoppe et de la Roulotte. Vendu une seule fois." },
    "sealed-coffer": { name: "Coffre scellé", description: "Une relique, légendaire ou mieux. Le sceau n'est pas celui du Comptoir." },
    "bottled-night": { name: "Nuit en bouteille", description: "Gagne instantanément 2 h d'or au rythme actuel." },
    "pips-cheese": { name: "Fromage de Pip", description: `Les rats dorés viennent deux fois plus souvent pendant ${BUFF_MINUTES} min (dans leur plafond).` },
    "moth-lantern": { name: "Lanterne aux phalènes", description: `Un cristal errant toutes les 45 à 90 s pendant ${BUFF_MINUTES} min.` },
    "ember-draught": { name: "Breuvage de braise", description: "Potion de rage et élixir de fortune d'un coup, 10 min chacun." },
    "eldra-thread": { name: "Fil d'Eldra", description: "Tous les pouvoirs de nouveau prêts." },
    "three-chests": { name: "Trois caisses de la route", description: "Trois coffres de relique, trouvés sur la route, quelque part, une nuit." }
  },
  unweave: { name: "Détisser", description: "Franchit l'étape en cours. Temps de recharge : 60 min." },
  crown: {
    name: "La Couronne d'Orvane",
    hover: "Elle ne se porte pas. C'est elle qui te porte.",
    legend: { by: "Le Sans-Nom", text: "Marche encore." }
  }
};

export const SYSTEMS_TEXT: Record<Locale, SystemsText> = { en, fr };
