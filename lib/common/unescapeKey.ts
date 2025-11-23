/**
 * Reverses a simple brace-escaping convention by converting all double opening
 * braces `{{` to single `{` and all double closing braces `}}` to single `}`.
 *
 * This is useful when a preceding process has escaped literal curly braces
 * by doubling them (e.g. in template systems that reserve single `{` / `}` for
 * placeholders). Calling `unescapeKey` restores the original, single-brace form.
 *
 * The replacements are global and non-overlapping:
 * - Every exact `{{` sequence becomes `{`.
 * - Every exact `}}` sequence becomes `}`.
 *
 * Note: Because matches do not overlap, sequences like `{{{` become `{{`
 * (first two braces collapse to one, leaving the remaining brace unchanged).
 *
 * @param key - The input string potentially containing escaped double braces.
 * @returns A new string with all `{{` replaced by `{` and all `}}` replaced by `}`.
 *
 * @example
 * unescapeKey('Hello {{world}}') // 'Hello {world}'
 *
 * @example
 * unescapeKey('{{path}}/{{to}}/{{resource}}') // '{path}/{to}/{resource}'
 *
 * @example
 * unescapeKey('No escaping here') // 'No escaping here'
 */
export function unescapeKey(key: string): string {
	return key.replace(/{{/g, '{').replace(/}}/g, '}');
}
