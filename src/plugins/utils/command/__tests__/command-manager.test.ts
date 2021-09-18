import { SchemaData } from "../../../../core/parser/src/types/schema";
import { AddCommand } from "../add-command";
import { BaseCommand } from "../base-command";
import { CommandManager } from "../command-manager";
import { MacroCommand } from "../macro-command";
import { MoveCommand } from "../move-command";
import {
  AddCommandStatData,
  MoveCommandStatData,
  UpdateCommandStatData,
} from "../types";
import { UpdateCommand } from "../update-command";

const Utils = {
  getCommandList(commandManager: CommandManager) {
    return commandManager["commandList"];
  },
  setMaxLength(commandManager: CommandManager, num: number) {
    commandManager["maxLength"] = num;
  },
  setPointer(commandManager: CommandManager, num: number) {
    commandManager["pointer"] = num;
  },
  getPointer(commandManger: CommandManager) {
    return commandManger["pointer"];
  },
  getStatData(command: BaseCommand) {
    // @ts-ignore
    return command["statData"];
  },
};

let commandManager: CommandManager;
let schema: SchemaData;

beforeEach(() => {
  jest.restoreAllMocks();
  schema = {
    children: [
      {
        name: "target",
      },
    ],
  } as SchemaData;
  commandManager = new CommandManager(schema);
});

describe("CommandManager", () => {
  it("it can push command into commandList by add()", () => {
    expect(Utils.getCommandList(commandManager).length).toBe(0);

    commandManager.add(new AddCommand({} as AddCommandStatData));
    expect(Utils.getCommandList(commandManager).length).toBe(1);

    commandManager.add(new MoveCommand({} as MoveCommandStatData));
    expect(Utils.getCommandList(commandManager).length).toBe(2);
  });

  it("hasNoPrevCommand() will return true if private prop pointer is -1", () => {
    commandManager.add(new AddCommand({} as AddCommandStatData));
    commandManager.add(new UpdateCommand({} as UpdateCommandStatData));
    commandManager.add(new MoveCommand({} as MoveCommandStatData));

    Utils.setPointer(commandManager, -1);

    expect(commandManager.hasNoPrevCommand).toBe(true);
  });

  it("the length of commandList will never over private prop maxLength, and it will keep the latest commands", () => {
    Utils.setMaxLength(commandManager, 2);

    commandManager.add(new AddCommand({ path: "path1" } as AddCommandStatData));
    commandManager.add(
      new UpdateCommand({ path: "path2" } as UpdateCommandStatData)
    );
    commandManager.add(new MoveCommand({} as MoveCommandStatData));

    const commandList = Utils.getCommandList(commandManager) as AddCommand[];
    expect(commandList.length).toBe(2);
    expect(Utils.getStatData(commandList[0])).toEqual({ path: "path2" });
  });

  it("the do() will call command.calcDiff(), add the command to command list, call command.do()", () => {
    const calcDiff = jest.spyOn(AddCommand.prototype, "calcDiff");
    const doFn = jest
      .spyOn(AddCommand.prototype, "do")
      // @ts-ignore
      .mockImplementation((data: unknown) => data);
    const command = new AddCommand({ path: "path" } as AddCommandStatData);

    commandManager.do(command);

    expect(calcDiff).toBeCalledWith(schema);
    expect(doFn).toBeCalledWith(schema);
    expect(
      Utils.getStatData(Utils.getCommandList(commandManager)[0] as AddCommand)
    ).toEqual({
      path: "path",
    });
  });

  it("it can execute redo and undo operation by redo() and undo()", () => {
    const command1 = {
      replaceBy: jest.fn(),
      calcDiff: jest.fn(),
      do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
    } as unknown as BaseCommand;
    const command2 = {
      replaceBy: jest.fn(),
      calcDiff: jest.fn(),
      do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
    } as unknown as BaseCommand;
    const command3 = {
      replaceBy: jest.fn(),
      calcDiff: jest.fn(),
      do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
    } as unknown as BaseCommand;

    commandManager.do(command1);
    commandManager.do(command2);
    commandManager.do(command3);

    jest.clearAllMocks();

    commandManager.undo();
    expect(command3.undo).toHaveBeenCalled();
    commandManager.undo();
    expect(command2.undo).toHaveBeenCalled();
    commandManager.undo();
    expect(command1.undo).toHaveBeenCalled();

    commandManager.redo();
    expect(command1.do).toHaveBeenCalled();
    commandManager.redo();
    expect(command2.do).toHaveBeenCalled();
    commandManager.redo();
    expect(command3.do).toHaveBeenCalled();
  });

  it("should clear next commands when execute a command by do() if the pointer is not point to the last command", () => {
    const command1 = new AddCommand({
      path: "children.0",
    } as AddCommandStatData);
    const command2 = new AddCommand({
      path: "children.0",
    } as AddCommandStatData);
    const command3 = new AddCommand({
      path: "children.0",
    } as AddCommandStatData);
    const command4 = new AddCommand({
      path: "children.0",
    } as AddCommandStatData);

    commandManager.do(command1);
    commandManager.do(command2);
    commandManager.do(command3);

    commandManager.undo();
    commandManager.undo();

    commandManager.do(command4);

    expect(Utils.getCommandList(commandManager).length).toBe(2);
  });

  describe("macro mode", () => {
    it("it will add commands to macro command list after starting macro mode, util macro mode is end", () => {
      const command = { name: "command" } as unknown as BaseCommand;
      const command1 = { name: "command1" } as unknown as BaseCommand;
      const command2 = { name: "command2" } as unknown as BaseCommand;
      const command3 = { name: "command3" } as unknown as BaseCommand;

      commandManager.add(command);

      commandManager.startMacro();

      commandManager.add(command1);
      commandManager.add(command2);
      commandManager.add(command3);

      commandManager.endMacro();

      const macro = new MacroCommand();

      macro.add(command1);
      macro.add(command2);
      macro.add(command3);

      expect(Utils.getCommandList(commandManager)).toEqual([command, macro]);
    });

    it("in macro mode, it will execute the command and add it to macro command list", () => {
      const command = {
        replaceBy: jest.fn(),
        calcDiff: jest.fn(),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const command1 = {
        replaceBy: jest.fn(),
        calcDiff: jest.fn(),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const command2 = {
        replaceBy: jest.fn(),
        calcDiff: jest.fn(),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const macro = new MacroCommand();
      macro.add(command1);
      macro.add(command2);

      commandManager.do(command);
      commandManager.startMacro();
      commandManager.do(command1);
      commandManager.do(command2);
      commandManager.endMacro();

      expect(command.do).toHaveBeenCalled();
      expect(command1.do).toHaveBeenCalled();
      expect(command2.do).toHaveBeenCalled();

      expect(Utils.getCommandList(commandManager)).toEqual([command, macro]);
    });
  });

  describe("zip command", () => {
    it("should try to zip command when add new command not in macro mode", () => {
      const command1 = {
        replaceBy: jest.fn().mockReturnValue(true),
        calcDiff: jest.fn().mockReturnValue(true),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const command2 = {
        replaceBy: jest.fn().mockReturnValue(true),
        calcDiff: jest.fn().mockReturnValue(true),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;

      commandManager.do(command1);
      commandManager.do(command2);

      expect(Utils.getPointer(commandManager)).toBe(0);

      expect(Utils.getCommandList(commandManager).length).toBe(1);
    });

    it("should try to zip command when add new command in macro mode", () => {
      const command = {
        replaceBy: jest.fn(),
        calcDiff: jest.fn(),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const command1 = {
        replaceBy: jest.fn().mockReturnValue(true),
        calcDiff: jest.fn().mockReturnValue(true),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const command2 = {
        replaceBy: jest.fn().mockReturnValue(true),
        calcDiff: jest.fn().mockReturnValue(true),
        do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
        undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      } as unknown as BaseCommand;
      const macro = new MacroCommand();
      macro.add(command2);

      commandManager.do(command);
      commandManager.startMacro();
      commandManager.do(command1);
      commandManager.do(command2);
      commandManager.endMacro();

      expect(Utils.getCommandList(commandManager)).toEqual([command, macro]);
    });
  });
});
