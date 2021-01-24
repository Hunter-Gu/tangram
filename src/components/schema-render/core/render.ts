import { DefineComponent, h, Ref, ref, VNode } from 'vue'

type Events = Record<string, string | string[]>;

export interface Schema {
  name: DefineComponent | string;

  __uuid: number;

  props?: Record<string, any>;
  attrs?: Record<string, string>;
  events?: Events;

  slots?: {
    [name: string]: Schema;
  },
  children?: Schema[]
}

// store all refs
const refs: Record<number, Ref<any>> = {};
function setRef(name: number, ref: Ref<any>) {
  refs[name] = ref;
}
function getRef(name: number) {
  return refs[name];
}
function checkUnique(name: number) {
  return !(name in refs);
}
function initRef(schema: Schema) {
  const idRef = ref(null)
  const { __uuid: name } = schema;
  if (checkUnique(name)) {
    setRef(name, idRef);
  } else {
    // TODO it will rerender all when state change trigger reactive
    // console.error('Conflict uuid:', name);
  }
  return idRef;
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

  const idRef = initRef(schema);

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
    // ['handler1', 'handler2']
    const handlers: string[] = [].concat(events[event]);

    // TODO think a bette way to handle it
    // TODO exec order: make this to be a function chain ( what about promise chain? )
    eventHandlers[event] = () => {
      // TODO make funcs
      handlers.map((handler: string) => {
        // TODO better type infer
        // @ts-ignore
        const [name, ...params] = handler.split(/\s+/)
        const func = parseRef2Func(name, ref);

        if (typeof func === 'function') {
          return func(...params)
        } else {
          logger(`${handler} is not a funciton!`)
        }
      })
    }
  }

  return eventHandlers
}

function parseRef2Func(str: string, defaultRef: Ref<any>) {
  // get ref id and function name
  // `$` represnt reference
  const [, , refId, name] = /^(\$(\d+)?\.)?(.+)$/i.exec(str) || [];

  return (refId ? getRef(+refId) : defaultRef).value[name];
}

function logger(...msg: any) {
  console.log(...msg)
}
