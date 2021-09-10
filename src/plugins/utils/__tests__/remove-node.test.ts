import { cloneDeep } from "lodash";
import { SchemaData } from "../../../core/parser/src/types/schema";
import { remove, RemoveNode } from "../remove-node";

describe("RemoveNode", () => {
  it("It will listen keyup event when instantiate", () => {
    const listen = jest.spyOn(document, "addEventListener");

    // eslint-disable-next-line no-new
    new RemoveNode();

    expect(listen.mock.calls[0][0]).toBe("keyup");
  });

  it("It will call remove when backspace keyup", () => {
    const removeNode = new RemoveNode();
    const data = {
      children: [
        {
          name: "ElInput",
        },
        {
          name: "ElCheckbox",
        },
        {
          name: "ElTextarea",
        },
      ],
    } as SchemaData;
    const schema = cloneDeep(data);

    removeNode.update(schema, "children.1");

    // nothing change
    // @ts-ignore
    removeNode.handleRemove({ key: "ArrowUp" });

    expect(schema).toEqual(data);

    removeNode.update(undefined, "");
    // @ts-ignore
    removeNode.handleRemove({ key: "Backspace" });
    expect(schema).toEqual(data);

    removeNode.update(schema, "children.1");
    // @ts-ignore
    removeNode.handleRemove({ key: "Backspace" });

    expect(schema).toEqual({
      children: [
        {
          name: "ElInput",
        },
        {
          name: "ElTextarea",
        },
      ],
    });
  });

  it("It should remove keyup listener when call dispose()", () => {
    const removeNode = new RemoveNode();

    const listen = jest.spyOn(document, "removeEventListener");
    removeNode.dispose();

    expect(listen.mock.calls[0][0]).toBe("keyup");
  });

  describe("remove", () => {
    it("it will remove node by path", () => {
      const schema = {
        children: [
          {
            name: "ElInput",
          },
          {
            name: "ElCheckbox",
          },
          {
            name: "ElTextarea",
          },
        ],
      } as SchemaData;

      remove(schema, "children.1");

      expect(schema).toEqual({
        children: [
          {
            name: "ElInput",
          },
          {
            name: "ElTextarea",
          },
        ],
      });
    });
  });
});
