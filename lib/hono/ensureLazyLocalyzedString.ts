import type { LazyLocalyzedString } from './LazyLocalyzedString.ts';
import type { LocalyzedStringValue } from './LocalyzedStringValue.ts';
import { lt } from './lt.ts';

export function ensureLazyLocalyzedString(
	input: TemplateStringsArray | LazyLocalyzedString,
	values: LocalyzedStringValue[]): LazyLocalyzedString {
	if (Array.isArray(input)) {
		return lt(input as TemplateStringsArray, ...values);
	} else {
		return input as LazyLocalyzedString;
	}
}
