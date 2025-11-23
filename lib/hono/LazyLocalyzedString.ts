import type { LocalyzedStringValue } from "./LocalyzedStringValue.ts";

/**
 * A lazily evaluated localized string with a key and optional values for interpolation.
 *
 * Gets resolved later – when the locale is known – using the {@link import("t.ts").t} function.
 */
export type LazyLocalyzedString = {
  /**
   * The localization key used to look up the localized string.
   */
  localizationKey: string;
  /**
   * An array of values to be interpolated into the localized string.
   *
   * `"{i}"` gets replaced by the i-th value in this array. `"\{i}"` can be used to escape the `"{"` character.
   */
  values: LocalyzedStringValue[];
};
