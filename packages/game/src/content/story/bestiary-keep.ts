import type { Locale } from "../../i18n";
import type { BestiaryText } from "../types";

/**
 * Bestiary of Orvane Keep, the specials and the eleven deeper forms of the King.
 * The Ledger speaks: exact, third person, faintly kind. The King's pages are never jokes.
 * A King form's lines tell the Truth only as far as its depth has reached (BIBLE 16).
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
        "A gargoyle of the keep that counts the nights of the Long Night on its claws. It ran out of claws long ago.",
        "It moved on to its teeth, then to the margin of the Ledger. The margin is full too.",
        "Once a night it turns to the window and says tonight's number aloud. It is always one more than yesterday's."
      ],
      "banner-wraith": [
        "A royal banner of Orvane whose colors faded in the Pale Year. It drifts through the keep, looking for them.",
        "It tried the violet of the fires for a while. It did not suit. Nothing suits it but its own colors.",
        "Kaelen remembers its colors, and could end its search with one word. When it drifts past, he looks away."
      ],
      "fallen-sentinel": [
        "The King's guards, still at their posts. They were Kaelen's brothers-in-arms, and salute him before they attack.",
        "They hold the post they were given on the last evening before the Long Night. Nobody came to relieve them.",
        "One place in their line is always empty: Kaelen's. Every night they close ranks around it, very carefully."
      ],
      "hollow-page": [
        "An empty page boy's livery, still carrying a sealed letter through the keep.",
        "The seal on the letter is the King's. The Ledger has not opened it. Some letters are not its to read.",
        "The letter is addressed to Kaelen. Every night the page stops beside him, then loses its nerve."
      ],
      "last-hound": [
        "The King's hounds, loosed the night the keep fell silent. They are still following a scent.",
        "The scent leads out of the keep, across the Mire and into the forest, then simply stops. They circle it all night.",
        "It is Kaelen's scent. Near him the hounds stop growling, sit, and wait for an order he never gives."
      ],
      "candle-maid": [
        "A servant who lights the great hall every night. Nobody has come to dinner since the Long Night began.",
        "She lays two places: the King's, and one for a guest who is always late. She keeps the soup warm.",
        "She is still on her first wick. The Ledger does not know how, and has decided not to ask."
      ],
      "stone-warden": [
        "A stone statue that guards the door of the great hall. Nobody has used that door in a very long time.",
        "Everyone comes in through the breach in the east wall. The Warden has been told. It prefers the door.",
        "The last to pass its door were the King and Eldra the weaver, carrying her loom, on the night of the Binding."
      ],
      "ruined-king": [
        "Aldemar, last king of Orvane, who falls and rises again every night. His cracked crown still bears an A.",
        "He asked for the Long Night himself, to keep the Morning out of Orvane. He guards that night still.",
        "He was the first walker. After countless nights he sat on his throne to rest a moment, and the crown held him."
      ],
      "court-jester": [
        "The King's jester. He laughs whenever a walker arrives, because every walker comes to kill the King.",
        "The little crowned head on his sceptre has heard all his jokes. It stopped laughing. He has not.",
        "He keeps one joke he never tells, about a king who sat down for a moment. He says it is not funny yet."
      ],
      "seam-warden": [
        "A guardian that holds a crack in the night shut with both hands. Beat it and the crack closes.",
        "It is not holding the crack shut against you, but against what lies on the other side: the Morning.",
        "Its hands are the same glass as the sky, patched in a dozen places. The Stallkeeper did the patching."
      ],
      "walker-echo": [
        "The shadow of another walker from the Roll, fighting their own night. For a moment, your two nights touch.",
        "It fights beside you for a moment, then goes back to its own night. It never looks to see if you follow.",
        "Walkers never meet. The Roll is the one place their nights touch. Sometimes, the Ledger admits, the ink runs."
      ],
      "the-quiet": [
        "Not a Remnant: the hole where one used to be. No color, no sound. It rises from the Void, where Orvane lost a third.",
        "The Ledger tried to write its name. The line stayed blank. The Quiet erases even the words about it.",
        "It is what the Morning leaves: things not killed but forgotten whole. Vorn's Biscuit is a piece of it, tamed."
      ],
      "stray-armor": [
        "An empty suit of armor walking the road the wrong way, back toward dusk.",
        "The Nameless, the knight whose armor is empty too, steps aside to let it pass, and bows.",
        "Scratched inside the helmet: Aldric. Another walker who gave the altars every memory, until only the armor walked."
      ],
      "the-dawn": [
        "A line of pale light across the road, where the King should stand. It does not attack. It only grows.",
        "The Ledger tried to record its length. By the time the number is written, it is wrong.",
        "If it reached the road, the one who holds Orvane in their sleep would wake. Beat it: the road goes on beneath."
      ],
      "titan-king": [
        "The Fallen King as the Elder World remembers him: stone to the shoulders, the crown grown into his skull.",
        "At this depth he is as old as the ground. He no longer remembers being a man. The Ledger remembers for him.",
        "Under the stone, his sword hand is still warm. He was Aldemar, a man, before the crown kept him on the throne."
      ],
      "hallowed-king": [
        "The Fallen King as the priests of the Hallowed saw him: a veiled saint with folded hands. He never asked for it.",
        "He is not praying. The Ledger has listened: he is counting the nights he walked, and losing count.",
        "Under the veil his eyes are open. He watches the road for the walker who will one day sit on the throne after him."
      ],
      "star-crowned": [
        "The Fallen King under a crown of small cold stars, from the stratum where the sky itself was made.",
        "One star is missing from his crown. Garrick carries a shard of exactly the right size, and will not sell it.",
        "The stars were lit to keep him company through the nights. He has never once let them go out."
      ],
      "woven-king": [
        "The Fallen King made of thread, like the Long Night itself. His loose ends run up into the dark, to a loom.",
        "The thread is Eldra's, the weaver who made the Long Night. She spun him too, very carefully.",
        "Where his heart would be, the weave is knotted and redone many times. Eldra mends him, often."
      ],
      "sketched-king": [
        "The Fallen King drawn in charcoal, unshaded, half erased. His sword is only an outline. It still cuts.",
        "Under the erased half is a smaller crown: the king who wore it before him, and walked before him.",
        "His last line stops mid-stroke, as if the hand drawing him had grown tired and put the charcoal down."
      ],
      "king-name": [
        "The Fallen King as a name: the letters of ALDEMAR, standing in the shape of a man.",
        "The Ledger can read each letter, but not all at once. A name this heavy has to be read slowly.",
        "Its first letter is the same as yours: A, for Aldemar and for Aldric. The Ledger stops reading there."
      ],
      "sleeping-king": [
        "The Fallen King, asleep on his throne. He still fights with his eyes closed, like a man walking a road by heart.",
        "He talks in his sleep. The Ledger wrote it down: one word, \"again\".",
        "He dreams of a short night and a harvest brought in. He is inside the same dream as Orvane. The Ledger lets him be."
      ],
      "window-king": [
        "The Fallen King with his back to you, at a bright window. He fights without turning round.",
        "On the glass, beside his reflection, there is room for one more face. He leaves it free.",
        "Through the window he watches the one who dreams Orvane: you. Once, only once, he waved."
      ],
      "hollow-crown": [
        "Only the crown, floating, holding the shape of a head that is no longer under it.",
        "Aldemar has let go of it. The crown floats on at his height, waiting for the next walker who stops.",
        "The ring fits any head. Whoever stops walking for good is the next one it will hold."
      ],
      "blank-king": [
        "The Fallen King, faded almost to the color of the page. The Ledger found him only by his sword's shadow.",
        "He fades from the edges in, as Orvane does. The Ledger writes his entry in its darkest ink, and presses hard.",
        "He still rises when you come, though almost nothing is left of him. It is a matter of manners."
      ],
      aldemar: [
        "Aldemar himself: a tired man in plain clothes, no crown. His sword is lowered, and has been for a while.",
        "Forty years a king, and far longer a walker. The Ledger keeps a second column for his nights. It has no end.",
        "He knows your name. He says it kindly, the way you speak to yourself at the end of a very long night."
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
        "Une gargouille du donjon qui compte les nuits de la Longue Nuit sur ses griffes. Elle n'en a plus depuis longtemps.",
        "Elle est passée aux dents, puis à la marge du Grand Livre. La marge est pleine aussi.",
        "Une fois par nuit, elle se tourne vers la fenêtre et dit à voix haute le compte du soir. Toujours un de plus."
      ],
      "banner-wraith": [
        "Une bannière royale d'Orvane, délavée pendant l'Année pâle. Elle erre dans le donjon, à la recherche de ses couleurs.",
        "Elle a essayé le violet des feux, un temps. Ça ne lui allait pas. Rien ne lui va, que les siennes.",
        "Kaelen se souvient de ses couleurs : un mot de lui, et sa quête finirait. Quand elle passe, il regarde ailleurs."
      ],
      "fallen-sentinel": [
        "Les gardes du roi, toujours à leur poste. Ce sont les frères d'armes de Kaelen : ils le saluent avant d'attaquer.",
        "Ils tiennent le poste reçu le dernier soir avant la Longue Nuit. Personne n'est venu les relever.",
        "Une place reste toujours vide dans leur rang : celle de Kaelen. Chaque nuit, ils se resserrent autour, avec soin."
      ],
      "hollow-page": [
        "Une livrée de page, vide, qui porte toujours une lettre scellée à travers le donjon.",
        "Le sceau de la lettre est celui du roi. Le Grand Livre ne l'a pas ouverte : ce courrier n'est pas pour lui.",
        "La lettre est adressée à Kaelen. Chaque nuit, le page s'arrête près de lui, puis perd courage."
      ],
      "last-hound": [
        "Les chiens du roi, lâchés la nuit où le donjon s'est tu. Ils suivent toujours une piste.",
        "La piste sort du donjon, traverse le marais, entre dans le Bois, puis s'arrête net. Ils tournent autour toute la nuit.",
        "C'est l'odeur de Kaelen. Près de lui, ils cessent de gronder, s'assoient, et attendent un ordre qui ne vient pas."
      ],
      "candle-maid": [
        "Une servante qui allume la grande salle chaque nuit. Personne n'est venu dîner depuis le début de la Longue Nuit.",
        "Elle dresse deux couverts : celui du roi, et celui d'un invité toujours en retard. La soupe reste au chaud.",
        "Elle en est toujours à sa première mèche. Le Grand Livre ignore comment, et a choisi de ne pas demander."
      ],
      "stone-warden": [
        "Une statue de pierre qui garde la porte de la grande salle. Personne n'a franchi cette porte depuis très longtemps.",
        "Tout le monde entre par la brèche du mur est. On l'a prévenu. Il préfère la porte.",
        "Les derniers à passer sa porte : le roi, et Eldra la tisseuse avec son métier, la nuit où fut tissée la Longue Nuit."
      ],
      "ruined-king": [
        "Aldemar, dernier roi d'Orvane, qui tombe et se relève chaque nuit. Sa couronne fêlée porte encore un A.",
        "Il a demandé lui-même la Longue Nuit, pour tenir le Matin hors d'Orvane. Il garde encore cette nuit.",
        "Il fut le premier marcheur. Après des nuits sans nombre, il s'est assis un instant, et la couronne l'a retenu."
      ],
      "court-jester": [
        "Le bouffon du roi. Il rit chaque fois qu'un marcheur arrive : tous viennent tuer le roi.",
        "La petite tête couronnée de sa marotte connaît toutes ses blagues. Elle ne rit plus. Lui, si.",
        "Il garde une blague qu'il ne raconte jamais, sur un roi qui s'est assis un instant. Elle n'est pas encore drôle, dit-il."
      ],
      "seam-warden": [
        "Un gardien qui tient une fissure de la nuit fermée, à deux mains. Bats-le, et la fissure se referme.",
        "Ce n'est pas contre toi qu'il la tient fermée, mais contre ce qui attend de l'autre côté : le Matin.",
        "Ses mains sont du même verre que le ciel, rapiécées en dix endroits. C'est le Comptoir qui a posé les pièces."
      ],
      "walker-echo": [
        "L'ombre d'un autre marcheur du Registre, qui mène sa propre nuit. Un instant, vos deux nuits se touchent.",
        "Il se bat à tes côtés un instant, puis retourne à sa nuit. Il ne se retourne jamais pour voir si tu suis.",
        "Les marcheurs ne se croisent pas. Le Registre est le seul lieu où leurs nuits se touchent. Parfois, l'encre bave."
      ],
      "the-quiet": [
        "Pas un Vestige : la place vide d'un Vestige, sans couleur ni son. Il vient du Néant, où un tiers d'Orvane a disparu.",
        "Le Grand Livre a voulu écrire son nom. La ligne est restée blanche. Le Silence efface même les mots sur lui.",
        "C'est ce que laisse le Matin : des choses non pas tuées, mais oubliées en entier. Biscuit, chez Vorn, en est un morceau."
      ],
      "stray-armor": [
        "Une armure vide qui suit la route à l'envers, vers le crépuscule.",
        "Le Sans-Nom, le chevalier à l'armure vide lui aussi, s'écarte pour la laisser passer, et s'incline.",
        "Gravé dans le casque : Aldric. Un marcheur de plus qui a tout donné aux autels, jusqu'à ce que seule l'armure marche."
      ],
      "the-dawn": [
        "Une ligne de lumière pâle en travers de la route, là où devrait se tenir le Roi. Elle n'attaque pas. Elle grandit.",
        "Le Grand Livre a voulu noter sa longueur. Le temps d'écrire le nombre, il est déjà faux.",
        "Si elle touchait la route, celui qui porte Orvane dans son sommeil s'éveillerait. Bats-la : la route continue dessous."
      ],
      "titan-king": [
        "Le roi déchu tel que s'en souvient le Monde ancien : de pierre jusqu'aux épaules, la couronne soudée au crâne.",
        "À cette profondeur, il est aussi vieux que le sol. Il ne se souvient plus d'avoir été un homme. Le Grand Livre, si.",
        "Sous la pierre, sa main d'épée est encore tiède. Il était Aldemar, un homme, avant que la couronne le garde."
      ],
      "hallowed-king": [
        "Le roi déchu tel que le voyaient les prêtres du Sacré : un saint voilé aux mains jointes. Il n'a rien demandé.",
        "Il ne prie pas. Le Grand Livre a écouté : il compte les nuits qu'il a marché, et perd le compte.",
        "Sous le voile, ses yeux sont ouverts. Il guette sur la route le marcheur qui s'assiéra un jour après lui."
      ],
      "star-crowned": [
        "Le roi déchu sous une couronne de petites étoiles froides, venu de la strate où l'on a fait le ciel.",
        "Il manque une étoile à sa couronne. Garrick a un éclat exactement de la bonne taille, et refuse de le vendre.",
        "On a allumé ces étoiles pour lui tenir compagnie au fil des nuits. Il n'en a jamais laissé une s'éteindre."
      ],
      "woven-king": [
        "Le roi déchu fait de fil, comme la Longue Nuit. Ses bouts libres montent dans le noir, jusqu'à un métier.",
        "Le fil est celui d'Eldra, la tisseuse qui a fait la Longue Nuit. Elle l'a filé lui aussi, avec grand soin.",
        "À l'endroit du cœur, la trame est nouée et reprise maintes fois. Eldra le raccommode, souvent."
      ],
      "sketched-king": [
        "Le roi déchu dessiné au fusain, sans ombre, à moitié gommé. L'épée n'est qu'un contour. Elle coupe quand même.",
        "Sous la moitié gommée, une couronne plus petite : celle du roi d'avant, qui a marché avant lui.",
        "Son dernier trait s'arrête en plein geste, comme si la main qui le dessinait, fatiguée, avait posé le fusain."
      ],
      "king-name": [
        "Le roi déchu devenu un nom : les lettres d'ALDEMAR, debout en forme d'homme.",
        "Le Grand Livre sait lire chaque lettre, pas toutes à la fois. Un nom aussi lourd se lit lentement.",
        "Sa première lettre est la même que la tienne : A, pour Aldemar et pour Aldric. Le Grand Livre s'arrête là."
      ],
      "sleeping-king": [
        "Le roi déchu, endormi sur son trône. Il se bat les yeux fermés, comme on suit une route qu'on connaît par cœur.",
        "Il parle en dormant. Le Grand Livre a noté un seul mot : « encore ».",
        "Il rêve d'une nuit courte et de blés rentrés. Il est dans le même rêve qu'Orvane. Le Grand Livre le laisse dormir."
      ],
      "window-king": [
        "Le roi déchu, dos tourné, devant une fenêtre claire. Il se bat sans se retourner.",
        "Sur la vitre, à côté de son reflet, il y a la place pour un autre visage. Il la laisse libre.",
        "Par la fenêtre, il regarde celui qui rêve Orvane : toi. Une fois, une seule, il t'a fait signe."
      ],
      "hollow-crown": [
        "Rien que la couronne, qui flotte et garde la forme d'une tête qui n'est plus dessous.",
        "Aldemar l'a lâchée. Elle flotte encore à sa hauteur, en attendant le prochain marcheur qui s'arrêtera.",
        "L'anneau va à n'importe quelle tête. Celui qui cessera de marcher pour de bon sera le prochain qu'elle gardera."
      ],
      "blank-king": [
        "Le roi déchu, presque de la couleur de la page. Le Grand Livre ne l'a trouvé qu'à l'ombre de son épée.",
        "Il s'efface depuis les bords, comme Orvane. Le Grand Livre écrit son entrée à l'encre la plus noire, et appuie fort.",
        "Il se lève encore quand tu arrives, alors qu'il ne reste presque rien de lui. Question de politesse."
      ],
      aldemar: [
        "Aldemar lui-même : un homme fatigué, en habits simples, sans couronne. Son épée est baissée, depuis un moment.",
        "Quarante ans roi, et bien plus longtemps marcheur. Le Grand Livre tient une seconde colonne pour ses nuits. Sans fin.",
        "Il connaît ton nom. Il le dit avec douceur, comme on se parle à soi-même au bout d'une très longue nuit."
      ]
    }
  }
};
