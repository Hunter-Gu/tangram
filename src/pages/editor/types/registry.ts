import { RenderDescriptor } from "./descriptor";

type RegisterName = string | string[];

type RegisterHandler = (name: string) => RenderDescriptor;

type RegistryItem = {
  key: string;
  data: RenderDescriptor;
};

export { RegisterName, RegisterHandler, RegistryItem };
