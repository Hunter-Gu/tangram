import { handler } from "./handlers";
import { Schema } from "./types/schema";

export function parse(schema: Schema) {
  return handler.invoke(schema);
}
