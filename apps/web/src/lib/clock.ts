/**
 * The game's clock: the server's time, carried forward by the page's own steady clock.
 *
 * The device's clock can be wrong, set back or set ahead; the server measures every save on
 * its own, so the game keeps time the server's way. Each answer of the API says the server's
 * time (`SERVER_TIME_HEADER`); between two answers `performance.now()` counts on, untouched
 * by any change of the device's clock. Before the first answer, the device's clock stands in.
 */
export const SERVER_TIME_HEADER = "x-server-time";

/** Below this, a new reading is the network's jitter, not a clock gone wrong. */
const DRIFT_MS = 1_500;

let anchor: { server: number; steady: number } | null = null;

function steady(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

/** Now, on the game's clock (ms since the epoch). */
export function gameNow(): number {
  return anchor ? Math.round(anchor.server + steady() - anchor.steady) : Date.now();
}

/**
 * The server's time read on an answer, for a request sent at `sentAt` (steady clock): the
 * answer left the server about halfway through the round trip.
 */
export function noteServerTime(header: string | null, sentAt: number) {
  const server = Number(header);
  if (!header || !Number.isFinite(server) || server <= 0) return;
  const now = steady();
  const reading = server + (now - sentAt) / 2;
  if (anchor && Math.abs(reading - (anchor.server + now - anchor.steady)) < DRIFT_MS) return;
  anchor = { server: reading, steady: now };
}

/** Forgets the server's time (tests). */
export function resetClock() {
  anchor = null;
}
