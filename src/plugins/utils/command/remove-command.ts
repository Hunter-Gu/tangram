import { get } from "../../../core/parser/src/utils/utils";
import { Child, SchemaData } from "../../../core/parser/src/types/schema";
import { getParentPathAndIndex } from "../move";
import { BaseCommand } from "./base-command";
import { RemoveCommandStatData } from "./types";
import { add } from "./add-command";

export class RemoveCommand extends BaseCommand<Child> {
  constructor(private statData: RemoveCommandStatData) {
    super();
  }

  calcDiff(schema: SchemaData): void {
    const { path } = this.statData;
    this.diff = {
      path,
      value: get(schema, path),
    };
  }

  do(schema: SchemaData) {
    const { path } = this.diff;

    remove(schema, path);

    return schema;
  }

  undo(schema: SchemaData) {
    const { path, value } = this.diff;

    add(schema, path, value);

    return schema;
  }
}

export function remove(schema: SchemaData, path: string) {
  const { parentPath, index } = getParentPathAndIndex(path);
  const arr = get(schema, parentPath) as Child[];

  arr.splice(index, 1);
}
