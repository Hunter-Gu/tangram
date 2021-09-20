jest.mock("../utils/get-descriptor-by-runtime", () => {
  return {
    getDescriptorByRuntime: jest.fn().mockImplementation(() => "currentSelect"),
  };
});

jest.mock("../../pages/editor/utils/registry", () => {
  return {
    registry: {
      getPropsDescriptor: jest.fn().mockReturnValue({
        data: {
          component: {
            name: "component",
          },
          descriptor: {
            props: [],
          },
        },
      }),
    },
  };
});

/* eslint-disable import/first */
import { commandManager, Mutations, State, store } from "../store";
import { DropType } from "../../pages/editor/types/node-tree";
import { Operation } from "../../pages/editor/block/types";
import { get } from "../../core/parser/src/utils/utils";
import { removeNode } from "../utils/remove-node";
import { SchemaData } from "../../core/parser/src/types/schema";
/* eslint-enable */

function initManager(state: State) {
  commandManager["data"] = state.schema;
  store.replaceState(state);
}

describe("Mutations of Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("SELECT mutation", () => {
    jest.mock("../../pages/editor/utils/registry", () => {
      return {
        registry: {
          getPropsDescriptor: jest.fn(),
        },
      };
    });
    const state = {
      schema: {},
    } as unknown as State;
    initManager(state);
    const update = jest.spyOn(removeNode, "update");

    store.commit(Mutations.SELECT, { path: "path" });

    expect(state).toEqual({
      schema: {},
      currentPath: "path",
      currentSelect: "currentSelect",
      selectPaths: ["path"],
    });
    expect(update).toBeCalledWith(state.schema, "path");
  });

  it("UPDATE_ELEMENT_PROPS mutation", () => {
    const state = {
      schema: {
        children: [
          {
            props: {
              name: "",
            },
          },
        ],
      },
      currentPath: "children.0",
    } as unknown as State;
    initManager(state);

    store.commit(Mutations.UPDATE_ELEMENT_PROPS, {
      field: "name",
      value: "value",
    });

    expect(state).toEqual({
      schema: {
        children: [
          {
            props: {
              name: "value",
            },
          },
        ],
      },
      currentPath: "children.0",
    });
  });

  it("CLEAR_SELECTS mutations", () => {
    const state = {} as unknown as State;
    const update = jest.spyOn(removeNode, "update");
    initManager(state);

    store.commit(Mutations.CLEAR_SELECTS);
    expect(state).toEqual({
      selectPaths: [],
      currentPath: "",
      currentSelect: undefined,
    });
    expect(update).toBeCalledWith(undefined, "");
  });

  describe("ADD_ELEMENT", () => {
    it.each`
      addPath         | currentPath                | type
      ${"children.0"} | ${"children.0.children.0"} | ${""}
      ${"children.0"} | ${"children.0.children.0"} | ${Operation.Inside}
      ${"children.0"} | ${"children.0"}            | ${Operation.Top}
      ${"children.0"} | ${"children.1"}            | ${Operation.Bottom}
    `(
      "when commit ADD_ELEMENT mutation, and all execute commands will be collected as a macro command",
      ({ addPath, currentPath, type }) => {
        window.Date.prototype.getTime = jest.fn().mockReturnValue(1);
        const state = {
          schema: {
            children: [
              {
                props: {
                  name: "value",
                },
              },
            ],
          },
        } as unknown as State;
        initManager(state);

        store.commit(Mutations.ADD_ELEMENT, {
          path: addPath,
          componentName: "",
          type,
        });

        expect(state.currentPath).toBe(currentPath);
        expect(state.currentSelect).toBe("currentSelect");
        expect(state.selectPaths).toEqual([currentPath]);

        expect(get(state.schema, currentPath)).toEqual({
          name: {
            name: "component",
          },
          __uuid: 1,
        });
      }
    );

    it("when ADD_ELEMENT mutation, should call startMacro() before execute addCommand, and call endMacro() after execute updateCommand", () => {
      const state = {
        schema: {
          children: [
            {
              props: {
                name: "value",
              },
            },
          ],
        },
      } as unknown as State;
      initManager(state);
      const order: string[] = [];

      jest
        .spyOn(commandManager, "startMacro")
        .mockImplementation(() => order.push("startMacro"));
      jest
        .spyOn(commandManager, "endMacro")
        .mockImplementation(() => order.push("endMacro"));
      const doFn = commandManager.do;
      jest.spyOn(commandManager, "do").mockImplementation(() => {
        order.push("do");
        return {
          schema: state.schema,
          currentPath: "children.0",
        };
      });

      store.commit(Mutations.ADD_ELEMENT, {
        path: "children.0",
        componentName: "",
      });

      expect(order.length > 2).toBeTruthy();
      expect(order[0]).toBe("startMacro");
      expect(order[order.length - 1]).toBe("endMacro");

      // don't know why jest.clearAllMocks() don't remove this mock implementation
      commandManager.do = doFn;
    });
  });

  it("MOVE mutation", () => {
    const state = {
      schema: {
        children: [
          {
            name: "name1",
          },
          {
            name: "name2",
          },
        ],
      },
    } as unknown as State;
    initManager(state);

    store.commit(Mutations.MOVE, {
      from: "children.1",
      to: "children.0",
      type: DropType.Inner,
    });

    expect(state).toEqual({
      schema: {
        children: [
          {
            name: "name1",
            children: [
              {
                name: "name2",
              },
            ],
          },
        ],
      },
      selectPaths: [],
      currentPath: ``,
      currentSelect: undefined,
    });

    store.commit(Mutations.MOVE, {
      from: "children.0.children.0",
      to: "children.0",
      type: DropType.Prev,
    });

    expect(state).toEqual({
      schema: {
        children: [
          {
            name: "name2",
          },
          {
            name: "name1",
            children: [],
          },
        ],
      },
      selectPaths: [],
      currentPath: ``,
      currentSelect: undefined,
    });

    store.commit(Mutations.MOVE, {
      from: "children.0",
      to: "children.1",
      type: DropType.Next,
    });

    expect(state).toEqual({
      schema: {
        children: [
          {
            name: "name1",
            children: [],
          },
          {
            name: "name2",
          },
        ],
      },
      selectPaths: [],
      currentPath: ``,
      currentSelect: undefined,
    });
  });

  it("should call commandManger.redo() and update schema and currentSelectPath when commit REDO", () => {
    const redo = jest.spyOn(commandManager, "redo").mockReturnValue({
      currentPath: "currentPath",
      schema: {
        name: "schema",
      } as SchemaData,
    });

    store.commit(Mutations.REDO);

    expect(redo).toBeCalled();
    expect(store.state.schema).toEqual({ name: "schema" });
    expect(store.state.currentPath).toBe("currentPath");
  });

  it("should call commandManger.undo() and update schema and currentSelectPath when commit UNDO", () => {
    const undo = jest.spyOn(commandManager, "undo").mockReturnValue({
      currentPath: "currentPath",
      schema: {
        name: "schema",
      } as SchemaData,
    });

    store.commit(Mutations.UNDO);

    expect(undo).toBeCalled();
    expect(store.state.schema).toEqual({ name: "schema" });
    expect(store.state.currentPath).toBe("currentPath");
  });
});
