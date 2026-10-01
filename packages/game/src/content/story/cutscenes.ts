import type { Locale } from "../../i18n";
import type { CutsceneId } from "../../data/cutscenes";
import type { CutsceneText } from "../types";
import { VOICES_TEXT } from "./voices";

/**
 * The Ledger's scenes (BIBLE 12.10): a name for the Hall, and one line per shot, in the
 * order of the shots ("" leaves a shot silent). The King speaks his own Words.
 */
export const CUTSCENES_TEXT: Record<Locale, Record<CutsceneId, CutsceneText>> = {
  en: {
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
    }
  },
  fr: {
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
    }
  }
};
