import { GUEST_SAVE_DAYS } from "@idlebound/game";
import { defineMessages } from "../define";

/**
 * Landing page (/[locale]). It says what the game is and how it plays, and stays silent about
 * the rest: no count of what lies down the road, nothing the walk should be the one to tell.
 */
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
      titleAccent: "un coup à la fois.",
      lead: "Chaque nuit, le Roi déchu se relève. Chaque nuit, tu te fraies un chemin jusqu'à son trône. Et quand il tombe, la route recommence.",
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
        { title: "Frappe", text: "Terrasse les monstres pour gagner de l'or. Les coups critiques infligent dix fois plus de dégâts." },
        { title: "Recrute", text: "Engage des compagnons qui attaquent sans relâche, même quand tu fais autre chose. Plus tu avances, plus ce sont eux qui portent l'aventure." },
        { title: "Recommence", text: "Quand le Roi tombe, la nuit recommence. Ce que tu emportes d'une nuit à l'autre, c'est toi qui le choisis." }
      ]
    },
    features: {
      title: "Ce que la route te réserve",
      items: [
        { title: "Une compagnie qui se bat sans toi", text: "Laisse le jeu ouvert et va travailler, étudier ou jouer à autre chose : tes compagnons continuent de se battre et de se renforcer. Ta partie est conservée sur nos serveurs et te suit sur tous tes appareils." },
        { title: "Des reliques et des légendes", text: "Les boss lâchent armes, armures, amulettes et anneaux, du commun au mythique. Certaines portent un nom, une légende et un pouvoir bien à elles." },
        { title: "Une histoire qui se mérite", text: "Le monde ne t'explique rien d'avance. Il se raconte à qui marche : un fragment ici, un visage là, et un jour, ce que tout cela veut dire." }
      ]
    },
    biomes: {
      title: "Cinq lieux d'un royaume perdu",
      stages: (from: number, to: number) => `Étapes ${from} à ${to}`,
      boss: "Boss : "
    },
    board: {
      title: "Les marcheurs les plus profonds",
      rank: "Rang",
      walker: "Marcheur",
      depth: "Étape la plus haute",
      value: (stage: string) => `Étape ${stage}`,
      empty: "Le classement attend ses premiers marcheurs. ",
      emptyCta: "Et si c'était toi ?",
      join: "Pour y graver ton nom : prends la route, puis crée ton compte.",
      more: "Classement complet"
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Qu'est-ce qu'un idle clicker ?", a: "Un jeu incrémental : tu frappes pour attaquer, tu recrutes des compagnons qui attaquent à ta place, et tes chiffres grossissent de façon exponentielle. Page ouverte, le jeu continue même quand tu ne joues pas." },
        { q: "Faut-il frapper sans arrêt ?", a: "Non. Tes coups portent le début de chaque nuit, puis tes compagnons prennent le relais. Les pouvoirs et les cristaux récompensent les moments où tu es là." },
        { q: "Faut-il créer un compte pour jouer ?", a: `Non, tu peux commencer tout de suite : ta partie est gardée pour ce navigateur, tant que tu y reviens au moins une fois tous les ${GUEST_SAVE_DAYS} jours. Avec un compte (un e-mail, un pseudo et un mot de passe suffisent), elle te suit sur tous tes appareils et tu apparais au classement.` },
        { q: "Le jeu fonctionne-t-il sur mobile ?", a: "Oui. Idlebound s'adapte aux téléphones et aux tablettes, directement dans le navigateur, sans rien installer." },
        { q: "Comment le classement évite-t-il la triche ?", a: "Chaque progression envoyée au serveur est vérifiée avec le moteur du jeu : or dépensé et gagné, temps écoulé, puissance nécessaire pour vaincre les boss, objets et succès. Une progression impossible est refusée." },
        { q: "Jusqu'où va la route ?", a: "Aussi loin que tu veux. Elle ne s'arrête pas." },
        { q: "L'histoire a-t-elle une fin ?", a: "Elle continue de s'écrire : chaque ascension, chaque roi vaincu, chaque rencontre ajoute un fragment à ta Chronique. Ce qui attend au fond de la nuit, tu le découvriras en marchant." }
      ]
    },
    finalCta: {
      title: "Le Roi s'est relevé.",
      text: "La route commence au premier coup.",
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
      titleAccent: "one blow at a time.",
      lead: "Every night, the Fallen King rises. Every night, you cut your way to his throne. And when he falls, the road begins again.",
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
        { title: "Strike", text: "Cut down monsters to earn gold. Critical hits deal ten times the damage." },
        { title: "Hire", text: "Hire companions who attack relentlessly, even while you do something else. The further you go, the more they carry the adventure." },
        { title: "Again", text: "When the King falls, the night begins again. What you carry from one night to the next is yours to choose." }
      ]
    },
    features: {
      title: "What the road holds",
      items: [
        { title: "A company that fights without you", text: "Leave the game open and go work, study or play something else: your companions keep fighting and getting stronger. Your game is kept on our servers and follows you on every device." },
        { title: "Relics and legends", text: "Bosses drop weapons, armor, amulets and rings, from common to mythic. Some of them carry a name, a legend and a power of their own." },
        { title: "A story you earn", text: "The world explains nothing ahead of time. It tells itself to whoever walks: a fragment here, a face there, and one day, what it all means." }
      ]
    },
    biomes: {
      title: "Five places of a lost kingdom",
      stages: (from: number, to: number) => `Stages ${from} to ${to}`,
      boss: "Boss: "
    },
    board: {
      title: "The deepest walkers",
      rank: "Rank",
      walker: "Walker",
      depth: "Highest stage",
      value: (stage: string) => `Stage ${stage}`,
      empty: "The leaderboard is waiting for its first walkers. ",
      emptyCta: "Why not you?",
      join: "To carve your name here: take the road, then create your account.",
      more: "Full leaderboard"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is an idle clicker?", a: "An incremental game: you strike to attack, hire companions who attack for you, and your numbers grow exponentially. With the page open, the game keeps going even when you're not playing." },
        { q: "Do I have to strike all the time?", a: "No. Your blows carry the start of each night, then your companions take over. Powers and crystals reward the moments you're there." },
        { q: "Do I need an account to play?", a: `No, you can start right away: your game is kept for this browser, as long as you come back to it at least once every ${GUEST_SAVE_DAYS} days. With an account (an email, a username and a password are all it takes), it follows you on all your devices and you show up on the leaderboard.` },
        { q: "Does the game work on mobile?", a: "Yes. Idlebound adapts to phones and tablets, right in the browser, with nothing to install." },
        { q: "How does the leaderboard prevent cheating?", a: "All progress sent to the server is checked with the game engine: gold spent and earned, time elapsed, power needed to beat the bosses, items and achievements. Impossible progress is rejected." },
        { q: "How far does the road go?", a: "As far as you want. It does not stop." },
        { q: "Does the story end?", a: "It keeps writing itself: every ascension, every fallen king, every encounter adds a fragment to your Chronicle. What waits at the bottom of the night, you'll find out by walking." }
      ]
    },
    finalCta: {
      title: "The King has risen.",
      text: "The road starts with the first blow.",
      button: "Take the road"
    }
  }
});
