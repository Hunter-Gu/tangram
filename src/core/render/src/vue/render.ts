import { render as baseRender } from "../../../parser/src";
import { Render } from "../../../parser/src/types/render";
import { SchemaData } from "../../../parser/src/types/schema";
import { h } from "@vue/runtime-core";
import { Ref } from "./ref";

export function render(schema: SchemaData) {
  const refs = new Ref();

  const enhance: Render = (
    id: string | number,
    elm: any,
    props?: Record<string, unknown>,
    children?: any
  ) => {
    return h(
      elm,
      {
        ref: refs.init(id),
        ...props,
      },
      children
    );
  };

  return baseRender(schema, enhance, refs.get.bind(refs));
}
