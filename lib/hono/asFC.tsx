import type { FC } from "@hono/hono/jsx";

/**
 * @deprecated This is no longer necessary as of Honolate v0.2.0, since `t` can now be used directly in route handlers.
 * Previously, `t` used the request context, which was only available inside functional components.
 * Now, `t` uses AsyncLocalStorage to access the localization context, making it usable directly in route handlers.
 *
 * @remarks
 * Converts a JSX element into a functional component.
 *
 * This is necessary to add support for hooks like `useRequestContext` within the element,
 * which is necessary for the `t` function.
 *
 * @example
 * ```tsx
 * import { asFC } from './lib/hono/asFC.tsx';
 * import { useRequestContext } from '@hono/hono/jsx-renderer';
 *
 * // [...inside a Hono route handler...]
 *
 * // works:
 * return c.render(
 *   asFC(() => {
 *     return <div>Message: {t`abc`}</div>;
 *   })
 * );
 *
 * // doesn't work:
 * return c.render(
 *   <div>Message: {t`abc`}</div>
 * );
 * ```
 *
 * @param X the element to convert
 * @returns an instance of the functional component
 *
 * @see {@link t}
 */
export function asFC(X: FC): string | Promise<string> {
  return <X />;
}
