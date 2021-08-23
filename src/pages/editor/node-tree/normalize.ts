import { SchemaData } from "../../../core/parser/src/types/schema";
import { PathManager } from "../../../plugins/utils/path-manager";
import { Tree } from "./types";

// TODO: so move these together for better handling block path and for easier test
// this function will handle for block path that mentioned in store
export function normalize(schema: SchemaData): Tree {
  const _normalize = (schema: SchemaData, path = ""): Tree => {
    return {
      uuid: path || "root",
      // TODO
      // @ts-ignore
      label: schema.name.name || "label",
      _meta: {
        name: schema.name,
        path,
      },
      children: schema.children?.map((n, i) =>
        // @ts-ignore
        _normalize(n, PathManager.concat(path, PathManager.ChildrenPropName, i))
      ),
    };
  };

  // @ts-ignore
  return [_normalize(schema)];
}
