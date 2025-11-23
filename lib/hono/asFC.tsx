import type { FC } from '@hono/hono/jsx';

/**
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
export function asFC(X: FC) {
	return <X />;
}
