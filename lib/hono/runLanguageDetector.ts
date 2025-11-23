import type { Context } from "@hono/hono";
import { languageDetector } from "@hono/hono/language";
import type { InitHonolateOptions } from "./InitHonolateOptions.ts";

/**
 * Runs the native Hono language detector middleware to set the language
 * on the context based on the request.
 *
 * Uses the default language and supported languages from the Honolate options.
 * @param options the Honolate options
 * @param c the request context
 */
export async function runLanguageDetector<T extends string>(
  options: InitHonolateOptions<T>,
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
