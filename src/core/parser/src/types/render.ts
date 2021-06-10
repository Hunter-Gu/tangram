type Component = any;
export type Node = any;

export type Render = (
  id: string | number,
  elm: string | Component,
  props?: Record<string, unknown>,
  children?: Node[] | void
) => Node;

export type GetRef = (key: string | number) => object;
