import { SchemaRender } from "../../../../components";
import { shallowMount } from "@vue/test-utils";
import propsRender from "..";

jest.mock("../../transformer", () => {
  return {
    descritpor2Schema: jest.fn().mockImplementation((args: unknown) => args),
  };
});

describe("props-render", () => {
  it("It will pass the result of descriptor2Schema to prop schema of SchemaRender", () => {
    const wrapper = shallowMount(propsRender, {
      props: {
        descriptor: {
          test: "test",
        },
      },
    });
    const schemaRender = wrapper.findComponent(SchemaRender);

    expect(schemaRender.props("schema")).toEqual({
      test: "test",
    });
  });
});
