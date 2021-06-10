import { Data, Chainable } from "../types/chain";

export class Chain {

  private list: Partial<Chainable> = {};

  private pointer: Chainable = {
    next: {}
  };

  constructor() {
    this.list = this.pointer.next;
  }

  private format(ref: string, name: string, async = false): Data {
    return {
      name,
      ref,
      async
    };
  }

  public add(ref: string, name: string, async = false) {
    this.pointer.next.data = this.format(ref, name, async);
    this.pointer.next.next = {};
    this.pointer = this.pointer.next as Chainable;
  }

  public async invoke(getRef: (name: string) => any) {
    let node: Partial<Chainable> | undefined = this.list;
    let current: Data | void;

    while (current = node?.data) {
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
