import { PathManager } from "../../../plugins/utils/path-manager";
import type { Child, SchemaData } from "../../../core/parser/src/types/schema";
import Block from "../block";

export function enhance(schema: Child, path = ""): SchemaData {
  if (typeof schema === "string") {
    return schema as unknown as SchemaData;
  }

  return {
    ...schema,
    children: schema.children?.map((child, idx) => {
      const nodePath = PathManager.concat(
        path,
        PathManager.ChildrenPropName,
        idx
      );
      return enhanceBlock(enhance(child, nodePath), nodePath);
    }),
  };
}

export function enhanceBlock(node: Child, path: string): Child {
  return {
    name: Block,
    __uuid: 0,
    children: [node],
    props: {
      name: node.name.name,
      path,
    },
  };
}
