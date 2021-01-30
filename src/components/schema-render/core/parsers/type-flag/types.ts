export const SHORTHAND = {
  s: "string",
  n: "number",
  b: "boolean",
  o: "object",
  a: "array",
  nu: "null",
  u: "undefined",
};

export const TYPE_TRANSFORMER = {
  string: String,
  number: Number,
  boolean: toBoolean,
  object: toObject,
  array: toArray,
  null: toNull,
  undefined: toUndefined,
};

/**
 * @desc 获取将值转换为特定类型的函数
 */
type ShorthandKey = keyof typeof SHORTHAND;
type TrasnformerKey = keyof typeof TYPE_TRANSFORMER;
export function getTransformer(type: string | ShorthandKey) {
  if (type in SHORTHAND) {
    type = SHORTHAND[type as ShorthandKey];
  }

  return type in TYPE_TRANSFORMER
    ? TYPE_TRANSFORMER[type as TrasnformerKey]
    : null;
}

/**
 * @desc 将字符串 'true' 或 'false' 转换为 boolean
 * @param str
 */
function toBoolean(str: string): boolean | never {
  if (str === "true") {
    return true;
  } else if (str === "false") {
    return false;
  } else {
    throw new Error(
      `Only "true" and "false" can transform to boolean, string "${str}" can't transform to boolean`
    );
  }
}

function toObject() {}

function toArray() {}

function toNull() {
  return null;
}

function toUndefined() {
  return undefined;
}
