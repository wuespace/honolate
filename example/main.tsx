import { Hono } from "@hono/hono";
import { jsxRenderer } from "@hono/hono/jsx-renderer";
import { LocalizedHttpException, lt, t, useLocale } from "@wuespace/honolate";
import { withI18n } from "./i18n.ts";

const lazyTerm = lt`Lazy term`;

export const app = new Hono()
  .use(
    withI18n,
    jsxRenderer(),
  )
  .onError((err, c) => {
    const localizedError = LocalizedHttpException.fromCause(err);
    console.error("[app]", localizedError);
    return c.json({
      errorId: localizedError.errorId,
      title: t(localizedError.options.localizedTitle ?? lt`Unknown Error`),
      message: t(
        localizedError.options.localizedMessage ??
          lt`An unexpected error occurred while processing your request.`,
      ),
      technicalMessage: localizedError.options.technicalMessage,
    }, {
      status: localizedError.status,
    });
  })
  .get("/text", (c) => c.text(t`Hello world!`))
  .get("/locale", (c) => c.text(useLocale()))
  .get("/render", (c) => c.render(<h1>{t`Hello world!`}</h1>))
  .get("/component", (c) => c.render(<Component />))
  .get("/async-component", (c) => {
    return c.render(<AsyncComponent />);
  })
  .get("/async-component-alt", async (c) => {
    const component = await AsyncComponent();
    return c.render(component);
  })
  .get("/untranslated", (c) => c.text(t`Untranslated text`))
  .get("/lazy", (c) => c.text(t(lazyTerm)))
  .get(
    "/escape-test",
    (c) => c.text(t`This text contains ${1} {} curly braces and \\{{}}{0}.`),
  )
  .get("/trigger-500", () => {
    throw new LocalizedHttpException({
      status: 500,
      localizedTitle: lt`Hello world!`,
      localizedMessage: lt`Untranslated text`,
      technicalMessage: "Technical message",
    });
  })
  .notFound((c) => c.text("Not Found", 404));

import.meta.main && Deno.serve(app.fetch);

function Component() {
  const greeting = t`Hello world!`;
  return <h1>{greeting}</h1>;
}

async function AsyncComponent() {
  await Promise.resolve();
  const greeting = t`Hello world!`;
  return <h1>{greeting}</h1>;
}
