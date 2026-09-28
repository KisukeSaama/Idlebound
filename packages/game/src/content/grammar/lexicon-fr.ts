import { fr, frKing } from "./parse";
import type { FrAdj, FrLexicon, FrNoun, KingLexicon, SongLexicon } from "./types";

/**
 * French lexicons of the grammar (BIBLE 17.3), written for French, not translated: same
 * slot, same beat, sometimes another image. Index = era. Genders and numbers are data;
 * every deed is a passé composé with avoir, so it agrees with any doer.
 */
export const FR_STRATA: readonly FrLexicon[] = [
  // Âge I : le Royaume
  fr("lanterne:f|couronne fêlée:f|borne:f|manteau:m", "blé:m|donjon:m|sur@route:f|salle du trône:f", "a attendu|a compté les marches|a salué|a levé les yeux", "froid|usé|encore allumé", "violet/violette"),
  fr("écho:m|cloche:f|pioche de mineur:f|deuxième ombre:f", "caveaux:mp|galerie:f|puits:m|chapelle:f", "a crié|a répondu|a répété un nom|a parlé trop tôt", "creux/creuse|familier/familière|double", "gris"),
  fr("braise:f|torche:f|gerbe:f|masque de soleil:m", "cendre:f|champ brûlé:m|sur@bûcher:m|vieille forêt:f", "a brûlé|a prié le soleil|a chanté pour le feu|a gardé la flamme", "tiède|fumant|noirci", "rouge"),
  fr("carte:f|porte brisée:f|botte:f|cadre vide:m", "trou:m|à@bord:m|brume:f|champ manquant:m", "a disparu|a oublié un mot|a cessé de marcher|a gardé le silence", "manquant|muet/muette|inachevé", "sans couleur="),
  fr("éclat d'étoile:m|étoile tombée:f|morceau de ciel:m|longue-vue:f", "cratère:m|mine:f|ciel:m|veine:f", "a levé les yeux|a brillé|a compté les étoiles|a creusé vers le ciel", "froid|brillant|encore chaud", "argenté"),
  // Âge II : le Monde ancien
  fr("premier caillou:m|racine:f|graine:f|tablette d'argile:f", "boue:f|à@fond:m|terre profonde:f|première grotte:f", "a creusé|a cessé de creuser|a écrit FOND|a renoncé", "ancien/ancienne|dernier/dernière|faux/fausse", "brun"),
  fr("dent de géant:f|main de pierre:f|osselet:m|rocher:m", "vallée:f|empreinte:f|carrière:f|flanc de montagne:m", "a soulevé une montagne|a frappé du pied|a fait trembler le sol|a continué", "immense|lourd|immobile", "ocre"),
  fr("écaille:f|os:m|œuf:m|croc de dragon:m", "cage thoracique:f|antre:m|sur@trésor:m|vallée des os:f", "a salué|a craché du feu|a ondulé|a attendu mille ans", "vaste|fier/fière|chaud", "doré"),
  fr("coquillage:m|ancre:f|sel:mM|cloche noyée:f", "marée:f|récif:m|à@fond de la mer:m|eaux basses:fp", "a sombré|a dérivé|a nagé|a suivi la marée", "mouillé|salé|noyé", "vert d'eau="),
  fr("petite couronne:f|glaçon:m|traîneau:m|lettre gelée:f", "glace:f|glacier:m|lac gelé:m|givre:m", "a gelé|a frissonné|a brisé la glace|a attendu le dégel", "gelé|fragile|petit", "bleu pâle="),
  // Âge III : le Sacré
  fr("encensoir:m|nappe d'autel:f|chapelet:m|auréole:f", "temple:m|nef:f|cloître:m|sanctuaire:m", "a prié|a allumé un cierge|a fait face au ciel|a chanté un psaume", "sacré|sans nom=|doré", "jaune d'or="),
  fr("prophétie:f|bandeau:m|coupe de fumée:f|dés d'os:mp", "grotte:f|fumée:f|sur@marches du temple:fp|entrée de la grotte:f", "a tout prédit|a parlé en premier|a répondu trop tôt|a fini une phrase", "prédit|certain|voilé", "gris cendre="),
  fr("plume:f|aile:f|voile:m|trompette:f", "rai de lumière:m|tribune:f|haut des airs:m|clocher:m", "a détourné les yeux|a flamboyé|a déployé six ailes|a monté la garde", "aveuglant|immaculé|replié", "blanc/blanche"),
  fr("recueil d'hymnes:m|robe de chœur:f|diapason:m|corde de cloche:f", "chœur:m|crypte:f|tour des cloches:f|tribune d'orgue:f", "a chanté|a fredonné|a tenu une note|a oublié les paroles", "assourdi|résonnant|ancien/ancienne", "ambré"),
  fr("soleil noir:m|cierge noir:m|prière:f|masque:m", "ombre:f|autel:m|temple obscur:m|nuit de midi:f", "a prié pour la nuit|a voilé le soleil|a soufflé un cierge|a attendu une réponse", "éclipsé|exaucé|sombre", "rouge cuivre="),
  // Âge IV : la Fabrique des étoiles
  fr("louche:f|goutte de ciel:f|étoile molle:f|creuset:m", "moule:m|ciel coulé:m|verrerie:f|four:m", "a coulé le ciel|a remué|a refroidi|a rougeoyé", "liquide|mou/molle/mous/molles|inachevé", "rose"),
  fr("queue de comète:f|caillou de lumière:m|traînée d'étincelles:f|étoile perdue:f", "sillon:m|pré:m|air de la nuit:m|longue courbe:f", "a roulé|a traversé le ciel|a chuté lentement|a attendu", "intact|brûlant|docile", "orange="),
  fr("cerf-volant:m|drapeau:m|dernier barreau:m|girouette:f", "à@cime:f|à@sommet du ciel:m|plus haute tour:f|air rare:m", "a grimpé|a tenu bon|a regardé en bas|a touché le plafond", "haut|vertigineux/vertigineuse|bref/brève", "bleu ciel="),
  fr("fuseau:m|fil:m|étoile basse:f|tabouret:m", "à@fond du ciel:m|creux du ciel:m|sur@dernière marche:f|revers du ciel:m", "a tissé|a mis un genou à terre|a baissé la tête|a tiré un fil", "bas/basse|profond|patient", "indigo="),
  fr("ruban de lumière:m|voile:m|lanterne pâle:f|miroitement:m", "à@horizon:me|grand nord:m|à@bord du ciel:m|fausse aube:f", "a répété|a miroité|a pointé trop tôt|a pâli", "précoce|tremblant|fugace", "vert"),
  // Âge V : le Métier
  fr("fil de chaîne:m|poids de métier:m|lisse:f|corde tendue:f", "métier:m|chaîne:f|haut cadre:m|fils:mp", "a bourdonné|a tendu un fil|a grimpé à un fil|a pincé une corde", "tendu|bourdonnant|sans fin=", "écru"),
  fr("fil de trame:m|petite étiquette:f|aiguille:f|bobine:f", "tissage:m|étoffe:f|lisière:f|panier:m", "a cousu|a reprisé|a écrit tout petit|a soupiré", "las/lasse|minuscule|soigneux/soigneuse", "bleu passé="),
  fr("navette:f|dévidoir:m|cordelette nouée:f|ombre empruntée:f", "interstice:m|croisement:m|passage:m|chemin étroit:m", "a filé|a fait l'aller-retour|a traversé|a recommencé", "familier/familière|rapide|infatigable", "cuivré"),
  fr("nœud:m|nom noué:m|pelote:f|bout de corde:m", "grand nœud:m|fouillis:m|cœur du nœud:m|boucle:f", "a fait un nœud|a serré fort|a tenu bon|a tiré sur un nœud", "serré|emmêlé|têtu", "rouge sombre="),
  fr("fil lâche:m|pièce usée:f|ourlet:m|trou de lumière:m", "endroit mince:m|déchirure:f|étoffe râpée:f|tissage lâche:m", "a lâché prise|a laissé passer la lumière|a craqué|a cédé", "mince|râpé|transparent", "or pâle="),
  // Âge VI : l'Ébauche
  fr("contour d'arbre:m|crayon:m|oiseau inachevé:m|esquisse de maison:f", "esquisse:f|champ en blanc:m|premier jet:m|bois au crayon:m", "a dessiné un oiseau|a attendu la couleur|a laissé un blanc|a tracé une ligne", "incolore|léger/légère|sommaire", "sépia="),
  fr("bâton de fusain:m|tache:f|empreinte de pouce:f|chiffon:m", "suie:f|poussière noire:f|hachures:fp|coin:m", "a laissé une trace|a estompé une colline|a noirci|a hachuré", "estompé|charbonneux/charbonneuse|brut", "anthracite="),
  fr("second donjon:m|puits inachevé:m|ligne pointillée:f|tour à peine tracée:f", "autre royaume:m|contour:m|champ inachevé:m|plans:mp", "a commencé un mur|a posé la plume|a tracé une route|a remis à plus tard", "inachevé|vide|provisoire", "terre d'ombre="),
  fr("miettes de gomme:fp|fantôme de maison:m|nom gommé:m|trace de main:f", "champ gommé:m|tache claire:f|creux du papier:m|place laissée:f", "a pâli|a repris quelque chose|a gommé une ligne|a disparu à moitié", "effacé|fantomatique|presque là=", "blanc cassé="),
  fr("ligne ancienne:f|lettre grattée:f|seconde carte:f|vieux tracé:m", "vélin:m|vieux parchemin:m|couche du dessous:f|grattage:m", "a transparu|a écrit par-dessus|a gratté|a lu entre les lignes", "superposé|délavé|double", "rouille="),
  // Âge VII : les Mots
  fr("pierre runique:f|lettre gravée:f|ciseau:m|sceau:m", "mur gravé:m|sur@route runique:f|parmi@pierres levées:fp|première ligne:f", "a gravé une lettre|a épelé un mot|a lu la route|a souligné une pierre", "gravé|lisible|solennel/solennelle", "vert lichen="),
  fr("glyphe:m|pierre à encre:f|tampon:m|mot pour fatigué:m", "inscription:f|sous@linteau:m|colonne:f|rouleau:m", "a voulu dire deux choses|a mal lu|a tracé un signe|a signé", "ambigu/ambiguë|las/lasse|hiératique", "vermillon="),
  fr("rime:f|distique:m|luth:m|refrain:m", "strophe:f|chanson:f|dernier couplet:m|ballade:f", "a rimé|a récité|a chanté un couplet|a demandé qu'on se souvienne", "rimé|chantant|à moitié oublié", "lie-de-vin="),
  fr("nom:m|plaque:f|lettre scellée:f|chevalière:f", "registre:m|silence:m|liste des noms:f|bouche fermée:f", "a dit un nom|a retenu un mot|a chuchoté un mot|a retrouvé un nom", "inavoué|vrai|lourd", "gris fer="),
  fr("murmure:m|secret:m|histoire:fe|mot soufflé:m", "oreille:f|voix basse:f|récit:m|pénombre:f", "a murmuré|a raconté une histoire|a parlé tout bas|a écouté", "silencieux/silencieuse|doux/douce|interminable", "mauve"),
  // Âge VIII : le Bord du sommeil
  fr("oreiller:m|cloche lente:f|paupière lourde:f|grain de sable:m", "accalmie:f|eau dormante:f|sur@route lente:f|longue pause:f", "a ralenti|a bâillé|a posé la tête|a dérivé", "lent|engourdi|pesant", "lavande="),
  fr("boucle de route:f|toupie:f|bateau de papier:m|cheval de manège:m", "méandre:m|cercle:m|nuage:m|long après-midi:m", "a erré|a refait le tour|a souri|a oublié où", "vague|circulaire|content", "pastel="),
  fr("châle:m|veilleuse:f|œil fermé:m|oiseau endormi:m", "sommeil:m|nid:m|creux profond:m|heure tranquille:fe", "a dormi|a marché sur la pointe des pieds|a respiré lentement|a remué dans le noir", "endormi|profond|assoupi", "bleu nuit="),
  fr("étoile fermée:f|œil mi-clos:m|bonnet de nuit:m|phalène:f", "ciel éteint:m|brouillard:m|demi-jour:m|air lourd:m", "a piqué du nez|a fermé un œil|a cligné lentement|a somnolé", "mi-clos/mi-close|terne|somnolent", "prune="),
  fr("poignée de porte:f|pierre du seuil:f|dernière bougie:f|porte close:f", "sur@seuil:m|embrasure:f|à@bord du sommeil:m|entre-deux:m", "a hésité|a craché|a frappé à la porte|a entrouvert une porte", "entrouvert|hésitant|ténu", "jaune cire="),
  // Âge IX : la Chambre
  fr("lampe:f|abat-jour:m|mèche:f|tasse:f", "lumière de la lampe:f|chambre:f|sous@haut plafond:m|cercle de lumière:m", "a laissé la lampe allumée|a lu tard|a tourné une page|a veillé", "allumé|chaud|bourdonnant", "miel="),
  fr("couverture:f|bouilloire:f|chaussons:mp|tisonnier:m", "devant@âtre:m|fauteuil:m|sur@tapis:m|cuisine:f", "a tendu les mains vers la chaleur|a attisé le feu|a veillé près du feu|a mis l'eau à chauffer", "douillet/douillette|tiède|à l'abri=", "rouge braise="),
  fr("boîte à musique:f|berceau:m|hochet:m|peluche:f", "chambre d'enfant:f|à@chevet:m|fauteuil à bascule:m|lueur de la veilleuse:f", "a bercé|a fredonné plus lentement|a chanté tout doux|a bordé quelqu'un", "lent|doux/douce|feutré", "crème="),
  fr("rideau:m|loquet:m|carreau:m|plante en pot:f", "à@fenêtre:f|sur@rebord de la fenêtre:m|derrière@rideaux tirés:mp|rectangle pâle:m", "a regardé dehors|a tiré le rideau|a attendu à la fenêtre|a fait signe", "lumineux/lumineuse|ouvert|lointain", "jaune pâle="),
  fr("verre d'eau:m|reflet:m|trace de doigt:f|miroir:m", "vitre:f|de@autre côté:m|contre@carreau froid:m|buée:f", "a cligné des yeux|a soufflé sur la vitre|a regardé en retour|a tapoté la vitre", "reflété|embué|clair", "vert bouteille="),
  // Âge X : le Défaire
  fr("manteau vide:m|coquille d'escargot:f|enveloppe:f|moulage:m", "creux:m|pièce vide:f|forme laissée:f|trace:f", "a laissé une forme|a vidé les lieux|a gardé la pose|a lâché prise", "creux/creuse|vide|emprunté", "gris poussière="),
  fr("cloche assourdie:f|flocon de laine:m|coton:mM|gant:m", "laine:f|brouillard:m|silence épais:m|pièce du fond:f", "a parlé trop tard|a sonné tout bas|a appelé de loin|a frappé sans bruit", "sourd|tardif/tardive|lointain", "taupe="),
  fr("doigt levé:m|horloge arrêtée:fe|livre fermé:m|souffle retenu:m", "grand silence:m|immobilité:f|maison muette:f|sur@escalier vide:m", "a fait silence|a cessé de bouger|a levé un doigt|a obéi", "muet/muette|immobile|obéissant", "ivoire="),
  fr("nom coupé en deux:m|lettre sans signature:f|portrait vide:m|clé perdue:f", "oubli:m|trou dans un nom:m|à@fond de l'esprit:m|blanc dans l'histoire:m", "a oublié|a presque retrouvé|a perdu un nom|a dit le mauvais nom", "oublié|flou|perdu", "délavé"),
  fr("chaise vide:f|tasse tiède:f|manteau au crochet:m|couvert:m", "absence:f|trône vide:m|pièce déserte:f|à@place du roi:f", "a quitté la pièce|a reculé une chaise|a laissé la porte ouverte|a attendu quelqu'un", "encore tiède=|vide|inoccupé", "gris pâle="),
  // Âge XI : le Blanc
  fr("craie:fM|fil pâle:m|lune mince:f|plume blanche:f", "ciel pâle:m|nuit mince:f|poussière de lumière:f|à@bord lointain:m", "a pâli|a blêmi|a transparu|a laissé partir la nuit", "pâle|mince|lavé", "lilas="),
  fr("trait léger:m|ombre d'épée:f|marque de craie:f|flocon de neige:m", "neige:f|champ blanc:m|sentier effacé:m|presque-rien:m", "a lutté quand même|a vacillé|a tenu|a persisté", "ténu|presque effacé|obstiné", "blanc d'os="),
  fr("page:f|annotation:f|gribouillis:m|coin corné:m", "marge:f|à@bord de la page:m|blanc du papier:m|pli:m", "a dépassé le trait|a écrit dans la marge|a corné une page|a griffonné", "étroit|blanc/blanche|sans lignes=", "blanc craie="),
  fr("empreinte de pas:f|feuille blanche:f|premier mot:m|plume neuve:f", "neige fraîche:f|rien:m|étendue blanche:f|endroit vierge:m", "a laissé la première trace|a fait un pas|a commencé|a attendu dans le blanc", "intact|neuf/neuve|immaculé", "blanc/blanche"),
  fr("goutte d'encre:f|plume d'oie:f|encrier:m|pâté:m", "encre:f|à@pointe de la plume:f|à@bord de l'encrier:m|blanc en dessous:m", "a pendu au bout|a tremblé|a attendu de tomber|a gonflé", "noir|humide|sur le point de tomber=", "bleu-noir="),
  // Âge XII : la Première Marque
  fr("point de lumière:m|piqûre d'épingle:f|étoile seule:f|grain de lumière:m", "noir:m|à@centre:m|à@tout début:m|plus petit endroit:m", "a regardé|a brillé|a paru|a attendu qu'on le voie", "petit|seul|vif/vive", "nacré"),
  fr("étincelle:f|silex:m|chaleur:f|brin de paille:m", "noir tiède:m|creux des mains:m|premier feu:m|petit bois:m", "a chauffé|a pris|a crépité|a allumé quelque chose", "chaud|petit|vivant", "rouge braise="),
  fr("souffle:m|bulle d'air:f|buée d'une haleine:f|petit vent:m", "poumons:mp|pause d'avant:f|calme:m|inspiration:f", "a inspiré|a retenu un souffle|a expiré|a attendu", "retenu|plein|suspendu", "embrumé"),
  fr("manteau simple:m|épée baissée:f|main ouverte:f|front sans couronne:m", "yeux:mp|long regard:m|à@bout de la route:m|dernière salle:f", "a posé les yeux sur toi|a dit merci|a baissé l'épée|a dit de rentrer", "bienveillant|fatigué|simple", "noisette="),
  fr("trait de lumière:m|dernière étoile:f|premier oiseau:m|fil d'or:m", "aube:f|à@bord de tout:m|lisière du jour:f|pas-encore:m", "a grandi|a attendu|a fait halte|a dit pas encore", "pâle|grandissant|proche", "rose aurore=")
];

/** Lexiques des lieux, pour les échos au-delà des échos écrits. */
export const FR_BIOMES: Record<string, FrLexicon> = {
  "green-plains": fr("gerbe:f|faux:f|ruban:m|chapeau d'épouvantail:m", "blé:m|grange:f|haie:f|ferme:f", "a regardé en arrière|a mis la table|a compté les gerbes|a sonné la fin des moissons", "encore debout=|poussiéreux/poussiéreuse|tiède", "doré"),
  "dark-forest": fr("épine:f|plume de chouette:f|racine:f|nom gravé:m", "ronces:fp|chêne creux:m|clairière:f|racines:fp", "a murmuré un nom|a fait pousser une épine|a saigné|a demandé qui", "épineux/épineuse|moussu|attentif/attentive", "vert sombre="),
  "forgotten-caves": fr("pioche:f|éclat de ciel:m|lampe runique:f|cage à canari:f", "caveau:m|galerie:f|puits de mine:m|veine profonde:f", "a creusé|a fait écho|a touché un filon|a entendu demain", "gelé|résonnant|profond", "bleu glacier="),
  "corrupted-marsh": fr("anneau de mariage:m|flamme vacillante:f|motte de tourbe:f|lettre noyée:f", "marais:m|sur@route noyée:f|manoir qui s'enfonce:m|roseaux:mp", "a coulé d'un pouce|a fait la révérence|a coassé|a essayé un remède", "détrempé|pourrissant|fidèle", "vert-de-gris="),
  "fallen-king-ruins": fr("bannière délavée:f|cloche fêlée:f|lance de garde:f|collier de chien:m", "grande salle:f|salle du trône:f|escalier:m|à@fenêtre:f", "a salué|a monté la garde|a gravi l'escalier|a regardé par la fenêtre", "sans couleur=|fêlé|loyal/loyale/loyaux/loyales", "violet/violette")
};

/** Les mots du roi (40). Ses gestes sont dits par lui, à la première personne. */
export const FR_KING: KingLexicon<FrNoun, FrAdj> = frKing(
  "couronne:f|coupe:f|bougie:f|clé:f|manteau:m|anneau:m|épée:f|marteau:m|bottes:fp|lettre:f",
  "grande salle:f|escalier:m|jardin:m|cuisines:fp|chapelle:f|verger:m|écuries:fp|tour:f|cour:f|salle du trône:f",
  "je me suis assis|j'ai veillé|j'ai compté les marches|j'ai fait le tour des remparts|j'ai guetté tes pas|j'ai entretenu le feu|j'ai surveillé la route|j'ai tenu la porte|j'ai reprisé mon manteau|j'ai parlé aux chiens",
  "froid|chaud|calme|sombre|vieux/vieille/vieux/vieilles|lourd|immobile|fatigué|patient|fidèle"
);

/** Les mots de Célestine : ce qui chante, où, comment, et les sons eux-mêmes. */
export const FR_SONGS: readonly SongLexicon<FrNoun, FrAdj>[] = [
  {
    ...fr("cristal:m|petite lumière:f|éclat:m|verre:m", "air:m|cristaux:mp|creux de ta main:m|Sanctuaire:m", "a fredonné|a tinté|a chanté en retour|a fait ting", "rond|doux/douce|sucré", "violet/violette"),
    sounds: ["ting", "mmm", "la la", "chut"]
  },
  {
    ...fr("essence:f|lumière qui bourdonne:f|perle de verre:f|étincelle:f", "pierres:fp|bourdonnement:m|vent:m|noir:m", "a sifflé|a carillonné|a ronronné|a ri", "vif/vive|timide|content", "bleu"),
    sounds: ["ding", "ouh", "tinn", "mm-hm"]
  },
  {
    ...fr("Voûte de verre:f|astre:m|lune:f|nuit:f", "fêlures:fp|haut dôme:m|bleu profond:m|calme:m", "a sonné comme une cuillère sur une tasse|a soupiré|a chanté tout bas|a répondu", "clair|lointain|gentil/gentille", "argenté"),
    sounds: ["dong", "chut", "tilin", "ah"]
  }
];
