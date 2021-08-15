import type { DescriptorPropName } from "./descriptor/props-descriptor";

export type ComponentProp = Readonly<
  DescriptorPropName & {
    defaultValue: unknown;
  }
>;
