import { TYPES } from "./types";
import { isTypeFlag, extractTypeFromFlag, validString } from "./utils";

interface IHandler {
  type: (type: string) => void;
  value: (value: string) => void;
  char: (char: string) => void;
}

interface ParsedSimpleTypeFlag {
  type: string;
  raw: string;
  value: string;
}

export type ParsedObjectTypeFlagValue = Record<
  string,
  ParsedSimpleTypeFlag | ParsedObjectTypeFlag
>;

interface ParsedObjectTypeFlag {
  type: "object";
  raw: string;
  value: ParsedObjectTypeFlagValue;
}

export type ParsedTypeFlag = ParsedSimpleTypeFlag | ParsedObjectTypeFlag;

export function handle(str: string, handler: IHandler) {
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

export function simpleParse(str: string) {
  let handlingType = "";
  let handlingValue = "";
  let handlingChar = "";

  handle(str, {
    char(char: string) {
      handlingChar += char;
    },
    type(type: string) {
      handlingType = type;
    },
    value(value: string) {
      handlingValue = value;
    },
  });

  return {
    raw: handlingChar.trim(),
    type: handlingType,
    value: handlingValue,
  };
}

export function parse(str: string) {
  const res: ParsedTypeFlag[] = [];
  let handlingType = "";
  let handlingValue: string | ParsedTypeFlag = "";
  let handlingChar = "";

  let handlingObjectRaw = "";
  let handlingObjectKey = "";

  const restAll = () => {
    handlingType = "";
    handlingValue = "";
    handlingChar = "";
    handlingObjectRaw = "";
    handlingObjectKey = "";
  };

  const collectAndRest = () => {
    res.push({
      raw: handlingChar.trim(),
      type: handlingType,
      value: handlingValue,
    } as ParsedTypeFlag);

    restAll();
  };

  handle(str, {
    char(char: string) {
      handlingChar += char;
      handlingObjectRaw += char;
    },
    type(type: string) {
      if (handlingType === TYPES.OBJECT && !handlingObjectKey) {
        // new begin
        // @ts-ignore
        const temp = handlingChar.replace(handlingValue.raw, "");
        restAll();
        handlingChar = temp;
      }

      if (handlingType === TYPES.OBJECT && !!handlingObjectKey) {
        // @ts-ignore
        handlingValue.value[handlingObjectKey] = {
          type,
        };
      } else {
        handlingType = type;
      }
    },
    // object's key will trigger `value()` callback
    value(value: string) {
      if (handlingType !== TYPES.OBJECT) {
        handlingValue = value;
        collectAndRest();
      } else {
        // object type
        handlingValue =
          handlingValue ||
          ({
            type: handlingType,
            raw: handlingChar.trim(),
            value: {},
          } as ParsedTypeFlag);
        if (!handlingObjectKey) {
          handlingObjectKey = value;
          handlingObjectRaw = "";
        } else {
          // @ts-ignore
          const handlingObject = handlingValue.value[handlingObjectKey];
          // @ts-ignore
          handlingObject.value = value;
          // @ts-ignore
          handlingObject.raw = handlingObjectRaw.trim();
          // renew
          // @ts-ignore
          handlingValue.raw = handlingChar.trim();
          handlingObjectKey = "";
          handlingObjectRaw = "";
        }

        if (res.slice(-1)[0] !== handlingValue) {
          // @ts-ignore
          res.push(handlingValue);
        }
      }
    },
  });

  return res;
}
