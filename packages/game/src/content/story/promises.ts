import type { Locale } from "../../i18n";
import type { PromiseText } from "../types";

/**
 * The Promise (BIBLE 12.11): what each companion asks at dusk, what they say when the
 * walker kept their word, and when it was broken. One request each, in their own voice.
 * The Nameless and the Awakened do not speak yet: theirs are gestures.
 */
export const PROMISES_TEXT: Record<Locale, Record<string, PromiseText>> = {
  en: {
    maelle: {
      ask: "\"Nobody else joins until the first guardian falls. Just you and me, like the first night. The others can catch up.\"",
      kept: "She cuts a notch in her fence post, smaller than the rest. \"That one's for keeping your word. I'll remember it, even if I forget you.\"",
      broken: "She looks at the road ahead, then at you. \"Wasn't our night, then. Fine. I'll ask again. I always do, I think.\""
    },
    brom: {
      ask: "\"Leave your weapon with me tonight. It's got a fold I don't like, and I want to fix it. You'll manage without it. You've got hands.\"",
      kept: "He hands it back at dusk, still warm from the anvil. \"One night without it and you didn't die. I'm almost proud.\"",
      broken: "He watches you take it off the anvil, half done. \"It'll hold. Badly. Like everything rushed.\""
    },
    ysolde: {
      ask: "\"Don't strike tonight. Not once. Keep your sword down and let me do the shooting. I have seen where you fall when you rush in.\"",
      kept: "\"You didn't strike. Not once.\" She unstrings her bow. \"And you're still standing. The trees noticed. They don't, usually.\"",
      broken: "Ysolde lowers her bow. \"You struck anyway. That's how you fell, on the night the trees showed me.\""
    },
    cendre: {
      ask: "\"If Ashka, the priestess of the Pyre, asks to join us tonight, tell her the road is full. Kindly. She bites.\"",
      kept: "He pours a third cup and leaves it by the fire, untouched. \"For Ashka. She'd have hated the tea. Thank you for keeping her away.\"",
      broken: "He folds his hands. \"Ah. Well. Promises are like tea. Some go cold. I shall pray a little further back from her.\""
    },
    nyx: {
      ask: "Nyx lays two fingers on your wrist, where the pulse is, and shakes her head. \"...No powers. Not tonight.\"",
      kept: "At dusk she lays the same two fingers on your wrist and counts. \"...Yours. Only yours.\" A whole night on your own heartbeat. She almost sounds glad.",
      broken: "You call on a power, and the night takes over your heartbeat again. Nyx pulls back her hand and her hood lower. \"...\""
    },
    garrick: {
      ask: "\"Not one shard to the Stallkeeper tonight. Not the forge, not the Caravan either. Humour me. I want to count them all at dusk.\"",
      kept: "He counts your shards twice, lips moving. \"All there. See? Pieces of sky keep, if you let them.\"",
      broken: "\"Thought so.\" He pats his pockets, counting what he still has. \"Never trust anyone near a stall. I don't, and I'm me.\""
    },
    seraphine: {
      ask: "\"At the Old Grove, give its Heart ten breaths before anyone strikes, then bring her down. She has something to tell me first.\"",
      kept: "\"She said it.\" Séraphine wipes bark dust from her palms. \"I will not repeat it. It was for me. Thank you for waiting.\"",
      broken: "\"You did not wait. She never got to say it.\" She says it to the roots, not to you. The roots do not answer either."
    },
    thorvald: {
      ask: "\"Double or nothing! Bet you can't beat every elite and guardian tonight in half the time. Go on. I'm good for it.\"",
      kept: "He pays up in old coin, one piece short. \"You won. I hate that. Same bet tomorrow?\"",
      broken: "\"Ha! Knew it. Pay me later.\" By dusk he has forgotten what the stake was. He always does."
    },
    mirelle: {
      ask: "\"At the Baron's feet, hold everyone back. Fifteen breaths. I have a new cure to try on him, and he has to be standing.\"",
      kept: "She writes a long time. \"No change. But he looked at me. Write that down. No date: nights here don't have any.\"",
      broken: "She corks the vial and puts it back with the others. \"No cure tonight, then. Tomorrow. He isn't going anywhere.\""
    },
    kaelen: {
      ask: "\"Let me walk at the head until the King falls. Nobody else joins before then. It is a knight's place, and I have not held it in a long time.\"",
      kept: "He reaches the throne first and does not look at it. \"Thank you. I walked at the head again, the way I was meant to, long ago.\"",
      broken: "He steps aside to let the others pass, and salutes each one. \"As you command.\" He means it. That is the worst of it."
    },
    oriane: {
      ask: "\"Tonight you go deeper than on your last night. It is not a request. I have already heard it happen. Do not make me wrong.\"",
      kept: "\"There. One stage past yesterday, as I heard it.\" She tilts her head at the dark ahead. \"It sounds the same. It always does.\"",
      broken: "\"So I was wrong. You did not go deeper.\" She listens to that for a while. \"I had forgotten what being wrong sounds like. It is rather nice.\""
    },
    vorn: {
      ask: "\"At the Stone Devourer, nobody strikes till Biscuit's had a sniff. Ten breaths. Then bring it down. They're the same sort of hungry.\"",
      kept: "Biscuit comes back licking something that is not there any more. Vorn scratches his ears. \"Good boy. Don't tell me what it was.\"",
      broken: "Biscuit sits down in the road and will not look at you. Vorn sighs. \"He never got his sniff. He'll sulk till dusk. He keeps count.\""
    },
    lysandre: {
      ask: "\"One king proves nothing. Bring down two tonight, a whole stratum between them. I need the second for a footnote.\"",
      kept: "He measures the night with a knotted string and nods. \"Fifty stages, king to king. As I predicted. Mostly.\"",
      broken: "\"One king.\" He crosses out a line. \"Insufficient data. I shall blame the method, which was you.\""
    },
    ashka: {
      ask: "\"Walk without Brother Cinder tonight. His little flame makes mine look patient, and I am not.\"",
      kept: "\"A whole night without his tea.\" She warms her hands at nothing. \"Tell no one I looked for him twice.\"",
      broken: "She laughs, short. \"Of course you took him. Nobody leaves him behind. It is his one talent.\""
    },
    nameless: {
      ask: "He stops you before the altars and lays his gauntlet over your essences. It is very cold. He does not lift it: nothing offered tonight.",
      kept: "At dusk he lifts the gauntlet himself, looks at the essences still in your hands, and bows.",
      broken: "He watches the altar take what you gave it, and bows anyway. Lower than before."
    },
    eldra: {
      ask: "\"Every time a guardian's seam closes on you, I mend the tear before dusk. Tonight, spare me. Don't let a single seam close.\"",
      kept: "She holds a thread up to the light. No knot in it. \"A whole night with nothing to mend. I had forgotten what that looks like.\"",
      broken: "She is already threading the needle. \"It is nothing. I have mended worse. I have mended this one before.\""
    },
    morgrath: {
      ask: "\"I will not walk beside the King's knight tonight. Leave Kaelen and his tin conscience behind, and I shall be almost pleasant.\"",
      kept: "\"A night without his sighing.\" He adjusts a cuff that rotted off long ago. \"I was almost pleasant. Do not tell the Legion.\"",
      broken: "\"Your word. Yes. I collect those. They keep poorly.\" A long, rattling breath. \"I shall be insufferable, then.\""
    },
    celestine: {
      ask: "\"don't catch any crystals tonight. not one. let them fall, and listen. they sing differently when nobody reaches.\"",
      kept: "\"you heard it too.\" She hums a bar of it, wrong on purpose. \"they were singing about you. they do, when you let them.\"",
      broken: "\"oh. you caught one.\" She stops humming. \"it's all right. they forgive fast. it's only light.\" She starts again, one note lower."
    },
    aurelion: {
      ask: "\"He was a king. When you reach him, give him ten breaths before the first blow. One does not strike a crown unannounced.\"",
      kept: "\"He nodded to you. Did you see?\" The great head lowers a little. \"Small one, that was well done.\"",
      broken: "\"No manners.\" He says it fondly, the way one speaks of weather. \"It is a young world. It will learn, or end.\""
    },
    awakened: {
      ask: "The Awakened steps off the road and sits down, then points one open hand at the dark ahead: go on without it tonight.",
      kept: "At dusk the Awakened is still sitting where you left it. It looks at its hands, then at yours. Tonight, for once, they did different things.",
      broken: "You call, and the Awakened rises at once and falls into step, copying your stride again, perfectly, with something like regret."
    }
  },
  fr: {
    maelle: {
      ask: "« Personne d'autre ne nous rejoint avant la chute du premier gardien. Rien que toi et moi, comme la première nuit. Les autres nous rattraperont. »",
      kept: "Elle taille une encoche dans son poteau, plus petite que les autres. « Celle-là, c'est pour la parole tenue. Je m'en souviendrai, même si je t'oublie. »",
      broken: "Elle regarde la route, puis toi. « Ce n'était pas notre nuit, alors. Tant pis. Je redemanderai. Je redemande toujours, je crois. »"
    },
    brom: {
      ask: "« Laisse-moi ton arme cette nuit. Elle a un pli qui ne me plaît pas, je veux le reprendre. Tu te débrouilleras sans. Tu as des mains. »",
      kept: "Il te la rend au crépuscule, encore tiède de l'enclume. « Une nuit sans elle et tu n'es pas mort. Je suis presque fier. »",
      broken: "Il te regarde la reprendre sur l'enclume, à moitié faite. « Elle tiendra. Mal. Comme tout ce qu'on presse. »"
    },
    ysolde: {
      ask: "« Ne frappe pas cette nuit. Pas une fois. Garde l'épée baissée et laisse-moi tirer. J'ai vu où tu tombes quand tu te précipites. »",
      kept: "« Tu n'as pas frappé. Pas une fois. » Elle détend son arc. « Et tu es encore debout. Les arbres l'ont remarqué. D'habitude, ils ne remarquent rien. »",
      broken: "Ysolde baisse son arc. « Tu as frappé quand même. C'est comme ça que tu es tombé, la nuit que les arbres m'ont montrée. »"
    },
    cendre: {
      ask: "« Si Ashka, la prêtresse du Bûcher, veut nous rejoindre cette nuit, dis-lui que la route est pleine. Gentiment. Elle mord. »",
      kept: "Il sert une troisième tasse et la laisse près du feu, intacte. « Pour Ashka. Elle aurait détesté le thé. Merci de l'avoir tenue à l'écart. »",
      broken: "Il joint les mains. « Ah. Bien. Les promesses, c'est comme le thé. Certaines refroidissent. Je prierai un peu plus loin d'elle. »"
    },
    nyx: {
      ask: "Nyx pose deux doigts sur ton poignet, là où bat le sang, et secoue la tête. « ...Pas de pouvoirs. Pas cette nuit. »",
      kept: "Au crépuscule, elle repose les deux doigts sur ton poignet et compte. « ...Le tien. Rien que le tien. » Toute une nuit sur ton propre cœur. On la croirait presque contente.",
      broken: "Tu appelles un pouvoir, et la nuit reprend ton cœur dans son rythme. Nyx retire sa main et tire sa capuche plus bas. « ... »"
    },
    garrick: {
      ask: "« Pas un éclat au Comptoir cette nuit. Ni à la forge, ni à la Roulotte. Fais-moi plaisir. Je veux tous les compter au crépuscule. »",
      kept: "Il compte tes éclats deux fois, en remuant les lèvres. « Tout y est. Tu vois ? Les morceaux de ciel se gardent, si on les laisse. »",
      broken: "« Je m'en doutais. » Il tâte ses poches et compte ce qui lui reste. « Ne te fie à personne près d'un étal. Moi le premier. »"
    },
    seraphine: {
      ask: "« Au vieux bosquet, laisse à son Cœur dix souffles avant le premier coup, puis abats-la. Elle a quelque chose à me dire, d'abord. »",
      kept: "« Elle l'a dit. » Séraphine essuie la poussière d'écorce sur ses paumes. « Je ne le répéterai pas. C'était pour moi. Merci d'avoir attendu. »",
      broken: "« Tu n'as pas attendu. Elle n'a pas pu le dire. » Elle le dit aux racines, pas à toi. Les racines ne répondent pas non plus."
    },
    thorvald: {
      ask: "« Quitte ou double ! Je parie que tu ne bats pas chaque élite et chaque gardien de la nuit en moitié moins de temps. Allez. Je suis solvable. »",
      kept: "Il paie en vieille monnaie, à une pièce près. « Tu as gagné. Je déteste ça. On remet ça demain ? »",
      broken: "« Ha ! Je le savais. Tu me paieras plus tard. » Au crépuscule, il a oublié ce qu'on avait misé. Comme toujours."
    },
    mirelle: {
      ask: "« Aux pieds du Baron, retiens tout le monde. Quinze souffles. J'ai un nouveau remède à essayer sur lui, et il faut qu'il soit debout. »",
      kept: "Elle écrit longtemps. « Aucun changement. Mais il m'a regardée. Note-le. Sans date : ici, les nuits n'en ont pas. »",
      broken: "Elle rebouche la fiole et la range avec les autres. « Pas de remède cette nuit, alors. Demain. Il ne va nulle part. »"
    },
    kaelen: {
      ask: "« Laisse-moi marcher en tête jusqu'à la chute du Roi. Personne d'autre ne nous rejoint avant. C'est la place d'un chevalier, et je ne l'ai pas tenue depuis longtemps. »",
      kept: "Il arrive au trône le premier et ne le regarde pas. « Merci. J'ai de nouveau marché en tête, comme j'aurais dû le faire, il y a longtemps. »",
      broken: "Il s'écarte pour laisser passer les autres et salue chacun. « À tes ordres. » Il le pense. C'est bien le pire."
    },
    oriane: {
      ask: "« Cette nuit, tu vas plus loin que ta dernière nuit. Ce n'est pas une demande. Je l'ai déjà entendu arriver. Ne me fais pas mentir. »",
      kept: "« Voilà. Une étape plus loin qu'hier, comme je l'ai entendu. » Elle penche la tête vers le noir. « Ça sonne pareil. Ça sonne toujours pareil. »",
      broken: "« Donc je me suis trompée. Tu n'es pas allé plus loin. » Elle écoute ça un moment. « J'avais oublié le bruit que fait une erreur. C'est plutôt agréable. »"
    },
    vorn: {
      ask: "« Au Dévorateur de pierre, personne ne frappe tant que Biscuit n'a pas reniflé. Dix souffles. Ensuite, abats-le. Ils ont la même faim, ces deux-là. »",
      kept: "Biscuit revient en léchant quelque chose qui n'est plus là. Vorn lui gratte les oreilles. « Bon chien. Ne me dis pas ce que c'était. »",
      broken: "Biscuit s'assoit au milieu de la route et refuse de te regarder. Vorn soupire. « Il n'a pas pu renifler. Il va bouder jusqu'au crépuscule. Il compte. »"
    },
    lysandre: {
      ask: "« Un roi ne prouve rien. Fais-en tomber deux cette nuit, une strate entière entre eux. Il me faut le second pour une note de bas de page. »",
      kept: "Il mesure la nuit avec une ficelle à nœuds et hoche la tête. « Cinquante étapes, d'un roi à l'autre. Comme prévu. À peu près. »",
      broken: "« Un seul roi. » Il raye une ligne. « Données insuffisantes. J'accuserai la méthode, c'est-à-dire toi. »"
    },
    ashka: {
      ask: "« Marche sans Frère Cendre cette nuit. Sa petite flamme fait passer la mienne pour patiente, et je ne le suis pas. »",
      kept: "« Toute une nuit sans son thé. » Elle se chauffe les mains à rien. « Ne dis à personne que je l'ai cherché deux fois. »",
      broken: "Elle rit, bref. « Évidemment, tu l'as pris. Personne ne le laisse en arrière. C'est son seul talent. »"
    },
    nameless: {
      ask: "Il t'arrête devant les autels et pose son gantelet sur tes essences. Il est très froid. Il ne le retire pas : rien à offrir, cette nuit.",
      kept: "Au crépuscule, il retire le gantelet lui-même, regarde les essences encore dans tes mains, et s'incline.",
      broken: "Il regarde l'autel prendre ce que tu lui donnes, et s'incline quand même. Plus bas qu'avant."
    },
    eldra: {
      ask: "« Chaque fois que la couture d'un gardien se referme sur toi, je reprise la déchirure avant le crépuscule. Cette nuit, épargne-moi. Qu'aucune ne se referme. »",
      kept: "Elle lève un fil dans la lumière. Pas un nœud. « Toute une nuit sans rien à repriser. J'avais oublié à quoi ça ressemble. »",
      broken: "Elle enfile déjà son aiguille. « Ce n'est rien. J'ai reprisé pire. J'ai déjà reprisé celle-ci. »"
    },
    morgrath: {
      ask: "« Je ne marcherai pas à côté du chevalier du Roi cette nuit. Laisse Kaelen et sa conscience en fer-blanc derrière toi, et je serai presque aimable. »",
      kept: "« Une nuit sans ses soupirs. » Il rajuste une manchette tombée en poussière depuis longtemps. « J'ai été presque aimable. Pas un mot à la Légion. »",
      broken: "« Ta parole. Oui. Je les collectionne. Elles se conservent mal. » Un long souffle de crécelle. « Je serai donc insupportable. »"
    },
    celestine: {
      ask: "« n'attrape aucun cristal cette nuit. pas un seul. laisse-les tomber, et écoute. ils chantent autrement quand personne ne tend la main. »",
      kept: "« tu l'as entendu aussi. » Elle en fredonne une mesure, fausse exprès. « ils chantaient sur toi. ils le font, quand on les laisse. »",
      broken: "« oh. tu en as attrapé un. » Elle cesse de fredonner. « ce n'est rien. ils pardonnent vite. ce n'est que de la lumière. » Elle reprend, une note plus bas."
    },
    aurelion: {
      ask: "« C'était un roi. Devant lui, laisse-lui dix souffles avant le premier coup. On ne frappe pas une couronne sans s'annoncer. »",
      kept: "« Il t'a salué de la tête. Tu as vu ? » La grande tête s'abaisse un peu. « Petite chose, c'était bien fait. »",
      broken: "« Aucune manière. » Il le dit avec tendresse, comme on parle du temps qu'il fait. « C'est un monde jeune. Il apprendra, ou il finira. »"
    },
    awakened: {
      ask: "L'Éveillé quitte la route et s'assoit, puis tend une main ouverte vers le noir devant toi : continue sans lui cette nuit.",
      kept: "Au crépuscule, l'Éveillé est toujours assis là où tu l'as laissé. Il regarde ses mains, puis les tiennes. Cette nuit, pour une fois, elles ont fait autre chose.",
      broken: "Tu l'appelles, et l'Éveillé se lève aussitôt et règle son pas sur le tien. Parfaitement, de nouveau. Il a l'air de le regretter."
    }
  }
};
