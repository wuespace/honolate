export function unescapeKey(key: string): string {
  return key.replaceAll(/\\{/g, "{").replaceAll(/\\\\/g, "\\");
}
