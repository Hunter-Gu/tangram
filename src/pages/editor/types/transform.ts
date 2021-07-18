import { Component } from "@/core/parser/src/types/schema";
import {
  PropsDescriptor,
  DescriptorProp,
  DescriptorPropTypes,
} from "./descriptor/props-descriptor";

export type GlobalTransformMapping = Partial<
  Record<DescriptorPropTypes, ComponentInfo>
>;

export type TransformMapping = Record<
  PropsDescriptor["name"],
  {
    props?: Record<DescriptorProp["name"], ComponentInfo>;

    types?: Record<DescriptorPropTypes, ComponentInfo>;
  }
>;

export type ComponentInfo = {
  component: Component;

  staticProps?: Object;
};
