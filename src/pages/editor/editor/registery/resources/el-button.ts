import {
  DescriptorPropTypes,
  PropsDescriptor,
  RenderDescriptor,
} from "../../../types/descriptor";

export const ElButton = "ElButton";

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
  descendant: true,
};

export function getDescriptor(
  components: Record<string, RenderDescriptor["component"]>
): RenderDescriptor {
  return {
    component: components[ElButton],
    descriptor: ElButtonDescriptor,
    props: {
      disabled: true,
    },
  };
}
