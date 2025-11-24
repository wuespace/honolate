import { currentLocalizedValuesStorage } from "./initHonolate.ts";

/**
 * @returns the current locale's localization map, mapping localization keys to their respective translations
 */
export function getLocalizationMap(): Record<string, string> {
  const localizationMap = currentLocalizedValuesStorage.getStore();
  if (!localizationMap) {
    console.warn(
      new Error(
        "t was called outside of a request context." +
          "\nMake sure to only call t within routes that use the middleware returned by initHonolate.",
      ),
    );
    return {};
  }
  return localizationMap;
}
