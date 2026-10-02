/**
 * The Stride board: stages gained over the last 7 days, today included. Days are UTC calendar
 * days of the server's clock, never the client's.
 */
export const STRIDE_DAYS = 7;

const DAY = 86_400_000;

/** The UTC calendar day of a moment, as stored in `stage_history.day` ("2026-10-02"). */
export function utcDay(at: Date): string {
  return at.toISOString().slice(0, 10);
}

/** First day of the window that ends today: the earliest `stage_history` row still needed. */
export function strideStart(now: Date): string {
  return utcDay(new Date(now.getTime() - (STRIDE_DAYS - 1) * DAY));
}
