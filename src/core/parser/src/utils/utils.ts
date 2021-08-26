export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

export function set(
  obj: Record<string, unknown>,
  keys: string,
  value: unknown
) {
  const _keys = keys.split(".");
  let temp: Record<string, unknown> = obj;

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

export function get<T extends unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T {
  let value: Record<string, unknown> | undefined | T = obj;
  const keys = path.split(".").filter(Boolean);
  let key: string | undefined = "";
  while ((key = keys.shift())) {
    // TODO fix type definition
    // @ts-ignore
    if (key in value) {
      // TODO fix type definition
      // @ts-ignore
      value = value[key];
    } else {
      return defaultValue as T;
    }
  }
  return value as T;
}
