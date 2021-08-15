import { Plugin } from "../plugin";

function getHandlers(
  plugin: Plugin<Record<string, unknown>, Record<string, unknown>>
) {
  // @ts-ignore
  return plugin.handlers;
}

describe("Parser util class Plugin", () => {
  it("The `register()` will push the info into `handlers`", () => {
    const target = [
      {
        key: "a",
        handler: () => console.log("a"),
      },
      {
        key: "b",
        handler: () => console.log("b"),
      },
      {
        handler: () => console.log("c"),
      },
    ];
    const plugin = new Plugin<
      Record<string, unknown>,
      Record<string, unknown>
    >();

    plugin
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .register(target[0].key!, target[0].handler)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .register(target[1].key!, target[1].handler)
      .register(target[2].handler);

    expect(getHandlers(plugin)).toEqual(target);
  });

  describe("The `invoke()` will return a object combined by return value of handler", () => {
    it("The return value of specify handler will be set to the specified key", () => {
      const target = [
        {
          key: "a",
          handler: () => "a",
        },
        {
          key: "b",
          handler: () => "b",
        },
      ];
      const plugin = new Plugin<
        Record<string, unknown>,
        Record<string, unknown>
      >();

      plugin
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .register(target[0].key!, target[0].handler)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .register(target[1].key!, target[1].handler);

      expect(plugin.invoke({})).toEqual({
        a: "a",
        b: "b",
      });
    });

    it("The global handler receive whole object combined by specify handler and it's return value will be the whole return value", () => {
      const target = [
        {
          key: "a",
          handler: () => "a",
        },
        {
          key: "b",
          handler: () => "b",
        },
        {
          handler: (partialResult?: Record<string, unknown>) => ({
            ...partialResult,
            c: "c",
          }),
        },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const plugin = new Plugin<Record<string, any>, Record<string, unknown>>();

      plugin
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .register(target[0].key!, target[0].handler)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .register(target[1].key!, target[1].handler)
        .register(target[2].handler);

      expect(plugin.invoke({})).toEqual({
        a: "a",
        b: "b",
        c: "c",
      });
    });
  });
});
