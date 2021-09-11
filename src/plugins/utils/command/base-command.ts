import { SchemaData } from "../../../core/parser/src/types/schema";
import { Diff } from "./types";

export abstract class BaseCommand {
  private diff: Diff = { path: "", value: null };

  abstract do(schema: SchemaData): void;

  abstract undo(schema: SchemaData): void;
}
