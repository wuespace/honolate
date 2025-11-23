import { createMiddleware } from '@hono/hono/factory';
import { HolateContext } from './HolateContext.ts';
import { InitHolateOptions } from './InitHolateOptions.ts';
import { ensureRequestLanguage } from './ensureRequestLanguage.ts';
import { neverThrow } from '../common/never-throw.ts';
import { LocalizedValue } from './LocalizedValue.ts';
import { normalizePath } from '../common/normalizePath.ts';

export const initHolate = <T extends string>(options: InitHolateOptions<T>) => {
	// import – without awaiting – any necessary resources based on options
	// runs on startup => may be reasonably slow
	console.log('Initializing Holate with options:', options);

	const languages = new Map<T, Record<string, LocalizedValue>>();

	for (const lang in options.languages) {
		const path = options.languages[lang as T];
		console.debug(`Loading language ${lang} from ${path}`);
		const module = neverThrow(() => Deno.readFileSync(normalizePath(path)));
		if (module instanceof Error) {
			console.error(`Failed to load language file for ${lang} at ${path}:`, module);
			languages.set(lang as T, {});
			continue;
		}

		const decodedModule = new TextDecoder().decode(module);
		const parsedModule = neverThrow(() => JSON.parse(decodedModule));

		if (parsedModule instanceof Error) {
			console.error(`Failed to parse language file for ${lang} at ${path}:`, parsedModule);
			languages.set(lang as T, {});
			continue;
		}

		languages.set(lang as T, parsedModule as Record<string, LocalizedValue>);
	}

	console.log('Loaded languages:', languages);

	return createMiddleware<HolateContext<T>>(async (c, next) => {
		// Middleware logic here
		// Runs per request => must be fast

		// Make sure a language is set
		const language = await ensureRequestLanguage<T>(c, options);


		c.set('localizedValues', {});

		return next();
	})
};

