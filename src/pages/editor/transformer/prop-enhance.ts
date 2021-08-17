import { render } from "../../../core/render/src/vue";
import { SchemaData } from "../../../core/parser/src/types/schema";
import EnhanceProp from "./components/enhance-prop";
import { ComponentInfo } from "../types/transform";
import { DescriptorProp } from "../types/descriptor/props-descriptor";

export abstract class IPropEnhance {
  // TODO _render need support customize
  constructor(protected _render: typeof render) {}

  abstract enhance(
    componentInfo: ComponentInfo
  ): (props: DescriptorProp) => SchemaData;
}

export class PropEnhance extends IPropEnhance {
  enhance(componentInfo: ComponentInfo) {
    // create a new anonymous functional component
    return (props: DescriptorProp) => {
      return this._render({
        name: EnhanceProp,
        __uuid: new Date().getTime(),
        props: {
          ...props,
          ...componentInfo,
        },
      }) as SchemaData;
    };
  }
}
