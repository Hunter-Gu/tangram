const enhance = jest.fn().mockImplementation((arg: unknown) => arg);

jest.mock("../enhance", () => {
  return {
    enhance,
  };
});

/* eslint-disable import/first */
import { shallowMount } from "@vue/test-utils";
import { SchemaRender } from "../../../../components";
import Stage from "..";
/* eslint-enable */

describe("Component Stage", () => {
  it("The Stage will use the computed data as prop schema of component SchemaRender", () => {
    const wrapper = shallowMount(Stage, {
      props: {
        schema: {
          name: "name",
        },
      },
    });
    const schemaRender = wrapper.findComponent(SchemaRender);

    expect(schemaRender.props("schema")).toEqual({ name: "name" });
    expect(enhance).toBeCalled();
  });
});
