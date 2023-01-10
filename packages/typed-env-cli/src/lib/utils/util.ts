export function uniqBy<T>(input: T[], by: (i: T) => string): T[] {
  const result = new Map<string, T>();
  for (const item of input) {
    if (result.has(by(item))) {
      continue;
    }
    result.set(by(item), item);
  }
  return Array.from(result.values());
}
