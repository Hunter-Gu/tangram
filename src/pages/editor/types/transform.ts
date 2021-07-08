import { Component } from "@/core/parser/src/types/schema";
import { Descriptor, DescriptorProp, DescriptorPropTypes } from "./descriptor";

export type GlobalTransformMapping = Partial<
  Record<DescriptorPropTypes, Component>
>;

export type TransformMapping = Record<
  Descriptor["name"],
  {
    props?: Record<DescriptorProp["name"], Component>;

    types?: Record<DescriptorPropTypes, Component>;
  }
>;
