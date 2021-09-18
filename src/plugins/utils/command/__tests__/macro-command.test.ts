import { AddCommand } from "../add-command";
import { BaseCommand } from "../base-command";
import { MacroCommand } from "../macro-command";
import { AddCommandStatData } from "../types";

function getCommandList(macro: MacroCommand) {
  // @ts-ignore
  return macro.commandList;
}

describe("MacroCommand", () => {
  it("add command commandList by add()", () => {
    const macro = new MacroCommand();

    expect(getCommandList(macro).length).toBe(0);

    macro.add(new AddCommand({} as AddCommandStatData));
    macro.add(new AddCommand({} as AddCommandStatData));
    macro.add(new AddCommand({} as AddCommandStatData));

    expect(getCommandList(macro).length).toBe(3);
  });

  it("pop command by pop()", () => {
    const macro = new MacroCommand();

    expect(getCommandList(macro).length).toBe(0);

    const command1 = new AddCommand({ path: "path1" } as AddCommandStatData);
    const command2 = new AddCommand({ path: "path2" } as AddCommandStatData);

    macro.add(command1);
    macro.add(command2);
    macro.add(new AddCommand({ path: "path3" } as AddCommandStatData));

    macro.pop();

    expect(getCommandList(macro)).toEqual([command1, command2]);
  });

  it("get command at position index in commandList by get()", () => {
    const macro = new MacroCommand();

    expect(getCommandList(macro).length).toBe(0);

    macro.add(new AddCommand({ path: "path1" } as AddCommandStatData));
    macro.add(new AddCommand({ path: "path2" } as AddCommandStatData));
    macro.add(new AddCommand({ path: "path3" } as AddCommandStatData));

    expect(macro.get(1)).toEqual(
      new AddCommand({ path: "path2" } as AddCommandStatData)
    );
  });

  it("should execute all commands by do()", () => {
    const command1 = {
      do: jest.fn().mockReturnValue({ schema: 1 }),
    } as unknown as BaseCommand;
    const command2 = {
      do: jest.fn().mockReturnValue({ schema: 2 }),
    } as unknown as BaseCommand;
    const command3 = {
      do: jest.fn().mockReturnValue({ schema: 3 }),
    } as unknown as BaseCommand;
    const macro = new MacroCommand();

    macro.add(command1);
    macro.add(command2);
    macro.add(command3);

    // @ts-ignore
    const result = macro.do(0);

    expect(command1.do).toBeCalledWith(0);
    expect(command2.do).toBeCalledWith(1);
    expect(command3.do).toBeCalledWith(2);
    expect(result).toEqual(
      expect.objectContaining({
        schema: 3,
      })
    );
  });

  it("should execute all commands in reserved order by undo()", () => {
    const command1 = {
      undo: jest.fn().mockReturnValue({ schema: 1 }),
    } as unknown as BaseCommand;
    const command2 = {
      undo: jest.fn().mockReturnValue({ schema: 2 }),
    } as unknown as BaseCommand;
    const command3 = {
      undo: jest.fn().mockReturnValue({ schema: 3 }),
    } as unknown as BaseCommand;
    const macro = new MacroCommand();

    macro.add(command1);
    macro.add(command2);
    macro.add(command3);

    // @ts-ignore
    const result = macro.undo(0);

    expect(command3.undo).toBeCalledWith(0);
    expect(command2.undo).toBeCalledWith(3);
    expect(command1.undo).toBeCalledWith(2);
    expect(result).toEqual(
      expect.objectContaining({
        schema: 1,
      })
    );
  });
});
