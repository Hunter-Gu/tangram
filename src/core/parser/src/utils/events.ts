import { GetRef } from "../types/render";
import { Events, ParsedEvents } from "../types/schema";

export function formatEvents(events: ParsedEvents | void, getRef: GetRef) {
  if (!events) {
    return;
  }

  return Object.keys(events || {}).reduce((acc, name) => {
    return {
      ...acc,
      [name]: events[name].bind(null, getRef),
    };
  }, {} as Record<keyof Events, Function>);
}
