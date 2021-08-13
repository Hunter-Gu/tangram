import { Chain } from "../utils/chain";

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
    // mock execute sequence
    let order = 0;
    const sequence = {
      name1: 0,
      name2: 0,
      name3: 0,
    };
    const data = {
      ref1: {
        name1() {
          order++;
          sequence.name1 = order;
        },
      },
      ref2: {
        name2() {
          return new Promise((resolve) => {
            setTimeout(() => {
              order++;
              sequence.name2 = order;
              resolve("");
            });
          });
        },
      },
      ref3: {
        name3() {
          order++;
          sequence.name3 = order;
        },
      },
    };
    const getRef = (ref: string) => {
      // TODO fix type error
      // @ts-ignore
      return data[ref];
    };
    const chain = new Chain();

    chain.add("ref1", "name1", false);
    chain.add("ref2", "name2", true);
    chain.add("ref3", "name3", false);

    await chain.invoke(getRef);

    expect(sequence.name1).toBeLessThan(sequence.name2);
    expect(sequence.name2).toBeLessThan(sequence.name3);
  });
});
