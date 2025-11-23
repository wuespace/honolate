import type { LocalizedValue } from "./LocalizedValue.ts";

export type HonolateContext<T extends string> = {
  Variables: {
    language?: T;
    localizedValues?: Record<string, LocalizedValue>;
  };
};
