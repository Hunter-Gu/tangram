import { ParsedSchema, SchemaData } from "../types/schema";
import { Plugin } from "../utils/plugin";
import { id } from "../utils/id";
import { handleChildren } from "./children";
import { handleSlots } from "./slots";
import { handleEvents } from "./events";

export const handler = new Plugin<SchemaData, ParsedSchema>();

handler
  .register("name", id)
  .register("__uuid", id)
  .register("alias", id)
  .register("attrs", id)
  .register("props", id)
  .register("events", handleEvents)
  .register("slots", handleSlots)
  .register("children", handleChildren);
