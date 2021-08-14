import { get, isUndefined, set } from "../utils";

describe("Parser utils functions", () => {
  it("It will return true when `isUndefined()` received undefined value", () => {
    const undef = undefined;

    expect(isUndefined(undef)).toBe(true);
  });

  describe("The `get()` will return value of target property by string path", () => {
    it("It will return value of target property when property exists", () => {
      const data = {
        a: {
          b: {
            c: "c",
          },
        },
      };

      expect(get(data, "a.b.c")).toBe("c");
    });

    it("It will return defalut value when property not exists", () => {
      const data = {
        a: {
          b: {
            c: "c",
          },
        },
      };

      expect(get(data, "1.2.3", "a")).toBe("a");
    });
  });

  describe("The `set()` can set the value of target property by string path", () => {
    it("It will overwrite the value of target property when property exists", () => {
      const obj = {
        a: {
          b: {
            c: "c",
          },
        },
      };

      set(obj, "a.b.c", "Hello World");
      expect(obj).toEqual({
        a: {
          b: {
            c: "Hello World",
          },
        },
      });
    });

    it("It will add property and set value when property not exists", () => {
      const obj = {
        a: "a",
      };

      set(obj, "1.2.3", "a");

      expect(obj).toEqual({
        a: "a",
        1: {
          2: {
            3: "a",
          },
        },
      });
    });
  });
});
