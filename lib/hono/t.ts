import { raw } from "@hono/hono/html";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { unescapeKey } from "../common/unescapeKey.ts";
import { ensureLazyLocalizedString } from "./ensureLazyLocalizedString.ts";
import { getLocalizationMap } from "./getLocalizationMap.ts";
import type { LazyLocalizedString } from "./LazyLocalizedString.ts";
import type { LocalizedStringValue } from "./LocalizedStringValue.ts";

/**
 * Resolves a localized string based on the current localization map.

 * @returns the localized string with placeholders filled in
 *
 * Can be used as a template string tag or as a function with a LazyLocalizedString.
 *
 * This cannot be used outside of Hono request context (e.g., in plain Deno scripts),
 * since it relies on the request's localization context,
 * set by {@link import("./initHonolate.ts").initHonolate},
 * to provide the current language's localization map.
 *
 * @example Example as template string tag:
 * ```ts
 * const greeting = t`greeting.hello.${userName}`;
 * ```
 *
 * @example Example with LazyLocalizedString:
 * ```ts
 * const lls: LazyLocalizedString = {
 *   localizationKey: "greeting.hello",
 *   values: [userName],
 * };
 * const greeting = t(lls);
 * ```
 *
 * @example Using in route handler:
 * ```ts
 * import { t } from '@wuespace/honolate';
 *
 * app.get('/greet', c => {
 *   return c.render(
 *     const greeting = t`Hello ${c.req.param('name')}!`;
 *     return greeting;
 *   });
 * });
 * ```
 */
export function t(
  strings: TemplateStringsArray,
  ...values: LocalizedStringValue[]
): string | HtmlEscapedString;
export function t(
  string: string | LazyLocalizedString,
): string | HtmlEscapedString;
export function t(
  string: TemplateStringsArray | LazyLocalizedString | string,
  ...values: LocalizedStringValue[]
): string | HtmlEscapedString {
  const lls = ensureLazyLocalizedString(string, values);
  const localizationValues = getLocalizationMap();

  if (!(lls.localizationKey in localizationValues)) {
    // Key not found, return default value
    localizationValues[lls.localizationKey] = lls.localizationKey;
  }

  if (localizationValues[lls.localizationKey].length === 0) {
    // Untranslated string, use key as value
    localizationValues[lls.localizationKey] = lls.localizationKey;
  }

  let result = localizationValues[lls.localizationKey];

  for (let i = 0; i < lls.values.length; i++) {
    if (result.indexOf(`{${i}}`) === -1) {
      console.warn(
        new Error(
          `Placeholder {${i}} not found in localized string for key "${lls.localizationKey}".` +
            `\nLocalized string: "${result}"` +
            `\nMake sure the number of placeholders in the localized string matches the number of values provided.`,
        ),
      );
    } else {
      // fill in value
      // replace all unescaped occurrences of {i} with the value lls.values[i]
      result = result.replaceAll(
        new RegExp(`(?<!\\\\)\\{${i}\\}`, "g"),
        String(lls.values[i]),
      );
    }
  }

  return raw(unescapeKey(result));
}
