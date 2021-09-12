import { SchemaData } from "../../../core/parser/src/types/schema";
import { Diff } from "./types";

export abstract class BaseCommand<T = unknown> {
  protected diff: Diff<T> = {
    path: "",
    value: null as unknown as T,
  };

  /**
   * !!should be no side-effect!!
   */
  abstract calcDiff(schema: SchemaData): void;

  abstract do(schema: SchemaData): SchemaData;

  abstract undo(schema: SchemaData): SchemaData;
}
