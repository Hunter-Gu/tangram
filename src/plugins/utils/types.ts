import {
  SchemaData,
  Child,
  Component,
} from "../../core/parser/src/types/schema";
import { Operation } from "../../pages/editor/block/types";

export type RequiredField<
  T extends Record<string, unknown>,
  K extends keyof T
> = Required<Pick<T, K>> & Omit<T, K>;

export type AddNodeParams = {
  component: Component;
  target: RequiredField<SchemaData, "children">;
  type: Operation;
  path: string;
  parentPath: string;
  ancestors: Child[];
  index: number;
};

export type Node<T> = {
  array: T[];
  index: number;
};
