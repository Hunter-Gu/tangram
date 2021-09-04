export type Diff<T, U> = T extends U ? never : T;

export type PartialKeys<T, K> = Partial<T> & Pick<T, Diff<keyof T, K>>;
