import { isInStringMode } from ".";
import { isTypeFlag, extractTypeFromFlag } from "./flag";
import { TYPES, TYPE_TRANSFORMER } from "./types";

export function parse(str: string) {
  const res = [];
  let value = "";
  let raw = "";
  let type = "";
  while (str.length || value) {
    const char = str.substr(0, 1);
    // 后移一位
    str = str.substr(1);

    raw += char;
    if (char.trim()) {
      value += char;
      continue;
    }

    /******** 处理完整的块 *********/

    // 处理 --type flag
    if (isTypeFlag(value)) {
      const matchType = extractTypeFromFlag(value);
      if (matchType) {
        type = matchType;
        value = "";
      } else {
        throw new Error(`Unknow type flag: ${value}`);
      }
      continue;
    } else if (type) {
      // 处理 value 时，一定会有 type 了
      if (inPending(type, value)) {
        value += char;
        continue;
      }
    } else {
      throw new Error("Format Error. Value must declared by a type flag!");
    }

    res.push({
      type,
      raw: raw.trim(),
      value,
    });
    raw = "";
    value = "";
  }

  return res;
}

function inPending(type: string, value: string) {
  switch (type) {
    case TYPES.STRING:
      return isInStringMode(value);
    case TYPES.NUMBER:
    case TYPES.BOOLEAN:
      return false;
    default:
      throw new Error(
        `Unknow type for pending. type: ${type}, value: ${value}`
      );
  }
}
