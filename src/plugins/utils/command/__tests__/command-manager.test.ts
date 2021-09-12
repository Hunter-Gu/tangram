import { SchemaData } from "../../../../core/parser/src/types/schema";
import { AddCommand } from "../add-command";
import { BaseCommand } from "../base-command";
import { CommandManager } from "../command-manager";
import { AddCommandStatData } from "../types";

const Utils = {
  getCommandList(commandManager: CommandManager) {
    // @ts-ignore
    return commandManager.commandList;
  },
  setMaxLength(commandManager: CommandManager, num: number) {
    // @ts-ignore
    commandManager.maxLength = num;
  },
  setPointer(commandManager: CommandManager, num: number) {
    // @ts-ignore
    commandManager.pointer = num;
  },
  getStatData(command: BaseCommand) {
    // @ts-ignore
    return command.statData;
  },
};

let commandManager: CommandManager;
const schema = {
  children: [
    {
      name: "target",
    },
  ],
} as SchemaData;

beforeEach(() => {
  commandManager = new CommandManager(schema);
});

describe("CommandManager", () => {
  it("it can push command into commandList by add()", () => {
    expect(Utils.getCommandList(commandManager).length).toBe(0);

    commandManager.add(new AddCommand({} as AddCommandStatData));
    expect(Utils.getCommandList(commandManager).length).toBe(1);

    commandManager.add(new AddCommand({} as AddCommandStatData));
    expect(Utils.getCommandList(commandManager).length).toBe(2);
  });

  it("hasNoPrevCommand() will return true if private prop pointer is -1", () => {
    commandManager.add(new AddCommand({} as AddCommandStatData));
    commandManager.add(new AddCommand({} as AddCommandStatData));
    commandManager.add(new AddCommand({} as AddCommandStatData));

    Utils.setPointer(commandManager, -1);

    expect(commandManager.hasNoPrevCommand).toBe(true);
  });

  it("the length of commandList will never over private prop maxLength, and it will keep the latest commands", () => {
    Utils.setMaxLength(commandManager, 2);

    commandManager.add(new AddCommand({ path: "path1" } as AddCommandStatData));
    commandManager.add(new AddCommand({ path: "path2" } as AddCommandStatData));
    commandManager.add(new AddCommand({ path: "path3" } as AddCommandStatData));

    const commandList = Utils.getCommandList(commandManager);
    expect(commandList.length).toBe(2);
    expect(Utils.getStatData(commandList[0])).toEqual({ path: "path2" });
  });

  it("the do() will call command.calcDiff(), add the command to command list, call command.do()", () => {
    const calcDiff = jest.spyOn(AddCommand.prototype, "calcDiff");
    // @ts-ignore
    const doFn = jest
      .spyOn(AddCommand.prototype, "do")
      .mockImplementation((data: unknown) => data);
    const command = new AddCommand({ path: "path" } as AddCommandStatData);

    commandManager.do(command);

    expect(calcDiff).toBeCalledWith(schema);
    expect(doFn).toBeCalledWith(schema);
    expect(Utils.getStatData(Utils.getCommandList(commandManager)[0])).toEqual({
      path: "path",
    });
  });

  it("it can execute redo and undo operation by redo() and undo()", () => {
    const command1 = {
      calcDiff: jest.fn(),
      do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
    } as unknown as BaseCommand;
    const command2 = {
      calcDiff: jest.fn(),
      do: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
      undo: jest.fn().mockReturnValue({ schema: "schema", path: "path" }),
    } as unknown as BaseCommand;
    const command3 = {
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
});
