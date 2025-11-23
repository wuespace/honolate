import { LazyLocalyzedString } from './LazyLocalyzedString.ts';
import { LocalyzedStringValue } from './LocalyzedStringValue.ts';
import { lt } from '../hono/lt.ts';
// import { loadedLocalizations } from '../main.ts';
import { unescapeKey } from '../common/unescapeKey.ts';
import { LocaleNotFoundError, NoRequestContextError, useLocale } from '../hono/useLocale.ts';
import { neverThrow } from '../common/never-throw.ts';

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

	const locale = getLocale();
	return locale;
	// const localizationMap = loadedLocalizations.get(locale);
	// if (localizationMap) {
	// 	const localizedString = localizationMap.get(lls.localizationKey);
	// 	if (localizedString) {
	// 		let translated = localizedString;
	// 		lls.values.forEach((value, index) => {
	// 			let stringValue: string;
	// 			if (typeof value === 'object' && 'localizationKey' in value) {
	// 				stringValue = t(value);
	// 			} else {
	// 				stringValue = String(value);
	// 			}
	// 			const placeholder = `{${index}}`;
	// 			translated = translated.replace(placeholder, stringValue);
	// 		});
	// 		return translated;
	// 	}
	// }
	// console.log(`Translating for locale: ${locale}`);
	// let translated = unescapeKey(lls.localizationKey);
	// lls.values.forEach((value, index) => {
	// 	let stringValue: string;
	// 	if (typeof value === 'object' && 'localizationKey' in value) {
	// 		stringValue = t(value);
	// 	} else {
	// 		stringValue = String(value);
	// 	}
	// 	const placeholder = `{${index}}`;
	// 	translated = translated.replace(placeholder, stringValue);
	// });
	// return translated;
}

function getLocale(): string {
	const rawLocale = neverThrow(() => useLocale());
	if (rawLocale instanceof NoRequestContextError) {
		console.warn(
			new Error(
				"t was called outside of a request context. Using default locale 'default'."
				+ "\nMake sure to wrap t calls within a Hono JSX Renderer context."
				+ '\nIf you\'re not in a functional component, use asFC() to wrap the parameter of c.render():'
				+ "\nc.render(asFC(() => <>{t`...`}</>))"
				+ "\ninstead of c.render(<>{t`...`}</>)",
				{ cause: rawLocale },
			)
		)
		return 'default';
	}
	if (rawLocale instanceof LocaleNotFoundError) {
		console.error(new Error(
			"Locale not found in request context. Using default locale 'default'."
			+ "\nMake sure to set the locale in the request context before calling t."
			+ "\nOne option to do so is to use the languageDetector middleware provided by hono (@hono/hono/language).",
			{ cause: rawLocale },
		));
		return 'default';
	}
	if (rawLocale instanceof Error) {
		console.error(rawLocale);
		return 'default';
	}
	return rawLocale;
}
