import { Component } from "@/core/parser/src/types/schema";
import { defineEmit, defineProps } from "@vue/runtime-core";
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
  component: TransformedComponent;

  staticProps?: Object;
};

/**
 * @description component which is used for transformer should implement this interface
 * @todo better type definition
 **/
const events = defineEmit(["input", "blur"]);
const props = defineProps({
  value: {},
});

export type TransformedComponent = typeof props & typeof events & Component;
