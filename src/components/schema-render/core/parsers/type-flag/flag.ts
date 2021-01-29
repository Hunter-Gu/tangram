export const FLAG_PREFIX = "--";

/**
 * @desc 判断是否是表示值类型的标记
 * @param str e.g --boolean
 */
export function isTypeFlag(str: string) {
  return new RegExp(`^${FLAG_PREFIX}\\w+$`).test(str);
}

/**
 * @desc 从类型标记中提取类型
 * @param str e.g --boolean -> boolean
 */
export function extractTypeFromFlag(str: string) {
  return new RegExp(`^${FLAG_PREFIX}(\\w+)$`).exec(str);
}
