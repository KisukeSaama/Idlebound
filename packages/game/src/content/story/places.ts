import type { Locale } from "../../i18n";
import type { PlacesText } from "../types";

/**
 * The five places of the road (BIBLE 7), their echoes (12 per biome, one per guardian first
 * clear, in order), the fragments left by the rare wanderers, and the three places outside
 * the road: the Sanctum of Dusk, Eldra's Loom and the Dawn. Each says what the place was and
 * what happened there; the later echoes of a biome come deeper in the night, and say more.
 */
export const PLACES_TEXT: Record<Locale, PlacesText> = {
  en: {
    biomes: {
      "green-plains": {
        name: "Verdant Plains",
        description: "Orvane's farmland. The night fell before the last harvest was brought in, and never lifted: the sheaves still stand."
      },
      "dark-forest": {
        name: "Dark Forest",
        description: "The Grove's sacred wood, where Orvane's druids were trained. Its brambles whisper the name of every walker who bled on them."
      },
      "forgotten-caves": {
        name: "Forgotten Caves",
        description: "The Runeguild's mines, dug for shards of sky that fell into the mountain. The miners fled long ago. Their carts still run."
      },
      "corrupted-marsh": {
        name: "Corrupted Marsh",
        description: "Baron Osric's fens, drained for peat and rice, flooded on the night the Long Night began. His manor sinks an inch a night."
      },
      "fallen-king-ruins": {
        name: "Fallen King's Ruins",
        description: "The royal keep of Orvane, where the Fallen King waits on his throne. Every night of the road ends here, in front of him."
      }
    },
    echoes: {
      "dark-forest": [
        { by: "The Ledger", text: "In the Wychwood, roots hang from the branches like ropes. The druids trained the trees to grow that way, for climbing." },
        { by: "Ysolde", text: "Stand still. That owl has asked the same question since before I was born. Whatever you do, don't answer it." },
        { by: "A whispering bramble", text: "Aldric. We know that name. Many walkers who carried it have bled on our thorns before you." },
        { by: "The Ledger", text: "A druid's lantern hangs from a low branch, still lit. Nobody has filled it since the night began. It does not need it." },
        { by: "A toadstool", text: "La. La. La. We have nearly learned the song. Come back tomorrow night and hear it. Everyone comes back." },
        { by: "Séraphine", text: "I trained in this wood, under the old mother-tree. I asked the roots nicely, once. They still obey me." },
        { by: "The Ledger", text: "Nyx is always first seen at the Wychwood's edge, where the road's last lantern goes out. Nobody has seen her arrive." },
        { by: "Ysolde", text: "The trees show me other nights. In one of them, you fell by that stump. Tonight you didn't. Keep it that way." },
        { by: "The Ledger", text: "Ysolde's parents walked into the east wood the year it vanished into the Void. Séraphine raised her after that." },
        { by: "Séraphine", text: "The old tree taught me every root by name. She was kind, before the long night soured her. I still bring you to her." },
        { by: "The Ledger", text: "When the Heart of the Old Grove falls, Nyx looks up at the night sky through the gap in the leaves, as if at home." },
        { by: "The Ledger", text: "The mother-tree's rings were counted: more rings than Orvane has years. She has grown through every repeated night." }
      ],
      "forgotten-caves": [
        { by: "The Ledger", text: "The Deepvaults were the Runeguild's mines. Their rails are still lit with runes, down to where the carts stopped." },
        { by: "Garrick", text: "Mind the drip, the leeches drink it. I dig here for fallen stars: shards of the sky. The Stallkeeper pays well." },
        { by: "A haunted cart", text: "Next stop, the surface. Next stop, the surface. Next stop." },
        { by: "The Ledger", text: "A voice down the gallery shouts \"Left!\" and something comes from the left. It was Garrick's voice, from another night." },
        { by: "Thorvald", text: "I felled a mountain here once, on a bet. Lost the bet anyway. Don't ask who with. Don't look at the golden rat." },
        { by: "Garrick", text: "The canary went quiet, so we miners left. It sings again now. None of us came back to hear it." },
        { by: "The Ledger", text: "The Runeguild's tally board: forty years of shards dug, in chalk. Shards fallen from the sky since: the chalk ran out." },
        { by: "Oriane", text: "I hear what these caves said on other nights. You come down this gallery and stop at the third rune. You always do." },
        { by: "Garrick", text: "Polish a shard and you see your face in it. Some show mine, younger, from nights I don't remember. I stopped polishing." },
        { by: "Thorvald", text: "The Devourer ate a mountain to reach the fallen sky. Found it. Couldn't keep it down. I know the feeling." },
        { by: "Oriane", text: "The deepest vault is quiet. From here I can hear tomorrow night. It sounds exactly like tonight." },
        { by: "The Ledger", text: "Oriane's cell has two stools. She sits on one and answers the other: she hears questions before anyone asks them." }
      ],
      "corrupted-marsh": [
        { by: "The Ledger", text: "The causeway goes under the water and comes up again further on. Walkers in the Mire learn to hold their breath." },
        { by: "Mirelle", text: "Don't drink the water. Don't breathe the air. Don't make that face. The Baron made that face." },
        { by: "A will-o'-wisp", text: "Follow me. Follow me. No, the other way. Everyone goes the other way, in the end." },
        { by: "The Ledger", text: "Osric's manor sinks an inch a night. The ballroom is underwater now, and its candles are still lit." },
        { by: "A drowned courtier", text: "His lordship will see you shortly. His lordship has been seeing people shortly for a very long time." },
        { by: "Vorn", text: "Found Biscuit near here. Well. Biscuit found me. Don't pet him. Don't not pet him, either." },
        { by: "A peat cutter", text: "Cut the peat. Stack the peat. The Baron will want a fire tonight. The Baron always wants a fire." },
        { by: "Mirelle", text: "Tonight's cure for the Baron: nightshade, salt, a spoon of my own blood. Tomorrow's: whatever tonight's wasn't." },
        { by: "The Ledger", text: "The Mire was drained for peat and rice. The water came back in a single night, the first of the Long Night." },
        { by: "Vorn", text: "Beasts know when the weather will turn. Mine have waited for morning a very long time. They're patient. I'm not." },
        { by: "Mirelle", text: "Osric is my husband. That ring is the one I gave him. Gold doesn't rot. Neither does a promise, it turns out." },
        { by: "The Ledger", text: "In the chapel on the last dry hill, a wedding register. The last entry: Osric, Mirelle. The ink is still wet." }
      ],
      "fallen-king-ruins": [
        { by: "The Ledger", text: "The keep's banners lost their colors in the Pale Year. They still hang straight, as if the King might inspect them." },
        { by: "Kaelen", text: "I was the King's knight. His sentinels still salute me, and I salute back. Don't ask which of us is the ghost." },
        { by: "A candle maid", text: "Dinner is served. Dinner is served. Please. Someone. Dinner is served." },
        { by: "Morgrath", text: "I'll wait outside. I do not enter the house of the man who stole the Morning. I have standards." },
        { by: "The Ledger", text: "The hounds of the last hunt still follow a scent out of the keep. Someone ran from here, the night the Long Night began." },
        { by: "The Ledger", text: "The Nameless always stops at the great hall's door, as if he knew the room. He has faced its King more than anyone." },
        { by: "Kaelen", text: "The third step is loose. The King always said he'd have it fixed. He always said it while stepping over it." },
        { by: "The King", text: "I had the throne turned to face the window, to see the Morning coming. A king should see what is coming." },
        { by: "Morgrath", text: "He stole the Morning, the end every night is owed. From me, its steward. My list of grievances is one line long." },
        { by: "Kaelen", text: "One winter he gave his own cloak to a sentry on the wall. The sentry was me. I still have it. I don't wear it." },
        { by: "The Ledger", text: "The great hall's floor is scored in a circle where Eldra's loom stood when she wove the Long Night. Nobody sweeps it." },
        { by: "The King", text: "Is Kaelen still with you? He ran, the night I needed him, and I walked in his place. Tell him I was glad to." }
      ]
    },
    wanderers: {
      "weeping-stag": {
        by: "The Ledger",
        text: "When the stag falls, it sets its nest of fallen stars down very gently, as if handing it to you. One star is missing."
      },
      "singing-geode": {
        by: "The Singing Geode",
        text: "Cé-les-tine. Cé-les-tine. She is not with you yet? Then we will hum her name again tomorrow. Stones are patient."
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
        description: "A circle of standing stones on a hill that exists only between nights. Your essences are counted here, and the altars keep what you give them."
      },
      loom: {
        name: "Eldra's Loom",
        description: "The loom where Eldra wove the Long Night. She unravels the Sanctum and weaves the night again one thread deeper, keeping only what cannot be undone."
      },
      dawn: {
        name: "The Dawn",
        description: "The end of the road: a line of pale light where the Morning begins. It grows a little while you look at it."
      }
    }
  },
  fr: {
    biomes: {
      "green-plains": {
        name: "Plaines verdoyantes",
        description: "Les terres à blé d'Orvane. La nuit est tombée avant la dernière moisson, et ne s'est jamais levée : les gerbes sont encore debout."
      },
      "dark-forest": {
        name: "Forêt sombre",
        description: "Le bois sacré du Bosquet, où l'on formait les druides d'Orvane. Ses ronces murmurent le nom de chaque marcheur qui y a saigné."
      },
      "forgotten-caves": {
        name: "Cavernes oubliées",
        description: "Les mines de la Guilde des runes, creusées pour les éclats de ciel tombés dans la montagne. Les mineurs ont fui. Les wagonnets roulent encore."
      },
      "corrupted-marsh": {
        name: "Marais corrompu",
        description: "Les tourbières du baron Osric, asséchées pour la tourbe et le riz, noyées la nuit où la Longue Nuit a commencé. Son manoir s'enfonce chaque nuit."
      },
      "fallen-king-ruins": {
        name: "Ruines du roi déchu",
        description: "Le donjon royal d'Orvane, où le roi déchu attend sur son trône. Chaque nuit de la route finit ici, devant lui."
      }
    },
    echoes: {
      "dark-forest": [
        { by: "Le Grand Livre", text: "Dans la forêt, les racines pendent des branches comme des cordes. Les druides dressaient les arbres ainsi, pour grimper." },
        { by: "Ysolde", text: "Ne bouge pas. Cette chouette pose la même question depuis avant ma naissance. Surtout, n'y réponds pas." },
        { by: "Une ronce qui murmure", text: "Aldric. On connaît ce nom. Bien des marcheurs qui le portaient ont saigné sur nos épines avant toi." },
        { by: "Le Grand Livre", text: "Une lanterne de druide pend à une branche basse, allumée. Personne ne l'a remplie depuis le début de la nuit. Inutile." },
        { by: "Un champignon", text: "La. La. La. On a presque appris la chanson. Reviens l'écouter demain soir. Tout le monde revient." },
        { by: "Séraphine", text: "J'ai été formée dans ce bois, sous le vieil arbre-mère. J'ai demandé poliment aux racines, une fois. Elles m'obéissent encore." },
        { by: "Le Grand Livre", text: "On voit toujours Nyx pour la première fois à l'orée du Bois, là où s'éteint la dernière lanterne. Personne ne l'a vue arriver." },
        { by: "Ysolde", text: "Les arbres me montrent d'autres nuits. Dans l'une, tu tombais près de cette souche. Pas ce soir. Continue comme ça." },
        { by: "Le Grand Livre", text: "Les parents d'Ysolde sont entrés dans le bois de l'est l'année où il a sombré dans le Néant. Séraphine l'a élevée ensuite." },
        { by: "Séraphine", text: "Le vieil arbre m'a appris chaque racine par son nom. Elle était bonne, avant que la longue nuit l'aigrisse. Je te mène encore à elle." },
        { by: "Le Grand Livre", text: "Quand le Cœur du vieux bosquet tombe, Nyx lève les yeux vers le ciel nocturne, par la trouée des feuilles, comme on regarde chez soi." },
        { by: "Le Grand Livre", text: "On a compté les cernes de l'arbre-mère : plus qu'Orvane n'a d'années. Elle a poussé à travers chaque nuit recommencée." }
      ],
      "forgotten-caves": [
        { by: "Le Grand Livre", text: "Les cavernes étaient les mines de la Guilde des runes. Leurs rails luisent encore de runes, jusqu'où les wagonnets se sont arrêtés." },
        { by: "Garrick", text: "Attention à la goutte, les sangsues la boivent. Moi, je creuse pour des étoiles tombées : des éclats de ciel. Le Comptoir paie bien." },
        { by: "Un wagonnet hanté", text: "Prochain arrêt, la surface. Prochain arrêt, la surface. Prochain arrêt." },
        { by: "Le Grand Livre", text: "Une voix crie « À gauche ! » au fond de la galerie, et quelque chose surgit à gauche. C'était la voix de Garrick, d'une autre nuit." },
        { by: "Thorvald", text: "J'ai abattu une montagne ici, une fois, sur un pari. Perdu quand même. Ne demande pas contre qui. Ne regarde pas le rat doré." },
        { by: "Garrick", text: "Le canari s'est tu, alors nous, les mineurs, on est partis. Il chante de nouveau. Aucun de nous n'est revenu l'écouter." },
        { by: "Le Grand Livre", text: "Le tableau de la Guilde : quarante ans d'éclats extraits, à la craie. Éclats tombés du ciel depuis : la craie a manqué." },
        { by: "Oriane", text: "J'entends ce que ces caves ont dit d'autres nuits. Tu descends cette galerie et tu t'arrêtes à la troisième rune. Toujours." },
        { by: "Garrick", text: "Polis un éclat, tu y vois ta tête. Certains me montrent plus jeune, d'une nuit dont je ne me souviens pas. J'ai arrêté de polir." },
        { by: "Thorvald", text: "Le Dévorateur a mangé une montagne pour atteindre le ciel tombé. Il l'a trouvé. Il l'a pas digéré. Je connais ça." },
        { by: "Oriane", text: "Le caveau le plus profond est calme. D'ici, j'entends la nuit de demain. Elle ressemble trait pour trait à celle-ci." },
        { by: "Le Grand Livre", text: "La cellule d'Oriane a deux tabourets. Elle s'assied sur l'un et répond à l'autre : elle entend les questions avant qu'on les pose." }
      ],
      "corrupted-marsh": [
        { by: "Le Grand Livre", text: "La chaussée passe sous l'eau et ressort plus loin. Dans le marais, les marcheurs apprennent à retenir leur souffle." },
        { by: "Mirelle", text: "Ne bois pas l'eau. Ne respire pas l'air. Ne fais pas cette tête. Le baron faisait cette tête." },
        { by: "Un feu follet", text: "Suis-moi. Suis-moi. Non, par là. Tout le monde finit par aller par là." },
        { by: "Le Grand Livre", text: "Le manoir d'Osric s'enfonce d'un pouce chaque nuit. La salle de bal est sous l'eau, et ses bougies brûlent encore." },
        { by: "Un courtisan noyé", text: "Monseigneur va te recevoir sous peu. Monseigneur reçoit sous peu depuis très, très longtemps." },
        { by: "Vorn", text: "J'ai trouvé Biscuit par ici. Enfin. C'est lui qui m'a trouvé. Ne le caresse pas. Ne l'ignore pas non plus." },
        { by: "Un tourbier", text: "Couper la tourbe. Empiler la tourbe. Le baron voudra du feu ce soir. Le baron veut toujours du feu." },
        { by: "Mirelle", text: "Le remède de ce soir pour le baron : belladone, sel, une cuillère de mon sang. Celui de demain : tout ce que celui-ci n'était pas." },
        { by: "Le Grand Livre", text: "Le marais avait été asséché pour la tourbe et le riz. L'eau est revenue en une seule nuit, la première de la Longue Nuit." },
        { by: "Vorn", text: "Les bêtes sentent quand le temps va tourner. Les miennes attendent le matin depuis très longtemps. Elles sont patientes. Pas moi." },
        { by: "Mirelle", text: "Osric est mon mari. Cet anneau, c'est moi qui le lui ai donné. L'or ne pourrit pas. Une promesse non plus, apparemment." },
        { by: "Le Grand Livre", text: "Dans la chapelle de la dernière butte sèche, un registre des mariages. Dernière ligne : Osric, Mirelle. L'encre n'a pas séché." }
      ],
      "fallen-king-ruins": [
        { by: "Le Grand Livre", text: "Les bannières du donjon ont perdu leurs couleurs pendant l'Année pâle. Elles pendent encore bien droites, prêtes pour une revue." },
        { by: "Kaelen", text: "J'étais le chevalier du roi. Ses sentinelles me saluent encore, et je leur rends le salut. Ne demande pas lequel de nous est le fantôme." },
        { by: "Une servante aux chandelles", text: "Le dîner est servi. Le dîner est servi. S'il vous plaît. Quelqu'un. Le dîner est servi." },
        { by: "Morgrath", text: "J'attendrai dehors. Je n'entre pas chez l'homme qui a volé le Matin. J'ai des principes." },
        { by: "Le Grand Livre", text: "Les limiers de la dernière chasse suivent encore une piste hors du donjon. Quelqu'un a fui d'ici, la nuit où la Longue Nuit a commencé." },
        { by: "Le Grand Livre", text: "Le Sans-Nom s'arrête toujours à la porte de la grande salle, comme s'il connaissait la pièce. Nul n'a affronté son roi plus que lui." },
        { by: "Kaelen", text: "La troisième marche bouge. Le roi disait toujours qu'il la ferait réparer. Il le disait en l'enjambant." },
        { by: "Le Roi", text: "J'ai fait tourner le trône vers la fenêtre, pour voir venir le Matin. Un roi doit voir ce qui vient." },
        { by: "Morgrath", text: "Il a volé le Matin, la fin que chaque nuit doit. À moi, son intendant. Ma liste de griefs fait une ligne." },
        { by: "Kaelen", text: "Un hiver, il a donné son propre manteau à une sentinelle sur le rempart. La sentinelle, c'était moi. Je l'ai gardé. Je ne le porte pas." },
        { by: "Le Grand Livre", text: "Le sol de la grande salle est rayé en cercle, là où se dressait le métier d'Eldra quand elle a tissé la Longue Nuit. Personne n'y balaie." },
        { by: "Le Roi", text: "Kaelen est toujours avec toi ? Il a fui, la nuit où j'avais besoin de lui, et j'ai marché à sa place. Dis-lui que je l'ai fait de bon cœur." }
      ]
    },
    wanderers: {
      "weeping-stag": {
        by: "Le Grand Livre",
        text: "Quand le cerf tombe, il dépose son nid d'étoiles tout doucement, comme s'il te le confiait. Il manque une étoile."
      },
      "singing-geode": {
        by: "La Géode chantante",
        text: "Cé-les-tine. Cé-les-tine. Elle n'est pas encore avec toi ? Alors on fredonnera son nom demain. Les pierres sont patientes."
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
        description: "Un cercle de pierres levées sur une colline qui n'existe qu'entre deux nuits. On y compte tes essences, et les autels gardent ce que tu leur donnes."
      },
      loom: {
        name: "Le Métier d'Eldra",
        description: "Le métier où Eldra a tissé la Longue Nuit. Elle défait le Sanctuaire et retisse la nuit un fil plus bas, en ne gardant que ce qui ne se défait pas."
      },
      dawn: {
        name: "L'Aube",
        description: "Le bout de la route : une ligne de lumière pâle, là où commence le Matin. Elle grandit un peu pendant que tu la regardes."
      }
    }
  }
};
