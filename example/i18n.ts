#!/usr/bin/env -S deno run --allow-read --allow-write=./locales/ --allow-env

import { initHolate, type InitHolateOptions, runCLI } from '@wuespace/holate';

const config: InitHolateOptions<'en' | 'de'> = {
	defaultLanguage: 'en',
	languages: {
		en: import.meta.resolve('./locales/en.json'),
		de: import.meta.resolve('./locales/de.json'),
	},
} as const;

import.meta.main && await runCLI(config, import.meta.dirname ?? Deno.cwd());

export const withI18n = initHolate(config);
