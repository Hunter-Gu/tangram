import { HotZone } from "../hot-zone";
import { Operation } from "../types";

describe("HotZone", () => {
  it("The calc() will return the correct Operation of current position", () => {
    const hotZone = new HotZone(
      {
        x: 0,
        y: 0,
      },
      {
        width: 100,
        height: 100,
      }
    );

    expect(hotZone.calc({ x: 50, y: 2 })).toBe(Operation.Top);
    expect(hotZone.calc({ x: 98, y: 2 })).toBe(Operation.Right);
    expect(hotZone.calc({ x: 50, y: 98 })).toBe(Operation.Bottom);
    expect(hotZone.calc({ x: 2, y: 2 })).toBe(Operation.Left);
  });

  it("The update() will update the private position and size property", () => {
    const hotZone = new HotZone(
      {
        x: 0,
        y: 0,
      },
      {
        width: 100,
        height: 100,
      }
    );
    hotZone.update({ x: 100, y: 100 }, { width: 0, height: 0 });

    // @ts-ignore
    expect(hotZone.position).toEqual({ x: 100, y: 100 });
    // @ts-ignore
    expect(hotZone.size).toEqual({ width: 0, height: 0 });
  });
});
