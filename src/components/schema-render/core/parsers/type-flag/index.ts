import { extractTypeFromFlag, FLAG_PREFIX, isTypeFlag } from "./flag";
import { getTransformer, TYPE_TRANSFORMER } from "./types";

const DEFAULT_TYPE_PARAMS = `-s`;

/**
 * @desc 将参数解析、转换为指定类型的值
 * @param str 参数的字符串形式，待转换。
 * @example
 *  `--number 1 --boolean false --object [key1][key2]: --number 3`
 *  会被转换为
 *  [1, false, { key1: { key2: 3 }}]
 */
export function transform2TypedValues(str: string) {
  const resultsCache: unknown[] = [];
  let value: string = "";
  let transformer: Function | null = null;

  // `|| value` 用于确保最后一次执行
  while (str.length || value) {
    const char = str.substr(0, 1);
    // 后移一位
    str = str.substr(1);
    if (char.trim()) {
      value += char;
      continue;
    }

    /***** （遇到了终止符、空格），得到一个完整的块 *****/
    if (isTypeFlag(value)) {
      transformer = getTransformerByFlagType(value);
    } else if (transformer) {
      switch (transformer) {
        case TYPE_TRANSFORMER.string: {
          if (isInStringMode(value)) {
            value += char;
            continue;
          }
          break;
        }
        case TYPE_TRANSFORMER.object: {
          if (isFullObjectMode(value)) {
            const next = readNextChunk(str);
            // object 结束
            if (!next || isTypeFlag(next)) {
              break;
            }
          }
          value += char;
          continue;
        }
      }

      resultsCache.push(transformer(value));
      transformer = null;
    } else {
      throw new Error(
        `Format error. A value must be labeled by a type flag. value: ${value}`
      );
    }

    value = "";
  }

  return resultsCache;
}

/**
 * @desc get transform function from flag type
 * @param flag eg `'--boolean'` -> `Boolean()`
 */
export function getTransformerByFlagType(flag: string) {
  const type = extractTypeFromFlag(flag);

  // it will never run into this case if call `isTypeFlag()` function before.
  if (!type) {
    throw new Error(`Invalid type flag ${flag}`);
  }

  const transformer = getTransformer(type[1]);

  if (!transformer) {
    throw new Error(`Can't find a transformer for type flag ${type}`);
  }

  return transformer;
}

/**
 * @desc 是否在处理字符串（以 " 开头，以 " 结尾）
 * @param value
 */
export function isInStringMode(value: string) {
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
 * @desc 是否在处理对象 e.g `[key1][key2]:`
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
 * @desc 是否是完整的对象格式 e.g `[key1][key2]: --number 12`
 * @param value
 */
export function isFullObjectMode(value: string) {
  return new RegExp(`^(${OBJECT_KEY}${OBJECT_VALUE})+$`).test(value + " ");
}

/**
 * @desc 读取后一个块
 * @param str
 */
function readNextChunk(str: string) {
  return str.trim().split(/\s+/).shift();
}
