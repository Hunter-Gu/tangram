import type { PropType } from "@vue/runtime-core";
import { ComponentInfo } from "../../../../../pages/editor/types/transform";

export function getComponentProps() {
  // TODO: the type definition should adjust
  return {
    name: {
      type: String as PropType<string>,
      default: "",
    },
    label: {
      type: String as PropType<string>,
      default: "",
    },
    component: {
      type: [String, Object] as PropType<ComponentInfo["component"]>,
      required: true,
    },
    staticProps: {
      type: Object as PropType<ComponentInfo["staticProps"]>,
      default: () => ({}),
    },
    defaultValue: {},
  };
  // TODO why props missing when add `as ComponentProp & ComponentInfo` at tail
}
