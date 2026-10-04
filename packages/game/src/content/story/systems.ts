import type { Locale } from "../../i18n";
import { CARAVAN_BUFF_SECONDS } from "../../data/caravan";
import {
  QUIET_SECONDS,
  REMEMBRANCE_FRAGMENTS,
  SEAM_SECONDS,
  STORM_CRYSTALS,
  TIDE_CRYSTAL_SECONDS,
  WAGER_CLICKS,
  WAGER_SECONDS,
  WALKER_DPS,
  WALKER_SECONDS
} from "../../data/events";
import { COOLDOWN_FLOOR, GROVE_SEED_MAX, MIRELLE_BARON_DAMAGE, REGALIA_KING_DAMAGE } from "../../data/relics";
import { SKILL_BY_ID } from "../../data/skills";
import type { SystemsText } from "../types";

/** A fraction as a whole percentage (0.25 → 25). */
const p = (value: number) => Math.round(value * 100);
const nEn = (value: number) => value.toLocaleString("en-US");
const nFr = (value: number) => value.toLocaleString("fr-FR");
const sEn = (count: number, word: string, plural = `${word}s`) => (count > 1 ? plural : word);
const sFr = (count: number, word: string) => (count > 1 ? `${word}s` : word);
const BUFF_MINUTES = CARAVAN_BUFF_SECONDS / 60;
const COOLDOWN_CAP = p(1 - COOLDOWN_FLOOR);
const RAIN_SECONDS = SKILL_BY_ID.goldrain.duration;
const WALKER_BONUS = p(WALKER_DPS - 1);
const REGALIA_BONUS = p(REGALIA_KING_DAMAGE);

const en: SystemsText = {
  relics: {
    oathcutter: { name: "Oathcutter", legend: "Kaelen's sword. He broke it on the throne steps the night he failed his king, and it has been trying to climb back up those stairs ever since." },
    "thousandth-arrow": { name: "The Thousandth Arrow", legend: "Maëlle made this arrow on the night she lost count of the nights she had lived. It has never missed. That bothers her." },
    quietus: { name: "Quietus", legend: "Morgrath's scythe. He has never swung it: he says it is kept for a single blow, on the night the dark finally ends." },
    "unfinished-hammer": { name: "The Unfinished Hammer", legend: "Brom forged this hammer every night for the King, who never came to fetch it. He finished it at last, and gave it to you." },
    "splinter-of-sky": { name: "Splinter of the Sky", legend: "A blade cut from the Sky-Glass, the cracked dome over Orvane. Brom refuses to sharpen it: he says the edge already belongs to the sky." },
    dawnbreak: { name: "Dawnbreak", legend: "Found at the Dawn, the far edge of the Long Night. It is warm to the touch, like a window in the morning sun: the only warm thing in the whole night." },
    "hollow-plate": { name: "The Hollow Plate", legend: "The empty armor that walked the road on its own. It lets you wear it for now, and will walk away the same way once you are done with it." },
    mosshide: { name: "Mosshide", legend: "The winter coat of the Moss Alpha, the old boar Maëlle has hunted all her life. Still warm, and moss still grows on it." },
    "briar-mantle": { name: "Briar Mantle", legend: "The mother-tree of the dark forest wove this mantle for Séraphine's first winter, when she was its pupil. It still remembers being a gift." },
    "aurelion-scales": { name: "Scales of Aurelion", legend: "Aurelion shed these scales long ago, in the Wyrm stratum where dragons come from. He lends them to you, and would like them back one day." },
    "ash-vestment": { name: "Vestment of Cinders", legend: "Robe of the first Ember Monk. When the Pyre cult burned the old forests, he walked into their fire to carry a single flame out alive." },
    "mantle-of-the-last-court": { name: "Mantle of the Last Court", legend: "Worn by the King's court on its last day. It was purple then. The color has faded away, and so has the court." },
    "eldra-locket": { name: "Eldra's Locket", legend: "Eldra's gift: an hourglass the size of a tear, whose sand falls upward. Time runs differently for the woman who weaves it." },
    "singing-stone": { name: "The Singing Stone", legend: "A stone from the Singing Geode. It hums whenever someone looks at it, and around you it never stops." },
    "oriane-ear": { name: "Oriane's Ear", legend: "Oriane's gift: a shell of pale stone. Hold it to your ear and you hear, faintly, what the night will say tomorrow." },
    "grove-seed": { name: "Seed of the Old Grove", legend: "Séraphine's gift: the last seed of the mother-tree she helps you fell each night. It will not sprout while the night lasts. It is waiting for morning." },
    phylactery: { name: "Morgrath's Phylactery", legend: "Morgrath keeps his life in this jar. He calls it the safest place there is, because nobody would ever want it." },
    "last-decree": { name: "The Last Decree", legend: "The King's last decree, still sealed. He ordered that no one should ever read it, and no one has." },
    "signet-of-orvane": { name: "Signet of Orvane", legend: "The Fallen King's seal ring. It stamps a crown, and under it a letter so worn you can only guess it is an A." },
    "rat-ring": { name: "The Rat's Ring", legend: "A tiny gold ring, bitten. Pip, the golden rat, dropped it on purpose. Pip does everything on purpose." },
    "lodestone-band": { name: "Garrick's Lodestone", legend: "Garrick's gift: the star-shard in which he once saw a strange face, set in a ring. He swears the face has closed its eyes since." },
    "mirelle-ring": { name: "Mirelle's Wedding Ring", legend: "Mirelle's wedding ring, engraved O. and M.: Osric and Mirelle. Her husband is the Baron of Rot now. She gives it to you so someone useful wears it." },
    "stallkeeper-band": { name: "The Stallkeeper's Token", legend: "A brass token with a hole in it, sold only once by the Stallkeeper. They said: you will know when to give it back." },
    "second-morning": { name: "Ring of the Second Morning", legend: "Found in the Aurora stratum. Two suns are engraved on the band, and one has been scratched out. Nobody in Orvane remembers a second sun." }
  },
  namedEffects: {
    critChance: (pct) => `+${Math.round(pct * 100)}% chance for your strikes to be critical (within the relics' cap)`,
    guardianGold: (pct) => `+${Math.round(pct * 100)}% gold from biome guardians`,
    forgeDiscount: (pct) => `Forging costs ${Math.round(pct * 100)}% fewer shards`,
    kingDamage: (pct) => `+${p(pct)}% damage to the King (every 50th stage)`,
    guardianShards: (pct) => `+${pct} ${sEn(pct, "shard")} on every guardian kill`,
    seamDps: (pct) => `Companions deal +${p(pct)}% damage while a Seam is open`,
    bossTimer: (pct) => `+${pct} s to beat elites and guardians`,
    idleBonus: (pct) => `+${p(pct)}% to the Patience bonus (the extra damage your companions always deal)`,
    bossDamage: (pct) => `+${p(pct)}% damage to elites and guardians`,
    rainSeconds: (pct) => `Golden Rain lasts ${pct} s instead of ${RAIN_SECONDS} s`,
    cooldown: (pct) => `Powers recharge ${p(pct)}% faster (with the Altar of Echoes, ${COOLDOWN_CAP}% at most)`,
    crystalStay: (pct) => `Wandering crystals stay ${pct} s instead of 13 s`,
    fragments: (pct) => `+${p(pct)}% chance of a Chronicle fragment from guardians`,
    clickPerRemembered: (pct) => `+${p(pct)}% strike damage per companion who fully remembers you (at most +${p(GROVE_SEED_MAX)}%)`,
    phylactery: (pct) => `+${p(pct)}% to the Patience bonus, but -${p(pct)}% strike damage`,
    treasure: (pct) => `+${p(pct)}% chance to meet a golden rat (within its cap)`,
    crystalSooner: (pct) => `Wandering crystals come ${p(pct)}% sooner`,
    mirelle: (pct) => `+${p(pct)}% gold, +${p(MIRELLE_BARON_DAMAGE)}% damage to the Baron of Rot`,
    marketDiscount: (pct) => `-${p(pct)}% shard prices at the stall and the Caravan`,
    wandererStages: (pct) => `The Altar of the Wanderer walks ${pct} more stages for you (within its caps)`,
    regalia: () => `One of the three Regalia of Orvane: wear all three for +${REGALIA_BONUS}% damage to the King`
  },
  altarLegends: {
    might: { by: "The Anvil", text: "Raised by a walker called the Anvil, who offered this stone every face he loved and kept only the strength of his fists. It lends that strength to your company." },
    blade: { by: "The Sword-Mother", text: "Raised by the Sword-Mother, who taught Kaelen to fight. Her last lesson is cut into it: a blade is a question you ask the world, very fast." },
    fortune: { by: "Unknown", text: "Nobody knows who raised it. The stone is warm, and tiny teeth marks line its base: Pip, the golden rat, has been seen close by." },
    patience: { by: "The Silent Legion", text: "Morgrath's dead, the Silent Legion, carved it with bare hands over countless nights. The dead are patient, and they taught the stone to be patient too." },
    time: { by: "Eldra", text: "Eldra the Timeweaver tends this stone, but says she never built it. According to her, it built itself, later, and then went back to stand here." },
    fate: { by: "Oriane's mother", text: "Oriane's mother, a blind seer, cut five notches in it and no more: she said fate lets itself be pushed five times, never a sixth." },
    precision: { by: "Ysolde's grandfather", text: "Ysolde's grandfather, an archer of the dark forest, set his last arrowhead in this stone. It still points at the weak spot of whatever stands before you." },
    treasure: { by: "Thorvald", text: "Thorvald raised it to pay a debt he owes Pip, the golden rat. The inscription reads FOR PIP. WE ARE EVEN NOW. Someone has scratched out EVEN." },
    bargain: { by: "The Stallkeeper", text: "The Stallkeeper raised it, and wrote the reason on it: companions ask less gold of a walker they almost remember." },
    echoes: { by: "Oriane", text: "Oriane, the Echo Oracle, raised it. Speak near it and it answers a moment before you finish. Your powers learn to come back early the same way." },
    harvest: { by: "The first Ember Monk", text: "The first Ember Monk raised it. He taught that every essence has a husk, like grain: this stone keeps the husk and gives you back more of the seed." },
    wanderer: { by: "The Nameless, before", text: "Raised by a walker who had walked so many nights that his companions knew the first stretch by heart and walked it ahead of him. The stone kept the habit." },
    memory: { by: "Unknown", text: "Nobody remembers raising it. Each night, a purse of old coin lies buried at its foot, ready for you at dusk. You never remember burying it. You always do." }
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
      line: { by: "Thorvald", text: "Tell the rat we're even. Pip will know what I mean." }
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
      riddle: "Walk at the darkest hour.",
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
      line: { by: "Oriane", text: "Three nights in a row you stopped at the same stone. Even the echo is bored." }
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
      line: { by: "Kaelen", text: "No relic, only your sword. He'd have liked that." }
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
      line: { by: "The Ledger", text: "The Ledger keeps a page for Biscuit, Vorn's strangest beast. It is blank but for one paw print. Nothing else will stay on it." }
    },
    "till-death": {
      name: "Till Death",
      riddle: "Bring the ring to the mire.",
      line: { by: "The Baron of Rot", text: "That ring. M.? Mirelle, is that you?" }
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
      riddle: "Find the window that looks back.",
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
      line: { by: "The Stallkeeper", text: "You were gone a long time. We kept your lantern lit." }
    }
  },
  events: {
    storm: {
      name: "Crystal Storm",
      text: `The Lantern Queen crosses the sky: ${STORM_CRYSTALS} crystals fall in turn. Catch them!`,
      line: { by: "The Ledger", text: "The sky shook loose a handful of light. The moths rose to catch it, and their queen with them." }
    },
    seam: {
      name: "The Seam",
      text: `A Seam opens: beat its Warden in ${SEAM_SECONDS} s for elite gold, a fragment, maybe a relic.`,
      line: { by: "The Ledger", text: "A crack in the night, thin as a hair, and something pale behind it. The walker leaned on it until it closed." }
    },
    wager: {
      name: "Pip's Wager",
      text: `Pip dares you: strike ${WAGER_CLICKS} times in ${WAGER_SECONDS} s to win a purse of gold!`,
      line: { by: "Thorvald", text: "He bet me a mountain once. I'm paying it back one rat at a time. Don't tell him I said rat." }
    },
    walker: {
      name: "Echo of a Walker",
      text: `Another walker's echo joins you: companions deal +${WALKER_BONUS}% damage for ${WALKER_SECONDS} s.`,
      line: { by: "The Ledger", text: "Two walkers' roads touched. For a few breaths the Ledger had to write two names on one line." }
    },
    caravan: {
      name: "The Caravan",
      text: "The Caravan is in: one rare ware this week, sold for shards at the stall.",
      line: { by: "The Stallkeeper", text: "There is a road between nights too. Nobody walks it but me, so the prices are fair." }
    },
    quiet: {
      name: "The Quiet",
      text: `The Quiet comes, a Remnant without color. Beat it in ${QUIET_SECONDS} s for a fragment.`,
      line: { by: "The Ledger", text: "No color, no sound, no weight. When it came apart, the grass where it stood had turned white." }
    },
    stray: {
      name: "Stray Armor",
      text: "An empty armor walks the road. Beat it in time: the first one leaves you its plate.",
      line: { by: "The Nameless", text: "Mine. Maybe." }
    },
    eclipse: {
      name: "The King's Eclipse",
      text: "The King rises in shadow, half again as tough, same time. He always leaves a relic.",
      line: { by: "The King", text: "Tonight the dark sits on me too. Strike hard. I won't mind." }
    },
    tide: {
      name: "The Slow Tide",
      text: `You were away a long while: a wandering crystal comes in ${TIDE_CRYSTAL_SECONDS} s.`,
      line: { by: "The Ledger", text: "The walker came back from far away. For a while the light was slow, like water finding its level." }
    },
    remembrance: {
      name: "Remembrance Night",
      text: `Lanterns line the road tonight: fragments come ${REMEMBRANCE_FRAGMENTS} times as often.`,
      line: { by: "The Ledger", text: "Lanterns on every milestone, lit by nobody. The night keeps a feast for itself, and sets a place for you." }
    },
    migration: {
      name: "The Migration",
      text: "Remnants from another biome cross this stretch of road. Same strength, new faces.",
      line: { by: "The Ledger", text: "A Rot Toad in the wheat, looking for water it remembers. It found none. It is still looking." }
    },
    unfinished: {
      name: "The Unfinished",
      text: "A Remnant comes half drawn. Your strikes fill it in; beaten, it leaves a fragment.",
      line: { by: "The Ledger", text: "It came in outline only, one eye missing. Each blow filled in a little more, as if someone were checking." }
    }
  },
  achievementNames: {
    stage: ["First Steps", "Scout", "Regicide", "Beyond the Ruins", "The Hundredth Stone", "Era Walker", "Far from the Hearth", "Before the Kingdom", "Past the Last Map", "A Thousand Stones", "Below the Words", "Not Yet", "Past the Last Chapel", "Loose Threads", "Erased Twice", "Unspoken", "A Lamp Left On", "What Was Undone", "White on White"],
    ascend: ["Dusk Again", "The Road Looks Familiar", "Ten Dusks", "They Forget, You Don't", "Nobody Counts Anymore", "Night After Night", "Keeper of the Long Night"],
    essences: ["First Glimmer", "Something Kept", "A Well of Evenings", "Heavy with Memory", "Older Than Your Name", "Constellation", "Galaxy of Memory"],
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
    plenty: { name: "Warp of Plenty", description: "Each level multiplies the essences you gain at every ascension by 1.25 (level 2: ×1.56)." },
    "dusk-knot": { name: "Knot of Dusk", description: "The Altar of the Wanderer can rise 10 levels higher per level, so your companions walk more stages for you." },
    "long-thread": { name: "The Long Thread", description: "While you are away, the company keeps walking 1 h longer per level (8 h at the start)." },
    "humming-loom": { name: "Humming Loom", description: "Wandering crystals come 10% sooner per level." },
    kinship: { name: "Kinship", description: "Companions remember you sooner: each tier of Recognition needs one night fewer per level." },
    "remembered-stones": { name: "Remembered Stones", description: "When you Descend, you keep 5% of each altar's levels per level (rounded down)." },
    "frayed-edge": { name: "Frayed Edge", description: "Fragments of the Chronicle come 20% more often per level." },
    "seventh-night": { name: "The Seventh Night", description: "Unlocks the seventh power, Unweave: skip the stage you are on." }
  },
  caravan: {
    token: { name: "The Stallkeeper's Token", description: "A named ring: -10% shard prices at the stall and the Caravan. Sold only once, ever." },
    "sealed-coffer": { name: "Sealed Coffer", description: "A relic, legendary or better. The seal is not the Stallkeeper's." },
    "bottled-night": { name: "Bottled Night", description: "Instantly earn 2 h of gold at your company's current rate." },
    "pips-cheese": { name: "Pip's Cheese", description: `Golden rats come twice as often for ${BUFF_MINUTES} min (within their cap).` },
    "moth-lantern": { name: "Moth Lantern", description: `A wandering crystal every 45 to 90 s for ${BUFF_MINUTES} min.` },
    "ember-draught": { name: "Ember Draught", description: "A Rage Potion and a Fortune Elixir at once, 10 min each." },
    "eldra-thread": { name: "Eldra's Thread", description: "Every power is ready again at once." },
    "three-chests": { name: "Three Crates from the Road", description: "Three relic chests, found along the road, somewhere, some night." }
  },
  unweave: { name: "Unweave", description: `Skip the stage you are on and go to the next one. Only on your furthest stage, never an elite's or a guardian's.` },
  crown: {
    name: "The Crown of Orvane",
    hover: "It cannot be worn. It wears you.",
    legend: { by: "The Nameless", text: "Keep walking." }
  }
};

const fr: SystemsText = {
  relics: {
    oathcutter: { name: "Tranche-Serment", legend: "L'épée de Kaelen. Il l'a brisée sur les marches du trône, la nuit où il a failli envers son roi. Depuis, elle essaie de remonter l'escalier." },
    "thousandth-arrow": { name: "La Millième Flèche", legend: "Maëlle a empenné cette flèche le soir où elle a perdu le compte des soirs vécus. Elle n'a jamais manqué sa cible, et ça l'agace." },
    quietus: { name: "Quiétus", legend: "La faux de Morgrath. Il ne s'en est jamais servi : il dit qu'elle est gardée pour un seul coup, la nuit où le noir finira enfin." },
    "unfinished-hammer": { name: "Le Marteau inachevé", legend: "Brom forgeait ce marteau chaque nuit pour le roi, qui n'est jamais venu le chercher. Il l'a enfin achevé, et te l'a donné." },
    "splinter-of-sky": { name: "Éclat de voûte", legend: "Une lame taillée dans la Voûte de verre, le ciel fêlé d'Orvane. Brom refuse de l'affûter : il dit que le fil appartient déjà au ciel." },
    dawnbreak: { name: "Point-du-jour", legend: "Trouvée à l'Aube, tout au bout de la Longue Nuit. Elle est tiède au toucher, comme une fenêtre au soleil du matin : la seule chose tiède de toute la nuit." },
    "hollow-plate": { name: "Le Harnois creux", legend: "L'armure vide qui marchait seule sur la route. Elle se laisse porter pour l'instant, et repartira de même quand tu en auras fini avec elle." },
    mosshide: { name: "Peau-de-mousse", legend: "Le manteau d'hiver de l'Alpha moussu, le vieux sanglier que Maëlle chasse depuis toujours. Encore chaud, et la mousse y pousse toujours." },
    "briar-mantle": { name: "Manteau de ronces", legend: "L'arbre-mère de la forêt sombre a tissé ce manteau pour le premier hiver de Séraphine, son élève. Il se souvient encore d'avoir été un cadeau." },
    "aurelion-scales": { name: "Écailles d'Aurelion", legend: "Aurelion a perdu ces écailles il y a très longtemps, dans la strate de la Guivre, d'où viennent les dragons. Il te les prête, et aimerait les récupérer un jour." },
    "ash-vestment": { name: "Robe des cendres", legend: "La robe du premier Moine des braises. Quand le culte du Bûcher a brûlé les vieilles forêts, il est entré dans le feu pour en ressortir avec une seule flamme." },
    "mantle-of-the-last-court": { name: "Manteau de la dernière cour", legend: "Porté par la cour du roi, le dernier jour. Il était pourpre, alors. La couleur s'est effacée, et la cour avec." },
    "eldra-locket": { name: "Médaillon d'Eldra", legend: "Le cadeau d'Eldra : un sablier gros comme une larme, dont le sable tombe vers le haut. Le temps ne coule pas pareil pour celle qui le tisse." },
    "singing-stone": { name: "La Pierre qui chante", legend: "Une pierre de la Géode chantante. Elle fredonne dès qu'on la regarde, et près de toi, elle ne s'arrête plus." },
    "oriane-ear": { name: "L'Oreille d'Oriane", legend: "Le cadeau d'Oriane : un coquillage de pierre pâle. Colle-le à ton oreille et tu entends, tout bas, ce que la nuit dira demain." },
    "grove-seed": { name: "Graine du vieux bosquet", legend: "Le cadeau de Séraphine : la dernière graine de l'arbre-mère qu'elle t'aide à abattre chaque nuit. Elle ne germera pas tant que dure la nuit. Elle attend le matin." },
    phylactery: { name: "Phylactère de Morgrath", legend: "Morgrath garde sa vie dans ce bocal. Il dit que c'est l'endroit le plus sûr du monde, puisque personne n'en voudrait." },
    "last-decree": { name: "Le Dernier Décret", legend: "Le dernier décret du roi, toujours scellé. Il a ordonné que personne ne le lise jamais, et personne ne l'a lu." },
    "signet-of-orvane": { name: "Sceau d'Orvane", legend: "L'anneau-sceau du Roi déchu. Il imprime une couronne et, dessous, une lettre si usée qu'on devine à peine un A." },
    "rat-ring": { name: "L'Anneau du rat", legend: "Un minuscule anneau d'or, mordillé. Messire Pip, le rat doré, l'a laissé tomber exprès. Pip fait tout exprès." },
    "lodestone-band": { name: "Aimantite de Garrick", legend: "Le cadeau de Garrick : l'éclat d'étoile où il a vu un jour un visage étrange, serti dans un anneau. Il jure que le visage a fermé les yeux, depuis." },
    "mirelle-ring": { name: "L'Alliance de Mirelle", legend: "L'alliance de Mirelle, gravée O. et M. : Osric et Mirelle. Son mari est devenu le Baron de la pourriture. Elle te la donne pour qu'elle serve à quelqu'un." },
    "stallkeeper-band": { name: "Jeton du Comptoir", legend: "Un jeton de laiton percé, vendu une seule fois par le Comptoir. Il a dit : tu sauras quand le rendre." },
    "second-morning": { name: "Anneau du second matin", legend: "Trouvé dans la strate de l'Aurore. Deux soleils sont gravés sur l'anneau, et l'un d'eux a été rayé. Personne en Orvane ne se souvient d'un second soleil." }
  },
  namedEffects: {
    critChance: (pct) => `+${Math.round(pct * 100)} % de chances que tes frappes soient critiques (dans le plafond des reliques)`,
    guardianGold: (pct) => `+${Math.round(pct * 100)} % d'or sur les gardiens de biome`,
    forgeDiscount: (pct) => `La forge coûte ${Math.round(pct * 100)} % d'éclats en moins`,
    kingDamage: (pct) => `+${p(pct)} % de dégâts contre le roi (toutes les 50 étapes)`,
    guardianShards: (pct) => `+${pct} ${sFr(pct, "éclat")} à chaque gardien vaincu`,
    seamDps: (pct) => `Tes compagnons infligent +${p(pct)} % de dégâts tant qu'une Brèche est ouverte`,
    bossTimer: (pct) => `+${pct} s pour abattre les élites et les gardiens`,
    idleBonus: (pct) => `+${p(pct)} % au bonus de Patience (les dégâts en plus que tes compagnons infligent toujours)`,
    bossDamage: (pct) => `+${p(pct)} % de dégâts contre les élites et les gardiens`,
    rainSeconds: (pct) => `La Pluie d'or dure ${pct} s au lieu de ${RAIN_SECONDS} s`,
    cooldown: (pct) => `Les pouvoirs se rechargent ${p(pct)} % plus vite (avec l'Autel des échos, ${COOLDOWN_CAP} % au plus)`,
    crystalStay: (pct) => `Les cristaux errants restent ${pct} s au lieu de 13 s`,
    fragments: (pct) => `+${p(pct)} % de chances de fragment de la Chronique sur les gardiens`,
    clickPerRemembered: (pct) => `+${p(pct)} % de dégâts de frappe par compagnon qui se souvient pleinement de toi (+${p(GROVE_SEED_MAX)} % au plus)`,
    phylactery: (pct) => `+${p(pct)} % au bonus de Patience, mais -${p(pct)} % de dégâts de frappe`,
    treasure: (pct) => `+${p(pct)} % de chances de croiser un rat doré (dans leur plafond)`,
    crystalSooner: (pct) => `Les cristaux errants viennent ${p(pct)} % plus tôt`,
    mirelle: (pct) => `+${p(pct)} % d'or, +${p(MIRELLE_BARON_DAMAGE)} % de dégâts contre le Baron de la pourriture`,
    marketDiscount: (pct) => `-${p(pct)} % sur les prix en éclats de l'échoppe et de la Roulotte`,
    wandererStages: (pct) => `L'Autel du voyageur parcourt ${pct} étapes de plus pour toi (dans ses plafonds)`,
    regalia: () => `L'un des trois Regalia d'Orvane : porte les trois pour +${REGALIA_BONUS} % de dégâts contre le roi`
  },
  altarLegends: {
    might: { by: "L'Enclume", text: "Élevé par un marcheur qu'on appelait l'Enclume. Il a offert à cette pierre chaque visage aimé et n'a gardé que la force de ses poings. Elle la prête à ta compagnie." },
    blade: { by: "La Mère-des-Épées", text: "Élevé par la Mère-des-Épées, qui a appris à Kaelen à se battre. Sa dernière leçon y est gravée : une lame est une question qu'on pose au monde, très vite." },
    fortune: { by: "Inconnu", text: "Personne ne sait qui l'a élevé. La pierre est tiède, et de toutes petites traces de dents bordent sa base : on a vu Messire Pip, le rat doré, rôder autour." },
    patience: { by: "La Légion silencieuse", text: "Les morts de Morgrath, la Légion silencieuse, l'ont taillé à mains nues pendant des nuits sans nombre. Les morts sont patients, et ils ont appris la patience à la pierre." },
    time: { by: "Eldra", text: "Eldra, la Tisseuse du temps, veille sur cette pierre mais jure ne pas l'avoir bâtie. D'après elle, la pierre s'est bâtie toute seule, plus tard, puis est revenue ici." },
    fate: { by: "La mère d'Oriane", text: "La mère d'Oriane, une voyante aveugle, y a taillé cinq encoches, pas une de plus : elle disait que le destin se laisse pousser cinq fois, jamais six." },
    precision: { by: "Le grand-père d'Ysolde", text: "Le grand-père d'Ysolde, archer de la forêt sombre, a serti dans cette pierre sa dernière pointe de flèche. Elle vise toujours le point faible de ce qui se dresse devant toi." },
    treasure: { by: "Thorvald", text: "Thorvald l'a élevé pour payer une dette envers Messire Pip, le rat doré. On y lit : POUR PIP. NOUS SOMMES QUITTES. Quelqu'un a rayé QUITTES." },
    bargain: { by: "Le Comptoir", text: "Le Comptoir l'a élevé, et y a gravé pourquoi : les compagnons demandent moins d'or au marcheur dont ils se souviennent presque." },
    echoes: { by: "Oriane", text: "Oriane, l'Oracle d'écho, l'a élevé. Parle près de lui et il répond un instant avant que tu aies fini. Tes pouvoirs apprennent à revenir en avance, de la même façon." },
    harvest: { by: "Le premier Moine des braises", text: "Le premier Moine des braises l'a élevé. Il enseignait que chaque essence a sa balle, comme le grain : cet autel garde la balle et te rend plus de graine." },
    wanderer: { by: "Le Sans-Nom, avant", text: "Élevé par un marcheur qui avait marché tant de nuits que ses compagnons connaissaient par cœur le début de la route, et la parcouraient avant lui. La pierre a gardé l'habitude." },
    memory: { by: "Inconnu", text: "Personne ne se souvient de l'avoir élevé. Chaque nuit, une bourse de vieil or est enfouie à son pied, prête pour toi au crépuscule. Tu ne te souviens jamais de l'enterrer. Tu le fais toujours." }
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
      line: { by: "Thorvald", text: "Dis au rat qu'on est quittes. Pip comprendra." }
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
      riddle: "Marche à l'heure la plus noire.",
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
      line: { by: "Oriane", text: "Trois nuits de suite, tu t'es arrêté à la même borne. Même l'écho s'ennuie." }
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
      line: { by: "Kaelen", text: "Pas de relique, ton épée seule. Ça lui aurait plu." }
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
      line: { by: "Le Grand Livre", text: "Le Grand Livre garde une page pour Biscuit, la bête étrange de Vorn. Elle est blanche, sauf une empreinte de patte. Rien d'autre n'y tient." }
    },
    "till-death": {
      name: "Jusqu'à la mort",
      riddle: "Porte l'anneau jusqu'au marais.",
      line: { by: "Le Baron de la pourriture", text: "Cet anneau. M. ? Mirelle, c'est toi ?" }
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
      riddle: "Trouve la fenêtre qui te rend ton regard.",
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
      line: { by: "Le Comptoir", text: "Tu es resté longtemps parti. On a gardé ta lanterne allumée." }
    }
  },
  events: {
    storm: {
      name: "Averse de cristaux",
      text: `La Reine-lanterne traverse le ciel : ${STORM_CRYSTALS} cristaux tombent tour à tour. Attrape-les !`,
      line: { by: "Le Grand Livre", text: "Le ciel a laissé tomber une poignée de lumière. Les phalènes se sont levées pour l'attraper, et leur reine avec elles." }
    },
    seam: {
      name: "La Brèche",
      text: `Une Brèche s'ouvre : abats son Gardien en ${SEAM_SECONDS} s pour l'or d'une élite et un fragment.`,
      line: { by: "Le Grand Livre", text: "Une fissure dans la nuit, fine comme un cheveu, et du pâle derrière. Le marcheur a pesé dessus jusqu'à ce qu'elle se referme." }
    },
    wager: {
      name: "Le Pari de Pip",
      text: `Messire Pip te défie : frappe ${WAGER_CLICKS} fois en ${WAGER_SECONDS} s pour gagner une bourse d'or !`,
      line: { by: "Thorvald", text: "Il m'a parié une montagne, un jour. Je la rembourse un rat à la fois. Ne lui répète pas le mot rat." }
    },
    walker: {
      name: "Écho d'un marcheur",
      text: `L'écho d'un autre marcheur t'aide : tes compagnons font +${WALKER_BONUS} % de dégâts ${WALKER_SECONDS} s.`,
      line: { by: "Le Grand Livre", text: "Les routes de deux marcheurs se sont touchées. L'espace de quelques souffles, le Grand Livre a dû écrire deux noms sur une même ligne." }
    },
    caravan: {
      name: "La Roulotte",
      text: "La Roulotte est là : une marchandise rare cette semaine, en éclats, à l'échoppe.",
      line: { by: "Le Comptoir", text: "Entre deux nuits, il y a une route aussi. Personne n'y passe à part moi : les prix sont donc honnêtes." }
    },
    quiet: {
      name: "Le Silence",
      text: `Le Silence arrive, un Vestige sans couleur. Abats-le en ${QUIET_SECONDS} s pour un fragment.`,
      line: { by: "Le Grand Livre", text: "Ni couleur, ni bruit, ni poids. Quand il s'est défait, l'herbe à sa place était devenue blanche." }
    },
    stray: {
      name: "L'Armure errante",
      text: "Une armure vide marche sur la route. Abats-la à temps : la première te laisse son harnois.",
      line: { by: "Le Sans-Nom", text: "À moi. Peut-être." }
    },
    eclipse: {
      name: "L'Éclipse du roi",
      text: "Le roi se lève dans l'ombre, moitié plus solide, même chrono. Il laisse une relique.",
      line: { by: "Le Roi", text: "Ce soir, le noir pèse sur moi aussi. Frappe fort. Je ne t'en voudrai pas." }
    },
    tide: {
      name: "La Marée lente",
      text: `Tu reviens de loin : un cristal errant arrive dans ${TIDE_CRYSTAL_SECONDS} s.`,
      line: { by: "Le Grand Livre", text: "Le marcheur est revenu de loin. Un moment, la lumière est restée lente, comme l'eau qui cherche son niveau." }
    },
    remembrance: {
      name: "Nuit du souvenir",
      text: `Des lanternes tout le long de la route ce soir : fragments ${REMEMBRANCE_FRAGMENTS} fois plus fréquents.`,
      line: { by: "Le Grand Livre", text: "Des lanternes sur chaque borne, allumées par personne. La nuit se fait une fête, et te garde une place." }
    },
    migration: {
      name: "La Migration",
      text: "Des Vestiges d'un autre biome traversent ce bout de route. Même force, autres visages.",
      line: { by: "Le Grand Livre", text: "Un Crapaud putride dans les blés, qui cherche une eau dont il se souvient. Il n'en trouve pas. Il cherche encore." }
    },
    unfinished: {
      name: "L'Inachevé",
      text: "Un Vestige à moitié dessiné. Tes frappes le complètent ; abattu, il laisse un fragment.",
      line: { by: "Le Grand Livre", text: "Il est arrivé en simple contour, un œil manquant. Chaque coup le complétait un peu, comme si quelqu'un vérifiait." }
    }
  },
  achievementNames: {
    stage: ["Premiers pas", "Éclaireur", "Régicide", "Au-delà des ruines", "La centième borne", "Marcheur des ères", "Loin du foyer", "Avant le royaume", "Plus loin que les cartes", "Mille bornes", "Sous les mots", "Pas encore", "Après la dernière chapelle", "Fils défaits", "Deux fois effacé", "Ce qui ne se dit pas", "Une lampe restée allumée", "Ce qui fut défait", "Blanc sur blanc"],
    ascend: ["Le crépuscule, encore", "La route te dit quelque chose", "Dix crépuscules", "Ils oublient, pas toi", "Plus personne ne compte", "Nuit après nuit", "Gardien de la longue nuit"],
    essences: ["Première lueur", "Quelque chose de gardé", "Un puits de soirs", "Lourd de souvenirs", "Plus vieux que ton nom", "Constellation", "Galaxie de souvenirs"],
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
    plenty: { name: "Chaîne d'abondance", description: "Chaque niveau multiplie par 1,25 les essences gagnées à chaque ascension (niveau 2 : ×1,56)." },
    "dusk-knot": { name: "Nœud du crépuscule", description: "L'Autel du voyageur peut monter de 10 niveaux de plus par niveau : tes compagnons parcourent plus d'étapes pour toi." },
    "long-thread": { name: "Le Long Fil", description: "Pendant ton absence, la compagnie marche 1 h de plus par niveau (8 h au départ)." },
    "humming-loom": { name: "Métier bourdonnant", description: "Les cristaux errants viennent 10 % plus tôt par niveau." },
    kinship: { name: "Parenté", description: "Tes compagnons se souviennent de toi plus vite : chaque palier de Reconnaissance demande une nuit de moins par niveau." },
    "remembered-stones": { name: "Pierres mémoires", description: "Quand tu Descends, tu gardes 5 % des niveaux de chaque autel par niveau (arrondi à l'inférieur)." },
    "frayed-edge": { name: "Lisière effilochée", description: "Les fragments de la Chronique viennent 20 % plus souvent par niveau." },
    "seventh-night": { name: "La Septième Nuit", description: "Débloque le septième pouvoir, Détisser : franchis l'étape où tu te trouves." }
  },
  caravan: {
    token: { name: "Jeton du Comptoir", description: "Un anneau nommé : -10 % sur les prix en éclats de l'échoppe et de la Roulotte. Vendu une seule fois." },
    "sealed-coffer": { name: "Coffre scellé", description: "Une relique, légendaire ou mieux. Le sceau n'est pas celui du Comptoir." },
    "bottled-night": { name: "Nuit en bouteille", description: "Gagne aussitôt 2 h d'or au rythme actuel de ta compagnie." },
    "pips-cheese": { name: "Fromage de Pip", description: `Les rats dorés viennent deux fois plus souvent pendant ${BUFF_MINUTES} min (dans leur plafond).` },
    "moth-lantern": { name: "Lanterne aux phalènes", description: `Un cristal errant toutes les 45 à 90 s pendant ${BUFF_MINUTES} min.` },
    "ember-draught": { name: "Breuvage de braise", description: "Une Potion de rage et un Élixir de fortune d'un coup, 10 min chacun." },
    "eldra-thread": { name: "Fil d'Eldra", description: "Tous tes pouvoirs sont aussitôt de nouveau prêts." },
    "three-chests": { name: "Trois caisses de la route", description: "Trois coffres de relique, trouvés sur la route, quelque part, une nuit." }
  },
  unweave: { name: "Détisser", description: `Franchis l'étape où tu te trouves et passe à la suivante. Seulement sur ta plus lointaine étape, jamais celle d'une élite ou d'un gardien.` },
  crown: {
    name: "La Couronne d'Orvane",
    hover: "Elle ne se porte pas. C'est elle qui te porte.",
    legend: { by: "Le Sans-Nom", text: "Marche encore." }
  }
};

export const SYSTEMS_TEXT: Record<Locale, SystemsText> = { en, fr };
