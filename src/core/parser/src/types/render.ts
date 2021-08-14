import { Child, ParsedSchema, SchemaData } from "./schema";

type Component = any;
export type Node = any;

export type RenderNode = (
  id: string | number,
  elm: string | Component,
  props?: Record<string, unknown>,
  children?: Node[] | void
) => Node;

export type ChildNode = ParsedSchema | SchemaData;

export type GetRef = (key: string | number) => object;

export type RenderAndInitRef = (
  node: ChildNode,
  children: ParsedSchema["children"]
) => ReturnType<RenderNode>;
