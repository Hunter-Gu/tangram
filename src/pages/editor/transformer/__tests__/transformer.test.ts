import { DescritporTransformer } from "../transformer";
import { IPropEnhance } from "../prop-enhance";
import { ElInput, ElSwitch } from "element-plus";
import { DescriptorPropTypes } from "../../types/descriptor";

function getPropEnhance(): IPropEnhance {
  return {
    // @ts-ignore
    enhance() {},
  };
}

function getMapping(transformer: DescritporTransformer) {
  // @ts-ignore
  return transformer.mapping;
}

function getGlobalMapping(transformer: DescritporTransformer) {
  // @ts-ignore
  return transformer.globalMapping;
}

describe("DescriptorTransformer of page /editor", () => {
  describe("The config() can register for specify component name", () => {
    it("The config() can register for component prop, and there will be a props field", () => {
      const transformer = new DescritporTransformer(getPropEnhance());

      // @ts-ignore
      transformer.config("ElInput", "disabled", ElSwitch);
      // @ts-ignore
      transformer.config("ElInput", "placeholder", ElInput, {});

      expect(getMapping(transformer)).toEqual({
        ElInput: {
          props: {
            disabled: {
              component: ElSwitch,
              staticProps: undefined,
            },
            placeholder: {
              component: ElInput,
              staticProps: {},
            },
          },
        },
      });
    });

    it("The config() can register types for a specify component, and there will be a types field", () => {
      const transformer = new DescritporTransformer(getPropEnhance());

      // @ts-ignore
      transformer.config("ElInput", DescriptorPropTypes.Boolean, ElSwitch);
      // @ts-ignore
      transformer.config("ElInput", DescriptorPropTypes.Number, ElInput, {
        type: "number",
      });

      expect(getMapping(transformer)).toEqual({
        ElInput: {
          types: {
            [DescriptorPropTypes.Boolean]: {
              component: ElSwitch,
              staticProps: undefined,
            },
            [DescriptorPropTypes.Number]: {
              component: ElInput,
              staticProps: {
                type: "number",
              },
            },
          },
        },
      });
    });

    it("The config() can register types and props for a specify component, and there will be a types field and a props field", () => {
      const transformer = new DescritporTransformer(getPropEnhance());

      // @ts-ignore
      transformer.config("ElInput", "disabled", ElSwitch);
      // @ts-ignore
      transformer.config("ElInput", DescriptorPropTypes.Number, ElInput, {
        type: "number",
      });

      expect(getMapping(transformer)).toEqual({
        ElInput: {
          types: {
            [DescriptorPropTypes.Number]: {
              component: ElInput,
              staticProps: {
                type: "number",
              },
            },
          },
          props: {
            disabled: {
              component: ElSwitch,
              staticProps: undefined,
            },
          },
        },
      });
    });
  });

  it("The configGlobal() used to register component for specify DescriptorPropTypes", () => {
    const transformer = new DescritporTransformer(getPropEnhance());

    // @ts-ignore
    transformer.configGlobal(DescriptorPropTypes.Boolean, ElSwitch);
    // @ts-ignore
    transformer.configGlobal(DescriptorPropTypes.Number, ElInput, {
      type: "number",
    });

    expect(getGlobalMapping(transformer)).toEqual({
      [DescriptorPropTypes.Boolean]: {
        component: ElSwitch,
        staticProps: undefined,
      },
      [DescriptorPropTypes.Number]: {
        component: ElInput,
        staticProps: {
          type: "number",
        },
      },
    });
  });

  it("The configRoot() just used to replace the value of root field", () => {
    const transformer = new DescritporTransformer(getPropEnhance());

    // @ts-ignore
    transformer.configRoot("span", {
      style: {
        color: "red",
      },
    });

    expect(transformer.root).toEqual({
      component: "span",
      staticProps: {
        style: {
          color: "red",
        },
      },
    });
  });

  it("transform()", () => {});
});
