# Honolate – Localization for Hono in Deno

[![JSR Scope](https://jsr.io/badges/@wuespace)](https://jsr.io/@wuespace)
[![JSR](https://jsr.io/badges/@wuespace/honolate)](https://jsr.io/@wuespace/honolate)
[![JSR Score](https://jsr.io/badges/@wuespace/honolate/score)](https://jsr.io/@wuespace/honolate)
[![Publish Workflow](https://github.com/wuespace/honolate/actions/workflows/publish-jsr.yml/badge.svg)](https://github.com/wuespace/honolate/actions/workflows/publish-jsr.yml)

Honolate is a localization library designed specifically for the Hono web
framework in Deno. It provides an easy way to manage translations and localize
your web applications.

## Getting Started

Install Honolate via Deno:

```bash
deno add jsr:@wuespace/honolate
```

Create an `i18n.ts` file to configure your localization settings:

```typescript
#!/usr/bin/env -S deno run --allow-read --allow-write=./locales/ --allow-env
import { initHonolate, InitHonolateOptions, runCLI } from "@wuespace/honolate";

const config = {
  defaultLanguage: "en",
  languages: {
    en: import.meta.resolve("./locales/en.json"),
    de: import.meta.resolve("./locales/de.json"),
  },
} satisfies InitHonolateOptions<string>;

// CLI
import.meta.main && await runCLI(config, import.meta.dirname ?? Deno.cwd());

// Middleware for Hono
export const i18n = await initHonolate(config);
```

Run the script to initialize your localization files:

```bash
./i18n.ts
```

This will create a `locales` directory with `en.json` and `de.json` files. When
added terms in your code, you can re-run the script to update the localization
files.

## Usage

### Using Honolate Middleware in Hono

Import the `i18n` middleware and use it in your Hono application:

```typescript
import { Hono } from "@hono/hono";
import { jsxRenderer } from "@hono/hono/jsx-renderer";
import { i18n } from "./i18n.ts";

const app = new Hono()
  .use(jsxRenderer(), i18n)
  .get("/", (c) => {
    // [...]
  });

Deno.serve(app);
```

### Eager strings

You can use eager strings for immediate translation:

```typescript
import { t } from "@wuespace/honolate";

c.render(
  <div>
    <h1>{t`Hello world!`}</h1>
    <p>{t`We can also use variables like ${new Date()}.`}</p>
  </div>,
);
```

### Lazy strings

Sometimes, you need to define strings outside of a component context. In this
case, you can use lazy strings:

```typescript
import { lt } from "@wuespace/honolate";

export const greeting = lt`Hello world!`;
```

Later, inside a component, you can resolve the lazy string using the `t`
function:

```typescript
import { t } from "@wuespace/honolate";
import { greeting } from "./greeting.ts";

c.render(
  <div>
    <h1>{t(greeting)}</h1>
  </div>,
);
```

### Updating localization files

Whenever you add new terms to your code, you can update the localization files
by re-running the `i18n.ts` script:

```bash
./i18n.ts
```

This will scan your code for new terms and add them to the respective locale
files.

Note that the middleware automatically loads the localization files on startup,
so you can just edit the JSON files, restart your application, and see the
changes immediately.

## About the name

The name "Honolate" is a combination of "Hono" and "translate", reflecting its
purpose as a localization library for the Hono framework. It also is a play on
the fact that lazy strings are only translated when needed (late), allowing for
a more powerful and flexible localization approach.
