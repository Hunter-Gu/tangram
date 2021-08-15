import { createLogger } from "../../../../utils/logger";
import { ref, ToRefs } from "@vue/reactivity";

const logger = createLogger("[Ref]");

export class Ref {
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private store: Record<string | number, ToRefs<Record<string, any>>> = {};

  init(key: string | number) {
    const instance = ref(null);
    this.store[key] = instance;

    return instance;
  }

  get(key: string | number) {
    if (key in this.store) {
      return this.store[key].value;
    } else {
      logger.warn(`Ref [${key}] is not found!`);
    }
  }
}
