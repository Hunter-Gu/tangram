import { Child, SchemaData } from "../../../core/parser/src/types/schema";
import { BaseCommand } from "./base-command";
import { registry } from "../../../pages/editor/utils/registry";
import { AddCommandStatData } from "./types";
import { get, set } from "../../../core/parser/src/utils/utils";
import { getParentPathAndIndex } from "../move";
import { Operation } from "../../../pages/editor/block/types";
import { PathManager } from "../path-manager";
import { remove } from "../remove-node";

export class AddCommand extends BaseCommand<Child> {
  constructor(private statData: AddCommandStatData) {
    super();
  }

  calcDiff(schema: SchemaData) {
    const { componentName, path, type } = this.statData;

    const renderDescriptor = registry.getPropsDescriptor(componentName)?.data;
    const component = renderDescriptor?.component;
    const operatorTarget = get(schema, path) as SchemaData;
    const { parentPath, index } = getParentPathAndIndex(path);

    let newPath = "";
    switch (type) {
      case Operation.Inside: {
        newPath = PathManager.concat(
          path,
          PathManager.ChildrenPropName,
          operatorTarget?.children?.length ?? 0
        );
        break;
      }
      case Operation.Top:
      case Operation.Left:
        newPath = path;
        break;
      case Operation.Bottom:
      case Operation.Right:
        newPath = PathManager.concat(parentPath, index + 1);
        break;
      default:
        newPath = PathManager.concat(
          path,
          PathManager.ChildrenPropName,
          operatorTarget?.children?.length ?? 0
        );
    }

    this.diff = {
      path: newPath,
      value: {
        name: component,
        __uuid: new Date().getTime(),
      } as Child,
    };
  }

  do(schema: SchemaData) {
    const { path, value } = this.diff;

    add(schema, path, value);

    return schema;
  }

  undo(schema: SchemaData) {
    const { path } = this.diff;

    remove(schema, path);

    return schema;
  }
}

export function add(schema: SchemaData, path: string, value: Child) {
  const { parentPath, index } = getParentPathAndIndex(path);

  let parent = get(schema, parentPath) as Child[];

  if (!parent) {
    set(schema, parentPath, []);
    parent = get(schema, parentPath) as Child[];
  }

  parent.splice(index, 0, value);
}
