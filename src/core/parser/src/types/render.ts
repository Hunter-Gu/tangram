type Component = any;
export type Node = any;

export type Render = (
  elm: string | Component,
  props?: Record<string, unknown>,
  children?: Node[] | void
) => Node;
