import { getRef } from "../ref";
import { Events } from "../schema";
import { typeFlag } from "../type-flag";
import { isUndefined, logger } from "../utils";

const REF_REG = /^\$[a-z0-9]+\.[^\s]+/i;

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
        const name = REF_REG.exec(handler);

        if (!name) {
          throw new Error(
            `[Format Error]: handler format error because of missing ref! ${name}`
          );
        }

        const paramStr = handler.replace(REF_REG, "").trim();
        const func = ref2Fn(name[0]);
        const funcParams = typeFlag(paramStr);

        func(...funcParams);
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
