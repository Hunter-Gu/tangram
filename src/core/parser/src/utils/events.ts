import { GetRef } from "../types/render";
import { Events, ParsedEvents } from "../types/schema";

export function formatEvents(events: ParsedEvents | void, getRef: GetRef) {
  if (!events) {
    return;
  }

  Object.keys(events || {}).forEach((name) => {
    events[name as keyof Events] = events[name].bind(null, getRef);
  });

  return events;
}
