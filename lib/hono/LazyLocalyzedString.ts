import { LocalyzedStringValue } from './LocalyzedStringValue.ts';

export type LazyLocalyzedString = {
	localizationKey: string;
	values: LocalyzedStringValue[];
};
