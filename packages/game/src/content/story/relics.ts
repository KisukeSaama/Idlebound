import type { Locale } from "../../i18n";
import { COOLDOWN_FLOOR } from "../../data/relics";
import { PLACE_SPOILS, PLACE_TREASURE } from "../../data/traits";
import type { RelicsText } from "../types";

/** What relics remember (BIBLE 11): their traits, who carried them, where they come from. */

const p = (value: number) => Math.round(value * 100);
/** A point of chance, to a tenth when it has one (0.3, 1, 2.5). */
const points = (value: number, decimal: string) => String(Math.round(value * 1000) / 10).replace(".", decimal);
const times = (value: number, decimal: string) => `×${String(Math.round(value * 100) / 100).replace(".", decimal)}`;
const COOLDOWN_CAP = p(1 - COOLDOWN_FLOOR);

const en: RelicsText = {
  traits: {
    vanguard: { name: "Vanguard", effect: (v) => `Companion damage ${times(v, ".")}` },
    host: { name: "The Host", effect: (v) => `+${points(v, ".")}% companion damage for every companion in the company` },
    rout: { name: "Rout", effect: (v) => `On a stage below your record, when your company fells each monster in under ${String(v)} s, the whole stage falls at once (0.1 s without this trait)` },
    rhythm: { name: "Steady Rhythm", effect: (v) => `Patience bonus ${times(v, ".")} (your company's lasting damage bonus)` },
    bulwark: { name: "Bulwark", effect: (v) => `+${v} s to beat elites and guardians` },
    scars: { name: "Old Scars", effect: (v) => `An elite or a guardian that pushes you back keeps up to ${p(v)}% of its wounds at any depth (never the King)` },
    spoils: { name: "Spoils", effect: (v) => `+${p(v)} points of chance that a guardian leaves a relic (half as much for an elite)` },
    skyglass: { name: "Skyglass", effect: (v) => `Guardians leave ${times(v, ".")} shards` },
    regicide: { name: "Regicide", effect: (v) => `${times(v, ".")} damage to the King (every 50th stage)` },
    attention: { name: "Attention", effect: (v) => `Wandering crystals come ${p(v)}% sooner` },
    breath: { name: "Second Breath", effect: (v) => `Powers recharge ${p(v)}% faster (${COOLDOWN_CAP}% at most, with every other help)` },
    edge: { name: "Keen Edge", effect: (v) => `Strike damage ${times(v, ".")}` },
    pip: { name: "Pip's Friend", effect: (v) => `+${points(v, ".")} ${v === 0.01 ? "point" : "points"} of chance to meet a golden rat (within its cap)` },
    storm: { name: "Storm Caller", effect: (v) => `1 wandering crystal in ${Math.round(1 / v)} is a Crystal Storm (1 in 20 without)` },
    fortune: { name: "Fortune", effect: (v) => `Gold earned ${times(v, ".")}` },
    homecoming: { name: "Homecoming", effect: (v) => `Reunion (back after 30 min or more away): companion damage ${times(v, ".")} instead of ×3` },
    star: { name: "Lucky Star", effect: (v) => `Legendaries and mythics ${times(v, ".")} as likely from guardians, elites, Seams and the satchel` },
    satchel: { name: "Deep Satchel", effect: (v) => `The company's satchel keeps ${v} more ${v > 1 ? "relics" : "relic"}` },
    vigil: { name: "Vigil", effect: (v) => `Your company walks ${v === 1 ? "an hour" : `${String(v)} h`} more while you are away (8 h without)` }
  },
  memory: (hero, mult) => `Carried by ${hero}: ${hero} deals ${times(mult, ".")} damage while you wear it`,
  places: {
    hearthfields: { name: "Plains set", two: (v) => `Gold earned ${times(v, ".")}`, four: (v) => `Gold earned ${times(v, ".")}, +${points(PLACE_TREASURE, ".")} point of chance to meet a golden rat` },
    wychwood: { name: "Grove set", two: (v) => `Patience bonus ${times(v, ".")}`, four: (v) => `Patience bonus ${times(v, ".")}` },
    deepvaults: { name: "Depths set", two: (v) => `Guardians leave ${times(v, ".")} shards`, four: (v) => `Guardians leave ${times(v, ".")} shards, +${p(PLACE_SPOILS)} points of chance to leave a relic` },
    mire: { name: "Mire set", two: (v) => `+${v} s to beat elites and guardians`, four: (v) => `+${v} s to beat elites and guardians` },
    keep: { name: "Crown set", two: (v) => `${times(v, ".")} damage to the King`, four: (v) => `${times(v, ".")} damage to the King` }
  }
};

const fr: RelicsText = {
  traits: {
    vanguard: { name: "Avant-garde", effect: (v) => `Dégâts des compagnons ${times(v, ",")}` },
    host: { name: "La Troupe", effect: (v) => `+${points(v, ",")} % de dégâts des compagnons par compagnon dans la compagnie` },
    rout: { name: "Débandade", effect: (v) => `Sur une étape sous ton record, si ta compagnie abat chaque monstre en moins de ${String(v).replace(".", ",")} s, l'étape entière tombe d'un coup (0,1 s sans ce trait)` },
    rhythm: { name: "Cadence", effect: (v) => `Bonus de Patience ${times(v, ",")} (le bonus de dégâts permanent de ta compagnie)` },
    bulwark: { name: "Rempart", effect: (v) => `+${v} s pour abattre les élites et les gardiens` },
    scars: { name: "Vieilles cicatrices", effect: (v) => `Une élite ou un gardien qui te repousse garde jusqu'à ${p(v)} % de ses blessures à toute profondeur (jamais le Roi)` },
    spoils: { name: "Trophées", effect: (v) => `+${p(v)} points de chance qu'un gardien laisse une relique (moitié moins pour une élite)` },
    skyglass: { name: "Verre du ciel", effect: (v) => `Les gardiens laissent ${times(v, ",")} éclats` },
    regicide: { name: "Régicide", effect: (v) => `${times(v, ",")} dégâts contre le Roi (toutes les 50 étapes)` },
    attention: { name: "Attention", effect: (v) => `Les cristaux errants viennent ${p(v)} % plus tôt` },
    breath: { name: "Second souffle", effect: (v) => `Les pouvoirs se rechargent ${p(v)} % plus vite (${COOLDOWN_CAP} % au plus, avec toutes les autres aides)` },
    edge: { name: "Tranchant", effect: (v) => `Dégâts de frappe ${times(v, ",")}` },
    pip: { name: "Ami de Messire Pip", effect: (v) => `+${points(v, ",")} ${v >= 0.02 ? "points" : "point"} de chance de croiser un rat doré (dans son plafond)` },
    storm: { name: "Appel de l'averse", effect: (v) => `1 cristal errant sur ${Math.round(1 / v)} est une Averse de cristaux (1 sur 20 sans)` },
    fortune: { name: "Fortune", effect: (v) => `Or gagné ${times(v, ",")}` },
    homecoming: { name: "Retour au feu", effect: (v) => `Retrouvailles (ton retour après 30 min ou plus d'absence) : dégâts des compagnons ${times(v, ",")} au lieu de ×3` },
    star: { name: "Bonne étoile", effect: (v) => `Légendaires et mythiques ${times(v, ",")} plus probables chez les gardiens, les élites, les Brèches et dans la besace` },
    satchel: { name: "Besace profonde", effect: (v) => `La besace de la compagnie garde ${v} ${v > 1 ? "reliques" : "relique"} de plus` },
    vigil: { name: "Veille", effect: (v) => `Ta compagnie marche ${v === 1 ? "une heure" : `${String(v).replace(".", ",")} h`} de plus pendant ton absence (8 h sans)` }
  },
  memory: (hero, mult) => `Portée par ${hero} : ${hero} inflige ${times(mult, ",")} dégâts tant que tu la portes`,
  places: {
    hearthfields: { name: "Parure des plaines", two: (v) => `Or gagné ${times(v, ",")}`, four: (v) => `Or gagné ${times(v, ",")}, +${points(PLACE_TREASURE, ",")} point de chance de croiser un rat doré` },
    wychwood: { name: "Parure sylvestre", two: (v) => `Bonus de Patience ${times(v, ",")}`, four: (v) => `Bonus de Patience ${times(v, ",")}` },
    deepvaults: { name: "Parure des profondeurs", two: (v) => `Les gardiens laissent ${times(v, ",")} éclats`, four: (v) => `Les gardiens laissent ${times(v, ",")} éclats, +${p(PLACE_SPOILS)} points de chance de laisser une relique` },
    mire: { name: "Parure fangeuse", two: (v) => `+${v} s pour abattre les élites et les gardiens`, four: (v) => `+${v} s pour abattre les élites et les gardiens` },
    keep: { name: "Parure royale", two: (v) => `${times(v, ",")} dégâts contre le Roi`, four: (v) => `${times(v, ",")} dégâts contre le Roi` }
  }
};

export const RELICS_TEXT: Record<Locale, RelicsText> = { en, fr };
