import { mount } from "@vue/test-utils";
import operationBarProvider from "../operation-bar.provider.vue";
import OperationBar from "../operation-bar.vue";
import { commandManager, Mutations } from "../../../../plugins/store";
import { useStore } from "vuex";

let handler: () => void = () => {};
const commitMock = jest.fn() as jest.Mock;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(useStore as jest.Mock) = jest.fn().mockImplementation(() => {
  return {
    // eslint-disable-next-line no-return-assign
    subscribe: jest.fn().mockImplementation((fn: () => void) => (handler = fn)),
    commit: commitMock,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperties(commandManager, {
    hasNoPrevCommand: {
      value: false,
      configurable: true,
      writable: true,
    },
    isAtLastCommand: {
      value: false,
      configurable: true,
      writable: true,
    },
  });
});

describe("OperationBar Provider", () => {
  it("should init disable status by commandManager", () => {
    const wrapper = mount(operationBarProvider);
    const operationBar = wrapper.findComponent(OperationBar);

    expect(operationBar.props("disableLeft")).toBe(false);
    expect(operationBar.props("disableRight")).toBe(false);
  });

  it("should update disable status after every mutations which will update schema", async () => {
    const wrapper = mount(operationBarProvider);
    const operationBar = wrapper.findComponent(OperationBar);

    expect(operationBar.props("disableLeft")).toBe(false);
    expect(operationBar.props("disableRight")).toBe(false);

    Object.defineProperties(commandManager, {
      hasNoPrevCommand: {
        value: true,
        configurable: true,
        writable: true,
      },
      isAtLastCommand: {
        value: true,
        configurable: true,
        writable: true,
      },
    });

    // equals commit a mutation
    handler();

    await wrapper.vm.$nextTick();

    expect(operationBar.props("disableLeft")).toBe(true);
    expect(operationBar.props("disableRight")).toBe(true);
  });

  it("should commit REDO mutations when trigger redo", () => {
    const wrapper = mount(operationBarProvider);
    const operationBar = wrapper.findComponent(OperationBar);

    operationBar.vm.$emit("redo");

    expect(commitMock).toHaveBeenCalledWith(Mutations.REDO);
  });

  it("should commit UNDO mutations when trigger undo", () => {
    const wrapper = mount(operationBarProvider);
    const operationBar = wrapper.findComponent(OperationBar);

    operationBar.vm.$emit("undo");

    expect(commitMock).toHaveBeenCalledWith(Mutations.UNDO);
  });
});
