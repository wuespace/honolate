import type { Context } from '@hono/hono';
import { languageDetector } from '@hono/hono/language';
import type { InitHolateOptions } from './InitHolateOptions.ts';

export async function runLanguageDetector<T extends string>(
	options: InitHolateOptions<T>,
	c: Context,
) {
	await new Promise<void>((resolve) => {
		languageDetector({
			fallbackLanguage: options.defaultLanguage,
			supportedLanguages: Object.keys(options.languages) as T[],
		})(c, () => {
			resolve();
			return Promise.resolve();
		});
	});
}
