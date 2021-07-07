export enum DescriptorPropTypes {
  String = "string",
  Number = "number",
  Boolean = "boolean",
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

export type DescriptorProp = {
  name: string;
} & Union<DescriptorPropTypes>;

export type Descriptor = {
  name: string;

  props: DescriptorProp[];

  // TODO methods field definition
};
