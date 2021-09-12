import { SchemaData } from "../../../../core/parser/src/types/schema";
import { RemoveCommand } from "../remove-command";
import { getDiff } from "./utils";

describe("RemoveCommand", () => {
  it("calc diff by calcDiff()", () => {
    const schema = {
      children: [
        {
          name: "target",
        },
      ],
    } as SchemaData;
    const removeCommand = new RemoveCommand({
      path: "children.0",
    });

    removeCommand.calcDiff(schema);

    expect(getDiff(removeCommand)).toEqual({
      path: "children.0",
      value: {
        name: "target",
      },
    });
  });

  it("operate by do(), revert operation by call undo()", () => {
    const schema = {
      children: [
        {
          name: "target",
        },
      ],
    } as SchemaData;
    const removeCommand = new RemoveCommand({
      path: "children.0",
    });

    removeCommand.calcDiff(schema);

    removeCommand.do(schema);

    expect(schema).toEqual({
      children: [],
    });

    removeCommand.undo(schema);

    expect(schema).toEqual({
      children: [
        {
          name: "target",
        },
      ],
    });
  });
});
