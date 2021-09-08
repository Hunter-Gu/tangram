import { DescriptorPropTypes } from "../types/descriptor/props-descriptor";
import { transformer } from "./transformer";
import Wrapper from "./components/wrapper";
import { ElInput, ElSwitch } from "element-plus";

export * from "./transform";
export * from "./transformer";

// TODO better type definition for static props
transformer
  .configRoot(Wrapper)
  // @ts-ignore
  .configGlobal(DescriptorPropTypes.Boolean, ElSwitch)
  // @ts-ignore
  .configGlobal(DescriptorPropTypes.String, ElInput)
  // @ts-ignore
  .configGlobal(DescriptorPropTypes.Number, ElInput, { type: "number" });
