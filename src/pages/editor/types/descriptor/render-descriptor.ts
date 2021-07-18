import { Component, ExtractPropTypes } from "@vue/runtime-core";
import { PropsDescriptor } from "./props-descriptor";

export type RenderDescriptor<T = Component> = {
  component: T;

  descriptor: PropsDescriptor;

  props?: ExtractPropTypes<T>;

  renderView?: Component;
};
