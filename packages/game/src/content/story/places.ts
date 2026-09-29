import type { Locale } from "../../i18n";
import type { PlacesText } from "../types";

/**
 * The five places of the road (BIBLE 7), their echoes (12 per biome, one per guardian first
 * clear, in order), the fragments left by the rare wanderers, and the three places outside
 * the road: the Sanctum of Dusk, Eldra's Loom and the Dawn.
 */
export const PLACES_TEXT: Record<Locale, PlacesText> = {
  en: {
    biomes: {
      "green-plains": {
        name: "Verdant Plains",
        description: "Orvane's farmland. The last harvest was never brought in, and the sheaves still stand."
      },
      "dark-forest": {
        name: "Dark Forest",
        description: "The Grove's sacred wood, where druids were taught. At night the brambles whisper names and grow thorns where walkers bled."
      },
      "forgotten-caves": {
        name: "Forgotten Caves",
        description: "The Runeguild's mines, dug for fallen stars. At night the rails glow, and voices echo before anyone speaks."
      },
      "corrupted-marsh": {
        name: "Corrupted Marsh",
        description: "Baron Osric's drained fens, flooded on the night everything stopped. The manor sinks an inch a night."
      },
      "fallen-king-ruins": {
        name: "Fallen King's Ruins",
        description: "The royal keep of Orvane. The banners have lost their colors, and the throne faces the window, not the door."
      }
    },
    echoes: {
      "dark-forest": [
        { by: "The Ledger", text: "In the Wychwood the roots hang from the branches like ropes. Nobody has ever climbed down one." },
        { by: "Ysolde", text: "Stand still. That owl has asked the same question since before I was born. Whatever you do, don't answer it." },
        { by: "A whispering bramble", text: "Aldric. We know that name. It has bled here before." },
        { by: "The Ledger", text: "A druid's lantern hangs from a low branch, still lit. The oil in it has not gone down in a very long time." },
        { by: "A toadstool", text: "La. La. La. We almost have the song now. Come back tomorrow and hear it. You will." },
        { by: "Séraphine", text: "I asked the roots nicely, once. They still remember. Roots are the only ones in this wood who do." },
        { by: "The Ledger", text: "Nyx waits where the last lantern of the road goes out. She was there before the lantern was." },
        { by: "Ysolde", text: "The trees showed me you, fallen by that stump. I went to look. Nobody there. Not tonight." },
        { by: "The Ledger", text: "Ysolde's parents walked into the east wood the year it went quiet. The east wood is on no map now." },
        { by: "Séraphine", text: "The old tree taught me every root by name. Every night I bring you to her. She knows why. So do I." },
        { by: "The Ledger", text: "When the Heart of the Old Grove falls, Nyx looks up through the gap in the leaves, the way one looks at home." },
        { by: "The Ledger", text: "The mother-tree's rings have been counted. There are more rings than the kingdom has years." }
      ],
      "forgotten-caves": [
        { by: "The Ledger", text: "The rails are still lit with runes. They lead down, always down, to where the carts stopped." },
        { by: "Garrick", text: "Mind the drip. The leeches drink it. Down here even the water arrives late." },
        { by: "A haunted cart", text: "Next stop, the surface. Next stop, the surface. Next stop." },
        { by: "The Ledger", text: "A voice down the gallery shouts \"Left!\" Something comes from the left. The voice was Garrick's. Garrick is not here yet." },
        { by: "Thorvald", text: "I felled a mountain here once. On a bet. Lost the bet. Don't ask who with. Don't look at the rat." },
        { by: "Garrick", text: "The canary stopped singing, so we left. It sings again now. None of us came back to hear it." },
        { by: "The Ledger", text: "The Runeguild's tally board: shards dug, forty years of chalk. Shards fallen since: the chalk ran out." },
        { by: "Oriane", text: "You come down this gallery. You stop at the third rune. You always stop at the third rune." },
        { by: "Garrick", text: "Most shards show your own face. Some show mine, younger. I stopped looking. Rock keeps secrets better than me." },
        { by: "Thorvald", text: "The Devourer ate a mountain to reach the sky. Found it. Couldn't keep it down. I know the feeling." },
        { by: "Oriane", text: "The deepest vault is quiet. I hear tomorrow from here. Tomorrow sounds like tonight." },
        { by: "The Ledger", text: "Oriane's cell has two stools. She sits on one and answers the other." }
      ],
      "corrupted-marsh": [
        { by: "The Ledger", text: "The causeway goes under the water and comes up again further on. Walkers have learned to hold their breath." },
        { by: "Mirelle", text: "Don't drink the water. Don't breathe the air. Don't make that face. The Baron made that face." },
        { by: "A will-o'-wisp", text: "Follow. Follow. No, the other way. Everyone goes the other way, in the end." },
        { by: "The Ledger", text: "The manor of Osric sinks an inch a night. The ballroom is under now. The candles in it are lit." },
        { by: "A drowned courtier", text: "His lordship will see you shortly. His lordship has been seeing people shortly for a very long time." },
        { by: "Vorn", text: "Found Biscuit near here. Well. Biscuit found me. Don't pet him. Don't not pet him, either." },
        { by: "A peat cutter", text: "Cut the peat. Stack the peat. The Baron will want a fire tonight. The Baron always wants a fire." },
        { by: "Mirelle", text: "Tonight's cure: nightshade, salt, a spoon of my own blood. Tomorrow's cure: whatever tonight's wasn't." },
        { by: "The Ledger", text: "The Mire was drained for peat and rice. The water came back in a single night. It has not left since." },
        { by: "Vorn", text: "Beasts know when the weather turns. Mine have been waiting for a change for a very long time. They're patient. I'm not." },
        { by: "Mirelle", text: "The ring is still bright on his hand. Gold doesn't rot. Neither does a promise, it turns out. Pity." },
        { by: "The Ledger", text: "In the chapel on the last dry hill, a wedding register. The last entry: Osric, Mirelle. The ink is still wet." }
      ],
      "fallen-king-ruins": [
        { by: "The Ledger", text: "The banners of the Keep have lost their colors. They still hang straight, as if someone might inspect them." },
        { by: "Kaelen", text: "The sentinels salute me. I salute back. Don't ask me which of us is the ghost." },
        { by: "A candle maid", text: "Dinner is served. Dinner is served. Please. Someone. Dinner is served." },
        { by: "Morgrath", text: "I'll wait out here. No, I will not come in. I have standards, and he has a throne." },
        { by: "The Ledger", text: "A hound of the last hunt sniffs the flagstones by the gate. The scent it follows leads out. It is the only one that does." },
        { by: "The Ledger", text: "The Nameless stops at the great hall's door, the way a man stops at a house he used to live in. Then he goes in." },
        { by: "Kaelen", text: "The third step is loose. He always said he'd have it fixed. He always said it while stepping over it." },
        { by: "The King", text: "I had the throne turned to face the window. A king should see what is coming." },
        { by: "Morgrath", text: "He stole the morning from me. Not a morning. The morning. I keep a list of grievances. It is one line long." },
        { by: "Kaelen", text: "He gave his own cloak to a sentry on the wall, one winter. The sentry was me. I still have it. I don't wear it." },
        { by: "The Ledger", text: "In the great hall, the floor is scored in a circle, as if a loom once stood there. Nobody sweeps inside the circle." },
        { by: "The King", text: "Is Kaelen still with you? Tell him the gate was open. It always was." }
      ]
    },
    wanderers: {
      "weeping-stag": {
        by: "The Ledger",
        text: "When the stag falls, its antlers set the nest of stars down very gently, as if handing it over. One star is missing."
      },
      "singing-geode": {
        by: "The Singing Geode",
        text: "Cé-les-tine. Cé-les-tine. Not here? Then we will hum it again tomorrow. Stones are good at tomorrow."
      },
      ferryman: {
        by: "The Ferryman",
        text: "Thank you. You have crossed. You will not notice the difference. Nobody ever does."
      },
      "court-jester": {
        by: "The Court Jester",
        text: "You again! Let me guess: you've come to kill the King. What a coincidence. So did everyone."
      }
    },
    places: {
      sanctum: {
        name: "The Sanctum of Dusk",
        description: "A circle of standing stones on a hill that is not there at night. The essences are counted here, and the stones keep what you give them."
      },
      loom: {
        name: "Eldra's Loom",
        description: "The Sanctum, unwoven to its threads. Eldra weaves the night again, one thread deeper, and keeps only what cannot be unwoven."
      },
      dawn: {
        name: "The Dawn",
        description: "The road ends here, against a line of pale light. It grows a little while you look at it."
      }
    }
  },
  fr: {
    biomes: {
      "green-plains": {
        name: "Plaines verdoyantes",
        description: "Les terres à blé d'Orvane. La dernière moisson n'a jamais été rentrée : les gerbes sont encore debout."
      },
      "dark-forest": {
        name: "Forêt sombre",
        description: "Le bois sacré du Bosquet, où l'on formait les druides. La nuit, les ronces murmurent des noms et poussent là où les marcheurs ont saigné."
      },
      "forgotten-caves": {
        name: "Cavernes oubliées",
        description: "Les mines de la Guilde des runes, creusées pour des étoiles tombées. La nuit, les rails luisent et les voix résonnent avant qu'on parle."
      },
      "corrupted-marsh": {
        name: "Marais corrompu",
        description: "Les tourbières asséchées du baron Osric, noyées la nuit où tout s'est arrêté. Le manoir s'enfonce d'un pouce chaque nuit."
      },
      "fallen-king-ruins": {
        name: "Ruines du roi déchu",
        description: "Le donjon royal d'Orvane. Les bannières ont perdu leurs couleurs, et le trône regarde la fenêtre, pas la porte."
      }
    },
    echoes: {
      "dark-forest": [
        { by: "Le Grand Livre", text: "Dans la forêt, les racines pendent des branches comme des cordes. Personne n'y est jamais descendu." },
        { by: "Ysolde", text: "Ne bouge pas. Cette chouette pose la même question depuis avant ma naissance. Surtout, n'y réponds pas." },
        { by: "Une ronce qui murmure", text: "Aldric. On connaît ce nom. Il a déjà saigné ici." },
        { by: "Le Grand Livre", text: "Une lanterne de druide pend à une branche basse, allumée. L'huile n'y a pas baissé depuis très longtemps." },
        { by: "Un champignon", text: "La. La. La. On y est presque, pour la chanson. Reviens demain l'écouter. Tu reviendras." },
        { by: "Séraphine", text: "J'ai demandé poliment aux racines, une fois. Elles s'en souviennent. Dans ce bois, il n'y a qu'elles pour se souvenir." },
        { by: "Le Grand Livre", text: "Nyx attend là où s'éteint la dernière lanterne de la route. Elle y était avant la lanterne." },
        { by: "Ysolde", text: "Les arbres m'ont montré ton corps, près de cette souche. Je suis allée voir. Personne. Pas cette nuit." },
        { by: "Le Grand Livre", text: "Les parents d'Ysolde sont entrés dans le bois de l'est l'année où il s'est tu. Aucune carte ne le montre plus." },
        { by: "Séraphine", text: "Le vieil arbre m'a appris chaque racine par son nom. Chaque nuit, je te mène à elle. Elle sait pourquoi. Moi aussi." },
        { by: "Le Grand Livre", text: "Quand le Cœur du vieux bosquet tombe, Nyx lève les yeux par la trouée des feuilles, comme on regarde chez soi." },
        { by: "Le Grand Livre", text: "On a compté les cernes de l'arbre-mère. Il y en a plus que le royaume n'a d'années." }
      ],
      "forgotten-caves": [
        { by: "Le Grand Livre", text: "Les rails sont encore éclairés de runes. Ils descendent, toujours plus bas, jusqu'où les wagonnets se sont arrêtés." },
        { by: "Garrick", text: "Attention à la goutte. Les sangsues la boivent. Ici, même l'eau arrive en retard." },
        { by: "Un wagonnet hanté", text: "Prochain arrêt, la surface. Prochain arrêt, la surface. Prochain arrêt." },
        { by: "Le Grand Livre", text: "Une voix crie au fond de la galerie : « À gauche ! » Quelque chose surgit à gauche. C'était la voix de Garrick. Garrick n'est pas encore là." },
        { by: "Thorvald", text: "J'ai abattu une montagne ici, une fois. Sur un pari. Perdu. Ne demande pas contre qui. Ne regarde pas le rat." },
        { by: "Garrick", text: "Le canari s'est tu, alors on est partis. Il chante de nouveau. Aucun de nous n'est revenu l'écouter." },
        { by: "Le Grand Livre", text: "Le tableau de la Guilde : éclats extraits, quarante ans de craie. Éclats tombés depuis : la craie a manqué." },
        { by: "Oriane", text: "Tu descends cette galerie. Tu t'arrêtes à la troisième rune. Tu t'arrêtes toujours à la troisième rune." },
        { by: "Garrick", text: "La plupart des éclats te renvoient ta tête. Certains me montrent plus jeune. J'ai arrêté de regarder. La roche se tait mieux que moi." },
        { by: "Thorvald", text: "Le Dévorateur a mangé une montagne pour atteindre le ciel. Il l'a trouvé. Il l'a pas digéré. Je connais ça." },
        { by: "Oriane", text: "Le caveau le plus profond est calme. D'ici, j'entends demain. Demain ressemble à ce soir." },
        { by: "Le Grand Livre", text: "La cellule d'Oriane a deux tabourets. Elle s'assied sur l'un et répond à l'autre." }
      ],
      "corrupted-marsh": [
        { by: "Le Grand Livre", text: "La chaussée passe sous l'eau et ressort plus loin. Les marcheurs ont appris à retenir leur souffle." },
        { by: "Mirelle", text: "Ne bois pas l'eau. Ne respire pas l'air. Ne fais pas cette tête. Le baron faisait cette tête." },
        { by: "Un feu follet", text: "Suis-moi. Suis-moi. Non, par là. Tout le monde finit par aller par là." },
        { by: "Le Grand Livre", text: "Le manoir d'Osric s'enfonce d'un pouce chaque nuit. La salle de bal est sous l'eau. Les bougies y sont allumées." },
        { by: "Un courtisan noyé", text: "Monseigneur va te recevoir sous peu. Monseigneur reçoit sous peu depuis très, très longtemps." },
        { by: "Vorn", text: "J'ai trouvé Biscuit par ici. Enfin. C'est lui qui m'a trouvé. Ne le caresse pas. Ne l'ignore pas non plus." },
        { by: "Un tourbier", text: "Couper la tourbe. Empiler la tourbe. Le baron voudra du feu ce soir. Le baron veut toujours du feu." },
        { by: "Mirelle", text: "Le remède de ce soir : belladone, sel, une cuillère de mon sang. Celui de demain : tout ce que celui-ci n'était pas." },
        { by: "Le Grand Livre", text: "Le marais avait été asséché pour la tourbe et le riz. L'eau est revenue en une seule nuit. Elle n'est jamais repartie." },
        { by: "Vorn", text: "Les bêtes sentent quand le temps va tourner. Les miennes attendent un changement depuis très longtemps. Elles sont patientes. Pas moi." },
        { by: "Mirelle", text: "L'anneau brille encore à sa main. L'or ne pourrit pas. Une promesse non plus, apparemment. Dommage." },
        { by: "Le Grand Livre", text: "Dans la chapelle de la dernière butte sèche, un registre des mariages. Dernière ligne : Osric, Mirelle. L'encre n'a pas séché." }
      ],
      "fallen-king-ruins": [
        { by: "Le Grand Livre", text: "Les bannières du donjon ont perdu leurs couleurs. Elles pendent encore bien droites, comme avant une revue." },
        { by: "Kaelen", text: "Les sentinelles me saluent. Je leur rends le salut. Ne me demande pas lequel de nous est le fantôme." },
        { by: "Une servante aux chandelles", text: "Le dîner est servi. Le dîner est servi. S'il vous plaît. Quelqu'un. Le dîner est servi." },
        { by: "Morgrath", text: "J'attendrai dehors. Non, je n'entrerai pas. J'ai des principes, et lui a un trône." },
        { by: "Le Grand Livre", text: "Un limier de la dernière chasse flaire les dalles près de la porte. La piste qu'il suit mène dehors. C'est la seule." },
        { by: "Le Grand Livre", text: "Le Sans-Nom s'arrête à la porte de la grande salle, comme on s'arrête devant une maison où l'on a vécu. Puis il entre." },
        { by: "Kaelen", text: "La troisième marche bouge. Il disait toujours qu'il la ferait réparer. Il le disait en l'enjambant." },
        { by: "Le Roi", text: "J'ai fait tourner le trône vers la fenêtre. Un roi doit voir ce qui vient." },
        { by: "Morgrath", text: "Il m'a volé le matin. Pas un matin. Le matin. Je tiens la liste de mes griefs. Elle fait une ligne." },
        { by: "Kaelen", text: "Un hiver, il a donné son propre manteau à une sentinelle sur le rempart. La sentinelle, c'était moi. Je l'ai gardé. Je ne le porte pas." },
        { by: "Le Grand Livre", text: "Dans la grande salle, le sol est rayé en cercle, comme si un métier à tisser s'y était dressé. Personne ne balaie dans le cercle." },
        { by: "Le Roi", text: "Kaelen est toujours avec toi ? Dis-lui que la porte était ouverte. Elle l'a toujours été." }
      ]
    },
    wanderers: {
      "weeping-stag": {
        by: "Le Grand Livre",
        text: "Quand le cerf tombe, ses bois déposent le nid d'étoiles tout doucement, comme on confie quelque chose. Il manque une étoile."
      },
      "singing-geode": {
        by: "La Géode chantante",
        text: "Cé-les-tine. Cé-les-tine. Pas encore là ? Alors on la fredonnera demain. Les pierres sont douées pour demain."
      },
      ferryman: {
        by: "Le Passeur",
        text: "Merci. Tu as traversé. Tu ne verras pas la différence. Personne ne la voit jamais."
      },
      "court-jester": {
        by: "Le Bouffon de la cour",
        text: "Encore toi ! Laisse-moi deviner : tu viens tuer le roi. Quelle coïncidence. Tout le monde aussi."
      }
    },
    places: {
      sanctum: {
        name: "Le Sanctuaire du Crépuscule",
        description: "Un cercle de pierres levées sur une colline qui n'existe pas la nuit. On y compte les essences, et les pierres gardent ce que tu leur donnes."
      },
      loom: {
        name: "Le Métier d'Eldra",
        description: "Le Sanctuaire, défait jusqu'au fil. Eldra retisse la nuit, un fil plus bas, et ne garde que ce qui ne se défait pas."
      },
      dawn: {
        name: "L'Aube",
        description: "La route s'arrête ici, contre une ligne de lumière pâle. Elle grandit un peu pendant que tu la regardes."
      }
    }
  }
};
