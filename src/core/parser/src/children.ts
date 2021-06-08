import render from "./render";
import { Schema } from "./types/schema";

export function parseChildren(schemas: Schema[]) {
  return schemas.map((child) => render(child));
}
