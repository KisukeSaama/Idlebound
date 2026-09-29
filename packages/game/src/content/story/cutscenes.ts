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
        "Night one. The walker reached the top of the stairs.",
        VOICES_TEXT.en.kingWords[0],
        "The night went up in small violet lights. They hummed.",
        "On a hill that is not there at night, thirteen stones were waiting.",
        "Dusk again."
      ]
    },
    almost: {
      name: "Almost",
      lines: [
        "Dusk again. Nobody on the road knew the walker.",
        "You again? No. I'd remember. Wouldn't I?",
        "All the way to the first fence post, she kept looking back."
      ]
    },
    "empty-throne": {
      name: "The Empty Throne",
      lines: [
        "Night thirteen. The King spoke before the walker raised the sword.",
        VOICES_TEXT.en.kingWords[12],
        "Behind him stood the throne. Its arms were worn smooth, the way a step wears."
      ]
    }
  },
  fr: {
    "first-dusk": {
      name: "Le Premier Crépuscule",
      lines: [
        "Première nuit. Le marcheur atteignit le haut des marches.",
        VOICES_TEXT.fr.kingWords[0],
        "La nuit monta en petites lumières violettes. Elles bourdonnaient.",
        "Sur une colline qui n'existe pas la nuit, treize pierres attendaient.",
        "Le crépuscule, encore."
      ]
    },
    almost: {
      name: "Presque",
      lines: [
        "Le crépuscule, encore. Sur la route, personne ne connaissait le marcheur.",
        "Encore toi ? Non. Je m'en souviendrais. Pas vrai ?",
        "Jusqu'au premier piquet de clôture, elle ne cessa de se retourner."
      ]
    },
    "empty-throne": {
      name: "Le Trône vide",
      lines: [
        "Treizième nuit. Le Roi parla avant que le marcheur ne lève l'épée.",
        VOICES_TEXT.fr.kingWords[12],
        "Derrière lui, le trône. Ses accoudoirs étaient usés, comme s'use une marche."
      ]
    }
  }
};
