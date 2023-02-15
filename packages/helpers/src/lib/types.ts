export type AnyFunc<Args extends any[] = any, Ret = any> = (
  ...args: Args
) => Ret;

export type OneOrMore<T> = [T, ...T[]];

export type Tail<T extends any[]> = T extends [any, ...infer U] ? U : never;

export type StringOnly<T> = Extract<T, string>;

export type NumberOnly<T> = Extract<T, number>;

export type SelectKeyByValue<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type RejectKeyByValue<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type CompactType<T> = { [K in keyof T]: T[K] };

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : DeepPartial<T[P]>;
};

export type Keyof<T extends AnyObject> = StringOnly<keyof T>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyObject = {};
