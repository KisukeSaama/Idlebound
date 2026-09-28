import type { Locale } from "../../i18n";
import type { BestiaryText } from "../types";

/**
 * Bestiary of Orvane Keep, the specials and the eleven deeper forms of the King.
 * The Ledger speaks: exact, third person, faintly kind. The King's pages are never jokes.
 */
export const BESTIARY_KEEP_TEXT: Record<Locale, Pick<BestiaryText, "monsters" | "lines">> = {
  en: {
    monsters: {
      "hollow-page": "Hollow Page",
      "last-hound": "Hound of the Last Hunt",
      "candle-maid": "Candle Maid",
      "court-jester": "The Court Jester",
      "seam-warden": "Seam Warden",
      "walker-echo": "Echo of a Walker",
      "the-quiet": "The Quiet",
      "stray-armor": "Stray Armor",
      "the-dawn": "The Dawn",
      "titan-king": "The Titan King",
      "hallowed-king": "The Hallowed King",
      "star-crowned": "The Star-Crowned",
      "woven-king": "The Woven King",
      "sketched-king": "The Sketched King",
      "king-name": "The King's Name",
      "sleeping-king": "The Sleeping King",
      "window-king": "The King at the Window",
      "hollow-crown": "The Hollow Crown",
      "blank-king": "The Blank King",
      aldemar: "Aldemar"
    },
    lines: {
      "hour-gargoyle": [
        "It counts the nights on its own claws. It ran out of claws.",
        "It has moved on to its teeth. The Ledger lent it a margin, which it has also filled.",
        "Once a night it turns toward the window and says a number. It is always one higher."
      ],
      "banner-wraith": [
        "A royal banner that forgot its colors and is looking for them.",
        "It tried the violet of the fires for a while. It did not suit. Nothing suits it but its own.",
        "Kaelen could name its colors. When it drifts past, he looks somewhere else."
      ],
      "fallen-sentinel": [
        "Kaelen's brothers-in-arms. They salute him before they attack.",
        "They hold the post they were given on the last evening. Nobody came to relieve them.",
        "One place in their line is always empty. Every night they close ranks around it, very carefully."
      ],
      "hollow-page": [
        "A page boy's livery with no page boy. Still carrying a message.",
        "The seal on the letter is the King's. The Ledger has not opened it. Some pages are not its to read.",
        "It is looking for a knight. Every night it stops beside Kaelen, then decides it was wrong."
      ],
      "last-hound": [
        "The King's hounds were loosed on the night of the Binding. They are still following the scent.",
        "The scent leads out of the keep, across the Mire, into the forest. Then it simply stops.",
        "Near Kaelen they stop snarling. They sit, look up at him, and wait for an order he never gives."
      ],
      "candle-maid": [
        "She lights the great hall every night. Nobody has come to dinner in a very long time.",
        "She lays two places: the King's, and one for a guest who is always late. She keeps the soup warm.",
        "She is still on her first wick. The Ledger does not know how, and has decided not to ask."
      ],
      "stone-warden": [
        "Guards the great hall's door. Nobody has used the door in a very long time.",
        "Everyone comes in through the breach in the east wall. The Warden has been told. It prefers the door.",
        "The last to pass the door were a king and a woman carrying a loom. It has let no one through since."
      ],
      "ruined-king": [
        "His crown is cracked. On the rim, worn almost smooth, a single letter: A.",
        "His throne faces the window, not the door. He does not watch who comes in. He already knows.",
        "The Ledger has every night he walked. None for the night he sat down. It was meant to be a moment."
      ],
      "court-jester": [
        "Laughs every time you arrive, as if he knew you would. He did.",
        "The little crowned head on his sceptre has heard all his jokes. It stopped laughing. He has not.",
        "He keeps one joke he never tells. He says it is about a king, and that it is not funny yet."
      ],
      "seam-warden": [
        "Holds a crack in the night shut with both hands. Beat it and the crack closes.",
        "It is not holding the crack shut against you. It is holding it shut against the other side.",
        "Its hands are the same glass as the sky, mended in a dozen places. The Stallkeeper knows the patches."
      ],
      "walker-echo": [
        "Another walker's shadow, from another night. Shown with a name from the Roll.",
        "It fights beside you for a moment, then goes back to its own night. It never looks to see if you follow.",
        "Walkers never meet. The Roll is the one place their strands touch. Sometimes, the Ledger admits, the ink runs."
      ],
      "the-quiet": [
        "Colorless. Soundless. It is not a Remnant. It is where one used to be.",
        "The Ledger tried to write its name. The line stayed blank. The ink was there. The name was not.",
        "It rises from the stratum where a third of the land went missing. Something came close there, once."
      ],
      "stray-armor": [
        "An empty suit of plate walking the road in the wrong direction.",
        "It walks back toward dusk. The Nameless steps aside to let it pass, and bows.",
        "Scratched inside the helmet, a name worn too thin to read. The Ledger has a guess. It keeps it."
      ],
      "the-dawn": [
        "A line of pale light. It does not attack. It only grows.",
        "The Ledger has tried to record its length. By the time the number is written, it is wrong.",
        "Near it, the Ledger's ink dries pale. The page is warm, and the Ledger does not know why."
      ],
      "titan-king": [
        "Stone to the shoulders. The crown has grown into the bone, the way a root grows round a nail.",
        "At this depth he is as old as the ground. He does not remember being anything else. The Ledger does.",
        "Under the stone, where his hand holds the sword, the skin is still warm. The Ledger checked twice."
      ],
      "hallowed-king": [
        "Haloed, veiled, hands folded. The priests of this stratum made him a saint. He did not ask.",
        "He is not praying. The Ledger has listened. He is counting nights, very quietly, and losing count.",
        "Under the veil his eyes are open. He is watching the road for whoever comes next."
      ],
      "star-crowned": [
        "His crown is a ring of small, cold stars. They were lit to keep someone company.",
        "One star is missing from the ring. Garrick carries a shard of exactly the right size.",
        "He holds very still under them, the way you hold still when someone has fallen asleep on your shoulder."
      ],
      "woven-king": [
        "Made of thread. The loose ends run up into the dark, as if someone were still holding them.",
        "The thread is very fine and very tired. The Ledger knows the hand that spun it, and will not name it.",
        "Where his heart would be, the weave is doubled, knotted, redone. Someone mended him. Often."
      ],
      "sketched-king": [
        "Drawn in charcoal, unshaded, half erased. The sword is only an outline. It still cuts.",
        "The erased half is still there if you tilt your head: a second crown, smaller, drawn under his.",
        "His last line stops mid-stroke, as if the hand drawing him had to sit down for a moment."
      ],
      "king-name": [
        "The letters of a name, standing in the shape of a man. They hold together out of habit.",
        "The Ledger can read each letter. Not all of them at once. Some names are too heavy to lift together.",
        "The first three letters are the same as yours. The Ledger stops reading there, every time."
      ],
      "sleeping-king": [
        "Asleep on his throne. He still fights, eyes closed, the way you walk a road you know by heart.",
        "His lips move in his sleep. The Ledger has written it down: one word, \"again\".",
        "In his dream the night is short and the fields are cut. The Ledger does not wake him."
      ],
      "window-king": [
        "Turned away from you, at a bright window. He fights without looking round.",
        "On the glass, beside his own reflection, there is room for one more. He leaves it free.",
        "Once, only once, he raised a hand to the glass. The Ledger recorded a greeting. It may have been a goodbye."
      ],
      "hollow-crown": [
        "Only the crown, holding the shape of a head that is no longer under it.",
        "It floats at exactly his height. Nobody told it he left, or it has chosen not to hear.",
        "Inside the ring the air is warm and shaped like a head. The Ledger notes it is the size of anyone's."
      ],
      "blank-king": [
        "Almost the color of the page. The Ledger found him only by the shadow of his sword.",
        "He is fading from the edges in. The Ledger writes his entry in its darkest ink, and presses hard.",
        "He still rises when you come, though almost nothing is left to rise. It is a matter of manners."
      ],
      aldemar: [
        "A tired man in plain clothes. No crown. His sword is lowered, and has been for a while.",
        "Forty years a king. The Ledger keeps another column for him, much longer, with no heading.",
        "He knows your name. He says it the way you say your own, alone, when you are very tired."
      ]
    }
  },
  fr: {
    monsters: {
      "hollow-page": "Page creux",
      "last-hound": "Limier de la dernière chasse",
      "candle-maid": "Servante aux chandelles",
      "court-jester": "Le Bouffon de la cour",
      "seam-warden": "Gardien de la brèche",
      "walker-echo": "Écho d'un marcheur",
      "the-quiet": "Le Silence",
      "stray-armor": "L'Armure errante",
      "the-dawn": "L'Aube",
      "titan-king": "Le Roi-Titan",
      "hallowed-king": "Le Roi consacré",
      "star-crowned": "Le Couronné d'étoiles",
      "woven-king": "Le Roi tissé",
      "sketched-king": "Le Roi esquissé",
      "king-name": "Le Nom du roi",
      "sleeping-king": "Le Roi endormi",
      "window-king": "Le Roi à la fenêtre",
      "hollow-crown": "La Couronne creuse",
      "blank-king": "Le Roi blanc",
      aldemar: "Aldemar"
    },
    lines: {
      "hour-gargoyle": [
        "Elle compte les nuits sur ses griffes. Elle n'a plus de griffes.",
        "Elle est passée aux dents. Le Grand Livre lui a prêté une marge, qu'elle a remplie aussi.",
        "Une fois par nuit, elle se tourne vers la fenêtre et dit un nombre. Toujours un de plus."
      ],
      "banner-wraith": [
        "Une bannière royale qui a oublié ses couleurs et les cherche.",
        "Elle a essayé le violet des feux, un temps. Ça ne lui allait pas. Rien ne lui va, que les siennes.",
        "Kaelen pourrait lui dire ses couleurs. Quand elle passe, il regarde ailleurs."
      ],
      "fallen-sentinel": [
        "Les frères d'armes de Kaelen. Ils le saluent avant d'attaquer.",
        "Ils tiennent le poste qu'on leur a confié le dernier soir. Personne n'est venu les relever.",
        "Une place reste toujours vide dans leur rang. Chaque nuit, ils se resserrent autour, avec soin."
      ],
      "hollow-page": [
        "Une livrée de page, sans page dedans. Il porte toujours un message.",
        "Le sceau de la lettre est celui du roi. Le Grand Livre ne l'a pas ouverte : ce courrier n'est pas pour lui.",
        "Il cherche un chevalier. Chaque nuit, il s'arrête près de Kaelen, puis décide qu'il s'est trompé."
      ],
      "last-hound": [
        "Les chiens du roi ont été lâchés la nuit où l'on a noué la nuit. Ils suivent toujours la piste.",
        "La piste sort du donjon, traverse le marais, entre dans le Bois. Puis elle s'arrête, tout simplement.",
        "Près de Kaelen, ils cessent de gronder. Ils s'assoient, le regardent, et attendent un ordre qui ne vient pas."
      ],
      "candle-maid": [
        "Elle allume la grande salle chaque nuit. Personne n'est venu dîner depuis très longtemps.",
        "Elle dresse deux couverts : celui du roi, et celui d'un invité toujours en retard. La soupe reste au chaud.",
        "Elle en est toujours à sa première mèche. Le Grand Livre ignore comment, et a choisi de ne pas demander."
      ],
      "stone-warden": [
        "Il garde la porte de la grande salle. Personne ne l'a franchie depuis très longtemps.",
        "Tout le monde entre par la brèche du mur est. On l'a prévenu. Il préfère la porte.",
        "Les derniers à passer la porte : un roi, et une femme qui portait un métier à tisser. Depuis, personne."
      ],
      "ruined-king": [
        "Sa couronne est fêlée. Sur le bord, presque effacée, une seule lettre : A.",
        "Son trône fait face à la fenêtre, pas à la porte. Il ne regarde pas qui entre. Il le sait déjà.",
        "Le Grand Livre a toutes les nuits qu'il a marché. Aucune pour celle où il s'est assis. Ce devait être un instant."
      ],
      "court-jester": [
        "Il rit chaque fois que tu arrives, comme s'il savait que tu viendrais. Il savait.",
        "La petite tête couronnée de sa marotte connaît toutes ses blagues. Elle ne rit plus. Lui, si.",
        "Il garde une blague qu'il ne raconte jamais. Il dit qu'elle parle d'un roi, et qu'elle n'est pas encore drôle."
      ],
      "seam-warden": [
        "Il tient une fissure de la nuit fermée, à deux mains. Bats-le, et la fissure se referme.",
        "Ce n'est pas contre toi qu'il la tient fermée. C'est contre ce qui se trouve de l'autre côté.",
        "Ses mains sont du même verre que le ciel, reprisées en dix endroits. Le Comptoir reconnaît ses pièces."
      ],
      "walker-echo": [
        "L'ombre d'un autre marcheur, venue d'une autre nuit. Elle porte un nom du Registre.",
        "Il se bat à tes côtés un instant, puis retourne à sa nuit. Il ne se retourne jamais pour voir si tu suis.",
        "Les marcheurs ne se croisent pas. Le Registre est le seul lieu où leurs fils se touchent. Parfois, l'encre bave."
      ],
      "the-quiet": [
        "Sans couleur. Sans bruit. Ce n'est pas un Vestige. C'est l'endroit où il y en avait un.",
        "Le Grand Livre a voulu écrire son nom. La ligne est restée blanche. L'encre était là. Le nom, non.",
        "Il remonte de la strate où un tiers du pays a disparu. Quelque chose s'est approché, là-bas, une fois."
      ],
      "stray-armor": [
        "Une armure vide qui suit la route dans le mauvais sens.",
        "Elle repart vers le crépuscule. Le Sans-Nom s'écarte pour la laisser passer, et s'incline.",
        "Gravé dans le casque, un nom trop usé pour être lu. Le Grand Livre a une idée. Il la garde pour lui."
      ],
      "the-dawn": [
        "Une ligne de lumière pâle. Elle n'attaque pas. Elle grandit, c'est tout.",
        "Le Grand Livre a voulu noter sa longueur. Le temps d'écrire le nombre, il est déjà faux.",
        "Près d'elle, l'encre du Grand Livre sèche pâle. La page est tiède, et il ne sait pas pourquoi."
      ],
      "titan-king": [
        "De pierre jusqu'aux épaules. La couronne a poussé dans l'os, comme une racine autour d'un clou.",
        "À cette profondeur, il est aussi vieux que le sol. Il ne se souvient pas d'autre chose. Le Grand Livre, si.",
        "Sous la pierre, là où sa main tient l'épée, la peau est encore tiède. Le Grand Livre a vérifié deux fois."
      ],
      "hallowed-king": [
        "Nimbé, voilé, les mains jointes. Les prêtres de cette strate en ont fait un saint. Il n'a rien demandé.",
        "Il ne prie pas. Le Grand Livre a écouté : il compte les nuits, tout bas, et perd le compte.",
        "Sous le voile, ses yeux sont ouverts. Il guette sur la route celui qui viendra ensuite."
      ],
      "star-crowned": [
        "Sa couronne est un anneau de petites étoiles froides. On les a allumées pour tenir compagnie à quelqu'un.",
        "Il manque une étoile à l'anneau. Garrick a dans son sac un éclat qui a exactement la bonne taille.",
        "Il se tient très immobile sous elles, comme quand quelqu'un s'est endormi sur ton épaule."
      ],
      "woven-king": [
        "Fait de fil. Les bouts libres montent dans le noir, comme si quelqu'un les tenait encore.",
        "Le fil est très fin et très las. Le Grand Livre connaît la main qui l'a filé, et ne la nommera pas.",
        "À l'endroit du cœur, la trame est doublée, nouée, reprise. Quelqu'un l'a raccommodé. Souvent."
      ],
      "sketched-king": [
        "Dessiné au fusain, sans ombre, à moitié gommé. L'épée n'est qu'un contour. Elle coupe quand même.",
        "La moitié gommée est encore là, si on penche la tête : une seconde couronne, plus petite, sous la sienne.",
        "Son dernier trait s'arrête en plein geste, comme si la main qui le traçait avait dû s'asseoir un instant."
      ],
      "king-name": [
        "Les lettres d'un nom, debout en forme d'homme. Elles tiennent ensemble par habitude.",
        "Le Grand Livre sait lire chaque lettre. Pas toutes à la fois : certains noms sont trop lourds d'un seul bloc.",
        "Les trois premières lettres sont les mêmes que les tiennes. Le Grand Livre s'arrête là, chaque fois."
      ],
      "sleeping-king": [
        "Endormi sur son trône. Il se bat encore, les yeux fermés, comme on suit une route qu'on connaît par cœur.",
        "Ses lèvres bougent dans son sommeil. Le Grand Livre a noté un seul mot : « encore ».",
        "Dans son rêve, la nuit est courte et les blés sont fauchés. Le Grand Livre ne le réveille pas."
      ],
      "window-king": [
        "Dos tourné, devant une fenêtre claire. Il se bat sans se retourner.",
        "Sur la vitre, à côté de son reflet, il y a la place pour un autre. Il la laisse libre.",
        "Une fois, une seule, il a levé la main vers la vitre. Le Grand Livre a noté un salut. C'était peut-être un adieu."
      ],
      "hollow-crown": [
        "Rien que la couronne, qui garde la forme d'une tête qui n'est plus dessous.",
        "Elle flotte exactement à sa hauteur. On ne lui a pas dit qu'il était parti, ou elle a choisi de ne pas entendre.",
        "Dans l'anneau, l'air est tiède et a la forme d'une tête. Le Grand Livre note qu'elle est à la taille de n'importe qui."
      ],
      "blank-king": [
        "Presque de la couleur de la page. Le Grand Livre ne l'a trouvé qu'à l'ombre de son épée.",
        "Il s'efface depuis les bords. Le Grand Livre écrit son entrée à l'encre la plus noire, et appuie fort.",
        "Il se lève encore quand tu arrives, alors qu'il ne reste presque rien pour se lever. Question de politesse."
      ],
      aldemar: [
        "Un homme fatigué, en habits simples. Pas de couronne. Son épée est baissée, et depuis un moment.",
        "Quarante ans roi. Le Grand Livre tient pour lui une autre colonne, bien plus longue, sans titre.",
        "Il connaît ton nom. Il le dit comme on dit le sien, seul, quand on est très fatigué."
      ]
    }
  }
};
