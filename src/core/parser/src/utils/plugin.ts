import { HandlerDesc, Handler } from "../types/plugin";
import { isUndefined } from "./utils";

export class Plugin<O, P> {
  private handlers: HandlerDesc<O>[] = [];

  /* eslint-disable no-dupe-class-members */
  public register<T extends keyof O, F extends Handler<O[T]>>(
    key: T,
    handler: F
  ): this;

  public register<F extends Handler<O>>(handler: F): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public register(key: any, handler?: any): this {
    if (typeof key === "string") {
      this.handlers.push(this.format(handler, key as keyof O));
    } else {
      this.handlers.push(this.format(key));
    }
    return this;
  }

  public invoke(arg: O): P {
    return this.handlers.reduce((acc: O, desc) => {
      const handler = desc.handler;
      // handle specify option
      if ("key" in desc) {
        const key = desc.key;
        if (!key) {
          return { ...acc };
        }
        const value = handler(acc[key]);

        return {
          ...acc,
          [key]: value,
        };
      } else {
        // handle total object
        return {
          // @ts-ignore
          ...handler(acc),
        };
      }
    }, arg) as unknown as P;
  }

  private format(
    handler: HandlerDesc<O>["handler"],
    key?: HandlerDesc<O>["key"]
  ): HandlerDesc<O> {
    return isUndefined(key) ? { handler } : { key, handler };
  }
}
