"use client";

import { useI18n } from "@/i18n/client";
import { Art } from "../pixel/Art";

type PlaceId = "sanctum" | "loom";

/** The pixel scene of a place past the King, cropped to fill its box. */
export function PlaceBanner({ id }: { id: PlaceId }) {
  return <Art spec={{ kind: "place", id }} size="parent" cover className="place-art" />;
}

/** A place's heading: its scene, its name and one line about it. */
export function PlaceHeading({ id }: { id: PlaceId }) {
  const { g } = useI18n();
  const place = g.places[id];
  return (
    <header className={`place-heading place-${id}`}>
      <div className="place-view">
        <PlaceBanner id={id} />
        <span className="place-shade" aria-hidden="true" />
      </div>
      <div className="place-copy">
        <h3>{place.name}</h3>
        <p>{place.description}</p>
      </div>
    </header>
  );
}
