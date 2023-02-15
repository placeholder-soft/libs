export function arrayJoin<T>(
  separator: (info: { index: number }) => T,
  inputArray: T[]
): T[] {
  return inputArray.reduce((outputArray: T[], child, index) => {
    outputArray.push(child);

    if (index < inputArray.length - 1) {
      outputArray.push(separator({ index }));
    }

    return outputArray;
  }, []);
}

export function hasAny<T>(ary: T[]): ary is [T, ...T[]];
export function hasAny<T>(ary: readonly T[]): ary is readonly [T, ...T[]];
export function hasAny<T>(ary: readonly T[]): ary is readonly [T, ...T[]] {
  return ary.length > 0;
}

export function oneOf<T extends string[]>(
  ...coll: T
): (input: unknown) => input is T[number];
export function oneOf<T extends any[]>(
  ...coll: T
): (input: unknown) => input is T[number];
export function oneOf<T extends any[]>(
  ...coll: T
): (input: unknown) => input is T[number] {
  return ((input: unknown) => coll.includes(input)) as any;
}

export function first<T>(ary: [T, ...T[]]): T;
export function first<T>(ary: [...T[], T]): T;
export function first<T>(ary: T[]): undefined | T;
export function first<T>(ary: T[]): undefined | T {
  return ary[0];
}

export function last<T>(ary: readonly [T, ...T[]]): T;
export function last<T>(ary: readonly [...T[], T]): T;
export function last<T>(ary: readonly T[]): undefined | T;
export function last<T>(ary: readonly T[]): undefined | T {
  return ary[ary.length - 1];
}

export function sample<T>(ary: [T, ...T[]]): T;
export function sample<T>(ary: [...T[], T]): T;
export function sample<T>(ary: T[]): undefined | T;
export function sample<T>(ary: T[]): undefined | T {
  if (!hasAny(ary)) return;
  const idx = Math.round(Math.random() * 10) % ary.length;
  return ary[idx]!;
}
