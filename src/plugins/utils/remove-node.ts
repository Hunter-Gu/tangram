import { get } from "../../core/parser/src/utils/utils";
import { SchemaData, Child } from "../../core/parser/src/types/schema";
import { getParentPathAndIndex } from "./move";

export class RemoveNode {
  private path = "";

  private schema: SchemaData | undefined;

  update(schema: SchemaData | undefined, path: string) {
    this.path = path;
    this.schema = schema;
  }

  constructor() {
    this.init();
  }

  private init() {
    document.addEventListener("keyup", this.handleRemove);
  }

  private handleRemove = (event: KeyboardEvent) => {
    if (!this.path || !this.schema) {
      return;
    }

    if (event.key === "Backspace") {
      remove(this.schema, this.path);
    }
  };

  dispose() {
    document.removeEventListener("keyup", this.handleRemove);
  }
}

// need to refactor
export const removeNode = new RemoveNode();

export function remove(schema: SchemaData, path: string) {
  const { parentPath, index } = getParentPathAndIndex(path);
  const arr = get(schema, parentPath) as Child[];

  arr.splice(index, 1);
}
