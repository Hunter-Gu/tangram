import { formatEvents } from "../events";

describe("Parser util function `formatEvents()`", () => {
  it("It will make all methods of events parameters to be a partial function by getRef", () => {
    const getRef = () => ({});
    const clickHandler = () => {};
    const partialClickHandler = clickHandler.bind(null, getRef);

    const moveHandler = () => {};
    const partialMoveHandler = clickHandler.bind(null, getRef);
    const testHandler = () => {};
    const partialTestHandler = clickHandler.bind(null, getRef);

    const events = {
      click: clickHandler,
      move: moveHandler,
      test: testHandler,
    };

    expect(formatEvents(events, getRef)?.click.toString()).toEqual(
      partialClickHandler.toString()
    );

    expect(formatEvents(events, getRef)?.move.toString()).toEqual(
      partialMoveHandler.toString()
    );

    expect(formatEvents(events, getRef)?.test.toString()).toEqual(
      partialTestHandler.toString()
    );
  });
});
