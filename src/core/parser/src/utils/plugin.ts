import { HandlerDesc, Handler } from '../types/plugin'
import { isUndefined } from './utils';

export class Plugin<O, P> {
  private handlers: HandlerDesc<O>[] = [];

  public register<T extends keyof O, F extends Handler<O[T]>>(key: T, handler: F): this;
  public register<F extends Handler<O>>(handler: F): this ;
  public register(key: any, handler?: any): this {
    if (typeof key === 'string') {
      this.handlers.push(
        this.format(handler, key as keyof O)
      );
    } else {
      this.handlers.push(
        this.format(key)
      );
    }
    return this;
  }

  public invoke(arg: O): P {
    return this.handlers.reduce((acc: O, desc) => {
      const handler = desc.handler
      // handle specify option
      if ('key' in desc) {
        const key: keyof O = desc.key!;
        const value = handler(acc[key]);

        return {
          ...acc,
          [key]: value
        };
      } else { // handle total object
        return {
          ...handler(acc)
        };
      }
    }, arg) as unknown as P;
  }

  private format(handler: HandlerDesc<O>['handler'], key?: HandlerDesc<O>['key']): HandlerDesc<O> {
    return isUndefined(key)
    ? { handler }
    : { key, handler };
  }

}
