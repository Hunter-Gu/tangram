import { getAllElementPlusComponents } from "../../../plugins/element-plus";
import { registry } from "../registry";
import {
  DescriptorPropTypes,
  PropsDescriptor,
  RenderDescriptor,
} from "../types/descriptor";

const ElInputDescriptor: PropsDescriptor = {
  name: "ElInput",
  props: [
    {
      name: "modelValue",
      label: "内容",
      type: DescriptorPropTypes.String,
      defaultValue: "Hello World!",
    },
    {
      name: "placeholder",
      label: "占位符",
      type: DescriptorPropTypes.String,
    },
    {
      name: "disabled",
      label: "禁用",
      type: DescriptorPropTypes.Boolean,
    },
  ],
};

const ElButtonDescriptor: PropsDescriptor = {
  name: "ElButton",
  props: [
    {
      name: "type",
      label: "类型",
      type: DescriptorPropTypes.String,
      defaultValue: "plain",
    },
  ],
};

function getAll() {
  const components = getAllElementPlusComponents();
  const ElInput = "ElInput";
  const descriptor: RenderDescriptor = {
    component: components[ElInput],
    descriptor: ElInputDescriptor,
    props: {
      disabled: true,
      placeholder: "hello world",
    },
  };

  const ElButton = "ElButton";
  const buttonDescritpor: RenderDescriptor = {
    component: components[ElButton],
    descriptor: ElButtonDescriptor,
    props: {
      disabled: true,
    },
  };

  registry.register(ElInput, descriptor).register(ElButton, buttonDescritpor);

  return registry.getAll();
}

export { getAll };
