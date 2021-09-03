import { mount } from "@vue/test-utils";
import Drop from "../drop.vue";

jest.mock('lodash', () => ({
  debounce: (fn: () => void) => fn
}))

describe("HOC Drop for Block", () => {
  it("It will clear drag focus status and emit add event when drop element", async () => {
    const wrapper = mount(Drop, {
      props: {
        path: "path",
      },
    });
    const dropTarget = wrapper.find("div");

    await dropTarget.trigger("drop");

    expect(dropTarget.classes()).toEqual([]);
    expect(wrapper.emitted().add.length).toBe(1);
  });

  it("It will calc drag bound when dragover", async () => {
    const wrapper = mount(Drop, {
      props: {
        path: "path",
        isCurrent: true
      },
    });
    const dropTarget = wrapper.find("div");

    await dropTarget.trigger("dragover");

    console.log(dropTarget.classes())

    expect(dropTarget.classes().length).toBeTruthy();
  });

  it("It will clear drag focus status when dragleave", async () => {
    const wrapper = mount(Drop, {
      props: {
        path: "path",
        isCurrent: true
      },
    });
    const dropTarget = wrapper.find("div");

    await dropTarget.trigger("dragover");

    expect(dropTarget.classes().length).toBeTruthy();

    await dropTarget.trigger("dragleave");

    expect(dropTarget.classes().length).toBeFalsy();
  });
});
