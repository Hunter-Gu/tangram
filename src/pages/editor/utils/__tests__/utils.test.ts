import { DescriptorPropTypes } from "../../types/descriptor";
import { isDescritporPropType } from "../utils";

describe("Utils of page /editor", () => {
  it("The isDescritporPropType() will return true if filed is in enum DescriptorPropTypes", () => {
    expect(isDescritporPropType(DescriptorPropTypes.String)).toBe(true);
    expect(isDescritporPropType("a")).toBe(false);
  });
});
