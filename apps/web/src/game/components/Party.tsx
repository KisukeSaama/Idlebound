"use client";

import { CLICK_HERO_ID, HEROES, HERO_BY_ID } from "@idlebound/game";
import type { CSSProperties } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { Picto } from "../icons";
import { PixelSprite } from "../pixel/PixelSprite";
import { awakenedSeed, portraitSource } from "../pixel/sources";
import { promiseStatus } from "../windows/PromiseTab";

/** Companions shown in the scene (the strongest ones; fewer on small screens, see CSS). */
const PARTY_SIZE = 5;

/**
 * The companions fighting beside the player, in the scene: one pixel portrait medallion per
 * companion, the strongest at the bottom. When a companion strikes, FxLayer makes its medallion lunge and
 * fire a shot in its color at the monster, so every hit has a visible author. Decorative:
 * the companions panel carries the information, and clicks go through to the arena.
 * The companion who has the walker's word for the night stands first, a knot on the medallion,
 * whether they fight or not: the promise stays in sight with the panel folded.
 */
export function Party() {
  const { state, derived } = useGame();
  const { locale } = useI18n();
  const seed = awakenedSeed(state.settings.notation, state.settings.sound, locale);
  const promised = state.trail.promise ? HERO_BY_ID[state.trail.promise.hero] : undefined;
  const status = promiseStatus(state);
  const strongest = HEROES
    .filter((hero) => hero.id !== CLICK_HERO_ID && hero !== promised && (derived.heroDps[hero.id] ?? 0) > 0)
    .sort((a, b) => (derived.heroDps[b.id] ?? 0) - (derived.heroDps[a.id] ?? 0));
  const members = promised ? [promised, ...strongest.slice(0, PARTY_SIZE - 1)] : strongest.slice(0, PARTY_SIZE);
  if (members.length === 0) return null;
  return (
    <ul className="party" aria-hidden="true">
      {members.map((hero) => (
        <li
          key={hero.id}
          className={`party-member${hero === promised && status ? ` has-promise promise-${status}` : ""}${(derived.heroDps[hero.id] ?? 0) > 0 ? "" : " is-absent"}`}
          data-hero={hero.id}
          style={{ "--hero": hero.color } as CSSProperties}
        >
          <span className="medallion-clip"><PixelSprite source={portraitSource(hero.id, hero.id === "awakened" ? seed : undefined)} size={42} nearest /></span>
          {hero === promised && status ? <span className="medallion-promise"><Picto name={status === "broken" ? "frayed" : "knot"} size={12} /></span> : null}
        </li>
      ))}
    </ul>
  );
}
