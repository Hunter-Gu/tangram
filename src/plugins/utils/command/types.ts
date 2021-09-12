import { Operation } from "../../../pages/editor/block/types";

export type Diff<T extends unknown> = {
  // path after operation
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
