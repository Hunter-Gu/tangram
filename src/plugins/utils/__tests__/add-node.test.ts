import { Child } from "../../../core/parser/src/types/schema";
import { Operation } from "../../../pages/editor/block/types";
import { addNode } from "../add-node";
import { AddNodeParams } from "../types";

describe("AddNode", () => {
  it.each`
    type                | isAncestors | newPath
    ${Operation.Inside} | ${false}    | ${"path.children.1"}
    ${""}               | ${false}    | ${"path.children.1"}
    ${Operation.Bottom} | ${true}     | ${"parentPath.1"}
    ${Operation.Top}    | ${true}     | ${"path"}
  `(
    "it will add new node to position by type",
    ({ type, isAncestors, newPath }) => {
      const target = {
        children: [{}],
      } as unknown as AddNodeParams["target"];
      const ancestors: Child[] = [{}] as Child[];

      jest.spyOn(window.Date.prototype, "getTime").mockReturnValue(1);

      const expectNewPath = addNode({
        component: "",
        ancestors,
        target,
        type,
        path: "path",
        parentPath: "parentPath",
        index: 0,
      });

      expect(expectNewPath).toBe(newPath);

      if (isAncestors) {
        type === Operation.Top || type === Operation.Left
          ? expect(ancestors[0]).toEqual({
              name: "",
              __uuid: 1,
            })
          : expect(ancestors[1]).toEqual({
              name: "",
              __uuid: 1,
            });
      } else {
        expect(target).toEqual({
          children: [
            {},
            {
              name: "",
              __uuid: 1,
            },
          ],
        });
      }
    }
  );
});
