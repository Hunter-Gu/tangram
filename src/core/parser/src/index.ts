import { handler } from "./handlers";
import { lifecycle } from "./lifecycle";
import { RenderNode, GetRef, RenderAndInitRef } from "./types/render";
import { ParsedEvents, ParsedSchema, SchemaData } from "./types/schema";
import { formatEvents } from "./utils/events";

export function parse(schema: SchemaData): ParsedSchema {
  return handler.invoke(schema);
}

export function render(schema: SchemaData, h: RenderNode, getRef: GetRef) {
  const schemaTree = parse(schema);

  const _render: RenderAndInitRef = (node, children) =>
    h(
      node.__uuid,
      node.name,
      {
        ...node.attrs,
        ...node.props,
        ...formatEvents(node.events as ParsedEvents, getRef),
      },
      children
    );

  return lifecycle(schemaTree, _render);
}
