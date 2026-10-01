import type { Locale } from "../../i18n";
import type { CompanyText } from "../types";

/** Recognition memories (five tiers) and hire lines (stranger, half remembered, remembered). */
export const COMPANY_TEXT: Record<Locale, Pick<CompanyText, "memories" | "hireLines">> = {
  en: {
    memories: {
      ysolde: [
        { by: "Ysolde", text: "Ysolde aims at the dark behind your shoulder, then lowers her bow. \"Sorry. Something always comes at you from there. I don't know how I know.\"" },
        { by: "Ysolde", text: "The Dark Forest leans toward you as you pass. \"The trees are saying your name,\" Ysolde says. \"They remember every night. They remember you in them.\"" },
        { by: "Ysolde", text: "\"Mind that root, you always trip on it.\" You have not reached it yet. \"The trees showed me. You have walked this path more times than we can count.\"" },
        { by: "Ysolde", text: "She leads you to a hollow in the moss, shaped like a body. \"You fell here, on a night neither of us remembers. The trees showed me. I was too slow.\"" },
        { by: "Ysolde", text: "\"The trees show me every night you have walked, the ones where you fell too. You always got up and came back. The forest says you never give up.\"" }
      ],
      cendre: [
        { by: "Brother Cinder", text: "Brother Cinder pours two cups before you sit. \"Tea first. An Ember Monk never fights on an empty cup. Violence can wait. It always does.\"" },
        { by: "Brother Cinder", text: "He hands you your cup: honey, no milk. \"That's how you take it. I don't know how I know. We must have shared a fire on some night I have forgotten.\"" },
        { by: "Brother Cinder", text: "He feeds his order's flame, the last memory of the sun, one twig at a time. \"My sister could light it with a look. She wanted it bigger, so she left.\"" },
        { by: "Brother Cinder", text: "\"My sister is Ashka, priestess of the Pyre. If she and I ever walk with you the same night, keep us apart. We would fight, and she would win.\"" },
        { by: "Brother Cinder", text: "\"Tell Ashka the flame is still lit. It means the order still waits for her to come home. It means I do.\"" }
      ],
      nyx: [
        { by: "Nyx", text: "Between two nights you rest in the Sanctum. When you open your eyes, Nyx is sitting on the nearest stone, keeping watch over you. She says nothing." },
        { by: "Nyx", text: "\"...Aldric?\" Nyx says your name from under her hood, like a question. Nobody told her your name tonight. She knows it anyway." },
        { by: "Nyx", text: "By the fire, someone speaks of the Dawn, the morning that would end the Long Night. Nyx's hand goes to her dagger. She fears it more than any Remnant." },
        { by: "Nyx", text: "Nyx turns away and lowers her hood. There is no face under it, only night sky and a few stars. She was woven with the Long Night, like its shadow." },
        { by: "Nyx", text: "\"I am the night's shadow. I am not with you. I am around you, every night you walk.\"" }
      ],
      garrick: [
        { by: "Garrick", text: "Garrick looks you up and down. \"You've got the look of a shard-finder. Squinty. Broke. I dig fallen stars out of the Forgotten Caves. We'll get on.\"" },
        { by: "Garrick", text: "He whispers where he hides his best shards, then panics. \"Why did I tell you that? I tell nobody. Feels like I've trusted you for years. Forget it.\"" },
        { by: "Garrick", text: "Garrick holds a shard up to the sky. It fits a crack in the Sky-Glass exactly. \"They're not fallen stars,\" he says quietly. \"They're pieces of the sky.\"" },
        { by: "Garrick", text: "\"Found a shard once with a face reflected in it. Not a face from Orvane: it was looking in from the other side of the sky. It blinked. I buried it.\"" },
        { by: "Garrick", text: "He digs up the shard with the face, swearing all the way, and gives it to you. \"Keep it. The face has closed its eyes. Seems it trusts you.\"" }
      ],
      seraphine: [
        { by: "Séraphine", text: "Séraphine asks a root who you are. It uncurls and points at you. She frowns. \"It says it knows you. Roots don't lie. So why don't I remember you?\"" },
        { by: "Séraphine", text: "\"The Heart of the Old Grove is expecting you,\" Séraphine says. \"The great tree at the end of the Dark Forest. It has not expected anyone in ages.\"" },
        { by: "Séraphine", text: "At the Old Grove, Séraphine stays at the edge while you fight its Heart. \"Go on. I cannot strike her. I will be here after.\"" },
        { by: "Séraphine", text: "\"The Heart of the Grove was my teacher. On the first night, she asked me to help you cut her down so the night could go on. I said no. She asked again.\"" },
        { by: "Séraphine", text: "\"She thanks you, every night you cut her down.\" Séraphine gives you a warm seed. \"Her last. It cannot grow in this night. It is waiting for a morning.\"" }
      ],
      thorvald: [
        { by: "Thorvald", text: "Thorvald slams his elbow on a barrel. \"Arm-wrestle! Loser carries the pack. Winner too, actually. I just like winning.\"" },
        { by: "Thorvald", text: "Halfway through, he stops. \"Wait. I've lost this to you before, some other night. I never lose twice.\" He loses twice." },
        { by: "Thorvald", text: "A golden rat crosses the road. Thorvald goes pale and hides behind you. \"That's Pip. I owe him. Don't look him in the eye.\"" },
        { by: "Thorvald", text: "\"I bet Pip I could fell a mountain. I felled it. Turns out the bet was that I couldn't. So now I owe a rat a mountain, and he keeps count.\"" },
        { by: "Thorvald", text: "\"If you see Pip, tell him we're even.\" They are not: Thorvald still owes him most of a mountain, and he knows you know." }
      ],
      mirelle: [
        { by: "Mirelle", text: "Mirelle hands you a flask, watches you drink, and writes something down. \"Interesting. Your ears will stop ringing in an hour. Probably.\"" },
        { by: "Mirelle", text: "Her notebook falls open. Your name is on page after page, in her hand. \"Give that back. It seems you've helped me before. I don't remember either.\"" },
        { by: "Mirelle", text: "The notebook is about Baron Osric, her husband: doses, dates, what he said. The Baron of Rot in the Mire is the man she married. She is trying to cure him." },
        { by: "Mirelle", text: "At the Baron's feet she touches your arm. \"Wait. One breath. Let me try this cure on him first.\" She pours. It fails. She nods, and you strike." },
        { by: "Mirelle", text: "She gives you her wedding ring. \"No cure has worked, not on any night. He'd want someone useful to wear it.\"" }
      ],
      kaelen: [
        { by: "Kaelen", text: "Before the Fallen Sentinels, Kaelen stops and salutes. They were the King's guard, like him. They salute back. Then they attack, and he fights." },
        { by: "Kaelen", text: "In the Keep, Kaelen will not look at the throne. He fights the Fallen King with his eyes on the King's boots." },
        { by: "Kaelen", text: "\"I served him,\" Kaelen says, cleaning his blade. \"The King. I was his knight, before the Long Night. He was kind, always. It made everything harder.\"" },
        { by: "Kaelen", text: "\"The night the Long Night was woven, I was meant to be the first to walk it. I ran. King Aldemar walked it in my place. He has not stopped paying for it.\"" },
        { by: "Kaelen", text: "\"Let me strike the last blow against him. Once. He walked the night I ran from. I owe him that.\"" }
      ],
      oriane: [
        { by: "Oriane", text: "\"...a long way to get here,\" Oriane finishes, before you can. She hears the old nights in the caves, and in one of them you already said it." },
        { by: "Oriane", text: "\"...and you are hungry,\" she finishes. You were not going to say that. She knows. She wants to hear you laugh, the way you did on older nights." },
        { by: "Oriane", text: "Oriane counts under her breath as you walk. \"Your nights,\" she says. \"Every night you have walked this road. I hear them all.\" The number is huge." },
        { by: "Oriane", text: "She stops in the middle of a number. \"I have lost count of your nights. I never lose count.\" She does not start again." },
        { by: "Oriane", text: "\"I stopped listening to the old nights. I listen to this one now, with you.\" She gives you a pale shell. \"Keep it. It still hears the old ones.\"" }
      ]
    },
    hireLines: {
      ysolde: [
        "Stand still. There. Now you're not dead.",
        "Stand still. No, you already know where. How do you know where? Have we walked this forest before?",
        "Left of the root, as always. I've got your back. The trees remember you, and so do I, a little."
      ],
      cendre: [
        "Violence is never the answer. It is, however, frequently the question.",
        "Have we had tea before? I feel we have had tea. Honey, was it?",
        "Honey, no milk. Sit, old friend. The road can wait one cup."
      ],
      nyx: ["...", "...You. Again?", "...Aldric."],
      garrick: [
        "Rich! We'll be rich! Well, I will. You'll be employed.",
        "Rich! We'll be... Have I pitched you this before? Feels like I have.",
        "You! Grab a pick. Same cut as always, partner. Small."
      ],
      seraphine: [
        "The roots obey me because I asked nicely. Once.",
        "The roots stirred before you came. They only do that for people they know.",
        "Come. The Grove is expecting you. So was I."
      ],
      thorvald: [
        "Double or nothing!",
        "Double or nothing! Again? Wait, what did I lose to you last time?",
        "Double or nothing, friend. You still owe me a rematch."
      ],
      mirelle: [
        "Drink this. No, don't smell it first.",
        "Drink this. You've had it before? Impossible. I only brewed it tonight.",
        "The notebook's open. Drink, then tell me everything you feel."
      ],
      kaelen: [
        "Stand behind me. No, further.",
        "Stand behind me. Have you always stood there? It feels like you have.",
        "Stand beside me. Just this once. I'd like the company."
      ],
      oriane: [
        "You're about to ask me something. The answer is yes.",
        "You're about to ask me something. I heard you ask it on another night. The answer is still yes.",
        "You are here. Good. I know what you will say, and I want to hear it anyway."
      ]
    }
  },
  fr: {
    memories: {
      ysolde: [
        { by: "Ysolde", text: "Ysolde vise le noir derrière ton épaule, puis baisse son arc. « Pardon. Quelque chose te tombe toujours dessus par là. Je ne sais pas comment je le sais. »" },
        { by: "Ysolde", text: "La Forêt sombre se penche sur ton passage. « Les arbres disent ton nom, souffle Ysolde. Ils se souviennent de chaque nuit. Et de toi, dedans. »" },
        { by: "Ysolde", text: "« Attention à cette racine, tu trébuches toujours dessus. » Tu n'y es pas encore. « Les arbres me l'ont montré. Tu as pris ce sentier plus de fois qu'on ne peut compter. »" },
        { by: "Ysolde", text: "Elle t'emmène vers un creux de mousse en forme de corps. « Tu es tombé ici, une nuit dont aucun de nous ne se souvient. Les arbres me l'ont montré. J'ai été trop lente. »" },
        { by: "Ysolde", text: "« Les arbres me montrent toutes tes nuits, même celles où tu tombes. Tu t'es toujours relevé, tu es toujours revenu. La forêt dit que tu n'abandonnes jamais. »" }
      ],
      cendre: [
        { by: "Frère Cendre", text: "Frère Cendre sert deux tasses avant que tu t'assoies. « Le thé d'abord. Un moine des Braises ne se bat jamais le ventre vide. La violence attendra. Elle attend toujours. »" },
        { by: "Frère Cendre", text: "Il te tend ta tasse : du miel, pas de lait. « C'est comme ça que tu le prends. Je ne sais pas comment je le sais. On a dû partager un feu, une nuit que j'ai oubliée. »" },
        { by: "Frère Cendre", text: "Il nourrit la flamme de son ordre, dernier souvenir du soleil, brindille après brindille. « Ma sœur l'allumait d'un regard. Elle la voulait plus grande, alors elle est partie. »" },
        { by: "Frère Cendre", text: "« Ma sœur, c'est Ashka, prêtresse du Bûcher. Si elle et moi marchons un jour avec toi la même nuit, sépare-nous. On se battrait, et elle gagnerait. »" },
        { by: "Frère Cendre", text: "« Dis à Ashka que la flamme brûle encore. Ça veut dire que l'ordre attend toujours qu'elle rentre. Ça veut dire que moi, je l'attends. »" }
      ],
      nyx: [
        { by: "Nyx", text: "Entre deux nuits, tu te reposes au Sanctuaire. Quand tu rouvres les yeux, Nyx est assise sur la pierre la plus proche et veille sur toi. Elle ne dit rien." },
        { by: "Nyx", text: "« ...Aldric ? » Nyx dit ton nom sous sa capuche, comme une question. Personne ne le lui a appris ce soir. Elle le sait quand même." },
        { by: "Nyx", text: "Près du feu, quelqu'un parle de l'Aube, le matin qui mettrait fin à la Longue Nuit. La main de Nyx va à sa dague. Elle la craint plus que n'importe quel Vestige." },
        { by: "Nyx", text: "Nyx se détourne et abaisse sa capuche. Dessous, pas de visage : un ciel de nuit et quelques étoiles. Elle a été tissée avec la Longue Nuit, comme son ombre." },
        { by: "Nyx", text: "« Je suis l'ombre de la nuit. Je ne suis pas avec toi. Je suis autour de toi, chaque nuit où tu marches. »" }
      ],
      garrick: [
        { by: "Garrick", text: "Garrick te toise. « T'as une tête de chercheur d'éclats. Plissée. Fauchée. Moi, je déterre des étoiles tombées dans les Cavernes oubliées. On va s'entendre. »" },
        { by: "Garrick", text: "Il te souffle où il cache ses plus beaux éclats, puis s'affole. « Pourquoi je t'ai dit ça ? Je ne le dis à personne. On dirait que je te fais confiance depuis des années. Oublie. »" },
        { by: "Garrick", text: "Garrick lève un éclat vers le ciel. Il épouse exactement une fêlure de la Voûte de verre. « C'est pas des étoiles tombées, dit-il tout bas. C'est des morceaux du ciel. »" },
        { by: "Garrick", text: "« Un jour, j'ai trouvé un éclat avec un visage dedans. Pas un visage d'Orvane : il regardait depuis l'autre côté du ciel. Il a cligné. Je l'ai enterré. »" },
        { by: "Garrick", text: "Il déterre l'éclat au visage en jurant tout du long et te le donne. « Garde-le. Le visage a fermé les yeux. Faut croire qu'il te fait confiance. »" }
      ],
      seraphine: [
        { by: "Séraphine", text: "Séraphine demande à une racine qui tu es. Elle te désigne. « Elle dit qu'elle te connaît. Les racines ne mentent pas. Alors pourquoi je ne me souviens pas de toi ? »" },
        { by: "Séraphine", text: "« Le Cœur du vieux bosquet t'attend, dit Séraphine. Le grand arbre au bout de la Forêt sombre. Il n'attendait plus personne depuis longtemps. »" },
        { by: "Séraphine", text: "Au vieux bosquet, Séraphine reste à la lisière pendant que tu affrontes son Cœur. « Vas-y. Moi, je ne peux pas la frapper. Je serai là, après. »" },
        { by: "Séraphine", text: "« Le Cœur du bosquet était mon maître. La première nuit, elle m'a demandé de t'aider à l'abattre, pour que la nuit continue. J'ai dit non. Elle a redemandé. »" },
        { by: "Séraphine", text: "« Elle te remercie, chaque nuit où tu l'abats. » Séraphine te donne une graine tiède. « Sa dernière. Elle ne peut pas pousser dans cette nuit. Elle attend un matin. »" }
      ],
      thorvald: [
        { by: "Thorvald", text: "Thorvald abat son coude sur un tonneau. « Bras de fer ! Le perdant porte le sac. Le gagnant aussi, en fait. Moi, j'aime juste gagner. »" },
        { by: "Thorvald", text: "À mi-partie, il s'arrête. « Attends. J'ai déjà perdu contre toi, une autre nuit. Je ne perds jamais deux fois. » Il perd deux fois." },
        { by: "Thorvald", text: "Un rat doré traverse la route. Thorvald blêmit et se cache derrière toi. « C'est Pip. Je lui dois quelque chose. Le regarde pas dans les yeux. »" },
        { by: "Thorvald", text: "« J'ai parié avec Pip que je pouvais abattre une montagne. Je l'ai abattue. Sauf que le pari, c'était que non. Je dois une montagne à un rat, et il tient les comptes. »" },
        { by: "Thorvald", text: "« Si tu vois Pip, dis-lui qu'on est quittes. » Ils ne le sont pas : Thorvald lui doit encore presque toute une montagne, et il sait que tu le sais." }
      ],
      mirelle: [
        { by: "Mirelle", text: "Mirelle te tend une fiole, te regarde boire et note quelque chose. « Intéressant. Tes oreilles arrêteront de siffler dans une heure. Sans doute. »" },
        { by: "Mirelle", text: "Son carnet tombe ouvert. Ton nom y est, page après page, de sa main. « Rends-moi ça. On dirait que tu m'as déjà aidée. Je ne m'en souviens pas non plus. »" },
        { by: "Mirelle", text: "Le carnet parle du baron Osric, son mari : doses, dates, ce qu'il a dit. Le Baron de la Pourriture, dans le Marais, est l'homme qu'elle a épousé. Elle essaie de le guérir." },
        { by: "Mirelle", text: "Aux pieds du Baron, elle te touche le bras. « Attends. Un souffle. Laisse-moi essayer ce remède sur lui d'abord. » Elle verse. Ça échoue. Elle hoche la tête, et tu frappes." },
        { by: "Mirelle", text: "Elle te donne son alliance. « Aucun remède n'a marché, pas une seule nuit. Il voudrait que quelqu'un d'utile la porte. »" }
      ],
      kaelen: [
        { by: "Kaelen", text: "Devant les Sentinelles déchues, Kaelen s'arrête et salue. C'était la garde du Roi, comme lui. Elles lui rendent son salut. Puis elles attaquent, et il se bat." },
        { by: "Kaelen", text: "Dans le donjon, Kaelen refuse de regarder le trône. Il affronte le Roi déchu les yeux fixés sur ses bottes." },
        { by: "Kaelen", text: "« Je l'ai servi, dit Kaelen en essuyant sa lame. Le Roi. J'étais son chevalier, avant la Longue Nuit. Il était bon, toujours. Ça rendait tout plus difficile. »" },
        { by: "Kaelen", text: "« La nuit où la Longue Nuit fut tissée, c'était à moi de la parcourir le premier. J'ai fui. Le roi Aldemar l'a parcourue à ma place. Il n'a jamais fini de payer pour ça. »" },
        { by: "Kaelen", text: "« Laisse-moi lui porter le dernier coup. Une fois. Il a marché la nuit que j'ai fuie. Je lui dois bien ça. »" }
      ],
      oriane: [
        { by: "Oriane", text: "« ...un long chemin jusqu'ici », achève Oriane avant toi. Elle entend les vieilles nuits dans les cavernes, et dans l'une d'elles, tu l'as déjà dit." },
        { by: "Oriane", text: "« ...et tu as faim », achève-t-elle. Ce n'est pas ce que tu allais dire. Elle le sait. Elle veut t'entendre rire, comme les nuits d'avant." },
        { by: "Oriane", text: "Oriane compte à mi-voix pendant que vous marchez. « Tes nuits, dit-elle. Toutes les nuits où tu as pris cette route. Je les entends toutes. » Le nombre est immense." },
        { by: "Oriane", text: "Elle s'arrête au milieu d'un nombre. « J'ai perdu le compte de tes nuits. Je ne perds jamais le compte. » Elle ne recommence pas." },
        { by: "Oriane", text: "« J'ai cessé d'écouter les vieilles nuits. J'écoute celle-ci, maintenant, avec toi. » Elle te donne un coquillage pâle. « Garde-le. Lui entend encore les anciennes. »" }
      ]
    },
    hireLines: {
      ysolde: [
        "Ne bouge plus. Là. Voilà, tu n'es pas mort.",
        "Ne bouge plus. Non, tu sais déjà où. Comment tu sais où ? On a déjà traversé cette forêt ensemble ?",
        "À gauche de la racine, comme toujours. Je couvre tes arrières. Les arbres se souviennent de toi, et moi aussi, un peu."
      ],
      cendre: [
        "La violence n'est jamais la réponse. C'est, en revanche, très souvent la question.",
        "On a déjà pris le thé ? J'ai l'impression qu'on a déjà pris le thé. Avec du miel, c'est ça ?",
        "Du miel, pas de lait. Assieds-toi, vieil ami. La route attendra une tasse."
      ],
      nyx: ["...", "...Toi. Encore ?", "...Aldric."],
      garrick: [
        "Riches ! On sera riches ! Enfin, moi. Toi, tu seras employé.",
        "Riches ! On sera... Je t'ai déjà fait l'article ? J'ai l'impression que oui.",
        "Toi ! Prends une pioche. Ta part est la même que d'habitude, associé. Petite."
      ],
      seraphine: [
        "Les racines m'obéissent parce que je leur ai demandé gentiment. Une fois.",
        "Les racines ont remué avant ton arrivée. Elles ne font ça que pour les gens qu'elles connaissent.",
        "Viens. Le bosquet t'attend. Moi aussi."
      ],
      thorvald: [
        "Quitte ou double !",
        "Quitte ou double ! Encore ? Attends, j'avais perdu quoi contre toi, la dernière fois ?",
        "Quitte ou double, l'ami. Tu me dois toujours une revanche."
      ],
      mirelle: [
        "Bois ça. Non, ne le sens pas d'abord.",
        "Bois ça. Tu en as déjà bu ? Impossible. Je l'ai préparé ce soir.",
        "Le carnet est ouvert. Bois, puis dis-moi tout ce que tu ressens."
      ],
      kaelen: [
        "Reste derrière moi. Non, plus loin.",
        "Reste derrière moi. Tu t'es toujours tenu là ? On dirait bien.",
        "Reste à côté de moi. Rien que cette fois. J'aimerais la compagnie."
      ],
      oriane: [
        "Tu vas me demander quelque chose. La réponse est oui.",
        "Tu vas me demander quelque chose. Je t'ai entendu le demander, une autre nuit. La réponse est toujours oui.",
        "Tu es là. Bien. Je sais ce que tu vas dire, et je veux l'entendre quand même."
      ]
    }
  }
};
