import { registry } from "../../utils/registry";
import { getAllElementPlusComponents } from "../../../../plugins/element-plus";
import {
  ElInput,
  getDescriptor as getElInputDescriptor,
} from "./resources/el-input";
import {
  ElButton,
  getDescriptor as getElButtonDescriptor,
} from "./resources/el-button";

function getAll() {
  const components = getAllElementPlusComponents();

  registry
    .register(ElInput, getElInputDescriptor(components))
    .register(ElButton, getElButtonDescriptor(components));

  return registry.getAll();
}

export { getAll };
