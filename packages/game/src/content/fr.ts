import type { GameText } from "./types";

const n = (value: number) => value.toLocaleString("fr-FR");
const exp = (value: number) => value.toExponential(0).replace("e+", "e");
const s = (count: number, word: string) => (count > 1 ? `${word}s` : word);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const RARITY_ADJECTIVE = {
  common: { m: "", f: "" },
  rare: { m: "fin", f: "fine" },
  epic: { m: "enchanté", f: "enchantée" },
  legendary: { m: "légendaire", f: "légendaire" },
  mythic: { m: "mythique", f: "mythique" }
} as const;

const BIOME_SUFFIX = [
  { m: "des plaines", f: "des plaines" },
  { m: "sylvestre", f: "sylvestre" },
  { m: "des profondeurs", f: "des profondeurs" },
  { m: "fangeux", f: "fangeuse" },
  { m: "royal", f: "royale" }
] as const;

export const fr: GameText = {
  biomes: {
    "green-plains": { name: "Plaines verdoyantes", description: "Des collines paisibles où tout aventurier fait ses premières armes." },
    "dark-forest": { name: "Forêt sombre", description: "Un bois dense où les ombres ont faim et où les ronces murmurent." },
    "forgotten-caves": { name: "Cavernes oubliées", description: "Des galeries glacées où chaque écho semble vivant." },
    "corrupted-marsh": { name: "Marais corrompu", description: "Une fange toxique qui avale les routes et les imprudents." },
    "fallen-king-ruins": { name: "Ruines du roi déchu", description: "Les derniers murs d'un royaume maudit vibrent encore de magie." }
  },
  monsters: {
    "field-rat": "Rat des champs",
    "wild-boar": "Sanglier nerveux",
    "rabid-rat": "Rat enragé",
    "tusk-king": "Grand-Défense",
    "moss-alpha": "Alpha moussu",
    "shade-wolf": "Loup de l'ombre",
    "briar-witch": "Sorcière des ronces",
    "blight-boar": "Sanglier flétri",
    "briar-matron": "Matrone des ronces",
    "old-grove": "Cœur du vieux bosquet",
    "blind-crawler": "Rampeur aveugle",
    "echo-bat": "Chauve-souris d'écho",
    "deep-wolf": "Loup des profondeurs",
    "howling-swarm": "Nuée hurlante",
    "stone-devourer": "Dévorateur de pierre",
    "bog-remnant": "Vestige fangeux",
    "putrid-crawler": "Rampeur putride",
    "marsh-hag": "Sorcière des marais",
    "bog-colossus": "Colosse de la fange",
    "rot-baron": "Baron de la pourriture",
    "royal-hound": "Molosse spectral",
    "crown-bat": "Chauve-souris royale",
    "fallen-sentinel": "Sentinelle déchue",
    "stone-warden": "Gardien de pierre",
    "ruined-king": "Roi déchu",
    "golden-rat": "Rat doré"
  },
  eraTags: ["", "Écho", "Cendre", "Néant", "Astral", "Primordial"],
  eraName: (era) => `Ère ${ROMAN[era] ?? era + 1}`,
  heroes: {
    aldric: { name: "Aldric", title: "L'Aventurier", lore: "C'est toi. Chaque clic est un coup d'épée. Chaque niveau, une leçon apprise." },
    maelle: { name: "Maëlle", title: "Chasseuse des plaines", lore: "Elle traque le gibier des plaines depuis l'enfance et ne rate jamais deux fois." },
    brom: { name: "Brom", title: "Forgeron itinérant", lore: "Son marteau répare les lames le matin et brise les crânes le soir." },
    ysolde: { name: "Ysolde", title: "Archère sylvestre", lore: "Les arbres de la forêt sombre lui prêtent leurs yeux." },
    cendre: { name: "Frère Cendre", title: "Moine des braises", lore: "Il a juré de ne jamais porter d'arme. Ses poings suffisent." },
    nyx: { name: "Nyx", title: "Lame d'ombre", lore: "Personne n'a vu son visage. Beaucoup ont vu ses dagues." },
    garrick: { name: "Garrick", title: "Mineur runique", lore: "Il creuse les cavernes oubliées à la recherche d'éclats d'étoile." },
    seraphine: { name: "Séraphine", title: "Druidesse des ronces", lore: "Elle parle aux racines, et les racines lui obéissent." },
    thorvald: { name: "Thorvald", title: "Briseur de pierre", lore: "Il a abattu une montagne pour un pari. Il a perdu le pari." },
    mirelle: { name: "Mirelle", title: "Alchimiste des marais", lore: "Ses fioles bouillonnent de choses que la raison réprouve." },
    kaelen: { name: "Kaelen", title: "Chevalier déchu", lore: "Ancien garde du roi, il cherche la rédemption au bout de sa lame." },
    oriane: { name: "Oriane", title: "Oracle d'écho", lore: "Elle entend ce que les cavernes ont dit il y a mille ans." },
    vorn: { name: "Vorn", title: "Dompteur de bêtes", lore: "Sa meute compte trois loups, un sanglier et quelque chose d'innommable." },
    lysandre: { name: "Lysandre", title: "Archimage", lore: "Il a lu tous les grimoires. Deux fois. À l'envers." },
    ashka: { name: "Ashka", title: "Prêtresse de braise", lore: "Là où elle prie, la terre fume pendant des jours." },
    nameless: { name: "Le Sans-Nom", title: "Chevalier errant", lore: "Son armure est vide. Du moins, c'est ce qu'on raconte." },
    eldra: { name: "Eldra", title: "Tisseuse du temps", lore: "Elle a vu la fin de cette aventure. Elle refuse d'en parler." },
    morgrath: { name: "Morgrath", title: "Seigneur liche", lore: "Allié improbable, il déteste le Roi déchu plus que la vie elle-même." },
    celestine: { name: "Célestine", title: "Voix des cristaux", lore: "Les essences chantent pour elle, et elle leur répond." },
    aurelion: { name: "Aurelion", title: "Roi-dragon", lore: "Le dernier dragon a choisi son camp. Le tien." },
    awakened: { name: "L'Éveillé", title: "Héros de la prophétie", lore: "Toi, peut-être. Dans une autre vie." }
  },
  talents: {
    "aldric-10": "Poigne ferme", "aldric-25": "Lame résonnante", "aldric-50": "Coup précis", "aldric-75": "Frappe héroïque",
    "aldric-100": "Écho de la lame", "aldric-150": "Maître d'armes", "aldric-200": "Légende vivante",
    "maelle-10": "Flèches barbelées", "maelle-25": "Tir en cloche", "maelle-50": "Piste fraîche", "maelle-100": "Pluie de flèches", "maelle-150": "Œil de la plaine",
    "brom-10": "Enclume portative", "brom-25": "Trempe à l'huile", "brom-50": "Affûtage", "brom-100": "Acier runique", "brom-150": "Forge ardente",
    "ysolde-10": "Corde en soie d'ombre", "ysolde-25": "Double encoche", "ysolde-50": "Point faible", "ysolde-100": "Chant des branches", "ysolde-150": "Flèche de l'aube",
    "cendre-10": "Paume de feu", "cendre-25": "Cent poings", "cendre-50": "Méditation", "cendre-100": "Souffle intérieur", "cendre-150": "Nirvana ardent",
    "nyx-10": "Dagues jumelles", "nyx-25": "Pas de l'ombre", "nyx-50": "Assassinat", "nyx-100": "Poison lent", "nyx-150": "Nuit éternelle",
    "garrick-10": "Pioche runique", "garrick-25": "Charge explosive", "garrick-50": "Filon doré", "garrick-100": "Veine d'écho", "garrick-150": "Cœur de la montagne",
    "seraphine-10": "Épines", "seraphine-25": "Lierre étrangleur", "seraphine-50": "Sève ancienne", "seraphine-100": "Forme d'ours", "seraphine-150": "Colère de la forêt",
    "thorvald-10": "Marteau de guerre", "thorvald-25": "Séisme", "thorvald-50": "Pas de géant", "thorvald-100": "Peau de granit", "thorvald-150": "Colère tellurique",
    "mirelle-10": "Fiole acide", "mirelle-25": "Brume toxique", "mirelle-50": "Transmutation", "mirelle-100": "Élixir instable", "mirelle-150": "Pierre philosophale",
    "kaelen-10": "Lame royale", "kaelen-25": "Charge héroïque", "kaelen-50": "Veille de la sentinelle", "kaelen-100": "Aura de défi", "kaelen-150": "Rédemption",
    "oriane-10": "Vision", "oriane-25": "Écho du passé", "oriane-50": "Prescience", "oriane-100": "Destin tissé", "oriane-150": "Voix des abysses",
    "vorn-10": "Morsure", "vorn-25": "Hurlement", "vorn-50": "Instinct de meute", "vorn-100": "Ruée sauvage", "vorn-150": "Roi des bêtes",
    "lysandre-10": "Projectile arcanique", "lysandre-25": "Boule de feu", "lysandre-50": "Surcharge arcanique", "lysandre-100": "Tempête de mana", "lysandre-150": "Singularité",
    "ashka-10": "Flamme sacrée", "ashka-25": "Bûcher", "ashka-50": "Offrande", "ashka-100": "Phénix", "ashka-150": "Soleil intérieur",
    "nameless-10": "Garde parfaite", "nameless-25": "Contre-attaque", "nameless-50": "Volonté de fer", "nameless-100": "Armure vivante", "nameless-150": "Légende oubliée",
    "eldra-10": "Ralentissement", "eldra-25": "Hâte", "eldra-50": "Boucle temporelle", "eldra-100": "Paradoxe", "eldra-150": "Fin des temps",
    "morgrath-10": "Toucher glacial", "morgrath-25": "Armée des morts", "morgrath-50": "Légion silencieuse", "morgrath-100": "Phylactère", "morgrath-150": "Nuit sans fin",
    "celestine-10": "Éclat prismatique", "celestine-25": "Chœur de cristal", "celestine-50": "Résonance cristalline", "celestine-100": "Harmonie", "celestine-150": "Symphonie astrale",
    "aurelion-10": "Souffle ardent", "aurelion-25": "Écailles d'or", "aurelion-50": "Trésor du dragon", "aurelion-100": "Vol royal", "aurelion-150": "Apocalypse",
    "awakened-10": "Premier pas", "awakened-25": "Destinée", "awakened-50": "Éveil", "awakened-100": "Transcendance", "awakened-150": "Infini"
  },
  skills: {
    frenzy: { name: "Frénésie", description: "Aldric frappe seul 10 fois par seconde pendant 30 s." },
    rally: { name: "Cri de ralliement", description: "Double les DPS de tous les compagnons pendant 30 s." },
    hawkeye: { name: "Œil de faucon", description: "+50 % de chances de coup critique pendant 30 s." },
    goldrain: { name: "Pluie d'or", description: "Triple l'or gagné pendant 30 s." },
    ritual: { name: "Rituel de résonance", description: "+5 % de DPS jusqu'à la prochaine ascension. Cumulable." },
    echo: { name: "Écho temporel", description: "Réinitialise le temps de recharge du dernier pouvoir utilisé." }
  },
  altars: {
    might: { name: "Autel de puissance", description: "Chaque niveau multiplie ton DPS par 1,10." },
    blade: { name: "Autel de la lame", description: "Chaque niveau multiplie tes dégâts de clic par 1,15 et ajoute 5 % à la part de DPS de tes clics (jusqu'à +50 %)." },
    fortune: { name: "Autel de fortune", description: "Chaque niveau multiplie ton or par 1,12." },
    patience: { name: "Autel de la patience", description: "Quand tu ne cliques pas, chaque niveau multiplie ton DPS par 1,15. Le bonus revient en 30 s après un clic." },
    time: { name: "Autel du temps", description: "+1 s au chrono des boss par niveau." },
    fate: { name: "Autel du destin", description: "+20 % de dégâts critiques par niveau." },
    precision: { name: "Autel de précision", description: "+1 % de chances de critique par niveau." },
    treasure: { name: "Autel du trésor", description: "+0,5 % d'apparition de rats dorés par niveau." },
    bargain: { name: "Autel du marchandage", description: "-2 % sur le coût des compagnons par niveau." },
    echoes: { name: "Autel des échos", description: "-5 % de temps de recharge des pouvoirs par niveau." },
    harvest: { name: "Autel de la récolte", description: "+10 % d'essences à l'ascension par niveau." },
    wanderer: { name: "Autel du voyageur", description: "Au début de chaque run, tes compagnons franchissent d'office 10 étapes par niveau et en rapportent l'or, sans dépasser la moitié de ton record. Ces étapes ne comptent pas dans les essences de l'ascension." },
    memory: { name: "Autel de la mémoire", description: "Commence chaque ascension avec l'or de 100 monstres de l'étape 5 × niveau." }
  },
  market: {
    chest: { name: "Coffre de relique", description: "Un objet aléatoire au niveau de ta meilleure étape." },
    "great-chest": { name: "Grand coffre", description: "Un objet épique ou mieux, avec plus de chances de légendaire." },
    rage: { name: "Potion de rage", description: "DPS ×2 pendant 10 min. La durée se cumule." },
    fortune: { name: "Élixir de fortune", description: "Or ×2 pendant 10 min. La durée se cumule." },
    autoclick: { name: "Parchemin de frappe", description: "5 clics automatiques par seconde pendant 10 min." },
    hourglass: { name: "Sablier doré", description: "Gagne instantanément 1 h d'or au rythme actuel." }
  },
  achievementNames: {
    stage: ["Premiers pas", "Éclaireur", "Régicide", "Au-delà des ruines", "Centurion", "Marcheur des ères", "Légende", "Mythe", "Divinité"],
    clicks: ["Doigt agile", "Tendinite naissante", "Mitraillette", "Cliqueur fou", "Dieu du clic"],
    crits: ["Coup de chance", "Œil exercé", "Point vital", "Exécuteur"],
    kills: ["Chasseur", "Tueur", "Fléau", "Extinction", "Apocalypse ambulante"],
    bosses: ["Tueur de géants", "Briseur de couronnes", "Fléau des seigneurs", "Le boss, c'est toi"],
    gold: ["Petite bourse", "Coffre plein", "Marchand prospère", "Trésor royal", "Banquier des dieux", "Or infini", "Au-delà de la richesse"],
    treasure: ["Ça brille !", "Chasseur de trésors", "Roi des rats"],
    crystal: ["Cristal attrapé", "Collectionneur", "Chasseur de lueurs", "Maître des cristaux"],
    levels: ["Recruteur", "Capitaine", "Général", "Maréchal", "Empereur"],
    hired: ["Petite bande", "Compagnie", "Légion", "Tous pour un"],
    skills: ["Apprenti", "Adepte", "Archimage"],
    ascend: ["Renaissance", "Cycle", "Éternel retour", "Samsara", "Au-delà du cycle"],
    essences: ["Première lueur", "Réservoir", "Source", "Océan d'essence", "Cristal primordial"],
    legend: ["Relique", "Armurerie légendaire"],
    mythic: ["Impossible !"],
    hit: ["Coup solide", "Coup titanesque", "Coup cosmique", "Big bang"],
    time: ["Une heure déjà", "Dévoué", "Vétéran"],
    fails: ["Retour à la case départ", "Persévérant"]
  },
  achievementCategories: {
    progression: "Progression",
    combat: "Combat",
    wealth: "Richesse",
    companions: "Compagnons",
    ascension: "Ascension",
    secrets: "Secrets"
  },
  achievementDescriptions: {
    stage: (t) => `Atteindre l'étape ${t}.`,
    clicks: (t) => `Cliquer ${n(t)} fois.`,
    crits: (t) => `Infliger ${n(t)} coups critiques.`,
    kills: (t) => `Vaincre ${n(t)} monstres.`,
    bosses: (t) => `Vaincre ${n(t)} boss.`,
    gold: (t) => `Gagner ${exp(t)} pièces d'or au total.`,
    treasure: (t) => `Vaincre ${n(t)} ${s(t, "rat")} ${s(t, "doré")}.`,
    crystal: (t) => `Attraper ${n(t)} ${t > 1 ? "cristaux errants" : "cristal errant"}.`,
    levels: (t) => `Cumuler ${n(t)} niveaux de compagnons.`,
    hired: (t) => `Recruter ${t} compagnons différents.`,
    skills: (t) => `Utiliser ${n(t)} pouvoirs.`,
    ascend: (t) => `Faire ${t} ${s(t, "ascension")}.`,
    essences: (t) => `Récolter ${n(t)} essences au total.`,
    legend: (t) => `Trouver ${t} ${s(t, "objet")} ${s(t, "légendaire")}.`,
    mythic: (t) => `Trouver ${t} ${s(t, "objet")} ${s(t, "mythique")}.`,
    hit: (t) => `Infliger un coup de ${exp(t)} dégâts.`,
    time: (t) => `Jouer ${Math.round(t / 3600)} h au total.`,
    fails: (t) => `Échouer ${t} fois contre un boss.`
  },
  slots: { weapon: "Arme", armor: "Armure", amulet: "Amulette", ring: "Anneau" },
  rarities: { common: "Commun", rare: "Rare", epic: "Épique", legendary: "Légendaire", mythic: "Mythique" },
  affixes: {
    dps: "DPS",
    click: "Dégâts de clic",
    gold: "Or",
    critChance: "Chance de critique",
    critDamage: "Dégâts critiques",
    bossDamage: "Dégâts aux boss",
    essence: "Essences d'ascension"
  },
  itemBases: {
    weapon: [
      { noun: "Lame", gender: "f" }, { noun: "Hache", gender: "f" }, { noun: "Épée", gender: "f" }, { noun: "Marteau", gender: "m" },
      { noun: "Arc", gender: "m" }, { noun: "Lance", gender: "f" }, { noun: "Faux", gender: "f" }
    ],
    armor: [
      { noun: "Cuirasse", gender: "f" }, { noun: "Cotte", gender: "f" }, { noun: "Manteau", gender: "m" }, { noun: "Harnois", gender: "m" },
      { noun: "Brigandine", gender: "f" }
    ],
    amulet: [{ noun: "Amulette", gender: "f" }, { noun: "Talisman", gender: "m" }, { noun: "Pendentif", gender: "m" }, { noun: "Médaillon", gender: "m" }],
    ring: [{ noun: "Anneau", gender: "m" }, { noun: "Sceau", gender: "m" }, { noun: "Chevalière", gender: "f" }, { noun: "Bague", gender: "f" }]
  },
  itemName: ({ noun, gender, rarity, biome }) =>
    [noun, RARITY_ADJECTIVE[rarity][gender], BIOME_SUFFIX[biome]?.[gender]].filter(Boolean).join(" ")
};
