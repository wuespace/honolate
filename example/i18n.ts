#!/usr/bin/env -S deno run --allow-read --allow-write=./locales/ --allow-env

import {
  initHonolate,
  type InitHonolateOptions,
  runCLI,
} from "@wuespace/honolate";

const config: InitHonolateOptions<"en" | "de"> = {
  defaultLanguage: "en",
  languages: {
    en: import.meta.resolve("./locales/en.json"),
    de: import.meta.resolve("./locales/de.json"),
  },
} as const;

import.meta.main && await runCLI(config, import.meta.dirname ?? Deno.cwd());

export const withI18n = initHonolate(config);
