import { extractTypeFromFlag, isTypeFlag } from "./flag";
import { DEFAULT_TRANSFORMER, getTransformer, TYPE_TRANSFORMER } from "./types";

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
  const segment: string[] = str.split(/\s+/);
  const resultsCache = [];
  let value: string | undefined = "";
  let transformer: Function | null = null;

  while ((value = segment.shift())) {
    if (isTypeFlag(value)) {
      transformer = getTransformerByFlagType(value);
    } else {
      transformer = transformer || DEFAULT_TRANSFORMER;
      resultsCache.push(transformer(value));
      transformer = null;
    }
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
