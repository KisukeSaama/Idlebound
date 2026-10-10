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
    { by: "The Ledger", text: "The King looked at you as if you were late. Walkers have fought him every night, longer than anyone remembers. He expected you." },
    { by: "The Ledger", text: "The bats screeched before you struck. They had heard this fight before: this same night has been lived many times over." },
    { by: "Brother Cinder", text: "Under the ash lie the same fields. The Pyre burned them long ago to call back the sun. They still think the Morning is a sun." },
    { by: "Lysandre", text: "A third of my map is missing. Not burned, not flooded: forgotten whole. The Morning came close here once, and erased what it touched." },
    { by: "The Ledger", text: "Garrick held a fallen star up to the sky, and it fit a crack exactly. The stars are pieces of the sky, and the sky is glass." },
    // Age II: the Elder World
    { by: "The Ledger", text: "Lysandre's map ends here with one word: BOTTOM. He named this stratum Primordial, the beginning of the world." },
    { by: "The Ledger", text: "The ground kept going below BOTTOM. Lysandre was wrong: the world is far older than the sages of Orvane believed." },
    { by: "The Ledger", text: "Aurelion bowed to a bone the size of a valley. Dragons lived here long before Orvane existed. He is the last of them." },
    { by: "Aurelion", text: "There was a sea here, long before Orvane. This night remembers things that happened before anyone in it was born." },
    { by: "Kaelen", text: "A crown in the ice, smaller than Aldemar's. He was not the first king that throne kept. Whoever stops walking, the crown holds." },
    // Age III: the Hallowed
    { by: "Lysandre", text: "Temples to a god with no name, all facing the sky. The people of this stratum prayed to whatever lies above the Sky-Glass." },
    { by: "The Ledger", text: "Oriane went quiet. The oracles of this stratum said her words before she did. She is not the first to hear other nights." },
    { by: "An unknown hand", text: "A seraph with six wings, all folded over its eyes. It could not bear to look at the Morning's light." },
    { by: "The Ledger", text: "Célestine knew this stratum's hymn by heart, and never learned it. It is the song the crystals have always sung to her." },
    { by: "Morgrath", text: "The priests of the Eclipse prayed for a night that would never end. Aldemar asked for the same, and Eldra the weaver answered." },
    // Age IV: the Making of the Stars
    { by: "Garrick", text: "Down here the sky is not glass yet. It is still being poured, like a lamp in a mould. Someone made our sky by hand." },
    { by: "The Ledger", text: "In this stratum the stars are new. One fell without breaking, rolled to your feet, and waited to be picked up." },
    { by: "Aurelion", text: "Everything here stands at its highest point, and knows it cannot stay. Nothing in this world was made to last forever." },
    { by: "Oriane", text: "At the lowest point of the sky, a woman is weaving. It is Eldra, long before she wove the Long Night. I hear her loom." },
    { by: "Ashka", text: "This light is not the Dawn, only its rehearsal. The real Dawn waits at the end of the road. When it comes, the night ends." },
    // Age V: the Loom
    { by: "The Ledger", text: "Threads run from the ground to the sky, taut and humming. The Long Night is woven, and here you can see its threads." },
    { by: "The Ledger", text: "Eldra's handwriting is on the threads: tiny, tired notes. She has mended this night by hand since the day she wove it." },
    { by: "Ysolde", text: "Something runs between the threads every night, back and forth, and the weave grows behind it. It looks like you. It is the walkers." },
    { by: "The Ledger", text: "A knot the size of a keep, with the King's name tied into it. The whole Long Night is fastened to Aldemar." },
    { by: "Ashka", text: "Here the weave is worn thin enough to let light through. The Long Night will not hold forever." },
    // Age VI: the Draft
    { by: "Séraphine", text: "The trees here are only outlines, never colored in. Before Orvane was finished, someone drew it first." },
    { by: "The Ledger", text: "Everything in this stratum is drawn in charcoal. Your hands leave smudges on whatever you touch." },
    { by: "Lysandre", text: "A second Orvane, drawn beside the first and never finished. Ours was not the only draft of the world. I was wrong again." },
    { by: "An unknown hand", text: "Something was drawn here, then rubbed out. Its shape is still on the page. Whoever drew Orvane changed their mind." },
    { by: "Eldra", text: "Under this world are the lines of an older one, scraped away to make room. I drew neither. I only wove the night." },
    // Age VII: the Words
    { by: "Lysandre", text: "Every stone here is a letter, and the road is a sentence. Orvane was written before it was built." },
    { by: "The Ledger", text: "In the oldest writing, the sign for 'king' and the sign for 'tired' are the same. Whoever wrote it knew Aldemar." },
    { by: "Célestine", text: "The Remnants here speak in rhyme, so they are easier to remember. They are afraid of being forgotten." },
    { by: "The Ledger", text: "The Nameless stopped here. He heard his own name, the one he gave away to the altars long ago. He will not say it." },
    { by: "Oriane", text: "Someone is telling this world to itself, very quietly, so it will not stop. Orvane lasts as long as the telling does." },
    // Age VIII: the Edge of Sleep
    { by: "The Ledger", text: "The Remnants move slower here, and so do you. It is not tiredness: the whole night is growing drowsy." },
    { by: "Maëlle", text: "The road loops back on itself, and nobody minds. Things make sense here the way they do when you are half asleep." },
    { by: "The Ledger", text: "Eldra, very softly: \"Do not wake anyone. If the one who sleeps above Orvane wakes, the night ends, and we end with it.\"" },
    { by: "Nyx", text: "Half the stars have closed, like eyes growing heavy. The one who holds up our sky is nearly asleep." },
    { by: "The Ledger", text: "Morgrath said it first, and spat: \"Orvane is a dream. The Morning is the dreamer waking. The King's night keeps them asleep.\"" },
    // Age IX: the Dreamer's Room
    { by: "An unknown hand", text: "Far above the sky, a lamp was left on. Someone sits up late beside it, and Orvane goes on for as long as they do." },
    { by: "Brother Cinder", text: "A warmth with no direction reaches us here. It comes from the dreamer's room, on the other side of the sky." },
    { by: "The Ledger", text: "Célestine stops singing to listen. The dreamer is humming her tune, slower. She has been singing it back all along." },
    { by: "The Ledger", text: "The King stands at a window you have never seen from outside. Through it he watches the dreamer, who watches us." },
    { by: "Garrick", text: "The face I found in a shard, the one that blinks when you do: it is the dreamer, behind the Sky-Glass. It is you." },
    // Age X: the Unmaking
    { by: "Vorn", text: "Things here are shaped like other things that left. This is where the dream lets go of what it no longer needs." },
    { by: "The Ledger", text: "The sounds of the fight arrive late and quiet, as if from another room. The dreamer is only half listening now." },
    { by: "Ysolde", text: "Someone has put a finger to their lips, and the whole stratum obeys. Even the trees take care not to wake anyone." },
    { by: "The Ledger", text: "You forget a companion's name for a second. It comes back, not all of it. This deep, the dream forgets too." },
    { by: "Kaelen", text: "Where the King should be, an empty chair, still warm. Down here, Aldemar has finally stood up." },
    // Age XI: the Blank
    { by: "Morgrath", text: "The night is thinning. Behind it you can see the color of the morning sky. We are very close to the waking." },
    { by: "The Ledger", text: "The Remnants here are almost gone, barely remembered. They fight anyway. So do you." },
    { by: "Lysandre", text: "You have walked off the edge of the drawing. Out here, nothing of Orvane has been imagined yet." },
    { by: "The Ledger", text: "Nothing has been written here yet. Your footprints are the first mark on an empty page." },
    { by: "An unknown hand", text: "A single drop of ink, about to fall. Before Orvane was drawn, this was all there was: a drop, and a hand." },
    // Age XII: the First Mark
    { by: "Aurelion", text: "Every world begins as one point of light, and someone looking at it. I have seen it begin before, for other worlds." },
    { by: "Ashka", text: "The point is warm. It is the first fire, the one my order has prayed to all along. It was never the sun." },
    { by: "Eldra", text: "Something breathes in and holds it: the dreamer, at the edge of waking. I wove the night to make that breath last." },
    { by: "Aldemar", text: "Aldemar, without his crown: \"You came all this way. The night does not end at the light. It goes on below. The road is yours.\"" },
    { by: "The Dawn", text: "Not this way. Behind the light, the road goes down into the night again." }
  ],
  milestones: {
    "ascend-1": { by: "Oriane", text: "\"You've done this before.\" Oriane does not say it like a question. The night starts over at every dusk, and you walk it again." },
    "ascend-5": { by: "The Ledger", text: "Fifth dusk. On the Roll of the Bound, other walkers' names beside yours. Each walks their own night. None of you will ever meet." },
    "ascend-10": { by: "Kaelen", text: "Kaelen, at the tenth dusk, without turning round: \"I had one duty, the night everything stopped. I ran. Someone else paid for it.\"" },
    "ascend-25": { by: "An unknown hand", text: "Scratched on an altar by an earlier walker: never give the altars every memory. Those who did became like the Nameless." },
    "ascend-50": { by: "The Ledger", text: "Fifty nights entered. The walker has never once failed to come back. The King did, once: he sat down, and never got up." },
    "ascend-100": { by: "Eldra", text: "A hundred dusks. Eldra ties a small knot in your thread so she can find you again, the way you fold a page's corner." },
    "descent-1": { by: "The Ledger", text: "The Sanctum comes apart into thread. Eldra winds it on her arm and weaves the night again, one layer deeper into its past." },
    "descent-3": { by: "Eldra", text: "\"Third time. My fingers know the way down better than I do. I wove this night, and I know every layer of it.\"" },
    "descent-5": { by: "The Ledger", text: "Fifth weaving. The Sanctum comes back paler, and the altars have forgotten your hands. Your companions have not." },
    "descent-10": { by: "The Ledger", text: "Tenth weaving. Among your things lies an empty circle the size of a crown: the crown that keeps kings is looking for you." },
    "remember-first": { by: "The Ledger", text: "Tonight a companion who should not know you hesitated before saying hello. Something of your past nights stayed with them." },
    "remember-third": { by: "Ysolde", text: "\"The trees say one of us now remembers you on purpose, from night to night. It hurts. They keep doing it anyway.\"" },
    "remember-whole": { by: "Célestine", text: "someone just remembered all of you, every night of you at once, and the crystals went quiet to listen." },
    "remember-five": { by: "Maëlle", text: "\"Five of us remember you now. We keep a seat for you by the fire, and argue over who sits next to it.\"" },
    "remember-ten": { by: "Morgrath", text: "\"Ten of them remember you. I have been dead a very long time, and nobody ever remembered me that hard.\"" },
    "remember-all": { by: "The Ledger", text: "Twenty companions, and every one of them knows your name. The night has never been this crowded, or this warm." },
    "kaelen-ran": { by: "The King", text: "\"Kaelen was meant to walk the first night. He was afraid, and ran. So I walked it myself. I was never angry with him.\"" },
    "nameless-speaks": { by: "The Nameless", text: "The empty helmet turns toward you. A voice like a door unopened for years: \"Still walking?\"" },
    "eldra-loom": { by: "The Ledger", text: "Behind Eldra's curtain: the loom she wove the Long Night on, as tall as the sky. On it, half woven, is tonight." },
    "awakened-hello": { by: "Oriane", text: "\"The Awakened spoke, for the first time. I did not hear it coming. I always hear things coming.\"" }
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
    { by: "Le Grand Livre", text: "Le roi t'a regardé comme si tu étais en retard. Des marcheurs l'affrontent chaque nuit, depuis toujours. Il t'attendait." },
    { by: "Le Grand Livre", text: "Les chauves-souris ont crié avant ton coup. Elles avaient déjà entendu ce combat : cette même nuit a été vécue bien des fois." },
    { by: "Frère Cendre", text: "Sous la cendre, ce sont les mêmes champs. Le Bûcher les a brûlés jadis pour rappeler le soleil. Ils prennent encore le Matin pour un soleil." },
    { by: "Lysandre", text: "Il manque un tiers de ma carte. Ni brûlé, ni noyé : oublié en entier. Le Matin est passé tout près, ici, et a effacé ce qu'il touchait." },
    { by: "Le Grand Livre", text: "Garrick a levé une étoile tombée vers le ciel : elle comblait pile une fêlure. Les étoiles sont des bouts du ciel, et il est de verre." },
    // Âge II : le Monde ancien
    { by: "Le Grand Livre", text: "La carte de Lysandre s'arrête ici, sur un seul mot : FOND. Il a nommé cette strate Primordial, le commencement du monde." },
    { by: "Le Grand Livre", text: "Le sol continue sous le FOND. Lysandre avait tort : le monde est bien plus vieux que ne le croyaient les sages d'Orvane." },
    { by: "Le Grand Livre", text: "Aurelion s'est incliné devant un os grand comme une vallée. Des dragons vivaient ici bien avant Orvane. Il est le dernier." },
    { by: "Aurelion", text: "Il y avait une mer ici, bien avant Orvane. Cette nuit se souvient de choses arrivées avant la naissance de quiconque." },
    { by: "Kaelen", text: "Dans la glace, une couronne plus petite que celle d'Aldemar. Ce trône a gardé d'autres rois : qui cesse de marcher, la couronne le prend." },
    // Âge III : le Sacré
    { by: "Lysandre", text: "Des temples pour un dieu sans nom, tous tournés vers le ciel. Les gens de cette strate priaient ce qui se trouve au-dessus de la Voûte." },
    { by: "Le Grand Livre", text: "Oriane s'est tue. Les oracles de cette strate disaient ses mots avant elle. Elle n'est pas la première à entendre d'autres nuits." },
    { by: "Une main inconnue", text: "Un séraphin à six ailes, toutes repliées sur ses yeux. Il ne supportait pas de regarder la lumière du Matin." },
    { by: "Le Grand Livre", text: "Célestine connaissait par cœur l'hymne de cette strate, sans l'avoir appris. C'est le chant que les cristaux lui chantent depuis toujours." },
    { by: "Morgrath", text: "Les prêtres de l'Éclipse priaient pour une nuit sans fin. Aldemar a demandé la même chose, et Eldra la tisseuse a répondu." },
    // Âge IV : la Forge des étoiles
    { by: "Garrick", text: "Ici, le ciel n'est pas encore du verre. On le coule encore, comme une lampe dans un moule. Quelqu'un a fait notre ciel à la main." },
    { by: "Le Grand Livre", text: "Dans cette strate, les étoiles sont neuves. L'une est tombée sans se briser, a roulé jusqu'à tes pieds, et attend qu'on la ramasse." },
    { by: "Aurelion", text: "Ici, tout est à son plus haut, et tout sait qu'il ne pourra pas y rester. Rien dans ce monde n'a été fait pour durer toujours." },
    { by: "Oriane", text: "Au point le plus bas du ciel, une femme tisse. C'est Eldra, bien avant qu'elle tisse la Longue Nuit. J'entends son métier." },
    { by: "Ashka", text: "Cette lumière n'est pas l'Aube, seulement sa répétition. La vraie Aube attend au bout de la route. Quand elle viendra, la nuit finira." },
    // Âge V : le Métier à tisser
    { by: "Le Grand Livre", text: "Des fils courent du sol jusqu'au ciel, tendus, bourdonnants. La Longue Nuit est tissée, et ici on voit ses fils." },
    { by: "Le Grand Livre", text: "L'écriture d'Eldra court sur les fils : des notes minuscules et lasses. Elle raccommode cette nuit à la main depuis qu'elle l'a tissée." },
    { by: "Ysolde", text: "Quelque chose court entre les fils, aller, retour, chaque nuit, et la trame pousse derrière. Ça te ressemble. Ce sont les marcheurs." },
    { by: "Le Grand Livre", text: "Un nœud gros comme un donjon, où le nom du roi est noué. Toute la Longue Nuit est attachée à Aldemar." },
    { by: "Ashka", text: "Ici, la trame est assez usée pour laisser passer la lumière. La Longue Nuit ne tiendra pas toujours." },
    // Âge VI : l'Ébauche
    { by: "Séraphine", text: "Les arbres ne sont ici que des contours, jamais coloriés. Avant qu'Orvane soit achevée, quelqu'un l'a d'abord dessinée." },
    { by: "Le Grand Livre", text: "Tout, dans cette strate, est dessiné au fusain. Tes mains laissent des traînées sur tout ce que tu touches." },
    { by: "Lysandre", text: "Une seconde Orvane, dessinée à côté de la première, jamais achevée. La nôtre n'était pas le seul brouillon du monde. Encore tort." },
    { by: "Une main inconnue", text: "On a dessiné quelque chose ici, puis on l'a gommé. La forme reste sur la page. Qui a dessiné Orvane a changé d'avis." },
    { by: "Eldra", text: "Sous ce monde, les lignes d'un plus ancien, grattées pour faire place. Je n'ai dessiné ni l'un ni l'autre. J'ai seulement tissé la nuit." },
    // Âge VII : les Mots
    { by: "Lysandre", text: "Ici, chaque pierre est une lettre, et la route une phrase. Orvane a été écrite avant d'être bâtie." },
    { by: "Le Grand Livre", text: "Dans l'écriture la plus ancienne, le signe « roi » et le signe « fatigué » ne font qu'un. Celui qui l'a écrit connaissait Aldemar." },
    { by: "Célestine", text: "Ici, les Vestiges parlent en rimes, pour qu'on se souvienne d'eux plus facilement. Ils ont peur d'être oubliés." },
    { by: "Le Grand Livre", text: "Le Sans-Nom s'est arrêté ici. Il a entendu son propre nom, celui qu'il a donné aux autels il y a longtemps. Il ne le dira pas." },
    { by: "Oriane", text: "Quelqu'un raconte ce monde à lui-même, tout bas, pour qu'il ne s'arrête pas. Orvane dure tant que dure le récit." },
    // Âge VIII : la Lisière du sommeil
    { by: "Le Grand Livre", text: "Ici, les Vestiges bougent plus lentement. Toi aussi. Ce n'est pas la fatigue : toute la nuit s'assoupit." },
    { by: "Maëlle", text: "La route revient sur elle-même, et personne ne s'en plaint. Ici, les choses ont du sens comme quand on est à moitié endormi." },
    { by: "Le Grand Livre", text: "Eldra, tout bas : « Ne réveille personne. Si celui qui dort au-dessus d'Orvane s'éveille, la nuit finit, et nous avec. »" },
    { by: "Nyx", text: "La moitié des étoiles se sont fermées, comme des yeux qui s'alourdissent. Celui qui tient notre ciel s'endort presque." },
    { by: "Le Grand Livre", text: "Morgrath l'a dit le premier, en crachant : « Orvane est un rêve. Le Matin, c'est le rêveur qui s'éveille. La nuit du roi le garde endormi. »" },
    // Âge IX : la Chambre du rêveur
    { by: "Une main inconnue", text: "Loin au-dessus du ciel, une lampe est restée allumée. Quelqu'un veille à côté, et Orvane continue tant qu'il veille." },
    { by: "Frère Cendre", text: "Une chaleur sans direction nous arrive ici. Elle vient de la chambre du rêveur, de l'autre côté du ciel." },
    { by: "Le Grand Livre", text: "Célestine cesse de chanter pour écouter. Le rêveur fredonne son air, en plus lent. Elle le lui renvoyait depuis toujours." },
    { by: "Le Grand Livre", text: "Le roi se tient à une fenêtre que tu n'as jamais vue du dehors. Par elle, il regarde le rêveur, qui nous regarde." },
    { by: "Garrick", text: "Le visage que j'ai trouvé dans un éclat, celui qui cligne des yeux quand tu le fais : c'est le rêveur, derrière la Voûte. C'est toi." },
    // Âge X : le Dénouement
    { by: "Vorn", text: "Ici, les choses ont la forme d'autres choses, parties. C'est là que le rêve lâche ce dont il n'a plus besoin." },
    { by: "Le Grand Livre", text: "Les bruits du combat arrivent en retard, étouffés, comme d'une autre pièce. Le rêveur n'écoute plus qu'à moitié." },
    { by: "Ysolde", text: "Quelqu'un a posé un doigt sur ses lèvres, et toute la strate obéit. Même les arbres font attention à ne réveiller personne." },
    { by: "Le Grand Livre", text: "Tu oublies le nom d'un compagnon, une seconde. Il revient, pas en entier. Si profond, le rêve oublie lui aussi." },
    { by: "Kaelen", text: "Là où devrait être le roi, un siège vide, encore tiède. Ici, Aldemar s'est enfin levé." },
    // Âge XI : le Blanc
    { by: "Morgrath", text: "La nuit s'amincit. On devine derrière la couleur du ciel du matin. Nous sommes tout près du réveil." },
    { by: "Le Grand Livre", text: "Les Vestiges d'ici ont presque disparu, à peine remémorés. Ils se battent quand même. Toi aussi." },
    { by: "Lysandre", text: "Tu es sorti du dessin par le bord. Ici, rien d'Orvane n'a encore été imaginé." },
    { by: "Le Grand Livre", text: "Rien n'a encore été écrit ici. Tes pas sont la première trace sur une page vierge." },
    { by: "Une main inconnue", text: "Une seule goutte d'encre, sur le point de tomber. Avant qu'on dessine Orvane, il n'y avait que ça : une goutte, et une main." },
    // Âge XII : le Premier Trait
    { by: "Aurelion", text: "Tout monde commence par un point de lumière, et quelqu'un qui le regarde. Je l'ai déjà vu commencer, pour d'autres mondes." },
    { by: "Ashka", text: "Le point est chaud. C'est le premier feu, celui que mon ordre priait depuis le début. Ce n'était jamais le soleil." },
    { by: "Eldra", text: "Quelque chose inspire et retient son souffle : le rêveur, au bord du réveil. J'ai tissé la nuit pour que ce souffle dure." },
    { by: "Aldemar", text: "Aldemar, sans sa couronne : « Tu es venu jusqu'ici. La nuit ne finit pas à la lumière. Elle continue dessous. La route est à toi. »" },
    { by: "L'Aube", text: "Pas par ici. Derrière la lumière, la route redescend dans la nuit." }
  ],
  milestones: {
    "ascend-1": { by: "Oriane", text: "« Tu as déjà fait ça. » Oriane ne le dit pas comme une question. La nuit recommence à chaque crépuscule, et tu la marches encore." },
    "ascend-5": { by: "Le Grand Livre", text: "Cinquième crépuscule. Sur le Registre des Liés, d'autres noms à côté du tien. Chacun marche sa propre nuit. Vous ne vous croiserez jamais." },
    "ascend-10": { by: "Kaelen", text: "Kaelen, au dixième crépuscule, sans se retourner : « J'avais un devoir, la nuit où tout s'est arrêté. J'ai fui. Un autre a payé. »" },
    "ascend-25": { by: "Une main inconnue", text: "Gravé sur un autel par un marcheur d'avant : ne donne jamais tous tes souvenirs aux autels. Ceux qui l'ont fait sont devenus des Sans-Nom." },
    "ascend-50": { by: "Le Grand Livre", text: "Cinquante nuits inscrites. Le marcheur n'a jamais manqué de revenir. Le roi, si, une fois : il s'est assis, et ne s'est jamais relevé." },
    "ascend-100": { by: "Eldra", text: "Cent crépuscules. Eldra fait un petit nœud dans ton fil pour te retrouver, comme on corne une page." },
    "descent-1": { by: "Le Grand Livre", text: "Le Sanctuaire se défait en fil. Eldra l'enroule sur son bras et retisse la nuit, une couche plus loin dans son passé." },
    "descent-3": { by: "Eldra", text: "« Troisième fois. Mes doigts connaissent le chemin qui descend mieux que moi. J'ai tissé cette nuit, j'en connais chaque couche. »" },
    "descent-5": { by: "Le Grand Livre", text: "Cinquième tissage. Le Sanctuaire revient plus pâle, et les autels ont oublié tes mains. Tes compagnons, non." },
    "descent-10": { by: "Le Grand Livre", text: "Dixième tissage. Parmi tes affaires, un cercle vide de la taille d'une couronne : la couronne qui garde les rois te cherche." },
    "remember-first": { by: "Le Grand Livre", text: "Ce soir, un compagnon qui ne devrait pas te connaître a hésité avant de te saluer. Quelque chose de tes nuits passées lui est resté." },
    "remember-third": { by: "Ysolde", text: "« Les arbres disent que l'un de nous se souvient de toi exprès, maintenant, d'une nuit à l'autre. Ça fait mal. Il continue quand même. »" },
    "remember-whole": { by: "Célestine", text: "quelqu'un vient de se souvenir de toi en entier, de toutes tes nuits à la fois, et les cristaux se sont tus pour écouter." },
    "remember-five": { by: "Maëlle", text: "« On est cinq à se souvenir de toi. On te garde une place près du feu, et on se dispute pour savoir qui s'assoit à côté. »" },
    "remember-ten": { by: "Morgrath", text: "« Dix d'entre eux se souviennent de toi. Je suis mort depuis très longtemps, et personne ne s'est jamais souvenu de moi aussi fort. »" },
    "remember-all": { by: "Le Grand Livre", text: "Vingt compagnons, et chacun connaît ton nom. La nuit n'a jamais été aussi peuplée, ni aussi tiède." },
    "kaelen-ran": { by: "Le Roi", text: "« Kaelen devait marcher la première nuit. Il a eu peur, il a fui. Alors je l'ai marchée moi-même. Je ne lui en ai jamais voulu. »" },
    "nameless-speaks": { by: "Le Sans-Nom", text: "Le heaume vide se tourne vers toi. Une voix comme une porte fermée depuis des années : « Encore debout ? »" },
    "eldra-loom": { by: "Le Grand Livre", text: "Derrière le rideau d'Eldra : le métier où elle a tissé la Longue Nuit, haut comme le ciel. Dessus, à moitié tissée, cette nuit." },
    "awakened-hello": { by: "Oriane", text: "« L'Éveillé a parlé, pour la première fois. Je ne l'ai pas entendu venir. J'entends toujours tout venir. »" }
  }
};

export const STRATA_TEXT: Record<Locale, StrataText> = { en, fr };
