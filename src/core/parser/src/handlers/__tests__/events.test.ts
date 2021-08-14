import { Events } from "../../types/schema";
import { Chain } from "../../utils/chain";
import { getOrder, traceExecuteOrder } from "../../utils/test-utils";
import { handleEvents } from "../events";

describe("Parser handler for `events` field", () => {
  it("It will make all methods of events parameters to be a partial function", () => {
    // TODO: maybe it's not a good way to test the return
    const chain = new Chain();
    const boundInvoke = chain.invoke.bind(null);
    const events: Events = {
      onclick: [
        {
          ref: 1,
          name: "restart",
        },
        {
          ref: 1,
          name: "hide",
        },
      ],
      onchange: [
        [
          {
            ref: 1,
            name: "shake",
          },
          {
            ref: 1,
            name: "move",
          },
        ],
      ],
    };

    const result = handleEvents(events);
    expect(result.onclick.name).toEqual(boundInvoke.name);
    expect(result.onchange.name).toEqual(boundInvoke.name);
  });

  it("The execution sequence of ['a', 'b', 'c'] style is 'a', 'b', 'c' when all are sync", () => {
    const a = () => {};
    const b = () => {};
    const c = () => {};
    const getRef = () => ({
      a: traceExecuteOrder(a),
      b: traceExecuteOrder(b),
      c: traceExecuteOrder(c),
    });
    const events = {
      onclick: [
        {
          ref: "a",
          name: "a",
        },
        {
          ref: "a",
          name: "b",
        },
        {
          ref: "a",
          name: "c",
        },
      ],
    };
    const parsedEvents = handleEvents(events);
    parsedEvents.onclick(getRef);
    expect(getOrder(a)).toBeLessThan(getOrder(b));
    expect(getOrder(b)).toBeLessThan(getOrder(c));
  });

  it("The execution sequence of [['a'], ['b'], ['c']] style is 'a', 'b', 'c' when all are async", async () => {
    const a = () =>
      new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    const b = () =>
      new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    const c = () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    const getRef = () => ({
      a: traceExecuteOrder(a),
      b: traceExecuteOrder(b),
      c: traceExecuteOrder(c),
    });
    const events = {
      onclick: [
        [
          {
            ref: "a",
            name: "a",
          },
        ],
        [
          {
            ref: "a",
            name: "b",
          },
        ],
        [
          {
            ref: "a",
            name: "c",
          },
        ],
      ],
    };
    const parsedEvents = handleEvents(events);
    await parsedEvents.onclick(getRef);
    expect(getOrder(a)).toBeLessThan(getOrder(b));
    expect(getOrder(b)).toBeLessThan(getOrder(c));
  });
});
