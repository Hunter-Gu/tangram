import { shallowMount } from "@vue/test-utils";
import { ElInput } from "element-plus";
import SafeContainer from "..";

const registerRef = jest.fn();

describe("SafeContainer", () => {
  it("It will only show the component name if errors occur", () => {
    const errorComponent = {
      mounted() {
        throw new Error("mock component occur errors");
      },
    };
    const wrapper = shallowMount(SafeContainer, {
      props: {
        component: errorComponent,
        componentName: "errorComponent",
        registerRef,
      },
    });

    expect(wrapper.find(".name").text()).toBe("errorComponent");
    expect(wrapper.findComponent(ElInput).exists()).toBeFalsy();
    expect(registerRef).toBeCalled();
  });

  it("It will show the component and it's name when none errors occur", () => {
    const wrapper = shallowMount(SafeContainer, {
      props: {
        component: ElInput,
        componentName: "ElInput",
        registerRef,
      },
    });

    expect(wrapper.find(".name").text()).toBe("ElInput");
    expect(wrapper.findComponent(ElInput).exists()).toBeTruthy();
    expect(registerRef).toBeCalled();
  });
});
