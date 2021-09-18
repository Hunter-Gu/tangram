import { SchemaData } from "../../../core/parser/src/types/schema";
import { BaseCommand } from "./base-command";
import { MacroCommand } from "./macro-command";
import { Command, OperationResult } from "./types";

export enum Execution {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
}

export class CommandManager {
  private maxLength = 20;

  private pointer = -1;

  private macroModeStat = {
    isMacroMode: false,
    pointer: -1,
  };

  private commandList: Command<SchemaData, OperationResult>[] = [];

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

  private get macroCommandInMacroMode() {
    return this.commandList.slice(-1)[0] as MacroCommand;
  }

  private macroCommandAddAndTryZip(command: BaseCommand) {
    const lastCommand = this.macroCommandInMacroMode.get(
      this.macroModeStat.pointer
    ) as Command<unknown, unknown> | undefined;

    if (lastCommand?.replaceBy?.(command as Command<unknown, unknown>)) {
      this.macroModeStat.pointer--;
      this.macroCommandInMacroMode.pop();
    }

    this.macroCommandInMacroMode.add(command);
  }

  private addAndTryZip(command: BaseCommand) {
    const lastCommand = this.commandList[this.pointer] as
      | Command<unknown, unknown>
      | undefined;

    if (lastCommand?.replaceBy?.(command as Command<unknown, unknown>)) {
      this.pointer--;
      this.commandList.pop();
    }
    this.commandList.push(command);
  }

  add(command: BaseCommand) {
    if (this.macroModeStat.isMacroMode) {
      this.macroCommandAddAndTryZip(command);
    } else {
      this.addAndTryZip(command);
    }
    this.truncate();
  }

  do(command: BaseCommand) {
    command.calcDiff(this.schemaData);
    this.add(command);
    if (this.macroModeStat.isMacroMode) {
      return this.doLatestCommandInMacroCommand();
    } else {
      return this.redo();
    }
  }

  redo(): OperationResult {
    if (this.isAtLastCommand) {
      return {
        schema: this.schemaData,
        currentPath: "",
      };
    }

    const command = this.commandList[++this.pointer];

    return this.execute(command);
  }

  undo(): OperationResult {
    if (this.hasNoPrevCommand) {
      return {
        schema: this.schemaData,
        currentPath: "",
      };
    }

    const command = this.commandList[this.pointer--];

    return this.execute(command, false);
  }

  startMacro() {
    if (this.macroModeStat.isMacroMode) {
      return;
    }
    this.macroModeStat.isMacroMode = true;
    this.commandList.push(new MacroCommand());
  }

  endMacro() {
    this.macroModeStat.isMacroMode = false;
    this.macroModeStat.pointer = -1;
  }

  private doLatestCommandInMacroCommand() {
    const command = this.macroCommandInMacroMode.get(
      ++this.macroModeStat.pointer
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.execute(command!);
  }

  private execute(command: Command<SchemaData, OperationResult>, isDo = true) {
    const { schema, currentPath } = isDo
      ? command.do(this.schemaData)
      : command.undo(this.schemaData);
    this.data = schema;

    return {
      schema,
      currentPath,
    };
  }
}
