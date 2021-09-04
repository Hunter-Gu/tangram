import { mount } from "@vue/test-utils";
import Drop from "../drop.vue";
import { hoverLayerManager } from "../hover-layer-manager";

jest.mock("lodash", () => ({
  debounce: (fn: () => void) => fn,
}));

describe("HOC Drop for Block", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("It will clear drag focus status and emit add event when drop element", async () => {
    const wrapper = mount(Drop, {
      props: {
        path: "path",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(window, "setTimeout").mockImplementation((fn: any) => fn());

    const updatePath = jest.spyOn(hoverLayerManager, "updatePath");
    const dropTarget = wrapper.find("div");

    await dropTarget.trigger("drop");

    expect(dropTarget.classes()).toEqual([]);
    expect(wrapper.emitted().add.length).toBe(1);
    expect(updatePath).toBeCalledWith("");
  });

  it.each`
    isCurrentPath | classLength | callTimes
    ${false}      | ${0}        | ${1}
    ${true}       | ${0}        | ${0}
  `(
    "It will calc drag bound when dragover",
    async ({ isCurrentPath, classLength, callTimes }) => {
      const wrapper = mount(Drop, {
        props: {
          path: "path",
        },
      });
      const dropTarget = wrapper.find("div");

      jest
        .spyOn(hoverLayerManager, "isCurrentPath")
        .mockReturnValue(isCurrentPath);
      jest.spyOn(hoverLayerManager, "updatePath");

      await dropTarget.trigger("dragover");

      expect(dropTarget.classes().length).toBe(classLength);
      expect(hoverLayerManager.updatePath).toHaveBeenCalledTimes(callTimes);
    }
  );

  it("It will clear drag focus status when dragleave", async () => {
    const wrapper = mount(Drop, {
      props: {
        path: "path",
        isCurrent: true,
      },
    });
    const dropTarget = wrapper.find("div");
    const updatePath = jest.spyOn(hoverLayerManager, "updatePath");

    await dropTarget.trigger("dragover");

    expect(dropTarget.classes().length).toBeTruthy();

    await dropTarget.trigger("dragleave");

    expect(dropTarget.classes().length).toBeFalsy();
    expect(updatePath).toBeCalledWith("");
  });
});
