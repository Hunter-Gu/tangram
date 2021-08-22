jest.mock("vuex", () => {
  return {
    // TODO
    // need to check if it is necessary
    createStore: jest.fn(),
    useStore() {
      return {
        state: {},
      };
    },
  };
});

/* eslint-disable import/first */
import { shallowMount } from "@vue/test-utils";
import { ElTree } from "element-plus";
import "../../../../plugins/__test__/element-plus.mock";
import nodeTree from "..";
/* eslint-enable */

describe("Component NodeTree", () => {
  it("The ElTree of NodeTree will use nomalized props.schema as prop data", async () => {
    const wrapper = shallowMount(nodeTree, {
      propsData: {
        schema: {
          name: "div",
          __uuid: 0,
          children: [
            {
              name: { name: "ElInput" },
              __uuid: 1,
              props: { type: "primary" },
              children: [
                {
                  name: { name: "ElButton" },
                  __uuid: 2,
                },
              ],
            },
          ],
        },
      },
    });
    const elTree = wrapper.getComponent(ElTree);
    const delay = () => {
      return new Promise((resolve) => setTimeout(resolve, 100));
    };

    await delay();

    expect(elTree.props("data")).toEqual([
      {
        uuid: "root",
        label: "label",
        _meta: {
          name: "div",
          path: "",
        },
        children: [
          {
            uuid: "children.0",
            label: "ElInput",
            _meta: {
              name: { name: "ElInput" },
              path: "children.0",
            },
            children: [
              {
                uuid: "children.0.children.0",
                label: "ElButton",
                _meta: {
                  name: { name: "ElButton" },
                  path: "children.0.children.0",
                },
              },
            ],
          },
        ],
      },
    ]);
  });
});
