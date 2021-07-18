import { RenderDescriptor } from "./descriptor";

type RegisterName = string | string[];

type RegisterHandler<T extends RegisterName> = (name: T) => RenderDescriptor;

type RegistryItem = {
  key: string;
  data: RenderDescriptor;
};

export { RegisterName, RegisterHandler, RegistryItem };
