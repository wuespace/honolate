import type { FC } from "@hono/hono/jsx";
import type { LazyLocalizedString } from "./LazyLocalizedString.ts";

/**
 * A value passed into a localized string for interpolation.
 *
 * This can be a string, number, or another {@link LazyLocalizedString} for nested localization.
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
 * You could create a `LazyLocalizedString` for `welcomeMessage` that includes another
 * `LazyLocalizedString` for `greeting` as its first value:
 *
 * ```ts
 * const lazyGreeting: LazyLocalizedString = {
 *   localizationKey: "greeting",
 *   values: ["Alice"]
 * };
 *
 * const lazyWelcomeMessage: LazyLocalizedString = {
 *   localizationKey: "welcomeMessage",
 *   values: [lazyGreeting]
 * };
 * ```
 */
export type LocalizedStringValue =
  | string
  | number
  | LazyLocalizedString
  | ReturnType<FC>;
