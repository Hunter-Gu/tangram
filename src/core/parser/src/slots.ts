import render, { Render } from "../render";
import { Slots } from "../schema";

type Slot = () => ReturnType<Render>;

export function parseSlots(slots: Slots) {
  return Object.keys(slots).reduce((slotFns, slotName) => {
    return {
      ...slotFns,
      [slotName]: () => render(slots[slotName]),
    };
  }, {} as Record<string, Slot>);
}
