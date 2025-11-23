import { useRequestContext } from "@hono/hono/jsx-renderer";
import { neverThrow } from "../common/neverThrow.ts";

/**
 * @returns the current locale's localization map, mapping localization keys to their respective translations
 */
export function getLocalizationMap(): Record<string, string> {
  const ctx = neverThrow(() => useRequestContext());
  if (ctx instanceof Error) {
    console.warn(
      new Error(
        "t was called outside of a request context. Using default locale 'default'." +
          "\nMake sure to wrap t calls within a Hono JSX Renderer context." +
          "\nIf you're not in a functional component, use asFC() to wrap the parameter of c.render():" +
          "\nc.render(asFC(() => <>{t`...`}</>))" +
          "\ninstead of c.render(<>{t`...`}</>)",
        { cause: ctx },
      ),
    );
    return {};
  }

  const map = ctx.get("localizedValues");
  if (!map || typeof map !== "object") {
    console.warn(
      new Error(
        "Localized values not found in request context. Using empty localization map." +
          "\nMake sure to update the localization files and initialize Honolate middleware correctly.",
        { cause: ctx },
      ),
    );
    return {};
  }
  return map as Record<string, string>;
}
