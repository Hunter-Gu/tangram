jest.mock("../utils/get-descriptor-by-runtime", () => {
  return {
    getDescritporByRuntime: jest.fn().mockImplementation(() => "currentSelect"),
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

// eslint-disable-next-line import/first
import { Mutations, store } from "../store";
// eslint-disable-next-line import/first
import { DropType } from "../../pages/editor/types/node-tree";

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

  it("ADD_ELEMENT mutation", () => {
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
    };
    // @ts-ignore
    store.replaceState(state);

    store.commit(Mutations.ADD_ELEMENT, {
      path: "children.0",
      componentName: "",
    });

    expect(state).toEqual({
      currentPath: "children.0.children.0",
      currentSelect: "currentSelect",
      selectPaths: ["children.0.children.0"],
      schema: {
        children: [
          {
            props: {
              name: "value",
            },
            children: [
              {
                name: {
                  name: "component",
                },
                __uuid: 1,
              },
            ],
          },
        ],
      },
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
    });
  });
});
