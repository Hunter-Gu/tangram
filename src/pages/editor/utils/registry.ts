import { createLogger } from "../../../utils/logger";
import { RenderDescriptor } from "../types/descriptor";
import { RegisterHandler, RegisterName, RegistryItem } from "../types/registry";

const logger = createLogger("Registry");

/**
 * register component and it's render descritpor
 */
export class Registry {
  private readonly container: RegistryItem[] = [];

  register(names: RegisterName, descriptorGen: RegisterHandler): this;

  register(name: RegisterName, descriptor: RenderDescriptor): this;

  register(
    name: RegisterName,
    descriptorOrGen: RenderDescriptor | RegisterHandler
  ) {
    const names = typeof name === "string" ? [name] : (name as string[]);

    if (typeof descriptorOrGen === "function") {
      names.forEach((name) => {
        const descriptor = descriptorOrGen(name);

        this.combineDefaultValueForProps(descriptor);

        this.container.push({
          key: name,
          data: descriptor,
        });
      });
    } else {
      const descriptor: RenderDescriptor = descriptorOrGen;

      this.combineDefaultValueForProps(descriptor);

      names.forEach((name) => {
        this.container.push({
          key: name,
          data: descriptor,
        });
      });
    }

    return this;
  }

  private combineDefaultValueForProps(renderDescriptor: RenderDescriptor) {
    const { props } = renderDescriptor;
    const descriptorProps = renderDescriptor.descriptor.props;
    Object.keys(props || {}).forEach((prop) => {
      const descriptorProp = descriptorProps.find((item) => item.name === prop);

      // current prop don't provide defaultValue
      // then use render descriptor value as defautlValue
      if (descriptorProp && !("defaultValue" in descriptorProp)) {
        // @ts-ignore-next-line
        descriptorProp.defaultValue = props[prop];
      }
    });
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

export const registry = new Registry();
