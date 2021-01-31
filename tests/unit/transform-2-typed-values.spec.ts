import { transform2TypedValues } from "@/components/schema-render/core/parsers/type-flag";

describe("transform to typed values", () => {
  test("--number 1 --boolean false", () => {
    const str = "--number 1 --boolean false";
    expect(transform2TypedValues(str)).toEqual([1, false]);
  });

  test(`--string "hello  world " --number 12 --boolean true --string "HELLO WORLD"`, () => {
    const str = `--string "hello  world " --number 12 --boolean true --string "HELLO WORLD"`;
    expect(transform2TypedValues(str)).toEqual([
      "hello  world ",
      12,
      true,
      "HELLO WORLD",
    ]);
  });

  test('--object [key1][key11]: --number 12 [key1][key12]: --boolean true [key2][key21]: --string "hello world"', () => {
    const str =
      '--object [key1][key11]: --number 12 [key1][key12]: --boolean true [key2][key21]: --string "hello world"';
    expect(transform2TypedValues(str)).toEqual([
      {
        key1: {
          key11: 12,
          key12: true,
        },
        key2: {
          key21: "hello world",
        },
      },
    ]);
  });
});
