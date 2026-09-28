import type { Locale } from "../../i18n";
import type { CompanyText } from "../types";

/** Recognition memories (five tiers) and hire lines (stranger, half remembered, remembered). */
export const COMPANY_TEXT: Record<Locale, Pick<CompanyText, "memories" | "hireLines">> = {
  en: {
    memories: {
      ysolde: [
        { by: "Ysolde", text: "Ysolde draws on a point just behind your shoulder. She holds it a long time, then lowers the bow. \"Nothing. Habit.\"" },
        { by: "Ysolde", text: "The branches lean as you pass. \"They're saying a name,\" Ysolde says. \"Yours, I think. They don't usually bother.\"" },
        { by: "Ysolde", text: "\"You always step on that root.\" She points. You look down. You have not stepped on it yet." },
        { by: "Ysolde", text: "She leads you off the path to a hollow in the moss, shaped like someone lying down. \"Here. A long time ago. I wasn't fast enough.\"" },
        { by: "Ysolde", text: "\"The forest says you never give up. I told it I already knew.\"" }
      ],
      cendre: [
        { by: "Brother Cinder", text: "Brother Cinder pours two cups before you sit. \"Tea. Violence can wait. It always does, and it complains the whole time.\"" },
        { by: "Brother Cinder", text: "He hands you your cup: honey, no milk, just so. \"I don't know how I know. The flame, perhaps. It never tells me anything useful.\"" },
        { by: "Brother Cinder", text: "He feeds the order's flame, one twig at a time. \"I had a sister who could light it with a look. She wanted it bigger.\"" },
        { by: "Brother Cinder", text: "\"If you ever walk with a priestess whose prayers smoke, keep the fire between her and me. For her sake. Mostly.\"" },
        { by: "Brother Cinder", text: "\"Tell her the flame is still lit. She'll know what it means.\"" }
      ],
      nyx: [
        { by: "Nyx", text: "You wake in the Sanctum. Nyx sits on the nearest stone, facing you. She has not moved. She says nothing." },
        { by: "Nyx", text: "\"...Aldric?\" Your name, from under the hood, like a question she is not sure she is allowed to ask." },
        { by: "Nyx", text: "By the fire, someone says the word Dawn. Nyx's hand goes to her dagger, then to her hood. \"...\"" },
        { by: "Nyx", text: "Nyx turns her back and lowers her hood. Past her ear, for one heartbeat, you see deep blue and a few small lights, very far away. Then the hood." },
        { by: "Nyx", text: "\"I am not with you. I am around you.\"" }
      ],
      garrick: [
        { by: "Garrick", text: "Garrick looks you up and down. \"You've got the look of a shard-finder. Squinty. Broke. We'll get on.\"" },
        { by: "Garrick", text: "He leans in and whispers where he hides his best finds. Then, alarmed: \"Why did I tell you that? I don't tell anyone that. Forget it. Please.\"" },
        { by: "Garrick", text: "He holds a shard up to the sky. The crack above you has exactly its shape. \"Fallen stars,\" he says, less sure than usual." },
        { by: "Garrick", text: "\"Found one once with a face in it. Not one of ours. Wrong sort of eyes. It blinked, so I put it back in the ground and went home early.\"" },
        { by: "Garrick", text: "He digs it up, swearing the whole way, and presses the buried shard into your palm. \"Keep it. Its eyes are shut now. Must like you.\"" }
      ],
      seraphine: [
        { by: "Séraphine", text: "Séraphine kneels and speaks to a root. It uncurls from the soil and points, very slowly, at you. She frowns at the root, not at you." },
        { by: "Séraphine", text: "\"The heart of the Grove is expecting you,\" Séraphine says. \"It does not expect anyone. It has not needed to in a long time.\"" },
        { by: "Séraphine", text: "At the Old Grove, Séraphine stays at the edge, one hand on the bark of a younger tree. \"Go on. I'll be here after.\"" },
        { by: "Séraphine", text: "\"It taught me my first root. The first night, it asked me to help you. I said no. It asked again. It is patient.\"" },
        { by: "Séraphine", text: "\"She says thank you. Every time.\" She presses a seed into your hand, still warm. \"Her last. It won't grow here. It's waiting.\"" }
      ],
      thorvald: [
        { by: "Thorvald", text: "Thorvald slams his elbow on a barrel. \"Arm-wrestle. Loser carries the pack. Winner also carries the pack. I just like winning.\"" },
        { by: "Thorvald", text: "Halfway through, he stops. \"I've lost this before. To you. I never lose twice.\" He loses twice." },
        { by: "Thorvald", text: "A golden rat crosses the road. Thorvald goes pale, hides behind you, and pretends he was checking your armor." },
        { by: "Thorvald", text: "\"It was a mountain, see. I bet I could fell it. I did. The bet was that I couldn't. Don't ask who with. He's small, and he keeps count.\"" },
        { by: "Thorvald", text: "\"If you see the rat, tell him we're even.\" They are not, and he knows you know." }
      ],
      mirelle: [
        { by: "Mirelle", text: "Mirelle hands you a flask without a word, watches you drink, and writes something down. \"Interesting. Your ears will stop in an hour.\"" },
        { by: "Mirelle", text: "Her notebook falls open on the path. Your name is in it, page after page, in her hand. \"Give that back. It's research.\"" },
        { by: "Mirelle", text: "The notebook is about her husband: doses, dates, what he said. Your name is only in the margins, under \"witness\"." },
        { by: "Mirelle", text: "At the Baron's feet she touches your arm. \"Wait. One breath. Let me try this one.\" She pours. You wait. She nods, and you strike." },
        { by: "Mirelle", text: "She works her wedding ring off her finger and drops it into your palm. \"He'd want someone useful to wear it.\"" }
      ],
      kaelen: [
        { by: "Kaelen", text: "Before the Fallen Sentinels, Kaelen stops and salutes. They salute back. Then they attack, and he does not hold back." },
        { by: "Kaelen", text: "In the Keep, Kaelen keeps his eyes on the floor. He fights the King looking at the King's boots, never at the throne." },
        { by: "Kaelen", text: "\"I knew him,\" Kaelen says, cleaning his blade. \"Before. He was kind. He was always kind. It made everything harder.\"" },
        { by: "Kaelen", text: "\"There was a night the gates stood open and the road was dark. I was meant to be on it. I ran. Someone went in my place.\"" },
        { by: "Kaelen", text: "\"Let me strike the last blow. Once. I owe him that night.\"" }
      ],
      oriane: [
        { by: "Oriane", text: "\"...a long way to get here,\" Oriane finishes, before you do. It is exactly what you were going to say." },
        { by: "Oriane", text: "\"...and you are hungry,\" she finishes. You were not going to say that at all. She knows. She wants to hear you laugh." },
        { by: "Oriane", text: "Oriane counts under her breath while you walk. The numbers are very large. When you look at her, she does not stop." },
        { by: "Oriane", text: "She stops in the middle of a number. \"I have lost it. I never lose it.\" She does not start again." },
        { by: "Oriane", text: "\"I stopped listening to the old nights. I listen to this one now.\" She gives you a shell of pale stone. \"Keep it. It talks too much.\"" }
      ]
    },
    hireLines: {
      ysolde: [
        "Stand still. There. Now you're not dead.",
        "Stand still. No, you already know where. How do you know where?",
        "Left of the root. There. I've got your back."
      ],
      cendre: [
        "Violence is never the answer. It is, however, frequently the question.",
        "Have we had tea? I feel we have had tea.",
        "Honey, no milk. Sit. The road can wait one cup."
      ],
      nyx: ["...", "...Again?", "...Aldric."],
      garrick: [
        "Rich! We'll be rich! Well, I will. You'll be employed.",
        "Rich! We'll be... Have I pitched you this already? You've got a pitched-at face.",
        "You! Grab a pick. Your cut's the same as always. Small."
      ],
      seraphine: [
        "The roots obey me because I asked nicely. Once.",
        "The roots stirred before you came. They don't, usually.",
        "Come. The Grove is expecting you. So was I."
      ],
      thorvald: [
        "Double or nothing!",
        "Double or nothing! Again. Wait, what did I lose last time?",
        "Double or nothing, friend. You still owe me a rematch."
      ],
      mirelle: [
        "Drink this. No, don't smell it first.",
        "Drink this. You've had it before? Impossible. I only made it tonight.",
        "The notebook's open. Drink, then tell me everything you feel."
      ],
      kaelen: [
        "Stand behind me. No, further.",
        "Stand behind me. Have you always stood there?",
        "Stand beside me. Just this once. I'd like the company."
      ],
      oriane: [
        "You're about to ask me something. The answer is yes.",
        "You're about to ask me something. I have heard it before. The answer is still yes.",
        "You are here. Good. I know what you will say, and I want to hear it anyway."
      ]
    }
  },
  fr: {
    memories: {
      ysolde: [
        { by: "Ysolde", text: "Ysolde bande son arc vers un point juste derrière ton épaule. Elle tient longtemps, puis l'abaisse. « Rien. L'habitude. »" },
        { by: "Ysolde", text: "Les branches se penchent sur ton passage. « Elles disent un nom, souffle Ysolde. Le tien, je crois. D'habitude, elles ne se donnent pas cette peine. »" },
        { by: "Ysolde", text: "« Tu marches toujours sur cette racine. » Elle la montre du doigt. Tu baisses les yeux. Tu n'as pas encore marché dessus." },
        { by: "Ysolde", text: "Elle t'emmène hors du sentier, vers un creux dans la mousse, de la forme d'un corps allongé. « Ici. Il y a longtemps. Je n'ai pas été assez rapide. »" },
        { by: "Ysolde", text: "« La forêt dit que tu n'abandonnes jamais. Je lui ai répondu que je le savais déjà. »" }
      ],
      cendre: [
        { by: "Frère Cendre", text: "Frère Cendre sert deux tasses avant que tu t'assoies. « Du thé. La violence peut attendre. Elle attend toujours, en râlant. »" },
        { by: "Frère Cendre", text: "Il te tend ta tasse : du miel, pas de lait, exactement comme il faut. « Je ne sais pas comment je le sais. La flamme, peut-être. Elle ne me dit jamais rien d'utile. »" },
        { by: "Frère Cendre", text: "Il nourrit la flamme de l'ordre, brindille après brindille. « J'avais une sœur qui l'allumait d'un regard. Elle la voulait plus grande. »" },
        { by: "Frère Cendre", text: "« Si un jour tu marches avec une prêtresse dont les prières fument, garde le feu entre elle et moi. Pour elle. Enfin, surtout pour elle. »" },
        { by: "Frère Cendre", text: "« Dis-lui que la flamme brûle encore. Elle saura ce que ça veut dire. »" }
      ],
      nyx: [
        { by: "Nyx", text: "Tu t'éveilles dans le Sanctuaire. Nyx est assise sur la pierre la plus proche, tournée vers toi. Elle n'a pas bougé. Elle ne dit rien." },
        { by: "Nyx", text: "« ...Aldric ? » Ton nom, sous la capuche, comme une question qu'elle n'est pas sûre d'avoir le droit de poser." },
        { by: "Nyx", text: "Près du feu, quelqu'un prononce le mot Aube. La main de Nyx va à sa dague, puis à sa capuche. « ... »" },
        { by: "Nyx", text: "Nyx te tourne le dos et abaisse sa capuche. Par-dessus son épaule, le temps d'un battement de cœur, un bleu profond et quelques lumières, très loin. Puis la capuche." },
        { by: "Nyx", text: "« Je ne suis pas avec toi. Je suis autour de toi. »" }
      ],
      garrick: [
        { by: "Garrick", text: "Garrick te toise de haut en bas. « T'as une tête de chercheur d'éclats. Plissée. Fauchée. On va s'entendre. »" },
        { by: "Garrick", text: "Il se penche et te chuchote où il cache ses plus belles trouvailles. Puis, affolé : « Pourquoi je t'ai dit ça ? Je ne le dis à personne. Oublie. S'il te plaît. »" },
        { by: "Garrick", text: "Il lève un éclat vers le ciel. La fêlure au-dessus de vous a exactement sa forme. « Des étoiles tombées », dit-il, moins sûr que d'habitude." },
        { by: "Garrick", text: "« J'en ai trouvé un, une fois, avec un visage dedans. Pas de chez nous. Des yeux pas comme il faut. Il a cligné. Je l'ai rendu à la terre et je suis rentré tôt. »" },
        { by: "Garrick", text: "Il le déterre en jurant du début à la fin et te glisse l'éclat dans la paume. « Garde-le. Il a les yeux fermés, maintenant. Il doit t'aimer bien. »" }
      ],
      seraphine: [
        { by: "Séraphine", text: "Séraphine s'agenouille et parle à une racine. Elle se déroule hors de la terre et te désigne, très lentement. Séraphine la regarde de travers, elle, pas toi." },
        { by: "Séraphine", text: "« Le cœur du bosquet t'attend, dit Séraphine. Il n'attend personne. Il n'en a plus eu besoin depuis longtemps. »" },
        { by: "Séraphine", text: "Au vieux bosquet, Séraphine reste à la lisière, une main sur l'écorce d'un arbre plus jeune. « Vas-y. Je serai là, après. »" },
        { by: "Séraphine", text: "« Il m'a appris ma première racine. Le premier soir, il m'a demandé de t'aider. J'ai dit non. Il a redemandé. Il est patient. »" },
        { by: "Séraphine", text: "« Elle dit merci. À chaque fois. » Elle te met une graine dans la main, encore tiède. « Sa dernière. Elle ne poussera pas ici. Elle attend. »" }
      ],
      thorvald: [
        { by: "Thorvald", text: "Thorvald abat son coude sur un tonneau. « Bras de fer. Le perdant porte le sac. Le gagnant aussi, mais moi, j'aime gagner. »" },
        { by: "Thorvald", text: "À mi-partie, il s'arrête. « J'ai déjà perdu ça. Contre toi. Je ne perds jamais deux fois. » Il perd deux fois." },
        { by: "Thorvald", text: "Un rat doré traverse la route. Thorvald blêmit, se cache derrière toi et fait semblant de vérifier ton armure." },
        { by: "Thorvald", text: "« Une montagne, tu vois. J'ai parié que je pouvais l'abattre. Je l'ai abattue. Le pari, c'était que non. Ne demande pas avec qui. Il est petit, et il compte. »" },
        { by: "Thorvald", text: "« Si tu vois le rat, dis-lui qu'on est quittes. » Ils ne le sont pas, et il sait que tu le sais." }
      ],
      mirelle: [
        { by: "Mirelle", text: "Mirelle te tend une fiole sans un mot, te regarde boire et note quelque chose. « Intéressant. Tes oreilles s'arrêteront dans une heure. »" },
        { by: "Mirelle", text: "Son carnet tombe ouvert sur le chemin. Ton nom y est, page après page, de sa main. « Rends-moi ça. C'est de la recherche. »" },
        { by: "Mirelle", text: "Le carnet parle de son mari : doses, dates, ce qu'il a dit. Ton nom n'apparaît que dans les marges, sous « témoin »." },
        { by: "Mirelle", text: "Aux pieds du Baron, elle te touche le bras. « Attends. Un souffle. Laisse-moi essayer celle-ci. » Elle verse. Tu attends. Elle hoche la tête, et tu frappes." },
        { by: "Mirelle", text: "Elle fait glisser son alliance de son doigt et la laisse tomber dans ta paume. « Il voudrait que quelqu'un d'utile la porte. »" }
      ],
      kaelen: [
        { by: "Kaelen", text: "Devant les Sentinelles déchues, Kaelen s'arrête et salue. Elles lui rendent son salut. Puis elles attaquent, et il ne retient pas ses coups." },
        { by: "Kaelen", text: "Dans le donjon, Kaelen garde les yeux au sol. Il affronte le Roi en regardant ses bottes, jamais le trône." },
        { by: "Kaelen", text: "« Je le connaissais, dit Kaelen en essuyant sa lame. Avant. Il était bon. Toujours bon. Ça rendait tout plus difficile. »" },
        { by: "Kaelen", text: "« Il y a eu une nuit où les portes étaient ouvertes et la route noire. C'était à moi d'y aller. J'ai fui. Quelqu'un est parti à ma place. »" },
        { by: "Kaelen", text: "« Laisse-moi porter le dernier coup. Une fois. Je lui dois cette nuit-là. »" }
      ],
      oriane: [
        { by: "Oriane", text: "« ...de loin pour arriver jusqu'ici », achève Oriane avant toi. C'est exactement ce que tu allais dire." },
        { by: "Oriane", text: "« ...et tu as faim », achève-t-elle. Ce n'est pas du tout ce que tu allais dire. Elle le sait. Elle veut t'entendre rire." },
        { by: "Oriane", text: "Oriane compte à mi-voix pendant que vous marchez. Les nombres sont immenses. Quand tu la regardes, elle ne s'arrête pas." },
        { by: "Oriane", text: "Elle s'arrête au milieu d'un nombre. « Je l'ai perdu. Je ne le perds jamais. » Elle ne recommence pas." },
        { by: "Oriane", text: "« J'ai cessé d'écouter les vieilles nuits. J'écoute celle-ci, maintenant. » Elle te donne un coquillage de pierre pâle. « Garde-le. Il parle trop. »" }
      ]
    },
    hireLines: {
      ysolde: [
        "Ne bouge plus. Là. Voilà, tu n'es pas mort.",
        "Ne bouge plus. Non, tu sais déjà où. Comment tu sais où ?",
        "À gauche de la racine. Voilà. Je couvre tes arrières."
      ],
      cendre: [
        "La violence n'est jamais la réponse. C'est, en revanche, très souvent la question.",
        "On a déjà pris le thé ? J'ai l'impression qu'on a déjà pris le thé.",
        "Du miel, pas de lait. Assieds-toi. La route attendra une tasse."
      ],
      nyx: ["...", "...Encore ?", "...Aldric."],
      garrick: [
        "Riches ! On sera riches ! Enfin, moi. Toi, tu seras employé.",
        "Riches ! On sera... Je t'ai déjà fait l'article ? T'as une tête à qui on a déjà fait l'article.",
        "Toi ! Prends une pioche. Ta part est la même que d'habitude. Petite."
      ],
      seraphine: [
        "Les racines m'obéissent parce que je leur ai demandé gentiment. Une fois.",
        "Les racines ont remué avant ton arrivée. D'habitude, elles ne remuent pas.",
        "Viens. Le bosquet t'attend. Moi aussi."
      ],
      thorvald: [
        "Quitte ou double !",
        "Quitte ou double ! Encore. Attends, j'avais perdu quoi, la dernière fois ?",
        "Quitte ou double, l'ami. Tu me dois toujours une revanche."
      ],
      mirelle: [
        "Bois ça. Non, ne le sens pas d'abord.",
        "Bois ça. Tu en as déjà bu ? Impossible. Je l'ai préparé ce soir.",
        "Le carnet est ouvert. Bois, puis dis-moi tout ce que tu ressens."
      ],
      kaelen: [
        "Reste derrière moi. Non, plus loin.",
        "Reste derrière moi. Tu t'es toujours tenu là ?",
        "Reste à côté de moi. Rien que cette fois. J'aimerais la compagnie."
      ],
      oriane: [
        "Tu vas me demander quelque chose. La réponse est oui.",
        "Tu vas me demander quelque chose. Je l'ai déjà entendu. La réponse est toujours oui.",
        "Tu es là. Bien. Je sais ce que tu vas dire, et je veux l'entendre quand même."
      ]
    }
  }
};
