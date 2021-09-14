import { SchemaData } from "../../../core/parser/src/types/schema";
import { Command, Diff, OperationResult } from "./types";

export abstract class BaseCommand<T = unknown>
  implements Command<SchemaData, OperationResult>
{
  /**
   * !!do() and undo() should get infos from diff!!
   */
  protected diff: Diff<T> = {
    path: "",
    value: null as unknown as T,
  };

  /**
   * !!should be no side-effect!!
   */
  abstract calcDiff(schema: SchemaData): void;

  abstract do(schema: SchemaData): OperationResult;

  abstract undo(schema: SchemaData): OperationResult;
}
