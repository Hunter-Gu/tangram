import { parse } from "..";
import { Schema } from "../types/schema";

export function handleChildren(schemas?: Schema[]) {
  return (schemas || []).map(schema => parse(schema));
}
