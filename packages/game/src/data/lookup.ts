/**
 * Id-indexed table without a prototype: an id coming from a save ("constructor",
 * "toString"…) never resolves to an Object.prototype property.
 */
export function lookup<T>(entries: Iterable<readonly [string, T]>): Record<string, T> {
  return Object.assign(Object.create(null) as Record<string, T>, Object.fromEntries(entries));
}
