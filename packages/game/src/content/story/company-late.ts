import type { Locale } from "../../i18n";
import type { CompanyText } from "../types";

/**
 * Recognition memories and hire lines of the nine late companions (BIBLE 10.3, 12.2), and
 * Aldric's seven Lessons (BIBLE 10.2), keyed by the talent that teaches them.
 */
export const COMPANY_LATE_TEXT: Record<Locale, CompanyText> = {
  en: {
    memories: {
      vorn: [
        { by: "Vorn", text: "Biscuit growls at you from the back of the pack. The wolves step away from him, not from you. Vorn rubs his neck. \"He never does that.\"" },
        { by: "Vorn", text: "Biscuit ignores you all night, with enormous care. Vorn nods, pleased. \"That's his way of saying he's thinking about it.\"" },
        { by: "Vorn", text: "Biscuit lies down across your feet. Where he touches your boots, the leather goes a little pale. \"Don't move. He's choosing you.\"" },
        { by: "Vorn", text: "Vorn, by the fire: \"Found him where a third of the land went missing. Sitting in nothing. Wagging, I think.\"" },
        { by: "Vorn", text: "Vorn says the name. It is not a word." }
      ],
      lysandre: [
        { by: "Lysandre", text: "You said nothing, and Lysandre corrects it anyway. \"Stratum, singular. Strata, plural. You were thinking it wrong.\"" },
        { by: "Lysandre", text: "He unrolls his map over the fire and weighs the corners with your boots. \"Echo, Ash, Void, Astral, Primordial. All named by me. You may admire it.\"" },
        { by: "Lysandre", text: "At the foot of the map, in his neatest hand: BOTTOM. Underlined twice. In the margin, a spell copied backwards, stopped halfway. He folds it away." },
        { by: "Lysandre", text: "He tears the map in two, slowly, right through the word BOTTOM. \"The ground kept going. Frankly rude of it.\"" },
        { by: "Lysandre", text: "\"I was wrong. It is the best thing that has happened to me in a thousand nights.\"" }
      ],
      ashka: [
        { by: "Ashka", text: "Ashka bars the road with her staff. \"What are you fighting for? Think first. Almost everyone gets it wrong.\"" },
        { by: "Ashka", text: "She laughs at the answer you never said aloud. \"Keeping the night? You're guarding a locked door from the wrong side.\"" },
        { by: "Ashka", text: "She turns her face to where the sun should rise. \"It was warm once. Everywhere. I have read it. I have felt it in the ash.\"" },
        { by: "Ashka", text: "\"My brother keeps a little flame in a jar and calls it faith. I wanted the whole fire.\" She does not say his name. She does not need to." },
        { by: "Ashka", text: "\"If you ever reach the Dawn, open the window for me.\"" }
      ],
      nameless: [
        { by: "The Nameless", text: "The Nameless stops before you and bows, low and slow, the way knights once bowed to kings. His armor makes no sound at all." },
        { by: "The Nameless", text: "He no longer walks behind you. He walks at your side, matching your stride exactly, as if he had learned it a long time ago." },
        { by: "The Nameless", text: "He speaks for the first time. The voice comes from further back than the helmet. \"How many?\" He is looking at your essences." },
        { by: "The Nameless", text: "He closes your fingers over the last of your essences, gently, one by one. \"Keep some.\"" },
        { by: "The Nameless", text: "He lifts off his helmet. Inside, nothing. Scratched into the steel, a single word, worn by a thumb: Aldric." }
      ],
      eldra: [
        { by: "Eldra", text: "Eldra draws a loose thread from your sleeve and rolls it between two fingers. \"Yours. I would know it anywhere. It runs very long.\"" },
        { by: "Eldra", text: "Your cloak is torn at the shoulder. She mends it with a thread of light that does not quite match, and bites it off. \"There. It will hold tonight.\"" },
        { by: "Eldra", text: "She never says \"the King\". She says \"him\", and her hands stop weaving for as long as the word lasts." },
        { by: "Eldra", text: "\"I made this. I am sorry.\" A long quiet, and the shuttle moves again. \"I am not sorry.\"" },
        { by: "Eldra", text: "She leads you off the road. A loom taller than the keep, strung with every night there has been. One thread is still moving: yours." }
      ],
      morgrath: [
        { by: "Morgrath", text: "\"You. The sword with no conversation. Do try not to die before I have finished despising you.\"" },
        { by: "Morgrath", text: "\"Aldric. Yes, I learned it. One likes to know exactly whom one is insulting.\"" },
        { by: "Morgrath", text: "\"Death is a door. He nailed it shut and sat down in front of it. Every soul in Orvane is owed a morning, and he keeps it under his crown.\"" },
        { by: "Morgrath", text: "He watches the Sky-Glass for a long time. \"It is beautiful. The night. Do not repeat that. I have a reputation.\"" },
        { by: "Morgrath", text: "\"When it ends, and it will, I will be there to see you out. Politely.\"" }
      ],
      celestine: [
        { by: "Célestine", text: "Célestine hums while the essences gather. There is a word in the tune. It takes you a moment to know it is your name." },
        { by: "Célestine", text: "She is humming your name before you arrive, then looks surprised to see you. \"oh. it's you. the light told me first.\"" },
        { by: "Célestine", text: "\"listen. the crystals change key when you're here. they go warm, like a kettle about to sing.\"" },
        { by: "Célestine", text: "She tilts her head at the sky. \"someone is watching us. isn't it nice? the light hums louder when they do.\"" },
        { by: "Célestine", text: "She sings, very slowly: \"hush now, the lamp is lit, the window's warm, the world can wait...\" You have never heard it. You have always known it." }
      ],
      aurelion: [
        { by: "Aurelion", text: "Aurelion lowers his head until one golden eye fills the road. \"Small one. You walk as if the ground owed you something. I approve.\"" },
        { by: "Aurelion", text: "\"Aldric.\" He says it the way one sets down a cup of very fine glass. \"A small name. It carries well.\"" },
        { by: "Aurelion", text: "\"Before your kingdom, others. I flew over them. Yours is not the first world someone has left a lamp burning for.\"" },
        { by: "Aurelion", text: "\"I saw a dawn, once. It was very quiet and very kind, and afterward there was no one left to say so.\"" },
        { by: "Aurelion", text: "\"I chose your side because you keep coming back. The last world did not have anyone who did.\"" }
      ],
      awakened: [
        { by: "The Awakened", text: "Across the fire, the Awakened stands exactly as you stand. You shift your weight. So does the Awakened, the same instant, the same foot." },
        { by: "The Awakened", text: "You wipe your blade on your sleeve, the way you always do. Across the road, the Awakened wipes a blade that is not there." },
        { by: "The Awakened", text: "The Awakened's lips move a moment before you would have spoken, had you ever spoken. The words land in you one breath late." },
        { by: "The Awakened", text: "One dusk you draw your sword, and the Awakened does not. The Awakened only watches you, very still, waiting to see what you do on your own." },
        { by: "The Awakened", text: "\"Hello.\"" }
      ]
    },
    hireLines: {
      vorn: [
        "He doesn't bite. He unmakes. Different thing.",
        "Biscuit's sniffing you. Odd. He only sniffs things he's met.",
        "Biscuit, look who's back. Yes. Yes, I know."
      ],
      lysandre: [
        "Fascinating. Stand still while I set it on fire.",
        "Have I lectured you before? You nod in all the right places.",
        "Ah, there you are. Sit. I've been wrong about several new things."
      ],
      ashka: [
        "Everything burns eventually. I'm just punctual.",
        "You. I've set you on fire before, haven't I? You didn't seem to mind.",
        "Back again. Good. The sun won't open its own door."
      ],
      nameless: [
        "...",
        "...",
        "Keep some."
      ],
      eldra: [
        "Hush. You'll wake it.",
        "Your thread again. No, don't tell me. I counted.",
        "Sit. Mind the loose ends. Some of them are yours."
      ],
      morgrath: [
        "Life is overrated. I should know. I've tried both.",
        "Have we met? I'd remember despising something so persistent.",
        "Back again, Aldric. Good. Someone has to watch you do this properly."
      ],
      celestine: [
        "Shh. Listen. The light is humming.",
        "oh! your song. I know your song. don't I?",
        "there you are. the crystals have been humming you all dusk."
      ],
      aurelion: [
        "Kneel. No, not to me. To the view.",
        "Small one. You smell of an old friend. Curious.",
        "Aldric. Climb on, if you like. The view has missed you."
      ],
      awakened: [
        "...",
        "...",
        "..."
      ]
    },
    lessons: {
      "aldric-10": { by: "The Sword-Mother", text: "Hold the sword like a bird: tight enough that it cannot fly, loose enough that it can breathe." },
      "aldric-25": { by: "Brom", text: "A good blade hums for a long while after the blow. Listen to it. It's telling you where to go next." },
      "aldric-50": { by: "The Sword-Mother", text: "Every Remnant has a seam, like a coat sewn in a hurry. Do not cut the coat. Cut the thread." },
      "aldric-75": { by: "Kaelen", text: "A heroic blow is only an ordinary one that you did not run from." },
      "aldric-100": { by: "The Sword-Mother", text: "Every cut you have ever made is still in your arm. On the bad nights, let them all swing with you." },
      "aldric-150": { by: "The Sword-Mother", text: "Any sword will do. Master is what the sword calls you, never what you call yourself." },
      "aldric-200": { by: "The King", text: "A legend is only someone who kept walking after the song ended." }
    }
  },
  fr: {
    memories: {
      vorn: [
        { by: "Vorn", text: "Biscuit gronde contre toi, au fond de la meute. Les loups s'écartent de lui, pas de toi. Vorn se gratte la nuque. « Il ne fait jamais ça. »" },
        { by: "Vorn", text: "Biscuit t'ignore toute la nuit, avec un soin remarquable. Vorn hoche la tête, content. « C'est sa façon de dire qu'il réfléchit. »" },
        { by: "Vorn", text: "Biscuit se couche en travers de tes pieds. Là où il touche tes bottes, le cuir pâlit un peu. « Bouge pas. Il te choisit. »" },
        { by: "Vorn", text: "Vorn, près du feu : « Je l'ai trouvé là où un tiers du pays a disparu. Assis dans le rien. Il remuait la queue, je crois. »" },
        { by: "Vorn", text: "Vorn dit le nom. Ce n'est pas un mot." }
      ],
      lysandre: [
        { by: "Lysandre", text: "Tu n'as rien dit, et Lysandre te corrige quand même. « Une strate, des strates. Tu le pensais de travers. »" },
        { by: "Lysandre", text: "Il déroule sa carte sur le feu et cale les coins avec tes bottes. « Écho, Cendre, Néant, Astral, Primordial. Tout est de moi. Tu peux admirer. »" },
        { by: "Lysandre", text: "Au pied de la carte, de sa plus belle écriture : FOND. Souligné deux fois. Dans la marge, un sort recopié à l'envers, arrêté au milieu. Il replie tout." },
        { by: "Lysandre", text: "Il déchire la carte en deux, lentement, en plein milieu du mot FOND. « Le sol a continué. C'est d'une impolitesse. »" },
        { by: "Lysandre", text: "« Je me suis trompé. C'est la plus belle chose qui me soit arrivée en mille nuits. »" }
      ],
      ashka: [
        { by: "Ashka", text: "Ashka te barre la route de son bâton. « Tu te bats pour quoi ? Réfléchis d'abord. Presque tout le monde se trompe. »" },
        { by: "Ashka", text: "Elle rit de la réponse que tu n'as jamais dite. « Garder la nuit ? Tu montes la garde devant une porte fermée, du mauvais côté. »" },
        { by: "Ashka", text: "Elle tourne le visage vers l'endroit où le soleil devrait se lever. « Il faisait chaud, avant. Partout. Je l'ai lu. Je l'ai senti dans la cendre. »" },
        { by: "Ashka", text: "« Mon frère garde une petite flamme dans un bocal et appelle ça la foi. Moi, je voulais tout le feu. » Elle ne dit pas son nom. Pas besoin." },
        { by: "Ashka", text: "« Si tu atteins l'Aube un jour, ouvre la fenêtre pour moi. »" }
      ],
      nameless: [
        { by: "Le Sans-Nom", text: "Le Sans-Nom s'arrête devant toi et s'incline, bas et lent, comme les chevaliers devant les rois d'autrefois. Son armure ne fait aucun bruit." },
        { by: "Le Sans-Nom", text: "Il ne marche plus derrière toi. Il marche à ta hauteur, exactement de ton pas, comme s'il l'avait appris il y a longtemps." },
        { by: "Le Sans-Nom", text: "Il parle pour la première fois. La voix vient de plus loin que le heaume. « Combien ? » Il regarde tes essences." },
        { by: "Le Sans-Nom", text: "Il referme tes doigts sur tes dernières essences, doucement, un par un. « Gardes-en. »" },
        { by: "Le Sans-Nom", text: "Il ôte son heaume. Dedans, rien. Gravé dans l'acier, un seul mot, usé par un pouce : Aldric." }
      ],
      eldra: [
        { by: "Eldra", text: "Eldra tire un fil qui dépasse de ta manche et le roule entre deux doigts. « Le tien. Je le reconnaîtrais entre tous. Il est très long. »" },
        { by: "Eldra", text: "Ta cape est déchirée à l'épaule. Elle la reprise d'un fil de lumière pas tout à fait assorti, et le coupe avec les dents. « Voilà. Ça tiendra cette nuit. »" },
        { by: "Eldra", text: "Elle ne dit jamais « le roi ». Elle dit « lui », et ses mains cessent de tisser le temps que dure le mot." },
        { by: "Eldra", text: "« J'ai fait ça. Je suis désolée. » Un long silence, puis la navette repart. « Je ne suis pas désolée. »" },
        { by: "Eldra", text: "Elle t'emmène hors de la route. Un métier à tisser plus haut que le donjon, tendu de toutes les nuits qui ont été. Un seul fil bouge encore : le tien." }
      ],
      morgrath: [
        { by: "Morgrath", text: "« Toi. L'épée sans conversation. Tâche de ne pas mourir avant que j'aie fini de te mépriser. »" },
        { by: "Morgrath", text: "« Aldric. Oui, je l'ai retenu. On aime savoir précisément qui l'on insulte. »" },
        { by: "Morgrath", text: "« La mort est une porte. Il l'a clouée, et il s'est assis devant. Chaque âme d'Orvane me doit un matin, et il le garde sous sa couronne. »" },
        { by: "Morgrath", text: "Il regarde longtemps la Voûte de verre. « C'est beau. La nuit. Ne le répète pas. J'ai une réputation. »" },
        { by: "Morgrath", text: "« Quand ça finira, et ça finira, je serai là pour te raccompagner. Poliment. »" }
      ],
      celestine: [
        { by: "Célestine", text: "Célestine fredonne pendant que les essences s'assemblent. Il y a un mot dans l'air. Tu mets un instant à comprendre que c'est ton nom." },
        { by: "Célestine", text: "Elle fredonne ton nom avant que tu arrives, puis s'étonne de te voir. « oh. c'est toi. la lumière me l'a dit avant. »" },
        { by: "Célestine", text: "« écoute. les cristaux changent de note quand tu es là. ils chauffent, comme une bouilloire qui va chanter. »" },
        { by: "Célestine", text: "Elle penche la tête vers le ciel. « quelqu'un nous regarde. c'est doux, non ? la lumière chante plus fort quand il regarde. »" },
        { by: "Célestine", text: "Elle chante, tout doucement : « chut, la lampe est allumée, la fenêtre est chaude, le monde peut attendre... » Tu ne l'as jamais entendue. Tu l'as toujours sue." }
      ],
      aurelion: [
        { by: "Aurelion", text: "Aurelion baisse la tête jusqu'à ce qu'un œil d'or remplisse la route. « Petite chose. Tu marches comme si le sol te devait quelque chose. J'approuve. »" },
        { by: "Aurelion", text: "« Aldric. » Il le prononce comme on pose une coupe de verre très fin. « Un petit nom. Il porte loin. »" },
        { by: "Aurelion", text: "« Avant ton royaume, d'autres. Je les ai survolés. Le tien n'est pas le premier monde pour qui quelqu'un laisse une lampe allumée. »" },
        { by: "Aurelion", text: "« J'ai vu une aube, une fois. Elle était très calme, très douce, et après, il n'y avait plus personne pour le dire. »" },
        { by: "Aurelion", text: "« J'ai choisi ton camp parce que tu reviens toujours. Le dernier monde n'avait personne qui revenait. »" }
      ],
      awakened: [
        { by: "L'Éveillé", text: "De l'autre côté du feu, l'Éveillé se tient exactement comme toi. Tu changes d'appui. Lui aussi, au même instant, sur le même pied." },
        { by: "L'Éveillé", text: "Tu essuies ta lame sur ta manche, comme toujours. De l'autre côté de la route, l'Éveillé essuie une lame qui n'est pas là." },
        { by: "L'Éveillé", text: "Les lèvres de l'Éveillé bougent un instant avant que tu ne parles, si tu parlais jamais. Les mots arrivent en toi avec un souffle de retard." },
        { by: "L'Éveillé", text: "Un soir, tu tires l'épée, et l'Éveillé ne la tire pas. Il te regarde, immobile, comme pour voir ce que tu fais seul." },
        { by: "L'Éveillé", text: "« Bonjour. »" }
      ]
    },
    hireLines: {
      vorn: [
        "Il ne mord pas. Il défait. Ce n'est pas pareil.",
        "Biscuit te renifle. Bizarre. Il ne renifle que ce qu'il connaît.",
        "Biscuit, regarde qui revient. Oui. Oui, je sais."
      ],
      lysandre: [
        "Fascinant. Ne bouge pas, je vais y mettre le feu.",
        "Je t'ai déjà fait la leçon ? Tu hoches la tête aux bons endroits.",
        "Ah, te voilà. Assieds-toi. Je me suis trompé sur plein de choses nouvelles."
      ],
      ashka: [
        "Tout finit par brûler. Moi, je suis juste ponctuelle.",
        "Toi. Je t'ai déjà mis le feu, non ? Tu n'avais pas l'air d'en vouloir.",
        "Te revoilà. Tant mieux. Le soleil n'ouvrira pas la porte tout seul."
      ],
      nameless: [
        "...",
        "...",
        "Gardes-en."
      ],
      eldra: [
        "Chut. Tu vas le réveiller.",
        "Encore ton fil. Non, ne dis rien. J'ai compté.",
        "Assieds-toi. Attention aux bouts qui dépassent. Certains sont à toi."
      ],
      morgrath: [
        "La vie est surfaite. Je suis bien placé pour le savoir : j'ai essayé les deux.",
        "On se connaît ? Je me souviendrais d'avoir méprisé quelque chose d'aussi têtu.",
        "Encore là, Aldric. Bien. Il faut quelqu'un pour te regarder faire correctement."
      ],
      celestine: [
        "Chut. Écoute. La lumière fredonne.",
        "oh ! ta chanson. je connais ta chanson. non ?",
        "te voilà. les cristaux t'ont fredonné tout le crépuscule."
      ],
      aurelion: [
        "À genoux. Non, pas devant moi. Devant la vue.",
        "Petite chose. Tu as l'odeur d'un vieil ami. Curieux.",
        "Aldric. Monte, si tu veux. La vue s'ennuyait de toi."
      ],
      awakened: [
        "...",
        "...",
        "..."
      ]
    },
    lessons: {
      "aldric-10": { by: "La Mère-des-Épées", text: "Tiens l'épée comme un oiseau : assez fort pour qu'il ne s'envole pas, assez doucement pour qu'il respire." },
      "aldric-25": { by: "Brom", text: "Une bonne lame chante longtemps après le coup. Écoute-la. Elle te dit où aller ensuite." },
      "aldric-50": { by: "La Mère-des-Épées", text: "Chaque Vestige a une couture, comme un manteau cousu trop vite. Ne coupe pas le manteau. Coupe le fil." },
      "aldric-75": { by: "Kaelen", text: "Une frappe héroïque, c'est une frappe ordinaire devant laquelle on n'a pas fui." },
      "aldric-100": { by: "La Mère-des-Épées", text: "Chaque coup que tu as porté est encore dans ton bras. Les mauvaises nuits, laisse-les tous frapper avec toi." },
      "aldric-150": { by: "La Mère-des-Épées", text: "N'importe quelle épée fera l'affaire. « Maître », c'est ce que l'épée t'appelle, jamais ce que tu te fais appeler." },
      "aldric-200": { by: "Le Roi", text: "Une légende, ce n'est que quelqu'un qui a continué de marcher après la fin de la chanson." }
    }
  }
};
