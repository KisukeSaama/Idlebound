"use client";

import { CLICK_HERO_ID, HEROES } from "@idlebound/game";
import type { CSSProperties } from "react";
import { useGame } from "../context";
import { TEXT_PRESENTATION } from "../icons";

/** Companions shown in the scene (the strongest ones; fewer on small screens, see CSS). */
const PARTY_SIZE = 5;

/**
 * The companions fighting beside the player, in the scene: one medallion per companion, the
 * strongest at the bottom. FxLayer makes a medallion lunge when that companion strikes, so
 * each colored slash has a visible author. Decorative: the companions panel carries the
 * information, and clicks go through to the arena.
 */
export function Party() {
  const { derived } = useGame();
  const members = HEROES
    .filter((hero) => hero.id !== CLICK_HERO_ID && (derived.heroDps[hero.id] ?? 0) > 0)
    .sort((a, b) => (derived.heroDps[b.id] ?? 0) - (derived.heroDps[a.id] ?? 0))
    .slice(0, PARTY_SIZE);
  if (members.length === 0) return null;
  return (
    <ul className="party" aria-hidden="true">
      {members.map((hero) => (
        <li key={hero.id} className="party-member" data-hero={hero.id} style={{ "--hero": hero.color } as CSSProperties}>
          <span className="hero-glyph">{hero.glyph}{TEXT_PRESENTATION}</span>
        </li>
      ))}
    </ul>
  );
}
