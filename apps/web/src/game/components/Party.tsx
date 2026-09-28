"use client";

import { CLICK_HERO_ID, HEROES } from "@idlebound/game";
import type { CSSProperties } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { PixelSprite } from "../pixel/PixelSprite";
import { awakenedSeed, portraitSource } from "../pixel/sources";

/** Companions shown in the scene (the strongest ones; fewer on small screens, see CSS). */
const PARTY_SIZE = 5;

/**
 * The companions fighting beside the player, in the scene: one pixel portrait medallion per
 * companion, the strongest at the bottom. When a companion strikes, FxLayer makes its medallion lunge and
 * fire a shot in its color at the monster, so every hit has a visible author. Decorative:
 * the companions panel carries the information, and clicks go through to the arena.
 */
export function Party() {
  const { state, derived } = useGame();
  const { locale } = useI18n();
  const seed = awakenedSeed(state.settings.notation, state.settings.sound, locale);
  const members = HEROES
    .filter((hero) => hero.id !== CLICK_HERO_ID && (derived.heroDps[hero.id] ?? 0) > 0)
    .sort((a, b) => (derived.heroDps[b.id] ?? 0) - (derived.heroDps[a.id] ?? 0))
    .slice(0, PARTY_SIZE);
  if (members.length === 0) return null;
  return (
    <ul className="party" aria-hidden="true">
      {members.map((hero) => (
        <li key={hero.id} className="party-member" data-hero={hero.id} style={{ "--hero": hero.color } as CSSProperties}>
          <span className="medallion-clip"><PixelSprite source={portraitSource(hero.id, hero.id === "awakened" ? seed : undefined)} size={34} cover /></span>
        </li>
      ))}
    </ul>
  );
}
