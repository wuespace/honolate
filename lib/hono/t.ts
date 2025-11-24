import { raw } from "@hono/hono/html";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { unescapeKey } from "../common/unescapeKey.ts";
import { ensureLazyLocalyzedString } from "./ensureLazyLocalyzedString.ts";
import { getLocalizationMap } from "./getLocalizationMap.ts";
import type { LazyLocalyzedString } from "./LazyLocalyzedString.ts";
import type { LocalyzedStringValue } from "./LocalyzedStringValue.ts";

/**
 * Resolves a localized string based on the current localization map.

 * @returns the localized string with placeholders filled in
 *
 * Can be used as a template string tag or as a function with a LazyLocalyzedString.
 *
 * Can only be called inside a functional component. To use this directly in route handlers,
 * use {@link asFC} to wrap the handler as a functional component.
 *
 * This cannot be used outside of Hono request context (e.g., in plain Deno scripts),
 * since it relies on the request context to provide the current language's localization map.
 *
 * @example Example as template string tag:
 * ```ts
 * const greeting = t`greeting.hello.${userName}`;
 * ```
 *
 * @example Example with LazyLocalyzedString:
 * ```ts
 * const lls: LazyLocalyzedString = {
 *   localizationKey: "greeting.hello",
 *   values: [userName],
 * };
 * const greeting = t(lls);
 * ```
 *
 * @example Using with asFC in route handler:
 * ```ts
 * import { asFC, t } from '@wuespace/honolate';
 *
 * app.get('/greet', c => {
 *   return c.render(asFC(() => {
 *     const greeting = t`Hello ${c.req.param('name')}!`;
 *     return greeting;
 *   }));
 * });
 * ```
 */
export function t(
  strings: TemplateStringsArray,
  ...values: LocalyzedStringValue[]
): string | HtmlEscapedString;
export function t(
  string: string | LazyLocalyzedString,
): string | HtmlEscapedString;
export function t(
  string: TemplateStringsArray | LazyLocalyzedString | string,
  ...values: LocalyzedStringValue[]
): string | HtmlEscapedString {
  if (typeof string === "string") {
    // simple string, return as is
    string = {
      localizationKey: string,
      values: [],
    };
  }
  const lls = ensureLazyLocalyzedString(string, values);
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
