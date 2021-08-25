import Block from "../../block";
import { enhance, enhanceBlock } from "../enhance";

describe("enhance() of component Stage", () => {
  it("The enhanceBlock() will wrapper the node by component Block", () => {
    expect(
      enhanceBlock(
        {
          name: { name: "name" },
          __uuid: 1,
        },
        "path"
      )
    ).toEqual({
      name: Block,
      __uuid: 0,
      children: [
        {
          name: { name: "name" },
          __uuid: 1,
        },
      ],
      props: {
        name: "name",
        path: "path",
      },
    });
  });

  it("The enhance() will traverse the schema and return a new schema which enhanced by enhanceBlock()", () => {
    expect(
      enhance(
        {
          name: { name: "name1" },
          __uuid: 1,
          children: [
            {
              name: { name: "name2" },
              __uuid: 2,
              children: [
                {
                  name: { name: "name3" },
                  __uuid: 3,
                },
              ],
            },
            {
              name: { name: "name4" },
              __uuid: 4,
            },
          ],
        },
        ""
      )
    ).toEqual({
      name: { name: "name1" },
      __uuid: 1,
      children: [
        {
          name: Block,
          __uuid: 0,
          props: {
            path: "children.0",
            name: "name2",
          },
          children: [
            {
              name: { name: "name2" },
              __uuid: 2,
              children: [
                {
                  name: Block,
                  children: [
                    {
                      name: { name: "name3" },
                      __uuid: 3,
                      children: undefined,
                    },
                  ],
                  __uuid: 0,
                  props: {
                    path: "children.0.children.0",
                    name: "name3",
                  },
                },
              ],
            },
          ],
        },
        {
          name: Block,
          __uuid: 0,
          props: {
            path: "children.1",
            name: "name4",
          },
          children: [
            {
              name: { name: "name4" },
              __uuid: 4,
              children: undefined,
            },
          ],
        },
      ],
    });
  });
});
