import { DefineComponent, h, Ref, ref, VNode } from 'vue'

type Events = Record<string, string | string[]>;

export interface Schema {
  name: DefineComponent | string;

  props?: Record<string, any>;
  attrs?: Record<string, string>;
  events?: Events;

  slots?: {
    [name: string]: Schema;
  },
  children?: Schema[]
}

/**
 * @desc generate vnode tree from json schema
 * @param schema
 */
export default function render (schema: Schema): VNode {
  // render for text children
  if (typeof schema !== 'object') {
    return schema;
  }

  // render children recursively
  let childrenOrSlots = (schema.children || []).map(child => {
    return render(child)
  });

  // render slots recursively
  if (schema.slots) {
    childrenOrSlots = Object.keys(schema.slots || {}).reduce((o, k) => {
      o[k] = () => render(schema.slots![k])
      return o
    }, {} as any);
  }

  const idRef = ref(null)

  const others = {
    ref: idRef,
    ...get(schema, 'props', {}),
    ...get(schema, 'attrs', {}),
    ...parseEvents(get(schema, 'events', {}), idRef),
  }

  return h(schema.name, others, childrenOrSlots);
}

function get<T extends object>(object: T, key: keyof T, defaultValue: any) {
  return key in object ? object[key] : defaultValue;
}

function parseEvents(events: Events, ref: Ref<any>) {
  const eventHandlers: Record<string, Function> = {};

  for (let event in events) {
    // @ts-ignore
    const handlers: string[] = [].concat(events[event]);

    // TODO think a bette way to handle it
    // TODO exec order: make this to be a function chain ( what about promise chain? )
    // TODO it can only call itself functions now, support call other refs' functions
    // TODO support pass parameters by schema
    eventHandlers[event] = () => {
      const instance = ref.value

      // TODO make funcs
      handlers.map((handler: string) => {
        // TODO better type infer
        // @ts-ignore
        const func = instance[handler];

        if (typeof func === 'function') {
          return func()
        } else {
          logger(`${handler} is not a funciton!`)
        }
      })
    }
  }

  return eventHandlers
}

function logger(...msg: any) {
  console.log(...msg)
}
