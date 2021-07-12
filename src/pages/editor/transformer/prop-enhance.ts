import { render } from "../../../core/render/src/vue";
import { SchemaData } from "../../../core/parser/src/types/schema";
import EnhanceProp from "./components/enhance-prop";
import { ComponentProp } from "../types/component";
import { ComponentInfo } from "../types/transform";
import { DescriptorProp } from "../types/descriptor";

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
          name: props.name,
          label: props.label,
        } as ComponentProp,
        slots: {
          default: {
            name: componentInfo.component,
            __uuid: new Date().getTime(),
            props: {
              ...componentInfo.staticProps,
            },
          },
        },
      });
    };
  }
}
