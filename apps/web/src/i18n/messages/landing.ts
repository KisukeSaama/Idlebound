import { defineMessages } from "../define";

type Counts = { biomes: number; heroes: number; altars: number };

/** Landing page (/[locale]). */
export const landing = defineMessages({
  fr: {
    metaTitle: "Idlebound · Clicker fantasy gratuit en ligne, idle game dans ton navigateur",
    jsonLd: {
      genre: ["Idle game", "Clicker", "Jeu incrémental", "Fantasy"],
      platform: "Navigateur web",
      os: "Tous"
    },
    hero: {
      titleLead: "Terrasse le Roi déchu, ",
      titleAccent: "un clic à la fois.",
      lead:
        "Idlebound est un clicker fantasy où chaque coup d'épée compte. Recrute des compagnons, affronte des boss contre la montre, récolte des reliques et renais plus puissant à chaque ascension. Ta horde continue de se battre même quand tu n'es pas là.",
      play: "Jouer gratuitement",
      leaderboard: "Voir le classement",
      note: "Idle clicker fantasy · gratuit · sans téléchargement",
      proofLabel: "Chiffres clés",
      companions: "compagnons",
      achievements: "succès",
      players: "aventuriers classés",
      stages: "étapes"
    },
    steps: {
      title: "Simple à prendre en main, impossible à lâcher",
      items: [
        { title: "Clique", text: "Frappe les monstres pour gagner de l'or. Les coups critiques infligent dix fois plus de dégâts." },
        { title: "Recrute", text: "Dépense ton or pour engager des compagnons qui attaquent sans relâche, même hors ligne. Plus tu avances, plus ce sont eux qui portent l'aventure." },
        { title: "Renais", text: "Fais ton ascension pour récolter des essences, bâtir tes autels et repousser tes records." }
      ]
    },
    features: {
      anchor: "fonctionnalites",
      title: "Tout ce qu'un grand idle game doit avoir",
      items: (c: Counts) => [
        { title: "Des étapes sans fin", text: `${c.biomes} biomes, des ères de plus en plus redoutables et un boss toutes les 5 étapes, chronomètre en main.` },
        { title: `${c.heroes} compagnons`, text: "Recrute une archère, un moine, une liche ou un roi-dragon. Chacun a ses talents et ses paliers de puissance." },
        { title: "Ascension", text: `Renais plus fort : les essences récoltées nourrissent ${c.altars} autels permanents qui changent ta façon de jouer.` },
        { title: "Reliques et butin", text: "Les boss lâchent des armes, armures, amulettes et anneaux, du commun au mythique. Forge-les pour les renforcer." },
        { title: "Marché d'éclats", text: "Recycle ton butin en éclats et échange-les contre des coffres, des potions et des sabliers dorés." },
        { title: "Progression hors ligne", text: "Tes compagnons combattent même quand tu fermes l'onglet. Ta partie est sauvegardée sur nos serveurs et te suit sur tous tes appareils." }
      ]
    },
    biomes: {
      title: "Cinq biomes, des ères infinies",
      stages: (from: number, to: number) => `Étapes ${from} à ${to}`,
      boss: "Boss : "
    },
    board: {
      title: "Les plus grands aventuriers",
      value: (stage: string) => `Étape ${stage}`,
      empty: "Le classement attend ses premiers héros. ",
      emptyCta: "Et si c'était toi ?",
      more: "Classement complet"
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Idlebound est-il gratuit ?", a: "Oui, entièrement. Pas de publicité, pas d'achat intégré, pas de pay-to-win : tout se gagne en jouant." },
        { q: "Faut-il créer un compte pour jouer ?", a: "Tu peux essayer le jeu immédiatement, sans compte. Pour garder ta progression, crée un compte gratuit : un e-mail, un pseudo et un mot de passe suffisent. Ta partie est alors sauvegardée sur nos serveurs, accessible depuis tous tes appareils, et tu apparais au classement." },
        { q: "Qu'est-ce qu'un idle clicker ?", a: "Un jeu incrémental : tu cliques pour attaquer, tu recrutes des compagnons qui attaquent à ta place, et tes chiffres grossissent de façon exponentielle. Le jeu continue même quand tu ne joues pas." },
        { q: "Faut-il cliquer sans arrêt ?", a: "Non. Tes clics portent le début de chaque partie, puis tes compagnons prennent le relais. Lâche la souris une minute et la Patience renforce leurs dégâts ; les pouvoirs et les cristaux récompensent les moments où tu es là." },
        { q: "Le jeu fonctionne-t-il sur mobile ?", a: "Oui. Idlebound s'adapte aux écrans de téléphone et de tablette, directement dans le navigateur, sans rien installer." },
        { q: "Comment le classement évite-t-il la triche ?", a: "Chaque sauvegarde envoyée au serveur est vérifiée avec le moteur du jeu : or dépensé et gagné, temps écoulé, puissance nécessaire pour vaincre les boss, objets et succès. Une progression impossible est refusée." },
        { q: "Qu'est-ce que l'ascension ?", a: "Après avoir vaincu le Roi déchu à l'étape 50, tu peux recommencer depuis le début en échange d'essences. Chaque essence augmente tes dégâts et peut être investie dans des autels permanents." }
      ]
    },
    finalCta: {
      title: "Ton aventure commence au premier clic.",
      text: "Essaie sans inscription, puis crée un compte gratuit pour sauvegarder ta progression.",
      button: "Lancer Idlebound"
    }
  },
  en: {
    metaTitle: "Idlebound · Free online fantasy clicker, an idle game in your browser",
    jsonLd: {
      genre: ["Idle game", "Clicker", "Incremental game", "Fantasy"],
      platform: "Web browser",
      os: "Any"
    },
    hero: {
      titleLead: "Slay the Fallen King, ",
      titleAccent: "one click at a time.",
      lead:
        "Idlebound is a fantasy clicker where every sword stroke counts. Hire companions, race the clock against bosses, gather relics and come back stronger with every ascension. Your warband keeps fighting even while you're away.",
      play: "Play for free",
      leaderboard: "See the leaderboard",
      note: "Fantasy idle clicker · free · no download",
      proofLabel: "Key figures",
      companions: "companions",
      achievements: "achievements",
      players: "ranked adventurers",
      stages: "stages"
    },
    steps: {
      title: "Easy to pick up, impossible to put down",
      items: [
        { title: "Click", text: "Strike monsters to earn gold. Critical hits deal ten times the damage." },
        { title: "Hire", text: "Spend your gold on companions who attack relentlessly, even while you're offline. The further you go, the more they carry the adventure." },
        { title: "Ascend", text: "Ascend to harvest essences, build your altars and push your records further." }
      ]
    },
    features: {
      anchor: "features",
      title: "Everything a great idle game should have",
      items: (c: Counts) => [
        { title: "Endless stages", text: `${c.biomes} biomes, ever more dangerous eras and a boss every 5 stages, against the clock.` },
        { title: `${c.heroes} companions`, text: "Hire an archer, a monk, a lich or a dragon king. Each one has their own talents and power milestones." },
        { title: "Ascension", text: `Be reborn stronger: the essences you harvest feed ${c.altars} permanent altars that change the way you play.` },
        { title: "Relics and loot", text: "Bosses drop weapons, armor, amulets and rings, from common to mythic. Forge them to make them stronger." },
        { title: "Shard market", text: "Salvage your loot into shards and trade them for chests, potions and golden hourglasses." },
        { title: "Offline progress", text: "Your companions keep fighting after you close the tab. Your game is saved on our servers and follows you on every device." }
      ]
    },
    biomes: {
      title: "Five biomes, endless eras",
      stages: (from: number, to: number) => `Stages ${from} to ${to}`,
      boss: "Boss: "
    },
    board: {
      title: "The greatest adventurers",
      value: (stage: string) => `Stage ${stage}`,
      empty: "The leaderboard is waiting for its first heroes. ",
      emptyCta: "Why not you?",
      more: "Full leaderboard"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "Is Idlebound free?", a: "Yes, completely. No ads, no in-app purchases, no pay-to-win: everything is earned by playing." },
        { q: "Do I need an account to play?", a: "You can try the game right away, no account needed. To keep your progress, create a free account: an email, a username and a password are all it takes. Your game is then saved on our servers, available on all your devices, and you show up on the leaderboard." },
        { q: "What is an idle clicker?", a: "An incremental game: you click to attack, hire companions who attack for you, and your numbers grow exponentially. The game keeps going even when you're not playing." },
        { q: "Do I have to click all the time?", a: "No. Your clicks carry the start of each run, then your companions take over. Let go of the mouse for a minute and Patience boosts their damage, while powers and crystals reward the moments you're there." },
        { q: "Does the game work on mobile?", a: "Yes. Idlebound adapts to phone and tablet screens, right in the browser, with nothing to install." },
        { q: "How does the leaderboard prevent cheating?", a: "Every save sent to the server is checked with the game engine: gold spent and earned, time elapsed, power needed to beat the bosses, items and achievements. Impossible progress is rejected." },
        { q: "What is ascension?", a: "Once you've defeated the Fallen King at stage 50, you can start over from the beginning in exchange for essences. Each essence increases your damage and can be invested in permanent altars." }
      ]
    },
    finalCta: {
      title: "Your adventure starts with the first click.",
      text: "Try it without signing up, then create a free account to save your progress.",
      button: "Launch Idlebound"
    }
  }
});
