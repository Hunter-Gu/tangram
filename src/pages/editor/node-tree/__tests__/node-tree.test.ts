import { mount, shallowMount } from "@vue/test-utils";
import { ElTree } from "element-plus";
import nodeTree from "../node-tree.vue";
import "../../../../plugins/__test__/element-plus.mock";

jest.mock("../normalize", () => ({
  normalize: (arg: unknown) => [arg],
}));

const props = {
  schema: {
    name: { name: "div" },
    uuid: 1,
    props: { type: "primary" },
  },
  currentNodeKey: 1,
};

describe("Component NodeTree", () => {
  it("The ElTree of NodeTree will use nomalized props.schema as prop data", async () => {
    const wrapper = shallowMount(nodeTree, { props });
    const elTree = wrapper.getComponent(ElTree);

    expect(elTree.props("data")).toEqual([props.schema]);
  });

  it("The ElTree of NodeTree use 'uuid' as prop node-key", () => {
    const wrapper = shallowMount(nodeTree, { props });
    const elTree = wrapper.findComponent(ElTree);

    expect(elTree.props("nodeKey")).toBe("uuid");
  });

  it("The currentNodeKey used to highlight the node to mark it as the current selected", () => {
    const wrapper = mount(nodeTree, { props });
    const shallowWrapper = shallowMount(nodeTree, { props });
    const selectedNode = wrapper.find(".is-current");
    const elTree = shallowWrapper.findComponent(ElTree);

    expect(selectedNode.exists()).toBe(true);
    expect(elTree.props("currentNodeKey")).toBe(1);
  });
});
