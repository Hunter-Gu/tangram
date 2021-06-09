import { ParsedSchema, Schema } from "../types/schema";
import { Plugin } from "../utils/plugin";
import { id } from "../utils/id";
import { handleChildren } from "./children";
import { handleSlots } from "./slots";

export const handler = new Plugin<Schema, ParsedSchema>();

handler.register('name', id)
    .register('__uuid', id)
    .register('alias', id)
    .register('attrs', id)
    .register('props', id)
    .register('events', id)
    .register('slots', handleSlots)
    .register('children', handleChildren);
