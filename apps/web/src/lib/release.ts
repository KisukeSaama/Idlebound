/**
 * Which release of the game a page runs, and whether the server now runs a newer one. The
 * CI builds the web image with IDLEBOUND_RELEASE (the commit); IDLEBOUND_VERSION (v0.6.0, the
 * walker reads it) comes from the root package.json. Both are inlined at build time into the
 * page and the /api proxy; the proxy stamps every answer with both.
 */

/** Response header carrying the release of the server that answered. */
export const RELEASE_HEADER = "x-idlebound-release";
/** Response header carrying the version name of that release. */
export const VERSION_HEADER = "x-idlebound-version";

/** The release this code was built from; empty outside a release build (dev, tests). */
export function ownRelease(): string {
  return process.env.IDLEBOUND_RELEASE ?? "";
}

/** The version the walker reads for this build (v0.6.0); empty when unknown. */
export function ownVersion(): string {
  return process.env.IDLEBOUND_VERSION ?? "";
}

/** A release the server runs: its commit, and its version name (empty from an older server). */
export interface ServerRelease {
  release: string;
  version: string;
}

type Listener = (server: ServerRelease) => void;
const listeners = new Set<Listener>();

/** Called with the server's release each time an answer shows one other than this page's. */
export function onNewerRelease(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Every answer from the server passes here with the release headers it carried. */
export function noteServerRelease(release: string | null, version: string | null) {
  const own = ownRelease();
  if (!own || !release || release === own) return;
  for (const listener of listeners) listener({ release, version: version ?? "" });
}
