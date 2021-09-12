import { DropType } from "../../../pages/editor/types/node-tree";
import { Child, SchemaData } from "../../../core/parser/src/types/schema";
import { get, set } from "../../../core/parser/src/utils/utils";
import { getParentPathAndIndex, move } from "../move";
import { BaseCommand } from "./base-command";
import { MoveCommandDiffValue, MoveCommandStatData } from "./types";
import { PathManager } from "../path-manager";

export class MoveCommand extends BaseCommand<MoveCommandDiffValue> {
  constructor(private statData: MoveCommandStatData) {
    super();
  }

  calcDiff(schema: SchemaData): void {
    const { from, to, type } = this.statData;
    const { parentPath: parentPathOfTo, index: indexOfTo } =
      getParentPathAndIndex(to);

    const isInsertMode = type === DropType.Inner;
    const path = isInsertMode ? to + ".children" : parentPathOfTo;
    const parent = get(schema, path) as Child[] | undefined;
    const index = isInsertMode ? parent?.length ?? 0 : +indexOfTo;

    const realToPath = PathManager.concat(path, index);

    this.diff = {
      path: realToPath,
      value: {
        from,
        to: realToPath,
      },
    };
  }

  do(schema: SchemaData): SchemaData {
    const {
      value: { from, to },
    } = this.diff;

    const { parentPath: parentPathOfFrom, index: indexOfFrom } =
      getParentPathAndIndex(from);
    const { parentPath: parentPathOfTo, index: indexOfTO } =
      getParentPathAndIndex(to);

    const parentOfFrom = get(schema, parentPathOfFrom) as Child[];
    let parentOfTo = get(schema, parentPathOfTo) as Child[];

    if (!parentOfTo) {
      set(schema, parentPathOfTo, []);
      parentOfTo = get(schema, parentPathOfTo);
    }

    move(
      {
        array: parentOfFrom,
        index: indexOfFrom,
      },
      {
        array: parentOfTo,
        index: indexOfTO,
      }
    );

    return schema;
  }

  undo(schema: SchemaData): SchemaData {
    const {
      value: { from, to },
    } = this.diff;

    const { parentPath: parentPathOfFrom, index: indexOfFrom } =
      getParentPathAndIndex(from);
    const { parentPath: parentPathOfTo, index: indexOfTO } =
      getParentPathAndIndex(to);

    const parentOfFrom = get(schema, parentPathOfFrom) as Child[];
    const parentOfTo = get(schema, parentPathOfTo) as Child[];

    move(
      {
        array: parentOfTo,
        index: indexOfTO,
      },
      {
        array: parentOfFrom,
        index: indexOfFrom,
      }
    );

    return schema;
  }
}
