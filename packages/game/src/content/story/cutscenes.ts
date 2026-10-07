import type { Locale } from "../../i18n";
import type { CutsceneId } from "../../data/cutscenes";
import type { CutsceneText } from "../types";
import { STRATA_TEXT } from "./strata";
import { VOICES_TEXT } from "./voices";

/**
 * The Ledger's scenes (BIBLE 12.10): a name for the Hall, and the lines the scene says, in
 * the order it says them. The King speaks his own Words, and a scene set where a keystone
 * lies says that keystone, word for word.
 */
const keystone = (locale: Locale, era: number) => STRATA_TEXT[locale].keystones[era].text;

export const CUTSCENES_TEXT: Record<Locale, Record<CutsceneId, CutsceneText>> = {
  en: {
    prologue: {
      name: "The Long Night",
      lines: [
        "Orvane was a small kingdom of fields, woods and mines. For longer than anyone can count, it has lived the same night.",
        "At the end of the road, in his Keep, the Fallen King waits. Every night, someone walks the whole road to him.",
        "Dusk again."
      ]
    },
    "first-dusk": {
      name: "The First Dusk",
      lines: [
        "Night one. The walker climbed to the top of the Keep and faced the Fallen King.",
        VOICES_TEXT.en.kingWords[0],
        "As he fell, the night came apart into violet lights: essences, the memory of everything the walker lived.",
        "The walker woke in the Sanctum of Dusk, a hill of thirteen stones that stands between two nights.",
        "Dusk again. The night starts over from the first field, and at its end the King will be waiting."
      ]
    },
    almost: {
      name: "Almost",
      lines: [
        "Dusk again. At every dusk the company forgets. Nobody on the road knew the walker.",
        "You again? No. I'd remember. Wouldn't I?",
        "Maëlle kept looking back all the way to the first fence post. She almost remembered."
      ]
    },
    "empty-throne": {
      name: "The Empty Throne",
      lines: [
        "Night thirteen. The King spoke before the walker raised the sword.",
        VOICES_TEXT.en.kingWords[12],
        "The Fallen King was the first walker. He sat down on his throne to rest, and the crown never let him up."
      ]
    },
    "rime-crown": {
      name: "The Crown in the Ice",
      lines: [
        "Stage 500. Where the King had fallen, the rime had covered the floor of his hall.",
        "Under the ice lay a crown. It was smaller than his, and far older.",
        keystone("en", 9),
        "There were other kings before him. The walker went on."
      ]
    },
    rehearsal: {
      name: "The Rehearsal",
      lines: [
        "Stage 1000. Over the Keep, the sky came alight, pale and moving, like cloth in the wind.",
        "For a moment the walker thought it was the Dawn, and that the night was over.",
        keystone("en", 19)
      ]
    },
    loom: {
      name: "The Loom",
      lines: [
        "The first Descent. Below every stratum, the walker came to a quiet room. A great loom stood in it.",
        "Eldra sat at the loom. On its beam the cloth was the night itself, its stars woven in.",
        "Mind the threads. Every one of them is a night someone walked."
      ]
    },
    threshold: {
      name: "The Threshold",
      lines: [
        "Stage 2000. The King did not rise to fight. He slept on his throne, and the whole night was drowsy around him.",
        "The walker struck all the same. The King did not wake as he went.",
        keystone("en", 39)
      ]
    },
    beneath: {
      name: "Beneath the Light",
      lines: [
        "Stage 3000. Where the King should have stood, there was only a thin line of pale light.",
        keystone("en", 59),
        "Below the Dawn the night began again, from its first field. The walker went down into it."
      ]
    }
  },
  fr: {
    prologue: {
      name: "La Longue Nuit",
      lines: [
        "Orvane était un petit royaume de champs, de bois et de mines. Depuis plus longtemps qu'on ne sait compter, il vit la même nuit.",
        "Au bout de la route, dans son donjon, le Roi déchu attend. Chaque nuit, quelqu'un fait toute la route jusqu'à lui.",
        "Le crépuscule, encore."
      ]
    },
    "first-dusk": {
      name: "Le Premier Crépuscule",
      lines: [
        "Première nuit. Le marcheur monta au sommet du donjon et fit face au Roi déchu.",
        VOICES_TEXT.fr.kingWords[0],
        "Quand il tomba, la nuit se défit en lumières violettes : des essences, le souvenir de tout ce que le marcheur avait vécu.",
        "Le marcheur s'éveilla au Sanctuaire du Crépuscule, une colline de treize pierres dressée entre deux nuits.",
        "Le crépuscule, encore. La nuit reprend au premier champ, et au bout, le Roi attendra."
      ]
    },
    almost: {
      name: "Presque",
      lines: [
        "Le crépuscule, encore. À chaque crépuscule, la compagnie oublie. Sur la route, personne ne connaissait le marcheur.",
        "Encore toi ? Non. Je m'en souviendrais. Pas vrai ?",
        "Jusqu'au premier piquet de clôture, Maëlle ne cessa de se retourner. Elle s'en souvenait presque."
      ]
    },
    "empty-throne": {
      name: "Le Trône vide",
      lines: [
        "Treizième nuit. Le Roi parla avant que le marcheur ne lève l'épée.",
        VOICES_TEXT.fr.kingWords[12],
        "Le Roi déchu fut le premier marcheur. Il s'assit sur son trône pour se reposer, et la couronne ne le laissa plus se lever."
      ]
    },
    "rime-crown": {
      name: "La Couronne dans la glace",
      lines: [
        "Étape 500. Là où le Roi était tombé, le givre avait recouvert le sol de sa salle.",
        "Sous la glace dormait une couronne. Plus petite que la sienne, et bien plus vieille.",
        keystone("fr", 9),
        "Il y avait eu d'autres rois avant lui. Le marcheur reprit la route."
      ]
    },
    rehearsal: {
      name: "La Répétition",
      lines: [
        "Étape 1000. Au-dessus du donjon, le ciel s'alluma, pâle et mouvant, comme une étoffe dans le vent.",
        "Un instant, le marcheur crut que c'était l'Aube, et que la nuit était finie.",
        keystone("fr", 19)
      ]
    },
    loom: {
      name: "Le Métier",
      lines: [
        "Première Descente. Sous toutes les strates, le marcheur trouva une pièce silencieuse. Un grand métier à tisser s'y dressait.",
        "Eldra y était assise. Sur l'ensouple, l'étoffe était la nuit elle-même, ses étoiles tissées dedans.",
        "Fais attention aux fils. Chacun est une nuit que quelqu'un a marchée."
      ]
    },
    threshold: {
      name: "Le Seuil",
      lines: [
        "Étape 2000. Le Roi ne se leva pas pour combattre. Il dormait sur son trône, et toute la nuit somnolait autour de lui.",
        "Le marcheur frappa quand même. Le Roi ne se réveilla pas en partant.",
        keystone("fr", 39)
      ]
    },
    beneath: {
      name: "Sous la lumière",
      lines: [
        "Étape 3000. Là où le Roi aurait dû se tenir, il n'y avait qu'une mince ligne de lumière pâle.",
        keystone("fr", 59),
        "Sous l'Aube, la nuit recommençait, depuis son premier champ. Le marcheur y descendit."
      ]
    }
  }
};
