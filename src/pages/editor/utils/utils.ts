import { DescriptorPropTypes } from "../types/descriptor/props-descriptor";

export function isDescritporPropType(
  value: string
): value is DescriptorPropTypes {
  return value in DescriptorPropTypes;
}
