import { handler } from "./handlers";
import { Render, Node } from "./types/render";
import { Child, ParsedSchema, Schema } from "./types/schema";

export function parse(schema: Schema): ParsedSchema {
  return handler.invoke(schema);
}

export function render(schema: Schema, h: Render) {
  const schemaTree = parse(schema);

  // dfs
  const lifecycle = (node: Child | string | ParsedSchema): string | Node => {
    let slots: Node[] | void;
    let children: Node[] | void;

    if (typeof node === 'string') {
      return node;
    }

    if (node.children && node.children.length) {
      children = node.children.map(lifecycle)
    }

    if (node.slots) {
      // TODO: FIX warnings
      // [Non-function value encountered for default slot. Prefer function slots for better performance.]
      slots = (node.slots as unknown as Schema[]).map(lifecycle)
    }

    return h(node.name, {
      ...node.attrs,
      ...node.props,
      ...node.events
    }, slots || children);
  };

  return lifecycle(schemaTree);
}
