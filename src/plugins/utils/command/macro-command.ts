import { SchemaData } from "../../../core/parser/src/types/schema";
import { BaseCommand } from "./base-command";
import { Command, OperationResult } from "./types";

export class MacroCommand implements Command<SchemaData, OperationResult> {
  private commandList: BaseCommand<unknown>[] = [];

  get(index: number) {
    return this.commandList[index] as BaseCommand<unknown> | undefined;
  }

  pop() {
    return this.commandList.pop();
  }

  add(command: BaseCommand) {
    this.commandList.push(command);
  }

  do(schemaData: SchemaData) {
    return this.commandList.reduce(
      ({ schema }, command) => {
        return command.do(schema);
      },
      { schema: schemaData }
    ) as OperationResult;
  }

  undo(schemaData: SchemaData) {
    return this.commandList
      .slice()
      .reverse()
      .reduce(
        ({ schema }, command) => {
          return command.undo(schema);
        },
        { schema: schemaData }
      ) as OperationResult;
  }
}
