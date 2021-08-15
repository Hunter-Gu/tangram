import {
  DescriptorPropTypes,
  PropsDescriptor,
  RenderDescriptor,
} from "../../../types/descriptor";

export const ElInput = "ElInput";

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

export function getDescriptor(
  components: Record<string, RenderDescriptor["component"]>
): RenderDescriptor {
  return {
    component: components[ElInput],
    descriptor: ElInputDescriptor,
    props: {
      disabled: true,
      placeholder: "hello world",
    },
  };
}
