import {
  ElButton,
  getDescriptor as getElButtonDescriptor,
} from "../../editor/registery/resources/el-button";
import {
  ElInput,
  getDescriptor as getElInputDescriptor,
} from "../../editor/registery/resources/el-input";
import { Registry } from "../registry";

describe("Editor util class Registry", () => {
  it("The `register()` is used to store the name and descriptor in a same object", () => {
    const registry = new Registry();
    const components = {
      [ElInput]: {},
      [ElButton]: {},
    };
    const elInputDescriptor = getElInputDescriptor(components);
    const elButtonDescriptor = getElButtonDescriptor(components);

    registry
      .register(ElInput, elInputDescriptor)
      .register(ElButton, elButtonDescriptor);

    expect(registry.getAll()).toEqual([
      {
        key: ElInput,
        data: elInputDescriptor,
      },
      {
        key: ElButton,
        data: elButtonDescriptor,
      },
    ]);
  });

  it("The `register()` support to register a same descriptor for different names", () => {
    const registry = new Registry();
    const components = {
      [ElInput]: {},
      ElText: {},
    };
    const elInputDescriptor = getElInputDescriptor(components);

    registry.register([ElInput, "ElText"], elInputDescriptor);

    expect(registry.getAll()).toEqual([
      {
        key: ElInput,
        data: elInputDescriptor,
      },
      {
        key: "ElText",
        data: elInputDescriptor,
      },
    ]);
  });

  it("The `registry()` support to register a descriptor factory by a single name", () => {
    const registry = new Registry();
    const components = {
      [ElInput]: {},
    };
    const elInputDescriptor = getElInputDescriptor(components);

    registry.register(ElInput, (name: string) => {
      const res = {
        [ElInput]: elInputDescriptor,
      };
      return res[name as typeof ElInput];
    });

    expect(registry.getAll()).toEqual([
      {
        key: ElInput,
        data: elInputDescriptor,
      },
    ]);
  });

  it("The `registry()` support to register a descriptor factory by many name, that provide flexible for reuse descritpor", () => {
    const registry = new Registry();
    const components = {
      [ElInput]: {},
      [ElButton]: {},
    };
    const elInputDescriptor = getElInputDescriptor(components);
    const elButtonDescriptor = getElButtonDescriptor(components);

    registry.register([ElInput, ElButton], (name: string) => {
      const res = {
        [ElInput]: elInputDescriptor,
        [ElButton]: elButtonDescriptor,
      };
      return res[name as typeof ElInput | typeof ElButton];
    });

    expect(registry.getAll()).toEqual([
      {
        key: ElInput,
        data: elInputDescriptor,
      },
      {
        key: ElButton,
        data: elButtonDescriptor,
      },
    ]);
  });
});
