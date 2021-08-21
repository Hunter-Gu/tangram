import { id } from "../../../../core/parser/src/utils/id";
import { PropEnhance } from "../prop-enhance";
import EnhanceProp from "../components/enhance-prop";
import { DescriptorPropTypes } from "../../types/descriptor";

describe("PropEnhance", () => {
  it("The class PropEnhance will return a function and call it's _render method", () => {
    const propEnhance = new PropEnhance(id);

    window.Date.prototype.getTime = jest.fn().mockReturnValue(1);

    expect(
      propEnhance.enhance({
        // @ts-ignore
        component: "ElInput",
        staticProps: {
          placeholder: "hello world",
        },
      })({
        name: "type",
        label: "类型",
        type: DescriptorPropTypes.String,
      })
    ).toEqual({
      name: EnhanceProp,
      __uuid: 1,
      props: {
        component: "ElInput",
        staticProps: {
          placeholder: "hello world",
        },
        name: "type",
        label: "类型",
        type: DescriptorPropTypes.String,
      },
    });
  });
});
