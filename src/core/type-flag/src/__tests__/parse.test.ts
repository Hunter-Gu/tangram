import { simpleParse, parse } from "../parse";

describe("type flag / parse", () => {
  it('--string "hello world"', () => {
    const str = '--string "hello world"';

    expect(simpleParse(str)).toEqual({
      type: "string",
      value: '"hello world"',
      raw: str,
    });
  });

  it("--number 12", () => {
    const str = "--number 12";
    expect(simpleParse(str)).toEqual({
      type: "number",
      value: "12",
      raw: str,
    });
  });

  it("--boolean true", () => {
    const str = "--boolean true";
    expect(simpleParse(str)).toEqual({
      type: "boolean",
      value: "true",
      raw: str,
    });
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

  it("--object [key1.key11]: --number 12 [key1][key12]: --boolean true", () => {
    const key1 = "[key1.key11]:";
    const str1 = "--number 12";
    const key2 = "[key1][key12]:";
    const str2 = "--boolean true";
    const str = `--object ${key1} ${str1} ${key2} ${str2}`;

    expect(parse(str)).toEqual([
      {
        type: "object",
        raw: str,
        value: {
          [key1]: {
            type: "number",
            value: "12",
            raw: str1,
          },
          [key2]: {
            type: "boolean",
            value: "true",
            raw: str2,
          },
        },
      },
    ]);
  });

  it('--string "hello world" --object [key1.key11]: --number 12 [key1][key12]: --boolean true --number 12', () => {
    const seg1 = '--string "hello world"';
    const key1 = "[key1.key11]:";
    const str1 = "--number 12";
    const key2 = "[key1][key12]:";
    const str2 = "--boolean true";
    const seg2 = `--object ${key1} ${str1} ${key2} ${str2}`;
    const seg3 = "--number 12";
    const str = `${seg1} ${seg2} ${seg3}`;

    expect(parse(str)).toEqual([
      {
        raw: seg1,
        type: "string",
        value: '"hello world"',
      },
      {
        type: "object",
        raw: seg2,
        value: {
          "[key1.key11]:": {
            type: "number",
            value: "12",
            raw: str1,
          },
          "[key1][key12]:": {
            type: "boolean",
            value: "true",
            raw: str2,
          },
        },
      },
      {
        raw: seg3,
        type: "number",
        value: "12",
      },
    ]);
  });
});
