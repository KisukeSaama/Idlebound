import { defineMessages } from "../define";

/** The pixel workshop: a page that shows everything the pixel art engine can draw. */
export const workshop = defineMessages({
  fr: {
    metaTitle: "Atelier de pixels",
    title: "Atelier de pixels",
    intro: "Tout ce que le moteur de pixel art sait dessiner : palettes, créatures, animations, effets, décors et icônes. Chaque image de cette page est générée par du code, à la volée, et la même recette donne les mêmes pixels partout.",
    nav: "Sections de l'atelier",
    controls: {
      label: "Réglages",
      scale: "Échelle",
      era: "Ère",
      eraOption: (name: string, tag: string) => (tag ? `${name} · ${tag}` : name),
      reducedMotion: "Animations réduites"
    },
    arena: {
      title: "Arène",
      text: "Le décor en couches, le monstre et les effets, dessinés sur un seul canvas comme en jeu.",
      biome: "Biome",
      creature: "Créature",
      hit: "Coup",
      crit: "Coup critique",
      kill: "Achever",
      spawn: "Faire apparaître",
      milestone: "Borne allumée",
      shots: "Tirs des compagnons",
      families: { arrow: "Flèche", blade: "Lame", claw: "Griffe", blunt: "Masse", magic: "Sort" }
    },
    palette: {
      title: "Palette",
      text: "L'Orvane 64 : les seules couleurs du monde. Rampes décalées en teinte, ombres froides, lumières chaudes, jamais de noir pur.",
      colors: "Orvane 64",
      materials: "Matériaux",
      ramps: "Rampes de lumière"
    },
    bestiary: {
      title: "Bestiaire",
      text: "Chaque créature est dessinée à la main, pixel par pixel, avec sa propre anatomie. Elle respire à son rythme, cligne des yeux, et une fois par cycle fait son geste."
    },
    eras: {
      title: "Ères et Âges",
      text: "Chaque strate transforme la recette : Écho, Cendre, Néant, Astral, puis un traitement par Âge. Plus on descend, moins le monde a l'air achevé.",
      creature: "Créature",
      age: (roman: string) => `Âge ${roman}`
    },
    scenes: {
      title: "Décors",
      text: "Chaque biome se construit en trois profondeurs : au loin le ciel, les reliefs et le repère au bout de la route ; au milieu le sol, l'eau et les bâtiments ; devant, le cadre sombre. Une lumière raconte le lieu, et le gardien reste ce qui se lit le mieux.",
      guardian: "Gardien au premier plan",
      phone: "Vue téléphone"
    },
    layers: {
      title: "Couches",
      text: "Le même décor séparé en profondeurs. Chaque couche suit la caméra à sa propre vitesse.",
      biome: "Biome",
      far: "Lointain",
      middle: "Intermédiaire",
      near: "Premier plan"
    },
    buildings: {
      title: "Bâtiments",
      text: "Bâtis pièce par pièce comme les créatures : volumes ombrés selon la lune, pierres, planches et chaume posés en amas, contour, liseré de lune, mousse et lierre. Chaque ère les use à sa façon."
    },
    wear: {
      title: "Usure du monde",
      text: "Le même lieu, strate après strate : l'Écho le double, la Cendre le brûle, le Néant en arrache des morceaux, l'Astral y fait pousser des éclats. Viennent ensuite les ruines de l'Ancien Monde et les marques de chaque Âge.",
      biome: "Biome"
    },
    marks: {
      title: "Marques des Âges",
      text: "Chaque Âge laisse sa marque sur le lieu, en pixels pleins : les os d'un géant et une mer gelée, des temples ouverts au ciel, le ciel coulé comme du verre, les fils de la chaîne, le papier, les murs de runes, la lune basse dans la brume, une lampe et une fenêtre, le gris, le contour, puis un seul point de lumière.",
      biome: "Biome",
      darkNight: "Garder la nuit noire"
    },
    places: {
      title: "Lieux",
      text: "Les lieux de l'histoire, dessinés comme les biomes : le Sanctuaire du Crépuscule et ses treize autels, le Métier d'Eldra et sa nuit tissée, l'Aube au bout de la route.",
      sanctum: "Sanctuaire du Crépuscule",
      loom: "Métier d'Eldra",
      dawn: "L'Aube"
    },
    companions: {
      title: "Compagnons",
      text: "Portraits en couches et emblèmes de 12 pixels. La couleur du compagnon donne la rampe de ses vêtements.",
      awakened: "L'Éveillé change avec les réglages de chacun"
    },
    relics: {
      title: "Reliques",
      text: "Vingt formes de base, chacune dessinée cinq fois : du fer terne et du cuir pour une relique commune, du laiton et une pierre sertie pour une rare, des gravures et des gemmes pour une épique, de l'or filigrané pour une légendaire, un éclat de la Voûte de verre et une lumière vivante pour une mythique. La forge grave une rune de feu tous les cinq niveaux ; l'interface écrit le niveau exact.",
      named: "Reliques nommées",
      forge: "Forge"
    },
    icons: {
      title: "Icônes du monde",
      text: "Pour les lieux du monde : les autels du Sanctuaire, les pouvoirs, l'échoppe et la Roulotte, chacun avec sa silhouette. À côté, le picto de l'interface pour la même chose.",
      altars: "Autels",
      powers: "Pouvoirs",
      market: "Échoppe",
      crystal: "Cristal errant"
    },
    performance: {
      title: "Performance",
      measure: "Mesurer",
      result: (count: number, average: string, worst: string) => `${count} créatures générées : ${average} ms en moyenne, ${worst} ms au pire.`,
      scenes: (count: number, average: string, worst: string) => `${count} décors générés : ${average} ms en moyenne, ${worst} ms au pire.`,
      cache: (size: number) => `Cache : ${size} sprites sur 64 au plus.`
    }
  },
  en: {
    metaTitle: "Pixel workshop",
    title: "Pixel workshop",
    intro: "Everything the pixel art engine can draw: palettes, creatures, animations, effects, scenes and icons. Every image on this page is generated by code, on the fly, and the same recipe gives the same pixels everywhere.",
    nav: "Workshop sections",
    controls: {
      label: "Settings",
      scale: "Scale",
      era: "Era",
      eraOption: (name: string, tag: string) => (tag ? `${name} · ${tag}` : name),
      reducedMotion: "Reduced motion"
    },
    arena: {
      title: "Arena",
      text: "The layered scene, the monster and the effects, drawn on a single canvas as in the game.",
      biome: "Biome",
      creature: "Creature",
      hit: "Strike",
      crit: "Critical strike",
      kill: "Finish off",
      spawn: "Summon",
      milestone: "Milestone lit",
      shots: "Companion shots",
      families: { arrow: "Arrow", blade: "Blade", claw: "Claw", blunt: "Mace", magic: "Spell" }
    },
    palette: {
      title: "Palette",
      text: "The Orvane 64: the only colors of the world. Hue-shifted ramps, cool shadows, warm lights, never pure black.",
      colors: "Orvane 64",
      materials: "Materials",
      ramps: "Light ramps"
    },
    bestiary: {
      title: "Bestiary",
      text: "Every creature is drawn by hand, pixel by pixel, with its own anatomy. It breathes at its own pace, blinks, and once a cycle makes its gesture."
    },
    eras: {
      title: "Eras and Ages",
      text: "Each stratum transforms the recipe: Echo, Ash, Void, Astral, then one treatment per Age. The deeper you go, the less finished the world looks.",
      creature: "Creature",
      age: (roman: string) => `Age ${roman}`
    },
    scenes: {
      title: "Scenes",
      text: "Every biome is built in three depths: far off, the sky, the ranges and the landmark at the end of the road; in the middle, the ground, the water and the buildings; in front, the dark frame. One light tells the place, and the guardian stays the most readable thing in it.",
      guardian: "Guardian in front",
      phone: "Phone view"
    },
    layers: {
      title: "Layers",
      text: "The same scene split into its depths. Each layer follows the camera at its own pace.",
      biome: "Biome",
      far: "Far",
      middle: "Middle",
      near: "Foreground"
    },
    buildings: {
      title: "Buildings",
      text: "Built piece by piece like the creatures: volumes shaded by the moon, stones, boards and thatch laid in clusters, an outline, a moonlit rim, moss and ivy. Every era wears them down its own way."
    },
    wear: {
      title: "Wear of the world",
      text: "The same place, stratum after stratum: the Echo doubles it, the Ash burns it, the Void tears pieces away, the Astral grows shards through it. Then come the ruins of the Elder World and the marks of every Age.",
      biome: "Biome"
    },
    marks: {
      title: "Age marks",
      text: "Every Age leaves its mark on the place, in solid pixels: a giant's bones and a frozen sea, temples open to the sky, the sky poured like glass, the warp threads, paper, walls of runes, the low moon in the mist, a lamp and a window, grey, outline, then a single point of light.",
      biome: "Biome",
      darkNight: "Keep the night dark"
    },
    places: {
      title: "Places",
      text: "The places of the story, drawn like the biomes: the Sanctum of Dusk and its thirteen altars, Eldra's Loom and its woven night, the Dawn at the end of the road.",
      sanctum: "Sanctum of Dusk",
      loom: "Eldra's Loom",
      dawn: "The Dawn"
    },
    companions: {
      title: "Companions",
      text: "Layered portraits and 12-pixel emblems. The companion's color gives the ramp of their clothes.",
      awakened: "The Awakened changes with everyone's settings"
    },
    relics: {
      title: "Relics",
      text: "Twenty base shapes, each drawn five times: dull iron and leather for a common relic, brass and a set stone for a rare one, engravings and gems for an epic one, gold filigree for a legendary one, Sky-Glass and living light for a mythic one. The forge engraves a rune of fire every five levels; the interface writes the exact level.",
      named: "Named relics",
      forge: "Forge"
    },
    icons: {
      title: "World icons",
      text: "For places in the world: the altars of the Sanctum, the powers, the stall and the Caravan, each with a silhouette of its own. Beside each, the interface's picto for the same thing.",
      altars: "Altars",
      powers: "Powers",
      market: "Stall",
      crystal: "Wandering crystal"
    },
    performance: {
      title: "Performance",
      measure: "Measure",
      result: (count: number, average: string, worst: string) => `${count} creatures generated: ${average} ms on average, ${worst} ms at worst.`,
      scenes: (count: number, average: string, worst: string) => `${count} scenes generated: ${average} ms on average, ${worst} ms at worst.`,
      cache: (size: number) => `Cache: ${size} sprites out of 64 at most.`
    }
  }
});
