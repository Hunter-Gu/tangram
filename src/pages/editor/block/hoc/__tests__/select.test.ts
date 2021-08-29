import { mount } from "@vue/test-utils";
import { CLASS_SELECT_STATUS } from "../constants";
import Select from "../select.vue";

describe("HOC Select for Block", () => {
  it("It will add select classname when selectPaths include path", () => {
    const wrapper = mount(Select, {
      props: {
        name: "a",
        path: "b",
        selectPaths: ["a", "b", "c"],
      },
    });
    const selectTarget = wrapper.find(".select");

    expect(selectTarget.classes()).toContain(CLASS_SELECT_STATUS);
  });

  it("It will emit select and clear-selects event when trigger click inside the component", async () => {
    const wrapper = mount(Select);
    const selectTarget = wrapper.find(".select");

    await selectTarget.trigger("click");

    expect(wrapper.emitted().select.length).toBe(1);
    expect(wrapper.emitted().clearSelects.length).toBe(1);
  });
});
