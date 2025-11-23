import { LocalizedValue } from './LocalizedValue.ts';

export type HolateContext<T extends string> = {
	Variables: {
		language?: T;
		localizedValues?: Record<string, LocalizedValue>;
	};
};
