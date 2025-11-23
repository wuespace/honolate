import { Context } from '@hono/hono';
import { HolateContext } from './HolateContext.ts';
import { InitHolateOptions } from './InitHolateOptions.ts';
import { runLanguageDetector } from './runLanguageDetector.ts';

/**
 * Ensure that the request has a language set, using detection if necessary
 * @param c Context object
 * @param options Initialization options
 * @returns the determined language
 */
export async function ensureRequestLanguage<T extends string>(c: Context<HolateContext<T>>, options: InitHolateOptions<T>) {
	if (!c.get('language')) {
		// run language detection logic
		console.warn('No language set on context – running language detector from holate middleware');
		await runLanguageDetector<T>(options, c);
	}
	c.set('language', c.var.language ?? options.defaultLanguage);

	// Load localized values for the selected language
	const language = c.get('language') as T;
	return language;
}
