import { render } from "../../../core/render/src/vue";
import { Component, SchemaData } from "../../../core/parser/src/types/schema";
import EnhanceProp from "./components/enhance-prop";
import { ComponentProp } from "../types/component";

export abstract class IPropEnhance {
  // TODO _render need support customize
  constructor(protected _render: typeof render) {}

  abstract enhance(component: Component): (props: ComponentProp) => SchemaData;
}

export class PropEnhance extends IPropEnhance {
  enhance(component: Component) {
    // create a new anonymous functional component
    return (props: ComponentProp) => {
      return this._render({
        name: EnhanceProp,
        __uuid: new Date().getTime(),
        props: {
          name: props.name,
          label: props.label,
        } as ComponentProp,
        slots: {
          default: {
            name: component,
            __uuid: new Date().getTime(),
          },
        },
      });
    };
  }
}
