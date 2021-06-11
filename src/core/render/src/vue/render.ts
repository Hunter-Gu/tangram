import { render as baseRender } from "../../../parser/src";
import { Render } from "../../../parser/src/types/render";
import { Schema } from "../../../parser/src/types/schema";
import { h } from "@vue/runtime-core";
import { refs } from "./ref";

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

export function render(schema: Schema) {
  return baseRender(schema, enhance, refs.get.bind(refs));
}
