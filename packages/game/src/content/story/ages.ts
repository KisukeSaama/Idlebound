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
      { by: "Lysandre", text: "Stratum the first, which I name Echo. The caves repeat what is said in them. Acoustics, nothing more.* *Checked twice." },
      { by: "Lysandre", text: "Note: the Echo bats flinch before the blow lands. Poor hearing, surely. Or excellent hearing. To be revised." },
      { by: "The Ledger", text: "Under the ash, a fence post. Notches on it, older than the fire. The fire was a very long time ago." },
      { by: "Lysandre", text: "Ash: the Pyre burned the Wychwood to call the sun back.* One does not call a sun. *They swear it answered. Zealots swear." },
      { by: "An unknown hand", text: "Under the scholar's note, in a smaller hand: the sun did not come. Something paler did." },
      { by: "Lysandre", text: "Void: a third of the land, gone. Not burned, not drowned. I have classified it as an absence. It resents this." },
      { by: "The Ledger", text: "In the Void stratum, a road stops mid-stride. On the last stone, one footprint, facing back the way it came." },
      { by: "Lysandre", text: "Astral: fallen stars, cooled to stone. Below this, only Primordial, and below that, nothing.* *Measured. Twice. Backwards." },
    ],
    // Age II: the Elder World (Primordial, Titan, Wyrm, Tide, Rime)
    [
      { by: "Lysandre", text: "Primordial. The floor of the world. I have written BOTTOM on the map, in capitals, so no one wastes their time." },
      { by: "Lysandre", text: "Final note, Primordial. The ground is warm, as if something below were breathing.* *Impossible. There is no below." },
      { by: "An unknown hand", text: "The map, torn along the fold. On the back, in charcoal: it keeps going." },
      { by: "The Ledger", text: "Titan stratum. A footprint wide enough to hold a village. The village is inside it, and does not know." },
      { by: "Aurelion", text: "Small one, this bone was my grandmother. She remembered a sky before this one. So do I, when I am careless." },
      { by: "Aurelion", text: "Wyrms were not made for your world. We are what was left of the last one, like chairs after a feast." },
      { by: "An unknown hand", text: "Tide stratum. Salt on the rocks, shells in the walls. The sea left and took its shore, and did not say where." },
      { by: "The Ledger", text: "Rime stratum. Under the ice, an empty throne. Beside it, frost in the shape of someone who sat down for a moment." },
    ],
    // Age III: the Hallowed (Hallowed, Oracle, Seraph, Hymn, Eclipse)
    [
      { by: "An unknown hand", text: "Every temple of the Hallowed faces up. Every altar is worn on one side only, where people knelt to look." },
      { by: "Lysandre", text: "A late note, in a less steady hand: I no longer name the strata. They had names before me. I only read the labels." },
      { by: "Oriane", text: "The oracles here say my lines a breath before I do. I let them. It is restful, being answered." },
      { by: "The Ledger", text: "Seraph stratum. A feather as long as a road, folded. Whatever it hid its eyes from is still there." },
      { by: "Oriane", text: "The Hymn has one verse. It goes on after the last singer stops. It is going on now." },
      { by: "An unknown hand", text: "The priests of the Eclipse asked for one more night, then one more. Their prayer has no amen." },
      { by: "The Ledger", text: "In the Eclipse temple, a bell with no tongue. The Ledger records that it rings at dusk anyway." },
      { by: "An unknown hand", text: "Someone answered the Eclipse priests. The answer is cut above the door, worn by a thumb. One word is left: yes." },
    ],
    // Age IV: the Making of the Stars (Nebula, Comet, Zenith, Nadir, Aurora)
    [
      { by: "An unknown hand", text: "Nebula. The sky is not glass yet, only heat. Somewhere, a glassblower is waiting for it to cool." },
      { by: "Eldra", text: "Do not touch the sky while it is warm. It keeps the marks of fingers. Mine are still in it." },
      { by: "The Ledger", text: "Comet stratum. A star that did not break, rolling slowly. Pip was seen beside it. Pip was not surprised." },
      { by: "An unknown hand", text: "At the Zenith everything shines as hard as it can. It is the brightness of things that know how long they have." },
      { by: "Eldra", text: "At the Nadir the sky is thin enough to stand on. I stood there. I had a great deal of thread, and very little time." },
      { by: "Lysandre", text: "Addendum, unasked for: the stars are younger than the kingdom's grandmothers.* *I have stopped footnoting. This one hurt." },
      { by: "The Ledger", text: "Aurora stratum. The light rises, stops at the edge, and goes back down. The Ledger files it as a rehearsal." },
      { by: "Eldra", text: "The edges go pale first. Then the colors. Then the names. I have seen a Dawn. I will not show you." },
    ],
    // Age V: the Loom (Warp, Weft, Shuttle, Knot, Frayed)
    [
      { by: "The Ledger", text: "Warp stratum. Threads from the ground to the sky, taut. Pluck one and a Remnant, somewhere, turns its head." },
      { by: "Eldra", text: "Every thread is one night. I stopped counting at a number that does not have a name yet." },
      { by: "An unknown hand", text: "On the weft, tiny letters, the same three words over and over. Too small to read. Too many to be a mistake." },
      { by: "Eldra", text: "The shuttle goes back and forth, and I call it by a name. It answers. It has your walk." },
      { by: "The Ledger", text: "Knot stratum. Beside the King's thread, a shorter one, snapped clean, as if it had pulled away in the night." },
      { by: "Eldra", text: "He asked me for one more night. I gave him all of them. It was the only size I had." },
      { by: "An unknown hand", text: "Frayed. Light comes through between the threads. It is not warm and it is not cold. It is patient." },
      { by: "Eldra", text: "Hush. Do not pull that loose end. I know it is right there. I know." },
    ],
    // Age VI: the Draft (Sketch, Charcoal, Outline, Erased, Palimpsest)
    [
      { by: "An unknown hand", text: "Sketch stratum. The trees are outlines, the river a single line. Someone meant to come back with color." },
      { by: "Eldra", text: "Before the loom, there was a hand that drew what I would weave. I only followed the lines." },
      { by: "The Ledger", text: "Charcoal stratum. The walker's hands leave smudges. The Ledger notes that they cover older smudges of the same size." },
      { by: "Lysandre", text: "Found: a map of Orvane, drawn before Orvane. My handwriting is on it. I have never been here." },
      { by: "An unknown hand", text: "A second keep, sketched beside the first, left without a door. Its king was never drawn in." },
      { by: "The Ledger", text: "Erased stratum. A shape where something was drawn and taken back. The Remnants walk around it, carefully." },
      { by: "Eldra", text: "The first draft had no night in it. It did not last." },
      { by: "An unknown hand", text: "Palimpsest. Under the lines of this world, the lines of another. Under those, a hand, resting, not yet drawing." },
    ],
    // Age VII: the Words (Rune, Glyph, Verse, Name, Whisper)
    [
      { by: "The Ledger", text: "Rune stratum. Every stone a letter, the road a sentence. The walker is standing on a comma." },
      { by: "Lysandre", text: "I can read it. Let it be noted, for posterity, that I can read it. It is a list of everything. My name is misspelled." },
      { by: "An unknown hand", text: "The glyph for night is two glyphs: one for road, one for again." },
      { by: "Eldra", text: "Before I wove it, it was said. I only took the words and gave them something to hold on to." },
      { by: "The Ledger", text: "Verse stratum. The Remnants speak in rhyme. When a rhyme breaks, the Remnant forgets what it was." },
      { by: "An unknown hand", text: "A word cut and cut again until the stone gave way. The Nameless touched the hole, and walked on." },
      { by: "Eldra", text: "Every walker keeps one word. The altars cannot take it. I have tried to learn which word is yours." },
      { by: "An unknown hand", text: "Put your ear to the road. A voice, very low, is telling the next stretch just before you reach it." },
    ],
    // Age VIII: the Edge of Sleep (Lull, Reverie, Slumber, Drowse, Threshold)
    [
      { by: "The Ledger", text: "Lull stratum. The Remnants move slower. So does the walker. The Ledger writes more slowly, and does not know why." },
      { by: "Eldra", text: "Speak softly here. Everything in this stratum is almost asleep, and has been almost asleep for a very long time." },
      { by: "An unknown hand", text: "The road folds back on itself like a blanket at the foot of a bed. Nobody minds. Nobody minds anything here." },
      { by: "Eldra", text: "The stars close one at a time, like eyes. Not all of them. Never all of them. That is the whole of my work." },
      { by: "The Ledger", text: "Slumber stratum. A breath, very slow, from every direction at once. The Ledger has counted four in one night." },
      { by: "Oriane", text: "I hear nothing here. No old nights, no new ones. Only breathing. It is the most frightening thing I know." },
      { by: "An unknown hand", text: "Drowse. Half the stars shut, half open. Whatever the sky is doing, it is trying very hard not to stop." },
      { by: "Eldra", text: "Morgrath said the word, at the Threshold. I would have told you something gentler. Do not repeat it near the loom." },
    ],
    // Age IX: the Dreamer's Room (Lantern, Hearth, Lullaby, Window, Glass)
    [
      { by: "An unknown hand", text: "Lantern stratum. A lamp, far above the sky, left on. Someone meant to put it out, and did not." },
      { by: "Célestine", text: "The lamp hums. Not like the crystals. Lower. Like someone breathing right beside it." },
      { by: "The Ledger", text: "Hearth stratum. Warmth without a direction. The Remnants turn toward it, the way cats do, and forget to fight." },
      { by: "Célestine", text: "The tune here is mine, only slower. Someone is humming it to someone. I stopped to listen. They did not stop." },
      { by: "An unknown hand", text: "A blanket the size of the Hearthfields, pulled up to the edge of the sky. Under it, the shape of the road." },
      { by: "The Ledger", text: "Window stratum. A pale rectangle in the dark. The King stands before it, his back to you. He does not turn round." },
      { by: "Célestine", text: "The crystals get brighter when it is looking. I think it likes us. I waved. Don't tell Morgrath I waved." },
      { by: "An unknown hand", text: "Glass. On the other side of the sky, a shape, very large, very still. It blinks. So do you. Who was first?" },
    ],
    // Age X: the Unmaking (Hollow, Muffled, Hush, Oblivion, Absence)
    [
      { by: "The Ledger", text: "Hollow stratum. A cup-shaped hollow where a cup was. A wolf-shaped hollow where a wolf was. They left politely." },
      { by: "An unknown hand", text: "Muffled. The sword lands, and the sound arrives later, smaller, as if from the next room." },
      { by: "Oriane", text: "I say a thing and it arrives late. I say it again. The first one arrives. The second one never does." },
      { by: "The Ledger", text: "Hush stratum. Someone has a finger to their lips. The Ledger records the silence, and writes smaller, to help." },
      { by: "An unknown hand", text: "Here, Maëlle's fence post has no notches. It has the grain of a post that was about to have some." },
      { by: "Eldra", text: "If the Morning comes, it will not burn. It will be like this: a soft grey, and no one left to call it grey." },
      { by: "The Ledger", text: "Oblivion stratum. The Ledger finds a page it does not remember writing. The hand is its own. The ink is fading." },
      { by: "An unknown hand", text: "Absence. Where the King should stand, a chair, still warm. On the arm, the print of a hand, and of a crown." },
    ],
    // Age XI: the Blank (Pale, Faint, Margin, Blank, Ink)
    [
      { by: "The Ledger", text: "Pale stratum. The night has worn thin. Behind it, the sky is the color of a glass of milk left by a bed." },
      { by: "An unknown hand", text: "Faint. The Remnants are almost not there. They fight anyway, the way you hum a song you half remember." },
      { by: "Oriane", text: "I cannot hear tomorrow here. There is not enough of it yet." },
      { by: "The Ledger", text: "Margin stratum. The walker has stepped off the edge of the drawing. The Ledger continues the line, out of habit." },
      { by: "An unknown hand", text: "Snow, or paper. Your footprints are the first thing written on it. Look back: they already make a sentence." },
      { by: "Eldra", text: "I never wove this far. There was nothing to hold. You are the first thread out here, and you are not mine." },
      { by: "The Ledger", text: "Blank stratum. No page numbers. The Ledger opens a new one and, for the first time, does not know what to write." },
      { by: "An unknown hand", text: "Ink. A single drop at the tip of something, trembling, about to fall. Everything waits to see where." },
    ],
    // Age XII: the First Mark (Point, Spark, Breath, Gaze, Dawn)
    [
      { by: "An unknown hand", text: "Point. A single point of light, and around it the idea of a road, not drawn yet." },
      { by: "The Ledger", text: "Point stratum. The King is small here, smaller at every stage, as if seen from very far away." },
      { by: "Célestine", text: "The point is warm. It hums one note. It is the first note of every song I know." },
      { by: "An unknown hand", text: "Spark. Something catches, very small. The first warmth of anything is always this: a mistake no one corrects." },
      { by: "Eldra", text: "Before the loom, before the words, before the lines: someone looked, once. That is all I know. I never said it." },
      { by: "The Ledger", text: "Breath stratum. Something breathes in, and holds it. The Ledger holds its own. It has never needed to." },
      { by: "An unknown hand", text: "At the foot of the page, the unknown hand signs at last: one letter, worn by a thumb. The one on the crown." },
      { by: "An unknown hand", text: "The pale line widens. On the other side, something draws breath to speak, and says only: \"Not yet.\"" },
    ],
  ],
  fr: [
    // Âge I : le Royaume
    [
      { by: "Lysandre", text: "Première strate, que je nomme Écho. Les cavernes répètent ce qu'on y dit. Acoustique, rien de plus.* *Vérifié deux fois." },
      { by: "Lysandre", text: "Note : à l'Écho, les chauves-souris sursautent avant le coup. Mauvaise ouïe, sans doute. Ou excellente. À revoir." },
      { by: "Le Grand Livre", text: "Sous la cendre, un poteau de clôture. Des encoches dessus, plus vieilles que l'incendie. L'incendie date de très longtemps." },
      { by: "Lysandre", text: "Cendre : le Bûcher a brûlé le Bois pour rappeler le soleil.* On ne rappelle pas un soleil. *Ils jurent qu'il a répondu. Les zélotes jurent." },
      { by: "Une main inconnue", text: "Sous la note du savant, d'une écriture plus petite : le soleil n'est pas venu. Quelque chose de plus pâle, si." },
      { by: "Lysandre", text: "Néant : un tiers du pays, disparu. Ni brûlé ni noyé. Je l'ai classé comme une absence. Il le prend mal." },
      { by: "Le Grand Livre", text: "Dans la strate du Néant, une route s'arrête en plein pas. Sur la dernière pierre, une empreinte tournée vers l'arrière." },
      { by: "Lysandre", text: "Astral : des étoiles tombées, refroidies en pierre. Dessous, le Primordial, puis rien.* *Mesuré. Deux fois. À l'envers." },
    ],
    // Âge II : le Monde ancien
    [
      { by: "Lysandre", text: "Primordial. Le plancher du monde. J'ai écrit FOND sur la carte, en capitales, pour que personne ne perde son temps." },
      { by: "Lysandre", text: "Dernière note, Primordial. Le sol est tiède, comme si quelque chose respirait dessous.* *Impossible. Il n'y a pas de dessous." },
      { by: "Une main inconnue", text: "La carte, déchirée le long du pli. Au dos, au fusain : ça continue." },
      { by: "Le Grand Livre", text: "Strate du Titan. Une empreinte de pied assez large pour un village. Le village est dedans. Il ne le sait pas." },
      { by: "Aurelion", text: "Petit être, cet os était ma grand-mère. Elle se souvenait d'un ciel d'avant celui-ci. Moi aussi, quand je suis distrait." },
      { by: "Aurelion", text: "Les guivres n'ont pas été faites pour ton monde. Nous sommes les restes du précédent, comme les chaises après un banquet." },
      { by: "Une main inconnue", text: "Strate de la Marée. Du sel sur les rochers, des coquillages dans les murs. La mer est partie avec son rivage, sans adresse." },
      { by: "Le Grand Livre", text: "Strate du Givre. Sous la glace, un trône vide. À côté, du givre en forme de quelqu'un qui s'est assis un instant." },
    ],
    // Âge III : le Sacré
    [
      { by: "Une main inconnue", text: "Tous les temples du Sacré regardent vers le haut. Chaque autel est usé d'un seul côté, là où l'on s'agenouillait pour voir." },
      { by: "Lysandre", text: "Note tardive, d'une main moins sûre : je ne nomme plus les strates. Elles avaient un nom avant moi. Je lis les étiquettes." },
      { by: "Oriane", text: "Les oracles d'ici disent mes phrases un souffle avant moi. Je les laisse faire. C'est reposant, qu'on me réponde." },
      { by: "Le Grand Livre", text: "Strate du Séraphin. Une plume longue comme une route, repliée. Ce qu'elle cachait à ses yeux est toujours là." },
      { by: "Oriane", text: "L'Hymne n'a qu'un couplet. Il continue quand le dernier chanteur se tait. Il continue en ce moment." },
      { by: "Une main inconnue", text: "Les prêtres de l'Éclipse ont demandé une nuit de plus, puis encore une. Leur prière n'a pas d'amen." },
      { by: "Le Grand Livre", text: "Dans le temple de l'Éclipse, une cloche sans battant. Le Grand Livre note qu'elle sonne quand même, au crépuscule." },
      { by: "Une main inconnue", text: "Quelqu'un a répondu aux prêtres de l'Éclipse. La réponse est gravée au linteau, usée par un pouce. Il reste un mot : oui." },
    ],
    // Âge IV : la Naissance des étoiles
    [
      { by: "Une main inconnue", text: "Nébuleuse. Le ciel n'est pas encore du verre, seulement de la chaleur. Quelque part, un souffleur attend qu'il refroidisse." },
      { by: "Eldra", text: "Ne touche pas le ciel tant qu'il est chaud. Il garde la trace des doigts. Les miens y sont encore." },
      { by: "Le Grand Livre", text: "Strate de la Comète. Une étoile intacte roule lentement. Messire Pip était à côté. Messire Pip n'avait pas l'air surpris." },
      { by: "Une main inconnue", text: "Au Zénith, tout brille aussi fort que possible. C'est l'éclat des choses qui savent combien de temps il leur reste." },
      { by: "Eldra", text: "Au Nadir, le ciel est assez mince pour qu'on tienne dessus. J'y étais. J'avais beaucoup de fil et très peu de temps." },
      { by: "Lysandre", text: "Addendum, que nul n'a demandé : les étoiles sont plus jeunes que les grands-mères du royaume.* *J'arrête les notes. Celle-ci fait mal." },
      { by: "Le Grand Livre", text: "Strate de l'Aurore. La lumière monte, s'arrête au bord, redescend. Le Grand Livre l'inscrit comme une répétition." },
      { by: "Eldra", text: "D'abord les bords pâlissent. Puis les couleurs. Puis les noms. J'ai vu une Aube. Je ne te la montrerai pas." },
    ],
    // Âge V : le Métier
    [
      { by: "Le Grand Livre", text: "Strate de la Chaîne. Des fils tendus du sol au ciel. Pinces-en un et, quelque part, un Vestige tourne la tête." },
      { by: "Eldra", text: "Chaque fil est une nuit. J'ai cessé de compter à un nombre qui n'a pas encore de nom." },
      { by: "Une main inconnue", text: "Sur la trame, des lettres minuscules, les trois mêmes mots, sans fin. Trop petits pour être lus. Trop nombreux pour une erreur." },
      { by: "Eldra", text: "La navette va et vient, et je l'appelle par un nom. Elle répond. Elle a ta démarche." },
      { by: "Le Grand Livre", text: "Strate du Nœud. À côté du fil du roi, un fil plus court, cassé net, comme s'il avait tiré pour partir dans la nuit." },
      { by: "Eldra", text: "Il m'a demandé une nuit de plus. Je les lui ai toutes données. Je n'avais que cette taille-là." },
      { by: "Une main inconnue", text: "Effiloché. La lumière passe entre les fils. Elle n'est ni chaude ni froide. Elle est patiente." },
      { by: "Eldra", text: "Chut. Ne tire pas sur ce bout qui dépasse. Je sais qu'il est juste là. Je sais." },
    ],
    // Âge VI : l'Ébauche
    [
      { by: "Une main inconnue", text: "Strate de l'Esquisse. Les arbres sont des contours, la rivière un seul trait. Quelqu'un comptait revenir avec des couleurs." },
      { by: "Eldra", text: "Avant le métier, il y avait une main qui dessinait ce que j'allais tisser. Je n'ai fait que suivre les traits." },
      { by: "Le Grand Livre", text: "Strate du Fusain. Les mains du marcheur laissent des traces. Le Grand Livre note qu'elles couvrent des traces plus vieilles, de même taille." },
      { by: "Lysandre", text: "Trouvé : une carte d'Orvane tracée avant Orvane. Mon écriture est dessus. Je ne suis jamais venu ici." },
      { by: "Une main inconnue", text: "Un second donjon, esquissé à côté du premier, laissé sans porte. Personne n'a jamais dessiné son roi." },
      { by: "Le Grand Livre", text: "Strate du Gommé. Une forme, là où quelque chose a été dessiné puis repris. Les Vestiges la contournent, avec précaution." },
      { by: "Eldra", text: "Le premier jet n'avait pas de nuit. Il n'a pas tenu." },
      { by: "Une main inconnue", text: "Palimpseste. Sous les traits de ce monde, ceux d'un autre. Sous ceux-là, une main posée, qui ne dessine pas encore." },
    ],
    // Âge VII : les Mots
    [
      { by: "Le Grand Livre", text: "Strate des Runes. Chaque pierre est une lettre, la route une phrase. Le marcheur se tient sur une virgule." },
      { by: "Lysandre", text: "Je sais le lire. Je tiens à le noter, pour la postérité : je sais le lire. C'est une liste de tout. Mon nom est mal écrit." },
      { by: "Une main inconnue", text: "Le glyphe de la nuit est fait de deux glyphes : l'un pour la route, l'autre pour encore." },
      { by: "Eldra", text: "Avant que je le tisse, il avait été dit. J'ai seulement pris les mots et je leur ai donné de quoi s'accrocher." },
      { by: "Le Grand Livre", text: "Strate du Vers. Les Vestiges parlent en rimes. Quand une rime casse, le Vestige oublie ce qu'il était." },
      { by: "Une main inconnue", text: "Un mot gravé et regravé jusqu'à percer la pierre. Le Sans-Nom a touché le trou, puis il a repris la route." },
      { by: "Eldra", text: "Chaque marcheur garde un mot. Les autels ne peuvent pas le prendre. J'ai essayé d'apprendre lequel est le tien." },
      { by: "Une main inconnue", text: "Colle l'oreille à la route. Une voix très basse y raconte le prochain tronçon, juste avant que tu l'atteignes." },
    ],
    // Âge VIII : l'Orée du sommeil
    [
      { by: "Le Grand Livre", text: "Strate de l'Accalmie. Les Vestiges ralentissent. Le marcheur aussi. Le Grand Livre écrit plus lentement, sans savoir pourquoi." },
      { by: "Eldra", text: "Parle bas, ici. Tout, dans cette strate, est presque endormi, et depuis très longtemps." },
      { by: "Une main inconnue", text: "La route se replie comme une couverture au pied d'un lit. Personne ne s'en soucie. Personne ne se soucie de rien, ici." },
      { by: "Eldra", text: "Les étoiles se ferment une à une, comme des paupières. Pas toutes. Jamais toutes. C'est tout mon travail." },
      { by: "Le Grand Livre", text: "Strate du Sommeil. Un souffle très lent, venu de partout à la fois. Le Grand Livre en a compté quatre en une nuit." },
      { by: "Oriane", text: "Ici, je n'entends rien. Ni les vieilles nuits, ni les nouvelles. Seulement une respiration. Rien ne m'a jamais fait aussi peur." },
      { by: "Une main inconnue", text: "Somnolence. La moitié des étoiles fermées, l'autre ouverte. Le ciel lutte de toutes ses forces pour garder les yeux ouverts." },
      { by: "Eldra", text: "Morgrath a dit le mot, au Seuil. Je t'aurais dit quelque chose de plus doux. Ne le répète pas près du métier." },
    ],
    // Âge IX : la Chambre
    [
      { by: "Une main inconnue", text: "Strate de la Lanterne. Une lampe, très loin au-dessus du ciel, restée allumée. Quelqu'un voulait l'éteindre, et ne l'a pas fait." },
      { by: "Célestine", text: "La lampe fredonne. Pas comme les cristaux. Plus bas. Comme quelqu'un qui respire juste à côté." },
      { by: "Le Grand Livre", text: "Strate de l'Âtre. Une chaleur sans direction. Les Vestiges se tournent vers elle, comme des chats, et oublient de se battre." },
      { by: "Célestine", text: "Ici, l'air est le mien, en plus lent. Quelqu'un le fredonne à quelqu'un. Je me suis arrêtée pour écouter. Eux, non." },
      { by: "Une main inconnue", text: "Une couverture grande comme les Plaines, remontée jusqu'au bord du ciel. Dessous, la forme de la route." },
      { by: "Le Grand Livre", text: "Strate de la Fenêtre. Un rectangle pâle dans le noir. Le roi se tient devant, de dos. Il ne se retourne pas." },
      { by: "Célestine", text: "Les cristaux brillent plus fort quand ça regarde. Je crois que ça nous aime bien. J'ai fait coucou. Ne le dis pas à Morgrath." },
      { by: "Une main inconnue", text: "Vitre. De l'autre côté du ciel, une forme, immense, immobile. Elle cligne des yeux. Toi aussi. Qui a commencé?" },
    ],
    // Âge X : le Défaire
    [
      { by: "Le Grand Livre", text: "Strate du Creux. Un creux en forme de tasse, là où était une tasse. Un creux en forme de loup. Ils sont partis poliment." },
      { by: "Une main inconnue", text: "Sourdine. L'épée frappe, et le bruit arrive plus tard, plus petit, comme depuis la pièce d'à côté." },
      { by: "Oriane", text: "Je dis une chose et elle arrive en retard. Je la redis. La première arrive. La seconde, jamais." },
      { by: "Le Grand Livre", text: "Strate du Chut. Quelqu'un a posé un doigt sur ses lèvres. Le Grand Livre note le silence, et écrit plus petit, pour aider." },
      { by: "Une main inconnue", text: "Ici, le poteau de Maëlle n'a pas d'encoches. Il a le grain d'un poteau qui allait en avoir." },
      { by: "Eldra", text: "Si le Matin vient, il ne brûlera pas. Ce sera comme ici : un gris très doux, et plus personne pour dire que c'est gris." },
      { by: "Le Grand Livre", text: "Strate de l'Oubli. Le Grand Livre trouve une page qu'il n'a pas le souvenir d'avoir écrite. L'écriture est la sienne. L'encre pâlit." },
      { by: "Une main inconnue", text: "Absence. À la place du roi, un fauteuil encore tiède. Sur l'accoudoir, l'empreinte d'une main, et celle d'une couronne." },
    ],
    // Âge XI : le Vierge
    [
      { by: "Le Grand Livre", text: "Strate du Pâle. La nuit s'est usée. Derrière, le ciel a la couleur d'un verre de lait oublié sur une table de chevet." },
      { by: "Une main inconnue", text: "Ténu. Les Vestiges sont presque absents. Ils se battent quand même, comme on fredonne une chanson à moitié oubliée." },
      { by: "Oriane", text: "Ici, je n'entends pas demain. Il n'y en a pas encore assez." },
      { by: "Le Grand Livre", text: "Strate de la Marge. Le marcheur est sorti du dessin. Le Grand Livre prolonge le trait, par habitude." },
      { by: "Une main inconnue", text: "Neige, ou papier. Tes pas sont la première chose écrite dessus. Retourne-toi : ils font déjà une phrase." },
      { by: "Eldra", text: "Je n'ai jamais tissé aussi loin. Il n'y avait rien où s'accrocher. Tu es le premier fil, ici, et tu n'es pas à moi." },
      { by: "Le Grand Livre", text: "Strate du Vierge. Aucune page numérotée. Le Grand Livre en ouvre une et, pour la première fois, ne sait pas quoi écrire." },
      { by: "Une main inconnue", text: "Encre. Une seule goutte au bout de quelque chose, qui tremble, prête à tomber. Tout attend de voir où." },
    ],
    // Âge XII : la Première Marque
    [
      { by: "Une main inconnue", text: "Point. Un seul point de lumière, et autour, l'idée d'une route, pas encore tracée." },
      { by: "Le Grand Livre", text: "Strate du Point. Le roi est petit, ici, plus petit à chaque étape, comme vu de très loin." },
      { by: "Célestine", text: "Le point est tiède. Il chante une seule note. C'est la première note de toutes les chansons que je connais." },
      { by: "Une main inconnue", text: "Étincelle. Quelque chose prend, tout petit. Toute première chaleur commence ainsi : une erreur que personne ne corrige." },
      { by: "Eldra", text: "Avant le métier, avant les mots, avant les traits : quelqu'un a regardé, une fois. C'est tout ce que je sais. Je ne l'avais jamais dit." },
      { by: "Le Grand Livre", text: "Strate du Souffle. Quelque chose inspire, et retient. Le Grand Livre retient le sien. Il n'en avait jamais eu besoin." },
      { by: "Une main inconnue", text: "Au bas de la page, la main inconnue signe enfin : une seule lettre, usée par un pouce. Celle de la couronne." },
      { by: "Une main inconnue", text: "La ligne pâle s'élargit. De l'autre côté, quelque chose prend son souffle pour parler, et dit seulement : « Pas encore. »" },
    ],
  ],
};
