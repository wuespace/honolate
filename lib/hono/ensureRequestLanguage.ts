import { Context } from "@hono/hono";
import { HonolateContext } from "./HonolateContext.ts";
import { InitHonolateOptions } from "./InitHonolateOptions.ts";
import { runLanguageDetector } from "./runLanguageDetector.ts";

/**
 * Ensure that the request has a language set, using detection if necessary
 * @param c Context object
 * @param options Initialization options
 * @returns the determined language
 */
export async function ensureRequestLanguage<T extends string>(
  c: Context<HonolateContext<T>>,
  options: InitHonolateOptions<T>,
) {
  if (!c.get("language")) {
    // run language detection logic
    // console.warn('No language set on context – running language detector from honolate middleware');
    await runLanguageDetector<T>(options, c);
  }
  c.set("language", c.var.language ?? options.defaultLanguage);

  // Load localized values for the selected language
  const language = c.get("language") as T;
  return language;
}
