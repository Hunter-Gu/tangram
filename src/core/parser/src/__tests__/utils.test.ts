import { isUndefined, set } from "../utils/utils";

describe("schema-render utils", () => {
  test("isUndefined", () => {
    const undef = undefined;

    expect(isUndefined(undef)).toBe(true);
  });

  test("set", () => {
    const obj = {};
    set(obj, "key1.key2", "Hello World");
    expect(obj).toEqual({
      key1: {
        key2: "Hello World",
      },
    });
  });
});
