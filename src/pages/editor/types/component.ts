import type { DescriptorPropName } from "./descriptor";
import { ComponentInfo } from "./transform";

export type ComponentProp = Readonly<
  DescriptorPropName & {
    defaultValue?: any;
  }
>;
