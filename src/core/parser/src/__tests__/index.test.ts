import { parse, render } from "..";
import { SchemaData } from "../types/schema";
import { handler } from "../handlers";
import { GetRef } from "../types/render";

const invoke = handler.invoke;

describe("Parser", () => {
  afterEach(() => {
    handler.invoke = invoke;
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parse()", () => {
    it("handler.invoke() should call schema passed by parse() function", () => {
      const schema = {} as SchemaData;

      jest.spyOn(handler, "invoke");

      parse(schema);

      expect(handler.invoke).toBeCalledWith(schema);
    });
  });

  describe("render()", () => {
    it("render() will can parse() first, and then call it's internal _render() on every schema node", () => {
      const schema = {
        name: "ProgressBar",
        __uuid: 2,
        attrs: {
          style: 'color: "red", border: "1px solid red"',
        },
        props: {
          value: 0.3,
        },
        children: [
          {
            name: "ElInput",
            __uuid: 3,
            props: {
              value: 0.3,
            },
          },
          {
            name: "ElCheckbox",
            __uuid: 4,
            props: {
              checked: true,
            },
          },
        ],
      };
      handler.invoke = jest.fn().mockImplementation(() => {
        return schema;
      });

      const h = jest.fn().mockImplementation(() => {
        return {};
      });
      render({} as SchemaData, h, ((arg: unknown) => arg) as GetRef);

      expect(handler.invoke).toHaveBeenCalledTimes(1);
      expect(handler.invoke).toBeCalledWith({});

      expect(h).toHaveBeenCalledTimes(3);
      expect(h).nthCalledWith(
        1,
        3,
        "ElInput",
        {
          value: 0.3,
        },
        undefined
      );
      expect(h).nthCalledWith(
        2,
        4,
        "ElCheckbox",
        {
          checked: true,
        },
        undefined
      );
      expect(h).nthCalledWith(
        3,
        2,
        "ProgressBar",
        {
          style: 'color: "red", border: "1px solid red"',
          value: 0.3,
        },
        [{}, {}]
      );
    });
  });
});
