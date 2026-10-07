/**
 * Deterministic maths: `pow`, `exp` and the logarithms written with the basic operations
 * alone (+, -, *, /, which IEEE 754 rounds the same way on every engine). `Math.pow`,
 * `Math.exp` and `Math.log` are left to each engine and may differ in the last bit between
 * browsers; the server replays the game (see `replay.ts`) and must land on the same numbers
 * as the device that played it, so every formula that makes an outcome uses these instead.
 */

const LN2_HI = 6.93147180369123816490e-1;
const LN2_LO = 1.90821492927058770002e-10;
const LN2 = 0.6931471805599453;
const LN10 = 2.302585092994046;
const SQRT_HALF = 0.7071067811865476;
const TWO_52 = 4503599627370496;

const view = new DataView(new ArrayBuffer(8));

/** 2^k exactly, for an integer k in the normal range [-1022, 1023]. */
function powerOfTwo(k: number): number {
  view.setUint32(0, (k + 1023) << 20);
  view.setUint32(4, 0);
  return view.getFloat64(0);
}

/** `value` times 2^k, exact while the result stays a normal number. */
function scale2(value: number, k: number): number {
  let result = value;
  let left = k;
  while (left > 1023) {
    result *= powerOfTwo(1023);
    left -= 1023;
    if (!Number.isFinite(result)) return result;
  }
  while (left < -1022) {
    result *= powerOfTwo(-1022);
    left += 1022;
    if (result === 0) return result;
  }
  return result * powerOfTwo(left);
}

/** Splits a positive finite `x` into m * 2^e, m in [sqrt(1/2), sqrt(2)). */
function split(x: number): [number, number] {
  let value = x;
  let bias = 0;
  // Subnormals: bring them into the normal range first (exact).
  if (value < 2.2250738585072014e-308) {
    value *= TWO_52;
    bias = -52;
  }
  view.setFloat64(0, value);
  const high = view.getUint32(0);
  let exponent = ((high >>> 20) & 0x7ff) - 1023;
  view.setUint32(0, (high & 0x800fffff) | (1023 << 20));
  let mantissa = view.getFloat64(0);
  if (mantissa >= 2 * SQRT_HALF) {
    mantissa /= 2;
    exponent += 1;
  }
  return [mantissa, exponent + bias];
}

/** Natural logarithm. */
export function log(x: number): number {
  if (Number.isNaN(x) || x < 0) return NaN;
  if (x === 0) return -Infinity;
  if (x === Infinity) return Infinity;
  if (x === 1) return 0;
  const [m, e] = split(x);
  // log(m) = 2 atanh(s), s = (m - 1) / (m + 1), |s| <= 0.1716: the series converges fast.
  const s = (m - 1) / (m + 1);
  const s2 = s * s;
  let term = 1 / 25;
  for (let n = 23; n >= 1; n -= 2) term = 1 / n + s2 * term;
  const lm = 2 * s * term;
  return e * LN2_HI + (lm + e * LN2_LO);
}

/** e^x. */
export function exp(x: number): number {
  if (Number.isNaN(x)) return NaN;
  if (x > 709.8) return Infinity;
  if (x < -745.2) return 0;
  if (x === 0) return 1;
  const k = Math.round(x / LN2);
  const r = x - k * LN2_HI - k * LN2_LO;
  // |r| <= 0.35: the Taylor series to r^18 is exact to the last bit.
  let sum = 1;
  for (let n = 18; n >= 1; n -= 1) sum = 1 + (r * sum) / n;
  return scale2(sum, k);
}

/** x^n for an integer n, by squaring: exact for powers of two, and the same everywhere. */
function powInt(x: number, n: number): number {
  let base = n < 0 ? 1 / x : x;
  let left = Math.abs(n);
  let result = 1;
  while (left > 0) {
    if (left % 2 === 1) result *= base;
    left = Math.floor(left / 2);
    if (left > 0) base *= base;
  }
  return result;
}

/** x^y. */
export function pow(x: number, y: number): number {
  if (y === 0) return 1;
  if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
  if (x === 1) return 1;
  if (Number.isInteger(y) && Math.abs(y) <= 2 ** 31) return powInt(x, y);
  if (x < 0) return NaN;
  if (x === 0) return y > 0 ? 0 : Infinity;
  if (x === Infinity) return y > 0 ? Infinity : 0;
  // The whole part by squaring, the rest through the logarithm: the error stays that of a
  // few products, not that of y * log(x) for a large y.
  const whole = Math.floor(y);
  return powInt(x, whole) * exp((y - whole) * log(x));
}

/** log(1 + x), precise for small x. */
export function log1p(x: number): number {
  if (Number.isNaN(x) || x < -1) return NaN;
  if (x === -1) return -Infinity;
  if (x === Infinity) return Infinity;
  const u = 1 + x;
  if (u === 1) return x;
  return (log(u) * x) / (u - 1);
}

/** log10(x), exact on the powers of ten a double holds exactly. */
export function log10(x: number): number {
  const value = log(x) / LN10;
  const n = Math.round(value);
  if (Math.abs(value - n) < 1e-9 && n >= 0 && n <= 22 && powInt(10, n) === x) return n;
  return value;
}

/** log2(x), exact on the powers of two. */
export function log2(x: number): number {
  if (x > 0 && Number.isFinite(x)) {
    const [m, e] = split(x);
    if (m === 1) return e;
  }
  return log(x) / LN2;
}
