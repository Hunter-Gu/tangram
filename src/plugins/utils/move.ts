import { PathManager } from "./path-manager";

export type Node<T> = {
  array: T[];
  index: number;
};

export function move<T>(from: Node<T>, to: Node<T>) {
  const node = from.array.splice(from.index, 1)[0];

  to.array.splice(to.index, 0, node);
}

// example:    children.0.children.1.children.2
// parentPath: children.0.children.1.children
// index:      2
export function getParentPathAndIndex(path: string) {
  const lastIndex = path.lastIndexOf(PathManager.Seperator);

  return {
    parentPath: path.slice(0, lastIndex),
    index: +path.slice(lastIndex + 1),
  };
}
