import { GetRef } from "./render";

export type Props = Record<string, unknown>;

export type Attrs = Record<string, string>;

export type Handler = {
  ref: string;
  name: string;
  args?: string;
};

export type Events = Record<string, Array<Handler | Handler[]>>;

export type ParsedEvents = Record<string, (getRef: GetRef) => any>;

/* eslint-disable no-use-before-define */
export type Slots = Record<string, SchemaData>;

/* eslint-disable no-use-before-define */
export type Child = SchemaData | string;

export type Schema = {
  name: string;
  version: string;
  data: SchemaData;
  [key: string]: unknown;
};

export type SchemaData = {
  name: Component;

  __uuid: number;

  alias?: string;

  props?: Record<string, unknown>;

  attrs?: Attrs;

  events?: Events;

  slots?: Slots;

  children?: Child[];
};

export type ParsedSchema = Omit<SchemaData, "slots" | "events"> & {
  slots?: Child[];

  events?: ParsedEvents;
};

// TODO fix `any` type problem
export type Component = Schema["name"] | any | Object;
