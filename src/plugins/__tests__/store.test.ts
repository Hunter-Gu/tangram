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
import { Mutations, State, store } from "../store";
import { DropType } from "../../pages/editor/types/node-tree";
import { Operation } from "../../pages/editor/block/types";
import { get } from "../../core/parser/src/utils/utils";
/* eslint-enable */

describe("Mutations of Store", () => {
  it("SELECT mutation", () => {
    jest.mock("../../pages/editor/utils/registry", () => {
      return {
        registry: {
          getPropsDescriptor: jest.fn(),
        },
      };
    });
    const state = {};
    // @ts-ignore
    store.replaceState(state);

    store.commit(Mutations.SELECT, { path: "path" });

    expect(state).toEqual({
      currentPath: "path",
      currentSelect: "currentSelect",
      selectPaths: ["path"],
    });
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
    };
    // @ts-ignore
    store.replaceState(state);

    store.commit(Mutations.UPDATE_ELEMENT_PROPS, {
      path: "name",
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
    const state = {};
    // @ts-ignore
    store.replaceState(state);

    store.commit(Mutations.CLEAR_SELECTS);
    expect(state).toEqual({
      selectPaths: [],
      currentPath: "",
      currentSelect: undefined,
    });
  });

  it.each`
    addPath         | currentPath                | type
    ${"children.0"} | ${"children.0.children.0"} | ${""}
    ${"children.0"} | ${"children.0.children.0"} | ${Operation.Inside}
    ${"children.0"} | ${"children.0"}            | ${Operation.Top}
    ${"children.0"} | ${"children.1"}            | ${Operation.Bottom}
  `("ADD_ELEMENT mutation", ({ addPath, currentPath, type }) => {
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
    // @ts-ignore
    store.replaceState(state);

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
    };
    // @ts-ignore
    store.replaceState(state);

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
});
