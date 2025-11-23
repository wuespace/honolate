import type { JsonPath } from "./JsonPath.ts";

/**
 * Options for initializing Honolate middleware in a Hono application.
 */
export interface InitHonolateOptions<T extends string> {
  /**
   * The default language to fall back to when no specific language is set or detected.
   */
  readonly defaultLanguage: T;
  /**
   * A mapping of supported languages to their respective JSON path files containing localization data.
   */
  readonly languages: Readonly<
    {
      [key in T]: JsonPath;
    }
  >;
  /**
   * A global pattern for files to search for localization keys.
   */
  pattern?: string;
}
