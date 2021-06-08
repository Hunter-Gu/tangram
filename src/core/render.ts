import { h, VNode } from "vue";
import { initRef } from "./ref";
import { Parsers, Schema } from "./schema";

type Options = Record<string, unknown>;

export type Render = (schema: Schema) => VNode;
/**
 * @desc generate vnode tree from json schema
 * @param schema
 */
const render: Render = (schema) => {
  // render for text children
  if (typeof schema !== "object") {
    return schema;
  }

  const childrenOrSlots = schema.slots
    ? Parsers.slots(schema.slots || {})
    : Parsers.children(schema.children || []);

  const idRef = initRef(schema.__uuid);

  const options = Object.keys(schema).reduce(
    (renderSchema: Options, key: unknown) => {
      if (
        key === "name" ||
        key === "__uuid" ||
        key === "children" ||
        key === "slots"
      ) {
        return renderSchema;
      }

      return {
        ...renderSchema,
        // @ts-ignore
        ...Parsers[key](schema[key]),
      };
    },
    { ref: idRef } as Options
  );

  return h(schema.name, options, childrenOrSlots);
};

export default render;
