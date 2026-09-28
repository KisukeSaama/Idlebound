import { C, type Material } from "../../palette";

/**
 * Skins of the companion portraits, darkest first; the last step is where the light falls.
 * Portraits share them so a company of twenty keeps one light.
 */
export const SKINS = {
  light: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
  dark: { ramp: [C.night3, C.flesh0, C.fur1, C.fur2, C.fur3], texture: "smooth" }
} as const satisfies Record<string, Material>;
