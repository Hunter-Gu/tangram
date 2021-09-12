import { SchemaData } from "../../../core/parser/src/types/schema";
import { BaseCommand } from "./base-command";
import { OperationResult } from "./types";

export enum Execution {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
}

export class CommandManager {
  private maxLength = 20;

  private pointer = -1;

  private commandList: BaseCommand<unknown>[] = [];

  public get isAtLastCommand() {
    return this.pointer === this.commandList.length - 1;
  }

  // we can also revert first command
  public get hasNoPrevCommand() {
    return this.pointer === -1;
  }

  public get schemaData() {
    return { ...this.data } as Readonly<SchemaData>;
  }

  constructor(private data: SchemaData) {}

  private truncate() {
    this.commandList = this.commandList.slice(-this.maxLength);
  }

  add(command: BaseCommand) {
    this.commandList.push(command);
    this.truncate();
  }

  do(command: BaseCommand) {
    command.calcDiff(this.schemaData);
    this.add(command);
    return this.redo();
  }

  redo(): OperationResult {
    if (this.isAtLastCommand) {
      return {
        schema: this.schemaData,
        currentPath: "",
      };
    }

    const command = this.commandList[++this.pointer];

    const { schema, currentPath } = command.do(this.schemaData);
    this.data = schema;

    return {
      schema,
      currentPath,
    };
  }

  undo(): OperationResult {
    if (this.hasNoPrevCommand) {
      return {
        schema: this.schemaData,
        currentPath: "",
      };
    }

    const command = this.commandList[this.pointer--];

    const { schema, currentPath } = command.undo(this.schemaData);

    this.data = schema;

    return {
      schema,
      currentPath,
    };
  }
}
