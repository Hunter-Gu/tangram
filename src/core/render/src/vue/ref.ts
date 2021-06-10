import { ref, ToRefs } from "@vue/reactivity";

export class Ref {
  private store: Record<string | number, ToRefs<any>> = {};

  init(key: string | number) {
    const instance = ref(null);
    this.store[key] = instance;

    return instance;
  }

  get(key: string | number) {
    if (key in this.store) {
      return this.store[key].value;
    } else {
      console.warn(`Ref [${key}] is not found!`);
    }
  }
}

export const refs = new Ref();
