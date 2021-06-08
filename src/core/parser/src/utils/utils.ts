export function logger(...msg: any) {
  console.log(...msg);
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

export function set(
  obj: Record<string, unknown>,
  keys: string[],
  value: unknown
) {
  const _keys = [...keys];
  let temp: Record<string, unknown> = obj;
  let key: string = "";

  while (true) {
    const key = _keys.shift();
    if (!key) {
      return obj;
    }
    if (!_keys.length) {
      temp[key] = value;
    } else if (
      !(key in temp) ||
      (typeof temp[key] !== "object" && typeof temp[key] !== "function")
    ) {
      temp = temp[key] = {};
    } else {
      temp = temp[key] as Record<string, unknown>;
    }
  }
}
