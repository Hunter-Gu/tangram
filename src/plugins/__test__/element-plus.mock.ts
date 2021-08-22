import { config } from "@vue/test-utils";
import { ElTree } from "element-plus";

config.global.stubs = {
  ElTree,
};
