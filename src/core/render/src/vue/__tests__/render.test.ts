import { SchemaData } from "@/core/parser/src/types/schema";
import { h } from "@vue/runtime-dom";
import { Ref } from "../ref";
import { render } from "../render";

jest.mock("@vue/runtime-core", () => {
  return {
    ...jest.requireActual("@vue/runtime-core"),
    h: jest.fn(),
  };
});

describe("Render", () => {
  it("It will pass component name as first parameter of h", () => {
    // @ts-ignore
    Ref.prototype.init = jest.fn().mockImplementation(() => "init");
    render({
      name: "ElInput",
      __uuid: 1,
      props: {
        value: 1,
      },
    } as SchemaData);

    expect(h).toBeCalledWith(
      "ElInput",
      {
        ref: "init",
        value: 1,
      },
      undefined
    );
  });
});
