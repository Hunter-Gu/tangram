import { DefineComponent, h, VNode } from 'vue'

export interface Schema {
  name: DefineComponent | string,
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

  return h(schema.name, {}, childrenOrSlots);
}
