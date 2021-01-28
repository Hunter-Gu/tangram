import { isUndefined } from "@/components/schema-render/core/utils";

describe("schema-render utils", () => {
  test("isUndefined", () => {
    const undef = undefined;

    expect(isUndefined(undef)).toBe(true);
  });
});
