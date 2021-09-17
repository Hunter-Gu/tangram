import { SchemaData } from "@/core/parser/src/types/schema";
import { UpdateCommand } from "../update-command";
import { getDiff } from "./utils";

describe("UpdateCommand", () => {
  it("calc diff by calcDiff()", () => {
    const schema = {
      children: [
        {
          props: {
            value: "oldValue",
          },
        },
      ],
    } as unknown as SchemaData;
    const updateCommand = new UpdateCommand({
      path: "children.0",
      field: "value",
      value: "newValue",
    });

    updateCommand.calcDiff(schema);

    expect(getDiff(updateCommand)).toEqual({
      path: "children.0.props.value",
      value: {
        oldValue: "oldValue",
        newValue: "newValue",
      },
    });
  });

  it("operate by do(), revert operation by call undo()", () => {
    const schema = {
      children: [
        {
          props: {
            value: "oldValue",
          },
        },
      ],
    } as unknown as SchemaData;
    const updateCommand = new UpdateCommand({
      path: "children.0",
      field: "value",
      value: "newValue",
    });

    updateCommand.calcDiff(schema);

    updateCommand.do(schema);

    expect(schema).toEqual({
      children: [
        {
          props: {
            value: "newValue",
          },
        },
      ],
    });

    updateCommand.undo(schema);

    expect(schema).toEqual({
      children: [
        {
          props: {
            value: "oldValue",
          },
        },
      ],
    });
  });

  it("should check if command can be replaced by other command", () => {
    const schema = {
      children: [
        {
          props: {
            value: "oldValue",
          },
        },
      ],
    } as unknown as SchemaData;
    const updateCommand1 = new UpdateCommand({
      path: "children.0",
      field: "value",
      value: "newValue",
    });

    updateCommand1.calcDiff(schema);
    const { schema: updatedSchema } = updateCommand1.do(schema);

    const updateCommand2 = new UpdateCommand({
      path: "children.0",
      field: "value",
      value: "newValue",
    });
    updateCommand2.calcDiff(updatedSchema);

    expect(updateCommand1.canReplaceBy(updateCommand2)).toBe(true);
    expect(getDiff(updateCommand2).value.oldValue).toBe(
      getDiff(updateCommand1).value.oldValue
    );
  });
});
