import { HoverLayerManager } from "../hover-layer-manager";

describe("HoverLayerManager", () => {
  it("isCurrent() can check if target path equals to currentHoverPath", () => {
    const hoverLayerManager = new HoverLayerManager();

    hoverLayerManager.updatePath("path");

    expect(hoverLayerManager.isCurrentPath("path")).toEqual(true);
  });

  it("it will check if the path is empty or path startWith currentPath when call updatePath()", () => {
    const hoverLayerManager = new HoverLayerManager();

    hoverLayerManager.updatePath("path");

    expect(hoverLayerManager.isCurrentPath("path")).toEqual(true);

    // won't update actually
    hoverLayerManager.updatePath("abc");
    expect(hoverLayerManager.isCurrentPath("path")).toEqual(true);

    // will update
    hoverLayerManager.updatePath("path.path");
    expect(hoverLayerManager.isCurrentPath("path.path")).toEqual(true);

    hoverLayerManager.updatePath("");
    expect(hoverLayerManager.isCurrentPath("")).toEqual(true);
  });
});
