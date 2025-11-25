import { testClient } from "@hono/hono/testing";
import { expect } from "@std/expect";
import { describe, it } from "node:test";
import { app } from "../example/main.tsx";

const testApp = testClient(app);

describe("Hono + Honolate E2E", () => {
  describe("t function in different contexts", () => {
    const paths = [
      "text",
      "render",
      "component",
      "async-component",
      "async-component-alt",
    ] as const;
    for (const path of paths) {
      it(`GET /${path} should return localized 'Hello world!'`, async () => {
        const resDefault = await (await testApp[path].$get({})).text();
        const resEn = await (await testApp[path].$get({
          query: { lang: "en" },
        })).text();
        const resDe = await (await testApp[path].$get({
          query: { lang: "de" },
        })).text();

        expect(resDefault).toContain("Hello world!");
        expect(resEn).toContain("Hello world!");
        expect(resDe).toContain("Hallo Welt!");
      });
    }
  });
  describe("Untranslated text", () => {
    it("GET /untranslated should return untranslated text", async () => {
      const resDefaultResp = await testApp.untranslated.$get({});
      const resDefault = await resDefaultResp.text();
      const resEnResp = await testApp.untranslated.$get({
        query: { lang: "en" },
      });
      const resEn = await resEnResp.text();
      const resDeResp = await testApp.untranslated.$get({
        query: { lang: "de" },
      });
      const resDe = await resDeResp.text();

      expect(resDefault).toBe("Untranslated text");
      expect(resEn).toBe("Untranslated text");
      expect(resDe).toBe("Untranslated text");
    });
  });
  describe("Lazy translation term", () => {
    it("GET /lazy should return localized lazy term", async () => {
      const defaultResp = await testApp.lazy.$get({});
      const resDefault = await defaultResp.text();
      const resEn = await (await testApp.lazy.$get({
        query: { lang: "en" },
      })).text();
      const resDe = await (await testApp.lazy.$get({
        query: { lang: "de" },
      })).text();

      expect(resDefault).toBe("Lazy term");
      expect(resEn).toBe("Lazy term");
      expect(resDe).toBe("Fauler Begriff");
    });
  });
  describe("Escape test", () => {
    it("GET /escape-test should return correctly escaped text", async () => {
      const resObj = await testApp["escape-test"].$get({});
      const res = await resObj.text();
      expect(res).toBe("This text contains 1 {} curly braces and \\{{}}{0}.");
      const resDe = await (await testApp["escape-test"].$get({
        query: { lang: "de" },
      })).text();
      expect(resDe).toBe(
    const origConsoleError = console.error;
      );
    });
  });
  describe("Error handling and LocalizedHttpException", () => {
    const origConsoleLog = console.error;
    const logs = new Set();
    function before() {
      console.error = (...args) => {
      console.error = origConsoleError;
      };
    }
    function after() {
      logs.clear();
      console.error = origConsoleLog;
    }

    it("GET /trigger-500 should return localized error response", async () => {
      before();
      // @ts-expect-error testing purposes
      // @ts-expect-error - testClient type doesn't include trigger-500 route (valid for e2e test)
      // @ts-expect-error testing purposes
      const resEn = await (await testApp["trigger-500"].$get({
        query: { lang: "en" },
      })).json();
      // @ts-expect-error testing purposes
      const resDe = await (await testApp["trigger-500"].$get({
        query: { lang: "de" },
      })).json();

      expect(resDefault.title).toBe("Hello world!");
      expect(resDefault.message).toBe("Untranslated text");
      expect(resEn.title).toBe("Hello world!");
      expect(resEn.message).toBe("Untranslated text");
      expect(resDe.title).toBe("Hallo Welt!");
      expect(resDe.message).toBe("Untranslated text");

      expect(logs.size).toBe(3);
      after();
    });
  });
  describe("Locale", () => {
    it("GET /locale should return correct locale", async () => {
      const resDefault = await (await testApp.locale.$get({})).text();
      const resEn = await (await testApp.locale.$get({
        query: { lang: "en" },
      })).text();
      const resDe = await (await testApp.locale.$get({
        query: { lang: "de" },
      })).text();

      expect(resDefault).toBe("en");
      expect(resEn).toBe("en");
      expect(resDe).toBe("de");
    });
  });
});
