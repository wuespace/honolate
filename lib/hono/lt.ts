import { escapeKey } from "../common/escapeKey.ts";
import type { LazyLocalizedString } from "./LazyLocalizedString.ts";
import type { LocalizedStringValue } from "./LocalizedStringValue.ts";

/**
 * A template tag function to create a {@link LazyLocalizedString}.
 * @returns A {@link LazyLocalizedString} representing the localization key and its values.
 *
 * @example
 * ```ts
 * const lazyString = lt`welcomeMessage`;
 *
 * const lazyStringWithValues = lt`welcomeMessage, {0}`("Alice");
 *
 * const nestedLazyString = lt`greeting, {0}`(
 *   lt`userName, {0}`("Alice")
 * );
 *
 * // [...in a Hono rendering context...]
 * <>
 *   <p>{t(lazyString)}</p>
 *   <p>{t(lazyStringWithValues)}</p>
 *   <p>{t(nestedLazyString)}</p>
 * </>
 * ```
 *
 * @remarks
 * The existence of these "late" strings is both the inspiration for the library's name,
 * as well as a core concept of how localization is handled. By deferring the resolution of
 * localization keys and their values until the rendering phase, we can ensure that the
 * correct localized strings are used based on the current context (e.g., user language).
 *
 * This allows you to, e.g., throw an `Error` with a localized message without needing
 * to know the user's language at the time the error is created.
 */
export function lt(
  strings: TemplateStringsArray,
  ...values: LocalizedStringValue[]
): LazyLocalizedString {
  const escaped = strings.map(escapeKey);
  let localizationKey = "";
  for (let i = 0; i < escaped.length; i++) {
    localizationKey += escaped[i];
    if (i < values.length) localizationKey += `{${i}}`;
  }
  return {
    localizationKey,
    values,
  };
}
