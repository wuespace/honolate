import type { LazyLocalyzedString } from "./LazyLocalyzedString.ts";

/**
 * A value passed into a localized string for interpolation.
 *
 * This can be a string, number, or another {@link LazyLocalyzedString} for nested localization.
 *
 * For example, given the localization entry:
 *
 * ```json
 * {
 *   "greeting": "Hello, {0}!",
 *   "welcomeMessage": "{0} Welcome to our site."
 * }
 * ```
 *
 * You could create a `LazyLocalyzedString` for `welcomeMessage` that includes another
 * `LazyLocalyzedString` for `greeting` as its first value:
 *
 * ```ts
 * const lazyGreeting: LazyLocalyzedString = {
 *   localizationKey: "greeting",
 *   values: ["Alice"]
 * };
 *
 * const lazyWelcomeMessage: LazyLocalyzedString = {
 *   localizationKey: "welcomeMessage",
 *   values: [lazyGreeting]
 * };
 * ```
 */
export type LocalyzedStringValue = string | number | LazyLocalyzedString;
