<template>
  <select-wrapper
    v-bind="props"
    @clear-selects="clearSelect"
    @select="handleSelect"
  >
    <drop-wrapper v-bind="props" @add="handleAdd">
      <slot />
    </drop-wrapper>
  </select-wrapper>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import SelectWrapper from "./hoc/select.vue";
import DropWrapper from "./hoc/drop.vue";
import { AddParams, SelectParams } from "./types";

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

const emits = defineEmits({
  clearSelects: () => true,
  select: (arg: SelectParams) => arg,
  add: (arg: AddParams) => arg,
});

function clearSelect() {
  emits("clearSelects");
}

function handleSelect(arg: SelectParams) {
  emits("select", arg);
}

function handleAdd({ evt, path }: AddParams) {
  emits("add", { evt, path });
}
</script>

<style scoped>
.block {
  position: relative;
}

.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
