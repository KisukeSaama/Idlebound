import { ownRelease, ownVersion } from "./release";

/** Reports a page sends at most: an error looping on every frame is heard a few times, not forever. */
const MAX_REPORTS = 5;
let sent = 0;
let installed = false;

export type ErrorKind = "error" | "rejection" | "render" | "window";

/**
 * Tells the server an error a page met (see the API's /client-error): what broke and where,
 * never who. Fire and forget: a report that cannot leave is dropped.
 */
export function reportClientError(kind: ErrorKind, error: unknown) {
  if (typeof window === "undefined" || sent >= MAX_REPORTS) return;
  sent += 1;
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";
  const stack = error instanceof Error && error.stack ? error.stack.slice(0, 4000) : undefined;
  const body = JSON.stringify({ kind, message: message.slice(0, 500), stack, path: window.location.pathname.slice(0, 200), release: ownRelease() || undefined, version: ownVersion() || undefined });
  void fetch("/api/client-error", { method: "POST", headers: { "content-type": "application/json", "x-idlebound": "1" }, body, keepalive: true }).catch(() => {});
}

/** Reports the errors no boundary caught: uncaught exceptions and unhandled rejections. Once per page. */
export function installErrorReporting() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  window.addEventListener("error", (event) => {
    // A resource that failed to load (an image, a script) is not an error of the code.
    if (!(event.error instanceof Error) && !event.message) return;
    reportClientError("error", event.error ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => reportClientError("rejection", event.reason));
}
