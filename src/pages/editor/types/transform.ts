import { Component } from "@/core/parser/src/types/schema";
import { Descriptor, DescriptorProp, DescriptorPropTypes } from "./descriptor";

export type GlobalTransformMapping = Partial<
  Record<DescriptorPropTypes, ComponentInfo>
>;

export type TransformMapping = Record<
  Descriptor["name"],
  {
    props?: Record<DescriptorProp["name"], ComponentInfo>;

    types?: Record<DescriptorPropTypes, ComponentInfo>;
  }
>;

export type ComponentInfo = {
  component: Component;

  staticProps?: Object;
};
