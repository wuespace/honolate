import { HTTPException } from "@hono/hono/http-exception";
import type { LazyLocalizedString } from "./LazyLocalizedString.ts";

/**
 * Options for creating a LocalizedError.
 */
export interface LocalizedHttpExceptionOptions {
  /**
   * Technical message for this error. Logged for debugging purposes.
   * This is the only message guaranteed to be logged.
   */
  readonly technicalMessage?: string;
  /**
   * HTTP status code to be used for this error.
   * Defaults to 500 (Internal Server Error).
   */
  readonly status?: HTTPException["status"];
  /**
   * Optional cause of this error. Logged for debugging purposes.
   */
  readonly cause?: unknown;
  /**
   * Localized title for this error. Shown to the user.
   */
  readonly localizedTitle?: LazyLocalizedString;
  /**
   * Localized message for this error. Shown to the user.
   */
  readonly localizedMessage?: LazyLocalizedString;
}

/**
 * An HTTP exception that supports localization.
 *
 * Contains both technical details for logging and user-friendly localized messages.
 *
 * Use {@link fromCause} to convert arbitrary errors / exceptions into LocalizedHttpExceptions.
 *
 * By logging the LocalizedHttpException, the technical message and cause are preserved for debugging purposes.
 * Logs and user messages can be correlated using the {@link errorId}.
 *
 * See {@link LocalizedHttpExceptionOptions} for details on the available options.
 *
 * @example
 *
 * ```ts
 * throw new LocalizedHttpException({
 *   technicalMessage: "Database connection failed",
 *   status: 503,
 *   localizedTitle: lt`Service Unavailable`,
 *   localizedMessage: lt`The service is currently unavailable. Please try again later.`,
 * });
 * ```
 *
 * @example
 *
 * ```ts
 * router.onError((err, c) => {
 *   const localizedError = LocalizedHttpException.fromCause(err);
 *   console.error("[router]", localizedError);
 *   c.status(localizedError.status || 500);
 *   return c.render(
 *     <>
 *       <h1>{ t(localizedError.options.localizedTitle ?? lt`Unknown Error`)}</h1>
 *       <p>{ t(localizedError.options.localizedMessage ?? lt`An unexpected error occurred while processing your request.`) }</p>
 *       <p>{ t(`Please specify the following error ID when contacting support:`) }</p>
 *       <pre><code>{ localizedError.errorId }</code></pre>
 *     </>
 *   );
 * });
 * ```
 */
export class LocalizedHttpException extends HTTPException {
  /**
   * Unique error ID for this exception instance.
   * Used for correlating logs with user reports.
   *
   * Format: ISO timestamp + "-" + first 8 characters of a UUIDv4
   */
  public readonly errorId: string = new Date().toISOString() + "-" +
    crypto.randomUUID().substring(0, 8);

  /**
   * Creates a new LocalizedHttpException.
   * Use {@link fromCause} to convert arbitrary errors / exceptions into LocalizedHttpExceptions.
   * @param options the options for the error. See {@link LocalizedHttpExceptionOptions} for details
   */
  constructor(
    public readonly options: LocalizedHttpExceptionOptions = {},
  ) {
    super(options.status ?? 500, {
      ...options,
    });
    this.message = `<${this.errorId}> ${options.technicalMessage}`;
  }

  /**
   * Converts an arbitrary error into a LocalizedHttpException.
   *
   * Useful for error handlers that can receive any kind of error.
   * After conversion, the returned LocalizedHttpException can be used to
   * retrieve localized messages for the user.
   *
   * By logging the returned LocalizedHttpException, the technical message
   * and cause are preserved for debugging purposes.
   * Logs and user messages can be correlated using the {@link errorId}.
   * @param error the original error
   * @returns a corresponding {@link LocalizedHttpException}
   */
  static fromCause(
    error: unknown,
  ): LocalizedHttpException {
    if (error instanceof LocalizedHttpException) {
      return error;
    }
    if (error instanceof HTTPException) {
      return new LocalizedHttpException({
        technicalMessage: error.message,
        status: error.status,
        cause: error,
      });
    }
    return new LocalizedHttpException({
      technicalMessage: "Unknown error (see cause for details)",
      cause: error,
    });
  }
}
