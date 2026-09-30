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
      ask: "\"First guardian's ours. Just you and me, like the first night. The others can catch up.\"",
      kept: "She cuts a notch in the fence post, smaller than the rest. \"That one's for keeping your word.\"",
      broken: "She looks at the road ahead, then at you. \"Wasn't our night. Fine. I'll ask again. I always do, I think.\""
    },
    brom: {
      ask: "\"Leave the blade with me tonight. It's got a fold I don't like. You'll manage. You've got hands.\"",
      kept: "He hands it back at dusk, still warm. \"One night without it and you didn't die. I'm almost proud.\"",
      broken: "He watches you take it off the anvil, half done. \"It'll hold. Badly. Like everything rushed.\""
    },
    ysolde: {
      ask: "\"Stand still. All night. Keep the sword where it is and let me do the shooting.\"",
      kept: "\"You didn't move. Not once.\" She unstrings her bow. \"The trees noticed. They don't, usually.\"",
      broken: "Ysolde lowers her bow a finger's width. \"There's the root. You stepped on it anyway.\""
    },
    cendre: {
      ask: "\"If a priestess whose prayers smoke asks to join us tonight, tell her the road is full. Kindly. She bites.\"",
      kept: "He pours a third cup and leaves it by the fire, untouched. \"For her. She'd have hated the tea.\"",
      broken: "He folds his hands. \"Ah. Well. Promises are like tea. Some go cold. I shall pray a little further back.\""
    },
    nyx: {
      ask: "Nyx lays two fingers on your wrist, where the pulse is, and shakes her head. \"...Not tonight.\"",
      kept: "At dusk she lays the same two fingers on your wrist and counts. \"...Yours.\" She almost sounds glad.",
      broken: "The night catches your heartbeat again. Nyx takes her hand back and pulls her hood lower. \"...\""
    },
    garrick: {
      ask: "\"Not one shard to that stall tonight. Nor the forge. Humour me. I want to count them all at dusk.\"",
      kept: "He counts your shards twice, lips moving. \"All there. See? Stars keep, if you let them.\"",
      broken: "\"Thought so.\" He pats his pockets, counting what he still has. \"Never trust anyone near a stall. I don't, and I'm me.\""
    },
    seraphine: {
      ask: "\"At the Old Grove, give her ten breaths before anyone strikes. She has something to say to me first.\"",
      kept: "\"She said it.\" Séraphine wipes bark dust from her palms. \"I will not repeat it. It was for me.\"",
      broken: "\"You did not wait.\" She says it to the roots, not to you. The roots do not answer either."
    },
    thorvald: {
      ask: "\"Double or nothing! Bet you can't walk the night with every seam open half as long. Go on. I'm good for it.\"",
      kept: "He pays up in old coin, one piece short. \"You won. I hate that. Same bet tomorrow?\"",
      broken: "\"Ha! Knew it.\" He holds out a hand for his winnings, remembers what the stake was, and puts it away."
    },
    mirelle: {
      ask: "\"At the Baron's feet, hold everyone back. Fifteen breaths. I have a new one to try, and he has to be standing.\"",
      kept: "She writes a long time. \"No change. But he looked at me. Note the date. There isn't one. Note it anyway.\"",
      broken: "She corks the vial again and puts it back with the others. \"Tomorrow, then. He isn't going anywhere.\""
    },
    kaelen: {
      ask: "\"Let me walk at the head until the King falls. No one past me. It is a knight's place. I have not held it in a long time.\"",
      kept: "He reaches the throne first and does not look at it. \"Thank you. It is heavier than I remembered. The road.\"",
      broken: "He steps aside to let the others pass, and salutes each one. \"As you command.\" He means it. That is the worst of it."
    },
    oriane: {
      ask: "\"Tonight you go deeper than last night. It is not a request. I have already heard it. Do not make me wrong.\"",
      kept: "\"There. One step past yesterday.\" She tilts her head at the dark ahead. \"It sounds the same. It always does.\"",
      broken: "\"So I am wrong.\" She listens to it for a while. \"I had forgotten the sound. It is rather nice.\""
    },
    vorn: {
      ask: "\"At the Stone Devourer, nobody moves till Biscuit's had a sniff. Ten breaths. They're the same sort of hungry.\"",
      kept: "Biscuit comes back licking something that is not there any more. Vorn scratches his ears. \"Good boy. Don't tell me.\"",
      broken: "Biscuit sits down in the road and will not look at you. Vorn sighs. \"He'll sulk till dusk. He keeps count.\""
    },
    lysandre: {
      ask: "\"One king proves nothing. Bring down two tonight, a whole stratum between them. I need the second for a footnote.\"",
      kept: "He measures the night with a knotted string and nods. \"Fifty stretches, king to king. As I predicted. Mostly.\"",
      broken: "\"One king.\" He crosses out a line. \"Insufficient data. I shall blame the method, which was you.\""
    },
    ashka: {
      ask: "\"Walk without the monk tonight. His little flame makes mine look patient, and I am not.\"",
      kept: "\"A whole night without his tea.\" She warms her hands at nothing. \"Tell no one I looked for him twice.\"",
      broken: "She laughs, short. \"Of course. Nobody leaves him behind. It is his one talent.\""
    },
    nameless: {
      ask: "He stops you before the first stone and lays his gauntlet over your essences. It is very cold. He does not lift it.",
      kept: "At dusk he lifts the gauntlet himself, looks at what is still there, and bows.",
      broken: "He watches the stone take what you gave, and bows anyway. Lower than before."
    },
    eldra: {
      ask: "\"Every seam that closes on you, I mend before dusk. Tonight, spare me. Don't let one push you back.\"",
      kept: "She holds a thread up to the light. No knot in it. \"A whole night. I had forgotten what that looks like.\"",
      broken: "She is already threading the needle. \"It is nothing. I have mended worse. I have mended this one before.\""
    },
    morgrath: {
      ask: "\"I will not walk beside his knight tonight. Leave the tin conscience behind, and I shall be almost pleasant.\"",
      kept: "\"A night without his sighing.\" He adjusts a cuff that rotted off long ago. \"I was almost pleasant. Do not tell the Legion.\"",
      broken: "\"Your word. Yes. I collect those. They keep poorly.\" A long, rattling breath. \"I shall be insufferable, then.\""
    },
    celestine: {
      ask: "\"don't catch them tonight. any of them. let them fall, and listen. they sing differently when nobody reaches.\"",
      kept: "\"you heard it too.\" She hums a bar of it, wrong on purpose. \"they were singing about you. they do, when you let them.\"",
      broken: "\"oh.\" She stops humming. \"it's all right. they forgive fast. it's only light.\" She starts again, one note lower."
    },
    aurelion: {
      ask: "\"He was a king. When you reach him, give him ten breaths before the first blow. One does not strike a crown unannounced.\"",
      kept: "\"He nodded to you. Did you see?\" The great head lowers a little. \"Small one, that was well done.\"",
      broken: "\"No manners.\" He says it fondly, the way one speaks of weather. \"It is a young world. It will learn, or end.\""
    },
    awakened: {
      ask: "The Awakened steps off the road and sits down where the light is poor. One open hand, toward the dark ahead: go on.",
      kept: "At dusk the Awakened has not moved. The Awakened looks at your hands, then at two other hands, and for once they differ.",
      broken: "You call, and the Awakened rises at once and falls into step, copying your stride again, perfectly, with something like regret."
    }
  },
  fr: {
    maelle: {
      ask: "« Le premier gardien, c'est pour nous deux. Comme la première nuit. Les autres nous rattraperont. »",
      kept: "Elle taille une encoche dans le poteau, plus petite que les autres. « Celle-là, c'est pour la parole tenue. »",
      broken: "Elle regarde la route, puis toi. « Ce n'était pas notre nuit. Tant pis. Je redemanderai. Je redemande toujours, je crois. »"
    },
    brom: {
      ask: "« Laisse-moi ta lame cette nuit. Elle a un pli qui ne me plaît pas. Tu te débrouilleras. Tu as des mains. »",
      kept: "Il te la rend au crépuscule, encore tiède. « Une nuit sans elle et tu n'es pas mort. Je suis presque fier. »",
      broken: "Il te regarde la reprendre sur l'enclume, à moitié faite. « Elle tiendra. Mal. Comme tout ce qu'on presse. »"
    },
    ysolde: {
      ask: "« Ne bouge plus. De toute la nuit. Laisse l'épée où elle est, et laisse-moi tirer. »",
      kept: "« Tu n'as pas bougé. Pas une fois. » Elle détend son arc. « Les arbres l'ont remarqué. D'habitude, ils ne remarquent rien. »",
      broken: "Ysolde baisse son arc d'un doigt. « Voilà la racine. Tu as marché dessus quand même. »"
    },
    cendre: {
      ask: "« Si une prêtresse dont les prières fument veut nous rejoindre ce soir, dis-lui que la route est pleine. Gentiment. Elle mord. »",
      kept: "Il sert une troisième tasse et la laisse près du feu, intacte. « Pour elle. Elle aurait détesté le thé. »",
      broken: "Il joint les mains. « Ah. Bien. Les promesses, c'est comme le thé. Certaines refroidissent. Je prierai un peu plus en arrière. »"
    },
    nyx: {
      ask: "Nyx pose deux doigts sur ton poignet, là où bat le sang, et secoue la tête. « ...Pas cette nuit. »",
      kept: "Au crépuscule, elle repose les deux doigts sur ton poignet et compte. « ...Le tien. » On la croirait presque contente.",
      broken: "La nuit reprend ton cœur dans son rythme. Nyx retire sa main et tire sa capuche plus bas. « ... »"
    },
    garrick: {
      ask: "« Pas un éclat au Comptoir ce soir. Ni à la forge. Fais-moi plaisir. Je veux tous les compter au crépuscule. »",
      kept: "Il compte tes éclats deux fois, en remuant les lèvres. « Tout y est. Tu vois ? Les étoiles se gardent, si on les laisse. »",
      broken: "« Je m'en doutais. » Il tâte ses poches et compte ce qui lui reste. « Ne te fie à personne près d'un étal. Moi le premier. »"
    },
    seraphine: {
      ask: "« Au vieux bosquet, laisse-lui dix souffles avant le premier coup. Elle a quelque chose à me dire, d'abord. »",
      kept: "« Elle l'a dit. » Séraphine essuie la poussière d'écorce sur ses paumes. « Je ne le répéterai pas. C'était pour moi. »",
      broken: "« Tu n'as pas attendu. » Elle le dit aux racines, pas à toi. Les racines ne répondent pas non plus."
    },
    thorvald: {
      ask: "« Quitte ou double ! Je parie que tu ne tiens pas la nuit avec des coutures ouvertes moitié moins longtemps. Allez. Je suis solvable. »",
      kept: "Il paie en vieille monnaie, à une pièce près. « Tu as gagné. Je déteste ça. On remet ça demain ? »",
      broken: "« Ha ! Je le savais. » Il tend la main pour ses gains, se rappelle ce qu'on avait misé, et la range."
    },
    mirelle: {
      ask: "« Aux pieds du Baron, retiens tout le monde. Quinze souffles. J'en ai une nouvelle à essayer, et il faut qu'il soit debout. »",
      kept: "Elle écrit longtemps. « Aucun changement. Mais il m'a regardée. Note la date. Il n'y en a pas. Note-la quand même. »",
      broken: "Elle rebouche la fiole et la range avec les autres. « Demain, alors. Il ne va nulle part. »"
    },
    kaelen: {
      ask: "« Laisse-moi marcher en tête jusqu'à la chute du Roi. Personne après moi. C'est la place d'un chevalier. Je ne l'ai pas tenue depuis longtemps. »",
      kept: "Il arrive au trône le premier et ne le regarde pas. « Merci. Elle est plus lourde que dans mon souvenir. La route. »",
      broken: "Il s'écarte pour laisser passer les autres et salue chacun. « À tes ordres. » Il le pense. C'est bien le pire."
    },
    oriane: {
      ask: "« Cette nuit, tu vas plus loin que la nuit dernière. Ce n'est pas une demande. Je l'ai déjà entendu. Ne me fais pas mentir. »",
      kept: "« Voilà. Un pas plus loin qu'hier. » Elle penche la tête vers le noir. « Ça sonne pareil. Ça sonne toujours pareil. »",
      broken: "« Donc je me trompe. » Elle écoute ça un moment. « J'avais oublié le bruit que ça fait. C'est plutôt agréable. »"
    },
    vorn: {
      ask: "« Au Dévorateur de pierre, personne ne bouge tant que Biscuit n'a pas reniflé. Dix souffles. Ils ont la même faim, ces deux-là. »",
      kept: "Biscuit revient en léchant quelque chose qui n'est plus là. Vorn lui gratte les oreilles. « Bon chien. Ne me dis rien. »",
      broken: "Biscuit s'assoit au milieu de la route et refuse de te regarder. Vorn soupire. « Il va bouder jusqu'au crépuscule. Il compte. »"
    },
    lysandre: {
      ask: "« Un roi ne prouve rien. Fais-en tomber deux cette nuit, une strate entière entre eux. Il me faut le second pour une note de bas de page. »",
      kept: "Il mesure la nuit avec une ficelle à nœuds et hoche la tête. « Cinquante étapes, d'un roi à l'autre. Comme prévu. À peu près. »",
      broken: "« Un seul roi. » Il raye une ligne. « Données insuffisantes. J'accuserai la méthode, c'est-à-dire toi. »"
    },
    ashka: {
      ask: "« Marche sans le moine cette nuit. Sa petite flamme fait passer la mienne pour patiente, et je ne le suis pas. »",
      kept: "« Toute une nuit sans son thé. » Elle se chauffe les mains à rien. « Ne dis à personne que je l'ai cherché deux fois. »",
      broken: "Elle rit, bref. « Évidemment. Personne ne le laisse en arrière. C'est son seul talent. »"
    },
    nameless: {
      ask: "Il t'arrête devant la première pierre et pose son gantelet sur tes essences. Il est très froid. Il ne le retire pas.",
      kept: "Au crépuscule, il retire le gantelet lui-même, regarde ce qu'il reste, et s'incline.",
      broken: "Il regarde la pierre prendre ce que tu donnes, et s'incline quand même. Plus bas qu'avant."
    },
    eldra: {
      ask: "« Chaque couture qui se referme sur toi, je la reprise avant le crépuscule. Cette nuit, épargne-moi. Ne te laisse pas repousser. »",
      kept: "Elle lève un fil dans la lumière. Pas un nœud. « Une nuit entière. J'avais oublié à quoi ça ressemble. »",
      broken: "Elle enfile déjà son aiguille. « Ce n'est rien. J'ai reprisé pire. J'ai déjà reprisé celle-ci. »"
    },
    morgrath: {
      ask: "« Je ne marcherai pas à côté de son chevalier cette nuit. Laisse la conscience en fer-blanc derrière toi, et je serai presque aimable. »",
      kept: "« Une nuit sans ses soupirs. » Il rajuste une manchette tombée en poussière depuis longtemps. « J'ai été presque aimable. Pas un mot à la Légion. »",
      broken: "« Ta parole. Oui. Je les collectionne. Elles se conservent mal. » Un long souffle de crécelle. « Je serai donc insupportable. »"
    },
    celestine: {
      ask: "« n'en attrape aucun cette nuit. laisse-les tomber, et écoute. ils chantent autrement quand personne ne tend la main. »",
      kept: "« tu l'as entendu aussi. » Elle en fredonne une mesure, fausse exprès. « ils chantaient sur toi. ils le font, quand on les laisse. »",
      broken: "« oh. » Elle cesse de fredonner. « ce n'est rien. ils pardonnent vite. ce n'est que de la lumière. » Elle reprend, une note plus bas."
    },
    aurelion: {
      ask: "« C'était un roi. Devant lui, laisse-lui dix souffles avant le premier coup. On ne frappe pas une couronne sans s'annoncer. »",
      kept: "« Il t'a salué de la tête. Tu as vu ? » La grande tête s'abaisse un peu. « Petite chose, c'était bien fait. »",
      broken: "« Aucune manière. » Il le dit avec tendresse, comme on parle du temps qu'il fait. « C'est un monde jeune. Il apprendra, ou il finira. »"
    },
    awakened: {
      ask: "L'Éveillé quitte la route et s'assoit là où la lumière est pauvre. Une main ouverte, vers le noir devant : vas-y.",
      kept: "Au crépuscule, l'Éveillé n'a pas bougé. Il regarde tes mains, puis les siennes, et pour une fois elles diffèrent.",
      broken: "Tu l'appelles, et l'Éveillé se lève aussitôt et règle son pas sur le tien. Parfaitement, de nouveau. Il a l'air de le regretter."
    }
  }
};
