import { getTransformer } from "./types";

export const FLAG_PREFIX = "--";

/**
 * @desc check if it's type flag format
 * @param str e.g --boolean
 */
export function isTypeFlag(str: string) {
  return new RegExp(`^${FLAG_PREFIX}\\w+$`).test(str);
}

/**
 * @desc extract type from type flags
 * @example --boolean -> boolean
 * @param str
 */
export function extractTypeFromFlag(str: string) {
  const type = new RegExp(`^${FLAG_PREFIX}(\\w+)$`).exec(str);

  // it will never run into this case if call `isTypeFlag()` function before.
  if (!type) {
    throw new Error(`Invalid type flag ${str}`);
  }

  return type[1];
}

/**
 * @desc if it's handing string type, pure means start with ", end with "
 * @param value
 */
export function isInPureStringMode(value: string) {
  if (value[0] !== '"') {
    throw new Error(
      'Format error. String type value must start with ". accept: ' + value
    );
  }

  const len = value.length;
  // 字符串未结束
  return !(value[len - 1] === '"' && value[len - 2] !== "\\");
}

/**
 * @desc if it's handling object type
 * @example `[key1][key2]:`
 * @param value
 */
const OBJECT_KEY = `(\\[\\w+\\])+:`;
const OBJECT_VALUE = `(\\s+--\\w+\\s+(\\w+|".+")\\s+)`;
export function isInObjectMode(value: string) {
  return new RegExp(`(^${OBJECT_KEY}${OBJECT_VALUE})*${OBJECT_KEY}$`).test(
    value
  );
}

/**
 * @desc check if it's complete object format
 * @example `[key1][key2]: --number 12`
 * @param value
 */
export function isFullObjectMode(value: string) {
  return new RegExp(`^(${OBJECT_KEY}${OBJECT_VALUE})+$`).test(value + " ");
}

/**
 * @desc get transform function from flag type
 * @example `'--boolean'` -> `Boolean()`
 * @param flag
 */
export function getTransformerByFlagType(flag: string) {
  const type = extractTypeFromFlag(flag);

  const transformer = getTransformer(type);

  if (!transformer) {
    throw new Error(`Can't find a transformer for type flag ${type}`);
  }

  return transformer;
}

/**
 * @desc read next chunk of string.(chunk: split by spaces)
 * @param str
 */
export function readNextChunk(str: string) {
  return str.trim().split(/\s+/).shift() || "";
}
