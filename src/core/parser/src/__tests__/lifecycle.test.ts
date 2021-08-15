import { lifecycle } from "../lifecycle";
import { ParsedSchema } from "../types/schema";

describe("Parser lifecycle", () => {
  it("It is a dfs but The root instance will be created at last", () => {
    const schema: ParsedSchema = {
      __uuid: 0,
      name: "10",
      children: [
        {
          __uuid: 0,
          name: "3",
          children: [
            {
              __uuid: 0,
              name: "2",
              children: [
                {
                  __uuid: 0,
                  name: "1",
                },
              ],
            },
          ],
        },
        {
          __uuid: 0,
          name: "6",
          children: [
            {
              __uuid: 0,
              name: "5",
              children: [
                {
                  __uuid: 0,
                  name: "4",
                },
              ],
            },
          ],
        },
        {
          __uuid: 0,
          name: "9",
          children: [
            {
              __uuid: 0,
              name: "8",
              children: [
                {
                  __uuid: 0,
                  name: "7",
                },
              ],
            },
          ],
        },
      ],
    };
    const idOrder: string[] = [];

    lifecycle(schema, (node) => {
      idOrder.push(node.name as string);
    });

    expect(idOrder).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ]);
  });
});
