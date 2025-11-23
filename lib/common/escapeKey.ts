export function escapeKey(key: string): string {
	return key.replaceAll(/{/g, '\\{');
}
