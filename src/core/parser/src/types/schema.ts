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

export type Handler = string | string[];

export type Events = Record<string, Array<string>>;

export type Slots = Record<string, Schema>;

export type Child = (Schema | string);

export type ParsedSchema = Omit<Schema, 'slots'> & {
  slots?: Child[];
}
