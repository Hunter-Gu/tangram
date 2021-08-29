import { mount, shallowMount } from "@vue/test-utils";
import Block from "../block.vue";
import SelectWrapper from "../hoc/select.vue";
import DropWrapper from "../hoc/drop.vue";

describe("Block", () => {
  it("The component Block will also emit clear-selects for handle clear-selects event of component SelectWrapper", () => {
    const wrapper = shallowMount(Block);
    const selectWrapper = wrapper.findComponent(SelectWrapper);

    selectWrapper.vm.$emit("clear-selects");

    expect(wrapper.emitted().clearSelects.length).toBe(1);
  });

  it("The component Block will also emit select for handle select event of component SelectWrapper", () => {
    const wrapper = shallowMount(Block);
    const selectWrapper = wrapper.findComponent(SelectWrapper);
    const params = { name: "a", path: "b" };

    selectWrapper.vm.$emit("select", params);

    expect(wrapper.emitted().select.length).toBe(1);
    expect(wrapper.emitted().select[0]).toEqual([params]);
  });

  it("The component Block will also emit add for handle add event of component SelectWrapper", () => {
    const wrapper = mount(Block);
    const dropWrapper = wrapper.findComponent(DropWrapper);
    const params = { evt: "a", path: "b" };

    dropWrapper.vm.$emit("add", params);

    expect(wrapper.emitted().add.length).toBe(1);
    expect(wrapper.emitted().add[0]).toEqual([params]);
  });
});
