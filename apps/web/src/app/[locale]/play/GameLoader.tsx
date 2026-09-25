"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/i18n/client";

function Loading() {
  const { t } = useI18n();
  return (
    <div className="game-loading" role="status">
      <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      <div className="game-loading-bar" aria-hidden="true"><span /></div>
      <p>{t.site.play.loading}</p>
    </div>
  );
}

// The game runs in the browser (clock, audio, animations): no server rendering.
const GameApp = dynamic(() => import("@/game/GameApp"), { ssr: false, loading: () => <Loading /> });

export function GameLoader() {
  return <GameApp />;
}
