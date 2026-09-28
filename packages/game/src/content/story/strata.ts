import type { Locale } from "../../i18n";
import type { StrataText } from "../types";

/**
 * The strata of the Long Night (BIBLE 9, 17.1): sixty era tags, the twelve Ages, one
 * keystone per stratum and the keystones of a walker's own milestones.
 */

const en: StrataText = {
  tags: [
    "", "Echo", "Ash", "Void", "Astral",
    "Primordial", "Titan", "Wyrm", "Tide", "Rime",
    "Hallowed", "Oracle", "Seraph", "Hymn", "Eclipse",
    "Nebula", "Comet", "Zenith", "Nadir", "Aurora",
    "Warp", "Weft", "Shuttle", "Knot", "Frayed",
    "Sketch", "Charcoal", "Outline", "Erased", "Palimpsest",
    "Rune", "Glyph", "Verse", "Name", "Whisper",
    "Lull", "Reverie", "Slumber", "Drowse", "Threshold",
    "Lantern", "Hearth", "Lullaby", "Window", "Glass",
    "Hollow", "Muffled", "Hush", "Oblivion", "Absence",
    "Pale", "Faint", "Margin", "Blank", "Ink",
    "Point", "Spark", "Breath", "Gaze", "Dawn"
  ],
  ages: [
    "The Kingdom",
    "The Elder World",
    "The Hallowed",
    "The Making of the Stars",
    "The Loom",
    "The Draft",
    "The Words",
    "The Edge of Sleep",
    "The Dreamer's Room",
    "The Unmaking",
    "The Blank",
    "The First Mark"
  ],
  keystones: [
    // Age I: the Kingdom
    { by: "The Ledger", text: "He looked at you as if you were late." },
    { by: "The Ledger", text: "The bats screamed before you swung. They had heard it before." },
    { by: "Brother Cinder", text: "Under the ash, the fields are the same fields. Someone burned them to call the sun." },
    { by: "Lysandre", text: "A third of the map is missing. Not burned, not flooded. Missing." },
    { by: "The Ledger", text: "Garrick held a star-shard up to the sky. It fit." },
    // Age II: the Elder World
    { by: "The Ledger", text: "Lysandre's map ends here, with one word: BOTTOM." },
    { by: "The Ledger", text: "The ground kept going. Lysandre has not spoken since." },
    { by: "The Ledger", text: "Aurelion bowed to a bone the size of a valley." },
    { by: "Aurelion", text: "There was a sea here, before there was a here." },
    { by: "Kaelen", text: "Frozen in the ice: a crown, smaller than his." },
    // Age III: the Hallowed
    { by: "Lysandre", text: "Temples to a god with no name, facing the sky." },
    { by: "The Ledger", text: "Oriane went quiet. The oracles of this stratum were saying her words first." },
    { by: "An unknown hand", text: "Six wings, all folded over its eyes, as if something was too bright to look at." },
    { by: "The Ledger", text: "Célestine knew the hymn. She says she never learned it." },
    { by: "Morgrath", text: "The priests of the Eclipse prayed for a night that would never end. Someone answered." },
    // Age IV: the Making of the Stars
    { by: "Garrick", text: "The sky here is not glass yet. It is still being poured." },
    { by: "The Ledger", text: "A star fell and did not break. It rolled to your feet and waited." },
    { by: "Aurelion", text: "Everything is at its highest point here, and knows it cannot stay." },
    { by: "Oriane", text: "The lowest point of the sky. Someone is standing on it, weaving." },
    { by: "Ashka", text: "Not the Dawn. Its rehearsal." },
    // Age V: the Loom
    { by: "The Ledger", text: "Threads run from the ground to the sky, taut, humming." },
    { by: "The Ledger", text: "Eldra's handwriting is on the threads. Very small. Very tired." },
    { by: "Ysolde", text: "Something passes between the threads, back and forth, every night. It looks like you." },
    { by: "The Ledger", text: "A knot the size of a keep. The King's name is tied into it." },
    { by: "Ashka", text: "Here the weave is thin enough to see light through." },
    // Age VI: the Draft
    { by: "Séraphine", text: "The trees are outlines. Someone meant to color them in later." },
    { by: "The Ledger", text: "Your hands leave smudges on everything you touch." },
    { by: "Lysandre", text: "A second Orvane, drawn beside the first, never finished." },
    { by: "An unknown hand", text: "Something was drawn here and taken back. The shape remains." },
    { by: "Eldra", text: "Under this world, the lines of another one." },
    // Age VII: the Words
    { by: "Lysandre", text: "Every stone is a letter. The road is a sentence." },
    { by: "The Ledger", text: "The glyph for 'king' and the glyph for 'tired' are the same." },
    { by: "Célestine", text: "The Remnants here speak in rhyme. They are trying to be remembered." },
    { by: "The Ledger", text: "The Nameless stopped. He heard a word here. He will not say it." },
    { by: "Oriane", text: "Something is telling this world to itself, very quietly, so it will not stop." },
    // Age VIII: the Edge of Sleep
    { by: "The Ledger", text: "The Remnants move slower. So do you. It is not tiredness." },
    { by: "Maëlle", text: "The road loops back on itself, and nobody minds." },
    { by: "The Ledger", text: "Eldra, very softly: do not wake anyone." },
    { by: "Nyx", text: "Half the stars are closed." },
    { by: "The Ledger", text: "The first time anyone in Orvane has used the word 'dream'. It was Morgrath, and he spat." },
    // Age IX: the Dreamer's Room
    { by: "An unknown hand", text: "A lamp, far above the sky, left on." },
    { by: "Brother Cinder", text: "Warmth from somewhere without a direction." },
    { by: "The Ledger", text: "Célestine stops singing to listen. The tune is hers, slower." },
    { by: "The Ledger", text: "The King stands at a window you have never seen from outside." },
    { by: "Garrick", text: "On the other side of the sky, something is reflected. It blinks when you do." },
    // Age X: the Unmaking
    { by: "Vorn", text: "Things here are shaped like other things that left." },
    { by: "The Ledger", text: "The sounds of the fight arrive late, and quieter." },
    { by: "Ysolde", text: "Someone has put a finger to their lips. The whole stratum obeys." },
    { by: "The Ledger", text: "You forget a companion's name for a second. It comes back. Not all of it." },
    { by: "Kaelen", text: "Where the King should be, a chair, still warm." },
    // Age XI: the Blank
    { by: "Morgrath", text: "The night is thinning. You can see the color of the sky behind it." },
    { by: "The Ledger", text: "The Remnants are almost not there. They fight anyway." },
    { by: "Lysandre", text: "You have walked off the edge of the drawing." },
    { by: "The Ledger", text: "Nothing has been written here yet. Your footprints are the first thing." },
    { by: "An unknown hand", text: "A single drop, about to fall." },
    // Age XII: the First Mark
    { by: "Aurelion", text: "Everything began as one point of light, and someone looking at it." },
    { by: "Ashka", text: "The point is warm." },
    { by: "Eldra", text: "Something breathes in, and holds it." },
    { by: "Aldemar", text: "Aldemar, without his crown: you came all this way. Thank you. Go back." },
    { by: "The Dawn", text: "Not yet." }
  ],
  milestones: {
    "ascend-1": { by: "Oriane", text: "\"You've done this before.\" She does not say it like a question." },
    "ascend-5": { by: "The Ledger", text: "Fifth dusk. On the Roll, other names beside yours. Some still wet. Some so old the ink has gone grey." },
    "ascend-10": { by: "Kaelen", text: "Kaelen, at the tenth dusk, without turning round: \"I was supposed to be somewhere, once. I wasn't.\"" },
    "ascend-25": { by: "An unknown hand", text: "Scratched on the back of an altar: never spend all of yourself. The letters grow fainter toward the end." },
    "ascend-50": { by: "The Ledger", text: "Fifty nights entered. The Ledger notes, for no reason it can give, that the walker has never once failed to come back." },
    "ascend-100": { by: "Eldra", text: "A hundred dusks. Eldra ties a small knot in your thread where no one will see it, the way you fold a page to find it again." },
    "descent-1": { by: "The Ledger", text: "The stones come apart into thread. Eldra winds it on her arm, patient, and weaves the night again, one thread lower." },
    "descent-3": { by: "Eldra", text: "\"Third time. My fingers know the way down better than I do.\"" },
    "descent-5": { by: "The Ledger", text: "Fifth weaving. The Sanctum comes back paler, and the altars have forgotten your hands. Your companions have not." },
    "descent-10": { by: "The Ledger", text: "Tenth weaving. Among your things, a place that was not there before, the shape of a circle. Nothing fills it. It waits." },
    "remember-first": { by: "The Ledger", text: "Tonight, someone who should not know you hesitated before saying hello." },
    "remember-third": { by: "Ysolde", text: "\"The trees say one of us is remembering you on purpose now. It hurts. They keep doing it anyway.\"" },
    "remember-whole": { by: "Célestine", text: "someone just said your whole name, all of it, and the crystals went quiet to hear it." },
    "remember-five": { by: "Maëlle", text: "\"Five of us now. We keep a seat for you by the fire, and argue over who sits next to it.\"" },
    "remember-ten": { by: "Morgrath", text: "\"Ten of them remember you. I have been dead a very long time, and nobody ever remembered me that hard.\"" },
    "remember-all": { by: "The Ledger", text: "Twenty names, and every one of them knows yours. The night has never been this crowded, or this warm." },
    "kaelen-ran": { by: "The King", text: "\"I don't blame the boy. Somebody had to be afraid. It left me free to be the other thing.\"" },
    "nameless-speaks": { by: "The Nameless", text: "The helmet turns toward you. A voice like a door unopened for years: \"Still walking?\"" },
    "eldra-loom": { by: "The Ledger", text: "Behind Eldra's curtain: a loom as tall as the sky, and on it, half woven, tonight." },
    "awakened-hello": { by: "Oriane", text: "\"It spoke. I did not hear it coming. I always hear things coming.\"" }
  }
};

const fr: StrataText = {
  tags: [
    "", "Écho", "Cendre", "Néant", "Astral",
    "Primordial", "Titan", "Guivre", "Marée", "Givre",
    "Sacré", "Oracle", "Séraphin", "Hymne", "Éclipse",
    "Nébuleuse", "Comète", "Zénith", "Nadir", "Aurore",
    "Chaîne", "Trame", "Navette", "Nœud", "Effiloché",
    "Esquisse", "Fusain", "Contour", "Gommé", "Palimpseste",
    "Rune", "Glyphe", "Vers", "Nom", "Murmure",
    "Accalmie", "Rêverie", "Sommeil", "Somnolence", "Seuil",
    "Lanterne", "Âtre", "Berceuse", "Fenêtre", "Vitre",
    "Creux", "Sourdine", "Chut", "Oubli", "Absence",
    "Pâle", "Ténu", "Marge", "Vierge", "Encre",
    "Point", "Étincelle", "Souffle", "Regard", "Aube"
  ],
  ages: [
    "Le Royaume",
    "Le Monde ancien",
    "Le Sacré",
    "La Forge des étoiles",
    "Le Métier à tisser",
    "L'Ébauche",
    "Les Mots",
    "La Lisière du sommeil",
    "La Chambre du rêveur",
    "Le Dénouement",
    "Le Blanc",
    "Le Premier Trait"
  ],
  keystones: [
    // Âge I : le Royaume
    { by: "Le Grand Livre", text: "Il t'a regardé comme si tu étais en retard." },
    { by: "Le Grand Livre", text: "Les chauves-souris ont hurlé avant ton coup. Elles l'avaient déjà entendu." },
    { by: "Frère Cendre", text: "Sous la cendre, ce sont les mêmes champs. Quelqu'un les a brûlés pour appeler le soleil." },
    { by: "Lysandre", text: "Il manque un tiers de la carte. Ni brûlé, ni noyé. Absent." },
    { by: "Le Grand Livre", text: "Garrick a levé un éclat d'étoile vers le ciel. Il s'y emboîtait." },
    // Âge II : le Monde ancien
    { by: "Le Grand Livre", text: "La carte de Lysandre s'arrête ici, sur un seul mot : FOND." },
    { by: "Le Grand Livre", text: "Le sol a continué. Lysandre n'a plus dit un mot depuis." },
    { by: "Le Grand Livre", text: "Aurelion s'est incliné devant un os grand comme une vallée." },
    { by: "Aurelion", text: "Il y avait une mer ici, avant qu'il y ait un ici." },
    { by: "Kaelen", text: "Prise dans la glace : une couronne, plus petite que la sienne." },
    // Âge III : le Sacré
    { by: "Lysandre", text: "Des temples pour un dieu sans nom, tournés vers le ciel." },
    { by: "Le Grand Livre", text: "Oriane s'est tue. Les oracles de cette strate disaient ses mots avant elle." },
    { by: "Une main inconnue", text: "Six ailes, toutes repliées sur ses yeux, comme devant une chose trop vive pour être regardée." },
    { by: "Le Grand Livre", text: "Célestine connaissait l'hymne. Elle dit ne l'avoir jamais appris." },
    { by: "Morgrath", text: "Les prêtres de l'Éclipse priaient pour une nuit qui ne finirait jamais. Quelqu'un a répondu." },
    // Âge IV : la Forge des étoiles
    { by: "Garrick", text: "Ici, le ciel n'est pas encore du verre. On est encore en train de le couler." },
    { by: "Le Grand Livre", text: "Une étoile est tombée sans se briser. Elle a roulé jusqu'à tes pieds, et elle a attendu." },
    { by: "Aurelion", text: "Ici, tout est à son plus haut, et tout sait qu'il ne pourra pas y rester." },
    { by: "Oriane", text: "Le point le plus bas du ciel. Quelqu'un s'y tient debout, et tisse." },
    { by: "Ashka", text: "Pas l'Aube. Sa répétition." },
    // Âge V : le Métier à tisser
    { by: "Le Grand Livre", text: "Des fils courent du sol jusqu'au ciel, tendus, bourdonnants." },
    { by: "Le Grand Livre", text: "L'écriture d'Eldra court sur les fils. Toute petite. Très lasse." },
    { by: "Ysolde", text: "Quelque chose passe entre les fils, aller, retour, chaque nuit. Ça te ressemble." },
    { by: "Le Grand Livre", text: "Un nœud gros comme un donjon. Le nom du roi est noué dedans." },
    { by: "Ashka", text: "Ici, la trame est assez fine pour laisser passer la lumière." },
    // Âge VI : l'Ébauche
    { by: "Séraphine", text: "Les arbres ne sont que des contours. Quelqu'un comptait les colorier plus tard." },
    { by: "Le Grand Livre", text: "Tes mains laissent des traînées sur tout ce que tu touches." },
    { by: "Lysandre", text: "Un second Orvane, dessiné à côté du premier, jamais achevé." },
    { by: "Une main inconnue", text: "On a dessiné quelque chose ici, puis on l'a repris. La forme est restée." },
    { by: "Eldra", text: "Sous ce monde, les lignes d'un autre." },
    // Âge VII : les Mots
    { by: "Lysandre", text: "Chaque pierre est une lettre. La route est une phrase." },
    { by: "Le Grand Livre", text: "Le glyphe « roi » et le glyphe « fatigué » sont le même." },
    { by: "Célestine", text: "Ici, les Vestiges parlent en rimes. Ils essaient qu'on se souvienne d'eux." },
    { by: "Le Grand Livre", text: "Le Sans-Nom s'est arrêté. Il a entendu un mot, ici. Il ne le dira pas." },
    { by: "Oriane", text: "Quelque chose raconte ce monde à lui-même, tout bas, pour qu'il ne s'arrête pas." },
    // Âge VIII : la Lisière du sommeil
    { by: "Le Grand Livre", text: "Les Vestiges bougent plus lentement. Toi aussi. Ce n'est pas la fatigue." },
    { by: "Maëlle", text: "La route revient sur elle-même, et personne ne s'en plaint." },
    { by: "Le Grand Livre", text: "Eldra, tout bas : ne réveille personne." },
    { by: "Nyx", text: "La moitié des étoiles sont fermées." },
    { by: "Le Grand Livre", text: "Pour la première fois, quelqu'un en Orvane a dit le mot « rêve ». C'était Morgrath, et il a craché." },
    // Âge IX : la Chambre du rêveur
    { by: "Une main inconnue", text: "Une lampe, loin au-dessus du ciel, restée allumée." },
    { by: "Frère Cendre", text: "Une chaleur venue de quelque part, sans direction." },
    { by: "Le Grand Livre", text: "Célestine cesse de chanter pour écouter. L'air est le sien, en plus lent." },
    { by: "Le Grand Livre", text: "Le roi se tient à une fenêtre que tu n'as jamais vue du dehors." },
    { by: "Garrick", text: "De l'autre côté du ciel, quelque chose se reflète. Ça cligne des yeux quand tu le fais." },
    // Âge X : le Dénouement
    { by: "Vorn", text: "Ici, les choses ont la forme d'autres choses, qui sont parties." },
    { by: "Le Grand Livre", text: "Les bruits du combat arrivent en retard, et plus bas." },
    { by: "Ysolde", text: "Quelqu'un a posé un doigt sur ses lèvres. Toute la strate obéit." },
    { by: "Le Grand Livre", text: "Tu oublies le nom d'un compagnon, une seconde. Il revient. Pas en entier." },
    { by: "Kaelen", text: "Là où devrait être le roi, un siège, encore tiède." },
    // Âge XI : le Blanc
    { by: "Morgrath", text: "La nuit s'amincit. On devine la couleur du ciel derrière." },
    { by: "Le Grand Livre", text: "Les Vestiges sont presque absents. Ils se battent quand même." },
    { by: "Lysandre", text: "Tu es sorti du dessin par le bord." },
    { by: "Le Grand Livre", text: "Rien n'a encore été écrit ici. Tes pas sont la première chose." },
    { by: "Une main inconnue", text: "Une seule goutte, sur le point de tomber." },
    // Âge XII : le Premier Trait
    { by: "Aurelion", text: "Tout a commencé par un point de lumière, et quelqu'un qui le regardait." },
    { by: "Ashka", text: "Le point est chaud." },
    { by: "Eldra", text: "Quelque chose inspire, et retient son souffle." },
    { by: "Aldemar", text: "Aldemar, sans sa couronne : tu es venu jusqu'ici. Merci. Repars." },
    { by: "L'Aube", text: "Pas encore." }
  ],
  milestones: {
    "ascend-1": { by: "Oriane", text: "« Tu as déjà fait ça. » Elle ne le dit pas comme une question." },
    "ascend-5": { by: "Le Grand Livre", text: "Cinquième crépuscule. Sur le Registre, d'autres noms à côté du tien. Certains encore frais. D'autres si vieux que l'encre a grisé." },
    "ascend-10": { by: "Kaelen", text: "Kaelen, au dixième crépuscule, sans se retourner : « Un soir, je devais être quelque part. Je n'y étais pas. »" },
    "ascend-25": { by: "Une main inconnue", text: "Gravé au dos d'un autel : ne te dépense jamais tout entier. Les lettres pâlissent vers la fin." },
    "ascend-50": { by: "Le Grand Livre", text: "Cinquante nuits inscrites. Le Grand Livre note, sans savoir dire pourquoi, que le marcheur n'a jamais manqué de revenir." },
    "ascend-100": { by: "Eldra", text: "Cent crépuscules. Eldra fait un petit nœud dans ton fil, là où personne ne le verra, comme on corne une page pour la retrouver." },
    "descent-1": { by: "Le Grand Livre", text: "Les pierres se défont en fil. Eldra l'enroule sur son bras, patiente, et retisse la nuit, un fil plus bas." },
    "descent-3": { by: "Eldra", text: "« Troisième fois. Mes doigts connaissent le chemin qui descend mieux que moi. »" },
    "descent-5": { by: "Le Grand Livre", text: "Cinquième tissage. Le Sanctuaire revient plus pâle, et les autels ont oublié tes mains. Tes compagnons, non." },
    "descent-10": { by: "Le Grand Livre", text: "Dixième tissage. Parmi tes affaires, une place qui n'y était pas, en forme de cercle. Rien ne la remplit. Elle attend." },
    "remember-first": { by: "Le Grand Livre", text: "Ce soir, quelqu'un qui ne devrait pas te connaître a hésité avant de te saluer." },
    "remember-third": { by: "Ysolde", text: "« Les arbres disent que l'un de nous se souvient de toi exprès, maintenant. Ça fait mal. Il continue quand même. »" },
    "remember-whole": { by: "Célestine", text: "quelqu'un vient de dire ton nom en entier, tout entier, et les cristaux se sont tus pour l'entendre." },
    "remember-five": { by: "Maëlle", text: "« On est cinq, maintenant. On te garde une place près du feu, et on se dispute pour savoir qui s'assoit à côté. »" },
    "remember-ten": { by: "Morgrath", text: "« Dix d'entre eux se souviennent de toi. Je suis mort depuis très longtemps, et personne ne s'est jamais souvenu de moi aussi fort. »" },
    "remember-all": { by: "Le Grand Livre", text: "Vingt noms, et chacun connaît le tien. La nuit n'a jamais été aussi peuplée, ni aussi tiède." },
    "kaelen-ran": { by: "Le Roi", text: "« Je n'en veux pas au petit. Il fallait bien que quelqu'un ait peur. Ça m'a laissé libre d'être l'autre chose. »" },
    "nameless-speaks": { by: "Le Sans-Nom", text: "Le heaume se tourne vers toi. Une voix comme une porte fermée depuis des années : « Encore debout ? »" },
    "eldra-loom": { by: "Le Grand Livre", text: "Derrière le rideau d'Eldra : un métier aussi haut que le ciel, et dessus, à moitié tissée, cette nuit." },
    "awakened-hello": { by: "Oriane", text: "« Il a parlé. Je ne l'ai pas entendu venir. J'entends toujours tout venir. »" }
  }
};

export const STRATA_TEXT: Record<Locale, StrataText> = { en, fr };
