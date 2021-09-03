<template>
  <div
    :class="statusClasses"
    ref="blockElm"
    @dragover="handleDragover"
    @dragleave="handleDragleave"
    @drop.stop="handleDropEnhance"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  onMounted,
  onUpdated,
  defineEmits,
  ref,
  computed,
} from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { AddParams, Operation } from "../types";
import { HotZone } from "../hot-zone";
import { debounce } from "lodash";
import { hoverLayerManager } from "./hover-layer-manager";

const dragFocus = ref(Operation.None);

const blockElm = ref<HTMLElement>(null as unknown as HTMLElement);

let hotZone: HotZone;

onMounted(() => {
  const rect = getBlockElmRect();
  hotZone = new HotZone(rect, rect);
});

onUpdated(() => {
  const rect = getBlockElmRect();
  hotZone.update(rect, rect);
});

function getBlockElmRect() {
  const elm: HTMLElement = blockElm.value;
  return elm.getBoundingClientRect();
}

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },

  path: {
    type: String as PropType<string>,
    required: true,
  },

  selectPaths: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const statusClasses = computed(() => {
  if (!hoverLayerManager.isCurrentPath(props.path)) {
    return "";
  }
  return {
    "drag-bound-top": dragFocus.value === Operation.Top,
    "drag-bound-right": dragFocus.value === Operation.Right,
    "drag-bound-bottom": dragFocus.value === Operation.Bottom,
    "drag-bound-left": dragFocus.value === Operation.Left,
    "drag-bound-inside": dragFocus.value === Operation.Inside,
  };
});

const emits = defineEmits({
  add: (arg: AddParams) => arg,
});

const handleDragover = debounce((e: DragEvent) => {
  const position = {
    x: e.clientX,
    y: e.clientY,
  };
  const operation = hotZone.calc(position);
  dragFocus.value = operation;

  if (hoverLayerManager.isCurrentPath(props.path)) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }

  hoverLayerManager.updatePath(props.path);
});

function handleDragleave() {
  dragFocus.value = Operation.None;
  hoverLayerManager.updatePath("");
}

function handleDropEnhance(evt: DragEvent) {
  dragFocus.value = Operation.None;

  // make sure clear hover status after dropping
  setTimeout(() => {
    hoverLayerManager.updatePath("");
  });
  emits("add", { evt, path: props.path } as AddParams);
}
</script>

<style scoped>
.drag-bound-top {
  border-top: 2px solid rgb(125, 239, 125);
}
.drag-bound-right {
  border-right: 2px solid rgb(125, 239, 125);
}

.drag-bound-bottom {
  border-bottom: 2px solid rgb(125, 239, 125);
}

.drag-bound-left {
  border-left: 2px solid rgb(125, 239, 125);
}

.drag-bound-inside {
  border: 2px solid rgb(125, 239, 125);
}
</style>
