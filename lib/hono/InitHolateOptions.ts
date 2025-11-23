import type { JsonPath } from './JsonPath.ts';

export interface InitHolateOptions<T extends string> {
	readonly defaultLanguage: T;
	readonly languages: Readonly<
		{
			[key in T]: JsonPath;
		}
	>;
	pattern?: string;
}
