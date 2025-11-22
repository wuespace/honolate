/**
 * Escapes curly braces in a string key by doubling them.
 *
 * This function replaces single curly braces with doubled curly braces,
 * which is commonly used to escape template literal syntax or special
 * characters in formatting strings.
 *
 * @param key - The string key to escape
 * @returns The escaped string with `{` replaced by `{{` and `}` replaced by `}}`
 *
 * @example
 * ```typescript
 * escapeKey("Hello {world}"); // Returns: "Hello {{world}}"
 * escapeKey("No braces");     // Returns: "No braces"
 * ```
 */
export function escapeKey(key: string): string {
  return key.replace(/{/g, "{{").replace(/}/g, "}}");
}
