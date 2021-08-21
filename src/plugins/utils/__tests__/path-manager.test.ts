import { PathManager } from "../path-manager";

function mock() {
  const oldPropName = PathManager.ChildrenPropName;
  const oldSeperator = PathManager.Seperator;
  PathManager.ChildrenPropName = "test";
  PathManager.Seperator = "|";

  return () => {
    PathManager.ChildrenPropName = oldPropName;
    PathManager.Seperator = oldSeperator;
  };
}

describe("PathManager", () => {
  let clearMock = () => {};
  // ensure it use static filed, not string
  beforeEach(() => {
    clearMock = mock();
  });

  afterEach(clearMock);

  it("It will generate a path like {propName}.{index} by `concatIndex()`", () => {
    expect(PathManager.concatIndex(1)).toBe(
      `${PathManager.ChildrenPropName}${PathManager.Seperator}${1}`
    );
  });

  it("It will generate a path like {path1}.{path2}.{path3} by `concat()`", () => {
    expect(PathManager.concat("a", "b", "c")).toBe(
      `a${PathManager.Seperator}b${PathManager.Seperator}c`
    );
  });
});
