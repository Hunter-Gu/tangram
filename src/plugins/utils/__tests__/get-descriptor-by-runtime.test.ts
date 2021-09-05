import {
  DescriptorPropTypes,
  PropsDescriptor,
} from "../../../pages/editor/types/descriptor";
import { getDescriptorByRuntime } from "../get-descriptor-by-runtime";

describe("getDescriptorByRuntime()", () => {
  it("should set runtime props field or default props field", () => {
    const descriptor: PropsDescriptor = {
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

    const runtimeData = {
      placeholder: "123",
    };

    expect(getDescriptorByRuntime(descriptor, runtimeData)).toEqual({
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
          defaultValue: "123",
        },
      ],
    });
  });
});
