import { createLogger } from "../../../utils/logger";
import { RenderDescriptor } from "../types/descriptor";
import { RegisterHandler, RegisterName, RegistryItem } from "../types/registry";

const logger = createLogger("Registry");

class Registry {
  private readonly container: RegistryItem[] = [];

  register<T extends RegisterName>(
    names: T,
    descriptorGen: RegisterHandler<T>
  ): this;
  register(name: RegisterName, descriptor: RenderDescriptor): this;
  register<T extends RegisterName>(
    name: T,
    descriptorOrGen: RenderDescriptor | RegisterHandler<T>
  ) {
    const names = typeof name === "string" ? [name] : (name as string[]);
    const descriptor: RenderDescriptor =
      typeof descriptorOrGen === "function"
        ? descriptorOrGen(name)
        : descriptorOrGen;

    names.forEach((name) => {
      this.container.push({
        key: name,
        data: descriptor,
      });
    });

    return this;
  }

  getPropsDescriptor(name: string) {
    const descriptor = this.container.find((item) => item.key === name);
    if (descriptor) {
      return descriptor;
    } else {
      logger.error(
        `get props descriptor for unknow component [${name}], please register first`
      );
    }
  }

  getAll() {
    return this.container;
  }
}

const registry = new Registry();

export { registry };
