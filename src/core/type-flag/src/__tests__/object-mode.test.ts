import { isFullObjectMode, isInObjectMode } from "../utils";

describe("type flag / object mode", () => {
  test("`[key1][key11]:` is in object mode", () => {
    const str = "[key1][key11]:";
    expect(isInObjectMode(str)).toEqual(true);
  });

  test("`[key1][key11]: --number 12 [key1][key12]:` is in object mode", () => {
    const str = "[key1][key11]: --number 12 [key1][key12]:";
    expect(isInObjectMode(str)).toEqual(true);
  });

  test("`[key1][key11]: --number 12` is full object mode", () => {
    const str = "[key1][key11]: --number 12";
    expect(isFullObjectMode(str)).toEqual(true);
  });

  test('`[key1][key11]: --string "hello world"` is full object mode', () => {
    const str = '[key1][key11]: --number "hello world"';
    expect(isFullObjectMode(str)).toEqual(true);
  });
});
