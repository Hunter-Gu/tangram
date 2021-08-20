jest.doMock("../transformer", () => {
  return {
    transformer: {
      root: { component: "div" },
      // this function has been test in transformer.test.ts
      // we should only test it has been called correctly
      // @ts-ignore
      transform: jest.fn().mockImplementation((name, prop) => ({ name, prop })),
    },
  } as Transformer;
});

// eslint-disable-next-line import/first
import { descritpor2Schema } from "../transform";
// eslint-disable-next-line import/first
import { DescriptorPropTypes, PropsDescriptor } from "../../types/descriptor";

window.Date.prototype.getTime = jest.fn().mockImplementation(() => 1);

describe("descritpor2Schema()", () => {
  it("The `descriptor.props` will be handled by transformer.transform(), and push the result to children filed of schema", () => {
    const ElInputDescriptor: PropsDescriptor = {
      name: "ElInput",
      props: [
        {
          name: "modelValue",
          label: "内容",
          type: DescriptorPropTypes.String,
          defaultValue: "Hello World!",
        },
        {
          name: "placeholder",
          label: "占位符",
          type: DescriptorPropTypes.String,
        },
      ],
    };

    expect(descritpor2Schema(ElInputDescriptor)).toEqual({
      name: "div",
      props: {
        wrapperName: "ElInput",
      },
      __uuid: 1,
      children: [
        {
          name: "ElInput",
          prop: {
            name: "modelValue",
            label: "内容",
            type: DescriptorPropTypes.String,
            defaultValue: "Hello World!",
          },
          __uuid: 1,
        },
        {
          name: "ElInput",
          prop: {
            name: "placeholder",
            label: "占位符",
            type: DescriptorPropTypes.String,
          },
          __uuid: 1,
        },
      ],
    });
  });
});
