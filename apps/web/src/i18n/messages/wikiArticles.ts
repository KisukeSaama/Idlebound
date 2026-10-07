import type { TopicId } from "@/wiki/catalog";
import type { Article } from "@/wiki/article";
import type { Facts } from "@/wiki/facts";
import { defineMessages } from "../define";

type Articles = Record<TopicId, (f: Facts) => Article>;

const fr = (value: number) => value.toLocaleString("fr-FR");
const en = (value: number) => value.toLocaleString("en-US");

/**
 * The wiki's articles (/[locale]/wiki/<topic>), one per topic. Every figure that the game
 * data holds comes in through `f` (see `wiki/facts.ts`); tables are drawn by the pages in
 * place of the `{ slot }` blocks.
 */
export const wikiArticles = defineMessages<Articles>({
  fr: {
    "getting-started": (f) => ({
      lead: "Idlebound se prend en main en dix secondes et se creuse pendant des semaines. Voici, dans l'ordre, ce qui t'attend et ce qu'il vaut mieux savoir à chaque étape.",
      sections: [
        {
          id: "idea",
          title: "L'idée en une minute",
          blocks: [
            "Tu es **Aldric**, un marcheur pris dans la Longue Nuit. Devant toi, une route de monstres, les **Vestiges**. Tu les frappes, ils lâchent de l'or. Avec cet or, tu recrutes des **compagnons** qui frappent à ta place, sans jamais s'arrêter, même quand tu fais autre chose.",
            `La route est faite d'**étapes** : ${f.monstersPerStage} monstres à vaincre par étape, et un boss toutes les 5 étapes. Au bout de l'étape 50 attend le **Roi déchu**. Quand il tombe, tu peux faire ton **ascension** : tout recommencer depuis l'étape 1, mais avec des **essences** qui rendent chaque nuit suivante plus forte.`,
            "C'est tout le cœur du jeu : frapper, recruter, avancer, recommencer plus fort. Le reste (reliques, autels, promesses, Descente) vient s'y ajouter petit à petit, quand tu en as besoin. L'interface ne montre d'ailleurs chaque chose qu'au moment où tu peux t'en servir."
          ]
        },
        {
          id: "first-minutes",
          title: "Les dix premières minutes",
          blocks: [
            {
              steps: [
                "Frappe le monstre (souris, toucher, ou Entrée/Espace quand la scène a le focus). Chaque monstre vaincu donne de l'or.",
                "Monte le niveau d'**Aldric** quelques fois : ses niveaux augmentent tes dégâts de frappe. Au niveau 10, son premier talent double ta frappe et débloque la **Frénésie** (touche 1).",
                "Dès que tu as 50 pièces d'or, recrute **Maëlle**. C'est ta première compagne : elle frappe toute seule, chaque seconde.",
                "Recrute ensuite chaque compagnon dès qu'il apparaît (le suivant se dévoile quand le précédent a rejoint la compagnie), et monte leurs niveaux. Vise les paliers 10 et 25 : chacun double leurs dégâts.",
                "Avance d'étape en étape. L'Auto est activé par défaut : dès que tu as vaincu 10 monstres, tu passes à l'étape suivante."
              ]
            },
            { tip: "Le bouton **×1 / ×10 / ×25 / ×100 / Max** en haut du panneau des compagnons achète plusieurs niveaux d'un coup. **Max** est presque toujours le bon choix au début." }
          ]
        },
        {
          id: "first-boss",
          title: "Ton premier boss",
          blocks: [
            `À l'étape 5, une **élite** (6 fois les PV d'un monstre normal). À l'étape 10, le **gardien** du biome (10 fois les PV). Tu as ${f.bossTimer} secondes pour le vaincre.`,
            "Si le temps s'écoule, tu recules d'une étape et l'Auto se met en pause : c'est le mode **Rester**. Tu continues de gagner de l'or sur l'étape d'avant. Renforce tes compagnons, puis appuie sur **Auto** pour retenter.",
            `Bonne nouvelle : jusqu'à l'étape ${f.woundLastStage}, un boss **garde ses blessures**. Les dégâts que tu lui as faits restent sur lui (jusqu'à ${f.woundCapPct} % de ses PV) quand tu reviens. Insiste, il finit par tomber.`,
            { tip: "Lance tes pouvoirs juste au début d'un combat de boss, pas avant : leurs 30 secondes couvrent alors tout le chronomètre." }
          ]
        },
        {
          id: "first-hour",
          title: "La première heure",
          blocks: [
            "Les étapes se suivent par biomes de 10 : les Plaines verdoyantes (1 à 10), la Forêt sombre (11 à 20), les Cavernes oubliées (21 à 30), le Marais corrompu (31 à 40) et les Ruines du roi déchu (41 à 50).",
            {
              list: [
                "**Les cristaux errants** apparaissent de temps en temps sur la scène, environ toutes les 1,5 à 4 minutes. Attrape-les : or, dégâts ×7, frappe ×10, éclats. Ils ne restent que 13 secondes.",
                `**Le rat doré** (${f.treasurePct} % des monstres) vaut 10 fois l'or d'un monstre normal.`,
                "**Les reliques** tombent des gardiens (40 %, garanti la première fois) et des élites (15 %). Une relique trouvée va directement dans un emplacement vide.",
                "**Les pouvoirs** se débloquent au niveau 25 de Maëlle, Ysolde, Frère Cendre, Nyx et Garrick. Utilise-les dès qu'ils sont prêts."
              ]
            },
            "Au fil de la première heure, tes frappes comptent de moins en moins face à ta compagnie. C'est voulu : plus tard, ce sont les compagnons qui portent la nuit. Tu n'as jamais besoin de frapper frénétiquement."
          ]
        },
        {
          id: "first-ascension",
          title: "Ta première ascension (vers 3 h de jeu)",
          blocks: [
            `Le Roi déchu garde l'étape 50. Une fois qu'il est tombé (étape ${f.ascensionStage} atteinte), le **Sanctuaire du Crépuscule** s'ouvre : c'est l'ascension.`,
            "Tu recommences à l'étape 1. Tu perds ton or, les niveaux et talents de tes compagnons, et ta progression d'étapes. Tu gardes tes essences, tes autels, tes reliques, tes éclats, tes hauts faits et tes records.",
            `Chaque essence gardée en main donne **+${f.essenceDpsPct} % de DPS**. Tu peux aussi les offrir aux **autels**, pour des bonus permanents. La règle d'or : garde à peu près la moitié de tes essences en main, et offre l'autre moitié.`,
            "Ne te presse pas : avance un peu au-delà de l'étape 50 pour récolter plus d'essences (la première ascension en paie 65 à l'étape 60, 71 une fois l'étape 60 franchie). Mais n'attends pas des heures devant un mur : l'ascension est faite pour être répétée. Quand ta progression s'arrête, fais-la.",
            { warn: "Ne dépense jamais toutes tes essences aux autels : une essence offerte perd ses +10 % de DPS. Un autel ne vaut le coup que s'il rapporte plus que ce qu'il coûte en essences gardées." }
          ]
        },
        {
          id: "after",
          title: "Et ensuite ?",
          blocks: [
            {
              list: [
                "Chaque nuit va plus loin que la précédente. Toutes les 50 étapes commence une nouvelle **strate**, aux monstres plus coriaces et à l'apparence transformée. Il y en a 60, regroupées en 12 Âges.",
                "Vers la quatrième nuit, un compagnon qui commence à se souvenir de toi te demandera ta **parole** pour la nuit : c'est [la Promesse](promise). Tiens-la, et ses dégâts doublent pour toujours.",
                "Avec les éclats gagnés sur les gardiens, [forge tes reliques](relics#forge) et passe à l'[étal du Comptoir](relics#market).",
                "Laisse la page ouverte quand tu travailles : ta compagnie avance seule, et même jeu fermé, elle rattrape jusqu'à 8 heures. Voir [Jouer en arrière-plan](idle).",
                `Très loin, à l'étape ${fr(f.descentStage)}, s'ouvre [la Descente](descent), la seconde renaissance.`
              ]
            }
          ]
        }
      ]
    }),
    faq: () => ({
      lead: "Les questions qu'on se pose tous les premiers jours, et les réponses courtes.",
      sections: [
        { id: "free", title: "Faut-il frapper sans arrêt ?", blocks: ["Non. Tes frappes portent le tout début de chaque nuit, puis tes compagnons prennent le relais. Ils frappent même quand la page est en arrière-plan. Ta présence ajoute ce que seule une main peut faire : attraper les cristaux, lancer les pouvoirs, faire l'ascension, gérer l'équipement."] },
        { id: "who-to-level", title: "Quel compagnon monter en priorité ?", blocks: ["Le plus récent, presque toujours : chaque compagnon fait bien plus de dégâts que le précédent. Monte-le jusqu'à son prochain palier (10, 25, 50, 100, 150, puis tous les 25 niveaux à partir de 200), achète le talent, et recommence. Un compagnon arrêté entre deux paliers gaspille de l'or.", { tip: "Le bouton **Max** montre combien de niveaux tu peux t'offrir. Viser le palier suivant vaut presque toujours mieux que saupoudrer." }] },
        { id: "stuck", title: "Je suis bloqué devant un boss, que faire ?", blocks: [{ list: ["Laisse le mode **Rester** tourner un moment : tu gagnes de l'or sur l'étape d'avant et tes compagnons montent.", "Lance tes pouvoirs au début du combat (Cri de ralliement surtout).", "Jusqu'à l'étape 44, chaque tentative laisse des blessures au boss : réessaie.", "Après la première ascension : si un mur ne cède pas en 20 minutes, fais ton ascension. C'est plus rapide que d'insister."] }] },
        { id: "when-ascend", title: "Quand faire mon ascension ?", blocks: ["Quand ta progression s'arrête. Les simulations sont claires : ascensionner quelques minutes après ta dernière nouvelle étape va bien plus loin qu'attendre une heure devant un mur. Les essences augmentent avec l'étape la plus loin franchie, mais moins vite que les PV des monstres : pousser un peu paie, camper des heures non."] },
        { id: "which-altar", title: "Quels autels acheter ?", blocks: ["Ceux qui suivent ton style. Si tu laisses surtout tourner le jeu, l'**Autel de la patience** est le meilleur. Si tes frappes font l'essentiel de tes dégâts, l'**Autel de la lame**. Entre les deux, **puissance** et **fortune**. Ensuite, les autels plafonnés (temps, trésor, marchandage…) s'ouvrent à la troisième puis à la cinquième nuit. Et garde toujours environ la moitié de tes essences en main. Détails dans [Ascension et autels](ascension#strategy)."] },
        { id: "relic-choice", title: "Quelle relique porter ?", blocks: ["Regarde le chiffre **Compagnie ×N** de chaque relique : c'est ce qu'elle multiplie dans les dégâts de ta compagnie, comparé à l'emplacement vide. Plus il est grand, mieux c'est. Les reliques trouvées dans les strates profondes ont de la **Densité** : chaque strate sous la nuit présente ajoute ×1,03 aux dégâts de la compagnie."] },
        { id: "shards", title: "À quoi servent les éclats ?", blocks: ["À forger tes reliques (jusqu'à +20) et à acheter à l'étal du Comptoir : coffres, potions, sabliers. Tu en gagnes sur les gardiens, les cristaux et en recyclant les reliques dont tu n'as plus besoin. Le **Sablier doré** (une heure d'or tout de suite) est l'achat le plus rentable au début d'une nuit."] },
        { id: "lost", title: "Vais-je perdre ma partie ?", blocks: ["Non. Elle est gardée sur le serveur, même sans compte : ton navigateur la retrouve pendant 30 jours après ta dernière visite. Crée un compte pour la garder pour toujours et sur tous tes appareils. Voir [Compte et partie gardée](account)."] },
        { id: "cheat", title: "Peut-on tricher ?", blocks: ["Le serveur vérifie chaque partie envoyée avec le même moteur que le jeu : or gagné, temps joué, boss battables, butin. Une partie impossible est refusée. Le classement ne montre que des parties vérifiées."] },
        { id: "mistakes", title: "Les erreurs de débutant", blocks: [{ list: ["Dépenser toutes ses essences aux autels.", "Camper des heures devant un mur au lieu de faire son ascension.", "Laisser un compagnon juste sous un palier (niveau 24, 49, 99…).", "Oublier d'acheter les talents : ils doublent ou quadruplent les dégâts.", "Garder des reliques communes au lieu de les recycler en éclats.", "Ignorer les cristaux : une surcharge ×7 ou une frappe ×10 au bon moment fait tomber un boss."] }] }
      ]
    }),
    calculator: (f) => ({
      lead: "Entre une étape, aussi profonde que tu veux : le calculateur te dit ce qui t'y attend, avec les formules du jeu lui-même.",
      sections: [
        { id: "tool", title: "Le calculateur", blocks: [{ slot: "calculator" }] },
        {
          id: "formulas",
          title: "Comment c'est calculé",
          blocks: [
            "Les **PV** suivent une courbe en trois segments : très raide au début, puis ×1,15 par étape, puis ×1,18 par étape. L'élite (toutes les 5 étapes) a 6 fois les PV d'un Vestige, le gardien (toutes les 10 étapes) 10 fois.",
            "L'**or** d'un monstre vaut 1/30 de ses PV (le double à l'étape 1, l'écart se résorbant jusqu'à l'étape 10). Tes bonus d'or (Autel de fortune, talents, reliques, Bestiaire) s'y ajoutent.",
            "Les **essences** d'une ascension dépendent de l'étape la plus loin franchie pendant la nuit : 20 × 1,075 par étape au-delà de 50, jusqu'à l'étape 140, puis +2 % par étape, plus 3 par étape au-delà de 50. L'Autel de la récolte, la Chaîne d'abondance et certaines reliques les multiplient.",
            `Les **fils** de la Descente : 2 à l'étape 1 000, deux fois plus à chaque Âge (250 étapes), 32 à l'étape ${fr(f.descentStage)}.`
          ]
        }
      ]
    }),
    combat: (f) => ({
      lead: "Comment se gagne un combat, ce que valent tes frappes et ce que cache chaque étape de la route.",
      sections: [
        {
          id: "strikes",
          title: "Frappes et coups critiques",
          blocks: [
            `Chaque frappe inflige tes **dégâts de frappe** au monstre. Un **coup critique** multiplie ces dégâts par ${f.crit} (les talents du niveau 50 de Nyx et Lysandre ajoutent +3 et +5 à ce multiplicateur, l'Autel du destin +20 % par niveau). Les coups critiques ne concernent que les frappes, jamais les compagnons.`,
            "Tes dégâts de frappe = les dégâts propres d'Aldric (ses niveaux, ses talents, tes reliques de frappe, la moitié du bonus des hauts faits) + une **part du DPS de ta compagnie** (1 %, 1 % et 0,4 % avec les talents d'Aldric aux niveaux 25, 100 et 200), le tout multiplié par l'Autel de la lame.",
            "Les dégâts propres d'Aldric s'effacent après les premières étapes : plus tard, une frappe vaut surtout sa part du DPS, multipliée par les critiques et la Lame."
          ]
        },
        {
          id: "patience",
          title: "Le bonus de Patience",
          blocks: [
            "Tes compagnons frappent plus fort grâce au **bonus de Patience**, toujours actif, que tu sois là ou non. La Veille de la sentinelle (Kaelen niveau 50, +50 %), la Légion silencieuse (Morgrath niveau 50, +100 %) et l'Autel de la patience s'additionnent ; le Manteau de ronces, Quiétus et le Phylactère de Morgrath multiplient le total.",
            "Tes frappes s'ajoutent par-dessus, quel que soit ton rythme. Une puce sur la scène affiche le bonus."
          ]
        },
        {
          id: "stages",
          title: "Étapes, élites et gardiens",
          blocks: [
            `Chaque étape compte ${f.monstersPerStage} monstres. Vaincs-les pour passer à la suivante. Toutes les 5 étapes, un boss t'attend avec un chronomètre de ${f.bossTimer} s :`,
            { slot: "stageKinds" },
            `Si le chronomètre s'écoule, tu recules d'une étape et l'Auto se met en pause (mode **Rester**). Jusqu'à l'étape ${f.woundLastStage}, élites et gardiens **gardent leurs blessures** (jusqu'à ${f.woundCapPct} % de leurs PV) : chaque tentative compte. La porte du Donjon (étape 45), le Roi et les strates plus profondes guérissent entièrement.`,
            "La carte permet de revenir sur n'importe quelle étape déjà franchie. Un boss rejoué depuis la carte ne paie que de l'or : seul le boss le plus loin de la nuit lâche reliques et éclats."
          ]
        },
        {
          id: "rout",
          title: "La Débandade",
          blocks: [
            "Sur une étape en dessous de ton record (donc jamais pendant la toute première nuit), quand ta compagnie abattrait un monstre en moins de 0,1 s, toute l'étape tombe d'un coup : ses victoires restantes, leur or (avec la part d'un rat doré) et le Bestiaire. Puis l'étape suivante, au rythme d'une étape toutes les 0,25 s. Les élites et les gardiens, eux, se combattent toujours.",
            "C'est ce qui rend chaque nuit rapide à remonter : tu repasses en quelques secondes ce qui t'a coûté des heures."
          ]
        },
        {
          id: "curve",
          title: "La courbe des PV",
          blocks: ["Les PV augmentent bien plus vite que tout le reste : c'est ce qui finit par t'arrêter, et ce que l'ascension est faite pour franchir. Quelques repères (sans aucun bonus) :", { slot: "curve" }, "Pour une étape précise, utilise le [calculateur](calculator)."]
        },
        {
          id: "golden-rat",
          title: "Le rat doré",
          blocks: [
            `Sur les étapes normales, ${f.treasurePct} % des monstres sont un **rat doré**, Messire Pip, qui vaut 10 fois l'or. L'Autel du trésor (+0,5 % par niveau), le talent de Garrick, l'Anneau du rat et le Fromage de Pip augmentent la chance, plafonnée à ${f.treasureMaxPct} %.`,
            "Un rat doré sur dix s'arrête et te lance un défi : c'est [le Pari de Pip](events)."
          ]
        },
        {
          id: "crystals",
          title: "Les cristaux errants",
          blocks: [
            "Tant que le jeu est visible, un cristal apparaît toutes les 90 à 240 s (le premier d'une nouvelle partie au bout de 75 s) et reste 13 s. Attrape-le pour l'une de ces récompenses :",
            { slot: "crystals" },
            "Un cristal sur 20 est une **Averse de cristaux** : la Reine-lanterne traverse le ciel et cinq cristaux tombent tour à tour, 3 s chacun. La Pierre qui chante les fait rester 18 s ; l'Aimantite de Garrick, le Métier bourdonnant et la Lanterne aux phalènes les font venir plus vite.",
            { tip: "Garde la surcharge (DPS ×7) ou la frappe ×10 pour un boss : attrape le cristal pendant le combat, pas avant." }
          ]
        }
      ]
    }),
    companions: (f) => ({
      lead: `${f.companions} compagnons, plus Aldric, qui est toi. Chacun frappe plus fort que le précédent, coûte bien plus cher, et apporte un talent unique au niveau 50.`,
      sections: [
        { id: "roster", title: "La compagnie au complet", blocks: ["Chaque compagnon se dévoile quand le précédent a rejoint la compagnie. Touche un nom pour sa fiche complète : talents, pouvoir, promesse et souvenirs.", { slot: "roster" }] },
        {
          id: "levels",
          title: "Niveaux, talents et paliers",
          blocks: [
            "Chaque niveau coûte 7 % de plus que le précédent (10 % pour Aldric). Les **talents** se débloquent aux niveaux 10, 25, 50, 100 et 150 et s'achètent avec de l'or :",
            { list: ["Niveaux 10 et 25 : dégâts du compagnon ×2.", "Niveau 50 : un talent unique (or, frappe, critiques, chronomètre, trésor, dégâts de toute la compagnie ou bonus de Patience).", "Niveaux 100 et 150 : dégâts du compagnon ×4.", "Puis tous les 25 niveaux à partir de 200 : dégâts ×3,5, automatiquement."] },
            "Le coût d'un talent est le coût de base du compagnon multiplié par 20, 100, 800, 25 000 puis 2 500 000.",
            { tip: "Un compagnon s'achète par paliers : monte-le jusqu'au prochain talent, achète le talent, passe au suivant. C'est exactement ce que fait le pilote automatique quand tu es absent." }
          ]
        },
        { id: "aldric", title: "Aldric, ta frappe", blocks: ["Aldric ne fait pas de DPS : ses niveaux et ses talents renforcent ta frappe.", { slot: "aldric" }] },
        {
          id: "recognition",
          title: "La Reconnaissance",
          blocks: [
            `Chaque nuit, tes compagnons te rencontrent en inconnus. Mais une nuit où un compagnon atteint le niveau 100 compte pour sa **Reconnaissance**. Aux paliers ${f.recognitionTiers} nuits, il se souvient un peu plus de toi : un souvenir dans la Chronique, un anneau d'or sur son médaillon. Les deux derniers paliers demandent aussi une [promesse](promise) tenue.`,
            "Au palier 5, il fait **+10 % de dégâts**, et huit d'entre eux t'offrent une relique nommée. Voir [Chronique et Reconnaissance](chronicle#recognition)."
          ]
        },
        { id: "bulk", title: "Achat en masse", blocks: ["En haut du panneau des compagnons : ×1, ×10, ×25, ×100 ou Max. Le panneau montre la compagnie entière ; la scène montre les 5 plus forts (3 sur téléphone), dont les tirs volent vers le monstre chaque seconde."] }
      ]
    }),
    powers: () => ({
      lead: "Sept pouvoirs, sur les touches 1 à 7, que tes compagnons t'apprennent au niveau 25 (et Aldric au niveau 10). Ils récompensent ta présence.",
      sections: [
        { id: "list", title: "Les sept pouvoirs", blocks: [{ slot: "powers" }] },
        {
          id: "cooldowns",
          title: "Recharges",
          blocks: ["L'Autel des échos (-5 % par niveau) et le Médaillon d'Eldra (-10 %) raccourcissent toutes les recharges ensemble, jamais en dessous de 40 % de leur durée de base. La Robe des cendres fait durer la Pluie d'or 45 s."]
        },
        {
          id: "use",
          title: "Bien les lancer",
          blocks: [
            {
              list: [
                "**Contre un boss** : Cri de ralliement (compagnie ×2), Frénésie et Œil de faucon au début du chronomètre.",
                "**Pour l'or** : Pluie d'or (×3) juste avant une série de monstres, idéalement avec un Élixir de fortune et un cristal d'or.",
                "**Rituel de résonance** : à lancer à chaque recharge, sans réfléchir. Ses +5 % s'empilent jusqu'à la prochaine ascension.",
                "**Écho temporel** : juste après ton pouvoir le plus long (Rituel ou Pluie d'or), pour le relancer aussitôt.",
                "**Détisser** passe l'étape en cours (jamais celle d'un boss) : utile pour sauter un monstre trop lent en fin de route."
              ]
            }
          ]
        }
      ]
    }),
    ascension: (f) => ({
      lead: "Recommencer pour aller plus loin : l'ascension échange ta nuit contre des essences, qui rendent toutes les suivantes plus fortes.",
      sections: [
        {
          id: "how",
          title: "Faire son ascension",
          blocks: [
            `L'ascension s'ouvre quand le Roi déchu est tombé (étape ${f.ascensionStage} atteinte), au **Sanctuaire du Crépuscule**. Tu repars de l'étape 1 (ou plus loin, avec l'Autel du voyageur).`,
            { list: ["**Remis à zéro** : or, niveaux et talents des compagnons, étape, pouvoirs, statistiques de la nuit.", "**Gardé** : essences, autels, reliques, éclats, hauts faits, statistiques à vie, potions et surcharges en cours."] }
          ]
        },
        {
          id: "essences",
          title: "Les essences",
          blocks: [
            `Les essences gagnées dépendent de l'étape la plus loin franchie pendant la nuit. Chaque essence gardée en main donne **+${f.essenceDpsPct} % de DPS**. Quelques repères :`,
            { slot: "essences" },
            "La croissance est volontairement plus lente que celle des PV : pousser quelques étapes de plus paie, camper des heures devant un mur ne paie pas. Le plus rapide est d'ascensionner peu après l'arrêt de ta progression."
          ]
        },
        {
          id: "altars",
          title: "Les 13 autels",
          blocks: [
            "Les essences s'offrent aussi aux autels, pour des bonus permanents. Chaque niveau coûte `base × croissance^niveau` essences. Le Sanctuaire s'éveille en trois temps : les quatre autels sans plafond dès la première nuit, temps, trésor et marchandage à la troisième, les six autres à la cinquième.",
            { slot: "altars" },
            "À partir du niveau 5, chaque autel raconte qui l'a élevé : une ligne de la Chronique."
          ]
        },
        {
          id: "strategy",
          title: "Garder ou offrir ?",
          blocks: [
            "C'est la vraie décision du jeu. Les quatre autels sans plafond multiplient leur effet à chaque niveau, mais leur prix grimpe de façon exponentielle, et chaque essence offerte perd ses +10 % de DPS.",
            {
              list: [
                "Garde environ **la moitié** de tes essences en main, à tous les stades du jeu.",
                "Ta compagnie porte tes dégâts (tu laisses tourner) : l'**Autel de la patience**, qui vaut environ un cinquième de plus par essence que la puissance.",
                "Tes frappes mènent : l'**Autel de la lame**.",
                "Dans les deux cas : **puissance** et **fortune** ensuite, chacune sur sa propre échelle de prix.",
                "L'**Autel de la récolte** (+10 % d'essences par niveau, 5 niveaux) quand un niveau rapporte plus aux nuits suivantes que les essences gardées."
              ]
            },
            { warn: "Tout offrir fait perdre bien plus qu'on ne le croit : une simulation de 72 h atteint l'étape 1 684 avec un choix réfléchi, 468 en gardant tout, et beaucoup moins en dépensant tout." }
          ]
        },
        {
          id: "wanderer",
          title: "L'Autel du voyageur",
          blocks: ["Au début de chaque nuit, tes compagnons franchissent d'un coup 10 étapes par niveau, avec leurs victoires et leur or, jamais plus de la moitié de ton record (et toujours un multiple de 5, pour ne jamais commencer sur un boss). Ces étapes ne repaient pas d'essences à l'ascension suivante, ne donnent ni éclats ni reliques, et une nuit doit franchir au moins une étape par elle-même avant l'ascension."]
        }
      ]
    }),
    promise: () => ({
      lead: "Au crépuscule, tout le monde oublie, sauf une parole donnée. Une nuit par nuit, tu peux promettre à un compagnon ce qu'il te demande. Tenue, elle double ses dégâts pour toujours.",
      sections: [
        {
          id: "how",
          title: "Donner sa parole",
          blocks: [
            {
              list: [
                "Un compagnon ne demande ta parole qu'à partir de la **Reconnaissance 2** (trois nuits passées ensemble) : la première demande arrive donc vers la quatrième nuit.",
                "Elle se donne au Sanctuaire, page Promesse : tout de suite si la nuit commence à peine (personne recruté, aucune étape franchie, rien de ce qu'elle interdit déjà fait), sinon pour le prochain crépuscule.",
                "**Une parole par nuit**, sans pouvoir en changer. Jamais au même compagnon deux nuits de suite.",
                "Un compagnon ne demande que des nuits que tu as déjà marchées : tant que les étapes nécessaires (son roi, son gardien) dépassent ton record, il n'est pas dans la liste."
              ]
            }
          ]
        },
        {
          id: "held",
          title: "Tenue par la nuit elle-même",
          blocks: ["Tant que la parole tient, ce qu'elle interdit est refusé (le recrutement, la frappe, le pouvoir, l'achat) et un message dit pourquoi. Le pilote automatique et les rattrapages la respectent aussi : toute promesse peut se tenir sans être là. Seul toi peux la rompre, exprès (une touche confirmée au Sanctuaire) ou en appelant le crépuscule trop tôt."]
        },
        {
          id: "kept",
          title: "Tenue ou rompue",
          blocks: [
            "Une promesse est **tenue** au crépuscule si ce qu'elle demande a été fait **et qu'un roi est tombé** cette nuit-là (en tête de nuit, après la parole donnée).",
            {
              list: [
                "**Chaque parole tenue double les dégâts** de ce compagnon, pour toujours, jusqu'à cinq paroles (×32). Après ses cinq, il ne demande plus rien.",
                "Ses mots rejoignent la Chronique la première fois.",
                "La nuit compte **2 nuits** de Reconnaissance pour lui (au lieu d'une) s'il a atteint le niveau 100 et que ses souvenirs attendaient encore une parole (deux par compagnon : une pour le 4e souvenir, une pour le 5e)."
              ]
            },
            "**Rompue**, rien n'est perdu : plus rien n'est interdit, la parole ne double rien, la nuit compte comme une autre, et son médaillon garde un nœud défait jusqu'au crépuscule."
          ]
        },
        { id: "list", title: "Ce que chacun demande", blocks: [{ slot: "promises" }] },
        { id: "tips", title: "Conseils", blocks: [{ list: ["Commence par les promesses qui ne te coûtent rien selon ton style : Ysolde (aucune frappe) si tu laisses tourner, Nyx (aucun pouvoir) une nuit où tu seras absent, Célestine (aucun cristal) la nuit.", "Les demandes « sans X » sont faciles : il suffit de ne pas recruter un compagnon, ceux d'après rejoignent quand même.", "Oriane et Lysandre demandent d'aller loin : garde-les pour une nuit où tu sais pousser.", "Le classement **Parole tenue** compte toutes les promesses tenues de ta partie."] }] }
      ]
    }),
    relics: (f) => ({
      lead: "Quatre emplacements, cinq raretés, une forge et des éclats pour tout payer : tout ce qu'il faut savoir sur l'équipement.",
      sections: [
        { id: "slots", title: "Les quatre emplacements", blocks: ["Chaque emplacement a une stat principale fixe. Les dégâts contre les boss s'appliquent aux frappes et au DPS des compagnons contre les élites et les gardiens.", { slot: "slots" }] },
        {
          id: "rarities",
          title: "Raretés et bonus",
          blocks: [
            "Une relique a de 1 à 4 bonus selon sa rareté ; légendaires et mythiques ajoutent un bonus d'essences d'ascension. Sa puissance grandit avec l'étape où elle est tombée.",
            { slot: "rarities" },
            "Les totaux de tes quatre reliques sont plafonnés pour garder l'équilibre :",
            { slot: "caps" }
          ]
        },
        {
          id: "density",
          title: "Densité et « Compagnie ×N »",
          blocks: [
            "Plus une relique vient d'une strate profonde, plus elle est **dense** : portée, elle multiplie les dégâts de la compagnie (et la part de ta frappe qui en vient) par ×1,03 par strate sous la nuit présente. Quatre reliques de la dernière strate donnent environ ×1 000 ; de la strate 21 (étape 1 000), environ ×11.",
            "Chaque relique affiche un seul chiffre, **Compagnie ×N** : ce qu'elle multiplie dans les dégâts de ta compagnie par rapport à l'emplacement vide. Le sac compare ce chiffre à la relique portée et trie par lui. L'or, la frappe, les critiques et les dégâts aux gardiens restent listés à part."
          ]
        },
        {
          id: "drops",
          title: "Où les trouver",
          blocks: [
            {
              list: [
                "**Gardiens** : 40 % de chance (garanti au premier passage), et `1 + étape/25` éclats.",
                "**Élites** : 15 % de chance, et 1 éclat une fois sur trois environ.",
                "Seul le boss le plus loin de la nuit lâche reliques et éclats : un boss rejoué depuis la carte ne paie que de l'or.",
                "Les coffres de l'étal, la Brèche, l'Éclipse du roi et les cadeaux des compagnons.",
                "Une relique tombée va directement dans un emplacement vide."
              ]
            }
          ]
        },
        {
          id: "forge",
          title: "Forge et recyclage",
          blocks: [
            `La **forge** monte une relique jusqu'à +${f.forgeMax} : chaque niveau ajoute 10 % de leur valeur de base à tous ses bonus. Coût : \`rareté × 2 × 1,35^forge\` éclats.`,
            { slot: "forge" },
            `Le **recyclage** rend les éclats de la rareté (1, 3, 8, 25, 80) plus 50 % par niveau de forge. Les reliques se verrouillent, se recyclent en masse jusqu'à une rareté, et le sac en tient ${f.inventory} (plein, il recycle tout seul les nouvelles).`
          ]
        },
        {
          id: "market",
          title: "L'étal du Comptoir",
          blocks: ["Le Comptoir vend contre des éclats (et te dit l'un de ses douze dictons à chaque visite). Les potions durent 10 min et s'empilent sans limite. Un coffre acheté s'ouvre sous tes yeux. Le Jeton du Comptoir retire 10 % à tous les prix.", { slot: "market" }, { tip: "Le Sablier doré paie une heure d'or au rythme actuel : au début d'une nuit, quand ton or rattrape vite les prix, c'est le meilleur achat de l'étal." }]
        },
        {
          id: "caravan",
          title: "La Roulotte",
          blocks: ["À partir de ta 3e ascension, la Roulotte du Comptoir apporte une marchandise par semaine, la même pour tout le monde (elle change chaque lundi). Chacune s'achète une fois par semaine ; le Jeton, une fois par partie.", { slot: "caravan" }]
        },
        {
          id: "named",
          title: `Les ${f.namedRelics} reliques nommées`,
          blocks: ["Légendaires ou mythiques, chacune a une source fixe, une légende et un effet unique. Elles tombent une seule fois par partie, arrivent verrouillées et trouvent leur place même dans un sac plein.", { slot: "named" }]
        },
        {
          id: "regalia",
          title: "Les Regalia et la Couronne",
          blocks: [
            "Le Sceau d'Orvane, le Manteau de la dernière cour et le Dernier Décret forment les **Regalia d'Orvane**. Portés tous les trois, le Roi te reconnaît (ses mots changent) et subit 10 % de dégâts en plus.",
            { slot: "crown" }
          ]
        }
      ]
    }),
    idle: (f) => ({
      lead: "Idlebound est fait pour tourner pendant que tu travailles, étudies ou joues à autre chose. Voici exactement ce que ta compagnie fait sans toi.",
      sections: [
        {
          id: "open",
          title: "Page ouverte, toi ailleurs",
          blocks: [
            "Après 60 secondes sans aucune action, le **pilote automatique** prend le relais une fois par minute : tes compagnons dépensent l'or et, dès qu'ils peuvent battre le boss qui les arrêtait, relancent l'Auto pour retenter. En attendant, ils s'entraînent sur l'étape d'avant.",
            {
              list: [
                "Le compagnon suivant est recruté dès que l'or le permet.",
                "Ensuite, chaque achat est pesé en DPS gagné par pièce d'or : les niveaux d'un compagnon jusqu'à son prochain palier, avec ou sans les talents qu'ils débloquent. Le meilleur est acheté ; s'il est hors de portée mais à moins de 5 minutes d'or, la compagnie économise.",
                "Un talent qui n'ajoute pas de dégâts (or, critiques, chronomètre, trésor) s'achète quand il coûte 10 % de l'or au plus.",
                "Aldric n'est jamais monté. L'interrupteur « Dépenser en mon absence » (en haut du panneau des compagnons) coupe tout ça : l'or est alors gardé."
              ]
            }
          ]
        },
        {
          id: "hidden",
          title: "Page cachée, ordinateur en veille",
          blocks: [`Quand la page se réveille après plus de 5 secondes, le temps écoulé est simulé d'un coup (jusqu'à ${f.offlineHours} h), exactement comme le pilote l'aurait joué : tranches d'une minute, achats entre les tranches, étapes poussées jusqu'à un boss trop fort. La compagnie se bat seule : bonus de Patience en entier, mais ni frappes, ni pouvoirs, ni cristaux, ni potions.`]
        },
        {
          id: "closed",
          title: "Jeu fermé",
          blocks: [
            `Jeu fermé (compte ou invité), la compagnie marche quand même : à la réouverture, le temps depuis la dernière fois que la partie a été gardée est rattrapé de la même façon (${f.offlineHours} h au plus, +1 h par niveau du Long Fil), jamais plus que ce que le serveur a vu passer. Un rattrapage de 8 h prend une à deux dixièmes de seconde.`,
            "Une page ouverte garde la partie toutes les 30 s : recharger ne perd rien."
          ]
        },
        {
          id: "reunion",
          title: "Les Retrouvailles",
          blocks: [
            `De retour après ${f.reunionMinutes} min d'absence ou plus, ta première action déclenche les **Retrouvailles** : les dégâts de la compagnie ×${f.reunionDps} pendant un sixième de ton absence (une heure au plus ; une nuit donne l'heure entière).`,
            "Avec elles, le **compte de la compagnie** : temps d'absence, route parcourue, or gagné et dépensé, murs rencontrés puis franchis, qui a rejoint, niveaux gagnés, et le boss qui barre encore la route. Il se termine sur un fragment de Chronique pas encore lu."
          ]
        },
        {
          id: "presence",
          title: "Ce que ta présence ajoute",
          blocks: ["Aucun malus n'est appliqué à l'absent. Ta présence ajoute ce que seule une main peut faire : cristaux, pouvoirs, achats plus rapides, ascensions, autels, étal, équipement et forge. Et la [Promesse](promise) : le pilote ne la rompt jamais, il peut seulement la tenir."]
        }
      ]
    }),
    bestiary: (f) => ({
      lead: `${f.creatures} créatures, sur sept pages : les cinq biomes, Hors des routes et les Douze Rois. Chacune a trois lignes du Grand Livre, qui se dévoilent à force de la vaincre.`,
      sections: [
        {
          id: "how",
          title: "Comment le Bestiaire se remplit",
          blocks: [
            {
              list: [
                "Trois lignes par créature, à 1, 100 et 1 000 victoires (1, 5 et 25 pour les errants rares et les créatures d'événement ; 1, 10 et 100 pour les formes du Roi).",
                "Rencontrer toutes les créatures d'une page de biome donne **+1 % d'or** (cinq pages, +5 %).",
                "Les victoires faites en masse (rattrapage, Autel du voyageur, Débandade) se répartissent entre les créatures de l'étape.",
                "En jeu, le Bestiaire est dans la Halle, dès la première créature rencontrée ; les autres y sont des silhouettes."
              ]
            }
          ]
        },
        { id: "pages", title: "Toutes les créatures", blocks: [{ slot: "pages" }] },
        {
          id: "eras",
          title: "Strates et préfixes",
          blocks: ["Chaque boucle des cinq biomes est une nouvelle strate : les mêmes créatures, bien plus coriaces, portent le préfixe de leur strate (Écho, Cendre, Néant…) et changent d'apparence à chaque Âge. Chaque fiche montre la créature à travers les Âges. Voir [Strates, Âges et rois](strata)."]
        }
      ]
    }),
    biomes: () => ({
      lead: "Une nuit traverse cinq biomes de dix étapes chacun, de la ferme abandonnée au trône du Roi. Puis la route recommence, une strate plus bas.",
      sections: [
        { id: "list", title: "Les cinq biomes", blocks: [{ slot: "biomes" }] },
        {
          id: "echoes",
          title: "Les échos de la route",
          blocks: ["Chaque biome garde douze échos écrits à la main, puis d'autres que la nuit compose. Le premier passage d'un gardien en ramène un : toujours le premier, puis 15 % de chance, +5 % par strate. Ils s'affichent sous chaque biome, au fil de ceux que ta partie a ramenés."]
        }
      ]
    }),
    strata: (f) => ({
      lead: `Toutes les ${f.stagesPerEra} étapes, la route s'enfonce d'une strate : ${f.eras} strates, regroupées en ${f.ages} Âges de cinq, du présent jusqu'à l'Aube.`,
      sections: [
        {
          id: "how",
          title: "Ce qu'est une strate",
          blocks: [
            "Chaque boucle complète des cinq biomes (50 étapes) commence une nouvelle strate, avec son nom et son préfixe. Les monstres y sont bien plus coriaces, et chaque Âge transforme la façon dont la nuit les dessine, comme les décors. Chaque strate use un peu plus les lieux.",
            "Au bout de chaque strate, le Roi garde la 50e étape. Sa première chute dans une strate ramène la **pierre de voûte** de cette strate : un fragment de la Chronique."
          ]
        },
        { id: "ages", title: `Les ${f.ages} Âges`, blocks: [{ slot: "ages" }] },
        { id: "kings", title: "Les douze formes du Roi", blocks: ["Le gardien de chaque 50e étape est le Roi, sous la forme de l'Âge de la strate. Même force sous toutes ses formes : seuls son apparence, son nom et ses mots changent.", { slot: "kings" }] },
        { id: "list", title: `Les ${f.eras} strates`, blocks: [{ slot: "strata" }] },
        {
          id: "dawn",
          title: "L'Aube",
          blocks: [`À l'étape ${fr(f.dawnStage)}, l'Aube se tient à la place du Roi. La route ne s'arrête pas là : dessous, la nuit se dessine à nouveau depuis sa première strate, plus profonde à chaque tour.`, { slot: "dawn" }]
        }
      ]
    }),
    events: () => ({
      lead: "La Longue Nuit n'est pas qu'une route droite. Douze événements la traversent, chacun avec son déclencheur, sa récompense et un fragment la première fois.",
      sections: [
        { id: "rules", title: "Les règles communes", blocks: ["Les événements n'arrivent que dans une page visible, jamais pendant un rattrapage, et suivent le hasard du moteur (le même pour une partie donnée, même après un rechargement). Un message les annonce."] },
        { id: "list", title: "Les douze événements", blocks: [{ slot: "events" }] },
        { id: "caravan", title: "La Roulotte, semaine après semaine", blocks: ["La marchandise de la semaine est la même pour tout le monde, choisie par la semaine ISO. Toutes ses marchandises sont détaillées dans [Reliques, forge et marché](relics#caravan)."] }
      ]
    }),
    chronicle: (f) => ({
      lead: "L'histoire d'Idlebound se raconte par fragments, posés sur les mécaniques. Rien n'est stocké en texte : ta partie garde des compteurs, et le n-ième fragment d'une source est toujours le même.",
      sections: [
        {
          id: "sources",
          title: "D'où viennent les fragments",
          blocks: [
            {
              list: [
                "**Les pierres de voûte** des 60 strates (la première chute de chaque Roi), puis leur seconde lecture à chaque Descente.",
                "**Les jalons** de ton histoire : ascensions 1, 5, 10, 25, 50, 100 ; Descentes 1, 3, 5, 10 ; les premiers compagnons qui se souviennent.",
                "**Les Mots du Roi**, un par ascension : 50 écrits à la main, puis sa voix composée par la nuit. Les sept mots de son Éclipse, et douze mots à qui porte ses Regalia.",
                "**Les échos** de la route (12 par biome) et **les échos d'Âge** (8 par Âge), ramenés par les gardiens, les Brèches et le Silence.",
                "Les errants rares, les événements, les souvenirs de Reconnaissance, les paroles tenues, les Leçons d'Aldric, les chants de Célestine (5 % des cristaux une fois rencontrée), ce qui reste après une absence, les dictons du Comptoir, les légendes des reliques nommées et des autels, les secrets et la Couronne."
              ]
            },
            "Un message annonce un fragment au plus une fois par minute (pierres de voûte et jalons toujours) ; les autres attendent dans la Chronique, dans la Halle, marqués comme nouveaux. La Lisière effilochée, l'Oreille d'Oriane et les Nuits du souvenir les rendent plus fréquents."
          ]
        },
        {
          id: "recognition",
          title: "La Reconnaissance",
          blocks: [
            `Une nuit où un compagnon atteint le niveau 100 compte pour sa Reconnaissance (deux nuits si tu as tenu une promesse qu'il attendait). Paliers : ${f.recognitionTiers} nuits, une de moins par niveau de Parenté.`,
            { slot: "recognition" },
            "Chaque compagnon te salue en rejoignant la compagnie : en inconnu, à demi reconnu (paliers 1 et 2) ou reconnu (palier 3 et plus). Chaque fiche de [compagnon](companions) donne ses souvenirs."
          ]
        },
        { id: "first-dusk", title: "Les scènes du Grand Livre", blocks: ["À quelques moments clés, une courte scène de quelques plans se joue par-dessus le jeu, qui continue en dessous. Chaque scène vécue se revoit dans la Chronique, « Ce que le Grand Livre a vu ».", { slot: "scenes" }] },
        { id: "king-words", title: "Les Mots du Roi", blocks: ["À chaque ascension, le Roi laisse un mot. Les cinquante premiers sont écrits à la main ; chacun se découvre à l'ascension de son numéro.", { slot: "kingWords" }] },
        { id: "milestones", title: "Les jalons", blocks: [{ slot: "milestones" }] },
        { id: "lessons", title: "Les Leçons d'Aldric", blocks: ["Le premier achat de chacun des sept talents d'Aldric laisse une Leçon.", { slot: "lessons" }] }
      ]
    }),
    deeds: (f) => ({
      lead: `${f.achievements} hauts faits : des séries qui renforcent ta compagnie pour toujours, et ${f.secrets} secrets qui ne donnent rien d'autre que le plaisir de les trouver.`,
      sections: [
        {
          id: "bonus",
          title: "Ce qu'ils rapportent",
          blocks: ["Chaque haut fait d'une série donne un bonus permanent de DPS : +2 % (+3 % pour les étapes, ascensions et essences, +5 % pour le mythique). Les deux paliers les plus hauts de chaque série valent 2,5 fois plus. Ta frappe en reçoit la moitié. Les hauts faits secrets ne donnent aucun bonus."]
        },
        { id: "series", title: "Toutes les séries", blocks: [{ slot: "series" }] },
        { id: "secrets", title: `Les ${f.secrets} secrets`, blocks: ["En jeu, un secret apparaît comme « ??? » avec son énigme jusqu'à ce que tu le trouves. Les solutions sont cachées : ouvre seulement celles que tu veux.", { slot: "secrets" }] }
      ]
    }),
    descent: (f) => ({
      lead: `La seconde renaissance, pour le long cours. À l'étape ${fr(f.descentStage)}, Eldra te montre son Métier : tu défais essences et autels pour tisser des fils, et reprends la nuit plus bas.`,
      sections: [
        {
          id: "unlock",
          title: "Quand elle s'ouvre",
          blocks: [`Le Métier s'ouvre quand ton record atteint l'étape ${fr(f.descentStage)}, annoncé une fois. Sans Descente, on y arrive en environ une semaine de jeu, là où la route ralentit pour de bon.`]
        },
        {
          id: "what",
          title: "Ce qu'elle remet à zéro",
          blocks: [{ list: ["**Remis à zéro** : tout ce qu'efface une ascension, plus les essences et les autels.", "**Gardé** : reliques, éclats, hauts faits, la Chronique, le Bestiaire, la Reconnaissance, les statistiques à vie et ton record."] }]
        },
        {
          id: "threads",
          title: "Les fils",
          blocks: [
            "Le fil est aussi long que la nuit est allée profond. Tissés en tout : `2^((meilleure étape - 750) / 250)`, arrondi en dessous. Une Descente tisse ce que ta meilleure étape ajoute aux fils déjà tissés : une nuit pas plus profonde que la précédente ne tisse rien.",
            { slot: "threads" }
          ]
        },
        { id: "weaves", title: "Les Tissages", blocks: ["Au Métier, les fils achètent des Tissages permanents (prix : `base × croissance^niveau`, arrondi au-dessus), que rien ne défait.", { slot: "weaves" }, "La Chaîne d'abondance est le seul Tissage qui se multiplie. Son prix grandit d'un cinquième par niveau pendant que le fil double à chaque Âge : chaque Âge en achète moins que le précédent, sans emballement. Chaque Descente rouvre aussi les pierres de voûte des strates pour une seconde lecture."] },
        {
          id: "strategy",
          title: "Quand descendre",
          blocks: [
            "La première Descente te ramène en arrière pendant un jour ou deux, puis te fait passer devant celui qui ne descend jamais. Les simulations : descendre une fois par Âge (8 fils au moins) va plus loin que descendre trop souvent, qui paie la remontée trop de fois.",
            "Le classement **Nuits retissées** compte les Descentes qui ont tissé au moins un fil : une Descente qui ne tisse rien n'y compte pas. Il récompense ton rythme au Métier, pas ta profondeur.",
            { slot: "crown" }
          ]
        }
      ]
    }),
    account: () => ({
      lead: "Ta partie vit sur le serveur, avec ou sans compte. Voici comment elle est gardée, vérifiée et classée.",
      sections: [
        {
          id: "guest",
          title: "Jouer sans compte",
          blocks: ["Tu peux jouer tout de suite. Dès ta première frappe, la partie est gardée sur le serveur et ton navigateur la retrouve, même des jours plus tard. Une partie d'invité est effacée après 30 jours sans visite, et n'entre pas au classement."]
        },
        {
          id: "account",
          title: "Créer un compte",
          blocks: [
            "Un e-mail, un nom et un mot de passe, rien d'autre. Ta partie te suit alors sur tous tes appareils et entre au classement. Si tu jouais en invité, ta partie rejoint le compte (ou tu choisis laquelle garder si elles diffèrent : rien n'est jamais écrasé en silence).",
            "Si un e-mail de confirmation est envoyé, confirme-le dans les 3 jours : après, la partie n'est plus gardée tant que l'adresse n'est pas confirmée (le jeu reste jouable)."
          ]
        },
        {
          id: "keeping",
          title: "Une partie toujours gardée",
          blocks: ["Rien n'est stocké dans ton navigateur : la partie est sur le serveur, gardée toutes les 30 s et après chaque action importante. Si le serveur est injoignable, le jeu continue et réessaie. Deux appareils ouverts sur la même partie ? Celui qui n'a pas vu la dernière version gardée te propose de choisir."]
        },
        {
          id: "verified",
          title: "Une partie vérifiée",
          blocks: ["Chaque partie envoyée est recalculée par le serveur avec le même moteur que le jeu : or gagné et dépensé, essences, temps de jeu, vitesse des frappes et des victoires, boss battables, butin, hauts faits. Une partie impossible est refusée. C'est ce qui rend le classement fiable."]
        },
        { id: "boards", title: "Le Registre des Liés", blocks: ["Le classement public a quatre tableaux. À égalité, celui qui y est arrivé le premier passe devant.", { slot: "boards" }] },
        {
          id: "settings",
          title: "Réglages",
          blocks: ["Langue, notation des nombres (lettres, scientifique, ingénieur), son et volume, chiffres de dégâts, animations réduites, couleurs pour daltoniens, confirmation de l'ascension. Le jeu s'installe aussi comme une application sur téléphone."]
        }
      ]
    })
  },
  en: {
    "getting-started": (f) => ({
      lead: "Idlebound takes ten seconds to pick up and weeks to dig into. Here, in order, is what awaits you and what is worth knowing at each step.",
      sections: [
        {
          id: "idea",
          title: "The idea in a minute",
          blocks: [
            "You are **Aldric**, a walker caught in the Long Night. Ahead of you, a road of monsters, the **Remnants**. You strike them, they drop gold. With that gold you hire **companions** who strike in your place, never stopping, even while you do something else.",
            `The road is made of **stages**: ${f.monstersPerStage} monsters to beat per stage, and a boss every 5 stages. At the end of stage 50 waits the **Fallen King**. When he falls, you can **ascend**: start over from stage 1, with **essences** that make every night after stronger.`,
            "That is the whole heart of the game: strike, hire, push on, start over stronger. Everything else (relics, altars, promises, the Descent) is added little by little, when you need it. The interface only shows each thing once you can use it."
          ]
        },
        {
          id: "first-minutes",
          title: "The first ten minutes",
          blocks: [
            {
              steps: [
                "Strike the monster (mouse, touch, or Enter/Space when the scene has focus). Every monster beaten gives gold.",
                "Level **Aldric** a few times: his levels raise your strike damage. At level 10, his first talent doubles your strike and unlocks **Frenzy** (key 1).",
                "As soon as you have 50 gold, hire **Maëlle**. She is your first companion: she strikes on her own, every second.",
                "Then hire each companion as soon as they appear (the next shows once the one before joined), and level them. Aim for levels 10 and 25: each doubles their damage.",
                "Push on stage after stage. Auto is on by default: once you beat 10 monsters, you move to the next stage."
              ]
            },
            { tip: "The **×1 / ×10 / ×25 / ×100 / Max** button at the top of the companions panel buys several levels at once. **Max** is almost always right early on." }
          ]
        },
        {
          id: "first-boss",
          title: "Your first boss",
          blocks: [
            `At stage 5, an **elite** (6 times a normal monster's HP). At stage 10, the biome's **guardian** (10 times). You have ${f.bossTimer} seconds to beat it.`,
            "If the timer runs out, you go back one stage and Auto pauses: that is **Stay** mode. You keep earning gold on the stage before. Strengthen your companions, then press **Auto** to try again.",
            `Good news: up to stage ${f.woundLastStage}, a boss **keeps its wounds**. The damage you dealt stays on it (up to ${f.woundCapPct}% of its HP) when you come back. Keep at it, it will fall.`,
            { tip: "Use your powers right at the start of a boss fight, not before: their 30 seconds then cover the whole timer." }
          ]
        },
        {
          id: "first-hour",
          title: "The first hour",
          blocks: [
            "Stages come in biomes of 10: the Verdant Plains (1 to 10), the Dark Forest (11 to 20), the Forgotten Caves (21 to 30), the Corrupted Marsh (31 to 40) and the Fallen King's Ruins (41 to 50).",
            {
              list: [
                "**Wandering crystals** show up on the scene now and then, about every 1.5 to 4 minutes. Catch them: gold, damage ×7, strike ×10, shards. They only stay 13 seconds.",
                `**The golden rat** (${f.treasurePct}% of monsters) is worth 10 times a normal monster's gold.`,
                "**Relics** drop from guardians (40%, guaranteed the first time) and elites (15%). A relic found goes straight into an empty slot.",
                "**Powers** unlock at level 25 of Maëlle, Ysolde, Brother Cinder, Nyx and Garrick. Use them whenever they are ready."
              ]
            },
            "Over the first hour, your strikes count less and less against your company. That is on purpose: later, the companions carry the night. You never need to strike frantically."
          ]
        },
        {
          id: "first-ascension",
          title: "Your first ascension (around 3 h of play)",
          blocks: [
            `The Fallen King guards stage 50. Once he has fallen (stage ${f.ascensionStage} reached), the **Sanctum of Dusk** opens: that is the ascension.`,
            "You start over at stage 1. You lose your gold, your companions' levels and talents, and your stage progress. You keep your essences, altars, relics, shards, deeds and records.",
            `Every essence kept in hand gives **+${f.essenceDpsPct}% DPS**. You can also offer them to the **altars** for permanent bonuses. The golden rule: keep about half of your essences in hand, and offer the other half.`,
            "Do not rush: push a little past stage 50 to gather more essences (a first ascension pays 65 at stage 60, 71 once stage 60 is cleared). But do not wait for hours at a wall: ascension is meant to be repeated. When your progress stops, ascend.",
            { warn: "Never spend all your essences on altars: an essence offered loses its +10% DPS. An altar is only worth it when it gives more than what it costs in essences kept." }
          ]
        },
        {
          id: "after",
          title: "And then?",
          blocks: [
            {
              list: [
                "Each night goes further than the last. Every 50 stages begins a new **stratum**, with tougher monsters and a changed look. There are 60, grouped into 12 Ages.",
                "Around the fourth night, a companion who starts to remember you will ask for your **word** for the night: that is [the Promise](promise). Keep it, and their damage doubles for good.",
                "With the shards earned from guardians, [forge your relics](relics#forge) and visit the [Stallkeeper's stall](relics#market).",
                "Leave the page open while you work: your company walks on alone, and even with the game closed, it catches up to 8 hours. See [Playing in the background](idle).",
                `Far down, at stage ${en(f.descentStage)}, opens [the Descent](descent), the second rebirth.`
              ]
            }
          ]
        }
      ]
    }),
    faq: () => ({
      lead: "The questions everyone asks in the first days, and the short answers.",
      sections: [
        { id: "free", title: "Do I have to strike all the time?", blocks: ["No. Your strikes carry the very start of each night, then your companions take over. They strike even while the page is in the background. Your presence adds what only a hand can do: catching crystals, using powers, ascending, managing gear."] },
        { id: "who-to-level", title: "Which companion should I level first?", blocks: ["The newest, almost always: each companion deals far more damage than the one before. Level them to their next breakpoint (10, 25, 50, 100, 150, then every 25 levels from 200), buy the talent, and repeat. A companion stopped between two breakpoints wastes gold.", { tip: "The **Max** button shows how many levels you can afford. Aiming for the next breakpoint is almost always better than spreading gold around." }] },
        { id: "stuck", title: "I'm stuck at a boss, what do I do?", blocks: [{ list: ["Let **Stay** mode run for a while: you earn gold on the stage before and your companions grow.", "Use your powers at the start of the fight (Rallying Cry above all).", "Up to stage 44, each attempt leaves wounds on the boss: try again.", "After your first ascension: if a wall does not give within 20 minutes, ascend. It is faster than insisting."] }] },
        { id: "when-ascend", title: "When should I ascend?", blocks: ["When your progress stops. The simulations are clear: ascending a few minutes after your last new stage goes much further than waiting an hour at a wall. Essences grow with the furthest stage cleared, but more slowly than monster HP: pushing a little pays, camping for hours does not."] },
        { id: "which-altar", title: "Which altars should I buy?", blocks: ["Those that match your style. If you mostly let the game run, the **Altar of Patience** is the best. If your strikes deal most of your damage, the **Altar of the Blade**. In between, **Might** and **Fortune**. Then the capped altars (time, treasure, bargains…) open on the third and fifth nights. And always keep about half of your essences in hand. Details in [Ascension and altars](ascension#strategy)."] },
        { id: "relic-choice", title: "Which relic should I wear?", blocks: ["Look at each relic's **Company ×N** figure: what it multiplies in your company's damage, against the slot left empty. The bigger, the better. Relics found in deep strata have **Density**: each stratum below the present night adds ×1.03 to the company's damage."] },
        { id: "shards", title: "What are shards for?", blocks: ["Forging your relics (up to +20) and buying at the Stallkeeper's stall: chests, potions, hourglasses. You earn them from guardians, crystals and by salvaging relics you no longer need. The **Golden Hourglass** (an hour of gold right now) is the best buy at the start of a night."] },
        { id: "lost", title: "Will I lose my game?", blocks: ["No. It is kept on the server, even without an account: your browser finds it again for 30 days after your last visit. Create an account to keep it for good and on all your devices. See [Account and kept game](account)."] },
        { id: "cheat", title: "Can you cheat?", blocks: ["The server checks every game it receives with the same engine as the game: gold earned, time played, bosses beatable, loot. An impossible game is refused. The leaderboard only shows verified games."] },
        { id: "mistakes", title: "Beginner mistakes", blocks: [{ list: ["Spending every essence on altars.", "Camping for hours at a wall instead of ascending.", "Leaving a companion just below a breakpoint (level 24, 49, 99…).", "Forgetting to buy talents: they double or quadruple damage.", "Keeping common relics instead of salvaging them into shards.", "Ignoring crystals: an overcharge ×7 or a strike ×10 at the right moment brings a boss down."] }] }
      ]
    }),
    calculator: (f) => ({
      lead: "Enter a stage, as deep as you like: the calculator tells you what awaits there, with the game's own formulas.",
      sections: [
        { id: "tool", title: "The calculator", blocks: [{ slot: "calculator" }] },
        {
          id: "formulas",
          title: "How it is computed",
          blocks: [
            "**HP** follow a curve in three segments: very steep early, then ×1.15 per stage, then ×1.18 per stage. The elite (every 5 stages) has 6 times a Remnant's HP, the guardian (every 10 stages) 10 times.",
            "A monster's **gold** is worth 1/30 of its HP (twice that at stage 1, the gap closing by stage 10). Your gold bonuses (Altar of Fortune, talents, relics, Bestiary) come on top.",
            "An ascension's **essences** depend on the furthest stage cleared in the night: 20 × 1.075 per stage past 50, up to stage 140, then +2% per stage, plus 3 per stage past 50. The Altar of Harvest, the Warp of Plenty and some relics multiply them.",
            `The Descent's **threads**: 2 at stage 1,000, twice as many with every Age (250 stages), 32 at stage ${en(f.descentStage)}.`
          ]
        }
      ]
    }),
    combat: (f) => ({
      lead: "How a fight is won, what your strikes are worth and what each stage of the road holds.",
      sections: [
        {
          id: "strikes",
          title: "Strikes and critical hits",
          blocks: [
            `Each strike deals your **strike damage** to the monster. A **critical hit** multiplies it by ${f.crit} (Nyx's and Lysandre's level 50 talents add +3 and +5 to that multiplier, the Altar of Fate +20% per level). Critical hits only apply to strikes, never to companions.`,
            "Your strike damage = Aldric's own damage (his levels, his talents, your strike relics, half the deeds bonus) + a **share of your company's DPS** (1%, 1% and 0.4% with Aldric's talents at levels 25, 100 and 200), all multiplied by the Altar of the Blade.",
            "Aldric's own damage fades after the first stages: later, a strike is worth mostly its share of DPS, multiplied by crits and the Blade."
          ]
        },
        {
          id: "patience",
          title: "The Patience bonus",
          blocks: [
            "Your companions hit harder thanks to the **Patience bonus**, always on, whether you are there or not. Sentinel's Vigil (Kaelen level 50, +50%), Silent Legion (Morgrath level 50, +100%) and the Altar of Patience add up; the Briar Mantle, Quietus and Morgrath's Phylactery multiply the total.",
            "Your strikes add on top of it, whatever your pace. A chip on the scene shows the bonus."
          ]
        },
        {
          id: "stages",
          title: "Stages, elites and guardians",
          blocks: [
            `Each stage holds ${f.monstersPerStage} monsters. Beat them to move on. Every 5 stages, a boss waits with a ${f.bossTimer} s timer:`,
            { slot: "stageKinds" },
            `If the timer runs out, you go back one stage and Auto pauses (**Stay** mode). Up to stage ${f.woundLastStage}, elites and guardians **keep their wounds** (up to ${f.woundCapPct}% of their HP): every attempt counts. The Keep's gate (stage 45), the King and the deeper strata heal whole.`,
            "The map lets you go back to any stage already cleared. A boss replayed from the map pays gold only: only the furthest boss of the night drops relics and shards."
          ]
        },
        {
          id: "rout",
          title: "The Rout",
          blocks: [
            "On a stage below your record (so never on the very first night), when your company would beat a monster in under 0.1 s, the whole stage falls at once: its remaining wins, their gold (with a golden rat's share) and the Bestiary. Then the next stage, at one stage every 0.25 s. Elites and guardians are still fought.",
            "That is what makes each night quick to climb back: you pass in seconds what cost you hours."
          ]
        },
        {
          id: "curve",
          title: "The HP curve",
          blocks: ["HP grow far faster than anything else: that is what eventually stops you, and what ascension is made to overcome. A few landmarks (with no bonus at all):", { slot: "curve" }, "For a precise stage, use the [calculator](calculator)."]
        },
        {
          id: "golden-rat",
          title: "The golden rat",
          blocks: [
            `On normal stages, ${f.treasurePct}% of monsters are a **golden rat**, Pip, worth 10 times the gold. The Altar of Treasure (+0.5% per level), Garrick's talent, the Rat's Ring and Pip's Cheese raise the chance, capped at ${f.treasureMaxPct}%.`,
            "One golden rat in ten stops and dares you: that is [Pip's Wager](events)."
          ]
        },
        {
          id: "crystals",
          title: "Wandering crystals",
          blocks: [
            "While the game is visible, a crystal appears every 90 to 240 s (the first of a new game after 75 s) and stays 13 s. Catch it for one of these rewards:",
            { slot: "crystals" },
            "One crystal in 20 is a **Crystal Storm**: the Lantern Queen crosses the sky and five crystals fall in turn, 3 s each. The Singing Stone makes them stay 18 s; Garrick's Lodestone, the Humming Loom and the Moth Lantern bring them sooner.",
            { tip: "Keep the overcharge (DPS ×7) or the strike ×10 for a boss: catch the crystal during the fight, not before." }
          ]
        }
      ]
    }),
    companions: (f) => ({
      lead: `${f.companions} companions, plus Aldric, who is you. Each strikes harder than the one before, costs far more, and brings a unique talent at level 50.`,
      sections: [
        { id: "roster", title: "The whole company", blocks: ["Each companion shows once the one before has joined the company. Touch a name for their full page: talents, power, promise and memories.", { slot: "roster" }] },
        {
          id: "levels",
          title: "Levels, talents and breakpoints",
          blocks: [
            "Each level costs 7% more than the last (10% for Aldric). **Talents** unlock at levels 10, 25, 50, 100 and 150 and are bought with gold:",
            { list: ["Levels 10 and 25: the companion's damage ×2.", "Level 50: a unique talent (gold, strike, crits, timer, treasure, the whole company's damage or the Patience bonus).", "Levels 100 and 150: the companion's damage ×4.", "Then every 25 levels from 200: damage ×3.5, automatically."] },
            "A talent costs the companion's base cost times 20, 100, 800, 25,000 then 2,500,000.",
            { tip: "Buy a companion by breakpoints: level them to the next talent, buy the talent, move on. That is exactly what the autopilot does while you are away." }
          ]
        },
        { id: "aldric", title: "Aldric, your strike", blocks: ["Aldric deals no DPS: his levels and talents strengthen your strike.", { slot: "aldric" }] },
        {
          id: "recognition",
          title: "Recognition",
          blocks: [
            `Every night, your companions meet you as a stranger. But a night where a companion reaches level 100 counts toward their **Recognition**. At ${f.recognitionTiers} nights, they remember you a little more: a memory in the Chronicle, a gold ring on their medallion. The last two tiers also ask for a [promise](promise) kept.`,
            "At tier 5, they deal **+10% damage**, and eight of them give you a named relic. See [Chronicle and Recognition](chronicle#recognition)."
          ]
        },
        { id: "bulk", title: "Bulk buying", blocks: ["At the top of the companions panel: ×1, ×10, ×25, ×100 or Max. The panel shows the whole company; the scene shows the 5 strongest (3 on phones), whose shots fly to the monster every second."] }
      ]
    }),
    powers: () => ({
      lead: "Seven powers, on keys 1 to 7, that your companions teach you at level 25 (and Aldric at level 10). They reward being there.",
      sections: [
        { id: "list", title: "The seven powers", blocks: [{ slot: "powers" }] },
        { id: "cooldowns", title: "Recharges", blocks: ["The Altar of Echoes (-5% per level) and Eldra's Locket (-10%) shorten every recharge together, never below 40% of its base. The Vestment of Cinders makes Golden Rain last 45 s."] },
        {
          id: "use",
          title: "Using them well",
          blocks: [
            {
              list: [
                "**Against a boss**: Rallying Cry (company ×2), Frenzy and Hawkeye at the start of the timer.",
                "**For gold**: Golden Rain (×3) just before a run of monsters, ideally with a Fortune Elixir and a gold crystal.",
                "**Resonance Ritual**: use it at every recharge, no thinking. Its +5% stacks until the next ascension.",
                "**Time Echo**: right after your longest power (Ritual or Golden Rain), to use it again at once.",
                "**Unweave** skips the current stage (never a boss's): handy to skip a slow monster at the end of the road."
              ]
            }
          ]
        }
      ]
    }),
    ascension: (f) => ({
      lead: "Starting over to go further: ascension trades your night for essences, which make every night after stronger.",
      sections: [
        {
          id: "how",
          title: "Ascending",
          blocks: [
            `Ascension opens once the Fallen King has fallen (stage ${f.ascensionStage} reached), in the **Sanctum of Dusk**. You start again from stage 1 (or further, with the Altar of the Wanderer).`,
            { list: ["**Reset**: gold, companions' levels and talents, stage, powers, the night's statistics.", "**Kept**: essences, altars, relics, shards, deeds, lifetime statistics, running potions and overcharges."] }
          ]
        },
        {
          id: "essences",
          title: "Essences",
          blocks: [
            `Essences earned depend on the furthest stage cleared in the night. Every essence kept in hand gives **+${f.essenceDpsPct}% DPS**. A few landmarks:`,
            { slot: "essences" },
            "Their growth is deliberately slower than HP: pushing a few more stages pays, camping for hours at a wall does not. The fastest is to ascend soon after your progress stops."
          ]
        },
        {
          id: "altars",
          title: "The 13 altars",
          blocks: [
            "Essences can also be offered to the altars, for permanent bonuses. Each level costs `base × growth^level` essences. The Sanctum wakes in three times: the four uncapped altars from the first night, time, treasure and bargains on the third, the six others on the fifth.",
            { slot: "altars" },
            "From level 5, each altar tells who raised it: a line of the Chronicle."
          ]
        },
        {
          id: "strategy",
          title: "Keep or offer?",
          blocks: [
            "That is the real decision of the game. The four uncapped altars multiply their effect at each level, but their price climbs exponentially, and each essence offered loses its +10% DPS.",
            {
              list: [
                "Keep about **half** of your essences in hand, at every stage of the game.",
                "Your company carries your damage (you let it run): the **Altar of Patience**, worth about a fifth more per essence than Might.",
                "Your strikes lead: the **Altar of the Blade**.",
                "Either way: **Might** and **Fortune** next, each on its own price ladder.",
                "The **Altar of Harvest** (+10% essences per level, 5 levels) once a level adds more to the nights to come than the essences kept."
              ]
            },
            { warn: "Offering everything costs far more than it seems: a 72 h simulation reaches stage 1,684 with a sound choice, 468 holding everything, and much less spending everything." }
          ]
        },
        {
          id: "wanderer",
          title: "The Altar of the Wanderer",
          blocks: ["At the start of each night, your companions clear 10 stages per level at once, with their wins and gold, never more than half your record (and always a multiple of 5, so a night never starts on a boss). Those stages do not pay essences again at the next ascension, give no shards or relics, and a night must clear at least one stage by itself before ascending."]
        }
      ]
    }),
    promise: () => ({
      lead: "At dusk everyone forgets, except a word given. Once a night, you may promise a companion what they ask. Kept, it doubles their damage for good.",
      sections: [
        {
          id: "how",
          title: "Giving your word",
          blocks: [
            {
              list: [
                "A companion only asks for your word from **Recognition 2** (three nights together): the first ask comes around the fourth night.",
                "It is given in the Sanctum, on the Promise page: at once while the night has barely begun (nobody hired, no stage cleared, nothing it forbids already done), otherwise for the next dusk.",
                "**One word a night**, which cannot be swapped. Never to the same companion two nights running.",
                "A companion only asks for nights you have already walked: while the stages it needs (their King, their guardian) lie past your record, they are not in the list."
              ]
            }
          ]
        },
        { id: "held", title: "Held by the night itself", blocks: ["While the word stands, what it forbids is refused (the hire, the strike, the power, the purchase) and a message says why. The autopilot and the catch-ups respect it too: every promise can be kept without being there. Only you can break it, on purpose (a confirmed key in the Sanctum) or by calling the dusk too early."] },
        {
          id: "kept",
          title: "Kept or broken",
          blocks: [
            "A promise is **kept** at dusk if what it asks was done **and a King fell** that night (at the head of the night, after the word was given).",
            {
              list: [
                "**Each word kept doubles that companion's damage**, for good, up to five words (×32). After their five, they ask no more.",
                "Their words join the Chronicle the first time.",
                "The night counts **2 nights** of Recognition for them (instead of one) if they reached level 100 and their memories were still waiting for a word (two per companion: one for the 4th memory, one for the 5th)."
              ]
            },
            "**Broken**, nothing is lost: nothing is forbidden any more, the word doubles nothing, the night counts like any other, and their medallion keeps an undone knot until dusk."
          ]
        },
        { id: "list", title: "What each one asks", blocks: [{ slot: "promises" }] },
        { id: "tips", title: "Tips", blocks: [{ list: ["Start with the promises your style gives for free: Ysolde (no strike) if you let the game run, Nyx (no power) a night you will be away, Célestine (no crystal) overnight.", "The \"without X\" asks are easy: just do not hire one companion, the ones after still join.", "Oriane and Lysandre ask you to go far: keep them for a night you know you can push.", "The **Word Kept** board counts every promise your game has kept."] }] }
      ]
    }),
    relics: (f) => ({
      lead: "Four slots, five rarities, a forge and shards to pay for it all: everything about gear.",
      sections: [
        { id: "slots", title: "The four slots", blocks: ["Each slot has a fixed main stat. Damage to bosses applies to strikes and to companion DPS against elites and guardians.", { slot: "slots" }] },
        {
          id: "rarities",
          title: "Rarities and bonuses",
          blocks: [
            "A relic has 1 to 4 bonuses by rarity; legendary and mythic add an ascension essence bonus. Its power grows with the stage it dropped at.",
            { slot: "rarities" },
            "The totals of your four relics are capped to keep the balance:",
            { slot: "caps" }
          ]
        },
        {
          id: "density",
          title: "Density and \"Company ×N\"",
          blocks: [
            "The deeper the stratum a relic comes from, the **denser** it is: worn, it multiplies the company's damage (and your strike's share of it) by ×1.03 per stratum below the present night. Four relics from the last stratum give about ×1,000; from stratum 21 (stage 1,000), about ×11.",
            "Each relic shows a single figure, **Company ×N**: what it multiplies in your company's damage against the slot left empty. The pack compares it with the relic worn and sorts by it. Gold, strike, crits and damage to guardians stay listed apart."
          ]
        },
        {
          id: "drops",
          title: "Where to find them",
          blocks: [
            {
              list: [
                "**Guardians**: 40% chance (guaranteed on the first clear), and `1 + stage/25` shards.",
                "**Elites**: 15% chance, and 1 shard about one time in three.",
                "Only the furthest boss of the night drops relics and shards: a boss replayed from the map pays gold only.",
                "The stall's chests, the Seam, the King's Eclipse and the companions' gifts.",
                "A relic dropped goes straight into an empty slot."
              ]
            }
          ]
        },
        {
          id: "forge",
          title: "Forge and salvage",
          blocks: [
            `The **forge** raises a relic up to +${f.forgeMax}: each level adds 10% of their base value to all its bonuses. Cost: \`rarity × 2 × 1.35^forge\` shards.`,
            { slot: "forge" },
            `**Salvaging** gives back the rarity's shards (1, 3, 8, 25, 80) plus 50% per forge level. Relics can be locked, salvaged in bulk up to a rarity, and the pack holds ${f.inventory} (full, it salvages new ones on its own).`
          ]
        },
        { id: "market", title: "The Stallkeeper's stall", blocks: ["The Stallkeeper sells for shards (and tells you one of their twelve sayings each visit). Potions last 10 min and stack without limit. A chest bought opens before your eyes. The Stallkeeper's Token takes 10% off every price.", { slot: "market" }, { tip: "The Golden Hourglass pays an hour of gold at your current rate: early in a night, when your gold quickly catches up with prices, it is the best buy at the stall." }] },
        { id: "caravan", title: "The Caravan", blocks: ["From your 3rd ascension, the Stallkeeper's Caravan brings one ware a week, the same for everyone (it changes every Monday). Each is bought once a week; the Token, once a game.", { slot: "caravan" }] },
        { id: "named", title: `The ${f.namedRelics} named relics`, blocks: ["Legendary or mythic, each has a fixed source, a legend and a unique effect. They drop only once per game, arrive locked and find room even in a full pack.", { slot: "named" }] },
        {
          id: "regalia",
          title: "The Regalia and the Crown",
          blocks: ["The Signet of Orvane, the Mantle of the Last Court and the Last Decree make the **Regalia of Orvane**. With all three worn, the King knows you (his words change) and takes 10% more damage.", { slot: "crown" }]
        }
      ]
    }),
    idle: (f) => ({
      lead: "Idlebound is made to run while you work, study or play something else. Here is exactly what your company does without you.",
      sections: [
        {
          id: "open",
          title: "Page open, you elsewhere",
          blocks: [
            "After 60 seconds without any action, the **autopilot** takes over once a minute: your companions spend the gold and, once they can beat the boss that stopped them, turn Auto back on to try again. Until then, they train on the stage before.",
            {
              list: [
                "The next companion is hired as soon as the gold allows.",
                "Then each purchase is weighed in DPS gained per gold: a companion's levels up to their next breakpoint, with or without the talents they unlock. The best is bought; if it is out of reach but within 5 minutes of gold, the company puts gold aside for it.",
                "A talent that adds no damage (gold, crits, timer, treasure) is bought once it costs 10% of the gold at most.",
                "Aldric is never levelled. The \"Spend while away\" switch (top of the companions panel) turns all of this off: the gold is then kept."
              ]
            }
          ]
        },
        { id: "hidden", title: "Page hidden, computer asleep", blocks: [`When the page wakes after more than 5 seconds, the time elapsed is simulated at once (up to ${f.offlineHours} h), exactly as the autopilot would have played it: one-minute slices, purchases between slices, stages pushed until a boss too strong. The company fights alone: the Patience bonus in full, but no strikes, powers, crystals or potions.`] },
        {
          id: "closed",
          title: "Game closed",
          blocks: [
            `With the game closed (account or guest), the company still walks: when it opens again, the time since the game was last kept is caught up the same way (${f.offlineHours} h at most, +1 h per level of the Long Thread), never more than the server saw pass. An 8 h catch-up takes a tenth or two of a second.`,
            "An open page keeps the game every 30 s: reloading loses nothing."
          ]
        },
        {
          id: "reunion",
          title: "The Reunion",
          blocks: [
            `Back after ${f.reunionMinutes} min away or more, your first action brings the **Reunion**: company damage ×${f.reunionDps} for a sixth of your absence (an hour at most; a night gives the full hour).`,
            "With it comes **the company's account**: time away, road walked, gold earned and spent, walls met then passed, who joined, levels gained, and the boss still barring the road. It ends on a Chronicle fragment not read yet."
          ]
        },
        { id: "presence", title: "What your presence adds", blocks: ["No penalty is applied to the absent. Your presence adds what only a hand can do: crystals, powers, faster purchases, ascensions, altars, the stall, gear and the forge. And the [Promise](promise): the autopilot never breaks it, it can only keep it."] }
      ]
    }),
    bestiary: (f) => ({
      lead: `${f.creatures} creatures, on seven pages: the five biomes, Beyond the Road and the Twelve Kings. Each has three lines from the Ledger, revealed by beating it again and again.`,
      sections: [
        {
          id: "how",
          title: "How the Bestiary fills",
          blocks: [
            {
              list: [
                "Three lines per creature, at 1, 100 and 1,000 wins (1, 5 and 25 for rare wanderers and event creatures; 1, 10 and 100 for the King's forms).",
                "Meeting every creature of a biome's page gives **+1% gold** (five pages, +5%).",
                "Wins made in bulk (catch-up, Altar of the Wanderer, the Rout) are spread over the stage's creatures.",
                "In play, the Bestiary is in the Hall, from the first creature met; the others are silhouettes there."
              ]
            }
          ]
        },
        { id: "pages", title: "Every creature", blocks: [{ slot: "pages" }] },
        { id: "eras", title: "Strata and prefixes", blocks: ["Each loop of the five biomes is a new stratum: the same creatures, much tougher, carry their stratum's prefix (Echo, Ash, Void…) and change their look with each Age. Each page shows the creature through the Ages. See [Strata, Ages and Kings](strata)."] }
      ]
    }),
    biomes: () => ({
      lead: "A night crosses five biomes of ten stages each, from the abandoned farm to the King's throne. Then the road starts over, one stratum down.",
      sections: [
        { id: "list", title: "The five biomes", blocks: [{ slot: "biomes" }] },
        { id: "echoes", title: "Echoes of the road", blocks: ["Each biome keeps twelve echoes written by hand, then others the night composes. A guardian's first clear brings one back: always the first, then a 15% chance, +5% per stratum. They show under each biome, as your game brings them back."] }
      ]
    }),
    strata: (f) => ({
      lead: `Every ${f.stagesPerEra} stages, the road sinks one stratum deeper: ${f.eras} strata, grouped into ${f.ages} Ages of five, from the present to the Dawn.`,
      sections: [
        {
          id: "how",
          title: "What a stratum is",
          blocks: [
            "Each full loop of the five biomes (50 stages) begins a new stratum, with its own name and prefix. Its monsters are far tougher, and each Age changes how the night draws them, scenes included. Every stratum wears the places down a little more.",
            "At the end of each stratum, the King guards the 50th stage. His first fall in a stratum brings back that stratum's **keystone**: a fragment of the Chronicle."
          ]
        },
        { id: "ages", title: `The ${f.ages} Ages`, blocks: [{ slot: "ages" }] },
        { id: "kings", title: "The twelve forms of the King", blocks: ["The guardian of every 50th stage is the King, in the form of the stratum's Age. Same strength in every form: only his look, his name and his words change.", { slot: "kings" }] },
        { id: "list", title: `The ${f.eras} strata`, blocks: [{ slot: "strata" }] },
        { id: "dawn", title: "The Dawn", blocks: [`At stage ${en(f.dawnStage)}, the Dawn stands in the King's place. The road does not stop there: below it, the night draws itself again from its first stratum, deeper with every round.`, { slot: "dawn" }] }
      ]
    }),
    events: () => ({
      lead: "The Long Night is not just a straight road. Twelve events cross it, each with its trigger, its reward and a fragment the first time.",
      sections: [
        { id: "rules", title: "Common rules", blocks: ["Events only happen in a visible page, never during a catch-up, and follow the engine's chance (the same for a given game, even after a reload). A message announces them."] },
        { id: "list", title: "The twelve events", blocks: [{ slot: "events" }] },
        { id: "caravan", title: "The Caravan, week after week", blocks: ["The week's ware is the same for everyone, chosen by the ISO week. All its wares are detailed in [Relics, forge and market](relics#caravan)."] }
      ]
    }),
    chronicle: (f) => ({
      lead: "Idlebound's story is told in fragments, laid over its mechanics. Nothing is stored as text: your game keeps counters, and the n-th fragment of a source is always the same.",
      sections: [
        {
          id: "sources",
          title: "Where fragments come from",
          blocks: [
            {
              list: [
                "**The keystones** of the 60 strata (each King's first fall), then their second reading with every Descent.",
                "**The milestones** of your story: ascensions 1, 5, 10, 25, 50, 100; Descents 1, 3, 5, 10; the first companions who remember.",
                "**The King's Words**, one per ascension: 50 written by hand, then his voice composed by the night. The seven words of his Eclipse, and twelve words for whoever wears his Regalia.",
                "**The echoes** of the road (12 per biome) and **the Age echoes** (8 per Age), brought back by guardians, Seams and the Quiet.",
                "Rare wanderers, events, Recognition memories, words kept, Aldric's Lessons, Célestine's songs (5% of crystals once she is met), what stays after an absence, the Stallkeeper's sayings, the legends of named relics and altars, the secrets and the Crown."
              ]
            },
            "A message announces a fragment at most once a minute (keystones and milestones always); the others wait in the Chronicle, in the Hall, marked as new. The Frayed Edge, Oriane's Ear and Remembrance Nights make them more frequent."
          ]
        },
        {
          id: "recognition",
          title: "Recognition",
          blocks: [
            `A night where a companion reaches level 100 counts toward their Recognition (two nights if you kept a promise they were waiting for). Tiers: ${f.recognitionTiers} nights, one less per level of Kinship.`,
            { slot: "recognition" },
            "Every companion greets you as they join: as a stranger, half remembered (tiers 1 and 2) or remembered (tier 3 and up). Each [companion](companions) page gives their memories."
          ]
        },
        { id: "first-dusk", title: "The Ledger's scenes", blocks: ["At a few key moments, a short scene of a few shots plays over the game, which runs on beneath. Every scene lived can be watched again in the Chronicle, \"What the Ledger saw\".", { slot: "scenes" }] },
        { id: "king-words", title: "The King's Words", blocks: ["At each ascension, the King leaves a word. The first fifty are written by hand; each is found at the ascension of its number.", { slot: "kingWords" }] },
        { id: "milestones", title: "Milestones", blocks: [{ slot: "milestones" }] },
        { id: "lessons", title: "Aldric's Lessons", blocks: ["The first purchase of each of Aldric's seven talents leaves a Lesson.", { slot: "lessons" }] }
      ]
    }),
    deeds: (f) => ({
      lead: `${f.achievements} deeds: series that strengthen your company for good, and ${f.secrets} secrets that give nothing but the joy of finding them.`,
      sections: [
        { id: "bonus", title: "What they give", blocks: ["Each deed of a series gives a permanent DPS bonus: +2% (+3% for stages, ascensions and essences, +5% for the mythic one). The two highest tiers of each series are worth 2.5 times more. Your strike gets half of it. Secret deeds give no bonus."] },
        { id: "series", title: "Every series", blocks: [{ slot: "series" }] },
        { id: "secrets", title: `The ${f.secrets} secrets`, blocks: ["In play, a secret shows as \"???\" with its riddle until you find it. The answers are hidden: open only the ones you want.", { slot: "secrets" }] }
      ]
    }),
    descent: (f) => ({
      lead: `The second rebirth, for the long run. At stage ${en(f.descentStage)}, Eldra shows you her Loom: you unweave essences and altars into threads, and take the night up again further down.`,
      sections: [
        { id: "unlock", title: "When it opens", blocks: [`The Loom opens once your record reaches stage ${en(f.descentStage)}, announced once. Without a Descent, you get there in about a week of play, where the road slows down for good.`] },
        { id: "what", title: "What it resets", blocks: [{ list: ["**Reset**: everything an ascension clears, plus essences and altars.", "**Kept**: relics, shards, deeds, the Chronicle, the Bestiary, Recognition, lifetime statistics and your record."] }] },
        {
          id: "threads",
          title: "Threads",
          blocks: [
            "The thread is as long as the night has gone deep. Woven in all: `2^((best stage - 750) / 250)`, rounded down. A Descent weaves what your best stage adds to the threads already woven: a night no deeper than the last weaves nothing.",
            { slot: "threads" }
          ]
        },
        { id: "weaves", title: "Weaves", blocks: ["At the Loom, threads buy permanent Weaves (price: `base × growth^level`, rounded up) that nothing unweaves.", { slot: "weaves" }, "The Warp of Plenty is the one Weave that compounds. Its price grows by a fifth a level while the thread doubles with every Age: each Age buys fewer levels than the last, with no runaway. Each Descent also reopens the strata's keystones for a second reading."] },
        {
          id: "strategy",
          title: "When to descend",
          blocks: ["The first Descent sets you back for a day or two, then pulls you ahead of the walker who never descends. The simulations: descending once an Age (8 threads at least) goes further than descending too often, which pays the climb back too many times.", "The **Rewoven Nights** board counts the Descents that wove at least one thread: a Descent that weaves nothing does not count. It rewards your pace at the Loom, not your depth.", { slot: "crown" }]
        }
      ]
    }),
    account: () => ({
      lead: "Your game lives on the server, with or without an account. Here is how it is kept, checked and ranked.",
      sections: [
        { id: "guest", title: "Playing without an account", blocks: ["You can play at once. From your first strike, the game is kept on the server and your browser finds it again, even days later. A guest's game is deleted after 30 days without a visit, and is never ranked."] },
        {
          id: "account",
          title: "Creating an account",
          blocks: [
            "An e-mail, a name and a password, nothing else. Your game then follows you on every device and enters the leaderboard. If you were playing as a guest, your game joins the account (or you choose which one to keep if they differ: nothing is ever overwritten silently).",
            "If a confirmation e-mail is sent, confirm it within 3 days: after that, the game is no longer kept until the address is confirmed (the game stays playable)."
          ]
        },
        { id: "keeping", title: "A game always kept", blocks: ["Nothing is stored in your browser: the game is on the server, kept every 30 s and after every important action. If the server cannot be reached, the game goes on and tries again. Two devices open on the same game? The one that did not see the last version kept lets you choose."] },
        { id: "verified", title: "A verified game", blocks: ["Every game it receives is recomputed by the server with the same engine as the game: gold earned and spent, essences, play time, the pace of strikes and wins, bosses beatable, loot, deeds. An impossible game is refused. That is what makes the leaderboard trustworthy."] },
        { id: "boards", title: "The Roll of the Bound", blocks: ["The public leaderboard has four boards. On a tie, whoever got there first ranks higher.", { slot: "boards" }] },
        { id: "settings", title: "Settings", blocks: ["Language, number notation (letters, scientific, engineering), sound and volume, damage numbers, reduced motion, colorblind colors, ascension confirmation. The game also installs as an app on phones."] }
      ]
    })
  }
});
