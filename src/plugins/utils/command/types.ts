import { DropType } from "../../../pages/editor/types/node-tree";
import { Operation } from "../../../pages/editor/block/types";

export type Diff<T extends unknown> = {
  // real path after operation
  // e.g: prop path, path after adding element
  path: string;

  value: T;
};

export type AddCommandStatData = {
  componentName: string;
  path: string;
  type: Operation;
};

export type RemoveCommandStatData = {
  path: string;
};

export type UpdateCommandStatData = {
  path: string;
  field: string;
  value: unknown;
};

export type UpdateCommandDiffValue<T = unknown> = {
  oldValue: T;
  newValue: T;
};

export type MoveCommandStatData = {
  from: string;
  to: string;
  type: DropType;
};

export type MoveCommandDiffValue = Omit<MoveCommandStatData, "type">;
