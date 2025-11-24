import type { LazyLocalizedString } from "./LazyLocalizedString.ts";
import type { LocalizedStringValue } from "./LocalizedStringValue.ts";
import { lt } from "./lt.ts";

/**
 * Ensures that the input is a LazyLocalizedString.
 *
 * Can be applied to either a template string or an already existing LazyLocalizedString.
 *
 * @returns the input as a LazyLocalizedString
 */
export function ensureLazyLocalizedString(
  input: TemplateStringsArray | LazyLocalizedString,
  values: LocalizedStringValue[],
): LazyLocalizedString {
  if (Array.isArray(input)) {
    return lt(input as TemplateStringsArray, ...values);
  } else {
    return input as LazyLocalizedString;
  }
}
