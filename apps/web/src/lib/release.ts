/**
 * Which release of the game a page runs, and whether the server now runs a newer one. The
 * CI builds the web image with IDLEBOUND_RELEASE (the commit), inlined at build time into
 * both the page and the /api proxy; the proxy stamps every answer with it.
 */

/** Response header carrying the release of the server that answered. */
export const RELEASE_HEADER = "x-idlebound-release";

/** The release this code was built from; empty outside a release build (dev, tests). */
export function ownRelease(): string {
  return process.env.IDLEBOUND_RELEASE ?? "";
}

type Listener = (release: string) => void;
const listeners = new Set<Listener>();

/** Called with the server's release each time an answer shows one other than this page's. */
export function onNewerRelease(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Every answer from the server passes here with the release header it carried. */
export function noteServerRelease(release: string | null) {
  const own = ownRelease();
  if (!own || !release || release === own) return;
  for (const listener of listeners) listener(release);
}
