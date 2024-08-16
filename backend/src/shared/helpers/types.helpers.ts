export function isObject(input: any): boolean {
  return input !== null && typeof input === 'object' && !Array.isArray(input);
}
