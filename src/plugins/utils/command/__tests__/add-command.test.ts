import { SchemaData } from "../../../../core/parser/src/types/schema";
import { Operation } from "../../../../pages/editor/block/types";
import { AddCommand } from "../add-command";
import { getDiff } from "./utils";

beforeAll(() => {
  jest.spyOn(window.Date.prototype, "getTime").mockReturnValue(1);
});

describe("AddCommand", () => {
  it.each`
    type                | path                       | newPath
    ${Operation.Inside} | ${"children.0"}            | ${"children.0.children.0"}
    ${""}               | ${""}                      | ${"children.3"}
    ${Operation.Bottom} | ${"children.1.children.0"} | ${"children.1.children.1"}
    ${Operation.Top}    | ${"children.1"}            | ${"children.1"}
  `("calc diff by calcDiff()", ({ type, path, newPath }) => {
    const schema = {
      children: [
        {
          children: [],
        },
        {
          children: [],
        },
        {
          children: [],
        },
      ],
    } as unknown as SchemaData;

    const addCommand = new AddCommand({
      type,
      path,
      componentOrTagName: "",
    });

    addCommand.calcDiff(schema);

    expect(getDiff(addCommand)).toEqual({
      path: newPath,
      value: {
        name: "",
        __uuid: 1,
      },
    });
  });

  it("operate by do(), revert operation by call undo()", () => {
    const schema = {
      children: [{}],
    } as unknown as SchemaData;
    const addCommand = new AddCommand({
      type: Operation.Inside,
      path: "children.0",
      componentOrTagName: "",
    });

    addCommand.calcDiff(schema);
    addCommand.do(schema);

    expect(schema).toEqual({
      children: [
        {
          children: [
            {
              name: "",
              __uuid: 1,
            },
          ],
        },
      ],
    });

    addCommand.undo(schema);

    expect(schema).toEqual({
      children: [
        {
          children: [],
        },
      ],
    });
  });
});
