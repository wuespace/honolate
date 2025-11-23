import { createMiddleware } from "@hono/hono/factory";
import { neverThrow } from "../common/neverThrow.ts";
import { normalizePath } from "../common/normalizePath.ts";
import type { HonolateContext } from "./HonolateContext.ts";
import type { InitHonolateOptions } from "./InitHonolateOptions.ts";
import type { LocalizedValue } from "./LocalizedValue.ts";
import { ensureRequestLanguage } from "./ensureRequestLanguage.ts";

export const initHonolate = <T extends string>(
  options: InitHonolateOptions<T>,
) => {
  // import – without awaiting – any necessary resources based on options
  // runs on startup => may be reasonably slow
  const languages = new Map<T, Record<string, LocalizedValue>>();

  for (const lang in options.languages) {
    const path = options.languages[lang as T];
    const module = neverThrow(() => Deno.readFileSync(normalizePath(path)));
    if (module instanceof Error) {
      console.error(
        `Failed to load language file for ${lang} at ${path}:`,
        module,
      );
      languages.set(lang as T, {});
      continue;
    }

    const decodedModule = new TextDecoder().decode(module);
    const parsedModule = neverThrow(() => JSON.parse(decodedModule));

    if (parsedModule instanceof Error) {
      console.error(
        `Failed to parse language file for ${lang} at ${path}:`,
        parsedModule,
      );
      languages.set(lang as T, {});
      continue;
    }

    languages.set(lang as T, parsedModule as Record<string, LocalizedValue>);
  }

  return createMiddleware<HonolateContext<T>>(async (c, next) => {
    // Middleware logic here
    // Runs per request => must be fast

    // Make sure a language is set
    const language = await ensureRequestLanguage<T>(c, options);

    c.set("localizedValues", languages.get(language) || {});

    return next();
  });
};
