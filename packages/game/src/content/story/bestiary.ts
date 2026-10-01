import type { Locale } from "../../i18n";
import type { BestiaryText } from "../types";

/**
 * The Ledger's pages for the Wychwood, the Deepvaults and the Mire of Osric (BIBLE 8.2 to
 * 8.4, 12.3): the names of the new Remnants, three lines per creature, and the page names.
 * Each line says what the creature is and one clear fact about it.
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
        "A wolf made of the shadow between two trees. It hunts walkers who stray from the Wychwood's path.",
        "It cannot cross moonlight, so it goes round every clearing, never through. Run across one and you lose it.",
        "Ysolde asked her trees to stop lending it their shadows. They refused: the wolf asked first, and trees are polite."
      ],
      "briar-witch": [
        "A druid of the Grove who stayed in the forest too long. The brambles grew into her; now she is part of the hedge.",
        "She still recites the Grove's lessons, and gets the third verse wrong, the same way, every night.",
        "She trained beside Séraphine. Séraphine walks past without a word, but leaves a little water at her roots."
      ],
      "grove-spinner": [
        "A spider as big as a cart. It weaves thorns across the paths where walkers have bled.",
        "Its web holds scraps of cloak from every walker who fell in the Wychwood. The newest scrap matches yours.",
        "It never runs out of thread: the forest grows new thorns every night, and it has spun since the night began."
      ],
      "mourning-owl": [
        "An owl in mourning. It asks everyone who passes the same question, \"Who?\", and waits for a name.",
        "It went into mourning the night the keep fell silent. It mourns the King, but nobody ever told it his name.",
        "Ysolde warns walkers never to answer it. Give it a name, and it will call that name every night after."
      ],
      "toadstool-choir": [
        "Seven mushrooms who sing together, badly. They have rehearsed the same song for as long as the night has lasted.",
        "Only the tallest, the one with the torn cap, sings in tune. The other six resent it deeply.",
        "When Célestine hums along, all seven sing in tune for one bar. They talk about it for the rest of the night."
      ],
      "whisper-bramble": [
        "A bramble that whispers the name of every walker who bled on its thorns. It has just learned yours.",
        "The Ledger compared its list with the Roll of the Bound. The bramble's list is longer: some walkers never signed.",
        "Its oldest name is Aldric, the name every walker carries. It has whispered it since the first walker bled here."
      ],
      "root-knight": [
        "A soldier of Orvane, buried under an oak. When the Long Night began, the oak stood up and took his post.",
        "It still salutes at dusk. The oak does not know why its arm does that, and has stopped wondering.",
        "Kaelen served with the soldier. He says the oak fights better than the man did, and the man would be pleased."
      ],
      "old-grove": [
        "The Heart of the Old Grove, the mother-tree who taught the druids. Remembered too long, she turned hostile.",
        "She lowers her branches just before the last blow. The Ledger records a defeat, and suspects she lets you win.",
        "She taught Séraphine, and asked her to help walkers cut her down each night, so the forest can rest until dusk."
      ],
      "weeping-stag": [
        "A rare stag that weeps sap. It carries a nest of fallen stars in its antlers.",
        "The stars in its nest are shards of the Sky-Glass, the cracked dome over Orvane. It carries them like eggs.",
        "Each night it gathers one more fallen shard. The Ledger counted: one new crack in the sky, one new star in the nest."
      ],
      "blind-crawler": [
        "A pale crawler of the caves, with no eyes. It finds walkers by the sound of their breathing.",
        "Hold your breath and it loses you. It then waits, very patiently, for you to breathe again. Nobody holds out long.",
        "The miners called it the foreman. It kept the galleries clear of rats long before it kept them clear of walkers."
      ],
      "echo-bat": [
        "A cave bat that screeches a moment before you strike. It has heard this fight on other nights, and remembers.",
        "It now screeches before you even decide to strike. The Ledger has stopped finding this funny.",
        "Oriane keeps one at home. It screeches before she speaks, so she never has to finish a sentence."
      ],
      "crystal-mite": [
        "A mite that eats sky-glass, the shards fallen from the cracked sky. It leaves smaller shards behind.",
        "The Stallkeeper buys its droppings by weight, to mend the sky. Nobody asks where the shards came from. Policy.",
        "Garrick once fitted its droppings together. They made a hand's width of sky, without a single crack."
      ],
      "drip-leech": [
        "A leech that hangs from the cave ceiling and drinks whatever drips down. Mostly water. Sometimes a walker.",
        "Its stalactite never grows: it drinks every drop before the stone can keep it. The miners hated it for this.",
        "Garrick swears one drank his whole lunch break. He asked the Ledger to note the complaint. It did."
      ],
      "rune-cart": [
        "A mine cart that still runs the rail to the surface. The rail ends in solid rock now. It goes anyway.",
        "It stops at every old station and waits exactly as long as the timetable says. Nobody gets on.",
        "Its last load was shards for the keep, sent on the eve of the Long Night. It is still trying to deliver them."
      ],
      "hollow-canary": [
        "The miners' canary. It fell silent when the air turned bad, and the miners fled. Now it sings for nobody.",
        "Its song is a warning. The miners left long ago, so it warns the walkers now, just in case.",
        "It sings louder in the deeper strata, where the night is older. Something down there scares it more than bad air."
      ],
      "miner-shade": [
        "The ghost of a Runeguild miner, still swinging his pick. His shift ends at dawn, he says.",
        "Dawn has not come since the Long Night began, so his shift has now lasted longer than the mine itself.",
        "Garrick shares his lunch with him, off the books. The shade always leaves him the crust, as Garrick's father did."
      ],
      "stone-devourer": [
        "A giant worm that ate through the mountain to reach the fallen sky. It found the shards and could not digest them.",
        "When it dies, its belly glows in the shape of a crack. It swallowed enough sky-glass to show one.",
        "Garrick says it dug for the same reason he does. He also says it is the only one of them who struck it rich."
      ],
      "singing-geode": [
        "A rare geode that hums the name of Célestine, who sings to crystals. It hums it before you ever meet her.",
        "Its tune changes when someone looks at it. The Ledger has found no way to check this without looking.",
        "Célestine keeps a chip of one in her pocket, as a friend. It hums her name all night. She hums back."
      ],
      "bog-remnant": [
        "The marsh trying to remember one of the people who drowned in it. It got most of the parts right.",
        "It always gets the hands wrong. The marsh never looked at anyone's hands.",
        "Mirelle once found her own earring on one. She took it back. The next night, it was wearing it again."
      ],
      "rot-toad": [
        "A bloated toad that croaks in the voice of Baron Osric. Mirelle, the alchemist, hates it most of all.",
        "It croaks the same three words every night. The Ledger wrote them down, and will not print them without Mirelle.",
        "Mirelle has never killed one. When it croaks, she answers softly, and waits for the next line."
      ],
      "will-o-wisp": [
        "A lantern flame with no one holding it. It floats over the marsh, looking for someone to follow it.",
        "Follow it and it leads you to the manor, always by the safe path. Nobody has ever thought to thank it.",
        "It is the lamp Mirelle left in the window for Osric, the night of the flood. He was late. She never put it out."
      ],
      "drowned-courtier": [
        "A courtier of Baron Osric, drowned when the marsh flooded. Still bowing to the Baron. Still wet.",
        "It bows to walkers too, a little less deeply. The Ledger notes the difference without comment.",
        "In its hat, an invitation to the Baron's first wedding anniversary. It was set for the day after the flood."
      ],
      "peat-cutter": [
        "A worker of the Baron's peat fields. They flooded, but his orders never changed, so he cuts peat underwater.",
        "He stacks every sod on the bank to dry. The bank is underwater too. He stacks them anyway.",
        "His lantern went out the night of the flood. He will relight it when his shift ends. It has not ended."
      ],
      "mire-heron": [
        "A heron that waits on one leg for fish. The fish of the Mire died in the flood. It has not noticed.",
        "It changes legs once a night, always just after the King falls. The Ledger has checked many times.",
        "Vorn once caught Biscuit staring at it for an hour. The heron stared back. Nobody blinked. Vorn called it a draw."
      ],
      "bog-colossus": [
        "The Baron's whole east field, risen as one giant of mud and roots.",
        "Rice still grows on its shoulders, in neat rows. Someone planted that field with care, before it stood up.",
        "Mirelle's garden is somewhere in its left arm. She has asked it, politely, to give the roses back."
      ],
      "rot-baron": [
        "Baron Osric, lord of the Mire, rotten through. Only his wedding ring stays clean: someone still loves him.",
        "His wife is Mirelle, the alchemist. Each night she tries a new cure on him before you fight. None has worked.",
        "As he falls, he always looks past the walker, at the spot where Mirelle is standing."
      ],
      ferryman: [
        "A ferryman with no river. He asks a coin to cross the marsh road. There is nothing to cross. Pay him anyway.",
        "He keeps every coin he is paid. Two of them are his eyes. The Ledger has not asked about the others.",
        "Morgrath the lich bows to him. On the whole road, he is the only one Morgrath calls a colleague."
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
        "Un loup fait de l'ombre entre deux arbres. Il chasse les marcheurs qui quittent le sentier du Bois.",
        "Il ne peut pas traverser le clair de lune : il contourne chaque clairière. Coupe à travers, et tu le sèmes.",
        "Ysolde a prié ses arbres de ne plus lui prêter leur ombre. Ils ont refusé : le loup avait demandé avant."
      ],
      "briar-witch": [
        "Une druidesse du Bosquet restée trop longtemps en forêt. Les ronces ont poussé en elle : elle fait partie de la haie.",
        "Elle récite encore les leçons du Bosquet, et se trompe au troisième couplet, au même endroit, chaque nuit.",
        "Elle a été formée avec Séraphine. Séraphine passe sans un mot, mais laisse un peu d'eau à ses racines."
      ],
      "grove-spinner": [
        "Une araignée grande comme une charrette. Elle tend des épines sur les sentiers où des marcheurs ont saigné.",
        "Sa toile garde des lambeaux de cape de chaque marcheur tombé dans le Bois. Le plus récent a la couleur de la tienne.",
        "Elle ne manque jamais de fil : la forêt refait ses épines chaque nuit, et elle file depuis le début de la nuit."
      ],
      "mourning-owl": [
        "Une chouette en deuil. Elle pose à chaque passant la même question, « Qui ? », et attend un nom.",
        "Elle a pris le deuil la nuit où le donjon s'est tu. Elle pleure le roi, mais personne ne lui a dit son nom.",
        "Ysolde prévient : ne lui réponds jamais. Donne-lui un nom, et elle l'appellera chaque nuit, pour toujours."
      ],
      "toadstool-choir": [
        "Sept champignons qui chantent ensemble, faux. Ils répètent la même chanson depuis que la nuit dure.",
        "Seul le plus grand, celui au chapeau déchiré, chante juste. Les six autres lui en veulent à mort.",
        "Quand Célestine fredonne avec eux, les sept chantent juste le temps d'une mesure. Ils en parlent toute la nuit."
      ],
      "whisper-bramble": [
        "Une ronce qui murmure le nom de chaque marcheur qui a saigné sur ses épines. Elle vient d'apprendre le tien.",
        "Le Grand Livre a comparé sa liste au Registre des Liés. Celle de la ronce est plus longue : certains n'ont pas signé.",
        "Son plus vieux nom est Aldric, celui que porte chaque marcheur. Elle le murmure depuis le premier sang versé ici."
      ],
      "root-knight": [
        "Un soldat d'Orvane enterré sous un chêne. Quand la Longue Nuit a commencé, le chêne s'est levé et a pris son poste.",
        "Il salue encore au crépuscule. Le chêne ignore pourquoi son bras fait ça, et a cessé de se le demander.",
        "Kaelen a servi avec ce soldat. Il dit que le chêne se bat mieux que l'homme, et que l'homme en serait fier."
      ],
      "old-grove": [
        "Le Cœur du vieux bosquet, l'arbre-mère qui formait les druides. Trop longtemps remémorée, elle est devenue hostile.",
        "Elle baisse ses branches avant le dernier coup. Le Grand Livre note une défaite, et la soupçonne de te laisser gagner.",
        "Elle a formé Séraphine, et lui a demandé d'aider les marcheurs à l'abattre chaque nuit, pour que la forêt se repose."
      ],
      "weeping-stag": [
        "Un cerf rare qui pleure de la sève. Il porte dans ses bois un nid d'étoiles tombées.",
        "Les étoiles de son nid sont des éclats de la Voûte de verre, le dôme fêlé d'Orvane. Il les couve comme des œufs.",
        "Chaque nuit, il ramasse un éclat de plus. Le Grand Livre a compté : une fêlure au ciel, une étoile au nid."
      ],
      "blind-crawler": [
        "Un rampeur pâle des cavernes, sans yeux. Il trouve les marcheurs au bruit de leur souffle.",
        "Retiens ton souffle, et il te perd. Il attend alors, très patient, que tu respires. Personne ne tient longtemps.",
        "Les mineurs l'appelaient le contremaître. Il vidait les galeries des rats bien avant de les vider des marcheurs."
      ],
      "echo-bat": [
        "Une chauve-souris qui crie un instant avant que tu frappes. Elle a entendu ce combat d'autres nuits, et s'en souvient.",
        "Elle crie maintenant avant même que tu décides de frapper. Le Grand Livre ne trouve plus ça drôle.",
        "Oriane en garde une chez elle. Elle crie avant qu'Oriane parle : Oriane n'a jamais à finir ses phrases."
      ],
      "crystal-mite": [
        "Un acarien qui mange du verre du ciel, les éclats tombés de la Voûte fêlée. Il en rejette de plus petits.",
        "Le Comptoir rachète ses crottes au poids, pour réparer le ciel. Personne ne demande d'où elles viennent. C'est la règle.",
        "Garrick a un jour assemblé ses crottes. Ça a fait un carré de ciel grand comme la main, sans une fêlure."
      ],
      "drip-leech": [
        "Une sangsue pendue au plafond des cavernes, qui boit tout ce qui goutte. Surtout de l'eau. Parfois un marcheur.",
        "Sa stalactite ne grandit jamais : elle boit chaque goutte avant que la pierre la garde. Les mineurs la détestaient.",
        "Garrick jure qu'une d'elles a bu toute sa pause de midi. Il a demandé au Grand Livre de noter sa plainte. C'est noté."
      ],
      "rune-cart": [
        "Un wagonnet qui fait encore la ligne vers la surface. La ligne finit dans la roche, maintenant. Il y va quand même.",
        "Il s'arrête à chaque ancienne station et attend exactement le temps prévu. Personne ne monte.",
        "Son dernier chargement : des éclats pour le donjon, partis la veille de la Longue Nuit. Il essaie encore de livrer."
      ],
      "hollow-canary": [
        "Le canari des mineurs. Il s'est tu quand l'air a tourné, et les mineurs ont fui. Il chante à présent pour personne.",
        "Son chant est un avertissement. Les mineurs sont partis depuis longtemps : il prévient les marcheurs, au cas où.",
        "Plus la strate est profonde et la nuit vieille, plus il chante fort. Quelque chose en bas lui fait plus peur que l'air."
      ],
      "miner-shade": [
        "Le fantôme d'un mineur de la Guilde des runes, pioche en main. Il finit son service à l'aube, dit-il.",
        "L'aube n'est pas revenue depuis le début de la Longue Nuit : son service dure déjà plus longtemps que la mine.",
        "Garrick partage son casse-croûte avec lui, en douce. L'ombre lui laisse toujours la croûte, comme le père de Garrick."
      ],
      "stone-devourer": [
        "Un ver géant qui a percé la montagne pour atteindre le ciel tombé. Il a trouvé les éclats, sans pouvoir les digérer.",
        "Quand il meurt, son ventre luit en forme de fêlure. Il a avalé assez de verre du ciel pour en dessiner une.",
        "Garrick dit qu'il creusait pour la même raison que lui. Il dit aussi que c'est le seul des deux à avoir fait fortune."
      ],
      "singing-geode": [
        "Une géode rare qui fredonne le nom de Célestine, la voix des cristaux. Elle le fredonne avant même que tu la rencontres.",
        "Son air change quand quelqu'un la regarde. Le Grand Livre n'a trouvé aucun moyen de vérifier sans la regarder.",
        "Célestine en garde un éclat dans sa poche, comme une amie. Il fredonne son nom toute la nuit. Elle lui répond."
      ],
      "bog-remnant": [
        "Le marais qui essaie de se souvenir d'un des noyés. Il a retrouvé presque toutes les pièces.",
        "Il rate toujours les mains. Le marais n'a jamais regardé les mains de personne.",
        "Mirelle a trouvé sa propre boucle d'oreille sur l'un d'eux. Elle l'a reprise. La nuit suivante, il la portait encore."
      ],
      "rot-toad": [
        "Un crapaud boursouflé qui coasse avec la voix du baron Osric. Mirelle, l'alchimiste, le déteste plus que tout.",
        "Il coasse les trois mêmes mots chaque nuit. Le Grand Livre les a notés, et ne les publiera pas sans Mirelle.",
        "Mirelle n'en a jamais tué un. Quand il coasse, elle répond tout bas, et attend la réplique suivante."
      ],
      "will-o-wisp": [
        "Une flamme de lanterne que personne ne tient. Elle flotte sur le marais, en quête de quelqu'un qui la suive.",
        "Suis-la : elle te mène au manoir, toujours par le chemin sûr. Personne n'a jamais pensé à la remercier.",
        "C'est la lampe que Mirelle a posée à la fenêtre pour Osric, la nuit de la crue. Il était en retard. Elle brûle toujours."
      ],
      "drowned-courtier": [
        "Un courtisan du baron Osric, noyé quand le marais a débordé. Il s'incline toujours devant le baron. Toujours trempé.",
        "Il s'incline aussi devant les marcheurs, un peu moins bas. Le Grand Livre note la différence, sans commentaire.",
        "Dans son chapeau, une invitation au premier anniversaire de mariage du baron, prévu le lendemain de la crue."
      ],
      "peat-cutter": [
        "Un ouvrier des tourbières du baron. Elles ont été noyées, mais ses ordres n'ont pas changé : il coupe sous l'eau.",
        "Il empile chaque motte sur la berge pour qu'elle sèche. La berge aussi est sous l'eau. Il empile quand même.",
        "Sa lanterne s'est éteinte la nuit de la crue. Il la rallumera à la fin de son service. Le service n'a pas fini."
      ],
      "mire-heron": [
        "Un héron qui attend sur une patte. Les poissons du marais sont morts dans la crue. Il ne l'a pas remarqué.",
        "Il change de patte une fois par nuit, toujours juste après la chute du roi. Le Grand Livre a vérifié souvent.",
        "Vorn a surpris Biscuit à le fixer une heure durant. Le héron l'a fixé en retour. Personne n'a cillé. Match nul."
      ],
      "bog-colossus": [
        "Tout le champ de l'est du baron, levé d'un bloc en géant de boue et de racines.",
        "Du riz pousse encore sur ses épaules, en rangs bien droits. Quelqu'un avait planté ce champ avec soin.",
        "Le jardin de Mirelle est quelque part dans son bras gauche. Elle lui a demandé, poliment, de rendre les roses."
      ],
      "rot-baron": [
        "Le baron Osric, seigneur du marais, pourri jusqu'à l'os. Seule son alliance reste propre : quelqu'un l'aime encore.",
        "Sa femme est Mirelle, l'alchimiste. Chaque nuit, elle essaie sur lui un remède avant ton combat. Aucun n'a marché.",
        "En tombant, il regarde toujours derrière le marcheur, là où se tient Mirelle."
      ],
      ferryman: [
        "Un passeur sans rivière. Il demande une pièce pour traverser le marais. Il n'y a rien à traverser. Paie-le quand même.",
        "Il garde toutes les pièces qu'on lui donne. Deux lui servent d'yeux. Le Grand Livre n'a pas demandé pour les autres.",
        "Morgrath, la liche, s'incline devant lui. Sur toute la route, c'est le seul qu'il appelle « confrère »."
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
