export function logger(...msg: any) {
  console.log(...msg);
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}
