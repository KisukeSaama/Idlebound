import { en, enKing } from "./parse";
import type { EnLexicon, EnNoun, KingLexicon, SongLexicon } from "./types";

/**
 * English lexicons of the grammar (BIBLE 17.3). Each stratum keeps the words of its tag and
 * keystone (BIBLE 9) and the look of its Age (18.6). Index = era. Ages I to VII never hold
 * a word of the Truth; Age IX brings the house in, Age XI the white things.
 */
export const EN_STRATA: readonly EnLexicon[] = [
  // Age I: the Kingdom
  en("lantern|cracked crown|milestone|cloak", "wheat|keep|on@road|throne room", "waited|counted the steps|bowed|looked up", "cold|worn|still lit", "violet"),
  en("echo|bell|miner's pick|second shadow", "vaults#p|gallery|well|chapel", "screamed|answered|repeated a name|spoke too soon", "hollow|familiar|doubled", "grey"),
  en("ember|torch|sheaf|sun mask", "ash#m|burned field|at@pyre|old forest", "burned|prayed for the sun|sang to the fire|kept the flame", "warm|smoking|blackened", "red"),
  en("map|broken door|boot|empty frame", "hole|at@edge|fog|missing field", "vanished|forgot a word|stopped walking|kept silent", "missing|mute|unfinished", "colorless"),
  en("star-shard|fallen star|piece of sky|spyglass", "crater|mine|sky|vein", "looked up|shone|counted the stars|dug for the sky", "cold|bright|still warm", "silver"),
  // Age II: the Elder World
  en("first pebble|root|seed|clay tablet", "mud#m|at@bottom|deep ground|first cave", "dug|stopped digging|wrote BOTTOM|gave up", "ancient|buried|wrong", "brown"),
  en("giant's tooth|stone hand|knucklebone|boulder", "valley|footprint|quarry|mountainside", "lifted a mountain|stamped|shook the ground|kept going", "huge|heavy|unmoved", "ochre"),
  en("scale|bone|egg|dragon's fang", "ribcage|lair|on@hoard|valley of bones", "bowed|breathed fire|coiled|waited a thousand years", "vast|proud|warm", "gold"),
  en("shell|anchor|salt#m|drowned bell", "tide|reef|on@seabed|shallows#p", "sank|drifted|swam|followed the tide", "wet|salted|drowned", "sea-green"),
  en("small crown|icicle|sled|frozen letter", "ice#m|glacier|frozen lake|hoarfrost#m", "froze|shivered|broke the ice|waited for the thaw", "frozen|brittle|small", "pale blue"),
  // Age III: the Hallowed
  en("censer|altar cloth|prayer beads#p|halo", "temple|nave|cloister|shrine", "prayed|lit a candle|faced the sky|sang a psalm", "holy|nameless|gilded", "gold"),
  en("prophecy|blindfold|bowl of smoke|bone dice#p", "grotto|smoke#m|on@temple steps#p|mouth of the cave", "foretold everything|spoke first|answered too soon|finished a sentence", "foretold|certain|veiled", "ash-grey"),
  en("feather|wing|veil|trumpet", "light shaft|choir loft|high air|belfry", "looked away|blazed|spread six wings|kept watch", "blinding|spotless|folded", "white"),
  en("hymnal|choir robe|tuning fork|bell rope", "choir|crypt|bell tower|organ loft", "sang|hummed|held a note|forgot the words", "hushed|resonant|old", "amber"),
  en("black sun|dark candle|prayer|mask", "shadow|altar|dark temple|noon night", "prayed for the night|covered the sun|blew out a candle|waited for an answer", "eclipsed|answered|dim", "copper-red"),
  // Age IV: the Making of the Stars
  en("ladle|drop of sky|soft star|crucible", "mould|poured sky|glassworks#p|furnace", "poured the sky|stirred|cooled|glowed", "liquid|soft|unset", "rose"),
  en("comet's tail|pebble of light|trail of sparks|lost star", "furrow|meadow|night air|long arc", "rolled|crossed the sky|fell slowly|waited", "unbroken|burning|tame", "orange"),
  en("kite|flag|last rung|weathervane", "on@peak|at@top of the sky|highest tower|thin air", "climbed|held on|looked down|touched the ceiling", "high|dizzying|brief", "sky blue"),
  en("spindle|thread|low star|footstool", "at@bottom of the sky|hollow of the sky|on@lowest step|underside of the stars", "wove|knelt|bent low|pulled a thread", "low|deep|patient", "indigo"),
  en("ribbon of light|veil|pale lantern|shimmer", "on@horizon|far north|at@edge of the sky|false dawn", "rehearsed|shimmered|rose too early|faded", "early|trembling|fleeting", "green"),
  // Age V: the Loom
  en("warp thread|loom weight|heddle|taut string", "loom|warp|high frame|threads#p", "hummed|pulled a thread taut|climbed a thread|plucked a string", "taut|humming|endless", "linen-white"),
  en("weft thread|tiny label|needle|spool", "weave|cloth|selvage|basket", "stitched|mended|wrote very small|sighed", "tired|tiny|careful", "faded blue"),
  en("shuttle|reel|knotted cord|borrowed shadow", "gap between threads|crossing|passage|narrow way", "slipped past|went back and forth|crossed|began again", "familiar|quick|restless", "copper"),
  en("knot|name tied in thread|ball of yarn|rope end", "great knot|snarl|heart of the knot|loop", "tied a knot|pulled tight|held fast|picked at a knot", "tight|tangled|stubborn", "dark red"),
  en("loose thread|worn patch|hem|hole of light", "thin place|tear|threadbare cloth|loose weave", "let go|let the light through|split|gave way", "thin|threadbare|see-through", "pale gold"),
  // Age VI: the Draft
  en("outline of a tree|pencil|unfinished bird|sketch of a house", "sketch|blank field|first draft|pencilled wood", "drew a bird|waited for color|left a gap|drew a line", "uncolored|light|rough", "sepia"),
  en("stick of charcoal|smudge|thumbprint|rag", "soot#m|black dust#m|hatching#m|corner", "left a mark|rubbed out a hill|blackened|shaded", "smudged|sooty|rough", "charcoal"),
  en("second keep|unfinished well|dotted line|tower barely drawn", "other kingdom|outline|unfinished field|plans#p", "began a wall|put the pen down|traced a road|left it for later", "unfinished|empty|provisional", "umber"),
  en("crumbs of rubber#p|ghost of a house|rubbed-out name|handprint", "erased field|pale patch|hollow of the paper|space left behind", "faded|took something back|rubbed out a line|half vanished", "erased|ghostly|almost there", "off-white"),
  en("older line|scraped letter|second map|old tracing", "vellum#m|old parchment|layer beneath|scraping", "showed through|wrote over the old words|scraped|read between the lines", "layered|washed out|double", "rust"),
  // Age VII: the Words
  en("runestone|carved letter|chisel|seal", "carved wall|on@runed road|among@standing stones#p|first line", "carved a letter|spelled a word|read the road|underlined a stone", "carved|legible|solemn", "lichen green"),
  en("glyph|ink stone|stamp|word for tired", "inscription|under@lintel|column|scroll", "meant two things|misread|traced a sign|signed", "ambiguous|weary|hieratic", "vermilion"),
  en("rhyme|couplet|lute|refrain", "stanza|song|last verse|ballad", "rhymed|recited|sang a verse|asked to be remembered", "rhymed|lilting|half-remembered", "wine red"),
  en("name|nameplate|sealed letter|signet ring", "register|silence|list of names|closed mouth", "said a name|kept a word back|whispered a word|found a name", "unspoken|true|heavy", "iron grey"),
  en("whisper|secret|story|hushed word", "ear|low voice|telling|half-light", "whispered|told a story|kept talking softly|listened", "quiet|soft|endless", "mauve"),
  // Age VIII: the Edge of Sleep
  en("pillow|slow bell|heavy eyelid|grain of sand", "lull|still water|on@slow road|long pause", "slowed|yawned|lay down|drifted", "slow|numb|heavy", "lavender"),
  en("loop of road|spinning top|paper boat|carousel horse", "meander|circle|cloud|long afternoon", "wandered|went round again|smiled|forgot where", "vague|looping|content", "pastel"),
  en("shawl|night candle|closed eye|sleeping bird", "sleep#m|nest|deep hollow|quiet hour", "slept|tiptoed|breathed slowly|stirred in the dark", "asleep|deep|drowsy", "night blue"),
  en("closed star|half-shut eye|nightcap|moth", "dim sky|haze|twilight|heavy air", "nodded off|closed an eye|blinked slowly|dozed", "half-closed|dim|sleepy", "plum"),
  en("door handle|threshold stone|last candle|closed door", "on@threshold|doorway|at@edge of sleep|space between", "hesitated|spat|knocked|opened a door a crack", "ajar|hesitant|thin", "wax yellow"),
  // Age IX: the Room
  en("lamp|lampshade|wick|cup", "lamplight|room|under@high ceiling|circle of light", "left the lamp on|read late|turned a page|kept watch", "lit|warm|humming", "honey"),
  en("blanket|kettle|slippers#p|poker", "at@hearth|armchair|on@rug|kitchen", "reached for the warmth|stoked the fire|sat by the fire|put the kettle on", "cosy|lukewarm|safe", "hearth red"),
  en("music box|cradle|rattle|soft toy", "nursery|at@bedside|rocking chair|glow of the night-light", "rocked|hummed slower|sang softly|tucked a blanket round someone", "slow|soft|hushed", "cream"),
  en("curtain|latch|windowpane|potted plant", "at@window|on@windowsill|behind@drawn curtains#p|pale rectangle", "looked out|drew the curtain|waited at the window|waved", "bright|open|far", "pale yellow"),
  en("glass of water|reflection|fingerprint|mirror", "glass|on@other side|against@cold pane|mist on the glass", "blinked|breathed on the glass|looked back|tapped the glass", "reflected|fogged|clear", "bottle green"),
  // Age X: the Unmaking
  en("empty coat|snail shell|husk|cast", "hollow|empty room|shape left behind|trace", "left a shape|moved out|kept a pose|let go", "hollow|empty|borrowed", "dust grey"),
  en("muffled bell|tuft of wool|cotton#m|glove", "wool#m|fog|thick quiet|far room", "spoke too late|rang softly|called from far away|struck without a sound", "muffled|late|distant", "taupe"),
  en("raised finger|stopped clock|closed book|held breath", "hush|stillness|quiet house|on@empty stair", "fell silent|stopped moving|raised a finger|obeyed", "silent|still|obedient", "ivory"),
  en("name cut in half|unsigned letter|empty portrait|lost key", "oblivion|gap in a name|at@back of the mind|blank in the story", "forgot|almost remembered|lost a name|said the wrong name", "forgotten|blurred|lost", "washed-out"),
  en("empty chair|lukewarm cup|coat on a hook|place setting", "absence|empty throne|vacant room|King's place", "left the room|pushed back a chair|left the door open|waited for someone", "still warm|empty|vacant", "pale grey"),
  // Age XI: the Blank
  en("chalk#m|pale thread|thin moon|white feather", "pale sky|thin night|dust of light|at@far edge", "paled|blanched|showed through|let the night go", "pale|thin|washed", "lilac"),
  en("faint line|ghost of a sword|chalk mark|snowflake", "snow#m|white field|faint path|almost-nothing", "fought anyway|flickered|held|persisted", "faint|almost erased|stubborn", "bone white"),
  en("page|note|doodle|folded corner", "margin|at@edge of the page|white of the paper|fold", "went over the line|wrote in the margin|folded a page|doodled", "narrow|white|unruled", "chalk white"),
  en("footprint|clean sheet|first word|new quill", "fresh snow#m|nothing|white expanse|unwritten place", "left the first footprint|took a step|began|waited in the white", "untouched|new|spotless", "white"),
  en("drop of ink|quill|inkwell|blot", "ink#m|at@tip of the quill|at@lip of the inkwell|white below", "hung at the tip|trembled|waited to fall|swelled", "black|wet|about to fall", "blue-black"),
  // Age XII: the First Mark
  en("point of light|pinprick|lone star|grain of light", "dark#m|at@centre|at@very beginning|smallest place", "looked|shone|appeared|waited to be seen", "small|alone|keen", "pearl"),
  en("spark|flint|warmth#m|wisp of straw", "warm dark|cupped hands#p|first fire|kindling#m", "warmed|caught|crackled|lit something", "warm|small|alive", "ember red"),
  en("breath|bubble of air|mist of a breath|small wind", "lungs#p|pause before|calm|inward breath", "breathed in|held a breath|breathed out|waited", "held|full|suspended", "misty"),
  en("plain cloak|lowered sword|open hand|brow without a crown", "quiet room|on@last step|at@end of the road|last room", "looked up|said thank you|lowered the sword|turned away", "kind|tired|plain", "hazel"),
  en("line of light|last star|first bird|gold thread", "dawn#m|at@edge of everything|seam of the day|not-yet", "grew|waited|halted|said not yet", "pale|growing|near", "dawn pink")
];

/** Biome lexicons, for the echoes past the written ones. */
export const EN_BIOMES: Record<string, EnLexicon> = {
  "green-plains": en("sheaf|scythe|ribbon|scarecrow's hat", "wheat#m|barn|hedgerow|farmhouse", "looked back|laid the table|counted the sheaves|rang the harvest bell", "still standing|dusty|warm", "gold"),
  "dark-forest": en("thorn|owl feather|root|carved name", "brambles#p|hollow oak|clearing|roots#p", "whispered a name|grew a thorn|bled|asked who", "thorny|mossy|listening", "dark green"),
  "forgotten-caves": en("pick|sky-shard|rune lamp|canary cage", "vault|gallery|mine shaft|deep vein", "dug|echoed|struck a vein|heard tomorrow", "frozen|echoing|deep", "glacier blue"),
  "corrupted-marsh": en("wedding ring|guttering flame|brick of peat|drowned letter", "mire|on@drowned road|sinking manor|reeds#p", "sank an inch|bowed|croaked|tried a cure", "sodden|rotting|faithful", "verdigris"),
  "fallen-king-ruins": en("faded banner|cracked bell|guard's spear|hound's collar", "great hall|throne room|on@stair|at@window", "saluted|kept watch|climbed the stair|faced the window", "colorless|cracked|loyal", "violet")
};

/** The King's own words (40). His deeds are said by him: "I sat down". */
export const EN_KING: KingLexicon<EnNoun, string> = enKing(
  "crown|cup|candle|key|cloak|ring|sword|hammer|boots#p|letter",
  "great hall|on@stair|garden|kitchens#p|chapel|orchard|stables#p|tower|courtyard|throne room",
  "sat down|waited up|counted the steps|walked the walls|listened for you|kept the fire going|watched the road|held the door|mended my cloak|talked to the dogs",
  "cold|warm|quiet|dark|old|heavy|still|tired|patient|faithful"
);

/** Célestine's words: what sings, where, how, and the sounds themselves. */
export const EN_SONGS: readonly SongLexicon<EnNoun, string>[] = [
  {
    ...en("crystal|little light|shard|glass", "air#m|crystals#p|hollow of your hand|Sanctum", "hummed|rang|sang back|went ting", "round|soft|sweet", "violet"),
    sounds: ["ting", "hmm", "la la", "shh"]
  },
  {
    ...en("essence|humming light|bead of glass|spark", "stones#p|hum|wind|dark", "whistled|chimed|purred|laughed", "bright|shy|happy", "blue"),
    sounds: ["ding", "ooh", "tink", "mm-hm"]
  },
  {
    ...en("Sky-Glass#m|star|moon|night", "cracks#p|high dome|deep blue|quiet", "rang like a spoon on a cup|sighed|sang very low|answered", "clear|distant|kind", "silver"),
    sounds: ["dong", "hush", "tilly-tink", "ah"]
  }
];
