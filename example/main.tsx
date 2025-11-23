import { Hono } from '@hono/hono';
import { jsxRenderer, useRequestContext } from '@hono/hono/jsx-renderer';
import { languageDetector } from '@hono/hono/language';
import { asFC } from '../lib/hono/asFC.tsx';
import { t } from '../lib/hono/t.ts';
import { withI18n } from './i18n.ts';

const app = new Hono();

app.use(
	'*',
	// languageDetector({
	// 	supportedLanguages: ['en', 'ar', 'ja', 'de'], // Must include fallback
	// 	fallbackLanguage: 'en', // Required
	// }),
	withI18n,
	jsxRenderer(),
);

app.get('/', (c) => {
	return c.render(
		asFC(() => (
			<div>
				Welcome to the homepage {useRequestContext().req.url}!
				{t`Hello world!`}
				<LocalePrinter />
			</div>
		)),
	);
});

function LocalePrinter() {
	const locale = t`ABC ${3} DEF`;
	return <div>Current locale: {locale}</div>;
}

Deno.serve(app.fetch);
