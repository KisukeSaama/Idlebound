import type { ApiError } from "@idlebound/game";

/** An error answer: a stable code, with the details its code names (see API_ERRORS). */
export function fail(error: ApiError, details: Record<string, unknown> = {}) {
  return { error, ...details };
}
