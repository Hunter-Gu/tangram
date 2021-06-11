import { handler } from "./handlers";
import { Render, Node, GetRef } from "./types/render";
import { Child, ParsedEvents, ParsedSchema, Schema } from "./types/schema";
import { formatEvents } from "./utils/events";

export function parse(schema: Schema): ParsedSchema {
  return handler.invoke(schema);
}

export function render(schema: Schema, h: Render, getRef: GetRef) {
  const schemaTree = parse(schema);

  // dfs
  const lifecycle = (node: Child | string | ParsedSchema): string | Node => {
    let slots: Node[] | void;
    let children: Node[] | void;

    if (typeof node === "string") {
      return node;
    }

    if (node.children && node.children.length) {
      children = node.children.map(lifecycle);
    }

    if (node.slots) {
      // TODO: FIX warnings
      // [Non-function value encountered for default slot. Prefer function slots for better performance.]
      slots = (node.slots as unknown as Schema[]).map(lifecycle);
    }

    const ret = h(
      node.__uuid,
      node.name,
      {
        ...node.attrs,
        ...node.props,
        ...formatEvents(node.events as ParsedEvents, getRef),
      },
      slots || children
    );

    return ret;
  };

  return lifecycle(schemaTree);
}
