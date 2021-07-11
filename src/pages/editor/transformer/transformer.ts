import { Component, SchemaData } from "@/core/parser/src/types/schema";
import { render } from "../../../core/render/src/vue";
import { createLogger } from "../../../utils/logger";
import type { ComponentProp } from "../types/component";
import {
  Descriptor,
  DescriptorProp,
  DescriptorPropTypes,
} from "../types/descriptor";
import { GlobalTransformMapping, TransformMapping } from "../types/transform";
import { isDescritporPropType } from "../utils/utils";
import { IPropEnhance, PropEnhance } from "./prop-enhance";

const logger = createLogger("[DescritporTransformer]");

class DescritporTransformer {
  private _root: Component = "div";

  private mapping: TransformMapping = {};

  private globalMapping: GlobalTransformMapping = {};

  public get root() {
    return this._root;
  }

  private getTarget(name: Descriptor["name"], descriptorProp: DescriptorProp) {
    let component: Component | undefined;
    if (!(name in this.mapping)) {
      component = this.globalMapping[descriptorProp.type];
    } else {
      const currentMapping = this.mapping[name];
      component =
        currentMapping.props?.[descriptorProp.name] ||
        currentMapping.types?.[descriptorProp.type];
    }

    if (!component) {
      logger.error(
        `you have not config target component for descriptor: ${name}, prop: ${descriptorProp.name}, type: ${descriptorProp.type}`
      );
    }

    return component!;
  }

  constructor(private propEnhance: IPropEnhance) {}

  transform = (
    name: Descriptor["name"],
    descriptorProp: DescriptorProp
  ): Omit<SchemaData, "__uuid"> => {
    return {
      name: this.propEnhance.enhance(this.getTarget(name, descriptorProp)),
      // pass props value to functional component
      // which is created by `propEnhance.enhance()`
      props: {
        name: descriptorProp.name,
        label: descriptorProp.label,
      } as ComponentProp,
    };
  };

  /**
   * @description config the target component of specify prop, recognize by prop name or prop type or both union
   */
  config(
    descirptorName: Descriptor["name"],
    PropName: DescriptorProp["name"],
    component: Component
  ): this;
  config(
    descirptorName: Descriptor["name"],
    type: DescriptorPropTypes,
    component: Component
  ): this;
  config(
    descirptorName: Descriptor["name"],
    typeOrName: DescriptorPropTypes | DescriptorProp["name"],
    component: Component
  ): this {
    if (isDescritporPropType(typeOrName)) {
      this.mapping[descirptorName].types = {
        ...this.mapping[descirptorName].types!,
        [typeOrName]: component,
      };
    } else {
      this.mapping[descirptorName].props = {
        ...this.mapping[descirptorName].props!,
        [typeOrName]: component,
      };
    }

    return this;
  }

  configGlobal(type: DescriptorPropTypes, component: Component) {
    this.globalMapping[type] = component;
    return this;
  }

  configRoot(component: Component) {
    this._root = component;
    return this;
  }
}

const propEnhance = new PropEnhance(render);
export const transformer = new DescritporTransformer(propEnhance);
