import { deflateSync } from "node:zlib";
import type { Bitmap } from "@/game/pixel/pixels";

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  out.set(data, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** A truecolor PNG of an opaque bitmap (server only: the generated share pictures). */
export function encodePng(bitmap: Bitmap): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(bitmap.w, 0);
  header.writeUInt32BE(bitmap.h, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // RGB
  const rows = Buffer.alloc((bitmap.w * 3 + 1) * bitmap.h);
  for (let y = 0; y < bitmap.h; y += 1) {
    const start = y * (bitmap.w * 3 + 1);
    for (let x = 0; x < bitmap.w; x += 1) {
      const from = (y * bitmap.w + x) * 4;
      rows.set(bitmap.data.subarray(from, from + 3), start + 1 + x * 3);
    }
  }
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", header), chunk("IDAT", deflateSync(rows, { level: 9 })), chunk("IEND", new Uint8Array())]);
}
