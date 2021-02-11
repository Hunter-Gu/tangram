import { TYPES } from "@/components/schema-render/core/type-flag/types";
import { parse } from "../../../src/components/schema-render/core/type-flag/parse";

export function simpleTypeHandler(str: string) {
  let handlingType = "";
  let handlingValue = "";
  let handlingChar = "";

  parse(str, {
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

export function typesHandler(str: string) {
  const res: object[] = [];
  let handlingType = "";
  let handlingValue: string | object = "";
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
    });

    restAll();
  };

  parse(str, {
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
        handlingValue = handlingValue || {
          type: handlingType,
          raw: handlingChar.trim(),
          value: {},
        };
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
