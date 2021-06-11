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
export type Slots = Record<string, Schema>;

/* eslint-disable no-use-before-define */
export type Child = Schema | string;

export type Schema = {
  name: string;

  __uuid: number;

  alias?: string;

  props?: Record<string, unknown>;

  attrs?: Attrs;

  events?: Events;

  slots?: Slots;

  children?: Child[];
};

export type ParsedSchema = Omit<Schema, "slots" | "events"> & {
  slots?: Child[];

  events?: ParsedEvents;
};
