"use client";

import {
  ASCENSION_MIN_STAGE,
  DENSITY_PER_STRATUM,
  DESCENT_MIN_STAGE,
  MAX_STAGE,
  ageForStage,
  biomeForStage,
  bossForStage,
  bossHp,
  eraForStage,
  essencesForStage,
  formatNumber,
  isBiomeBossStage,
  isBossStage,
  roman,
  stageGold,
  stageHp,
  threadsFor
} from "@idlebound/game";
import { useId, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { creatureGate } from "./entryGates";
import { eraStart } from "./gates";
import { Spoiler } from "./Spoiler";

/** What waits at a stage: health, gold, and what a night that deep pays. The game's own formulas. */
export function Calculator() {
  const { t, g, locale } = useI18n();
  const c = t.wiki.calculator;
  const id = useId();
  const [value, setValue] = useState("50");
  const parsed = Math.floor(Number(value));
  const stage = Number.isFinite(parsed) ? Math.min(MAX_STAGE, Math.max(1, parsed)) : 1;
  const era = eraForStage(stage);
  const age = ageForStage(stage);
  const boss = isBossStage(stage) ? bossForStage(stage).id : null;
  const bossGate = boss ? creatureGate(boss) : undefined;
  const essences = essencesForStage(stage);
  const threads = threadsFor(stage);
  const numbers = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US");
  const tag = g.strata.tags[era];

  const rows: { label: string; value: ReactNode }[] = [
    { label: c.biome, value: g.biomes[biomeForStage(stage).id].name },
    {
      label: c.stratum,
      value: era === 0 ? `${g.eraName(era)} · ${t.wiki.table.present}` : <Spoiler gate={{ kind: "stage", stage: eraStart(era) }} inline>{`${g.eraName(era)} · ${tag}`}</Spoiler>
    },
    { label: c.age, value: age === 0 ? `${roman(1)} · ${g.strata.ages[0]}` : <Spoiler gate={{ kind: "stage", stage: eraStart(age * 5) }} inline>{`${roman(age + 1)} · ${g.strata.ages[age]}`}</Spoiler> },
    {
      label: c.boss,
      value: boss
        ? <>{bossGate ? <Spoiler gate={bossGate} inline>{g.monsters[boss]}</Spoiler> : g.monsters[boss]} ({isBiomeBossStage(stage) ? c.guardian : c.elite})</>
        : c.noBoss
    },
    { label: c.monsterHp, value: formatNumber(stageHp(stage)) },
    ...(boss ? [{ label: c.bossHp, value: formatNumber(bossHp(stage)) }] : []),
    { label: c.gold, value: formatNumber(stageGold(stage)) },
    { label: c.essences, value: essences > 0 ? formatNumber(essences) : c.essencesNone(ASCENSION_MIN_STAGE - 1) },
    { label: c.threads, value: threads > 0 ? numbers.format(threads) : c.threadsNone(numbers.format(DESCENT_MIN_STAGE)) },
    { label: c.density, value: `×${formatNumber(Math.pow(1 + DENSITY_PER_STRATUM, era))}` }
  ];

  return (
    <div className="wiki-calc">
      <div className="field">
        <label htmlFor={id}>{c.label}</label>
        <input id={id} className="input" type="number" inputMode="numeric" min={1} max={MAX_STAGE} value={value} onChange={(event) => setValue(event.target.value)} />
        <span className="field-hint">{c.hint(numbers.format(MAX_STAGE))}</span>
      </div>
      <p className="visually-hidden" aria-live="polite">{c.summary(numbers.format(stage), formatNumber(stageHp(stage)), formatNumber(stageGold(stage)))}</p>
      <dl className="wiki-calc-out">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
