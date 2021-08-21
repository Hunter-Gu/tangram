import { Ref } from "../ref";

describe("Ref", () => {
  it("The Ref is just like Map, set key by `init()` and get the value of key by `get()`", () => {
    const ref = new Ref();

    ref.init("name");
    expect(ref.get("name")).toBe(null);
  });
});
