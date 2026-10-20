import { writeFileSync } from "node:fs";
import { CREATURE_RECIPES } from "@idlebound/game/art";
import { renderCreature } from "../src/game/pixel/creature";
import { toRgba } from "../src/game/pixel/pixels";
import { encodePng } from "./png";

const [out, erasArg, idsArg] = process.argv.slice(2);
const eras = erasArg.split(",").map(Number);
const ids = idsArg ? idsArg.split(",") : Object.keys(CREATURE_RECIPES);
const sprites = ids.map((id) => eras.map((era) => renderCreature(id, { era }).pixels));
const cw = Math.max(...sprites.flat().map((p) => p.w)) + 4;
const ch = Math.max(...sprites.flat().map((p) => p.h)) + 4;
const S = 2;
const W = cw * eras.length * S, H = ch * ids.length * S;
const data = new Uint8Array(W * H * 4);
for (let i = 0; i < W * H; i++) data.set([38, 46, 72, 255], i * 4);
sprites.forEach((row, r) => row.forEach((px, c) => {
  const rgba = toRgba(px);
  for (let y = 0; y < px.h * S; y++) for (let x = 0; x < px.w * S; x++) {
    const f = (Math.floor(y / S) * px.w + Math.floor(x / S)) * 4;
    if (rgba.data[f + 3] < 128) continue;
    const t = ((r * ch * S + y) * W + c * cw * S + x) * 4;
    data.set([rgba.data[f], rgba.data[f + 1], rgba.data[f + 2], 255], t);
  }
}));
writeFileSync(out, encodePng({ width: W, height: H, data }));
console.log(ids.length, "creatures", W, "x", H);
