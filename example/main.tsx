import { Hono } from "@hono/hono";
import { jsxRenderer } from "@hono/hono/jsx-renderer";
// import { languageDetector } from '@hono/hono/language';
import { t } from "@wuespace/honolate";
import { withI18n } from "./i18n.ts";

const app = new Hono();

app.use(
  "*",
  // languageDetector({
  // 	supportedLanguages: ['en', 'ar', 'ja', 'de'], // Must include fallback
  // 	fallbackLanguage: 'en', // Required
  // }),
  withI18n,
  jsxRenderer(),
);

app.get("/", (c) => {
  return c.render(
    <div>
      {t`Welcome to the {{}}}}{{ {0} {1} {{0}} {{1}} homepage ${3}!`}
      {t`Hello world!`}
      {t`Test: ${<code>{t`Hello!`}</code>}`}
      <LocalePrinter />
    </div>,
  );
});

function LocalePrinter() {
  const locale = t`ABC ${3} DEF`;
  return <div>Current locale: {locale}</div>;
}

Deno.serve(app.fetch);
