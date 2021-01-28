import { getRef } from "../ref";
import { Events } from "../schema";
import { isUndefined, logger } from "../utils";

export function parseEvents(events: Events) {
  const eventHandlers: Record<string, Function> = {};

  for (let event in events) {
    // @ts-ignore
    // ['handler1', 'handler2']
    const handlers: string[] = [].concat(events[event]);

    // TODO think a bette way to handle it
    // TODO exec order: make this to be a function chain ( what about promise chain? )
    eventHandlers[event] = () => {
      // TODO make funcs
      handlers.forEach((handler: string) => {
        const [name, ...params] = handler.split(/\s+/);
        const func = ref2Fn(name);

        func(...params);
      });
    };
  }

  return eventHandlers;
}

function ref2Fn(str: string): Function {
  // get ref id and function name
  // `$` represnt reference
  const [, , refId, name] = /^(\$(\d+)?\.)?(.+)$/i.exec(str) || [];
  const instance = getRef(+refId).value;

  if (isUndefined(instance)) {
    return logger.bind(null, "Can not find ref", refId);
  } else if (!(name in instance)) {
    return logger.bind(null, `Can not find method [${name}] in ref ${refId}`);
  }

  const func = instance[name];

  if (typeof func === "function") {
    return func;
  } else {
    return logger.bind(`Ref ${refId} has no function named ${name}!`);
  }
}
