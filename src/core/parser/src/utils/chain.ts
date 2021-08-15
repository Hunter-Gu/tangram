import { Data, Chainable } from "../types/chain";

export class Chain {
  private list: Partial<Chainable> = {};

  private pointer: Chainable = {
    next: {},
  };

  constructor() {
    this.list = this.pointer.next;
  }

  private format(ref: Data["ref"], name: Data["name"], async = false): Data {
    return {
      name,
      ref,
      async,
    };
  }

  public add(ref: Data["ref"], name: Data["name"], async = false) {
    this.pointer.next.data = this.format(ref, name, async);
    this.pointer.next.next = {};
    this.pointer = this.pointer.next as Chainable;
  }

  public async invoke(
    getRef: (name: Data["name"]) => Record<string, () => unknown>
  ) {
    let node: Partial<Chainable> | undefined = this.list;
    let current: Data | void;

    /* eslint-disable no-cond-assign */
    while ((current = node?.data)) {
      const { name, async, ref } = current;
      const instance = getRef(ref);
      const func = instance[name].bind(instance);
      if (async) {
        await func();
      } else {
        func();
      }
      node = node.next;
    }
  }
}
