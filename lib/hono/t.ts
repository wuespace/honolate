import { unescapeKey } from '../common/unescapeKey.ts';
import { lt } from '../hono/lt.ts';
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
	if (Array.isArray(string)) {
		const lls: LazyLocalyzedString = lt(
			string as TemplateStringsArray,
			...values,
		);
		return t(lls);
	}
	const lls = string as LazyLocalyzedString;

	const map = getLocalizationMap();
	if (!(lls.localizationKey in map)) {
		// Key not found, return default value
		map[lls.localizationKey] = lls.localizationKey;
	}

	let str = map[lls.localizationKey];

	for (let i = 0; i < lls.values.length; i++) {
		if (str.indexOf(`{${i}}`) === -1) {
			console.warn(
				new Error(
					`Placeholder {${i}} not found in localized string for key "${lls.localizationKey}".` +
						`\nLocalized string: "${str}"` +
						`\nMake sure the number of placeholders in the localized string matches the number of values provided.`,
				),
			);
		} else {
			// fill in value
			// replace all unescaped occurrences of {i} with the value lls.values[i]
			str = str.replaceAll(
				new RegExp(`(?<!\\\\)\\{${i}\\}`, 'g'),
				String(lls.values[i]),
			);
		}
	}

	return unescapeKey(str);
}
