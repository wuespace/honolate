#!/usr/bin/env -S deno run --allow-read --allow-write=./locales/ --allow-env
import { runCLI } from '../lib/extract/cli.ts';
import { initHolate } from '../lib/hono/initHolate.ts';
import { InitHolateOptions } from '../lib/hono/InitHolateOptions.ts';

const config: InitHolateOptions<'en' | 'de'> = {
	defaultLanguage: 'en',
	languages: {
		en: import.meta.resolve('./locales/en.json'),
		de: import.meta.resolve('./locales/de.json'),
	}
} as const;

import.meta.main && await runCLI(config, import.meta.dirname ?? Deno.cwd());

export const withI18n = initHolate(config);

import.meta.main // && extract(config);