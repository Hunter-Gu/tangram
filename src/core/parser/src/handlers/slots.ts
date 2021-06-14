import { parse } from "..";
import { SchemaData } from "../types/schema";

export function handleSlots(slots?: Record<string, SchemaData>) {
  if (slots) {
    return Object.values(slots).map((slot) => parse(slot));
  }
}
