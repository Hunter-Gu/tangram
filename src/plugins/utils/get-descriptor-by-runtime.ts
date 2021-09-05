import {
  DescriptorProp,
  PropsDescriptor,
} from "@/pages/editor/types/descriptor";

export function getDescriptorByRuntime(
  descriptor: PropsDescriptor,
  runtimeData?: Record<string, unknown>
): PropsDescriptor {
  if (!runtimeData) {
    return descriptor;
  }

  return {
    ...descriptor,
    props: descriptor.props.map((prop) => {
      if (prop.name in runtimeData) {
        return {
          ...prop,
          defaultValue: runtimeData[prop.name],
        };
      }

      return prop;
    }) as DescriptorProp[],
  };
}
