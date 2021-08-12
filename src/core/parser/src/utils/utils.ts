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
  obj: Object,
  path: string,
  defaultValue?: T
) {
  const keys = path.split(".").filter(Boolean);
  let key = "";
  while ((key = keys.shift()!)) {
    if (key in obj) {
      obj = obj[key];
    } else {
      return defaultValue;
    }
  }
  return obj;
}
