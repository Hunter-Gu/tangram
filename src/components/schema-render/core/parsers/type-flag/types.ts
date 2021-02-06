import {
  getTransformerByFlagType,
  isInObjectMode,
  isInStringMode,
} from "./index";
import { isTypeFlag } from "./flag";
import { set } from "../../utils";

export const TYPES = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  OBJECT: "object",
  ARRAY: "array",
  NULL: "null",
  UNDEFINED: "undefined",
};

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
  string: toString,
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
 * @desc 因为 string 的首位有多余的 " 需要截取
 * @param value
 */
function toString(value: string) {
  const len = value.length;
  return value.substr(1, len - 2);
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

function toObject(str: string) {
  let value = "";
  let transformer: Function | null = null;
  const obj: Record<string, unknown> = {};
  const keys: string[] = [];

  while (str.length || value) {
    const char = str.substr(0, 1);
    // 后移一位
    str = str.substr(1);
    if (char.trim()) {
      value += char;
      continue;
    }

    // 收集 key
    if (isInObjectMode(value)) {
      value.replace(/\[(\w+)\]/g, (_, key: string) => {
        keys.push(key);
        return key;
      });
    } else if (isTypeFlag(value)) {
      transformer = getTransformerByFlagType(value);
    } else if (
      transformer === TYPE_TRANSFORMER.string &&
      isInStringMode(value)
    ) {
      value += char;
      continue;
    } else if (transformer) {
      set(obj, keys, transformer(value));
      keys.length = 0;
      transformer = null;
    }

    value = "";
  }

  return obj;
}

function toArray() {}

function toNull() {
  return null;
}

function toUndefined() {
  return undefined;
}
