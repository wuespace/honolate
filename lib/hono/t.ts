import { unescapeKey } from '../common/unescapeKey.ts';
import { ensureLazyLocalyzedString } from './ensureLazyLocalyzedString.ts';
import { getLocalizationMap } from './getLocalizationMap.ts';
import type { LazyLocalyzedString } from './LazyLocalyzedString.ts';
import type { LocalyzedStringValue } from './LocalyzedStringValue.ts';

export function t(
	strings: TemplateStringsArray,
	...values: LocalyzedStringValue[]
): string;
export function t(lls: LazyLocalyzedString): string;
export function t(
	string: TemplateStringsArray | LazyLocalyzedString,
	...values: LocalyzedStringValue[]
): string {
	const lls = ensureLazyLocalyzedString(string, values);
	const localizationValues = getLocalizationMap();

	if (!(lls.localizationKey in localizationValues)) {
		// Key not found, return default value
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
				new RegExp(`(?<!\\\\)\\{${i}\\}`, 'g'),
				String(lls.values[i]),
			);
		}
	}

	return unescapeKey(result);
}
