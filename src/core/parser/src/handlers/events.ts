import { Events, Handler } from "../types/schema";
import { Chain } from "../utils/chain";

export function handleEvents(events: Events) {
  return Object.keys(events || {}).reduce((acc: any, key: string) => {
    const handlers = events[key as keyof Events];
    const chain = new Chain();

    handlers.forEach((handler) => {
      const add = (handler: Handler | Handler[]) => {
        if (Array.isArray(handler)) {
          handler.length > 1
            ? add(handler)
            : chain.add(handler[0].ref, handler[0].name, true);
        } else {
          chain.add(handler.ref, handler.name);
        }
      };

      add(handler);
    });

    return {
      ...acc,
      [key]: chain.invoke.bind(chain),
    };
  }, {});
}
