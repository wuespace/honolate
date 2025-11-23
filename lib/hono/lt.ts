import { escapeKey } from "../common/escapeKey.ts";
import type { LazyLocalyzedString } from "./LazyLocalyzedString.ts";
import type { LocalyzedStringValue } from "./LocalyzedStringValue.ts";

export function lt(
  strings: TemplateStringsArray,
  ...values: LocalyzedStringValue[]
): LazyLocalyzedString {
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
