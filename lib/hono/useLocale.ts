import { useRequestContext } from "@hono/hono/jsx-renderer";
import { neverThrow } from "../common/neverThrow.ts";

export class LocaleNotFoundError extends Error {}
export class NoRequestContextError extends Error {}

export function useLocale(): string {
  const ctx = neverThrow(() => useRequestContext());
  if (ctx instanceof Error) {
    throw new NoRequestContextError(
      "useLocale must be used within a Hono JSX Renderer context.",
      { cause: ctx },
    );
  }
  const locale = ctx.get("language");
  if (typeof locale === "string") {
    return locale;
  }
  throw new LocaleNotFoundError(
    'Language ("language") not found in request context. Make sure to set it before using useLocale.' +
      "\nOne option to do so is to use the languageDetector middleware provided by hono.",
  );
}
