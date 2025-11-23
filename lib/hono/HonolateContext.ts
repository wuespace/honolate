import type { LocalizedValue } from "./LocalizedValue.ts";

/**
 * The context type for Honolate, extending Hono's Context with localization-related variables.
 */
export type HonolateContext<T extends string> = {
  Variables: {
    language?: T;
    localizedValues?: Record<string, LocalizedValue>;
  };
};
