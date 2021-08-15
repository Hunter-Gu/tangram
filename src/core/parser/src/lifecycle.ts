import { RenderAndInitRef } from "./types/render";
import { Child, ParsedSchema, SchemaData } from "./types/schema";

// dfs
export function lifecycle(
  node: Child | ParsedSchema,
  render: RenderAndInitRef
): ReturnType<RenderAndInitRef> {
  let slots: ReturnType<RenderAndInitRef> | void;
  let children: ReturnType<RenderAndInitRef> | void;

  if (typeof node === "string") {
    return node;
  }

  if (node.children && node.children.length) {
    children = node.children.map((child) => lifecycle(child, render));
  }

  if (node.slots) {
    // TODO: FIX warnings
    // [Non-function value encountered for default slot. Prefer function slots for better performance.]
    slots = (node.slots as unknown as SchemaData[]).map((child) =>
      lifecycle(child, render)
    );
  }

  // TODO: fix type definition
  // @ts-ignore
  return render(node, slots || children);
}
