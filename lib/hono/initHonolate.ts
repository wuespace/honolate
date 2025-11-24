import { createMiddleware } from "@hono/hono/factory";
import { neverThrow } from "../common/neverThrow.ts";
import { normalizePath } from "../common/normalizePath.ts";
import type { HonolateContext } from "./HonolateContext.ts";
import type { InitHonolateOptions } from "./InitHonolateOptions.ts";
import type { LocalizedValue } from "./LocalizedValue.ts";
import { ensureRequestLanguage } from "./ensureRequestLanguage.ts";
import { AsyncLocalStorage } from "node:async_hooks";

export const currentLocaleStorage = new AsyncLocalStorage<string>();
export const currentLocalizedValuesStorage = new AsyncLocalStorage<
  Record<
    string,
    LocalizedValue
  >
>();

/**
 * Initializes Honolate with the given options.
 *
 * Make sure to add the returned middleware to your Hono app before any route handlers that use localization.
 *
 * @param options the options with which Honolate will be initialized. See {@link InitHonolateOptions}
 * @returns the middleware required to show localized strings using Honolate
 *
 * @example
 * import { InitHonolateOptions, initHonolate } from '@wuespace/honolate';
 *
 * const honolateOptions: InitHonolateOptions<'en' | 'de'> = {
 *   defaultLanguage: 'en',
 *   languages: {
 *     en: './locales/en.json',
 *     de: './locales/de.json',
 *   },
 *   // optional: add custom language detection logic here
 * };
 *
 * const app = new Hono();
 * app.use('*', initHonolate(honolateOptions));
 * // ...other middlewares and route handlers
 */
export const initHonolate: <T extends string>(
  options: InitHonolateOptions<T>,
) => ReturnType<typeof createMiddleware<HonolateContext<T>>> = <
  T extends string,
>(
  options: InitHonolateOptions<T>,
) => {
  // import – without awaiting – any necessary resources based on options
  // runs on startup => may be reasonably slow
  const languages = new Map<T, Record<string, LocalizedValue>>();

  for (const lang in options.languages) {
    languages.set(lang, loadLanguage(options.languages[lang]));
  }

  return createMiddleware<HonolateContext<T>>(async (c, next) => {
    // Middleware logic here
    // Runs per request => must be fast

    // Make sure a language is set
    const language = await ensureRequestLanguage<T>(c, options);

    c.set("localizedValues", languages.get(language) || {});

    return currentLocaleStorage.run(
      language,
      () =>
        currentLocalizedValuesStorage.run(
          c.get("localizedValues") || {},
          next,
        ),
    );
  });
};

/**
 * Loads a language file from the given path.
 * @param languagePath the path to the language
 * @returns the loaded localization map
 */
function loadLanguage(languagePath: string): Record<string, LocalizedValue> {
  // Load
  const module = neverThrow(() =>
    Deno.readFileSync(normalizePath(languagePath))
  );

  if (module instanceof Error) {
    // Handle file read error
    console.error(
      `Failed to load language file at ${languagePath}:`,
      module,
    );
    return {};
  }

  // Parse
  const decodedModule = new TextDecoder().decode(module);
  const parsedModule = neverThrow(() => JSON.parse(decodedModule));

  if (parsedModule instanceof Error) {
    // Handle JSON parse error
    console.error(
      `Failed to parse language file at ${languagePath}:`,
      parsedModule,
    );
    return {};
  }

  return parsedModule as Record<string, LocalizedValue>;
}
