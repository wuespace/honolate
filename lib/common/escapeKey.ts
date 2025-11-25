export function escapeKey(key: string): string {
  // Escape all backslashes first
  key = key.replace(/\\/g, "\\\\");
  // Then escape curly braces
  return key.replace(/[{]/g, "\\{");
}
