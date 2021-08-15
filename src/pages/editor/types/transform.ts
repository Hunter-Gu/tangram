import { Component } from "@/core/parser/src/types/schema";
import { defineEmits, defineProps } from "@vue/runtime-core";
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

  staticProps?: Record<string, unknown>;
};

/**
 * @description component which is used for transformer should implement this interface
 * @todo better type definition
 **/
const events = defineEmits(["input", "blur"]);
const props = defineProps({
  value: {},
});

export type TransformedComponent = typeof props & typeof events & Component;
