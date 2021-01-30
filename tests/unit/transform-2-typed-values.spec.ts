import { transform2TypedValues } from "@/components/schema-render/core/parsers/type-flag";

describe("transform to typed values", () => {
  test("--number 1 --boolean false", () => {
    const str = "--number 1 --boolean false";
    expect(transform2TypedValues(str)).toEqual([1, false]);
  });

  test("hello world --number 12 --boolean true HELLO WORLD", () => {
    const str = "hello world --number 12 --boolean true HELLO WORLD";
    expect(transform2TypedValues(str)).toEqual([
      "hello",
      "world",
      12,
      true,
      "HELLO",
      "WORLD",
    ]);
  });
});
