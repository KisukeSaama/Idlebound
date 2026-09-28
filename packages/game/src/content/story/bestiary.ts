import type { Locale } from "../../i18n";
import type { BestiaryText } from "../types";

/**
 * The Ledger's pages for the Wychwood, the Deepvaults and the Mire of Osric (BIBLE 8.2 to
 * 8.4, 12.3): the names of the new Remnants, three lines per creature, and the page names.
 */
export const BESTIARY_TEXT: Record<Locale, BestiaryText> = {
  en: {
    monsters: {
      "mourning-owl": "Mourning Owl",
      "toadstool-choir": "Toadstool Choir",
      "whisper-bramble": "Whispering Bramble",
      "weeping-stag": "The Weeping Stag",
      "drip-leech": "Drip Leech",
      "rune-cart": "Haunted Cart",
      "hollow-canary": "Hollow Canary",
      "singing-geode": "The Singing Geode",
      "drowned-courtier": "Drowned Courtier",
      "peat-cutter": "Peat Cutter",
      "mire-heron": "Mire Heron",
      ferryman: "The Ferryman"
    },
    lines: {
      "shade-wolf": [
        "A wolf made of the dark between two trees.",
        "It never crosses a clearing. The Ledger has watched it go the long way round, every time.",
        "Ysolde's trees lend it their shadows. She asked them to stop. They say it asked first."
      ],
      "briar-witch": [
        "A druid who stayed in the forest too long and became part of its hedge.",
        "She still hums the Grove's lessons. She gets the third verse wrong, the same way, every night.",
        "Séraphine knew her name. She walks past without looking, and leaves a little water at her roots."
      ],
      "grove-spinner": [
        "It spins the thorns where walkers bled. It has never run out of thread.",
        "Its web holds scraps of cloak. The newest scrap is the color of yours.",
        "It ties every thread with the same knot. Eldra ties hers that way. She says it is a common knot. It is not."
      ],
      "mourning-owl": [
        "It asks one question, over and over. The answer is always a name.",
        "It asks each walker once, then waits. The Ledger notes it has never been given the right name.",
        "It went into mourning the night the forest heard the keep go quiet. Nobody told it for whom."
      ],
      "toadstool-choir": [
        "Seven mushrooms, one song, entirely out of tune.",
        "The tallest, the one with the torn cap, is the only one in tune. The other six resent it.",
        "Célestine hums along when she walks past. For one bar, all seven are in tune."
      ],
      "whisper-bramble": [
        "It whispers the names of the walkers who bled on it. Yours is new.",
        "It whispers them in order. The Ledger has compared them with the Roll. The bramble's list is longer.",
        "The oldest name it knows, deeper than its roots, is the same as yours. It had not noticed until now."
      ],
      "root-knight": [
        "A soldier buried under an oak. The oak got up.",
        "It still salutes at dusk. The oak does not know why its arm does that, and has stopped asking.",
        "Kaelen knew the soldier. He says the oak fights better than the man did, and the man would be glad."
      ],
      "old-grove": [
        "The mother-tree. When she falls, the whole forest exhales.",
        "She lowers her branches a moment before the last blow. The Ledger records a defeat. It is not sure.",
        "Séraphine stays behind when she falls. The Ledger does not record what they say. It was asked not to."
      ],
      "weeping-stag": [
        "Its tears are sap. Its antlers hold a nest of stars.",
        "The stars in its antlers are pieces of the sky. It carries them gently, as if they could still hatch.",
        "Each night, one more star in the nest. The Ledger has counted. The sky has one fewer."
      ],
      "blind-crawler": [
        "It has no eyes because nothing down here was ever meant to be seen.",
        "It turns its head toward the walker anyway. The Ledger cannot say what it follows. Not the light.",
        "Once it stopped and faced upward, toward the surface, for a long time. Something up there was looking."
      ],
      "echo-bat": [
        "It screeches a moment before you swing.",
        "Lately it screeches a moment before you decide to swing. The Ledger has stopped finding this funny.",
        "Oriane keeps one at home. It screeches before she speaks, so she never has to finish a sentence."
      ],
      "crystal-mite": [
        "Eats sky-glass. Excretes smaller sky-glass.",
        "The Stallkeeper buys its droppings by weight. Nobody asks where the shards came from. That is policy.",
        "Its droppings fit together. Garrick tried, one slow night. They made a hand's width of sky, uncracked."
      ],
      "drip-leech": [
        "Hangs from the ceiling and drinks whatever falls. Mostly time.",
        "It has drunk so much time it dies a moment late. The Ledger writes it down a moment early, to be fair.",
        "Its stalactite never grows: it drank every drop that would have. The cave is younger for it."
      ],
      "rune-cart": [
        "It still runs the line to the surface. The line ends in rock now.",
        "It stops at every old station and waits exactly as long as the timetable says. Nobody gets on.",
        "Its last load was shards for the keep, sent on the eve of the Long Night. It is still trying to deliver."
      ],
      "hollow-canary": [
        "The miners' canary. It stopped singing the day the air went bad. It sings now, for nobody.",
        "It sings a warning. The Ledger has listened closely: the warning is not about the air.",
        "It sings louder in the deeper strata. Whatever is coming, it smelled it first."
      ],
      "miner-shade": [
        "Still swinging a pick. Still on shift.",
        "It clocks out at dawn. The Ledger has kept its time card open longer than the mine existed.",
        "Garrick shares his lunch with it, off the books. It always leaves him the crust, as his father did."
      ],
      "stone-devourer": [
        "It dug for the fallen sky and found it. It could not digest it.",
        "Its belly glows faintly as it dies. The Ledger has measured: the glow is the shape of a crack in the sky.",
        "Garrick says it dug for the same reason he does. He also says it is the only one of them who struck it rich."
      ],
      "singing-geode": [
        "A stone that hums Célestine's name before she is hired.",
        "The tune changes when someone looks at it. The Ledger has found no way to check this without looking.",
        "Célestine keeps a shard of one in her pocket. She says it hums a name too. She will not say whose."
      ],
      "bog-remnant": [
        "The marsh remembering a person. It got most of the parts.",
        "The parts it gets wrong are always the hands. The marsh never looked at anyone's hands.",
        "Mirelle once found her own earring on one. She took it back. The next night it was wearing it again."
      ],
      "rot-toad": [
        "It croaks in the Baron's voice. Mirelle hates it most.",
        "Always the same three words. The Ledger has transcribed them. It will not print them without Mirelle's leave.",
        "Mirelle has never killed one. When it croaks, she answers, very quietly, and waits for the next line."
      ],
      "will-o-wisp": [
        "A lantern with no one holding it, looking for someone to follow it.",
        "It leads walkers toward the manor, always by the safe path. Nobody has ever thought to thank it.",
        "It is the lamp Mirelle left in the window for Osric. He was late that night. She has not put it out."
      ],
      "drowned-courtier": [
        "Still bowing to the Baron. Still wet.",
        "It bows to the walker too, a little less deeply. The Ledger notes the difference without comment.",
        "In its hat, an invitation to the Baron's first wedding anniversary. It was set for the day after the flood."
      ],
      "peat-cutter": [
        "It cuts peat under the water now. The Baron's orders still stand.",
        "It stacks every sod on the bank to dry. The bank is under the water too. It stacks them anyway.",
        "Its lantern went out on the night of the flood. It will relight it when the shift ends. The shift has not ended."
      ],
      "mire-heron": [
        "It waits on one leg for fish that are only memories. It has never been hungry.",
        "It changes legs once a night. The Ledger has marked the moment: always just after the King falls.",
        "Vorn once caught Biscuit staring at it for an hour. The heron stared back. Neither blinked. Vorn called it a draw."
      ],
      "bog-colossus": [
        "The whole east field, standing up.",
        "Rice still grows on its shoulders, in neat rows. Someone planted it with care, before it stood.",
        "Mirelle's garden is somewhere in its left arm. She has asked it, politely, to give the roses back."
      ],
      "rot-baron": [
        "Osric. Wears a wedding ring that is not rotting.",
        "Mirelle's notes on him fill a shelf. Every volume ends the same way: try again tomorrow.",
        "As he falls, he looks past the walker. The Ledger has checked. It is always where Mirelle is standing."
      ],
      ferryman: [
        "Asks for a coin to cross. There is nothing to cross. Pay him anyway.",
        "He keeps every coin he is paid. Two of them are his eyes. The Ledger has not asked about the others.",
        "Morgrath bows to him. On the whole road, he is the only one Morgrath calls a colleague."
      ]
    },
    pages: {
      "green-plains": "Verdant Plains",
      "dark-forest": "Dark Forest",
      "forgotten-caves": "Forgotten Caves",
      "corrupted-marsh": "Corrupted Marsh",
      "fallen-king-ruins": "Fallen King's Ruins",
      specials: "Beyond the Road",
      kings: "The Twelve Kings"
    }
  },
  fr: {
    monsters: {
      "mourning-owl": "Chouette endeuillée",
      "toadstool-choir": "Chœur des champignons",
      "whisper-bramble": "Ronce qui murmure",
      "weeping-stag": "Le Cerf qui pleure",
      "drip-leech": "Sangsue des gouttes",
      "rune-cart": "Wagonnet hanté",
      "hollow-canary": "Canari creux",
      "singing-geode": "La Géode chantante",
      "drowned-courtier": "Courtisan noyé",
      "peat-cutter": "Tourbier",
      "mire-heron": "Héron des fanges",
      ferryman: "Le Passeur"
    },
    lines: {
      "shade-wolf": [
        "Un loup fait de l'obscurité entre deux arbres.",
        "Il ne traverse jamais une clairière. Le Grand Livre l'a vu faire le grand tour, chaque fois.",
        "Les arbres d'Ysolde lui prêtent leurs ombres. Elle leur a demandé d'arrêter. Ils disent qu'il a demandé avant."
      ],
      "briar-witch": [
        "Une druidesse restée trop longtemps dans la forêt, devenue un morceau de sa haie.",
        "Elle fredonne encore les leçons du Bosquet. Elle se trompe au troisième couplet, au même endroit, chaque nuit.",
        "Séraphine connaissait son nom. Elle passe sans la regarder, et laisse un peu d'eau à ses racines."
      ],
      "grove-spinner": [
        "Elle file les épines là où les marcheurs ont saigné. Elle n'a jamais manqué de fil.",
        "Sa toile retient des lambeaux de cape. Le plus récent a la couleur de la tienne.",
        "Elle noue chaque fil du même nœud. Eldra noue les siens ainsi. Elle dit que c'est un nœud courant. C'est faux."
      ],
      "mourning-owl": [
        "Elle pose une seule question, encore et encore. La réponse est toujours un nom.",
        "Elle interroge chaque marcheur une fois, puis attend. Le Grand Livre note qu'on ne lui a jamais donné le bon nom.",
        "Elle a pris le deuil la nuit où la forêt a entendu le donjon se taire. Personne ne lui a dit pour qui."
      ],
      "toadstool-choir": [
        "Sept champignons, une chanson, parfaitement faux.",
        "Le plus grand, celui au chapeau déchiré, est le seul à chanter juste. Les six autres lui en veulent.",
        "Célestine fredonne avec eux en passant. Le temps d'une mesure, les sept chantent juste."
      ],
      "whisper-bramble": [
        "Elle murmure les noms des marcheurs qui ont saigné sur elle. Le tien est nouveau.",
        "Elle les murmure dans l'ordre. Le Grand Livre les a comparés au Registre. La liste de la ronce est plus longue.",
        "Le plus vieux nom qu'elle connaisse, plus profond que ses racines, est le même que le tien. Elle ne l'avait pas vu."
      ],
      "root-knight": [
        "Un soldat enterré sous un chêne. Le chêne s'est levé.",
        "Il salue encore au crépuscule. Le chêne ignore pourquoi son bras fait ça, et a cessé de se le demander.",
        "Kaelen connaissait le soldat. Il dit que le chêne se bat mieux que l'homme, et que l'homme en serait content."
      ],
      "old-grove": [
        "L'arbre-mère. Quand elle tombe, toute la forêt soupire.",
        "Elle abaisse ses branches juste avant le dernier coup. Le Grand Livre inscrit une défaite. Il n'en est pas sûr.",
        "Séraphine reste en arrière quand elle tombe. Le Grand Livre ne note pas ce qu'elles se disent. On le lui a demandé."
      ],
      "weeping-stag": [
        "Ses larmes sont de la sève. Ses bois portent un nid d'étoiles.",
        "Les étoiles de ses bois sont des morceaux du ciel. Il les porte doucement, comme si elles pouvaient éclore.",
        "Chaque nuit, une étoile de plus dans le nid. Le Grand Livre a compté. Le ciel en a une de moins."
      ],
      "blind-crawler": [
        "Il n'a pas d'yeux, car rien ici-bas n'a jamais été fait pour être vu.",
        "Il tourne quand même la tête vers le marcheur. Le Grand Livre ignore ce qu'il suit. Pas la lumière.",
        "Une fois, il s'est arrêté, tourné vers le haut, longtemps. Là-haut, quelque chose regardait."
      ],
      "echo-bat": [
        "Elle crie un instant avant que tu frappes.",
        "Depuis peu, elle crie un instant avant que tu décides de frapper. Le Grand Livre ne trouve plus ça drôle.",
        "Oriane en garde une chez elle. Elle crie avant qu'Oriane parle : Oriane n'a jamais à finir ses phrases."
      ],
      "crystal-mite": [
        "Il mange du verre du ciel. Il rejette du verre du ciel, en plus petit.",
        "Le Comptoir rachète ses crottes au poids. Personne ne demande d'où viennent les éclats. C'est la règle.",
        "Ses crottes s'emboîtent. Garrick a essayé, une nuit creuse. Ça a fait un carré de ciel grand comme la main, intact."
      ],
      "drip-leech": [
        "Pendue au plafond, elle boit tout ce qui tombe. Surtout le temps.",
        "Elle a bu tant de temps qu'elle meurt avec un instant de retard. Le Grand Livre l'inscrit un instant plus tôt.",
        "Sa stalactite ne grandit jamais : elle a bu chaque goutte qui l'aurait allongée. La caverne a rajeuni d'autant."
      ],
      "rune-cart": [
        "Il fait encore la ligne jusqu'à la surface. La ligne finit dans la roche, à présent.",
        "Il s'arrête à chaque ancienne station et attend exactement le temps prévu. Personne ne monte.",
        "Son dernier chargement : des éclats pour le donjon, partis la veille de la Longue Nuit. Il essaie encore de livrer."
      ],
      "hollow-canary": [
        "Le canari des mineurs. Il s'est tu le jour où l'air a tourné. Il chante à présent, pour personne.",
        "Il chante un avertissement. Le Grand Livre a bien écouté : l'avertissement ne parle pas de l'air.",
        "Plus la strate est profonde, plus il chante fort. Ce qui arrive, il l'a senti le premier."
      ],
      "miner-shade": [
        "Il manie encore la pioche. Toujours de service.",
        "Il pointe à l'aube. Le Grand Livre garde sa fiche ouverte depuis plus longtemps que la mine n'existe.",
        "Garrick partage son casse-croûte avec lui, sans le noter. Il lui laisse toujours la croûte, comme son père."
      ],
      "stone-devourer": [
        "Il a creusé jusqu'au ciel tombé, et l'a trouvé. Il n'a pas pu le digérer.",
        "Son ventre luit faiblement quand il meurt. Le Grand Livre a mesuré : la lueur a la forme d'une fêlure du ciel.",
        "Garrick dit qu'il creusait pour la même raison que lui. Il dit aussi que c'est le seul des deux à avoir fait fortune."
      ],
      "singing-geode": [
        "Une pierre qui fredonne le nom de Célestine avant qu'on l'engage.",
        "L'air change quand quelqu'un la regarde. Le Grand Livre n'a pas trouvé comment vérifier sans la regarder.",
        "Célestine en garde un éclat dans sa poche. Elle dit qu'il fredonne un nom, lui aussi. Elle ne dit pas lequel."
      ],
      "bog-remnant": [
        "Le marais qui se souvient d'une personne. Il a retrouvé presque toutes les pièces.",
        "Ce qu'il rate, ce sont toujours les mains. Le marais n'a jamais regardé les mains de personne.",
        "Mirelle a trouvé sa propre boucle d'oreille sur l'un d'eux. Elle l'a reprise. La nuit suivante, il la portait encore."
      ],
      "rot-toad": [
        "Il coasse avec la voix du Baron. C'est lui que Mirelle déteste le plus.",
        "Toujours les trois mêmes mots. Le Grand Livre les a transcrits. Il ne les publiera pas sans l'accord de Mirelle.",
        "Mirelle n'en a jamais tué un. Quand il coasse, elle répond, tout bas, et attend la réplique suivante."
      ],
      "will-o-wisp": [
        "Une lanterne que personne ne tient, qui cherche quelqu'un pour la suivre.",
        "Il mène les marcheurs vers le manoir, toujours par le chemin sûr. Personne n'a jamais pensé à le remercier.",
        "C'est la lampe que Mirelle avait posée à la fenêtre pour Osric. Il était en retard, ce soir-là. Elle ne l'a pas éteinte."
      ],
      "drowned-courtier": [
        "Il s'incline toujours devant le Baron. Toujours trempé.",
        "Il s'incline aussi devant le marcheur, un peu moins bas. Le Grand Livre note la différence, sans commentaire.",
        "Dans son chapeau, une invitation au premier anniversaire de mariage du Baron. Prévu le lendemain de la crue."
      ],
      "peat-cutter": [
        "Il coupe la tourbe sous l'eau, désormais. Les ordres du Baron tiennent toujours.",
        "Il empile chaque motte sur la berge, pour qu'elle sèche. La berge aussi est sous l'eau. Il empile quand même.",
        "Sa lanterne s'est éteinte la nuit de la crue. Il la rallumera à la fin de son service. Le service n'a pas fini."
      ],
      "mire-heron": [
        "Il attend sur une patte des poissons qui ne sont plus que des souvenirs. Il n'a jamais eu faim.",
        "Il change de patte une fois par nuit. Le Grand Livre a noté le moment : toujours juste après la chute du Roi.",
        "Vorn a surpris Biscuit à le fixer une heure durant. Le héron l'a fixé en retour. Personne n'a cillé. Match nul."
      ],
      "bog-colossus": [
        "Tout le champ de l'est, debout.",
        "Du riz pousse encore sur ses épaules, en rangs bien droits. Quelqu'un l'a planté avec soin, avant qu'il se lève.",
        "Le jardin de Mirelle est quelque part dans son bras gauche. Elle lui a demandé, poliment, de rendre les roses."
      ],
      "rot-baron": [
        "Osric. Il porte une alliance qui ne pourrit pas.",
        "Les notes de Mirelle à son sujet remplissent une étagère. Chaque volume finit pareil : réessayer demain.",
        "En tombant, il regarde derrière le marcheur. Le Grand Livre a vérifié : c'est toujours là que se tient Mirelle."
      ],
      ferryman: [
        "Il demande une pièce pour traverser. Il n'y a rien à traverser. Paie-le quand même.",
        "Il garde toutes les pièces qu'on lui donne. Deux lui servent d'yeux. Le Grand Livre n'a pas demandé pour les autres.",
        "Morgrath s'incline devant lui. Sur toute la route, c'est le seul qu'il appelle « confrère »."
      ]
    },
    pages: {
      "green-plains": "Plaines verdoyantes",
      "dark-forest": "Forêt sombre",
      "forgotten-caves": "Cavernes oubliées",
      "corrupted-marsh": "Marais corrompu",
      "fallen-king-ruins": "Ruines du roi déchu",
      specials: "Hors des routes",
      kings: "Les douze rois"
    }
  }
};
