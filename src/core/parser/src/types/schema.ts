import { GetRef } from "./render";

export type Schema = {
  name: string;

  __uuid: number;

  alias?: string;

  props?: Record<string, unknown>;

  attrs?: Attrs;

  events?: Events;

  slots?: Slots;

  children?: Child[];
}

export type Props = Record<string, unknown>;

export type Attrs = Record<string, string>;

export type Handler = {
  ref: string;
  name: string;
  args?: string;
};

export type Events = Record<string, Array<Handler | Handler[]>>;

export type Slots = Record<string, Schema>;

export type Child = (Schema | string);

export type ParsedSchema = Omit<Schema, 'slots' | 'events'> & {
  slots?: Child[];

  events?: ParsedEvents;
};

export type ParsedEvents = Record<string, (getRef: GetRef) => any>;
