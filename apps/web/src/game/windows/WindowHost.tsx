"use client";

import type { WindowId } from "../context";
import { AccountWindow } from "./AccountWindow";
import { AscensionWindow } from "./AscensionWindow";
import { GearWindow } from "./GearWindow";
import { HallWindow } from "./HallWindow";
import { MapWindow } from "./MapWindow";
import { MarketWindow } from "./MarketWindow";
import { SettingsWindow } from "./SettingsWindow";

export function WindowHost({ id, tab, onClose }: { id: WindowId; tab?: string; onClose: () => void }) {
  switch (id) {
    case "map": return <MapWindow onClose={onClose} />;
    case "gear": return <GearWindow onClose={onClose} initialTab="equipped" />;
    case "inventory": return <GearWindow onClose={onClose} initialTab="bag" />;
    case "market": return <MarketWindow onClose={onClose} />;
    case "ascension": return <AscensionWindow onClose={onClose} initialTab={tab} />;
    case "hall": return <HallWindow onClose={onClose} initialTab={tab} />;
    case "account": return <AccountWindow onClose={onClose} />;
    case "settings": return <SettingsWindow onClose={onClose} />;
  }
}
