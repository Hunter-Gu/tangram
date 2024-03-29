export enum DescriptorPropTypes {
  String = "String",
  Number = "Number",
  Boolean = "Boolean",
}

type DescriptorPropValueType<T extends DescriptorPropTypes> =
  T extends DescriptorPropTypes.String
    ? string
    : T extends DescriptorPropTypes.Number
    ? number
    : T extends DescriptorPropTypes.Boolean
    ? boolean
    : void;

type DescriptorPropTypeAndValue<T extends DescriptorPropTypes> = {
  type: T;

  defaultValue?: DescriptorPropValueType<T>;
};

type Union<T> = T extends DescriptorPropTypes
  ? DescriptorPropTypeAndValue<T>
  : null;

export type DescriptorPropName = {
  name: string;

  label?: string;
};

export type DescriptorProp = DescriptorPropName & Union<DescriptorPropTypes>;

export type PropsDescriptor = {
  name: string;

  props: DescriptorProp[];

  // TODO methods field definition

  // if true, the component can have children
  descendant?: boolean;
};
