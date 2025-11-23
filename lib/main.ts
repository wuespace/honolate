import { lt } from './hono/lt.ts';
import { t } from './hono/t.ts';

const deMap = new Map<string, string>([
	['This is a {0} test.', 'Dies ist ein {0} Test.'],
	[
		'This is an embedded {0} example.',
		'Dies ist ein eingebettetes {0} Beispiel.',
	],
]);

export const loadedLocalizations = new Map<string, Map<string, string>>([
	['de', deMap],
]);

const value = 42;

const x = lt`This is a ${value} test.`;

const y = lt`This is an embedded ${x} example.`;

console.log(t(y));
console.log(t`This is a ${value} test.`);

t`This is an embedded ${lt`This is a ${value} test.`} example.`;
