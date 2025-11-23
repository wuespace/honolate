import type { LazyLocalyzedString } from "./LazyLocalyzedString.ts";
import type { LocalyzedStringValue } from "./LocalyzedStringValue.ts";
import { lt } from "./lt.ts";

/**
 * Ensures that the input is a LazyLocalyzedString.
 *
 * Can be applied to either a template string or an already existing LazyLocalyzedString.
 *
 * @returns the input as a LazyLocalyzedString
 */
export function ensureLazyLocalyzedString(
  input: TemplateStringsArray | LazyLocalyzedString,
  values: LocalyzedStringValue[],
): LazyLocalyzedString {
  if (Array.isArray(input)) {
    return lt(input as TemplateStringsArray, ...values);
  } else {
    return input as LazyLocalyzedString;
  }
}
