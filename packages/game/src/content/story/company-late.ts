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
        { by: "Vorn", text: "Biscuit, the shapeless thing in Vorn's pack, growls at you. The wolves back away from him, not from you. \"He never growls,\" Vorn says. \"He knows you.\"" },
        { by: "Vorn", text: "Biscuit ignores you all night, very carefully. Vorn is pleased. \"That's how he says he's thinking about you.\"" },
        { by: "Vorn", text: "Biscuit lies down across your feet, and your boots go pale where he touches them. \"Don't move,\" Vorn whispers. \"He's choosing you. Things fade near him.\"" },
        { by: "Vorn", text: "\"Found Biscuit in the Void, where a third of the land vanished. He's a piece of whatever took it: the Morning, Morgrath says. He wagged, so I kept him.\"" },
        { by: "Vorn", text: "Vorn tells you Biscuit's true name. It is not a word. It is a small silence, the same silence that swallowed a third of Orvane. Biscuit wags." }
      ],
      lysandre: [
        { by: "Lysandre", text: "You say nothing, and Lysandre corrects you anyway. \"Stratum, singular. Strata, plural. You were thinking it wrong.\"" },
        { by: "Lysandre", text: "He unrolls his map of the strata, the older layers of the night below the road. \"Echo, Ash, Void, Astral, Primordial. I named them all. Admire it.\"" },
        { by: "Lysandre", text: "His map ends in one word: BOTTOM. In the margin, the spell that wove the Long Night, copied backwards. \"Read it to the end and it undoes itself. Hush.\"" },
        { by: "Lysandre", text: "He tears the map through the word BOTTOM. \"The ground kept going below the Primordial. I was wrong about the bottom of the world. Frankly rude of it.\"" },
        { by: "Lysandre", text: "\"I was wrong. It is the best thing that has happened to me in a thousand nights. There is so much more to read.\"" }
      ],
      ashka: [
        { by: "Ashka", text: "Ashka bars the road with her staff. \"What are you fighting for? Think first. Almost everyone gets it wrong.\"" },
        { by: "Ashka", text: "She laughs at your answer. \"Keeping the night going? The King locked the sun out, and you guard his door. From the wrong side.\"" },
        { by: "Ashka", text: "She faces where the sun should rise. \"There was a sun, before the Long Night. My order, the Pyre, burned the old forests to call it back. It will come.\"" },
        { by: "Ashka", text: "\"My brother, Brother Cinder, keeps one small flame in a jar and calls it faith. I wanted the whole fire, so I left him for the Pyre.\"" },
        { by: "Ashka", text: "\"If you ever reach the Dawn, at the bottom of the night, open it for me. I think it is a sun. If I'm wrong, I would still like to see it.\"" }
      ],
      nameless: [
        { by: "The Nameless", text: "The Nameless, the knight whose armor they say is empty, bows to you the way knights once bowed to kings. His armor makes no sound at all." },
        { by: "The Nameless", text: "He no longer walks behind you. He walks at your side, matching your stride exactly, as if he once walked this road the same way." },
        { by: "The Nameless", text: "He speaks for the first time, looking at your essences, the memories you carry. \"How many?\"" },
        { by: "The Nameless", text: "He closes your fingers over your last essences. \"Keep some.\" He gave every memory he had to the altars. What was left of him still walks." },
        { by: "The Nameless", text: "He lifts off his helmet. Inside, nothing, and scratched in the steel the one word he kept: Aldric. He was a walker like you, and gave away all the rest." }
      ],
      eldra: [
        { by: "Eldra", text: "Eldra, the Timeweaver, pulls a loose thread from your sleeve. \"Yours. Every night is a thread, and yours runs very long. I would know it anywhere.\"" },
        { by: "Eldra", text: "Your cloak is torn at the shoulder. She mends it with a thread of light that does not quite match, and bites it off. \"There. It will hold tonight.\"" },
        { by: "Eldra", text: "She never says \"the King\". She says \"him\", and her hands stop weaving while she says it. She knew Aldemar before the Long Night began." },
        { by: "Eldra", text: "\"I wove this night. The King asked me to, to keep the Morning out of Orvane. I am sorry for what it costs you.\" The shuttle moves again. \"Not for doing it.\"" },
        { by: "Eldra", text: "She shows you her loom, taller than the keep. \"Once the night is deep enough, I weave it again, one thread deeper. It costs you your stones, and it is worth it.\"" }
      ],
      morgrath: [
        { by: "Morgrath", text: "\"You. The sword with no conversation. Do try not to die before I have finished despising you.\"" },
        { by: "Morgrath", text: "\"Aldric. Yes, I learned it. One likes to know exactly whom one is insulting.\"" },
        { by: "Morgrath", text: "\"I am death's steward. Every soul in Orvane is owed an end and a morning, and the King had this night woven to keep both out. That is why I hate him.\"" },
        { by: "Morgrath", text: "He watches the Sky-Glass for a long time. \"It is beautiful. The night. Do not repeat that. I have a reputation.\"" },
        { by: "Morgrath", text: "\"When it ends, and it will, I will be there to see you out. Politely.\"" }
      ],
      celestine: [
        { by: "Célestine", text: "Célestine hums while the essences gather. There is a word in her tune: your name. \"the light told me,\" she says. \"it knows everyone who carries it.\"" },
        { by: "Célestine", text: "She is humming your name before you arrive. \"oh. it's you. the crystals hum it when you're near. i thought it was only a tune.\"" },
        { by: "Célestine", text: "\"listen. the crystals only fall while someone is watching the night. look away, and they stop. they like being looked at.\"" },
        { by: "Célestine", text: "She points past the Sky-Glass. \"someone out there is watching us. not you. someone much bigger, above the sky. the crystals fall when they look. isn't it nice?\"" },
        { by: "Célestine", text: "She sings a lullaby she never learned: \"hush now, the lamp is lit, the world can wait.\" \"it comes from above the sky,\" she says. \"someone sings it to someone.\"" }
      ],
      aurelion: [
        { by: "Aurelion", text: "Aurelion lowers his head until one golden eye fills the road. \"Small one. You walk as if the ground owed you something. I approve.\"" },
        { by: "Aurelion", text: "\"Aldric.\" He says it the way one sets down a cup of very fine glass. \"A small name. It carries well.\"" },
        { by: "Aurelion", text: "\"Before your kingdom there were other worlds. I flew over them, and they ended. Yours is not the first world someone has left a lamp burning for.\"" },
        { by: "Aurelion", text: "\"I saw a Dawn once, over the world before this one. It was quiet and kind, and afterward there was nothing left. That is what your King keeps out.\"" },
        { by: "Aurelion", text: "\"I chose your side because you keep coming back. The last world did not have anyone who did.\"" }
      ],
      awakened: [
        { by: "The Awakened", text: "Across the fire, the Awakened stands exactly as you stand. You shift your weight, and so does the Awakened, at the same instant. It copies you." },
        { by: "The Awakened", text: "You wipe your blade on your sleeve. Across the road, the Awakened wipes an empty hand the same way. Every gesture you make, it makes too." },
        { by: "The Awakened", text: "The Awakened's lips move a breath before you speak, shaping your words. It knows what you will do before you do it." },
        { by: "The Awakened", text: "One dusk you draw your sword, and the Awakened does not. For the first time it stops copying you, and waits to see what you do on your own." },
        { by: "The Awakened", text: "The Awakened speaks for the first and only time, looking straight past you, as if at someone behind your eyes: \"Hello.\"" }
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
        "Hush. Walk softly. The night is thinner than it looks.",
        "You again. I know your thread. I have counted every night of it.",
        "Sit. Mind the loose ends. Some of them are yours."
      ],
      morgrath: [
        "Life is overrated. I should know. I've tried both.",
        "Have we met? I'd remember despising something so persistent.",
        "Back again, Aldric. Good. Someone has to watch you do this properly."
      ],
      celestine: [
        "shh. listen. the light is humming.",
        "oh! your song. i know your song. don't i?",
        "there you are. the crystals have been humming you all dusk."
      ],
      aurelion: [
        "Kneel. No, not to me. To the view.",
        "Small one. You smell like someone I have flown with before. Curious.",
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
        { by: "Vorn", text: "Biscuit, la chose sans forme de la meute de Vorn, gronde contre toi. Les loups s'écartent de lui, pas de toi. « Il ne gronde jamais, dit Vorn. Il te connaît. »" },
        { by: "Vorn", text: "Biscuit t'ignore toute la nuit, avec un soin remarquable. Vorn est content. « C'est sa façon de dire qu'il pense à toi. »" },
        { by: "Vorn", text: "Biscuit se couche en travers de tes pieds, et tes bottes pâlissent là où il les touche. « Bouge pas, chuchote Vorn. Il te choisit. Les choses s'effacent, près de lui. »" },
        { by: "Vorn", text: "« J'ai trouvé Biscuit dans le Néant, là où un tiers du pays a disparu. C'est un bout de ce qui l'a pris : le Matin, d'après Morgrath. Il remuait la queue, je l'ai gardé. »" },
        { by: "Vorn", text: "Vorn te dit le vrai nom de Biscuit. Ce n'est pas un mot. C'est un petit silence, le même que celui qui a avalé un tiers d'Orvane. Biscuit remue la queue." }
      ],
      lysandre: [
        { by: "Lysandre", text: "Tu n'as rien dit, et Lysandre te corrige quand même. « Une strate, pas un strate. Tu le pensais de travers. »" },
        { by: "Lysandre", text: "Il déroule sa carte des strates, les couches plus anciennes de la nuit sous la route. « Écho, Cendre, Néant, Astral, Primordial. Tout est de moi. Admire. »" },
        { by: "Lysandre", text: "Sa carte finit sur un mot : FOND. Dans la marge, le sort qui a tissé la Longue Nuit, recopié à l'envers. « Lu jusqu'au bout, il se défait. Chut. »" },
        { by: "Lysandre", text: "Il déchire la carte en plein milieu du mot FOND. « Le sol continue sous le Primordial. Je me suis trompé sur le fond du monde. C'est d'une impolitesse. »" },
        { by: "Lysandre", text: "« Je me suis trompé. C'est la plus belle chose qui me soit arrivée en mille nuits. Il reste tant de choses à lire. »" }
      ],
      ashka: [
        { by: "Ashka", text: "Ashka te barre la route de son bâton. « Tu te bats pour quoi ? Réfléchis d'abord. Presque tout le monde se trompe. »" },
        { by: "Ashka", text: "Elle rit de ta réponse. « Faire durer la nuit ? Le Roi a enfermé le soleil dehors, et toi, tu gardes sa porte. Du mauvais côté. »" },
        { by: "Ashka", text: "Elle se tourne vers là où le soleil devrait se lever. « Il y avait un soleil, avant la Longue Nuit. Mon ordre, le Bûcher, a brûlé les forêts pour le rappeler. Il viendra. »" },
        { by: "Ashka", text: "« Mon frère, Frère Cendre, garde une petite flamme dans un bocal et appelle ça la foi. Moi, je voulais tout le feu. Alors je l'ai quitté pour le Bûcher. »" },
        { by: "Ashka", text: "« Si tu atteins l'Aube un jour, au fond de la nuit, ouvre-la pour moi. Je crois que c'est un soleil. Si je me trompe, j'aimerais quand même le voir. »" }
      ],
      nameless: [
        { by: "Le Sans-Nom", text: "Le Sans-Nom, le chevalier dont on dit l'armure vide, s'incline devant toi comme les chevaliers devant les rois d'autrefois. Son armure ne fait aucun bruit." },
        { by: "Le Sans-Nom", text: "Il ne marche plus derrière toi. Il marche à ta hauteur, exactement de ton pas, comme s'il avait pris cette route de la même façon, autrefois." },
        { by: "Le Sans-Nom", text: "Il parle pour la première fois, les yeux sur tes essences, les souvenirs que tu portes. « Combien ? »" },
        { by: "Le Sans-Nom", text: "Il referme tes doigts sur tes dernières essences. « Gardes-en. » Il a donné tous ses souvenirs aux autels. Ce qui reste de lui marche encore." },
        { by: "Le Sans-Nom", text: "Il ôte son heaume. Dedans, rien, et gravé dans l'acier le seul mot qu'il a gardé : Aldric. C'était un marcheur comme toi. Il a donné tout le reste." }
      ],
      eldra: [
        { by: "Eldra", text: "Eldra, la Tisseuse du temps, tire un fil qui dépasse de ta manche. « Le tien. Chaque nuit est un fil, et le tien est très long. Je le reconnaîtrais entre tous. »" },
        { by: "Eldra", text: "Ta cape est déchirée à l'épaule. Elle la reprise d'un fil de lumière pas tout à fait assorti, et le coupe avec les dents. « Voilà. Ça tiendra cette nuit. »" },
        { by: "Eldra", text: "Elle ne dit jamais « le roi ». Elle dit « lui », et ses mains cessent de tisser le temps que dure le mot. Elle connaissait Aldemar avant la Longue Nuit." },
        { by: "Eldra", text: "« J'ai tissé cette nuit. Le Roi me l'a demandé, pour garder le Matin hors d'Orvane. Je suis désolée de ce qu'elle te coûte. » La navette repart. « Pas de l'avoir faite. »" },
        { by: "Eldra", text: "Elle te montre son métier, plus haut que le donjon. « Quand la nuit est assez profonde, je la retisse, un fil plus bas. Ça te coûte tes pierres, et ça en vaut la peine. »" }
      ],
      morgrath: [
        { by: "Morgrath", text: "« Toi. L'épée sans conversation. Tâche de ne pas mourir avant que j'aie fini de te mépriser. »" },
        { by: "Morgrath", text: "« Aldric. Oui, je l'ai retenu. On aime savoir précisément qui l'on insulte. »" },
        { by: "Morgrath", text: "« Je suis l'intendant de la mort. Chaque âme d'Orvane a droit à une fin et à un matin, et le Roi a fait tisser cette nuit pour garder les deux dehors. Voilà pourquoi je le hais. »" },
        { by: "Morgrath", text: "Il regarde longtemps la Voûte de verre. « C'est beau. La nuit. Ne le répète pas. J'ai une réputation. »" },
        { by: "Morgrath", text: "« Quand ça finira, et ça finira, je serai là pour te raccompagner. Poliment. »" }
      ],
      celestine: [
        { by: "Célestine", text: "Célestine fredonne pendant que les essences s'assemblent. Il y a un mot dans son air : ton nom. « la lumière me l'a dit. elle connaît tous ceux qui la portent. »" },
        { by: "Célestine", text: "Elle fredonne ton nom avant que tu arrives. « oh. c'est toi. les cristaux le fredonnent quand tu es près. je croyais que c'était juste un air. »" },
        { by: "Célestine", text: "« écoute. les cristaux ne tombent que si quelqu'un regarde la nuit. qu'on détourne les yeux, et ils s'arrêtent. ils aiment qu'on les regarde. »" },
        { by: "Célestine", text: "Elle montre la Voûte. « quelqu'un, là-haut, nous regarde. pas toi. quelqu'un de bien plus grand, au-dessus du ciel. les cristaux tombent quand il regarde. c'est doux. »" },
        { by: "Célestine", text: "Elle chante une berceuse qu'elle n'a jamais apprise : « chut, la lampe est allumée, le monde peut attendre. » « ça vient d'au-dessus du ciel. quelqu'un la chante à quelqu'un. »" }
      ],
      aurelion: [
        { by: "Aurelion", text: "Aurelion baisse la tête jusqu'à ce qu'un œil d'or remplisse la route. « Petite chose. Tu marches comme si le sol te devait quelque chose. J'approuve. »" },
        { by: "Aurelion", text: "« Aldric. » Il le prononce comme on pose une coupe de verre très fin. « Un petit nom. Il porte loin. »" },
        { by: "Aurelion", text: "« Avant ton royaume, il y a eu d'autres mondes. Je les ai survolés, et ils ont pris fin. Le tien n'est pas le premier pour qui quelqu'un laisse une lampe allumée. »" },
        { by: "Aurelion", text: "« J'ai vu une Aube, une fois, sur le monde d'avant celui-ci. Elle était calme et douce, et après, il ne restait rien. C'est ce que ton Roi garde dehors. »" },
        { by: "Aurelion", text: "« J'ai choisi ton camp parce que tu reviens toujours. Le dernier monde n'avait personne qui revenait. »" }
      ],
      awakened: [
        { by: "L'Éveillé", text: "De l'autre côté du feu, l'Éveillé se tient exactement comme toi. Tu changes d'appui, lui aussi, au même instant. Il t'imite." },
        { by: "L'Éveillé", text: "Tu essuies ta lame sur ta manche. De l'autre côté de la route, l'Éveillé essuie une main vide de la même façon. Chacun de tes gestes, il le refait." },
        { by: "L'Éveillé", text: "Les lèvres de l'Éveillé bougent un souffle avant que tu parles, et forment tes mots. Il sait ce que tu vas faire avant toi." },
        { by: "L'Éveillé", text: "Un soir, tu tires l'épée, et l'Éveillé ne la tire pas. Pour la première fois, il cesse de t'imiter, et attend de voir ce que tu fais seul." },
        { by: "L'Éveillé", text: "L'Éveillé parle pour la première et la seule fois, le regard passant droit à travers toi, comme vers quelqu'un derrière tes yeux : « Bonjour. »" }
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
        "Chut. Marche doucement. La nuit est plus mince qu'elle n'en a l'air.",
        "Encore toi. Je connais ton fil. J'en ai compté chaque nuit.",
        "Assieds-toi. Attention aux bouts qui dépassent. Certains sont à toi."
      ],
      morgrath: [
        "La vie est surfaite. Je suis bien placé pour le savoir : j'ai essayé les deux.",
        "On se connaît ? Je me souviendrais d'avoir méprisé quelque chose d'aussi têtu.",
        "Encore là, Aldric. Bien. Il faut quelqu'un pour te regarder faire correctement."
      ],
      celestine: [
        "chut. écoute. la lumière fredonne.",
        "oh ! ta chanson. je connais ta chanson. non ?",
        "te voilà. les cristaux t'ont fredonné tout le crépuscule."
      ],
      aurelion: [
        "À genoux. Non, pas devant moi. Devant la vue.",
        "Petite chose. Tu sens comme quelqu'un avec qui j'ai déjà volé. Curieux.",
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
      "aldric-150": { by: "La Mère-des-Épées", text: "N'importe quelle épée fera l'affaire. Maître, c'est le nom que l'épée te donne, jamais celui que tu te donnes." },
      "aldric-200": { by: "Le Roi", text: "Une légende, ce n'est que quelqu'un qui a continué de marcher après la fin de la chanson." }
    }
  }
};
