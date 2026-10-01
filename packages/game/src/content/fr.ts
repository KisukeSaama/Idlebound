import { AGE_ECHOES_TEXT } from "./story/ages";
import { BESTIARY_TEXT } from "./story/bestiary";
import { BESTIARY_KEEP_TEXT } from "./story/bestiary-keep";
import { COMPANY_TEXT } from "./story/company";
import { CUTSCENES_TEXT } from "./story/cutscenes";
import { COMPANY_LATE_TEXT } from "./story/company-late";
import { PROMISES_TEXT } from "./story/promises";
import { PLACES_TEXT } from "./story/places";
import { STRATA_TEXT } from "./story/strata";
import { SYSTEMS_TEXT } from "./story/systems";
import { VOICES_TEXT } from "./story/voices";
import { roman } from "./roman";
import type { GameText } from "./types";

const n = (value: number) => value.toLocaleString("fr-FR");
const exp = (value: number) => value.toExponential(0).replace("e+", "e");
const s = (count: number, word: string) => (count > 1 ? `${word}s` : word);

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
  biomes: PLACES_TEXT.fr.biomes,
  monsters: {
    "field-rat": "Rat des champs",
    "wild-boar": "Sanglier nerveux",
    "carrion-crow": "Corbeau charognard",
    "last-reaper": "Dernier Faucheur",
    "moss-alpha": "Alpha moussu",
    "shade-wolf": "Loup de l'ombre",
    "briar-witch": "Sorcière des ronces",
    "grove-spinner": "Fileuse du bosquet",
    "root-knight": "Chevalier-racine",
    "old-grove": "Cœur du vieux bosquet",
    "blind-crawler": "Rampeur aveugle",
    "echo-bat": "Chauve-souris d'écho",
    "crystal-mite": "Acarien de cristal",
    "miner-shade": "Ombre de mineur",
    "stone-devourer": "Dévorateur de pierre",
    "bog-remnant": "Vestige fangeux",
    "rot-toad": "Crapaud putride",
    "will-o-wisp": "Feu follet",
    "bog-colossus": "Colosse de la fange",
    "rot-baron": "Baron de la pourriture",
    "hour-gargoyle": "Gargouille des heures",
    "banner-wraith": "Spectre-bannière",
    "fallen-sentinel": "Sentinelle déchue",
    "stone-warden": "Gardien de pierre",
    "ruined-king": "Roi déchu",
    "golden-rat": "Rat doré",
    "hollow-scarecrow": "Épouvantail creux",
    "lantern-moth": "Phalène-lanterne",
    "dusk-hare": "Lièvre du crépuscule",
    "lost-shepherd": "Le Berger égaré",
    "lantern-queen": "Reine-lanterne",
    ...BESTIARY_TEXT.fr.monsters,
    ...BESTIARY_KEEP_TEXT.fr.monsters
  },
  eraName: (era) => `Ère ${roman(era + 1)}`,
  heroes: {
    aldric: { name: "Aldric", title: "L'Aventurier", lore: "C'est toi. Chaque frappe sur un Vestige est la tienne, et chaque niveau d'entraînement rend tes frappes plus fortes." },
    maelle: { name: "Maëlle", title: "Chasseuse des plaines", lore: "Une chasseuse des plaines qui ne rate jamais deux fois. Elle se bat à ton côté à l'arc, t'apprend le Cri de ralliement et, au niveau 50, te rapporte plus d'or." },
    brom: { name: "Brom", title: "Forgeron itinérant", lore: "Le forgeron du carrefour : il répare les lames le matin et brise les crânes le soir. Au niveau 50, il rend tes frappes plus fortes." },
    ysolde: { name: "Ysolde", title: "Archère sylvestre", lore: "Une archère de la forêt sombre, dont les arbres lui prêtent leurs yeux. Elle t'apprend l'Œil de faucon et, au niveau 50, rend tes frappes plus souvent critiques." },
    cendre: { name: "Frère Cendre", title: "Moine des braises", lore: "Un moine qui a juré de ne jamais porter d'arme : ses poings suffisent. Il t'apprend la Pluie d'or et, au niveau 50, fait frapper plus fort toute la compagnie." },
    nyx: { name: "Nyx", title: "Lame d'ombre", lore: "Personne n'a vu son visage, beaucoup ont vu ses dagues. Elle t'apprend le Rituel de résonance et, au niveau 50, rend tes coups critiques bien plus meurtriers." },
    garrick: { name: "Garrick", title: "Mineur runique", lore: "Un mineur qui fouille les cavernes oubliées en quête d'éclats d'étoile. Il t'apprend l'Écho temporel et, au niveau 50, fait venir plus souvent les rats dorés." },
    seraphine: { name: "Séraphine", title: "Druidesse des ronces", lore: "Une druidesse qui parle aux racines, et les racines lui obéissent. Au niveau 50, elle fait frapper plus fort toute la compagnie." },
    thorvald: { name: "Thorvald", title: "Briseur de pierre", lore: "Il a abattu une montagne pour un pari, et il a perdu le pari. Au niveau 50, il te donne plus de temps contre les élites et les gardiens." },
    mirelle: { name: "Mirelle", title: "Alchimiste des marais", lore: "Une alchimiste des marais, dont les fioles bouillonnent de choses qu'on préfère ne pas nommer. Au niveau 50, elle te rapporte plus d'or." },
    kaelen: { name: "Kaelen", title: "Chevalier déchu", lore: "Ancien garde du roi, il cherche la rédemption au bout de sa lame. Au niveau 50, il augmente le bonus de Patience : la compagnie frappe toujours plus fort." },
    oriane: { name: "Oriane", title: "Oracle d'écho", lore: "Une oracle qui entend ce que les cavernes ont dit il y a mille ans. Au niveau 50, elle rend tes frappes plus souvent critiques." },
    vorn: { name: "Vorn", title: "Dompteur de bêtes", lore: "Sa meute : trois loups, un sanglier et quelque chose d'innommable. Au niveau 50, il fait frapper plus fort toute la compagnie." },
    lysandre: { name: "Lysandre", title: "Archimage", lore: "Il a lu tous les grimoires, deux fois, à l'envers. Au niveau 50, il rend tes coups critiques bien plus meurtriers." },
    ashka: { name: "Ashka", title: "Prêtresse de braise", lore: "Une prêtresse du feu : là où elle prie, la terre fume pendant des jours. Au niveau 50, elle te rapporte beaucoup plus d'or." },
    nameless: { name: "Le Sans-Nom", title: "Chevalier errant", lore: "Un chevalier muet dont l'armure serait vide. Il a affronté plus de gardiens que quiconque : au niveau 50, il te donne plus de temps pour les abattre." },
    eldra: { name: "Eldra", title: "Tisseuse du temps", lore: "Elle a vu la fin de cette aventure, et refuse d'en parler. Au niveau 50, elle fait frapper plus fort toute la compagnie." },
    morgrath: { name: "Morgrath", title: "Seigneur liche", lore: "Allié improbable, il déteste le Roi déchu plus que la vie elle-même. Au niveau 50, il augmente beaucoup le bonus de Patience : la compagnie frappe toujours plus fort." },
    celestine: { name: "Célestine", title: "Voix des cristaux", lore: "Les essences chantent pour elle, et elle leur répond. Au niveau 50, elle fait frapper plus fort toute la compagnie." },
    aurelion: { name: "Aurelion", title: "Roi-dragon", lore: "Le dernier dragon, qui a choisi ton camp. Au niveau 50, il te rapporte bien plus d'or." },
    awakened: { name: "L'Éveillé", title: "Héros de la prophétie", lore: "Toi, peut-être, dans une autre vie. Le plus fort de la compagnie : au niveau 50, toute la compagnie frappe plus fort." }
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
    frenzy: { name: "Frénésie", description: "Ta lame frappe seule 10 fois par seconde pendant 30 s. Recharge : 10 min." },
    rally: { name: "Cri de ralliement", description: "Maëlle sonne du cor : tous tes compagnons infligent le double de dégâts pendant 30 s. Recharge : 10 min." },
    hawkeye: { name: "Œil de faucon", description: "Ysolde te prête les yeux des arbres : +50 % de chances que tes frappes soient critiques (dix fois les dégâts, ou plus) pendant 30 s. Recharge : 20 min." },
    goldrain: { name: "Pluie d'or", description: "Frère Cendre prie Messire Pip : tout l'or gagné est triplé pendant 30 s. Recharge : 30 min." },
    ritual: { name: "Rituel de résonance", description: "Nyx t'accorde au rythme de la nuit : tes compagnons infligent +5 % de dégâts jusqu'à ta prochaine ascension. Chaque usage ajoute 5 % de plus. Recharge : 1 h." },
    echo: { name: "Écho temporel", description: "Garrick frappe une veine d'écho : le dernier pouvoir utilisé, s'il se recharge encore, est aussitôt de nouveau prêt. Recharge : 1 h." },
    unweave: SYSTEMS_TEXT.fr.unweave
  },
  altars: {
    might: { name: "Autel de puissance", description: "Tes compagnons infligent plus de dégâts : chaque niveau les multiplie par 1,10." },
    blade: { name: "Autel de la lame", description: "Tes frappes font plus mal : chaque niveau multiplie leurs dégâts par 1,10, y compris la part qui vient de tes compagnons." },
    fortune: { name: "Autel de fortune", description: "Tu gagnes plus d'or : chaque niveau multiplie tout l'or gagné par 1,12." },
    patience: { name: "Autel de la patience", description: "Augmente le bonus de Patience, des dégâts en plus que tes compagnons infligent toujours : +14 % au niveau 1, puis chaque niveau multiplie la part de cet autel par 1,14." },
    time: { name: "Autel du temps", description: "Tu as 1 seconde de plus par niveau pour abattre les élites et les gardiens (30 s au départ)." },
    fate: { name: "Autel du destin", description: "Tes frappes critiques infligent 20 % de dégâts en plus par niveau." },
    precision: { name: "Autel de précision", description: "Tes frappes gagnent +1 % de chances par niveau d'être critiques." },
    treasure: { name: "Autel du trésor", description: "+0,5 % de chances par niveau de croiser un rat doré, qui lâche dix fois plus d'or (1 % au départ, 25 % au plus)." },
    bargain: { name: "Autel du marchandage", description: "Les niveaux d'Aldric et de tes compagnons coûtent 2 % d'or en moins par niveau." },
    echoes: { name: "Autel des échos", description: "Tes pouvoirs se rechargent 5 % plus vite par niveau." },
    harvest: { name: "Autel de la récolte", description: "Tu gagnes 10 % d'essences en plus à chaque ascension, par niveau." },
    wanderer: { name: "Autel du voyageur", description: "Au début de chaque nuit, tes compagnons parcourent pour toi les 10 premières étapes par niveau et en rapportent l'or, sans dépasser la moitié de ta meilleure étape. Ces étapes ne donnent pas d'essences à l'ascension." },
    memory: { name: "Autel de la mémoire", description: "Chaque nuit commence avec de l'or en poche : ce que lâchent 100 monstres de l'étape 5 au niveau 1, de l'étape 10 au niveau 2, et ainsi de suite." }
  },
  market: {
    chest: { name: "Coffre de relique", description: "Une relique au hasard, au niveau de ta meilleure étape." },
    "great-chest": { name: "Grand coffre", description: "Une relique épique ou mieux, avec plus de chances de légendaire, au niveau de ta meilleure étape." },
    rage: { name: "Potion de rage", description: "Tes compagnons infligent le double de dégâts pendant 10 min. Chaque potion ajoute 10 min." },
    fortune: { name: "Élixir de fortune", description: "Tout l'or gagné est doublé pendant 10 min. Chaque élixir ajoute 10 min." },
    autoclick: { name: "Parchemin de frappe", description: "Ta lame frappe seule 5 fois par seconde pendant 10 min." },
    hourglass: { name: "Sablier doré", description: "Gagne instantanément 1 h d'or au rythme actuel." }
  },
  achievementNames: {
    clicks: ["L'acier en main", "Le poignet en compote", "Dix mille entailles", "Brom l'affûte encore", "Une lame que la nuit n'a pas forgée"],
    crits: ["Coup juste", "Œil exercé", "Trouver la couture", "Tout se défait"],
    kills: ["La route dégagée", "Mille Vestiges défaits", "Fléau des Vestiges", "Ils reviennent quand même", "La nuit connaît ton pas"],
    bosses: ["Tueur de géants", "Les gardiens savent ton nom", "Fléau des gardiens", "Ils t'attendent"],
    gold: ["Petite bourse", "Coffre plein", "Le Comptoir te salue", "Trésor royal", "Vieille monnaie, vieilles dettes", "Plus que le royaume n'en a frappé", "L'or ne pèse plus rien", "La monnaie des anciens rois", "La dîme des consacrés", "L'or tombé du ciel", "L'or filé", "Pièces esquissées", "Un mot pour dire l'or", "Paupières lourdes, bourse lourde", "Des pièces sous l'oreiller", "Jamais frappé", "Un flan vierge", "Pip ne compte plus"],
    treasure: ["Bonjour, Messire Pip", "Habitué de Messire Pip", "Messire Pip tient les comptes"],
    crystal: ["Une lumière qui tombe", "Célestine fredonne", "Chasseur de lueurs", "Le ciel te répond"],
    levels: ["Autour du feu", "Capitaine", "Compagnie jurée", "Amis de mille nuits", "Légendes de la nuit"],
    hired: ["Petite bande", "La Compagnie", "Une longue tablée", "Plus une place libre"],
    skills: ["Le cor et la prière", "Adepte", "Lysandre prend des notes"],
    legend: ["Une chose dont on se souvient", "Brom est jaloux"],
    mythic: ["Plus vrai que la nuit"],
    hit: ["Coup solide", "Coup titanesque", "Les étoiles tressaillent", "Un coup plus vieux que le monde"],
    time: ["Une heure déjà", "La lanterne reste allumée", "La route te connaît"],
    fails: ["La nuit te repousse", "Têtu comme un roi"],
    ...SYSTEMS_TEXT.fr.achievementNames
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
    stage: (t) => `Atteins l'étape ${t}.`,
    clicks: (t) => `Frappe ${n(t)} fois.`,
    crits: (t) => `Inflige ${n(t)} coups critiques.`,
    kills: (t) => `Vaincs ${n(t)} monstres.`,
    bosses: (t) => `Vaincs ${n(t)} ${t > 1 ? "élites et gardiens" : "élite ou gardien"}.`,
    gold: (t) => `Gagne ${exp(t)} pièces d'or au total.`,
    treasure: (t) => `Vaincs ${n(t)} ${s(t, "rat")} ${s(t, "doré")}.`,
    crystal: (t) => `Attrape ${n(t)} ${t > 1 ? "cristaux errants" : "cristal errant"}.`,
    levels: (t) => `Cumule ${n(t)} niveaux, Aldric et compagnons ensemble, au cours d'une même nuit.`,
    // The threshold counts Aldric (the walker), who is not a companion.
    hired: (t) => `Réunis ${t - 1} compagnons dans ta compagnie au cours d'une même nuit.`,
    skills: (t) => `Utilise ${n(t)} pouvoirs.`,
    ascend: (t) => `Fais ${t} ${s(t, "ascension")}.`,
    essences: (t) => `Récolte ${n(t)} essences au total.`,
    legend: (t) => `Trouve ${t} ${s(t, "objet")} ${s(t, "légendaire")}.`,
    mythic: (t) => `Trouve ${t} ${s(t, "objet")} ${s(t, "mythique")}.`,
    hit: (t) => `Inflige un coup de ${exp(t)} dégâts.`,
    time: (t) => `Marche ${Math.round(t / 3600)} h dans la nuit, en tout.`,
    fails: (t) => `Laisse une élite ou un gardien te repousser ${t} fois.`,
    ...SYSTEMS_TEXT.fr.achievementDescriptions
  },
  slots: { weapon: "Arme", armor: "Armure", amulet: "Amulette", ring: "Anneau" },
  rarities: { common: "Commun", rare: "Rare", epic: "Épique", legendary: "Légendaire", mythic: "Mythique" },
  affixes: {
    dps: "DPS",
    click: "Dégâts de frappe",
    gold: "Or",
    critChance: "Chance de critique",
    critDamage: "Dégâts critiques",
    bossDamage: "Dégâts aux élites et gardiens",
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
    [noun, RARITY_ADJECTIVE[rarity][gender], BIOME_SUFFIX[biome]?.[gender]].filter(Boolean).join(" "),

  openingLine: "Le crépuscule, encore.",
  bestiary: {
    "field-rat": [
      "Tous les rats qui ont volé du grain à Orvane, réunis en un seul rat très décidé.",
      "Il fuit toujours vers la gauche. Le Grand Livre a vérifié : le grenier était à gauche.",
      "Défait mille fois. Il s'arrête encore pour flairer l'endroit où la charrette de grain s'est renversée."
    ],
    "wild-boar": [
      "Nerveux parce qu'on l'a déjà tué. Il s'en souvient, un peu.",
      "Désormais, il sursaute avant le coup. Une fois, il a sursauté pile au bon moment.",
      "Il ne charge plus. Il se plante sur la route et t'attend, comme une corvée."
    ],
    "carrion-crow": [
      "Il glane ce que la moisson a laissé. La moisson a tout laissé.",
      "Il tient compagnie à l'épouvantail. Ils sont convenus de ne jamais parler du métier de l'épouvantail.",
      "Son nid, dans le moulin, est tapissé de boutons. Tous viennent du même manteau."
    ],
    "hollow-scarecrow": [
      "Bourré de la dernière moisson. Il garde des champs que personne ne fauchera.",
      "Sa tête suit le marcheur. Elle suivait de même celui d'avant.",
      "Sous la paille, un ruban d'enfant, noué deux fois. Ce champ était à quelqu'un."
    ],
    "lantern-moth": [
      "Attirée par la lumière du marcheur. Tout, dans la nuit, l'est.",
      "Elle meurt tournée vers ce qu'il y a de plus clair. Ces temps-ci, c'est toi.",
      "Les phalènes ont une reine. Les nuits d'averse, elle descend les compter."
    ],
    "dusk-hare": [
      "Il court toujours vers le crépuscule. Il n'arrive jamais.",
      "Une fois par nuit, il s'arrête, oreilles dressées, et écoute vers l'est. Puis il repart.",
      "Maëlle n'en a jamais tiré un. Elle dit qu'un lièvre aussi rapide mérite d'arriver quelque part."
    ],
    "last-reaper": [
      "Il est venu rentrer la dernière moisson. Il attend le petit jour pour commencer.",
      "Chaque nuit, il affûte sa faux. Le fil est plus mince qu'une ombre, à présent.",
      "Un soir, il a demandé l'heure à Maëlle. Elle ne savait pas. Plus personne ne sait, depuis longtemps."
    ],
    "moss-alpha": [
      "Le plus vieil ennemi de Maëlle. Il la laisse gagner. Il l'a toujours fait.",
      "La mousse pousse sur lui : il n'a plus bougé depuis très longtemps, sauf pour mourir.",
      "Il lui manque la défense gauche. Le cor de Maëlle est taillé dans une défense. Aucun des deux n'en dira plus."
    ],
    "lost-shepherd": [
      "Il compte ses moutons chaque nuit. Le nombre augmente.",
      "Il n'a pas de moutons. Il compte les marcheurs qui passent et leur donne des noms d'agneaux.",
      "Un jour, il a demandé son propre numéro au Grand Livre. Pas de réponse : le nombre était trop grand."
    ],
    "golden-rat": [
      "Messire Pip, le rat doré. Toutes les autres créatures changent d'une strate à l'autre. Pip, jamais.",
      "Il n'est jamais là où étaient les autres. Il est toujours là où tu regardes.",
      "Le Grand Livre ne tient qu'une entrée pour Pip. Elle est de la main de Pip."
    ],
    "lantern-queen": [
      "Reine des phalènes. Là où elle passe, les cristaux tombent plus vite, comme secoués d'une branche.",
      "Elle ne se pose jamais. Le Grand Livre n'a jamais noté où elle se repose, ni si elle se repose.",
      "Ses ailes sont faites de toutes les lampes qu'on a laissées allumées pour quelqu'un."
    ],
    ...BESTIARY_TEXT.fr.lines,
    ...BESTIARY_KEEP_TEXT.fr.lines
  },
  bestiaryPages: BESTIARY_TEXT.fr.pages,
  echoes: {
    "green-plains": [
      { by: "Maëlle", text: "Le blé est encore debout. Personne n'est venu le couper depuis plus longtemps que je ne vis. Ou alors je vis depuis longtemps." },
      { by: "Brom", text: "Ma forge est au carrefour. Chaque soir, le feu est déjà allumé quand j'arrive." },
      { by: "Le Grand Livre", text: "Le moulin tourne sans vent. Il moud toujours le même sac de farine, celui du premier soir." },
      { by: "Un épouvantail", text: "Tu marches trop fort. Le précédent marchait plus doucement. Celui d'avant, plus doucement encore." },
      { by: "Maëlle", text: "Chaque nuit, je taille une encoche dans le poteau. Il n'y a plus de place. Quelqu'un en a commencé un deuxième." },
      { by: "Le Grand Livre", text: "Dans la ferme au bord de la route, la table est mise pour quatre. La soupe est chaude. Les chaises sont poussiéreuses." },
      { by: "Un rat des champs", text: "Du grain. Du grain. Du grain. Puis le marcheur. Puis du grain." },
      { by: "Brom", text: "Le roi m'a commandé un marteau, une fois. J'y travaille encore. Les rois savent attendre." },
      { by: "Le Grand Livre", text: "Les arpenteurs du roi ont posé les bornes. Chacune s'allume quand la route est dégagée. Aucune n'est restée allumée." },
      { by: "Le Grand Livre", text: "Avant ton arrivée, le vieux sanglier s'est couché dans le blé et a attendu, comme un chien attend derrière une porte." },
      { by: "Maëlle", text: "La fête de la moisson, c'était le lendemain. J'avais un ruban. Je crois que j'avais un ruban." },
      { by: "Le Grand Livre", text: "Dans les Plaines, le crépuscule dure un peu plus qu'ailleurs. Comme si les champs demandaient encore une heure." }
    ],
    ...PLACES_TEXT.fr.echoes
  },
  wanderers: {
    "lost-shepherd": { by: "Le Berger égaré", text: "Quatre-vingt-dix-huit. Quatre-vingt-dix-neuf. Cent. Toi. Je t'ai compté hier soir aussi." },
    ...PLACES_TEXT.fr.wanderers
  },
  memories: {
    maelle: [
      { by: "Maëlle", text: "Maëlle te dévisage par-dessus son arc. « On se connaît ? Ta tête me dit quelque chose. Presque. »" },
      { by: "Maëlle", text: "Elle t'appelle par ton nom avant que tu le lui donnes. Puis elle fronce les sourcils, comme si le mot était entré tout seul." },
      { by: "Maëlle", text: "Elle te montre le poteau au bord de la route, couvert d'encoches. « Il y en a de ma main. Je ne me souviens pas de les avoir faites. »" },
      { by: "Maëlle", text: "Quand tu arrives au feu, une place t'attend déjà, et un bol encore chaud. Elle ne lève pas les yeux." },
      { by: "Maëlle", text: "« Ne me dis rien. J'aime mieux te rencontrer encore. C'est le moment que j'aime. »" }
    ],
    brom: [
      { by: "Brom", text: "Il retourne ta relique entre ses mains. « C'est mon travail. Je reconnaîtrais mes plis n'importe où. Quand est-ce que je l'ai faite ? »" },
      { by: "Brom", text: "« Qui t'a appris à tenir un marteau comme ça ? C'est ma prise. Personne n'a ma prise. »" },
      { by: "Brom", text: "Au fond de la forge, un marteau sans manche, la tête encore rouge. « Pour le roi. Il me l'a demandé. Je le finirai. »" },
      { by: "Brom", text: "Il frappe une nouvelle marque dans son enclume, à côté de la sienne : la tienne. « Pour que le métal te reconnaisse, la prochaine fois. »" },
      { by: "Brom", text: "Il te pose le marteau dans les mains, enfin fini. « Lui n'en a plus besoin. Toi, tu marches encore. Il est à toi. »" }
    ],
    ...COMPANY_TEXT.fr.memories,
    ...COMPANY_LATE_TEXT.fr.memories
  },
  hireLines: {
    maelle: [
      "Tu as l'air d'avoir besoin d'un arc et d'une amie. Je suis les deux.",
      "Encore toi ? Non. Je m'en souviendrais. Pas vrai ?",
      "Te voilà. Je t'ai gardé ta place."
    ],
    brom: [
      "Rapporte-la en un seul morceau. Ou en plusieurs. Je ne suis pas difficile.",
      "Ton tranchant est émoussé au même endroit que la dernière fois. Quelle dernière fois ?",
      "Le feu est prêt. Pose ta lame sur l'enclume."
    ],
    ...COMPANY_TEXT.fr.hireLines,
    ...COMPANY_LATE_TEXT.fr.hireLines
  },
  promises: PROMISES_TEXT.fr,
  relics: SYSTEMS_TEXT.fr.relics,
  namedEffects: SYSTEMS_TEXT.fr.namedEffects,
  secrets: SYSTEMS_TEXT.fr.secrets,
  events: SYSTEMS_TEXT.fr.events,

  strata: STRATA_TEXT.fr,
  voices: VOICES_TEXT.fr,
  ageEchoes: AGE_ECHOES_TEXT.fr,
  places: PLACES_TEXT.fr.places,
  lessons: COMPANY_LATE_TEXT.fr.lessons,
  altarLegends: SYSTEMS_TEXT.fr.altarLegends,
  weaves: SYSTEMS_TEXT.fr.weaves,
  caravan: SYSTEMS_TEXT.fr.caravan,
  crown: SYSTEMS_TEXT.fr.crown,
  cutscenes: CUTSCENES_TEXT.fr,
  speakers: { king: "Le Roi", stallkeeper: "Le Comptoir", ledger: "Le Grand Livre" }
};
