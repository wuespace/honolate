import { LazyLocalyzedString } from "./LazyLocalyzedString.ts";
import { LocalyzedStringValue } from "./LocalyzedStringValue.ts";
import { lt } from "./lt.ts";
import { loadedLocalizations } from "./main.ts";
import { unescapeKey } from "./unescapeKey.ts";
import { useLocale } from "./useLocale.ts";

export function t(
  strings: TemplateStringsArray,
  ...values: LocalyzedStringValue[]
): string;
export function t(lls: LazyLocalyzedString): string;
export function t(
  string: TemplateStringsArray | LazyLocalyzedString,
  ...values: LocalyzedStringValue[]
): string {
  if (Array.isArray(string)) {
    const lls: LazyLocalyzedString = lt(
      string as TemplateStringsArray,
      ...values,
    );
    return t(lls);
  }
  const lls = string as LazyLocalyzedString;

  const locale = useLocale();
  const localizationMap = loadedLocalizations.get(locale);
  if (localizationMap) {
    const localizedString = localizationMap.get(lls.localizationKey);
    if (localizedString) {
      let translated = localizedString;
      lls.values.forEach((value, index) => {
        let stringValue: string;
        if (typeof value === "object" && "localizationKey" in value) {
          stringValue = t(value);
        } else {
          stringValue = String(value);
        }
        const placeholder = `{${index}}`;
        translated = translated.replace(placeholder, stringValue);
      });
      return translated;
    }
  }
  console.log(`Translating for locale: ${locale}`);
  let translated = unescapeKey(lls.localizationKey);
  lls.values.forEach((value, index) => {
    let stringValue: string;
    if (typeof value === "object" && "localizationKey" in value) {
      stringValue = t(value);
    } else {
      stringValue = String(value);
    }
    const placeholder = `{${index}}`;
    translated = translated.replace(placeholder, stringValue);
  });
  return translated;
}
