import { defineMessages } from "../define";

/** Game figures the copy quotes, read from the game data by the page. `stages` comes formatted. */
type Counts = { stages: string; eras: number; ages: number; heroes: number; altars: number; creatures: number; relics: number; weaves: number; secrets: number };

/** Landing page (/[locale]). */
export const landing = defineMessages({
  fr: {
    metaTitle: "Idlebound · Clicker fantasy en ligne, idle game dans ton navigateur",
    jsonLd: {
      genre: ["Idle game", "Clicker", "Jeu incrémental", "Fantasy"],
      platform: "Navigateur web",
      os: "Tous"
    },
    hero: {
      titleLead: "Terrasse le Roi déchu, ",
      titleAccent: "un clic à la fois.",
      lead:
        "Chaque nuit, le Roi déchu se relève. Chaque nuit, tu te fraies un chemin jusqu'à son trône, et quand il tombe, la route recommence. Tes compagnons t'oublient. Les monstres, jamais. Et chaque nuit t'emmène un peu plus profond.",
      play: "Prendre la route",
      leaderboard: "Voir le classement",
      back: "Déjà en route ?",
      backLink: "Reprends ta partie",
      boss: {
        rank: "gardien",
        strike: "Frapper le Roi déchu",
        hint: "Frappe-le.",
        again: "Encore.",
        crit: "Coup critique : dix fois les dégâts.",
        fallen: "Il tombe. La nuit prochaine, il se relève."
      }
    },
    steps: {
      label: "Comment on joue",
      items: [
        { title: "Clique", text: "Frappe les monstres pour gagner de l'or. Les coups critiques infligent dix fois plus de dégâts." },
        { title: "Recrute", text: "Engage des compagnons qui attaquent sans relâche, même quand tu fais autre chose. Plus tu avances, plus ce sont eux qui portent l'aventure." },
        { title: "Renais", text: "Fais ton ascension pour récolter des essences, bâtir tes autels et repousser tes records." }
      ]
    },
    features: {
      anchor: "fonctionnalites",
      title: "Ce que la route te réserve",
      items: (c: Counts) => [
        { title: "Une route qui recommence", text: `${c.stages} étapes, ${c.eras} strates en ${c.ages} Âges, un boss toutes les 5 étapes, chronomètre en main. Quand le roi tombe, renais plus fort : tes essences nourrissent ${c.altars} autels permanents.` },
        { title: `${c.heroes} compagnons qui se souviennent`, text: "Une archère, un moine, une liche, un roi-dragon. Chaque nuit, ils te rencontrent en inconnus. Mène-les assez loin, assez souvent, et un jour ils reconnaissent ton visage." },
        { title: "La Chronique", text: `Chaque roi vaincu, chaque écho de la route laisse un fragment. Tempêtes de cristaux, rat trop chanceux, caravane de passage, ${c.secrets} secrets bien gardés : l'histoire te parvient par morceaux.` },
        { title: `Un bestiaire de ${c.creatures} créatures`, text: "Du rat des champs au gardien des ruines, chaque Vestige a sa page, et ses lignes se dévoilent à force de le croiser. Certains ne se montrent qu'une fois par nuit." },
        { title: "Reliques et légendes", text: `Les boss lâchent armes, armures, amulettes et anneaux, du commun au mythique : forge-les avec tes éclats. ${c.relics} d'entre elles portent un nom, une légende et un pouvoir bien à elles.` },
        { title: "Une compagnie qui se bat sans toi", text: "Laisse l'onglet ouvert et va travailler, étudier ou jouer à autre chose : tes compagnons continuent de se battre et de se renforcer. Ta partie est sauvegardée sur nos serveurs et te suit sur tous tes appareils." }
      ],
      descent: {
        title: "La Descente, au Métier d'Eldra",
        text: (c: Counts) => `Quand la route ne suffit plus, Eldra te montre son Métier. Défais tes essences et tes autels pour tisser des fils, et reprends la nuit un cran plus bas : ${c.weaves} Tissages permanents t'y attendent, que rien ne défait.`
      },
      numbers: {
        title: "La nuit en chiffres",
        companions: "Compagnons",
        creatures: "Créatures",
        stages: "Étapes",
        strata: "Strates",
        players: "Marcheurs au classement"
      }
    },
    biomes: {
      title: (eras: number) => `Cinq biomes, ${eras} strates de nuit`,
      stages: (from: number, to: number) => `Étapes ${from} à ${to}`,
      boss: "Boss : "
    },
    board: {
      title: "Les plus grands aventuriers",
      rank: "Rang",
      walker: "Marcheur",
      depth: "Profondeur",
      value: (stage: string) => `Étape ${stage}`,
      empty: "Le classement attend ses premiers héros. ",
      emptyCta: "Et si c'était toi ?",
      join: "Pour y graver ton nom : prends la route, puis crée ton compte.",
      more: "Classement complet"
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Qu'est-ce qu'un idle clicker ?", a: "Un jeu incrémental : tu cliques pour attaquer, tu recrutes des compagnons qui attaquent à ta place, et tes chiffres grossissent de façon exponentielle. Onglet ouvert, le jeu continue même quand tu ne joues pas." },
        { q: "Faut-il cliquer sans arrêt ?", a: "Non. Tes clics portent le début de chaque partie, puis tes compagnons prennent le relais. Plus tard, certains talents et l'autel de Patience renforcent leurs dégâts quand tu lâches la souris, tandis que les pouvoirs et les cristaux récompensent les moments où tu es là." },
        { q: "Faut-il créer un compte pour jouer ?", a: "Non, tu peux commencer tout de suite. Pour garder ta progression, crée un compte : un e-mail, un pseudo et un mot de passe suffisent. Ta partie est alors sauvegardée sur nos serveurs, accessible depuis tous tes appareils, et tu apparais au classement." },
        { q: "Le jeu fonctionne-t-il sur mobile ?", a: "Oui. Idlebound s'adapte aux écrans de téléphone et de tablette, directement dans le navigateur, sans rien installer." },
        { q: "Qu'est-ce que l'ascension ?", a: "Après avoir vaincu le Roi déchu à l'étape 50, tu peux recommencer depuis le début en échange d'essences. Chaque essence augmente tes dégâts et peut être investie dans des autels permanents." },
        { q: "Qu'est-ce que la Descente ?", a: "La seconde renaissance, pour le long cours. Passé l'étape 1000, quand Eldra te fait assez confiance, elle t'ouvre son Métier : tu y laisses tes essences et tes autels pour tisser des fils, qui achètent des Tissages permanents. Tes reliques, ta Chronique et les souvenirs de tes compagnons te suivent." },
        { q: "Comment le classement évite-t-il la triche ?", a: "Chaque sauvegarde envoyée au serveur est vérifiée avec le moteur du jeu : or dépensé et gagné, temps écoulé, puissance nécessaire pour vaincre les boss, objets et succès. Une progression impossible est refusée." },
        { q: "L'histoire a-t-elle une fin ?", a: "La route, oui : elle s'arrête à l'étape 3000, au bout de la nuit. L'histoire, elle, continue de s'écrire : chaque ascension, chaque roi vaincu, chaque rencontre ajoute un fragment à ta Chronique. Ce qui attend tout au fond, tu le découvriras en marchant." }
      ]
    },
    finalCta: {
      title: "Le Roi s'est relevé.",
      text: "Tes compagnons ne te connaissent pas encore. La route commence au premier clic.",
      button: "Prendre la route"
    }
  },
  en: {
    metaTitle: "Idlebound · Online fantasy clicker, an idle game in your browser",
    jsonLd: {
      genre: ["Idle game", "Clicker", "Incremental game", "Fantasy"],
      platform: "Web browser",
      os: "Any"
    },
    hero: {
      titleLead: "Slay the Fallen King, ",
      titleAccent: "one click at a time.",
      lead:
        "Every night, the Fallen King rises. Every night, you cut your way to his throne, and when he falls, the road begins again. Your companions forget you. The monsters never do. And every night takes you a little deeper.",
      play: "Take the road",
      leaderboard: "See the leaderboard",
      back: "Already on the road?",
      backLink: "Pick up your game",
      boss: {
        rank: "guardian",
        strike: "Strike the Fallen King",
        hint: "Strike him.",
        again: "Again.",
        crit: "Critical hit: ten times the damage.",
        fallen: "He falls. Next night, he rises."
      }
    },
    steps: {
      label: "How it plays",
      items: [
        { title: "Click", text: "Strike monsters to earn gold. Critical hits deal ten times the damage." },
        { title: "Hire", text: "Hire companions who attack relentlessly, even while you do something else. The further you go, the more they carry the adventure." },
        { title: "Ascend", text: "Ascend to harvest essences, build your altars and push your records further." }
      ]
    },
    features: {
      anchor: "features",
      title: "What the road holds",
      items: (c: Counts) => [
        { title: "A road that begins again", text: `${c.stages} stages, ${c.eras} strata in ${c.ages} Ages, a boss every 5 stages, against the clock. When the king falls, be reborn stronger: your essences feed ${c.altars} permanent altars.` },
        { title: `${c.heroes} companions who remember`, text: "An archer, a monk, a lich, a dragon king. Every night they meet you as strangers. Take them far enough, often enough, and one day they know your face." },
        { title: "The Chronicle", text: `Every fallen king, every echo of the road leaves a fragment behind. Crystal storms, a suspiciously lucky rat, a passing caravan, ${c.secrets} well-kept secrets: the story comes to you in pieces.` },
        { title: `A bestiary of ${c.creatures} creatures`, text: "From the field rat to the guardian of the ruins, every Remnant has its page, and its lines open up the more you meet it. Some show up only once a night." },
        { title: "Relics and legends", text: `Bosses drop weapons, armor, amulets and rings, from common to mythic: forge them with your shards. ${c.relics} of them carry a name, a legend and a power of their own.` },
        { title: "A company that fights without you", text: "Leave the tab open and go work, study or play something else: your companions keep fighting and getting stronger. Your game is saved on our servers and follows you on every device." }
      ],
      descent: {
        title: "The Descent, at Eldra's Loom",
        text: (c: Counts) => `When the road is no longer enough, Eldra shows you her Loom. Unravel your essences and altars into threads, and take up the night one layer down: ${c.weaves} permanent Weaves wait there, and nothing undoes them.`
      },
      numbers: {
        title: "The night in numbers",
        companions: "Companions",
        creatures: "Creatures",
        stages: "Stages",
        strata: "Strata",
        players: "Walkers on the leaderboard"
      }
    },
    biomes: {
      title: (eras: number) => `Five biomes, ${eras} strata of night`,
      stages: (from: number, to: number) => `Stages ${from} to ${to}`,
      boss: "Boss: "
    },
    board: {
      title: "The greatest adventurers",
      rank: "Rank",
      walker: "Walker",
      depth: "Depth",
      value: (stage: string) => `Stage ${stage}`,
      empty: "The leaderboard is waiting for its first heroes. ",
      emptyCta: "Why not you?",
      join: "To carve your name here: take the road, then create your account.",
      more: "Full leaderboard"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is an idle clicker?", a: "An incremental game: you click to attack, hire companions who attack for you, and your numbers grow exponentially. With the tab open, the game keeps going even when you're not playing." },
        { q: "Do I have to click all the time?", a: "No. Your clicks carry the start of each run, then your companions take over. Later on, some talents and the Altar of Patience boost their damage when you let go of the mouse, while powers and crystals reward the moments you're there." },
        { q: "Do I need an account to play?", a: "No, you can start right away. To keep your progress, create an account: an email, a username and a password are all it takes. Your game is then saved on our servers, available on all your devices, and you show up on the leaderboard." },
        { q: "Does the game work on mobile?", a: "Yes. Idlebound adapts to phone and tablet screens, right in the browser, with nothing to install." },
        { q: "What is ascension?", a: "Once you've defeated the Fallen King at stage 50, you can start over from the beginning in exchange for essences. Each essence increases your damage and can be invested in permanent altars." },
        { q: "What is the Descent?", a: "The second rebirth, for the long haul. Past stage 1000, once Eldra trusts you enough, she opens her Loom to you: you leave your essences and altars there to weave threads, which buy permanent Weaves. Your relics, your Chronicle and what your companions remember all come with you." },
        { q: "How does the leaderboard prevent cheating?", a: "Every save sent to the server is checked with the game engine: gold spent and earned, time elapsed, power needed to beat the bosses, items and achievements. Impossible progress is rejected." },
        { q: "Does the story end?", a: "The road does: it stops at stage 3000, at the far end of the night. The story keeps writing itself: every ascension, every fallen king, every encounter adds a fragment to your Chronicle. What waits at the very bottom, you'll find out by walking." }
      ]
    },
    finalCta: {
      title: "The King has risen.",
      text: "Your companions don't know you yet. The road starts with the first click.",
      button: "Take the road"
    }
  }
});
