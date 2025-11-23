export function neverThrow<T>(fn: () => T): T | Error {
	try {
		return fn();
	} catch (err) {
		if (err instanceof Error) {
			return err;
		} else {
			return new Error('An unknown error occurred.', { cause: err });
		}
	}
}
