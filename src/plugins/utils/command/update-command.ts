import { get, set } from "../../../core/parser/src/utils/utils";
import { SchemaData } from "../../../core/parser/src/types/schema";
import { BaseCommand } from "./base-command";
import { UpdateCommandDiffValue, UpdateCommandStatData } from "./types";
import { PathManager } from "../path-manager";

export class UpdateCommand extends BaseCommand<UpdateCommandDiffValue> {
  constructor(private statData: UpdateCommandStatData) {
    super();
  }

  canReplaceBy(command: BaseCommand<unknown>) {
    if (!(command instanceof UpdateCommand)) {
      return false;
    }

    const {
      path: commandPropPath,
      value: { oldValue: commandOldValue, newValue: commandNewValue },
    } = command.diff;
    const {
      path: nowPropPath,
      value: { newValue: nowNewValue },
    } = this.diff;

    const canReplace =
      commandPropPath === nowPropPath &&
      (commandOldValue === nowNewValue || commandNewValue === nowNewValue);

    return canReplace;
  }

  replaceBy(command: BaseCommand<unknown>) {
    if (!this.canReplaceBy(command)) {
      return false;
    }

    const {
      value: { oldValue: nowOldValue },
    } = this.diff;

    (command as UpdateCommand).diff.value.oldValue = nowOldValue;

    return true;
  }

  calcDiff(schema: SchemaData): void {
    const { path, value: newValue, field } = this.statData;
    const propPath = PathManager.concat(path, "props", field);

    const oldValue = get(schema, propPath);

    this.diff = {
      path: propPath,
      value: {
        newValue,
        oldValue,
      },
    };
  }

  do(schema: SchemaData) {
    const {
      value: { newValue },
      path: propPath,
    } = this.diff;

    set(schema, propPath, newValue);

    return {
      schema,
      currentPath: this.statData.path,
    };
  }

  undo(schema: SchemaData) {
    const {
      value: { oldValue },
      path: propPath,
    } = this.diff;

    set(schema, propPath, oldValue);

    return {
      schema,
      currentPath: this.statData.path,
    };
  }
}
