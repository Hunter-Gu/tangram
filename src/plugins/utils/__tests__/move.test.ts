import { getParentPathAndIndex, move } from "../move";

describe("move() and getParentPathAndIndex()", () => {
  it("should change position by move()", () => {
    const schema = [
      {
        name: "a",
      },
      {
        name: "b",
      },
      {
        name: "c",
      },
      {
        name: "d",
      },
      {
        name: "e",
      },
    ];

    move(
      {
        array: schema,
        index: 1,
      },
      {
        array: schema,
        index: 3,
      }
    );

    expect(schema).toEqual([
      {
        name: "a",
      },
      {
        name: "c",
      },
      {
        name: "d",
      },
      {
        name: "b",
      },
      {
        name: "e",
      },
    ]);
  });

  it("it will return parent path by getParentPathAndIndex()", () => {
    expect(getParentPathAndIndex("children.0.children.1.children.2")).toEqual({
      parentPath: "children.0.children.1.children",
      index: 2,
    });
  });
});
