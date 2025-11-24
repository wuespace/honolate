import { currentLocaleStorage } from "./initHonolate.ts";

/**
 * Returns the current locale code. Must be used within the scope of the `initHonolate` middleware.
 * @returns the current locale code
 */
export function useLocale(): string {
  const locale = currentLocaleStorage.getStore();
  if (!locale) {
    throw new Error(
      "No locale found in AsyncLocalStorage. Make sure to use the initHonolate middleware.",
    );
  }
  return locale;
}
