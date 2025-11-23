import { fileURLToPath } from 'node:url';

export function normalizePath(path: string): string {
	if (path.startsWith('file://')) {
		return fileURLToPath(path);
	}
	return path;
}
