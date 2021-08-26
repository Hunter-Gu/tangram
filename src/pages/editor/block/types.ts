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
