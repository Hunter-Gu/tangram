export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export enum Operation {
  None,
  Top,
  Right,
  Bottom,
  Left,
  Inside,
}

export type AddParams = {
  evt: DragEvent;
  path: string;
  type: Operation;
};

export type SelectParams = {
  name: string;
  path: string;
};
