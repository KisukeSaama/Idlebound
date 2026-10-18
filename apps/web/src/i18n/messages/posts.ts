import type { ArtSpec } from "../../game/pixel/Art";
import type { RouteId } from "../routing";

/** One line of a change: what it touches, then its value before and after, or what it does now. */
export type NewsChange = { label: string; before: string; after: string } | { label: string; text: string };

/** How a change feels to the walker, shown as a tag beside its name. */
export type NewsTag = "new" | "up" | "down" | "changed" | "fixed";

/** One picture of a figure: world art drawn by code, standing in a scene if one is given, and the few words under it. */
export type NewsArt = { spec: ArtSpec; scene?: ArtSpec; label?: string };

/**
 * One block of an article: a paragraph, a heading, a bulleted list, or an entry. An entry is
 * the patch note's card: the thing it touches, a tag, a line of context saying why, and its
 * changes, each with the numbers the walker will see. A figure shows the change in the world's
 * own art. A compare slides between two frozen pictures of the same place (`/news/<version>/`),
 * before and after a change of art the generator no longer draws the old way. A spoiler holds
 * what the road keeps for later: veiled until the reader asks.
 */
export type NewsBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "entry"; name: string; tag: NewsTag; context?: string; changes: NewsChange[] }
  | { kind: "figure"; art: NewsArt[]; caption: string }
  | { kind: "compare"; before: string; after: string; alt: { before: string; after: string }; caption: string }
  | { kind: "spoiler"; label: string; body: NewsBlock[] };

/** The words of an article in one language. `link` closes it with a call to a page of the site. */
export type NewsText = { title: string; summary: string; body: NewsBlock[]; link?: { route: RouteId; label: string } };

/** The picture of an article: a biome of the road, and a creature standing in it. */
export type NewsCover = { biome: string; creature?: string };

/**
 * A news article. A patch note names the version it covers (`v1.0`); an announcement
 * has none. `date` is the day it goes out (YYYY-MM-DD). Its cover shows only what the landing
 * page already shows: the first creatures and the five biomes.
 */
export type NewsPost = { slug: string; date: string; kind: "patch" | "announcement"; version?: string; cover: NewsCover; fr: NewsText; en: NewsText };

/**
 * Every article of the news pages, newest first. Written for the public: what changes for the
 * walker, never how it is built. Read on the server only, so the game never carries them.
 */
export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "patch-notes-2-0",
    date: "2026-10-19",
    kind: "patch",
    version: "v2.0",
    cover: { biome: "green-plains", creature: "carrion-crow" },
    fr: {
      title: "Notes de mise à jour 2.0",
      summary: "Tout le monde porte enfin la même main : créatures, compagnons, lieux et reliques, tout est repeint dans le trait du Rat des champs.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Les premières créatures de la route, le Rat des champs, le Sanglier, le Loup d'ombre, sont nées de vraies peintures. Les suivantes ont été dessinées sans, et ça se voyait : à côté du Rat, beaucoup semblaient venir d'un autre monde. La 2.0 répare ça. Les créatures d'abord, puis les compagnons, les lieux et les objets ont été repeints dans la même main que les premières, puis remis en pixels, pour que toute la nuit se ressemble enfin." },
        { kind: "h2", text: "Nouveau" },
        {
          kind: "entry",
          name: "Le bestiaire",
          tag: "changed",
          context: "Une créature, c'est ce que tu frappes toute la nuit. Elle mérite d'être aussi belle que la première que tu as croisée.",
          changes: [
            { label: "Les Plaines verdoyantes", text: "le Corbeau charognard, l'Épouvantail creux, la Phalène-lanterne, le Lièvre du crépuscule, le Dernier Faucheur, le Berger égaré et le Rat doré, repeints" },
            { label: "Les quatre autres lieux", text: "toutes les créatures qui n'avaient pas de portrait peint, repeintes" },
            { label: "Les créatures des averses et des rencontres", text: "repeintes aussi" },
            { label: "Ce qui change", text: "la même fourrure, les mêmes plumes, la même pierre que le Rat des champs, le même liseré de lune, les mêmes yeux qui brillent dans l'ombre" },
            { label: "Ce qui ne change pas", text: "chaque créature garde sa place sur la route, son rang, sa taille et son histoire" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "creature", id: "carrion-crow" }, scene: { kind: "scene", biome: "green-plains" }, label: "Corbeau charognard" },
            { spec: { kind: "creature", id: "lantern-moth" }, scene: { kind: "scene", biome: "green-plains" }, label: "Phalène-lanterne" },
            { spec: { kind: "creature", id: "mourning-owl" }, scene: { kind: "scene", biome: "dark-forest" }, label: "Chouette endeuillée" }
          ],
          caption: "Trois des créatures repeintes, chacune chez elle."
        },
        {
          kind: "compare",
          before: "/news/2-0/crow-before.png",
          after: "/news/2-0/crow-after.png",
          alt: { before: "Le Corbeau charognard avant : une silhouette sombre et lisse, couchée sur une gerbe", after: "Le Corbeau charognard après : ailes levées, plumes en lambeaux, bec gris ouvert sur la gerbe dorée" },
          caption: "Le Corbeau charognard : fais glisser pour le voir avant et après."
        },
        {
          kind: "compare",
          before: "/news/2-0/toad-before.png",
          after: "/news/2-0/toad-after.png",
          alt: { before: "Le Crapaud putride avant : une masse verte aplatie dans la vase", after: "Le Crapaud putride après : un crapaud énorme dressé sur ses pattes palmées, ses verrues crevées de violet" },
          caption: "Le Crapaud putride, dans le marais."
        },
        {
          kind: "compare",
          before: "/news/2-0/page-before.png",
          after: "/news/2-0/page-after.png",
          alt: { before: "Le Page creux avant : une livrée rouge sous une flamme violette", after: "Le Page creux après : un page en livrée rouge et or, le visage creux, la lettre tendue" },
          caption: "Le Page creux, dans le donjon."
        },
        { kind: "h2", text: "Tout le reste du monde" },
        {
          kind: "entry",
          name: "La compagnie",
          tag: "changed",
          context: "Ceux qui marchent avec toi méritent d'avoir un vrai visage.",
          changes: [
            { label: "Les portraits", text: "chaque compagnon repeint, visage, regard et costume, dans ses propres couleurs" },
            { label: "Aldric", text: "repeint dans chaque pose : en garde, en marche, à la fente" }
          ]
        },
        {
          kind: "compare",
          before: "/news/2-0/maelle-before.png",
          after: "/news/2-0/maelle-after.png",
          alt: { before: "Le portrait de Maëlle avant : un visage simple aux traits dessinés", after: "Le portrait de Maëlle après : capuche verte, tresse cuivrée, sourire en coin" },
          caption: "Maëlle, avant et après."
        },
        {
          kind: "entry",
          name: "Les lieux",
          tag: "changed",
          context: "La route traverse des endroits qui ont une histoire. Ils devaient en avoir l'air.",
          changes: [
            { label: "Bâtiments et ruines", text: "la forge de Brom, la cabane de l'arbre, les chevalements des mines, la maison sur pilotis, la porterie du donjon et tout le reste, repeints" },
            { label: "Au fil des Âges", text: "ils s'effondrent toujours, et le lierre et la mousse les gagnent comme avant" },
            { label: "Au loin", text: "les silhouettes vers lesquelles mène la route, repeintes" },
            { label: "Le Sanctuaire du Crépuscule", text: "ses menhirs et ses treize autels, repeints" }
          ]
        },
        {
          kind: "compare",
          before: "/news/2-0/forge-before.png",
          after: "/news/2-0/forge-after.png",
          alt: { before: "La forge de Brom avant : des murs lisses, un toit uni", after: "La forge de Brom après : chaume moussu, pierres taillées, le foyer qui rougeoie" },
          caption: "La forge de Brom, au carrefour des plaines."
        },
        {
          kind: "compare",
          before: "/news/2-0/keep-before.png",
          after: "/news/2-0/keep-after.png",
          alt: { before: "Les ruines du donjon avant : des murs à plat", after: "Les ruines du donjon après : pierre taillée, lierre, fenêtres violettes" },
          caption: "Les ruines du donjon d'Orvane."
        },
        {
          kind: "entry",
          name: "Les objets",
          tag: "changed",
          context: "Une relique que tu gardes des heures doit être belle à regarder.",
          changes: [
            { label: "Les reliques", text: "chaque relique repeinte, de la commune ébréchée à la mythique de verre céleste, et chaque relique nommée" },
            { label: "Les icônes", text: "autels, pouvoirs, étal et Roulotte repeints, et deux fois plus fins" },
            { label: "Les coffres et la besace", text: "repeints" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "common" }, label: "Commune" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "rare" }, label: "Rare" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "epic" }, label: "Épique" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "legendary" }, label: "Légendaire" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "mythic" }, label: "Mythique" }
          ],
          caption: "Une même épée, de commune à mythique."
        },
        {
          kind: "spoiler",
          label: "Les formes du roi",
          body: [
            {
              kind: "entry",
              name: "Le roi, plus loin sur la route",
              tag: "changed",
              context: "Celui qui t'attend au bout de chaque Âge devait être le plus soigné de tous.",
              changes: [{ label: "Ses formes des Âges suivants", text: "repeintes dans la même main que le Roi déchu" }]
            },
            {
              kind: "figure",
              art: [
                { spec: { kind: "creature", id: "titan-king", animated: false }, scene: { kind: "scene", biome: "fallen-king-ruins" }, label: "Le Roi-Titan" },
                { spec: { kind: "creature", id: "hallowed-king", animated: false }, scene: { kind: "scene", biome: "fallen-king-ruins" }, label: "Le Roi consacré" }
              ],
              caption: "Deux de ses formes."
            }
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. Va revoir tes vieilles connaissances : elles ont changé de visage, pas de caractère. Bonne route." }
      ],
      link: { route: "play", label: "Reprendre la route" }
    },
    en: {
      title: "Patch notes 2.0",
      summary: "The whole world finally shares one hand: creatures, companions, places and relics, all repainted in the Field Rat's line.",
      body: [
        { kind: "p", text: "Good evening, walker. The first creatures of the road, the Field Rat, the Boar, the Shade Wolf, were born from real paintings. Those that came after were drawn without one, and it showed: next to the Rat, many seemed to come from another world. 2.0 mends that. The creatures first, then the companions, the places and the objects have been repainted in the same hand as the first ones, then set back into pixels, so the whole night finally looks like one world." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "The bestiary",
          tag: "changed",
          context: "A creature is what you strike all night long. It deserves to look as good as the first one you ever met.",
          changes: [
            { label: "The Verdant Plains", text: "the Carrion Crow, the Hollow Scarecrow, the Lantern Moth, the Dusk Hare, the Last Reaper, the Lost Shepherd and the Golden Rat, repainted" },
            { label: "The four other places", text: "every creature that had no painted portrait, repainted" },
            { label: "The creatures of storms and encounters", text: "repainted as well" },
            { label: "What changes", text: "the same fur, feathers and stone as the Field Rat, the same moonlit rim, the same eyes glowing in the dark" },
            { label: "What stays", text: "every creature keeps its place on the road, its rank, its size and its story" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "creature", id: "carrion-crow" }, scene: { kind: "scene", biome: "green-plains" }, label: "Carrion Crow" },
            { spec: { kind: "creature", id: "lantern-moth" }, scene: { kind: "scene", biome: "green-plains" }, label: "Lantern Moth" },
            { spec: { kind: "creature", id: "mourning-owl" }, scene: { kind: "scene", biome: "dark-forest" }, label: "Mourning Owl" }
          ],
          caption: "Three of the repainted creatures, each at home."
        },
        {
          kind: "compare",
          before: "/news/2-0/crow-before.png",
          after: "/news/2-0/crow-after.png",
          alt: { before: "The Carrion Crow before: a smooth dark shape lying over a sheaf", after: "The Carrion Crow after: wings raised, ragged feathers, grey beak open over the golden sheaf" },
          caption: "The Carrion Crow: slide to see it before and after."
        },
        {
          kind: "compare",
          before: "/news/2-0/toad-before.png",
          after: "/news/2-0/toad-after.png",
          alt: { before: "The Rot Toad before: a flat green mass in the mud", after: "The Rot Toad after: a huge toad raised on webbed hands, its warts burst violet" },
          caption: "The Rot Toad, in the mire."
        },
        {
          kind: "compare",
          before: "/news/2-0/page-before.png",
          after: "/news/2-0/page-after.png",
          alt: { before: "The Hollow Page before: a red livery under a violet flame", after: "The Hollow Page after: a page in red and gold livery, its face hollow, its letter held out" },
          caption: "The Hollow Page, in the Keep."
        },
        { kind: "h2", text: "The rest of the world" },
        {
          kind: "entry",
          name: "The company",
          tag: "changed",
          context: "Those who walk with you deserve a real face.",
          changes: [
            { label: "Portraits", text: "every companion repainted, face, gaze and garb, in their own colors" },
            { label: "Aldric", text: "repainted in every pose: on guard, walking, lunging" }
          ]
        },
        {
          kind: "compare",
          before: "/news/2-0/maelle-before.png",
          after: "/news/2-0/maelle-after.png",
          alt: { before: "Maëlle's portrait before: a plain face with drawn features", after: "Maëlle's portrait after: green hood, copper braid, a crooked smile" },
          caption: "Maëlle, before and after."
        },
        {
          kind: "entry",
          name: "The places",
          tag: "changed",
          context: "The road crosses places with a story. They had to look like it.",
          changes: [
            { label: "Buildings and ruins", text: "Brom's forge, the tree-house, the mine head-frames, the house on stilts, the Keep's gatehouse and all the rest, repainted" },
            { label: "Through the Ages", text: "they still crumble, and ivy and moss still take them as before" },
            { label: "In the distance", text: "the silhouettes the road leads to, repainted" },
            { label: "The Sanctum of Dusk", text: "its standing stones and thirteen altars, repainted" }
          ]
        },
        {
          kind: "compare",
          before: "/news/2-0/forge-before.png",
          after: "/news/2-0/forge-after.png",
          alt: { before: "Brom's forge before: smooth walls, a plain roof", after: "Brom's forge after: mossy thatch, dressed stone, the hearth glowing" },
          caption: "Brom's forge, at the crossroads of the plains."
        },
        {
          kind: "compare",
          before: "/news/2-0/keep-before.png",
          after: "/news/2-0/keep-after.png",
          alt: { before: "The Keep's ruins before: flat walls", after: "The Keep's ruins after: dressed stone, ivy, violet windows" },
          caption: "The ruins of Orvane Keep."
        },
        {
          kind: "entry",
          name: "The objects",
          tag: "changed",
          context: "A relic you keep for hours should be a pleasure to look at.",
          changes: [
            { label: "Relics", text: "every relic repainted, from the chipped common to the mythic of sky-glass, and every named relic" },
            { label: "Icons", text: "altars, powers, the stall and the Caravan repainted, and twice as fine" },
            { label: "Chests and the satchel", text: "repainted" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "common" }, label: "Common" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "rare" }, label: "Rare" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "epic" }, label: "Epic" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "legendary" }, label: "Legendary" },
            { spec: { kind: "relic", slot: "weapon", base: 2, rarity: "mythic" }, label: "Mythic" }
          ],
          caption: "One sword, from common to mythic."
        },
        {
          kind: "spoiler",
          label: "The King's forms",
          body: [
            {
              kind: "entry",
              name: "The King, further down the road",
              tag: "changed",
              context: "The one who waits at the end of every Age had to be the most carefully drawn of all.",
              changes: [{ label: "His forms of the later Ages", text: "repainted in the same hand as the Fallen King" }]
            },
            {
              kind: "figure",
              art: [
                { spec: { kind: "creature", id: "titan-king", animated: false }, scene: { kind: "scene", biome: "fallen-king-ruins" }, label: "The Titan King" },
                { spec: { kind: "creature", id: "hallowed-king", animated: false }, scene: { kind: "scene", biome: "fallen-king-ruins" }, label: "The Hallowed King" }
              ],
              caption: "Two of his forms."
            }
          ]
        },
        { kind: "p", text: "Thank you for walking with us. Go and see your old acquaintances: they have changed faces, not tempers. Safe travels." }
      ],
      link: { route: "play", label: "Back on the road" }
    }
  },
  {
    slug: "patch-notes-1-3",
    date: "2026-10-17",
    kind: "patch",
    version: "v1.3",
    cover: { biome: "forgotten-caves" },
    fr: {
      title: "Notes de mise à jour 1.3",
      summary: "Les reliques se souviennent : ce qu'elles ont fait, qui les portait, d'où elles viennent. Brom les réveille, et ta compagnie te garde une besace pendant ton absence.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Jusqu'ici, une relique, c'était un nom, une couleur et quelques pourcentages : on la regardait à peine avant de la recycler. La 1.3 change ça. Une relique bien souvenue revient avec son histoire : ce qu'elle a fait, la main qui la tenait, le lieu d'où elle vient. Et parce qu'on s'attache à ce qui a une histoire, une relique aimée ne devient plus jamais trop vieille." },
        { kind: "h2", text: "Ce que les reliques se rappellent" },
        {
          kind: "entry",
          name: "Les traits",
          tag: "new",
          context: "Plus une relique est bien souvenue, plus elle se rappelle ce qu'elle a fait. Une épique ou mieux le refait dans ta main.",
          changes: [
            { label: "Épique, légendaire", text: "un trait de son emplacement, son effet tant que tu la portes, plus fort à chaque rareté" },
            { label: "Mythique", text: "deux traits" },
            { label: "L'arme, la force de la compagnie", text: "Avant-garde, la Troupe, Débandade, Cadence" },
            { label: "L'armure, face aux gardiens", text: "Rempart, Vieilles cicatrices, Butin, Verre du ciel, Régicide" },
            { label: "L'amulette, le rythme de la nuit et de ta main", text: "Attention, Second souffle, le Fil, Ami de Messire Pip, Appel de l'averse" },
            { label: "L'anneau, la fortune et l'absence", text: "Fortune, Retour au feu, Bonne étoile, Besace profonde, Veille" },
            { label: "Sur chaque carte", text: "le nom du trait dans la couleur de la relique, puis ce qu'il fait, en clair" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 1, rarity: "epic" }, label: "Épique" },
            { spec: { kind: "relic", slot: "armor", base: 3, rarity: "legendary" }, label: "Légendaire" },
            { spec: { kind: "relic", slot: "amulet", base: 2, rarity: "mythic" }, label: "Mythique" }
          ],
          caption: "Une épique se souvient d'un trait, une mythique de deux."
        },
        {
          kind: "entry",
          name: "La mémoire d'un compagnon",
          tag: "new",
          context: "Une légende a toujours quelqu'un pour la raconter.",
          changes: [
            { label: "Légendaire et mythique", text: "elle se souvient d'un compagnon déjà venu dans ta compagnie" },
            { label: "Ce compagnon, tant que tu la portes", text: "×1,5 dégâts (légendaire), ×2 (mythique)" }
          ]
        },
        {
          kind: "entry",
          name: "Les parures",
          tag: "new",
          context: "Les reliques d'un même lieu se souviennent les unes des autres.",
          changes: [
            { label: "Le lieu d'une relique", text: "le biome où elle est tombée, que son nom dit déjà (« sylvestre », « fangeuse »…)" },
            { label: "2 puis 4 reliques d'un lieu portées ensemble", text: "une parure s'éveille, puis une plus forte" },
            { label: "Parure des plaines", text: "plus d'or, et des rats dorés à quatre" },
            { label: "Parure sylvestre", text: "un bonus de Patience plus fort" },
            { label: "Parure des profondeurs", text: "plus d'éclats, et plus de reliques à quatre" },
            { label: "Parure fangeuse", text: "plus de temps contre les élites et les gardiens" },
            { label: "Parure royale", text: "plus de dégâts contre le roi" }
          ]
        },
        {
          kind: "entry",
          name: "Densité",
          tag: "changed",
          context: "Un souvenir flou pèse peu, même venu de très loin. Un mythe pèse de tout son poids.",
          changes: [
            { label: "Par strate sous la nuit présente", before: "×1,03 pour toutes les reliques", after: "×1,02 commune, ×1,024 rare, ×1,027 épique, ×1,03 légendaire, ×1,032 mythique" },
            { label: "Compagnie ×N", text: "compte désormais les traits, la mémoire et les parures" }
          ]
        },
        { kind: "h2", text: "Ce que tu en fais" },
        {
          kind: "entry",
          name: "Le Réveil",
          tag: "new",
          context: "Une relique que tu aimes ne devrait jamais rester derrière toi.",
          changes: [
            { label: "À la forge", text: "Brom réveille une relique à ta nuit la plus profonde, dans le même lieu" },
            { label: "Elle garde", text: "ses bonus, ses traits, sa mémoire et sa parure" },
            { label: "Elle prend", text: "la densité de cette profondeur, et ses bonus grandissent comme si elle y était tombée" },
            { label: "Prix par strate descendue", text: "20, 60, 160, 500 ou 1 600 éclats, de commune à mythique" }
          ]
        },
        {
          kind: "entry",
          name: "La besace de la compagnie",
          tag: "new",
          context: "Pendant ton absence, la compagnie ramasse ce que les gardiens laissent sur la route. Elle te le garde.",
          changes: [
            { label: "Page cachée ou jeu fermé", before: "aucune relique", after: "les gardiens et les élites franchis laissent leurs reliques aux chances habituelles" },
            { label: "La besace", text: "garde les 6 plus précieuses, les autres deviennent des éclats" },
            { label: "Aux Retrouvailles", text: "ouvre-la : les reliques en sortent une à une, cachées jusqu'à ce que tu les touches, la plus rare en dernier" },
            { label: "Avant même de l'ouvrir", text: "la lumière de la plus précieuse filtre sous le rabat" }
          ]
        },
        {
          kind: "figure",
          art: [{ spec: { kind: "satchel" }, label: "La besace" }],
          caption: "Elle t'attend aux Retrouvailles, ou dans ton inventaire si tu préfères l'ouvrir plus tard."
        },
        {
          kind: "entry",
          name: "Une relique sur la route",
          tag: "new",
          context: "Trouver une relique devait se voir.",
          changes: [
            { label: "Quand un gardien, une élite ou une Brèche en laisse une", text: "elle jaillit, retombe devant toi, brille selon sa rareté, puis vole à ton inventaire" },
            { label: "Dès l'épique", text: "des anneaux de sa lumière" },
            { label: "Une légende", text: "une colonne de lumière" }
          ]
        },
        {
          kind: "entry",
          name: "Trouvailles",
          tag: "new",
          changes: [
            { label: "La première chute du roi", text: "laisse une relique épique ou mieux" },
            { label: "Après 12 reliques de la route sans épique ni mieux", text: "la suivante l'est" },
            { label: "Recycler à l'arrivée, dans l'inventaire", text: "les communes, ou les communes et les rares, deviennent des éclats dès qu'elles arrivent (jamais une relique nommée)" }
          ]
        },
        {
          kind: "entry",
          name: "Reliques rares",
          tag: "changed",
          context: "Les traits commencent à l'épique : une rare reste un contour net, un peu plus dense qu'une commune.",
          changes: [{ label: "Densité d'une rare", before: "×1,03 par strate", after: "×1,024" }]
        },
        {
          kind: "spoiler",
          label: "Au-delà de l'étape 3000",
          body: [
            {
              kind: "entry",
              name: "Densité au-delà de l'Aube",
              tag: "changed",
              context: "Sous l'Aube, la nuit se redessine depuis sa première strate : ce qu'on s'y rappelle ne pèse pas plus lourd que la Première Marque.",
              changes: [{ label: "Densité au-delà de la soixantième strate", before: "elle grandissait encore à chaque strate", after: "celle de la soixantième" }]
            }
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "entry",
          name: "Blessures des gardiens",
          tag: "fixed",
          changes: [
            { label: "Un gardien rejoué sous ton étape la plus lointaine", before: "pouvait garder les blessures d'un combat perdu", after: "n'en garde plus" },
            { label: "Une blessure laissée derrière toi sur la route", text: "se referme dès que la compagnie l'a dépassée" }
          ]
        }
      ],
      link: { route: "play", label: "Reprendre la route" }
    },
    en: {
      title: "Patch notes 1.3",
      summary: "Relics remember: what they did, who carried them, where they come from. Brom awakens them, and your company keeps a satchel for you while you are away.",
      body: [
        { kind: "p", text: "Good evening, walker. Until now a relic was a name, a color and a few percentages: you barely looked at it before salvaging it. 1.3 changes that. A relic clearly remembered comes back with its story: what it did, the hand that held it, the place it comes from. And because we grow fond of what has a story, a relic you love is never too old again." },
        { kind: "h2", text: "What relics remember" },
        {
          kind: "entry",
          name: "Traits",
          tag: "new",
          context: "The more clearly a relic is remembered, the more it recalls what it did. An epic or better does it again in your hand.",
          changes: [
            { label: "Epic, legendary", text: "a trait of its slot, its effect while you wear it, stronger at each rarity" },
            { label: "Mythic", text: "two traits" },
            { label: "The weapon, the company's strength", text: "Vanguard, the Host, Rout, Steady Rhythm" },
            { label: "The armor, against guardians", text: "Bulwark, Old Scars, Spoils, Skyglass, Regicide" },
            { label: "The amulet, the rhythm of the night and of your hand", text: "Attention, Second Breath, Keen Edge, Pip's Friend, Storm Caller" },
            { label: "The ring, fortune and absence", text: "Fortune, Homecoming, Lucky Star, Deep Satchel, Vigil" },
            { label: "On every card", text: "the trait's name in the relic's color, then what it does, plainly" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 1, rarity: "epic" }, label: "Epic" },
            { spec: { kind: "relic", slot: "armor", base: 3, rarity: "legendary" }, label: "Legendary" },
            { spec: { kind: "relic", slot: "amulet", base: 2, rarity: "mythic" }, label: "Mythic" }
          ],
          caption: "An epic remembers a trait, a mythic two."
        },
        {
          kind: "entry",
          name: "A companion's memory",
          tag: "new",
          context: "A legend always has someone to tell it.",
          changes: [
            { label: "Legendary and mythic", text: "it remembers a companion who once walked in your company" },
            { label: "That companion, while you wear it", text: "×1.5 damage (legendary), ×2 (mythic)" }
          ]
        },
        {
          kind: "entry",
          name: "Sets",
          tag: "new",
          context: "Relics of one place remember each other.",
          changes: [
            { label: "A relic's place", text: "the biome it dropped in, which its name already says (\"of the Grove\", \"of the Mire\"…)" },
            { label: "2 then 4 relics of one place worn together", text: "a set wakes, then a stronger one" },
            { label: "Plains set", text: "more gold, and golden rats at four" },
            { label: "Grove set", text: "a stronger Patience bonus" },
            { label: "Depths set", text: "more shards, and more relics at four" },
            { label: "Mire set", text: "more time against elites and guardians" },
            { label: "Crown set", text: "more damage to the King" }
          ]
        },
        {
          kind: "entry",
          name: "Density",
          tag: "changed",
          context: "A blurred memory weighs little, even from far below. A myth weighs all it can.",
          changes: [
            { label: "Per stratum below the present night", before: "×1.03 for every relic", after: "×1.02 common, ×1.024 rare, ×1.027 epic, ×1.03 legendary, ×1.032 mythic" },
            { label: "Company ×N", text: "now counts traits, memory and sets" }
          ]
        },
        { kind: "h2", text: "What you do with them" },
        {
          kind: "entry",
          name: "Awakening",
          tag: "new",
          context: "A relic you love should never be left behind.",
          changes: [
            { label: "At the forge", text: "Brom awakens a relic at your deepest night, in the same place" },
            { label: "It keeps", text: "its bonuses, traits, memory and set" },
            { label: "It takes", text: "the density of that depth, and its bonuses grow as if it had dropped there" },
            { label: "Price per stratum gone down", text: "20, 60, 160, 500 or 1,600 shards, from common to mythic" }
          ]
        },
        {
          kind: "entry",
          name: "The company's satchel",
          tag: "new",
          context: "While you are away, the company picks up what the guardians leave on the road. It keeps it for you.",
          changes: [
            { label: "Page hidden or game closed", before: "no relics", after: "the guardians and elites passed leave their relics at the usual odds" },
            { label: "The satchel", text: "keeps the 6 most precious, the others turn into shards" },
            { label: "At the Reunion", text: "open it: the relics come out one by one, hidden until you touch them, the rarest last" },
            { label: "Before you even open it", text: "the light of the most precious leaks under the flap" }
          ]
        },
        {
          kind: "figure",
          art: [{ spec: { kind: "satchel" }, label: "The satchel" }],
          caption: "It waits for you at the Reunion, or in your inventory if you would rather open it later."
        },
        {
          kind: "entry",
          name: "A relic on the road",
          tag: "new",
          context: "Finding a relic should be seen.",
          changes: [
            { label: "When a guardian, an elite or a Seam leaves one", text: "it is thrown out, falls in front of you, shines for its rarity, then flies to your inventory" },
            { label: "From epic up", text: "rings of its light" },
            { label: "A legend", text: "a column of light" }
          ]
        },
        {
          kind: "entry",
          name: "Finds",
          tag: "new",
          changes: [
            { label: "The King's first fall", text: "leaves an epic relic or better" },
            { label: "After 12 relics of the road without an epic or better", text: "the next one is" },
            { label: "Salvage on arrival, in the inventory", text: "commons, or commons and rares, turn into shards as they arrive (never a named relic)" }
          ]
        },
        {
          kind: "entry",
          name: "Rare relics",
          tag: "changed",
          context: "Traits begin at epic: a rare stays a clear outline, a little denser than a common.",
          changes: [{ label: "Density of a rare", before: "×1.03 per stratum", after: "×1.024" }]
        },
        {
          kind: "spoiler",
          label: "Past stage 3000",
          body: [
            {
              kind: "entry",
              name: "Density beyond the Dawn",
              tag: "changed",
              context: "Below the Dawn the night draws itself again from its first stratum: what is remembered there weighs no more than the First Mark.",
              changes: [{ label: "Density past the sixtieth stratum", before: "it still grew with every stratum", after: "that of the sixtieth" }]
            }
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "entry",
          name: "Guardians' wounds",
          tag: "fixed",
          changes: [
            { label: "A guardian replayed below your furthest stage", before: "could keep the wounds of a lost fight", after: "no longer does" },
            { label: "A wound left behind on the road", text: "closes once the company has passed it" }
          ]
        }
      ],
      link: { route: "play", label: "Back on the road" }
    }
  },
  {
    slug: "patch-notes-1-2",
    date: "2026-10-16",
    kind: "patch",
    version: "v1.2",
    cover: { biome: "dark-forest", creature: "shade-wolf" },
    fr: {
      title: "Notes de mise à jour 1.2",
      summary: "La 1.2 rend la route plus sûre sous le doigt : un seul toucher suffit sur téléphone, ta partie te suit d'une page à l'autre, et quelques créatures profondes retrouvent leur trait.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. La 1.2 ne t'apporte pas de nouvelle route : elle répare celle que tu foules déjà. Tes doigts sont mieux écoutés, ta partie ne se perd plus entre deux pages, et quelques créatures des profondeurs retrouvent le trait qu'elles auraient toujours dû avoir. Ce qui touche aux Âges lointains reste voilé plus bas : à toi de choisir si tu veux le voir." },
        { kind: "h2", text: "Sous le doigt" },
        {
          kind: "entry",
          name: "Sur téléphone",
          tag: "fixed",
          context: "Sur un téléphone, chaque geste doit compter du premier coup.",
          changes: [
            { label: "Talents", before: "un premier toucher ouvrait la carte, un second l'achetait", after: "un seul toucher achète un talent à ta portée" },
            { label: "Talent hors de portée ou déjà appris", text: "un toucher ouvre toujours sa carte" },
            { label: "Boutons sur iPhone", before: "un toucher se perdait souvent", after: "pouvoirs, compagnons et chaque touche du jeu répondent au premier toucher" }
          ]
        },
        {
          kind: "entry",
          name: "Notifications",
          tag: "fixed",
          context: "Une notification ne doit jamais te voler un cristal.",
          changes: [
            { label: "Toucher une notification", before: "elle restait jusqu'à partir d'elle-même, et cachait les cristaux", after: "elle disparaît aussitôt" },
            { label: "Ce qu'il y a dessous", text: "le même toucher l'atteint : le cristal est attrapé, la créature frappée" }
          ]
        },
        {
          kind: "entry",
          name: "Sac",
          tag: "fixed",
          context: "Recycler relique après relique ne doit pas devenir une chasse au bouton.",
          changes: [
            { label: "Cartes de reliques", before: "elles montaient et descendaient en changeant de place", after: "toutes aussi hautes que la plus haute" },
            { label: "Recycler", text: "toujours au bord droit, et le bouton de la relique suivante reste sous ton doigt" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 1, rarity: "common" }, label: "Commune" },
            { spec: { kind: "relic", slot: "armor", base: 2, rarity: "rare" }, label: "Rare" },
            { spec: { kind: "relic", slot: "amulet", base: 1, rarity: "epic" }, label: "Épique" },
            { spec: { kind: "relic", slot: "ring", base: 2, rarity: "legendary" }, label: "Légendaire" }
          ],
          caption: "Modeste ou légendaire, chaque relique tient désormais dans une carte de la même taille."
        },
        {
          kind: "entry",
          name: "Pouvoirs au clavier",
          tag: "fixed",
          context: "Sur un clavier français, les chiffres demandaient une gymnastique inutile.",
          changes: [
            { label: "Touches 1 à 7", before: "il fallait Maj sur un clavier français", after: "sans Maj, sur la rangée du haut comme sur le pavé numérique" },
            { label: "Touche gardée enfoncée", before: "le son du refus se répétait", after: "il ne sonne qu'une fois" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "power", id: "frenzy" }, label: "1" },
            { spec: { kind: "power", id: "rally" }, label: "2" },
            { spec: { kind: "power", id: "hawkeye" }, label: "3" },
            { spec: { kind: "power", id: "goldrain" }, label: "4" },
            { spec: { kind: "power", id: "ritual" }, label: "5" }
          ],
          caption: "Tes pouvoirs, chacun sous son chiffre, sans Maj."
        },
        {
          kind: "entry",
          name: "Fenêtres et nombres",
          tag: "fixed",
          changes: [
            { label: "Échap sur une confirmation", before: "fermait la confirmation et la fenêtre", after: "ferme la confirmation seule" },
            { label: "Nombres arrondis au millier", before: "« 1000K »", after: "« 1M »" },
            { label: "Ta bourse au-delà de l'étape 3500", before: "affichait 0 un instant quand les nombres changeaient d'unité", after: "garde son compte" }
          ]
        },
        { kind: "h2", text: "Ta partie" },
        {
          kind: "entry",
          name: "D'une page à l'autre",
          tag: "fixed",
          context: "Aller lire le wiki ne doit rien te coûter sur la route.",
          changes: [
            { label: "Quitter le jeu pour une autre page du site", before: "jusqu'à 30 s de jeu perdues, et le jeu disait qu'on jouait sur une autre page", after: "tout est gardé, et le jeu reprend dès ton retour" },
            { label: "Nouvelle version pendant que tu joues ailleurs", text: "la page restée en arrière s'efface au lieu de jouer pour rien" },
            { label: "Grand Livre injoignable au chargement", text: "la page attend, réessaie à son rythme et charge ta partie une seule fois" }
          ]
        },
        {
          kind: "entry",
          name: "Ce que garde le Grand Livre",
          tag: "fixed",
          context: "Des marches honnêtes se voyaient refuser par le Grand Livre. Plus maintenant.",
          changes: [
            { label: "Une parole donnée au crépuscule même", before: "« La parole de la nuit dernière a été réécrite »", after: "acceptée" },
            { label: "Une promesse tenue à travers plus de 100 Rois en une nuit", before: "empêchait le Grand Livre de garder ta partie", after: "acceptée" },
            { label: "Une longue absence revenue en plusieurs parts", before: "les dernières parts refusées", after: "acceptées" },
            { label: "Partie non gardée pendant une coupure", before: "elle paraissait gardée", after: "signalée comme un souci, et quitter la page te prévient" }
          ]
        },
        {
          kind: "entry",
          name: "Longue absence sans combattant",
          tag: "fixed",
          context: "Revenir face au gardien qui t'a battu n'a rien d'un accueil.",
          changes: [{ label: "Au retour", before: "tu retrouvais le gardien qui t'avait battu", after: "tu attends juste avant lui, avance auto coupée" }]
        },
        { kind: "h2", text: "Sur la route" },
        {
          kind: "entry",
          name: "Le Pari de Pip",
          tag: "fixed",
          context: "Plus bas que l'étape 3500, Pip comptait mal.",
          changes: [{ label: "Gain au-delà de l'étape 3500", before: "toujours son minimum, 30 fois l'or de l'étape", after: "ce que la route aurait payé, comme plus haut" }]
        },
        {
          kind: "entry",
          name: "En français",
          tag: "fixed",
          changes: [
            { label: "Noms", text: "la Roulotte et les hauts faits s'appellent ainsi partout" },
            { label: "Lignes", text: "« Il te faut une place libre » pour une seule place, et quelques lignes du Grand Livre se lisent enfin juste" }
          ]
        },
        { kind: "h2", text: "La route profonde" },
        { kind: "p", text: "Les corrections qui suivent montrent des Âges que tu n'as peut-être pas encore atteints. Elles restent voilées tant que tu ne les demandes pas." },
        {
          kind: "spoiler",
          label: "L'Âge XI, des étapes 2501 à 2750",
          body: [
            {
              kind: "entry",
              name: "Le Blanc",
              tag: "fixed",
              context: "Dans cet Âge, les Restes s'effacent de la page. Ils devaient devenir un dessin à l'encre, pas un fantôme qu'on traverse du regard.",
              changes: [
                { label: "Créatures", before: "un contour à peine visible, le décor à travers le corps", after: "un trait d'encre sombre autour d'un corps blanc, les ombres en hachures" },
                { label: "Strate après strate", text: "elles perdent leurs couleurs, de Pâle jusqu'à Encre" },
                { label: "Ombres au sol", before: "une flaque noire", after: "un lavis pâle" }
              ]
            },
            {
              kind: "figure",
              art: [
                { spec: { kind: "creature", id: "field-rat", era: 50, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 50 }, label: "Pâle" },
                { spec: { kind: "creature", id: "field-rat", era: 51, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 51 }, label: "Ténu" },
                { spec: { kind: "creature", id: "field-rat", era: 52, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 52 }, label: "Marge" },
                { spec: { kind: "creature", id: "field-rat", era: 53, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 53 }, label: "Vierge" },
                { spec: { kind: "creature", id: "field-rat", era: 54, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 54 }, label: "Encre" }
              ],
              caption: "Le Rat des champs, strate après strate : la couleur s'en va, le trait reste."
            },
            {
              kind: "compare",
              before: "/news/1-2/blank-before.png",
              after: "/news/1-2/blank-after.png",
              alt: { before: "L'Épouvantail creux avant : un contour pâle, le décor visible à travers son corps", after: "L'Épouvantail creux après : un trait d'encre autour d'un corps blanc hachuré" },
              caption: "Vierge, des étapes 2651 à 2700 : fais glisser pour voir l'Épouvantail creux avant et après. Le décor ne se voit plus à travers lui."
            }
          ]
        },
        {
          kind: "spoiler",
          label: "L'Âge VIII et l'Inachevé",
          body: [
            {
              kind: "entry",
              name: "Âge VIII",
              tag: "fixed",
              context: "Les paupières lourdes de cet Âge fermaient trop les grands yeux.",
              changes: [{ label: "Yeux mi-clos", before: "les grands yeux se fermaient en une ligne", after: "ils ne perdent que leur rangée du haut" }]
            },
            {
              kind: "compare",
              before: "/news/1-2/eyes-before.png",
              after: "/news/1-2/eyes-after.png",
              alt: { before: "La Chouette endeuillée avant : ses yeux fermés en une ligne", after: "La Chouette endeuillée après : des paupières lourdes, et ses yeux ouverts dessous" },
              caption: "La Chouette endeuillée à l'Âge VIII : des paupières lourdes, et des yeux toujours là."
            },
            {
              kind: "entry",
              name: "L'Inachevé",
              tag: "fixed",
              context: "Il apparaissait pour disparaître aussitôt.",
              changes: [{ label: "Combat", before: "il disparaissait un dixième de seconde après son arrivée", after: "il attend qu'on le batte, et son écho de l'Ébauche se fait enfin entendre" }]
            }
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous, et merci à celles et ceux qui nous ont signalé ces soucis. Bonne route." }
      ],
      link: { route: "play", label: "Reprendre la route" }
    },
    en: {
      title: "Patch notes 1.2",
      summary: "1.2 makes the road surer under your finger: one tap is enough on a phone, your game follows you from page to page, and a few creatures of the deep get their line back.",
      body: [
        { kind: "p", text: "Good evening, walker. 1.2 brings no new road: it mends the one you already walk. Your fingers are better heard, your game no longer slips away between two pages, and a few creatures of the deep get back the line they should always have had. What touches the far Ages stays veiled further down: you choose whether to see it." },
        { kind: "h2", text: "Under your finger" },
        {
          kind: "entry",
          name: "On a phone",
          tag: "fixed",
          context: "On a phone, every gesture should count the first time.",
          changes: [
            { label: "Talents", before: "a first tap opened the card, a second bought it", after: "a single tap buys a talent within reach" },
            { label: "Talent out of reach or already learned", text: "a tap still opens its card" },
            { label: "Buttons on iPhone", before: "a tap often went nowhere", after: "powers, companions and every key of the game answer the first tap" }
          ]
        },
        {
          kind: "entry",
          name: "Notifications",
          tag: "fixed",
          context: "A notification should never steal a crystal from you.",
          changes: [
            { label: "Tapping a notification", before: "it stayed until it left on its own, hiding the crystals", after: "it clears at once" },
            { label: "What lies under it", text: "the same tap reaches it: the crystal is caught, the creature struck" }
          ]
        },
        {
          kind: "entry",
          name: "Bag",
          tag: "fixed",
          context: "Salvaging relic after relic should not turn into chasing a button.",
          changes: [
            { label: "Relic cards", before: "they moved up and down as they changed places", after: "every one as tall as the tallest" },
            { label: "Salvage", text: "always at the right edge, and the next relic's button stays under your finger" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "relic", slot: "weapon", base: 1, rarity: "common" }, label: "Common" },
            { spec: { kind: "relic", slot: "armor", base: 2, rarity: "rare" }, label: "Rare" },
            { spec: { kind: "relic", slot: "amulet", base: 1, rarity: "epic" }, label: "Epic" },
            { spec: { kind: "relic", slot: "ring", base: 2, rarity: "legendary" }, label: "Legendary" }
          ],
          caption: "Humble or legendary, every relic now sits in a card of the same size."
        },
        {
          kind: "entry",
          name: "Powers on the keyboard",
          tag: "fixed",
          context: "On a French keyboard, the numbers asked for pointless finger work.",
          changes: [
            { label: "Keys 1 to 7", before: "needed Shift on a French keyboard", after: "no Shift, on the top row as on the keypad" },
            { label: "Key held down", before: "the refusal sound repeated", after: "it sounds once" }
          ]
        },
        {
          kind: "figure",
          art: [
            { spec: { kind: "power", id: "frenzy" }, label: "1" },
            { spec: { kind: "power", id: "rally" }, label: "2" },
            { spec: { kind: "power", id: "hawkeye" }, label: "3" },
            { spec: { kind: "power", id: "goldrain" }, label: "4" },
            { spec: { kind: "power", id: "ritual" }, label: "5" }
          ],
          caption: "Your powers, each under its number, no Shift."
        },
        {
          kind: "entry",
          name: "Windows and numbers",
          tag: "fixed",
          changes: [
            { label: "Escape on a confirmation", before: "closed the confirmation and the window", after: "closes the confirmation alone" },
            { label: "Numbers rounding up to a thousand", before: "\"1000K\"", after: "\"1M\"" },
            { label: "Your purse past stage 3500", before: "showed 0 for a moment when the numbers changed unit", after: "keeps its count" }
          ]
        },
        { kind: "h2", text: "Your game" },
        {
          kind: "entry",
          name: "From page to page",
          tag: "fixed",
          context: "Going to read the wiki should cost you nothing on the road.",
          changes: [
            { label: "Leaving the game for another page of the site", before: "up to 30 s of play lost, and the game said it was played on another page", after: "everything is kept, and the game goes on the moment you return" },
            { label: "A new version while you play elsewhere", text: "the page left behind stands aside instead of playing for nothing" },
            { label: "Ledger out of reach at load", text: "the page waits, tries again at its own pace and loads your game once" }
          ]
        },
        {
          kind: "entry",
          name: "What the Ledger keeps",
          tag: "fixed",
          context: "Honest walks could see the Ledger refuse them. Not anymore.",
          changes: [
            { label: "A word given at dusk itself", before: "\"Last night's word was rewritten\"", after: "accepted" },
            { label: "A promise standing through more than 100 Kings in one night", before: "stopped the Ledger from keeping your game", after: "accepted" },
            { label: "A long absence sent back in several parts", before: "the later parts refused", after: "accepted" },
            { label: "Play not kept during a dropped connection", before: "it looked kept", after: "shown as a trouble, and leaving the page warns you" }
          ]
        },
        {
          kind: "entry",
          name: "Long absence with no fighter",
          tag: "fixed",
          context: "Coming back to the guardian that beat you is no welcome.",
          changes: [{ label: "On return", before: "you faced the guardian that beat you again", after: "you wait just before it, auto-advance off" }]
        },
        { kind: "h2", text: "On the road" },
        {
          kind: "entry",
          name: "Pip's Wager",
          tag: "fixed",
          context: "Below stage 3500, Pip counted wrong.",
          changes: [{ label: "Payout past stage 3500", before: "always his minimum, 30 times the stage's gold", after: "what the road would have paid, as above it" }]
        },
        {
          kind: "entry",
          name: "In French",
          tag: "fixed",
          changes: [
            { label: "Names", text: "the Caravan and the Deeds carry the same French names everywhere" },
            { label: "Lines", text: "a single free space is asked for in the singular, and a few lines of the Ledger read right at last" }
          ]
        },
        { kind: "h2", text: "The deep road" },
        { kind: "p", text: "The fixes below show Ages you may not have reached yet. They stay veiled until you ask for them." },
        {
          kind: "spoiler",
          label: "Age XI, stages 2501 to 2750",
          body: [
            {
              kind: "entry",
              name: "The Blank",
              tag: "fixed",
              context: "In this Age the Remnants fade from the page. They were meant to become an ink drawing, not a ghost you could see through.",
              changes: [
                { label: "Creatures", before: "a faint outline, the scenery showing through the body", after: "a dark ink line around a white body, shadows in hatching" },
                { label: "Stratum by stratum", text: "they lose their colors, from Pale down to Ink" },
                { label: "Shadows on the ground", before: "a black pool", after: "a pale wash" }
              ]
            },
            {
              kind: "figure",
              art: [
                { spec: { kind: "creature", id: "field-rat", era: 50, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 50 }, label: "Pale" },
                { spec: { kind: "creature", id: "field-rat", era: 51, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 51 }, label: "Faint" },
                { spec: { kind: "creature", id: "field-rat", era: 52, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 52 }, label: "Margin" },
                { spec: { kind: "creature", id: "field-rat", era: 53, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 53 }, label: "Blank" },
                { spec: { kind: "creature", id: "field-rat", era: 54, animated: false }, scene: { kind: "scene", biome: "green-plains", era: 54 }, label: "Ink" }
              ],
              caption: "The Field Rat, stratum by stratum: the color goes, the line stays."
            },
            {
              kind: "compare",
              before: "/news/1-2/blank-before.png",
              after: "/news/1-2/blank-after.png",
              alt: { before: "The Hollow Scarecrow before: a pale outline, the scenery showing through its body", after: "The Hollow Scarecrow after: an ink line around a white, hatched body" },
              caption: "Blank, stages 2651 to 2700: slide to see the Hollow Scarecrow before and after. The scenery no longer shows through it."
            }
          ]
        },
        {
          kind: "spoiler",
          label: "Age VIII and the Unfinished",
          body: [
            {
              kind: "entry",
              name: "Age VIII",
              tag: "fixed",
              context: "The heavy lids of this Age closed tall eyes too far.",
              changes: [{ label: "Half-closed eyes", before: "tall eyes closed to a line", after: "they lose only their top row" }]
            },
            {
              kind: "compare",
              before: "/news/1-2/eyes-before.png",
              after: "/news/1-2/eyes-after.png",
              alt: { before: "The Mourning Owl before: its eyes closed to a line", after: "The Mourning Owl after: heavy lids, and its eyes open beneath" },
              caption: "The Mourning Owl in Age VIII: heavy lids, and eyes still there."
            },
            {
              kind: "entry",
              name: "The Unfinished",
              tag: "fixed",
              context: "It appeared only to vanish at once.",
              changes: [{ label: "Fight", before: "it vanished a tenth of a second after it arrived", after: "it waits to be beaten, and its echo of the Draft is heard at last" }]
            }
          ]
        },
        { kind: "p", text: "Thank you for walking with us, and thank you to everyone who told us about these troubles. Safe travels." }
      ],
      link: { route: "play", label: "Take the road again" }
    }
  },
  {
    slug: "patch-notes-1-1",
    date: "2026-10-06",
    kind: "patch",
    version: "v1.1",
    cover: { biome: "green-plains" },
    fr: {
      title: "Notes de mise à jour 1.1",
      summary: "La 1.1 resserre le lien entre ta route et le Grand Livre : il veille de plus près sur le classement, et quand il ne répond plus depuis longtemps, la route l'attend.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Le Grand Livre garde la trace de chaque pas, et le classement n'a de valeur que si chaque pas y est vrai. La 1.1 le rapproche de ta route, sans rien changer à ta façon de jouer : tes compagnons frappent pareil, le hasard garde les mêmes chances, et une marche honnête ne voit aucune différence." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "entry",
          name: "La route attend le Grand Livre",
          tag: "new",
          context: "Le Grand Livre écrit ce qui t'arrive. S'il ne répond plus pendant longtemps, la route s'arrête là où il peut encore la lire.",
          changes: [
            { label: "Grand Livre injoignable longtemps", before: "le jeu continuait sans lui", after: "la route s'arrête, et l'en-tête dit « La route attend le Grand Livre »" },
            { label: "Dès qu'il répond", text: "la route reprend, et le temps d'attente compte comme une absence : ta compagnie a marché pendant ce temps" },
            { label: "Coupure courte", text: "rien ne change, le jeu continue comme avant" }
          ]
        },
        {
          kind: "entry",
          name: "Nouvelle partie",
          tag: "changed",
          context: "Une nouvelle partie commence désormais avec le Grand Livre.",
          changes: [{ label: "Nouvelle partie", text: "la même tant qu'elle n'a pas été jouée, pour ton compte comme pour ton navigateur sans compte" }]
        },
        { kind: "h2", text: "Jeu loyal" },
        {
          kind: "entry",
          name: "Classement",
          tag: "changed",
          context: "Pour que chaque place se gagne sur la route.",
          changes: [{ label: "Classement", text: "le Grand Livre veille de plus près sur lui, et une marche honnête ne voit aucune différence" }]
        },
        { kind: "p", text: "Merci de marcher avec nous, nuit après nuit. Bonne route." }
      ],
      link: { route: "play", label: "Reprendre la route" }
    },
    en: {
      title: "Patch notes 1.1",
      summary: "1.1 ties your road closer to the Ledger: it keeps a closer watch over the leaderboard, and when it has not answered for a long while, the road waits for it.",
      body: [
        { kind: "p", text: "Good evening, walker. The Ledger keeps track of every step, and the leaderboard is only worth something if every step in it is true. 1.1 brings it closer to your road without changing how you play: your companions strike the same, luck has the same odds, and an honest walk sees no difference." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "The road waits for the Ledger",
          tag: "new",
          context: "The Ledger writes down what happens to you. If it stops answering for a long while, the road stops where it can still read it.",
          changes: [
            { label: "Ledger out of reach for long", before: "the game played on without it", after: "the road stops, and the header says \"The road waits for the Ledger\"" },
            { label: "As soon as it answers", text: "the road goes on, and the time waited counts as time away: your company walked meanwhile" },
            { label: "A short outage", text: "nothing changes, the game plays on as before" }
          ]
        },
        {
          kind: "entry",
          name: "New game",
          tag: "changed",
          context: "A new game now begins with the Ledger.",
          changes: [{ label: "New game", text: "the same one until it is played, for your account as for your browser without one" }]
        },
        { kind: "h2", text: "Fair play" },
        {
          kind: "entry",
          name: "Leaderboard",
          tag: "changed",
          context: "So that every place is earned on the road.",
          changes: [{ label: "Leaderboard", text: "the Ledger keeps a closer watch over it, and an honest walk sees no difference" }]
        },
        { kind: "p", text: "Thank you for walking with us, night after night. Safe travels." }
      ],
      link: { route: "play", label: "Take the road again" }
    }
  },
  {
    slug: "patch-notes-1-0",
    date: "2026-10-05",
    kind: "patch",
    version: "v1.0",
    cover: { biome: "green-plains", creature: "field-rat" },
    fr: {
      title: "Notes de mise à jour 1.0",
      summary: "Idlebound passe en 1.0 : la route n'a plus de fond, les scènes du Grand Livre se jouent comme au cinéma, et les lumières d'Orvane rayonnent enfin.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Depuis le premier soir, on te demande de tuer le Roi, de recommencer, et de recommencer encore. La 1.0 ouvre la route vers le bas, aussi loin que tu voudras descendre, et donne au Grand Livre les scènes qu'il méritait." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "entry",
          name: "La route",
          tag: "new",
          context: "Elle avait une dernière étape. Pour qui veut descendre plus loin, plus rien ne l'arrête.",
          changes: [
            { label: "Dernière étape", text: "il n'y en a plus" },
            { label: "Plus bas", text: "la nuit se dessine à nouveau depuis sa première strate, un tour plus profond" },
            { label: "Classement de Profondeur", text: "ouvert, sans fond" },
            { label: "Notation", text: "les lettres continuent après zz avec aaa" },
            { label: "Profondeur dans le Hall", before: "10.4K", after: "10432" }
          ]
        },
        {
          kind: "entry",
          name: "Les scènes du Grand Livre",
          tag: "new",
          context: "Peu de marcheurs savaient qu'elles existaient. Elles se jouent maintenant comme des scènes de cinéma, et la première t'attend dès ton premier soir.",
          changes: [
            { label: "Mise en scène", before: "des images fixes", after: "la caméra qui parcourt le monde, toi et le Roi face à face, des coups, des lumières" },
            { label: "Musique", text: "un thème à elles, qui revient d'une scène à l'autre" },
            { label: "Les mots", text: "sous l'image, mot à mot, avec la voix de qui parle" },
            { label: "Scènes", before: "3", after: "9 : une nouvelle ouvre chaque marche, et cinq attendent aux grands tournants de la route" },
            { label: "Déjà passées", text: "celles que tu as vécues sans les voir te sont signalées une fois, et t'attendent dans la Chronique" }
          ]
        },
        {
          kind: "entry",
          name: "La lumière du monde",
          tag: "new",
          context: "La nuit d'Orvane méritait plus de profondeur. Ses lumières rayonnent enfin.",
          changes: [
            { label: "Fenêtres, lanternes, braseros, cristaux, lune", text: "un halo doux, qui vacille quand c'est du feu" },
            { label: "Les mares du Marais", text: "reflètent la créature et les lumières au-dessus d'elles" },
            { label: "Les bords de la vue", text: "s'enfoncent dans la nuit" }
          ]
        },
        { kind: "h2", text: "Classement et compte" },
        {
          kind: "entry",
          name: "Nuits retissées",
          tag: "new",
          context: "Régicide classait presque exactement comme la Profondeur. Ce tableau récompense ton rythme au Métier d'Eldra.",
          changes: [
            { label: "Tableau", before: "Régicide", after: "Nuits retissées" },
            { label: "Ce qui compte", text: "les Descentes qui ont tissé au moins un fil" },
            { label: "Tes Descentes passées", text: "déjà comptées" }
          ]
        },
        {
          kind: "entry",
          name: "Pseudo",
          tag: "new",
          context: "Un nom choisi un soir ne doit pas te suivre pour toujours.",
          changes: [
            { label: "Changer de pseudo", before: "impossible", after: "une fois tous les 90 jours" },
            { label: "Où", text: "dans la fenêtre du compte" },
            { label: "Classement", text: "le nouveau nom apparaît tout de suite" }
          ]
        },
        { kind: "h2", text: "Interface" },
        {
          kind: "entry",
          name: "Pouvoirs",
          tag: "changed",
          context: "La recharge affichée est maintenant celle que tu attends vraiment.",
          changes: [
            { label: "Recharge affichée", before: "celle de base", after: "la vraie, après l'autel des Échos et tes reliques" },
            { label: "Frénésie avec les Échos niveau 4", before: "10 min", after: "8 min" }
          ]
        },
        {
          kind: "entry",
          name: "Hall des héros",
          tag: "changed",
          context: "La barre d'un haut fait dit enfin où tu en es.",
          changes: [
            { label: "Départ de la barre", before: "zéro", after: "le palier d'avant" },
            { label: "Or et coup le plus fort", text: "la barre avance par ordres de grandeur : 2e201 d'or vers 1e205, c'est trois quarts" },
            { label: "Seuils géants", text: "écrits dans ta notation" }
          ]
        },
        {
          kind: "entry",
          name: "Mises à jour",
          tag: "new",
          context: "Une nouvelle version n'éteint plus tout sans rien dire.",
          changes: [
            { label: "Pendant la mise à jour", before: "tout s'éteint", after: "un panneau nomme la version (de v0.9 à v1.0) et remplit sa barre" },
            { label: "Ta progression", text: "mise à l'abri d'abord, puis le jeu revient sur la nouvelle version" }
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "entry",
          name: "Les profondeurs",
          tag: "changed",
          context: "Une route sans fond ne doit ni devenir une course qui s'emballe, ni se figer.",
          changes: [
            { label: "Là où la route s'arrêtait", text: "ni marche ni mur : elle continue du même pas" },
            { label: "Plus bas", text: "les Vestiges se renforcent un peu moins vite à chaque étape, sans jamais cesser" }
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "entry",
          name: "Ta progression",
          tag: "fixed",
          context: "Quelques marches honnêtes voyaient leur progression refusée, par exemple une partie restée ouverte très longtemps. Plus maintenant.",
          changes: [
            { label: "Classement", text: "le Grand Livre veille de plus près sur lui, et une marche honnête ne voit aucune différence" },
            { label: "Juste après une Descente, loin dans la nuit", before: "progression parfois refusée", after: "acceptée" },
            { label: "Compte", text: "ton compte est mieux protégé" }
          ]
        },
        {
          kind: "entry",
          name: "Affichage",
          tag: "fixed",
          changes: [
            { label: "Bonus de Patience et autels au-delà de 1000 %", before: "10300 %", after: "10.3K %, 1.03e4 % ou 10.3e3 %, selon ta notation" },
            { label: "Version dans les Réglages", before: "toujours la même", after: "celle à laquelle tu joues" },
            { label: "Partie passée à une nouvelle version sous tes yeux", before: "« ouverte ailleurs » pendant deux minutes", after: "reprend tout de suite" }
          ]
        },
        { kind: "p", text: "Merci d'avoir marché jusqu'ici avec nous, nuit après nuit. Bonne route." }
      ],
      link: { route: "play", label: "Prendre la route" }
    },
    en: {
      title: "Patch notes 1.0",
      summary: "Idlebound reaches 1.0: the road has no bottom, the Ledger's scenes play like films, and the lights of Orvane finally glow.",
      body: [
        { kind: "p", text: "Good evening, walker. Since the very first night, we have asked you to slay the King, begin again, and begin again once more. 1.0 opens the road downward, as far as you care to walk, and gives the Ledger the scenes it deserved." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "The road",
          tag: "new",
          context: "It used to have a last stage. For those who want to go deeper, nothing stops it now.",
          changes: [
            { label: "Last stage", text: "there is none anymore" },
            { label: "Further down", text: "the night draws itself again from its first stratum, one round deeper" },
            { label: "Depth leaderboard", text: "open, with no bottom" },
            { label: "Notation", text: "the letters go on after zz with aaa" },
            { label: "Depth in the Hall", before: "10.4K", after: "10432" }
          ]
        },
        {
          kind: "entry",
          name: "The Ledger's scenes",
          tag: "new",
          context: "Few walkers knew they existed. They now play like scenes from a film, and the first one waits on your very first evening.",
          changes: [
            { label: "Staging", before: "still pictures", after: "the camera moving over the world, you and the King face to face, blows, lights" },
            { label: "Music", text: "a theme of their own, coming back from one scene to the next" },
            { label: "The words", text: "under the picture, a word at a time, with the voice of who speaks" },
            { label: "Scenes", before: "3", after: "9: a new one opens every walk, and five wait at the great turns of the road" },
            { label: "Already past", text: "the ones you lived without seeing are pointed out once, and wait in the Chronicle" }
          ]
        },
        {
          kind: "entry",
          name: "The light of the world",
          tag: "new",
          context: "Orvane's night deserved more depth. Its lights finally shine.",
          changes: [
            { label: "Windows, lanterns, braziers, crystals, the moon", text: "a soft halo, flickering when it is fire" },
            { label: "The Mire's pools", text: "reflect the creature and the lights above them" },
            { label: "The edges of the view", text: "sink into the night" }
          ]
        },
        { kind: "h2", text: "Leaderboard and account" },
        {
          kind: "entry",
          name: "Rewoven Nights",
          tag: "new",
          context: "Kingslayer ranked walkers almost exactly like Depth. This board rewards your pace at Eldra's Loom.",
          changes: [
            { label: "Board", before: "Kingslayer", after: "Rewoven Nights" },
            { label: "What counts", text: "the Descents that wove at least one thread" },
            { label: "Your past Descents", text: "already counted" }
          ]
        },
        {
          kind: "entry",
          name: "Username",
          tag: "new",
          context: "A name picked one evening should not follow you forever.",
          changes: [
            { label: "Changing your username", before: "not possible", after: "once every 90 days" },
            { label: "Where", text: "in the account window" },
            { label: "Leaderboard", text: "the new name shows at once" }
          ]
        },
        { kind: "h2", text: "Interface" },
        {
          kind: "entry",
          name: "Powers",
          tag: "changed",
          context: "The recharge shown is now the one you actually wait for.",
          changes: [
            { label: "Recharge shown", before: "the base one", after: "the true one, after the Altar of Echoes and your relics" },
            { label: "Frenzy with Echoes level 4", before: "10 min", after: "8 min" }
          ]
        },
        {
          kind: "entry",
          name: "Hall of heroes",
          tag: "changed",
          context: "A deed's bar finally tells you where you stand.",
          changes: [
            { label: "Bar start", before: "zero", after: "the tier before" },
            { label: "Gold and mightiest hit", text: "the bar moves by orders of magnitude: 2e201 gold toward 1e205 is three quarters" },
            { label: "Huge thresholds", text: "written in your notation" }
          ]
        },
        {
          kind: "entry",
          name: "Updates",
          tag: "new",
          context: "A new version no longer turns everything off without a word.",
          changes: [
            { label: "During an update", before: "everything goes dark", after: "a panel names the version (v0.9 to v1.0) and fills its bar" },
            { label: "Your progress", text: "put somewhere safe first, then the game comes back on the new version" }
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "entry",
          name: "The depths",
          tag: "changed",
          context: "A road with no bottom must neither turn into a runaway race nor freeze.",
          changes: [
            { label: "Where the road used to stop", text: "no step, no wall: it goes on at the same pace" },
            { label: "Further down", text: "the Remnants grow stronger a little more slowly with every stage, and never stop" }
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "entry",
          name: "Your progress",
          tag: "fixed",
          context: "A few honest walks saw their progress refused, such as a game left open for a very long time. Not anymore.",
          changes: [
            { label: "Leaderboard", text: "the Ledger keeps a closer watch over it, and an honest walk sees no difference" },
            { label: "Right after a Descent, deep in the night", before: "progress sometimes refused", after: "accepted" },
            { label: "Account", text: "your account is better protected" }
          ]
        },
        {
          kind: "entry",
          name: "Display",
          tag: "fixed",
          changes: [
            { label: "Patience bonus and altars past 1000%", before: "10300%", after: "10.3K%, 1.03e4% or 10.3e3%, in your notation" },
            { label: "Version in Settings", before: "always the same", after: "the one you play" },
            { label: "Game moved to a new version while you watched", before: "\"open elsewhere\" for two minutes", after: "picks up at once" }
          ]
        },
        { kind: "p", text: "Thank you for walking this far with us, night after night. Safe travels." }
      ],
      link: { route: "play", label: "Take the road" }
    }
  },
  {
    slug: "the-wiki-opens",
    date: "2026-10-04",
    kind: "announcement",
    cover: { biome: "dark-forest", creature: "mourning-owl" },
    fr: {
      title: "Le wiki d'Idlebound ouvre ses pages",
      summary: "Compagnons, créatures, reliques, autels, secrets : tout le savoir de la route réuni au même endroit, sans gâcher ce que tu n'as pas encore vécu.",
      body: [
        { kind: "p", text: "Bonsoir à toi qui marches vers le trône. Le site gagne aujourd'hui une nouvelle page : les Actualités. C'est ici qu'on te racontera ce qui change sur la route, mise à jour après mise à jour. Et pour ouvrir le bal, une belle nouvelle : Idlebound a maintenant son wiki." },
        { kind: "h2", text: "Tout le savoir de la route, au même endroit" },
        { kind: "p", text: "Le wiki rassemble ce que la nuit t'apprend à force de la traverser. Il est tiré directement du jeu : quand un chiffre change sur la route, il change aussi dans le wiki. Tu y trouveras :" },
        {
          kind: "list",
          items: [
            "Un guide pas à pas pour tes premières nuits, et une foire aux questions pleine d'astuces.",
            "Une fiche pour chacun des 20 compagnons et pour Aldric : talents, pouvoir, promesse, et les souvenirs qui leur reviennent.",
            "Le bestiaire complet : 63 créatures, leurs lignes du Grand Livre et leur visage à travers les Âges.",
            "Les 24 reliques nommées et leurs légendes, la forge, le marché et la Caravane.",
            "Le combat, l'ascension et les autels, la Promesse, les biomes, les strates, les événements, la Chronique, la Descente et ses Tissages.",
            "Les hauts faits et les secrets, solutions comprises, pour celles et ceux qui donnent leur langue au chat.",
            "Un calculateur : la vie d'un monstre, l'or et les essences qui t'attendent à l'étape de ton choix."
          ]
        },
        { kind: "h2", text: "Rien ne te sera gâché" },
        { kind: "p", text: "Idlebound se découvre en marchant, et on tient à ce que ça reste vrai. Le wiki ne te gâche rien : chaque révélation reste cachée, et c'est toi qui choisis ce que tu ouvres. Si tu as une partie en cours, le wiki suit ta progression et n'ouvre que ce que tu as déjà vécu : les créatures croisées, les reliques trouvées, les secrets percés. Tu peux aussi lire sans aucun spoil, ou tout dévoiler si tu aimes connaître la fin avant le début." },
        { kind: "h2", text: "Et ensuite ?" },
        { kind: "p", text: "Ces Actualités deviennent notre carnet de route commun. À chaque nouvelle version, tu trouveras ici ce qui a changé : les nouveautés, les équilibrages, les corrections. Le wiki, lui, grandira avec le jeu. Bonne route, et à la prochaine nuit." }
      ],
      link: { route: "wiki", label: "Ouvrir le wiki" }
    },
    en: {
      title: "The Idlebound wiki opens its pages",
      summary: "Companions, creatures, relics, altars, secrets: everything the road teaches, gathered in one place, without spoiling what you have not lived yet.",
      body: [
        { kind: "p", text: "Good evening, walker. The site has a new page today: the News. This is where we will tell you what changes on the road, update after update. And to open it, good tidings: Idlebound now has its own wiki." },
        { kind: "h2", text: "Everything the road teaches, in one place" },
        { kind: "p", text: "The wiki gathers what the night teaches you as you cross it, again and again. It is drawn straight from the game: when a number changes on the road, it changes in the wiki too. Inside, you will find:" },
        {
          kind: "list",
          items: [
            "A step by step guide for your first nights, and a FAQ full of tips.",
            "A page for each of the 20 companions and for Aldric: talents, power, promise, and the memories that come back to them.",
            "The full bestiary: 63 creatures, their lines from the Ledger and how they look through the Ages.",
            "The 24 named relics and their legends, the forge, the market and the Caravan.",
            "Combat, ascension and the altars, the Promise, the biomes, the strata, the events, the Chronicle, the Descent and its Weaves.",
            "The deeds and the secrets, answers included, for when you would rather know than guess.",
            "A calculator: a monster's health, and the gold and essences waiting for you at any stage."
          ]
        },
        { kind: "h2", text: "Nothing gets spoiled" },
        { kind: "p", text: "Idlebound is discovered by walking it, and we mean to keep it that way. The wiki spoils nothing: every revelation stays hidden, and you choose which ones to open. If you have a game going, the wiki follows your progress and only opens what you have already lived: the creatures you met, the relics you found, the secrets you uncovered. You can also read with no spoilers at all, or reveal it all if you like to know the ending first." },
        { kind: "h2", text: "What comes next" },
        { kind: "p", text: "This News page becomes our shared road journal. With every new version, you will find here what changed: new features, balance, fixes. The wiki will grow with the game. Safe travels, and see you next night." }
      ],
      link: { route: "wiki", label: "Open the wiki" }
    }
  },
  {
    slug: "patch-notes-0-4",
    date: "2026-10-03",
    kind: "patch",
    version: "v0.4",
    cover: { biome: "corrupted-marsh", creature: "rot-baron" },
    fr: {
      title: "Notes de mise à jour 0.4",
      summary: "La Débandade balaie les étapes déjà conquises, chaque parole tenue double les dégâts d'un compagnon, les coffres s'ouvrent sous tes yeux et le classement change de visage.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Refaire une route déjà connue ne devrait pas te coûter des heures, et une promesse tenue devrait se sentir dans chaque coup. Cette version s'occupe des deux, et rend plus clair tout ce que le jeu te dit." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "entry",
          name: "La Débandade",
          tag: "new",
          context: "Repasser par une route que ta compagnie écrase ne devrait pas prendre des heures.",
          changes: [
            { label: "Quand", text: "sur une étape plus basse que ton record, si ta compagnie tue un de ses monstres en un dixième de seconde ou moins" },
            { label: "Ce qui se passe", text: "toute l'étape tombe d'un coup : tu touches l'or de tous ses monstres et ils comptent au Bestiaire" },
            { label: "Vitesse", text: "une étape tous les quarts de seconde au plus" },
            { label: "Élites et gardiens", text: "ils se combattent toujours" },
            { label: "En ton absence", text: "la Débandade marche aussi" }
          ]
        },
        {
          kind: "entry",
          name: "Promesses",
          tag: "up",
          context: "Une parole tenue doit se sentir dans chaque coup.",
          changes: [
            { label: "Dégâts par parole tenue", before: "aucun", after: "x2 pour toujours, pour le compagnon à qui tu l'as donnée" },
            { label: "Maximum", text: "5 paroles par compagnon, soit x32" },
            { label: "Paroles déjà tenues", text: "elles comptent tout de suite" },
            { label: "Après 5 paroles", text: "le compagnon cesse de t'en demander" }
          ]
        },
        {
          kind: "entry",
          name: "Coffres du marché d'éclats",
          tag: "new",
          context: "Ouvrir un coffre doit avoir un peu de suspense.",
          changes: [
            { label: "Coffre de reliques et Grand coffre", text: "le coffre frappe une fois par rareté gagnée, éclate, et une roue de reliques ralentit sur la tienne" },
            { label: "Pressé", text: "tu peux l'ouvrir tout de suite" },
            { label: "Mouvements réduits", text: "la relique apparaît directement" }
          ]
        },
        {
          kind: "entry",
          name: "Une partie, une page",
          tag: "new",
          changes: [{ label: "Partie ouverte ailleurs", text: "sur un autre appareil ou une autre fenêtre, cette page se met en pause et te propose « Jouer ici », qui arrête l'autre" }]
        },
        {
          kind: "entry",
          name: "Registre des Liés",
          tag: "new",
          context: "Le classement raconte maintenant plus d'une façon de marcher.",
          changes: [
            { label: "Classement officiel", text: "Profondeur" },
            { label: "Nouveaux tableaux", text: "Régicide (les Rois abattus), Parole tenue (les promesses tenues) et La Veille (les cristaux attrapés), depuis toujours" },
            { label: "À étape égale", text: "le premier arrivé passe devant" },
            { label: "Autour de toi", text: "les marcheurs juste au-dessus et juste en dessous de toi, au classement comme dans le Hall des héros" }
          ]
        },
        {
          kind: "entry",
          name: "Confort",
          tag: "changed",
          changes: [
            { label: "Ascension", text: "la confirmation et le Sanctuaire t'annoncent l'étape où commencera ta prochaine nuit" },
            { label: "Messages répétés", before: "entassés", after: "empilés (x2, x3)" },
            { label: "Compteur d'or", before: "monte au moment du coup", after: "monte quand les pièces l'atteignent" },
            { label: "Volume", before: "par pas de 5 %", after: "de 0 à 100 %, valeur affichée" },
            { label: "Adresse e-mail", text: "masquée dans la fenêtre du compte, avec un bouton pour l'afficher" }
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "entry",
          name: "Reliques",
          tag: "down",
          context: "Des reliques très forgées faisaient tomber les gardiens plus vite que les monstres ordinaires de leur propre étape.",
          changes: [{ label: "Bonus de dégâts contre élites et gardiens", before: "sans plafond", after: "+300 % au plus, en tout" }]
        },
        {
          kind: "entry",
          name: "La Descente",
          tag: "up",
          context: "Elle s'ouvre plus simplement.",
          changes: [
            { label: "Ouverture", before: "étape 1000 et Eldra à sa cinquième Reconnaissance", after: "étape 2000, sans condition" },
            { label: "Déjà ouverte", text: "elle le reste" }
          ]
        },
        {
          kind: "entry",
          name: "Retour après une longue absence",
          tag: "up",
          context: "Avec la Débandade et les paroles tenues, ta compagnie repart plus vite.",
          changes: [{ label: "Première heure après 8 h d'absence", before: "5 à 16 étapes", after: "13 à 20 étapes" }]
        },
        { kind: "h2", text: "Clarté" },
        {
          kind: "entry",
          name: "Ce que dit le jeu",
          tag: "changed",
          context: "Tout doit se comprendre à la première lecture.",
          changes: [
            { label: "Pouvoirs, autels, objets du marché", text: "chacun dit ce qu'il fait, chiffres compris, et les pouvoirs donnent leur recharge" },
            { label: "Compagnons", text: "chacun nomme le bonus de son talent de niveau 50" },
            { label: "Histoires", text: "celles des compagnons, des créatures et des lieux sont réécrites pour se comprendre dès la première lecture" },
            { label: "Messages d'erreur", text: "ils disent simplement ce qui se passe et quoi faire" }
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "entry",
          name: "Divers",
          tag: "fixed",
          changes: [
            { label: "Nouvelle version", before: "chargée après 30 s sans que tu touches à rien", after: "chargée dès que rien d'important n'est affiché" },
            { label: "Mot de passe oublié", text: "la confirmation s'affiche dans ta langue" }
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. Bonne route, et à la prochaine nuit." }
      ]
    },
    en: {
      title: "Patch notes 0.4",
      summary: "The Rout sweeps the stages you already conquered, every kept word doubles a companion's damage, chests open before your eyes and the leaderboard gets a new look.",
      body: [
        { kind: "p", text: "Good evening, walker. Walking a road you already know should not cost you hours, and a kept promise should be felt in every blow. This version takes care of both, and makes everything the game tells you clearer." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "The Rout",
          tag: "new",
          context: "Walking back through a road your company crushes should not take hours.",
          changes: [
            { label: "When", text: "on a stage below your record, if your company kills one of its monsters in a tenth of a second or less" },
            { label: "What happens", text: "the whole stage falls at once: you collect the gold of all its monsters and they count in the Bestiary" },
            { label: "Speed", text: "one stage every quarter second at most" },
            { label: "Elites and guardians", text: "still fought" },
            { label: "While you are away", text: "the Rout works too" }
          ]
        },
        {
          kind: "entry",
          name: "Promises",
          tag: "up",
          context: "A kept word should be felt in every blow.",
          changes: [
            { label: "Damage per kept word", before: "none", after: "x2 for good, for the companion you gave it to" },
            { label: "Maximum", text: "5 words per companion, so x32" },
            { label: "Words already kept", text: "they count at once" },
            { label: "After 5 words", text: "the companion stops asking" }
          ]
        },
        {
          kind: "entry",
          name: "Shard market chests",
          tag: "new",
          context: "Opening a chest deserves a little suspense.",
          changes: [
            { label: "Relic Chest and Great Chest", text: "the chest knocks once for every rarity it climbs, bursts, and a reel of relics slows down onto yours" },
            { label: "In a hurry", text: "you can open it at once" },
            { label: "Reduced motion", text: "the relic shows straight away" }
          ]
        },
        {
          kind: "entry",
          name: "One game, one page",
          tag: "new",
          changes: [{ label: "Game open elsewhere", text: "on another device or in another window, this page pauses and offers \"Play here\", which stops the other one" }]
        },
        {
          kind: "entry",
          name: "Roll of the Bound",
          tag: "new",
          context: "The leaderboard now tells more than one way of walking.",
          changes: [
            { label: "Official board", text: "Depth" },
            { label: "New boards", text: "Kingslayer (Kings felled), Word Kept (promises kept) and The Watch (crystals caught), over all time" },
            { label: "On equal stages", text: "whoever got there first ranks higher" },
            { label: "Around you", text: "the walkers just above and below you, on the leaderboard and in the Hall of heroes" }
          ]
        },
        {
          kind: "entry",
          name: "Comfort",
          tag: "changed",
          changes: [
            { label: "Ascension", text: "the confirmation and the Sanctum tell you the stage your next night will start at" },
            { label: "Repeated messages", before: "piled up", after: "stacked (x2, x3)" },
            { label: "Gold counter", before: "rises at the blow", after: "rises when the coins reach it" },
            { label: "Volume", before: "in 5% steps", after: "0 to 100%, value shown" },
            { label: "E-mail address", text: "masked in the account window, with a button to show it" }
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "entry",
          name: "Relics",
          tag: "down",
          context: "Heavily forged relics made guardians fall faster than the ordinary monsters of their own stage.",
          changes: [{ label: "Bonus damage against elites and guardians", before: "no cap", after: "+300% at most, in total" }]
        },
        {
          kind: "entry",
          name: "The Descent",
          tag: "up",
          context: "It opens more simply.",
          changes: [
            { label: "Opens at", before: "stage 1000 and Eldra at her fifth Recognition", after: "stage 2000, no condition" },
            { label: "Already open", text: "it stays open" }
          ]
        },
        {
          kind: "entry",
          name: "Coming back after a long absence",
          tag: "up",
          context: "With the Rout and kept words, your company sets off again faster.",
          changes: [{ label: "First hour after 8 h away", before: "5 to 16 stages", after: "13 to 20 stages" }]
        },
        { kind: "h2", text: "Clarity" },
        {
          kind: "entry",
          name: "What the game tells you",
          tag: "changed",
          context: "Everything should be understood on first reading.",
          changes: [
            { label: "Powers, altars, market items", text: "each says what it does, numbers included, and powers give their recharge" },
            { label: "Companions", text: "each names the bonus of their level 50 talent" },
            { label: "Stories", text: "those of the companions, creatures and places are rewritten to be understood on first reading" },
            { label: "Error messages", text: "they say plainly what is happening and what to do" }
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "entry",
          name: "Various",
          tag: "fixed",
          changes: [
            { label: "New version", before: "loaded after 30 s without you touching anything", after: "loaded as soon as nothing important is showing" },
            { label: "Forgot password", text: "the confirmation shows in your language" }
          ]
        },
        { kind: "p", text: "Thank you for walking with us. Safe travels, and see you next night." }
      ]
    }
  },
  {
    slug: "patch-notes-0-3",
    date: "2026-09-30",
    kind: "patch",
    version: "v0.3",
    cover: { biome: "forgotten-caves", creature: "stone-devourer" },
    fr: {
      title: "Notes de mise à jour 0.3",
      summary: "La Promesse arrive au Sanctuaire, le Grand Livre te montre ce qu'il a vu, le Sanctuaire s'éveille par étapes et le Pari de Pip paie à la hauteur de ta route.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Tes compagnons commencent à se souvenir de toi. Cette version leur donne quelque chose à te demander : ta parole. Elle t'apprend aussi le Sanctuaire pas à pas, au lieu de tout t'ouvrir d'un coup." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "entry",
          name: "La Promesse",
          tag: "new",
          context: "Un compagnon qui se souvient à moitié de toi te demande ta parole pour la nuit.",
          changes: [
            { label: "Où", text: "une nouvelle section du Sanctuaire, au crépuscule, vers ta quatrième nuit" },
            { label: "Ce qu'il demande", text: "ne pas frapper, ne pas utiliser de pouvoir, n'engager personne après lui avant le premier gardien, et d'autres encore" },
            { label: "Parole tenue", text: "si un Roi tombe cette nuit-là" },
            { label: "Rompre", text: "possible si tu le choisis, et le même compagnon ne demande jamais deux nuits de suite" }
          ]
        },
        {
          kind: "entry",
          name: "Scènes du Grand Livre",
          tag: "new",
          context: "Les grands moments de ta route méritent d'être vus.",
          changes: [
            { label: "Quoi", text: "de courtes scènes en pixel art, une phrase par plan" },
            { label: "La première", text: "à ta première ascension" },
            { label: "Après", text: "tu peux les passer, et les revoir dans la Chronique" }
          ]
        },
        {
          kind: "entry",
          name: "Le Sanctuaire",
          tag: "changed",
          context: "Treize autels d'un coup, c'était trop. Il s'éveille maintenant en trois temps.",
          changes: [
            { label: "Première nuit", text: "Puissance, Lame, Fortune et Patience" },
            { label: "Troisième nuit", text: "Temps, Marchandage et Trésor" },
            { label: "Cinquième nuit", text: "les six autres" },
            { label: "Autels déjà montés", text: "ils restent ouverts, et ceux au maximum se rangent sur une seule ligne" }
          ]
        },
        {
          kind: "entry",
          name: "Partie d'invité",
          tag: "new",
          changes: [{ label: "Recharger la page", before: "ta progression est perdue", after: "gardée 30 jours, hors classement" }]
        },
        {
          kind: "entry",
          name: "Reliques",
          tag: "changed",
          changes: [
            { label: "Comparaison", text: "chaque relique dit de combien elle multiplie les dégâts de ta compagnie, face à celle que tu portes" },
            { label: "Sac", text: "trié par date, par rareté ou par emplacement" }
          ]
        },
        {
          kind: "entry",
          name: "Confort et regard",
          tag: "new",
          changes: [
            { label: "Retrouvailles", text: "le récit de ton retour se termine sur un fragment de la Chronique pas encore lu" },
            { label: "Réglages", text: "couleurs pour daltoniens, et vibrations sur téléphone" },
            { label: "Achats", text: "un repère t'indique combien sont à ta portée" },
            { label: "Souvenirs", text: "les compagnons qui se souviennent de toi au même crépuscule partagent un seul message" },
            { label: "Créatures et décors", text: "une vingtaine de créatures et les cinq décors de biome redessinés, de nouveaux effets à la mort des monstres" },
            { label: "Les mots du jeu", text: "les boss deviennent Gardiens et Élites, « Farm » devient « Rester », les succès deviennent les Hauts faits, « Cette vie » devient « Cette nuit »" }
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "entry",
          name: "Bonus de Patience",
          tag: "up",
          context: "Frapper ne doit jamais te faire perdre ce que la patience t'a donné.",
          changes: [{ label: "Tes frappes", before: "remplacent le bonus coup pour coup", after: "s'ajoutent à lui" }]
        },
        {
          kind: "entry",
          name: "Autel de la récolte",
          tag: "down",
          context: "Il montait sans fin et écrasait tous les autres autels.",
          changes: [
            { label: "Prix par niveau", before: "+30 %", after: "x3" },
            { label: "Niveau maximum", before: "aucun", after: "5, soit +50 % d'essences" },
            { label: "Niveaux au-delà", text: "rendus en essences, avec un message" }
          ]
        },
        {
          kind: "entry",
          name: "Marché d'éclats",
          tag: "up",
          changes: [{ label: "Potion de rage, Élixir de fortune, Parchemin de frappe", before: "1 h cumulée au plus", after: "sans limite" }]
        },
        {
          kind: "entry",
          name: "Le Pari de Pip",
          tag: "up",
          context: "Plus loin sur la route, il payait des miettes.",
          changes: [
            { label: "Gain", before: "30 fois l'or de l'étape", after: "45 s de l'or de ta route, de 30 à environ 418 fois l'étape" },
            { label: "Entre deux paris", text: "3 minutes" }
          ]
        },
        {
          kind: "entry",
          name: "Reconnaissance",
          tag: "changed",
          context: "Se souvenir de toi passe aussi par ta parole.",
          changes: [
            { label: "Cinquième palier", before: "30 nuits", after: "32 nuits" },
            { label: "Paliers 4 et 5", text: "chacun demande une parole tenue envers ce compagnon" },
            { label: "Parole tenue", text: "compte comme 2 nuits" }
          ]
        },
        {
          kind: "entry",
          name: "La Descente",
          tag: "changed",
          changes: [
            { label: "Fils gagnés", before: "selon tes essences", after: "selon ta plus grande profondeur" },
            { label: "Fils déjà tissés", text: "ils te restent" },
            { label: "Chaîne d'abondance", text: "moins chère à ses hauts niveaux, la différence rendue en fils" }
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "entry",
          name: "Divers",
          tag: "fixed",
          changes: [
            { label: "Biomes", text: "chacun retrouve ses propres couleurs de nuit" },
            { label: "Phrase d'ouverture et de retour", before: "par-dessus le monstre", after: "en haut de la scène, lisible en mouvements réduits" },
            { label: "Conseils des premières minutes", text: "ils disparaissent une fois suivis, une fois leur endroit ouvert ou au bout de 30 s, et ne reviennent plus à chaque gardien manqué" },
            { label: "Retour sur la page", text: "le jeu reprend juste, et les messages ne sautent plus" },
            { label: "Polices", text: "elles s'affichent enfin comme prévu" }
          ]
        },
        { kind: "p", text: "Merci de marcher avec nous. Tiens parole, et bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.3",
      summary: "The Promise arrives at the Sanctum, the Ledger shows you what it saw, the Sanctum wakes step by step and Pip's Wager pays up to the size of your road.",
      body: [
        { kind: "p", text: "Good evening, walker. Your companions are starting to remember you. This version gives them something to ask of you: your word. It also teaches you the Sanctum step by step, instead of opening it all at once." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "The Promise",
          tag: "new",
          context: "A companion who half remembers you asks for your word for the night.",
          changes: [
            { label: "Where", text: "a new section of the Sanctum, at dusk, around your fourth night" },
            { label: "What they ask", text: "no strikes, no powers, nobody hired after them before the first guardian, and more" },
            { label: "Word kept", text: "if a King falls that night" },
            { label: "Breaking it", text: "possible if you choose, and the same companion never asks two nights in a row" }
          ]
        },
        {
          kind: "entry",
          name: "Ledger scenes",
          tag: "new",
          context: "The great moments of your road deserve to be seen.",
          changes: [
            { label: "What", text: "short pixel art scenes, one line per shot" },
            { label: "The first", text: "at your first ascension" },
            { label: "Afterwards", text: "you can skip them, and watch them again in the Chronicle" }
          ]
        },
        {
          kind: "entry",
          name: "The Sanctum",
          tag: "changed",
          context: "Thirteen altars at once was too much. It now wakes in three steps.",
          changes: [
            { label: "First night", text: "Might, Blade, Fortune and Patience" },
            { label: "Third night", text: "Time, Bargains and Treasure" },
            { label: "Fifth night", text: "the other six" },
            { label: "Altars already raised", text: "they stay open, and maxed ones fold into a single line" }
          ]
        },
        {
          kind: "entry",
          name: "Guest game",
          tag: "new",
          changes: [{ label: "Reloading the page", before: "your progress is lost", after: "kept for 30 days, off the leaderboard" }]
        },
        {
          kind: "entry",
          name: "Relics",
          tag: "changed",
          changes: [
            { label: "Comparison", text: "every relic tells how much it multiplies your company's damage, against the one you wear" },
            { label: "Bag", text: "sorted by date, rarity or slot" }
          ]
        },
        {
          kind: "entry",
          name: "Comfort and looks",
          tag: "new",
          changes: [
            { label: "Reunion", text: "the story of your return ends on a fragment of the Chronicle you have not read yet" },
            { label: "Settings", text: "colorblind colors, and vibration on phones" },
            { label: "Purchases", text: "a marker tells you how many are within reach" },
            { label: "Memories", text: "companions who remember you at the same dusk share a single message" },
            { label: "Creatures and backdrops", text: "about twenty creatures and the five biome backdrops redrawn, new effects when monsters fall" },
            { label: "The game's words", text: "bosses become Guardians and Elites, \"Farm\" becomes \"Stay\", achievements become Deeds, \"This life\" becomes \"This night\"" }
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "entry",
          name: "Patience bonus",
          tag: "up",
          context: "Striking should never cost you what patience gave you.",
          changes: [{ label: "Your strikes", before: "replace the bonus blow for blow", after: "add on top of it" }]
        },
        {
          kind: "entry",
          name: "Altar of Harvest",
          tag: "down",
          context: "It climbed without end and dwarfed every other altar.",
          changes: [
            { label: "Price per level", before: "+30%", after: "x3" },
            { label: "Maximum level", before: "none", after: "5, so +50% essences" },
            { label: "Levels past that", text: "refunded in essences, with a message" }
          ]
        },
        {
          kind: "entry",
          name: "Shard market",
          tag: "up",
          changes: [{ label: "Rage Potion, Fortune Elixir, Striking Scroll", before: "1 h stacked at most", after: "no limit" }]
        },
        {
          kind: "entry",
          name: "Pip's Wager",
          tag: "up",
          context: "Further down the road, he paid crumbs.",
          changes: [
            { label: "Payout", before: "30 times the stage's gold", after: "45 s of your road's gold, from 30 to about 418 times the stage" },
            { label: "Between two wagers", text: "3 minutes" }
          ]
        },
        {
          kind: "entry",
          name: "Recognition",
          tag: "changed",
          context: "Being remembered also goes through your word.",
          changes: [
            { label: "Fifth tier", before: "30 nights", after: "32 nights" },
            { label: "Tiers 4 and 5", text: "each asks for a word kept to that companion" },
            { label: "Kept word", text: "counts as 2 nights" }
          ]
        },
        {
          kind: "entry",
          name: "The Descent",
          tag: "changed",
          changes: [
            { label: "Threads earned", before: "by your essences", after: "by your greatest depth" },
            { label: "Threads already woven", text: "they stay yours" },
            { label: "Warp of Plenty", text: "cheaper at its high levels, the difference comes back as threads" }
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "entry",
          name: "Various",
          tag: "fixed",
          changes: [
            { label: "Biomes", text: "each one has its own night colors again" },
            { label: "Opening and return lines", before: "over the monster", after: "at the top of the scene, readable with reduced motion" },
            { label: "Hints of the first minutes", text: "they go away once followed, once their place is opened or after 30 s, and no longer come back at every missed guardian" },
            { label: "Coming back to the page", text: "the game picks up right, and messages no longer jump" },
            { label: "Fonts", text: "they finally show as intended" }
          ]
        },
        { kind: "p", text: "Thank you for walking with us. Keep your word, and safe travels." }
      ]
    }
  },
  {
    slug: "patch-notes-0-2",
    date: "2026-09-28",
    kind: "patch",
    version: "v0.2",
    cover: { biome: "dark-forest", creature: "old-grove" },
    fr: {
      title: "Notes de mise à jour 0.2",
      summary: "Le monde redessiné en pixel art, deux fois plus de créatures, une compagnie qui combat sous tes yeux, les Retrouvailles, et des autels repensés.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. Deux jours après l'ouverture, la route change de visage. Le monde est redessiné, il se peuple, ta compagnie se bat enfin à tes côtés, et ton absence ne te coûte plus rien." },
        { kind: "h2", text: "Nouveautés" },
        {
          kind: "entry",
          name: "Pixel art",
          tag: "new",
          changes: [{ label: "Monstres, décors, portraits", text: "tous redessinés en pixel art" }]
        },
        {
          kind: "entry",
          name: "Bestiaire",
          tag: "new",
          context: "La route se peuple.",
          changes: [
            { label: "Créatures par biome, hors élite et gardien", before: "3", after: "6" },
            { label: "Nouvelles venues", text: "quinze, comme l'Épouvantail creux, la Chouette endeuillée ou le Courtisan noyé, et dix autres qui en remplacent d'anciennes" },
            { label: "Tes victoires", text: "elles passent à la nouvelle venue" },
            { label: "Voyageurs rares", text: "un par biome, comme le Berger égaré : une chance sur 200, une fois par nuit au plus, 5 fois l'or" }
          ]
        },
        {
          kind: "entry",
          name: "Ta compagnie sur la scène",
          tag: "new",
          context: "Tu vois enfin ceux qui se battent pour toi.",
          changes: [
            { label: "Tirs", text: "flèche, lame, griffe ou sort, de tes compagnons vers le monstre, avec leurs dégâts chaque seconde" },
            { label: "À tes côtés", text: "les 5 plus forts, 3 sur téléphone" }
          ]
        },
        {
          kind: "entry",
          name: "Achats en ton absence",
          tag: "new",
          context: "Activé par défaut. Ta compagnie se débrouille quand tu lâches la route.",
          changes: [
            { label: "Quand", text: "deux minutes après ta dernière action" },
            { label: "Ce qu'elle fait", text: "elle engage, monte de niveau, prend ses talents et retente le gardien qui l'arrêtait" },
            { label: "Jeu fermé", text: "ce temps est rejoué à ton retour, jusqu'à 8 h" }
          ]
        },
        {
          kind: "entry",
          name: "Retrouvailles",
          tag: "new",
          context: "Revenir doit faire plaisir.",
          changes: [
            { label: "Après 30 min d'absence ou plus", text: "tes compagnons font le triple de dégâts pendant un sixième de ton absence, 1 h au plus" },
            { label: "Le récit", text: "la route parcourue, l'or gagné et dépensé, les gardiens passés, qui t'a rejoint et ce qui bloque encore" }
          ]
        },
        {
          kind: "entry",
          name: "Hall des héros",
          tag: "new",
          changes: [
            { label: "Bestiaire", text: "des lignes du Grand Livre à 1, 100 et 1 000 victoires sur chaque créature, et +1 % d'or par biome complété" },
            { label: "Chronique", text: "elle arrive" },
            { label: "Hauts faits", before: "75", after: "154" }
          ]
        },
        {
          kind: "entry",
          name: "Sur la route",
          tag: "new",
          changes: [
            { label: "Blessures", text: "jusqu'à l'étape 44, une élite ou un gardien qui t'a repoussé garde ses blessures, jusqu'aux trois quarts de sa vie" },
            { label: "Reconnaissance", text: "tes compagnons se souviennent de toi d'une nuit à l'autre" },
            { label: "Averse de cristaux", text: "un cristal sur 20 en devient 5" },
            { label: "Pari de Pip", text: "frappe 13 fois en 5 s, il paie 30 fois l'or au lieu de 10" },
            { label: "Reliques", text: "une relique trouvée va directement dans un emplacement vide" },
            { label: "Fenêtres", text: "chacune apparaît quand tu peux t'en servir, annoncée une fois" }
          ]
        },
        { kind: "h2", text: "Équilibrage" },
        {
          kind: "entry",
          name: "Or et essences",
          tag: "changed",
          context: "L'ascension doit valoir le coup.",
          changes: [
            { label: "Or par monstre", before: "x1", after: "x0,5 (le tiers à l'étape 1)" },
            { label: "Essences à chaque ascension", text: "environ 4 fois plus" },
            { label: "Essences minimum", before: "5", after: "20" },
            { label: "Essences à l'étape 60", before: "18", after: "65" }
          ]
        },
        {
          kind: "entry",
          name: "Autels",
          tag: "changed",
          context: "Chaque niveau compte maintenant autant que le précédent. Tes anciens niveaux t'ont été rendus en essences.",
          changes: [
            { label: "Puissance", before: "un bonus qui s'ajoute", after: "x1,10 de dégâts par niveau" },
            { label: "Fortune", before: "un bonus qui s'ajoute", after: "x1,12 d'or par niveau" },
            { label: "Lame et Patience", text: "multiplient aussi leur effet à chaque niveau, et leur prix monte plus vite" },
            { label: "Autel du voyageur", text: "chaque nuit commence 10 étapes plus loin par niveau, jamais plus de la moitié de ton record, 10 niveaux au plus" },
            { label: "Autel du destin", text: "5 niveaux au plus" }
          ]
        },
        {
          kind: "entry",
          name: "Bonus de Patience",
          tag: "up",
          changes: [
            { label: "Activation", before: "après 60 s sans frapper", after: "toujours actif" },
            { label: "Tes frappes", text: "elles le remplacent coup pour coup, donc frapper ne te coûte jamais de dégâts" },
            { label: "Kaelen et Morgrath, talent de niveau 50", text: "+50 % et +100 % au bonus de Patience" }
          ]
        },
        {
          kind: "entry",
          name: "Reliques",
          tag: "down",
          changes: [
            { label: "Chance de coup critique", before: "32 % au plus", after: "16 % au plus" },
            { label: "Dégâts critiques", before: "sans plafond", after: "+50 % au plus" }
          ]
        },
        {
          kind: "entry",
          name: "Absence",
          tag: "up",
          changes: [{ label: "Pendant 8 h au plus", before: "même étape, 50 % d'efficacité", after: "ta compagnie avance et dépense son or, à pleine efficacité" }]
        },
        {
          kind: "entry",
          name: "Gardiens et hauts faits",
          tag: "changed",
          changes: [
            { label: "Gardiens rejoués depuis la carte", text: "ils ne paient plus que de l'or ; reliques et éclats viennent du gardien de ta plus lointaine étape" },
            { label: "Hauts faits", text: "le gros bonus revient aux deux plus hauts paliers de chaque série allongée" },
            { label: "Étapes 300 et 500", before: "7,5 %", after: "3 %" }
          ]
        },
        { kind: "h2", text: "Corrections" },
        {
          kind: "entry",
          name: "Divers",
          tag: "fixed",
          changes: [
            { label: "Haut fait « Engager N compagnons »", text: "il demandait un compagnon de trop" },
            { label: "Compteurs d'or et d'éclats", text: "ils ne font plus bouger l'en-tête" },
            { label: "Chargement", text: "si la route tarde à se charger, le jeu réessaie au lieu de te faire commencer une partie vierge" }
          ]
        },
        { kind: "p", text: "Merci d'être là dès les premières nuits. Bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.2",
      summary: "The world redrawn in pixel art, twice as many creatures, a company that fights before your eyes, the Reunion, and reworked altars.",
      body: [
        { kind: "p", text: "Good evening, walker. Two days after the opening, the road changes its face. The world is redrawn, it fills up, your company finally fights by your side, and being away no longer costs you anything." },
        { kind: "h2", text: "New" },
        {
          kind: "entry",
          name: "Pixel art",
          tag: "new",
          changes: [{ label: "Monsters, backdrops, portraits", text: "all redrawn in pixel art" }]
        },
        {
          kind: "entry",
          name: "Bestiary",
          tag: "new",
          context: "The road fills up.",
          changes: [
            { label: "Creatures per biome, besides elite and guardian", before: "3", after: "6" },
            { label: "Newcomers", text: "fifteen, like the Hollow Scarecrow, the Mourning Owl or the Drowned Courtier, and ten more replacing old ones" },
            { label: "Your kills", text: "they carry over to the newcomer" },
            { label: "Rare wanderers", text: "one per biome, like the Lost Shepherd: one chance in 200, at most once a night, 5 times the gold" }
          ]
        },
        {
          kind: "entry",
          name: "Your company on the scene",
          tag: "new",
          context: "You finally see those who fight for you.",
          changes: [
            { label: "Shots", text: "arrow, blade, claw or spell, from your companions to the monster, with their damage every second" },
            { label: "By your side", text: "the 5 strongest, 3 on phones" }
          ]
        },
        {
          kind: "entry",
          name: "Spend while away",
          tag: "new",
          context: "On by default. Your company manages when you let go of the road.",
          changes: [
            { label: "When", text: "two minutes after your last action" },
            { label: "What it does", text: "it hires, levels up, takes its talents and tries again the guardian that stopped it" },
            { label: "Game closed", text: "that time is played back when you return, up to 8 h" }
          ]
        },
        {
          kind: "entry",
          name: "Reunion",
          tag: "new",
          context: "Coming back should feel good.",
          changes: [
            { label: "After 30 min away or more", text: "your companions deal triple damage for a sixth of your absence, 1 h at most" },
            { label: "The story", text: "the road walked, gold earned and spent, guardians passed, who joined you and what still blocks the way" }
          ]
        },
        {
          kind: "entry",
          name: "Hall of heroes",
          tag: "new",
          changes: [
            { label: "Bestiary", text: "lines from the Ledger at 1, 100 and 1,000 kills of each creature, and +1% gold per biome completed" },
            { label: "Chronicle", text: "it arrives" },
            { label: "Deeds", before: "75", after: "154" }
          ]
        },
        {
          kind: "entry",
          name: "On the road",
          tag: "new",
          changes: [
            { label: "Wounds", text: "up to stage 44, an elite or guardian that pushed you back keeps its wounds, up to three quarters of its health" },
            { label: "Recognition", text: "your companions remember you from one night to the next" },
            { label: "Crystal Storm", text: "one crystal in 20 becomes 5" },
            { label: "Pip's Wager", text: "strike 13 times in 5 s and he pays 30 times the gold instead of 10" },
            { label: "Relics", text: "a relic you find goes straight into an empty slot" },
            { label: "Windows", text: "each appears when you can use it, announced once" }
          ]
        },
        { kind: "h2", text: "Balance" },
        {
          kind: "entry",
          name: "Gold and essences",
          tag: "changed",
          context: "Ascension should be worth it.",
          changes: [
            { label: "Gold per monster", before: "x1", after: "x0.5 (a third at stage 1)" },
            { label: "Essences at every ascension", text: "about 4 times more" },
            { label: "Minimum essences", before: "5", after: "20" },
            { label: "Essences at stage 60", before: "18", after: "65" }
          ]
        },
        {
          kind: "entry",
          name: "Altars",
          tag: "changed",
          context: "Every level now counts as much as the one before. Your old levels were refunded in essences.",
          changes: [
            { label: "Might", before: "an added bonus", after: "x1.10 damage per level" },
            { label: "Fortune", before: "an added bonus", after: "x1.12 gold per level" },
            { label: "Blade and Patience", text: "also multiply their effect at every level, and their price rises faster" },
            { label: "Altar of the Wanderer", text: "every night starts 10 stages further per level, never more than half your record, 10 levels at most" },
            { label: "Altar of Fate", text: "5 levels at most" }
          ]
        },
        {
          kind: "entry",
          name: "Patience bonus",
          tag: "up",
          changes: [
            { label: "Activation", before: "after 60 s without striking", after: "always on" },
            { label: "Your strikes", text: "they replace it blow for blow, so striking never costs you damage" },
            { label: "Kaelen and Morgrath, level 50 talent", text: "+50% and +100% to the Patience bonus" }
          ]
        },
        {
          kind: "entry",
          name: "Relics",
          tag: "down",
          changes: [
            { label: "Critical chance", before: "32% at most", after: "16% at most" },
            { label: "Critical damage", before: "no cap", after: "+50% at most" }
          ]
        },
        {
          kind: "entry",
          name: "Time away",
          tag: "up",
          changes: [{ label: "For up to 8 h", before: "same stage, 50% efficiency", after: "your company moves on and spends its gold, at full efficiency" }]
        },
        {
          kind: "entry",
          name: "Guardians and deeds",
          tag: "changed",
          changes: [
            { label: "Guardians replayed from the map", text: "they pay only gold; relics and shards come from the guardian of your furthest stage" },
            { label: "Deeds", text: "the big bonus goes to the two highest tiers of every lengthened series" },
            { label: "Stages 300 and 500", before: "7.5%", after: "3%" }
          ]
        },
        { kind: "h2", text: "Fixes" },
        {
          kind: "entry",
          name: "Various",
          tag: "fixed",
          changes: [
            { label: "\"Hire N companions\" deed", text: "it asked for one companion too many" },
            { label: "Gold and shard counters", text: "they no longer shake the header" },
            { label: "Loading", text: "if the road is slow to load, the game tries again instead of starting you on a blank game" }
          ]
        },
        { kind: "p", text: "Thank you for being here from the very first nights. Safe travels." }
      ]
    }
  },
  {
    slug: "patch-notes-0-1",
    date: "2026-09-26",
    kind: "patch",
    version: "v0.1",
    cover: { biome: "green-plains", creature: "moss-alpha" },
    fr: {
      title: "Notes de mise à jour 0.1",
      summary: "La route s'ouvre : cinq biomes jusqu'au Roi déchu, 21 compagnons, six pouvoirs, l'ascension et ses 13 autels, les reliques et le Hall des héros.",
      body: [
        { kind: "p", text: "Bonsoir, marcheuse, marcheur. La route vers le trône est ouverte. Voici ce qui t'attend dans la toute première version d'Idlebound." },
        { kind: "h2", text: "La route" },
        {
          kind: "entry",
          name: "Le combat",
          tag: "new",
          context: "Frappe le monstre pour l'abattre et ramasser son or.",
          changes: [
            { label: "Par étape", text: "10 monstres" },
            { label: "Élite", text: "toutes les 5 étapes" },
            { label: "Gardien", text: "toutes les 10 étapes" },
            { label: "Temps pour vaincre", text: "30 s par monstre" }
          ]
        },
        {
          kind: "entry",
          name: "Cinq biomes",
          tag: "new",
          changes: [
            { label: "Le chemin", text: "des Plaines verdoyantes aux Ruines du roi déchu" },
            { label: "Le Roi déchu", text: "à l'étape 50" },
            { label: "Au-delà", text: "la route recommence, plus dangereuse à chaque ère" }
          ]
        },
        {
          kind: "entry",
          name: "Rencontres",
          tag: "new",
          changes: [
            { label: "Rat doré", text: "une chance sur 100, 10 fois l'or" },
            { label: "Cristal errant", text: "il passe de temps en temps : de l'or, des dégâts multipliés ou des éclats si tu l'attrapes à temps" }
          ]
        },
        { kind: "h2", text: "Ta compagnie" },
        {
          kind: "entry",
          name: "Aldric et ses compagnons",
          tag: "new",
          changes: [
            { label: "Aldric, l'Aventurier", text: "c'est toi : ses niveaux renforcent tes frappes" },
            { label: "Compagnons", text: "vingt, une archère, un moine, une liche et bien d'autres" },
            { label: "Talents", text: "à certains niveaux" },
            { label: "Achats", text: "par 1, 10, 25, 100 ou au maximum" }
          ]
        },
        {
          kind: "entry",
          name: "Pouvoirs",
          tag: "new",
          changes: [{ label: "Six, touches 1 à 6", text: "Frénésie, Cri de ralliement, Œil de faucon, Pluie d'or, Rituel de résonance et Écho temporel" }]
        },
        { kind: "h2", text: "Ce que tu gardes" },
        {
          kind: "entry",
          name: "L'ascension",
          tag: "new",
          context: "Une fois le Roi déchu tombé, tu recommences la route, plus fort.",
          changes: [
            { label: "Essences", text: "+10 % de dégâts chacune" },
            { label: "Autels", text: "13, aux bonus permanents" }
          ]
        },
        {
          kind: "entry",
          name: "Reliques et marché",
          tag: "new",
          changes: [
            { label: "Reliques", text: "arme, armure, amulette et anneau, de commun à mythique" },
            { label: "Forge", text: "jusqu'à +20, avec des éclats" },
            { label: "Marché d'éclats", text: "coffres de reliques, potions, parchemins et sabliers" }
          ]
        },
        {
          kind: "entry",
          name: "Hall des héros",
          tag: "new",
          changes: [
            { label: "Hauts faits", text: "75, chacun un bonus de dégâts permanent" },
            { label: "Statistiques", text: "tout ce que tu as accompli" },
            { label: "Absence", text: "ta compagnie se bat sans toi, jusqu'à 8 h" }
          ]
        },
        { kind: "h2", text: "Ton compte" },
        {
          kind: "entry",
          name: "Compte et Réglages",
          tag: "new",
          changes: [
            { label: "Commencer", text: "aussitôt, sans compte ; crée-en un pour retrouver ta partie sur tous tes appareils" },
            { label: "Classement", text: "selon l'étape, les ascensions, les essences et les hauts faits" },
            { label: "Réglages", text: "la langue, le son, l'écriture des grands nombres, les chiffres de dégâts et les mouvements réduits" }
          ]
        },
        { kind: "p", text: "Merci d'être parmi les premiers à marcher. Le Roi t'attend. Bonne route." }
      ]
    },
    en: {
      title: "Patch notes 0.1",
      summary: "The road opens: five biomes up to the Fallen King, 21 companions, six powers, ascension and its 13 altars, relics and the Hall of heroes.",
      body: [
        { kind: "p", text: "Good evening, walker. The road to the throne is open. Here is what awaits you in the very first version of Idlebound." },
        { kind: "h2", text: "The road" },
        {
          kind: "entry",
          name: "Combat",
          tag: "new",
          context: "Strike the monster to bring it down and pick up its gold.",
          changes: [
            { label: "Per stage", text: "10 monsters" },
            { label: "Elite", text: "every 5 stages" },
            { label: "Guardian", text: "every 10 stages" },
            { label: "Time to win", text: "30 s per monster" }
          ]
        },
        {
          kind: "entry",
          name: "Five biomes",
          tag: "new",
          changes: [
            { label: "The way", text: "from the Verdant Plains to the Fallen King's Ruins" },
            { label: "The Fallen King", text: "at stage 50" },
            { label: "Beyond", text: "the road starts again, more dangerous with every era" }
          ]
        },
        {
          kind: "entry",
          name: "Encounters",
          tag: "new",
          changes: [
            { label: "Golden Rat", text: "one chance in 100, 10 times the gold" },
            { label: "Wandering Crystal", text: "it passes by now and then: gold, multiplied damage or shards if you catch it in time" }
          ]
        },
        { kind: "h2", text: "Your company" },
        {
          kind: "entry",
          name: "Aldric and his companions",
          tag: "new",
          changes: [
            { label: "Aldric, the Adventurer", text: "is you: his levels strengthen your strikes" },
            { label: "Companions", text: "twenty, an archer, a monk, a lich and many more" },
            { label: "Talents", text: "at certain levels" },
            { label: "Purchases", text: "by 1, 10, 25, 100 or as many as you can" }
          ]
        },
        {
          kind: "entry",
          name: "Powers",
          tag: "new",
          changes: [{ label: "Six, keys 1 to 6", text: "Frenzy, Rallying Cry, Hawkeye, Golden Rain, Resonance Ritual and Time Echo" }]
        },
        { kind: "h2", text: "What you keep" },
        {
          kind: "entry",
          name: "Ascension",
          tag: "new",
          context: "Once the Fallen King has fallen, you start the road again, stronger.",
          changes: [
            { label: "Essences", text: "+10% damage each" },
            { label: "Altars", text: "13, with lasting bonuses" }
          ]
        },
        {
          kind: "entry",
          name: "Relics and market",
          tag: "new",
          changes: [
            { label: "Relics", text: "weapon, armor, amulet and ring, from common to mythic" },
            { label: "Forge", text: "up to +20, with shards" },
            { label: "Shard market", text: "relic chests, potions, scrolls and hourglasses" }
          ]
        },
        {
          kind: "entry",
          name: "Hall of heroes",
          tag: "new",
          changes: [
            { label: "Deeds", text: "75, each a lasting damage bonus" },
            { label: "Statistics", text: "everything you have done" },
            { label: "Time away", text: "your company fights without you, up to 8 h" }
          ]
        },
        { kind: "h2", text: "Your account" },
        {
          kind: "entry",
          name: "Account and Settings",
          tag: "new",
          changes: [
            { label: "Starting", text: "at once, with no account; make one to find your game on all your devices" },
            { label: "Leaderboard", text: "by stage, ascensions, essences and deeds" },
            { label: "Settings", text: "language, sound, how big numbers are written, damage numbers and reduced motion" }
          ]
        },
        { kind: "p", text: "Thank you for being among the first to walk. The King is waiting. Safe travels." }
      ]
    }
  }
];

/** The article of that slug, if any. */
export function newsPost(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((post) => post.slug === slug);
}
