import { validString } from "@/components/schema-render/core/type-flag/utils";

describe("type flag / utils", () => {
  it('"the string "Hello World"" is valid string', () => {
    const str = 'the string "Hello World"';
    expect(validString(str)).toEqual(true);
  });

  it('"the string "Hello World"" is valid string', () => {
    const str = 'the string \\"Hello World\\"';
    expect(validString(str)).toEqual(true);
  });

  it('"the string "Hello World" is invalid string', () => {
    const str = 'the string "Hello World';
    expect(validString(str)).toEqual(false);
  });

  it('"the string \\"Hello World"" is valid string', () => {
    const str = 'the string \\"Hello World"';
    expect(validString(str)).toEqual(false);
  });
});
