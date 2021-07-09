import { DescriptorPropTypes } from "../types/descriptor";
import { transformer } from "./transformer";

export * from "./transform";
export * from "./transformer";

// TODO default component
transformer
  .configRoot("div")
  .configGlobal(DescriptorPropTypes.Boolean, "div")
  .configGlobal(DescriptorPropTypes.String, "div")
  .configGlobal(DescriptorPropTypes.Number, "div");
