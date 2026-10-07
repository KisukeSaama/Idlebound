import type { Locale } from "../../i18n";
import type { LoreLine } from "../types";

/**
 * Age echoes (BIBLE sections 9, 16, 17.1): eight fragments per Age, found when a King of that
 * Age falls for the first time or a Seam is closed there. Index = Age (0 the Kingdom ... 11 the
 * First Mark); the n-th echo found in an Age is line n.
 */
export const AGE_ECHOES_TEXT: Record<Locale, readonly (readonly LoreLine[])[]> = {
  en: [
    // Age I: the Kingdom (Echo, Ash, Void, Astral)
    [
      { by: "Lysandre", text: "Echo, the first stratum under this night: the same road, remembered once more. Its caves repeat voices. Acoustics.* *Checked twice." },
      { by: "Lysandre", text: "Note: in the Echo, bats flinch before the blow lands, as if they had heard it on another night. Poor hearing, surely. To be revised." },
      { by: "The Ledger", text: "Under the ash, Maëlle's fence post. Its notches are older than the fire. She has been counting nights for a very long time." },
      { by: "Lysandre", text: "Ash: long ago the Pyre cult burned the old forests to call back the sun.* A sun does not come when called. *They swear it answered." },
      { by: "An unknown hand", text: "Under the scholar's note, smaller: the sun did not come. Something paler did, the Morning. And the King saw it coming." },
      { by: "Lysandre", text: "Void: a third of the land, gone. Not burned, not drowned: forgotten, whole. I have filed it as an absence. It resents this." },
      { by: "The Ledger", text: "In the Void, a road stops mid-stride. The last footprint faces back. Whoever walked it turned and ran when the Morning took the land." },
      { by: "Lysandre", text: "Astral: stars fell here and cooled to stone. Below lies the Primordial, then nothing.* *Garrick says they are pieces of sky. Garrick digs." },
    ],
    // Age II: the Elder World (Primordial, Titan, Wyrm, Tide, Rime)
    [
      { by: "Lysandre", text: "Primordial: the floor of the world. I have written BOTTOM on my map, in capitals, so nobody wastes their time digging." },
      { by: "Lysandre", text: "Last note on the Primordial: the ground is warm, as if something below were breathing.* *Impossible. There is no below." },
      { by: "An unknown hand", text: "Lysandre's map, torn along the fold. On the back, in charcoal: the road keeps going down. The bottom was only where he stopped." },
      { by: "The Ledger", text: "Titan stratum: the land before the kingdom, when giants walked it. A footprint wide enough to hold a village. The village is inside it." },
      { by: "Aurelion", text: "Small one, this bone was my grandmother. Dragons lived here long before your kingdom. She remembered an older sky than yours." },
      { by: "Aurelion", text: "We wyrms were not made for your world. We were here before Orvane, and we flew over other worlds before it." },
      { by: "An unknown hand", text: "Tide stratum: there was a sea here, before Orvane. Salt on the rocks, shells in the walls. It left and took its shore with it." },
      { by: "The Ledger", text: "Rime stratum. Under the ice, another throne and a crown smaller than his. Someone sat down here long ago, and never got up." },
    ],
    // Age III: the Hallowed (Hallowed, Oracle, Seraph, Hymn, Eclipse)
    [
      { by: "An unknown hand", text: "The temples of the Hallowed all face the sky. Every altar is worn on one side, where people knelt to watch it for cracks." },
      { by: "Lysandre", text: "A late note, shakier: I no longer name the strata. They had names long before me. I only read the labels." },
      { by: "Oriane", text: "The oracles of this stratum say my words a breath before I do. They heard these nights long before me. I let them speak." },
      { by: "The Ledger", text: "Seraph stratum. A winged Remnant, six wings folded over its eyes, as if something in the sky were too bright to look at." },
      { by: "Oriane", text: "The Hymn has one verse and never ends. It is a prayer for the night to hold. Célestine knows it. She never learned it." },
      { by: "An unknown hand", text: "The priests of the Eclipse feared the Morning. They prayed for one more night, then one more, until their prayer said: forever." },
      { by: "The Ledger", text: "In the Eclipse temple hangs a bell with no tongue. It rings at every dusk anyway. It first rang the night the Long Night was woven." },
      { by: "An unknown hand", text: "Someone answered the Eclipse priests: a king who asked, and Eldra, who wove. The answer is cut above the door, one word: yes." },
    ],
    // Age IV: the Making of the Stars (Nebula, Comet, Zenith, Nadir, Aurora)
    [
      { by: "An unknown hand", text: "Nebula stratum. The sky is not glass yet, only heat, still being poured. This is where the Sky-Glass over Orvane was made." },
      { by: "Eldra", text: "Do not touch the sky while it is warm. It keeps the marks of fingers. Mine are still in it: I helped shape the glass that holds the night." },
      { by: "The Ledger", text: "Comet stratum. A star that fell and did not break rolls slowly by. Pip, the golden rat, walks beside it. He is in every stratum." },
      { by: "An unknown hand", text: "At the Zenith every star shines as hard as it can, the way things shine when they know they will not last." },
      { by: "Eldra", text: "At the Nadir, the lowest point of the sky, I stood and wove the Long Night. I had a great deal of thread and very little time." },
      { by: "Lysandre", text: "Addendum: the stars are younger than the kingdom's grandmothers. The sky was made to cover Orvane.* *I have stopped footnoting." },
      { by: "The Ledger", text: "Aurora stratum. Pale light rises to the edge of the sky, then falls back. The Ledger files it as a rehearsal of the Dawn." },
      { by: "Eldra", text: "The Dawn is the Morning arriving. First the edges go pale, then the colors, then the names. I have seen it. I will not show you." },
    ],
    // Age V: the Loom (Warp, Weft, Shuttle, Knot, Frayed)
    [
      { by: "The Ledger", text: "Warp stratum. Threads run from the ground to the sky: the Long Night, woven. Pluck one, and a Remnant somewhere turns its head." },
      { by: "Eldra", text: "Every thread is one night. I have woven them all, from the first one on. I stopped counting at a number that has no name." },
      { by: "An unknown hand", text: "On the weft, tiny letters, the same three words again and again: one more night. The King's request, woven into every thread." },
      { by: "Eldra", text: "The shuttle carries each night across my loom. Lately it walks like you. Every walker's steps pass through my hands." },
      { by: "The Ledger", text: "Knot stratum. Beside the King's thread, a short one, snapped clean: Kaelen's, who ran on the first night. The King's goes on." },
      { by: "Eldra", text: "Aldemar asked me for one more night. The spell could only make it endless. It was the only size it came in." },
      { by: "An unknown hand", text: "Frayed stratum. The weave is thin; light comes through between the threads. It is the Morning, waiting on the other side." },
      { by: "Eldra", text: "Do not pull that loose end. If the weave comes undone, the Morning comes in and Orvane ends. I know it is right there." },
    ],
    // Age VI: the Draft (Sketch, Charcoal, Outline, Erased, Palimpsest)
    [
      { by: "An unknown hand", text: "Sketch stratum. The trees are outlines, the river a single line. Before Orvane was a kingdom, it was a drawing." },
      { by: "Eldra", text: "Before my loom, a hand drew the world I would weave. I only followed its lines. I never saw whose hand it was." },
      { by: "The Ledger", text: "Charcoal stratum. The walker's hands leave smudges on older smudges of the same size. Other walkers came this deep before." },
      { by: "Lysandre", text: "Found: a map of Orvane drawn before Orvane existed. My handwriting is on it. So the world was planned, and I was in the plan." },
      { by: "An unknown hand", text: "Outline stratum. A second keep, sketched beside the first and left without a door. A second Orvane, never finished." },
      { by: "The Ledger", text: "Erased stratum. A shape where something was drawn and rubbed out: a whole kingdom. The Remnants walk around it carefully." },
      { by: "Eldra", text: "The first draft of the world had no night in it, and it did not last. The night is what keeps this one going." },
      { by: "An unknown hand", text: "Palimpsest. Under this world's lines, another world's. Under those, a hand resting on the page, not drawing yet." },
    ],
    // Age VII: the Words (Rune, Glyph, Verse, Name, Whisper)
    [
      { by: "The Ledger", text: "Rune stratum. Every stone is a letter, the road a sentence. Orvane was written before it was drawn. The walker stands on a comma." },
      { by: "Lysandre", text: "I can read it. It is a list of everything in Orvane, written before Orvane. My name is on it, misspelled." },
      { by: "An unknown hand", text: "In the oldest glyphs, night is written with two signs: road, and again. The Long Night was in the words from the start." },
      { by: "Eldra", text: "Before I wove the night, it was said aloud. I only took the words and gave them something to hold on to." },
      { by: "The Ledger", text: "Verse stratum. The Remnants speak in rhyme, to be remembered. When a rhyme breaks, the Remnant forgets what it was." },
      { by: "An unknown hand", text: "Name stratum. A word carved again and again until the stone gave way: the Nameless's old name. He touched the hole and walked on." },
      { by: "Eldra", text: "Every walker keeps one word the altars cannot take. The Nameless kept Aldric. I have tried to learn which word is yours." },
      { by: "An unknown hand", text: "Whisper stratum. Ear to the road, you hear a low voice telling the world to itself, stretch by stretch, so that it will not stop." },
    ],
    // Age VIII: the Edge of Sleep (Lull, Reverie, Slumber, Drowse, Threshold)
    [
      { by: "The Ledger", text: "Lull stratum. The Remnants slow down, and so does the walker. This deep, the night stops being a memory and becomes a dream." },
      { by: "Eldra", text: "Speak softly. Orvane is a dream, and this is the edge of the sleep that holds it. Everything here is almost asleep." },
      { by: "An unknown hand", text: "Reverie stratum. The road folds back on itself like a blanket at the foot of a bed. In a dream, nobody minds." },
      { by: "Eldra", text: "The Morning is the dreamer waking up. When the dreamer wakes, Orvane ends. My Long Night keeps the dreamer asleep." },
      { by: "The Ledger", text: "Slumber stratum. A slow breath from every direction at once: the dreamer, asleep. The Ledger counted four breaths in one night." },
      { by: "Oriane", text: "Here I hear no old nights and no new ones. Only someone breathing in their sleep, and all of us inside the dream. It frightens me." },
      { by: "An unknown hand", text: "Drowse stratum. Half the stars are shut, like eyes. The dreamer is close to waking, and fighting it with all their strength." },
      { by: "Eldra", text: "At the Threshold, Morgrath said it to everyone: we are someone's dream. I would have told you more gently. Not near the loom." },
    ],
    // Age IX: the Dreamer's Room (Lantern, Hearth, Lullaby, Window, Glass)
    [
      { by: "An unknown hand", text: "Lantern stratum. The Remnants cast two shadows: one from the stars, one from a lamp above the sky, in the dreamer's room." },
      { by: "Célestine", text: "the lamp hums lower than the crystals, like someone breathing beside it. it's the dreamer's lamp. it has been on all along." },
      { by: "The Ledger", text: "Hearth stratum. Warmth from no direction: the dreamer's room, lit and warm. The Remnants turn toward it like cats and forget to fight." },
      { by: "Célestine", text: "the tune here is mine, only slower. someone in the dreamer's room is humming it. i stopped to listen. they didn't stop." },
      { by: "An unknown hand", text: "A blanket the size of the Plains, pulled up to the edge of the sky. Under it, the shape of the road, and of someone asleep." },
      { by: "The Ledger", text: "Window stratum. A pale rectangle in the dark: the window of the dreamer's room. The King stands before it. He has always known." },
      { by: "Célestine", text: "the crystals only fall when the dreamer is looking at us. that's what they are: the dreamer's eyes on the world. i waved." },
      { by: "An unknown hand", text: "Glass stratum. Behind the sky, a face watches the road and blinks when you do. The dreamer is you, the player, looking in." },
    ],
    // Age X: the Unmaking (Hollow, Muffled, Hush, Oblivion, Absence)
    [
      { by: "The Ledger", text: "Hollow stratum. A cup-shaped hollow where a cup was, a wolf-shaped one where a wolf was. This is what waking does: things leave." },
      { by: "An unknown hand", text: "Muffled stratum. The sword lands, and the sound comes later and smaller, from the next room, the way a dream fades." },
      { by: "Oriane", text: "I say a thing and it arrives late. I say it again and it never arrives. The dream is forgetting to finish my sentences." },
      { by: "The Ledger", text: "Hush stratum. Someone has a finger to their lips, so as not to wake the dreamer. The Ledger writes smaller, to help." },
      { by: "An unknown hand", text: "Here Maëlle's fence post has no notches yet. The nights she counted are coming undone, one by one." },
      { by: "Eldra", text: "If the Morning comes, it will not burn. It will be like this: a soft grey, and no one left to call it grey." },
      { by: "The Ledger", text: "Oblivion stratum. The Ledger finds a page it does not remember writing. The hand is its own. The ink fades like a dream at waking." },
      { by: "An unknown hand", text: "Absence stratum. The throne is empty and still warm. This deep, the dream can barely hold the King, even as a memory." },
    ],
    // Age XI: the Blank (Pale, Faint, Margin, Blank, Ink)
    [
      { by: "The Ledger", text: "Pale stratum. The night has worn thin. Behind it the sky is the color of milk: early light in the dreamer's room." },
      { by: "An unknown hand", text: "Faint stratum. The Remnants are almost gone. They fight anyway, the way you hum a song you half remember." },
      { by: "Oriane", text: "I cannot hear tomorrow here. There is not enough of the dream left to make one." },
      { by: "The Ledger", text: "Margin stratum. The walker has stepped past the edge of the dream. The Ledger keeps drawing the road, out of habit." },
      { by: "An unknown hand", text: "Snow, or a blank page. Your footprints are the first thing written on it. Look back: they already make a sentence." },
      { by: "Eldra", text: "I never wove this far. There is nothing here to hold. You are the only thread out here, and I did not weave you. The dreamer did." },
      { by: "The Ledger", text: "Blank stratum. No page numbers. The Ledger opens a new page and, for the first time, does not know what to write." },
      { by: "An unknown hand", text: "Ink stratum. One drop at the tip of a pen, trembling. The next line of the world is not written yet. It waits for you." },
    ],
    // Age XII: the First Mark (Point, Spark, Breath, Gaze, Dawn)
    [
      { by: "An unknown hand", text: "Point stratum. One point of light, and around it the idea of a road. The dream began like this: someone looked at a point." },
      { by: "The Ledger", text: "Point stratum. The King is small here, smaller at every stage, as if seen from very far away, from outside the dream." },
      { by: "Célestine", text: "the point is warm. it hums one note, the first note of every song i know. someone started it just by looking." },
      { by: "An unknown hand", text: "Spark stratum. Something catches, very small. Every world starts this way: a spark no one puts out, a dream no one ends." },
      { by: "Eldra", text: "Before the loom, the words and the lines, someone looked into the dark and began to dream. That is all I know. I never said it." },
      { by: "The Ledger", text: "Breath stratum. The dreamer breathes in, about to wake, and holds it. The Ledger holds its own breath. It never needed to." },
      { by: "An unknown hand", text: "At the foot of the page, the unknown hand signs at last: one letter, A, worn by a thumb. The same letter as on the King's crown." },
      { by: "An unknown hand", text: "The pale line of the Dawn lets you through. Behind it the road goes down into the dark again: the Kingdom's first night, drawn once more." },
    ],
  ],
  fr: [
    // Âge I : le Royaume
    [
      { by: "Lysandre", text: "Écho, première strate sous cette nuit : la même route, remémorée une fois encore. Les cavernes y répètent les voix. Acoustique.* *Vérifié." },
      { by: "Lysandre", text: "Note : à l'Écho, les chauves-souris sursautent avant le coup, comme si elles l'avaient entendu une autre nuit. Mauvaise ouïe. À revoir." },
      { by: "Le Grand Livre", text: "Sous la cendre, le poteau de Maëlle. Ses encoches sont plus vieilles que l'incendie. Elle compte les nuits depuis très longtemps." },
      { by: "Lysandre", text: "Cendre : jadis, le culte du Bûcher brûla les forêts pour rappeler le soleil.* Un soleil ne vient pas sur appel. *Ils jurent qu'il a répondu." },
      { by: "Une main inconnue", text: "Sous la note du savant, en plus petit : le soleil n'est pas venu. Quelque chose de plus pâle, si : le Matin. Et le Roi l'a vu venir." },
      { by: "Lysandre", text: "Néant : un tiers du pays, disparu. Ni brûlé ni noyé : oublié, en entier. Je l'ai classé comme une absence. Il le prend mal." },
      { by: "Le Grand Livre", text: "Dans le Néant, une route s'arrête en plein pas. La dernière empreinte regarde en arrière. Quelqu'un a fui quand le Matin a pris le pays." },
      { by: "Lysandre", text: "Astral : des étoiles tombées ici, refroidies en pierre. Dessous, le Primordial, puis rien.* *Garrick dit que c'est du ciel. Garrick creuse." },
    ],
    // Âge II : le Monde ancien
    [
      { by: "Lysandre", text: "Primordial : le plancher du monde. J'ai écrit FOND sur ma carte, en capitales, pour que personne ne perde son temps à creuser." },
      { by: "Lysandre", text: "Dernière note sur le Primordial : le sol est tiède, comme si quelque chose respirait dessous.* *Impossible. Il n'y a pas de dessous." },
      { by: "Une main inconnue", text: "La carte de Lysandre, déchirée au pli. Au dos, au fusain : la route continue de descendre. Le fond, c'était seulement là où il s'est arrêté." },
      { by: "Le Grand Livre", text: "Strate du Titan : le pays d'avant le royaume, quand des géants l'arpentaient. Une empreinte large comme un village. Le village est dedans." },
      { by: "Aurelion", text: "Petite chose, cet os était ma grand-mère. Les dragons vivaient ici bien avant Orvane. Elle se souvenait d'un ciel plus vieux que le tien." },
      { by: "Aurelion", text: "Nous autres guivres n'avons pas été faites pour ton monde. Nous étions là avant Orvane, et nous avons survolé d'autres mondes avant lui." },
      { by: "Une main inconnue", text: "Strate de la Marée : il y avait une mer ici, avant Orvane. Du sel aux rochers, des coquillages aux murs. Elle est partie avec son rivage." },
      { by: "Le Grand Livre", text: "Strate du Givre. Sous la glace, un autre trône, une couronne plus petite que la sienne. Quelqu'un s'est assis là, jadis, sans se relever." },
    ],
    // Âge III : le Sacré
    [
      { by: "Une main inconnue", text: "Les temples du Sacré regardent tous le ciel. Chaque autel est usé d'un seul côté, là où l'on s'agenouillait pour guetter les fêlures." },
      { by: "Lysandre", text: "Note tardive, d'une main moins sûre : je ne nomme plus les strates. Elles avaient un nom bien avant moi. Je lis les étiquettes." },
      { by: "Oriane", text: "Les oracles de cette strate disent mes mots un souffle avant moi. Ils ont entendu ces nuits bien avant moi. Je les laisse parler." },
      { by: "Le Grand Livre", text: "Strate du Séraphin. Un Vestige ailé, six ailes repliées sur les yeux, comme si quelque chose dans le ciel était trop vif pour être regardé." },
      { by: "Oriane", text: "L'Hymne n'a qu'un couplet et ne finit jamais. C'est une prière pour que la nuit tienne. Célestine la connaît. Elle ne l'a jamais apprise." },
      { by: "Une main inconnue", text: "Les prêtres de l'Éclipse craignaient le Matin. Ils ont prié pour une nuit de plus, puis une autre, jusqu'à prier pour : toujours." },
      { by: "Le Grand Livre", text: "Au temple de l'Éclipse, une cloche sans battant sonne à chaque crépuscule. Elle a sonné d'abord la nuit où la Longue Nuit fut tissée." },
      { by: "Une main inconnue", text: "Quelqu'un a répondu aux prêtres de l'Éclipse : un roi qui a demandé, et Eldra, qui a tissé. La réponse est gravée au linteau, un mot : oui." },
    ],
    // Âge IV : la Naissance des étoiles
    [
      { by: "Une main inconnue", text: "Strate de la Nébuleuse. Le ciel n'est pas encore du verre, seulement de la chaleur qu'on coule. Ici fut faite la Voûte au-dessus d'Orvane." },
      { by: "Eldra", text: "Ne touche pas le ciel tant qu'il est chaud : il garde la trace des doigts. Les miens y sont. J'ai façonné le verre qui retient la nuit." },
      { by: "Le Grand Livre", text: "Strate de la Comète. Une étoile tombée sans se briser roule lentement. Pip, le rat doré, marche à côté. Il est dans chaque strate." },
      { by: "Une main inconnue", text: "Au Zénith, chaque étoile brille aussi fort qu'elle peut, comme brillent les choses qui savent qu'elles ne dureront pas." },
      { by: "Eldra", text: "Au Nadir, le point le plus bas du ciel, je me suis tenue debout et j'ai tissé la Longue Nuit. J'avais beaucoup de fil et très peu de temps." },
      { by: "Lysandre", text: "Addendum : les étoiles sont plus jeunes que les grands-mères du royaume. Le ciel a été fait pour couvrir Orvane.* *J'arrête les notes." },
      { by: "Le Grand Livre", text: "Strate de l'Aurore. Une lumière pâle monte jusqu'au bord du ciel, puis redescend. Le Grand Livre l'inscrit comme une répétition de l'Aube." },
      { by: "Eldra", text: "L'Aube, c'est le Matin qui arrive. D'abord les bords pâlissent, puis les couleurs, puis les noms. Je l'ai vue. Je ne te la montrerai pas." },
    ],
    // Âge V : le Métier
    [
      { by: "Le Grand Livre", text: "Strate de la Chaîne. Des fils tendus du sol au ciel : la Longue Nuit, tissée. Pinces-en un et, quelque part, un Vestige tourne la tête." },
      { by: "Eldra", text: "Chaque fil est une nuit. Je les ai toutes tissées, depuis la première. J'ai cessé de compter à un nombre qui n'a pas de nom." },
      { by: "Une main inconnue", text: "Sur la trame, des lettres minuscules, les trois mêmes mots sans fin : encore une nuit. La demande du Roi, tissée dans chaque fil." },
      { by: "Eldra", text: "La navette porte chaque nuit d'un bord à l'autre du métier. Depuis peu, elle a ta démarche. Les pas de tout marcheur passent par mes mains." },
      { by: "Le Grand Livre", text: "Strate du Nœud. À côté du fil du Roi, un fil court, cassé net : celui de Kaelen, qui a fui la première nuit. Celui du Roi continue." },
      { by: "Eldra", text: "Aldemar m'a demandé une nuit de plus. Le sort ne savait la faire que sans fin. Il n'existait qu'à cette taille-là." },
      { by: "Une main inconnue", text: "Strate de l'Effiloché. Le tissage est mince, la lumière passe entre les fils. C'est le Matin, qui attend de l'autre côté." },
      { by: "Eldra", text: "Ne tire pas sur ce bout qui dépasse. Si le tissage se défait, le Matin entre et Orvane finit. Je sais qu'il est juste là." },
    ],
    // Âge VI : l'Ébauche
    [
      { by: "Une main inconnue", text: "Strate de l'Esquisse. Les arbres sont des contours, la rivière un seul trait. Avant d'être un royaume, Orvane était un dessin." },
      { by: "Eldra", text: "Avant mon métier, une main a dessiné le monde que j'allais tisser. Je n'ai fait que suivre ses traits. Je n'ai jamais vu à qui elle était." },
      { by: "Le Grand Livre", text: "Strate du Fusain. Les mains du marcheur laissent des traces sur d'autres, plus vieilles, de même taille. D'autres sont venus aussi loin." },
      { by: "Lysandre", text: "Trouvé : une carte d'Orvane tracée avant Orvane. Mon écriture est dessus. Le monde a donc été prévu, et j'étais dans le plan." },
      { by: "Une main inconnue", text: "Strate du Contour. Un second donjon, esquissé à côté du premier, laissé sans porte. Une seconde Orvane, jamais finie." },
      { by: "Le Grand Livre", text: "Strate du Gommé. Une forme là où quelque chose a été dessiné puis effacé : tout un royaume. Les Vestiges la contournent avec précaution." },
      { by: "Eldra", text: "Le premier jet du monde n'avait pas de nuit, et il n'a pas tenu. C'est la nuit qui fait durer celui-ci." },
      { by: "Une main inconnue", text: "Palimpseste. Sous les traits de ce monde, ceux d'un autre. Sous ceux-là, une main posée sur la page, qui ne dessine pas encore." },
    ],
    // Âge VII : les Mots
    [
      { by: "Le Grand Livre", text: "Strate des Runes. Chaque pierre est une lettre, la route une phrase. Orvane fut écrite avant d'être tracée. Le marcheur est sur une virgule." },
      { by: "Lysandre", text: "Je sais le lire. C'est une liste de tout ce qu'il y a en Orvane, écrite avant Orvane. Mon nom y est, mal orthographié." },
      { by: "Une main inconnue", text: "Dans les plus vieux glyphes, la nuit s'écrit avec deux signes : route, et encore. La Longue Nuit était dans les mots dès le début." },
      { by: "Eldra", text: "Avant que je la tisse, la nuit avait été dite à voix haute. J'ai seulement pris les mots et je leur ai donné de quoi s'accrocher." },
      { by: "Le Grand Livre", text: "Strate du Vers. Les Vestiges parlent en rimes, pour qu'on se souvienne d'eux. Quand une rime casse, le Vestige oublie ce qu'il était." },
      { by: "Une main inconnue", text: "Strate du Nom. Un mot gravé et regravé jusqu'à percer la pierre : l'ancien nom du Sans-Nom. Il a touché le trou, puis il a repris la route." },
      { by: "Eldra", text: "Chaque marcheur garde un mot que les autels ne peuvent pas prendre. Le Sans-Nom a gardé Aldric. J'ai essayé d'apprendre quel est le tien." },
      { by: "Une main inconnue", text: "Strate du Murmure. L'oreille contre la route, on entend une voix basse raconter le monde à lui-même, pas à pas, pour qu'il ne s'arrête pas." },
    ],
    // Âge VIII : l'Orée du sommeil
    [
      { by: "Le Grand Livre", text: "Strate de l'Accalmie. Les Vestiges ralentissent, le marcheur aussi. Si profond, la nuit cesse d'être un souvenir et devient un rêve." },
      { by: "Eldra", text: "Parle bas. Orvane est un rêve, et nous sommes au bord du sommeil qui le porte. Tout, ici, est presque endormi." },
      { by: "Une main inconnue", text: "Strate de la Rêverie. La route se replie comme une couverture au pied d'un lit. Dans un rêve, personne ne s'en soucie." },
      { by: "Eldra", text: "Le Matin, c'est le rêveur qui se réveille. Quand il se réveille, Orvane finit. Ma Longue Nuit garde le rêveur endormi." },
      { by: "Le Grand Livre", text: "Strate du Sommeil. Un souffle lent venu de partout à la fois : le rêveur, endormi. Le Grand Livre en a compté quatre en une nuit." },
      { by: "Oriane", text: "Ici, je n'entends ni les vieilles nuits ni les nouvelles. Seulement quelqu'un qui respire en dormant, et nous tous dans son rêve. J'ai peur." },
      { by: "Une main inconnue", text: "Strate de la Somnolence. La moitié des étoiles sont fermées, comme des yeux. Le rêveur est près de s'éveiller, et lutte de toute sa force." },
      { by: "Eldra", text: "Au Seuil, Morgrath l'a dit devant tous : nous sommes le rêve de quelqu'un. Je te l'aurais dit plus doucement. Pas près du métier." },
    ],
    // Âge IX : la Chambre
    [
      { by: "Une main inconnue", text: "Strate de la Lanterne. Les Vestiges ont deux ombres : l'une des étoiles, l'autre d'une lampe au-dessus du ciel, dans la chambre du rêveur." },
      { by: "Célestine", text: "la lampe fredonne plus bas que les cristaux, comme quelqu'un qui respire à côté. c'est la lampe du rêveur. elle est allumée depuis toujours." },
      { by: "Le Grand Livre", text: "Strate de l'Âtre. Une chaleur sans direction : la chambre du rêveur, tiède. Les Vestiges s'y tournent en chats et oublient de se battre." },
      { by: "Célestine", text: "ici, l'air est le mien, en plus lent. quelqu'un le fredonne dans la chambre du rêveur. je me suis arrêtée pour écouter. eux, non." },
      { by: "Une main inconnue", text: "Une couverture grande comme les Plaines, remontée jusqu'au bord du ciel. Dessous, la forme de la route, et celle de quelqu'un qui dort." },
      { by: "Le Grand Livre", text: "Strate de la Fenêtre. Un rectangle pâle dans le noir : la fenêtre de la chambre du rêveur. Le Roi se tient devant. Il l'a toujours su." },
      { by: "Célestine", text: "les cristaux ne tombent que quand le rêveur nous regarde. c'est ça qu'ils sont : ses yeux posés sur le monde. j'ai fait coucou." },
      { by: "Une main inconnue", text: "Strate de la Vitre. Derrière le ciel, un visage regarde la route et cligne quand tu clignes. Le rêveur, c'est toi, le joueur qui regarde." },
    ],
    // Âge X : le Défaire
    [
      { by: "Le Grand Livre", text: "Strate du Creux. Un creux en forme de tasse où était une tasse, de loup où était un loup. Voilà ce que fait le réveil : les choses partent." },
      { by: "Une main inconnue", text: "Strate de la Sourdine. L'épée frappe, et le bruit arrive plus tard, plus petit, depuis la pièce d'à côté, comme un rêve qui s'efface." },
      { by: "Oriane", text: "Je dis une chose et elle arrive en retard. Je la redis et elle n'arrive jamais. Le rêve oublie de finir mes phrases." },
      { by: "Le Grand Livre", text: "Strate du Chut. Quelqu'un a posé un doigt sur ses lèvres, pour ne pas réveiller le rêveur. Le Grand Livre écrit plus petit, pour aider." },
      { by: "Une main inconnue", text: "Ici, le poteau de Maëlle n'a pas encore d'encoches. Les nuits qu'elle a comptées se défont, une à une." },
      { by: "Eldra", text: "Si le Matin vient, il ne brûlera pas. Ce sera comme ici : un gris très doux, et plus personne pour dire que c'est gris." },
      { by: "Le Grand Livre", text: "Strate de l'Oubli. Le Grand Livre trouve une page qu'il ne se rappelle pas avoir écrite. Sa main. L'encre pâlit comme un rêve au réveil." },
      { by: "Une main inconnue", text: "Strate de l'Absence. Le trône est vide, encore tiède. Si profond, le rêve peine à retenir le Roi, même comme un souvenir." },
    ],
    // Âge XI : le Vierge
    [
      { by: "Le Grand Livre", text: "Strate du Pâle. La nuit s'est usée. Derrière, le ciel a la couleur du lait : la première lumière dans la chambre du rêveur." },
      { by: "Une main inconnue", text: "Strate du Ténu. Les Vestiges ont presque disparu. Ils se battent quand même, comme on fredonne une chanson à moitié oubliée." },
      { by: "Oriane", text: "Ici, je n'entends pas demain. Il ne reste pas assez du rêve pour en faire un." },
      { by: "Le Grand Livre", text: "Strate de la Marge. Le marcheur a dépassé le bord du rêve. Le Grand Livre continue de tracer la route, par habitude." },
      { by: "Une main inconnue", text: "Neige, ou page blanche. Tes pas sont la première chose écrite dessus. Retourne-toi : ils font déjà une phrase." },
      { by: "Eldra", text: "Je n'ai jamais tissé aussi loin. Il n'y a rien où s'accrocher. Tu es le seul fil ici, et ce n'est pas moi qui t'ai tissé. C'est le rêveur." },
      { by: "Le Grand Livre", text: "Strate du Vierge. Aucune page numérotée. Le Grand Livre en ouvre une et, pour la première fois, ne sait pas quoi écrire." },
      { by: "Une main inconnue", text: "Strate de l'Encre. Une goutte au bout d'une plume, qui tremble. La prochaine ligne du monde n'est pas encore écrite. Elle t'attend." },
    ],
    // Âge XII : la Première Marque
    [
      { by: "Une main inconnue", text: "Strate du Point. Un point de lumière, et autour, l'idée d'une route. Le rêve a commencé ainsi : quelqu'un a regardé un point." },
      { by: "Le Grand Livre", text: "Strate du Point. Le Roi est petit, ici, plus petit à chaque étape, comme vu de très loin, depuis l'extérieur du rêve." },
      { by: "Célestine", text: "le point est tiède. il chante une note, la première de toutes les chansons que je connais. quelqu'un l'a commencée rien qu'en regardant." },
      { by: "Une main inconnue", text: "Strate de l'Étincelle. Quelque chose prend, tout petit. Tout monde commence ainsi : une étincelle qu'on n'éteint pas, un rêve sans fin." },
      { by: "Eldra", text: "Avant le métier, les mots et les traits, quelqu'un a regardé le noir et s'est mis à rêver. C'est tout ce que je sais. Je ne l'ai jamais dit." },
      { by: "Le Grand Livre", text: "Strate du Souffle. Le rêveur inspire, près de s'éveiller, et retient son souffle. Le Grand Livre retient le sien. Jamais il n'en eut besoin." },
      { by: "Une main inconnue", text: "Au bas de la page, la main inconnue signe enfin : une seule lettre, A, usée par un pouce. La même que sur la couronne du Roi." },
      { by: "Une main inconnue", text: "La ligne pâle de l'Aube te laisse passer. Derrière, la route redescend dans le noir : la première nuit du Royaume, dessinée à nouveau." },
    ],
  ],
};
