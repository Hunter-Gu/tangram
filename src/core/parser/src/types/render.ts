import { ParsedSchema, SchemaData } from "./schema";

type Component = unknown;
export type Node = unknown;

export type RenderNode = (
  id: string | number,
  elm: string | Component,
  props?: Record<string, unknown>,
  children?: Node[] | void
) => Node;

export type ChildNode = ParsedSchema | SchemaData;

export type GetRef = (key: string | number) => Record<string, unknown>;

export type RenderAndInitRef = (
  node: ChildNode,
  children: ParsedSchema["children"]
) => ReturnType<RenderNode>;
