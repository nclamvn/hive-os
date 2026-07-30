export type DeepCopy<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly unknown[]
      ? T[K]
      : DeepCopy<T[K]>;
};
