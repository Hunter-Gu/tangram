import { SchemaData } from "../../../../core/parser/src/types/schema";
import { DropType } from "../../../../pages/editor/types/node-tree";
import { MoveCommand } from "../move-command";
import { getDiff } from "./utils";

describe("MoveCommand", () => {
  it.each`
    from            | to              | type              | path
    ${"children.1"} | ${"children.0"} | ${DropType.Inner} | ${"children.0.children.0"}
    ${"children.0"} | ${"children.1"} | ${DropType.Next}  | ${"children.1"}
    ${"children.1"} | ${"children.0"} | ${DropType.Prev}  | ${"children.0"}
  `("calc diff by calcDiff()", ({ from, to, type, path }) => {
    const schema = {
      children: [
        {
          name: "name1",
        },
        {
          name: "name2",
        },
      ],
    } as SchemaData;
    const moveCommand = new MoveCommand({
      from,
      to,
      type,
    });

    moveCommand.calcDiff(schema);

    expect(getDiff(moveCommand)).toEqual({
      path,
      value: {
        from,
        to: path,
      },
    });
  });

  it("operate by do(), revert operation by call undo()", () => {
    const schema = {
      children: [
        {
          name: "name1",
          children: [
            {
              name: "name2",
            },
          ],
        },
        {
          name: "name3",
        },
      ],
    } as SchemaData;
    const moveCommand = new MoveCommand({
      from: "children.1",
      to: "children.0",
      type: DropType.Inner,
    });

    moveCommand.calcDiff(schema);

    moveCommand.do(schema);

    expect(schema).toEqual({
      children: [
        {
          name: "name1",
          children: [
            {
              name: "name2",
            },
            {
              name: "name3",
            },
          ],
        },
      ],
    });

    moveCommand.undo(schema);

    expect(schema).toEqual({
      children: [
        {
          name: "name1",
          children: [
            {
              name: "name2",
            },
          ],
        },
        {
          name: "name3",
        },
      ],
    });
  });
});
