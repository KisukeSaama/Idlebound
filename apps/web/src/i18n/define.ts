/**
 * Declares one namespace of UI strings in both locales. The French object defines the
 * shape; the English one must match it exactly (same keys, same function signatures).
 * Values are strings, or functions for strings with parameters.
 */
export function defineMessages<T>(messages: { fr: T; en: NoInfer<T> }): { fr: T; en: T } {
  return messages;
}
