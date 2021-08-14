import { Chain } from "../chain";
import { getOrder, traceExecuteOrder } from "../test-utils";

function getList(chain: Chain) {
  // @ts-ignore
  return chain.list;
}

describe("Util class Chain", () => {
  it("When add node by `add()`, the chain should behave like single-linked-list", () => {
    const chain = new Chain();

    expect(getList(chain)).toEqual({});

    chain.add("ref1", "name1", false);
    expect(getList(chain)).toEqual({
      next: {},
      data: {
        ref: "ref1",
        name: "name1",
        async: false,
      },
    });

    chain.add("ref2", "name2", true);
    expect(getList(chain)).toEqual({
      next: {
        next: {},
        data: {
          ref: "ref2",
          name: "name2",
          async: true,
        },
      },
      data: {
        ref: "ref1",
        name: "name1",
        async: false,
      },
    });

    chain.add("ref3", "name3", true);
    expect(getList(chain)).toEqual({
      next: {
        next: {
          data: {
            ref: "ref3",
            name: "name3",
            async: true,
          },
          next: {},
        },
        data: {
          ref: "ref2",
          name: "name2",
          async: true,
        },
      },
      data: {
        ref: "ref1",
        name: "name1",
        async: false,
      },
    });
  });

  it("When call `invoke()`, it will get instance by ref, and get function from instance by name, and execute by added sequence even marked by async or not", async () => {
    const name1 = () => {};
    const name2 = () => {};
    const name3 = () => {};
    const data = {
      ref1: {
        name1: traceExecuteOrder(name1),
      },
      ref2: {
        name2: traceExecuteOrder(name2),
      },
      ref3: {
        name3: traceExecuteOrder(name3),
      },
    };
    const getRef = (ref: string | number) => {
      // TODO fix type error
      // @ts-ignore
      return data[ref];
    };
    const chain = new Chain();

    chain.add("ref1", "name1", false);
    chain.add("ref2", "name2", true);
    chain.add("ref3", "name3", false);

    await chain.invoke(getRef);

    expect(getOrder(name1)).toBeLessThan(getOrder(name2));
    expect(getOrder(name2)).toBeLessThan(getOrder(name3));
  });
});
