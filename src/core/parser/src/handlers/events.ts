import { Events, Handler, ParsedEvents } from "../types/schema";
import { Chain } from "../utils/chain";

// TODO better type defintion
// current return value's key type is not infered
export function handleEvents(events: Events) {
  return Object.keys(events || {}).reduce((acc: any, key: string) => {
    const handlers = events[key as keyof Events];
    const chain = new Chain();

    const add = (handler: Handler | Handler[]) => {
      if (Array.isArray(handler)) {
        handler.length > 1
          ? handler.forEach(add)
          : chain.add(handler[0].ref, handler[0].name, true);
      } else {
        chain.add(handler.ref, handler.name);
      }
    };

    handlers.forEach((handler) => {
      add(handler);
    });

    return {
      ...acc,
      [key]: chain.invoke.bind(chain),
    };
  }, {});
}
