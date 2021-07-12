import { DescriptorPropTypes } from "../types/descriptor";
import { transformer } from "./transformer";
import Wrapper from "./components/wrapper";
import { ElInput, ElSwitch } from "element-plus";

export * from "./transform";
export * from "./transformer";

// TODO better type definition for static props
transformer
  .configRoot(Wrapper)
  .configGlobal(DescriptorPropTypes.Boolean, ElSwitch)
  .configGlobal(DescriptorPropTypes.String, ElInput)
  .configGlobal(DescriptorPropTypes.Number, ElInput, { type: "number" });
