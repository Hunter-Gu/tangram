import { id } from "../id";

describe("Util function id", () => {
  it("The `id()` function just return the argument", () => {
    const obj = { a: 1 };

    expect(id("a")).toBe("a");

    expect(id(obj)).toStrictEqual(obj);
  });
});
