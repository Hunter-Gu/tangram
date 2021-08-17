import { SchemaData } from "../../../core/parser/src/types/schema";
import { isUndefined } from "../../../core/parser/src/utils/utils";
import { render } from "../../../core/render/src/vue";
import { createLogger } from "../../../utils/logger";
import type { ComponentProp } from "../types/component";
import {
  PropsDescriptor,
  DescriptorProp,
  DescriptorPropTypes,
} from "../types/descriptor/props-descriptor";
import {
  TransformedComponent,
  ComponentInfo,
  GlobalTransformMapping,
  TransformMapping,
} from "../types/transform";
import { isDescritporPropType } from "../utils/utils";
import { IPropEnhance, PropEnhance } from "./prop-enhance";

const logger = createLogger("[DescritporTransformer]");

// TODO: refactor this class because the type definitions are confused
export class DescritporTransformer {
  // TODO: fix type
  // @ts-ignore
  private _root: ComponentInfo = { component: "div" };

  private mapping: TransformMapping = {};

  private globalMapping: GlobalTransformMapping = {};

  public get root() {
    return this._root;
  }

  private getTarget(
    name: PropsDescriptor["name"],
    descriptorProp: DescriptorProp
  ): ComponentInfo | never {
    let componentInfo: ComponentInfo | undefined;
    if (!(name in this.mapping)) {
      componentInfo = this.globalMapping[descriptorProp.type];
    } else {
      const currentMapping = this.mapping[name];
      componentInfo =
        currentMapping.props?.[descriptorProp.name] ||
        currentMapping.types?.[descriptorProp.type];
    }

    if (isUndefined(componentInfo)) {
      logger.error(
        `you have not config target component for descriptor: ${name}, prop: ${descriptorProp.name}, type: ${descriptorProp.type}`
      );
      throw new Error("getTarget() of DescritporTransformer");
    }

    return componentInfo;
  }

  constructor(private propEnhance: IPropEnhance) {}

  transform = (
    name: PropsDescriptor["name"],
    descriptorProp: DescriptorProp
  ): Omit<SchemaData, "__uuid"> => {
    return {
      // TODO fix
      // @ts-ignore
      name: this.propEnhance.enhance(this.getTarget(name, descriptorProp)),
      // pass props value to functional component
      // which is created by `propEnhance.enhance()`
      props: {
        name: descriptorProp.name,
        label: descriptorProp.label,
        defaultValue: descriptorProp.defaultValue,
      } as ComponentProp,
    };
  };

  /**
   * @description config the target component of specify prop, recognize by prop name or prop type or both union
   */
  config(
    descirptorName: PropsDescriptor["name"],
    PropName: DescriptorProp["name"],
    component: TransformedComponent,
    staticProps?: ComponentInfo["staticProps"]
  ): this;

  config(
    descirptorName: PropsDescriptor["name"],
    type: DescriptorPropTypes,
    component: TransformedComponent,
    staticProps?: ComponentInfo["staticProps"]
  ): this;

  config(
    descirptorName: PropsDescriptor["name"],
    typeOrName: DescriptorPropTypes | DescriptorProp["name"],
    component: TransformedComponent,
    staticProps?: ComponentInfo["staticProps"]
  ): this {
    this.mapping[descirptorName] = {
      ...this.mapping[descirptorName],
    };

    if (isDescritporPropType(typeOrName)) {
      const before = this.mapping[descirptorName].types;
      // @ts-ignore
      this.mapping[descirptorName].types = {
        ...before,
        [typeOrName]: {
          component,
          staticProps,
        },
      };
    } else {
      const before = this.mapping[descirptorName].props;
      this.mapping[descirptorName].props = {
        ...before,
        [typeOrName]: {
          component,
          staticProps,
        },
      };
    }

    return this;
  }

  configGlobal(
    type: DescriptorPropTypes,
    component: TransformedComponent,
    staticProps?: ComponentInfo["staticProps"]
  ) {
    this.globalMapping[type] = { component, staticProps };
    return this;
  }

  configRoot(
    component: TransformedComponent,
    staticProps?: ComponentInfo["staticProps"]
  ) {
    this._root = { component, staticProps };
    return this;
  }
}

const propEnhance = new PropEnhance(render);
// @ts-ignore
export const transformer = new DescritporTransformer(propEnhance);
