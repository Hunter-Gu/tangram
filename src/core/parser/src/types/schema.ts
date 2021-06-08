import { DefineComponent, h, Ref, ref, VNode } from "vue";
import {
  parseAttrs,
  parseChildren,
  parseEvents,
  parseProps,
  parseSlots
} from "..";

export type Props = Record<string, unknown>;

export type Attrs = Record<string, string>;

export type Events = Record<string, string | string[]>;

export type Slots = Record<string, Schema>;

export interface Schema {
  name: DefineComponent | string;

  __uuid: number;

  props?: Props;
  attrs?: Attrs;
  events?: Events;

  slots?: Slots;

  children?: Schema[];
}

const id = (id: unknown) => id;

type SchemaParsers = Record<keyof Schema, Function>;

export const Parsers: SchemaParsers = {
  name: id,
  __uuid: id,
  props: parseProps,
  attrs: parseAttrs,
  events: parseEvents,
  slots: parseSlots,

  children: parseChildren,
};
