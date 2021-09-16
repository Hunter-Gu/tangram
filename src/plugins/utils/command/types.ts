import { DropType } from "../../../pages/editor/types/node-tree";
import { Operation } from "../../../pages/editor/block/types";
import { Component, SchemaData } from "@/core/parser/src/types/schema";

export interface Command<P, R> {
  // check if current command can be replaced by other command(parameter of method canReplaceBy())
  canReplaceBy?: (command?: Command<P, R>) => boolean;
  do: (params: P) => R;
  undo: (params: P) => R;
}

export type Diff<T extends unknown> = {
  // real changed path after operation
  // e.g: prop path, path after adding element
  path: string;

  value: T;
};

export type OperationResult = {
  schema: SchemaData;
  currentPath: string;
};

export type AddCommandStatData = {
  componentOrTagName: Component;
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
