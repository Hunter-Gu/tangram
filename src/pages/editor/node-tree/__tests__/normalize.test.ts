import { SchemaData } from "@/core/parser/src/types/schema";
import { normalize } from "../normalize";

describe("normalize() of node-tree", () => {
  it("The `normalize()` used to transform schema to the prop data of node-tree", () => {
    const schema = {
      name: "div",
      __uuid: 0,
      children: [
        {
          name: { name: "ElInput" },
          __uuid: 1,
          props: { type: "primary" },
          children: [
            {
              name: { name: "ElButton" },
              __uuid: 2,
            },
          ],
        },
      ],
    } as unknown as SchemaData;

    expect(normalize(schema)).toEqual([
      {
        uuid: "root",
        label: "label",
        _meta: {
          name: "div",
          path: "",
        },
        children: [
          {
            uuid: "children.0",
            label: "ElInput",
            _meta: {
              name: { name: "ElInput" },
              path: "children.0",
            },
            children: [
              {
                uuid: "children.0.children.0",
                label: "ElButton",
                _meta: {
                  name: { name: "ElButton" },
                  path: "children.0.children.0",
                },
              },
            ],
          },
        ],
      },
    ]);
  });
});
