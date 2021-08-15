import { render as baseRender } from "../../../parser/src";
import { RenderNode } from "../../../parser/src/types/render";
import { SchemaData } from "../../../parser/src/types/schema";
import { h } from "@vue/runtime-core";
import { Ref } from "./ref";

export function render(schema: SchemaData) {
  const refs = new Ref();

  const enhance = (
    id: string | number,
    elm: Parameters<typeof h>[0],
    props?: Record<string, unknown>,
    children?: Parameters<typeof h>[2]
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

  // TODO better type definition
  return baseRender(
    schema,
    enhance as unknown as RenderNode,
    refs.get.bind(refs)
  );
}
