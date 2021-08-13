import { TYPE_TRANSFORMER } from "../types";
import { getTransformerByFlagType } from "../utils";

describe("get transformer by type flags", () => {
  test("getTransformerByFlagType return Boolean", () => {
    const boolStr = "--boolean";

    expect(getTransformerByFlagType(boolStr)).toEqual(TYPE_TRANSFORMER.boolean);
  });

  test("getTransformerByFlagType return Number", () => {
    const numStr = "--number";

    expect(getTransformerByFlagType(numStr)).toEqual(TYPE_TRANSFORMER.number);
  });

  test("getTransformerByFlagType return String", () => {
    const strStr = "--string";

    expect(getTransformerByFlagType(strStr)).toEqual(TYPE_TRANSFORMER.string);
  });

  test("getTransformerByFlagType return toArray", () => {
    const arrStr = "--array";

    expect(getTransformerByFlagType(arrStr)).toEqual(TYPE_TRANSFORMER.array);
  });

  test("getTransformerByFlagType return toObject", () => {
    const objStr = "--object";

    expect(getTransformerByFlagType(objStr)).toEqual(TYPE_TRANSFORMER.object);
  });

  test("getTransformerByFlagType return toNull", () => {
    const nullStr = "--null";

    expect(getTransformerByFlagType(nullStr)).toEqual(TYPE_TRANSFORMER.null);
  });

  test("getTransformerByFlagType return toUndefined", () => {
    const undefStr = "--undefined";

    expect(getTransformerByFlagType(undefStr)).toEqual(
      TYPE_TRANSFORMER.undefined
    );
  });
});
