import { isTypeFlag, extractTypeFromFlag, validString } from "./utils";
import { TYPES } from "./types";

interface IHandler {
  type: (type: string) => void;
  value: (value: string) => void;
  char: (char: string) => void;
}
export function parse(str: string, handler: IHandler) {
  let value = "";
  let type = "";

  while (str.length || value) {
    const char = str.substr(0, 1);

    handler.char(char);

    // 后移一位
    str = str.substr(1);

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
        handler.type(matchType);
      } else {
        throw new Error(`Unknow type flag: ${value}`);
      }
      continue;
    } else if (type) {
      // 处理 value 时，一定会有 type 了
      if (!validString(value)) {
        value += char;
        continue;
      }
      handler.value(value);
    } else {
      throw new Error("Format Error. Value must declared by a type flag!");
    }

    value = "";
  }
}
