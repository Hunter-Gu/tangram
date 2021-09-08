import { Child } from "../../core/parser/src/types/schema";
import { Operation } from "../../pages/editor/block/types";
import { PathManager } from "./path-manager";
import { AddNodeParams } from "./types";

export function addNode({
  target,
  component,
  type,
  path,
  ancestors,
  index,
  parentPath,
}: AddNodeParams) {
  const newData: Child = {
    name: component,
    __uuid: new Date().getTime(),
  };
  let newPath = "";

  switch (type) {
    case Operation.Inside: {
      newPath = PathManager.concat(
        path,
        PathManager.ChildrenPropName,
        target.children.push(newData) - 1
      );
      break;
    }
    case Operation.Top:
    case Operation.Left:
      ancestors.splice(index, 0, newData);
      newPath = path;
      break;
    case Operation.Bottom:
    case Operation.Right:
      // insert after need plus 1
      ancestors.splice(index + 1, 0, newData);
      newPath = PathManager.concat(parentPath, index + 1);
      break;
    default:
      newPath = PathManager.concat(
        path,
        PathManager.ChildrenPropName,
        target.children.push(newData) - 1
      );
  }

  return newPath;
}
