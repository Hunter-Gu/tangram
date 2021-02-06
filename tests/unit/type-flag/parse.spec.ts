import { parse } from "@/components/schema-render/core/parsers/type-flag/parse";

describe("type flag / parse", () => {
  it('--string "hello world"', () => {
    const str = '--string "hello world"';
    expect(parse(str)).toEqual([
      {
        type: "string",
        value: '"hello world"',
        raw: str,
      },
    ]);
  });

  it("--number 12", () => {
    const str = "--number 12";
    expect(parse(str)).toEqual([
      {
        type: "number",
        value: "12",
        raw: str,
      },
    ]);
  });

  it("--boolean true", () => {
    const str = "--boolean true";
    expect(parse(str)).toEqual([
      {
        type: "boolean",
        value: "true",
        raw: str,
      },
    ]);
  });

  it('--string "hello world" --number 12 --boolean true', () => {
    const str1 = '--string "hello world"';
    const str2 = "--number 12";
    const str3 = "--boolean true";
    const str = `${str1} ${str2} ${str3}`;
    expect(parse(str)).toEqual([
      {
        type: "string",
        value: '"hello world"',
        raw: str1,
      },
      {
        type: "number",
        value: "12",
        raw: str2,
      },
      {
        type: "boolean",
        value: "true",
        raw: str3,
      },
    ]);
  });
});
