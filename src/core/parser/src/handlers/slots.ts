import { parse } from "..";
import { Schema } from "../types/schema";

export function handleSlots(slots?: Record<string, Schema>) {
  if (slots) {
    return Object.values(slots).map((slot) => parse(slot));
  }
}
