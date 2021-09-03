import { ref } from "@vue/runtime-dom";

export class HoverLayerManager {
  private currentHoverPath = "";

  isCurrentPath(path: string) {
    return path === this.currentHoverPath;
  }

  updatePath(path: string) {
    // leave, drop or dragover into current element's descendants
    if (path === "" || path.startsWith(this.currentHoverPath)) {
      this.currentHoverPath = path;
    }
  }
}

const _hoverLayerManager = ref(new HoverLayerManager()).value;

export const hoverLayerManager = {
  isCurrentPath: _hoverLayerManager.isCurrentPath.bind(_hoverLayerManager),
  updatePath: _hoverLayerManager.updatePath.bind(_hoverLayerManager),
};
